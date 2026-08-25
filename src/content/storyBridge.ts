/**
 * Koppel legacy bos-verhaal aan jaargroep-sommen.
 * Deel I: ingebakken in gegenereerde level-lessen.
 * Deel II + zijpaden: story-shell + hergebruikte jaargroep-sommen met unieke IDs.
 */
import type { ClassLevel, LessonShell } from '../types/content';
import type { Challenge, Lesson } from '../types';
import {
  loadLessonsForClassLevel,
  loadLevelLessonFromContent,
  loadPart2LessonsForClassLevel as loadPart2FromContent,
} from './levelLoader';
import {
  getStoryLessonShell,
  PART1_STORY_IDS,
  PART2_STORY_IDS,
  SIDE_STORY_IDS,
  storyOptionalStoryFromShell,
} from './storyShells';

export { PART1_STORY_IDS, PART2_STORY_IDS, SIDE_STORY_IDS };

export function storyLessonIdForPart1Slot(lessonOrder: number): string {
  return PART1_STORY_IDS[lessonOrder - 1] ?? PART1_STORY_IDS[0];
}

function cloneChallengeForArc(
  source: Challenge,
  newId: string,
  optionalStory?: string,
  reviewOfPart1 = false,
): Challenge {
  return {
    ...source,
    id: newId,
    optionalStory: optionalStory ?? source.optionalStory,
    reviewOfPart1: reviewOfPart1 || source.reviewOfPart1,
  };
}

function buildBridgedLesson(input: {
  level: ClassLevel;
  lessonId: string;
  storyShell: LessonShell;
  order: number;
  adventureId: string;
  storyLessonId: string;
  storyArc: 'part2' | 'side';
  challenges: Challenge[];
}): Lesson {
  return {
    id: input.lessonId,
    order: input.order,
    areaName: input.storyShell.areaName,
    title: input.storyShell.title,
    emoji: input.storyShell.emoji,
    intro: input.storyShell.intro,
    color: input.storyShell.color,
    outroStory: input.storyShell.outroStory,
    mapTeaser: input.storyShell.mapTeaser,
    challenges: input.challenges,
    adventureId: input.adventureId,
    storyLessonId: input.storyLessonId,
    storyArc: input.storyArc,
  };
}

function part1ChallengePool(level: ClassLevel): Challenge[] {
  return loadLessonsForClassLevel(level).flatMap((lesson) => lesson.challenges);
}

export function enrichPart1Lesson(lesson: Lesson, level: ClassLevel): Lesson {
  const storyLessonId = storyLessonIdForPart1Slot(lesson.order);
  return {
    ...lesson,
    adventureId: level,
    storyLessonId,
    storyArc: 'part1',
  };
}

export function loadPart1LessonsForClassLevel(level: ClassLevel): Lesson[] {
  return loadLessonsForClassLevel(level).map((lesson) => enrichPart1Lesson(lesson, level));
}

export function enrichPart2Lesson(lesson: Lesson, _level: ClassLevel): Lesson {
  const storyLessonId = PART2_STORY_IDS[lesson.order - 1] ?? PART2_STORY_IDS[0];
  return {
    ...lesson,
    adventureId: 'part2',
    storyLessonId,
    storyArc: 'part2',
  };
}

export function loadPart2LessonsForClassLevel(level: ClassLevel): Lesson[] {
  return loadPart2FromContent(level).map((lesson) => enrichPart2Lesson(lesson, level));
}

export function loadSideMissionsForClassLevel(level: ClassLevel): Lesson[] {
  const pool = part1ChallengePool(level);
  if (pool.length === 0) return [];

  return SIDE_STORY_IDS.map((storyId, missionIndex) => {
    const storyShell = getStoryLessonShell('side', storyId);
    if (!storyShell) {
      throw new Error(`Missing side story shell "${storyId}"`);
    }

    const slotCount = storyShell.placements.length || 3;
    const lessonId = `${level}-zij-${missionIndex + 1}`;
    const challenges = Array.from({ length: slotCount }, (_, slot) => {
      const poolIndex = (missionIndex * 3 + slot + 10) % pool.length;
      const source = pool[poolIndex];
      const challengeId = `${level}-zij-c${String(missionIndex * 3 + slot + 1).padStart(2, '0')}`;
      return cloneChallengeForArc(
        source,
        challengeId,
        storyOptionalStoryFromShell(storyShell, slot),
      );
    });

    return buildBridgedLesson({
      level,
      lessonId,
      storyShell,
      order: 100 + missionIndex + 1,
      adventureId: 'side',
      storyLessonId: storyId,
      storyArc: 'side',
      challenges,
    });
  });
}

export function loadBridgedLesson(id: string, level: ClassLevel | null): Lesson | undefined {
  if (!level) return undefined;

  const part2 = loadPart2LessonsForClassLevel(level).find((lesson) => lesson.id === id);
  if (part2) return part2;

  const part1 = loadLevelLessonFromContent(id);
  if (part1) {
    return enrichPart1Lesson({ ...part1, adventureId: level }, level);
  }

  const side = loadSideMissionsForClassLevel(level).find((lesson) => lesson.id === id);
  if (side) return side;

  return undefined;
}

export function isSterrentempelLesson(lesson: Pick<Lesson, 'storyLessonId' | 'id'>): boolean {
  return lesson.storyLessonId === 'sterrentempel' || lesson.id === 'sterrentempel';
}

export function isPart1CompleteForLevel(
  level: ClassLevel,
  completedLessons: string[],
): boolean {
  return completedLessons.includes(`${level}-l8`);
}
