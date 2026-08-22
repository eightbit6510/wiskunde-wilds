import type { OwlPack } from './types';

export const lesson3Owl: Record<string, OwlPack> = {
  'l3-c1': {
    owlHelp: {
      intro: 'Geen stress. We vertalen het verhaal naar de vorm van de grafiek.',
      steps: [
        {
          explanation:
            'Eerst stilstand.\nStilstand betekent: de afstand verandert niet.',
          question: 'Hoe ziet stilstand eruit in een grafiek?',
          options: [
            { id: 'horiz', label: 'Horizontaal stuk' },
            { id: 'steil', label: 'Steil omhoog' },
            { id: 'dalend', label: 'Dalend' },
          ],
          correctAnswer: 'horiz',
          successFeedback: 'Juist. Horizontaal = geen verandering.',
          retryFeedback: 'Geen beweging → y blijft gelijk → plat.',
        },
        {
          explanation:
            'Daarna steeds sneller → de helling wordt steiler.\nTot slot weer stoppen → weer horizontaal.',
          question: 'Welke grafiek past?',
          options: [
            { id: 'a', label: 'Constant stijgend (rechte lijn omhoog)' },
            { id: 'b', label: 'Plat, dan steiler, dan plat' },
            { id: 'c', label: 'Alleen dalend' },
          ],
          correctAnswer: 'b',
          successFeedback: 'Precies: plat → steiler → plat. Dat is grafiek B.',
          retryFeedback: 'Zoek begin én eind horizontaal, midden steiler.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Grafiek B.',
    },
    bonusVariants: [
      {
        id: 'l3c1-b1',
        type: 'multiple-choice',
        question:
          'Welke beschrijving past bij: eerst hard lopen, daarna langzaam, daarna stil?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'Steil, dan steiler, dan steilst' },
          { id: 'b', label: 'Steil, dan minder steil, dan horizontaal' },
          { id: 'c', label: 'Alleen horizontaal' },
        ],
        hint1: 'Stil = horizontaal. Sneller = steiler.',
        hint2: 'Eindigt horizontaal.',
        explanation: 'Steil → minder steil → horizontaal.',
      },
      {
        id: 'l3c1-b2',
        type: 'multiple-choice',
        question: 'Een vos rust 3 uur stil. Hoe ziet de grafiek van afstand-tijd eruit?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'Horizontale lijn' },
          { id: 'b', label: 'Steile stijgende lijn' },
          { id: 'c', label: 'Parabool' },
        ],
        hint1: 'Stil = geen verandering in afstand.',
        hint2: 'Horizontaal.',
        explanation: 'Horizontale lijn.',
      },
    ],
  },

  'l3-c2': {
    owlHelp: {
      intro: 'Geen stress. We zoeken het patroon in de tabel.',
      steps: [
        {
          explanation: 'Tabel: (0,3) (1,5) (2,7) (3,9).\nKijk hoeveel y stijgt per stap in x.',
          question: 'Hoeveel komt y erbij als x +1 gaat?',
          options: [
            { id: '1', label: '+1' },
            { id: '2', label: '+2' },
            { id: '3', label: '+3' },
          ],
          correctAnswer: '2',
          successFeedback: 'Juist. Hellingsgetal = 2.',
          retryFeedback: '5−3, 7−5, 9−7…',
        },
        {
          explanation: 'Bij x = 0 is y = 3. Dat is het startgetal.',
          question: 'Welke formule past?',
          options: [
            { id: 'a', label: 'y = x + 3' },
            { id: 'b', label: 'y = 2x + 3' },
            { id: 'c', label: 'y = 3x' },
          ],
          correctAnswer: 'b',
          successFeedback: 'Precies: y = 2x + 3.',
          retryFeedback: 'Start 3, helling 2 → 2x + 3.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 y = 2x + 3',
    },
    bonusVariants: [
      {
        id: 'l3c2-b1',
        type: 'multiple-choice',
        question: 'Tabel (0,1)(1,4)(2,7)(3,10). Welke formule?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'y = x + 1' },
          { id: 'b', label: 'y = 3x + 1' },
          { id: 'c', label: 'y = 4x' },
        ],
        hint1: 'Stappen van +3, start 1.',
        hint2: 'y = 3x + 1.',
        explanation: 'y = 3x + 1.',
      },
      {
        id: 'l3c2-b2',
        type: 'multiple-choice',
        question: 'Tabel (0,5)(1,7)(2,9). Welke formule?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'y = 2x + 5' },
          { id: 'b', label: 'y = 5x + 2' },
          { id: 'c', label: 'y = x + 5' },
        ],
        hint1: 'Stappen van +2, start 5.',
        hint2: 'y = 2x + 5.',
        explanation: 'y = 2x + 5.',
      },
    ],
  },

  'l3-c3': {
    owlHelp: {
      intro: 'Geen stress. De y-as is waar x = 0.',
      steps: [
        {
          explanation: 'y = 2x + 3.\nOp de y-as is x altijd 0.',
          question: 'Welke x vul je in voor het snijpunt met de y-as?',
          options: [
            { id: '0', label: 'x = 0' },
            { id: '1', label: 'x = 1' },
            { id: '3', label: 'x = 3' },
          ],
          correctAnswer: '0',
          successFeedback: 'Precies. x = 0.',
          retryFeedback: 'Y-as = verticale as = x is nul.',
        },
        {
          explanation: 'Vul in: y = 2·0 + 3.',
          question: 'Wat is y?',
          options: [
            { id: '0', label: '0' },
            { id: '2', label: '2' },
            { id: '3', label: '3' },
          ],
          correctAnswer: '3',
          successFeedback: 'Juist. Het snijpunt is y = 3.',
          retryFeedback: '2 keer 0 is 0, plus 3 is 3.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 y = 3',
    },
    bonusVariants: [
      {
        id: 'l3c3-b1',
        type: 'number-input',
        question: 'y = 4x − 1. Waar raakt de grafiek de y-as?',
        answer: -1,
        hint1: 'Vul x = 0 in.',
        hint2: 'y = −1.',
        explanation: 'Bij x = 0 is y = −1.',
      },
      {
        id: 'l3c3-b2',
        type: 'number-input',
        question: 'y = −3x + 8. Waar raakt de grafiek de y-as?',
        answer: 8,
        hint1: 'Vul x = 0 in.',
        hint2: 'y = 8.',
        explanation: 'Bij x = 0 is y = 8.',
      },
    ],
  },

  'l3-c4': {
    owlHelp: {
      intro: 'Geen stress. We matchen op betekenis, niet op raden.',
      steps: [
        {
          explanation: 'y = 3x gaat door (0,0) en stijgt steil.',
          question: 'Wat past bij y = 3x?',
          options: [
            { id: 'a', label: 'Door 0, steil omhoog' },
            { id: 'b', label: 'Constant verband' },
            { id: 'c', label: 'Horizontale grafiek' },
          ],
          correctAnswer: 'a',
          successFeedback: 'Juist.',
          retryFeedback: 'Geen +getal → door de oorsprong.',
        },
        {
          explanation: 'Een vos die stil rust → afstand verandert niet.',
          question: 'Welke grafiek past bij stil rusten?',
          options: [
            { id: 'h', label: 'Horizontale grafiek' },
            { id: 's', label: 'Steil omhoog' },
            { id: 'd', label: 'Dalend' },
          ],
          correctAnswer: 'h',
          successFeedback: 'Precies. En een tabel met steeds dezelfde y is constant.',
          retryFeedback: 'Stil = geen verandering = horizontaal.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Alles matcht.',
    },
    bonusVariants: [
      {
        id: 'l3c4-b1',
        type: 'multiple-choice',
        question: 'Wat past bij y = 5 (constant)?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'Steile stijgende lijn' },
          { id: 'b', label: 'Horizontale lijn' },
          { id: 'c', label: 'Parabool' },
        ],
        hint1: 'y verandert niet.',
        hint2: 'Horizontaal.',
        explanation: 'Constant → horizontale lijn.',
      },
      {
        id: 'l3c4-b2',
        type: 'multiple-choice',
        question: 'Wat past bij “start bij 4, helling 1”?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'y = x + 4' },
          { id: 'b', label: 'y = 4x' },
          { id: 'c', label: 'y = 4' },
        ],
        hint1: 'Start = snijpunt y-as.',
        hint2: 'y = x + 4.',
        explanation: 'y = x + 4.',
      },
    ],
  },
};
