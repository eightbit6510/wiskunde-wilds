import type { ProgressState } from '../types';

/** Part 1 lesson ids — completing all unlocks Part 2 */
export const PART1_LESSON_IDS = [
  'vossenpad',
  'wolvenkluis',
  'lynx',
  'konijnenhol',
  'uilenlab',
  'bergmissie',
  'maanlicht',
  'sterrentempel',
] as const;

export const PART2_LESSON_IDS = [
  'schaduwgrot',
  'ravenpad',
  'rivier',
  'paraboolvallei',
  'observatorium',
  'runenruines',
  'doolhof',
  'nachtmissie',
] as const;

export type AdventureId = 'part1' | 'part2';

export interface AdventureMeta {
  id: AdventureId;
  title: string;
  subtitle: string;
  theme: 'day' | 'night';
  lessonIds: readonly string[];
}

export const ADVENTURES: AdventureMeta[] = [
  {
    id: 'part1',
    title: 'Wiskunde Wilds',
    subtitle: 'Het Ontwaakte Bos',
    theme: 'day',
    lessonIds: PART1_LESSON_IDS,
  },
  {
    id: 'part2',
    title: 'Wiskunde Wilds II',
    subtitle: 'Het Verborgen Gebied',
    theme: 'night',
    lessonIds: PART2_LESSON_IDS,
  },
];

export function isPart1Complete(progress: Pick<ProgressState, 'completedLessons'>): boolean {
  if (PART1_LESSON_IDS.every((id) => progress.completedLessons.includes(id))) {
    return true;
  }
  return progress.completedLessons.some((id) => /-(l8)$/.test(id));
}

export function part1CompletedCount(progress: Pick<ProgressState, 'completedLessons'>): number {
  return PART1_LESSON_IDS.filter((id) => progress.completedLessons.includes(id)).length;
}

export function isAdventureUnlocked(
  adventureId: AdventureId,
  progress: Pick<ProgressState, 'completedLessons' | 'part2Unlocked'>,
): boolean {
  if (adventureId === 'part1') return true;
  return !!progress.part2Unlocked || isPart1Complete(progress);
}

export function getAdventureForLesson(lessonId: string): AdventureId {
  if ((PART2_LESSON_IDS as readonly string[]).includes(lessonId)) return 'part2';
  if (lessonId.includes('-p2-')) return 'part2';
  if (lessonId.includes('-zij-')) return 'part2';
  return 'part1';
}
