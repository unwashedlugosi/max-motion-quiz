/* diagrams-d.js — 'baseball'
 * Baseball-themed "motion in baseball terms" diagrams for Max (pitcher). Hand-drawn SVG on window.Sketch;
 * colors only via .sk-* classes so dark mode works. Static art is rebuilt only when layout params change
 * (seeded pens => no "boiling"); per-frame work is transforms, a few text nodes and a few path strings.
 *
 * type 'baseball', param `scenario`:
 *   pitch     side view, mound -> home plate. mph (50), distanceFt (46), caption ('motion'|'velocity'|string|false)
 *             ruler marker "position: N ft", velocity arrow on the ball, radar gun (speed + direction).
 *             interactive: mph slider (range {mph:[20,80,5]}).
 *   windup    positive acceleration: arm whips the ball 0 -> mph; speed readout climbs; strobe dots spread apart.
 *   catch     negative acceleration: ball slows to 0 in the mitt; strobe dots crowd together; speed falls to 0.
 *   hit       pitch toward the plate, bat sends it straight back at mphBack (default = mph); arrow flips.
 *             showGhost: dashed ghost keeps the old velocity into the backstop + gap line.
 *             interactive: ghost toggle.
 *   bases     top view of the diamond; runner at speedFt (15) ft/s, baseFt (60) per side, steady speed,
 *             arrow turns at each base; checklist speed constant? yes / velocity constant? no.
 *             showGhost: faint ghost goes straight on at each turn. pauseAt (1..3) stops the runner at that base.
 *             interactive: ghost toggle (+ speed slider).
 *   viewpoint same pitch seen from observer 'catcher' | 'stands' | 'ball' (round "view" inset).
 *             interactive: observer toggle. setParams({observer}) animates the switch.
 *   steady    runner home -> first at speedFt (15) ft/s; strobe dots with equal gaps every second.
 *   average   runner: segments [{d,t}] (default [{d:60,t:4},{d:0,t:6},{d:60,t:5}] => 120 / 15 = 8 ft/s);
 *             ghost runner at the average speed arrives at the same time. showGhost defaults to true.
 *             interactive: ghost toggle.
 * common:   mph (50), hide: [...] (any of 'caption','labels'|'label','readout'|'speed','direction','position',
 *           'checklist','calc','ghostLabel','gap','note','gaps','arrow','clock','dots'), caption (string override,
 *           false = none), showGhost, observer.
 * state:    { scenario, observer, showGhost, mph, ...scenario numbers }
 */
(function () {
  'use strict';
  const S = window.Sketch, D = window.Diagrams;
  if (!S || !D) return;
  const clamp = S.clamp, lerp = S.lerp;

  /* ---------------- local helpers ---------------- */
  const num = (v, def, lo, hi) => { v = +v; if (!isFinite(v)) v = def; return clamp(v, lo, hi); };
  const str = (v, def) => (v === undefined || v === null || v === '' ? def : String(v));
  const fmt = (v, dp) => String(+(+v).toFixed(dp === undefined ? 1 : dp));
  const rad = (d) => d * Math.PI / 180;
  const deg = (r) => r * 180 / Math.PI;
  const easeIn = (p) => p * p;
  const easeOut = (p) => 1 - (1 - p) * (1 - p);
  const smooth = (p) => p * p * (3 - 2 * p);
  const prog = (u, a, b) => clamp((u - a) / ((b - a) || 1e-6), 0, 1);
  const KP = 3.3; // screen px per second per mph, for balls flying across the field

  const ALIAS = { label: 'labels', speed: 'readout', s: 'readout' };
  const LABELISH = { note: 1, gap: 1, ghostLabel: 1, gaps: 1 };
  function hideSet(p) {
    let h = p && p.hide;
    if (typeof h === 'string') h = [h];
    const out = new Set();
    (Array.isArray(h) ? h : []).forEach((k) => { k = String(k); out.add(k); if (ALIAS[k]) out.add(ALIAS[k]); });
    return out;
  }

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
    pen.poly(g, pts.concat([pts[0]]), { cls: o.cls || 'sk-ink', width: o.width || 2.2, rough: o.rough, single: o.single });
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
  const setT = (n, x, y, rot) => {
    let t = `translate(${x.toFixed(1)} ${y.toFixed(1)})`;
    if (rot) t += ` rotate(${rot.toFixed(1)})`;
    n.setAttribute('transform', t);
  };
  const op = (n, v) => { if (n) n.setAttribute('opacity', clamp(v, 0, 1).toFixed(2)); };
  const show = (n, on) => { if (n) n.setAttribute('display', on ? 'inline' : 'none'); };
  const approach = (cur, tgt, step) => (cur < tgt ? Math.min(tgt, cur + step) : Math.max(tgt, cur - step));
  const setTxt = (node, s) => { if (node && node.textContent !== s) node.textContent = s; };
  const nice = (list, v) => { for (const c of list) if (c >= v) return c; return list[list.length - 1]; };
  const GMAX = [20, 30, 40, 50, 60, 70, 80, 100, 120, 150];

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
  function rangeOf(P, key, def) {
    const r = P.range && typeof P.range === 'object' ? P.range[key] : null;
    if (Array.isArray(r) && r.length >= 2 && isFinite(+r[0]) && isFinite(+r[1]) && +r[1] > +r[0]) {
      return [+r[0], +r[1], +r[2] > 0 ? +r[2] : def[2]];
    }
    return def;
  }

  // greedy word wrap using a rough width estimate for the handwriting font
  function wrapLines(s, maxW, size) {
    const per = Math.max(8, Math.floor(maxW / (size * 0.47)));
    const words = String(s || '').split(/\s+/).filter(Boolean), lines = [];
    let cur = '';
    words.forEach((w) => {
      if (cur && (cur + ' ' + w).length > per) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
    });
    if (cur) lines.push(cur);
    return lines.slice(0, 4);
  }
  function makeCaption(parent, x, y, maxW, size, anchor, cls) {
    const g = S.group(parent, 'caption');
    const nodes = [0, 1, 2, 3].map((i) => S.text(g, x, y + i * (size + 3), '', { size, anchor, cls }));
    let last = null;
    return {
      g,
      set(s) {
        if (s === last) return;
        last = s;
        const lines = wrapLines(s, maxW, size);
        nodes.forEach((n, i) => { n.textContent = lines[i] || ''; });
      },
    };
  }

  // Arrow whose length (and place) change every frame: tail at (x,y), pointing at `ang` degrees.
  function makeArrow(parent, cls, width, head, seed) {
    const r = S.rng(seed || 17);
    const j = [(r() - 0.5) * 3, (r() - 0.5) * 2, (r() - 0.5) * 1.6, (r() - 0.5) * 1.6];
    const g = S.group(parent, 'vel-arrow');
    const path = S.el('path', {
      class: 'sk-line ' + cls, fill: 'none', 'stroke-width': width,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, g);
    let lastLen = -1;
    return {
      g, path,
      set(x, y, ang, len) {
        len = Math.round(len * 2) / 2;
        g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
        if (len === lastLen) return;
        lastLen = len;
        if (len < 3) { path.setAttribute('d', ''); return; }
        const hl = Math.min(head, len * 0.7), c = hl * 0.9, s = hl * 0.44;
        path.setAttribute('d',
          `M0,0 Q${(len / 2).toFixed(1)},${j[0].toFixed(1)} ${len},${j[1].toFixed(1)} ` +
          `M${len},0 L${(len - c).toFixed(1)},${(-s + j[2]).toFixed(1)} ` +
          `M${len},0 L${(len - c).toFixed(1)},${(s + j[3]).toFixed(1)}`);
      },
    };
  }

  // speedometer dial
  function makeGauge(parent, pen, cx, cy, r, max, unit) {
    const g = S.group(parent, 'gauge');
    const A0 = -120, A1 = 120;
    const pt = (ang, rad2) => [cx + rad2 * Math.sin(rad(ang)), cy - rad2 * Math.cos(rad(ang))];
    S.el('circle', { cx, cy, r: r + 8, class: 'sk-fill-card' }, g);
    pen.circle(g, cx, cy, r + 8, { cls: 'sk-ink', width: 2.4 });
    const N = 6;
    for (let i = 0; i <= N; i++) {
      const ang = A0 + (A1 - A0) * i / N, edge = i === 0 || i === N;
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

  function drawMark(parent, pen, ok, x, y) {
    const g = S.group(parent, ok ? 'mark-yes' : 'mark-no');
    if (ok) pen.poly(g, [[x - 10, y + 1], [x - 3, y + 9], [x + 11, y - 11]], { cls: 'sk-good', width: 4.6 });
    else {
      pen.line(g, x - 9, y - 9, x + 9, y + 9, { cls: 'sk-bad', width: 4.6 });
      pen.line(g, x + 9, y - 9, x - 9, y + 9, { cls: 'sk-bad', width: 4.6 });
    }
    return g;
  }
  function ghostify(g) {
    g.querySelectorAll('path.sk-line').forEach((p) => p.setAttribute('stroke-dasharray', '5 4'));
  }

  /* ---------------- baseball: the ball ---------------- */
  function makeBall(parent, r0) {
    const g = S.group(parent, 'ball');
    const sg = S.group(g, 'ball-s');
    const spin = S.group(sg, 'ball-spin');
    S.el('circle', { cx: 0, cy: 0, r: 10, class: 'sk-fill-card' }, spin);
    const common = { fill: 'none', 'stroke-linecap': 'round' };
    const ring = S.el('circle', Object.assign({ cx: 0, cy: 0, r: 10, class: 'sk-line sk-ink' }, common), spin);
    const s1 = S.el('path', Object.assign({ d: 'M-5.6,-8.3 Q-0.4,0 -5.6,8.3', class: 'sk-line sk-bad' }, common), spin);
    const s2 = S.el('path', Object.assign({ d: 'M5.6,-8.3 Q0.4,0 5.6,8.3', class: 'sk-line sk-bad' }, common), spin);
    let last = 0;
    const api = {
      g,
      setR(r) {
        r = Math.max(2, r);
        if (Math.abs(r - last) < 0.05) return;
        last = r;
        const k = r / 10;
        sg.setAttribute('transform', `scale(${k.toFixed(3)})`);
        ring.setAttribute('stroke-width', (2.4 / k).toFixed(2));
        const w = r < 5 ? 1.2 : 2.1;
        [s1, s2].forEach((p) => {
          p.setAttribute('stroke-width', (w / k).toFixed(2));
          p.setAttribute('stroke-dasharray', `${(2.4 / k).toFixed(2)} ${(2.1 / k).toFixed(2)}`);
        });
      },
      pos(x, y, spinDeg) {
        g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        if (spinDeg !== undefined) spin.setAttribute('transform', `rotate(${(spinDeg % 360).toFixed(0)})`);
      },
    };
    api.setR(r0 || 8);
    return api;
  }
  function makeDot(parent, pen, r, cls) {
    const g = S.group(parent, 'dot');
    pen.circle(g, 0, 0, r, { fill: 'solid', fillCls: 'sk-fill-hl', cls: cls || 'sk-accent', width: 2.2, single: true });
    return g;
  }

  /* ---------------- baseball: stick figures ----------------
   * Local units: ~72 tall, feet at y = 0, facing +x. Angles are degrees from straight down, forward positive.
   */
  function makeLimb(parent, cls, width, seed) {
    const r = S.rng(seed);
    const jit = [];
    for (let i = 0; i < 16; i++) jit.push((r() - 0.5) * 1.5);
    const path = S.el('path', {
      class: 'sk-line ' + cls, fill: 'none', 'stroke-width': width,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, parent);
    return {
      path,
      set(pts) {
        let d = '';
        for (let k = 0; k < 2; k++) {
          pts.forEach((p, i) => {
            const a = jit[(i * 2 + k * 5) % 16] * (k ? 1 : 0.5), b = jit[(i * 2 + 1 + k * 3) % 16] * (k ? 1 : 0.5);
            d += (i ? 'L' : 'M') + (p[0] + a).toFixed(1) + ',' + (p[1] + b).toFixed(1) + ' ';
          });
        }
        path.setAttribute('d', d);
      },
    };
  }
  function ik(sx, sy, tx, ty, l1, l2, bend) {
    let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy) || 0.001;
    d = clamp(d, Math.abs(l1 - l2) + 0.05, l1 + l2 - 0.05);
    const base = Math.atan2(dy, dx);
    const A = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
    const ang = base + bend * A;
    return [[sx, sy], [sx + l1 * Math.cos(ang), sy + l1 * Math.sin(ang)], [sx + d * Math.cos(base), sy + d * Math.sin(base)]];
  }

  function makeFigure(parent, pen, o) {
    o = o || {};
    const sc = o.sc || 1, facing = o.facing === -1 ? -1 : 1, seed = o.seed || 11;
    const w = (v) => v / sc;
    const L1 = 17, L2 = 16, A1 = 12, A2 = 12, TORSO = 21;
    const root = S.group(parent, 'fig');
    const flip = S.group(root, 'fig-flip');
    flip.setAttribute('transform', `scale(${(facing * sc).toFixed(3)} ${sc.toFixed(3)})`);
    const LW = w(o.lw || 3.2);
    const armB = makeLimb(flip, 'sk-ink', LW, seed + 1);
    const handB = S.el('circle', { r: 2.4, class: 'sk-fill-ink' }, flip);
    const legB = makeLimb(flip, 'sk-ink', LW, seed + 2);
    let glove = null;
    if (o.glove) {
      glove = S.group(flip, 'glove');
      S.el('circle', { cx: 2, cy: 0, r: 6.2, class: 'sk-fill-card' }, glove);
      S.el('circle', { cx: 2, cy: 0, r: 6.2, class: 'sk-fill-hl' }, glove);
      pen.circle(glove, 2, 0, 6.2, { cls: 'sk-ink', width: w(2.2), single: true });
      pen.curve(glove, [[-1, -3], [3, 0], [-1, 3]], { cls: 'sk-ink', width: w(1.6), single: true, rough: 0.2 });
    }
    const upper = S.group(flip, 'upper');
    shape(upper, pen, [[-6.5, -TORSO], [6.5, -TORSO], [5.5, 0], [-5.5, 0]],
      { fillCls: 'sk-fill-card', tintCls: o.jersey || 'sk-fill-accent', width: w(2.2), rough: 0.5 });
    const head = S.group(upper, 'head');
    head.setAttribute('transform', `translate(0 ${-TORSO - 10})`);
    pen.circle(head, 0, 0, 8, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: w(2.2), single: true });
    S.el('circle', { cx: 3.7, cy: 0.8, r: 1.3, class: 'sk-fill-ink' }, head);
    const bk = o.capBack ? -1 : 1;
    shape(head, pen, [[-8.6, -2], [-7.6, -8], [-3, -11.4], [3, -11.4], [7.6, -8], [8.6, -2]],
      { fillCls: 'sk-fill-card', tintCls: o.cap || 'sk-fill-accent', width: w(2.2), rough: 0.4, single: true });
    pen.line(head, bk * 5, -3.4, bk * 15, -1.6, { cls: 'sk-ink', width: w(3.4), single: true, rough: 0.3 });
    if (o.mask) {
      pen.line(head, 4, 0.5, 11.5, 0.5, { cls: 'sk-ink', width: w(1.7), single: true, rough: 0.2 });
      pen.line(head, 4, 4.5, 11.5, 4.5, { cls: 'sk-ink', width: w(1.7), single: true, rough: 0.2 });
      pen.line(head, 11.5, -1, 11.5, 6, { cls: 'sk-ink', width: w(1.7), single: true, rough: 0.2 });
    }
    const legF = makeLimb(flip, 'sk-ink', LW, seed + 3);
    const armF = makeLimb(flip, 'sk-ink', LW, seed + 4);
    const handF = S.el('circle', { r: 2.4, class: 'sk-fill-ink' }, flip);

    let ox = 0, oy = 0;
    const fig = {
      g: root, flip, upper, sc, facing, hands: { F: [0, 0], B: [0, 0] }, sh: [0, 0], hip: [0, 0],
      place(x, y) { ox = x; oy = y; setT(root, x, y); },
      world(lx, ly) { return [ox + facing * sc * lx, oy + sc * ly]; },
      toLocal(wx, wy) { return [(wx - ox) / (facing * sc), (wy - oy) / sc]; },
      pose(p) {
        p = p || {};
        const leg = (a) => (a ? L1 * Math.cos(rad(a[0])) + L2 * Math.cos(rad(a[1])) : 33);
        const lF = p.legF || [0, 0], lB = p.legB || [0, 0];
        const hipY = p.hipY !== undefined ? p.hipY : -Math.max(leg(lF), leg(lB));
        const lean = p.lean || 0;
        const hip = [0, hipY];
        upper.setAttribute('transform', `translate(0 ${hipY.toFixed(2)}) rotate(${lean.toFixed(1)})`);
        const P2 = (pt, l, a) => [pt[0] + l * Math.sin(rad(a)), pt[1] + l * Math.cos(rad(a))];
        const doLeg = (limb, a) => {
          const k = P2(hip, L1, a[0]), f = P2(k, L2, a[1]);
          limb.set([hip, k, f, [f[0] + 5.5, f[1]]]);
        };
        doLeg(legB, lB); doLeg(legF, lF);
        const sh = [(TORSO - 2) * Math.sin(rad(lean)), hipY - (TORSO - 2) * Math.cos(rad(lean))];
        fig.sh = sh; fig.hip = hip;
        const doArm = (limb, spec, dot, key) => {
          spec = spec || [0, 0];
          let pts;
          if (Array.isArray(spec)) { const e = P2(sh, A1, spec[0]); pts = [sh, e, P2(e, A2, spec[1])]; }
          else pts = ik(sh[0], sh[1], spec.to[0], spec.to[1], A1, A2, spec.bend === undefined ? 1 : spec.bend);
          limb.set(pts);
          const h = pts[2];
          dot.setAttribute('cx', h[0].toFixed(1)); dot.setAttribute('cy', h[1].toFixed(1));
          fig.hands[key] = h;
        };
        doArm(armB, p.armB, handB, 'B');
        doArm(armF, p.armF, handF, 'F');
        if (glove) {
          const h = fig.hands.B;
          glove.setAttribute('transform', `translate(${h[0].toFixed(1)} ${h[1].toFixed(1)})`);
          handB.setAttribute('display', 'none');
        }
        return fig;
      },
    };
    fig.pose({});
    return fig;
  }

  // run cycle: ph in radians
  function runPose(fig, ph, lean, amp) {
    amp = amp || 1;
    const leg = (t) => {
      const th = 44 * amp * Math.sin(t) + 4, flex = 18 + 54 * Math.max(0, Math.cos(t)) * amp;
      return [th, th - flex];
    };
    const arm = (t) => { const a = -40 * amp * Math.sin(t); return [a, a + 78]; };
    fig.pose({ legF: leg(ph), legB: leg(ph + Math.PI), armF: arm(ph + Math.PI), armB: arm(ph), lean: lean === undefined ? 12 : lean });
  }
  const STAND = { legF: [6, 2], legB: [-6, -2], armF: [8, 20], armB: [-8, 10] };

  /* pitcher: tau = seconds relative to release; W = whip duration; opt.phi overrides the arm angle */
  function pitcherPose(fig, tau, W, opt) {
    opt = opt || {};
    const pre = clamp((tau + W + 0.6) / 0.6, 0, 1), p = clamp((tau + W) / W, 0, 1), post = clamp(tau / 0.55, 0, 1);
    const e = smooth(pre), ps = smooth(p);
    let phi;
    if (tau <= 0) phi = pre < 1 ? lerp(70, 118, e) : lerp(118, 300, easeIn(p));
    else phi = lerp(300, 392, easeOut(post));
    if (opt.phi !== undefined) phi = opt.phi;
    if (opt.frozen) { tau = 0; }
    const pp = opt.frozen ? 1 : ps, ee = opt.frozen ? 1 : e;
    const front = [lerp(0, 70, ee) - 25 * pp, 30 * pp];
    const back0 = [-45 * pp, -35 * pp];
    const back = tau > 0 ? [-45 - 20 * post, -35 - 70 * post] : back0;
    const lean = opt.frozen ? 26 : (tau > 0 ? lerp(26, 36, post) : 26 * easeIn(p));
    const a = 90 - phi; // arm angle from straight down
    const tgtG = tau > 0 ? [11, -34] : [lerp(10, 17, ee) - 3 * pp, -40];
    fig.pose({
      legF: front, legB: back, lean, armF: [a, a],
      armB: opt.frozen ? { to: [14, -36], bend: 1 } : { to: tgtG, bend: 1 },
    });
    return phi;
  }

  /* ---------------- baseball: scenery ---------------- */
  function groundLine(g, pen, y, x1, x2) {
    S.el('rect', { x: x1, y: y + 1, width: x2 - x1, height: 13, class: 'sk-fill-good' }, g);
    pen.line(g, x1, y, x2, y, { cls: 'sk-ink', width: 3 });
    for (let i = 0, x = x1 + 26; x < x2 - 12; i++, x += 41 + (i * 7) % 23) {
      pen.line(g, x, y - 1, x - 4, y - 9, { cls: 'sk-good', width: 2, single: true });
      pen.line(g, x, y - 1, x + 0.5, y - 11, { cls: 'sk-good', width: 2, single: true });
      pen.line(g, x, y - 1, x + 4.5, y - 8, { cls: 'sk-good', width: 2, single: true });
    }
  }
  function mound(g, pen, cx, gy, topY, hw) {
    const h = gy - topY;
    const pts = [[cx - hw, gy], [cx - hw * 0.58, gy - h * 0.62], [cx - hw * 0.22, topY + 2], [cx + hw * 0.22, topY + 2], [cx + hw * 0.62, gy - h * 0.55], [cx + hw, gy]];
    S.el('path', { d: catmull(pts) + ` L${cx - hw},${gy} Z`, class: 'sk-fill-hl' }, g);
    pen.curve(g, pts, { cls: 'sk-ink', width: 2.6 });
    pen.rect(g, cx - 12, topY - 3, 24, 4, { cls: 'sk-ink', width: 2, fill: 'solid', fillCls: 'sk-fill-card', single: true });
  }
  function plate(g, pen, x, gy) {
    shape(g, pen, [[x - 19, gy - 3], [x + 19, gy - 3], [x + 19, gy + 3], [x, gy + 9], [x - 19, gy + 3]],
      { fillCls: 'sk-fill-card', width: 2.4, rough: 0.5 });
  }
  function backstop(g, pen, x, gy, h) {
    const pts = [[x, gy], [x, gy - h], [x + 14, gy - h], [x + 14, gy]];
    S.fillArea(g, pts, { gap: 8, hachureCls: 'sk-soft', hachureWidth: 1.6 });
    pen.poly(g, pts, { cls: 'sk-ink', width: 3 });
    pen.line(g, x, gy - h * 0.5, x + 14, gy - h * 0.5, { cls: 'sk-soft', width: 1.6, single: true });
  }
  function mitt(g, pen, rr) {
    const m = S.group(g, 'mitt');
    S.el('circle', { cx: 0, cy: 0, r: rr, class: 'sk-fill-card' }, m);
    S.el('circle', { cx: 0, cy: 0, r: rr, class: 'sk-fill-hl' }, m);
    pen.circle(m, 0, 0, rr, { cls: 'sk-ink', width: 2.8 });
    pen.curve(m, [[-rr * 0.55, -rr * 0.55], [-rr * 0.1, -rr * 0.15], [-rr * 0.1, rr * 0.2], [-rr * 0.55, rr * 0.55]], { cls: 'sk-ink', width: 2, single: true, rough: 0.3 });
    return m;
  }

  /* =====================================================================
   *  Scenes. Each is built with a context `c`:
   *   c.gP (art group)  c.pen  c.cfg (live)  c.fade(key,node)  c.hid(key)  c.setH(h)  c.captionText(def)
   *  and returns { cycle(), endU, draw(u, dt), state() }.
   * ===================================================================== */
  const SCENES = {};

  // "label ->  label" with a hand-drawn arrow between two texts
  function arrowLabel(c, parent, cx, y, a, b, cls, size) {
    const g = S.group(parent, 'arrow-label');
    S.text(g, cx - 28, y, a, { anchor: 'end', size, cls });
    c.pen.arrow(g, cx - 21, y - size * 0.3, cx + 21, y - size * 0.3, { cls: 'sk-accent', width: 3.4, head: 10 });
    S.text(g, cx + 28, y, b, { anchor: 'start', size, cls });
    return g;
  }
  // a little burst of lines (impact)
  function burst(parent, pen, rad0, rad1, n, cls) {
    const g = S.group(parent, 'burst');
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.3;
      pen.line(g, Math.cos(a) * rad0, Math.sin(a) * rad0, Math.cos(a) * rad1, Math.sin(a) * rad1, { cls: cls || 'sk-bad', width: 3, single: true, rough: 0.3 });
    }
    return g;
  }

  /* ---------------------------------------------------------------- pitch */
  SCENES.pitch = function (c) {
    const gP = c.gP, pen = c.pen, W = 0.7, TREL = W + 0.6, HOLD = 1.8;
    const G = 244, MT = 228;
    c.setH(356);
    groundLine(gP, pen, G, 14, 586);
    mound(gP, pen, 80, G, MT, 66);
    plate(gP, pen, 516, G);
    const lab = S.group(gP, 'labels');
    S.text(lab, 74, 278, "pitcher's mound", { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
    S.text(lab, 516, 278, 'home plate', { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
    S.text(lab, 586, 348, 'slow motion', { anchor: 'end', size: 18, cls: 'sk-text-soft' });
    c.fade('labels', lab);

    const cat = makeFigure(gP, pen, { sc: 1.45, facing: -1, jersey: 'sk-fill-accent', cap: 'sk-fill-accent', capBack: true, mask: true, seed: 31 });
    cat.place(558, G);
    const M = [522, 201];
    cat.pose({ legF: [80, 5], legB: [85, 8], lean: 10, armF: { to: cat.toLocal(M[0], M[1]), bend: 1 }, armB: [30, 20] });
    const fig = makeFigure(gP, pen, { sc: 1.7, facing: 1, jersey: 'sk-fill-accent', cap: 'sk-fill-accent', glove: true, seed: 21 });
    fig.place(80, MT);
    pitcherPose(fig, 0, W, { frozen: true });
    const R = fig.world(fig.hands.F[0], fig.hands.F[1]);
    const mg = S.group(gP, 'catch-mitt');
    mitt(mg, pen, 14);
    setT(mg, M[0] - 3, M[1]);

    // ruler under the field (position)
    const dist = c.cfg.distanceFt, RY = 296, x0 = R[0], x1 = M[0];
    const ruler = S.group(gP, 'ruler');
    pen.line(ruler, x0, RY, x1, RY, { cls: 'sk-ink', width: 2.6 });
    const step = dist <= 30 ? 5 : dist <= 60 ? 10 : 20;
    for (let v = 0; v <= dist + 1e-6; v += step) {
      const x = x0 + (x1 - x0) * v / dist;
      pen.line(ruler, x, RY - 6, x, RY + 6, { cls: 'sk-ink', width: 2.2, single: true, rough: 0.3 });
      if (x1 - x > 34) S.text(ruler, x, RY + 28, fmt(v, 0), { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
    }
    pen.line(ruler, x1, RY - 8, x1, RY + 8, { cls: 'sk-ink', width: 2.6, single: true, rough: 0.3 });
    S.text(ruler, x1, RY + 28, `${fmt(dist, 0)} ft`, { anchor: 'middle', size: 20, cls: 'sk-text' });
    const guide = S.el('line', { x1: 0, y1: 0, x2: 0, y2: 0, class: 'sk-soft', 'stroke-width': 1.8, 'stroke-dasharray': '3 6', 'stroke-linecap': 'round' }, gP);
    const mk = S.group(gP, 'marker');
    const mball = makeBall(mk, 8); mball.pos(0, 0, 0);
    const posT = S.text(gP, (x0 + x1) / 2, 350, '', { anchor: 'middle', size: 26, cls: 'sk-text-accent' });

    // radar gun
    const RX = 400, RYY = 12, RW = 188, RH = 104;
    const rg = S.group(gP, 'radar');
    shape(rg, pen, [[RX, RYY + 30], [RX - 30, RYY + 10], [RX - 30, RYY + RH - 18], [RX, RYY + RH - 34]], { fillCls: 'sk-fill-card', tintCls: 'sk-fill-accent', width: 2.4 });
    pen.line(rg, RX - 30, RYY + 10, RX - 30, RYY + RH - 18, { cls: 'sk-ink', width: 3.6, single: true });
    shape(rg, pen, [[RX + RW * 0.55, RYY + RH], [RX + RW * 0.55 + 26, RYY + RH], [RX + RW * 0.55 + 22, RYY + RH + 22], [RX + RW * 0.55 + 4, RYY + RH + 22]], { fillCls: 'sk-fill-card', tintCls: 'sk-fill-accent', width: 2.4 });
    pen.rect(rg, RX, RYY, RW, RH, { cls: 'sk-ink', width: 2.8, fill: 'solid', fillCls: 'sk-fill-card' });
    S.text(rg, RX + RW / 2, RYY + 25, 'radar gun', { anchor: 'middle', size: 19, cls: 'sk-text-soft' });
    const spdT = S.text(rg, RX + RW / 2, RYY + 66, '', { anchor: 'middle', size: 40, cls: 'sk-text-accent' });
    const dirT = S.text(rg, RX + RW / 2, RYY + 94, '', { anchor: 'middle', size: 21, cls: 'sk-text' });

    const cap = makeCaption(gP, 14, 28, 350, 22, 'start', 'sk-text');
    c.fade('caption', cap.g);
    const ball = makeBall(gP, 8);
    const arrow = makeArrow(gP, 'sk-accent', 4.4, 14, 5);
    c.fade('arrow', arrow.g);

    const dx = M[0] - R[0], dy = M[1] - R[1], flen = Math.hypot(dx, dy), ang = deg(Math.atan2(dy, dx));
    const Tof = () => flen / (KP * c.cfg.mph);
    return {
      cycle: () => TREL + Tof() + HOLD,
      endU: () => TREL + Tof() * 0.62,
      draw(u) {
        const cfg = c.cfg, mph = cfg.mph, T = Tof(), tau = u - TREL;
        pitcherPose(fig, tau, W);
        let bx, by, f = 0;
        if (tau < 0) { const h = fig.world(fig.hands.F[0], fig.hands.F[1]); bx = h[0]; by = h[1]; }
        else { f = clamp(tau / T, 0, 1); bx = R[0] + dx * f; by = R[1] + dy * f; }
        ball.pos(bx, by, tau > 0 && f < 1 ? tau * 900 : (tau > 0 ? 0 : 0));
        const flying = tau >= 0 && f < 1;
        const alen = clamp(mph * 1.05, 24, 96), ca = Math.cos(rad(ang)), sa = Math.sin(rad(ang));
        if (flying) arrow.set(bx - ca * alen / 2, by - 24 - sa * alen / 2, ang, alen); else arrow.set(0, 0, 0, 0);
        const ft = tau < 0 ? 0 : f * cfg.distanceFt;
        const mx = x0 + (x1 - x0) * (tau < 0 ? 0 : f);
        setT(mk, mx, RY);
        if (tau >= 0 && f < 1) { show(guide, true); guide.setAttribute('x1', bx.toFixed(1)); guide.setAttribute('y1', (by + 11).toFixed(1)); guide.setAttribute('x2', mx.toFixed(1)); guide.setAttribute('y2', (RY - 13).toFixed(1)); } else show(guide, false);
        setTxt(posT, `position: ${c.hid('position') ? '?' : fmt(ft, 0)} ft`);
        const released = tau >= 0;
        setTxt(spdT, released ? `${c.hid('readout') ? '?' : fmt(mph, 0)} mph` : '-- mph');
        setTxt(dirT, released ? (c.hid('direction') ? 'direction: ?' : 'toward home plate') : '');
        cap.set(c.captionText('A pitch: mound to home plate'));
      },
      state: () => ({ speed: c.cfg.mph, direction: 'toward home plate', distanceFt: c.cfg.distanceFt }),
    };
  };

  /* --------------------------------------------------------------- windup */
  SCENES.windup = function (c) {
    const gP = c.gP, pen = c.pen, PRE = 0.9, HOLD = 3.0, KW = 5.5;
    const G = 312, SC = 2.7, PHI0 = 118, PHI1 = 300;
    c.setH(356);
    groundLine(gP, pen, G, 14, 586);
    const fig = makeFigure(gP, pen, { sc: SC, facing: 1, jersey: 'sk-fill-accent', cap: 'sk-fill-accent', glove: true, seed: 41, lw: 3.8 });
    fig.place(150, G);
    pitcherPose(fig, 0, 1, { frozen: true, phi: PHI0 });
    const S0 = fig.world(fig.sh[0], fig.sh[1]), LA = 24 * SC, ARC = LA * rad(PHI1 - PHI0);
    const hand = (phi) => [S0[0] + LA * Math.cos(rad(phi)), S0[1] + LA * Math.sin(rad(phi))];

    // strobe dots + faint arc
    const arcPts = []; for (let i = 0; i <= 24; i++) arcPts.push(hand(PHI0 + (PHI1 - PHI0) * i / 24));
    const arcG = S.group(gP, 'arc');
    const arcLine = pen.curve(arcG, arcPts, { cls: 'sk-soft', width: 1.8, single: true, rough: 0.2 });
    arcLine.setAttribute('stroke-dasharray', '2 7');
    const dotsG = S.group(gP, 'strobe');
    const dots = [];
    for (let i = 0; i <= 8; i++) { const d = makeDot(dotsG, pen, 5, 'sk-accent'); dots.push(d); }
    c.fade('dots', dotsG);
    const tagG = S.group(gP, 'gaps');
    const tag1 = S.text(tagG, 0, 0, 'small gaps', { anchor: 'middle', size: 19, cls: 'sk-text-soft' });
    const tag2 = S.text(tagG, 0, 0, 'big gaps', { anchor: 'middle', size: 19, cls: 'sk-text-soft' });
    c.fade('gaps', tagG);

    // speed readout
    const gmax = nice(GMAX, c.cfg.mph * 1.25);
    S.text(gP, 468, 34, 'ball speed', { anchor: 'middle', size: 19, cls: 'sk-text-soft' });
    const gauge = makeGauge(gP, pen, 468, 112, 52, gmax, 'mph');
    const spdT = S.text(gP, 468, 222, '', { anchor: 'middle', size: 44, cls: 'sk-text-accent' });
    const lab = S.group(gP, 'label');
    arrowLabel(c, lab, 292, 346, 'speed increases', 'positive acceleration', 'sk-text', 22);
    c.fade('labels', lab);
    const cap = makeCaption(gP, 14, 28, 330, 22, 'start', 'sk-text');
    c.fade('caption', cap.g);
    const ball = makeBall(gP, 10);
    const arrow = makeArrow(gP, 'sk-accent', 4.4, 14, 9);
    c.fade('arrow', arrow.g);

    const Tarm = () => 2 * ARC / (KW * c.cfg.mph);
    return {
      cycle: () => PRE + Tarm() + HOLD,
      endU: () => PRE + Tarm() + 0.3,
      draw(u) {
        const mph = c.cfg.mph, T = Tarm(), t = u - PRE, tc = clamp(t, 0, T);
        const phi = PHI0 + (PHI1 - PHI0) * Math.pow(tc / T, 2);
        pitcherPose(fig, 0, 1, { frozen: true, phi });
        const h = hand(phi), v = mph * tc / T;
        let bx = h[0], by = h[1], dirA = phi + 90, fade = 1;
        if (t > T) {
          const dd = t - T, vp = KW * mph;
          bx += Math.cos(rad(dirA)) * vp * Math.min(dd, 0.6); by += Math.sin(rad(dirA)) * vp * Math.min(dd, 0.6);
          fade = 1 - prog(dd, 0.35, 0.8);
        }
        ball.pos(bx, by, t * 600); op(ball.g, fade);
        const alen = v / mph * 62 + (t > T ? 0 : 0);
        const cr = Math.cos(rad(dirA)), sr = Math.sin(rad(dirA));
        arrow.set(bx + cr * 15, by + sr * 15, dirA, alen); op(arrow.g, fade);
        dots.forEach((d, i) => {
          const ti = T * i / 8, on = t >= ti - 1e-9 && t >= 0;
          show(d, on);
          if (on) { const p = hand(PHI0 + (PHI1 - PHI0) * Math.pow(i / 8, 2)); setT(d, p[0], p[1]); }
        });
        const p1 = hand(PHI0 + (PHI1 - PHI0) * Math.pow(0.5 / 8, 2)), p2 = hand(PHI0 + (PHI1 - PHI0) * Math.pow(7.5 / 8, 2));
        tag1.setAttribute('transform', `translate(${(p1[0] - 78).toFixed(1)} ${(p1[1] - 6).toFixed(1)})`);
        tag2.setAttribute('transform', `translate(${(p2[0] + 56).toFixed(1)} ${(p2[1] - 40).toFixed(1)})`);
        show(tagG, t >= T * 0.9);
        setTxt(spdT, c.hid('readout') ? '? mph' : `${fmt(v, 0)} mph`);
        gauge.set(v);
        cap.set(c.captionText(''));
      },
      state: () => ({ accel: 'positive', speedStart: 0, speedEnd: c.cfg.mph }),
    };
  };

  /* ---------------------------------------------------------------- catch */
  SCENES.catch = function (c) {
    const gP = c.gP, pen = c.pen, PRE = 0.7, HOLD = 3.4, KC = 3.0;
    const G = 316, SC = 2.4, BY = 230, MC0 = [432, BY], XC = MC0[0] - 20, D = 56, RECOIL = 40, X_START = 40;
    c.setH(356);
    groundLine(gP, pen, G, 14, 586);
    const cat = makeFigure(gP, pen, { sc: SC, facing: -1, jersey: 'sk-fill-accent', cap: 'sk-fill-accent', capBack: true, mask: true, seed: 51, lw: 3.8 });
    cat.place(498, G);
    const mg = S.group(gP, 'mitt-g');
    mitt(mg, pen, 29);
    const base = { legF: [80, 5], legB: [85, 8], lean: 10, armB: [30, 20] };

    // tape under the path with strobe dots
    const TY = BY + 25;
    const tape = pen.line(gP, XC - 16, TY, XC + D + 16, TY, { cls: 'sk-soft', width: 1.8, single: true });
    tape.setAttribute('stroke-dasharray', '2 7');
    const dotsG = S.group(gP, 'strobe');
    const dots = [];
    for (let i = 0; i <= 8; i++) dots.push(makeDot(dotsG, pen, 4, 'sk-accent'));
    c.fade('dots', dotsG);
    const tagG = S.group(gP, 'gaps');
    S.text(tagG, XC - 10, BY - 62, 'gaps get smaller', { anchor: 'middle', size: 20, cls: 'sk-text-bad' });
    c.fade('gaps', tagG);
    const burstG = burst(gP, pen, 22, 40, 7, 'sk-bad');

    const gmax = nice(GMAX, c.cfg.mph * 1.25);
    S.text(gP, 232, 34, 'ball speed', { anchor: 'middle', size: 19, cls: 'sk-text-soft' });
    const gauge = makeGauge(gP, pen, 100, 100, 52, gmax, 'mph');
    const spdT = S.text(gP, 232, 114, '', { anchor: 'middle', size: 44, cls: 'sk-text-accent' });
    const lab = S.group(gP, 'label');
    arrowLabel(c, lab, 292, 348, 'speed decreases', 'negative acceleration', 'sk-text', 22);
    c.fade('labels', lab);
    const cap = makeCaption(gP, 586, 28, 270, 22, 'end', 'sk-text');
    c.fade('caption', cap.g);
    const streaks = [-9, 0, 9].map((dy, i) => S.el('line', { x1: 0, y1: 0, x2: 0, y2: 0, class: 'sk-soft', 'stroke-width': 3, 'stroke-linecap': 'round', 'data-dy': dy }, gP));
    const stG = S.group(gP, 'streaks'); streaks.forEach((s) => stG.appendChild(s)); c.fade('arrow', stG);
    const ball = makeBall(gP, 12);
    const arrow = makeArrow(gP, 'sk-accent', 4.6, 15, 3);
    c.fade('arrow', arrow.g);
    const zl = S.group(gP, 'zoomlab');
    S.text(zl, 586, 112, 'zoomed in on the catch', { anchor: 'end', size: 18, cls: 'sk-text-soft' });
    c.fade('labels', zl);

    const V = () => KC * c.cfg.mph;
    const Tapp = () => (XC - X_START) / V();
    const Tpk = () => 2 * D / V();
    const sOf = (t) => { const T = Tpk(), v = V(), q = clamp(t / T, 0, 1); return v * T * (q - q * q / 2); };
    return {
      cycle: () => PRE + Tapp() + Tpk() + HOLD,
      endU: () => PRE + Tapp() + Tpk() + 0.4,
      draw(u) {
        const mph = c.cfg.mph, Ta = Tapp(), Tp = Tpk(), v0 = V(), t = u - PRE;
        let bx, v;
        if (t < Ta) { bx = X_START + v0 * Math.max(t, 0); v = mph; }
        else { const tp = clamp(t - Ta, 0, Tp); bx = XC + sOf(tp); v = mph * (1 - tp / Tp); }
        const rec = RECOIL * clamp((bx - XC) / D, 0, 1);
        cat.pose(Object.assign({ armF: { to: cat.toLocal(MC0[0] + rec, MC0[1]), bend: 1 } }, base));
        setT(mg, MC0[0] + rec - 3, MC0[1]);
        ball.pos(bx, BY, (bx - X_START) * 3);
        const alen = v / mph * 70;
        arrow.set(bx - alen / 2, BY - 38, 0, alen);
        const sl = v / mph * 64;
        streaks.forEach((s) => {
          const dy = +s.getAttribute('data-dy');
          s.setAttribute('x1', (bx - 20 - sl * (dy ? 0.8 : 1)).toFixed(1)); s.setAttribute('x2', (bx - 18).toFixed(1));
          s.setAttribute('y1', (BY + dy).toFixed(1)); s.setAttribute('y2', (BY + dy).toFixed(1));
          s.setAttribute('opacity', sl < 3 || t < 0 ? '0' : '0.7');
        });
        dots.forEach((d, i) => {
          const ti = Ta + Tp * i / 8, on = t >= ti - 1e-9;
          show(d, on);
          if (on) setT(d, XC + sOf(Tp * i / 8), TY);
        });
        show(burstG, t >= Ta && t < Ta + 0.5);
        if (t >= Ta && t < Ta + 0.5) setT(burstG, XC - 4, BY - 2);
        op(burstG, 1 - prog(t, Ta, Ta + 0.5));
        show(tagG, t >= Ta + Tp * 0.7);
        setTxt(spdT, c.hid('readout') ? '? mph' : `${fmt(Math.max(0, v), 0)} mph`);
        gauge.set(Math.max(0, v));
        cap.set(c.captionText(''));
      },
      state: () => ({ accel: 'negative', speedStart: c.cfg.mph, speedEnd: 0 }),
    };
  };

  /* ------------------------------------------------------------------ hit */
  SCENES.hit = function (c) {
    const gP = c.gP, pen = c.pen, W = 0.7, TREL = W + 0.6, HOLD = 2.8;
    const G = 246, MT = 230, BSX = 568;
    c.setH(352);
    groundLine(gP, pen, G, 14, 586);
    mound(gP, pen, 66, G, MT, 58);
    plate(gP, pen, 446, G);
    backstop(gP, pen, BSX, G, 136);
    const lab = S.group(gP, 'labels');
    S.text(lab, BSX + 7, G - 144, 'backstop', { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
    c.fade('labels', lab);

    const bat = makeFigure(gP, pen, { sc: 1.5, facing: -1, jersey: 'sk-fill-bad', cap: 'sk-fill-bad', seed: 61 });
    bat.place(486, G);
    const HND = [13, -40], BLEN = 38;
    const stance = { legF: [18, 5], legB: [-18, -8] };
    const batFill = S.el('path', { class: 'sk-fill-hl' }, bat.flip);
    const batLine = S.el('path', { class: 'sk-line sk-ink', fill: 'none', 'stroke-width': 2.2 / 1.5, 'stroke-linejoin': 'round' }, bat.flip);
    function setBat(phi) {
      const a = rad(phi), ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
      const P = (s, w) => [HND[0] + ux * s + nx * w, HND[1] + uy * s + ny * w];
      const pts = [P(-3, -0.9), P(6, -0.9), P(BLEN - 8, -1.6), P(BLEN, -2.6), P(BLEN, 2.6), P(BLEN - 8, 1.6), P(6, 0.9), P(-3, 0.9)];
      const d = 'M' + pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + ' Z';
      batFill.setAttribute('d', d); batLine.setAttribute('d', d);
    }
    bat.pose(Object.assign({ lean: 8, armF: { to: HND, bend: 1 }, armB: { to: [HND[0] - 1, HND[1] + 1], bend: 1 } }, stance));
    const Cpt = bat.world(HND[0] + 31, HND[1]);

    const fig = makeFigure(gP, pen, { sc: 1.5, facing: 1, jersey: 'sk-fill-accent', cap: 'sk-fill-accent', glove: true, seed: 71 });
    fig.place(66, MT);
    pitcherPose(fig, 0, W, { frozen: true });
    const R = fig.world(fig.hands.F[0], fig.hands.F[1]);
    const dx = Cpt[0] - R[0], dy = Cpt[1] - R[1], len1 = Math.hypot(dx, dy), ux = dx / len1, uy = dy / len1;
    const ang = deg(Math.atan2(dy, dx));
    const len2 = len1 * 0.8;
    const gEndS = (BSX - 12 - Cpt[0]) / ux;     // how far the ghost can go before the backstop

    const gapLine = S.el('line', { x1: 0, y1: 0, x2: 0, y2: 0, class: 'sk-bad', 'stroke-width': 3.4, 'stroke-dasharray': '8 7', 'stroke-linecap': 'round' }, gP);
    const ghostG = S.group(gP, 'ghost');
    const gball = makeBall(ghostG, 10);
    S.el('circle', { cx: 0, cy: 0, r: 15, class: 'sk-soft', fill: 'none', 'stroke-width': 2.2, 'stroke-dasharray': '4 5' }, gball.g);
    const garrow = makeArrow(ghostG, 'sk-accent', 4, 13, 6);
    garrow.path.setAttribute('stroke-dasharray', '6 5');
    const glabG = S.group(gP, 'glab');
    S.text(glabG, 0, 0, 'ghost ball', { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
    c.fade('ghostLabel', glabG);
    const gapG = S.group(gP, 'gap');
    const gapIn = S.group(gapG, 'gap-in');
    S.text(gapIn, 0, 0, 'this gap shows the', { anchor: 'middle', size: 21, cls: 'sk-text-bad' });
    S.text(gapIn, 0, 24, 'velocity changed', { anchor: 'middle', size: 21, cls: 'sk-text-bad' });
    c.fade('gap', gapG);
    const flash = burst(gP, pen, 14, 30, 8, 'sk-bad');
    setT(flash, Cpt[0], Cpt[1]);

    const ball = makeBall(gP, 8);
    const arrow = makeArrow(gP, 'sk-accent', 4.4, 14, 5);
    c.fade('arrow', arrow.g);

    // two radar cards
    const CY0 = 276, CH = 68;
    const mkCard = (x, title, arrowDir) => {
      const g = S.group(gP, 'card');
      pen.rect(g, x, CY0, 290, CH, { cls: 'sk-ink', width: 2.4, fill: 'solid', fillCls: 'sk-fill-card' });
      S.text(g, x + 14, CY0 + 23, title, { size: 19, cls: 'sk-text-soft' });
      const spd = S.text(g, x + 14, CY0 + 58, '', { size: 32, cls: 'sk-text-accent' });
      const dir = S.text(g, x + 112, CY0 + 58, '', { size: 21, cls: 'sk-text' });
      const ah = S.group(g, 'a');
      pen.arrow(ah, 0, 0, arrowDir * 46, 0, { cls: 'sk-accent', width: 3.6, head: 11 });
      setT(ah, arrowDir > 0 ? x + 200 : x + 244, CY0 + 18);
      return { g, spd, dir, ah };
    };
    const c1 = mkCard(8, 'radar: the pitch', 1), c2 = mkCard(302, 'radar: the hit', -1);
    const noteG = S.group(gP, 'note');
    S.text(noteG, 300, 62, '', { anchor: 'middle', size: 25, cls: 'sk-text-accent' });
    const noteT = noteG.firstChild;
    c.fade('note', noteG);
    const cap = makeCaption(gP, 300, 28, 560, 22, 'middle', 'sk-text');
    c.fade('caption', cap.g);

    const T1 = () => len1 / (KP * c.cfg.mph), T2 = () => len2 / (KP * c.cfg.mphBack);
    let gA = 0;
    return {
      cycle: () => TREL + T1() + T2() + HOLD,
      endU: () => TREL + T1() + T2() * 0.55,
      draw(u, dt) {
        const cfg = c.cfg, mph = cfg.mph, mphB = cfg.mphBack, t1 = T1(), t2 = T2(), tC = TREL + t1, tau = u - TREL, tb = u - tC;
        pitcherPose(fig, tau, W);
        // bat
        let phi;
        if (tb < -0.3) phi = -105;
        else if (tb < 0) { const q = (tb + 0.3) / 0.3; phi = -105 + 105 * q * q; }
        else phi = 80 * easeOut(clamp(tb / 0.4, 0, 1));
        const sw = clamp((tb + 0.3) / 0.7, 0, 1);
        bat.pose(Object.assign({ lean: 8 + 8 * sw, armF: { to: HND, bend: 1 }, armB: { to: [HND[0] - 1, HND[1] + 1], bend: 1 } }, stance));
        setBat(phi);
        // ball
        let bx, by, aAng = ang, alive = 1, spinA = 0;
        if (tau < 0) { const h = fig.world(fig.hands.F[0], fig.hands.F[1]); bx = h[0]; by = h[1]; }
        else if (tb < 0) { bx = R[0] + ux * KP * mph * tau; by = R[1] + uy * KP * mph * tau; spinA = tau * 900; }
        else {
          const s = Math.min(KP * mphB * tb, len2);
          bx = Cpt[0] - ux * s; by = Cpt[1] - uy * s; aAng = ang + 180; spinA = -tb * 900;
          alive = 1 - prog(s, len2 * 0.8, len2);
        }
        ball.pos(bx, by, spinA); op(ball.g, alive);
        const alenA = clamp((tb < 0 ? mph : mphB) * 1.05, 24, 96), cA = Math.cos(rad(aAng)), sA = Math.sin(rad(aAng));
        if (tau >= 0) arrow.set(bx - cA * alenA / 2, by - 25 - sA * alenA / 2, aAng, alenA); else arrow.set(0, 0, 0, 0);
        op(arrow.g, alive);
        // contact flash
        show(flash, tb >= 0 && tb < 0.3); op(flash, 1 - prog(tb, 0, 0.3));
        // ghost
        const wantG = cfg.showGhost && tb >= 0;
        gA = S.reduceMotion() ? (wantG ? 1 : 0) : approach(gA, wantG ? 1 : 0, dt / 0.35);
        show(ghostG, gA > 0.01); show(gapLine, gA > 0.01); show(glabG, gA > 0.01); show(gapG, gA > 0.01);
        if (gA > 0.01) {
          const sg = Math.min(KP * mph * Math.max(tb, 0), gEndS);
          const gx = Cpt[0] + ux * sg, gy = Cpt[1] + uy * sg;
          setT(ghostG, gx, gy); gball.pos(0, 0, sg * 3);
          const glen = clamp(mph * 1.05, 24, 96);
          garrow.set(-glen / 2 * Math.cos(rad(ang)), -25 - glen / 2 * Math.sin(rad(ang)), ang, glen);
          op(ghostG, 0.62 * gA);
          const gap = Math.hypot(gx - bx, gy - by);
          gapLine.setAttribute('x1', bx.toFixed(1)); gapLine.setAttribute('y1', by.toFixed(1));
          gapLine.setAttribute('x2', gx.toFixed(1)); gapLine.setAttribute('y2', gy.toFixed(1));
          op(gapLine, gA * clamp((gap - 36) / 40, 0, 1));
          setT(glabG, gx - 18, gy - 52);
          op(glabG, gA);
          const cx = clamp((bx + gx) / 2, 175, 470);
          gapG.setAttribute('transform', `translate(${cx.toFixed(1)} 106)`);
          op(gapIn, gA * clamp((gap - 150) / 80, 0, 1));
        }
        // radar cards
        const rel = tau >= 0, hit = tb >= 0;
        op(c1.g, rel ? 1 : 0.4); op(c2.g, hit ? 1 : 0.4);
        setTxt(c1.spd, rel ? `${c.hid('readout') ? '?' : fmt(mph, 0)} mph` : '-- mph');
        setTxt(c1.dir, rel ? (c.hid('direction') ? '?' : 'toward the plate') : '');
        setTxt(c2.spd, hit ? `${c.hid('readout') ? '?' : fmt(mphB, 0)} mph` : '-- mph');
        setTxt(c2.dir, hit ? (c.hid('direction') ? '?' : 'toward the pitcher') : '');
        op(c2.ah, hit ? 1 : 0);
        show(noteG, hit);
        setTxt(noteT, Math.abs(mph - mphB) < 0.5 ? 'same speed, new direction' : 'new speed, new direction');
        cap.set(c.captionText('A pitch comes in, then the batter hits it back'));
      },
      state: () => ({ speedBefore: c.cfg.mph, speedAfter: c.cfg.mphBack, directionBefore: 'toward the plate', directionAfter: 'toward the pitcher', speedChanged: Math.abs(c.cfg.mph - c.cfg.mphBack) >= 0.5, velocityChanged: true }),
    };
  };

  /* ---------------------------------------------------------------- bases */
  function buildPath(pts, r, step) {
    const xs = [], ys = [], hs = [], arcs = [];
    let x = pts[0][0], y = pts[0][1], s = 0;
    const N = pts.length;
    const hd = (a, b) => deg(Math.atan2(b[1] - a[1], b[0] - a[0]));
    const push = (h) => { xs.push(x); ys.push(y); hs.push(h); };
    for (let i = 0; i < N - 1; i++) {
      const a = pts[i], b = pts[i + 1], h = hd(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
      const trimS = i > 0 ? r : 0, trimE = i < N - 2 ? r : 0;
      x = a[0] + ux * trimS; y = a[1] + uy * trimS;
      const len = L - trimS - trimE;
      const n = Math.max(1, Math.round(len / step));
      for (let k = 0; k <= n; k++) { push(h); if (k < n) { x += ux * len / n; y += uy * len / n; } }
      if (i < N - 2) {
        const h2 = hd(b, pts[i + 2]);
        let dh = ((h2 - h + 540) % 360) - 180;
        const arcLen = r * rad(Math.abs(dh)), m = Math.max(2, Math.round(arcLen / step));
        const iStart = xs.length - 1;
        for (let k = 1; k <= m; k++) {
          const hh = h + dh * k / m, hp = h + dh * (k - 0.5) / m;
          x += Math.cos(rad(hp)) * arcLen / m; y += Math.sin(rad(hp)) * arcLen / m;
          push(hh);
        }
        arcs.push({ iIn: iStart, iMid: iStart + Math.round(m / 2), corner: b });
      }
    }
    return { xs, ys, hs, step, arcs, n: xs.length };
  }

  function makeTopRunner(parent, pen, jersey, capCls) {
    const g = S.group(parent, 'runner-top');
    const s = S.group(g, 'sc');
    s.setAttribute('transform', 'scale(1.75)');
    const sh = [];
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; sh.push([-1 + 5.2 * Math.cos(a), 11 * Math.sin(a)]); }
    shape(s, pen, sh, { fillCls: 'sk-fill-card', tintCls: jersey, width: 1.5, rough: 0.4, single: true });
    shape(s, pen, [[7.4, -4.6], [15, -3], [15, 3], [7.4, 4.6]], { fillCls: 'sk-fill-card', tintCls: 'sk-fill-hl', width: 1.5, rough: 0.3, single: true });
    pen.circle(s, 1.5, 0, 7.2, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 1.5, single: true });
    pen.circle(s, 1.5, 0, 6.6, { fill: 'solid', fillCls: capCls, cls: 'sk-ink', width: 1.4, single: true });
    S.el('circle', { cx: 1.5, cy: 0, r: 1.3, class: 'sk-fill-ink' }, s);
    return g;
  }

  SCENES.bases = function (c) {
    const gP = c.gP, pen = c.pen, PRE = 0.6, HOLD = 1.8, TS = 1.6, PAUSE = 2.6, GL = 86;
    c.setH(352);
    const CX = 300, CY = 186, HD = 96;
    const H = [CX, CY + HD], B1 = [CX + HD, CY], B2 = [CX, CY - HD], B3 = [CX - HD, CY];
    const baseFt = c.cfg.baseFt, pxFt = HD * Math.SQRT2 / baseFt;
    const path = buildPath([H, B1, B2, B3, H], 14, 0.5);
    const Ltot = (path.n - 1) * path.step;
    const at = (s) => {
      const f = clamp(s / path.step, 0, path.n - 1), i = Math.min(path.n - 2, Math.floor(f)), k = f - i;
      return { x: lerp(path.xs[i], path.xs[i + 1], k), y: lerp(path.ys[i], path.ys[i + 1], k), h: lerp(path.hs[i], path.hs[i + 1], k) };
    };
    const sIn = path.arcs.map((a) => a.iIn * path.step), sMid = path.arcs.map((a) => a.iMid * path.step);
    const pause = c.cfg.pauseAt;   // 1..3 or null (read at build: pauseAt is part of the art key)

    // field
    S.el('polygon', { points: [H, B1, B2, B3].map((p) => p.join(',')).join(' '), class: 'sk-fill-good' }, gP);
    const fl = [[H, [H[0] + 2.1 * HD, H[1] - 2.1 * HD]], [H, [H[0] - 2.1 * HD, H[1] - 2.1 * HD]]];
    fl.forEach((l) => { const ln = pen.line(gP, l[0][0], l[0][1], l[1][0], l[1][1], { cls: 'sk-soft', width: 1.8, single: true }); ln.setAttribute('stroke-dasharray', '2 8'); });
    let d = '';
    for (let i = 0; i < path.n; i += 6) d += (i ? 'L' : 'M') + path.xs[i].toFixed(1) + ',' + path.ys[i].toFixed(1) + ' ';
    d += `L${H[0]},${H[1]}`;
    S.el('path', { d, class: 'sk-hl', fill: 'none', 'stroke-width': 17, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.5 }, gP);
    const pm = S.group(gP, 'pm');
    pen.circle(pm, CX, CY + 8, 12, { fill: 'solid', fillCls: 'sk-fill-hl', cls: 'sk-ink', width: 2.2, single: true });
    [B1, B2, B3].forEach((b) => shape(gP, pen, [[b[0], b[1] - 9], [b[0] + 9, b[1]], [b[0], b[1] + 9], [b[0] - 9, b[1]]], { fillCls: 'sk-fill-card', width: 2.4, rough: 0.4 }));
    shape(gP, pen, [[H[0] - 9, H[1] - 9], [H[0] + 9, H[1] - 9], [H[0] + 9, H[1] + 1], [H[0], H[1] + 10], [H[0] - 9, H[1] + 1]], { fillCls: 'sk-fill-card', width: 2.4, rough: 0.4 });
    const nm = (x, y, t, a) => S.text(gP, x, y, t, { anchor: a, size: 20, cls: 'sk-text' });
    nm(B1[0] + 16, B1[1] + 32, '1st', 'start'); nm(B2[0] + 24, B2[1] - 8, '2nd', 'start');
    nm(B3[0] - 16, B3[1] - 14, '3rd', 'end'); nm(H[0], H[1] + 36, 'home', 'middle');
    const ftG = S.group(gP, 'ftlabels');
    const mids = [[H, B1, 1, 1], [B1, B2, 1, -1], [B2, B3, -1, -1], [B3, H, -1, 1]];
    mids.forEach((m) => S.text(ftG, (m[0][0] + m[1][0]) / 2 + m[2] * 21, (m[0][1] + m[1][1]) / 2 + m[3] * 21 + 6, `${fmt(baseFt, 0)} ft`, { anchor: 'middle', size: 20, cls: 'sk-text-accent' }));
    c.fade('labels', ftG);

    // runners + arrows
    const ghR = makeTopRunner(gP, pen, 'sk-fill-bad', 'sk-fill-bad'); ghostify(ghR);
    const gArr = makeArrow(gP, 'sk-accent', 3.6, 12, 12); gArr.path.setAttribute('stroke-dasharray', '6 5');
    const conn = S.el('line', { x1: 0, y1: 0, x2: 0, y2: 0, class: 'sk-bad', 'stroke-width': 3, 'stroke-dasharray': '7 6', 'stroke-linecap': 'round' }, gP);
    const ghostBox = S.group(gP, 'ghost-box'); ghostBox.appendChild(ghR); ghostBox.appendChild(gArr.g); ghostBox.appendChild(conn);
    const rn = makeTopRunner(gP, pen, 'sk-fill-bad', 'sk-fill-bad');
    const arr = makeArrow(gP, 'sk-accent', 4.6, 14, 4);
    c.fade('arrow', arr.g);
    const gl = S.group(gP, 'ghost-label');
    S.text(gl, 300, 344, 'ghost = where the runner would be if the velocity did not change', { anchor: 'middle', size: 19, cls: 'sk-text-soft' });
    const glInner = gl.firstChild;
    c.fade('ghostLabel', gl);

    // readouts
    const cardG = S.group(gP, 'speed-card');
    pen.rect(cardG, 8, 38, 170, 74, { cls: 'sk-ink', width: 2.4, fill: 'solid', fillCls: 'sk-fill-card' });
    S.text(cardG, 20, 62, 'runner speed', { size: 19, cls: 'sk-text-soft' });
    const spdT = S.text(cardG, 20, 100, '', { size: 36, cls: 'sk-text-accent' });
    const ck = S.group(gP, 'checklist');
    pen.rect(ck, 408, 38, 184, 82, { cls: 'sk-ink', width: 2.4, fill: 'solid', fillCls: 'sk-fill-card' });
    S.text(ck, 420, 70, 'speed constant?', { size: 20, cls: 'sk-text' });
    S.text(ck, 420, 104, 'velocity constant?', { size: 20, cls: 'sk-text' });
    const markSpeed = S.group(ck, 'm1'), markVel = S.group(ck, 'm2');
    const yesG = S.group(markSpeed, 'yes'), noG = S.group(markSpeed, 'no');
    drawMark(yesG, pen, true, 570, 62); drawMark(noG, pen, false, 570, 62);
    drawMark(markVel, pen, false, 570, 96);
    c.fade('checklist', ck);
    const cap = makeCaption(gP, 14, 26, 570, 22, 'start', 'sk-text');
    c.fade('caption', cap.g);

    const v = () => c.cfg.speedFt * pxFt;                 // px per simulated second
    const sp = pause ? sMid[pause - 1] : -1, tp = () => (pause ? sp / v() : Infinity);
    const sAt = (t) => {
      let s;
      if (!pause) s = v() * t;
      else if (t <= tp()) s = v() * t;
      else if (t < tp() + PAUSE) s = sp;
      else s = v() * (t - PAUSE);
      return clamp(s, 0, Ltot);
    };
    const tOfS = (s) => (pause && s > sp ? s / v() + PAUSE : s / v());
    const simTotal = () => Ltot / v() + (pause ? PAUSE : 0);
    let gA = 0, rA = 1;
    return {
      cycle: () => PRE + simTotal() / TS + HOLD,
      endU: () => PRE + tOfS(sIn[0] + 34) / TS,
      draw(u, dt) {
        const cfg = c.cfg, t = Math.max(0, (u - PRE) * TS), s = sAt(t), p = at(s);
        const finished = s >= Ltot - 0.01, paused = !!pause && t > tp() && t < tp() + PAUSE;
        const tail = Math.max(0, t - simTotal());
        rA = finished ? 1 - prog(tail / TS, 0.25, 0.9) : 1;
        setT(rn, p.x, p.y, p.h); op(rn, rA);
        const moving = !finished && !paused && t > 0;
        const ang = p.h, alen = (paused || t <= 0) ? 0 : 44;
        arr.set(p.x + Math.cos(rad(ang)) * 24, p.y + Math.sin(rad(ang)) * 24, ang, finished ? 0 : alen);
        // ghost: first corner whose turn has begun and which the ghost has not yet left behind
        let k = -1;
        for (let i = 0; i < sIn.length; i++) if (s >= sIn[i] && s - sIn[i] <= GL) k = i;
        const wantG = cfg.showGhost && k >= 0 && !finished ? 1 : 0;
        gA = S.reduceMotion() ? wantG : approach(gA, wantG, dt / 0.25);
        show(ghostBox, gA > 0.01);
        if (k >= 0 && gA > 0.01) {
          const pin = at(sIn[k]), dg = s - sIn[k];
          const gx = pin.x + Math.cos(rad(pin.h)) * dg, gy = pin.y + Math.sin(rad(pin.h)) * dg;
          setT(ghR, gx, gy, pin.h);
          gArr.set(gx + Math.cos(rad(pin.h)) * 24, gy + Math.sin(rad(pin.h)) * 24, pin.h, 44);
          const gap = Math.hypot(gx - p.x, gy - p.y);
          conn.setAttribute('x1', p.x.toFixed(1)); conn.setAttribute('y1', p.y.toFixed(1));
          conn.setAttribute('x2', gx.toFixed(1)); conn.setAttribute('y2', gy.toFixed(1));
          op(conn, clamp((gap - 24) / 20, 0, 1));
          op(ghostBox, 0.8 * gA * (1 - prog(dg, GL - 22, GL)));
        }
        show(gl, true);
        op(glInner, gA > 0.01 || cfg.showGhost ? 1 : 0);
        const spdNow = paused ? 0 : cfg.speedFt;
        setTxt(spdT, c.hid('readout') ? '? ft/s' : `${fmt(spdNow, 0)} ft/s`);
        const constSpeed = !pause;
        show(yesG, constSpeed); show(noG, !constSpeed);
        cap.set(c.captionText('A runner goes around the bases at a steady speed'));
        void moving;
      },
      state: () => ({ speedFt: c.cfg.speedFt, baseFt: c.cfg.baseFt, speedConstant: !pause, velocityConstant: false, pauseAt: pause }),
    };
  };

  /* ------------------------------------------------------------ viewpoint */
  const OBS = {
    catcher: { cap: 'Reference point: the catcher', title: "the catcher's view", lines: ['the ball is coming straight at me', 'it looks bigger and bigger'] },
    stands: { cap: 'Reference point: a fan in the stands', title: "the fan's view", lines: ['the ball moves left to right', 'across the field'] },
    ball: { cap: 'Reference point: riding on the ball', title: "the ball's view", lines: ['I am not moving', "the catcher's mitt rushes at me"] },
  };
  SCENES.viewpoint = function (c) {
    const gP = c.gP, pen = c.pen, W = 0.7, TREL = W + 0.6, HOLD = 2.0;
    const G = 202, MT = 188;
    c.setH(358);
    groundLine(gP, pen, G, 14, 586);
    mound(gP, pen, 62, G, MT, 48);
    plate(gP, pen, 506, G);
    // stands with a fan
    const stands = [[215, G], [215, 124], [255, 124], [255, 96], [355, 96], [355, 124], [395, 124], [395, G]];
    S.el('polygon', { points: stands.map((p) => p.join(',')).join(' '), class: 'sk-fill-accent' }, gP);
    pen.poly(gP, stands, { cls: 'sk-soft', width: 2.4 });
    const stl = S.group(gP, 'stands-label');
    S.text(stl, 305, 150, 'stands', { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
    c.fade('labels', stl);
    const fan = makeFigure(gP, pen, { sc: 0.95, facing: 1, jersey: 'sk-fill-good', cap: 'sk-fill-good', seed: 81, lw: 3.4 });
    fan.place(300, 96);
    fan.pose({ legF: [80, 5], legB: [85, 8], lean: 4, armF: [150, 150], armB: [20, 30] });

    const cat = makeFigure(gP, pen, { sc: 1.2, facing: -1, jersey: 'sk-fill-accent', cap: 'sk-fill-accent', capBack: true, mask: true, seed: 83 });
    cat.place(542, G);
    const M = [511, 164];
    cat.pose({ legF: [80, 5], legB: [85, 8], lean: 10, armF: { to: cat.toLocal(M[0], M[1]), bend: 1 }, armB: [30, 20] });
    const fig = makeFigure(gP, pen, { sc: 1.25, facing: 1, jersey: 'sk-fill-accent', cap: 'sk-fill-accent', glove: true, seed: 85 });
    fig.place(62, MT);
    pitcherPose(fig, 0, W, { frozen: true });
    const R = fig.world(fig.hands.F[0], fig.hands.F[1]);
    const mg = S.group(gP, 'mitt'); mitt(mg, pen, 11); setT(mg, M[0] - 2, M[1]);

    // observer rings + tags
    const rings = {
      catcher: S.group(gP, 'ring-c'), stands: S.group(gP, 'ring-s'), ball: S.group(gP, 'ring-b'),
    };
    const ringDash = (g, r) => { const e = S.el('circle', { cx: 0, cy: 0, r, class: 'sk-hl', fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-dasharray': '10 7', opacity: 0.95 }, g); return e; };
    ringDash(rings.catcher, 40); setT(rings.catcher, 538, 148);
    ringDash(rings.stands, 33); setT(rings.stands, 300, 60);
    ringDash(rings.ball, 15);
    const tagC = S.text(rings.catcher, 0, -50, 'reference point', { anchor: 'middle', size: 18, cls: 'sk-text' });
    const tagS = S.text(rings.stands, 46, 6, 'reference point', { anchor: 'start', size: 18, cls: 'sk-text' });
    const tagB = S.text(rings.ball, 0, -26, 'reference point', { anchor: 'middle', size: 18, cls: 'sk-text' });
    const ringsAll = ['catcher', 'stands', 'ball'];
    [tagC, tagS, tagB].forEach((t) => c.fade('labels', t));

    const ball = makeBall(gP, 7);

    // lens
    const LX = 116, LY = 290, LR = 64;
    const clipId = 'bbclip' + Math.floor(Math.random() * 1e7);
    const defs = S.el('defs', null, gP);
    S.el('circle', { cx: 0, cy: 0, r: LR - 2 }, S.el('clipPath', { id: clipId }, defs));
    const lens = S.group(gP, 'lens');
    S.el('circle', { cx: 0, cy: 0, r: LR, class: 'sk-fill-card' }, lens);
    const clipG = S.group(lens, 'clip'); clipG.setAttribute('clip-path', `url(#${clipId})`);
    const frame = S.group(lens, 'frame');
    pen.circle(frame, 0, 0, LR, { cls: 'sk-ink', width: 3.4 });
    const views = { catcher: S.group(clipG, 'v-c'), stands: S.group(clipG, 'v-s'), ball: S.group(clipG, 'v-b') };
    // catcher's view: far-away pitcher, ball growing
    S.el('rect', { x: -70, y: 8, width: 140, height: 70, class: 'sk-fill-good' }, views.catcher);
    pen.line(views.catcher, -70, 8, 70, 8, { cls: 'sk-ink', width: 2, single: true });
    const farP = makeFigure(views.catcher, pen, { sc: 0.34, facing: 1, jersey: 'sk-fill-accent', cap: 'sk-fill-accent', seed: 87, lw: 2.6 });
    farP.place(0, 9); farP.pose(Object.assign({ lean: 0 }, STAND));
    const cBall = makeBall(views.catcher, 3);
    // fan's view: a tiny field, the ball crossing it
    S.el('rect', { x: -70, y: 22, width: 140, height: 50, class: 'sk-fill-good' }, views.stands);
    pen.line(views.stands, -70, 22, 70, 22, { cls: 'sk-ink', width: 2, single: true });
    const sP = makeFigure(views.stands, pen, { sc: 0.4, facing: 1, jersey: 'sk-fill-accent', cap: 'sk-fill-accent', seed: 88, lw: 2.6 });
    sP.place(-46, 22); sP.pose(Object.assign({ lean: 0 }, STAND));
    const sC = makeFigure(views.stands, pen, { sc: 0.4, facing: -1, jersey: 'sk-fill-accent', cap: 'sk-fill-accent', capBack: true, mask: true, seed: 89, lw: 2.6 });
    sC.place(48, 22); sC.pose({ legF: [80, 5], legB: [85, 8], lean: 10, armF: [75, 80], armB: [30, 20] });
    const sBall = makeBall(views.stands, 5);
    // ball's view: rushing streaks and a mitt that grows
    const streaks = [];
    for (let i = 0; i < 14; i++) streaks.push(S.el('line', { x1: 0, y1: 0, x2: 0, y2: 0, class: 'sk-soft', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, views.ball));
    const bm = S.group(views.ball, 'bm'); mitt(bm, pen, 10);

    const textBlocks = {};
    ringsAll.forEach((k) => {
      const g = S.group(gP, 'obs-text-' + k);
      S.text(g, 212, 266, OBS[k].title, { size: 25, cls: 'sk-text-accent' });
      OBS[k].lines.forEach((ln, i) => S.text(g, 212, 298 + i * 27, ln, { size: 21, cls: 'sk-text' }));
      textBlocks[k] = g;
    });
    ringsAll.forEach((k) => { const g = textBlocks[k]; c.fade('labels', g); });
    const cap = makeCaption(gP, 14, 26, 570, 24, 'start', 'sk-text');
    c.fade('caption', cap.g);

    const dx = M[0] - R[0], dy = M[1] - R[1], flen = Math.hypot(dx, dy);
    const Tof = () => flen / (KP * c.cfg.mph);
    const al = { catcher: 0, stands: 0, ball: 0 };
    let pulse = 0, lastObs = null;
    Object.keys(al).forEach((k) => { al[k] = k === c.cfg.observer ? 1 : 0; });
    lastObs = c.cfg.observer;
    return {
      cycle: () => TREL + Tof() + HOLD,
      endU: () => TREL + Tof() * 0.72,
      draw(u, dt) {
        const cfg = c.cfg, T = Tof(), tau = u - TREL;
        pitcherPose(fig, tau, W);
        let bx, by, f = 0;
        if (tau < 0) { const h = fig.world(fig.hands.F[0], fig.hands.F[1]); bx = h[0]; by = h[1]; }
        else { f = clamp(tau / T, 0, 1); bx = R[0] + dx * f; by = R[1] + dy * f; }
        ball.pos(bx, by, tau > 0 && f < 1 ? tau * 900 : 0);
        const rm = S.reduceMotion();
        if (cfg.observer !== lastObs) { pulse = 1; lastObs = cfg.observer; }
        pulse = rm ? 0 : Math.max(0, pulse - dt / 0.5);
        ringsAll.forEach((k) => {
          al[k] = rm ? (cfg.observer === k ? 1 : 0) : approach(al[k], cfg.observer === k ? 1 : 0, dt / 0.35);
          op(rings[k], al[k]); show(rings[k], al[k] > 0.01);
          op(views[k], al[k]); show(views[k], al[k] > 0.01);
          op(textBlocks[k], al[k]); show(textBlocks[k], al[k] > 0.01);
        });
        setT(rings.ball, bx, by);
        const sc = 1 + 0.06 * Math.sin(pulse * Math.PI);
        lens.setAttribute('transform', `translate(${LX} ${LY}) scale(${sc.toFixed(3)})`);
        // lens contents
        const q = Math.max(1 - f * 0.95, 0.05), ph = tau > 0 ? tau : 0;
        if (al.catcher > 0.01) {
          cBall.setR(clamp(3.2 / q, 3, 60)); cBall.pos(0, -15 * q * q - 1 * (1 - q), ph * 500);
        }
        if (al.stands > 0.01) { sBall.pos(-40 + 80 * f, 4 - 22 * (1 - f) * (1 - f) + (tau < 0 ? 0 : 0), ph * 700); }
        if (al.ball > 0.01) {
          const mr = clamp(2.6 / q, 2.5, 60);
          bm.setAttribute('transform', `translate(0 ${(4 * q).toFixed(1)}) scale(${(mr / 10).toFixed(3)})`);
          streaks.forEach((l, i) => {
            const a = i / streaks.length * Math.PI * 2 + 0.2;
            const dd = (((ph * 1.1 + i * 0.37) % 1) + 1) % 1;
            const rin = 14 + dd * dd * 62, rout = rin + 4 + dd * 22;
            const live = tau > 0 && f < 1 ? 1 : 0.55;
            l.setAttribute('x1', (Math.cos(a) * rin).toFixed(1)); l.setAttribute('y1', (Math.sin(a) * rin).toFixed(1));
            l.setAttribute('x2', (Math.cos(a) * rout).toFixed(1)); l.setAttribute('y2', (Math.sin(a) * rout).toFixed(1));
            l.setAttribute('opacity', (live * (0.25 + 0.75 * dd)).toFixed(2));
          });
        }
        cap.set(c.captionText(OBS[cfg.observer].cap));
      },
      state: () => ({ observer: c.cfg.observer }),
    };
  };

  /* --------------------------------------------------------------- steady */
  SCENES.steady = function (c) {
    const gP = c.gP, pen = c.pen, PRE = 0.6, HOLD = 2.6, TS = 1.3;
    const G = 214, X0 = 62, X1 = 538, SC = 1.25;
    c.setH(340);
    const baseFt = c.cfg.baseFt, pxFt = (X1 - X0) / baseFt;
    groundLine(gP, pen, G, 14, 586);
    plate(gP, pen, X0, G);
    shape(gP, pen, [[X1 - 11, G - 2], [X1 + 11, G - 2], [X1 + 13, G + 6], [X1 - 13, G + 6]], { fillCls: 'sk-fill-card', width: 2.4, rough: 0.4 });
    const nm = S.group(gP, 'names');
    S.text(nm, X0, G + 36, 'home plate', { anchor: 'middle', size: 19, cls: 'sk-text-soft' });
    S.text(nm, X1, G + 36, 'first base', { anchor: 'middle', size: 19, cls: 'sk-text-soft' });
    c.fade('labels', nm);
    // brace under
    const BY = G + 54;
    pen.line(gP, X0, BY, X1, BY, { cls: 'sk-ink', width: 2.2, single: true });
    pen.line(gP, X0, BY - 6, X0, BY + 6, { cls: 'sk-ink', width: 2.2, single: true, rough: 0.2 });
    pen.line(gP, X1, BY - 6, X1, BY + 6, { cls: 'sk-ink', width: 2.2, single: true, rough: 0.2 });
    S.text(gP, (X0 + X1) / 2, BY + 28, `${fmt(baseFt, 0)} ft`, { anchor: 'middle', size: 22, cls: 'sk-text' });
    // tape + strobe dots (pool)
    const TY = 98;
    const tape = pen.line(gP, X0 - 10, TY, X1 + 10, TY, { cls: 'sk-soft', width: 1.8, single: true });
    tape.setAttribute('stroke-dasharray', '2 7');
    const pool = [], dotsG = S.group(gP, 'strobe');
    for (let i = 0; i < 18; i++) {
      const g = S.group(dotsG, 'sd');
      const d = makeDot(g, pen, 6, 'sk-accent');
      const gap = S.text(g, 0, 0, '', { anchor: 'middle', size: 19, cls: 'sk-text-accent' });
      const tl = S.text(g, 0, 0, '', { anchor: 'middle', size: 18, cls: 'sk-text-soft' });
      pool.push({ g, d, gap, tl });
    }
    c.fade('dots', dotsG);
    const fig = makeFigure(gP, pen, { sc: SC, facing: 1, jersey: 'sk-fill-bad', cap: 'sk-fill-bad', seed: 91, lw: 3.2 });
    const spdT = S.text(gP, 14, 32, '', { size: 28, cls: 'sk-text-accent' });
    const clkT = S.text(gP, 586, 32, '', { anchor: 'end', size: 24, cls: 'sk-text' });
    const clkG = S.group(gP, 'clk'); clkG.appendChild(clkT); c.fade('clock', clkG);
    const lab = S.group(gP, 'label');
    S.text(lab, 300, 328, 'speed does not vary or change', { anchor: 'middle', size: 24, cls: 'sk-text-good' });
    c.fade('labels', lab);
    const cap = makeCaption(gP, 14, 28, 560, 22, 'start', 'sk-text');
    c.fade('caption', cap.g);

    const simTotal = () => baseFt / c.cfg.speedFt;
    return {
      cycle: () => PRE + simTotal() / TS + HOLD,
      endU: () => PRE + simTotal() / TS + 0.4,
      draw(u) {
        const cfg = c.cfg, v = cfg.speedFt, t = Math.max(0, (u - PRE) * TS), T = simTotal();
        const ft = Math.min(v * t, baseFt), x = X0 + ft * pxFt, done = v * t >= baseFt;
        fig.place(x, G);
        if (done || t <= 0) fig.pose(Object.assign({ lean: 4 }, STAND));
        else runPose(fig, x * Math.PI * 2 / 56, 12, 1);
        const n = Math.floor(baseFt / v + 1e-9) + 1;
        pool.forEach((p, i) => {
          const on = i < n && i <= Math.floor(t + 1e-9) && (t > 0 || i === 0) && (i === 0 ? u >= PRE : true);
          show(p.g, on);
          if (!on) return;
          const px = X0 + i * v * pxFt;
          setT(p.d, px, TY);
          p.tl.setAttribute('x', px.toFixed(1)); p.tl.setAttribute('y', (TY - 16).toFixed(1)); setTxt(p.tl, `${i} s`);
          if (i > 0) { p.gap.setAttribute('x', (px - v * pxFt / 2).toFixed(1)); p.gap.setAttribute('y', (TY - 16).toFixed(1)); setTxt(p.gap, c.hid('readout') ? '? ft' : `${fmt(v, 0)} ft`); } else setTxt(p.gap, '');
        });
        setTxt(spdT, c.hid('readout') ? 'speed: ?' : (done ? `${fmt(v, 0)} ft/s the whole way` : `speed: ${fmt(v, 0)} ft/s`));
        setTxt(clkT, `time: ${fmt(Math.min(t, T), 0)} s`);
        cap.set(c.captionText(''));
      },
      state: () => ({ speedFt: c.cfg.speedFt, baseFt: c.cfg.baseFt, speedConstant: true, accel: 'zero' }),
    };
  };

  /* -------------------------------------------------------------- average */
  SCENES.average = function (c) {
    const gP = c.gP, pen = c.pen, PRE = 0.7, HOLD = 4.4;
    const XS = 76, XE = 420, Y1 = 166, Y2 = 250, SC = 0.98;
    const cfg0 = c.cfg, segs = cfg0.segments;
    let a = 0, b = 0;
    segs.forEach((s) => { s.d0 = a; s.t0 = b; a += s.d; b += s.t; s.v = s.d / s.t; });
    const totalD = a, totalT = b, avg = totalD / totalT, K = totalD > 0 ? (XE - XS) / totalD : 1;
    const RUN = clamp(totalT * 0.6, 6, 11), TS = totalT / RUN;
    const xOf = (d) => XS + d * K;
    const realAt = (t) => {
      for (const s of segs) if (t <= s.t0 + s.t + 1e-9) return { pos: s.d0 + s.v * (t - s.t0), v: s.v };
      return { pos: totalD, v: 0 };
    };

    // clock + readouts
    const KX = 44, KY = 52;
    const clk = S.group(gP, 'clock');
    pen.circle(clk, KX, KY, 28, { fill: 'solid', fillCls: 'sk-fill-card', cls: 'sk-ink', width: 2.6 });
    pen.line(clk, KX, KY - 28, KX, KY - 36, { cls: 'sk-ink', width: 4.5, single: true });
    pen.line(clk, KX - 5, KY - 36, KX + 5, KY - 36, { cls: 'sk-ink', width: 4.5, single: true });
    for (let i = 0; i < 4; i++) { const an = i * Math.PI / 2; pen.line(clk, KX + Math.sin(an) * 21, KY - Math.cos(an) * 21, KX + Math.sin(an) * 26, KY - Math.cos(an) * 26, { cls: 'sk-ink', width: 2, single: true, rough: 0.2 }); }
    const hand = S.group(clk, 'hand');
    pen.line(hand, KX, KY + 3, KX, KY - 20, { cls: 'sk-bad', width: 3.2, single: true });
    S.el('circle', { cx: KX, cy: KY, r: 3.6, class: 'sk-fill-ink' }, clk);
    S.text(clk, 88, 36, 'time', { size: 19, cls: 'sk-text-soft' });
    const clockT = S.text(clk, 88, 70, '', { size: 32, cls: 'sk-text' });
    c.fade('clock', clk);
    const rd = S.group(gP, 'rd');
    S.text(rd, 262, 36, 'runner speed now', { size: 19, cls: 'sk-text-soft' });
    const spdT = S.text(rd, 262, 70, '', { size: 32, cls: 'sk-text' });

    // lanes
    const lane = (y, label, ghost) => {
      pen.line(gP, 24, y + 2, XE + 40, y + 2, { cls: ghost ? 'sk-soft' : 'sk-ink', width: 2.8 });
      S.text(gP, 476, y - 26, label, { size: 20, cls: ghost ? 'sk-text-soft' : 'sk-text' });
    };
    lane(Y1, 'runner', false);
    const ghostLane = S.group(gP, 'ghost-lane');
    pen.line(ghostLane, 24, Y2 + 2, XE + 40, Y2 + 2, { cls: 'sk-soft', width: 2.8 });
    S.text(ghostLane, 476, Y2 - 26, 'steady runner', { size: 20, cls: 'sk-text-soft' });
    const distR = S.text(gP, 476, Y1 + 2, '', { size: 25, cls: 'sk-text' });
    const distG = S.text(ghostLane, 476, Y2 + 2, '', { size: 25, cls: 'sk-text-soft' });
    // bases on both lanes
    const bounds = [0];
    segs.forEach((s) => { const e = s.d0 + s.d; if (bounds.indexOf(e) < 0) bounds.push(e); });
    const NAMES = ['home', '1st base', '2nd base', '3rd base', '4th base', '5th base', '6th base'];
    [Y1, Y2].forEach((y, li) => {
      const hostG = li ? ghostLane : gP;
      bounds.forEach((bd, i) => {
        const x = xOf(bd);
        if (i === 0) shape(hostG, pen, [[x - 11, y - 1], [x + 11, y - 1], [x + 11, y + 4], [x, y + 9], [x - 11, y + 4]], { fillCls: 'sk-fill-card', width: 2.2, rough: 0.4, single: true });
        else shape(hostG, pen, [[x - 9, y - 1], [x + 9, y - 1], [x + 11, y + 6], [x - 11, y + 6]], { fillCls: 'sk-fill-card', width: 2.2, rough: 0.4, single: true });
      });
    });
    // ruler row: base names
    const RY = Y2 + 16;
    pen.line(gP, xOf(0) - 12, RY, xOf(totalD) + 12, RY, { cls: 'sk-soft', width: 2.2, single: true });
    bounds.forEach((bd, i) => {
      const x = xOf(bd);
      pen.line(gP, x, RY - 3, x, RY + 9, { cls: 'sk-soft', width: 2.2, single: true, rough: 0.3 });
      S.text(gP, x, RY + 28, i < NAMES.length ? NAMES[i] : '', { anchor: 'middle', size: 19, cls: 'sk-text-soft' });
    });
    // leg labels
    const legsG = S.group(gP, 'legs');
    let rows = 0;
    const taken = [[], [], [], []];
    segs.forEach((s) => {
      const move = s.d > 0, txt = move ? `${fmt(s.d, 1)} ft in ${fmt(s.t, 1)} s` : `waits ${fmt(s.t, 1)} s`;
      const cx = clamp(move ? xOf(s.d0 + s.d / 2) : xOf(s.d0), 74, 520), hw = txt.length * 4.4 + 8;
      let r = 0;
      while (r < 3 && taken[r].some((q) => cx + hw > q[0] && cx - hw < q[1])) r++;
      taken[r].push([cx - hw, cx + hw]);
      rows = Math.max(rows, r + 1);
      const y = RY + 66 + r * 24;
      if (move) {
        const xa = xOf(s.d0) + 4, xb = xOf(s.d0 + s.d) - 4;
        pen.line(legsG, xa, RY + 42, xb, RY + 42, { cls: 'sk-accent', width: 2.4, single: true, rough: 0.5 });
        pen.line(legsG, xa, RY + 37, xa, RY + 47, { cls: 'sk-accent', width: 2.2, single: true, rough: 0.2 });
        pen.line(legsG, xb, RY + 37, xb, RY + 47, { cls: 'sk-accent', width: 2.2, single: true, rough: 0.2 });
      }
      S.text(legsG, cx, y, txt, { anchor: 'middle', size: 20, cls: move ? 'sk-text' : 'sk-text-bad' });
    });
    c.fade('legs', legsG);

    const real = makeFigure(gP, pen, { sc: SC, facing: 1, jersey: 'sk-fill-bad', cap: 'sk-fill-bad', seed: 95, lw: 3.4 });
    const gh = makeFigure(ghostLane, pen, { sc: SC, facing: 1, jersey: 'sk-fill-bad', cap: 'sk-fill-bad', seed: 97, lw: 3.4 });
    real.place(xOf(0), Y1); gh.place(xOf(0), Y2);
    ghostify(gh.g);

    // calculation
    const cy = RY + 66 + Math.max(rows, 1) * 24 + 24;
    const calcG = S.group(gP, 'calc');
    S.text(calcG, 300, cy, 'average speed = total distance ÷ total time', { anchor: 'middle', size: 22, cls: 'sk-text' });
    S.text(calcG, 300, cy + 36, `= ${fmt(totalD, 1)} ÷ ${fmt(totalT, 1)} = ${fmt(avg, 1)} ft/s`, { anchor: 'middle', size: 32, cls: 'sk-text-accent' });
    const calcWrap = calcG.parentNode; void calcWrap;
    c.setH(cy + 58);
    const cap = makeCaption(gP, 586, 24, 300, 21, 'end', 'sk-text');
    c.fade('caption', cap.g);
    c.fade('calc', calcG);

    let gA = c.cfg.showGhost ? 1 : 0;
    return {
      cycle: () => PRE + RUN + HOLD,
      endU: () => PRE + RUN + 0.8,
      draw(u, dt) {
        const cfg = c.cfg, f = clamp((u - PRE) / RUN, 0, 1), t = f * totalT, r = realAt(t), gpos = avg * t;
        const done = f >= 1, moving = !done && f > 0 && r.v > 0;
        real.place(xOf(r.pos), Y1);
        if (moving) runPose(real, xOf(r.pos) * Math.PI * 2 / 46, 12, clamp(r.v / 15, 0.6, 1.3)); else real.pose(Object.assign({ lean: 2 }, STAND));
        gA = S.reduceMotion() ? (cfg.showGhost ? 1 : 0) : approach(gA, cfg.showGhost ? 1 : 0, dt / 0.4);
        op(ghostLane, gA); show(ghostLane, gA > 0.01);
        gh.place(xOf(gpos), Y2);
        if (!done && f > 0) runPose(gh, xOf(gpos) * Math.PI * 2 / 46, 12, clamp(avg / 15, 0.6, 1.3)); else gh.pose(Object.assign({ lean: 2 }, STAND));
        hand.setAttribute('transform', `rotate(${(360 * f).toFixed(1)} ${KX} ${KY})`);
        setTxt(clockT, `${fmt(t, 1)} s`);
        setTxt(spdT, c.hid('readout') ? '?' : (done ? 'arrived' : `${fmt(moving ? r.v : 0, 1)} ft/s`));
        setTxt(distR, `${fmt(r.pos, 0)} ft`); setTxt(distG, `${fmt(gpos, 0)} ft`);
        const wantCalc = (S.reduceMotion() || (u - PRE - RUN) > 0.4);
        show(calcG, wantCalc);
        cap.set(c.captionText(''));
      },
      state: () => ({ totalD: +totalD.toFixed(2), totalT: +totalT.toFixed(2), avg: +avg.toFixed(2), avgSpeed: +avg.toFixed(2) }),
    };
  };

  /* =====================================================================
   *  The registered diagram
   * ===================================================================== */
  const ARIA = {
    pitch: 'A pitcher throws a baseball to home plate. A ruler shows the ball position, an arrow shows its velocity, and a radar gun shows its speed.',
    windup: 'A pitcher whips his arm and the ball speeds up from zero. Dots show the ball gaps growing, which is positive acceleration.',
    catch: 'A baseball slows to a stop in the catcher mitt. Dots crowd together, which is negative acceleration.',
    hit: 'A pitch comes toward the batter and is hit straight back at the same speed. The velocity arrow flips direction.',
    bases: 'A runner goes around the bases at a steady speed. The speed stays the same but the velocity arrow turns at each base.',
    viewpoint: 'The same pitch seen from the catcher, from a fan in the stands, and from the ball itself.',
    steady: 'A runner jogs from home plate to first base at a steady speed. Dots with equal gaps show the same distance every second.',
    average: 'A runner sprints, waits on first, then steals second. A steady ghost runner at the average speed arrives at the same time.',
  };
  const PRESETS = {
    motion: 'The ball is in motion: its position keeps changing.',
    velocity: 'Radar gun: the speed. Arrow: the direction. Both together: velocity.',
  };

  D.register('baseball', function (root, params, opts) {
    const interactive = !!(opts && opts.interactive);
    const onChange = (opts && opts.onChange) || function () {};
    const P = Object.assign({ scenario: 'pitch', hide: [] }, params && typeof params === 'object' ? params : {});
    const NAMES = Object.keys(SCENES);

    let cfg = null, scene = null, gP = null, fades = [], clock = 0, dead = false, lastScenario = null, sync = [];
    const svg = mkSvg(root, 600, 350, ARIA.pitch);
    const ctrl = interactive ? mkControls(root) : null;

    function normSegs(v) {
      let segs = Array.isArray(v) ? v.slice(0, 6).map((s) => ({ d: num(s && s.d, 0, 0, 1e5), t: num(s && s.t, 1, 0.01, 1e5) })) : [];
      if (!segs.length || !segs.some((s) => s.d > 0)) segs = [{ d: 60, t: 4 }, { d: 0, t: 6 }, { d: 60, t: 5 }];
      return segs;
    }
    function norm() {
      const sc = typeof P.scenario === 'string' && Object.prototype.hasOwnProperty.call(SCENES, P.scenario) ? P.scenario : 'pitch';
      const mph = num(P.mph, 50, 5, 150);
      const pa = parseInt(P.pauseAt, 10);
      const cp = P.caption;
      return {
        scenario: sc, mph,
        mphBack: P.mphBack === undefined || P.mphBack === null || P.mphBack === '' ? mph : num(P.mphBack, mph, 5, 150),
        distanceFt: num(P.distanceFt, 46, 10, 120), baseFt: num(P.baseFt, 60, 20, 120), speedFt: num(P.speedFt, 15, 4, 40),
        showGhost: P.showGhost === undefined || P.showGhost === null ? sc === 'average' : !!P.showGhost,
        observer: OBS[P.observer] ? P.observer : 'catcher',
        pauseAt: pa >= 1 && pa <= 3 ? pa : null,
        segments: normSegs(P.segments), hide: hideSet(P),
        caption: cp === false || cp === 'none' ? '' : (cp === undefined || cp === null ? null : String(cp)),
      };
    }
    const artKey = (k) => JSON.stringify([k.scenario, k.distanceFt, k.baseFt, k.pauseAt, k.segments.map((s) => [s.d, s.t]),
      k.scenario === 'windup' || k.scenario === 'catch' ? k.mph : 0]);

    const hid = (key) => !!cfg && (cfg.hide.has(key) || (!!LABELISH[key] && cfg.hide.has('labels')));
    function fade(key, node) {
      if (!node || !node.parentNode) return;
      const w = S.el('g', { class: 'bb-fade' });
      node.parentNode.insertBefore(w, node);
      w.appendChild(node);
      const a = hid(key) ? 0 : 1;
      fades.push({ key, w, a, last: -1 });
    }
    function stepFades(dt, rm) {
      fades.forEach((f) => {
        const tgt = hid(f.key) ? 0 : 1;
        f.a = rm ? tgt : approach(f.a, tgt, dt / 0.4);
        if (f.a !== f.last) { f.last = f.a; op(f.w, f.a); show(f.w, f.a > 0.01); }
      });
    }
    function captionText(def) {
      const cp = cfg.caption;
      if (cp === '') return '';
      if (cp === null) return def || '';
      return PRESETS[cp] || cp;
    }

    function rebuild() {
      S.clear(svg);
      fades = [];
      gP = S.group(svg, 'bb-art');
      const pen = Pen(100 + NAMES.indexOf(cfg.scenario) * 13);
      const c = {
        svg, gP, pen, hid, fade, captionText,
        get cfg() { return cfg; },
        setH(h) { svg.setAttribute('viewBox', `0 0 600 ${h}`); },
      };
      scene = SCENES[cfg.scenario](c);
      svg.setAttribute('aria-label', ARIA[cfg.scenario]);
      stepFades(0, true);
      scene.draw(S.reduceMotion() ? scene.endU() : 0, 0);
    }

    function getState() {
      const st = { scenario: cfg.scenario, observer: cfg.observer, showGhost: cfg.showGhost, mph: +cfg.mph.toFixed(2) };
      return Object.assign(st, scene ? scene.state() : {});
    }

    function buildControls() {
      if (!ctrl) return;
      S.clear(ctrl);
      sync = [];
      const sc = cfg.scenario;
      const changed = () => { cfg = norm(); sync.forEach((f) => f()); onChange(getState()); };
      if (sc === 'viewpoint') {
        const tg = S.toggle(ctrl, {
          label: 'Watch from:', value: cfg.observer,
          options: [{ value: 'catcher', label: 'The catcher' }, { value: 'stands', label: 'A fan in the stands' }, { value: 'ball', label: 'Riding the ball' }],
          onChange(v) { P.observer = v; changed(); },
        });
        styleBtns(tg.el);
        sync.push(() => tg.setValue(cfg.observer));
      }
      if (sc === 'hit' || sc === 'bases' || sc === 'average') {
        const label = sc === 'hit' ? 'Show the ghost ball (what if the velocity did not change)'
          : sc === 'bases' ? 'Show the ghost runner (what if the velocity did not turn)' : 'Show the steady runner';
        const sw = mkSwitch(ctrl, label, cfg.showGhost, (v) => { P.showGhost = v; clock = 0; changed(); });
        sync.push(() => sw.setValue(cfg.showGhost));
      }
      if (sc === 'pitch' || sc === 'windup' || sc === 'catch') {
        const r = rangeOf(P, 'mph', [20, 80, 5]);
        const sl = compactSlider(ctrl, {
          label: sc === 'pitch' ? 'Pitch speed' : 'Top speed', min: r[0], max: r[1], step: r[2], value: clamp(cfg.mph, r[0], r[1]), unit: 'mph',
          onInput(v) { P.mph = v; clock = 0; if (sc !== 'pitch') { cfg = norm(); rebuild(); } changed(); },
        });
        sync.push(() => sl.setValue(clamp(cfg.mph, r[0], r[1])));
      }
      if (sc === 'steady' || sc === 'bases') {
        const r = rangeOf(P, 'speedFt', [6, 30, 1]);
        const sl = compactSlider(ctrl, {
          label: 'Runner speed', min: r[0], max: r[1], step: r[2], value: clamp(cfg.speedFt, r[0], r[1]), unit: 'ft/s',
          onInput(v) { P.speedFt = v; clock = 0; changed(); },
        });
        sync.push(() => sl.setValue(clamp(cfg.speedFt, r[0], r[1])));
      }
    }

    cfg = norm();
    rebuild();
    lastScenario = cfg.scenario;
    buildControls();

    const stop = S.animate((dt) => {
      if (dead) return false;
      clock += dt;
      const rm = S.reduceMotion();
      stepFades(dt, rm);
      const cyc = scene.cycle();
      scene.draw(rm ? scene.endU() : clock % cyc, dt);
    });

    return {
      getState,
      setParams(partial) {
        if (dead) return;
        const prev = cfg;
        if (partial && typeof partial === 'object') Object.assign(P, partial);
        cfg = norm();
        if (artKey(cfg) !== artKey(prev)) {
          rebuild(); clock = 0;
          if (cfg.scenario !== lastScenario) { lastScenario = cfg.scenario; buildControls(); }
        } else if (prev.mph !== cfg.mph || prev.mphBack !== cfg.mphBack || prev.speedFt !== cfg.speedFt || prev.showGhost !== cfg.showGhost) {
          clock = 0;
        }
        sync.forEach((f) => f());
      },
      destroy() { dead = true; stop(); S.clear(root); },
    };
  });
})();
