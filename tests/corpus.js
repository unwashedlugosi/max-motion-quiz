// node tests/corpus.js [path]  - runs the spelling corpus through DefGrade
const G = require('../defgrade.js');
const c = require(process.argv.slice(2).find((a) => a[0] !== '-') || '/tmp/claude-0/defcorpus/corpus.json');
const verbose = process.argv.includes('-v');
let tot = { cC: 0, cA: 0, cW: 0, wOK: 0, wBad: 0 };
const fails = [];
for (const [kind, fn] of [['definitions', G.gradeDefinition], ['terms', G.gradeTerm]]) {
  let s = { cC: 0, cA: 0, cW: 0, wOK: 0, wBad: 0 };
  for (const [id, v] of Object.entries(c[kind])) {
    for (const t of v.correct) { const r = fn(id, t); if (r.verdict === 'correct') s.cC++; else if (r.verdict === 'almost') { s.cA++; if (verbose) console.log('ALMOST', kind, id, JSON.stringify(t), r.missingWords.join('|')); } else { s.cW++; fails.push(['MISSED correct', kind, id, t, r]); } }
    for (const t of v.wrong) { const r = fn(id, t); if (r.verdict === 'wrong') s.wOK++; else { s.wBad++; fails.push(['ACCEPTED wrong', kind, id, t, r]); } }
  }
  const nC = s.cC + s.cA + s.cW, nW = s.wOK + s.wBad;
  console.log(`${kind}: credited ${s.cC + s.cA}/${nC} (${(100 * (s.cC + s.cA) / nC).toFixed(1)}%) correct=${s.cC} almost=${s.cA} | rejected ${s.wOK}/${nW} (${(100 * s.wOK / nW).toFixed(1)}%)`);
  for (const k in s) tot[k] += s[k];
}
const nC = tot.cC + tot.cA + tot.cW, nW = tot.wOK + tot.wBad;
console.log(`TOTAL: credited ${tot.cC + tot.cA}/${nC} (${(100 * (tot.cC + tot.cA) / nC).toFixed(1)}%) correct=${tot.cC} almost=${tot.cA} | rejected ${tot.wOK}/${nW} (${(100 * tot.wOK / nW).toFixed(1)}%)`);
fails.forEach((f) => console.log(f[0], f[1], f[2], JSON.stringify(f[3]), '->', f[4].verdict, JSON.stringify(f[4].found.map((x) => x.key + ':' + x.typed)), 'missing=' + f[4].missing));
