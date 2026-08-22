import { describe, expect, it } from 'vitest';
import {
  allPlayableLessons,
  challengesMissingOwlHelp,
  lessons,
  part2MainLessons,
} from '../lessons';

describe('owl help coverage', () => {
  it('attaches owl help to every challenge (part 1 + part 2)', () => {
    expect(challengesMissingOwlHelp(allPlayableLessons)).toEqual([]);
  });

  it('gives every part 1 challenge at least one bonus variant', () => {
    const missing = lessons.flatMap((lesson) =>
      lesson.challenges
        .filter((c) => !c.bonusVariants || c.bonusVariants.length === 0)
        .map((c) => c.id),
    );
    expect(missing).toEqual([]);
  });

  it('gives every part 2 challenge owl help and a bonus variant', () => {
    const missingOwl = part2MainLessons.flatMap((l) =>
      l.challenges.filter((c) => !c.owlHelp).map((c) => c.id),
    );
    const missingBonus = part2MainLessons.flatMap((l) =>
      l.challenges.filter((c) => !c.bonusVariants?.length).map((c) => c.id),
    );
    expect(missingOwl).toEqual([]);
    expect(missingBonus).toEqual([]);
  });

  it('keeps wolvenkluis formula style on l2-c4', () => {
    const challenge = lessons
      .flatMap((l) => l.challenges)
      .find((c) => c.id === 'l2-c4');
    expect(challenge?.owlHelp?.intro).toContain('Geen stress');
    expect(challenge?.owlHelp?.steps.length).toBeGreaterThanOrEqual(2);
    expect(challenge?.bonusVariants?.length).toBeGreaterThanOrEqual(3);
  });
});
