/* parent.js — read-only parent view. Takes the practice code from the URL hash (cloud mode) or reads this
 * device's progress (local-only mode). Shows skills, mix-ups, time per block, both practice tests, recent misses.
 * It never writes anything.
 */
(function () {
  'use strict';
  const ST = window.FDPStore, K = window.FDPMark;
  const root = document.getElementById('app');
  const esc = K.esc;
  const SKILLS = {
    'place-value': 'Comparing decimals', 'pct-dec': 'Percent ↔ decimal', 'frac-dec': 'Fraction ↔ decimal', 'pct-frac': 'Percent ↔ fraction',
    'repeating': 'Repeating decimals', 'compare-mixed': 'Comparing F, D and P', 'gcf-lcm': 'GCF and LCM', 'frac-addsub': 'Adding and subtracting fractions',
    'frac-muldiv': 'Multiplying and dividing fractions', 'dec-ops': 'Decimal operations', 'rounding': 'Math vs real-life rounding',
    'word-frac': 'Fraction word problems', 'word-dec': 'Decimal and money word problems',
  };
  const BLOCKS = ['Check-in', 'Conversions and comparing', 'Fraction and decimal operations', 'Word problems, labels, rounding', 'Practice test A', 'Fix-ups and mixed practice', 'Practice test B'];
  const skillName = (s) => SKILLS[s] || String(s).replace(/-/g, ' ');
  const miscLabel = (id) => ((window.FDP_MISC || {})[id] || {}).label || String(id).replace(/-/g, ' ');
  const mins = (ms) => Math.round((+ms || 0) / 60000);
  const bank = {};
  (window.FDP_DIAG || []).concat(window.FDP_BANK || []).forEach((it) => { if (it && it.id) bank[it.id] = it; });

  function status(hist) {
    const h = (hist || []).slice(-6);
    if (!h.length) return 'untested';
    let sw = 0, s = 0;
    h.forEach((e, i) => { const w = 1 + i * 0.5; sw += w; s += w * (+e[1] || 0); });
    const sc = s / sw;
    return sc >= 0.8 ? 'strong' : sc >= 0.5 ? 'shaky' : 'weak';
  }
  const TXT = { strong: 'Strong', shaky: 'Shaky', weak: 'Needs work', untested: 'Not checked yet' };

  function render(d, events, code) {
    const total = Object.values(d.time || {}).reduce((a, b) => a + (+b || 0), 0);
    const skills = Object.keys(SKILLS).filter((s) => d.hist[s]).concat(Object.keys(d.hist).filter((s) => !SKILLS[s]));
    const misc = Object.keys(d.miscLog || {}).map((id) => ({ id, n: d.miscLog[id].length })).sort((a, b) => b.n - a.n);
    const blocks = (d.plan && d.plan.blocks) || [];
    const mA = d.mockA, mB = d.mockB;
    let misses = (events || []).filter((e) => e.kind === 'answer' && e.payload && e.payload.correct === false)
      .map((e) => ({ t: Date.parse(e.at), item: e.payload.item, skill: e.payload.skill, given: e.payload.wrong, misc: e.payload.misconception, mode: e.payload.mode }));
    if (!misses.length) misses = (d.recent || []).slice().reverse();
    misses = misses.slice(0, 25);
    const fmtT = (t) => { try { return new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } };
    const html = [];
    html.push('<p class="eyebrow">Read-only parent view' + (code ? ' · code <b>' + esc(code) + '</b>' : ' · this device') + '</p>');
    html.push('<h1 class="wordmark">Max’s <span class="fl f">F</span>/<span class="fl d">D</span>/<span class="fl p">P</span> progress</h1>');
    html.push('<div class="parent-grid">');
    html.push('<section class="pcard"><h2 class="section-title">Time</h2><p class="pbig">' + mins(total) + ' min</p><ul class="plist">' +
      blocks.map((b, i) => (b.ms || b.doneAt ? '<li><span>' + (i + 1) + '. ' + esc(BLOCKS[i] || 'Block') + '</span><b>' + mins(b.ms) + ' min' + (b.doneAt ? ' ✓' : '') + '</b></li>' : '')).join('') + '</ul></section>');
    const mock = (m, w) => (m && m.done ? '<b>' + m.score + ' / ' + m.max + '</b> (' + Math.round(m.score / m.max * 100) + '%)' : m && m.startedAt ? 'in progress' : 'not yet');
    html.push('<section class="pcard"><h2 class="section-title">Practice tests</h2><p>Test A: ' + mock(mA, 'A') + '</p><p>Test B: ' + mock(mB, 'B') + '</p>' +
      (mA && mA.done && mB && mB.done ? '<p class="pbig">' + (mB.score - mA.score >= 0 ? '+' : '') + (mB.score - mA.score) + ' points</p>' : '') + '</section>');
    html.push('<section class="pcard"><h2 class="section-title">Skills</h2><ul class="skills-list">' + (skills.length ? skills.map((s) => { const st = status(d.hist[s]); return '<li class="sk-row"><span class="sk-name">' + esc(skillName(s)) + '</span><span class="skill-pill is-' + st + '">' + TXT[st] + '</span></li>'; }).join('') : '<li class="quiet">No answers yet.</li>') + '</ul></section>');
    html.push('<section class="pcard"><h2 class="section-title">Mix-ups seen</h2>' + (misc.length ? '<ul class="plist">' + misc.map((m) => '<li><span>' + esc(miscLabel(m.id)) + '</span><b>×' + m.n + '</b></li>').join('') + '</ul>' : '<p class="quiet">None yet.</p>') + '</section>');
    html.push('</div>');
    html.push('<section class="pcard"><h2 class="section-title">Recent misses</h2>' + (misses.length ? '<ul class="pmiss">' + misses.map((r) => {
      const it = bank[r.item];
      return '<li><span class="soft">' + fmtT(r.t) + '</span> <b>' + esc(skillName(r.skill)) + '</b>' + (it ? ': ' + esc(K.plain(it.prompt)).slice(0, 140) : '') +
        (r.given !== undefined && r.given !== null && r.given !== '' ? ' · wrote <span class="mono">' + esc(String(r.given)) + '</span>' : '') + (r.misc ? ' · <span class="misc-tag">' + esc(miscLabel(r.misc)) + '</span>' : '') + '</li>';
    }).join('') + '</ul>' : '<p class="quiet">None yet.</p>') + '</section>');
    root.innerHTML = '<div class="parentview">' + html.join('') + '</div>';
  }

  async function boot() {
    if (!ST.cloud) { render(ST.openLocal(), [], null); return; }
    const code = ST.hashCode();
    if (!code) { root.innerHTML = '<div class="parentview"><h1 class="wordmark">Parent view</h1><p>Open this page with the practice code at the end of the link, like <span class="mono">parent.html#max-otter-4821</span>.</p></div>'; return; }
    try {
      const r = await ST.readForParent(code);
      render(r.data, r.events, code);
    } catch (e) {
      root.innerHTML = '<div class="parentview"><h1 class="wordmark">Parent view</h1><p class="problem">Could not reach the server. Check the connection and reload.</p></div>';
    }
  }
  window.addEventListener('hashchange', boot);
  boot();
})();
