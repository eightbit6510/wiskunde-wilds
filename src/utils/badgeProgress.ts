import type { ProgressState } from '../types';
import { PART1_STORY_IDS, PART2_STORY_IDS } from '../content/storyShells';

function part1LessonSuffix(storyId: string): string | null {
  const slot = PART1_STORY_IDS.indexOf(storyId as (typeof PART1_STORY_IDS)[number]);
  if (slot < 0) return null;
  return `-l${slot + 1}`;
}

function part2LessonSuffix(storyId: string): string | null {
  const slot = PART2_STORY_IDS.indexOf(storyId as (typeof PART2_STORY_IDS)[number]);
  if (slot < 0) return null;
  return `-p2-l${slot + 1}`;
}

/** Voltooid via legacy id (vossenpad) of jaargroep-less (groep-8-l1). */
export function isStoryLessonComplete(
  progress: Pick<ProgressState, 'completedLessons'>,
  storyId: string,
  arc: 'part1' | 'part2' = 'part1',
): boolean {
  if (progress.completedLessons.includes(storyId)) return true;
  const suffix = arc === 'part1' ? part1LessonSuffix(storyId) : part2LessonSuffix(storyId);
  if (!suffix) return false;
  return progress.completedLessons.some((id) => id.endsWith(suffix));
}

export function allPart2StoriesComplete(
  progress: Pick<ProgressState, 'completedLessons'>,
): boolean {
  return PART2_STORY_IDS.every((storyId) => isStoryLessonComplete(progress, storyId, 'part2'));
}

/** Sterren in één Deel I-verhaalgebied (legacy l1-… of jaargroep *-c01…c05). */
export function starsInPart1StoryLesson(
  progress: Pick<ProgressState, 'challengeStars'>,
  storyId: string,
): number {
  const slot = PART1_STORY_IDS.indexOf(storyId as (typeof PART1_STORY_IDS)[number]);
  if (slot < 0) return 0;

  const legacyPrefix = `l${slot + 1}-`;
  let total = 0;
  for (const [id, stars] of Object.entries(progress.challengeStars)) {
    if (id.startsWith(legacyPrefix)) total += stars;
  }

  const startNum = slot * 5 + 1;
  for (let n = startNum; n < startNum + 5; n += 1) {
    const suffix = `-c${String(n).padStart(2, '0')}`;
    for (const [id, stars] of Object.entries(progress.challengeStars)) {
      if (id.endsWith(suffix)) total += stars;
    }
  }

  return total;
}
