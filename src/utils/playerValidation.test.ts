import { describe, expect, it } from 'vitest';
import { validateDisplayName, validatePin } from './playerValidation';

describe('playerValidation', () => {
  it('rejects short names', () => {
    expect(validateDisplayName('A')).toMatch(/minstens 2/);
  });

  it('accepts valid display names', () => {
    expect(validateDisplayName('Dennis')).toBeNull();
    expect(validateDisplayName('Sterren-jager 2')).toBeNull();
  });

  it('enforces numeric PIN rules', () => {
    expect(validatePin('123')).toMatch(/4 cijfers/);
    expect(validatePin('12345')).toMatch(/4 cijfers/);
    expect(validatePin('12ab')).toMatch(/cijfers/);
    expect(validatePin('1234')).toBeNull();
  });
});
