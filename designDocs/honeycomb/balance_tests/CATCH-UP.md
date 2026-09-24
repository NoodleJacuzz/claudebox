# Balance tests — CATCH-UP

| File | Holds |
|---|---|
| `BRIEF.md` | the build handoff: eight steps, each ending in checks |
| `FEEDBACK.md` | Noodle's requests, verbatim (T1–T5) |
| `INFERENCES.md` | guesses made without him, each a one-line change (I1–I7 from the design, I8–I14 from the build) |
| `../tools/balance/basic-bite.js` | BALANCE TEST: BASIC BITE |
| `../tools/balance/all-the-crunch.js` | BALANCE TEST: ALL THE CRUNCH (modes `--trace`, `--compare`, `--career`, `--matrix`) |
| `../tools/balance/lib/` | what both share: `engine.js`, `combat-player.js`, `workers.js`, `run-player.js`, `policies.js`, `learning.js`, `career.js`, `stats.js` |
| `../tools/balance/results/` | what the tests wrote, one folder per run named `<date>-<tag>` |

## The check (session 54, 2026-09-21, the model that wrote the brief)

**What was verified, not taken on trust:** suite re-run, 2486 passed, 0 failed. The `selectedNodeArray` cache
read in full: its key covers everything `treeFor` reads (character and outfit) plus the selection list, so it
cannot go stale across a snapshot restore. `settleVictory` read in full: the screen's lines, in the screen's
order, and the screen calls it. `tuning.chessmaster.gauntlet.enabled` is still `false` in the file and nothing
in `honeycomb-tuning.js` moved. `run-player.js` reaches every stop through the game's own functions
(`enterNode`, `eventOverlay.choose`, `shop.buyCard`, `descendRegion`, `settleVictory`); no game rule is copied
into it. Two runs traced by hand on seed 7: every stop is a connected node, gold never goes negative, the
region descends after the boss, and the next fight starts at the health the last one left.

**The first full-size matrix cannot be read as a tree measurement.** Its columns say 0% tree wins 4%, 25%
wins 19.5%, 50% wins 15%, 75% wins 2%, and the career win rate falls from 4-in-20 to 0-in-20 as the trees
fill. The cause is in the saved profiles, not in the tree: a career profile also carries the Lust weakness
ledger, which grows every run and whose ranks never fall (`honeycomb.lust.rankFloorFor`, Noodle's rule). By the
75% profile every character is at rank 3 on most tags, which is double Lust taken. So each column changed two
things at once. The brief said to save the profile as it was, so this is the brief's mistake; Steps 6 and 7 are
corrected (save each level with and without the ledger). **Until the matrix is re-run that way, do not quote
its tree numbers.** The by-party, by-character and by-route tables suffer the same confound.

**A game finding underneath the confound, for Noodle to judge:** on a long career, weakness ranks reach Undone
on everybody and stay there. The only counters are the Fortitude node (caps at rank 1) and sitting a character
out (bench decay to the rank floor, never below it). The career numbers say the tree does not make up for it.
Whether a veteran profile is meant to be harder than a fresh one is a design question; this is the first
measurement of it.

**Smaller things found:**
- The bot fields characters the teambuilding screen would lock out for a waiting Lust Event, and never played
  one (the never-reached list shows every Lust Event unseen). Added to Step 6.
- On seed 7, `moldGarden` was rolled at four of the six middle-tier combat stops of Act1-1. One seed proves
  nothing; if it repeats across seeds it is a `map/` observation (a small pool or no repeat guard).
- The thin-deck and take-everything bots rest even at 100% health (the rest choice is picked by a word match
  on "sleep|rest|heal"), which wastes a stop and makes both comparison bots weaker than a skilled player.
- The 0.75-hour matrix ran 220/220/200/200 runs per level against a plan of 420, and the report does not say
  the plan was cut short. It should.
- The compare report has no "how far the runs got" table per bot, and the thin-deck bot's 16.9 fights won
  per run against 8.3 can only be read with one. It is real: Act1-1 alone is 18 rows on seed 7.

## Where the work is (session 53, 2026-09-21)

A cheaper model built this from the brief while Noodle was away. **Every step is built and every mode has been run.
Steps 1 to 4 were checked against the brief's checks. Steps 5 to 7 were run at small size only (48 runs, 4 runs and 20 runs), and
one full-size run of all three was started at the end (see "The first full-size run"). Nothing has been checked against Noodle's
own play yet.** Read "What was not checked" before trusting any absolute number.

Two changes to game code were made, both small:

- `honeycomb.progression.selectedNodeArray` remembers its answer (Step 1). Covered by suite block [127].
- The payout of a won fight moved out of the victory screen into `honeycomb.combat.settleVictory` in `honeycomb-combat.js`
  (Step 4, "when a payout lives in a UI function", option 3). The screen calls it. Covered by suite block [128].

Nothing in `honeycomb-tuning.js` was changed. The gauntlet switch in the file was not touched: the career mode turns it on in
memory only, on its own loaded copy.

## How to run them

```
node "!designDocs/honeycomb/tools/balance/basic-bite.js" --workers 10
node "!designDocs/honeycomb/tools/balance/all-the-crunch.js" --trace 7
node "!designDocs/honeycomb/tools/balance/all-the-crunch.js" --compare --explore 400 --runs 100 --workers 10 --out <folder>
node "!designDocs/honeycomb/tools/balance/all-the-crunch.js" --career --careers 4 --max-runs 150 --workers 4 --out <folder>
node "!designDocs/honeycomb/tools/balance/all-the-crunch.js" --matrix --hours 8 --workers 10 --out <folder>
```

Use the same `--out` folder for the last three: `--compare` writes values.json there, `--career` reads it and writes the tree
profiles to `profiles/`, and `--matrix` reads both and writes matrix-results.jsonl as it goes. Stopping the matrix loses at most a
few runs, and running it again with the same folder carries on from where it stopped.

## Measurements

| What | Number | How |
|---|---|---|
| 27 fights of the old audit, before Step 1 | 29.2 s (profiler on) | `budget-audit.js --seeds 1 --party brienne,nettle,severine --region 0` |
| The same after Step 1 | **7.2 s**, report byte-identical | same command |
| Tree lookups after Step 1 | `selectedNodeArray` 2.3%, `memberCardModifierArray` 10.4%. The second cache was not added because the brief said to add it only if the figure stayed high | `../tools/balance/profile-summary.js` |
| Same 27 fights, moved bot with both fixes off | 6.6 s, table identical to the old audit | `basic-bite.js --bot-legacy` |
| Choice-card fix alone | 8.3 s (+26%) | same 27 fights |
| Setup-card second look alone, caps 8 and 8 | 11.9 s (+80%) | same |
| Both fixes, caps 8 and 8 | 15.7 s, 2.4 times the legacy time per fight | same |
| Both fixes, caps 3 and 3 (now in the file) | 11.3 s, 1.8 times the legacy time per fight | same |
| Basic Bite, full default run (80 encounter rows, 4 parties, 4 seeds, 1280 fights), 10 workers | **222 s** | **The brief's target of under two minutes was not met.** This run overlapped a full suite run, so a quiet machine is faster, but the 1.8 times cost of the second look is real. `--bot-legacy` skips both fixes |
| The same, 1 worker | 1400 s (23 minutes), also overlapped with other work | |
| The two full reports | byte-identical | `cmp` of the 1-worker and 10-worker output |
| One whole run of All the Crunch, one worker | 7.8 seconds on average over 36 runs (longest 18.6), also while other work was running | `--trace` and a scratch loop |
| Noodle's machine | Ryzen 5 3600, 12 threads | `os.cpus()` |

## Step log

| Step | What was built | What was checked, and how it was made to fail |
|---|---|---|
| 1 lookup cache | cache in `selectedNodeArray`, keyed on outfit and the selection list itself | Suite block [127], 24 checks: equal to a fresh computation after a buy, a second rank, a refund and its cascade, a snapshot/restore round trip, an outfit that locks nodes, a reset, and two characters. Suite 2468/0 at the time. Falsified: taking the selection list out of the key turned 16 checks red; taking the outfit out turned "in an outfit that locks nodes" red. **One mutation could not be made to fail:** sharing one cache slot across characters. It is not a bug, because node names carry the character's prefix, so two characters only share a key when both selections are empty, and then the answers are the same |
| 2 shared library | `engine.js`, `combat-player.js`, `workers.js` | Moved bot's table was identical to the old audit before the fixes were switched on. `--workers 1` and `--workers 8` reports byte-identical. A job that throws and a worker process that dies (`process.exit(9)` inside a job) were both listed by their job in a scratch test, with 1 and 3 workers. Cost of the two fixes above. **The calibration list for Noodle is below** |
| 3 Basic Bite | `basic-bite.js`, stub `budget-audit.js` | First line is `BALANCE TEST: BASIC BITE`. All the old options work. Plain-English "far from their target" section. Timing above. README and root `CATCH-UP.md` updated, `doc-links.js` green |
| 4 run player | `run-player.js`, `engine.js` option `drivenOverlays`, `settleVictory` | Payout: option 1 for events, shop, treasure, region clear and defeat (called as they are), option 2 for the two UI files (they load cleanly), option 3 for the victory payout. Suite block [128], 18 checks: the payout pays gold, experience and relic; the same seed gives the same record twice on one engine and once on a fresh engine and a different seed differs; back-to-back fights start where the last ended (and the comparison notices a tampered record); a run that descends goes to the region the boss it just beat names; **a won run is recorded as won**. The last one caught a real bug (below) and was made to fail by putting the bug back |
| 5 out-of-fight decisions | `policies.js`, `learning.js`, `--compare` | Ran end to end at small size. **No automated check of the learning maths yet** |
| 6 career mode | `career.js`, `--career` | Ran at 4 runs with 2 careers. Fair spending was added after the first look showed the global experience pool going to whichever character was spent on first. **No automated check yet** |
| 7 matrix mode | `--matrix` | Ran at 20 runs. Prints its plan and starts, writes a line per finished run, skips what is already done. **The stop-and-resume path was not exercised** |
| 8 closing out | README, root CATCH-UP row and Recent-sessions line, this file, `doc-links.js` green, `feedback-audit.js` green | Full suite after the last code change: **2486 passed, 0 failed** (2444 before this session, plus blocks [127] and [128]) |

## A bug the build found in itself

Every run was being recorded as a defeat. `playRun` kept a reference to `hc.state.profile` from before the run, and every dry run
(forecast, question, bot lookahead) replaces the whole state object, so the reference pointed at an abandoned copy and the win counter
never appeared to move. Found because 36 runs in a row ended in defeat, so a run was forced to win by giving the party 4000 health.
The profile is now read live, and suite block [128] fails if the bug comes back. All earlier small-scale numbers in this file that
mention win rates were produced before the fix; they were all zero.

## The first full-size run

See `../tools/balance/results/2026-09-21-first/`: compare-report.txt, career-report.txt, matrix-report.txt, timings.txt. Which of
those exist tells how far the run got. It was started with `--compare --explore 400 --runs 100`, then `--career --careers 4 --max-runs 150`,
then `--matrix --hours 0.75`, each with the same `--out` folder.

### The compare stage finished (21 minutes, 400 explore runs, 100 runs per bot)

Runs won: learned 6, thin-deck 2, take-everything 8, random 1, out of 100 each. The win-rate ranges overlap, so the report says no
difference is visible. **The fights-won figure says something the win rate cannot yet:** the thin-deck bot won 16.9 fights per run
against 8.3 for the learned bot and 8.1 for take-everything. Stripping the deck gets a run about twice as far, but it rarely finishes
one. That gap is large and was not in the report's opening paragraph, because the paragraph only compares full wins. Worth Noodle's
eye, and worth a change to the opening paragraph once he says how he wants far-but-not-won runs treated. The learned bot is close to the
random bot, as INFERENCES I11 predicted at this batch size.

## What was not checked

- The bot has not been compared with Noodle's own play. **Every absolute win rate is a number about the bot.** Comparisons between
  columns and between bots on the same seeds are the part that can be trusted.
- Whether the learned values are any good. The explore batch's size decides that. At 400 runs most cards will still be below the 12
  samples a side needed to be trusted (INFERENCES I11), so the learned bot will look a lot like the random bot.
- The stop-and-resume path of matrix mode, and matrix mode at more than one tree level (only level 0 was seen in the small runs).
- That a career ever reaches 100% of the trees or clears the secret gauntlet. The small runs did not get near.
- The `--trace` output was read by eye. The brief's other trace checks (deck size equals starting size plus cards taken minus removed)
  were not made: events add and remove cards too, so the sum is not exact.
- Shop tabs other than cards, relics and removal (INFERENCES I10).

## Owed to Noodle

Fixed-seed fights to play by hand, so his damage per turn can be compared with the bot's. Each is the fresh-save
Brienne, Nettle and Severine party, seed 1, with the deck the game's own reward roll drafts for that point in a run. The bot's numbers
are damage plus Lust dealt per turn, from `basic-bite.js --trace <encounter> --party brienne,nettle,severine`:

| Encounter | Cards drafted first | Bot's turns | Bot's damage per turn |
|---|---|---|---|
| wispCluster | 2 | 4 | 19.5 |
| leechPit | 7 | 6 | 18.5 |
| bruteAndSpore | 5 | 5 | 20.6 |
| barkWall | 5 | 7 | 15.7 |
| championAlone | 5 | 8 | 19.9 |
| tallyLedger (boss) | 7 | 8 | 25.9 |

Session 34 settled on about 18 damage a turn for a fresh save, so these are in the range that was agreed. The bot's second-look
setting (INFERENCES I8) is the knob if he finds it plays too carefully or too carelessly.

## Next builder session — the follow-up list (session 54)

Do these in order. Each one is small. Update the step log above as each lands.

1. **Step 6 correction:** save every tree-level profile twice, as the career left it and with
   `profile.lustExposureArray` cleared to `{}` (and `lustRankUpArray`, `lustRankGainArray` emptied the same way).
   Name them tree-25.json and tree-25-fresh.json. Check: the fresh copy's `honeycomb.lust.rankFor` is 0 on
   every tag for every character; the tree selection is identical between the pair.
2. **Step 7 correction:** matrix columns are both forms of each level. The tree table reads the fresh form; a
   second table, "what the veteran ledger costs", shows each level's two win rates side by side. The plan line
   must say when the run finished short of its plan, with the counts.
3. **Event Ready lock (Step 6):** career mode benches a character whose `honeycomb.lustEvents.nextFor(index)`
   is not null, and the report counts how many runs each character sat out for it. Playing the event is the
   better answer if it is a one-afternoon job; benching is acceptable and must be stated.
4. **The two comparison bots rest at 100% health.** In `policies.js`, the thin-deck and take-everything rest
   choice should take the heal only when the party is below full health, otherwise the upgrade (thin-deck) or
   the first non-heal option (take-everything). Say what was chosen in the report's rules block.
5. **`basic-bite.js --draft N`** to override the drafted-card count, so `--trace X --draft 0` plays the fresh
   starting deck. This is for Noodle's calibration: he plays the same fight on a fresh save in the browser.
6. **Compare report:** add "how far the runs got" per bot (share reaching the first boss, share reaching the
   second, mean fights won), because the fights-won figure cannot be read without it.
7. **`--max-runs` default** for career mode down to what Noodle expects of a player (T6). He has not given a
   number; 40 is a placeholder and goes in `INFERENCES.md` as I15.
8. Then the overnight chain again, in a new results folder, with the commands in "How to run them", `--matrix
   --hours 8`. Do not touch `2026-09-21-first/`; it is the record of the confounded run.
