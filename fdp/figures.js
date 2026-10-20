/* figures.js — every figure type in the spec, drawn as hand-drawn-but-precise inline SVG.
 * FDPFigures.render(spec) -> HTMLElement (a .fig). Never throws: a bad spec renders a quiet note.
 * Colours come from sketch.css classes, so both themes work. Labels that need real math typography
 * (stacked fractions, overbars) are HTML laid over the SVG at percentage positions.
 * Depends on: sketch.js (Sketch), markup.js (FDPMark), math.js (FDPMath).
 */
(function () {
  'use strict';
  const S = window.Sketch, K = window.FDPMark, M = window.FDPMath;
  const esc = K.esc, md = K.md;

  /* While a question is open, a label or caption that states its answer shows "?" instead. */
  let MASK = null;
  function hits(str) {
    const p = M.parse(str);
    return p.ok && (M.eq(p.value, MASK) || M.eq(p.num, MASK));
  }
  /** Mask a raw label string (markup allowed) before it is rendered. */
  function mk(raw) {
    if (!MASK || raw === undefined || raw === null) return raw;
    return String(raw).split(/(\[\[[^\]]*\]\])/).map((seg) => {
      const t = /^\[\[([fmr]):([^\]]*)\]\]$/.exec(seg);
      if (t) return hits(t[2]) ? '?' : seg;
      if (/^\[\[/.test(seg)) return seg;
      return seg.replace(/\$?\d[\d,]*(?:\.\d*)?(?:\(\d+\))?(?:\s+\d+\/\d+)?%?|\$?\d+\/\d+%?/g, (m) => (hits(m) ? '?' : m));
    }).join('');
  }
  const ENT = { '&times;': '×', '&divide;': '÷', '&minus;': '−', '&gt;': '>', '&lt;': '<', '&amp;': '&', '&nbsp;': ' ', '&#215;': '×', '&#247;': '÷' };
  /** Decode the few entities content may put in plain-text figure fields drawn as SVG text. */
  const decEnt = (v) => (typeof v === 'string' ? v.replace(/&(?:times|divide|minus|gt|lt|amp|nbsp|#215|#247);/g, (m) => ENT[m]) : v);
  function div(cls, html) { const d = document.createElement('div'); if (cls) d.className = cls; if (html !== undefined) d.innerHTML = html; return d; }

  /** A figure frame: root .fig > .fig-stage (svg + overlay labels) + optional caption. */
  function frame(spec, W, H, label) {
    const root = div('fig fig-' + spec.type);
    const stage = div('fig-stage');
    root.appendChild(stage);
    const svg = S.svg(stage, W, H, label || 'figure');
    const lab = (x, y, html, cls) => {
      const l = div('fig-label ' + (cls || ''), html);
      l.style.left = (x / W * 100) + '%';
      l.style.top = (y / H * 100) + '%';
      stage.appendChild(l);
      return l;
    };
    return { root, stage, svg, lab, W, H };
  }
  function caption(root, html) { if (html) root.appendChild(div('fig-caption', md(mk(html)))); }
  const num = (v) => { if (typeof v === 'number') return v; try { return M.toNumber(M.parseValue(String(v).replace(/%$/, ''))); } catch (e) { return NaN; } };
  const trimNum = (x) => String(+x.toFixed(6));
  const kindCls = (s) => { s = String(s || '').toLowerCase(); return /%|percent/.test(s) ? 'p' : /\$|dollar|cost|price/.test(s) ? '' : /fraction/.test(s) ? 'f' : /decimal/.test(s) ? 'd' : ''; };

  /* ================= 10x10 grid ================= */
  function grid(spec) {
    const shaded = Math.max(0, num(spec.shaded) || 0);
    const n = Math.min(4, Math.max(1, spec.grids || Math.ceil(shaded / 100 - 1e-9)));
    const C = 20, G = C * 10, gap = 26;
    const whole = Math.floor(shaded + 1e-9);
    const part = shaded - whole;
    const hasPart = part > 1e-6 && shaded < n * 100;
    const inset = hasPart ? 128 : 0;
    const W = n * G + (n - 1) * gap + (hasPart ? gap + inset : 0) + 8, H = G + 44;
    const f = frame(spec, W, H, shaded + ' of 100 squares shaded');
    const s = f.svg;
    for (let g = 0; g < n; g++) {
      const x0 = 4 + g * (G + gap), y0 = 4;
      const count = Math.max(0, Math.min(100, shaded - g * 100));
      const full = Math.floor(count + 1e-9), pp = count - full;
      const cells = S.group(s, 'grid-cells');
      for (let i = 0; i < full; i++) {
        const col = Math.floor(i / 10), row = i % 10;
        S.el('rect', { x: x0 + col * C, y: y0 + row * C, width: C, height: C, class: 'sk-fill-p-solid' }, cells);
      }
      if (pp > 1e-6 && full < 100) {
        const col = Math.floor(full / 10), row = full % 10;
        S.el('rect', { x: x0 + col * C, y: y0 + row * C, width: C, height: C * pp, class: 'sk-fill-p-solid' }, cells);
        S.el('rect', { x: x0 + col * C - 1.5, y: y0 + row * C - 1.5, width: C + 3, height: C + 3, class: 'sk-fill-none sk-p', 'stroke-width': 2.4, fill: 'none' }, cells);
      }
      const lines = S.group(s, 'grid-lines');
      for (let i = 1; i < 10; i++) {
        S.el('line', { x1: x0 + i * C, y1: y0, x2: x0 + i * C, y2: y0 + G, class: 'sk-soft', 'stroke-width': i === 5 ? 1.3 : 0.8, opacity: 0.75 }, lines);
        S.el('line', { x1: x0, y1: y0 + i * C, x2: x0 + G, y2: y0 + i * C, class: 'sk-soft', 'stroke-width': i === 5 ? 1.3 : 0.8, opacity: 0.75 }, lines);
      }
      S.rect(s, x0, y0, G, G, { cls: 'sk-ink', width: 2.2, rough: 0.6 });
      f.lab(x0 + G / 2, y0 + G + 22, (n > 1 ? trimNum(count) + ' of 100' : trimNum(count) + ' of 100 squares'), 'hand soft');
    }
    if (hasPart) {
      const x0 = 4 + n * (G + gap) - gap + gap, y0 = 30, B = 96;
      // dashed lead line from the partial cell to the zoom box
      const gi = Math.floor(shaded / 100), cnt = shaded - gi * 100, full = Math.floor(cnt);
      const col = Math.floor(full / 10), row = full % 10;
      const cx = 4 + gi * (G + gap) + col * C + C, cy = 4 + row * C + C / 2;
      S.line(s, cx + 2, cy, x0 - 4, y0 + B / 2, { cls: 'sk-soft', width: 1.4, dash: '4 5', single: true });
      S.el('rect', { x: x0, y: y0 + B * (1 - 1), width: B, height: B * part, class: 'sk-fill-p-solid' }, s);
      for (let i = 1; i < 10; i++) S.el('line', { x1: x0, y1: y0 + i * B / 10, x2: x0 + B, y2: y0 + i * B / 10, class: 'sk-soft', 'stroke-width': 0.6, opacity: 0.5 }, s);
      S.rect(s, x0, y0, B, B, { cls: 'sk-p', width: 2.4, rough: 0.6 });
      f.lab(x0 + B / 2, y0 - 14, 'zoom: 1 square', 'hand soft');
      f.lab(x0 + B / 2, y0 + B + 18, trimNum(part) + ' of it', 'hand p');
    }
    caption(f.root, spec.caption || (n > 1 ? 'Each grid is 100 squares, so each full grid is 100%. Shaded: ' + trimNum(shaded) + ' squares = ' + trimNum(shaded) + '%.' : trimNum(shaded) + ' out of 100 squares = ' + trimNum(shaded) + '%'));
    return f.root;
  }

  /* ================= place-value chart (HTML table: real type sizes, aligned columns) ================= */
  const INT_PLACES = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands', 'hundred-thousands'];
  const DEC_PLACES = ['tenths', 'hundredths', 'thousandths', 'ten-thousandths', 'hundred-thousandths', 'millionths'];
  function placevalue(spec) {
    const nums = (spec.numbers || []).map((x) => String(x));
    const parts = nums.map((x) => {
      const m = /^\s*(-?)\$?([\d,]*)(?:\.(\d*))?\s*$/.exec(x);
      if (!m) return null;
      return { raw: x, i: (m[2] || '0').replace(/,/g, '').replace(/^0+(?=\d)/, ''), d: m[3] || '' };
    });
    const root = div('fig fig-placevalue');
    if (parts.some((p) => !p)) { root.appendChild(div('fig-caption', esc(nums.join('  vs  ')))); return root; }
    const maxI = Math.max(1, ...parts.map((p) => p.i.length));
    const maxD = Math.max(1, ...parts.map((p) => p.d.length));
    const cols = [];
    for (let k = maxI - 1; k >= 0; k--) cols.push({ name: INT_PLACES[k] || ('10^' + k), side: 'i', k });
    cols.push({ point: true });
    for (let k = 0; k < maxD; k++) cols.push({ name: DEC_PLACES[k] || ('10^-' + (k + 1)), side: 'd', k });
    const digitAt = (p, c) => {
      if (c.side === 'i') { const idx = p.i.length - 1 - c.k; return idx >= 0 ? { ch: p.i[idx], pad: false } : { ch: '', pad: false }; }
      return c.k < p.d.length ? { ch: p.d[c.k], pad: false } : { ch: '0', pad: true };
    };
    // first column (left to right) where the digits differ
    let diffCol = -1;
    if (parts.length >= 2) {
      for (let ci = 0; ci < cols.length && diffCol < 0; ci++) {
        const c = cols[ci];
        if (c.point) continue;
        const ds = parts.map((p) => digitAt(p, c).ch || '0');
        if (ds.some((x) => x !== ds[0])) diffCol = ci;
      }
    }
    const wrap = div('pv-wrap');
    const t = document.createElement('table');
    t.className = 'pv';
    const thead = document.createElement('thead');
    const hr = document.createElement('tr');
    hr.appendChild(Object.assign(document.createElement('th'), { className: 'pv-corner' }));
    cols.forEach((c, ci) => {
      const th = document.createElement('th');
      th.scope = 'col';
      if (c.point) { th.className = 'pv-pt'; th.setAttribute('aria-label', 'decimal point'); }
      else { th.innerHTML = '<span>' + esc(c.name) + '</span>'; if (ci === diffCol) th.className = 'pv-hot'; }
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    t.appendChild(thead);
    const tb = document.createElement('tbody');
    parts.forEach((p) => {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.scope = 'row'; th.className = 'pv-num'; th.textContent = p.raw.trim();
      tr.appendChild(th);
      cols.forEach((c, ci) => {
        const td = document.createElement('td');
        if (c.point) { td.className = 'pv-pt'; td.textContent = '.'; }
        else {
          const dgt = digitAt(p, c);
          td.textContent = dgt.ch;
          if (dgt.pad) td.classList.add('pv-pad');
          if (ci === diffCol) td.classList.add('pv-hot');
        }
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    wrap.appendChild(t);
    root.appendChild(wrap);
    let note = '';
    if (parts.length >= 2 && diffCol >= 0) {
      const c = cols[diffCol];
      note = 'First place that differs: <b>' + esc(c.name) + '</b>.';
      if (parts.length === 2) {
        const a = digitAt(parts[0], c).ch || '0', b = digitAt(parts[1], c).ch || '0';
        note += ' ' + esc(a) + (a < b ? ' &lt; ' : ' &gt; ') + esc(b) + ', so <b>' + esc(parts[0].raw.trim()) + (a < b ? ' &lt; ' : ' &gt; ') + esc(parts[1].raw.trim()) + '</b>.';
      }
    } else if (parts.length >= 2) note = 'Every place matches: the numbers are equal.';
    if (parts.some((p) => p.d.length < maxD)) note += ' <span class="pv-padnote">Grey zeros are placeholders; adding them changes nothing.</span>';
    caption(root, spec.caption ? spec.caption : note);
    return root;
  }

  /* ================= number line ================= */
  function numberline(spec) {
    const W = 540, H = 130, x0 = 34, x1 = 506, y = 78;
    const min = num(spec.min !== undefined ? spec.min : 0), max = num(spec.max !== undefined ? spec.max : 1);
    const ticks = Math.max(1, Math.min(40, spec.ticks || 10));
    const f = frame(spec, W, H, 'number line from ' + min + ' to ' + max);
    const s = f.svg;
    const X = (v) => x0 + (v - min) / (max - min || 1) * (x1 - x0);
    S.line(s, x0 - 14, y, x1 + 14, y, { cls: 'sk-ink', width: 2.4, rough: 0.5 });
    const labelEvery = ticks <= 10 ? 1 : ticks <= 20 ? 2 : ticks / 2;
    for (let i = 0; i <= ticks; i++) {
      const v = min + (max - min) * i / ticks, x = X(v);
      const big = i === 0 || i === ticks || (ticks % 2 === 0 && i === ticks / 2);
      S.line(s, x, y - (big ? 11 : 7), x, y + (big ? 11 : 7), { cls: 'sk-ink', width: big ? 2.2 : 1.6, single: true, rough: 0.3 });
      if (i % labelEvery === 0) f.lab(x, y + 26, esc(trimNum(v)), 'soft');
    }
    const marks = (spec.marks || []).map((m) => ({ m, v: num(m.at) })).filter((o) => isFinite(o.v)).sort((a, b) => a.v - b.v);
    let lastX = -1e9, level = 0;
    marks.forEach((o) => {
      const x = X(o.v);
      level = x - lastX < 70 ? (level + 1) % 2 : 0;
      lastX = x;
      const top = y - 26 - level * 30;
      const cls = /\[\[f|\//.test(o.m.label || '') ? 'f' : /%/.test(o.m.label || '') ? 'p' : 'd';
      S.line(s, x, y - 4, x, top + 6, { cls: 'sk-' + cls, width: 1.6, single: true, rough: 0.2 });
      S.el('circle', { cx: x, cy: y, r: 6, class: 'sk-' + cls, fill: 'var(--card)', 'stroke-width': 3 }, s);
      f.lab(x, top, md(mk(o.m.label !== undefined ? o.m.label : esc(o.m.at))), 'above ' + cls);
    });
    caption(f.root, spec.caption);
    return f.root;
  }

  /* ================= double number line ================= */
  function doubleline(spec) {
    const top = spec.top || { values: [] }, bot = spec.bottom || { values: [] };
    const n = Math.max(top.values.length, bot.values.length, 2);
    const W = 560, H = 170, x0 = 132, x1 = 532, yT = 62, yB = 118;
    const f = frame(spec, W, H, 'double number line');
    const s = f.svg;
    const X = (i) => x0 + (x1 - x0) * i / (n - 1);
    if (spec.highlight !== undefined && spec.highlight !== null && spec.highlight >= 0 && spec.highlight < n) {
      const x = X(spec.highlight);
      S.el('rect', { x: x - 26, y: 18, width: 52, height: 142, rx: 10, class: 'sk-fill-hl' }, s);
    }
    const tc = kindCls(top.label) || 'p', bc = kindCls(bot.label);
    S.line(s, x0 - 12, yT, x1 + 12, yT, { cls: tc ? 'sk-' + tc : 'sk-ink', width: 2.4, rough: 0.5 });
    S.line(s, x0 - 12, yB, x1 + 12, yB, { cls: bc ? 'sk-' + bc : 'sk-ink', width: 2.4, rough: 0.5 });
    for (let i = 0; i < n; i++) {
      const x = X(i);
      S.line(s, x, yT - 8, x, yT + 8, { cls: 'sk-ink', width: 1.8, single: true, rough: 0.3 });
      S.line(s, x, yB - 8, x, yB + 8, { cls: 'sk-ink', width: 1.8, single: true, rough: 0.3 });
      const tv = top.values[i], bv = bot.values[i];
      if (tv !== undefined && tv !== '') { const m = mk(String(tv)); f.lab(x, yT - 22, m === '?' ? '?' : md(m), m === '?' ? 'q' : tc); }
      if (bv !== undefined && bv !== '') { const m = mk(String(bv)); f.lab(x, yB + 24, m === '?' ? '?' : md(m), m === '?' ? 'q' : bc); }
    }
    f.lab(x0 - 22, yT, esc(top.label || ''), 'left hand soft');
    f.lab(x0 - 22, yB, esc(bot.label || ''), 'left hand soft');
    caption(f.root, spec.caption);
    return f.root;
  }

  /* ================= bar / tape model ================= */
  function bar(spec) {
    const parts = (spec.parts || []).filter((p) => p && +p.size > 0);
    const total = parts.reduce((a, p) => a + +p.size, 0) || 1;
    const W = 540, H = 164, x0 = 16, x1 = 524, yT = 54, yB = 104;
    const f = frame(spec, W, H, 'bar model');
    const s = f.svg;
    // whole brace
    if (spec.whole !== undefined) {
      S.line(s, x0, 30, x1, 30, { cls: 'sk-ink', width: 1.8, rough: 0.5 });
      S.line(s, x0, 22, x0, 40, { cls: 'sk-ink', width: 1.8, single: true });
      S.line(s, x1, 22, x1, 40, { cls: 'sk-ink', width: 1.8, single: true });
      const l = f.lab((x0 + x1) / 2, 30, md(mk(String(spec.whole))), 'hand whole');
      l.style.background = 'var(--paper)'; l.style.padding = '0 8px';
    }
    let x = x0;
    parts.forEach((p, i) => {
      const w = (x1 - x0) * (+p.size) / total;
      const muted = p.tone === 'muted';
      S.rect(s, x, yT, w, yB - yT, {
        cls: 'sk-ink', width: 2.2, rough: 0.7,
        fill: muted ? 'hachure' : 'solid', fillCls: muted ? undefined : (p.tone === 'p' || p.tone === 'percent' ? 'sk-fill-p' : 'sk-fill-hl'),
        hachureCls: 'sk-soft', gap: 9, hachureWidth: 1.2,
      });
      if (p.label) {
        const inside = w > 110;
        f.lab(x + w / 2, inside ? (yT + yB) / 2 : yB + 26 + (i % 2) * 24, md(mk(String(p.label))), inside ? (muted ? 'soft' : '') : 'soft');
      }
      x += w;
    });
    caption(f.root, spec.caption);
    return f.root;
  }

  /* ================= decimal point hop ================= */
  function shift(spec, opts) {
    const raw = String(spec.number).replace(/[,$\s]/g, '');
    const neg = raw.startsWith('-');
    const body = neg ? raw.slice(1) : raw;
    const pt = body.indexOf('.');
    let digits = body.replace('.', '');
    let pIdx = pt < 0 ? body.length : pt;
    const places = Math.trunc(+spec.places || 0);
    let target = pIdx + places;
    let padL = 0, padR = 0;
    if (target < 1) { padL = 1 - target; }
    if (target > digits.length) { padR = target - digits.length; }
    digits = '0'.repeat(padL) + digits + '0'.repeat(padR);
    pIdx += padL; target += padL;
    const nCells = digits.length;
    const CW = 50, W = Math.max(300, nCells * CW + 60), H = 168, x0 = (W - nCells * CW) / 2, yD = 108;
    const f = frame(spec, W, H, 'decimal point moves ' + Math.abs(places) + ' places ' + (places < 0 ? 'left' : 'right'));
    const s = f.svg;
    const gx = (k) => x0 + k * CW;           // x of the gap before digit k (decimal point positions)
    // place boxes
    for (let k = 0; k < nCells; k++) {
      S.el('rect', { x: gx(k) + 4, y: yD - 40, width: CW - 8, height: 52, rx: 6, class: 'sk-fill-card sk-grid', 'stroke-width': 1.5 }, s);
    }
    const added = new Set();
    for (let k = 0; k < padL; k++) added.add(k);
    for (let k = nCells - padR; k < nCells; k++) added.add(k);
    const dEls = [];
    for (let k = 0; k < nCells; k++) {
      const t = S.text(s, gx(k) + CW / 2, yD, digits[k], { anchor: 'middle', size: 34, cls: added.has(k) ? 'sk-num-soft' : 'sk-num' });
      dEls.push(t);
    }
    // hops
    const dir = places < 0 ? -1 : 1, hops = Math.abs(places);
    const arcs = S.group(s, 'hops');
    for (let i = 0; i < hops; i++) {
      const a = gx(pIdx + dir * i), b = gx(pIdx + dir * (i + 1));
      const mx = (a + b) / 2;
      S.curve(arcs, [[a, yD + 18], [mx, yD + 44], [b, yD + 18]], { cls: 'sk-d', width: 2, single: true, rough: 0.3 });
      S.text(arcs, mx, yD + 64, String(i + 1), { anchor: 'middle', size: 18, cls: 'sk-text-d' });
    }
    const ghost = S.el('circle', { cx: gx(pIdx), cy: yD + 4, r: 5, class: 'sk-fill-soft', opacity: 0.35 }, s);
    const dot = S.el('circle', { cx: gx(pIdx), cy: yD + 4, r: 6.5, class: 'sk-fill-ink', style: 'fill: var(--d)' }, s);
    if (places === 0) ghost.remove();
    S.text(s, 14, 30, spec.note ? String(spec.note) : (places < 0 ? '÷ ' : '× ') + Math.pow(10, hops), { size: 24, cls: 'sk-text-d' });
    // result text
    let res = digits.slice(0, target) + (target < digits.length ? '.' + digits.slice(target) : '');
    res = res.replace(/^0+(?=\d)/, '');
    if (res.indexOf('.') >= 0) res = res.replace(/0+$/, '').replace(/\.$/, '');
    if (res.startsWith('.')) res = '0' + res;
    const result = (neg ? '-' : '') + res;
    const placeAt = (x) => { dot.setAttribute('cx', x); };
    const showAdded = (on) => { dEls.forEach((t, k) => { if (added.has(k)) t.style.opacity = on ? 1 : 0; }); };
    let stop = null;
    function play() {
      if (stop) stop();
      if (S.reduceMotion() || hops === 0) { placeAt(gx(target)); showAdded(true); arcs.style.opacity = 1; return; }
      placeAt(gx(pIdx)); showAdded(false);
      const per = 0.55, pause = 0.5;
      stop = S.animate((dt, t) => {
        const tt = Math.max(0, t - pause);
        const i = Math.min(hops, Math.floor(tt / per));
        const frac = Math.min(1, (tt - i * per) / per);
        if (i >= hops) { placeAt(gx(target)); dot.setAttribute('cy', yD + 4); showAdded(true); return false; }
        const a = gx(pIdx + dir * i), b = gx(pIdx + dir * (i + 1));
        placeAt(a + (b - a) * frac);
        dot.setAttribute('cy', yD + 4 - Math.sin(Math.PI * frac) * 26);
        dEls.forEach((el, k) => { if (added.has(k)) { const passed = dir < 0 ? k >= pIdx + dir * (i + 1) - 1 && k < pIdx : k >= pIdx && k < pIdx + i + 1; if (passed && frac > 0.5) el.style.opacity = 1; } });
        return true;
      });
    }
    if (opts.quiz) { placeAt(gx(pIdx)); showAdded(false); }
    else f.root.appendChild(div('fig-caption shift-line', '<span class="mth d">' + esc(spec.number) + '</span> ' + esc(spec.note || '') + ' = <span class="mth d"><b>' + esc(mk(result)) + '</b></span>' + (added.size ? ' <span class="soft">(grey zeros are new placeholders)</span>' : '')));
    if (!S.reduceMotion() && hops) {
      const tools = div('fig-tools');
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'btn btn-small btn-quiet'; b.textContent = 'Watch the hop again';
      b.addEventListener('click', play);
      tools.appendChild(b);
      f.root.appendChild(tools);
    }
    caption(f.root, spec.caption);
    // start once attached (so the animation is seen)
    if (!opts.quiz) requestAnimationFrame(() => requestAnimationFrame(play));
    f.root._destroy = () => { if (stop) stop(); };
    return f.root;
  }

  /* ================= long division ================= */
  function longdiv(spec, opts) {
    const D = Math.floor(Math.abs(+spec.dividend || 0)), q = Math.floor(Math.abs(+spec.divisor || 1)) || 1;
    const nd = Math.max(1, Math.min(8, +spec.digits || 4));
    const intStr = String(D);
    const all = intStr + '0'.repeat(nd);
    const intLen = intStr.length;
    const L = all.length;
    // simulate
    const quot = new Array(L).fill('');
    const rows = [];
    let cur = 0, started = false, done = false;
    for (let j = 0; j < L && !done; j++) {
      cur = cur * 10 + (+all[j]);
      const qd = Math.floor(cur / q), prod = qd * q, rem = cur - prod;
      if (!started && qd === 0) {
        if (j >= intLen - 1) quot[j] = '0';
        if (j >= intLen - 1 && cur === 0 && j > intLen - 1) { /* keep going */ }
        continue;
      }
      started = true;
      quot[j] = String(qd);
      rows.push({ j, cur, prod, rem });
      cur = rem;
      if (rem === 0 && j >= intLen - 1) done = true;
    }
    // first repeated remainder
    let rep1 = -1, rep2 = -1;
    for (let b = 0; b < rows.length && rep2 < 0; b++) {
      if (rows[b].rem === 0 || rows[b].j < intLen - 1) continue;
      for (let a = 0; a < b; a++) if (rows[a].rem === rows[b].rem && rows[a].j >= intLen - 1) { rep1 = a; rep2 = b; break; }
    }
    const CW = 26, RH = 30, PW = 12;
    const divW = String(q).length * 16 + 26;
    const xs = 18 + divW;
    const xd = (j) => xs + j * CW + (j >= intLen ? PW : 0) + CW / 2;
    const workW = L * CW + PW;
    const annW = rep2 >= 0 ? 236 : 20;
    const W = xs + workW + 20 + annW, H = 70 + rows.length * RH * 2 + 26;
    const f = frame(spec, W, H, D + ' divided by ' + q);
    const s = f.svg;
    const yQ = 30, yN = 70;
    const T = (x, y, str, cls, anchor) => S.text(s, x, y, str, { anchor: anchor || 'middle', size: 22, cls: cls || 'sk-num' });
    // divisor + bracket
    T(xs - 14, yN, String(q), 'sk-num', 'end');
    S.curve(s, [[xs - 6, yN - 26], [xs + 2, yN - 10], [xs - 4, yN + 8]], { cls: 'sk-ink', width: 2.2, single: true, rough: 0.2 });
    S.line(s, xs - 6, yN - 26, xs + workW + 6, yN - 26, { cls: 'sk-ink', width: 2.2, single: true, rough: 0.3 });
    // dividend
    for (let j = 0; j < L; j++) T(xd(j), yN, all[j], j >= intLen ? 'sk-num-soft' : 'sk-num');
    S.text(s, xs + intLen * CW + PW / 2, yN, '.', { anchor: 'middle', size: 26, cls: 'sk-num' });
    if (opts.quiz) { rows.length = 0; rep2 = -1; quot.fill(''); }
    // quotient
    for (let j = 0; j < L; j++) if (quot[j] !== '') T(xd(j), yQ, quot[j], 'sk-num-d');
    S.text(s, xs + intLen * CW + PW / 2, yQ, '.', { anchor: 'middle', size: 26, cls: 'sk-num-d' });
    // repeating overbar on quotient
    if (rep2 >= 0) {
      // bar over the first full period, like the teacher writes it (0.1666 -> bar over the first 6)
      const ds = M.toDec(M.rat(D, q), 40) || '';
      const mm = /\.(\d*)\((\d+)\)$/.exec(ds);
      if (mm) {
        const ja = intLen + mm[1].length, jb = Math.min(L - 1, ja + mm[2].length - 1);
        if (ja < L) S.line(s, xd(ja) - 10, yQ - 22, xd(jb) + 10, yQ - 22, { cls: 'sk-d', width: 2.6, single: true, rough: 0.2 });
      }
    }
    // work rows
    const rightAlign = (str, j, y, cls) => { for (let k = 0; k < str.length; k++) T(xd(j - (str.length - 1 - k)), y, str[k], cls); };
    rows.forEach((r, i) => {
      const y1 = yN + RH * (2 * i + 1), y2 = y1 + RH;
      const ps = String(r.prod);
      rightAlign(ps, r.j, y1, 'sk-num');
      S.text(s, xd(r.j - ps.length + 1) - 18, y1, '−', { anchor: 'middle', size: 22, cls: 'sk-num-soft' });
      S.line(s, xd(r.j - ps.length + 1) - 12, y1 + 8, xd(r.j) + 12, y1 + 8, { cls: 'sk-ink', width: 1.6, single: true, rough: 0.3 });
      const isRep = i === rep1 || i === rep2;
      const rs = String(r.rem);
      rightAlign(rs, r.j, y2, isRep ? 'sk-num-p' : 'sk-num');
      if (r.j + 1 < L && !(r.rem === 0 && r.j >= intLen - 1)) T(xd(r.j + 1), y2, all[r.j + 1], 'sk-num-soft');
      if (isRep) {
        const cx = xd(r.j) - (rs.length - 1) * CW / 2;
        S.circle(s, cx, y2 - 8, 13 + (rs.length - 1) * 8, { cls: 'sk-p', width: 2, rough: 0.8 });
      }
    });
    if (rep2 >= 0) {
      const y2 = yN + RH * (2 * rep2 + 2);
      const ax = xs + workW + 24;
      S.text(s, ax, y2 - 18, 'remainder ' + rows[rep2].rem + ' again:', { size: 19, cls: 'sk-text-p' });
      S.text(s, ax, y2 + 4, 'the digits repeat forever', { size: 19, cls: 'sk-text-p' });
    }
    const wrap = div('fig-scroll');
    wrap.appendChild(f.stage);
    f.root.insertBefore(wrap, f.root.firstChild);
    f.svg.style.minWidth = Math.min(W, 300) + 'px';
    let cap = spec.caption;
    if (!cap) {
      const v = M.toDec(M.rat(D, q), 30);
      cap = D + ' ÷ ' + q + ' = ' + (v && v.indexOf('(') >= 0 ? '[[r:' + v + ']]' : (v || ''));
    }
    caption(f.root, cap);
    return f.root;
  }

  /* ================= the teacher's F–D–P triangle ================= */
  function fdp(spec) {
    const W = 540, H = 336;
    const f = frame(spec, W, H, 'fraction, decimal, percent triangle');
    const s = f.svg;
    const P = { f: [270, 62], d: [96, 262], p: [444, 262] };
    const focus = spec.focus;
    if (focus && P[focus]) S.circle(s, P[focus][0], P[focus][1], 42, { fill: 'solid', fillCls: 'sk-fill-hl', cls: 'sk-ink', width: 1.4, rough: 1 });
    // edges: double-headed arrows, pulled in from the letters
    const edge = (a, b, cls) => {
      const [x1, y1] = P[a], [x2, y2] = P[b];
      const len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len, pad = 50;
      S.arrow(s, x1 + ux * pad, y1 + uy * pad, x2 - ux * pad, y2 - uy * pad, { cls, width: 2.2, rough: 0.6, head: 12 });
      S.arrow(s, x2 - ux * pad, y2 - uy * pad, x1 + ux * pad, y1 + uy * pad, { cls, width: 0.01, rough: 0, head: 12 });
    };
    edge('f', 'd', 'sk-ink'); edge('d', 'p', 'sk-ink'); edge('p', 'f', 'sk-ink');
    const letter = (k, ch) => S.text(s, P[k][0], P[k][1] + 18, ch, { anchor: 'middle', size: 54, cls: 'sk-text-' + k, weight: focus === k ? 700 : 400 });
    letter('f', 'F'); letter('d', 'D'); letter('p', 'P');
    f.lab(140, 150, 'top ÷ bottom', 'hand soft');
    f.lab(400, 150, 'over 100,<br>simplify', 'hand soft');
    f.lab(270, 250, '× 100 &nbsp;⇄&nbsp; ÷ 100', 'hand soft');
    const val = (k, x, y, cls) => { if (spec[k] !== undefined && spec[k] !== '') { const v = mk(String(spec[k])); if (v === '?') { f.lab(x, y, '?', 'q fdp-val'); return; } f.lab(x, y, /\[\[/.test(v) ? '<span class="mth ' + cls + '">' + md(v) + '</span>' : K.typed(v), cls + ' fdp-val'); } };
    val('f', 270, 128, 'f');
    val('d', 96, 316, 'd');
    val('p', 444, 316, 'p');
    caption(f.root, spec.caption);
    return f.root;
  }


  /* ================= v2: fraction strips ================= */
  function fracbar(spec) {
    const rows = (spec.rows || []).filter((r) => r && +r.parts > 0);
    const RH = 42, gap = 20, x0 = 12, x1 = 420;
    const W = 540, H = rows.length * (RH + gap) + 8;
    const f = frame(spec, W, H, 'fraction strips');
    const s = f.svg;
    rows.forEach((r, i) => {
      const y = 6 + i * (RH + gap), n = Math.min(60, +r.parts), sh = Math.max(0, Math.min(n, +r.shaded || 0));
      const cw = (x1 - x0) / n;
      if (sh > 0) S.el('rect', { x: x0, y, width: cw * sh, height: RH, class: 'sk-fill-f' }, s);
      for (let k = 1; k < n; k++) S.el('line', { x1: x0 + k * cw, y1: y, x2: x0 + k * cw, y2: y + RH, class: 'sk-ink', 'stroke-width': 1.3 }, s);
      S.rect(s, x0, y, x1 - x0, RH, { cls: 'sk-ink', width: 2.2, rough: 0.5 });
      if (r.label) { const m = mk(String(r.label)); f.lab(x1 + 16, y + RH / 2, m === '?' ? '?' : md(m), m === '?' ? 'q fb-lab' : 'f fb-lab').style.transform = 'translate(0, -50%)'; }
    });
    caption(f.root, spec.caption);
    return f.root;
  }

  /* ================= v2: area model for multiplying fractions ================= */
  function area(spec, opts) {
    const A = M.parseValue(String(spec.a)), B = M.parseValue(String(spec.b));
    const an = Number(A.n), ad = Number(A.d), bn = Number(B.n), bd = Number(B.d);
    const W = 420, H = 330, x0 = 70, y0 = 46, SZ = 250;
    const f = frame(spec, W, H, 'area model');
    const s = f.svg;
    const ok = an > 0 && bn > 0 && an <= ad && bn <= bd && ad <= 12 && bd <= 12;
    if (ok) {
      const rh = SZ / ad, cw = SZ / bd;
      // b: columns (yellow highlighter), a: rows (green hachure), overlap: solid green
      S.el('rect', { x: x0, y: y0, width: cw * bn, height: SZ, class: 'sk-fill-hl' }, s);
      S.fillArea(s, [[x0, y0], [x0 + SZ, y0], [x0 + SZ, y0 + rh * an], [x0, y0 + rh * an]], { fill: 'hachure', hachureCls: 'sk-f', gap: 8, hachureWidth: 1.6 });
      S.el('rect', { x: x0, y: y0, width: cw * bn, height: rh * an, class: 'sk-fill-f', style: 'opacity:.55' }, s);
      for (let k = 1; k < bd; k++) S.el('line', { x1: x0 + k * cw, y1: y0, x2: x0 + k * cw, y2: y0 + SZ, class: 'sk-ink', 'stroke-width': 1.2 }, s);
      for (let k = 1; k < ad; k++) S.el('line', { x1: x0, y1: y0 + k * rh, x2: x0 + SZ, y2: y0 + k * rh, class: 'sk-ink', 'stroke-width': 1.2 }, s);
      S.rect(s, x0, y0, SZ, SZ, { cls: 'sk-ink', width: 2.4, rough: 0.5 });
      // braces
      S.line(s, x0, y0 - 14, x0 + cw * bn, y0 - 14, { cls: 'sk-ink', width: 1.6, single: true });
      f.lab(x0 + cw * bn / 2, y0 - 30, md('[[f:' + bn + '/' + bd + ']]'), '');
      S.line(s, x0 - 14, y0, x0 - 14, y0 + rh * an, { cls: 'sk-f', width: 1.6, single: true });
      f.lab(x0 - 40, y0 + rh * an / 2, md('[[f:' + an + '/' + ad + ']]'), 'f');
      f.lab(x0 + SZ + 12, y0 + SZ / 2, '', '');
    } else {
      S.text(s, W / 2, H / 2, String(spec.a) + ' × ' + String(spec.b), { anchor: 'middle', size: 28, cls: 'sk-text' });
    }
    caption(f.root, spec.caption || (ok && !opts.quiz ? 'Overlap: ' + (an * bn) + ' of ' + (ad * bd) + ' small boxes, so [[f:' + an + '/' + ad + ']] &times; [[f:' + bn + '/' + bd + ']] = [[f:' + (an * bn) + '/' + (ad * bd) + ']]' : ''));
    return f.root;
  }

  /* ================= v2: measurement division (how many groups fit) ================= */
  function groups(spec, opts) {
    const T = M.parseValue(String(spec.total)), G = M.parseValue(String(spec.size));
    const total = M.toNumber(T), size = M.toNumber(G);
    const q = M.div(T, G), whole = Number(M.floorR(q)), left = M.sub(q, M.rat(whole));
    const W = 560, H = 160, x0 = 16, x1 = 544, y = 70, BH = 36;
    const f = frame(spec, W, H, 'groups of ' + spec.size + ' in ' + spec.total);
    const s = f.svg;
    const X = (v) => x0 + (x1 - x0) * v / (total || 1);
    if (MASK && (M.eq(MASK, M.rat(whole)) || M.eq(MASK, q))) opts = Object.assign({}, opts, { quiz: true });
    const n = opts.quiz ? Math.min(1, whole) : Math.min(whole, 40);
    for (let i = 0; i < n; i++) {
      S.rect(s, X(i * size), y - BH / 2, X(size) - x0, BH, { cls: 'sk-ink', width: 1.8, rough: 0.5, fill: 'solid', fillCls: i % 2 ? 'sk-fill-f' : 'sk-fill-hl' });
      if (n <= 16) f.lab(X(i * size + size / 2), y, String(i + 1), '');
    }
    if (opts.quiz) S.rect(s, X(n * size), y - BH / 2, x1 - X(n * size), BH, { cls: 'sk-soft', width: 1.4, rough: 0.5, dash: '6 5' });
    if (left.n !== 0n && !opts.quiz) {
      S.rect(s, X(whole * size), y - BH / 2, x1 - X(whole * size), BH, { cls: 'sk-soft', width: 1.6, rough: 0.5, fill: 'hachure', hachureCls: 'sk-soft', gap: 7, hachureWidth: 1.1, dash: '5 4' });
    }
    // unit ruler underneath
    S.line(s, x0, y + 34, x1, y + 34, { cls: 'sk-ink', width: 2, rough: 0.4 });
    const ticks = total <= 24 ? Math.round(total) : 0;
    for (let k = 0; k <= ticks; k++) {
      const x = X(k);
      S.line(s, x, y + 28, x, y + 40, { cls: 'sk-ink', width: 1.6, single: true, rough: 0.2 });
      f.lab(x, y + 54, String(k), 'soft');
    }
    if (spec.unit) f.lab(x1, y + 78, esc(spec.unit), 'hand soft').style.transform = 'translate(-100%, -50%)';
    f.lab((x0 + x1) / 2, 20, md('groups of ' + (G.d === 1n ? G.n.toString() : '[[f:' + M.toFrac(G) + ']]')) + (spec.unit ? ' ' + esc(spec.unit) : ''), 'hand');
    caption(f.root, spec.caption || (opts.quiz ? 'One group is shaded. How many fit?' : whole + ' whole group' + (whole === 1 ? '' : 's') + (left.n !== 0n ? ' and [[f:' + M.toFrac(left) + ']] of a group left over' : ', nothing left over')));
    return f.root;
  }

  /* ================= v2: stacked decimals with the points lined up ================= */
  function columns(spec) {
    const nums = (spec.numbers || []).map((x) => String(x).replace(/[,$\s]/g, ''));
    const op = spec.op || '+';
    const mult = op === '×' || op === 'x' || op === 'X' || op === '*' || op === '·';
    const parts = nums.map((x) => { const [i, d] = x.split('.'); return { i: i || '0', d: d || '', raw: x }; });
    const maxI = Math.max(...parts.map((p) => p.i.length)), maxD = Math.max(...parts.map((p) => p.d.length));
    const CW = 30, RH = 42;
    const cols = mult ? Math.max(...parts.map((p) => p.i.length + p.d.length)) + 1 : maxI + maxD + 1;
    const W = Math.max(240, cols * CW + (mult ? 190 : 110)), H = parts.length * RH + 46;
    const f = frame(spec, W, H, 'decimals stacked');
    f.svg.style.maxWidth = Math.round(W * 1.2) + 'px';
    const s = f.svg;
    const xr = W - (mult ? 120 : 40); // right edge of the digits
    parts.forEach((p, r) => {
      const y = 36 + r * RH;
      if (mult) {
        const digits = p.i + p.d;
        for (let k = 0; k < digits.length; k++) {
          const col = digits.length - 1 - k;
          S.text(s, xr - col * CW - CW / 2, y, digits[k], { anchor: 'middle', size: 28, cls: 'sk-num' });
        }
        if (p.d.length) S.text(s, xr - p.d.length * CW, y + 2, '.', { anchor: 'middle', size: 28, cls: 'sk-num-d' });
        if (p.d.length) S.text(s, xr + 8, y, '(' + p.d.length + ' place' + (p.d.length === 1 ? '' : 's') + ')', { size: 15, cls: 'sk-text-soft' });
      } else {
        const ptX = xr - maxD * CW;
        for (let k = 0; k < p.i.length; k++) S.text(s, ptX - (p.i.length - k) * CW + CW / 2 - 4, y, p.i[k], { anchor: 'middle', size: 28, cls: 'sk-num' });
        S.text(s, ptX, y + 2, '.', { anchor: 'middle', size: 30, cls: 'sk-num-d' });
        for (let k = 0; k < maxD; k++) {
          const pad = k >= p.d.length;
          S.text(s, ptX + k * CW + CW / 2 + 4, y, pad ? '0' : p.d[k], { anchor: 'middle', size: 28, cls: pad ? 'sk-num-soft' : 'sk-num' }).style.opacity = pad ? 0.5 : 1;
        }
      }
      if (r === parts.length - 1) S.text(s, 18, y, mult ? '×' : op === '-' || op === '−' ? '−' : op, { size: 28, cls: 'sk-num' });
    });
    const yl = 36 + (parts.length - 1) * RH + 14;
    S.line(s, 10, yl, xr + 4, yl, { cls: 'sk-ink', width: 2.4, rough: 0.4 });
    if (!mult) S.line(s, xr - maxD * CW, 8, xr - maxD * CW, yl + 26, { cls: 'sk-d', width: 1.4, dash: '3 5', single: true, rough: 0.2 });
    caption(f.root, spec.caption || (mult ? 'Multiply like whole numbers, then count the decimal places in both numbers.' : 'Points lined up. Faint zeros are placeholders.'));
    return f.root;
  }

  /* ================= v2: rounding number line ================= */
  function roundline(spec, opts) {
    const V = M.parseValue(String(spec.value)), step = M.parseValue(String(spec.step || 1));
    const lo = M.mul(M.rat(M.floorR(M.div(V, step))), step), hi = M.add(lo, step);
    const mode = spec.mode || 'nearest';
    const chosen = M.roundStep(V, step, mode);
    const W = 540, H = 150, x0 = 50, x1 = 490, y = 92;
    const f = frame(spec, W, H, 'rounding ' + spec.value);
    const s = f.svg;
    const lv = M.toNumber(lo), hv = M.toNumber(hi), v = M.toNumber(V);
    const X = (t) => x0 + (x1 - x0) * (t - lv) / (hv - lv || 1);
    S.line(s, x0 - 16, y, x1 + 16, y, { cls: 'sk-ink', width: 2.4, rough: 0.4 });
    for (let k = 0; k <= 10; k++) {
      const x = x0 + (x1 - x0) * k / 10;
      S.line(s, x, y - (k % 5 ? 6 : 12), x, y + (k % 5 ? 6 : 12), { cls: 'sk-ink', width: k % 5 ? 1.4 : 2.2, single: true, rough: 0.2 });
    }
    S.line(s, (x0 + x1) / 2, y - 40, (x0 + x1) / 2, y + 16, { cls: 'sk-soft', width: 1.4, dash: '4 4', single: true });
    f.lab((x0 + x1) / 2, y + 30, 'halfway', 'hand soft');
    const vlab = (t, x) => f.lab(x, y + 30, esc(M.withCommas(M.toDec(t) || M.toFrac(t))), 'soft');
    vlab(lo, x0); vlab(hi, x1);
    if (MASK && M.eq(MASK, chosen)) opts = Object.assign({}, opts, { quiz: true });
    const cx = X(M.toNumber(chosen));
    if (!opts.quiz) S.circle(s, cx, y, 18, { cls: 'sk-d', width: 2.4 });
    const xv = X(v);
    S.el('circle', { cx: xv, cy: y, r: 7, fill: 'var(--card)', class: 'sk-p', 'stroke-width': 3 }, s);
    f.lab(xv, y - 18, esc(String(spec.value)), 'above p');
    if (!opts.quiz && Math.abs(cx - xv) > 4) S.arrow(s, xv, y - 40, cx + (cx > xv ? -6 : 6), y - 40, { cls: 'sk-d', width: 2.2, single: true, rough: 0.4, head: 10 });
    const word = mode === 'up' ? 'round up' : mode === 'down' ? 'round down' : 'nearest';
    if (!opts.quiz) f.lab((xv + cx) / 2, y - 62, esc(word), 'hand d');
    caption(f.root, spec.caption);
    return f.root;
  }

  const TYPES = { grid, placevalue, numberline, doubleline, bar, shift, longdiv, fdp, fracbar, area, groups, columns, roundline };

  /** opts.quiz: the figure sits on a question, so draw the setup without giving the answer away. */
  function render(spec, opts) {
    if (!spec || !TYPES[spec.type]) {
      const d = div('fig fig-missing');
      d.appendChild(div('fig-caption', 'Picture unavailable' + (spec && spec.type ? ' (' + esc(spec.type) + ')' : '') + '.'));
      return d;
    }
    MASK = opts && opts.mask ? opts.mask : null;
    spec = Object.assign({}, spec);
    ['note', 'op', 'unit', 'number', 'value', 'whole'].forEach((k) => { if (typeof spec[k] === 'string' && k !== 'whole') spec[k] = decEnt(spec[k]); });
    ['top', 'bottom'].forEach((k) => { if (spec[k] && typeof spec[k].label === 'string') spec[k] = Object.assign({}, spec[k], { label: decEnt(spec[k].label) }); });
    try { return TYPES[spec.type](spec, opts || {}); } catch (e) {
      console.warn('figure failed', spec.type, e);
      const d = div('fig fig-missing');
      d.appendChild(div('fig-caption', 'This picture did not draw.'));
      return d;
    } finally { MASK = null; }
  }
  window.FDPFigures = { render, types: Object.keys(TYPES) };
})();
