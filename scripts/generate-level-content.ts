/**
 * Genereer jaargroep-content: 18 levels × 40 sommen + uil-hulp + 8 lessen.
 * Run: npm run content:generate-levels
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildAllLevelBundles } from './level-content/buildLevelBundle';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const levelsRoot = join(root, 'src/content/adventures/levels');
const bankRoot = join(root, 'src/content/bank/challenges/levels');
const helpRoot = join(root, 'src/content/guided-help/uil');
const curriculumRoot = join(root, 'src/content/curriculum');

mkdirSync(bankRoot, { recursive: true });
mkdirSync(helpRoot, { recursive: true });
mkdirSync(curriculumRoot, { recursive: true });

function writeJson(path: string, data: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

const bundles = buildAllLevelBundles();
let challengeCount = 0;
let helpCount = 0;

for (const bundle of bundles) {
  const levelDir = join(levelsRoot, bundle.level);
  mkdirSync(join(levelDir, 'lessons'), { recursive: true });

  writeJson(join(levelDir, 'manifest.json'), bundle.manifest);

  for (const lesson of bundle.lessons) {
    writeJson(join(levelDir, 'lessons', `${lesson.id}.json`), lesson);
  }

  for (const challenge of bundle.challenges) {
    writeJson(join(bankRoot, `${challenge.id}.json`), challenge);
    challengeCount += 1;
  }

  for (const pack of bundle.helpPacks) {
    writeJson(join(helpRoot, `${pack.challengeId}.json`), pack);
    helpCount += 1;
  }
}

const profiles = Object.fromEntries(
  bundles.map((b) => [b.level, { topics: b.challenges.map((c) => c.topic), count: b.challenges.length }]),
);

writeJson(join(curriculumRoot, 'profiles.json'), profiles);

const matrix = bundles
  .map(
    (b) =>
      `| ${b.level} | ${b.manifest.subtitle} | ${b.challenges.length} sommen | ${b.lessons.length} lessen |`,
  )
  .join('\n');

writeFileSync(
  join(curriculumRoot, 'topics-matrix.md'),
  `# Jaargroep content dekking\n\n| Level | Subtitle | Sommen | Lessen |\n|-------|----------|--------|--------|\n${matrix}\n`,
  'utf8',
);

console.log(`Generated ${bundles.length} level bundles`);
console.log(`  ${challengeCount} challenges → ${bankRoot}`);
console.log(`  ${helpCount} uil help packs → ${helpRoot}`);
console.log(`  manifests + lessons → ${levelsRoot}`);
