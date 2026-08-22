# Fase 1 — Content loskoppelen

> Status: **afgerond** (Fase 1a–1d) — alle 20 lessen + 116 challenges in JSON

## Doel

Wiskunde (bank), verhaal (lesson shell + placements) en uil-hulp (guided help) staan los van elkaar. Dezelfde challenge-ID kan later in meerdere avonturen met ander verhaal. Fundament voor CMS (Fase 5) en cloud save (Fase 3).

## Supabase

**Fase 1 gebruikt geen Supabase.** Content blijft JSON in de repo. Supabase komt in **Fase 3**.

## Structuur

```
src/content/
  bank/challenges/       # 116 JSON-bestanden
  guided-help/uil/       # 116 uil-packs
  adventures/
    part1/manifest.json + lessons/   # 8 shells
    part2/manifest.json + lessons/   # 8 shells
    side/manifest.json + lessons/    # 4 zijpad-shells
  loader.ts
scripts/
  export-content.ts      # legacy TS → JSON (alles)
  export-utils.ts
```

## Runtime

- **Deel I** → `loadPart1LessonsFromContent()`
- **Deel II** → `loadPart2LessonsFromContent()`
- **Zijpaden** → `loadSideMissionsFromContent()`
- Legacy TS blijft `@deprecated` voor export/parity
- Challenge-IDs ongewijzigd — localStorage progress blijft geldig

## Gemigreerd (volledig)

| Avontuur | Lessen | Challenges |
|----------|--------|------------|
| Deel I | 8 | 40 |
| Deel II | 8 | 64 |
| Zijpaden | 4 | 12 |
| **Totaal** | **20** | **116** |

## Commando's

| Script | Doel |
|--------|------|
| `npm run content:export` | Export alles van legacy TS naar JSON |
| `npm run content:validate` | Parity + validatie (vitest) |
| `npm test` | 112 tests incl. 20× parity per les |

## Acceptatie

- [x] Deel I identiek aan legacy
- [x] Deel II identiek aan legacy (inline owl → packs)
- [x] Zijpaden identiek aan legacy
- [x] 116 unieke challenge-IDs
- [x] 112 tests groen, build groen

## Volgende stap → Fase 2

Generieke help-persona's (uil/detective/pitstop) — UI wired op `HelpPersona` types.

Of **Fase 3** (Supabase cloud save) als je voortgang sync wilt.

Zie [UITBREIDINGSPLAN.md](./UITBREIDINGSPLAN.md).
