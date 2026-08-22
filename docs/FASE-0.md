# Fase 0 — Principes & datamodel ✅

> Status: **afgerond** — Fase 1 volledig gemigreerd; zie [FASE-1.md](./FASE-1.md)
> Gerelateerd: [UITBREIDINGSPLAN.md](./UITBREIDINGSPLAN.md) · [CONTENT-INVENTORY.md](./CONTENT-INVENTORY.md)

---

## Doel

Eén gedeelde taal voor **engine** (code), **content** (sommen/hulp), **thema** (avontuur) en **speler** (anoniem). Geen implementatie-wijzigingen aan het spel zelf — alleen types, defaults en documentatie.

---

## Beslissingen (vastgelegd)

### Account — geen PII

| Gegeven | Opslaan? | Waar (later) |
|---------|----------|--------------|
| Weergavenaam (Dennis, Dennis2) | Ja | DB `players` |
| Geheime code (PIN 4–6 tekens) | Alleen hash | DB `players.pin_hash` |
| Voortgang | Ja | DB `player_progress.progress_json` |
| Klas/niveau | Ja, als profiel | DB `player_prefs.class_level` |
| Gekozen avontuur | Ja | DB `player_prefs.adventure_id` |
| Instellingen (geluid, rustig) | Ja | DB `player_prefs.settings_json` |
| E-mail, leeftijd, echte naam, school | **Nee** | — |

PIN kwijt = nieuw avontuur met andere naam (geen reset-flow).

### Drie content-lagen

```
┌─────────────────────────────────────────────────────────┐
│  ADVENTURE SHELL     kaart, titel, emoji, unlock, thema │
├─────────────────────────────────────────────────────────┤
│  LESSON SHELL        intro, outro, mapTeaser, volgorde  │
├─────────────────────────────────────────────────────────┤
│  PLACEMENT           challengeId + optionalStory overlay│
├─────────────────────────────────────────────────────────┤
│  CHALLENGE BANK      pure wiskunde (stable ID)          │
├─────────────────────────────────────────────────────────┤
│  GUIDED HELP BANK    per challengeId + personaId        │
└─────────────────────────────────────────────────────────┘
```

### Wat blijft in code (engine)

- React renderers (`ChallengeCard`, vraagtypes)
- Antwoordvalidatie (`mathAnswerValidation.ts`)
- Progress, badges, unlock (`useProgress`, `adventureUnlock`)
- Thema-CSS structuur (`.theme-night`, persona classes)
- Class/adaptive logic (Fase 4)

### Wat wordt content (repo JSON → later optioneel DB)

- Challenge definitions
- Lesson shells + placements
- Adventure manifests
- Guided help packs
- Help persona teksten

---

## TypeScript types (nieuw)

| Type | Bestand | Doel |
|------|---------|------|
| `ChallengeDefinition` | `src/types/content.ts` | Pure wiskunde |
| `ChallengePlacement` | idem | Verhaal-overlay |
| `LessonShell` | idem | Les zonder ingebakken sommen |
| `AdventureManifest` | idem | Avontuur + unlock + persona |
| `HelpPersona` | idem | Uil / detective / pitstop UI |
| `GuidedHelpPack` | idem | Hulp + bonus per persona |
| `ClassLevelProfile` | idem | Moeilijkheid per klas |
| `PlayerAccount` | `src/types/player.ts` | Anonieme speler |
| `PlayerPrefs` | idem | Klas + avontuur + settings |
| `PLAYER_DATA_POLICY` | idem | Privacy-contract |

Bestaande types (`Challenge`, `Lesson`, `ProgressState`) blijven de **runtime**-vorm tot Fase 1 migratie.

---

## Default configs (seed)

| Bestand | Inhoud |
|---------|--------|
| `src/content/defaults.ts` | Persona's, klas-profielen, adventure manifests |

Nog **niet** wired in de app — referentie voor Fase 1–4.

---

## Scheidingsregels (thema vs wiskunde)

| Vraag | Antwoord |
|-------|----------|
| Waar hoort `3x + 7 = x + 17`? | Challenge bank |
| Waar hoort "Op de rotswand flikkeren…"? | Placement `optionalStory` |
| Waar hoort "De Schaduwgrot"? | Lesson shell |
| Waar hoort "Het Verborgen Gebied"? | Adventure manifest |
| Waar hoort "Vraag de Uil"? | Help persona (Fase 2) |
| Waar hoort sterren/XP? | Engine + `ProgressState` |

**Zelfde som, ander avontuur:** zelfde `challengeId`, andere `optionalStory` + andere persona-teksten.

**Klas past sommen:** `ClassLevelProfile` filtert bank op `topic` + `difficulty` (Fase 4).

**Avontuur past verhaal:** placements + shell + manifest; **niet** de wiskunde dupliceren.

---

## Acceptatiecriteria Fase 0

- [x] Principes gedocumenteerd (dit bestand)
- [x] Types: `ChallengeDefinition`, `LessonShell`, `ChallengePlacement`, `HelpPersona`, `PlayerAccount`
- [x] Content-inventaris + migratievolgorde ([CONTENT-INVENTORY.md](./CONTENT-INVENTORY.md))
- [x] Default persona / klas / adventure configs
- [x] Duidelijk: DB krijgt alleen speler + voortgang + prefs; content eerst in repo

---

## Volgende stap → Fase 1

**Pilot:** migreer alleen `vossenpad` naar bank + shell + JSON loader.

Zie [UITBREIDINGSPLAN.md § Fase 1](./UITBREIDINGSPLAN.md#fase-1--content-loskoppelen-24-weken).
