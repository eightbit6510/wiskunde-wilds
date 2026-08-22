import type { OwlPack } from './types';

export const lesson2Owl: Record<string, OwlPack> = {
  'l2-c1': {
    owlHelp: {
      intro: 'Geen stress. We zoeken b in A = ℓ × b.',
      steps: [
        {
          explanation: 'A = ℓ × b.\nWe kennen A = 42 en ℓ = 7.\nWe willen b alleen.',
          question: 'Welke bewerking haalt ℓ weg?',
          options: [
            { id: 'div', label: 'Delen door ℓ' },
            { id: 'mul', label: 'Keer ℓ' },
            { id: 'add', label: 'Plus ℓ' },
          ],
          correctAnswer: 'div',
          successFeedback: 'Precies. b = A ÷ ℓ.',
          retryFeedback: 'Het tegenovergestelde van vermenigvuldigen is delen.',
        },
        {
          explanation: 'Dus b = 42 ÷ 7.',
          question: 'Wat is 42 ÷ 7?',
          options: [
            { id: '6', label: '6' },
            { id: '7', label: '7' },
            { id: '35', label: '35' },
          ],
          correctAnswer: '6',
          successFeedback: 'Juist. b = 6. Controle: 7 × 6 = 42.',
          retryFeedback: 'Hoeveel keer past 7 in 42?',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 b = 6',
    },
    bonusVariants: [
      {
        id: 'l2c1-b1',
        type: 'number-input',
        question: 'A = ℓ × b. Als A = 56 en ℓ = 8, wat is b?',
        answer: 7,
        hint1: 'b = A ÷ ℓ.',
        hint2: '56 ÷ 8 = 7.',
        explanation: 'b = 56 ÷ 8 = 7.',
      },
      {
        id: 'l2c1-b2',
        type: 'number-input',
        question: 'A = ℓ × b. Als A = 45 en ℓ = 9, wat is b?',
        answer: 5,
        hint1: 'b = 45 ÷ 9.',
        hint2: 'b = 5.',
        explanation: 'b = 5.',
      },
    ],
  },

  'l2-c2': {
    owlHelp: {
      intro: 'Geen stress. We schrijven v = s / t om naar s.',
      steps: [
        {
          explanation: 'v = s / t betekent: v is s gedeeld door t.',
          question: 'Wat doe je met beide kanten om s vrij te maken?',
          options: [
            { id: 'mulT', label: 'Beide kanten × t' },
            { id: 'divT', label: 'Beide kanten ÷ t' },
            { id: 'addT', label: 'Beide kanten + t' },
          ],
          correctAnswer: 'mulT',
          successFeedback: 'Juist. Dan: v × t = s.',
          retryFeedback: 'Haal de deling door t weg met vermenigvuldigen.',
        },
        {
          explanation: 'Dus s = v × t.',
          question: 'Welke formule geeft s?',
          options: [
            { id: 'a', label: 's = v / t' },
            { id: 'b', label: 's = v × t' },
            { id: 'c', label: 's = t / v' },
          ],
          correctAnswer: 'b',
          successFeedback: 'Precies: s = v × t.',
          retryFeedback: 's is snelheid × tijd.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 s = v × t',
    },
    bonusVariants: [
      {
        id: 'l2c2-b1',
        type: 'multiple-choice',
        question: 'a = F / m. Welke formule geeft F?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'F = a / m' },
          { id: 'b', label: 'F = a × m' },
          { id: 'c', label: 'F = m / a' },
        ],
        hint1: 'Vermenigvuldig beide kanten met m.',
        hint2: 'F = a × m.',
        explanation: 'F = a × m.',
      },
      {
        id: 'l2c2-b2',
        type: 'multiple-choice',
        question: 'd = W / F. Welke formule geeft W?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'W = d × F' },
          { id: 'b', label: 'W = d / F' },
          { id: 'c', label: 'W = F / d' },
        ],
        hint1: 'Vermenigvuldig beide kanten met F.',
        hint2: 'W = d × F.',
        explanation: 'W = d × F.',
      },
    ],
  },

  'l2-c3': {
    owlHelp: {
      intro: 'Geen stress. We maken een formule uit het verhaal.',
      steps: [
        {
          explanation:
            'Vaste kosten: €12 (altijd).\nPer zak: €4 erbij.',
          question: 'Welk deel verandert als z groter wordt?',
          options: [
            { id: 'vast', label: 'Alleen de 12' },
            { id: 'var', label: 'Het deel met z' },
            { id: 'niets', label: 'Niets' },
          ],
          correctAnswer: 'var',
          successFeedback: 'Juist. Per zak komt er 4 bij → 4z.',
          retryFeedback: 'Meer zakken = meer van die €4.',
        },
        {
          explanation: 'Totale kosten = variabel + vast.',
          question: 'Welke formule past?',
          options: [
            { id: 'a', label: 'K = 12z + 4' },
            { id: 'b', label: 'K = 4z + 12' },
            { id: 'c', label: 'K = 12 × 4 × z' },
          ],
          correctAnswer: 'b',
          successFeedback: 'Precies: K = 4z + 12.',
          retryFeedback: 'Start met 12, daarna +4 per zak.',
        },
      ],
      conclusion: 'Pootafdruk! 🐾 K = 4z + 12',
    },
    bonusVariants: [
      {
        id: 'l2c3-b1',
        type: 'multiple-choice',
        question:
          'Een opvang betaalt €10 vast + €3 per knaagdier. Welke formule voor totale kosten C bij k knaagdieren?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'C = 10k + 3' },
          { id: 'b', label: 'C = 3k + 10' },
          { id: 'c', label: 'C = 13k' },
        ],
        hint1: 'Vast = 10, per dier = 3.',
        hint2: 'C = 3k + 10.',
        explanation: 'C = 3k + 10.',
      },
      {
        id: 'l2c3-b2',
        type: 'multiple-choice',
        question:
          'Een taxi vraagt €5 instap + €2 per km. Welke formule voor prijs P bij k kilometers?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'P = 2k + 5' },
          { id: 'b', label: 'P = 5k + 2' },
          { id: 'c', label: 'P = 2 + 5 + k' },
        ],
        hint1: 'Instap is vast, km is variabel.',
        hint2: 'P = 2k + 5.',
        explanation: 'P = 2k + 5.',
      },
    ],
  },

  // l2-c4 already defined inline in lesson2.ts — keep here as source of truth override
  'l2-c4': {
    owlHelp: {
      intro:
        'Geen stress. We willen n alleen overhouden. We doen het stap voor stap.',
      steps: [
        {
          explanation:
            'We willen uiteindelijk alleen n overhouden.\n\nNu staat er:\nT = 5n + 20\n\nKijk eerst naar de kant met n.\nDaar staat 5n + 20.',
          question: "Welke van deze twee dingen zit het meest 'aan de buitenkant'?",
          options: [
            { id: 'plus20', label: '+20' },
            { id: 'times5', label: '×5' },
          ],
          correctAnswer: 'plus20',
          successFeedback:
            'Precies.\n\nDie +20 zit als het ware als laatste aan de berekening vast.\nOm hem weg te halen doen we het tegenovergestelde: 20 eraf.',
          retryFeedback:
            'Bijna. Kijk eens naar wat er aan de buitenkant van de berekening gebeurt.',
        },
        {
          explanation:
            'We moeten dat wel aan BEIDE kanten doen.\n\nDus:\nT − 20 = 5n\n\nNu staat er nog:\n5 × n',
          question: 'Wat moeten we doen om alleen n over te houden?',
          options: [
            { id: 'div5', label: 'delen door 5' },
            { id: 'mul5', label: 'keer 5' },
            { id: 'plus5', label: 'plus 5' },
          ],
          correctAnswer: 'div5',
          successFeedback:
            'Juist.\n\nWe delen beide kanten door 5.\nDan krijgen we:\nn = (T − 20) / 5',
          retryFeedback: 'Probeer het tegenovergestelde van ×5 te vinden.',
        },
      ],
      conclusion: 'En daar is onze pootafdruk. 🐾\n\nn = (T − 20) / 5',
    },
    bonusVariants: [
      {
        id: 'bv-k4m12',
        question: 'Schrijf de formule om: K = 4m + 12. Geef m in termen van K.',
        optionalStory: 'Zelfde truc, andere letters.',
        type: 'text-input',
        answer: 'm=(K-12)/4',
        acceptedAnswers: ['m=(K-12)/4', 'm=K/4-3', 'm=(k-12)/4'],
        hint1: 'Eerst 12 aftrekken van beide kanten, daarna delen door 4.',
        hint2: 'K − 12 = 4m → m = (K − 12) / 4',
        explanation: 'm = (K − 12) / 4',
      },
      {
        id: 'bv-p3x15',
        question: 'Schrijf de formule om: P = 3x + 15. Geef x in termen van P.',
        optionalStory: 'Zelfde truc, andere som.',
        type: 'text-input',
        answer: 'x=(P-15)/3',
        acceptedAnswers: ['x=(P-15)/3', 'x=P/3-5', 'x=(p-15)/3'],
        hint1: 'Eerst 15 aftrekken van beide kanten, daarna delen door 3.',
        hint2: 'P − 15 = 3x → x = (P − 15) / 3',
        explanation: 'x = (P − 15) / 3',
      },
      {
        id: 'bv-b7y14',
        question: 'Schrijf de formule om: B = 7y + 14. Geef y in termen van B.',
        type: 'text-input',
        answer: 'y=(B-14)/7',
        acceptedAnswers: ['y=(B-14)/7', 'y=B/7-2', 'y=(b-14)/7'],
        hint1: 'Eerst 14 aftrekken, daarna delen door 7.',
        hint2: 'B − 14 = 7y → y = (B − 14) / 7',
        explanation: 'y = (B − 14) / 7',
      },
      {
        id: 'bv-r6w18',
        question: 'Schrijf de formule om: R = 6w + 18. Geef w in termen van R.',
        type: 'text-input',
        answer: 'w=(R-18)/6',
        acceptedAnswers: ['w=(R-18)/6', 'w=R/6-3', 'w=(r-18)/6'],
        hint1: 'Eerst 18 aftrekken, daarna delen door 6.',
        hint2: 'w = (R − 18) / 6',
        explanation: 'w = (R − 18) / 6',
      },
    ],
  },
};
