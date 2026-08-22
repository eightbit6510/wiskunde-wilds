import type { ClassLevel, ClassLevelProfile } from '../types/content';
import type { Topic } from '../types';

export const CLASS_LEVEL_IDS = [
  'groep-6',
  'groep-7',
  'groep-8',
  'mavo-1',
  'mavo-2',
  'mavo-3',
  'mavo-4',
  'havo-1',
  'havo-2',
  'havo-3',
  'havo-4',
  'havo-5',
  'vwo-1',
  'vwo-2',
  'vwo-3',
  'vwo-4',
  'vwo-5',
  'vwo-6',
] as const satisfies readonly ClassLevel[];

export type ClassLevelId = (typeof CLASS_LEVEL_IDS)[number];

export const CLASS_LEVEL_GROUPS: {
  label: string;
  levels: { value: ClassLevel; label: string }[];
}[] = [
  {
    label: 'Basisschool',
    levels: [
      { value: 'groep-6', label: 'Groep 6' },
      { value: 'groep-7', label: 'Groep 7' },
      { value: 'groep-8', label: 'Groep 8' },
    ],
  },
  {
    label: 'MAVO',
    levels: [
      { value: 'mavo-1', label: 'MAVO 1' },
      { value: 'mavo-2', label: 'MAVO 2' },
      { value: 'mavo-3', label: 'MAVO 3' },
      { value: 'mavo-4', label: 'MAVO 4' },
    ],
  },
  {
    label: 'HAVO',
    levels: [
      { value: 'havo-1', label: 'HAVO 1' },
      { value: 'havo-2', label: 'HAVO 2' },
      { value: 'havo-3', label: 'HAVO 3' },
      { value: 'havo-4', label: 'HAVO 4' },
      { value: 'havo-5', label: 'HAVO 5' },
    ],
  },
  {
    label: 'VWO',
    levels: [
      { value: 'vwo-1', label: 'VWO 1' },
      { value: 'vwo-2', label: 'VWO 2' },
      { value: 'vwo-3', label: 'VWO 3' },
      { value: 'vwo-4', label: 'VWO 4' },
      { value: 'vwo-5', label: 'VWO 5' },
      { value: 'vwo-6', label: 'VWO 6' },
    ],
  },
];

const TOPIC_SETS = {
  /** Basisschool: rekenen PO — geen VO-algebra/vergelijkingen/machten als vrije topics */
  basis6: ['breuken', 'verbanden', 'redeneren', 'algebra', 'grafieken'] as Topic[],
  basis7: ['breuken', 'verbanden', 'redeneren', 'algebra', 'grafieken', 'formules'] as Topic[],
  basis8: ['breuken', 'verbanden', 'redeneren', 'algebra', 'grafieken', 'formules'] as Topic[],
  mavoLow: ['breuken', 'vergelijkingen', 'grafieken', 'verbanden', 'formules', 'redeneren'] as Topic[],
  mavoHigh: ['algebra', 'vergelijkingen', 'breuken', 'grafieken', 'verbanden', 'formules'] as Topic[],
  havoLow: ['algebra', 'vergelijkingen', 'breuken', 'grafieken', 'verbanden', 'formules'] as Topic[],
  havoMid: ['algebra', 'vergelijkingen', 'formules', 'grafieken', 'verbanden', 'machten'] as Topic[],
  havoHigh: ['algebra', 'vergelijkingen', 'kwadratisch', 'grafieken', 'machten', 'verbanden'] as Topic[],
  vwoMid: ['algebra', 'vergelijkingen', 'kwadratisch', 'machten', 'grafieken', 'verbanden'] as Topic[],
  vwoHigh: ['algebra', 'vergelijkingen', 'kwadratisch', 'machten', 'grafieken', 'redeneren'] as Topic[],
};

function profile(
  id: ClassLevel,
  label: string,
  maxDifficulty: 1 | 2 | 3,
  topicsUnlocked: Topic[],
  reviewRatio: number,
): ClassLevelProfile {
  return { id, label, maxDifficulty, topicsUnlocked, reviewRatio };
}

export const CLASS_LEVEL_PROFILES: Record<ClassLevel, ClassLevelProfile> = {
  'groep-6': profile('groep-6', 'Groep 6', 1, TOPIC_SETS.basis6, 0.35),
  'groep-7': profile('groep-7', 'Groep 7', 1, TOPIC_SETS.basis7, 0.3),
  'groep-8': profile('groep-8', 'Groep 8', 2, TOPIC_SETS.basis8, 0.25),
  'mavo-1': profile('mavo-1', 'MAVO 1', 1, TOPIC_SETS.mavoLow, 0.3),
  'mavo-2': profile('mavo-2', 'MAVO 2', 1, TOPIC_SETS.mavoLow, 0.28),
  'mavo-3': profile('mavo-3', 'MAVO 3', 2, TOPIC_SETS.mavoHigh, 0.25),
  'mavo-4': profile('mavo-4', 'MAVO 4', 2, TOPIC_SETS.mavoHigh, 0.22),
  'havo-1': profile('havo-1', 'HAVO 1', 1, TOPIC_SETS.havoLow, 0.28),
  'havo-2': profile('havo-2', 'HAVO 2', 2, TOPIC_SETS.havoLow, 0.25),
  'havo-3': profile('havo-3', 'HAVO 3', 2, TOPIC_SETS.havoMid, 0.22),
  'havo-4': profile('havo-4', 'HAVO 4', 2, TOPIC_SETS.havoMid, 0.2),
  'havo-5': profile('havo-5', 'HAVO 5', 3, TOPIC_SETS.havoHigh, 0.15),
  'vwo-1': profile('vwo-1', 'VWO 1', 1, TOPIC_SETS.havoLow, 0.25),
  'vwo-2': profile('vwo-2', 'VWO 2', 2, TOPIC_SETS.havoMid, 0.22),
  'vwo-3': profile('vwo-3', 'VWO 3', 2, TOPIC_SETS.vwoMid, 0.2),
  'vwo-4': profile('vwo-4', 'VWO 4', 3, TOPIC_SETS.vwoMid, 0.18),
  'vwo-5': profile('vwo-5', 'VWO 5', 3, TOPIC_SETS.vwoHigh, 0.15),
  'vwo-6': profile('vwo-6', 'VWO 6', 3, TOPIC_SETS.vwoHigh, 0.12),
};

/** @deprecated use CLASS_LEVEL_PROFILES */
export const DEFAULT_CLASS_PROFILES = CLASS_LEVEL_PROFILES;

export function isClassLevel(value: string | null | undefined): value is ClassLevel {
  return !!value && (CLASS_LEVEL_IDS as readonly string[]).includes(value);
}

/** Migreer verouderde waarden (bijv. havo-6 → havo-5). */
export function normalizeClassLevel(value: string | null | undefined): ClassLevel | null {
  if (value === 'havo-6') return 'havo-5';
  if (isClassLevel(value)) return value;
  return null;
}

export function getClassProfile(level: ClassLevel): ClassLevelProfile {
  return CLASS_LEVEL_PROFILES[level];
}

export function getClassLevelLabel(level: ClassLevel): string {
  return CLASS_LEVEL_PROFILES[level].label;
}

export function lessonIdForLevel(level: ClassLevel, lessonIndex: number): string {
  return `${level}-l${lessonIndex}`;
}

export function challengeIdForLevel(level: ClassLevel, index: number): string {
  return `${level}-c${String(index).padStart(2, '0')}`;
}

export function part2LessonIdForLevel(level: ClassLevel, lessonIndex: number): string {
  return `${level}-p2-l${lessonIndex}`;
}

export function part2ChallengeIdForLevel(level: ClassLevel, index: number): string {
  return `${level}-p2-c${String(index).padStart(2, '0')}`;
}

export const LEVEL_LESSON_COUNT = 8;
export const CHALLENGES_PER_LESSON = 5;
/** Deel I: 8 × 5 */
export const CHALLENGES_PER_LEVEL = LEVEL_LESSON_COUNT * CHALLENGES_PER_LESSON;
/** Deel II: zelfde omvang */
export const CHALLENGES_PER_PART2 = CHALLENGES_PER_LEVEL;
/** Deel I + Deel II */
export const TOTAL_CHALLENGES_PER_LEVEL = CHALLENGES_PER_LEVEL + CHALLENGES_PER_PART2;
