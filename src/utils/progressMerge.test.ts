import { describe, expect, it } from 'vitest';
import { createEmptyProgress } from './storage';
import { mergeProgressStates, resolveProgressOnLogin } from './progressMerge';

describe('progressMerge', () => {
  it('unions completed challenges and keeps best stars', () => {
    const local = createEmptyProgress();
    local.completedChallenges = ['a'];
    local.challengeStars = { a: 2 };
    local.totalStars = 2;

    const remote = createEmptyProgress();
    remote.completedChallenges = ['b'];
    remote.challengeStars = { b: 3 };
    remote.totalStars = 3;

    const merged = mergeProgressStates(local, remote);
    expect(merged.completedChallenges.sort()).toEqual(['a', 'b']);
    expect(merged.challengeStars).toEqual({ a: 2, b: 3 });
    expect(merged.totalStars).toBe(3);
  });

  it('prefers remote base when cloud updated_at is newer', () => {
    const local = createEmptyProgress();
    local.lastPlayedAt = '2024-01-01T10:00:00.000Z';
    local.completedChallenges = ['local-only'];

    const remote = createEmptyProgress();
    remote.lastPlayedAt = '2024-06-01T10:00:00.000Z';
    remote.completedChallenges = ['remote-only'];

    const merged = resolveProgressOnLogin(local, remote, '2024-06-01T12:00:00.000Z');
    expect(merged.completedChallenges.sort()).toEqual(['local-only', 'remote-only']);
  });
});
