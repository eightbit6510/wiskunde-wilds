import { describe, expect, it } from 'vitest';
import { lesson1 } from '../data/lesson1';
import { lesson2 } from '../data/lesson2';
import { lesson3 } from '../data/lesson3';
import { lesson4 } from '../data/lesson4';
import { lesson5 } from '../data/lesson5';
import { lesson6 } from '../data/lesson6';
import { lesson7 } from '../data/lesson7';
import { lesson8 } from '../data/lesson8';
import { chapter1 } from '../data/part2/chapter1';
import { chapter2 } from '../data/part2/chapter2';
import { chapter3 } from '../data/part2/chapter3';
import { chapter4 } from '../data/part2/chapter4';
import { chapter5 } from '../data/part2/chapter5';
import { chapter6 } from '../data/part2/chapter6';
import { chapter7 } from '../data/part2/chapter7';
import { chapter8 } from '../data/part2/chapter8';
import {
  sideMissionKonijnenpad,
  sideMissionMaansteen,
  sideMissionUilenproef,
  sideMissionVossenhol,
} from '../data/part2/sideMissions';
import { lesson1Owl } from '../data/owl/lesson1';
import { lesson2Owl } from '../data/owl/lesson2';
import { lesson3Owl } from '../data/owl/lesson3';
import { lesson4Owl } from '../data/owl/lesson4';
import { lesson5Owl } from '../data/owl/lesson5';
import { lesson6Owl } from '../data/owl/lesson6';
import { lesson7Owl } from '../data/owl/lesson7';
import { lesson8Owl } from '../data/owl/lesson8';
import { withOwlHelp } from '../data/owl/types';
import {
  CONTENT_MIGRATED_LESSON_IDS,
  loadLessonFromContent,
  loadPart1LessonsFromContent,
  loadPart2LessonsFromContent,
  loadSideMissionsFromContent,
  PART1_MANIFEST,
  PART2_MANIFEST,
  SIDE_MANIFEST,
  validateMigratedContent,
} from './loader';
import {
  CLASS_LEVEL_IDS,
  CHALLENGES_PER_LEVEL,
  LEVEL_LESSON_COUNT,
  normalizeClassLevel,
} from './classLevels';
import { validateAllLevelBundles, validateLevelBundle, LEVEL_CONTENT_IDS, loadLessonsForClassLevel } from './levelLoader';

const LEGACY_PART1 = [
  withOwlHelp(lesson1, lesson1Owl),
  withOwlHelp(lesson2, lesson2Owl),
  withOwlHelp(lesson3, lesson3Owl),
  withOwlHelp(lesson4, lesson4Owl),
  withOwlHelp(lesson5, lesson5Owl),
  withOwlHelp(lesson6, lesson6Owl),
  withOwlHelp(lesson7, lesson7Owl),
  withOwlHelp(lesson8, lesson8Owl),
];

const LEGACY_PART2 = [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8];

const LEGACY_SIDE = [
  sideMissionVossenhol,
  sideMissionMaansteen,
  sideMissionUilenproef,
  sideMissionKonijnenpad,
];

const ALL_LEGACY = [...LEGACY_PART1, ...LEGACY_PART2, ...LEGACY_SIDE];

describe('content loader (Fase 1 — volledige migratie)', () => {
  it('covers all migrated lesson IDs from manifests', () => {
    expect(CONTENT_MIGRATED_LESSON_IDS).toEqual([
      ...PART1_MANIFEST.lessonIds,
      ...PART2_MANIFEST.lessonIds,
      ...SIDE_MANIFEST.lessonIds,
    ]);
    expect(CONTENT_MIGRATED_LESSON_IDS).toHaveLength(20);
  });

  it.each(CONTENT_MIGRATED_LESSON_IDS)('loads %s from JSON bundle', (lessonId) => {
    const loaded = loadLessonFromContent(lessonId);
    expect(loaded).toBeDefined();
    expect(loaded?.id).toBe(lessonId);
    expect(loaded?.challenges.length).toBeGreaterThan(0);
  });

  it.each(CONTENT_MIGRATED_LESSON_IDS)('matches legacy lesson content for %s', (lessonId) => {
    const legacy = ALL_LEGACY.find((l) => l.id === lessonId)!;
    const loaded = loadLessonFromContent(lessonId)!;
    expect(loaded).toEqual(legacy);
  });

  it('loads all adventures in manifest order', () => {
    expect(loadPart1LessonsFromContent().map((l) => l.id)).toEqual(PART1_MANIFEST.lessonIds);
    expect(loadPart2LessonsFromContent().map((l) => l.id)).toEqual(PART2_MANIFEST.lessonIds);
    expect(loadSideMissionsFromContent().map((l) => l.id)).toEqual(SIDE_MANIFEST.lessonIds);
  });

  it('keeps 116 stable unique challenge IDs', () => {
    const ids = [
      ...loadPart1LessonsFromContent(),
      ...loadPart2LessonsFromContent(),
      ...loadSideMissionsFromContent(),
    ].flatMap((l) => l.challenges.map((c) => c.id));
    expect(ids).toHaveLength(116);
    expect(new Set(ids).size).toBe(116);
  });

  it('validates migrated content without errors', () => {
    const result = validateMigratedContent();
    expect(result.ok).toBe(true);
    expect(result.issues.filter((i) => i.severity === 'error')).toEqual([]);
  });

  it('returns undefined for unknown lesson ids', () => {
    expect(loadLessonFromContent('onbekend')).toBeUndefined();
  });
});

describe('jaargroep level bundles (Fase 4)', () => {
  it('generates content for all 18 class levels', () => {
    expect(LEVEL_CONTENT_IDS).toHaveLength(CLASS_LEVEL_IDS.length);
    expect(LEVEL_CONTENT_IDS.sort()).toEqual([...CLASS_LEVEL_IDS].sort());
  });

  it.each(CLASS_LEVEL_IDS)('validates level bundle %s without errors', (level) => {
    const result = validateLevelBundle(level);
    expect(result.ok).toBe(true);
    expect(result.issues.filter((i) => i.severity === 'error')).toEqual([]);
  });

  it('validates all level bundles in one pass', () => {
    const result = validateAllLevelBundles();
    expect(result.ok).toBe(true);
  });

  it('has 40 challenges and 8 lessons per level', () => {
    for (const level of CLASS_LEVEL_IDS) {
      const result = validateLevelBundle(level);
      expect(result.ok).toBe(true);
    }
    expect(CHALLENGES_PER_LEVEL).toBe(40);
    expect(LEVEL_LESSON_COUNT).toBe(8);
  });

  it('migrates legacy havo-6 to havo-5', () => {
    expect(normalizeClassLevel('havo-6')).toBe('havo-5');
    expect(CLASS_LEVEL_IDS).not.toContain('havo-6');
  });

  it('gives every level challenge ≥3 owl help steps', () => {
    for (const level of CLASS_LEVEL_IDS) {
      const lessons = loadLessonsForClassLevel(level);
      for (const lesson of lessons) {
        for (const c of lesson.challenges) {
          expect(c.owlHelp?.steps.length ?? 0, c.id).toBeGreaterThanOrEqual(3);
          if (c.difficulty === 3) {
            expect(c.owlHelp?.steps.length ?? 0, c.id).toBeGreaterThanOrEqual(4);
          }
          expect(c.bonusVariants?.length ?? 0, c.id).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });
});
