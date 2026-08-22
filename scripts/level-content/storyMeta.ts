/**
 * Legacy avontuur-shells — metadata voor Deel I / II / zijpaden.
 * Gebruikt bij content-generatie om jaargroep-lessen het bos-verhaal te geven.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LessonShell } from '../../src/types/content';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

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

const shellCache = new Map<string, LessonShell>();

export function loadStoryShell(arc: StoryArc, id: string): LessonShell {
  const key = `${arc}:${id}`;
  const cached = shellCache.get(key);
  if (cached) return cached;
  const path = join(root, 'src/content/adventures', arc, 'lessons', `${id}.json`);
  const shell = JSON.parse(readFileSync(path, 'utf8')) as LessonShell;
  shellCache.set(key, shell);
  return shell;
}

export function storyOptionalStory(
  storyShell: LessonShell,
  slot: number,
): string | undefined {
  const placement = [...storyShell.placements]
    .sort((a, b) => a.sortOrder - b.sortOrder)[slot];
  return placement?.optionalStory;
}
