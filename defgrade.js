/* defgrade.js - spelling-proof grader for the 7 teacher definitions (and their terms).
 *
 * Pure functions, no DOM. Works in the browser (window.DefGrade) and in node (module.exports).
 *
 *   gradeDefinition(termId, text) -> { verdict: 'correct'|'almost'|'wrong', found: [{key, word, typed, start, end}], missing: [key...], missingWords: [word...], tip }
 *   gradeTerm(termId, text)       -> same shape (typing the TERM from its definition)
 *
 * How it works
 *   1. The text is split into words (with character offsets, so the UI can underline what was typed).
 *   2. Every word is matched against a small lexicon of "lemmas" (change, position, speed, decrease ...).
 *      A word matches a lemma when it is a known variant, or when its kid-spelling phonetic key
 *      (ph->f, ck/c/q->k, c before e/i/y->s, z->s, x->ks, tion/shun/shin->Sn, ght->t, silent h dropped,
 *      doubled letters collapsed, vowel runs reduced to one vowel class) or its raw letters are close enough
 *      (Damerau-Levenshtein within a tolerance that grows with the word length).
 *      Words that are real, different words (spot, spend, chance, paint ...) are listed per lemma and never match.
 *      Increase / decrease are told apart by their first letter. Distance never counts as direction.
 *   3. Run-together words ("whenanobjectsspeeddecreases") are split by scanning for lemma windows, and
 *      split-up words ("loc ation") are re-joined before matching.
 *   4. Each term has CORE concepts (all needed), SUPPORT words (at least half), and contradictions.
 *      correct = all core + enough support; almost = all core, too little support (or a meaning given in
 *      other words, such as "stays the same"); wrong = a core concept missing, or a contradicting word.
 */
(function (root) {
  'use strict';

  /* ------------------------------------------------------------------ text helpers */
  const stripMarks = (s) => String(s === undefined || s === null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '');
  const WORD_RE = /[A-Za-z0-9]+(?:['’`][A-Za-z]+)*/g;
  function tokenize(text) {
    const src = stripMarks(text), out = [];
    let m;
    WORD_RE.lastIndex = 0;
    while ((m = WORD_RE.exec(src))) {
      let w = m[0].toLowerCase().replace(/['’`]/g, '');
      // any kid spelling of "doesn't" / "didn't" (dusint, dozent, duznt, didint) reads as "not"
      if (/^d[aeiouy]{0,3}[sz]{1,2}[aeiouy]{0,3}n{1,2}t?$/.test(w) || /^d[iu]{1,2}d[aeiouy]?nt$/.test(w)) w = 'not';
      out.push({ raw: m[0], w, start: m.index, end: m.index + m[0].length });
    }
    return out;
  }

  /** Optimal-string-alignment Damerau-Levenshtein. */
  function dl(a, b) {
    const al = a.length, bl = b.length;
    if (!al) return bl;
    if (!bl) return al;
    const d = [];
    for (let i = 0; i <= al; i++) { d[i] = new Array(bl + 1); d[i][0] = i; }
    for (let j = 0; j <= bl; j++) d[0][j] = j;
    for (let i = 1; i <= al; i++) {
      for (let j = 1; j <= bl; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
    return d[al][bl];
  }
  const sortedLetters = (s) => s.split('').sort().join('');
  /** Distance 1 that is NOT a substitution (an extra letter, a missing letter, or a swapped pair). */
  const nonSub = (a, b) => a.length !== b.length || sortedLetters(a) === sortedLetters(b);

  /* ------------------------------------------------------------------ phonetic key tuned for kid spelling */
  const keyCache = new Map();
  function phon(word) {
    const hit = keyCache.get(word);
    if (hit !== undefined) return hit;
    let s = String(word).toLowerCase().replace(/[^a-z]/g, '');
    if (s) {
      s = s.replace(/^kn/, 'n').replace(/^wr/, 'r').replace(/^wh/, 'w').replace(/^gn/, 'n');
      s = s.replace(/ph/g, 'f').replace(/ght/g, 't');
      s = s.replace(/(tion|sion|cion|tian|cian|sian|tien|shun|shon|shin|shen|shan|chun|chon|chin|chen|chan|shn)$/, 'Sn');
      s = s.replace(/tch/g, 'S').replace(/sh/g, 'S').replace(/ch/g, 'S');
      s = s.replace(/ck/g, 'k').replace(/q/g, 'k').replace(/x/g, 'ks').replace(/z/g, 's');
      s = s.replace(/([^aeiou])e$/, '$1');                    // silent final e
      s = s.replace(/c(?=[eiy])/g, 's').replace(/c/g, 'k');   // "acceleration": a-k-s-e...
      s = s.replace(/dg/g, 'j').replace(/g/g, 'j');           // g, j, dge all one sound for a kid
      s = s.replace(/v/g, 'f');                               // negatif / negative
      s = s.charAt(0) + s.slice(1).replace(/h/g, '');          // a stray silent h
      s = s.replace(/(.)\1+/g, '$1');
      s = s.charAt(0) + s.slice(1).replace(/[aeiouyw]+/g, 'a');
      s = s.replace(/^[aeiou]/, 'a');
      s = s.replace(/(.)\1+/g, '$1');
    }
    keyCache.set(word, s);
    return s;
  }
  /** Consonants only (y counts as one), doubles collapsed: "pstn", "vlcty". Lazy typists leave the vowels out. */
  const skel = (w) => String(w).replace(/[aeiou]/g, '').replace(/(.)\1+/g, '$1');
  function stemForms(w) {
    const out = [w];
    const add = (x) => { if (x.length >= 3 && out.indexOf(x) < 0) out.push(x); };
    if (w.length > 4 && /ies$/.test(w)) add(w.slice(0, -3) + 'y');
    if (w.length > 4 && /es$/.test(w)) add(w.slice(0, -2));
    if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) add(w.slice(0, -1));
    if (w.length > 5 && /ing$/.test(w)) { add(w.slice(0, -3)); add(w.slice(0, -3) + 'e'); }
    if (w.length > 4 && /ed$/.test(w)) { add(w.slice(0, -2)); add(w.slice(0, -1)); }
    if (w.length > 4 && /ly$/.test(w)) add(w.slice(0, -2));
    return out;
  }

  /* ------------------------------------------------------------------ the lexicon */
  const LEX = [];
  const LEXBY = {};
  const sp = (s) => (Array.isArray(s) ? s : String(s).split(/\s+/).filter(Boolean));
  /** L(id, forms, { never, first, exact, re }) - forms[0] is the teacher's spelling. exact: variants only, no fuzzy. */
  function L(id, forms, o) {
    o = o || {};
    const f = sp(forms).filter((x, i, a) => !/\d/.test(x) && a.indexOf(x) === i);
    const xf = sp(o.exactForms || '');
    const lem = {
      id, canon: f[0], forms: f, set: new Set(f.concat(xf)), never: new Set(sp(o.never || '')), first: o.first || null, exact: !!o.exact, re: o.re || null,
      fk: o.exact ? [] : f.filter((x) => x.length >= 4).map((x) => ({ f: x, k: phon(x) })),
      sk: o.exact ? [] : f.filter((x) => x.length >= 4 && !/\d/.test(x)).map(skel).filter((x, i, a) => x.length >= 3 && a.indexOf(x) === i),
    };
    LEX.push(lem); LEXBY[id] = lem;
    return lem;
  }

  L('change', 'change changes changed changing changin chang changs chanj chanje chanjes chanjed chanjin chanjing chaenge chainge chaynj chaynge changge chng chnge chnj chaing chanege changee chainj changr changd', {
    exactForms: 'chane', never: 'chain chains chair chase charge charges chance chances chin chan chat check cheese chunk chop chip chess chew chain chaos chart chant chaser chamber champ',
    first: /^[cs]/ });
  L('position', 'position positions posishun posishon posishin posishen pozishun pozishon possition posision posichen poshin poshun poseshun postion posiotn positoin pohsition positon posission possishun positin posishn pozition posetion posetin positon positian pos', {
    never: 'portion portions potion poison passion possible posture position2 positive positions2 pastion', first: /^p/ });
  L('place', 'place places plase plaice plas plac', { exact: true });
  L('spot', 'spot spots', { exact: true });
  L('where', 'where wher ware wair were2', { exact: true });
  L('location', 'location locations lokashun lokashon lokashin lokashen locashun locashin lowcation lokasion locasion lokeshun loction lokation locatoin lokaton loacation locashon locasun locaton lokasun loc locat lokashn locatshun lokesion locachun', {
    never: 'lotion local locals locker lock vacation relocation allocation', first: /^l/ });
  L('observer', 'observer observers observor observur obzervur obzerver obzrvr obzervr abserver obsurver obzurver obsevr observr obsurvur obzvrr obzervor obserer observe observes observed observing observation obzerve obzervin absurver obsvr obzervir obsurvor', {
    never: 'absorb absorbs absorber absorbed absorbing absorbent observatory', first: /^[aeiou]/ });
  L('watch', 'watch watcher watchers watching watches watched wach wacher wachur wachin watchin wacher wacing watchur watchr wotch wotcher whatching', { exact: true });
  L('view', 'view viewer viewers viewing views viewed vewer viewr vyewer viewar', { exact: true });
  L('look', 'look looker lookers looking looks looked lookin luker luking lukin lookr', { exact: true });
  L('motion', 'motion motions moshun mochun moshin mohtion moashun mosion motoin motin mootion motiun motiom mtion mottion motoon mution mocion mooshun moshon moshen mosshun moushun mosshon moshan motian motsion mtn', {
    never: 'mention mentions mansion mission missions motto motor moon', first: /^m/ });
  L('acceleration', 'acceleration accelerashun axelerashun aksellerashun exceleration axeleration acseleration acelaration acceleratoin axelrashun akselerashun acelrashun aceleration acceleratin axcelaration akseleration accelrashun acelerayshun accel accelerate accelerates accelerating accelerated acceleraton acselerashun acelerashun axelerasion acelleration accelaration aksleration aclerashun acceleratn acceleratshun accelerasion acseleraton', {
    never: 'accelerator accelerators', first: /^[aeiou]/ });
  L('decel', 'deceleration decelerate decelerates decelerating decelerated decelerashun deceleraton decel', { first: /^d/ });
  L('reference', 'reference references refrens refrense refrenz reffrence refrence refernce referense rifrence refrance referance refrints refrenses ref refrinse referens reffrens refrenc refrense refrinz', {
    never: 'refer refers referee refine refund refuse refill', first: /^r/ });
  L('point', 'point points pointe poynt pont piont poin pointt poyant poynte poent poinnt pointe poyn pointz poynts pnt', {
    never: 'print prints punt plant plants pot pat pit put pet pin pen pan pun pound pond pointer pointers pointing', first: /^p/ });
  L('velocity', 'velocity velocities velosity valosity vlosity velosidy volosity vellocity velocety velosiddy vlocity veloscity velocitty velosety velositee velossity velocidy velosaty veloceity vellosity velocitiy vloscity velociti velositi velositi velositty velocitee velosady velosiddi vilosity belosity velocty velocit velosit vlocidy velosadee valocity', {
    never: 'velcro velvet vitality', first: /^[vb]/ });
  L('speed', 'speed speeds sped spead speeed spede speedd spedd spd speedy spedes speede spaed spid', { exactForms: 'speading speeding speeded',
    never: 'seed seeds steed spot spots spit spat spent spend spends spin spun spoon speak speck speech spell space spade spoke speaker spy spread spreads spoil spent seed speedo sped2 spite spice spike spine', first: /^s/ });
  L('fast', 'fast quick quickly fastr', { exact: true });
  L('fasterw', 'faster quicker fastest quickest faestr fastar', { exact: true });
  L('slows', 'slows slower slowing slowed slowr slowz sloer slowest', { exact: true });
  L('rate', 'rate rates rait raet reat reate rayt rayte rat ratt raite raitt ratte rte raate raitte rayyt reait reet rt rae rite ryte rit', {
    never: 'right write wrote rot rut root route ray rays rain raid race rice red rest rats rid ride rise raise ret ate rats rot', first: /^r/ });
  L('direction', 'direction directions direkshun direkshon direckshun direckshon derection drekshun dirrection direktion derektion dirkshun directin directon direcshun direshun dirrekshun drection direcion directshun direcsion dirrektion derecshun direcshon derekshun diresion direction2 directon direkshin direckshin direcktion derektshun dirshun direcsun', {
    never: 'detection dejection dissection dictation diction dictionary direct2 election erection correction directly directory', first: /^d/ });
  L('heading', 'heading bearing headin heding', { exact: true });
  L('distance', 'distance distances distanse distence distunce dist distanc distans distanze distanse distanc distanse distence distanc distnce distane distence distanse distanc', {
    never: 'distant distinct instance', first: /^d/ });
  L('increase', 'increase increases increased increasing increse increeses incresis encreses incrase inkrease increasse incresses increasis incrases incrses encrease encreases inkreases increasses incrase incrasis increesing incresing inkreasing incrisis incresses increces increes incrses incrase increas incrasing', {
    never: 'incredible incurs increment', first: /^[ie]/ });
  L('decrease', 'decrease decreases decreased decreasing decrese deecreeses dicreses decreeses dicrease dicreas decreace decreasses dekreases decreasess desreeses decrsees decrses decreasis decrase dekrese decreses dicreeses decreaces decresing decreasing decrese dekreasess decreesing decreas dicrese dicreeses dekrease decreesis', {
    never: 'decree decrees deceased decor decide decided degree degrees decreed', first: /^d/ });
  L('upish', 'up more bigger larger higher greater grows grow growing grew rises rise rising rose gains gain gaining climbs climb bigr biger biggr gets2 greater rising goes2 morr', { exact: true });
  L('downish', 'down lower less fewer smaller drops drop dropping falls fall falling declines decline reduces reduce reduced reducing shrinks shrink shrinking smaler smallr lowr lessens lessen lowers dropz downs', { exact: true });
  L('not', 'not nott nto no never nevr nevur dont doesnt dosnt dosent dusnt dusent duznt dosn doesn dosen doent donot doesnot dosnot dusnot isnt isent wont non nawt naut nt dnt dosent dusn dusnt dunt dont doesn dont doesent nat net nit nut onot', { exact: true });
  L('vary', 'vary varys varies vari verry varey vry varry vaery vareing varying varyes vairy veary varee varie varrys varied varyin varyng vairee vary2 varyed variys', {
    never: 'vera vara', first: /^v/ });
  L('very', 'very vary2', { exact: true });
  L('same', 'same saym saim saem sayme samee seim sayem', { exact: true });
  L('when', 'when wen wenn whenn whn wne whne wehn whe whenever wnen', { exact: true });
  L('object', 'object objects objekt objeckt objeck objct objcts objec objecs obbject ojects ojbect objet obejct obgect obhect obj objs objectz objecktz objectt objeckts objekts obect obects objct objeks obejcts obecjt objeckz abject objeckt objict objact objekt', {
    never: 'objective objection subject project', first: /^[oa]/ });
  L('thing', 'thing things thang thingy something somthing sumthin sumthing somthin car cars ball balls vehicle robot person runner bike truck kid item thng', { exact: true });
  L('describing', 'describing describe describes described describs discribing describin desribing describng describ discribe discribes dscribing descriping discriping  describeing descibing descriing discribd discribed descibe descibes discribin descrbing descriibing describ', {
    never: 'describ2', first: /^[dt]|^s/ });
  L('tells', 'tells tell telling shows show showing showed desc dsc describ2', { exact: true });
  L('moving', 'moving move moves moved moveing movin mooving movng moovin mooveing movement movment mving moveng moovng movig mowing2 moves2 movinng moovin mofing moovng', { never: 'mowing mooing', first: /^m/ });
  L('negative', 'negative negitive nagative negativ negatif negitve nigative neggative negitiv negatve negetive neagtive negativity neg negitive negtive negatve nagativ nagitive negativ negitif negatiff negativee nigitive nigitiv negative2', {
    never: 'native natives navigate nation', first: /^n/ });
  L('positive', 'positive posetive pozitiv posativ posatif positiv positve pozitive posative positif posotive positave positivee pos posetiv pozetive pozetiv positiff posativ posatv posetif posetiff pozative posativ positve', {
    never: 'possible positively position positions', first: /^p/ });
  L('constant', 'constant konstant constint constent constan constnt const contant konstint konstent contstant constnat constantly constint kontant constan konstint konstantt constat constatnt', {
    never: 'content contents consonant contact contend contest constants2 consent', first: /^[ck]/ });

  /* words that are never glued onto their neighbour, and real words that are never a typo of a keyword */
  const STOP = new Set(sp('a an the of in is it its to on at or and that this uv ov uf n as by he we be do so if my me you they their there with for from are was how when what which who'));
  const NEVER_ALL = new Set();
  LEX.forEach((l) => l.never.forEach((w) => NEVER_ALL.add(w)));

  /* words that mean one concept in the 2-word terms */
  const TERM_LEMMAS = ['motion', 'acceleration', 'reference', 'velocity', 'constant', 'negative', 'positive'];

  /* ------------------------------------------------------------------ word -> lemma scores */
  /** Letters of a phonetic key without its vowel class. */
  const consOf = (k) => k.replace(/a/g, '');
  function lcsLen(a, b) {
    const m = [];
    for (let i = 0; i <= a.length; i++) { m[i] = new Array(b.length + 1).fill(0); }
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) m[i][j] = a[i - 1] === b[j - 1] ? m[i - 1][j - 1] + 1 : Math.max(m[i - 1][j], m[i][j - 1]);
    return m[a.length][b.length];
  }
  /** A kid may change vowels, double letters or add letters, but drops few consonants: "side" is not "sped", "division" is not "direction". */
  function consonantsKept(kx, kf) {
    const cf = consOf(kf), cx = consOf(kx);
    const allow = kf.length >= 9 ? 2 : kf.length >= 6 ? 1 : 0;
    return lcsLen(cf, cx) >= cf.length - allow;
  }
  function keyDistOK(kx, kf) {
    const first = (k) => k.charAt(0);
    if (first(kx) !== first(kf)) return -1;
    if (kx === kf) return 0;
    const L_ = kf.length, d = dl(kx, kf);
    const tol = Math.max(1, Math.floor(0.3 * L_));
    if (d > tol) return -1;
    if (L_ <= 4 && !nonSub(kx, kf)) return -1;
    if (!consonantsKept(kx, kf)) return -1;
    return d / L_;
  }
  function rawDistOK(x, f, kx, kf) {
    if (kx.charAt(0) !== kf.charAt(0) && x.charAt(0) !== f.charAt(0)) return -1;
    const n = f.length;
    const tol = n <= 6 ? 1 : n <= 8 ? 2 : n <= 11 ? 3 : 4;
    const d = dl(x, f);
    if (d > tol) return -1;
    if (n <= 4 && !nonSub(x, f)) return -1;
    if (!(d === 1 && n >= 5) && !consonantsKept(kx, kf)) return -1;   // one slip in a longer word is always a typo
    return d / n + 0.02;
  }
  /** Score of a word against a lemma: 0 is a known variant, small is a close fuzzy match, Infinity is no match. */
  function scoreLemma(lem, w) {
    if (lem.set.has(w)) return 0;
    if (lem.never.has(w)) return Infinity;
    if (lem.exact) return Infinity;
    if (w.length < 4) return Infinity;
    let best = Infinity;
    const stems = stemForms(w);
    for (let i = 0; i < stems.length && (!lem.first || lem.first.test(w)); i++) {
      const x = stems[i];
      if (lem.set.has(x)) return 0.01;
      if (x.length < 3 || lem.never.has(x)) continue;
      const kx = phon(x);
      if (!kx) continue;
      for (let j = 0; j < lem.fk.length; j++) {
        const f = lem.fk[j];
        let s = keyDistOK(kx, f.k);
        if (s >= 0) best = Math.min(best, s + 0.03);
        s = rawDistOK(x, f.f, kx, f.k);
        if (s >= 0) best = Math.min(best, s + 0.03);
      }
    }
    // consonants only ("pstn", "vlcty", "rference"): the skeleton is the same, or a letter off when no vowel was typed
    if (best === Infinity && w.length >= 4 && !lem.never.has(w)) {
      const sw = skel(w), noVowel = !/[aeiou]/.test(w);
      for (let j = 0; j < lem.sk.length; j++) {
        const f = lem.sk[j];
        if (Math.abs(w.length - lem.canon.length) > 4 && !noVowel) continue;
        if (sw === f && (f.length >= 4 || (noVowel && lem.canon.length >= 6))) { best = Math.min(best, 0.4); break; }
        if (noVowel && sw.charAt(0) === f.charAt(0) && f.length >= 4 && dl(sw, f) <= Math.floor(0.25 * f.length)) best = Math.min(best, 0.45);
      }
    }
    return best;
  }
  /** All lemmas a word could be, best first: [{id, score}]. Ties are kept. */
  function classifyWord(w) {
    if (!w) return [];
    const out = [];
    for (let i = 0; i < LEX.length; i++) {
      const s = scoreLemma(LEX[i], w);
      if (s !== Infinity) out.push({ id: LEX[i].id, score: s });
    }
    if (!out.length) return out;
    const min = Math.min.apply(null, out.map((o) => o.score));
    return out.filter((o) => o.score <= min + 0.001);
  }

  /* ------------------------------------------------------------------ text -> matches */
  /** match = { lemma, a, b (token indexes), start, end (characters), typed, exact, implied? } */
  function findMatches(text) {
    const src = stripMarks(text);
    const toks = tokenize(text);
    const matches = [];
    const used = new Array(toks.length).fill(false);
    const push = (lemma, a, b, start, end, score) => {
      matches.push({ lemma, a, b, start, end, typed: src.slice(start, end), exact: score < 0.02, score });
    };
    // 1. whole words
    toks.forEach((t, i) => {
      classifyWord(t.w).forEach((c) => { push(c.id, i, i, t.start, t.end, c.score); used[i] = true; });
    });
    const has = (i, id) => matches.some((m) => m.a <= i && m.b >= i && m.lemma === id);
    const changeNear = (i) => { for (let k = i + 1; k <= Math.min(toks.length - 1, i + 3); k++) if (has(k, 'change')) return true; return false; };
    // 2. words that only count in context
    for (let i = matches.length - 1; i >= 0; i--) {
      const m = matches[i], t = toks[m.a];
      if (m.lemma === 'rate' && (/^r+a+t+$/.test(t.w) || /^(rite|ryte|rit)$/.test(t.w)) && t.w !== 'rate' && !changeNear(m.a)) { matches.splice(i, 1); }
      else if (m.lemma === 'very') {
        const nx = toks[m.a + 1];
        const ok = !nx || /^(or|orr|ore|and|an|n|of|ov|uv|oh)$/.test(nx.w) || has(m.a + 1, 'change');
        if (ok) m.lemma = 'vary'; else matches.splice(i, 1);
      }
    }
    // "how fast" = a rate / a speed said in other words
    toks.forEach((t, i) => {
      if (t.w === 'how' && toks[i + 1] && has(i + 1, 'fast')) push('howfast', i, i + 1, t.start, toks[i + 1].end, 0.5);
      if (t.w === 'which' || t.w === 'wich' || t.w === 'what' || t.w === 'wat' || t.w === 'witch') {
        if (toks[i + 1] && /^(way|wae|wy)$/.test(toks[i + 1].w)) push('direction', i, i + 1, t.start, toks[i + 1].end, 0.5);
      }
    });
    // 3. split-up words: "loc ation", "ac cel er ation"
    const covered = (i) => matches.some((m) => m.a <= i && m.b >= i && m.lemma !== 'thing' && m.lemma !== 'when');
    for (let i = 0; i < toks.length; i++) {
      if (covered(i)) continue;
      for (let n = 4; n >= 2; n--) {
        if (i + n > toks.length) continue;
        let ok = true, joined = '';
        for (let k = i; k < i + n; k++) { if (covered(k) || toks[k].w.length > 7 || STOP.has(toks[k].w) || (toks[k].w.length >= 4 && NEVER_ALL.has(toks[k].w))) { ok = false; break; } joined += toks[k].w; }
        if (!ok || joined.length < 5 || joined.length > 16) continue;
        const cl = classifyWord(joined);
        if (cl.length) {
          cl.forEach((c) => push(c.id, i, i + n - 1, toks[i].start, toks[i + n - 1].end, c.score + 0.05));
          break;
        }
      }
    }
    // 4. run-together words: "whenanobjectsspeeddecreases"
    toks.forEach((t, i) => {
      if (t.w.length < 8 || matches.some((m) => m.a === i && m.b === i && m.exact)) return;
      const cands = [];
      const w = t.w;
      LEX.forEach((lem) => {
        // exact pieces (variants of 5+ letters)
        lem.forms.forEach((f) => {
          if (f.length < (lem.exact ? 5 : 4) || /\d/.test(f)) return;
          let at = w.indexOf(f);
          while (at >= 0) { if (!lem.never.has(f)) cands.push({ lem: lem.id, s: at, e: at + f.length, score: 0 }); at = w.indexOf(f, at + 1); }
        });
        if (lem.exact || lem.canon.length < 5) return;
        const L_ = lem.canon.length;
        for (let len = Math.max(4, L_ - 2); len <= L_ + 2; len++) {
          for (let s = 0; s + len <= w.length; s++) {
            const sub = w.slice(s, s + len);
            if (lem.never.has(sub)) continue;
            if (lem.first && !lem.first.test(sub)) continue;
            const ksub = phon(sub);
            let best = Infinity;
            for (let j = 0; j < lem.fk.length; j++) {
              const kf = lem.fk[j].k;
              const d = dl(ksub, kf);
              const tol = Math.max(1, Math.floor(0.25 * kf.length));
              if (ksub.charAt(0) === kf.charAt(0) && d <= tol && (kf.length > 4 || nonSub(ksub, kf))) best = Math.min(best, d / kf.length);
            }
            if (best !== Infinity) cands.push({ lem: lem.id, s, e: s + len, score: 0.1 + best + Math.abs(len - L_) * 0.01 });
          }
        }
      });
      cands.sort((x, y) => x.score - y.score || (y.e - y.s) - (x.e - x.s));
      const taken = [];
      cands.forEach((c) => {
        if (taken.some((u) => c.s < u.e && c.e > u.s && !(u.lem === c.lem && false))) {
          // overlapping a better piece: allow only if it is the very same span and another lemma tie
          return;
        }
        taken.push(c);
        push(c.lem, i, i, t.start + c.s, t.start + c.e, c.score);
      });
    });
    matches.sort((x, y) => x.start - y.start || y.end - x.end);
    return { text: src, toks, matches };
  }

  /* ------------------------------------------------------------------ the 7 terms */
  /* core / support item: { key, word (teacher's spelling), any: [lemma ids], show: [strings to light up in the definition] } */
  const C = (key, word, any, show) => ({ key, word, any: sp(any), show: show || [word] });
  const SPEC = {
    motion: {
      term: 'Motion', def: 'Change in position', termWords: [['motion']],
      core: [C('change', 'change', 'change', ['Change']), C('position', 'position', 'position place location spot', ['position'])],
      support: [],
    },
    acceleration: {
      term: 'Acceleration', def: 'The rate of change in velocity/speed', termWords: [['acceleration']],
      core: [C('rate', 'rate', 'rate howfast', ['rate']), C('change', 'change', 'change', ['change']), C('speed', 'velocity', 'velocity speed', ['velocity/speed'])],
      support: [],
    },
    'reference-point': {
      term: 'Reference Point', def: 'The location of the observer of motion', termWords: [['reference'], ['point']],
      core: [C('location', 'location', 'location place where spot position', ['location']), C('observer', 'observer', 'observer watch view look', ['observer'])],
      support: [C('motion', 'motion', 'motion', ['motion'])],
    },
    velocity: {
      term: 'Velocity', def: 'Describing a moving object using speed and direction', termWords: [['velocity']],
      core: [C('speed', 'speed', 'speed', ['speed']), C('direction', 'direction', 'direction heading', ['direction'])],
      impliedSpeed: 'howfast',
      support: [C('describing', 'describing', 'describing tells', ['Describing']), C('moving', 'moving', 'moving', ['moving']), C('object', 'object', 'object thing', ['object'])],
    },
    'constant-speed': {
      term: 'Constant Speed', def: 'A speed that does not vary or change', termWords: [['constant'], ['speed']],
      core: [C('speed', 'speed', 'speed', ['speed']), C('not', 'not', 'not', ['does not']), C('change', 'change', 'change vary', ['vary or change'])],
      support: [],
    },
    'negative-acceleration': {
      term: 'Negative Acceleration', def: "When an object's speed decreases", termWords: [['negative'], ['acceleration']],
      core: [C('speed', 'speed', 'speed velocity', ['speed']), C('decrease', 'decreases', 'decrease downish slows decel', ['decreases'])],
      support: [C('when', 'when', 'when', ['When']), C('object', 'object', 'object thing', ["object's"])],
    },
    'positive-acceleration': {
      term: 'Positive Acceleration', def: "When an object's speed increases", termWords: [['positive'], ['acceleration']],
      core: [C('speed', 'speed', 'speed velocity', ['speed']), C('increase', 'increases', 'increase upish fasterw', ['increases'])],
      support: [C('when', 'when', 'when', ['When']), C('object', 'object', 'object thing', ["object's"])],
    },
  };
  const IDS = Object.keys(SPEC);
  /* implied speed: "slows down", "gets faster" tell about speed without the word */
  const IMPLIES_SPEED = { 'negative-acceleration': 'slows fasterw howfast', 'positive-acceleration': 'slows fasterw howfast', velocity: 'howfast' };

  /* ------------------------------------------------------------------ evaluation helpers */
  function pickMatch(M, ids) {
    let best = null;
    M.matches.forEach((m) => {
      if (ids.indexOf(m.lemma) < 0) return;
      if (!best || m.score < best.score - 0.001) best = m;
    });
    return best;
  }
  const lower = (s) => String(s).toLowerCase();
  function foundItem(item, m) {
    let word = item.word;
    if (m && item.any.length > 1 && lower(m.lemma) === m.lemma && LEXBY[m.lemma]) {
      // a speed/velocity pair: the teacher's word is whichever one he used
      if (item.key === 'speed' && m.lemma === 'speed' && item.any.indexOf('speed') >= 0 && item.word === 'velocity') word = 'speed';
    }
    if (item.key === 'not' && m) word = lower(m.typed) === 'not' ? 'not' : 'does not';
    if (item.key === 'change' && m && m.lemma === 'vary') word = 'vary';
    return { key: item.key, word, typed: m ? m.typed : '', start: m ? m.start : -1, end: m ? m.end : -1 };
  }
  const negatedBefore = (M, m) => {
    for (let k = m.a - 1; k >= Math.max(0, m.a - 2); k--) if (M.matches.some((x) => x.lemma === 'not' && x.a <= k && x.b >= k)) return true;
    return false;
  };
  const wordsList = (a) => (a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);

  /* ------------------------------------------------------------------ gradeDefinition */
  function gradeDefinition(termId, text) {
    const spec = SPEC[termId];
    const res = { verdict: 'wrong', found: [], missing: [], missingWords: [], tip: '' };
    if (!spec) { res.tip = 'Unknown term.'; return res; }
    const M = findMatches(text);
    const found = [], missingCore = [], missingSupport = [], implied = [];
    const usedSpans = [];

    let coreItems = spec.core;
    let sameRoute = false;
    if (termId === 'constant-speed') {
      const nt = pickMatch(M, ['not']), ch = pickMatch(M, ['change', 'vary']);
      if (!(nt && ch)) {
        const sm = pickMatch(M, ['same']);
        if (sm) { sameRoute = true; coreItems = [spec.core[0]]; }
      }
    }
    coreItems.forEach((item) => {
      let m = pickMatch(M, item.any);
      let isImplied = false;
      if (!m && item.key === 'speed' && IMPLIES_SPEED[termId]) {
        m = pickMatch(M, sp(IMPLIES_SPEED[termId]));
        if (m) isImplied = true;
      }
      if (m && !isImplied) found.push(foundItem(item, m));
      else if (m && isImplied) { implied.push(item); }
      else missingCore.push(item);
    });
    if (sameRoute) {
      const sm = pickMatch(M, ['same']);
      found.push({ key: 'same', word: 'same', typed: sm.typed, start: sm.start, end: sm.end });
    }
    const supFound = [];
    spec.support.forEach((item) => {
      const m = pickMatch(M, item.any);
      if (m) { supFound.push(item); found.push(foundItem(item, m)); } else missingSupport.push(item);
    });

    /* contradictions */
    let contra = '';
    if (termId === 'negative-acceleration' || termId === 'positive-acceleration') {
      const bad = termId === 'negative-acceleration' ? ['increase', 'upish', 'fasterw'] : ['decrease', 'downish', 'slows', 'decel'];
      const m = M.matches.find((x) => bad.indexOf(x.lemma) >= 0 && !negatedBefore(M, x));
      // "speeds up" says up; "slows down" says down. Only the opposite meaning is a contradiction.
      if (m) contra = termId === 'negative-acceleration' ? 'Negative acceleration is speed decreasing, not increasing.' : 'Positive acceleration is speed increasing, not decreasing.';
    }
    if (termId === 'velocity' && !pickMatch(M, ['direction', 'heading']) && pickMatch(M, ['distance'])) contra = 'Velocity needs a direction, not a distance.';
    if (termId === 'constant-speed' && !pickMatch(M, ['not']) && pickMatch(M, ['change', 'vary']) && !sameRoute) contra = 'Constant speed does not change. Say that it does not vary or change.';

    res.found = found.sort((a, b) => a.start - b.start);
    const missCoreAll = missingCore.concat(implied);
    if (contra || missingCore.length) {
      res.verdict = 'wrong';
      res.missing = missingCore.map((i) => i.key);
      res.missingWords = missingCore.map((i) => i.word);
      res.tip = contra || (missingCore.length ? 'Still missing: ' + wordsList(res.missingWords) + '.' : '');
      if (!String(text || '').trim()) res.tip = '';
      return res;
    }
    const need = Math.ceil(spec.support.length / 2);
    const enough = supFound.length >= need;
    if (implied.length || sameRoute || !enough) {
      res.verdict = 'almost';
      const miss = [];
      implied.forEach((i) => miss.push(i));
      if (sameRoute) { miss.push(spec.core[1]); miss.push(spec.core[2]); }
      if (!enough) missingSupport.forEach((i) => miss.push(i));
      res.missing = miss.map((i) => i.key);
      res.missingWords = miss.map((i) => (i.key === 'not' ? 'does not' : i.key === 'change' && termId === 'constant-speed' ? 'vary or change' : i.word));
      res.tip = sameRoute
        ? 'That means the same thing. The teacher says: "' + spec.def + '".'
        : 'The teacher also uses ' + (res.missingWords.length > 1 ? 'the words ' : 'the word ') + wordsList(res.missingWords.map((w) => '"' + w + '"')) + '.';
      return res;
    }
    res.verdict = 'correct';
    // gentle note when a different word meant the same thing
    const swaps = res.found.filter((f) => lower(f.typed) !== lower(f.word) && SYN_NOTE(spec, f, M));
    if (swaps.length) res.tip = 'You wrote "' + swaps[0].typed + '". The teacher says "' + swaps[0].word + '".';
    return res;
  }
  /** Was this found item a real synonym (not just a spelling)? */
  function SYN_NOTE(spec, f, M) {
    const item = spec.core.concat(spec.support).find((i) => i.key === f.key);
    if (!item) return false;
    const m = M.matches.find((x) => x.start === f.start && x.end === f.end && item.any.indexOf(x.lemma) >= 0);
    if (!m) return false;
    return m.lemma !== item.any[0] && !(item.key === 'speed' && (m.lemma === 'speed' || m.lemma === 'velocity'));
  }

  /* ------------------------------------------------------------------ gradeTerm */
  function gradeTerm(termId, text) {
    const spec = SPEC[termId];
    const res = { verdict: 'wrong', found: [], missing: [], missingWords: [], tip: '' };
    if (!spec) { res.tip = 'Unknown term.'; return res; }
    const M = findMatches(text);
    const need = spec.termWords.map((w) => w[0]);
    const words = spec.term.split(' ');
    const miss = [];
    need.forEach((id, i) => {
      const m = pickMatch(M, [id]);
      if (m) res.found.push({ key: id, word: words[i], typed: m.typed, start: m.start, end: m.end });
      else miss.push(i);
    });
    res.found.sort((a, b) => a.start - b.start);
    // typing a different term as well ("negative positive acceleration") is not the answer
    const other = TERM_LEMMAS.filter((id) => need.indexOf(id) < 0).filter((id) => {
      const m = pickMatch(M, [id]);
      return m && (m.exact || m.score < 0.3);
    });
    if (miss.length) {
      res.missing = miss.map((i) => need[i]);
      res.missingWords = miss.map((i) => words[i]);
      res.tip = String(text || '').trim() ? 'The term is "' + spec.term + '".' : '';
      return res;
    }
    if (other.length) { res.tip = 'The term is "' + spec.term + '".'; return res; }
    res.verdict = 'correct';
    return res;
  }

  /** Character ranges inside the teacher's definition for some keys (for highlighting). */
  function defRanges(termId, keys) {
    const spec = SPEC[termId];
    if (!spec) return [];
    const out = [];
    spec.core.concat(spec.support).forEach((item) => {
      if (keys && keys.indexOf(item.key) < 0) return;
      item.show.forEach((s) => {
        const at = spec.def.indexOf(s);
        if (at >= 0) out.push([at, at + s.length, item.key]);
      });
    });
    return out.sort((a, b) => a[0] - b[0]);
  }

  const api = {
    gradeDefinition, gradeTerm, defRanges, normText: stripMarks, SPEC, IDS,
    _internal: { tokenize, phon, dl, classifyWord, findMatches, scoreLemma, LEX },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root && typeof root === 'object') root.DefGrade = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
