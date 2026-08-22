import { mathAnswerMatches } from './mathAnswerValidation';

/** Normalize math-ish text answers for simple string comparison */
export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/ℓ/g, 'l')
    .replace(/×/g, '*')
    .replace(/·/g, '*')
    .replace(/÷/g, '/')
    .replace(/:/g, '/')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/\*/g, '');
}

export function answersMatch(
  user: string,
  expected: string | number | boolean | string[],
): boolean {
  if (Array.isArray(expected)) {
    return expected.some((e) => answersMatch(user, e));
  }
  if (typeof expected === 'boolean') {
    const normalized = user.trim().toLowerCase();
    return expected
      ? ['true', 'waar', 'juist', 'ja'].includes(normalized)
      : ['false', 'onwaar', 'fout', 'nee'].includes(normalized);
  }
  if (typeof expected === 'number') {
    return mathAnswerMatches(user, expected);
  }
  // Algebraic / formula / fraction strings: use math-aware comparison
  return mathAnswerMatches(user, expected);
}

export function arraysEqualUnordered(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

export function arraysEqualOrdered(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function starsForAttempt(attempts: number, usedFirstStep: boolean): number {
  if (usedFirstStep) return 1;
  if (attempts <= 1) return 3;
  if (attempts === 2) return 2;
  return 1;
}

export const SUCCESS_MESSAGES = [
  'Nice! De volgende pootafdruk is gevonden.',
  'Precies! 🎉',
  'Je lynx-ogen missen niets.',
  'Goed gezien, detective.',
  'Sterrenlicht! Dat klopt.',
];

export const STREAK_MESSAGES = [
  '🔥 Slimme streak!',
  'Drie op rij — je bent op dreef.',
  'De vos in jou is wakker!',
];

export const WRONG_MESSAGES = [
  'Hmm… er zit ergens een vosje verstopt in je berekening 🦊',
  'Nog niet helemaal. Laten we even speuren.',
  'Bijna! Maar er mist nog een spoor.',
  'Interessant pad… maar niet het juiste.',
];

export function pickMessage(list: string[], seed: number): string {
  return list[Math.abs(seed) % list.length];
}
