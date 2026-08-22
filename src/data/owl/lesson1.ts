import type { OwlPack } from './types';

export const lesson1Owl: Record<string, OwlPack> = {
  'l1-c1': {
    owlHelp: {
      intro: 'Geen stress. We checken de sommen één voor één. Let op de mintekens.',
      steps: [
        {
          explanation:
            'Kijk eerst naar C: −3 × −4.\n\nNegatief × negatief geeft…',
          question: 'Wat wordt −3 × −4?',
          options: [
            { id: 'neg', label: '−12' },
            { id: 'pos', label: '12' },
            { id: 'zero', label: '0' },
          ],
          correctAnswer: 'pos',
          successFeedback: 'Juist. Twee mintekens bij vermenigvuldigen → positief. C klopt.',
          retryFeedback: 'Denk aan de regel: min × min = plus.',
        },
        {
          explanation:
            'Nu A: −4 + 7.\n\nVan −4 naar rechts over de nullijn.',
          question: 'Wat is −4 + 7?',
          options: [
            { id: 'm11', label: '−11' },
            { id: 'p3', label: '3' },
            { id: 'm3', label: '−3' },
          ],
          correctAnswer: 'p3',
          successFeedback: 'Precies: −4 + 7 = 3. Dus A klopt niet.',
          retryFeedback: 'Tel 7 bij −4 op. Je komt boven nul.',
        },
        {
          explanation:
            'B: 5 − (−3) betekent 5 min een negatief getal.\nD: 18 ÷ −3.',
          question: 'Welke berekeningen kloppen echt?',
          options: [
            { id: 'onlyC', label: 'Alleen C' },
            { id: 'bAndC', label: 'B en C' },
            { id: 'all', label: 'Allemaal' },
          ],
          correctAnswer: 'onlyC',
          successFeedback:
            'Goed gezien.\nB: 5 − (−3) = 8 (niet 2)\nD: 18 ÷ −3 = −6 (niet 6)\nAlleen C klopt.',
          retryFeedback: 'Check B en D nog eens: min een min, en delen door een negatief.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Alleen C is juist.',
    },
    bonusVariants: [
      {
        id: 'l1c1-b1',
        type: 'multiple-choice',
        question: 'Welke berekening klopt?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: '−2 + 5 = −7' },
          { id: 'b', label: '−2 × −5 = 10' },
          { id: 'c', label: '8 ÷ −2 = 4' },
        ],
        hint1: 'Min × min = plus. Delen door een min geeft een min.',
        hint2: '−2 × −5 = 10.',
        explanation: 'Alleen −2 × −5 = 10 klopt.',
      },
      {
        id: 'l1c1-b2',
        type: 'multiple-choice',
        question: 'Welke berekening klopt?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '6 − (−2) = 8' },
          { id: 'b', label: '−3 + 1 = −4' },
          { id: 'c', label: '−4 × 2 = 8' },
        ],
        hint1: 'Min een negatief = optellen.',
        hint2: '6 − (−2) = 6 + 2 = 8.',
        explanation: '6 − (−2) = 8.',
      },
    ],
  },

  'l1-c2': {
    owlHelp: {
      intro: 'Geen stress. We kijken wat er tussen de haakjes gebeurt.',
      steps: [
        {
          explanation:
            'Er staat: 3(x + 4).\n\nDe 3 staat buiten de haakjes.\nDie hoort bij élke term ertussen.',
          question: 'Met hoeveel termen moet de 3 vermenigvuldigd worden?',
          options: [
            { id: 'one', label: 'Alleen met x' },
            { id: 'both', label: 'Met x én met 4' },
            { id: 'none', label: 'Met geen van beide' },
          ],
          correctAnswer: 'both',
          successFeedback: 'Precies. 3 × x én 3 × 4.',
          retryFeedback: 'Alles tussen de haakjes krijgt de 3.',
        },
        {
          explanation: '3 × x = 3x.\nEn 3 × 4 = ?',
          question: 'Wat is 3 × 4?',
          options: [
            { id: '4', label: '4' },
            { id: '7', label: '7' },
            { id: '12', label: '12' },
          ],
          correctAnswer: '12',
          successFeedback:
            'Juist. Dus 3(x + 4) = 3x + 12.\nIn de som stond 3x + 4 — daar ging het mis bij de +4.',
          retryFeedback: '3 keer 4 is 12.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 De fout zat bij de +4.',
    },
    bonusVariants: [
      {
        id: 'l1c2-b1',
        type: 'multiple-choice',
        question: 'Waar gaat het mis? Iemand schreef: 4(x + 2) = 4x + 2',
        answer: 'c',
        answerOptions: [
          { id: 'a', label: 'Bij de 4' },
          { id: 'b', label: 'Bij de x' },
          { id: 'c', label: 'Bij de +2' },
          { id: 'd', label: 'Er is geen fout' },
        ],
        hint1: 'De 4 moet ook met de 2 vermenigvuldigd worden.',
        hint2: 'Correct is 4x + 8.',
        explanation: '4(x + 2) = 4x + 8. De fout zit bij de +2.',
      },
      {
        id: 'l1c2-b2',
        type: 'multiple-choice',
        question: 'Wat is 5(y − 3) uitgewerkt?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: '5y − 3' },
          { id: 'b', label: '5y − 15' },
          { id: 'c', label: '5y + 15' },
        ],
        hint1: 'Vermenigvuldig 5 met beide termen.',
        hint2: '5 × (−3) = −15.',
        explanation: '5(y − 3) = 5y − 15.',
      },
    ],
  },

  'l1-c3': {
    owlHelp: {
      intro: 'Geen stress. We kraken de kluis som voor som.',
      steps: [
        {
          explanation: 'Eerste som: −2 + 9.',
          question: 'Wat is −2 + 9?',
          options: [
            { id: '7', label: '7' },
            { id: '11', label: '−11' },
            { id: 'm7', label: '−7' },
          ],
          correctAnswer: '7',
          successFeedback: 'Goed. −2 + 9 = 7 → letter P.',
          retryFeedback: 'Start bij −2 en tel 9 erbij.',
        },
        {
          explanation: 'Tweede: 3 × (−1) + 5.\nEerst vermenigvuldigen.',
          question: 'Wat is 3 × (−1) + 5?',
          options: [
            { id: '2', label: '2' },
            { id: '8', label: '8' },
            { id: 'm2', label: '−2' },
          ],
          correctAnswer: '2',
          successFeedback: 'Juist: −3 + 5 = 2 → letter A.',
          retryFeedback: 'Eerst 3 × (−1) = −3, daarna +5.',
        },
        {
          explanation:
            'Derde: 16 ÷ (−4) + 8 = −4 + 8 = 4 → W\nVierde: −5 − (−8) = −5 + 8 = 3 → S',
          question: 'Welk geheime woord vormen P, A, W, S?',
          options: [
            { id: 'paws', label: 'PAWS' },
            { id: 'swap', label: 'SWAP' },
            { id: 'wasp', label: 'WASP' },
          ],
          correctAnswer: 'paws',
          successFeedback: 'De kluis opent: PAWS!',
          retryFeedback: 'Lees de letters in volgorde van de sommen.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Het woord is PAWS.',
    },
    bonusVariants: [
      {
        id: 'l1c3-b1',
        type: 'number-input',
        question: 'Bereken: −3 + 10',
        answer: 7,
        hint1: 'Tel 10 bij −3 op.',
        hint2: '−3 + 10 = 7.',
        explanation: '−3 + 10 = 7.',
      },
      {
        id: 'l1c3-b2',
        type: 'number-input',
        question: 'Bereken: −4 − (−6)',
        answer: 2,
        hint1: 'Min een negatief = plus.',
        hint2: '−4 + 6 = 2.',
        explanation: '−4 − (−6) = 2.',
      },
    ],
  },

  'l1-c4': {
    owlHelp: {
      intro: 'Geen stress. We willen x alleen overhouden.',
      steps: [
        {
          explanation:
            'Er staat: 2x + 5 = 17.\n\nDe +5 zit “aan de buitenkant” bij de x-kant.',
          question: 'Wat doe je eerst om dichter bij x te komen?',
          options: [
            { id: 'min5', label: 'Beide kanten −5' },
            { id: 'plus5', label: 'Beide kanten +5' },
            { id: 'div2', label: 'Beide kanten ÷ 2' },
          ],
          correctAnswer: 'min5',
          successFeedback: 'Precies. Tegenovergestelde van +5 is −5.\nDan: 2x = 12.',
          retryFeedback: 'Haal eerst de +5 weg met de tegenovergestelde bewerking.',
        },
        {
          explanation: 'Nu: 2x = 12.\nDat betekent 2 × x = 12.',
          question: 'Hoe krijg je x alleen?',
          options: [
            { id: 'div2', label: 'Beide kanten ÷ 2' },
            { id: 'min2', label: 'Beide kanten − 2' },
            { id: 'mul2', label: 'Beide kanten × 2' },
          ],
          correctAnswer: 'div2',
          successFeedback: 'Juist. x = 6.',
          retryFeedback: 'Het tegenovergestelde van ×2 is delen door 2.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 x = 6',
    },
    bonusVariants: [
      {
        id: 'l1c4-b1',
        type: 'number-input',
        question: 'Los op: 3x + 4 = 19. Wat is x?',
        answer: 5,
        hint1: 'Eerst −4, daarna ÷ 3.',
        hint2: '3x = 15 → x = 5.',
        explanation: '3x + 4 = 19 → 3x = 15 → x = 5.',
      },
      {
        id: 'l1c4-b2',
        type: 'number-input',
        question: 'Los op: 2x − 3 = 11. Wat is x?',
        answer: 7,
        hint1: 'Eerst +3, daarna ÷ 2.',
        hint2: '2x = 14 → x = 7.',
        explanation: '2x − 3 = 11 → 2x = 14 → x = 7.',
      },
    ],
  },

  'l1-c5': {
    owlHelp: {
      intro: 'Geen stress. We testen de claims met een snelle check.',
      steps: [
        {
          explanation: 'Sam zegt: bij x + 8 = 3 is x = −5.\nCheck: −5 + 8 = ?',
          question: 'Klopt Sams antwoord?',
          options: [
            { id: 'ja', label: 'Ja' },
            { id: 'nee', label: 'Nee' },
          ],
          correctAnswer: 'ja',
          successFeedback: 'Klopt: −5 + 8 = 3.',
          retryFeedback: 'Vul −5 in bij x + 8.',
        },
        {
          explanation: 'Finn zegt: bij −x = 4 is x = 4.\nAls −x = 4, wat is x dan?',
          question: 'Wat is x als −x = 4?',
          options: [
            { id: 'p4', label: 'x = 4' },
            { id: 'm4', label: 'x = −4' },
            { id: '0', label: 'x = 0' },
          ],
          correctAnswer: 'm4',
          successFeedback:
            'Juist. Vermenigvuldig beide kanten met −1: x = −4.\nFinn zit ernaast — die oplossing kan niet.',
          retryFeedback: 'Draai het teken om: −x = 4 → x = −4.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Antwoord C kan niet.',
    },
    bonusVariants: [
      {
        id: 'l1c5-b1',
        type: 'multiple-choice',
        question: 'Welke oplossing kan niet? −2x = 8',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'Iemand zegt x = −4' },
          { id: 'b', label: 'Iemand zegt x = 4' },
        ],
        hint1: 'Deel beide kanten door −2.',
        hint2: 'x = −4.',
        explanation: '−2x = 8 → x = −4. Dus x = 4 kan niet.',
      },
      {
        id: 'l1c5-b2',
        type: 'multiple-choice',
        question: 'Welke oplossing kan niet? x − 6 = −1',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'Iemand zegt x = −7' },
          { id: 'b', label: 'Iemand zegt x = 5' },
        ],
        hint1: 'Tel 6 bij beide kanten op.',
        hint2: 'x = 5.',
        explanation: 'x − 6 = −1 → x = 5. −7 kan niet.',
      },
    ],
  },
};
