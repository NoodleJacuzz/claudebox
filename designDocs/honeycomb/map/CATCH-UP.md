# Map and acts — CATCH-UP

Map generation, act structure and node content. Project-wide context is `../BASICS.md`. The queue is
`FEEDBACK.md`.

---

## Where it stands

**Both acts are LIVE.** Session 38 read `tuning.map` as one 9-row map with no act table and concluded
the acts were unstarted; Noodle corrected that in session 39 by playing them. Act 1-1 is the wide
automated map on a simple background; act 1-2 is the one overlaid on a more complex background. They
are simply not *named* as acts in the code.

What is actually missing is smaller than "build the acts" and is three things:

1. **Branching** — multiple boss nodes in act 1-1 leading to alternate 1-2 areas, with tooltips so the
   choice is informed.
2. **Titling** — the live act 1-2 is to be called **Myconid Navel**. Anastasia's chess gauntlet is a
   one-time act 1-2.
3. **Node weighting** — too many chests, not enough encounters. Raised twice in one message.

**Act 1-2 is the demo's stopping point.**

Reconcile the session-38 reading of `tuning.map` against the live behaviour before building the
branching — one of the two is wrong about where the seam is.

---

## Files

| File | Holds |
|---|---|
| `FEEDBACK.md` | B15 (acts and branching), B28 (node weights), B30 (camp image by party composition). |

Live content: `honeycomb-content-map.js` (node types, regions, backdrops, events, shop tuning) and
`honeycomb-map.js` (layout strategies, generation, the map scene).

Coverage check: `node "!designDocs/honeycomb/tools/encounter-coverage.js"` generates real runs with the
game's own generator and reports which encounters a player can actually reach.

---

## Rules this pathway must not break

- **Node weights are tuning**, in `tuning.map`. Never a literal.
- **B28 pulls against two other workstreams.** Fewer chests, plus `../rework/starters/` B22 removing
  starting relics, plus `../rework/cards/` B24 adding curses, is a large swing in how much a player
  has by the boss. Tune the three together or the demo's difficulty curve moves by accident.
- **An event effect that changes the world must log it** — test [52] dry-runs every event choice.
- **An event may be opened with no run**, and a fight may happen without one. Lust Events do exactly this.
- **Layout owns position, not the renderer.** Map nodes carry explicit coordinates.
