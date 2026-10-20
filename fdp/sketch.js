/* sketch.js — tiny hand-drawn SVG toolkit (ported from Max's Motion Test Prep).
 * Everything is deterministic (seeded jitter) so redraws don't "boil".
 * Colors come from CSS classes (see sketch.css .sk-*), so diagrams follow the theme.
 * The F/D/P figures that use it live in figures.js.
 */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rng(seed) {
    let s = (seed >>> 0) || 0x9e3779b9;
    return () => {
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
      return ((s >>> 0) % 100000) / 100000;
    };
  }
  let seedCounter = 1;
  const nextSeed = () => (seedCounter = (seedCounter * 7919 + 13) % 1000003);

  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    if (attrs) set(n, attrs);
    if (parent) parent.appendChild(n);
    return n;
  }
  function set(n, attrs) {
    for (const k in attrs) {
      if (attrs[k] === null || attrs[k] === undefined) n.removeAttribute(k);
      else n.setAttribute(k, attrs[k]);
    }
    return n;
  }

  // Responsive SVG: fills container width, keeps aspect ratio.
  function svg(container, w, h, label) {
    const s = el('svg', {
      viewBox: `0 0 ${w} ${h}`, class: 'sk', role: 'img',
      'aria-label': label || 'diagram', preserveAspectRatio: 'xMidYMid meet',
    }, container);
    s.style.width = '100%';
    s.style.height = 'auto';
    s.style.display = 'block';
    return s;
  }

  const group = (parent, cls, attrs) => el('g', Object.assign({ class: cls || '' }, attrs || {}), parent);

  // One wobbly stroke between two points (quadratic with a jittered control point).
  function wobble(x1, y1, x2, y2, r, rough) {
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const amt = Math.min(rough * 1.6, len / 12 + 0.6);
    const j = () => (r() - 0.5) * amt;
    const mx = (x1 + x2) / 2 + j() * 1.5, my = (y1 + y2) / 2 + j() * 1.5;
    return `M${(x1 + j()).toFixed(1)},${(y1 + j()).toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${(x2 + j()).toFixed(1)},${(y2 + j()).toFixed(1)}`;
  }

  function strokeAttrs(o, cls) {
    return {
      class: `${cls} ${o.cls || 'sk-ink'}`,
      fill: 'none',
      'stroke-width': o.width || 2.2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    };
  }

  // opts: { cls:'sk-ink'|'sk-accent'|'sk-good'|'sk-bad'|'sk-soft'|'sk-hl', width, rough (0-3, default 1), seed, single:bool, dash }
  function line(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const r = rng(o.seed || nextSeed());
    const rough = o.rough === undefined ? 1 : o.rough;
    let d = wobble(x1, y1, x2, y2, r, rough);
    if (!o.single) d += ' ' + wobble(x1, y1, x2, y2, r, rough * 0.8);
    const p = el('path', Object.assign(strokeAttrs(o, 'sk-line'), { d }), parent);
    if (o.dash) p.setAttribute('stroke-dasharray', o.dash);
    return p;
  }

  // Polyline through points: [[x,y],...]
  function poly(parent, pts, o) {
    o = o || {};
    const r = rng(o.seed || nextSeed());
    const rough = o.rough === undefined ? 1 : o.rough;
    let d = '';
    const passes = o.single ? 1 : 2;
    for (let k = 0; k < passes; k++) {
      for (let i = 0; i < pts.length - 1; i++) {
        d += wobble(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], r, rough * (k ? 0.8 : 1)) + ' ';
      }
    }
    const p = el('path', Object.assign(strokeAttrs(o, 'sk-line'), { d }), parent);
    if (o.dash) p.setAttribute('stroke-dasharray', o.dash);
    return p;
  }

  // Smooth curve through points (Catmull-Rom -> cubic Bézier), lightly jittered.
  function curve(parent, pts, o) {
    o = o || {};
    const r = rng(o.seed || nextSeed());
    const rough = o.rough === undefined ? 0.6 : o.rough;
    const jit = () => (r() - 0.5) * rough;
    const build = () => {
      const P = pts.map(([x, y]) => [x + jit(), y + jit()]);
      let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
      for (let i = 0; i < P.length - 1; i++) {
        const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
      }
      return d;
    };
    const d = o.single ? build() : build() + ' ' + build();
    return el('path', Object.assign(strokeAttrs(o, 'sk-line'), { d }), parent);
  }

  // opts adds: fill: 'hachure'|'solid'|undefined, fillCls: 'sk-fill-hl'|'sk-fill-accent'|...
  function rect(parent, x, y, w, h, o) {
    o = o || {};
    const g = group(parent, 'sk-rect');
    if (o.fill) fillArea(g, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], o);
    poly(g, [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], o);
    return g;
  }

  function circle(parent, cx, cy, rad, o) {
    o = o || {};
    const r = rng(o.seed || nextSeed());
    const g = group(parent, 'sk-circle');
    if (o.fill === 'solid') el('circle', { cx, cy, r: rad, class: o.fillCls || 'sk-fill-hl' }, g);
    const passes = o.single ? 1 : 2;
    let d = '';
    for (let k = 0; k < passes; k++) {
      const n = 14, start = r() * Math.PI * 2, over = 0.25 + r() * 0.2;
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const a = start + (i / n) * (Math.PI * 2 + over);
        const rr = rad * (1 + (r() - 0.5) * 0.06 * (o.rough === undefined ? 1 : o.rough));
        pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
      }
      d += catmull(pts) + ' ';
    }
    el('path', Object.assign(strokeAttrs(o, 'sk-line'), { d }), g);
    return g;
  }
  function catmull(P) {
    let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }

  // Hachure (pencil shading) or solid fill inside a polygon.
  function fillArea(parent, pts, o) {
    o = o || {};
    const fillCls = o.fillCls || 'sk-fill-hl';
    if (o.fill === 'solid') {
      return el('polygon', { points: pts.map((p) => p.join(',')).join(' '), class: fillCls }, parent);
    }
    const id = 'skc' + nextSeed();
    const defs = el('defs', null, parent);
    const cp = el('clipPath', { id }, defs);
    el('polygon', { points: pts.map((p) => p.join(',')).join(' ') }, cp);
    const g = group(parent, 'sk-hachure', { 'clip-path': `url(#${id})` });
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const gap = o.gap || 7, h = y1 - y0;
    for (let x = x0 - h; x < x1; x += gap) {
      line(g, x, y1, x + h, y0, { cls: o.hachureCls || 'sk-hl', width: o.hachureWidth || 2.4, single: true, rough: 0.6 });
    }
    return g;
  }

  function arrow(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const g = group(parent, 'sk-arrow');
    line(g, x1, y1, x2, y2, o);
    const a = Math.atan2(y2 - y1, x2 - x1), hl = o.head || 11;
    line(g, x2, y2, x2 - hl * Math.cos(a - 0.45), y2 - hl * Math.sin(a - 0.45), Object.assign({}, o, { single: true }));
    line(g, x2, y2, x2 - hl * Math.cos(a + 0.45), y2 - hl * Math.sin(a + 0.45), Object.assign({}, o, { single: true }));
    return g;
  }

  // Hand-lettered text. opts: { size (px in viewBox units, default 18), anchor:'start'|'middle'|'end', cls (fill class, default sk-text), weight }
  function text(parent, x, y, str, o) {
    o = o || {};
    const t = el('text', {
      x, y, class: o.cls || 'sk-text',
      'font-size': o.size || 18,
      'text-anchor': o.anchor || 'start',
      'dominant-baseline': o.baseline || 'alphabetic',
    }, parent);
    if (o.weight) t.setAttribute('font-weight', o.weight);
    t.textContent = str;
    return t;
  }

  // rAF loop. fn(dtSeconds, elapsedSeconds) — return false to stop. Returns stop().
  function animate(fn) {
    let raf = 0, last = performance.now(), start = last, alive = true;
    const tick = (now) => {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (fn(dt, (now - start) / 1000) === false) { alive = false; return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }

  // Big, touch-friendly HTML slider row. Returns { input, setValue(v), el }.
  // opts: { label, min, max, step, value, unit, format(v)->string, onInput(v) }
  function slider(container, o) {
    const row = document.createElement('label');
    row.className = 'sk-slider';
    const name = document.createElement('span');
    name.className = 'sk-slider-label';
    name.textContent = o.label;
    const input = document.createElement('input');
    input.type = 'range';
    input.min = o.min; input.max = o.max; input.step = o.step || 1; input.value = o.value;
    const out = document.createElement('output');
    out.className = 'sk-slider-value';
    const fmt = o.format || ((v) => `${+(+v).toFixed(2)} ${o.unit || ''}`.trim());
    out.textContent = fmt(+input.value);
    input.addEventListener('input', () => {
      out.textContent = fmt(+input.value);
      o.onInput && o.onInput(+input.value);
    });
    row.append(name, input, out);
    container.appendChild(row);
    return {
      el: row, input,
      setValue(v) { input.value = v; out.textContent = fmt(+input.value); },
    };
  }

  // Segmented toggle buttons. opts: { label, options:[{value,label}], value, onChange(v) }
  function toggle(container, o) {
    const wrap = document.createElement('div');
    wrap.className = 'sk-toggle';
    wrap.setAttribute('role', 'group');
    if (o.label) {
      const l = document.createElement('span');
      l.className = 'sk-slider-label';
      l.textContent = o.label;
      wrap.appendChild(l);
    }
    const btns = o.options.map((opt) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = opt.label;
      b.setAttribute('aria-pressed', String(opt.value === o.value));
      b.addEventListener('click', () => {
        btns.forEach((x) => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        o.onChange && o.onChange(opt.value);
      });
      wrap.appendChild(b);
      return b;
    });
    container.appendChild(wrap);
    return {
      el: wrap,
      setValue(v) { o.options.forEach((opt, i) => btns[i].setAttribute('aria-pressed', String(opt.value === v))); },
    };
  }

  const clear = (n) => { while (n.firstChild) n.removeChild(n.firstChild); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const fmtNum = (v, dp = 2) => String(+(+v).toFixed(dp));

  window.Sketch = {
    el, set, svg, group, line, poly, curve, rect, circle, fillArea, arrow, text,
    animate, slider, toggle, clear, lerp, clamp, fmtNum, rng, reduceMotion,
  };
})();
