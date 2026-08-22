/**
 * PO-verhaalsommen voor groep 6–8 — zelfde story kind, oplopend niveau.
 * Geen formele algebra met x / y=x² (dat is VO).
 */
import type { ClassLevel, ChallengeDefinition, GuidedHelpPack } from '../../src/types/content';
import type { HelpDifficulty } from './guidedHelpBuilder';
import { helpFromChallenge } from './challengeHelpFromFacts';
import type { StoryChallengeKind } from './storySlots';

export type BasisGrade = 6 | 7 | 8;

function pack(
  id: string,
  level: ClassLevel,
  difficulty: HelpDifficulty,
  challenge: Omit<ChallengeDefinition, 'id' | 'difficulty' | 'starsAvailable' | 'classLevels'>,
  intro: string,
  task?: string,
  wrongTask?: string,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const full: ChallengeDefinition = {
    ...challenge,
    id,
    difficulty,
    starsAvailable: 3,
    classLevels: [level],
  };
  return {
    challenge: full,
    help: helpFromChallenge(full, difficulty, intro, task, wrongTask),
  };
}

function multiSelectSigns(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multi-select',
        topic: 'algebra',
        question: 'Welke berekeningen kloppen? Kies alle juiste antwoorden.',
        answerOptions: [
          { id: 'a', label: 'A. 4 + 7 = 11' },
          { id: 'b', label: 'B. 8 − 3 = 5' },
          { id: 'c', label: 'C. 3 × 4 = 11' },
          { id: 'd', label: 'D. 10 ÷ 2 = 5' },
        ],
        answers: ['a', 'b', 'd'],
        hint1: 'Reken elke som rustig uit.',
        hint2: 'C klopt niet: 3 × 4 = 12, niet 11.',
        explanation: 'A, B en D kloppen. C: 3 × 4 = 12.',
      },
      'Lees elke som apart — welke sporen zijn echt?',
      'Alle juiste berekeningen kiezen',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multi-select',
        topic: 'algebra',
        question: 'Welke berekeningen kloppen? Kies alle juiste antwoorden.',
        answerOptions: [
          { id: 'a', label: 'A. 15 − 8 = 7' },
          { id: 'b', label: 'B. 6 × 7 = 42' },
          { id: 'c', label: 'C. 36 ÷ 6 = 5' },
          { id: 'd', label: 'D. 9 + 14 = 23' },
        ],
        answers: ['a', 'b', 'd'],
        hint1: 'Reken elke som uit — niet elk spoor is echt.',
        hint2: 'C: 36 ÷ 6 = 6, niet 5.',
        explanation: 'A, B en D kloppen. C is fout.',
      },
      'Lees elke som apart — welke sporen zijn echt?',
      'Alle juiste berekeningen kiezen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multi-select',
      topic: 'algebra',
      question: 'Welke berekeningen kloppen? Let op de volgorde van bewerkingen.',
      answerOptions: [
        { id: 'a', label: 'A. 2 + 3 × 4 = 14' },
        { id: 'b', label: 'B. 2 + 3 × 4 = 20' },
        { id: 'c', label: 'C. (2 + 3) × 4 = 20' },
        { id: 'd', label: 'D. 10 − 2 × 3 = 4' },
      ],
      answers: ['a', 'c', 'd'],
      hint1: 'Eerst vermenigvuldigen, daarna optellen — behalve bij haakjes.',
      hint2: 'B is fout: 3 × 4 = 12, plus 2 = 14.',
      explanation: 'A, C en D kloppen. B vergeet de volgorde.',
    },
    'Lees elke som apart — welke sporen zijn echt?',
    'Alle juiste berekeningen kiezen',
  );
}

function spotError(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'spot-error',
        topic: 'algebra',
        question: 'Op een boomstam staat: 12 − 5 = 8. Waar gaat het mis?',
        answer: 'aftrek',
        answerOptions: [
          { id: 'optel', label: 'Bij het optellen' },
          { id: 'aftrek', label: 'Bij het aftrekken' },
          { id: 'geen', label: 'Er is geen fout' },
        ],
        hint1: '12 − 5 moet 7 zijn.',
        hint2: 'Iemand heeft 1 te veel gerekend.',
        explanation: '12 − 5 = 7, niet 8. De fout zit bij het aftrekken.',
      },
      'Lees de uitwerking op de boomstam.',
      'De rekenfout vinden',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'spot-error',
        topic: 'algebra',
        question: 'Op een boomstam staat: 3 + 4 × 2 = 14. Waar gaat het mis?',
        answer: 'volgorde',
        answerOptions: [
          { id: 'optel', label: 'Bij 3 + 4' },
          { id: 'volgorde', label: 'Bij de volgorde van bewerkingen' },
          { id: 'geen', label: 'Er is geen fout' },
        ],
        hint1: 'Eerst vermenigvuldigen: 4 × 2 = 8.',
        hint2: 'Daarna 3 + 8 = 11, niet 14.',
        explanation: 'Iemand deed eerst 3 + 4. Juist is 3 + 8 = 11.',
      },
      'Lees de uitwerking op de boomstam.',
      'De rekenfout vinden',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'spot-error',
      topic: 'formules',
      question: 'Op een boomstam staat: oppervlakte 6 × 4 = 20. Waar gaat het mis?',
      answer: 'vermenigvuldig',
      answerOptions: [
        { id: 'optel', label: 'Bij het optellen van 6 en 4' },
        { id: 'vermenigvuldig', label: 'Bij 6 × 4' },
        { id: 'geen', label: 'Er is geen fout' },
      ],
      hint1: 'Oppervlakte = lengte × breedte.',
      hint2: '6 × 4 = 24, niet 20.',
      explanation: '6 × 4 = 24. De vermenigvuldiging klopt niet.',
    },
    'Lees de uitwerking op de boomstam.',
    'De rekenfout vinden',
  );
}

function codeCrack(
  id: string,
  level: ClassLevel,
  grade: BasisGrade,
  d: HelpDifficulty,
  lessonIndex: number,
) {
  const word = lessonIndex === 8 ? 'STER' : 'PAWS';
  const items =
    grade === 6
      ? [
          { expression: '8 − 3', answer: 5, letter: word[0]! },
          { expression: '2 × 4', answer: 8, letter: word[1]! },
          { expression: '12 ÷ 3', answer: 4, letter: word[2]! },
          { expression: '6 + 1', answer: 7, letter: word[3]! },
        ]
      : grade === 7
        ? [
            { expression: '15 − 7', answer: 8, letter: word[0]! },
            { expression: '6 × 3', answer: 18, letter: word[1]! },
            { expression: '24 ÷ 4', answer: 6, letter: word[2]! },
            { expression: '9 + 5', answer: 14, letter: word[3]! },
          ]
        : [
            { expression: '3 × 4 + 2', answer: 14, letter: word[0]! },
            { expression: '20 − 3 × 4', answer: 8, letter: word[1]! },
            { expression: '(10 − 2) ÷ 2', answer: 4, letter: word[2]! },
            { expression: '5 × 5 − 10', answer: 15, letter: word[3]! },
          ];

  return pack(
    id,
    level,
    d,
    {
      type: 'code-crack',
      topic: 'algebra',
      question:
        lessonIndex === 8
          ? 'De tempeldeur wacht op een geheim woord. Los de sommen op — de antwoorden geven letters.'
          : 'Kraak de kluis! Los de sommen op. De antwoorden vormen letters van een geheim woord.',
      secretWord: word,
      codeItems: items,
      hint1: 'Werk elke som uit. Het antwoord hoort bij een letter.',
      hint2: `Antwoorden in volgorde → letters van ${word}.`,
      explanation: `De code is ${word}!`,
    },
    lessonIndex === 8
      ? 'Elke juiste som onthult een letter op de tempeldeur.'
      : 'Geen stress. We kraken de kluis som voor som.',
    `Elke som → letter → woord ${word}`,
  );
}

function equationSteps(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'equation-steps',
        topic: 'algebra',
        question: 'Vul het ontbrekende getal in: □ + 5 = 12',
        equationSteps: [
          {
            prompt: 'Wat moet je doen om □ te vinden?',
            options: [
              { id: 'min', label: '12 − 5 uitrekenen' },
              { id: 'plus', label: '12 + 5 uitrekenen' },
              { id: 'keer', label: '12 × 5 uitrekenen' },
            ],
            correctId: 'min',
            resultDisplay: '□ = 7',
          },
        ],
        answer: 7,
        hint1: 'Je zoekt welk getal plus 5 gelijk is aan 12.',
        hint2: '12 − 5 = 7.',
        explanation: '□ + 5 = 12 → □ = 7.',
      },
      'Eerst snappen wat er ontbreekt, daarna rekenen.',
      'Het ontbrekende getal zoeken',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'equation-steps',
        topic: 'algebra',
        question: 'Vul het ontbrekende getal in: □ × 4 = 28',
        equationSteps: [
          {
            prompt: 'Hoe vind je □?',
            options: [
              { id: 'deel', label: '28 ÷ 4' },
              { id: 'keer', label: '28 × 4' },
              { id: 'min', label: '28 − 4' },
            ],
            correctId: 'deel',
            resultDisplay: '□ = 7',
          },
        ],
        answer: 7,
        hint1: '□ keer 4 is 28. Deel 28 door 4.',
        hint2: '28 ÷ 4 = 7.',
        explanation: '□ × 4 = 28 → □ = 7.',
      },
      'Eerst snappen wat er ontbreekt, daarna rekenen.',
      'Het ontbrekende getal zoeken',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'equation-steps',
      topic: 'algebra',
      question: 'Vul het ontbrekende getal in: □ × 3 + 4 = 19',
      equationSteps: [
        {
          prompt: 'Eerste stap: wat doe je met de +4?',
          options: [
            { id: 'min4', label: 'Eerst 19 − 4' },
            { id: 'deel3', label: 'Eerst 19 ÷ 3' },
            { id: 'plus4', label: 'Eerst 19 + 4' },
          ],
          correctId: 'min4',
          resultDisplay: '□ × 3 = 15',
        },
        {
          prompt: 'Nu: □ × 3 = 15. Wat is □?',
          options: [
            { id: 'deel', label: '15 ÷ 3 = 5' },
            { id: 'min', label: '15 − 3 = 12' },
            { id: 'keer', label: '15 × 3 = 45' },
          ],
          correctId: 'deel',
          resultDisplay: '□ = 5',
        },
      ],
      answer: 5,
      hint1: 'Haal eerst de +4 weg: 19 − 4 = 15.',
      hint2: 'Dan 15 ÷ 3 = 5.',
      explanation: '□ × 3 + 4 = 19 → □ = 5.',
    },
    'Twee stappen: eerst +4 weg, dan delen.',
    'Het ontbrekende getal in twee stappen zoeken',
  );
}

function imposterEquation(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'redeneren',
        question: 'Welke uitspraak kan niet kloppen?',
        answer: 'c',
        answerOptions: [
          { id: 'a', label: 'A. 2 + 2 = 4' },
          { id: 'b', label: 'B. Even getallen eindigen op 0, 2, 4, 6 of 8' },
          { id: 'c', label: 'C. Elk oneven getal is deelbaar door 2' },
          { id: 'd', label: 'D. 5 × 0 = 0' },
        ],
        hint1: 'Oneven getallen zijn niet deelbaar door 2.',
        hint2: 'C is te streng / fout.',
        explanation: 'C klopt niet. Oneven getallen zijn niet deelbaar door 2.',
      },
      'Drie sporen lijken echt — één is vals.',
      'De foute uitspraak aanwijzen',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'redeneren',
        question: 'Welke uitspraak kan niet kloppen?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'A. 1/2 is even groot als 2/4' },
          { id: 'b', label: 'B. 1/3 is groter dan 1/2' },
          { id: 'c', label: 'C. 3/4 van 8 is 6' },
          { id: 'd', label: 'D. 0,5 is hetzelfde als 1/2' },
        ],
        hint1: 'Vergelijk 1/3 en 1/2 met plaatjes of decimalen.',
        hint2: '1/3 ≈ 0,33 en 1/2 = 0,5.',
        explanation: 'B klopt niet: 1/3 is kleiner dan 1/2.',
      },
      'Drie sporen lijken echt — één is vals.',
      'De foute uitspraak aanwijzen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'redeneren',
      question: 'Welke uitspraak kan niet kloppen?',
      answer: 'c',
      answerOptions: [
        { id: 'a', label: 'A. 25% van 80 is 20' },
        { id: 'b', label: 'B. 0,75 = 3/4' },
        { id: 'c', label: 'C. Als je iets verdubbelt, wordt het 3 keer zo groot' },
        { id: 'd', label: 'D. 2³ betekent 2 × 2 × 2' },
      ],
      hint1: 'Verdubbelen = ×2, niet ×3.',
      hint2: 'C verwart verdubbelen met verdrievoudigen.',
      explanation: 'C klopt niet. Verdubbelen maakt iets 2 keer zo groot.',
    },
    'Drie sporen lijken echt — één is vals.',
    'De foute uitspraak aanwijzen',
  );
}

function formulaArea(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  const [A, l, b] = grade === 6 ? [24, 6, 4] : grade === 7 ? [42, 7, 6] : [56, 8, 7];
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'formules',
      question: `Een rechthoek heeft oppervlakte ${A}. De lengte is ${l}. Wat is de breedte?`,
      answer: b,
      hint1: 'Oppervlakte = lengte × breedte. Deel de oppervlakte door de lengte.',
      hint2: `${A} ÷ ${l} = ${b}.`,
      explanation: `Breedte = ${A} ÷ ${l} = ${b}.`,
    },
    'Oppervlakte = lengte × breedte. Zoek de ontbrekende zijde.',
    'De ontbrekende breedte berekenen',
  );
}

function formulaSpeed(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'formules',
        question: 'Een wolf loopt 4 meter per seconde. Hoe ver komt hij in 5 seconden?',
        answer: 20,
        hint1: 'Afstand = snelheid × tijd.',
        hint2: '4 × 5 = 20.',
        explanation: '4 m/s × 5 s = 20 meter.',
      },
      'Afstand = snelheid × tijd.',
      'De afstand uitrekenen',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'formules',
        question: 'Een wolf legt 36 meter af in 6 seconden. Hoeveel meter per seconde is dat?',
        answer: 6,
        hint1: 'Snelheid = afstand ÷ tijd.',
        hint2: '36 ÷ 6 = 6.',
        explanation: '36 ÷ 6 = 6 meter per seconde.',
      },
      'Snelheid = afstand ÷ tijd.',
      'De snelheid uitrekenen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'formules',
      question: 'Afstand = snelheid × tijd. Welke formule geeft de tijd?',
      answer: 'b',
      answerOptions: [
        { id: 'a', label: 'tijd = snelheid × afstand' },
        { id: 'b', label: 'tijd = afstand ÷ snelheid' },
        { id: 'c', label: 'tijd = snelheid ÷ afstand' },
        { id: 'd', label: 'tijd = afstand + snelheid' },
      ],
      hint1: 'Deel beide kanten door de snelheid.',
      hint2: 'tijd = afstand ÷ snelheid.',
      explanation: 'tijd = afstand ÷ snelheid.',
    },
    'Maak de tijd vrij in de formule.',
    'De juiste formule voor tijd kiezen',
  );
}

function formulaCost(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'formules',
        question: 'Een zak voer kost €4. Hoeveel kosten 5 zakken?',
        answer: 20,
        hint1: '5 keer €4.',
        hint2: '5 × 4 = 20.',
        explanation: '5 × 4 = €20.',
      },
      'Tel of vermenigvuldig het aantal zakken.',
      'De totale kosten berekenen',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'formules',
        question: 'Vaste kosten €12 plus €4 per zak. Wat kosten 3 zakken in totaal?',
        answer: 24,
        hint1: 'Eerst 3 × 4, daarna +12.',
        hint2: '12 + 12 = 24.',
        explanation: '12 + 3 × 4 = 12 + 12 = €24.',
      },
      'Vaste kosten + prijs per zak.',
      'De totale kosten berekenen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'formules',
      question: '€12 vast + €4 per zak. Welke regel past bij z zakken?',
      answer: 'b',
      answerOptions: [
        { id: 'a', label: 'Kosten = 12 × z + 4' },
        { id: 'b', label: 'Kosten = 4 × z + 12' },
        { id: 'c', label: 'Kosten = 12 × 4 × z' },
        { id: 'd', label: 'Kosten = 4 + 12 + z' },
      ],
      hint1: 'Start met 12, daarna +4 per zak.',
      hint2: 'Kosten = 4 × z + 12.',
      explanation: 'Kosten = 4 × z + 12.',
    },
    'Vaste kosten + prijs per zak.',
    'De juiste kostenregel kiezen',
  );
}

function formulaRearrangeT(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'formules',
        question: 'Bij 0 nesten is het 20 °C. Elk nest +5 °C. Hoe warm bij 3 nesten?',
        answer: 35,
        hint1: 'Start 20, drie keer +5.',
        hint2: '20 + 15 = 35.',
        explanation: '20 + 3 × 5 = 35 °C.',
      },
      'Volg het patroon in de tabel.',
      'De temperatuur bij 3 nesten',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'formules',
        question: 'Temperatuur = 5 × nesten + 20. Bij hoeveel nesten is het 45 °C?',
        answer: 5,
        hint1: 'Eerst 45 − 20, daarna delen door 5.',
        hint2: '25 ÷ 5 = 5.',
        explanation: '45 − 20 = 25; 25 ÷ 5 = 5 nesten.',
      },
      'Werk achterstevoren: trek 20 af, deel door 5.',
      'Het aantal nesten zoeken',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'formules',
      question: 'Temperatuur = 5 × nesten + 20. Bij hoeveel nesten is het 55 °C?',
      answer: 7,
      hint1: 'Eerst 55 − 20, daarna delen door 5.',
      hint2: '35 ÷ 5 = 7.',
      explanation: '55 − 20 = 35; 35 ÷ 5 = 7 nesten.',
    },
    'Werk achterstevoren: trek 20 af, deel door 5.',
    'Het aantal nesten zoeken',
  );
}

function formulaPerimeter(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'formules',
        question: 'Rechthoek 8 bij 5. Wat is de omtrek?',
        answer: 26,
        hint1: 'Omtrek = 2 × lengte + 2 × breedte.',
        hint2: '2×8 + 2×5 = 16 + 10 = 26.',
        explanation: 'Omtrek = 26.',
      },
      'Omtrek van een rechthoek.',
      'De omtrek berekenen',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'formules',
        question: 'Omtrek is 30. Lengte is 8. Wat is de breedte?',
        answer: 7,
        hint1: '2 × lengte = 16. Dan blijft 14 over voor 2 × breedte.',
        hint2: '14 ÷ 2 = 7.',
        explanation: 'Breedte = 7.',
      },
      'Omtrek van een rechthoek.',
      'De ontbrekende breedte',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'formules',
      question: 'Omtrek = 2×lengte + 2×breedte. Omtrek = 36 en breedte = 6. Wat is de lengte?',
      answer: 12,
      hint1: '2×breedte = 12, dus 2×lengte = 36 − 12 = 24.',
      hint2: 'Lengte = 12.',
      explanation: 'Lengte = 12.',
    },
    'Omtrek van een rechthoek.',
    'De lengte berekenen',
  );
}

function graphChoice(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  void grade;
  return pack(
    id,
    level,
    d,
    {
      type: 'graph-choice',
      topic: 'grafieken',
      question:
        'Welke grafiek past bij iemand die eerst stilstaat, daarna steeds sneller beweegt en vervolgens weer stopt?',
      graphOptions: [
        {
          id: 'a',
          label: 'A: constant stijgend',
          points: [
            { x: 0, y: 0 },
            { x: 1, y: 2 },
            { x: 2, y: 4 },
            { x: 3, y: 6 },
            { x: 4, y: 8 },
          ],
        },
        {
          id: 'b',
          label: 'B: plat, dan steiler, dan plat',
          points: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 1 },
            { x: 3, y: 4 },
            { x: 4, y: 4 },
          ],
        },
        {
          id: 'c',
          label: 'C: dalend',
          points: [
            { x: 0, y: 8 },
            { x: 1, y: 6 },
            { x: 2, y: 4 },
            { x: 3, y: 2 },
            { x: 4, y: 0 },
          ],
        },
        {
          id: 'd',
          label: 'D: zigzag',
          points: [
            { x: 0, y: 2 },
            { x: 1, y: 5 },
            { x: 2, y: 2 },
            { x: 3, y: 5 },
            { x: 4, y: 2 },
          ],
        },
      ],
      answer: 'b',
      hint1: 'Stilstand = horizontaal. Steeds sneller = steiler.',
      hint2: 'Zoek plat → steiler → plat.',
      explanation: 'Grafiek B: eerst stil, dan sneller, dan weer stil.',
    },
    'Welke lijn past bij het verhaal?',
    'De juiste grafiek kiezen',
  );
}

function tableFormula(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'verbanden',
        question: 'Tabel: week 0→3, 1→5, 2→7, 3→9. Welke regel past?',
        tableData: { headers: ['week', 'punten'], rows: [[0, 3], [1, 5], [2, 7], [3, 9]] },
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'Start 3, elke week +2' },
          { id: 'b', label: 'Start 3, elke week +3' },
          { id: 'c', label: 'Altijd 3' },
          { id: 'd', label: 'Elke week verdubbelen' },
        ],
        hint1: 'Kijk hoeveel er bij komt per week.',
        hint2: 'Verschil is steeds +2.',
        explanation: 'Start 3, elke week +2.',
      },
      'Lees de tabel als sporen in de sneeuw.',
      'De juiste regel bij de tabel',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'verbanden',
        question: 'Tabel: stap 0→3, 1→5, 2→7, 3→9. Welke regel past?',
        tableData: { headers: ['stap', 'punten'], rows: [[0, 3], [1, 5], [2, 7], [3, 9]] },
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'Start 3, elke stap +1' },
          { id: 'b', label: 'Start 3, elke stap +2' },
          { id: 'c', label: 'Start 0, elke stap ×3' },
          { id: 'd', label: 'Start 3, elke stap −2' },
        ],
        hint1: 'Bij stap 0 is de start 3. Wat komt er bij?',
        hint2: 'Verschil is steeds +2.',
        explanation: 'Start 3, elke stap +2.',
      },
      'Lees de tabel als sporen in de sneeuw.',
      'De juiste regel bij de tabel',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'verbanden',
      question: 'Tabel: stap 0→3, 1→5, 2→7, 3→9. Welke regel past het best?',
      tableData: { headers: ['stap', 'punten'], rows: [[0, 3], [1, 5], [2, 7], [3, 9]] },
      answer: 'b',
      answerOptions: [
        { id: 'a', label: 'Punten = stap + 3' },
        { id: 'b', label: 'Punten = 2 × stap + 3' },
        { id: 'c', label: 'Punten = 3 × stap' },
        { id: 'd', label: 'Punten = 2 × stap − 3' },
      ],
      hint1: 'Elke stap +2 in de punten. Start bij 3.',
      hint2: 'Controleer bij stap 2: 2×2+3 = 7.',
      explanation: 'Punten = 2 × stap + 3.',
    },
    'Lees de tabel als sporen in de sneeuw.',
    'De regel bij de tabel vinden',
  );
}

function yIntercept(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'grafieken',
        question: 'In de tabel: bij 0 uren is de hoogte 3. Wat is de startwaarde?',
        answer: 3,
        hint1: 'Startwaarde = waarde bij 0.',
        hint2: 'Dat is 3.',
        explanation: 'Startwaarde = 3.',
      },
      'De lynx kijkt naar het begin van het spoor.',
      'De startwaarde aflezen',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'grafieken',
        question: 'Regel: hoogte = 2 × uren + 3. Wat is de hoogte bij 0 uren?',
        answer: 3,
        hint1: 'Vul 0 in voor uren.',
        hint2: '2 × 0 + 3 = 3.',
        explanation: 'Bij 0 uren is de hoogte 3.',
      },
      'De lynx kijkt naar het begin van het spoor.',
      'De startwaarde berekenen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'grafieken',
      question: 'Regel: hoogte = 2 × uren + 3. Waar begint de grafiek (bij 0 uren)?',
      answer: 3,
      hint1: 'Vul 0 in voor uren.',
      hint2: '2 × 0 + 3 = 3.',
      explanation: 'Startwaarde = 3.',
    },
    'De lynx kijkt naar het begin van het spoor.',
    'De startwaarde vinden',
  );
}

function matchingGraphs(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade <= 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'matching',
        topic: 'verbanden',
        question: 'Match regel en betekenis.',
        matchingPairs: [
          { id: '1', left: 'Elke stap ×3', right: 'Steil omhoog vanaf 0' },
          { id: '2', left: 'Start 2, elke stap +1', right: 'Begint bij 2, rustig omhoog' },
          { id: '3', left: 'Altijd 5', right: 'Horizontale lijn' },
          { id: '4', left: 'Elke stap −1, start 4', right: 'Dalend, begint hoog' },
        ],
        hint1: 'Constant = geen verandering = horizontaal.',
        hint2: 'Dalend = elke stap kleiner.',
        explanation: 'Elk spoor hoort bij precies één betekenis.',
      },
      'Vier sporen, vier betekenissen — verbind ze.',
      'Regel en betekenis matchen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'matching',
      topic: 'verbanden',
      question: 'Match regel en betekenis.',
      matchingPairs: [
        { id: '1', left: 'Hoogte = 3 × stap', right: 'Door 0, steil omhoog' },
        { id: '2', left: 'Start 2, elke stap +1', right: 'Begint bij 2, rustig omhoog' },
        { id: '3', left: 'Tabel: (0,5)(1,5)(2,5)', right: 'Constant verband' },
        { id: '4', left: 'Start 4, elke stap −1', right: 'Dalend, start hoog' },
      ],
      hint1: 'Koppel elke regel aan het juiste beeld.',
      hint2: 'Constant betekent horizontaal.',
      explanation: 'Elk spoor hoort bij precies één betekenis.',
    },
    'Vier sporen, vier betekenissen — verbind ze.',
    'Regel en betekenis matchen',
  );
}

function fractionCompare(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'breuken',
        question: 'Welke breuk is groter: 1/2 of 1/4?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '1/2' },
          { id: 'b', label: '1/4' },
          { id: 'gelijk', label: 'Even groot' },
        ],
        hint1: 'Denk aan een pizza: half of een kwart.',
        hint2: '1/2 is groter dan 1/4.',
        explanation: '1/2 is groter dan 1/4.',
      },
      'Vergelijk de breuken in het hol.',
      'De grotere breuk kiezen',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'breuken',
        question: 'Welke breuk is groter: 3/4 of 5/8?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '3/4' },
          { id: 'b', label: '5/8' },
          { id: 'gelijk', label: 'Even groot' },
        ],
        hint1: 'Maak gelijke noemers: 3/4 = 6/8.',
        hint2: '6/8 > 5/8.',
        explanation: '3/4 is groter dan 5/8.',
      },
      'Vergelijk de breuken in het hol.',
      'De grotere breuk kiezen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'breuken',
      question: 'Welke is groter: 5/6 of 0,8?',
      answer: 'a',
      answerOptions: [
        { id: 'a', label: '5/6' },
        { id: 'b', label: '0,8' },
        { id: 'gelijk', label: 'Even groot' },
      ],
      hint1: '5/6 ≈ 0,833…',
      hint2: '0,833 > 0,8.',
      explanation: '5/6 is groter dan 0,8.',
    },
    'Vergelijk breuk en kommagetal.',
    'Het grotere getal kiezen',
  );
}

function fractionAdd(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'text-input',
        topic: 'breuken',
        question: 'Bereken 2/8 + 3/8. Geef als breuk (bijv. 5/8).',
        answer: '5/8',
        hint1: 'Zelfde noemer: tel alleen de tellers op.',
        hint2: '2 + 3 = 5, noemer blijft 8.',
        explanation: '2/8 + 3/8 = 5/8.',
      },
      'Tel de gelijknamige breuken op.',
      'De som als breuk',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'text-input',
        topic: 'breuken',
        question: 'Bereken 1/2 + 1/3. Geef als breuk (bijv. 5/6).',
        answer: '5/6',
        hint1: 'Gemeenschappelijke noemer is 6.',
        hint2: '3/6 + 2/6 = 5/6.',
        explanation: '1/2 + 1/3 = 5/6.',
      },
      'Tel de breuken op.',
      'De som als breuk',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'text-input',
      topic: 'breuken',
      question: 'Bereken 3/4 + 1/6. Vereenvoudig als het kan.',
      answer: '11/12',
      hint1: 'Noemer 12: 9/12 + 2/12.',
      hint2: '9 + 2 = 11 → 11/12.',
      explanation: '3/4 + 1/6 = 11/12.',
    },
    'Tel de breuken op en vereenvoudig.',
    'De som als vereenvoudigde breuk',
  );
}

function powersCompare(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'algebra',
        question: 'Wat is groter: 5 × 5 of 6 × 6?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: '5 × 5 (= 25)' },
          { id: 'b', label: '6 × 6 (= 36)' },
          { id: 'gelijk', label: 'Even groot' },
        ],
        hint1: 'Reken beide uit.',
        hint2: '25 < 36.',
        explanation: '6 × 6 = 36 is groter.',
      },
      'Vergelijk de kwadraten.',
      'Het grotere product kiezen',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'algebra',
        question: 'Wat is groter: 2 × 2 × 2 of 3 × 3?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: '2 × 2 × 2 (= 8)' },
          { id: 'b', label: '3 × 3 (= 9)' },
          { id: 'gelijk', label: 'Even groot' },
        ],
        hint1: '2×2×2 = 8 en 3×3 = 9.',
        hint2: '9 is groter.',
        explanation: '3 × 3 = 9 is groter dan 8.',
      },
      'Reken beide uit en vergelijk.',
      'Het grotere product kiezen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'algebra',
      question: 'Wat is groter: 2×2×2×2×2 of 5×5?',
      answer: 'a',
      answerOptions: [
        { id: 'a', label: '2×2×2×2×2 (= 32)' },
        { id: 'b', label: '5×5 (= 25)' },
        { id: 'gelijk', label: 'Even groot' },
      ],
      hint1: 'Reken beide uit.',
      hint2: '32 > 25.',
      explanation: '2×2×2×2×2 = 32 is groter dan 25.',
    },
    'Reken beide uit en vergelijk.',
    'Het grotere getal kiezen',
  );
}

function sqrtInput(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  const [n, ans] = grade === 6 ? [36, 6] : grade === 7 ? [49, 7] : [64, 8];
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: grade === 8 ? 'machten' : 'algebra',
      question: `Welk positief getal × zichzelf geeft ${n}?`,
      answer: ans,
      hint1: `Probeer: ${ans} × ${ans}.`,
      hint2: `${ans} × ${ans} = ${n}.`,
      explanation: `${ans} × ${ans} = ${n}.`,
    },
    'Welk getal keer zichzelf…',
    'Het getal vinden',
  );
}

function bossBattle(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty, seed: number) {
  void seed;
  const bossQuestions =
    grade === 6
      ? [
          {
            id: 'b1',
            question: '1/4 + 2/4 = ?',
            type: 'multiple-choice' as const,
            options: [
              { id: 'a', label: '3/4' },
              { id: 'b', label: '3/8' },
              { id: 'c', label: '2/4' },
            ],
            correctAnswer: 'a',
            explanation: '1/4 + 2/4 = 3/4',
          },
          {
            id: 'b2',
            question: 'Is 1/2 groter dan 1/3?',
            type: 'true-false' as const,
            correctAnswer: true,
            explanation: 'Ja, 1/2 > 1/3.',
          },
          {
            id: 'b3',
            question: '5 × 5 = ?',
            type: 'number-input' as const,
            correctAnswer: 25,
            explanation: '5 × 5 = 25',
          },
        ]
      : grade === 7
        ? [
            {
              id: 'b1',
              question: '1/2 + 1/4 = ?',
              type: 'multiple-choice' as const,
              options: [
                { id: 'a', label: '3/4' },
                { id: 'b', label: '2/6' },
                { id: 'c', label: '1/6' },
              ],
              correctAnswer: 'a',
              explanation: '2/4 + 1/4 = 3/4',
            },
            {
              id: 'b2',
              question: 'Is 3/7 groter dan 2/5?',
              type: 'true-false' as const,
              correctAnswer: true,
              explanation: '3/7 ≈ 0,43 en 2/5 = 0,40.',
            },
            {
              id: 'b3',
              question: 'Welk getal × zichzelf = 36?',
              type: 'number-input' as const,
              correctAnswer: 6,
              explanation: '6 × 6 = 36',
            },
          ]
        : [
            {
              id: 'b1',
              question: '2/5 × 1/2 = ?',
              type: 'multiple-choice' as const,
              options: [
                { id: 'a', label: '1/5' },
                { id: 'b', label: '2/10' },
                { id: 'c', label: '3/7' },
              ],
              correctAnswer: 'a',
              explanation: '2/5 × 1/2 = 1/5',
            },
            {
              id: 'b2',
              question: 'Is 3/7 groter dan 2/5?',
              type: 'true-false' as const,
              correctAnswer: true,
              explanation: '3/7 ≈ 0,43 > 0,40.',
            },
            {
              id: 'b3',
              question: 'Welk getal × zichzelf = 64?',
              type: 'number-input' as const,
              correctAnswer: 8,
              explanation: '8 × 8 = 64',
            },
          ];

  return pack(
    id,
    level,
    d,
    {
      type: 'boss-battle',
      topic: 'breuken',
      question: 'Boss battle! De konijnenkoning daagt je uit — drie snelle vragen.',
      bossQuestions,
      hint1: 'Eén vraag tegelijk. Neem de tijd.',
      hint2: 'Bij breuken: gelijke noemers of kruisproduct.',
      explanation: 'Boss verslagen!',
    },
    'De konijnenkoning test je snelheid. Eén vraag tegelijk.',
    'Drie snelle vragen beantwoorden',
  );
}

function verbandenTable(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'verbanden',
        question: 'Week 0→4, 1→6, 2→8, 3→10. Welke regel?',
        tableData: { headers: ['week', 'gewicht'], rows: [[0, 4], [1, 6], [2, 8], [3, 10]] },
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'Start 4, elke week +2' },
          { id: 'b', label: 'Start 4, elke week +4' },
          { id: 'c', label: 'Start 2, elke week +4' },
          { id: 'd', label: 'Verdubbelen' },
        ],
        hint1: 'Verschil per week?',
        hint2: 'Steeds +2.',
        explanation: 'Start 4, elke week +2.',
      },
      'Patroon in de tabel onder maanlicht.',
      'De juiste regel kiezen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'verbanden',
      question: 'Welke formule past bij de tabel (week 0→4, 1→6, 2→8, 3→10)?',
      tableData: { headers: ['week', 'gewicht'], rows: [[0, 4], [1, 6], [2, 8], [3, 10]] },
      answer: 'a',
      answerOptions: [
        { id: 'a', label: grade === 8 ? 'g = 2w + 4' : 'g = 2 × w + 4' },
        { id: 'b', label: grade === 8 ? 'g = 4w + 2' : 'g = 4 × w + 2' },
        { id: 'c', label: 'g = w + 4' },
        { id: 'd', label: 'g = 2 × w' },
      ],
      hint1: 'Start bij week 0: g = 4. Elke week +2.',
      hint2: 'g = 2 × w + 4.',
      explanation: 'g = 2 × w + 4.',
    },
    'Patroon in de tabel onder maanlicht.',
    'De formule bij de tabel',
  );
}

function verbandenNonlinearTf(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  void grade;
  return pack(
    id,
    level,
    d,
    {
      type: 'true-false',
      topic: 'verbanden',
      question: 'Groeit dit met steeds dezelfde stap? week: 0,1,2,3 — hoogte: 1,2,4,8',
      answer: false,
      hint1: 'Kijk of het verschil steeds even groot is.',
      hint2: 'Verschillen: +1, +2, +4 — dat verdubbelt.',
      explanation: 'Nee — de waarden verdubbelen, dus niet dezelfde stap.',
    },
    'Niet alles in het lab groeit gelijk…',
    'Of de stap steeds gelijk is',
  );
}

function verbandenSituatie(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'verbanden',
        question: 'Een vos start met 10 stukken voedsel en eet er 2 per uur. Wat gebeurt er?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'Elk uur 2 minder' },
          { id: 'b', label: 'Elk uur 2 meer' },
          { id: 'c', label: 'Altijd 10' },
          { id: 'd', label: 'Elk uur verdubbelen' },
        ],
        hint1: 'Eten = minder voedsel.',
        hint2: 'Start 10, daarna −2 per uur.',
        explanation: 'Elk uur 2 minder.',
      },
      'Koppel verhaal aan patroon.',
      'De juiste beschrijving',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'verbanden',
      question: 'Welke situatie past bij: start 10, elke stap −2?',
      answer: 'a',
      answerOptions: [
        { id: 'a', label: 'Een vos start met 10 stukken en eet er 2 per uur' },
        { id: 'b', label: 'Een vos vindt elk uur 2 stukken, start bij 10' },
        { id: 'c', label: 'Een vos heeft altijd 10 stukken' },
        { id: 'd', label: 'Een vos verdubbelt zijn voedsel elke 2 uur' },
      ],
      hint1: '−2 betekent: er gaat elke stap iets af.',
      hint2: 'Start 10, daarna steeds 2 minder.',
      explanation: 'Start 10, elke stap −2 → voedsel dat opraakt.',
    },
    'Koppel formule/patroon aan verhaal.',
    'De juiste situatie',
  );
}

function sorting(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade <= 7) {
    const items =
      grade === 6
        ? ['1/8', '1/4', '1/2', '3/4']
        : ['1/6', '1/3', '1/2', '2/3'];
    return pack(
      id,
      level,
      d,
      {
        type: 'sorting',
        topic: 'breuken',
        question: 'Sorteer van klein naar groot.',
        sortItems: items,
        correctOrder: items,
        hint1: 'Denk aan stukken van een pizza.',
        hint2: 'Kleinere noemer (bij teller 1) = grotere breuk… hier: grotere stukken later.',
        explanation: `Volgorde: ${items.join(' → ')}.`,
      },
      'Kijk goed naar wat je vergelijkt.',
      'Breuken van klein naar groot',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'sorting',
      topic: 'redeneren',
      question: 'Sorteer van “sterkst dalend” naar “sterkst stijgend”.',
      sortItems: ['elke stap −3', 'elke stap −1', 'elke stap +0,5', 'elke stap +2'],
      correctOrder: ['elke stap −3', 'elke stap −1', 'elke stap +0,5', 'elke stap +2'],
      hint1: 'Meest negatieve stap eerst.',
      hint2: '−3 → −1 → +0,5 → +2.',
      explanation: 'Volgorde op stapgrootte: −3 → −1 → +0,5 → +2.',
    },
    'Kijk goed naar wat je vergelijkt.',
    'Van dalend naar stijgend sorteren',
  );
}

function runestoneAlgebra(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: 'Runesteen Rekenen: □ × 3 = 15. Wat is □?',
        answer: 5,
        hint1: 'Deel 15 door 3.',
        hint2: '15 ÷ 3 = 5.',
        explanation: '□ = 5.',
      },
      'De eerste runesteen gloeit zwak…',
      'Het ontbrekende getal',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: 'Runesteen Rekenen: 3 × (□ − 2) = 15. Wat is □?',
        answer: 7,
        hint1: 'Eerst 15 ÷ 3 = 5, dus □ − 2 = 5.',
        hint2: '□ = 7.',
        explanation: '□ − 2 = 5 → □ = 7.',
      },
      'De eerste runesteen gloeit zwak…',
      'Het ontbrekende getal',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'algebra',
      question: 'Runesteen Rekenen: 3 × (□ − 2) = 15. Wat is □?',
      answer: 7,
      hint1: 'Eerst 15 ÷ 3 = 5, dus □ − 2 = 5.',
      hint2: '□ = 7.',
      explanation: '□ − 2 = 5 → □ = 7.',
    },
    'De eerste runesteen gloeit zwak…',
    'Het ontbrekende getal',
  );
}

function runestoneGraph(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade <= 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'grafieken',
        question: 'Runesteen Grafieken: start bij 4, elke stap −1. Welke beschrijving?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'Stijgend, start bij 4' },
          { id: 'b', label: 'Dalend, start bij 4' },
          { id: 'c', label: 'Altijd 4' },
          { id: 'd', label: 'Door 0, steil omhoog' },
        ],
        hint1: '−1 betekent dalend.',
        hint2: 'Start 4.',
        explanation: 'Dalend, start bij 4.',
      },
      'Tweede runesteen: grafiekspoor.',
      'De juiste beschrijving',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'grafieken',
      question: 'Runesteen Grafieken: start bij 4, elke stap −1. Welke beschrijving?',
      answer: 'b',
      answerOptions: [
        { id: 'a', label: 'Stijgend, start bij 4' },
        { id: 'b', label: 'Dalend, start bij 4' },
        { id: 'c', label: 'Altijd 4' },
        { id: 'd', label: 'Door 0, steil omhoog' },
      ],
      hint1: '−1 betekent dalend.',
      hint2: 'Start 4.',
      explanation: 'Dalend, start bij 4.',
    },
    'Tweede runesteen: grafiekspoor.',
    'De juiste beschrijving',
  );
}

function runestoneBreuk(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'text-input',
        topic: 'breuken',
        question: 'Runesteen Breuken: 2/8 + 2/8 = ? (als breuk)',
        answer: '4/8',
        acceptedAnswers: ['4/8', '1/2'],
        hint1: 'Zelfde noemer: tellers optellen.',
        hint2: '2 + 2 = 4 → 4/8.',
        explanation: '2/8 + 2/8 = 4/8 (of 1/2).',
      },
      'Derde runesteen: breuken.',
      'De breukensom',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'text-input',
      topic: 'breuken',
      question: 'Runesteen Breuken: vereenvoudig 8/12.',
      answer: '2/3',
      hint1: 'Deel teller en noemer door hun GGD.',
      hint2: 'GGD is 4 → 2/3.',
      explanation: '8/12 = 2/3.',
    },
    'Derde runesteen: breuken.',
    'Vereenvoudigen',
  );
}

function runestoneVerbanden(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'verbanden',
        question: 'Runesteen Verbanden: stap 0→2, 1→5, 2→8, 3→11. Welke regel?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'Start 2, elke stap +3' },
          { id: 'b', label: 'Start 2, elke stap +2' },
          { id: 'c', label: 'Verdubbelen' },
          { id: 'd', label: 'Altijd 2' },
        ],
        hint1: 'Verschil in y?',
        hint2: 'Steeds +3.',
        explanation: 'Start 2, elke stap +3.',
      },
      'Vierde runesteen: verbanden.',
      'De regel bij de tabel',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'verbanden',
      question: 'Runesteen Verbanden: stap 0→2, 1→5, 2→8, 3→11. Welke regel?',
      answer: 'a',
      answerOptions: [
        { id: 'a', label: 'Start 2, elke stap +3' },
        { id: 'b', label: 'Start 2, elke stap +2' },
        { id: 'c', label: 'Start 3, elke stap +2' },
        { id: 'd', label: 'Start 1, elke stap +4' },
      ],
      hint1: 'Verschil in de uitkomst is steeds +3.',
      hint2: 'Start 2, elke stap +3.',
      explanation: 'Start 2, elke stap +3.',
    },
    'Vierde runesteen: verbanden.',
    'De regel bij de tabel',
  );
}

function runestoneMixed(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: 'Laatste runesteen: □ + 5 = 17. Wat is □?',
        answer: 12,
        hint1: '17 − 5.',
        hint2: '□ = 12.',
        explanation: '□ = 12.',
      },
      'Alle runestenen samen — bijna op de top!',
      'Het ontbrekende getal',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: 'Laatste runesteen: 2 × □ + 5 = 17. Wat is □?',
        answer: 6,
        hint1: 'Eerst 17 − 5 = 12, dan ÷ 2.',
        hint2: '□ = 6.',
        explanation: '□ = 6.',
      },
      'Alle runestenen samen — bijna op de top!',
      'Het ontbrekende getal',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'algebra',
      question: 'Laatste runesteen: 2 × □ + 5 = 17. Wat is □?',
      answer: 6,
      hint1: 'Eerst 17 − 5 = 12, dan ÷ 2.',
      hint2: '□ = 6.',
      explanation: '□ = 6.',
    },
    'Alle runestenen samen — bijna op de top!',
    'Het ontbrekende getal',
  );
}

function parabolaIntro(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'verbanden',
        question: 'Rij: 1, 4, 9, 16, … Wat is het volgende getal?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '25' },
          { id: 'b', label: '20' },
          { id: 'c', label: '32' },
        ],
        hint1: '1×1, 2×2, 3×3, 4×4…',
        hint2: '5×5 = 25.',
        explanation: 'Het zijn kwadraatgetallen: volgende is 25.',
      },
      'Patronen in maanlicht.',
      'Het volgende kwadraatgetal',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'verbanden',
        question: 'Bij 3×3 en (−3)×(−3): wat valt op?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'Beide geven 9' },
          { id: 'b', label: 'Eén is negatief' },
          { id: 'c', label: 'Alleen 3×3 mag' },
        ],
        hint1: 'Negatief × negatief = positief.',
        hint2: 'Beide 9.',
        explanation: 'Beide geven 9 — het teken verdwijnt bij kwadrateren.',
      },
      'Patronen in maanlicht.',
      'Wat gebeurt er bij kwadrateren',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'verbanden',
      question: 'Bij 3×3 en (−3)×(−3): wat is het resultaat?',
      answer: 'a',
      answerOptions: [
        { id: 'a', label: 'Beide keren 9' },
        { id: 'b', label: '3 en −3' },
        { id: 'c', label: '0 en 9' },
      ],
      hint1: '(−3)×(−3) = 9 en 3×3 = 9.',
      hint2: 'Positief en negatief kunnen hetzelfde antwoord geven.',
      explanation: 'Beide geven 9.',
    },
    'Patronen in maanlicht.',
    'Symmetrie bij kwadrateren',
  );
}

function parabolaShift(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'verbanden',
        question: 'Rij 1, 4, 9, 16. Wat gebeurt er als je bij elk getal +2 doet?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'Nieuwe rij: 3, 6, 11, 18' },
          { id: 'b', label: 'Nieuwe rij: 2, 8, 18, 32' },
          { id: 'c', label: 'De rij blijft hetzelfde' },
        ],
        hint1: 'Tel bij elk getal 2 op.',
        hint2: '1+2=3, 4+2=6, …',
        explanation: 'Elk getal +2 → 3, 6, 11, 18.',
      },
      'De vallei spiegelt zich in maanlicht.',
      'Wat +2 met de rij doet',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'verbanden',
      question: 'Vergelijk de rij 0,1,4,9 met 2,3,6,11. Wat gebeurde er?',
      answer: 'a',
      answerOptions: [
        { id: 'a', label: 'Elk getal kreeg +2' },
        { id: 'b', label: 'Elk getal werd verdubbeld' },
        { id: 'c', label: 'Er kwam een getal bij links' },
        { id: 'd', label: 'Alles werd 2 kleiner' },
      ],
      hint1: 'Vergelijk 0→2, 1→3, 4→6.',
      hint2: 'Steeds +2.',
      explanation: 'Elk getal kreeg +2.',
    },
    'De vallei spiegelt zich in maanlicht.',
    'Wat er met de rij gebeurde',
  );
}

function parabolaSquare(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: 'Wat is 4 × 4?',
        answer: 16,
        hint1: '4 keer 4.',
        hint2: '16.',
        explanation: '4 × 4 = 16.',
      },
      'Kwadraten in het maanlicht.',
      '4 × 4 uitrekenen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'algebra',
      question: 'Wat is (−4) × (−4)?',
      answer: 16,
      hint1: 'Negatief × negatief = positief.',
      hint2: '16.',
      explanation: '(−4)×(−4) = 16.',
    },
    'Kwadraten in het maanlicht.',
    '(−4)×(−4) uitrekenen',
  );
}

function parabolaSymmetryTf(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  void grade;
  return pack(
    id,
    level,
    d,
    {
      type: 'true-false',
      topic: 'redeneren',
      question: 'Klopt dit? “3×3 geeft hetzelfde als (−3)×(−3).”',
      answer: true,
      hint1: 'Negatief × negatief = positief.',
      hint2: 'Beide 9.',
      explanation: 'Ja — beide geven 9.',
    },
    'Symmetrie in maanlicht.',
    'Of de uitspraak klopt',
  );
}

function parabolaShape(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'verbanden',
        question: 'Welke beschrijving past bij 1, 4, 9, 16, 25?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: 'Steeds +1' },
          { id: 'b', label: 'Kwadraatgetallen (1×1, 2×2, …)' },
          { id: 'c', label: 'Verdubbelen' },
        ],
        hint1: '1=1×1, 4=2×2, 9=3×3…',
        hint2: 'Het zijn kwadraatgetallen.',
        explanation: 'Kwadraatgetallen.',
      },
      'Vorm herkennen in maanlicht.',
      'Het juiste patroon',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'verbanden',
      question: 'Welke beschrijving past bij 1, 4, 9, 16, 25 (positieve getallen)?',
      answer: 'b',
      answerOptions: [
        { id: 'a', label: 'Een rechte lijn van toenames' },
        { id: 'b', label: 'Kwadraatgetallen die steeds sneller groeien' },
        { id: 'c', label: 'Een rij die steeds hetzelfde blijft' },
      ],
      hint1: '1=1×1, 4=2×2, 9=3×3 — de sprongen worden groter.',
      hint2: 'Dat is geen constante toename.',
      explanation: 'Kwadraatgetallen groeien sneller dan een rechte lijn.',
    },
    'Vorm herkennen in maanlicht.',
    'Het juiste patroon',
  );
}

function templeOrderOps(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: 'Stersteen 1: Bereken 6 + 3 × 2',
        answer: 12,
        hint1: 'Eerst vermenigvuldigen.',
        hint2: '3×2=6, daarna 6+6=12.',
        explanation: '6 + 6 = 12.',
      },
      'Let op de volgorde van bewerkingen.',
      'De som uitrekenen',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: 'Stersteen 1: Bereken 10 − 2 × 3',
        answer: 4,
        hint1: 'Eerst vermenigvuldigen.',
        hint2: '10 − 6 = 4.',
        explanation: '10 − 6 = 4.',
      },
      'Let op de volgorde van bewerkingen.',
      'De som uitrekenen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'algebra',
      question: 'Stersteen 1: Bereken −6 + (−3) × 2',
      answer: -12,
      hint1: 'Eerst vermenigvuldigen.',
      hint2: '(−3)×2 = −6, daarna −6 + (−6) = −12.',
      explanation: '−6 + (−6) = −12.',
    },
    'Let op de volgorde van bewerkingen.',
    'De som uitrekenen',
  );
}

function templeExpand(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'algebra',
        question: 'Stersteen 2: Wat is 2 groepen van (3 + 1)?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: '2 × 3 + 1 = 7' },
          { id: 'b', label: '2 × 4 = 8' },
          { id: 'c', label: '2 + 3 + 1 = 6' },
        ],
        hint1: 'Eerst tussen haakjes: 3+1=4.',
        hint2: '2 × 4 = 8.',
        explanation: '2 × (3+1) = 8.',
      },
      'Haakjes eerst, dan vermenigvuldigen.',
      'De juiste uitwerking',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'algebra',
        question: 'Stersteen 2: Wat is 2 × (5 − 1)?',
        answer: 'b',
        answerOptions: [
          { id: 'a', label: '2 × 5 − 1 = 9' },
          { id: 'b', label: '2 × 4 = 8' },
          { id: 'c', label: '2 + 5 − 1 = 6' },
        ],
        hint1: 'Eerst haakjes: 5−1=4.',
        hint2: '2×4=8.',
        explanation: '2 × (5−1) = 8.',
      },
      'Haakjes eerst, dan vermenigvuldigen.',
      'De juiste uitwerking',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'algebra',
      question: 'Stersteen 2: Wat is 2 × (3 × 4 − 1)?',
      answer: 'b',
      answerOptions: [
        { id: 'a', label: '2 × 3 × 4 − 1 = 23' },
        { id: 'b', label: '2 × 11 = 22' },
        { id: 'c', label: '2 + 3 × 4 − 1 = 13' },
        { id: 'd', label: '2 × 3 × 4 = 24' },
      ],
      hint1: 'Eerst tussen haakjes: 3×4−1 = 11.',
      hint2: '2 × 11 = 22.',
      explanation: '2 × (12 − 1) = 22.',
    },
    'Haakjes eerst, dan vermenigvuldigen.',
    'De juiste uitwerking',
  );
}

function templeEquation(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: 'Stersteen 3: □ − 7 = 9. Wat is □?',
        answer: 16,
        hint1: '9 + 7.',
        hint2: '□ = 16.',
        explanation: '□ = 16.',
      },
      'Vergelijking op de tempelsteen.',
      'Het ontbrekende getal',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: 'Stersteen 3: 4 × □ − 7 = 9. Wat is □?',
        answer: 4,
        hint1: 'Eerst 9 + 7 = 16, dan ÷ 4.',
        hint2: '□ = 4.',
        explanation: '□ = 4.',
      },
      'Vergelijking op de tempelsteen.',
      'Het ontbrekende getal',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'algebra',
      question: 'Stersteen 3: 4 × □ − 7 = 9. Wat is □?',
      answer: 4,
      hint1: 'Eerst 9 + 7 = 16, dan ÷ 4.',
      hint2: '□ = 4.',
      explanation: '□ = 4.',
    },
    'Vergelijking op de tempelsteen.',
    'Het ontbrekende getal',
  );
}

function templeFormulaL(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'formules',
        question: 'Stersteen 4: Omtrek 20, breedte 4. Wat is de lengte? (rechthoek)',
        answer: 6,
        hint1: '2×lengte + 2×4 = 20.',
        hint2: '2×lengte = 12 → lengte = 6.',
        explanation: 'Lengte = 6.',
      },
      'Formule omdraaien bij de tempel.',
      'De lengte berekenen',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'formules',
        question: 'Stersteen 4: Omtrek = 2×lengte + 2×breedte. Omtrek = 30, breedte = 5. Wat is de lengte?',
        answer: 10,
        hint1: '2×breedte = 10; 2×lengte = 20.',
        hint2: 'Lengte = 10.',
        explanation: 'Lengte = 10.',
      },
      'Formule omdraaien bij de tempel.',
      'De lengte berekenen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'formules',
      question: 'Stersteen 4: Omtrek P = 2×lengte + 2×breedte. P = 36, breedte = 6. Wat is de lengte?',
      answer: 12,
      hint1: '2×breedte = 12; dan blijft 24 voor 2×lengte.',
      hint2: 'Lengte = 12.',
      explanation: 'Lengte = 12.',
    },
    'Formule omdraaien bij de tempel.',
    'De lengte berekenen',
  );
}

// —— Deel II hard slots (PO) — andere getallen dan Deel I om uniek te blijven ——
function p2EquationFamiliar(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'equation-steps',
        topic: 'algebra',
        question: 'Schaduwgrot: vul het ontbrekende getal in: □ + 6 = 14',
        equationSteps: [
          {
            prompt: 'Wat moet je doen om □ te vinden?',
            options: [
              { id: 'min', label: '14 − 6 uitrekenen' },
              { id: 'plus', label: '14 + 6 uitrekenen' },
              { id: 'keer', label: '14 × 6 uitrekenen' },
            ],
            correctId: 'min',
            resultDisplay: '□ = 8',
          },
        ],
        answer: 8,
        hint1: 'Je zoekt welk getal plus 6 gelijk is aan 14.',
        hint2: '14 − 6 = 8.',
        explanation: '□ + 6 = 14 → □ = 8.',
      },
      'Vertrouwd pootafdruk uit het Vossenwoud.',
      'Het ontbrekende getal zoeken',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'equation-steps',
        topic: 'algebra',
        question: 'Schaduwgrot: vul het ontbrekende getal in: □ × 5 = 35',
        equationSteps: [
          {
            prompt: 'Hoe vind je □?',
            options: [
              { id: 'deel', label: '35 ÷ 5' },
              { id: 'keer', label: '35 × 5' },
              { id: 'min', label: '35 − 5' },
            ],
            correctId: 'deel',
            resultDisplay: '□ = 7',
          },
        ],
        answer: 7,
        hint1: '□ keer 5 is 35. Deel 35 door 5.',
        hint2: '35 ÷ 5 = 7.',
        explanation: '□ × 5 = 35 → □ = 7.',
      },
      'Vertrouwd pootafdruk uit het Vossenwoud.',
      'Het ontbrekende getal zoeken',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'equation-steps',
      topic: 'algebra',
      question: 'Schaduwgrot: vul het ontbrekende getal in: □ × 4 + 3 = 23',
      equationSteps: [
        {
          prompt: 'Eerste stap: wat doe je met de +3?',
          options: [
            { id: 'min3', label: 'Eerst 23 − 3' },
            { id: 'deel4', label: 'Eerst 23 ÷ 4' },
            { id: 'plus3', label: 'Eerst 23 + 3' },
          ],
          correctId: 'min3',
          resultDisplay: '□ × 4 = 20',
        },
        {
          prompt: 'Nu: □ × 4 = 20. Wat is □?',
          options: [
            { id: 'deel', label: '20 ÷ 4 = 5' },
            { id: 'min', label: '20 − 4 = 16' },
            { id: 'keer', label: '20 × 4 = 80' },
          ],
          correctId: 'deel',
          resultDisplay: '□ = 5',
        },
      ],
      answer: 5,
      hint1: 'Haal eerst de +3 weg: 23 − 3 = 20.',
      hint2: 'Dan 20 ÷ 4 = 5.',
      explanation: '□ × 4 + 3 = 23 → □ = 5.',
    },
    'Vertrouwd pootafdruk uit het Vossenwoud.',
    'Het ontbrekende getal in twee stappen zoeken',
  );
}

function p2EquationTwoX(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: 'Dieper in de grot: □ + 9 = 15. Wat is □?',
        answer: 6,
        hint1: '15 − 9.',
        hint2: '□ = 6.',
        explanation: '□ = 6.',
      },
      'Twee kanten van de grot — zoek het ontbrekende getal.',
      'Het ontbrekende getal',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: 'Dieper in de grot: 2 × □ + 5 = □ + 11. Wat is □?',
        answer: 6,
        hint1: 'Haal □ naar links: □ + 5 = 11.',
        hint2: '□ = 6.',
        explanation: '□ = 6.',
      },
      'Breng alles met □ naar één kant.',
      'Het ontbrekende getal',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'algebra',
      question: 'Dieper in de grot: 4 × □ + 3 = □ + 15. Wat is □?',
      answer: 4,
      hint1: 'Haal □ naar links: 3 × □ + 3 = 15.',
      hint2: '3 × □ = 12 → □ = 4.',
      explanation: '□ = 4.',
    },
    'Twee kanten van de grot — zoek het ontbrekende getal.',
    'Het ontbrekende getal',
  );
}

function p2FormulaAreaRaven(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  const [A, l, b] = grade === 6 ? [30, 6, 5] : grade === 7 ? [48, 8, 6] : [72, 9, 8];
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'formules',
      question: `Ravennest: oppervlakte ${A} m², breedte ${l} m. Wat is de lengte in meters?`,
      answer: b,
      hint1: 'Oppervlakte ÷ breedte = lengte.',
      hint2: `${A} ÷ ${l} = ${b}.`,
      explanation: `Lengte = ${b} m.`,
    },
    'Ravennest op een rechthoekig platform.',
    'De ontbrekende lengte',
  );
}

function p2FormulaPerimeter(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'formules',
        question: 'Om het nest: rechthoek 7 bij 3. Wat is de omtrek?',
        answer: 20,
        hint1: '2 × (7 + 3).',
        hint2: '2 × 10 = 20.',
        explanation: 'Omtrek = 20.',
      },
      'Om het ravennest heen loopt een touw.',
      'De omtrek berekenen',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'formules',
        question: 'Om het nest: omtrek 28, breedte 6. Wat is de lengte?',
        answer: 8,
        hint1: '2 × breedte = 12. Dan blijft 16 over voor 2 × lengte.',
        hint2: '16 ÷ 2 = 8.',
        explanation: 'Lengte = 8.',
      },
      'Om het ravennest heen loopt een touw.',
      'De ontbrekende lengte',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'formules',
      question: 'Om het nest: omtrek = 2×lengte + 2×breedte. Omtrek = 40 en breedte = 7. Wat is de lengte?',
      answer: 13,
      hint1: '2×breedte = 14; 2×lengte = 26.',
      hint2: 'Lengte = 13.',
      explanation: 'Lengte = 13.',
    },
    'Om het ravennest heen loopt een touw.',
    'De lengte berekenen',
  );
}

function p2RatioScaleRiver(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'verbanden',
        question: 'Op de kaart is 1 cm 10 km. Hoeveel km is 4 cm?',
        answer: 40,
        hint1: '4 × 10.',
        hint2: '40 km.',
        explanation: '4 cm → 40 km.',
      },
      'De rivierkaart schaalt de werkelijkheid.',
      'De echte afstand',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'verbanden',
        question: 'Op de kaart is 1 cm 25 km. Hoeveel km is 4 cm?',
        answer: 100,
        hint1: '4 × 25.',
        hint2: '100 km.',
        explanation: '4 cm → 100 km.',
      },
      'De rivierkaart schaalt de werkelijkheid.',
      'De echte afstand',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'verbanden',
      question:
        'Op een kaart met schaal 1 : 25 000 staat een brug 4 cm. Hoe lang is de brug in meters?',
      answer: 1000,
      hint1: '4 × 25 000 cm = 100 000 cm.',
      hint2: '100 000 cm = 1000 m.',
      explanation: '1000 m.',
    },
    'De rivierkaart schaalt de werkelijkheid.',
    'De echte lengte in meters',
  );
}

function p2RatioMixtureRiver(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'verbanden',
        question: '2 delen sap + 3 delen water. Bij 4 delen sap: hoeveel water?',
        answer: 6,
        hint1: 'Verdubbel beide delen.',
        hint2: '2→4 dus 3→6.',
        explanation: '6 delen water.',
      },
      'Twee delen sap, drie delen water.',
      'Het aantal delen water',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'verbanden',
        question: 'Verhouding sap:water = 2:3. Totaal 25 liter. Hoeveel liter sap?',
        answer: 10,
        hint1: '5 delen totaal. 25 ÷ 5 = 5 per deel.',
        hint2: '2 × 5 = 10.',
        explanation: '10 liter sap.',
      },
      'Twee delen sap, drie delen water — de riviercocktail.',
      'Het aantal liter sap',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'verbanden',
      question: 'Sap:water = 2:3, totaal 25 liter. Hoeveel liter sap?',
      answer: 10,
      hint1: '5 delen, 5 liter per deel.',
      hint2: '2 × 5 = 10.',
      explanation: '10 liter sap.',
    },
    'Twee delen sap, drie delen water — de riviercocktail.',
    'Het aantal liter sap',
  );
}

function p2GraphIntersect(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade <= 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'grafieken',
        question: 'Twee sporen: lijn A start 3 +2 per stap, lijn B start 7 +1 per stap. Bij welke stap zijn ze gelijk? (stapnummer)',
        answer: 4,
        hint1: 'Maak een tabel of reken: 3+2×stap = 7+stap.',
        hint2: 'Stap = 4.',
        explanation: 'Bij stap 4: beide 11.',
      },
      'Twee lichtlijnen kruisen boven het dak.',
      'Het kruispunt (stapnummer)',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'grafieken',
      question:
        'Twee sporen: lijn A start 3 +2 per stap, lijn B start 7 +1 per stap. Bij welke stap zijn ze gelijk?',
      answer: 4,
      hint1: 'Maak een tabel of reken: 3+2×stap = 7+stap.',
      hint2: 'Stap = 4.',
      explanation: 'Bij stap 4: beide 11.',
    },
    'Twee lichtlijnen kruisen boven het dak.',
    'Het kruispunt (stapnummer)',
  );
}

function p2YInterceptObservatory(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'grafieken',
        question: 'Observatorium: bij 0 uren is de hoogte 8. Wat is de startwaarde?',
        answer: 8,
        hint1: 'Startwaarde = waarde bij 0.',
        hint2: 'Dat is 8.',
        explanation: 'Startwaarde = 8.',
      },
      'Waar begint het spoor bij 0 uren?',
      'De startwaarde aflezen',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'grafieken',
        question: 'Observatorium: hoogte = −uren + 8. Wat is de hoogte bij 0 uren?',
        answer: 8,
        hint1: 'Vul 0 in voor uren.',
        hint2: '−0 + 8 = 8.',
        explanation: 'Bij 0 uren is de hoogte 8.',
      },
      'Waar begint het spoor bij 0 uren?',
      'De startwaarde berekenen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'grafieken',
      question: 'Observatorium: hoogte = −uren + 8. Wat is de startwaarde (bij 0 uren)?',
      answer: 8,
      hint1: 'Vul 0 in voor uren.',
      hint2: 'Hoogte = 8.',
      explanation: 'Startwaarde = 8.',
    },
    'Waar begint het spoor bij 0 uren?',
    'De startwaarde',
  );
}

function p2PowerProduct(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: '2 × 2 × 2 = ?',
        answer: 8,
        hint1: '2×2=4, ×2=8.',
        hint2: '8.',
        explanation: '8.',
      },
      'Twee runen vermenigvuldigd — stapel de factoren.',
      'Het product',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'algebra',
        question: '2×2×2 × 2×2 — hoeveel keer 2 is dat samen?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '5 keer 2' },
          { id: 'b', label: '6 keer 2' },
          { id: 'c', label: '10 keer 2' },
        ],
        hint1: 'Tel de factoren: 3 + 2 = 5.',
        hint2: 'Vijf keer de factor 2.',
        explanation: 'Samen 5 keer 2.',
      },
      'Twee runen vermenigvuldigd — stapel de factoren.',
      'Het juiste aantal factoren',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'algebra',
      question: '2×2×2 × 2×2 — wat is het product?',
      answer: 'a',
      answerOptions: [
        { id: 'a', label: '32' },
        { id: 'b', label: '16' },
        { id: 'c', label: '64' },
        { id: 'd', label: '10' },
      ],
      hint1: 'Eerst 2×2×2 = 8, dan ×2×2.',
      hint2: '8 × 4 = 32.',
      explanation: '2×2×2×2×2 = 32.',
    },
    'Twee runen vermenigvuldigd — stapel de factoren.',
    'Het product',
  );
}

function p2Sqrt81(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  const [n, a] = grade === 6 ? [36, 6] : grade === 7 ? [49, 7] : [81, 9];
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: grade === 8 ? 'machten' : 'algebra',
      question: `Welk getal × zichzelf geeft ${n}?`,
      answer: a,
      hint1: `${a} × ${a}.`,
      hint2: `${n}.`,
      explanation: `${a} × ${a} = ${n}.`,
    },
    'Een rune vraagt om de wortel…',
    'Het getal vinden',
  );
}

function p2Square12(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  const [n, a] = grade === 6 ? [5, 25] : grade === 7 ? [8, 64] : [12, 144];
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: grade === 8 ? 'machten' : 'algebra',
      question: `${n} × ${n} = ?`,
      answer: a,
      hint1: `${n} keer ${n}.`,
      hint2: `${a}.`,
      explanation: `${n} × ${n} = ${a}.`,
    },
    'De runen vragen om een kwadraat.',
    'Het kwadraat',
  );
}

function p2Sequence(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'redeneren',
        question: 'Rij 2, 4, 6, 8, … Wat is het volgende getal?',
        answer: 10,
        hint1: 'Elke stap +2.',
        hint2: '8 + 2 = 10.',
        explanation: '10.',
      },
      'Stenen in het doolhof vormen een rij.',
      'Het volgende getal',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'redeneren',
      question: 'Reeks: 3, 7, 11, 15, … Wat is het volgende getal?',
      answer: 19,
      hint1: 'Elke stap +4.',
      hint2: '15 + 4 = 19.',
      explanation: '19.',
    },
    'Stenen in het doolhof vormen een rij.',
    'Het volgende getal',
  );
}

function p2FigureStones(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'verbanden',
        question: 'Figuur 1 = 3 stenen, figuur 2 = 5, figuur 3 = 7. Hoeveel stenen heeft figuur 5?',
        answer: 11,
        hint1: 'Elke figuur +2.',
        hint2: '3 + 2×4 = 11.',
        explanation: '11 stenen.',
      },
      'Elke figuur groeit met een laag stenen.',
      'Het aantal stenen',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'verbanden',
      question:
        'Figuurstenen: figuur 1 = 4, figuur 2 = 7, figuur 3 = 10. Hoeveel stenen heeft figuur 10?',
      answer: 31,
      hint1: 'Stap +3. Formule: 3n + 1.',
      hint2: '3·10 + 1 = 31.',
      explanation: '31 stenen.',
    },
    'Elke figuur groeit met een laag stenen.',
    'Het aantal stenen bij figuur 10',
  );
}

function p2NachtAlgebra(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: 'Kamer I: □ + 4 = 11. Wat is □?',
        answer: 7,
        hint1: '11 − 4.',
        hint2: '□ = 7.',
        explanation: '□ = 7.',
      },
      'Reken-slot in de nachttempel.',
      'Het ontbrekende getal',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'algebra',
        question: 'Kamer I: 3 × □ + 2 = □ + 10. Wat is □?',
        answer: 4,
        hint1: 'Haal □ naar links: 2 × □ + 2 = 10.',
        hint2: '2 × □ = 8 → □ = 4.',
        explanation: '□ = 4.',
      },
      'Reken-slot in de nachttempel.',
      'Het ontbrekende getal',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'algebra',
      question: 'Kamer I: 3 × □ + 2 = □ + 10. Wat is □?',
      answer: 4,
      hint1: 'Haal □ naar links: 2 × □ + 2 = 10.',
      hint2: '2 × □ = 8 → □ = 4.',
      explanation: '□ = 4.',
    },
    'Reken-slot in de nachttempel.',
    'Het ontbrekende getal',
  );
}

function p2NachtRatio(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'verbanden',
        question: 'Kamer II: 3 delen sap + 5 delen water. Bij 6 delen sap: hoeveel water?',
        answer: 10,
        hint1: 'Verdubbel beide delen.',
        hint2: '3→6 dus 5→10.',
        explanation: '10 delen water.',
      },
      'Een nachtelijke rivier stroomt door kamer II.',
      'Het aantal delen water',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'verbanden',
      question: 'Kamer II: sap:water = 3:5, totaal 32 liter. Hoeveel liter sap?',
      answer: 12,
      hint1: '8 delen, 4 liter per deel.',
      hint2: '3 × 4 = 12.',
      explanation: '12 liter sap.',
    },
    'Een nachtelijke rivier stroomt door kamer II.',
    'Het aantal liter sap',
  );
}

function p2NachtIntersectY(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade <= 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'number-input',
        topic: 'grafieken',
        question: 'Kamer III: Lijn A: 2×stap + 1. Bij stap 5: wat is de hoogte van A?',
        answer: 11,
        hint1: '2×5 + 1.',
        hint2: '11.',
        explanation: 'Hoogte = 11.',
      },
      'Twee sterrenlijnen — geef de hoogte.',
      'De hoogte',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'number-input',
      topic: 'grafieken',
      question:
        'Kamer III: lijn A = 2×stap + 1, lijn B = stap + 6. Bij welk stapnummer zijn ze even hoog? Geef daarna die hoogte.',
      answer: 11,
      hint1: 'Eerst: 2×stap + 1 = stap + 6 → stap = 5.',
      hint2: 'Hoogte = 2×5 + 1 = 11.',
      explanation: 'Bij stap 5 is de hoogte 11.',
    },
    'Twee sterrenlijnen kruisen elkaar.',
    'De hoogte op het kruispunt',
  );
}

function p2ParabolaIntro(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'verbanden',
        question: 'Maanvallei: rij 4, 9, 16, 25, … Wat is het volgende getal?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: '36' },
          { id: 'b', label: '30' },
          { id: 'c', label: '32' },
        ],
        hint1: '2×2, 3×3, 4×4, 5×5…',
        hint2: '6×6 = 36.',
        explanation: 'Volgende is 36.',
      },
      'Patronen in de maanvallei.',
      'Het volgende kwadraatgetal',
    );
  }
  if (grade === 7) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'verbanden',
        question: 'Maanvallei: bij 4×4 en (−4)×(−4): wat valt op?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'Beide geven 16' },
          { id: 'b', label: 'Eén is negatief' },
          { id: 'c', label: 'Alleen 4×4 mag' },
        ],
        hint1: 'Negatief × negatief = positief.',
        hint2: 'Beide 16.',
        explanation: 'Beide geven 16.',
      },
      'Patronen in de maanvallei.',
      'Wat gebeurt er bij kwadrateren',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'verbanden',
      question: 'Maanvallei: wat is 4×4, en wat is (−4)×(−4)?',
      answer: 'a',
      answerOptions: [
        { id: 'a', label: 'Beide keren 16' },
        { id: 'b', label: '4 en −4' },
        { id: 'c', label: '0 en 16' },
      ],
      hint1: '4×4 = 16 en (−4)×(−4) = 16.',
      hint2: 'Beide 16.',
      explanation: 'Beide geven 16.',
    },
    'Patronen in de maanvallei.',
    'Symmetrie bij kwadrateren',
  );
}

function p2ParabolaShift(id: string, level: ClassLevel, grade: BasisGrade, d: HelpDifficulty) {
  if (grade === 6) {
    return pack(
      id,
      level,
      d,
      {
        type: 'multiple-choice',
        topic: 'verbanden',
        question: 'Maanvallei: rij 4, 9, 16, 25. Wat gebeurt er als je bij elk getal +3 doet?',
        answer: 'a',
        answerOptions: [
          { id: 'a', label: 'Nieuwe rij: 7, 12, 19, 28' },
          { id: 'b', label: 'Nieuwe rij: 12, 27, 48, 75' },
          { id: 'c', label: 'De rij blijft hetzelfde' },
        ],
        hint1: 'Tel bij elk getal 3 op.',
        hint2: '4+3=7, 9+3=12, …',
        explanation: 'Elk getal +3 → 7, 12, 19, 28.',
      },
      'De vallei spiegelt zich in het maanlicht.',
      'Wat +3 met de rij doet',
    );
  }
  return pack(
    id,
    level,
    d,
    {
      type: 'multiple-choice',
      topic: 'verbanden',
      question: 'Maanvallei: vergelijk 0,1,4,9 met 3,4,7,12. Wat gebeurde er?',
      answer: 'a',
      answerOptions: [
        { id: 'a', label: 'Elk getal kreeg +3' },
        { id: 'b', label: 'Elk getal werd verdubbeld' },
        { id: 'c', label: 'Er kwam een getal bij links' },
        { id: 'd', label: 'Alles werd 3 kleiner' },
      ],
      hint1: 'Vergelijk 0→3, 1→4, 4→7.',
      hint2: 'Steeds +3.',
      explanation: 'Elk getal kreeg +3.',
    },
    'De vallei spiegelt zich in het maanlicht.',
    'Wat er met de rij gebeurde',
  );
}

/** PO story challenge for groep 6–8. */
export function generateBasisStoryChallenge(
  kind: StoryChallengeKind,
  id: string,
  level: ClassLevel,
  grade: BasisGrade,
  lessonIndex: number,
  difficulty: HelpDifficulty,
  seed: number,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } | null {
  switch (kind) {
    case 'multi-select-signs':
      return multiSelectSigns(id, level, grade, difficulty);
    case 'spot-error':
      return spotError(id, level, grade, difficulty);
    case 'code-crack':
      return codeCrack(id, level, grade, difficulty, lessonIndex);
    case 'equation-steps':
      return equationSteps(id, level, grade, difficulty);
    case 'imposter-equation':
      return imposterEquation(id, level, grade, difficulty);
    case 'formula-area':
      return formulaArea(id, level, grade, difficulty);
    case 'formula-speed':
      return formulaSpeed(id, level, grade, difficulty);
    case 'formula-cost':
      return formulaCost(id, level, grade, difficulty);
    case 'formula-rearrange-t':
      return formulaRearrangeT(id, level, grade, difficulty);
    case 'formula-perimeter':
      return formulaPerimeter(id, level, grade, difficulty);
    case 'graph-choice':
      return graphChoice(id, level, grade, difficulty);
    case 'table-formula':
      return tableFormula(id, level, grade, difficulty);
    case 'y-intercept':
      return yIntercept(id, level, grade, difficulty);
    case 'matching-graphs':
      return matchingGraphs(id, level, grade, difficulty);
    case 'fraction-compare':
      return fractionCompare(id, level, grade, difficulty);
    case 'fraction-add':
      return fractionAdd(id, level, grade, difficulty);
    case 'powers-compare':
      return powersCompare(id, level, grade, difficulty);
    case 'sqrt-input':
      return sqrtInput(id, level, grade, difficulty);
    case 'boss-battle':
      return bossBattle(id, level, grade, difficulty, seed);
    case 'verbanden-table':
    case 'verbanden-linear-table':
      return verbandenTable(id, level, grade, difficulty);
    case 'verbanden-nonlinear-tf':
      return verbandenNonlinearTf(id, level, grade, difficulty);
    case 'verbanden-situatie':
      return verbandenSituatie(id, level, grade, difficulty);
    case 'sorting':
      return sorting(id, level, grade, difficulty);
    case 'runestone-algebra':
      return runestoneAlgebra(id, level, grade, difficulty);
    case 'runestone-graph':
      return runestoneGraph(id, level, grade, difficulty);
    case 'runestone-breuk':
      return runestoneBreuk(id, level, grade, difficulty);
    case 'runestone-verbanden':
      return runestoneVerbanden(id, level, grade, difficulty);
    case 'runestone-mixed':
      return runestoneMixed(id, level, grade, difficulty);
    case 'parabola-intro':
      return parabolaIntro(id, level, grade, difficulty);
    case 'parabola-shift':
      return parabolaShift(id, level, grade, difficulty);
    case 'parabola-square':
      return parabolaSquare(id, level, grade, difficulty);
    case 'parabola-symmetry-tf':
      return parabolaSymmetryTf(id, level, grade, difficulty);
    case 'parabola-shape':
      return parabolaShape(id, level, grade, difficulty);
    case 'temple-order-ops':
      return templeOrderOps(id, level, grade, difficulty);
    case 'temple-expand':
      return templeExpand(id, level, grade, difficulty);
    case 'temple-equation':
      return templeEquation(id, level, grade, difficulty);
    case 'temple-formula-l':
      return templeFormulaL(id, level, grade, difficulty);
    case 'p2-equation-familiar':
      return p2EquationFamiliar(id, level, grade, difficulty);
    case 'p2-equation-two-x':
      return p2EquationTwoX(id, level, grade, difficulty);
    case 'p2-formula-area-raven':
      return p2FormulaAreaRaven(id, level, grade, difficulty);
    case 'p2-formula-perimeter':
      return p2FormulaPerimeter(id, level, grade, difficulty);
    case 'p2-ratio-scale-river':
      return p2RatioScaleRiver(id, level, grade, difficulty);
    case 'p2-ratio-mixture-river':
      return p2RatioMixtureRiver(id, level, grade, difficulty);
    case 'p2-graph-intersect':
      return p2GraphIntersect(id, level, grade, difficulty);
    case 'p2-y-intercept-observatory':
      return p2YInterceptObservatory(id, level, grade, difficulty);
    case 'p2-power-product':
      return p2PowerProduct(id, level, grade, difficulty);
    case 'p2-sqrt-81':
      return p2Sqrt81(id, level, grade, difficulty);
    case 'p2-square-12':
      return p2Square12(id, level, grade, difficulty);
    case 'p2-sequence':
    case 'p2-pattern-formula':
      return p2Sequence(id, level, grade, difficulty);
    case 'p2-figure-stones':
      return p2FigureStones(id, level, grade, difficulty);
    case 'p2-nacht-algebra':
      return p2NachtAlgebra(id, level, grade, difficulty);
    case 'p2-nacht-ratio':
      return p2NachtRatio(id, level, grade, difficulty);
    case 'p2-nacht-intersect-y':
      return p2NachtIntersectY(id, level, grade, difficulty);
    case 'p2-parabola-intro':
      return p2ParabolaIntro(id, level, grade, difficulty);
    case 'p2-parabola-shift':
      return p2ParabolaShift(id, level, grade, difficulty);
    default:
      return null;
  }
}
