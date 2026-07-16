# Missions Module — Development Notes

A FoundryVTT **V13** content module bringing adventures from *Missions* (FASA 7325)
to the **Shadowrun 2nd Edition system** (`sr2e`) as GM journals, NPC stat blocks,
and maps. Scaffolded from the `../sr2e-double-exposure` module (same tooling and
journal format); requires the `sr2e` system.

## Purpose / scope
Built to drop into the **downtime gaps of the Double Exposure campaign** (Seattle,
2055). Phase 1 covers the two Seattle adventures that fit DE's runner team and
investigation tone:
- **Under the Influence** (book p.5–25) — missing Lone Star UC cop, a cybered
  street gang, an Aztechnology behavioural-cyberware plot. Foreshadows DE's
  mind-control horror.
- **Malpractice** (book p.26–51) — runners go undercover as DocWagon HTR medics
  to catch a mole selling medical records/DNA. Bridges off DE segment 2 (a
  DocWagon job).

*Mission: Mars* and *King of the Mountain* (the other two adventures in the book)
are off-setting / non-runner and are NOT in Phase 1 — see the "Filling Double
Exposure's Gaps" journal for the mapping and hooks.

## Source material
The *Missions* PDF is a **scanned image** (98 pages, no text layer) — render each
page (`pdftoppm -r 150`, work in git-ignored `_work/`) and read the GM text;
transcribe stat-block numbers carefully and verify against the render. Page
offset: book page N = PDF page N + 1.

## Authoring conventions
- Journals: one entry per scene/encounter, pages following the SR2 structure —
  **Read to the Players** (Tell It To Them Straight), **Hooks & Behind the Scenes**,
  **The Run & Opposition**, **Dropping Clues & Debugging**. Summarise/original
  prose; do not paste long verbatim flavour text.
- Cast: NPC stat blocks → `npc` actors in `mi-cast`, foldered by adventure.
- Scenes: maps → `mi-scenes` (placeholder/empty scenes where the book's map is art).
- Three packs (`packs/` is a gitignored build artifact — rebuild after edits):
  `mi-journals`, `mi-cast`, `mi-scenes`,
  each foldered by adventure. `npm run build-packs` / `validate` after edits.

## Copyright
*Missions* / *Shadowrun* are © FASA and rights holders. Personal table use only.
Keep `_work/` out of git; keep the repo private.
