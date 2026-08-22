import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, methodNotAllowed, readJsonBody, sendError, setCors } from '../lib/http.js';
import { hashPin } from '../lib/pin.js';
import { normalizeDisplayName, validateDisplayName, validatePin } from '../lib/names.js';
import { getSupabaseAdmin, isSupabaseConfigured } from '../lib/supabaseAdmin.js';
import { setSessionCookie, signSession } from '../lib/session.js';

interface RegisterBody {
  displayName?: string;
  pin?: string;
  classLevel?: string | null;
  adventureId?: string;
  progress?: Record<string, unknown>;
}

const emptyProgress = {
  adventureStarted: false,
  completedLessons: [],
  completedChallenges: [],
  challengeStars: {},
  attempts: [],
  totalStars: 0,
  totalXp: 0,
  challengesSolved: 0,
  progressVersion: 3,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handleOptions(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  if (!isSupabaseConfigured()) {
    return sendError(res, 503, 'Cloud save is nog niet geconfigureerd op de server.');
  }

  const body = readJsonBody<RegisterBody>(req);
  if (!body?.displayName || !body?.pin) {
    return sendError(res, 400, 'Naam en geheime code zijn verplicht.');
  }

  const nameError = validateDisplayName(body.displayName);
  if (nameError) return sendError(res, 400, nameError);

  const pinError = validatePin(body.pin);
  if (pinError) return sendError(res, 400, pinError);

  const displayName = body.displayName.trim();
  const normalized = normalizeDisplayName(displayName);

  try {
    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase
      .from('players')
      .select('id')
      .eq('display_name_normalized', normalized)
      .maybeSingle();

    if (existing) {
      return sendError(res, 409, 'Deze naam is al bezet. Kies een andere naam.');
    }

    const pinHash = await hashPin(body.pin);

    const { data: player, error: playerError } = await supabase
      .from('players')
      .insert({
        display_name: displayName,
        display_name_normalized: normalized,
        pin_hash: pinHash,
      })
      .select('id, display_name, created_at')
      .single();

    if (playerError || !player) {
      return sendError(res, 500, 'Registreren mislukt. Probeer het opnieuw.');
    }

    const progressJson = body.progress ?? emptyProgress;
    const prefs = {
      class_level: body.classLevel ?? null,
      adventure_id: body.adventureId ?? 'part1',
      settings_json: {},
    };

    await supabase.from('player_progress').insert({
      player_id: player.id,
      progress_json: progressJson,
      progress_version: 3,
    });

    await supabase.from('player_prefs').insert({
      player_id: player.id,
      ...prefs,
    });

    const token = await signSession({ sub: player.id, name: player.display_name });
    setSessionCookie(res, token);

    res.status(201).json({
      token,
      player: {
        id: player.id,
        displayName: player.display_name,
        createdAt: player.created_at,
      },
      prefs: {
        classLevel: prefs.class_level,
        adventureId: prefs.adventure_id,
        settings: {},
        updatedAt: new Date().toISOString(),
      },
      progress: progressJson,
    });
  } catch {
    sendError(res, 500, 'Serverfout bij registreren.');
  }
}
