/**
 * Fase 0 — Content architecture types
 *
 * Scheidt pure wiskunde (bank) van verhaal (shell/placement) en hulp (persona).
 * Bestaande runtime types (`Challenge`, `Lesson`) blijven intact tot Fase 1 migratie.
 */

import type {
  BonusVariant,
  Challenge,
  ChallengeType,
  OwlHelp,
  Topic,
} from './index';

/** Stable ID voor een avontuur-thema (bos, race, detective, …) */
export type AdventureThemeId = 'day' | 'night' | 'race' | 'detective';

/** Avontuur in de app (Deel I, Deel II, toekomstige thema's) */
export type AdventureId = 'part1' | 'part2' | string;

/** Klas/niveau — geen school-PII, alleen moeilijkheidsprofiel (Fase 4) */
export type ClassLevel =
  | 'groep-6'
  | 'groep-7'
  | 'groep-8'
  | 'mavo-1'
  | 'mavo-2'
  | 'mavo-3'
  | 'mavo-4'
  | 'havo-1'
  | 'havo-2'
  | 'havo-3'
  | 'havo-4'
  | 'havo-5'
  | 'vwo-1'
  | 'vwo-2'
  | 'vwo-3'
  | 'vwo-4'
  | 'vwo-5'
  | 'vwo-6';

/** Hulppersona (uil, detective, pitstop — Fase 2) */
export type HelpPersonaId = 'uil' | 'detective' | 'pitstop';

/**
 * Pure wiskunde — geen verhaal, geen uil, geen review-flag.
 * Wordt opgeslagen in de challenge bank (Fase 1: JSON in repo).
 */
export type ChallengeDefinition = Omit<
  Challenge,
  'optionalStory' | 'owlHelp' | 'bonusVariants' | 'reviewOfPart1' | 'title' | 'xpReward'
> & {
  /** Optioneel: beperk tot specifieke jaargroepen */
  classLevels?: ClassLevel[];
};

/**
 * Verhaal-overlay: koppelt een bank-challenge aan een les/avontuur.
 */
export interface ChallengePlacement {
  challengeId: string;
  /** Verhaaltekst specifiek voor dit avontuur / deze les */
  optionalStory?: string;
  /** Korte titel op de kaart (bijv. review-badge) */
  title?: string;
  /** Herhalingsvraag uit eerder deel — engine-gedrag */
  reviewOfPart1?: boolean;
  /** XP override; anders engine-default */
  xpReward?: number;
  /** Sorteervolgorde binnen de les (0-based) */
  sortOrder: number;
}

/**
 * Les = verhaal-shell + lijst placements (geen ingebakken challenges).
 */
export interface LessonShell {
  id: string;
  adventureId: AdventureId;
  order: number;
  areaName: string;
  title: string;
  emoji: string;
  intro: string;
  color: string;
  outroStory?: string;
  mapTeaser?: string;
  placements: ChallengePlacement[];
}

/**
 * Avontuur-manifest — kaart, unlock, persona, lessen.
 */
export interface AdventureManifest {
  id: AdventureId;
  title: string;
  subtitle: string;
  theme: AdventureThemeId;
  helpPersonaId: HelpPersonaId;
  /** Lesson IDs in volgorde op de kaart */
  lessonIds: string[];
  /** Optionele side mission lesson IDs */
  sideMissionIds?: string[];
  /** Unlock-regel (Fase 1+: verwijzing naar engine-functie of rule id) */
  unlockRuleId?: 'part1-complete' | 'always' | string;
}

/** UI-teksten + mascotte voor guided help (Fase 2) */
export interface HelpPersona {
  id: HelpPersonaId;
  buttonLabel: string;
  confirmTitle: string;
  confirmBody: string;
  confirmTitleNoStars: string;
  confirmBodyNoStars: string;
  confirmAffordTitle: string;
  confirmAffordBody: string;
  confirmYesLabel: string;
  confirmNoLabel: string;
  tryHintLabel: string;
  backToQuestionLabel: string;
  helpModalTitle: string;
  helpModalSubtitle: string;
  finishHelpLabel: string;
  bonusIntro: string;
  bonusFoundTitle: string;
  bonusWithHelpNote: string;
  bonusAcceptLabel: string;
  bonusDeclineLabel: string;
  bonusSelfTryTitle: string;
  bonusSelfTryBody: string;
  bonusWrongFallback: string;
  bonusSuccessNote: string;
  starCostLabel: string;
  xpReducedNote: string;
  /** Key voor SVG/component — geen binary in JSON */
  mascotKey: 'owl' | 'detective' | 'mechanic';
  themeClass?: string;
}

/** Guided help + bonus per challenge + persona */
export interface GuidedHelpPack {
  challengeId: string;
  personaId: HelpPersonaId;
  guidedHelp: OwlHelp;
  bonusVariants: BonusVariant[];
}

/** Niveau-config: welke topics/moeilijkheid (Fase 4) */
export interface ClassLevelProfile {
  id: ClassLevel;
  label: string;
  maxDifficulty: 1 | 2 | 3;
  topicsUnlocked: Topic[];
  reviewRatio: number;
}

/** Runtime: bank + placement + optional help → bestaande Challenge */
export interface ResolvedChallenge extends ChallengeDefinition {
  optionalStory?: string;
  title?: string;
  reviewOfPart1?: boolean;
  xpReward?: number;
  owlHelp?: OwlHelp;
  bonusVariants?: BonusVariant[];
}

/** Runtime: shell + resolved challenges → bestaande Lesson */
export interface ResolvedLesson extends Omit<LessonShell, 'placements'> {
  challenges: ResolvedChallenge[];
}

/** Content bundle voor één avontuur (loader output Fase 1) */
export interface AdventureContentBundle {
  manifest: AdventureManifest;
  lessons: ResolvedLesson[];
  persona: HelpPersona;
}

/** Metadata voor migratie / CMS (Fase 1+) */
export interface ContentSourceRef {
  /** Huidig TS-bestand of toekomstig JSON-pad */
  legacyFile?: string;
  contentVersion: number;
  migratedAt?: string;
}

export interface ChallengeBankEntry extends ChallengeDefinition {
  source?: ContentSourceRef;
}

/** Validatie-resultaat (Fase 1 CLI / Fase 5 CMS) */
export interface ContentValidationIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  path?: string;
}

export interface ContentValidationResult {
  ok: boolean;
  issues: ContentValidationIssue[];
}

/** Helper: welke velden horen waar (documentatie in code) */
export const CONTENT_LAYER = {
  bank: [
    'id',
    'type',
    'topic',
    'difficulty',
    'question',
    'answer',
    'hints',
    'explanation',
    'type-specific fields',
  ] as const,
  placement: ['challengeId', 'optionalStory', 'title', 'reviewOfPart1', 'xpReward', 'sortOrder'] as const,
  shell: ['id', 'areaName', 'title', 'emoji', 'intro', 'color', 'outroStory', 'mapTeaser'] as const,
  guidedHelp: ['personaId', 'guidedHelp', 'bonusVariants'] as const,
  engine: ['renderers', 'validation', 'progress', 'unlock', 'badges'] as const,
} as const;

export type ChallengeTypeId = ChallengeType;
