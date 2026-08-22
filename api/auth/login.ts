import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, methodNotAllowed, readJsonBody, sendError, setCors } from '../lib/http.js';
import { verifyPin } from '../lib/pin.js';
import { normalizeDisplayName, validateDisplayName, validatePin } from '../lib/names.js';
import { getSupabaseAdmin, isSupabaseConfigured } from '../lib/supabaseAdmin.js';
import { setSessionCookie, signSession } from '../lib/session.js';

interface LoginBody {
  displayName?: string;
  pin?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handleOptions(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  if (!isSupabaseConfigured()) {
    return sendError(res, 503, 'Cloud save is nog niet geconfigureerd op de server.');
  }

  const body = readJsonBody<LoginBody>(req);
  if (!body?.displayName || !body?.pin) {
    return sendError(res, 400, 'Naam en geheime code zijn verplicht.');
  }

  const nameError = validateDisplayName(body.displayName);
  if (nameError) return sendError(res, 400, nameError);

  const pinError = validatePin(body.pin);
  if (pinError) return sendError(res, 400, pinError);

  const normalized = normalizeDisplayName(body.displayName);

  try {
    const supabase = getSupabaseAdmin();

    const { data: player, error } = await supabase
      .from('players')
      .select('id, display_name, pin_hash, created_at')
      .eq('display_name_normalized', normalized)
      .maybeSingle();

    if (error || !player) {
      return sendError(res, 401, 'Naam of geheime code klopt niet.');
    }

    const ok = await verifyPin(body.pin, player.pin_hash);
    if (!ok) {
      return sendError(res, 401, 'Naam of geheime code klopt niet.');
    }

    await supabase
      .from('players')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', player.id);

    const [{ data: progressRow }, { data: prefsRow }] = await Promise.all([
      supabase.from('player_progress').select('progress_json, progress_version, updated_at').eq('player_id', player.id).maybeSingle(),
      supabase.from('player_prefs').select('class_level, adventure_id, settings_json, updated_at').eq('player_id', player.id).maybeSingle(),
    ]);

    const token = await signSession({ sub: player.id, name: player.display_name });
    setSessionCookie(res, token);

    res.status(200).json({
      token,
      player: {
        id: player.id,
        displayName: player.display_name,
        createdAt: player.created_at,
      },
      prefs: {
        classLevel: prefsRow?.class_level ?? null,
        adventureId: prefsRow?.adventure_id ?? 'part1',
        settings: prefsRow?.settings_json ?? {},
        updatedAt: prefsRow?.updated_at ?? new Date().toISOString(),
      },
      progress: progressRow?.progress_json ?? {},
      progressUpdatedAt: progressRow?.updated_at ?? null,
    });
  } catch {
    sendError(res, 500, 'Serverfout bij inloggen.');
  }
}
