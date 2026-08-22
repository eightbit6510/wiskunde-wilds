# Fase 2 — Hulppersona generiek

> Status: **afgerond**

## Doel

Zelfde guided-help flow, ander thema per avontuur: Uil (Deel I) → Detective (Deel II) → Pitstop (toekomst).

## Wat er is gebouwd

### Persona-config (JSON)
- `src/content/personas/uil.json`
- `src/content/personas/detective.json`
- `src/content/personas/pitstop.json` (klaar voor race-avontuur)

Alle UI-teksten (knop, confirm, modal, bonus) komen uit persona-config — geen hardcoded "Uil"-strings meer in components.

### Avontuur → persona
| Avontuur | Persona |
|----------|---------|
| Deel I | `uil` |
| Deel II | `detective` |
| Zijpaden | `uil` |

Via manifest `helpPersonaId` + `getHelpPersonaIdForLesson()`.

### UI components
- `GuidedHelpController` (+ knop, modal, confirm, bonus)
- `HelpMascot` → owl / detective / mechanic SVG
- Legacy `OwlHelpController` re-export voor backward compat

### Guided help bank
- `guided-help/uil/` — alle 116 packs
- `guided-help/detective/` — fallback naar uil als pack ontbreekt
- Loader kiest pack op basis van les-persona

### Progress migratie v3
- Nieuwe velden: `guidedHelpUsedCount`, `guidedHelpChallenges`, `guidedStarsSpent`, `guidedBonusTried`, `guidedBonusSolved`
- v2-data (`owlHelp*`) wordt automatisch gemapt
- Owl-velden blijven gesynchroniseerd (badges)

## Acceptatie

- [x] Deel I gedrag ongewijzigd met persona `uil`
- [x] Detective persona op Deel II (UI + manifest)
- [x] Geen "Uil"-strings hardcoded buiten persona-config
- [x] Oude localStorage progress gemigreerd (v2 → v3)

## Volgende stap → Fase 3

Supabase cloud save (anonieme naam + PIN, voortgang sync).

Optioneel later: detective-specifieke guided-help teksten in `guided-help/detective/` (nu fallback naar uil-content).

Zie [UITBREIDINGSPLAN.md § Fase 2](./UITBREIDINGSPLAN.md#fase-2--hulppersona-generiek-12-weken).
