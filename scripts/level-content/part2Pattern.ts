/** Deel II: moeilijk → makkelijk (herhaling) — didactisch patroon per les (5 slots). */
export function isPart2ReviewSlot(slot: number): boolean {
  return slot === 1 || slot === 3 || slot === 4;
}

/** Welke Deel I-slot (0–4) als makkelijke herhaling. */
export function part2ReviewPart1Slot(slot: number): number {
  if (slot === 1) return 1;
  if (slot === 3) return 3;
  return 0;
}

export function difficultyForPart2(
  baseDifficulty: 1 | 2 | 3,
  maxDifficulty: 1 | 2 | 3,
): 1 | 2 | 3 {
  return Math.min(maxDifficulty, Math.max(1, baseDifficulty + 1)) as 1 | 2 | 3;
}
