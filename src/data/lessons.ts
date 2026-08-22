import type { Challenge, Lesson } from '../types';
import type { ClassLevel } from '../types/content';
import {
  loadLessonsForClassLevel,
  loadLevelLessonFromContent,
  LEVEL_CONTENT_IDS,
} from '../content/levelLoader';
import {
  loadPart1LessonsFromContent,
  loadPart2LessonsFromContent,
  loadSideMissionsFromContent,
} from '../content/loader';
import { isClassLevel } from '../content/classLevels';

/** Legacy bos content — alleen tests/backup */
const legacyPart1 = loadPart1LessonsFromContent().map((l) => ({
  ...l,
  adventureId: 'part1' as const,
}));

const legacyPart2 = loadPart2LessonsFromContent().map((l) => ({
  ...l,
  adventureId: 'part2' as const,
}));

const legacySide = loadSideMissionsFromContent().map((l) => ({
  ...l,
  adventureId: 'side' as const,
}));

export const legacyAllLessons: Lesson[] = [...legacyPart1, ...legacyPart2, ...legacySide];

/** Huidige actieve jaargroep-lessen (default groep-8 als fallback voor dev) */
export function getLessonsForClassLevel(level: ClassLevel): Lesson[] {
  return loadLessonsForClassLevel(level);
}

/** Default playable lessons when no class level — empty until user picks */
export function getPlayableLessons(classLevel: ClassLevel | null): Lesson[] {
  if (classLevel && isClassLevel(classLevel) && LEVEL_CONTENT_IDS.includes(classLevel)) {
    return getLessonsForClassLevel(classLevel);
  }
  return [];
}

export function getLesson(id: string, classLevel: ClassLevel | null): Lesson | undefined {
  const fromLevel = loadLevelLessonFromContent(id);
  if (fromLevel) {
    return { ...fromLevel, adventureId: classLevel ?? id.split('-')[0] ?? 'level' };
  }
  return legacyAllLessons.find((l) => l.id === id);
}

export function getTrainingChallengePool(classLevel: ClassLevel | null): Challenge[] {
  const lessons = getPlayableLessons(classLevel);
  return lessons.flatMap((l) => l.challenges);
}

export function getReviewChallengePool(classLevel: ClassLevel | null): Challenge[] {
  const pool = getTrainingChallengePool(classLevel);
  return pool.filter((c) => c.difficulty === 1).slice(0, Math.max(8, Math.floor(pool.length * 0.25)));
}

/** @deprecated use getPlayableLessons */
export const allPlayableLessons: Lesson[] = legacyAllLessons;

/** @deprecated */
export const part1Lessons = legacyPart1;
/** @deprecated */
export const part2MainLessons = legacyPart2;
/** @deprecated */
export const sideMissionLessons = legacySide;
/** @deprecated */
export const lessons = legacyPart1;

export function challengesMissingOwlHelp(scope: Lesson[]): string[] {
  return scope.flatMap((lesson) =>
    lesson.challenges.filter((c) => !c.owlHelp).map((c) => c.id),
  );
}
