# Shadowrun 2E: Missions

A Foundry VTT V13 module bringing *Missions* (FASA 7325) to the [Shadowrun 2nd Edition system](https://github.com/futurekill/sr2e-foundryvtt) (`sr2e`). Adventures as GM journals, NPC stat blocks and scenes, built to fill the downtime gaps in the **Double Exposure** campaign (Seattle, 2055).

## Contents

| Pack | Contents |
|---|---|
| Missions — GM Journals | 23 journals |
| Missions — Cast | 16 actors |
| Missions — Scenes | 15 scenes |

## Notes

- Covers **Under the Influence** and **Malpractice**, the two Seattle adventures, plus a *Filling Double Exposure's Gaps* journal that places each one in a Double Exposure downtime window.

## Requirements

- Foundry VTT V13
- The `sr2e` system, version 0.9.0 or later

## Installation

In Foundry, **Add-on Modules → Install Module**, and paste this manifest URL:

```
https://github.com/futurekill/sr2e-missions/releases/latest/download/module.json
```

Then enable it in your world (**Game Settings → Manage Modules**).

## Development

`packs-src/` (one JSON file per document) is the source of truth. `packs/` is built from it, gitignored, and rebuilt by the release workflow.

```bash
npm install
npm run build-packs     # packs-src/ JSON -> packs/ LevelDB (close Foundry first)
npm run extract-packs   # pull edits made in Foundry back to packs-src/
npm run validate        # pre-flight checks on the pack sources
npm run lint
```

To release: add a `## X.Y.Z — date` section to `CHANGELOG.md` (the release notes come from it), bump `module.json`, then tag and push `vX.Y.Z`.

## Copyright

*Missions* and *Shadowrun* are © FASA and their rights holders. This is a fan-made, non-commercial module for personal table use by owners of the book. Journals are original summaries with page references, not book text.
