import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  handleOptions,
  methodNotAllowed,
  readJsonBody,
  sendError,
  setCors,
} from '../lib/http.js';
import { getSupabaseAdmin, isSupabaseConfigured } from '../lib/supabaseAdmin.js';
import {
  readBearerToken,
  readCookieToken,
  verifySession,
} from '../lib/session.js';

interface ProgressPutBody {
  progress?: Record<string, unknown>;
  prefs?: {
    classLevel?: string | null;
    adventureId?: string;
    settings?: Record<string, unknown>;
  };
}

async function authenticate(req: VercelRequest) {
  const token =
    readBearerToken(req.headers.authorization) ??
    readCookieToken(req.headers.cookie);
  if (!token) return null;
  return verifySession(token);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handleOptions(req, res)) return;
  if (req.method !== 'GET' && req.method !== 'PUT') {
    return methodNotAllowed(res, ['GET', 'PUT']);
  }

  if (!isSupabaseConfigured()) {
    return sendError(res, 503, 'Cloud save is nog niet geconfigureerd op de server.');
  }

  const session = await authenticate(req);
  if (!session) {
    return sendError(res, 401, 'Je bent niet ingelogd.');
  }

  try {
    const supabase = getSupabaseAdmin();

    if (req.method === 'GET') {
      const [{ data: progressRow }, { data: prefsRow }] = await Promise.all([
        supabase
          .from('player_progress')
          .select('progress_json, progress_version, updated_at')
          .eq('player_id', session.sub)
          .maybeSingle(),
        supabase
          .from('player_prefs')
          .select('class_level, adventure_id, settings_json, updated_at')
          .eq('player_id', session.sub)
          .maybeSingle(),
      ]);

      return res.status(200).json({
        progress: progressRow?.progress_json ?? {},
        progressVersion: progressRow?.progress_version ?? 3,
        progressUpdatedAt: progressRow?.updated_at ?? null,
        prefs: {
          classLevel: prefsRow?.class_level ?? null,
          adventureId: prefsRow?.adventure_id ?? 'part1',
          settings: prefsRow?.settings_json ?? {},
          updatedAt: prefsRow?.updated_at ?? new Date().toISOString(),
        },
      });
    }

    const body = readJsonBody<ProgressPutBody>(req);
    if (!body?.progress || typeof body.progress !== 'object') {
      return sendError(res, 400, 'Voortgang ontbreekt.');
    }

    const now = new Date().toISOString();

    const { error: progressError } = await supabase.from('player_progress').upsert({
      player_id: session.sub,
      progress_json: body.progress,
      progress_version: 3,
      updated_at: now,
    });

    if (progressError) {
      return sendError(res, 500, 'Voortgang opslaan mislukt.');
    }

    if (body.prefs) {
      await supabase.from('player_prefs').upsert({
        player_id: session.sub,
        class_level: body.prefs.classLevel ?? null,
        adventure_id: body.prefs.adventureId ?? 'part1',
        settings_json: body.prefs.settings ?? {},
        updated_at: now,
      });
    }

    await supabase.from('players').update({ last_seen_at: now }).eq('id', session.sub);

    return res.status(200).json({ ok: true, updatedAt: now });
  } catch {
    sendError(res, 500, 'Serverfout bij voortgang.');
  }
}
