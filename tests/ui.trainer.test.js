// UI test for the "Type the 7 definitions" trainer.
//   NODE_PATH=$(npm root -g) node tests/ui.trainer.test.js
// Serves this folder with python3 -m http.server, runs the mock Firebase from /tmp/claude-0/mockfb for the two-device check.
// Screenshots go to $SHOTS (default /tmp/claude-0/shots).
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const SITE_PORT = 8791, MOCK_PORT = 9199;
const SITE = `http://127.0.0.1:${SITE_PORT}/`, MOCK = `http://127.0.0.1:${MOCK_PORT}`;
const SHOTS = process.env.SHOTS || '/tmp/claude-0/shots';
fs.mkdirSync(SHOTS, { recursive: true });

let pass = 0, fail = 0;
const check = (name, ok, extra) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : '  -> ' + (extra === undefined ? '' : JSON.stringify(extra)))); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const consoleErrors = [];

const DEF = {
  motion: 'Change in position', acceleration: 'The rate of change in velocity/speed', 'reference-point': 'The location of the observer of motion',
  velocity: 'Describing a moving object using speed and direction', 'constant-speed': 'A speed that does not vary or change',
  'negative-acceleration': "When an object's speed decreases", 'positive-acceleration': "When an object's speed increases",
};
const TERM = { motion: 'Motion', acceleration: 'Acceleration', 'reference-point': 'Reference Point', velocity: 'Velocity', 'constant-speed': 'Constant Speed', 'negative-acceleration': 'Negative Acceleration', 'positive-acceleration': 'Positive Acceleration' };
const IDS = Object.keys(DEF);
// terrible spelling, still right
const BAD_DEF = {
  motion: 'chanj in posishun', acceleration: 'the rat uv chanj in vlosity', 'reference-point': 'lokashin uv the obzrvr uf moshin',
  velocity: 'discribing a movin objekt usin sped and direkshun', 'constant-speed': 'a sped that dus not vari or chanj',
  'negative-acceleration': 'wen an objekts sped deecreeses', 'positive-acceleration': 'wen an objekts sped encreses',
};
const BAD_TERM = {
  motion: 'moshun', acceleration: 'aksellerashun', 'reference-point': 'refrens point', velocity: 'velosity', 'constant-speed': 'konstant sped',
  'negative-acceleration': 'negitive axeleration', 'positive-acceleration': 'posetive acceleration',
};
const CAPTION = {
  motion: "Its position keeps changing. That's motion.", acceleration: 'Watch the speedometer needle move: the speed is changing.',
  'reference-point': "Who is watching decides what looks like it's moving.", velocity: 'Speed alone could go anywhere. Speed and direction pin it down.',
  'constant-speed': 'Same gap every second. The speed does not vary or change.', 'negative-acceleration': 'The gaps shrink: speed decreases.', 'positive-acceleration': 'The gaps grow: speed increases.',
};

/* ---------------- servers ---------------- */
const procs = [];
function startServer(cmd, args, opts, readyRe) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, Object.assign({ stdio: ['ignore', 'pipe', 'pipe'] }, opts));
    procs.push(p);
    let buf = '';
    const on = (d) => { buf += d.toString(); if (!readyRe || readyRe.test(buf)) resolve(p); };
    p.stdout.on('data', on); p.stderr.on('data', on);
    p.on('error', reject);
    setTimeout(() => resolve(p), 2500);
  });
}
const admin = async (what) => (await fetch(MOCK + '/__admin/' + what)).json();

/* ---------------- page helpers ---------------- */
let browser;
async function newDevice(o) {
  o = o || {};
  const ctx = await browser.newContext({ viewport: o.viewport || { width: 1366, height: 768 }, reducedMotion: o.reducedMotion });
  const cfg = o.cfg === undefined ? "window.QUIZ_CONFIG={dbUrl:''};" : o.cfg;
  await ctx.route('**/config.js', (r) => r.fulfill({ contentType: 'application/javascript', body: cfg }));
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ contentType: 'text/css', body: '' }));
  const page = await ctx.newPage();
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/Failed to load resource/.test(t) && /404/.test(t) && !fs.existsSync(path.join(ROOT, 'diagrams-d.js'))) return; // diagrams-d.js is built by another agent
    consoleErrors.push('console.error: ' + t);
  });
  return { ctx, page };
}
async function home(page, hash) {
  await page.goto(SITE + (hash ? '#' + hash : ''));
  await page.waitForSelector('.home .wordmark', { timeout: 15000 });
}
const cardInfo = (page) => page.evaluate(() => { const s = document.querySelector('.tr-screen'); return s ? { kind: s.dataset.kind, term: s.dataset.term } : null; });
async function typeIn(page, text) { await page.fill('#trTa', text); await page.press('#trTa', 'Enter'); }
async function noteKind(page) { await page.waitForSelector('.tr-note, [data-note=teach]', { timeout: 8000 }); return page.evaluate(() => { const n = document.querySelector('.tr-note'); return n ? n.dataset.note : (document.querySelector('[data-note=teach]') ? 'teach' : null); }); }
const learnedText = (page) => page.evaluate(() => (document.querySelector('[data-trainer-count]') || document.querySelector('.tr-count') || {}).textContent);
const forceCard = (page, kind, term) => page.evaluate(([k, t]) => { const tr = MaxMotion.state.tr; tr.queue[tr.idx] = { kind: k, term: t }; MaxMotion.showTrainerCard(); }, [kind, term]);
const hist = (page, key) => page.evaluate((k) => { const r = MaxMotion.Store.get(k); return r ? r.hist.slice() : []; }, key);
const shot = (page, name, full) => page.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: !!full });
const svgSig = (page) => page.evaluate(() => { const h = document.querySelector('.tr-diagram-host, .mt-host'); return h ? h.innerHTML.length + ':' + (h.innerHTML.match(/(?:transform|d|cx|cy|x|y|width|stroke-dashoffset|opacity)="[^"]*"/g) || []).join('').length + ':' + [...h.querySelectorAll('[transform]')].map((n) => n.getAttribute('transform')).join('|') : ''; });

async function startTyping(page) { await page.click('[data-trainer-go]'); await page.waitForSelector('#trTa'); }

/* =================================================================== */
async function homeAndCardTests() {
  const { ctx, page } = await newDevice();
  await home(page);
  const doc = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth, iw: innerWidth, ih: innerHeight }));
  check('home 1366x768 fits without scrolling', doc.h <= doc.ih, doc);
  check('home: trainer card with 0 of 7 and 7 chips', await page.evaluate(() => {
    const c = document.querySelector('.trainer-card'); return !!c && /0 of 7/.test(c.querySelector('[data-trainer-count]').textContent) && c.querySelectorAll('.dchip').length === 7 && /Start typing/.test(c.querySelector('[data-trainer-go]').textContent) && /Type the 7 definitions/.test(c.textContent);
  }));
  check('home: trainer card is above Today\'s session', await page.evaluate(() => { const a = document.querySelector('.trainer-card').getBoundingClientRect().top, b = document.querySelector('.session-card').getBoundingClientRect().top; return a < b; }));
  check('home: Key definitions drill still there', (await page.locator('.defs-card .defs-go').innerText()) === 'Drill them');
  await shot(page, 'home-1366x768', true);

  await startTyping(page);
  const ci = await cardInfo(page);
  check('first card is a definition card for one of the 7', ci && ci.kind === 'def' && IDS.includes(ci.term), ci);
  check('term shown big', (await page.locator('.tr-term').first().innerText()) === TERM[ci.term]);
  const attrs = await page.evaluate(() => { const t = document.getElementById('trTa'); return { tag: t.tagName, sc: t.getAttribute('spellcheck'), ac: t.getAttribute('autocorrect'), cap: t.getAttribute('autocapitalize'), ph: t.getAttribute('placeholder'), focused: document.activeElement === t, af: t.hasAttribute('autofocus') }; });
  check('textarea: spellcheck off, autocorrect off, autocapitalize off, autofocus + focused, exact placeholder', attrs.tag === 'TEXTAREA' && attrs.sc === 'false' && attrs.ac === 'off' && attrs.cap === 'off' && attrs.af && attrs.focused && attrs.ph === "Type it the way you remember it. Spelling doesn't count.", attrs);
  check('progress shows 0 of 7 learned', /0 of 7 learned/.test(await page.locator('.tr-count').innerText()));
  check('Stop for now is available', await page.locator('[data-tr-stop]').isVisible());
  check('Check is disabled until something is typed', await page.locator('[data-tr-check]').isDisabled());
  await shot(page, 'term-card-1366x768');

  // Shift+Enter makes a new line, Enter submits
  await page.fill('#trTa', 'abc');
  await page.press('#trTa', 'Shift+Enter');
  check('Shift+Enter inserts a newline and does not submit', (await page.inputValue('#trTa')).includes('\n') && (await page.locator('.tr-note, [data-note=teach]').count()) === 0);
  await page.fill('#trTa', 'zzz qqq');
  await page.press('#trTa', 'Enter');
  check('wrong answer opens the teach panel', (await noteKind(page)) === 'teach');
  await ctx.close();
}

const BALL = { motion: 'pitch', acceleration: 'windup', 'reference-point': 'viewpoint', velocity: 'pitch', 'constant-speed': 'steady', 'negative-acceleration': 'catch', 'positive-acceleration': 'windup' };
const PLAIN = { motion: 'dtgraph', acceleration: 'rates', 'reference-point': 'reference', velocity: 'possible', 'constant-speed': 'accel', 'negative-acceleration': 'accel', 'positive-acceleration': 'accel' };
/* The teach panel for every term. useBall: the 'baseball' diagram type is used when it is registered (diagrams-d.js);
 * false: it is hidden on purpose to check the plain diagrams that are the fallback. */
async function teachPanelTests(useBall) {
  const { ctx, page } = await newDevice();
  await home(page);
  const registered = await page.evaluate(() => window.Diagrams.has('baseball'));
  if (!useBall) await page.evaluate(() => { const o = window.Diagrams.has; window.Diagrams.has = (t) => (t === 'baseball' ? false : o(t)); });
  const ball = useBall && registered;
  console.log(`  (baseball diagrams ${registered ? 'registered' : 'not registered'}; testing the ${ball ? 'baseball' : 'plain'} configs)`);
  await startTyping(page);
  for (const id of IDS) {
    await forceCard(page, 'def', id);
    await page.waitForSelector('#trTa');
    await page.click('[data-tr-idk]');
    await page.waitForSelector('[data-note=teach]');
    const info = await page.evaluate(() => {
      const d = document.querySelector('[data-teach-def]');
      return {
        def: d.textContent, marks: [...d.querySelectorAll('mark')].map((m) => m.textContent),
        caption: document.querySelector('[data-caption]').textContent,
        mn: [...document.querySelectorAll('.tr-mn .mn b')].map((b) => b.textContent).join(''),
        gesture: (document.querySelector('.tr-gesture') || {}).textContent, bb: (document.querySelector('.tr-bb') || {}).textContent,
        hook: (document.querySelector('.tr-hook') || {}).textContent, pair: !!document.querySelector('[data-pair]'),
        svg: !!document.querySelector('.tr-diagram-host svg'), dg: document.querySelector('.tr-diagram-host').dataset.diagram,
        st: MaxMotion.state.tview.insts[0].getState(),
      };
    });
    const tag = `teach ${id} [${ball ? 'baseball' : 'plain'}]`;
    check(`${tag}: exact definition verbatim`, info.def === DEF[id], info.def);
    check(`${tag}: key words highlighted`, info.marks.length >= 1, info.marks);
    check(`${tag}: caption`, info.caption === CAPTION[id], info.caption);
    check(`${tag}: diagram renders (${info.dg})`, info.svg && info.dg === (ball ? 'baseball' : PLAIN[id]), info.dg);
    if (ball) check(`${tag}: scenario ${BALL[id]}`, info.st.scenario === BALL[id], info.st);
    check(`${tag}: hook, mnemonic (first letters bold), gesture line, baseball version`, !!info.hook && info.mn.length >= 2 && /^Do this while you say it/.test(info.gesture) && /^Baseball version/.test(info.bb), info);
    check(`${tag}: pair note only on the two acceleration signs`, info.pair === (id === 'negative-acceleration' || id === 'positive-acceleration'), info.pair);
    const a = await svgSig(page); await sleep(900); const b = await svgSig(page);
    check(`${tag}: diagram animates`, a !== b, [a.slice(0, 60), b.slice(0, 60)]);
    if (id === 'reference-point') {
      if (ball) {
        check('reference-point: starts with the catcher watching', info.st.observer === 'catcher', info.st);
        await page.waitForFunction(() => MaxMotion.state.tview.insts[0].getState().observer === 'stands', null, { timeout: 5500 });
        check('reference-point: switches to the stands after about 3 seconds', true);
      } else {
        check('reference-point: starts on the platform', info.st.viewpoint === 'platform', info.st);
        await page.waitForFunction(() => MaxMotion.state.tview.insts[0].getState().viewpoint === 'train', null, { timeout: 5500 });
        check('reference-point: switches to the train after about 3 seconds', true);
      }
    }
    if (id === 'velocity' && !ball) {
      check('velocity: starts with no direction', info.st.direction === null, info.st);
      await page.waitForFunction(() => MaxMotion.state.tview.insts[0].getState().direction === 'N', null, { timeout: 4500 });
      check('velocity: direction N appears after about 2 seconds', true);
    }
    if (!ball) {
      if (id === 'negative-acceleration') check('negative: accel params v0 20, a -4', info.st.v0 === 20 && info.st.a === -4 && info.st.kind === 'slowing down', info.st);
      if (id === 'positive-acceleration') check('positive: accel params v0 0, a 3', info.st.v0 === 0 && info.st.a === 3 && info.st.kind === 'speeding up', info.st);
      if (id === 'constant-speed') check('constant: accel a = 0', info.st.a === 0 && info.st.kind === 'constant', info.st);
      if (id === 'acceleration') check('acceleration: rates lane B focus speed', info.st.focus === 'speed', info.st);
    }
    if (id === 'motion' || id === 'reference-point') await shot(page, `teach-${id}-${ball ? 'baseball' : 'plain'}-1366x768`, true);
  }
  await ctx.close();
}

async function flowTests() {
  const { ctx, page } = await newDevice();
  await home(page);
  await startTyping(page);

  // 1. wrong -> teach -> copy -> card returns 2-3 cards later
  const first = await cardInfo(page);
  const seq = [first.term + ':' + first.kind];
  await typeIn(page, 'no idea at all');
  check('wrong shows teach panel', (await noteKind(page)) === 'teach');
  check('wrong is saved as 0 from memory', (await hist(page, 'type-def-' + first.term)).join() === '0');
  await page.waitForTimeout(500);
  await shot(page, 'teach-panel-mid-animation-1366x768', false);
  await page.click('[data-tr-copy]');
  await page.waitForSelector('#trTa');
  await typeIn(page, 'blah blah');
  await page.waitForSelector('[data-copy-msg]:not(:empty)');
  check('copy step: a wrong try stays on the copy step, gently', /Not quite/.test(await page.locator('[data-copy-msg]').innerText()) && (await page.locator('.tr-note').count()) === 0);
  await typeIn(page, DEF[first.term]);
  check('copy step: right text moves on', (await noteKind(page)) === 'copied');
  check('copy step is not saved as from-memory', (await hist(page, 'type-def-' + first.term)).join() === '0');
  await page.click('[data-tr-next]');
  let back = -1;
  for (let i = 1; i <= 6 && back < 0; i++) {
    await page.waitForSelector('#trTa');
    const c = await cardInfo(page);
    seq.push(c.term + ':' + c.kind);
    if (c.term === first.term && c.kind === 'def') { back = i; check('returning card is marked as a retry', await page.locator('.chip.retry').count() === 1); break; }
    await typeIn(page, c.kind === 'rev' ? BAD_TERM[c.term] : BAD_DEF[c.term]);
    await noteKind(page);
    await page.click('[data-tr-next]');
  }
  check('missed card comes back from memory 2 to 3 cards later', back >= 3 && back <= 4, { seq, back });
  check('first cards are from 3 terms in rotation', new Set(seq.slice(0, 3).map((x) => x.split(':')[0])).size <= 3);

  // 2. correct note: underlined key words, teacher spelling beside them, exact definition, mnemonic, baseball
  await forceCard(page, 'def', 'acceleration');
  await page.waitForSelector('#trTa');
  await typeIn(page, 'the rat uv chanj in vlosity');
  check('correct: green note "You\'ve got it."', (await noteKind(page)) === 'correct' && /You've got it\./.test(await page.locator('.note--good .note-head').innerText()));
  const ok = await page.evaluate(() => ({
    u: [...document.querySelectorAll('.tt-typed u')].map((u) => u.textContent), fix: [...document.querySelectorAll('.tt-typed .tt-fix')].map((u) => u.textContent),
    exact: document.querySelector('[data-exact]').textContent, mn: !!document.querySelector('.note--good .tr-mn'), bb: /Baseball version/.test((document.querySelector('.note--good .tr-bb') || {}).textContent || ''),
  }));
  check('correct: matched words underlined, teacher spelling shown when different', ok.u.includes('chanj') && ok.u.includes('vlosity') && ok.fix.includes('change') && ok.fix.includes('rate'), ok);
  check('correct: exact definition + memory trick + baseball version shown', ok.exact === DEF.acceleration && ok.mn && ok.bb, ok);
  check('correct from memory saved as 1', (await hist(page, 'type-def-acceleration')).slice(-1)[0] === 1);
  await page.waitForTimeout(600);
  await shot(page, 'correct-note-1366x768', true);

  // 3. almost: the teacher word that is missing is lit in the exact definition, then "Type it once more"
  await forceCard(page, 'def', 'reference-point');
  await page.waitForSelector('#trTa');
  await typeIn(page, 'the lokashun of the obzervur');
  check('almost: note', (await noteKind(page)) === 'almost');
  const al = await page.evaluate(() => ({ miss: [...document.querySelectorAll('.tr-exact mark.def-miss')].map((m) => m.textContent), head: document.querySelector('.note-head').textContent, again: !!document.querySelector('[data-tr-again]'), typed: document.querySelector('[data-typed]').textContent }));
  check('almost: missing word "motion" lit up, "Type it once more" offered', al.miss.join() === 'motion' && /Type it once more/.test(await page.locator('[data-tr-again]').innerText()), al);
  check('almost is saved as 0.5 (not mastered)', (await hist(page, 'type-def-reference-point')).slice(-1)[0] === 0.5);
  await page.waitForTimeout(600);
  await shot(page, 'almost-note-1366x768', true);
  await page.click('[data-tr-again]');
  await page.waitForSelector('#trTa');
  check('type once more: definition visible with the missing word lit', (await page.locator('[data-teach-def]').innerText()) === DEF['reference-point'] && (await page.locator('[data-teach-def] mark.def-miss').innerText()) === 'motion');
  await typeIn(page, 'the location of the observer of motion');
  check('type once more: accepted, then Next', (await noteKind(page)) === 'copied');

  // 4. hint ladder
  await forceCard(page, 'def', 'motion');
  await page.waitForSelector('#trTa');
  const before = await hist(page, 'type-def-motion');
  await page.click('[data-tr-hint]');
  check('hint 1 is the mnemonic', /C-P: Change in Position/.test(await page.locator('[data-hint="1"]').innerText()) && (await page.locator('[data-hint="1"] b').count()) >= 2);
  await page.click('[data-tr-hint]');
  check('hint 2 is the first-letter skeleton', (await page.locator('[data-hint="2"] .tr-skel-text').innerText()) === 'C_____ i_ p_______');
  check('no third hint', await page.locator('[data-tr-hint]').isHidden());
  await typeIn(page, 'chanj in posishun');
  check('hinted try: credited in the flow but not as from memory', (await noteKind(page)) === 'correct' && /with a hint/.test(await page.locator('.note-head').innerText()) && JSON.stringify(await hist(page, 'type-def-motion')) === JSON.stringify(before), await hist(page, 'type-def-motion'));
  await forceCard(page, 'def', 'acceleration');
  await page.waitForSelector('#trTa');
  await page.click('[data-tr-hint]'); await page.click('[data-tr-hint]');
  check('skeleton keeps the slash: T__ r___ o_ c_____ i_ v_______/s____', (await page.locator('[data-hint="2"] .tr-skel-text').innerText()) === 'T__ r___ o_ c_____ i_ v_______/s____');
  await forceCard(page, 'def', 'negative-acceleration');
  await page.waitForSelector('#trTa');
  await page.click('[data-tr-hint]'); await page.click('[data-tr-hint]');
  check("skeleton handles 's: W___ a_ o_____'_ s____ d________", (await page.locator('[data-hint="2"] .tr-skel-text').innerText()) === "W___ a_ o_____'_ s____ d________");

  // 5. reverse card: type the term
  await forceCard(page, 'rev', 'velocity');
  await page.waitForSelector('#trTa');
  check('reverse card shows the definition and asks for the term', (await page.locator('.tr-bigdef').first().innerText()) === DEF.velocity && (await page.locator('input#trTa').count()) === 1);
  await typeIn(page, 'vlosity');
  check('reverse: badly spelled term is right', (await noteKind(page)) === 'correct' && (await hist(page, 'type-term-velocity')).slice(-1)[0] === 1);
  await forceCard(page, 'rev', 'constant-speed');
  await page.waitForSelector('#trTa');
  await typeIn(page, 'acceleration');
  check('reverse: wrong term teaches', (await noteKind(page)) === 'teach');
  await page.click('[data-tr-copy]'); await page.waitForSelector('#trTa');
  await typeIn(page, 'constant speed');
  check('reverse: copy step graded with the term grader', (await noteKind(page)) === 'copied');
  check('reverse: wrong answer saved as 0', (await hist(page, 'type-term-constant-speed')).slice(-1)[0] === 0);

  // Stop for now saves progress and returns home
  await page.evaluate(() => MaxMotion.showHome());
  await ctx.close();
}

async function learnAllTests() {
  const { ctx, page } = await newDevice();
  await home(page);
  await startTyping(page);
  let cards = 0, revSeen = 0, learnedOrder = [], firstRevBeforeCm = false, introOK = true;
  const cmOf = (id) => hist(page, 'type-def-' + id).then((h) => h.filter((x) => x >= 1).length);
  const activeTerms = new Set();
  for (let guard = 0; guard < 120; guard++) {
    if (await page.locator('[data-screen=trainer-end]').count()) break;
    await page.waitForSelector('#trTa, [data-screen=trainer-end]');
    if (await page.locator('[data-screen=trainer-end]').count()) break;
    const c = await cardInfo(page);
    cards++;
    activeTerms.add(c.term);
    if (c.kind === 'rev') { revSeen++; if ((await cmOf(c.term)) < 1) firstRevBeforeCm = true; }
    if (cards <= 3 && activeTerms.size > 3) introOK = false;
    // answer wrongly once in a while so teaching runs inside the loop too
    if (cards === 4) {
      await page.click('[data-tr-idk]'); await page.waitForSelector('[data-tr-copy]'); await page.click('[data-tr-copy]'); await page.waitForSelector('#trTa');
      await typeIn(page, c.kind === 'rev' ? TERM[c.term] : DEF[c.term]);
      await noteKind(page); await page.click('[data-tr-next]');
      continue;
    }
    await typeIn(page, c.kind === 'rev' ? BAD_TERM[c.term] : BAD_DEF[c.term]);
    const k = await noteKind(page);
    if (k !== 'correct') { console.log('  unexpected note', k, c, c.kind === 'rev' ? BAD_TERM[c.term] : BAD_DEF[c.term]); }
    await page.click('[data-tr-next]');
  }
  check('all 7 learned ends with the success screen', (await page.locator('[data-screen=trainer-end]').count()) === 1 && /All 7 learned/.test(await page.locator('.bigscore').innerText()), { cards });
  check(`learned within a reasonable number of cards (${cards})`, cards >= 21 && cards <= 60, cards);
  check('reverse cards appeared', revSeen >= 7, revSeen);
  check('a reverse card never comes before the term has a right answer from memory', !firstRevBeforeCm);
  check('only 3 terms in the first 3 cards', introOK);
  const learnedAll = await page.evaluate(() => MaxMotion.Trainer.allLearned() && MaxMotion.Trainer.ids().every((id) => { const s = MaxMotion.Trainer.status(id); return s.cm >= 2 && s.latestOK && s.revOK; }));
  check('each term: 2+ right from memory, latest right, reverse right', learnedAll);
  check('success screen lists all 7 exact definitions', await page.evaluate((D) => [...document.querySelectorAll('.tr-end .study-def')].map((n) => n.textContent).sort().join('|') === Object.values(D).sort().join('|'), DEF));
  await shot(page, 'success-1366x768', true);
  // home afterwards: 7 of 7, persisted over a reload, synthetic ids never reach the mistakes list
  await page.click('[data-tr-done]');
  await page.waitForSelector('.home .wordmark');
  check('home shows 7 of 7 learned', /7 of 7/.test(await learnedText(page)));
  await page.reload();
  await page.waitForSelector('.home .wordmark');
  check('progress survives a reload', /7 of 7/.test(await learnedText(page)));
  check('typing answers never reach the Fix my mistakes list', await page.evaluate(() => MaxMotion.Store.missedIds().length === 0 && Object.keys(MaxMotion.Store._data().missed).filter((k) => /^type-/.test(k)).length === 0));
  await ctx.close();
}

async function stopAndResumeTests() {
  const { ctx, page } = await newDevice();
  await home(page);
  await startTyping(page);
  for (let i = 0; i < 3; i++) {
    const c = await cardInfo(page);
    await typeIn(page, c.kind === 'rev' ? BAD_TERM[c.term] : BAD_DEF[c.term]);
    await noteKind(page); await page.click('[data-tr-next]'); await page.waitForSelector('#trTa');
  }
  const n1 = await page.evaluate(() => MaxMotion.Trainer.all());
  await page.click('[data-tr-stop]');
  await page.waitForSelector('.home .wordmark');
  check('Stop for now returns home with a saved note', /Saved/.test(await page.locator('.home-note').innerText()));
  await page.reload();
  await page.waitForSelector('.home .wordmark');
  const n2 = await page.evaluate(() => MaxMotion.Trainer.all());
  check('per-term progress survives a reload', JSON.stringify(n1) === JSON.stringify(n2));
  await startTyping(page);
  const c = await cardInfo(page);
  check('resuming: the next card is one of the unlearned terms', IDS.includes(c.term));
  await ctx.close();
}

async function memoryTricksTests() {
  for (const [name, vp] of [['1366x768', { width: 1366, height: 768 }], ['390x844', { width: 390, height: 844 }]]) {
    const { ctx, page } = await newDevice({ viewport: vp });
    await home(page);
    await page.click('[data-memory-tricks]');
    await page.waitForSelector('.mt-card');
    check(`memory tricks ${name}: 7 cards with term, exact definition, mnemonic, gesture, baseball`, await page.evaluate((D) => {
      const cards = [...document.querySelectorAll('.mt-card')];
      return cards.length === 7 && cards.every((c) => D[c.dataset.term] === c.querySelector('.mt-def').textContent && c.querySelector('.tr-mn .mn b') && /^Do this/.test(c.querySelector('.tr-gesture').textContent) && /Baseball version/.test(c.querySelector('.tr-bb').textContent));
    }, DEF));
    await page.waitForTimeout(600);
    const mounted = await page.evaluate(() => document.querySelectorAll('.mt-host svg').length);
    check(`memory tricks ${name}: only the visible diagrams are mounted`, mounted >= 1 && mounted < 7 || vp.height > 3000, mounted);
    await shot(page, `memory-tricks-${name}`, false);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const last = await page.evaluate(() => ({ n: document.querySelectorAll('.mt-host svg').length, lastOk: !!document.querySelector('.mt-card:last-child .mt-host svg') }));
    check(`memory tricks ${name}: scrolling to the end mounts the last one and drops the first`, last.lastOk && !(await page.evaluate(() => !!document.querySelector('.mt-card:first-child .mt-host svg'))), last);
    await page.click('[data-mt-back]');
    await page.waitForSelector('.home .wordmark');
    check(`memory tricks ${name}: leaving destroys every diagram`, await page.evaluate(() => !MaxMotion.state.tview));
    await ctx.close();
  }
}

async function sessionTests() {
  const { ctx, page } = await newDevice();
  await home(page);
  check('session card: step 3 is the trainer', /Type the 7 definitions/.test(await page.locator('.session-card .sstep[data-step="3"]').innerText()) && !/known cold/.test(await page.locator('.session-card').innerText()));
  await page.click('[data-session-go]');
  await page.waitForSelector('[data-start]');
  check('step 1 interstitial', /Definitions from memory/.test(await page.locator('.ititle').innerText()));
  await page.click('[data-start]');
  await page.waitForSelector('#trTa');
  check('step 1 uses typing, no hint button, no teaching', (await page.locator('[data-tr-hint]').count()) === 0 && (await cardInfo(page)).kind === 'def');
  const seen = [];
  for (let i = 0; i < 7; i++) {
    await page.waitForSelector('#trTa');
    const c = await cardInfo(page);
    seen.push(c.term);
    // answer 5 right and miss motion + velocity, to see the results feed step 3
    const right = !(c.term === 'motion' || c.term === 'velocity');
    if (right) await typeIn(page, BAD_DEF[c.term]); else await typeIn(page, 'hmm i dont remember');
    const k = await noteKind(page);
    if (i === 0) check('step 1: no teach panel even when wrong (note only)', k !== 'teach');
    await page.click('[data-tr-next]');
  }
  check('step 1: one attempt per term, all 7', new Set(seen).size === 7, seen);
  await page.waitForSelector('.interstitial, .sess-done, .home');
  const s1 = await page.evaluate(() => { const S = MaxMotion.Session.get(); return { step: S.step, s1: S.s1, res: S.res.s1 }; });
  check('step 1 result recorded (5 of 7) and the session moved to step 2', s1.step === 2 && s1.res === '5 of 7' && s1.s1.motion === 0 && s1.s1.velocity === 0 && s1.s1.acceleration === 1, s1);
  check('step 1 attempts are the trainer\'s from-memory history', await page.evaluate(() => MaxMotion.Store.get('type-def-acceleration').hist.join() === '1' && MaxMotion.Store.get('type-def-motion').hist.join() === '0'));
  // skip step 2 (not what this test is about), go to step 3
  await page.evaluate(() => MaxMotion.Session.update((o) => { o.st.s2 = 'done'; o.step = 3; }));
  await page.evaluate(() => MaxMotion.showInterstitial());
  await page.waitForSelector('[data-start]');
  check('step 3 interstitial names the trainer', /Type the 7 definitions/.test(await page.locator('.ititle').innerText()));
  await page.click('[data-start]');
  await page.waitForSelector('#trTa');
  const first = await cardInfo(page);
  check('step 3: the terms missed in step 1 come first', ['motion', 'velocity'].includes(first.term) || (await page.evaluate(() => MaxMotion.state.tr.order.slice(0, 2).join())) === 'motion,velocity', first);
  check('step 3: "Stop for now" is there', await page.locator('[data-tr-stop]').isVisible());
  // stop and come back: still step 3
  await page.click('[data-tr-stop]');
  await page.waitForSelector('.home .wordmark');
  check('after stopping, the session is still on step 3', await page.evaluate(() => MaxMotion.Session.get().step === 3));
  await page.click('[data-session-go]');
  await page.waitForSelector('[data-start]');
  await page.click('[data-start]');
  for (let guard = 0; guard < 120; guard++) {
    await page.waitForSelector('#trTa, [data-screen=trainer-end]');
    if (await page.locator('[data-screen=trainer-end]').count()) break;
    const c = await cardInfo(page);
    await typeIn(page, c.kind === 'rev' ? BAD_TERM[c.term] : BAD_DEF[c.term]);
    await noteKind(page);
    await page.click('[data-tr-next]');
  }
  check('step 3 ends with the success screen when all 7 are learned', (await page.locator('[data-screen=trainer-end]').count()) === 1);
  await page.click('[data-tr-done]');
  await page.waitForSelector('.interstitial');
  const S = await page.evaluate(() => { const o = MaxMotion.Session.get(); return { step: o.step, s3: o.st.s3 }; });
  check('step 3 done, session on to step 4 (graphs)', S.step === 4 && S.s3 === 'done', S);
  await ctx.close();
  // a fresh session where all 7 are already learned skips steps 1 and 3
  const d2 = await newDevice();
  await home(d2.page);
  await d2.page.evaluate(() => { IDS_ = MaxMotion.Trainer.ids(); IDS_.forEach((id) => { for (let i = 0; i < 2; i++) MaxMotion.Store.answerSynth('type-def-' + id, 1); MaxMotion.Store.answerSynth('type-term-' + id, 1); }); MaxMotion.showHome(); });
  check('already learned: home says 7 of 7', /7 of 7/.test(await learnedText(d2.page)));
  await d2.page.click('[data-session-go]');
  await d2.page.waitForSelector('[data-start]');
  check('already learned: steps 1 and 3 are skipped', await d2.page.evaluate(() => { const rows = MaxMotion.Session.rows(MaxMotion.Session.get()); return rows[0].state === 'skipped' && rows[2].state === 'skipped'; }));
  await d2.ctx.close();
}

async function cloudTests() {
  const code = 'max-trainer-' + Date.now().toString(36);
  const cfg = `window.QUIZ_CONFIG={dbUrl:'${MOCK}'};`;
  const A = await newDevice({ cfg });
  await home(A.page, code);
  await A.page.waitForSelector('.trainer-card');
  await startTyping(A.page);
  const ids = [];
  for (let i = 0; i < 3; i++) {
    const c = await cardInfo(A.page);
    ids.push(c.term + ':' + c.kind);
    await typeIn(A.page, c.kind === 'rev' ? BAD_TERM[c.term] : BAD_DEF[c.term]);
    await noteKind(A.page); await A.page.click('[data-tr-next]'); await A.page.waitForSelector('#trTa');
  }
  await A.page.click('[data-tr-stop]');
  await A.page.waitForSelector('.home .wordmark');
  await A.page.evaluate(() => MaxMotion.QuizStore.flushNow());
  await A.page.waitForFunction(() => MaxMotion.QuizStore.status() === 'saved', null, { timeout: 15000 });
  const dump = await admin('dump');
  const recs = (dump.quiz && dump.quiz[code] && dump.quiz[code].q) || {};
  const typeKeys = Object.keys(recs).filter((k) => /^type-/.test(k));
  check('cloud: typing answers reach the database as q/type-def-* and q/type-term-*', typeKeys.length >= 2 && typeKeys.every((k) => recs[k].hist), typeKeys);
  const aState = await A.page.evaluate(() => JSON.stringify(MaxMotion.Trainer.all()));
  const B = await newDevice({ cfg });
  await home(B.page, code);
  await B.page.waitForSelector('.trainer-card');
  const bState = await B.page.evaluate(() => JSON.stringify(MaxMotion.Trainer.all()));
  check('second device shows the same per-term progress', aState === bState && /[1-9]/.test(aState), [aState.slice(0, 80), bState.slice(0, 80)]);
  const chipsA = await A.page.evaluate(() => [...document.querySelectorAll('.tc-chips .dchip')].map((c) => c.className).join('|'));
  const chipsB = await B.page.evaluate(() => [...document.querySelectorAll('.tc-chips .dchip')].map((c) => c.className).join('|'));
  check('second device shows the same chips', chipsA === chipsB, [chipsA, chipsB]);
  await A.ctx.close(); await B.ctx.close();
}

async function phoneTests() {
  const { ctx, page } = await newDevice({ viewport: { width: 390, height: 844 } });
  await home(page);
  const doc = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, iw: innerWidth }));
  check('390px home: no horizontal scroll', doc.w <= doc.iw, doc);
  check('390px home: trainer card is the first card', await page.evaluate(() => { const c = document.querySelector('.trainer-card').getBoundingClientRect(), s = document.querySelector('.session-card').getBoundingClientRect(); return c.top < s.top; }));
  await shot(page, 'home-390x844', false);
  await startTyping(page);
  await shot(page, 'term-card-390x844');
  let w = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, iw: innerWidth }));
  check('390px term card: no horizontal scroll', w.w <= w.iw, w);
  await typeIn(page, 'chanj in posishun');
  await noteKind(page);
  await page.waitForTimeout(600);
  await shot(page, 'correct-or-teach-note-390x844', true);
  await forceCard(page, 'def', 'acceleration');
  await page.waitForSelector('#trTa');
  await typeIn(page, 'the rat uv chanj in vlosity');
  await noteKind(page);
  await page.waitForTimeout(600);
  await shot(page, 'correct-note-390x844', true);
  await forceCard(page, 'def', 'reference-point');
  await page.waitForSelector('#trTa');
  await typeIn(page, 'the lokashun of the obzervur');
  await noteKind(page);
  await page.waitForTimeout(600);
  await shot(page, 'almost-note-390x844', true);
  await forceCard(page, 'def', 'reference-point');
  await page.waitForSelector('#trTa');
  await page.click('[data-tr-idk]');
  await page.waitForSelector('[data-note=teach]');
  await page.waitForTimeout(600);
  await shot(page, 'teach-panel-mid-animation-390x844', true);
  w = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, iw: innerWidth }));
  check('390px teach panel: no horizontal scroll', w.w <= w.iw, w);
  await page.click('[data-tr-copy]'); await page.waitForSelector('#trTa');
  w = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, iw: innerWidth }));
  check('390px copy step: no horizontal scroll', w.w <= w.iw, w);
  await ctx.close();
  // the same screens at 1366x768 for the screenshots the brief asks for
  const d = await newDevice();
  await home(d.page); await startTyping(d.page);
  await forceCard(d.page, 'def', 'reference-point');
  await d.page.waitForSelector('#trTa');
  await d.page.click('[data-tr-idk]'); await d.page.waitForSelector('[data-note=teach]'); await d.page.waitForTimeout(3600);
  await shot(d.page, 'teach-panel-reference-after-switch-1366x768', false);
  await d.ctx.close();
}

async function reducedMotionTests() {
  const { ctx, page } = await newDevice({ reducedMotion: 'reduce' });
  await home(page); await startTyping(page);
  await forceCard(page, 'def', 'reference-point');
  await page.waitForSelector('#trTa');
  await page.click('[data-tr-idk]'); await page.waitForSelector('[data-note=teach]');
  await page.waitForFunction(() => { const s = MaxMotion.state.tview.insts[0].getState(); return s.observer === 'stands' || s.viewpoint === 'train'; }, null, { timeout: 2000 });
  check('reduced motion: the reveal happens at once', true);
  await ctx.close();
}

(async () => {
  await startServer('python3', ['-m', 'http.server', String(SITE_PORT)], { cwd: ROOT }, /Serving/);
  await startServer('node', [path.join('/tmp/claude-0/mockfb/server.js'), String(MOCK_PORT)], {}, /listen|running|9199/i);
  await admin('reset');
  browser = await chromium.launch();
  const only = process.argv[2];
  const all = { homeAndCardTests, teachPanelBall: () => teachPanelTests(true), teachPanelPlain: () => teachPanelTests(false), flowTests, learnAllTests, stopAndResumeTests, memoryTricksTests, sessionTests, cloudTests, phoneTests, reducedMotionTests };
  for (const [name, fn] of Object.entries(all)) {
    if (only && only !== name) continue;
    console.log('--- ' + name);
    try { await fn(); } catch (e) { fail++; console.log('FAIL ' + name + ' threw: ' + (e && e.stack || e)); }
  }
  check('no console errors or page errors', consoleErrors.length === 0, consoleErrors.slice(0, 5));
  await browser.close();
  procs.forEach((p) => { try { p.kill(); } catch (e) { /* ignore */ } });
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
