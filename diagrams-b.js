/* diagrams-b.js — 'velocity', 'accel', 'reference', 'bounce'
 * Hand-drawn SVG diagrams built on window.Sketch. Colors only via .sk-* classes.
 * Static art is rebuilt only when params change (seeded pens => no "boiling");
 * per-frame work is just transforms / a few text nodes.
 *
 * Extra params beyond SPEC (all optional):
 *   velocity: caption (bool, explanatory line), snapshots (bool, faint arrows around loops, default true),
 *             range {speed:[min,max,step]}
 *   accel:    sliders (['a'] | ['a','v0']), range {a:[..], v0:[..]}
 *   reference: (none beyond spec) hide: ['caption']
 *   bounce:   tUnit ('s'), sliders (['d1','t1','d2','t2']), range {d1,t1,d2,t2} or {d,t}
 *   hide keys honoured: velocity ['speed','direction','gauge','legend','checklist']
 *     accel ['label','a','speed','gauge'], bounce ['totalD','totalT','avgS','legs','velocity']
 */
(function () {
  'use strict';
  const S = window.Sketch, D = window.Diagrams;
  if (!S || !D) return;
  const clamp = S.clamp;

  /* ---------------- local helpers ---------------- */
  let uid = 0;
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

  // Seeded pen: same call order => same wobble every rebuild.
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

  // Filled + outlined closed polygon.
  function shape(parent, pen, pts, o) {
    o = o || {};
    const g = S.group(parent, 'sk-shape');
    if (o.fillCls) S.fillArea(g, pts, { fill: 'solid', fillCls: o.fillCls });
    if (o.tintCls) S.fillArea(g, pts, { fill: 'solid', fillCls: o.tintCls });
    pen.poly(g, pts.concat([pts[0]]), { cls: o.cls || 'sk-ink', width: o.width || 2.2, rough: o.rough });
    return g;
  }

  const setT = (n, x, y, rot, cx, cy) => {
    let t = `translate(${x.toFixed(1)} ${y.toFixed(1)})`;
    if (rot) t += ` rotate(${rot.toFixed(1)}${cx !== undefined ? ` ${cx} ${cy}` : ''})`;
    n.setAttribute('transform', t);
  };

  // Phone/Chromebook friendly svg: capped height, centered.
  function mkSvg(root, w, h, label) {
    const s = S.svg(root, w, h, label);
    s.style.maxHeight = '320px';
    s.style.margin = '0 auto';
    return s;
  }
  function mkControls(root, cols) {
    const c = document.createElement('div');
    c.className = 'sk-controls';
    c.style.gap = '4px 16px';
    if (cols) c.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
    root.appendChild(c);
    return c;
  }
  // Compact slider row (keeps ≥36px hit area, same layout on phone & desktop).
  function compactSlider(container, o) {
    const sl = S.slider(container, o);
    sl.el.style.gridTemplateColumns = 'auto minmax(60px, 1fr) auto';
    sl.el.style.gap = '8px';
    sl.el.style.fontSize = '1.05rem';
    sl.input.style.gridColumn = 'auto';
    sl.input.style.gridRow = 'auto';
    sl.input.style.height = '36px';
    sl.input.style.margin = '0';
    return sl;
  }
  const setTxt = (node, s) => { if (node && node.textContent !== s) node.textContent = s; };

  /* ---- speedometer dial: returns { set(v) } ---- */
  function makeGauge(parent, pen, cx, cy, r, max, unit) {
    const g = S.group(parent, 'gauge');
    const A0 = -120, A1 = 120;
    const pt = (ang, rad) => [cx + rad * Math.sin(ang * Math.PI / 180), cy - rad * Math.cos(ang * Math.PI / 180)];
    S.el('circle', { cx, cy, r: r + 8, class: 'sk-fill-card' }, g);
    pen.circle(g, cx, cy, r + 8, { cls: 'sk-ink', width: 2.4 });
    const N = 6;
    for (let i = 0; i <= N; i++) {
      const ang = A0 + (A1 - A0) * i / N;
      const a = pt(ang, r - 1), b = pt(ang, r - (i === 0 || i === N ? 15 : 9));
      pen.line(g, a[0], a[1], b[0], b[1], { cls: 'sk-ink', width: i === 0 || i === N ? 2.6 : 1.8, single: true, rough: 0.4 });
    }
    const l0 = pt(A0, r - 29), l1 = pt(A1, r - 29);
    S.text(g, l0[0] + 2, l0[1] + 6, '0', { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
    S.text(g, l1[0] - 2, l1[1] + 6, fmt(max, 0), { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
    S.text(g, cx, cy + r * 0.93, unit, { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
    const needle = S.group(g, 'needle');
    pen.line(needle, cx, cy + 7, cx, cy - (r - 8), { cls: 'sk-bad', width: 3.4 });
    S.el('circle', { cx, cy, r: 5.5, class: 'sk-fill-ink' }, g);
    let last = null;
    return {
      g,
      set(v) {
        const ang = A0 + (A1 - A0) * clamp(v / (max || 1), 0, 1);
        const t = `rotate(${ang.toFixed(2)} ${cx} ${cy})`;
        if (t !== last) { needle.setAttribute('transform', t); last = t; }
      },
    };
  }

  /* =====================================================================
   *  VELOCITY
   * ===================================================================== */
  D.register('velocity', function (root, params, opts) {
    const interactive = !!(opts && opts.interactive);
    const onChange = (opts && opts.onChange) || function () {};
    const W = 600;
    const CX = 205, CY = 165, RR = 105, HH = 105, RC = 48, HW = 15, KPX = 14;
    const PX = 500, GY = 92, GR = 54, CPY = 278, CPR = 26;
    const PATHS = ['straight', 'circle', 'corners', 'backforth'];
    const BEAR = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
    const NAMES = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const compass = (b) => NAMES[Math.round((((b % 360) + 360) % 360) / 45) % 8];

    const P = Object.assign({ path: 'straight', speed: 6, unit: 'ft/s', heading: 'E', showChecklist: false, caption: false, snapshots: true, hide: [] }, params || {});
    let cfg = null, track = null, s = 0, curBearing = 90, lastDir = '';
    let objG = null, dirVal = null, gP = null, speedCtl = null, pathCtl = null;

    const svg = mkSvg(root, W, 330, 'Top view of a mover on a path with a speedometer and a velocity arrow');
    const gStatic = S.group(svg, 'v-static');
    gP = S.group(svg, 'v-param');
    const ctrl = interactive ? mkControls(root) : null;

    function norm() {
      const path = PATHS.indexOf(P.path) >= 0 ? P.path : 'straight';
      let bearing = 90;
      if (typeof P.heading === 'number' && isFinite(P.heading)) bearing = ((P.heading % 360) + 360) % 360;
      else {
        const k = String(P.heading || 'E').toUpperCase().replace(/[^NESW]/g, '');
        bearing = BEAR[k] !== undefined ? BEAR[k] : 90;
      }
      return {
        path, bearing, speed: num(P.speed, 6, 0, 40), unit: str(P.unit, 'ft/s'),
        showChecklist: !!P.showChecklist, caption: !!P.caption, snapshots: P.snapshots !== false, hide: hideSet(P),
      };
    }

    /* ---- track geometry ---- */
    const lineSeg = (x1, y1, x2, y2, b) => ({ len: Math.hypot(x2 - x1, y2 - y1), at: (u) => [x1 + (x2 - x1) * u, y1 + (y2 - y1) * u, b] });
    const arcSeg = (cx, cy, r, a0, a1) => ({
      len: Math.max(0.01, r * Math.abs(a1 - a0) * Math.PI / 180),
      at: (u) => { const a = a0 + (a1 - a0) * u, t = a * Math.PI / 180; return [cx + r * Math.sin(t), cy - r * Math.cos(t), a + 90]; },
    });
    const rounded = (h, r) => [
      lineSeg(CX, CY - h, CX + h - r, CY - h, 90), arcSeg(CX + h - r, CY - h + r, r, 0, 90),
      lineSeg(CX + h, CY - h + r, CX + h, CY + h - r, 180), arcSeg(CX + h - r, CY + h - r, r, 90, 180),
      lineSeg(CX + h - r, CY + h, CX - h + r, CY + h, 270), arcSeg(CX - h + r, CY + h - r, r, 180, 270),
      lineSeg(CX - h, CY + h - r, CX - h, CY - h + r, 0), arcSeg(CX - h + r, CY - h + r, r, 270, 360),
      lineSeg(CX - h + r, CY - h, CX, CY - h, 90),
    ];
    function segTrack(segs) {
      const len = segs.reduce((a, g) => a + g.len, 0);
      return {
        len,
        at(x) {
          x = ((x % len) + len) % len;
          for (const g of segs) { if (x <= g.len) return g.at(g.len ? x / g.len : 0); x -= g.len; }
          return segs[0].at(0);
        },
      };
    }
    function makeTrack(c) {
      if (c.path === 'circle') return segTrack([arcSeg(CX, CY, RR, 0, 360)]);
      if (c.path === 'corners') return segTrack(rounded(HH, RC));
      if (c.path === 'backforth') {
        return { len: 600, at: (x) => { x = ((x % 600) + 600) % 600; return x < 300 ? [CX - 150 + x, CY, 90] : [CX + 150 - (x - 300), CY, 270]; } };
      }
      const b = c.bearing * Math.PI / 180, dx = Math.sin(b), dy = -Math.cos(b);
      const lh = Math.min(Math.abs(dx) > 1e-6 ? 160 / Math.abs(dx) : 1e9, Math.abs(dy) > 1e-6 ? 120 / Math.abs(dy) : 1e9);
      return { len: 2 * lh, lh, dx, dy, at: (x) => [CX - dx * lh + dx * x, CY - dy * lh + dy * x, c.bearing] };
    }
    const sample = (t, n) => { const o = []; for (let i = 0; i <= n; i++) o.push(t.at(t.len * i / n)); return o; };
    const ptsPath = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + ' Z';
    function ringPts(c, off) {
      if (c.path === 'circle') return sample(segTrack([arcSeg(CX, CY, RR + off, 0, 360)]), 72);
      return sample(segTrack(rounded(HH + off, RC + off)), 100);
    }

    /* ---- art ---- */
    function drawTrackArt(g, pen) {
      if (cfg.path === 'circle' || cfg.path === 'corners') {
        const outer = ringPts(cfg, HW), inner = ringPts(cfg, -HW);
        S.el('path', { d: ptsPath(outer) + ' ' + ptsPath(inner), 'fill-rule': 'evenodd', class: 'sk-fill-hl' }, g);
        if (cfg.path === 'circle') {
          pen.circle(g, CX, CY, RR + HW, { cls: 'sk-soft', width: 2.4 });
          pen.circle(g, CX, CY, RR - HW, { cls: 'sk-soft', width: 2.4 });
        } else {
          pen.curve(g, outer, { cls: 'sk-soft', width: 2.4 });
          pen.curve(g, inner, { cls: 'sk-soft', width: 2.4 });
        }
        const mid = pen.curve(g, sample(track, 90), { cls: 'sk-soft', width: 1.6, single: true });
        mid.setAttribute('stroke-dasharray', '4 10');
        return;
      }
      let x0, y0, x1, y1, nx, ny;
      if (cfg.path === 'backforth') { x0 = CX - 160; x1 = CX + 160; y0 = y1 = CY; nx = 0; ny = 1; }
      else {
        const e = 8;
        x0 = CX - track.dx * (track.lh + e); y0 = CY - track.dy * (track.lh + e);
        x1 = CX + track.dx * (track.lh + e); y1 = CY + track.dy * (track.lh + e);
        nx = -track.dy; ny = track.dx;
      }
      const q = [[x0 + nx * HW, y0 + ny * HW], [x1 + nx * HW, y1 + ny * HW], [x1 - nx * HW, y1 - ny * HW], [x0 - nx * HW, y0 - ny * HW]];
      S.el('path', { d: ptsPath(q), class: 'sk-fill-hl' }, g);
      pen.line(g, q[0][0], q[0][1], q[1][0], q[1][1], { cls: 'sk-soft', width: 2.4 });
      pen.line(g, q[3][0], q[3][1], q[2][0], q[2][1], { cls: 'sk-soft', width: 2.4 });
      pen.line(g, x0, y0, x1, y1, { cls: 'sk-soft', width: 1.6, single: true, dash: '4 10' });
      if (cfg.path === 'backforth') {
        pen.line(g, x0 - 6, CY - 26, x0 - 6, CY + 26, { cls: 'sk-ink', width: 5 });
        pen.line(g, x1 + 6, CY - 26, x1 + 6, CY + 26, { cls: 'sk-ink', width: 5 });
      }
    }

    function drawRunner(g0, pen) {
      const g = S.group(g0, 'runner');
      g.setAttribute('transform', 'scale(1.4)');
      const pts = [];
      for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; pts.push([-1 + 7 * Math.cos(a), 13 * Math.sin(a)]); }
      shape(g, pen, pts, { fillCls: 'sk-fill-card', tintCls: 'sk-fill-accent', width: 2.4 });
      pen.circle(g, 3, 0, 8, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 2.4, single: true });
      pen.line(g, 9.5, -5, 14, 0, { cls: 'sk-ink', width: 2.4, single: true });
      pen.line(g, 14, 0, 9.5, 5, { cls: 'sk-ink', width: 2.4, single: true });
    }

    function drawStatic() {
      const pen = Pen(7);
      pen.circle(gStatic, PX, CPY, CPR, { cls: 'sk-soft', width: 2.2 });
      pen.line(gStatic, PX, CPY - CPR - 5, PX, CPY + CPR + 5, { cls: 'sk-soft', width: 1.8, single: true });
      pen.line(gStatic, PX - CPR - 5, CPY, PX + CPR + 5, CPY, { cls: 'sk-soft', width: 1.8, single: true });
      S.text(gStatic, PX, CPY - CPR - 9, 'N', { anchor: 'middle', size: 20, cls: 'sk-text' });
      S.text(gStatic, PX, CPY + CPR + 24, 'S', { anchor: 'middle', size: 20, cls: 'sk-text' });
      S.text(gStatic, PX + CPR + 15, CPY + 7, 'E', { anchor: 'middle', size: 20, cls: 'sk-text' });
      S.text(gStatic, PX - CPR - 15, CPY + 7, 'W', { anchor: 'middle', size: 20, cls: 'sk-text' });
      const ca = S.group(gStatic, 'compass-arrow');
      pen.arrow(ca, PX, CPY + 5, PX, CPY - 20, { cls: 'sk-accent', width: 3.6, head: 10 });
      gStatic._ca = ca;
    }
    drawStatic();
    const cArrow = gStatic._ca;

    function rebuild() {
      const prevKey = cfg ? cfg.path + ':' + cfg.bearing : '';
      cfg = norm();
      track = makeTrack(cfg);
      const key = cfg.path + ':' + cfg.bearing;
      if (key !== prevKey) s = track.len * 0.1;
      S.clear(gP);
      const pen = Pen(21);
      const loops = cfg.path === 'circle' || cfg.path === 'corners';
      drawTrackArt(gP, pen);

      const kA = Math.min(8, 96 / Math.max(cfg.speed, 1));
      const L = cfg.speed * kA;
      if (cfg.snapshots && loops && L > 6) {
        for (let i = 0; i < 8; i++) {
          const p = track.at(track.len * (i + 0.5) / 8);
          const sg = S.group(gP, 'snap', { opacity: 0.6 });
          setT(sg, p[0], p[1], p[2] - 90);
          pen.arrow(sg, 0, 0, L, 0, { cls: 'sk-soft', width: 2.6, head: 11 });
          S.el('circle', { cx: 0, cy: 0, r: 3, class: 'sk-fill-ink' }, sg);
        }
      }

      objG = S.group(gP, 'v-obj');
      drawRunner(objG, pen);
      if (L > 6) pen.arrow(objG, 0, 0, L, 0, { cls: 'sk-accent', width: 4.6, head: 15 });

      // right panel
      const gmax = Math.max(12, Math.ceil(cfg.speed / 4) * 4);
      if (!cfg.hide.has('gauge')) {
        const gg = makeGauge(gP, pen, PX, GY, GR, gmax, cfg.unit);
        gg.set(cfg.speed);
      }
      dirVal = null;
      if (!cfg.hide.has('speed') && !cfg.hide.has('s')) {
        S.text(gP, PX - 2, 190, 'speed:', { anchor: 'end', size: 22, cls: 'sk-text-soft' });
        S.text(gP, PX + 6, 190, fmt(cfg.speed, 1) + ' ' + cfg.unit, { size: 24, cls: 'sk-text' });
      }
      if (!cfg.hide.has('direction') && !cfg.hide.has('dir')) {
        S.text(gP, PX - 2, 219, 'direction:', { anchor: 'end', size: 22, cls: 'sk-text-soft' });
        dirVal = S.text(gP, PX + 6, 219, '', { size: 24, cls: 'sk-text-accent' });
      }
      lastDir = '';

      let H = 330;
      if (!cfg.hide.has('legend')) S.text(gP, CX, 316, 'arrow = velocity (speed + direction)', { anchor: 'middle', size: 18, cls: 'sk-text-accent' });
      if (cfg.caption) {
        const msg = cfg.path === 'straight' ? 'steady speed, steady direction: velocity is constant'
          : cfg.path === 'backforth' ? 'same speed, but the arrow flips at each end'
            : 'same speed, but the arrow keeps turning';
        S.text(gP, CX, 344, msg, { anchor: 'middle', size: 20, cls: 'sk-text' });
        H = 358;
      }
      if (cfg.showChecklist && !cfg.hide.has('checklist')) {
        const rows = [['speed constant?', true], ['velocity constant?', cfg.path === 'straight']];
        rows.forEach((r, i) => {
          const yb = H + 30 + i * 32, yc = yb - 8, mx = 330;
          S.text(gP, 90, yb, r[0], { size: 22, cls: 'sk-text' });
          if (r[1]) {
            pen.poly(gP, [[mx - 9, yc], [mx - 2, yc + 8], [mx + 10, yc - 10]], { cls: 'sk-good', width: 4.2 });
            S.text(gP, mx + 24, yb, 'yes', { size: 22, cls: 'sk-text-good' });
          } else {
            pen.line(gP, mx - 8, yc - 8, mx + 8, yc + 8, { cls: 'sk-bad', width: 4.2 });
            pen.line(gP, mx + 8, yc - 8, mx - 8, yc + 8, { cls: 'sk-bad', width: 4.2 });
            S.text(gP, mx + 24, yb, 'no', { size: 22, cls: 'sk-text-bad' });
          }
        });
        H += 78;
      }
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      place(s, S.reduceMotion());
    }

    function place(pos, rm) {
      const L = track.len;
      const ss = ((pos % L) + L) % L;
      const p = track.at(ss);
      const b = p[2];
      setT(objG, p[0], p[1], b - 90);
      let op = 1;
      if (!rm && cfg.path === 'straight') op = Math.min(1, ss / 40, (L - ss) / 40);
      objG.setAttribute('opacity', op.toFixed(2));
      cArrow.setAttribute('transform', `rotate(${b.toFixed(1)} ${PX} ${CPY})`);
      curBearing = b;
      if (dirVal) setTxt(dirVal, compass(b));
    }

    function getState() {
      return { path: cfg.path, speed: cfg.speed, speedConstant: true, velocityConstant: cfg.path === 'straight', direction: compass(curBearing) };
    }

    rebuild();

    if (interactive) {
      const r = rangeOf(P, 'speed', [0, 12, 1]);
      speedCtl = compactSlider(ctrl, {
        label: 'speed', min: Math.min(r[0], cfg.speed), max: Math.max(r[1], cfg.speed), step: r[2], value: cfg.speed,
        format: (v) => `${fmt(v, 1)} ${cfg.unit}`,
        onInput: (v) => { P.speed = v; rebuild(); onChange(getState()); },
      });
      pathCtl = S.toggle(ctrl, {
        label: 'path:', value: cfg.path,
        options: [{ value: 'straight', label: 'straight' }, { value: 'circle', label: 'circle' }, { value: 'corners', label: 'corners' }, { value: 'backforth', label: 'back & forth' }],
        onChange: (v) => { P.path = v; rebuild(); onChange(getState()); },
      });
      pathCtl.el.style.gap = '6px';
      pathCtl.el.querySelectorAll('button').forEach((b) => { b.style.padding = '4px 12px'; b.style.minHeight = '38px'; });
    }

    const stop = S.animate((dt, el) => {
      const rm = S.reduceMotion();
      if (cfg.speed > 0) {
        if (rm) s = ((Math.floor(el / 1.4) % 8) + 0.5) / 8 * track.len;
        else s += cfg.speed * KPX * dt;
      }
      place(s, rm);
    });

    return {
      getState,
      setParams(partial) {
        Object.assign(P, partial || {});
        rebuild();
        if (speedCtl) speedCtl.setValue(cfg.speed);
        if (pathCtl) pathCtl.setValue(cfg.path);
      },
      destroy() { stop(); S.clear(root); },
    };
  });

  /* =====================================================================
   *  ACCEL
   * ===================================================================== */
  D.register('accel', function (root, params, opts) {
    const interactive = !!(opts && opts.interactive);
    const onChange = (opts && opts.onChange) || function () {};
    const W = 600, H = 352, X0 = 70, ROAD = 235, TAPE = 274, GX = 502, GYc = 74, GRr = 46, LEAD = 0.5, HOLD = 2.6;

    const P = Object.assign({ v0: 10, a: 0, seconds: 6, unit: 'm/s', stopSign: false, hide: [], sliders: ['a'] }, params || {});
    let cfg = null, clock = 0;
    let carG, trailG, spokes = [], dots = [], gauge, titleT, subT, speedT, lastSpeedStr = '', lastSub = '';
    let aCtl = null, vCtl = null;

    const svg = mkSvg(root, W, H, 'Strobe photo of a car: a dot every second shows how its speed changes');
    const gP = S.group(svg, 'a-param');
    const ctrl = interactive ? mkControls(root) : null;

    const accelUnit = (u) => (/\/s$/.test(u) ? u + '²' : u + ' per s');
    const sgn = (v) => (v > 0 ? '+' : '') + fmt(v, 2);

    function norm() {
      const v0 = num(P.v0, 10, 0, 500), a = num(P.a, 0, -200, 200), T = Math.round(num(P.seconds, 6, 1, 10));
      const unit = str(P.unit, 'm/s');
      const tStop = a < 0 && v0 > 0 ? v0 / -a : null;
      const pos = (t) => (a >= 0 || tStop === null || t < tStop ? v0 * t + 0.5 * a * t * t : v0 * v0 / (2 * -a));
      const vel = (t) => (a >= 0 ? v0 + a * t : (tStop === null || t >= tStop ? 0 : Math.max(0, v0 + a * t)));
      const vEnd = Math.max(0, vel(T));
      const peak = Math.max(v0, vEnd);
      const gmax = peak <= 10 ? 10 : peak <= 100 ? Math.ceil(peak / 10) * 10 : Math.ceil(peak / 50) * 50;
      const maxPos = pos(T);
      const usable = (P.stopSign ? 440 : 530) - X0;
      const K = maxPos > 1e-6 ? usable / maxPos : 1;
      return {
        v0, a, T, unit, tStop, pos, vel, vEnd, gmax, K, stopSign: !!P.stopSign, hide: hideSet(P),
        kind: a > 0 ? 'speeding up' : a < 0 ? 'slowing down' : 'constant',
        sliders: Array.isArray(P.sliders) ? P.sliders : ['a'],
      };
    }

    function buildCar(g, pen) {
      carG = S.group(g, 'car');
      trailG = S.group(carG, 'trail');
      [[0, 22], [-12, 32], [-24, 22]].forEach((t) => pen.line(trailG, 0, t[0] - 4, -t[1], t[0] - 4, { cls: 'sk-soft', width: 2.6, single: true }));
      shape(carG, pen, [[-48, -13], [-48, -31], [-30, -34], [-18, -53], [22, -53], [36, -34], [48, -31], [48, -13]], { fillCls: 'sk-fill-card', tintCls: 'sk-fill-accent', width: 2.4 });
      shape(carG, pen, [[-13, -36], [-5, -48], [18, -48], [28, -36]], { fillCls: 'sk-fill-card', width: 2 });
      pen.circle(carG, 6, -40, 5.5, { cls: 'sk-ink', width: 2, single: true });
      S.el('circle', { cx: 46, cy: -24, r: 3.4, class: 'sk-fill-hl' }, carG);
      spokes = [];
      [-28, 28].forEach((wx) => {
        pen.circle(carG, wx, -11, 11, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 2.4 });
        const sp = S.group(carG, 'spokes');
        pen.line(sp, wx - 7, -11, wx + 7, -11, { cls: 'sk-ink', width: 2, single: true, rough: 0.3 });
        pen.line(sp, wx, -18, wx, -4, { cls: 'sk-ink', width: 2, single: true, rough: 0.3 });
        spokes.push([sp, wx]);
      });
    }

    function rebuild() {
      cfg = norm();
      clock = 0;
      S.clear(gP);
      dots = []; spokes = [];
      const pen = Pen(33);
      const { T, K, pos } = cfg;

      // labels (top-left)
      if (!cfg.hide.has('label')) {
        const a = cfg.a;
        titleT = S.text(gP, 24, 36, a > 0 ? 'positive acceleration' : a < 0 ? 'negative acceleration' : 'zero acceleration', { size: 27, cls: 'sk-text-accent' });
        subT = S.text(gP, 24, 63, '', { size: 21, cls: 'sk-text' });
      } else { titleT = null; subT = null; }
      lastSub = '';
      if (!cfg.hide.has('a')) S.text(gP, 24, 91, `acceleration = ${sgn(cfg.a)} ${accelUnit(cfg.unit)}`, { size: 20, cls: 'sk-text-soft' });
      speedT = null;
      if (!cfg.hide.has('speed') && !cfg.hide.has('s')) speedT = S.text(gP, 24, 121, '', { size: 23, cls: 'sk-text' });
      lastSpeedStr = '';

      // speedometer
      gauge = null;
      if (!cfg.hide.has('gauge')) gauge = makeGauge(gP, pen, GX, GYc, GRr, cfg.gmax, cfg.unit);

      // road
      pen.line(gP, 14, ROAD, 586, ROAD, { cls: 'sk-ink', width: 2.8 });
      const dash = pen.line(gP, 14, ROAD + 11, 586, ROAD + 11, { cls: 'sk-soft', width: 2, single: true });
      dash.setAttribute('stroke-dasharray', '14 12');

      // stop sign
      if (cfg.stopSign) {
        const sx = clamp(X0 + K * pos(T) + 88, 120, 562), sy = ROAD - 76;
        pen.line(gP, sx, sy + 24, sx, ROAD, { cls: 'sk-ink', width: 3.4 });
        const oct = [];
        for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; oct.push([sx + 26 * Math.cos(a), sy + 26 * Math.sin(a)]); }
        shape(gP, pen, oct, { fillCls: 'sk-fill-bad', cls: 'sk-bad', width: 3 });
        S.text(gP, sx, sy + 6, 'STOP', { anchor: 'middle', size: 18, cls: 'sk-text-bad' });
      }

      // ticker tape
      pen.rect(gP, 20, TAPE - 17, 560, 34, { cls: 'sk-soft', width: 2, fill: 'solid', fillCls: 'sk-fill-card' });

      // dot geometry & stacking
      const xs = [];
      for (let k = 0; k <= T; k++) xs.push(X0 + K * pos(k));
      const stack = [], groupStart = [];
      for (let k = 0; k <= T; k++) {
        if (k > 0 && Math.abs(xs[k] - xs[k - 1]) < 0.6) { stack[k] = stack[k - 1] + 1; groupStart[k] = groupStart[k - 1]; }
        else { stack[k] = 0; groupStart[k] = k; }
      }
      const groupSize = {};
      for (let k = 0; k <= T; k++) groupSize[groupStart[k]] = (groupSize[groupStart[k]] || 0) + 1;
      const gDots = S.group(gP, 'dots');
      for (let k = 0; k <= T; k++) {
        const g = S.group(gDots, 'dot');
        setT(g, xs[k], TAPE);
        const n = groupSize[groupStart[k]];
        const step = Math.min(6, 30 / Math.max(n - 1, 1));
        const off = stack[k] * step;
        if (stack[k] === 0) {
          const dl = pen.line(g, 0, ROAD + 5 - TAPE, 0, -10, { cls: 'sk-soft', width: 1.8, single: true, rough: 0.3 });
          dl.setAttribute('stroke-dasharray', '3 5');
        }
        const pop = S.group(g, 'pop');
        setT(pop, 0, -off);
        S.el('circle', { cx: 0, cy: 0, r: 6.5, class: 'sk-fill-ink' }, pop);
        pen.circle(pop, 0, 0, 9, { cls: 'sk-accent', width: 2, single: true, rough: 0.5 });
        dots.push({ g, pop, k, x: xs[k], off });
      }
      // tape labels, pile label first so it wins
      const boxes = [];
      const place = (x, txt) => {
        const hw = txt.length * 5.2 + 6;
        if (boxes.some((b) => x + hw > b[0] && x - hw < b[1])) return;
        boxes.push([x - hw, x + hw]);
        S.text(gP, x, TAPE + 40, txt, { anchor: 'middle', size: 19, cls: 'sk-text' });
      };
      Object.keys(groupSize).forEach((gs) => {
        if (groupSize[gs] > 1) place(xs[gs], `${gs}–${T}`);
      });
      for (let k = 0; k <= T; k++) place(xs[k], String(k));
      S.text(gP, 24, 342, 'one dot every second · numbers = seconds', { size: 18, cls: 'sk-text-soft' });

      buildCar(gP, pen);
      frame(S.reduceMotion() ? T : 0);
    }

    function frame(tau) {
      const { K, pos, vel, T } = cfg;
      const px = K * pos(tau), x = X0 + px, v = vel(tau);
      setT(carG, x, ROAD);
      spokes.forEach((sp) => sp[0].setAttribute('transform', `rotate(${((px / 11) * 57.296 % 360).toFixed(1)} ${sp[1]} -11)`));
      const f = v <= 0.01 ? 0 : 0.4 + 0.9 * v / cfg.gmax;
      trailG.setAttribute('transform', `translate(-52 0) scale(${f.toFixed(2)} 1)`);
      trailG.setAttribute('opacity', f > 0 ? '0.85' : '0');
      if (gauge) gauge.set(v);
      const ss = `speed now: ${fmt(v, 1)} ${cfg.unit}`;
      if (speedT && ss !== lastSpeedStr) { speedT.textContent = ss; lastSpeedStr = ss; }
      const stopped = cfg.tStop !== null && tau >= cfg.tStop - 1e-9;
      if (subT) {
        let sub;
        if (cfg.a > 0) sub = '(speeding up)';
        else if (cfg.a < 0) sub = stopped ? 'it slowed down and stopped.' : '= deceleration (slowing down)';
        else sub = '(constant velocity)';
        if (cfg.stopSign && stopped) sub = 'stopped at the sign';
        if (sub !== lastSub) { subT.textContent = sub; lastSub = sub; }
      }
      dots.forEach((d) => {
        const age = tau - d.k;
        const vis = age >= -1e-9;
        d.g.setAttribute('visibility', vis ? 'visible' : 'hidden');
        if (vis) {
          const sc = 1 + 0.9 * Math.max(0, 1 - age / 0.3);
          d.pop.setAttribute('transform', `translate(0 ${-d.off}) scale(${sc.toFixed(2)})`);
        }
      });
    }

    function getState() {
      return { v0: cfg.v0, a: cfg.a, vEnd: +cfg.vEnd.toFixed(2), kind: cfg.kind };
    }

    rebuild();

    if (interactive) {
      const ra = rangeOf(P, 'a', [-5, 5, 1]);
      aCtl = compactSlider(ctrl, {
        label: 'acceleration', min: Math.min(ra[0], cfg.a), max: Math.max(ra[1], cfg.a), step: ra[2], value: cfg.a,
        format: (v) => `${sgn(v)} ${accelUnit(cfg.unit)}`,
        onInput: (v) => { P.a = v; rebuild(); onChange(getState()); },
      });
      if (cfg.sliders.indexOf('v0') >= 0) {
        const rv = rangeOf(P, 'v0', [0, 30, 1]);
        vCtl = compactSlider(ctrl, {
          label: 'start speed', min: Math.min(rv[0], cfg.v0), max: Math.max(rv[1], cfg.v0), step: rv[2], value: cfg.v0,
          format: (v) => `${fmt(v, 1)} ${cfg.unit}`,
          onInput: (v) => { P.v0 = v; rebuild(); onChange(getState()); },
        });
      }
    }

    const stop = S.animate((dt) => {
      clock += dt;
      let tau;
      if (S.reduceMotion()) tau = cfg.T;
      else tau = clamp((clock % (LEAD + cfg.T + HOLD)) - LEAD, 0, cfg.T);
      frame(tau);
    });

    return {
      getState,
      setParams(partial) {
        Object.assign(P, partial || {});
        rebuild();
        if (aCtl) aCtl.setValue(cfg.a);
        if (vCtl) vCtl.setValue(cfg.v0);
      },
      destroy() { stop(); S.clear(root); },
    };
  });

  /* =====================================================================
   *  REFERENCE
   * ===================================================================== */
  D.register('reference', function (root, params, opts) {
    const interactive = !!(opts && opts.interactive);
    const onChange = (opts && opts.onChange) || function () {};
    const W = 600, H = 340, TR_Y = 216, PLAT_Y = 252, PER = 720, V0 = 125, PERSON = 440;

    const P = Object.assign({ viewpoint: 'platform', trainSpeed: 1, hide: [] }, params || {});
    const norm = () => ({ viewpoint: P.viewpoint === 'train' ? 'train' : 'platform', speed: num(P.trainSpeed, 1, 0, 4), hide: hideSet(P) });
    let cfg = norm();
    let blend = cfg.viewpoint === 'train' ? 1 : 0, o = cfg.viewpoint === 'train' ? 0 : -170, sx = 0, wheelAng = 0, togCtl = null;

    const svg = mkSvg(root, W, H, 'A train and a platform, watched from different reference points');
    const clipId = 'skref' + (++uid);
    const cp = S.el('clipPath', { id: clipId }, S.el('defs', null, svg));
    S.el('rect', { x: 8, y: 52, width: 584, height: H - 60 }, cp);
    const caption = S.text(svg, W / 2, 36, '', { anchor: 'middle', size: 27, cls: 'sk-text-accent' });
    const scene = S.group(svg, 'ref-scene', { 'clip-path': `url(#${clipId})` });
    const ctrl = interactive ? mkControls(root) : null;
    const pen = Pen(51);

    function drawTree(parent, sc) {
      const g = S.group(parent, 'tree');
      const inner = S.group(g, '');
      inner.setAttribute('transform', `scale(${sc})`);
      pen.poly(inner, [[-8, 0], [-5, -62], [5, -62], [8, 0]], { cls: 'sk-ink', width: 2.6 });
      pen.circle(inner, -22, -86, 28, { fill: 'solid', fillCls: 'sk-fill-good', cls: 'sk-ink', width: 2.4 });
      pen.circle(inner, 22, -86, 28, { fill: 'solid', fillCls: 'sk-fill-good', cls: 'sk-ink', width: 2.4 });
      pen.circle(inner, 0, -114, 31, { fill: 'solid', fillCls: 'sk-fill-good', cls: 'sk-ink', width: 2.4 });
      return g;
    }
    const mkArrow = (parent, dir, y) => {
      const g = S.group(parent, 'motion-arrow');
      pen.arrow(g, dir > 0 ? -34 : 34, y, dir > 0 ? 34 : -34, y, { cls: 'sk-accent', width: 4, head: 13 });
      g.setAttribute('display', 'none');
      return g;
    };

    const tree1 = drawTree(scene, 1), tree2 = drawTree(scene, 0.72);
    const treeArrows = [mkArrow(tree1, -1, -158), mkArrow(tree2, -1, -118)];

    // track bed
    const sleepers = S.group(scene, 'sleepers');
    for (let x = -80; x <= 680; x += 40) pen.line(sleepers, x, TR_Y + 3, x - 10, TR_Y + 17, { cls: 'sk-soft', width: 3, single: true });
    pen.line(scene, -20, TR_Y + 1, 620, TR_Y + 1, { cls: 'sk-ink', width: 3 });
    pen.line(scene, -20, TR_Y + 18, 620, TR_Y + 18, { cls: 'sk-ink', width: 3 });

    // train (local origin: center of train, rail level)
    const trainG = S.group(scene, 'train');
    const wheelSpokes = [];
    const car = (x0, x1, winCenters) => {
      shape(trainG, pen, [[x0, -86], [x1, -86], [x1, -20], [x0, -20]], { fillCls: 'sk-fill-card', tintCls: 'sk-fill-accent', width: 2.6 });
      pen.line(trainG, x0 + 3, -28, x1 - 3, -28, { cls: 'sk-ink', width: 1.8, single: true });
      winCenters.forEach((c) => shape(trainG, pen, [[c - 18, -76], [c + 18, -76], [c + 18, -44], [c - 18, -44]], { fillCls: 'sk-fill-card', width: 2.2 }));
    };
    car(-215, -75, [-185, -145, -105]);
    car(-70, 70, [-40, 0, 40]);
    // passenger in the middle window of car B
    const paxHL = S.el('ellipse', { cx: 0, cy: -58, rx: 17, ry: 15, class: 'sk-fill-hl' }, trainG);
    shape(trainG, pen, [[-15, -44], [-13, -52], [-6, -55], [6, -55], [13, -52], [15, -44]], { fillCls: 'sk-fill-card', tintCls: 'sk-fill-accent', width: 2 });
    pen.circle(trainG, 0, -63, 8.5, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 2, single: true });
    pen.curve(trainG, [[-4, -61], [0, -58.5], [4, -61]], { cls: 'sk-ink', width: 1.6, single: true, rough: 0.2 });
    // engine
    shape(trainG, pen, [[75, -86], [185, -86], [215, -52], [215, -20], [75, -20]], { fillCls: 'sk-fill-card', tintCls: 'sk-fill-accent', width: 2.6 });
    shape(trainG, pen, [[88, -72], [128, -72], [128, -44], [88, -44]], { fillCls: 'sk-fill-card', width: 2.2 });
    shape(trainG, pen, [[150, -72], [180, -72], [196, -52], [150, -52]], { fillCls: 'sk-fill-card', width: 2.2 });
    S.el('circle', { cx: 209, cy: -34, r: 4.5, class: 'sk-fill-hl' }, trainG);
    pen.line(trainG, -75, -34, -70, -34, { cls: 'sk-ink', width: 3, single: true });
    pen.line(trainG, 70, -34, 75, -34, { cls: 'sk-ink', width: 3, single: true });
    [-180, -110, -35, 35, 105, 170].forEach((wx) => {
      pen.circle(trainG, wx, -10, 10, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 2.4 });
      const sp = S.group(trainG, 'spokes');
      pen.line(sp, wx - 7, -10, wx + 7, -10, { cls: 'sk-ink', width: 2, single: true, rough: 0.3 });
      pen.line(sp, wx, -17, wx, -3, { cls: 'sk-ink', width: 2, single: true, rough: 0.3 });
      wheelSpokes.push([sp, wx]);
    });
    const trainArrow = mkArrow(trainG, 1, -108);

    // platform (foreground)
    pen.rect(scene, -20, PLAT_Y, 640, 64, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 2.8 });
    const platTex = S.group(scene, 'platform-tex');
    for (let x = -100; x <= 700; x += 100) pen.line(platTex, x, PLAT_Y + 18, x, PLAT_Y + 60, { cls: 'sk-soft', width: 2, single: true });
    const stripe = S.group(scene, 'stripe');
    for (let x = -60; x <= 660; x += 30) pen.line(stripe, x, PLAT_Y + 8, x + 16, PLAT_Y + 8, { cls: 'sk-hl', width: 5, single: true, rough: 0.3 });

    // sign
    const sign = S.group(scene, 'sign');
    pen.line(sign, 0, 0, 0, -50, { cls: 'sk-ink', width: 3.2 });
    shape(sign, pen, [[-44, -52], [44, -52], [44, -22], [-44, -22]], { fillCls: 'sk-fill-card', tintCls: 'sk-fill-hl', width: 2.4 });
    S.text(sign, 0, -30, 'Station', { anchor: 'middle', size: 19, cls: 'sk-text' });
    sign.setAttribute('transform', `translate(0 ${PLAT_Y})`);

    // person on the platform
    const person = S.group(scene, 'person');
    const personHL = S.el('ellipse', { cx: 0, cy: -38, rx: 27, ry: 46, class: 'sk-fill-hl' }, person);
    pen.circle(person, 0, -70, 10, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 2.6, single: true });
    pen.line(person, 0, -60, 0, -28, { cls: 'sk-ink', width: 3.4 });
    pen.line(person, 0, -28, -10, 0, { cls: 'sk-ink', width: 3.4 });
    pen.line(person, 0, -28, 10, 0, { cls: 'sk-ink', width: 3.4 });
    pen.line(person, 0, -52, -14, -34, { cls: 'sk-ink', width: 3.2 });
    pen.line(person, 0, -52, 14, -34, { cls: 'sk-ink', width: 3.2 });
    const personArrow = mkArrow(person, -1, -102);

    // viewfinder frame
    const frameG = S.group(svg, 'frame');
    [[8, 52, 1, 1], [592, 52, -1, 1], [8, H - 8, 1, -1], [592, H - 8, -1, -1]].forEach((c) => {
      pen.poly(frameG, [[c[0], c[1] + 20 * c[3]], [c[0], c[1]], [c[0] + 20 * c[2], c[1]]], { cls: 'sk-soft', width: 3, single: true });
    });

    function applyCaption() {
      const t = cfg.viewpoint === 'train' ? "Reference point: the passenger's seat" : 'Reference point: the platform';
      caption.textContent = t;
      caption.setAttribute('display', cfg.hide.has('caption') ? 'none' : 'inline');
    }
    applyCaption();

    const px = (base) => ((((base - sx) % PER) + PER) % PER) - 60;

    function frame(dt, rm) {
      const target = cfg.viewpoint === 'train' ? 1 : 0;
      if (rm) blend = target;
      else if (blend !== target) { const st = dt / 0.9; blend += clamp(target - blend, -st, st); }
      const e = blend * blend * (3 - 2 * blend);
      const v = V0 * cfg.speed;
      if (rm) { o = target ? 0 : -150; sx = 0; }
      else {
        sx = (sx + e * v * dt) % 14400;
        if (blend >= 1) o = 0;
        else { o += v * dt; if (e === 0 && o > 560) o -= 1120; }
        wheelAng = (wheelAng + v * dt / 10 * 57.296) % 360;
      }
      const tx = 300 + (1 - e) * o;
      setT(trainG, tx, TR_Y);
      wheelSpokes.forEach((w) => w[0].setAttribute('transform', `rotate(${wheelAng.toFixed(1)} ${w[1]} -10)`));
      setT(tree1, px(140), TR_Y);
      setT(tree2, px(560), TR_Y);
      setT(sign, px(250), PLAT_Y);
      setT(person, px(PERSON), PLAT_Y);
      sleepers.setAttribute('transform', `translate(${(-(sx % 40)).toFixed(1)} 0)`);
      platTex.setAttribute('transform', `translate(${(-(sx % 100)).toFixed(1)} 0)`);
      stripe.setAttribute('transform', `translate(${(-(sx % 30)).toFixed(1)} 0)`);
      personHL.setAttribute('opacity', (1 - e).toFixed(2));
      paxHL.setAttribute('opacity', e.toFixed(2));
      const showTrainArrow = rm && e < 0.5, showSceneArrow = rm && e >= 0.5;
      trainArrow.setAttribute('display', showTrainArrow ? 'inline' : 'none');
      personArrow.setAttribute('display', showSceneArrow ? 'inline' : 'none');
      treeArrows.forEach((a) => a.setAttribute('display', showSceneArrow ? 'inline' : 'none'));
    }
    frame(0, S.reduceMotion());

    if (interactive) {
      togCtl = S.toggle(ctrl, {
        label: 'Watch from:', value: cfg.viewpoint,
        options: [{ value: 'platform', label: 'the platform' }, { value: 'train', label: 'inside the train' }],
        onChange: (v) => { P.viewpoint = v; cfg = norm(); applyCaption(); onChange({ viewpoint: cfg.viewpoint }); },
      });
      togCtl.el.style.gap = '6px';
      togCtl.el.querySelectorAll('button').forEach((b) => { b.style.padding = '4px 12px'; b.style.minHeight = '38px'; });
    }

    const stop = S.animate((dt) => frame(dt, S.reduceMotion()));

    return {
      getState() { return { viewpoint: cfg.viewpoint }; },
      setParams(partial) {
        Object.assign(P, partial || {});
        cfg = norm();
        applyCaption();
        if (togCtl) togCtl.setValue(cfg.viewpoint);
      },
      destroy() { stop(); S.clear(root); },
    };
  });

  /* =====================================================================
   *  BOUNCE
   * ===================================================================== */
  D.register('bounce', function (root, params, opts) {
    const interactive = !!(opts && opts.interactive);
    const onChange = (opts && opts.onChange) || function () {};
    const W = 600, XL = 60, XR = 500, FLOOR = 232, BR = 16, BY = FLOOR - BR, PRE = 0.7, BUMP = 0.45, HOLD = 4.5;
    const OX = 28, OY = 34, SWX = 322, SWY = 56;

    const P = Object.assign({ d1: 100, t1: 4, d2: 50, t2: 2, unit: 'ft', tUnit: 's', hide: [], sliders: ['d1', 't1', 'd2', 't2'] }, params || {});
    let cfg = null, clock = 0, ctl = {};
    let moveG, spinG, arrR, arrL, odoT, swT, hand, calcG, burst, lastOdo = '', lastSw = '';

    const svg = mkSvg(root, W, 390, 'A ball rolls to a wall and bounces back, with an odometer and a stopwatch');
    const gStatic = S.group(svg, 'b-static');
    const gP = S.group(svg, 'b-param');
    const ctrl = interactive ? mkControls(root, true) : null;

    function norm() {
      const d1 = num(P.d1, 100, 1, 1000), t1 = num(P.t1, 4, 0.1, 200), d2 = num(P.d2, 50, 0, 1000), t2 = num(P.t2, 2, 0.1, 200);
      const unit = str(P.unit, 'ft'), tUnit = str(P.tUnit, 's');
      const s1 = d1 / t1, s2 = d2 / t2, totalD = d1 + d2, totalT = t1 + t2, avgS = totalD / totalT;
      const pmin = Math.min(0, d1 - d2), span = d1 - pmin, K = (XR - XL) / span;
      const tau = clamp(7 / totalT, 0.3, 1.5);
      return {
        d1, t1, d2, t2, unit, tUnit, s1, s2, totalD, totalT, avgS, pmin, K, tau,
        L1: t1 * tau, L2: t2 * tau, sameSpeed: Math.abs(s1 - s2) < 0.01 * Math.max(s1, s2, 1),
        hide: hideSet(P), sliders: Array.isArray(P.sliders) ? P.sliders : ['d1', 't1', 'd2', 't2'],
      };
    }
    const xOf = (pos) => XL + (pos - cfg.pmin) * cfg.K;
    const spd = (v) => `${fmt(v, 2)} ${cfg.unit}/${cfg.tUnit}`;

    // never-changing art: wall, floor, burst
    (function () {
      const pen = Pen(61);
      S.fillArea(gStatic, [[XR + 17, 90], [XR + 45, 90], [XR + 45, FLOOR + 2], [XR + 17, FLOOR + 2]], { gap: 8, hachureCls: 'sk-soft', hachureWidth: 2 });
      pen.rect(gStatic, XR + 17, 90, 28, FLOOR - 88, { cls: 'sk-ink', width: 3 });
      pen.line(gStatic, 14, FLOOR, XR + 45, FLOOR, { cls: 'sk-ink', width: 3 });
      burst = S.group(gStatic, 'burst');
      for (let i = 0; i < 5; i++) {
        const a = Math.PI * (0.62 + i * 0.19);
        pen.line(burst, XR + 14 + Math.cos(a) * 14, BY + Math.sin(a) * 14 - 4, XR + 14 + Math.cos(a) * 32, BY + Math.sin(a) * 32 - 4, { cls: 'sk-bad', width: 3.4, single: true });
      }
      S.text(burst, XR - 26, 168, 'bounce', { anchor: 'middle', size: 23, cls: 'sk-text-bad' });
      burst.setAttribute('display', 'none');
    })();

    function niceStep(minUnits) {
      const c = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000];
      for (const v of c) if (v >= minUnits) return v;
      return c[c.length - 1];
    }

    function rebuild() {
      cfg = norm();
      clock = 0;
      S.clear(gP);
      const pen = Pen(63);
      const h = cfg.hide;
      let H = 296;

      // odometer
      odoT = null; swT = null; hand = null;
      if (!h.has('totalD')) {
        S.text(gP, OX + 4, OY - 8, 'odometer', { size: 19, cls: 'sk-text-soft' });
        pen.rect(gP, OX, OY, 214, 46, { cls: 'sk-ink', width: 2.6, fill: 'solid', fillCls: 'sk-fill-card' });
        odoT = S.text(gP, OX + 204, OY + 36, '', { anchor: 'end', size: 32, cls: 'sk-text' });
      }
      if (!h.has('totalT')) {
        pen.circle(gP, SWX, SWY, 24, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 2.6 });
        pen.line(gP, SWX, SWY - 24, SWX, SWY - 31, { cls: 'sk-ink', width: 4.5, single: true });
        pen.line(gP, SWX - 5, SWY - 31, SWX + 5, SWY - 31, { cls: 'sk-ink', width: 4.5, single: true });
        for (let i = 0; i < 4; i++) {
          const a = i * Math.PI / 2;
          pen.line(gP, SWX + Math.sin(a) * 19, SWY - Math.cos(a) * 19, SWX + Math.sin(a) * 23, SWY - Math.cos(a) * 23, { cls: 'sk-ink', width: 2, single: true, rough: 0.2 });
        }
        hand = S.group(gP, 'hand');
        pen.line(hand, SWX, SWY + 3, SWX, SWY - 18, { cls: 'sk-bad', width: 3, single: true });
        S.el('circle', { cx: SWX, cy: SWY, r: 3.5, class: 'sk-fill-ink' }, gP);
        S.text(gP, SWX + 38, OY - 8, 'stopwatch', { size: 19, cls: 'sk-text-soft' });
        swT = S.text(gP, SWX + 38, OY + 36, '', { size: 32, cls: 'sk-text' });
      }

      // ruler
      const step = niceStep(62 / cfg.K);
      pen.line(gP, xOf(cfg.pmin) - 10, FLOOR + 14, XR + 12, FLOOR + 14, { cls: 'sk-soft', width: 1.6, single: true });
      const first = Math.ceil(cfg.pmin / step - 1e-9), last = Math.floor(cfg.d1 / step + 1e-9);
      for (let i = first; i <= last; i++) {
        const x = xOf(i * step);
        pen.line(gP, x, FLOOR + 6, x, FLOOR + 22, { cls: 'sk-soft', width: 2, single: true, rough: 0.3 });
        S.text(gP, x, FLOOR + 44, fmt(i * step, 0) + (i === last ? ' ' + cfg.unit : ''), { anchor: 'middle', size: 19, cls: 'sk-text-soft' });
      }

      // legs
      if (!h.has('legs')) {
        const x0 = xOf(0), x1 = xOf(cfg.d1), x2 = xOf(cfg.d1 - cfg.d2);
        pen.arrow(gP, x0, 112, x1, 112, { cls: 'sk-soft', width: 2.6, head: 11 });
        S.text(gP, (x0 + x1) / 2, 103, `leg 1: ${fmt(cfg.d1, 1)} ${cfg.unit} in ${fmt(cfg.t1, 1)} ${cfg.tUnit}`, { anchor: 'middle', size: 20, cls: 'sk-text' });
        if (cfg.d2 > 0.01) {
          pen.arrow(gP, x1, 144, x2, 144, { cls: 'sk-soft', width: 2.6, head: 11 });
          S.text(gP, (x1 + x2) / 2, 135, `leg 2: ${fmt(cfg.d2, 1)} ${cfg.unit} in ${fmt(cfg.t2, 1)} ${cfg.tUnit}`, { anchor: 'middle', size: 20, cls: 'sk-text' });
          const dl = pen.line(gP, x2, 146, x2, FLOOR, { cls: 'sk-soft', width: 1.6, single: true });
          dl.setAttribute('stroke-dasharray', '3 6');
        }
        const dl0 = pen.line(gP, x0, 114, x0, FLOOR, { cls: 'sk-soft', width: 1.6, single: true });
        dl0.setAttribute('stroke-dasharray', '3 6');
      }

      // ball + velocity arrows
      moveG = S.group(gP, 'ball');
      spinG = S.group(moveG, 'spin');
      pen.circle(spinG, 0, 0, BR, { fill: 'solid', fillCls: 'sk-fill-hl', cls: 'sk-ink', width: 2.6 });
      pen.line(spinG, -BR + 3, 0, BR - 3, 0, { cls: 'sk-ink', width: 2, single: true, rough: 0.3 });
      pen.line(spinG, 0, -BR + 3, 0, BR - 3, { cls: 'sk-ink', width: 2, single: true, rough: 0.3 });
      const kv = 64 / Math.max(cfg.s1, cfg.s2, 1e-6);
      arrR = S.group(moveG, 'vR'); arrL = S.group(moveG, 'vL');
      const ay = -34;
      if (!h.has('velocity')) {
        const lr = Math.max(14, cfg.s1 * kv), ll = Math.max(14, cfg.s2 * kv);
        pen.arrow(arrR, 0, ay, lr, ay, { cls: 'sk-accent', width: 4.6, head: 14 });
        S.text(arrR, 0, ay - 10, 'velocity', { size: 19, cls: 'sk-text-accent' });
        if (cfg.d2 > 0.01) {
          pen.arrow(arrL, 0, ay, -ll, ay, { cls: 'sk-accent', width: 4.6, head: 14 });
          S.text(arrL, 0, ay - 10, 'velocity', { anchor: 'end', size: 19, cls: 'sk-text-accent' });
        }
      }

      // calculation
      calcG = S.group(gP, 'calc');
      if (!h.has('avgS')) {
        H = 380;
        S.text(calcG, 300, 306, 'average speed = total distance ÷ total time', { anchor: 'middle', size: 21, cls: 'sk-text' });
        S.text(calcG, 300, 338, `= ${fmt(cfg.totalD, 1)} ÷ ${fmt(cfg.totalT, 1)} = ${spd(cfg.avgS)}`, { anchor: 'middle', size: 30, cls: 'sk-text-accent' });
        const note = cfg.sameSpeed ? `each leg: ${spd(cfg.s1)}, but the direction flipped` : '(not the average of the two speeds)';
        S.text(calcG, 300, 366, note, { anchor: 'middle', size: 21, cls: cfg.sameSpeed ? 'sk-text' : 'sk-text-bad' });
      }
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      lastOdo = ''; lastSw = '';
      apply(S.reduceMotion() ? finalState() : startState());
    }

    const startState = () => ({ pos: 0, dist: 0, time: 0, dir: 0, bump: false, calc: false });
    const wallState = () => ({ pos: cfg.d1, dist: cfg.d1, time: cfg.t1, dir: 0, bump: true, calc: false });
    const finalState = () => ({ pos: cfg.d1 - cfg.d2, dist: cfg.totalD, time: cfg.totalT, dir: 0, bump: false, calc: true });
    function stateAt(u) {
      if (u < PRE) return startState();
      u -= PRE;
      if (u < cfg.L1) { const f = u / cfg.L1; return { pos: cfg.d1 * f, dist: cfg.d1 * f, time: cfg.t1 * f, dir: 1, bump: false, calc: false }; }
      u -= cfg.L1;
      if (u < BUMP) return wallState();
      u -= BUMP;
      if (u < cfg.L2) { const f = u / cfg.L2; return { pos: cfg.d1 - cfg.d2 * f, dist: cfg.d1 + cfg.d2 * f, time: cfg.t1 + cfg.t2 * f, dir: -1, bump: false, calc: false }; }
      return finalState();
    }

    function apply(st) {
      const x = xOf(st.pos);
      setT(moveG, x, BY);
      spinG.setAttribute('transform', `rotate(${(((x - xOf(0)) / BR * 57.296) % 360).toFixed(1)})`);
      arrR.setAttribute('display', st.dir > 0 ? 'inline' : 'none');
      arrL.setAttribute('display', st.dir < 0 ? 'inline' : 'none');
      burst.setAttribute('display', st.bump ? 'inline' : 'none');
      calcG.setAttribute('display', st.calc ? 'inline' : 'none');
      if (odoT) { const s = `${fmt(st.dist, 1)} ${cfg.unit}`; if (s !== lastOdo) { odoT.textContent = s; lastOdo = s; } }
      if (swT) {
        const s = `${fmt(st.time, 1)} ${cfg.tUnit}`;
        if (s !== lastSw) { swT.textContent = s; lastSw = s; }
        hand.setAttribute('transform', `rotate(${(360 * st.time / cfg.totalT).toFixed(1)} ${SWX} ${SWY})`);
      }
    }

    function getState() {
      return {
        totalD: +cfg.totalD.toFixed(2), totalT: +cfg.totalT.toFixed(2), avgS: +cfg.avgS.toFixed(2),
        s1: +cfg.s1.toFixed(2), s2: +cfg.s2.toFixed(2), sameSpeed: cfg.sameSpeed, velocityConstant: false,
      };
    }

    rebuild();

    if (interactive) {
      const defs = {
        d1: ['leg 1 distance', 'd', [10, 200, 5], (v) => `${fmt(v, 1)} ${cfg.unit}`],
        t1: ['leg 1 time', 't', [1, 10, 0.5], (v) => `${fmt(v, 1)} ${cfg.tUnit}`],
        d2: ['leg 2 distance', 'd', [5, 200, 5], (v) => `${fmt(v, 1)} ${cfg.unit}`],
        t2: ['leg 2 time', 't', [1, 10, 0.5], (v) => `${fmt(v, 1)} ${cfg.tUnit}`],
      };
      cfg.sliders.forEach((key) => {
        const d = defs[key];
        if (!d) return;
        const r = P.range && P.range[key] ? rangeOf(P, key, d[2]) : rangeOf(P, d[1], d[2]);
        const val = cfg[key];
        ctl[key] = compactSlider(ctrl, {
          label: d[0], min: Math.min(r[0], val), max: Math.max(r[1], val), step: r[2], value: val, format: d[3],
          onInput: (v) => { P[key] = v; rebuild(); onChange(getState()); },
        });
      });
    }

    const stop = S.animate((dt, el) => {
      if (S.reduceMotion()) {
        const u = el % 7;
        apply(u < 1.5 ? startState() : u < 3 ? wallState() : finalState());
        return;
      }
      clock += dt;
      const cyc = PRE + cfg.L1 + BUMP + cfg.L2 + HOLD;
      apply(stateAt(clock % cyc));
    });

    return {
      getState,
      setParams(partial) {
        Object.assign(P, partial || {});
        rebuild();
        Object.keys(ctl).forEach((k) => ctl[k].setValue(cfg[k]));
      },
      destroy() { stop(); S.clear(root); },
    };
  });
})();
