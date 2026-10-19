/* store.js — persistence for Max's Motion Test Prep.
 *
 * Two modes, chosen by window.QUIZ_CONFIG.dbUrl (config.js):
 *   local  (dbUrl empty): the whole progress blob lives in localStorage, exactly as before.
 *   cloud  (dbUrl set):   Firebase Realtime Database over its REST API (plain fetch, no SDK) is the
 *                         source of truth. localStorage holds only (a) the practice code remembered on
 *                         this device and (b) an outbox of writes that have not reached the server yet.
 *
 * Data layout in the database, all under /quiz/<code>:
 *   q/<questionId>        { seen, correct, lastSeen, streak, prevStreak, hist:[..<=5], updatedAt }
 *   missed/<questionId>   { right, at, day, since, flagged?, updatedAt }     (absent once cleared)
 *   meta                  { counter, rounds }
 * Question ids are encoded for use as keys (Firebase forbids . $ # [ ] /); today's ids pass through as is.
 *
 * Writes are tiny per-record PATCH / PUT / DELETE calls, so two devices only collide when they answer
 * the very same question. app.js owns the quiz rules; it calls commit(event, changes) after each change
 * and registers a replay function so an answer given before the first server read can be re-applied on
 * top of what the server holds.
 *
 * Every localStorage access is wrapped in try/catch; without localStorage the app still works, it just
 * cannot queue writes across a page reload.
 */
(function () {
  'use strict';

  const cfg = (window.QUIZ_CONFIG && typeof window.QUIZ_CONFIG === 'object') ? window.QUIZ_CONFIG : {};
  const DB = typeof cfg.dbUrl === 'string' ? cfg.dbUrl.trim().replace(/\/+$/, '') : '';
  const CLOUD = DB !== '';

  const KEY_LOCAL = 'maxMotionPrep.v1';            // local-only mode: whole progress blob (and the old pre-cloud blob)
  const KEY_CODE = 'maxMotionPrep.code';           // practice code remembered on this device
  const KEY_OUTBOX = 'maxMotionPrep.outbox.';      // + code: pending writes
  const KEY_MIGRATED = 'maxMotionPrep.migrated.';  // + code: old on-device progress already uploaded
  const CODE_RE = /^[a-z0-9-]{4,40}$/;
  const LOAD_TIMEOUT = 6000;
  const REQ_TIMEOUT = 12000;
  const BACKOFF = [2000, 5000, 15000, 30000];
  const REFRESH_MIN_GAP = 20000;
  const HIST_MAX = 5;

  /* ---------------- localStorage, never trusted ---------------- */
  let lsOK = true;
  const ls = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { lsOK = false; return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { lsOK = false; return false; } },
    del(k) { try { window.localStorage.removeItem(k); } catch (e) { lsOK = false; } },
  };
  function lsJson(k) {
    const raw = ls.get(k);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  /* ---------------- in-memory data (same shape the app has always used) ---------------- */
  const fresh = () => ({ v: 1, q: {}, missed: {}, counter: 0, rounds: 0 });
  let data = fresh();
  const listeners = { status: [], data: [] };
  const emit = (k, a) => listeners[k].slice().forEach((f) => { try { f(a); } catch (e) { console.error(e); } });

  /* ---------------- identity ---------------- */
  const validCode = (s) => typeof s === 'string' && CODE_RE.test(s);
  /** Whatever a person typed or pasted -> a candidate code (trimmed, lowercase, text after a # if they pasted the link). */
  function normCode(s) {
    let t = String(s === undefined || s === null ? '' : s).trim();
    const i = t.lastIndexOf('#');
    if (i >= 0) t = t.slice(i + 1);
    return t.trim().toLowerCase();
  }
  let code = null;
  function setHash(c) {
    try { window.history.replaceState(null, '', window.location.pathname + window.location.search + '#' + c); }
    catch (e) { try { window.location.hash = c; } catch (e2) { /* ignore */ } }
  }
  /** Hash code first (and remember it), then the remembered one. Returns a code or null (then ask). */
  function resolveCode() {
    if (!CLOUD) return null;
    const fromHash = normCode(window.location.hash.replace(/^#/, ''));
    if (validCode(fromHash)) { ls.set(KEY_CODE, fromHash); setHash(fromHash); return fromHash; }
    const saved = normCode(ls.get(KEY_CODE));
    if (validCode(saved)) { setHash(saved); return saved; }
    return null;
  }
  const hashCode = () => { const c = normCode(window.location.hash.replace(/^#/, '')); return validCode(c) ? c : null; };

  /* ---------------- key encoding (ids -> Firebase-safe keys) ---------------- */
  const enc = (id) => String(id).replace(/[^A-Za-z0-9_-]/g, (c) => '~' + c.codePointAt(0).toString(16) + '~');
  const dec = (k) => String(k).replace(/~([0-9a-f]+)~/g, (m, hx) => String.fromCodePoint(parseInt(hx, 16)));

  /* ---------------- local-only mode ---------------- */
  function readBlob(key) {
    const d = lsJson(key);
    if (d && d.v === 1 && d.q && typeof d.q === 'object' && d.missed && typeof d.missed === 'object') return Object.assign(fresh(), d);
    return null;
  }
  function openLocal() {
    data = readBlob(KEY_LOCAL) || fresh();
    return data;
  }
  function saveLocal() { ls.set(KEY_LOCAL, JSON.stringify(data)); }

  /* ---------------- cloud: outbox ----------------
   * entry = { t, ev, unbased, w: [ {m:'PATCH'|'PUT'|'DELETE', p:'q/x', b:{...}, t} ] }
   * unbased: made before this device had read the server, so w is rebuilt from ev once it has. */
  let outbox = [];
  let baseline = false;       // true once the server record has been read this session
  let failed = false;         // last network attempt failed
  let busy = false;           // a request is in flight
  let backoffIdx = 0;
  let timer = null;
  let lastFetch = 0;
  let replayFn = null;
  let gen = 0;                // bumped whenever the code changes, so late replies from the old code are ignored
  let chain = Promise.resolve();
  const serial = (fn) => { const p = chain.then(fn, fn); chain = p.catch(() => {}); return p; };

  const pendingCount = () => outbox.reduce((n, e) => n + e.w.length, 0);
  function saveOutbox() {
    if (!code) return;
    if (!outbox.length) ls.del(KEY_OUTBOX + code); else ls.set(KEY_OUTBOX + code, JSON.stringify(outbox));
  }
  function readOutbox() {
    const a = lsJson(KEY_OUTBOX + code);
    return Array.isArray(a) ? a.filter((e) => e && Array.isArray(e.w)) : [];
  }

  /* ---------------- cloud: status ---------------- */
  let lastStatus = '';
  function status() {
    if (!CLOUD) return 'local';
    if (!baseline || failed) return 'offline';
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'offline';
    return busy || pendingCount() > 0 ? 'saving' : 'saved';
  }
  function pushStatus() {
    const s = status();
    if (s !== lastStatus) { lastStatus = s; emit('status', s); }
  }

  /* ---------------- cloud: REST ---------------- */
  function url(path, q) {
    return DB + '/quiz/' + code + (path ? '/' + path : '') + '.json' + (q ? '?' + q : '');
  }
  async function request(method, path, body, timeoutMs) {
    const ctl = typeof AbortController === 'function' ? new AbortController() : null;
    const to = ctl ? setTimeout(() => ctl.abort(), timeoutMs || REQ_TIMEOUT) : null;
    try {
      const init = { method, cache: 'no-store', signal: ctl ? ctl.signal : undefined };
      if (body !== undefined) init.body = JSON.stringify(body);
      const res = await fetch(url(path, method === 'GET' ? '' : 'print=silent'), init);
      if (!res.ok) { const err = new Error('HTTP ' + res.status); err.status = res.status; throw err; }
      if (method === 'GET') return await res.json();
      return null;
    } finally { if (to) clearTimeout(to); }
  }

  /* ---------------- cloud: server record <-> in-memory data ---------------- */
  function normHist(h) {
    if (Array.isArray(h)) return h.filter((x) => typeof x === 'number');
    if (h && typeof h === 'object') return Object.keys(h).sort((a, b) => a - b).map((k) => h[k]).filter((x) => typeof x === 'number');
    return [];
  }
  function fromServer(val) {
    const d = fresh();
    if (!val || typeof val !== 'object') return d;
    const q = val.q && typeof val.q === 'object' ? val.q : {};
    Object.keys(q).forEach((k) => {
      const r = q[k];
      if (!r || typeof r !== 'object') return;
      d.q[dec(k)] = {
        seen: +r.seen || 0, correct: +r.correct || 0, lastSeen: +r.lastSeen || 0,
        streak: +r.streak || 0, prevStreak: +r.prevStreak || 0, hist: normHist(r.hist), updatedAt: +r.updatedAt || 0,
      };
    });
    const m = val.missed && typeof val.missed === 'object' ? val.missed : {};
    Object.keys(m).forEach((k) => {
      const r = m[k];
      if (!r || typeof r !== 'object') return;
      const o = { right: +r.right || 0, at: +r.at || 0, day: typeof r.day === 'string' ? r.day : '', since: +r.since || 0, updatedAt: +r.updatedAt || 0 };
      if (r.flagged) o.flagged = true;
      d.missed[dec(k)] = o;
    });
    const meta = val.meta && typeof val.meta === 'object' ? val.meta : {};
    d.rounds = +meta.rounds || 0;
    // counter only has to be ahead of every "at" stamp, so devices agree on how many answers separate two right ones
    d.counter = Math.max(+meta.counter || 0, ...Object.keys(d.missed).map((k) => d.missed[k].at));
    return d;
  }
  /** Order-independent fingerprint, to tell whether a refresh actually changed anything. */
  const sig = (d) => JSON.stringify(d, (k, v) => (v && typeof v === 'object' && !Array.isArray(v)
    ? Object.keys(v).sort().reduce((o, x) => { o[x] = v[x]; return o; }, {}) : v));
  const isEmptyServer = (val) => !val || typeof val !== 'object' || (!val.q && !val.missed);

  /** Turn app-level changes into writes. changes = { q:{id:rec}, missed:{id:rec|null}, counter?, rounds? } */
  function toWrites(ch, t) {
    const w = [];
    Object.keys(ch.q || {}).forEach((id) => {
      const r = ch.q[id];
      r.updatedAt = t;
      w.push({ m: 'PATCH', p: 'q/' + enc(id), b: { seen: r.seen, correct: r.correct, lastSeen: r.lastSeen, streak: r.streak, prevStreak: r.prevStreak || 0, hist: r.hist.slice(), updatedAt: t }, t });
    });
    Object.keys(ch.missed || {}).forEach((id) => {
      const r = ch.missed[id];
      if (r === null) w.push({ m: 'DELETE', p: 'missed/' + enc(id), t });
      else {
        r.updatedAt = t;
        const b = { right: r.right, at: r.at, day: r.day, since: r.since, updatedAt: t };
        if (r.flagged) b.flagged = true;
        w.push({ m: 'PUT', p: 'missed/' + enc(id), b, t });
      }
    });
    const meta = {};
    if (ch.counter !== undefined) meta.counter = ch.counter;
    if (ch.rounds !== undefined) meta.rounds = ch.rounds;
    if (Object.keys(meta).length) w.push({ m: 'PATCH', p: 'meta', b: meta, t });
    return w;
  }

  /** Apply one pending write to a data object. Returns false if the server already holds something newer. */
  function applyWrite(d, w) {
    const parts = w.p.split('/');
    if (w.p === '') { Object.assign(d, fresh()); return true; }
    if (parts[0] === 'q') {
      const id = dec(parts[1]), cur = d.q[id];
      if (cur && cur.updatedAt > w.t) return false;
      d.q[id] = Object.assign({}, w.b, { hist: normHist(w.b.hist) });
    } else if (parts[0] === 'missed') {
      const id = dec(parts[1]), cur = d.missed[id];
      if (cur && cur.updatedAt > w.t) return false;
      if (w.m === 'DELETE') delete d.missed[id]; else d.missed[id] = Object.assign({}, w.b);
    } else if (parts[0] === 'meta') {
      if (w.b.counter !== undefined) d.counter = Math.max(d.counter, w.b.counter);
      if (w.b.rounds !== undefined) d.rounds = Math.max(d.rounds, w.b.rounds);
    }
    return true;
  }

  /** Server snapshot + everything still waiting in the outbox = what this device should show. */
  function buildView(val, mutate) {
    const d = fromServer(val);
    const prev = data;
    data = d; // replay reads the live data object, so point it at the new one while rebuilding
    try {
      const keep = [];
      outbox.forEach((e) => {
        if (e.unbased) {
          if (replayFn && e.ev) {
            const ch = replayFn(e.ev, d);
            if (mutate) { e.w = toWrites(ch, e.t); e.unbased = false; }
            else toWrites(ch, e.t);
          }
          keep.push(e);
        } else {
          const w = e.w.filter((x) => applyWrite(d, x));
          if (mutate) e.w = w;
          if (w.length || !mutate) keep.push(e);
        }
      });
      if (mutate) outbox = keep.filter((e) => e.w.length || e.unbased);
    } catch (err) {
      console.error('merge failed', err);
      data = prev;
      throw err;
    }
    return d;
  }

  /* ---------------- cloud: sync ---------------- */
  async function fetchBaseline(timeoutMs) {
    const g = gen;
    const val = await request('GET', '', undefined, timeoutMs);
    if (g !== gen) throw new Error('stale');
    const before = sig(data);
    data = buildView(val, true);
    baseline = true;
    lastFetch = Date.now();
    saveOutbox();
    await maybeMigrate(val);
    return sig(data) !== before;
  }

  /** One-time: progress saved in this browser before the cloud existed goes up if the server record is empty. */
  async function maybeMigrate(val) {
    if (ls.get(KEY_MIGRATED + code)) return;
    const old = readBlob(KEY_LOCAL);
    if (!old) return;
    if (!isEmptyServer(val) || outbox.length) { ls.set(KEY_MIGRATED + code, '1'); return; }
    const t = Date.now();
    const ch = { q: {}, missed: {}, counter: old.counter, rounds: old.rounds };
    Object.keys(old.q).forEach((id) => { ch.q[id] = Object.assign({ prevStreak: 0, hist: [] }, old.q[id]); });
    Object.keys(old.missed).forEach((id) => { ch.missed[id] = Object.assign({}, old.missed[id]); });
    const w = toWrites(ch, t);
    w.forEach((x) => { applyWrite(data, x); });
    if (w.length) outbox.push({ t, ev: null, unbased: false, w });
    saveOutbox();
    ls.set(KEY_MIGRATED + code, '1');
  }

  async function flushOutbox() {
    const g = gen;
    while (outbox.length) {
      const e = outbox[0];
      if (e.unbased) return; // cannot send until rebuilt on top of the server record
      while (g === gen && outbox[0] === e && e.w.length) {
        const w = e.w[0];
        busy = true; pushStatus();
        try {
          await request(w.m, w.p, w.b);
        } catch (err) {
          busy = false;
          if (g !== gen) throw new Error('stale');
          if (err && err.status === 400) { if (outbox[0] === e) { e.w.shift(); saveOutbox(); } continue; } // can never succeed: drop it
          throw err;
        }
        busy = false;
        if (g !== gen) throw new Error('stale');
        if (outbox[0] === e) e.w.shift();   // (a reset can replace the outbox while a request is in flight)
        failed = false;
        saveOutbox();
        pushStatus();
      }
      if (g !== gen) throw new Error('stale');
      if (outbox[0] === e && !e.w.length) { outbox.shift(); saveOutbox(); }
      else if (outbox[0] === e) return;
    }
  }

  /** Read (when needed) and flush. Resolves true when the device is fully in step with the server. */
  function sync(opts) {
    opts = opts || {};
    return serial(async () => {
      if (!CLOUD || !code) return false;
      const g = gen;
      let changed = false, reading = false;
      try {
        if (baseline) await flushOutbox();
        if (!baseline || opts.refetch) { reading = true; changed = await fetchBaseline(opts.timeout); reading = false; }
        await flushOutbox();
        failed = false; backoffIdx = 0;
        if (timer) { clearTimeout(timer); timer = null; }
      } catch (err) {
        if (g !== gen) return false;
        busy = false;
        // a background refresh that cannot reach the server is not news while nothing is waiting to be saved
        if (reading && baseline && !pendingCount()) return false;
        failed = true;
        pushStatus();
        scheduleRetry();
        return false;
      }
      busy = false;
      pushStatus();
      if (changed && g === gen) emit('data');
      return true;
    });
  }
  function scheduleRetry() {
    if (timer) return;
    const ms = BACKOFF[Math.min(backoffIdx, BACKOFF.length - 1)];
    backoffIdx++;
    timer = setTimeout(() => { timer = null; sync({ refetch: !baseline }); }, ms);
  }
  function kick() {
    if (!CLOUD || !code) return;
    pushStatus();
    if (!failed && !timer) sync();
  }

  /* ---------------- cloud: public operations ---------------- */
  /** Select a practice code, read its record (time limited), carry on offline if that fails. */
  async function open(c, o) {
    code = c;
    gen++;
    ls.set(KEY_CODE, c);
    if (timer) { clearTimeout(timer); timer = null; }
    data = fresh(); baseline = false; failed = false; busy = false; backoffIdx = 0; lastFetch = 0; lastStatus = '';
    outbox = readOutbox();
    // what this device already queued, shown even if the server cannot be reached
    data = buildView(null, false);
    let online = true;
    const ok = await serial(async () => {
      try { await fetchBaseline((o && o.timeout) || LOAD_TIMEOUT); return true; }
      catch (err) { if (c === code) failed = true; return false; }
    });
    if (!ok) { online = false; scheduleRetry(); }
    pushStatus();
    if (online) sync();     // flush whatever was queued, in the background
    return { online };
  }

  /** Call when about to show the home screen again: pick up what other devices did (throttled). */
  function refresh(o) {
    if (!CLOUD || !code || !baseline) return;
    if (Date.now() - lastFetch < ((o && o.minGap) === undefined ? REFRESH_MIN_GAP : o.minGap)) return;
    if (failed) return;
    sync({ refetch: true });
  }

  /** Record a change. data is already updated in memory by the caller; this persists it. */
  function commit(ev, changes) {
    if (!CLOUD) { saveLocal(); return; }
    const t = (ev && ev.t) || Date.now();
    const entry = { t, ev: ev || null, unbased: !baseline, w: toWrites(changes || {}, t) };
    outbox.push(entry);
    saveOutbox();
    kick();
  }

  /** Erase this code's record on the server (and everything queued). Local mode: clear the blob. */
  function reset() {
    data = fresh();
    if (!CLOUD) { ls.del(KEY_LOCAL); return Promise.resolve(); }
    ls.del(KEY_LOCAL);
    outbox = [{ t: Date.now(), ev: null, unbased: false, w: [{ m: 'DELETE', p: '', t: Date.now() }] }];
    saveOutbox();
    if (timer) { clearTimeout(timer); timer = null; }
    failed = false; backoffIdx = 0;
    pushStatus();
    return sync();
  }

  /** Leave the current code: try to get pending writes out first (briefly), then forget it. */
  async function leave(maxMs) {
    if (CLOUD && code && pendingCount() && !failed) {
      await Promise.race([sync(), new Promise((r) => setTimeout(r, maxMs || 2500))]);
    }
    if (timer) { clearTimeout(timer); timer = null; }
    ls.del(KEY_CODE);
    gen++;
    code = null; data = fresh(); outbox = []; baseline = false; failed = false; busy = false; lastStatus = '';
  }

  if (CLOUD && typeof window.addEventListener === 'function') {
    window.addEventListener('online', () => {
      if (!code) return;
      if (timer) { clearTimeout(timer); timer = null; }
      backoffIdx = 0; failed = false;
      pushStatus();
      sync({ refetch: !baseline });
    });
    window.addEventListener('offline', pushStatus);
    document.addEventListener('visibilitychange', () => {
      if (!code) return;
      if (document.visibilityState === 'hidden') { if (pendingCount() && !failed) sync(); return; }
      if (failed) { if (timer) { clearTimeout(timer); timer = null; } sync({ refetch: !baseline }); } else refresh();
    });
  }

  window.QuizStore = {
    cloud: CLOUD,
    validCode, normCode, resolveCode, hashCode, setHash,
    currentCode: () => code,
    setReplay(fn) { replayFn = fn; },
    openLocal, open, refresh, commit, reset, leave,
    data: () => data,
    status,
    onStatus(f) { listeners.status.push(f); },
    onData(f) { listeners.data.push(f); },
    isPersistent: () => lsOK,
    flushNow: () => sync(),
    _debug: () => ({ code, baseline, failed, outbox: outbox.length, pending: pendingCount() }),
  };
})();
