# Wiskunde Wilds — Uitbreidingsplan (Fase 0 t/m 4 + Fase 5)

> Doel: anonieme spelers (naam + PIN), voortgang in de cloud, avonturen losgekoppeld van sommen, hulppersona's per thema, klas past moeilijkheid aan.
>
> Geen PII: geen echte namen, leeftijd, e-mail, school-ID of andere kindgegevens.

---

## Overzicht

| Fase | Focus | Backend | Content |
|------|--------|---------|---------|
| **0** | Principes & datamodel | — | Documentatie |
| **1** | Content loskoppelen | — | TS → bank + shell |
| **2** | Hulppersona generiek | — | Persona-config |
| **3** | Anonieme cloud save | API + DB | — |
| **4** | Klas + avontuurkeuze | Uitbreiding API | Placements per avontuur |
| **5** | Content-editor (CMS) | Admin API | DB of JSON-beheer |

**Advies Fase 5-timing:** de *structuur* voor bewerken (JSON-schema, content-loader, validatie) hoort in **Fase 1**. De *editor-UI* kan wachten tot **Fase 5** — tenzij je snel veel content wilt toevoegen zonder deploy; dan een **lichte JSON-editor in Fase 2–3** overwegen.

---

## Fase 0 — Principes & datamodel (1–2 dagen)

### Doelen
- Eén gedeelde taal voor engine vs content vs thema
- Geen implementatie-blokkers later

### Beslissingen

#### Account (geen PII)
| Veld | Opslaan? | Opmerking |
|------|----------|-----------|
| Weergavenaam | Ja | Uniek, speels (Dennis, Dennis2) |
| PIN / geheime code | Alleen hash | 4–6 tekens, geen “wachtwoord”-taal in UI |
| Voortgang | Ja | JSON-blob, zelfde vorm als `ProgressState` |
| Klas/groep | Ja, als **niveau** | Bijv. `vwo2`, `vwo3`, `groep-7` — geen schoolnaam |
| Gekozen avontuur | Ja | Thema/kaart, niet de wiskunde zelf |
| E-mail, leeftijd, echte naam | **Nee** | — |

#### Drie content-lagen
```
ChallengeBank     → pure wiskunde (id, topic, difficulty, vraag, antwoord, hints)
GuidedHelpBank    → hulp per challenge + persona (stappen, bonusvarianten)
AdventureShell    → verhaal (titel, intro, emoji, kleur, unlock, kaart)
LessonPlacement   → welke challenge in welke les, met optionalStory overlay
```

#### Engine blijft in code
- Renderers (`ChallengeCard`, vraagtypes)
- Antwoordvalidatie (`mathAnswerValidation`)
- Progress, badges, unlock-logica
- Thema-CSS (structuur); teksten via config

### Deliverables
- [x] Dit document goedgekeurd → zie [FASE-0.md](./FASE-0.md)
- [x] TypeScript-types schetsen: `ChallengeDefinition`, `LessonShell`, `ChallengePlacement`, `HelpPersona`, `PlayerAccount`
- [x] Lijst bestaande content: ~8 Deel I + ~8 Deel II + zijmissies → [CONTENT-INVENTORY.md](./CONTENT-INVENTORY.md)

### Acceptatiecriteria
- [x] Team weet: wat gaat in DB, wat blijft in repo, wat is thema vs wiskunde

---

## Fase 1 — Content loskoppelen (2–4 weken)

### Doel
Zelfde som in meerdere avonturen; verhaal wisselen zonder wiskunde te dupliceren. **Fundament voor Fase 5-editor.**

### Huidige situatie (probleem)
- Sommen zitten **in** `lessonN.ts` / `part2/chapterN.ts`
- Deel 2: `owlHelp` **inline** per challenge
- Training hergebruikt hele challenge-objecten → bos/grot-verhaal in train-modus
- `ADVENTURES` in `adventureUnlock.ts` wordt nauwelijks gebruikt

### Nieuwe structuur (in repo, nog geen DB)

```
src/content/
  bank/
    challenges/          # Pure wiskunde, stable IDs
      algebra/
      vergelijkingen/
      ...
    guided-help/         # Per challengeId + personaId
      uil/
      detective/         # later
  adventures/
    part1/
      manifest.json      # Metadata + lesson order + unlock
      lessons/
        vossenpad.json   # Shell + placements alleen
    part2/
      ...
  personas/
    uil.json
    detective.json       # Fase 2
```

#### Challenge (bank)
```json
{
  "id": "eq-x-both-sides-01",
  "type": "equation-steps",
  "topic": "vergelijkingen",
  "difficulty": 2,
  "question": "Los op: 3x + 7 = x + 17",
  "answer": 5,
  "hint1": "...",
  "hint2": "...",
  "explanation": "...",
  "equationSteps": [...]
}
```

#### Placement (in lesson shell)
```json
{
  "challengeId": "eq-x-both-sides-01",
  "optionalStory": "Op de rotswand flikkeren vergelijkingen…",
  "reviewOfPart1": false,
  "xpReward": 25
}
```

#### Lesson shell
```json
{
  "id": "schaduwgrot",
  "adventureId": "part2",
  "order": 101,
  "areaName": "De Schaduwgrot",
  "title": "Echo's in het donker",
  "emoji": "🌑",
  "color": "#3D4A6B",
  "intro": "...",
  "mapTeaser": "...",
  "outroStory": "...",
  "placements": [...]
}
```

### Migratiestappen
1. **Export-script** — huidige TS → JSON; validatie met bestaande vitest-regels
2. **Content loader** — `getLesson(id)` leest JSON i.p.v. TS imports (types blijven)
3. **Challenge bank module** — `getChallenge(id)`, pools op `topic` + `difficulty`
4. **Deel 2 owl packs** — inline `owlHelp` → `guided-help/uil/{challengeId}.json`
5. **Training/review pools** — selecteer uit bank, niet uit lesson arrays
6. **`ADVENTURES` manifest** — kaart, unlock, sectietitels uit één bron

### Wat bewust **niet** in Fase 1
- Geen backend, geen login
- Geen volledige CMS-UI (wel JSON + validatie = voorbereiding Fase 5)
- Geen nieuwe avonturen-thema's (wel structuur klaarzetten)

### Tests (behouden/uitbreiden)
- Unieke challenge-IDs in bank
- Elke placement verwijst naar bestaande challenge
- Guided help coverage per challenge
- Build + alle bestaande E2E-flows Deel I/II

### Acceptatiecriteria
- [ ] Bestaande Deel I + II gedrag identiek na migratie
- [ ] Eén challenge-ID kan in twee lesson JSONs staan met andere `optionalStory`
- [ ] `npm test` + `npm run build` groen
- [ ] Nieuwe content toevoegen = JSON bestanden + validatie draaien (geen TS hoofdstuk copy-paste)

### Fase 5-voorbereiding (structuur nu, UI later)
| Nu (Fase 1) | Later (Fase 5) |
|-------------|----------------|
| JSON-schema + Zod validatie | Admin form bouwt opzelfde schema |
| `content validate` CLI | CI + pre-save in editor |
| Git als source of truth | Optioneel sync naar DB |

**Conclusie:** editor-UI kan in Fase 5; **content als data** moet in Fase 1.

---

## Fase 2 — Hulppersona generiek (1–2 weken)

### Doel
Zelfde hulp-flow, ander thema: Uil → Detective → Pitstop-monteur.

### Huidige situatie
- `OwlHelpController` — flow is generiek ✓
- UI hardcoded: "Vraag de Uil", `OwlMascot`, `.owl-*` CSS
- Progress: `owlHelpUsedCount`, etc.

### Wijzigingen

#### Types
```typescript
// Was: OwlHelp
interface GuidedHelp {
  intro: string;
  steps: GuidedHelpStep[];
  conclusion: string;
}

interface HelpPersona {
  id: 'uil' | 'detective' | 'pitstop';
  buttonLabel: string;       // "Vraag de Uil" / "Vraag de detective"
  confirmTitle: string;
  confirmBody: string;
  bonusIntro: string;        // "Nu jij!" / "Jouw beurt, agent!"
  starCost: number;          // default 1
  mascot: 'owl' | 'detective' | 'mechanic'; // SVG component key
}
```

#### Adventure → persona
In adventure manifest:
```json
{ "id": "part1", "helpPersonaId": "uil", "theme": "day" }
{ "id": "race", "helpPersonaId": "pitstop", "theme": "race" }
```

#### Component refactor
| Oud | Nieuw |
|-----|-------|
| `OwlHelpController` | `GuidedHelpController` |
| `OwlHelpButton` | `GuidedHelpButton` (+ persona props) |
| `OwlHelpModal` | `GuidedHelpModal` |
| `OwlMascot` | `HelpMascot` wrapper of persona-specifieke SVGs |

#### Progress migratie (v2 → v3)
- `owlHelpUsedCount` → `guidedHelpUsedCount` (of behoud beide tijdens migratie)
- `progressMigration.ts` mapt oude velden

#### Guided help bank
```
guided-help/
  uil/eq-x-both-sides-01.json
  detective/eq-x-both-sides-01.json   # zelfde stappen, andere tekst
```

Zelfde challenge, andere persona-tekst — geen duplicate wiskunde.

### Optioneel licht CMS (alleen als content-druk hoog)
- Simpele admin route `/dev/content` (password-protected, niet publiek)
- JSON textarea + validate + download
- **Niet** nodig als je via git + JSON blijft werken tot Fase 5

### Acceptatiecriteria
- [ ] Deel I gedrag ongewijzigd met persona `uil`
- [ ] Tweede persona (bijv. `detective`) op demo-lessen werkend
- [ ] Geen "Uil"-strings hardcoded buiten persona-config
- [ ] Oude localStorage progress gemigreerd

---

## Fase 3 — Anonieme cloud save (2–3 weken)

### Doel
Naam + PIN → voortgang terug op ander apparaat. Geen PII.

### Stack (voorstel, past bij Vercel)
- **Frontend:** bestaande Vite app op Vercel
- **API:** Vercel Serverless Functions (`/api/...`)
- **Database:** Supabase (Postgres) of Vercel Postgres
- **Auth:** custom (geen Supabase Auth nodig voor MVP)

### Database schema (minimaal)

```sql
-- Unieke weergavenaam (case-insensitive aanbevolen)
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  display_name_normalized TEXT NOT NULL UNIQUE,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_progress (
  player_id UUID PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  progress_json JSONB NOT NULL,
  progress_version INT NOT NULL DEFAULT 3,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_prefs (
  player_id UUID PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  class_level TEXT,              -- 'vwo2' | 'vwo3' | null
  adventure_id TEXT DEFAULT 'part1',
  settings_json JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

Geen tabel met echte namen, adressen, of schoolgegevens.

### API endpoints

| Method | Route | Doel |
|--------|-------|------|
| POST | `/api/auth/register` | Naam + PIN → check uniek → create player |
| POST | `/api/auth/login` | Naam + PIN → return progress + prefs |
| GET | `/api/auth/check-name?name=Dennis` | `{ available, suggestion: "Dennis2" }` |
| PUT | `/api/progress` | Save progress blob (auth token) |
| GET | `/api/progress` | Load progress blob |

### Auth flow (kinder-UI)

```
1. "Hoe wil je dat ik je noem?"     → check-name API
2. "Verzin een geheime code"       → 4-6 tekens, lokaal + server hash
3. "In welke groep zit je?"         → prefs.class_level (optioneel, overslaan ok)
4. "Welk avontuur?"                 → prefs.adventure_id (later Fase 4 effect)
5. Spelen → sync progress elke N minuten + bij les afronden
```

**Wachtwoord vergeten:** geen reset — duidelijke copy: "Geheime code kwijt? Dan begin je een nieuw avontuur met een andere naam."

### Client architectuur

```
localStorage (offline-first)
       ↕ merge on login
server progress_json
```

- Bij login: server wint als `updated_at` nieuwer, anders merge regels
- Zonder internet: blijft localStorage werken (zoals nu)
- Session: httpOnly cookie of signed JWT (korte TTL)

### Security (lightweight, geen PII)
- PIN: bcrypt/argon2, min 4 tekens
- Rate limit op login/register
- Geen account recovery = geen e-mail lekken
- AVG: privacy policy "we slaan alleen nickname + voortgang op"

### Acceptatiecriteria
- [ ] Register/login flow in UI
- [ ] Naam-uniek met suggestie Dennis2
- [ ] Progress overleeft browser refresh + ander apparaat
- [ ] Offline spelen blijft werken
- [ ] Geen velden buiten schema opgeslagen

---

## Fase 4 — Klas past sommen, avontuur past verhaal (2–3 weken)

### Doel
Twee onafhankelijke assen:
- **class_level** → welke challenges / moeilijkheid / review
- **adventure_id** → thema, kaart, persona, verhaallagen

### Klas → wiskunde (engine)

#### Niveau-config (in code of JSON)
```json
{
  "vwo2": {
    "maxDifficulty": 2,
    "topicsUnlocked": ["algebra", "vergelijkingen", "breuken", "grafieken"],
    "reviewRatio": 0.25
  },
  "vwo3": {
    "maxDifficulty": 3,
    "topicsUnlocked": ["...", "kwadratisch"],
    "reviewRatio": 0.2
  }
}
```

#### Toepassing
| Plek | Gedrag |
|------|--------|
| Lesson placements | Filter/swap challenges uit bank op niveau |
| Training mode | `buildTrainingSession()` respecteert `class_level` |
| Review scheduler | Bestaande `topicStats` + niveau-cap |
| Deel II unlock | Ongewijzigd (Deel I voltooid) |

**Belangrijk:** lesson *shell* blijft; placements kunnen **dynamisch** uit bank gehaald worden per niveau, of per niveau vaste placement-lijsten in JSON.

### Avontuur → verhaal (content)

Adventure manifest uitbreiden:
```json
{
  "id": "wilds-race",
  "title": "Wiskunde Grand Prix",
  "subtitle": "Pitstop Challenge",
  "theme": "race",
  "helpPersonaId": "pitstop",
  "mapStyle": "race-circuit",
  "lessons": ["pit-lane-1", "pit-lane-2", ...]
}
```

Zelfde `challengeId`s als bos-avontuur, andere:
- `optionalStory`
- lesson intro/outro
- mapTeaser, emoji, color
- help persona teksten

### Login flow uitbreiding
Stap 3–4 van Fase 3 worden actief:
- Groep kiezen → `player_prefs.class_level`
- Avontuur kiezen → `player_prefs.adventure_id` + laad juiste adventure manifest

### Kaart & navigatie
- `AdventureMap` leest actief avontuur uit prefs/manifest
- Deel I/II blijven beschikbaar als `adventure_id` wisselt
- Progress (`completedChallenges`) blijft **challenge-ID based** — werkt cross-theme

### Nieuwe avonturen toevoegen (zonder Fase 5 CMS)
1. Lesson shell JSONs + placements (bestaande challenge IDs)
2. Adventure manifest entry
3. Persona config (Fase 2)
4. Map CSS variant
5. Validatie + deploy

### Acceptatiecriteria
- [ ] Zelfde speler wisselt avontuur → zelfde voortgang/challenge sterren, ander verhaal
- [ ] Klas wwo2 vs vwo3 → meetbaar andere challenge set of moeilijkheid
- [ ] Training en review respecteren beide prefs
- [ ] Geen duplicate wiskunde in repo

---

## Fase 5 — Content-editor (overweging & timing)

### Wat je wilt
Gebruiksvriendelijk avonturen en sommen **toevoegen, wijzigen, verwijderen** zonder code te schrijven.

### Wanneer implementeren?

| Moment | Editor UI | Reden |
|--------|-----------|-------|
| **Fase 1** | Nee (wel JSON + validate CLI) | Eerst structuur; anders edit je chaos |
| **Fase 2–3** | Optioneel `/dev` JSON editor | Als je vóór Fase 5 veel content maakt |
| **Fase 5** | Ja, volwaardige CMS | Content bank + API stabiel; meeste waarde |

**Structureel kan bewerken het best na Fase 1** — zodra challenges een bank zijn met stable IDs en lessons alleen placements zijn. **De UI kan later**, maar elke fase vóór Fase 1 die content in monolithische TS schrijft, maakt de editor duurder.

### Fase 5 architectuur (voorstel)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Admin UI       │────▶│  Content API     │────▶│  Postgres   │
│  (protected)    │     │  CRUD + validate │     │  or JSON    │
└─────────────────┘     └──────────────────┘     └─────────────┘
         │                       │
         │                       ▼
         │              Zod schema (zelfde als Fase 1)
         ▼
   Preview / test challenge
```

#### CMS modules
1. **Challenge editor** — vraagtype, topic, difficulty, antwoord, hints, live preview
2. **Guided help editor** — stappen per persona
3. **Lesson editor** — shell + drag-drop placements uit bank
4. **Adventure editor** — manifest, volgorde, unlock, persona, theme
5. **Publish** — draft → published; optioneel git sync of CDN invalidation

#### Role access
- Alleen jij / docent-account (niet kinderen)
- Apart admin auth (niet kind PIN)

#### Delete strategy
- **Soft delete** (`archived: true`) — voortgang blijft geldig voor oude challenge IDs
- Hard delete alleen als nooit gespeeld

### Alternatief: headless CMS
- Sanity, Strapi, Directus — sneller UI, minder custom bouw
- Nadeel: schema moet exact matchen met engine; export pipeline nodig
- Overweeg als Fase 5 sneller live moet dan custom admin

---

## Tijdlijn (indicatief)

```
Fase 0  ████                           Week 1
Fase 1  ████████████████               Week 2–5
Fase 2  ████████                         Week 6–7
Fase 3  ████████████                     Week 8–10
Fase 4  ████████████                     Week 11–13
Fase 5  ████████████████████             Week 14+ (apart project)
```

Parallel: bestaande Deel I/II content blijven speelbaar; migratie per slice (eerst Deel 1 les 1 als pilot).

---

## Risico's & mitigatie

| Risico | Mitigatie |
|--------|-----------|
| Migratie breekt voortgang | `progressMigration` + challenge IDs stable houden |
| Editor te vroeg | Fase 1 JSON-schema eerst |
| Kind PIN kwijt | Duidelijke UX; geen recovery |
| AVG | Geen PII; korte privacy uitleg; data minimal |
| Content inconsistent | Validatie-tests verplicht vóór publish |
| Scope creep | Fase 4 pas na werkende cloud save |

---

## Eerste concrete stap (aanbevolen)

**Pilot Fase 1:** migreer **alleen Het Vossenpad** naar:
- `bank/challenges/…`
- `adventures/part1/vossenpad.json`
- `guided-help/uil/…`

Laat rest in TS tot pilot groen is. Dan batch-migrate Deel I → Deel II.

---

## Samenvatting beslissing Fase 5

> **Structuur voor bewerken: Fase 1.**  
> **UI voor bewerken: Fase 5** (tenzij content-druk een simpele dev-editor in Fase 2–3 rechtvaardigt).

Zo voorkom je dubbel werk: de editor wordt een frontend op het datamodel dat je toch nodig hebt voor multi-avontuur en klas-filtering.
