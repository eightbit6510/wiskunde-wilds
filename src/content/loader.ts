import type { AdventureManifest, LessonShell } from '../types/content';
import type { Challenge, Lesson } from '../types';
import part1Manifest from './adventures/part1/manifest.json';
import part2Manifest from './adventures/part2/manifest.json';
import sideManifest from './adventures/side/manifest.json';
import { CHALLENGE_BANK, getChallengeDefinition } from './bank';
import { getGuidedHelpPack, GUIDED_HELP_UIL } from './guided-help';
import { unwrapJsonModule } from './jsonModule';
import { getHelpPersonaIdForLesson } from './personaForLesson';
import { resolveLesson, toLesson } from './resolve';
import { validateContentBundle } from './validate';

export const PART1_MANIFEST = unwrapJsonModule(part1Manifest) as AdventureManifest;
export const PART2_MANIFEST = unwrapJsonModule(part2Manifest) as AdventureManifest;
export const SIDE_MANIFEST = unwrapJsonModule(sideManifest) as AdventureManifest;

/** Alle gemigreerde lessen (Deel I + Deel II + zijpaden) */
export const CONTENT_MIGRATED_LESSON_IDS = [
  ...PART1_MANIFEST.lessonIds,
  ...PART2_MANIFEST.lessonIds,
  ...SIDE_MANIFEST.lessonIds,
] as const;

export type ContentMigratedLessonId = (typeof CONTENT_MIGRATED_LESSON_IDS)[number];

const shellModules = import.meta.glob<{ default: LessonShell } | LessonShell>(
  [
    './adventures/part1/lessons/*.json',
    './adventures/part2/lessons/*.json',
    './adventures/side/lessons/*.json',
  ],
  { eager: true },
);

function loadLessonShells(): Record<string, LessonShell> {
  const shells: Record<string, LessonShell> = {};
  for (const mod of Object.values(shellModules)) {
    const shell = unwrapJsonModule(mod);
    shells[shell.id] = shell;
  }
  return shells;
}

const LESSON_SHELLS = loadLessonShells();

export function isContentMigratedLesson(id: string): id is ContentMigratedLessonId {
  return (CONTENT_MIGRATED_LESSON_IDS as readonly string[]).includes(id);
}

/** Laadt één les uit bank + shell + guided help */
export function loadLessonFromContent(lessonId: string): Lesson | undefined {
  if (!isContentMigratedLesson(lessonId)) return undefined;
  const shell = LESSON_SHELLS[lessonId];
  if (!shell) return undefined;
  const personaId = getHelpPersonaIdForLesson(lessonId);
  const resolved = resolveLesson(shell, CHALLENGE_BANK, personaId);
  return toLesson(resolved);
}

function loadLessonsFromManifest(manifest: AdventureManifest): Lesson[] {
  return manifest.lessonIds.map((id) => {
    const lesson = loadLessonFromContent(id);
    if (!lesson) {
      throw new Error(`Fase 1: content bundle failed to load for "${id}"`);
    }
    return lesson;
  });
}

/** Alle gemigreerde Deel I-lessen in manifest-volgorde */
export function loadPart1LessonsFromContent(): Lesson[] {
  return loadLessonsFromManifest(PART1_MANIFEST);
}

/** Alle gemigreerde Deel II-hoofdlessen in manifest-volgorde */
export function loadPart2LessonsFromContent(): Lesson[] {
  return loadLessonsFromManifest(PART2_MANIFEST);
}

/** Alle gemigreerde zijpaden in manifest-volgorde */
export function loadSideMissionsFromContent(): Lesson[] {
  return loadLessonsFromManifest(SIDE_MANIFEST);
}

export { getChallengeDefinition, CHALLENGE_BANK, getGuidedHelpPack, GUIDED_HELP_UIL };

export function validateMigratedContent() {
  const shells = CONTENT_MIGRATED_LESSON_IDS.map((id) => {
    const shell = LESSON_SHELLS[id];
    if (!shell) {
      throw new Error(`Missing lesson shell JSON for "${id}"`);
    }
    return shell;
  });

  const helpByChallenge = new Map(
    [...GUIDED_HELP_UIL.values()].map((pack) => [pack.challengeId, pack]),
  );

  return validateContentBundle({
    bank: CHALLENGE_BANK,
    shells,
    helpByChallenge,
  });
}

/** Challenges uit bank op topic + difficulty (zonder verhaal) */
export function getBankChallengePool(filter?: {
  topic?: Challenge['topic'];
  difficulty?: Challenge['difficulty'];
}): Challenge[] {
  let list = [...CHALLENGE_BANK.values()];
  if (filter?.topic) list = list.filter((c) => c.topic === filter.topic);
  if (filter?.difficulty) list = list.filter((c) => c.difficulty === filter.difficulty);
  return list as Challenge[];
}
