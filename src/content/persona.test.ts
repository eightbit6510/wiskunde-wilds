import { describe, expect, it } from 'vitest';
import { getHelpPersona, getHelpPersonaOrDefault } from './personas';
import { getHelpPersonaIdForLesson } from './personaForLesson';
import { PART2_MANIFEST } from './loader';

describe('help personas (Fase 2)', () => {
  it('loads uil persona config from JSON', () => {
    const uil = getHelpPersona('uil');
    expect(uil.buttonLabel).toContain('Uil');
    expect(uil.mascotKey).toBe('owl');
  });

  it('loads detective persona config from JSON', () => {
    const detective = getHelpPersona('detective');
    expect(detective.buttonLabel).toContain('detective');
    expect(detective.helpModalTitle).toContain('Detective');
  });

  it('maps Deel I to uil and Deel II to detective', () => {
    expect(getHelpPersonaIdForLesson('vossenpad')).toBe('uil');
    expect(getHelpPersonaIdForLesson('schaduwgrot')).toBe('detective');
    expect(getHelpPersonaIdForLesson('zij-vossenhol')).toBe('uil');
  });

  it('uses part2 manifest persona id', () => {
    expect(PART2_MANIFEST.helpPersonaId).toBe('detective');
  });

  it('falls back to uil for unknown persona keys', () => {
    expect(getHelpPersonaOrDefault('unknown').id).toBe('uil');
  });
});
