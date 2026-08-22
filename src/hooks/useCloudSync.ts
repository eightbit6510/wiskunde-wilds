import { useEffect, useRef } from 'react';
import type { ProgressState, SettingsState } from '../types';

function buildSyncFingerprint(progress: ProgressState, settings: SettingsState): string {
  return JSON.stringify({ progress, settings });
}

/**
 * Debounced cloud sync — only runs when progress or settings actually changed.
 */
export function useCloudSync(input: {
  enabled: boolean;
  progress: ProgressState;
  settings: SettingsState;
  syncToCloud: (payload: {
    progress: ProgressState;
    settings: SettingsState;
  }) => Promise<boolean>;
  debounceMs?: number;
}) {
  const { enabled, progress, settings, syncToCloud, debounceMs = 2500 } = input;
  const lastSyncedRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncRef = useRef(syncToCloud);
  syncRef.current = syncToCloud;

  useEffect(() => {
    if (!enabled) {
      lastSyncedRef.current = null;
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const fingerprint = buildSyncFingerprint(progress, settings);

    // First render while logged in: baseline only, no upload
    if (lastSyncedRef.current === null) {
      lastSyncedRef.current = fingerprint;
      return;
    }

    if (fingerprint === lastSyncedRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void syncRef.current({ progress, settings }).then((ok) => {
        if (ok) lastSyncedRef.current = fingerprint;
      });
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, progress, settings, debounceMs]);
}
