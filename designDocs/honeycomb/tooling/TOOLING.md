# Tooling — `tooling/`

The benches and tests every pipeline leans on: the test suite, the two balance tests, the Quality Lab,
and the phone desk (which keeps its own folder, `../desk/`, because the desk server reads `desk/data/`).
Noodle's early-stage blockers for the second demo, *"the ones where leaving them for later would create
a ton of headaches"*:

> - Test Suite Overhaul
> - Finish Desk app
> - Quality tuner
> - Balance suites A and B

**How this file works.** One file per pipeline: where the work is, the rules, then the queue in Noodle's
words. When an item closes, cut its `###` section and paste it at the top of `ARCHIVE.md` beside this
file, the same minute. `../FEEDBACK.md` indexes the count. Quotes are his, verbatim, and win over any
annotation. Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted.

---

## Where it stands

- **The suite** (`../tools/test-honeycomb.js`): 17,282 lines, about 2,555 `check(` calls, **2,805 passes**
  on his machine at session 61, about 148 numbered blocks titled by the SESSION that wrote them, 106 disk
  reads, about 265 lookups pinned to named content, and an uncaught crash at block [81] when
  `honeycomb sound/` is absent, so a cloud copy runs 1,256 checks and stops. The card pool cut turns the
  content-pinned checks red on the day it lands. S64-1 proposes two stages: guard the disk reads and tag
  every block `engine` / `content` / `presentation` before the cut; rebuild by subject with property
  checks after it. **His yes on the order is owed.**
- **The balance tests** (`../tools/balance/`): **Basic Bite** finished and timed (222 s for the full
  default run on 10 workers, over the two-minute target); **All the Crunch** works end to end with
  `--trace`, `--compare`, `--career` and `--matrix`, run once each at small size. The first full-size
  matrix cannot be read as a tree measurement (career profiles also carried the Lust ledger). Owed: the
  eight follow-up steps at the end of the old catch-up (in `../Archive/demo1/balance_tests/CATCH-UP.md`),
  the full-size overnight run, and **his hour of fixed-seed play for calibration**, without which every
  absolute number is a number about the bot. `../card_pool/CARD-POOL-02.md` §6 wants a Crunch run before
  and after the pool.
- **The Quality Lab** (`QUALITY-LAB-BRIEF.md`): designed 2026-09-24 from his pitch, not built. Every action
  gets a named impact, every target is scheduled from it through one resolver, overrides go through the
  same resolver, a fixed cycle replays from a snapshot and exports timing. Phase 0 needs none of the seven
  open decisions (Q1 to Q6, Q8). Q7 was answered 2026-09-25: it is demo work, and it comes before the SFX
  assignment and VFX assignment it serves. 34 of 35 card `sfx` fields disagree with `cardSfxMap` (Q5).
- **The desk** (`../desk/`): phases 1 to 4 built 2026-09-23 and waiting on a desk restart and his eye;
  phases 5 to 11 are a session of their own. All eleven stand: *"Right, but having one purpose-built for
  Honeycomb has advantages."* Its 41-item plan is `../desk/FEEDBACK.md` and is indexed separately.

## Files

| File | Holds |
|---|---|
| `TOOLING.md` | this file |
| `QUALITY-LAB-BRIEF.md` | the pitch verbatim with annotations, how an attack is presented today, the design, the build order |
| `BALANCE-BRIEF.md` | the balance tests' eight-step handoff, each step ending in checks |
| `BALANCE-INFERENCES.md` | guesses made without him during the balance build (I1 to I14), each a one-line change |
| `ARCHIVE.md` | closed items from this file |
| `../desk/` | the phone desk: `../desk/CATCH-UP.md`, `../desk/FEEDBACK.md` (the eleven-phase plan), `../desk/NEW-FEEDBACK.md` (his request, as written), `desk/data/` (**live data, his phone writes here**) |
| `../tools/README.md` | the folder map of every dev tool |
| `../Archive/demo1/` | `test_suite/`, `balance_tests/`, `quality_lab/`: the old catch-ups (the balance one holds the step log, measurements and the follow-up list) and closed items |

```
node "!designDocs/honeycomb/tools/test-honeycomb.js"                    the suite (needs honeycomb sound/ on disk)
node "!designDocs/honeycomb/tools/balance/basic-bite.js" --workers 10  BALANCE TEST: BASIC BITE
node "!designDocs/honeycomb/tools/balance/all-the-crunch.js" <mode>    BALANCE TEST: ALL THE CRUNCH
node "!designDocs/honeycomb/tools/falsify-routes.js"                   the pattern for proving a check can go red
node "!designDocs/honeycomb/tools/desk/desk-cli.js" inbox              what Noodle left on the desk
```

## Rules this pipeline must not break

- **Green certifies only what is asserted.** Unchecked is a failure, not a pass; falsify before ticking.
- **Never delete a check to get green.** Muting a content block during the cut is a labelled, temporary state this file records.
- **A function the suite must see lives in a file the suite loads.**
- **No game rule is copied into a simulation.** The balance tests play the real engine through the game's own functions.
- **Results live beside the tool**, in `../tools/balance/results/<date>-<tag>/`; never in a document folder.
- **The lab's overrides never bypass the resolver**; measure at 1x; every number is in `tuning.qualityLab` or a template row.
- **`desk/data/` is a database shared between us.** Back it up before any scripted write; never overwrite it from a copy of the repo.

---

## The queue

### S64-1. Test Suite Overhaul ☆ — FILED 2026-09-25

Noodle, in the housekeeping message that set the second demo's gate (`../BASICS.md`, the second demo),
the first of the early-stage blockers, *"the ones where leaving them for later would create a ton of
headaches"*:

> - Test Suite Overhaul
> Desperately needs to become more agnostic to prevent us from changing systems, to be rebuilt after we can be sure all legacy content weighing us down is cut. A lot of the decisions you make are influenced by wanting to confirm behavior that could break a test, but the session fills up, and I have to remember to carry that mostly unrelated issue with me into the next session. This is likely how many matters get left behind.

**Read as:** the suite today prevents systems from changing, because so many of its checks are pinned to
particular content; rebuild it agnostic once the card pool cut has removed the content it is pinned to.
`TOOLING.md` measures the size of that (about 265 content-pinned lookups, blocks organised by session,
a crash instead of a skip when an asset folder is absent) and proposes a two-stage order, since the cut
turns those checks red on the day it lands and the rebuild cannot wait for a green suite that the cut
itself makes red. **⏸ His yes on the two stages**, or a different order.

---

### T1 — two balance tests: "All the Crunch" and "Basic Bite"

> Honeycomb work, I need you to optimize the tests used for game balance. I feel as though it isn't
> simulating actual in-game experiences closely enough, and also it's quite slow. I could make do with
> one or the other, but it feels as though I'm getting the worst of both worlds. Can you help? If
> possible, I wouldn't mind a suite split. Balance Test "All the Crunch" would be the powerhouse,
> generating reliable data, rates we can trust, and Balance Test "Basic Bite" (these names would help me
> instantly identify which test you are running at any given time) would abstract many concepts and
> cards, just to make sure that things aren't wildly out of tune.

Session 52 advised against abstracting cards in Basic Bite, because a simplified copy of the game goes
out of date the way `tools/draft-sim/` did. His answer:

> Yes if it's not a huge drag on performance then Basic Bite should ideally use real cards.

On running fights across CPU cores (`--workers`), after a misunderstanding about what "workers" meant
was cleared up:

> Oh, yes, I completely misunderstood. Parallel workers is completely fine in that case.

On who builds it:

> In fact it'd be best if you were the one who prepared a detailed handoff and guide rather than the
> one who built it yourself, though I could have you check it afterwards. I'm very usage-rate conscious
> right now.

`BALANCE-BRIEF.md` is that handoff. Steps 1–3 and 8.

**Noodle, 2026-09-25**, in the housekeeping message that set the second demo's gate (`../BASICS.md`, the
second demo), among the early-stage blockers:

> - Balance suites A and B

Basic Bite and All the Crunch. What is not done is in `TOOLING.md`: the full-size overnight run, the
calibration against his own play (T3), and Steps 5 to 7's own checks. It is a blocker because
`../card_pool/CARD-POOL-02.md` §6 wants a Crunch run before and after the pool lands, and
`../enemies/` S64-1's turn-target question wants one either side too.

---

### T2 — All the Crunch should prove the game's content can be reached

> if we should make All the Crunch so thorough it makes sure all of the game's content is actually
> achievable by a player. By that I mean there are multiple routes and currently one secret route after
> completing all of them, purchasing a relic, and then completing the Act1-1 map with it in your
> inventory. That's probably the most complex goal to achieve, alongside 100% progression tree progress
> (the game's meta progression). The data we could gain from running a test like that just once would be
> invaluable, especially balance regarding progression trees and how they influence game balance, which
> we've mostly been guessing at so far, but would make the test basically an overnight affair only.

`BALANCE-BRIEF.md` Steps 4, 6 and 7: career mode answers "can it be reached", matrix mode answers "how does the
tree change difficulty".

---

### T3 — one bot, and it plays well

> I think it should only have one skill level, I'll get a lot of feedback from players who will do a
> much better job of accurately portraying careless players than a bot ever could. The experience of
> careless players can't be measured by having a bot make poor choices at random, it's extremely
> specific things, but also ones you or I could never predict. Balance for a skillful player is what
> matters.

`BALANCE-BRIEF.md` Step 2. Owed from Noodle once it is built: a few fixed-seed fights played by hand, to compare
his damage per turn with the bot's.

---

### T4 — removing and skipping cards

> The only factor I'd like to directly bring to your attention is a major balance factor we have the
> benefit of hindsight over, because we're in well-explored waters: Removing & Skipping Cards. I worry a
> bot will undervalue the consistency card removal can bring, and it's an easy thing to miss when
> designing a bot for a game like this, getting into the mindset of "which cards should the bot pick",
> and not testing if burning your entire deck is stronger than any of them.
> Personally, a bot stopping picking cards would be at least somewhat alarming to me, as it would
> suggest the deckbuilding portion of the game stops partway through and the game becomes stale.

On the bot learning card values from results instead of from a synergy table:

> However, your suggestion is a good one. It can't replicate "slow then broken" deck concepts that
> require extremely specific multi-card combos or behaviors, but those are rare enough it won't be a
> major issue.

`BALANCE-BRIEF.md` Step 5: skip and "remove nothing" are learned like any card, a thin-deck bot and a
take-everything bot run on the same seeds, and the report has a section on when the bot stops picking.

---

### T5 — the draft sim stays, unused for now

> I don't think it should be retired, but we certainly don't need it right now. Draft sim simulates a
> few personalities and when it comes back I'll have more data to construct better archetypes. Plus,
> "perceived" synergy between cards is extremely subjective, and requiring that to be re-tuned for All
> the Crunch to serve as a card pick rate indicator would turn it from an overnight thing to a bimonthly
> one at best.

Nothing to build. `tools/draft-sim/` is left exactly as it is. This item closes when the build does.

---

### T6 — the veteran gap is intended; the test measures its size

Session 54 found that a long career's Lust weakness ranks reach Undone (double Lust) and never fall, and that
the bot's career win rate fell as the trees filled. Noodle:

> That was intentional, to an extent. 2x is likely too much, maybe 1.6x would be better if the progression tree
> is so weak that there's a huge gap between fresh and veteran players. But the system as a whole is meant to
> incentivize more complex teams once there are more characters, and to keep the game challenging for veteran
> players. It ties in nicely to the feelings of surrender and self-sabotage present in most lust events.

On career mode never filling a tree in 150 runs:

> Career mode not filling in the tree is completely intentional. This is just act 1 of three. 150 runs is beyond
> what I would expect of players, and 75% is beyond what I would expect from players' tree progress.

So the corrected matrix (Steps 6–7, each tree level with and without the ledger) is not there to remove the
ledger from the game; it is there to put a number on the fresh-versus-veteran gap so he can decide whether the
rank-3 multiplier (`tuning.lust.exposureRankArray`, 2.0) should come down. **The number is owed; the tuning
change is his, not the test's.** Career mode's `--max-runs` default should sit near what he expects of a player,
not at 150.

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
(`QUALITY-LAB-BRIEF.md` §3.3), because the Battle Lab's window version was rejected once already for blocking the
board and hiding the pictures, and because the mode reuses every Battle Lab seam. "Scene" in the pitch
may only mean "somewhere to test". **Needs:** a yes, or the reason a separate screen is wanted.

---

### Q3. How an enemy plays a player's card ⏸

> the same amount of enemies play the current action in sequence

When the current action is a player card, an enemy can play it only through a new verb that builds an
intent from the card's effects (`QUALITY-LAB-BRIEF.md` §3.4). The alternative for a first build is the enemy move
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
file, a shake's trail to the template, and to a single card only when the tester asks (`QUALITY-LAB-BRIEF.md`
§3.7). The compare tool lists every card carrying its own override so that number stays visible.
**Needs:** confirmation that per-card overrides are the exception and the default toggle points at
the asset or template.

---

### Q8. The device profile and the hitch log in telemetry ⏸

> When finished, this should be saved to call upon outside of the quality lab as well, in case there are
> instances of player-perceived lag that cannot be measured by your systems.

Inside the game this is a `quick` debug action usable in any fight (`QUALITY-LAB-BRIEF.md` §3.5). Outside it, the
device profile and a hitch log are the two fields the telemetry beacon (`../engine/` A8) lacks
for the "are players seeing something I am not" question, and they would fall under his neocities-only
rule like everything else in it. Whether a PLAYER ever sees a "report lag" control is a product
decision and is not assumed. **Needs:** whether the two fields join the beacon once an endpoint is
picked, and whether players get a control.

---

### S65-1. Review grids: cards and relics rendered in the frame ☆ — FILED 2026-09-25

> Sure. HOWEVER. This came up in the last two sessions. I cannot judge cards or relics as lists in txt
> files. I want visual grids. They can be dummies using the game's card art, but I must be able to see a
> card with its cost and effect in the card frame in order to feel I can judge it fairly. I would want a
> similar grid of relics. That means all review and veto-ing is deferred for desktop sessions, please record
> this in your claude file.

The rule is recorded in `../BASICS.md` ("Design review happens on the desktop, in the frame"). The tool it
needs: a bench page that renders a list of proposed cards through the game's real card drawing
(`../tools/card-effects-preview.html` composes the frame already) and a matching relic grid with icon, name,
rarity, pool and text, fed from a JS or JSON list so a draft can be dropped in without touching a content
table. Desktop only: the cloud copy has placeholder rasters, and a screenshot against placeholders lies
(`../reference/TRAPS.md`). Waiting on it today: `../card_pool/CARD-POOL-02.md` §3's six grids and the
neutrals, `../relics/RELIC-REWORK-01.md` §4 and §8.

---

## Unsorted — drop new reports for this pipeline here

*(a report that does not clearly belong to this pipeline goes in `../FEEDBACK.md` instead)*
