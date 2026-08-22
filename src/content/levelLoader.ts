import type { AdventureManifest, ClassLevel, LessonShell } from '../types/content';
import type { Lesson } from '../types';
import { CHALLENGE_BANK } from './bank';
import { CLASS_LEVEL_IDS, getClassProfile, isClassLevel } from './classLevels';
import { getGuidedHelpPack } from './guided-help';
import { unwrapJsonModule } from './jsonModule';
import { resolveLesson, toLesson } from './resolve';
import { validateLessonShell } from './validate';

const levelManifestModules = import.meta.glob<{ default: AdventureManifest } | AdventureManifest>(
  './adventures/levels/*/manifest.json',
  { eager: true },
);

const levelShellModules = import.meta.glob<{ default: LessonShell } | LessonShell>(
  './adventures/levels/*/lessons/*.json',
  { eager: true },
);

function loadLevelManifests(): Map<ClassLevel, AdventureManifest> {
  const map = new Map<ClassLevel, AdventureManifest>();
  for (const mod of Object.values(levelManifestModules)) {
    const manifest = unwrapJsonModule(mod);
    if (isClassLevel(manifest.id)) {
      map.set(manifest.id, manifest);
    }
  }
  return map;
}

function loadLevelShells(): Record<string, LessonShell> {
  const shells: Record<string, LessonShell> = {};
  for (const mod of Object.values(levelShellModules)) {
    const shell = unwrapJsonModule(mod);
    shells[shell.id] = shell;
  }
  return shells;
}

export const LEVEL_MANIFESTS = loadLevelManifests();
export const LEVEL_SHELLS = loadLevelShells();

export function hasLevelContent(level: ClassLevel): boolean {
  return LEVEL_MANIFESTS.has(level);
}

export function getLevelManifest(level: ClassLevel): AdventureManifest | undefined {
  return LEVEL_MANIFESTS.get(level);
}

export function loadLevelLessonFromContent(lessonId: string): Lesson | undefined {
  const shell = LEVEL_SHELLS[lessonId];
  if (!shell) return undefined;
  const resolved = resolveLesson(shell, CHALLENGE_BANK, 'uil');
  return toLesson(resolved);
}

export function loadLessonsForClassLevel(level: ClassLevel): Lesson[] {
  const manifest = LEVEL_MANIFESTS.get(level);
  if (!manifest) {
    throw new Error(`No level adventure manifest for "${level}"`);
  }
  return manifest.lessonIds.map((id) => {
    const lesson = loadLevelLessonFromContent(id);
    if (!lesson) {
      throw new Error(`Level content failed to load lesson "${id}" for ${level}`);
    }
    return { ...lesson, adventureId: level };
  });
}

export function getLevelLessonIds(level: ClassLevel): string[] {
  return LEVEL_MANIFESTS.get(level)?.lessonIds ?? [];
}

export function validateLevelBundle(level: ClassLevel) {
  const manifest = LEVEL_MANIFESTS.get(level);
  if (!manifest) {
    return { ok: false, issues: [{ severity: 'error' as const, code: 'NO_MANIFEST', message: `Missing manifest for ${level}` }] };
  }

  const shells = manifest.lessonIds.map((id) => {
    const shell = LEVEL_SHELLS[id];
    if (!shell) throw new Error(`Missing shell ${id}`);
    return shell;
  });

  const helpByChallenge = new Map(
    shells.flatMap((shell) =>
      shell.placements.map((p) => {
        const help = getGuidedHelpPack(p.challengeId, 'uil');
        return help ? ([p.challengeId, help] as const) : null;
      }),
    ).filter(Boolean) as [string, NonNullable<ReturnType<typeof getGuidedHelpPack>>][],
  );

  const issues = shells.flatMap((shell) =>
    validateLessonShell(shell, CHALLENGE_BANK, helpByChallenge, true),
  );

  const profile = getClassProfile(level);
  for (const shell of shells) {
    for (const placement of shell.placements) {
      const def = CHALLENGE_BANK.get(placement.challengeId);
      if (def && def.difficulty > profile.maxDifficulty) {
        issues.push({
          severity: 'warning',
          code: 'DIFFICULTY_HIGH',
          message: `${placement.challengeId} difficulty ${def.difficulty} > max ${profile.maxDifficulty} for ${level}`,
          path: `levels/${level}/${placement.challengeId}`,
        });
      }
    }
  }

  return { ok: issues.every((i) => i.severity !== 'error'), issues };
}

export function validateAllLevelBundles() {
  const allIssues = CLASS_LEVEL_IDS.flatMap((level) => {
    const result = validateLevelBundle(level);
    return result.issues.map((i) => ({ ...i, path: i.path ?? `levels/${level}` }));
  });
  return { ok: allIssues.every((i) => i.severity !== 'error'), issues: allIssues };
}

export const LEVEL_CONTENT_IDS = CLASS_LEVEL_IDS.filter((id) => hasLevelContent(id));
