# Card pool rework — CATCH-UP

**Read this first for the card pool.** Everything below is scoped to cards: what they cost, what they
do, how many there are, and which ones are cut.

Project-wide context is `../../BASICS.md`. Do not read `../../Archive/SESSION-LOG.md` for this workstream —
what is current is here.

---

## Where it stands

**Session 33 built the whole pool in one night.** 192 pool cards plus 31 Clemence broken forms are live
in `honeycomb-content-cards.js`. The shape is **21 commons + 11 rares per character** — 12 C + 5 R from
the start, then 3 C + 2 R per alternate outfit unlocked. Rates by tier: **6 / 9 / 12+ damage per energy**
for starter / common / rare. 17 cards were retired into `honeycomb.retiredCardArray` so old saves survive.

Session 38 re-checked the round-07 and round-08 items against the *new* pool rather than copying them
forward. Three findings worth carrying: Brienne's Resolve was already done and never annotated; the
cross-party count came out Nettle 2 / Severine 2, not Nettle 0; and the draft simulation's cut list is
**stale** — it modelled the pool session 33 replaced, and 6 of its 20 named cards no longer exist.

`CARD-POOL-01.md` §5b is the map of what was built. Its status board is the per-step truth.

**2026-09-25: Noodle asked for the manual pass (`FEEDBACK.md` B34) and `POOL-REVIEW-02.md` is the review.**
Measured: about 16 card offers per character per demo run, so the live 21 C / 11 R offers a common 0.57
times a run and a rare 0.36 — the gradient is flat, which is the memorability problem. **He agreed the
shape the same day:** 12 C + 8 R per character, 85 / 15 weights, a 15-card starting deck, one reward slot
per member, neutrals in shops and the boss slot, and a glue rule built on the shared-currency table in its
§2. Burn was withdrawn on his read; **Cinder's status is Heat, locked in his own words** (1 Lust per stack
whenever the holder plays a card; 1 Heat lost per shift toward the back, and 1 for ending the turn last)
and Poison is to halve. **`CARD-POOL-02.md` is the brief**: the agreed rules, Heat verbatim with nine
edge-case defaults for his veto, and **Cinder's and Brienne's full 12 C / 8 R lists drafted** (Sortie and
Kept Word as default signatures; Brienne's Bastion is the party's Lust sponge on his masochism idea, tagged
Torment). Late the same day he signed off the demo's tag set (Venom, Exposure, Heat, Penance), five MUSTs,
Severine losing every soothe, Absolution losing its soothe, Restraint cut, and the Abbess line applying
Heat to allies. **All six grids are drafted** (§3.1–3.6; Nettle repriced on halving; Severine revised on his
read to carry no damage amplifier of her own; Clemence with Heat on the Abbess line and her broken forms
cut from 35 to 23). Anastasia is outside the pass. **Next: the neutral tier (§3.7), then his vetoes, then
`CARD-POOL-02.md` becomes the build list.** The first engine job either way is `../starters/` B1, since
every alt is still unlocked from run one.

---

## Files

| File | Holds | Read it before |
|---|---|---|
| `CARD-POOL-02.md` | **The second pool pass, the brief**: the agreed shape, Heat in Noodle's words with the edge-case defaults, Poison halving, and the per-character grids — Cinder drafted, five to go. | writing or vetoing any grid |
| `POOL-REVIEW-02.md` | **The 2026-09-25 review of the session-33 pool**: offers-per-run maths, the shape and glue audit, the proposed 20-card shape, the reasoning behind Heat, the plan and the questions with his answers. | understanding why the brief says what it says |
| `CARD-POOL-01.md` | The brief: Noodle's corrections verbatim, hard rules, the per-character grids, the verdicts, the status board. | touching the pool at all |
| `BALANCE-01.md` | The foundational numbers: turns per fight, damage budget, enemy derivation, the healing rule. `tuning.balance` holds them. | pricing any card or enemy |
| `CARD-AUDIT-01.md` | Every card rated on I/S_v/S_h/C and its Starting/Accelerate/Payoff/Late-game fit. | re-scoring a card |
| `DRAFT-SIM-01.md` | The Monte Carlo draft: strength, pairwise synergy, three personalities, 4000 players. **Its cut list is stale — see above.** | cutting a card |
| `BALANCE-01-AUDIT-S32.txt` | The first budget report, session 32. A before-picture. | comparing against today |

Live content: `scripts/misc/honeycomb/honeycomb-content-cards.js`.
Character identities: `../starters/OUTFITS-LIST.md` outranks `../../reference/MECHANICS-01.md`.

Retired definitions: `../../Archive/RETIRED-CARDS-S31.md` and `../../Archive/RETIRED-CARDS-S33.md`.

---

## Tools

```
node "!designDocs/honeycomb/tools/budget-audit.js"        every encounter against the damage budget
node "!designDocs/honeycomb/tools/card-inventory.js"      every card, flat
node "!designDocs/honeycomb/tools/_dup.js"                cards sharing a name or a rules body
node "!designDocs/honeycomb/tools/audit-card-fit.js"      card text that does not fit its box (browser)
node "!designDocs/honeycomb/tools/draft-sim/draft-simulation.js"
node "!designDocs/honeycomb/tools/draft-sim/draft-sim-compare.js"
```

Block **[102]** of the suite tests the pool. Card art prompts are written by `../../tools/card-prompts.js`
into `../../art_pipeline/CARD-PROMPTS-01.md`.

---

## Remaining goals

Items are `FEEDBACK.md` holds the full quote and annotation for each. The table below is the index; that file is the queue.

| | Goal | State |
|---|---|---|
| **B34** | **The manual pass on the pool.** Shape agreed and Heat locked 2026-09-25; `CARD-POOL-02.md` is the brief with Cinder's grid drafted. | ◐ Cinder ⏸ his veto · five grids to write |
| **B1** | **Unlock routes.** Every alt outfit is still open from run one, so the whole 21 C / 11 R pool drops at once. Nothing gates the gated cards. | ☐ the load-bearing one, and B34's first step |
| **B26** | **The neutral pool missed the overhaul.** It was not rebuilt with the rest. | ☆ new |
| **B18** | **Clemence's redesign.** | ☐ |
| **B5** | **Cross-party hooks** — thin on Nettle and Severine. | ◐ |
| **A3** | Starter / common / rare rules — **answered session 39, and it reverses C1**, which acted on a misread instruction. | ☐ answered, not applied |
| **A6** | Whetted Edge is a free permanent upgrade. | ☐ answered |
| **A5 → B22** | Free per-fight healing in the heirlooms undercuts the campfire. Lands in `../starters/`. | ☐ |
| **B24** | Curses and deck bloat. | ☐ |
| **B25** | Shop removal pricing. | ☐ |
| **B33** | Boss and elite rare drop rate. | ☆ |
| **A9** | Re-run the draft simulation against the current pool. **Noodle paused this.** | ⏸ |
| **B3** | Card art prompts. Art is `../../art_pipeline/`, not here. | ◐ |

---

## Rules this pathway must not break

- **No magic numbers.** A card's numbers are named fields on its table entry; anything shared is
  `honeycomb-tuning.js`.
- **Adding a card is a table entry only.** Needing to edit engine code means the engine is missing a
  verb — add the verb.
- **Never edit the content tables with a greedy regex.** Indentation is not uniform and a pattern
  anchored on `\n\t\t\t\t},` will silently rewrite unrelated entries. Slice by index, then re-run the suite.
- **`honeycomb.findDefinition` returns the FIRST match.** A duplicate registration shadows silently.
