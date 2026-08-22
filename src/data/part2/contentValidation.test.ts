import { describe, expect, it } from 'vitest';
import {
  allPlayableLessons,
  part2MainLessons,
  sideMissionLessons,
} from '../lessons';

describe('part2 content quality', () => {
  it('has 8 chapters with at least 8 challenges each', () => {
    expect(part2MainLessons).toHaveLength(8);
    for (const lesson of part2MainLessons) {
      expect(lesson.challenges.length).toBeGreaterThanOrEqual(8);
    }
  });

  it('has unique challenge ids across all playable content', () => {
    const ids = allPlayableLessons.flatMap((l) => l.challenges.map((c) => c.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('requires answer, explanation, hint, and positive xp', () => {
    for (const lesson of [...part2MainLessons, ...sideMissionLessons]) {
      for (const c of lesson.challenges) {
        expect(c.question, c.id).toBeTruthy();
        expect(c.explanation, c.id).toBeTruthy();
        expect(c.hint1, c.id).toBeTruthy();
        expect(c.answer !== undefined || c.answers || c.equationSteps || c.bossQuestions || c.correctOrder || c.matchingPairs, c.id).toBeTruthy();
        const xp = c.xpReward ?? 1;
        expect(xp, c.id).toBeGreaterThan(0);
        expect(c.owlHelp, `${c.id} owlHelp`).toBeTruthy();
      }
    }
  });

  it('spreads review-of-part-1 challenges across chapters', () => {
    const reviews = part2MainLessons.map((l) => ({
      id: l.id,
      n: l.challenges.filter((c) => c.reviewOfPart1).length,
    }));
    const withReview = reviews.filter((r) => r.n > 0);
    expect(withReview.length).toBeGreaterThanOrEqual(6);
    const legacyReviewCount = part2MainLessons
      .flatMap((l) => l.challenges)
      .filter((c) => c.reviewOfPart1).length;
    expect(legacyReviewCount).toBeGreaterThanOrEqual(10);
  });

  it('ensures bonus variants differ from originals', () => {
    for (const lesson of part2MainLessons) {
      for (const c of lesson.challenges) {
        for (const b of c.bonusVariants ?? []) {
          expect(b.id).not.toBe(c.id);
          const sameQuestion = b.question === c.question;
          const sameAnswer = b.answer === c.answer;
          expect(sameQuestion && sameAnswer, `${c.id}/${b.id}`).toBe(false);
        }
      }
    }
  });

  it('includes side missions', () => {
    expect(sideMissionLessons.length).toBeGreaterThanOrEqual(3);
  });
});
