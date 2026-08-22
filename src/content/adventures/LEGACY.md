# Legacy bos-content

De mappen `part1/`, `part2/` en `side/` bevatten het oorspronkelijke **bos-avontuur**
(Het Ontwaakte Bos + Het Verborgen Gebied). Deze content blijft in de repository voor:

- regressietests (`src/content/loader.test.ts` vergelijkt met legacy TS-bronnen)
- backup / referentie

## Normale spelflow

Spelers kiezen een **jaargroep** (`class_level`). De app laadt dan content uit
`adventures/levels/{jaargroep}/` — niet meer het bos-avontuur.

## Voortgang migratie

Voortgang blijft op `challengeId` (bijv. `groep-6-c01` of legacy `l1-c1`).

- Spelers **zonder** `class_level` zien de jaargroep-wizard op het dashboard.
- Oude bos-voortgang (`l1-c1`, `p2-c1-1`, …) wordt **niet** automatisch omgezet naar jaargroep-sommen.
- Na het kiezen van een jaargroep start een nieuw avontuur met passende sommen; eerder behaalde sterren
  op bos-IDs blijven in de voortgang staan maar horen niet bij het actieve level-avontuur.

## Persona's

- **Jaargroep-avonturen:** altijd de Uil (`helpPersonaId: uil`)
- **Legacy Deel II:** Detective (alleen relevant in tests / oude saves)
