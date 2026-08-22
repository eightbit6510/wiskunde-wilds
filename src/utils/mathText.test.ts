import { describe, expect, it } from 'vitest';
import { formatMathText } from './mathText';

describe('formatMathText', () => {
  it('replaces the square placeholder with iets', () => {
    expect(formatMathText('□ × 3 = 15. Wat is □?')).toBe('iets × 3 = 15. Wat is iets?');
  });

  it('returns empty string for missing input', () => {
    expect(formatMathText(undefined)).toBe('');
  });
});
