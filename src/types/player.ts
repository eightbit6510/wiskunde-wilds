/**
 * Fase 0 — Player & sync types (anoniem, geen PII)
 *
 * Geen e-mail, leeftijd, echte naam of school-ID.
 * PIN wordt alleen server-side gehashed opgeslagen — nooit in ProgressState.
 */

import type { AdventureId, ClassLevel } from './content';
import type { ProgressState, SettingsState } from './index';

/** Server record — nooit PIN plaintext */
export interface PlayerRecord {
  id: string;
  displayName: string;
  displayNameNormalized: string;
  pinHash: string;
  createdAt: string;
  lastSeenAt: string;
}

/** Client-safe speler (na login) */
export interface PlayerAccount {
  id: string;
  displayName: string;
  createdAt: string;
}

/** Voorkeuren — klas + avontuur (Fase 3–4) */
export interface PlayerPrefs {
  classLevel: ClassLevel | null;
  adventureId: AdventureId;
  settings: SettingsState;
  updatedAt: string;
}

/** Cloud sync blob — zelfde vorm als localStorage progress */
export interface PlayerProgressSnapshot {
  playerId: string;
  progress: ProgressState;
  progressVersion: number;
  updatedAt: string;
}

/** Registratie-flow (kinder-UI) */
export interface PlayerRegisterInput {
  displayName: string;
  pin: string;
  classLevel?: ClassLevel | null;
  adventureId?: AdventureId;
}

export interface PlayerLoginInput {
  displayName: string;
  pin: string;
}

export interface NameAvailabilityResult {
  available: boolean;
  suggestion?: string;
}

/** API responses (Fase 3) */
export interface AuthSession {
  token: string;
  player: PlayerAccount;
  prefs: PlayerPrefs;
  progress: ProgressState;
}

/** Wat wél / niet opslaan — contract voor backend & privacy */
export const PLAYER_DATA_POLICY = {
  store: ['displayName', 'pinHash', 'progress_json', 'classLevel', 'adventureId', 'settings'] as const,
  neverStore: [
    'email',
    'phone',
    'realName',
    'age',
    'birthDate',
    'schoolName',
    'address',
    'pinPlaintext',
  ] as const,
} as const;

/** PIN-regels kind-UI */
export const PIN_RULES = {
  minLength: 4,
  maxLength: 6,
  /** Alleen cijfers aanbevolen voor jonge spelers */
  numericOnly: true,
} as const;
