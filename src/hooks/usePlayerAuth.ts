import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProgressState, SettingsState } from '../types';
import type { AdventureId, ClassLevel } from '../types/content';
import type { AuthSession, PlayerPrefs } from '../types/player';
import {
  checkDisplayName,
  loadCloudProgress,
  loginPlayer,
  logoutPlayer,
  registerPlayer,
  saveCloudProgress,
} from '../services/playerApi';
import {
  clearPlayerSession,
  loadPlayerSession,
  savePlayerSession,
  type StoredPlayerSession,
} from '../utils/playerSession';
import { resolveProgressOnLogin } from '../utils/progressMerge';

export type SyncStatus = 'idle' | 'syncing' | 'saved' | 'error';

export function usePlayerAuth() {
  const [session, setSession] = useState<StoredPlayerSession | null>(() => loadPlayerSession());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const syncLock = useRef(false);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const persistSession = useCallback((data: AuthSession) => {
    const stored: StoredPlayerSession = {
      token: data.token,
      player: data.player,
      prefs: data.prefs,
    };
    savePlayerSession(stored);
    setSession(stored);
  }, []);

  const register = useCallback(
    async (input: {
      displayName: string;
      pin: string;
      classLevel?: ClassLevel | null;
      adventureId?: AdventureId;
      localProgress: ProgressState;
    }) => {
      const response = await registerPlayer({
        displayName: input.displayName,
        pin: input.pin,
        classLevel: input.classLevel,
        adventureId: input.adventureId,
        progress: input.localProgress,
      });
      persistSession(response);
      return response;
    },
    [persistSession],
  );

  const login = useCallback(
    async (input: { displayName: string; pin: string; localProgress: ProgressState }) => {
      const response = await loginPlayer(input);
      persistSession(response);
      const merged = resolveProgressOnLogin(
        input.localProgress,
        response.progress,
        response.progressUpdatedAt ?? null,
      );
      return { ...response, mergedProgress: merged };
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    try {
      await logoutPlayer();
    } catch {
      // Offline logout still clears local session
    }
    clearPlayerSession();
    setSession(null);
    setSyncStatus('idle');
    setSyncError(null);
  }, []);

  const checkName = useCallback(async (name: string) => {
    return checkDisplayName(name);
  }, []);

  const syncToCloud = useCallback(
    async (input: {
      progress: ProgressState;
      settings: SettingsState;
      classLevel?: ClassLevel | null;
      adventureId?: AdventureId;
    }): Promise<boolean> => {
      const current = sessionRef.current;
      if (!current || syncLock.current) return false;
      syncLock.current = true;
      setSyncStatus('syncing');
      setSyncError(null);

      try {
        const result = await saveCloudProgress({
          progress: input.progress,
          settings: input.settings,
          classLevel: input.classLevel ?? current.prefs.classLevel,
          adventureId: input.adventureId ?? current.prefs.adventureId,
        });

        const nextPrefs: PlayerPrefs = {
          ...current.prefs,
          classLevel: input.classLevel ?? current.prefs.classLevel,
          adventureId: input.adventureId ?? current.prefs.adventureId,
          settings: input.settings,
          updatedAt: result.updatedAt,
        };

        const prefsChanged =
          nextPrefs.classLevel !== current.prefs.classLevel ||
          nextPrefs.adventureId !== current.prefs.adventureId ||
          JSON.stringify(nextPrefs.settings) !== JSON.stringify(current.prefs.settings);

        if (prefsChanged) {
          const nextSession = { ...current, prefs: nextPrefs };
          savePlayerSession(nextSession);
          setSession(nextSession);
        }

        setSyncStatus('saved');
        return true;
      } catch (err) {
        setSyncStatus('error');
        setSyncError(err instanceof Error ? err.message : 'Sync mislukt.');
        return false;
      } finally {
        syncLock.current = false;
      }
    },
    [],
  );

  const refreshFromCloud = useCallback(async (localProgress: ProgressState) => {
    if (!session) return null;
    const remote = await loadCloudProgress();
    return resolveProgressOnLogin(
      localProgress,
      remote.progress,
      remote.progressUpdatedAt,
    );
  }, [session]);

  useEffect(() => {
    if (syncStatus !== 'saved') return;
    const timer = setTimeout(() => setSyncStatus('idle'), 3000);
    return () => clearTimeout(timer);
  }, [syncStatus]);

  return {
    session,
    isLoggedIn: !!session,
    syncStatus,
    syncError,
    register,
    login,
    logout,
    checkName,
    syncToCloud,
    refreshFromCloud,
    updatePrefs: useCallback((patch: Partial<PlayerPrefs>) => {
      setSession((current) => {
        if (!current) return current;
        const next = { ...current, prefs: { ...current.prefs, ...patch } };
        savePlayerSession(next);
        return next;
      });
    }, []),
  };
}

export type PlayerAuthApi = ReturnType<typeof usePlayerAuth>;
