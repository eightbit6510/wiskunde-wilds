# Content-inventaris & migratievolgorde

> Gegenereerd voor Fase 0 · Totaal: **20 lessen**, **116 challenges**

---

## Overzicht per avontuur

| Avontuur | Lessen | Challenges | Owl help patroon |
|----------|--------|------------|------------------|
| Deel I (`part1`) | 8 | 40 | Aparte packs (`src/data/owl/lessonN.ts`) |
| Deel II (`part2`) | 8 | 64 | Inline in chapter TS |
| Zijpaden (`side`) | 4 | 12 | Inline in `sideMissions.ts` |

---

## Deel I — Het Ontwaakte Bos

| # | Migratie | Lesson ID | Gebied | Challenges | Legacy bestanden | Owl pack |
|---|----------|-----------|--------|------------|------------------|----------|
| 1 | ✅ **1a** | `vossenpad` | Het Vossenpad | 5 | `lesson1.ts` | `owl/lesson1.ts` |
| 2 | ✅ **1b** | `wolvenkluis` | De Wolvenkluis | 4 | `lesson2.ts` | `owl/lesson2.ts` |
| 3 | ✅ **1b** | `lynx` | De Lynx-uitkijk | 4 | `lesson3.ts` | `owl/lesson3.ts` |
| 4 | ✅ **1b** | `konijnenhol` | Konijnenhol | 5 | `lesson4.ts` | `owl/lesson4.ts` |
| 5 | ✅ **1b** | `uilenlab` | Het Uilenlab | 4 | `lesson5.ts` | `owl/lesson5.ts` |
| 6 | ✅ **1b** | `bergmissie` | De Bergmissie | 4 | `lesson6.ts` | `owl/lesson6.ts` |
| 7 | ✅ **1b** | `maanlicht` | Maanlichtvallei | 4 | `lesson7.ts` | `owl/lesson7.ts` |
| 8 | ✅ **1b** | `sterrentempel` | De Sterrentempel | 10 | `lesson8.ts` | `owl/lesson8.ts` |

**Unlock:** altijd open · **Persona:** `uil` · **Thema:** `day`

---

## Deel II — Het Verborgen Gebied

| # | Migratie | Lesson ID | Gebied | Challenges | Legacy bestand |
|---|----------|-----------|--------|------------|----------------|
| 9 | ✅ **1c** | `schaduwgrot` | De Schaduwgrot | 8 | `part2/chapter1.ts` |
| 10 | ✅ **1c** | `ravenpad` | Het Ravenpad | 8 | `part2/chapter2.ts` |
| 11 | ✅ **1c** | `rivier` | De Rivier van Verhoudingen | 8 | `part2/chapter3.ts` |
| 12 | ✅ **1c** | `paraboolvallei` | De Paraboolvallei | 8 | `part2/chapter4.ts` |
| 13 | ✅ **1c** | `observatorium` | Het Wolvenobservatorium | 8 | `part2/chapter5.ts` |
| 14 | ✅ **1c** | `runenruines` | De Runenruïnes | 8 | `part2/chapter6.ts` |
| 15 | ✅ **1c** | `doolhof` | Het Doolhof van Patronen | 8 | `part2/chapter7.ts` |
| 16 | ✅ **1c** | `nachtmissie` | De Nachtelijke Eindmissie | 8 | `part2/chapter8.ts` |

**Unlock:** Deel I compleet · **Persona:** `uil` (nu) · **Thema:** `night`

Bij migratie: owl help **uit inline halen** → `guided-help/uil/{challengeId}.json`

---

## Zijpaden

| # | Lesson ID | Naam | Challenges | Legacy |
|---|-----------|------|------------|--------|
| 17 | ✅ **1d** | `zij-vossenhol` | Vossenhol | 3 | `part2/sideMissions.ts` |
| 18 | ✅ **1d** | `zij-maansteen` | Maansteen | 3 | idem |
| 19 | ✅ **1d** | `zij-uilenproef` | Uilenproef | 3 | idem |
| 20 | ✅ **1d** | `zij-konijnenpad` | Konijnenpad | 3 | idem |

---

## Aanbevolen migratievolgorde

```
Fase 1a — Pilot ✅
  └── vossenpad (1 les, 5 challenges, owl pack al apart)

Fase 1b — Rest Deel I ✅
  └── wolvenkluis → lynx → konijnenhol → uilenlab → bergmissie → maanlicht → sterrentempel

Fase 1c — Deel II ✅
  └── schaduwgrot → … → nachtmissie (inline owl → guided-help packs)

Fase 1d — Zijpaden ✅
  └── zij-* (4 mini-lessen)
```

**Per les migreren:**
1. Extract challenges → `content/bank/challenges/{topic}/{id}.json`
2. Extract owl → `content/guided-help/uil/{id}.json`
3. Lesson shell → `content/adventures/part1/lessons/{id}.json` (placements only)
4. Verwijder legacy TS (of deprecate met re-export tot alles klaar is)
5. Run `npm test` + handmatige check les op kaart

---

## Challenge ID-conventie (Fase 1)

Bestaande IDs blijven **stabiel** (voortgang in localStorage!):

| Patroon | Voorbeeld |
|---------|-----------|
| Deel I | `l1-c1`, `l2-c4`, … |
| Deel II | `p2-c1-1`, `p2-c8-5`, … |
| Zijpad | `zij-vh-1`, … |

**Nieuwe bank-IDs (optioneel later):** semantisch, bijv. `eq-x-both-sides-01` — alleen introduceren met alias-map naar legacy IDs tijdens migratie.

---

## Speciale UI (engine, niet content)

Deze lessen hebben **hardcoded story UI** in `LessonPage.tsx`:

| Lesson ID | UI |
|-----------|-----|
| `bergmissie` | Runestenen + bergpoort |
| `nachtmissie` | Maanpoot-symbolen (5 kamers) |
| `sterrentempel` | Deel I finale + Deel II unlock reveal |

Blijft engine tot Fase 2+ (`lessonUiHooks` config).

---

## Validatie (Fase 1)

Elke migratie-batch moet slagen op:

- [ ] Unieke challenge IDs in bank
- [ ] Elke placement verwijst naar bestaande challenge
- [ ] Guided help coverage (bestaande `coverage.test.ts` regels)
- [ ] `npm test` + `npm run build`
- [ ] Geen regressie Deel I/II gameplay
