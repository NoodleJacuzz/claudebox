# Map and acts — CATCH-UP

Map generation, act structure and node content. Project-wide context is `../BASICS.md`. The queue is
`FEEDBACK.md`.

---

## Where it stands

**Both acts are LIVE, and the three routes are reachable and named.** Session 55 built the three boss
nodes at the end of act 1-1 (each naming its boss and its route once the boss has been met), renamed
region 1 the Mushroom Frontier on Noodle's word, capped chests at three a region, started every map on
a rest and raised the combat weight from 45 to 52. Act 1-2 is the demo's stopping point. All of that is
in `_archive/FEEDBACK-DONE.md` with his quotes.

What is open, all in `FEEDBACK.md`: the campfire picture for a whole party (B30), region 1's water
paint (B31), a debug override on the boss roll (B41), and Noodle's 2026-09-25 rest site audit (S64-1).

**Map EVENTS have their own folder as of 2026-09-25: `../map_events/`.** This folder keeps generation,
regions, node types and the rest node.

---

## Files

| File | Holds |
|---|---|
| `FEEDBACK.md` | B30 (camp image by party), B31 (region 1's paint), B41 (debug boss-roll override), S64-1 (rest site audit). Closed items, P8 to P29 among them, are in `_archive/FEEDBACK-DONE.md`. |

Live content: `honeycomb-content-map.js` (node types, regions, backdrops, events, shop tuning) and
`honeycomb-map.js` (layout strategies, generation, the map scene).

Coverage check: `node "!designDocs/honeycomb/tools/encounter-coverage.js"` generates real runs with the
game's own generator and reports which encounters a player can actually reach.

---

## Rules this pathway must not break

- **Node weights are tuning**, in `tuning.map`. Never a literal.
- **Chests, starting relics and curses pull on each other.** Chests are capped now (P11, closed), but
  `../rework/starters/` B22 removing starting relics and `../rework/cards/` B24 adding curses still
  move how much a player has by the boss. Tune them together or the demo's difficulty curve moves by
  accident.
- **An event effect that changes the world must log it** — test [52] dry-runs every event choice.
- **An event may be opened with no run**, and a fight may happen without one. Lust Events do exactly this.
- **Layout owns position, not the renderer.** Map nodes carry explicit coordinates.
