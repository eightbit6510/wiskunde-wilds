import type { Challenge, Lesson } from '../types';
import { lesson1 } from './lesson1';
import { lesson2 } from './lesson2';
import { lesson3 } from './lesson3';
import { lesson4 } from './lesson4';
import { lesson5 } from './lesson5';
import { lesson6 } from './lesson6';
import { lesson7 } from './lesson7';
import { lesson8 } from './lesson8';
import { lesson1Owl } from './owl/lesson1';
import { lesson2Owl } from './owl/lesson2';
import { lesson3Owl } from './owl/lesson3';
import { lesson4Owl } from './owl/lesson4';
import { lesson5Owl } from './owl/lesson5';
import { lesson6Owl } from './owl/lesson6';
import { lesson7Owl } from './owl/lesson7';
import { lesson8Owl } from './owl/lesson8';
import { withOwlHelp } from './owl/types';
import { part2Lessons, part2SideMissions } from './part2';

const part1Raw: Lesson[] = [
  withOwlHelp(lesson1, lesson1Owl),
  withOwlHelp(lesson2, lesson2Owl),
  withOwlHelp(lesson3, lesson3Owl),
  withOwlHelp(lesson4, lesson4Owl),
  withOwlHelp(lesson5, lesson5Owl),
  withOwlHelp(lesson6, lesson6Owl),
  withOwlHelp(lesson7, lesson7Owl),
  withOwlHelp(lesson8, lesson8Owl),
];

export const part1Lessons: Lesson[] = part1Raw.map((l) => ({
  ...l,
  adventureId: 'part1' as const,
}));

export const part2MainLessons: Lesson[] = part2Lessons.map((l) => ({
  ...l,
  adventureId: 'part2' as const,
}));

export const sideMissionLessons: Lesson[] = part2SideMissions.map((l) => ({
  ...l,
  adventureId: 'side' as const,
}));

/** Part 1 only — backward compatible export name */
export const lessons: Lesson[] = part1Lessons;

/** Everything playable once unlocked */
export const allPlayableLessons: Lesson[] = [
  ...part1Lessons,
  ...part2MainLessons,
  ...sideMissionLessons,
];

export function getLesson(id: string): Lesson | undefined {
  return allPlayableLessons.find((l) => l.id === id);
}

export function challengesMissingOwlHelp(scope: Lesson[] = allPlayableLessons): string[] {
  return scope.flatMap((lesson) =>
    lesson.challenges.filter((c) => !c.owlHelp).map((c) => c.id),
  );
}

/** Pool of easy review-style challenges (flagged or difficulty 1 from part1) */
export function getReviewChallengePool(): Challenge[] {
  const fromPart2 = part2MainLessons.flatMap((l) =>
    l.challenges.filter((c) => c.reviewOfPart1),
  );
  const fromPart1 = part1Lessons.flatMap((l) =>
    l.challenges.filter((c) => c.difficulty === 1).slice(0, 2),
  );
  return [...fromPart2, ...fromPart1];
}

export function getPart2ChallengePool(): Challenge[] {
  return part2MainLessons.flatMap((l) => l.challenges);
}
