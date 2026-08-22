/**
 * Export avontuur-sommen + Uil-uitwerkingen naar CSV.
 * Run: npx vite-node scripts/export-adventure-csv.ts
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLASS_LEVEL_IDS } from '../src/content/classLevels';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const levelsRoot = join(root, 'src/content/adventures/levels');
const bankRoot = join(root, 'src/content/bank/challenges/levels');
const helpRoot = join(root, 'src/content/guided-help/uil');
const outDir = join(root, 'exports');

type Challenge = {
  id: string;
  type: string;
  topic: string;
  difficulty: number;
  question: string;
  answer?: unknown;
  answers?: string[];
  answerOptions?: { id: string; label: string }[];
  hint1?: string;
  hint2?: string;
  explanation?: string;
  bossQuestions?: unknown[];
  codeItems?: { expression: string; answer: number; letter: string }[];
  sortItems?: string[];
  correctOrder?: string[];
};

type HelpPack = {
  challengeId: string;
  guidedHelp?: {
    intro?: string;
    conclusion?: string;
    steps?: {
      explanation?: string;
      question?: string;
      options?: { id: string; label: string }[];
      correctAnswer?: string;
      successFeedback?: string;
      retryFeedback?: string;
    }[];
  };
};

type LessonShell = {
  id: string;
  order: number;
  areaName: string;
  title: string;
  emoji?: string;
  intro?: string;
  placements: {
    challengeId: string;
    optionalStory?: string;
    sortOrder: number;
    reviewOfPart1?: boolean;
  }[];
};

type Manifest = {
  id: string;
  lessonIds: string[];
  part2LessonIds?: string[];
};

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function csvEscape(value: string): string {
  const s = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function formatAnswer(c: Challenge): string {
  if (c.answers?.length) {
    const labels = c.answers.map((id) => c.answerOptions?.find((o) => o.id === id)?.label ?? id);
    return labels.join(' | ');
  }
  if (c.answerOptions?.length && c.answer !== undefined) {
    const opt = c.answerOptions.find((o) => o.id === String(c.answer));
    if (opt) return opt.label;
  }
  if (c.type === 'true-false') return c.answer === true || c.answer === 'true' ? 'Waar' : 'Onwaar';
  if (c.codeItems?.length) {
    return c.codeItems.map((i) => `${i.expression} → ${i.answer} (${i.letter})`).join(' ; ');
  }
  if (c.correctOrder?.length) return c.correctOrder.join(' → ');
  if (c.bossQuestions?.length) return `${c.bossQuestions.length} boss-vragen`;
  return c.answer === undefined || c.answer === null ? '' : String(c.answer);
}

function formatOptions(c: Challenge): string {
  if (c.answerOptions?.length) {
    return c.answerOptions.map((o) => `${o.id}: ${o.label}`).join(' | ');
  }
  if (c.codeItems?.length) {
    return c.codeItems.map((i) => i.expression).join(' | ');
  }
  if (c.sortItems?.length) return c.sortItems.join(' | ');
  return '';
}

function formatOwlHelp(help: HelpPack | undefined): string {
  if (!help?.guidedHelp) return '';
  const g = help.guidedHelp;
  const parts: string[] = [];
  if (g.intro) parts.push(`INTRO: ${g.intro}`);
  (g.steps ?? []).forEach((step, i) => {
    const opts = (step.options ?? [])
      .map((o) => `${o.id === step.correctAnswer ? '✓' : '·'} ${o.label}`)
      .join(' / ');
    parts.push(
      [
        `STAP ${i + 1}: ${step.explanation ?? ''}`.trim(),
        step.question ? `Vraag: ${step.question}` : '',
        opts ? `Keuzes: ${opts}` : '',
        step.successFeedback ? `Goed: ${step.successFeedback}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    );
  });
  if (g.conclusion) parts.push(`CONCLUSIE: ${g.conclusion}`);
  return parts.join('\n\n');
}

const headers = [
  'deel',
  'les_nummer',
  'gebied',
  'les_titel',
  'slot',
  'verhaal',
  'review_deel1',
  'jaarlaag',
  'challenge_id',
  'type',
  'topic',
  'moeilijkheid',
  'vraag',
  'antwoord_opties',
  'juiste_antwoord',
  'hint1',
  'hint2',
  'uitleg',
  'uil_uitwerking',
] as const;

const rows: string[] = [headers.join(',')];

for (const level of CLASS_LEVEL_IDS) {
  const manifestPath = join(levelsRoot, level, 'manifest.json');
  const manifest = readJson<Manifest>(manifestPath);
  const lessonEntries: { deel: 'I' | 'II'; id: string }[] = [
    ...manifest.lessonIds.map((id) => ({ deel: 'I' as const, id })),
    ...(manifest.part2LessonIds ?? []).map((id) => ({ deel: 'II' as const, id })),
  ];

  for (const entry of lessonEntries) {
    const lesson = readJson<LessonShell>(join(levelsRoot, level, 'lessons', `${entry.id}.json`));
    const placements = [...lesson.placements].sort((a, b) => a.sortOrder - b.sortOrder);

    for (const placement of placements) {
      const challenge = readJson<Challenge>(join(bankRoot, `${placement.challengeId}.json`));
      let help: HelpPack | undefined;
      try {
        help = readJson<HelpPack>(join(helpRoot, `${placement.challengeId}.json`));
      } catch {
        help = undefined;
      }

      const values = [
        entry.deel,
        String(lesson.order),
        lesson.areaName,
        lesson.title,
        String(placement.sortOrder + 1),
        placement.optionalStory ?? '',
        placement.reviewOfPart1 ? 'ja' : 'nee',
        level,
        challenge.id,
        challenge.type,
        challenge.topic,
        String(challenge.difficulty),
        challenge.question,
        formatOptions(challenge),
        formatAnswer(challenge),
        challenge.hint1 ?? '',
        challenge.hint2 ?? '',
        challenge.explanation ?? '',
        formatOwlHelp(help),
      ];

      rows.push(values.map((v) => csvEscape(String(v))).join(','));
    }
  }
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'avontuur-sommen-uil.csv');
writeFileSync(outPath, `${rows.join('\n')}\n`, 'utf8');

const lessonCount = readdirSync(join(levelsRoot, 'groep-8', 'lessons')).length;
console.log(`Wrote ${rows.length - 1} rows → ${outPath}`);
console.log(`(18 jaargroepen × ~${lessonCount} lessen × 5 slots)`);
