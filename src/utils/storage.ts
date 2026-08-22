import type { ProgressState, SettingsState, Topic, TopicStats } from '../types';
import { migrateProgress, PROGRESS_VERSION } from './progressMigration';

export const STORAGE_KEYS = {
  progress: 'wiskunde-wilds-progress-v1',
  settings: 'wiskunde-wilds-settings-v1',
} as const;

export const TOPICS: Topic[] = [
  'algebra',
  'vergelijkingen',
  'formules',
  'breuken',
  'machten',
  'grafieken',
  'verbanden',
  'redeneren',
  'kwadratisch',
];

export const TOPIC_LABELS: Record<Topic, string> = {
  algebra: 'Algebra',
  vergelijkingen: 'Vergelijkingen',
  formules: 'Formules',
  breuken: 'Breuken',
  machten: 'Machten & wortels',
  grafieken: 'Grafieken',
  verbanden: 'Verbanden',
  redeneren: 'Redeneren',
  kwadratisch: 'Kwadratisch (VWO 3)',
};

export function emptyTopicStats(): TopicStats {
  return { tried: 0, firstTryCorrect: 0, withHintCorrect: 0, wrongAttempts: 0 };
}

export function createEmptyProgress(): ProgressState {
  const topicStats = {} as Record<Topic, TopicStats>;
  for (const topic of TOPICS) {
    topicStats[topic] = emptyTopicStats();
  }
  return {
    adventureStarted: false,
    completedLessons: [],
    completedChallenges: [],
    challengeStars: {},
    attempts: [],
    topicStats,
    totalStars: 0,
    totalXp: 0,
    challengesSolved: 0,
    sessionStreak: 0,
    bestSessionStreak: 0,
    unlockedBadges: [],
    lastPlayedAt: null,
    owlHelpUsedCount: 0,
    owlHelpChallenges: [],
    owlStarsSpent: 0,
    owlBonusTried: 0,
    owlBonusSolved: 0,
    guidedHelpUsedCount: 0,
    guidedHelpChallenges: [],
    guidedStarsSpent: 0,
    guidedBonusTried: 0,
    guidedBonusSolved: 0,
    progressVersion: PROGRESS_VERSION,
    part2Unlocked: false,
    part2UnlockSeen: false,
    reviewSolvedCount: 0,
    sideMissionsCompleted: [],
    trainingSessionsDone: 0,
    recentFailStreak: 0,
    preferSuccessMoment: false,
  };
}

export const DEFAULT_SETTINGS: SettingsState = {
  soundEnabled: true,
  animationsEnabled: true,
  calmMode: false,
  classLevel: null,
};

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.progress);
    if (!raw) return createEmptyProgress();
    return migrateProgress(JSON.parse(raw) as Partial<ProgressState>);
  } catch {
    return createEmptyProgress();
  }
}

export function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private mode — try a compact retry for progress
    try {
      if (key === STORAGE_KEYS.progress && value && typeof value === 'object') {
        const compact = {
          ...(value as Record<string, unknown>),
          attempts: Array.isArray((value as { attempts?: unknown[] }).attempts)
            ? (value as { attempts: unknown[] }).attempts.slice(-200)
            : [],
        };
        localStorage.setItem(key, JSON.stringify(compact));
      }
    } catch {
      // ignore
    }
  }
}

export function resetProgressStorage(): void {
  localStorage.removeItem(STORAGE_KEYS.progress);
}
