import type { PlayerAccount, PlayerPrefs } from '../types/player';

const SESSION_KEY = 'wiskunde-wilds-player-session-v1';

export interface StoredPlayerSession {
  token: string;
  player: PlayerAccount;
  prefs: PlayerPrefs;
}

export function loadPlayerSession(): StoredPlayerSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredPlayerSession;
  } catch {
    return null;
  }
}

export function savePlayerSession(session: StoredPlayerSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearPlayerSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
