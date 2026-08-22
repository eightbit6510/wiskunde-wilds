import type { BonusVariant, Challenge, Lesson, OwlHelp } from '../../types';

export type OwlPack = {
  owlHelp: OwlHelp;
  bonusVariants: BonusVariant[];
};

export function withOwlHelp(
  lesson: Lesson,
  packs: Record<string, OwlPack>,
): Lesson {
  return {
    ...lesson,
    challenges: lesson.challenges.map((challenge) => {
      const pack = packs[challenge.id];
      if (!pack) return challenge;
      return {
        ...challenge,
        owlHelp: pack.owlHelp,
        bonusVariants: pack.bonusVariants,
      } satisfies Challenge;
    }),
  };
}
