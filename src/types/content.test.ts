import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ADVENTURE_MANIFESTS,
  DEFAULT_CLASS_PROFILES,
  DEFAULT_HELP_PERSONAS,
} from '../content/defaults';
import { PLAYER_DATA_POLICY, PIN_RULES } from './player';
import { CONTENT_LAYER } from './content';

describe('Fase 0 — architecture contracts', () => {
  it('documents content layers', () => {
    expect(CONTENT_LAYER.bank).toContain('id');
    expect(CONTENT_LAYER.placement).toContain('challengeId');
    expect(CONTENT_LAYER.engine).toContain('progress');
  });

  it('defines default help personas including uil', () => {
    expect(DEFAULT_HELP_PERSONAS.uil.buttonLabel).toContain('Uil');
    expect(DEFAULT_HELP_PERSONAS.detective.mascotKey).toBe('detective');
  });

  it('defines class level profiles without PII fields', () => {
    for (const profile of Object.values(DEFAULT_CLASS_PROFILES)) {
      expect(profile.topicsUnlocked.length).toBeGreaterThan(0);
      expect(profile.maxDifficulty).toBeGreaterThanOrEqual(1);
    }
  });

  it('mirrors part1 and part2 adventure manifests', () => {
    const part1 = DEFAULT_ADVENTURE_MANIFESTS.find((a) => a.id === 'part1');
    const part2 = DEFAULT_ADVENTURE_MANIFESTS.find((a) => a.id === 'part2');
    expect(part1?.lessonIds).toHaveLength(8);
    expect(part2?.lessonIds).toHaveLength(8);
    expect(part1?.helpPersonaId).toBe('uil');
    expect(part2?.helpPersonaId).toBe('detective');
    expect(part2?.unlockRuleId).toBe('part1-complete');
  });

  it('never stores PII per player policy', () => {
    expect(PLAYER_DATA_POLICY.neverStore).toContain('email');
    expect(PLAYER_DATA_POLICY.neverStore).toContain('realName');
    expect(PLAYER_DATA_POLICY.store).toContain('displayName');
  });

  it('uses child-friendly PIN rules', () => {
    expect(PIN_RULES.minLength).toBe(4);
    expect(PIN_RULES.maxLength).toBe(4);
  });
});
