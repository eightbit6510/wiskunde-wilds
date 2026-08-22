/**
 * Avontuur-speciale somtypes (kluis, konijnenkoning, sorteren) op jaargroep-niveau.
 */
import type { ClassLevel, ChallengeDefinition, GuidedHelpPack } from '../../src/types/content';
import type { Topic } from '../../src/types';
import type { HelpDifficulty } from './guidedHelpBuilder';
import { buildGuidedHelpPack, readQuestionStep, owlStep, mcBonus } from './guidedHelpBuilder';
import { bandFor } from './specialChallengeUtils';

export type SpecialKind = 'code-crack' | 'boss-battle' | 'sorting' | 'spot-error';

export interface SpecialSlotSpec {
  kind: SpecialKind;
}

/** Deel I: les (1–8) → slot (0–4) */
export const PART1_SPECIAL_SLOTS: Record<string, SpecialSlotSpec> = {
  '1:1': { kind: 'spot-error' },
  '1:2': { kind: 'code-crack' },
  '4:4': { kind: 'boss-battle' },
  '5:3': { kind: 'sorting' },
  '8:4': { kind: 'code-crack' },
};

function slotKey(lessonIndex: number, slot: number): string {
  return `${lessonIndex}:${slot}`;
}

export function specialForPart1Slot(lessonIndex: number, slot: number): SpecialSlotSpec | undefined {
  return PART1_SPECIAL_SLOTS[slotKey(lessonIndex, slot)];
}

function simpleHelp(id: string, difficulty: HelpDifficulty, intro: string): GuidedHelpPack {
  return buildGuidedHelpPack(
    id,
    intro,
    [
      readQuestionStep('Lees de opdracht rustig', 'Wat moet je doen?'),
      owlStep(
        'Neem de tijd. Geen haast.',
        'Snap je wat je moet doen?',
        [
          { id: 'yes', label: 'Ja, ik ga rekenen' },
          { id: 'no', label: 'Nog niet' },
        ],
        'yes',
        'Mooi — probeer het zelf.',
        'Lees de vraag nog eens rustig.',
      ),
      owlStep(
        'Je kunt het.',
        'Klaar voor je antwoord?',
        [
          { id: 'go', label: 'Ja!' },
          { id: 'wait', label: 'Nog even nadenken' },
        ],
        'go',
        'Succes!',
        'Adem in — dan probeer je het nog eens.',
      ),
      ...(difficulty >= 3
        ? [
            owlStep(
              'Controleer je antwoord voordat je verder gaat.',
              'Heb je alles netjes uitgewerkt?',
              [
                { id: 'check', label: 'Ja, gecontroleerd' },
                { id: 'skip', label: 'Nog niet' },
              ],
              'check',
              'Helemaal goed.',
              'Kijk je stappen nog eens na.',
            ),
          ]
        : []),
    ],
    intro,
    [
      mcBonus('b1', 'Even oefenen?', 'a', [{ id: 'a', label: 'Ja' }, { id: 'b', label: 'Nee' }], 'Goed bezig!'),
      mcBonus('b2', 'Nog één tip?', 'a', [{ id: 'a', label: 'Dank je' }, { id: 'b', label: 'Later' }], 'De Uil knipoogt.'),
    ],
    difficulty,
  );
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

  const help = simpleHelp(
    id,
    difficulty,
    lessonIndex === 8
      ? 'Elke juiste som onthult een letter op de tempeldeur.'
      : 'Geen stress. We kraken de kluis som voor som.',
  );
  return { challenge, help };
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
    question: 'Op een boomstam staat een uitwerking. Waar gaat het mis?',
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
  return { challenge, help: simpleHelp(id, difficulty, 'Lees de uitwerking stap voor stap.') };
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
    help: simpleHelp(id, difficulty, 'De konijnenkoning test je snelheid. Eén vraag tegelijk.'),
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
  return { challenge, help: simpleHelp(id, difficulty, 'Kijk goed naar wat je vergelijkt.') };
}

export function generateSpecialChallenge(
  id: string,
  level: ClassLevel,
  lessonIndex: number,
  slot: number,
  difficulty: HelpDifficulty,
  seed: number,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } | null {
  const spec = specialForPart1Slot(lessonIndex, slot);
  if (!spec) return null;

  switch (spec.kind) {
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
    default:
      return null;
  }
}
