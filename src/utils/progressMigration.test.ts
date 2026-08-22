import { describe, expect, it } from 'vitest';
import { migrateProgress, PROGRESS_VERSION } from './progressMigration';

describe('progress migration v3 (Fase 2)', () => {
  it('maps legacy owl fields to guided help fields', () => {
    const migrated = migrateProgress({
      progressVersion: 2,
      owlHelpUsedCount: 3,
      owlHelpChallenges: ['l1-c1', 'p2-c1-1'],
      owlStarsSpent: 3,
      owlBonusTried: 2,
      owlBonusSolved: 1,
    });

    expect(migrated.progressVersion).toBe(PROGRESS_VERSION);
    expect(migrated.guidedHelpUsedCount).toBe(3);
    expect(migrated.guidedHelpChallenges).toEqual(['l1-c1', 'p2-c1-1']);
    expect(migrated.guidedStarsSpent).toBe(3);
    expect(migrated.guidedBonusTried).toBe(2);
    expect(migrated.guidedBonusSolved).toBe(1);
    expect(migrated.owlHelpUsedCount).toBe(3);
  });

  it('prefers guided fields when migrating newer saves', () => {
    const migrated = migrateProgress({
      guidedHelpUsedCount: 5,
      owlHelpUsedCount: 2,
    });
    expect(migrated.guidedHelpUsedCount).toBe(5);
    expect(migrated.owlHelpUsedCount).toBe(5);
  });
});
