import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { createEmptyProgress, DEFAULT_SETTINGS } from './storage';
import {
  hasMarkedSiteVisit,
  hasPriorLocalActivity,
  markSiteVisited,
  shouldAutoShowAuthWizard,
} from './siteVisit';

function mockLocalStorage() {
  const memory = new Map<string, string>();
  const original = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memory.set(key, value);
      },
      removeItem: (key: string) => {
        memory.delete(key);
      },
      clear: () => {
        memory.clear();
      },
    },
  });
  return () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: original,
    });
  };
}

describe('siteVisit', () => {
  let restoreStorage: () => void;

  beforeEach(() => {
    restoreStorage = mockLocalStorage();
    localStorage.clear();
  });

  afterEach(() => {
    restoreStorage();
  });

  it('detects prior local activity', () => {
    expect(hasPriorLocalActivity(DEFAULT_SETTINGS, createEmptyProgress())).toBe(false);
    expect(
      hasPriorLocalActivity({ ...DEFAULT_SETTINGS, classLevel: 'groep-6' }, createEmptyProgress()),
    ).toBe(true);
    expect(
      hasPriorLocalActivity(DEFAULT_SETTINGS, {
        ...createEmptyProgress(),
        adventureStarted: true,
      }),
    ).toBe(true);
  });

  it('shows wizard only on first visit without account or progress', () => {
    expect(
      shouldAutoShowAuthWizard({
        isLoggedIn: false,
        settings: DEFAULT_SETTINGS,
        progress: createEmptyProgress(),
      }),
    ).toBe(true);
  });

  it('skips wizard for returning visitors', () => {
    markSiteVisited();
    expect(
      shouldAutoShowAuthWizard({
        isLoggedIn: false,
        settings: DEFAULT_SETTINGS,
        progress: createEmptyProgress(),
      }),
    ).toBe(false);
  });

  it('skips wizard when logged in or local progress exists', () => {
    expect(
      shouldAutoShowAuthWizard({
        isLoggedIn: true,
        settings: DEFAULT_SETTINGS,
        progress: createEmptyProgress(),
      }),
    ).toBe(false);

    expect(
      shouldAutoShowAuthWizard({
        isLoggedIn: false,
        settings: { ...DEFAULT_SETTINGS, classLevel: 'groep-7' },
        progress: createEmptyProgress(),
      }),
    ).toBe(false);
  });

  it('persists visit marker', () => {
    expect(hasMarkedSiteVisit()).toBe(false);
    markSiteVisited();
    expect(hasMarkedSiteVisit()).toBe(true);
  });
});
