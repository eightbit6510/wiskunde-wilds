import { describe, expect, it } from 'vitest';
import { getActiveClassLevel } from './activeClassLevel';
import { DEFAULT_SETTINGS } from './storage';

describe('getActiveClassLevel', () => {
  it('prefers cloud prefs over local settings', () => {
    const level = getActiveClassLevel(
      { session: { token: 't', player: { id: '1', displayName: 'Vos' }, prefs: { classLevel: 'vwo-1', adventureId: 'ontwaakte-bos', settings: null, updatedAt: null } } },
      { settings: { ...DEFAULT_SETTINGS, classLevel: 'groep-6' } },
    );
    expect(level).toBe('vwo-1');
  });

  it('falls back to local settings when not logged in', () => {
    const level = getActiveClassLevel(
      { session: null },
      { settings: { ...DEFAULT_SETTINGS, classLevel: 'groep-6' } },
    );
    expect(level).toBe('groep-6');
  });
});
