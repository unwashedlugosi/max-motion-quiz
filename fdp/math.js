/* math.js — exact rational arithmetic, answer parsing and grading for Max's F/D/P Test Prep.
 * Pure functions, no DOM. Loaded by the page (window.FDPMath) and by tools/validate.mjs (module.exports),
 * so the validator checks content with exactly the parser the app uses.
 *
 * Numbers are { n: BigInt, d: BigInt } with d > 0 and gcd(n, d) = 1.
 */
(function (root) {
  'use strict';

  /* ---------------- rationals ---------------- */
  const babs = (x) => (x < 0n ? -x : x);
  function gcd(a, b) { a = babs(a); b = babs(b); while (b) { const t = a % b; a = b; b = t; } return a; }
  function rat(n, d) {
    n = BigInt(n); d = d === undefined ? 1n : BigInt(d);
    if (d === 0n) throw new Error('zero denominator');
    if (d < 0n) { n = -n; d = -d; }
    const g = gcd(n, d) || 1n;
    return { n: n / g, d: d / g };
  }
  const add = (a, b) => rat(a.n * b.d + b.n * a.d, a.d * b.d);
  const sub = (a, b) => rat(a.n * b.d - b.n * a.d, a.d * b.d);
  const mul = (a, b) => rat(a.n * b.n, a.d * b.d);
  const div = (a, b) => rat(a.n * b.d, a.d * b.n);
  const cmp = (a, b) => { const x = a.n * b.d - b.n * a.d; return x < 0n ? -1 : x > 0n ? 1 : 0; };
  const eq = (a, b) => !!a && !!b && a.n === b.n && a.d === b.d;
  const isInt = (a) => a.d === 1n;
  const pow10 = (k) => 10n ** BigInt(k);
  const HUNDRED = rat(100);
  const toNumber = (a) => Number(a.n) / Number(a.d);

  /** Round to k decimal places, half away from zero (how a 6th grader is taught). */
  /** floor / ceil for rationals */
  function floorR(a) { let q = a.n / a.d; if (a.n < 0n && q * a.d !== a.n) q -= 1n; return q; }
  function ceilR(a) { let q = a.n / a.d; if (a.n > 0n && q * a.d !== a.n) q += 1n; return q; }
  /** Round to a multiple of step (a rational): mode 'nearest' (half away from zero, as taught), 'up', 'down'. */
  function roundStep(a, step, mode) {
    const q = div(a, step);
    let n;
    if (mode === 'up') n = ceilR(q);
    else if (mode === 'down') n = floorR(q);
    else { const neg = q.n < 0n; const aq = rat(babs(q.n), q.d); n = floorR(add(aq, rat(1, 2))); if (neg) n = -n; }
    return mul(rat(n), step);
  }
  /** Round to k decimal places. */
  const roundTo = (a, k, mode) => roundStep(a, rat(1, pow10(k)), mode);
  /** A rounding rule from an answer spec: { step, mode, k } or null. */
  function roundingOf(answer) {
    if (!answer) return null;
    if (answer.rounding && answer.rounding.to !== undefined) {
      const step = parseValue(String(answer.rounding.to));
      const ds = String(answer.rounding.to).split('.')[1];
      return { step, mode: answer.rounding.mode || 'nearest', k: ds ? ds.length : 0 };
    }
    if (answer.round !== undefined && answer.round !== null) return { step: rat(1, pow10(+answer.round)), mode: answer.roundMode || 'nearest', k: +answer.round };
    return null;
  }

  /* ---------------- formatting ---------------- */
  /** Decimal string with repeating part in parentheses, e.g. 1/6 -> "0.1(6)". null if the period is too long. */
  function toDec(a, maxDigits) {
    maxDigits = maxDigits || 24;
    const neg = a.n < 0n;
    let n = babs(a.n);
    const d = a.d;
    const ip = n / d;
    let r = n % d;
    if (r === 0n) return (neg ? '-' : '') + ip.toString();
    const digits = [];
    const seen = new Map();
    while (r !== 0n && !seen.has(r)) {
      if (digits.length >= maxDigits) return null;
      seen.set(r, digits.length);
      r *= 10n;
      digits.push((r / d).toString());
      r %= d;
    }
    let frac;
    if (r === 0n) frac = digits.join('');
    else { const i = seen.get(r); frac = digits.slice(0, i).join('') + '(' + digits.slice(i).join('') + ')'; }
    return (neg ? '-' : '') + ip.toString() + '.' + frac;
  }
  const terminates = (a) => { let d = a.d; while (d % 2n === 0n) d /= 2n; while (d % 5n === 0n) d /= 5n; return d === 1n; };
  /** Fixed k decimals (value assumed already rounded). */
  function toFixed(a, k) {
    const r = roundTo(a, k);
    const neg = r.n < 0n;
    const s = babs(r.n) * pow10(k) / r.d;
    let str = s.toString().padStart(k + 1, '0');
    if (k > 0) str = str.slice(0, -k) + '.' + str.slice(-k);
    return (neg ? '-' : '') + str;
  }
  const toFrac = (a) => (isInt(a) ? a.n.toString() : a.n.toString() + '/' + a.d.toString());
  function toMixed(a) {
    if (isInt(a) || babs(a.n) < a.d) return toFrac(a);
    const neg = a.n < 0n, n = babs(a.n);
    return (neg ? '-' : '') + (n / a.d).toString() + ' ' + (n % a.d).toString() + '/' + a.d.toString();
  }
  const withCommas = (s) => s.replace(/^(-?\d+)/, (m) => m.replace(/\B(?=(\d{3})+(?!\d))/g, ','));

  /** Inline-markup string for showing a value: "[[f:33/400]]", "[[m:8 1/4]]", "[[r:0.1(6)]]", plain digits otherwise. */
  function markupNumber(a, pref) {
    if (pref === 'fraction') {
      if (isInt(a)) return a.n.toString();
      return babs(a.n) > a.d ? '[[m:' + toMixed(a) + ']]' : '[[f:' + toFrac(a) + ']]';
    }
    const dstr = toDec(a, 12);
    if (dstr === null) return babs(a.n) > a.d ? '[[m:' + toMixed(a) + ']]' : '[[f:' + toFrac(a) + ']]';
    if (dstr.indexOf('(') >= 0) return '[[r:' + dstr + ']]';
    return withCommas(dstr);
  }

  /* ---------------- parsing ---------------- */
  const VULGAR = { '½': '1/2', '⅓': '1/3', '⅔': '2/3', '¼': '1/4', '¾': '3/4', '⅕': '1/5', '⅖': '2/5', '⅗': '3/5', '⅘': '4/5', '⅙': '1/6', '⅚': '5/6', '⅐': '1/7', '⅛': '1/8', '⅜': '3/8', '⅝': '5/8', '⅞': '7/8', '⅑': '1/9', '⅒': '1/10' };

  function fail(msg) { return { ok: false, msg }; }

  /** Value of digits I.A(R) where R repeats. Strings of digits. */
  function decValue(I, A, R) {
    I = I || '0'; A = A || '';
    if (!R) return rat(BigInt(I + A), pow10(A.length));
    const full = BigInt(I + A + R), part = BigInt(I + A);
    return rat(full - part, pow10(A.length) * (pow10(R.length) - 1n));
  }

  /** Find the repeating block in digits typed before "...": the last digit 3+ times, or a longer block 2+ times. */
  function ellipsisPeriod(F) {
    for (let p = 1; p <= 6; p++) {
      const need = p === 1 ? 3 : 2;
      if (F.length < p * need) continue;
      const block = F.slice(F.length - p);
      let reps = 0, end = F.length;
      while (end - p >= 0 && F.slice(end - p, end) === block) { reps++; end -= p; }
      if (reps >= need) {
        let pre = F.slice(0, end);
        // rotate: 0.1666 -> pre "1", block "6"; 0.12323 -> pre "1", block "23"
        let blk = block;
        while (pre.length && pre[pre.length - 1] === blk[blk.length - 1]) { blk = blk[blk.length - 1] + blk.slice(0, -1); pre = pre.slice(0, -1); }
        return { A: pre, R: blk };
      }
    }
    return null;
  }

  /** Parse one unsigned number body (no %, no $, no sign). Returns { value, kind, simplest, decimals, rep } or { error }. */
  function parseBody(s) {
    let m;
    // mixed number: 8 1/4
    if ((m = /^(\d+)\s+(\d+)\/(\d+)$/.exec(s))) {
      const w = BigInt(m[1]), a = BigInt(m[2]), b = BigInt(m[3]);
      if (b === 0n) return { error: 'The bottom of a fraction cannot be 0.' };
      const simplest = a > 0n && a < b && gcd(a, b) === 1n;
      return { value: add(rat(w), rat(a, b)), kind: 'mixed', simplest };
    }
    // fraction: 33/400 (decimals allowed on top or bottom, e.g. 8.25/100, but then it is not simplest form)
    if ((m = /^(\d*\.?\d+|\d+\.)\/(\d*\.?\d+|\d+\.)$/.exec(s))) {
      const top = parseBody(m[1]), bot = parseBody(m[2]);
      if (top.error || bot.error) return { error: 'I could not read that fraction.' };
      if (bot.value.n === 0n) return { error: 'The bottom of a fraction cannot be 0.' };
      const whole = /^\d+$/.test(m[1]) && /^\d+$/.test(m[2]);
      if (!whole) return { value: div(top.value, bot.value), kind: 'cfrac', simplest: false };
      const a = BigInt(m[1]), b = BigInt(m[2]);
      return { value: rat(a, b), kind: 'frac', simplest: b !== 1n && gcd(a, b) === 1n };
    }
    // decimal with "..." : 0.777...
    if ((m = /^(\d*)\.(\d+)\s*(?:\.\.\.|…)$/.exec(s))) {
      const per = ellipsisPeriod(m[2]);
      if (!per) return { error: 'Show which digits repeat: type a few more of them before the ..., or use the repeat bar.' };
      return { value: decValue(m[1], per.A, per.R), kind: 'rep', rep: per };
    }
    // decimal, optional repeat in parentheses: 0.1(6)  0.(7)  77.(7  .0825  12  12.
    if ((m = /^(\d*)(?:\.(\d*)(?:\((\d*)\)?)?)?$/.exec(s))) {
      const I = m[1], A = m[2], R = m[3];
      if (!I && !A && !R) return { error: 'Type a number.' };
      if (R !== undefined && R === '') return { error: 'Type the digits that repeat after the repeat bar.' };
      if (R) {
        if (/^0+$/.test(R)) return { value: decValue(I, A, ''), kind: 'dec', decimals: (A || '').length };
        return { value: decValue(I, A, R), kind: 'rep', rep: { A: A || '', R } };
      }
      if (A === undefined || (A === '' && s.indexOf('.') < 0)) return { value: decValue(I, '', ''), kind: 'int' };
      return { value: decValue(I, A, ''), kind: A === '' ? 'int' : 'dec', decimals: A.length };
    }
    return { error: null };
  }

  /**
   * Parse what the student typed.
   * -> { ok:true, value, num, pct, money, neg, kind:'int'|'dec'|'rep'|'frac'|'cfrac'|'mixed', simplest, decimals }
   *    value = the actual number (8.25% -> 0.0825); num = the number as written before any % (8.25).
   * -> { ok:false, msg }
   */
  function parse(raw) {
    if (raw === undefined || raw === null) return fail('Type an answer first.');
    let s = String(raw);
    for (const k in VULGAR) s = s.split(k).join(' ' + VULGAR[k]);
    s = s.normalize('NFKC').replace(/⁄/g, '/');
    s = s.replace(/[−–—]/g, '-').replace(/ /g, ' ').replace(/÷/g, '/').trim().toLowerCase();
    if (!s) return fail('Type an answer first.');
    s = s.replace(/\s*percent$/, '%');
    let pct = false, money = false, neg = false;
    if (s.endsWith('%')) { pct = true; s = s.slice(0, -1).trim(); }
    if (s.startsWith('-')) { neg = true; s = s.slice(1).trim(); }
    if (s.startsWith('$')) { money = true; s = s.slice(1).trim(); }
    if (!neg && s.startsWith('-')) { neg = true; s = s.slice(1).trim(); }
    if (s.endsWith('%')) { pct = true; s = s.slice(0, -1).trim(); }
    let unit = '', cents = false;
    if (/\u00a2$/.test(s)) { cents = true; s = s.slice(0, -1).trim(); }
    const um = /^(.*?[\d)%.])\s*([a-z][a-z .'\/-]*)$/.exec(s);
    if (um && !/^(\d*\.?\d*)\s*\.\.\.$/.test(s)) { unit = um[2].trim(); s = um[1].trim(); }
    if (/^(dollars?|bucks)$/.test(unit)) { money = true; }
    if (/^cents?\.?$/.test(unit)) { cents = true; unit = ''; }
    if (cents) money = true;
    if (unit === 'percent') { pct = true; unit = ''; }
    if (s.endsWith('%')) { pct = true; s = s.slice(0, -1).trim(); }
    if (pct && money) return fail('Pick one: a percent or dollars.');
    s = s.replace(/(\d),(?=\d)/g, '$1');       // 1,250 and 10,000
    s = s.replace(/\s*\/\s*/g, '/');           // 33 / 400
    s = s.replace(/\s+/g, ' ');
    if (!s) return fail('Type a number.');
    const b = parseBody(s);
    if (b.error !== undefined && !b.value) {
      if (b.error) return fail(b.error);
      if (/[a-z]/.test(s)) return fail('Use digits only, like 0.25, 1/4 or 25%.');
      if ((s.match(/\./g) || []).length > 1 && !/\.\.\.$/.test(s)) return fail('That has two decimal points.');
      if ((s.match(/\//g) || []).length > 1) return fail('Use one fraction bar, like 33/400 or 8 1/4.');
      return fail('I could not read that. Try something like 0.25, 1/4, 8 1/4 or 25%.');
    }
    let num = b.value;
    if (cents) num = div(num, HUNDRED);
    if (neg) num = rat(-num.n, num.d);
    const value = pct ? div(num, HUNDRED) : num;
    return { ok: true, value, num, pct, money, neg, unit, cents, kind: b.kind, simplest: !!b.simplest, decimals: b.decimals || 0, rep: b.rep || null };
  }

  /** Parse a content value string ("33/400", "0.(7)", "8 1/4", "-3", "43.20", "$43.20"). Throws on bad input or a %. */
  function parseValue(str) {
    const s = String(str);
    if (/%/.test(s)) throw new Error('value "' + s + '" contains %; write the percent NUMBER (e.g. "8.25")');
    const p = parse(s);
    if (!p.ok) throw new Error('value "' + s + '" does not parse: ' + p.msg);
    return p.num;
  }

  /* ---------------- grading ---------------- */
  const FORM_WORD = { decimal: 'a decimal', fraction: 'a fraction in simplest form', 'fraction-any': 'a fraction', percent: 'a percent', money: 'dollars and cents', number: 'a number' };

  function formLabel(spec) { return FORM_WORD[spec.form || 'number'] || 'a number'; }

  function placesWord(k, form) {
    if (form === 'money') return 'to the nearest cent';
    if (k === 0) return 'to the nearest whole number';
    if (k === 1) return 'to the nearest tenth';
    if (k === 2) return 'to the nearest hundredth';
    if (k === 3) return 'to the nearest thousandth';
    return 'to ' + k + ' decimal places';
  }

  /**
   * Is the parsed answer written in the requested form? (value already known to be equal)
   * -> null if fine, or a friendly message.
   */
  function formProblem(p, spec, E) {
    const form = spec.form || 'number';
    const k = p.kind;
    if (form === 'percent') {
      if (!p.pct) return null; // handled by caller
      return null;
    }
    if (p.pct) return 'That is written as a percent. The question wants ' + formLabel(spec) + '.';
    if (form === 'decimal') {
      if (k === 'frac' || k === 'mixed' || k === 'cfrac') return 'Same value, but that is a fraction. Write it as a decimal' + (terminates(E) ? '.' : ', with the repeat bar over the digits that repeat.');
      return null;
    }
    if (form === 'fraction' || form === 'fraction-any') {
      if (k === 'int' && isInt(E)) return null;
      if (k === 'dec' || k === 'rep' || k === 'int') return 'Same value, but that is a decimal. Write it as a fraction.';
      if (k === 'cfrac') return 'Same value. Now get rid of the decimal point inside the fraction: multiply top and bottom by 10 until both are whole numbers' + (form === 'fraction' ? ', then simplify.' : '.');
      if (form === 'fraction' && !p.simplest) {
        if (k === 'frac' && p.value.d === 1n) return 'Same value. A fraction over 1 is a whole number: just write the whole number.';
        if (k === 'mixed') return 'Same value, but the fraction part is not in simplest form. Simplify it.';
        return 'Same value, but not in simplest form yet. Divide the top and bottom by a common factor.';
      }
      return null;
    }
    if (form === 'money') {
      if (k === 'frac' || k === 'mixed' || k === 'cfrac' || k === 'rep') return 'Same amount. Write money as dollars and cents, like $43.20.';
      return null;
    }
    return null;
  }

  /* ---------------- labels (units) ---------------- */
  const normWord = (w) => String(w || '').toLowerCase().replace(/[.\s]+$/, '').replace(/\s+/g, ' ').trim();
  const singular = (w) => w.replace(/(ches|shes|sses|xes)$/, (m) => m.slice(0, -2)).replace(/ies$/, 'y').replace(/([^s])s$/, '$1');
  const UNIT_ALIASES = {
    hour: ['h', 'hr', 'hrs', 'hour', 'hours'], minute: ['min', 'mins', 'minute', 'minutes'], second: ['s', 'sec', 'secs', 'second', 'seconds'],
    inch: ['in', 'inch', 'inches'], foot: ['ft', 'foot', 'feet'], yard: ['yd', 'yds', 'yard', 'yards'], mile: ['mi', 'mile', 'miles'],
    meter: ['m', 'meter', 'meters', 'metre', 'metres'], centimeter: ['cm', 'centimeter', 'centimeters', 'centimetre', 'centimetres'],
    kilometer: ['km', 'kilometer', 'kilometers', 'kilometre', 'kilometres'], millimeter: ['mm', 'millimeter', 'millimeters', 'millimetre', 'millimetres'],
    liter: ['l', 'liter', 'liters', 'litre', 'litres'], gallon: ['gal', 'gallon', 'gallons'], quart: ['qt', 'quart', 'quarts'], pint: ['pt', 'pint', 'pints'],
    pound: ['lb', 'lbs', 'pound', 'pounds'], ounce: ['oz', 'ounce', 'ounces'], gram: ['g', 'gram', 'grams'], kilogram: ['kg', 'kilogram', 'kilograms'],
    bus: ['bus', 'buses', 'busses'], dollar: ['$', 'dollar', 'dollars'], cup: ['cup', 'cups'],
  };
  const ALIAS = {};
  Object.keys(UNIT_ALIASES).forEach((k) => UNIT_ALIASES[k].forEach((a) => { ALIAS[a] = k; }));
  /** "Miles per Gallon." -> "mile/gallon"; "mi/gal" -> "mile/gallon"; "inches" -> "inch". */
  function canonUnit(w) {
    const t = normWord(w).replace(/\s+per\s+/g, '/').replace(/\s*\/\s*/g, '/');
    return t.split('/').map((part) => part.split(' ').map((x) => { x = x.replace(/\.$/, ''); return ALIAS[x] || singular(x.replace(/re$/, 'er')); }).join(' ')).join('/');
  }
  function labelsOf(answer) {
    if (!answer) return null;
    let L = Array.isArray(answer.label) ? answer.label.slice() : typeof answer.label === 'string' ? [answer.label] : null;
    if (answer.form === 'money') L = (L || []).concat(['$', 'dollars', 'dollar']);
    return L && L.length ? L : null;
  }
  function labelOk(p, L) {
    const words = L.map(canonUnit);
    if (p.money && words.some((w) => w === 'dollar')) return true;
    const u = canonUnit(p.unit);
    if (!u) return false;
    return words.some((w) => w && w !== 'dollar' && (u === w || u.startsWith(w + ' ') || u.split(' ')[0] === w));
  }
  /** null if the label is fine, else a friendly message. */
  function labelProblem(p, answer) {
    const L = labelsOf(answer);
    if (!L) return null;
    if (labelOk(p, L)) return null;
    if (answer.form === 'money') return 'Right amount. Now the label: money needs a $ sign. Mr. B: "Be mindful of labels, especially money questions."';
    if (!p.unit && !p.money) return 'Right number. Now add the label: ' + (L.length ? 'what is it counting or measuring?' : '') + ' Labels count on Mr. B\'s test.';
    return 'Right number, but check the label. What is the question counting or measuring?';
  }

  /** The errors[] entry whose value the parsed answer equals, if any. */
  function matchError(p, errors, pctForm) {
    for (const e of errors || []) {
      if (!e || e.value === undefined || e.value === null) continue;
      let V;
      try { V = parseValue(e.value); } catch (err) { continue; }
      if (pctForm) { if (eq(p.num, V) || (!p.pct && eq(p.value, div(V, HUNDRED)))) return e; }
      else if (eq(p.value, V) || (p.pct && eq(p.num, V))) return e;
    }
    return null;
  }

  /**
   * Grade an answer.
   * item: { answer, errors } (an Item or an ask). input: string for num, index for choice, array for order.
   * -> { status: 'correct' | 'form' | 'wrong' | 'unparsed', msg?, error? (the matched errors[] entry), auto? }
   */
  function grade(answer, errors, input) {
    errors = Array.isArray(errors) ? errors : [];
    if (!answer) return { status: 'wrong' };
    if (answer.type === 'choice') {
      if (input === undefined || input === null || input === '') return { status: 'unparsed', msg: 'Pick an answer first.' };
      const i = +input;
      if (i === answer.correct) return { status: 'correct' };
      const e = errors.find((x) => x && x.choice === i);
      return { status: 'wrong', error: e || null };
    }
    if (answer.type === 'order') {
      if (!Array.isArray(input) || input.length !== answer.items.length) return { status: 'unparsed', msg: 'Put every card in a spot first.' };
      const ok = input.every((v, i) => v === answer.correct[i]);
      if (ok) return { status: 'correct' };
      const e = errors.find((x) => x && Array.isArray(x.order) && x.order.length === input.length && x.order.every((v, i) => v === input[i]));
      return { status: 'wrong', error: e || null };
    }
    // num
    const p = parse(input);
    if (!p.ok) return { status: 'unparsed', msg: p.msg };
    const form = answer.form || 'number';
    const E = parseValue(answer.value);
    const R = roundingOf(answer);
    const pctForm = form === 'percent';
    // the student's number in the answer's own space (percent NUMBER for percent answers)
    const S = pctForm ? p.num : p.value;

    const sameAs = (X, target) => {
      if (eq(X, target)) return 'exact';
      if (R && eq(roundStep(X, R.step, R.mode), target)) return 'unrounded';
      if (!R && form === 'money' && eq(roundTo(X, 2), target)) return 'unrounded';
      return null;
    };
    const roundMsg = () => {
      const w = R ? placesWord(R.k, form) : 'to the nearest cent';
      if (R && R.mode === 'up') return 'Right work. Now think about real life: part of one is not enough here, so round UP ' + w + '.';
      if (R && R.mode === 'down') return 'Right work. Now think about real life: only whole ones count here, so round DOWN ' + w + '.';
      return 'Right work. Now round it ' + w + '.';
    };

    if (pctForm) {
      const m = sameAs(S, E);
      if (m && p.pct) {
        if (m === 'unrounded') { const hit = matchError(p, errors, true); return { status: 'form', msg: roundMsg(), html: hit && hit.feedback ? hit.feedback : undefined, error: hit || undefined }; }
        return { status: 'correct' };
      }
      if (m && !p.pct) return { status: 'form', msg: 'Right number. Write it as a percent: put the % sign on it.' };
      if (!p.pct && sameAs(p.value, div(E, HUNDRED))) {
        return { status: 'form', msg: (p.kind === 'dec' || p.kind === 'rep' || p.kind === 'int')
          ? 'That is the decimal. The question wants a percent, so move the decimal point two places right and add %.'
          : 'That is the fraction. The question wants a percent: multiply by 100 and add %.' };
      }
    } else {
      const m = sameAs(S, E);
      if (m) {
        if (m === 'unrounded') {
          const hit = matchError(p, errors, pctForm);
          return { status: 'form', msg: roundMsg(), html: hit && hit.feedback ? hit.feedback : undefined, error: hit || undefined, misc: form === 'money' && !R ? 'money-cents' : undefined };
        }
        const fp = formProblem(p, answer, E);
        if (fp) {
          const ns = form === 'fraction' && (p.kind === 'frac' || p.kind === 'mixed') && !p.simplest;
          return ns ? { status: 'form', msg: fp, misc: 'not-simplest' } : { status: 'form', msg: fp, misc: form === 'money' ? 'money-cents' : undefined };
        }
        if (form === 'money' && !p.cents && (p.kind === 'dec' ? p.decimals !== 2 : !isInt(E))) {
          return { status: 'form', msg: 'Right amount. Money is written to the cent: two digits after the point, like $' + toFixed(E, 2) + '.', misc: 'money-cents' };
        }
        const lp = labelProblem(p, answer);
        if (lp) return { status: 'label', msg: lp, misc: 'no-label' };
        return { status: 'correct' };
      }
      if (p.pct && sameAs(p.num, E)) return { status: 'form', msg: 'Right digits, but drop the % sign. The question wants ' + formLabel(answer) + '.' };
    }

    // wrong: look for a known wrong answer
    const hit = matchError(p, errors, pctForm);
    if (hit) return { status: 'wrong', error: hit };
    // automatic: rounded the other way when the situation needed up/down
    if (R && R.mode !== 'nearest' && !p.pct) {
      const X = p.value;
      if (eq(roundStep(X, R.step, 'nearest'), X) && eq(rat(babs(sub(X, E).n), sub(X, E).d), R.step)) return { status: 'wrong', auto: 'math-vs-real-rounding' };
    }
    // automatic: a repeating value written as a decimal that stops
    const target = E;
    if (!R && !terminates(target) && (p.kind === 'dec' || p.kind === 'int') && (pctForm ? true : !p.pct)) {
      const X = pctForm ? p.num : p.value;
      const diff = sub(X, target);
      const tol = rat(1, pow10(Math.max(1, p.decimals)));
      if (cmp(rat(babs(diff.n), diff.d), tol) < 0) {
        return { status: 'wrong', auto: 'repeating-truncate' };
      }
    }
    return { status: 'wrong' };
  }

  /** The correct answer as display markup. */
  function answerMarkup(answer) {
    if (!answer) return '';
    if (answer.type === 'choice') return String(answer.choices[answer.correct]);
    if (answer.type === 'order') return answer.correct.map((i) => answer.items[i]).join(' &lt; ');
    const E = parseValue(answer.value);
    const form = answer.form || 'number';
    const Rr = roundingOf(answer);
    const k = Rr ? Rr.k : null;
    const L = labelsOf(answer);
    const lab = L && form !== 'money' ? ' ' + L[0] : '';
    if (form === 'money') return (E.n < 0n ? '-$' : '$') + withCommas(toFixed(rat(babs(E.n), E.d), 2));
    if (k !== undefined && k !== null) return withCommas(toFixed(E, k)) + (form === 'percent' ? '%' : '') + lab;
    if (form === 'percent') return markupNumber(E, 'decimal') + '%';
    if (form === 'fraction' || form === 'fraction-any') return markupNumber(E, 'fraction') + lab;
    if (form === 'decimal') return markupNumber(E, 'decimal') + lab;
    return (terminates(E) ? withCommas(toDec(E)) : markupNumber(E, 'fraction')) + lab;
  }

  /** A string a student could type that grades as correct (validator + smoke tests). */
  function typedAnswer(answer) {
    if (!answer || answer.type !== 'num') return null;
    const E = parseValue(answer.value);
    const form = answer.form || 'number';
    const Rr = roundingOf(answer);
    const L = labelsOf(answer);
    const lab = L && form !== 'money' ? ' ' + L[0] : '';
    if (form === 'money') return (E.n < 0n ? '-$' : '$') + toFixed(rat(babs(E.n), E.d), isInt(E) ? 0 : 2);
    let core;
    if (Rr) core = toFixed(E, Rr.k);
    else if (form === 'fraction' || form === 'fraction-any') core = isInt(E) ? E.n.toString() : toMixed(E);
    else core = toDec(E, 30) || toFrac(E);
    return core + (form === 'percent' ? '%' : '') + lab;
  }

  const api = {
    rat, add, sub, mul, div, cmp, eq, isInt, gcd, roundTo, roundStep, roundingOf, labelsOf, toNumber, terminates, floorR,
    toDec, toFixed, toFrac, toMixed, withCommas, markupNumber,
    parse, parseValue, grade, answerMarkup, typedAnswer, formLabel, placesWord, ellipsisPeriod,
  };
  root.FDPMath = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
