import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { OwlPack } from '../src/data/owl/types';
import type {
  AdventureId,
  ChallengeDefinition,
  ChallengePlacement,
  GuidedHelpPack,
  LessonShell,
} from '../src/types/content';
import type { Lesson } from '../src/types';

export interface ExportDirs {
  bankDir: string;
  helpDir: string;
  lessonDir: string;
}

/** Legacy les → bank + guided help + lesson shell JSON */
export function exportLesson(
  lesson: Lesson,
  adventureId: AdventureId,
  dirs: ExportDirs,
  externalOwl?: Record<string, OwlPack>,
): void {
  const placements: ChallengePlacement[] = lesson.challenges.map((challenge, index) => ({
    challengeId: challenge.id,
    optionalStory: challenge.optionalStory,
    title: challenge.title,
    reviewOfPart1: challenge.reviewOfPart1,
    xpReward: challenge.xpReward,
    sortOrder: index,
  }));

  for (const challenge of lesson.challenges) {
    const {
      optionalStory: _s,
      owlHelp: _o,
      bonusVariants: _b,
      title: _t,
      reviewOfPart1: _r,
      xpReward: _x,
      ...definition
    } = challenge;

    const def = definition as ChallengeDefinition;
    writeFileSync(
      join(dirs.bankDir, `${challenge.id}.json`),
      `${JSON.stringify(def, null, 2)}\n`,
      'utf8',
    );

    const owlHelp = challenge.owlHelp ?? externalOwl?.[challenge.id]?.owlHelp;
    const bonusVariants =
      challenge.bonusVariants ?? externalOwl?.[challenge.id]?.bonusVariants;

    if (owlHelp) {
      const help: GuidedHelpPack = {
        challengeId: challenge.id,
        personaId: 'uil',
        guidedHelp: owlHelp,
        bonusVariants: bonusVariants ?? [],
      };
      writeFileSync(
        join(dirs.helpDir, `${challenge.id}.json`),
        `${JSON.stringify(help, null, 2)}\n`,
        'utf8',
      );
    }
  }

  const shell: LessonShell = {
    id: lesson.id,
    adventureId,
    order: lesson.order,
    areaName: lesson.areaName,
    title: lesson.title,
    emoji: lesson.emoji,
    intro: lesson.intro,
    color: lesson.color,
    outroStory: lesson.outroStory,
    mapTeaser: lesson.mapTeaser,
    placements,
  };

  writeFileSync(
    join(dirs.lessonDir, `${lesson.id}.json`),
    `${JSON.stringify(shell, null, 2)}\n`,
    'utf8',
  );
}
