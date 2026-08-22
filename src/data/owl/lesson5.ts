import type { OwlPack } from './types';

export const lesson5Owl: Record<string, OwlPack> = {
  'l5-c1': {
    owlHelp: {
      intro: 'Geen stress. Tabel → start + helling → formule.',
      steps: [
        {
          explanation: 'week 0 → gewicht 4. Dat is je start.',
          question: 'Wat is het startgewicht?',
          options: [
            { id: '0', label: '0' },
            { id: '4', label: '4' },
            { id: '6', label: '6' },
          ],
          correctAnswer: '4',
          successFeedback: 'Juist: start = 4.',
          retryFeedback: 'Kijk bij week 0.',
        },
        {
          explanation: 'Elke week +2 (4→6→8→10).',
          question: 'Welke formule?',
          options: [
            { id: 'a', label: 'g = 2w + 4' },
            { id: 'b', label: 'g = 4w + 2' },
            { id: 'c', label: 'g = w + 4' },
          ],
          correctAnswer: 'a',
          successFeedback: 'Precies: g = 2w + 4.',
          retryFeedback: 'Helling 2, start 4.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 g = 2w + 4',
    },
    bonusVariants: [
      {
        id: 'l5c1-b1',
        type: 'multiple-choice',
        question: 'Tabel week 0,1,2,3 en lengte 5,8,11,14. Welke formule?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'L = 3w + 5' },
          { id: 'b', label: 'L = 5w + 3' },
          { id: 'c', label: 'L = w + 5' },
        ],
        hint1: 'Start 5, stappen +3.',
        hint2: 'L = 3w + 5.',
        explanation: 'L = 3w + 5.',
      },
      {
        id: 'l5c1-b2',
        type: 'multiple-choice',
        question: 'Tabel x:0,1,2 y:2,5,8. Welke formule?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'y = 2x + 1' },
          { id: 'b', label: 'y = 3x + 2' },
          { id: 'c', label: 'y = x + 2' },
        ],
        hint1: 'Start 2, stappen +3.',
        hint2: 'y = 3x + 2.',
        explanation: 'y = 3x + 2.',
      },
    ],
  },

  'l5-c2': {
    owlHelp: {
      intro: 'Geen stress. Lineair = gelijke stappen.',
      steps: [
        {
          explanation: 'hoogte: 1, 2, 4, 8.\nBereken de verschillen.',
          question: 'Zijn de stappen even groot?',
          options: [
            { id: 'ja', label: 'Ja, steeds +1' },
            { id: 'nee', label: 'Nee, ze verdubbelen' },
          ],
          correctAnswer: 'nee',
          successFeedback: 'Precies. +1, +2, +4 — niet lineair.',
          retryFeedback: 'Vergelijk 2−1, 4−2, 8−4.',
        },
        {
          explanation: 'Bij lineair zou elke stap hetzelfde zijn.',
          question: 'Is dit verband lineair?',
          options: [
            { id: 'true', label: 'Ja' },
            { id: 'false', label: 'Nee' },
          ],
          correctAnswer: 'false',
          successFeedback: 'Juist: niet lineair.',
          retryFeedback: 'Ongelijke stappen → niet lineair.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Niet lineair.',
    },
    bonusVariants: [
      {
        id: 'l5c2-b1',
        type: 'multiple-choice',
        question: 'Is dit lineair? y: 3, 5, 7, 9',
        answer: 'ja',
        answerOptions: [
          { id: 'ja', label: 'Ja' },
          { id: 'nee', label: 'Nee' },
        ],
        hint1: 'Stappen: +2, +2, +2.',
        hint2: 'Ja, lineair.',
        explanation: 'Gelijke stappen → lineair.',
      },
      {
        id: 'l5c2-b2',
        type: 'multiple-choice',
        question: 'Is dit lineair? y: 2, 4, 8, 16',
        answer: 'nee',
        answerOptions: [
          { id: 'ja', label: 'Ja' },
          { id: 'nee', label: 'Nee' },
        ],
        hint1: 'De waarden verdubbelen.',
        hint2: 'Niet lineair.',
        explanation: 'Verdubbelen ≠ gelijke stappen.',
      },
    ],
  },

  'l5-c3': {
    owlHelp: {
      intro: 'Geen stress. Minteken = afname.',
      steps: [
        {
          explanation: 'y = −2x + 10.\nBij x = 0 is y = 10.',
          question: 'Wat gebeurt er als x groter wordt?',
          options: [
            { id: 'up', label: 'y wordt groter' },
            { id: 'down', label: 'y wordt kleiner' },
            { id: 'same', label: 'y blijft 10' },
          ],
          correctAnswer: 'down',
          successFeedback: 'Juist. Helling −2 → dalend.',
          retryFeedback: 'Het minteken bij 2x betekent: y daalt.',
        },
        {
          explanation: 'Start 10, elke stap −2 → voedsel dat opraakt.',
          question: 'Welke situatie past?',
          options: [
            { id: 'a', label: 'Start 10, eet 2 per uur' },
            { id: 'b', label: 'Start 10, vindt 2 per uur' },
            { id: 'c', label: 'Altijd 10' },
          ],
          correctAnswer: 'a',
          successFeedback: 'Precies: opeten = dalend.',
          retryFeedback: 'Dalend = er gaat iets vanaf.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Start 10, −2 per stap.',
    },
    bonusVariants: [
      {
        id: 'l5c3-b1',
        type: 'multiple-choice',
        question: 'Welke situatie past bij y = −3x + 12?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'Start 12, −3 per stap' },
          { id: 'b', label: 'Start 12, +3 per stap' },
          { id: 'c', label: 'Start 3, −12 per stap' },
        ],
        hint1: 'Bij x=0 is y=12. Helling −3.',
        hint2: 'Start 12, −3 per stap.',
        explanation: 'y = −3x + 12 → start 12, dalend met 3.',
      },
      {
        id: 'l5c3-b2',
        type: 'multiple-choice',
        question: 'Welke formule past bij “start 20, −4 per uur”?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'y = 4x + 20' },
          { id: 'b', label: 'y = −4x + 20' },
          { id: 'c', label: 'y = 20x − 4' },
        ],
        hint1: 'Dalend → minteken.',
        hint2: 'y = −4x + 20.',
        explanation: 'y = −4x + 20.',
      },
    ],
  },

  'l5-c4': {
    owlHelp: {
      intro: 'Geen stress. Sorteer op hellingsgetal.',
      steps: [
        {
          explanation: 'Hellingsgetallen: −3, −1, 0,5, 2.',
          question: 'Welk hellingsgetal is het kleinst (meest dalend)?',
          options: [
            { id: 'm3', label: '−3' },
            { id: 'm1', label: '−1' },
            { id: '2', label: '2' },
          ],
          correctAnswer: 'm3',
          successFeedback: 'Juist. −3 is sterkst dalend.',
          retryFeedback: 'Op een getallenlijn ligt −3 links van −1.',
        },
        {
          explanation: 'Volgorde van klein naar groot hellingsgetal.',
          question: 'Wat komt als laatste (sterkst stijgend)?',
          options: [
            { id: 'half', label: 'y = 0,5x' },
            { id: 'two', label: 'y = 2x − 1' },
            { id: 'min1', label: 'y = −x + 4' },
          ],
          correctAnswer: 'two',
          successFeedback: 'Precies: helling 2 is het grootst.',
          retryFeedback: 'Grootste hellingsgetal = sterkst stijgend.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 −3 → −1 → 0,5 → 2',
    },
    bonusVariants: [
      {
        id: 'l5c4-b1',
        type: 'multiple-choice',
        question: 'Welke is sterkst dalend?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'y = −5x + 1' },
          { id: 'b', label: 'y = −x + 9' },
          { id: 'c', label: 'y = 2x' },
        ],
        hint1: 'Kijk naar het hellingsgetal.',
        hint2: '−5 is het kleinst.',
        explanation: '−5 is sterkst dalend.',
      },
      {
        id: 'l5c4-b2',
        type: 'multiple-choice',
        question: 'Welke is sterkst stijgend?',
        answer: 'c',
        answerOptions: [
          { id: 'a', label: 'y = 0,2x' },
          { id: 'b', label: 'y = x − 3' },
          { id: 'c', label: 'y = 4x + 1' },
        ],
        hint1: 'Grootste hellingsgetal.',
        hint2: '4 is het grootst.',
        explanation: 'y = 4x + 1.',
      },
    ],
  },
};
