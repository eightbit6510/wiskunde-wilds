# Fase 3 — Anonieme cloud save

Voortgang synchroniseren via Supabase + Vercel serverless API. Geen e-mail, geen PII — alleen weergavenaam, gehashte PIN en progress JSON.

## Wat is gebouwd

| Onderdeel | Pad |
|-----------|-----|
| DB schema | `supabase/migrations/20240822100000_players.sql` |
| API auth | `api/auth/register.ts`, `login.ts`, `check-name.ts`, `logout.ts` |
| API progress | `api/progress/index.ts` |
| Client API | `src/services/playerApi.ts` |
| Auth hook | `src/hooks/usePlayerAuth.ts` |
| Merge | `src/utils/progressMerge.ts` |
| UI | `src/components/CloudSavePanel.tsx` (Instellingen) |

## Setup Supabase

1. Project: **wiskunde-wilds** (`cwmpgdvzjaevaedddcxq`) — [Dashboard](https://supabase.com/dashboard/project/cwmpgdvzjaevaedddcxq)
2. Repo is gelinkt:
   ```bash
   supabase link --project-ref cwmpgdvzjaevaedddcxq
   ```
3. Schema pushen:
   ```bash
   supabase db push
   ```
   > **IPv6-probleem?** Als `db push` faalt op je netwerk, pas de migration toe via Supabase Dashboard → SQL Editor, of via de Management API (zoals bij initiële setup).

## Vercel environment variables

Project: **wiskunde-wilds** → https://wiskunde-wilds.vercel.app

Reeds gezet (Production, Preview, Development):

- `SUPABASE_URL` = `https://cwmpgdvzjaevaedddcxq.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SESSION_SECRET`
- `CLIENT_ORIGIN` = `https://wiskunde-wilds.vercel.app`

Lokaal: `npx vercel env pull .env.local`

## Lokaal testen

API-routes draaien niet via `npm run dev` (alleen Vite). Gebruik:

```bash
cp .env.example .env.local
# Vul .env.local in

npx vercel dev
```

Open de app via de URL die `vercel dev` toont (meestal `http://localhost:3000`).

## Auth flow

1. **Registreren** — naam + PIN (4–6 cijfers), optioneel klas.
2. **Naam check** — `GET /api/auth/check-name?name=Dennis` → `{ available, suggestion }`.
3. **Login** — merge lokale voortgang met cloud (`resolveProgressOnLogin`).
4. **Sync** — debounced `PUT /api/progress` elke ~2,5 s na wijzigingen (ingelogd).
5. **Logout** — wist JWT cookie + lokale sessie.

## Offline-first

- Zonder login blijft alles in `localStorage` werken zoals voorheen.
- Zonder internet: spelen gaat door; sync faalt stilletjes tot de volgende poging.
- PIN kwijt = nieuw account met andere naam (geen reset).

## Acceptatiecriteria

- [x] Register/login flow in Instellingen
- [x] Naam-uniek met suggestie (Dennis2)
- [x] Progress merge bij login + cloud sync
- [x] Offline spelen blijft werken
- [x] Alleen schema-velden opgeslagen (geen PII)

## Volgende stap → Fase 4

Klas (`class_level`) en avontuur (`adventure_id`) koppelen aan content-filtering.
