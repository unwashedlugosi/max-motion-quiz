/* diagrams-a.js — 'race', 'formula', 'dtgraph' hand-drawn diagrams.
 * Uses window.Sketch (seeded wobble) + window.Diagrams.register. Colors only via .sk-* classes.
 *
 * Params beyond SPEC (all optional):
 *   formula: units {d,s,t}; hide may contain 'formula' | 'steps' | 'answer'.
 *   dtgraph: label (name main line), yUnit/xUnit (else parsed from the axis labels), compare.label,
 *            hide may contain 'slope' | 'speed' | 'readout'; labels[i].dx/dy/anchor.
 *            shape 'stopped' draws at atDistance (default 0; 40% of yMax when shapePicker is on).
 *   race:    range.s [min,max,step] for an 's' slider; hide may contain 'd' | 't' | 's'.
 */
(function () {
  'use strict';
  const S = window.Sketch, D = window.Diagrams;
  if (!S || !D) return;
  const clamp = S.clamp;
  let uid = 0;

  /* ------------------------------------------------------------ helpers */
  const isNum = (v) => typeof v === 'number' && isFinite(v);
  const num = (v, f) => (isNum(v) ? v : f);
  const has = (a, k) => Array.isArray(a) && a.indexOf(k) >= 0;
  const fmt = (v, dp) => S.fmtNum(v, dp === undefined ? 2 : dp);

  function niceCeil(v) {
    if (!(v > 0)) return 1;
    const e = Math.pow(10, Math.floor(Math.log10(v))), f = v / e;
    const L = [1, 2, 2.5, 5, 10];
    for (let i = 0; i < L.length; i++) if (f <= L[i] + 1e-9) return L[i] * e;
    return 10 * e;
  }
  function niceScale(v) {
    if (!(v > 0)) return 1;
    const e = Math.pow(10, Math.floor(Math.log10(v))), f = v / e;
    const L = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
    for (let i = 0; i < L.length; i++) if (f <= L[i] + 1e-9) return L[i] * e;
    return 10 * e;
  }
  function niceStep(raw) {
    if (!(raw > 0)) return 1;
    const e = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / e;
    const L = [1, 2, 5, 10];
    for (let i = 0; i < L.length; i++) if (f <= L[i] + 1e-9) return L[i] * e;
    return 10 * e;
  }

  function injectCSS() {
    if (document.getElementById('dga-css')) return;
    const st = document.createElement('style');
    st.id = 'dga-css';
    st.textContent = `
      .diagram-race .sk-controls, .diagram-dtgraph .sk-controls { gap: 2px; }
      .diagram-race .sk-slider, .diagram-dtgraph .sk-slider { gap: 10px; }
      @media (min-width: 481px) {
        .diagram-race .sk-slider, .diagram-dtgraph .sk-slider { font-size: 1.05rem; }
        .diagram-dtgraph .sk-toggle button { padding: 3px 11px; min-height: 36px; font-size: 1rem; }
      }
      .sk-slider input[type="range"] { cursor: pointer; }
      .sk-slider:hover .sk-slider-label { color: var(--ink); }
      .sk-slider:hover .sk-slider-value { text-decoration: underline wavy; text-underline-offset: 4px; }
      .sk-slider input[type="range"]:hover { filter: brightness(1.12) saturate(1.25); }
      .sk-toggle button:hover { background: var(--hl-soft); }
      .sk-toggle button:active { transform: translateY(1px); }
      svg.sk .dga-hit { cursor: pointer; }
      svg.sk .dga-hit:focus { outline: none; }
      svg.sk .dga-hit:focus-visible, svg.sk .dga-hit:hover { fill: var(--hl); fill-opacity: .22; }
      svg.sk .dga-hit:focus-visible { stroke: var(--accent); stroke-width: 3; }
    `;
    document.head.appendChild(st);
  }

  // Cap the svg height so it never grows huge in a wide column.
  function capSvg(svg) { svg.style.maxHeight = '320px'; svg.style.margin = '0 auto'; }

  // Pencil hachure inside a rect, fixed seeds (no boiling on redraw).
  function hatch(parent, x, y, w, h, o) {
    o = o || {};
    const id = 'dga' + (++uid);
    const defs = S.el('defs', null, parent);
    S.el('rect', { x, y, width: w, height: h }, S.el('clipPath', { id }, defs));
    const g = S.group(parent, 'sk-hachure', { 'clip-path': `url(#${id})` });
    const gap = o.gap || 9, seed = o.seed || 900;
    let i = 0;
    for (let xx = x - h; xx < x + w; xx += gap) {
      S.line(g, xx, y + h, xx + h, y, { cls: o.cls || 'sk-hl', width: o.width || 2.4, single: true, rough: 0.6, seed: seed + 17 * (i++) });
    }
    return g;
  }

  // Closed rounded-rect outline points.
  function rrPts(x, y, w, h, r) {
    const p = [];
    const arc = (cx, cy, a0) => {
      for (let k = 0; k <= 3; k++) { const a = a0 + k * Math.PI / 6; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    };
    arc(x + w - r, y + r, -Math.PI / 2);
    arc(x + w - r, y + h - r, 0);
    arc(x + r, y + h - r, Math.PI / 2);
    arc(x + r, y + r, Math.PI);
    p.push(p[0].slice());
    return p;
  }
  // Card-filled, outlined rounded rectangle (opaque so things behind are hidden).
  function rrBox(parent, x, y, w, h, r, o) {
    o = o || {};
    S.el('rect', { x, y, width: w, height: h, rx: r, class: 'sk-fill-card' }, parent);
    if (o.tint) S.el('rect', { x, y, width: w, height: h, rx: r, class: o.tint }, parent);
    S.curve(parent, rrPts(x, y, w, h, r), { cls: o.cls || 'sk-ink', width: o.width || 2.2, single: !o.double, rough: 0.7, seed: o.seed || 31 });
  }

  // Slider whose readout shows the exact (unsnapped) value when set from code.
  function makeSlider(container, o) {
    const sl = S.slider(container, o);
    const out = sl.el.querySelector('output');
    return {
      el: sl.el, input: sl.input,
      set(v) { sl.input.value = v; out.textContent = o.format(v); },
    };
  }

  function mkControls(root, interactive) {
    if (!interactive) return null;
    const c = document.createElement('div');
    c.className = 'sk-controls';
    root.appendChild(c);
    return c;
  }

  /* ============================================================== RACE */
  D.register('race', function (root, params, opts) {
    injectCSS();
    opts = opts || {};
    const interactive = !!opts.interactive;
    const onChange = typeof opts.onChange === 'function' ? opts.onChange : () => {};
    const P = Object.assign({ d: 10, t: 2, dUnit: 'km', tUnit: 'h', sliders: ['d', 't'], lock: null, range: null, hide: [], ghost: null }, params || {});
    const reduce = S.reduceMotion();
    const W = 600, X0 = 84, ROAD_W = 466, HOLD0 = 0.45, HOLD1 = 1.3, BASE = 74;
    let d = Math.max(0, num(P.d, 10)), t = Math.max(0.01, num(P.t, 2));
    let G = null, R = null, K = 0, H = 316, c = 0, moved = null, caption = '';
    let stop = null, dead = false, sliders = {};
    const cur = { s: 62, d: 62, t: 62 }, tar = { s: 62, d: 62, t: 62 };
    const E = {};

    const svg = S.svg(root, W, H, 'A car drives a distance in some time. The formula s = d ÷ t has letters that grow with their values.');
    capSvg(svg);
    const controls = mkControls(root, interactive);

    const hidden = (k) => has(P.hide, k);
    const sUnit = () => P.dUnit + '/' + P.tUnit;
    const sNow = () => d / t;

    function readGhost() {
      G = P.ghost && typeof P.ghost === 'object'
        ? { d: Math.max(0, num(P.ghost.d, d)), t: Math.max(0.01, num(P.ghost.t, t)) } : null;
    }

    function computeRanges() {
      const rg = P.range || {};
      const dTop = Math.max(d, G ? G.d : 0), tTop = Math.max(t, G ? G.t : 0);
      let dr, tr, sr;
      if (Array.isArray(rg.d) && rg.d.length >= 2) dr = rg.d.slice();
      else { const hi = niceScale(Math.max(dTop, 1) * (interactive ? 2.5 : 1.25)); dr = [0, hi, niceStep(hi / 40)]; }
      if (Array.isArray(rg.t) && rg.t.length >= 2) tr = rg.t.slice();
      else {
        const hi = tTop > 4 ? niceCeil(tTop * 2.5) : 10;
        tr = [0.5, hi, hi > 10 ? niceStep(hi / 20) : 0.5];
      }
      dr[2] = dr[2] > 0 ? dr[2] : 1; tr[2] = tr[2] > 0 ? tr[2] : 0.5;
      dr[0] = Math.min(dr[0], d); dr[1] = Math.max(dr[1], dTop);
      tr[0] = Math.min(tr[0], t); tr[1] = Math.max(tr[1], tTop);
      if (Array.isArray(rg.s) && rg.s.length >= 2) sr = rg.s.slice();
      else {
        const hi = niceCeil(Math.max(sNow() * 3, dr[1] / Math.sqrt(Math.max(tr[0], 0.1) * tr[1])));
        const st = niceStep(hi / 40);
        sr = [st, hi, st];
      }
      sr[2] = sr[2] > 0 ? sr[2] : 1;
      R = { d: dr, t: tr, s: sr, sScale: Array.isArray(rg.s) && rg.s.length >= 2 ? sr[1] : dr[1] / Math.sqrt(Math.max(tr[0], 0.1) * tr[1]) };
      if (!K) K = Math.min(clamp(3.5 / t, 0.4, 2.5), 14 / tr[1]);
    }

    const ppu = () => ROAD_W / R.d[1];
    function geom() {
      return G ? { ghostFeet: 228, mid: 246, mainFeet: 262, roadTop: 228, roadBot: 282 }
        : { ghostFeet: 0, mid: 263, mainFeet: 246, roadTop: 246, roadBot: 280 };
    }

    /* ---- car ---- */
    function makeCar(parent, ghost) {
      const g = S.group(parent, 'sk-car');
      const o = ghost ? { cls: 'sk-soft', width: 2, single: true, dash: '5 4' } : { cls: 'sk-ink', width: 2.4 };
      let seed = ghost ? 4100 : 4000;
      const O = (x) => Object.assign({}, o, { seed: seed++ }, x || {});
      let lines = null;
      if (!ghost) {
        lines = S.group(g, 'sk-speedlines');
        [-44, -30, -16].forEach((y, i) => S.line(lines, 0, y, -100, y, { cls: 'sk-soft', width: 2.4, single: true, rough: 0.4, seed: 4300 + i }));
        lines.querySelectorAll('path').forEach((p) => { p.style.vectorEffect = 'non-scaling-stroke'; });
      }
      const body = [[-74, -16], [-74, -32], [-56, -36], [-44, -54], [-18, -54], [-6, -36], [0, -32], [0, -16], [-74, -16]];
      if (!ghost) S.fillArea(g, body.slice(0, -1), { fill: 'solid', fillCls: 'sk-fill-accent' });
      S.poly(g, body, O());
      S.poly(g, [[-50, -38], [-43, -51], [-32, -51], [-32, -38], [-50, -38]], O({ single: true, width: 1.8 }));
      S.poly(g, [[-28, -38], [-28, -51], [-20, -51], [-12, -38], [-28, -38]], O({ single: true, width: 1.8 }));
      if (!ghost) S.circle(g, -4, -25, 3.4, { fill: 'solid', fillCls: 'sk-fill-hl', width: 1.6, single: true, seed: 4400 });
      const wheels = [-56, -18].map((cx, i) => {
        const wg = S.group(g, 'sk-wheel');
        if (ghost) S.circle(wg, cx, -10, 10, { cls: 'sk-soft', width: 2, single: true, seed: 4500 + i });
        else {
          S.circle(wg, cx, -10, 10, { fill: 'solid', fillCls: 'sk-fill-card', width: 2.4, single: true, seed: 4500 + i });
          S.line(wg, cx - 7, -10, cx + 7, -10, { cls: 'sk-soft', width: 2, single: true, seed: 4510 + i });
          S.line(wg, cx, -17, cx, -3, { cls: 'sk-soft', width: 2, single: true, seed: 4520 + i });
        }
        return { g: wg, cx };
      });
      return { g, wheels, lines };
    }

    function makeFlag(parent, finish, seed) {
      const g = S.group(parent, 'sk-flag');
      const hgt = 54;
      S.line(g, 0, 0, 0, -hgt, { cls: 'sk-ink', width: 2.6, seed });
      if (finish) {
        const s = 7;
        for (let r = 0; r < 2; r++) for (let q = 0; q < 4; q++) {
          if ((r + q) % 2 === 0) S.el('rect', { x: q * s + 1, y: -hgt + r * s, width: s, height: s, class: 'sk-fill-ink' }, g);
        }
        S.poly(g, [[0, -hgt], [29, -hgt], [29, -hgt + 14], [0, -hgt + 14], [0, -hgt]], { cls: 'sk-ink', width: 2, single: true, seed: seed + 1 });
      } else {
        S.fillArea(g, [[0, -hgt], [30, -hgt + 8], [0, -hgt + 16]], { fill: 'solid', fillCls: 'sk-fill-good' });
        S.poly(g, [[0, -hgt], [30, -hgt + 8], [0, -hgt + 16], [0, -hgt]], { cls: 'sk-good', width: 2.2, single: true, seed: seed + 1 });
      }
      return g;
    }

    /* ---- build everything (structure changes only) ---- */
    function buildAll() {
      S.clear(svg);
      const g = geom();
      H = g.roadBot + 34;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

      /* formula band */
      const gF = S.group(svg, 'dga-formula');
      const slot = { s: 84, d: 252, t: 420 };
      S.text(gF, 168, BASE - 6, '=', { size: 46, anchor: 'middle', cls: 'sk-text-soft' });
      S.text(gF, 336, BASE - 6, '÷', { size: 46, anchor: 'middle', cls: 'sk-text-soft' });
      E.mark = {}; E.letter = {}; E.val = {};
      ['s', 'd', 't'].forEach((k, i) => {
        const mg = S.group(gF, 'dga-mark');
        S.line(mg, -50, 0, 50, 0, { cls: 'sk-hl', width: 9, single: true, rough: 0.5, seed: 5100 + i });
        mg.querySelector('path').style.vectorEffect = 'non-scaling-stroke';
        mg.setAttribute('display', 'none');
        E.mark[k] = mg;
      });
      ['s', 'd', 't'].forEach((k) => {
        E.letter[k] = S.text(gF, slot[k], BASE, k, { size: cur[k], anchor: 'middle', cls: k === 's' ? 'sk-text-accent' : 'sk-text' });
        E.val[k] = S.text(gF, slot[k], BASE + 28, '', { size: 21, anchor: 'middle', cls: 'sk-text-soft' });
      });
      E.slot = slot;
      E.caption = S.text(svg, W / 2, 122, '', { size: 18, anchor: 'middle', cls: 'sk-text-accent' });

      /* stopwatch */
      const wcx = 540, wcy = 46, wr = 28;
      const gW = S.group(svg, 'dga-watch');
      S.rect(gW, wcx - 6, wcy - wr - 9, 12, 8, { width: 2, single: true, seed: 5201 });
      S.circle(gW, wcx, wcy, wr, { fill: 'solid', fillCls: 'sk-fill-card', width: 2.6, seed: 5202 });
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6, r1 = wr - 7, r2 = wr - 3.5;
        S.line(gW, wcx + Math.sin(a) * r1, wcy - Math.cos(a) * r1, wcx + Math.sin(a) * r2, wcy - Math.cos(a) * r2, { cls: 'sk-soft', width: 1.6, single: true, rough: 0.2, seed: 5210 + i });
      }
      E.needle = S.group(gW, 'dga-needle');
      S.line(E.needle, wcx, wcy, wcx, wcy - wr + 8, { cls: 'sk-accent', width: 2.8, single: true, seed: 5230 });
      S.el('circle', { cx: wcx, cy: wcy, r: 3, class: 'sk-fill-ink' }, gW);
      E.wcx = wcx; E.wcy = wcy;
      E.watchTxt = S.text(gW, wcx, wcy + wr + 21, '', { size: 20, anchor: 'middle', cls: 'sk-text' });

      /* road */
      const gRoad = S.group(svg, 'dga-road');
      hatch(gRoad, 8, g.roadTop, 584, g.roadBot - g.roadTop, { gap: 15, cls: 'sk-grid', width: 2.2, seed: 2000 });
      S.line(gRoad, 8, g.roadTop, 592, g.roadTop, { cls: 'sk-ink', width: 2.8, seed: 2101 });
      S.line(gRoad, 8, g.roadBot, 592, g.roadBot, { cls: 'sk-soft', width: 2, seed: 2102 });
      S.line(gRoad, 8, g.mid, 592, g.mid, { cls: 'sk-soft', width: 2, single: true, dash: '14 12', seed: 2103 });
      const p = ppu();
      const rt = niceCeil(R.d[1] / 5), n = Math.floor(R.d[1] / rt + 1e-9);
      for (let i = 0; i <= n; i++) {
        const x = X0 + i * rt * p;
        S.line(gRoad, x, g.roadBot, x, g.roadBot + 7, { cls: 'sk-ink', width: 2, single: true, seed: 2200 + i });
        if (!hidden('d')) S.text(gRoad, x, g.roadBot + 26, fmt(i * rt) + (i === n ? ' ' + P.dUnit : ''), { size: 18, anchor: 'middle', cls: 'sk-text-soft' });
      }

      /* flags, bracket, ghost marker */
      const startFlag = makeFlag(svg, false, 2300);
      startFlag.setAttribute('transform', `translate(${X0},${g.mainFeet})`);
      E.finish = makeFlag(svg, true, 2400);
      E.bracket = S.group(svg, 'dga-bracket');
      E.ghostMark = null;
      if (G) {
        const gm = S.group(svg, 'dga-ghostmark');
        S.line(gm, 0, 0, 0, -40, { cls: 'sk-soft', width: 2, single: true, dash: '4 4', seed: 2500 });
        S.text(gm, 0, -46, 'before', { size: 17, anchor: 'middle', cls: 'sk-text-soft' });
        gm.setAttribute('transform', `translate(${X0 + G.d * p},${g.ghostFeet})`);
        E.ghostMark = gm;
      }

      /* cars */
      E.ghost = G ? makeCar(svg, true) : null;
      E.car = makeCar(svg, false);
      E.geom = g;
      updateScene();
      applySizes(true);
      updateTexts();
      renderMotion(reduce ? Infinity : c);
    }

    function updateScene() {
      const g = E.geom, p = ppu();
      const xf = X0 + d * p;
      E.finish.setAttribute('transform', `translate(${xf},${g.mainFeet})`);
      S.clear(E.bracket);
      const by = G ? g.ghostFeet - 84 : g.mainFeet - 70;
      if (xf - X0 > 30) {
        const mid = (X0 + xf) / 2;
        S.arrow(E.bracket, mid, by, X0 + 1, by, { cls: 'sk-ink', width: 2.2, head: 9, seed: 3100 });
        S.arrow(E.bracket, mid, by, xf - 1, by, { cls: 'sk-ink', width: 2.2, head: 9, seed: 3110 });
      }
      S.text(E.bracket, (X0 + xf) / 2, by - 9, hidden('d') ? 'd = ?' : `d = ${fmt(d)} ${P.dUnit}`, { size: 20, anchor: 'middle', cls: 'sk-text' });
    }

    function valStr(k) {
      if (hidden(k)) return '?';
      if (k === 'd') return `${fmt(d)} ${P.dUnit}`;
      if (k === 't') return `${fmt(t)} ${P.tUnit}`;
      return `${fmt(sNow())} ${sUnit()}`;
    }
    function updateTexts() {
      ['s', 'd', 't'].forEach((k) => { E.val[k].textContent = valStr(k); });
      E.caption.textContent = caption;
      ['s', 'd', 't'].forEach((k) => E.mark[k].setAttribute('display', moved === k && !hidden(k) ? 'inline' : 'none'));
    }

    const fr = (v, r) => { const sp = r[1] - r[0]; return sp > 0 ? clamp((v - r[0]) / sp, 0, 1) : 0.5; };
    const sizeFor = (f) => 24 + 56 * f;
    function setTargets() {
      tar.d = hidden('d') ? 60 : sizeFor(fr(d, R.d));
      tar.t = hidden('t') ? 60 : sizeFor(fr(t, R.t));
      tar.s = hidden('s') ? 60 : sizeFor(clamp(sNow() / R.sScale, 0, 1));
    }
    function applySizes(snap) {
      ['s', 'd', 't'].forEach((k) => {
        if (snap || reduce) cur[k] = tar[k];
        E.letter[k].setAttribute('font-size', cur[k].toFixed(1));
        const w = Math.max(14, cur[k] * 0.34);
        E.mark[k].setAttribute('transform', `translate(${E.slot[k]},${BASE + 8}) scale(${(w / 50).toFixed(3)},1)`);
      });
    }

    function cycleLen() { return HOLD0 + Math.max(t, G ? G.t : 0) * K + HOLD1; }

    function renderMotion(clock) {
      const g = E.geom, p = ppu();
      const run = Math.max(0, clock - HOLD0);
      const tel = Math.min(run / K, t);
      const frac = tel / t;
      const px = frac * d * p;
      E.car.g.setAttribute('transform', `translate(${(X0 + px).toFixed(2)},${g.mainFeet})`);
      const ang = (px / 10) * 57.2958;
      E.car.wheels.forEach((w) => w.g.setAttribute('transform', `rotate(${ang.toFixed(1)} ${w.cx} -10)`));
      const driving = !reduce && run > 0 && tel < t && d > 0;
      const len = driving ? Math.min(130, (d * p) / (t * K) * 0.5) : 0;
      if (len > 3) { E.car.lines.setAttribute('display', 'inline'); E.car.lines.setAttribute('transform', `translate(-78,0) scale(${(len / 100).toFixed(3)},1)`); }
      else E.car.lines.setAttribute('display', 'none');
      if (E.ghost) {
        const gt = Math.min(run / K, G.t);
        const gpx = (gt / G.t) * G.d * p;
        E.ghost.g.setAttribute('transform', `translate(${(X0 + gpx).toFixed(2)},${g.ghostFeet})`);
        const ga = (gpx / 10) * 57.2958;
        E.ghost.wheels.forEach((w) => w.g.setAttribute('transform', `rotate(${ga.toFixed(1)} ${w.cx} -10)`));
      }
      E.needle.setAttribute('transform', `rotate(${(frac * 360).toFixed(1)} ${E.wcx} ${E.wcy})`);
      const dp = Math.abs(t * 10 - Math.round(t * 10)) > 1e-6 ? 2 : 1;
      E.watchTxt.textContent = hidden('t') ? '?' : `${fmt(tel >= t ? t : tel, tel >= t ? 2 : dp)} ${P.tUnit}`;
    }

    function startLoop() {
      if (reduce || stop) return;
      stop = S.animate((dt) => {
        if (dead) return false;
        const k = 1 - Math.exp(-dt * 12);
        let changed = false;
        ['s', 'd', 't'].forEach((n) => {
          const df = tar[n] - cur[n];
          if (Math.abs(df) > 0.05) { cur[n] += df * k; changed = true; } else if (df) { cur[n] = tar[n]; changed = true; }
        });
        if (changed) applySizes(false);
        c += dt;
        if (c > cycleLen()) c = 0;
        renderMotion(c);
      });
    }

    /* ---- controls ---- */
    function val(k) { return k === 'd' ? d : k === 't' ? t : sNow(); }
    function buildControls() {
      if (!controls) return;
      S.clear(controls); sliders = {};
      const names = (Array.isArray(P.sliders) ? P.sliders : ['d', 't']).filter((k) => k === 'd' || k === 't' || k === 's');
      svg.style.maxHeight = names.length >= 3 ? '290px' : '320px';
      names.forEach((k) => {
        const r = R[k];
        const unit = k === 'd' ? P.dUnit : k === 't' ? P.tUnit : sUnit();
        const label = k === 'd' ? 'distance (d)' : k === 't' ? 'time (t)' : 'speed (s)';
        const f = (v) => `${fmt(v)} ${unit}`;
        sliders[k] = makeSlider(controls, { label, min: r[0], max: r[1], step: r[2], value: val(k), format: f, onInput: (v) => onSlide(k, v) });
      });
    }
    function syncSliders(except) {
      Object.keys(sliders).forEach((k) => { if (k !== except) sliders[k].set(val(k)); });
    }

    function applyMove(k, v) {
      const sFix = d / t, lockS = P.lock === 's' && sFix > 1e-9;
      if (k === 'd') {
        v = clamp(v, R.d[0], R.d[1]);
        if (lockS) {
          const lo = Math.max(R.d[0], sFix * R.t[0]), hi = Math.min(R.d[1], sFix * R.t[1]);
          v = lo <= hi ? clamp(v, lo, hi) : d;
          d = v; t = d / sFix;
        } else d = v;
      } else if (k === 't') {
        v = clamp(v, R.t[0], R.t[1]);
        if (lockS) {
          const lo = Math.max(R.t[0], R.d[0] / sFix), hi = Math.min(R.t[1], R.d[1] / sFix);
          v = lo <= hi ? clamp(v, lo, hi) : t;
          t = v; d = sFix * t;
        } else t = v;
      } else {
        v = Math.max(v, 1e-6);
        if (P.lock === 'd') {
          if (d > 1e-9) { v = clamp(v, d / R.t[1], d / R.t[0]); t = d / v; }
        } else {
          v = clamp(v, R.d[0] / t, R.d[1] / t);
          d = v * t;
        }
      }
      t = Math.max(t, 0.01);
    }

    function captionFor(who, prev) {
      const up = (a, b) => b > a + 1e-9, dn = (a, b) => b < a - 1e-9;
      const s0 = prev.d / prev.t, s1 = sNow();
      const pick = (isUp, isDn, a, b) => (isUp ? a : isDn ? b : '');
      if (who === 'd') {
        const u = up(prev.d, d), w = dn(prev.d, d);
        return P.lock === 's' ? pick(u, w, 'Same speed, farther trip: it takes more time.', 'Same speed, shorter trip: it takes less time.')
          : pick(u, w, 'Same time, more distance: faster.', 'Same time, less distance: slower.');
      }
      if (who === 't') {
        const u = up(prev.t, t), w = dn(prev.t, t);
        return P.lock === 's' ? pick(u, w, 'Same speed, more time: you go farther.', 'Same speed, less time: you go less far.')
          : pick(u, w, 'Same distance, more time: slower.', 'Same distance, less time: faster.');
      }
      if (who === 's') {
        const u = up(s0, s1), w = dn(s0, s1);
        return P.lock === 'd' ? pick(u, w, 'Same distance, faster: it takes less time.', 'Same distance, slower: it takes more time.')
          : pick(u, w, 'Same time, faster: you go farther.', 'Same time, slower: you go less far.');
      }
      return '';
    }

    function refresh() {
      setTargets();
      if (reduce) applySizes(true);
      updateScene();
      updateTexts();
      c = 0;
      renderMotion(reduce ? Infinity : 0);
    }

    function onSlide(k, v) {
      const prev = { d, t };
      moved = k;
      applyMove(k, v);
      caption = captionFor(k, prev);
      sliders[k] && sliders[k].set(val(k));
      syncSliders(k);
      refresh();
      onChange(getState());
    }

    function getState() {
      return { d: +d.toFixed(2), t: +t.toFixed(2), s: +sNow().toFixed(2) };
    }

    readGhost(); computeRanges(); setTargets();
    ['s', 'd', 't'].forEach((k) => { cur[k] = tar[k]; });
    buildAll();
    buildControls();
    startLoop();

    return {
      getState,
      setParams(partial) {
        if (dead) return;
        partial = partial || {};
        const prev = { d, t };
        Object.assign(P, partial);
        if ('d' in partial) d = Math.max(0, num(partial.d, d));
        if ('t' in partial) t = Math.max(0.01, num(partial.t, t));
        readGhost(); computeRanges(); setTargets();
        const dCh = Math.abs(d - prev.d) > 1e-9, tCh = Math.abs(t - prev.t) > 1e-9;
        if (dCh && !tCh) { moved = 'd'; caption = captionFor('d', prev); }
        else if (tCh && !dCh) { moved = 't'; caption = captionFor('t', prev); }
        else if (dCh && tCh) {
          moved = null;
          caption = Math.abs(d / t - prev.d / prev.t) < 1e-6 * Math.max(1, prev.d / prev.t) ? 'Distance and time changed together: the speed stays the same.' : '';
        }
        c = 0;
        buildAll();
        if (interactive) buildControls();
      },
      destroy() {
        dead = true;
        if (stop) stop();
        stop = null;
        S.clear(root);
      },
    };
  });

  /* ============================================================ FORMULA */
  D.register('formula', function (root, params, opts) {
    injectCSS();
    opts = opts || {};
    const interactive = !!opts.interactive;
    const onChange = typeof opts.onChange === 'function' ? opts.onChange : () => {};
    const P = Object.assign({ cover: null, values: null, units: null, hide: [] }, params || {});
    const reduce = S.reduceMotion();
    const norm = (c) => (c === 'd' || c === 's' || c === 't' ? c : null);
    let cover = norm(P.cover);
    let stop = null, dead = false;
    const svg = S.svg(root, 600, 300, 'The distance, speed, time triangle. Cover a letter to see its formula.');
    capSvg(svg);

    /* triangle */
    const Ap = [150, 26], Bp = [28, 266], Cp = [272, 266];
    const half = (y) => 122 * ((y - 26) / 240);
    const yDiv = 138;
    const xl = 150 - half(yDiv), xr = 150 + half(yDiv);
    const cells = {
      d: [Ap, [xl, yDiv], [xr, yDiv]],
      s: [[xl, yDiv], [150, yDiv], [150, 266], Bp],
      t: [[150, yDiv], [xr, yDiv], Cp, [150, 266]],
    };
    const tint = { d: 'sk-fill-hl', s: 'sk-fill-accent', t: 'sk-fill-good' };
    const gT = S.group(svg, 'dga-tri');
    ['d', 's', 't'].forEach((k) => S.fillArea(gT, cells[k], { fill: 'solid', fillCls: tint[k] }));
    S.poly(gT, [Ap, Bp, Cp, Ap], { cls: 'sk-ink', width: 3.2, seed: 6001 });
    S.line(gT, xl, yDiv, xr, yDiv, { cls: 'sk-ink', width: 2.8, seed: 6002 });
    S.line(gT, 150, yDiv, 150, 266, { cls: 'sk-ink', width: 2.8, seed: 6003 });
    const LC = { d: [150, 100], s: [98, 208], t: [204, 208] };
    const LB = { d: [150, 122], s: [98, 226], t: [204, 228] };
    const letters = {};
    ['d', 's', 't'].forEach((k) => { letters[k] = S.text(gT, LB[k][0], LB[k][1], k, { size: 60, anchor: 'middle', cls: 'sk-text' }); });

    /* hand */
    const gH = S.group(svg, 'dga-hand');
    (function drawHand() {
      [[-25, 0], [-12, -4], [1, -5], [14, -1]].forEach((f, i) => {
        const len = i === 0 || i === 3 ? 34 : 38;
        rrBox(gH, f[0], -36 + (f[1] > -3 ? 3 : 0) + f[1] * 0.5, 11, len, 5.5, { seed: 6100 + i });
      });
      // thumb (rotated)
      const th = S.group(gH, 'dga-thumb');
      rrBox(th, -9, -3, 11, 30, 5.5, { seed: 6110 });
      th.setAttribute('transform', 'translate(-26,10) rotate(-48)');
      rrBox(gH, -26, -4, 52, 42, 14, { seed: 6120, width: 2.4 });
      S.curve(gH, [[-12, 14], [-4, 18], [6, 14]], { cls: 'sk-soft', width: 1.8, single: true, seed: 6130 });
    })();
    gH.style.pointerEvents = 'none';
    const hand = { x: 0, y: 0, a: 0, tx: 0, ty: 0, ta: 0 };
    function placeHand() {
      gH.setAttribute('transform', `translate(${hand.x.toFixed(1)},${hand.y.toFixed(1)})`);
      gH.style.opacity = hand.a.toFixed(2);
      gH.setAttribute('display', hand.a < 0.02 ? 'none' : 'inline');
    }
    function setHandTarget(snap) {
      if (cover) {
        hand.tx = LC[cover][0]; hand.ty = LC[cover][1]; hand.ta = 1;
        if (hand.a < 0.05) { hand.x = hand.tx + 50; hand.y = hand.ty + 70; }
      } else { hand.tx = hand.x + 40; hand.ty = hand.y + 70; hand.ta = 0; }
      if (snap || reduce) { hand.x = hand.tx; hand.y = hand.ty; hand.a = hand.ta; placeHand(); return; }
      if (!stop) {
        stop = S.animate((dt) => {
          if (dead) return false;
          const k = 1 - Math.exp(-dt * 13);
          hand.x += (hand.tx - hand.x) * k; hand.y += (hand.ty - hand.y) * k; hand.a += (hand.ta - hand.a) * k;
          placeHand();
          if (Math.abs(hand.tx - hand.x) < 0.3 && Math.abs(hand.ty - hand.y) < 0.3 && Math.abs(hand.ta - hand.a) < 0.02) {
            hand.x = hand.tx; hand.y = hand.ty; hand.a = hand.ta; placeHand(); stop = null; return false;
          }
        });
      }
    }

    /* hit areas (topmost) */
    ['d', 's', 't'].forEach((k) => {
      const poly = S.el('polygon', {
        points: cells[k].map((p) => p.join(',')).join(' '), class: 'dga-hit',
        fill: 'transparent', 'pointer-events': 'all',
      }, svg);
      if (interactive) {
        poly.setAttribute('tabindex', '0'); poly.setAttribute('role', 'button');
        poly.setAttribute('aria-label', `Cover ${k === 'd' ? 'distance' : k === 's' ? 'speed' : 'time'}`);
        const go = () => { cover = cover === k ? null : k; update(true); onChange(getState()); };
        poly.addEventListener('click', go);
        poly.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      } else poly.style.pointerEvents = 'none';
    });

    /* right panel */
    const gP = S.group(svg, 'dga-panel');
    const OPS = { s: ['d', '÷', 't'], t: ['d', '÷', 's'], d: ['s', '×', 't'] };
    const WORDS = { s: 'speed = distance ÷ time', d: 'distance = speed × time', t: 'time = distance ÷ speed' };
    const span = (tx, str, cls) => { const sp = S.el('tspan', { class: cls }, tx); sp.textContent = str; return sp; };

    function renderPanel() {
      S.clear(gP);
      if (!cover) {
        S.text(gP, 450, 120, interactive ? 'Tap a letter' : 'Cover the letter', { size: 34, anchor: 'middle', cls: 'sk-text' });
        S.text(gP, 450, 158, interactive ? 'to hide it.' : 'you want to find.', { size: 34, anchor: 'middle', cls: 'sk-text' });
        S.text(gP, 450, 204, 'What is left shows', { size: 22, anchor: 'middle', cls: 'sk-text-soft' });
        S.text(gP, 450, 230, 'how to find it.', { size: 22, anchor: 'middle', cls: 'sk-text-soft' });
        return;
      }
      const op = OPS[cover];
      if (!has(P.hide, 'formula')) {
        const tx = S.text(gP, 450, 96, '', { size: 56, anchor: 'middle' });
        span(tx, cover, 'sk-text-accent'); span(tx, ' = ', 'sk-text-soft');
        span(tx, op[0], 'sk-text'); span(tx, ' ' + op[1] + ' ', 'sk-text-soft'); span(tx, op[2], 'sk-text');
        S.text(gP, 450, 132, WORDS[cover], { size: 21, anchor: 'middle', cls: 'sk-text-soft' });
      } else {
        S.text(gP, 450, 96, `${cover} = ?`, { size: 56, anchor: 'middle', cls: 'sk-text-accent' });
        S.text(gP, 450, 132, 'What goes here?', { size: 21, anchor: 'middle', cls: 'sk-text-soft' });
      }
      const v = P.values;
      if (!v || typeof v !== 'object') return;
      let result = null;
      const a = v[op[0]], b = v[op[2]];
      if (isNum(a) && isNum(b)) result = op[1] === '÷' ? (b === 0 ? null : a / b) : a * b;
      else if (isNum(v[cover])) result = v[cover];
      if (isNum(a) && isNum(b) && !has(P.hide, 'steps')) {
        S.text(gP, 450, 190, `${cover} = ${fmt(a)} ${op[1]} ${fmt(b)}`, { size: 38, anchor: 'middle', cls: 'sk-text' });
      }
      const ans = has(P.hide, 'answer') ? '?' : (result === null ? '?' : fmt(result));
      const unit = P.units && P.units[cover] && ans !== '?' ? ' ' + P.units[cover] : '';
      const at = S.text(gP, 450, 248, `${cover} = ${ans}${unit}`, { size: 46, anchor: 'middle', cls: 'sk-text-good' });
      let w = 200;
      try { w = at.getBBox().width; } catch (e) { /* not rendered yet */ }
      w = clamp(w, 80, 250);
      S.line(gP, 450 - w / 2 - 4, 258, 450 + w / 2 + 4, 258, { cls: 'sk-good', width: 2.6, seed: 6300 });
    }

    function update(animate) {
      ['d', 's', 't'].forEach((k) => letters[k].setAttribute('class', k === cover ? 'sk-text-soft' : 'sk-text'));
      renderPanel();
      setHandTarget(!animate);
    }
    const getState = () => ({ cover });

    update(false);
    // Fonts may arrive after first paint: re-measure the underline once they do.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!dead && cover) renderPanel(); });

    return {
      getState,
      setParams(partial) {
        if (dead) return;
        partial = partial || {};
        Object.assign(P, partial);
        if ('cover' in partial) cover = norm(partial.cover);
        update(true);
      },
      destroy() { dead = true; if (stop) stop(); stop = null; S.clear(root); },
    };
  });

  /* =========================================================== DTGRAPH */
  const SHAPES = ['constant', 'accelerate', 'decelerate', 'stopped', 'scurve'];
  const SHAPE_LABEL = { constant: 'steady', accelerate: 'speeding up', decelerate: 'slowing down', stopped: 'stopped', scurve: 'speed up then slow down' };

  D.register('dtgraph', function (root, params, opts) {
    injectCSS();
    opts = opts || {};
    const interactive = !!opts.interactive;
    const onChange = typeof opts.onChange === 'function' ? opts.onChange : () => {};
    const P = Object.assign({ playhead: true, xLabel: 'Time (s)', yLabel: 'Distance (m)', hide: [] }, params || {});
    const reduce = S.reduceMotion();
    const svg = S.svg(root, 600, 340, 'Distance-time graph with a robot in a hallway moving as the graph says.');
    capSvg(svg);
    const controls = mkControls(root, interactive);

    let M = null, Cm = null, Ly = null, sig = '';
    let stop = null, dead = false;
    let playT = 0, holdT = 0, stepAcc = 0, rate = 1;
    let morph = null;
    const E = {};
    let picker = null, spdSlider = null;

    const parseUnit = (label, f) => { const m = /\(([^)]+)\)/.exec(label || ''); return m ? m[1] : f; };
    const hidden = (k) => has(P.hide, k);

    /* ---------- model ---------- */
    function cleanPts(arr) {
      const out = [];
      (Array.isArray(arr) ? arr : []).forEach((p) => { if (Array.isArray(p) && isNum(p[0]) && isNum(p[1])) out.push([Math.max(0, p[0]), Math.max(0, p[1])]); });
      out.sort((a, b) => a[0] - b[0]);
      return out;
    }

    // Describe one line. src: {points|shape|speed, atDistance}; ax: {xMax,yMax}
    function makeLine(src, ax, atDefault) {
      const pts = cleanPts(src.points);
      const X = ax.xMax, Y = ax.yMax, top = 0.9 * Y;
      const L = { mode: 'points', shape: null, speed: null, kind: 'poly', tEnd: X, dOf: null, verts: null, samples: null };
      if (pts.length >= 2) {
        L.verts = pts; L.tEnd = Math.min(pts[pts.length - 1][0], X);
        L.dOf = (t) => {
          if (t <= pts[0][0]) return pts[0][1];
          for (let i = 1; i < pts.length; i++) {
            if (t <= pts[i][0]) {
              const a = pts[i - 1], b = pts[i], u = b[0] === a[0] ? 1 : (t - a[0]) / (b[0] - a[0]);
              return a[1] + (b[1] - a[1]) * u;
            }
          }
          return pts[pts.length - 1][1];
        };
      } else if (typeof src.shape === 'string' && SHAPES.indexOf(src.shape) >= 0 || !isNum(src.speed)) {
        L.mode = 'shape'; L.shape = SHAPES.indexOf(src.shape) >= 0 ? src.shape : 'constant';
        const at = clamp(num(src.atDistance, atDefault), 0, Y);
        const f = {
          constant: (u) => top * u,
          accelerate: (u) => top * u * u,
          decelerate: (u) => top * (1 - (1 - u) * (1 - u)),
          scurve: (u) => top * u * u * (3 - 2 * u),
          stopped: () => at,
        }[L.shape];
        L.dOf = (t) => f(clamp(t / X, 0, 1));
        if (L.shape === 'constant') L.verts = [[0, 0], [X, top]];
        else if (L.shape === 'stopped') L.verts = [[0, at], [X, at]];
        else { L.kind = 'curve'; }
      } else {
        L.mode = 'speed'; L.speed = Math.max(0, src.speed);
        L.tEnd = L.speed > 0 ? Math.min(X, Y / L.speed) : X;
        L.dOf = (t) => Math.min(L.speed * clamp(t, 0, L.tEnd), Y);
        L.verts = [[0, 0], [L.tEnd, L.dOf(L.tEnd)]];
      }
      L.samples = (n) => { const a = []; for (let i = 0; i <= n; i++) { const t = X * i / n; a.push([t, L.dOf(t)]); } return a; };
      return L;
    }

    function buildModel() {
      const m = {};
      const src = P;
      const pts = cleanPts(src.points);
      const cmpSrc = P.compare && typeof P.compare === 'object' ? P.compare : null;
      const cmpPts = cmpSrc ? cleanPts(cmpSrc.points) : [];
      const picker = !!(P.shapePicker && interactive);
      let xMax = P.xMax, yMax = P.yMax;
      const maxT = Math.max(pts.length ? pts[pts.length - 1][0] : 0, cmpPts.length ? cmpPts[cmpPts.length - 1][0] : 0);
      const maxD = Math.max(0, ...pts.map((p) => p[1]), ...cmpPts.map((p) => p[1]));
      const xStepIn = isNum(P.xStep) && P.xStep > 0 ? P.xStep : null;
      const yStepIn = isNum(P.yStep) && P.yStep > 0 ? P.yStep : null;
      if (!isNum(xMax) || xMax <= 0) xMax = maxT > 0 ? Math.ceil(maxT / (xStepIn || niceStep(maxT / 10))) * (xStepIn || niceStep(maxT / 10)) : 10;
      if (!isNum(yMax) || yMax <= 0) {
        let need = maxD;
        if (!pts.length) {
          if (isNum(P.atDistance)) need = Math.max(need, P.atDistance * 1.4);
          if (isNum(P.speed)) {
            const hi = P.range && P.range.speed ? P.range.speed[1] : P.speed * 2;
            need = Math.max(need, 0.5 * hi * xMax, P.speed * xMax);
          }
          need = Math.max(need, 10);
        }
        const st = yStepIn || niceStep(need / 10);
        yMax = Math.ceil(need / st - 1e-9) * st;
        if (!pts.length && !yStepIn) yMax = niceCeil(yMax);
      }
      m.xMax = xMax; m.yMax = yMax;
      m.xStep = xStepIn || niceStep(xMax / 10);
      m.yStep = yStepIn || niceStep(yMax / 10);
      const atDefault = picker ? 0.4 * yMax : 0;
      m.main = makeLine(P, m, atDefault);
      m.cmp = cmpSrc ? makeLine(cmpSrc, m, atDefault) : null;
      m.cmpLabel = cmpSrc ? (cmpSrc.label || 'compare') : null;
      m.xUnit = P.xUnit || parseUnit(P.xLabel, '');
      m.yUnit = P.yUnit || parseUnit(P.yLabel, '');
      m.hl = null;
      if (Array.isArray(P.highlight) && P.highlight.length >= 2 && isNum(P.highlight[0]) && isNum(P.highlight[1])) {
        let a = clamp(P.highlight[0], 0, xMax), b = clamp(P.highlight[1], 0, xMax);
        if (a > b) { const x = a; a = b; b = x; }
        if (b - a > 1e-9) {
          m.hl = { t0: a, t1: b, d0: m.main.dOf(a), d1: m.main.dOf(b) };
          m.hl.speed = (m.hl.d1 - m.hl.d0) / (b - a);
        }
      }
      return m;
    }

    function layout() {
      const strip = P.playhead !== false;
      const l = { strip, X0: 64, X1: 582, floor: 62 };
      l.Y0 = strip ? 112 : 24;
      l.PH = strip ? 170 : 226;
      l.Y1 = l.Y0 + l.PH;
      l.H = l.Y1 + 54;
      l.PW = l.X1 - l.X0;
      l.HX0 = l.X0 + 24; l.HX1 = l.X1 - 24;
      return l;
    }
    const tx = (t) => Ly.X0 + (t / M.xMax) * Ly.PW;
    const ty = (d) => Ly.Y1 - (d / M.yMax) * Ly.PH;
    const cx = (t) => clamp(tx(t), Ly.X0, Ly.X1 + 4);
    const cy = (d) => clamp(ty(d), Ly.Y0 - 4, Ly.Y1);

    /* ---------- static art: strip + grid + axes ---------- */
    function buildAll() {
      S.clear(svg);
      M = buildModel(); Ly = layout();
      svg.setAttribute('viewBox', `0 0 600 ${Ly.H}`);
      const clock = M.xMax;
      rate = clock / clamp(clock * 0.35, 5, 10);
      if (Ly.strip) buildStrip();
      buildGrid();
      E.gBand = S.group(svg, 'dga-band');
      E.gCmp = S.group(svg, 'dga-cmp');
      E.gMainBase = S.group(svg, 'dga-main-base');
      E.gMain = S.group(svg, 'dga-main');
      E.gMarks = S.group(svg, 'dga-marks');
      if (Ly.strip) buildLive();
      buildData();
      playT = reduce ? 0 : 0; holdT = 0; stepAcc = 0;
      updateLive();
    }

    function buildStrip() {
      const g = S.group(svg, 'dga-strip');
      const f = Ly.floor;
      // hallway walls
      S.line(g, Ly.X0, 20, Ly.X1, 20, { cls: 'sk-soft', width: 1.8, single: true, seed: 7001 });
      S.line(g, Ly.X0, 20, Ly.X0, f, { cls: 'sk-soft', width: 1.8, single: true, seed: 7002 });
      S.line(g, Ly.X1, 20, Ly.X1, f, { cls: 'sk-soft', width: 1.8, single: true, seed: 7003 });
      // doors
      [0.2, 0.5, 0.8].forEach((u, i) => {
        const x = Ly.X0 + u * Ly.PW - 16;
        S.poly(g, [[x, f], [x, f - 38], [x + 32, f - 38], [x + 32, f]], { cls: 'sk-soft', width: 1.8, single: true, seed: 7010 + i });
        S.el('circle', { cx: x + 26, cy: f - 18, r: 2, class: 'sk-fill-ink' }, g).style.opacity = 0.5;
      });
      // floor + baseboard
      S.line(g, Ly.X0 - 4, f, Ly.X1 + 4, f, { cls: 'sk-ink', width: 2.8, seed: 7020 });
      S.line(g, Ly.X0 - 4, f + 7, Ly.X1 + 4, f + 7, { cls: 'sk-soft', width: 1.8, single: true, seed: 7021 });
      // distance marks
      const ppd = (Ly.HX1 - Ly.HX0) / M.yMax;
      const major = niceCeil(70 / ppd);
      const n = Math.floor(M.yMax / major + 1e-9);
      for (let i = 0; i <= n; i++) {
        const x = Ly.HX0 + i * major * ppd;
        S.line(g, x, f + 7, x, f + 13, { cls: 'sk-ink', width: 2, single: true, seed: 7100 + i });
        S.text(g, x, f + 30, fmt(i * major) + (M.yUnit ? ' ' + M.yUnit : ''), { size: 17, anchor: 'middle', cls: 'sk-text-soft' });
      }
      // robot
      const bot = S.group(svg, 'dga-robot');
      const inner = S.group(bot, 'dga-robot-in');
      inner.setAttribute('transform', 'scale(0.86)');
      const sl = S.group(inner, 'dga-bspeed');
      [-12, -24].forEach((y, i) => S.line(sl, 0, y, -100, y, { cls: 'sk-soft', width: 2.4, single: true, rough: 0.4, seed: 7200 + i }));
      sl.querySelectorAll('path').forEach((p) => { p.style.vectorEffect = 'non-scaling-stroke'; });
      sl.setAttribute('transform', 'translate(-22,0) scale(0,1)');
      E.bSpeed = sl;
      rrBox(inner, -16, -32, 32, 22, 4, { tint: 'sk-fill-accent', seed: 7210 });
      rrBox(inner, -11, -46, 22, 14, 4, { seed: 7211, width: 2 });
      S.el('circle', { cx: -4.5, cy: -39, r: 2.3, class: 'sk-fill-ink' }, inner);
      S.el('circle', { cx: 4.5, cy: -39, r: 2.3, class: 'sk-fill-ink' }, inner);
      S.line(inner, 0, -46, 0, -54, { cls: 'sk-ink', width: 2, single: true, seed: 7212 });
      S.circle(inner, 0, -56, 2.6, { fill: 'solid', fillCls: 'sk-fill-hl', width: 1.8, single: true, seed: 7213 });
      S.line(inner, -8, -18, 8, -18, { cls: 'sk-soft', width: 1.6, single: true, seed: 7214 });
      E.wheels = [-9, 9].map((wx, i) => {
        const wg = S.group(inner, 'sk-wheel');
        S.circle(wg, wx, -6, 6.2, { fill: 'solid', fillCls: 'sk-fill-card', width: 2.2, single: true, seed: 7220 + i });
        S.line(wg, wx - 4, -6, wx + 4, -6, { cls: 'sk-soft', width: 1.6, single: true, seed: 7230 + i });
        S.line(wg, wx, -10, wx, -2, { cls: 'sk-soft', width: 1.6, single: true, seed: 7240 + i });
        return { g: wg, cx: wx };
      });
      E.zzz = S.text(inner, 16, -52, 'z z', { size: 19, cls: 'sk-text-soft' });
      E.zzz.setAttribute('display', 'none');
      E.bot = bot;
    }

    function buildGrid() {
      const g = S.group(svg, 'dga-grid');
      const nx = Math.floor(M.xMax / M.xStep + 1e-9), ny = Math.floor(M.yMax / M.yStep + 1e-9);
      const sx = Ly.PW * M.xStep / M.xMax, sy = Ly.PH * M.yStep / M.yMax;
      const kx = Math.max(1, Math.ceil(40 / sx)), ky = Math.max(1, Math.ceil(30 / sy));
      for (let i = 0; i <= nx; i++) {
        const x = tx(i * M.xStep);
        S.line(g, x, Ly.Y1, x, Ly.Y0, { cls: 'sk-grid', width: i % kx === 0 ? 1.8 : 1.1, single: true, rough: 0.5, seed: 7400 + i });
      }
      for (let j = 0; j <= ny; j++) {
        const y = ty(j * M.yStep);
        S.line(g, Ly.X0, y, Ly.X1, y, { cls: 'sk-grid', width: j % ky === 0 ? 1.8 : 1.1, single: true, rough: 0.5, seed: 7500 + j });
      }
      // axes
      S.arrow(g, Ly.X0, Ly.Y1, Ly.X1 + 10, Ly.Y1, { cls: 'sk-ink', width: 2.8, head: 10, seed: 7601 });
      S.arrow(g, Ly.X0, Ly.Y1, Ly.X0, Ly.Y0 - 10, { cls: 'sk-ink', width: 2.8, head: 10, seed: 7602 });
      for (let i = 0; i <= nx; i += kx) {
        S.text(g, tx(i * M.xStep), Ly.Y1 + 21, fmt(i * M.xStep), { size: 18, anchor: 'middle', cls: 'sk-text' });
      }
      for (let j = 0; j <= ny; j += ky) {
        S.text(g, Ly.X0 - 9, ty(j * M.yStep) + 6, fmt(j * M.yStep), { size: 18, anchor: 'end', cls: 'sk-text' });
      }
      S.text(g, (Ly.X0 + Ly.X1) / 2, Ly.Y1 + 46, P.xLabel, { size: 20, anchor: 'middle', cls: 'sk-text' });
      const yl = S.text(g, 16, (Ly.Y0 + Ly.Y1) / 2, P.yLabel, { size: 20, anchor: 'middle', cls: 'sk-text' });
      yl.setAttribute('transform', `rotate(-90 16 ${(Ly.Y0 + Ly.Y1) / 2})`);
    }

    function buildLive() {
      const g = S.group(svg, 'dga-live');
      E.gv = S.el('line', { class: 'sk-soft', 'stroke-width': 1.8, 'stroke-dasharray': '4 5' }, g);
      E.gh = S.el('line', { class: 'sk-soft', 'stroke-width': 1.8, 'stroke-dasharray': '4 5' }, g);
      E.dot = S.group(g, 'dga-dot');
      S.el('circle', { cx: 0, cy: 0, r: 5, class: 'sk-fill-ink' }, E.dot);
      S.circle(E.dot, 0, 0, 10, { cls: 'sk-accent', width: 2.6, single: true, seed: 7700 });
      E.readout = hidden('readout') ? null : S.text(g, Ly.X1, 14, '', { size: 17, anchor: 'end', cls: 'sk-text-soft' });
      // clip for the "travelled" part of the line
      const id = 'dga' + (++uid);
      E.clipRect = S.el('rect', { x: Ly.X0 - 6, y: Ly.Y0 - 12, width: 0, height: Ly.PH + 20 }, S.el('clipPath', { id }, S.el('defs', null, g)));
      E.clipId = id;
    }

    /* ---------- data layer ---------- */
    function drawLine(parent, L, o, samples) {
      if (samples) {
        S.curve(parent, samples.map((p) => [cx(p[0]), cy(p[1])]), o);
      } else if (L.kind === 'curve') {
        S.curve(parent, L.samples(32).map((p) => [cx(p[0]), cy(p[1])]), o);
      } else {
        S.poly(parent, L.verts.map((p) => [cx(p[0]), cy(p[1])]), o);
      }
    }

    function drawMain(samples) {
      S.clear(E.gMainBase); S.clear(E.gMain);
      const o = { cls: 'sk-accent', width: 3.4, rough: 0.8, seed: 7800 };
      drawLine(E.gMainBase, M.main, o, samples);
      if (Ly.strip) {
        E.gMainBase.style.opacity = 0.32;
        drawLine(E.gMain, M.main, o, samples);
        E.gMain.setAttribute('clip-path', `url(#${E.clipId})`);
      } else E.gMainBase.style.opacity = 1;
    }

    function buildData() {
      S.clear(E.gBand); S.clear(E.gCmp); S.clear(E.gMarks);
      const hl = M.hl;
      if (hl) {
        const x0 = tx(hl.t0), x1 = tx(hl.t1);
        hatch(E.gBand, x0, Ly.Y0, x1 - x0, Ly.PH, { gap: 8, cls: 'sk-hl', width: 2.6, seed: 7900 });
        S.line(E.gBand, x0, Ly.Y0, x0, Ly.Y1, { cls: 'sk-hl', width: 2, single: true, seed: 7950 });
        S.line(E.gBand, x1, Ly.Y0, x1, Ly.Y1, { cls: 'sk-hl', width: 2, single: true, seed: 7951 });
      }
      if (M.cmp) {
        drawLine(E.gCmp, M.cmp, { cls: 'sk-good', width: 3, dash: '9 7', rough: 0.8, seed: 7960 });
      }
      drawMain(null);
      // data dots
      if (M.main.mode === 'points' && M.main.verts.length <= 24) {
        M.main.verts.forEach((p) => S.el('circle', { cx: cx(p[0]).toFixed(1), cy: cy(p[1]).toFixed(1), r: 3.4, class: 'sk-fill-ink' }, E.gMarks));
      }
      // triangle + labels
      if (hl && !hidden('slope')) drawSlope(hl);
      // text labels on lines
      if (typeof P.label === 'string' && P.label) {
        const L = M.main, te = L.tEnd;
        const above = !M.cmp || L.dOf(te) >= M.cmp.dOf(M.cmp.tEnd);
        S.text(E.gMarks, cx(te) - 6, cy(L.dOf(te)) + (above ? -12 : 24), P.label, { size: 19, anchor: 'end', cls: 'sk-text-accent' });
      }
      if (M.cmp) {
        const L = M.cmp, te = L.tEnd;
        const mainHigher = M.main.dOf(M.main.tEnd) >= L.dOf(te);
        S.text(E.gMarks, cx(te) - 6, cy(L.dOf(te)) + (mainHigher ? 24 : -12), M.cmpLabel, { size: 19, anchor: 'end', cls: 'sk-text-good' });
      }
      (Array.isArray(P.labels) ? P.labels : []).forEach((lb) => {
        if (!lb || !isNum(lb.t) || !isNum(lb.d)) return;
        const x = cx(lb.t), y = cy(lb.d);
        S.circle(E.gMarks, x, y, 5, { fill: 'solid', fillCls: 'sk-fill-hl', width: 2, single: true, seed: 8000 });
        const right = x < Ly.X1 - 150;
        S.text(E.gMarks, x + num(lb.dx, right ? 10 : -10), y + num(lb.dy, -12), String(lb.text || ''), { size: 19, anchor: lb.anchor || (right ? 'start' : 'end'), cls: 'sk-text' });
      });
    }

    function drawSlope(hl) {
      const A = [tx(hl.t0), ty(hl.d0)], B = [tx(hl.t1), ty(hl.d0)], C = [tx(hl.t1), ty(hl.d1)];
      const g = E.gMarks;
      S.line(g, A[0], A[1], B[0], B[1], { cls: 'sk-accent', width: 3, seed: 8100 });
      if (Math.abs(C[1] - B[1]) > 1) S.line(g, B[0], B[1], C[0], C[1], { cls: 'sk-good', width: 3, seed: 8101 });
      const unitY = M.yUnit, unitX = M.xUnit;
      const rise = hl.d1 - hl.d0, run = hl.t1 - hl.t0;
      const rows = [];
      if (!hidden('rise')) rows.push([`rise = ${fmt(rise)} ${unitY}`.trim(), 'sk-text-good']);
      if (!hidden('run')) rows.push([`run = ${fmt(run)} ${unitX}`.trim(), 'sk-text-accent']);
      if (!hidden('speed')) rows.push([`speed = ${fmt(hl.speed)} ${unitY && unitX ? unitY + '/' + unitX : ''}`.trim(), 'sk-text']);
      if (!rows.length) return;
      const bw = 176, rh = 23, bh = rows.length * rh + 8;
      // pick a corner of the plot that the lines and the band don't cross
      const obs = [];
      [M.main, M.cmp].forEach((L) => { if (L) L.samples(70).forEach((p) => obs.push([tx(p[0]), ty(p[1])])); });
      const cands = [
        [Ly.X0 + 10, Ly.Y0 + 4], [Ly.X1 - bw - 8, Ly.Y0 + 4],
        [Ly.X1 - bw - 8, Ly.Y1 - bh - 6], [Ly.X0 + 10, Ly.Y1 - bh - 6],
        [Ly.X0 + 10, Ly.Y0 + (Ly.PH - bh) / 2], [Ly.X1 - bw - 8, Ly.Y0 + (Ly.PH - bh) / 2],
      ];
      const bx0 = tx(hl.t0), bx1 = tx(hl.t1);
      let best = cands[0], bestHits = 1e9;
      cands.forEach((cd) => {
        let hits = 0;
        obs.forEach((o) => { if (o[0] > cd[0] - 8 && o[0] < cd[0] + bw + 8 && o[1] > cd[1] - 8 && o[1] < cd[1] + bh + 8) hits++; });
        if (cd[0] < bx1 + 4 && cd[0] + bw > bx0 - 4) hits += 40;
        if (hits < bestHits) { bestHits = hits; best = cd; }
      });
      S.el('rect', { x: best[0] - 4, y: best[1] - 2, width: bw + 8, height: bh, rx: 8, class: 'sk-fill-card' }, g).style.opacity = 0.88;
      rows.forEach((r, i) => S.text(g, best[0], best[1] + 20 + i * rh, r[0], { size: 20, cls: r[1] }));
    }

    /* ---------- live (every frame) ---------- */
    function updateLive() {
      if (!Ly.strip) return;
      const L = M.main, t = playT;
      const d = L.dOf(t);
      const x = cx(t), y = cy(d);
      E.dot.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
      E.gv.setAttribute('x1', x); E.gv.setAttribute('x2', x); E.gv.setAttribute('y1', y); E.gv.setAttribute('y2', Ly.Y1);
      E.gh.setAttribute('x1', Ly.X0); E.gh.setAttribute('x2', x); E.gh.setAttribute('y1', y); E.gh.setAttribute('y2', y);
      E.clipRect.setAttribute('width', Math.max(0, x - Ly.X0 + 6).toFixed(1));
      const ppd = (Ly.HX1 - Ly.HX0) / M.yMax;
      const rx = Ly.HX0 + d * ppd;
      E.bot.setAttribute('transform', `translate(${rx.toFixed(2)},${Ly.floor})`);
      const ang = (rx - Ly.HX0) / 6.2 * 57.2958;
      E.wheels.forEach((w) => w.g.setAttribute('transform', `rotate(${ang.toFixed(1)} ${w.cx} -6)`));
      const h = M.xMax * 0.012;
      const v = Math.max(0, (L.dOf(Math.min(t + h, M.xMax)) - L.dOf(Math.max(t - h, 0))) / (Math.min(t + h, M.xMax) - Math.max(t - h, 0)));
      const len = reduce ? 0 : Math.min(46, v * rate * ppd * 0.35) / 0.86;
      E.bSpeed.setAttribute('transform', `translate(-22,0) scale(${(len / 100).toFixed(3)},1)`);
      E.bSpeed.setAttribute('display', len > 3 ? 'inline' : 'none');
      E.zzz.setAttribute('display', v < 1e-6 && t > 0.05 * M.xMax && t < L.tEnd - 0.05 && d > -1 ? 'inline' : 'none');
      if (E.readout) E.readout.textContent = `${M.xLabelWord || 'time'} ${fmt(t, 1)} ${M.xUnit}   distance ${fmt(d, 1)} ${M.yUnit}`.replace(/\s+$/, '');
    }

    function tickFn(dt) {
      if (dead) return false;
      if (morph) {
        morph.u += dt / 0.7;
        const u = Math.min(1, morph.u), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        if (u >= 1) { const m = morph; morph = null; drawMain(null); if (m.done) m.done(); }
        else drawMain(morph.from.map((p, i) => [p[0], p[1] + (morph.to[i][1] - p[1]) * e]));
      }
      const end = M.main.tEnd;
      if (reduce) {
        stepAcc += dt;
        if (stepAcc >= 1.1) {
          stepAcc = 0;
          playT += Math.max(M.xStep, end / 14);
          if (playT > end + 1e-9) playT = playT > end + M.xStep ? 0 : end;
          if (playT >= end && holdT++ > 1) { playT = 0; holdT = 0; }
        }
      } else if (holdT > 0) {
        holdT -= dt;
        if (holdT <= 0) { playT = 0; holdT = -0.5; }
      } else if (holdT < 0) {
        holdT += dt;
        if (holdT > 0) holdT = 0;
      } else {
        playT += rate * dt;
        if (playT >= end) { playT = end; holdT = 1.4; }
      }
      updateLive();
    }
    function startLoop() { if (Ly.strip && !stop) stop = S.animate(tickFn); }

    /* ---------- controls ---------- */
    function buildControls() {
      if (!controls) return;
      S.clear(controls); picker = null; spdSlider = null;
      const L = M.main;
      if (P.shapePicker) {
        picker = S.toggle(controls, {
          label: 'Pick a motion:',
          options: SHAPES.map((s) => ({ value: s, label: SHAPE_LABEL[s] })),
          value: L.shape,
          onChange: (v) => {
            const old = M.main.samples(32);
            P.shape = v;
            applyParamChange(old);
            onChange(getState());
          },
        });
      }
      if (L.mode === 'speed' && !P.shapePicker) {
        const r = (P.range && P.range.speed) || [0, 10, 0.5];
        const u = M.yUnit && M.xUnit ? `${M.yUnit}/${M.xUnit}` : '';
        const f = (v) => `${fmt(v)} ${u}`.trim();
        spdSlider = makeSlider(controls, {
          label: 'speed', min: r[0], max: r[1], step: r[2] || 0.5, value: clamp(L.speed, r[0], r[1]), format: f,
          onInput: (v) => {
            P.speed = v;
            M.main = makeLine(P, M, 0);
            M.hl = M.hl ? Object.assign(M.hl, hlFor(M.hl)) : null;
            buildData();
            updateLive();
            onChange(getState());
          },
        });
      }
    }
    function hlFor(h) {
      const d0 = M.main.dOf(h.t0), d1 = M.main.dOf(h.t1);
      return { d0, d1, speed: (d1 - h.t0 === 0 ? 0 : (d1 - d0) / (h.t1 - h.t0)) };
    }

    function getState() {
      const L = M.main, st = {};
      if (L.mode === 'speed') st.speed = +L.speed.toFixed(2);
      if (L.mode === 'shape') st.shape = L.shape;
      if (M.hl) st.highlightSpeed = +M.hl.speed.toFixed(2);
      return st;
    }

    // Re-derive model after a param change; morph the curve if the axes did not change.
    function applyParamChange(oldSamples) {
      const prevSig = sig;
      const nm = buildModel();
      const nsig = JSON.stringify([nm.xMax, nm.yMax, nm.xStep, nm.yStep, P.xLabel, P.yLabel, P.playhead !== false, P.hide]);
      if (nsig !== prevSig || !E.gMain) {
        sig = nsig;
        buildAll();
        if (interactive) buildControls();
        startLoop();
        return;
      }
      M = nm;
      const smooth = oldSamples && M.main.mode !== 'points' && !reduce && Ly.strip !== undefined;
      buildData();
      if (smooth && oldSamples.length) {
        morph = { from: oldSamples, to: M.main.samples(oldSamples.length - 1), u: 0 };
        drawMain(oldSamples);
        if (!stop) stop = S.animate(tickFn);
      }
      playT = 0; holdT = 0;
      updateLive();
      if (interactive && picker) picker.setValue(M.main.shape);
    }

    /* ---------- go ---------- */
    M = buildModel();
    sig = JSON.stringify([M.xMax, M.yMax, M.xStep, M.yStep, P.xLabel, P.yLabel, P.playhead !== false, P.hide]);
    buildAll();
    buildControls();
    startLoop();

    return {
      getState,
      setParams(partial) {
        if (dead) return;
        partial = partial || {};
        const old = M.main.samples(32);
        // a new curve choice replaces the previous one
        if ('points' in partial || 'shape' in partial || 'speed' in partial) {
          if (!('points' in partial)) P.points = null;
          if ('speed' in partial && !('shape' in partial)) P.shape = null;
          if ('shape' in partial && !('speed' in partial)) P.speed = null;
        }
        Object.assign(P, partial);
        applyParamChange(old);
        if (interactive) {
          const mode = M.main.mode;
          if (mode === 'speed' && spdSlider) spdSlider.set(M.main.speed);
          if (picker && mode === 'shape') picker.setValue(M.main.shape);
          if (('shapePicker' in partial) || ('range' in partial)) buildControls();
        }
      },
      destroy() { dead = true; if (stop) stop(); stop = null; S.clear(root); },
    };
  });
})();
