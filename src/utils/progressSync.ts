import type { Lesson } from '../types';
import { legacyAllLessons, part1Lessons } from '../data/lessons';
import type { ProgressState } from '../types';
import { isPart1Complete, PART1_LESSON_IDS } from './adventureUnlock';

export function isChallengeComplete(
  progress: Pick<ProgressState, 'completedChallenges'>,
  challengeId: string,
  pendingIds: readonly string[] = [],
): boolean {
  return (
    progress.completedChallenges.includes(challengeId) || pendingIds.includes(challengeId)
  );
}

export function isLessonChallengesComplete(
  lesson: Pick<Lesson, 'challenges'>,
  progress: Pick<ProgressState, 'completedChallenges'>,
  pendingIds: readonly string[] = [],
): boolean {
  return lesson.challenges.every((c) => isChallengeComplete(progress, c.id, pendingIds));
}

/** Repair progress gaps: attempts → completedChallenges/stars, then lesson flags. */
export function reconcileLessonCompletion(
  progress: ProgressState,
  playableLessons: Lesson[] = legacyAllLessons,
): ProgressState {
  const completedChallenges = [...progress.completedChallenges];
  const challengeStars = { ...progress.challengeStars };
  let changed = false;

  for (const attempt of progress.attempts) {
    if (!attempt.correct || !attempt.challengeId) continue;
    if (!completedChallenges.includes(attempt.challengeId)) {
      completedChallenges.push(attempt.challengeId);
      changed = true;
    }
    const earned = Math.max(1, attempt.starsEarned ?? 1);
    const prev = challengeStars[attempt.challengeId] ?? 0;
    if (earned > prev) {
      challengeStars[attempt.challengeId] = earned;
      changed = true;
    } else if (prev < 1) {
      challengeStars[attempt.challengeId] = earned;
      changed = true;
    }
  }

  for (const id of completedChallenges) {
    if ((challengeStars[id] ?? 0) < 1) {
      challengeStars[id] = 1;
      changed = true;
    }
  }

  const completedLessons = [...progress.completedLessons];

  for (const lesson of playableLessons) {
    if (completedLessons.includes(lesson.id)) continue;
    const allDone = lesson.challenges.every((c) => completedChallenges.includes(c.id));
    if (allDone && lesson.challenges.length > 0) {
      completedLessons.push(lesson.id);
      changed = true;
    }
  }

  const part2Unlocked =
    progress.part2Unlocked || isPart1Complete({ completedLessons });

  if (
    !changed &&
    part2Unlocked === progress.part2Unlocked &&
    completedChallenges.length === progress.completedChallenges.length
  ) {
    return progress;
  }

  return {
    ...progress,
    completedChallenges,
    challengeStars,
    completedLessons,
    part2Unlocked,
  };
}

export function isLessonFullyComplete(
  lessonId: string,
  progress: Pick<ProgressState, 'completedChallenges' | 'completedLessons'>,
  playableLessons: Lesson[] = legacyAllLessons,
): boolean {
  if (progress.completedLessons.includes(lessonId)) return true;
  const lesson = playableLessons.find((l) => l.id === lessonId);
  if (!lesson) return false;
  return lesson.challenges.every((c) => progress.completedChallenges.includes(c.id));
}

export function incompletePart1LessonIds(
  progress: Pick<ProgressState, 'completedChallenges' | 'completedLessons'>,
): string[] {
  return PART1_LESSON_IDS.filter((id) => !isLessonFullyComplete(id, progress));
}

export function part1LessonCompletionSummary(
  progress: Pick<ProgressState, 'completedChallenges' | 'completedLessons'>,
  lessons: Lesson[] = part1Lessons,
): { id: string; areaName: string; done: number; total: number; complete: boolean }[] {
  return lessons.map((lesson) => {
    const done = lesson.challenges.filter((c) =>
      progress.completedChallenges.includes(c.id),
    ).length;
    return {
      id: lesson.id,
      areaName: lesson.areaName,
      done,
      total: lesson.challenges.length,
      complete: done >= lesson.challenges.length,
    };
  });
}
