import { useCallback, useEffect, useState } from 'react';
import type { SettingsState } from '../types';
import { DEFAULT_SETTINGS, STORAGE_KEYS, loadJson, saveJson } from '../utils/storage';

export function useSettings() {
  const [settings, setSettings] = useState<SettingsState>(() =>
    loadJson(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
  );

  useEffect(() => {
    saveJson(STORAGE_KEYS.settings, settings);
    document.documentElement.dataset.calm = settings.calmMode ? 'true' : 'false';
    document.documentElement.dataset.animations = settings.animationsEnabled
      ? 'true'
      : 'false';
  }, [settings]);

  const update = useCallback((patch: Partial<SettingsState>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  return { settings, update };
}

export type SettingsApi = ReturnType<typeof useSettings>;
