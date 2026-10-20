/* generators.js — parametric practice items for the mechanical skills, so six hours of practice never run dry.
 * FDPGen.make(skill, seed) -> an Item in the spec's shape (id "g:<skill>:<seed>", kind "short", answer, errors,
 * hint, 2–3 step walkthrough). Deterministic per seed. All values come from FDPMath's exact rationals, and every
 * item is cleaned so no error equals the answer (tools/validate.mjs checks 500 per skill).
 * Word problems are never generated: they stay hand-written in the bank.
 */
(function (root) {
  'use strict';
  const M = root.FDPMath || (typeof require === 'function' ? require('./math.js') : null);
  const { rat, add, sub, mul, div, eq, toDec, toFrac, toMixed, isInt } = M;

  function rng(seed) {
    let a = (seed >>> 0) || 1;
    return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const gcdN = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const lcmN = (a, b) => a / gcdN(a, b) * b;

  /* ---------- value -> strings ---------- */
  const vstr = (r) => { const d = toDec(r, 12); return d !== null ? d : toFrac(r); };     // value strings for answers/errors
  const fracMk = (r) => (isInt(r) ? r.n.toString() : (r.n < 0n ? -r.n : r.n) > r.d ? '[[m:' + toMixed(r) + ']]' : '[[f:' + toFrac(r) + ']]');
  const decMk = (r) => { const d = toDec(r, 12); return d === null ? fracMk(r) : d.indexOf('(') >= 0 ? '[[r:' + d + ']]' : M.withCommas(d); };
  const pctStr = (r) => decMk(r) + '%';      // r is the percent NUMBER

  function ask(prompt, answer, hint, reveal, errors) { const a = { prompt, answer, hint, reveal }; if (errors && errors.length) a.errors = errors; return a; }
  const num = (value, form, extra) => Object.assign({ type: 'num', value, form }, extra || {});

  /** Drop errors that equal the answer (in the answer's own space) or repeat. */
  function cleanErrors(answer, errors) {
    if (!errors) return [];
    if (answer.type !== 'num') return errors.filter((e, i) => errors.findIndex((x) => JSON.stringify(x.choice !== undefined ? x.choice : x.order) === JSON.stringify(e.choice !== undefined ? e.choice : e.order)) === i && (e.choice === undefined || e.choice !== answer.correct));
    const A = M.parseValue(answer.value);
    const seen = [];
    return errors.filter((e) => {
      let V;
      try { V = M.parseValue(e.value); } catch (err) { return false; }
      if (eq(V, A) || seen.some((x) => eq(x, V))) return false;
      seen.push(V);
      return true;
    });
  }
  function finish(skill, seed, level, prompt, answer, errors, hint, steps, figure) {
    const it = { id: 'g:' + skill + ':' + seed, skill, kind: 'short', level, generated: true, prompt, answer, errors: cleanErrors(answer, errors), hint, steps };
    if (figure) it.figure = figure;
    it.steps.forEach((st) => { if (st.ask) st.ask.errors = cleanErrors(st.ask.answer, st.ask.errors); if (st.ask && !st.ask.errors.length) delete st.ask.errors; });
    return it;
  }

  /* ================= generators ================= */
  const G = {};

  // percent <-> decimal
  G['pct-dec'] = (r, seed) => {
    const pick = (a) => a[Math.floor(r() * a.length)];
    const kind = pick(['int', 'dec', 'big', 'small', 'mixed', 'tod', 'tod']);
    if (kind === 'tod') {
      // decimal -> percent
      const d = pick([rat(35, 100), rat(7, 100), rat(125, 100), rat(4, 1000), rat(625, 1000), rat(18, 10), rat(9, 1000), rat(2, 10), rat(1375, 10000), rat(3, 2), rat(45, 1000)].concat([rat(1 + Math.floor(r() * 99), 100), rat(1 + Math.floor(r() * 999), 1000)]));
      const p = mul(d, rat(100));
      const ans = num(vstr(p), 'percent');
      return finish('pct-dec', seed, 1, 'Write ' + decMk(d) + ' as a percent.', ans, [
        { value: vstr(mul(d, rat(10))), misconception: 'pct-shift-one-place', feedback: 'That moved the point one place. Percent means out of 100: move it two places right.' },
        { value: vstr(div(d, rat(100))), misconception: 'pct-shift-wrong-way', feedback: 'That moved the point left. Decimal to percent multiplies by 100, so the point hops two places right.' },
        { value: vstr(d), misconception: 'pct-small-as-whole', feedback: 'You put a % sign on the decimal without changing it. ' + decMk(d) + ' is ' + decMk(p) + ' out of 100.' },
      ], 'Decimal to percent: multiply by 100. The point hops two places right.', [
        { say: 'To turn a decimal into a percent, multiply by 100.', figure: { type: 'shift', number: vstr(d), places: 2, note: '× 100' },
          ask: ask('How many places does the point hop to the right?', num('2', 'number'), 'Count the zeros in 100.', '100 has two zeros, so two places.', [{ value: '1', feedback: 'One hop is × 10. We need × 100.' }]) },
        { say: 'Now write it with a % sign.', ask: ask(decMk(d) + ' = ? %', num(vstr(p), 'percent'), 'Move the point two places right, then add %.', decMk(d) + ' &times; 100 = ' + decMk(p) + ', so it is ' + pctStr(p) + '.') },
      ]);
    }
    let p, label;
    if (kind === 'int') { p = rat(1 + Math.floor(r() * 99)); label = pctStr(p); }
    else if (kind === 'dec') { p = rat(Math.floor(r() * 300) + 1, 10); if (isInt(p)) p = add(p, rat(1, 4)); label = pctStr(p); }
    else if (kind === 'big') { p = rat(pick([110, 125, 140, 150, 175, 200, 250, 112.5 * 2]) * (r() < 0.5 ? 1 : 1), 1); label = pctStr(p); }
    else if (kind === 'small') { p = pick([rat(2, 5), rat(1, 4), rat(3, 4), rat(1, 2), rat(3, 10), rat(1, 8), rat(7, 10)]); label = (r() < 0.5 ? fracMk(p) : decMk(p)) + '%'; }
    else { p = add(rat(1 + Math.floor(r() * 15)), pick([rat(1, 4), rat(1, 2), rat(3, 4), rat(1, 5), rat(2, 5), rat(1, 8)])); label = fracMk(p) + '%'; }
    const d = div(p, rat(100));
    const errs = [
      { value: vstr(div(p, rat(10))), misconception: 'pct-shift-one-place', feedback: 'That moved the point one place. Percent means per hundred: two places left.' },
      { value: vstr(mul(p, rat(100))), misconception: 'pct-shift-wrong-way', feedback: 'That went the wrong way. Percent to decimal divides by 100, so the point hops LEFT.' },
    ];
    if (kind === 'small') errs.push({ value: vstr(p), misconception: 'pct-small-as-whole', feedback: label + ' is less than 1%. The % still means divide by 100: ' + decMk(p) + ' &divide; 100.' });
    if (kind === 'mixed') {
      const w = Number(M.floorR(p)), fr = sub(p, rat(w));
      errs.push({ value: vstr(div(add(rat(w), rat(Number(fr.n), 10)), rat(100))), misconception: 'frac-part-as-decimal', feedback: fracMk(fr) + ' is not .' + fr.n + '. Change the fraction part to a decimal first: ' + fracMk(fr) + ' = ' + decMk(fr) + '.' });
    }
    const steps = [];
    if (kind === 'mixed' || kind === 'small') {
      steps.push({ say: 'First make the percent number a decimal.', ask: ask('Write ' + fracMk(p) + ' as a decimal number.', num(vstr(p), 'decimal'), 'Divide the top of the fraction part by the bottom.', fracMk(p) + ' = ' + decMk(p) + '.') });
    }
    steps.push({ say: 'Percent means out of 100, so divide by 100: the point hops two places left.', figure: { type: 'shift', number: vstr(p), places: -2, note: '÷ 100' },
      ask: ask(label + ' = ' + decMk(p) + '% = ? as a decimal', num(vstr(d), 'decimal'), 'Two hops left. Fill empty places with zeros.', decMk(p) + ' &divide; 100 = ' + decMk(d) + '.') });
    return finish('pct-dec', seed, kind === 'int' ? 1 : kind === 'mixed' || kind === 'small' ? 3 : 2, 'Write ' + label + ' as a decimal.', num(vstr(d), 'decimal'), errs,
      'Percent means out of 100. Divide by 100.', steps);
  };

  // fraction <-> decimal
  G['frac-dec'] = (r, seed) => {
    const pick = (a) => a[Math.floor(r() * a.length)];
    if (r() < 0.6) {
      const dd = pick([2, 4, 5, 8, 10, 20, 25, 40, 3, 6, 9, 11, 12, 15]);
      let nn = 1 + Math.floor(r() * (dd - 1));
      while (gcdN(nn, dd) !== 1) nn = 1 + Math.floor(r() * (dd - 1));
      const big = r() < 0.25;
      const whole = big ? 1 + Math.floor(r() * 6) : 0;
      const F = add(rat(whole), rat(nn, dd));
      const rep = !M.terminates(F);
      const errs = [{ value: nn + '.' + dd, misconception: 'bar-as-point', feedback: 'The fraction bar is not a decimal point. [[f:' + nn + '/' + dd + ']] means ' + nn + ' &divide; ' + dd + '.' }];
      if (M.terminates(rat(dd, nn))) errs.push({ value: vstr(add(rat(whole), rat(dd, nn))), misconception: 'bar-as-point', feedback: 'That is ' + dd + ' &divide; ' + nn + '. Divide the top by the bottom: ' + nn + ' &divide; ' + dd + '.' });
      if (rep) {
        errs.push({ value: M.toFixed(F, 2), misconception: 'repeating-truncate', feedback: 'Close, but it does not stop. Use the repeat bar on the digits that repeat.' });
        errs.push({ value: M.toFixed(F, 1), misconception: 'repeating-truncate', feedback: 'That stops too soon. The digits repeat forever: show it with the repeat bar.' });
        const ds = toDec(F, 12);
        const m = /^(-?\d+)\.(\d*)\((\d+)\)$/.exec(ds);
        if (m && m[2]) errs.push({ value: m[1] + '.(' + m[2] + m[3] + ')', misconception: 'bar-placement', feedback: 'Only the digits that keep repeating go under the bar.' });
      }
      return finish('frac-dec', seed, rep ? 2 : 1, 'Write ' + fracMk(F) + ' as a decimal.' + (rep ? ' Use the repeat bar if it repeats.' : ''), num(vstr(F), 'decimal'), errs,
        'A fraction bar means divide: top &divide; bottom.', [
          { say: 'A fraction bar means divide.', ask: ask('Which division gives ' + fracMk(rat(nn, dd)) + ' as a decimal?', { type: 'choice', choices: [nn + ' &divide; ' + dd, dd + ' &divide; ' + nn], correct: 0 }, 'Top goes inside the division.', 'Top &divide; bottom: ' + nn + ' &divide; ' + dd + '.', [{ choice: 1, misconception: 'bar-as-point', feedback: 'That divides the bottom by the top. It is top &divide; bottom.' }]) },
          { say: 'Do the division.' + (rep ? ' Watch for a remainder that comes back.' : ''), figure: { type: 'longdiv', dividend: nn, divisor: dd, digits: rep ? 4 : Math.min(4, String(toDec(rat(nn, dd))).length - 2) },
            ask: ask('So ' + fracMk(F) + ' = ?', num(vstr(F), 'decimal'), rep ? 'When a remainder repeats, the digits repeat. Use the repeat key.' : 'Keep dividing until the remainder is 0.', fracMk(F) + ' = ' + decMk(F) + '.') },
        ]);
    }
    // terminating decimal -> simplest fraction
    const dd = pick([4, 5, 8, 20, 25, 40, 50, 125, 200, 250, 400, 16]);
    let nn = 1 + Math.floor(r() * (dd - 1));
    while (gcdN(nn, dd) !== 1) nn = 1 + Math.floor(r() * (dd - 1));
    const F = rat(nn, dd);
    const ds = toDec(F);
    const places = ds.split('.')[1].length;
    const p10 = Math.pow(10, places);
    const digits = Math.round(M.toNumber(F) * p10);
    return finish('frac-dec', seed, places >= 3 ? 2 : 1, 'Write ' + ds + ' as a fraction in simplest form.', num(toFrac(F), 'fraction'), [
      { value: digits + '/' + (p10 / 10), misconception: 'placeholder-zero', feedback: 'Count the places: ' + ds + ' has ' + places + ' digits after the point, so it is over ' + p10.toLocaleString('en-US') + '.' },
      { value: digits + '/' + (p10 * 10), misconception: 'placeholder-zero', feedback: 'Count the places again: ' + places + ' digits after the point means over ' + p10.toLocaleString('en-US') + '.' },
    ], 'Read the decimal with its place value, then simplify with the GCF.', [
      { say: 'Read it by place value. The last digit is in the ' + ['tenths', 'hundredths', 'thousandths', 'ten-thousandths'][places - 1] + ' place.', figure: { type: 'placevalue', numbers: [ds] },
        ask: ask(ds + ' = ? / ' + p10.toLocaleString('en-US'), num(String(digits), 'number'), 'Write the digits after the point as a whole number.', ds + ' = ' + digits + '/' + p10.toLocaleString('en-US') + '.') },
      { say: 'Now simplify: divide the top and bottom by their GCF, ' + gcdN(digits, p10) + '.', ask: ask('[[f:' + digits + '/' + p10 + ']] in simplest form = ?', num(toFrac(F), 'fraction'), 'Divide top and bottom by ' + gcdN(digits, p10) + '.', digits + ' &divide; ' + gcdN(digits, p10) + ' = ' + nn + ' and ' + p10 + ' &divide; ' + gcdN(digits, p10) + ' = ' + dd + ', so [[f:' + nn + '/' + dd + ']].') },
    ]);
  };

  // percent <-> fraction
  G['pct-frac'] = (r, seed) => {
    const pick = (a) => a[Math.floor(r() * a.length)];
    if (r() < 0.5) {
      const p = pick([rat(33, 4), rat(2, 5), rat(25, 2), rat(35), rat(140), rat(4, 1), rat(75), rat(15, 2), rat(1, 4), rat(60), rat(125), rat(5), rat(45), rat(37, 2), rat(150)]);
      const F = div(p, rat(100));
      const label = (isInt(p) ? p.n.toString() : r() < 0.5 ? fracMk(p) : decMk(p)) + '%';
      const errs = [
        { value: vstr(div(p, rat(10))), misconception: 'pct-shift-one-place', feedback: 'That is over 10. Percent means over 100.' },
        { value: toFrac(p), misconception: 'pct-small-as-whole', feedback: 'You dropped the %. ' + label + ' means ' + decMk(p) + ' out of 100.' },
      ];
      return finish('pct-frac', seed, isInt(p) ? 1 : 2, 'Write ' + label + ' as a fraction in simplest form.', num(toFrac(F), 'fraction'), errs,
        'Percent means over 100. Write it over 100, then simplify.', [
          { say: 'Percent means out of 100: divide by 100.', ask: ask('Write ' + label + ' as a decimal first.', num(vstr(F), 'decimal'), 'Move the point two places left.', label + ' = ' + decMk(F) + '.') },
          { say: 'Now read the decimal as a fraction and simplify.', ask: ask(decMk(F) + ' as a fraction in simplest form = ?', num(toFrac(F), 'fraction'), 'Use the place value of the last digit, then divide by the GCF.', decMk(F) + ' = ' + fracMk(F) + '.') },
        ]);
    }
    const F = pick([rat(7, 9), rat(1, 3), rat(2, 3), rat(1, 6), rat(5, 8), rat(3, 8), rat(7, 5), rat(9, 4), rat(1, 8), rat(5, 6), rat(4, 9), rat(3, 20), rat(11, 25), rat(1, 12)]);
    const p = mul(F, rat(100));
    const errs = [{ value: vstr(F), misconception: 'pct-small-as-whole', feedback: 'That is the decimal. Multiply by 100 to make it a percent.' }];
    if (!M.terminates(p)) errs.push({ value: M.toFixed(p, 1), misconception: 'repeating-truncate', feedback: 'That stops. ' + fracMk(F) + ' as a percent repeats: use the repeat bar or a fraction, like ' + fracMk(p) + '%.' });
    return finish('pct-frac', seed, M.terminates(p) ? 1 : 2, 'Write ' + fracMk(F) + ' as a percent.', num(vstr(p), 'percent'), errs,
      'Make it a decimal (top &divide; bottom), then multiply by 100.', [
        { say: 'First the decimal: top &divide; bottom.', ask: ask(fracMk(F) + ' = ? as a decimal', num(vstr(F), 'decimal'), 'Divide; use the repeat bar if it repeats.', fracMk(F) + ' = ' + decMk(F) + '.') },
        { say: 'Then times 100: the point hops two places right.', ask: ask('So ' + fracMk(F) + ' = ? %', num(vstr(p), 'percent'), 'Two hops right, then %.', decMk(F) + ' &times; 100 = ' + pctStr(p) + '.') },
      ], { type: 'fdp', f: toFrac(F), d: vstr(F), p: vstr(p) + '%', focus: 'p' });
  };

  // repeating decimals: bar notation, kinds, ninths
  G['repeating'] = (r, seed) => {
    const pick = (a) => a[Math.floor(r() * a.length)];
    const t = r();
    if (t < 0.4) {
      const k = pick([
        ['0.35', 0], ['0.141414…', 1], ['[[f:3/14]]', 1], ['0.087621134…', 2], ['[[f:7/9]]', 1], ['[[f:3/8]]', 0], ['0.1010010001…', 2], ['[[f:5/12]]', 1], ['2.75', 0], ['[[f:9/20]]', 0], ['3.14159265…', 2], ['0.272727…', 1],
      ]);
      const choices = ['terminating', 'repeating', 'non-terminating, non-repeating'];
      const fb = ['A terminating decimal stops. Does this one stop?', 'A repeating decimal has a block of digits that repeats forever. Is there a block here?', 'Non-terminating, non-repeating never stops and never settles into a pattern.'];
      const errs = [0, 1, 2].filter((i) => i !== k[1]).map((i) => ({ choice: i, misconception: 'decimal-kind', feedback: fb[i] }));
      return finish('repeating', seed, 2, 'What kind of decimal is ' + k[0] + '?', { type: 'choice', choices, correct: k[1] }, errs,
        'For a fraction in simplest form: if the bottom has only 2s and 5s as prime factors, it terminates; otherwise it repeats.', [
          { say: 'Three kinds: it stops (terminating), a block repeats forever (repeating), or it never stops and never repeats.', ask: ask('Which kind is ' + k[0] + '?', { type: 'choice', choices, correct: k[1] }, 'A fraction always stops or repeats. Only a decimal with no pattern can be the third kind.', k[0] + ' is ' + choices[k[1]] + '.', errs) },
        ]);
    }
    if (t < 0.8) {
      const F = pick([rat(1, 3), rat(2, 3), rat(1, 6), rat(5, 6), rat(1, 9), rat(4, 9), rat(7, 9), rat(1, 11), rat(5, 11), rat(1, 12), rat(7, 12), rat(2, 15), rat(1, 18), rat(5, 18), rat(4, 33), rat(7, 3), rat(13, 6)]);
      const ds = toDec(F);
      const m = /^(-?\d+)\.(\d*)\((\d+)\)$/.exec(ds);
      const errs = [
        { value: M.toFixed(F, 2), misconception: 'repeating-truncate', feedback: 'That stops after two digits. The real decimal keeps going: put the repeating digits under the bar.' },
        { value: M.toFixed(F, 1), misconception: 'repeating-truncate', feedback: 'That stops. The digits keep repeating forever.' },
      ];
      if (m && m[2]) errs.push({ value: m[1] + '.(' + m[2] + m[3] + ')', misconception: 'bar-placement', feedback: 'The bar goes only over the digits that repeat. ' + m[2] + ' shows up once.' });
      if (m && m[3].length === 1 && !m[2]) errs.push({ value: m[1] + '.(' + m[3] + m[3] + ')', feedback: 'Same value, but write the shortest repeating block: one digit under the bar.' });
      return finish('repeating', seed, 2, 'Write ' + fracMk(F) + ' as a decimal. Use the repeat bar.', num(ds, 'decimal'), errs,
        'Divide. When a remainder comes back, the digits repeat from there.', [
          { say: 'Divide and watch the remainders.', figure: { type: 'longdiv', dividend: Number(F.n), divisor: Number(F.d), digits: 4 },
            ask: ask('Which digit(s) repeat forever?', num(m ? m[3] : '0', 'number'), 'Look at the quotient after the remainder repeats.', 'The repeating block is ' + (m ? m[3] : '') + '.') },
          { say: 'Only those digits go under the bar.', ask: ask(fracMk(F) + ' = ?', num(ds, 'decimal'), 'Type the digits, press the repeat key, then the repeating digits.', fracMk(F) + ' = ' + decMk(F) + '.') },
        ]);
    }
    // ninths and ninety-ninths: repeating decimal -> fraction
    const two = r() < 0.4;
    const n = two ? 10 + Math.floor(r() * 89) : 1 + Math.floor(r() * 8);
    const F = rat(n, two ? 99 : 9);
    const shown = two ? '0.(' + String(n).padStart(2, '0') + ')' : '0.(' + n + ')';
    return finish('repeating', seed, 3, 'Write [[r:' + shown + ']] as a fraction in simplest form.', num(toFrac(F), 'fraction'), [
      { value: n + '/' + (two ? 100 : 10), misconception: 'repeating-truncate', feedback: 'That is ' + (two ? '0.' + String(n).padStart(2, '0') : '0.' + n) + ' exactly, which stops. A repeating block goes over ' + (two ? '99' : '9') + '.' },
    ], 'One repeating digit goes over 9; two repeating digits go over 99.', [
      { say: 'The ninths pattern: [[f:1/9]] = [[r:0.(1)]], [[f:2/9]] = [[r:0.(2)]], and so on. Two-digit blocks go over 99: [[f:1/99]] = [[r:0.(01)]].',
        ask: ask('[[r:' + shown + ']] = ? (any equivalent fraction)', num(toFrac(F), 'fraction-any'), 'Put the repeating block over ' + (two ? '99' : '9') + '.', '[[r:' + shown + ']] = [[f:' + n + '/' + (two ? 99 : 9) + ']].') },
      { say: 'Simplify if you can.', ask: ask('In simplest form = ?', num(toFrac(F), 'fraction'), 'Divide top and bottom by their GCF.', 'Simplest form: ' + fracMk(F) + '.') },
    ]);
  };

  // compare across forms
  G['compare-mixed'] = (r, seed) => {
    const pick = (a) => a[Math.floor(r() * a.length)];
    const pool = [rat(1, 2), rat(3, 8), rat(2, 5), rat(4, 9), rat(5, 8), rat(2, 3), rat(3, 4), rat(7, 9), rat(1, 3), rat(9, 20), rat(11, 25), rat(5, 12)];
    const asForm = (v, f) => (f === 'f' ? fracMk(v) : f === 'd' ? decMk(v) : pctStr(mul(v, rat(100))));
    if (r() < 0.5) {
      const a = pick(pool), b = r() < 0.15 ? a : pick(pool.filter((x) => !eq(x, a)));
      const fa = pick(['f', 'd', 'p']), fb = pick(['f', 'd', 'p'].filter((x) => x !== fa));
      const c = M.cmp(a, b);
      const correct = c > 0 ? 0 : c < 0 ? 1 : 2;
      const errs = [0, 1, 2].filter((i) => i !== correct).map((i) => ({ choice: i, feedback: 'Turn both into decimals first, then compare place by place.' }));
      return finish('compare-mixed', seed, 2, 'Compare: ' + asForm(a, fa) + ' &nbsp;?&nbsp; ' + asForm(b, fb), { type: 'choice', choices: ['&gt;', '&lt;', '='], correct }, errs,
        'Change both to decimals (or both to percents), then compare.', [
          { say: 'Put them in the same form. Decimals are easiest.', ask: ask(asForm(a, fa) + ' as a decimal = ?', num(vstr(a), 'decimal'), fa === 'p' ? 'Divide by 100.' : 'Top &divide; bottom.', asForm(a, fa) + ' = ' + decMk(a) + '.') },
          { ask: ask(asForm(b, fb) + ' as a decimal = ?', num(vstr(b), 'decimal'), fb === 'p' ? 'Divide by 100.' : 'Top &divide; bottom.', asForm(b, fb) + ' = ' + decMk(b) + '.') },
          { say: 'Now compare the decimals place by place.', ask: ask(asForm(a, fa) + ' ? ' + asForm(b, fb), { type: 'choice', choices: ['&gt;', '&lt;', '='], correct }, 'Line up the points.', decMk(a) + (correct === 0 ? ' &gt; ' : correct === 1 ? ' &lt; ' : ' = ') + decMk(b) + '.') },
        ]);
    }
    const vals = shuffleR(r, pool).slice(0, 3);
    const forms = shuffleR(r, ['f', 'd', 'p']);
    const items = vals.map((v, i) => asForm(v, forms[i]));
    const correct = [0, 1, 2].sort((x, y) => M.cmp(vals[x], vals[y]));
    const byLen = [0, 1, 2].sort((x, y) => K_len(items[x]) - K_len(items[y]) || x - y);
    const errs = JSON.stringify(byLen) !== JSON.stringify(correct) ? [{ order: byLen, misconception: 'longer-larger', feedback: 'Do not judge by how long the number looks. Change them all to decimals first.' }] : [];
    return finish('compare-mixed', seed, 2, 'Put these in order from least to greatest.', { type: 'order', items, correct }, errs,
      'Change all three to decimals, then compare.', [
        { say: 'Make them all decimals.', ask: ask(items[0] + ' as a decimal = ?', num(vstr(vals[0]), 'decimal'), 'Convert.', items[0] + ' = ' + decMk(vals[0]) + '.') },
        { ask: ask(items[1] + ' as a decimal = ?', num(vstr(vals[1]), 'decimal'), 'Convert.', items[1] + ' = ' + decMk(vals[1]) + '.') },
        { ask: ask(items[2] + ' as a decimal = ?', num(vstr(vals[2]), 'decimal'), 'Convert.', items[2] + ' = ' + decMk(vals[2]) + '.') },
      ]);
  };
  const K_len = (s) => String(s).replace(/<[^>]+>|\[\[|\]\]|[a-z]:/g, '').length;
  function shuffleR(r, a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // comparing decimals by place value
  G['place-value'] = (r, seed) => {
    const pick = (a) => a[Math.floor(r() * a.length)];
    const traps = [
      () => { const w = 1 + Math.floor(r() * 20), d = 1 + Math.floor(r() * 9); return [w + '.0' + d, w + '.' + d + '0', 'placeholder-zero']; },
      () => { const a = 1 + Math.floor(r() * 8), b = Math.max(10 * a - 1 - Math.floor(r() * 5), 10); return ['0.' + a, '0.' + (b < 100 ? b : 99), 'longer-larger']; },
      () => { const a = 2 + Math.floor(r() * 7); return ['0.' + a, '0.' + (a - 1) + '9' + (r() < 0.5 ? '9' : ''), 'longer-larger']; },
      () => { const a = 1 + Math.floor(r() * 4); const b = (a + 1) * 10 + 1 + Math.floor(r() * 8); return ['0.' + a, '0.' + b, 'shorter-larger']; },
    ];
    let [x, y, mis] = pick(traps)();
    if (r() < 0.5) [x, y] = [y, x];
    const c = M.cmp(M.parseValue(x), M.parseValue(y));
    const correct = c > 0 ? 0 : c < 0 ? 1 : 2;
    const errs = [0, 1, 2].filter((i) => i !== correct).map((i) => ({ choice: i, misconception: i === 2 ? 'placeholder-zero' : mis, feedback: i === 2 ? 'They are not equal: line up the points and look at each place.' : mis === 'longer-larger' ? 'More digits does not mean bigger. Compare the tenths first.' : mis === 'shorter-larger' ? 'Compare place by place, starting with the tenths.' : 'Zeros hold places. Compare the tenths first.' }));
    return finish('place-value', seed, 1, 'Compare: ' + x + ' &nbsp;?&nbsp; ' + y, { type: 'choice', choices: ['&gt;', '&lt;', '='], correct }, errs,
      'Line up the decimal points and compare from the left, one place at a time.', [
        { say: 'Line up the points. Compare from the left; the first place that differs decides.', figure: { type: 'placevalue', numbers: [x, y] },
          ask: ask(x + ' ? ' + y, { type: 'choice', choices: ['&gt;', '&lt;', '='], correct }, 'Find the highlighted column.', x + (correct === 0 ? ' &gt; ' : correct === 1 ? ' &lt; ' : ' = ') + y + '.', errs) },
      ]);
  };

  // GCF and LCM
  G['gcf-lcm'] = (r, seed) => {
    const t = r();
    if (t < 0.35) {
      const g = [2, 3, 4, 5, 6, 8, 9, 12][Math.floor(r() * 8)];
      let a = g * (1 + Math.floor(r() * 8)), b = g * (1 + Math.floor(r() * 8));
      if (a === b) b += g;
      const G0 = gcdN(a, b), L0 = lcmN(a, b);
      return finish('gcf-lcm', seed, 1, 'Find the GCF of ' + a + ' and ' + b + '.', num(String(G0), 'number'), [
        { value: String(L0), misconception: 'gcf-lcm-swap', feedback: 'That is the LCM (the smallest number both go into). The GCF is the biggest number that goes into both.' },
        { value: String(Math.min(a, b) === G0 ? 1 : 1), feedback: 'Every pair shares 1, but look for a bigger common factor.' },
      ], 'List the factors of the smaller number. Which is the biggest that also divides the other?', [
        { say: 'GCF = greatest common factor: the biggest number that divides both.', ask: ask('Does ' + G0 + ' divide both ' + a + ' and ' + b + '?', { type: 'choice', choices: ['yes', 'no'], correct: 0 }, 'Divide each by ' + G0 + '.', a + ' &divide; ' + G0 + ' = ' + a / G0 + ' and ' + b + ' &divide; ' + G0 + ' = ' + b / G0 + ', so yes.') },
        { say: a / G0 + ' and ' + b / G0 + ' share no factor except 1, so nothing bigger works.', ask: ask('GCF of ' + a + ' and ' + b + ' = ?', num(String(G0), 'number'), 'It is the number we just checked.', 'The GCF is ' + G0 + '.', [{ value: String(L0), misconception: 'gcf-lcm-swap', feedback: 'That is the LCM.' }]) },
      ]);
    }
    if (t < 0.7) {
      const pairs = [[4, 6], [6, 8], [8, 12], [6, 9], [10, 15], [4, 10], [12, 18], [9, 12], [6, 10], [8, 10], [5, 6], [3, 8], [12, 16], [14, 21]];
      const [a, b] = pairs[Math.floor(r() * pairs.length)];
      const G0 = gcdN(a, b), L0 = lcmN(a, b);
      return finish('gcf-lcm', seed, 1, 'Find the LCM of ' + a + ' and ' + b + '.', num(String(L0), 'number'), [
        { value: String(G0), misconception: 'gcf-lcm-swap', feedback: 'That is the GCF. The LCM is the smallest number that both ' + a + ' and ' + b + ' go into.' },
        ...(a * b !== L0 ? [{ value: String(a * b), feedback: a * b + ' works, but it is not the LEAST. Look for a smaller common multiple.' }] : []),
      ], 'List multiples of the bigger number until one is also a multiple of the smaller.', [
        { say: 'LCM = least common multiple: the smallest number both go into. Count by ' + Math.max(a, b) + 's.', ask: ask('Multiples of ' + Math.max(a, b) + ': ' + Math.max(a, b) + ', ' + 2 * Math.max(a, b) + ', ' + 3 * Math.max(a, b) + ', … Which is the first that ' + Math.min(a, b) + ' also goes into?', num(String(L0), 'number'), 'Check each multiple: does ' + Math.min(a, b) + ' divide it evenly?', 'The first one is ' + L0 + '.', [{ value: String(G0), misconception: 'gcf-lcm-swap', feedback: 'That is the GCF, not a multiple.' }]) },
      ]);
    }
    const g = [2, 3, 4, 5, 6, 8, 12][Math.floor(r() * 7)];
    let n = 1 + Math.floor(r() * 9), d = n + 1 + Math.floor(r() * 9);
    while (gcdN(n, d) !== 1) d++;
    const N = n * g, Dd = d * g;
    const half = gcdN(N, Dd) > 2 && g % 2 === 0 ? 2 : null;
    return finish('gcf-lcm', seed, 1, 'Simplify [[f:' + N + '/' + Dd + ']] using the GCF.', num(n + '/' + d, 'fraction'), half ? [] : [], 'Find the GCF of the top and bottom, then divide both by it.', [
      { say: 'Simplest form in one step: divide by the GCF.', ask: ask('GCF of ' + N + ' and ' + Dd + ' = ?', num(String(g), 'number'), 'The biggest number that divides both.', 'The GCF is ' + g + '.', [{ value: String(lcmN(N, Dd)), misconception: 'gcf-lcm-swap', feedback: 'That is the LCM. We need the GCF to simplify.' }]) },
      { ask: ask('[[f:' + N + '/' + Dd + ']] = ?', num(n + '/' + d, 'fraction'), 'Divide top and bottom by ' + g + '.', N + ' &divide; ' + g + ' = ' + n + ', ' + Dd + ' &divide; ' + g + ' = ' + d + '.') },
    ]);
  };

  // add / subtract fractions and mixed numbers
  G['frac-addsub'] = (r, seed) => {
    const pick = (a) => a[Math.floor(r() * a.length)];
    if (r() < 0.6) {
      const dens = [2, 3, 4, 5, 6, 8, 10, 12];
      const b = pick(dens); let d = pick(dens); if (d === b) d = b === 12 ? 8 : b * 2 > 12 ? 3 : b * 2;
      const a = 1 + Math.floor(r() * (b - 1)), c = 1 + Math.floor(r() * (d - 1));
      const plus = r() < 0.6 || M.cmp(rat(a, b), rat(c, d)) <= 0 ? true : false;
      const A = rat(a, b), Cc = rat(c, d);
      const ans = plus ? add(A, Cc) : sub(A, Cc);
      const L = lcmN(b, d);
      const errs = [{ value: toFrac(rat(plus ? a + c : Math.abs(a - c), plus ? b + d : Math.abs(b - d) || 1)), misconception: 'add-denominators', feedback: 'You ' + (plus ? 'added' : 'subtracted') + ' the bottoms too. The bottom names the size of the pieces: make the pieces the same size first, then ' + (plus ? 'add' : 'subtract') + ' only the tops.' }];
      return finish('frac-addsub', seed, 1, '[[f:' + a + '/' + b + ']] ' + (plus ? '+' : '−') + ' [[f:' + c + '/' + d + ']] = ? (simplest form)', num(toFrac(ans), 'fraction'), errs,
        'Find a common denominator (the LCM of the bottoms), rename both fractions, then ' + (plus ? 'add' : 'subtract') + ' the tops.', [
          { say: 'Pieces must be the same size. Use the LCM of ' + b + ' and ' + d + ' as the new bottom.', figure: { type: 'fracbar', rows: [{ parts: b, shaded: a, label: '[[f:' + a + '/' + b + ']]' }, { parts: d, shaded: c, label: '[[f:' + c + '/' + d + ']]' }, { parts: L, shaded: 0, label: L + 'ths' }] },
            ask: ask('LCM of ' + b + ' and ' + d + ' = ?', num(String(L), 'number'), 'Smallest number both go into.', 'The LCM is ' + L + '.', [{ value: String(gcdN(b, d)), misconception: 'gcf-lcm-swap', feedback: 'That is the GCF. We need a number both bottoms go INTO.' }]) },
          { say: 'Rename: [[f:' + a + '/' + b + ']] = [[f:' + a * L / b + '/' + L + ']] and [[f:' + c + '/' + d + ']] = [[f:' + c * L / d + '/' + L + ']].',
            ask: ask('[[f:' + a * L / b + '/' + L + ']] ' + (plus ? '+' : '−') + ' [[f:' + c * L / d + '/' + L + ']] = ? (simplest form)', num(toFrac(ans), 'fraction'), (plus ? 'Add' : 'Subtract') + ' the tops, keep the bottom, then simplify.', 'The answer is ' + fracMk(ans) + '.', errs) },
        ]);
    }
    // mixed-number subtraction with regrouping
    const d = pick([3, 4, 5, 6, 8]);
    const f1 = 1 + Math.floor(r() * (d - 2)), f2 = f1 + 1 + Math.floor(r() * (d - 1 - f1));
    const w1 = 3 + Math.floor(r() * 6), w2 = 1 + Math.floor(r() * (w1 - 2));
    const A = add(rat(w1), rat(f1, d)), B = add(rat(w2), rat(f2, d));
    const ans = sub(A, B);
    const wrong = add(rat(w1 - w2), rat(f2 - f1, d));
    return finish('frac-addsub', seed, 2, '[[m:' + w1 + ' ' + f1 + '/' + d + ']] − [[m:' + w2 + ' ' + f2 + '/' + d + ']] = ?', num(toFrac(ans), 'fraction'), [
      { value: toFrac(wrong), misconception: 'regroup-mixed', feedback: 'You did ' + f2 + '/' + d + ' − ' + f1 + '/' + d + ' (bigger minus smaller). You cannot take ' + f2 + '/' + d + ' from ' + f1 + '/' + d + ': borrow 1 whole first.' },
    ], 'You cannot take ' + f2 + '/' + d + ' from ' + f1 + '/' + d + '. Borrow 1 from the ' + w1 + '.', [
      { say: 'The fraction part on top is too small, so borrow 1 whole: 1 = [[f:' + d + '/' + d + ']].', figure: { type: 'numberline', min: w2, max: w1 + 1, ticks: (w1 + 1 - w2) * d > 40 ? (w1 + 1 - w2) : (w1 + 1 - w2) * d, marks: [{ at: toFrac(B), label: '[[m:' + w2 + ' ' + f2 + '/' + d + ']]' }, { at: toFrac(A), label: '[[m:' + w1 + ' ' + f1 + '/' + d + ']]' }] },
        ask: ask('[[m:' + w1 + ' ' + f1 + '/' + d + ']] = ' + (w1 - 1) + ' and how many ' + d + 'ths?', num(String(f1 + d) + '/' + d, 'fraction-any'), 'Add ' + d + '/' + d + ' to ' + f1 + '/' + d + '.', '[[m:' + w1 + ' ' + f1 + '/' + d + ']] = ' + (w1 - 1) + ' and [[f:' + (f1 + d) + '/' + d + ']].') },
      { say: 'Now subtract the wholes and the fractions.', ask: ask('[[m:' + (w1 - 1) + ' ' + (f1 + d) + '/' + d + ']] − [[m:' + w2 + ' ' + f2 + '/' + d + ']] = ?', num(toFrac(ans), 'fraction'), 'Wholes: ' + (w1 - 1) + ' − ' + w2 + '. Fractions: ' + (f1 + d) + ' − ' + f2 + ' ' + d + 'ths.', 'The answer is ' + fracMk(ans) + '.', [{ value: toFrac(wrong), misconception: 'regroup-mixed', feedback: 'Use the borrowed amount: ' + (f1 + d) + '/' + d + '.' }]) },
    ]);
  };

  // multiply / divide fractions and mixed numbers
  G['frac-muldiv'] = (r, seed) => {
    const pick = (a) => a[Math.floor(r() * a.length)];
    const t = r();
    if (t < 0.35) {
      const a = 1 + Math.floor(r() * 4), b = a + 1 + Math.floor(r() * 5), c = 1 + Math.floor(r() * 4), d = c + 1 + Math.floor(r() * 5);
      const ans = mul(rat(a, b), rat(c, d));
      return finish('frac-muldiv', seed, 1, '[[f:' + a + '/' + b + ']] &times; [[f:' + c + '/' + d + ']] = ? (simplest form)', num(toFrac(ans), 'fraction'), [
        { value: toFrac(rat(a * d, b * c)), misconception: 'div-no-flip', feedback: 'That divides. To multiply, just multiply tops and multiply bottoms.' },
        { value: toFrac(rat(a + c, b + d)), misconception: 'add-denominators', feedback: 'That adds. Multiply top &times; top and bottom &times; bottom.' },
      ], 'Top &times; top over bottom &times; bottom, then simplify.', [
        { say: 'Multiplying fractions: top &times; top, bottom &times; bottom.', figure: b <= 12 && d <= 12 ? { type: 'area', a: a + '/' + b, b: c + '/' + d } : null,
          ask: ask('[[f:' + a + '/' + b + ']] &times; [[f:' + c + '/' + d + ']] = ? (any equal fraction)', num(toFrac(ans), 'fraction-any'), 'Multiply ' + a + ' &times; ' + c + ' on top and ' + b + ' &times; ' + d + ' on the bottom.', '= [[f:' + a * c + '/' + b * d + ']].') },
        { ask: ask('In simplest form = ?', num(toFrac(ans), 'fraction'), 'Divide top and bottom by the GCF.', '= ' + fracMk(ans) + '.') },
      ].map((st) => { if (!st.figure) delete st.figure; return st; }));
    }
    if (t < 0.65) {
      const w1 = 1 + Math.floor(r() * 4), w2 = 1 + Math.floor(r() * 4);
      const d1 = pick([2, 3, 4, 5]), d2 = pick([2, 3, 4, 5]);
      const f1 = 1 + Math.floor(r() * (d1 - 1)), f2 = 1 + Math.floor(r() * (d2 - 1));
      const A = add(rat(w1), rat(f1, d1)), B = add(rat(w2), rat(f2, d2));
      const ans = mul(A, B);
      const wrong = add(rat(w1 * w2), rat(f1 * f2, d1 * d2));
      return finish('frac-muldiv', seed, 2, '[[m:' + w1 + ' ' + f1 + '/' + d1 + ']] &times; [[m:' + w2 + ' ' + f2 + '/' + d2 + ']] = ?', num(toFrac(ans), 'fraction'), [
        { value: toFrac(wrong), misconception: 'mixed-mult-parts', feedback: 'You multiplied the wholes and the fractions separately. Change each mixed number to an improper fraction first.' },
      ], 'Change both to improper fractions first.', [
        { say: 'Mixed numbers must become improper fractions before you multiply.', ask: ask('[[m:' + w1 + ' ' + f1 + '/' + d1 + ']] as an improper fraction = ?', num(toFrac(A), 'fraction'), w1 + ' &times; ' + d1 + ' + ' + f1 + ' on top.', '= [[f:' + toFrac(A) + ']].') },
        { ask: ask('[[m:' + w2 + ' ' + f2 + '/' + d2 + ']] as an improper fraction = ?', num(toFrac(B), 'fraction'), w2 + ' &times; ' + d2 + ' + ' + f2 + ' on top.', '= [[f:' + toFrac(B) + ']].') },
        { say: 'Now multiply tops and bottoms, and simplify.', ask: ask('[[f:' + toFrac(A) + ']] &times; [[f:' + toFrac(B) + ']] = ?', num(toFrac(ans), 'fraction'), 'Top &times; top, bottom &times; bottom, then simplify.', '= ' + fracMk(ans) + '.', [{ value: toFrac(wrong), misconception: 'mixed-mult-parts', feedback: 'Use the improper fractions.' }]) },
      ]);
    }
    const complex = r() < 0.35;
    const a = 1 + Math.floor(r() * 7), b = pick([2, 3, 4, 5, 6, 8]), c = 1 + Math.floor(r() * 5), d = pick([2, 3, 4, 6, 8]);
    const A = rat(a, b), B = rat(c, d);
    const ans = div(A, B);
    const shown = complex ? '[[c:' + a + '/' + b + '|' + c + '/' + d + ']]' : '[[f:' + a + '/' + b + ']] &divide; [[f:' + c + '/' + d + ']]';
    return finish('frac-muldiv', seed, complex ? 3 : 2, (complex ? 'Simplify the complex fraction ' : '') + shown + (complex ? '.' : ' = ?'), num(toFrac(ans), 'fraction'), [
      { value: toFrac(mul(A, B)), misconception: 'div-no-flip', feedback: 'That multiplied without flipping. Dividing means multiply by the reciprocal of the SECOND fraction.' },
      { value: toFrac(mul(rat(b, a), B)), misconception: 'div-no-flip', feedback: 'You flipped the first fraction. Keep the first, flip the second.' },
    ], 'Keep, change, flip: keep the first fraction, change ÷ to &times;, flip the second.', [
      { say: complex ? 'A complex fraction is a division: the top fraction &divide; the bottom fraction.' : 'Dividing by a fraction is the same as multiplying by its reciprocal.',
        ask: ask('What is the reciprocal of [[f:' + c + '/' + d + ']]?', num(d + '/' + c, 'fraction-any'), 'Flip it over.', 'The reciprocal is [[f:' + d + '/' + c + ']].', [{ value: b + '/' + a, misconception: 'div-no-flip', feedback: 'Flip the second fraction, not the first.' }]) },
      { ask: ask('[[f:' + a + '/' + b + ']] &times; [[f:' + d + '/' + c + ']] = ? (simplest form)', num(toFrac(ans), 'fraction'), 'Multiply tops and bottoms, then simplify.', '= ' + fracMk(ans) + '.') },
    ]);
  };

  // decimal operations
  G['dec-ops'] = (r, seed) => {
    const pick = (a) => a[Math.floor(r() * a.length)];
    const dec = (maxInt, places) => rat(Math.floor(r() * maxInt * Math.pow(10, places)) + 1, Math.pow(10, places));
    const op = pick(['+', '-', 'x', '/']);
    if (op === '+' || op === '-') {
      let A = dec(20, 1 + Math.floor(r() * 2)), B = dec(10, 1 + Math.floor(r() * 3));
      if (op === '-' && M.cmp(A, B) < 0) [A, B] = [B, A];
      const as = toDec(A), bs = toDec(B);
      const ans = op === '+' ? add(A, B) : sub(A, B);
      const pa = (as.split('.')[1] || '').length, pb = (bs.split('.')[1] || '').length;
      const ia = BigInt(as.replace('.', '')), ib = BigInt(bs.replace('.', ''));
      const mis = rat(op === '+' ? ia + ib : (ia > ib ? ia - ib : ib - ia), 10n ** BigInt(Math.max(pa, pb)));
      const errs = pa !== pb ? [{ value: vstr(mis), misconception: 'decimal-align', feedback: 'The digits were lined up on the right, not at the decimal point. Line up the points and fill in zeros.' }] : [];
      return finish('dec-ops', seed, 1, as + ' ' + (op === '+' ? '+' : '−') + ' ' + bs + ' = ?', num(vstr(ans), 'decimal'), errs, 'Line up the decimal points. Fill empty places with zeros.', [
        { say: 'Stack them with the points lined up.', figure: { type: 'columns', numbers: [as, bs], op: op === '+' ? '+' : '−' },
          ask: ask(as + ' ' + (op === '+' ? '+' : '−') + ' ' + bs + ' = ?', num(vstr(ans), 'decimal'), 'Work right to left, place by place, and bring the point straight down.', 'The answer is ' + decMk(ans) + '.', errs) },
      ]);
    }
    if (op === 'x') {
      const A = dec(9, 1 + Math.floor(r() * 2)), B = dec(9, 1);
      const ans = mul(A, B);
      const as = toDec(A), bs = toDec(B);
      const places = (as.split('.')[1] || '').length + (bs.split('.')[1] || '').length;
      const whole = BigInt(as.replace('.', '')) * BigInt(bs.replace('.', ''));
      return finish('dec-ops', seed, 2, as + ' &times; ' + bs + ' = ?', num(vstr(ans), 'decimal'), [
        { value: vstr(rat(whole, 10n ** BigInt(Math.max(1, places - 1)))), misconception: 'decimal-mult-places', feedback: 'Count the decimal places in BOTH numbers and add them: the answer needs ' + places + ' places.' },
        { value: vstr(rat(whole, 10n ** BigInt(places + 1))), misconception: 'decimal-mult-places', feedback: 'Too many places. Count the places in both factors: ' + places + ' in all.' },
      ], 'Multiply as if there were no points, then count decimal places.', [
        { say: 'Ignore the points and multiply the whole numbers.', figure: { type: 'columns', numbers: [as, bs], op: '×' },
          ask: ask(as.replace('.', '').replace(/^0+(?=\d)/, '') + ' &times; ' + bs.replace('.', '').replace(/^0+(?=\d)/, '') + ' = ?', num(whole.toString(), 'number'), 'Multiply the digits.', '= ' + whole + '.') },
        { say: 'Now count the decimal places in both numbers: ' + places + ' in all.', ask: ask('So ' + as + ' &times; ' + bs + ' = ?', num(vstr(ans), 'decimal'), 'Start at the right end of ' + whole + ' and move the point ' + places + ' places left.', '= ' + decMk(ans) + '.') },
      ]);
    }
    // division with a decimal divisor
    const q = rat(Math.floor(r() * 90) + 2, pick([1, 10]));
    const B = rat(Math.floor(r() * 9) + 1, pick([10, 100]));
    const A = mul(q, B);
    const as = toDec(A), bs = toDec(B);
    const k = (bs.split('.')[1] || '').length;
    const p10 = rat(Math.pow(10, k));
    return finish('dec-ops', seed, 2, as + ' &divide; ' + bs + ' = ?', num(vstr(q), 'decimal'), [
      { value: vstr(div(A, mul(B, p10))), misconception: 'decimal-div-shift', feedback: 'You moved the point in the divisor but not in the dividend. Move both the same number of places.' },
      { value: vstr(div(mul(A, p10), B)), misconception: 'decimal-div-shift', feedback: 'You moved the point in the dividend but not in the divisor. Move both the same number of places.' },
    ], 'Make the divisor a whole number by moving its point, and move the dividend\'s point the same way.', [
      { say: 'Make the divisor a whole number: move both points ' + k + ' place' + (k === 1 ? '' : 's') + ' right.', figure: { type: 'shift', number: bs, places: k, note: '× ' + Math.pow(10, k) },
        ask: ask(as + ' becomes ?', num(vstr(mul(A, p10)), 'decimal'), 'Move its point ' + k + ' place' + (k === 1 ? '' : 's') + ' right too.', as + ' &times; ' + Math.pow(10, k) + ' = ' + decMk(mul(A, p10)) + '.') },
      { ask: ask(decMk(mul(A, p10)) + ' &divide; ' + decMk(mul(B, p10)) + ' = ?', num(vstr(q), 'decimal'), 'Now it is a whole-number divisor.', '= ' + decMk(q) + '.') },
    ]);
  };

  const SKILLS = Object.keys(G);
  function make(skill, seed) {
    if (!G[skill]) return null;
    seed = (seed >>> 0) || 1;
    return G[skill](rng(seed * 2654435761 >>> 0), seed);
  }
  /** Rebuild an item from its id ("g:skill:seed"). */
  function fromId(id) {
    const m = /^g:([a-z-]+):(\d+)$/.exec(String(id));
    return m ? make(m[1], +m[2]) : null;
  }
  const api = { make, fromId, skills: SKILLS };
  root.FDPGen = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
