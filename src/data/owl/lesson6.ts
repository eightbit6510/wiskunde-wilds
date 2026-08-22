import type { OwlPack } from './types';

export const lesson6Owl: Record<string, OwlPack> = {
  'l6-c1': {
    owlHelp: {
      intro: 'Geen stress. Eerst de haakjes of eerst delen — beide kan.',
      steps: [
        {
          explanation: '3(x − 2) = 15.\nDeel beide kanten door 3.',
          question: 'Wat blijft er over?',
          options: [
            { id: 'a', label: 'x − 2 = 5' },
            { id: 'b', label: 'x − 2 = 15' },
            { id: 'c', label: 'x − 2 = 45' },
          ],
          correctAnswer: 'a',
          successFeedback: 'Juist: x − 2 = 5.',
          retryFeedback: '15 ÷ 3 = 5.',
        },
        {
          explanation: 'x − 2 = 5. Tel 2 bij beide kanten op.',
          question: 'Wat is x?',
          options: [
            { id: '5', label: '5' },
            { id: '7', label: '7' },
            { id: '3', label: '3' },
          ],
          correctAnswer: '7',
          successFeedback: 'Precies: x = 7.',
          retryFeedback: '5 + 2 = 7.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 x = 7',
    },
    bonusVariants: [
      {
        id: 'l6c1-b1',
        type: 'number-input',
        question: 'Los op: 4(x − 1) = 20. Wat is x?',
        answer: 6,
        hint1: 'Deel door 4: x − 1 = 5.',
        hint2: 'x = 6.',
        explanation: 'x = 6.',
      },
      {
        id: 'l6c1-b2',
        type: 'number-input',
        question: 'Los op: 2(x + 3) = 14. Wat is x?',
        answer: 4,
        hint1: 'Deel door 2: x + 3 = 7.',
        hint2: 'x = 4.',
        explanation: 'x = 4.',
      },
    ],
  },

  'l6-c2': {
    owlHelp: {
      intro: 'Geen stress. Helling en snijpunt lezen.',
      steps: [
        {
          explanation: 'y = −x + 4.\nHet getal bij x is −1.',
          question: 'Is de grafiek stijgend of dalend?',
          options: [
            { id: 'up', label: 'Stijgend' },
            { id: 'down', label: 'Dalend' },
            { id: 'flat', label: 'Horizontaal' },
          ],
          correctAnswer: 'down',
          successFeedback: 'Juist: negatieve helling → dalend.',
          retryFeedback: 'Minteken bij x = dalend.',
        },
        {
          explanation: 'Bij x = 0: y = 4.',
          question: 'Waar snijdt de grafiek de y-as?',
          options: [
            { id: '0', label: 'y = 0' },
            { id: '4', label: 'y = 4' },
            { id: 'm1', label: 'y = −1' },
          ],
          correctAnswer: '4',
          successFeedback: 'Precies: dalend, snijdt y-as bij 4.',
          retryFeedback: 'Het +4 is het snijpunt.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Dalend, y-as bij 4.',
    },
    bonusVariants: [
      {
        id: 'l6c2-b1',
        type: 'multiple-choice',
        question: 'Welke grafiek hoort bij y = −2x + 5?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'Stijgend, snijdt y-as bij 5' },
          { id: 'b', label: 'Dalend, snijdt y-as bij 5' },
          { id: 'c', label: 'Horizontaal op y = 5' },
        ],
        hint1: 'Helling −2, start 5.',
        hint2: 'Dalend, y-as bij 5.',
        explanation: 'Dalend, snijdt y-as bij 5.',
      },
      {
        id: 'l6c2-b2',
        type: 'multiple-choice',
        question: 'Welke grafiek hoort bij y = x − 3?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'Stijgend, snijdt y-as bij −3' },
          { id: 'b', label: 'Dalend, snijdt y-as bij −3' },
          { id: 'c', label: 'Door de oorsprong' },
        ],
        hint1: 'Helling +1, start −3.',
        hint2: 'Stijgend, y-as bij −3.',
        explanation: 'Stijgend, snijdt y-as bij −3.',
      },
    ],
  },

  'l6-c3': {
    owlHelp: {
      intro: 'Geen stress. Vereenvoudigen = delen door de grootste gemene deler.',
      steps: [
        {
          explanation: '8/12. Welke getallen delen zowel 8 als 12?',
          question: 'Wat is de grootste gemene deler van 8 en 12?',
          options: [
            { id: '2', label: '2' },
            { id: '4', label: '4' },
            { id: '8', label: '8' },
          ],
          correctAnswer: '4',
          successFeedback: 'Juist: 4.',
          retryFeedback: '4 deelt 8 én 12.',
        },
        {
          explanation: '8÷4 = 2 en 12÷4 = 3.',
          question: 'Wat is de vereenvoudigde breuk?',
          options: [
            { id: '23', label: '2/3' },
            { id: '46', label: '4/6' },
            { id: '14', label: '1/4' },
          ],
          correctAnswer: '23',
          successFeedback: 'Precies: 2/3.',
          retryFeedback: 'Teller 2, noemer 3.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 2/3',
    },
    bonusVariants: [
      {
        id: 'l6c3-b1',
        type: 'text-input',
        question: 'Vereenvoudig 9/12.',
        answer: '3/4',
        acceptedAnswers: ['3/4'],
        hint1: 'Deel door 3.',
        hint2: '9÷3 / 12÷3 = 3/4.',
        explanation: '9/12 = 3/4.',
      },
      {
        id: 'l6c3-b2',
        type: 'text-input',
        question: 'Vereenvoudig 10/15.',
        answer: '2/3',
        acceptedAnswers: ['2/3'],
        hint1: 'Deel door 5.',
        hint2: '10÷5 / 15÷5 = 2/3.',
        explanation: '10/15 = 2/3.',
      },
    ],
  },

  'l6-c4': {
    owlHelp: {
      intro: 'Geen stress. Zoek helling, daarna de constante.',
      steps: [
        {
          explanation: 'y: 5, 8, 11, 14. Verschillen?',
          question: 'Hoeveel komt y erbij per stap?',
          options: [
            { id: '2', label: '+2' },
            { id: '3', label: '+3' },
            { id: '4', label: '+4' },
          ],
          correctAnswer: '3',
          successFeedback: 'Juist. Helling = 3.',
          retryFeedback: '8−5 = 3.',
        },
        {
          explanation: 'y = 3x + b. Bij x = 1 is y = 5 → 3 + b = 5.',
          question: 'Welke formule?',
          options: [
            { id: 'a', label: 'y = 3x + 2' },
            { id: 'b', label: 'y = 3x + 1' },
            { id: 'c', label: 'y = 2x + 3' },
          ],
          correctAnswer: 'a',
          successFeedback: 'Precies: y = 3x + 2.',
          retryFeedback: 'b = 2.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 y = 3x + 2',
    },
    bonusVariants: [
      {
        id: 'l6c4-b1',
        type: 'multiple-choice',
        question: 'Tabel x:1,2,3 y:4,7,10. Welke formule?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'y = 3x + 1' },
          { id: 'b', label: 'y = 2x + 2' },
          { id: 'c', label: 'y = 4x' },
        ],
        hint1: 'Stappen +3. Bij x=1: 4 = 3+b.',
        hint2: 'y = 3x + 1.',
        explanation: 'y = 3x + 1.',
      },
      {
        id: 'l6c4-b2',
        type: 'multiple-choice',
        question: 'Tabel x:1,2,3 y:6,10,14. Welke formule?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'y = 4x' },
          { id: 'b', label: 'y = 4x + 2' },
          { id: 'c', label: 'y = 2x + 4' },
        ],
        hint1: 'Stappen +4. Bij x=1: 6 = 4+b.',
        hint2: 'y = 4x + 2.',
        explanation: 'y = 4x + 2.',
      },
    ],
  },
};
