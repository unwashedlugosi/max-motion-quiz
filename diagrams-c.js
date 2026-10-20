/* diagrams-c.js — 'possible', 'ghost', 'rates', 'average'
 * "Show me why" diagrams. Hand-drawn SVG on window.Sketch; colors only via .sk-* classes.
 * Static art is rebuilt only when params change (seeded pens => no "boiling");
 * per-frame work is transforms, a few text nodes and a couple of path strings.
 *
 * possible: who ('kid'|'snail'|'car'), speed, unit ('cm/s'), time, dUnit/tUnit (default from unit),
 *           direction (null|'N'..'NW'|degrees), directionLabel ('toward the tree'),
 *           directions (toggle list), mode ('map'|'distance-vs-direction'),
 *           hide: 'caption','speed','time','distance','clock','compass','scale'
 *           state { direction, distance }
 * ghost:    scenario ('bounce'|'turn'|'circle'), speed, speed2 (bounce only), unit, showGhost, showArrows,
 *           hide: 'caption','gauge','readouts','speed','direction','label'
 *           state { scenario, showGhost }
 * rates:    speedA, v0B, aB, unit ('m/s'), seconds, focus (null|'position'|'speed'), lanes ('both'|'A'|'B'),
 *           titleA, titleB, sliders (['speedA'] | []), range {speedA},
 *           hide: 'rows','captions','ruler','dial','position','speed'
 *           state { focus, speedA }
 * average:  segments [{d,t}], dUnit, tUnit, showGhost, hide: 'calc','clock','gauge','speed','legs','distance'
 *           state { totalD, totalT, avg, showGhost }
 */
(function () {
  'use strict';
  const S = window.Sketch, D = window.Diagrams;
  if (!S || !D) return;
  const clamp = S.clamp;

  /* ---------------- local helpers ---------------- */
  const num = (v, def, lo, hi) => { v = +v; if (!isFinite(v)) v = def; return clamp(v, lo, hi); };
  const str = (v, def) => (v === undefined || v === null || v === '' ? def : String(v));
  const fmt = (v, dp) => String(+(+v).toFixed(dp === undefined ? 1 : dp));
  const hideSet = (p) => {
    let h = p && p.hide;
    if (typeof h === 'string') h = [h];
    return new Set(Array.isArray(h) ? h.map(String) : []);
  };
  const rangeOf = (P, key, def) => {
    const r = P.range && P.range[key];
    if (Array.isArray(r) && r.length >= 2 && isFinite(+r[0]) && isFinite(+r[1])) {
      return [+r[0], +r[1], +r[2] > 0 ? +r[2] : def[2]];
    }
    return def;
  };

  function Pen(base) {
    let k = 0;
    const sd = (o) => Object.assign({ seed: (Math.imul(base * 977 + (++k), 2654435761) >>> 0) || 7 }, o);
    return {
      line: (p, x1, y1, x2, y2, o) => S.line(p, x1, y1, x2, y2, sd(o)),
      poly: (p, pts, o) => S.poly(p, pts, sd(o)),
      curve: (p, pts, o) => S.curve(p, pts, sd(o)),
      rect: (p, x, y, w, h, o) => S.rect(p, x, y, w, h, sd(o)),
      circle: (p, x, y, r, o) => S.circle(p, x, y, r, sd(o)),
      arrow: (p, x1, y1, x2, y2, o) => S.arrow(p, x1, y1, x2, y2, sd(o)),
    };
  }

  function shape(parent, pen, pts, o) {
    o = o || {};
    const g = S.group(parent, 'sk-shape');
    if (o.fillCls) S.fillArea(g, pts, { fill: 'solid', fillCls: o.fillCls });
    if (o.tintCls) S.fillArea(g, pts, { fill: 'solid', fillCls: o.tintCls });
    pen.poly(g, pts.concat([pts[0]]), { cls: o.cls || 'sk-ink', width: o.width || 2.2, rough: o.rough });
    return g;
  }

  const setT = (n, x, y, rot) => {
    let t = `translate(${x.toFixed(1)} ${y.toFixed(1)})`;
    if (rot) t += ` rotate(${rot.toFixed(1)})`;
    n.setAttribute('transform', t);
  };
  const op = (n, v) => { if (n) n.setAttribute('opacity', clamp(v, 0, 1).toFixed(2)); };
  const show = (n, on) => { if (n) n.setAttribute('display', on ? 'inline' : 'none'); };
  const approach = (cur, tgt, step) => (cur < tgt ? Math.min(tgt, cur + step) : Math.max(tgt, cur - step));
  const setTxt = (node, s) => { if (node && node.textContent !== s) node.textContent = s; };
  const wrap360 = (a) => ((a % 360) + 360) % 360;
  const angDiff = (from, to) => { let d = wrap360(to - from); if (d > 180) d -= 360; return d; };

  function mkSvg(root, w, h, label) {
    const s = S.svg(root, w, h, label);
    s.style.maxHeight = '320px';
    s.style.margin = '0 auto';
    return s;
  }
  function mkControls(root) {
    const c = document.createElement('div');
    c.className = 'sk-controls';
    c.style.gap = '4px 16px';
    root.appendChild(c);
    return c;
  }
  function styleBtns(el) {
    el.style.gap = '6px';
    el.querySelectorAll('button').forEach((b) => { b.style.padding = '4px 12px'; b.style.minHeight = '44px'; });
  }
  function compactSlider(container, o) {
    const sl = S.slider(container, o);
    sl.el.style.gridTemplateColumns = 'auto minmax(60px, 1fr) auto';
    sl.el.style.gap = '8px';
    sl.el.style.fontSize = '1.05rem';
    sl.input.style.gridColumn = 'auto';
    sl.input.style.gridRow = 'auto';
    sl.input.style.height = '40px';
    sl.input.style.margin = '0';
    return sl;
  }
  // one on/off button that looks like the segmented toggles
  function mkSwitch(container, label, value, onChange) {
    const wrapEl = document.createElement('div');
    wrapEl.className = 'sk-toggle';
    wrapEl.setAttribute('role', 'group');
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.setAttribute('aria-pressed', String(!!value));
    b.addEventListener('click', () => {
      const v = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(v));
      onChange(v);
    });
    wrapEl.appendChild(b);
    container.appendChild(wrapEl);
    styleBtns(wrapEl);
    return { el: wrapEl, setValue(v) { b.setAttribute('aria-pressed', String(!!v)); } };
  }

  // Arrow whose length changes every frame. Drawn along +x from the origin; rotate/translate the group.
  function dynArrow(parent, cls, width, head, seed) {
    const r = S.rng(seed || 17);
    const j = [(r() - 0.5) * 3, (r() - 0.5) * 2, (r() - 0.5) * 1.6, (r() - 0.5) * 1.6];
    const path = S.el('path', {
      class: 'sk-line ' + cls, fill: 'none', 'stroke-width': width,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, parent);
    let last = -1;
    return {
      path,
      set(len) {
        len = Math.round(len * 2) / 2;
        if (len === last) return;
        last = len;
        if (len < 2) { path.setAttribute('d', ''); return; }
        const hl = Math.min(head, len * 0.7), c = hl * 0.9, s = hl * 0.44;
        path.setAttribute('d',
          `M0,0 Q${(len / 2).toFixed(1)},${j[0].toFixed(1)} ${len},${j[1].toFixed(1)} ` +
          `M${len},0 L${(len - c).toFixed(1)},${(-s + j[2]).toFixed(1)} ` +
          `M${len},0 L${(len - c).toFixed(1)},${(s + j[3]).toFixed(1)}`);
      },
    };
  }

  /* ---- speedometer dial ---- */
  function makeGauge(parent, pen, cx, cy, r, max, unit) {
    const g = S.group(parent, 'gauge');
    const A0 = -120, A1 = 120;
    const pt = (ang, rad) => [cx + rad * Math.sin(ang * Math.PI / 180), cy - rad * Math.cos(ang * Math.PI / 180)];
    S.el('circle', { cx, cy, r: r + 8, class: 'sk-fill-card' }, g);
    pen.circle(g, cx, cy, r + 8, { cls: 'sk-ink', width: 2.4 });
    const N = 6;
    for (let i = 0; i <= N; i++) {
      const ang = A0 + (A1 - A0) * i / N;
      const edge = i === 0 || i === N;
      const a = pt(ang, r - 1), b = pt(ang, r - (edge ? 14 : 9));
      pen.line(g, a[0], a[1], b[0], b[1], { cls: 'sk-ink', width: edge ? 2.6 : 1.8, single: true, rough: 0.4 });
    }
    S.text(g, cx - r * 0.6, cy + r * 0.98, '0', { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
    S.text(g, cx + r * 0.6, cy + r * 0.98, fmt(max, 0), { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
    if (unit) S.text(g, cx, cy + r * 0.56, unit, { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
    const needle = S.group(g, 'needle');
    pen.line(needle, cx, cy + 6, cx, cy - (r - 7), { cls: 'sk-bad', width: 3.4 });
    S.el('circle', { cx, cy, r: 5, class: 'sk-fill-ink' }, g);
    let last = null;
    return {
      g,
      set(v) {
        const ang = A0 + (A1 - A0) * clamp(v / (max || 1), 0, 1);
        const t = `rotate(${ang.toFixed(1)} ${cx} ${cy})`;
        if (t !== last) { needle.setAttribute('transform', t); last = t; }
      },
    };
  }

  // hand-drawn check / cross centered at (x,y)
  function drawMark(parent, pen, ok, x, y) {
    const g = S.group(parent, ok ? 'mark-yes' : 'mark-no');
    if (ok) {
      pen.poly(g, [[x - 10, y + 1], [x - 3, y + 9], [x + 11, y - 11]], { cls: 'sk-good', width: 4.6 });
    } else {
      pen.line(g, x - 9, y - 9, x + 9, y + 9, { cls: 'sk-bad', width: 4.6 });
      pen.line(g, x + 9, y - 9, x - 9, y + 9, { cls: 'sk-bad', width: 4.6 });
    }
    return g;
  }

  /* ---- little characters, all facing +x, roughly 36 units long ---- */
  function drawKid(parent, pen) {
    const g = S.group(parent, 'kid');
    // shoulders across, round head, hair arc on the back, nose chevron in front
    const pts = [];
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; pts.push([-2 + 6.5 * Math.cos(a), 14 * Math.sin(a)]); }
    shape(g, pen, pts, { fillCls: 'sk-fill-card', tintCls: 'sk-fill-accent', width: 1.7 });
    pen.circle(g, 2, 0, 7.5, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 1.8, single: true });
    pen.curve(g, [[2, -7], [-3.5, -4], [-5, 0], [-3.5, 4], [2, 7]], { cls: 'sk-ink', width: 3, single: true, rough: 0.2 });
    pen.line(g, 7.5, -2.4, 11, 0, { cls: 'sk-ink', width: 1.6, single: true });
    pen.line(g, 11, 0, 7.5, 2.4, { cls: 'sk-ink', width: 1.6, single: true });
    g.setAttribute('data-scale', '1.25');
    return g;
  }
  function drawSnail(parent, pen) {
    const g = S.group(parent, 'snail');
    shape(g, pen, [[-17, -5], [-4, -7], [10, -6], [17, -3], [18, 0], [17, 3], [10, 6], [-4, 7], [-17, 5]], { fillCls: 'sk-fill-card', tintCls: 'sk-fill-good', width: 2.2 });
    pen.line(g, 16, -3, 25, -9, { cls: 'sk-ink', width: 2, single: true });
    pen.line(g, 16, 3, 25, 9, { cls: 'sk-ink', width: 2, single: true });
    S.el('circle', { cx: 25, cy: -9, r: 2, class: 'sk-fill-ink' }, g);
    S.el('circle', { cx: 25, cy: 9, r: 2, class: 'sk-fill-ink' }, g);
    pen.circle(g, -3, 0, 10, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 2.4, single: true });
    pen.curve(g, [[-3, 0], [-1, -3], [-5, -5], [-8, -1], [-5, 4], [0, 5]], { cls: 'sk-ink', width: 1.8, single: true, rough: 0.2 });
    g.setAttribute('data-scale', '1.15');
    return g;
  }
  function drawCarTop(parent, pen) {
    const g = S.group(parent, 'car-top');
    [[-13, -12], [11, -12], [-13, 12], [11, 12]].forEach((w) => {
      pen.line(g, w[0], w[1], w[0] + 8, w[1], { cls: 'sk-ink', width: 5, single: true, rough: 0.2 });
    });
    shape(g, pen, [[-21, -9], [17, -9], [23, -5], [23, 5], [17, 9], [-21, 9]], { fillCls: 'sk-fill-card', tintCls: 'sk-fill-accent', width: 2.4 });
    shape(g, pen, [[4, -6.5], [11, -6], [11, 6], [4, 6.5]], { fillCls: 'sk-fill-card', width: 2 });
    pen.line(g, -14, -6, -14, 6, { cls: 'sk-ink', width: 2, single: true, rough: 0.2 });
    S.el('circle', { cx: 22, cy: -4, r: 2.2, class: 'sk-fill-hl' }, g);
    S.el('circle', { cx: 22, cy: 4, r: 2.2, class: 'sk-fill-hl' }, g);
    g.setAttribute('data-scale', '1.15');
    return g;
  }
  // wrap a character in a group scaled by its data-scale
  function whoIcon(parent, pen, who, mul) {
    const holder = S.group(parent, 'who');
    const g = who === 'snail' ? drawSnail(holder, pen) : who === 'car' ? drawCarTop(holder, pen) : drawKid(holder, pen);
    g.setAttribute('transform', 'scale(' + ((+g.getAttribute('data-scale') || 1) * (mul || 1)).toFixed(2) + ')');
    return holder;
  }
  // side-view car; origin at the middle of the car, wheel bottoms at y = 0 (scaled by sc)
  function drawCarSide(parent, pen, tintCls, sc) {
    const outer = S.group(parent, 'car');
    const g = S.group(outer, 'car-art');
    g.setAttribute('transform', `scale(${sc})`);
    const trail = S.group(g, 'trail');
    [[0, 22], [-12, 32], [-24, 22]].forEach((t) => pen.line(trail, 0, t[0] - 4, -t[1], t[0] - 4, { cls: 'sk-soft', width: 2.6 / sc * 0.7, single: true }));
    shape(g, pen, [[-48, -13], [-48, -31], [-30, -34], [-18, -53], [22, -53], [36, -34], [48, -31], [48, -13]], { fillCls: 'sk-fill-card', tintCls, width: 2.8 });
    shape(g, pen, [[-13, -36], [-5, -48], [18, -48], [28, -36]], { fillCls: 'sk-fill-card', width: 2.4 });
    S.el('circle', { cx: 46, cy: -24, r: 3.6, class: 'sk-fill-hl' }, g);
    const spokes = [];
    [-28, 28].forEach((wx) => {
      pen.circle(g, wx, -11, 11, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 2.8 });
      const sp = S.group(g, 'spokes');
      pen.line(sp, wx - 7, -11, wx + 7, -11, { cls: 'sk-ink', width: 2.4, single: true, rough: 0.3 });
      pen.line(sp, wx, -18, wx, -4, { cls: 'sk-ink', width: 2.4, single: true, rough: 0.3 });
      spokes.push([sp, wx]);
    });
    return {
      g: outer, art: g, trail, spokes,
      setTrail(f) {
        trail.setAttribute('transform', `translate(-52 0) scale(${f.toFixed(2)} 1)`);
        trail.setAttribute('opacity', f > 0.02 ? '0.85' : '0');
      },
      spin(px) { spokes.forEach((s) => s[0].setAttribute('transform', `rotate(${((px / (11 * sc)) * 57.296 % 360).toFixed(1)} ${s[1]} -11)`)); },
    };
  }
  // dashed outlines = "ghost" look
  function ghostify(g) {
    g.querySelectorAll('path.sk-line').forEach((p) => p.setAttribute('stroke-dasharray', '6 5'));
  }
  const nice = (list, v) => { for (const c of list) if (c >= v) return c; return list[list.length - 1]; };
  const STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10000, 100000];
  const GMAX = [5, 10, 12, 15, 20, 25, 30, 40, 50, 60, 70, 80, 100, 120, 150, 200, 250, 300, 400, 500, 1000, 2000, 5000, 100000];

  /* =====================================================================
   *  POSSIBLE — where could it be?
   * ===================================================================== */
  D.register('possible', function (root, params, opts) {
    const interactive = !!(opts && opts.interactive);
    const onChange = (opts && opts.onChange) || function () {};
    const W = 600;
    const BEAR = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
    const NAMES = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const WORDS = { N: 'north', NE: 'northeast', E: 'east', SE: 'southeast', S: 'south', SW: 'southwest', W: 'west', NW: 'northwest' };
    const compass = (b) => NAMES[Math.round(wrap360(b) / 45) % 8];
    const CX = 300, CY = 194, R = 94, PRE = 0.5, HOLD = 3.4, NF = 16;

    const P = Object.assign({
      who: 'kid', speed: 12, unit: 'cm/s', time: 5, direction: null, directionLabel: null,
      directions: ['N', 'E', 'S', 'W'], mode: 'map', hide: [],
    }, params || {});

    let cfg = null, dead = false, clock = 0, gP = null, frameFn = null, ctl = null, dirToggle = null;
    let ringA = P.direction === null || P.direction === undefined ? 1 : 0; // 1 = "all possible places" look
    let ringFreeze = 1, lastKey = '', lastDirKey = '', needleAng = null, dirA = 0;

    const svg = mkSvg(root, W, 350, 'A map showing where something could be after a known distance, and which way it went');
    const ctrl = interactive ? mkControls(root) : null;

    function norm() {
      const us = str(P.unit, 'cm/s').split('/');
      const speed = num(P.speed, 12, 0, 1e6), time = num(P.time, 5, 0, 1e6);
      let bearing = null, label = null, word = null;
      const d = P.direction;
      if (d !== null && d !== undefined && d !== '' && String(d).toLowerCase() !== 'none') {
        if (typeof d === 'number' && isFinite(d)) { bearing = wrap360(d); }
        else {
          const k = String(d).trim().toUpperCase();
          if (BEAR[k] !== undefined) bearing = BEAR[k];
          else { bearing = 90; label = String(d); }
        }
        word = WORDS[compass(bearing)];
        if (P.directionLabel) label = String(P.directionLabel);
      }
      const dirs = (Array.isArray(P.directions) ? P.directions : ['N', 'E', 'S', 'W'])
        .map((x) => String(x).toUpperCase()).filter((x) => BEAR[x] !== undefined);
      return {
        who: ['snail', 'kid', 'car'].indexOf(P.who) >= 0 ? P.who : 'kid',
        speed, time, distance: speed * time, dUnit: str(P.dUnit, us[0] || 'cm'), tUnit: str(P.tUnit, us[1] || 's'),
        unit: str(P.unit, 'cm/s'), bearing, word, label, mode: P.mode === 'distance-vs-direction' ? 'dvd' : 'map',
        dirs: dirs.length ? dirs : ['N', 'E', 'S', 'W'], hide: hideSet(P),
      };
    }
    const dirName = () => (cfg.label || cfg.word || '');
    const grow = () => clamp(cfg.time * 0.55, 2.4, 4.4);
    const cycle = () => PRE + grow() + HOLD;
    function phase() {
      if (S.reduceMotion()) return 1;
      if (clock < 0) return 0;
      const u = clock % cycle();
      return clamp((u - PRE) / grow(), 0, 1);
    }
    function sinceFull() { // seconds since growth finished (for pop-ins)
      if (S.reduceMotion()) return 9;
      if (clock < 0) return -1;
      return (clock % cycle()) - PRE - grow();
    }

    /* ---------- build ---------- */
    function rebuild() {
      cfg = norm();
      S.clear(svg);
      capT = null; labelT = null;
      gP = S.group(svg, 'p-art');
      const pen = Pen(81);
      frameFn = cfg.mode === 'dvd' ? buildDvd(pen) : buildMap(pen);
      lastDirKey = '';
      applyDir(true);
    }

    function header(pen, y1, y2) {
      const h = cfg.hide;
      const sp = `${fmt(cfg.speed, 2)} ${cfg.unit}`, tm = `${fmt(cfg.time, 2)} ${cfg.tUnit}`;
      const dist = h.has('distance') ? '?' : `${fmt(cfg.distance, 2)} ${cfg.dUnit}`;
      S.text(gP, 300, y1, `speed ${h.has('speed') ? '?' : sp}  ·  time ${h.has('time') ? '?' : tm}`, { anchor: 'middle', size: 24, cls: 'sk-text' });
      S.text(gP, 300, y2, `${h.has('speed') ? '?' : fmt(cfg.speed, 2)} × ${h.has('time') ? '?' : fmt(cfg.time, 2)} = ${dist}`, { anchor: 'middle', size: 28, cls: 'sk-text-accent' });
    }

    let capT = null, labelT = null;

    function buildMap(pen) {
      svg.setAttribute('viewBox', '0 0 600 350');
      const h = cfg.hide;
      header(pen, 28, 58);
      // map paper
      const clipId = 'skpm' + Math.floor(Math.random() * 1e6);
      S.el('rect', { x: 14, y: 76, width: 572, height: 240, class: 'sk-fill-card' }, gP);
      const gridG = S.group(gP, 'grid');
      for (let x = 54; x < 586; x += 40) S.el('line', { x1: x, y1: 77, x2: x, y2: 315, class: 'sk-grid', 'stroke-width': 1.4 }, gridG);
      for (let y = 94; y < 316; y += 40) S.el('line', { x1: 15, y1: y, x2: 585, y2: y, class: 'sk-grid', 'stroke-width': 1.4 }, gridG);
      void clipId;
      pen.rect(gP, 14, 76, 572, 240, { cls: 'sk-soft', width: 2.4 });

      // scale bar = the radius
      if (!h.has('scale')) {
        pen.line(gP, 30, 296, 30 + R, 296, { cls: 'sk-ink', width: 3 });
        pen.line(gP, 30, 288, 30, 304, { cls: 'sk-ink', width: 2.6, single: true });
        pen.line(gP, 30 + R, 288, 30 + R, 304, { cls: 'sk-ink', width: 2.6, single: true });
        S.text(gP, 30 + R / 2, 284, h.has('distance') ? '?' : `${fmt(cfg.distance, 2)} ${cfg.dUnit}`, { anchor: 'middle', size: 21, cls: 'sk-text' });
      }

      // compass rose (corner)
      const CPX = 534, CPY = 134, CR = 26;
      let needleG = null;
      if (!h.has('compass')) {
        pen.circle(gP, CPX, CPY, CR, { cls: 'sk-soft', width: 2.2 });
        pen.line(gP, CPX, CPY - CR - 4, CPX, CPY + CR + 4, { cls: 'sk-soft', width: 1.8, single: true });
        pen.line(gP, CPX - CR - 4, CPY, CPX + CR + 4, CPY, { cls: 'sk-soft', width: 1.8, single: true });
        S.text(gP, CPX, CPY - CR - 8, 'N', { anchor: 'middle', size: 20, cls: 'sk-text' });
        S.text(gP, CPX, CPY + CR + 23, 'S', { anchor: 'middle', size: 20, cls: 'sk-text' });
        S.text(gP, CPX + CR + 14, CPY + 7, 'E', { anchor: 'middle', size: 20, cls: 'sk-text' });
        S.text(gP, CPX - CR - 14, CPY + 7, 'W', { anchor: 'middle', size: 20, cls: 'sk-text' });
        needleG = S.group(gP, 'needle');
        S.el('circle', { cx: CPX, cy: CPY, r: CR - 3, class: 'sk-fill-hl' }, needleG);
        pen.arrow(needleG, CPX, CPY + 4, CPX, CPY - CR + 4, { cls: 'sk-accent', width: 4, head: 11 });
      }

      // clock
      let hand = null, clockT = null;
      if (!h.has('clock')) {
        const KX = 52, KY = 124;
        pen.circle(gP, KX, KY, 24, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 2.6 });
        pen.line(gP, KX, KY - 24, KX, KY - 31, { cls: 'sk-ink', width: 4.5, single: true });
        for (let i = 0; i < 4; i++) {
          const a = i * Math.PI / 2;
          pen.line(gP, KX + Math.sin(a) * 18, KY - Math.cos(a) * 18, KX + Math.sin(a) * 22, KY - Math.cos(a) * 22, { cls: 'sk-ink', width: 2, single: true, rough: 0.2 });
        }
        hand = S.group(gP, 'hand');
        pen.line(hand, KX, KY + 3, KX, KY - 17, { cls: 'sk-bad', width: 3, single: true });
        S.el('circle', { cx: KX, cy: KY, r: 3.5, class: 'sk-fill-ink' }, gP);
        S.text(gP, KX + 34, KY - 4, 'after', { size: 19, cls: 'sk-text-soft' });
        clockT = S.text(gP, KX + 34, KY + 22, '', { size: 26, cls: 'sk-text' });
        hand._pivot = [KX, KY];
      }

      // fan of faint arrows + wavefront ring + question marks
      const fanG = S.group(gP, 'fan');
      const fan = [];
      for (let i = 0; i < NF; i++) {
        const g = S.group(fanG, 'fan-arrow');
        const arr = dynArrow(g, 'sk-soft', 2, 10, 100 + i);
        fan.push({ g, arr, ang: i * 360 / NF });
        g.setAttribute('transform', `translate(${CX} ${CY}) rotate(${(i * 360 / NF - 90).toFixed(1)}) translate(17 0)`);
      }
      const ringRng = S.rng(5);
      const ringJ = [];
      for (let i = 0; i < 64; i++) ringJ.push((ringRng() - 0.5) * 2.4);
      const ring = S.el('path', { class: 'sk-line sk-accent', fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': '11 9' }, gP);
      const ringPath = (r) => {
        if (r < 2) return '';
        let d = '';
        for (let i = 0; i <= 64; i++) {
          const a = i / 64 * Math.PI * 2, rr = r + ringJ[i % 64] * 0.7;
          d += (i ? 'L' : 'M') + (CX + rr * Math.sin(a)).toFixed(1) + ',' + (CY - rr * Math.cos(a)).toFixed(1) + ' ';
        }
        return d;
      };
      const qG = S.group(gP, 'qmarks');
      for (let i = 0; i < 8; i++) {
        const a = (22.5 + i * 45) * Math.PI / 180;
        S.text(qG, CX + (R + 22) * Math.sin(a), CY - (R + 22) * Math.cos(a) + 8, '?', { anchor: 'middle', size: 26, cls: 'sk-text-accent' });
      }

      // single-direction layer
      const dirG = S.group(gP, 'dir');
      const endMark = S.group(dirG, 'end-mark');
      pen.circle(endMark, 0, 0, 25, { fill: 'solid', fillCls: 'sk-fill-hl', cls: 'sk-accent', width: 2.8 });
      pen.line(endMark, -9, -9, 9, 9, { cls: 'sk-bad', width: 3.4, single: true });
      pen.line(endMark, 9, -9, -9, 9, { cls: 'sk-bad', width: 3.4, single: true });
      let treeG = null; // a landmark the arrow points toward, if it fits on the map
      if (cfg.bearing !== null && cfg.label && /tree/i.test(cfg.label)) {
        const b = cfg.bearing * Math.PI / 180, td = R + 54;
        const tx = CX + Math.sin(b) * td, ty = CY - Math.cos(b) * td;
        if (tx > 50 && tx < 520 && ty > 112 && ty < 300) {
          treeG = S.group(gP, 'tree');
          treeG.setAttribute('transform', `translate(${tx.toFixed(1)} ${(ty + 24).toFixed(1)})`);
          pen.poly(treeG, [[-6, 0], [-4, -26], [4, -26], [6, 0]], { cls: 'sk-ink', width: 2.6 });
          pen.circle(treeG, -14, -36, 17, { fill: 'solid', fillCls: 'sk-fill-good', cls: 'sk-ink', width: 2.4 });
          pen.circle(treeG, 14, -36, 17, { fill: 'solid', fillCls: 'sk-fill-good', cls: 'sk-ink', width: 2.4 });
          pen.circle(treeG, 0, -54, 19, { fill: 'solid', fillCls: 'sk-fill-good', cls: 'sk-ink', width: 2.4 });
        }
      }
      const dirArrow = S.group(dirG, 'dir-arrow');
      const darr = dynArrow(dirArrow, 'sk-accent', 5, 15, 211);
      labelT = S.text(dirG, 0, 0, '', { size: 23, cls: 'sk-text-accent', anchor: 'middle' });

      // the walker
      const walker = whoIcon(gP, pen, cfg.who, 1.3);
      capT = h.has('caption') ? null : S.text(gP, 300, 342, '', { anchor: 'middle', size: 23, cls: 'sk-text' });

      return function frame(dt) {
        const rm = S.reduceMotion();
        const tgt = cfg.bearing === null ? 1 : 0;
        ringA = rm ? tgt : approach(ringA, tgt, dt / 0.8);
        dirA = 1 - ringA;
        const p = phase();
        const has = cfg.bearing !== null;
        // ring: follows the clock when no direction; settles to a full faint circle otherwise
        let ringP;
        if (has) { ringFreeze = rm ? 1 : approach(ringFreeze, 1, dt / 0.6); ringP = ringFreeze; }
        else { ringP = p; ringFreeze = p; }
        ring.setAttribute('d', ringPath(R * ringP));
        op(ring, 0.18 + 0.82 * ringA);
        show(fanG, ringA > 0.02);
        op(fanG, 0.7 * ringA);
        fan.forEach((f) => f.arr.set(R * p - 17));
        const sf = sinceFull();
        show(qG, ringA > 0.02 && !has);
        op(qG, ringA * clamp(sf / 0.5, 0, 1));
        // direction layer
        const b = cfg.bearing === null ? 0 : cfg.bearing;
        const dx = Math.sin(b * Math.PI / 180), dy = -Math.cos(b * Math.PI / 180);
        show(dirG, dirA > 0.02);
        op(dirG, dirA);
        if (treeG) op(treeG, 1);
        dirArrow.setAttribute('transform', `translate(${CX} ${CY}) rotate(${b - 90})`);
        darr.set(has ? R * p : 0);
        setT(endMark, CX + dx * R, CY + dy * R);
        // walker
        const wd = has ? R * p : 0;
        const rot = has ? b - 90 : (rm ? -90 : -90 + (clock > 0 ? clock * 70 : 0));
        setT(walker, CX + dx * wd, CY + dy * wd, rot);
        // clock + compass
        const tNow = cfg.time * p;
        if (hand) hand.setAttribute('transform', `rotate(${(360 * p).toFixed(1)} ${hand._pivot[0]} ${hand._pivot[1]})`);
        setTxt(clockT, `${fmt(tNow, 1)} ${cfg.tUnit}`);
        if (needleG) {
          show(needleG, has);
          needleG.setAttribute('transform', `rotate(${b} ${CPX} ${CPY})`);
        }
        // label beside the arrow
        if (has && labelT) {
          let nx = -dy, ny = dx;
          if (nx < -1e-6 || (Math.abs(nx) < 1e-6 && ny < 0)) { nx = -nx; ny = -ny; }
          const mid = R * 0.5;
          const horiz = Math.abs(nx) > 0.5;
          const off = horiz ? 22 : 38;
          labelT.setAttribute('x', (CX + dx * mid + nx * off).toFixed(1));
          labelT.setAttribute('y', (CY + dy * mid + ny * off + 7).toFixed(1));
          labelT.setAttribute('text-anchor', horiz ? 'start' : 'middle');
          op(labelT, clamp((p - 0.8) * 5, 0, 1));
        }
      };
    }

    function buildDvd(pen) {
      svg.setAttribute('viewBox', '0 0 600 350');
      const h = cfg.hide;
      const PX = [14, 308], PW = 278, PY = 44, PH = 262;
      [0, 1].forEach((i) => pen.rect(gP, PX[i], PY, PW, PH, { cls: 'sk-soft', width: 2.6, fill: 'solid', fillCls: 'sk-fill-card' }));
      // left: how far
      const lc = PX[0] + PW / 2, rc = PX[1] + PW / 2;
      S.text(gP, lc, 76, 'how far', { anchor: 'middle', size: 30, cls: 'sk-text-accent' });
      S.text(gP, lc, 98, 'a number and a unit', { anchor: 'middle', size: 19, cls: 'sk-text-soft' });
      pen.rect(gP, lc - 100, 108, 200, 44, { cls: 'sk-ink', width: 2.4, fill: 'solid', fillCls: 'sk-fill-paper' });
      const odo = S.text(gP, lc + 90, 142, '', { anchor: 'end', size: 32, cls: 'sk-text' });
      S.text(gP, lc - 92, 142, 'odometer', { size: 18, cls: 'sk-text-soft' });
      const RX0 = lc - 100, RX1 = lc + 100, RY = 232;
      pen.line(gP, RX0, RY, RX1, RY, { cls: 'sk-ink', width: 3 });
      for (let i = 0; i <= 5; i++) {
        const x = RX0 + (RX1 - RX0) * i / 5;
        pen.line(gP, x, RY - (i % 5 ? 6 : 10), x, RY + (i % 5 ? 6 : 10), { cls: 'sk-ink', width: 2, single: true, rough: 0.3 });
      }
      S.text(gP, RX0, RY + 44, '0', { anchor: 'middle', size: 20, cls: 'sk-text-soft' });
      S.text(gP, RX1, RY + 44, h.has('distance') ? '?' : `${fmt(cfg.distance, 2)} ${cfg.dUnit}`, { anchor: 'middle', size: 20, cls: 'sk-text-soft' });
      const barG = S.group(gP, 'bar');
      const bar = dynArrow(barG, 'sk-accent', 4.4, 13, 41);
      barG.setAttribute('transform', `translate(${RX0} ${RY + 20})`);
      const walker = whoIcon(gP, pen, cfg.who, 1.1);
      // right: which way
      S.text(gP, rc, 76, 'which way', { anchor: 'middle', size: 30, cls: 'sk-text-accent' });
      S.text(gP, rc, 98, 'a direction to point', { anchor: 'middle', size: 19, cls: 'sk-text-soft' });
      pen.rect(gP, rc - 100, 108, 200, 44, { cls: 'sk-ink', width: 2.4, fill: 'solid', fillCls: 'sk-fill-paper' });
      const dirT = S.text(gP, rc, 142, '', { anchor: 'middle', size: 32, cls: 'sk-text' });
      const CCY = 232, CR = 42;
      pen.circle(gP, rc, CCY, CR, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 2.6 });
      NAMES.forEach((n, i) => {
        const a = i * 45 * Math.PI / 180, major = i % 2 === 0;
        pen.line(gP, rc + Math.sin(a) * (CR - (major ? 10 : 6)), CCY - Math.cos(a) * (CR - (major ? 10 : 6)), rc + Math.sin(a) * CR, CCY - Math.cos(a) * CR, { cls: 'sk-ink', width: 2, single: true, rough: 0.3 });
      });
      S.text(gP, rc, CCY - CR - 8, 'N', { anchor: 'middle', size: 21, cls: 'sk-text' });
      S.text(gP, rc, CCY + CR + 22, 'S', { anchor: 'middle', size: 21, cls: 'sk-text' });
      S.text(gP, rc + CR + 15, CCY + 7, 'E', { anchor: 'middle', size: 21, cls: 'sk-text' });
      S.text(gP, rc - CR - 16, CCY + 7, 'W', { anchor: 'middle', size: 21, cls: 'sk-text' });
      const needle = S.group(gP, 'needle');
      needle.setAttribute('transform', `translate(${rc} ${CCY})`);
      const nArrow = S.group(needle, 'n-arrow');
      pen.arrow(nArrow, 0, 6, 0, -(CR - 8), { cls: 'sk-accent', width: 4.4, head: 13 });
      S.el('circle', { cx: 0, cy: 0, r: 4, class: 'sk-fill-ink' }, needle);
      capT = h.has('caption') ? null : S.text(gP, 300, 336, 'Two different questions. How far is not the same as which way.', { anchor: 'middle', size: 22, cls: 'sk-text' });
      needleAng = null;

      return function frame(dt) {
        const rm = S.reduceMotion();
        const p = phase();
        const has = cfg.bearing !== null;
        setTxt(odo, h.has('distance') ? '?' : `${fmt(cfg.distance * p, 1)} ${cfg.dUnit}`);
        bar.set((RX1 - RX0) * p);
        setT(walker, RX0 + (RX1 - RX0) * p, RY - 24, 0);
        let target;
        if (has) target = cfg.bearing;
        else target = rm ? 40 : wrap360(clock * 50);
        if (needleAng === null) needleAng = target;
        if (has || rm) {
          const dd = angDiff(needleAng, target);
          needleAng = wrap360(needleAng + clamp(dd, -dt * 300, dt * 300));
          if (rm) needleAng = target;
        } else needleAng = target;
        nArrow.setAttribute('transform', `rotate(${needleAng.toFixed(1)})`);
        op(nArrow, has ? 1 : 0.5);
        setTxt(dirT, has ? (cfg.label || compass(cfg.bearing) + ' · ' + cfg.word) : '?');
      };
    }

    // direction-dependent text and transitions
    function applyDir(force) {
      const key = cfg.bearing === null ? 'none' : String(cfg.bearing) + '|' + (cfg.label || '');
      if (!force && key === lastDirKey) return;
      const wasNone = lastDirKey === 'none' || lastDirKey === '';
      const nowNone = cfg.bearing === null;
      if (!force) {
        if (nowNone) { clock = 0; }
        else if (wasNone && ringA > 0.5) { clock = -0.7; ringFreeze = Math.max(ringFreeze, 0.0); }
        else clock = 0;
      } else {
        ringA = nowNone ? 1 : 0;
        ringFreeze = 1;
        clock = 0;
      }
      lastDirKey = key;
      if (capT) {
        if (cfg.mode === 'dvd') capT.textContent = 'Two different questions. How far is not the same as which way.';
        else capT.textContent = nowNone ? "We know how far. We don't know which way." : 'Now we know which way too: one spot.';
      }
      if (labelT) {
        const w = nowNone ? '' : dirName();
        labelT.textContent = nowNone ? '' : `${cfg.hide.has('distance') ? '?' : fmt(cfg.distance, 2)} ${cfg.dUnit} ${w}`.trim();
      }
      if (dirToggle) dirToggle.setValue(nowNone ? 'none' : compass(cfg.bearing));
    }

    function getState() {
      return { direction: cfg.bearing === null ? null : compass(cfg.bearing), distance: +cfg.distance.toFixed(2) };
    }

    rebuild();

    if (interactive) {
      dirToggle = S.toggle(ctrl, {
        label: 'Direction:', value: cfg.bearing === null ? 'none' : compass(cfg.bearing),
        options: [{ value: 'none', label: 'none' }].concat(cfg.dirs.map((d) => ({ value: d, label: d }))),
        onChange: (v) => {
          P.direction = v === 'none' ? null : v;
          const was = lastDirKey;
          cfg = norm();
          applyDir(false);
          void was;
          onChange(getState());
        },
      });
      styleBtns(dirToggle.el);
    }

    const stop = S.animate((dt) => {
      if (dead) return false;
      clock += dt;
      frameFn(dt);
    });

    return {
      getState,
      setParams(partial) {
        if (dead) return;
        Object.assign(P, partial || {});
        const prev = cfg;
        const next = norm();
        const artKey = JSON.stringify([next.who, next.speed, next.time, next.unit, next.dUnit, next.tUnit, next.mode, [...next.hide], next.label, next.label && /tree/i.test(next.label) ? next.bearing : 0]);
        const prevKey = JSON.stringify([prev.who, prev.speed, prev.time, prev.unit, prev.dUnit, prev.tUnit, prev.mode, [...prev.hide], prev.label, prev.label && /tree/i.test(prev.label) ? prev.bearing : 0]);
        cfg = next;
        if (artKey !== prevKey) {
          const keepDir = lastDirKey;
          rebuild();
          void keepDir;
        } else applyDir(false);
        if (dirToggle) dirToggle.setValue(cfg.bearing === null ? 'none' : compass(cfg.bearing));
      },
      destroy() { dead = true; stop(); S.clear(root); },
    };
  });

  /* =====================================================================
   *  GHOST — what if the velocity didn't change?
   * ===================================================================== */
  D.register('ghost', function (root, params, opts) {
    const interactive = !!(opts && opts.interactive);
    const onChange = (opts && opts.onChange) || function () {};
    const W = 600, H = 376, K = 5, PRE = 0.6, HOLD = 3.6;
    const SCEN = ['bounce', 'turn', 'circle'];
    const P = Object.assign({ scenario: 'bounce', speed: 25, unit: 'ft/s', speed2: null, showGhost: false, showArrows: true, hide: [] }, params || {});

    let cfg = null, sc = null, clock = 0, dead = false, gAlpha = P.showGhost ? 1 : 0, swCtl = null;
    let gP = null, realG = null, realArr = null, ghostG = null, ghostArr = null, realAct = null, ghostAct = null, ghostDirIcon = null;
    let trail = null, conn = null, gapT = null, ghostLbl = null, dirIcon = null, ghostCard = null;

    const svg = mkSvg(root, W, H, 'A moving object and a faint ghost copy that keeps the original velocity, to show that the real velocity changed');
    const ctrl = interactive ? mkControls(root) : null;

    function norm() {
      const speed = num(P.speed, 25, 0.5, 400);
      const s2 = P.speed2 === null || P.speed2 === undefined || P.speed2 === '' ? speed : num(P.speed2, speed, 0.5, 400);
      return {
        scenario: SCEN.indexOf(P.scenario) >= 0 ? P.scenario : 'bounce', speed, speed2: s2, unit: str(P.unit, 'ft/s'),
        showGhost: !!P.showGhost, showArrows: P.showArrows !== false, hide: hideSet(P),
      };
    }

    /* ---------- scenes: positions are exact functions of time at a constant px-per-unit speed ---------- */
    function makeScene(name, speed, speed2) {
      const v1 = clamp(speed * K, 30, 420), v2 = clamp(speed2 * K, 30, 420);
      if (name === 'bounce') {
        const X0 = 66, XW = 390, Y = 146, FL = 164, post = 124 / v1;
        const tc = (XW - X0) / v1;
        return {
          title: 'A ball rolls into a wall', icon: 'ball', aoff: [0, -38], tc, tEnd: tc + post,
          from: [XW, Y], gapOff: [0, 64], ghostLblOff: [0, 46],
          real: (t) => (t <= tc ? { x: X0 + v1 * t, y: Y, a: 0, s: speed } : { x: XW - v2 * (t - tc), y: Y, a: 180, s: speed2 }),
          ghost: (t) => ({ x: XW + v1 * (t - tc), y: Y, a: 0 }),
          backdrop(g, pen) {
            pen.line(g, 14, FL, 586, FL, { cls: 'sk-ink', width: 3 });
            S.fillArea(g, [[412, 66], [440, 66], [440, FL + 1], [412, FL + 1]], { gap: 8, hachureCls: 'sk-soft', hachureWidth: 2 });
            pen.rect(g, 412, 66, 28, FL - 66, { cls: 'sk-ink', width: 3 });
            S.text(g, 426, 56, 'wall', { anchor: 'middle', size: 20, cls: 'sk-text-soft' });
          },
        };
      }
      if (name === 'turn') {
        const X0 = 56, XT = 270, YR = 218, RC = 32, VT = 112, ARC = Math.PI * RC / 2;
        const L1 = XT - X0, tc = L1 / v1, post = (ARC + VT) / v1;
        const real = (t) => {
          const s = v1 * t;
          if (s <= L1) return { x: X0 + s, y: YR, a: 0, s: speed };
          const s2 = s - L1;
          if (s2 <= ARC) { const th = s2 / RC; return { x: XT + RC * Math.sin(th), y: YR - RC + RC * Math.cos(th), a: -th * 180 / Math.PI, s: speed }; }
          return { x: XT + RC, y: YR - RC - (s2 - ARC), a: -90, s: speed };
        };
        const center = (s) => { // centerline for drawing, s may be negative
          if (s < 0) return { x: X0 + s, y: YR, a: 0 };
          const r = real(s / v1); return { x: r.x, y: r.y, a: r.a };
        };
        return {
          title: 'A car turns a corner', icon: 'car', aoff: [0, 0], tc, tEnd: tc + post,
          from: [XT, YR], gapOff: [112, -22], ghostLblOff: [0, 44],
          real, ghost: (t) => ({ x: XT + v1 * (t - tc), y: YR, a: 0 }),
          backdrop(g, pen) {
            const total = L1 + ARC + VT, HWr = 27, Lp = [], Rp = [], Mp = [];
            for (let s = -34; s <= total + 0.1; s += 6) {
              const c = center(s), a = c.a * Math.PI / 180;
              Lp.push([c.x - Math.sin(a) * HWr, c.y + Math.cos(a) * HWr]);
              Rp.push([c.x + Math.sin(a) * HWr, c.y - Math.cos(a) * HWr]);
              Mp.push([c.x, c.y]);
            }
            S.el('polygon', { points: Lp.concat(Rp.slice().reverse()).map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' '), class: 'sk-fill-hl' }, g);
            pen.curve(g, Lp, { cls: 'sk-soft', width: 2.4, rough: 0.8 });
            pen.curve(g, Rp, { cls: 'sk-soft', width: 2.4, rough: 0.8 });
            const mid = pen.curve(g, Mp, { cls: 'sk-soft', width: 1.6, single: true });
            mid.setAttribute('stroke-dasharray', '4 10');
            [[342, 244], [398, 250], [452, 242], [352, 186], [412, 190], [468, 186], [520, 232], [520, 190]].forEach((t) => {
              pen.line(g, t[0], t[1], t[0] - 5, t[1] - 10, { cls: 'sk-good', width: 2, single: true });
              pen.line(g, t[0], t[1], t[0], t[1] - 12, { cls: 'sk-good', width: 2, single: true });
              pen.line(g, t[0], t[1], t[0] + 5, t[1] - 10, { cls: 'sk-good', width: 2, single: true });
            });
          },
        };
      }
      // circle
      const CXc = 196, CYc = 166, RR = 74, tc = (Math.PI / 2 * RR) / v1, post = (Math.PI * RR) / v1;
      return {
        title: 'A runner on a round track', icon: 'runner', aoff: [0, 0], tc, tEnd: tc + post,
        from: [CXc, CYc - RR], gapOff: [112, 58], ghostLblOff: [0, 46],
        real: (t) => {
          const th = 270 + (v1 * t / RR) * 180 / Math.PI, r = th * Math.PI / 180;
          return { x: CXc + RR * Math.sin(r), y: CYc - RR * Math.cos(r), a: th, s: speed };
        },
        ghost: (t) => ({ x: CXc + v1 * (t - tc), y: CYc - RR, a: 0 }),
        backdrop(g, pen) {
          const ring = (rad) => { const o = []; for (let i = 0; i < 72; i++) { const a = i / 72 * Math.PI * 2; o.push(CXc + rad * Math.sin(a), CYc - rad * Math.cos(a)); } return o; };
          const toD = (arr) => { let d = ''; for (let i = 0; i < arr.length; i += 2) d += (i ? 'L' : 'M') + arr[i].toFixed(1) + ',' + arr[i + 1].toFixed(1) + ' '; return d + 'Z '; };
          S.el('path', { d: toD(ring(RR + 17)) + toD(ring(RR - 17)), 'fill-rule': 'evenodd', class: 'sk-fill-hl' }, g);
          pen.circle(g, CXc, CYc, RR + 17, { cls: 'sk-soft', width: 2.4 });
          pen.circle(g, CXc, CYc, RR - 17, { cls: 'sk-soft', width: 2.4 });
          const mid = pen.circle(g, CXc, CYc, RR, { cls: 'sk-soft', width: 1.6, single: true });
          mid.querySelectorAll('path').forEach((p) => p.setAttribute('stroke-dasharray', '4 10'));
        },
      };
    }

    /* ---------- build ---------- */
    function rebuild() {
      cfg = norm();
      sc = makeScene(cfg.scenario, cfg.speed, cfg.speed2);
      S.clear(svg);
      gP = S.group(svg, 'g-art');
      const pen = Pen(97), h = cfg.hide;
      if (!h.has('caption')) S.text(gP, 16, 30, sc.title, { size: 24, cls: 'sk-text' });
      if (cfg.showArrows) S.text(gP, 584, 30, 'arrow = velocity', { anchor: 'end', size: 19, cls: 'sk-text-accent' });
      sc.backdrop(S.group(gP, 'backdrop'), pen);

      const kv = 62 / Math.max(cfg.speed, cfg.speed2, 1e-6);
      const arrowLen = (s) => clamp(s * kv, 18, 110);
      sc.arrowLen = arrowLen;

      // ghost trail + connector (under the objects)
      trail = S.el('line', { x1: sc.from[0], y1: sc.from[1], x2: sc.from[0], y2: sc.from[1], class: 'sk-soft', 'stroke-width': 3, 'stroke-dasharray': '3 8', 'stroke-linecap': 'round' }, gP);
      conn = S.el('line', { x1: 0, y1: 0, x2: 0, y2: 0, class: 'sk-bad', 'stroke-width': 3.4, 'stroke-dasharray': '8 7', 'stroke-linecap': 'round' }, gP);

      const mkActor = (ghost) => {
        const g = S.group(gP, ghost ? 'ghost' : 'real');
        const iconHolder = S.group(g, 'icon');
        let icon;
        if (sc.icon === 'ball') {
          icon = S.group(iconHolder, 'ball');
          const spin = S.group(icon, 'spin');
          pen.circle(spin, 0, 0, 15, { fill: 'solid', fillCls: 'sk-fill-hl', cls: 'sk-ink', width: 2.6 });
          pen.line(spin, -11, 0, 11, 0, { cls: 'sk-ink', width: 2, single: true, rough: 0.3 });
          pen.line(spin, 0, -11, 0, 11, { cls: 'sk-ink', width: 2, single: true, rough: 0.3 });
          icon._spin = spin;
        } else if (sc.icon === 'car') {
          icon = S.group(iconHolder, 'car');
          const c = drawCarTop(icon, pen); c.setAttribute('transform', 'scale(1.7)');
        } else {
          icon = S.group(iconHolder, 'runner');
          const c = drawKid(icon, pen); c.setAttribute('transform', 'scale(1.45)');
        }
        const aG = S.group(g, 'velocity');
        let arr = null;
        if (cfg.showArrows) arr = dynArrow(aG, 'sk-accent', ghost ? 4 : 4.8, 15, ghost ? 5 : 3);
        return { g, icon, iconHolder, aG, arr };
      };
      const real = mkActor(false);
      realAct = real; realG = real.g; realArr = real.arr;
      const gh = mkActor(true);
      ghostAct = gh; ghostG = gh.g; ghostArr = gh.arr;
      ghostify(ghostG);
      S.el('circle', { cx: 0, cy: 0, r: sc.icon === 'ball' ? 21 : sc.icon === 'car' ? 34 : 28, class: 'sk-soft', fill: 'none', 'stroke-width': 2.2, 'stroke-dasharray': '4 5' }, gh.iconHolder);
      ghostLbl = S.text(gP, 0, 0, 'ghost', { anchor: 'middle', size: 20, cls: 'sk-text-soft' });
      gapT = null;
      if (!h.has('label')) {
        gapT = S.group(gP, 'gap-label');
        S.text(gapT, 0, 0, 'this gap shows', { anchor: 'middle', size: 21, cls: 'sk-text-bad' });
        S.text(gapT, 0, 23, 'the velocity changed', { anchor: 'middle', size: 21, cls: 'sk-text-bad' });
      }

      // bottom row: two readout cards + a speedometer that stays put
      const CY0 = 266, CH = 92;
      ghostCard = null; dirIcon = null; ghostDirIcon = null;
      const card = (x, title, ghost) => {
        const g = S.group(gP, ghost ? 'card-ghost' : 'card-real');
        pen.rect(g, x, CY0, 214, CH, { cls: ghost ? 'sk-soft' : 'sk-ink', width: 2.4, fill: 'solid', fillCls: 'sk-fill-card' });
        S.text(g, x + 14, CY0 + 25, title, { size: 21, cls: ghost ? 'sk-text-soft' : 'sk-text-accent' });
        if (!h.has('speed') && !h.has('s')) S.text(g, x + 14, CY0 + 54, `speed: ${fmt(cfg.speed, 2)} ${cfg.unit}`, { size: 25, cls: 'sk-text' });
        let ic = null;
        if (!h.has('direction')) {
          S.text(g, x + 14, CY0 + 82, 'direction:', { size: 25, cls: 'sk-text' });
          ic = S.group(g, 'dir-icon');
          pen.arrow(ic, -15, 0, 15, 0, { cls: 'sk-accent', width: 4, head: 11 });
          ic._at = `translate(${x + 156} ${CY0 + 74})`;
          ic.setAttribute('transform', ic._at);
        }
        return { g, ic };
      };
      if (!h.has('readouts')) {
        const c1 = card(14, 'the real one', false);
        dirIcon = c1.ic;
        const c2 = card(372, 'the ghost', true);
        ghostCard = c2.g;
        ghostDirIcon = c2.ic;
      }
      if (!h.has('gauge')) {
        const gmax = nice(GMAX, Math.max(cfg.speed, cfg.speed2) * 1.4);
        const gg = makeGauge(gP, pen, 300, 306, 36, gmax, '');
        gg.set(cfg.speed);
        S.text(gP, 300, 366, 'needle never moves', { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
      }
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      draw(S.reduceMotion() ? 99 : 0, 0);
    }

    function place(actor, st) {
      setT(actor.g, st.x, st.y);
      const aoff = sc.aoff;
      actor.aG.setAttribute('transform', `translate(${aoff[0]} ${aoff[1]}) rotate(${st.a.toFixed(1)})`);
      if (sc.icon === 'ball') actor.icon._spin.setAttribute('transform', `rotate(${((st.x / 15) * 57.3 % 360).toFixed(1)})`);
      else actor.iconHolder.setAttribute('transform', `rotate(${st.a.toFixed(1)})`);
    }

    function draw(u, dt) {
      const rm = S.reduceMotion();
      const tt = rm ? sc.tEnd : clamp(u - PRE, 0, sc.tEnd);
      const r = sc.real(tt);
      place(realAct, r);
      if (realArr) realArr.set(sc.arrowLen(r.s));
      const active = gAlpha > 0.01 && tt > sc.tc + 1e-6;
      show(ghostG, active); show(trail, active); show(conn, active); show(ghostLbl, active);
      if (gapT) show(gapT, active);
      if (active) {
        const g = sc.ghost(tt);
        place(ghostAct, g);
        if (ghostArr) ghostArr.set(sc.arrowLen(cfg.speed));
        op(ghostG, 0.62 * gAlpha);
        trail.setAttribute('x2', g.x.toFixed(1)); trail.setAttribute('y2', g.y.toFixed(1));
        op(trail, gAlpha);
        conn.setAttribute('x1', r.x.toFixed(1)); conn.setAttribute('y1', r.y.toFixed(1));
        conn.setAttribute('x2', g.x.toFixed(1)); conn.setAttribute('y2', g.y.toFixed(1));
        const gap = Math.hypot(g.x - r.x, g.y - r.y);
        op(conn, gAlpha * clamp((gap - 30) / 30, 0, 1));
        ghostLbl.setAttribute('x', (g.x + sc.ghostLblOff[0]).toFixed(1));
        ghostLbl.setAttribute('y', (g.y + sc.ghostLblOff[1]).toFixed(1));
        op(ghostLbl, gAlpha * clamp((gap - 60) / 30, 0, 1));
        if (gapT) {
          const cx = clamp((r.x + g.x) / 2 + sc.gapOff[0], 110, 490), cy = (r.y + g.y) / 2 + sc.gapOff[1];
          gapT.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)})`);
          op(gapT, gAlpha * clamp((gap - 70) / 60, 0, 1));
        }
        if (ghostCard) { show(ghostCard, true); op(ghostCard, gAlpha); }
      } else if (ghostCard) {
        show(ghostCard, gAlpha > 0.01);
        op(ghostCard, gAlpha);
      }
      if (ghostDirIcon) ghostDirIcon.setAttribute('transform', ghostDirIcon._at + ` rotate(${sc.ghost(Math.max(tt, sc.tc)).a.toFixed(1)})`);
      if (dirIcon) dirIcon.setAttribute('transform', dirIcon._at + ` rotate(${r.a.toFixed(1)})`);
      void dt;
    }

    function getState() { return { scenario: cfg.scenario, showGhost: cfg.showGhost }; }

    rebuild();
    if (cfg.showGhost) gAlpha = 1;

    if (interactive) {
      swCtl = mkSwitch(ctrl, 'Show the ghost (what would happen if velocity stayed the same)', cfg.showGhost, (v) => {
        P.showGhost = v;
        cfg = norm();
        clock = 0;
        onChange(getState());
      });
    }

    const stop = S.animate((dt) => {
      if (dead) return false;
      clock += dt;
      gAlpha = S.reduceMotion() ? (cfg.showGhost ? 1 : 0) : approach(gAlpha, cfg.showGhost ? 1 : 0, dt / 0.5);
      const cyc = PRE + sc.tEnd + HOLD;
      draw(clock % cyc, dt);
    });

    return {
      getState,
      setParams(partial) {
        if (dead) return;
        const before = JSON.stringify([cfg.scenario, cfg.speed, cfg.speed2, cfg.unit, cfg.showArrows, [...cfg.hide]]);
        const wasGhost = cfg.showGhost;
        Object.assign(P, partial || {});
        cfg = norm();
        const after = JSON.stringify([cfg.scenario, cfg.speed, cfg.speed2, cfg.unit, cfg.showArrows, [...cfg.hide]]);
        if (before !== after) { rebuild(); clock = 0; }
        else if (cfg.showGhost !== wasGhost) clock = 0;
        if (swCtl) swCtl.setValue(cfg.showGhost);
      },
      destroy() { dead = true; stop(); S.clear(root); },
    };
  });

  /* =====================================================================
   *  RATES — what is changing, and how fast?
   * ===================================================================== */
  D.register('rates', function (root, params, opts) {
    const interactive = !!(opts && opts.interactive);
    const onChange = (opts && opts.onChange) || function () {};
    const W = 600, LH = 182, GAP = 6, PRE = 0.4, HOLD = 3.0;
    const X0 = 56, X1 = 366, RD = 400;

    const P = Object.assign({
      speedA: 10, v0B: 0, aB: 2, unit: 'm/s', seconds: 6, focus: null, lanes: 'both',
      titleA: 'Car A', titleB: 'Car B', sliders: ['speedA'], hide: [],
    }, params || {});
    let cfg = null, clock = 0, dead = false, lanes = [], slCtl = null;
    let focA = { position: 0, speed: 0 }, litA = 0;

    const svg = mkSvg(root, W, 370, 'Two cars on a road: one cruising and one speeding up, with rulers, speedometers and checklists');
    const ctrl = interactive ? mkControls(root) : null;

    function norm() {
      const T = num(P.seconds, 6, 2, 20);
      const unit = str(P.unit, 'm/s'), parts = unit.split('/');
      const lk = ['A', 'B'].indexOf(String(P.lanes).toUpperCase()) >= 0 ? String(P.lanes).toUpperCase() : 'both';
      const f = P.focus === 'position' || P.focus === 'speed' ? P.focus : null;
      const mk = (key, v0, a) => {
        const tStop = a < 0 && v0 > 0 ? v0 / -a : null;
        const pos = (t) => (a >= 0 || tStop === null || t < tStop ? v0 * t + 0.5 * a * t * t : v0 * v0 / (2 * -a));
        const vel = (t) => (a >= 0 ? v0 + a * t : (tStop === null || t >= tStop ? 0 : Math.max(0, v0 + a * t)));
        return {
          key, v0, a, pos, vel, tStop,
          posChanges: pos(T) - pos(0) > 1e-6,
          speedChanges: Math.abs(vel(T) - vel(0)) > 1e-6,
        };
      };
      const sA = num(P.speedA, 10, 0, 200);
      const A = mk('A', sA, 0);
      const B = mk('B', num(P.v0B, 0, 0, 200), num(P.aB, 2, -50, 50));
      const list = lk === 'both' ? [A, B] : lk === 'A' ? [A] : [B];
      const maxPos = Math.max(0.0001, ...list.map((l) => l.pos(T)));
      const step = nice(STEPS, maxPos / 6);
      const niceMax = Math.max(step, Math.ceil(maxPos / step - 1e-9) * step);
      const maxV = Math.max(1, ...list.map((l) => Math.max(l.vel(0), l.vel(T))));
      return {
        T, unit, dUnit: parts[0] || 'm', speedA: sA, focus: f, lanesKey: lk, list, step, niceMax, K: (X1 - X0) / niceMax,
        gmax: Math.ceil(maxV * 1.1 / 6) * 6 || 6, hide: hideSet(P),
        titles: { A: str(P.titleA, 'Car A'), B: str(P.titleB, 'Car B') },
        sliders: Array.isArray(P.sliders) ? P.sliders : ['speedA'],
      };
    }

    function rebuild() {
      cfg = norm();
      S.clear(svg);
      lanes = [];
      const gP = S.group(svg, 'r-art');
      const pen = Pen(131);
      const h = cfg.hide;
      cfg.list.forEach((L, idx) => {
        const y0 = 4 + idx * (LH + GAP);
        const g = S.group(gP, 'lane-' + L.key);
        const lane = { L, y0, g };
        // lane title
        S.text(g, 14, y0 + 24, cfg.titles[L.key], { size: 24, cls: 'sk-text-accent' });
        // road
        const roadY = y0 + 70;
        pen.line(g, 18, roadY + 2, RD, roadY + 2, { cls: 'sk-ink', width: 3 });
        // ruler
        if (!h.has('ruler')) {
          const RY = y0 + 88;
          pen.line(g, X0 - 12, RY, X1 + 14, RY, { cls: 'sk-soft', width: 2.2, single: true });
          for (let v = 0; v <= cfg.niceMax + 1e-9; v += cfg.step) {
            const x = X0 + v * cfg.K;
            pen.line(g, x, RY - 2, x, RY + 10, { cls: 'sk-soft', width: 2.2, single: true, rough: 0.3 });
            S.text(g, x, RY + 26, fmt(v, 2) + (v + cfg.step > cfg.niceMax + 1e-9 ? ' ' + cfg.dUnit : ''), { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
          }
          lane.marker = S.group(g, 'marker');
          pen.poly(lane.marker, [[0, RY + 1], [-7, RY + 13], [7, RY + 13], [0, RY + 1]], { cls: 'sk-bad', width: 2.6, single: true });
          S.el('polygon', { points: `0,${RY + 1} -7,${RY + 13} 7,${RY + 13}`, class: 'sk-fill-bad' }, lane.marker);
          lane.guide = S.el('line', { x1: 0, y1: roadY + 4, x2: 0, y2: RY, class: 'sk-bad', 'stroke-width': 1.8, 'stroke-dasharray': '3 4' }, g);
          lane.RY = RY;
        }
        // car
        lane.car = drawCarSide(g, pen, L.key === 'A' ? 'sk-fill-accent' : 'sk-fill-good', 0.56);
        lane.roadY = roadY;
        // dial + readouts
        if (!h.has('dial')) {
          lane.gauge = makeGauge(g, pen, 452, y0 + 56, 31, cfg.gmax, '');
        }
        const tx = 506;
        lane.posTxt = null; lane.spdTxt = null;
        if (!h.has('position')) {
          lane.posLbl = S.text(g, tx, y0 + 26, `position (${cfg.dUnit})`, { size: 18, cls: 'sk-text-soft' });
          lane.posTxt = S.text(g, tx, y0 + 54, '', { size: 28, cls: 'sk-text' });
        }
        if (!h.has('speed')) {
          lane.spdLbl = S.text(g, tx, y0 + 80, `speed (${cfg.unit})`, { size: 18, cls: 'sk-text-soft' });
          lane.spdTxt = S.text(g, tx, y0 + 108, '', { size: 28, cls: 'sk-text' });
        }
        // indicator rows
        lane.rows = [];
        if (!h.has('rows')) {
          const defs = [
            { key: 'position', label: 'position changing?', ok: L.posChanges, cap: 'how fast position changes = speed', y: y0 + 150 },
            { key: 'speed', label: 'speed changing?', ok: L.speedChanges, cap: 'how fast speed changes = acceleration', y: y0 + 178 },
          ];
          defs.forEach((d) => {
            const rg = S.group(g, 'row-' + d.key);
            const hl = S.group(rg, 'hl');
            S.fillArea(hl, [[10, d.y - 22], [590, d.y - 22], [590, d.y + 7], [10, d.y + 7]], { fill: 'hachure', gap: 10, hachureCls: 'sk-hl', hachureWidth: 2 });
            pen.rect(hl, 10, d.y - 22, 580, 29, { cls: 'sk-hl', width: 2.4, single: true });
            const body = S.group(rg, 'body');
            S.text(body, 16, d.y, d.label, { size: 22, cls: 'sk-text' });
            const mark = drawMark(body, pen, d.ok, 222, d.y - 8);
            if (!h.has('captions')) S.text(body, 262, d.y, d.cap, { size: 19, cls: d.key === 'position' ? 'sk-text-soft' : 'sk-text-soft' });
            lane.rows.push({ key: d.key, hl, body, mark });
          });
        }
        lanes.push(lane);
      });
      const Hh = 4 + cfg.list.length * (LH + GAP) - 2;
      svg.setAttribute('viewBox', `0 0 ${W} ${Hh}`);
      clock = 0;
      frame(0, S.reduceMotion() ? cfg.T : 0, S.reduceMotion());
    }

    function frame(dt, tau, rm) {
      // focus fade
      ['position', 'speed'].forEach((k) => { focA[k] = rm ? (cfg.focus === k ? 1 : 0) : approach(focA[k], cfg.focus === k ? 1 : 0, dt / 0.5); });
      const moving = tau > 0 || rm;
      litA = rm ? 1 : approach(litA, moving ? 1 : 0, dt / 0.35);
      lanes.forEach((lane) => {
        const L = lane.L, px = L.pos(tau), v = L.vel(tau);
        const x = X0 + px * cfg.K;
        setT(lane.car.g, x, lane.roadY);
        lane.car.spin(px * cfg.K);
        lane.car.setTrail(v <= 0.001 ? 0 : 0.3 + 1.1 * v / cfg.gmax);
        if (lane.marker) { setT(lane.marker, x, 0); lane.guide.setAttribute('x1', x.toFixed(1)); lane.guide.setAttribute('x2', x.toFixed(1)); }
        if (lane.gauge) lane.gauge.set(v);
        setTxt(lane.posTxt, fmt(px, 1));
        setTxt(lane.spdTxt, fmt(v, 1));
        const pf = focA.position, sf = focA.speed, anyF = Math.max(pf, sf);
        if (lane.posTxt) lane.posTxt.setAttribute('class', pf > 0.5 ? 'sk-text-accent' : 'sk-text');
        if (lane.spdTxt) lane.spdTxt.setAttribute('class', sf > 0.5 ? 'sk-text-accent' : 'sk-text');
        lane.rows.forEach((r) => {
          const f = focA[r.key];
          op(r.hl, 0.5 * f);
          show(r.hl, f > 0.02);
          op(r.body, (0.28 + 0.72 * litA) * (anyF > 0 ? 1 - 0.55 * (anyF - f) : 1));
        });
      });
    }

    function getState() { return { focus: cfg.focus, speedA: cfg.speedA }; }

    rebuild();

    if (interactive && cfg.sliders.indexOf('speedA') >= 0 && cfg.lanesKey !== 'B') {
      const r = rangeOf(P, 'speedA', [0, 20, 1]);
      slCtl = compactSlider(ctrl, {
        label: 'Car A speed', min: Math.min(r[0], cfg.speedA), max: Math.max(r[1], cfg.speedA), step: r[2], value: cfg.speedA,
        format: (v) => `${fmt(v, 1)} ${cfg.unit}`,
        onInput: (v) => { P.speedA = v; rebuild(); onChange(getState()); },
      });
    }

    const stop = S.animate((dt) => {
      if (dead) return false;
      clock += dt;
      if (S.reduceMotion()) { frame(dt, cfg.T, true); return; }
      const u = clock % (PRE + cfg.T + HOLD);
      frame(dt, clamp(u - PRE, 0, cfg.T), false);
    });

    return {
      getState,
      setParams(partial) {
        if (dead) return;
        const art = () => JSON.stringify([P.speedA, P.v0B, P.aB, P.unit, P.seconds, P.lanes, P.titleA, P.titleB, [...hideSet(P)].sort()]);
        const before = art();
        Object.assign(P, partial || {});
        if (art() !== before) rebuild();          // focus alone never rebuilds: it just fades the highlight in
        else cfg.focus = P.focus === 'position' || P.focus === 'speed' ? P.focus : null;
        if (slCtl) slCtl.setValue(cfg.speedA);
      },
      destroy() { dead = true; stop(); S.clear(root); },
    };
  });

  /* =====================================================================
   *  AVERAGE — stop-and-go vs steady
   * ===================================================================== */
  D.register('average', function (root, params, opts) {
    const interactive = !!(opts && opts.interactive);
    const onChange = (opts && opts.onChange) || function () {};
    const W = 600, PRE = 0.7, HOLD = 4.6;
    const XS = 66, XE = 446, Y1 = 170, Y2 = 226;
    const DEF = [{ d: 60, t: 1 }, { d: 0, t: 1 }, { d: 60, t: 2 }];

    const P = Object.assign({ segments: DEF, dUnit: 'km', tUnit: 'h', showGhost: false, hide: [] }, params || {});
    let cfg = null, clock = 0, dead = false, swCtl = null, ghostA = P.showGhost ? 1 : 0, calcA = 0, dv = 0;
    let H = 372;
    let realCar, ghostCar, clockHand, clockT, gauge, spdT, distR, distG, calcG, ghostLaneG, realX = 0;

    const svg = mkSvg(root, W, H, 'A stop-and-go car and a steady ghost car that finish together, with a clock and speedometer');
    const ctrl = interactive ? mkControls(root) : null;

    function norm() {
      let segs = Array.isArray(P.segments) ? P.segments.slice(0, 6).map((s) => ({
        d: num(s && s.d, 0, 0, 1e6), t: num(s && s.t, 1, 0.01, 1e6),
      })) : [];
      if (!segs.length) segs = DEF.map((s) => Object.assign({}, s));
      let a = 0, b = 0;
      segs.forEach((s) => { s.d0 = a; s.t0 = b; a += s.d; b += s.t; s.v = s.d / s.t; });
      const totalD = a, totalT = b, avg = totalD / totalT;
      const maxV = Math.max(avg, ...segs.map((s) => s.v), 1e-6);
      return {
        segs, totalD, totalT, avg, dUnit: str(P.dUnit, 'km'), tUnit: str(P.tUnit, 'h'),
        showGhost: !!P.showGhost, hide: hideSet(P), gmax: nice(GMAX, maxV * 1.15),
        K: totalD > 0 ? (XE - XS) / totalD : 1,
        scale: clamp(8 / b, 0.4, 4), // seconds of animation per hour
      };
    }
    const speedUnit = () => `${cfg.dUnit}/${cfg.tUnit}`;
    function realAt(h) {
      for (const s of cfg.segs) if (h <= s.t0 + s.t + 1e-9) return { pos: s.d0 + s.v * (h - s.t0), v: s.v, seg: s };
      const l = cfg.segs[cfg.segs.length - 1];
      return { pos: cfg.totalD, v: 0, seg: l };
    }

    function rebuild() {
      cfg = norm();
      S.clear(svg);
      const gP = S.group(svg, 'a-art');
      const pen = Pen(171), h = cfg.hide;
      const xOf = (d) => XS + d * cfg.K;

      // top row: clock, speed readout, speedometer
      clockHand = null; clockT = null; gauge = null; spdT = null;
      if (!h.has('clock')) {
        const KX = 44, KY = 60;
        pen.circle(gP, KX, KY, 28, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 2.6 });
        pen.line(gP, KX, KY - 28, KX, KY - 36, { cls: 'sk-ink', width: 4.5, single: true });
        pen.line(gP, KX - 5, KY - 36, KX + 5, KY - 36, { cls: 'sk-ink', width: 4.5, single: true });
        for (let i = 0; i < 4; i++) {
          const a = i * Math.PI / 2;
          pen.line(gP, KX + Math.sin(a) * 21, KY - Math.cos(a) * 21, KX + Math.sin(a) * 26, KY - Math.cos(a) * 26, { cls: 'sk-ink', width: 2, single: true, rough: 0.2 });
        }
        clockHand = S.group(gP, 'hand');
        pen.line(clockHand, KX, KY + 3, KX, KY - 20, { cls: 'sk-bad', width: 3.2, single: true });
        clockHand._p = [KX, KY];
        S.el('circle', { cx: KX, cy: KY, r: 3.6, class: 'sk-fill-ink' }, gP);
        S.text(gP, 88, 42, 'clock', { size: 19, cls: 'sk-text-soft' });
        clockT = S.text(gP, 88, 76, '', { size: 32, cls: 'sk-text' });
      }
      if (!h.has('gauge')) {
        gauge = makeGauge(gP, pen, 532, 62, 44, cfg.gmax, speedUnit());
        if (!h.has('speed')) {
          S.text(gP, 468, 42, 'speed now', { anchor: 'end', size: 19, cls: 'sk-text-soft' });
          spdT = S.text(gP, 468, 76, '', { anchor: 'end', size: 32, cls: 'sk-text' });
        }
      }

      // lanes
      const lane = (y, label, ghost) => {
        pen.line(gP, 24, y + 2, 482, y + 2, { cls: ghost ? 'sk-soft' : 'sk-ink', width: 2.8 });
        S.text(gP, 508, y - 26, label, { size: 20, cls: ghost ? 'sk-text-soft' : 'sk-text' });
        return S.text(gP, 508, y + 2, '', { size: 25, cls: ghost ? 'sk-text-soft' : 'sk-text' });
      };
      distR = lane(Y1, 'real car', false);
      ghostLaneG = S.group(gP, 'ghost-lane');
      // ghost lane drawn in its own group so it can fade
      pen.line(ghostLaneG, 24, Y2 + 2, 482, Y2 + 2, { cls: 'sk-soft', width: 2.8 });
      S.text(ghostLaneG, 508, Y2 - 26, 'steady car', { size: 20, cls: 'sk-text-soft' });
      distG = S.text(ghostLaneG, 508, Y2 + 2, '', { size: 25, cls: 'sk-text-soft' });
      // flags
      const flag = (x, y, cls) => {
        pen.line(gP, x, y + 2, x, y - 40, { cls: 'sk-ink', width: 3, single: true });
        shape(gP, pen, [[x, y - 40], [x + 20, y - 33], [x, y - 25]], { fillCls: 'sk-fill-card', tintCls: cls, width: 2.2 });
      };
      flag(40, Y1, 'sk-fill-good');
      flag(xOf(cfg.totalD) + 28, Y1, 'sk-fill-bad');
      ghostLaneG._flags = S.group(ghostLaneG, 'gflags');
      const gflag = (x, y, cls) => {
        pen.line(ghostLaneG, x, y + 2, x, y - 40, { cls: 'sk-soft', width: 3, single: true });
        shape(ghostLaneG, pen, [[x, y - 40], [x + 20, y - 33], [x, y - 25]], { fillCls: 'sk-fill-card', tintCls: cls, width: 2.2, cls: 'sk-soft' });
      };
      gflag(40, Y2, 'sk-fill-good');
      gflag(xOf(cfg.totalD) + 28, Y2, 'sk-fill-bad');

      // ruler under the lanes + leg labels
      const RY = Y2 + 18;
      pen.line(gP, xOf(0) - 8, RY, xOf(cfg.totalD) + 10, RY, { cls: 'sk-soft', width: 2.2, single: true });
      const bounds = [0];
      cfg.segs.forEach((s) => { const e = s.d0 + s.d; if (bounds.indexOf(e) < 0) bounds.push(e); });
      bounds.forEach((b, i) => {
        const x = xOf(b);
        pen.line(gP, x, RY - 3, x, RY + 10, { cls: 'sk-soft', width: 2.2, single: true, rough: 0.3 });
        S.text(gP, x, RY + 30, fmt(b, 2) + (i === bounds.length - 1 ? ' ' + cfg.dUnit : ''), { anchor: 'middle', size: 19, cls: 'sk-text-soft' });
      });
      let rows = 0;
      if (!h.has('legs')) {
        const taken = [[], [], [], [], []];
        cfg.segs.forEach((s) => {
          const move = s.d > 0;
          const txt = move ? `${fmt(s.d, 2)} ${cfg.dUnit} in ${fmt(s.t, 2)} ${cfg.tUnit}` : `stopped ${fmt(s.t, 2)} ${cfg.tUnit}`;
          const cx = clamp(move ? xOf(s.d0 + s.d / 2) : xOf(s.d0), 70, 530), hw = txt.length * 4.4 + 8;
          let r = 0;
          while (r < 4 && taken[r].some((b) => cx + hw > b[0] && cx - hw < b[1])) r++;
          taken[r].push([cx - hw, cx + hw]);
          rows = Math.max(rows, r + 1);
          const y = RY + 62 + r * 24;
          if (move) {
            const a = xOf(s.d0) + 4, b = xOf(s.d0 + s.d) - 4;
            pen.line(gP, a, RY + 40 + r * 0, b, RY + 40, { cls: 'sk-accent', width: 2.4, single: true, rough: 0.5 });
            if (r === 0) { pen.line(gP, a, RY + 35, a, RY + 45, { cls: 'sk-accent', width: 2.2, single: true, rough: 0.2 }); pen.line(gP, b, RY + 35, b, RY + 45, { cls: 'sk-accent', width: 2.2, single: true, rough: 0.2 }); }
          }
          S.text(gP, cx, y, txt, { anchor: 'middle', size: 20, cls: move ? 'sk-text' : 'sk-text-bad' });
        });
      }

      // cars (side view)
      realCar = drawCarSide(gP, pen, 'sk-fill-accent', 0.62);
      ghostCar = drawCarSide(ghostLaneG, pen, 'sk-fill-good', 0.62);
      ghostify(ghostCar.g);

      // calculation
      calcG = S.group(gP, 'calc');
      const cy = RY + 62 + Math.max(rows, 1) * 24 + 20;
      S.text(calcG, 300, cy, 'average speed = total distance ÷ total time', { anchor: 'middle', size: 22, cls: 'sk-text' });
      S.text(calcG, 300, cy + 36, `= ${fmt(cfg.totalD, 2)} ÷ ${fmt(cfg.totalT, 2)} = ${fmt(cfg.avg, 2)} ${speedUnit()}`, { anchor: 'middle', size: 32, cls: 'sk-text-accent' });
      H = cy + 56;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      dv = 0;
      calcA = 0;
      draw(S.reduceMotion() ? 1e6 : 0, 0);
    }

    function draw(u, dt) {
      const rm = S.reduceMotion();
      const RUN = cfg.totalT * cfg.scale;
      const f = rm ? 1 : clamp((u - PRE) / RUN, 0, 1);
      const hrs = f * cfg.totalT;
      const r = realAt(hrs);
      const ghostPos = cfg.avg * hrs;
      const xOf = (d) => XS + d * cfg.K;
      const finished = f >= 1;
      const v = finished ? 0 : (f <= 0 ? 0 : r.v);
      setT(realCar.g, xOf(r.pos), Y1);
      realCar.spin(r.pos * cfg.K);
      realCar.setTrail(v <= 0 ? 0 : 0.3 + 1.0 * v / cfg.gmax);
      op(ghostLaneG, 0.9 * ghostA);
      show(ghostLaneG, ghostA > 0.01);
      setT(ghostCar.g, xOf(ghostPos), Y2);
      ghostCar.spin(ghostPos * cfg.K);
      ghostCar.setTrail(finished || f <= 0 ? 0 : 0.5);
      if (gauge) {
        if (rm) dv = 0; else dv = approach(dv, v, dt * cfg.gmax / 0.18);
        gauge.set(dv);
      }
      setTxt(spdT, finished ? 'arrived' : `${fmt(v, 1)} ${speedUnit()}`);
      if (clockHand) clockHand.setAttribute('transform', `rotate(${(360 * f).toFixed(1)} ${clockHand._p[0]} ${clockHand._p[1]})`);
      setTxt(clockT, `${fmt(hrs, 1)} ${cfg.tUnit}`);
      if (!cfg.hide.has('distance')) {
        setTxt(distR, `${fmt(r.pos, 0)} ${cfg.dUnit}`);
        setTxt(distG, `${fmt(ghostPos, 0)} ${cfg.dUnit}`);
      } else { setTxt(distR, ''); setTxt(distG, ''); }
      const wantCalc = !cfg.hide.has('calc') && (rm || (u - PRE - RUN) > 0.4);
      calcA = rm ? (wantCalc ? 1 : 0) : approach(calcA, wantCalc ? 1 : 0, dt / 0.6);
      op(calcG, calcA);
      show(calcG, calcA > 0.01);
    }

    function getState() {
      return { totalD: +cfg.totalD.toFixed(2), totalT: +cfg.totalT.toFixed(2), avg: +cfg.avg.toFixed(2), showGhost: cfg.showGhost };
    }

    rebuild();

    if (interactive) {
      swCtl = mkSwitch(ctrl, 'Show the steady car', cfg.showGhost, (v) => {
        P.showGhost = v;
        cfg = Object.assign(cfg, { showGhost: v });
        clock = 0;
        onChange(getState());
      });
    }

    const stop = S.animate((dt) => {
      if (dead) return false;
      clock += dt;
      const RUN = cfg.totalT * cfg.scale;
      ghostA = S.reduceMotion() ? (cfg.showGhost ? 1 : 0) : approach(ghostA, cfg.showGhost ? 1 : 0, dt / 0.5);
      draw(clock % (PRE + RUN + HOLD), dt);
    });

    return {
      getState,
      setParams(partial) {
        if (dead) return;
        const art = (c) => JSON.stringify([c.segs.map((s) => [s.d, s.t]), c.dUnit, c.tUnit]);
        const hideKey = (c) => [...c.hide].sort().join(',');
        const prev = cfg, wasGhost = cfg.showGhost, prevHide = hideKey(cfg);
        Object.assign(P, partial || {});
        const next = norm();
        if (art(next) !== art(prev) || (hideKey(next) !== prevHide && !(partial && Object.keys(partial).every((k) => k === 'hide' || k === 'showGhost') && onlyCalcChanged(prev, next)))) {
          const gA = ghostA;
          rebuild();
          ghostA = next.showGhost ? Math.max(gA, 0) : gA;
          clock = 0;
        } else {
          cfg.showGhost = next.showGhost;
          cfg.hide = next.hide;
          if (next.showGhost !== wasGhost) clock = 0;
        }
        if (swCtl) swCtl.setValue(cfg.showGhost);
      },
      destroy() { dead = true; stop(); S.clear(root); },
    };
    function onlyCalcChanged(a, b) {
      const diff = new Set();
      a.hide.forEach((k) => { if (!b.hide.has(k)) diff.add(k); });
      b.hide.forEach((k) => { if (!a.hide.has(k)) diff.add(k); });
      return [...diff].every((k) => k === 'calc');
    }
  });
})();
