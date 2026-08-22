import type { OwlPack } from './types';

export const lesson7Owl: Record<string, OwlPack> = {
  'l7-c1': {
    owlHelp: {
      intro: 'Geen stress. We ontdekken wat x² doet.',
      steps: [
        {
          explanation: 'Bereken (−2)² en 2².',
          question: 'Wat is (−2)²?',
          options: [
            { id: 'm4', label: '−4' },
            { id: '4', label: '4' },
            { id: '2', label: '2' },
          ],
          correctAnswer: '4',
          successFeedback: 'Juist: (−2)×(−2)=4. En 2² is ook 4.',
          retryFeedback: 'Min × min = plus.',
        },
        {
          explanation: 'Positieve en negatieve x kunnen dezelfde y geven.',
          question: 'Wat valt je op bij y = x²?',
          options: [
            { id: 'a', label: 'Positieve en negatieve x kunnen dezelfde y geven' },
            { id: 'b', label: 'De grafiek is een rechte lijn' },
            { id: 'c', label: 'Alle uitkomsten zijn negatief' },
          ],
          correctAnswer: 'a',
          successFeedback: 'Precies. Dat hoort bij een parabool.',
          retryFeedback: 'Vergelijk links en rechts van de y-as.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Spiegelbeeld links/rechts.',
    },
    bonusVariants: [
      {
        id: 'l7c1-b1',
        type: 'multiple-choice',
        question: 'Wat is (−5)²?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '25' },
          { id: 'b', label: '−25' },
          { id: 'c', label: '10' },
        ],
        hint1: 'Min × min = plus.',
        hint2: '25.',
        explanation: '(−5)² = 25.',
      },
      {
        id: 'l7c1-b2',
        type: 'multiple-choice',
        question: 'Welke twee x-waarden geven dezelfde y bij y = x²?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: '1 en 2' },
          { id: 'b', label: '−3 en 3' },
          { id: 'c', label: '0 en 1' },
        ],
        hint1: 'Spiegelbeelden.',
        hint2: '(−3)² = 3².',
        explanation: '−3 en 3 geven beide 9.',
      },
    ],
  },

  'l7-c2': {
    owlHelp: {
      intro: 'Geen stress. +2 verschuift de hele grafiek.',
      steps: [
        {
          explanation: 'Bij x = 0: x² = 0, maar x² + 2 = 2.',
          question: 'Wat gebeurt er met het laagste punt?',
          options: [
            { id: 'up', label: 'Het schuift 2 omhoog' },
            { id: 'right', label: 'Het schuift 2 naar rechts' },
            { id: 'down', label: 'Het schuift 2 omlaag' },
          ],
          correctAnswer: 'up',
          successFeedback: 'Juist. Elke y krijgt +2.',
          retryFeedback: 'Vergelijk y(0) voor beide formules.',
        },
        {
          explanation: 'De vorm blijft een U, alleen hoger.',
          question: 'Wat gebeurt er bij y = x² + 2 t.o.v. y = x²?',
          options: [
            { id: 'a', label: 'De grafiek schuift 2 omhoog' },
            { id: 'b', label: 'De grafiek wordt een rechte lijn' },
            { id: 'c', label: 'Alle y-waarden worden kleiner' },
          ],
          correctAnswer: 'a',
          successFeedback: 'Precies: 2 omhoog.',
          retryFeedback: '+2 bij y = omhoog schuiven.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Schuif omhoog.',
    },
    bonusVariants: [
      {
        id: 'l7c2-b1',
        type: 'multiple-choice',
        question: 'Wat doet y = x² − 3 t.o.v. y = x²?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: '3 omhoog' },
          { id: 'b', label: '3 omlaag' },
          { id: 'c', label: '3 naar links' },
        ],
        hint1: 'Min 3 bij y.',
        hint2: 'Omlaag.',
        explanation: 'De grafiek schuift 3 omlaag.',
      },
      {
        id: 'l7c2-b2',
        type: 'multiple-choice',
        question: 'Bij y = x² + 5, wat is y als x = 0?',
        answer: 'c',
        answerOptions: [
          { id: 'a', label: '0' },
          { id: 'b', label: '1' },
          { id: 'c', label: '5' },
        ],
        hint1: '0² + 5.',
        hint2: '5.',
        explanation: 'y = 5.',
      },
    ],
  },

  'l7-c3': {
    owlHelp: {
      intro: 'Geen stress. Let op de haakjes bij kwadraten.',
      steps: [
        {
          explanation: '(−4)² betekent (−4)×(−4).',
          question: 'Wat is (−4)×(−4)?',
          options: [
            { id: '16', label: '16' },
            { id: 'm16', label: '−16' },
            { id: '8', label: '8' },
          ],
          correctAnswer: '16',
          successFeedback: 'Juist: 16. (Zonder haakjes zou −4² = −16 zijn!)',
          retryFeedback: 'Min × min = plus.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 (−4)² = 16',
    },
    bonusVariants: [
      {
        id: 'l7c3-b1',
        type: 'number-input',
        question: 'Wat is (−6)²?',
        answer: 36,
        hint1: '(−6)×(−6).',
        hint2: '36.',
        explanation: '(−6)² = 36.',
      },
      {
        id: 'l7c3-b2',
        type: 'number-input',
        question: 'Wat is (−3)²?',
        answer: 9,
        hint1: '(−3)×(−3).',
        hint2: '9.',
        explanation: '(−3)² = 9.',
      },
    ],
  },

  'l7-c4': {
    owlHelp: {
      intro: 'Geen stress. Symmetrie = spiegelbeeld.',
      steps: [
        {
          explanation: 'Omdat (−x)² = x², is links het spiegelbeeld van rechts.',
          question: 'Is de grafiek van y = x² symmetrisch?',
          options: [
            { id: 'ja', label: 'Ja' },
            { id: 'nee', label: 'Nee' },
          ],
          correctAnswer: 'ja',
          successFeedback: 'Juist. Spiegel in de y-as.',
          retryFeedback: 'Vergelijk x=2 en x=−2.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 Ja, symmetrisch.',
    },
    bonusVariants: [
      {
        id: 'l7c4-b1',
        type: 'multiple-choice',
        question: 'Klopt dit? “y = x² + 1 is ook spiegelsymmetrisch.”',
        answer: 'ja',
        answerOptions: [
          { id: 'ja', label: 'Ja' },
          { id: 'nee', label: 'Nee' },
        ],
        hint1: 'De +1 verschuift alleen omhoog.',
        hint2: 'Ja, nog steeds symmetrisch.',
        explanation: 'Ja, de vorm blijft symmetrisch.',
      },
      {
        id: 'l7c4-b2',
        type: 'multiple-choice',
        question: 'Klopt dit? “y = 2x is een parabool.”',
        answer: 'nee',
        answerOptions: [
          { id: 'ja', label: 'Ja' },
          { id: 'nee', label: 'Nee' },
        ],
        hint1: '2x is een rechte lijn.',
        hint2: 'Niet waar.',
        explanation: 'y = 2x is lineair, geen parabool.',
      },
    ],
  },
};
