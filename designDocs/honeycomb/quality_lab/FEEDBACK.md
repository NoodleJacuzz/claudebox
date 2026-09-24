# Quality Lab — FEEDBACK

The Quality Lab: a bench for tuning how an attack looks and sounds, and the timing data it exports.
The design is `BRIEF.md`; this file holds what it waits on.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins. The whole pitch is quoted in `BRIEF.md` §1; each item below repeats
only the sentence it turns on.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `CATCH-UP.md`. What the project is: `../BASICS.md`.

---

### Q1. Two sentences of the pitch end mid-thought ⏸

> The scope of the first build of the quality lab is limited to sfx and, but the full list that will
> eventually need to be handled is defined above.

> Independent targets are primarily measured to help us find the impact timing of actions, as well as
> how far off

Both were written from a phone. The brief reads the first as "sfx first" and recommends **sfx and
screen shake** for the first build, since both are pure timing and need no art. It reads the second as
"how far off each target is from it". **Needs:** the missing word or words in each.

---

### Q2. A scene, or a mode on the combat screen ⏸

> Quality Lab, a test scene that assembles a battle scene of 1-5x dummy allies and enemies

The brief builds it as a MODE on the real combat screen with its own boot target and one debug button
(`BRIEF.md` §3.3), because the Battle Lab's window version was rejected once already for blocking the
board and hiding the pictures, and because the mode reuses every Battle Lab seam. "Scene" in the pitch
may only mean "somewhere to test". **Needs:** a yes, or the reason a separate screen is wanted.

---

### Q3. How an enemy plays a player's card ⏸

> the same amount of enemies play the current action in sequence

When the current action is a player card, an enemy can play it only through a new verb that builds an
intent from the card's effects (`BRIEF.md` §3.4). The alternative for a first build is the enemy move
the tester picks from the Battle Lab's intent picker, which exists today. The recommendation is the
verb, because the enemy side is where a player feels a hit and the timings there are the ones that
matter most; the picker is the fallback if the verb turns out to be larger than it looks. **Needs:**
which, or both.

---

### Q4. Who the dummy allies are ⏸

> 1-5x dummy allies and enemies, each assigned a single card

The brief stands N copies of the literal card's owner on the party line, so owner-relative effects and
the owner's own poses are the real ones. That means five Briennes for a Brienne card, which the engine
may or may not allow on one line (`honeycomb.summonCombatant` refuses past `tuning.scaling.enemyLimit`
and the party-duplicate rule is unchecked). The other reading is the five shipped characters each
holding the card, which tests a mixed line but plays the card off the wrong owner for four of them.
**Needs:** copies, or the roster, or copies with a roster toggle.

---

### Q5. One source of truth for a card's sound ⏸ (prerequisite P1)

> Changing assigned animations and sfx per card requires active searching through the database.

Measured: 35 cards carry an `sfx` field and 34 of them disagree with their `tuning.audio.cardSfxMap`
row; the field wins at play time, and `../tools/sfx-report.js` audits the row. The field is recent
Anastasia work. An assignment grid needs one place to write. The recommendation is the map (it is the
bulk table and the report already reads it), with the field deleted, or kept only as an override the
report also reads. **Needs:** which one is the table.

---

### Q6. Where a measured result is allowed to land ⏸

> A truly robust system must allow for individual targets to be micro-managed for extremely specific
> edge cases, but for the majority of cases an assumed relationship between each target and the impact
> should be found and directly codified as a default.

The brief writes results to the highest tier that explains the measurement: a sound's windup to the
file, a shake's trail to the template, and to a single card only when the tester asks (`BRIEF.md`
§3.7). The compare tool lists every card carrying its own override so that number stays visible.
**Needs:** confirmation that per-card overrides are the exception and the default toggle points at
the asset or template.

---

### Q7. Whether any of this is demo work ⏸

> Final goal: A game-feel standardization system, allowing us to quantify previously untranslatable
> gaps, and creating templates an agent creating cards can pick from that carry proven relationships.

The pitch names no priority. Tooling is off the demo gate,
as the Battle Lab is. But Phase 0 and the Performance Delay Test are the missing instrument for the
top demo goal (`../performance/` B16) and the phone test path `../mobile/` A12 asks for, and the vfx
picker and the at-once sweep are the assignment half of `../vfx/` B13, which is on the gate. The
recommendation is that Phase 0 and the performance half are demo work and the rest rides with VFX.
**Needs:** his call, since the gate is his.

---

### Q8. The device profile and the hitch log in telemetry ⏸

> When finished, this should be saved to call upon outside of the quality lab as well, in case there are
> instances of player-perceived lag that cannot be measured by your systems.

Inside the game this is a `quick` debug action usable in any fight (`BRIEF.md` §3.5). Outside it, the
device profile and a hitch log are the two fields the telemetry beacon (`../performance/` A8) lacks
for the "are players seeing something I am not" question, and they would fall under his neocities-only
rule like everything else in it. Whether a PLAYER ever sees a "report lag" control is a product
decision and is not assumed. **Needs:** whether the two fields join the beacon once an endpoint is
picked, and whether players get a control.

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
