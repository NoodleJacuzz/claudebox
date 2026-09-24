# Map and acts — finished feedback

Closed items from `../FEEDBACK.md`, quote and annotation together, newest first. Nothing here is open work.

---

### S57-1. The campfire lowers Lust as well as health — DONE (session 57) ☑

> Please make the campfire reduce lust as well as health, equal amounts.

**Sleep** heals each member by 30% of their maximum health (45% with Rest-B) and now removes the same number
of Lust points. **Treatment** does the same for the ally it treats (60%). Treatment was included because it
is the campfire's other heal; if only Sleep was meant, remove Treatment's `soothe` line in
`honeycomb-content-map.js`.

The amount is `tuning.rest.lustPerHealth` Lust per point of health: 1 is equal amounts, 0 turns it off
(the menu text drops the Lust part too). The menu reads "Heals 30% of maximum health (17 HP) and removes as
much Lust."

Checked in the browser by pressing Sleep: 20 → 37 health and 30 → 13 Lust on both members. Suite block [137].

### S59-1. The Weeping Bloom: a Nettle-only map event — DONE (session 59) ☑

> I want to add a nettle-exclusive map event that raises her lust weakness a full rank.

> Venom, absolutely, the only one with written scenes. Do a classic 1-of-3 choices, with choice 1 being
> "Gain 2 rerolls, raise Nettle's venom weakness 1 rank", and the other being something more generic with
> an upside and downside, and the final being just to leave.

`theWeepingBloom` in `honeycomb-content-map.js`. **Study it** gives 2 rerolls and raises Nettle's venom
by one whole rank. **Bottle the sap** gives 50 gold and deals 5 damage to every ally, ignoring Temporary
HP. **Leave** does nothing.

It only enters the pool when the rank can really be raised: Nettle is in the party, her venom is below
the top rank, Fortitude is not holding it at rank 1, and this run has not already raised her venom once.
The last condition is his round 05 rule: "The most any weakness should rise in one session is a single
rank."

New engine pieces, each usable by any later event:
- `raiseWeaknessRank` (effect): lifts a weakness to exactly its next rank's threshold.
- `weaknessCanRank` (condition): whether that is possible right now.
- `subject` on an event: names the character the event is about, so `{name}`, the speaker figure and the
  weakness effects mean her. Mid-run, the speaker wears the outfit she has on in the run.
- A result-panel row that shows the rank reached, for example "Nettle: Venom +1, Now rank 1, Sensitised."

The words were written by Claude and measured with the scene skill's `scene-metrics.py`. They are his to
rewrite. There is no painting yet: Nettle stands down the side of the screen instead. No `resultText`,
following the rule against inventing text for empty slots.

**A bug found on the way and fixed.** Once a run had seen every event, the pool reopened to every event
with a weight and ignored `appearsWhenBroken` and `condition`. So a Broken-only event could appear with
nobody Broken, and this event could have appeared without Nettle. The reopened pool now respects both.

Checked in the browser by pressing Study it: rank 0 to 1, 2 rerolls, the rank-up popup played. Suite
block [141].

### S59-2. Map event and rest site pictures checked for placeholders — DONE (session 59) ☑

> I need to check the images for map events and rest sites to make sure all placeholders are removed.

Every picture a map event or the campfire asks for was listed and checked on disk: 16 pictures (the
campfire once per character, its backdrop, and the eight map events). All 16 exist, none is on a
generator manifest, and each has its full-size original in the PNG archive. The new Weeping Bloom has no
painting, so it adds no placeholder either.

### S60-5. The Weeping Bloom goes past the one-rank-per-run ceiling — DONE (session 60) ☑

> I am okay with the event raising nettle to the "next" cap. Meaning if already at max rank 1 without
> watching the event, it can bypass the limit and raise to rank 2. Otherwise the event has no actual
> downside. Basically, I would like the rank growth to behave like it were told "Move to the next highest
> rank from your current position, ignoring other blocks."

`honeycomb.lust.raiseRank` now writes the next threshold straight into the ledger instead of going through
`addExposure`, which applies the run ceiling. The rank-up record and the cut-in still play. `canRaiseRank`
now only says no at the top rank or under Fortitude, so the event can appear after a rank was already
gained this run. Fortitude still blocks it, because a Fortitude character has no weakness to raise.
Suite block [141].
