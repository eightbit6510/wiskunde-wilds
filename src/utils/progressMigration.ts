import type { ProgressState, Topic, TopicStats } from '../types';
import { isPart1Complete } from './adventureUnlock';
import { reconcileLessonCompletion } from './progressSync';
import { TOPICS, emptyTopicStats } from './storage';

export const PROGRESS_VERSION = 2;

export type ProgressV2 = ProgressState;

/** Migrate older localStorage progress into v2 without losing Part 1 data. */
export function migrateProgress(raw: Partial<ProgressState> & { progressVersion?: number }): ProgressState {
  const topicStats = {} as Record<Topic, TopicStats>;
  for (const topic of TOPICS) {
    topicStats[topic] = {
      ...emptyTopicStats(),
      ...(raw.topicStats?.[topic] ?? {}),
    };
  }

  const completedLessons = [...(raw.completedLessons ?? [])];
  const part1Done = isPart1Complete({ completedLessons });

  const base: ProgressState = {
    adventureStarted: raw.adventureStarted ?? false,
    completedLessons,
    completedChallenges: [...(raw.completedChallenges ?? [])],
    challengeStars: { ...(raw.challengeStars ?? {}) },
    attempts: [...(raw.attempts ?? [])],
    topicStats,
    totalStars: raw.totalStars ?? 0,
    totalXp: raw.totalXp ?? 0,
    challengesSolved: raw.challengesSolved ?? 0,
    sessionStreak: raw.sessionStreak ?? 0,
    bestSessionStreak: raw.bestSessionStreak ?? 0,
    unlockedBadges: [...(raw.unlockedBadges ?? [])],
    lastPlayedAt: raw.lastPlayedAt ?? null,
    owlHelpUsedCount: raw.owlHelpUsedCount ?? 0,
    owlHelpChallenges: [...(raw.owlHelpChallenges ?? [])],
    owlStarsSpent: raw.owlStarsSpent ?? 0,
    owlBonusTried: raw.owlBonusTried ?? 0,
    owlBonusSolved: raw.owlBonusSolved ?? 0,
    progressVersion: PROGRESS_VERSION,
    part2Unlocked: raw.part2Unlocked ?? part1Done,
    part2UnlockSeen: raw.part2UnlockSeen ?? false,
    reviewSolvedCount: raw.reviewSolvedCount ?? 0,
    sideMissionsCompleted: [...(raw.sideMissionsCompleted ?? [])],
    trainingSessionsDone: raw.trainingSessionsDone ?? 0,
    recentFailStreak: raw.recentFailStreak ?? 0,
    preferSuccessMoment: raw.preferSuccessMoment ?? false,
  };

  return reconcileLessonCompletion(base);
}
