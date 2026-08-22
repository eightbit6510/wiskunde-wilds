import type { ProgressState, Topic, TopicStats } from '../types';
import { migrateProgress } from './progressMigration';
import { reconcileLessonCompletion } from './progressSync';
import { TOPICS } from './storage';

function unionStrings(a: string[], b: string[]): string[] {
  return [...new Set([...a, ...b])];
}

function maxRecord(a: Record<string, number>, b: Record<string, number>): Record<string, number> {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const out: Record<string, number> = {};
  for (const key of keys) {
    out[key] = Math.max(a[key] ?? 0, b[key] ?? 0);
  }
  return out;
}

function maxTopicStats(a: TopicStats, b: TopicStats): TopicStats {
  return {
    tried: Math.max(a.tried, b.tried),
    firstTryCorrect: Math.max(a.firstTryCorrect, b.firstTryCorrect),
    withHintCorrect: Math.max(a.withHintCorrect, b.withHintCorrect),
    wrongAttempts: Math.max(a.wrongAttempts, b.wrongAttempts),
  };
}

function pickNewerIso(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return Date.parse(a) >= Date.parse(b) ? a : b;
}

/** Combine local and remote progress without losing completions or stars. */
export function mergeProgressStates(local: ProgressState, remote: ProgressState): ProgressState {
  const topicStats = {} as Record<Topic, TopicStats>;
  for (const topic of TOPICS) {
    topicStats[topic] = maxTopicStats(local.topicStats[topic], remote.topicStats[topic]);
  }

  const attempts = local.attempts.length >= remote.attempts.length ? local.attempts : remote.attempts;

  return reconcileLessonCompletion(
    migrateProgress({
      ...local,
      adventureStarted: local.adventureStarted || remote.adventureStarted,
      completedLessons: unionStrings(local.completedLessons, remote.completedLessons),
      completedChallenges: unionStrings(local.completedChallenges, remote.completedChallenges),
      challengeStars: maxRecord(local.challengeStars, remote.challengeStars),
      attempts,
      topicStats,
      totalStars: Math.max(local.totalStars, remote.totalStars),
      totalXp: Math.max(local.totalXp, remote.totalXp),
      challengesSolved: Math.max(local.challengesSolved, remote.challengesSolved),
      sessionStreak: Math.max(local.sessionStreak, remote.sessionStreak),
      bestSessionStreak: Math.max(local.bestSessionStreak, remote.bestSessionStreak),
      unlockedBadges: unionStrings(local.unlockedBadges, remote.unlockedBadges),
      lastPlayedAt: pickNewerIso(local.lastPlayedAt, remote.lastPlayedAt),
      owlHelpUsedCount: Math.max(local.owlHelpUsedCount, remote.owlHelpUsedCount),
      owlHelpChallenges: unionStrings(local.owlHelpChallenges, remote.owlHelpChallenges),
      owlStarsSpent: Math.max(local.owlStarsSpent, remote.owlStarsSpent),
      owlBonusTried: Math.max(local.owlBonusTried, remote.owlBonusTried),
      owlBonusSolved: Math.max(local.owlBonusSolved, remote.owlBonusSolved),
      guidedHelpUsedCount: Math.max(local.guidedHelpUsedCount, remote.guidedHelpUsedCount),
      guidedHelpChallenges: unionStrings(local.guidedHelpChallenges, remote.guidedHelpChallenges),
      guidedStarsSpent: Math.max(local.guidedStarsSpent, remote.guidedStarsSpent),
      guidedBonusTried: Math.max(local.guidedBonusTried, remote.guidedBonusTried),
      guidedBonusSolved: Math.max(local.guidedBonusSolved, remote.guidedBonusSolved),
      part2Unlocked: local.part2Unlocked || remote.part2Unlocked,
      part2UnlockSeen: local.part2UnlockSeen || remote.part2UnlockSeen,
      reviewSolvedCount: Math.max(local.reviewSolvedCount, remote.reviewSolvedCount),
      sideMissionsCompleted: unionStrings(local.sideMissionsCompleted, remote.sideMissionsCompleted),
      trainingSessionsDone: Math.max(local.trainingSessionsDone, remote.trainingSessionsDone),
      recentFailStreak: Math.min(local.recentFailStreak, remote.recentFailStreak),
      preferSuccessMoment: local.preferSuccessMoment || remote.preferSuccessMoment,
    }),
  );
}

/** Pick merged progress after login — remote timestamp breaks ties toward cloud. */
export function resolveProgressOnLogin(
  local: ProgressState,
  remote: Partial<ProgressState>,
  remoteUpdatedAt: string | null,
): ProgressState {
  const remoteFull = migrateProgress(remote);

  if (!remoteUpdatedAt) {
    return mergeProgressStates(local, remoteFull);
  }

  const localTime = local.lastPlayedAt ? Date.parse(local.lastPlayedAt) : 0;
  const remoteTime = Date.parse(remoteUpdatedAt);

  if (remoteTime > localTime) {
    return mergeProgressStates(remoteFull, local);
  }

  return mergeProgressStates(local, remoteFull);
}
