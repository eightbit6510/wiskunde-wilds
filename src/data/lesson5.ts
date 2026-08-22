import type { Lesson } from '../types';

export const lesson5: Lesson = {
  id: 'uilenlab',
  order: 5,
  areaName: 'Het Uilenlab',
  title: 'Het Verbandenlab',
  emoji: '🦉',
  color: '#7A6B8A',
  intro: 'Patronen, tabellen en formules onder maanlicht. Niet alles is lineair…',
  challenges: [
    {
      id: 'l5-c1',
      type: 'multiple-choice',
      topic: 'verbanden',
      difficulty: 1,
      starsAvailable: 3,
      question: 'Een dier groeit volgens onderstaande tabel. Welke formule beschrijft dit?',
      tableData: {
        headers: ['week', 'gewicht'],
        rows: [
          [0, 4],
          [1, 6],
          [2, 8],
          [3, 10],
        ],
      },
      answerOptions: [
        { id: 'a', label: 'g = 2w + 4' },
        { id: 'b', label: 'g = 4w + 2' },
        { id: 'c', label: 'g = w + 4' },
        { id: 'd', label: 'g = 2w' },
      ],
      answer: 'a',
      hint1: 'Startgewicht bij week 0? Toename per week?',
      hint2: 'Start = 4, per week +2 → g = 2w + 4.',
      optionalWorkedFirstStep: 'Bij w=0 is g=4. Hellingsgetal = 2.',
      explanation: 'g = 2w + 4.\n\nStart 4, elke week +2. Controle week 3: 2·3+4=10 ✓',
    },
    {
      id: 'l5-c2',
      type: 'true-false',
      topic: 'verbanden',
      difficulty: 2,
      starsAvailable: 3,
      sneakyNote: 'Deze is een beetje gemeen… 👀',
      question: 'Is dit een lineair verband? week: 0,1,2,3 — hoogte: 1,2,4,8',
      answer: false,
      hint1: 'Bij een lineair verband is de toename steeds even groot.',
      hint2: 'Verschillen: +1, +2, +4 — dat verdubbelt, dus niet lineair.',
      optionalWorkedFirstStep: 'Bereken de verschillen tussen opeenvolgende hoogtes.',
      explanation:
        'Nee, niet lineair.\n\nDe waarden verdubbelen (1,2,4,8). Bij lineair zou de stap steeds gelijk zijn.',
    },
    {
      id: 'l5-c3',
      type: 'multiple-choice',
      topic: 'verbanden',
      difficulty: 2,
      starsAvailable: 3,
      question: 'Welke situatie past bij y = −2x + 10?',
      answerOptions: [
        {
          id: 'a',
          label: 'Een vos start met 10 stukken voedsel en eet er 2 per uur',
        },
        {
          id: 'b',
          label: 'Een vos vindt elk uur 2 stukken voedsel, start bij 10',
        },
        {
          id: 'c',
          label: 'Een vos heeft altijd 10 stukken voedsel',
        },
        {
          id: 'd',
          label: 'Een vos verdubbelt zijn voedsel elke 2 uur',
        },
      ],
      answer: 'a',
      hint1: 'Het minteken betekent: y neemt af als x toeneemt.',
      hint2: 'Start (x=0) is 10, daarna −2 per stap.',
      optionalWorkedFirstStep: 'Bij x=0: y=10. Bij x=1: y=8.',
      explanation:
        'A past.\n\ny = −2x + 10: start 10, elke stap −2 → voedsel dat opraakt.',
    },
    {
      id: 'l5-c4',
      type: 'sorting',
      topic: 'redeneren',
      difficulty: 2,
      starsAvailable: 3,
      question: 'Sorteer van “sterkst dalend” naar “sterkst stijgend”.',
      sortItems: ['y = −3x + 1', 'y = −x + 4', 'y = 0,5x', 'y = 2x − 1'],
      correctOrder: ['y = −3x + 1', 'y = −x + 4', 'y = 0,5x', 'y = 2x − 1'],
      hint1: 'Kijk naar het hellingsgetal (het getal bij x).',
      hint2: 'Hellingsgetallen: −3, −1, 0,5, 2.',
      optionalWorkedFirstStep: 'Meest negatieve helling eerst: −3.',
      explanation:
        'Volgorde op hellingsgetal: −3 → −1 → 0,5 → 2.\n\nLager hellingsgetal = sterker dalend (of minder stijgend).',
    },
  ],
};
