import { describe, expect, it } from 'vitest';
import {
  isAdventureUnlocked,
  isPart1Complete,
  PART1_LESSON_IDS,
} from './adventureUnlock';
import { migrateProgress } from './progressMigration';
import { reconcileLessonCompletion } from './progressSync';
import {
  buildTrainingSession,
  pickReviewChallenge,
  shouldPreferSuccessMoment,
} from './mastery';
import { createEmptyProgress } from './storage';
import type { Challenge } from '../types';
import { part1Lessons } from '../data/lessons';

describe('adventure unlock', () => {
  it('locks part 2 when part 1 is incomplete', () => {
    const progress = createEmptyProgress();
    progress.completedLessons = PART1_LESSON_IDS.slice(0, 6) as unknown as string[];
    expect(isPart1Complete(progress)).toBe(false);
    expect(isAdventureUnlocked('part2', progress)).toBe(false);
  });

  it('unlocks part 2 when all part 1 lessons are completed', () => {
    const progress = createEmptyProgress();
    progress.completedLessons = [...PART1_LESSON_IDS];
    expect(isPart1Complete(progress)).toBe(true);
    expect(isAdventureUnlocked('part2', progress)).toBe(true);
  });

  it('keeps part 2 unlocked via flag even if flag is the only signal', () => {
    const progress = createEmptyProgress();
    progress.part2Unlocked = true;
    expect(isAdventureUnlocked('part2', progress)).toBe(true);
  });

  it('reconciles part2 unlock from fully solved part1 challenges', () => {
    const progress = createEmptyProgress();
    progress.completedChallenges = part1Lessons.flatMap((l) => l.challenges.map((c) => c.id));
    const synced = reconcileLessonCompletion(progress);
    expect(isPart1Complete(synced)).toBe(true);
    expect(synced.part2Unlocked).toBe(true);
    expect(synced.completedLessons).toEqual(expect.arrayContaining([...PART1_LESSON_IDS]));
  });
});

describe('progress migration', () => {
  it('preserves part 1 progress and sets defaults for part 2 fields', () => {
    const migrated = migrateProgress({
      completedLessons: ['vossenpad', 'wolvenkluis'],
      completedChallenges: ['l1-c1'],
      totalStars: 12,
      totalXp: 100,
      challengesSolved: 3,
    });
    expect(migrated.completedLessons).toEqual(['vossenpad', 'wolvenkluis']);
    expect(migrated.completedChallenges).toEqual(['l1-c1']);
    expect(migrated.totalStars).toBe(12);
    expect(migrated.progressVersion).toBe(3);
    expect(migrated.part2Unlocked).toBe(false);
    expect(migrated.reviewSolvedCount).toBe(0);
  });

  it('auto-unlocks part 2 for players who already finished part 1', () => {
    const migrated = migrateProgress({
      completedLessons: [...PART1_LESSON_IDS],
      totalStars: 40,
    });
    expect(migrated.part2Unlocked).toBe(true);
    expect(migrated.part2UnlockSeen).toBe(false);
  });

  it('keeps unlock after remigration (refresh simulation)', () => {
    const first = migrateProgress({
      completedLessons: [...PART1_LESSON_IDS],
      part2Unlocked: true,
      part2UnlockSeen: true,
    });
    const second = migrateProgress(first);
    expect(second.part2Unlocked).toBe(true);
    expect(second.part2UnlockSeen).toBe(true);
    expect(second.completedLessons).toEqual([...PART1_LESSON_IDS]);
  });
});

describe('successMomentScheduler / review picker', () => {
  const pool: Challenge[] = [
    {
      id: 'r1',
      type: 'number-input',
      topic: 'vergelijkingen',
      difficulty: 1,
      starsAvailable: 3,
      question: '2x=4',
      answer: 2,
      hint1: 'deel',
      hint2: 'x=2',
      explanation: 'x=2',
      reviewOfPart1: true,
    },
    {
      id: 'r2',
      type: 'number-input',
      topic: 'breuken',
      difficulty: 1,
      starsAvailable: 3,
      question: '1/2 + 1/2',
      answer: 1,
      hint1: 'tel',
      hint2: '1',
      explanation: '1',
      reviewOfPart1: true,
    },
  ];

  it('flags success moment after consecutive fails', () => {
    const p = createEmptyProgress();
    p.recentFailStreak = 2;
    expect(shouldPreferSuccessMoment(p)).toBe(true);
  });

  it('picks a deterministic review challenge', () => {
    const p = createEmptyProgress();
    p.challengesSolved = 4;
    const a = pickReviewChallenge(pool, p);
    const b = pickReviewChallenge(pool, p);
    expect(a?.id).toBe(b?.id);
    expect(a).toBeDefined();
  });

  it('builds a training session of up to 5 questions', () => {
    const p = createEmptyProgress();
    const session = buildTrainingSession(pool, pool, pool, p);
    expect(session.length).toBeGreaterThan(0);
    expect(session.length).toBeLessThanOrEqual(5);
  });
});
