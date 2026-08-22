import type { ClassLevel } from '../types/content';
import type { PlayerAuthApi } from '../hooks/usePlayerAuth';
import type { SettingsApi } from '../hooks/useSettings';
import { normalizeClassLevel } from '../content/classLevels';

/** Resolve active jaargroep: cloud prefs → local settings → null */
export function getActiveClassLevel(
  authApi: Pick<PlayerAuthApi, 'session'>,
  settingsApi: Pick<SettingsApi, 'settings'>,
): ClassLevel | null {
  const fromSession = normalizeClassLevel(authApi.session?.prefs.classLevel);
  if (fromSession) return fromSession;
  const fromSettings = normalizeClassLevel(settingsApi.settings.classLevel);
  if (fromSettings) return fromSettings;
  return null;
}
