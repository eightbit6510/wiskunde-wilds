import type { ProgressState, SettingsState } from '../types';
import { loadPlayerSession } from './playerSession';

const SITE_VISITED_KEY = 'wiskunde-wilds-site-visited-v1';

export function hasMarkedSiteVisit(): boolean {
  try {
    return localStorage.getItem(SITE_VISITED_KEY) === '1';
  } catch {
    return false;
  }
}

export function markSiteVisited(): void {
  try {
    localStorage.setItem(SITE_VISITED_KEY, '1');
  } catch {
    // private mode / quota — ignore
  }
}

export function hasPriorLocalActivity(
  settings: SettingsState,
  progress: ProgressState,
): boolean {
  if (settings.classLevel) return true;
  if (progress.adventureStarted) return true;
  if (hasPlayProgress(progress)) return true;
  return false;
}

/** Echte speelvoortgang — niet alleen adventureStarted of kaart bekeken. */
export function hasPlayProgress(progress: ProgressState): boolean {
  return (
    progress.totalStars > 0 ||
    progress.totalXp > 0 ||
    progress.challengesSolved > 0 ||
    progress.completedChallenges.length > 0 ||
    progress.completedLessons.length > 0 ||
    progress.sessionStreak > 0 ||
    progress.bestSessionStreak > 0 ||
    progress.unlockedBadges.length > 0 ||
    progress.attempts.some((attempt) => attempt.correct)
  );
}

/** Eerste bezoek: toon inlog/aanmeld-wizard. Terugkerende spelers: niet automatisch. */
export function shouldAutoShowAuthWizard(input: {
  isLoggedIn: boolean;
  settings: SettingsState;
  progress: ProgressState;
}): boolean {
  if (input.isLoggedIn) return false;
  if (loadPlayerSession()) return false;
  if (hasMarkedSiteVisit()) return false;
  if (hasPriorLocalActivity(input.settings, input.progress)) return false;
  return true;
}
