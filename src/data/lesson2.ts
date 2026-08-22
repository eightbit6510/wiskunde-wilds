import type { Lesson } from '../types';

/** @deprecated Content gemigreerd naar src/content/ — zie docs/FASE-1.md */
export const lesson2: Lesson = {
  id: 'wolvenkluis',
  order: 2,
  areaName: 'De Wolvenkluis',
  title: 'De Formulekraker',
  emoji: '🐺',
  color: '#5B6B7A',
  intro:
    'Een oude kluis wordt beschermd door formules. Elke juiste bewerking opent één slot.',
  challenges: [
    {
      id: 'l2-c1',
      type: 'number-input',
      topic: 'formules',
      difficulty: 1,
      starsAvailable: 3,
      question: 'A = ℓ × b. Als A = 42 en ℓ = 7, wat is b?',
      optionalStory: 'Eerste slot: oppervlakte van een wolventerritorium-kaart.',
      answer: 6,
      hint1: 'Deel beide kanten door ℓ: b = A ÷ ℓ.',
      hint2: 'b = 42 ÷ 7.',
      optionalWorkedFirstStep: 'b = A / ℓ = 42 / 7.',
      explanation: 'b = A ÷ ℓ = 42 ÷ 7 = 6.\n\nControle: 7 × 6 = 42 ✓',
    },
    {
      id: 'l2-c2',
      type: 'multiple-choice',
      topic: 'formules',
      difficulty: 2,
      starsAvailable: 3,
      question: 'v = s / t. Welke formule geeft s?',
      optionalStory: 'Tweede slot: snelheid van een wolf over s meters in t seconden.',
      answerOptions: [
        { id: 'a', label: 's = v / t' },
        { id: 'b', label: 's = v × t' },
        { id: 'c', label: 's = t / v' },
        { id: 'd', label: 's = v + t' },
      ],
      answer: 'b',
      hint1: 'Vermenigvuldig beide kanten van v = s/t met t.',
      hint2: 'v · t = s.',
      optionalWorkedFirstStep: 'v = s/t → v · t = s.',
      explanation:
        's = v × t.\n\nVan v = s/t vermenigvuldig je beide kanten met t:\nv · t = s.',
    },
    {
      id: 'l2-c3',
      type: 'multiple-choice',
      topic: 'formules',
      difficulty: 2,
      starsAvailable: 3,
      question: 'Welke formule past bij de totale kosten K bij z zakken voer?',
      optionalStory:
        'Een dierenopvang betaalt €12 vaste kosten plus €4 per zak voer.',
      answerOptions: [
        { id: 'a', label: 'K = 12z + 4' },
        { id: 'b', label: 'K = 4z + 12' },
        { id: 'c', label: 'K = 12 × 4 × z' },
        { id: 'd', label: 'K = 4 + 12 + z' },
      ],
      answer: 'b',
      hint1: 'Vaste kosten blijven gelijk. Per zak komt er €4 bij.',
      hint2: 'Startbedrag 12, daarna +4 voor elke zak → K = 4z + 12.',
      optionalWorkedFirstStep: 'Bij z = 0 is K = 12. Bij z = 1 is K = 16.',
      explanation:
        'K = 4z + 12.\n\nVaste kosten: 12\nVariabele kosten: 4 per zak\nDus: K = 4 · z + 12',
    },
    {
      id: 'l2-c4',
      type: 'text-input',
      topic: 'formules',
      difficulty: 2,
      starsAvailable: 3,
      question: 'Schrijf de formule om: T = 5n + 20. Geef n in termen van T. (bijv. n = ...)',
      optionalStory: 'Derde slot: hoeveel nesten n bij temperatuur T?',
      answer: 'n=(T-20)/5',
      acceptedAnswers: ['n=(T-20)/5', 'n=(t-20)/5', 'n=T/5-4', 'n=(T-20)/5'],
      hint1: 'Eerst 20 aftrekken van beide kanten, daarna delen door 5.',
      hint2: 'T − 20 = 5n → n = (T − 20) / 5',
      optionalWorkedFirstStep: 'T − 20 = 5n',
      explanation:
        'n = (T − 20) / 5\n\nT = 5n + 20\nT − 20 = 5n\nn = (T − 20) / 5',
    },
  ],
};
