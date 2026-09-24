# Honeycomb Catacombs — FEEDBACK

**This file sorts; it does not hold.** Feedback lives with the workstream it belongs to, because a
session is a one-topic affair — enemies one day, the card pool the next, relics after that. Carrying
forty items you are not working on costs context every session for nothing.

Two jobs only:

1. **The inbox at the bottom.** New reports land there, unsorted. The next session files each one into
   a workstream's `FEEDBACK.md`.
2. **The index below.** What each workstream holds, how many items are open in it, and when it last
   had work land — so a session can tell at a glance whether the previous one ended before it could
   write its docs.

**If a row's count disagrees with that folder's own `FEEDBACK.md`, the folder wins and the previous
session was cut short.** Re-count, fix the row, and check that file for a half-finished item before
starting anything new.

Round 09 was the last numbered round; it was split into the files below in session 41 and archived
whole at `Archive/FEEDBACK-09.md`. **Quotes moved byte for byte — nothing was rewritten.**

**The gate is `BASICS.md`, "The demo scope".** Ten goals in Noodle's words. An item that serves none of
them does not block the demo, however loud it is.

---

## The top priority (session 39)

> High priority, most important demo goal is better performance. Why are players saying the game runs
> poorly? Are they experiencing different things than on my machine?

**`performance/`**, and it is a question no session can answer from this machine — which is the point
of it. Three items in other folders are its instruments and should be read as serving it:

- **`performance/` A8 telemetry** stops being a nice-to-have. The question is literally "what are
  players experiencing that I am not", and telemetry is the only thing that answers it at scale. This
  is the strongest argument yet for picking an endpoint.
- **`mobile/` A12** is the one device test Noodle can run himself, and his answer says the reason it
  has not happened is that testing on a phone is painful, not that he forgot. **`ui/` B29** (the debug
  win button) is the same blocker wearing different clothes.
- **`performance/` B14** is the lever list — what to fix *once* the cause is known. Levers 3, 4 and 8
  (whole-screen `innerHTML` repaints every beat, forced synchronous reflows, many small DOM writes per
  beat) degrade worst on weak hardware, so they are the standing suspects.

---

## The demo gate (settled session 38, amended session 39)

Noodle named the beta demo's ten goals; they are quoted in full in `BASICS.md`, "The demo scope",
which is the authority. **That list is the gate and the workstream files are the queue** — an item
that serves none of these goals does not block the demo, however loud it is.

Session 39 amended the gate three ways: **performance is now the top goal**, **lust events are added**,
and **telemetry is promoted** from "can wait however long it likes" to a candidate goal.

| Demo goal | His state | Folder | Where it stands |
|---|---|---|---|
| **Performance** | **top priority (s39)** | `performance/` | **B16** the diagnostic question. A8 is its instrument, `mobile/` A12 its device test, B14 its lever list |
| Sprite pass | ongoing | `art_pipeline/` | B2 — 3 enemies still `artOwed` (the recolours; B40 closed 2026-09-22). **Scope cut hard by B21** |
| Card pool rework | ongoing | `rework/cards/` | B18 Clemence, B5 cross-party hooks, A9 (paused by him), **B26 the neutral pool missed the overhaul**. Unlock routes moved to `rework/starters/` B1 |
| Card frame redesign | **rules settled s39** | `card_redesign/` | A2 and A3 both answered (**A3 reverses C1** — C1 acted on a misread instruction), plus B27 the small-size ribbon |
| Enemy rework | needs testing | `rework/enemies/` | Content landed s34 and measures inside budget (`tools/enemy-template.js`). **The testing he means is play, not the suite** |
| **Enemy overhaul** | **E7 done (s45) — both new routes ON** | `enemy_overhaul/` | **E7 closed session 45**: Act1-B (The Thorn Arbor) and Act1-C (The Pollen Road) built — twelve enemies, 24 encounters, four elites, and the boss-decides-the-route mechanism. The Tallyman moved up to Act1-1 and was re-budgeted; the Glowcap became a mushroom. Open: **E7-DEFERRED** the Mold Leech and the intruder elite, both held back from release on purpose; **E11** the two new routes borrow the Kobold Scavenger for their elite nodes; **E9** every new name awaits Noodle's veto (13 more than before); **E5/E8** both `map/`'s to fix |
| Progression rework | finished? | `rework/progression/` | **Yes** — 256/256 nodes wired, `tools/audit-trees.js` green. B4 remains, B23 reprices the deck-customization nodes |
| Anastasia | ongoing, out of debt | `chessmaster/` | **All three A4 decisions answered** (s39 + s42). Session 42 settled the rebuild: **A1 flips alignment**, pawns come from cards, **Promote is the ladder**, the King is anchored behind the party. **The party spacing blocker is FIXED and measured live** (A12, s43) — five allies render at 215px against three at 193px before. Open work is A11, A13-A18, A20-A22 |
| VFX | ongoing | `vfx/` | B13 — **and `art_pipeline/` B21 leans on it**: tilt + redden in-engine, vfx does the rest |
| Looping music | **built s50 — waits on his ear** | `audio/` | B12 — three tracks cut to his listening notes, a gapless lap, and Syrup Town's music muted and handed back. `audio/MUSIC.md` is the account; `tools/music/music-audition.html` is where he listens |
| **Lust events** | **new goal (s39)** | `lust_events/` | **B17** — cut the tag count so 2–3 tags per character can be authored at all ranks; **B18** — every run should be able to raise a scene; **B19** — tone rules awaiting a bible home (**placed s42**); **B20** — tags are budgeted per act, Act 1 gets one or two; **B21** — a scene written tonight reaches testers who already passed that rank (**closed s47**, archived); **B22** — the event QUEUE replaces how a scene is chosen (**closed s48**, archived) |
| Act 1-1 and Act 1-2 | **live — confirmed in play s39** | `map/` | **B31 — Act1-2 is three sub-acts (A live, B and C empty) and region 1 is still named for water.** **B15 — the session-38 reading was wrong.** Both acts run; they are just not named as acts in the code. Missing: branching, tooltips, the title |
| Mobile portrait | closer than expected | `mobile/` | A12 — blocked in practice by how hard the game is to test on a phone (see also `ui/` B29) |
| Telemetry | **"might be a demo goal"** | `performance/` | A8 — **neocities works, and no third-party servers are involved.** Still needs an endpoint picked |

Only the **Battle Lab** (`ui/` A10) is still demoted, and session 39 turned it from "wants your pass"
into a bug list.

**Not on the gate, but real work:** `rework/starters/` carries the relic rework and the outfit unlock
routes. Nothing gates the alt outfits today, so the card pool the gate calls "ongoing" drops whole from
run one — which makes B1 the quiet blocker under the card pool goal.

---

## The index

Counts are OPEN items. All rows reconciled **session 41**.

| Workstream | Holds | Open | Last work landed |
|---|---|---|---|
| **`rework/cards/`** | What a card costs, does and is worth. Rarity balance, the removal/add economy, curses. | **20** | s57 |
| **`rework/starters/`** | Starting decks, outfit unlock routes, **relics and heirlooms**, roster order. | **10** | s25 |
| **`rework/progression/`** | The six trees: node effects, EXP pricing, what a node hands out. | **4** | s30 |
| **`rework/enemies/`** | Enemy numbers, identities, roles, encounter composition. | **6** | s51 |
| **`art_pipeline/`** | The sprite pass: art owed, prompts, and how much art there needs to be. | **11** | 2026-09-22 |
| **`card_redesign/`** | The card face: frames, chrome, rarity marks, ribbons. No gameplay. | **3** | s39 (rules only) |
| **`chessmaster/`** | Anastasia, her kit, her gauntlet, her art. She stays invisible until a profile earns her. | **11** | s57 |
| **`performance/`** | **Top demo goal.** Why it runs poorly for players, and the telemetry to find out. | **4** | s36 |
| **`ui/`** | The hand, the debug menu, the Battle Lab, text that cannot be read. | **16** | s58 |
| **`map/`** | Map generation, act structure, node content. Both acts are live. | **13** | s58b |
| **`audio/`** | Sound effects and music. | **2** | s57 |
| **`lust_events/`** | **Demo goal.** The authored narrative — cut the tags, then write every rank. | **4** | s48 |
| **`enemy_overhaul/`** | The roster's fiction: identity, naming, act placement, Lust expression. | **6** | s51 |
| **`mobile/`** | Mobile portrait, and being able to test on a phone at all. | **2** | s43 |
| **`gallery/`** | The Event Gallery: replaying scenes, one page per character. Lust Events today, other event kinds later. | **6** | s49 |
| **`balance_tests/`** | The two balance tests, Basic Bite and All the Crunch. Built session 53, checked session 54; the matrix needs a re-run on corrected profiles. | **6** | s54 |
| **`vfx/`** | Card and combat visual effects. **B21 made hit feedback depend on this.** | **1** | never started |
| **`desk/`** | The phone desk: Noodle's page for editing events, notes, drafts and image requests from his phone. Second round planned in eleven phases in its `FEEDBACK.md`. | **41** | 2026-09-23 (plan only) |
| **`quality_lab/`** | The Quality Lab: a bench for tuning how an attack looks and sounds, and the timing data it exports. Designed from Noodle's pitch; the open items are the decisions it waits on. | **8** | 2026-09-24 (design only) |
| — | Cross-cutting, below | 1 | s41 |

**97 items open across 17 workstreams** (session 54 added `balance_tests/` T6), plus one that belongs to no single folder and two still
unfiled in the inbox below. Counts are `tools/feedback-audit.js`'s, re-measured session 51 — the
previous total was stale, and disagreed with the sum of its own rows.

Three of these are wired together and should not be tuned one at a time: **`map/` B28** (fewer chests),
**`rework/starters/` B22** (no starting relics) and **`rework/cards/` B24** (more curses) all pull on
how much a player has by the boss.

---

## Cross-cutting

### B20. Protected names: project-wide renames ☑ — VERIFIED session 41

> BASICS.md needs a section for protected data from project-wide renames. Specifically, Nettle was
> formerly named Moss, Severine was formerly named Vex, Cassadora was formerly named Wick, and
> Cassadora's former codename was `skull`.

**`BASICS.md` carries it** as "Character name glossary — who Noodle means". Noodle's framing in
session 41: the renames are already done, so what the section is actually FOR is understanding him —
*"I just need at least one document to have the old names in them so if I say 'Fix moss's hair' you
know who I mean."* It is a dictionary, not a warning.

The **VERIFY** half — what `skull` still refers to — was measured in session 41, and the answer
inverts the item's own guess:

| Name | Hits in `scripts/misc/honeycomb*` | What they are |
|---|---|---|
| `moss` | **0** | Dead. Nothing carries it. |
| `wick` | **0** | Dead. Nothing carries it. |
| `vex` | **4** | **Load-bearing.** `honeycomb-state.js` 2037–2038 is the save migration that rewrites `vex` → `severine` in old saves, plus a format-version comment. Deleting it strands every pre-rename save. |
| `skull` | **32** | **Load-bearing, and not Cassadora at all.** Every hit is the literal skull picture — `icons/skull`, `icons/skull-horned`, `icons/book-skull-purple`, `glyph: "skull"` — used for death, Broken and downed. |

**`skull` is the most dangerous of the four, but for the opposite reason to the one predicted.** It is
not a stale codename waiting to be finished; the word was reused for an unrelated icon. A
find-and-replace of `skull` → `cassadora` would break 32 icon references and the broken and downed
cut-ins, and none of it would look like a rename bug.

`BASICS.md` carries both the glossary and this result. Nothing further is owed.

---

## Inbox — unsorted, file these into a workstream

*(add new reports below this line. The next session reads them, decides which workstream owns each,
moves the report there verbatim, and bumps that row's count in the index above.)*

**The inbox is empty.** The batches below are routing tables for reports that have already been
filed; they are kept because they say which workstream to open for each one.

### The session 61 reports (2026-09-23), closed

> In the honey save - nettle scenes, I see that Clement has a vulnerability to human, woman, and support?
> In that same scene it says 196 exp to drop to the rank floor, I clicked it, paid the price, but seemingly nothing happened?

| Report | State |
|---|---|
| Clemence had weaknesses called human, woman and support | ☑ A Lust hit with no weakness tag fell back to its source's tags, and a character's tags are her traits. Only the six `lustTag` tags are recorded or read now, and loading a save drops the rest. |
| 196 EXP reset did nothing | ☑ It did lower penance, from 105 to 40, but 40 is where the top rank starts, so nothing changed. Exposure now stops at the top rank's threshold, old saves are capped on load, and a top-rank weakness costs nothing to reset. Under Fortitude no weakness shows and the reset never charges. Suite block [146]. |
| Grudge's Revenge did not answer the Pawn's Gnash | ☑ It did whenever the Rook lost health. It stayed silent when Temporary HP soaked the hit, which is every Gnash in The Black Reply, where enemies start with 14 Temporary HP. A new `onStruck` moment fires once per hit that lands at all, and Revenge listens to that. Suite block [147]. |
| The Queen's Petition shuffled nothing into the deck | ☑ It wrote the Invocation to the run deck only, so it appeared from the next fight. `addCardToDeck` takes `intoDrawPile: true` now, and both Petitions use it. |
| Petition only once per battle | ☑ New move field `oncePerCombat`; the in-order move list steps over a spent move. Both Queens' Petitions carry it. |
| Conversion triggered immediately | ☑ The engine was on time; the REPLAY drew every piece in its end-of-turn shape, so any earlier repaint showed the flip. The combat screen now draws a piece in its earlier shape until its own promotion beat (`shownShapeMap`). Measured in the browser: the Pawn flips at the promotion beat, after the Queen's card. Suite block [148]. |

### The session 60 batch (2026-09-23), recorded verbatim, all closed

Noodle, the same day, after session 59: "Rabbit hole avoidance failed though, and I found a bunch more
things I need help with. Oh well, better I find them than a thousand players, right? I'll keep working on
the inpaint, there's a lot so please record these and take care of these as best you're able:"

> * I re-targetted the sound files myself, noticed that many sounds were distracting, wanted to replace them with syrup town sounds. Did I do it wrong?
> * Please let me restate I need fortitude to be that the player is "missing out on lust events". Not stopping at rank one. If the player equips fortitude I (eventually) want them to see nary a single breast. No lust weakness building.
> * Also, I realize a huge flaw with placing fortitude as the second node unlockable, it's still too late. It needs to be unlockable for free right away alongside vigour so the player can eventually have a sfw experience. I may someday just straight up replace it with a sfw mode, but that's extremely distant.
> * Changing clothes sound has startup delay, altering leadInMsMap for it has no discernable effect from 380 to 1600, am I using the wrong tuning tool?
> * I am okay with the event raising nettle to the "next" cap. Meaning if already at max rank 1 without watching the event, it can bypass the limit and raise to rank 2. Otherwise the event has no actual downside. Basically, I would like the rank growth to behave like it were told "Move to the next highest rank from your current position, ignoring other blocks."
> * Why does it require a hard (shift) refresh to see changes on neocities? Can we get around that?
> * I've tried a number of solutions to no avail, and I worry some of those 'did nothing' solutions could add to system bloat or secretly reduce performance. Are index.html lines 6-8 actually doing good, and if not, are they a risk of dragging down the system?
> * I am really not a fan of including all those .js honeycomb scripts in the .html, I don't want to risk forgetting to update the html again, and I don't distribute mobile.html. This means I'll need to give the new mobile.html to mopoga when they ask, since they built their system around it. So I'd like to move to a solution where we don't need to change the index.html at all (within reason, there are still reasons to update it, I just don't want work outside of directly changing the .html to warrant a need for a .html update).
> * If we have no character bios in the story bible, where have you been keeping all the character details and personality so far?
> * I need to remove the _source, mockups, and screenshots folders from v13 spire images. Is anything load-bearing? Their new destination will be !designDocs\honeycomb\!imageStorage, for reference.
> * There are a number of _standins you used in another session to create event images for the events missing ones. I think it would be good if our png->webp pipeline ignored folders that started with _
> * (This is blocked by the above two steps) I need imagepack-import.js updated to handle our png->webp pipeline, and export Honeycomb images the v13 imagepack webp folder on the D: drive, just like it does for syrup town images.

| # | Item | State |
|---|---|---|
| S60-1 | Sound re-targeting | ☑ `audio/` S60-1: right idea, wrong table; fixed, plus a by-ear trim table |
| S60-2 | Fortitude means no Lust at all | ☑ `rework/progression/` S60-2 |
| S60-3 | Fortitude free from the start, beside Vigour | ☑ `rework/progression/` S60-3 |
| S60-4 | Outfit-change sound lead-in | ☑ `audio/` S60-4: new `startAtMsMap` |
| S60-5 | Weeping Bloom ignores the run ceiling | ☑ `map/` S60-5 |
| S60-6 | Hard refresh on neocities | ☑ `performance/` S60-6: the loader's hourly ?v= |
| S60-7 | index.html lines 6-8 | ☑ answered: they do nothing and cost nothing |
| S60-8 | Honeycomb scripts out of the html | ☑ `performance/` S60-8: `honeycomb-loader.js` |
| S60-9 | Where character details live | ☑ answered in chat |
| S60-10 | Move _source, mockups, screenshots to !imageStorage | ☑ `art_pipeline/` S60-10: moved, 18 tools repointed |
| S60-11 | png-to-webp skips folders starting with _ | ☑ `art_pipeline/` S60-11 |
| S60-12 | imagepack-import.js exports Honeycomb images | ☑ `art_pipeline/` S60-12: steps 10 and 11; Noodle runs `--apply` |

### The session 59 batch (2026-09-23), all closed

Noodle's agenda for the day. Each item is written up, quote first, in the `_archive/FEEDBACK-DONE.md` of
the folder named. No open counts changed, because each was filed and closed in the same session.

| Report | Filed as | State |
|---|---|---|
| A player on the PTR had no Nettle scene and a dead gallery | CATCH-UP 58d | ☑ the PTR's `index.html` was stale; `tools/ptr-check.js` |
| Alt outfits show 1-basic where the default shows 2-basic | `rework/starters/` **S59-1** | ☑ alt outfits are recoloured copies of every default picture |
| Outfit descriptions are a wall of centred text | `rework/starters/` **S59-2** | ☑ bulleted and left-aligned |
| Fortitude should cost 0 and say Lust Events are missed | `rework/progression/` **S59-1** | ☑ free on all seven trees |
| A Nettle-only map event that raises her venom a rank | `map/` **S59-1** | ☑ The Weeping Bloom |
| Map event and rest site pictures: any placeholders left? | `map/` **S59-2** | ☑ none, all 16 checked |
| Record that her familiar is Jonesy Bones | `designBibles/story.md` §10 | ☑ new Cast details section |
| Inpaint Jonesy Bones into her first venom picture | Noodle, by hand | not Claude's |

### The session 57 batch (2026-09-22), all closed

Noodle's last bug list before the proof of concept. Every item was fixed, checked in the browser and given a
suite check (blocks [135] to [137]); each is written up, quote first, in the `_archive/FEEDBACK-DONE.md` of the
folder named. No open counts changed, since each was filed and closed in the same session.

| Report | Filed as | State |
|---|---|---|
| A player walked all three routes and never saw the Grandmaster's Invitation | `chessmaster/` **S57-1** | ☑ the switch was off, and their shop was stocked before it went on |
| The gauntlet's pieces, and Anastasia, faced away from the party | `chessmaster/` **S57-2** | ☑ `drawnForSide: "ally"` |
| The debug tools named her | `chessmaster/` **S57-3** | ☑ `tuning.debug.showsSecrets` |
| A background for the chess area | `chessmaster/` **S57-4** | ☑ `backgrounds/chess` |
| Heavy Swing skipped its bonus hit at 16 Temporary HP | `rework/cards/` **S57-1** | ☑ Thorns took it under 10 mid-card |
| Whetted Edge's upgrade stayed between fights | `rework/cards/` **S57-2** | ☑ and so did every fight-long discount |
| The enemy's intent card covered its first debuff | `ui/` **S57-1** | ☑ the card now sits under the plate |
| The campfire should lower Lust as much as health | `map/` **S57-1** | ☑ Sleep and Treatment |
| The footsteps played between nodes | `audio/` **S57-1** | ☑ they play on Descend |

### The playtest batch of 2026-09-21, and where all 29 reports went

**`playtest_55/READ-ME.md` is the short version, written for Noodle to read first.** It names the six
things that need a sentence from him and explains the fixes that mattered. This table is the routing.

Noodle left these after two playtest sessions. **Every quote moved verbatim into the workstream named
below and was worked on there. Read the workstream file, not this table** — this only says which one to
open. The numbering is `P1` to `P29`, per workstream.

**Nineteen are done and hold a suite check. Six need a decision from him. Four are measured and waiting
on his numbers.** Suite after the batch: 2543 passed, 0 failed.

| Report | Filed as | State |
|---|---|---|
| Whetstone relic does nothing | `rework/starters/` **P1** | ☑ a preview was spending its charge |
| Cracked Ampoule with no poison character | `rework/starters/` **P2** | ☑ the chest ignored every offer gate |
| Mulligan stone with 0 max rerolls | `rework/starters/` **P3** | ☑ gated on the reroll pool existing |
| Starting common relics not on the artifact list | `rework/starters/` **P4** | ☑ the reading needs checking |
| Ransom took my tHP and gave nothing | `rework/cards/` **P5** | ☑ it now takes only what it pays for |
| Sundered and Weak print a raw token | `rework/cards/` **P6** | ☑ six statuses were doing it |
| Sundered should reduce by 1 each turn | `rework/cards/` **P7** | ☑ and it contradicts P6's quote |
| Winning The Sealed Door traps you in a loop | `map/` **P8** | ☑ reproduced and fixed |
| Mushroom Frontier still called The Flooded Vault | `map/` **P9** | ☑ renamed |
| Paths almost never go up | `map/` **P10** | ☑ the fan only ever opened one way |
| Chests too common, four should be impossible | `map/` **P11** | ☑ capped at three a region |
| Every map should start on a rest node | `map/` **P12** | ☑ |
| A relic from an ordinary Thorn Arbor win | `map/` **P13** | ☑ ordinary fights pay none now |
| The very early game is too hard (three reports) | `rework/enemies/` **P14** | ◐ an opening tier is built; the rest is open |
| Hollow Champion too far right, Head Gardener too tall | `rework/enemies/` **P15** | ⏸ measured, sizes are his |
| Triple personal EXP, no golems | `rework/progression/` **P16** | ☑ golems were taking shares |
| A rank of Vigor on Brienne should cost 4 | `rework/progression/` **P17** | ☑ |
| Shop needs to show party HP and lust | `ui/` **P18** | ☑ |
| Trip Line card text too long | `ui/` **P19** | ☑ eleven moves were doing it |
| Anastasia needs an Earthling tag | `chessmaster/` **P20** | ☑ |
| Clemence's desc should mention she wants to be broken | `rework/cards/` **P21** | ☑ |
| Clemence heals too much | `rework/cards/` **P22** | ⏸ measured, needs his numbers |
| Suffer the Blows, and changing taunt | `rework/cards/` **P23** | ⏸ his note reads two ways |
| Frail is underpowered | `rework/cards/` **P24** | ⏸ needs his direction |
| A document of potential relic rewards | `rework/starters/` **P25** | ☑ `RELIC-REWARDS.md` |
| Copycat Quill and Ember Spurr need replacing | `rework/starters/` **P26** | ⏸ he has to say what with |
| Enemies turn around while attacking | `art_pipeline/` **P27** | ☆ traced to the drawings |
| Three boss nodes at the end | `map/` **P28** | ☑ |
| Boss nodes name their boss if met before | `map/` **P29** | ☑ |

**The six that need a sentence from him, in the order they block the most work:**

1. **`rework/cards/` P23 — what Taunt should become.** Suffer the Blows cannot be built until this is
   settled, and his note reads two ways. Seven cards across four characters depend on the answer.
2. **`rework/cards/` P22 — how much of Clemence to cut.** Three complaints, and the structural one is
   that nine of her broken cards let her pour out the Lust that put her in that form.
3. **`rework/starters/` P26 — what replaces Copycat Quill and Spur of Embers.**
4. **`rework/cards/` P24 — what Frail should do instead.**
5. **`rework/enemies/` P15 — how big the Head Gardener should be.** She is 453 pixels off the top of
   his screen and is the only enemy in the game above scale 1.3.
6. **`rework/enemies/` P14's second half — whether act 1 fights should last longer.** He said passives
   and poison cannot pay off in three turns. Raising the turn target restats the whole act, so it wants
   a Crunch run behind it rather than an overnight edit.

**One thing he should know that he did not report.** `tools/generate-progression-trees.js` is stale and
running it reverts hand-edited content. Session 55 ran it once and silently lost four pieces of content,
including Brienne's Counterguard node. All four were restored and all four now have checks. The tool
carries a banner and `tools/README.md` says not to run it.

---

### The desk batch of 2026-09-21, filed in session 51

Eight reports, of which **six were filed into their workstreams in session 51** and investigated there.
The two that need Noodle's answer are below the table.

### Where the eight reports went

Each quote moved verbatim into the file named below, with the measurements under it. **Read the
workstream file, not this table** — this only says which one to open.

| | Report | Filed as | Headline |
|---|---|---|---|
| IN-1 | Five previewed enemy designs were cut | `enemy_overhaul/FEEDBACK.md` **E13** | **None was cut.** All five are on disk, assigned, and deferred by four separate decisions. Three of them are one job: the Act1-B and Act1-C elite pools. |
| IN-2 | Missed enemies, and no recolours | `art_pipeline/FEEDBACK.md` **B38** | Eleven enemies still stand on generated stand-ins. **Three are literal recolours of another enemy, and the Scrap Salvager is one of them** — the bench was right. |
| IN-3 | Argent Fencer held back for a pair fight | `rework/enemies/FEEDBACK.md` **B36** | **She was not held back.** She is in six encounters and none is a two-enemy elite. |
| IN-4 | Soakcap's sprite is gigantic | `rework/enemies/FEEDBACK.md` **B37** | `presentation.scale` 1.45, the joint-highest of any ordinary enemy, on a wider-than-shared canvas. |
| IN-5 | The Pale Dray does not fit on the screen | `rework/enemies/FEEDBACK.md` **B37** | Measured: 108px off the top at 1878x804. **The Head Gardener is 453px off and had not been reported.** |
| IN-6 | Cannot reach the three routes; only one boss | `map/FEEDBACK.md` **B41** | The Act1-1 boss decides the route. There are six Act 1 bosses. **The boss node's tooltip never says either, which is the actual bug.** |
| IN-7 | Event window styling took shortcuts | **still here, below** | He did not say which shortcuts. |
| IN-8 | Nonsense text is still in the game | **still here, below** | Needs him to point at it, and needs the scene skill. |

Two further reports came off the phone desk the same night and were filed with them:

| From the desk | Filed as | Headline |
|---|---|---|
| The Campfire's image is broken on his phone | `map/FEEDBACK.md` **B42** | **Not the random select.** The file does not exist, and neither does the folder it is in. `theSealedDoor` is broken the same way and was not reported. |
| — | `art_pipeline/FEEDBACK.md` **B39**, **B40** | Found while measuring: re-running the placeholder generator would overwrite real art in 26 folders, and `artOwed` is stale on 23 enemies. |

### Two questions answered from the desk, needing nothing further

- **`lustEventCleared` — "What is this?"** It is the end card he asked for himself. A Lust Battle comes
  back to it when the event names no page for that outcome, won or lost. The code quotes him:
  *"The default case for both should be an event just saying 'Lust Event Cleared!' which returns you to
  the teambuilding menu with the rank-up cleared."* It is `tuning.lustEvents.defaultVictoryEvent` and
  `defaultDefeatEvent`, both pointing at it.
- **"What is the difference between `body` and `t` lines?"** `body` is the event's own paragraph — the
  prose block at the top of the event window, and there is one per beat. It writes the `text:` field.
  `t` is a narration line in the run of dialogue underneath, with no speaker, and there can be as many
  as wanted. `t ...` on its own puts in a divider. A line starting with a name instead of `t` is that
  character speaking.
- **"replace this event with dynamicShortPool"** — there is nothing called `dynamicShortPool` anywhere
  in the repo. This one needs him to say what it should be.

### The two that are still waiting on him

**IN-7. Event window styling took shortcuts.** Likely owner: `ui/` or `lust_events/`.

> a number of shortcuts were taken with the event window styling

He did not say which shortcuts. Ask before changing anything, and show him a previewer first.

**IN-8. Nonsense text is still in the game.** Likely owner: whichever workstream owns each piece of text.

> a mountain of absolutely nonsensical text is still left in the game.

He plans to have the events agent replace placeholder events and write character descriptions. Any
text written for this must follow `.claude/CLAUDE.md` rules 1 and 2. Never invent text for a slot he
left empty.

**Done the same night, for reference:** the enemy sprite rule is now enforced by the engine. See
`reference/ART-GUIDE.md` §2 and suite block [126].
