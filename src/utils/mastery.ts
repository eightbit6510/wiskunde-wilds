import type { Challenge, Topic } from '../types';
import type { ProgressState } from '../types';

/** Simple mastery score 0..1 from topic stats (not shown as a grade). */
export function topicMastery(stats: {
  tried: number;
  firstTryCorrect: number;
  withHintCorrect: number;
  wrongAttempts: number;
}): number {
  if (stats.tried === 0) return 0.35; // unknown → mild priority for review
  const points = stats.firstTryCorrect * 3 + stats.withHintCorrect * 1.5;
  const denom = Math.max(stats.tried * 3, points + stats.wrongAttempts);
  return Math.min(1, Math.max(0, points / denom));
}

export function weakestTopics(progress: ProgressState, n = 3): Topic[] {
  return (Object.entries(progress.topicStats) as [Topic, (typeof progress.topicStats)[Topic]][])
    .map(([topic, stats]) => ({ topic, m: topicMastery(stats) }))
    .sort((a, b) => a.m - b.m)
    .slice(0, n)
    .map((x) => x.topic);
}

/** Prefer a success/review moment after struggles or hard clears. */
export function shouldPreferSuccessMoment(progress: ProgressState): boolean {
  return progress.preferSuccessMoment || progress.recentFailStreak >= 2;
}

/** Alias used by the success-moment scheduler. */
export const successMomentScheduler = shouldPreferSuccessMoment;

export function pickReviewChallenge(
  pool: Challenge[],
  progress: ProgressState,
  excludeIds: string[] = [],
): Challenge | undefined {
  const available = pool.filter((c) => !excludeIds.includes(c.id));
  if (!available.length) return undefined;

  const weak = new Set(weakestTopics(progress, 4));
  const weakOnes = available.filter((c) => weak.has(c.topic));
  const candidates = weakOnes.length ? weakOnes : available;
  // Deterministic pick from progress entropy
  const seed =
    progress.challengesSolved +
    progress.reviewSolvedCount * 7 +
    progress.completedChallenges.length;
  return candidates[Math.abs(seed) % candidates.length];
}

export function buildTrainingSession(
  reviewPool: Challenge[],
  currentPool: Challenge[],
  hardPool: Challenge[],
  progress: ProgressState,
): Challenge[] {
  const picked: Challenge[] = [];
  const used: string[] = [];

  for (let i = 0; i < 2; i++) {
    const r = pickReviewChallenge(reviewPool, progress, used);
    if (r) {
      picked.push(r);
      used.push(r.id);
    }
  }
  for (let i = 0; i < 2; i++) {
    const pool = currentPool.filter((c) => !used.includes(c.id));
    if (!pool.length) break;
    const seed = progress.totalXp + i * 13;
    const c = pool[Math.abs(seed) % pool.length];
    picked.push(c);
    used.push(c.id);
  }
  const hard = hardPool.filter((c) => !used.includes(c.id));
  if (hard.length) {
    const seed = progress.challengesSolved + 99;
    picked.push(hard[Math.abs(seed) % hard.length]);
  }

  while (picked.length < 5) {
    const r = pickReviewChallenge([...reviewPool, ...currentPool], progress, used);
    if (!r) break;
    picked.push(r);
    used.push(r.id);
  }
  return picked.slice(0, 5);
}
