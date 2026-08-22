import type { Challenge, Lesson } from '../types';
import { loadPart1LessonsFromContent } from '../content/loader';
import { part2Lessons, part2SideMissions } from './part2';

const part1Raw: Lesson[] = loadPart1LessonsFromContent();

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
