/* Max's F/D/P Test Prep — lessons, misconceptions, diagnostic (v2 scope).
   Plain browser JS. Loaded with <script>; also evaluated in Node vm with a `window` object.
   Contract: docs/SPEC.md. Textbook phrasing: docs/textbook-notes.md (Big Ideas Math 6, Ch. 4).
   Operations lessons (gcf-lcm, frac-addsub, frac-muldiv, dec-ops) live in lessons-ops.js, loaded after this file. */

/* ------------------------------------------------------------------ */
/* Misconceptions                                                      */
/* ------------------------------------------------------------------ */

window.FDP_MISC = {
  "longer-larger": {
    label: "More digits looks bigger",
    explain: "0.45 has more digits than 0.5, but it is smaller. Digits after the decimal point get smaller the further right they go, so the number of digits tells you nothing. Fix: line up the decimal points and compare place by place from the left. 0.5 is 0.50, and 50 hundredths beats 45 hundredths.",
    figure: { type: "placevalue", numbers: ["0.50", "0.45"] }
  },
  "shorter-larger": {
    label: "Tenths always beat hundredths",
    explain: "0.3 is not bigger than 0.45 just because it stops at tenths. Tenths are bigger pieces than hundredths, but 0.45 has 4 tenths and 0.3 has only 3. Fix: pad with zeros so both have the same number of places (0.30 vs 0.45), then compare.",
    figure: { type: "placevalue", numbers: ["0.30", "0.45"] }
  },
  "placeholder-zero": {
    label: "Zero holder skipped",
    explain: "10.07 and 10.70 are not the same number. The 0 in 10.07 is holding the tenths place open so the 7 lands in hundredths. Fix: read every digit by its place. 10.07 is 10 and 7 hundredths; 10.70 is 10 and 70 hundredths.",
    figure: { type: "placevalue", numbers: ["10.07", "10.70"] }
  },
  "pct-shift-wrong-way": {
    label: "Decimal hopped the wrong way",
    explain: "A percent is a number of hundredths, so 8.25% is 8.25 &divide; 100, which is smaller than 8.25. Hopping the point right makes it bigger. Fix: percent &rarr; decimal is &divide;100, so hop two places LEFT. Decimal &rarr; percent is &times;100, two places RIGHT.",
    figure: { type: "shift", number: "8.25", places: -2, note: "÷ 100" }
  },
  "pct-shift-one-place": {
    label: "Hopped one place, not two",
    explain: "Per-cent means per hundred, and 100 has two zeros. Dividing by 100 moves the decimal point two places, not one. 8.25% is 0.0825, not 0.825. Fix: say &ldquo;hundred, two hops&rdquo; every time you cross out the % sign.",
    figure: { type: "shift", number: "8.25", places: -2, note: "÷ 100 = two hops left" }
  },
  "pct-small-as-whole": {
    label: "Dropped the % without dividing",
    explain: "[[f:2/5]]% is not [[f:2/5]]. The % sign still means &divide;100, even when the number in front of it is a fraction or already tiny. [[f:2/5]]% = 0.4% = 0.004, less than half of one square on a hundred grid. Fix: convert the front number to a decimal first (0.4), then still hop two places left.",
    figure: { type: "grid", shaded: 0.4, caption: "0.4% is less than half of one square out of 100" }
  },
  "frac-part-as-decimal": {
    label: "Fraction part copied as digits",
    explain: "[[m:8 1/4]]% is not 8.14% or 8.4%. The [[f:1/4]] has to become its own decimal first: [[f:1/4]] = 0.25, so [[m:8 1/4]]% = 8.25%. Fix: turn the fraction part into a decimal (divide top by bottom) before you do anything else."
  },
  "bar-as-point": {
    label: "Fraction bar read as a decimal point",
    explain: "[[f:2/5]] is not 2.5. The bar means divide: 2 &divide; 5 = 0.4. Fix: the top number goes inside the division box, the bottom number does the dividing. A proper fraction (top smaller than bottom) always gives a decimal less than 1.",
    figure: { type: "longdiv", dividend: 2, divisor: 5, digits: 2 }
  },
  "not-simplest": {
    label: "Right value, not simplified",
    explain: "[[f:825/10000]] is the right amount but the test wants simplest form. Fix: find a number that divides both top and bottom. If both end in 0 or 5, try 5 or 25. 825 &divide; 25 = 33 and 10000 &divide; 25 = 400, so [[f:33/400]]."
  },
  "repeating-truncate": {
    label: "Repeating decimal cut short",
    explain: "7 &divide; 9 never ends: 0.7777&hellip;. Writing 0.7 or 0.77 loses part of the number. Fix: when the remainder in long division repeats, put a bar over the repeating digits: [[r:0.(7)]]. As a percent, [[r:77.(7)]]%.",
    figure: { type: "longdiv", dividend: 7, divisor: 9, digits: 4 }
  },
  "bar-placement": {
    label: "Bar over the wrong digits",
    explain: "1 &divide; 6 = 0.16666&hellip;. Only the 6 repeats; the 1 happens once. So it is [[r:0.1(6)]], not [[r:0.(16)]]. Fix: watch the remainders in long division. The bar starts at the first digit whose remainder you have seen before.",
    figure: { type: "longdiv", dividend: 1, divisor: 6, digits: 4 }
  },
  "rounded-as-exact": {
    label: "Rounded number used as exact",
    explain: "0.33 is close to [[f:1/3]], but it is not [[f:1/3]]. If you use 0.33 in a later step the answer drifts. Fix: keep the exact form ([[f:1/3]] or [[r:0.(3)]]) while you work, and only round at the very end if the problem tells you to."
  },
  "decimal-kind": {
    label: "Wrong kind of decimal",
    explain: "There are three kinds. Terminating: it stops (0.35). Repeating: a block of digits comes back forever (0.141414&hellip; = [[r:0.(14)]], and every fraction that does not terminate repeats, so [[f:3/14]] repeats). Non-terminating, non-repeating: it goes on forever and no block ever comes back, like 0.087621134&hellip; (the digits keep going with no repeating pattern). Fix: a long decimal is not automatically repeating. Look for a block that comes back; if the number came from a fraction, it must terminate or repeat.",
    figure: { type: "longdiv", dividend: 3, divisor: 14, digits: 7, caption: "3 &divide; 14 = 0.2142857142857&hellip; = [[r:0.2(142857)]]: a fraction always terminates or repeats" }
  },
  "add-denominators": {
    label: "Added the bottoms",
    explain: "[[f:1/2]] + [[f:1/3]] is not [[f:2/5]]. Halves and thirds are different-sized pieces, so you cannot count them together. Fix: rename both with a common denominator first. [[f:1/2]] = [[f:3/6]] and [[f:1/3]] = [[f:2/6]], so the sum is [[f:5/6]]. The bottom stays 6; only the tops add.",
    figure: { type: "fracbar", rows: [{ parts: 6, shaded: 3, label: "[[f:1/2]] = [[f:3/6]]" }, { parts: 6, shaded: 2, label: "[[f:1/3]] = [[f:2/6]]" }] }
  },
  "regroup-mixed": {
    label: "Subtracted the smaller fraction from the bigger one",
    explain: "[[m:5 1/4]] &minus; [[m:2 3/4]]: you cannot take [[f:3/4]] from [[f:1/4]], and flipping it to [[f:3/4]] &minus; [[f:1/4]] gives the wrong answer ([[m:3 1/2]]). Fix: borrow one whole. [[m:5 1/4]] = [[m:4 5/4]]. Now [[f:5/4]] &minus; [[f:3/4]] = [[f:2/4]] and 4 &minus; 2 = 2, so [[m:2 1/2]]. (Or change both to improper fractions.)"
  },
  "mixed-mult-parts": {
    label: "Multiplied wholes and fractions separately",
    explain: "[[m:2 1/2]] &times; [[m:3 1/3]] is not 2 &times; 3 plus [[f:1/2]] &times; [[f:1/3]], which gives [[m:6 1/6]]. That skips two products: 2 &times; [[f:1/3]] and 3 &times; [[f:1/2]]. Fix: change both mixed numbers to improper fractions first: [[f:5/2]] &times; [[f:10/3]] = [[f:50/6]] = [[m:8 1/3]]. Size check: 2.5 &times; 3.3 is a bit more than 8, so [[m:6 1/6]] is too small.",
    figure: { type: "area", a: "5/2", b: "10/3" }
  },
  "div-no-flip": {
    label: "Divided without flipping the second fraction",
    explain: "To divide by a fraction, multiply by its reciprocal: keep the first, change &divide; to &times;, flip the SECOND. [[f:3/4]] &divide; [[f:5/8]] = [[f:3/4]] &times; [[f:8/5]] = [[f:24/20]] = [[m:1 1/5]]. Flipping the first one, or not flipping at all, gives a different number. Fix: keep, change, flip, in that order, and only the second fraction flips."
  },
  "gcf-lcm-swap": {
    label: "GCF and LCM mixed up",
    explain: "GCF is the Greatest Common Factor: the biggest number that divides into both. Use it to simplify fractions. LCM is the Least Common Multiple: the smallest number both divide into. Use it for a common denominator. Fix: simplifying means dividing, so GCF. Adding or subtracting means a shared bottom, so LCM. GCF is never bigger than the numbers; LCM is never smaller."
  },
  "decimal-align": {
    label: "Decimal points not lined up",
    explain: "3.5 + 1.25 is not 1.60. Lining up the right-hand ends puts tenths under hundredths. Fix: line up the decimal POINTS, pad with zeros (3.50 + 1.25), then add the columns. The point in the answer goes straight down: 4.75.",
    figure: { type: "columns", numbers: ["3.50", "1.25"], op: "+" }
  },
  "decimal-mult-places": {
    label: "Wrong number of decimal places in a product",
    explain: "0.4 &times; 0.3 is not 1.2. Multiply as whole numbers (4 &times; 3 = 12), then count the decimal places in BOTH factors (1 + 1 = 2) and put that many in the answer: 0.12. Fix: count places, then check it makes sense. Less than 1 times less than 1 must be less than 1.",
    figure: { type: "columns", numbers: ["0.4", "0.3"], op: "×" }
  },
  "decimal-div-shift": {
    label: "Moved the point in only one number",
    explain: "4.5 &divide; 0.5: to make the divisor a whole number you move its point one place (0.5 &rarr; 5), and you must move the dividend's point the same amount (4.5 &rarr; 45). 45 &divide; 5 = 9. Moving only the divisor gives 4.5 &divide; 5 = 0.9, which is ten times too small. Fix: whatever you do to the divisor, do to the dividend."
  },
  "wrong-operation": {
    label: "Wrong operation for the story",
    explain: "&ldquo;How many [[f:3/4]]-cup servings are in 6 cups?&rdquo; is a division: 6 &divide; [[f:3/4]] = 8. Multiplying gives [[m:4 1/2]], which cannot be right because the servings are smaller than a cup, so there must be more than 6 of them. Fix: ask what the question wants. &ldquo;How many groups fit&rdquo; is division. &ldquo;A fraction OF something&rdquo; is multiplication. Then check: does the size of the answer make sense?",
    figure: { type: "groups", total: "6", size: "3/4", unit: "cups" }
  },
  "missed-step": {
    label: "Stopped one step early",
    explain: "You found the cost of the items but the question asked for the change. The first number you compute is usually not the answer. Fix: before you start, write what the question is really asking and its label (&ldquo;change, in dollars&rdquo;). When you finish a step, look back: is this it, or is there another step?"
  },
  "no-label": {
    label: "Missing or wrong label",
    explain: "12.5 is not an answer; 12.5 inches is. On this test a right number with no label loses points, and money needs the dollar sign. Fix: underline the label in the question before you start, and write it on the answer. If the question asks for cups, the answer ends in cups."
  },
  "math-vs-real-rounding": {
    label: "Math rounding where the story needs real-life rounding",
    explain: "Math rounding goes to the nearest: 4.3 rounds to 4. Real-life rounding depends on the situation. If 4.3 buses are needed, you need 5 buses, because 4 would leave people behind. If you can afford 4.3 shirts, you can buy 4, because you cannot buy part of a shirt. Fix: after you compute, ask: does this have to be a whole thing? Is it &ldquo;enough&rdquo; (round up) or &ldquo;how many can I&rdquo; (round down)?",
    figure: { type: "roundline", value: "4.3", step: 1, mode: "up", caption: "4.3 buses needed: 4 is not enough, so 5" }
  },
  "money-cents": {
    label: "Money not written to the cent",
    explain: "$4.5 is not how money is written, and $3.125 is not a real amount. Money always has exactly two decimal places. Fix: write $4.50, and when a computation gives three or more places, round to the nearest cent ($3.125 &rarr; $3.13) unless the problem says otherwise."
  },
  "pct-shift-places": {
    label: "Point moved the wrong number of places",
    explain: "Percent is per hundred, and 100 has two zeros, so changing between a percent and a decimal always moves the point exactly two places: 787.5% = 7.875 and 0.4% = 0.004. One place or three places gives a number ten times off. Fix: cross out the %, hop two, and check the size. A percent over 100% must give a decimal over 1; a percent under 1% must give a decimal under 0.01.",
    figure: { type: "shift", number: "787.5", places: -2, note: "÷ 100: exactly two hops" }
  },
  "gcf-lcm-not-extreme": {
    label: "Common, but not the greatest or least",
    explain: "4 is a common factor of 24 and 36, but the GREATEST common factor is 12. 72 is a common multiple of 8 and 12, but the LEAST common multiple is 24. A smaller factor leaves the fraction unsimplified; a bigger multiple makes the numbers messier than they need to be. Fix: after you find one, ask if a bigger factor (or a smaller multiple) also works. List the factors or multiples and take the extreme one."
  },
  "rounding-direction": {
    label: "Rounded the wrong way, or chopped instead of rounding",
    explain: "To round 3.86 to the nearest tenth, look at the one digit to the right of the tenths place: 6. Five or more rounds the tenths up, so 3.9. Writing 3.8 just chops the 6 off; that is truncating, not rounding. Fix: underline the place you are rounding to, circle the next digit, and let that digit decide: 5 or more goes up, 4 or less stays. (Choosing nearest when the story needs up or down is a different mistake: math-vs-real rounding.)",
    figure: { type: "roundline", value: "3.86", step: 0.1, mode: "nearest" }
  },
  "denominator-places": {
    label: "Denominator does not match the places",
    explain: "0.375 has three decimal places, so it is 375 thousandths: [[f:375/1000]], not [[f:375/100]]. Fix: count the decimal places. One place &rarr; tenths, two &rarr; hundredths, three &rarr; thousandths, four &rarr; ten-thousandths. Then simplify.",
    figure: { type: "placevalue", numbers: ["0.375"] }
  },
  "dropped-whole": {
    label: "Lost the whole-number part of a mixed number",
    explain: "A mixed number has two parts: a whole number and a fraction. [[m:7 7/8]] is 7 + [[f:7/8]] = 7.875, not 0.875, and [[m:6 1/8]] is 6.125, not [[f:1/8]]. Dropping the whole number makes the answer far too small. Fix: write the whole number first, convert only the fraction part, then put them back together. Size check: a mixed number is always at least as big as its whole number."
  },
  "mixed-to-improper": {
    label: "Mixed number changed to an improper fraction wrongly",
    explain: "[[m:6 1/8]] is not [[f:61/8]]. To change a mixed number to an improper fraction: whole number &times; bottom, plus top, all over the same bottom. 6 &times; 8 + 1 = 49, so [[f:49/8]]. Writing the 6 and the 1 side by side, or adding them (6 + 1), does not count the pieces inside the whole numbers. Fix: ask how many eighths are in 6 wholes (48), then add the extra 1."
  },
  "top-bottom-mismatch": {
    label: "Top and bottom not changed the same way",
    explain: "To rename or simplify a fraction, whatever you multiply or divide the bottom by, you must do the same to the top. [[f:5/24]] is not [[f:5/6]] (only the bottom changed), and [[f:3/5]] is not [[f:24/20]] (the top was divided by 8 but the bottom by 4). Fix: pick ONE number and use it on both. [[f:5/6]] = [[f:20/24]] (&times; 4 on top and bottom). [[f:24/20]] = [[f:6/5]] (&divide; 4 on top and bottom)."
  },
  "arithmetic-slip": {
    label: "Right method, calculation slip",
    explain: "Your plan was fine, but one calculation went wrong, like 3 &times; 249 = 647 instead of 747. Fix: estimate first (3 &times; $2.50 is about $7.50), then check the work with the opposite operation: multiply to check a division, add to check a subtraction. Slow down on borrowing, carrying and cancelling."
  },
  "copied-number": {
    label: "Gave a number from the problem instead of converting",
    explain: "The question asked you to work something out, but the answer repeats a number you can already see in the problem. Fix: say what the question is counting (twelfths? hundredths? squares?) and then calculate it. For example, 0.5 as hundredths is 50: 5 is the number of tenths and 0.5 is just the number itself."
  },
  "answered-other-form": {
    label: "Answered a different step or form than the question asked",
    explain: "The question asked for one thing and the answer is a value from a different step or form, like the decimal 0.0825 when the question wanted the percent 8.25%. That value can be right for the whole problem and still wrong for this question. Fix: underline what the question asks for (percent? decimal? fraction?) and write the answer in that form."
  }
};

/* ------------------------------------------------------------------ */
/* Lessons (prerequisite order)                                        */
/* ------------------------------------------------------------------ */

window.FDP_LESSONS = [

  /* ---------------------------------------------------------------- */
  {
    id: "L01",
    skill: "place-value",
    title: "Comparing decimals: every digit has a job",
    minutes: 6,
    hook: "10.07 and 10.70 look like cousins. They are not even close.",
    steps: [
      {
        say: "A decimal is a stack of places: ones, tenths, hundredths, thousandths. Each place to the right is ten times smaller. A zero in the middle is not nothing. It holds a place open so the next digit lands in the right spot.",
        figure: { type: "placevalue", numbers: ["10.07", "10.70"], caption: "Same digits, different places. The first place that differs is the tenths: 0 vs 7." }
      },
      {
        say: "To compare, line up the decimal points and read left to right. The first place where the digits differ decides it.",
        ask: {
          prompt: "Tell which number is greater. Compare 10.07 and 10.70.",
          answer: { type: "choice", choices: ["10.07 &gt; 10.70", "10.07 &lt; 10.70", "10.07 = 10.70"], correct: 1 },
          errors: [
            { choice: 0, misconception: "placeholder-zero", feedback: "Look at the tenths place. 10.07 has 0 tenths; 10.70 has 7 tenths. The 0 in 10.07 is a placeholder, not a decoration." },
            { choice: 2, misconception: "placeholder-zero", feedback: "The zeros are in different places. 10.07 is 10 and 7 hundredths. 10.70 is 10 and 70 hundredths. Not equal." }
          ],
          hint: "Ones are the same (10 and 10). Go one place right: what is in the tenths place of each?",
          reveal: "10.07 &lt; 10.70. The ones match. In the tenths place, 10.07 has 0 and 10.70 has 7. 0 &lt; 7, so 10.07 is smaller."
        }
      },
      {
        say: "Worked example: 0.5 vs 0.45. The trap is that 45 looks bigger than 5. Fix it by giving both numbers the same number of places. 0.5 = 0.50 (adding a zero on the end changes nothing).",
        figure: { type: "placevalue", numbers: ["0.50", "0.45"] },
        ask: {
          prompt: "0.5 is the same as how many hundredths?",
          answer: { type: "num", value: "50", form: "number", unit: "hundredths" },
          errors: [
            { value: "5", misconception: "copied-number", feedback: "5 is the number of tenths in 0.5. The question asks for hundredths, and each tenth is 10 hundredths, so that is 50 hundredths." },
            { value: "0.5", misconception: "copied-number", feedback: "That is the number itself. The question is how many hundredths it holds: 0.50 means 50 hundredths." }
          ],
          hint: "Write 0.5 with two decimal places. What two-digit number do you see after the point?",
          reveal: "50. 0.5 = 0.50, and 0.50 is 50 hundredths. Now it is easy: 50 hundredths vs 45 hundredths."
        },
        why: {
          prompt: "Why are we allowed to write 0.5 as 0.50?",
          choices: [
            "A zero on the end of a decimal adds nothing, so 0.50 is the same amount and now both numbers have two places",
            "Adding a zero makes the number ten times bigger, which helps it win",
            "Because 0.5 is really 0.05"
          ],
          correct: 0,
          feedback: [
            "Right. 0.5 = 0.50 = 0.500. Trailing zeros only matter for lining things up.",
            "A zero on the end of a decimal does not change the value. 0.5 and 0.50 are the same amount. (A zero on the end of a whole number is different: 5 and 50 are not equal.)",
            "0.05 is 5 hundredths. 0.5 is 5 tenths, which is ten times more. The zero goes on the end, not in the middle."
          ]
        }
      },
      {
        say: "Now compare 50 hundredths with 45 hundredths.",
        ask: {
          prompt: "Tell which number is greater. 0.5 or 0.45?",
          answer: { type: "choice", choices: ["0.5 &gt; 0.45", "0.5 &lt; 0.45", "0.5 = 0.45"], correct: 0 },
          errors: [
            { choice: 1, misconception: "longer-larger", feedback: "More digits does not mean bigger. 0.50 vs 0.45: in the tenths place 5 beats 4." },
            { choice: 2, misconception: "longer-larger", feedback: "0.50 and 0.45 differ in the tenths place (5 vs 4). Not equal." }
          ],
          hint: "0.50 vs 0.45. Compare the tenths place first.",
          reveal: "0.5 &gt; 0.45. As hundredths, 50 &gt; 45. Or just compare tenths: 5 tenths beats 4 tenths and the rest never matters."
        }
      },
      {
        say: "Faded example. The opposite trap: thinking a shorter decimal is bigger because tenths are big pieces. Compare 0.3 and 0.35. Pad first: 0.30 vs 0.35.",
        figure: { type: "placevalue", numbers: ["0.30", "0.35"] },
        ask: {
          prompt: "Tell which number is greater. 0.3 or 0.35?",
          answer: { type: "choice", choices: ["0.3 &gt; 0.35", "0.3 &lt; 0.35", "0.3 = 0.35"], correct: 1 },
          errors: [
            { choice: 0, misconception: "shorter-larger", feedback: "Tenths are big pieces, but both numbers have 3 tenths. 0.35 has 5 extra hundredths on top. 0.30 &lt; 0.35." },
            { choice: 2, misconception: "shorter-larger", feedback: "0.30 and 0.35 differ in the hundredths place: 0 vs 5." }
          ],
          hint: "Tenths tie (3 and 3). Move one place right.",
          reveal: "0.3 &lt; 0.35. 0.30 vs 0.35: tenths tie, hundredths 0 vs 5, so 0.35 is greater."
        }
      },
      {
        say: "One more faded example with a near-miss: 0.3 vs 0.299. Three nines look like a lot. Pad 0.3 to 0.300 and compare the tenths.",
        ask: {
          prompt: "Tell which number is greater. 0.3 or 0.299?",
          answer: { type: "choice", choices: ["0.3 &gt; 0.299", "0.3 &lt; 0.299", "0.3 = 0.299"], correct: 0 },
          errors: [
            { choice: 1, misconception: "longer-larger", feedback: "0.300 vs 0.299: in the tenths place 3 beats 2. Everything after that cannot catch up, no matter how many nines." },
            { choice: 2, misconception: "longer-larger", feedback: "Close is not equal. 0.300 is one thousandth more than 0.299." }
          ],
          hint: "Write 0.3 as 0.300. Which has more tenths?",
          reveal: "0.3 &gt; 0.299. 0.300 has 3 tenths; 0.299 has 2 tenths. The first place that differs decides it."
        }
      },
      {
        say: "Independent. Order four decimals. Pad each to three places, then compare left to right.",
        ask: {
          prompt: "Order the numbers from least to greatest.",
          answer: { type: "order", items: ["3.5", "3.45", "3.405", "3.54"], correct: [2, 1, 0, 3] },
          errors: [
            { order: [0, 1, 2, 3], misconception: "longer-larger", feedback: "You went by how many digits. Pad them: 3.500, 3.450, 3.405, 3.540. Now compare the tenths, then the hundredths." },
            { order: [2, 1, 3, 0], misconception: "longer-larger", feedback: "Check 3.5 vs 3.54: 3.50 vs 3.54. Hundredths: 0 vs 4, so 3.54 is the biggest." }
          ],
          hint: "Pad: 3.500, 3.450, 3.405, 3.540. Tenths first: 5, 4, 4, 5. Then break the ties with hundredths.",
          reveal: "3.405, 3.45, 3.5, 3.54. Tenths: 3.405 and 3.45 have 4, the others have 5. Hundredths break each tie: 3.405 &lt; 3.450 and 3.500 &lt; 3.540."
        }
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    id: "L02",
    skill: "pct-dec",
    title: "Percent and decimal: the two-hop rule",
    minutes: 7,
    hook: "Percent means per hundred. Every percent problem is secretly a &divide;100.",
    steps: [
      {
        say: "8% means 8 out of 100. On a hundred grid, that is 8 squares shaded. As a fraction it is [[f:8/100]]. As a decimal, 8 hundredths is 0.08.",
        figure: { type: "grid", shaded: 8, caption: "8% = 8 per hundred = [[f:8/100]] = 0.08" }
      },
      {
        say: "Dividing by 100 moves the decimal point two places to the left. The textbook does it like this: cross out the %, write the point (8.%), hop it two places. Fill with zeros if you run out of digits: 08. &rarr; 0.08.",
        figure: { type: "shift", number: "8", places: -2, note: "÷ 100: two hops left" },
        ask: {
          prompt: "Write the percent as a decimal. 8%",
          answer: { type: "num", value: "0.08", form: "decimal" },
          errors: [
            { value: "0.8", misconception: "pct-shift-one-place", feedback: "You hopped one place. Per hundred means two hops. 0.8 would be 80%." },
            { value: "800", misconception: "pct-shift-wrong-way", feedback: "You went right, which multiplies by 100. 8% is smaller than 8, so hop left." },
            { value: "8", misconception: "pct-small-as-whole", feedback: "Dropping the % sign is not enough. The % means &divide;100, so you still have to hop two places left." }
          ],
          hint: "8% = 8 &divide; 100. Start at 8. and hop the point two places left.",
          reveal: "0.08. 8% is 8 hundredths. 8 &divide; 100 = 0.08: the point hops two places left, with a zero filling the empty tenths place."
        },
        why: {
          prompt: "Why two places and not one?",
          choices: [
            "Percent means per hundred, and dividing by 100 moves the point two places (one for each zero in 100)",
            "Because the number 8 has one digit, so you add one more",
            "Decimals always have exactly two places"
          ],
          correct: 0,
          feedback: [
            "Right. &divide;10 is one hop, &divide;100 is two hops, &divide;1000 is three hops. Percent is always the two-hop one.",
            "The number of digits in the percent does not matter. 8%, 85% and 8.25% all hop two places, because all of them are &divide;100.",
            "Decimals can have any number of places (0.004 has three). The two comes from the two zeros in 100."
          ]
        }
      },
      {
        say: "Worked example: [[m:8 1/4]]%. A fraction inside a percent is a two-step job. First, turn the fraction part into a decimal. [[f:1/4]] = 1 &divide; 4 = 0.25.",
        ask: {
          prompt: "Write [[m:8 1/4]]% as a percent using a decimal instead of a fraction.",
          answer: { type: "num", value: "8.25", form: "percent" },
          errors: [
            { value: "8.4", misconception: "frac-part-as-decimal", feedback: "[[f:1/4]] is not .4. Divide: 1 &divide; 4 = 0.25. So it is 8.25%." },
            { value: "8.14", misconception: "frac-part-as-decimal", feedback: "You copied the digits 1 and 4. The fraction has to be divided: 1 &divide; 4 = 0.25." },
            { value: "0.0825", misconception: "answered-other-form", feedback: "That is the decimal, which comes in the next step. This question asks for the percent written with a decimal instead of a fraction: 8.25%." }
          ],
          hint: "What is one quarter as a decimal? Think of a quarter of a dollar.",
          reveal: "8.25%. [[f:1/4]] = 0.25, so [[m:8 1/4]]% = 8.25%. We have not divided by 100 yet; that is the next step."
        }
      },
      {
        say: "Second step: now 8.25% is an ordinary percent. Cross out the %, hop two places left.",
        figure: { type: "shift", number: "8.25", places: -2, note: "÷ 100" },
        ask: {
          prompt: "Write the percent as a decimal. 8.25%",
          answer: { type: "num", value: "0.0825", form: "decimal" },
          errors: [
            { value: "0.825", misconception: "pct-shift-one-place", feedback: "One hop. You need two: 8.25 &rarr; 0.825 &rarr; 0.0825." },
            { value: "825", misconception: "pct-shift-wrong-way", feedback: "You hopped right. 8.25% is a little more than 8 hundredths, so it must be small: hop left." },
            { value: "0.084", misconception: "frac-part-as-decimal", feedback: "The [[f:1/4]] is 0.25, not .4. Start from 8.25% and hop two left: 0.0825." },
            { value: "0.0814", misconception: "frac-part-as-decimal", feedback: "The [[f:1/4]] became 14. It should be 0.25. From 8.25%, two hops left gives 0.0825." }
          ],
          hint: "Start at 8.25. Hop once: 0.825. Hop again: ?",
          reveal: "0.0825. 8.25 &divide; 100: the point hops two places left, past the 8, and a zero fills the gap. The teacher's chain is [[m:8 1/4]]% = 8.25% = 0.0825."
        }
      },
      {
        say: "Faded example: [[f:2/5]]%. This one is less than 1%, which feels weird but works the same way. [[f:2/5]] = 0.4, so [[f:2/5]]% = 0.4%. That is less than half of one square on the grid.",
        figure: { type: "grid", shaded: 0.4, caption: "0.4% of the grid: not even half a square" },
        ask: {
          prompt: "Write the percent as a decimal. 0.4%",
          answer: { type: "num", value: "0.004", form: "decimal" },
          errors: [
            { value: "0.4", misconception: "pct-small-as-whole", feedback: "0.4 is 40%, almost half the grid. The % sign still means &divide;100 even when the number is already a decimal. Two hops left: 0.004." },
            { value: "0.04", misconception: "pct-shift-one-place", feedback: "One hop. 0.4 &rarr; 0.04 &rarr; 0.004. Two hops for per hundred." },
            { value: "40", misconception: "pct-shift-wrong-way", feedback: "Wrong direction. 0.4% is tiny, so the decimal must be tinier than 0.4." }
          ],
          hint: "0.4 &divide; 100. Hop the point two places left and fill with zeros.",
          reveal: "0.004. 0.4% is four tenths of one percent. 0.4 &divide; 100 = 0.004. Chain: [[f:2/5]]% = 0.4% = 0.004."
        }
      },
      {
        say: "Going the other way, decimal to percent, is &times;100: two hops RIGHT. 1.25 &rarr; 125%. Percents over 100% are fine; they just mean more than the whole.",
        figure: { type: "shift", number: "1.25", places: 2, note: "× 100: two hops right" },
        ask: {
          prompt: "Write the decimal as a percent. 1.25",
          answer: { type: "num", value: "125", form: "percent" },
          errors: [
            { value: "12.5", misconception: "pct-shift-one-place", feedback: "One hop. Two hops right: 1.25 &rarr; 12.5 &rarr; 125." },
            { value: "0.0125", misconception: "pct-shift-wrong-way", feedback: "Decimal to percent is &times;100, so hop right. 1.25 is more than one whole, so it is more than 100%." },
            { value: "1.25", misconception: "pct-small-as-whole", feedback: "Sticking a % on the end is not enough. 1.25 is 125 hundredths, so it is 125%." }
          ],
          hint: "1.25 = 125 hundredths. Hundredths are percents.",
          reveal: "125%. 1.25 &times; 100 = 125. One whole is 100%, and 0.25 more is 25% more."
        }
      },
      {
        say: "Bigger numbers, same two hops. 7.875 is almost 8 wholes, so it is almost 800%. The whole-number part does not get special treatment: the point just hops.",
        figure: { type: "shift", number: "7.875", places: 2, note: "× 100" },
        ask: {
          prompt: "Write the decimal as a percent. 7.875",
          answer: { type: "num", value: "787.5", form: "percent" },
          errors: [
            { value: "78.75", misconception: "pct-shift-one-place", feedback: "One hop. Two hops right: 7.875 &rarr; 78.75 &rarr; 787.5." },
            { value: "7.875", misconception: "pct-small-as-whole", feedback: "Adding a % sign is not enough. 7.875 is almost 8 wholes, so almost 800%: 787.5%." },
            { value: "0.07875", misconception: "pct-shift-wrong-way", feedback: "Decimal to percent is &times;100. Hop right." }
          ],
          hint: "Almost 8 wholes, so almost 800%. Two hops right.",
          reveal: "787.5%. 7.875 &times; 100 = 787.5. The teacher's chain: [[m:7 7/8]] = 7.875 = 787.5%."
        }
      },
      {
        say: "And back the other way: 612.5% is a bit more than 6 wholes. Two hops left.",
        ask: {
          prompt: "Write the percent as a decimal. 612.5%",
          answer: { type: "num", value: "6.125", form: "decimal" },
          errors: [
            { value: "61.25", misconception: "pct-shift-one-place", feedback: "One hop. 612.5 &rarr; 61.25 &rarr; 6.125. 612.5% is just over 6 wholes." },
            { value: "61250", misconception: "pct-shift-wrong-way", feedback: "Percent to decimal is &divide;100. Hop left." },
            { value: "0.6125", misconception: "pct-shift-one-place", feedback: "Three hops. 612.5% is more than 100%, so the decimal must be more than 1: 6.125." }
          ],
          hint: "600% is 6 wholes. So this is 6 and a bit.",
          reveal: "6.125. 612.5 &divide; 100 = 6.125, which is [[m:6 1/8]]."
        }
      },
      {
        say: "Faded: a small one. 0.6% as a decimal. Same two hops, more zeros.",
        ask: {
          prompt: "Write the percent as a decimal. 0.6%",
          answer: { type: "num", value: "0.006", form: "decimal" },
          errors: [
            { value: "0.6", misconception: "pct-small-as-whole", feedback: "0.6 would be 60%. The % means &divide;100: 0.006." },
            { value: "0.06", misconception: "pct-shift-one-place", feedback: "One hop. 0.6 &rarr; 0.06 &rarr; 0.006." },
            { value: "60", misconception: "pct-shift-wrong-way", feedback: "0.6% is tiny, so hop left to make it smaller, not right." }
          ],
          hint: "Two hops left from 0.6.",
          reveal: "0.006. 0.6 &divide; 100 = 0.006. Six thousandths."
        }
      },
      {
        say: "Independent. A fractional percent, both steps on your own.",
        ask: {
          prompt: "Write the percent as a decimal. [[m:7 1/2]]%",
          answer: { type: "num", value: "0.075", form: "decimal" },
          errors: [
            { value: "0.75", misconception: "pct-shift-one-place", feedback: "7.5% with one hop is 0.75, which would be 75%. Two hops: 0.075." },
            { value: "7.5", misconception: "pct-small-as-whole", feedback: "7.5% is the percent. Now divide by 100: 0.075." },
            { value: "0.0712", misconception: "frac-part-as-decimal", feedback: "[[f:1/2]] is 0.5, not .12. So [[m:7 1/2]]% = 7.5% = 0.075." },
            { value: "750", misconception: "pct-shift-wrong-way", feedback: "Hop left, not right. 7.5% is less than one tenth." }
          ],
          hint: "First: [[f:1/2]] = 0.5, so this is 7.5%. Then two hops left.",
          reveal: "0.075. [[m:7 1/2]]% = 7.5% = 7.5 &divide; 100 = 0.075."
        }
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    id: "L03",
    skill: "frac-dec",
    title: "Fraction and decimal: the bar means divide",
    minutes: 7,
    hook: "A fraction bar is a division sign in disguise.",
    steps: [
      {
        say: "[[f:3/4]] means 3 &divide; 4. Three things shared by four people. The top number goes inside the division box; the bottom number is what you divide by.",
        figure: { type: "longdiv", dividend: 3, divisor: 4, digits: 3, caption: "3 &divide; 4 = 0.75" },
        ask: {
          prompt: "Write the fraction as a decimal. [[f:3/4]]",
          answer: { type: "num", value: "0.75", form: "decimal" },
          errors: [
            { value: "3.4", misconception: "bar-as-point", feedback: "The bar is not a decimal point. [[f:3/4]] is less than 1, so its decimal must start 0.something. Divide 3 by 4." },
            { value: "4/3", misconception: "bar-as-point", feedback: "That is 4 &divide; 3. The top goes inside the box: 3 &divide; 4 = 0.75." },
            { value: "0.34", misconception: "bar-as-point", feedback: "You wrote the digits with a point in front. [[f:3/4]] has to be divided: 3 &divide; 4 = 0.75." }
          ],
          hint: "Three quarters. Three quarters of a dollar is how many cents?",
          reveal: "0.75. 3 &divide; 4: 4 goes into 3.00 zero times, into 30 seven times (28, remainder 2), into 20 five times. 0.75."
        },
        why: {
          prompt: "Why is [[f:3/4]] equal to 3 &divide; 4 and not 4 &divide; 3?",
          choices: [
            "The bar means the top is split into bottom-many equal parts: 3 split 4 ways",
            "The bigger number always goes first in a division",
            "It does not matter; both give the same answer"
          ],
          correct: 0,
          feedback: [
            "Right. 3 pizzas shared by 4 people is 3 &divide; 4 of a pizza each, which is 0.75.",
            "No. [[f:3/4]] is 3 &divide; 4 even though 4 is bigger. A proper fraction always gives a decimal less than 1.",
            "3 &divide; 4 = 0.75 and 4 &divide; 3 = 1.33&hellip;. Very different. Top divided by bottom, always."
          ]
        }
      },
      {
        say: "Worked example: [[f:5/8]]. 5 &divide; 8. Add zeros to the 5 as you need them: 5.000.",
        figure: { type: "longdiv", dividend: 5, divisor: 8, digits: 3 },
        ask: {
          prompt: "Write the fraction as a decimal. [[f:5/8]]",
          answer: { type: "num", value: "0.625", form: "decimal" },
          errors: [
            { value: "5.8", misconception: "bar-as-point", feedback: "[[f:5/8]] is less than 1. Divide: 5 &divide; 8." },
            { value: "0.58", misconception: "bar-as-point", feedback: "Those are just the digits. 5 &divide; 8 = 0.625." },
            { value: "8/5", misconception: "bar-as-point", feedback: "That is 8 &divide; 5 = 1.6. Top goes inside: 5 &divide; 8." }
          ],
          hint: "8 into 50 goes 6 (48), remainder 2. 8 into 20 goes 2 (16), remainder 4. 8 into 40 goes?",
          reveal: "0.625. 50 &divide; 8 = 6 r 2; 20 &divide; 8 = 2 r 4; 40 &divide; 8 = 5 r 0. Remainder 0 means it stops: a terminating decimal."
        }
      },
      {
        say: "Some divisions never finish. [[f:2/3]]: 3 into 20 is 6 remainder 2, then 3 into 20 again is 6 remainder 2, forever. Same remainder, same digit. Write a bar over the digit that repeats: [[r:0.(6)]].",
        figure: { type: "longdiv", dividend: 2, divisor: 3, digits: 4, caption: "The remainder is always 2, so the 6 repeats forever" },
        ask: {
          prompt: "Write the fraction as a decimal. Use the repeat bar. [[f:2/3]]",
          answer: { type: "num", value: "0.(6)", form: "decimal" },
          errors: [
            { value: "0.6", misconception: "repeating-truncate", feedback: "0.6 stops. [[f:2/3]] is 0.666&hellip; forever. Put the bar over the 6." },
            { value: "0.66", misconception: "repeating-truncate", feedback: "Two sixes is still cut short. The bar says it never ends: [[r:0.(6)]]." },
            { value: "0.67", misconception: "rounded-as-exact", feedback: "0.67 is rounded, not exact. The exact value is [[r:0.(6)]]." },
            { value: "3/2", misconception: "bar-as-point", feedback: "That is 3 &divide; 2 = 1.5. Divide 2 by 3." }
          ],
          hint: "The digit 6 comes up every time. Use the bar key.",
          reveal: "[[r:0.(6)]]. 2 &divide; 3 = 0.6666&hellip;. The bar over the 6 means it repeats forever."
        }
      },
      {
        say: "Now the other direction: decimal to fraction. Read the last decimal place. 0.375 ends in the thousandths place, so it is [[f:375/1000]]. Then simplify.",
        figure: { type: "placevalue", numbers: ["0.375"], caption: "Three places: thousandths" },
        ask: {
          prompt: "Write 0.375 as a fraction in simplest form.",
          answer: { type: "num", value: "3/8", form: "fraction" },
          errors: [
            { value: "375/100", misconception: "denominator-places", feedback: "0.375 has three decimal places, so the denominator is 1000, not 100. [[f:375/1000]], then simplify." },
            { value: "3/80", misconception: "denominator-places", feedback: "Check: 3 &divide; 80 = 0.0375, ten times too small. [[f:375/1000]] = [[f:3/8]]." },
            { value: "37/100", misconception: "denominator-places", feedback: "You dropped the 5. All three digits count: [[f:375/1000]]." }
          ],
          hint: "[[f:375/1000]]. Both end in 5 or 0, so divide top and bottom by 5. Then do it again. And again.",
          reveal: "[[f:3/8]]. [[f:375/1000]] &divide; 5 = [[f:75/200]] &divide; 5 = [[f:15/40]] &divide; 5 = [[f:3/8]]. (Or divide by 125 in one go.)"
        },
        why: {
          prompt: "Why is the denominator 1000 and not 100?",
          choices: [
            "0.375 has three decimal places, and the third place is thousandths",
            "Because 375 is a three-digit number, and bigger numbers need bigger denominators",
            "Because 1000 is easier to simplify than 100"
          ],
          correct: 0,
          feedback: [
            "Right. Count the places: tenths, hundredths, thousandths. The last digit's place is the denominator.",
            "It is about decimal places, not how big the number looks. 0.375 and 0.001 both have three places and both are over 1000.",
            "The denominator is decided by the place value, not by what is convenient."
          ]
        }
      },
      {
        say: "Faded example: 0.84. Two places, so hundredths.",
        ask: {
          prompt: "Write 0.84 as a fraction in simplest form.",
          answer: { type: "num", value: "21/25", form: "fraction" },
          errors: [
            { value: "42/5", misconception: "denominator-places", feedback: "Two decimal places means hundredths: [[f:84/100]], not [[f:84/10]]." },
            { value: "21/250", misconception: "denominator-places", feedback: "Too many zeros. 0.84 is 84 hundredths, so [[f:84/100]] = [[f:21/25]]." }
          ],
          hint: "[[f:84/100]]. What divides both 84 and 100? Try 4.",
          reveal: "[[f:21/25]]. 0.84 = [[f:84/100]]. 84 &divide; 4 = 21 and 100 &divide; 4 = 25."
        }
      },
      {
        say: "Mixed numbers: the whole number stays put, and only the fraction part gets divided. [[m:7 7/8]]: keep the 7, and [[f:7/8]] = 0.875. Glue them: 7.875.",
        figure: { type: "fdp", f: "[[m:7 7/8]]", d: "7.875", p: "787.5%", focus: "d" },
        ask: {
          prompt: "Write the mixed number as a decimal. [[m:7 7/8]]",
          answer: { type: "num", value: "7.875", form: "decimal" },
          errors: [
            { value: "7.78", misconception: "frac-part-as-decimal", feedback: "[[f:7/8]] is not .78. Divide: 7 &divide; 8 = 0.875, so 7.875." },
            { value: "0.875", misconception: "dropped-whole", feedback: "You lost the 7 wholes. [[m:7 7/8]] = 7 + 0.875 = 7.875." },
            { value: "7.7", misconception: "frac-part-as-decimal", feedback: "You wrote the 7 from [[f:7/8]] as .7. The fraction has to be divided: 7 &divide; 8 = 0.875. So 7.875." }
          ],
          hint: "7 + [[f:7/8]]. You already know [[f:7/8]] as a decimal.",
          reveal: "7.875. The 7 wholes stay in the ones place; [[f:7/8]] = 0.875 fills the decimal places."
        }
      },
      {
        say: "Decimal to mixed number works the same way backwards. 6.125: keep the 6, turn 0.125 into a fraction. Three places, so [[f:125/1000]], which simplifies to [[f:1/8]].",
        ask: {
          prompt: "Write 6.125 as a mixed number in simplest form.",
          answer: { type: "num", value: "49/8", form: "fraction" },
          errors: [
            { value: "6125/100", misconception: "denominator-places", feedback: "6.125 has three decimal places, so the fraction part is [[f:125/1000]], not over 100. [[m:6 1/8]]." },
            { value: "1/8", misconception: "dropped-whole", feedback: "You dropped the 6 wholes. The number is 6 + [[f:1/8]] = [[m:6 1/8]]." },
            { value: "61/8", misconception: "mixed-to-improper", feedback: "[[f:61/8]] just writes the 6 and the 1 side by side, and it equals 7.625, too big. The number is [[m:6 1/8]]. As an improper fraction: 6 &times; 8 + 1 = 49 eighths, [[f:49/8]]." }
          ],
          hint: "6 and [[f:125/1000]]. Divide top and bottom by 125.",
          reveal: "[[m:6 1/8]]. 0.125 = [[f:125/1000]] = [[f:1/8]]. Written as an improper fraction that is [[f:49/8]]; either is fine as long as it is simplified."
        }
      },
      {
        say: "Watch the places with a mixed number like [[m:1 2/100]]. The fraction part is 2 hundredths, 0.02, not 0.2.",
        ask: {
          prompt: "Write the mixed number as a decimal. [[m:1 2/100]]",
          answer: { type: "num", value: "1.02", form: "decimal" },
          errors: [
            { value: "1.2", misconception: "placeholder-zero", feedback: "[[f:2/100]] is 2 hundredths = 0.02. The zero holds the tenths place: 1.02." },
            { value: "1.002", misconception: "denominator-places", feedback: "Hundredths means two places: 0.02, so 1.02." },
            { value: "0.102", misconception: "bar-as-point", feedback: "Keep the 1 whole, then 0.02. 1.02." }
          ],
          hint: "2 hundredths. Two decimal places, with a zero in the tenths.",
          reveal: "1.02. [[m:1 2/100]] = 1 + 0.02 = 1.02 (and as a percent, 102%)."
        }
      },
      {
        say: "Independent, fraction to decimal.",
        ask: {
          prompt: "Write the fraction as a decimal. [[f:7/8]]",
          answer: { type: "num", value: "0.875", form: "decimal" },
          errors: [
            { value: "7.8", misconception: "bar-as-point", feedback: "[[f:7/8]] is less than 1. 7 &divide; 8." },
            { value: "0.78", misconception: "bar-as-point", feedback: "Not the digits. Divide: 7 &divide; 8 = 0.875." },
            { value: "8/7", misconception: "bar-as-point", feedback: "That is 8 &divide; 7. The top goes inside the box." },
            { value: "0.88", misconception: "rounded-as-exact", feedback: "7 &divide; 8 terminates exactly at 0.875. No rounding needed." }
          ],
          hint: "You know [[f:1/8]] = 0.125. Seven of those.",
          reveal: "0.875. 7 &divide; 8: 70 &divide; 8 = 8 r 6, 60 &divide; 8 = 7 r 4, 40 &divide; 8 = 5 r 0. Or 7 &times; 0.125."
        }
      },
      {
        say: "Independent, decimal to fraction.",
        ask: {
          prompt: "Write 0.025 as a fraction in simplest form.",
          answer: { type: "num", value: "1/40", form: "fraction" },
          errors: [
            { value: "1/4", misconception: "denominator-places", feedback: "0.025 is not 0.25. Three decimal places: [[f:25/1000]]." },
            { value: "5/2", misconception: "denominator-places", feedback: "Three places means thousandths, not tenths. [[f:25/1000]] = [[f:1/40]]." }
          ],
          hint: "Three places: [[f:25/1000]]. Divide top and bottom by 25.",
          reveal: "[[f:1/40]]. 0.025 = [[f:25/1000]]. 25 &divide; 25 = 1, 1000 &divide; 25 = 40."
        }
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    id: "L04",
    skill: "pct-frac",
    title: "Percent and fraction: the F-D-P triangle",
    minutes: 7,
    hook: "Three forms, one number. Percent &rarr; decimal &rarr; fraction is the safe road.",
    steps: [
      {
        say: "The teacher's triangle: F, D, P with arrows between them. A percent is already a fraction over 100. 45% = [[f:45/100]]. Then simplify. For messy percents, go through the decimal first: P &rarr; D &rarr; F.",
        figure: { type: "fdp", f: "[[f:9/20]]", d: "0.45", p: "45%", focus: "p", caption: "45% = [[f:45/100]] = [[f:9/20]] = 0.45" },
        ask: {
          prompt: "Write the percent as a fraction or mixed number in simplest form. 45%",
          answer: { type: "num", value: "9/20", form: "fraction" },
          errors: [
            { value: "9/2", misconception: "denominator-places", feedback: "Percent is per hundred, so 45% = [[f:45/100]], not [[f:45/10]]." },
            { value: "45", misconception: "pct-small-as-whole", feedback: "The % means out of 100. Write [[f:45/100]] and simplify." }
          ],
          hint: "[[f:45/100]]. Both divide by 5.",
          reveal: "[[f:9/20]]. 45% = [[f:45/100]]. 45 &divide; 5 = 9, 100 &divide; 5 = 20."
        }
      },
      {
        say: "Worked example: [[m:8 1/4]]%. Step 1: [[m:8 1/4]]% = 8.25%. Step 2: 8.25% = 0.0825. Step 3: read the decimal as a fraction. 0.0825 has four decimal places, so it is ten-thousandths.",
        figure: { type: "fdp", f: "?", d: "0.0825", p: "[[m:8 1/4]]%", focus: "f" },
        ask: {
          prompt: "0.0825 = [[f:?/10000]]. What goes on top?",
          answer: { type: "num", value: "825", form: "number" },
          errors: [
            { value: "8.25", misconception: "denominator-places", feedback: "The top of a fraction over 10,000 should be a whole number. 0.0825 &times; 10,000 = 825." },
            { value: "82.5", misconception: "denominator-places", feedback: "Four places means &times;10,000, which moves the point four hops: 0.0825 &rarr; 825." }
          ],
          hint: "Hop the point four places right in 0.0825.",
          reveal: "825. 0.0825 = [[f:825/10000]]. Four decimal places, four zeros."
        },
        why: {
          prompt: "Why is the denominator 10,000 and not 100?",
          choices: [
            "0.0825 has four decimal places; the last digit sits in the ten-thousandths place",
            "Because 8.25% has two decimal places, so you double it",
            "Because percent means per 10,000"
          ],
          correct: 0,
          feedback: [
            "Right. Hundredths of a percent are ten-thousandths. 8.25% = [[f:8.25/100]], and clearing that decimal gives [[f:825/10000]].",
            "The place value of the decimal decides it, not a doubling rule. 0.0825 ends in the fourth place.",
            "Percent means per 100. The extra two places come from the 0.25 inside 8.25."
          ]
        }
      },
      {
        say: "Step 4: simplify [[f:825/10000]]. Both end in 5 or 0. Try dividing by 25: 825 &divide; 25 = 33, 10000 &divide; 25 = 400.",
        ask: {
          prompt: "Write [[f:825/10000]] in simplest form.",
          answer: { type: "num", value: "33/400", form: "fraction" },
          errors: [
            { value: "33/40", misconception: "pct-shift-one-place", feedback: "Lost a zero. [[f:33/40]] = 0.825, ten times too big. 10000 &divide; 25 = 400." },
            { value: "33/4000", misconception: "denominator-places", feedback: "Too many zeros. [[f:33/4000]] = 0.00825. 10000 &divide; 25 = 400." }
          ],
          hint: "Divide by 5 twice if 25 is hard: [[f:825/10000]] &rarr; [[f:165/2000]] &rarr; ?",
          reveal: "[[f:33/400]]. [[f:825/10000]] &divide; 25 = [[f:33/400]]. Check: 33 &divide; 400 = 0.0825. Teacher's chain: [[m:8 1/4]]% = 8.25% = 0.0825 = [[f:825/10000]] = [[f:33/400]]."
        }
      },
      {
        say: "Faded example: [[f:2/5]]%. Same road. [[f:2/5]]% = 0.4% = 0.004. Three decimal places, so thousandths.",
        ask: {
          prompt: "Write the percent as a fraction in simplest form. [[f:2/5]]%",
          answer: { type: "num", value: "1/250", form: "fraction" },
          errors: [
            { value: "2/5", misconception: "pct-small-as-whole", feedback: "[[f:2/5]]% is not [[f:2/5]]. The % still means &divide;100. [[f:2/5]] &divide; 100 = [[f:2/500]] = [[f:1/250]]." },
            { value: "1/25", misconception: "pct-shift-one-place", feedback: "[[f:1/25]] = 0.04 = 4%. We need 0.4%, ten times smaller: [[f:1/250]]." },
            { value: "1/2500", misconception: "denominator-places", feedback: "0.004 has three places, so [[f:4/1000]], not over 10,000. Simplify: [[f:1/250]]." }
          ],
          hint: "0.004 = [[f:4/1000]]. Divide top and bottom by 4.",
          reveal: "[[f:1/250]]. [[f:2/5]]% = 0.4% = 0.004 = [[f:4/1000]] = [[f:1/250]]. Shortcut: [[f:2/5]] &divide; 100 = [[f:2/500]] = [[f:1/250]]."
        }
      },
      {
        say: "Now fraction to percent: the arrow goes F &rarr; D &rarr; P. Divide to get the decimal, then hop two places right. [[f:3/8]] = 0.375.",
        figure: { type: "fdp", f: "[[f:3/8]]", d: "0.375", p: "?", focus: "p" },
        ask: {
          prompt: "Write the fraction as a percent. [[f:3/8]]",
          answer: { type: "num", value: "37.5", form: "percent" },
          errors: [
            { value: "3.75", misconception: "pct-shift-one-place", feedback: "One hop. 0.375 &times; 100 = 37.5." },
            { value: "0.375", misconception: "pct-small-as-whole", feedback: "That is the decimal. To make it a percent, hop two places right: 37.5%." },
            { value: "375", misconception: "pct-shift-wrong-way", feedback: "Three hops. Percent is two: 37.5%." }
          ],
          hint: "0.375 &times; 100. Two hops right.",
          reveal: "37.5%. [[f:3/8]] = 0.375 = 37.5%."
        }
      },
      {
        say: "Mixed numbers and improper fractions give percents over 100%. [[m:6 1/8]] = 6.125, and two hops right makes 612.5%. The 6 wholes are 600% on their own. (The teacher wrote this one as [[m:6 125/1000]] = [[m:6 1/8]] = 6.125 = 612.5%.)",
        figure: { type: "fdp", f: "[[m:6 1/8]]", d: "6.125", p: "?", focus: "p" },
        ask: {
          prompt: "Write the fraction or mixed number as a percent. [[m:6 1/8]]",
          answer: { type: "num", value: "612.5", form: "percent" },
          errors: [
            { value: "61.25", misconception: "pct-shift-one-place", feedback: "One hop. 6.125 &times; 100 = 612.5. Six wholes alone are 600%." },
            { value: "6.125", misconception: "pct-small-as-whole", feedback: "That is the decimal. Hop two right: 612.5%." },
            { value: "612", misconception: "rounding-direction", feedback: "That chops off the .5. [[f:1/8]] = 0.125 = 12.5%, so the percent is 612.5%, not 612%." },
            { value: "6.18", misconception: "frac-part-as-decimal", feedback: "[[f:1/8]] is not .18. Divide: 1 &divide; 8 = 0.125. So 6.125 = 612.5%." }
          ],
          hint: "6 wholes = 600%. [[f:1/8]] = 0.125 = 12.5%. Add.",
          reveal: "612.5%. [[m:6 1/8]] = 6.125, and 6.125 &times; 100 = 612.5."
        }
      },
      {
        say: "Faded: an improper fraction. [[f:7/5]] is more than 1, so the percent is more than 100%.",
        ask: {
          prompt: "Write the fraction as a percent. [[f:7/5]]",
          answer: { type: "num", value: "140", form: "percent" },
          errors: [
            { value: "14", misconception: "pct-shift-one-place", feedback: "1.4 &times; 100 = 140. One hop only gave 14." },
            { value: "1.4", misconception: "pct-small-as-whole", feedback: "1.4 is the decimal. 140%." },
            { value: "500/7", misconception: "bar-as-point", feedback: "5 &divide; 7 is upside down. 7 &divide; 5 = 1.4 = 140%." },
            { value: "75", misconception: "bar-as-point", feedback: "7 and 5 are not digits to glue together. 7 &divide; 5 = 1.4 = 140%." }
          ],
          hint: "7 &divide; 5 = 1.4. Then two hops right.",
          reveal: "140%. [[f:7/5]] = 1.4 = 140%. More than one whole, more than 100%."
        }
      },
      {
        say: "When the division repeats, the percent repeats too. [[f:5/9]] = [[r:0.(5)]]. Two hops right: [[r:55.(5)]]%. The bar comes along. You can also write it as a mixed number: [[m:55 5/9]]%.",
        figure: { type: "fdp", f: "[[f:5/9]]", d: "[[r:0.(5)]]", p: "[[r:55.(5)]]%", focus: "p" },
        ask: {
          prompt: "Write the fraction as a percent. Use the repeat bar. [[f:5/9]]",
          answer: { type: "num", value: "55.(5)", form: "percent" },
          errors: [
            { value: "55", misconception: "repeating-truncate", feedback: "55% is cut short. The fives go on forever: [[r:55.(5)]]%." },
            { value: "56", misconception: "rounded-as-exact", feedback: "That is rounded. Keep it exact: [[r:55.(5)]]% or [[m:55 5/9]]%." },
            { value: "0.(5)", misconception: "pct-small-as-whole", feedback: "That is the decimal. Hop two right for the percent: [[r:55.(5)]]%." },
            { value: "5.(5)", misconception: "pct-shift-one-place", feedback: "One hop. Two hops right gives [[r:55.(5)]]%." }
          ],
          hint: "Ninths: [[f:5/9]] = [[r:0.(5)]]. Then two hops right; the bar stays on the 5.",
          reveal: "[[r:55.(5)]]%. 5 &divide; 9 = 0.555&hellip; = [[r:0.(5)]]. Times 100: [[r:55.(5)]]%, which is the same as [[m:55 5/9]]%."
        }
      },
      {
        say: "Independent: percent with a fraction, to a fraction.",
        ask: {
          prompt: "Write the percent as a fraction or mixed number in simplest form. [[m:12 1/2]]%",
          answer: { type: "num", value: "1/8", form: "fraction" },
          errors: [
            { value: "1/80", misconception: "pct-shift-one-place", feedback: "[[f:1/80]] = 0.0125 = 1.25%. You hopped one too many. 12.5% = 0.125 = [[f:1/8]]." },
            { value: "3/25", misconception: "frac-part-as-decimal", feedback: "[[f:3/25]] = 12%. You dropped the [[f:1/2]]. 12.5% = 0.125 = [[f:125/1000]] = [[f:1/8]]." },
            { value: "25/2", misconception: "pct-small-as-whole", feedback: "That is 12.5 as a fraction, with the % thrown away. Divide by 100: [[f:1/8]]." }
          ],
          hint: "12.5% = 0.125 = [[f:125/1000]]. Divide top and bottom by 125.",
          reveal: "[[f:1/8]]. [[m:12 1/2]]% = 12.5% = 0.125 = [[f:125/1000]] = [[f:1/8]]."
        }
      },
      {
        say: "Independent: a percent under 1%, to a fraction.",
        ask: {
          prompt: "Write the percent as a fraction in simplest form. 0.3%",
          answer: { type: "num", value: "3/1000", form: "fraction" },
          errors: [
            { value: "3/10", misconception: "pct-small-as-whole", feedback: "0.3 would be 30%. 0.3% = 0.003 = [[f:3/1000]]." },
            { value: "3/100", misconception: "pct-shift-one-place", feedback: "[[f:3/100]] is 3%. We need 0.3%, which is [[f:3/1000]]." }
          ],
          hint: "0.3% = 0.003. Three places.",
          reveal: "[[f:3/1000]]. 0.3% = 0.3 &divide; 100 = 0.003 = three thousandths."
        }
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    id: "L05",
    skill: "repeating",
    title: "Repeating decimals and the three kinds",
    minutes: 8,
    hook: "Some divisions never end. The bar is how you write forever in one stroke, and the test asks you to name the kind.",
    steps: [
      {
        say: "1 &divide; 3: 3 into 10 is 3 remainder 1. Then 3 into 10 again, 3 remainder 1. The same remainder means the same digit, forever. Write it once with a bar: [[r:0.(3)]].",
        figure: { type: "longdiv", dividend: 1, divisor: 3, digits: 4, caption: "Remainder 1 keeps coming back" },
        ask: {
          prompt: "Write the fraction as a decimal. Use the repeat bar. [[f:1/3]]",
          answer: { type: "num", value: "0.(3)", form: "decimal" },
          errors: [
            { value: "0.3", misconception: "repeating-truncate", feedback: "0.3 stops. [[f:1/3]] is 0.333&hellip; forever. Bar over the 3." },
            { value: "0.33", misconception: "repeating-truncate", feedback: "Still cut short. However many 3s you write, there are more. Use the bar." }
          ],
          hint: "Bar key, then 3.",
          reveal: "[[r:0.(3)]]. The remainder 1 repeats, so the digit 3 repeats."
        }
      },
      {
        say: "Ninths are the pattern to memorize: [[f:1/9]] = [[r:0.(1)]], [[f:2/9]] = [[r:0.(2)]], [[f:4/9]] = [[r:0.(4)]], [[f:7/9]] = [[r:0.(7)]]. The numerator repeats.",
        ask: {
          prompt: "Write the fraction as a decimal. [[f:8/9]]",
          answer: { type: "num", value: "0.(8)", form: "decimal" },
          errors: [
            { value: "0.8", misconception: "repeating-truncate", feedback: "0.8 is [[f:4/5]]. [[f:8/9]] is a bit more: 0.888&hellip; = [[r:0.(8)]]." },
            { value: "0.9", misconception: "rounded-as-exact", feedback: "0.9 is rounded. [[f:8/9]] is exactly [[r:0.(8)]], a hair below 0.9." },
            { value: "0.89", misconception: "rounded-as-exact", feedback: "Rounded. The exact value is [[r:0.(8)]]." }
          ],
          hint: "Ninths pattern. Which digit repeats?",
          reveal: "[[r:0.(8)]]. 8 &divide; 9 = 0.888&hellip;. Eight ninths, eights forever."
        },
        why: {
          prompt: "Why does [[f:4/9]] come out as [[r:0.(4)]]?",
          choices: [
            "[[f:1/9]] = [[r:0.(1)]], and [[f:4/9]] is four of those: 4 &times; [[r:0.(1)]] = [[r:0.(4)]]",
            "Any fraction's decimal just repeats its numerator",
            "Because 4 + 9 = 13, and 13 is odd"
          ],
          correct: 0,
          feedback: [
            "Right. The ninths pattern works because one ninth is [[r:0.(1)]]. (Elevenths are similar: [[f:1/11]] = [[r:0.(09)]].)",
            "Not for every fraction. The numerator only repeats when the bottom is 9, 99, 999 and so on ([[f:4/99]] = [[r:0.(04)]]). [[f:4/5]] = 0.8 and [[f:4/7]] = [[r:0.(571428)]]. The pattern belongs to bottoms made of nines.",
            "Nothing to do with odd or even. It comes from 1 &divide; 9 = [[r:0.(1)]]."
          ]
        }
      },
      {
        say: "The bar only covers digits that repeat. 1 &divide; 6: 6 into 10 is 1 remainder 4. Then 6 into 40 is 6 remainder 4. From here on it is 6, 6, 6. The 1 happened once; only the 6 repeats. So: [[r:0.1(6)]].",
        figure: { type: "longdiv", dividend: 1, divisor: 6, digits: 4, caption: "The remainder 4 is the first one to come back, so the bar starts at the 6" },
        ask: {
          prompt: "Write the fraction as a decimal, with the bar in the right place. [[f:1/6]]",
          answer: { type: "num", value: "0.1(6)", form: "decimal" },
          errors: [
            { value: "0.(16)", misconception: "bar-placement", feedback: "[[r:0.(16)]] means 0.161616&hellip;. But 1 &divide; 6 is 0.16666&hellip;. Only the 6 repeats, so the bar goes on the 6 only." },
            { value: "0.16", misconception: "repeating-truncate", feedback: "Cut short. The sixes go on forever: [[r:0.1(6)]]." },
            { value: "0.17", misconception: "rounded-as-exact", feedback: "Rounded. Exact is [[r:0.1(6)]]." }
          ],
          hint: "0.1666&hellip;. Which digit repeats? Put the bar over only that one.",
          reveal: "[[r:0.1(6)]]. The 1 is a one-time digit; the 6 repeats. The bar goes on the repeating part only."
        }
      },
      {
        say: "Faded example: [[f:5/12]]. 12 into 50 is 4 r 2. 12 into 20 is 1 r 8. 12 into 80 is 6 r 8. 12 into 80 is 6 r 8 again. The remainder 8 comes back, so the 6 repeats from there.",
        figure: { type: "longdiv", dividend: 5, divisor: 12, digits: 4 },
        ask: {
          prompt: "Write the fraction as a decimal, with the bar in the right place. [[f:5/12]]",
          answer: { type: "num", value: "0.41(6)", form: "decimal" },
          errors: [
            { value: "0.(416)", misconception: "bar-placement", feedback: "The 4 and 1 happen once. Only the 6 repeats: [[r:0.41(6)]]." },
            { value: "0.4(16)", misconception: "bar-placement", feedback: "The 1 does not come back; the remainder 8 is what repeats, and it gives a 6 each time. [[r:0.41(6)]]." },
            { value: "0.416", misconception: "repeating-truncate", feedback: "The sixes never stop. Bar over the 6." },
            { value: "0.42", misconception: "rounded-as-exact", feedback: "Rounded. Exact is [[r:0.41(6)]]." }
          ],
          hint: "0.41666&hellip;. The first repeated remainder is 8. Which digit does it produce?",
          reveal: "[[r:0.41(6)]]. Digits 4 and 1 appear once; then the remainder 8 repeats and so does the 6."
        }
      },
      {
        say: "Repeating decimals turn into percents the usual way: two hops right, and the bar comes along. [[f:2/3]] = [[r:0.(6)]] = [[r:66.(6)]]%, also written [[m:66 2/3]]%.",
        ask: {
          prompt: "Write the fraction as a percent. Use the repeat bar. [[f:2/3]]",
          answer: { type: "num", value: "66.(6)", form: "percent" },
          errors: [
            { value: "66", misconception: "repeating-truncate", feedback: "66% is cut short. [[r:66.(6)]]%, the sixes continue after the point." },
            { value: "67", misconception: "rounded-as-exact", feedback: "Rounded. The exact percent is [[r:66.(6)]]% = [[m:66 2/3]]%." },
            { value: "66.7", misconception: "rounded-as-exact", feedback: "Rounded to one place. Keep the bar: [[r:66.(6)]]%." },
            { value: "0.(6)", misconception: "pct-small-as-whole", feedback: "That is the decimal. Two hops right makes it a percent: [[r:66.(6)]]%." }
          ],
          hint: "[[r:0.(6)]] &times; 100. The 6s keep going past the point.",
          reveal: "[[r:66.(6)]]%. [[r:0.(6)]] hopped two right is [[r:66.(6)]]. Same as [[m:66 2/3]]%."
        }
      },
      {
        say: "Vocabulary the test uses. There are three kinds of decimals. Terminating: it stops (0.35, 0.875). Repeating: a block of digits comes back forever ([[r:0.(3)]], 0.141414&hellip; = [[r:0.(14)]]). Non-terminating and non-repeating: it goes on forever with no block that repeats: 0.087621134&hellip; (the digits keep going with no repeating pattern). Every fraction is one of the first two kinds.",
        figure: { type: "longdiv", dividend: 3, divisor: 14, digits: 7, caption: "3 &divide; 14 = 0.2142857&hellip; The remainders must eventually repeat, so the digits do too: [[r:0.2(142857)]]" },
        ask: {
          prompt: "What kind of decimal is 0.141414&hellip;?",
          answer: { type: "choice", choices: ["repeating", "terminating", "non-terminating, non-repeating"], correct: 0 },
          errors: [
            { choice: 1, misconception: "decimal-kind", feedback: "The dots mean it never stops. And the block 14 keeps coming back, so it repeats: [[r:0.(14)]]." },
            { choice: 2, misconception: "decimal-kind", feedback: "It does not terminate, true, but it does repeat: 14, 14, 14. Non-repeating means no block ever comes back." }
          ],
          hint: "Is there a block of digits that comes back again and again?",
          reveal: "Repeating. 0.141414&hellip; = [[r:0.(14)]]. The block 14 repeats forever."
        }
      },
      {
        say: "A fraction like [[f:3/14]] can only terminate or repeat, never go on with no pattern. In long division by 14 there are only 13 possible remainders, so one of them has to come back, and from there the digits repeat.",
        ask: {
          prompt: "What kind of decimal is [[f:3/14]]?",
          answer: { type: "choice", choices: ["repeating", "terminating", "non-terminating, non-repeating"], correct: 0 },
          errors: [
            { choice: 1, misconception: "decimal-kind", feedback: "3 &divide; 14 never reaches remainder 0 (14 has a factor of 7, which 10 does not), so it does not stop. It repeats: [[r:0.2(142857)]]." },
            { choice: 2, misconception: "decimal-kind", feedback: "A fraction can never be non-repeating. The remainders in long division run out of choices and come back, so the digits repeat." }
          ],
          hint: "It came from a fraction. What are the only two possibilities for a fraction?",
          reveal: "Repeating. 3 &divide; 14 = 0.2142857142857&hellip; = [[r:0.2(142857)]]. A fraction always terminates or repeats."
        },
        why: {
          prompt: "Why can a fraction never be a non-terminating, non-repeating decimal?",
          choices: [
            "In long division there are only so many possible remainders, so one must come back, and the digits repeat from there (or the remainder hits 0 and it stops)",
            "Because fractions are always less than 1",
            "Because you can always simplify a fraction"
          ],
          correct: 0,
          feedback: [
            "Right. Dividing by 14 has only 13 non-zero remainders available. Non-repeating decimals like pi cannot be written as a fraction at all.",
            "Size has nothing to do with it; [[f:7/5]] = 1.4 terminates. It is about the remainders running out of options.",
            "Simplifying does not change the decimal. The reason is the remainders: a limited set has to repeat."
          ]
        }
      },
      {
        say: "The teacher's example: 0.087621134&hellip; with no block that comes back. It never stops and never repeats. That is the third kind.",
        ask: {
          prompt: "What kind of decimal is 0.087621134&hellip; (the digits keep going with no repeating pattern)?",
          answer: { type: "choice", choices: ["non-terminating, non-repeating", "repeating", "terminating"], correct: 0 },
          errors: [
            { choice: 1, misconception: "decimal-kind", feedback: "A long messy decimal is not automatically repeating. Repeating needs a block that comes back every time, and there is none here." },
            { choice: 2, misconception: "decimal-kind", feedback: "The dots mean it goes on forever. Terminating means it stops." }
          ],
          hint: "Does it stop? Does any block of digits keep coming back?",
          reveal: "Non-terminating, non-repeating. It never ends and no block repeats, so it cannot come from a fraction."
        }
      },
      {
        say: "Independent. Four numbers, and only one of them is a terminating decimal. Decide which one.",
        ask: {
          prompt: "Which of these is a terminating decimal?",
          answer: { type: "choice", choices: ["[[f:7/8]]", "[[f:7/9]]", "[[f:3/14]]", "0.212112111&hellip;"], correct: 0 },
          errors: [
            { choice: 1, misconception: "decimal-kind", feedback: "[[f:7/9]] = [[r:0.(7)]], repeating. Ninths always repeat." },
            { choice: 2, misconception: "decimal-kind", feedback: "[[f:3/14]] = [[r:0.2(142857)]], repeating. The 14 has a factor of 7, and it is already in simplest form. A fraction in simplest form terminates only when its denominator has no prime factors except 2s and 5s. ([[f:3/6]] terminates because it simplifies to [[f:1/2]].)" },
            { choice: 3, misconception: "decimal-kind", feedback: "0.212112111&hellip; never stops and the pattern keeps changing (one 1, then two, then three), so no block repeats. Non-terminating, non-repeating." }
          ],
          hint: "Simplify first if you can. Which fraction has a denominator made only of 2s and 5s?",
          reveal: "[[f:7/8]] = 0.875, which stops. 8 = 2 &times; 2 &times; 2, and a fraction in simplest form whose denominator is built only from 2s and 5s always terminates."
        }
      },
      {
        say: "One more: write the repeating one properly.",
        ask: {
          prompt: "Write the fraction as a decimal. Use the repeat bar. [[f:7/9]]",
          answer: { type: "num", value: "0.(7)", form: "decimal" },
          errors: [
            { value: "0.7", misconception: "repeating-truncate", feedback: "0.7 stops. [[f:7/9]] is 0.777&hellip; forever: [[r:0.(7)]]." },
            { value: "0.78", misconception: "rounded-as-exact", feedback: "Rounded. Exact is [[r:0.(7)]]." }
          ],
          hint: "Ninths pattern.",
          reveal: "[[r:0.(7)]]. 7 &divide; 9 = 0.777&hellip;. As a percent, [[r:77.(7)]]%."
        }
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    id: "L06",
    skill: "compare-mixed",
    title: "Comparing mixed forms: same fruit first",
    minutes: 6,
    hook: "You cannot compare a fraction to a percent until they speak the same language. Make everything a decimal.",
    steps: [
      {
        say: "To compare [[f:3/8]], 0.4 and 35%, change each one to a decimal: 0.375, 0.4, 0.35. Now line them up in a place-value chart and compare left to right.",
        figure: { type: "placevalue", numbers: ["0.375", "0.400", "0.350"], caption: "[[f:3/8]], 0.4, 35% as decimals, padded to three places" },
        ask: {
          prompt: "Tell which number is greatest.",
          answer: { type: "choice", choices: ["[[f:3/8]]", "0.4", "35%"], correct: 1 },
          errors: [
            { choice: 0, misconception: "longer-larger", feedback: "0.375 has more digits than 0.4, but 0.400 &gt; 0.375. Compare tenths: 4 beats 3." },
            { choice: 2, misconception: "pct-small-as-whole", feedback: "35% is 0.35, not 35. As decimals: 0.35 &lt; 0.375 &lt; 0.4." }
          ],
          hint: "All three as decimals: 0.375, 0.400, 0.350. Which has the most tenths?",
          reveal: "0.4. As decimals they are 0.375, 0.400, 0.350. 0.400 has 4 tenths; the others have 3."
        }
      },
      {
        say: "Worked example: order [[f:2/5]], 0.45 and 42% from least to greatest. First, each one as a decimal.",
        ask: {
          prompt: "Write [[f:2/5]] as a decimal.",
          answer: { type: "num", value: "0.4", form: "decimal" },
          errors: [
            { value: "2.5", misconception: "bar-as-point", feedback: "The bar means divide: 2 &divide; 5 = 0.4." },
            { value: "0.25", misconception: "bar-as-point", feedback: "Not the digits. 2 &divide; 5 = 0.4 (two fifths is four tenths)." }
          ],
          hint: "2 &divide; 5. Or: [[f:2/5]] = [[f:4/10]].",
          reveal: "0.4. [[f:2/5]] = [[f:4/10]] = 0.4."
        }
      },
      {
        say: "Next, the percent.",
        ask: {
          prompt: "Write the percent as a decimal. 42%",
          answer: { type: "num", value: "0.42", form: "decimal" },
          errors: [
            { value: "4.2", misconception: "pct-shift-one-place", feedback: "Two hops left, not one: 0.42." },
            { value: "42", misconception: "pct-small-as-whole", feedback: "The % means &divide;100: 0.42." }
          ],
          hint: "42 per hundred. Two hops left.",
          reveal: "0.42. 42% = 42 &divide; 100 = 0.42."
        }
      },
      {
        say: "Now we have 0.40, 0.45, 0.42. Put them in order, then write the answer using the original forms.",
        figure: { type: "placevalue", numbers: ["0.40", "0.45", "0.42"] },
        ask: {
          prompt: "Order the numbers from least to greatest.",
          answer: { type: "order", items: ["[[f:2/5]]", "0.45", "42%"], correct: [0, 2, 1] },
          errors: [
            { order: [0, 1, 2], misconception: "longer-larger", feedback: "0.45 vs 0.42: hundredths 5 vs 2, so 0.42 comes before 0.45." },
            { order: [2, 0, 1], misconception: "pct-small-as-whole", feedback: "42% = 0.42, which is more than 0.40. Order: 0.40, 0.42, 0.45." }
          ],
          hint: "The tenths are all 4, so look at the hundredths. Then match each decimal back to its original form.",
          reveal: "[[f:2/5]], 42%, 0.45. As decimals: 0.40 &lt; 0.42 &lt; 0.45."
        },
        why: {
          prompt: "Why change everything to decimals instead of fractions?",
          choices: [
            "Decimals line up by place value, so you compare digit by digit with no common denominator needed",
            "Fractions cannot be compared",
            "Decimals are always bigger than fractions"
          ],
          correct: 0,
          feedback: [
            "Right. Fractions work too, but you would need a common denominator. Decimals already share one: powers of ten.",
            "They can, with a common denominator. Decimals are just faster when forms are mixed.",
            "A decimal and a fraction can be the exact same number. The form does not change the size."
          ]
        }
      },
      {
        say: "Faded example: 0.8, [[f:7/8]], 82%, [[r:0.(8)]]. Convert each to a decimal in your head: 0.8, 0.875, 0.82, 0.888&hellip;",
        ask: {
          prompt: "Order the numbers from least to greatest.",
          answer: { type: "order", items: ["0.8", "[[f:7/8]]", "82%", "[[r:0.(8)]]"], correct: [0, 2, 1, 3] },
          errors: [
            { order: [0, 2, 3, 1], misconception: "repeating-truncate", feedback: "[[r:0.(8)]] = 0.8888&hellip; which is more than 0.875. Compare hundredths: 8 vs 7." },
            { order: [0, 1, 2, 3], misconception: "longer-larger", feedback: "[[f:7/8]] = 0.875 and 82% = 0.82. 0.820 &lt; 0.875." },
            { order: [3, 0, 2, 1], misconception: "repeating-truncate", feedback: "[[r:0.(8)]] is not smaller than 0.8. It is 0.8 plus more eights, so it is the biggest." }
          ],
          hint: "Pad to three places: 0.800, 0.875, 0.820, 0.888. Compare hundredths.",
          reveal: "0.8, 82%, [[f:7/8]], [[r:0.(8)]]. Decimals: 0.800 &lt; 0.820 &lt; 0.875 &lt; 0.888&hellip;"
        }
      },
      {
        say: "A trap the test likes: a tiny percent next to a small decimal.",
        ask: {
          prompt: "Tell which number is greater. 0.3% or 0.03?",
          answer: { type: "choice", choices: ["0.3%", "0.03", "They are equal"], correct: 1 },
          errors: [
            { choice: 0, misconception: "pct-small-as-whole", feedback: "0.3% is not 0.3. It is 0.3 &divide; 100 = 0.003, which is less than 0.03." },
            { choice: 2, misconception: "pct-shift-one-place", feedback: "0.3% = 0.003, not 0.03. Two hops, not one." }
          ],
          hint: "Write 0.3% as a decimal first. Two hops left.",
          reveal: "0.03 is greater. 0.3% = 0.003, and 0.030 &gt; 0.003."
        }
      },
      {
        say: "Independent. Numbers above 1 this time.",
        ask: {
          prompt: "Order the numbers from least to greatest.",
          answer: { type: "order", items: ["1.2", "[[f:9/8]]", "115%", "[[r:1.(1)]]"], correct: [3, 1, 2, 0] },
          errors: [
            { order: [1, 3, 2, 0], misconception: "repeating-truncate", feedback: "[[r:1.(1)]] = 1.111&hellip; and [[f:9/8]] = 1.125. 1.111 &lt; 1.125." },
            { order: [2, 3, 1, 0], misconception: "pct-small-as-whole", feedback: "115% = 1.15, which is more than 1.125 and 1.111." },
            { order: [0, 1, 2, 3], misconception: "longer-larger", feedback: "1.2 = 1.200 is the biggest here. Pad and compare: 1.111, 1.125, 1.150, 1.200." }
          ],
          hint: "Decimals: 1.200, 1.125, 1.150, 1.111. Compare tenths, then hundredths.",
          reveal: "[[r:1.(1)]], [[f:9/8]], 115%, 1.2. Decimals: 1.111 &lt; 1.125 &lt; 1.15 &lt; 1.2."
        }
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    id: "L07",
    skill: "rounding",
    title: "Rounding: math rounding vs real-life rounding",
    minutes: 7,
    hook: "Math rounding goes to the nearest. Real life asks a different question: do you need enough, or can you only take whole ones?",
    steps: [
      {
        say: "Math rounding: find the place you are rounding to, then look at the one digit to its right. 5 or more rounds up; 4 or less leaves it alone. 4.3 to the nearest whole is 4, because 3 is less than 5.",
        figure: { type: "roundline", value: "4.3", step: 1, mode: "nearest", caption: "4.3 is closer to 4 than to 5" },
        ask: {
          prompt: "Round 3.86 to the nearest tenth.",
          answer: { type: "num", value: "3.9", form: "decimal" },
          errors: [
            { value: "3.8", misconception: "rounding-direction", feedback: "The digit to the right of the tenths is 6. Six is 5 or more, so the 8 goes up to 9: 3.9." },
            { value: "4", misconception: "rounding-direction", feedback: "That is the nearest whole. The question says nearest tenth: keep one decimal place. 3.9." },
            { value: "3.86", misconception: "rounding-direction", feedback: "Nothing was rounded. To the nearest tenth means one decimal place: 3.9." }
          ],
          hint: "Underline the 8 (tenths). Circle the 6 next to it. Is 6 five or more?",
          reveal: "3.9. The tenths digit is 8; the next digit, 6, is 5 or more, so round up to 3.9."
        }
      },
      {
        say: "Money rounds to the nearest cent, which is the nearest hundredth. $3.125 has a 5 in the thousandths place, so it rounds up to $3.13. Money always has exactly two decimal places.",
        figure: { type: "roundline", value: "3.125", step: 0.01, mode: "nearest" },
        ask: {
          prompt: "Round $3.125 to the nearest cent.",
          answer: { type: "num", value: "3.13", form: "money", unit: "$" },
          errors: [
            { value: "3.12", misconception: "rounding-direction", feedback: "The thousandths digit is 5, and 5 rounds up: $3.13." },
            { value: "3.125", misconception: "money-cents", feedback: "There is no half cent. Money has two decimal places: $3.13." },
            { value: "3.1", misconception: "money-cents", feedback: "That is the nearest dime. Nearest cent means two decimal places: $3.13." },
            { value: "3", misconception: "rounding-direction", feedback: "That is the nearest dollar. Nearest cent: $3.13." }
          ],
          hint: "Cents are hundredths. Look at the digit after the hundredths place.",
          reveal: "$3.13. Hundredths digit is 2; the next digit is 5, so round up to 3 hundredths: $3.13."
        },
        why: {
          prompt: "Why does money stop at two decimal places?",
          choices: [
            "A cent is one hundredth of a dollar, and there is nothing smaller than a cent to pay with",
            "Because calculators only show two places",
            "Because every answer should be rounded to two places"
          ],
          correct: 0,
          feedback: [
            "Right. $3.125 is three dollars, twelve cents and half a cent, and half a cent does not exist. So $3.13.",
            "Calculators show lots of places. The reason is the coins: the smallest one is a cent, a hundredth.",
            "Only money is always two places. A length could be 2.375 inches; a count of buses must be a whole number."
          ]
        }
      },
      {
        say: "Real-life rounding is different. 130 students are going on a trip and each bus holds 48. 130 &divide; 48 = 2.7 and a bit. Math rounding says 3. But even if it were 2.1 buses, you would still need 3, because 2 buses leave people behind. When you need ENOUGH, always round up.",
        figure: { type: "roundline", value: "2.708", step: 1, mode: "up", caption: "2 buses carry 96. Not enough. So 3." },
        ask: {
          prompt: "How many buses are needed for 130 students if each bus holds 48?",
          answer: { type: "num", value: "3", form: "number", label: ["buses", "bus"] },
          errors: [
            { value: "2", misconception: "math-vs-real-rounding", feedback: "2 buses hold 96 students. 34 would be left standing. When you need enough, round up: 3 buses." },
            { value: "65/24", misconception: "math-vs-real-rounding", feedback: "2.708 buses is the math answer, but you cannot order 0.7 of a bus. The third bus is needed even if it is mostly empty: 3 buses." }
          ],
          hint: "130 &divide; 48 is between 2 and 3. Does 2 buses fit everyone?",
          reveal: "3 buses. 130 &divide; 48 &asymp; 2.7. Two buses are not enough, so round up to 3."
        }
      },
      {
        say: "The other direction. Max has $20 and comic books cost $3.75 each. 20 &divide; 3.75 = 5.33&hellip;. He cannot buy a third of a comic, and 6 would cost $22.50, which he does not have. When the question is how many you can AFFORD or FIT, round down.",
        figure: { type: "roundline", value: "5.33", step: 1, mode: "down", caption: "6 comics cost $22.50. Too much. So 5." },
        ask: {
          prompt: "How many comic books can Max buy with $20 if each costs $3.75?",
          answer: { type: "num", value: "5", form: "number", label: ["comic books", "comics", "books", "comic"] },
          errors: [
            { value: "6", misconception: "math-vs-real-rounding", feedback: "6 &times; $3.75 = $22.50, more than $20. He can only pay for whole comics he can afford: 5." },
            { value: "16/3", misconception: "math-vs-real-rounding", feedback: "5.33 is the math answer, but the store does not sell a third of a comic. Round down: 5." }
          ],
          hint: "5 comics cost $18.75. 6 cost $22.50. Which can he pay for?",
          reveal: "5 comic books. 20 &divide; 3.75 &asymp; 5.3. He can afford 5 whole comics and has $1.25 left."
        },
        why: {
          prompt: "Why round down here but up for the buses?",
          choices: [
            "The buses have to hold everyone, so you need enough (up). Money only buys whole comics, so you take what you can afford (down).",
            "Always round down when the problem is about money",
            "Because 5.33 is closer to 5 and 2.7 is closer to 3"
          ],
          correct: 0,
          feedback: [
            "Right. Read the situation: enough means up, can afford or can fit means down. The decimal part does not decide it; the story does.",
            "Not always. If something costs $5.33 to make, you charge at least $5.34 to not lose money. The story decides, not the topic.",
            "That is math rounding, and it only agreed by luck. 2.1 buses would still need 3, and 5.9 comics would still be 5."
          ]
        }
      },
      {
        say: "Faded example. A recipe needs [[m:2 1/4]] cups of flour per batch and Max has 10 cups. How many full batches? 10 &divide; [[m:2 1/4]] = 10 &divide; [[f:9/4]] = 10 &times; [[f:4/9]] = [[f:40/9]] = [[m:4 4/9]].",
        ask: {
          prompt: "How many full batches can Max make?",
          answer: { type: "num", value: "4", form: "number", label: ["batches", "batch"] },
          errors: [
            { value: "5", misconception: "math-vs-real-rounding", feedback: "5 batches would need [[m:11 1/4]] cups. He has 10. The fifth batch cannot be finished: 4 full batches." },
            { value: "40/9", misconception: "math-vs-real-rounding", feedback: "[[m:4 4/9]] is the math answer. The question says full batches, so the partial batch does not count: 4." },
            { value: "45/2", misconception: "wrong-operation", feedback: "10 &times; [[m:2 1/4]] = [[m:22 1/2]] is multiplying. How many [[m:2 1/4]]s fit in 10 is a division: 10 &divide; [[m:2 1/4]]." }
          ],
          hint: "[[m:4 4/9]] batches. Is the last part a full batch?",
          reveal: "4 batches. 10 &divide; [[m:2 1/4]] = [[m:4 4/9]]. Only 4 of those are full, so round down."
        }
      },
      {
        say: "Faded example, the other way. Pencils come in packs of 12. The teacher needs 136 pencils. 136 &divide; 12 = 11.33&hellip;",
        ask: {
          prompt: "How many packs must the teacher buy?",
          answer: { type: "num", value: "12", form: "number", label: ["packs", "pack"] },
          errors: [
            { value: "11", misconception: "math-vs-real-rounding", feedback: "11 packs is 132 pencils, 4 short. She needs enough, so round up: 12 packs." },
            { value: "34/3", misconception: "math-vs-real-rounding", feedback: "11.33 packs cannot be bought. She needs enough pencils, so the next whole pack: 12." }
          ],
          hint: "Does 11 packs cover 136 pencils? 11 &times; 12 = ?",
          reveal: "12 packs. 11 packs give 132, not enough. Round up to 12 (144 pencils, 8 spare)."
        }
      },
      {
        say: "Independent: money to the nearest cent. Label it.",
        ask: {
          prompt: "Ribbon costs $0.35 per foot. Max buys 7.5 feet. How much does he pay, to the nearest cent?",
          answer: { type: "num", value: "2.63", form: "money", unit: "$", rounding: { mode: "nearest", to: 0.01, why: "Money is paid to the cent; 2.625 has a half cent, so round to the nearest cent." } },
          errors: [
            { value: "2.625", misconception: "money-cents", feedback: "Half a cent cannot be paid. Round to the nearest cent: $2.63." },
            { value: "2.62", misconception: "rounding-direction", feedback: "The thousandths digit is 5, which rounds up: $2.63." },
            { value: "26.25", misconception: "decimal-mult-places", feedback: "0.35 &times; 7.5: 35 &times; 75 = 2625, with 2 + 1 = 3 decimal places: 2.625. Then round: $2.63." },
            { value: "0.2625", misconception: "decimal-mult-places", feedback: "Three decimal places in the product, not four: 2.625, which rounds to $2.63." }
          ],
          hint: "0.35 &times; 7.5 = 2.625. Now the cent rule.",
          reveal: "$2.63. 0.35 &times; 7.5 = 2.625, and 2.625 to the nearest cent is $2.63."
        }
      },
      {
        say: "Independent: real-life rounding. Decide which way before you write the answer.",
        ask: {
          prompt: "A ferry holds 35 people. 212 people are waiting. How many trips does the ferry need to make?",
          answer: { type: "num", value: "7", form: "number", label: ["trips", "trip"], rounding: { mode: "up", to: 1, why: "Everyone has to get across, so a partial trip means one more whole trip." } },
          errors: [
            { value: "6", misconception: "math-vs-real-rounding", feedback: "6 trips carry 210 people. Two are still on the dock. Round up: 7 trips." },
            { value: "212/35", misconception: "math-vs-real-rounding", feedback: "6.06 trips is the math answer, but a trip is a whole thing. 6 is not enough, so 7." }
          ],
          hint: "212 &divide; 35 is just over 6. Is 6 trips enough for everyone?",
          reveal: "7 trips. 6 trips carry 210, so 2 people need a seventh trip."
        }
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    id: "L08",
    skill: "word-frac",
    title: "Fraction word problems: the four moves",
    minutes: 8,
    hook: "Every word problem is the same routine: what is the question and its label, which operation and why, compute, check, label.",
    steps: [
      {
        say: "The routine. 1: Read, then say what the question is asking and what label the answer gets. 2: Pick the operation and say why. 3: If there are two steps, plan both before computing. 4: Compute. 5: Check that the size makes sense. 6: Write the label. Here is one: a recipe uses [[f:3/4]] cup of sugar per batch. How many batches can Max make with 6 cups of sugar?",
        ask: {
          prompt: "Move 1. What does the answer count?",
          answer: { type: "choice", choices: ["batches", "cups", "cups per batch"], correct: 0 },
          errors: [
            { choice: 1, misconception: "no-label", feedback: "The cups are given. The question asks how many batches. The label is batches." },
            { choice: 2, misconception: "no-label", feedback: "Cups per batch is given ([[f:3/4]]). The question wants a number of batches." }
          ],
          hint: "Re-read the last sentence. How many what?",
          reveal: "Batches. The question is how many batches, so the answer is a number of batches."
        }
      },
      {
        say: "Move 2: which operation? We are asking how many [[f:3/4]]s fit inside 6. That is division: 6 &divide; [[f:3/4]]. The picture shows 6 cups cut into [[f:3/4]]-cup servings.",
        figure: { type: "groups", total: "6", size: "3/4", unit: "cups" },
        ask: {
          prompt: "Which operation?",
          answer: { type: "choice", choices: ["6 &divide; [[f:3/4]]", "6 &times; [[f:3/4]]", "6 &minus; [[f:3/4]]"], correct: 0 },
          errors: [
            { choice: 1, misconception: "wrong-operation", feedback: "6 &times; [[f:3/4]] = [[m:4 1/2]] cups, and cups is the wrong label. Also, batches are smaller than a cup, so there must be more than 6 of them. How many fit is division." },
            { choice: 2, misconception: "wrong-operation", feedback: "Subtracting once tells you what is left after one batch. We want how many batches in total: divide." }
          ],
          hint: "How many groups of [[f:3/4]] fit in 6? Fitting groups is which operation?",
          reveal: "6 &divide; [[f:3/4]]. How many groups of a size fit in a total is always division."
        },
        why: {
          prompt: "Why is this a division and not a multiplication?",
          choices: [
            "We are counting how many groups of [[f:3/4]] fit inside 6; counting groups is division",
            "Because the numbers are fractions",
            "Because the answer has to be smaller than 6"
          ],
          correct: 0,
          feedback: [
            "Right. And a check: each batch uses less than a cup, so there should be more than 6 batches. Division by a fraction less than 1 makes the number bigger.",
            "Fractions can be multiplied too ([[f:3/4]] of 6 cups is a multiplication). The story decides: how many fit means divide.",
            "The answer is bigger than 6 here. Dividing by a number less than 1 makes things bigger, and that makes sense: small batches, many of them."
          ]
        }
      },
      {
        say: "Move 4: compute. Keep, change, flip. 6 &divide; [[f:3/4]] = 6 &times; [[f:4/3]] = [[f:24/3]] = 8. Move 5: check. 8 batches &times; [[f:3/4]] cup = 6 cups. It works.",
        ask: {
          prompt: "How many batches can Max make? Write the answer with its label.",
          answer: { type: "num", value: "8", form: "number", label: ["batches", "batch"] },
          errors: [
            { value: "9/2", misconception: "wrong-operation", feedback: "[[m:4 1/2]] is 6 &times; [[f:3/4]]. That is [[f:3/4]] of 6 cups, not a count of batches. Divide: 6 &divide; [[f:3/4]] = 8." },
            { value: "1/8", misconception: "div-no-flip", feedback: "You flipped the 6. Keep the first number, flip the second: 6 &times; [[f:4/3]] = 8." },
            { value: "8/3", misconception: "arithmetic-slip", feedback: "The flip was right, but the 3 got used twice. 6 &times; [[f:4/3]] = [[f:24/3]], and the 3 on the bottom divides the 24 once: 8. (If you cancel 6 and 3 to make 2, the 3 is used up, so the answer is 2 &times; 4 = 8.)" }
          ],
          hint: "6 &times; [[f:4/3]]. Then the label.",
          reveal: "8 batches. 6 &divide; [[f:3/4]] = 6 &times; [[f:4/3]] = 8. Check: 8 &times; [[f:3/4]] = 6."
        }
      },
      {
        say: "Worked two-step example. A board is 9 feet long. Max cuts off a [[m:2 1/3]]-foot piece, then cuts the rest into 4 equal pieces. How long is each piece? Plan: first subtract to find what is left, then divide by 4.",
        figure: { type: "bar", whole: "9 ft", parts: [{ size: 7, label: "[[m:2 1/3]] ft", tone: "muted" }, { size: 5, label: "?" }, { size: 5, label: "?" }, { size: 5, label: "?" }, { size: 5, label: "?" }] },
        ask: {
          prompt: "Step 1. How much board is left after the first cut?",
          answer: { type: "num", value: "20/3", form: "fraction", label: ["feet", "ft", "foot"] },
          errors: [
            { value: "22/3", misconception: "regroup-mixed", feedback: "9 &minus; 2 = 7, but you still have to take away the [[f:1/3]]. Borrow: 9 = [[m:8 3/3]], so [[m:8 3/3]] &minus; [[m:2 1/3]] = [[m:6 2/3]]." },
            { value: "19/3", misconception: "regroup-mixed", feedback: "After borrowing, 9 = [[m:8 3/3]]. [[f:3/3]] &minus; [[f:1/3]] = [[f:2/3]], and 8 &minus; 2 = 6: [[m:6 2/3]], not [[m:6 1/3]]." },
            { value: "34/3", misconception: "wrong-operation", feedback: "Cutting a piece off makes the board shorter. Subtract: 9 &minus; [[m:2 1/3]] = [[m:6 2/3]]." }
          ],
          hint: "9 &minus; [[m:2 1/3]]. Write 9 as [[m:8 3/3]] so you can subtract the third.",
          reveal: "[[m:6 2/3]] feet. 9 = [[m:8 3/3]], and [[m:8 3/3]] &minus; [[m:2 1/3]] = [[m:6 2/3]]."
        }
      },
      {
        say: "Step 2. [[m:6 2/3]] feet cut into 4 equal pieces: [[m:6 2/3]] &divide; 4 = [[f:20/3]] &times; [[f:1/4]] = [[f:20/12]] = [[f:5/3]]. Check: 4 pieces of [[m:1 2/3]] make [[m:6 2/3]]. Yes.",
        ask: {
          prompt: "How long is each of the 4 pieces?",
          answer: { type: "num", value: "5/3", form: "fraction", label: ["feet", "ft", "foot"] },
          errors: [
            { value: "80/3", misconception: "wrong-operation", feedback: "[[m:6 2/3]] &times; 4 makes it longer. Splitting into 4 equal pieces is division: [[f:20/3]] &divide; 4." },
            { value: "9/4", misconception: "missed-step", feedback: "You divided the whole 9-foot board. The [[m:2 1/3]]-foot piece was cut off first; only [[m:6 2/3]] feet get split into 4." },
            { value: "3/5", misconception: "div-no-flip", feedback: "You flipped the [[f:20/3]]. Keep it, flip the 4 to [[f:1/4]]: [[f:20/3]] &times; [[f:1/4]] = [[f:5/3]]." },
            { value: "20/3", misconception: "missed-step", feedback: "[[m:6 2/3]] is what is left. The question asks how long each of the 4 pieces is: divide by 4." }
          ],
          hint: "[[f:20/3]] &divide; 4 = [[f:20/3]] &times; [[f:1/4]]. Simplify.",
          reveal: "[[m:1 2/3]] feet. [[f:20/3]] &times; [[f:1/4]] = [[f:20/12]] = [[f:5/3]] = [[m:1 2/3]]."
        }
      },
      {
        say: "Faded example. Max ran [[m:2 1/2]] miles Monday and [[m:1 3/4]] miles Tuesday. His goal is 6 miles for the week. How many more miles does he need? Plan: add the two runs, then subtract from 6.",
        figure: { type: "bar", whole: "6 miles", parts: [{ size: 10, label: "[[m:2 1/2]]" }, { size: 7, label: "[[m:1 3/4]]" }, { size: 7, label: "?", tone: "muted" }] },
        ask: {
          prompt: "How many more miles does Max need to run?",
          answer: { type: "num", value: "7/4", form: "fraction", label: ["miles", "mi", "mile"] },
          errors: [
            { value: "17/4", misconception: "missed-step", feedback: "[[m:4 1/4]] miles is how far he has run. The question asks how many MORE: 6 &minus; [[m:4 1/4]] = [[m:1 3/4]]." },
            { value: "7/3", misconception: "add-denominators", feedback: "You added the tops and the bottoms: [[f:1/2]] + [[f:3/4]] became [[f:4/6]], so the runs came out [[m:3 2/3]] and the gap [[m:2 1/3]]. Use fourths: [[f:2/4]] + [[f:3/4]] = [[f:5/4]], so the runs total [[m:4 1/4]] and he needs [[m:1 3/4]] more." },
            { value: "9/4", misconception: "regroup-mixed", feedback: "6 &minus; [[m:4 1/4]]: borrow to get [[m:5 4/4]] &minus; [[m:4 1/4]] = [[m:1 3/4]]." },
            { value: "3/4", misconception: "missed-step", feedback: "That is the difference between the two runs, which nobody asked for. Add them, then subtract from 6: [[m:1 3/4]]." }
          ],
          hint: "[[m:2 1/2]] + [[m:1 3/4]] = [[m:4 1/4]]. Now the gap to 6.",
          reveal: "[[m:1 3/4]] miles. [[m:2 1/2]] + [[m:1 3/4]] = [[m:4 1/4]]; 6 &minus; [[m:4 1/4]] = [[m:1 3/4]]."
        },
        why: {
          prompt: "Why subtract from 6 at the end instead of stopping at [[m:4 1/4]]?",
          choices: [
            "The question asks how many MORE miles, so we need the gap between what he ran and the goal",
            "Because 6 is the biggest number in the problem",
            "We should stop at [[m:4 1/4]]; that is what he ran"
          ],
          correct: 0,
          feedback: [
            "Right. Re-reading the question after the first step catches this every time.",
            "The size of the number is not the reason. The goal is 6, and more means the distance to the goal.",
            "That answers a different question. He ran [[m:4 1/4]]; he still needs [[m:1 3/4]]."
          ]
        }
      },
      {
        say: "Faded example with a rounding decision. A pitcher holds [[m:3 1/2]] cups of lemonade. Each glass holds [[f:2/3]] cup. How many FULL glasses can be poured?",
        figure: { type: "groups", total: "7/2", size: "2/3", unit: "cups" },
        ask: {
          prompt: "How many full glasses?",
          answer: { type: "num", value: "5", form: "number", label: ["glasses", "glass"], rounding: { mode: "down", to: 1, why: "The question says full glasses; the leftover quarter glass does not count." } },
          errors: [
            { value: "21/4", misconception: "math-vs-real-rounding", feedback: "[[m:5 1/4]] glasses is the math answer. The quarter glass is not full. 5 full glasses." },
            { value: "6", misconception: "math-vs-real-rounding", feedback: "The sixth glass would only be a quarter full. Full glasses: 5." },
            { value: "7/3", misconception: "wrong-operation", feedback: "[[m:3 1/2]] &times; [[f:2/3]] is [[f:2/3]] of the pitcher. How many glasses fit is division: [[f:7/2]] &divide; [[f:2/3]]." }
          ],
          hint: "[[f:7/2]] &divide; [[f:2/3]] = [[f:7/2]] &times; [[f:3/2]] = [[f:21/4]]. Full glasses only.",
          reveal: "5 glasses. [[f:7/2]] &times; [[f:3/2]] = [[f:21/4]] = [[m:5 1/4]]. Five full glasses and a bit left in the pitcher."
        }
      },
      {
        say: "Independent. Run the routine: question and label, plan both steps, compute, check, label.",
        ask: {
          prompt: "A 5-pound bag of apples. Max's mom uses [[m:1 3/8]] pounds for a pie and [[m:1 1/4]] pounds for applesauce. How many pounds are left in the bag?",
          answer: { type: "num", value: "19/8", form: "fraction", label: ["pounds", "lb", "lbs", "pound"] },
          errors: [
            { value: "21/8", misconception: "missed-step", feedback: "[[m:2 5/8]] pounds is what she USED. Left in the bag: 5 &minus; [[m:2 5/8]] = [[m:2 3/8]]." },
            { value: "29/8", misconception: "missed-step", feedback: "You subtracted only the pie. Both amounts come out of the bag: 5 &minus; [[m:1 3/8]] &minus; [[m:1 1/4]] = [[m:2 3/8]]." },
            { value: "8/3", misconception: "add-denominators", feedback: "[[f:3/8]] + [[f:1/4]] is not [[f:4/12]]. Eighths: [[f:3/8]] + [[f:2/8]] = [[f:5/8]]. Used [[m:2 5/8]], left [[m:2 3/8]]." },
            { value: "27/8", misconception: "regroup-mixed", feedback: "5 &minus; [[m:2 5/8]]: borrow, [[m:4 8/8]] &minus; [[m:2 5/8]] = [[m:2 3/8]]." }
          ],
          hint: "Step 1: [[m:1 3/8]] + [[m:1 1/4]], using eighths. Step 2: subtract from 5.",
          reveal: "[[m:2 3/8]] pounds. Used: [[m:1 3/8]] + [[m:1 2/8]] = [[m:2 5/8]]. Left: 5 &minus; [[m:2 5/8]] = [[m:4 8/8]] &minus; [[m:2 5/8]] = [[m:2 3/8]]."
        }
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    id: "L09",
    skill: "word-dec",
    title: "Decimal and money word problems",
    minutes: 8,
    hook: "Money problems are decimal problems in a costume. Same routine, plus a dollar sign on the answer.",
    steps: [
      {
        say: "Same four moves. Max buys 3 notebooks at $2.49 each and pays with a $10 bill. How much change does he get? Move 1: the question is change, in dollars. Move 3: plan. First the cost of the notebooks, then take that away from $10.",
        ask: {
          prompt: "What is the LAST thing we compute?",
          answer: { type: "choice", choices: ["$10 minus the cost of the notebooks", "3 &times; $2.49", "$10 plus 3 &times; $2.49"], correct: 0 },
          errors: [
            { choice: 1, misconception: "missed-step", feedback: "3 &times; $2.49 is the cost, which is step 1. Change is what is left of the $10 after paying." },
            { choice: 2, misconception: "wrong-operation", feedback: "Paying takes money away from the $10, so subtract, not add." }
          ],
          hint: "Change means what comes back to you after you pay.",
          reveal: "$10 minus the cost. First find the cost (3 &times; $2.49), then subtract it from $10."
        }
      },
      {
        say: "Step 1: the cost. 3 &times; 2.49. Multiply like whole numbers (3 &times; 249 = 747), then count decimal places: 2.49 has two, so the answer has two.",
        figure: { type: "columns", numbers: ["2.49", "3"], op: "×" },
        ask: {
          prompt: "What do 3 notebooks cost?",
          answer: { type: "num", value: "7.47", form: "money", unit: "$" },
          errors: [
            { value: "74.7", misconception: "decimal-mult-places", feedback: "Two decimal places in 2.49, so two in the answer: $7.47. Check: 3 notebooks at about $2.50 should be about $7.50." },
            { value: "0.747", misconception: "decimal-mult-places", feedback: "Only 2.49 has decimal places (two). 747 with two places is 7.47." },
            { value: "6.47", misconception: "arithmetic-slip", feedback: "3 &times; 249 = 747, not 647. Check: 3 &times; 2.50 = 7.50, so a bit less: $7.47." }
          ],
          hint: "3 &times; 249 = 747. Two decimal places.",
          reveal: "$7.47. 3 &times; 2.49 = 7.47. Reasonable: about 3 &times; $2.50."
        }
      },
      {
        say: "Step 2: the change. 10.00 &minus; 7.47. Line up the decimal points, pad $10 as 10.00, subtract.",
        figure: { type: "columns", numbers: ["10.00", "7.47"], op: "−" },
        ask: {
          prompt: "How much change does Max get?",
          answer: { type: "num", value: "2.53", form: "money", unit: "$" },
          errors: [
            { value: "7.47", misconception: "missed-step", feedback: "$7.47 is the cost. The question asks for the change: 10.00 &minus; 7.47 = $2.53." },
            { value: "17.47", misconception: "wrong-operation", feedback: "Change is what is left after paying, so subtract: $2.53." },
            { value: "2.63", misconception: "decimal-align", feedback: "Line up the points and borrow carefully: 10.00 &minus; 7.47 = 2.53. Check: 7.47 + 2.53 = 10.00." },
            { value: "3.53", misconception: "decimal-align", feedback: "10 &minus; 7.47: 10 &minus; 7 = 3, then minus 0.47 more is 2.53. Check by adding: 7.47 + 2.53 = 10.00." }
          ],
          hint: "10.00 &minus; 7.47. Count up: 7.47 to 8 is 0.53, then 8 to 10 is 2.",
          reveal: "$2.53. 10.00 &minus; 7.47 = 2.53. Check: 7.47 + 2.53 = 10.00."
        },
        why: {
          prompt: "Why multiply first and then subtract?",
          choices: [
            "Change is what is left of the $10 after paying for all three notebooks, so we need the total cost before we can subtract it",
            "Because multiplication always comes before subtraction",
            "We could just subtract $2.49 from $10 and be done"
          ],
          correct: 0,
          feedback: [
            "Right. The plan comes from the story: total first, then change.",
            "Order of operations is about expressions. Here the story tells you the order: you cannot find the change until you know the cost.",
            "That would be the change for ONE notebook. He bought three."
          ]
        }
      },
      {
        say: "Unit price: cost per one item. A 6-pack of water costs $4.74. Cost per bottle is 4.74 &divide; 6. The decimal point in the answer goes straight up from the one in 4.74.",
        ask: {
          prompt: "What is the cost per bottle?",
          answer: { type: "num", value: "0.79", form: "money", unit: "$" },
          errors: [
            { value: "28.44", misconception: "wrong-operation", feedback: "4.74 &times; 6 is the cost of 36 bottles. Per bottle means divide: 4.74 &divide; 6 = $0.79." },
            { value: "7.9", misconception: "decimal-div-shift", feedback: "The point goes straight up: 4.74 &divide; 6 = 0.79. Check: one bottle cannot cost more than the whole pack." },
            { value: "0.079", misconception: "decimal-div-shift", feedback: "4.74 &divide; 6 = 0.79, not 0.079. Check: 6 &times; 0.79 = 4.74." }
          ],
          hint: "6 into 4.74. 6 &times; 0.80 = 4.80, so a little less than 80 cents.",
          reveal: "$0.79. 4.74 &divide; 6 = 0.79. Check: 6 &times; 0.79 = 4.74."
        }
      },
      {
        say: "Dividing by a decimal. Gas costs $3.45 per gallon. How many gallons does $27.60 buy? 27.60 &divide; 3.45. Move the point in the divisor two places to make it 345, and move it two places in the dividend too: 2760 &divide; 345.",
        ask: {
          prompt: "How many gallons does $27.60 buy?",
          answer: { type: "num", value: "8", form: "number", label: ["gallons", "gal", "gallon"] },
          errors: [
            { value: "0.8", misconception: "decimal-div-shift", feedback: "You moved the point in 3.45 but not in 27.60. Move both: 2760 &divide; 345 = 8." },
            { value: "80", misconception: "decimal-div-shift", feedback: "Both numbers move the same number of places. 2760 &divide; 345 = 8. Check: 8 &times; 3.45 = 27.60." },
            { value: "95.22", misconception: "wrong-operation", feedback: "27.60 &times; 3.45 is not a number of gallons. How many $3.45s fit in $27.60 is division: 8." }
          ],
          hint: "How many 3.45s fit in 27.60? Try 8 &times; 3.45.",
          reveal: "8 gallons. 2760 &divide; 345 = 8. Check: 8 &times; 3.45 = 27.60."
        }
      },
      {
        say: "Faded example, two steps and a rounding decision. Max earns $8.50 an hour. He works 3.5 hours Saturday and 2.25 hours Sunday. How much does he earn in total? Plan: add the hours, multiply by the rate, round to the cent.",
        ask: {
          prompt: "How much does Max earn for the weekend?",
          answer: { type: "num", value: "48.88", form: "money", unit: "$", rounding: { mode: "nearest", to: 0.01, why: "5.75 hours &times; $8.50 = $48.875. Pay is to the cent, so round to the nearest cent." } },
          errors: [
            { value: "48.875", misconception: "money-cents", feedback: "There is no half cent. Round to the nearest cent: $48.88." },
            { value: "48.87", misconception: "rounding-direction", feedback: "48.875: the thousandths digit is 5, so round the 7 up to 8: $48.88." },
            { value: "29.75", misconception: "missed-step", feedback: "$29.75 is Saturday only. Add Sunday's 2.25 hours: 5.75 hours in total, &times; 8.50 = $48.88." },
            { value: "488.75", misconception: "decimal-mult-places", feedback: "5.75 &times; 8.5: 575 &times; 85 = 48875, with 2 + 1 = 3 decimal places: 48.875. Check the size: about 6 hours at about $8 is about $48, not $488." },
            { value: "10.75", misconception: "missed-step", feedback: "10.75 is not even the hours (3.5 + 2.25 = 5.75). Multiply the hours by $8.50." }
          ],
          hint: "3.5 + 2.25 = 5.75 hours. 5.75 &times; 8.50 = ? Then the cent rule.",
          reveal: "$48.88. 5.75 hours &times; $8.50 = $48.875, which rounds to $48.88."
        }
      },
      {
        say: "Faded example: comparing unit prices. A bakery sells 24 bagels for $14.40. A grocery store sells 6 bagels for $3.90. Which is cheaper per bagel, and by how much? Plan: two unit prices, then the difference.",
        ask: {
          prompt: "How much cheaper per bagel is the better deal?",
          answer: { type: "num", value: "0.05", form: "money", unit: "$" },
          errors: [
            { value: "0.60", misconception: "missed-step", feedback: "$0.60 is the bakery's price per bagel. The question asks how much cheaper: 0.65 &minus; 0.60 = $0.05." },
            { value: "0.65", misconception: "missed-step", feedback: "$0.65 is the grocery price per bagel. Subtract the bakery's $0.60: $0.05 cheaper." },
            { value: "10.50", misconception: "wrong-operation", feedback: "14.40 &minus; 3.90 compares a bag of 24 to a bag of 6. Per bagel means divide first: 0.60 vs 0.65, so $0.05." }
          ],
          hint: "14.40 &divide; 24 and 3.90 &divide; 6. Then subtract.",
          reveal: "$0.05. Bakery: 14.40 &divide; 24 = $0.60 per bagel. Grocery: 3.90 &divide; 6 = $0.65. The bakery is 5 cents cheaper per bagel."
        }
      },
      {
        say: "Independent. Question and label first, then the plan.",
        ask: {
          prompt: "Max has $25. He buys a book for $12.95 and two pens at $1.75 each. How much money does he have left?",
          answer: { type: "num", value: "8.55", form: "money", unit: "$" },
          errors: [
            { value: "16.45", misconception: "missed-step", feedback: "$16.45 is what he spent. Left: 25 &minus; 16.45 = $8.55." },
            { value: "10.30", misconception: "missed-step", feedback: "You counted one pen. Two pens are $3.50. Spent 12.95 + 3.50 = 16.45, left $8.55." },
            { value: "41.45", misconception: "wrong-operation", feedback: "Spending takes money away. 25 &minus; 16.45 = $8.55." },
            { value: "9.55", misconception: "decimal-align", feedback: "25.00 &minus; 16.45 = 8.55. Check: 16.45 + 8.55 = 25.00." }
          ],
          hint: "Spent: 12.95 + 2 &times; 1.75. Then 25 minus that.",
          reveal: "$8.55. Spent 12.95 + 3.50 = 16.45. Left: 25.00 &minus; 16.45 = 8.55."
        }
      }
    ]
  }
];

/* ------------------------------------------------------------------ */
/* Diagnostic (easy -> hard)                                           */
/* ------------------------------------------------------------------ */

window.FDP_DIAG = [
  {
    id: "d01",
    skill: "place-value",
    kind: "short",
    level: 1,
    prompt: "Tell which number is greatest: 0.3, 0.45, or 0.405.",
    answer: { type: "choice", choices: ["0.3", "0.45", "0.405"], correct: 1 },
    errors: [
      { choice: 0, misconception: "shorter-larger", feedback: "0.3 is 0.300. It has 3 tenths; 0.45 has 4 tenths. Shorter does not mean bigger." },
      { choice: 2, misconception: "longer-larger", feedback: "0.405 has the most digits, but 0.450 &gt; 0.405. Compare hundredths: 5 vs 0." }
    ],
    hint: "Pad all three to three places: 0.300, 0.450, 0.405. Compare left to right.",
    steps: [
      {
        say: "Give every number the same number of places. Trailing zeros change nothing.",
        figure: { type: "placevalue", numbers: ["0.300", "0.450", "0.405"] },
        ask: {
          prompt: "Which place is the first one where the numbers differ?",
          answer: { type: "choice", choices: ["tenths", "hundredths", "thousandths"], correct: 0 },
          errors: [{ choice: 1, misconception: "longer-larger", feedback: "Look at tenths first: 3, 4, 4. Already different." }],
          hint: "Read the first digit after the point in each number.",
          reveal: "Tenths. 0.3 has 3 tenths; the other two have 4. So 0.3 is out."
        }
      },
      {
        say: "0.45 and 0.405 tie in tenths. Move right one place.",
        ask: {
          prompt: "Tell which number is greater. 0.45 or 0.405?",
          answer: { type: "choice", choices: ["0.45", "0.405", "equal"], correct: 0 },
          errors: [{ choice: 1, misconception: "longer-larger", feedback: "0.450 vs 0.405: hundredths 5 beats 0." }],
          hint: "0.450 vs 0.405. Compare the hundredths digit.",
          reveal: "0.45. In hundredths, 5 &gt; 0. 0.45 is the greatest of the three."
        }
      }
    ]
  },
  {
    id: "d02",
    skill: "gcf-lcm",
    kind: "short",
    level: 1,
    prompt: "Find the least common multiple (LCM) of 8 and 12.",
    answer: { type: "num", value: "24", form: "number" },
    errors: [
      { value: "4", misconception: "gcf-lcm-swap", feedback: "4 is the greatest common FACTOR. A multiple is bigger than the numbers, not smaller. Multiples of 8: 8, 16, 24. Multiples of 12: 12, 24. LCM = 24." },
      { value: "96", misconception: "gcf-lcm-not-extreme", feedback: "8 &times; 12 = 96 is a common multiple, but not the least. 24 is also a multiple of both and it is smaller." },
      { value: "48", misconception: "gcf-lcm-not-extreme", feedback: "48 works, but 24 is a common multiple too and it is smaller. Least means the smallest one." }
    ],
    hint: "List multiples of 12 (12, 24, 36&hellip;) and stop at the first one that 8 divides into.",
    steps: [
      {
        say: "Multiples of 8: 8, 16, 24, 32, 40. Multiples of 12: 12, 24, 36.",
        ask: {
          prompt: "What is the first number that appears in both lists?",
          answer: { type: "num", value: "24", form: "number" },
          errors: [{ value: "96", misconception: "gcf-lcm-not-extreme", feedback: "96 is in both lists eventually, but 24 comes first." }],
          hint: "Scan the multiples of 12 and check each against the 8s.",
          reveal: "24. It is 8 &times; 3 and 12 &times; 2."
        }
      },
      {
        say: "Check you have the right idea: the GCF of 8 and 12 is a different number.",
        ask: {
          prompt: "What is the greatest common factor (GCF) of 8 and 12?",
          answer: { type: "num", value: "4", form: "number" },
          errors: [
            { value: "24", misconception: "gcf-lcm-swap", feedback: "24 is the LCM. A factor divides INTO the numbers: 4 divides into both 8 and 12." },
            { value: "2", misconception: "gcf-lcm-not-extreme", feedback: "2 is a common factor, but 4 also divides both, and it is greater." }
          ],
          hint: "Factors of 8: 1, 2, 4, 8. Which of those also divides 12?",
          reveal: "4. GCF simplifies fractions ([[f:8/12]] = [[f:2/3]]); LCM gives common denominators."
        }
      }
    ]
  },
  {
    id: "d03",
    skill: "pct-dec",
    kind: "short",
    level: 2,
    prompt: "Write the percent as a decimal. [[f:3/5]]%",
    answer: { type: "num", value: "0.006", form: "decimal" },
    errors: [
      { value: "0.6", misconception: "pct-small-as-whole", feedback: "[[f:3/5]] = 0.6, but the % still means &divide;100. 0.6% = 0.006." },
      { value: "0.06", misconception: "pct-shift-one-place", feedback: "One hop. 0.6 &rarr; 0.06 &rarr; 0.006. Per hundred is two hops." },
      { value: "0.0035", misconception: "frac-part-as-decimal", feedback: "[[f:3/5]] is not .35. Divide: 3 &divide; 5 = 0.6, so 0.6% = 0.006." },
      { value: "60", misconception: "pct-shift-wrong-way", feedback: "[[f:3/5]]% is less than 1%, so the decimal must be tiny. Hop left." },
      { value: "0.0006", misconception: "pct-shift-places", feedback: "Three hops. Percent is exactly two: 0.6 &rarr; 0.006." }
    ],
    hint: "[[f:3/5]] = 0.6, so this is 0.6%. Then two hops left.",
    steps: [
      {
        say: "Fraction part to a decimal first.",
        ask: {
          prompt: "Write [[f:3/5]]% as a percent using a decimal.",
          answer: { type: "num", value: "0.6", form: "percent" },
          errors: [{ value: "0.35", misconception: "frac-part-as-decimal", feedback: "3 &divide; 5 = 0.6, so 0.6%." }],
          hint: "3 &divide; 5.",
          reveal: "0.6%. [[f:3/5]] = 0.6."
        }
      },
      {
        say: "0.6% is less than one square on the hundred grid. Now &divide;100: two hops left.",
        figure: { type: "grid", shaded: 0.6, caption: "0.6% of 100 squares" },
        ask: {
          prompt: "Write the percent as a decimal. 0.6%",
          answer: { type: "num", value: "0.006", form: "decimal" },
          errors: [{ value: "0.06", misconception: "pct-shift-one-place", feedback: "Two hops: 0.6 &rarr; 0.06 &rarr; 0.006." }],
          hint: "Two hops left from 0.6.",
          reveal: "0.006. The teacher's chain: [[f:3/5]]% = 0.6% = 0.006 = [[f:6/1000]] = [[f:3/500]]."
        }
      }
    ]
  },
  {
    id: "d04",
    skill: "pct-frac",
    kind: "short",
    level: 2,
    prompt: "Write the fraction or mixed number as a percent. [[m:7 7/8]]",
    answer: { type: "num", value: "787.5", form: "percent" },
    errors: [
      { value: "78.75", misconception: "pct-shift-one-place", feedback: "One hop. 7.875 &times; 100 = 787.5. Seven wholes alone are 700%." },
      { value: "7.875", misconception: "pct-small-as-whole", feedback: "7.875 is the decimal. Two hops right: 787.5%." },
      { value: "778", misconception: "frac-part-as-decimal", feedback: "[[f:7/8]] is not .78. Divide: 7 &divide; 8 = 0.875. So 7.875 = 787.5%." },
      { value: "7875", misconception: "pct-shift-places", feedback: "Three hops. Decimal to percent is exactly two: 787.5%." },
      { value: "87.5", misconception: "missed-step", feedback: "87.5% is just the [[f:7/8]]. The 7 wholes are 700% more: 787.5%." }
    ],
    hint: "Keep the 7, turn [[f:7/8]] into a decimal, then two hops right.",
    steps: [
      {
        say: "Mixed number to decimal: the whole number stays, the fraction gets divided.",
        figure: { type: "fdp", f: "[[m:7 7/8]]", d: "?", p: "?", focus: "d" },
        ask: {
          prompt: "Write the mixed number as a decimal. [[m:7 7/8]]",
          answer: { type: "num", value: "7.875", form: "decimal" },
          errors: [{ value: "7.78", misconception: "frac-part-as-decimal", feedback: "[[f:7/8]] is not .78. Divide: 7 &divide; 8 = 0.875, so 7.875." }],
          hint: "[[f:7/8]] = 0.875.",
          reveal: "7.875."
        }
      },
      {
        say: "Decimal to percent: two hops right.",
        figure: { type: "shift", number: "7.875", places: 2, note: "× 100" },
        ask: {
          prompt: "Write the decimal as a percent. 7.875",
          answer: { type: "num", value: "787.5", form: "percent" },
          errors: [{ value: "78.75", misconception: "pct-shift-one-place", feedback: "Two hops: 7.875 &rarr; 78.75 &rarr; 787.5." }],
          hint: "Almost 8 wholes, so almost 800%.",
          reveal: "787.5%. Chain: [[m:7 7/8]] = 7.875 = 787.5%."
        }
      }
    ]
  },
  {
    id: "d05",
    skill: "frac-addsub",
    kind: "short",
    level: 2,
    prompt: "Subtract. Write the answer in simplest form. [[m:5 1/4]] &minus; [[m:2 3/4]]",
    answer: { type: "num", value: "5/2", form: "fraction" },
    errors: [
      { value: "7/2", misconception: "regroup-mixed", feedback: "You did [[f:3/4]] &minus; [[f:1/4]] because [[f:1/4]] &minus; [[f:3/4]] does not work. Instead, borrow: [[m:5 1/4]] = [[m:4 5/4]]. Then [[f:5/4]] &minus; [[f:3/4]] = [[f:2/4]], and 4 &minus; 2 = 2: [[m:2 1/2]]." },
      { value: "3", misconception: "regroup-mixed", feedback: "5 &minus; 2 = 3, but the fractions have not been handled. [[f:1/4]] &minus; [[f:3/4]] needs a borrow: [[m:4 5/4]] &minus; [[m:2 3/4]] = [[m:2 1/2]]." },
      { value: "13/4", misconception: "regroup-mixed", feedback: "You kept the [[f:1/4]] and ignored the [[f:3/4]]. Borrow one whole: [[m:4 5/4]] &minus; [[m:2 3/4]] = [[m:2 2/4]] = [[m:2 1/2]]." },
      { value: "1/2", misconception: "missed-step", feedback: "[[f:1/2]] is the fraction part. After borrowing, the wholes are 4 &minus; 2 = 2: [[m:2 1/2]]." }
    ],
    hint: "[[f:1/4]] is smaller than [[f:3/4]]. Borrow a whole: [[m:5 1/4]] = [[m:4 5/4]].",
    steps: [
      {
        say: "You cannot take [[f:3/4]] from [[f:1/4]]. Borrow 1 from the 5 and write it as [[f:4/4]].",
        figure: { type: "fracbar", rows: [{ parts: 4, shaded: 1, label: "[[m:5 1/4]] = [[m:4 5/4]]" }, { parts: 4, shaded: 3, label: "[[m:2 3/4]]" }] },
        ask: {
          prompt: "[[m:5 1/4]] = 4 and how many fourths?",
          answer: { type: "num", value: "5", form: "number" },
          errors: [{ value: "1", misconception: "regroup-mixed", feedback: "The borrowed whole is [[f:4/4]]. Add it to [[f:1/4]]: [[f:5/4]]." }],
          hint: "[[f:4/4]] + [[f:1/4]].",
          reveal: "5. [[m:5 1/4]] = [[m:4 5/4]]."
        }
      },
      {
        say: "Now subtract the fractions and the wholes separately.",
        ask: {
          prompt: "[[m:4 5/4]] &minus; [[m:2 3/4]] = ? (simplest form)",
          answer: { type: "num", value: "5/2", form: "fraction" },
          errors: [{ value: "7/2", misconception: "regroup-mixed", feedback: "[[f:5/4]] &minus; [[f:3/4]] = [[f:2/4]], and 4 &minus; 2 = 2. So [[m:2 2/4]] = [[m:2 1/2]]." }],
          hint: "[[f:5/4]] &minus; [[f:3/4]] = [[f:2/4]]. 4 &minus; 2 = 2.",
          reveal: "[[m:2 1/2]]. Check with improper fractions: [[f:21/4]] &minus; [[f:11/4]] = [[f:10/4]] = [[f:5/2]]."
        }
      }
    ]
  },
  {
    id: "d06",
    skill: "repeating",
    kind: "short",
    level: 2,
    prompt: "Write the fraction as a decimal. Use the repeat bar. [[f:5/6]]",
    answer: { type: "num", value: "0.8(3)", form: "decimal" },
    errors: [
      { value: "0.(83)", misconception: "bar-placement", feedback: "[[r:0.(83)]] means 0.838383&hellip;. But 5 &divide; 6 = 0.83333&hellip;. Only the 3 repeats: [[r:0.8(3)]]." },
      { value: "0.83", misconception: "repeating-truncate", feedback: "The threes never stop. Bar over the 3." },
      { value: "0.8", misconception: "repeating-truncate", feedback: "0.8 is [[f:4/5]]. [[f:5/6]] is 0.8333&hellip;" },
      { value: "6/5", misconception: "bar-as-point", feedback: "6 &divide; 5 is upside down. 5 &divide; 6." }
    ],
    hint: "6 into 50 is 8 r 2. 6 into 20 is 3 r 2. 6 into 20 is 3 r 2 again&hellip;",
    steps: [
      {
        say: "Divide and watch the remainders.",
        figure: { type: "longdiv", dividend: 5, divisor: 6, digits: 4 },
        ask: {
          prompt: "6 into 50 is 8, remainder 2. 6 into 20 is 3, remainder ?",
          answer: { type: "num", value: "2", form: "number" },
          errors: [{ value: "0", misconception: "repeating-truncate", feedback: "6 &times; 3 = 18, and 20 &minus; 18 = 2. Not zero, so it keeps going." }],
          hint: "20 &minus; 18.",
          reveal: "2. The remainder 2 came back, so from here the digit 3 repeats."
        }
      },
      {
        say: "The 8 happened once; the 3 repeats.",
        ask: {
          prompt: "Write the fraction as a decimal, with the bar in the right place. [[f:5/6]]",
          answer: { type: "num", value: "0.8(3)", form: "decimal" },
          errors: [{ value: "0.(83)", misconception: "bar-placement", feedback: "The bar goes only over the 3." }],
          hint: "0.8333&hellip;",
          reveal: "[[r:0.8(3)]]. A repeating decimal, one of the three kinds."
        }
      },
      {
        say: "Name the kind.",
        ask: {
          prompt: "What kind of decimal is [[f:5/6]]?",
          answer: { type: "choice", choices: ["repeating", "terminating", "non-terminating, non-repeating"], correct: 0 },
          errors: [
            { choice: 1, misconception: "decimal-kind", feedback: "It never reaches remainder 0, so it does not stop." },
            { choice: 2, misconception: "decimal-kind", feedback: "A fraction always terminates or repeats. The 3 repeats." }
          ],
          hint: "Does a block of digits come back forever?",
          reveal: "Repeating. The 3 goes on forever."
        }
      }
    ]
  },
  {
    id: "d07",
    skill: "frac-dec",
    kind: "short",
    level: 2,
    prompt: "Write 0.0725 as a fraction in simplest form.",
    answer: { type: "num", value: "29/400", form: "fraction" },
    errors: [
      { value: "29/40", misconception: "denominator-places", feedback: "0.0725 has four decimal places: [[f:725/10000]], not over 1000. [[f:29/40]] = 0.725, ten times too big." },
      { value: "29/4000", misconception: "denominator-places", feedback: "Four places, four zeros: [[f:725/10000]] = [[f:29/400]]. [[f:29/4000]] is ten times too small." },
      { value: "29/4", misconception: "denominator-places", feedback: "[[f:29/4]] is more than 7. 0.0725 is tiny: [[f:725/10000]] = [[f:29/400]]." }
    ],
    hint: "Four decimal places: [[f:725/10000]]. Both end in 5 or 0, so divide by 25.",
    steps: [
      {
        say: "Count the decimal places. The last digit, 5, is in the ten-thousandths place.",
        figure: { type: "placevalue", numbers: ["0.0725"] },
        ask: {
          prompt: "0.0725 = [[f:725/?]]",
          answer: { type: "num", value: "10000", form: "number" },
          errors: [{ value: "1000", misconception: "denominator-places", feedback: "Four decimal places means ten-thousandths: 10,000." }],
          hint: "Four places. How many zeros?",
          reveal: "10,000. 0.0725 = [[f:725/10000]]."
        }
      },
      {
        say: "Simplify. 725 and 10000 both end in 5 or 0. Try 25: 725 &divide; 25 = 29, 10000 &divide; 25 = 400.",
        ask: {
          prompt: "Write [[f:725/10000]] in simplest form.",
          answer: { type: "num", value: "29/400", form: "fraction" },
          errors: [{ value: "29/40", misconception: "denominator-places", feedback: "10000 &divide; 25 = 400, not 40." }],
          hint: "Divide top and bottom by 25 (or by 5 twice).",
          reveal: "[[f:29/400]]. Same pattern as the teacher's [[f:825/10000]] = [[f:33/400]]. Check: 29 &divide; 400 = 0.0725."
        }
      }
    ]
  },
  {
    id: "d08",
    skill: "dec-ops",
    kind: "short",
    level: 2,
    prompt: "Divide. 3.6 &divide; 0.08",
    answer: { type: "num", value: "45", form: "number" },
    errors: [
      { value: "4.5", misconception: "decimal-div-shift", feedback: "That is 36 &divide; 8. You moved the point two places in 0.08 (to 8) but only one place in 3.6 (to 36). Both points must move the same number of places: 3.6 &rarr; 360, and 360 &divide; 8 = 45." },
      { value: "0.45", misconception: "decimal-div-shift", feedback: "That is 3.6 &divide; 8. You moved the point in 0.08 (to 8) but left 3.6 alone. Move both two places: 360 &divide; 8 = 45. Check: 45 &times; 0.08 = 3.6." },
      { value: "450", misconception: "decimal-div-shift", feedback: "That is 3600 &divide; 8. You moved the point three places in 3.6 but only two in 0.08. Two places each: 3.6 &rarr; 360 and 0.08 &rarr; 8. 360 &divide; 8 = 45." },
      { value: "0.288", misconception: "wrong-operation", feedback: "3.6 &times; 0.08 = 0.288 is a multiplication. The problem says divide: 45." }
    ],
    hint: "Make the divisor a whole number: 0.08 &rarr; 8 is two hops. Do the same two hops to 3.6.",
    steps: [
      {
        say: "Move the point in the divisor until it is a whole number, and move the point in the dividend the same number of places.",
        figure: { type: "shift", number: "0.08", places: 2, note: "× 100, so 3.6 × 100 too" },
        ask: {
          prompt: "3.6 &divide; 0.08 becomes ? &divide; 8",
          answer: { type: "num", value: "360", form: "number" },
          errors: [{ value: "36", misconception: "decimal-div-shift", feedback: "0.08 needed two hops to become 8, so 3.6 gets two hops too: 360." }],
          hint: "Two hops right from 3.6, filling with a zero.",
          reveal: "360. Both numbers were multiplied by 100, which does not change the quotient."
        }
      },
      {
        say: "Now a whole-number division.",
        ask: {
          prompt: "360 &divide; 8 = ?",
          answer: { type: "num", value: "45", form: "number" },
          errors: [{ value: "4.5", misconception: "decimal-div-shift", feedback: "360 &divide; 8 = 45, no decimal. Check: 45 &times; 0.08 = 3.60." }],
          hint: "8 &times; 40 = 320, 8 &times; 5 = 40.",
          reveal: "45. Check: 45 &times; 0.08 = 3.6. A number divided by something less than 1 gets bigger."
        }
      }
    ]
  },
  {
    id: "d09",
    skill: "compare-mixed",
    kind: "short",
    level: 2,
    prompt: "Order the numbers from least to greatest.",
    answer: { type: "order", items: ["0.6", "[[f:5/8]]", "62%", "[[r:0.(6)]]"], correct: [0, 2, 1, 3] },
    errors: [
      { order: [0, 1, 2, 3], misconception: "longer-larger", feedback: "[[f:5/8]] = 0.625 and 62% = 0.62. 0.620 &lt; 0.625." },
      { order: [0, 2, 3, 1], misconception: "repeating-truncate", feedback: "[[r:0.(6)]] = 0.666&hellip; is more than 0.625." },
      { order: [3, 0, 2, 1], misconception: "repeating-truncate", feedback: "[[r:0.(6)]] is 0.6 and then more sixes, so it is bigger than 0.6, not smaller." }
    ],
    hint: "Change each one to a decimal first, then line up the places and compare from the left.",
    steps: [
      {
        say: "Change each one to a decimal.",
        ask: {
          prompt: "Write [[f:5/8]] as a decimal.",
          answer: { type: "num", value: "0.625", form: "decimal" },
          errors: [{ value: "5.8", misconception: "bar-as-point", feedback: "5 &divide; 8 = 0.625." }],
          hint: "5 &divide; 8.",
          reveal: "0.625."
        }
      },
      {
        say: "And the percent.",
        ask: {
          prompt: "Write the percent as a decimal. 62%",
          answer: { type: "num", value: "0.62", form: "decimal" },
          errors: [{ value: "6.2", misconception: "pct-shift-one-place", feedback: "Two hops: 0.62." }],
          hint: "Two hops left.",
          reveal: "0.62."
        }
      },
      {
        say: "Now line up 0.600, 0.625, 0.620, 0.666&hellip; and compare place by place.",
        figure: { type: "placevalue", numbers: ["0.600", "0.625", "0.620", "0.666"] },
        ask: {
          prompt: "Order the numbers from least to greatest.",
          answer: { type: "order", items: ["0.6", "[[f:5/8]]", "62%", "[[r:0.(6)]]"], correct: [0, 2, 1, 3] },
          errors: [{ order: [0, 1, 2, 3], misconception: "longer-larger", feedback: "Hundredths: 0.620 and 0.625 both have 2; thousandths 0 vs 5 decide it." }],
          hint: "Tenths all 6. Hundredths: 0, 2, 2, 6.",
          reveal: "0.6, 62%, [[f:5/8]], [[r:0.(6)]]. Decimals: 0.600 &lt; 0.620 &lt; 0.625 &lt; 0.666&hellip;"
        }
      }
    ]
  },
  {
    id: "d10",
    skill: "word-dec",
    kind: "word",
    level: 2,
    prompt: "Max buys 4 slices of pizza at $3.25 each and a drink for $2.50. He pays with a $20 bill. How much change does he get?",
    answer: { type: "num", value: "4.50", form: "money", unit: "$" },
    errors: [
      { value: "15.50", misconception: "missed-step", feedback: "$15.50 is the total he spent. The question asks for the change: 20 &minus; 15.50 = $4.50." },
      { value: "7", misconception: "missed-step", feedback: "You forgot the drink. Pizza $13 + drink $2.50 = $15.50, so change is $4.50." },
      { value: "13", misconception: "missed-step", feedback: "$13 is just the pizza. Add the drink, then subtract from $20: $4.50." },
      { value: "35.50", misconception: "wrong-operation", feedback: "Paying takes money off the $20. 20 &minus; 15.50 = $4.50." }
    ],
    hint: "Plan: pizza cost, plus drink, then $20 minus that total.",
    steps: [
      {
        say: "The question asks for change, in dollars. Plan: total cost first.",
        figure: { type: "columns", numbers: ["3.25", "4"], op: "×" },
        ask: {
          prompt: "What do 4 slices cost?",
          answer: { type: "num", value: "13", form: "money", unit: "$" },
          errors: [{ value: "130", misconception: "decimal-mult-places", feedback: "4 &times; 325 = 1300, with two decimal places: 13.00." }],
          hint: "4 &times; 3.25. Four quarters make a dollar.",
          reveal: "$13.00. 4 &times; 3.25 = 13."
        }
      },
      {
        say: "Add the drink.",
        ask: {
          prompt: "What is the total cost with the drink?",
          answer: { type: "num", value: "15.50", form: "money", unit: "$" },
          errors: [{ value: "13.25", misconception: "decimal-align", feedback: "13.00 + 2.50 = 15.50. Line up the points." }],
          hint: "13.00 + 2.50.",
          reveal: "$15.50."
        }
      },
      {
        say: "Change: what is left of the $20.",
        figure: { type: "columns", numbers: ["20.00", "15.50"], op: "−" },
        ask: {
          prompt: "How much change does Max get?",
          answer: { type: "num", value: "4.50", form: "money", unit: "$" },
          errors: [{ value: "15.50", misconception: "missed-step", feedback: "That is the cost. Change is 20.00 &minus; 15.50 = $4.50." }],
          hint: "20.00 &minus; 15.50.",
          reveal: "$4.50. Check: 15.50 + 4.50 = 20.00. Label it with the dollar sign."
        }
      }
    ]
  },
  {
    id: "d11",
    skill: "word-frac",
    kind: "word",
    level: 2,
    prompt: "A pitcher holds [[m:4 1/2]] cups of iced tea. Each glass holds [[f:3/4]] cup. How many glasses can be filled?",
    answer: { type: "num", value: "6", form: "number", label: ["glasses", "glass"] },
    errors: [
      { value: "27/8", misconception: "wrong-operation", feedback: "[[m:4 1/2]] &times; [[f:3/4]] = [[m:3 3/8]] is [[f:3/4]] OF the pitcher. How many glasses fit is division: [[m:4 1/2]] &divide; [[f:3/4]] = 6." },
      { value: "1/6", misconception: "div-no-flip", feedback: "You flipped the [[f:9/2]]. Keep the first, flip the second: [[f:9/2]] &times; [[f:4/3]] = 6." },
      { value: "15/4", misconception: "wrong-operation", feedback: "[[m:4 1/2]] &minus; [[f:3/4]] is what is left after one glass. We want how many glasses in total: divide." }
    ],
    hint: "How many [[f:3/4]]s fit in [[m:4 1/2]]? Keep, change, flip.",
    figure: { type: "groups", total: "9/2", size: "3/4", unit: "cups" },
    steps: [
      {
        say: "Question and label: how many glasses. Operation: how many [[f:3/4]]-cup groups fit in [[m:4 1/2]] cups is division.",
        ask: {
          prompt: "Which operation?",
          answer: { type: "choice", choices: ["[[m:4 1/2]] &divide; [[f:3/4]]", "[[m:4 1/2]] &times; [[f:3/4]]", "[[m:4 1/2]] + [[f:3/4]]"], correct: 0 },
          errors: [{ choice: 1, misconception: "wrong-operation", feedback: "Multiplying gives [[f:3/4]] of the tea, in cups. Counting glasses that fit is division." }],
          hint: "Fitting groups into a total.",
          reveal: "[[m:4 1/2]] &divide; [[f:3/4]]. Each glass is less than a cup, so expect more than [[m:4 1/2]] glasses."
        }
      },
      {
        say: "Compute: [[f:9/2]] &divide; [[f:3/4]] = [[f:9/2]] &times; [[f:4/3]].",
        ask: {
          prompt: "How many glasses can be filled? Include the label.",
          answer: { type: "num", value: "6", form: "number", label: ["glasses", "glass"] },
          errors: [{ value: "1/6", misconception: "div-no-flip", feedback: "Flip the [[f:3/4]], not the [[f:9/2]]: [[f:9/2]] &times; [[f:4/3]] = [[f:36/6]] = 6." }],
          hint: "[[f:9/2]] &times; [[f:4/3]] = [[f:36/6]].",
          reveal: "6 glasses. Check: 6 &times; [[f:3/4]] = [[f:18/4]] = [[m:4 1/2]] cups."
        }
      }
    ]
  },
  {
    id: "d12",
    skill: "rounding",
    kind: "word",
    level: 2,
    prompt: "215 students are going on a field trip. Each bus holds 42 students. How many buses are needed?",
    answer: { type: "num", value: "6", form: "number", label: ["buses", "bus"], rounding: { mode: "up", to: 1, why: "Everyone needs a seat. 5 buses hold 210, so a sixth bus is needed even though it is mostly empty." } },
    errors: [
      { value: "5", misconception: "math-vs-real-rounding", feedback: "5 buses hold 210 students. 5 students would be left behind. When you need enough, round up: 6 buses." },
      { value: "215/42", misconception: "math-vs-real-rounding", feedback: "5.12 buses is the math answer, but you cannot order part of a bus. Round up: 6." },
      { value: "9030", misconception: "wrong-operation", feedback: "215 &times; 42 is not a number of buses. How many groups of 42 fit in 215 is division: 215 &divide; 42 &asymp; 5.1, so 6 buses." }
    ],
    hint: "215 &divide; 42 is a little more than 5. Does 5 buses fit everyone?",
    figure: { type: "roundline", value: "5.12", step: 1, mode: "up", caption: "5 buses: 210 seats. Not enough." },
    steps: [
      {
        say: "Operation: how many groups of 42 fit in 215. Division.",
        ask: {
          prompt: "How many students do 5 buses hold?",
          answer: { type: "num", value: "210", form: "number", label: ["students", "student", "people", "kids"] },
          errors: [{ value: "252", misconception: "math-vs-real-rounding", feedback: "5 &times; 42 = 210. (252 is 6 buses.)" }],
          hint: "5 &times; 42.",
          reveal: "210 students. That leaves 5 students without a seat."
        }
      },
      {
        say: "5 buses are not enough. Real-life rounding: round up.",
        ask: {
          prompt: "How many buses are needed?",
          answer: { type: "num", value: "6", form: "number", label: ["buses", "bus"] },
          errors: [{ value: "5", misconception: "math-vs-real-rounding", feedback: "Math rounding says 5.1 &rarr; 5, but 5 students would be left behind. 6 buses." }],
          hint: "Enough means the next whole number up.",
          reveal: "6 buses. 215 &divide; 42 &asymp; 5.1; round up because everyone needs a seat."
        }
      }
    ]
  },
  {
    id: "d14",
    skill: "word-dec",
    kind: "word",
    level: 2,
    prompt: "Max earns $9.25 an hour helping at the bike shop. He works [[m:6 1/2]] hours on Saturday. How much does he earn? Round to the nearest cent.",
    answer: { type: "num", value: "60.13", form: "money", unit: "$", rounding: { mode: "nearest", to: 0.01, why: "9.25 &times; 6.5 = 60.125. Pay is to the cent, and the half cent rounds up." } },
    errors: [
      { value: "60.125", misconception: "money-cents", feedback: "There is no half cent. Round to the nearest cent: $60.13." },
      { value: "60.12", misconception: "rounding-direction", feedback: "60.125: the thousandths digit is 5, so the 2 rounds up to 3: $60.13." },
      { value: "601.25", misconception: "decimal-mult-places", feedback: "925 &times; 65 = 60125, with 2 + 1 = 3 decimal places: 60.125. Check the size: about 6 hours at about $9 is about $54, not $600." },
      { value: "55.50", misconception: "missed-step", feedback: "$55.50 is 6 hours. He worked [[m:6 1/2]]: add half an hour, $4.625, for $60.125 &rarr; $60.13." },
      { value: "15.75", misconception: "wrong-operation", feedback: "9.25 + 6.5 adds dollars to hours. Pay is rate &times; hours: 9.25 &times; 6.5 = $60.13." }
    ],
    hint: "[[m:6 1/2]] hours = 6.5 hours. Multiply by 9.25, then the cent rule.",
    steps: [
      {
        say: "Question: total pay, in dollars. Operation: rate &times; hours. Write the hours as a decimal first.",
        ask: {
          prompt: "[[m:6 1/2]] hours as a decimal?",
          answer: { type: "num", value: "6.5", form: "decimal" },
          errors: [{ value: "6.12", misconception: "frac-part-as-decimal", feedback: "[[f:1/2]] = 0.5, so 6.5." }],
          hint: "Half is 0.5.",
          reveal: "6.5 hours."
        }
      },
      {
        say: "Multiply: 9.25 &times; 6.5. As whole numbers, 925 &times; 65 = 60125. Count decimal places: 2 + 1 = 3.",
        figure: { type: "columns", numbers: ["9.25", "6.5"], op: "×" },
        ask: {
          prompt: "9.25 &times; 6.5 = ? (exact, before rounding)",
          answer: { type: "num", value: "60.125", form: "decimal" },
          errors: [{ value: "601.25", misconception: "decimal-mult-places", feedback: "Three decimal places: 60.125." }],
          hint: "60125 with three decimal places.",
          reveal: "60.125. Reasonable: about 6 &times; $9 = $54, a bit more."
        }
      },
      {
        say: "Money is paid to the cent.",
        ask: {
          prompt: "How much does Max earn, to the nearest cent?",
          answer: { type: "num", value: "60.13", form: "money", unit: "$" },
          errors: [{ value: "60.12", misconception: "rounding-direction", feedback: "The 5 in the thousandths place rounds the cents up: $60.13." }],
          hint: "60.125: look at the digit after the hundredths.",
          reveal: "$60.13. The half cent rounds up. Dollar sign on the answer."
        }
      }
    ]
  },
  {
    id: "d15",
    skill: "rounding",
    kind: "word",
    level: 2,
    prompt: "Max has $30 to spend at the comic shop. Each comic costs $4.25. How many comics can he buy?",
    answer: { type: "num", value: "7", form: "number", label: ["comics", "comic books", "comic", "books"], rounding: { mode: "down", to: 1, why: "He can only buy whole comics he can pay for. 8 would cost $34, more than he has." } },
    errors: [
      { value: "8", misconception: "math-vs-real-rounding", feedback: "8 comics cost 8 &times; 4.25 = $34. He only has $30. He can afford 7." },
      { value: "120/17", misconception: "math-vs-real-rounding", feedback: "7.06 is the math answer, but the shop does not sell 0.06 of a comic. Round down: 7 comics." },
      { value: "127.5", misconception: "wrong-operation", feedback: "30 &times; 4.25 is not a number of comics. How many $4.25s fit in $30 is division: 30 &divide; 4.25 &asymp; 7.06, so 7." }
    ],
    hint: "30 &divide; 4.25 is just over 7. Can he pay for the 8th?",
    figure: { type: "roundline", value: "7.06", step: 1, mode: "down", caption: "7 comics: $29.75. 8 comics: $34." },
    steps: [
      {
        say: "Operation: how many $4.25s fit in $30. Division. Check with multiplication instead of long division.",
        ask: {
          prompt: "What do 7 comics cost?",
          answer: { type: "num", value: "29.75", form: "money", unit: "$" },
          errors: [{ value: "34", misconception: "math-vs-real-rounding", feedback: "7 &times; 4.25 = 29.75. ($34 is 8 comics.)" }],
          hint: "7 &times; 4 = 28, plus 7 quarters.",
          reveal: "$29.75. That fits in $30 with 25 cents left."
        }
      },
      {
        say: "8 comics would be $34, more than he has.",
        ask: {
          prompt: "How many comics can Max buy?",
          answer: { type: "num", value: "7", form: "number", label: ["comics", "comic books", "comic", "books"] },
          errors: [{ value: "8", misconception: "math-vs-real-rounding", feedback: "He cannot pay $34 with $30. Round down: 7." }],
          hint: "Can afford means round down.",
          reveal: "7 comics. 30 &divide; 4.25 &asymp; 7.06; the partial comic does not count."
        }
      }
    ]
  },
  {
    id: "d13",
    skill: "frac-muldiv",
    kind: "short",
    level: 3,
    prompt: "Simplify the complex fraction [[c:3/4|5/8]]. Write the answer in simplest form.",
    answer: { type: "num", value: "6/5", form: "fraction" },
    errors: [
      { value: "15/32", misconception: "div-no-flip", feedback: "You multiplied without flipping. A complex fraction is a division: [[f:3/4]] &divide; [[f:5/8]] = [[f:3/4]] &times; [[f:8/5]] = [[f:24/20]] = [[f:6/5]]." },
      { value: "5/6", misconception: "div-no-flip", feedback: "You flipped the top fraction. Keep the first, flip the SECOND: [[f:3/4]] &times; [[f:8/5]] = [[f:6/5]]." },
      { value: "11/8", misconception: "wrong-operation", feedback: "A fraction bar between two fractions means divide, not add. [[f:3/4]] &divide; [[f:5/8]] = [[f:6/5]]." },
      { value: "3/5", misconception: "top-bottom-mismatch", feedback: "[[f:3/4]] &times; [[f:8/5]] = [[f:24/20]]. Simplify by dividing top and bottom by the SAME number, 4: [[f:6/5]]. [[f:3/5]] divides the top by 8 and the bottom by 4, which changes the value." }
    ],
    hint: "The big bar means divide: [[f:3/4]] &divide; [[f:5/8]]. Keep, change, flip.",
    steps: [
      {
        say: "A complex fraction is just a division written tall. Rewrite it with a &divide; sign, then keep, change, flip.",
        ask: {
          prompt: "[[f:3/4]] &divide; [[f:5/8]] = [[f:3/4]] &times; ?",
          answer: { type: "num", value: "8/5", form: "fraction-any" },
          errors: [{ value: "5/8", misconception: "div-no-flip", feedback: "The second fraction flips: [[f:8/5]]." }],
          hint: "Flip the second fraction upside down.",
          reveal: "[[f:8/5]]. Dividing by [[f:5/8]] is multiplying by [[f:8/5]]."
        }
      },
      {
        say: "Multiply tops and bottoms, then simplify.",
        ask: {
          prompt: "[[f:3/4]] &times; [[f:8/5]] = ? (simplest form)",
          answer: { type: "num", value: "6/5", form: "fraction" },
          errors: [{ value: "15/32", misconception: "div-no-flip", feedback: "3 &times; 8 = 24 and 4 &times; 5 = 20: [[f:24/20]] = [[f:6/5]]." }],
          hint: "[[f:24/20]]. Divide top and bottom by 4.",
          reveal: "[[f:6/5]] = [[m:1 1/5]]. Makes sense: [[f:3/4]] is a bit more than [[f:5/8]], so the quotient is a bit more than 1."
        }
      }
    ]
  },
  {
    id: "d16",
    skill: "word-frac",
    kind: "word",
    level: 3,
    prompt: "A ribbon is 12 feet long. Max cuts off [[m:2 2/3]] feet for a bow, then cuts the rest into 7 equal pieces. How long is each piece? Write your answer as a mixed number.",
    answer: { type: "num", value: "4/3", form: "fraction", label: ["feet", "ft", "foot"] },
    errors: [
      { value: "12/7", misconception: "missed-step", feedback: "You split the whole 12 feet. The bow comes off first: 12 &minus; [[m:2 2/3]] = [[m:9 1/3]], then divide by 7." },
      { value: "28/3", misconception: "missed-step", feedback: "[[m:9 1/3]] feet is what is left after the bow. The question asks how long each of the 7 pieces is: divide by 7." },
      { value: "196/3", misconception: "wrong-operation", feedback: "[[m:9 1/3]] &times; 7 makes the ribbon longer. Cutting into 7 equal pieces is division." },
      { value: "3/4", misconception: "div-no-flip", feedback: "You flipped the [[f:28/3]]. Keep it, flip the 7: [[f:28/3]] &times; [[f:1/7]] = [[f:4/3]]." },
      { value: "32/21", misconception: "regroup-mixed", feedback: "12 &minus; [[m:2 2/3]] is not [[m:10 2/3]]. Borrow: [[m:11 3/3]] &minus; [[m:2 2/3]] = [[m:9 1/3]]. Then [[f:28/3]] &divide; 7 = [[f:4/3]]." }
    ],
    hint: "Two steps: subtract the bow (borrow a whole from 12), then divide what is left by 7.",
    figure: { type: "bar", whole: "12 ft", parts: [{ size: 8, label: "[[m:2 2/3]] ft bow", tone: "muted" }, { size: 4, label: "?" }, { size: 4, label: "?" }, { size: 4, label: "?" }, { size: 4, label: "?" }, { size: 4, label: "?" }, { size: 4, label: "?" }, { size: 4, label: "?" }] },
    steps: [
      {
        say: "Question: length of one piece, in feet. Plan: subtract the bow, then divide by 7.",
        ask: {
          prompt: "Step 1. How much ribbon is left after the bow? Write it as a mixed number.",
          answer: { type: "num", value: "28/3", form: "fraction", label: ["feet", "ft", "foot"] },
          errors: [{ value: "32/3", misconception: "regroup-mixed", feedback: "Borrow a whole: 12 = [[m:11 3/3]]. [[m:11 3/3]] &minus; [[m:2 2/3]] = [[m:9 1/3]]." }],
          hint: "12 = [[m:11 3/3]]. Now subtract [[m:2 2/3]].",
          reveal: "[[m:9 1/3]] feet. [[m:11 3/3]] &minus; [[m:2 2/3]] = [[m:9 1/3]]."
        }
      },
      {
        say: "Step 2. [[m:9 1/3]] &divide; 7 = [[f:28/3]] &times; [[f:1/7]].",
        ask: {
          prompt: "How long is each piece? Write it as a mixed number, with the label.",
          answer: { type: "num", value: "4/3", form: "fraction", label: ["feet", "ft", "foot"] },
          errors: [{ value: "196/3", misconception: "wrong-operation", feedback: "Divide, do not multiply: [[f:28/3]] &times; [[f:1/7]] = [[f:28/21]] = [[f:4/3]]." }],
          hint: "[[f:28/21]]. Simplify by 7.",
          reveal: "[[m:1 1/3]] feet. Check: 7 &times; [[m:1 1/3]] = [[m:9 1/3]], and [[m:9 1/3]] + [[m:2 2/3]] = 12."
        }
      }
    ]
  }
];
