/* app.js — Max's F/D/P Test Prep: engine + UI.
 * Depends on: math.js (FDPMath), markup.js (FDPMark), sketch.js, figures.js (FDPFigures),
 *             config.js (FDP_CONFIG), store.js (FDPStore), content/lessons.js + content/bank.js.
 * No build step. Everything user-visible is plain DOM built with h().
 */
(function () {
  'use strict';

  const M = window.FDPMath, K = window.FDPMark, FIG = window.FDPFigures, ST = window.FDPStore, GEN = window.FDPGen;
  const md = K.md, esc = K.esc;

  /* =====================================================================
   * Config
   * ===================================================================== */
  const TEST_DATE = '2026-10-21';
  const DAY_CAP_MIN = 360;              // firm stop for the day: 6 hours of active study
  const BLOCK_MAX = 5, BLOCK_STREAK = 3;
  const MIXED_LEN = 12, CAR_LEN = 8, MORNING_LEN = 5;
  const HINT_LOCK_MS = 8000;
  const SLOW_LOCK_MS = 6000;
  const SKILL_NAMES = {
    'place-value': 'Comparing decimals', 'pct-dec': 'Percent ↔ decimal', 'frac-dec': 'Fraction ↔ decimal',
    'pct-frac': 'Percent ↔ fraction', 'repeating': 'Repeating decimals', 'compare-mixed': 'Comparing F, D and P',
    'gcf-lcm': 'GCF and LCM', 'frac-addsub': 'Adding and subtracting fractions', 'frac-muldiv': 'Multiplying and dividing fractions',
    'dec-ops': 'Decimal operations', 'rounding': 'Math vs real-life rounding', 'word-frac': 'Fraction word problems', 'word-dec': 'Decimal and money word problems',
  };
  const SKILL_ORDER = ['place-value', 'pct-dec', 'frac-dec', 'pct-frac', 'repeating', 'compare-mixed', 'gcf-lcm', 'frac-addsub', 'frac-muldiv', 'dec-ops', 'rounding', 'word-frac', 'word-dec'];
  const GROUPS = {
    convert: ['place-value', 'pct-dec', 'frac-dec', 'pct-frac', 'repeating', 'compare-mixed'],
    ops: ['gcf-lcm', 'frac-addsub', 'frac-muldiv', 'dec-ops'],
    word: ['rounding', 'word-frac', 'word-dec'],
  };
  const groupOf = (sk) => (GROUPS.convert.indexOf(sk) >= 0 ? 'convert' : GROUPS.ops.indexOf(sk) >= 0 ? 'ops' : 'word');
  const BLOCKS = [
    { name: 'Check-in', min: 40, focus: 'diag', blurb: 'A mixed check of every skill, then your results.' },
    { name: 'Conversions and comparing', min: 50, focus: 'convert', blurb: 'F, D and P, and which number is bigger.' },
    { name: 'Fraction and decimal operations', min: 50, focus: 'ops', blurb: 'Add, subtract, multiply, divide.' },
    { name: 'Word problems, labels, rounding', min: 50, focus: 'word', blurb: 'Read, plan, solve, label.' },
    { name: 'Practice test A', min: 55, focus: 'mockA', blurb: '24 questions, 45 minutes, then a scored review.' },
    { name: 'Fix-ups and mixed practice', min: 45, focus: 'fix', blurb: 'Your test A misses, a re-test of the morning, then everything mixed.' },
    { name: 'Practice test B', min: 40, focus: 'mockB', blurb: 'The second test, then the day is done.' },
  ];
  const BREAKS = [10, 15, 30, 10, 15, 10];   // after blocks 1..6; the 30 is the meal break
  const MR_B = {
    labels: '“Be mindful of labels, especially money questions.”',
    rounding: '“There is a difference between math rounding and real life rounding.”',
    think: '“Don’t be nervous, just ‘Think!’”',
  };

  const root = document.getElementById('app');
  const liveEl = document.getElementById('live');

  /* =====================================================================
   * Tiny helpers
   * ===================================================================== */
  function add(e, kids) {
    if (kids === undefined || kids === null || kids === false) return e;
    if (Array.isArray(kids)) kids.forEach((k) => add(e, k));
    else e.appendChild(kids.nodeType ? kids : document.createTextNode(String(kids)));
    return e;
  }
  function h(tag, props, kids) {
    const e = document.createElement(tag);
    if (props) {
      for (const k of Object.keys(props)) {
        const v = props[k];
        if (v === undefined || v === null || v === false) continue;
        if (k === 'class') e.className = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k === 'text') e.textContent = v;
        else if (k.length > 2 && k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === 'disabled' || k === 'hidden' || k === 'checked') e[k] = !!v;
        else if (k === 'value') e.value = v;
        else e.setAttribute(k, v === true ? '' : String(v));
      }
    }
    return add(e, kids);
  }
  const btn = (label, onclick, cls, extra) => h('button', Object.assign({ class: 'btn ' + (cls || ''), type: 'button', onclick }, extra || {}), label);
  function announce(msg) { if (liveEl) { liveEl.textContent = ''; setTimeout(() => { liveEl.textContent = msg; }, 30); } }
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const now = () => Date.now();
  const isFine = () => !!(window.matchMedia && window.matchMedia('(pointer: fine)').matches);
  // touch-first device (phone): decided once at load
  const COARSE = !!(window.matchMedia && (window.matchMedia('(pointer: coarse)').matches || (navigator.maxTouchPoints > 0 && window.innerWidth < 760)));
  const isCoarse = () => COARSE;
  const mins = (ms) => Math.max(0, Math.round(ms / 60000));
  const fmtClock = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const plural = (n, w, ws) => n + ' ' + (n === 1 ? w : (ws || w + 's'));
  const ICON = {
    check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13 l5 5 L20 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    dot: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="currentColor"/></svg>',
  };
  function daysToTest() {
    const t = new Date(TEST_DATE + 'T00:00:00'), n = new Date();
    return Math.round((t - new Date(n.getFullYear(), n.getMonth(), n.getDate())) / 86400000);
  }
  function testLine() {
    const d = daysToTest();
    if (d > 1) return 'Makeup test in <b>' + d + ' days</b>';
    if (d === 1) return 'Makeup test <b>tomorrow</b>';
    if (d === 0) return 'Makeup test <b>today</b>';
    return 'F/D/P review';
  }

  /* =====================================================================
   * Content
   * ===================================================================== */
  const C = { misc: {}, lessons: [], diag: [], bank: [], mock: { items: [] }, byId: {}, skills: [], fixture: false, mockSet: new Set() };
  function loadScript(src) {
    return new Promise((res) => { const s = document.createElement('script'); s.src = src; s.onload = () => res(true); s.onerror = () => res(false); document.head.appendChild(s); });
  }
  async function loadContent() {
    const need = ['FDP_MISC', 'FDP_LESSONS', 'FDP_DIAG', 'FDP_BANK', 'FDP_MOCK'].some((k) => !window[k]);
    if (need) { await loadScript('content/_fixture.js'); C.fixture = true; }
    C.misc = window.FDP_MISC || {};
    C.lessons = (Array.isArray(window.FDP_LESSONS) ? window.FDP_LESSONS : []).slice()
      .sort((a, b) => { const ia = SKILL_ORDER.indexOf(a.skill), ib = SKILL_ORDER.indexOf(b.skill); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
    C.diag = Array.isArray(window.FDP_DIAG) ? window.FDP_DIAG : [];
    C.bank = Array.isArray(window.FDP_BANK) ? window.FDP_BANK : [];
    C.mock = window.FDP_MOCK && Array.isArray(window.FDP_MOCK.items) ? window.FDP_MOCK : { title: 'Practice test A', items: [] };
    C.byId = {};
    C.diag.concat(C.bank).forEach((it) => { if (it && it.id) C.byId[it.id] = it; });
    if (window.FDP_MOCK_B && Array.isArray(window.FDP_MOCK_B.items)) C.mockB = window.FDP_MOCK_B;
    else {
      // no second mock yet: build one with the same shape from bank items not in mock A
      const a = new Set(C.mock.items);
      const pickK = (kind, n) => C.bank.filter((b) => b.kind === kind && !a.has(b.id)).slice(-n).map((b) => b.id);
      C.mockB = { title: 'Practice test B', items: pickK('short', 9).concat(pickK('word', 15)), built: true };
    }
    C.mockSet = new Set(C.mock.items.concat(C.mockB.items));
    const seen = [];
    C.diag.concat(C.bank).concat(C.lessons).forEach((x) => { if (x && x.skill && seen.indexOf(x.skill) < 0) seen.push(x.skill); });
    const extra = Array.isArray(window.FDP_SKILLS) ? window.FDP_SKILLS : [];
    extra.forEach((s) => { if (s && s.id) { SKILL_NAMES[s.id] = s.name || SKILL_NAMES[s.id]; if (seen.indexOf(s.id) < 0) seen.push(s.id); } });
    const order = extra.length ? extra.map((s) => s.id) : SKILL_ORDER;
    C.skills = seen.slice().sort((a, b) => {
      const ia = order.indexOf(a), ib = order.indexOf(b);
      return (ia < 0 ? 999 + seen.indexOf(a) : ia) - (ib < 0 ? 999 + seen.indexOf(b) : ib);
    });
  }
  const skillName = (s) => SKILL_NAMES[s] || String(s).replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
  const lessonFor = (skill) => C.lessons.find((l) => l.skill === skill) || null;
  const lessonById = (id) => C.lessons.find((l) => l.id === id) || null;
  const miscLabel = (id) => (C.misc[id] && C.misc[id].label) || String(id).replace(/-/g, ' ');
  const kindPts = (it) => (it.kind === 'word' ? 4 : 2);

  /* =====================================================================
   * Model: progress, mastery, plan
   * ===================================================================== */
  const D = () => ST.data();
  const save = (events) => ST.commit(events);

  function record(o) {
    const d = D(), t = now();
    const r = d.items[o.item] || { seen: 0, ok: 0 };
    d.items[o.item] = { t, seen: (r.seen || 0) + 1, ok: (r.ok || 0) + (o.ok ? 1 : 0), lastOk: !!o.ok };
    if (o.skill && o.score !== undefined && o.score !== null) {
      (d.hist[o.skill] = d.hist[o.skill] || []).push([t, Math.round(o.score * 100) / 100, o.mode]);
      if (d.hist[o.skill].length > 30) d.hist[o.skill] = d.hist[o.skill].slice(-30);
    }
    if (o.misc) { (d.miscLog[o.misc] = d.miscLog[o.misc] || []).push(t); }
    if (!o.ok) {
      d.recent.push({ t, item: o.item, skill: o.skill || '', given: String(o.given === undefined ? '' : (Array.isArray(o.given) ? o.given.join(',') : o.given)).slice(0, 40), misc: o.misc || '', mode: o.mode });
      if (d.recent.length > 40) d.recent = d.recent.slice(-40);
    }
    save([{ kind: 'answer', t, payload: { item: o.item, skill: o.skill || '', correct: !!o.ok, wrong: o.ok ? null : (o.given === undefined ? null : o.given), misconception: o.misc || null, ms: o.ms || null, mode: o.mode } }]);
  }
  function logMisc(id) { const d = D(); (d.miscLog[id] = d.miscLog[id] || []).push(now()); }

  function skillState(sk) {
    const hist = (D().hist[sk] || []).slice(-6);
    if (!hist.length) return { status: 'untested', score: null, n: 0 };
    let sw = 0, s = 0;
    hist.forEach((e, i) => { const w = 1 + i * 0.5; sw += w; s += w * (+e[1] || 0); });
    const sc = s / sw;
    return { status: sc >= 0.8 ? 'strong' : sc >= 0.5 ? 'shaky' : 'weak', score: sc, n: hist.length };
  }
  /** Skill status as of the diagnostic only (for before/after). */
  function diagState(sk) {
    const dg = D().diag;
    if (!dg || !dg.ans) return null;
    const rows = C.diag.filter((it) => it.skill === sk && dg.ans[it.id]);
    if (!rows.length) return null;
    const sc = rows.reduce((a, it) => a + (+dg.ans[it.id].score || 0), 0) / rows.length;
    return sc >= 0.8 ? 'strong' : sc >= 0.5 ? 'shaky' : 'weak';
  }
  const STATUS_TEXT = { strong: 'Strong', shaky: 'Shaky', weak: 'Needs work', untested: 'Not checked yet' };

  function miscList() {
    const d = D();
    return Object.keys(d.miscLog).map((id) => ({ id, n: d.miscLog[id].length, last: Math.max(...d.miscLog[id]) }))
      .filter((m) => m.n > 0).sort((a, b) => b.n - a.n || b.last - a.last);
  }
  /** Which skill fixes a misconception: the skill where it was seen most, else any lesson that mentions it. */
  function skillForMisc(id) {
    const counts = {};
    D().recent.forEach((r) => { if (r.misc === id && r.skill) counts[r.skill] = (counts[r.skill] || 0) + 1; });
    const dg = D().diag;
    if (dg && dg.ans) C.diag.forEach((it) => { const a = dg.ans[it.id]; if (a && a.misc === id) counts[it.skill] = (counts[it.skill] || 0) + 2; });
    let best = null, bn = 0;
    Object.keys(counts).forEach((s) => { if (counts[s] > bn && lessonFor(s)) { best = s; bn = counts[s]; } });
    if (best) return best;
    const it = C.bank.find((b) => (b.errors || []).some((e) => e && e.misconception === id) && lessonFor(b.skill));
    return it ? it.skill : null;
  }

  const activeMs = () => Object.values(D().time || {}).reduce((a, b) => a + (+b || 0), 0);
  const activeMin = () => mins(activeMs());
  const todayKey = () => { const n = new Date(); return n.getFullYear() + '-' + (n.getMonth() + 1) + '-' + n.getDate(); };

  /* ---------- the study day: 7 blocks with real breaks ---------- */
  function day() {
    const d = D();
    if (!d.plan || !Array.isArray(d.plan.blocks)) {
      d.plan = { t: now(), cur: 0, blocks: BLOCKS.map(() => ({ tasks: null, startedAt: 0, doneAt: 0, ms: 0 })), brk: null, done: {}, stopped: '' };
    }
    if (!d.plan.done) d.plan.done = {};
    return d.plan;
  }
  const touchDay = () => { day().t = now(); };
  const curBlock = () => day().blocks[day().cur];
  /** Skills in a group that the check-in did not show as owned (prerequisite order). */
  function needsLesson(group) {
    return C.skills.filter((s) => groupOf(s) === group && lessonFor(s) && skillState(s).status !== 'strong');
  }
  function buildTasks(i) {
    const f = BLOCKS[i].focus;
    if (f === 'diag') return [{ k: 'diag' }, { k: 'results' }];
    if (f === 'mockA') return [{ k: 'mock', which: 'A' }, { k: 'review', which: 'A' }];
    if (f === 'mockB') return [{ k: 'mock', which: 'B' }, { k: 'review', which: 'B' }, { k: 'summary' }];
    if (f === 'fix') return [{ k: 'set', focus: 'mockfix' }, { k: 'set', focus: 'retest' }, { k: 'set', focus: 'mixed', n: 12 }];
    const lessons = needsLesson(f).slice(0, f === 'word' ? 3 : 4).map((s) => ({ k: 'lesson', skill: s }));
    // skills he already owns free up time: it goes to word problems
    if (f === 'word') return lessons.concat([{ k: 'set', focus: 'word', n: lessons.length ? 8 : 14 }]);
    if (!lessons.length) return [{ k: 'set', focus: 'word', n: 12, why: 'You already own these skills, so this block goes to word problems.' }];
    return lessons.concat([{ k: 'set', focus: f, n: 8 }]);
  }
  function ensureTasks() {
    const b = curBlock();
    if (!b.tasks) { b.tasks = buildTasks(day().cur); b.startedAt = b.startedAt || now(); touchDay(); save(); }
    return b.tasks;
  }
  const nextTask = () => ensureTasks().find((t) => !t.done) || null;
  function completeTask(task) {
    task.done = now();
    touchDay();
    if (!nextTask()) finishBlock();
    save();
  }
  function finishBlock() {
    const p = day(), i = p.cur;
    p.blocks[i].doneAt = now();
    if (i < BLOCKS.length - 1) p.brk = { after: i, startedAt: now(), len: BREAKS[i] };
    touchDay();
  }
  function startNextBlock() {
    const p = day();
    if (!p.brk) return;
    p.cur = Math.min(BLOCKS.length - 1, p.brk.after + 1);
    p.brk = null;
    p.blocks[p.cur].startedAt = now();
    ensureTasks();
    touchDay(); save();
  }
  const dayDone = () => { const p = day(); return p.cur === BLOCKS.length - 1 && !!p.blocks[p.cur].doneAt; };
  const stoppedToday = () => day().stopped === todayKey() || (activeMin() >= DAY_CAP_MIN);
  const blockOver = () => { const b = curBlock(); return b && b.ms > (BLOCKS[day().cur].min + 10) * 60000; };

  /* ---------- active time: counts only while the page is visible and he has touched it recently ---------- */
  let lastInput = now(), timeSinceCommit = 0;
  ['pointerdown', 'keydown', 'input'].forEach((ev) => document.addEventListener(ev, () => { lastInput = now(); }, { capture: true, passive: true }));
  setInterval(() => {
    if (!state.ready || document.visibilityState !== 'visible' || now() - lastInput > 120000) return;
    if (state.screen === 'break' || state.screen === 'stop' || state.screen === 'code') return;
    const d = D();
    d.time[ST.deviceId] = (+d.time[ST.deviceId] || 0) + 5000;
    if (state.inDay && d.plan && d.plan.blocks && !d.plan.brk) { const b = d.plan.blocks[d.plan.cur]; b.ms = (+b.ms || 0) + 5000; d.plan.t = now(); }
    timeSinceCommit += 5000;
    if (timeSinceCommit >= 60000) { timeSinceCommit = 0; save(); }
    document.querySelectorAll('[data-active-min]').forEach((e) => { e.textContent = String(activeMin()); });
    document.querySelectorAll('[data-block-min]').forEach((e) => { e.textContent = String(mins((curBlock() || {}).ms || 0)); });
  }, 5000);

  /* =====================================================================
   * App state, dialog
   * ===================================================================== */
  const state = { screen: 'loading', ready: false, dialog: null, cleanup: [], homeNote: '', kp: null, inDay: false };
  function cleanupScreen() { state.cleanup.splice(0).forEach((f) => { try { f(); } catch (e) { /* ignore */ } }); }
  function mountScreen(node, focusSel) {
    cleanupScreen();
    closeDialog();
    root.replaceChildren(node);
    window.scrollTo(0, 0);
    const f = (focusSel && node.querySelector(focusSel)) || node.querySelector('[data-focus]');
    if (f) { try { f.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  }
  function openDialog(o) {
    closeDialog();
    const prev = document.activeElement;
    const btns = o.actions.map((a) => h('button', { class: 'btn' + (a.primary ? ' btn-primary' : ''), type: 'button', onclick: () => { closeDialog(); a.onClick && a.onClick(); } }, a.label));
    const dlg = h('div', { class: 'dialog', role: 'alertdialog', 'aria-modal': 'true', 'aria-labelledby': 'dlgT' }, [
      h('h2', { id: 'dlgT' }, o.title), o.body ? h('p', { html: o.body }) : null, h('div', { class: 'btns' }, btns),
    ]);
    const scrim = h('div', { class: 'scrim' }, dlg);
    scrim.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); closeDialog(); }
      if (e.key === 'Tab') { const i = btns.indexOf(document.activeElement); e.preventDefault(); btns[(i + (e.shiftKey ? btns.length - 1 : 1) + btns.length) % btns.length].focus(); }
    });
    document.body.appendChild(scrim);
    state.dialog = { scrim, prev };
    btns[o.focusIndex === undefined ? btns.length - 1 : o.focusIndex].focus();
  }
  function closeDialog() {
    if (!state.dialog) return;
    const { scrim, prev } = state.dialog;
    state.dialog = null;
    scrim.remove();
    try { if (prev && prev.focus && document.contains(prev)) prev.focus(); } catch (e) { /* ignore */ }
  }
  function askLeave(where, body) {
    openDialog({ title: 'Leave this for now?', body: body || 'What you have done so far is saved.', focusIndex: 0, actions: [{ label: 'Keep going', primary: true }, { label: 'Leave', onClick: where || showHome }] });
  }

  /* =====================================================================
   * Sync status (cloud mode only)
   * ===================================================================== */
  const SYNC_TEXT = { saved: 'Saved', saving: 'Saving…', offline: 'Offline. Your work will save when you are back online.' };
  function paintSync(el) { const s = ST.status(); el.textContent = SYNC_TEXT[s] || ''; el.setAttribute('data-state', s); }
  function syncNode() { if (!ST.cloud) return null; const el = h('span', { class: 'sync', 'data-sync': '' }); paintSync(el); return el; }
  ST.onStatus(() => document.querySelectorAll('[data-sync]').forEach(paintSync));
  ST.onData(() => { if (state.screen === 'home' && !state.dialog) showHome(); });

  /* =====================================================================
   * Answer inputs
   * ===================================================================== */
  function kpPref() {
    if (state.kp !== null) return state.kp;
    const v = ST.local.get('maxFdpPrep.keypad');
    state.kp = v === '1' ? true : v === '0' ? false : isCoarse();
    return state.kp;
  }
  function setKpPref(b) { state.kp = !!b; ST.local.set('maxFdpPrep.keypad', b ? '1' : '0'); }

  const FORM_CHIP = {
    decimal: ['d', 'Decimal'], fraction: ['f', 'Fraction, simplest form'], 'fraction-any': ['f', 'Fraction'],
    percent: ['p', 'Percent'], money: ['', 'Dollars and cents'], number: ['', 'Number'],
  };
  function formChip(ans) {
    const f = FORM_CHIP[ans.form || 'number'] || FORM_CHIP.number;
    let t = f[1];
    const R = M.roundingOf(ans);
    if (R) t += ', rounded ' + M.placesWord(R.k, ans.form);
    if (ans.label && ans.form !== 'money') t += ' + label';
    return h('span', { class: 'formchip ' + f[0] }, [h('span', { class: 'formchip-k' }, 'Answer as'), ' ', t]);
  }

  /** A number field with live math preview and the on-screen keypad. */
  function numInput(ans, opts) {
    opts = opts || {};
    const id = 'in' + Math.random().toString(36).slice(2, 8);
    const input = h('input', { class: 'numin', id, type: 'text', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', enterkeyhint: 'done', maxlength: '40', 'aria-label': opts.label || 'Your answer' });
    const preview = h('div', { class: 'preview', 'aria-hidden': 'true' });
    const unit = ans.unit && ans.unit !== '$' && ans.unit !== '%' ? h('span', { class: 'unit' }, ans.unit) : null;
    const pre = ans.form === 'money' || ans.unit === '$' ? h('span', { class: 'unit pre' }, '$') : null;
    const kpBtn = h('button', { class: 'btn btn-quiet btn-small kp-toggle', type: 'button', 'aria-expanded': 'false' }, 'Show full keypad');
    const kp = keypad(input, () => opts.onEnter && opts.onEnter());
    const strip = symbolStrip(input);
    const summary = h('p', { class: 'ans-summary', hidden: true });
    const labels = labelChips(ans, opts.prompt, input);
    const wrap = h('div', { class: 'numwrap' }, [
      h('div', { class: 'ans-row' }, [pre, input, unit]),
      h('div', { class: 'ans-meta' }, [formChip(ans), h('span', { class: 'preview-wrap' }, [h('span', { class: 'preview-k' }, 'You wrote'), preview])]),
      labels,
      h('div', { class: 'kp-row' }, [strip, kpBtn]),
      kp, summary,
    ]);
    const paint = () => {
      const v = input.value;
      preview.innerHTML = v.trim() ? K.typed(v) : '<span class="soft">nothing yet</span>';
      wrap.classList.toggle('has-value', !!v.trim());
      opts.onChange && opts.onChange(v);
    };
    const showKp = (b) => {
      kp.hidden = !b; strip.hidden = !!b; kpBtn.setAttribute('aria-expanded', String(b)); kpBtn.textContent = b ? 'Small keypad' : 'Show full keypad';
      input.setAttribute('inputmode', b && isCoarse() ? 'none' : 'text');
    };
    kpBtn.addEventListener('click', () => { const b = kp.hidden; setKpPref(b); showKp(b); });
    showKp(kpPref());
    input.addEventListener('input', paint);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); opts.onEnter && opts.onEnter(); }
      if (e.key === 'Escape') { input.blur(); }
    });
    paint();
    return {
      el: wrap, input,
      value: () => input.value,
      set(v) { input.value = v; paint(); },
      focus() { try { input.focus({ preventScroll: true }); } catch (e) { /* ignore */ } },
      lock(b) { input.disabled = !!b; wrap.classList.toggle('is-locked', !!b); if (labels && b) labels.hidden = true; kp.querySelectorAll('button').forEach((x) => { x.disabled = !!b; }); kpBtn.disabled = !!b; if (b) { kp.hidden = true; strip.hidden = true; kpBtn.hidden = true; } },
      mark(cls) { input.classList.remove('is-right', 'is-wrong', 'is-form'); if (cls) input.classList.add(cls); },
      /** Shrink to one line: "You wrote 987654 · Not yet". */
      collapse(statusText, cls) {
        wrap.querySelectorAll('.ans-row,.ans-meta,.kp-row,.keypad,.labelchips').forEach((e) => { e.hidden = true; });
        summary.innerHTML = '<span class="preview-k">You wrote</span> ' + (input.value.trim() ? K.typed(input.value) : '<span class="soft">nothing</span>') + ' <span class="ans-st ' + (cls || '') + '">· ' + esc(statusText) + '</span>';
        summary.hidden = false;
      },
      ready: () => !!input.value.trim(),
    };
  }

  /** Label chips for word problems: units named in the question plus the label words, and "abc" to type any word. */
  function labelChips(ans, prompt, input) {
    if (!ans.label || ans.form === 'money') return null;
    const words = [];
    const add2 = (w) => { w = String(w || '').trim().toLowerCase(); if (w && w.length < 24 && words.indexOf(w) < 0) words.push(w); };
    const plainP = K.plain(prompt || '');
    (plainP.match(/\d[\d.,/ ]*\s+([a-z]+(?:\s+per\s+[a-z]+)?)/gi) || []).forEach((m) => add2(m.replace(/^[\d.,/ ]+/, '')));
    const L = Array.isArray(ans.label) ? ans.label : [ans.label];
    add2(L[0]);
    const STOP = ['and', 'of', 'each', 'is', 'are', 'for', 'to', 'the', 'a', 'in', 'on', 'at', 'more', 'less', 'times', 'per', 'every', 'or', 'left'];
    const pick = shuffle(words.filter((w) => STOP.indexOf(w) < 0)).slice(0, 4);
    const setLabel = (w) => {
      const v = input.value.replace(/\s+[a-z][a-z .'\/-]*$/i, '').trimEnd();
      input.value = v + ' ' + w;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const row = h('div', { class: 'labelchips', role: 'group', 'aria-label': 'Label' }, [h('span', { class: 'labelchips-k' }, 'Label:')]);
    pick.forEach((w) => row.appendChild(h('button', { class: 'sym lchip', type: 'button', tabindex: '-1', onclick: () => setLabel(w) }, w)));
    row.appendChild(h('button', { class: 'sym lchip', type: 'button', tabindex: '-1', 'aria-label': 'Type a label with the keyboard', onclick: () => { input.setAttribute('inputmode', 'text'); input.focus(); } }, 'abc'));
    return row;
  }

  /** One row of small symbol chips for keyboards that lack them (fine pointers). */
  function symbolStrip(input) {
    const ins = (s2) => {
      const a = input.selectionStart === null ? input.value.length : input.selectionStart;
      const b = input.selectionEnd === null ? input.value.length : input.selectionEnd;
      input.value = input.value.slice(0, a) + s2 + input.value.slice(b);
      try { input.setSelectionRange(a + s2.length, a + s2.length); } catch (e) { /* ignore */ }
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const keys = [
      ['/', () => ins('/'), 'kp-f', 'Fraction bar'], ['%', () => ins('%'), 'kp-p', 'Percent'], ['$', () => ins('$'), '', 'Dollars'],
      ['mixed ␣', () => ins(' '), '', 'Space, for a mixed number like 8 1/4'],
      ['repeat', () => { const v = input.value.slice(0, input.selectionStart === null ? input.value.length : input.selectionStart); ins(v.lastIndexOf('(') > v.lastIndexOf(')') ? ')' : '('); }, 'kp-d', 'Repeat bar: the digits after it repeat'],
      ['⌫', () => {
        let a = input.selectionStart === null ? input.value.length : input.selectionStart;
        const b = input.selectionEnd === null ? input.value.length : input.selectionEnd;
        if (a === b && a > 0) a -= 1;
        input.value = input.value.slice(0, a) + input.value.slice(b);
        try { input.setSelectionRange(a, a); } catch (e) { /* ignore */ }
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }, '', 'Delete'],
    ];
    const row = h('div', { class: 'symstrip', role: 'group', 'aria-label': 'Symbols' });
    keys.forEach(([label, fn, cls, aria]) => {
      const b = h('button', { class: 'sym ' + cls, type: 'button', 'aria-label': aria, tabindex: '-1' }, label === 'repeat' ? h('span', { html: '<span class="ol">x</span> repeat' }) : label);
      b.addEventListener('pointerdown', (e) => e.preventDefault());
      b.addEventListener('click', () => { fn(); try { input.focus({ preventScroll: true }); } catch (e) { /* ignore */ } });
      row.appendChild(b);
    });
    return row;
  }

  function keypad(input, onEnter) {
    const ins = (s) => {
      const a = input.selectionStart === null ? input.value.length : input.selectionStart;
      const b = input.selectionEnd === null ? input.value.length : input.selectionEnd;
      input.value = input.value.slice(0, a) + s + input.value.slice(b);
      const c = a + s.length;
      try { input.setSelectionRange(c, c); } catch (e) { /* ignore */ }
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const back = () => {
      let a = input.selectionStart === null ? input.value.length : input.selectionStart;
      const b = input.selectionEnd === null ? input.value.length : input.selectionEnd;
      if (a === b && a > 0) a -= 1;
      input.value = input.value.slice(0, a) + input.value.slice(b);
      try { input.setSelectionRange(a, a); } catch (e) { /* ignore */ }
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const repeatKey = () => {
      const v = input.value.slice(0, input.selectionStart === null ? input.value.length : input.selectionStart);
      const open = v.lastIndexOf('('), close = v.lastIndexOf(')');
      ins(open > close ? ')' : '(');
    };
    const keys = [
      ['7'], ['8'], ['9'], ['⌫', back, 'kp-fn', 'Delete'],
      ['4'], ['5'], ['6'], ['/', null, 'kp-f', 'Fraction bar'],
      ['1'], ['2'], ['3'], ['%', null, 'kp-p', 'Percent'],
      ['0'], ['.', null, 'kp-d', 'Decimal point'], ['␣', () => ins(' '), 'kp-fn', 'Space, for a mixed number like 8 1/4'], ['$', null, 'kp-fn', 'Dollars'],
      ['−', () => ins('-'), 'kp-fn', 'Minus'], ['repeat', repeatKey, 'kp-d kp-rep', 'Repeat bar: the digits after it repeat'], ['Enter', () => onEnter(), 'kp-enter', 'Check'],
    ];
    const pad = h('div', { class: 'keypad', role: 'group', 'aria-label': 'Keypad' });
    keys.forEach(([label, fn, cls, aria]) => {
      const b = h('button', { class: 'kp ' + (cls || ''), type: 'button', 'aria-label': aria || label, tabindex: '-1' },
        label === 'repeat' ? h('span', { html: '<span class="ol">x</span> repeat' }) : label);
      b.addEventListener('pointerdown', (e) => e.preventDefault()); // keep the caret in the field
      b.addEventListener('click', () => { if (fn) fn(); else ins(label); if (label !== 'Enter' && isFine()) input.focus({ preventScroll: true }); });
      pad.appendChild(b);
    });
    return pad;
  }

  /** Same shuffled order for the same options all session (re-renders do not reorder). */
  const ORDERS = new Map();
  function stableOrder(key, n, keepIfSymbols) {
    if (keepIfSymbols) return Array.from({ length: n }, (x, i) => i);
    if (!ORDERS.has(key)) ORDERS.set(key, shuffle(Array.from({ length: n }, (x, i) => i)));
    return ORDERS.get(key);
  }
  const symbolChoices = (ch) => ch.every((c) => /^(&gt;|&lt;|=|>|<|&#61;)$/.test(String(c).trim()));

  /** Big tappable choices, shuffled once per session. data-i keeps each option's original index. */
  function choiceInput(ans, opts) {
    opts = opts || {};
    let picked = null;
    const order = stableOrder('c|' + (opts.key || '') + '|' + ans.choices.join('|'), ans.choices.length, symbolChoices(ans.choices));
    const btns = order.map((i, pos) => h('button', { class: 'choice', type: 'button', 'aria-pressed': 'false', 'data-i': String(i) }, [
      h('span', { class: 'ckey', 'aria-hidden': 'true' }, String(pos + 1)),
      h('span', { class: 'ctext', html: md(ans.choices[i]) }),
      h('span', { class: 'cbadge' }),
    ]));
    const wrap = h('div', { class: 'choices' + (ans.choices.length <= 3 && ans.choices.every((c) => K.plain(c).length < 18) ? ' choices-row' : '') }, btns);
    const byIdx = (i) => btns[order.indexOf(i)];
    const pick = (i) => {
      const bt = byIdx(i);
      if (!bt || bt.disabled) return;
      picked = i;
      btns.forEach((b) => { const on = b === bt; b.setAttribute('aria-pressed', String(on)); b.classList.toggle('is-picked', on); });
      opts.onChange && opts.onChange(i);
      if (opts.instant && opts.onEnter) opts.onEnter();
    };
    btns.forEach((b, pos) => b.addEventListener('click', () => pick(order[pos])));
    return {
      el: wrap,
      value: () => picked,
      pickKey: (n) => { if (n >= 1 && n <= btns.length) pick(order[n - 1]); },
      pickIndex: (i) => pick(i),
      focus() { try { btns[0].focus({ preventScroll: true }); } catch (e) { /* ignore */ } },
      lock(b) { btns.forEach((x) => { x.disabled = !!b; }); },
      markChoice(i, cls, badge) { const b = byIdx(+i); if (!b) return; b.classList.add(cls); b.querySelector('.cbadge').innerHTML = badge || ''; },
      disableChoice(i) { const b = byIdx(+i); if (b) { b.disabled = true; b.classList.remove('is-picked'); } picked = null; },
      clear() { picked = null; btns.forEach((b) => { b.setAttribute('aria-pressed', 'false'); b.classList.remove('is-picked'); }); },
      mark() {},
      collapse() {},
      ready: () => picked !== null,
    };
  }

  /** Tap cards in order, least to greatest. */
  function orderInput(ans, opts) {
    opts = opts || {};
    let seq = [];
    const n = ans.items.length;
    const pool = h('div', { class: 'order-pool', 'aria-label': 'Cards to place' });
    const slots = h('ol', { class: 'order-slots', 'aria-label': 'Your order, least to greatest' });
    const cards = ans.items.map((html, i) => h('button', { class: 'ocard', type: 'button', 'data-i': String(i), html: md(html) }));
    const slotEls = [];
    for (let k = 0; k < n; k++) slotEls.push(h('li', { class: 'oslot' }, h('span', { class: 'oslot-n' }, String(k + 1))));
    add(slots, slotEls);
    const order = shuffle(ans.items.map((x, i) => i));
    const paint = () => {
      order.forEach((i) => { if (seq.indexOf(i) < 0) pool.appendChild(cards[i]); });
      slotEls.forEach((s, k) => {
        s.querySelectorAll('.ocard').forEach((c) => c.remove());
        if (seq[k] !== undefined) s.appendChild(cards[seq[k]]);
        s.classList.toggle('is-filled', seq[k] !== undefined);
      });
      opts.onChange && opts.onChange(seq.slice());
    };
    cards.forEach((c, i) => c.addEventListener('click', () => {
      const at = seq.indexOf(i);
      if (at >= 0) seq.splice(at, 1); else if (seq.length < n) seq.push(i);
      paint();
    }));
    const wrap = h('div', { class: 'order' }, [
      h('div', { class: 'order-ends' }, [h('span', null, 'least'), h('span', { class: 'arrow', 'aria-hidden': 'true' }, '→'), h('span', null, 'greatest')]),
      slots,
      h('p', { class: 'order-help' }, 'Tap the cards in order, least first. Tap a placed card to take it back.'),
      pool,
    ]);
    paint();
    return {
      el: wrap,
      value: () => (seq.length === n ? seq.slice() : null),
      set(v) { seq = Array.isArray(v) ? v.slice() : []; paint(); },
      focus() { const c = pool.querySelector('.ocard'); if (c) try { c.focus({ preventScroll: true }); } catch (e) { /* ignore */ } },
      lock(b) { cards.forEach((c) => { c.disabled = !!b; }); },
      clear() { seq = []; paint(); },
      mark(cls) { slots.classList.remove('is-right', 'is-wrong'); if (cls) slots.classList.add(cls); },
      collapse() {},
      ready: () => seq.length === n,
    };
  }

  function makeInput(ans, opts) {
    if (!ans) return null;
    if (ans.type === 'choice') return choiceInput(ans, opts);
    if (ans.type === 'order') return orderInput(ans, opts);
    return numInput(ans, opts);
  }

  /* =====================================================================
   * Feedback notes (teacher's margin notes)
   * ===================================================================== */
  function note(kind, head, bodyHtml, extra) {
    return h('div', { class: 'note note--' + kind, role: kind === 'bad' || kind === 'form' ? 'alert' : 'status' }, [
      head ? h('p', { class: 'note-head', html: (kind === 'good' ? ICON.check + ' ' : '') + esc(head) }) : null,
      bodyHtml ? h('div', { class: 'note-body', html: bodyHtml }) : null,
      extra || null,
    ]);
  }
  function miscBlock(id, open) {
    const m = C.misc[id];
    if (!m) return null;
    const det = h('details', { class: 'misc-more' + (open ? ' is-open' : '') }, [
      h('summary', null, [h('span', { class: 'misc-tag' }, m.label || id), ' ', h('span', { class: 'soft' }, 'what this mix-up is')]),
      h('div', { class: 'misc-explain', html: md(m.explain || '') }),
    ]);
    if (open) det.open = true;
    det.addEventListener('toggle', () => {
      if (det.open && m.figure && !det.querySelector('.fig')) det.appendChild(FIG.render(m.figure));
    });
    if (open && m.figure) det.appendChild(FIG.render(m.figure));
    return det;
  }
  /** Feedback for a wrong answer: the matched error's feedback, else the misconception, else a "what to check". */
  function wrongFeedback(res, ans) {
    const misc = res.error ? res.error.misconception : res.auto || null;
    if (res.error && res.error.feedback) return { html: md(res.error.feedback), misc };
    if (misc && C.misc[misc]) return { html: md(C.misc[misc].explain || ''), misc };
    return { html: esc(whatToCheck(ans)), misc };
  }
  function whatToCheck(ans) {
    if (!ans) return 'Check each step.';
    if (ans.type === 'choice') return 'Look again at what each choice says.';
    if (ans.type === 'order') return 'Turn every card into the same form (decimals are easiest), then compare place by place.';
    const f = ans.form || 'number';
    if (f === 'percent') return 'Check where the decimal point goes: percent means out of 100.';
    if (f === 'decimal') return 'Check your place values and where the decimal point sits.';
    if (f === 'fraction' || f === 'fraction-any') return 'Check the top and the bottom, then simplify.';
    if (f === 'money') return 'Check which amount the question asks for, and the label.';
    return 'Check your arithmetic one step at a time.';
  }

  /* =====================================================================
   * Gaming guard: very fast answers or rapid wrong guesses -> a calm pause
   * ===================================================================== */
  function makeGuard() {
    let fast = 0, wrongFast = 0;
    return {
      note(ms, ok) {
        fast = ms < 3000 ? fast + 1 : 0;
        wrongFast = !ok && ms < 6000 ? wrongFast + 1 : ok ? 0 : wrongFast;
        if (fast >= 3 || wrongFast >= 3) { fast = 0; wrongFast = 0; return true; }
        return false;
      },
    };
  }
  const guard = makeGuard();
  /** A short lock with a calm message. Resolves when the pause is over. */
  function slowDown(host) {
    return new Promise((res) => {
      let left = SLOW_LOCK_MS;
      const t = h('span', { class: 'slow-t' }, fmtClock(left));
      const card = h('div', { class: 'note note--part slow', role: 'status' }, [
        h('p', { class: 'note-head' }, 'Slow down for a moment.'),
        h('p', null, ['Those came in fast. Read the next part slowly, then answer. ', t]),
      ]);
      host.appendChild(card);
      const iv = setInterval(() => { left -= 1000; t.textContent = left > 0 ? fmtClock(left) : ''; if (left <= 0) { clearInterval(iv); card.classList.add('done'); res(); } }, 1000);
      state.cleanup.push(() => clearInterval(iv));
    });
  }

  /* =====================================================================
   * Walkthrough: a growing worked solution, one step at a time.
   * Steps with an `ask` block until the right answer is typed:
   *   1st miss -> misconception feedback or "not yet" + what to check; 2nd -> hint; 3rd -> reveal, still must type it.
   * `why` blocks: forced choice with feedback on every option; must pick the right one.
   * ===================================================================== */
  function walkthrough(host, steps, opts) {
    opts = opts || {};
    const list = h('ol', { class: 'steps' + (opts.compact ? ' steps-compact' : '') });
    host.appendChild(list);
    let idx = opts.start || 0;
    const total = steps.length;
    const stepTag = h('span', { class: 'step-count' });
    if (opts.counterHost) opts.counterHost.appendChild(stepTag);
    // previously finished steps (resume): show worked, without asks
    for (let i = 0; i < idx && i < total; i++) list.appendChild(stepView(steps[i], i, true));
    function paintCount() { stepTag.textContent = 'Step ' + Math.min(idx + 1, total) + ' of ' + total; }
    function next() {
      if (idx >= total) { paintCount(); opts.onDone && opts.onDone(); return; }
      paintCount();
      const li = stepView(steps[idx], idx, false);
      list.appendChild(li);
      if (idx > (opts.start || 0)) { try { li.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' }); } catch (e) { /* ignore */ } }
    }
    function advance() { idx++; opts.onStep && opts.onStep(idx); next(); }

    function stepView(step, i, worked) {
      const li = h('li', { class: 'step' + (worked ? ' is-done' : ' is-current') }, [
        h('span', { class: 'step-n', 'aria-hidden': 'true' }, String(i + 1)),
      ]);
      const body = h('div', { class: 'step-body' });
      li.appendChild(body);
      if (step.say) body.appendChild(h('div', { class: 'say', html: md(step.say) }));
      const maskOf = (a) => { try { return a && a.answer && a.answer.type === 'num' ? M.parseValue(a.answer.value) : null; } catch (e) { return null; } };
      if (step.figure) {
        const host = h('div', { class: 'step-fig' }, FIG.render(step.figure, { mask: worked ? null : maskOf(step.ask) }));
        body.appendChild(host);
        li._unmask = () => host.replaceChildren(FIG.render(step.figure));
      }
      if (worked) {
        if (step.ask) body.appendChild(h('p', { class: 'worked', html: md(step.ask.prompt) + ' <span class="worked-a">' + M.answerMarkup(step.ask.answer).replace(/\[\[/g, '[[') + '</span>' }));
        body.querySelectorAll('.worked-a').forEach((e) => { e.innerHTML = md(e.innerHTML); });
        return li;
      }
      const seq = [];
      if (step.ask) seq.push((done) => askView(body, step.ask, done));
      if (step.why) seq.push((done) => whyView(body, step.why, done));
      const run = (k) => {
        if (k >= seq.length) {
          if (!seq.length) {
            const go = btn(idx + 1 >= total ? (opts.finishLabel || 'Done') : 'Next step', () => { go.remove(); li.classList.replace('is-current', 'is-done'); advance(); }, 'btn-primary step-next');
            body.appendChild(go);
            if (isFine()) setTimeout(() => go.focus({ preventScroll: true }), 30);
            return;
          }
          li.classList.replace('is-current', 'is-done');
          advance();
          return;
        }
        seq[k](() => run(k + 1));
      };
      setTimeout(() => run(0), 0);
      return li;
    }

    function askView(body, ask, done) {
      const box = h('div', { class: 'ask' });
      box.appendChild(h('p', { class: 'ask-prompt', html: md(ask.prompt) }));
      let askFig = null;
      if (ask.figure) { const mv = ask.answer.type === 'num' ? M.parseValue(ask.answer.value) : null; askFig = h('div', { class: 'step-fig' }, FIG.render(ask.figure, { mask: mv })); box.appendChild(askFig); }
      const fb = h('div', { class: 'ask-fb', 'aria-live': 'polite' });
      let misses = 0, shownAt = now(), lastSubmit = now(), hinted = false, revealed = false, finished = false;
      const inp = makeInput(ask.answer, { prompt: ask.prompt, onEnter: () => check(), instant: true });
      const checkBtn = ask.answer.type === 'choice' ? null : btn('Check', () => check(), 'btn-primary');
      const hintBtn = !opts.noHints && ask.hint ? btn('Hint', () => showHint(), 'btn-quiet btn-small', { disabled: true, title: 'Give it a real try first' }) : null;
      if (hintBtn) {
        const t = setTimeout(() => { if (!hinted && !finished) hintBtn.disabled = false; }, HINT_LOCK_MS);
        state.cleanup.push(() => clearTimeout(t));
      }
      function showHint() {
        if (hinted || !ask.hint) return;
        hinted = true;
        if (hintBtn) hintBtn.remove();
        fb.appendChild(note('part', 'Hint', md(ask.hint)));
      }
      function showReveal() {
        if (revealed) return;
        revealed = true;
        if (hintBtn) hintBtn.remove();
        const rv = ask.reveal ? md(ask.reveal) : 'The answer is ' + md(M.answerMarkup(ask.answer)) + '.';
        fb.appendChild(note('part', 'Here is how it goes', rv + '<p class="note-small">Now type it in yourself to keep going.</p>'));
        opts.onReveal && opts.onReveal();
      }
      async function check() {
        if (finished) return;
        const v = inp.value();
        const res = M.grade(ask.answer, ask.errors, v);
        if (res.status === 'unparsed') { flash(res.msg); return; }
        const ms = now() - lastSubmit;
        lastSubmit = now();
        fb.querySelectorAll('.note--flash').forEach((n) => n.remove());
        if (res.status === 'form') {
          inp.mark && inp.mark('is-form');
          if (res.misc) { logMisc(res.misc); save(); }
          replaceTop(note('form', 'Almost', res.html ? md(res.html) + '<p class="note-small">' + esc(res.msg) + '</p>' : esc(res.msg)));
          return;
        }
        if (res.status === 'correct') {
          finished = true;
          inp.mark && inp.mark('is-right');
          if (ask.answer.type === 'choice') inp.markChoice(v, 'is-right', ICON.check);
          inp.lock(true);
          if (checkBtn) checkBtn.remove();
          if (hintBtn) hintBtn.remove();
          fb.querySelectorAll('.note--bad,.note--form').forEach((n) => n.classList.add('is-old'));
          fb.appendChild(note('good', misses ? 'Got it.' : 'Right.', null));
          box.classList.add('is-solved');
          if (askFig) askFig.replaceChildren(FIG.render(ask.figure));
          const li = box.closest('li');
          if (li && li._unmask) li._unmask();
          opts.onAskDone && opts.onAskDone({ misses, hinted, revealed });
          done();
          return;
        }
        // wrong
        misses++;
        inp.mark && inp.mark('is-wrong');
        if (ask.answer.type === 'choice') { inp.markChoice(v, 'is-wrong', '✕'); inp.disableChoice(v); }
        const wf = wrongFeedback(res, ask.answer);
        if (wf.misc) { logMisc(wf.misc); save(); }
        const gamed = guard.note(ms, false);
        if (gamed) {
          inp.lock(true);
          await slowDown(fb);
          inp.lock(false);
          if (!hinted && ask.hint && !opts.noHints) showHint(); else showReveal();
          return;
        }
        if (misses === 1) replaceTop(note('bad', 'Not yet', wf.html, wf.misc ? miscBlock(wf.misc) : null));
        else if (misses === 2) { replaceTop(note('bad', 'Not yet', wf.html)); if (ask.hint && !opts.noHints) showHint(); else showReveal(); }
        else { replaceTop(note('bad', 'Not yet', wf.html)); showReveal(); }
        if (ask.answer.type !== 'choice' && inp.input && isFine()) { inp.input.select(); }
      }
      function flash(msg) {
        fb.querySelectorAll('.note--flash').forEach((n) => n.remove());
        const n = note('plain', null, esc(msg));
        n.classList.add('note--flash');
        fb.insertBefore(n, fb.firstChild);
      }
      function replaceTop(n) {
        fb.querySelectorAll('.note--bad,.note--form').forEach((x) => x.remove());
        fb.insertBefore(n, fb.firstChild);
      }
      state.curAsk = ask;
      box.appendChild(inp.el);
      box.appendChild(h('div', { class: 'ask-actions' }, [hintBtn, h('span', { class: 'spacer' }), checkBtn]));
      box.appendChild(fb);
      body.appendChild(box);
      shownAt = now(); lastSubmit = shownAt;
      if (isFine() || ask.answer.type !== 'num') setTimeout(() => inp.focus(), 40);
    }

    function whyView(body, why, done) {
      state.curWhy = why;
      const box = h('div', { class: 'why' });
      box.appendChild(h('p', { class: 'why-k' }, 'Why?'));
      box.appendChild(h('p', { class: 'why-prompt', html: md(why.prompt) }));
      const fb = h('div', { class: 'ask-fb', 'aria-live': 'polite' });
      const worder = stableOrder('w|' + why.prompt + '|' + why.choices.join('|'), why.choices.length, false);
      const choices = worder.map((i) => {
        const c = why.choices[i];
        const b = h('button', { class: 'choice why-choice', type: 'button', 'data-i': String(i) }, [h('span', { class: 'ctext', html: md(c) }), h('span', { class: 'cbadge' })]);
        b.addEventListener('click', () => {
          const ok = i === why.correct;
          const fbHtml = md((why.feedback && why.feedback[i]) || (ok ? 'Yes.' : 'Not quite.'));
          fb.replaceChildren(note(ok ? 'good' : 'bad', ok ? 'Yes.' : 'Not quite', fbHtml));
          if (ok) {
            b.classList.add('is-right'); b.querySelector('.cbadge').innerHTML = ICON.check;
            choices.forEach((x) => { x.disabled = true; });
            box.classList.add('is-solved');
            done();
          } else { b.classList.add('is-wrong'); b.disabled = true; b.querySelector('.cbadge').textContent = '✕'; }
        });
        return b;
      });
      box.appendChild(h('div', { class: 'choices' }, choices));
      box.appendChild(fb);
      body.appendChild(box);
    }

    next();
    return { list };
  }

  /* =====================================================================
   * Item card (diagnostic, practice, car rides, morning, mock)
   * ===================================================================== */
  /** opts: { mode, chips:[...], noHint, onResult(res, ctx), headExtra, mock:boolean, initial } */
  function itemCard(item, opts) {
    opts = opts || {};
    const ctx = { item, shownAt: now(), hinted: false, formTries: 0, done: false };
    state.cur = item;
    const fb = h('div', { class: 'qfeedback', 'aria-live': 'polite' });
    let built = false;
    const inp = makeInput(item.answer, { key: item.id, prompt: item.prompt, onEnter: () => primary.click(), onChange: () => { if (!built) return; setReady(); opts.onChange && opts.onChange(inp.value()); } });
    if (opts.initial !== undefined && opts.initial !== null && inp.set) inp.set(opts.initial);
    else if (opts.initial !== undefined && opts.initial !== null && item.answer.type === 'choice') inp.pickIndex(+opts.initial);
    const primary = btn([opts.primaryLabel || 'Check', h('span', { class: 'kbd', 'aria-hidden': 'true' }, 'Enter')], () => opts.onPrimary ? opts.onPrimary(ctx) : null, 'btn-primary');
    const setReady = () => { if (!ctx.done && !opts.mock) primary.disabled = !inp.ready(); };
    built = true;
    const hintBtn = !opts.noHint && item.hint ? btn('Hint', () => {
      if (ctx.hinted) return;
      ctx.hinted = true; hintBtn.remove();
      fb.insertBefore(note('part', 'Hint', md(item.hint)), fb.firstChild);
    }, 'btn-quiet btn-small', { disabled: true, title: 'Give it a real try first' }) : null;
    if (hintBtn) { const t = setTimeout(() => { hintBtn.disabled = false; }, HINT_LOCK_MS); state.cleanup.push(() => clearTimeout(t)); }
    const promptEl = h('div', { class: 'qprompt' }, [
      opts.chips && opts.chips.length ? h('div', { class: 'chips' }, opts.chips.filter(Boolean).map((c) => (c.nodeType ? c : h('span', { class: 'chip' }, c)))) : null,
      h('h2', { class: 'prompt', id: 'qprompt', tabindex: '-1', 'data-focus': '', html: md(item.prompt) }),
    ]);
    let mask = null;
    try { mask = item.answer.type === 'num' ? M.parseValue(item.answer.value) : null; } catch (e) { mask = null; }
    const fig = item.figure ? h('div', { class: 'qdiagram' }, FIG.render(item.figure, { quiz: true, mask })) : null;
    const bar = h('div', { class: 'actionbar' }, [hintBtn, opts.extraButtons || null, h('span', { class: 'spacer' }), primary]);
    const layout = h('div', { class: 'qlayout' + (fig ? ' has-diagram' : '') }, [
      promptEl, fig, h('div', { class: 'qanswer' }, inp.el), fb, h('div', { class: 'qactions' }, bar),
    ]);
    ctx.unmask = () => { if (fig) fig.replaceChildren(FIG.render(item.figure)); };
    ctx.el = layout; ctx.inp = inp; ctx.fb = fb; ctx.primary = primary; ctx.bar = bar; ctx.hintBtn = hintBtn;
    ctx.setPrimary = (label, fn) => { primary.replaceChildren(label, h('span', { class: 'kbd', 'aria-hidden': 'true' }, 'Enter')); primary.disabled = false; opts.onPrimary = fn; };
    setReady();
    return ctx;
  }
  /** Keyboard: digits pick choices, Enter presses the main button (when not typing). */
  function bindKeys(getCtx) {
    const onKey = (e) => {
      if (state.dialog || e.altKey || e.ctrlKey || e.metaKey) return;
      const ctx = getCtx();
      if (!ctx) return;
      const t = e.target;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
      if (typing) return;
      if (/^[1-9]$/.test(e.key) && ctx.inp && ctx.inp.pickKey && !ctx.done) { ctx.inp.pickKey(+e.key); e.preventDefault(); }
      else if (e.key === 'Enter' && ctx.primary && !ctx.primary.disabled && (!t || t.tagName !== 'BUTTON')) { ctx.primary.click(); e.preventDefault(); }
    };
    document.addEventListener('keydown', onKey);
    state.cleanup.push(() => document.removeEventListener('keydown', onKey));
  }
  function progressHead(label, pct, onLeave, extra) {
    return h('div', { class: 'qhead' }, [
      btn('Plan', onLeave, 'btn-quiet btn-small'),
      h('div', { class: 'progress' }, [
        h('span', { class: 'ptext' }, label),
        pct === null ? null : h('span', { class: 'pbar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(pct * 100)), 'aria-label': 'Progress' }, h('i', { style: 'width:' + Math.round(pct * 100) + '%' })),
      ]),
      extra || null,
      syncNode(),
    ]);
  }

  /* =====================================================================
   * Item sources: bank first, generators when a skill runs dry or for re-tests
   * ===================================================================== */
  const getItem = (id) => C.byId[id] || (GEN && GEN.fromId(id)) || null;
  let genSeed = (now() % 100000) + 1;
  function genItem(skill) {
    if (!GEN || GEN.skills.indexOf(skill) < 0) return null;
    const it = GEN.make(skill, genSeed++);
    if (it) C.byId[it.id] = it;
    return it;
  }
  function freshness(it) {
    const r = D().items[it.id];
    return !r ? 0 : !r.lastOk ? 1 : 2;
  }
  /** Bank items (not on a mock) passing filter, unseen first, then missed, then known; easier first within a tier. */
  function rankBank(filter, used, byLevel) {
    return shuffle(C.bank.filter((b) => !C.mockSet.has(b.id) && !used.has(b.id) && filter(b)))
      .sort((a, b) => freshness(a) - freshness(b) || (byLevel ? (a.level || 1) - (b.level || 1) : 0));
  }
  function pickFor(skill, n, used, opts) {
    opts = opts || {};
    const out = [];
    const bank = rankBank((b) => b.skill === skill && (!opts.short || b.kind !== 'word'), used, opts.byLevel);
    bank.forEach((b) => { if (out.length < n && (freshness(b) < 2 || opts.allowKnown || !GEN || GEN.skills.indexOf(skill) < 0)) { out.push(b.id); used.add(b.id); } });
    while (out.length < n) {
      const g = opts.noGen ? null : genItem(skill);
      if (!g) {
        const again = rankBank((b) => b.skill === skill, used, false)[0];
        if (!again) break;
        out.push(again.id); used.add(again.id); continue;
      }
      out.push(g.id); used.add(g.id);
    }
    return out;
  }
  const weight = (s) => ({ weak: 3, shaky: 2, untested: 2, strong: 1 }[skillState(s).status] || 1);
  function weightedSkill(skills) {
    const tot = skills.reduce((a, s) => a + weight(s), 0);
    let x = Math.random() * tot;
    for (const s of skills) { x -= weight(s); if (x <= 0) return s; }
    return skills[skills.length - 1];
  }
  const groupSkills = (g) => C.skills.filter((s) => groupOf(s) === g);
  function wordQueue(n, used) {
    const out = [];
    rankBank((b) => b.kind === 'word' || groupOf(b.skill) === 'word', used, true).forEach((b) => { if (out.length < n) { out.push(b.id); used.add(b.id); } });
    // word problems stay hand-written: if the bank is used up, fall back to operations practice
    while (out.length < n) { const ids = pickFor(weightedSkill(groupSkills('ops').length ? groupSkills('ops') : C.skills), 1, used); if (!ids.length) break; out.push(ids[0]); }
    return out;
  }
  /** About 1/3 conversions & comparing, 2/3 word problems and operations, interleaved. */
  function mixedQueue(n, used) {
    const nConv = Math.round(n / 3), nWord = Math.round((n - nConv) * 0.6), nOps = n - nConv - nWord;
    const conv = [], ops = [];
    const cs = groupSkills('convert'), os = groupSkills('ops');
    for (let k = 0; k < nConv && cs.length; k++) conv.push(...pickFor(weightedSkill(cs), 1, used, { short: true }));
    for (let k = 0; k < nOps && os.length; k++) ops.push(...pickFor(weightedSkill(os), 1, used, { short: true }));
    const word = wordQueue(nWord, used);
    const out = [];
    while (conv.length || ops.length || word.length) {
      if (word.length) out.push(word.shift());
      if (conv.length) out.push(conv.shift());
      if (word.length) out.push(word.shift());
      if (ops.length) out.push(ops.shift());
    }
    return out.slice(0, n);
  }
  /** A fresh item on the same skill, preferring one that shares the misconception. */
  function pickTwin(item, misc, used) {
    const share = (b) => (b.errors || []).some((e) => e && e.misconception === misc);
    const bank = rankBank((b) => b.skill === item.skill && b.id !== item.id, used, false);
    const best = (misc && bank.find((b) => share(b) && freshness(b) < 2)) || bank.find((b) => freshness(b) < 2);
    if (best) { used.add(best.id); return best.id; }
    const g = genItem(item.skill);
    if (g) { used.add(g.id); return g.id; }
    return bank[0] ? bank[0].id : null;
  }
  const taughtToday = () => Object.keys(day().done || {});

  /* =====================================================================
   * Practice set runner (after a lesson, word sets, mixed, car rides, morning, fix-ups)
   * cfg: { title, mode, queue, adaptive:'block'|null, retest:boolean, onDone(sum), leave, noTimeBox }
   * ===================================================================== */
  function runSet(cfg) {
    const S = { i: 0, q: cfg.queue.slice(), answered: 0, first: 0, streak: 0, misc: {}, reasked: new Set(), noHint: new Set(), used: new Set(cfg.queue), retestAdded: false, stop: false };
    if (!S.q.length) { (cfg.onDone || showHome)({ answered: 0, first: 0 }); return; }
    function shouldEnd() {
      if (S.stop) return true;
      if (cfg.adaptive === 'block' && (S.streak >= BLOCK_STREAK || S.answered >= BLOCK_MAX)) {
        if (cfg.retest && !S.retestAdded) {
          S.retestAdded = true;
          const earlier = taughtToday().filter((s) => s !== cfg.skill);
          if (earlier.length) { const ids = pickFor(earlier[Math.floor(Math.random() * earlier.length)], 1, S.used); if (ids.length) { S.q.splice(S.i, S.q.length - S.i, ids[0]); S.retestNow = true; return false; } }
        }
        return S.retestNow ? S.i >= S.q.length : true;
      }
      if (!cfg.noTimeBox && state.inDay && blockOver() && S.answered >= 4) return true;
      return S.i >= S.q.length;
    }
    function show() {
      if (shouldEnd()) return endSet();
      const id = S.q[S.i];
      const item = getItem(id);
      if (!item) { S.i++; return show(); }
      state.screen = 'set';
      const isRetest = S.retestNow && S.i === S.q.length - 1;
      const chips = [skillName(item.skill), item.kind === 'word' ? 'Word problem' : null, isRetest ? 'Re-test from earlier' : null, S.noHint.has(id) ? 'Twin problem: no hints' : null];
      const total = cfg.adaptive === 'block' ? null : S.q.length;
      const label = cfg.adaptive === 'block' ? 'Problem ' + (S.i + 1) + (S.streak ? ' · ' + S.streak + ' in a row' : '') : (S.i + 1) + ' of ' + total;
      let lastSubmit = now();
      const showMe = btn('Show me how', () => wrong({ status: 'wrong' }, '', true), 'btn-quiet btn-small');
      const ctx = itemCard(item, { chips, noHint: S.noHint.has(id), onPrimary: () => check() , extraButtons: showMe });
      const moveOn = cfg.adaptive === 'block' ? btn('Move on', () => { S.stop = true; endSet(); }, 'btn-quiet btn-small') : btn('Finish set', () => { S.stop = true; endSet(); }, 'btn-quiet btn-small');
      const head = progressHead(label, total ? S.i / total : null, () => askLeave(cfg.leave || showHome), moveOn);
      const walkHost = h('div', { class: 'item-walk' });
      ctx.el.appendChild(walkHost);
      mountScreen(h('div', { class: 'qscreen' + (cfg.mode === 'car' ? ' is-car' : '') }, [head, ctx.el]));
      bindKeys(() => ctx);
      if (isFine() || item.answer.type !== 'num') setTimeout(() => ctx.inp.focus(), 50);

      function check() {
        if (ctx.done) return;
        const v = ctx.inp.value();
        const res = M.grade(item.answer, item.errors, v);
        if (res.status === 'unparsed') { flashNote(ctx.fb, res.msg); return; }
        const ms = now() - lastSubmit; lastSubmit = now();
        if (res.status === 'form' || res.status === 'label') {
          ctx.formTries++;
          if (res.misc) { logMisc(res.misc); S.misc[res.misc] = (S.misc[res.misc] || 0) + 1; save(); }
          ctx.inp.mark && ctx.inp.mark('is-form');
          replaceTop(ctx.fb, note('form', res.status === 'label' ? 'Add the label' : 'Almost', res.html ? md(res.html) + '<p class="note-small">' + esc(res.msg) + '</p>' : esc(res.msg)));
          return;
        }
        const ok = res.status === 'correct';
        const gamed = guard.note(ms, ok);
        if (ok) return right(gamed);
        return wrong(res, v, false, gamed);
      }
      function right() {
        ctx.done = true;
        const score = ctx.hinted ? 0.5 : ctx.formTries ? 0.75 : 1;
        record({ item: id, skill: item.skill, score, ok: true, given: ctx.inp.value(), mode: cfg.mode, ms: now() - ctx.shownAt });
        S.answered++; if (score === 1) { S.first++; S.streak++; } else S.streak = 0;
        ctx.inp.mark && ctx.inp.mark('is-right');
        if (item.answer.type === 'choice') ctx.inp.markChoice(ctx.inp.value(), 'is-right', ICON.check);
        if (item.answer.type === 'order') ctx.inp.mark('is-right');
        ctx.inp.lock(true);
        ctx.inp.collapse('Right', 'ok');
        ctx.unmask();
        if (ctx.hintBtn) ctx.hintBtn.remove();
        showMe.remove();
        const why = item.answer.rounding && item.answer.rounding.why ? md(item.answer.rounding.why) : null;
        ctx.fb.replaceChildren(note('good', score === 1 ? 'Right.' : 'Right.', why ? '<p class="note-label">Why round that way</p>' + why : (score < 1 ? '<span class="note-small">' + (ctx.hinted ? 'With the hint it counts a little less toward owning this skill.' : 'Right after the fix-up. First-try answers count the most.') + '</span>' : null)));
        ctx.setPrimary('Next', next);
        announce('Right.');
      }
      async function wrong(res, given, asked, gamed) {
        if (ctx.done) return;
        ctx.done = true;
        const wf = asked ? { html: null, misc: null } : wrongFeedback(res, item.answer);
        record({ item: id, skill: item.skill, score: 0, ok: false, given: asked ? '(asked to see how)' : given, misc: wf.misc, mode: cfg.mode, ms: now() - ctx.shownAt });
        if (wf.misc) S.misc[wf.misc] = (S.misc[wf.misc] || 0) + 1;
        S.answered++; S.streak = 0;
        ctx.inp.mark && ctx.inp.mark('is-wrong');
        if (item.answer.type === 'choice' && given !== '' && given !== null) ctx.inp.markChoice(given, 'is-wrong', '✕');
        ctx.inp.lock(true);
        ctx.inp.collapse(asked ? 'Asked to see how' : 'Not yet', 'no');
        if (ctx.hintBtn) ctx.hintBtn.remove();
        showMe.remove();
        ctx.primary.disabled = true;
        ctx.primary.hidden = true;
        if (!asked) ctx.fb.replaceChildren(note('bad', 'Not yet', wf.html, wf.misc ? miscBlock(wf.misc) : null));
        if (gamed) await slowDown(ctx.fb);
        // missed items come back later in mixed-style sets
        if (cfg.mode !== 'block' && cfg.adaptive !== 'block' && !S.reasked.has(id) && cfg.mode !== 'morning') { S.reasked.add(id); S.q.splice(Math.min(S.q.length, S.i + 4), 0, id); }
        walkHost.appendChild(h('h3', { class: 'walk-title' }, 'Walk through it'));
        const steps = item.steps && item.steps.length ? item.steps : [{ say: 'Try it once more, carefully.', ask: { prompt: md(item.prompt), answer: item.answer, errors: item.errors, hint: item.hint, reveal: 'The answer is ' + M.answerMarkup(item.answer) + '.' } }];
        let twinQueued = false;
        walkthrough(walkHost, steps, {
          compact: true,
          onReveal: () => {
            if (twinQueued) return;
            twinQueued = true;
            const tw = pickTwin(item, wf.misc, S.used);
            if (tw) { S.noHint.add(tw); S.q.splice(Math.min(S.q.length, S.i + 2), 0, tw); }
          },
          onDone: () => {
            ctx.unmask();
            walkHost.appendChild(note('good', 'You worked it out.', 'The answer: ' + md(M.answerMarkup(item.answer)) + (item.answer.rounding && item.answer.rounding.why ? '<p>' + md(item.answer.rounding.why) + '</p>' : '')));
            ctx.primary.hidden = false;
            ctx.setPrimary('Next', next);
            if (isFine()) ctx.primary.focus({ preventScroll: true });
          },
        });
      }
      function next() { S.i++; show(); }
    }
    function endSet() {
      state.screen = 'set-end';
      const miscs = Object.keys(S.misc);
      const done = () => (cfg.onDone || showHome)({ answered: S.answered, first: S.first, misc: S.misc });
      const go = btn([cfg.doneLabel || 'Continue', h('span', { class: 'kbd', 'aria-hidden': 'true' }, 'Enter')], done, 'btn-primary', { 'data-focus': '' });
      mountScreen(h('div', { class: 'endset' }, [
        h('p', { class: 'eyebrow' }, cfg.title || 'Practice'),
        h('h1', { class: 'bigscore' }, S.answered ? [h('span', null, S.first + ' of ' + S.answered), h('small', null, 'right on the first try')] : 'Set finished'),
        miscs.length ? h('div', { class: 'endset-misc' }, [h('p', { class: 'section-title' }, 'Mix-ups that showed up'), h('ul', { class: 'misc-list' }, miscs.map((m) => h('li', null, miscBlock(m))))]) : null,
        h('div', { class: 'end-actions' }, [go]),
      ]), '[data-focus]');
      const onKey = (e) => { if (e.key === 'Enter' && !state.dialog && document.activeElement && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); done(); } };
      document.addEventListener('keydown', onKey);
      state.cleanup.push(() => document.removeEventListener('keydown', onKey));
    }
    show();
  }
  function flashNote(host, msg) {
    host.querySelectorAll('.note--flash').forEach((n) => n.remove());
    const n = note('plain', null, esc(msg));
    n.classList.add('note--flash');
    host.insertBefore(n, host.firstChild);
  }
  function replaceTop(host, n) {
    host.querySelectorAll('.note--bad,.note--form,.note--flash').forEach((x) => x.remove());
    host.insertBefore(n, host.firstChild);
  }

  /* =====================================================================
   * Check-in (diagnostic): no teaching, neutral acknowledgement, keep moving
   * ===================================================================== */
  function runDiag(onDone) {
    const d = D();
    if (!d.diag || d.diag.done && !C.diag.length) d.diag = { t: now(), startedAt: now(), idx: 0, ans: {}, done: false };
    const dg = d.diag;
    if (dg.done) { onDone(); return; }
    const N = C.diag.length;
    if (!N) { dg.done = true; dg.doneAt = now(); save(); onDone(); return; }
    function show() {
      if (dg.idx >= N) return finish();
      state.screen = 'diag';
      const item = C.diag[dg.idx];
      let nudged = false, lastSubmit = now();
      const skip = btn('Skip: not sure', () => submit(true), 'btn-quiet btn-small');
      const ctx = itemCard(item, { chips: [item.kind === 'word' ? 'Word problem' : 'Short answer'], noHint: true, primaryLabel: 'Save and go on', onPrimary: () => submit(false), extraButtons: skip });
      const head = progressHead('Check-in ' + (dg.idx + 1) + ' of ' + N, dg.idx / N, () => askLeave(showHome, 'Your check-in answers so far are saved. You can pick up where you left off.'));
      mountScreen(h('div', { class: 'qscreen' }, [head, h('p', { class: 'diag-note' }, 'No feedback during the check-in. Just do your best and keep moving.'), ctx.el]));
      bindKeys(() => ctx);
      if (isFine() || item.answer.type !== 'num') setTimeout(() => ctx.inp.focus(), 50);
      function submit(skipped) {
        if (ctx.done) return;
        let score = 0, misc = null, ok = false;
        const v = skipped ? '' : ctx.inp.value();
        if (!skipped) {
          const res = M.grade(item.answer, item.errors, v);
          if (res.status === 'unparsed') { flashNote(ctx.fb, res.msg); return; }
          if ((res.status === 'form' || res.status === 'label') && !nudged) {
            nudged = true;
            replaceTop(ctx.fb, note('form', res.status === 'label' ? 'Label' : 'Check the form', esc(res.msg)));
            return;
          }
          if (res.status === 'correct') { ok = true; score = now() - ctx.shownAt > 150000 ? 0.75 : 1; }
          else if (res.status === 'form' || res.status === 'label') { ok = true; score = 0.6; misc = res.misc || null; }
          else { misc = res.error ? res.error.misconception : res.auto || null; }
        }
        ctx.done = true;
        const ms = now() - ctx.shownAt;
        dg.ans[item.id] = { ok, ms, given: Array.isArray(v) ? v.join(',') : String(v === null ? '' : v).slice(0, 40), misc, score };
        dg.idx++; dg.t = now();
        record({ item: item.id, skill: item.skill, score, ok, given: v, misc, mode: 'diag', ms });
        ctx.inp.lock(true);
        ctx.inp.collapse('Saved');
        ctx.fb.replaceChildren();
        ctx.primary.disabled = true;
        setTimeout(show, 450);
      }
    }
    function finish() {
      dg.done = true; dg.doneAt = now(); dg.t = now();
      save([{ kind: 'diag-done', t: now(), payload: { ms: now() - dg.startedAt, right: Object.values(dg.ans).filter((a) => a.ok).length, of: N } }]);
      onDone();
    }
    show();
  }

  /* ---------- check-in results: skill map + named mix-ups ---------- */
  function showResults(onDone) {
    state.screen = 'results';
    const dg = D().diag || { ans: {} };
    const right = C.diag.filter((it) => dg.ans[it.id] && dg.ans[it.id].ok).length;
    const groups = { weak: [], shaky: [], strong: [] };
    C.skills.forEach((s) => { const st = skillState(s).status; (groups[st === 'untested' ? 'shaky' : st] || groups.shaky).push(s); });
    const col = (k, title, sub) => h('section', { class: 'smap-col smap-' + k }, [
      h('h2', { class: 'smap-h' }, [title, h('span', { class: 'smap-n' }, String(groups[k].length))]),
      h('p', { class: 'smap-sub' }, sub),
      groups[k].length ? h('ul', { class: 'smap-list' }, groups[k].map((s) => h('li', { class: 'skill-pill is-' + k }, skillName(s)))) : h('p', { class: 'quiet' }, 'None.'),
    ]);
    const mis = miscList();
    const totalMs = Object.values(dg.ans).reduce((a, x) => a + (+x.ms || 0), 0);
    mountScreen(h('div', { class: 'results' }, [
      h('p', { class: 'eyebrow' }, 'Check-in results'),
      h('h1', { class: 'wordmark', tabindex: '-1', 'data-focus': '' }, [h('span', null, right + ' of ' + C.diag.length), ' right, in ' + plural(Math.max(1, mins(totalMs)), 'minute')]),
      h('p', { class: 'lede' }, 'This is a map, not a grade. The rest of the day is built from it: skills marked “needs work” get lessons first, skills you own get skipped, and that time goes to word problems.'),
      h('div', { class: 'smap' }, [col('weak', 'Needs work', 'Lessons today'), col('shaky', 'Shaky', 'A short lesson or extra practice'), col('strong', 'Strong', 'Skipped: you own these')]),
      mis.length ? h('section', { class: 'mis-sec' }, [
        h('h2', { class: 'section-title' }, 'Mix-ups the check-in caught'),
        h('ul', { class: 'misc-list' }, mis.map((m) => {
          const sk = skillForMisc(m.id);
          return h('li', { class: 'misc-row' }, [miscBlock(m.id), sk ? btn('Fix it: ' + (lessonFor(sk) || {}).title, () => runLessonFlow(sk, showHome), 'btn-small') : null]);
        })),
      ]) : h('p', { class: 'quiet' }, 'No named mix-ups showed up.'),
      nextThreeSection(() => showResults(onDone)),
      h('div', { class: 'end-actions' }, [btn('Continue with the day', onDone, 'btn-primary')]),
    ]));
  }

  /* =====================================================================
   * Lessons: a notebook page that grows one step at a time, then a practice block
   * ===================================================================== */
  function runLessonFlow(skill, onDone, inDay) {
    const lesson = lessonFor(skill);
    const practice = () => {
      const used = new Set();
      runSet({ title: skillName(skill) + ': practice', mode: 'block', adaptive: 'block', skill, retest: !!inDay, queue: pickFor(skill, BLOCK_MAX, used, { byLevel: true }), noTimeBox: true,
        onDone: () => { if (inDay) { day().done[skill] = now(); touchDay(); save(); } onDone(); } });
    };
    if (!lesson) { practice(); return; }
    showLesson(lesson, practice);
  }
  function showLesson(lesson, onFinish) {
    state.screen = 'lesson';
    const d = D();
    const rec = d.lessons[lesson.id] || { step: 0, done: false };
    const start = rec.done ? 0 : Math.min(rec.step || 0, lesson.steps.length);
    const counter = h('span', { class: 'ptext' });
    const head = h('div', { class: 'qhead lesson-head' }, [btn('Plan', () => askLeave(showHome, 'Your place in this lesson is saved.'), 'btn-quiet btn-small'), h('div', { class: 'progress' }, counter), syncNode()]);
    const page = h('article', { class: 'notebook' }, [
      h('p', { class: 'eyebrow' }, [skillName(lesson.skill), ' · about ', String(lesson.minutes || 6), ' min']),
      h('h1', { class: 'lesson-title', tabindex: '-1', 'data-focus': '' }, lesson.title),
      lesson.hook ? h('p', { class: 'hook', html: md(lesson.hook) }) : null,
    ]);
    const endHost = h('div', { class: 'lesson-end' });
    mountScreen(h('div', { class: 'lesson' }, [head, page, endHost]));
    walkthrough(page, lesson.steps, {
      start, counterHost: counter,
      onStep: (i) => { d.lessons[lesson.id] = { t: now(), step: i, done: !!rec.done }; save(); },
      onDone: () => {
        d.lessons[lesson.id] = { t: now(), step: lesson.steps.length, done: true };
        save([{ kind: 'lesson-done', t: now(), payload: { lesson: lesson.id, skill: lesson.skill } }]);
        const go = btn('Practice: 3 to 5 problems', onFinish, 'btn-primary');
        endHost.replaceChildren(note('good', 'Lesson done.', 'Now a few problems on your own. Three right in a row and you move on.'), h('div', { class: 'end-actions' }, [go]));
        try { endHost.scrollIntoView({ block: 'nearest' }); } catch (e) { /* ignore */ }
        if (isFine()) go.focus({ preventScroll: true });
      },
    });
  }

  /* =====================================================================
   * Practice tests (A and B): 9 short (2 pts) + 15 word (4 pts) = 78, 45-minute timer, no feedback until the end
   * ===================================================================== */
  const mockKey = (w) => (w === 'B' ? 'mockB' : 'mockA');
  const mockDef = (w) => (w === 'B' ? C.mockB : C.mock);
  const mockItems = (w) => mockDef(w).items.map(getItem).filter(Boolean);
  const mockMax = (w) => mockItems(w).reduce((a, it) => a + kindPts(it), 0);
  function gradeMockItem(item, raw) {
    const max = kindPts(item);
    if (raw === undefined || raw === null || raw === '' || (Array.isArray(raw) && !raw.length)) return { st: 'blank', pts: 0, max };
    const res = M.grade(item.answer, item.errors, raw);
    if (res.status === 'correct') return { st: 'right', pts: max, max };
    if (res.status === 'label' || (res.status === 'form' && res.misc === 'money-cents')) return { st: 'label', pts: max - 1, max, msg: res.msg, misc: res.misc };
    if (res.status === 'form') return { st: 'form', pts: Math.floor(max / 2), max, msg: res.msg, misc: res.misc || null };
    if (res.status === 'unparsed') return { st: 'unreadable', pts: 0, max, msg: res.msg };
    return { st: 'wrong', pts: 0, max, misc: res.error ? res.error.misconception : res.auto || null, fb: res.error && res.error.feedback ? res.error.feedback : null };
  }
  function showMockIntro(w, onDone) {
    state.screen = 'mock-intro';
    const items = mockItems(w);
    const shortN = items.filter((i) => i.kind !== 'word').length, wordN = items.length - shortN;
    const start = (timer) => {
      const t = now();
      D()[mockKey(w)] = { t, timer, startedAt: t, endsAt: timer ? t + 45 * 60000 : 0, idx: 0, ans: {}, done: false };
      save([{ kind: 'mock-start', t, payload: { which: w, timer } }]);
      runMock(w, onDone);
    };
    mountScreen(h('div', { class: 'mock-intro' }, [
      h('p', { class: 'eyebrow' }, 'Test - Number Systems · practice'),
      h('h1', { class: 'wordmark', tabindex: '-1', 'data-focus': '' }, ['Practice test ', h('span', null, w)]),
      h('ul', { class: 'facts' }, [
        h('li', null, [h('b', null, shortN + ' short questions'), ' × 2 pts']),
        h('li', null, [h('b', null, wordN + ' word problems'), ' × 4 pts']),
        h('li', null, [h('b', null, mockMax(w) + ' points'), ' total, 45 minutes']),
      ]),
      h('p', null, 'No feedback until you hand it in. You can skip around and come back. Then you get a scored review where every miss opens its walkthrough.'),
      h('p', { class: 'quote' }, ['Labels cost a point, like on Mr. B’s test. ', h('span', { class: 'soft' }, MR_B.labels)]),
      h('div', { class: 'end-actions' }, [btn('Start the 45-minute test', () => start(true), 'btn-primary'), btn('Start without the timer', () => start(false), 'btn-quiet')]),
    ]));
  }
  function runMock(w, onDone) {
    const m = D()[mockKey(w)];
    if (!m) { showMockIntro(w, onDone); return; }
    if (m.done) { onDone(); return; }
    const items = mockItems(w);
    let saveT = null;
    const persist = () => { if (saveT) clearTimeout(saveT); saveT = setTimeout(() => { m.t = now(); save(); }, 800); };
    function show() {
      state.screen = 'mock';
      const item = items[m.idx];
      const timerEl = m.timer ? h('span', { class: 'timer', role: 'timer', 'aria-live': 'off' }, fmtClock(m.endsAt - now())) : null;
      const handIn = btn('Hand it in', () => askHandIn(), 'btn-small');
      const ctx = itemCard(item, { chips: [(item.kind === 'word' ? 'Word problem' : 'Short answer') + ' · ' + kindPts(item) + ' pts'], noHint: true, mock: true, initial: m.ans[item.id],
        primaryLabel: m.idx < items.length - 1 ? 'Next' : 'Review answers', onPrimary: () => { if (m.idx < items.length - 1) go(m.idx + 1); else askHandIn(); },
        onChange: (v) => { m.ans[item.id] = v; persist(); paintNav(); } });
      ctx.primary.disabled = false;
      const prev = btn('Back', () => go(m.idx - 1), 'btn-quiet btn-small', { disabled: m.idx === 0 });
      ctx.bar.insertBefore(prev, ctx.bar.firstChild);
      const nav = h('nav', { class: 'mock-nav', 'aria-label': 'Questions' });
      function paintNav() {
        nav.replaceChildren(...items.map((it, i) => {
          const a = m.ans[it.id];
          const has = a !== undefined && a !== null && a !== '' && !(Array.isArray(a) && a.length < (it.answer.items || []).length);
          return h('button', { class: 'mnav' + (has ? ' is-done' : '') + (i === m.idx ? ' is-cur' : '') + (it.kind === 'word' ? ' is-word' : ''), type: 'button', 'aria-label': 'Question ' + (i + 1) + (has ? ', answered' : ''), 'aria-current': i === m.idx ? 'step' : null, onclick: () => go(i) }, String(i + 1));
        }));
      }
      paintNav();
      const head = h('div', { class: 'qhead mock-head' }, [
        btn('Plan', () => askLeave(showHome, m.timer ? 'Your answers are saved, but the clock keeps running.' : 'Your answers are saved.'), 'btn-quiet btn-small'),
        h('div', { class: 'progress' }, [h('span', { class: 'ptext' }, 'Test ' + w + ' · ' + (m.idx + 1) + ' of ' + items.length)]),
        timerEl, handIn, syncNode(),
      ]);
      mountScreen(h('div', { class: 'qscreen' }, [head, nav, ctx.el]));
      bindKeys(() => ctx);
      if (m.timer) {
        const iv = setInterval(() => {
          const left = m.endsAt - now();
          timerEl.textContent = fmtClock(left);
          timerEl.classList.toggle('is-low', left < 5 * 60000);
          if (left <= 0) { clearInterval(iv); handInNow(true); }
        }, 1000);
        state.cleanup.push(() => clearInterval(iv));
      }
      if (isFine() && item.answer.type === 'num') setTimeout(() => ctx.inp.focus(), 50);
    }
    function go(i) { if (i < 0 || i >= items.length) return; m.idx = i; m.t = now(); save(); show(); }
    function askHandIn() {
      const n = items.filter((it) => { const a = m.ans[it.id]; return a !== undefined && a !== null && a !== '' && !(Array.isArray(a) && !a.length); }).length;
      openDialog({ title: 'Hand in test ' + w + '?', body: 'You answered ' + n + ' of ' + items.length + '.' + (n < items.length ? ' Blank questions score 0.' : ''), focusIndex: 0, actions: [{ label: 'Keep working', primary: true }, { label: 'Hand it in', onClick: () => handInNow(false) }] });
    }
    function handInNow(timeUp) {
      if (m.done) return;
      const results = {};
      let score = 0, max = 0;
      items.forEach((it) => {
        const r = gradeMockItem(it, m.ans[it.id]);
        results[it.id] = r; score += r.pts; max += r.max;
        record({ item: it.id, skill: it.skill, score: r.pts / r.max, ok: r.st === 'right', given: m.ans[it.id], misc: r.misc || null, mode: 'mock' + w });
      });
      Object.assign(m, { done: true, doneAt: now(), t: now(), score, max, results, timeUp: !!timeUp });
      save([{ kind: 'mock-done', t: now(), payload: { which: w, score, max, minutes: mins(now() - m.startedAt), timeUp: !!timeUp } }]);
      onDone();
    }
    if (m.timer && m.endsAt <= now()) { handInNow(true); return; }
    show();
  }
  function showReview(w, onDone) {
    state.screen = 'review';
    const m = D()[mockKey(w)];
    if (!m || !m.done) { onDone(); return; }
    const items = mockItems(w);
    const other = w === 'B' ? D().mockA : null;
    const counts = { right: 0, label: 0, form: 0, wrong: 0, blank: 0 };
    items.forEach((it) => { const r = m.results[it.id]; if (r) counts[r.st === 'unreadable' ? 'wrong' : r.st] = (counts[r.st === 'unreadable' ? 'wrong' : r.st] || 0) + 1; });
    const ST_TEXT = { right: 'Full credit', label: 'Label or cents: −1', form: 'Right value, wrong form: half', wrong: 'Not yet', blank: 'Blank', unreadable: 'Could not read it' };
    const rows = items.map((it, i) => {
      const r = m.results[it.id] || { st: 'blank', pts: 0, max: kindPts(it) };
      const given = m.ans[it.id];
      const givenHtml = given === undefined || given === null || given === '' ? '<span class="soft">blank</span>'
        : it.answer.type === 'choice' ? md(it.answer.choices[given]) : it.answer.type === 'order' ? (Array.isArray(given) ? given.map((g) => md(it.answer.items[g])).join(' &lt; ') : '') : K.typed(given);
      const li = h('li', { class: 'rv rv-' + r.st }, [
        h('div', { class: 'rv-top' }, [h('span', { class: 'rv-n' }, String(i + 1)), h('span', { class: 'rv-st' }, ST_TEXT[r.st] || r.st), h('span', { class: 'rv-pts' }, r.pts + ' / ' + r.max)]),
      ]);
      if (r.st !== 'right') {
        const fb = r.fb ? md(r.fb) : r.msg ? esc(r.msg) : r.misc && C.misc[r.misc] ? md(C.misc[r.misc].explain) : '';
        const walk = h('div', { class: 'rv-walk' });
        const wbtn = it.steps && it.steps.length ? btn('Walk through it', () => { wbtn.remove(); walkthrough(walk, it.steps, { compact: true, onDone: () => walk.appendChild(note('good', 'Got it.', null)) }); }, 'btn-small') : null;
        add(li, [
          h('div', { class: 'rv-q', html: md(it.prompt) }),
          it.figure ? h('div', { class: 'rv-fig' }, FIG.render(it.figure)) : null,
          h('p', { class: 'rv-a' }, [h('span', { class: 'note-label' }, 'You wrote'), h('span', { html: givenHtml })]),
          h('p', { class: 'rv-a' }, [h('span', { class: 'note-label' }, 'Answer'), h('span', { html: md(M.answerMarkup(it.answer)) })]),
          fb ? h('div', { class: 'rv-fb', html: fb }) : null,
          r.misc ? miscBlock(r.misc) : null,
          wbtn, walk,
        ]);
      }
      return li;
    });
    const misses = items.filter((it) => (m.results[it.id] || {}).st !== 'right');
    mountScreen(h('div', { class: 'review' }, [
      h('p', { class: 'eyebrow' }, 'Practice test ' + w + ' · scored review' + (m.timeUp ? ' · time ran out' : '')),
      h('h1', { class: 'bigscore', tabindex: '-1', 'data-focus': '' }, [h('span', null, m.score + ' / ' + m.max), h('small', null, Math.round(m.score / m.max * 100) + '%')]),
      other && other.done ? h('p', { class: 'lede' }, 'Test A: ' + other.score + ' / ' + other.max + ' → Test B: ' + m.score + ' / ' + m.max + (m.score > other.score ? '. That is ' + (m.score - other.score) + ' points more.' : '.')) : null,
      h('p', { class: 'quote' }, ['Labels cost a point, like on Mr. B’s test. ', h('span', { class: 'soft' }, MR_B.labels)]),
      h('ul', { class: 'rv-sum' }, [
        h('li', null, counts.right + ' full credit'), counts.label ? h('li', null, counts.label + ' lost a point for a label or cents') : null,
        counts.form ? h('li', null, counts.form + ' right value in the wrong form') : null, h('li', null, (counts.wrong + counts.blank) + ' to fix'),
      ]),
      h('ol', { class: 'rv-list' }, rows),
      h('div', { class: 'end-actions' }, [
        misses.length ? btn('Redo 3 of the misses now', () => runSet({ title: 'Redo test ' + w + ' misses', mode: 'redo', queue: misses.slice(0, 3).map((x) => x.id), onDone: () => showReview(w, onDone), noTimeBox: true }), '') : null,
        btn('Done reviewing', onDone, 'btn-primary'),
      ]),
    ]));
  }

  /* =====================================================================
   * The day: run the next task of the current block
   * ===================================================================== */
  function taskLabel(t) {
    if (!t) return '';
    if (t.k === 'diag') return t.done || (D().diag && D().diag.done) ? 'Check-in' : D().diag && D().diag.idx ? 'Finish the check-in' : 'Start the check-in';
    if (t.k === 'results') return 'See your results';
    if (t.k === 'lesson') return 'Lesson: ' + ((lessonFor(t.skill) || {}).title || skillName(t.skill));
    if (t.k === 'mock') return (D()[mockKey(t.which)] && D()[mockKey(t.which)].startedAt ? 'Finish practice test ' : 'Practice test ') + t.which;
    if (t.k === 'review') return 'Review test ' + t.which;
    if (t.k === 'summary') return 'End-of-day summary';
    if (t.k === 'set') return { word: 'Word problems', convert: 'Conversion practice', ops: 'Operations practice', mixed: 'Mixed practice', retest: 'Re-test: skills from earlier today', mockfix: 'Fix your test A misses' }[t.focus] || 'Practice';
    return '';
  }
  function setQueue(t) {
    const used = new Set();
    if (t.focus === 'word') return wordQueue(t.n || 10, used);
    if (t.focus === 'mixed') return mixedQueue(t.n || 12, used);
    if (t.focus === 'convert' || t.focus === 'ops') {
      const sk = groupSkills(t.focus); const out = [];
      for (let k = 0; k < (t.n || 8) && sk.length; k++) out.push(...pickFor(weightedSkill(sk), 1, used, { short: true }));
      return out;
    }
    if (t.focus === 'retest') {
      const sk = taughtToday().length ? taughtToday() : C.skills.filter((s) => skillState(s).status !== 'strong').slice(0, 5);
      const out = [];
      sk.forEach((s) => out.push(...pickFor(s, sk.length > 4 ? 1 : 2, used)));
      return shuffle(out);
    }
    if (t.focus === 'mockfix') {
      const m = D().mockA;
      if (!m || !m.results) return [];
      const missed = C.mock.items.filter((id) => m.results[id] && m.results[id].st !== 'right');
      const out = [];
      missed.slice(0, 8).forEach((id) => { out.push(id); const it = getItem(id); if (it) { const tw = pickTwin(it, (m.results[id] || {}).misc, used); if (tw) out.push(tw); } });
      return out;
    }
    return [];
  }
  function runTask() {
    if (stoppedToday()) { showStop(); return; }
    const p = day();
    if (p.brk) { showBreak(); return; }
    const t = nextTask();
    if (!t) { if (dayDone()) showSummary(); else { finishBlock(); save(); showHome(); } return; }
    state.inDay = true;
    const done = () => { completeTask(t); showHome(); };
    if (t.k === 'diag') runDiag(() => { completeTask(t); showResults(() => { const r = nextTask(); if (r && r.k === 'results') completeTask(r); showHome(); }); });
    else if (t.k === 'results') showResults(done);
    else if (t.k === 'lesson') runLessonFlow(t.skill, done, true);
    else if (t.k === 'mock') { const m = D()[mockKey(t.which)]; if (m && m.startedAt) runMock(t.which, done); else showMockIntro(t.which, done); }
    else if (t.k === 'review') showReview(t.which, done);
    else if (t.k === 'summary') { completeTask(t); showSummary(); }
    else if (t.k === 'set') {
      const q = setQueue(t);
      if (!q.length) { done(); return; }
      runSet({ title: taskLabel(t), mode: t.focus === 'mockfix' ? 'fix' : t.focus, queue: q, onDone: done, doneLabel: 'Back to the plan' });
    }
  }

  function nextThreeSection(back) {
    const weak = C.skills.filter((s2) => lessonFor(s2) && skillState(s2).status !== 'strong')
      .sort((a, b) => (skillState(a).score || 0) - (skillState(b).score || 0)).slice(0, 3);
    if (!weak.length) return h('section', { class: 'next3' }, [h('h2', { class: 'section-title' }, 'Your next 3 things'), h('p', null, 'Every skill shows as strong. Take a practice test.')]);
    return h('section', { class: 'next3', 'aria-labelledby': 'n3H' }, [
      h('h2', { class: 'section-title', id: 'n3H' }, 'Your next 3 things'),
      h('ol', { class: 'n3-list' }, weak.map((s2) => h('li', null, btn([h('span', { class: 'lx-t' }, (lessonFor(s2) || {}).title || skillName(s2)), h('span', { class: 'lx-m' }, skillName(s2) + ' · lesson, then 3 to 5 problems'), h('span', { class: 'skill-pill is-' + skillState(s2).status }, STATUS_TEXT[skillState(s2).status])], () => { state.inDay = false; runLessonFlow(s2, back); }, 'lx-btn')))),
    ]);
  }

  /* =====================================================================
   * Home: the study day
   * ===================================================================== */
  function showHome() {
    state.inDay = false;
    if (stoppedToday() && state.screen !== 'stop') { showStop(); return; }
    const onBreak = !!day().brk;
    if (onBreak && state.screen !== 'break' && state.screen !== 'home' && state.screen !== 'loading') { showBreak(); return; }
    state.screen = 'home';
    const p = day();
    const cur = p.cur;
    if (!p.blocks[cur].tasks && (cur > 0 || D().diag)) ensureTasks();
    const t = onBreak ? null : nextTask();
    const b = BLOCKS[cur];
    const blockMs = p.blocks[cur].ms || 0;
    const nowCard = h('section', { class: 'nowcard', 'aria-labelledby': 'nowH' }, [
      h('p', { class: 'now-k' }, ['Block ', String(cur + 1), ' of 7 · ', h('span', { 'data-block-min': '' }, String(mins(blockMs))), ' of about ' + b.min + ' min']),
      h('h2', { class: 'now-h', id: 'nowH' }, b.name),
      (() => { const others = (p.blocks[cur].tasks || buildTasks(cur)).filter((x) => x !== t && !(t && x.k === t.k && x.skill === t.skill && x.focus === t.focus && !x.done)); return others.length ? h('div', { class: 'now-tasks' }, [h('span', { class: 'now-tasks-k' }, 'In this block:')].concat(others.map((x) => h('span', { class: 'tchip' + (x.done ? ' is-done' : '') }, [x.done ? h('span', { html: ICON.check }) : null, taskLabel(x)])))) : null; })(),
      blockOver() ? h('p', { class: 'note-small' }, 'This block is past its time. Finish the next thing, then take your break.') : null,
      t && t.why ? h('p', { class: 'note-small' }, t.why) : null,
      onBreak ? h('p', { class: 'note-small' }, 'Block done. You are on a break; the next block opens when it ends.') : null,
      btn([h('span', { class: 't' }, onBreak ? 'Back to the break timer' : t ? taskLabel(t) : 'Wrap up'), h('span', { class: 'kbd', 'aria-hidden': 'true' }, 'Enter')], runTask, 'btn-primary start-btn', { 'data-go': '' }),
    ]);
    const path = h('ol', { class: 'daypath', 'aria-label': 'The day plan' }, BLOCKS.flatMap((blk, i) => {
      const bs = p.blocks[i];
      const st = bs.doneAt ? 'done' : i === cur ? 'cur' : 'next';
      const rows = [h('li', { class: 'dp-block is-' + st }, [
        h('span', { class: 'dp-dot', 'aria-hidden': 'true', html: st === 'done' ? ICON.check : String(i + 1) }),
        h('span', { class: 'dp-body' }, [h('span', { class: 'dp-name' }, blk.name), h('span', { class: 'dp-meta' }, st === 'done' ? 'done · ' + mins(bs.ms || 0) + ' min' : '~' + blk.min + ' min · ' + blk.blurb)]),
      ])];
      if (i < BLOCKS.length - 1) rows.push(h('li', { class: 'dp-break' + (bs.doneAt && (p.cur > i) ? ' is-done' : '') }, BREAKS[i] >= 30 ? BREAKS[i] + '-minute meal break' : BREAKS[i] + '-minute break'));
      return rows;
    }));
    const skills = h('section', { class: 'skills-card', 'aria-labelledby': 'skH' }, [
      h('h2', { class: 'section-title', id: 'skH' }, 'Skills'),
      h('ul', { class: 'skills-list' + (D().diag && D().diag.done ? '' : ' is-quiet') }, C.skills.map((s) => {
        const st = skillState(s).status;
        return h('li', { class: 'sk-row' }, [h('span', { class: 'sk-name' }, skillName(s)), h('span', { class: 'skill-pill is-' + st }, STATUS_TEXT[st])]);
      })),
    ]);
    const mockBtn = (w) => {
      const m = D()[mockKey(w)];
      const label = m && m.done ? 'Test ' + w + ': ' + m.score + ' / ' + m.max : m && m.startedAt ? 'Finish test ' + w : 'Practice test ' + w;
      return btn([h('span', { class: 't' }, label), h('span', { class: 's' }, m && m.done ? 'See the review' : '24 questions, 78 pts, 45 min')], () => {
        state.inDay = false;
        const back = () => showReview(w, showHome);
        if (m && m.done) back(); else if (m && m.startedAt) runMock(w, back); else showMockIntro(w, back);
      }, 'mode-btn');
    };
    const dg = D().diag;
    const direct = h('section', { class: 'tools', 'aria-labelledby': 'directH' }, [
      h('h2', { class: 'section-title', id: 'directH' }, 'Jump straight in'),
      h('div', { class: 'modes' }, [
        btn([h('span', { class: 't' }, dg && dg.done ? 'Check-in results' : dg && dg.idx ? 'Finish the check-in' : 'Check-in'), h('span', { class: 's' }, dg && dg.done ? 'Your skill map' : C.diag.length + ' questions, about 12 min')], () => { state.inDay = false; if (dg && dg.done) showResults(showHome); else runDiag(() => showResults(showHome)); }, 'mode-btn'),
        mockBtn('A'), mockBtn('B'),
        btn([h('span', { class: 't' }, 'Car rides'), h('span', { class: 's' }, '5-minute sets for the phone')], showCar, 'mode-btn'),
      ]),
    ]);
    const nextThree = dg && dg.done ? nextThreeSection(showHome) : null;
    const tools = h('section', { class: 'tools', 'aria-labelledby': 'toolsH' }, [
      h('h2', { class: 'section-title', id: 'toolsH' }, 'Also here'),
      h('div', { class: 'modes' }, [
        btn([h('span', { class: 't' }, 'Morning of the test'), h('span', { class: 's' }, '5 warm-ups, then 10 minutes of worry-writing')], showMorning, 'mode-btn'),
        btn([h('span', { class: 't' }, 'All lessons'), h('span', { class: 's' }, C.lessons.length + ' lessons, any order')], showLessons, 'mode-btn'),
        btn([h('span', { class: 't' }, 'For a parent'), h('span', { class: 's' }, 'Summary to copy')], showParent, 'mode-btn'),
      ]),
    ]);
    const foot = h('div', { class: 'home-foot' }, [
      h('span', null, ['Studied today: ', h('b', { 'data-active-min': '' }, String(activeMin())), ' min']),
      btn('Start over', askReset, 'btn-quiet'),
      ST.cloud ? btn('Switch code', () => showCodeScreen({ canCancel: true }), 'btn-quiet') : null,
      !ST.cloud && !ST.isPersistent() ? h('span', null, 'Progress is not being saved in this browser.') : null,
      C.fixture ? h('span', { class: 'fixture-note' }, 'Sample content (content files missing)') : null,
    ]);
    const hero = h('div', { class: 'home-main' }, [
      h('p', { class: 'eyebrow', html: testLine() + ' · Test - Number Systems · 6H Balzano Math' }),
      h('h1', { class: 'wordmark', tabindex: '-1', 'data-focus': '' }, ['Max’s ', h('span', { class: 'fl f' }, 'F'), '/', h('span', { class: 'fl d' }, 'D'), '/', h('span', { class: 'fl p' }, 'P'), ' study day']),
      syncNode(),
      state.homeNote ? h('p', { class: 'home-note', role: 'status' }, state.homeNote) : null,
      nowCard,
      h('section', { class: 'testcard', 'aria-labelledby': 'testH' }, [
        h('h2', { class: 'section-title', id: 'testH' }, 'What’s on the test'),
        h('ul', null, [
          h('li', null, [h('span', { class: 'pts' }, '9 × 2 pts'), ' short questions: converting fractions, decimals and percents, and comparing them']),
          h('li', null, [h('span', { class: 'pts' }, '15 × 4 pts'), ' word problems with fractions, decimals and money']),
          h('li', null, [h('b', null, '78 points'), ' in all. Labels count.']),
        ]),
        h('p', { class: 'quote' }, ['Mr. B: ', MR_B.labels, ' ', MR_B.rounding]),
      ]),
      h('p', { class: 'quote' }, ['Mr. B: ', MR_B.think]),
      h('p', { class: 'quiet' }, 'Using Math Lab too? Do the check-in and the practice tests here; they match Mr. B’s test format.'),
    ]);
    state.homeNote = '';
    mountScreen(h('div', { class: 'home' }, [hero, h('div', { class: 'home-side' }, [nextThree, h('section', { class: 'day-sec', 'aria-labelledby': 'dayH' }, [h('h2', { class: 'section-title', id: 'dayH' }, 'Suggested plan for the day'), path]), h('div', { class: 'side-col' }, [direct, skills, tools])]), foot]));
    const onKey = (e) => { if (e.key === 'Enter' && !state.dialog && (!document.activeElement || ['BUTTON', 'INPUT', 'TEXTAREA', 'A', 'SUMMARY'].indexOf(document.activeElement.tagName) < 0)) { e.preventDefault(); runTask(); } };
    document.addEventListener('keydown', onKey);
    state.cleanup.push(() => document.removeEventListener('keydown', onKey));
    ST.refresh();
  }
  function askReset() {
    openDialog({
      title: 'Start over?',
      body: ST.cloud ? 'This erases the check-in, lessons, practice and both practice tests for this practice code, on every device. It cannot be undone.' : 'This erases the check-in, lessons, practice and both practice tests on this device. It cannot be undone.',
      focusIndex: 0,
      actions: [{ label: 'Keep my progress', primary: true }, { label: 'Yes, erase it', onClick: () => { ST.reset(); state.homeNote = 'Progress erased. Fresh start.'; showHome(); } }],
    });
  }

  /* ---------- breaks: real ones ---------- */
  function showBreak() {
    state.screen = 'break';
    const p = day(), br = p.brk;
    const endAt = br.startedAt + br.len * 60000, earlyAt = br.startedAt + Math.min(5, br.len) * 60000;
    const clock = h('p', { class: 'break-clock', role: 'timer' }, fmtClock(endAt - now()));
    const back = btn('I’m back', () => { startNextBlock(); showHome(); }, 'btn-primary start-btn');
    const meal = br.len >= 30;
    mountScreen(h('div', { class: 'breakscreen' }, [
      h('p', { class: 'eyebrow' }, 'Block ' + (br.after + 1) + ' done · next: ' + BLOCKS[br.after + 1].name),
      h('h1', { class: 'wordmark', tabindex: '-1', 'data-focus': '' }, meal ? 'Meal break' : 'Break'),
      clock,
      h('ul', { class: 'break-list' }, [
        h('li', null, 'Stand up and move around.'),
        h('li', null, 'Drink some water' + (meal ? ' and eat a real meal.' : '.')),
        h('li', null, 'Look at something far away. Give your eyes a rest from the screen.'),
      ]),
      h('p', { class: 'quiet' }, 'Breaks help the morning’s work stick. The next block opens when the timer ends' + (br.len > 5 ? '; after 5 minutes you can come back early.' : '.')),
      h('div', { class: 'end-actions' }, [back, btn('Home', () => { state.screen = 'home'; showHome(); }, 'btn-quiet')]),
    ]));
    const tick = () => {
      const left = endAt - now();
      clock.textContent = left > 0 ? fmtClock(left) : '0:00';
      back.disabled = now() < earlyAt;
      back.querySelector && (back.textContent = left <= 0 ? 'Start block ' + (br.after + 2) : now() < earlyAt ? 'I’m back (in ' + fmtClock(earlyAt - now()) + ')' : 'I’m back');
    };
    tick();
    const iv = setInterval(tick, 1000);
    state.cleanup.push(() => clearInterval(iv));
  }

  /* ---------- firm, kind stop ---------- */
  function showStop() {
    state.screen = 'stop';
    const p = day();
    if (p.stopped !== todayKey()) { p.stopped = todayKey(); touchDay(); save(); }
    mountScreen(h('div', { class: 'stopscreen' }, [
      h('p', { class: 'eyebrow' }, 'That’s the day: ' + activeMin() + ' minutes of real work'),
      h('h1', { class: 'wordmark', tabindex: '-1', 'data-focus': '' }, 'Done for today.'),
      h('p', { class: 'lede' }, 'More studying now would cost more than it gives. Sleep is when today’s practice gets locked in, so the best thing left is a normal evening and a full night’s sleep.'),
      progressCompare(),
      h('p', { class: 'quote' }, ['Mr. B: ', MR_B.think]),
      h('div', { class: 'end-actions' }, [btn('Summary for a parent', showParent, ''), btn('Tomorrow morning: warm-up and worry-writing', showMorning, 'btn-quiet')]),
    ]));
  }

  /** Before (check-in) vs now, per skill, plus the two tests. */
  function progressCompare() {
    const rows = C.skills.map((s) => {
      const before = diagState(s) || 'untested', after = skillState(s).status;
      const up = (x) => ({ weak: 0, untested: 0.5, shaky: 1, strong: 2 }[x]);
      return h('tr', { class: up(after) > up(before) ? 'is-up' : '' }, [h('th', { scope: 'row' }, skillName(s)), h('td', null, h('span', { class: 'skill-pill is-' + before }, STATUS_TEXT[before])), h('td', null, h('span', { class: 'skill-pill is-' + after }, STATUS_TEXT[after]))]);
    });
    const a = D().mockA, b = D().mockB;
    return h('div', { class: 'compare' }, [
      h('div', { class: 'table-wrap' }, h('table', { class: 'cmp' }, [h('thead', null, h('tr', null, [h('th', null, 'Skill'), h('th', null, 'Check-in'), h('th', null, 'Now')])), h('tbody', null, rows)])),
      a && a.done ? h('p', { class: 'cmp-mock' }, ['Practice test A: ', h('b', null, a.score + ' / ' + a.max), b && b.done ? [' → test B: ', h('b', null, b.score + ' / ' + b.max)] : null]) : null,
    ]);
  }
  function showSummary() {
    state.screen = 'summary';
    const p = day();
    if (dayDone() && p.stopped !== todayKey()) { p.stopped = todayKey(); touchDay(); save(); }
    const fixed = C.skills.filter((s) => { const b = diagState(s); const a = skillState(s).status; return b && b !== 'strong' && a === 'strong'; });
    mountScreen(h('div', { class: 'stopscreen' }, [
      h('p', { class: 'eyebrow' }, 'End of the study day · ' + activeMin() + ' minutes'),
      h('h1', { class: 'wordmark', tabindex: '-1', 'data-focus': '' }, 'That’s the whole plan.'),
      fixed.length ? h('p', { class: 'lede' }, 'Fixed today: ' + fixed.map(skillName).join(', ') + '.') : h('p', { class: 'lede' }, 'Here is where you started and where you are now.'),
      progressCompare(),
      h('p', null, 'Tonight: no more studying. Sleep is when this gets locked in. Tomorrow morning, five warm-up problems and ten minutes of worry-writing right before the test.'),
      h('p', { class: 'quote' }, ['Mr. B: ', MR_B.think]),
      h('div', { class: 'end-actions' }, [btn('Summary for a parent', showParent, 'btn-primary'), btn('Back to the plan', () => { state.screen = 'stop'; showStop(); }, 'btn-quiet')]),
    ]));
  }

  /* =====================================================================
   * Car rides (phone): 5-minute sets
   * ===================================================================== */
  function showCar() {
    state.screen = 'car';
    const start = (title, q) => runSet({ title, mode: 'car', queue: q, onDone: showCar, leave: showCar, doneLabel: 'Another ride', noTimeBox: true });
    const sk = C.skills;
    mountScreen(h('div', { class: 'car' }, [
      h('div', { class: 'qhead' }, [btn('Plan', showHome, 'btn-quiet btn-small'), syncNode()]),
      h('h1', { class: 'wordmark', tabindex: '-1', 'data-focus': '' }, 'Car rides'),
      h('p', { class: 'lede' }, 'Eight quick problems, about five minutes. Same progress as the laptop.'),
      h('div', { class: 'car-big' }, [
        btn([h('span', { class: 't' }, 'Mixed review'), h('span', { class: 's' }, 'Conversions and word problems')], () => start('Mixed review', mixedQueue(CAR_LEN, new Set())), 'btn-primary car-btn'),
        btn([h('span', { class: 't' }, 'Conversions only'), h('span', { class: 's' }, 'F, D, P and comparing')], () => { const u = new Set(); const q = []; for (let k = 0; k < CAR_LEN; k++) q.push(...pickFor(weightedSkill(groupSkills('convert')), 1, u, { short: true })); start('Conversions', q); }, 'car-btn'),
        D().recent.length ? btn([h('span', { class: 't' }, 'My recent misses'), h('span', { class: 's' }, 'Try them again')], () => start('Recent misses', Array.from(new Set(D().recent.slice().reverse().map((r) => r.item))).filter(getItem).slice(0, CAR_LEN)), 'car-btn') : null,
      ]),
      h('h2', { class: 'section-title' }, 'One skill'),
      h('ul', { class: 'car-skills' }, sk.map((s) => h('li', null, btn([h('span', { class: 'sk-name' }, skillName(s)), h('span', { class: 'skill-pill is-' + skillState(s).status }, STATUS_TEXT[skillState(s).status])], () => start(skillName(s), pickFor(s, CAR_LEN, new Set(), { allowKnown: true })), 'car-skill')))),
    ]));
  }

  /* =====================================================================
   * Morning of the test: 5 warm-ups, then worry-writing (local only, erased)
   * ===================================================================== */
  const WORRY_KEY = 'maxFdpPrep.worry';
  function showMorning() {
    state.screen = 'morning';
    const weak = C.skills.slice().sort((a, b) => (skillState(a).score === null ? 0.6 : skillState(a).score) - (skillState(b).score === null ? 0.6 : skillState(b).score));
    const used = new Set();
    const q = [];
    weak.slice(0, 3).forEach((s) => q.push(...pickFor(s, 1, used, { short: true })));
    q.push(...wordQueue(2, used));
    mountScreen(h('div', { class: 'stopscreen' }, [
      h('div', { class: 'qhead' }, [btn('Plan', showHome, 'btn-quiet btn-small')]),
      h('p', { class: 'eyebrow' }, 'Morning of the test'),
      h('h1', { class: 'wordmark', tabindex: '-1', 'data-focus': '' }, 'Warm up, then clear your head'),
      h('ol', { class: 'facts' }, [h('li', null, 'Five warm-up problems from your shakiest skills (about 8 minutes).'), h('li', null, 'Ten minutes of writing about what worries you, right before the test.')]),
      h('div', { class: 'end-actions' }, [btn('Start the warm-up', () => runSet({ title: 'Morning warm-up', mode: 'morning', queue: q.slice(0, MORNING_LEN), noTimeBox: true, doneLabel: 'Go to worry-writing', onDone: () => { const d = D(); d.morning = { t: now(), at: now() }; d.runs.morning = { t: now(), n: ((d.runs.morning || {}).n || 0) + 1 }; save(); showWorry(); } }), 'btn-primary'), btn('Skip to worry-writing', showWorry, 'btn-quiet')]),
    ]));
  }
  function showWorry() {
    state.screen = 'worry';
    const ta = h('textarea', { id: 'worry', class: 'worry-text', rows: '10', 'aria-label': 'What worries you about the test', placeholder: 'What could go wrong? What are you nervous about? Write it all down.' });
    try { ta.value = ST.local.get(WORRY_KEY) || ''; } catch (e) { /* ignore */ }
    ta.addEventListener('input', () => ST.local.set(WORRY_KEY, ta.value));
    const clock = h('span', { class: 'timer' }, '10:00');
    let end = 0, iv = null;
    const startBtn = btn('Start the 10-minute timer', () => {
      end = now() + 10 * 60000; startBtn.remove(); ta.focus();
      iv = setInterval(() => { const left = end - now(); clock.textContent = fmtClock(left); if (left <= 0) { clearInterval(iv); clock.textContent = 'Time. Erase it and go.'; } }, 1000);
      state.cleanup.push(() => clearInterval(iv));
    }, 'btn-small');
    const erase = () => { ST.local.del(WORRY_KEY); ta.value = ''; showHome(); };
    mountScreen(h('div', { class: 'worry' }, [
      h('div', { class: 'qhead' }, [btn('Plan', () => askLeave(showHome, 'What you wrote stays on this device until you erase it.'), 'btn-quiet btn-small'), clock]),
      h('h1', { class: 'wordmark', tabindex: '-1', 'data-focus': '' }, 'Write the worries down'),
      h('p', { class: 'lede' }, 'In a 2011 study (Ramirez and Beilock, published in Science), anxious students who wrote about their worries for 10 minutes right before an exam did as well as students who were not anxious.'),
      h('p', { class: 'quiet' }, 'This stays on this device only. It is never sent anywhere, and it is erased when you finish.'),
      ta,
      h('div', { class: 'end-actions' }, [startBtn, btn('Erase it and finish', erase, 'btn-primary')]),
      h('p', { class: 'quote' }, ['Mr. B: ', MR_B.think]),
    ]), '#worry');
  }

  /* ---------- all lessons, any order ---------- */
  function showLessons() {
    state.screen = 'lessons';
    const groupsT = [['convert', 'Conversions and comparing'], ['ops', 'Operations'], ['word', 'Word problems and rounding']];
    mountScreen(h('div', { class: 'lessons-ix' }, [
      h('div', { class: 'qhead' }, [btn('Plan', showHome, 'btn-quiet btn-small'), syncNode()]),
      h('h1', { class: 'wordmark', tabindex: '-1', 'data-focus': '' }, 'All lessons'),
      ...groupsT.map(([g, title]) => {
        const ls = C.lessons.filter((l) => groupOf(l.skill) === g);
        if (!ls.length) return null;
        return h('section', null, [h('h2', { class: 'section-title' }, title), h('ul', { class: 'lx-list' }, ls.map((l) => {
          const r = D().lessons[l.id];
          return h('li', null, btn([h('span', { class: 'lx-t' }, l.title), h('span', { class: 'lx-m' }, [skillName(l.skill), ' · ', String(l.minutes || 6), ' min', r && r.done ? ' · done' : r && r.step ? ' · step ' + (r.step + 1) : '']), h('span', { class: 'skill-pill is-' + skillState(l.skill).status }, STATUS_TEXT[skillState(l.skill).status])], () => runLessonFlow(l.skill, showLessons), 'lx-btn'));
        }))]);
      }),
    ]));
  }

  /* =====================================================================
   * For a parent: plain-text summary with a Copy button
   * ===================================================================== */
  function summaryText() {
    const d = D(), p = day();
    const L = [];
    L.push('Max: F/D/P study day (Test - Number Systems, makeup)');
    L.push('Time studied: ' + activeMin() + ' min');
    p.blocks.forEach((b, i) => { if (b.ms || b.doneAt) L.push('  Block ' + (i + 1) + ' (' + BLOCKS[i].name + '): ' + mins(b.ms || 0) + ' min' + (b.doneAt ? ', done' : '')); });
    if (d.diag && d.diag.done) {
      const right = C.diag.filter((it) => d.diag.ans[it.id] && d.diag.ans[it.id].ok).length;
      L.push('Check-in: ' + right + ' of ' + C.diag.length + ' right');
    }
    const by = { strong: [], shaky: [], weak: [], untested: [] };
    C.skills.forEach((s) => by[skillState(s).status].push(skillName(s)));
    L.push('Skills now');
    if (by.strong.length) L.push('  Strong: ' + by.strong.join(', '));
    if (by.shaky.length) L.push('  Shaky: ' + by.shaky.join(', '));
    if (by.weak.length) L.push('  Needs work: ' + by.weak.join(', '));
    const mis = miscList().slice(0, 8);
    if (mis.length) L.push('Mix-ups seen: ' + mis.map((m) => miscLabel(m.id) + (m.n > 1 ? ' (×' + m.n + ')' : '')).join('; '));
    const done = C.lessons.filter((l) => d.lessons[l.id] && d.lessons[l.id].done).map((l) => l.title);
    if (done.length) L.push('Lessons finished: ' + done.join('; '));
    ['A', 'B'].forEach((w) => { const m = d[mockKey(w)]; if (m && m.done) L.push('Practice test ' + w + ': ' + m.score + ' / ' + m.max + ' (' + Math.round(m.score / m.max * 100) + '%), ' + mins(m.doneAt - m.startedAt) + ' min' + (m.timer ? ', timed' : '')); });
    if (d.mockA && d.mockA.done && d.mockB && d.mockB.done) L.push('Change A → B: ' + (d.mockB.score - d.mockA.score >= 0 ? '+' : '') + (d.mockB.score - d.mockA.score) + ' points');
    return L.join('\n');
  }
  function showParent() {
    state.screen = 'parent';
    const text = summaryText();
    const pre = h('pre', { class: 'summary-text', id: 'sumText', tabindex: '0' }, text);
    const status = h('span', { class: 'copy-status', role: 'status' });
    const copy = btn('Copy', () => {
      const sel = () => { const r = document.createRange(); r.selectNodeContents(pre); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); };
      try {
        navigator.clipboard.writeText(text).then(() => { status.textContent = 'Copied.'; }, () => { sel(); status.textContent = 'Selected. Press Ctrl+C to copy.'; });
      } catch (e) { sel(); status.textContent = 'Selected. Press Ctrl+C to copy.'; }
    }, 'btn-primary');
    const code = ST.currentCode();
    const link = code ? location.href.replace(/[^/]*(#.*)?$/, '') + 'parent.html#' + code : null;
    mountScreen(h('div', { class: 'parent' }, [
      h('div', { class: 'qhead' }, [btn('Plan', showHome, 'btn-quiet btn-small')]),
      h('h1', { class: 'wordmark', tabindex: '-1', 'data-focus': '' }, 'Summary for a parent'),
      pre,
      h('div', { class: 'end-actions' }, [copy, status]),
      link ? h('p', { class: 'quiet' }, ['Live parent view (read-only): ', h('span', { class: 'mono' }, link)]) : h('p', { class: 'quiet' }, 'Parent view on this device: open parent.html next to this page.'),
    ]));
  }

  /* =====================================================================
   * Practice code (cloud mode only)
   * ===================================================================== */
  function showCodeScreen(o) {
    o = o || {};
    state.screen = 'code';
    const input = h('input', { class: 'codein', type: 'text', id: 'codein', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', enterkeyhint: 'go', maxlength: '80', 'aria-label': 'Practice code', 'aria-describedby': 'codeHelp codeErr' });
    const err = h('p', { class: 'code-err', id: 'codeErr', role: 'alert' });
    const go = h('button', { class: 'btn btn-primary code-go', type: 'submit' }, 'Start');
    const form = h('form', { class: 'codeform', novalidate: '' }, [h('label', { class: 'label-hand', for: 'codein' }, 'Practice code'), input, err, go]);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const c = ST.normCode(input.value);
      if (!c) { err.textContent = 'Type the code from your parent’s link.'; input.focus(); return; }
      if (!ST.validCode(c)) { err.textContent = 'That code does not look right. It has 4 to 40 letters, numbers or dashes.'; input.focus(); return; }
      err.textContent = ''; go.disabled = true;
      chooseCode(c);
    });
    mountScreen(h('div', { class: 'codescreen' }, [
      h('h1', { class: 'wordmark', tabindex: '-1', 'data-focus': '' }, 'Type your practice code'),
      h('p', { id: 'codeHelp', class: 'code-help' }, 'Your parent’s link has it at the end, after the # sign. The same code works on the Chromebook and the phone.'),
      form,
      btn('Make a new code', () => { input.value = ST.suggestCode(); input.focus(); }, 'btn-quiet'),
      o.canCancel ? btn('Back', showHome, 'btn-quiet') : null,
    ]));
    if (isFine()) input.focus();
  }
  async function chooseCode(c) {
    if (c === ST.currentCode()) { showHome(); return; }
    await ST.leave();
    startCloud(c);
  }
  async function startCloud(c) {
    state.screen = 'loading';
    mountScreen(h('p', { class: 'loading', role: 'status' }, 'Loading your progress.'));
    ST.setHash(c);
    await ST.open(c);
    state.ready = true;
    showHome();
  }

  /* =====================================================================
   * Boot
   * ===================================================================== */
  async function boot() {
    await loadContent();
    if (!ST.cloud) { ST.openLocal(); state.ready = true; showHome(); return; }
    const c = ST.resolveCode();
    if (c) startCloud(c); else showCodeScreen();
  }
  window.addEventListener('hashchange', () => {
    if (!ST.cloud) return;
    const c = ST.hashCode();
    if (c && c !== ST.currentCode()) ST.leave().then(() => startCloud(c));
  });
  window.FDPApp = {
    state, C, D, M, getItem, runMock, showMockIntro, showLesson, runDiag, showBreak, showSummary, showStop, finishBlock, save, showHome, runTask, runSet, showLessons, showCar, showMorning, showParent, showReview, showResults, runLessonFlow,
    day, nextTask, completeTask, startNextBlock, summaryText, skillState, mixedQueue, wordQueue,
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
