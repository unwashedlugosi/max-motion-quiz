/* content/lessons-ops.js (v2): operation lessons for gcf-lcm, frac-addsub, frac-muldiv, dec-ops. Loaded after lessons.js. */
window.FDP_LESSONS = (window.FDP_LESSONS || []).concat([
  /* ===================================================================== GCF / LCM */
  {
    id: "L-gcf-lcm",
    skill: "gcf-lcm",
    title: "GCF and LCM: the two tools behind fraction work",
    minutes: 5,
    hook: "The GCF makes a fraction simple. The LCM makes two fractions match. Every add, subtract and simplify uses one of them.",
    steps: [
      {
        say: "Two tools. The <b>GCF</b> shrinks a fraction to simplest form. The <b>LCM</b> gives fractions the same denominator so you can add them. Look at the strips: fourths and sixths do not line up, but twelfths do.",
        figure: {
          type: "fracbar",
          rows: [
            { parts: 4, shaded: 1, label: "[[f:1/4]]" },
            { parts: 6, shaded: 1, label: "[[f:1/6]]" },
            { parts: 12, shaded: 3, label: "[[f:3/12]]" },
            { parts: 12, shaded: 2, label: "[[f:2/12]]" }
          ]
        },
        ask: {
          prompt: "[[f:1/4]] is the same length as how many twelfths? Type the number of twelfths.",
          answer: { type: "num", value: "3", form: "number" },
          errors: [
            { value: "4", misconception: "copied-number", feedback: "4 is the bottom number of [[f:1/4]], copied from the problem. The question asks how many twelfth-pieces make the same length. Count the twelfths under the first strip." }
          ],
          hint: "12 split into 4 equal groups. How big is each group?",
          reveal: "3. One fourth is 3 of the 12 twelfth-pieces, because 12 &divide; 4 = 3. So [[f:1/4]] = [[f:3/12]]."
        }
      },
      {
        say: "First tool: the GCF, the greatest common factor. It is the biggest number that divides both numbers. Take 18 and 24.<br>Factors of 18: 1, 2, 3, 6, 9, 18.<br>Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24.<br>The numbers in both lists are 1, 2, 3 and 6.",
        ask: {
          prompt: "What is the GCF of 18 and 24?",
          answer: { type: "num", value: "6", form: "number" },
          errors: [
            { value: "72", misconception: "gcf-lcm-swap", feedback: "72 is the LCM, a number that both 18 and 24 go INTO. The GCF is a number that goes into both, so it is small." },
            { value: "3", misconception: "not-simplest", feedback: "3 is a common factor, but not the greatest one. Look at the end of both lists." }
          ],
          hint: "Find the biggest number that appears in both factor lists.",
          reveal: "6. It is the largest number in both lists, so 6 is the GCF of 18 and 24."
        }
      },
      {
        say: "Use the GCF to simplify. Divide the top and the bottom by 6.",
        ask: {
          prompt: "Simplify [[f:18/24]].",
          answer: { type: "num", value: "3/4", form: "fraction" },
          errors: [
            { value: "3/24", misconception: "not-simplest", feedback: "You divided only the top by 6. Whatever you divide the top by, divide the bottom by too." }
          ],
          hint: "Divide 18 by 6 and 24 by 6.",
          reveal: "[[f:3/4]]. 18 &divide; 6 = 3 and 24 &divide; 6 = 4. No number above 1 goes into both 3 and 4, so it is finished."
        }
      },
      {
        say: "Your teacher's big example was [[f:825/10000]]. This time you find the GCF yourself.",
        ask: {
          prompt: "What is the GCF of 825 and 10,000?",
          answer: { type: "num", value: "25", form: "number" },
          errors: [
            { value: "5", misconception: "not-simplest", feedback: "5 goes into both, but it is not the greatest. After dividing by 5, check whether 5 still goes into both." },
            { value: "330000", misconception: "gcf-lcm-swap", feedback: "That is the LCM, a huge number both go INTO. The GCF is the biggest number that goes into both." }
          ],
          hint: "Both numbers divide by 5. After you divide, does 5 still go into both?",
          reveal: "25. 825 &divide; 25 = 33 and 10,000 &divide; 25 = 400, and nothing bigger fits both."
        }
      },
      {
        say: "Now finish the simplifying.",
        ask: {
          prompt: "Simplify [[f:825/10000]].",
          answer: { type: "num", value: "33/400", form: "fraction" },
          errors: [
            { value: "33/10000", misconception: "not-simplest", feedback: "You divided only the top by 25. Divide the bottom by 25 too." }
          ],
          hint: "Divide the top and the bottom by the GCF you just found.",
          reveal: "[[f:33/400]]. 825 &divide; 25 = 33 and 10,000 &divide; 25 = 400. 33 is 3 &times; 11 and 400 has no 3 or 11, so it is simplest."
        },
        why: {
          prompt: "Why can you divide the top and the bottom by the same number without changing the fraction's value?",
          choices: [
            "Dividing both by the same number is the same as dividing by 1, so the value stays the same.",
            "Because the GCF is always the smallest number that fits.",
            "Because the top must always end up smaller than the bottom."
          ],
          correct: 0,
          feedback: [
            "Right. [[f:25/25]] = 1, so you are only changing how the same amount is named.",
            "The GCF is the greatest common factor, not the smallest. And the reason is about dividing by 1, not about size.",
            "Not so. Improper fractions like [[f:7/4]] have a bigger top, and they simplify the same way."
          ]
        }
      },
      {
        say: "Second tool: the LCM, the least common multiple. It is the smallest number both numbers go INTO. To add [[f:1/6]] + [[f:1/8]] you need a denominator that both 6 and 8 go into.<br>Multiples of 6: 6, 12, 18, 24.<br>Multiples of 8: 8, 16, 24.",
        figure: {
          type: "fracbar",
          rows: [
            { parts: 6, shaded: 1, label: "[[f:1/6]]" },
            { parts: 8, shaded: 1, label: "[[f:1/8]]" },
            { parts: 24, shaded: 4, label: "[[f:4/24]]" },
            { parts: 24, shaded: 3, label: "[[f:3/24]]" }
          ]
        },
        ask: {
          prompt: "What is the LCM of 6 and 8?",
          answer: { type: "num", value: "24", form: "number" },
          errors: [
            { value: "2", misconception: "gcf-lcm-swap", feedback: "2 is the GCF. For a common denominator you need a number both 6 and 8 go INTO, so it is bigger than both." }
          ],
          hint: "Find the first number that shows up in both lists of multiples.",
          reveal: "24. It is the first multiple that is in both lists. 6 &times; 4 = 24 and 8 &times; 3 = 24."
        }
      },
      {
        say: "With 24 as the denominator, rewrite the fractions. You multiply the bottom by something, so multiply the top by the same thing.",
        ask: {
          prompt: "[[f:5/6]] = ?/24. What is the new top number?",
          answer: { type: "num", value: "20", form: "number" },
          errors: [
            { value: "5", misconception: "top-bottom-mismatch", feedback: "[[f:5/24]] is not [[f:5/6]]. You changed the bottom to 24 but left the top at 5, so the fraction got much smaller. Whatever you multiply the bottom by, multiply the top by the same number." }
          ],
          hint: "How many times does 6 go into 24? Multiply the top by that.",
          reveal: "20. 6 &times; 4 = 24, so multiply the top too: 5 &times; 4 = 20. [[f:5/6]] = [[f:20/24]]."
        }
      },
      {
        say: "Quick check before the last one.",
        why: {
          prompt: "You want to add [[f:1/6]] + [[f:3/8]]. Which tool gives you the common denominator?",
          choices: [
            "GCF, the biggest number that divides both 6 and 8.",
            "LCM, the smallest number that both 6 and 8 go into.",
            "Either one. They give the same number."
          ],
          correct: 1,
          feedback: [
            "Not the GCF. The GCF of 6 and 8 is 2, which is smaller than both numbers. A common denominator has to be a number that both 6 and 8 divide into evenly, so it is a multiple of both. That is the LCM.",
            "Right. The LCM is 24, and both sixths and eighths can be cut into 24ths.",
            "They do not. The GCF of 6 and 8 is 2 and the LCM is 24. Simplify with the GCF, match denominators with the LCM."
          ]
        }
      },
      {
        say: "On your own. You are about to add [[f:7/9]] and [[f:5/12]].",
        ask: {
          prompt: "What is the smallest common denominator for [[f:7/9]] and [[f:5/12]]?",
          answer: { type: "num", value: "36", form: "number" },
          errors: [
            { value: "3", misconception: "gcf-lcm-swap", feedback: "3 is the GCF of 9 and 12. A common denominator is the LCM, a number both 9 and 12 go INTO." }
          ],
          hint: "List multiples of 12 until you hit one that 9 goes into.",
          reveal: "36. 9 &times; 4 = 36 and 12 &times; 3 = 36, and no smaller number works. The LCM of 9 and 12 is 36."
        }
      }
    ]
  },

  /* ===================================================================== ADD / SUBTRACT FRACTIONS */
  {
    id: "L-frac-addsub",
    skill: "frac-addsub",
    title: "Adding and subtracting fractions, with regrouping",
    minutes: 6,
    hook: "Match the piece sizes first. Then you only count. Regrouping mixed numbers is just trading one whole for pieces.",
    steps: [
      {
        say: "You can only add pieces that are the same size. Halves and thirds are different sizes, so cut both into sixths. Then you can count.",
        figure: {
          type: "fracbar",
          rows: [
            { parts: 2, shaded: 1, label: "[[f:1/2]]" },
            { parts: 3, shaded: 1, label: "[[f:1/3]]" },
            { parts: 6, shaded: 5, label: "[[f:5/6]]" }
          ]
        },
        ask: {
          prompt: "[[f:1/2]] + [[f:1/3]] = ?",
          answer: { type: "num", value: "5/6", form: "fraction" },
          errors: [
            { value: "2/5", misconception: "add-denominators", feedback: "You added the tops and the bottoms. The bottom names the size of the pieces, so it does not get added. Make sixths first." }
          ],
          hint: "Use the strips. How many sixths is a half? How many sixths is a third?",
          reveal: "[[f:5/6]]. [[f:1/2]] = [[f:3/6]] and [[f:1/3]] = [[f:2/6]]. 3 sixths + 2 sixths = 5 sixths."
        }
      },
      {
        say: "Now [[f:3/4]] + [[f:5/6]]. The common denominator is the LCM of the two bottoms.",
        ask: {
          prompt: "What is the LCM of 4 and 6?",
          answer: { type: "num", value: "12", form: "number" },
          errors: [
            { value: "2", misconception: "gcf-lcm-swap", feedback: "2 is the GCF. For a common denominator use the LCM, a number both 4 and 6 go INTO." }
          ],
          hint: "List multiples of 6: 6, 12, 18. Which one does 4 go into first?",
          reveal: "12. 4 &times; 3 = 12 and 6 &times; 2 = 12, and nothing smaller works."
        }
      },
      {
        say: "In twelfths, [[f:3/4]] = [[f:9/12]] and [[f:5/6]] = [[f:10/12]]. Add the tops. Keep the bottom.",
        ask: {
          prompt: "[[f:9/12]] + [[f:10/12]] = ? A mixed number is fine.",
          answer: { type: "num", value: "19/12", form: "fraction" },
          errors: [
            { value: "19/24", misconception: "add-denominators", feedback: "The pieces are still twelfths. Add the tops, but keep the 12 as it is." }
          ],
          hint: "Same-size pieces: just count them. Is the total more than 12 pieces?",
          reveal: "[[m:1 7/12]], which is [[f:19/12]]. 9 + 10 = 19 twelfths. 12 twelfths make one whole, so 19 twelfths is 1 whole and 7 twelfths."
        },
        why: {
          prompt: "Why is the answer [[f:19/12]] and not [[f:19/24]]?",
          choices: [
            "The bottom tells the size of each piece. We counted twelfths, so they are still twelfths.",
            "The bottom is always the bigger of the two denominators.",
            "You only add the bottoms when the tops are different."
          ],
          correct: 0,
          feedback: [
            "Right. Adding 9 twelfths and 10 twelfths gives 19 twelfths, the same way 9 apples + 10 apples is 19 apples.",
            "The bottom here is just the common denominator we picked, 12. It does not get changed.",
            "You never add the bottoms. They name the piece size, and the sizes already match."
          ]
        }
      },
      {
        say: "Subtracting works the same way. Match the denominators, subtract the tops, then check whether the answer simplifies.",
        ask: {
          prompt: "[[f:5/6]] &minus; [[f:1/2]] = ? Simplest form.",
          answer: { type: "num", value: "1/3", form: "fraction" },
          errors: [
            { value: "1/6", misconception: "not-simplest", feedback: "After subtracting you have [[f:2/6]]. To simplify, divide the top AND the bottom by 2, not just the top." },
            { value: "1", misconception: "add-denominators", feedback: "You subtracted the bottoms too (6 &minus; 2 = 4, and 4/4 is 1). Keep the denominator and subtract only the tops." }
          ],
          hint: "Write [[f:1/2]] in sixths first. Then subtract the tops and check the GCF.",
          reveal: "[[f:1/3]]. [[f:1/2]] = [[f:3/6]], so [[f:5/6]] &minus; [[f:3/6]] = [[f:2/6]]. The GCF of 2 and 6 is 2, so [[f:2/6]] = [[f:1/3]]."
        }
      },
      {
        say: "Now the tricky one: [[m:5 1/4]] &minus; [[m:2 3/4]]. You cannot take [[f:3/4]] away from [[f:1/4]]. So borrow one whole from the 5. That whole becomes [[f:4/4]], and [[f:4/4]] + [[f:1/4]] = [[f:5/4]].",
        figure: {
          type: "numberline",
          min: 2,
          max: 6,
          ticks: 4,
          marks: [
            { at: "11/4", label: "[[m:2 3/4]]" },
            { at: "21/4", label: "[[m:5 1/4]]" }
          ]
        },
        ask: {
          prompt: "[[m:5 1/4]] = [[m:4 ?/4]]. What number goes in the blank?",
          answer: { type: "num", value: "5", form: "number" },
          errors: [
            { value: "1", misconception: "regroup-mixed", feedback: "You left the [[f:1/4]] as it was. The borrowed whole adds [[f:4/4]] to it: [[f:4/4]] + [[f:1/4]]." }
          ],
          hint: "One whole is 4/4. Add it to the 1/4 you already have.",
          reveal: "5. Take 1 whole from the 5 and it becomes [[f:4/4]]. [[f:4/4]] + [[f:1/4]] = [[f:5/4]], so [[m:5 1/4]] = [[m:4 5/4]]."
        }
      },
      {
        say: "Now subtract. The fractions first: [[f:5/4]] &minus; [[f:3/4]]. Then the wholes: 4 &minus; 2.",
        ask: {
          prompt: "[[m:4 5/4]] &minus; [[m:2 3/4]] = ? Simplest form.",
          answer: { type: "num", value: "5/2", form: "fraction" },
          errors: [
            { value: "7/2", misconception: "regroup-mixed", feedback: "That is 3 1/2. You took the smaller fraction from the larger, [[f:3/4]] &minus; [[f:1/4]], instead of regrouping. Check: a little over 5 minus almost 3 is about 2 and a half, not 3 and a half." }
          ],
          hint: "Subtract the fractions first, then the wholes. Is the answer's fraction simplest?",
          reveal: "[[m:2 1/2]]. [[f:5/4]] &minus; [[f:3/4]] = [[f:2/4]] = [[f:1/2]], and 4 &minus; 2 = 2."
        },
        why: {
          prompt: "Why did we borrow a whole from the 5 instead of just doing [[f:3/4]] &minus; [[f:1/4]]?",
          choices: [
            "[[f:1/4]] is not enough to take [[f:3/4]] from, so we trade 1 whole for [[f:4/4]] to get more pieces.",
            "Subtracting mixed numbers always means borrowing.",
            "Because the 5 is odd."
          ],
          correct: 0,
          feedback: [
            "Right. The trade does not change the amount. [[m:5 1/4]] and [[m:4 5/4]] are the same number written two ways.",
            "Not always. It is only needed when the fraction you subtract is bigger than the one you have.",
            "Odd or even does not matter. What matters is that [[f:1/4]] is smaller than [[f:3/4]]."
          ]
        }
      },
      {
        say: "More of this one is yours. [[m:6 1/3]] &minus; [[m:2 5/6]]. In sixths, [[m:6 1/3]] = [[m:6 2/6]]. But 2 sixths is not enough to take 5 sixths from, so regroup.",
        ask: {
          prompt: "[[m:6 2/6]] = [[m:5 ?/6]]. What goes in the blank?",
          answer: { type: "num", value: "8", form: "number" },
          errors: [
            { value: "2", misconception: "regroup-mixed", feedback: "You left the [[f:2/6]] as it was. The borrowed whole is [[f:6/6]], and it gets added to the [[f:2/6]] you already have." },
            { value: "6", misconception: "regroup-mixed", feedback: "[[f:6/6]] is the borrowed whole, but you still have the [[f:2/6]] you started with. Add them: [[f:6/6]] + [[f:2/6]]." }
          ],
          hint: "Borrow one whole from the 6. How many sixths is one whole? Add it to the 2/6.",
          reveal: "8. One whole is [[f:6/6]], and [[f:6/6]] + [[f:2/6]] = [[f:8/6]]. So [[m:6 2/6]] = [[m:5 8/6]]."
        }
      },
      {
        say: "Now finish it.",
        ask: {
          prompt: "[[m:5 8/6]] &minus; [[m:2 5/6]] = ? Simplest form.",
          answer: { type: "num", value: "7/2", form: "fraction" },
          errors: [
            { value: "9/2", misconception: "regroup-mixed", feedback: "That is 4 1/2, which comes from skipping the regroup and subtracting the smaller fraction from the larger. Use [[m:5 8/6]]." }
          ],
          hint: "Subtract the fractions first, then the wholes. Then simplify the fraction part.",
          reveal: "[[m:3 1/2]]. [[f:8/6]] &minus; [[f:5/6]] = [[f:3/6]] = [[f:1/2]], and 5 &minus; 2 = 3."
        }
      },
      {
        say: "On your own. This one adds, and the fractions together make more than a whole.",
        ask: {
          prompt: "[[m:2 5/6]] + [[m:1 3/4]] = ? Simplest form.",
          answer: { type: "num", value: "55/12", form: "fraction" },
          errors: [
            { value: "19/5", misconception: "add-denominators", feedback: "That is 3 4/5. You added the bottoms (6 + 4). Use a common denominator, 12, and keep it." }
          ],
          hint: "Use twelfths. After you add the fractions, is the result more than 1 whole? If so, move a whole over.",
          reveal: "[[m:4 7/12]]. [[f:5/6]] = [[f:10/12]] and [[f:3/4]] = [[f:9/12]]. 10 + 9 = 19 twelfths = [[m:1 7/12]]. Add the wholes: 2 + 1 + 1 = 4. So [[m:4 7/12]]."
        }
      }
    ]
  },

  /* ===================================================================== MULTIPLY / DIVIDE FRACTIONS */
  {
    id: "L-frac-muldiv",
    skill: "frac-muldiv",
    title: "Multiplying and dividing fractions and mixed numbers",
    minutes: 6,
    hook: "Multiplying is a part of a part. Dividing is asking how many fit. Mixed numbers just need to be improper first.",
    steps: [
      {
        say: "Multiplying fractions means a part OF a part. Here [[f:2/3]] of the width and [[f:3/4]] of the height overlap. The whole square is cut into 3 &times; 4 = 12 small squares.",
        figure: { type: "area", a: "2/3", b: "3/4" },
        ask: {
          prompt: "How many of the 12 small squares are in the overlap?",
          answer: { type: "num", value: "6", form: "number" },
          errors: [
            { value: "5", misconception: "wrong-operation", feedback: "You added the 2 columns and the 3 rows. The overlap is a rectangle, so multiply the columns by the rows." },
            { value: "12", misconception: "copied-number", feedback: "12 is the number of small squares in the whole picture. The question asks only about the overlap." }
          ],
          hint: "The overlap is some columns wide and some rows tall. Count across, count down, and multiply.",
          reveal: "6. The overlap is 2 columns by 3 rows, and 2 &times; 3 = 6 small squares out of 12."
        }
      },
      {
        say: "So [[f:2/3]] &times; [[f:3/4]] = [[f:6/12]]. Rule: multiply the tops, multiply the bottoms, then simplify.",
        ask: {
          prompt: "[[f:2/3]] &times; [[f:3/4]] = ? Simplest form.",
          answer: { type: "num", value: "1/2", form: "fraction" },
          errors: [
            { value: "17/12", misconception: "wrong-operation", feedback: "That is [[f:2/3]] + [[f:3/4]]. The picture shows a part OF a part, which is multiplication: tops times tops, bottoms times bottoms." },
            { value: "8/9", misconception: "wrong-operation", feedback: "You flipped the second fraction, which is a step for dividing. This is a multiplication, so multiply straight across: [[f:2/3]] &times; [[f:3/4]]." }
          ],
          hint: "Multiply tops, multiply bottoms, then divide both by the GCF.",
          reveal: "[[f:1/2]]. 2 &times; 3 = 6 and 3 &times; 4 = 12, so [[f:6/12]]. The GCF of 6 and 12 is 6, so [[f:6/12]] = [[f:1/2]]."
        }
      },
      {
        say: "Mixed numbers: turn each into an improper fraction first. [[m:2 1/2]] = [[f:5/2]], because 2 wholes is 4 halves and 4 + 1 = 5 halves. Do the same with [[m:3 1/3]].",
        ask: {
          prompt: "Write [[m:3 1/3]] as an improper fraction.",
          answer: { type: "num", value: "10/3", form: "fraction" },
          errors: [
            { value: "31/3", misconception: "mixed-to-improper", feedback: "That writes the 3 and the 1 side by side. The 3 wholes have to be counted in thirds first: 3 &times; 3 = 9 thirds, then add the extra 1." },
            { value: "4/3", misconception: "mixed-to-improper", feedback: "You added the whole number and the top (3 + 1). Each whole is 3 thirds, so 3 wholes is 3 &times; 3 = 9 thirds. Then add 1 more third." }
          ],
          hint: "How many thirds are in 3 wholes? Then add the extra third.",
          reveal: "[[f:10/3]]. 3 wholes is 9 thirds, and 9 + 1 = 10 thirds."
        }
      },
      {
        say: "Now multiply [[m:2 1/2]] &times; [[m:3 1/3]], which is [[f:5/2]] &times; [[f:10/3]].",
        ask: {
          prompt: "[[f:5/2]] &times; [[f:10/3]] = ? Simplest form. A mixed number is fine.",
          answer: { type: "num", value: "25/3", form: "fraction" },
          errors: [
            { value: "37/6", misconception: "mixed-mult-parts", feedback: "That is 6 1/6. You multiplied the wholes (2 &times; 3) and the fractions ([[f:1/2]] &times; [[f:1/3]]) separately. That leaves out two pieces of the product. Use the improper fractions." }
          ],
          hint: "Multiply tops, multiply bottoms. Then divide both by the GCF.",
          reveal: "[[m:8 1/3]], which is [[f:25/3]]. 5 &times; 10 = 50 and 2 &times; 3 = 6, so [[f:50/6]]. The GCF of 50 and 6 is 2, so [[f:25/3]] = [[m:8 1/3]]."
        },
        why: {
          prompt: "Why does multiplying wholes and fractions separately (2 &times; 3 and [[f:1/2]] &times; [[f:1/3]]) give the wrong answer?",
          choices: [
            "[[m:2 1/2]] is 2 + [[f:1/2]]. Every part of one number has to multiply every part of the other, and separate multiplying skips two of those products.",
            "Because you cannot multiply fractions that have different bottoms.",
            "It does not. 6 1/6 is correct."
          ],
          correct: 0,
          feedback: [
            "Right. The skipped products are 2 &times; [[f:1/3]] and [[f:1/2]] &times; 3. Improper fractions handle all four products at once.",
            "You can. Multiplying never needs matching bottoms. That rule is for adding and subtracting.",
            "Check with decimals: 2.5 &times; 3.333 is about 8.3, not 6.2."
          ]
        }
      },
      {
        say: "Division asks: how many fit? How many [[f:3/4]]-cup scoops fit in 6 cups? The picture lines the scoops up.",
        figure: { type: "groups", total: "6", size: "3/4", unit: "cups" },
        ask: {
          prompt: "How many [[f:3/4]]s fit in 6?",
          answer: { type: "num", value: "8", form: "number" },
          errors: [
            { value: "9/2", misconception: "div-no-flip", feedback: "[[f:9/2]] is 6 &times; [[f:3/4]], which finds [[f:3/4]] OF 6. Fitting [[f:3/4]]s into 6 should give MORE than 6 scoops. Look at the picture." }
          ],
          hint: "Each whole cup holds one full scoop plus a third of another. Or count the groups in the picture.",
          reveal: "8. Each cup holds [[f:4/3]] scoops, and 6 &times; [[f:4/3]] = 8. The picture shows 8 full scoops and nothing left over."
        }
      },
      {
        say: "The rule: keep the first fraction, flip the SECOND, then multiply. So 6 &divide; [[f:3/4]] = 6 &times; [[f:4/3]] = 8, the same as the picture. Try [[f:2/3]] &divide; [[f:4/5]].",
        ask: {
          prompt: "[[f:2/3]] &divide; [[f:4/5]] = [[f:2/3]] &times; ?. What goes in the blank?",
          answer: { type: "num", value: "5/4", form: "fraction" },
          errors: [
            { value: "3/2", misconception: "div-no-flip", feedback: "You flipped the first fraction. Keep the first one. Flip the second one, [[f:4/5]]." },
            { value: "4/5", misconception: "div-no-flip", feedback: "That is the same [[f:4/5]], not flipped. Dividing means multiplying by the reciprocal, so flip it." }
          ],
          hint: "Keep [[f:2/3]]. Flip [[f:4/5]] by swapping its top and bottom.",
          reveal: "[[f:5/4]]. The reciprocal of [[f:4/5]] swaps the top and bottom. Then [[f:2/3]] &times; [[f:5/4]] = [[f:10/12]] = [[f:5/6]]."
        },
        why: {
          prompt: "Why does dividing by [[f:3/4]] turn into multiplying by [[f:4/3]]?",
          choices: [
            "One whole holds [[f:4/3]] scoops of size [[f:3/4]], so you multiply the number of wholes by [[f:4/3]].",
            "Because dividing and multiplying are always the same thing.",
            "Because you flip whichever fraction looks bigger."
          ],
          correct: 0,
          feedback: [
            "Right. In the picture, each cup held [[f:4/3]] scoops, and 6 cups held 6 &times; [[f:4/3]] = 8.",
            "They are not the same. 6 &divide; [[f:3/4]] = 8 but 6 &times; [[f:3/4]] = [[m:4 1/2]]. Multiplying by the flipped fraction is what matches dividing.",
            "It is not about which looks bigger. Always flip the fraction you are dividing BY, the second one."
          ]
        }
      },
      {
        say: "A fraction bar also means divide. This is a complex fraction:<br>[[c:3/4|5/8]]<br>It means [[f:3/4]] &divide; [[f:5/8]]. You do more of this one.",
        ask: {
          prompt: "Simplify the complex fraction: [[f:3/4]] over [[f:5/8]], which is [[f:3/4]] &divide; [[f:5/8]]. Simplest form. A mixed number is fine.",
          answer: { type: "num", value: "6/5", form: "fraction" },
          errors: [
            { value: "15/32", misconception: "div-no-flip", feedback: "That is [[f:3/4]] &times; [[f:5/8]]. You did not flip. Flip the bottom fraction, [[f:5/8]]." },
            { value: "5/6", misconception: "div-no-flip", feedback: "You flipped the first fraction, [[f:3/4]]. Keep the first. Flip the second, [[f:5/8]]." }
          ],
          hint: "Keep the top fraction. Flip the bottom one. Multiply, then simplify.",
          reveal: "[[m:1 1/5]], which is [[f:6/5]]. [[f:3/4]] &times; [[f:8/5]] = [[f:24/20]], and the GCF of 24 and 20 is 4, so [[f:6/5]]."
        }
      },
      {
        say: "Dividing mixed numbers combines both ideas. Make each an improper fraction. Then keep, flip, multiply.",
        ask: {
          prompt: "[[m:2 1/4]] &divide; [[m:1 1/2]] = ? Simplest form. A mixed number is fine.",
          answer: { type: "num", value: "3/2", form: "fraction" },
          errors: [
            { value: "27/8", misconception: "div-no-flip", feedback: "That is 3 3/8. You changed to improper fractions but forgot to flip the second one. [[f:3/2]] needs to become [[f:2/3]]." },
            { value: "2/3", misconception: "div-no-flip", feedback: "You flipped the first fraction. Keep [[f:9/4]]. Flip [[f:3/2]]." },
            { value: "5/2", misconception: "mixed-mult-parts", feedback: "That is 2 1/2, from dividing the wholes and the fractions separately. Convert both to improper fractions first." }
          ],
          hint: "[[m:2 1/4]] is [[f:9/4]]. What is [[m:1 1/2]] as an improper fraction? Then keep, flip the second, multiply.",
          reveal: "[[m:1 1/2]]. [[f:9/4]] &divide; [[f:3/2]] = [[f:9/4]] &times; [[f:2/3]] = [[f:18/12]] = [[f:3/2]], which is [[m:1 1/2]]."
        }
      },
      {
        say: "On your own. Convert, multiply, simplify.",
        ask: {
          prompt: "[[m:3 1/3]] &times; [[m:1 4/5]] = ?",
          answer: { type: "num", value: "6", form: "number" },
          errors: [
            { value: "49/15", misconception: "mixed-mult-parts", feedback: "That is 3 4/15. You multiplied wholes and fractions separately. Change both to improper fractions first." }
          ],
          hint: "Write both as improper fractions. Look for a number that divides a top and a bottom before you multiply.",
          reveal: "6. [[m:3 1/3]] = [[f:10/3]] and [[m:1 4/5]] = [[f:9/5]]. [[f:10/3]] &times; [[f:9/5]] = [[f:90/15]] = 6."
        }
      }
    ]
  },

  /* ===================================================================== DECIMAL OPERATIONS */
  {
    id: "L-dec-ops",
    skill: "dec-ops",
    title: "Decimal operations: points, places and shifts",
    minutes: 6,
    hook: "Add and subtract: line up the points. Multiply: count places. Divide: make the divisor a whole number.",
    steps: [
      {
        say: "To add or subtract, line up the decimal POINTS, not the right edges. Then tenths sit over tenths. A missing digit is a zero: 3.5 is 3.50.",
        figure: { type: "columns", numbers: ["3.5", "1.25"], op: "+" },
        ask: {
          prompt: "3.5 + 1.25 = ?",
          answer: { type: "num", value: "4.75", form: "decimal" },
          errors: [
            { value: "1.6", misconception: "decimal-align", feedback: "You lined up the right edges (35 + 125 = 160). Line up the points: 3.50 + 1.25." }
          ],
          hint: "Write 3.5 as 3.50 and add each column, hundredths first.",
          reveal: "4.75. 3.50 + 1.25 = 4.75: 0 + 5 = 5 hundredths, 5 + 2 = 7 tenths, 3 + 1 = 4 ones."
        }
      },
      {
        say: "A whole number has a hidden point at its right end. 7 is 7.00. Subtract with the points lined up.",
        figure: { type: "columns", numbers: ["7", "2.35"], op: "−" },
        ask: {
          prompt: "7 &minus; 2.35 = ?",
          answer: { type: "num", value: "4.65", form: "decimal" },
          errors: [
            { value: "5.35", misconception: "decimal-align", feedback: "You did 7 &minus; 2 and copied down .35. The 7 needs zeros too: 7.00 &minus; 2.35." }
          ],
          hint: "Write 7 as 7.00. You will need to borrow across the zeros.",
          reveal: "4.65. 7.00 &minus; 2.35 = 4.65. As hundredths, 700 &minus; 235 = 465."
        }
      },
      {
        say: "Your turn. The points are lined up for you.",
        figure: { type: "columns", numbers: ["12.35", "4.6"], op: "+" },
        ask: {
          prompt: "12.35 + 4.6 = ?",
          answer: { type: "num", value: "16.95", form: "decimal" },
          errors: [
            { value: "12.81", misconception: "decimal-align", feedback: "You added 1235 + 46 as if the right edges lined up. Put 4.6 as 4.60 under 12.35." }
          ],
          hint: "Write 4.6 as 4.60 and add column by column from the right.",
          reveal: "16.95. 12.35 + 4.60: 5 + 0 = 5, 3 + 6 = 9, 2 + 4 = 6, 1 stays. That is 16.95."
        }
      },
      {
        say: "Multiplying is different. You do NOT line up points. Multiply as if there were no points: 0.4 &times; 0.3 becomes 4 &times; 3 = 12. Then count the decimal places in both factors together.",
        figure: { type: "columns", numbers: ["0.4", "0.3"], op: "×" },
        ask: {
          prompt: "How many decimal places does 0.4 &times; 0.3 have in total? Count both factors.",
          answer: { type: "num", value: "2", form: "number" },
          errors: [
            { value: "1", misconception: "decimal-mult-places", feedback: "Each factor has one place. Add them up: the product gets both." }
          ],
          hint: "0.4 has one place. 0.3 has one place. Add the places.",
          reveal: "2. 0.4 has 1 decimal place, 0.3 has 1, and 1 + 1 = 2. The product has 2 places."
        }
      },
      {
        say: "Put the point so 12 has 2 decimal places.",
        ask: {
          prompt: "0.4 &times; 0.3 = ?",
          answer: { type: "num", value: "0.12", form: "decimal" },
          errors: [
            { value: "1.2", misconception: "decimal-mult-places", feedback: "That is only one decimal place. The product needs two, so 12 becomes 0.12." },
            { value: "0.012", misconception: "decimal-mult-places", feedback: "That is three places. Two places is 0.12." }
          ],
          hint: "Start from 12 and count 2 places from the right.",
          reveal: "0.12. 4 &times; 3 = 12, and two decimal places total gives 0.12. Check: four tenths of three tenths is 12 hundredths."
        },
        why: {
          prompt: "Why is 0.4 &times; 0.3 = 0.12 and not 1.2?",
          choices: [
            "Four tenths times three tenths is 12 hundredths, since tenths of tenths are hundredths.",
            "Because multiplying always makes the answer smaller.",
            "Because you move the point once for each zero."
          ],
          correct: 0,
          feedback: [
            "Right. A tenth of a tenth is a hundredth, so the answer is in hundredths: 12 hundredths = 0.12.",
            "Not always. 3 &times; 4 is bigger than both. It gets smaller here because both factors are less than 1.",
            "There are no zeros to count. You count decimal places in the two factors."
          ]
        }
      },
      {
        say: "More on your own. Ignore the points and multiply 12 &times; 5. Then count the places in both factors.",
        ask: {
          prompt: "1.2 &times; 0.05 = ?",
          answer: { type: "num", value: "0.06", form: "decimal" },
          errors: [
            { value: "0.6", misconception: "decimal-mult-places", feedback: "That is one place. 1.2 has 1 place and 0.05 has 2, so you need 3 places in 60." },
            { value: "0.006", misconception: "decimal-mult-places", feedback: "That is too many places. 12 &times; 5 = 60, and 3 places gives 0.060 = 0.06." }
          ],
          hint: "12 &times; 5 = 60. Count the decimal places in 1.2 and in 0.05, then place the point in 60.",
          reveal: "0.06. 12 &times; 5 = 60. The places are 1 + 2 = 3, so 60 becomes 0.060, which is 0.06."
        }
      },
      {
        say: "Division: make the divisor a whole number by moving its point. Then move the dividend's point the SAME number of places. 4.2 &divide; 0.6: the divisor 0.6 needs one hop right.",
        ask: {
          prompt: "After moving both points one place, 4.2 &divide; 0.6 becomes ? &divide; 6. What is the missing number?",
          answer: { type: "num", value: "42", form: "number" },
          errors: [
            { value: "4.2", misconception: "decimal-div-shift", feedback: "You moved the divisor but not the dividend. Both points hop the same way, so 4.2 becomes 42." }
          ],
          hint: "Both numbers get multiplied by 10. What is 4.2 times 10?",
          reveal: "42. Moving the point one place right in both numbers multiplies each by 10, so 4.2 &divide; 0.6 = 42 &divide; 6 = 7."
        }
      },
      {
        say: "Your turn, with more of the work. Move both points two places.",
        ask: {
          prompt: "0.78 &divide; 0.06 = ?",
          answer: { type: "num", value: "13", form: "number" },
          errors: [
            { value: "0.13", misconception: "decimal-div-shift", feedback: "You moved the divisor to 6 but left 0.78 alone. Both points move: 78 &divide; 6." }
          ],
          hint: "Move both points two places right. What division do you get?",
          reveal: "13. 0.78 &divide; 0.06 = 78 &divide; 6 = 13."
        },
        why: {
          prompt: "Why can you move both points the same number of places?",
          choices: [
            "Multiplying both numbers by the same power of 10 keeps the quotient the same.",
            "Because the dividend must always be a whole number.",
            "Because it makes the answer smaller."
          ],
          correct: 0,
          feedback: [
            "Right. 0.78 &divide; 0.06 and 78 &divide; 6 have the same answer, since both numbers were multiplied by 100.",
            "The dividend can stay a decimal. The divisor is the one that must become a whole number.",
            "The answer does not get smaller. Moving both points keeps the answer exactly the same."
          ]
        }
      },
      {
        say: "On your own. The 6 has a hidden point and needs hidden zeros.",
        ask: {
          prompt: "6 &divide; 0.15 = ?",
          answer: { type: "num", value: "40", form: "number" },
          errors: [
            { value: "0.4", misconception: "decimal-div-shift", feedback: "You turned 0.15 into 15 but left the 6 as 6. Both points move: 6 becomes 600." }
          ],
          hint: "Move both points two places right. Write the 6 as 6.00 first.",
          reveal: "40. 6 &divide; 0.15 = 600 &divide; 15 = 40. Check: 40 &times; 0.15 = 6."
        }
      }
    ]
  }
]);
