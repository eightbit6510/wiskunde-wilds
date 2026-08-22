/**
 * Basisschool-generators (groep 6–7): sommen en uil-hulp op passend niveau.
 */
import type { ClassLevel, ChallengeDefinition, GuidedHelpPack } from '../../src/types/content';
import type { Topic } from '../../src/types';
import { challengeIdForLevel } from '../../src/content/classLevels';
import {
  helpForBreukenAlsBreuk,
  helpForBreukenGelijknamig,
  helpForHerhaaldeOptelling,
  helpForOntbrekendGetal,
  helpForRedeneren,
  helpForTabelGroep,
  helpForVerbandenBasis,
  REDENEREN_GROEP6,
  REDENEREN_GROEP7,
  type HelpDifficulty,
} from './guidedHelpBuilder';

const DENOMINATORS = [2, 4, 6, 8] as const;
const TABLE_ITEMS = [
  { label: 'appels', single: 'appel' },
  { label: 'sticker', single: 'sticker' },
  { label: 'potloden', single: 'potlood' },
  { label: 'snoepjes', single: 'snoepje' },
] as const;
const RATIO_CONTEXTS = [
  'snoepjes',
  'ballonnen',
  'plakkers',
  'kaarten',
] as const;

function frac(n: number, d: number): string {
  return `${n}/${d}`;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function simplifyFrac(num: number, den: number): string {
  const g = gcd(num, den);
  const n = num / g;
  const d = den / g;
  if (d === 1) return String(n);
  return `${n}/${d}`;
}

export function basisGrade(level: ClassLevel): 6 | 7 | 8 | null {
  if (level === 'groep-6') return 6;
  if (level === 'groep-7') return 7;
  if (level === 'groep-8') return 8;
  return null;
}

export function generateBasisForTopic(
  level: ClassLevel,
  grade: 6 | 7,
  challengeIndex: number,
  topic: Topic,
  difficulty: HelpDifficulty,
  seed: number,
  topicOccurrence = 0,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const id = challengeIdForLevel(level, challengeIndex);
  const s = seed + topicOccurrence * 17;

  switch (topic) {
    case 'breuken': {
      if (grade === 6) {
        const d = DENOMINATORS[(topicOccurrence + s) % DENOMINATORS.length];
        const n1 = ((topicOccurrence + s) % (d - 1)) + 1;
        const n2 = ((topicOccurrence + (s >> 2)) % Math.max(d - n1, 1)) + 1;
        const sumN = n1 + n2;
        const fracSum = simplifyFrac(sumN, d);
        const wrongFrac = simplifyFrac(sumN, d * 2);
        const f1 = frac(n1, d);
        const f2 = frac(n2, d);
        const challenge: ChallengeDefinition = {
          id,
          type: 'multiple-choice',
          topic,
          difficulty,
          starsAvailable: 3,
          question: `Wat is ${f1} + ${f2}? Kies het juiste antwoord.`,
          answer: 'a',
          answerOptions: [
            { id: 'a', label: fracSum },
            { id: 'b', label: wrongFrac },
            { id: 'c', label: simplifyFrac(n1 + n2 + 1, d) },
          ],
          hint1: 'Hebben beide breuken dezelfde noemer? Tel dan de tellers op.',
          hint2: `${n1} + ${n2} = ${sumN}, noemer blijft ${d}.`,
          explanation: `${f1} + ${f2} = ${fracSum}`,
          classLevels: [level],
        };
        const help = helpForBreukenGelijknamig(
          id,
          difficulty,
          f1,
          f2,
          d,
          n1,
          n2,
          fracSum,
          wrongFrac,
        );
        return { challenge, help };
      }

      // groep 7: ongelijknamig, antwoord als breuk
      const pairs = [
        [1, 2, 1, 4],
        [1, 3, 1, 6],
        [1, 4, 1, 2],
        [2, 3, 1, 4],
        [1, 2, 1, 3],
        [2, 5, 1, 2],
        [3, 4, 1, 8],
      ] as const;
      const [n1, d1, n2, d2] = pairs[(topicOccurrence + s) % pairs.length];
      const num = n1 * d2 + n2 * d1;
      const den = d1 * d2;
      const fracSum = simplifyFrac(num, den);
      const wrongFrac = simplifyFrac(num + 1, den);
      const f1 = frac(n1, d1);
      const f2 = frac(n2, d2);
      const challenge: ChallengeDefinition = {
        id,
        type: 'multiple-choice',
        topic,
        difficulty,
        starsAvailable: 3,
        question: `Wat is ${f1} + ${f2}? Geef je antwoord als breuk.`,
        answer: 'a',
        answerOptions: [
          { id: 'a', label: fracSum },
          { id: 'b', label: wrongFrac },
          { id: 'c', label: simplifyFrac(n1 + n2, d1 + d2) },
        ],
        hint1: 'Maak eerst de noemers gelijk.',
        hint2: `${f1} + ${f2} = ${fracSum}`,
        explanation: `${f1} + ${f2} = ${fracSum}`,
        classLevels: [level],
      };
      const help = helpForBreukenAlsBreuk(
        id,
        difficulty,
        f1,
        f2,
        den,
        fracSum,
        wrongFrac,
      );
      return { challenge, help };
    }

    case 'vergelijkingen': {
      const a = ((topicOccurrence + s) % 7) + 2;
      const b = a + ((topicOccurrence + (s >> 3)) % 6) + 2;
      const missing = b - a;
      const missingFirst = (topicOccurrence + s) % 2 === 0;
      const question = missingFirst
        ? `Er ontbreekt een getal: ? + ${a} = ${b}. Wat is het ontbrekende getal?`
        : `Er ontbreekt een getal: ${a} + ? = ${b}. Wat is het ontbrekende getal?`;
      const challenge: ChallengeDefinition = {
        id,
        type: 'number-input',
        topic,
        difficulty,
        starsAvailable: 3,
        question,
        answer: missing,
        hint1: 'Tel terug: trek het bekende getal af van het totaal.',
        hint2: `${b} − ${a} = ${missing}`,
        explanation: `${b} − ${a} = ${missing}`,
        classLevels: [level],
      };
      const help = helpForOntbrekendGetal(id, difficulty, a, b, missing, missingFirst);
      return { challenge, help };
    }

    case 'grafieken': {
      const item = TABLE_ITEMS[(topicOccurrence + s) % TABLE_ITEMS.length];
      const unitPrice = ((topicOccurrence + s) % 4) + 2;
      const count = ((topicOccurrence + (s >> 2)) % 4) + 2;
      const total = unitPrice * count;
      const challenge: ChallengeDefinition = {
        id,
        type: 'multiple-choice',
        topic,
        difficulty,
        starsAvailable: 3,
        question: `1 ${item.single} kost ${unitPrice} euro. Wat kosten ${count} ${item.label}?`,
        answer: 'a',
        answerOptions: [
          { id: 'a', label: `${total} euro` },
          { id: 'b', label: `${total + unitPrice} euro` },
          { id: 'c', label: `${total - 1} euro` },
        ],
        hint1: `Elke ${item.single} kost ${unitPrice} euro — tel dat ${count} keer op.`,
        hint2: `${count} × ${unitPrice} = ${total}`,
        explanation: `${count} × ${unitPrice} euro = ${total} euro`,
        classLevels: [level],
      };
      const help = helpForTabelGroep(
        id,
        difficulty,
        item.label,
        unitPrice,
        count,
        total,
      );
      return { challenge, help };
    }

    case 'verbanden': {
      const p1 = ((topicOccurrence + s) % 3) + 2;
      const p2 = ((topicOccurrence + (s >> 2)) % 3) + 2;
      const factor = ((topicOccurrence + (s >> 3)) % 3) + 2;
      const given = p1 * factor;
      const other = factor * p2;
      const context = RATIO_CONTEXTS[(topicOccurrence + s) % RATIO_CONTEXTS.length];
      const challenge: ChallengeDefinition = {
        id,
        type: 'number-input',
        topic,
        difficulty,
        starsAvailable: 3,
        question: `Voor elke ${p1} rode ${context} horen ${p2} blauwe. Je hebt ${given} rode. Hoeveel blauwe horen daarbij?`,
        answer: other,
        hint1: `Deel ${given} door ${p1}.`,
        hint2: `Dat getal × ${p2} = ${other}.`,
        explanation: `${given} ÷ ${p1} = ${factor}.\n${factor} × ${p2} = ${other}.`,
        classLevels: [level],
      };
      const help = helpForVerbandenBasis(
        id,
        difficulty,
        p1,
        p2,
        given,
        factor,
        other,
        context,
      );
      return { challenge, help };
    }

    case 'redeneren': {
      const pool = grade === 6 ? REDENEREN_GROEP6 : REDENEREN_GROEP7;
      const { challenge: redParts, help } = helpForRedeneren(
        id,
        difficulty,
        topicOccurrence * 3 + s,
        pool,
      );
      const challenge: ChallengeDefinition = {
        id,
        type: 'multi-select',
        topic,
        difficulty,
        starsAvailable: 3,
        question: redParts.question,
        answerOptions: redParts.answerOptions,
        answers: redParts.answers,
        hint1: 'Lees elke zin apart. “Elke … is …” is vaak te streng.',
        hint2: 'Check A, B, C en D één voor één.',
        explanation: redParts.explanation,
        classLevels: [level],
      };
      return { challenge, help };
    }

    case 'algebra': {
      const groups = ((topicOccurrence + s) % 4) + 2;
      const each = ((topicOccurrence + (s >> 2)) % 5) + 2;
      const total = groups * each;
      const sumParts = Array.from({ length: Math.min(groups, 4) }, () => String(each)).join(' + ');
      const dots = groups > 4 ? ' + …' : '';
      const challenge: ChallengeDefinition = {
        id,
        type: 'number-input',
        topic,
        difficulty,
        starsAvailable: 3,
        question: `Reken uit: ${sumParts}${dots} (${groups} keer ${each}). Wat is het antwoord?`,
        answer: total,
        hint1: `${groups} keer ${each} is hetzelfde als ${groups} × ${each}.`,
        hint2: `${groups} × ${each} = ${total}`,
        explanation: `${groups} × ${each} = ${total}`,
        classLevels: [level],
      };
      const help = helpForHerhaaldeOptelling(id, difficulty, groups, each, total);
      return { challenge, help };
    }

    default:
      return generateBasisForTopic(level, grade, challengeIndex, 'breuken', difficulty, seed, topicOccurrence);
  }
}
