/* Practice question bank for Max's F/D/P test prep (v2 scope). See docs/SPEC.md for the contract.
   Items b001..; FDP_MOCK and FDP_MOCK_B each = 9 short (2 pts) + 15 word (4 pts) = 78 pts.
   Order-type errors use { order: [...], misconception, feedback }.
   Generated: every numeric answer was checked against an exact Fraction computation. */
window.FDP_BANK = [
 {
  "id": "b001",
  "skill": "place-value",
  "kind": "short",
  "level": 1,
  "prompt": "Tell which number is greater.<br>10.07 &nbsp;or&nbsp; 10.70",
  "figure": {
   "type": "placevalue",
   "numbers": [
    "10.07",
    "10.70"
   ]
  },
  "answer": {
   "type": "choice",
   "choices": [
    "10.07",
    "10.70",
    "They are equal"
   ],
   "correct": 1
  },
  "errors": [
   {
    "choice": 2,
    "misconception": "placeholder-zero",
    "feedback": "10.07 is not 10.7. The 0 in 10.07 holds the tenths place, so the 7 is only 7 hundredths."
   },
   {
    "choice": 0,
    "misconception": "placeholder-zero",
    "feedback": "Look at the tenths place first: 10.07 has 0 tenths, 10.70 has 7 tenths."
   }
  ],
  "hint": "Line up the decimal points and compare place by place, left to right.",
  "steps": [
   {
    "say": "Line the numbers up by the decimal point. Both have 10 ones, so the tenths place decides.",
    "figure": {
     "type": "placevalue",
     "numbers": [
      "10.07",
      "10.70"
     ]
    },
    "ask": {
     "prompt": "What digit is in the tenths place of 10.07?",
     "answer": {
      "type": "num",
      "value": "0",
      "form": "number"
     },
     "hint": "The tenths place is the first digit right after the decimal point.",
     "reveal": "10.07 has a 0 in the tenths place (and a 7 in the hundredths).",
     "errors": [
      {
       "value": "7",
       "misconception": "placeholder-zero",
       "feedback": "7 is in the hundredths place of 10.07. Tenths is the first digit after the point."
      }
     ]
    }
   },
   {
    "say": "Now the other number.",
    "ask": {
     "prompt": "What digit is in the tenths place of 10.70?",
     "answer": {
      "type": "num",
      "value": "7",
      "form": "number"
     },
     "hint": "First digit after the decimal point.",
     "reveal": "10.70 has a 7 in the tenths place."
    }
   },
   {
    "say": "0 tenths vs 7 tenths decides it.",
    "ask": {
     "prompt": "Which number is greater?",
     "answer": {
      "type": "choice",
      "choices": [
       "10.07",
       "10.70"
      ],
      "correct": 1
     },
     "hint": "More tenths wins when the ones are equal.",
     "reveal": "10.70 is greater: 7 tenths beats 0 tenths."
    }
   }
  ]
 },
 {
  "id": "b002",
  "skill": "place-value",
  "kind": "short",
  "level": 1,
  "prompt": "Tell which number is greater.<br>0.5 &nbsp;or&nbsp; 0.45",
  "figure": {
   "type": "placevalue",
   "numbers": [
    "0.5",
    "0.45"
   ]
  },
  "answer": {
   "type": "choice",
   "choices": [
    "0.5",
    "0.45",
    "They are equal"
   ],
   "correct": 0
  },
  "errors": [
   {
    "choice": 1,
    "misconception": "longer-larger",
    "feedback": "45 looks bigger than 5, but they count different places. 0.5 is 5 tenths = 50 hundredths."
   },
   {
    "choice": 2,
    "misconception": "placeholder-zero",
    "feedback": "0.5 and 0.45 are not equal. 0.5 = 0.50, which is more than 0.45."
   }
  ],
  "hint": "Write 0.5 with a second decimal place so both have hundredths.",
  "steps": [
   {
    "say": "Give both numbers the same number of decimal places. Adding a zero on the end does not change the value.",
    "figure": {
     "type": "placevalue",
     "numbers": [
      "0.5",
      "0.45"
     ]
    },
    "ask": {
     "prompt": "Write 0.5 using two decimal places.",
     "answer": {
      "type": "num",
      "value": "0.5",
      "form": "decimal"
     },
     "hint": "Put a zero after the 5.",
     "reveal": "0.5 = 0.50."
    }
   },
   {
    "say": "Now count hundredths.",
    "ask": {
     "prompt": "0.50 is how many hundredths? (0.50 = ___/100)",
     "answer": {
      "type": "num",
      "value": "50",
      "form": "number"
     },
     "hint": "Read 0.50 as a whole number of hundredths.",
     "reveal": "0.50 = 50/100, so 50 hundredths."
    }
   },
   {
    "say": "Compare 50 hundredths and 45 hundredths.",
    "ask": {
     "prompt": "Which is greater?",
     "answer": {
      "type": "choice",
      "choices": [
       "0.5",
       "0.45"
      ],
      "correct": 0
     },
     "hint": "Compare 50 and 45.",
     "reveal": "0.5 is greater: 50 hundredths > 45 hundredths."
    }
   }
  ]
 },
 {
  "id": "b003",
  "skill": "place-value",
  "kind": "short",
  "level": 1,
  "prompt": "Tell which number is greater.<br>0.3 &nbsp;or&nbsp; 0.299",
  "figure": {
   "type": "placevalue",
   "numbers": [
    "0.3",
    "0.299"
   ]
  },
  "answer": {
   "type": "choice",
   "choices": [
    "0.3",
    "0.299",
    "They are equal"
   ],
   "correct": 0
  },
  "errors": [
   {
    "choice": 1,
    "misconception": "longer-larger",
    "feedback": "299 is more digits, not more value. 0.3 = 0.300, which is bigger than 0.299."
   },
   {
    "choice": 2,
    "misconception": "placeholder-zero",
    "feedback": "They are close but not equal: 0.300 vs 0.299."
   }
  ],
  "hint": "Rewrite 0.3 with three decimal places.",
  "steps": [
   {
    "say": "Write 0.3 as thousandths so both numbers have three decimal places.",
    "figure": {
     "type": "placevalue",
     "numbers": [
      "0.3",
      "0.299"
     ]
    },
    "ask": {
     "prompt": "0.3 = ___/1000",
     "answer": {
      "type": "num",
      "value": "300",
      "form": "number"
     },
     "hint": "0.3 = 0.300. Read it as a whole number of thousandths.",
     "reveal": "0.3 = 0.300 = 300/1000."
    }
   },
   {
    "say": "Compare 300 thousandths with 299 thousandths.",
    "ask": {
     "prompt": "Which is greater?",
     "answer": {
      "type": "choice",
      "choices": [
       "0.3",
       "0.299"
      ],
      "correct": 0
     },
     "hint": "300 vs 299.",
     "reveal": "0.3 is greater because 300 > 299."
    }
   }
  ]
 },
 {
  "id": "b004",
  "skill": "place-value",
  "kind": "short",
  "level": 2,
  "prompt": "Order the numbers from least to greatest.",
  "answer": {
   "type": "order",
   "items": [
    "0.4",
    "0.04",
    "0.404",
    "0.044",
    "0.44"
   ],
   "correct": [
    1,
    3,
    0,
    2,
    4
   ]
  },
  "errors": [
   {
    "order": [
     1,
     0,
     3,
     4,
     2
    ],
    "misconception": "longer-larger",
    "feedback": "You ordered them like whole numbers (4, 4, 44, 44, 404). Line up the decimal points and compare place by place."
   },
   {
    "order": [
     0,
     1,
     3,
     2,
     4
    ],
    "misconception": "placeholder-zero",
    "feedback": "0.04 is not 0.4. The zero after the point pushes the 4 to the hundredths place, so 0.04 is smaller than 0.4."
   }
  ],
  "hint": "Write every number to three decimal places and compare them as thousandths.",
  "steps": [
   {
    "say": "Make all five numbers three decimal places long, then they are easy to compare.",
    "ask": {
     "prompt": "How many thousandths is 0.4?",
     "answer": {
      "type": "num",
      "value": "400",
      "form": "number"
     },
     "hint": "0.4 = 0.400.",
     "reveal": "0.4 = 0.400 = 400 thousandths.",
     "errors": [
      {
       "value": "4",
       "misconception": "placeholder-zero",
       "feedback": "0.4 is 4 tenths = 400 thousandths, not 4 thousandths."
      }
     ]
    }
   },
   {
    "say": "Now a small one.",
    "ask": {
     "prompt": "How many thousandths is 0.044?",
     "answer": {
      "type": "num",
      "value": "44",
      "form": "number"
     },
     "hint": "0.044 has digits 0, 4, 4.",
     "reveal": "0.044 = 44 thousandths."
    }
   },
   {
    "say": "Rewrite each as thousandths: 0.4 = 400, 0.04 = 40, 0.404 = 404, 0.044 = 44, 0.44 = 440.",
    "ask": {
     "prompt": "Order these thousandths from least to greatest.",
     "answer": {
      "type": "order",
      "items": [
       "400",
       "40",
       "404",
       "44",
       "440"
      ],
      "correct": [
       1,
       3,
       0,
       2,
       4
      ]
     },
     "hint": "Smallest number of thousandths is smallest.",
     "reveal": "40, 44, 400, 404, 440, which are 0.04, 0.044, 0.4, 0.404, 0.44."
    }
   }
  ]
 },
 {
  "id": "b005",
  "skill": "place-value",
  "kind": "short",
  "level": 2,
  "prompt": "Which number is greatest?",
  "answer": {
   "type": "choice",
   "choices": [
    "0.09",
    "0.1",
    "0.099",
    "0.0999"
   ],
   "correct": 1
  },
  "errors": [
   {
    "choice": 3,
    "misconception": "longer-larger",
    "feedback": "0.0999 has the most digits, but its first non-zero digit is way out in the hundredths. 0.1 is one whole tenth."
   },
   {
    "choice": 2,
    "misconception": "longer-larger",
    "feedback": "More digits does not mean bigger. Compare tenths first: 0.099 has 0 tenths, 0.1 has 1 tenth."
   },
   {
    "choice": 0,
    "misconception": "shorter-larger",
    "feedback": "9 is a big digit, but it sits in the hundredths place. 0.1 has 1 tenth = 10 hundredths."
   }
  ],
  "hint": "Write each number to four decimal places (ten-thousandths).",
  "steps": [
   {
    "say": "Use ten-thousandths so every number has four decimal places.",
    "ask": {
     "prompt": "How many ten-thousandths is 0.1? (0.1 = ___/10000)",
     "answer": {
      "type": "num",
      "value": "1000",
      "form": "number"
     },
     "hint": "0.1 = 0.1000.",
     "reveal": "0.1 = 0.1000 = 1000 ten-thousandths."
    }
   },
   {
    "say": "And the long one.",
    "ask": {
     "prompt": "How many ten-thousandths is 0.0999?",
     "answer": {
      "type": "num",
      "value": "999",
      "form": "number"
     },
     "hint": "Drop the leading zeros and read the digits.",
     "reveal": "0.0999 = 999 ten-thousandths."
    }
   },
   {
    "say": "1000 vs 999 (and 0.09 = 900, 0.099 = 990).",
    "ask": {
     "prompt": "Which is greater: 0.1 or 0.0999?",
     "answer": {
      "type": "choice",
      "choices": [
       "0.1",
       "0.0999"
      ],
      "correct": 0
     },
     "hint": "Compare 1000 and 999.",
     "reveal": "0.1 is greater, and it beats the others too."
    }
   }
  ]
 },
 {
  "id": "b006",
  "skill": "place-value",
  "kind": "short",
  "level": 3,
  "prompt": "What is the smallest digit that can go in the box to make this true?<br>4.&#9633;07 &gt; 4.3",
  "answer": {
   "type": "num",
   "value": "3",
   "form": "number"
  },
  "errors": [
   {
    "value": "2",
    "misconception": "longer-larger",
    "feedback": "4.207 is less than 4.3 (4.207 vs 4.300). Digits after the first don't matter if the tenths are smaller."
   },
   {
    "value": "0",
    "misconception": "longer-larger",
    "feedback": "4.007 is only 7 thousandths past 4. It is less than 4.3."
   }
  ],
  "hint": "Compare tenths first. The box IS the tenths place.",
  "steps": [
   {
    "say": "The box is in the tenths place. 4.3 has 3 tenths.",
    "ask": {
     "prompt": "What digit is in the tenths place of 4.3?",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number"
     },
     "hint": "First digit after the decimal point.",
     "reveal": "4.3 has 3 tenths."
    }
   },
   {
    "say": "Test a digit. Try 2.",
    "ask": {
     "prompt": "Is 4.207 greater than 4.300?",
     "answer": {
      "type": "choice",
      "choices": [
       "Yes",
       "No"
      ],
      "correct": 1
     },
     "hint": "Compare tenths: 2 vs 3.",
     "reveal": "No. 2 tenths < 3 tenths, so 4.207 < 4.3."
    }
   },
   {
    "say": "2 is too small: 2 tenths is less than 3 tenths. Now think about the next digit up.",
    "ask": {
     "prompt": "What is the smallest digit that works?",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number"
     },
     "hint": "Test the next digit up. Compare its tenths with the 3 in 4.3, and check the rest.",
     "reveal": "3 works: 4.307 > 4.300. Nothing smaller does."
    }
   }
  ]
 },
 {
  "id": "b007",
  "skill": "place-value",
  "kind": "word",
  "level": 2,
  "prompt": "In the 100-meter dash, Ava ran 14.09 s, Ben ran 14.9 s, Cam ran 14.19 s, and Dee ran 14.1 s. What was the fastest (smallest) time?",
  "answer": {
   "type": "num",
   "value": "14.09",
   "form": "decimal",
   "label": [
    "seconds",
    "second",
    "sec",
    "s"
   ]
  },
  "errors": [
   {
    "value": "14.1",
    "misconception": "longer-larger",
    "feedback": "14.1 looks small because it is short, but 14.1 = 14.10, which is more than 14.09."
   },
   {
    "value": "14.9",
    "misconception": "placeholder-zero",
    "feedback": "14.9 is 14.90 s, the SLOWEST time. 14.09 has 0 tenths, not 9."
   }
  ],
  "hint": "Write every time with two decimal places before comparing.",
  "steps": [
   {
    "say": "Give every time two decimal places.",
    "ask": {
     "prompt": "Write Ben's 14.9 with two decimal places.",
     "answer": {
      "type": "num",
      "value": "14.9",
      "form": "decimal"
     },
     "hint": "Add a zero on the end.",
     "reveal": "14.9 = 14.90."
    }
   },
   {
    "say": "Times are 14.09, 14.90, 14.19, 14.10. Smallest time is fastest.",
    "ask": {
     "prompt": "Order the times from least to greatest.",
     "answer": {
      "type": "order",
      "items": [
       "14.09",
       "14.9",
       "14.19",
       "14.1"
      ],
      "correct": [
       0,
       3,
       2,
       1
      ]
     },
     "hint": "Compare tenths first, then hundredths.",
     "reveal": "14.09 < 14.10 < 14.19 < 14.90. Ava's 14.09 seconds is fastest."
    }
   }
  ]
 },
 {
  "id": "b008",
  "skill": "place-value",
  "kind": "short",
  "level": 3,
  "prompt": "Order the numbers from least to greatest.",
  "answer": {
   "type": "order",
   "items": [
    "2.3",
    "2.03",
    "2.303",
    "2.033",
    "2.3003"
   ],
   "correct": [
    1,
    3,
    0,
    4,
    2
   ]
  },
  "errors": [
   {
    "order": [
     0,
     1,
     3,
     2,
     4
    ],
    "misconception": "longer-larger",
    "feedback": "That ordering treats the digits like whole numbers (23, 203, 2033, 2303, 23003). Compare place by place instead."
   },
   {
    "order": [
     1,
     3,
     0,
     2,
     4
    ],
    "misconception": "longer-larger",
    "feedback": "2.3003 is NOT bigger than 2.303. Compare thousandths: 2.303 has 3, 2.3003 has 0."
   }
  ],
  "hint": "Write each number as ten-thousandths (four decimal places).",
  "steps": [
   {
    "say": "Use ten-thousandths: four decimal places for each.",
    "ask": {
     "prompt": "How many ten-thousandths is 2.03? (2.03 = 2.0300, read without the point)",
     "answer": {
      "type": "num",
      "value": "20300",
      "form": "number"
     },
     "hint": "2.03 = 2.0300.",
     "reveal": "2.0300 = 20300 ten-thousandths."
    }
   },
   {
    "say": "Another one.",
    "ask": {
     "prompt": "How many ten-thousandths is 2.3003?",
     "answer": {
      "type": "num",
      "value": "23003",
      "form": "number"
     },
     "hint": "Four decimal places: think × 10,000.",
     "reveal": "2.3003 = 23003 ten-thousandths."
    }
   },
   {
    "say": "All five: 2.3 = 23000, 2.03 = 20300, 2.303 = 23030, 2.033 = 20330, 2.3003 = 23003.",
    "ask": {
     "prompt": "Order these from least to greatest.",
     "answer": {
      "type": "order",
      "items": [
       "23000",
       "20300",
       "23030",
       "20330",
       "23003"
      ],
      "correct": [
       1,
       3,
       0,
       4,
       2
      ]
     },
     "hint": "Smallest whole number is smallest.",
     "reveal": "20300, 20330, 23000, 23003, 23030 = 2.03, 2.033, 2.3, 2.3003, 2.303."
    }
   }
  ]
 },
 {
  "id": "b009",
  "skill": "pct-dec",
  "kind": "short",
  "level": 1,
  "prompt": "Write the percent as a decimal.<br>8.25%",
  "figure": {
   "type": "grid",
   "shaded": 8.25
  },
  "answer": {
   "type": "num",
   "value": "0.0825",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.825",
    "misconception": "pct-shift-one-place",
    "feedback": "You moved the decimal point one place. Percent means per hundred: two places left."
   },
   {
    "value": "825",
    "misconception": "pct-shift-wrong-way",
    "feedback": "You moved the point to the RIGHT. Percent to decimal goes LEFT (÷ 100)."
   }
  ],
  "hint": "Percent means 'per 100', so divide by 100.",
  "steps": [
   {
    "say": "Percent means 'per one hundred'.",
    "ask": {
     "prompt": "To change a percent to a decimal, you divide by what number?",
     "answer": {
      "type": "num",
      "value": "100",
      "form": "number"
     },
     "hint": "Percent = per ___.",
     "reveal": "Divide by 100, because percent means per 100."
    },
    "why": {
     "prompt": "Why two places and not one?",
     "choices": [
      "Because 100 has two zeros",
      "Because percents are always small",
      "Because 8.25 has two decimal places"
     ],
     "correct": 0,
     "feedback": [
      "Right: ÷ 100 moves the point two places left.",
      "Not quite: percents can be over 100%.",
      "No, it is because we divide by 100, which has two zeros."
     ]
    }
   },
   {
    "say": "Hop the decimal point two places left.",
    "figure": {
     "type": "shift",
     "number": "8.25",
     "places": -2,
     "note": "÷ 100"
    },
    "ask": {
     "prompt": "8.25 ÷ 100 = ?",
     "answer": {
      "type": "num",
      "value": "0.0825",
      "form": "decimal"
     },
     "hint": "Add a zero in front as a placeholder: 08.25 then hop two left.",
     "reveal": "8.25% = 0.0825.",
     "errors": [
      {
       "value": "0.825",
       "misconception": "pct-shift-one-place",
       "feedback": "That's only one hop."
      }
     ]
    }
   }
  ]
 },
 {
  "id": "b010",
  "skill": "pct-dec",
  "kind": "short",
  "level": 1,
  "prompt": "Write the decimal as a percent.<br>0.375",
  "answer": {
   "type": "num",
   "value": "37.5",
   "form": "percent"
  },
  "errors": [
   {
    "value": "3.75",
    "misconception": "pct-shift-one-place",
    "feedback": "You moved the point one place. ×100 means two places right."
   },
   {
    "value": "0.00375",
    "misconception": "pct-shift-wrong-way",
    "feedback": "Wrong direction! Decimal to percent moves the point RIGHT."
   }
  ],
  "hint": "Decimal to percent: multiply by 100, point moves right.",
  "steps": [
   {
    "say": "Going from a decimal to a percent multiplies by 100.",
    "ask": {
     "prompt": "Which way does the decimal point hop?",
     "answer": {
      "type": "choice",
      "choices": [
       "Right (× 100)",
       "Left (÷ 100)"
      ],
      "correct": 0
     },
     "hint": "Percents are bigger-looking numbers than their decimals.",
     "reveal": "Right, two places: 0.375 becomes 37.5."
    }
   },
   {
    "say": "Hop two places right and add the % sign.",
    "figure": {
     "type": "shift",
     "number": "0.375",
     "places": 2,
     "note": "× 100"
    },
    "ask": {
     "prompt": "0.375 = ___%",
     "answer": {
      "type": "num",
      "value": "37.5",
      "form": "percent"
     },
     "hint": "0.375 × 100.",
     "reveal": "0.375 = 37.5%."
    }
   }
  ]
 },
 {
  "id": "b011",
  "skill": "pct-dec",
  "kind": "short",
  "level": 2,
  "prompt": "Write the percent as a decimal.<br>[[f:2/5]]%",
  "answer": {
   "type": "num",
   "value": "0.004",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.4",
    "misconception": "pct-small-as-whole",
    "feedback": "[[f:2/5]] = 0.4, but the % still means ÷ 100. 0.4% = 0.004."
   },
   {
    "value": "0.04",
    "misconception": "pct-shift-one-place",
    "feedback": "One hop short. 0.4% is 0.4 ÷ 100 = 0.004."
   }
  ],
  "hint": "First write [[f:2/5]] as a decimal, then divide by 100.",
  "steps": [
   {
    "say": "The number in front of % is [[f:2/5]]. Turn it into a decimal first.",
    "ask": {
     "prompt": "[[f:2/5]] as a decimal?",
     "answer": {
      "type": "num",
      "value": "0.4",
      "form": "decimal"
     },
     "hint": "2 ÷ 5.",
     "reveal": "2 ÷ 5 = 0.4, so [[f:2/5]]% = 0.4%."
    }
   },
   {
    "say": "Now 0.4% means 0.4 per 100: divide by 100.",
    "figure": {
     "type": "shift",
     "number": "0.4",
     "places": -2,
     "note": "÷ 100"
    },
    "ask": {
     "prompt": "0.4 ÷ 100 = ?",
     "answer": {
      "type": "num",
      "value": "0.004",
      "form": "decimal"
     },
     "hint": "Two hops left, with zero placeholders.",
     "reveal": "0.4% = 0.004.",
     "errors": [
      {
       "value": "0.04",
       "misconception": "pct-shift-one-place",
       "feedback": "That's one hop."
      }
     ]
    }
   }
  ]
 },
 {
  "id": "b012",
  "skill": "pct-dec",
  "kind": "short",
  "level": 2,
  "prompt": "Write the percent as a decimal.<br>125%",
  "answer": {
   "type": "num",
   "value": "1.25",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.125",
    "misconception": "pct-shift-places",
    "feedback": "125 ÷ 100 moves the point two places: 1.25. You moved it three."
   },
   {
    "value": "12.5",
    "misconception": "pct-shift-one-place",
    "feedback": "That is one hop left. ÷ 100 is two hops: 1.25."
   }
  ],
  "hint": "Divide by 100. A percent over 100 is more than one whole.",
  "steps": [
   {
    "say": "125% means 125 per 100, which is more than 1 whole.",
    "figure": {
     "type": "grid",
     "shaded": 125,
     "grids": 2
    },
    "ask": {
     "prompt": "Is 125% more than, less than, or equal to 1 whole?",
     "answer": {
      "type": "choice",
      "choices": [
       "More than 1",
       "Less than 1",
       "Equal to 1"
      ],
      "correct": 0
     },
     "hint": "100% is one whole.",
     "reveal": "More than 1: it is 100% + 25%."
    }
   },
   {
    "say": "Divide by 100.",
    "ask": {
     "prompt": "125 ÷ 100 = ?",
     "answer": {
      "type": "num",
      "value": "1.25",
      "form": "decimal"
     },
     "hint": "Move the point two places left.",
     "reveal": "125% = 1.25."
    }
   }
  ]
 },
 {
  "id": "b013",
  "skill": "pct-dec",
  "kind": "short",
  "level": 2,
  "prompt": "Write the percent as a decimal.<br>0.0876%",
  "answer": {
   "type": "num",
   "value": "0.000876",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.0876",
    "misconception": "pct-small-as-whole",
    "feedback": "The % still means ÷ 100: 0.0876% is a tiny fraction of 1."
   },
   {
    "value": "0.00876",
    "misconception": "pct-shift-one-place",
    "feedback": "That's only one hop. You need two places left."
   }
  ],
  "hint": "Same rule as always: move the point two places left. Use zero placeholders.",
  "steps": [
   {
    "say": "0.0876% is less than 1%, so the decimal will be tiny.",
    "ask": {
     "prompt": "Is 0.0876% smaller or larger than 1%?",
     "answer": {
      "type": "choice",
      "choices": [
       "Smaller",
       "Larger"
      ],
      "correct": 0
     },
     "hint": "Compare 0.0876 to 1.",
     "reveal": "Smaller, because 0.0876 < 1."
    }
   },
   {
    "say": "Divide by 100: two hops left.",
    "figure": {
     "type": "shift",
     "number": "0.0876",
     "places": -2,
     "note": "÷ 100"
    },
    "ask": {
     "prompt": "0.0876 ÷ 100 = ?",
     "answer": {
      "type": "num",
      "value": "0.000876",
      "form": "decimal"
     },
     "hint": "Two hops left; fill empty places with zeros.",
     "reveal": "0.0876% = 0.000876.",
     "errors": [
      {
       "value": "0.00876",
       "misconception": "pct-shift-one-place",
       "feedback": "One hop only."
      }
     ]
    }
   }
  ]
 },
 {
  "id": "b014",
  "skill": "pct-dec",
  "kind": "short",
  "level": 2,
  "prompt": "Write the decimal as a percent.<br>0.0042",
  "answer": {
   "type": "num",
   "value": "0.42",
   "form": "percent"
  },
  "errors": [
   {
    "value": "0.042",
    "misconception": "pct-shift-one-place",
    "feedback": "×100 moves the point two places right, not one."
   },
   {
    "value": "0.000042",
    "misconception": "pct-shift-wrong-way",
    "feedback": "You moved left. Decimal to percent moves RIGHT."
   }
  ],
  "hint": "Multiply by 100: point two places right.",
  "steps": [
   {
    "say": "Decimal to percent: ×100.",
    "ask": {
     "prompt": "0.0042 × 100 = ?",
     "answer": {
      "type": "num",
      "value": "0.42",
      "form": "number"
     },
     "hint": "Two hops right.",
     "reveal": "0.0042 × 100 = 0.42."
    }
   },
   {
    "say": "Answer with the percent sign.",
    "ask": {
     "prompt": "So 0.0042 is ___ than 1%.",
     "answer": {
      "type": "choice",
      "choices": [
       "less",
       "more"
      ],
      "correct": 0
     },
     "hint": "Is 0.42% bigger than 1%?",
     "reveal": "Less: 0.42% < 1%."
    }
   }
  ]
 },
 {
  "id": "b015",
  "skill": "pct-dec",
  "kind": "short",
  "level": 3,
  "prompt": "Write the percent as a decimal.<br>[[m:8 1/4]]%",
  "answer": {
   "type": "num",
   "value": "0.0825",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.0814",
    "misconception": "frac-part-as-decimal",
    "feedback": "¼ is 0.25, not 0.14. So 8¼ = 8.25."
   },
   {
    "value": "0.084",
    "misconception": "frac-part-as-decimal",
    "feedback": "¼ = 0.25, not 0.4. So 8¼% = 8.25%, then ÷ 100."
   },
   {
    "value": "0.825",
    "misconception": "pct-shift-one-place",
    "feedback": "One hop short: 8.25 ÷ 100 = 0.0825."
   }
  ],
  "hint": "Turn ¼ into a decimal first, then divide by 100.",
  "steps": [
   {
    "say": "Step 1: change the fraction part to a decimal.",
    "ask": {
     "prompt": "[[f:1/4]] as a decimal?",
     "answer": {
      "type": "num",
      "value": "0.25",
      "form": "decimal"
     },
     "hint": "1 ÷ 4, or think quarters of a dollar.",
     "reveal": "[[f:1/4]] = 0.25.",
     "errors": [
      {
       "value": "0.4",
       "misconception": "frac-part-as-decimal",
       "feedback": "That's [[f:2/5]]. ¼ = 1 ÷ 4 = 0.25."
      },
      {
       "value": "0.14",
       "misconception": "frac-part-as-decimal",
       "feedback": "Don't glue the 1 and the 4 together. 1 ÷ 4 = 0.25."
      }
     ]
    }
   },
   {
    "say": "So [[m:8 1/4]]% is 8.25%.",
    "ask": {
     "prompt": "Write [[m:8 1/4]] as a decimal.",
     "answer": {
      "type": "num",
      "value": "8.25",
      "form": "decimal"
     },
     "hint": "8 + 0.25.",
     "reveal": "8 + 0.25 = 8.25."
    }
   },
   {
    "say": "Now percent to decimal: ÷ 100.",
    "figure": {
     "type": "shift",
     "number": "8.25",
     "places": -2,
     "note": "÷ 100"
    },
    "ask": {
     "prompt": "8.25 ÷ 100 = ?",
     "answer": {
      "type": "num",
      "value": "0.0825",
      "form": "decimal"
     },
     "hint": "Two hops left.",
     "reveal": "[[m:8 1/4]]% = 0.0825.",
     "errors": [
      {
       "value": "0.825",
       "misconception": "pct-shift-one-place",
       "feedback": "That's one hop."
      }
     ]
    }
   }
  ]
 },
 {
  "id": "b016",
  "skill": "pct-dec",
  "kind": "short",
  "level": 3,
  "prompt": "Write the percent as a decimal.<br>[[m:12 1/2]]%",
  "answer": {
   "type": "num",
   "value": "0.125",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.12",
    "misconception": "frac-part-as-decimal",
    "feedback": "You dropped the ½. 12½% = 12.5%."
   },
   {
    "value": "1.25",
    "misconception": "pct-shift-one-place",
    "feedback": "That's one hop. ÷ 100 moves the point two places."
   }
  ],
  "hint": "½ = 0.5, so 12½% = 12.5%. Then ÷ 100.",
  "steps": [
   {
    "say": "Change the fraction part first.",
    "ask": {
     "prompt": "[[f:1/2]] as a decimal?",
     "answer": {
      "type": "num",
      "value": "0.5",
      "form": "decimal"
     },
     "hint": "1 ÷ 2.",
     "reveal": "[[f:1/2]] = 0.5, so [[m:12 1/2]]% = 12.5%."
    }
   },
   {
    "say": "Now divide by 100.",
    "ask": {
     "prompt": "12.5 ÷ 100 = ?",
     "answer": {
      "type": "num",
      "value": "0.125",
      "form": "decimal"
     },
     "hint": "Two hops left.",
     "reveal": "12.5% = 0.125.",
     "errors": [
      {
       "value": "1.25",
       "misconception": "pct-shift-one-place",
       "feedback": "One hop only."
      }
     ]
    }
   }
  ]
 },
 {
  "id": "b017",
  "skill": "pct-dec",
  "kind": "short",
  "level": 3,
  "prompt": "Write the decimal as a percent.<br>3.07",
  "answer": {
   "type": "num",
   "value": "307",
   "form": "percent"
  },
  "errors": [
   {
    "value": "30.7",
    "misconception": "pct-shift-one-place",
    "feedback": "×100 is two places right: 3.07 → 307."
   },
   {
    "value": "0.0307",
    "misconception": "pct-shift-wrong-way",
    "feedback": "That's moving LEFT. Decimal to percent moves right."
   }
  ],
  "hint": "Multiply by 100.",
  "steps": [
   {
    "say": "A decimal bigger than 1 is more than 100%.",
    "figure": {
     "type": "shift",
     "number": "3.07",
     "places": 2,
     "note": "× 100"
    },
    "ask": {
     "prompt": "3.07 × 100 = ?",
     "answer": {
      "type": "num",
      "value": "307",
      "form": "number"
     },
     "hint": "Two hops right.",
     "reveal": "3.07 × 100 = 307."
    },
    "why": {
     "prompt": "Why is the percent bigger than 100?",
     "choices": [
      "3.07 is more than one whole, and one whole is 100%",
      "Because we always add a zero",
      "Because 3.07 has three digits"
     ],
     "correct": 0,
     "feedback": [
      "Right: 1 = 100%, so 3.07 is over 300%.",
      "It is ×100, not 'add a zero'.",
      "Digits don't decide it; the value does."
     ]
    }
   },
   {
    "say": "Add the percent sign.",
    "ask": {
     "prompt": "3.07 = ___%",
     "answer": {
      "type": "num",
      "value": "307",
      "form": "percent"
     },
     "hint": "Same number.",
     "reveal": "3.07 = 307%."
    }
   }
  ]
 },
 {
  "id": "b018",
  "skill": "pct-dec",
  "kind": "short",
  "level": 2,
  "prompt": "Write the decimal as a percent.<br>0.009",
  "answer": {
   "type": "num",
   "value": "0.9",
   "form": "percent"
  },
  "errors": [
   {
    "value": "9",
    "misconception": "pct-shift-places",
    "feedback": "×100 is two hops right. 0.009 → 0.9. You hopped three times."
   },
   {
    "value": "0.09",
    "misconception": "pct-shift-one-place",
    "feedback": "That's only one hop."
   }
  ],
  "hint": "Multiply by 100: two places right.",
  "steps": [
   {
    "say": "Hop the point two places right.",
    "ask": {
     "prompt": "0.009 × 100 = ?",
     "answer": {
      "type": "num",
      "value": "0.9",
      "form": "number"
     },
     "hint": "Move the point right twice.",
     "reveal": "0.009 × 100 = 0.9."
    }
   },
   {
    "say": "Is the result more or less than 1%?",
    "ask": {
     "prompt": "0.009 is ___ than 1%.",
     "answer": {
      "type": "choice",
      "choices": [
       "less",
       "more"
      ],
      "correct": 0
     },
     "hint": "0.9 vs 1.",
     "reveal": "Less than 1%: it is 0.9%."
    }
   }
  ]
 },
 {
  "id": "b019",
  "skill": "frac-dec",
  "kind": "short",
  "level": 1,
  "prompt": "Write [[f:3/8]] as a decimal.",
  "answer": {
   "type": "num",
   "value": "0.375",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "2.(6)",
    "misconception": "bar-as-point",
    "feedback": "You divided 8 ÷ 3. A fraction means top ÷ bottom: 3 ÷ 8."
   },
   {
    "value": "0.38",
    "misconception": "rounded-as-exact",
    "feedback": "0.38 is a rounded copy. 3 ÷ 8 stops exactly at 0.375."
   }
  ],
  "hint": "Divide the numerator by the denominator.",
  "steps": [
   {
    "say": "The fraction bar means divide: top ÷ bottom.",
    "figure": {
     "type": "longdiv",
     "dividend": 3,
     "divisor": 8,
     "digits": 3
    },
    "ask": {
     "prompt": "Which division is [[f:3/8]]?",
     "answer": {
      "type": "choice",
      "choices": [
       "3 ÷ 8",
       "8 ÷ 3"
      ],
      "correct": 0
     },
     "hint": "Numerator ÷ denominator.",
     "reveal": "3 ÷ 8. Add zeros: 3.000 ÷ 8."
    }
   },
   {
    "say": "Do the division.",
    "ask": {
     "prompt": "3 ÷ 8 = ?",
     "answer": {
      "type": "num",
      "value": "0.375",
      "form": "decimal"
     },
     "hint": "8 goes into 30 three times (24), remainder 6...",
     "reveal": "3 ÷ 8 = 0.375."
    }
   }
  ]
 },
 {
  "id": "b020",
  "skill": "frac-dec",
  "kind": "short",
  "level": 1,
  "prompt": "Write [[f:7/20]] as a decimal.",
  "answer": {
   "type": "num",
   "value": "0.35",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "7.2",
    "misconception": "bar-as-point",
    "feedback": "A fraction bar isn't a decimal point. 7/20 is less than 1."
   },
   {
    "value": "0.035",
    "misconception": "pct-shift-places",
    "feedback": "[[f:7/20]] = 35/100 = 0.35 (hundredths = two places). You have one place too many."
   }
  ],
  "hint": "Make the denominator 100: what times 20 is 100?",
  "steps": [
   {
    "say": "Build an equivalent fraction with denominator 100.",
    "ask": {
     "prompt": "20 × ___ = 100",
     "answer": {
      "type": "num",
      "value": "5",
      "form": "number"
     },
     "hint": "100 ÷ 20.",
     "reveal": "20 × 5 = 100."
    }
   },
   {
    "say": "Do the same to the top.",
    "ask": {
     "prompt": "7 × 5 = ?",
     "answer": {
      "type": "num",
      "value": "35",
      "form": "number"
     },
     "hint": "Multiply top and bottom by 5.",
     "reveal": "7 × 5 = 35, so [[f:7/20]] = [[f:35/100]]."
    }
   },
   {
    "say": "35 hundredths.",
    "ask": {
     "prompt": "[[f:35/100]] as a decimal?",
     "answer": {
      "type": "num",
      "value": "0.35",
      "form": "decimal"
     },
     "hint": "Hundredths: two decimal places.",
     "reveal": "[[f:7/20]] = 0.35."
    }
   }
  ]
 },
 {
  "id": "b021",
  "skill": "frac-dec",
  "kind": "short",
  "level": 1,
  "prompt": "Write 0.45 as a fraction in simplest form.",
  "answer": {
   "type": "num",
   "value": "9/20",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "9/2",
    "misconception": "pct-shift-one-place",
    "feedback": "0.45 is 45 hundredths: 45/100, not 45/10."
   },
   {
    "value": "9/200",
    "misconception": "placeholder-zero",
    "feedback": "That is 0.045. 0.45 = 45/100 = 9/20."
   }
  ],
  "hint": "Read 0.45 aloud: 45 hundredths. Then simplify.",
  "steps": [
   {
    "say": "0.45 has two decimal places, so the denominator is 100.",
    "ask": {
     "prompt": "0.45 = ___/100",
     "answer": {
      "type": "num",
      "value": "45",
      "form": "number"
     },
     "hint": "Read the digits after the point.",
     "reveal": "0.45 = 45/100."
    }
   },
   {
    "say": "Simplify by the greatest common factor.",
    "ask": {
     "prompt": "What is the GCF of 45 and 100?",
     "answer": {
      "type": "num",
      "value": "5",
      "form": "number"
     },
     "hint": "Both end in 0 or 5; they share 5.",
     "reveal": "GCF is 5."
    }
   },
   {
    "say": "Divide top and bottom by 5.",
    "ask": {
     "prompt": "Simplest form of 45/100?",
     "answer": {
      "type": "num",
      "value": "9/20",
      "form": "fraction"
     },
     "hint": "45 ÷ 5 and 100 ÷ 5.",
     "reveal": "45/100 = 9/20."
    }
   }
  ]
 },
 {
  "id": "b022",
  "skill": "frac-dec",
  "kind": "short",
  "level": 2,
  "prompt": "Write 0.0825 as a fraction in simplest form.",
  "answer": {
   "type": "num",
   "value": "33/400",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "33/40",
    "misconception": "placeholder-zero",
    "feedback": "That's 0.825. The zero in 0.0825 is a placeholder: four decimal places means ten-thousandths."
   },
   {
    "value": "33/4000",
    "misconception": "placeholder-zero",
    "feedback": "That is 0.00825: one zero too many. 0.0825 = 825/10,000."
   }
  ],
  "hint": "Four decimal places means the denominator is 10,000.",
  "steps": [
   {
    "say": "0.0825 has four decimal places: ten-thousandths.",
    "ask": {
     "prompt": "0.0825 = ___/10000",
     "answer": {
      "type": "num",
      "value": "825",
      "form": "number"
     },
     "hint": "Drop the point and leading zero.",
     "reveal": "0.0825 = 825/10,000."
    }
   },
   {
    "say": "Simplify. Both numbers are divisible by 25.",
    "ask": {
     "prompt": "825 ÷ 25 = ?",
     "answer": {
      "type": "num",
      "value": "33",
      "form": "number"
     },
     "hint": "What times 25 makes 825? Try dividing 825 by 25.",
     "reveal": "825 ÷ 25 = 33."
    }
   },
   {
    "say": "10,000 ÷ 25 is the denominator.",
    "figure": {
     "type": "fdp",
     "f": "33/400",
     "d": "0.0825",
     "p": "8.25%",
     "focus": "f"
    },
    "ask": {
     "prompt": "Simplest form?",
     "answer": {
      "type": "num",
      "value": "33/400",
      "form": "fraction"
     },
     "hint": "Divide the bottom by the same number you used on the top.",
     "reveal": "33/400. 33 and 400 share no common factor."
    }
   }
  ]
 },
 {
  "id": "b023",
  "skill": "frac-dec",
  "kind": "short",
  "level": 2,
  "prompt": "Write [[f:5/9]] as a decimal. Use bar notation if it repeats.",
  "answer": {
   "type": "num",
   "value": "0.(5)",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.5",
    "misconception": "repeating-truncate",
    "feedback": "5 ÷ 9 doesn't stop. The 5 repeats forever: 0.5555…"
   },
   {
    "value": "0.55",
    "misconception": "repeating-truncate",
    "feedback": "Close, but it keeps going. Use the bar: 0.(5)."
   }
  ],
  "hint": "Divide 5 ÷ 9 and watch for a remainder that repeats.",
  "steps": [
   {
    "say": "Long division: 5 ÷ 9.",
    "figure": {
     "type": "longdiv",
     "dividend": 5,
     "divisor": 9,
     "digits": 4
    },
    "ask": {
     "prompt": "5.0 ÷ 9: what is the first digit after the point?",
     "answer": {
      "type": "num",
      "value": "5",
      "form": "number"
     },
     "hint": "50 ÷ 9 = 5 r 5.",
     "reveal": "50 ÷ 9 = 5 remainder 5."
    }
   },
   {
    "say": "The remainder is 5 again, so the same step repeats forever.",
    "ask": {
     "prompt": "5 ÷ 9 = ? (use the bar)",
     "answer": {
      "type": "num",
      "value": "0.(5)",
      "form": "decimal"
     },
     "hint": "The digit 5 repeats.",
     "reveal": "5 ÷ 9 = 0.5555… = [[r:0.(5)]].",
     "errors": [
      {
       "value": "0.5",
       "misconception": "repeating-truncate",
       "feedback": "Add the bar: it repeats."
      }
     ]
    }
   }
  ]
 },
 {
  "id": "b024",
  "skill": "frac-dec",
  "kind": "short",
  "level": 2,
  "prompt": "Write [[f:11/8]] as a decimal.",
  "answer": {
   "type": "num",
   "value": "1.375",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.(72)",
    "misconception": "bar-as-point",
    "feedback": "That's 8 ÷ 11. Do top ÷ bottom: 11 ÷ 8."
   },
   {
    "value": "1.38",
    "misconception": "rounded-as-exact",
    "feedback": "11 ÷ 8 stops exactly at 1.375. Don't round."
   }
  ],
  "hint": "11 ÷ 8: one whole and 3 left over.",
  "steps": [
   {
    "say": "An improper fraction is more than 1.",
    "ask": {
     "prompt": "How many whole 8s are in 11?",
     "answer": {
      "type": "num",
      "value": "1",
      "form": "number"
     },
     "hint": "8 × 1 = 8.",
     "reveal": "11 = 8 + 3, so [[m:1 3/8]]."
    }
   },
   {
    "say": "Now change [[f:3/8]] to a decimal.",
    "ask": {
     "prompt": "[[f:3/8]] as a decimal?",
     "answer": {
      "type": "num",
      "value": "0.375",
      "form": "decimal"
     },
     "hint": "3 ÷ 8.",
     "reveal": "[[f:3/8]] = 0.375."
    }
   },
   {
    "say": "Put it together.",
    "ask": {
     "prompt": "[[f:11/8]] = ?",
     "answer": {
      "type": "num",
      "value": "1.375",
      "form": "decimal"
     },
     "hint": "1 + 0.375.",
     "reveal": "[[f:11/8]] = 1.375."
    }
   }
  ]
 },
 {
  "id": "b025",
  "skill": "frac-dec",
  "kind": "short",
  "level": 3,
  "prompt": "Write 0.0016 as a fraction in simplest form.",
  "answer": {
   "type": "num",
   "value": "1/625",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "2/125",
    "misconception": "placeholder-zero",
    "feedback": "That's 0.016. 0.0016 has four decimal places: 16/10,000."
   },
   {
    "value": "1/6250",
    "misconception": "placeholder-zero",
    "feedback": "1/6250 = 0.00016, with one zero too many. 0.0016 = 16/10,000."
   }
  ],
  "hint": "0.0016 = 16 ten-thousandths. Simplify by 16.",
  "steps": [
   {
    "say": "Four decimal places: ten-thousandths.",
    "ask": {
     "prompt": "0.0016 = ___/10000",
     "answer": {
      "type": "num",
      "value": "16",
      "form": "number"
     },
     "hint": "Read the digits after the point; leading zeros do not count.",
     "reveal": "0.0016 = 16/10,000."
    }
   },
   {
    "say": "Both are divisible by 16.",
    "ask": {
     "prompt": "10000 ÷ 16 = ?",
     "answer": {
      "type": "num",
      "value": "625",
      "form": "number"
     },
     "hint": "Divide 10,000 by 16. Try halving four times.",
     "reveal": "10,000 ÷ 16 = 625."
    }
   },
   {
    "say": "So the answer is 1 over 625.",
    "ask": {
     "prompt": "Simplest form?",
     "answer": {
      "type": "num",
      "value": "1/625",
      "form": "fraction"
     },
     "hint": "16 ÷ 16 = 1.",
     "reveal": "[[f:1/625]]."
    }
   }
  ]
 },
 {
  "id": "b026",
  "skill": "frac-dec",
  "kind": "short",
  "level": 3,
  "prompt": "Write [[f:7/12]] as a decimal. Use bar notation.",
  "answer": {
   "type": "num",
   "value": "0.58(3)",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.58",
    "misconception": "repeating-truncate",
    "feedback": "7 ÷ 12 keeps going: 0.58333…"
   },
   {
    "value": "0.583",
    "misconception": "repeating-truncate",
    "feedback": "That's a rounded copy. The 3 repeats forever, so use the bar over the 3."
   },
   {
    "value": "0.(583)",
    "misconception": "bar-placement",
    "feedback": "Only the 3 repeats. The 5 and 8 stay put, outside the bar."
   }
  ],
  "hint": "Divide 7 by 12 until a remainder repeats.",
  "steps": [
   {
    "say": "7 ÷ 12 starts 0.58 with a remainder of 4. Keep dividing and watch the remainders.",
    "figure": {
     "type": "longdiv",
     "dividend": 7,
     "divisor": 12,
     "digits": 5
    },
    "ask": {
     "prompt": "Bring down a zero: 40 ÷ 12. What digit comes next, and does it repeat?",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number"
     },
     "hint": "Keep dividing: bring down a zero. Does the remainder change?",
     "reveal": "The 3 repeats forever, because the remainder 4 keeps coming back."
    }
   },
   {
    "say": "Put the bar over only the repeating digit.",
    "ask": {
     "prompt": "[[f:7/12]] = ? (use the bar)",
     "answer": {
      "type": "num",
      "value": "0.58(3)",
      "form": "decimal"
     },
     "hint": "Which digits stay in front of the bar, and which one repeats?",
     "reveal": "[[f:7/12]] = [[r:0.58(3)]].",
     "errors": [
      {
       "value": "0.(583)",
       "misconception": "bar-placement",
       "feedback": "Only the 3 gets the bar."
      }
     ]
    }
   }
  ]
 },
 {
  "id": "b027",
  "skill": "pct-frac",
  "kind": "short",
  "level": 1,
  "prompt": "Write the percent as a fraction or mixed number in simplest form.<br>40%",
  "figure": {
   "type": "grid",
   "shaded": 40
  },
  "answer": {
   "type": "num",
   "value": "2/5",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "1/25",
    "misconception": "pct-shift-one-place",
    "feedback": "That's 4%, not 40%. 40% = 40/100."
   },
   {
    "value": "4/5",
    "misconception": "pct-shift-one-place",
    "feedback": "40/100 simplifies to 2/5, not 4/5. Divide top and bottom by 20."
   }
  ],
  "hint": "Percent means out of 100. Put 40 over 100, then simplify.",
  "steps": [
   {
    "say": "Percent is a part-to-whole ratio where the whole is 100.",
    "ask": {
     "prompt": "40% = ___/100",
     "answer": {
      "type": "num",
      "value": "40",
      "form": "number"
     },
     "hint": "Write the numerator with no % sign.",
     "reveal": "40% = 40/100."
    }
   },
   {
    "say": "Simplify by the GCF.",
    "ask": {
     "prompt": "What is the GCF of 40 and 100?",
     "answer": {
      "type": "num",
      "value": "20",
      "form": "number"
     },
     "hint": "Find the biggest number that divides both 40 and 100.",
     "reveal": "GCF = 20."
    }
   },
   {
    "say": "Divide top and bottom by 20.",
    "ask": {
     "prompt": "Simplest form?",
     "answer": {
      "type": "num",
      "value": "2/5",
      "form": "fraction"
     },
     "hint": "40 ÷ 20 and 100 ÷ 20.",
     "reveal": "40/100 = 2/5."
    }
   }
  ]
 },
 {
  "id": "b028",
  "skill": "pct-frac",
  "kind": "short",
  "level": 1,
  "prompt": "Write the percent as a fraction or mixed number in simplest form.<br>175%",
  "figure": {
   "type": "grid",
   "shaded": 175,
   "grids": 2
  },
  "answer": {
   "type": "num",
   "value": "7/4",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "7/40",
    "misconception": "pct-shift-one-place",
    "feedback": "175% = 175/100, not 175/1000."
   },
   {
    "value": "3/4",
    "misconception": "missed-step",
    "feedback": "You dropped the whole. 175% is more than 100%, so the fraction is more than 1."
   }
  ],
  "hint": "175/100 simplifies. A percent over 100 gives a fraction over 1.",
  "steps": [
   {
    "say": "Put 175 over 100.",
    "ask": {
     "prompt": "Divide top and bottom by 25. 175 ÷ 25 = ?",
     "answer": {
      "type": "num",
      "value": "7",
      "form": "number"
     },
     "hint": "How many 25s fit into 175? Think of quarters.",
     "reveal": "175 ÷ 25 = 7."
    }
   },
   {
    "say": "Bottom too.",
    "ask": {
     "prompt": "100 ÷ 25 = ?",
     "answer": {
      "type": "num",
      "value": "4",
      "form": "number"
     },
     "hint": "Divide the bottom by the same 25.",
     "reveal": "[[f:175/100]] = [[f:7/4]]."
    }
   },
   {
    "say": "Write it as a mixed number.",
    "ask": {
     "prompt": "[[f:7/4]] as a mixed number?",
     "answer": {
      "type": "num",
      "value": "7/4",
      "form": "fraction"
     },
     "hint": "How many 4s in 7?",
     "reveal": "[[m:1 3/4]]."
    }
   }
  ]
 },
 {
  "id": "b029",
  "skill": "pct-frac",
  "kind": "short",
  "level": 2,
  "prompt": "Write the percent as a fraction or mixed number in simplest form.<br>[[f:2/5]]%",
  "answer": {
   "type": "num",
   "value": "1/250",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "2/5",
    "misconception": "pct-small-as-whole",
    "feedback": "The % still means ÷ 100. [[f:2/5]]% is 0.4%, much less than [[f:2/5]]."
   },
   {
    "value": "1/25",
    "misconception": "pct-shift-one-place",
    "feedback": "That's 4%. [[f:2/5]]% = 0.4% = 0.004."
   }
  ],
  "hint": "Change [[f:2/5]] to 0.4, so 0.4%; then to a decimal; then to a fraction.",
  "steps": [
   {
    "say": "First, [[f:2/5]] = 0.4. So the percent is 0.4%.",
    "ask": {
     "prompt": "0.4% as a decimal?",
     "answer": {
      "type": "num",
      "value": "0.004",
      "form": "decimal"
     },
     "hint": "÷ 100.",
     "reveal": "0.4% = 0.004."
    }
   },
   {
    "say": "Read 0.004 aloud.",
    "ask": {
     "prompt": "0.004 = ___/1000",
     "answer": {
      "type": "num",
      "value": "4",
      "form": "number"
     },
     "hint": "Three decimal places: thousandths.",
     "reveal": "0.004 = 4/1000."
    }
   },
   {
    "say": "Simplify.",
    "ask": {
     "prompt": "Simplest form of 4/1000?",
     "answer": {
      "type": "num",
      "value": "1/250",
      "form": "fraction"
     },
     "hint": "Divide by 4.",
     "reveal": "4/1000 = 1/250."
    }
   }
  ]
 },
 {
  "id": "b030",
  "skill": "pct-frac",
  "kind": "short",
  "level": 3,
  "prompt": "Write the percent as a fraction or mixed number in simplest form.<br>[[m:8 1/4]]%",
  "answer": {
   "type": "num",
   "value": "33/400",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "33/40",
    "misconception": "pct-shift-one-place",
    "feedback": "33/40 = 0.825 = 82.5%. Move the point two places: 8.25% = 0.0825."
   },
   {
    "value": "33/4",
    "misconception": "pct-small-as-whole",
    "feedback": "33/4 = 8.25. The % still means 'per 100', so divide by 100 as well."
   }
  ],
  "hint": "8¼% = 8.25% = 0.0825 = 825/10,000. Then simplify.",
  "steps": [
   {
    "say": "Write the percent as a decimal.",
    "ask": {
     "prompt": "[[m:8 1/4]]% = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.0825",
      "form": "decimal"
     },
     "hint": "8.25 ÷ 100.",
     "reveal": "0.0825.",
     "errors": [
      {
       "value": "0.825",
       "misconception": "pct-shift-one-place",
       "feedback": "One hop short."
      }
     ]
    }
   },
   {
    "say": "Now fraction: four decimal places.",
    "ask": {
     "prompt": "0.0825 = ___/10000",
     "answer": {
      "type": "num",
      "value": "825",
      "form": "number"
     },
     "hint": "Drop the point.",
     "reveal": "825/10,000."
    }
   },
   {
    "say": "Simplify by 25.",
    "figure": {
     "type": "fdp",
     "f": "33/400",
     "d": "0.0825",
     "p": "8.25%",
     "focus": "p"
    },
    "ask": {
     "prompt": "Simplest form?",
     "answer": {
      "type": "num",
      "value": "33/400",
      "form": "fraction"
     },
     "hint": "825 ÷ 25 = 33, 10000 ÷ 25 = 400.",
     "reveal": "[[f:33/400]]."
    }
   }
  ]
 },
 {
  "id": "b031",
  "skill": "pct-frac",
  "kind": "short",
  "level": 2,
  "prompt": "Write the fraction or mixed number as a percent.<br>[[f:3/8]]",
  "answer": {
   "type": "num",
   "value": "37.5",
   "form": "percent"
  },
  "errors": [
   {
    "value": "3.75",
    "misconception": "pct-shift-one-place",
    "feedback": "0.375 × 100 = 37.5, two hops right."
   },
   {
    "value": "0.375",
    "misconception": "pct-shift-places",
    "feedback": "That's the decimal. Multiply by 100 (two places right) to get the percent."
   }
  ],
  "hint": "Fraction to decimal (3 ÷ 8), then × 100.",
  "steps": [
   {
    "say": "Fraction to decimal first.",
    "ask": {
     "prompt": "[[f:3/8]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.375",
      "form": "decimal"
     },
     "hint": "3 ÷ 8.",
     "reveal": "0.375."
    }
   },
   {
    "say": "Then ×100.",
    "ask": {
     "prompt": "0.375 = ___%",
     "answer": {
      "type": "num",
      "value": "37.5",
      "form": "percent"
     },
     "hint": "Two hops right.",
     "reveal": "37.5%."
    }
   }
  ]
 },
 {
  "id": "b032",
  "skill": "pct-frac",
  "kind": "short",
  "level": 2,
  "prompt": "Write the fraction or mixed number as a percent. Use bar notation or a mixed-number percent.<br>[[f:7/9]]",
  "answer": {
   "type": "num",
   "value": "700/9",
   "form": "percent"
  },
  "errors": [
   {
    "value": "77.7",
    "misconception": "repeating-truncate",
    "feedback": "That's close but not exact. The 7 repeats forever: 77.(7)%."
   },
   {
    "value": "7.(7)",
    "misconception": "pct-shift-one-place",
    "feedback": "×100 is two hops right: 0.7777… → 77.77…"
   },
   {
    "value": "0.(7)",
    "misconception": "pct-shift-places",
    "feedback": "That's the decimal. Multiply by 100 (two places right) to get the percent."
   }
  ],
  "hint": "7 ÷ 9 = 0.777…; then ×100.",
  "steps": [
   {
    "say": "Divide 7 ÷ 9.",
    "figure": {
     "type": "longdiv",
     "dividend": 7,
     "divisor": 9,
     "digits": 4
    },
    "ask": {
     "prompt": "[[f:7/9]] = ? (use the bar)",
     "answer": {
      "type": "num",
      "value": "0.(7)",
      "form": "decimal"
     },
     "hint": "7 repeats.",
     "reveal": "0.777… = [[r:0.(7)]]."
    }
   },
   {
    "say": "Multiply by 100: hop two places right.",
    "ask": {
     "prompt": "0.(7) = ___% (bar notation)",
     "answer": {
      "type": "num",
      "value": "700/9",
      "form": "percent"
     },
     "hint": "77.77…",
     "reveal": "[[r:77.(7)]]% = 77 7/9 %."
    }
   }
  ]
 },
 {
  "id": "b033",
  "skill": "pct-frac",
  "kind": "short",
  "level": 2,
  "prompt": "Write the percent as a fraction or mixed number in simplest form.<br>0.5%",
  "answer": {
   "type": "num",
   "value": "1/200",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "1/2",
    "misconception": "pct-small-as-whole",
    "feedback": "0.5% is half of ONE percent, not half of a whole."
   },
   {
    "value": "1/20",
    "misconception": "pct-shift-one-place",
    "feedback": "That's 5%. 0.5% = 0.005."
   }
  ],
  "hint": "0.5% = 0.005. Read it as thousandths.",
  "steps": [
   {
    "say": "Percent to decimal.",
    "ask": {
     "prompt": "0.5% = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.005",
      "form": "decimal"
     },
     "hint": "÷ 100.",
     "reveal": "0.005."
    }
   },
   {
    "say": "Thousandths, then simplify.",
    "ask": {
     "prompt": "Simplest form of 5/1000?",
     "answer": {
      "type": "num",
      "value": "1/200",
      "form": "fraction"
     },
     "hint": "Divide by 5.",
     "reveal": "[[f:1/200]]."
    }
   }
  ]
 },
 {
  "id": "b034",
  "skill": "pct-frac",
  "kind": "short",
  "level": 3,
  "prompt": "Write the fraction or mixed number as a percent. Use bar notation or a mixed-number percent.<br>[[f:1/6]]",
  "answer": {
   "type": "num",
   "value": "50/3",
   "form": "percent"
  },
  "errors": [
   {
    "value": "16.6",
    "misconception": "repeating-truncate",
    "feedback": "16.6% isn't exact. It is 16.(6)%, or 16 2/3 %."
   },
   {
    "value": "16.(16)",
    "misconception": "bar-placement",
    "feedback": "Only the 6 repeats: 0.1(6) → 16.(6)%."
   }
  ],
  "hint": "1 ÷ 6 = 0.1(6). Multiply by 100.",
  "steps": [
   {
    "say": "Decimal first: only the 6 repeats.",
    "figure": {
     "type": "longdiv",
     "dividend": 1,
     "divisor": 6,
     "digits": 4
    },
    "ask": {
     "prompt": "[[f:1/6]] = ? (use the bar)",
     "answer": {
      "type": "num",
      "value": "0.1(6)",
      "form": "decimal"
     },
     "hint": "1 ÷ 6.",
     "reveal": "[[r:0.1(6)]]."
    }
   },
   {
    "say": "×100.",
    "ask": {
     "prompt": "0.1(6) = ___% (bar notation)",
     "answer": {
      "type": "num",
      "value": "50/3",
      "form": "percent"
     },
     "hint": "16.666…",
     "reveal": "[[r:16.(6)]]% = 16 2/3 %."
    }
   }
  ]
 },
 {
  "id": "b035",
  "skill": "pct-frac",
  "kind": "short",
  "level": 2,
  "prompt": "Write the percent as a fraction or mixed number in simplest form.<br>[[m:62 1/2]]%",
  "answer": {
   "type": "num",
   "value": "5/8",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "1/16",
    "misconception": "pct-shift-one-place",
    "feedback": "That's 6.25%. 62.5% is 62.5/100."
   },
   {
    "value": "31/50",
    "misconception": "frac-part-as-decimal",
    "feedback": "You dropped the ½. 62½% = 62.5%."
   }
  ],
  "hint": "62½% = 62.5% = 0.625 = 625/1000.",
  "steps": [
   {
    "say": "Decimal first.",
    "ask": {
     "prompt": "[[m:62 1/2]]% = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.625",
      "form": "decimal"
     },
     "hint": "62.5 ÷ 100.",
     "reveal": "0.625."
    }
   },
   {
    "say": "Then fraction in simplest form.",
    "ask": {
     "prompt": "0.625 = ?",
     "answer": {
      "type": "num",
      "value": "5/8",
      "form": "fraction"
     },
     "hint": "625/1000, divide by 125.",
     "reveal": "[[f:5/8]]."
    }
   }
  ]
 },
 {
  "id": "b036",
  "skill": "repeating",
  "kind": "short",
  "level": 1,
  "prompt": "Write [[f:2/3]] as a decimal. Use bar notation.",
  "answer": {
   "type": "num",
   "value": "0.(6)",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.6",
    "misconception": "repeating-truncate",
    "feedback": "2 ÷ 3 keeps going: 0.6666…"
   },
   {
    "value": "0.67",
    "misconception": "rounded-as-exact",
    "feedback": "0.67 is a rounded copy. Use the bar: 0.(6)."
   }
  ],
  "hint": "Divide 2 ÷ 3 and watch the remainder.",
  "steps": [
   {
    "say": "20 ÷ 3 = 6 remainder 2.",
    "figure": {
     "type": "longdiv",
     "dividend": 2,
     "divisor": 3,
     "digits": 4
    },
    "ask": {
     "prompt": "What is the remainder after the first digit?",
     "answer": {
      "type": "num",
      "value": "2",
      "form": "number"
     },
     "hint": "20 − 18.",
     "reveal": "Remainder 2: same as we started with."
    }
   },
   {
    "say": "The same step repeats forever.",
    "ask": {
     "prompt": "[[f:2/3]] = ? (use the bar)",
     "answer": {
      "type": "num",
      "value": "0.(6)",
      "form": "decimal"
     },
     "hint": "6 repeats.",
     "reveal": "[[r:0.(6)]]."
    }
   }
  ]
 },
 {
  "id": "b037",
  "skill": "repeating",
  "kind": "short",
  "level": 1,
  "prompt": "Write [[f:4/11]] as a decimal. Use bar notation.",
  "answer": {
   "type": "num",
   "value": "0.(36)",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.36",
    "misconception": "repeating-truncate",
    "feedback": "It keeps going: 0.363636…"
   },
   {
    "value": "0.3(6)",
    "misconception": "bar-placement",
    "feedback": "Both digits repeat: 3 and 6 together. 0.(36)."
   }
  ],
  "hint": "40 ÷ 11, then keep going until a remainder repeats.",
  "steps": [
   {
    "say": "40 ÷ 11 = 3 remainder 7.",
    "figure": {
     "type": "longdiv",
     "dividend": 4,
     "divisor": 11,
     "digits": 5
    },
    "ask": {
     "prompt": "70 ÷ 11 = ? (just the digit)",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "number"
     },
     "hint": "11 × 6 = 66.",
     "reveal": "6, remainder 4."
    }
   },
   {
    "say": "Now remainder 4 again, same as the start.",
    "ask": {
     "prompt": "Which digits repeat? (write the block, e.g. 12)",
     "answer": {
      "type": "num",
      "value": "36",
      "form": "number"
     },
     "hint": "Digits so far: 3 then 6.",
     "reveal": "36 repeats."
    }
   },
   {
    "say": "Bar over the block.",
    "ask": {
     "prompt": "[[f:4/11]] = ?",
     "answer": {
      "type": "num",
      "value": "0.(36)",
      "form": "decimal"
     },
     "hint": "0.363636…",
     "reveal": "[[r:0.(36)]]."
    }
   }
  ]
 },
 {
  "id": "b038",
  "skill": "repeating",
  "kind": "short",
  "level": 2,
  "prompt": "Write [[f:1/6]] as a decimal. Use bar notation.",
  "answer": {
   "type": "num",
   "value": "0.1(6)",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.(16)",
    "misconception": "bar-placement",
    "feedback": "The 1 doesn't repeat. Only the 6 does: 0.1666…"
   },
   {
    "value": "0.16",
    "misconception": "repeating-truncate",
    "feedback": "It doesn't stop: 0.1666…"
   },
   {
    "value": "0.17",
    "misconception": "rounded-as-exact",
    "feedback": "That's rounded. Use the bar: 0.1(6)."
   }
  ],
  "hint": "10 ÷ 6 = 1 r 4, then 40 ÷ 6 = 6 r 4, 4 again…",
  "steps": [
   {
    "say": "10 ÷ 6 = 1 remainder 4.",
    "figure": {
     "type": "longdiv",
     "dividend": 1,
     "divisor": 6,
     "digits": 5
    },
    "ask": {
     "prompt": "40 ÷ 6 = ? (digit)",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "number"
     },
     "hint": "6 × 6 = 36.",
     "reveal": "6, remainder 4 again."
    }
   },
   {
    "say": "The remainder 4 repeats, so only the 6 repeats.",
    "ask": {
     "prompt": "[[f:1/6]] = ? (bar over the repeating digit)",
     "answer": {
      "type": "num",
      "value": "0.1(6)",
      "form": "decimal"
     },
     "hint": "0.1 then 6s.",
     "reveal": "[[r:0.1(6)]]."
    }
   }
  ]
 },
 {
  "id": "b039",
  "skill": "repeating",
  "kind": "short",
  "level": 2,
  "prompt": "Which is the correct bar notation for 0.8333…?",
  "answer": {
   "type": "choice",
   "choices": [
    "[[r:0.(83)]]",
    "[[r:0.8(3)]]",
    "[[r:0.(8)3]]",
    "0.833"
   ],
   "correct": 1
  },
  "errors": [
   {
    "choice": 0,
    "misconception": "bar-placement",
    "feedback": "0.(83) would be 0.838383… The 8 appears only once."
   },
   {
    "choice": 3,
    "misconception": "repeating-truncate",
    "feedback": "0.833 stops. The 3 repeats forever, so it needs a bar."
   },
   {
    "choice": 2,
    "misconception": "bar-placement",
    "feedback": "The bar goes over the digits that repeat: here only the 3."
   }
  ],
  "hint": "Which digit(s) repeat forever?",
  "steps": [
   {
    "say": "Look at 0.8333…",
    "ask": {
     "prompt": "What single digit repeats forever?",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number"
     },
     "hint": "Look at the tail.",
     "reveal": "The 3."
    }
   },
   {
    "say": "Bar over just that digit.",
    "ask": {
     "prompt": "Write it with the bar.",
     "answer": {
      "type": "num",
      "value": "0.8(3)",
      "form": "decimal"
     },
     "hint": "Only the digit that repeats goes under the bar. The rest stay in front.",
     "reveal": "[[r:0.8(3)]] = [[f:5/6]]."
    }
   }
  ]
 },
 {
  "id": "b040",
  "skill": "repeating",
  "kind": "short",
  "level": 2,
  "prompt": "Write 0.(7) as a fraction. (Hint: 0.(1) = 1/9.)",
  "answer": {
   "type": "num",
   "value": "7/9",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "7/10",
    "misconception": "repeating-truncate",
    "feedback": "0.7 = 7/10 but 0.777… is more than that. Ninths are the pattern for a single repeating digit."
   },
   {
    "value": "7/99",
    "misconception": "bar-placement",
    "feedback": "99 is for two-digit repeats. One repeating digit → 9."
   }
  ],
  "hint": "x = 0.777…, so 10x = 7.777… Subtract.",
  "steps": [
   {
    "say": "Let x = 0.777… Then 10x = 7.777… Subtract the two.",
    "ask": {
     "prompt": "10x − x = ?",
     "answer": {
      "type": "num",
      "value": "7",
      "form": "number"
     },
     "hint": "The repeating tails cancel.",
     "reveal": "10x − x = 7.777… − 0.777… = 7."
    }
   },
   {
    "say": "So 9x = 7.",
    "ask": {
     "prompt": "x = ?",
     "answer": {
      "type": "num",
      "value": "7/9",
      "form": "fraction"
     },
     "hint": "Divide both sides by 9.",
     "reveal": "[[f:7/9]]."
    }
   }
  ]
 },
 {
  "id": "b041",
  "skill": "repeating",
  "kind": "short",
  "level": 3,
  "prompt": "Write 0.(27) as a fraction in simplest form.",
  "answer": {
   "type": "num",
   "value": "3/11",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "27/100",
    "misconception": "repeating-truncate",
    "feedback": "That's 0.27 exactly. 0.2727… is a little more."
   },
   {
    "value": "3/10",
    "misconception": "rounded-as-exact",
    "feedback": "3/10 = 0.3 exactly. 0.2727… is not 0.3; use 99 for a two-digit repeat."
   }
  ],
  "hint": "Two repeating digits: multiply by 100.",
  "steps": [
   {
    "say": "Let x = 0.2727… Then 100x = 27.2727…",
    "ask": {
     "prompt": "100x − x = ?",
     "answer": {
      "type": "num",
      "value": "27",
      "form": "number"
     },
     "hint": "Tails cancel.",
     "reveal": "27."
    }
   },
   {
    "say": "99x = 27.",
    "ask": {
     "prompt": "x = 27/99, simplest form?",
     "answer": {
      "type": "num",
      "value": "3/11",
      "form": "fraction"
     },
     "hint": "Both divisible by 9.",
     "reveal": "[[f:3/11]]."
    }
   }
  ]
 },
 {
  "id": "b042",
  "skill": "repeating",
  "kind": "short",
  "level": 3,
  "prompt": "Write [[r:0.1(6)]] as a fraction in simplest form.",
  "answer": {
   "type": "num",
   "value": "1/6",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "4/25",
    "misconception": "repeating-truncate",
    "feedback": "0.16 = 16/100 = 4/25, but 0.1666… is more than 0.16."
   },
   {
    "value": "16/99",
    "misconception": "bar-placement",
    "feedback": "16/99 = 0.(16). Here only the 6 repeats."
   }
  ],
  "hint": "100x − 10x lines up the repeating 6s.",
  "steps": [
   {
    "say": "x = 0.1666…, 10x = 1.666…, 100x = 16.666…",
    "ask": {
     "prompt": "100x − 10x = ?",
     "answer": {
      "type": "num",
      "value": "15",
      "form": "number"
     },
     "hint": "16.666… − 1.666…",
     "reveal": "15."
    }
   },
   {
    "say": "90x = 15.",
    "ask": {
     "prompt": "x = 15/90, simplest form?",
     "answer": {
      "type": "num",
      "value": "1/6",
      "form": "fraction"
     },
     "hint": "Divide by 15.",
     "reveal": "[[f:1/6]]."
    }
   }
  ]
 },
 {
  "id": "b043",
  "skill": "repeating",
  "kind": "short",
  "level": 3,
  "prompt": "Which is greater?<br>[[r:0.(45)]] &nbsp;or&nbsp; 0.45",
  "answer": {
   "type": "choice",
   "choices": [
    "[[r:0.(45)]]",
    "0.45",
    "They are equal"
   ],
   "correct": 0
  },
  "errors": [
   {
    "choice": 1,
    "misconception": "repeating-truncate",
    "feedback": "0.(45) = 0.454545… which is a bit MORE than 0.450000…"
   },
   {
    "choice": 2,
    "misconception": "rounded-as-exact",
    "feedback": "They look alike but 0.4545… > 0.4500."
   }
  ],
  "hint": "Write 0.(45) out a few more digits and line it up with 0.45000.",
  "steps": [
   {
    "say": "0.(45) = 0.45454545… Compare with 0.45000000…",
    "ask": {
     "prompt": "The first place they differ is the…",
     "answer": {
      "type": "choice",
      "choices": [
       "tenths",
       "hundredths",
       "thousandths"
      ],
      "correct": 2
     },
     "hint": "0.454 vs 0.450",
     "reveal": "Thousandths: 4 vs 0."
    }
   },
   {
    "say": "4 > 0.",
    "ask": {
     "prompt": "Which is greater?",
     "answer": {
      "type": "choice",
      "choices": [
       "[[r:0.(45)]]",
       "0.45"
      ],
      "correct": 0
     },
     "hint": "Bigger digit wins at the first difference.",
     "reveal": "[[r:0.(45)]] is greater."
    }
   }
  ]
 },
 {
  "id": "b044",
  "skill": "compare-mixed",
  "kind": "short",
  "level": 1,
  "prompt": "Tell which number is greater.<br>[[f:3/4]] &nbsp;or&nbsp; 0.7",
  "answer": {
   "type": "choice",
   "choices": [
    "[[f:3/4]]",
    "0.7",
    "They are equal"
   ],
   "correct": 0
  },
  "errors": [
   {
    "choice": 1,
    "misconception": "bar-as-point",
    "feedback": "[[f:3/4]] is 3 ÷ 4 = 0.75, not 0.34."
   },
   {
    "choice": 2,
    "misconception": "repeating-truncate",
    "feedback": "You cut 0.75 off at 0.7. [[f:3/4]] = 0.75, which is greater than 0.70."
   }
  ],
  "hint": "Change [[f:3/4]] to a decimal.",
  "steps": [
   {
    "say": "Turn the fraction into a decimal.",
    "ask": {
     "prompt": "[[f:3/4]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.75",
      "form": "decimal"
     },
     "hint": "3 ÷ 4.",
     "reveal": "0.75."
    }
   },
   {
    "say": "Compare 0.75 and 0.70.",
    "ask": {
     "prompt": "Which is greater?",
     "answer": {
      "type": "choice",
      "choices": [
       "0.75",
       "0.7"
      ],
      "correct": 0
     },
     "hint": "Hundredths: 5 vs 0.",
     "reveal": "0.75 > 0.7, so [[f:3/4]] is greater."
    }
   }
  ]
 },
 {
  "id": "b045",
  "skill": "compare-mixed",
  "kind": "short",
  "level": 1,
  "prompt": "Order the numbers from least to greatest.",
  "answer": {
   "type": "order",
   "items": [
    "0.45",
    "[[f:1/2]]",
    "48%"
   ],
   "correct": [
    0,
    2,
    1
   ]
  },
  "errors": [
   {
    "order": [
     0,
     1,
     2
    ],
    "misconception": "pct-shift-wrong-way",
    "feedback": "48% is 0.48, not 48. Put everything in the same form (decimals) first."
   },
   {
    "order": [
     1,
     0,
     2
    ],
    "misconception": "bar-as-point",
    "feedback": "[[f:1/2]] = 1 ÷ 2 = 0.5, not 0.2."
   }
  ],
  "hint": "Change everything to decimals.",
  "steps": [
   {
    "say": "Fractions and percents can both become decimals.",
    "ask": {
     "prompt": "[[f:1/2]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.5",
      "form": "decimal"
     },
     "hint": "1 ÷ 2.",
     "reveal": "0.5."
    }
   },
   {
    "say": "Percent to decimal.",
    "ask": {
     "prompt": "48% = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.48",
      "form": "decimal"
     },
     "hint": "÷ 100.",
     "reveal": "0.48."
    }
   },
   {
    "say": "Order 0.45, 0.5, 0.48.",
    "ask": {
     "prompt": "Order these from least to greatest.",
     "answer": {
      "type": "order",
      "items": [
       "0.45",
       "0.5",
       "0.48"
      ],
      "correct": [
       0,
       2,
       1
      ]
     },
     "hint": "0.50 vs 0.48.",
     "reveal": "0.45 < 0.48 < 0.5, so 0.45, 48%, 1/2."
    }
   }
  ]
 },
 {
  "id": "b046",
  "skill": "compare-mixed",
  "kind": "short",
  "level": 2,
  "prompt": "Order the numbers from least to greatest.",
  "answer": {
   "type": "order",
   "items": [
    "[[f:5/8]]",
    "0.6",
    "62%"
   ],
   "correct": [
    1,
    2,
    0
   ]
  },
  "errors": [
   {
    "order": [
     0,
     1,
     2
    ],
    "misconception": "bar-as-point",
    "feedback": "[[f:5/8]] = 5 ÷ 8 = 0.625, not 0.58."
   },
   {
    "order": [
     1,
     0,
     2
    ],
    "misconception": "pct-shift-wrong-way",
    "feedback": "62% is 0.62, not 62. Change everything to decimals first."
   }
  ],
  "hint": "Decimals: 5 ÷ 8, 0.6, and 62 ÷ 100.",
  "steps": [
   {
    "say": "Fraction to decimal.",
    "ask": {
     "prompt": "[[f:5/8]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.625",
      "form": "decimal"
     },
     "hint": "5 ÷ 8.",
     "reveal": "0.625."
    }
   },
   {
    "say": "Percent to decimal.",
    "ask": {
     "prompt": "62% = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.62",
      "form": "decimal"
     },
     "hint": "÷ 100.",
     "reveal": "0.62."
    }
   },
   {
    "say": "Compare 0.625, 0.600, 0.620.",
    "ask": {
     "prompt": "Order these from least to greatest.",
     "answer": {
      "type": "order",
      "items": [
       "0.625",
       "0.6",
       "0.62"
      ],
      "correct": [
       1,
       2,
       0
      ]
     },
     "hint": "Use thousandths.",
     "reveal": "0.6 < 0.62 < 0.625."
    }
   }
  ]
 },
 {
  "id": "b047",
  "skill": "compare-mixed",
  "kind": "short",
  "level": 2,
  "prompt": "Tell which number is greater.<br>[[f:1/3]] &nbsp;or&nbsp; 0.33",
  "answer": {
   "type": "choice",
   "choices": [
    "[[f:1/3]]",
    "0.33",
    "They are equal"
   ],
   "correct": 0
  },
  "errors": [
   {
    "choice": 2,
    "misconception": "rounded-as-exact",
    "feedback": "0.33 is only an approximation of [[f:1/3]] = 0.333… They are not equal."
   },
   {
    "choice": 1,
    "misconception": "repeating-truncate",
    "feedback": "[[f:1/3]] = 0.3333… (not 0.3). It is more than 0.33."
   }
  ],
  "hint": "Write [[f:1/3]] as a repeating decimal and line it up with 0.3300…",
  "steps": [
   {
    "say": "1 ÷ 3.",
    "ask": {
     "prompt": "[[f:1/3]] = ? (bar)",
     "answer": {
      "type": "num",
      "value": "0.(3)",
      "form": "decimal"
     },
     "hint": "3 repeats.",
     "reveal": "[[r:0.(3)]]."
    }
   },
   {
    "say": "0.3333… vs 0.3300…",
    "ask": {
     "prompt": "Which is greater?",
     "answer": {
      "type": "choice",
      "choices": [
       "[[f:1/3]]",
       "0.33"
      ],
      "correct": 0
     },
     "hint": "Thousandths: 3 vs 0.",
     "reveal": "[[f:1/3]] is greater."
    }
   }
  ]
 },
 {
  "id": "b048",
  "skill": "compare-mixed",
  "kind": "short",
  "level": 3,
  "prompt": "Order the numbers from least to greatest.",
  "answer": {
   "type": "order",
   "items": [
    "[[f:7/9]]",
    "0.78",
    "77.7%",
    "0.77"
   ],
   "correct": [
    3,
    2,
    0,
    1
   ]
  },
  "errors": [
   {
    "order": [
     3,
     0,
     2,
     1
    ],
    "misconception": "repeating-truncate",
    "feedback": "[[f:7/9]] = 0.7777…, NOT 0.77. It is bigger than 77.7% = 0.777."
   },
   {
    "order": [
     2,
     3,
     0,
     1
    ],
    "misconception": "pct-shift-places",
    "feedback": "77.7% = 0.777 (two places left), not 0.0777."
   }
  ],
  "hint": "Everything to decimals, line up to four places.",
  "steps": [
   {
    "say": "Fraction: 7 ÷ 9.",
    "ask": {
     "prompt": "Write [[f:7/9]] as a decimal rounded to 4 decimal places.",
     "answer": {
      "type": "num",
      "value": "0.7778",
      "form": "decimal",
      "round": 4
     },
     "hint": "7 ÷ 9 = 0.7777…; look at the next digit before you round.",
     "reveal": "0.77777… rounds to 0.7778."
    }
   },
   {
    "say": "Percent: 77.7%.",
    "ask": {
     "prompt": "77.7% = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.777",
      "form": "decimal"
     },
     "hint": "÷ 100.",
     "reveal": "0.777."
    }
   },
   {
    "say": "Decimals: 0.7777…, 0.78, 0.777, 0.77.",
    "ask": {
     "prompt": "Order these from least to greatest.",
     "answer": {
      "type": "order",
      "items": [
       "0.7778",
       "0.78",
       "0.777",
       "0.77"
      ],
      "correct": [
       3,
       2,
       0,
       1
      ]
     },
     "hint": "Compare thousandths and beyond.",
     "reveal": "0.77 < 0.777 < 0.7777… < 0.78."
    }
   }
  ]
 },
 {
  "id": "b049",
  "skill": "compare-mixed",
  "kind": "short",
  "level": 2,
  "prompt": "Which number is greatest?",
  "answer": {
   "type": "choice",
   "choices": [
    "[[f:3/5]]",
    "0.59",
    "61%",
    "[[f:5/8]]"
   ],
   "correct": 3
  },
  "errors": [
   {
    "choice": 0,
    "misconception": "shorter-larger",
    "feedback": "[[f:3/5]] = 0.60, which is less than 0.61 and 0.625."
   },
   {
    "choice": 2,
    "misconception": "bar-as-point",
    "feedback": "61% = 0.61, but [[f:5/8]] = 5 ÷ 8 = 0.625, not 0.58."
   },
   {
    "choice": 1,
    "misconception": "longer-larger",
    "feedback": "0.59 is less than 0.60, which is less than 0.625."
   }
  ],
  "hint": "Everything to decimals.",
  "steps": [
   {
    "say": "Fraction to decimal.",
    "ask": {
     "prompt": "[[f:5/8]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.625",
      "form": "decimal"
     },
     "hint": "5 ÷ 8.",
     "reveal": "0.625."
    }
   },
   {
    "say": "Percent and the other fraction.",
    "ask": {
     "prompt": "[[f:3/5]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.6",
      "form": "decimal"
     },
     "hint": "3 ÷ 5.",
     "reveal": "0.6."
    }
   },
   {
    "say": "Compare 0.6, 0.59, 0.61, 0.625.",
    "ask": {
     "prompt": "Which is greatest?",
     "answer": {
      "type": "choice",
      "choices": [
       "0.6",
       "0.59",
       "0.61",
       "0.625"
      ],
      "correct": 3
     },
     "hint": "Use thousandths.",
     "reveal": "0.625 = [[f:5/8]]."
    }
   }
  ]
 },
 {
  "id": "b050",
  "skill": "compare-mixed",
  "kind": "short",
  "level": 3,
  "prompt": "Order the numbers from least to greatest.",
  "answer": {
   "type": "order",
   "items": [
    "0.8%",
    "[[f:1/80]]",
    "0.1",
    "8%"
   ],
   "correct": [
    0,
    1,
    3,
    2
   ]
  },
  "errors": [
   {
    "order": [
     1,
     3,
     2,
     0
    ],
    "misconception": "pct-small-as-whole",
    "feedback": "0.8% is 0.008, not 0.8."
   },
   {
    "order": [
     0,
     3,
     2,
     1
    ],
    "misconception": "placeholder-zero",
    "feedback": "[[f:1/80]] is 1 ÷ 80 = 0.0125, not 1 ÷ 8."
   }
  ],
  "hint": "Decimals: 0.8% = 0.008; 1/80 = 0.0125; 8% = 0.08.",
  "steps": [
   {
    "say": "Percent to decimal.",
    "ask": {
     "prompt": "0.8% = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.008",
      "form": "decimal"
     },
     "hint": "÷ 100.",
     "reveal": "0.008."
    }
   },
   {
    "say": "Fraction to decimal.",
    "ask": {
     "prompt": "[[f:1/80]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.0125",
      "form": "decimal"
     },
     "hint": "1 ÷ 80.",
     "reveal": "0.0125."
    }
   },
   {
    "say": "0.008, 0.0125, 0.1, 0.08.",
    "ask": {
     "prompt": "Order these from least to greatest.",
     "answer": {
      "type": "order",
      "items": [
       "0.008",
       "0.0125",
       "0.1",
       "0.08"
      ],
      "correct": [
       0,
       1,
       3,
       2
      ]
     },
     "hint": "Four decimal places.",
     "reveal": "0.008 < 0.0125 < 0.08 < 0.1."
    }
   }
  ]
 },
 {
  "id": "b051",
  "skill": "compare-mixed",
  "kind": "short",
  "level": 2,
  "prompt": "Kai got 5 hits in 16 at-bats. Noah's batting average is 0.310. Eli's is 0.315. Whose average is the greatest?",
  "answer": {
   "type": "choice",
   "choices": [
    "Kai ([[f:5/16]])",
    "Noah (0.310)",
    "Eli (0.315)"
   ],
   "correct": 2
  },
  "errors": [
   {
    "choice": 0,
    "misconception": "bar-as-point",
    "feedback": "[[f:5/16]] = 5 ÷ 16 = 0.3125, not 0.516."
   },
   {
    "choice": 1,
    "misconception": "longer-larger",
    "feedback": "0.310 and 0.315 have the same number of digits. 0.315 is greater."
   }
  ],
  "hint": "Write Kai's average as a decimal.",
  "steps": [
   {
    "say": "Fraction to decimal.",
    "ask": {
     "prompt": "[[f:5/16]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.3125",
      "form": "decimal"
     },
     "hint": "5 ÷ 16.",
     "reveal": "0.3125."
    }
   },
   {
    "say": "Compare 0.3125, 0.310, 0.315.",
    "ask": {
     "prompt": "Order these from least to greatest.",
     "answer": {
      "type": "order",
      "items": [
       "0.3125",
       "0.310",
       "0.315"
      ],
      "correct": [
       1,
       0,
       2
      ]
     },
     "hint": "Thousandths.",
     "reveal": "0.310 < 0.3125 < 0.315. Eli is greatest."
    }
   }
  ]
 },
 {
  "id": "b052",
  "skill": "pct-frac",
  "kind": "short",
  "level": 3,
  "prompt": "Write the fraction or mixed number as a percent.<br>[[m:7 7/8]]",
  "figure": {
   "type": "fdp",
   "f": "63/8",
   "d": "7.875",
   "p": "787.5%",
   "focus": "d"
  },
  "answer": {
   "type": "num",
   "value": "787.5",
   "form": "percent"
  },
  "errors": [
   {
    "value": "78.75",
    "misconception": "pct-shift-one-place",
    "feedback": "7.875 × 100 = 787.5. That's one hop short."
   },
   {
    "value": "7.875",
    "misconception": "pct-shift-places",
    "feedback": "That's the decimal. Hop the point two places right to make a percent."
   }
  ],
  "hint": "Change [[f:7/8]] to a decimal, put the 7 in front, then multiply by 100.",
  "steps": [
   {
    "say": "Keep the whole number. Change only the fraction part to a decimal.",
    "ask": {
     "prompt": "[[f:7/8]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.875",
      "form": "decimal"
     },
     "hint": "7 ÷ 8.",
     "reveal": "[[f:7/8]] = 0.875."
    }
   },
   {
    "say": "Put the whole number back.",
    "ask": {
     "prompt": "[[m:7 7/8]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "7.875",
      "form": "decimal"
     },
     "hint": "7 + 0.875.",
     "reveal": "7 + 0.875 = 7.875."
    }
   },
   {
    "say": "Decimal to percent: ×100.",
    "figure": {
     "type": "shift",
     "number": "7.875",
     "places": 2,
     "note": "× 100"
    },
    "ask": {
     "prompt": "7.875 = ___%",
     "answer": {
      "type": "num",
      "value": "787.5",
      "form": "percent"
     },
     "hint": "Two hops right.",
     "reveal": "787.5%. It is over 100% because it is more than 1 whole."
    }
   }
  ]
 },
 {
  "id": "b053",
  "skill": "pct-frac",
  "kind": "short",
  "level": 2,
  "prompt": "Write the fraction or mixed number as a percent.<br>[[f:7/5]]",
  "answer": {
   "type": "num",
   "value": "140",
   "form": "percent"
  },
  "errors": [
   {
    "value": "14",
    "misconception": "pct-shift-places",
    "feedback": "[[f:7/5]] = 1.4, and 1.4 × 100 = 140. You hopped one place too few."
   },
   {
    "value": "1.4",
    "misconception": "pct-shift-places",
    "feedback": "That's the decimal. × 100 gives the percent."
   }
  ],
  "hint": "7 ÷ 5 first. Is the answer more or less than 1?",
  "steps": [
   {
    "say": "Improper fraction: top is bigger than bottom.",
    "ask": {
     "prompt": "[[f:7/5]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "1.4",
      "form": "decimal"
     },
     "hint": "7 ÷ 5.",
     "reveal": "1.4."
    }
   },
   {
    "say": "Now to a percent.",
    "figure": {
     "type": "grid",
     "shaded": 140,
     "grids": 2
    },
    "ask": {
     "prompt": "1.4 = ___%",
     "answer": {
      "type": "num",
      "value": "140",
      "form": "percent"
     },
     "hint": "× 100.",
     "reveal": "140%."
    }
   }
  ]
 },
 {
  "id": "b054",
  "skill": "pct-frac",
  "kind": "short",
  "level": 2,
  "prompt": "Write the fraction or mixed number as a percent.<br>[[m:1 2/100]]",
  "answer": {
   "type": "num",
   "value": "102",
   "form": "percent"
  },
  "errors": [
   {
    "value": "2",
    "misconception": "missed-step",
    "feedback": "You dropped the whole number 1. [[m:1 2/100]] is a little more than 1, so a little more than 100%."
   },
   {
    "value": "1.02",
    "misconception": "pct-shift-places",
    "feedback": "That's the decimal. × 100 for the percent."
   },
   {
    "value": "10.2",
    "misconception": "pct-shift-places",
    "feedback": "1.02 × 100 = 102. Hop two places, not one."
   }
  ],
  "hint": "2/100 is two hundredths. Write it as 0.02, then add the whole number.",
  "steps": [
   {
    "say": "Two hundredths is a decimal with two places.",
    "ask": {
     "prompt": "[[f:2/100]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.02",
      "form": "decimal"
     },
     "hint": "Hundredths: two decimal places.",
     "reveal": "0.02."
    }
   },
   {
    "say": "Add the whole number.",
    "ask": {
     "prompt": "[[m:1 2/100]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "1.02",
      "form": "decimal"
     },
     "hint": "1 + 0.02.",
     "reveal": "1.02."
    }
   },
   {
    "say": "Percent.",
    "ask": {
     "prompt": "1.02 = ___%",
     "answer": {
      "type": "num",
      "value": "102",
      "form": "percent"
     },
     "hint": "× 100.",
     "reveal": "102%."
    }
   }
  ]
 },
 {
  "id": "b055",
  "skill": "pct-frac",
  "kind": "short",
  "level": 3,
  "prompt": "Write the fraction or mixed number as a percent.<br>[[m:6 125/1000]]",
  "answer": {
   "type": "num",
   "value": "612.5",
   "form": "percent"
  },
  "errors": [
   {
    "value": "61.25",
    "misconception": "pct-shift-one-place",
    "feedback": "6.125 × 100 = 612.5. That's one hop short."
   },
   {
    "value": "6125",
    "misconception": "pct-shift-places",
    "feedback": "You moved the point three places. × 100 is two."
   },
   {
    "value": "6.125",
    "misconception": "pct-shift-places",
    "feedback": "That's the decimal. × 100 gives the percent."
   }
  ],
  "hint": "125/1000 is a decimal with three places. Simplify it too: 6 125/1000 = 6 1/8.",
  "steps": [
   {
    "say": "The fraction part is 125 thousandths.",
    "ask": {
     "prompt": "[[f:125/1000]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.125",
      "form": "decimal"
     },
     "hint": "Thousandths: three decimal places.",
     "reveal": "0.125."
    }
   },
   {
    "say": "Put the 6 back. (Also [[f:125/1000]] = [[f:1/8]], so this is [[m:6 1/8]].)",
    "ask": {
     "prompt": "[[m:6 125/1000]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "6.125",
      "form": "decimal"
     },
     "hint": "6 + 0.125.",
     "reveal": "6.125."
    }
   },
   {
    "say": "Percent.",
    "ask": {
     "prompt": "6.125 = ___%",
     "answer": {
      "type": "num",
      "value": "612.5",
      "form": "percent"
     },
     "hint": "× 100.",
     "reveal": "612.5%."
    }
   }
  ]
 },
 {
  "id": "b056",
  "skill": "pct-frac",
  "kind": "short",
  "level": 1,
  "prompt": "Write the fraction or mixed number as a percent.<br>[[f:1/8]]",
  "answer": {
   "type": "num",
   "value": "12.5",
   "form": "percent"
  },
  "errors": [
   {
    "value": "1.25",
    "misconception": "pct-shift-one-place",
    "feedback": "0.125 × 100 = 12.5. One hop short."
   },
   {
    "value": "125",
    "misconception": "pct-shift-places",
    "feedback": "[[f:1/8]] = 0.125, and 0.125 × 100 = 12.5. Watch the decimal point."
   }
  ],
  "hint": "1 ÷ 8, then × 100. (Anchor: [[f:1/4]] = 25%, so [[f:1/8]] is half of that.)",
  "steps": [
   {
    "say": "Use an anchor: [[f:1/4]] = 25%. An eighth is half of a quarter.",
    "ask": {
     "prompt": "Half of 25% = ___%",
     "answer": {
      "type": "num",
      "value": "12.5",
      "form": "percent"
     },
     "hint": "25 ÷ 2.",
     "reveal": "12.5%."
    }
   },
   {
    "say": "Check with a decimal.",
    "ask": {
     "prompt": "[[f:1/8]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.125",
      "form": "decimal"
     },
     "hint": "1 ÷ 8.",
     "reveal": "0.125 = 12.5%."
    }
   }
  ]
 },
 {
  "id": "b057",
  "skill": "pct-frac",
  "kind": "short",
  "level": 1,
  "prompt": "Write the fraction or mixed number as a percent.<br>[[f:3/5]]",
  "answer": {
   "type": "num",
   "value": "60",
   "form": "percent"
  },
  "errors": [
   {
    "value": "0.6",
    "misconception": "pct-shift-places",
    "feedback": "That's the decimal. × 100 gives the percent."
   },
   {
    "value": "6",
    "misconception": "pct-shift-one-place",
    "feedback": "0.6 × 100 = 60: two hops right, not one."
   }
  ],
  "hint": "Anchor: [[f:1/5]] = 20%.",
  "steps": [
   {
    "say": "One fifth is 20%.",
    "ask": {
     "prompt": "[[f:3/5]] is three fifths: 3 × 20% = ___%",
     "answer": {
      "type": "num",
      "value": "60",
      "form": "percent"
     },
     "hint": "3 × 20.",
     "reveal": "60%."
    }
   },
   {
    "say": "Check with the decimal.",
    "ask": {
     "prompt": "[[f:3/5]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.6",
      "form": "decimal"
     },
     "hint": "3 ÷ 5.",
     "reveal": "0.6 = 60%."
    }
   }
  ]
 },
 {
  "id": "b058",
  "skill": "frac-dec",
  "kind": "short",
  "level": 2,
  "prompt": "Write [[m:6 125/1000]] as a mixed number in simplest form.",
  "answer": {
   "type": "num",
   "value": "49/8",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "481/80",
    "misconception": "placeholder-zero",
    "feedback": "That is 6 1/80. 125/1000 simplifies to 1/8, not 1/80."
   },
   {
    "value": "53/8",
    "misconception": "missed-step",
    "feedback": "That is 6 5/8. 125/1000 = 1/8 (divide top and bottom by 125)."
   }
  ],
  "hint": "Simplify only the fraction part: GCF of 125 and 1000.",
  "steps": [
   {
    "say": "The whole number stays. Simplify [[f:125/1000]].",
    "ask": {
     "prompt": "What is the GCF of 125 and 1000?",
     "answer": {
      "type": "num",
      "value": "125",
      "form": "number"
     },
     "hint": "Does the top number divide the bottom number evenly? Try it.",
     "reveal": "125."
    }
   },
   {
    "say": "Divide top and bottom by 125.",
    "ask": {
     "prompt": "[[f:125/1000]] in simplest form?",
     "answer": {
      "type": "num",
      "value": "1/8",
      "form": "fraction"
     },
     "hint": "125 ÷ 125 and 1000 ÷ 125.",
     "reveal": "[[f:1/8]], so the number is [[m:6 1/8]]."
    }
   }
  ]
 },
 {
  "id": "b059",
  "skill": "frac-dec",
  "kind": "short",
  "level": 2,
  "prompt": "Write [[m:7 7/8]] as a decimal.",
  "answer": {
   "type": "num",
   "value": "7.875",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "7.78",
    "misconception": "bar-as-point",
    "feedback": "[[f:7/8]] = 7 ÷ 8 = 0.875, not 0.78."
   },
   {
    "value": "0.875",
    "misconception": "missed-step",
    "feedback": "You dropped the whole number 7."
   }
  ],
  "hint": "Keep the 7; change [[f:7/8]] to a decimal.",
  "steps": [
   {
    "say": "The fraction part.",
    "ask": {
     "prompt": "[[f:7/8]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.875",
      "form": "decimal"
     },
     "hint": "7 ÷ 8.",
     "reveal": "0.875."
    }
   },
   {
    "say": "Add the whole number.",
    "ask": {
     "prompt": "7 + 0.875 = ?",
     "answer": {
      "type": "num",
      "value": "7.875",
      "form": "decimal"
     },
     "hint": "Add.",
     "reveal": "7.875."
    }
   }
  ]
 },
 {
  "id": "b060",
  "skill": "pct-dec",
  "kind": "short",
  "level": 3,
  "prompt": "Write the percent as a decimal.<br>787.5%",
  "answer": {
   "type": "num",
   "value": "7.875",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "78.75",
    "misconception": "pct-shift-one-place",
    "feedback": "÷ 100 is two hops left."
   },
   {
    "value": "0.7875",
    "misconception": "pct-shift-places",
    "feedback": "You hopped three places. 787.5 ÷ 100 = 7.875."
   }
  ],
  "hint": "Divide by 100: two places left.",
  "steps": [
   {
    "say": "A percent over 100 is more than one whole.",
    "ask": {
     "prompt": "Is 787.5% more than 7 wholes?",
     "answer": {
      "type": "choice",
      "choices": [
       "Yes",
       "No"
      ],
      "correct": 0
     },
     "hint": "100% = 1 whole, so 700% = 7 wholes.",
     "reveal": "Yes: 787.5% > 700%."
    }
   },
   {
    "say": "Divide.",
    "figure": {
     "type": "shift",
     "number": "787.5",
     "places": -2,
     "note": "÷ 100"
    },
    "ask": {
     "prompt": "787.5 ÷ 100 = ?",
     "answer": {
      "type": "num",
      "value": "7.875",
      "form": "decimal"
     },
     "hint": "Two hops left.",
     "reveal": "7.875."
    }
   }
  ]
 },
 {
  "id": "b061",
  "skill": "repeating",
  "kind": "short",
  "level": 1,
  "prompt": "What kind of decimal is 0.35?",
  "answer": {
   "type": "choice",
   "choices": [
    "terminating",
    "repeating",
    "non-terminating, non-repeating"
   ],
   "correct": 0
  },
  "errors": [
   {
    "choice": 1,
    "misconception": "decimal-kind",
    "feedback": "0.35 stops after the 5. A repeating decimal never ends."
   },
   {
    "choice": 2,
    "misconception": "decimal-kind",
    "feedback": "0.35 ends, so it is a terminating decimal."
   }
  ],
  "hint": "Does it ever stop?",
  "steps": [
   {
    "say": "Look at the digits of 0.35.",
    "ask": {
     "prompt": "Does 0.35 stop or go on forever?",
     "answer": {
      "type": "choice",
      "choices": [
       "It stops",
       "It goes on forever"
      ],
      "correct": 0
     },
     "hint": "How many digits are there after the point?",
     "reveal": "It stops after 2 digits."
    }
   },
   {
    "say": "A decimal that stops is called…",
    "ask": {
     "prompt": "Kind of decimal?",
     "answer": {
      "type": "choice",
      "choices": [
       "terminating",
       "repeating",
       "non-terminating, non-repeating"
      ],
      "correct": 0
     },
     "hint": "A decimal that ends.",
     "reveal": "Terminating."
    }
   }
  ]
 },
 {
  "id": "b062",
  "skill": "repeating",
  "kind": "short",
  "level": 1,
  "prompt": "What kind of decimal is 0.141414…?",
  "answer": {
   "type": "choice",
   "choices": [
    "terminating",
    "repeating",
    "non-terminating, non-repeating"
   ],
   "correct": 1
  },
  "errors": [
   {
    "choice": 0,
    "misconception": "decimal-kind",
    "feedback": "The dots mean it never ends, so it is not terminating."
   },
   {
    "choice": 2,
    "misconception": "decimal-kind",
    "feedback": "It has a pattern (14 over and over), so it repeats."
   }
  ],
  "hint": "Is there a pattern of digits that repeats?",
  "steps": [
   {
    "say": "Read the digits.",
    "ask": {
     "prompt": "Which block of digits repeats? (write it, e.g. 12)",
     "answer": {
      "type": "num",
      "value": "14",
      "form": "number"
     },
     "hint": "Look for the pattern.",
     "reveal": "14, 14, 14…"
    }
   },
   {
    "say": "Name the kind.",
    "ask": {
     "prompt": "Kind of decimal?",
     "answer": {
      "type": "choice",
      "choices": [
       "terminating",
       "repeating",
       "non-terminating, non-repeating"
      ],
      "correct": 1
     },
     "hint": "Goes on forever with a repeating block.",
     "reveal": "Repeating."
    }
   }
  ]
 },
 {
  "id": "b063",
  "skill": "repeating",
  "kind": "short",
  "level": 2,
  "prompt": "What kind of decimal is [[f:3/14]]?",
  "answer": {
   "type": "choice",
   "choices": [
    "terminating",
    "repeating",
    "non-terminating, non-repeating"
   ],
   "correct": 1
  },
  "errors": [
   {
    "choice": 0,
    "misconception": "decimal-kind",
    "feedback": "[[f:3/14]] does not stop: 14 has a prime factor of 7, so the division never ends."
   },
   {
    "choice": 2,
    "misconception": "decimal-kind",
    "feedback": "Every fraction's decimal either stops or repeats. Division of whole numbers always repeats a remainder."
   }
  ],
  "hint": "Divide 3 ÷ 14 and watch the remainders.",
  "steps": [
   {
    "say": "3 ÷ 14: the remainders go 2, 6, 4, 12, 8, 10, 2 … back to 2.",
    "figure": {
     "type": "longdiv",
     "dividend": 3,
     "divisor": 14,
     "digits": 8
    },
    "ask": {
     "prompt": "What does a remainder that comes back tell you?",
     "answer": {
      "type": "choice",
      "choices": [
       "The digits repeat forever",
       "The decimal ends",
       "The digits never repeat"
      ],
      "correct": 0
     },
     "hint": "The same step happens again.",
     "reveal": "A repeated remainder means the same digits come out again: it repeats."
    }
   },
   {
    "say": "Name the kind.",
    "ask": {
     "prompt": "Kind of decimal?",
     "answer": {
      "type": "choice",
      "choices": [
       "terminating",
       "repeating",
       "non-terminating, non-repeating"
      ],
      "correct": 1
     },
     "hint": "Goes on forever with a block that repeats.",
     "reveal": "Repeating: 0.2142857142857… = 0.2(142857)."
    }
   }
  ]
 },
 {
  "id": "b064",
  "skill": "repeating",
  "kind": "short",
  "level": 2,
  "prompt": "What kind of decimal is 0.087621134…? (The digits go on with no pattern.)",
  "answer": {
   "type": "choice",
   "choices": [
    "terminating",
    "repeating",
    "non-terminating, non-repeating"
   ],
   "correct": 2
  },
  "errors": [
   {
    "choice": 1,
    "misconception": "decimal-kind",
    "feedback": "A repeating decimal has a block that repeats. These digits show no pattern."
   },
   {
    "choice": 0,
    "misconception": "decimal-kind",
    "feedback": "The dots mean it keeps going, so it does not stop."
   }
  ],
  "hint": "Does it stop? Is there a repeating pattern?",
  "steps": [
   {
    "say": "Look at the digits.",
    "ask": {
     "prompt": "Does it end?",
     "answer": {
      "type": "choice",
      "choices": [
       "Yes, it ends",
       "No, it goes on forever"
      ],
      "correct": 1
     },
     "hint": "Look for the dots.",
     "reveal": "The dots mean it goes on forever."
    }
   },
   {
    "say": "Is there a repeating block?",
    "ask": {
     "prompt": "Kind of decimal?",
     "answer": {
      "type": "choice",
      "choices": [
       "terminating",
       "repeating",
       "non-terminating, non-repeating"
      ],
      "correct": 2
     },
     "hint": "Goes on forever and no block repeats.",
     "reveal": "Non-terminating, non-repeating."
    }
   }
  ]
 },
 {
  "id": "b065",
  "skill": "repeating",
  "kind": "short",
  "level": 3,
  "prompt": "Which fraction is a terminating decimal?",
  "answer": {
   "type": "choice",
   "choices": [
    "[[f:1/3]]",
    "[[f:3/14]]",
    "[[f:7/20]]",
    "[[f:5/6]]"
   ],
   "correct": 2
  },
  "errors": [
   {
    "choice": 0,
    "misconception": "decimal-kind",
    "feedback": "[[f:1/3]] = 0.333…, repeating."
   },
   {
    "choice": 1,
    "misconception": "decimal-kind",
    "feedback": "[[f:3/14]] repeats: 14 = 2 × 7 and the 7 is the problem."
   },
   {
    "choice": 3,
    "misconception": "decimal-kind",
    "feedback": "[[f:5/6]] = 0.8333…, repeating (6 has a factor of 3)."
   }
  ],
  "hint": "A fraction in simplest form terminates only if its denominator is made of just 2s and 5s.",
  "steps": [
   {
    "say": "The test: factor the denominator.",
    "ask": {
     "prompt": "Which denominator is made of only 2s and 5s?",
     "answer": {
      "type": "choice",
      "choices": [
       "3",
       "14",
       "20",
       "6"
      ],
      "correct": 2
     },
     "hint": "20 = 2 × 2 × 5.",
     "reveal": "20 = 2 × 2 × 5."
    }
   },
   {
    "say": "So [[f:7/20]] ends.",
    "ask": {
     "prompt": "[[f:7/20]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "0.35",
      "form": "decimal"
     },
     "hint": "7 ÷ 20.",
     "reveal": "0.35: it stops."
    }
   }
  ]
 },
 {
  "id": "b066",
  "skill": "repeating",
  "kind": "short",
  "level": 1,
  "prompt": "Write 0.141414… using bar notation.",
  "answer": {
   "type": "num",
   "value": "0.(14)",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.1(4)",
    "misconception": "bar-placement",
    "feedback": "Both 1 and 4 repeat together: the bar covers 14."
   },
   {
    "value": "0.14",
    "misconception": "repeating-truncate",
    "feedback": "It keeps going. Use the bar."
   }
  ],
  "hint": "Which digits repeat as a block?",
  "steps": [
   {
    "say": "Find the block.",
    "ask": {
     "prompt": "Which block repeats?",
     "answer": {
      "type": "num",
      "value": "14",
      "form": "number"
     },
     "hint": "Look for the pattern.",
     "reveal": "14."
    }
   },
   {
    "say": "Bar over the block.",
    "ask": {
     "prompt": "Write it with the bar.",
     "answer": {
      "type": "num",
      "value": "0.(14)",
      "form": "decimal"
     },
     "hint": "Put the bar over the whole block.",
     "reveal": "[[r:0.(14)]]."
    }
   }
  ]
 },
 {
  "id": "b067",
  "skill": "repeating",
  "kind": "short",
  "level": 3,
  "prompt": "Write [[f:3/14]] as a decimal using bar notation.",
  "answer": {
   "type": "num",
   "value": "0.2(142857)",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "0.(2142857)",
    "misconception": "bar-placement",
    "feedback": "The 2 comes only once. The repeating block starts after it: 142857."
   },
   {
    "value": "0.214",
    "misconception": "repeating-truncate",
    "feedback": "That's cut off. [[f:3/14]] never ends."
   },
   {
    "value": "0.2(1)",
    "misconception": "bar-placement",
    "feedback": "The whole block 142857 repeats, not just the 1."
   }
  ],
  "hint": "Divide 3 by 14 until the remainder repeats. The first digit is 2; the repeat starts after it.",
  "steps": [
   {
    "say": "3 ÷ 14 = 0.2142857142857… (remainder 2 comes back after the first digit).",
    "figure": {
     "type": "longdiv",
     "dividend": 3,
     "divisor": 14,
     "digits": 9
    },
    "ask": {
     "prompt": "How many digits are in the repeating block 142857?",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "number"
     },
     "hint": "Count them: 1, 4, 2, 8, 5, 7.",
     "reveal": "6."
    }
   },
   {
    "say": "Put the bar over the block.",
    "ask": {
     "prompt": "[[f:3/14]] = ?",
     "answer": {
      "type": "num",
      "value": "0.2(142857)",
      "form": "decimal"
     },
     "hint": "2 stays in front; 142857 repeats.",
     "reveal": "[[r:0.2(142857)]]."
    }
   }
  ]
 },
 {
  "id": "b068",
  "skill": "compare-mixed",
  "kind": "short",
  "level": 2,
  "prompt": "Order the numbers from least to greatest.",
  "answer": {
   "type": "order",
   "items": [
    "[[m:1 1/4]]",
    "1.2",
    "115%",
    "[[f:7/5]]"
   ],
   "correct": [
    2,
    1,
    0,
    3
   ]
  },
  "errors": [
   {
    "order": [
     1,
     0,
     3,
     2
    ],
    "misconception": "pct-shift-wrong-way",
    "feedback": "115% is 1.15, not 115. Change everything to decimals first."
   },
   {
    "order": [
     2,
     1,
     3,
     0
    ],
    "misconception": "frac-part-as-decimal",
    "feedback": "[[m:1 1/4]] = 1.25, not 1.4. ¼ = 0.25."
   }
  ],
  "hint": "Change everything to decimals: 1.25, 1.2, 1.15, 1.4.",
  "steps": [
   {
    "say": "Mixed number and improper fraction.",
    "ask": {
     "prompt": "[[f:7/5]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "1.4",
      "form": "decimal"
     },
     "hint": "7 ÷ 5.",
     "reveal": "1.4."
    }
   },
   {
    "say": "Mixed number and percent.",
    "ask": {
     "prompt": "[[m:1 1/4]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "1.25",
      "form": "decimal"
     },
     "hint": "1 + 0.25.",
     "reveal": "1.25."
    }
   },
   {
    "say": "Order 1.25, 1.2, 1.15, 1.4.",
    "ask": {
     "prompt": "Order these from least to greatest.",
     "answer": {
      "type": "order",
      "items": [
       "1.25",
       "1.2",
       "1.15",
       "1.4"
      ],
      "correct": [
       2,
       1,
       0,
       3
      ]
     },
     "hint": "Compare tenths first.",
     "reveal": "1.15 < 1.2 < 1.25 < 1.4."
    }
   }
  ]
 },
 {
  "id": "b069",
  "skill": "compare-mixed",
  "kind": "short",
  "level": 3,
  "prompt": "Tell which number is greater.<br>[[m:7 7/8]] &nbsp;or&nbsp; 787%",
  "answer": {
   "type": "choice",
   "choices": [
    "[[m:7 7/8]]",
    "787%",
    "They are equal"
   ],
   "correct": 0
  },
  "errors": [
   {
    "choice": 2,
    "misconception": "rounded-as-exact",
    "feedback": "[[m:7 7/8]] = 7.875 = 787.5%, which is a little more than 787%."
   },
   {
    "choice": 1,
    "misconception": "pct-shift-places",
    "feedback": "787% = 7.87. And [[m:7 7/8]] = 7.875."
   }
  ],
  "hint": "Change both to decimals (or both to percents).",
  "steps": [
   {
    "say": "Mixed number to decimal.",
    "ask": {
     "prompt": "[[m:7 7/8]] = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "7.875",
      "form": "decimal"
     },
     "hint": "7 + 7 ÷ 8.",
     "reveal": "7.875."
    }
   },
   {
    "say": "Percent to decimal.",
    "ask": {
     "prompt": "787% = ___ (decimal)",
     "answer": {
      "type": "num",
      "value": "7.87",
      "form": "decimal"
     },
     "hint": "÷ 100.",
     "reveal": "7.87."
    }
   },
   {
    "say": "Compare 7.875 and 7.870.",
    "ask": {
     "prompt": "Which is greater?",
     "answer": {
      "type": "choice",
      "choices": [
       "7.875",
       "7.87"
      ],
      "correct": 0
     },
     "hint": "Thousandths: 5 vs 0.",
     "reveal": "7.875, so [[m:7 7/8]] is greater."
    }
   }
  ]
 },
 {
  "id": "b070",
  "skill": "gcf-lcm",
  "kind": "short",
  "level": 1,
  "prompt": "Find the GCF of 24 and 36.",
  "answer": {
   "type": "num",
   "value": "12",
   "form": "number"
  },
  "errors": [
   {
    "value": "72",
    "misconception": "gcf-lcm-swap",
    "feedback": "72 is the LCM (a common multiple). The GCF is the greatest common FACTOR."
   },
   {
    "value": "6",
    "misconception": "gcf-lcm-not-extreme",
    "feedback": "6 divides both, but it is not the greatest one that does."
   }
  ],
  "hint": "Write both as products of primes and keep the primes they share.",
  "steps": [
   {
    "say": "24 = 2 &times; 2 &times; 2 &times; 3 and 36 = 2 &times; 2 &times; 3 &times; 3.",
    "ask": {
     "prompt": "How many 2s do both numbers share?",
     "answer": {
      "type": "num",
      "value": "2",
      "form": "number"
     },
     "hint": "Count the 2s in each list and take the smaller count.",
     "reveal": "24 has three 2s, 36 has two. They share two."
    }
   },
   {
    "say": "Shared primes: 2, 2, 3.",
    "ask": {
     "prompt": "Multiply the shared primes: 2 &times; 2 &times; 3 = ?",
     "answer": {
      "type": "num",
      "value": "12",
      "form": "number"
     },
     "hint": "Multiply.",
     "reveal": "GCF = 12."
    }
   }
  ]
 },
 {
  "id": "b071",
  "skill": "gcf-lcm",
  "kind": "short",
  "level": 1,
  "prompt": "Find the LCM of 6 and 8.",
  "answer": {
   "type": "num",
   "value": "24",
   "form": "number"
  },
  "errors": [
   {
    "value": "2",
    "misconception": "gcf-lcm-swap",
    "feedback": "2 is the GCF (a common factor). The LCM is the least common MULTIPLE."
   },
   {
    "value": "48",
    "misconception": "gcf-lcm-not-extreme",
    "feedback": "48 is a common multiple (6 &times; 8), but not the least one."
   }
  ],
  "hint": "List multiples of 8 and look for the first one 6 divides into.",
  "steps": [
   {
    "say": "Multiples of 8: 8, 16, 24, 32, 40, 48.",
    "ask": {
     "prompt": "Which of these is a multiple of 6?",
     "answer": {
      "type": "choice",
      "choices": [
       "16",
       "24",
       "32"
      ],
      "correct": 1
     },
     "hint": "Divide each by 6.",
     "reveal": "24 = 6 &times; 4."
    }
   },
   {
    "say": "It is the smallest in the list that works.",
    "ask": {
     "prompt": "LCM of 6 and 8?",
     "answer": {
      "type": "num",
      "value": "24",
      "form": "number"
     },
     "hint": "The first multiple of 8 that 6 divides.",
     "reveal": "24."
    }
   }
  ]
 },
 {
  "id": "b072",
  "skill": "gcf-lcm",
  "kind": "short",
  "level": 2,
  "prompt": "Find the LCM of 12 and 18.",
  "answer": {
   "type": "num",
   "value": "36",
   "form": "number"
  },
  "errors": [
   {
    "value": "6",
    "misconception": "gcf-lcm-swap",
    "feedback": "6 is the GCF. The LCM is bigger than both numbers."
   },
   {
    "value": "216",
    "misconception": "gcf-lcm-not-extreme",
    "feedback": "12 &times; 18 = 216 is a common multiple, but not the least. Divide out the GCF."
   }
  ],
  "hint": "12 = 2&times;2&times;3 and 18 = 2&times;3&times;3. The LCM takes the most copies of each prime.",
  "steps": [
   {
    "say": "The LCM uses the highest count of each prime.",
    "ask": {
     "prompt": "How many 2s does the LCM need? (12 has two, 18 has one)",
     "answer": {
      "type": "num",
      "value": "2",
      "form": "number"
     },
     "hint": "Take the larger count.",
     "reveal": "Two 2s."
    }
   },
   {
    "say": "And the 3s.",
    "ask": {
     "prompt": "How many 3s does the LCM need? (12 has one, 18 has two)",
     "answer": {
      "type": "num",
      "value": "2",
      "form": "number"
     },
     "hint": "Take the larger count.",
     "reveal": "Two 3s."
    }
   },
   {
    "say": "Multiply.",
    "ask": {
     "prompt": "2 &times; 2 &times; 3 &times; 3 = ?",
     "answer": {
      "type": "num",
      "value": "36",
      "form": "number"
     },
     "hint": "4 &times; 9.",
     "reveal": "LCM = 36."
    }
   }
  ]
 },
 {
  "id": "b073",
  "skill": "gcf-lcm",
  "kind": "short",
  "level": 2,
  "prompt": "Find the GCF of 42 and 70.",
  "answer": {
   "type": "num",
   "value": "14",
   "form": "number"
  },
  "errors": [
   {
    "value": "210",
    "misconception": "gcf-lcm-swap",
    "feedback": "210 is the LCM. GCF is the greatest number that divides both."
   },
   {
    "value": "7",
    "misconception": "gcf-lcm-not-extreme",
    "feedback": "7 divides both, but there is a larger one. 42 and 70 are both even."
   }
  ],
  "hint": "42 = 2&times;3&times;7 and 70 = 2&times;5&times;7.",
  "steps": [
   {
    "say": "Which primes do they share?",
    "ask": {
     "prompt": "The shared primes are 2 and ___.",
     "answer": {
      "type": "num",
      "value": "7",
      "form": "number"
     },
     "hint": "Compare the two lists.",
     "reveal": "2 and 7."
    }
   },
   {
    "say": "Multiply them.",
    "ask": {
     "prompt": "GCF = 2 &times; 7 = ?",
     "answer": {
      "type": "num",
      "value": "14",
      "form": "number"
     },
     "hint": "Multiply.",
     "reveal": "14."
    }
   }
  ]
 },
 {
  "id": "b074",
  "skill": "gcf-lcm",
  "kind": "short",
  "level": 3,
  "prompt": "Find the LCM of 8, 12, and 20.",
  "answer": {
   "type": "num",
   "value": "120",
   "form": "number"
  },
  "errors": [
   {
    "value": "240",
    "misconception": "gcf-lcm-not-extreme",
    "feedback": "240 is a common multiple, but 120 is smaller."
   },
   {
    "value": "4",
    "misconception": "gcf-lcm-swap",
    "feedback": "4 is the GCF of all three. The LCM is a multiple."
   }
  ],
  "hint": "8 = 2&times;2&times;2, 12 = 2&times;2&times;3, 20 = 2&times;2&times;5.",
  "steps": [
   {
    "say": "Take the most copies of each prime.",
    "ask": {
     "prompt": "How many 2s? (8 has three)",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number"
     },
     "hint": "Largest count among the three.",
     "reveal": "Three 2s."
    }
   },
   {
    "say": "Then one 3 and one 5.",
    "ask": {
     "prompt": "2 &times; 2 &times; 2 &times; 3 &times; 5 = ?",
     "answer": {
      "type": "num",
      "value": "120",
      "form": "number"
     },
     "hint": "8 &times; 15.",
     "reveal": "120."
    }
   }
  ]
 },
 {
  "id": "b075",
  "skill": "gcf-lcm",
  "kind": "word",
  "level": 2,
  "prompt": "A 56-inch board and an 84-inch board are cut into pieces that are all the same length, as long as possible, with nothing left over. How long is each piece?",
  "answer": {
   "type": "num",
   "value": "28",
   "form": "number",
   "label": [
    "inches",
    "inch",
    "in",
    "in."
   ]
  },
  "errors": [
   {
    "value": "168",
    "misconception": "gcf-lcm-swap",
    "feedback": "168 is the LCM. Pieces must divide into both boards, so we need the GCF."
   },
   {
    "value": "14",
    "misconception": "gcf-lcm-not-extreme",
    "feedback": "14 inches works, but the question asks for the longest pieces."
   }
  ],
  "hint": "'As long as possible' and 'same length' point to the greatest common factor.",
  "steps": [
   {
    "say": "The piece length must divide both 56 and 84.",
    "ask": {
     "prompt": "GCF of 56 and 84?",
     "answer": {
      "type": "num",
      "value": "28",
      "form": "number"
     },
     "hint": "56 = 2&times;2&times;2&times;7 and 84 = 2&times;2&times;3&times;7.",
     "reveal": "28."
    }
   },
   {
    "say": "Check by counting pieces.",
    "ask": {
     "prompt": "How many pieces come from the 56-inch board?",
     "answer": {
      "type": "num",
      "value": "2",
      "form": "number"
     },
     "hint": "56 &divide; 28.",
     "reveal": "2 pieces."
    }
   }
  ]
 },
 {
  "id": "b076",
  "skill": "gcf-lcm",
  "kind": "word",
  "level": 2,
  "prompt": "One light blinks every 6 seconds and another blinks every 8 seconds. They just blinked together. After how many seconds will they blink together again?",
  "answer": {
   "type": "num",
   "value": "24",
   "form": "number",
   "label": [
    "seconds",
    "second",
    "sec",
    "s"
   ]
  },
  "errors": [
   {
    "value": "2",
    "misconception": "gcf-lcm-swap",
    "feedback": "2 is the GCF. We need the first time both land together: a common multiple."
   },
   {
    "value": "48",
    "misconception": "gcf-lcm-not-extreme",
    "feedback": "They also blink together at 48, but 24 comes first."
   }
  ],
  "hint": "Find the first time that is a multiple of both 6 and 8.",
  "steps": [
   {
    "say": "The first light blinks at 6, 12, 18, 24 …",
    "ask": {
     "prompt": "Which of these times is also a multiple of 8?",
     "answer": {
      "type": "choice",
      "choices": [
       "12",
       "18",
       "24"
      ],
      "correct": 2
     },
     "hint": "Check each against 8, 16, 24.",
     "reveal": "24."
    }
   },
   {
    "say": "So the answer is the LCM.",
    "ask": {
     "prompt": "They blink together again after ___ seconds.",
     "answer": {
      "type": "num",
      "value": "24",
      "form": "number",
      "label": [
       "seconds",
       "second",
       "sec",
       "s"
      ]
     },
     "hint": "LCM(6, 8).",
     "reveal": "24 seconds."
    }
   }
  ]
 },
 {
  "id": "b077",
  "skill": "frac-addsub",
  "kind": "short",
  "level": 1,
  "prompt": "Add. Write the answer in simplest form.<br>[[f:1/2]] + [[f:1/3]]",
  "answer": {
   "type": "num",
   "value": "5/6",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "2/5",
    "misconception": "add-denominators",
    "feedback": "You added tops AND bottoms. Denominators tell the size of the pieces; find a common one first."
   },
   {
    "value": "1/6",
    "misconception": "wrong-operation",
    "feedback": "That's [[f:1/2]] − [[f:1/3]]. The problem says add."
   }
  ],
  "hint": "Find a common denominator: LCM of 2 and 3.",
  "steps": [
   {
    "say": "Halves and thirds are different-size pieces. Use sixths.",
    "figure": {
     "type": "fracbar",
     "rows": [
      {
       "parts": 2,
       "shaded": 1,
       "label": "[[f:1/2]]"
      },
      {
       "parts": 3,
       "shaded": 1,
       "label": "[[f:1/3]]"
      },
      {
       "parts": 6,
       "shaded": 5,
       "label": "[[f:5/6]]"
      }
     ]
    },
    "ask": {
     "prompt": "LCM of 2 and 3?",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "number"
     },
     "hint": "Smallest number both divide into.",
     "reveal": "6."
    }
   },
   {
    "say": "Rename each fraction in sixths.",
    "ask": {
     "prompt": "[[f:1/2]] = ___/6",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number"
     },
     "hint": "2 &times; 3 = 6, so multiply the top by 3.",
     "reveal": "3/6."
    }
   },
   {
    "say": "And the other.",
    "ask": {
     "prompt": "[[f:1/3]] = ___/6",
     "answer": {
      "type": "num",
      "value": "2",
      "form": "number"
     },
     "hint": "3 &times; 2 = 6.",
     "reveal": "2/6."
    }
   },
   {
    "say": "Add the sixths.",
    "ask": {
     "prompt": "3/6 + 2/6 = ?",
     "answer": {
      "type": "num",
      "value": "5/6",
      "form": "fraction"
     },
     "hint": "Add the tops, keep the bottom.",
     "reveal": "5/6."
    }
   }
  ]
 },
 {
  "id": "b078",
  "skill": "frac-addsub",
  "kind": "short",
  "level": 1,
  "prompt": "Subtract. Write the answer in simplest form.<br>[[f:3/4]] − [[f:1/6]]",
  "answer": {
   "type": "num",
   "value": "7/12",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "1/5",
    "misconception": "add-denominators",
    "feedback": "You subtracted the tops and added the bottoms. Use a common denominator."
   },
   {
    "value": "11/12",
    "misconception": "wrong-operation",
    "feedback": "That's [[f:3/4]] + [[f:1/6]]. The problem says subtract."
   }
  ],
  "hint": "LCM of 4 and 6.",
  "steps": [
   {
    "say": "Common denominator.",
    "ask": {
     "prompt": "LCM of 4 and 6?",
     "answer": {
      "type": "num",
      "value": "12",
      "form": "number"
     },
     "hint": "List multiples of 6 until 4 divides.",
     "reveal": "12."
    }
   },
   {
    "say": "Rename.",
    "ask": {
     "prompt": "[[f:3/4]] = ___/12",
     "answer": {
      "type": "num",
      "value": "9",
      "form": "number"
     },
     "hint": "4 &times; 3 = 12.",
     "reveal": "9/12."
    }
   },
   {
    "say": "Rename the other.",
    "ask": {
     "prompt": "[[f:1/6]] = ___/12",
     "answer": {
      "type": "num",
      "value": "2",
      "form": "number"
     },
     "hint": "6 &times; 2 = 12.",
     "reveal": "2/12."
    }
   },
   {
    "say": "Subtract.",
    "ask": {
     "prompt": "9/12 − 2/12 = ?",
     "answer": {
      "type": "num",
      "value": "7/12",
      "form": "fraction"
     },
     "hint": "Subtract tops.",
     "reveal": "7/12."
    }
   }
  ]
 },
 {
  "id": "b079",
  "skill": "frac-addsub",
  "kind": "short",
  "level": 2,
  "prompt": "Add. Write the answer as a mixed number in simplest form.<br>[[m:2 1/3]] + [[m:1 3/4]]",
  "answer": {
   "type": "num",
   "value": "49/12",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "25/7",
    "misconception": "add-denominators",
    "feedback": "That is 3 4/7: you added tops and bottoms of the fractions. Use a common denominator."
   },
   {
    "value": "37/12",
    "misconception": "regroup-mixed",
    "feedback": "That is 3 1/12. The fractions made 13/12, which is MORE than 1: carry the extra whole."
   }
  ],
  "hint": "Add the fractions with a common denominator; if they make more than 1, carry a whole.",
  "steps": [
   {
    "say": "Common denominator for 3 and 4.",
    "ask": {
     "prompt": "LCM of 3 and 4?",
     "answer": {
      "type": "num",
      "value": "12",
      "form": "number"
     },
     "hint": "List multiples of the larger denominator until the others divide into it.",
     "reveal": "12."
    }
   },
   {
    "say": "Add the fraction parts: 4/12 + 9/12.",
    "ask": {
     "prompt": "[[f:1/3]] + [[f:3/4]] = ? (fraction)",
     "answer": {
      "type": "num",
      "value": "13/12",
      "form": "fraction"
     },
     "hint": "4/12 + 9/12.",
     "reveal": "13/12 = 1 1/12."
    }
   },
   {
    "say": "Add the wholes and carry the extra whole.",
    "ask": {
     "prompt": "Total as a mixed number? (2 + 1 + 1 1/12)",
     "answer": {
      "type": "num",
      "value": "49/12",
      "form": "fraction"
     },
     "hint": "3 + 1 1/12.",
     "reveal": "4 1/12."
    }
   }
  ]
 },
 {
  "id": "b080",
  "skill": "frac-addsub",
  "kind": "short",
  "level": 2,
  "prompt": "Subtract. Write the answer in simplest form.<br>[[m:5 1/4]] − [[m:2 3/4]]",
  "answer": {
   "type": "num",
   "value": "5/2",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "7/2",
    "misconception": "regroup-mixed",
    "feedback": "That is 3 1/2. You subtracted the smaller fraction from the larger. [[f:1/4]] is less than [[f:3/4]], so regroup from the 5."
   },
   {
    "value": "8",
    "misconception": "wrong-operation",
    "feedback": "That's the sum. The problem says subtract."
   }
  ],
  "hint": "[[f:1/4]] is not enough to take [[f:3/4]] away. Borrow a whole.",
  "steps": [
   {
    "say": "Regroup: take one whole from the 5 and make it fourths.",
    "figure": {
     "type": "fracbar",
     "rows": [
      {
       "parts": 4,
       "shaded": 1,
       "label": "[[f:1/4]]"
      },
      {
       "parts": 4,
       "shaded": 3,
       "label": "[[f:3/4]]"
      }
     ]
    },
    "ask": {
     "prompt": "[[m:5 1/4]] = 4 and ___/4",
     "answer": {
      "type": "num",
      "value": "5",
      "form": "number"
     },
     "hint": "1 whole = 4/4, plus the 1/4 you had.",
     "reveal": "4 5/4."
    }
   },
   {
    "say": "Now subtract.",
    "ask": {
     "prompt": "[[m:4 5/4]] − [[m:2 3/4]] = ?",
     "answer": {
      "type": "num",
      "value": "5/2",
      "form": "fraction"
     },
     "hint": "Subtract wholes and fourths separately.",
     "reveal": "2 2/4 = 2 1/2."
    }
   }
  ]
 },
 {
  "id": "b081",
  "skill": "frac-addsub",
  "kind": "short",
  "level": 2,
  "prompt": "Add. Write the answer in simplest form.<br>[[f:7/8]] + [[f:5/12]]",
  "answer": {
   "type": "num",
   "value": "31/24",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "3/5",
    "misconception": "add-denominators",
    "feedback": "12/20 = 3/5. You added the tops and bottoms."
   },
   {
    "value": "11/24",
    "misconception": "wrong-operation",
    "feedback": "That's [[f:7/8]] − [[f:5/12]]. The problem says add."
   }
  ],
  "hint": "LCM of 8 and 12.",
  "steps": [
   {
    "say": "Common denominator.",
    "ask": {
     "prompt": "LCM of 8 and 12?",
     "answer": {
      "type": "num",
      "value": "24",
      "form": "number"
     },
     "hint": "List multiples of the larger denominator until 8 divides into it.",
     "reveal": "24."
    }
   },
   {
    "say": "Rename: [[f:7/8]] = 21/24 and [[f:5/12]] = 10/24.",
    "ask": {
     "prompt": "21/24 + 10/24 = ?",
     "answer": {
      "type": "num",
      "value": "31/24",
      "form": "fraction"
     },
     "hint": "Add tops.",
     "reveal": "31/24 = 1 7/24."
    }
   }
  ]
 },
 {
  "id": "b082",
  "skill": "frac-addsub",
  "kind": "short",
  "level": 3,
  "prompt": "Subtract. Write the answer in simplest form.<br>6 − [[m:2 5/8]]",
  "answer": {
   "type": "num",
   "value": "27/8",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "37/8",
    "misconception": "regroup-mixed",
    "feedback": "That is 4 5/8. You subtracted 2 from 6 and kept the fraction. There was no fraction on the 6: regroup a whole into eighths."
   },
   {
    "value": "29/8",
    "misconception": "regroup-mixed",
    "feedback": "That is 3 5/8. Careful: 6 − 2 5/8 is less than 6 − 2 1/2 = 3 1/2."
   }
  ],
  "hint": "Write 6 as 5 and 8/8.",
  "steps": [
   {
    "say": "There is no fraction on the 6, so take one whole and turn it into eighths.",
    "ask": {
     "prompt": "6 = 5 and ___/8",
     "answer": {
      "type": "num",
      "value": "8",
      "form": "number"
     },
     "hint": "1 whole = 8/8.",
     "reveal": "6 = 5 8/8."
    }
   },
   {
    "say": "Subtract.",
    "ask": {
     "prompt": "[[m:5 8/8]] − [[m:2 5/8]] = ?",
     "answer": {
      "type": "num",
      "value": "27/8",
      "form": "fraction"
     },
     "hint": "Wholes: 5 − 2; eighths: 8 − 5.",
     "reveal": "3 3/8."
    }
   }
  ]
 },
 {
  "id": "b083",
  "skill": "frac-addsub",
  "kind": "short",
  "level": 3,
  "prompt": "Add. Write the answer in simplest form.<br>[[f:1/2]] + [[f:1/3]] + [[f:1/4]]",
  "answer": {
   "type": "num",
   "value": "13/12",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "3/9",
    "misconception": "add-denominators",
    "feedback": "You added all the tops and all the bottoms (3/9). Use a common denominator."
   },
   {
    "value": "7/12",
    "misconception": "missed-step",
    "feedback": "That's only [[f:1/3]] + [[f:1/4]]. Don't forget [[f:1/2]]."
   }
  ],
  "hint": "LCM of 2, 3, and 4.",
  "steps": [
   {
    "say": "Common denominator.",
    "ask": {
     "prompt": "LCM of 2, 3, 4?",
     "answer": {
      "type": "num",
      "value": "12",
      "form": "number"
     },
     "hint": "List multiples of the larger denominator until the others divide into it.",
     "reveal": "12."
    }
   },
   {
    "say": "Rename: 6/12, 4/12, 3/12.",
    "ask": {
     "prompt": "6 + 4 + 3 = ?",
     "answer": {
      "type": "num",
      "value": "13",
      "form": "number"
     },
     "hint": "Add the tops.",
     "reveal": "13, so 13/12."
    }
   }
  ]
 },
 {
  "id": "b084",
  "skill": "frac-addsub",
  "kind": "short",
  "level": 2,
  "prompt": "Subtract. Write the answer in simplest form.<br>[[m:9 1/6]] − [[m:4 2/3]]",
  "answer": {
   "type": "num",
   "value": "9/2",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "11/2",
    "misconception": "regroup-mixed",
    "feedback": "That is 5 1/2. [[f:1/6]] is less than [[f:2/3]], so you must regroup."
   },
   {
    "value": "83/6",
    "misconception": "wrong-operation",
    "feedback": "That's the sum, 13 5/6."
   }
  ],
  "hint": "Rename [[f:2/3]] in sixths, then regroup.",
  "steps": [
   {
    "say": "Common denominator is 6.",
    "ask": {
     "prompt": "[[m:4 2/3]] = 4 and ___/6",
     "answer": {
      "type": "num",
      "value": "4",
      "form": "number"
     },
     "hint": "3 &times; 2 = 6, so multiply 2 by 2.",
     "reveal": "4 4/6."
    }
   },
   {
    "say": "1/6 is less than 4/6. Regroup the 9.",
    "ask": {
     "prompt": "[[m:9 1/6]] = 8 and ___/6",
     "answer": {
      "type": "num",
      "value": "7",
      "form": "number"
     },
     "hint": "1 whole = 6/6, plus 1/6.",
     "reveal": "8 7/6."
    }
   },
   {
    "say": "Subtract.",
    "ask": {
     "prompt": "[[m:8 7/6]] − [[m:4 4/6]] = ? (simplest form)",
     "answer": {
      "type": "num",
      "value": "9/2",
      "form": "fraction"
     },
     "hint": "4 and 3/6.",
     "reveal": "4 3/6 = 4 1/2."
    }
   }
  ]
 },
 {
  "id": "b085",
  "skill": "frac-addsub",
  "kind": "short",
  "level": 1,
  "prompt": "Add. Write the answer in simplest form.<br>[[f:3/10]] + [[f:2/5]]",
  "answer": {
   "type": "num",
   "value": "7/10",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "1/3",
    "misconception": "add-denominators",
    "feedback": "5/15 = 1/3: you added tops and bottoms."
   },
   {
    "value": "1/10",
    "misconception": "wrong-operation",
    "feedback": "That's [[f:2/5]] − [[f:3/10]]."
   }
  ],
  "hint": "Fifths can be renamed as tenths.",
  "steps": [
   {
    "say": "What do you multiply 5 by to get 10?",
    "ask": {
     "prompt": "[[f:2/5]] = ___/10",
     "answer": {
      "type": "num",
      "value": "4",
      "form": "number"
     },
     "hint": "Multiply top and bottom by 2.",
     "reveal": "4/10."
    }
   },
   {
    "say": "Add.",
    "ask": {
     "prompt": "3/10 + 4/10 = ?",
     "answer": {
      "type": "num",
      "value": "7/10",
      "form": "fraction"
     },
     "hint": "Add tops.",
     "reveal": "7/10."
    }
   }
  ]
 },
 {
  "id": "b086",
  "skill": "frac-muldiv",
  "kind": "short",
  "level": 1,
  "prompt": "Multiply. Write the answer in simplest form.<br>[[f:2/3]] &times; [[f:3/4]]",
  "answer": {
   "type": "num",
   "value": "1/2",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "17/12",
    "misconception": "wrong-operation",
    "feedback": "That's [[f:2/3]] + [[f:3/4]]. The problem says multiply."
   },
   {
    "value": "8/9",
    "misconception": "div-no-flip",
    "feedback": "That's [[f:2/3]] &divide; [[f:3/4]]."
   }
  ],
  "hint": "Multiply tops, multiply bottoms, then simplify.",
  "steps": [
   {
    "say": "Area model: [[f:2/3]] of [[f:3/4]].",
    "figure": {
     "type": "area",
     "a": "2/3",
     "b": "3/4"
    },
    "ask": {
     "prompt": "Numerator: 2 &times; 3 = ?",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "number"
     },
     "hint": "Multiply the tops.",
     "reveal": "6."
    }
   },
   {
    "say": "Denominator.",
    "ask": {
     "prompt": "3 &times; 4 = ?",
     "answer": {
      "type": "num",
      "value": "12",
      "form": "number"
     },
     "hint": "Multiply the bottoms.",
     "reveal": "12."
    }
   },
   {
    "say": "Simplify 6/12.",
    "ask": {
     "prompt": "Simplest form?",
     "answer": {
      "type": "num",
      "value": "1/2",
      "form": "fraction"
     },
     "hint": "GCF is 6.",
     "reveal": "[[f:1/2]]."
    }
   }
  ]
 },
 {
  "id": "b087",
  "skill": "frac-muldiv",
  "kind": "short",
  "level": 2,
  "prompt": "Multiply. Write the answer as a mixed number in simplest form.<br>[[m:2 1/2]] &times; [[m:3 1/3]]",
  "answer": {
   "type": "num",
   "value": "25/3",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "37/6",
    "misconception": "mixed-mult-parts",
    "feedback": "That is 6 1/6: you multiplied wholes (2 &times; 3) and fractions (1/2 &times; 1/3) separately. Change to improper fractions first."
   },
   {
    "value": "35/6",
    "misconception": "wrong-operation",
    "feedback": "That's [[m:2 1/2]] + [[m:3 1/3]]."
   }
  ],
  "hint": "Change both mixed numbers to improper fractions first.",
  "steps": [
   {
    "say": "Improper fraction for the first.",
    "ask": {
     "prompt": "[[m:2 1/2]] = ___/2",
     "answer": {
      "type": "num",
      "value": "5",
      "form": "number"
     },
     "hint": "2 &times; 2 + 1.",
     "reveal": "5/2."
    }
   },
   {
    "say": "And the second.",
    "ask": {
     "prompt": "[[m:3 1/3]] = ___/3",
     "answer": {
      "type": "num",
      "value": "10",
      "form": "number"
     },
     "hint": "3 &times; 3 + 1.",
     "reveal": "10/3."
    }
   },
   {
    "say": "Multiply and simplify.",
    "ask": {
     "prompt": "[[f:5/2]] &times; [[f:10/3]] = ? (simplest, mixed number)",
     "answer": {
      "type": "num",
      "value": "25/3",
      "form": "fraction"
     },
     "hint": "50/6; divide by 2.",
     "reveal": "[[f:25/3]] = [[m:8 1/3]]."
    }
   }
  ]
 },
 {
  "id": "b088",
  "skill": "frac-muldiv",
  "kind": "short",
  "level": 2,
  "prompt": "Divide. Write the answer in simplest form.<br>[[f:3/4]] &divide; [[f:2/5]]",
  "answer": {
   "type": "num",
   "value": "15/8",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "3/10",
    "misconception": "div-no-flip",
    "feedback": "You multiplied. To divide, multiply by the RECIPROCAL of the second fraction."
   },
   {
    "value": "8/15",
    "misconception": "div-no-flip",
    "feedback": "You flipped the first fraction. Flip the SECOND one."
   }
  ],
  "hint": "Keep the first fraction; flip the second; multiply.",
  "steps": [
   {
    "say": "Dividing by a fraction is multiplying by its reciprocal.",
    "ask": {
     "prompt": "Reciprocal of [[f:2/5]]?",
     "answer": {
      "type": "num",
      "value": "5/2",
      "form": "fraction"
     },
     "hint": "Flip it.",
     "reveal": "[[f:5/2]]."
    }
   },
   {
    "say": "Multiply.",
    "ask": {
     "prompt": "[[f:3/4]] &times; [[f:5/2]] = ?",
     "answer": {
      "type": "num",
      "value": "15/8",
      "form": "fraction"
     },
     "hint": "Tops, then bottoms.",
     "reveal": "[[f:15/8]] = [[m:1 7/8]]."
    }
   }
  ]
 },
 {
  "id": "b089",
  "skill": "frac-muldiv",
  "kind": "short",
  "level": 2,
  "prompt": "Divide. Write the answer in simplest form.<br>6 &divide; [[f:3/4]]",
  "answer": {
   "type": "num",
   "value": "8",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "9/2",
    "misconception": "div-no-flip",
    "feedback": "You multiplied 6 &times; [[f:3/4]]. Dividing by [[f:3/4]] means multiplying by [[f:4/3]]."
   },
   {
    "value": "1/8",
    "misconception": "wrong-operation",
    "feedback": "That's [[f:3/4]] &divide; 6. The order matters."
   }
  ],
  "hint": "How many three-quarters fit in 6?",
  "steps": [
   {
    "say": "Reciprocal.",
    "figure": {
     "type": "groups",
     "total": "6",
     "size": "3/4",
     "unit": "units"
    },
    "ask": {
     "prompt": "Reciprocal of [[f:3/4]]?",
     "answer": {
      "type": "num",
      "value": "4/3",
      "form": "fraction"
     },
     "hint": "Flip it.",
     "reveal": "[[f:4/3]]."
    }
   },
   {
    "say": "Multiply.",
    "ask": {
     "prompt": "6 &times; [[f:4/3]] = ?",
     "answer": {
      "type": "num",
      "value": "8",
      "form": "number"
     },
     "hint": "6 &divide; 3 first.",
     "reveal": "8."
    }
   }
  ]
 },
 {
  "id": "b090",
  "skill": "frac-muldiv",
  "kind": "short",
  "level": 3,
  "prompt": "Divide. Write the answer in simplest form.<br>[[m:2 1/4]] &divide; [[m:1 1/2]]",
  "answer": {
   "type": "num",
   "value": "3/2",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "5/2",
    "misconception": "mixed-mult-parts",
    "feedback": "That is 2 1/2: you divided wholes and fractions separately. Change to improper fractions first."
   },
   {
    "value": "27/8",
    "misconception": "div-no-flip",
    "feedback": "That is 3 3/8: you multiplied instead of using the reciprocal."
   }
  ],
  "hint": "Improper fractions first, then flip the second.",
  "steps": [
   {
    "say": "First mixed number.",
    "ask": {
     "prompt": "[[m:2 1/4]] = ___/4",
     "answer": {
      "type": "num",
      "value": "9",
      "form": "number"
     },
     "hint": "2 &times; 4 + 1.",
     "reveal": "9/4."
    }
   },
   {
    "say": "Second, then flip it.",
    "ask": {
     "prompt": "[[m:1 1/2]] = [[f:3/2]]. Its reciprocal is?",
     "answer": {
      "type": "num",
      "value": "2/3",
      "form": "fraction"
     },
     "hint": "Flip.",
     "reveal": "[[f:2/3]]."
    }
   },
   {
    "say": "Multiply.",
    "ask": {
     "prompt": "[[f:9/4]] &times; [[f:2/3]] = ?",
     "answer": {
      "type": "num",
      "value": "3/2",
      "form": "fraction"
     },
     "hint": "Cancel 9 and 3, 2 and 4.",
     "reveal": "[[f:3/2]] = [[m:1 1/2]]."
    }
   }
  ]
 },
 {
  "id": "b091",
  "skill": "frac-muldiv",
  "kind": "short",
  "level": 3,
  "prompt": "Simplify the complex fraction.<br>[[c:3/4|5/8]]",
  "answer": {
   "type": "num",
   "value": "6/5",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "15/32",
    "misconception": "div-no-flip",
    "feedback": "You multiplied the two fractions. The long bar means divide."
   },
   {
    "value": "5/6",
    "misconception": "div-no-flip",
    "feedback": "You flipped the first fraction. Flip the second."
   }
  ],
  "hint": "The long fraction bar is a division sign.",
  "steps": [
   {
    "say": "The big bar between the two fractions is a division sign: top fraction &divide; bottom fraction.",
    "ask": {
     "prompt": "What operation does the long bar mean?",
     "answer": {
      "type": "choice",
      "choices": [
       "Divide",
       "Multiply",
       "Add"
      ],
      "correct": 0
     },
     "hint": "Think of what a fraction bar always means.",
     "reveal": "Divide: the top fraction is divided by the bottom fraction."
    }
   },
   {
    "say": "Dividing by a fraction is multiplying by its reciprocal.",
    "ask": {
     "prompt": "Reciprocal of the bottom fraction [[f:5/8]]?",
     "answer": {
      "type": "num",
      "value": "8/5",
      "form": "fraction"
     },
     "hint": "Flip it.",
     "reveal": "[[f:8/5]]."
    }
   },
   {
    "say": "Multiply and simplify.",
    "ask": {
     "prompt": "[[f:3/4]] &times; [[f:8/5]] = ?",
     "answer": {
      "type": "num",
      "value": "6/5",
      "form": "fraction"
     },
     "hint": "Cancel the 4 into the 8 before multiplying.",
     "reveal": "[[f:6/5]] = [[m:1 1/5]]."
    }
   }
  ]
 },
 {
  "id": "b092",
  "skill": "frac-muldiv",
  "kind": "short",
  "level": 1,
  "prompt": "Multiply. Write the answer in simplest form.<br>[[f:3/5]] &times; 10",
  "answer": {
   "type": "num",
   "value": "6",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "3/50",
    "misconception": "wrong-operation",
    "feedback": "You divided by 10. The problem says multiply."
   },
   {
    "value": "53/5",
    "misconception": "wrong-operation",
    "feedback": "That's [[f:3/5]] + 10."
   }
  ],
  "hint": "10 = [[f:10/1]]. Multiply tops and bottoms, then simplify.",
  "steps": [
   {
    "say": "Write 10 as a fraction.",
    "ask": {
     "prompt": "3 &times; 10 = ?",
     "answer": {
      "type": "num",
      "value": "30",
      "form": "number"
     },
     "hint": "Multiply the tops.",
     "reveal": "30, so [[f:30/5]]."
    }
   },
   {
    "say": "Simplify.",
    "ask": {
     "prompt": "[[f:30/5]] = ?",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "number"
     },
     "hint": "30 &divide; 5.",
     "reveal": "6."
    }
   }
  ]
 },
 {
  "id": "b093",
  "skill": "frac-muldiv",
  "kind": "short",
  "level": 2,
  "prompt": "Multiply. Write the answer in simplest form.<br>[[f:4/9]] &times; [[f:3/8]]",
  "answer": {
   "type": "num",
   "value": "1/6",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "7/17",
    "misconception": "add-denominators",
    "feedback": "You added tops and bottoms. Multiply them."
   },
   {
    "value": "32/27",
    "misconception": "wrong-operation",
    "feedback": "That's [[f:4/9]] &divide; [[f:3/8]]."
   }
  ],
  "hint": "Cancel before you multiply: 4 with 8, and 3 with 9.",
  "steps": [
   {
    "say": "4 and 8 share a factor.",
    "ask": {
     "prompt": "GCF of 4 and 8?",
     "answer": {
      "type": "num",
      "value": "4",
      "form": "number"
     },
     "hint": "Largest number dividing both.",
     "reveal": "4: 4 becomes 1, 8 becomes 2."
    }
   },
   {
    "say": "3 and 9 share a factor.",
    "ask": {
     "prompt": "GCF of 3 and 9?",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number"
     },
     "hint": "Largest number dividing both.",
     "reveal": "3: 3 becomes 1, 9 becomes 3."
    }
   },
   {
    "say": "Multiply what is left: [[f:1/3]] &times; [[f:1/2]].",
    "ask": {
     "prompt": "Answer?",
     "answer": {
      "type": "num",
      "value": "1/6",
      "form": "fraction"
     },
     "hint": "1 &times; 1 over 3 &times; 2.",
     "reveal": "[[f:1/6]]."
    }
   }
  ]
 },
 {
  "id": "b094",
  "skill": "frac-muldiv",
  "kind": "short",
  "level": 3,
  "prompt": "Multiply. Write the answer in simplest form.<br>[[m:1 3/5]] &times; [[m:2 1/2]]",
  "answer": {
   "type": "num",
   "value": "4",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "23/10",
    "misconception": "mixed-mult-parts",
    "feedback": "That is 2 3/10: you multiplied wholes and fractions separately."
   },
   {
    "value": "41/10",
    "misconception": "wrong-operation",
    "feedback": "That's [[m:1 3/5]] + [[m:2 1/2]]."
   }
  ],
  "hint": "Improper fractions first.",
  "steps": [
   {
    "say": "First.",
    "ask": {
     "prompt": "[[m:1 3/5]] = ___/5",
     "answer": {
      "type": "num",
      "value": "8",
      "form": "number"
     },
     "hint": "5 + 3.",
     "reveal": "8/5."
    }
   },
   {
    "say": "Second.",
    "ask": {
     "prompt": "[[m:2 1/2]] = ___/2",
     "answer": {
      "type": "num",
      "value": "5",
      "form": "number"
     },
     "hint": "4 + 1.",
     "reveal": "5/2."
    }
   },
   {
    "say": "Multiply and simplify.",
    "ask": {
     "prompt": "[[f:8/5]] &times; [[f:5/2]] = ?",
     "answer": {
      "type": "num",
      "value": "4",
      "form": "number"
     },
     "hint": "Cancel the 5s, then 8 &divide; 2.",
     "reveal": "4."
    }
   }
  ]
 },
 {
  "id": "b095",
  "skill": "frac-muldiv",
  "kind": "short",
  "level": 3,
  "prompt": "Divide. Write the answer in simplest form.<br>[[f:5/6]] &divide; [[f:5/12]]",
  "answer": {
   "type": "num",
   "value": "2",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "25/72",
    "misconception": "div-no-flip",
    "feedback": "You multiplied. Use the reciprocal of the second fraction."
   },
   {
    "value": "1/2",
    "misconception": "wrong-operation",
    "feedback": "That's [[f:5/12]] &divide; [[f:5/6]]: the order matters."
   }
  ],
  "hint": "Flip the second fraction and cancel.",
  "steps": [
   {
    "say": "Reciprocal.",
    "ask": {
     "prompt": "Reciprocal of [[f:5/12]]?",
     "answer": {
      "type": "num",
      "value": "12/5",
      "form": "fraction"
     },
     "hint": "Flip.",
     "reveal": "[[f:12/5]]."
    }
   },
   {
    "say": "Multiply and cancel.",
    "ask": {
     "prompt": "[[f:5/6]] &times; [[f:12/5]] = ?",
     "answer": {
      "type": "num",
      "value": "2",
      "form": "number"
     },
     "hint": "5s cancel; 12 &divide; 6.",
     "reveal": "2."
    }
   }
  ]
 },
 {
  "id": "b096",
  "skill": "dec-ops",
  "kind": "short",
  "level": 1,
  "prompt": "Add.<br>3.5 + 1.25",
  "answer": {
   "type": "num",
   "value": "4.75",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "1.6",
    "misconception": "decimal-align",
    "feedback": "You lined up the last digits instead of the decimal points. Write 3.50 + 1.25."
   },
   {
    "value": "4.375",
    "misconception": "wrong-operation",
    "feedback": "That's 3.5 &times; 1.25. The problem says add."
   }
  ],
  "hint": "Line up the decimal points and fill in a zero: 3.50.",
  "steps": [
   {
    "say": "Stack with the points lined up.",
    "figure": {
     "type": "columns",
     "numbers": [
      "3.5",
      "1.25"
     ],
     "op": "+"
    },
    "ask": {
     "prompt": "3.5 written with two decimal places?",
     "answer": {
      "type": "num",
      "value": "3.5",
      "form": "decimal"
     },
     "hint": "Add a zero on the end.",
     "reveal": "3.50."
    }
   },
   {
    "say": "Add.",
    "ask": {
     "prompt": "3.50 + 1.25 = ?",
     "answer": {
      "type": "num",
      "value": "4.75",
      "form": "decimal"
     },
     "hint": "Add hundredths, then tenths, then ones.",
     "reveal": "4.75."
    }
   }
  ]
 },
 {
  "id": "b097",
  "skill": "dec-ops",
  "kind": "short",
  "level": 1,
  "prompt": "Subtract.<br>8.2 − 3.75",
  "answer": {
   "type": "num",
   "value": "4.45",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "4.27",
    "misconception": "decimal-align",
    "feedback": "You turned 8.2 into 8.02. The extra zero goes on the END: 8.20."
   },
   {
    "value": "11.95",
    "misconception": "wrong-operation",
    "feedback": "That's the sum."
   }
  ],
  "hint": "Write 8.2 as 8.20 so both have two decimal places.",
  "steps": [
   {
    "say": "Fill in the missing place.",
    "figure": {
     "type": "columns",
     "numbers": [
      "8.2",
      "3.75"
     ],
     "op": "−"
    },
    "ask": {
     "prompt": "8.2 = 8.___ (hundredths digits, e.g. 25)",
     "answer": {
      "type": "num",
      "value": "20",
      "form": "number"
     },
     "hint": "Add the zero at the end.",
     "reveal": "8.20."
    }
   },
   {
    "say": "Subtract.",
    "ask": {
     "prompt": "8.20 − 3.75 = ?",
     "answer": {
      "type": "num",
      "value": "4.45",
      "form": "decimal"
     },
     "hint": "Regroup if you need to.",
     "reveal": "4.45."
    }
   }
  ]
 },
 {
  "id": "b098",
  "skill": "dec-ops",
  "kind": "short",
  "level": 1,
  "prompt": "Multiply.<br>0.4 &times; 0.3",
  "answer": {
   "type": "num",
   "value": "0.12",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "1.2",
    "misconception": "decimal-mult-places",
    "feedback": "4 &times; 3 = 12, but count the decimal places: 1 + 1 = 2 places."
   },
   {
    "value": "0.012",
    "misconception": "decimal-mult-places",
    "feedback": "Count places: 1 + 1 = 2, not 3."
   },
   {
    "value": "0.7",
    "misconception": "wrong-operation",
    "feedback": "That's 0.4 + 0.3."
   }
  ],
  "hint": "Multiply as whole numbers, then count the decimal places.",
  "steps": [
   {
    "say": "Ignore the points: 4 &times; 3.",
    "ask": {
     "prompt": "4 &times; 3 = ?",
     "answer": {
      "type": "num",
      "value": "12",
      "form": "number"
     },
     "hint": "Multiply.",
     "reveal": "12."
    }
   },
   {
    "say": "Count decimal places in the factors.",
    "ask": {
     "prompt": "How many decimal places are in 0.4 &times; 0.3 altogether?",
     "answer": {
      "type": "num",
      "value": "2",
      "form": "number"
     },
     "hint": "1 + 1.",
     "reveal": "2 places."
    }
   },
   {
    "say": "Put the point 2 places from the right.",
    "ask": {
     "prompt": "0.4 &times; 0.3 = ?",
     "answer": {
      "type": "num",
      "value": "0.12",
      "form": "decimal"
     },
     "hint": "Count two places in from the right.",
     "reveal": "0.12."
    }
   }
  ]
 },
 {
  "id": "b099",
  "skill": "dec-ops",
  "kind": "short",
  "level": 2,
  "prompt": "Multiply.<br>2.5 &times; 0.04",
  "answer": {
   "type": "num",
   "value": "0.1",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "10",
    "misconception": "decimal-mult-places",
    "feedback": "25 &times; 4 = 100. Count the places: 1 + 2 = 3, so 0.100."
   },
   {
    "value": "0.01",
    "misconception": "decimal-mult-places",
    "feedback": "100 with 3 places is 0.100 = 0.1, not 0.01."
   }
  ],
  "hint": "25 &times; 4 = 100 first, then count 3 decimal places.",
  "steps": [
   {
    "say": "Multiply as whole numbers.",
    "ask": {
     "prompt": "25 &times; 4 = ?",
     "answer": {
      "type": "num",
      "value": "100",
      "form": "number"
     },
     "hint": "Quarters.",
     "reveal": "100."
    }
   },
   {
    "say": "Places: 2.5 has 1, 0.04 has 2.",
    "ask": {
     "prompt": "Total decimal places?",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number"
     },
     "hint": "1 + 2.",
     "reveal": "3."
    }
   },
   {
    "say": "Place the point.",
    "ask": {
     "prompt": "2.5 &times; 0.04 = ?",
     "answer": {
      "type": "num",
      "value": "0.1",
      "form": "decimal"
     },
     "hint": "Count the decimal places, then move the point that many places in from the right.",
     "reveal": "0.100 = 0.1."
    }
   }
  ]
 },
 {
  "id": "b100",
  "skill": "dec-ops",
  "kind": "short",
  "level": 2,
  "prompt": "Divide.<br>3.6 &divide; 0.9",
  "answer": {
   "type": "num",
   "value": "4",
   "form": "number"
  },
  "errors": [
   {
    "value": "0.4",
    "misconception": "decimal-div-shift",
    "feedback": "You moved the point in the divisor but not in the dividend. Move BOTH the same number of places."
   },
   {
    "value": "40",
    "misconception": "decimal-div-shift",
    "feedback": "You moved the dividend two places but the divisor only one."
   }
  ],
  "hint": "Move the point in 0.9 to make 9. Do the same to 3.6.",
  "steps": [
   {
    "say": "Make the divisor a whole number.",
    "ask": {
     "prompt": "How many places do you move the point in 0.9?",
     "answer": {
      "type": "num",
      "value": "1",
      "form": "number"
     },
     "hint": "0.9 → 9.",
     "reveal": "1 place."
    }
   },
   {
    "say": "Do the same to the dividend.",
    "ask": {
     "prompt": "3.6 becomes?",
     "answer": {
      "type": "num",
      "value": "36",
      "form": "number"
     },
     "hint": "Move 1 place right.",
     "reveal": "36."
    }
   },
   {
    "say": "Divide.",
    "ask": {
     "prompt": "36 &divide; 9 = ?",
     "answer": {
      "type": "num",
      "value": "4",
      "form": "number"
     },
     "hint": "Basic fact.",
     "reveal": "4."
    }
   }
  ]
 },
 {
  "id": "b101",
  "skill": "dec-ops",
  "kind": "short",
  "level": 2,
  "prompt": "Divide.<br>4.5 &divide; 0.15",
  "answer": {
   "type": "num",
   "value": "30",
   "form": "number"
  },
  "errors": [
   {
    "value": "0.3",
    "misconception": "decimal-div-shift",
    "feedback": "You moved the point in the divisor but not in the dividend."
   },
   {
    "value": "3",
    "misconception": "decimal-div-shift",
    "feedback": "4.5 needs to move TWO places too: 450."
   }
  ],
  "hint": "Move the point two places in BOTH numbers.",
  "steps": [
   {
    "say": "Divisor 0.15 becomes 15: two places. The dividend moves two places too.",
    "ask": {
     "prompt": "4.5 becomes?",
     "answer": {
      "type": "num",
      "value": "450",
      "form": "number"
     },
     "hint": "Add a zero as a placeholder.",
     "reveal": "450."
    }
   },
   {
    "say": "Divide.",
    "ask": {
     "prompt": "450 &divide; 15 = ?",
     "answer": {
      "type": "num",
      "value": "30",
      "form": "number"
     },
     "hint": "What times 15 makes 450?",
     "reveal": "30."
    }
   }
  ]
 },
 {
  "id": "b102",
  "skill": "dec-ops",
  "kind": "short",
  "level": 2,
  "prompt": "Divide.<br>12.6 &divide; 4",
  "answer": {
   "type": "num",
   "value": "3.15",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "31.5",
    "misconception": "decimal-div-shift",
    "feedback": "Bring the decimal point straight up into the answer: 12.6 &divide; 4 is a bit over 3."
   },
   {
    "value": "8.6",
    "misconception": "wrong-operation",
    "feedback": "That's 12.6 − 4."
   }
  ],
  "hint": "Divide as usual and keep the point straight above.",
  "steps": [
   {
    "say": "Estimate first.",
    "ask": {
     "prompt": "About how big is the answer? 12 &divide; 4 =",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number"
     },
     "hint": "Basic fact.",
     "reveal": "About 3."
    }
   },
   {
    "say": "Divide 12.6 by 4.",
    "ask": {
     "prompt": "12.6 &divide; 4 = ?",
     "answer": {
      "type": "num",
      "value": "3.15",
      "form": "decimal"
     },
     "hint": "4 goes into 12 three times, with 0.6 left.",
     "reveal": "3.15."
    }
   }
  ]
 },
 {
  "id": "b103",
  "skill": "dec-ops",
  "kind": "short",
  "level": 2,
  "prompt": "Multiply.<br>0.75 &times; 12",
  "answer": {
   "type": "num",
   "value": "9",
   "form": "number"
  },
  "errors": [
   {
    "value": "90",
    "misconception": "decimal-mult-places",
    "feedback": "75 &times; 12 = 900; 0.75 has two places, so the answer is 9.00."
   },
   {
    "value": "0.9",
    "misconception": "decimal-mult-places",
    "feedback": "900 with 2 places is 9.00, not 0.9."
   },
   {
    "value": "12.75",
    "misconception": "wrong-operation",
    "feedback": "That's 12 + 0.75."
   }
  ],
  "hint": "0.75 is [[f:3/4]]. A quarter of 12 is 3.",
  "steps": [
   {
    "say": "As whole numbers.",
    "ask": {
     "prompt": "75 &times; 12 = ?",
     "answer": {
      "type": "num",
      "value": "900",
      "form": "number"
     },
     "hint": "75 &times; 10 + 75 &times; 2.",
     "reveal": "900."
    }
   },
   {
    "say": "Two decimal places.",
    "ask": {
     "prompt": "Move the point 2 places left.",
     "answer": {
      "type": "num",
      "value": "9",
      "form": "number"
     },
     "hint": "900 → 9.00.",
     "reveal": "9."
    }
   }
  ]
 },
 {
  "id": "b104",
  "skill": "dec-ops",
  "kind": "short",
  "level": 3,
  "prompt": "Add.<br>6.04 + 12.8 + 0.375",
  "answer": {
   "type": "num",
   "value": "19.215",
   "form": "decimal"
  },
  "errors": [
   {
    "value": "11.07",
    "misconception": "decimal-align",
    "feedback": "You lined up the last digits instead of the decimal points. Fill in zeros: 6.040, 12.800, 0.375."
   },
   {
    "value": "18.84",
    "misconception": "missed-step",
    "feedback": "That's only the first two numbers."
   }
  ],
  "hint": "Give all three numbers three decimal places.",
  "steps": [
   {
    "say": "Stack with points lined up.",
    "figure": {
     "type": "columns",
     "numbers": [
      "6.04",
      "12.8",
      "0.375"
     ],
     "op": "+"
    },
    "ask": {
     "prompt": "6.04 + 12.8 = ?",
     "answer": {
      "type": "num",
      "value": "18.84",
      "form": "decimal"
     },
     "hint": "6.040 + 12.800.",
     "reveal": "18.84."
    }
   },
   {
    "say": "Add the last number.",
    "ask": {
     "prompt": "18.84 + 0.375 = ?",
     "answer": {
      "type": "num",
      "value": "19.215",
      "form": "decimal"
     },
     "hint": "18.840 + 0.375.",
     "reveal": "19.215."
    }
   }
  ]
 },
 {
  "id": "b105",
  "skill": "dec-ops",
  "kind": "short",
  "level": 3,
  "prompt": "Divide.<br>0.072 &divide; 0.0006",
  "answer": {
   "type": "num",
   "value": "120",
   "form": "number"
  },
  "errors": [
   {
    "value": "12",
    "misconception": "decimal-div-shift",
    "feedback": "Move the point four places in the divisor: 0.0006 → 6. Move the dividend four places too: 0.072 → 720."
   },
   {
    "value": "1200",
    "misconception": "decimal-div-shift",
    "feedback": "Both must move the SAME number of places: 4."
   }
  ],
  "hint": "Four places in both numbers.",
  "steps": [
   {
    "say": "Divisor 0.0006 → 6 (four places). Dividend?",
    "ask": {
     "prompt": "0.072 moved four places right is?",
     "answer": {
      "type": "num",
      "value": "720",
      "form": "number"
     },
     "hint": "Move the point four places right.",
     "reveal": "720."
    }
   },
   {
    "say": "Divide.",
    "ask": {
     "prompt": "720 &divide; 6 = ?",
     "answer": {
      "type": "num",
      "value": "120",
      "form": "number"
     },
     "hint": "Basic fact.",
     "reveal": "120."
    }
   }
  ]
 },
 {
  "id": "b106",
  "skill": "rounding",
  "kind": "short",
  "level": 1,
  "prompt": "Round 4.382 to the nearest tenth.",
  "answer": {
   "type": "num",
   "value": "4.4",
   "form": "decimal",
   "rounding": {
    "mode": "nearest",
    "to": 0.1,
    "why": "Math rounding: look at the digit to the right. 5 or more, round up; 4 or less, stay."
   }
  },
  "errors": [
   {
    "value": "4.3",
    "misconception": "rounding-direction",
    "feedback": "4.3 cuts the number off. Math rounding looks at the next digit (8): 5 or more rounds up."
   },
   {
    "value": "4",
    "misconception": "missed-step",
    "feedback": "You rounded to the ones place. The question asks for tenths."
   }
  ],
  "hint": "Look at the digit right after the tenths place.",
  "steps": [
   {
    "say": "The tenths digit is 3. Look at the digit to its right.",
    "figure": {
     "type": "roundline",
     "value": "4.382",
     "step": 0.1,
     "mode": "nearest"
    },
    "ask": {
     "prompt": "What digit is in the hundredths place of 4.382?",
     "answer": {
      "type": "num",
      "value": "8",
      "form": "number"
     },
     "hint": "First digit after the tenths.",
     "reveal": "8."
    }
   },
   {
    "say": "8 is 5 or more.",
    "ask": {
     "prompt": "So 4.382 rounds to ___ (nearest tenth).",
     "answer": {
      "type": "num",
      "value": "4.4",
      "form": "decimal"
     },
     "hint": "Round the 3 up.",
     "reveal": "4.4."
    }
   }
  ]
 },
 {
  "id": "b107",
  "skill": "rounding",
  "kind": "short",
  "level": 1,
  "prompt": "Round 7.065 to the nearest hundredth.",
  "answer": {
   "type": "num",
   "value": "7.07",
   "form": "decimal",
   "rounding": {
    "mode": "nearest",
    "to": 0.01,
    "why": "Math rounding: look at the digit to the right. 5 or more, round up; 4 or less, stay."
   }
  },
  "errors": [
   {
    "value": "7.06",
    "misconception": "rounding-direction",
    "feedback": "7.06 cuts it off. A 5 in the next place rounds UP."
   },
   {
    "value": "7.1",
    "misconception": "missed-step",
    "feedback": "That's the nearest tenth. The question asks for hundredths."
   }
  ],
  "hint": "Look at the digit after the hundredths place.",
  "steps": [
   {
    "say": "The hundredths digit is 6; the next digit is 5.",
    "ask": {
     "prompt": "Does a 5 round up or stay?",
     "answer": {
      "type": "choice",
      "choices": [
       "Round up",
       "Stay"
      ],
      "correct": 0
     },
     "hint": "5 or more rounds up.",
     "reveal": "Round up: 5 or more."
    }
   },
   {
    "say": "Round.",
    "ask": {
     "prompt": "7.065 ≈ ?",
     "answer": {
      "type": "num",
      "value": "7.07",
      "form": "decimal"
     },
     "hint": "What happens to the 6 when the next digit is 5?",
     "reveal": "7.07."
    }
   }
  ]
 },
 {
  "id": "b108",
  "skill": "rounding",
  "kind": "short",
  "level": 1,
  "prompt": "Round 38.5 to the nearest whole number.",
  "answer": {
   "type": "num",
   "value": "39",
   "form": "number",
   "rounding": {
    "mode": "nearest",
    "to": 1,
    "why": "Math rounding: look at the digit to the right. 5 or more, round up; 4 or less, stay."
   }
  },
  "errors": [
   {
    "value": "38",
    "misconception": "rounding-direction",
    "feedback": "A 5 in the tenths place rounds UP: 38.5 → 39."
   },
   {
    "value": "40",
    "misconception": "missed-step",
    "feedback": "That's the nearest ten. The question asks for the nearest whole number."
   }
  ],
  "hint": "Look at the tenths digit.",
  "steps": [
   {
    "say": "Tenths digit.",
    "figure": {
     "type": "roundline",
     "value": "38.5",
     "step": 1,
     "mode": "nearest"
    },
    "ask": {
     "prompt": "What is the tenths digit of 38.5?",
     "answer": {
      "type": "num",
      "value": "5",
      "form": "number"
     },
     "hint": "First digit after the point.",
     "reveal": "5."
    }
   },
   {
    "say": "Round.",
    "ask": {
     "prompt": "38.5 ≈ ?",
     "answer": {
      "type": "num",
      "value": "39",
      "form": "number"
     },
     "hint": "5 rounds up.",
     "reveal": "39."
    }
   }
  ]
 },
 {
  "id": "b109",
  "skill": "rounding",
  "kind": "short",
  "level": 2,
  "prompt": "Round 0.0857 to the nearest hundredth.",
  "answer": {
   "type": "num",
   "value": "0.09",
   "form": "decimal",
   "rounding": {
    "mode": "nearest",
    "to": 0.01,
    "why": "Math rounding: look at the digit to the right. 5 or more, round up; 4 or less, stay."
   }
  },
  "errors": [
   {
    "value": "0.08",
    "misconception": "rounding-direction",
    "feedback": "The next digit is 5, so round UP."
   },
   {
    "value": "0.1",
    "misconception": "missed-step",
    "feedback": "That's the nearest tenth. We want hundredths."
   }
  ],
  "hint": "The hundredths digit is 8. Check the next digit.",
  "steps": [
   {
    "say": "Digits: 0.0 8 5 7.",
    "ask": {
     "prompt": "What digit follows the 8?",
     "answer": {
      "type": "num",
      "value": "5",
      "form": "number"
     },
     "hint": "Next to the right.",
     "reveal": "5."
    }
   },
   {
    "say": "Round.",
    "ask": {
     "prompt": "0.0857 ≈ ?",
     "answer": {
      "type": "num",
      "value": "0.09",
      "form": "decimal"
     },
     "hint": "Does the 8 go up or stay the same?",
     "reveal": "0.09."
    }
   }
  ]
 },
 {
  "id": "b110",
  "skill": "rounding",
  "kind": "short",
  "level": 3,
  "prompt": "Round 5.996 to the nearest hundredth.",
  "figure": {
   "type": "roundline",
   "value": "5.996",
   "step": 0.01,
   "mode": "nearest"
  },
  "answer": {
   "type": "num",
   "value": "6",
   "form": "decimal",
   "rounding": {
    "mode": "nearest",
    "to": 0.01,
    "why": "Math rounding: look at the digit to the right. 5 or more, round up; 4 or less, stay."
   }
  },
  "errors": [
   {
    "value": "5.99",
    "misconception": "rounding-direction",
    "feedback": "The next digit is 6, so the 9 in the hundredths place rounds up."
   },
   {
    "value": "6.01",
    "misconception": "rounding-direction",
    "feedback": "A 9 rounded up carries: 5.99 + 0.01 = 6.00."
   }
  ],
  "hint": "Round the second 9 up. What happens when 9 + 1?",
  "steps": [
   {
    "say": "Hundredths digit is 9; next digit is 6.",
    "ask": {
     "prompt": "Round the 9 up: 5.99 + 0.01 = ?",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "decimal"
     },
     "hint": "Carry.",
     "reveal": "6.00."
    }
   },
   {
    "say": "Write it with two decimal places.",
    "ask": {
     "prompt": "5.996 ≈ ?",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "decimal"
     },
     "hint": "Write it with two decimal places, then simplify.",
     "reveal": "6.00."
    }
   }
  ]
 },
 {
  "id": "b111",
  "skill": "rounding",
  "kind": "word",
  "level": 1,
  "prompt": "A school is taking 150 students on a field trip. Each bus holds 24 students. How many buses does the school have to order?",
  "answer": {
   "type": "num",
   "value": "7",
   "form": "number",
   "label": [
    "buses",
    "bus",
    "busses"
   ],
   "rounding": {
    "mode": "up",
    "to": 1,
    "why": "You can't buy or use part of one: when you need ENOUGH, round UP to the next whole number."
   }
  },
  "errors": [
   {
    "value": "6",
    "misconception": "math-vs-real-rounding",
    "feedback": "6 buses hold only 144 students, so 6 students would be left behind. When you need enough, round UP."
   },
   {
    "value": "25/4",
    "misconception": "missed-step",
    "feedback": "You cannot order 6 1/4 buses. Round to a whole bus."
   }
  ],
  "hint": "Divide, then think: can a bus be split?",
  "steps": [
   {
    "say": "How many 24s fit into 150?",
    "figure": {
     "type": "roundline",
     "value": "6.25",
     "step": 1,
     "mode": "up"
    },
    "ask": {
     "prompt": "150 &divide; 24 = ? (as a mixed number)",
     "answer": {
      "type": "num",
      "value": "25/4",
      "form": "fraction"
     },
     "hint": "24 &times; 6 = 144.",
     "reveal": "6 6/24 = 6 1/4 buses."
    }
   },
   {
    "say": "6 buses carry 144 students. 6 students are left.",
    "ask": {
     "prompt": "So the school must order ___ buses.",
     "answer": {
      "type": "num",
      "value": "7",
      "form": "number",
      "label": [
       "buses",
       "bus",
       "busses"
      ]
     },
     "hint": "Everyone needs a seat.",
     "reveal": "7 buses."
    }
   }
  ]
 },
 {
  "id": "b112",
  "skill": "rounding",
  "kind": "word",
  "level": 2,
  "prompt": "Max has $20. Granola bars cost $3.40 each. What is the greatest number of granola bars he can buy?",
  "answer": {
   "type": "num",
   "value": "5",
   "form": "number",
   "label": [
    "bars",
    "granola bars",
    "bar"
   ],
   "rounding": {
    "mode": "down",
    "to": 1,
    "why": "You can only use whole items: when you can only AFFORD or FIT so many, round DOWN."
   }
  },
  "errors": [
   {
    "value": "6",
    "misconception": "math-vs-real-rounding",
    "feedback": "6 bars cost $20.40, which is more than $20. When you can only afford so many, round DOWN."
   },
   {
    "value": "5.88",
    "misconception": "missed-step",
    "feedback": "You can't buy part of a bar. Give a whole number."
   }
  ],
  "hint": "Check what 6 bars would cost.",
  "steps": [
   {
    "say": "Divide the money by the price.",
    "figure": {
     "type": "roundline",
     "value": "5.88",
     "step": 1,
     "mode": "down"
    },
    "ask": {
     "prompt": "What do 6 bars cost?  6 &times; 3.40 = ?",
     "answer": {
      "type": "num",
      "value": "20.4",
      "form": "money"
     },
     "hint": "6 &times; 3 + 6 &times; 0.40.",
     "reveal": "$20.40: too much."
    }
   },
   {
    "say": "So he can only afford 5.",
    "ask": {
     "prompt": "Greatest number of bars?",
     "answer": {
      "type": "num",
      "value": "5",
      "form": "number",
      "label": [
       "bars",
       "granola bars",
       "bar"
      ]
     },
     "hint": "Round down.",
     "reveal": "5 bars ($17.00)."
    }
   }
  ]
 },
 {
  "id": "b113",
  "skill": "rounding",
  "kind": "word",
  "level": 2,
  "prompt": "Dani is baking muffins for a bake sale. One batch makes 18 muffins, and she wants at least 94 muffins. How many batches must she bake?",
  "answer": {
   "type": "num",
   "value": "6",
   "form": "number",
   "label": [
    "batches",
    "batch"
   ],
   "rounding": {
    "mode": "up",
    "to": 1,
    "why": "You can't buy or use part of one: when you need ENOUGH, round UP to the next whole number."
   }
  },
  "errors": [
   {
    "value": "5",
    "misconception": "math-vs-real-rounding",
    "feedback": "5 batches make only 90 muffins. She wants AT LEAST 94, so round UP."
   },
   {
    "value": "47/9",
    "misconception": "missed-step",
    "feedback": "She can't bake 5 2/9 batches. Round to a whole batch."
   }
  ],
  "hint": "Divide, then ask whether the smaller whole number is enough.",
  "steps": [
   {
    "say": "94 &divide; 18 is a little more than 5.",
    "figure": {
     "type": "roundline",
     "value": "5.22",
     "step": 1,
     "mode": "up"
    },
    "ask": {
     "prompt": "How many muffins do 5 batches make?",
     "answer": {
      "type": "num",
      "value": "90",
      "form": "number"
     },
     "hint": "5 &times; 18.",
     "reveal": "90: not enough."
    }
   },
   {
    "say": "She needs one more batch.",
    "ask": {
     "prompt": "Number of batches?",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "number",
      "label": [
       "batches",
       "batch"
      ]
     },
     "hint": "5 + 1.",
     "reveal": "6 batches."
    }
   }
  ]
 },
 {
  "id": "b114",
  "skill": "rounding",
  "kind": "word",
  "level": 2,
  "prompt": "A 3-pack of pens costs $5.00. What is the price of one pen, to the nearest cent?",
  "answer": {
   "type": "num",
   "value": "1.67",
   "form": "money",
   "rounding": {
    "mode": "nearest",
    "to": 0.01,
    "why": "Money is rounded to the nearest cent (two decimal places)."
   }
  },
  "errors": [
   {
    "value": "1.66",
    "misconception": "rounding-direction",
    "feedback": "$1.66 cuts it off. The next digit is 6, so round the cents UP."
   },
   {
    "value": "1.6667",
    "misconception": "money-cents",
    "feedback": "Money goes to the cent: exactly 2 decimal places."
   }
  ],
  "hint": "Divide 5 by 3 and stop at the cents. Look at the next digit.",
  "steps": [
   {
    "say": "5 &divide; 3 = 1.6666…",
    "figure": {
     "type": "roundline",
     "value": "1.6666",
     "step": 0.01,
     "mode": "nearest"
    },
    "ask": {
     "prompt": "What digit comes right after the cents (1.66…)?",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "number"
     },
     "hint": "The third decimal place.",
     "reveal": "6."
    }
   },
   {
    "say": "6 rounds up.",
    "ask": {
     "prompt": "One pen costs ___ (nearest cent).",
     "answer": {
      "type": "num",
      "value": "1.67",
      "form": "money"
     },
     "hint": "Raise the cents digit by one.",
     "reveal": "$1.67."
    }
   }
  ]
 },
 {
  "id": "b115",
  "skill": "rounding",
  "kind": "word",
  "level": 3,
  "prompt": "A 22-foot rope is cut into pieces that are each [[m:4 1/2]] feet long. How many whole pieces can be cut?",
  "answer": {
   "type": "num",
   "value": "4",
   "form": "number",
   "label": [
    "pieces",
    "piece"
   ],
   "rounding": {
    "mode": "down",
    "to": 1,
    "why": "You can only use whole items: when you can only AFFORD or FIT so many, round DOWN."
   }
  },
  "errors": [
   {
    "value": "5",
    "misconception": "math-vs-real-rounding",
    "feedback": "5 pieces need 22.5 feet, but the rope is only 22 feet. Round DOWN."
   },
   {
    "value": "44/9",
    "misconception": "missed-step",
    "feedback": "You can't cut 4 8/9 pieces. Whole pieces only."
   }
  ],
  "hint": "How much rope would 5 pieces need?",
  "steps": [
   {
    "say": "22 &divide; 4 1/2 = 22 &times; 2/9.",
    "figure": {
     "type": "roundline",
     "value": "4.89",
     "step": 1,
     "mode": "down"
    },
    "ask": {
     "prompt": "22 &divide; [[m:4 1/2]] = ? (mixed number)",
     "answer": {
      "type": "num",
      "value": "44/9",
      "form": "fraction"
     },
     "hint": "22 &times; [[f:2/9]].",
     "reveal": "[[m:4 8/9]]."
    }
   },
   {
    "say": "Only whole pieces count.",
    "ask": {
     "prompt": "Whole pieces?",
     "answer": {
      "type": "num",
      "value": "4",
      "form": "number",
      "label": [
       "pieces",
       "piece"
      ]
     },
     "hint": "Round down.",
     "reveal": "4 pieces."
    }
   }
  ]
 },
 {
  "id": "b116",
  "skill": "rounding",
  "kind": "word",
  "level": 3,
  "prompt": "A soup recipe needs [[m:4 1/4]] cups of chicken broth. Broth is sold only in 2-cup cartons. How many cartons must Leo buy?",
  "answer": {
   "type": "num",
   "value": "3",
   "form": "number",
   "label": [
    "cartons",
    "carton"
   ],
   "rounding": {
    "mode": "up",
    "to": 1,
    "why": "You can't buy or use part of one: when you need ENOUGH, round UP to the next whole number."
   }
  },
  "errors": [
   {
    "value": "2",
    "misconception": "math-vs-real-rounding",
    "feedback": "2 cartons hold only 4 cups, but he needs 4 1/4. Round UP."
   },
   {
    "value": "17/8",
    "misconception": "missed-step",
    "feedback": "He can't buy 2 1/8 cartons. Whole cartons only."
   }
  ],
  "hint": "Do 2 cartons hold enough?",
  "steps": [
   {
    "say": "[[m:4 1/4]] &divide; 2.",
    "figure": {
     "type": "roundline",
     "value": "2.125",
     "step": 1,
     "mode": "up"
    },
    "ask": {
     "prompt": "[[m:4 1/4]] &divide; 2 = ? (mixed number)",
     "answer": {
      "type": "num",
      "value": "17/8",
      "form": "fraction"
     },
     "hint": "[[f:17/4]] &times; [[f:1/2]].",
     "reveal": "[[m:2 1/8]]."
    }
   },
   {
    "say": "2 cartons are not enough.",
    "ask": {
     "prompt": "Cartons to buy?",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number",
      "label": [
       "cartons",
       "carton"
      ]
     },
     "hint": "Round up.",
     "reveal": "3 cartons."
    }
   }
  ]
 },
 {
  "id": "b117",
  "skill": "rounding",
  "kind": "word",
  "level": 3,
  "prompt": "A $47.40 bill is split equally among 7 friends. Each pays a whole number of cents, and together they must cover at least the full bill. How much does each friend pay?",
  "answer": {
   "type": "num",
   "value": "6.78",
   "form": "money",
   "rounding": {
    "mode": "up",
    "to": 0.01,
    "why": "Together they must cover the full bill, so round the cents UP, not to the nearest."
   }
  },
  "errors": [
   {
    "value": "6.77",
    "misconception": "math-vs-real-rounding",
    "feedback": "7 &times; $6.77 = $47.39, one cent short. Round UP so the bill is covered."
   },
   {
    "value": "6.7714",
    "misconception": "money-cents",
    "feedback": "Money goes to the cent: exactly 2 decimal places."
   }
  ],
  "hint": "Check whether 7 payments of $6.77 are enough.",
  "steps": [
   {
    "say": "47.40 &divide; 7 = 6.7714…",
    "figure": {
     "type": "roundline",
     "value": "6.7714",
     "step": 0.01,
     "mode": "up"
    },
    "ask": {
     "prompt": "7 &times; 6.77 = ?",
     "answer": {
      "type": "num",
      "value": "47.39",
      "form": "money"
     },
     "hint": "7 &times; 6 + 7 &times; 0.77.",
     "reveal": "$47.39: one cent short."
    }
   },
   {
    "say": "Round up to the next cent.",
    "ask": {
     "prompt": "Each friend pays?",
     "answer": {
      "type": "num",
      "value": "6.78",
      "form": "money"
     },
     "hint": "6.77 + 0.01.",
     "reveal": "$6.78 (7 &times; 6.78 = $47.46)."
    }
   }
  ]
 },
 {
  "id": "b118",
  "skill": "rounding",
  "kind": "word",
  "level": 2,
  "prompt": "A pickup truck can carry at most 1,000 pounds. Each box weighs 35 pounds. How many boxes can the truck carry?",
  "answer": {
   "type": "num",
   "value": "28",
   "form": "number",
   "label": [
    "boxes",
    "box"
   ],
   "rounding": {
    "mode": "down",
    "to": 1,
    "why": "You can only use whole items: when you can only AFFORD or FIT so many, round DOWN."
   }
  },
  "errors": [
   {
    "value": "29",
    "misconception": "math-vs-real-rounding",
    "feedback": "29 boxes weigh 1,015 pounds: over the limit. Round DOWN."
   },
   {
    "value": "200/7",
    "misconception": "missed-step",
    "feedback": "You can't carry part of a box. Whole boxes only."
   }
  ],
  "hint": "What would 29 boxes weigh?",
  "steps": [
   {
    "say": "29 boxes?",
    "figure": {
     "type": "roundline",
     "value": "28.57",
     "step": 1,
     "mode": "down"
    },
    "ask": {
     "prompt": "29 &times; 35 = ?",
     "answer": {
      "type": "num",
      "value": "1015",
      "form": "number"
     },
     "hint": "30 &times; 35 − 35.",
     "reveal": "1,015: over 1,000."
    }
   },
   {
    "say": "So the truck can carry…",
    "ask": {
     "prompt": "Boxes?",
     "answer": {
      "type": "num",
      "value": "28",
      "form": "number",
      "label": [
       "boxes",
       "box"
      ]
     },
     "hint": "Round down.",
     "reveal": "28 boxes (980 pounds)."
    }
   }
  ]
 },
 {
  "id": "b119",
  "skill": "word-frac",
  "kind": "word",
  "level": 1,
  "prompt": "A cookie recipe uses [[f:3/4]] cup of white sugar and [[f:2/3]] cup of brown sugar. How much sugar does the recipe use in all?",
  "answer": {
   "type": "num",
   "value": "17/12",
   "form": "fraction",
   "label": [
    "cups",
    "cup",
    "c"
   ]
  },
  "errors": [
   {
    "value": "5/7",
    "misconception": "add-denominators",
    "feedback": "You added tops and bottoms. Fourths and thirds need a common denominator."
   },
   {
    "value": "1/12",
    "misconception": "wrong-operation",
    "feedback": "That's the DIFFERENCE. 'In all' means add."
   }
  ],
  "hint": "Find a common denominator for 4 and 3 (it's 12).",
  "steps": [
   {
    "say": "Fourths and thirds are different-size pieces.",
    "figure": {
     "type": "fracbar",
     "rows": [
      {
       "parts": 12,
       "shaded": 9,
       "label": "[[f:3/4]]"
      },
      {
       "parts": 12,
       "shaded": 8,
       "label": "[[f:2/3]]"
      }
     ]
    },
    "ask": {
     "prompt": "[[f:3/4]] = ___/12",
     "answer": {
      "type": "num",
      "value": "9",
      "form": "number"
     },
     "hint": "4 &times; 3 = 12.",
     "reveal": "9/12."
    }
   },
   {
    "say": "And the other.",
    "ask": {
     "prompt": "[[f:2/3]] = ___/12",
     "answer": {
      "type": "num",
      "value": "8",
      "form": "number"
     },
     "hint": "3 &times; 4 = 12.",
     "reveal": "8/12."
    }
   },
   {
    "say": "Add and write the label.",
    "ask": {
     "prompt": "9/12 + 8/12 = ? (include the label)",
     "answer": {
      "type": "num",
      "value": "17/12",
      "form": "fraction",
      "label": [
       "cups",
       "cup",
       "c"
      ]
     },
     "hint": "Add tops.",
     "reveal": "[[f:17/12]] = [[m:1 5/12]] cups."
    }
   }
  ]
 },
 {
  "id": "b120",
  "skill": "word-frac",
  "kind": "word",
  "level": 1,
  "prompt": "A board is [[m:8 1/2]] feet long. Max cuts off a piece that is [[m:2 3/4]] feet long. How long is the board that is left?",
  "answer": {
   "type": "num",
   "value": "23/4",
   "form": "fraction",
   "label": [
    "feet",
    "foot",
    "ft"
   ]
  },
  "errors": [
   {
    "value": "25/4",
    "misconception": "regroup-mixed",
    "feedback": "That is 6 1/4. [[f:3/4]] is more than [[f:1/2]], so you must regroup before subtracting."
   },
   {
    "value": "45/4",
    "misconception": "wrong-operation",
    "feedback": "That's the total. Cutting off means subtract."
   }
  ],
  "hint": "Rename [[f:1/2]] as [[f:2/4]], then regroup.",
  "steps": [
   {
    "say": "Common denominator is 4.",
    "ask": {
     "prompt": "[[m:8 1/2]] = 8 and ___/4",
     "answer": {
      "type": "num",
      "value": "2",
      "form": "number"
     },
     "hint": "1/2 = 2/4.",
     "reveal": "8 2/4."
    }
   },
   {
    "say": "2/4 is less than 3/4. Regroup.",
    "ask": {
     "prompt": "[[m:8 2/4]] = 7 and ___/4",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "number"
     },
     "hint": "1 whole = 4/4, plus 2/4.",
     "reveal": "7 6/4."
    }
   },
   {
    "say": "Subtract.",
    "ask": {
     "prompt": "[[m:7 6/4]] − [[m:2 3/4]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "23/4",
      "form": "fraction",
      "label": [
       "feet",
       "foot",
       "ft"
      ]
     },
     "hint": "5 and 3/4.",
     "reveal": "[[m:5 3/4]] feet."
    }
   }
  ]
 },
 {
  "id": "b121",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "How many [[f:3/4]]-cup servings of rice are in a 6-cup bag?",
  "answer": {
   "type": "num",
   "value": "8",
   "form": "number",
   "label": [
    "servings",
    "serving"
   ]
  },
  "errors": [
   {
    "value": "9/2",
    "misconception": "wrong-operation",
    "feedback": "You multiplied. 'How many servings fit' is a division: 6 &divide; [[f:3/4]]."
   },
   {
    "value": "1/8",
    "misconception": "wrong-operation",
    "feedback": "You divided the other way round: [[f:3/4]] &divide; 6."
   }
  ],
  "hint": "How many groups of [[f:3/4]] fit into 6?",
  "steps": [
   {
    "say": "Draw 6 cups and cut them into three-quarter groups.",
    "figure": {
     "type": "groups",
     "total": "6",
     "size": "3/4",
     "unit": "cups"
    },
    "ask": {
     "prompt": "Which operation?",
     "answer": {
      "type": "choice",
      "choices": [
       "6 &divide; [[f:3/4]]",
       "6 &times; [[f:3/4]]"
      ],
      "correct": 0
     },
     "hint": "'How many groups fit' means divide.",
     "reveal": "Divide."
    }
   },
   {
    "say": "Multiply by the reciprocal.",
    "ask": {
     "prompt": "6 &times; [[f:4/3]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "8",
      "form": "number",
      "label": [
       "servings",
       "serving"
      ]
     },
     "hint": "6 &divide; 3 &times; 4.",
     "reveal": "8 servings."
    }
   }
  ]
 },
 {
  "id": "b122",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "Lena runs [[m:2 1/4]] miles each day for 5 days. On Saturday she also runs [[m:1 1/2]] miles. How many miles does she run altogether?",
  "answer": {
   "type": "num",
   "value": "51/4",
   "form": "fraction",
   "label": [
    "miles",
    "mile",
    "mi"
   ]
  },
  "errors": [
   {
    "value": "45/4",
    "misconception": "missed-step",
    "feedback": "That is 11 1/4: only the 5 days. Add Saturday's run."
   },
   {
    "value": "15/4",
    "misconception": "missed-step",
    "feedback": "That is 3 3/4: you added [[m:2 1/4]] + [[m:1 1/2]] but forgot to multiply by 5 days."
   }
  ],
  "hint": "First find the distance for the 5 days, then add Saturday.",
  "steps": [
   {
    "say": "Five days of [[m:2 1/4]].",
    "ask": {
     "prompt": "[[m:2 1/4]] &times; 5 = ? (fraction or mixed number)",
     "answer": {
      "type": "num",
      "value": "45/4",
      "form": "fraction"
     },
     "hint": "[[f:9/4]] &times; 5.",
     "reveal": "[[f:45/4]] = [[m:11 1/4]]."
    }
   },
   {
    "say": "Add Saturday.",
    "ask": {
     "prompt": "[[m:11 1/4]] + [[m:1 1/2]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "51/4",
      "form": "fraction",
      "label": [
       "miles",
       "mile",
       "mi"
      ]
     },
     "hint": "1/4 + 2/4 = 3/4.",
     "reveal": "[[m:12 3/4]] miles."
    }
   }
  ]
 },
 {
  "id": "b123",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "A movie is [[m:2 1/4]] hours long. Jonah has watched [[f:2/3]] of it. How many hours of the movie has he watched?",
  "answer": {
   "type": "num",
   "value": "3/2",
   "form": "fraction",
   "label": [
    "hours",
    "hour",
    "hr",
    "hrs",
    "h"
   ]
  },
  "errors": [
   {
    "value": "27/8",
    "misconception": "wrong-operation",
    "feedback": "That is 3 3/8: you divided. '[[f:2/3]] of' means multiply."
   },
   {
    "value": "35/12",
    "misconception": "wrong-operation",
    "feedback": "That is 2 11/12: you added."
   }
  ],
  "hint": "'Of' means multiply.",
  "steps": [
   {
    "say": "Mixed number to improper fraction.",
    "ask": {
     "prompt": "[[m:2 1/4]] = ___/4",
     "answer": {
      "type": "num",
      "value": "9",
      "form": "number"
     },
     "hint": "2 &times; 4 + 1.",
     "reveal": "9/4."
    }
   },
   {
    "say": "Multiply and simplify.",
    "ask": {
     "prompt": "[[f:9/4]] &times; [[f:2/3]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "3/2",
      "form": "fraction",
      "label": [
       "hours",
       "hour",
       "hr",
       "hrs",
       "h"
      ]
     },
     "hint": "Cancel 3s and 2s.",
     "reveal": "[[f:3/2]] = [[m:1 1/2]] hours."
    }
   }
  ]
 },
 {
  "id": "b124",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "A 12-foot board is cut into pieces that are each [[m:1 1/2]] feet long. How many pieces are there?",
  "answer": {
   "type": "num",
   "value": "8",
   "form": "number",
   "label": [
    "pieces",
    "piece"
   ]
  },
  "errors": [
   {
    "value": "18",
    "misconception": "wrong-operation",
    "feedback": "You multiplied. How many pieces FIT is a division."
   },
   {
    "value": "1/8",
    "misconception": "wrong-operation",
    "feedback": "You divided the other way round."
   }
  ],
  "hint": "How many groups of [[m:1 1/2]] fit in 12?",
  "steps": [
   {
    "say": "Picture the board.",
    "figure": {
     "type": "groups",
     "total": "12",
     "size": "3/2",
     "unit": "feet"
    },
    "ask": {
     "prompt": "[[m:1 1/2]] = ___/2",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number"
     },
     "hint": "1 &times; 2 + 1.",
     "reveal": "3/2."
    }
   },
   {
    "say": "Divide.",
    "ask": {
     "prompt": "12 &divide; [[f:3/2]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "8",
      "form": "number",
      "label": [
       "pieces",
       "piece"
      ]
     },
     "hint": "12 &times; [[f:2/3]].",
     "reveal": "8 pieces."
    }
   }
  ]
 },
 {
  "id": "b125",
  "skill": "word-frac",
  "kind": "word",
  "level": 3,
  "prompt": "A pitcher holds [[m:3 1/2]] quarts of lemonade. Dan pours 9 cups, and each cup holds [[f:1/4]] quart. How many quarts are left in the pitcher?",
  "answer": {
   "type": "num",
   "value": "5/4",
   "form": "fraction",
   "label": [
    "quarts",
    "quart",
    "qt"
   ]
  },
  "errors": [
   {
    "value": "9/4",
    "misconception": "missed-step",
    "feedback": "That is 2 1/4 quarts: the amount Dan POURED. The question asks what is left."
   },
   {
    "value": "23/4",
    "misconception": "wrong-operation",
    "feedback": "That is 5 3/4: you added the poured amount instead of subtracting."
   }
  ],
  "hint": "First find how many quarts 9 cups hold.",
  "steps": [
   {
    "say": "9 cups of [[f:1/4]] quart.",
    "ask": {
     "prompt": "9 &times; [[f:1/4]] = ? (fraction)",
     "answer": {
      "type": "num",
      "value": "9/4",
      "form": "fraction"
     },
     "hint": "9 quarters.",
     "reveal": "[[f:9/4]] = [[m:2 1/4]] quarts."
    }
   },
   {
    "say": "Subtract from what was in the pitcher.",
    "ask": {
     "prompt": "[[m:3 1/2]] − [[m:2 1/4]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "5/4",
      "form": "fraction",
      "label": [
       "quarts",
       "quart",
       "qt"
      ]
     },
     "hint": "3 2/4 − 2 1/4.",
     "reveal": "[[m:1 1/4]] quarts."
    }
   }
  ]
 },
 {
  "id": "b126",
  "skill": "word-frac",
  "kind": "word",
  "level": 3,
  "prompt": "A rope is [[m:15 3/4]] feet long. It is cut into 3 equal pieces. Then [[m:1 1/4]] feet is trimmed off one piece. How long is that piece now?",
  "answer": {
   "type": "num",
   "value": "4",
   "form": "number",
   "label": [
    "feet",
    "foot",
    "ft"
   ]
  },
  "errors": [
   {
    "value": "29/2",
    "misconception": "missed-step",
    "feedback": "That is 14 1/2: you trimmed the whole rope, not one piece."
   },
   {
    "value": "21/4",
    "misconception": "missed-step",
    "feedback": "That is 5 1/4 feet: the piece BEFORE trimming."
   }
  ],
  "hint": "Divide first, then trim.",
  "steps": [
   {
    "say": "One piece.",
    "ask": {
     "prompt": "[[m:15 3/4]] &divide; 3 = ? (mixed number or fraction)",
     "answer": {
      "type": "num",
      "value": "21/4",
      "form": "fraction"
     },
     "hint": "[[f:63/4]] &times; [[f:1/3]].",
     "reveal": "[[m:5 1/4]] feet."
    }
   },
   {
    "say": "Trim it.",
    "ask": {
     "prompt": "[[m:5 1/4]] − [[m:1 1/4]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "4",
      "form": "number",
      "label": [
       "feet",
       "foot",
       "ft"
      ]
     },
     "hint": "Subtract wholes and fractions.",
     "reveal": "4 feet."
    }
   }
  ]
 },
 {
  "id": "b127",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "Mia spent [[f:1/3]] of her allowance on lunch and [[f:1/4]] on a book. What fraction of her allowance is left?",
  "answer": {
   "type": "num",
   "value": "5/12",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "7/12",
    "misconception": "missed-step",
    "feedback": "[[f:7/12]] is what she SPENT. The question asks what is left."
   },
   {
    "value": "1/12",
    "misconception": "wrong-operation",
    "feedback": "That is [[f:1/3]] − [[f:1/4]]."
   }
  ],
  "hint": "Add what she spent, then subtract from the whole allowance (= 1).",
  "steps": [
   {
    "say": "Total spent.",
    "ask": {
     "prompt": "[[f:1/3]] + [[f:1/4]] = ?",
     "answer": {
      "type": "num",
      "value": "7/12",
      "form": "fraction"
     },
     "hint": "4/12 + 3/12.",
     "reveal": "[[f:7/12]]."
    }
   },
   {
    "say": "What's left.",
    "ask": {
     "prompt": "1 − [[f:7/12]] = ?",
     "answer": {
      "type": "num",
      "value": "5/12",
      "form": "fraction"
     },
     "hint": "1 = 12/12.",
     "reveal": "[[f:5/12]] of her allowance."
    }
   }
  ]
 },
 {
  "id": "b128",
  "skill": "word-frac",
  "kind": "word",
  "level": 3,
  "prompt": "Sam's garden covers [[f:3/4]] of an acre. He plants [[f:2/3]] of the garden with vegetables, and half of the vegetable part is tomatoes. How much of an acre is tomatoes?",
  "answer": {
   "type": "num",
   "value": "1/4",
   "form": "fraction",
   "label": [
    "acre",
    "acres",
    "of an acre"
   ]
  },
  "errors": [
   {
    "value": "1/2",
    "misconception": "missed-step",
    "feedback": "That is the whole vegetable part. Tomatoes are only half of it."
   },
   {
    "value": "3/8",
    "misconception": "missed-step",
    "feedback": "You skipped the [[f:2/3]]: tomatoes are half of the vegetables, not half of the garden."
   }
  ],
  "hint": "Take [[f:2/3]] of [[f:3/4]], then half of that.",
  "steps": [
   {
    "say": "Vegetable part.",
    "figure": {
     "type": "area",
     "a": "2/3",
     "b": "3/4"
    },
    "ask": {
     "prompt": "[[f:2/3]] &times; [[f:3/4]] = ?",
     "answer": {
      "type": "num",
      "value": "1/2",
      "form": "fraction"
     },
     "hint": "Cancel the 3s.",
     "reveal": "[[f:1/2]] acre."
    }
   },
   {
    "say": "Half of that.",
    "ask": {
     "prompt": "[[f:1/2]] &times; [[f:1/2]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "1/4",
      "form": "fraction",
      "label": [
       "acre",
       "acres",
       "of an acre"
      ]
     },
     "hint": "Half of a half.",
     "reveal": "[[f:1/4]] acre."
    }
   }
  ]
 },
 {
  "id": "b129",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "A hiking trail is [[m:4 1/2]] miles long. Hikers cover [[f:3/4]] mile each hour. How many hours does the trail take?",
  "answer": {
   "type": "num",
   "value": "6",
   "form": "number",
   "label": [
    "hours",
    "hour",
    "hr",
    "hrs",
    "h"
   ]
  },
  "errors": [
   {
    "value": "27/8",
    "misconception": "wrong-operation",
    "feedback": "That is 3 3/8: you multiplied. Hours = distance &divide; speed."
   },
   {
    "value": "1/6",
    "misconception": "wrong-operation",
    "feedback": "You divided the other way round."
   }
  ],
  "hint": "How many groups of [[f:3/4]] mile fit in [[m:4 1/2]] miles?",
  "steps": [
   {
    "say": "Improper fraction.",
    "ask": {
     "prompt": "[[m:4 1/2]] = ___/2",
     "answer": {
      "type": "num",
      "value": "9",
      "form": "number"
     },
     "hint": "4 &times; 2 + 1.",
     "reveal": "9/2."
    }
   },
   {
    "say": "Divide by the speed.",
    "ask": {
     "prompt": "[[f:9/2]] &divide; [[f:3/4]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "number",
      "label": [
       "hours",
       "hour",
       "hr",
       "hrs",
       "h"
      ]
     },
     "hint": "[[f:9/2]] &times; [[f:4/3]].",
     "reveal": "6 hours."
    }
   }
  ]
 },
 {
  "id": "b130",
  "skill": "word-frac",
  "kind": "word",
  "level": 3,
  "prompt": "A baker has [[m:3 3/4]] pounds of dough. She divides it into portions of [[f:5/8]] pound each. How many portions can she make?",
  "answer": {
   "type": "num",
   "value": "6",
   "form": "number",
   "label": [
    "portions",
    "portion"
   ]
  },
  "errors": [
   {
    "value": "75/32",
    "misconception": "wrong-operation",
    "feedback": "That is 2 11/32: you multiplied. Fitting portions means dividing."
   },
   {
    "value": "1/6",
    "misconception": "wrong-operation",
    "feedback": "You divided the other way round."
   }
  ],
  "hint": "Divide, using the reciprocal of [[f:5/8]].",
  "steps": [
   {
    "say": "Improper fraction.",
    "ask": {
     "prompt": "[[m:3 3/4]] = ___/4",
     "answer": {
      "type": "num",
      "value": "15",
      "form": "number"
     },
     "hint": "3 &times; 4 + 3.",
     "reveal": "15/4."
    }
   },
   {
    "say": "Reciprocal of [[f:5/8]], then multiply.",
    "ask": {
     "prompt": "[[f:15/4]] &times; [[f:8/5]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "number",
      "label": [
       "portions",
       "portion"
      ]
     },
     "hint": "Cancel 5 into 15 and 4 into 8.",
     "reveal": "6 portions."
    }
   }
  ]
 },
 {
  "id": "b131",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "A pancake recipe calls for [[m:2 1/3]] cups of flour. Max wants to make [[m:1 1/2]] times the recipe. How many cups of flour does he need?",
  "answer": {
   "type": "num",
   "value": "7/2",
   "form": "fraction",
   "label": [
    "cups",
    "cup",
    "c"
   ]
  },
  "errors": [
   {
    "value": "13/6",
    "misconception": "mixed-mult-parts",
    "feedback": "That is 2 1/6: you multiplied wholes and fractions separately."
   },
   {
    "value": "23/6",
    "misconception": "wrong-operation",
    "feedback": "That is 3 5/6: you added."
   }
  ],
  "hint": "Change both mixed numbers to improper fractions.",
  "steps": [
   {
    "say": "Improper fractions.",
    "ask": {
     "prompt": "[[m:2 1/3]] = ___/3",
     "answer": {
      "type": "num",
      "value": "7",
      "form": "number"
     },
     "hint": "2 &times; 3 + 1.",
     "reveal": "7/3."
    }
   },
   {
    "say": "Multiply.",
    "ask": {
     "prompt": "[[f:7/3]] &times; [[f:3/2]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "7/2",
      "form": "fraction",
      "label": [
       "cups",
       "cup",
       "c"
      ]
     },
     "hint": "The 3s cancel.",
     "reveal": "[[f:7/2]] = [[m:3 1/2]] cups."
    }
   }
  ]
 },
 {
  "id": "b132",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "On Tuesday Ty did [[f:1/2]] hour of math, [[f:3/4]] hour of reading, and [[f:1/3]] hour of science homework. How many hours of homework did he do in all?",
  "answer": {
   "type": "num",
   "value": "19/12",
   "form": "fraction",
   "label": [
    "hours",
    "hour",
    "hr",
    "hrs",
    "h"
   ]
  },
  "errors": [
   {
    "value": "5/9",
    "misconception": "add-denominators",
    "feedback": "You added tops and bottoms. Use a common denominator."
   },
   {
    "value": "5/4",
    "misconception": "missed-step",
    "feedback": "That is only math + reading. Add the science too."
   }
  ],
  "hint": "Common denominator for 2, 4, and 3.",
  "steps": [
   {
    "say": "Twelfths work for all three.",
    "ask": {
     "prompt": "LCM of 2, 4, 3?",
     "answer": {
      "type": "num",
      "value": "12",
      "form": "number"
     },
     "hint": "List multiples of the larger denominator until the others divide into it.",
     "reveal": "12."
    }
   },
   {
    "say": "6/12 + 9/12 + 4/12.",
    "ask": {
     "prompt": "Add and include the label.",
     "answer": {
      "type": "num",
      "value": "19/12",
      "form": "fraction",
      "label": [
       "hours",
       "hour",
       "hr",
       "hrs",
       "h"
      ]
     },
     "hint": "6 + 9 + 4.",
     "reveal": "[[f:19/12]] = [[m:1 7/12]] hours."
    }
   }
  ]
 },
 {
  "id": "b133",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "A jug holds [[m:5 1/4]] gallons of water. A camp uses [[f:3/4]] gallon every day. How many gallons are left after 4 days?",
  "answer": {
   "type": "num",
   "value": "9/4",
   "form": "fraction",
   "label": [
    "gallons",
    "gallon",
    "gal"
   ]
  },
  "errors": [
   {
    "value": "3",
    "misconception": "missed-step",
    "feedback": "3 gallons is what the camp USED. The question asks what is left."
   },
   {
    "value": "33/4",
    "misconception": "wrong-operation",
    "feedback": "That is 8 1/4: you added the water used."
   }
  ],
  "hint": "Find the water used in 4 days first.",
  "steps": [
   {
    "say": "Used in 4 days.",
    "ask": {
     "prompt": "4 &times; [[f:3/4]] = ?",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number"
     },
     "hint": "Four three-quarters.",
     "reveal": "3 gallons."
    }
   },
   {
    "say": "Subtract.",
    "ask": {
     "prompt": "[[m:5 1/4]] − 3 = ? (with label)",
     "answer": {
      "type": "num",
      "value": "9/4",
      "form": "fraction",
      "label": [
       "gallons",
       "gallon",
       "gal"
      ]
     },
     "hint": "5 − 3 and keep 1/4.",
     "reveal": "[[m:2 1/4]] gallons."
    }
   }
  ]
 },
 {
  "id": "b134",
  "skill": "word-frac",
  "kind": "word",
  "level": 3,
  "prompt": "Elena has [[f:3/5]] of a pizza left. She eats [[f:1/3]] of what she has left. How much of the whole pizza does she eat?",
  "answer": {
   "type": "num",
   "value": "1/5",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "2/5",
    "misconception": "missed-step",
    "feedback": "[[f:2/5]] is what is LEFT after she eats. The question asks how much she ate."
   },
   {
    "value": "4/15",
    "misconception": "wrong-operation",
    "feedback": "That is [[f:3/5]] − [[f:1/3]]. '[[f:1/3]] of' means multiply."
   }
  ],
  "hint": "'1/3 of 3/5' means multiply.",
  "steps": [
   {
    "say": "Multiply.",
    "figure": {
     "type": "area",
     "a": "1/3",
     "b": "3/5"
    },
    "ask": {
     "prompt": "[[f:1/3]] &times; [[f:3/5]] = ? (simplified)",
     "answer": {
      "type": "num",
      "value": "1/5",
      "form": "fraction"
     },
     "hint": "3 cancels.",
     "reveal": "[[f:1/5]] of the pizza."
    }
   },
   {
    "say": "Check the leftover.",
    "ask": {
     "prompt": "What fraction of the whole pizza is left after she eats?",
     "answer": {
      "type": "num",
      "value": "2/5",
      "form": "fraction"
     },
     "hint": "[[f:3/5]] − [[f:1/5]].",
     "reveal": "[[f:2/5]]."
    }
   }
  ]
 },
 {
  "id": "b135",
  "skill": "word-frac",
  "kind": "word",
  "level": 3,
  "prompt": "Two boards, [[m:3 1/3]] feet and [[m:2 1/2]] feet long, are glued end to end with an overlap of [[f:1/6]] foot. How long is the glued board?",
  "answer": {
   "type": "num",
   "value": "17/3",
   "form": "fraction",
   "label": [
    "feet",
    "foot",
    "ft"
   ]
  },
  "errors": [
   {
    "value": "35/6",
    "misconception": "missed-step",
    "feedback": "That is 5 5/6: you forgot to subtract the overlap."
   },
   {
    "value": "6",
    "misconception": "wrong-operation",
    "feedback": "You added the overlap instead of subtracting it."
   }
  ],
  "hint": "Add the boards, then subtract the overlap.",
  "steps": [
   {
    "say": "Add the boards (sixths).",
    "ask": {
     "prompt": "[[m:3 1/3]] + [[m:2 1/2]] = ? (fraction or mixed number)",
     "answer": {
      "type": "num",
      "value": "35/6",
      "form": "fraction"
     },
     "hint": "3 2/6 + 2 3/6.",
     "reveal": "[[m:5 5/6]]."
    }
   },
   {
    "say": "Subtract the overlap.",
    "ask": {
     "prompt": "[[m:5 5/6]] − [[f:1/6]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "17/3",
      "form": "fraction",
      "label": [
       "feet",
       "foot",
       "ft"
      ]
     },
     "hint": "5 4/6 = 5 2/3.",
     "reveal": "[[m:5 2/3]] feet."
    }
   }
  ]
 },
 {
  "id": "b136",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "Maya has 5 gallons of paint. She uses [[m:2 1/4]] gallons on a fence and [[m:1 2/3]] gallons on a shed. How much paint does she have left?",
  "answer": {
   "type": "num",
   "value": "13/12",
   "form": "fraction",
   "label": [
    "gallons",
    "gallon",
    "gal"
   ]
  },
  "errors": [
   {
    "value": "47/12",
    "misconception": "missed-step",
    "feedback": "That is 3 11/12: the paint she USED."
   },
   {
    "value": "107/12",
    "misconception": "wrong-operation",
    "feedback": "That is 8 11/12: you added the paint used to the 5 gallons."
   }
  ],
  "hint": "Add what she used, then subtract from 5.",
  "steps": [
   {
    "say": "Total used.",
    "ask": {
     "prompt": "[[m:2 1/4]] + [[m:1 2/3]] = ? (fraction)",
     "answer": {
      "type": "num",
      "value": "47/12",
      "form": "fraction"
     },
     "hint": "2 3/12 + 1 8/12.",
     "reveal": "[[m:3 11/12]]."
    }
   },
   {
    "say": "Subtract from 5.",
    "ask": {
     "prompt": "5 − [[m:3 11/12]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "13/12",
      "form": "fraction",
      "label": [
       "gallons",
       "gallon",
       "gal"
      ]
     },
     "hint": "5 = 4 12/12.",
     "reveal": "[[m:1 1/12]] gallons."
    }
   }
  ]
 },
 {
  "id": "b137",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "Noah swims [[f:3/8]] mile every morning. How many miles does he swim in 6 mornings?",
  "answer": {
   "type": "num",
   "value": "9/4",
   "form": "fraction",
   "label": [
    "miles",
    "mile",
    "mi"
   ]
  },
  "errors": [
   {
    "value": "16",
    "misconception": "wrong-operation",
    "feedback": "You divided 6 &divide; [[f:3/8]]. Total over several days is multiplication."
   },
   {
    "value": "1/16",
    "misconception": "wrong-operation",
    "feedback": "You divided [[f:3/8]] &divide; 6."
   }
  ],
  "hint": "6 mornings, each [[f:3/8]] mile.",
  "steps": [
   {
    "say": "Multiply the tops.",
    "ask": {
     "prompt": "3 &times; 6 = ?",
     "answer": {
      "type": "num",
      "value": "18",
      "form": "number"
     },
     "hint": "Top times the whole number.",
     "reveal": "18, so [[f:18/8]]."
    }
   },
   {
    "say": "Simplify.",
    "ask": {
     "prompt": "[[f:18/8]] in simplest form? (with label)",
     "answer": {
      "type": "num",
      "value": "9/4",
      "form": "fraction",
      "label": [
       "miles",
       "mile",
       "mi"
      ]
     },
     "hint": "Divide by 2.",
     "reveal": "[[f:9/4]] = [[m:2 1/4]] miles."
    }
   }
  ]
 },
 {
  "id": "b138",
  "skill": "word-frac",
  "kind": "word",
  "level": 3,
  "prompt": "A tailor has 8 yards of fabric. Each costume needs [[m:1 1/4]] yards. How many whole costumes can she make?",
  "answer": {
   "type": "num",
   "value": "6",
   "form": "number",
   "label": [
    "costumes",
    "costume"
   ],
   "rounding": {
    "mode": "down",
    "to": 1,
    "why": "You can only use whole items: when you can only AFFORD or FIT so many, round DOWN."
   }
  },
  "errors": [
   {
    "value": "32/5",
    "misconception": "missed-step",
    "feedback": "That is 6 2/5. You can't make 2/5 of a costume: whole costumes only."
   },
   {
    "value": "7",
    "misconception": "math-vs-real-rounding",
    "feedback": "7 costumes need 8 3/4 yards: more than she has. Round DOWN."
   },
   {
    "value": "10",
    "misconception": "wrong-operation",
    "feedback": "You multiplied. Fitting costumes is a division."
   }
  ],
  "hint": "8 &divide; [[m:1 1/4]], then decide what to do with the leftover fabric.",
  "steps": [
   {
    "say": "Divide.",
    "figure": {
     "type": "roundline",
     "value": "6.4",
     "step": 1,
     "mode": "down"
    },
    "ask": {
     "prompt": "8 &divide; [[f:5/4]] = ? (mixed number)",
     "answer": {
      "type": "num",
      "value": "32/5",
      "form": "fraction"
     },
     "hint": "8 &times; [[f:4/5]].",
     "reveal": "[[m:6 2/5]]."
    }
   },
   {
    "say": "Only whole costumes count.",
    "ask": {
     "prompt": "Whole costumes?",
     "answer": {
      "type": "num",
      "value": "6",
      "form": "number",
      "label": [
       "costumes",
       "costume"
      ]
     },
     "hint": "Round down.",
     "reveal": "6 costumes."
    }
   }
  ]
 },
 {
  "id": "b139",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "Priya read [[f:2/5]] of her 180-page book on Saturday and [[f:1/4]] of it on Sunday. How many pages does she still have to read?",
  "answer": {
   "type": "num",
   "value": "63",
   "form": "number",
   "label": [
    "pages",
    "page"
   ]
  },
  "errors": [
   {
    "value": "117",
    "misconception": "missed-step",
    "feedback": "117 pages is what she already READ."
   },
   {
    "value": "7/20",
    "misconception": "missed-step",
    "feedback": "[[f:7/20]] is the FRACTION left. The question asks for the number of pages."
   }
  ],
  "hint": "Find the fraction she has read, then the fraction left, then the pages.",
  "steps": [
   {
    "say": "Fraction read.",
    "ask": {
     "prompt": "[[f:2/5]] + [[f:1/4]] = ?",
     "answer": {
      "type": "num",
      "value": "13/20",
      "form": "fraction"
     },
     "hint": "8/20 + 5/20.",
     "reveal": "[[f:13/20]]."
    }
   },
   {
    "say": "Fraction left.",
    "ask": {
     "prompt": "1 − [[f:13/20]] = ?",
     "answer": {
      "type": "num",
      "value": "7/20",
      "form": "fraction"
     },
     "hint": "20/20 − 13/20.",
     "reveal": "[[f:7/20]]."
    }
   },
   {
    "say": "Pages left.",
    "ask": {
     "prompt": "[[f:7/20]] of 180 = ? (with label)",
     "answer": {
      "type": "num",
      "value": "63",
      "form": "number",
      "label": [
       "pages",
       "page"
      ]
     },
     "hint": "180 &divide; 20 = 9; &times; 7.",
     "reveal": "63 pages."
    }
   }
  ]
 },
 {
  "id": "b140",
  "skill": "word-frac",
  "kind": "word",
  "level": 3,
  "prompt": "A hiking trail is [[m:12 3/4]] miles long. On the first day Sam hikes [[f:2/3]] of it. How many miles does he have left for the second day?",
  "answer": {
   "type": "num",
   "value": "17/4",
   "form": "fraction",
   "label": [
    "miles",
    "mile",
    "mi"
   ]
  },
  "errors": [
   {
    "value": "17/2",
    "misconception": "missed-step",
    "feedback": "That is 8 1/2: how far he HIKED the first day."
   },
   {
    "value": "145/12",
    "misconception": "wrong-operation",
    "feedback": "That is 12 1/12: you subtracted [[f:2/3]] mile instead of [[f:2/3]] OF the trail."
   }
  ],
  "hint": "What fraction of the trail is left?",
  "steps": [
   {
    "say": "Fraction left.",
    "ask": {
     "prompt": "1 − [[f:2/3]] = ?",
     "answer": {
      "type": "num",
      "value": "1/3",
      "form": "fraction"
     },
     "hint": "3/3 − 2/3.",
     "reveal": "[[f:1/3]]."
    }
   },
   {
    "say": "A third of the trail.",
    "ask": {
     "prompt": "[[f:1/3]] &times; [[f:51/4]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "17/4",
      "form": "fraction",
      "label": [
       "miles",
       "mile",
       "mi"
      ]
     },
     "hint": "51 &divide; 3 = 17.",
     "reveal": "[[f:17/4]] = [[m:4 1/4]] miles."
    }
   }
  ]
 },
 {
  "id": "b141",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "A soup recipe makes 6 servings and uses [[m:1 1/2]] cups of broth. Dad wants to make 9 servings. How many cups of broth does he need?",
  "answer": {
   "type": "num",
   "value": "9/4",
   "form": "fraction",
   "label": [
    "cups",
    "cup",
    "c"
   ]
  },
  "errors": [
   {
    "value": "27/2",
    "misconception": "wrong-operation",
    "feedback": "You multiplied by 9. The recipe already makes 6 servings: scale by [[f:9/6]]."
   },
   {
    "value": "9/2",
    "misconception": "wrong-operation",
    "feedback": "That is 4 1/2: you added the 3 extra servings to the cups."
   }
  ],
  "hint": "How many times bigger is 9 servings than 6 servings?",
  "steps": [
   {
    "say": "Scale factor.",
    "ask": {
     "prompt": "9 &divide; 6 = ? (simplest fraction)",
     "answer": {
      "type": "num",
      "value": "3/2",
      "form": "fraction"
     },
     "hint": "Divide both by 3.",
     "reveal": "[[f:3/2]]."
    }
   },
   {
    "say": "Multiply the broth.",
    "ask": {
     "prompt": "[[f:3/2]] &times; [[f:3/2]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "9/4",
      "form": "fraction",
      "label": [
       "cups",
       "cup",
       "c"
      ]
     },
     "hint": "Tops, then bottoms.",
     "reveal": "[[f:9/4]] = [[m:2 1/4]] cups."
    }
   }
  ]
 },
 {
  "id": "b142",
  "skill": "word-frac",
  "kind": "word",
  "level": 2,
  "prompt": "A [[m:10 1/2]]-foot ribbon is cut into 7 pieces of equal length. How long is each piece?",
  "answer": {
   "type": "num",
   "value": "3/2",
   "form": "fraction",
   "label": [
    "feet",
    "foot",
    "ft"
   ]
  },
  "errors": [
   {
    "value": "147/2",
    "misconception": "wrong-operation",
    "feedback": "You multiplied by 7. Equal pieces means divide."
   },
   {
    "value": "2/3",
    "misconception": "wrong-operation",
    "feedback": "You divided 7 &divide; [[m:10 1/2]]."
   }
  ],
  "hint": "Divide the length by the number of pieces.",
  "steps": [
   {
    "say": "Improper fraction.",
    "ask": {
     "prompt": "[[m:10 1/2]] = ___/2",
     "answer": {
      "type": "num",
      "value": "21",
      "form": "number"
     },
     "hint": "10 &times; 2 + 1.",
     "reveal": "21/2."
    }
   },
   {
    "say": "Divide by 7.",
    "ask": {
     "prompt": "[[f:21/2]] &divide; 7 = ? (with label)",
     "answer": {
      "type": "num",
      "value": "3/2",
      "form": "fraction",
      "label": [
       "feet",
       "foot",
       "ft"
      ]
     },
     "hint": "[[f:21/2]] &times; [[f:1/7]].",
     "reveal": "[[m:1 1/2]] feet."
    }
   }
  ]
 },
 {
  "id": "b143",
  "skill": "word-frac",
  "kind": "word",
  "level": 3,
  "prompt": "Lena walks [[m:2 1/2]] miles per hour. How far does she walk in [[m:1 3/4]] hours?",
  "answer": {
   "type": "num",
   "value": "35/8",
   "form": "fraction",
   "label": [
    "miles",
    "mile",
    "mi"
   ]
  },
  "errors": [
   {
    "value": "10/7",
    "misconception": "wrong-operation",
    "feedback": "You divided. Distance = speed &times; time."
   },
   {
    "value": "19/8",
    "misconception": "mixed-mult-parts",
    "feedback": "That is 2 3/8: you multiplied wholes (2 &times; 1) and fractions separately."
   },
   {
    "value": "17/4",
    "misconception": "wrong-operation",
    "feedback": "That is 4 1/4: you added."
   }
  ],
  "hint": "Distance = speed &times; time. Improper fractions first.",
  "steps": [
   {
    "say": "Both to improper fractions.",
    "ask": {
     "prompt": "[[m:1 3/4]] = ___/4",
     "answer": {
      "type": "num",
      "value": "7",
      "form": "number"
     },
     "hint": "1 &times; 4 + 3.",
     "reveal": "7/4."
    }
   },
   {
    "say": "Multiply.",
    "ask": {
     "prompt": "[[f:5/2]] &times; [[f:7/4]] = ? (with label)",
     "answer": {
      "type": "num",
      "value": "35/8",
      "form": "fraction",
      "label": [
       "miles",
       "mile",
       "mi"
      ]
     },
     "hint": "5 &times; 7 over 2 &times; 4.",
     "reveal": "[[f:35/8]] = [[m:4 3/8]] miles."
    }
   }
  ]
 },
 {
  "id": "b144",
  "skill": "word-frac",
  "kind": "word",
  "level": 3,
  "prompt": "Four friends share [[f:3/4]] of a pizza equally. What fraction of the whole pizza does each friend get?",
  "answer": {
   "type": "num",
   "value": "3/16",
   "form": "fraction"
  },
  "errors": [
   {
    "value": "3",
    "misconception": "wrong-operation",
    "feedback": "That is [[f:3/4]] &divide; [[f:1/4]]. Sharing among 4 means divide by 4."
   },
   {
    "value": "16/3",
    "misconception": "div-no-flip",
    "feedback": "You divided 4 &divide; [[f:3/4]]. Divide the pizza by 4."
   }
  ],
  "hint": "Divide [[f:3/4]] by 4.",
  "steps": [
   {
    "say": "Dividing by 4 is multiplying by [[f:1/4]].",
    "ask": {
     "prompt": "Reciprocal of 4?",
     "answer": {
      "type": "num",
      "value": "1/4",
      "form": "fraction"
     },
     "hint": "4 = [[f:4/1]].",
     "reveal": "[[f:1/4]]."
    }
   },
   {
    "say": "Multiply.",
    "ask": {
     "prompt": "[[f:3/4]] &times; [[f:1/4]] = ?",
     "answer": {
      "type": "num",
      "value": "3/16",
      "form": "fraction"
     },
     "hint": "Tops, then bottoms.",
     "reveal": "[[f:3/16]] of the pizza."
    }
   }
  ]
 },
 {
  "id": "b145",
  "skill": "word-frac",
  "kind": "word",
  "level": 3,
  "prompt": "A school play has 3 acts: Act 1 lasts [[m:1 1/4]] hours, Act 2 lasts [[f:3/4]] hour, and Act 3 lasts [[m:1 1/3]] hours. There is a [[f:1/4]]-hour intermission. How long is the whole show, including the intermission?",
  "answer": {
   "type": "num",
   "value": "43/12",
   "form": "fraction",
   "label": [
    "hours",
    "hour",
    "hr",
    "hrs",
    "h"
   ]
  },
  "errors": [
   {
    "value": "10/3",
    "misconception": "missed-step",
    "feedback": "That is 3 1/3 hours: you left out the intermission."
   },
   {
    "value": "31/12",
    "misconception": "regroup-mixed",
    "feedback": "That is 2 7/12: the fractions add to more than 1. Carry the extra whole."
   }
  ],
  "hint": "Add everything, with twelfths.",
  "steps": [
   {
    "say": "The fraction parts in twelfths.",
    "ask": {
     "prompt": "[[f:1/4]] + [[f:3/4]] + [[f:1/3]] + [[f:1/4]] = ? (fraction)",
     "answer": {
      "type": "num",
      "value": "19/12",
      "form": "fraction"
     },
     "hint": "3/12 + 9/12 + 4/12 + 3/12.",
     "reveal": "[[f:19/12]] = [[m:1 7/12]]."
    }
   },
   {
    "say": "Add the wholes: 1 + 0 + 1 + 0.",
    "ask": {
     "prompt": "Total time? (with label)",
     "answer": {
      "type": "num",
      "value": "43/12",
      "form": "fraction",
      "label": [
       "hours",
       "hour",
       "hr",
       "hrs",
       "h"
      ]
     },
     "hint": "2 + 1 7/12.",
     "reveal": "[[m:3 7/12]] hours."
    }
   }
  ]
 },
 {
  "id": "b146",
  "skill": "word-dec",
  "kind": "word",
  "level": 1,
  "prompt": "Max buys a notebook for $3.49 and a pack of pens for $2.75. He pays with a $20 bill. How much change does he get?",
  "answer": {
   "type": "num",
   "value": "13.76",
   "form": "money"
  },
  "errors": [
   {
    "value": "6.24",
    "misconception": "missed-step",
    "feedback": "$6.24 is what he SPENT. The question asks for his change."
   },
   {
    "value": "26.24",
    "misconception": "wrong-operation",
    "feedback": "You added the $20 to the cost. Change is $20 minus the cost."
   }
  ],
  "hint": "First find the total cost; then subtract it from $20.",
  "steps": [
   {
    "say": "Total cost.",
    "figure": {
     "type": "columns",
     "numbers": [
      "3.49",
      "2.75"
     ],
     "op": "+"
    },
    "ask": {
     "prompt": "3.49 + 2.75 = ?",
     "answer": {
      "type": "num",
      "value": "6.24",
      "form": "money"
     },
     "hint": "Line up the decimal points.",
     "reveal": "$6.24."
    }
   },
   {
    "say": "Change.",
    "ask": {
     "prompt": "20 − 6.24 = ?",
     "answer": {
      "type": "num",
      "value": "13.76",
      "form": "money"
     },
     "hint": "20.00 − 6.24.",
     "reveal": "$13.76."
    }
   }
  ]
 },
 {
  "id": "b147",
  "skill": "word-dec",
  "kind": "word",
  "level": 1,
  "prompt": "Tickets to the school play cost $8.50 each. How much do 4 tickets cost?",
  "answer": {
   "type": "num",
   "value": "34",
   "form": "money"
  },
  "errors": [
   {
    "value": "2.125",
    "misconception": "wrong-operation",
    "feedback": "That is $8.50 &divide; 4. Several tickets means multiply."
   },
   {
    "value": "12.5",
    "misconception": "wrong-operation",
    "feedback": "That is 8.50 + 4. Multiply instead."
   }
  ],
  "hint": "4 groups of $8.50.",
  "steps": [
   {
    "say": "Multiply 8.5 &times; 4 as whole numbers.",
    "ask": {
     "prompt": "85 &times; 4 = ?",
     "answer": {
      "type": "num",
      "value": "340",
      "form": "number"
     },
     "hint": "80 &times; 4 + 5 &times; 4.",
     "reveal": "340."
    }
   },
   {
    "say": "Place the point and write money to the cent.",
    "ask": {
     "prompt": "8.50 &times; 4 = ?",
     "answer": {
      "type": "num",
      "value": "34",
      "form": "money"
     },
     "hint": "340 with one decimal place.",
     "reveal": "$34.00."
    }
   }
  ]
 },
 {
  "id": "b148",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "A 12-ounce bag of pretzels costs $3.60. What is the cost per ounce? (answer in dollars)",
  "answer": {
   "type": "num",
   "value": "0.3",
   "form": "money"
  },
  "errors": [
   {
    "value": "43.2",
    "misconception": "wrong-operation",
    "feedback": "You multiplied. Cost PER ounce means divide by the number of ounces."
   },
   {
    "value": "0.03",
    "misconception": "decimal-div-shift",
    "feedback": "36 &divide; 12 = 3, so 3.6 &divide; 12 = 0.3."
   }
  ],
  "hint": "Divide the price by the number of ounces.",
  "steps": [
   {
    "say": "Divide.",
    "ask": {
     "prompt": "3.60 &divide; 12 = ?",
     "answer": {
      "type": "num",
      "value": "0.3",
      "form": "decimal"
     },
     "hint": "36 &divide; 12 = 3, then place the point.",
     "reveal": "0.30."
    }
   },
   {
    "say": "Money to the cent.",
    "ask": {
     "prompt": "Cost per ounce?",
     "answer": {
      "type": "num",
      "value": "0.3",
      "form": "money"
     },
     "hint": "Write cents with two decimals.",
     "reveal": "$0.30."
    }
   }
  ]
 },
 {
  "id": "b149",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "Apples are sold two ways: 6 apples for $4.50, or 10 apples for $7.20. What is the price of one apple at the better buy (the lower price per apple)? (answer in dollars)",
  "answer": {
   "type": "num",
   "value": "0.72",
   "form": "money"
  },
  "errors": [
   {
    "value": "0.75",
    "misconception": "missed-step",
    "feedback": "That is the price of one apple in the 6-apple pack. Compare it with the other pack."
   },
   {
    "value": "0.072",
    "misconception": "decimal-div-shift",
    "feedback": "7.20 &divide; 10 moves the point one place: 0.72."
   }
  ],
  "hint": "Find the price per apple for each pack.",
  "steps": [
   {
    "say": "First pack.",
    "ask": {
     "prompt": "4.50 &divide; 6 = ?",
     "answer": {
      "type": "num",
      "value": "0.75",
      "form": "money"
     },
     "hint": "45 &divide; 6 = 7.5.",
     "reveal": "$0.75."
    }
   },
   {
    "say": "Second pack.",
    "ask": {
     "prompt": "7.20 &divide; 10 = ?",
     "answer": {
      "type": "num",
      "value": "0.72",
      "form": "money"
     },
     "hint": "Move the point one place left.",
     "reveal": "$0.72: cheaper per apple."
    }
   }
  ]
 },
 {
  "id": "b150",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "Ben earns $14.50 an hour at the garden center. On Saturday he worked 3.5 hours and on Sunday he worked 2 hours. How much did he earn in all?",
  "answer": {
   "type": "num",
   "value": "79.75",
   "form": "money"
  },
  "errors": [
   {
    "value": "50.75",
    "misconception": "missed-step",
    "feedback": "$50.75 is Saturday only. Add Sunday."
   },
   {
    "value": "20",
    "misconception": "wrong-operation",
    "feedback": "You added the rate to the hours. Earnings = rate &times; hours."
   }
  ],
  "hint": "Find the total hours first, then multiply by the hourly rate.",
  "steps": [
   {
    "say": "Total hours.",
    "ask": {
     "prompt": "3.5 + 2 = ?",
     "answer": {
      "type": "num",
      "value": "5.5",
      "form": "decimal"
     },
     "hint": "Line up the points.",
     "reveal": "5.5 hours."
    }
   },
   {
    "say": "Earnings.",
    "ask": {
     "prompt": "14.50 &times; 5.5 = ?",
     "answer": {
      "type": "num",
      "value": "79.75",
      "form": "money"
     },
     "hint": "145 &times; 55 = 7975; 2 decimal places.",
     "reveal": "$79.75."
    }
   }
  ]
 },
 {
  "id": "b151",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "Kayla ran 2.4 miles on Monday, 3.15 miles on Tuesday, and 1.8 miles on Thursday. How many miles did she run in all?",
  "answer": {
   "type": "num",
   "value": "7.35",
   "form": "decimal",
   "label": [
    "miles",
    "mile",
    "mi"
   ]
  },
  "errors": [
   {
    "value": "3.57",
    "misconception": "decimal-align",
    "feedback": "You lined up the last digits. Line up the decimal points: 2.40 + 3.15 + 1.80."
   },
   {
    "value": "5.55",
    "misconception": "missed-step",
    "feedback": "That is only Monday + Tuesday."
   }
  ],
  "hint": "Give every number two decimal places.",
  "steps": [
   {
    "say": "Stack with points lined up.",
    "figure": {
     "type": "columns",
     "numbers": [
      "2.4",
      "3.15",
      "1.8"
     ],
     "op": "+"
    },
    "ask": {
     "prompt": "2.40 + 3.15 = ?",
     "answer": {
      "type": "num",
      "value": "5.55",
      "form": "decimal"
     },
     "hint": "Add hundredths first.",
     "reveal": "5.55."
    }
   },
   {
    "say": "Add Thursday.",
    "ask": {
     "prompt": "5.55 + 1.80 = ? (with label)",
     "answer": {
      "type": "num",
      "value": "7.35",
      "form": "decimal",
      "label": [
       "miles",
       "mile",
       "mi"
      ]
     },
     "hint": "Line up the points.",
     "reveal": "7.35 miles."
    }
   }
  ]
 },
 {
  "id": "b152",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "A 3-pound bag of apples costs $5.40. Dana needs 4.5 pounds of apples at the same price per pound. How much will she pay?",
  "answer": {
   "type": "num",
   "value": "8.1",
   "form": "money"
  },
  "errors": [
   {
    "value": "1.8",
    "misconception": "missed-step",
    "feedback": "$1.80 is the price of ONE pound. She needs 4.5 pounds."
   },
   {
    "value": "24.3",
    "misconception": "wrong-operation",
    "feedback": "You multiplied $5.40 &times; 4.5. That is the price for 4.5 BAGS."
   }
  ],
  "hint": "Unit price first.",
  "steps": [
   {
    "say": "Price per pound.",
    "ask": {
     "prompt": "5.40 &divide; 3 = ?",
     "answer": {
      "type": "num",
      "value": "1.8",
      "form": "money"
     },
     "hint": "54 &divide; 3 = 18.",
     "reveal": "$1.80."
    }
   },
   {
    "say": "4.5 pounds.",
    "ask": {
     "prompt": "1.80 &times; 4.5 = ?",
     "answer": {
      "type": "num",
      "value": "8.1",
      "form": "money"
     },
     "hint": "18 &times; 45 = 810; 2 decimal places.",
     "reveal": "$8.10."
    }
   }
  ]
 },
 {
  "id": "b153",
  "skill": "word-dec",
  "kind": "word",
  "level": 3,
  "prompt": "Jordan buys 2.5 pounds of cheese at $6.40 per pound and 3 loaves of bread at $2.85 each. He pays with $30. How much change should he get?",
  "answer": {
   "type": "num",
   "value": "5.45",
   "form": "money"
  },
  "errors": [
   {
    "value": "24.55",
    "misconception": "missed-step",
    "feedback": "$24.55 is the total COST. The question asks for the change."
   },
   {
    "value": "21.45",
    "misconception": "missed-step",
    "feedback": "You forgot to subtract the cheese: $30 − $8.55 = $21.45 leaves out the $16.00 for cheese."
   }
  ],
  "hint": "Cost of the cheese, cost of the bread, then subtract from $30.",
  "steps": [
   {
    "say": "Cheese.",
    "ask": {
     "prompt": "2.5 &times; 6.40 = ?",
     "answer": {
      "type": "num",
      "value": "16",
      "form": "money"
     },
     "hint": "Half of 6.40 is 3.20; add 2 &times; 6.40.",
     "reveal": "$16.00."
    }
   },
   {
    "say": "Bread.",
    "ask": {
     "prompt": "3 &times; 2.85 = ?",
     "answer": {
      "type": "num",
      "value": "8.55",
      "form": "money"
     },
     "hint": "3 &times; 285 = 855.",
     "reveal": "$8.55."
    }
   },
   {
    "say": "Change.",
    "ask": {
     "prompt": "30 − (16.00 + 8.55) = ?",
     "answer": {
      "type": "num",
      "value": "5.45",
      "form": "money"
     },
     "hint": "Total cost is $24.55.",
     "reveal": "$5.45."
    }
   }
  ]
 },
 {
  "id": "b154",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "Four friends split a $52.80 dinner bill equally. How much does each friend pay?",
  "answer": {
   "type": "num",
   "value": "13.2",
   "form": "money"
  },
  "errors": [
   {
    "value": "211.2",
    "misconception": "wrong-operation",
    "feedback": "You multiplied. Splitting equally means divide."
   },
   {
    "value": "1.32",
    "misconception": "decimal-div-shift",
    "feedback": "52.8 &divide; 4 is a little over 13. Check where the decimal point goes."
   }
  ],
  "hint": "Divide the bill by 4.",
  "steps": [
   {
    "say": "Divide.",
    "ask": {
     "prompt": "52.80 &divide; 4 = ?",
     "answer": {
      "type": "num",
      "value": "13.2",
      "form": "decimal"
     },
     "hint": "52 &divide; 4 = 13, then 0.80 &divide; 4.",
     "reveal": "13.20."
    }
   },
   {
    "say": "Write money to the cent.",
    "ask": {
     "prompt": "Each friend pays?",
     "answer": {
      "type": "num",
      "value": "13.2",
      "form": "money"
     },
     "hint": "Two decimal places.",
     "reveal": "$13.20."
    }
   }
  ]
 },
 {
  "id": "b155",
  "skill": "word-dec",
  "kind": "word",
  "level": 3,
  "prompt": "A relay team's four runners ran 11.84 s, 12.07 s, 11.9 s, and 12.2 s. What is the team's average time, to the nearest hundredth of a second?",
  "answer": {
   "type": "num",
   "value": "12",
   "form": "decimal",
   "label": [
    "seconds",
    "second",
    "sec",
    "s"
   ],
   "rounding": {
    "mode": "nearest",
    "to": 0.01,
    "why": "Math rounding: look at the digit to the right. 5 or more, round up; 4 or less, stay."
   }
  },
  "errors": [
   {
    "value": "48.01",
    "misconception": "missed-step",
    "feedback": "48.01 s is the TOTAL. An average divides by 4."
   },
   {
    "value": "12.01",
    "misconception": "rounding-direction",
    "feedback": "The exact average is 12.0025. The digit after the hundredths is 2, so it rounds DOWN to 12.00."
   }
  ],
  "hint": "Add the four times, then divide by 4.",
  "steps": [
   {
    "say": "Total time.",
    "figure": {
     "type": "columns",
     "numbers": [
      "11.84",
      "12.07",
      "11.9",
      "12.2"
     ],
     "op": "+"
    },
    "ask": {
     "prompt": "11.84 + 12.07 + 11.90 + 12.20 = ?",
     "answer": {
      "type": "num",
      "value": "48.01",
      "form": "decimal"
     },
     "hint": "Line up the points.",
     "reveal": "48.01."
    }
   },
   {
    "say": "Divide by 4 and round.",
    "ask": {
     "prompt": "48.01 &divide; 4 = 12.0025. To the nearest hundredth?",
     "answer": {
      "type": "num",
      "value": "12",
      "form": "decimal",
      "label": [
       "seconds",
       "second",
       "sec",
       "s"
      ]
     },
     "hint": "The next digit is 2.",
     "reveal": "12.00 seconds."
    }
   }
  ]
 },
 {
  "id": "b156",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "A roll of ribbon has 9.6 meters on it. Max cuts pieces that are each 0.8 meter long. How many pieces can he cut?",
  "answer": {
   "type": "num",
   "value": "12",
   "form": "number",
   "label": [
    "pieces",
    "piece"
   ]
  },
  "errors": [
   {
    "value": "7.68",
    "misconception": "wrong-operation",
    "feedback": "You multiplied. How many pieces fit is a division."
   },
   {
    "value": "1.2",
    "misconception": "decimal-div-shift",
    "feedback": "You moved the point in the divisor (0.8 → 8) but not in the dividend: 96 &divide; 8."
   }
  ],
  "hint": "Move the point one place in both numbers.",
  "steps": [
   {
    "say": "Make the divisor whole.",
    "ask": {
     "prompt": "9.6 &divide; 0.8 is the same as ___ &divide; 8.",
     "answer": {
      "type": "num",
      "value": "96",
      "form": "number"
     },
     "hint": "Move both points one place.",
     "reveal": "96."
    }
   },
   {
    "say": "Divide.",
    "ask": {
     "prompt": "96 &divide; 8 = ? (with label)",
     "answer": {
      "type": "num",
      "value": "12",
      "form": "number",
      "label": [
       "pieces",
       "piece"
      ]
     },
     "hint": "What times 8 gives 96?",
     "reveal": "12 pieces."
    }
   }
  ]
 },
 {
  "id": "b157",
  "skill": "word-dec",
  "kind": "word",
  "level": 3,
  "prompt": "A taxi charges a flat fee of $2.75 plus $1.20 for each mile. How much does a 6.5-mile ride cost?",
  "answer": {
   "type": "num",
   "value": "10.55",
   "form": "money"
  },
  "errors": [
   {
    "value": "7.8",
    "misconception": "missed-step",
    "feedback": "$7.80 is the charge for the MILES. Add the flat fee."
   },
   {
    "value": "10.45",
    "misconception": "wrong-operation",
    "feedback": "You added the miles (2.75 + 1.20 + 6.5). The $1.20 is charged for EACH mile: multiply."
   }
  ],
  "hint": "Mileage charge first, then add the flat fee.",
  "steps": [
   {
    "say": "Charge for the miles.",
    "ask": {
     "prompt": "1.20 &times; 6.5 = ?",
     "answer": {
      "type": "num",
      "value": "7.8",
      "form": "money"
     },
     "hint": "12 &times; 65 = 780; 2 decimal places.",
     "reveal": "$7.80."
    }
   },
   {
    "say": "Add the flat fee.",
    "ask": {
     "prompt": "7.80 + 2.75 = ?",
     "answer": {
      "type": "num",
      "value": "10.55",
      "form": "money"
     },
     "hint": "Line up the points.",
     "reveal": "$10.55."
    }
   }
  ]
 },
 {
  "id": "b158",
  "skill": "word-dec",
  "kind": "word",
  "level": 3,
  "prompt": "Gas costs $3.45 per gallon. Max puts 11.65 gallons in his car. What does he pay, to the nearest cent?",
  "answer": {
   "type": "num",
   "value": "40.19",
   "form": "money",
   "rounding": {
    "mode": "nearest",
    "to": 0.01,
    "why": "Money is rounded to the nearest cent."
   }
  },
  "errors": [
   {
    "value": "40.2",
    "misconception": "rounding-direction",
    "feedback": "$40.20 rounds the cents UP. The digit after the cents is 2, so math rounding keeps $40.19."
   },
   {
    "value": "40.1925",
    "misconception": "money-cents",
    "feedback": "That is the unrounded product. Round to the cent."
   }
  ],
  "hint": "Multiply, then round to the cent.",
  "steps": [
   {
    "say": "Multiply as whole numbers.",
    "ask": {
     "prompt": "345 &times; 1165 = ?",
     "answer": {
      "type": "num",
      "value": "401925",
      "form": "number"
     },
     "hint": "345 &times; 1000 + 345 &times; 165.",
     "reveal": "401,925."
    }
   },
   {
    "say": "5 decimal places: 40.1925. Look at the digit after the cents.",
    "ask": {
     "prompt": "To the nearest cent?",
     "answer": {
      "type": "num",
      "value": "40.19",
      "form": "money"
     },
     "hint": "Look at the digit right after the cents.",
     "reveal": "$40.19."
    }
   }
  ]
 },
 {
  "id": "b159",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "Lena earns $9.50 an hour at the library. Last week she worked 7.5 hours, and her mom gave her a $5 bonus. How much money did she get in all?",
  "answer": {
   "type": "num",
   "value": "76.25",
   "form": "money"
  },
  "errors": [
   {
    "value": "71.25",
    "misconception": "missed-step",
    "feedback": "$71.25 is her hourly pay. Add the bonus."
   },
   {
    "value": "22",
    "misconception": "wrong-operation",
    "feedback": "You added rate + hours + bonus. Pay = rate &times; hours."
   }
  ],
  "hint": "Hourly pay first.",
  "steps": [
   {
    "say": "Hourly pay.",
    "ask": {
     "prompt": "9.50 &times; 7.5 = ?",
     "answer": {
      "type": "num",
      "value": "71.25",
      "form": "money"
     },
     "hint": "95 &times; 75 = 7125.",
     "reveal": "$71.25."
    }
   },
   {
    "say": "Bonus.",
    "ask": {
     "prompt": "71.25 + 5 = ?",
     "answer": {
      "type": "num",
      "value": "76.25",
      "form": "money"
     },
     "hint": "Add.",
     "reveal": "$76.25."
    }
   }
  ]
 },
 {
  "id": "b160",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "Max has $15. Two sandwiches cost $6.75 each and a drink costs $2.40. How much more money does he need to buy all of it? (answer in dollars)",
  "answer": {
   "type": "num",
   "value": "0.9",
   "form": "money"
  },
  "errors": [
   {
    "value": "15.9",
    "misconception": "missed-step",
    "feedback": "$15.90 is the total COST. Compare it with the $15 he has."
   },
   {
    "value": "30.9",
    "misconception": "wrong-operation",
    "feedback": "You added the $15 he has to the cost. Find the difference."
   }
  ],
  "hint": "Total cost, then compare with $15.",
  "steps": [
   {
    "say": "Sandwiches.",
    "ask": {
     "prompt": "2 &times; 6.75 = ?",
     "answer": {
      "type": "num",
      "value": "13.5",
      "form": "money"
     },
     "hint": "Double 6.75.",
     "reveal": "$13.50."
    }
   },
   {
    "say": "Total cost, then how much short.",
    "ask": {
     "prompt": "13.50 + 2.40 = 15.90. How much more than $15?",
     "answer": {
      "type": "num",
      "value": "0.9",
      "form": "money"
     },
     "hint": "15.90 − 15.00.",
     "reveal": "$0.90."
    }
   }
  ]
 },
 {
  "id": "b161",
  "skill": "word-dec",
  "kind": "word",
  "level": 3,
  "prompt": "A car travels 312.5 miles on 12.5 gallons of gas. How many miles does it go per gallon?",
  "answer": {
   "type": "num",
   "value": "25",
   "form": "number",
   "label": [
    "miles per gallon",
    "mpg",
    "miles per gal"
   ]
  },
  "errors": [
   {
    "value": "0.04",
    "misconception": "wrong-operation",
    "feedback": "That is gallons per mile (12.5 &divide; 312.5). 'Miles per gallon' is miles &divide; gallons."
   },
   {
    "value": "3906.25",
    "misconception": "wrong-operation",
    "feedback": "You multiplied. 'Per gallon' means divide."
   }
  ],
  "hint": "Miles &divide; gallons. Move the points one place.",
  "steps": [
   {
    "say": "Make the divisor whole.",
    "ask": {
     "prompt": "312.5 &divide; 12.5 is the same as ___ &divide; 125.",
     "answer": {
      "type": "num",
      "value": "3125",
      "form": "number"
     },
     "hint": "Move both points one place.",
     "reveal": "3125."
    }
   },
   {
    "say": "Divide.",
    "ask": {
     "prompt": "3125 &divide; 125 = ? (with label)",
     "answer": {
      "type": "num",
      "value": "25",
      "form": "number",
      "label": [
       "miles per gallon",
       "mpg",
       "miles per gal"
      ]
     },
     "hint": "What times 125 makes 3125?",
     "reveal": "25 miles per gallon."
    }
   }
  ]
 },
 {
  "id": "b162",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "Mia buys 3 T-shirts at $12.99 each and a hat for $8.50. What is her total?",
  "answer": {
   "type": "num",
   "value": "47.47",
   "form": "money"
  },
  "errors": [
   {
    "value": "21.49",
    "misconception": "wrong-operation",
    "feedback": "That is one shirt + the hat. She bought 3 shirts."
   },
   {
    "value": "38.97",
    "misconception": "missed-step",
    "feedback": "$38.97 is the cost of the shirts only. Add the hat."
   }
  ],
  "hint": "Shirts first.",
  "steps": [
   {
    "say": "3 shirts.",
    "ask": {
     "prompt": "3 &times; 12.99 = ?",
     "answer": {
      "type": "num",
      "value": "38.97",
      "form": "money"
     },
     "hint": "3 &times; 13 − 0.03.",
     "reveal": "$38.97."
    }
   },
   {
    "say": "Add the hat.",
    "ask": {
     "prompt": "38.97 + 8.50 = ?",
     "answer": {
      "type": "num",
      "value": "47.47",
      "form": "money"
     },
     "hint": "Line up the points.",
     "reveal": "$47.47."
    }
   }
  ]
 },
 {
  "id": "b163",
  "skill": "word-dec",
  "kind": "word",
  "level": 3,
  "prompt": "A 1.5-liter bottle of juice costs $3.30 and a 2-liter bottle costs $4.20. How much cheaper per liter is the 2-liter bottle? (answer in dollars)",
  "answer": {
   "type": "num",
   "value": "0.1",
   "form": "money"
  },
  "errors": [
   {
    "value": "2.1",
    "misconception": "missed-step",
    "feedback": "$2.10 is the price per liter of the 2-liter bottle. The question asks for the DIFFERENCE."
   },
   {
    "value": "0.9",
    "misconception": "wrong-operation",
    "feedback": "That is $4.20 − $3.30, the difference in bottle prices, not in price per liter."
   }
  ],
  "hint": "Price per liter for each bottle, then subtract.",
  "steps": [
   {
    "say": "1.5-liter bottle.",
    "ask": {
     "prompt": "3.30 &divide; 1.5 = ?",
     "answer": {
      "type": "num",
      "value": "2.2",
      "form": "money"
     },
     "hint": "33 &divide; 15.",
     "reveal": "$2.20 per liter."
    }
   },
   {
    "say": "2-liter bottle.",
    "ask": {
     "prompt": "4.20 &divide; 2 = ?",
     "answer": {
      "type": "num",
      "value": "2.1",
      "form": "money"
     },
     "hint": "Half.",
     "reveal": "$2.10 per liter."
    }
   },
   {
    "say": "Difference.",
    "ask": {
     "prompt": "2.20 − 2.10 = ?",
     "answer": {
      "type": "num",
      "value": "0.1",
      "form": "money"
     },
     "hint": "Subtract.",
     "reveal": "$0.10 per liter."
    }
   }
  ]
 },
 {
  "id": "b164",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "Four muffins take 0.6 kilogram of flour. How much flour is needed for 10 muffins?",
  "answer": {
   "type": "num",
   "value": "1.5",
   "form": "decimal",
   "label": [
    "kilograms",
    "kilogram",
    "kg",
    "kilos",
    "kilo"
   ]
  },
  "errors": [
   {
    "value": "0.15",
    "misconception": "missed-step",
    "feedback": "0.15 kg is the flour for ONE muffin. Multiply by 10."
   },
   {
    "value": "2.4",
    "misconception": "wrong-operation",
    "feedback": "You multiplied 0.6 &times; 4. Find the flour per muffin first."
   }
  ],
  "hint": "Flour per muffin, then times 10.",
  "steps": [
   {
    "say": "Per muffin.",
    "ask": {
     "prompt": "0.6 &divide; 4 = ?",
     "answer": {
      "type": "num",
      "value": "0.15",
      "form": "decimal"
     },
     "hint": "6 &divide; 4 = 1.5.",
     "reveal": "0.15."
    }
   },
   {
    "say": "For 10 muffins.",
    "ask": {
     "prompt": "0.15 &times; 10 = ? (with label)",
     "answer": {
      "type": "num",
      "value": "1.5",
      "form": "decimal",
      "label": [
       "kilograms",
       "kilogram",
       "kg",
       "kilos",
       "kilo"
      ]
     },
     "hint": "Move the point one place.",
     "reveal": "1.5 kilograms."
    }
   }
  ]
 },
 {
  "id": "b165",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "Ethan's goal is to run 20 km this week. So far he has run 5.4 km on Monday, 3.85 km on Tuesday, and 6.2 km on Wednesday. How many more kilometers does he need to reach his goal?",
  "answer": {
   "type": "num",
   "value": "4.55",
   "form": "decimal",
   "label": [
    "kilometers",
    "kilometer",
    "km",
    "kilometres",
    "kilometre"
   ]
  },
  "errors": [
   {
    "value": "15.45",
    "misconception": "missed-step",
    "feedback": "15.45 km is how far he has run. Subtract from the goal."
   },
   {
    "value": "35.45",
    "misconception": "wrong-operation",
    "feedback": "You added the goal. 'How many more' means subtract."
   }
  ],
  "hint": "Add what he ran, then subtract from 20.",
  "steps": [
   {
    "say": "Total so far.",
    "figure": {
     "type": "columns",
     "numbers": [
      "5.4",
      "3.85",
      "6.2"
     ],
     "op": "+"
    },
    "ask": {
     "prompt": "5.40 + 3.85 + 6.20 = ?",
     "answer": {
      "type": "num",
      "value": "15.45",
      "form": "decimal"
     },
     "hint": "Line up the points.",
     "reveal": "15.45."
    }
   },
   {
    "say": "Remaining.",
    "ask": {
     "prompt": "20 − 15.45 = ? (with label)",
     "answer": {
      "type": "num",
      "value": "4.55",
      "form": "decimal",
      "label": [
       "kilometers",
       "kilometer",
       "km",
       "kilometres",
       "kilometre"
      ]
     },
     "hint": "20.00 − 15.45.",
     "reveal": "4.55 kilometers."
    }
   }
  ]
 },
 {
  "id": "b166",
  "skill": "word-dec",
  "kind": "word",
  "level": 3,
  "prompt": "Pencils are sold only in packs of 8, and a pack costs $3.20. Max needs 21 pencils. What is the least amount of money he must spend?",
  "answer": {
   "type": "num",
   "value": "9.6",
   "form": "money"
  },
  "errors": [
   {
    "value": "8.4",
    "misconception": "math-vs-real-rounding",
    "feedback": "You priced 2.625 packs. You can't buy part of a pack: 3 whole packs."
   },
   {
    "value": "6.4",
    "misconception": "math-vs-real-rounding",
    "feedback": "2 packs hold only 16 pencils. He needs 21, so buy 3 packs."
   }
  ],
  "hint": "How many packs does he need? Can he buy part of a pack?",
  "steps": [
   {
    "say": "Packs needed.",
    "figure": {
     "type": "roundline",
     "value": "2.625",
     "step": 1,
     "mode": "up"
    },
    "ask": {
     "prompt": "21 &divide; 8 = ? (decimal)",
     "answer": {
      "type": "num",
      "value": "2.625",
      "form": "decimal"
     },
     "hint": "8 &times; 2 = 16, 5 left.",
     "reveal": "2.625 packs."
    }
   },
   {
    "say": "Packs are sold whole, and he needs ENOUGH pencils.",
    "ask": {
     "prompt": "How many packs must he buy?",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number",
      "label": [
       "packs",
       "pack"
      ],
      "rounding": {
       "mode": "up",
       "to": 1,
       "why": "Packs are sold whole and he needs ENOUGH pencils: round the number of packs UP."
      }
     },
     "hint": "Would 2 packs be enough pencils?",
     "reveal": "3 packs (2 packs hold only 16 pencils).",
     "errors": [
      {
       "value": "2",
       "misconception": "math-vs-real-rounding",
       "feedback": "2 packs hold only 16 pencils: not enough. Round UP."
      },
      {
       "value": "2.625",
       "misconception": "missed-step",
       "feedback": "Packs are sold whole. Give a whole number of packs."
      }
     ]
    }
   },
   {
    "say": "Cost of the packs.",
    "ask": {
     "prompt": "3 &times; 3.20 = ?",
     "answer": {
      "type": "num",
      "value": "9.6",
      "form": "money"
     },
     "hint": "3 &times; 3 + 3 &times; 0.20.",
     "reveal": "$9.60."
    }
   }
  ]
 },
 {
  "id": "b167",
  "skill": "word-dec",
  "kind": "word",
  "level": 3,
  "prompt": "A phone plan costs $24.99 a month and includes 100 texts. Each extra text costs $0.15. Ava sent 137 texts last month. What was her bill?",
  "answer": {
   "type": "num",
   "value": "30.54",
   "form": "money"
  },
  "errors": [
   {
    "value": "5.55",
    "misconception": "missed-step",
    "feedback": "$5.55 is only the charge for extra texts. Add the monthly fee."
   },
   {
    "value": "45.54",
    "misconception": "missed-step",
    "feedback": "The first 100 texts are included. Only the 37 extra texts cost $0.15 each."
   }
  ],
  "hint": "How many texts are extra?",
  "steps": [
   {
    "say": "Extra texts.",
    "ask": {
     "prompt": "137 − 100 = ?",
     "answer": {
      "type": "num",
      "value": "37",
      "form": "number"
     },
     "hint": "Subtract the included texts.",
     "reveal": "37."
    }
   },
   {
    "say": "Charge for extras.",
    "ask": {
     "prompt": "37 &times; 0.15 = ?",
     "answer": {
      "type": "num",
      "value": "5.55",
      "form": "money"
     },
     "hint": "37 &times; 15 = 555.",
     "reveal": "$5.55."
    }
   },
   {
    "say": "Total bill.",
    "ask": {
     "prompt": "24.99 + 5.55 = ?",
     "answer": {
      "type": "num",
      "value": "30.54",
      "form": "money"
     },
     "hint": "Line up the points.",
     "reveal": "$30.54."
    }
   }
  ]
 },
 {
  "id": "b168",
  "skill": "word-dec",
  "kind": "word",
  "level": 3,
  "prompt": "Three packages weigh 2.35 kg, 1.8 kg, and 3.125 kg. The shipping limit is 8 kg. How many kilograms under the limit is the shipment?",
  "answer": {
   "type": "num",
   "value": "0.725",
   "form": "decimal",
   "label": [
    "kilograms",
    "kilogram",
    "kg",
    "kilos",
    "kilo"
   ]
  },
  "errors": [
   {
    "value": "7.275",
    "misconception": "missed-step",
    "feedback": "7.275 kg is the total weight. The question asks how far UNDER the limit."
   },
   {
    "value": "15.275",
    "misconception": "wrong-operation",
    "feedback": "You added the limit. 'Under the limit' means subtract."
   }
  ],
  "hint": "Add the weights with the decimal points lined up, then subtract from 8.",
  "steps": [
   {
    "say": "Total weight.",
    "figure": {
     "type": "columns",
     "numbers": [
      "2.35",
      "1.8",
      "3.125"
     ],
     "op": "+"
    },
    "ask": {
     "prompt": "2.350 + 1.800 + 3.125 = ?",
     "answer": {
      "type": "num",
      "value": "7.275",
      "form": "decimal"
     },
     "hint": "Use three decimal places.",
     "reveal": "7.275."
    }
   },
   {
    "say": "Below the limit.",
    "ask": {
     "prompt": "8 − 7.275 = ? (with label)",
     "answer": {
      "type": "num",
      "value": "0.725",
      "form": "decimal",
      "label": [
       "kilograms",
       "kilogram",
       "kg",
       "kilos",
       "kilo"
      ]
     },
     "hint": "8.000 − 7.275.",
     "reveal": "0.725 kilograms."
    }
   }
  ]
 },
 {
  "id": "b169",
  "skill": "word-dec",
  "kind": "word",
  "level": 3,
  "prompt": "Rope is sold by the meter and can be cut. Each of 7 swings needs 3.2 meters of rope. How many meters of rope must Max buy?",
  "answer": {
   "type": "num",
   "value": "23",
   "form": "number",
   "label": [
    "meters",
    "meter",
    "m",
    "metres",
    "metre"
   ],
   "rounding": {
    "mode": "up",
    "to": 1,
    "why": "You can't buy or use part of one: when you need ENOUGH, round UP to the next whole number."
   }
  },
  "errors": [
   {
    "value": "22",
    "misconception": "math-vs-real-rounding",
    "feedback": "22 m is not enough: the swings need 22.4 m. He must buy enough, so round UP."
   },
   {
    "value": "22.4",
    "misconception": "missed-step",
    "feedback": "Rope is sold only in whole meters. Round to a whole number."
   }
  ],
  "hint": "Total rope needed, then ask whether he can buy part of a meter.",
  "steps": [
   {
    "say": "Total rope.",
    "figure": {
     "type": "roundline",
     "value": "22.4",
     "step": 1,
     "mode": "up"
    },
    "ask": {
     "prompt": "7 &times; 3.2 = ?",
     "answer": {
      "type": "num",
      "value": "22.4",
      "form": "decimal"
     },
     "hint": "7 &times; 32 = 224.",
     "reveal": "22.4 m."
    }
   },
   {
    "say": "Whole meters, enough rope.",
    "ask": {
     "prompt": "Meters to buy?",
     "answer": {
      "type": "num",
      "value": "23",
      "form": "number",
      "label": [
       "meters",
       "meter",
       "m",
       "metres",
       "metre"
      ]
     },
     "hint": "Round up.",
     "reveal": "23 meters."
    }
   }
  ]
 },
 {
  "id": "b170",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "Four friends buy movie tickets at $11.75 each and share one large popcorn for $9.40. They pay with $60. How much change do they get back?",
  "answer": {
   "type": "num",
   "value": "3.6",
   "form": "money"
  },
  "errors": [
   {
    "value": "56.4",
    "misconception": "missed-step",
    "feedback": "$56.40 is the total COST. The question asks for the change."
   },
   {
    "value": "116.4",
    "misconception": "wrong-operation",
    "feedback": "You added the $60 payment to the cost."
   }
  ],
  "hint": "4 tickets, then the popcorn, then the change.",
  "steps": [
   {
    "say": "Tickets.",
    "ask": {
     "prompt": "4 &times; 11.75 = ?",
     "answer": {
      "type": "num",
      "value": "47",
      "form": "money"
     },
     "hint": "4 &times; 11 + 4 &times; 0.75.",
     "reveal": "$47.00."
    }
   },
   {
    "say": "Add the popcorn.",
    "ask": {
     "prompt": "47.00 + 9.40 = ?",
     "answer": {
      "type": "num",
      "value": "56.4",
      "form": "money"
     },
     "hint": "Line up the points.",
     "reveal": "$56.40."
    }
   },
   {
    "say": "Change.",
    "ask": {
     "prompt": "60 − 56.40 = ?",
     "answer": {
      "type": "num",
      "value": "3.6",
      "form": "money"
     },
     "hint": "60.00 − 56.40.",
     "reveal": "$3.60."
    }
   }
  ]
 },
 {
  "id": "b171",
  "skill": "word-dec",
  "kind": "word",
  "level": 3,
  "prompt": "Mia paid $7.00 for 3 pounds of plums. To the nearest cent, what is the price per pound?",
  "answer": {
   "type": "num",
   "value": "2.33",
   "form": "money",
   "rounding": {
    "mode": "nearest",
    "to": 0.01,
    "why": "Money is rounded to the nearest cent."
   }
  },
  "errors": [
   {
    "value": "2.34",
    "misconception": "rounding-direction",
    "feedback": "7 &divide; 3 = 2.3333…: the next digit is 3, so it rounds DOWN to $2.33."
   },
   {
    "value": "2.333",
    "misconception": "money-cents",
    "feedback": "Money goes to the cent: exactly 2 decimal places."
   }
  ],
  "hint": "7 &divide; 3, then look at the digit after the cents.",
  "steps": [
   {
    "say": "Divide.",
    "figure": {
     "type": "roundline",
     "value": "2.3333",
     "step": 0.01,
     "mode": "nearest"
    },
    "ask": {
     "prompt": "7 &divide; 3 = 2.333… What digit follows 2.33?",
     "answer": {
      "type": "num",
      "value": "3",
      "form": "number"
     },
     "hint": "The third decimal place.",
     "reveal": "3."
    }
   },
   {
    "say": "3 rounds down.",
    "ask": {
     "prompt": "Price per pound?",
     "answer": {
      "type": "num",
      "value": "2.33",
      "form": "money"
     },
     "hint": "Is the digit after the cents 5 or more?",
     "reveal": "$2.33."
    }
   }
  ]
 },
 {
  "id": "b172",
  "skill": "word-dec",
  "kind": "word",
  "level": 2,
  "prompt": "A bakery started the week with 40 pounds of cheese. It sold 14.5 pounds on Monday and 9.75 pounds on Tuesday. How many pounds are left?",
  "answer": {
   "type": "num",
   "value": "15.75",
   "form": "decimal",
   "label": [
    "pounds",
    "pound",
    "lb",
    "lbs"
   ]
  },
  "errors": [
   {
    "value": "24.25",
    "misconception": "missed-step",
    "feedback": "24.25 pounds is what was SOLD. Subtract from the 40."
   },
   {
    "value": "64.25",
    "misconception": "wrong-operation",
    "feedback": "You added the 40 pounds. 'Left' means subtract."
   }
  ],
  "hint": "Add what was sold, then subtract from 40.",
  "steps": [
   {
    "say": "Sold.",
    "figure": {
     "type": "columns",
     "numbers": [
      "14.5",
      "9.75"
     ],
     "op": "+"
    },
    "ask": {
     "prompt": "14.50 + 9.75 = ?",
     "answer": {
      "type": "num",
      "value": "24.25",
      "form": "decimal"
     },
     "hint": "Line up the points.",
     "reveal": "24.25."
    }
   },
   {
    "say": "Left.",
    "ask": {
     "prompt": "40 − 24.25 = ? (with label)",
     "answer": {
      "type": "num",
      "value": "15.75",
      "form": "decimal",
      "label": [
       "pounds",
       "pound",
       "lb",
       "lbs"
      ]
     },
     "hint": "40.00 − 24.25.",
     "reveal": "15.75 pounds."
    }
   }
  ]
 }
];

window.FDP_MOCK = {
 "title": "Mock test",
 "items": [
  "b052",
  "b054",
  "b011",
  "b032",
  "b022",
  "b068",
  "b015",
  "b058",
  "b001",
  "b119",
  "b121",
  "b122",
  "b125",
  "b130",
  "b146",
  "b150",
  "b151",
  "b153",
  "b156",
  "b157",
  "b162",
  "b111",
  "b112",
  "b114"
 ]
};

window.FDP_MOCK_B = {
 "title": "Mock test B",
 "items": [
  "b055",
  "b053",
  "b029",
  "b038",
  "b025",
  "b050",
  "b060",
  "b069",
  "b016",
  "b136",
  "b138",
  "b140",
  "b143",
  "b144",
  "b145",
  "b158",
  "b167",
  "b168",
  "b169",
  "b170",
  "b171",
  "b113",
  "b115",
  "b117"
 ]
};
