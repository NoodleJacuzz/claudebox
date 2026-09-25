# Enemy rework — FEEDBACK

Enemy numbers, identities, roles and encounter composition. Enemy **art scope** is `../../art_pipeline/FEEDBACK.md` (B21); enemy **title legibility** is `../../ui/FEEDBACK.md` (B32).

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins. Items were split out of the round-09 file in session 41 and moved
byte for byte — nothing was rewritten on the way.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `../../CATCH-UP.md`. What the project is: `../../BASICS.md`.

---

### B31. Sporelings should be fought in bulk ☆

> Sporeling could be better designed to be fought in bulk, like 4x in an encounter, since matriarch
> summons them and the game could use more aoe checks

Two reasons given, both good: the Matriarch already summons them (so a bulk sporeling encounter is
consistent with existing content), and **the game needs more AoE checks** — encounters that test
whether a deck can handle several bodies at once. `../../chessmaster/STATUS.md` notes the Matriarch can summon
5 and never reads the ally-side cap, so the engine side is already there. This is an encounter-table
entry plus a look at whether the sporeling's own numbers suit being one of four.

---

### Moth Light sits just over the Lust-to-damage cap ☆ — FOUND SESSION 44, NOT CAUSED BY IT

`budget-audit.js` at 4 seeds reports **Moth Light at 6.8 Lust per turn against a 6.6 maximum** — 3%
over `tuning.balance.lustToDamageRatioMaximum`, and the only one of 44 encounter rows that is over at
all. A 1-seed run of the same encounter reads 5.6 and passes, so it is marginal and seed-dependent
rather than a clear break.

**It is not the enemy overhaul's doing.** The line-up is Sporeling + Glowcap Moth + Gloom Wisp, and
session 44's Lust lift changed no move any of those three plays — it is simply the one encounter built
from three of the four enemies that already dealt Lust before the pass. Whether a cap written as a
per-line-up maximum should tolerate an all-casters line-up at all is this folder's call.

---

### B36. The Argent Fencer was meant to be saved for a two-enemy elite fight ☆ — FILED FROM THE INBOX, SESSION 51

> for argent fencer's sprite we were supposed to save her for a two-enemy elite encounter with the
> other butterfly knight

**She was not saved. She is in six encounters, and none of them is a two-enemy elite fight.** Measured
against the encounter table:

| Encounter | Tier | Line-up |
|---|---|---|
| `pollenRoadside` | early | Argent Fencer, Soakcap, Gloom Wisp |
| `pollenFencers` | middle | Sable Fencer, Argent Fencer, Soakcap |
| `pollenBower` | middle | Longwing, Argent Fencer, Gloom Wisp |
| `pollenDeepRoad` | late | Sable Fencer, Argent Fencer, Gloom Wisp |
| `pollenBathhouse` | late | Soakcap, Longwing, Argent Fencer |
| `pollenHighDrift` | late | Mantlewing, Argent Fencer, Sporeling |
| `pollenStripped` | late | Kobold Scavenger, Argent Fencer |

The pair fight he is describing half-exists. `pollenFencers` and `pollenDeepRoad` both field the Sable
Fencer and the Argent Fencer together, which is the matched pair `v13 spire images/_source/enemy inspo variants/assigned/ASSIGNED.md` asked for — *"Fight them
together. A matched pair reads as deliberate where two separate enemies read as lazy."* But both are
ordinary fights with a third enemy padding them out, not elites, and she appears in five other fights
besides, so nothing about her reads as held back.

The elite nodes on this route field the **Kobold Scavenger** instead, which is `enemy_overhaul/` E11 —
Act1-B and Act1-C have no elite pool of their own. A two-Fencer elite would close E11 for Act1-C and
this item at the same time. What it costs is one encounter-table entry at `tier: "elite"` and removing
her from some of the six fights above; how many of the six she should keep is a design call, not a
measurement.

---

### B37. Enemy sprites are drawn off the screen, and it is worse than the two he caught ☆ — MEASURED SESSION 51

Two separate reports, one cause:

> Soakcap's sprite is gigantic

> The Pale Dray doesn't fit on the dang screen

**What decides a sprite's size.** `presentation.scale` on the enemy's own content-table entry. It is a
named field, so this is not a magic-number problem — the numbers are in the right place, they are just
wrong. Nothing clamps the result to the stage, so a scale that looks right in one window shape hangs
off the edge in another.

**Measured at his window shape, 1878x804, with a three-ally party.** Twelve sprites leave the screen.
`topCut` is pixels above the top of the window; `rightCut` is pixels past the right edge:

| Encounter | Enemy | scale | top | right |
|---|---|---|---|---|
| `gardenerGrove` | **The Head Gardener** | 1.9 | **453** | 159 |
| `drayRoad` | **The Pale Dray** | 1.3 | **108** | 0 |
| `nettleVenomBattle` | Bolete Hook | 1.45 | 0 | 137 |
| `pollenFencers` | **Soakcap** | 1.45 | 0 | 73 |
| `floraStripped` | Windfall Alraune | 1.2 | 0 | 35 |
| `arborTwins` | The Sleeping Sister | 1.15 | 0 | 28 |
| `championAlone`, `championGuard` | Hollow Champion | 1.25 | 0 | 20 |
| `pollenBathhouse`, `pollenStripped` | Argent Fencer | 1.05 | 0 | 12 |
| `floraBellChoir`, `floraCache` | Trumpet Bell | 1.15 | 0 | 6 |

**The Head Gardener is cut off at the neck and has not been reported.** She loses 453 pixels off the
top — she is the Act1-1 boss, so a run that meets her sees a headless figure. That is four times worse
than the Pale Dray, which is the one he noticed.

**A bigger window makes it worse, not better.** The same fights at 1920x1080: the Head Gardener is 606
over the top rather than 453, and the Pale Dray 145 rather than 108. Sprite size follows the viewport
and the stage it stands on does not, so this cannot be dismissed as his window being short.

**Soakcap is the widest ordinary enemy in the game.** Its scale is 1.45, tied with the Bolete Hook for
the highest of any non-boss, and its drawing sits on a 1011x1300 canvas rather than the shared
832x1216, which widens it again (`honeycomb.art.normaliseCanvas`). Next to the Longwing, which is on a
650x1300 canvas, it renders about half as wide again. In `pollenFencers` it is 443px wide and 73 of
them are off the screen.

**The tool.** `!designDocs/honeycomb/tools/audit-sprite-fit.js` (new, session 51) reports this for every encounter at whatever
window shape is being tested. Run it at the shape being asked about. It is a browser audit; loading and
usage are in its header.

**What is NOT decided here.** How big each of these should be is his taste, not a measurement. The
numbers above say which entries are wrong and by how much; they do not say what to put there. Two ways
to go, and they are not exclusive: retune the `presentation.scale` values that overflow, or give the
sprite a real height cap so no scale value can push a drawing off the stage. The second is the engine
bug — `honeycomb-art.js` already records that `.hcFighterArt`'s `max-height` is a percentage whose
containing block has no definite height, so the cap resolves to none and has never applied.

---

### S64-1. The second demo's encounter rework: common, elite and boss ☆ — FILED 2026-09-25

Noodle, in the housekeeping message that set the second demo's gate (`../../BASICS.md`, the second
demo), the last three lines of what the demo needs:

> - Common enemy encounter rework & additions
> - Elite enemy encounter rework & additions
> - Boss enemy encounter rework

**What stands today**, so the rework starts from the measurement and not from memory:

- Act 1-1 has four tiers (`opening` rows 0 to 5, then early, middle, late) and ends in three boss nodes;
  each route's ORDINARY fights are built from its own enemies (session 55c, 12 of 16, 12 of 14, 12 of 14).
- **Every elite node on every route is borrowed** (the Kobold Scavenger or the Hollow Champion). The
  route-native elites are drawn and assigned and not built: `../../enemy_overhaul/FEEDBACK.md` E11 and
  E13 name them (`feralbeast-b`, `spookytall-a`, `tophatfairy-c`), and E7-DEFERRED holds the Act1-A
  intruder pair (`demikobold-c`, `bellhead-a`) and the Mold Leech's reconception. B36 above is the
  two-Fencer elite.
- **The Pollen Road has no small enemy** and **the Mantlewing fits no native group**
  (`../../enemy_overhaul/ROUTE-IDENTITY.md`). The Scrap Salvager is benched with two written encounters.
- **P14's open half, carried here from the archive:** whether act 1 fights should last longer. The turn
  target is 3 to 4; raising it restats every region-1 enemy and needs an All the Crunch run either side
  (`../../Archive/playtest_55/READ-ME-2.md` §6). His word first.
- **Bosses:** six in act 1. The Shroud's every word is open for veto (`../../enemy_overhaul/` E9); the
  Head Gardener's scale is settled at 1.1; B24 in `../cards/` wants a boss retooled to shuffle curses.

**Order.** `../../enemy_overhaul/` E14 first: every act-1 move must use a legal tag before any encounter
is added, or the additions are retagged twice. Then the elites, which are additive and put his five
previewed designs in the game at once. Then the common line-ups per route with `../../tools/enemy-template.js`
and `../../tools/lust-share.js` after every edit. Then the turn-target question with the Crunch behind it.

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../../FEEDBACK.md` instead)*
