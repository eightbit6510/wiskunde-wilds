import type { ClassLevel, ChallengeDefinition, GuidedHelpPack, LessonShell } from '../../src/types/content';
import type { Topic } from '../../src/types';
import {
  CHALLENGES_PER_LESSON,
  CLASS_LEVEL_IDS,
  CLASS_LEVEL_PROFILES,
  getClassProfile,
  lessonIdForLevel,
  challengeIdForLevel,
  part2ChallengeIdForLevel,
  part2LessonIdForLevel,
  LEVEL_LESSON_COUNT,
  CHALLENGES_PER_LEVEL,
} from '../../src/content/classLevels';
import {
  helpForAlgebra,
  helpForBreuken,
  helpForFormules,
  helpForGrafieken,
  helpForKwadratisch,
  helpForMachten,
  helpForRedeneren,
  helpForVerbanden,
  helpForVergelijkingen,
  validateHelpPack,
} from './guidedHelpBuilder';
import { basisGrade, generateBasisForTopic } from './basisGenerators';
import { generateStoryChallenge } from './specialChallenges';
import { part1StorySlot, part1StoryTopic } from './storySlots';
import { part2HardStoryKind } from './storySlotsPart2';
import { loadStoryShell, PART1_STORY_IDS, PART2_STORY_IDS, storyOptionalStory } from './storyMeta';
import {
  difficultyForPart2,
  isPart2ReviewSlot,
  part2ReviewPart1Slot,
} from './part2Pattern';

export interface LevelBundle {
  level: ClassLevel;
  manifest: {
    id: ClassLevel;
    title: string;
    subtitle: string;
    theme: 'day';
    helpPersonaId: 'uil';
    lessonIds: string[];
    part2LessonIds: string[];
    unlockRuleId: 'always';
  };
  lessons: LessonShell[];
  part2Lessons: LessonShell[];
  challenges: ChallengeDefinition[];
  helpPacks: GuidedHelpPack[];
}

function seed(level: ClassLevel, index: number, salt = 0): number {
  let h = 0;
  const s = `${level}-${index}-${salt}`;
  for (let i = 0; i < s.length; i += 1) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function challengeQuestionKey(challenge: ChallengeDefinition): string {
  const optionsKey = challenge.answerOptions?.map((option) => option.label).join('|') ?? '';
  if (challenge.type === 'multi-select') {
    return `${challenge.topic}|${challenge.question}|${(challenge.answers ?? []).join(',')}|${optionsKey}`;
  }
  if (challenge.type === 'multiple-choice') {
    return `${challenge.topic}|${challenge.question}|${challenge.answer}|${optionsKey}`;
  }
  return `${challenge.topic}|${challenge.question}|${JSON.stringify(challenge.answer)}`;
}

function pick<T>(arr: T[], n: number): T {
  return arr[n % arr.length];
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

function frac(n: number, d: number): string {
  const g = gcd(n, d);
  return `${n / g}/${d / g}`;
}

/** Decimaal antwoord, max. 2 decimalen (zoals in breuk-sommen gevraagd). */
function decimalAnswer(num: number, den: number): number {
  return Math.round((num / den) * 100) / 100;
}

type Band = 'basis' | 'mavo' | 'havo' | 'vwo';

function bandFor(level: ClassLevel): Band {
  if (level.startsWith('groep')) return 'basis';
  if (level.startsWith('mavo')) return 'mavo';
  if (level.startsWith('havo')) return 'havo';
  return 'vwo';
}

function yearNum(level: ClassLevel): number {
  const m = level.match(/(\d)$/);
  return m ? Number(m[1]) : 1;
}

const LESSON_THEMES: Record<
  Band,
  { areaName: string; title: string; emoji: string; intro: string }[]
> = {
  basis: [
    {
      areaName: 'Breukenbos',
      title: 'Stukjes en heel',
      emoji: '🍕',
      intro: 'In het Breukenbos liggen plakken die je moet combineren. De Uil helpt je tellen.',
    },
    {
      areaName: 'Verhoudingspad',
      title: 'Evenredig denken',
      emoji: '⚖️',
      intro: 'Op het pad zie je verhoudingen in alledaagse situaties.',
    },
    {
      areaName: 'Meetvallei',
      title: 'Meten en omrekenen',
      emoji: '📏',
      intro: 'Lengtes, oppervlaktes en eenheden — alles moet kloppen.',
    },
    {
      areaName: 'Grafiekheuvel',
      title: 'Lezen van grafieken',
      emoji: '📊',
      intro: 'Stijgen, dalen, stilstand — wat vertelt de grafiek?',
    },
    {
      areaName: 'Vergelijkingenbrug',
      title: 'Onbekende vinden',
      emoji: '🌉',
      intro: 'Er ontbreekt een getal. Kun jij de brug over?',
    },
    {
      areaName: 'Redeneerrots',
      title: 'Logisch nadenken',
      emoji: '🪨',
      intro: 'Niet rekenen alleen — ook goed kijken wat klopt.',
    },
    {
      areaName: 'Algebra-adje',
      title: 'Letters en getallen',
      emoji: '🔤',
      intro: 'x en y duiken op. Geen paniek: stap voor stap.',
    },
    {
      areaName: 'Uilentop',
      title: 'Alles samen',
      emoji: '🦉',
      intro: 'Op de top combineer je wat je geleerd hebt. De Uil gelooft in je.',
    },
  ],
  mavo: [
    { areaName: 'Lineair dal', title: 'Rechte lijnen', emoji: '📈', intro: 'Formules en grafieken lopen recht door.' },
    { areaName: 'Breukenwerk', title: 'Breuken & procent', emoji: '💯', intro: 'Breuken, decimalen en procenten in de praktijk.' },
    { areaName: 'Meetkundemoeras', title: 'Hoeken & oppervlakte', emoji: '📐', intro: 'Driehoeken, rechthoeken en cirkels.' },
    { areaName: 'Tabellenstation', title: 'Data lezen', emoji: '📋', intro: 'Tabellen en grafieken vertellen een verhaal.' },
    { areaName: 'Formulefabriek', title: 'Formules gebruiken', emoji: '⚙️', intro: 'Invullen, oplossen, controleren.' },
    { areaName: 'Vergelijkingenpoort', title: 'Vergelijkingen', emoji: '🚪', intro: 'Lineaire vergelijkingen stap voor stap.' },
    { areaName: 'Verbandenweg', title: 'Verbanden', emoji: '🔗', intro: 'Hoe hangen grootheden aan elkaar?' },
    { areaName: 'Eindproef', title: 'Klaar voor de toets', emoji: '🎯', intro: 'Alles nog eens — jij bent er klaar voor.' },
  ],
  havo: [
    { areaName: 'Functieheuvel', title: 'Functies', emoji: '⛰️', intro: 'y hangt af van x. Ontdek het verband.' },
    { areaName: 'Vergelijkingenklif', title: 'Vergelijkingen', emoji: '🧗', intro: 'Lineair en steeds lastiger.' },
    { areaName: 'Breukenbaai', title: 'Breuken & machten', emoji: '🌊', intro: 'Breuken, machten en wortels.' },
    { areaName: 'Grafiekenhaven', title: 'Grafieken', emoji: '⚓', intro: 'Lezen, tekenen, interpreteren.' },
    { areaName: 'Kwadratisch kloof', title: 'Kwadratisch', emoji: '🏔️', intro: 'Parabolen en kwadratische vergelijkingen.' },
    { areaName: 'Statistiekstation', title: 'Statistiek', emoji: '📉', intro: 'Gemiddelde, mediaan, spreiding.' },
    { areaName: 'Goniometrie', title: 'Hoeken met sin & cos', emoji: '📐', intro: 'Rechthoekige driehoeken en goniometrie.' },
    { areaName: 'Examenklif', title: 'Alles samen', emoji: '🦉', intro: 'Mix van onderwerpen — examenniveau.' },
  ],
  vwo: [
    { areaName: 'Algebra-arena', title: 'Algebra', emoji: '🏟️', intro: 'Herschrijven, ontbinden, oplossen.' },
    { areaName: 'Functielab', title: 'Functies', emoji: '🔬', intro: 'Dieper in verbanden en grafieken.' },
    { areaName: 'Machtenput', title: 'Machten & wortels', emoji: '⚡', intro: 'Exponenten en wortels onder controle.' },
    { areaName: 'Kwadratisch domein', title: 'Kwadratisch', emoji: '👑', intro: 'Parabolen, discriminant, abc-formule.' },
    { areaName: 'Redeneerfort', title: 'Bewijzen & redeneren', emoji: '🏰', intro: 'Strikte logica en exacte redeneringen.' },
    { areaName: 'Grafiekengraf', title: 'Grafieken', emoji: '🗺️', intro: 'Complexere grafieken en transformaties.' },
    { areaName: 'Calculus voorproef', title: 'Grenzen & hellingen', emoji: '📈', intro: 'Richtingscoëfficiënt en verandering.' },
    { areaName: 'VWO-top', title: 'Eindniveau', emoji: '🦉', intro: 'De zwaarste mix — jij bent er klaar voor.' },
  ],
};

const COLORS = ['#C4784A', '#5B8A72', '#6B7FA8', '#8B6B9E', '#C49A6C', '#4A7C59', '#7A6B5A', '#9B6B8A'];

function generateForTopic(
  level: ClassLevel,
  challengeIndex: number,
  topic: Topic,
  difficulty: 1 | 2 | 3,
  topicOccurrence: number,
  salt = 0,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const id = challengeIdForLevel(level, challengeIndex);
  const s = seed(level, challengeIndex, salt);
  const yr = yearNum(level);
  const band = bandFor(level);
  const scale = band === 'basis' ? 1 : band === 'mavo' ? 1.5 : band === 'havo' ? 2 : 2.5;
  const base = Math.max(2, Math.floor((s % 8) + 2 + yr * scale * 0.3 + topicOccurrence));
  const grade = basisGrade(level);

  if (grade === 6 || grade === 7) {
    return generateBasisForTopic(level, grade, challengeIndex, topic, difficulty, s, topicOccurrence);
  }

  switch (topic) {
    case 'breuken': {
      const n1 = ((s + topicOccurrence * 3 + salt) % 5) + 1;
      const d1 = ((s + topicOccurrence * 2 + salt) % 4) + 2;
      const n2 = ((s >> 3) + topicOccurrence + salt) % 4 + 1;
      const d2 = ((s >> 5) + topicOccurrence + salt) % 3 + 2;
      const num = n1 * d2 + n2 * d1;
      const den = d1 * d2;
      const g = gcd(num, den);
      const simpNum = num / g;
      const simpDen = den / g;
      const answer = decimalAnswer(num, den);
      const question =
        grade === 8
          ? `Wat is ${frac(n1, d1)} + ${frac(n2, d2)}? Geef je antwoord als kommagetal (max. 2 cijfers achter de komma).`
          : `Wat is ${frac(n1, d1)} + ${frac(n2, d2)}? Geef het antwoord als decimaal getal (max. 2 decimalen).`;
      const challenge: ChallengeDefinition = {
        id,
        type: 'number-input',
        topic,
        difficulty,
        starsAvailable: 3,
        question,
        answer,
        hint1: 'Maak de noemers gelijk, tel de tellers op.',
        hint2: `${frac(n1, d1)} + ${frac(n2, d2)} = ${frac(num, den)}`,
        optionalWorkedFirstStep: `Gelijknamig maken: noemer ${d1 * d2}.`,
        explanation: `${frac(n1, d1)} + ${frac(n2, d2)} = ${frac(num, den)} = ${answer}`,
        classLevels: [level],
      };
      const help = helpForBreuken(
        id,
        difficulty,
        frac(n1, d1),
        frac(n2, d2),
        d1 * d2,
        simpNum,
        simpDen,
        frac(num, den),
        answer,
      );
      return { challenge, help };
    }
    case 'vergelijkingen': {
      const a = base + topicOccurrence + salt;
      const b = a + (s % 7) + 3 + topicOccurrence;
      const x = b - a;
      const challenge: ChallengeDefinition = {
        id,
        type: 'number-input',
        topic,
        difficulty,
        starsAvailable: 3,
        question: `Los op: x + ${a} = ${b}. Wat is x?`,
        answer: x,
        hint1: `Haal ${a} naar de andere kant: x = ${b} − ${a}.`,
        hint2: `x = ${b} − ${a}`,
        optionalWorkedFirstStep: `x + ${a} = ${b} → x = ${b} − ${a}`,
        explanation: `x + ${a} = ${b}\nx = ${b} − ${a} = ${x}`,
        classLevels: [level],
      };
      const help = helpForVergelijkingen(id, difficulty, a, b, x);
      return { challenge, help };
    }
    case 'grafieken': {
      const k = ((topicOccurrence * 5 + s + salt) % 9) + 2;
      const x = ((topicOccurrence + s + salt) % 5) + 2;
      const y = k * x;
      const challenge: ChallengeDefinition = {
        id,
        type: 'multiple-choice',
        topic,
        difficulty,
        starsAvailable: 3,
        question: `Een formule is y = ${k}x. Welke tabel hoort daarbij?`,
        answer: 'a',
        answerOptions: [
          { id: 'a', label: `x: 1→${k}, 2→${k * 2}, 3→${k * 3}` },
          { id: 'b', label: `x: 1→${k + 1}, 2→${k + 2}, 3→${k + 3}` },
          { id: 'c', label: `x: 1→1, 2→2, 3→3` },
        ],
        hint1: `Vermenigvuldig elke x met ${k}.`,
        hint2: `Bij x = ${x} hoort y = ${y}.`,
        explanation: `y = ${k}x betekent: y is steeds ${k} keer x.\nBij x = ${x}: y = ${y}.`,
        classLevels: [level],
      };
      const help = helpForGrafieken(id, difficulty, k);
      return { challenge, help };
    }
    case 'verbanden': {
      const p1 = ((topicOccurrence + s + salt) % 3) + 2;
      const p2 = ((topicOccurrence + (s >> 2) + salt) % 4) + 2;
      const given = p1 * (((topicOccurrence + s + salt) % 4) + 2);
      const other = (given / p1) * p2;
      const challenge: ChallengeDefinition = {
        id,
        type: 'number-input',
        topic,
        difficulty,
        starsAvailable: 3,
        question: `Verhouding ${p1}:${p2}. De eerste deelgroep is ${given}. Hoe groot is de tweede?`,
        answer: other,
        hint1: `Deel ${given} door ${p1} om de schaalfactor te vinden.`,
        hint2: `Schaalfactor × ${p2} = ${other}.`,
        explanation: `${given} ÷ ${p1} = ${given / p1}.\n${given / p1} × ${p2} = ${other}.`,
        classLevels: [level],
      };
      const factor = given / p1;
      const help = helpForVerbanden(id, difficulty, p1, p2, given, factor, other);
      return { challenge, help };
    }
    case 'redeneren': {
      const { challenge: redParts, help } = helpForRedeneren(
        id,
        difficulty,
        topicOccurrence * 5 + s + salt,
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
        hint1: 'Lees elke uitspraak apart. “Elke … is …” is vaak te streng.',
        hint2: 'Check elke uitspraak één voor één voordat je kiest.',
        explanation: redParts.explanation,
        classLevels: [level],
      };
      return { challenge, help };
    }
    case 'algebra': {
      const c1 = ((topicOccurrence + s + salt) % 5) + 2;
      const c2 = ((topicOccurrence + (s >> 2) + salt) % 5) + 2;
      const sum = c1 + c2;
      const challenge: ChallengeDefinition = {
        id,
        type: 'multiple-choice',
        topic,
        difficulty,
        starsAvailable: 3,
        question: `Vereenvoudig: ${c1}x + ${c2}x`,
        answer: 'a',
        answerOptions: [
          { id: 'a', label: `${sum}x` },
          { id: 'b', label: `${c1 * c2}x` },
          { id: 'c', label: `${c1 + c2}` },
        ],
        hint1: 'Gelijke termen kun je optellen.',
        hint2: `${c1}x + ${c2}x = (${c1}+${c2})x`,
        explanation: `${c1}x + ${c2}x = ${sum}x`,
        classLevels: [level],
      };
      const help = helpForAlgebra(id, difficulty, c1, c2, sum);
      return { challenge, help };
    }
    case 'formules': {
      const l = base + topicOccurrence + salt;
      const b = ((topicOccurrence + s + salt) % 5) + 3;
      const area = l * b;
      const challenge: ChallengeDefinition = {
        id,
        type: 'number-input',
        topic,
        difficulty,
        starsAvailable: 3,
        question: `Oppervlakte A = lengte × breedte. A = ${area}, lengte = ${l}. Wat is de breedte?`,
        answer: b,
        hint1: 'Deel A door lengte.',
        hint2: `b = ${area} ÷ ${l}`,
        explanation: `b = A ÷ l = ${area} ÷ ${l} = ${b}`,
        classLevels: [level],
      };
      const help = helpForFormules(id, difficulty, area, l, b);
      return { challenge, help };
    }
    case 'machten': {
      const bases = [2, 3, 5, 7];
      const exponents = [2, 3, 4, 5];
      const baseNum = bases[(topicOccurrence + s + salt) % bases.length];
      const exp = Math.min(
        exponents[(topicOccurrence + (s >> 2) + salt) % exponents.length],
        2 + difficulty + 1,
      );
      const answer = baseNum ** exp;
      const challenge: ChallengeDefinition = {
        id,
        type: 'number-input',
        topic,
        difficulty,
        starsAvailable: 3,
        question: `Bereken: ${baseNum}^${exp}`,
        answer,
        hint1: `${baseNum} × ${baseNum}${exp > 2 ? ' × …' : ''}`,
        hint2: `Vermenigvuldig ${baseNum} ${exp} keer met zichzelf.`,
        explanation: `${baseNum}^${exp} = ${answer}`,
        classLevels: [level],
      };
      const help = helpForMachten(id, difficulty, baseNum, exp, answer);
      return { challenge, help };
    }
    case 'kwadratisch': {
      const roots = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      const root = roots[(topicOccurrence * 3 + s + salt) % roots.length];
      const sq = root * root;
      const challenge: ChallengeDefinition = {
        id,
        type: 'number-input',
        topic,
        difficulty,
        starsAvailable: 3,
        question: `Los op: x² = ${sq} (x positief). Wat is x?`,
        answer: root,
        hint1: 'Welk positief getal keer zichzelf geeft ' + sq + '?',
        hint2: `${root} × ${root} = ${sq}`,
        explanation: `x² = ${sq} → x = ${root} (positief).`,
        classLevels: [level],
      };
      const help = helpForKwadratisch(id, difficulty, root, sq);
      return { challenge, help };
    }
    default: {
      return generateForTopic(level, challengeIndex, 'algebra', difficulty, topicOccurrence, salt);
    }
  }
}

function difficultyFor(level: ClassLevel, lessonIndex: number, slot: number): 1 | 2 | 3 {
  const profile = getClassProfile(level);
  const max = profile.maxDifficulty;
  const progress = (lessonIndex * CHALLENGES_PER_LESSON + slot) / (LEVEL_LESSON_COUNT * CHALLENGES_PER_LESSON);
  if (max === 1) return 1;
  if (max === 2) return progress > 0.55 ? 2 : 1;
  if (progress > 0.75) return 3;
  if (progress > 0.35) return 2;
  return 1;
}

export function buildLevelBundle(level: ClassLevel): LevelBundle {
  const profile = getClassProfile(level);
  const label = CLASS_LEVEL_PROFILES[level].label;

  const challenges: ChallengeDefinition[] = [];
  const helpPacks: GuidedHelpPack[] = [];
  const lessons: LessonShell[] = [];
  const part2Lessons: LessonShell[] = [];
  const lessonIds: string[] = [];
  const part2LessonIds: string[] = [];
  const usedQuestions = new Set<string>();
  const topicOccurrence = new Map<Topic, number>();
  const part1Challenges: ChallengeDefinition[] = [];
  const part1HelpById = new Map<string, GuidedHelpPack>();

  for (let li = 1; li <= LEVEL_LESSON_COUNT; li += 1) {
    const lessonId = lessonIdForLevel(level, li);
    lessonIds.push(lessonId);
    const storyShell = loadStoryShell('part1', PART1_STORY_IDS[li - 1]);
    const placements: LessonShell['placements'] = [];

    for (let slot = 0; slot < CHALLENGES_PER_LESSON; slot += 1) {
      const challengeIndex = (li - 1) * CHALLENGES_PER_LESSON + slot + 1;
      const storySlot = part1StorySlot(li, slot);
      const topic =
        part1StoryTopic(li, slot) ??
        profile.topicsUnlocked[(challengeIndex - 1) % profile.topicsUnlocked.length];
      const occurrence = topicOccurrence.get(topic) ?? 0;
      topicOccurrence.set(topic, occurrence + 1);
      const difficulty = difficultyFor(level, li, slot);
      const challengeId = challengeIdForLevel(level, challengeIndex);

      let challenge: ChallengeDefinition | undefined;
      let help: GuidedHelpPack | undefined;

      if (storySlot && 'kind' in storySlot) {
        const storyChallenge = generateStoryChallenge(
          challengeId,
          level,
          li,
          slot,
          difficulty,
          seed(level, challengeIndex),
          storySlot.kind,
        );
        if (storyChallenge) {
          challenge = storyChallenge.challenge;
          help = storyChallenge.help;
          usedQuestions.add(challengeQuestionKey(challenge));
        }
      }

      if (!challenge || !help) {
        for (let salt = 0; salt < 128; salt += 1) {
          const generated = generateForTopic(
            level,
            challengeIndex,
            topic,
            difficulty,
            occurrence + salt,
            salt,
          );
          const key = challengeQuestionKey(generated.challenge);
          if (!usedQuestions.has(key)) {
            usedQuestions.add(key);
            challenge = generated.challenge;
            help = generated.help;
            break;
          }
        }
      }
      if (!challenge || !help) {
        throw new Error(`Could not generate unique question for ${level} #${challengeIndex} (${topic})`);
      }

      const helpIssues = validateHelpPack(help, difficulty);
      if (helpIssues.length) {
        throw new Error(`Help validation failed for ${challenge.id}: ${helpIssues.join('; ')}`);
      }
      challenges.push(challenge);
      helpPacks.push(help);
      part1Challenges[challengeIndex - 1] = challenge;
      part1HelpById.set(challenge.id, help);
      placements.push({
        challengeId: challenge.id,
        optionalStory:
          storyOptionalStory(storyShell, slot) ??
          pick(
            [
              'De Uil fluistert: “Neem je tijd, denk hardop.”',
              'Op het pad ligt een raadsel te wachten.',
              'Nog één stap — jij kunt dit.',
              'Kijk goed naar wat gegeven is.',
              'Welke strategie past hier?',
            ],
            seed(level, challengeIndex),
          ),
        sortOrder: slot,
      });
    }

    lessons.push({
      id: lessonId,
      adventureId: level,
      order: li,
      areaName: storyShell.areaName,
      title: storyShell.title,
      emoji: storyShell.emoji,
      intro: storyShell.intro,
      color: storyShell.color,
      outroStory: storyShell.outroStory,
      placements,
    });
  }

  for (let li = 1; li <= LEVEL_LESSON_COUNT; li += 1) {
    const lessonId = part2LessonIdForLevel(level, li);
    part2LessonIds.push(lessonId);
    const storyShell = loadStoryShell('part2', PART2_STORY_IDS[li - 1]);
    const placements: LessonShell['placements'] = [];

    for (let slot = 0; slot < CHALLENGES_PER_LESSON; slot += 1) {
      const p2Index = (li - 1) * CHALLENGES_PER_LESSON + slot + 1;
      const challengeId = part2ChallengeIdForLevel(level, p2Index);
      const baseDifficulty = difficultyFor(level, li, slot);
      const difficulty = isPart2ReviewSlot(slot)
        ? Math.max(1, baseDifficulty - 1) as 1 | 2 | 3
        : difficultyForPart2(baseDifficulty, profile.maxDifficulty);

      let challenge: ChallengeDefinition;
      let help: GuidedHelpPack;

      if (isPart2ReviewSlot(slot)) {
        const part1Slot = part2ReviewPart1Slot(slot);
        const part1Index = (li - 1) * CHALLENGES_PER_LESSON + part1Slot;
        const source = part1Challenges[part1Index];
        const sourceHelp = part1HelpById.get(source.id);
        if (!source || !sourceHelp) {
          throw new Error(`Missing Deel I source for ${level} p2 L${li} slot ${slot}`);
        }
        challenge = { ...source, id: challengeId, difficulty: Math.min(source.difficulty, difficulty) };
        help = { ...sourceHelp, challengeId };
        placements.push({
          challengeId: challenge.id,
          optionalStory:
            storyOptionalStory(storyShell, slot) ??
            'Vertrouwde pootafdruk — bekend terrein uit Deel I.',
          reviewOfPart1: true,
          sortOrder: slot,
        });
      } else {
        const globalIndex = CHALLENGES_PER_LEVEL + p2Index;
        const baseTopicIndex = (globalIndex - 1) % profile.topicsUnlocked.length;

        let generatedChallenge: ChallengeDefinition | undefined;
        let generatedHelp: GuidedHelpPack | undefined;

        const hardStoryKind = part2HardStoryKind(li, slot);
        if (hardStoryKind) {
          const storyChallenge = generateStoryChallenge(
            challengeId,
            level,
            li,
            slot,
            difficulty,
            seed(level, globalIndex),
            hardStoryKind,
          );
          if (storyChallenge) {
            generatedChallenge = storyChallenge.challenge;
            generatedHelp = storyChallenge.help;
            usedQuestions.add(challengeQuestionKey(storyChallenge.challenge));
          }
        }

        for (let topicOffset = 0; topicOffset < profile.topicsUnlocked.length && !generatedChallenge; topicOffset += 1) {
          const topic =
            profile.topicsUnlocked[(baseTopicIndex + topicOffset) % profile.topicsUnlocked.length];
          const occurrence = topicOccurrence.get(topic) ?? 0;

          for (let salt = 0; salt < 128; salt += 1) {
            const generated = generateForTopic(
              level,
              globalIndex + topicOffset * 97 + salt,
              topic,
              difficulty,
              occurrence + 40 + salt + topicOffset * 11,
              salt,
            );
            const key = challengeQuestionKey(generated.challenge);
            if (!usedQuestions.has(key)) {
              usedQuestions.add(key);
              topicOccurrence.set(topic, occurrence + 1);
              generatedChallenge = { ...generated.challenge, id: challengeId };
              generatedHelp = { ...generated.help, challengeId };
              break;
            }
          }
          if (generatedChallenge && generatedHelp) break;
        }
        if (!generatedChallenge || !generatedHelp) {
          throw new Error(`Could not generate unique Deel II question for ${level} #${p2Index} (${topic})`);
        }

        const helpIssues = validateHelpPack(generatedHelp, difficulty);
        if (helpIssues.length) {
          throw new Error(`Help validation failed for ${challengeId}: ${helpIssues.join('; ')}`);
        }

        challenge = generatedChallenge;
        help = generatedHelp;
        placements.push({
          challengeId: challenge.id,
          optionalStory:
            storyOptionalStory(storyShell, slot) ??
            pick(
              [
                'De Detective fluistert: “Dit is zwaarder — adem in.”',
                'Nieuw terrein in het nachtbos.',
                'Even scherp blijven — jij kunt dit.',
              ],
              seed(level, globalIndex),
            ),
          sortOrder: slot,
        });
      }

      challenges.push(challenge);
      helpPacks.push(help);
    }

    part2Lessons.push({
      id: lessonId,
      adventureId: `${level}-part2`,
      order: li,
      areaName: storyShell.areaName,
      title: storyShell.title,
      emoji: storyShell.emoji,
      intro: storyShell.intro,
      color: storyShell.color,
      outroStory: storyShell.outroStory,
      mapTeaser: storyShell.mapTeaser,
      placements,
    });
  }

  return {
    level,
    manifest: {
      id: level,
      title: 'Wiskunde Wilds',
      subtitle: `${label} — Het Ontwaakte Bos`,
      theme: 'day',
      helpPersonaId: 'uil',
      lessonIds,
      part2LessonIds,
      unlockRuleId: 'always',
    },
    lessons,
    part2Lessons,
    challenges,
    helpPacks,
  };
}

export function buildAllLevelBundles(): LevelBundle[] {
  return CLASS_LEVEL_IDS.map((level) => buildLevelBundle(level));
}
