# Balance tests — BRIEF (the build handoff)

Written session 52 (2026-09-21) by the session that did the design with Noodle. **It is written to be
built by a different, cheaper model, cold.** Read `../BASICS.md`, then this file, then start at Step 1.
Do not read other workstreams.

This is a standing brief. Do not add progress to it. Progress goes in `TOOLING.md`, guesses go in
`BALANCE-INFERENCES.md`, Noodle's words are in `TOOLING.md`.

| File in this folder | Holds |
|---|---|
| `BALANCE-BRIEF.md` | this file: what to build, in order, and the check each step ends on |
| `TOOLING.md` | where the build is. Update it as each step lands |
| `TOOLING.md` | Noodle's requests, verbatim. The open items |
| `BALANCE-INFERENCES.md` | choices made without Noodle, and how to change each one |

The tools themselves go in `../tools/balance/`. Nothing goes in the honeycomb root.

---

## 1. What is being built

Two balance tests with names Noodle can recognise at a glance. **Each one prints its name as the first
line of its output**, in capitals, so he can tell which is running from across the room:

```
BALANCE TEST: BASIC BITE
BALANCE TEST: ALL THE CRUNCH
```

**Basic Bite** is the quick one. It plays every encounter as a single fight, with a deck typical for
that point of a run, and says which encounters are far from their targets. It should finish in a
minute or two. It answers one question: is anything wildly out of tune?

**All the Crunch** is the slow, trustworthy one. It plays whole runs from the first map node to the
last boss, with damage carrying from fight to fight, with shops, rests, events, relics, card rewards,
removals and the progression tree. It has two modes:

- **Career mode** answers "can a player actually reach everything?". One simulated player starts on a
  fresh profile and plays run after run, earning EXP and buying tree nodes, until they have cleared all
  three Act1-2 routes, bought the gauntlet relic, cleared the secret gauntlet, and filled every tree.
- **Matrix mode** answers "what are the rates?". It plays the same seeds at several levels of tree
  completion, across every party, so the effect of the tree on difficulty can be read directly.

Both tests use **the real engine and the real cards**. Nothing is abstracted. Noodle agreed to this.

### Why, in measurements (session 52)

- `tools/draft-sim/` never plays a fight. It prices cards from a hand-written table. It is staying
  where it is, untouched, for later (see `TOOLING.md` T5). Do not use it and do not delete it.
- `../tools/budget-audit.js` is the only tool that plays fights. Every fight in it starts from a fresh save
  at full health, with no tree, no relics beyond heirlooms, no shops, rests or events. Nothing carries
  from one fight to the next. In the slice measured, the bot won 100% of fights, bosses included, which
  says nothing about how a run is lost.
- It is slow for a fixable reason. 27 fights took 29 seconds. **76% of that time was spent looking up
  progression tree nodes on a profile that owned no nodes** (`honeycomb.progression.selectedNodeArray`
  33%, `honeycomb.memberCardModifierArray` 15%, `selectionArray` 11%, `rankOf` 9%, `rankMaximum` 8%).
  The engine walks the character's whole tree, and counts ranks for every node, every time a card is
  resolved. With a full tree this gets much slower, so All the Crunch cannot be built before it is fixed.

---

## 2. Rules for the builder

1. **Everything Noodle reads is plain English** (`.claude/CLAUDE.md` rule 1). That includes the reports
   these tools print. Write "Brienne, Nettle and Severine won 212 of 1000 runs" and not "BNS 21.2% WR".
   A report row that needs decoding is a bug.
2. **The simulation never contains a copy of a game rule.** Gold, rewards, EXP, prices, healing and
   route choice are all computed by calling the game's own functions. If a payout is locked inside a UI
   function that cannot run without a browser, see Step 4, "When a payout lives in a UI function".
3. **This workstream measures. It never tunes.** Do not change a card, an enemy, a price or any number
   in `honeycomb-tuning.js` because a report looks bad. Report it and stop.
4. **Never edit `tuning.chessmaster.gauntlet.enabled` in the file.** That switch is Noodle's. The
   simulation sets it on its own loaded copy of the engine, in memory, after loading.
   Anastasia's `inDevelopment: true` flag stays set.
5. **Same arguments give the same report, byte for byte**, whatever `--workers` is set to. The game's
   random numbers are already deterministic. Sort results by job number before reporting.
6. **Every knob the bot has lives in one `PARAMS` table** at the top of the file that uses it, with a
   comment saying what it does. No number buried in a function.
7. The suite is long. Run it in the background and read while it runs. Never pipe a long job through
   `grep` or `tail` in a way that hides a failure. Never read `../tools/test-honeycomb.js` whole; grep it.
8. Each step below ends in checks. **Try to make each check fail before recording that it passed**
   (break the thing it checks, watch it go red, put it back).
9. Update `TOOLING.md` when each step lands, not at the end. A session can be stopped at any moment.
10. **Stop and ask Noodle** before: moving more than one small function out of a UI file; changing how
    the bot scores a fight (`SCORE` in the combat player) to hit a number; anything not covered here
    that changes what a report claims.

---

## Step 1 — the lookup cache (game code, small, do this first)

**File:** `scripts/misc/honeycomb/honeycomb-progression.js`, `honeycomb.progression.selectedNodeArray`.

**What is wrong.** It loops over every node in the tree and calls `rankOf` for each, and `rankOf` scans
the whole selection list. It is called on every card resolve through `honeycomb.memberCardModifierArray`
(`honeycomb-state.js`). The answer only changes when the player buys, refunds or resets a node, or
changes outfit.

**The fix.** Remember the last answer per character. Build a key from everything the answer depends on,
and return the stored array when the key matches.

- Use a **content key**, not a version counter: `characterIndex + "|" + outfitIndex + "|" +
  selectionArray.join(",")`. The reason: `honeycomb.snapshotState` / `honeycomb.restoreState`
  (`honeycomb-choices.js`) replace the state object, and every forecast and every bot lookahead does
  that. A counter bumped inside `select` would be wrong after a restore. A key made from the contents
  cannot go stale.
- Read `honeycomb.progression.treeFor(selection)` first. **Anything else it reads to pick a tree must go
  in the key too** (it takes the whole selection, so check whether outfit or anything else matters).
- Check every caller of `selectedNodeArray` (grep). If any caller changes the array it gets back, return
  a copy (`slice()`), otherwise return the stored array.
- One pass over the selection list to count ranks into an object, then one pass over the tree. That
  replaces the nested scan even on a cache miss.
- Then profile again (command below). `memberCardModifierArray` showed 15% of its own. If it is still
  high after the first fix, cache it the same way, with `equipmentArray` added to the key. If it is not
  high any more, leave it alone.

**Comments** follow BASICS: no "I", "you" or "we"; say why, and name session 52 and this folder.

**How to measure.** Run this before and after, and record both times in `TOOLING.md`:

```
node --cpu-prof --cpu-prof-dir=<scratchpad>/prof "!designDocs/honeycomb/tools/budget-audit.js" --seeds 1 --party brienne,nettle,severine --region 0
node "!designDocs/honeycomb/tools/balance/profile-summary.js" <scratchpad>/prof
```

Session 52 measured 29 seconds for that command with the profiler on. The report table it prints must be
**identical** before and after. Save both outputs and diff them. A cache that changes a single number
in that table is wrong.

**Checks (new numbered block at the end of `../tools/test-honeycomb.js`; the last block was [126]):**

- the cached answer equals a fresh uncached computation after: buying a node, buying a second rank,
  refunding, `reset`, changing outfit, and a `snapshotState` / `restoreState` round trip that undoes a
  purchase;
- two characters do not read each other's cache;
- falsify: remove the selection list from the key and watch the first check go red.

Then the whole suite, green. This code also runs in the live game on every card, so note the speed-up in
`../engine/ENGINE.md` as a finding. Do not claim it fixes anything players reported.

---

## Step 2 — the shared library (`tools/balance/lib/`)

Three small files, so Basic Bite and All the Crunch cannot drift apart.

**engine.js** loads the game into a Node `vm` sandbox and returns `honeycomb`. Copy the loader from
`../tools/budget-audit.js` lines 34–51. Take the file list from `../tools/card-inventory.js` the same way it
does. After loading, replace `honeycomb.scene.go`, `honeycomb.overlay.open` and `honeycomb.overlay.close`
with functions that do nothing, and make `honeycomb.save.autosave` do nothing (it runs on every map
move). Accept an option that sets the gauntlet switch in memory (rule 4).

**combat-player.js** is the bot that plays one fight. Move it out of `../tools/budget-audit.js`
(`SCORE`, `scoreWorld`, `playMove`, `lookahead`, `targetsFor`, `candidateMoves`, `playTurn`, and the
turn loop inside `playFight`). Read the header comment of `budget-audit.js` first; it explains why the
bot looks the way it does. Noodle wants **one skill level, a skilful player** (`TOOLING.md` T3), so fix
its two known weak spots:

1. **Choice cards.** It always answers a choice with the first option. Make it try every option as a
   separate candidate move and keep the best.
2. **Setup cards.** It looks one card ahead, so a card that only pays off through the next card scores
   the same as doing nothing and is never played. Add a limited second look: for a move whose own gain
   over ending the turn is below `PARAMS.setupGainThreshold`, also score "this move, then the best
   follow-up move, then the enemy turn". Cap the number of pairs tried per turn with a `PARAMS` value.
   **`honeycomb.forecast.dryRunLog` refuses to nest** (`honeycomb-forecast.js`, around line 63), so both
   plays must happen inside one `dryRunLog` callback. Do not call a dry run from inside a dry run.

Measure the cost of each of those two changes in seconds per fight and write it in `TOOLING.md`. If the
second look more than doubles the time per fight, lower the cap before going on.

**Do not retune `SCORE`.** Whether the bot plays like a skilled human is settled by Noodle playing a few
fixed-seed fights and comparing his damage per turn with the bot's `--trace` output. Session 34 did this
once and landed on about 18 damage a turn for a fresh save. Prepare the list of fights and seeds for him;
do not guess the answer.

**workers.js** splits a list of jobs across copies of the script using Node's `child_process.fork`.
These are operating-system processes on Noodle's 12-thread machine. **They are not AI agents and cost no
usage.** `--workers N`, default 1. Each worker loads its own engine, takes jobs, and sends back one
result per job. The parent sorts by job number. A worker that crashes reports which job killed it, with
the seed, and the parent carries on and lists it at the end as a failure. It is never silently dropped.

**Checks:** the moved bot gives the same Basic Bite table as `budget-audit.js` did before the two fixes
(move first, diff, then improve); `--workers 1` and `--workers 8` give byte-identical reports; a job
that throws is listed by seed.

---

## Step 3 — Basic Bite (**tools/balance/basic-bite.js**)

This is `budget-audit.js` on the shared library, with workers. Same parties, same drafted-deck rule, same
columns, same ✓ and ▲ marks against `tuning.balance`. Keep every command-line option it has
(`--seeds`, `--party`, `--region`, `--only`, `--json`, `--trace`) and add `--workers`.

- First line of output: `BALANCE TEST: BASIC BITE`.
- After the table, a short plain-English section: "These encounters are far from their target", one
  sentence each, saying which number is off and by how much. "Far" is a `PARAMS` value
  (`BALANCE-INFERENCES.md` I1).
- Leave `../tools/budget-audit.js` in place as a few lines that run Basic Bite, because many documents
  point at that name. Run `node "!designDocs/honeycomb/tools/doc-links.js"` afterwards.
- Update `../tools/README.md` and the tools table in `../CATCH-UP.md`.

**Check:** full default run, wall-clock time recorded in `TOOLING.md` at `--workers 1` and
`--workers 10`. The target is under two minutes at 10.

---

## Step 4 — the run player (**tools/balance/lib/run-player.js**)

This plays one whole run and returns a record of it. It is the heart of All the Crunch and the step most
likely to go wrong, because **the game's run flow is partly written inside UI files**. What session 52
found (verify each before relying on it):

| Part of a run | The game's function | File |
|---|---|---|
| New profile, new run | `honeycomb.newProfile()`, `honeycomb.newRun(selectionArray, seed, options)` | `honeycomb-state.js` |
| The map | `honeycomb.state.run.map`; `honeycomb.map.generateRegion()` if it is null | `honeycomb-map.js` |
| Where the party may go | `honeycomb.map.availableNodeIdArray()` | `honeycomb-map.js` |
| Moving | `honeycomb.map.enterNode(id)`: adds a day, decays the bench, bleeds Lust, then calls the node type's `onEnter` | `honeycomb-map.js` 585 |
| What a node does | `honeycomb.nodeTypeArray[].onEnter`: **every one opens a scene or an overlay**, which is why Step 2 turns those into do-nothings | `honeycomb-content-map.js` 22 |
| Starting a fight | `honeycomb.combat.begin(encounterIndex, settings)`. Read the combat scene's build to see what settings the real game passes for a map fight and a boss, and pass the same | `honeycomb-combat.js` 92 |
| Winning a fight | `honeycomb.combat.finishVictory()` **computes** the reward and returns it. It does not pay it | `honeycomb-combat.js` 1355 |
| Paying the reward | `honeycomb.victoryOverlay` (`takeCard`, `skip`, `finish`, and the render that grants gold and the relic). **This file is not in the tools' load list** | `honeycomb-overlays-combat.js` 100–270 |
| Taking a card | `honeycomb.addCardToRunDeck(cardIndex, ownerInstanceId)` | `honeycomb-state.js` |
| After a fight | the `"map"` entry of `honeycomb.combatContinuationArray`, then `honeycomb.map.completeCurrentNode()` | `honeycomb-overlays-combat.js` 23, `honeycomb-map.js` 631 |
| Events, and the rest site (the rest site is an event, `theCampfire`) | `honeycomb.eventOverlay.choose(eventIndex, choiceIndex, answerArray, fromPageIndex)`, `currentChoiceArray`, `finish`. Session 49 made events run under a second, read-only host for the gallery: read `honeycomb.eventHost()` first, it shows how | `honeycomb-overlays-map.js` 92, 475, 586, 1004 |
| Shop | `honeycomb.shop.stockFor(nodeId)`, `buyCard`, `buyRelic`, `beginRemoval(nodeId, answerArray)`, `buyTreatment`, `leave` | `honeycomb-overlays-map.js` 1120–1655 |
| Treasure | find what the `"treasure"` overlay grants | `honeycomb-overlays-map.js` |
| End of a region | `honeycomb.map.regionComplete()`, `honeycomb.map.awardRegionClear()`, `honeycomb.descendRegion()` | `honeycomb-map.js` 642, `honeycomb-overlays-map.js` 1718 |
| Which route comes next | decided by the Act1-1 boss just beaten: `tuning.map.route`, `honeycomb.map.resolveRouteRegionIndex(run)` | `honeycomb-map.js` 139 |
| Winning the run | `honeycomb.map.awardRunVictory()` | `honeycomb-map.js` 666 |
| Losing the run | find what the defeat screen pays. **EXP paid on a loss decides how fast a career grows, so this one matters** | `honeycomb-overlays-combat.js` |
| Buying tree nodes | `honeycomb.progression.refuseReason`, `nodeCost`, `select`, `personalExperience` | `honeycomb-progression.js` 910–1061 |

### When a payout lives in a UI function

Try these in order, and write down in `TOOLING.md` which one was used for each row above:

1. **Call the UI function as it is**, under the stubbed `document`. Many of them only build a string of
   HTML and are harmless. `honeycomb-overlays-map.js` is already in the load list and loads fine.
2. **Add the file to the simulation's own load list** (not to `card-inventory.js`) if it loads cleanly
   under the stubs. `honeycomb-overlays-combat.js` is the likely one.
3. **Move the payout into an engine function, and have the UI call it.** BASICS calls this "the engine
   is missing a verb". Move the lines byte for byte, change nothing else, add a suite check that the
   screen still pays the same, and run the whole suite. One small function may be moved without asking.
   For more than that, stop and ask Noodle (rule 10).

Never choose a fourth option of writing the payout again inside the simulation. The random number
streams are consumed in a fixed order (`finishVictory` rolls the relic before the cards for that
reason), so a copied rule that rolls in a different order gives different runs from the real game.

### The record a run returns

Everything later steps need, so nothing has to be played twice: seed, party, tree level; every node
visited with its type; for every fight, the encounter, turns, health before and after per member, Lust,
who broke, won or lost; **every decision the bot was offered, with all the options and which it took**
(card offers, removals, shop stock and purchases, rest options, event choices, path choices); gold over
time; deck list at each boss; relics; how the run ended and at which encounter; EXP paid.

### Checks

- `--trace` on one seed prints the run as readable lines, one per node. Read it top to bottom once and
  confirm it looks like a run: no fight entered twice, gold never negative, deck size equals starting
  size plus cards taken minus cards removed, every move was to a connected node.
- The same seed twice gives the same record.
- The party's health at the start of fight N+1 equals its health at the end of fight N plus whatever the
  nodes between them did. This is the check that damage really carries.
- A run that clears Act1-1 descends into the region `resolveRouteRegionIndex` names.
- Measure runs per minute on one worker and write it in `TOOLING.md`. **Every time estimate below
  depends on this number, and nobody has measured it yet.**

---

## Step 5 — how the bot decides things outside a fight

Noodle's direction (`TOOLING.md` T4, T5): there is no synergy table. Card synergy is subjective and
changes whenever the card pool does, and keeping a table of it in step with the game would make this
test something that gets run twice a year. So **the bot learns what to take from the game itself**.

### The learning loop

1. **Explore batch.** The bot makes every out-of-fight decision at random: which card to take or
   whether to skip, whether to remove and which card, what to buy, which rest option, which event choice.
2. For each decision, record what happened afterwards. The outcome measure is **how many more fights
   the run won after that decision**, with a bonus for finishing the run (`PARAMS`).
3. Work out a value for each option: the average outcome when it was **taken**, minus the average
   outcome when it was **offered and not taken**, at the same stage of the run. Values are kept per stage
   (the stages `tuning.balance` already uses, per region), because a card that is good early can be bad
   late.
4. **Exploit batches.** The bot takes the option with the highest value, if that value is above zero.
   Otherwise it skips, or declines the removal, or leaves the shop. It still decides at random some of
   the time (`PARAMS.exploreRate`), so the values keep updating and a card that was unlucky in the first
   batch can recover.
5. An option seen fewer than `PARAMS.minimumSamples` times has no trusted value and is decided at random.
6. The values are written to **values.json** beside the results and rebuilt on every full run. Nobody
   edits them by hand.

### The trap this design avoids — read this twice

Do **not** value a card by "how often was it in a deck that won". Runs that get further see more card
offers, so winning decks contain more of everything, and every card looks good. The comparison has to
be between runs that **were offered the same thing at the same stage** and chose differently. Because
the explore batch chooses at random, that comparison is fair. This is the reason step 1 is random and
not "sensible".

### Removing and skipping — Noodle's specific worry

His words are in `TOOLING.md` T4. In short: a bot built around "which card should I pick" tends to miss
that removing cards, or taking nothing, can be stronger than any card. And if the bot stops picking cards
partway through a run, that is a warning about the game.

So the following are required, not optional:

- **Skip is an option at every card offer, and "remove nothing" at every removal**, and both go through
  the same learning as the cards do. Removal is valued per card removed: the average outcome when card X
  was removed, minus the average when a removal was available, X was in the deck, and X stayed.
- **Two fixed comparison bots**, run on the same seeds as the learned bot:
  - **Thin deck:** skips every card offer, removes a card at every chance it gets, pays for removal at
    shops before anything else, and upgrades otherwise.
  - **Take everything:** takes a card at every offer and never removes.
- **The report leads with the comparison.** If the thin deck bot wins more runs than the learned bot,
  the first paragraph of the report says so in plain words: removing cards is currently stronger than
  drafting them, and by how much.
- **A section called "When the bot stops picking cards".** For each stage of a run: how often the
  learned bot took a card when offered, the average deck size, and how often it paid for a removal. If
  the rate of taking cards in the last third of a run falls below `PARAMS.stalePickRate`, print a
  warning that deckbuilding is ending early, and name the stage where it drops. (`BALANCE-INFERENCES.md` I2.)
- Also list: the cards skipped most often, the cards removed most often, and the cards whose value goes
  from positive to negative as the run goes on.

**A blind spot to state at the bottom of every report:** each card is valued on its own, so a deck that
needs three specific cards together before it does anything is undervalued. Noodle knows and accepts
this; the report still has to say it.

### Path choice

This one is a plain rule, not learned, because the map differs every run. From the current node, list
every path to the boss. Score each node on it by type, with weights that depend on the party's current
health and gold (`PARAMS`: a skilled player fights elites when healthy, rests when hurt, shops when
rich). Take the first step of the best path. Print the weights at the top of the report
(`BALANCE-INFERENCES.md` I3).

---

## Step 6 — career mode (`all-the-crunch.js --career`)

One simulated player, one profile, many runs in a row. After each run the EXP the game paid stays on the
profile and the bot spends it.

- **Party each run:** `BALANCE-INFERENCES.md` I4. Every character has their own EXP, so the rule decides how
  evenly the trees fill.
- **Spending EXP:** buy the cheapest legal node, repeat until nothing is affordable. Use
  `refuseReason` to ask what is legal. Some nodes share an `exclusiveGroup` and cannot be held together,
  so first work out what "100%" can mean for each tree and print that number.
- **The gauntlet:** read `../Archive/demo1/chessmaster/STATUS.md` for the exact conditions before writing this. What
  session 52 knows: the switch is `tuning.chessmaster.gauntlet.enabled` (set it in memory only), the
  relic is Grandmaster's Invitation, the shop sells it (`shopGuaranteed`), and carrying it through
  Act1-1 opens a secret region. Noodle describes the condition as: finish all three routes, buy the
  relic, then finish the Act1-1 map with it in the inventory. Beating her unlocks her, and her tree has
  43 nodes of its own. Report tree completion both with and without her.
- **Milestones to record, each with the run number it happened on:** first Act1-1 boss beaten; each of
  the three routes cleared; the relic first offered; the relic bought; the gauntlet cleared; each
  character's tree at 25, 50, 75 and 100%; everything at 100%.
- **Save a copy of the profile each time total tree completion crosses 0, 25, 50, 75 and 100%.** Matrix
  mode uses these, because a tree bought in the order a player would buy it is more honest than one
  filled at random.
  **Corrected session 54: a career profile carries more than its tree.** The Lust weakness ledger
  (`profile.lustExposureArray`) grows every run and its ranks never fall, so by the 75% profile every
  character took double Lust, and the first full-size matrix read "the tree makes runs harder". So save
  each level **twice**: as the career left it, and with the weakness ledger cleared (the ranks it would
  have on a fresh profile). The clean copy measures the tree. The pair measures the ledger.
- **Honour the Event Ready lock.** The teambuilding screen keeps a character whose Lust Event is waiting
  out of the party (`honeycomb.lustEvents.nextFor(characterIndex) != null`), but `newRun` does not refuse
  her, so the bot fielded locked characters and never played a Lust Event. Either play the event through
  the event overlay (it is an event like any other) or leave her on the bench for that run, and say in
  the report which was done. Count the Lust Events seen in the never-reached list.
- Stops when every milestone is reached or at `--max-runs`. Run several careers on different seeds
  (`--careers`, one per worker) and report the range across them, not one number.
- **The "never reached" list**, which is the point of this mode: every encounter never fought, event
  never seen, relic never offered, card never offered, and tree node never bought, across all careers.
  Anything on that list is either unreachable or very rare, and the report says which careers missed it.
- Also print the win rate over each block of 20 runs through the career. This is the first direct look
  at how much the tree changes difficulty as it fills.

Career mode uses the learned values from Step 5 if a **values.json** exists, and the explore rule if not.

---

## Step 7 — matrix mode (`all-the-crunch.js --matrix`)

Fixed profiles, many seeds, the same seeds in every column.

- **Columns:** the saved profiles at 0, 25, 50, 75 and 100% tree, **each in both its forms** (Step 6:
  with the career's weakness ledger, and with it cleared). The report's tree table is read off the
  cleared form; a second table beside it shows what the ledger alone costs at each level.
- **Rows:** every three-character party from the six shipped characters
  (`honeycomb.shippedCharacterArray()`; that is 20 parties).
- **`--hours N`.** The tool measures its own runs per minute for a few seconds, works out how many seeds
  per cell fit in N hours at the given `--workers`, **prints that plan, and then starts**. Noodle should
  never have to guess whether a run will end by morning. For scale: about 1000 runs per cell gives a win
  rate that is good to about ±3 points.
- **It must survive being stopped.** Write one line per finished run to a results file as it goes.
  On start, read that file and skip what is already done. A run stopped at 4am loses nothing, and
  `--hours 8` can be given again the next night to add precision.
- Results go in `tools/balance/results/<date>-<tag>/`. Never in the honeycomb root.

### The report (plain English, first line `BALANCE TEST: ALL THE CRUNCH`)

In this order:

1. The rules the bot used, printed in full: path weights, explore rate, which values file.
2. Thin deck against learned against take everything (Step 5).
3. **Win rate at each tree level**, each with its range. Say a difference is real only when the ranges
   do not overlap. Otherwise say "no difference this test can see".
4. How far runs get: the share that reach each boss, per tree level.
5. Where runs end: the encounters that finish the most runs.
6. Per party, per character, and per route.
7. "When the bot stops picking cards" (Step 5).
8. Card values, relic values, removal values, by stage.
9. The blind spots: the bot is not a person, so comparisons between columns can be trusted and the
   absolute win rate cannot until Noodle has checked the bot against his own play; multi-card combos
   are undervalued.

Noodle's standing direction on difficulty, for context when writing the summary: runs are meant to be
lost, and he would rather overshoot difficulty than undershoot. Report the numbers; do not judge them.

---

## Step 8 — closing out

- `../tools/README.md`: a `balance/` section. `../CATCH-UP.md`: update this workstream's row and add one
  line to "Recent sessions". `../FEEDBACK.md`: bump this folder's row.
- `node "!designDocs/honeycomb/tools/doc-links.js"` and `node "!designDocs/honeycomb/tools/feedback-audit.js"`, both green.
- Suite green.
- Tell Noodle, in plain sentences: what was built, what was measured, what was not checked, and the list
  of fixed-seed fights waiting for him to play for the bot calibration (Step 2).
