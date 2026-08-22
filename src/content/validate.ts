import type {
  ChallengeDefinition,
  ChallengePlacement,
  ContentValidationIssue,
  ContentValidationResult,
  GuidedHelpPack,
  LessonShell,
} from '../types/content';

function issue(
  severity: ContentValidationIssue['severity'],
  code: string,
  message: string,
  path?: string,
): ContentValidationIssue {
  return { severity, code, message, path };
}

export function validateChallengeDefinition(
  def: ChallengeDefinition,
  path: string,
): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  if (!def.id) {
    issues.push(issue('error', 'MISSING_ID', 'Challenge has no id', path));
  }
  if (!def.question?.trim()) {
    issues.push(issue('error', 'MISSING_QUESTION', 'Challenge has no question', path));
  }
  if (def.starsAvailable == null) {
    issues.push(
      issue('warning', 'MISSING_STARS', 'starsAvailable not set; engine may default', path),
    );
  }
  return issues;
}

export function validateLessonShell(
  shell: LessonShell,
  bank: ReadonlyMap<string, ChallengeDefinition>,
  helpByChallenge: ReadonlyMap<string, GuidedHelpPack>,
  requireHelp = true,
): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  const base = `lessons/${shell.id}`;

  if (shell.placements.length === 0) {
    issues.push(issue('error', 'EMPTY_LESSON', 'Lesson has no placements', base));
  }

  const sortOrders = new Set<number>();
  for (const placement of shell.placements) {
    const p = `${base}/placements/${placement.challengeId}`;

    if (sortOrders.has(placement.sortOrder)) {
      issues.push(
        issue('error', 'DUPLICATE_SORT', `Duplicate sortOrder ${placement.sortOrder}`, p),
      );
    }
    sortOrders.add(placement.sortOrder);

    if (!bank.has(placement.challengeId)) {
      issues.push(
        issue('error', 'MISSING_BANK', `Unknown challengeId "${placement.challengeId}"`, p),
      );
    }

    if (requireHelp && !helpByChallenge.has(placement.challengeId)) {
      issues.push(
        issue('error', 'MISSING_HELP', `No guided help for "${placement.challengeId}"`, p),
      );
    }
  }

  return issues;
}

export function validateBankUniqueness(
  bank: ReadonlyMap<string, ChallengeDefinition>,
): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  const seen = new Set<string>();
  for (const [id, def] of bank) {
    if (seen.has(id)) {
      issues.push(issue('error', 'DUPLICATE_BANK_ID', `Duplicate bank id "${id}"`));
    }
    seen.add(id);
    if (def.id !== id) {
      issues.push(
        issue(
          'error',
          'ID_MISMATCH',
          `Map key "${id}" !== definition.id "${def.id}"`,
          `bank/${id}`,
        ),
      );
    }
    issues.push(...validateChallengeDefinition(def, `bank/${def.id}`));
  }
  return issues;
}

export function mergeValidation(...lists: ContentValidationIssue[][]): ContentValidationResult {
  const issues = lists.flat();
  return {
    ok: !issues.some((i) => i.severity === 'error'),
    issues,
  };
}

export function validateContentBundle(input: {
  bank: ReadonlyMap<string, ChallengeDefinition>;
  shells: LessonShell[];
  helpByChallenge: ReadonlyMap<string, GuidedHelpPack>;
  requireHelp?: boolean;
}): ContentValidationResult {
  const bankIssues = validateBankUniqueness(input.bank);
  const shellIssues = input.shells.flatMap((shell) =>
    validateLessonShell(shell, input.bank, input.helpByChallenge, input.requireHelp ?? true),
  );
  return mergeValidation(bankIssues, shellIssues);
}

/** Strip runtime-only velden voor parity-checks */
export function stripRuntimeFields(challenge: Record<string, unknown>): Record<string, unknown> {
  const {
    optionalStory: _s,
    owlHelp: _o,
    bonusVariants: _b,
    title: _t,
    reviewOfPart1: _r,
    xpReward: _x,
    ...rest
  } = challenge;
  return rest;
}

export function placementKey(placement: ChallengePlacement): string {
  return `${placement.challengeId}:${placement.sortOrder}`;
}
