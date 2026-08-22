export type {
  AdventureContentBundle,
  AdventureId,
  AdventureManifest,
  AdventureThemeId,
  ChallengeBankEntry,
  ChallengeDefinition,
  ChallengePlacement,
  ChallengeTypeId,
  ClassLevel,
  ClassLevelProfile,
  ContentSourceRef,
  ContentValidationIssue,
  ContentValidationResult,
  GuidedHelpPack,
  HelpPersona,
  HelpPersonaId,
  LessonShell,
  ResolvedChallenge,
  ResolvedLesson,
} from './content';
export { CONTENT_LAYER } from './content';

export type {
  AuthSession,
  NameAvailabilityResult,
  PlayerAccount,
  PlayerLoginInput,
  PlayerPrefs,
  PlayerProgressSnapshot,
  PlayerRecord,
  PlayerRegisterInput,
} from './player';
export { PIN_RULES, PLAYER_DATA_POLICY } from './player';

export type Topic =
  | 'algebra'
  | 'vergelijkingen'
  | 'formules'
  | 'breuken'
  | 'machten'
  | 'grafieken'
  | 'verbanden'
  | 'redeneren'
  | 'kwadratisch';

export type ChallengeType =
  | 'multiple-choice'
  | 'multi-select'
  | 'number-input'
  | 'text-input'
  | 'equation-steps'
  | 'matching'
  | 'sorting'
  | 'true-false'
  | 'graph-choice'
  | 'code-crack'
  | 'spot-error'
  | 'boss-battle';

export interface AnswerOption {
  id: string;
  label: string;
  /** Optional visual content for graph challenges */
  graphId?: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface EquationStep {
  prompt: string;
  options: AnswerOption[];
  correctId: string;
  resultDisplay: string;
}

export interface CodeCrackItem {
  expression: string;
  answer: number;
  letter: string;
}

export interface GraphSeriesPoint {
  x: number;
  y: number;
}

export interface GraphOption {
  id: string;
  label: string;
  points: GraphSeriesPoint[];
  type?: 'line' | 'scatter';
}

export interface BossQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'number-input' | 'true-false';
  options?: AnswerOption[];
  correctAnswer: string | number | boolean;
  explanation: string;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  /** Optional display title (e.g. review badge label) */
  title?: string;
  /** Marks a lighter recap challenge from Part 1 */
  reviewOfPart1?: boolean;
  /** XP awarded on first correct completion */
  xpReward?: number;
  question: string;
  optionalStory?: string;
  topic: Topic;
  difficulty: 1 | 2 | 3;
  starsAvailable: number;
  explanation: string;
  hint1: string;
  hint2: string;
  optionalWorkedFirstStep?: string;
  /** Single correct answer (string, number, or option id) */
  answer?: string | number | boolean;
  /** Alternative accepted text/number answers */
  acceptedAnswers?: (string | number)[];
  /** Multiple correct option ids */
  answers?: string[];
  answerOptions?: AnswerOption[];
  matchingPairs?: MatchingPair[];
  sortItems?: string[];
  correctOrder?: string[];
  equationSteps?: EquationStep[];
  codeItems?: CodeCrackItem[];
  secretWord?: string;
  graphOptions?: GraphOption[];
  tableData?: { headers: string[]; rows: (string | number)[][] };
  showVisualCompare?: boolean;
  visualBars?: { label: string; value: number }[];
  interactiveParabola?: {
    base: 'x2' | 'x2+2';
    xValues: number[];
  };
  bossQuestions?: BossQuestion[];
  sneakyNote?: string;
  /** Guided owl tutor session (optional). */
  owlHelp?: OwlHelp;
  /** Similar practice variants offered after owl help. */
  bonusVariants?: BonusVariant[];
}

export interface OwlHelpStep {
  explanation: string;
  question?: string;
  options?: AnswerOption[];
  correctAnswer?: string;
  successFeedback?: string;
  retryFeedback?: string;
}

export interface OwlHelp {
  intro: string;
  steps: OwlHelpStep[];
  conclusion: string;
}

/** Fase 2 alias — zelfde structuur als OwlHelp */
export type GuidedHelp = OwlHelp;
export type GuidedHelpStep = OwlHelpStep;

/** A same-skill practice variant with different numbers/variables. */
export interface BonusVariant {
  id: string;
  question: string;
  optionalStory?: string;
  answer: string | number | boolean;
  acceptedAnswers?: (string | number)[];
  answerOptions?: AnswerOption[];
  type?: 'text-input' | 'number-input' | 'multiple-choice' | 'true-false';
  hint1?: string;
  hint2?: string;
  explanation?: string;
}

export interface Lesson {
  id: string;
  order: number;
  areaName: string;
  title: string;
  emoji: string;
  intro: string;
  color: string;
  challenges: Challenge[];
  /** Optional: part1 | part2 | side | jaargroep-id */
  adventureId?: import('./content').AdventureId;
  /** Story blurb shown after completing this chapter */
  outroStory?: string;
  /** Short map teaser (esp. when locked / preview) */
  mapTeaser?: string;
}

export interface ChallengeAttempt {
  challengeId: string;
  lessonId: string;
  topic: Topic;
  attempts: number;
  usedHint: boolean;
  usedFirstStep: boolean;
  usedOwlHelp?: boolean;
  correct: boolean;
  starsEarned: number;
  xpEarned?: number;
  completedAt: string;
}

export interface TopicStats {
  tried: number;
  firstTryCorrect: number;
  withHintCorrect: number;
  wrongAttempts: number;
}

export interface ProgressState {
  adventureStarted: boolean;
  completedLessons: string[];
  completedChallenges: string[];
  challengeStars: Record<string, number>;
  attempts: ChallengeAttempt[];
  topicStats: Record<Topic, TopicStats>;
  totalStars: number;
  totalXp: number;
  challengesSolved: number;
  sessionStreak: number;
  bestSessionStreak: number;
  unlockedBadges: string[];
  lastPlayedAt: string | null;
  owlHelpUsedCount: number;
  owlHelpChallenges: string[];
  owlStarsSpent: number;
  owlBonusTried: number;
  owlBonusSolved: number;
  /** Fase 2 — generieke hulp-stats (gespiegeld met owl* velden) */
  guidedHelpUsedCount: number;
  guidedHelpChallenges: string[];
  guidedStarsSpent: number;
  guidedBonusTried: number;
  guidedBonusSolved: number;
  /** Schema version for migrations */
  progressVersion: number;
  /** Part 2 permanently unlocked */
  part2Unlocked: boolean;
  /** Unlock reveal modal already shown */
  part2UnlockSeen: boolean;
  /** Count of Part 1 review challenges solved in Part 2 */
  reviewSolvedCount: number;
  sideMissionsCompleted: string[];
  trainingSessionsDone: number;
  recentFailStreak: number;
  preferSuccessMoment: boolean;
}

export interface SettingsState {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  calmMode: boolean;
  /** Lokale jaargroep (offline of vóór cloud sync) */
  classLevel: import('./content').ClassLevel | null;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  /** Returns true when badge should unlock */
  check: (progress: ProgressState) => boolean;
}
