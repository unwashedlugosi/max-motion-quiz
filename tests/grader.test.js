// node tests/grader.test.js  - unit tests for defgrade.js (own samples; the corpus has its own runner: tests/corpus.js)
const assert = require('assert');
const G = require('../defgrade.js');
let n = 0, bad = 0;
function t(name, fn) { n++; try { fn(); } catch (e) { bad++; console.log('FAIL', name, '\n  ', e.message); } }
const def = (id, txt, want) => t(`${id}: ${JSON.stringify(txt)} -> ${want}`, () => { const r = G.gradeDefinition(id, txt); assert.strictEqual(r.verdict, want, JSON.stringify(r)); });
const term = (id, txt, want) => t(`term ${id}: ${JSON.stringify(txt)} -> ${want}`, () => { const r = G.gradeTerm(id, txt); assert.strictEqual(r.verdict, want, JSON.stringify(r)); });

// the teacher's own words are correct, always
const OFFICIAL = {
  motion: 'Change in position', acceleration: 'The rate of change in velocity/speed', 'reference-point': 'The location of the observer of motion',
  velocity: 'Describing a moving object using speed and direction', 'constant-speed': 'A speed that does not vary or change',
  'negative-acceleration': "When an object's speed decreases", 'positive-acceleration': "When an object's speed increases",
};
Object.keys(OFFICIAL).forEach((id) => {
  def(id, OFFICIAL[id], 'correct');
  term(id, G.SPEC[id].term, 'correct');
  t('SPEC def matches ' + id, () => assert.strictEqual(G.SPEC[id].def, OFFICIAL[id]));
});

// terrible spelling is credited (the examples from the brief)
def('acceleration', 'the rat uv chanj in vlosity', 'correct');
def('reference-point', 'lokashin uv the obzrvr uf moshin', 'correct');
def('constant-speed', 'a sped that dus not vari or chanj', 'correct');
def('velocity', 'discribing a movin objekt usin sped and direkshun', 'correct');
def('negative-acceleration', 'wen an objekts sped deecreeses', 'correct');
def('positive-acceleration', 'wen an objekts sped encreses', 'correct');
def('motion', 'chanj in poshin', 'correct');
def('motion', 'Change in posishun!!', 'correct');
def('motion', 'change in pstn', 'correct');
def('acceleration', 'rate of chng in vlcty', 'correct');
def('acceleration', 'raytofchange in speed', 'correct');
def('acceleration', 'the rate of change in velocity or speed', 'correct');
def('constant-speed', 'a speed thatdoesnotvary or change', 'correct');
def('constant-speed', 'speed dont vary or change', 'correct');
def('constant-speed', 'a speed that never changes', 'correct');
def('negative-acceleration', 'whenanobjectsspeeddecreases', 'correct');

// wrong meanings are rejected, however they are spelled
def('velocity', 'speed and distance', 'wrong');
def('velocity', 'sped and distanse', 'wrong');
def('negative-acceleration', 'speed increases', 'wrong');
def('negative-acceleration', 'when an objects sped increses', 'wrong');
def('positive-acceleration', 'speed decreases', 'wrong');
def('positive-acceleration', 'wen an objects sped dicreses', 'wrong');
def('acceleration', 'rate of change in position', 'wrong');
def('acceleration', 'the rate of chang in posishun', 'wrong');
def('motion', 'change in speed', 'wrong');
def('motion', 'change in distance', 'wrong');
def('motion', 'motion', 'wrong');
def('motion', '', 'wrong');
def('motion', '   ', 'wrong');
def('constant-speed', 'a speed that changes', 'wrong');
def('constant-speed', 'a speed that does change', 'wrong');
def('constant-speed', 'a speed that is fast', 'wrong');
def('reference-point', 'the location of the motion', 'wrong');
def('reference-point', 'the location of the object', 'wrong');
def('velocity', 'a moving object using speed', 'wrong');                // no direction
def('velocity', 'a moving object using direction', 'wrong');            // no speed
def('velocity', 'the distance a moving object goes', 'wrong');
def('negative-acceleration', 'when an objects speed stops', 'wrong');
def('negative-acceleration', 'negative acceleration', 'wrong');
def('positive-acceleration', 'positive acceleration', 'wrong');
def('motion', 'chance in position', 'wrong');                          // a different real word
def('motion', 'a spot', 'wrong');
def('acceleration', 'the right of change in velocity', 'wrong');       // "right" is not "rate"
def('acceleration', 'the rat ran fast', 'wrong');                      // "rat" counts only next to a change word
def('velocity', 'a spot and direction', 'wrong');                      // spot is not speed
def('velocity', 'spend and direction', 'wrong');

// confusable pairs
def('negative-acceleration', 'when an objects speed dicreses', 'correct');
def('negative-acceleration', 'when an objects speed deecreeses', 'correct');
def('positive-acceleration', 'when an objects speed increeses', 'correct');
def('positive-acceleration', 'when an objects speed encreses', 'correct');
def('negative-acceleration', 'when an objects speed incresis', 'wrong');
def('positive-acceleration', 'when an objects speed decresis', 'wrong');

// almost: all the core, but not the teacher's other words
def('negative-acceleration', 'speed decreases', 'almost');
def('positive-acceleration', 'sped incresis', 'almost');
def('reference-point', 'the location of the observer', 'almost');
def('velocity', 'speed and direction', 'almost');
def('constant-speed', 'a speed that stays the same', 'almost');
def('constant-speed', 'same speed', 'almost');
def('negative-acceleration', 'when an object slows down', 'almost');   // speed only implied
t('almost names the missing teacher word', () => {
  const r = G.gradeDefinition('reference-point', 'the lokashun of the obzrvr');
  assert.deepStrictEqual(r.missing, ['motion']); assert.deepStrictEqual(r.missingWords, ['motion']);
  assert.ok(/motion/.test(r.tip));
});
t('same-route tip shows the teacher words', () => {
  const r = G.gradeDefinition('constant-speed', 'a speed that stays the same');
  assert.ok(/does not vary or change/.test(r.tip), r.tip);
});
t('velocity distance tip', () => {
  const r = G.gradeDefinition('velocity', 'speed and distance');
  assert.strictEqual(r.tip, 'Velocity needs a direction, not a distance.');
});
t('found carries what was typed, with offsets', () => {
  const txt = 'chanj in posishun';
  const r = G.gradeDefinition('motion', txt);
  assert.deepStrictEqual(r.found.map((f) => [f.key, f.word, f.typed]), [['change', 'change', 'chanj'], ['position', 'position', 'posishun']]);
  r.found.forEach((f) => assert.strictEqual(txt.slice(f.start, f.end), f.typed));
});
t('synonym is accepted with the teacher word in the tip', () => {
  const r = G.gradeDefinition('motion', 'change in place');
  assert.strictEqual(r.verdict, 'correct'); assert.ok(/position/.test(r.tip), r.tip);
});
def('reference-point', 'the place of the person watching motion', 'correct');
def('reference-point', 'where the viewer is during motion', 'correct');
def('negative-acceleration', 'when an objects speed goes down', 'correct');
t('goes down is credited', () => assert.notStrictEqual(G.gradeDefinition('negative-acceleration', 'wen an object speed goes down').verdict, 'wrong'));
t('gets slower is credited', () => assert.notStrictEqual(G.gradeDefinition('negative-acceleration', 'when speed gets slower').verdict, 'wrong'));
t('speeds up is credited for positive', () => assert.notStrictEqual(G.gradeDefinition('positive-acceleration', 'when an object speeds up').verdict, 'wrong'));
t('speeds up is wrong for negative', () => assert.strictEqual(G.gradeDefinition('negative-acceleration', 'when an object speeds up').verdict, 'wrong'));

// terms
term('negative-acceleration', 'negitive axeleration', 'correct');
term('negative-acceleration', 'nagative acceleration', 'correct');
term('negative-acceleration', 'neg acceleration', 'correct');
term('positive-acceleration', 'posetive acceleration', 'correct');
term('positive-acceleration', 'pozitiv acceleration', 'correct');
term('positive-acceleration', 'pos acceleration', 'correct');
term('negative-acceleration', 'positive acceleration', 'wrong');
term('positive-acceleration', 'negative acceleration', 'wrong');
term('positive-acceleration', 'posativ acseleration', 'correct');
term('negative-acceleration', 'posativ acseleration', 'wrong');
term('negative-acceleration', 'acceleration', 'wrong');
term('negative-acceleration', 'negative', 'wrong');
term('acceleration', 'negative acceleration', 'wrong');
term('reference-point', 'refrens point', 'correct');
term('reference-point', 'reference', 'wrong');
term('reference-point', 'point', 'wrong');
term('constant-speed', 'constantspeed', 'correct');
term('constant-speed', 'konstant sped', 'correct');
term('constant-speed', 'constant', 'wrong');
term('constant-speed', 'speed', 'wrong');
term('velocity', 'velosity', 'correct');
term('velocity', 'vlosity', 'correct');
term('velocity', 'acceleration', 'wrong');
term('motion', 'moshun', 'correct');
term('motion', 'mention', 'wrong');
term('motion', '', 'wrong');
term('acceleration', 'aksellerashun', 'correct');
term('acceleration', 'exceleration', 'correct');
term('acceleration', 'deceleration', 'wrong');

// shape
t('result shape', () => {
  const r = G.gradeDefinition('motion', 'x');
  assert.ok(['correct', 'almost', 'wrong'].includes(r.verdict)); assert.ok(Array.isArray(r.found)); assert.ok(Array.isArray(r.missing)); assert.strictEqual(typeof r.tip, 'string');
});
t('never throws on odd input', () => { [null, undefined, 42, '\n\n', '!!!', 'a'.repeat(3000), '🙂 ok', 'ÀÉ'].forEach((x) => { G.gradeDefinition('velocity', x); G.gradeTerm('motion', x); }); G.gradeDefinition('nope', 'x'); });
t('defRanges', () => {
  const r = G.defRanges('acceleration', ['speed']);
  assert.strictEqual(G.SPEC.acceleration.def.slice(r[0][0], r[0][1]), 'velocity/speed');
});
console.log(`${n - bad}/${n} grader tests passed`);
process.exit(bad ? 1 : 0);
