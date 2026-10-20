/* store.js — persistence for Max's F/D/P Test Prep (design ported from Max's Motion Test Prep).
 *
 * Two modes, chosen by window.FDP_CONFIG (config.js):
 *   local (supabaseUrl or supabaseAnonKey empty): the whole progress blob lives in localStorage.
 *   cloud (both set): Supabase over its REST API (PostgREST, plain fetch, no SDK) is the source of truth.
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
  const CLOUD = !!(URL0 && KEY);

  const KEY_LOCAL = 'maxFdpPrep.v1';                // local-only mode: whole progress blob
  const KEY_CODE = 'maxFdpPrep.code';               // practice code remembered on this device
  const KEY_CACHE = 'maxFdpPrep.cache.';            // + code: last known merged progress
  const KEY_OUTBOX = 'maxFdpPrep.outbox.';          // + code: { dirty, events: [] }
  const KEY_DEVICE = 'maxFdpPrep.device';
  const CODE_RE = /^[a-z0-9-]{4,40}$/;
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
  });
  let data = fresh();
  const listeners = { status: [], data: [] };
  const emit = (k, a) => listeners[k].slice().forEach((f) => { try { f(a); } catch (e) { console.error(e); } });

  function normalize(d) {
    const f = fresh();
    if (!d || typeof d !== 'object') return f;
    const o = Object.assign(f, d);
    ['time', 'hist', 'miscLog', 'items', 'lessons', 'runs'].forEach((k) => { if (!o[k] || typeof o[k] !== 'object' || Array.isArray(o[k])) o[k] = {}; });
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
    ['diag', 'plan', 'mockA', 'mockB', 'morning'].forEach((k) => { out[k] = newerRec(a[k], b[k]); });
    ['items', 'lessons', 'runs'].forEach((k) => {
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
    if (!ok) scheduleRetry();
    pushStatus();
    if (ok && pendingCount()) sync();
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

  window.FDPStore = {
    cloud: CLOUD, deviceId,
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
