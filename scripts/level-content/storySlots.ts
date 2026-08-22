import type { Topic } from '../../src/types';

export type StoryChallengeKind =
  | 'code-crack'
  | 'boss-battle'
  | 'sorting'
  | 'spot-error'
  | 'multi-select-signs'
  | 'equation-steps'
  | 'imposter-equation'
  | 'graph-choice'
  | 'table-formula'
  | 'y-intercept'
  | 'matching-graphs'
  | 'formula-area'
  | 'formula-speed'
  | 'formula-cost'
  | 'formula-rearrange-t'
  | 'formula-perimeter'
  | 'fraction-compare'
  | 'fraction-add'
  | 'powers-compare'
  | 'sqrt-input'
  | 'verbanden-table'
  | 'verbanden-nonlinear-tf'
  | 'verbanden-situatie'
  | 'verbanden-linear-table'
  | 'runestone-algebra'
  | 'runestone-graph'
  | 'runestone-breuk'
  | 'runestone-verbanden'
  | 'runestone-mixed'
  | 'parabola-intro'
  | 'parabola-shift'
  | 'parabola-square'
  | 'parabola-symmetry-tf'
  | 'parabola-shape'
  | 'temple-order-ops'
  | 'temple-expand'
  | 'temple-equation'
  | 'temple-formula-l'
  | 'p2-equation-familiar'
  | 'p2-equation-two-x'
  | 'p2-formula-area-raven'
  | 'p2-formula-perimeter'
  | 'p2-ratio-scale-river'
  | 'p2-ratio-mixture-river'
  | 'p2-graph-intersect'
  | 'p2-y-intercept-observatory'
  | 'p2-power-product'
  | 'p2-sqrt-81'
  | 'p2-square-12'
  | 'p2-sequence'
  | 'p2-pattern-formula'
  | 'p2-figure-stones'
  | 'p2-nacht-algebra'
  | 'p2-nacht-ratio'
  | 'p2-parabola-intro'
  | 'p2-parabola-shift'
  | 'p2-nacht-intersect-y';

export type Part1StorySlot =
  | { kind: StoryChallengeKind }
  | { topic: Topic };

/** Deel I: les (1–8) × slot (0–4) — afgestemd op legacy bos-verhaal. */
export const PART1_STORY_SLOTS: Record<string, Part1StorySlot> = {
  // Vossenpad — detective / sporen
  '1:0': { kind: 'multi-select-signs' },
  '1:1': { kind: 'spot-error' },
  '1:2': { kind: 'code-crack' },
  '1:3': { kind: 'equation-steps' },
  '1:4': { kind: 'imposter-equation' },
  // Wolvenkluis — formules
  '2:0': { kind: 'formula-area' },
  '2:1': { kind: 'formula-speed' },
  '2:2': { kind: 'formula-cost' },
  '2:3': { kind: 'formula-rearrange-t' },
  '2:4': { kind: 'formula-perimeter' },
  // Lynx — grafieken
  '3:0': { kind: 'graph-choice' },
  '3:1': { kind: 'table-formula' },
  '3:2': { kind: 'y-intercept' },
  '3:3': { kind: 'matching-graphs' },
  '3:4': { topic: 'grafieken' },
  // Konijnenhol — breuken, machten, boss
  '4:0': { kind: 'fraction-compare' },
  '4:1': { kind: 'fraction-add' },
  '4:2': { kind: 'powers-compare' },
  '4:3': { kind: 'sqrt-input' },
  '4:4': { kind: 'boss-battle' },
  // Uilenlab — verbanden + sorteren
  '5:0': { kind: 'verbanden-table' },
  '5:1': { kind: 'verbanden-nonlinear-tf' },
  '5:2': { kind: 'verbanden-situatie' },
  '5:3': { kind: 'sorting' },
  '5:4': { topic: 'verbanden' },
  // Bergmissie — runestenen
  '6:0': { kind: 'runestone-algebra' },
  '6:1': { kind: 'runestone-graph' },
  '6:2': { kind: 'runestone-breuk' },
  '6:3': { kind: 'runestone-verbanden' },
  '6:4': { kind: 'runestone-mixed' },
  // Maanlicht — parabolen / patronen
  '7:0': { kind: 'parabola-intro' },
  '7:1': { kind: 'parabola-shift' },
  '7:2': { kind: 'parabola-square' },
  '7:3': { kind: 'parabola-symmetry-tf' },
  '7:4': { kind: 'parabola-shape' },
  // Sterrentempel — eindcode
  '8:0': { kind: 'temple-order-ops' },
  '8:1': { kind: 'temple-expand' },
  '8:2': { kind: 'temple-equation' },
  '8:3': { kind: 'temple-formula-l' },
  '8:4': { kind: 'code-crack' },
};

function slotKey(lessonIndex: number, slot: number): string {
  return `${lessonIndex}:${slot}`;
}

export function part1StorySlot(lessonIndex: number, slot: number): Part1StorySlot | undefined {
  return PART1_STORY_SLOTS[slotKey(lessonIndex, slot)];
}

export function part1StoryTopic(lessonIndex: number, slot: number): Topic | undefined {
  const spec = part1StorySlot(lessonIndex, slot);
  return spec && 'topic' in spec ? spec.topic : undefined;
}
