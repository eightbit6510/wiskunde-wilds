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

  it('aligns vossenpad slot 0 with multi-select detective story', () => {
    const bundle = buildAllLevelBundles().find((item) => item.level === 'vwo-3');
    expect(bundle).toBeDefined();
    const lesson = bundle!.lessons.find((l) => l.order === 1);
    expect(lesson?.areaName).toBe('Het Vossenpad');
    const first = bundle!.challenges.find((c) => c.id === lesson?.placements[0]?.challengeId);
    expect(first?.type).toBe('multi-select');
    expect(first?.question).toMatch(/berekeningen kloppen/i);
  });

  it('uses PO-level math for groep-6 (no letter-x distributivity on Vossenpad)', () => {
    const bundle = buildAllLevelBundles().find((item) => item.level === 'groep-6');
    expect(bundle).toBeDefined();
    const lesson = bundle!.lessons.find((l) => l.order === 1);
    const questions = lesson!.placements.map((p) => {
      const c = bundle!.challenges.find((ch) => ch.id === p.challengeId)!;
      return c.question;
    });
    expect(questions[1]).not.toMatch(/\d\(x\s*\+/);
    expect(questions.some((q) => /x\s*\+|y\s*=\s*x²/.test(q))).toBe(false);
    expect(questions[1]).toMatch(/boomstam|12 − 5|aftrek/i);
  });

  it('differentiates Vossenpad story sommen across groep 6, 7 and 8', () => {
    const q = (level: string) => {
      const bundle = buildAllLevelBundles().find((item) => item.level === level)!;
      const lesson = bundle.lessons.find((l) => l.order === 1)!;
      return lesson.placements.map((p) => bundle.challenges.find((c) => c.id === p.challengeId)!.question);
    };
    const g6 = q('groep-6');
    const g7 = q('groep-7');
    const g8 = q('groep-8');
    const same67 = g6.filter((question, i) => question === g7[i]).length;
    const same68 = g6.filter((question, i) => question === g8[i]).length;
    expect(same67).toBeLessThan(5);
    expect(same68).toBeLessThan(5);
    expect(g6[0]).not.toBe(g8[0]);
  });

  it('aligns konijnenhol slot 2 with machten compare story', () => {
    const bundle = buildAllLevelBundles().find((item) => item.level === 'vwo-3');
    expect(bundle).toBeDefined();
    const lesson = bundle!.lessons.find((l) => l.order === 4);
    expect(lesson?.areaName).toBe('Konijnenhol');
    const third = bundle!.challenges.find((c) => c.id === lesson?.placements[2]?.challengeId);
    expect(third?.question).toMatch(/2⁵|5²/);
  });

  it('aligns schaduwgrot hard slot 2 with two-x equation story', () => {
    const bundle = buildAllLevelBundles().find((item) => item.level === 'vwo-3');
    expect(bundle).toBeDefined();
    const lesson = bundle!.part2Lessons.find((l) => l.order === 1);
    expect(lesson?.areaName).toBe('De Schaduwgrot');
    const hard = bundle!.challenges.find((c) => c.id === lesson?.placements[2]?.challengeId);
    expect(hard?.question).toMatch(/3x \+ 7 = x \+ 17/);
  });

  it('avoids repeated kwadratisch and machten in vwo-6 opening chapters', () => {
    const bundle = buildAllLevelBundles().find((item) => item.level === 'vwo-6');
    expect(bundle).toBeDefined();
    const firstTen = bundle!.challenges.slice(0, 10);
    const questions = firstTen.map((challenge) => challenge.question);
    expect(new Set(questions).size).toBe(questions.length);
  });
});
