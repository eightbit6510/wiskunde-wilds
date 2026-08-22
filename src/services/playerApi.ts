import type { ProgressState, SettingsState } from '../types';
import type { AdventureId, ClassLevel } from '../types/content';
import type {
  AuthSession,
  NameAvailabilityResult,
  PlayerLoginInput,
  PlayerRegisterInput,
} from '../types/player';
import { loadPlayerSession } from '../utils/playerSession';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

function authHeaders(): HeadersInit {
  const session = loadPlayerSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }
  return headers;
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? 'Er ging iets mis.');
  }
  return data;
}

export async function checkDisplayName(name: string): Promise<NameAvailabilityResult & { configured?: boolean }> {
  const params = new URLSearchParams({ name: name.trim() });
  const res = await fetch(`${API_BASE}/api/auth/check-name?${params}`);
  return parseJson(res);
}

export async function registerPlayer(input: PlayerRegisterInput & { progress?: ProgressState }): Promise<
  AuthSession & { progressUpdatedAt?: string | null }
> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify(input),
  });
  return parseJson(res);
}

export async function loginPlayer(input: PlayerLoginInput): Promise<
  AuthSession & { progressUpdatedAt?: string | null }
> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify(input),
  });
  return parseJson(res);
}

export async function logoutPlayer(): Promise<void> {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'include',
  });
}

export async function saveCloudProgress(input: {
  progress: ProgressState;
  classLevel?: ClassLevel | null;
  adventureId?: AdventureId;
  settings?: SettingsState;
}): Promise<{ ok: boolean; updatedAt: string }> {
  const res = await fetch(`${API_BASE}/api/progress`, {
    method: 'PUT',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify({
      progress: input.progress,
      prefs: {
        classLevel: input.classLevel ?? null,
        adventureId: input.adventureId ?? 'part1',
        settings: input.settings ?? {},
      },
    }),
  });
  return parseJson(res);
}

export async function loadCloudProgress(): Promise<{
  progress: ProgressState;
  progressUpdatedAt: string | null;
  prefs: {
    classLevel: ClassLevel | null;
    adventureId: AdventureId;
    settings: SettingsState;
    updatedAt: string;
  };
}> {
  const res = await fetch(`${API_BASE}/api/progress`, {
    method: 'GET',
    headers: authHeaders(),
    credentials: 'include',
  });
  return parseJson(res);
}
