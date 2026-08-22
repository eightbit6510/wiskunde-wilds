/** Configurable owl-help economy constants */

/** Cost to summon the owl (confirmed only). */
export const OWL_HELP_STAR_COST = 1;

/** XP multiplier when a challenge is solved with owl guidance. */
export const OWL_HELP_XP_MULTIPLIER = 0.5;

/** Extra XP for solving the post-owl bonus challenge yourself. */
export const OWL_BONUS_XP = 30;

export const XP_PER_STAR = 10;
export const XP_FIRST_SOLVE_BONUS = 5;

/** Stars awarded when finishing a challenge via owl help. */
export const OWL_HELP_STARS_EARNED = 1;

export function computeChallengeXp(
  stars: number,
  firstSolve: boolean,
  usedOwlHelp: boolean,
): number {
  const base = stars * XP_PER_STAR + (firstSolve ? XP_FIRST_SOLVE_BONUS : 0);
  if (!usedOwlHelp) return base;
  return Math.max(1, Math.round(base * OWL_HELP_XP_MULTIPLIER));
}

export interface OwlSpendState {
  totalStars: number;
  owlStarsSpent: number;
  owlHelpUsedCount: number;
  owlHelpChallenges: string[];
}

export type OwlSpendResult =
  | { ok: false; reason: 'no-stars' | 'already-pending' }
  | { ok: true; next: OwlSpendState };

/**
 * Deduct an owl-help star. Pure function — call only after explicit confirm.
 * Pass `pendingLock` true to simulate/enforce double-click protection.
 */
export function trySpendOwlStar(
  state: OwlSpendState,
  challengeId: string,
  pendingLock = false,
): OwlSpendResult {
  if (pendingLock) return { ok: false, reason: 'already-pending' };
  if (state.totalStars < OWL_HELP_STAR_COST) {
    return { ok: false, reason: 'no-stars' };
  }

  return {
    ok: true,
    next: {
      totalStars: state.totalStars - OWL_HELP_STAR_COST,
      owlStarsSpent: state.owlStarsSpent + OWL_HELP_STAR_COST,
      owlHelpUsedCount: state.owlHelpUsedCount + 1,
      owlHelpChallenges: state.owlHelpChallenges.includes(challengeId)
        ? state.owlHelpChallenges
        : [...state.owlHelpChallenges, challengeId],
    },
  };
}

export function recordBonusAttempt(
  state: { owlBonusTried: number; owlBonusSolved: number },
  solved: boolean,
): { owlBonusTried: number; owlBonusSolved: number } {
  return {
    owlBonusTried: state.owlBonusTried + 1,
    owlBonusSolved: state.owlBonusSolved + (solved ? 1 : 0),
  };
}
