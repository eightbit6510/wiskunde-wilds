import { describe, expect, it } from 'vitest';
import type { ChallengeDefinition } from '../../src/types/content';
import { buildAllLevelBundles } from './buildLevelBundle';
import { isPart2ReviewSlot } from './part2Pattern';

function challengeQuestionKey(challenge: ChallengeDefinition): string {
  const optionsKey = challenge.answerOptions?.map((option) => option.label).join('|') ?? '';
  if (challenge.type === 'multi-select') {
    return `${challenge.topic}|${challenge.question}|${(challenge.answers ?? []).join(',')}|${optionsKey}`;
  }
  if (challenge.type === 'multiple-choice') {
    return `${challenge.topic}|${challenge.question}|${challenge.answer}|${optionsKey}`;
  }
  return `${challenge.topic}|${challenge.question}|${JSON.stringify(challenge.answer)}`;
}

describe('buildLevelBundle', () => {
  it('generates unique new questions within each level (reviews may repeat Deel I)', () => {
    for (const bundle of buildAllLevelBundles()) {
      const seen = new Set<string>();
      for (const lesson of [...bundle.lessons, ...bundle.part2Lessons]) {
        for (const placement of lesson.placements) {
          if (placement.reviewOfPart1) continue;
          const challenge = bundle.challenges.find((c) => c.id === placement.challengeId);
          expect(challenge).toBeDefined();
          const key = challengeQuestionKey(challenge!);
          expect(seen.has(key)).toBe(false);
          seen.add(key);
        }
      }
    }
  });

  it('alternates hard and review slots in Deel II (hard → easy after each hard)', () => {
    for (const bundle of buildAllLevelBundles()) {
      for (const lesson of bundle.part2Lessons) {
        for (let slot = 0; slot < 5; slot += 1) {
          const placement = lesson.placements.find((p) => p.sortOrder === slot);
          expect(placement).toBeDefined();
          if (isPart2ReviewSlot(slot)) {
            expect(placement!.reviewOfPart1).toBe(true);
          } else {
            expect(placement!.reviewOfPart1).toBeUndefined();
          }
        }
        const reviewCount = lesson.placements.filter((p) => p.reviewOfPart1).length;
        expect(reviewCount).toBe(3);
      }
    }
  });

  it('avoids repeated kwadratisch and machten in vwo-6 opening chapters', () => {
    const bundle = buildAllLevelBundles().find((item) => item.level === 'vwo-6');
    expect(bundle).toBeDefined();
    const firstTen = bundle!.challenges.slice(0, 10);
    const questions = firstTen.map((challenge) => challenge.question);
    expect(new Set(questions).size).toBe(questions.length);
  });
});
