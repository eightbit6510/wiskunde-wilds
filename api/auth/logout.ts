import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, methodNotAllowed, setCors } from '../lib/http.js';
import { clearSessionCookie } from '../lib/session.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handleOptions(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  clearSessionCookie(res);
  res.status(200).json({ ok: true });
}
