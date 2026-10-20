/* store.js — persistence for Max's F/D/P Test Prep (design ported from Max's Motion Test Prep).
 *
 * Three modes, chosen by window.FDP_CONFIG (config.js):
 *   local    (backend ''): the whole progress blob lives in localStorage.
 *   jsonblob (backend 'jsonblob'): a no-account JSON document store (POST/GET/PUT {base}/api/jsonBlob[/id]).
 *            The practice code IS the blob id. See the jsonblob section at the end of this file.
 *   supabase (backend 'supabase', or url + key set): Supabase over its REST API (PostgREST, plain fetch, no SDK).
 *   claudedb (backend 'claudedb'): a claude.ai Artifact's `db` capability (artifact/index.html). One shared
 *            document `progress/max` plus an append-only `events` collection. See the section at the end.
 *       Identity is a "practice code" (no login): it sits in the URL hash and is remembered on the device.
 *       localStorage holds the code, a cache of the last known progress (so the app opens offline), and an
 *       outbox of writes that have not reached the server yet.
 *
 * Tables (see supabase/schema.sql):
 *   fdp_progress(code pk, data jsonb, updated_at)   one row per practice code: the progress blob
 *   fdp_events(id, code, at, kind, payload jsonb)    append-only log of answers, for the parent view
 * Every request carries the header x-practice-code; the RLS policies only show rows with that code.
 *
 * The blob is built from small records that each carry their own timestamp `t`, so two devices (the
 * Chromebook and a phone in the car) merge record by record instead of overwriting each other:
 * before every upsert the device reads the server row and merges (newer record wins; logs are unioned).
 *
 * Every localStorage access is wrapped in try/catch; without it the app still works for the session.
 */
(function () {
  'use strict';

  const cfg = (window.FDP_CONFIG && typeof window.FDP_CONFIG === 'object') ? window.FDP_CONFIG : {};
  const URL0 = typeof cfg.supabaseUrl === 'string' ? cfg.supabaseUrl.trim().replace(/\/+$/, '') : '';
  const KEY = typeof cfg.supabaseAnonKey === 'string' ? cfg.supabaseAnonKey.trim() : '';
  const BACKEND = cfg.backend === 'claudedb' ? 'claudedb' : cfg.backend === 'jsonblob' ? 'jsonblob' : (cfg.backend === 'supabase' || (!cfg.backend && URL0 && KEY)) && URL0 && KEY ? 'supabase' : '';
  const CLOUD = BACKEND === 'supabase';

  const KEY_LOCAL = 'maxFdpPrep.v1';                // local-only mode: whole progress blob
  const KEY_CODE = 'maxFdpPrep.code';               // practice code remembered on this device
  const KEY_CACHE = 'maxFdpPrep.cache.';            // + code: last known merged progress
  const KEY_OUTBOX = 'maxFdpPrep.outbox.';          // + code: { dirty, events: [] }
  const KEY_DEVICE = 'maxFdpPrep.device';
  const KEY_MIGRATED = 'maxFdpPrep.migrated.';     // + code: on-device (local-only) progress already folded in
  const CODE_RE = /^[a-z0-9-]{4,64}$/;
  const LOAD_TIMEOUT = 6000, REQ_TIMEOUT = 12000;
  const BACKOFF = [2000, 5000, 15000, 30000];
  const DEBOUNCE = 1200;
  const REFRESH_MIN_GAP = 20000;

  /* ---------------- localStorage, never trusted ---------------- */
  let lsOK = true;
  const ls = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { lsOK = false; return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { lsOK = false; return false; } },
    del(k) { try { window.localStorage.removeItem(k); } catch (e) { lsOK = false; } },
  };
  function lsJson(k) { const raw = ls.get(k); if (!raw) return null; try { return JSON.parse(raw); } catch (e) { return null; } }

  let deviceId = ls.get(KEY_DEVICE);
  if (!deviceId || !/^[a-z0-9]{6,20}$/.test(deviceId)) { deviceId = Math.random().toString(36).slice(2, 10); ls.set(KEY_DEVICE, deviceId); }

  /* ---------------- the progress blob ---------------- */
  const fresh = () => ({
    v: 1, created: Date.now(), resetAt: 0,
    time: {},          // { deviceId: activeMs }
    diag: null,        // { t, startedAt, idx, done, doneAt, ans: { itemId: {ok, ms, given, misc, form} } }
    hist: {},          // { skill: [ [t, score 0..1, src], ... ] }
    miscLog: {},       // { miscId: [t, ...] }
    items: {},         // { itemId: { t, seen, ok, lastOk } }
    lessons: {},       // { lessonId: { t, done } }
    plan: null,        // { t, path:[skill], breakAt, breakDone, mixedDone, nightDone, morningDone }
    mockA: null,       // { t, timer, startedAt, endsAt, idx, ans:{}, done, doneAt, score, max, results }
    mockB: null,
    recent: [],        // misses: [{ t, item, skill, given, misc, mode }]  (last 40)
    runs: {},          // { kind: { t, n, ok } } counts of car rides, mixed sets, morning sessions
    mastery: {},       // conversion mastery: { skill: { t, streak, l3, best, mastered } }
    cdiag: null,       // conversion check-in: { t, items:[ids], idx, ans, done }
    speed: null,       // speed rounds: { t, history: [{ at, ms, score, of }], cur: { items, ans, startedAt } }
    gauntlet: null,    // { t, history: [{ at, misses, cleared, ms }], cur }
    section: null,     // 9-question section tests, same shape as speed
    conv: null,        // { t, sinceRecheck, expertAt }
  });
  let data = fresh();
  const listeners = { status: [], data: [], code: [] };
  const emit = (k, a) => listeners[k].slice().forEach((f) => { try { f(a); } catch (e) { console.error(e); } });

  function normalize(d) {
    const f = fresh();
    if (!d || typeof d !== 'object') return f;
    const o = Object.assign(f, d);
    ['time', 'hist', 'miscLog', 'items', 'lessons', 'runs', 'mastery'].forEach((k) => { if (!o[k] || typeof o[k] !== 'object' || Array.isArray(o[k])) o[k] = {}; });
    if (!Array.isArray(o.recent)) o.recent = [];
    return o;
  }

  /** Merge two blobs record by record. Records older than the latest reset are dropped. */
  function merge(a, b) {
    a = normalize(a); b = normalize(b);
    const R = Math.max(+a.resetAt || 0, +b.resetAt || 0);
    const live = (t) => (+t || 0) >= R;
    const out = fresh();
    out.resetAt = R;
    out.created = Math.min(+a.created || Date.now(), +b.created || Date.now());
    if (out.created < R) out.created = R;
    // time: per device, keep the larger total (each device only ever adds to its own)
    if (R === (+a.resetAt || 0) && R === (+b.resetAt || 0)) {
      new Set([...Object.keys(a.time), ...Object.keys(b.time)]).forEach((k) => { out.time[k] = Math.max(+a.time[k] || 0, +b.time[k] || 0); });
    } else {
      const newer = (+a.resetAt || 0) >= (+b.resetAt || 0) ? a : b;
      out.time = Object.assign({}, newer.time);
    }
    const newerRec = (x, y) => { const xl = x && live(x.t), yl = y && live(y.t); if (!xl) return yl ? y : null; if (!yl) return x; return (+y.t || 0) > (+x.t || 0) ? y : x; };
    ['diag', 'plan', 'mockA', 'mockB', 'morning', 'cdiag', 'speed', 'gauntlet', 'section', 'conv'].forEach((k) => { out[k] = newerRec(a[k], b[k]); });
    ['items', 'lessons', 'runs', 'mastery'].forEach((k) => {
      new Set([...Object.keys(a[k]), ...Object.keys(b[k])]).forEach((id) => { const r = newerRec(a[k][id], b[k][id]); if (r) out[k][id] = r; });
    });
    new Set([...Object.keys(a.hist), ...Object.keys(b.hist)]).forEach((sk) => {
      const seen = new Map();
      [].concat(a.hist[sk] || [], b.hist[sk] || []).forEach((e) => { if (Array.isArray(e) && live(e[0])) seen.set(e[0] + '|' + e[2], e); });
      const arr = Array.from(seen.values()).sort((x, y) => x[0] - y[0]).slice(-30);
      if (arr.length) out.hist[sk] = arr;
    });
    new Set([...Object.keys(a.miscLog), ...Object.keys(b.miscLog)]).forEach((m) => {
      const arr = Array.from(new Set([].concat(a.miscLog[m] || [], b.miscLog[m] || []).filter(live))).sort((x, y) => x - y).slice(-30);
      if (arr.length) out.miscLog[m] = arr;
    });
    const rs = new Map();
    [].concat(a.recent, b.recent).forEach((r) => { if (r && live(r.t)) rs.set(r.t + '|' + r.item, r); });
    out.recent = Array.from(rs.values()).sort((x, y) => x.t - y.t).slice(-40);
    return out;
  }
  const sig = (d) => JSON.stringify(d, (k, v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.keys(v).sort().reduce((o, x) => { o[x] = v[x]; return o; }, {}) : v));

  /* ---------------- identity ---------------- */
  const validCode = (s) => typeof s === 'string' && CODE_RE.test(s);
  function normCode(s) {
    let t = String(s === undefined || s === null ? '' : s).trim();
    const i = t.lastIndexOf('#');
    if (i >= 0) t = t.slice(i + 1);
    return t.trim().toLowerCase().replace(/\s+/g, '-');
  }
  let code = null;
  function setHash(c) {
    try { window.history.replaceState(null, '', window.location.pathname + window.location.search + '#' + c); }
    catch (e) { try { window.location.hash = c; } catch (e2) { /* ignore */ } }
  }
  const hashCode = () => { const c = normCode(window.location.hash.replace(/^#/, '')); return validCode(c) ? c : null; };
  function resolveCode() {
    if (!CLOUD) return null;
    const h = hashCode();
    if (h) { ls.set(KEY_CODE, h); return h; }
    const saved = normCode(ls.get(KEY_CODE));
    if (validCode(saved)) { setHash(saved); return saved; }
    return null;
  }
  /** A fresh, hard-to-guess code like "max-otter-4821". */
  function suggestCode() {
    const words = ['otter', 'comet', 'maple', 'falcon', 'harbor', 'cedar', 'pixel', 'tiger', 'bison', 'quartz', 'raven', 'summit'];
    const r = (n) => Math.floor(Math.random() * n);
    return 'max-' + words[r(words.length)] + '-' + (1000 + r(9000));
  }

  /* ---------------- local-only mode ---------------- */
  function openLocal() { data = normalize(lsJson(KEY_LOCAL)); return data; }
  function saveLocal() { ls.set(KEY_LOCAL, JSON.stringify(data)); }

  /* ---------------- cloud: REST ---------------- */
  function headers(extra) {
    return Object.assign({ apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', 'x-practice-code': code || '' }, extra || {});
  }
  async function request(method, path, body, prefer, timeoutMs) {
    const ctl = typeof AbortController === 'function' ? new AbortController() : null;
    const to = ctl ? setTimeout(() => ctl.abort(), timeoutMs || REQ_TIMEOUT) : null;
    try {
      const init = { method, cache: 'no-store', headers: headers(prefer ? { Prefer: prefer } : null), signal: ctl ? ctl.signal : undefined };
      if (body !== undefined) init.body = JSON.stringify(body);
      const res = await fetch(URL0 + '/rest/v1/' + path, init);
      if (!res.ok) { const err = new Error('HTTP ' + res.status); err.status = res.status; throw err; }
      if (method === 'GET') return await res.json();
      return null;
    } finally { if (to) clearTimeout(to); }
  }
  const getRow = (timeout) => request('GET', 'fdp_progress?select=data,updated_at&code=eq.' + encodeURIComponent(code), undefined, null, timeout)
    .then((rows) => (Array.isArray(rows) && rows[0] ? rows[0].data : null));
  const putRow = (d) => request('POST', 'fdp_progress?on_conflict=code', { code, data: d, updated_at: new Date().toISOString() }, 'resolution=merge-duplicates,return=minimal');
  const putEvents = (rows) => request('POST', 'fdp_events', rows, 'return=minimal');

  /* ---------------- cloud: outbox ---------------- */
  let outbox = { dirty: 0, events: [] };
  let baseline = false, failed = false, busy = false, backoffIdx = 0, timer = null, debounce = null, lastFetch = 0, gen = 0;
  let chain = Promise.resolve();
  const serial = (fn) => { const p = chain.then(fn, fn); chain = p.catch(() => {}); return p; };
  const pendingCount = () => (outbox.dirty ? 1 : 0) + outbox.events.length;
  function saveOutbox() { if (!code) return; if (!pendingCount()) ls.del(KEY_OUTBOX + code); else ls.set(KEY_OUTBOX + code, JSON.stringify(outbox)); }
  function readOutbox() { const o = lsJson(KEY_OUTBOX + code); return o && typeof o === 'object' ? { dirty: +o.dirty || 0, events: Array.isArray(o.events) ? o.events : [] } : { dirty: 0, events: [] }; }
  function saveCache() { if (code) ls.set(KEY_CACHE + code, JSON.stringify(data)); }

  let lastStatus = '';
  function status() {
    if (!CLOUD) return 'local';
    if (!baseline || failed) return 'offline';
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'offline';
    return busy || pendingCount() > 0 ? 'saving' : 'saved';
  }
  function pushStatus() { const s = status(); if (s !== lastStatus) { lastStatus = s; emit('status', s); } }

  /** Read the server row and fold it into what this device has. Returns true if what we show changed. */
  async function pull(timeout) {
    const g = gen;
    const remote = await getRow(timeout);
    if (g !== gen) throw new Error('stale');
    const before = sig(data);
    const merged = remote ? merge(data, remote) : normalize(data);
    data = merged;
    baseline = true;
    lastFetch = Date.now();
    if (!remote || sig(merge(remote, {})) !== sig(merged)) { if (!outbox.dirty) outbox.dirty = 1; }
    saveCache(); saveOutbox();
    return sig(data) !== before;
  }

  async function flush() {
    const g = gen;
    if (outbox.dirty) {
      const mark = outbox.dirty;
      busy = true; pushStatus();
      // read-merge-write so another device's answers are never overwritten
      if (Date.now() - lastFetch > 3000) await pull();
      if (g !== gen) throw new Error('stale');
      await putRow(data);
      if (g !== gen) throw new Error('stale');
      if (outbox.dirty === mark) outbox.dirty = 0;
      saveOutbox();
    }
    while (outbox.events.length) {
      const batch = outbox.events.slice(0, 50);
      busy = true; pushStatus();
      try { await putEvents(batch); }
      catch (err) { if (err && err.status >= 400 && err.status < 500 && err.status !== 401 && err.status !== 403 && err.status !== 408 && err.status !== 429) { outbox.events.splice(0, batch.length); saveOutbox(); continue; } throw err; }
      if (g !== gen) throw new Error('stale');
      outbox.events.splice(0, batch.length);
      saveOutbox();
    }
    busy = false;
  }

  function sync(opts) {
    opts = opts || {};
    return serial(async () => {
      if (!CLOUD || !code) return false;
      const g = gen;
      let changed = false;
      try {
        if (!baseline || opts.refetch) changed = await pull(opts.timeout);
        await flush();
        failed = false; backoffIdx = 0;
        if (timer) { clearTimeout(timer); timer = null; }
      } catch (err) {
        if (g !== gen) return false;
        busy = false;
        if (opts.refetch && baseline && !pendingCount()) return false;
        failed = true; pushStatus(); scheduleRetry();
        return false;
      }
      busy = false; pushStatus();
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
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => { debounce = null; if (!failed && !timer) sync(); }, DEBOUNCE);
  }

  /* ---------------- public ---------------- */
  async function open(c, o) {
    code = c; gen++;
    ls.set(KEY_CODE, c);
    if (timer) { clearTimeout(timer); timer = null; }
    baseline = false; failed = false; busy = false; backoffIdx = 0; lastFetch = 0; lastStatus = '';
    outbox = readOutbox();
    data = normalize(lsJson(KEY_CACHE + c));
    const ok = await serial(async () => {
      try { await pull((o && o.timeout) || LOAD_TIMEOUT); return true; } catch (err) { if (c === code) failed = true; return false; }
    });
    // One time per code: progress made in local-only mode (before the database existed) is folded in and uploaded.
    if (!ls.get(KEY_MIGRATED + c)) {
      const old = lsJson(KEY_LOCAL);
      if (old && typeof old === 'object' && (old.diag || Object.keys(old.hist || {}).length || old.mockA)) {
        data = merge(data, old);
        outbox.dirty = (outbox.dirty || 0) + 1;
        outbox.events.push({ code: c, kind: 'migrated', payload: { from: 'this device' }, at: new Date().toISOString() });
        saveCache(); saveOutbox();
      }
      ls.set(KEY_MIGRATED + c, '1');
    }
    if (!ok) scheduleRetry();
    pushStatus();
    if (pendingCount()) { if (ok) sync(); }
    return { online: ok };
  }
  function refresh() {
    if (!CLOUD || !code || !baseline || failed) return;
    if (Date.now() - lastFetch < REFRESH_MIN_GAP) return;
    sync({ refetch: true });
  }
  /** The caller already changed data in memory (records stamped with t). events: [{kind, payload}] */
  function commit(events) {
    if (!CLOUD) { saveLocal(); return; }
    outbox.dirty = (outbox.dirty || 0) + 1;
    (events || []).forEach((e) => outbox.events.push({ code, kind: e.kind, payload: e.payload, at: new Date(e.t || Date.now()).toISOString() }));
    saveCache(); saveOutbox(); kick();
  }
  function reset() {
    const t = Date.now();
    data = fresh(); data.resetAt = t; data.created = t;
    if (!CLOUD) { saveLocal(); return Promise.resolve(); }
    outbox = { dirty: 1, events: [{ code, kind: 'reset', payload: {}, at: new Date(t).toISOString() }] };
    lastFetch = 0;
    saveCache(); saveOutbox(); pushStatus();
    if (timer) { clearTimeout(timer); timer = null; }
    failed = false; backoffIdx = 0;
    return sync();
  }
  async function leave(maxMs) {
    if (CLOUD && code && pendingCount() && !failed) await Promise.race([sync(), new Promise((r) => setTimeout(r, maxMs || 2500))]);
    if (timer) { clearTimeout(timer); timer = null; }
    ls.del(KEY_CODE);
    gen++;
    code = null; data = fresh(); outbox = { dirty: 0, events: [] }; baseline = false; failed = false; busy = false; lastStatus = '';
  }
  /** Read-only fetch for the parent view. */
  async function readForParent(c) {
    if (!CLOUD) return { data: openLocal(), events: [] };
    code = c;
    const [row, events] = await Promise.all([
      getRow(),
      request('GET', 'fdp_events?select=at,kind,payload&code=eq.' + encodeURIComponent(c) + '&order=at.desc&limit=300').catch(() => []),
    ]);
    return { data: normalize(row), events: Array.isArray(events) ? events : [] };
  }

  if (CLOUD && typeof window.addEventListener === 'function') {
    window.addEventListener('online', () => { if (!code) return; if (timer) { clearTimeout(timer); timer = null; } backoffIdx = 0; failed = false; pushStatus(); sync({ refetch: !baseline }); });
    window.addEventListener('offline', pushStatus);
    document.addEventListener('visibilitychange', () => {
      if (!code) return;
      if (document.visibilityState === 'hidden') { if (pendingCount() && !failed) sync(); return; }
      if (failed) { if (timer) { clearTimeout(timer); timer = null; } sync({ refetch: !baseline }); } else refresh();
    });
  }

  /* =====================================================================
   * jsonblob backend
   *   POST {base}/api/jsonBlob        -> 201, Location: .../api/jsonBlob/<id>  (also X-jsonblob-id)
   *   GET  {base}/api/jsonBlob/<id>   -> the document
   *   PUT  {base}/api/jsonBlob/<id>   -> replace the document
   * Document: { v: 1, app: 'max-fdp', progress: <blob>, events: [{ id, at, kind, payload }] (last 3000) }
   * localStorage keeps a full mirror (progress + events) and a dirty flag, so nothing is lost when the
   * network or the service fails. Every failure is soft: retried with backoff, on each load, when the tab
   * becomes visible again, and when the browser comes back online. The UI never waits for the network.
   * ===================================================================== */
  if (BACKEND === 'jsonblob') {
    const BASE = (typeof cfg.jsonblobBase === 'string' && cfg.jsonblobBase.trim() ? cfg.jsonblobBase.trim() : 'https://jsonblob.com').replace(/\/+$/, '');
    const EP = BASE + '/api/jsonBlob';
    const KEY_EVENTS = 'maxFdpPrep.events.';        // + code or 'local': event mirror
    const KEY_DIRTY = 'maxFdpPrep.dirty.';           // + code or 'local'
    const EV_MAX = 3000, JB_DEBOUNCE = 3000, JB_BACKOFF = [3000, 10000, 30000, 60000];
    let events = [];
    let jbReason = '';
    let dirty = 0, jbFailed = false, jbBusy = false, jbTimer = null, jbDebounce = null, jbBackoff = 0, lastFetchJ = 0, lastSaved = 0, jbGen = 0;
    const slot = () => code || 'local';
    const saveMirror = () => {
      if (code) ls.set(KEY_CACHE + code, JSON.stringify(data)); else ls.set(KEY_LOCAL, JSON.stringify(data));
      ls.set(KEY_EVENTS + slot(), JSON.stringify(events));
      if (dirty) ls.set(KEY_DIRTY + slot(), String(dirty)); else ls.del(KEY_DIRTY + slot());
    };
    const loadMirror = () => {
      data = normalize(lsJson(code ? KEY_CACHE + code : KEY_LOCAL));
      const ev = lsJson(KEY_EVENTS + slot());
      events = Array.isArray(ev) ? ev : [];
      dirty = +(ls.get(KEY_DIRTY + slot()) || 0);
    };
    const mergeEvents = (a, b) => {
      const m = new Map();
      [].concat(a || [], b || []).forEach((e) => { if (e && e.id) m.set(e.id, e); });
      return Array.from(m.values()).sort((x, y) => String(x.at).localeCompare(String(y.at))).slice(-EV_MAX);
    };
    const doc = () => ({ v: 1, app: 'max-fdp', updatedAt: new Date().toISOString(), progress: data, events });
    async function jfetch(method, url, body, opts) {
      const ctl = typeof AbortController === 'function' ? new AbortController() : null;
      const to = ctl ? setTimeout(() => ctl.abort(), (opts && opts.timeout) || REQ_TIMEOUT) : null;
      try {
        const init = { method, cache: 'no-store', headers: { Accept: 'application/json' }, signal: ctl ? ctl.signal : undefined };
        if (body !== undefined) { init.body = JSON.stringify(body); init.headers['Content-Type'] = 'application/json'; }
        if (opts && opts.keepalive) init.keepalive = true;
        const res = await fetch(url, init);
        if (!res.ok) { const e = new Error('HTTP ' + res.status); e.status = res.status; throw e; }
        return res;
      } finally { if (to) clearTimeout(to); }
    }
    /** Parse a JSON body; an HTML error page (e.g. a 403 from a proxy) is a soft failure, not a crash. */
    async function readDoc(res) {
      const txt = await res.text();
      let j;
      try { j = JSON.parse(txt); } catch (e) { const er = new Error('not JSON'); er.soft = true; throw er; }
      if (!j || typeof j !== 'object') { const er = new Error('empty'); er.soft = true; throw er; }
      return j;
    }
    function jStatus() {
      if (!code) return 'offline';
      if (jbFailed || (typeof navigator !== 'undefined' && navigator.onLine === false)) return 'offline';
      if (jbBusy || dirty) return 'saving';
      return lastSaved ? 'saved' : 'saving';
    }
    let jLast = '';
    function jPush(force) { const st = jStatus(); if (force || st !== jLast) { jLast = st; emit('status', st); } }
    async function create() {
      const res = await jfetch('POST', EP, doc());
      let id = res.headers.get('X-jsonblob-id') || res.headers.get('X-jsonblob') || '';
      if (!id) { const loc = res.headers.get('Location') || res.headers.get('location') || ''; id = loc.replace(/\/+$/, '').split('/').pop(); }
      id = normCode(id);
      if (!validCode(id)) { const e = new Error('no blob id'); e.soft = true; throw e; }
      // what was on this device now belongs to the new code
      code = id;
      ls.set(KEY_CODE, id);
      ls.set(KEY_MIGRATED + id, '1');
      ls.del(KEY_EVENTS + 'local'); ls.del(KEY_DIRTY + 'local');
      dirty = 0; lastSaved = Date.now(); lastFetchJ = Date.now();
      saveMirror();
      setHash(id);
      emit('code', id);
    }
    async function pullJ(timeout) {
      const g = jbGen;
      const res = await jfetch('GET', EP + '/' + encodeURIComponent(code), undefined, { timeout });
      const j = await readDoc(res);
      if (g !== jbGen) throw new Error('stale');
      const before = sig(data);
      const remote = j.progress && typeof j.progress === 'object' ? j.progress : null;
      data = remote ? merge(data, remote) : normalize(data);
      const evBefore = events.length;
      events = mergeEvents(events, j.events);
      lastFetchJ = Date.now();
      if (!remote || sig(merge(remote, {})) !== sig(data) || events.length !== (Array.isArray(j.events) ? j.events.length : 0)) dirty = dirty || 1;
      saveMirror();
      return sig(data) !== before || events.length !== evBefore;
    }
    async function pushJ(keepalive) {
      const mark = dirty;
      await jfetch('PUT', EP + '/' + encodeURIComponent(code), doc(), { keepalive });
      if (dirty === mark) dirty = 0;
      lastSaved = Date.now();
      saveMirror();
    }
    function jSync(opts) {
      opts = opts || {};
      return serial(async () => {
        const g = jbGen;
        let changed = false;
        try {
          jbBusy = true; jPush();
          if (!code) await create();
          else {
            if (opts.refetch || Date.now() - lastFetchJ > 3000) changed = await pullJ(opts.timeout);
            if (dirty) await pushJ(false);
          }
          jbFailed = false; jbBackoff = 0;
          if (jbTimer) { clearTimeout(jbTimer); jbTimer = null; }
        } catch (err) {
          if (g !== jbGen) return false;
          jbFailed = true;
          jbReason = err && err.status ? 'HTTP ' + err.status : (err && err.message) || 'unknown';
          if (!jbTimer) {
            const ms = JB_BACKOFF[Math.min(jbBackoff, JB_BACKOFF.length - 1)];
            jbBackoff++;
            jbTimer = setTimeout(() => { jbTimer = null; jSync({ refetch: true }); }, ms);
          }
        } finally { jbBusy = false; }
        jPush(true);
        if (changed && g === jbGen) emit('data');
        return !jbFailed;
      });
    }
    function jKick() {
      jPush();
      if (jbDebounce) clearTimeout(jbDebounce);
      jbDebounce = setTimeout(() => { jbDebounce = null; if (!jbTimer) jSync(); }, JB_DEBOUNCE);
    }
    /** Start on this device right away (from the mirror), then reach the service in the background. */
    function jOpen(c) {
      jbGen++;
      code = c || null;
      if (code) ls.set(KEY_CODE, code);
      lastSaved = 0; jbFailed = false; jbBackoff = 0; lastFetchJ = 0;
      loadMirror();
      // progress from local-only days is folded in once per code
      if (code && !ls.get(KEY_MIGRATED + code)) {
        const old = lsJson(KEY_LOCAL);
        if (old && typeof old === 'object' && (old.diag || Object.keys(old.hist || {}).length)) { data = merge(data, old); dirty = dirty || 1; }
        const oldEv = lsJson(KEY_EVENTS + 'local');
        if (Array.isArray(oldEv) && oldEv.length) { events = mergeEvents(events, oldEv); dirty = dirty || 1; }
        ls.set(KEY_MIGRATED + code, '1');
        saveMirror();
      }
      jSync({ refetch: true });
      return Promise.resolve({ online: null });
    }
    function jCommit(evs) {
      (evs || []).forEach((e) => events.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), at: new Date(e.t || Date.now()).toISOString(), kind: e.kind, payload: e.payload }));
      if (events.length > EV_MAX) events = events.slice(-EV_MAX);
      dirty = (dirty || 0) + 1;
      saveMirror();
      jKick();
    }
    function jReset() {
      const t = Date.now();
      data = fresh(); data.resetAt = t; data.created = t;
      events.push({ id: t.toString(36) + 'r', at: new Date(t).toISOString(), kind: 'reset', payload: {} });
      dirty = (dirty || 0) + 1;
      saveMirror();
      return jSync();
    }
    async function jLeave() {
      if (code && dirty && !jbFailed) await Promise.race([jSync(), new Promise((r) => setTimeout(r, 2500))]);
      jbGen++;
      if (jbTimer) { clearTimeout(jbTimer); jbTimer = null; }
      ls.del(KEY_CODE);
      code = null; data = fresh(); events = []; dirty = 0;
    }
    async function jReadForParent(c) {
      const res = await jfetch('GET', EP + '/' + encodeURIComponent(c));
      const j = await readDoc(res);
      return { data: normalize(j.progress), events: (Array.isArray(j.events) ? j.events : []).slice().reverse() };
    }
    const flushHidden = () => { if (code && dirty) { try { pushJ(true).catch(() => {}); } catch (e) { /* ignore */ } } };
    window.addEventListener('online', () => { jbFailed = false; if (jbTimer) { clearTimeout(jbTimer); jbTimer = null; } jSync({ refetch: true }); });
    window.addEventListener('offline', () => jPush(true));
    window.addEventListener('pagehide', flushHidden);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { flushHidden(); return; }
      if (jbTimer) { clearTimeout(jbTimer); jbTimer = null; }
      jSync({ refetch: true });
    });
    window.FDPStore = {
      cloud: true, backend: 'jsonblob', deviceId,
      validCode, normCode, hashCode, setHash, suggestCode,
      resolveCode() {
        const hc = hashCode();
        if (hc) { ls.set(KEY_CODE, hc); return hc; }
        const saved = normCode(ls.get(KEY_CODE));
        if (validCode(saved)) { setHash(saved); return saved; }
        return null;
      },
      currentCode: () => code,
      cloudReason: () => (jbFailed ? jbReason : ''),
      openLocal() { return jOpen(null).then(() => data); },
      open: jOpen, refresh() { if (Date.now() - lastFetchJ > REFRESH_MIN_GAP) jSync({ refetch: true }); },
      commit: jCommit, reset: jReset, leave: jLeave, readForParent: jReadForParent, merge, fresh, normalize,
      importData(obj) { const prog = obj && obj.progress && typeof obj.progress === 'object' ? obj.progress : obj; data = merge(data, prog); if (obj && Array.isArray(obj.events)) events = mergeEvents(events, obj.events); dirty = (dirty || 0) + 1; saveMirror(); jKick(); return data; },
      recentEvents: async (n) => events.slice().reverse().slice(0, n || 100).map((e) => Object.assign({ itemId: e.payload && e.payload.item, skill: e.payload && e.payload.skill, correct: e.payload && e.payload.correct, given: e.payload && e.payload.wrong, misconception: e.payload && e.payload.misconception }, e)),
      data: () => data,
      events: () => events,
      status: jStatus,
      lastSaved: () => lastSaved,
      backupJSON: () => JSON.stringify(doc(), null, 1),
      onStatus(f) { listeners.status.push(f); },
      onData(f) { listeners.data.push(f); },
      onCode(f) { listeners.code.push(f); },
      isPersistent: () => lsOK,
      flushNow: () => jSync(),
      local: ls,
      _debug: () => ({ code, dirty, failed: jbFailed, pending: dirty ? 1 : 0, events: events.length }),
    };
    return;
  }

  /* =====================================================================
   * claudedb backend (claude.ai Artifact `db` capability)
   *   progress/max   one shared document: { v, updatedAt, progress }
   *   events/<id>    one small document per answer: { id, at, kind, itemId, skill, correct, given, misconception, ms, mode }
   * The namespace arrives later through claude.use('db') (null when this view cannot use it). Until then, and
   * whenever a call fails, everything lives in the local mirror + outbox and is retried later. The UI never waits.
   * ===================================================================== */
  if (BACKEND === 'claudedb') {
    const CODE = 'max';
    const KEY_PEND = 'maxFdpPrep.cdb.pending';      // events not yet written
    const KEY_CDIRTY = 'maxFdpPrep.cdb.dirty';
    const MAX_DOC = 240 * 1024;
    let db = null, dbState = 'waiting';              // waiting | ready | none
    let pending = [], cdirty = 0, cFailed = false, cBusy = false, cTimer = null, cDebounce = null, cBackoff = 0, cLastSaved = 0, cLastFetch = 0;
    const cSave = () => {
      ls.set(KEY_LOCAL, JSON.stringify(data));
      ls.set(KEY_PEND, JSON.stringify(pending.slice(-3000)));
      if (cdirty) ls.set(KEY_CDIRTY, String(cdirty)); else ls.del(KEY_CDIRTY);
    };
    function cStatus() {
      if (dbState !== 'ready' || cFailed) return 'offline';
      if (cBusy || cdirty || pending.length) return 'saving';
      return cLastSaved ? 'saved' : 'saving';
    }
    let cLast = '';
    const cPush = (force) => { const st = cStatus(); if (force || st !== cLast) { cLast = st; emit('status', st); } };
    /** Keep the shared document under the 256 KiB limit: old generated-item records go first. */
    function compact(d) {
      let out = d, json = JSON.stringify(out);
      if (json.length <= MAX_DOC) return out;
      out = JSON.parse(json);
      const ids = Object.keys(out.items).filter((k) => /^g:/.test(k)).sort((a, b) => (out.items[a].t || 0) - (out.items[b].t || 0));
      while (JSON.stringify(out).length > MAX_DOC && ids.length) { for (let i = 0; i < 50 && ids.length; i++) delete out.items[ids.shift()]; }
      out.recent = out.recent.slice(-20);
      return out;
    }
    const call = async (fn) => { try { return await fn(); } catch (e) { const er = new Error((e && e.code) || 'unavailable'); er.code = (e && e.code) || 'unavailable'; throw er; } };
    async function cPull() {
      const snap = await call(() => db.doc('progress/' + CODE).get());
      const before = sig(data);
      const remote = snap && snap.exists ? (snap.data() || {}).progress : null;
      data = remote && typeof remote === 'object' ? merge(data, remote) : normalize(data);
      if (!remote || sig(merge(remote, {})) !== sig(data)) cdirty = cdirty || 1;
      cLastFetch = Date.now();
      cSave();
      return sig(data) !== before;
    }
    async function cWrite() {
      if (cdirty) {
        const mark = cdirty;
        await call(() => db.doc('progress/' + CODE).set({ v: 1, updatedAt: new Date().toISOString(), progress: compact(data) }));
        if (cdirty === mark) cdirty = 0;
      }
      while (pending.length) {
        const e = pending[0];
        await call(() => db.collection('events').doc(e.id).set(e));
        pending.shift();
        cSave();
      }
      cLastSaved = Date.now();
      cSave();
    }
    function cSync(opts) {
      opts = opts || {};
      return serial(async () => {
        if (dbState !== 'ready') { cPush(); return false; }
        let changed = false;
        try {
          cBusy = true; cPush();
          if (opts.refetch || Date.now() - cLastFetch > 5000) changed = await cPull();
          await cWrite();
          cFailed = false; cBackoff = 0;
          if (cTimer) { clearTimeout(cTimer); cTimer = null; }
        } catch (err) {
          cFailed = true;
          if (err && (err.code === 'revoked' || err.code === 'not_granted' || err.code === 'capability_disabled' || err.code === 'capability_removed')) dbState = 'none';
          else if (!cTimer) {
            const ms = [3000, 10000, 30000, 60000][Math.min(cBackoff, 3)];
            cBackoff++;
            cTimer = setTimeout(() => { cTimer = null; cSync({ refetch: true }); }, ms);
          }
        } finally { cBusy = false; }
        cPush(true);
        if (changed) emit('data');
        return !cFailed;
      });
    }
    const cKick = () => { cPush(); if (cDebounce) clearTimeout(cDebounce); cDebounce = setTimeout(() => { cDebounce = null; if (!cTimer) cSync(); }, 3000); };
    function cOpen() {
      code = CODE;
      data = normalize(lsJson(KEY_LOCAL));
      const pj = lsJson(KEY_PEND);
      pending = Array.isArray(pj) ? pj : [];
      cdirty = +(ls.get(KEY_CDIRTY) || 0);
      let p0 = null;
      try { p0 = window.claude && typeof window.claude.use === 'function' ? window.claude.use('db') : null; } catch (e) { p0 = null; }
      Promise.resolve(p0).then((ns) => {
        if (ns) { db = ns; dbState = 'ready'; cSync({ refetch: true }); } else { dbState = 'none'; cPush(true); }
      }, () => { dbState = 'none'; cPush(true); });
      return Promise.resolve({ online: null });
    }
    function cCommit(evs) {
      (evs || []).forEach((e) => {
        const p = e.payload || {};
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        const doc = { id, at: new Date(e.t || Date.now()).toISOString(), kind: e.kind, device: deviceId };
        if (e.kind === 'answer') Object.assign(doc, { itemId: p.item || null, skill: p.skill || null, correct: !!p.correct, given: p.wrong === undefined || p.wrong === null ? null : String(Array.isArray(p.wrong) ? p.wrong.join(',') : p.wrong).slice(0, 60), misconception: p.misconception || null, ms: p.ms || null, mode: p.mode || null });
        else doc.payload = p;
        pending.push(doc);
      });
      cdirty = (cdirty || 0) + 1;
      cSave();
      cKick();
    }
    function cReset() {
      const t = Date.now();
      data = fresh(); data.resetAt = t; data.created = t;
      cdirty = (cdirty || 0) + 1;
      pending.push({ id: t.toString(36) + 'reset', at: new Date(t).toISOString(), kind: 'reset', device: deviceId, payload: {} });
      cSave();
      return cSync();
    }
    async function cEvents(n) {
      if (dbState !== 'ready') return pending.slice().reverse().slice(0, n || 100);
      try {
        const q = await call(() => db.collection('events').orderBy('at', 'desc').limit(n || 100).get());
        return q.docs.map((d) => d.data()).filter(Boolean);
      } catch (e) { return pending.slice().reverse().slice(0, n || 100); }
    }
    const cFlushHidden = () => { if (dbState === 'ready' && (cdirty || pending.length)) cSync(); };
    window.addEventListener('pagehide', cFlushHidden);
    window.addEventListener('online', () => { cFailed = false; if (cTimer) { clearTimeout(cTimer); cTimer = null; } cSync({ refetch: true }); });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { cFlushHidden(); return; }
      if (cTimer) { clearTimeout(cTimer); cTimer = null; }
      cSync({ refetch: true });
    });
    window.FDPStore = {
      cloud: true, backend: 'claudedb', deviceId,
      validCode, normCode, hashCode: () => null, setHash() {}, suggestCode,
      resolveCode: () => CODE,
      currentCode: () => CODE,
      openLocal() { return cOpen().then(() => data); },
      open: cOpen, refresh() { if (Date.now() - cLastFetch > REFRESH_MIN_GAP) cSync({ refetch: true }); },
      commit: cCommit, reset: cReset, leave: async () => {}, merge, fresh, normalize,
      readForParent: async () => ({ data, events: await cEvents(300) }),
      recentEvents: cEvents,
      importData(obj) { const prog = obj && obj.progress && typeof obj.progress === 'object' ? obj.progress : obj; data = merge(data, prog); cdirty = (cdirty || 0) + 1; cSave(); cSync(); return data; },
      data: () => data,
      events: () => pending,
      status: cStatus,
      dbState: () => dbState,
      lastSaved: () => cLastSaved,
      backupJSON: () => JSON.stringify({ v: 1, app: 'max-fdp', progress: data }, null, 1),
      onStatus(f) { listeners.status.push(f); },
      onData(f) { listeners.data.push(f); },
      onCode() {},
      isPersistent: () => lsOK,
      flushNow: () => cSync(),
      local: ls,
      _debug: () => ({ code: CODE, dirty: cdirty, failed: cFailed, pending: pending.length + (cdirty ? 1 : 0), db: dbState }),
    };
    return;
  }

  window.FDPStore = {
    cloud: CLOUD, backend: BACKEND, deviceId,
    importData(obj) { const prog = obj && obj.progress && typeof obj.progress === 'object' ? obj.progress : obj; data = merge(data, prog); commit([{ kind: 'import', payload: {} }]); return data; },
    recentEvents: async () => [],
    lastSaved: () => (status() === 'saved' ? Date.now() : 0),
    backupJSON: () => JSON.stringify({ v: 1, app: 'max-fdp', progress: data }, null, 1),
    onCode() {},
    events: () => [],
    validCode, normCode, resolveCode, hashCode, setHash, suggestCode,
    currentCode: () => code,
    openLocal, open, refresh, commit, reset, leave, readForParent, merge, fresh, normalize,
    data: () => data,
    status,
    onStatus(f) { listeners.status.push(f); },
    onData(f) { listeners.data.push(f); },
    isPersistent: () => lsOK,
    flushNow: () => sync(),
    local: ls,
    _debug: () => ({ code, baseline, failed, pending: pendingCount(), outbox }),
  };
})();
