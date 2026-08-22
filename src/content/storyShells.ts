import type { LessonShell } from '../types/content';
import part1Manifest from './adventures/part1/manifest.json';
import part2Manifest from './adventures/part2/manifest.json';
import sideManifest from './adventures/side/manifest.json';
import { unwrapJsonModule } from './jsonModule';

const shellModules = import.meta.glob<{ default: LessonShell } | LessonShell>(
  [
    './adventures/part1/lessons/*.json',
    './adventures/part2/lessons/*.json',
    './adventures/side/lessons/*.json',
  ],
  { eager: true },
);

const STORY_SHELLS: Record<string, LessonShell> = {};
for (const mod of Object.values(shellModules)) {
  const shell = unwrapJsonModule(mod);
  STORY_SHELLS[shell.id] = shell;
}

export const PART1_STORY_IDS = [
  'vossenpad',
  'wolvenkluis',
  'lynx',
  'konijnenhol',
  'uilenlab',
  'bergmissie',
  'maanlicht',
  'sterrentempel',
] as const;

export const PART2_STORY_IDS = [
  'schaduwgrot',
  'ravenpad',
  'rivier',
  'paraboolvallei',
  'observatorium',
  'runenruines',
  'doolhof',
  'nachtmissie',
] as const;

export const SIDE_STORY_IDS = [
  'zij-vossenhol',
  'zij-maansteen',
  'zij-uilenproef',
  'zij-konijnenpad',
] as const;

export type StoryArc = 'part1' | 'part2' | 'side';

export function getStoryLessonShell(arc: StoryArc, id: string): LessonShell | undefined {
  return STORY_SHELLS[id];
}

export function storyOptionalStoryFromShell(shell: LessonShell, slot: number): string | undefined {
  const placement = [...shell.placements].sort((a, b) => a.sortOrder - b.sortOrder)[slot];
  return placement?.optionalStory;
}

export const LEGACY_PART1_IDS = unwrapJsonModule(part1Manifest).lessonIds;
export const LEGACY_PART2_IDS = unwrapJsonModule(part2Manifest).lessonIds;
export const LEGACY_SIDE_IDS = unwrapJsonModule(sideManifest).lessonIds;
