import type { StoryChallengeKind } from './storySlots';

/** Deel II hard slots (0 en 2) per les — afgestemd op verhaal-shells. */
export const PART2_HARD_STORY_SLOTS: Record<string, StoryChallengeKind> = {
  '1:0': 'p2-equation-familiar',
  '1:2': 'p2-equation-two-x',
  '2:0': 'p2-formula-area-raven',
  '2:2': 'p2-formula-perimeter',
  '3:0': 'p2-ratio-scale-river',
  '3:2': 'p2-ratio-mixture-river',
  '4:0': 'p2-parabola-intro',
  '4:2': 'p2-parabola-shift',
  '5:0': 'p2-graph-intersect',
  '5:2': 'p2-y-intercept-observatory',
  '6:0': 'p2-power-product',
  '6:2': 'p2-square-12',
  '7:0': 'p2-sequence',
  '7:2': 'p2-figure-stones',
  '8:0': 'p2-nacht-algebra',
  '8:2': 'p2-nacht-intersect-y',
};

export function part2HardStoryKind(lessonIndex: number, slot: number): StoryChallengeKind | undefined {
  return PART2_HARD_STORY_SLOTS[`${lessonIndex}:${slot}`];
}
