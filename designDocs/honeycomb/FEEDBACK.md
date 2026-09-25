# Honeycomb Catacombs — FEEDBACK

**This file sorts; it does not hold.** Feedback lives in the pipeline document it belongs to, because a
session is one pipeline. Two jobs only:

1. **The inbox at the bottom.** New reports land there, unsorted. The next session files each one into a
   pipeline document, in Noodle's words.
2. **The index.** How many items each pipeline holds and when work last landed there, so a session can
   tell whether the previous one ended before it could write its document.

**If a row disagrees with the pipeline's own document, the document wins and the previous session was
cut short.** `tools/feedback-audit.js` does the comparison; run it first.

**The gate is `BASICS.md`, "The demo scope — the second demo".** Everything filed before 2026-09-25 is at
its old path in `Archive/demo1/`.

---

## The index

Counts are OPEN items, one per `###` heading in the pipeline's document. Re-counted **2026-09-25**.

| Pipeline | Holds | Open | Last work landed |
|---|---|---|---|
| **`tooling/`** | The suite's overhaul (S64-1), the balance tests (T1 to T6), the Quality Lab (Q1 to Q8). All blockers on his list. | **14** | 2026-09-25 (filed) |
| **`desk/`** | The phone desk's eleven-phase plan. A blocker on his list; a session of its own. | **41** | 2026-09-23 (phases 1 to 4 built) |
| **`card_pool/`** | What a card costs, does and is worth. B34 the manual pass: `card_pool/CARD-POOL-02.md` drafted whole, vetoes held. | **12** | 2026-09-25 (design only) |
| **`enemies/`** | Who an enemy is and what it costs. E14 the retag first; S64-1 to S64-3 the three gate sessions; E9 every name for veto. | **12** | 2026-09-25 (filed) |
| **`art_pipeline/`** | Alt outfits, card art, enemy art, card chrome, VFX overlays. | **14** | 2026-09-25 (filed) |
| **`events/`** | Lust Events by tag, map events, the writing groundwork. B23 is the docket. | **9** | 2026-09-25 (filed) |
| **`mobile/`** | Landscape sizing, portrait styling, the phone test path. | **4** | 2026-09-25 (filed) |
| **`relics/`** | Starters, outfits and their unlock routes, relics, the trees. B1 is the load-bearing item. | **6** | s60 |
| **`engine/`** | The verbs the other pipelines wait for, the screens, audio, performance. | **24** | 2026-09-25 (filed) |

**136 items open across nine documents.** Forty-one of them are the desk's plan. Anastasia's eleven
(`chessmaster/`) are off the gate and frozen in `Archive/demo1/` on Noodle's machine.

Three of these are wired together and should not be tuned one at a time: `relics/` B22 (no starting
relics), `card_pool/` B24 (more curses) and the chest cap already in place all pull on how much a player
has by the boss.

---

## Inbox — unsorted, file these into a pipeline

*(add new reports below this line. The next session reads them, decides which pipeline owns each, moves
the report there verbatim, and fixes that row's count above.)*

**2026-09-25: nothing waits here.** Noodle's second-demo message and his replies on it were filed line by
line; the batches routed before it are in `Archive/demo1/Archive/INBOX-ROUTED-2026-09.md`.

### The two that are still waiting on him

**IN-7. Event window styling took shortcuts.** Owner: `engine/` or `events/`.

> a number of shortcuts were taken with the event window styling

He did not say which shortcuts. Ask before changing anything, and show him a previewer first. `mobile/`
S64-2 restyles the same window for portrait (image above the text), so whoever takes that should ask him
which shortcuts he meant first.

**IN-8. Nonsense text is still in the game.** Owner: whichever pipeline owns each piece of text.

> a mountain of absolutely nonsensical text is still left in the game.

He plans to have the events agent replace placeholder events and write character descriptions. Any text
written for this follows `.claude/CLAUDE.md` rules 1 and 2 and `../voice_matching/`. Never invent text for
a slot he left empty. `events/EVENTS.md` S64-1 is where the map events' share lands.
