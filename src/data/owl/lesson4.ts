import type { OwlPack } from './types';

export const lesson4Owl: Record<string, OwlPack> = {
  'l4-c1': {
    owlHelp: {
      intro: 'Geen stress. We maken de noemers gelijk, of denken in decimalen.',
      steps: [
        {
          explanation: '3/4 en 5/8.\nNoemers 4 en 8: 4 past in 8.',
          question: 'Wat is 3/4 met noemer 8?',
          options: [
            { id: '68', label: '6/8' },
            { id: '38', label: '3/8' },
            { id: '58', label: '5/8' },
          ],
          correctAnswer: '68',
          successFeedback: 'Juist: 3/4 = 6/8.',
          retryFeedback: 'Teller en noemer ×2.',
        },
        {
          explanation: 'Nu: 6/8 versus 5/8.',
          question: 'Welke is groter?',
          options: [
            { id: 'a', label: '3/4 (=6/8)' },
            { id: 'b', label: '5/8' },
            { id: 'eq', label: 'Even groot' },
          ],
          correctAnswer: 'a',
          successFeedback: 'Precies. 6/8 > 5/8, dus 3/4 is groter.',
          retryFeedback: 'Zelfde noemer: kijk naar de teller.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 3/4 is groter.',
    },
    bonusVariants: [
      {
        id: 'l4c1-b1',
        type: 'multiple-choice',
        question: 'Welke is groter: 2/3 of 3/5?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '2/3' },
          { id: 'b', label: '3/5' },
          { id: 'c', label: 'Even groot' },
        ],
        hint1: 'Maak noemer 15: 10/15 vs 9/15.',
        hint2: '2/3 is groter.',
        explanation: '2/3 = 10/15 > 9/15 = 3/5.',
      },
      {
        id: 'l4c1-b2',
        type: 'multiple-choice',
        question: 'Welke is groter: 5/6 of 7/9?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '5/6' },
          { id: 'b', label: '7/9' },
          { id: 'c', label: 'Even groot' },
        ],
        hint1: 'Noemer 18: 15/18 vs 14/18.',
        hint2: '5/6 is groter.',
        explanation: '5/6 = 15/18 > 14/18 = 7/9.',
      },
    ],
  },

  'l4-c2': {
    owlHelp: {
      intro: 'Geen stress. Optellen van breuken: eerst gelijke noemers.',
      steps: [
        {
          explanation: '1/2 + 1/3.\nNoemers 2 en 3. Kleinste gemeenschappelijke: 6.',
          question: 'Wat is 1/2 als zesde?',
          options: [
            { id: '36', label: '3/6' },
            { id: '26', label: '2/6' },
            { id: '16', label: '1/6' },
          ],
          correctAnswer: '36',
          successFeedback: 'Juist. En 1/3 = 2/6.',
          retryFeedback: 'Teller en noemer ×3.',
        },
        {
          explanation: '3/6 + 2/6 = ?',
          question: 'Wat is de som?',
          options: [
            { id: '56', label: '5/6' },
            { id: '16', label: '1/6' },
            { id: '12', label: '1/2' },
          ],
          correctAnswer: '56',
          successFeedback: 'Precies: 5/6.',
          retryFeedback: 'Telliers optellen, noemer blijft 6.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 5/6',
    },
    bonusVariants: [
      {
        id: 'l4c2-b1',
        type: 'text-input',
        question: 'Bereken 1/4 + 1/2. Geef als breuk.',
        answer: '3/4',
        acceptedAnswers: ['3/4', '6/8'],
        hint1: '1/2 = 2/4.',
        hint2: '1/4 + 2/4 = 3/4.',
        explanation: '1/4 + 1/2 = 3/4.',
      },
      {
        id: 'l4c2-b2',
        type: 'text-input',
        question: 'Bereken 2/5 + 1/10. Geef als breuk.',
        answer: '1/2',
        acceptedAnswers: ['1/2', '5/10'],
        hint1: '2/5 = 4/10.',
        hint2: '4/10 + 1/10 = 5/10 = 1/2.',
        explanation: '2/5 + 1/10 = 1/2.',
      },
    ],
  },

  'l4-c3': {
    owlHelp: {
      intro: 'Geen stress. Reken beide machten gewoon uit.',
      steps: [
        {
          explanation: '2⁵ = 2×2×2×2×2.',
          question: 'Wat is 2⁵?',
          options: [
            { id: '10', label: '10' },
            { id: '32', label: '32' },
            { id: '25', label: '25' },
          ],
          correctAnswer: '32',
          successFeedback: 'Juist: 32.',
          retryFeedback: 'Blijf verdubbelen: 2,4,8,16,32.',
        },
        {
          explanation: '5² = 5×5 = 25.\nVergelijk 32 en 25.',
          question: 'Wat is groter?',
          options: [
            { id: 'a', label: '2⁵' },
            { id: 'b', label: '5²' },
            { id: 'eq', label: 'Even groot' },
          ],
          correctAnswer: 'a',
          successFeedback: 'Precies. 32 > 25.',
          retryFeedback: '32 versus 25.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 2⁵ is groter.',
    },
    bonusVariants: [
      {
        id: 'l4c3-b1',
        type: 'multiple-choice',
        question: 'Wat is groter: 3⁴ of 4³?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '3⁴' },
          { id: 'b', label: '4³' },
          { id: 'c', label: 'Even groot' },
        ],
        hint1: '3⁴ = 81, 4³ = 64.',
        hint2: '3⁴ is groter.',
        explanation: '81 > 64.',
      },
      {
        id: 'l4c3-b2',
        type: 'multiple-choice',
        question: 'Wat is groter: 2⁶ of 6²?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '2⁶' },
          { id: 'b', label: '6²' },
          { id: 'c', label: 'Even groot' },
        ],
        hint1: '2⁶ = 64, 6² = 36.',
        hint2: '2⁶ is groter.',
        explanation: '64 > 36.',
      },
    ],
  },

  'l4-c4': {
    owlHelp: {
      intro: 'Geen stress. Wortel = “welk getal × zichzelf?”',
      steps: [
        {
          explanation: '√49 zoekt een getal dat met zichzelf 49 geeft.',
          question: 'Welk positief getal × zichzelf is 49?',
          options: [
            { id: '6', label: '6' },
            { id: '7', label: '7' },
            { id: '8', label: '8' },
          ],
          correctAnswer: '7',
          successFeedback: 'Juist: 7 × 7 = 49.',
          retryFeedback: 'Probeer 7.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 √49 = 7',
    },
    bonusVariants: [
      {
        id: 'l4c4-b1',
        type: 'number-input',
        question: '√81 = ?',
        answer: 9,
        hint1: '9 × 9 = 81.',
        hint2: '√81 = 9.',
        explanation: '√81 = 9.',
      },
      {
        id: 'l4c4-b2',
        type: 'number-input',
        question: '√36 = ?',
        answer: 6,
        hint1: '6 × 6 = 36.',
        hint2: '√36 = 6.',
        explanation: '√36 = 6.',
      },
    ],
  },

  'l4-c5': {
    owlHelp: {
      intro: 'Geen stress. Boss battle: drie korte stappen.',
      steps: [
        {
          explanation: 'Eerst: 2/5 × 1/2.\nTellers × tellers, noemers × noemers.',
          question: 'Wat is 2/5 × 1/2 vereenvoudigd?',
          options: [
            { id: 'a', label: '1/5' },
            { id: 'b', label: '3/7' },
            { id: 'c', label: '2/7' },
          ],
          correctAnswer: 'a',
          successFeedback: 'Juist: 2/10 = 1/5.',
          retryFeedback: '2×1 / 5×2 = 2/10 = 1/5.',
        },
        {
          explanation: '√64: welk getal × zichzelf is 64?',
          question: '√64 = ?',
          options: [
            { id: '6', label: '6' },
            { id: '8', label: '8' },
            { id: '16', label: '16' },
          ],
          correctAnswer: '8',
          successFeedback: 'Goed. En 3/7 ≈ 0,43 > 0,40 = 2/5.',
          retryFeedback: '8 × 8 = 64.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Boss verslagen.',
    },
    bonusVariants: [
      {
        id: 'l4c5-b1',
        type: 'multiple-choice',
        question: '3/4 × 2/3 = ?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '1/2' },
          { id: 'b', label: '5/7' },
          { id: 'c', label: '6/12' },
        ],
        hint1: '3×2 / 4×3 = 6/12 = 1/2.',
        hint2: 'Antwoord 1/2.',
        explanation: '3/4 × 2/3 = 1/2.',
      },
      {
        id: 'l4c5-b2',
        type: 'number-input',
        question: '√100 = ?',
        answer: 10,
        hint1: '10 × 10 = 100.',
        hint2: '√100 = 10.',
        explanation: '√100 = 10.',
      },
    ],
  },
};
