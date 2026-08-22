/**
 * Legacy TS → JSON (Deel I + Deel II).
 * Run: npm run content:export
 */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { lesson1 } from '../src/data/lesson1';
import { lesson2 } from '../src/data/lesson2';
import { lesson3 } from '../src/data/lesson3';
import { lesson4 } from '../src/data/lesson4';
import { lesson5 } from '../src/data/lesson5';
import { lesson6 } from '../src/data/lesson6';
import { lesson7 } from '../src/data/lesson7';
import { lesson8 } from '../src/data/lesson8';
import { chapter1 } from '../src/data/part2/chapter1';
import { chapter2 } from '../src/data/part2/chapter2';
import { chapter3 } from '../src/data/part2/chapter3';
import { chapter4 } from '../src/data/part2/chapter4';
import { chapter5 } from '../src/data/part2/chapter5';
import { chapter6 } from '../src/data/part2/chapter6';
import { chapter7 } from '../src/data/part2/chapter7';
import { chapter8 } from '../src/data/part2/chapter8';
import { part2SideMissions } from '../src/data/part2/sideMissions';
import { lesson1Owl } from '../src/data/owl/lesson1';
import { lesson2Owl } from '../src/data/owl/lesson2';
import { lesson3Owl } from '../src/data/owl/lesson3';
import { lesson4Owl } from '../src/data/owl/lesson4';
import { lesson5Owl } from '../src/data/owl/lesson5';
import { lesson6Owl } from '../src/data/owl/lesson6';
import { lesson7Owl } from '../src/data/owl/lesson7';
import { lesson8Owl } from '../src/data/owl/lesson8';
import type { OwlPack } from '../src/data/owl/types';
import type { Lesson } from '../src/types';
import { exportLesson } from './export-utils';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankDir = join(root, 'src/content/bank/challenges');
const helpDir = join(root, 'src/content/guided-help/uil');
const part1LessonDir = join(root, 'src/content/adventures/part1/lessons');
const part2LessonDir = join(root, 'src/content/adventures/part2/lessons');
const sideLessonDir = join(root, 'src/content/adventures/side/lessons');

mkdirSync(bankDir, { recursive: true });
mkdirSync(helpDir, { recursive: true });
mkdirSync(part1LessonDir, { recursive: true });
mkdirSync(part2LessonDir, { recursive: true });
mkdirSync(sideLessonDir, { recursive: true });

const dirs = { bankDir, helpDir, lessonDir: part1LessonDir };

const PART1_SOURCES: { lesson: Lesson; owl: Record<string, OwlPack> }[] = [
  { lesson: lesson1, owl: lesson1Owl },
  { lesson: lesson2, owl: lesson2Owl },
  { lesson: lesson3, owl: lesson3Owl },
  { lesson: lesson4, owl: lesson4Owl },
  { lesson: lesson5, owl: lesson5Owl },
  { lesson: lesson6, owl: lesson6Owl },
  { lesson: lesson7, owl: lesson7Owl },
  { lesson: lesson8, owl: lesson8Owl },
];

const PART2_SOURCES: Lesson[] = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
];

const SIDE_SOURCES: Lesson[] = part2SideMissions;

console.log('Exporting Deel I → JSON');
let total = 0;
for (const source of PART1_SOURCES) {
  exportLesson(source.lesson, 'part1', dirs, source.owl);
  console.log(`  ${source.lesson.id}: ${source.lesson.challenges.length} challenges`);
  total += source.lesson.challenges.length;
}

console.log('Exporting Deel II → JSON');
for (const lesson of PART2_SOURCES) {
  exportLesson(lesson, 'part2', { ...dirs, lessonDir: part2LessonDir });
  console.log(`  ${lesson.id}: ${lesson.challenges.length} challenges`);
  total += lesson.challenges.length;
}

console.log('Exporting zijpaden → JSON');
for (const lesson of SIDE_SOURCES) {
  exportLesson(lesson, 'side', { ...dirs, lessonDir: sideLessonDir });
  console.log(`  ${lesson.id}: ${lesson.challenges.length} challenges`);
  total += lesson.challenges.length;
}

console.log(
  `Done: ${PART1_SOURCES.length + PART2_SOURCES.length + SIDE_SOURCES.length} lessons, ${total} challenges`,
);
