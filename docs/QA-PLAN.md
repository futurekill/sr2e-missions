# QA plan — Missions

Automated: `npm run validate` (pack shape, unique ids including scene walls, regions
and behaviours) and `npm run lint`. Everything below is manual, in a world with sr2e
enabled.

## Cast and journals
- [ ] Each cast member's sheet opens with its stats, gear and portrait. Lindy is named
      "Lindy" (the clerk), separate from Dr. Cuca (Andrade).
- [ ] The journals open by adventure folder; Read to the Players pages read cleanly.

## Scenes
- [ ] Each scene opens on its map at 1 m per square.

## Soundboard (mi-audio)
- [ ] Import each **Missions — Soundboard** playlist. Clicking a sound plays it for every
      connected client; loops repeat until stopped; nothing plays by itself.
- [ ] Each line sounds right for its character (`npm run audio -- --verify` checks the words).

## Reaction (0.4.2)
- [ ] Drag Lindy in: Reaction 10, 3D6 Initiative. Every cast member's ⌊(Q + I) ÷ 2⌋ + reaction.mod equals its printed Reaction.
