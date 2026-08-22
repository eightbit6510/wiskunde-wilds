import type {
  ChallengeDefinition,
  ChallengePlacement,
  GuidedHelpPack,
  HelpPersonaId,
  LessonShell,
  ResolvedChallenge,
  ResolvedLesson,
} from '../types/content';
import type { Lesson } from '../types';
import { getGuidedHelpPack } from './guided-help';

/** Bank + placement + optional guided help → runtime challenge */
export function resolveChallenge(
  definition: ChallengeDefinition,
  placement: ChallengePlacement,
  help?: GuidedHelpPack,
): ResolvedChallenge {
  const resolved: ResolvedChallenge = { ...definition };

  if (placement.optionalStory !== undefined) resolved.optionalStory = placement.optionalStory;
  if (placement.title !== undefined) resolved.title = placement.title;
  if (placement.reviewOfPart1 !== undefined) resolved.reviewOfPart1 = placement.reviewOfPart1;
  if (placement.xpReward !== undefined) resolved.xpReward = placement.xpReward;
  if (help?.guidedHelp) resolved.owlHelp = help.guidedHelp;
  if (help?.bonusVariants) resolved.bonusVariants = help.bonusVariants;

  return resolved;
}

/** Shell + bank + persona → runtime lesson */
export function resolveLesson(
  shell: LessonShell,
  bank: ReadonlyMap<string, ChallengeDefinition>,
  personaId: HelpPersonaId,
): ResolvedLesson {
  const challenges = [...shell.placements]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((placement) => {
      const definition = bank.get(placement.challengeId);
      if (!definition) {
        throw new Error(
          `Missing challenge "${placement.challengeId}" for lesson "${shell.id}"`,
        );
      }
      const help = getGuidedHelpPack(placement.challengeId, personaId);
      return resolveChallenge(definition, placement, help);
    });

  const { placements: _placements, ...rest } = shell;
  return { ...rest, challenges };
}

/** Resolved lesson → bestaande Lesson type (zelfde vorm) */
export function toLesson(resolved: ResolvedLesson): Lesson {
  const { adventureId: _adventureId, ...lesson } = resolved;
  return lesson as Lesson;
}
