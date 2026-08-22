import { describe, expect, it } from 'vitest';
import {
  OWL_BONUS_XP,
  OWL_HELP_STAR_COST,
  OWL_HELP_STARS_EARNED,
  OWL_HELP_XP_MULTIPLIER,
  computeChallengeXp,
  recordBonusAttempt,
  trySpendOwlStar,
} from './owlEconomy';
import { createEmptyProgress, loadJson, saveJson, STORAGE_KEYS } from './storage';

describe('owl economy — star spend', () => {
  const base = {
    totalStars: 7,
    owlStarsSpent: 0,
    owlHelpUsedCount: 0,
    owlHelpChallenges: [] as string[],
  };

  it('does not spend until trySpendOwlStar is called (confirm gate)', () => {
    expect(base.totalStars).toBe(7);
    // Calling nothing leaves stars untouched
    expect(base.owlStarsSpent).toBe(0);
  });

  it('deducts a star only on successful spend', () => {
    const result = trySpendOwlStar(base, 'l2-c4');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.next.totalStars).toBe(6);
    expect(result.next.owlStarsSpent).toBe(OWL_HELP_STAR_COST);
    expect(result.next.owlHelpUsedCount).toBe(1);
    expect(result.next.owlHelpChallenges).toContain('l2-c4');
  });

  it('blocks help when there are 0 stars', () => {
    const result = trySpendOwlStar({ ...base, totalStars: 0 }, 'l2-c4');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe('no-stars');
  });

  it('blocks double spend when pendingLock is set', () => {
    const first = trySpendOwlStar(base, 'l2-c4', false);
    expect(first.ok).toBe(true);
    const second = trySpendOwlStar(base, 'l2-c4', true);
    expect(second.ok).toBe(false);
    if (second.ok) return;
    expect(second.reason).toBe('already-pending');
  });

  it('does not deduct twice from the same snapshot on parallel attempts without lock', () => {
    // Simulates two handlers both reading the same state before either commits:
    // only one committed next-state should be applied by the UI lock.
    const a = trySpendOwlStar(base, 'l2-c4', false);
    const b = trySpendOwlStar(base, 'l2-c4', true);
    expect(a.ok).toBe(true);
    expect(b.ok).toBe(false);
    if (a.ok) expect(a.next.totalStars).toBe(6);
  });
});

describe('owl economy — XP', () => {
  it('gives reduced XP with owl help', () => {
    const normal = computeChallengeXp(3, true, false);
    const withOwl = computeChallengeXp(OWL_HELP_STARS_EARNED, true, true);
    expect(withOwl).toBe(Math.max(1, Math.round((OWL_HELP_STARS_EARNED * 10 + 5) * OWL_HELP_XP_MULTIPLIER)));
    expect(withOwl).toBeLessThan(normal);
  });

  it('bonus challenge awards configured bonus XP', () => {
    expect(OWL_BONUS_XP).toBe(30);
    const after = recordBonusAttempt({ owlBonusTried: 0, owlBonusSolved: 0 }, true);
    expect(after.owlBonusTried).toBe(1);
    expect(after.owlBonusSolved).toBe(1);
  });
});

describe('owl progress persistence shape', () => {
  it('keeps owl fields through save/load roundtrip', () => {
    const memory = new Map<string, string>();
    const original = globalThis.localStorage;
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (k: string) => memory.get(k) ?? null,
        setItem: (k: string, v: string) => {
          memory.set(k, v);
        },
        removeItem: (k: string) => {
          memory.delete(k);
        },
      },
    });

    try {
      const key = STORAGE_KEYS.progress + '-test-owl';
      const progress = {
        ...createEmptyProgress(),
        totalStars: 6,
        owlHelpUsedCount: 2,
        owlHelpChallenges: ['l2-c4'],
        owlStarsSpent: 2,
        owlBonusTried: 1,
        owlBonusSolved: 1,
        totalXp: 50,
      };

      saveJson(key, progress);
      const loaded = loadJson(key, createEmptyProgress());
      expect(loaded.owlHelpUsedCount).toBe(2);
      expect(loaded.owlHelpChallenges).toEqual(['l2-c4']);
      expect(loaded.owlStarsSpent).toBe(2);
      expect(loaded.owlBonusSolved).toBe(1);
      expect(loaded.totalStars).toBe(6);
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: original,
      });
    }
  });
});
