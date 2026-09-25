# Quality Lab — FEEDBACK, done

Closed items, quote and annotation together, moved here from `../FEEDBACK.md`. The first draft of
`../BRIEF.md` (2026-09-24) asked eight questions; Noodle answered all eight on 2026-09-25. Seven closed
and are below; Q4 opened work and stays in `../FEEDBACK.md`. Every quote is his, verbatim.

---

### Q1. Two sentences of the pitch end mid-thought ☑ — answered 2026-09-25

> The scope of the first build of the quality lab is limited to sfx and, but the full list that will
> eventually need to be handled is defined above.

> Independent targets are primarily measured to help us find the impact timing of actions, as well as
> how far off

Both were written from a phone. The brief read the first as "sfx first" and recommended sfx and
screen shake for the first build; it read the second as "how far off each target is from it".

> Both assumptions are exactly correct.

**Settled.** The first build handles sound effects and screen shake; Impact is the moment each target
is measured from. `../BRIEF.md` §1 states both without hedging.

---

### Q2. A scene, or a mode on the combat screen ☑ — answered 2026-09-25

> Quality Lab, a test scene that assembles a battle scene of 1-5x dummy allies and enemies

The brief had built it as a mode on the real combat screen, reusing every Battle Lab seam, and asked
whether a separate screen was wanted.

> Likely a real battle target, but in practice I the battle lab was mostly unusable due to the complex UI not being user friendly and trying to fit the myriad options on top of an existing battle space. Using the same environment as real battles allows us to test real conditions, but I think that real battle elements like the hand, deck, etc would get in the way. We should be able to easily make a more simplistic, user friendly quality lab transform into a live battle scene without too much effort by copying quality lab actors and cards into a real battle, and as long as the performance delay test is available everywhere we can measure any difference between quality lab and live battles.

**Settled, and the design changed.** The lab is its own scene that mounts only the battlefield (the
fighters, plates, numbers, vfx and log handlers the combat screen uses) and none of the combat
screen's furniture; a GO LIVE button copies its actors and its card into a real battle; and the
Performance Delay Test is an overlay in every scene with one record shape, so a cycle and a live fight
of the same board can be compared. This adds one prerequisite, lifting the battlefield out of the
combat scene (`../BRIEF.md` P9), and `../BRIEF.md` §3.3 is the screen.

---

### Q3. How an enemy plays a player's card ☑ — answered 2026-09-25

> the same amount of enemies play the current action in sequence

The brief offered a new verb that builds an intent from any card, or the Battle Lab's intent picker as
a fallback.

> Player cards should absolutely be tested in enemy hands. The dummy enemies we are making must be able to use every single card in the game, even if practically that card does nothing for them (like gaining energy or drawing cards).

**Settled.** Every actor plays the literal card as its own source through one path, and an effect
that names something the source does not have resolves to nothing rather than throwing; a suite block
plays every card from an enemy source and a character source (`../BRIEF.md` §3.4, Phase 0). With Q4 this
is the first step of ownerless cards.

---

### Q5. One source of truth for a card's sound ☑ — answered 2026-09-25

> Changing assigned animations and sfx per card requires active searching through the database.

Measured: 35 cards carry an `sfx` field and 34 of them disagree with their `tuning.audio.cardSfxMap`
row; the field wins at play time, and `../../tools/sfx-report.js` audits the row. The brief recommended
one table and asked which.

> I disagree in concept, I believe there should be priorities, especially if we want to include mod support down the line. However I agree the current system is filled with holes.

**Settled, against the recommendation.** Both stay, as priorities, the field over the row, which is
also how the resolver's tiers work. What is fixed is the holes: the report reads the resolved value
(`honeycomb.cardSfxStem`), a row a field overrides is reported as stale, and the 10 orphan rows go
(`../BRIEF.md` P1).

---

### Q6. Where a measured result is allowed to land ☑ — answered 2026-09-25

> A truly robust system must allow for individual targets to be micro-managed for extremely specific
> edge cases, but for the majority of cases an assumed relationship between each target and the impact
> should be found and directly codified as a default.

The brief wrote results to the highest tier that explains the measurement and asked for confirmation
that per-card overrides are the exception.

> Urg, this is a really really hard one. In general, I'll stick to existing templates and create new templates as needed. Per-card overrides are the highest level, but they are risky and increase future testing work wherever they are used. Ideally the first response after an override is done is to ask "Is there something wrong with this asset in templates?"
> But at the same time, a character doing a jumping attack needs a jumping sound and a pose change right at the start with the impact frame coming afterwards on a sort of second beat. There's really no chance we can gleam anything about their relation to the impact from the first beat.

**Settled, and the design changed twice.** Saving a per-card override is now a two-step that first
shows what the same value would change on the asset or the template (`../BRIEF.md` §3.8), and a new
template is the normal answer to a card that does not fit. The jumping attack added a second anchor to
the timeline: an entry is timed from the action's start or from its impact, a `leap` template has its
crouch and jump sound on the start and its landing on the impact, and Alignment's taps place only
impacts (`../BRIEF.md` §3.2, §3.7).

---

### Q7. Whether any of this is demo work ☑ — answered 2026-09-25

> Final goal: A game-feel standardization system, allowing us to quantify previously untranslatable
> gaps, and creating templates an agent creating cards can pick from that carry proven relationships.

The brief had framed the lab as serving the demo goals and several open items in other workstreams
(performance B16, mobile A12, vfx B13, audio B9–B11, ui B6) and asked whether it counted as demo work.

> The first demo is out, I'm saving usage rates for bugtesting, the documentation is out of date and I haven't had a chance to update them before starting cloud sessions. The projects you mentioned are from an earlier time in the workflow, it's easier to essentially start from scratch on each of the game's major shortcomings with direct, actionable plans rather than use half-finished ones from much earlier states.

**Settled, and the framing was wrong.** The lab is a direct plan for one shortcoming and stands on its
own; `../BRIEF.md` §6 says so and no longer cites the earlier items. His words are also recorded in
`../../BASICS.md`, "The demo scope", so no session ranks new work by that list until he rewrites it.

---

### Q8. The device profile and the hitch log in telemetry ☑ — answered 2026-09-25

> When finished, this should be saved to call upon outside of the quality lab as well, in case there are
> instances of player-perceived lag that cannot be measured by your systems.

The brief asked whether the device profile and hitch log should join the telemetry beacon once an
endpoint was picked, and whether players get a control.

> Telemetry was a failure project that never got off the ground due to being lower priority than first demo playability, and there are at least a dozen major completely game-reshaping projects still higher on the priority list. I have my hands overflowing with issues I can already see, I don't consider it valuable to search for invisible ones at this stage.

**Settled.** Telemetry is shelved; nothing the lab records leaves the device, and "outside the quality
lab" means the Performance Delay Test as an overlay in every scene (Q2). Recorded on `../../performance/FEEDBACK.md`
A8 as well, so the next performance session does not build it.
