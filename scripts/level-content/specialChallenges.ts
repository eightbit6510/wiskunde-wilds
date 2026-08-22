/**
 * Avontuur-speciale somtypes (kluis, konijnenkoning, sorteren) op jaargroep-niveau.
 */
import type { ClassLevel, ChallengeDefinition, GuidedHelpPack } from '../../src/types/content';
import type { Topic } from '../../src/types';
import type { HelpDifficulty } from './guidedHelpBuilder';
import { helpFromChallenge } from './challengeHelpFromFacts';
import { bandFor } from './specialChallengeUtils';

import type { StoryChallengeKind } from './storySlots';
import { generateStoryKindChallenge } from './storyChallengeGenerators';
import { basisGrade } from './basisGenerators';
import { generateBasisStoryChallenge } from './basisStoryChallenges';

function challengeHelp(
  challenge: ChallengeDefinition,
  difficulty: HelpDifficulty,
  intro: string,
  taskLabel?: string,
  wrongTaskLabel?: string,
): GuidedHelpPack {
  return helpFromChallenge(challenge, difficulty, intro, taskLabel, wrongTaskLabel);
}

function codeCrackForLevel(
  id: string,
  level: ClassLevel,
  difficulty: HelpDifficulty,
  secretWord: string,
  lessonIndex: number,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const band = bandFor(level);
  const items =
    band === 'basis'
      ? [
          { expression: '12 − 5', answer: 7, letter: secretWord[0] ?? 'P' },
          { expression: '3 × 2', answer: 6, letter: secretWord[1] ?? 'A' },
          { expression: '20 ÷ 4', answer: 5, letter: secretWord[2] ?? 'W' },
          { expression: '9 − 6', answer: 3, letter: secretWord[3] ?? 'S' },
        ]
      : band === 'mavo'
        ? [
            { expression: '−2 + 9', answer: 7, letter: secretWord[0] ?? 'P' },
            { expression: '3 × 2 − 4', answer: 2, letter: secretWord[1] ?? 'A' },
            { expression: '24 ÷ 6', answer: 4, letter: secretWord[2] ?? 'W' },
            { expression: '−1 + 4', answer: 3, letter: secretWord[3] ?? 'S' },
          ]
        : [
            { expression: '−2 + 9', answer: 7, letter: secretWord[0] ?? 'P' },
            { expression: '3 × (−1) + 5', answer: 2, letter: secretWord[1] ?? 'A' },
            { expression: '16 ÷ (−4) + 8', answer: 4, letter: secretWord[2] ?? 'W' },
            { expression: '−5 − (−8)', answer: 3, letter: secretWord[3] ?? 'S' },
          ];

  const word = secretWord.slice(0, items.length).toUpperCase();
  items.forEach((item, i) => {
    item.letter = word[i] ?? item.letter;
  });

  const challenge: ChallengeDefinition = {
    id,
    type: 'code-crack',
    topic: 'algebra',
    difficulty,
    starsAvailable: 3,
    question:
      lessonIndex === 8
        ? 'De tempeldeur wacht op een geheim woord. Los de sommen op — de antwoorden geven letters.'
        : 'Kraak de kluis! Los de sommen op. De antwoorden vormen letters van een geheim woord.',
    secretWord: word,
    codeItems: items.slice(0, word.length),
    hint1: 'Werk elke som uit. Het antwoord hoort bij een letter.',
    hint2: `Antwoorden in volgorde → letters van ${word}.`,
    explanation: `De code is ${word}!`,
    classLevels: [level],
  };

  return {
    challenge,
    help: challengeHelp(
      challenge,
      difficulty,
      lessonIndex === 8
        ? 'Elke juiste som onthult een letter op de tempeldeur.'
        : 'Geen stress. We kraken de kluis som voor som.',
      `Elke som → letter → woord ${word}`,
      'Alleen raden zonder te rekenen',
    ),
  };
}

function spotErrorForLevel(
  id: string,
  level: ClassLevel,
  difficulty: HelpDifficulty,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const band = bandFor(level);
  const wrong =
    band === 'basis'
      ? { expr: '2(x + 3) = 2x + 3', fault: 'bij3' as const, label: 'Bij de +3' }
      : { expr: '3(x + 4) = 3x + 4', fault: 'bij4' as const, label: 'Bij de +4' };

  const challenge: ChallengeDefinition = {
    id,
    type: 'spot-error',
    topic: 'algebra',
    difficulty,
    starsAvailable: 3,
    question: `Op een boomstam staat: ${wrong.expr}. Waar gaat het mis?`,
    answer: wrong.fault,
    answerOptions: [
      { id: 'bijx', label: 'Bij de x' },
      { id: wrong.fault, label: wrong.label },
      { id: 'geen', label: 'Er is geen fout' },
    ],
    hint1: 'Bij haakjes wegwerken moet de factor buiten de haakjes met élke term vermenigvuldigd worden.',
    hint2: `Kijk naar: ${wrong.expr}`,
    explanation: `De fout zat ${wrong.label.toLowerCase()} — de factor moet met alle termen vermenigvuldigd worden.`,
    classLevels: [level],
  };
  return {
    challenge,
    help: challengeHelp(
      challenge,
      difficulty,
      'Lees de uitwerking stap voor stap.',
      'De fout in de haakjes vinden',
      'Zeggen dat er geen fout is zonder te kijken',
    ),
  };
}

function bossBattleForLevel(
  id: string,
  level: ClassLevel,
  difficulty: HelpDifficulty,
  seed: number,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const band = bandFor(level);
  const bossQuestions =
    band === 'basis'
      ? [
          {
            id: 'b1',
            question: 'Wat is 1/2 + 1/4?',
            type: 'multiple-choice' as const,
            options: [
              { id: 'a', label: '3/4' },
              { id: 'b', label: '2/6' },
              { id: 'c', label: '1/3' },
            ],
            correctAnswer: 'a',
            explanation: '1/2 + 1/4 = 2/4 + 1/4 = 3/4',
          },
          {
            id: 'b2',
            question: 'Is 1/3 groter dan 1/4?',
            type: 'true-false' as const,
            correctAnswer: true,
            explanation: '1/3 is groter dan 1/4.',
          },
          {
            id: 'b3',
            question: '2 × 6 = ?',
            type: 'number-input' as const,
            correctAnswer: 12,
            explanation: '2 × 6 = 12',
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
            explanation: '3/7 ≈ 0,43 en 2/5 = 0,40.',
          },
          {
            id: 'b3',
            question: '√64 = ?',
            type: 'number-input' as const,
            correctAnswer: 8,
            explanation: '8 × 8 = 64',
          },
        ];

  const challenge: ChallengeDefinition = {
    id,
    type: 'boss-battle',
    topic: 'breuken',
    difficulty: Math.max(difficulty, 2) as HelpDifficulty,
    starsAvailable: 3,
    question: 'Boss battle! De konijnenkoning daagt je uit — drie snelle vragen.',
    bossQuestions,
    hint1: 'Drie vragen achter elkaar. Adem in tussen elke vraag.',
    hint2: 'Je hoeft niet perfect te zijn — lees elke vraag rustig.',
    explanation: 'De konijnenkoning buigt voor je — goed gedaan!',
    classLevels: [level],
  };
  return {
    challenge,
    help: challengeHelp(
      challenge,
      difficulty,
      'De konijnenkoning test je snelheid. Eén vraag tegelijk.',
      'Drie snelle vragen achter elkaar beantwoorden',
      'Alleen de eerste vraag doen',
    ),
  };
}

function sortingForLevel(
  id: string,
  level: ClassLevel,
  difficulty: HelpDifficulty,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const band = bandFor(level);
  const sortItems =
    band === 'basis'
      ? ['1/2', '1/4', '3/4', '1/8']
      : ['y = −3x + 1', 'y = −x + 4', 'y = 0,5x', 'y = 2x − 1'];
  const correctOrder =
    band === 'basis'
      ? ['3/4', '1/2', '1/4', '1/8']
      : ['y = −3x + 1', 'y = −x + 4', 'y = 0,5x', 'y = 2x − 1'];

  const challenge: ChallengeDefinition = {
    id,
    type: 'sorting',
    topic: 'redeneren',
    difficulty,
    starsAvailable: 3,
    question:
      band === 'basis'
        ? 'Sorteer de breuken van groot naar klein.'
        : 'Sorteer van “sterkst dalend” naar “sterkst stijgend”.',
    sortItems,
    correctOrder,
    hint1: band === 'basis' ? 'Vergelijk de breuken — maak ze gelijknamig of gebruik een getal-lijn.' : 'Kijk naar het hellingsgetal.',
    hint2: 'Sleep de items in de juiste volgorde.',
    explanation: 'Goed gesorteerd!',
    classLevels: [level],
  };
  return {
    challenge,
    help: challengeHelp(
      challenge,
      difficulty,
      'Kijk goed naar wat je vergelijkt.',
      'Items in de juiste volgorde zetten',
      'Willekeurig slepen',
    ),
  };
}

function multiSelectSignsForLevel(
  id: string,
  level: ClassLevel,
  difficulty: HelpDifficulty,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const band = bandFor(level);
  const challenge: ChallengeDefinition =
    band === 'basis'
      ? {
          id,
          type: 'multi-select',
          topic: 'algebra',
          difficulty,
          starsAvailable: 3,
          question: 'Welke berekeningen kloppen? Kies alle juiste antwoorden.',
          answerOptions: [
            { id: 'a', label: 'A. 4 + 7 = 10' },
            { id: 'b', label: 'B. 8 − 3 = 4' },
            { id: 'c', label: 'C. 3 × 4 = 12' },
            { id: 'd', label: 'D. 10 ÷ 2 = 6' },
          ],
          answers: ['c'],
          hint1: 'Reken elke som rustig uit — niet elk spoor in het mos is echt.',
          hint2: 'Alleen C klopt: 3 × 4 = 12.',
          explanation:
            'Alleen C klopt.\n\nA: 4 + 7 = 11\nB: 8 − 3 = 5\nC: 3 × 4 = 12 ✓\nD: 10 ÷ 2 = 5',
          classLevels: [level],
        }
      : {
          id,
          type: 'multi-select',
          topic: 'algebra',
          difficulty,
          starsAvailable: 3,
          question: 'Welke berekeningen kloppen? Kies alle juiste antwoorden.',
          answerOptions: [
            { id: 'a', label: 'A. −4 + 7 = −11' },
            { id: 'b', label: 'B. 5 − (−3) = 2' },
            { id: 'c', label: 'C. −3 × −4 = 12' },
            { id: 'd', label: 'D. 18 ÷ −3 = 6' },
          ],
          answers: ['c'],
          hint1: 'Denk na over tekens: negatief × negatief, en min een negatief getal.',
          hint2: 'Controleer A, B en D opnieuw — alleen C klopt.',
          explanation:
            'Alleen C klopt.\n\nA: −4 + 7 = 3\nB: 5 − (−3) = 8\nC: −3 × −4 = 12 ✓\nD: 18 ÷ −3 = −6',
          classLevels: [level],
        };

  return {
    challenge,
    help: challengeHelp(
      challenge,
      difficulty,
      'Lees elke som apart — welke sporen zijn echt?',
      'Alle juiste berekeningen kiezen',
      'Eén willekeurige som aankruisen',
    ),
  };
}

function equationStepsForLevel(
  id: string,
  level: ClassLevel,
  difficulty: HelpDifficulty,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const band = bandFor(level);
  const a = band === 'basis' ? 3 : 5;
  const b = band === 'basis' ? 11 : 17;
  const x = band === 'basis' ? 4 : 6;
  const lhs = band === 'basis' ? 'x + 3' : '2x + 5';

  const challenge: ChallengeDefinition = {
    id,
    type: 'equation-steps',
    topic: 'vergelijkingen',
    difficulty,
    starsAvailable: 3,
    question: `Los stap voor stap op: ${lhs} = ${b}`,
    equationSteps: [
      {
        prompt: 'Wat doe je eerst om dichter bij x te komen?',
        options: [
          { id: 'plus', label: `Beide kanten +${a}` },
          { id: 'min', label: `Beide kanten −${a}` },
          { id: 'keer', label: band === 'basis' ? 'Beide kanten ×2' : 'Beide kanten ÷2' },
          { id: 'alleen', label: `Alleen links −${a}` },
        ],
        correctId: 'min',
        resultDisplay: band === 'basis' ? 'x = 8' : '2x = 12',
      },
      ...(band === 'basis'
        ? []
        : [
            {
              prompt: 'Nu staat er 2x = 12. Wat is de volgende stap?',
              options: [
                { id: 'deel2', label: 'Beide kanten ÷ 2' },
                { id: 'min2', label: 'Beide kanten − 2' },
                { id: 'keer2', label: 'Beide kanten × 2' },
                { id: 'plus2', label: 'Beide kanten + 2' },
              ],
              correctId: 'deel2',
              resultDisplay: 'x = 6',
            },
          ]),
    ],
    answer: x,
    hint1: 'Je wilt de constante term wegwerken — doe aan beide kanten het tegenovergestelde.',
    hint2: band === 'basis' ? 'x + 3 = 11 → x = 8' : '2x + 5 = 17 → 2x = 12 → x = 6',
    explanation:
      band === 'basis'
        ? 'x + 3 = 11\nBeide kanten −3 → x = 8'
        : '2x + 5 = 17\nBeide kanten −5 → 2x = 12\nBeide kanten ÷ 2 → x = 6',
    classLevels: [level],
  };

  return {
    challenge,
    help: challengeHelp(
      challenge,
      difficulty,
      'Eerst de constante weg, daarna x vrijmaken.',
      'Stap voor stap de vergelijking oplossen',
      'x gokken zonder stappen',
    ),
  };
}

function imposterEquationForLevel(
  id: string,
  level: ClassLevel,
  difficulty: HelpDifficulty,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const challenge: ChallengeDefinition = {
    id,
    type: 'multiple-choice',
    topic: 'redeneren',
    difficulty,
    starsAvailable: 3,
    question: 'Welke oplossing kan niet kloppen? Redeneer zonder alles uit te rekenen.',
    answerOptions: [
      { id: 'a', label: 'A. Bij x + 8 = 3 zegt Sam: x = −5' },
      { id: 'b', label: 'B. Bij 2x = −10 zegt Noor: x = −5' },
      { id: 'c', label: 'C. Bij −x = 4 zegt Finn: x = 4' },
    ],
    answer: 'c',
    hint1: 'Bij −x = 4: wat gebeurt er als je beide kanten met −1 vermenigvuldigt?',
    hint2: 'Als −x = 4, dan is x = −4. Finn zegt +4 — dat kan niet.',
    explanation:
      'C kan niet.\n\nA: −5 + 8 = 3 ✓\nB: 2 · (−5) = −10 ✓\nC: Als −x = 4, dan x = −4 (niet +4).',
    classLevels: [level],
  };
  return {
    challenge,
    help: challengeHelp(
      challenge,
      difficulty,
      'Drie leerlingen, één vals spoor — wie heeft de fout?',
      'De foute redenering aanwijzen',
      'De eerste leerling kiezen',
    ),
  };
}

function graphChoiceForLevel(
  id: string,
  level: ClassLevel,
  difficulty: HelpDifficulty,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const challenge: ChallengeDefinition = {
    id,
    type: 'graph-choice',
    topic: 'grafieken',
    difficulty,
    starsAvailable: 3,
    question:
      'Welke grafiek past bij iemand die eerst stilstaat, daarna steeds sneller beweegt en vervolgens weer stopt?',
    answer: 'b',
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
    ],
    hint1: 'Stilstand = horizontale lijn. Steeds sneller = steilere helling.',
    hint2: 'Zoek plat → steiler → plat.',
    explanation: 'Grafiek B: eerst stil, dan sneller, dan weer stil.',
    classLevels: [level],
  };
  return {
    challenge,
    help: challengeHelp(
      challenge,
      difficulty,
      'Welke lijn past bij het verhaal?',
      'De grafiek bij het verhaal kiezen',
      'De steilste lijn kiezen',
    ),
  };
}

function tableFormulaForLevel(
  id: string,
  level: ClassLevel,
  difficulty: HelpDifficulty,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const challenge: ChallengeDefinition = {
    id,
    type: 'multiple-choice',
    topic: 'grafieken',
    difficulty,
    starsAvailable: 3,
    question: 'Welk patroon zie je in de tabel? Welke formule past erbij?',
    tableData: {
      headers: ['x', 'y'],
      rows: [
        [0, 3],
        [1, 5],
        [2, 7],
        [3, 9],
      ],
    },
    answer: 'b',
    answerOptions: [
      { id: 'a', label: 'y = x + 3' },
      { id: 'b', label: 'y = 2x + 3' },
      { id: 'c', label: 'y = 3x' },
      { id: 'd', label: 'y = 2x − 3' },
    ],
    hint1: 'Kijk hoeveel y stijgt als x met 1 toeneemt.',
    hint2: 'Elke stap +2 in y, start bij y = 3 → y = 2x + 3.',
    explanation: 'y = 2x + 3. Elke stap in x geeft +2 in y.',
    classLevels: [level],
  };
  return {
    challenge,
    help: challengeHelp(
      challenge,
      difficulty,
      'Lees de tabel als sporen in de sneeuw.',
      'De formule bij de tabel vinden',
      'Alleen naar de eerste rij kijken',
    ),
  };
}

function yInterceptForLevel(
  id: string,
  level: ClassLevel,
  difficulty: HelpDifficulty,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const challenge: ChallengeDefinition = {
    id,
    type: 'number-input',
    topic: 'grafieken',
    difficulty,
    starsAvailable: 3,
    question: 'y = 2x + 3. Waar raakt de grafiek de y-as? Geef de y-waarde.',
    answer: 3,
    hint1: 'Op de y-as is x = 0.',
    hint2: 'Vul x = 0 in: y = 2·0 + 3.',
    explanation: 'Bij x = 0: y = 3. Dat is het snijpunt met de y-as.',
    classLevels: [level],
  };
  return {
    challenge,
    help: challengeHelp(
      challenge,
      difficulty,
      'De lynx kijkt naar het snijpunt met de verticale as.',
      'Het snijpunt met de y-as vinden',
      'Het hellingsgetal invullen',
    ),
  };
}

function matchingGraphsForLevel(
  id: string,
  level: ClassLevel,
  difficulty: HelpDifficulty,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const challenge: ChallengeDefinition = {
    id,
    type: 'matching',
    topic: 'verbanden',
    difficulty,
    starsAvailable: 3,
    question: 'Match formule, tabel-idee en verhaal.',
    matchingPairs: [
      { id: '1', left: 'y = 3x', right: 'Door 0, steil omhoog' },
      { id: '2', left: 'y = x + 2', right: 'Start bij 2, helling 1' },
      { id: '3', left: 'Tabel: (0,5)(1,5)(2,5)', right: 'Constant verband' },
      { id: '4', left: 'y = −x + 4', right: 'Dalend, start hoog' },
    ],
    hint1: 'Koppel elke formule aan het juiste beeld.',
    hint2: 'Constant in y betekent horizontaal verband.',
    explanation: 'Elk spoor hoort bij precies één betekenis.',
    classLevels: [level],
  };
  return {
    challenge,
    help: challengeHelp(
      challenge,
      difficulty,
      'Vier sporen, vier betekenissen — verbind ze.',
      'Formule, tabel en verhaal matchen',
      'Alles willekeurig koppelen',
    ),
  };
}

export function generateStoryChallenge(
  id: string,
  level: ClassLevel,
  lessonIndex: number,
  slot: number,
  difficulty: HelpDifficulty,
  seed: number,
  kind: StoryChallengeKind,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } | null {
  const grade = basisGrade(level);
  if (grade) {
    return generateBasisStoryChallenge(kind, id, level, grade, lessonIndex, difficulty, seed);
  }

  const themed = generateStoryKindChallenge(kind, id, level, lessonIndex, difficulty, seed);
  if (themed) return themed;

  switch (kind) {
    case 'code-crack':
      return codeCrackForLevel(
        id,
        level,
        difficulty,
        lessonIndex === 8 ? 'STAR' : 'PAWS',
        lessonIndex,
      );
    case 'spot-error':
      return spotErrorForLevel(id, level, difficulty);
    case 'boss-battle':
      return bossBattleForLevel(id, level, difficulty, seed);
    case 'sorting':
      return sortingForLevel(id, level, difficulty);
    case 'multi-select-signs':
      return multiSelectSignsForLevel(id, level, difficulty);
    case 'equation-steps':
      return equationStepsForLevel(id, level, difficulty);
    case 'imposter-equation':
      return imposterEquationForLevel(id, level, difficulty);
    case 'graph-choice':
      return graphChoiceForLevel(id, level, difficulty);
    case 'table-formula':
      return tableFormulaForLevel(id, level, difficulty);
    case 'y-intercept':
      return yInterceptForLevel(id, level, difficulty);
    case 'matching-graphs':
      return matchingGraphsForLevel(id, level, difficulty);
    default:
      return null;
  }
}
