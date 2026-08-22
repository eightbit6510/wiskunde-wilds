import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, methodNotAllowed, sendError, setCors } from '../lib/http.js';
import { normalizeDisplayName, suggestName, validateDisplayName } from '../lib/names.js';
import { getSupabaseAdmin, isSupabaseConfigured } from '../lib/supabaseAdmin.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handleOptions(req, res)) return;
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  if (!isSupabaseConfigured()) {
    return res.status(200).json({ available: true, configured: false });
  }

  const rawName = typeof req.query.name === 'string' ? req.query.name : '';
  const nameError = validateDisplayName(rawName);
  if (nameError) {
    return sendError(res, 400, nameError);
  }

  const displayName = rawName.trim();
  const normalized = normalizeDisplayName(displayName);

  try {
    const supabase = getSupabaseAdmin();
    const { data: existing } = await supabase
      .from('players')
      .select('display_name_normalized')
      .eq('display_name_normalized', normalized)
      .maybeSingle();

    if (!existing) {
      return res.status(200).json({ available: true, configured: true });
    }

    const base = displayName.replace(/\d+$/, '');
    const { data: similar } = await supabase
      .from('players')
      .select('display_name')
      .ilike('display_name', `${base}%`);

    const suffixes = (similar ?? [])
      .map((row) => row.display_name)
      .filter((name) => name.toLowerCase().startsWith(base.toLowerCase()))
      .map((name) => {
        const match = name.match(/(\d+)$/);
        return match ? Number(match[1]) : 1;
      });

    return res.status(200).json({
      available: false,
      configured: true,
      suggestion: suggestName(base, suffixes),
    });
  } catch {
    sendError(res, 500, 'Kon naam niet controleren.');
  }
}
