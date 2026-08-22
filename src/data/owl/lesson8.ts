import type { OwlPack } from './types';

export const lesson8Owl: Record<string, OwlPack> = {
  'l8-c1': {
    owlHelp: {
      intro: 'Geen stress. Eerst vermenigvuldigen, daarna optellen.',
      steps: [
        {
          explanation: '−6 + (−3) × 2.\nEerst (−3) × 2.',
          question: 'Wat is (−3) × 2?',
          options: [
            { id: 'm6', label: '−6' },
            { id: '6', label: '6' },
            { id: 'm5', label: '−5' },
          ],
          correctAnswer: 'm6',
          successFeedback: 'Juist. Dan: −6 + (−6).',
          retryFeedback: 'Negatief × positief = negatief.',
        },
        {
          explanation: '−6 + (−6) = ?',
          question: 'Wat is het eindantwoord?',
          options: [
            { id: '0', label: '0' },
            { id: 'm12', label: '−12' },
            { id: '12', label: '12' },
          ],
          correctAnswer: 'm12',
          successFeedback: 'Precies: −12.',
          retryFeedback: 'Twee keer −6 bij elkaar.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 −12',
    },
    bonusVariants: [
      {
        id: 'l8c1-b1',
        type: 'number-input',
        question: 'Bereken: −4 + (−2) × 3',
        answer: -10,
        hint1: 'Eerst (−2)×3 = −6.',
        hint2: '−4 + (−6) = −10.',
        explanation: '−10.',
      },
      {
        id: 'l8c1-b2',
        type: 'number-input',
        question: 'Bereken: 5 + (−4) × 2',
        answer: -3,
        hint1: 'Eerst (−4)×2 = −8.',
        hint2: '5 + (−8) = −3.',
        explanation: '−3.',
      },
    ],
  },

  'l8-c2': {
    owlHelp: {
      intro: 'Geen stress. De 2 moet bij beide termen.',
      steps: [
        {
          explanation: '2(3x − 1) = 2·3x + 2·(−1).',
          question: 'Wat is 2 × 3x?',
          options: [
            { id: '5x', label: '5x' },
            { id: '6x', label: '6x' },
            { id: '3x', label: '3x' },
          ],
          correctAnswer: '6x',
          successFeedback: 'Juist. En 2 × (−1) = −2.',
          retryFeedback: '2 × 3 = 6, dus 6x.',
        },
        {
          explanation: 'Dus 6x − 2.',
          question: 'Wat is 2(3x − 1) uitgewerkt?',
          options: [
            { id: 'a', label: '6x − 1' },
            { id: 'b', label: '6x − 2' },
            { id: 'c', label: '5x − 2' },
          ],
          correctAnswer: 'b',
          successFeedback: 'Precies: 6x − 2.',
          retryFeedback: 'Vergeet de −1 niet mee te vermenigvuldigen.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 6x − 2',
    },
    bonusVariants: [
      {
        id: 'l8c2-b1',
        type: 'multiple-choice',
        question: 'Wat is 3(2x − 4) uitgewerkt?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '6x − 12' },
          { id: 'b', label: '6x − 4' },
          { id: 'c', label: '5x − 12' },
        ],
        hint1: '3×2x en 3×(−4).',
        hint2: '6x − 12.',
        explanation: '6x − 12.',
      },
      {
        id: 'l8c2-b2',
        type: 'multiple-choice',
        question: 'Wat is 4(x + 5) uitgewerkt?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: '4x + 5' },
          { id: 'b', label: '4x + 20' },
          { id: 'c', label: 'x + 20' },
        ],
        hint1: '4×x en 4×5.',
        hint2: '4x + 20.',
        explanation: '4x + 20.',
      },
    ],
  },

  'l8-c3': {
    owlHelp: {
      intro: 'Geen stress. Eerst de constante weg, dan delen.',
      steps: [
        {
          explanation: '4x − 7 = 9. Haal −7 weg met +7.',
          question: 'Wat krijg je?',
          options: [
            { id: 'a', label: '4x = 16' },
            { id: 'b', label: '4x = 2' },
            { id: 'c', label: '4x = 9' },
          ],
          correctAnswer: 'a',
          successFeedback: 'Juist: 4x = 16.',
          retryFeedback: '9 + 7 = 16.',
        },
        {
          explanation: 'Deel beide kanten door 4.',
          question: 'Wat is x?',
          options: [
            { id: '4', label: '4' },
            { id: '3', label: '3' },
            { id: '12', label: '12' },
          ],
          correctAnswer: '4',
          successFeedback: 'Precies: x = 4.',
          retryFeedback: '16 ÷ 4 = 4.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 x = 4',
    },
    bonusVariants: [
      {
        id: 'l8c3-b1',
        type: 'number-input',
        question: 'Los op: 5x − 3 = 17. Wat is x?',
        answer: 4,
        hint1: 'Eerst +3, dan ÷5.',
        hint2: '5x = 20 → x = 4.',
        explanation: 'x = 4.',
      },
      {
        id: 'l8c3-b2',
        type: 'number-input',
        question: 'Los op: 3x + 2 = 14. Wat is x?',
        answer: 4,
        hint1: 'Eerst −2, dan ÷3.',
        hint2: '3x = 12 → x = 4.',
        explanation: 'x = 4.',
      },
    ],
  },

  'l8-c4': {
    owlHelp: {
      intro: 'Geen stress. We isoleren ℓ uit P = 2ℓ + 2b.',
      steps: [
        {
          explanation: 'P = 2ℓ + 2b. Haal eerst 2b weg.',
          question: 'Wat blijft er over?',
          options: [
            { id: 'a', label: 'P − 2b = 2ℓ' },
            { id: 'b', label: 'P + 2b = 2ℓ' },
            { id: 'c', label: 'P = 2ℓ' },
          ],
          correctAnswer: 'a',
          successFeedback: 'Juist: P − 2b = 2ℓ.',
          retryFeedback: 'Trek 2b van beide kanten af.',
        },
        {
          explanation: 'Deel beide kanten door 2.',
          question: 'Welke formule voor ℓ?',
          options: [
            { id: 'a', label: 'ℓ = (P − 2b) / 2' },
            { id: 'b', label: 'ℓ = P − 2b' },
            { id: 'c', label: 'ℓ = 2P − b' },
          ],
          correctAnswer: 'a',
          successFeedback: 'Precies: ℓ = (P − 2b) / 2.',
          retryFeedback: 'Deel alles door 2.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 ℓ = (P − 2b) / 2',
    },
    bonusVariants: [
      {
        id: 'l8c4-b1',
        type: 'text-input',
        question: 'O = 2a + 2c. Geef a (a = …). Gebruik O en c.',
        answer: 'a=(O-2c)/2',
        acceptedAnswers: ['a=(O-2c)/2', 'a=O/2-c', 'a=(o-2c)/2'],
        hint1: 'Eerst −2c, dan ÷2.',
        hint2: 'a = (O − 2c) / 2',
        explanation: 'a = (O − 2c) / 2',
      },
      {
        id: 'l8c4-b2',
        type: 'text-input',
        question: 'S = 2p + 2q. Geef p (p = …).',
        answer: 'p=(S-2q)/2',
        acceptedAnswers: ['p=(S-2q)/2', 'p=S/2-q', 'p=(s-2q)/2'],
        hint1: 'Eerst −2q, dan ÷2.',
        hint2: 'p = (S − 2q) / 2',
        explanation: 'p = (S − 2q) / 2',
      },
    ],
  },

  'l8-c5': {
    owlHelp: {
      intro: 'Geen stress. Gelijke noemers maken.',
      steps: [
        {
          explanation: '3/4 − 1/6. Noemers 4 en 6 → 12.',
          question: 'Wat is 3/4 als twaalfde?',
          options: [
            { id: '912', label: '9/12' },
            { id: '312', label: '3/12' },
            { id: '612', label: '6/12' },
          ],
          correctAnswer: '912',
          successFeedback: 'Juist. En 1/6 = 2/12.',
          retryFeedback: '×3 bij teller en noemer.',
        },
        {
          explanation: '9/12 − 2/12 = ?',
          question: 'Wat is het verschil?',
          options: [
            { id: 'b', label: '7/12' },
            { id: 'c', label: '1/2' },
            { id: 'd', label: '5/12' },
          ],
          correctAnswer: 'b',
          successFeedback: 'Precies: 7/12.',
          retryFeedback: '9 − 2 = 7, noemer 12.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 7/12',
    },
    bonusVariants: [
      {
        id: 'l8c5-b1',
        type: 'multiple-choice',
        question: 'Wat is 2/3 − 1/4?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '5/12' },
          { id: 'b', label: '1/7' },
          { id: 'c', label: '1/12' },
        ],
        hint1: 'Noemer 12: 8/12 − 3/12.',
        hint2: '5/12.',
        explanation: '5/12.',
      },
      {
        id: 'l8c5-b2',
        type: 'multiple-choice',
        question: 'Wat is 5/6 − 1/3?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: '4/3' },
          { id: 'b', label: '1/2' },
          { id: 'c', label: '4/6' },
        ],
        hint1: '1/3 = 2/6.',
        hint2: '5/6 − 2/6 = 3/6 = 1/2.',
        explanation: '1/2.',
      },
    ],
  },

  'l8-c6': {
    owlHelp: {
      intro: 'Geen stress. 3³ = 3×3×3.',
      steps: [
        {
          explanation: 'Eerst 3×3 = 9.',
          question: 'Wat is 9 × 3?',
          options: [
            { id: '12', label: '12' },
            { id: '27', label: '27' },
            { id: '81', label: '81' },
          ],
          correctAnswer: '27',
          successFeedback: 'Juist: 3³ = 27.',
          retryFeedback: '9×3=27.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 27',
    },
    bonusVariants: [
      {
        id: 'l8c6-b1',
        type: 'number-input',
        question: '2⁴ = ?',
        answer: 16,
        hint1: '2×2×2×2.',
        hint2: '16.',
        explanation: '2⁴ = 16.',
      },
      {
        id: 'l8c6-b2',
        type: 'number-input',
        question: '4³ = ?',
        answer: 64,
        hint1: '4×4×4.',
        hint2: '64.',
        explanation: '4³ = 64.',
      },
    ],
  },

  'l8-c7': {
    owlHelp: {
      intro: 'Geen stress. Y-as → x = 0.',
      steps: [
        {
          explanation: 'y = 0,5x − 1. Vul x = 0 in.',
          question: 'Wat is y?',
          options: [
            { id: 'a', label: '0,5' },
            { id: 'b', label: '−1' },
            { id: 'c', label: '0' },
          ],
          correctAnswer: 'b',
          successFeedback: 'Precies: y = −1.',
          retryFeedback: '0,5×0 − 1 = −1.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 y = −1',
    },
    bonusVariants: [
      {
        id: 'l8c7-b1',
        type: 'multiple-choice',
        question: 'Bij y = 2x + 5, waar snijdt de grafiek de y-as?',
        answer: 'c',
        answerOptions: [
          { id: 'a', label: 'y = 2' },
          { id: 'b', label: 'y = 0' },
          { id: 'c', label: 'y = 5' },
        ],
        hint1: 'Vul x=0 in.',
        hint2: 'y=5.',
        explanation: 'y = 5.',
      },
      {
        id: 'l8c7-b2',
        type: 'multiple-choice',
        question: 'Bij y = −x + 3, waar snijdt de grafiek de y-as?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'y = 3' },
          { id: 'b', label: 'y = −1' },
          { id: 'c', label: 'y = 0' },
        ],
        hint1: 'Vul x=0 in.',
        hint2: 'y=3.',
        explanation: 'y = 3.',
      },
    ],
  },

  'l8-c8': {
    owlHelp: {
      intro: 'Geen stress. Check of de stappen gelijk zijn.',
      steps: [
        {
          explanation: 'y-waarden: 2, 5, 8, 11.',
          question: 'Wat is het verschil tussen opeenvolgende y-waarden?',
          options: [
            { id: '2', label: '+2' },
            { id: '3', label: '+3' },
            { id: 'wissel', label: 'Wisselend' },
          ],
          correctAnswer: '3',
          successFeedback: 'Juist: steeds +3 → lineair.',
          retryFeedback: '5−2, 8−5, 11−8.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Ja, lineair.',
    },
    bonusVariants: [
      {
        id: 'l8c8-b1',
        type: 'multiple-choice',
        question: 'Tabel (0,1)(1,4)(2,7)(3,10) is lineair.',
        answer: 'ja',
        answerOptions: [
          { id: 'ja', label: 'Ja' },
          { id: 'nee', label: 'Nee' },
        ],
        hint1: 'Stappen +3.',
        hint2: 'Ja.',
        explanation: 'Ja, lineair.',
      },
      {
        id: 'l8c8-b2',
        type: 'multiple-choice',
        question: 'Tabel (0,1)(1,2)(2,4)(3,8) is lineair.',
        answer: 'nee',
        answerOptions: [
          { id: 'ja', label: 'Ja' },
          { id: 'nee', label: 'Nee' },
        ],
        hint1: 'De stappen verdubbelen.',
        hint2: 'Nee.',
        explanation: 'Nee, niet lineair.',
      },
    ],
  },

  'l8-c9': {
    owlHelp: {
      intro: 'Geen stress. x² maakt een bocht, geen rechte lijn.',
      steps: [
        {
          explanation: 'Punten zoals (−2,4), (0,0), (2,4) liggen niet op één rechte lijn.',
          question: 'Welke vorm hoort bij y = x²?',
          options: [
            { id: 'a', label: 'Rechte lijn' },
            { id: 'b', label: 'U-vormige parabool' },
            { id: 'c', label: 'Horizontale lijn' },
          ],
          correctAnswer: 'b',
          successFeedback: 'Precies: een U-vormige parabool.',
          retryFeedback: 'Kwadratisch → parabool.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Parabool.',
    },
    bonusVariants: [
      {
        id: 'l8c9-b1',
        type: 'multiple-choice',
        question: 'Welke grafiek hoort bij y = x² + 1?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'Rechte lijn door (0,1)' },
          { id: 'b', label: 'Parabool met laagste punt op (0,1)' },
          { id: 'c', label: 'Horizontale lijn y=1' },
        ],
        hint1: 'Nog steeds x²-vorm.',
        hint2: 'Parabool, 1 omhoog.',
        explanation: 'Parabool met top/dal op (0,1).',
      },
      {
        id: 'l8c9-b2',
        type: 'multiple-choice',
        question: 'Welke formule hoort bij een rechte lijn?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'y = 2x + 1' },
          { id: 'b', label: 'y = x²' },
          { id: 'c', label: 'y = x² − 3' },
        ],
        hint1: 'Geen kwadraat → recht.',
        hint2: 'y = 2x + 1.',
        explanation: 'y = 2x + 1 is lineair.',
      },
    ],
  },

  'l8-c10': {
    owlHelp: {
      intro: 'Geen stress. We lossen de sommen op voor de letters.',
      steps: [
        {
          explanation: '√36 − 1. Eerst √36 = 6.',
          question: 'Wat is 6 − 1?',
          options: [
            { id: '5', label: '5' },
            { id: '7', label: '7' },
            { id: '35', label: '35' },
          ],
          correctAnswer: '5',
          successFeedback: 'Juist → letter W.',
          retryFeedback: '6 − 1 = 5.',
        },
        {
          explanation:
            '2² + 3 = 4 + 3 = 7 → I\n15 ÷ 5 + 1 = 4 → L\n−2 + 8 − 3 = 3 → D',
          question: 'Welk woord vormen W, I, L, D?',
          options: [
            { id: 'wild', label: 'WILD' },
            { id: 'wind', label: 'WIND' },
            { id: 'weld', label: 'WELD' },
          ],
          correctAnswer: 'wild',
          successFeedback: 'De tempel opent: WILD!',
          retryFeedback: 'Letters in volgorde van de sommen.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 WILD',
    },
    bonusVariants: [
      {
        id: 'l8c10-b1',
        type: 'number-input',
        question: 'Bereken: √25 + 2',
        answer: 7,
        hint1: '√25 = 5.',
        hint2: '5 + 2 = 7.',
        explanation: '7.',
      },
      {
        id: 'l8c10-b2',
        type: 'number-input',
        question: 'Bereken: 3² − 1',
        answer: 8,
        hint1: '3² = 9.',
        hint2: '9 − 1 = 8.',
        explanation: '8.',
      },
    ],
  },
};
