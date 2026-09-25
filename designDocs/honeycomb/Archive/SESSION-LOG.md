# Honeycomb Catacombs — SESSION LOG (archived)

**ARCHIVED. Nothing routinely reads this file.** It is the per-session history that `CATCH-UP.md`
carried until session 41, when the catch-up became a directory instead of a log.

Read it only to answer a question of the form *"why is it like this"* or *"when did that change"* —
a decision whose reasoning is not written down anywhere current. For what the project IS, read
`../BASICS.md`; for where the work is, read `../CATCH-UP.md` and the workstream's own catch-up.

Entries are newest first, sessions 7 through 40, then the rows for sessions 36 to 63 moved here whole
on 2026-09-25 (the catch-up's one-line rule had not been kept, and its table had grown to 40 KB). From
session 64 on, a session appends ONE LINE to `../CATCH-UP.md`'s "Recent sessions" table and writes the
detail into its workstream's catch-up; a session whose detail belongs nowhere else appends a dated
entry to the top of this file.

---

## Status as of 2026-09-25 (session 64, cloud: housekeeping)

Noodle asked for a clean slate before the second demo's work starts, and set the second demo's gate in
three lists (`../BASICS.md`, "The demo scope — the second demo"). What landed, and what it means:

- **The feedback sweep.** 39 closed items were still sitting in live `FEEDBACK.md` files (nine in `map/`
  alone), so the index said 166 open where the folders held 136. Each moved byte for byte into its
  folder's `_archive/FEEDBACK-DONE.md`. Where a later session had answered a ⏸ item without closing it
  (P22, P23, P24 in cards; P26 in starters; P15 in enemies; B15, B28 in map; B17, B19, B20 in
  lust_events; Q7 in quality_lab), a one-line closing annotation names the session that did.
- **The root documents.** `CATCH-UP.md`'s session table had grown to 40 KB of paragraphs against its own
  one-line rule; the rows for sessions 36 to 63 are in this file, below. Root `FEEDBACK.md` carried six
  routing tables of closed batches and two stale gate sections; they are `INBOX-ROUTED-2026-09.md`.
  `BASICS.md`'s first-demo scope is `DEMO-1-SCOPE.md`; the second demo's gate replaced it, with the
  dependency order and six questions for him.
- **New folders.** `map_events/` (its proposal had sat without a catch-up since session 50; the two
  content-table backups moved into its `_archive/`) and `test_suite/` (the overhaul he named a blocker,
  measured: 17,282 lines, about 148 blocks organised by session, about 265 content-pinned lookups, and a
  crash instead of a skip when `honeycomb sound/` is absent, so a cloud copy runs 1,256 of 2,805 checks).
- **Moves.** `playtest_55/` to `Archive/playtest_55/`; `tools/_dup.js` to `tools/card-duplicates.js`;
  `tools/__pycache__` untracked and ignored.
- **Filed from his message.** Every line of the needs list landed in a workstream in his words: S64-n
  items in `map/`, `ui/`, `mobile/`, `rework/enemies/`, `map_events/`, `test_suite/`, and annotations on
  `art_pipeline/` B26 and B3, `audio/` B9–B11 and B12, `vfx/` B13, `lust_events/` B23, `rework/cards/`
  B34, `balance_tests/` T1 and the desk's plan.
- **Not fixable from the cloud copy:** `chessmaster/` is not uploaded, so `feedback-audit.js` reports it
  and nothing there can be checked; `doc-links.js` needs the `!designDocs` name (run through a temporary
  symlink); the suite cannot run whole. No game code changed.

- **Second half of the day: the tree rebuilt from Noodle's pipelines.** He asked to move forward from the
  old documentation folder, bringing forward only what is relevant, with archiving reduced to one motion.
  Twenty workstream folders became eight pipeline folders (`card_pool`, `enemies`, `art_pipeline`,
  `events`, `mobile`, `relics`, `engine`, `tooling`), each with one document named after it (status, rules,
  queue) and an `ARCHIVE.md` beside it; `desk/` stayed because its server reads `desk/data/`. Every open
  item moved in his words with its paths rewritten (136 before and after); E5, E8 and B43 closed on the
  way; his replies on the gate were filed (three enemy sessions, separate event sessions, VFX creation as
  Stable Diffusion work, the writing groundwork as a fifth blocker, portrait's camera pan, all eleven desk
  phases). Everything else moved to `demo1/` at its old path, this file excepted. `feedback-audit.js`
  reads the new layout; `tools/README.md` took the browser-tooling section out of BASICS.
---


## Sessions 36 to 63 — the rows moved out of CATCH-UP.md on 2026-09-25

Each row is the entry that session wrote in the root catch-up, unchanged. Detail behind any of them is
in the workstream folder the row names.

| # | Date | What landed |
|---|---|---|
| 63 (cloud) | 2026-09-25 | **The card pool reviewed for the manual pass, design only (`rework/cards/POOL-REVIEW-02.md`; Noodle's request is `rework/cards/FEEDBACK.md` B34).** Measured on the live content: a demo run pays about 16 card rewards and deals one slot per party member, so each character sees about 16 offers a run; at 21 C / 11 R that is a common every other run and a rare almost as often as a common, which is the flat gradient behind "nothing is memorable". Half of Brienne's and a third of Nettle's cards share a verb-shape and differ by number. The shared-currency table (tHP, enemy debuffs, enemy Lust, ally health lost, healing, position, Broken allies, exhaust) shows three currencies with one reader, which is the glue gap; two-thirds of every reward screen is off-plan by construction. Proposed and agreed the same day: 12 C + 8 R per character with the selfish cards behind the outfits, 85 / 15 weights, a 15-card starting deck with a default signature, one reward slot per member. A Burn status for Cinder was proposed and withdrawn on his read; **Cinder's status is Heat, in his own words** (1 Lust per stack whenever the holder plays a card; cooled only by moving toward the back or ending the turn last — the price of recklessness, a producer for the ally-Lust row the Abbess line and Nettle's Draw Out already read, and the reason to hold a hot Clemence at the back), Clemence stays solely in Lust, and Poison is to halve. **`rework/cards/CARD-POOL-02.md` is the brief: the agreed rules, Heat with nine edge-case defaults, and Cinder's full 12 C / 8 R list drafted for his veto.** Two cast details recorded in `designBibles/story.md` §10. **Late the same day he cut the lust tags to four (Venom, Charm, Heat as its own tag, Penance) and withdrew enemy-inflicted Heat**; then **signed off the tag set for the second demo — Venom, Exposure (the fey, replacing Charm), Heat, Penance — and five MUSTs** (Poison halves; act-1 enemies use only legal options; the fey use Exposure; old Charm replaced and scrubbed), filed verbatim as `enemy_overhaul/` E14 and `lust_events/` B23, with what each tag represents in `designBibles/story.md` §11. **His Brienne masochism idea is proposed as Bastion's second half** (`rework/cards/CARD-POOL-02.md` §3.3: the sponge passive, Willing Target, Living Stress-Relief, Wake-Up Kiss, Punching Bag Session, all tagged Torment) and waits on his yes. He then signed off Severine losing every soothe, Absolution losing its soothe, Restraint cut outright, and **the Abbess line applying Heat to allies instead of Lust**, which sets the demo's writing scope (Venom, Exposure, Heat for everyone; Torment for Brienne; Penance for Clemence). **All six lists are drafted** (`CARD-POOL-02.md` §3.1–3.6: Cinder, Clemence, Brienne, Nettle on halving, Severine, Cassadora), Severine revised on his read to carry no damage amplifier of her own (Marked deleted), the neutral tier drafted as twelve colourless-style cards on his precedent (§3.7, two of them his own: Possibility, a discover card, and Devil's Number, an exact-damage draw engine, each piloting a mechanic a future character may own), and Anastasia is outside the pass in his words. **The brief is complete as a draft; his vetoes are held.** The Friday housekeeping table is `CARD-POOL-02.md` §5. First engine job either way is `rework/starters/` B1. No game code changed; the suite was not run (docs only). |
| 62 (cloud) | 2026-09-24 | **The Quality Lab designed, not built (`quality_lab/`, new).** Noodle's pitch for a game-feel tuning bench is preserved verbatim and annotated in `quality_lab/BRIEF.md`, with a read of how an attack is presented today: a party card fires its sound, poses, number, shake and vfx in one JavaScript task with leading silence uncompensated, an enemy move's sound leads its hit by 420 ms, every hit is its own 180 ms beat so a whole-side attack can only ever play as a wave, and 34 of 35 `sfx` card fields disagree with `cardSfxMap`. The design gives every action a named impact, schedules each target from it through one resolver that overrides also go through, stamps when each target fired and painted, and runs a fixed cycle that can be replayed from an engine snapshot. Eight decisions wait in `quality_lab/FEEDBACK.md`. Docs only; no game code changed; the cloud copy has no sound library, so the suite did not run. |
| desk 2 | 2026-09-23 | **The phone desk's second round: a plan of 41 items in eleven phases, and phases 1 to 4 built (`desk/FEEDBACK.md`).** The phone's back button works, search reads every word, event lists fold and filter, drafts get folders and tags, notes are sorted by whose turn it is, and every button shows what it does in the game's own words. In the game: a cleared button sentence falls back to the generated one, and the campfire's three unused buttons are gone (block [144]). Suite **2782 passed, 0 failed**. Goes live when Noodle's desk restarts; see `desk/CATCH-UP.md`. |
| 61 | 2026-09-23 | **Weakness ledger fixes (root `FEEDBACK.md`, the session 61 pair).** Only the six `lustTag` tags are weaknesses (`honeycomb.lust.isWeaknessTag`); exposure stops at the top rank's threshold (`topThreshold`); a save load drops trait entries and caps the rest (`save.reconcileWeaknessLedger`); Fortitude characters show no weaknesses and never pay for a reset. Revenge now answers hits soaked by Temporary HP, through a new `onStruck` entity hook (once per hit, lost + absorbed). Another session was working in parallel (campfire buttons, A quiet pool). Petition now reaches this fight's draw pile (`addCardToDeck` `intoDrawPile`) and a Queen petitions once a fight (`oncePerCombat` on a move); a replay draws each piece in the shape it had at that beat (`combatScene.shownShapeMap`), so Conversion no longer shows early. Suite 2805/0, blocks [146]-[148]. |
| 60b | 2026-09-23 | **Comment sweep of the shipped code (`scripts/` only).** Every quote of Noodle, session/round number, date and feedback ticket code was cut from Honeycomb's comments, per the new rule in BASICS and `.claude/CLAUDE.md` §4; a checker confirmed no code changed in 37 files. The loader now APPENDS scripts (async off) instead of document.write, one line per page. Tools and the suite still carry old-style comments, for later. Suite 2777/0. |
| 60 | 2026-09-23 | **Noodle's second list, all closed (root `FEEDBACK.md`, the session 60 batch).** **Honeycomb now loads through `scripts/misc/honeycomb/honeycomb-loader.js`**: both pages carry two generic lines, a new Honeycomb file is a line in the loader and never a page edit, and every request carries an hourly `?v=` so an upload is seen without a hard refresh (neocities sends no Cache-Control). Fortitude is free from the start and means no weakness and no Lust Events at all (`honeycomb.lust.hasFortitude`). The Weeping Bloom ignores the run ceiling. Sounds: Noodle's Syrup Town swap moved to the table that plays it, by-ear trims got `fileVolumeByEarMap`, and `startAtMsMap` skips the outfit sound's silence. `_source`, `mockups` and `screenshots` moved to `!imageStorage` with 18 tools repointed; png-to-webp no longer walks `_` folders; imagepack-import.js gained steps 10 and 11 (Honeycomb to `D:\v13 imagepack webp\v13 spire images`). New memory: ask before any background agent. Suite 2778/0, blocks [142] [143]. |
| 59 | 2026-09-23 | **Noodle's agenda, all closed (root `FEEDBACK.md`, the session 59 batch).** Alt outfits with no drawing of their own are now recoloured copies of every default picture, so they get 2-basic, combat, hurt and Broken art (`generate-placeholder-art.py` `build_outfit_copies`, plus `.copies.txt` so a recoloured drawing is not tinted as a stand-in). Outfit descriptions are bulleted and left-aligned. Fortitude is free on all seven trees and says Lust Events are missed (audit H9 accepts `free: true`). **The Weeping Bloom**, a Nettle-only map event: 2 rerolls and one whole venom rank, only offered when the rank is really available; new verbs `raiseWeaknessRank`, `weaknessCanRank` and an event-level `subject`. Found and fixed: the reopened event pool ignored `condition` and `appearsWhenBroken`. Map event and rest pictures: all 16 real. Nettle's familiar is **Jonesy Bones**, recorded in `designBibles/story.md` §10 (new Cast details section). Suite 2755/3, block [141]; the 3 are the sound edit above. |
| 58d | 2026-09-23 | **A player reported no Nettle scene and a dead gallery on the PTR.** The engine was fine. The PTR had current JavaScript but an old `index.html` that was missing ten Honeycomb script tags: the lust-event engine and table, the gallery, music, Broken cut-ins, the Battle Lab, font and sprite metrics, text tooltips and warnings. Noodle uploaded `index.html`. Verified on the live PTR with the player's save: 38 scripts load, the gallery lists Nettle at 0 of 5, teambuilding marks her Event Ready, and **Event Ready!** opens Specimen with its picture. New `tools/ptr-check.js` catches this after any upload. No game code changed. |
| 58c | 2026-09-23 | **Shorter save text and a .noodle file (`ui/` S58c-1, closed).** Copy / Load Save hands out the save compressed, 7,812 characters instead of 29,746 on Noodle's save, and loads back exactly; **Save to .noodle file** and **Load from .noodle file** work like Syrup Town's. Stored slots stay plain JSON. A packed save he sends is read with `tools/save-text.js unpack`. Suite 2737/0, block [140]. |
| 58c | 2026-09-24 | **Event art tidied (`map/` B42).** Every event picture moved into `events/` in both art trees: `events/<name>` for a map event, `events/<scene>/<art folder>` for a picture made once per girl (`events/campfire/{leader}`, `events/pool/{leader}`). `map/` keeps only map art, and the character folders keep only poses and sprites. The 180MB of spare versions left `v13 spire png` for `D:\honeycomb spare art\2026-09-23\`, because that folder is the live source the release imagepack is built from, not storage. The desk gained leader blocks and cast previews the same day (`desk/CATCH-UP.md`). **Then A quiet pool replaced The Quiet Spring** (Noodle's `smallDynamicPool` draft: leader lines, `events/pool/{leader}`, heal a tenth and halve Lust per member through `forEachTarget`; suite block [145], checked in the real window), and the old per-character `broken`/`recover` webps (copies of each outfit's own) and `events/spring` moved to `D:\honeycomb spare art6-09-24\`. **An accidental generator run flattened 26 real files; all restored from the `D:\syrup-town` snapshot (`art_pipeline/` B39).** Suite 2797/0. |
| 58b | 2026-09-23 | **Stand-in pictures for every event, the night before release (`map/` B42).** The campfire now shows whoever is at the front of the party, one picture per character (`events/campfire-{leader}`, resolved by `honeycomb.eventOverlay.artPathFor`), plus an empty-camp backdrop. The eight map events each show a stranger girl, never the cast, because the party is unknown (a first round with the cast was thrown out on Noodle's catch). Pictures were picked by eye and the event text was bent to fit them. Paths can also name `{second}`, `{third}` and later places, and the desk shows these pictures now. The Sealed Door's picture was missing entirely and now exists. 64 pictures were generated on ntrMIX at Oreteki18kin, four per slot. The spares are in the `_standins/` folders. The Quiet Spring, Hands In The Dark and the Well of Wax Light moved to new file names so they no longer share pictures, and so Noodle's own `map/event-well.png` is never overwritten. Suite 2725/0, block [139]. |
| 58 | 2026-09-23 | **A real Honeycomb play button on Syrup Town's title screen (`ui/` S58-1, waits on Noodle's eye).** Honeycomb's gold-framed plate, centred under the row in landscape; in portrait the column re-spaces into five rows. Off with one line, `var titleHoneycombButton = true;` in `scripts/gameplay/title.js`. Measured live on eight screens, suite block [138] checks sixteen. |
| 57 | 2026-09-22 | **Noodle's last bug list before the proof of concept; all nine items closed, routed in `FEEDBACK.md`'s inbox ("The session 57 batch").** **Anastasia is live:** `tuning.chessmaster.gauntlet.enabled` is ON (Noodle said so), a shop's saved stock now gains the invitation when it opens, so a player whose shelf was rolled with the switch off sees it (checked on their save, `honey save.txt`); her pieces and the boss wear `drawnForSide: "ally"` and face the party; the chess hall is the gallery's battle background; and the debug tools no longer name her unless `tuning.debug.showsSecrets` is true. **Bugs:** Heavy Swing lost its second hit to Thorns mid-card (new `checkedAtStart` condition option); Whetted Edge's upgrade AND every fight-long discount were written onto the deck and never cleared (`combat.fightOnlyCardFieldArray`, cleared at fight start and end); the intent card sits under its own nameplate; Sleep and Treatment remove as much Lust as they heal (`tuning.rest.lustPerHealth`); the footsteps play on Descend. Suite 2708/0, blocks [135] [136] [137]. **Not yet played by a human: winning the gauntlet boss.** **Late additions:** the three routes stand in front of Noodle's paintings (`backgrounds/frontier`, `arbor`, `road`, exported at half the PNG size), suite 2712/0. Open art gaps he chose to ship with: the campfire and Sealed Door pictures and the seven progression-tree backgrounds are missing files. |
| 56 | 2026-09-22 | **The art restructure worked (`art_pipeline/ART-RESTRUCTURE.md`), then Noodle's image list built (`reference/ART-GUIDE.md` §1).** The archive went from 15 originals to 121: the census reads the generator's own tables, the converter keeps the size the game uses, and the six Celestial pieces left the generator's lists. Codenames rule added to BASICS (in-game names never in new code). **The image list:** a third tier for Broken (`3-combat`/`damaged`/`offense`/`passive`), every tier falling to the one below, `2-basic` in teambuilding while a Lust Event is ready, Broken and Recover cut-ins per outfit with Broken chosen by health, exposed falling to `2-combat`; the generator now writes only the `1-` tilts for characters. Suite 2626/0, block [133]. **Then the art import:** 93 new drawings archived at their game paths and converted (every pose 1216 tall), 50 names taken off the generator's lists first so no run can delete them, `generate-placeholder-art.py --only poses` (new) rebuilt each costume's `1-` stand-ins from the new art and tilted the new Infernal pieces for their attacks, and 38 old unlisted copies that stood in front of the fallbacks were archived to `_source/_archive-character-poses/`. Archive 221 originals. Seen in the browser: `2-basic` on Lust Event ready, Broken Clemence on `3-combat` untinted, both cut-ins per outfit. `art_pipeline/` B8 closed. **Last round:** Clemence's Broken cut-in opens on `magicHolyChoir` and draws her 1.2x (`brokenStartSound`, `brokenScaleMultiplier`); the Broken tint is on generator stand-ins only (the size table now marks them); the gauntlet boss reads Anastasia's own folder (`artCharacter`, proposal D done); the recover crop shows a third of each upper-body picture with faded sides; performance B43 filed (the new art is lighter than the old; the cut-ins are the heavy files). Suite 2639/0, blocks [133] [134]. |
| 55d | 2026-09-22 | **Noodle's corrections to 55c.** Cinder's back-start is REMOVED after all -- he asked for it gone because "moving to the back naturally happens in an active party, it's almost completely dead", and 55c was wrong to preserve it. The `opening` encounter band widened from rows 0-2 to rows 0-5, since row 0 is the forced rest and five fights was his number. Clemence's Hair Shirt is **Blessed Endurance** (index unchanged, saves carry it). **`uncommon` is retired**: fourteen relics and one heirloom moved off it, five graduated to rare on Claude's pick (Bone Pendant, Gilded Gauntlet, Rat King's Bell, Leech Jar, Cracked Hourglass), and the tier is gone from `equipmentRarityArray` and `relicPriceArray`. Unshakeable's Lust ceiling was confirmed to follow Vigour: 60 base to 88 at full ranks. Suite 2604/0. |
| 55c | 2026-09-22 | **The three Act1-2 routes stopped borrowing (`enemy_overhaul/ROUTE-IDENTITY.md`, `playtest_55/READ-ME-3.md`).** Every ORDINARY fight on all three is now built from that route's own enemies -- Act1-A went from 2 pure fights of 16 to 12, B and C from 6 and 2 of 14 to 12 each. Elites still borrow, on Noodle's instruction that elite variety matters less. Line-ups came from a composer scored against `tools/enemy-template.js`'s own budget, not by eye. **Two findings: the Pollen Road has no small enemy, and the Mantlewing fits no native group.** Also corrected: the Ember Spur Noodle meant was Cinder's HEIRLOOM, not the relic, and replacing it would have removed her back-start; Unshakeable now caps Lust at maximum health rather than raising the threshold; Suffer the Blows gives the Taunt first; Breaking drops Taunt. Suite 2582/0. |
| 55b | 2026-09-22 | **Noodle answered every open question from the playtest batch and they were built (`playtest_55/READ-ME-2.md`).** Taunt needed no change and the suite now holds why. Brienne's first C.Ex node became Unshakeable (Lust measured against MAXIMUM health), Frail was rebuilt on Sundered's shape over healing and Temporary HP, Clemence's broken healing was cut to a 15% uplift, act 1's ordinary fight costs 8% instead of 10% and maps are denser, the Copycat Quill and Spur of Embers became the Dominion Rod and the Lucky Hat (both ungated, 6 banishes and 2 rerolls), and the Head Gardener's scale was DERIVED at 1.1 from the sprite-fit measurements. **Three boss nodes exposed a real bug: the route read the leftmost boss, not the one beaten.** Region 1 is the Mushroom Frontier for good. `enemy_overhaul/ROUTE-IDENTITY.md` answers how far the three routes are from their own enemies. Suite 2575/0. |
| 55 | 2026-09-21 | **Noodle's playtest batch of 29 reports, filed and worked (`FEEDBACK.md` inbox, items P1-P29). `playtest_55/READ-ME.md` is the short version for him.** 19 fixed with suite checks, 6 waiting on a sentence from him, 4 measured and waiting on his numbers. The fixes that mattered most: the Sealed Door's win loop, the Whetstone being spent by a card PREVIEW, the treasure chest ignoring every relic offer gate, Ransom taking Temporary HP it could not pay for, map paths that only ever branched one way, and an `opening` encounter tier so a run's first three rows are one- and two-enemy fights. Act1-1 now ends in three boss nodes and each names its boss once met. **A warning for the next session: `tools/generate-progression-trees.js` is stale and reverts hand edits. It cost four pieces of content here, and the suite caught only one of them.** Suite 2543/0. |
| 54 | 2026-09-21 | **The balance-test build checked (`balance_tests/`).** Suite 2486/0, both game-code changes read and sound, no game rule copied into the simulation, two runs traced by hand. **The first matrix is not a tree measurement**: career profiles also carry the Lust weakness ledger, whose ranks never fall, so "75% tree" was also "everyone at double Lust" and won less than 0%. The brief's mistake; Steps 6–7 corrected to save each level with and without the ledger. Underneath it a real finding for Noodle: a veteran profile plays harder than a fresh one and the tree does not make up for it. |
| 53 | 2026-09-21 | **Balance tests built (`balance_tests/`, `tools/balance/`), Noodle away.** `honeycomb.progression.selectedNodeArray` now remembers its answer, keyed on outfit and the selection list (suite [127]); the old audit went from 29 s to 7 s with an identical report. The payout of a won fight moved out of the victory screen into `honeycomb.combat.settleVictory` so a simulation pays what the screen pays (suite [128]). New tools: Basic Bite, All the Crunch and their shared `lib/`. Steps 1 to 3 finished; Steps 4 to 7 work end to end on small runs and are not yet run at full size. |
| 52 | 2026-09-21 | **Balance tests designed with Noodle (`balance_tests/`, new).** The draft sim never plays a fight, and the budget audit starts every fight from a fresh save, so neither can say how a run is lost. Profiled the audit: 27 fights in 29 seconds, 76% of it in `progression.selectedNodeArray` and its helpers on a profile that owns no nodes. Agreed: Basic Bite and All the Crunch both use the real engine and real cards, one skilful bot, card values learned from results with no synergy table, skip and removal learned the same way plus a thin-deck comparison bot, fights spread across CPU cores. **Nothing was built and no game code changed**; `balance_tests/BRIEF.md` is the handoff. New tool `tools/balance/profile-summary.js`. |
| 51 | 2026-09-21 | **The eight overnight reports investigated and filed (root `FEEDBACK.md` inbox, IN-1 to IN-6).** Six of the eight were answerable without Noodle, and four of the six inverted the report. The five "cut" designs were never cut — all on disk, all assigned, deferred by four separate decisions, and three of them are the one open job of building the Act1-B and Act1-C elite pools (`enemy_overhaul/` E13). The Argent Fencer was not held back: six encounters, no two-enemy elite (`rework/enemies/` B36). The Campfire's broken picture is not the random select — the file and its whole folder do not exist, and `theSealedDoor` is broken the same way (`map/` B42). **Sprite clipping is worse than the two he caught**: twelve sprites leave the screen at his 1878x804, and the Head Gardener is 453px off the top against the Pale Dray's 108, unreported because she is only met at the end of a run (`rework/enemies/` B37). A bigger window clips harder, not less. New tool `tools/audit-sprite-fit.js` measures it per encounter at any window shape — its first build waited a fixed 260ms and silently measured the PREVIOUS fight, so it now waits for the line-up it asked for and reports rather than guesses. Also found unasked: re-running the placeholder generator would overwrite real art in 26 folders (`art_pipeline/` B39), `artOwed` is stale on 23 enemies (B40), eleven enemies were never flagged as owing art and three are literal recolours (B38), and **the boss node's tooltip never names the boss or the route it opens**, which is why the three routes are unreachable on purpose (`map/` B41). The root index was 5 rows out of date and is re-measured at 91 open items. Nothing in the game was changed. |
| 50 | 2026-09-20 | **Looping music (`audio/` B12).** Noodle's three songs cut to his listening notes — every dislike of his showed up as a measurement (title +6 dB at 1:24, combat +7 at 2:08, map silent until 0:23) and sits outside the cuts. Built offline by `tools/music/build-music-loops.py` from a cut list, mastered to one loudness. **A lap never uses `audio.loop`**: each file carries a post-roll repeating its opening, and `honeycomb-music.js` changes over between two `<audio>` elements playing identical audio, which survives a throttled tab. Cues are a tuning table. **Syrup Town's songs are muted, never paused** — `sound.js` reads a paused song as an autoplay block and switches sound effects off — and `sound.js` itself was not edited. Suite block [123]. **Waits on Noodle's ear**; the agent cannot hear. Detail: `audio/MUSIC.md`. **And, same day, the enemy art batch plus E12 (`enemy_overhaul/`).** Every owed enemy drawing was gathered into one flat workbench (`D:\honeycomb spare art6-09-2413 spire png\enemies\_workbench`, 20 sources + 23 briefs, named by enemy index) after an audit found thirteen enemies wearing seven drawings recoloured -- five of them the SAME `caster` drawing -- and the thirteen Act1-B/C bodies with no art at all. The old `refsPNG/enemiesOwed/` prompts were found to predate the session-44 recast and would rebuild the replaced cast. **Noodle then cut the Tallyman on sight** (*"absolute word salad to my mind"*) and asked for *"a sentient colony of black mold or something with a scythe"*: he is **The Shroud**, with The Ledger -> The Damp, Tally -> Bloom and five renamed moves, and NOT ONE NUMBER MOVED -- index, role, 205 health, phases, weights and effects are the E7 values. Names open for veto in E9. Suite 2420/0, block [124]; falsifying it caught a check of its own that read `reactionHooks` through `JSON.stringify` and so could only ever be red. |
| 49 | 2026-09-20 | **The Event Gallery (`gallery/`, new).** One page per character, scenes as tiles, opened by the heart on teambuilding and by a Gallery button on the title — one overlay, both doors. The map's party button is gone: its party portraits open the party window on the face pressed, and session 21's Broken alert moved onto that face. **Membership is opt-in on a scene's START ROW alone** (Noodle: *"We want to save the start points of events, and only the start points"*), and `partArray` makes a multi-part scene one tile. A locked tile shows only the mechanical half of its requirement. **A replay pays nothing — no experience, weakness, unlock, cost, discovery or completion — but still DOES the scene**, so the Lust Battle in it is refought: an effect marked `sceneStructure` resolves under a read-only host. **A battle's win and loss are tiles of their own, both opened by finishing the scene once**, which is what stops a win from costing the loss scene. Two run-safety guards: a replayed event never touches the run's saved-event slot, and a replayed battle stashes the player's run with saving suspended. Suite 2352/0, block [122]. **A follow-up round the same day**: the character-selection wall is gone (the rail opens straight onto a page and is the teambuilding roster's own widget, counting scenes where the roster counts health), the window and the panel-mode event are screen-sized, and every tile crops the same. **Map events replay too** — all eight were driven through every choice — which turned up three bugs now fixed: a priced choice was a dead button under a host that charges nothing, a fight in a map event had nobody to field, and a replay begun with no run left a phantom one behind. **Also fixed a bug that had made separate win/loss events impossible**: `startCombat` never copied `victoryEvent`/`defeatEvent` onto its request. |
| 48 | 2026-09-20 | **Lust Events: the QUEUE, the writing rules, the first scenes, and the first images.** The engine half is `lust_events/` B22 — the old three tables and the session-47 backfill are gone, replaced by one `honeycomb.lustEventQueueArray` whose rows are worked out fresh every time they are asked, so a scene written today is owed today. Trigger moved off the weakness onto the character (roster heart + a new sheet banner); save format 10 carries old profiles across. Suite 2128/0, blocks `[68]` and `[116]`. **The larger half was writing.** Noodle gave four design goals and then rewrote the cast in his own words twice; `IDEAS.md` was rebuilt around them — six rules, the per-character themes, and **charm rewritten from scratch** (it is fey suggestibility and inhibitions dropping, **never hypnosis**, with a banned-word list). `SCENES-01.md` holds six venom sketches, two of which are Noodle's own and are now the register reference. He also set the workflow: scenes are **idea → sketch → finished draft**, and his `im <path> [what it shows] (tags)` is the sketch format. Both skills updated: `syrup-town-scenes` gained `.claude/skills/syrup-town-scenes/reference/honeycomb.md`, `syrup-town-images` gained `.claude/skills/syrup-town-images/reference/generating.md`. **Images: eight generated for Nettle, all in the wrong style** (`Syurofluff v7`; Honeycomb wants `Oreteki18kin`) — and the corrected re-run hung with Forge idle, undiagnosed. New permanent tool `webui2-generate.js` replaces the bespoke scripts these jobs kept needing. Three small engine changes are specced and unbuilt in `lust_events/HANDOFF-ENGINE.md`: italics/bold/`<br>` in event prose, per-page art (every scene wants 2-4 images and only the first can show today), and a “Later...” continue button. |
| 47 | 2026-09-20 | **Hover carried across every repaint (`ui/` B34).** The hand's session-36 carry asked `:hover` alone, so two repaints inside one frame dropped it — measured `{hover}` → `{carried}` → `{neither}` — and fighters had no carry at all. `honeycomb.combatScene.carriedHover` now marks both and releases on the scene shell's next `pointermove`. **Noodle's exact medallion press did not reproduce** in a plain fight (no repaint happens there); B34 says what was ruled out and what to report if it persists. Performance measured for B16: the engine is < 2ms a turn, `repaint()` is 13ms with layout, and the boot payload is 15 MB in 93 scripts — see `performance/FEEDBACK.md`. Suite 2094/0, block [115]. **Later the same day, the Lust Event backfill (`lust_events/` B21).** A scene added to the list was only ever offered for rank-ups that happened after it was written — `chooseEvent` runs ONCE at the rank-up and freezes its answer into the record, a rank is never lost, and a notification record is DELETED the moment the weakness is looked at, so the history of what was missed was gone rather than merely frozen. Every scene written from now on would have been invisible to the early testers. What survives is `lustExposureArray`, so the rank sat at is always derivable: `honeycomb.lustEvents.backfill()` offers authored scenes for ranks a profile passed before they existed, from the new `honeycomb.save.afterLoad` seam that BOTH load paths call. **Authored only** (`listOnly`) — a fallback already had its roll and a milestone counts events raised, so re-firing one would renumber the spine — and capped per character and per profile, because Event Ready keeps a character OUT of the party. `rankFor`, not raw exposure, so Fortitude’s rank-1 cap is respected. One addition it forced: the completed tally is a COUNT and cannot say WHICH rank was seen, so `resolveRecord` now registers (character, tag, rank) in `lustEventSeenArray`. Block `[116]`, **all 27 checks proven to go red against six engine mutations** — one of which caught a check of mine too weak to notice a duplicated rank. Browser end to end: the roster row marks `hcLustEventReady`, the weakness row offers **Event Ready!**, and the scene opens as *"NETTLE: SENSITISED"*, rank 1, the lowest unseen. Also `lust_events/IDEAS.md`, a brainstorm menu (untag rather than delete; Torment has no source anywhere; Penance is Clemence-only at 3 scenes; two recurring guests; the per-character grids), and `RATE.md` corrected where the enemy overhaul had overtaken it (12% → 28.0%). Suite 2121/0. **And the `ui/` queue, same day:** B29 closed (Win is one press from the fight — a debug action is promoted by `quick` / `topBar` fields on its table entry); B32 built (`--hc-title-shadow`, and enemy names wrap instead of being cut: 16 of 55 crowded encounters were truncating in a squarish window; the size was left alone on a measurement); A10's three Battle Lab defects found by measurement and fixed (0 tooltip hooks on 251 faces; the filter row crushed to 4px; an anchor now holds only on the line it was written for). A10, B32 and B34 wait on Noodle's eye. Suite 2144/0, blocks [117] [118]. **And lane `ANA` worked `chessmaster/HANDOFF-S47.md` — Noodle's own play feedback, task by task.** **The sixth body** was two bugs, and he named the cause mid-session (*"pawn summons should always eat dead pieces"*): the golem cap counted the STANDING, so a downed piece held no slot, and a Pawn summon only ate a fallen PAWN, so a fallen Knight sat there uncounted and the next summon drew beside it. The cap counts bodies now and the refill runs before it. **The pieces were given an alignment identity** — Infernal pays for its damage in blood (the Pawn bleeds a bite, the Knight retreats after striking, the Queen deals none at all and bills the party for its Strength), Celestial banks the wall; Pawn and Rook want the front, both Bishops the back. **Her pool was reworked to his spec**: the attack starter is **Advance**, a summon, not 6 damage; **Check** kept its index and became the rare the name deserved; **Castle** replaced by **Castling**; four sacrifice commons and a field clearer added; **Deep Calculation** rebuilt AND its zero-draw bug found — `partyTagCount` resolves tags through a CHARACTER definition, so a golem counted nothing. **Two Kings**, each leaving a Court status on her (banked Temporary HP thrown at every enemy / the turn's damage echoed), Call the King sending whichever colour has more pieces standing, and both King entries marked `setDressing` — which answers *"Is the king a real unit or not?"* in the content and takes them off the bestiary. Also **Commander's Burden** (Lust aimed at a golem lands on her), her three **broken forms**, the **Composure** tree node, and six **keywords** (Summon, Promote and the four shapes). **The move button was measured out from under the statuses**: it sat at a fixed drop INSIDE the first row of status circles, and below the bar there is no room for both — at 1280×720 the button under the circles ends 5px past the battlefield and inside the hand, the circles under the button end 38px past it — so it moved above the bar and a piece's telegraph is lifted clear. Zero rectangle intersections at 1280×720 and 1878×804. New generic seams: `lastSummoned` and `randomPiece` target modes, `raiseFallenPieces` and `setLust` verbs, `partyEntityTagCount`, the `onSideTurnResolved` hook point, `combat.enemyDamageTakenThisTurn`, and `setDressing` on a content entry. Suite **2196/0**; warning report down to **1** (her heirloom). **B is NOT finished** — Noodle: *"I think it's not enough... come back to it last and discuss with me"* — the proposal is `chessmaster/PIECE-IDENTITY-S47.md` and it waits on him. Five reports of his that are not hers were filed byte for byte into `ui/` and `art_pipeline/`. **Then the polish pass, with him out:** her **heirloom** (`Pocketwatch` — a piece falling walls the ally in front), which takes the warning report from **7 active to 1** (the deliberate `inDevelopment` flag); every new card **played through the real play path in the browser**, 11 of 11, both Invocations included, with every sprite verified loaded rather than looked at; and two defects that pass found — the two Courts **double-dipping** (the Celestial one's hit fed the counter the Infernal one echoes; the general fix is `echoed: true` on a damage entry) and two backdrop props standing in **exactly the same place**. The gauntlet was re-simulated and got markedly harder — recorded with the numbers and the mechanism (unbounded Sundered from a wide Hex) in `chessmaster/STATUS.md`, and deliberately NOT re-tuned, because B's second pass will move all of it again. Suite **2204/0**, block `[114]` grown by 70 checks. **ROUND TWO, the same day: Noodle rewrote the piece identity table himself** — he read `chessmaster/PIECE-IDENTITY-S47.md`, rejected most of it, and edited §1's table in place, adding the **Revenge** status and making the **Queens the one piece that breaks the two-move rule** (five moves, walked in order, the fifth shuffling a King's Invocation into the deck permanently). Built from his table, which needed six new target modes — his wording distinguishes "the ally in the front" (absolute) from "all allies in front of THIS" (relative) — plus `summoner`, the `targetCount` value, value subjects that may name a single-target mode (so the Celestial Knight deals "damage equal to the intent of the golem behind it"), and a deferred-draw status. **Eight other reports from the same message:** nameplates no longer grow on hover (the step forward was worn by the whole column, so every press target slid out from under the pointer — the SPRITE steps forward alone now and the plate answers with opacity); the move button moved BELOW the debuffs at his direction, reversing an earlier choice the same session; Taunt **reworked to redirect all damage** (it was a selection filter, and `wholeTeam` modes skip that filter by design, so a wall could not stand in front of a sweep); Severine is **undead** and the `vampire` tag is deleted; and the forecast stopped warning that a fighter about to DIE was about to break — the break margin is standing health minus Lust, so lethal damage zeroed it on a body holding no Lust at all. **Strength was measured, not assumed:** it reaches piece attacks through one unified pipeline (6 → 11 with +5, telegraph, hit and AI path alike); what moved under him was the old table's positional conditional. **And the support pose was an ENGINE bug, not an art job** — `.hcFighterArt`'s percentage `max-height` resolves against an indefinite height and has never applied, so sprites are sized by WIDTH and a canvas of another SHAPE draws another HEIGHT: her 650×1300 crouch drew 458px against her 832×1216 combat pose's 335. `honeycomb.art.normaliseCanvas` corrects the shape against `tuning.art.spriteCanvas`; a matching canvas is written no style at all. Suite **2253/0**, new block `[120]`. **ROUND THREE:** Poisoned Pawn cut (her attack starter does the same thing better at the same price); Commander's Burden made `polarity: "neutral"`; **the broken hand fixed at the RULE** — his spec was written per RARITY and had been built per CARD, so exactly three of her cards broke into what he designed and every other one broke into the starter's form, which is a new `brokenCardByRarity` on the character entry (and it caught the `characterInDevelopment` warning reading the card FIELD rather than the resolver, so it reported three rarities missing on a character that had all three); and **Blunder became a blank that bites if held** — no effect when played, damage if still in hand at turn end, on a new general seam `honeycomb.combat.resolveUnplayedCards` that runs before and outside the discard. **Re-simulating the gauntlet then found a real bug:** a Queen's fifth move shuffles a King's Invocation into `run.deckArray` — the PARTY'S deck — and her pieces are also the gauntlet's enemies, so the enemy-side Queen of the Queens' Guard was handing the player a King, twice a fight. `addCardToDeck` now refuses a user who is not on the party's side unless the entry says `evenFromOpponents`. The gauntlet's shape moved a lot and is recorded but NOT re-tuned: **the Opening File, the earliest fight, is now the hardest thing in it** (235 a turn by turn 8) while **the Queens' Guard collapsed** (mean 85 → 43), because three of a Queen's five moves do nothing to an enemy — the five-move kit is designed for the player's side. Suite **2283/0**, new block `[121]`. **ROUND FOUR — the gauntlet cut to a corridor.** Nine rolled rows became six written ones on a new `line` map layout: Celestial, Infernal, rest, elite, rest, boss, four bodies a fight and five for the finale, with Strength and a new `enemyStartingTemporaryHealth` carrying the balance. **Both colours are in it now** — every line-up used to be Infernal, which was never said out loud. The elite is **"Drawn to Evil"**: a white line with one Infernal Queen who inverts the whole board on turn four and casts the King on turn five, heralded three turns earlier by a card that does nothing but say *"Prepare, for the king is approaching!"*. Two `unlisted` Queen copies carry it (`movesFrom` lets them wear the originals' cards rather than duplicating four), and a **"Play the Gauntlet"** debug button unlocks her, flips the switch and drops you at row one. Two measurements changed decisions: the Celestial Knight's Relay read ZERO behind a Bishop (whose every move is a shield), so the Rook goes behind it and the fight went from 10 a turn to 36; and a proposed Bishop reorder in The Black Reply was measured as a **no-op** — the line self-organises to Rook, Pawn, Bishop, Knight whatever order it starts in, so the Bishop never reaches the back and its wide Hex never fires. **A destructive mistake and its recovery are written up in `chessmaster/STATUS.md`:** a script that sliced the encounter table between two anchors matched a section header several regions share and deleted 44 encounters — every elite, all six bosses, and Act1-B and Act1-C. Recovered in full from the live Browser pane, which still held the pre-edit `honeycomb.encounterArray`; verified at 82 encounters with every region's pools intact. **BASICS forbids exactly that edit and the rule was broken.** Suite **2347/0**. |
| 46 | 2026-09-20 | **Anastasia rebuilt overnight (lane `ANA`), and she can be earned.** The chain is cut whole; all twelve pieces walk a two-move `sequence`; the one new verb `setIntent` moves the pointer with the telegraph, so a switch swaps two turns and never skips one. 15 cards + the phantom King's Invocation, every one posed; A1 is Transposition (`invert`, the `piece` target mode, a downed Pawn refilled in place). **The snap was broken and is fixed** — a summon's repaint wiped her pose before a frame of it drew; the hold now belongs to the scene (`heldPoseMap`), and a commanded board change waits for the gesture. The gate admits her only on a profile that has earned her; **`tuning.chessmaster.gauntlet.enabled` ships `false` and is Noodle's to flip.** The gauntlet is built behind it: a promised relic, a secret region at position 4, Infernal line-ups, and Anastasia herself as a `weighted` boss whose defeat writes the unlock. Two standing leaks closed on the way — the bestiary's twelve "???" faces and the ledger totals (`discovery.isSealed`). Suite 2051/0, block [114]. **Later the same day, five asks from Noodle:** the gauntlet is tuned against a 30-damage / 30-tHP party through a new encounter field `enemyStartingStatusArray` (enemy side only, so her own board is untouched; measured by `tools/gauntlet-sim/`); **the King became set dressing** (`showBackdropProp`, a dimmed figure behind her line, and his buff is the whole card); the relic is **Grandmaster's Invitation and the shop sells it** (`shopGuaranteed`); **she has a 43-node tree** from a new generator spec and a new `--only` flag, so her abilities are bought like everyone's; and the debug panel's unlock-all grants her. Suite 2076/0. **Noodle then played her; his feedback and the task-by-task plan for it are `chessmaster/HANDOFF-S47.md` — the next session starts there.** Easy wins done the same evening (Rampart, Tempo as the choose-one, Zwischenzug cut); suite 2134/0. |
| 45 | 2026-09-20 | **Act1-B and Act1-C built and switched on (lane `E7`) — Act1-2 is three routes.** The route mechanism first and OFF: `tuning.map.route` decides the second region from the Act1-1 boss the run just beat, `run.routeRegionIndex` records it once on the way down, and **a save written before tonight reads as the default**, so no run in progress was stranded. Nothing reads `regionArray` by position to mean "the next act" any more, and `map.countedRegionArray()` is the one place that decides which regions a player may be told exist — which is also what keeps lane `ANA`'s relic-only gauntlet secret. **Twelve enemies, each designed off its own picture**: Act1-B is the Venom route (Wellspring, Briar Brat, Trumpet Bell — the non-humanoid — Windfall Alraune, Thorn Fencer, and a **two-body boss**, the waking and sleeping sisters); Act1-C is Charm (Sable and Argent Fencers fought as a matched pair, Mantlewing, Longwing, Soakcap, and **The Pale Dray**). 24 encounters plus four elites neither route had — an elite node with no pool silently serves an ordinary fight. **Lust 25.7% → 28.0%**, venom 15 and charm 15, neither holding half. One missing verb added: **`bossHalf`**, because a boss that is two bodies could not be budgeted. The Tallyman moved up to Act1-1 as authorised and was **re-budgeted 250 → 205** — he was written as a second-region boss and would have opened one run in three on the hardest first boss. Glowcap Moth is a mushroom. **The audit earned its keep three times**: it found the Pollen Road's charm stacking over the lust cap (three bodies applying Sensitive), the sisters' Retort compounding unbounded across an 11-turn fight, and — against an Act1-A control run — that "turns ▲, output ▼" is how the whole game reads at this depth, not something the new content introduced. Both routes played in the browser to their bosses. Suite 2051/0, block `[113]`, 12 of its checks proven to go red against the pre-E7 engine. |
| 44 | 2026-09-19 | **Enemy overhaul, the recast half — E1/E2/E3/E4/E6 and E10 closed.** The four interchangeable robes became four species with four silhouettes (Earthstar, Bracket Elder, Witch's Butter, and the Spore Alchemist deliberately untouched — the tone rule cites her by name). The taxonomy five became frontier myconids under arms (Shieldcap, Cagecap, Bolete Hook, Foxfire, Scrap Salvager), each read off the move list it already had. The Cordyceps Husk — the tone rule's own blocked idea — is the **Sporeguard**. **E3 closed on a measurement**: new `tools/lust-share.js` reports **26 of 101 enemy moves dealing Lust, 25.7%, against 12.9%**, nobody harder (six 1:1 damage-to-Lust conversions, the rest into existing slack, out-of-band count unchanged). **Noodle answered E10 mid-session — the Scrap Salvager is an elite**, so 64 → 135 health and six encounters rebuilt around him. **The session had to be redone once**: the first pass was built without `designBibles/story.md` and `mechanics.md`, which gave Act1-A a Restraint theme it is not supposed to have (it is the low-lust sub-act) and made Act 1-1 a venom monoculture, pre-spending Act1-B's identity. The second pass fixed both and the bibles are now named as required reading at the top of the workstream catch-up. Three audits earned their keep: card-fit caught a rename overflowing its box, a new falsification harness proved suite block [111] fails on eleven kinds of damaged roster, and a lineup-mix measurement found the monoculture. One missing verb added: `lust` was not a `cardTextTokenKindArray` kind. Open: the names are Noodle's to veto (E9), and region 1 is still called The Flooded Vault (`map/` B31). Suite 1923/0. **Then E7, with Noodle:** all 49 images in `enemy inspo variants/viable/` graded by eye and assigned one-per-enemy into `assigned/`, five of his corrections overturning reads that were wrong at thumbnail size. **All three routes ship** — Act1-B's boss is the thickmantis day/night pair, Act1-C's is the chained moth-beast, and the Hollow pair turn out to need no art at all (same faction, same armour, correct). Three txt2img prompts written for the enemies with no candidate — Head Gardener, Glowcap Moth, Tallyman — which is **every remaining copypasted boss**. The Tallyman moves up to Act1-1 and its three bosses each gate a route, which also does `map/` B31's job of making the choice informed. The build brief for the twelve new enemies is `enemy_overhaul/_archive/HANDOFF-E7.md` (archived session 45, when it was executed), written to be executed cold. |
| 43 | 2026-09-19 | **Anastasia rebuild, session 1 of n.** A12 landed: each side of the battlefield now takes the share its crowd needs (`sideGrowPerExtraFighter`, `sidePaddingPercent`), so five allies render at 215px against three at 193px before — re-measured live and matching session 42's prediction exactly. `crowdedSideCount: 4` stays; turning crowding off at four allies makes figures 21% SMALLER. A14's annotation was flattening Noodle's hedge and was corrected. **A18** sized the twelve pieces (they all rendered at one height); **A23** found the row crowding was the activation label, not the plate; **A24** — Noodle asked "Why are they backwards?" of a screenshot and every summoned piece turned out to have been mirrored since session 36, with four suite checks asserting it. Bug docket triaged with him: enemies-vanishing closed, ability-menu resize confirmed live and re-diagnosed as a lost-hover bug, dead pawns downgraded to a design knob. **A25 stage 1**: one aim mode for abilities AND piece activations, on one shared `targetModeAllows` predicate; the Knight's slot list is a button; **A11 fixed** — two repaints, not one, and the medallion press was the one he was clicking. Cinder no longer wastes Marshal's Call on herself. **A25 stage 2**: an aim is now DRAGGED on the card's own machinery — reticle, curved arrow, legal marks, depth focus, a move preview, pointer capture and no document listener. Suite 1809/0. |
| 42 | 2026-09-19 | **Story bible rebuilt, enemy overhaul opened.** The old `designBibles/story.md` was found to have been overwritten by another AI and is archived; the replacement carries the one world rule (magic makes a thing more of what it already was), the recovered act names (**Fungi & Flora / Excavation Front / Marble Hive**), and the sub-act structure: **Act1-A Mushroom Frontier** (live), **Act1-B Flora** (empty), **Act1-C the Pollen Road** (empty) — all three in demo scope, so two rosters are owed. New `enemy_overhaul/` (E1–E5) and its hard rule **retool, don't relocate**. `lust_events/` gained `lust_events/RATE.md` and `lust_events/AUTHORING.md` plus B18–B20. Noodle added a Variety law to the Mechanical Bible. Closed with the **enemy inspo experiment**: 27 source images × 4 prompt variants (faithful / silhouette-only / two lewd) = **108**, in `v13 spire images/_source/enemy inspo variants/`, for the next session to design enemies from. |
| 41 | 2026-09-19 | **Documentation housekeeping.** Tools moved to `tools/`, `rework/` split by pathway, this file turned from a 1921-line log into a directory, and **feedback split out of round 09 into a `FEEDBACK.md` per workstream** (root file keeps the demo gate, the top-priority section, an index and an inbox). New audits: `tools/doc-links.js` (stale pointers + stray root files), `tools/feedback-audit.js` (index vs reality). B20 closed — `skull` is 32 live icon references, not a stale codename. Suite 1681/0. |
| 40 | 2026-09-19 | The phantom roster tile: `honeycomb.shippedCharacterArray()` is now the single gate every screen that lists **or counts** characters asks. `BASICS.md` was corrected — it had asserted a property the code did not have. |
| 39 | 2026-09-19 | Phone session, no shell. Noodle amended the demo scope (performance is top, lust events added, telemetry promoted) and answered the chessmaster decisions. |
| 38 | 2026-09-19 | Demo scope settled. Rarity gem made opt-in per rarity. Rounds 07 and 08 closed into round 09. |
| 37 | 2026-09-19 | A broken card no longer changes shape — this unblocked the card art pass. Compendium rebuilt on the logbook's two-stage pattern. |
| 36 | 2026-09-19 | Recovery pass after an interrupted session left the suite red. One health baseline, stale saves purged, the hand stopped bouncing. |

---

## Status as of 2026-09-20 (session 46, lane ANA: Anastasia rebuilt overnight)

One of two lanes working the repo at once (`reference/LANES.md`; the other is session 45, lane E7). The
whole of the detail is `chessmaster/STATUS.md`, which is written to be read first thing in the morning;
this entry exists because LANES asks each lane for one, and records only what belongs nowhere else:

- **Engine seams added outside her own content, all generic:** a pose hold that survives a repaint
  (`combatScene.heldPoseMap` / `restoreHeldPoses` / `afterCommandLead`), an `intent` replay beat,
  `poseHoldMs` on a character or a card, a target mode's `allowsDowned` and `accepts`, a relic's
  `promisedAfterTier`, an encounter's `victoryUnlockArray`, `discovery.isSealed`, and the unlock kind
  `character` reading the shipped roster. Any later character may use every one of them.
- **The two-lane protocol held.** One collision: E7's tripwire check on `overrideArray` went red when the
  gauntlet's row landed, was left alone, and E7 re-pinned it itself. Suite 1923/0 at the start of the
  night, 2051/0 at the end.

---

## Status as of 2026-09-20 (session 45, lane E7: Act1-B and Act1-C built and switched on)

One of two lanes working the repo at once (`../reference/LANES.md`; the other is session 46, lane ANA).
The workstream record is `../enemies/ENEMIES.md`; this entry exists for the two decisions whose
reasoning belongs nowhere current.

**Why a route is a table and not a branch in the generator.** The game shipped the next morning, so the
mechanism landed in its OFF state first -- every `tuning.map.route.byBossArray` row pointed back at
`floodedVault` -- and Stage 3 changed three strings. That is still the release switch: taking either new
route out of the game is one line and nothing else, and it stays that way only as long as nobody moves
the decision out of the table.

**Why `regionArray` stopped meaning "the acts, in order".** It had been read by POSITION in three
places to mean "the next act", and Act1-2 being three alternatives made every one of them wrong:
`generateRegion` would have sent every run down position 1, the win condition would have made a run four
regions long, and the discovery ledger would have promised a total no run could fill. The replacement is
`honeycomb.map.countedRegionArray()`, which is now the ONE place that decides which regions a player may
be told exist -- and is therefore also what keeps lane ANA's relic-only gauntlet secret. Nothing may go
back to reading that array by position.

**One rule was bent, with authorisation.** RETOOL, DON'T RELOCATE is this workstream's own law and the
Tallyman broke it: he moved from Act1-A's boss pool to Act1-1's so that each Act1-1 boss opens onto one
route. Noodle authorised it in the E7 brief. He was re-budgeted 250 to 205 on the way, because he had
been written as a second-region boss and would otherwise have opened one run in three on the hardest
first boss in the game.

**One verb was missing.** A boss that is two bodies could not be budgeted at all: graded as two whole
bosses the sisters each read a hundred health short, graded as one they carried twice a boss's fight. The
answer was a table entry, `bossHalf`, exactly half of `boss`. Cost: one additive line in a file LANES
assigns to lane ANA, because the compendium's heading table must cover every role or an enemy lands
silently in "Other". Recorded in `../enemies/INFERENCES.md` I10.

---

## Status as of 2026-09-19 (session 40, the phantom roster tile)

A short session on one item: the VERIFY flag session 39 left on Anastasia's visibility. Suite
**1681 passed, 0 failed** (block **[105]**, 13 new checks).

- **NOODLE WAS RIGHT ABOUT THE "LOCKED" SECTION, AND BOTH DOCS WERE WRONG.** He reported seeing one on
  the roster; `BASICS.md` and `FEEDBACK-09.md` both asserted `inDevelopment: true` filtered her out of
  the roster, teambuilding and compendium *entirely*, so the item was written up as "VERIFY, this
  contradicts the file". It did not contradict the file — the file was mistaken. The hole is in
  `honeycomb.teambuilding.buildRosterColumn`, which draws one locked `??? / Not yet found` tile per
  character it has not shown and sized that run off `honeycomb.characterArray.length - shownCount`, the
  UNFILTERED table. Fully unlocked, that is `7 - 6`: one phantom tile advertising a seventh character,
  which is the exact thing the demo scope forbids in his words (*"I don't need 10k emails asking how to
  unlock her"*).
- **The lesson is about the shape of the bug, not the bug.** Two of the three screens that list
  characters filtered correctly (title/compendium), so the property looked held from any single reading;
  the third did not list them at all, it COUNTED them, and a count is the call site nobody re-checks. The
  fix is therefore one gate rather than a third inline filter: **`honeycomb.shippedCharacterArray()`**,
  in `honeycomb-content-characters.js` — deliberately a content-side file, because a helper in
  `honeycomb-ui.js` or a scene file is invisible to the suite. The compendium's inline filter now calls
  it too, so there is one expression left in the codebase rather than three.
- **Verified by measurement, then by eye.** Locked tiles rendered against unlocked count: 1→5, 2→4, 4→2,
  6→**0**, with `shown + locked == 6` throughout — so the "the roster grows" behaviour the locked slots
  exist for still works, which was the real regression risk in this change. A tainted save whose
  `unlockedCharacterArray` held all seven still rendered six entries and zero mentions of Anastasia.
  Screenshot agrees with the numbers. Block [105] also carries a falsification pass: re-introducing the
  old formula turns it red (confirmed by actually doing it, not by reasoning about it).
- **`BASICS.md` was corrected, not appended to** — the demo-scope bullet had asserted a property the code
  did not have, and a brief only changes to fix a mistake. It now states the rule as a rule (every screen
  that lists OR counts characters asks the gate) and points at `FEEDBACK-09.md` A4 for the history.
- **Anastasia's three real decisions (A4) are untouched and still deferred to her own session.** This was
  the visibility bug filed alongside them, not one of them.

---

## Status as of 2026-09-19 (session 38, the rarity gem and the round roll-up)

A short session on three of Noodle's answers. Suite **1668 passed, 0 failed**.

- **THE RARITY GEM NOW MARKS A RARITY.** Noodle: *"remove the rarity gems from common cards"*. The gold
  gem (`cards/chrome/rarity_gold`) was a chrome piece drawn on EVERY card, so it signalled nothing at
  all. It is opt-in per rarity now: `cardRarityArray` carries `showRarityGem`, the chrome piece carries
  `rarityGem: true`, and `honeycomb.cardShowsRarityGem(card)` is what the renderer asks. Only **rare**
  says yes — starter sits below common, `special` is two curses and two stand-ins (a gold mark on a
  curse reads as a reward), an enemy move is never drafted, and a broken form is marked by its rose
  edge. A rarity that says nothing draws nothing, so one added later is quiet until it asks. Verified
  in a browser; tests in block **[104]**.
- **THE DEMO SCOPE IS SETTLED** — the question BASICS had been holding open since the MVP checkpoint.
  Noodle named ten goals for a **beta demo** (verbatim in `BASICS.md`, "The demo scope", which is the
  authority; mapped to the work queue in `FEEDBACK-09.md`, "The demo gate"). Two of them are bigger
  than the list makes them look: **Act 1-1 and Act 1-2** has no engine behind it (one 9-row map, no
  act table, no seam), and **mobile portrait** is a different aspect ratio from the landscape target
  the scaling pass was measured against. Telemetry and the Battle Lab serve no demo goal and drop
  down the list accordingly.
- **BASICS gained two rule sets promoted from `card_redesign/BRIEF.md`** (Noodle wrote them strictly
  for a weaker model; they generalise). "A standing brief never accumulates progress" — brief /
  status / inferences are three kinds of document and never mix, a folder gets a folder map, and new
  docs go inside the folder they belong to. "Verification: no pass by assertion" — numbers beat
  descriptions, the suite is not the truth either, unchecked is a failure, falsify before ticking.
- **Moss is Nettle** (Noodle), so session 37's Vigour spread stands: Brienne 6, Severine / Cinder /
  Clemence 3, Cassadora 2, Nettle 1. Nothing in the code carried the old name. Locked into the suite.
- **Rounds 07 and 08 are closed and rolled into `FEEDBACK-09.md`.** Every open item in both was
  re-read, and the ones worth re-testing were tested rather than copied: **Brienne's Resolve is
  done** (1 per point of damage taken landed in session 33 and was never annotated), **every alt
  outfit is still open from the start** so the whole 21 C / 11 R pool drops at once, **the cross-party
  count was re-taken on the new pool** (Nettle 2 and Severine 2, not Nettle 0), **Absolution still
  soothes allies** against the rule that Clemence never reduces an ally's Lust, and **the draft
  simulation's cut list is stale** — it modelled the pool session 33 replaced, and 6 of its 20 named
  cards no longer exist, so it wants re-running before any card is cut on it. 12 items wait on Noodle,
  14 need no decision. The two closed rounds keep a one-line stub in the honeycomb root (this session
  cannot delete files on Noodle's disk) and their full text is in `Archive/`.

---

## Status as of 2026-09-19 (session 37, FEEDBACK-08 round two)

Three things Noodle came back with. Suite **1650 passed, 0 failed**.

- **A BROKEN CARD NO LONGER CHANGES SHAPE.** The frames complaint was not about rarity at all. Only 55
  broken forms are authored per-card; the other **168 fall back to the character's ONE shared broken
  card**, and all six of those were `layout: "vertical"` — so three cards in four turned vertical the
  moment their owner Broke, and every broken card therefore needed vertical art. The resolved broken
  view now takes its `layout` from the card it replaced (`layoutFixed: true` opts out; nothing uses it).
  Measured: 198 horizontal → horizontal, 25 vertical → vertical, zero changes. The shared forms
  consequently need a crop per window and carry `artPathByLayout`; they also stopped borrowing another
  card's picture (`brienneBroken` was wearing Guard's art). **This unblocks the card art pass.**
- **The compendium picks before it reads.** Syrup Town's logbook is two stages — `generateLogbook`'s
  wall of portrait tiles, then `generateNav`'s rail-plus-page — and that is what the bestiary and the
  cards tab now are. `honeycomb.compendium.renderPicker` is the one component; an item is
  `{ index, name, group, known, faceMarkup }`. Enemies group by the same difficulty order the sort
  uses, bosses then golems last.
- **The emailed player feedback is triaged** (`FEEDBACK-08.md` §C), claim by claim against the live
  tables rather than by argument: **13 out of date** (the pool overhaul and the enemy pass ate most of
  it — Mark Prey, Transfusion, Tithe, Whetted Edge, starters-as-rewards, relic gating, Severine's
  opener, enemy stats, and "rarely more than 2 enemies", which measures at 31 of 46 encounters fielding
  three), **4 still live**. Gorged-on-drain was re-tested and fires. The two worth acting on are free
  per-fight healing in the heirlooms against the campfire, and Whetted Edge as a free permanent upgrade.

---

## Status as of 2026-09-19 (session 36, FEEDBACK-08: the recovery pass)

**The suite was RED when this session opened — 12 failures — and that is the headline.** Session 35
(the chessmaster pass) was interrupted partway and left the build broken; a red suite then hid a real
engine bug for a whole session. It is **1640 passed, 0 failed** now, with 21 new checks in block
**[103]**. `FEEDBACK-08.md` §A is the full autopsy of what the interrupted session had and had not done.

The engine bug worth remembering: session 35 registered a SECOND `hasTag` condition in
`honeycomb-effects.js`, which shadowed the real one in `honeycomb-tags.js` (`findDefinition` returns the
first match). The original answers `of: "card"` and `of: "owner"`; the new one answered neither, so
**every card asking about its own school silently answered false**. The duplicate is gone and the
surviving one learned `over` (a target mode), which is what session 35 actually needed.

What else landed, all from FEEDBACK-08:

- **One health baseline.** `tuning.run.characterBaseHealth` (58); no character carries its own
  `baseHealth` any more, and the field survives only as an override. Tankiness is the **Vigour** node's
  rank ceiling — Brienne 6, Severine/Cinder/Clemence 3, Cassadora 2, Nettle 1 — and Vigour is priced per
  rank (25) rather than per node. Starting gold is 30.
- **Stale saves are deleted, not migrated.** `tuning.save.formatVersion` 9, and a new
  `staleBeforeVersion` floor; `honeycomb.save.purgeStaleSlots()` runs at the top of `honeycombBoot`.
  Migration is untouched and still tested — it carries a save across a *shape* change, and nothing
  carries one across the content being replaced. A save pasted in as text is not gated.
- **The hand no longer bounces.** The closing repaint replaces the hand bar wholesale, and new elements
  cannot inherit a hover the pointer never left — so the hand sank under a still pointer and sprang back
  on the next twitch. The repaint now carries the hover across as `hcHandRaised`. Measured before and
  after in a headless browser.
- **A play queue rail.** A card queued during a replay leaves the hand for a numbered row over the
  middle of the battlefield, and flies from there. `tuning.layout.playQueue`.
- **Mirroring is displacement, not side.** Only a combatant standing where it does not belong is
  flipped, so ordinary fights are untouched. It is a class plus a CSS variable composed into the art
  wrap's transform — nothing writes over the hit shake or the downed tilt any more, which was
  `chessmaster/FEEDBACK-01` §A's prime suspect for fighters resizing.
- **The 13 session-34 enemies have their own art.** They shared their stand-in's folder through
  `artFolder`, so a Puffcap and a Sporeling were one picture; each now owns a folder and a recolour
  recipe in `ENEMY_SOURCES`. Sidecar packs (`<enemy>.png` + `<enemy>.txt`) are in
  **`v13 spire images/_source/refsPNG/enemiesOwed/`** — `--only sidecars` rebuilds them.
- **Combat poses are wired in.** The generator writes `1-combat`/`2-combat` for every outfit and every
  enemy (a copy of `basic` where no side-facing drawing exists), so
  `honeycomb.art.combatStanceEnabled` is on and real art drops straight in.
- **The compendium reads in order**: cards by rarity, the bestiary by role difficulty with bosses last
  and the golems after them. Both sorts read tables that already encode the order rather than repeating
  it.
- Teambuilding's Deck and Start Run sit at the right edge again; the progression column reserves room
  for a two-line node name plus its cost; Brienne's Vow soothes 10 and cleanses.

**Anastasia is gated, not finished.** She carries `inDevelopment: true`: the content tests skip a
character wearing it, and a warning rule `characterInDevelopment` prints what is still missing at every
boot, so the gap cannot be shipped quietly. She is last in `characterArray` now, not first.

**Five things wait on Noodle** — FEEDBACK-08 §D. The load-bearing one is the card frames (starter vs
common, rare vs broken, the hue-shifted gold trim), because it blocks the art pass of the new cards.

---

## Status as of 2026-09-18 (session 29, THE PROGRESSION-WIRING PASS)

**`rework/WIRING-STATUS.md` is the per-node truth. All 256 nodes carry an engine-read effect field and
every field has an engine reader. The content-fidelity pass is CLOSED too: the 7 stand-ins, the
0-damage type flip and the A1/A2 ability-table mismatches are all replaced with the designed behaviour
(see WIRING-STATUS §"Content-fidelity gaps — ALL CLOSED"). Only U2 (waits on outfit upgrade ladders)
and the A1-gated OFFER stay deferred.**
Tests: 1487 passed, 0 failed, 0 pending; `audit-trees.js` every hard rule passes (256 nodes).

The 54 description-only nodes session 28 listed are now wired. The work split into new in-place verbs
plus content authored in `generate-progression-trees.js`:

- **Exclusive A paths all carry a delta.** Nettle Acid/Cloud, Severine Flurry/Drink/Price, Cassadora
  Nail/Twist, Cinder Plant/Reckless/Step, Clemence Share, Brienne Steel. Steel gates its +2/rank on
  holding tHP (`stat` + `condition`), Nail adds `debuffCount` damage/rank (two value expressions compose
  with `math add`), Plant overrides `partyShift` to `none`, Price is a 4×3 + one self-hit via
  `replaceEffectArray`.
- **`applyStarterUpgradeArray` grew two seams.** `replaceEffectArray` rewrites a basic's whole list
  (top-level only), and `applyStarterUpgradeFields` lays a `typeArray`/`partyShift` override onto the
  resolved card. Two value amounts now compose with `math add` instead of collapsing to the first.
- **Exclusive D is a choose-one in place.** All 15 nodes carry `starterUpgradeArray` →
  `replaceEffectArray` → the existing `chooseOption`/`chooseAlly` verbs. No variant cards were needed.
- **Training wheels keep A1 and repurpose it.** New `abilityUpgradeArray` on a node overrides the
  ability's `effectArray`/`text`/cost/requirements and can set `disableMechanic`.
  `honeycomb.abilities.definitionFor` reads it everywhere an ability is used or drawn;
  `honeycomb.abilityHasEnable` + a rewritten `honeycomb.mechanicActive` make the meter stop ticking.
  All 18 wheels ship.
- **U2 "Tailored" has a resolver.** Pool rows carry `upgradeLevel`; `outfitCardUpgrade` makes the worn
  outfit's added cards start upgraded. It is a correct no-op today because the signature cards have no
  `upgradeArray` (starters cannot be upgraded) — the outfit pass adds the ladders.
- **The three missing A2 abilities** are authored: `cassadoraMagicTrick`, `cinderPhoenixDive`,
  `clemenceOneWithNothing`. New verbs behind them: `spendMechanic`, `gainMechanic`, `conjureEnemyMove`
  effects, and a `mechanic` value. `soothe`/`cleanse` learned `all: true`; `removeStatus` learned
  `random: true`.
- **The last two field-only C.Ex.** are read. **Studied Foe**: `honeycomb.enemyMoveSeen` shows a whole
  movelist for a met enemy when `enemyMovelistUnlock` is selected (the move grid now reads it).
  **Soothing**: `healEntity` converts a rest-site heal into Lust removed while `rest.active`, for a
  member with `restSoothe`.
- **Block [87] enforces all of it.** 56 node indices added to `wiredMechanicSet`; loops cover the 15
  DEF and 18 wheel families. The card-type flip (0-damage forms → pure `negative`) stays open by
  design: the `typeArray` seam exists but a *per-rank* flip is what is wanted and a ranked node applies
  at every rank.

**The same session's feedback round (Noodle) landed too.** The progression pass is now **0 unwired of
256**.

- **Cinder *Reversal* (`cinDef2`) is wired** (the last description-only node): Change Places also strips
  1 Weak and 1 Sundered from the back-mover (`removeStatus` aimed at `backAlly`). STARTER-LIST's
  "Defensive upgrade" was the design all along.
- **Sundered ROUNDS UP.** Its `modifyDamageTaken` hook `Math.ceil`s, so one stack on a 2-damage hit is
  3, not 2 — Claw Flurry now gains from Sundered. The damage pipeline still floors afterward, so this
  is the only place a fraction is kept. Block [50] holds the 2→3 case and the 9→12 live-text case.
- **Second Thoughts never does nothing.** A re-roll marks the move it replaces (`entity.repickAvoidCard`)
  and `eligibleMoveArray` excludes it while another legal move remains; a one-move enemy still telegraphs
  it rather than standing idle. Covers Glimpse, Second Thoughts and Wane/Foresee/Refract.
- **Effect conditions print.** `describeEffectArray` prefixes an effect's own gate, the `stat` value
  honours a `label`, and `compare` has a plain-English "you have any X" form — so Steel reads
  "Deal 6 damage. If you have any Temporary HP: Deal 2 damage." (Noodle: it printed the bonus flat).
- **Choose-one cards print their effects, not their option names.** `chooseOption.describe` lists each
  option's `description` in plain English ("Choose one: gain 6 Temporary HP and move to the front, or
  remove 6 Lust."), fixing every defensive path's card text.
- **A tooltip taller than the screen shrinks to fit** (`honeycomb.tooltip.fitToViewport`, floor
  `tuning.ui.tooltipMinimumScale` 0.7), and — the actual bug — **a tooltip never covers its anchor**.
  `honeycomb.tooltip.placementFor` tries below/above/right/left and takes the first placement that
  overlaps the anchor not at all; the card preview avoids both the tooltip and the node. The earlier
  `fitToViewport` alone did not fix the mid-screen case (the panels were not taller than the screen).
  Block **[94]** asserts zero overlap across a position/size/viewport grid. Full post-mortem:
  `Archive/TOOLTIP-PLACEMENT-01.md`.
- **Outfit window (teambuilding + shop):** hovering an outfit shows the card it adds (the `card` tooltip
  kind, keyed to the signature); the row opens centred on the worn outfit and re-centres when one is
  clicked, clamped at the ends (`honeycomb.teambuilding.centerWornOutfit`).

**Then the content-fidelity pass, after Noodle pushed on "is it actually done".** The 7 stand-ins and
the ability table were replaced with the design; wiring-status's gap list is empty.

- **Cloud/Twist hit all enemies properly.** `targetMode` is now an in-place override, and
  `replaceEffectArray` resets the base so the rank curve is exact (rank1 2 dmg + 1 status, rank2 0 dmg
  + 2 status) with no primary-target double hit. **Acid** swaps Poison for Weak and lands the same way.
- **Turnabout** steals to the DISCARD at cost 2 (`stealIntent` gained `pile`/`cost`; `giveStolenCard`
  gained options). **Magic Trick's** stolen moves cost 1.
- **Full Control** chooses a damage card, upgrades it, and plays a copy on Severine — new
  `playChosenCardOnOwner` effect. **Reversal** strips the entity the swap actually sent back —
  `swapParty` gained `backEffectArray`.
- **The 0-damage type flip** is built: a `negativeIfZeroDamage` flag makes Wither/Acid/Hex/Twist read
  as pure `negative` at the rank their damage reaches 0 (rank 1 still deals damage, so it is not flipped).
- **The whole ability table was aligned to the node text** (the A1 *and* A2 for all six were older
  designs). `brienneAegis` now spends all Resolve for party tHP and ends the turn; `nettleBlight`
  applies Poison per Soul; `nettleGraveward` is **Undead Army** (spend all Souls, 1 damage per Soul);
  Severine's `severineSiphon` became **Blood Tap**; `severineQuicken` draws per lit orb;
  `cassadoraGlimpse` is once-per-rest; `cinderVault` became **Backflip**; `clemenceAbsolve` soothes/heals
  5 and takes only the Lust actually lost. New `mechanicOrbs` value and `endTurn` effect; the option
  chooser now receives the acting source, so a pay-the-meter option is hidden rather than no-oping.

Suite **1487 passed, 0 failed, 0 pending**.

---

## Status as of 2026-09-18 (session 28, THE SECOND PROGRESSION-FEEDBACK PASS)

Noodle's second chunk of progression feedback, all landed. Tests **1384 passed, 0 failed, 1 pending**;
`audit-trees.js` every hard rule passes (256 nodes; Cinder now 41).

- **Vulnerable is replaced by SUNDERED.** `honeycomb-content-statuses.js` `sundered`: intensity (never
  fades), `damageIncreasePerStack: 0.25` additive, so 4 stacks = ×2. Every content reference renamed
  (cards, enemy moves, Matriarch Bloom, the dark-alcove event, Ill Wish, Cassadora Hex, Overhead's
  `ifStatus`), plus the art filter and UI glyph. Lance Thrust self-applies **1** Sundered, Reckless says
  **2**. `statusDescription` reads `{damageIncreasePercent}` from `damageIncreasePerStack`. [50] asserts
  the no-decay/×2; [75] Overhead doubles on top of 1 Sundered.
- **Cinder gained her single defensive upgrade**, `cinDef2` **"Reversal"** (one non-exclusive node at
  DEF2's spot, no Exclusive D family). The generator's new `defSingle` mode drops DEF1/DEF3 and leaves
  Rest2 reachable through the kept node. See `NODES-LIST` §A3 / `STARTER-LIST` "Defensive upgrade".
- **Second Chance (Reroll1) is Standard cost** (300 → 150) in `COST`; `Reroll2` was already 150.
- **Lay of the Land names its rest function** via a generator `REST_NAME` table ("Unlocks Preptime at
  rest sites while Brienne is in the party."). **Journal is now Nettle's** rest function (was Laundry,
  which joins Gamble/Duplicate/Mail Order as unassigned). **Exercise** (the XP/"Training" option) stays
  Clemence's. Noodle to vibe-check the Journal owner.
- **Wider Shelves adds a relic slot too**, not just a card slot (`shopExtraSlots` now extends
  `relicSlotCount`); description says so. **Spoils** already worked as intuited — 1 copy = 4 card offers,
  2 copies = 5, on elite/boss fights only.
- **Second Chance, Always reworded**: "Adds 1 reroll to every run, whether or not this character is in
  the party." (no "stacks"/"upgrades" reading); Banish, Always matches.
- **One resource-count component**: `honeycomb.ui.resourceCounter` (icon + value, `.hcResourceCounter`)
  in the victory Reroll button, all three Banish buttons, and two new teambuilding footer chips.
  `honeycomb.teamResourcePreview` projects the value from the selection + benched "Always" tier.
- **Banish buttons are hidden below fallback cards** (`honeycomb.cardCanBeBanished`).
- **Cinder's `Drilled`** (its old "Vulnerable fades" premise is gone) now wires "move to the front: gain
  4 Temporary HP" through `onPartyShifted`.
- **ATT/DEF nodes preview the card they improve.** A generator `previewCardArray` names the basic; a
  node's `starterUpgradeArray` is applied to the preview and the loadout upgrade suppressed. Only forms
  with a delta show a mechanically-upgraded card; description-only forms show the base card (the rewrite
  verbs in `TREE-MECHANICS-TODO.md` are still the blocker). This surfaced a real bug — Brienne Gold/Bond
  granted the target the tHP/soothe instead of Brienne — now `targetOverride: "owner"`.
- **Node tooltips explain mechanic words.** `Soothe` and `Cleanse` joined `keywordArray`, keyword lookup
  falls through to `mechanicArray`, and `honeycomb.nodeKeywordArray` + the tree tooltip's keyword sidecar
  highlight and explain them (Set Stance now shows a Soothe panel).
- **Rerolls persist and can be refreshed.** `reroll`/`banish` carry `tracksMaximum`; `run.resourceMaximumArray`
  records the running grant total (any positive `addResource`), spending never lowers it, and the new rare
  **Mulligan Stone** refills rerolls on a new `onCombatEnd` hook. Block [91].
- **Party-scoped economy nodes say "While in the party, …".** Fortitude is correctly permanent (profile).
- **Cross-kind names are audited**: block **[92]** flags an unrelated node/card/outfit/ability sharing a
  name. Six unrelated node names were renamed (Catch Breath, Tainted Kiss, Pardon, Mortification, Blood
  Tax, Plunder) and the neutral "Second Wind" card became "Focused Mind"; "Take Their Burden" is the one
  allowlisted intentional pair.
- **Scry is a named keyword**: the effect prints "Scry N." and carries a keyword panel; block [88] checks
  it. **Tailored (U2) is single-rank** (no second rank can do anything).
- **Node text hygiene** (block **[93]**): no "her/she" or "this character" (names used instead), the
  party-scoped nodes all say "While in the party" (including the C.Ex chain, but not Studied Foe's
  permanent bestiary unlock), and Tailored has no rank. Added keywords **Scry, Energy, Soul, Intent, Junk**
  beside Soothe/Cleanse, with verb-ending matching (`exhausts`, `soothes`).
- **Steel** now says "while Brienne has Temporary HP" (was "while holding").
- **Outfit art gap fixed.** Session 25's `archivist` → `soothsayer` rename never reached the placeholder
  generator, so wearing Soothsayer 404d to the default portrait; **Cinder's `ashfall`** was missing too.
  Both folders are generated now (`--only characters`), and block [82] asserts every live outfit has a
  portrait on disk (legacy test fixtures are flagged and skipped). Read itself is fine: scry opens its
  choice through `attemptPlay`; it is only a no-op when the draw pile is empty (turn one of a tiny deck).
  An empty pile now logs a board message (**"Your draw pile is empty."**, `tuning.combat.scryEmptyText`)
  instead of silently doing nothing.

---

## Status as of 2026-09-18 (sessions 26–27, THE TREE OVERHAUL + THE WIRING/FEEDBACK PASS)

**Per-node truth for what does nothing yet is `rework/WIRING-STATUS.md` — read it before calling the
progression pass done. 54 of 256 nodes are still description-only (A2 for three characters, training
wheels, Exclusive D, Cinder's single *Reversal*, several Exclusive A paths, U2, two field-only C.Ex).**

The six progression trees were rebuilt structure-first. `rework/TREE-DESIGN.md` is the authoring spec;
`!designDocs/skeletons/wip.json` is the universal skeleton (shape only) and the generator
`generate-progression-trees.js` now reads it and fills per-character content, so a layout edit is one
skeleton file rather than six hand-built trees. `tree-skeleton.html` / `tree-maker.html` are the
offline layout tools. Tests: **1382 passed, 0 failed, 1 pending**.

Session 26 rebuilt the trees; session 27 reconciled the notes, wired the SHARED mechanics and most
C.Ex hooks, built the four stand-in verbs, the rest-site system, event/rest persistence, card banishing,
and the first round of node-text/UI feedback. The bullets below are both sessions' work.

- **The render mapping is fixed (session 26).** `progressionScreen.positionArray` used to min/max
  normalise BOTH axes, so every tree stretched to fill its box vertically. `x` now keeps a fixed
  `tuning.progression.treeView.depthStep` (18) and the canvas grows taller with depth; `y` is still
  spread across the column. A short tree is short. New tuning keys `maximumRowNodes` (4) and
  `minimumLaneGap` (12) exist for the auditor.
- **The skeleton is 43 nodes; Cinder is 40.** Cinder has no Exclusive D branch. The set: Vigour (ranked;
  Brienne ×6), Ability 1, Ability 2, Exclusive A (ATT ×1–3) and D (never ranked), training wheels W1–3,
  `+A/−A`, `+D/−D`, Replace Attack/Defence, the C.Ex.1→2→3 chain, Rest1/Rest2 + Rest-A/B, economy
  (XP, Collector, New Blood, Window Shopping, Reroll1/2, Banish1/2, Gold, OpenD/OpenE, Boun1/2,
  Shop1/2), U1/U2 and Fortitude. 30 are purchasable in one build after the exclusive cuts.
- **`audit-trees.js` is new (this session).** The file `TREE-DESIGN.md` named did not exist. It loads
  the engine headlessly like `card-inventory.js`, enforces the hard rules H1–H11 (duplicate ids, one
  root, prerequisites, reachability, no cycles, canvas bounds, name+description, card/ability/equipment
  references, cost, no shared `(x, y)`, lane gap) and prints the soft metrics S1–S9. Run
  `node "!designDocs/honeycomb/audit-trees.js"`; every hard rule passes, and the known softs are
  symmetry 2.7–3.1, 6 crossings (3 on Cinder), **0 long edges** (the old `Ability1`→`C.Ex.1` gap was
  closed in session 27) and Rest-A/B 3 rows from their join.
- **All SHARED node mechanics are wired and enforced in test block [87]** — deck edits, the economy set,
  OpenD/OpenE, Fortitude and Rest1/Rest2. PENDING: training-wheel removal only. **Six of the
  nine field-only C.Ex.3 hooks are now wired and tested** (this session): Brienne **Taunt** (first opposing
  hit drawn to her, via `tauntFilteredArray`), Nettle **Creeping Rot** (`partyShiftByCardType` on the node)
  and **Penny Pincher** (`shop.payoutOnExit`), Cassadora **Tidy** (first curse each combat marked
  exhausted) and **Investment** (unspent energy pays gold in `finishVictory`), Cinder **Recover** (heal on
  `checkRecovery`). Still field-only: **Studied Foe** (bestiary gating), **Drilled** (redundant; rewrite),
  **Soothing** (needs a rest heal attributed to the member so "Lust removed = HP gained" can be read).
  Wired as `hooks` but unasserted: Severine Challenger, Clemence Martyr/Comfort.
- **The four flagged engine gaps are built (this session).** `scry` (Cassadora Read is Scry 3, not draw 1;
  both places use the draw pile's top and a `limit`), `randomStatus` (Ill Wish rolls Weak-or-Vulnerable),
  the `healthFraction` value with `anyOf`/`allOf`/`conditional` (Finish doubles when the target OR
  Severine is below half), and `debuffCount` read source-relative (Recede). Block **[88]** holds all four.
  The `math` value's text now reads with `+`/`-`/`x`/`/` rather than operation words.
- **THE REST SITE IS A TABLE NOW (this session).** `honeycomb.restOptionArray` in
  `honeycomb-content-map.js` holds all eleven NODES-LIST §D options plus the campfire's base rows
  (Sleep, Sharpen, and Leave a card behind). `honeycomb.rest` in `honeycomb-progression.js`
  builds the campfire's menu at open time: base rows always, a character's own option when their Rest1
  is bought (while fielded) or Rest2 (even benched). Actions limit how many rows are taken; Rest-A adds
  one, Rest-B raises Sleep's heal. New verbs: `gainExperience`, `chooseAlly`, `transformChosenCard`,
  `exhaustJunkFromDeck`, `preptime` (spent once at the next `combat.begin`), `duplicateRunDeckCard`,
  `openShop` (doubled prices, handed to the shop overlay), `journalOffer` (writes
  `profile.journalCardArray`, which bends reward weights); plus the `tuning`, `partyField` and
  `partyFlag` values and the `starterOnly`/`nonStarterOnly` card filters.

  **Per-character rest function (to make each character's own rest row distinct):** Brienne → Preptime ·
  Nettle → Laundry · Severine → Treatment · Clemence → Exercise · Cassadora → Fortune Telling ·
  Cinder → Scavenge. Left unassigned for future characters: Gamble, Duplicate, Mail Order, Journal.
  Recorded in `rework/SKELETON-MAPPING.md` §5.

  **Debug tool: "Rest Lab (every rest option)"** in Debug Tools opens a campfire with every option
  unlocked and 100 actions; the override drops when the rest is left. Two more Debug Tools buttons grant
  **global** and **personal** experience (amount editable in the panel's Experience box), for walking a
  tree without a run's worth of play. The event panel's rendered choice count now comes from the same
  live list `renderChoice` reads — before the fix a rest drew only the campfire's static three rows.
  Block **[89]** holds the table, the unlock rules, the action budget and every option's effect.
- **Rest-site feedback round (Noodle).** Fixed, unless noted: the rest shows **Actions left**; Sleep's
  preview names the share AND the party's HP range; the broken-only **Tend** row and the campfire's
  broken variant are DELETED (`tendSoothe`/`tendHeal` tuning with them); Exercise/Scavenge/Preptime/
  Fortune Telling/Duplicate/Journal now log a gain the event panel draws (`resource`, `preptime`,
  `cardTransformed`, `deckCardAdded`, `journal` gain kinds); Gamble's choice was offering starters
  because `chooseCards` dropped the new `starterOnly`/`nonStarterOnly` filters — passed through; Treatment
  uses a real entity choice kind (`ally`) so it draws **portraits with health bars**; Laundry logs ONE
  `deckCursePurged` summary (tested at 30 curses) drawn as a single tile with the list in its tooltip;
  Journal is functional again (it fell dead when the profile had met every card; it now falls back to
  known cards and logs its pick); leaving the **Mail Order** shop returns to the campfire with actions
  left (`rest.pendingShopReturn`, `params.resumeActions`). **Duplicate stays UNASSIGNED** (too strong) —
  block [89] asserts no shipped Rest node names it.
- **Event/rest position SURVIVES A REFRESH (this session).** `honeycomb.eventState` keeps the live
  event's serializable position (event index, page, result line, lead line, and a rest's actions left)
  on `run.eventState`; the overlay writes and autosaves it after every action, and the node's `onEnter`
  reads it back, so the map's unfinished-node path reopens mid-event instead of restarting. Cleared when
  the event finishes. Block [89] round-trips it through a save.
- **More rest/round feedback (Noodle).** Treatment's preview names the rate and each ally portrait shows
  the HP it would gain (`previewFraction`); the ally picker is the same health-bar UI Sleep's group
  preview uses. Journal now offers **real cards** (new `cardOffer` choice kind), reads "1.5x more likely
  to appear in post-battle rewards", and **varies** its three (a per-rest `journalVisitCount` rotates the
  pool — the choice rewind was freezing the RNG, so it always showed the first cards, all Brienne's).
  Run-start random cards are now **rarity-weighted** with `tuning.reward.rarityWeightArray` (the old flat
  shuffle made rares far too common). **The Repertoire card is retired** (reserved for the Grifter); its
  status/archetype remain defined. The Laundry tile is the only name-list tooltip by design.
- **Progression-node feedback, part one (Noodle, session 27).** Ability 1/2 nodes now say what they
  unlock and that the character's mechanic begins there; a mechanic no longer ticks before A1
  (`honeycomb.mechanicActive`, gated on the new `mechanicArray[].abilityIndex`). Node descriptions name
  the character instead of "her", state concrete amounts, and `+A/+D/−A/−D/R.A/R.D` name the card they
  touch. The middle bough moved up one row, so the `Ability1 → C.Ex.1` long edge is gone (auditor: 0 long
  edges). Hovering an exclusive node draws the blocked branch **red**, not dimmed. Journal excludes cards
  the run already holds and shows the "X more likely to appear in post-battle rewards" line again.
  Deferred (recorded in `WIRING-STATUS.md`/`TREE-MECHANICS-TODO.md`): gate reward and shop OFFERS on A1
  for mechanic-reliant cards. `WIRING-STATUS.md` is the new per-node truth for what still does nothing.
- **CARD BANISHING (this session).** The `Purge1/2` nodes are now **Banish1/2**, granting a `banish` run
  resource seeded like rerolls (`rewardBanish`/`rewardBanishAlways`). Banish buttons sit under battle
  reward cards, shop card slots and the journal's offered cards; spending one records the card on
  `run.banishedCardArray`, which every offer pool filters (rewards, shop, journal, run-start random,
  random replace, transform) and which `addCardToRunDeck` — the one permanent-add door — respects.
  `fallbackCard` ("No Card", random frame, no cost) stands in when nothing legal can be offered and
  removes itself on add, so the deck size is unchanged; Debug Tools gained **"Banish every card"**.
  The old shop-removal discount is gone with the rename. Blocks [90], and the tooltip table gained
  `banish.button`.
- **The strip-defaults landed (this session).** Nettle's character `partyShiftByCardType` is gone, so
  `netCex1` owns both the attack and negative shift; all six `startingAbilityArray` are empty, so the
  Ability 1 node is the only source of A1; and `honeycomb.cardIsUpgradable` makes every upgrade service
  (rest and shop) refuse starter and outfit-signature cards. Block [87] asserts each directly. The
  Nettle/Cassadora 0-damage "forms" type flip stays blocked: those forms are node deltas, not card
  definitions, and there is no per-rank type override.
- **Notes reconciled (this session).** `TREE-MECHANICS-TODO` had listed the whole economy set as
  unbuilt; it now matches `TREE-MECHANICS-INVENTORY` and [87]. `TREE-EXP-MATH`'s denominator is 43
  (was written 41; the `+A/−A` and `+D/−D` families were missing). `TREE-DESIGN`'s stale tuning values
  (`depthStep` 9/70) and its "cost rises with depth" soft rule were corrected — cost follows value
  (`TREE-EXP-MATH` §4). Test count in `FEEDBACK-07` refreshed from 1271 to 1318.

---

## Status as of 2026-09-17 (session 25, THE STARTER PACKAGE BEGINS — the twelve basics are live)

Noodle greenlit implementation and answered the three open questions: **default + 3 outfits** (add
Cinder `ashfall`; swap Cassadora `archivist` → `soothsayer`), **random-common replacements draw from the
character's own commons**, and **Exclusive routes 2-3 and the outfit signatures are approved as
drafted**. `!designDocs` was reorganised first: completed docs moved to `honeycomb/reference/`, the
active package to `honeycomb/rework/`; tools, data and entry docs stay at the honeycomb root.

Landed this session (STARTER-REWORK-01 §1.2, first slice):

- **The twelve basic starters** exist in `honeycomb-content-cards.js`, and they INHERIT the names of
  the former starters they replace (Noodle, session 25). The index stays descriptive; only the printed
  name changes. The mapping (there was no written list; this is it):

  | Index | Name | Former starter it replaces |
  |---|---|---|
  | `brienneCleave` | Sword Strike | `brienneStrike` |
  | `brienneGrit` | Brace | `brienneGuard` |
  | `nettleVenomTouch` | Wither | `nettleWither` |
  | `nettleLastRites` | Last Rites | (none — new cleanse) |
  | `severineRend` | Claw Flurry | `severineFlurry` |
  | `severineQuaff` | Drain | `severineDrain` |
  | `clemenceTempt` | Tempt | (none — new lust attack) |
  | `clemenceGrant` | Offering | `clemenceOffering` |
  | `cassadoraWispBolt` | Wisplight | `cassadoraBolt` |
  | `cassadoraUnravel` | Second Thoughts | `cassadoraSecondThoughts` |
  | `cinderImpale` | Lance Thrust | `cinderThrust` |
  | `cinderSwitch` | Change Places | `cinderChangePlaces` |

  None carries an `upgradeArray` — starters cannot be upgraded, so a name never changes on upgrade.
- **The replaced starters were dispositioned (session 25)** — ledger in `rework/STARTER-DISPOSITION.md`.
  Session 20 had already graduated eleven to `common`; ten more were GRADUATED now (`nettleReap`,
  `severineArc`, `cassadoraFizzle`, `cassadoraTurncoat`, `cinderFallBack`, `cinderCharge`,
  `clemenceConfide`, `clemenceSoftWords` → common; `severineEnthrall`, `clemencePrayer` → rare), so they
  are offerable again instead of sitting unobtainable on `starter`. The five new basics took over their
  old holders' starter broken forms. The ten RETIRE rows (name reused by a new basic, or redundant:
  `brienneStrike`, `brienneGuard`, `nettleStrike`, `nettleWither`, `severineDrain`, `cassadoraBolt`,
  `cassadoraSecondThoughts`, `cinderThrust`, `cinderChangePlaces`, `clemenceOffering`) are still on
  `starter` and are DELETED with the tree rewrite + a test-fixture migration; five of them are also
  held by old content the tree rewrite removes (`brienneStrike` Duelist's Blade, `nettleMiasma` `netRot`,
  `severineBloodPact` `severinePact`, `cassadoraCrystalGaze` `casStill`, `clemenceOffering` `clmGrace`).
- **`swapParty` engine verb** (`honeycomb.swapEntities` in `honeycomb-entities.js`) added; Cinder's
  Change Places swaps with an ally and grants the front-most 4 tHP via `frontAlly`.
- **`clemenceTempt` uses the `lust` effect**, not `applyStatus` (there is no `lust` status).
- **Roster order and Cassadora's portrait (Noodle's bug report).** The roster rendered
  `profile.unlockedCharacterArray` in SAVE order, and `reconcileContent` APPENDS a character added after
  the profile was made — so Nettle and Cassadora sank to the bottom of any old profile. `buildRosterColumn`
  and `fillDefaultParty` (`honeycomb-scene-teambuilding.js`) now read `characterArray` order and filter by
  unlock, so the roster is the same for every save. The portrait was **not** a `skull` → `seer` leftover:
  `artFolder` is correctly `seer`. The `archivist` outfit added in session 20 was never added to
  `generate-placeholder-art.py`, so wearing it requested `characters/seer/archivist/0-portrait` and
  `/1-basic` (both 404) before the chain fell back, and the image's `alt` (her name) showed in the gap.
  `archivist` added to the generator's `seer` list and generated; verified in-browser: the portrait loads
  at chain position 0, no 404s.

- **Outfit signatures** for all six characters are authored and wired through `cardAdditionArray`; the
  dead `cardReplacementArray` swaps are gone. Brienne Plate Edge / Hold / Share the Plate; Nettle Pop /
  Spore / Kiss; Severine Finish / Cut / Gift; Clemence Blessed Pain / Edge / Quiet Mercy; Cassadora
  Read / Misdirect / Ill Wish; Cinder Rush / Gold Standard / Recede. Noodle's calls: Cassadora's
  `archivist` became `soothsayer`, and Cinder gained `ashfall`, so every character now has default + 3
  alts. Every new card has a `cardSfxMap` stem.

Suite: **1272 passed, 0 failed**. The old-design assertions (Severine's opening hand, Clemence's
"no standing card puts Lust on enemies", the 8/energy starter ceiling, the per-outfit swap check) were
updated to the new decks; Cinder's 9-damage Impale pays for the extra with self-Vulnerable.

- **Run-start random cards.** The default outfit declares `randomCardCount: 3`; `newRun` rolls three
  distinct offerable cards from the character's own pool (`rollStartingCardArray`, the `startingCard`
  stream) and stores them on the member, so a save/reload keeps the same cards. The teambuilding
  preview shows one coalesced "Random Card x3" row (`randomStartingCard`), replaced the moment the run
  begins. The stand-in uses the redesign's **grey Random supertype** (`type: "random"`,
  `tintFolderByType.random` -> the baked `cards/chrome/tint/random/`) with the question-mark icon
  (`icons/question-mark`, glyph `question`). Test [84].
- **Run-start random replacements.** A `randomReplaceArray` on a node or outfit declares which basic
  to swap and at what rarity; `newRun` resolves it into `member.randomReplaceArray`
  (`rollRandomReplaceArray`, test [85]), applied through the normal pool resolver. The **Replace
  Attack / Replace Defence** nodes are in all six trees.

Suite: **1281 passed, 0 failed**.

**Flagged engine gaps** (a verb is needed before these read as designed): `scry` (Cassadora Read
stands in as draw 1), a random Weak-or-Vulnerable picker (Hedge Witch; Ill Wish stands in), a
target-health-fraction value for Finish's +10, and a source-relative debuff count for Recede's +3.
- **DEFERRED — the broken-card overhaul.** Noodle's note (`Archive/FEEDBACK-07-DONE.md:450`): a
  **starter** broken form should carry a **penalty if left unplayed** — "essentially serving as a tax."
  Session 20 added 15 broken forms but not that behaviour, so the tax is unbuilt. Revisit after the
  trees.
- **Tree-system features (session 25):** a node that grants or swaps in a card shows that card at
  **large size in its own panel** under the node text tooltip (`showCardPreview` + `#honeycombTreeCardPreview`;
  it flips above the tooltip when there is no room below). It is NOT embedded in the text tooltip — a
  small card prints only its name, which read as a blank stub. A node in an exclusive group draws a
  **red X** (`.hcTreeNodeCross`) revealed **on hover over a rival**, before the choice is taken
  (`showExclusionPreview`). Both are the player-requested items in `rework/PROGRESSION-LIST.md` §2.
- **CORRECTION (Noodle), seam BUILT:** Exclusive A/D **upgrade the starter card IN PLACE**, not a swap to
  a variant. A node's `starterUpgradeArray` carries per-rank deltas (`{card, effect, status, amount,
  stacks}`) and/or `addEffectArray` lines, which merge by verb+status and SUM across ranks (three ranks
  of "+2 tHP" read as one "+6 tHP"). `resolveCard` applies them for a live owner; `ui.card` applies them
  for a preview from the character's loadout, so combat, card text and the card face agree. Test [86].
  First real node: Nettle `netWither` (ranked ×2, -2 damage / +1 Poison on `nettleVenomTouch`).
- **THE SIX TREES ARE GENERATED (session 25).** `!designDocs/honeycomb/generate-progression-trees.js`
  grows a connected graph from a seed over a role order (root → ability 1 → economy → exclusive A/D →
  ability 2 capstone → training wheels, the capstone joining two frontier parents) and bends it with a
  per-character shape archetype: knight **wall**, necro **root**, vamp **orbit**, priest **spiral**,
  lancer **ladder**, seer **constellation**. The old hand-built nodes are gone; the generated trees pass
  the soundness check. Rerun the generator to rebuild (it is the source of truth), or `--report` to see
  the shapes without writing.
- **Test migration partly done:** progression block [24] is repointed at `briVigour` / `briAbility1` /
  `briAggGold`, `briStart` → `briVigour` file-wide, and the legacy outfit fixtures no longer lock or
  require retired indices. A handful of later assertions and one crash still name retired nodes
  (`briGuard` / `briEdge` / `briThorns` / `briWall` / `briParagon`) — the migration tail, to finish in
  the content/polish pass.
- **Progression topology draft 2** in `rework/PROGRESSION-LIST.md`. Noodle's decisions: three boughs;
  a real tree (Brienne's current shape as reference, between a skill tree and FFX's sphere grid), not
  parallel lanes; exclusive forks **1–2 nodes after the join**; order is early root/Vigour/Ability 1,
  then economy/Replace, Exclusive A/D **late**, **Ability 2 near the end**, **training-wheel removal
  last**; **ranked nodes** for ranked families; **respec allowed**. One question left (where the
  nonexclusive economy set lives). Edges draw from `requiresArray`.
- **Teambuilding UI fixes (session 25):** a benched character's outfit change now writes their
  remembered loadout instead of force-adding them to the party (which silently failed on a full party);
  the roster and detail class line print the **worn outfit** (`outfitDisplayName`), with the default
  outfit showing the **class name**; and the random preview no longer wears the `hcUnplayable` hatch.
- **Preview card ownership (session 25 workaround):** a card with no fielded owner (a reward, a shop
  shelf, a deck listing, a tooltip) now draws its class glyph from the character the card names, and the
  owner ring draws that character's **face** (`hcCardOwnerFace`). A `previewCharacterIndex` threads the
  character through `ui.card`, so the **random starting card** (which names nobody) wears the member's
  class glyph and face in the teambuilding list. Full card-ownership is a later overhaul.
- The random preview stand-in no longer wears the `hcUnplayable` hatch (`honeycomb-ui.js`, null cost +
  `type != "random"`).

**Next in the package:** implement the agreed progression topology (mandatory A1/A2 nodes and gating,
the Exclusive A/D families, training wheels, +Agg/−Agg, +Def/−Def, the nonexclusive set), the
starter-upgrade ban, and the relic pass.

---

## Status as of 2026-09-16 (session 24, STARTER-REWORK-01 audited — no pool changes)

Noodle: the previous session treated DeepSeek's work order as the brief, second-guessed §1.2, and
was reverted. This session **did not touch the pool.** `STARTER-REWORK-01.md` parts 3–6 were
replaced: the twelve basics and the example finals stand; the "12 maxed forms" math is wrong (3
exclusive routes per character for aggressive **and** for defensive); Tithe/Blood Pact/Confide are
not relics; Wither/Enthrall/Crimson Arc must not be blindly graduated; Clemence Lust-from-turn-1,
Grant, Cinder's self-Vulnerable slash, Nettle's cleanse, and the same Act 1 HP all stand. Outline
begun in part 5. Three questions left (default+3 outfits, random-common pool, routes 2–3 / outfit
cards not in §1.2). **No content, no engine, no sim until that outline is agreed.**

---

## Status as of 2026-09-15 (session 23, Brienne card-art prompts rewritten)

Noodle: the session-21 table-derived pass made every Brienne card the same blessing-in-a-mushroom-cave. **Brienne's 23 draftable cards are now hand-authored** in `card-prompts.js` `OVERRIDE` (`prompt` + `glance`); `CARD-PROMPTS-01.md` regenerated. Camera first so the engine crops; one silhouette per card for hand-size; gold = Temporary HP, pink = lust, forge orange = plate; sneaky lewd on SFW, very lewd on Steady / Shelter / Alms. Compiled through the webui engine: identity + default outfit land, no `simple background` cull. Other characters untouched. Horizontal → `Landscape`, vertical → `Portrait`.

---

## Status as of 2026-09-15 (session 22, the re-test: session 21's claims held to a browser)

Session 21 made wide changes and tested almost none of them. Noodle: *"Given the lack of testing and how
egregious that mistake was, I was hoping you could do a much more thorough and careful pass making sure
changes actually work and fixing what was broken."* Every claim was **reproduced or disproved in a
running browser** before anything was touched. **1259 tests, 0 failed**; new blocks are [81] (sound
measured rather than named, and the barrage pace) and [82] (every named image is a file that exists).
Item by item in **`FEEDBACK-07.md` § D2**.

**The one cause behind most of it: session 21 assigned sounds by reading filenames.** Measured, the
library spans 0.2–11.9 seconds of audible sound and 22.7 dB of loudness, so a filename cannot say
whether a file fits its moment. `miscWind` is 11.9 seconds of ambient wind — which is how it reached the
card draw, and it was **still on five of Cinder's cards** at the start of this session.

- **Sound is measured now.** `tuning.audio` gained `momentArray` (how long a sound may run at the moment
  it plays), `eventMomentMap`, `stemFamilyArray` (what a stem claims, so an assignment can be checked
  against what a card DOES), `leadInMsMap` and a generated `fileVolumeScaleMap`. New tools:
  **`sfx-report.js`** (the audit the tuning comments always claimed to be filled from — 0 findings),
  **`sfx-report.html`** (the browser bench that re-measures into `sfx-metrics.json`), and
  **`sfx-durations.js`** (MPEG frame headers, so the test suite can check without a decoder).
  17 assignments were too long for their moment, 4 disagreed with what the card did, and the volume
  table was empty while `platform.sound` did not even apply it. All fixed; test [81] holds them.
- **`damageDealt` is gone.** A blanket `weaponClang` fired 6ms after every card's own sound, once per
  hit — Nettle's necrotic touch clanged. `damageTypeSoundMap` now speaks only for damage with **no card
  behind it** (poison, thorns, a riposte); a card's hit is carried by the card's own sound.
- **Movement and arrivals have their own events.** `playPartyShift` and both summon beats borrowed
  `nodeEnter`, which is 4 seconds of footsteps on wood, so every shifting card started them.
- **Poison's barrage is real now.** The 90ms tick was followed by a full 320ms status pulse for the
  stack decay, so it measured **~410ms an enemy**. A log entry may name a `pace`
  (`tuning.animation.beatPaceMsMap`); poison's decay and Intoxicated's lust ride the barrage for free.
  Re-measured at **~110ms**.
- **The broken stinger was ~70ms late.** Sampling the snapped chain's opacity every frame put the swap
  at 1062–1078ms and the timer at 998 — but `!broken.mp3` opens with 160ms of silence.
  `stingerSnapFraction` now aims at the measured swap and `platform.soundLeadInMs` subtracts each file's
  lead-in, so it is the SOUND that lands on the snap. Onset re-measured at 1074ms.
- **Reduced effects was breaking the phone.** It is auto-ON for any coarse pointer, and session 21 made
  it drop the **card-frame tint** — a card's only at-a-glance TYPE signal — while still drawing one
  frame image per type. It now draws ONE frame tinted by the PRIMARY type: colour kept, layers dropped.
- **The loading screen is deleted** (Noodle's call, on the measurement): it warmed 112 images / 4.8 MB,
  was gated to 3G-class connections where that is ~95 seconds, and gave up after 6. The non-blocking
  background warm stays. Measuring it also found **three images the warm asked for that do not exist** —
  `severineBroken` had named `cards/art/severine-rake` since session 19. Test [82] closes that door.
- **The card rarity gem is deleted** (Noodle: *"Delete it. We'll experiment with things like
  differently-colored frames later"*). `cardRarityArray` stays; the offer rates read it.
- **Cinder: two cards, not three.** Session 21 acted on an item explicitly ⏸ waiting, renamed Pull Back
  to "Withdraw" and gated it. Both reverted. **Change Places** and **Point of the Spear** keep the
  `wouldShift` gate; Noodle confirmed those are the only two.
- **`card-effects-preview.html` checks itself.** The ribbon and the text panel overlapped by 46px and
  printed over one another; the text had nothing to stop it spilling; one filter card rendered blank. All
  fixed, every card length is now a share of the card's width, and a live readout names any overlap (with
  the percentage that fixes it) or overflow (in lines).
- **Telemetry: researched, nothing built** (Noodle's call) → **`TELEMETRY-01.md`**. Collection IS
  possible from neocities and itch, but never BY them: both are static and cannot receive a POST, so it
  needs a third-party endpoint. One beacon per run end, not per card event, keeps it inside a free tier.
  **Waiting on Noodle to pick an endpoint.**
- **The Compendium works.** All three tabs render and switch. The likely cause of what Noodle saw is a
  cached `honeycomb.css` — it is linked with no cache-busting query.

**Still open in FEEDBACK-07:** the telemetry endpoint, a short movement stem for the sound library (the
one real gap — five Cinder cards stand in with `miscCreak`), four sound files too quiet at source, the
phone re-test, the remaining performance levers, Nettle's missing draftable cross-party card (Severine's
half of that note was stale), broken art per outfit, progression ability nodes, and the rest of A.

---

## Status as of 2026-09-15 (session 21, the round-07 sweep: every sorted F report worked)

One long session against `FEEDBACK-07`'s open items. **1242 tests, 0 failed** (the count moved when the
session-20 simulation pass filled the one card missing from the explicit sound table, `hexBefuddled`);
new blocks are [78] telemetry, [79] the sound library, [80] the poison barrage and its maths.
Highlights, grouped:

- **Poison is a BARRAGE now** (D3). It ticks through a new `onTeamTurnEnd` hook: the end of the player's
  turn ticks every poisoned ENEMY at once (the enemy turn ticks the party), each as its own damage log
  entry, played rapid-fire (`tuning.animation.poisonTickMs` = 90ms). Intoxicated moved with it. The
  halving Noodle asked to be measured is implemented as `poison.decayMode: "decrement" | "halve"`; the
  shipped value is still `decrement`, and test [80] prints the nerf curve (3 stacks 6→4, 6 stacks 21→10,
  10 stacks 55→18) so the toggle is his call.
- **Audio**: Honeycomb's own `honeycomb sound/sfx/` library is played directly by `platform.playFile`
  (`tuning.audio.fileMap`, host-stem fallback in `eventMap`), the five `!` stingers are wired to the
  broken cut-in, the Exposed cut-in, outfit changes, battle victory and run victory, and a
  `cardSoundRuleArray` assigns 19 finer card sounds by name / tags / archetype / effects, with a card's
  own `sfx` as the override. Test [79] holds every file to disk and every rule to a mapped event.
  *(Session 22: assigning by NAME is what went wrong. The rules are gone, every assignment is measured
  against its moment, and `sfx-report.js` audits the table. See the session-22 block above.)*
- **The Exposed cut-in** (D0/D2) is named — `ui/exposed/exposedText` — and its art is now per outfit
  (`honeycomb.art.exposedChain`, `characters/<folder>/<outfit>/exposed`, generated by
  `generate-placeholder-art.py`; `--only characters` writes the art, `--only exposed` the title). The
  too-high image is the broken layer's 0.85 scale now.
- **The Compendium is three subpages** (D2): Overview / Cards / Bestiary, with a broken-forms toggle on
  Cards and a bestiary that lists every enemy with its stats and whole move set (the move grid is shared
  with the in-combat window through `honeycomb.enemyMoves.moveGridMarkup`).
- **Presentation**: card rarity is a gem on every card (`cardRarityArray` + `ui.cardRarity`) *(session 22:
  the gem is deleted; the table stays)*, enemy names
  sit at their feet inside the fighter frame, statuses carry a positive/negative marker and tooltip
  descriptor (`honeycomb.statusPolarity`, neutral says nothing), the broken-form card wears a rose rim
  and a compositor sheen (`hcCardBroken`), and the mobile hand-lifter arrow is replaced by a once-per-
  profile swipe hint (`profile.swipeHintSeen`).
- **Rules**: enemy COUNT scaling is gone (`scaling.extraEnemyCount` deleted; a debug six-slot party meets
  the same line-up), lust weakness ranks sit at thirds (13 / 27 / 40 of the rail), Weak and Vulnerable
  print their real percentages (`honeycomb.statusDescription`), and the Broken keyword no longer claims
  "their single broken card".
- **C**: the blocking **loading screen** exists (`honeycomb.preload.screen`: progress, minimum show, maximum
  wait, press-to-skip); reduced effects now also drops card-frame tints; `will-change` hints were added to
  fighter sprites and floating numbers.
  *(Session 22: the loading screen is DELETED and the tint drop is REVERSED — both were measured and both
  were wrong. See the session-22 block above.)*
- **New tooling**: `!designDocs/honeycomb/card-effects-preview.html` (the new frame composer, broken-look
  candidates and an SVG filter lab) and `card-prompts.js` → `CARD-PROMPTS-01.md` (a webui-ready card art
  prompt per draftable card).
- **Docs/telemetry**: `honeycomb.telemetry` counts offers / takes / skips / deck additions per card
  (Debug Tools → Card report copies a TSV; no uploader, neocities-safe). Outfit descriptions lost their
  card-category sentences and gained feel.

**Still open in FEEDBACK-07:** Cinder's ally-move wording (Noodle reads the cards), the phone re-test of
session 15's fixes, the remaining heavy performance levers (3, 4, 5, 8, 9, 11, 12 in C), broken art per
outfit (needs outfit art), Nettle/Severine's cross-party leftovers, progression ability nodes, and the
rest of A (unlock distribution, OSTs, VFX). Everything else in F landed.

---

## Status as of 2026-09-15 (session 20, the balance pass: card pool reworked AND audited)

Read **`MECHANICS-02.md`** (design/work log) and **`CARD-AUDIT-01.md`** (every card rated on I / S_v /
S_h / C and on Starting / Accelerate / Payoff / Late-game fit, with 13 fives each justified). The
first pass collapsed card ranks to Starter/Common/Rare, thinned Nettle's poison (measured 2.06
Poison/energy, was ~2.63), gave Clemence tHP tools + burst broken forms + the **Penance** lust tag,
and gave Cassadora the **Repertoire** archetype. The second pass *corrected the direction*: Severine's
healing is restored (the runaway was Bloody Verdict's per-debuff drain with Nettle, now re-designed as a
bounded missing-health finisher) and her **life prices were raised** instead (Blood Pact 7, Bloodlet
7, Transfusion 8, Heartsblood 9); ten cards were **replaced rather than smoothed** (Hold the Line →
Stand Fast, Rally, Soul Harvest, Pandemic, Heady Spores, Gorge, Understudy, Encore, Turn the Line,
Shelter); a scripted-edit corruption that merged **Yearning** into **Confession** was repaired; a
lying Wasting text was fixed. A new tool, `card-inventory.js`, prints the whole pool for future
passes. **1216 tests; [77] is the measured balance report.** A third pass built a full draft simulation
(`draft-simulation.js`, `draft-sim-compare.js`) with per-card strength, a pairwise synergy matrix, the
three personalities, five tuning configurations and 4000 simulated players; the answers and the cut
report are **`DRAFT-SIM-01.md`**. Noodle then asked for the starter/progression/outfit rework to be
handed to the next agent: that brief is **`STARTER-REWORK-01.md`** (nine open questions, all current
starters dispositioned, the tests that will break listed). Open: the outfit-description vagueness pass,
the progression ability nodes (MECHANICS-02 parts 12–13), and the decision on whether to act on the
simulation's Tier A/B cut list or wait for a run-length model.

## Status as of 2026-09-14 (session 19, the art pass begins: Vex renamed, card fit measured headlessly)

Started the art-pass pipeline (`art_pipeline/CATCH-UP.md`). Two engine-side changes came out of it.
**1205 tests; [76] is this work.**

- **Vex is now SEVERINE, index included** (Noodle: placeholder name, and League of Legends' Vex is popular in
  the community). Every Honeycomb file, `vex`/`Vex`/`VEX` → `severine`/`Severine`/`SEVERINE`, and the card art
  `cards/art/vex-*.webp` → `severine-*.webp`. The webui engine's own League of Legends Vex is untouched. **Save
  format 7** rewrites the old name in every string AND object key of a save, as a whole word or camelCase prefix
  only (`convexLens` survives). The art folder is still `vamp`.
- **CARD FIT IS MEASURED FROM FONT WIDTHS, WITH NO BROWSER.** Noodle: "Judging card length should not be a
  manual task, we should be able to compare font width with a known working card at all three sizes and add it
  to the audit." `generate-font-metrics.js` reads each glyph's advance width out of `norwester.otf` and
  `railway.otf` into the generated `honeycomb-font-metrics.js` (loads before the warnings). The new warning
  rule **`cardFit`** measures every form of every card at small / medium / large: the name (wrapped or not),
  the supertype line, the small card's type icons, and the rules text (greedy word wrap, keyword letters
  synthesised bold). Each is a FILL of its box, and the boxes are copied into `tuning.warnings.cardFit`, which
  test [76] holds to `honeycomb.css`. The budget is the larger of the box (1) and a known working
  `referenceArray` card's measured fill. **`referenceArray` is empty until Noodle confirms a card.**
  `honeycomb.cardLineFit` moved beside `cardText` so the rule and the card face share it.
- **It reports two cards today**: `juggernautRoar` (1.082) and `clemenceSanctify` (1.012), both rules text at
  4 lines. Whether they really spill depends on how wide the browser draws synthetic bold (keywords):
  `syntheticBoldExtraEm` 0.08 is a Firefox estimate, and Chrome does not widen at all. **That one number is what a
  known working reference calibrates.**
- `audit-card-fit.js` (the DOM audit) stays as the ground truth for picking a reference; it is no longer the
  per-change check.

## Status as of 2026-09-14 (session 18, map panning, and the Juggernaut's identity)

Noodle: the map needs to be draggable / wheel-scrollable; the boss node covers its label; the Juggernaut
needs an identity; rework Avalanche into thrown cards. Follow-ups the same session tuned his kit.
**1194 tests; [75] is this work.**

- **The map is pan-able by hand** (`honeycomb.map.installScrollInput`): a mouse wheel pans it sideways
  (the map's only free axis once a floor runs long) and a mouse press-drag pans it. **The pointer is never
  captured on press** -- capturing retargeted the click away from the node under it and made nodes
  unclickable. A drag is only a drag once it moves past a few pixels, and touch is left to native scrolling.
- **A one-click Juggernaut test** is in the debug panel: "Fight the Juggernaut" starts/resumes a run,
  drops into the second boss, and fills the charging bar. It does not force the opening move; the boss's
  own `openingMove` rule supplies Avalanche, so the tool exercises the real path.
- **Anchored map labels no longer sit under their node.** The generator paints the landmark name at
  `py + radius * 1.75` now, clear of the boss diamond, which reaches about 1.6× the radius below its
  anchor. `--only maps` rebuilds the paintings.
- **The Juggernaut always OPENS with Avalanche.** A new `openingMove` field on the enemy definition is
  taken by `honeycomb.selectMove` on the fight's first telegraph, whatever the charging bar says.
- **His identity is POSITION and VULNERABLE.** Crush, Hurl Debris and Backhand each lay **3 Vulnerable**;
  **Log Sweep** is the exception, applying **3 Weak to the FRONT only** (`targetOverride`) rather than the
  whole line it damages. **Backhand** carries hand-written text saying the Vulnerable lands after the
  shove. His companion cleanses: **Whistle** (self cleanse + Temporary HP). The new **`cleanse`** effect
  strips every debuff and only debuffs. **Overhead Smash** replaced Rallying Pipe: it hits the front for
  12 and **doubles against an already-Vulnerable target without applying anything itself**, via the new
  **`ifStatus`** value verb (a telegraph binds no target, so it prints the base figure).
- **Avalanche is now a card-expansion**, manually typed as a **damage** card (`typeArray`). It hurls
  **3 random things from a pool of 9**, each at a random party member; most hurt, one heals, and one
  (**Tarnished Locket**) is **once-ever** and pays a common relic the first time it is ever thrown. The new
  **`throwRandomCards`** verb picks the cards without replacement, logs each as a `moveUsed` so the replay
  reveals it, and resolves it against its own random target. A card marked `onceEver` records itself in
  `profile.onceEverArray` and is dropped from the pool for good. **The locket is exclusive to the
  encounter**: only Avalanche's pool names it, `rarity: "enemy"` keeps it out of every reward and shop, and
  nothing else in the content tables grants it (test [75]). This is the seam for a move that becomes
  several moves, built to be reused.

## Status as of 2026-09-14 (session 17, longer floors, a scrolling map, elite prizes)

Noodle: the run was too short to build an engine, so the floors doubled; elite fights should pay rare
cards and a relic; add three generic relics. **1175 tests; [74] is this work.**

- **Floors doubled.** `upperCatacombs.rowCount` 9 → 18. The anchored Flooded Vault's backdrops became
  **2880×900 panoramas** with their anchor sets roughly doubled (causeway 26, stair 22, showcase 21) and
  their edges derived by proximity. `generate-placeholder-art.py --only maps` rebuilds them.
- **The map scrolls sideways.** The SVG's height is fixed and its WIDTH follows the content
  (`layoutTuning.baseHeight` + `referenceRowCount`): a longer floor is a wider map at the same node
  spacing, not a denser one. `.hcMapViewport` scrolls, `.hcMapCanvas` is the shared rectangle, and the
  scene centres the party's node on open (`scrollCurrentIntoView`).
- **The anchored offset bug is fixed.** It was two rectangles: the node stage was inset past the party
  rail while the backdrop filled the whole body, so every node sat half the inset to the right of its
  landmark. Both now draw on `.hcMapCanvas`, and an anchored painting is `object-fit: fill` so a
  percentage over the painting and a percentage over the graph are the same point.
- **Elite prizes (session 17).** `rollCardReward` weights an elite's spread with
  `tuning.reward.eliteRarityWeightArray` (common 30 / uncommon 40 / rare 30 against the ordinary
  60/30/10). `combat.rollRewardRelic` is new: an elite and a boss ALWAYS pay a random common-pool relic,
  an ordinary fight pays one at `tuning.reward.relicChance`. **`relicChance`/`bossRelicChance` had been
  dead tuning; they are wired now**, and a Lust Battle opts out with `battleRewardArray.relics: false`.
  The victory screen shows the relic beside the gold.
- **Three generic relics** (`honeycomb-content-characters.js`), no character and no `offerCondition` so
  any party can find them: **Wardstone** (temporary HP gained +2), **Traveler's Lantern** (draw 1 more at
  combat start) and **Pilgrim's Bell** (an enemy beaten heals the most hurt ally 4).

## Status as of 2026-09-14 (session 16, the second boss and the rest of the drawn roster)

A short detour from FEEDBACK-07 to spend the unused enemy art, per Noodle's A-list goal "more enemies and
a second boss". **1163 tests; [73] is this work.** Everything is content plus two small engine changes; no
host code moved.

- **The unused drawings are all fielded now.** `_source/enemies/` held six unmapped drawings; every one is
  now an enemy in `honeycomb-content-enemies.js` (mapped in the generator's `ENEMY_SOURCES`, placeholders
  rebuilt with `--only enemies`): **Spore Gardener** (`gardener`, support that mulches and sows),
  **Fungal Sage** (`sage`, attrition / deck friction), **Spore Alchemist** (`alchemist`, area chip damage),
  **Bark Sentinel** (`shield`, an armored wall with tHP, thorns and retort), and **Kobold Scavenger**
  (`scavenger`). The old `gardener`/`sage` "drawn but unfielded" note in the ART-GUIDE is gone.
- **The scavenger is the first ELITE encounter.** Encounters gained `isElite`; `rollEncounter(tier, {elite})`
  keeps the elite pool separate from the ordinary one, and `fillNodeContents` hands an elite node the elite
  pool. **`elite` was finally added to `tuning.map.nodeWeightArray`** — the node type had existed since
  round 02 but was never placed, so the pool had no way onto a map — gated to the middle stretch by
  `tuning.map.eliteEarliestDepthFraction` so an early elite cannot be a run-ender. Encounter groups:
  `scavengerAlone` (middle), `scavengerCache` (late, with a sentinel).
- **A run meets BOTH bosses and neither twice.** The two floors are `regionArray`'s two regions, and
  clearing the last one wins the run (`moreToCome` in overlays-map). So `upperCatacombs` ends at
  `matriarchLair` and `floodedVault` ends at the new `juggernautHollow`. A duplicated `bossEncounterIndex`
  was the old arrangement.
- **The Juggernaut is mechanically the Matriarch's opposite.** She owns **summons and lust**; he owns
  **position**. His log reaches the whole line (`allEnemies`), his Hurled Debris reaches the back
  (`backEnemy`), and Backhand shoves the front fighter to the back (`shiftParty`). He keeps the same
  charging bar (`chargeCost` on Uproot / Bellow / Avalanche, `threshold` phases at 50%), and he plays the
  `!!BROKEN!!` cut-in from a generated stand-in. Test [73] holds the two kits apart.
- **Act 1 roster, one exception.** Gardener, sage, alchemist, sentinel and the Juggernaut are all ordinary
  Act 1 enemies; only the SCAVENGER is an Act 2 import, and his Act 2 origin is flavour for why a kobold
  with a bomb satchel is down here. The demo is Act 1 only. Encounters are still gated by depth TIER, not
  by region, so he can appear on either floor; region-gating encounters is the obvious next step if that
  ever matters.

## Status as of 2026-09-14 (session 14, FEEDBACK-07 priority order B → D → C)

Worked the carried-over round-06 issues (FEEDBACK-07 section B), then the round-07 bug reports (D), then
the performance list (C). **1130 tests.** Everything is annotated in `FEEDBACK-07.md`, item by item;
this is the one-screen summary.

- **B1, all five.** A played enemy move now marks its telegraph SPENT (`entity.intentSpent`), so a
  mid-turn repaint -- the Matriarch's Brood -- no longer redraws the card just cast. The broken spiral is
  INSTANT (`tuning.lust.brokenEscalationInstant`). A broken fighter's shatter reads LUST now
  (`vitalsShareArray.lustOverfull`), recoloured pink, with the gold tHP overflow suppressed. Hovering a
  party member at rest steps them forward. A once-per-fight HALF-HEALTH CUT-IN (`honeycomb
  .halfHealthOverlay` + `honeycomb.checkHalfHealthCutIn`) shows their hurt-tier art.
- **B2.** The Carapace tHP double was the forecast's pending gold being added to the landed gold; it now
  shrinks as it lands, and a forecast gain never shatters. Random lust spreads as a might, so Beguile
  alone marks every candidate. Vertical cards carry a text wash. Tooltips print a debug key.
- **B3.** Details sections fold; the Weaknesses title pulses while folded with news. Severine's orbs are
  three separate buff slots.
- **D0.** Campfire/victory pickers are medium. Severine's Transfusion uses the new `allyOther` mode. Adjacent
  intent cards stagger. Ability rows print their requirements. Reward offers no longer show broken cards.
  Rank cap confirmed. **Cinder's ally-move wording waits on Noodle's pick.**
- **D1.** New `orphanStatus` warning rule. `tuning.art.enemySpriteScale`. Party ceiling 3 (six behind the
  debug `allowLargeParty`). Debug panel: Open the shop, six-slot party; Debug Tools moved up the title
  menu. Hand cap 10 confirmed. Broken outfit art and the Syrup Town title button wait (art / sign-off).
- **C.** Both named fixes: `honeycomb.preload.warmCommon()` background image warm at boot (plus
  `decoding="async"`), and `tuning.animation.overlapEnemyCardRead` plays the enemy pose and hit under
  the card read. A blocking loading screen is the remaining half.
- **C, follow-up on a phone stutter report.** A performance monitor (`honeycomb.perf`, toggled from the
  debug panel) and `audit-turn-time.js` measure frame intervals, long tasks, each replay's expected vs
  actual, and the per-move drag cost. The preload was made GENTLE (batched, skipped on slow/metered
  connections) and the drag reticle moves on `transform` instead of `left`/`top`. Hover-forward is now
  gated behind `@media (hover: hover) and (pointer: fine)`, so a touchscreen's stuck fake hover cannot
  step a fighter forward under a dragging finger.
- **The phone's own numbers (Noodle).** `frames avg 21.3ms, worst 275ms, dropped 309 | long tasks 5 |
  replay overrun 82ms | drag avg 1.30ms`. Five long tasks with 309 drops means the main thread is fine
  and the PAINT is the bottleneck. So: the monitor now splits drops by **drag / replay / idle**, the
  preload warms each fighter's hurt tier and the default VFX, and a **reduced-effects path**
  (`hcReducedEffects`, tuning `performance.reducedEffects`, auto-on for touch/low-memory, forced from the
  debug panel's **Toggle reduced effects**) drops the mobile-heavy paint -- overlay `backdrop-filter`,
  the blurred backdrop fill, fighter `filter` transitions, the held card's double drop-shadow, and the
  arrow's dash animation. This is the first thing to A/B on the phone.
- **The second phone report: IDLE dominated** (`dropped 561 (drag 148, replay 135, idle 278)`). The
  ambient cost is the nameplate's INFINITE `filter`/`opacity` pulses (`.hcPlateTemporary`, `.hcPlateLust`,
  `.hcPlateLoss`, `.hcPlatePotential`, the pending/recovering/heal segments, the shatter chips, the
  medallion glow): a filter animation repaints every frame, so a full board re-composites continuously.
  Reduced effects sets all of them to `animation: none`. The monitor also reports the frame COUNT and drop
  RATE now, and the debug state row shows `reduced effects` and `perf monitor` so the toggles are not a
  guess.

- **Session 15, the third phone report (still idle, reduced effects on).** Measured on a still board: no
  CSS animation ran, but `ui.advanceBolts` (the plate lightning) repainted every 90ms. It is now a baked
  compositor-only CSS loop (`ui.ensureBoltKeyframes`). Reduced effects also drops the fighter art's
  blurred drop-shadows (art states gained `reducedFilter`). The drag reticle's wobble was `scale` applied
  outside a `transform` position; it moves on `translate` now. The monitor reports the display CADENCE, so
  a 30Hz battery-saver cap can be told from real drops. 1140 tests.
  **Later in session 15:** a code review of session 14 (no bugs; see `Archive/FEEDBACK-07-DONE.md`),
  FEEDBACK-07 split into open items plus that archive, the **Unlock all content** debug action, a hidden
  Honeycomb launcher on the Syrup Town title (REQUIREMENTS §4b), **downsampled card frames** per card size
  (`-small`/`-medium`/`-large`; rerun `generate-placeholder-art.py --only frames` after any frame change),
  and the **tooltip text table** (`honeycomb-text-tooltips.js`, test [72]). 1149 tests.

**A NEW TOOLTIP SENTENCE GOES IN `honeycomb-text-tooltips.js`, NEVER INLINE (session 15).** Write
`honeycomb.tooltip.html("kind.part", {tokens})` in the render function and add the entry; test [72] fails on
a key the table lacks and on an entry nothing uses. A key built from a prefix at run time must be added to
that test's `dynamicPrefixArray`.

**A PULSE ON `scale` NEEDS ITS POSITION ON `translate`, NEVER `transform` (session 15).** The individual
`scale` property is applied inside `translate` but outside `transform`, so it scales a transform's offset
too, and the element swings toward the screen origin.

**Still open in FEEDBACK-07:** the tooltip-text table (B2/D1), Cinder's ally-move wording (D0), broken
outfit art (D1), the Syrup Town title button (D1), C's remaining performance levers, and all of A and E.

## Status as of 2026-09-14 (session 13, follow-ups from Noodle's test of session 12)

Noodle tested the session-12 work and reported seven issues. All were addressed:

- **VFX**: the additive ground is keyed too (the black square could not be removed by `screen` over a dark
  backdrop), `playVfx` WAITS for `prepare` (the intermittent magenta background was the first play drawing
  the raw image), and -- Noodle's requirement -- the key now works OFFLINE: the named suffixes apply SVG
  filters (`honeycomb.vfx.ensureFilters`; `Green R-G+B+1`, `Magenta -R+G-B+2`, `Black R+G+B`, plus
  `feComposite in SourceGraphic` so padding and `object-fit` letterbox stay transparent), so a `file://` page
  keys them with no canvas. The canvas path is only the unsuffixed corner backup, online.
- **Card flight removed**: the player's card no longer flies at the target, which was covering the VFX; it
  leaves the fan when its destination entry plays.
- **Shelf End Turn**: the primary UI frame nine-slice was outranking the shelf reset and drawing the old
  button's face over the plaque; four-class rules kill it. The right corner also refreshes the moment End
  Turn is taken (`onEndTurn` calls `refreshShelfState`), not only when queued.
- **Offer rates are for the outfit worn NOW**: `cardOfferStateInfo(character, card, member)` folds the live
  loadout's `offerCondition` / `offerWeightArray` / `archetypeWeightFor` into one state (Blocked / Boosted /
  Reduced). The reasons are NOT printed inline (Noodle: an inline line read as if everything below it were
  banned); they live in the row's card tooltip (`cardOffer` kind, `honeycomb.cardOfferTips`), and each row
  shows the card itself.
- **Shop art** is right-aligned (`.hcShopScene`), with the blurred fill hidden so the vignette covers the gap.
- **The VFX filter SVG lives on the OVERLAY HOST, not the root** (session 13, Noodle's Spit report): a scene
  change does `root.innerHTML = ""`, which wiped a filter on the root, so the cached effect skipped re-adding
  it and the raw green/magenta background showed. `ensureFilters` also runs at PLAY time now.
- **Docs**: round 06 is archived (`Archive/FEEDBACK-06.md`); its open items moved into the new
  `FEEDBACK-07.md` (goals, carried-over issues, performance list, new reports, design notes).

**A browser for the agent:** MCP never connected in the desktop app, so
`!designDocs/honeycomb/agent-browser.js` drives the system Chrome through the Playwright bundled with
`@playwright/mcp` directly -- navigate, run a snippet in the page, capture console errors, hover, screenshot
(the agent reads the PNG back). Start `.claude/devserver.py 8000`, then
`node "!designDocs/honeycomb/agent-browser.js" --out shot.png --eval-file job.js --console`. BASICS.md has
the full option list. 1097 tests; [71].

## Status as of 2026-09-14 (session 12, "7.7": the rest of FEEDBACK-06)

**Every remaining numbered item of round 06 landed**, except item 24, which the brief asked to be a LIST
first. Items 16–23:

- **16 party details window** — a heart in the top bar on the map and in battle, opening `honeycomb.partyWindow`
  (honeycomb-ui.js): the party list, and the selected member's class, outfit effect, equipment, weaknesses
  (READ-ONLY — plain tooltip key, so no notification is cleared and no event can start) and their cards in the
  run deck. `deckScreen.entryArray` gained an optional owner filter. `buildWeaknessSection` gained a `readOnly`
  option. Tests [71].
- **17 attack VFX** — `honeycomb.vfx` + `combatScene.playVfx` (honeycomb-scene-combat.js). Blend by filename
  suffix first (`-additive` / `-green` / `-magenta`), four corner pixels as the backup; chroma-to-alpha on a
  canvas (raw image fallback when the canvas is tainted on `file://`), cached and prewarmed. The `damage` log
  entry carries the effect's `vfx`; ordinary attacks take `tuning.vfx.defaultAttackPath`. Content: Crimson Arc
  additive, Nightfall magenta, Claw Flurry opts out.
- **19 hand shelf** — empty end-piece paintings swap in when a corner can do nothing; End Turn's label hidden
  behind the plaque painting, still pressable and sounding. `refreshShelfState` / `endTurnReady` /
  `onEndTurnPressed`.
- **20 obtainable cards** — `obtainableCardArray` + `cardOfferState` (honeycomb-progression.js, testable
  headlessly), drawn by `cardCollectionMarkup` in the Compendium, the party window, and a button below the
  outfits row. Costume rates on Severine (Blood Pact costume-only, Drain boosted, Claw Flurry reduced); the shop
  honours `offerCondition` now.
- **22 event images** — right-aligned, whole at any of the three sizes, with the vignette gradient covering the
  gap to the board.
- **23 mobile workarounds** — title fullscreen already existed; added the bobbing battlefield arrow, press-the-
  ground-to-close for informational overlays, and the party lineup under the Roster window.
- **24** — the cause list was built and added to `FEEDBACK-06.md`; nothing acted on, per the brief.

Two unsorted bugs fixed along the way: the map preview's foe count now follows party-size scaling, and the
seen enemy-move card no longer collapses to a fraction of the card back beside it. 1094 tests; [71].

## Status as of 2026-09-13 (session 11, "7.6": FEEDBACK-06 small wins)

Items 18 (event outcomes right-aligned) and 21 (tall full-body outfit cards in a sideways row, descriptions
always) landed, plus six unsorted fixes: title scroll, live numbers in hand-written card text
(`{damage:N}` tokens, `cardTextTokens`), the `threshold` AI strategy now honours `chargeCost` /
`maximumInARow`, the Matriarch's stacking and aim shift, and odd-place nameplate stagger. Embrace's ×4 lust is
diagnosed (tag multipliers multiply); Noodle's answer made Embrace Venom-only. 1079 tests; [70].

**Then, same session: ALL ENEMY ART REPLACED** (the old placeholder was copyrighted). One drawing per enemy
via `ENEMY_SOURCES` in the generator (`--only enemies`), portraits from the figure outline, the Matriarch
landscape and sized by height (anchored sprites no longer fit their column's width; scale 1) with a new broken
stand-in. Then a rest-site lock-up: a tooltip left over the upgrade preview swallowed every click (trap below). See ART-GUIDE §2. Nettle's and Severine's
`default` folders now hold Noodle's drawn poses (832×1216, 704×1408, 889×1300, 1300×2600, not the 650×1300
the generator makes) and were taken off their manifests, so a rerun keeps them. **Item 16 is still next.**

## Status as of 2026-09-13 (session 10, back on FEEDBACK-06)

**Round 06 resumed at item 13, and it landed.** The sheet's weaknesses gained BENCH DECAY BY DAYS (each day
a run passes, `map.enterNode` takes `tuning.lust.benchDecayPerDay` off every tag of everyone not in the party,
floored at its rank), a days-to-floor counter, a Reset button that spends PERSONAL EXP to drop every tag to
its floor (`lust.resetToFloor`), a near-rank glow, and "N to next rank" moved into the row tooltip. Weakness
now builds at `exposurePerLustPoint` 0.4 (was 1). 1029 tests; [67].

**Then items 14–15, LUST EVENTS** (`honeycomb-lust-events.js` + `honeycomb-content-lust-events.js`). Every rank
crossed leaves a record on the profile; a trigger may attach an event to it. Rank Up Notification / Event Ready
are READ off those records. Event Ready characters are removed from the party and replaced by a heart whose
pinned panel starts their events. Events open over teambuilding through the event overlay's new HOSTS. A Lust
Battle is fought in a throwaway run and comes back through a `lustEvent` continuation, on defeat too. Tooltips can
now be INTERACTIVE. 1056 tests; [68].

**Then Noodle's follow-up: Lust Events are the game's AUTHORED NARRATIVE.** A rank-up asks the LIST
(`lustEventListArray`, `["nettle", "exposure", 1, "event"]`, always fires), then the MILESTONES
(`lustEventMilestoneArray`, "the Nth event" overall / of a weakness / of a character; waits rather than being
skipped), then the random fallback triggers. `profile.lustEventTally` counts raised and completed events;
content reads them with `lustEventCount`. 1071 tests; [69]. **Item 16 (party details window) is next.**

## Status as of 2026-09-13 (session 9, feedback on the mechanics pass)

**MECHANICS-01.md PART 7.** The six pre-session-8 outfits are retired (save format 6 moves anyone wearing
one into its successor; the tests keep them as fixtures). **Clemence was rebuilt around becoming Broken**:
every card of hers names its own broken counterpart that spends the Lust its standing form built, and
**Sanctified** (`keepsCardsWhileBroken`) lets anyone play their real cards while Broken. Turncoat never hits
its own user, Pilfer re-rolls, the Sleight Purse replaced the Two-Faced Mask, Flame Charge moves at a
`charge` pace, and Brienne, Nettle and Severine now start with a card from each sister mechanic. 1016 tests; [66].

## Status as of 2026-09-13 (session 8, the mechanics pass)

**SESSION 7.1 REPLACED THE CARD POOL AND DOUBLED THE ROSTER.** Everything is in **`MECHANICS-01.md`**: the
example mechanics scored, the primitive list, three SISTER MECHANICS per original character (a card's
`archetype`; an outfit's `archetypeWeightArray` favours or blocks one), 65 new cards for Brienne / Nettle /
Severine, 9 new outfits, 9 new relics, and three new characters on primitives nobody else owns: **Cinder**
(Lancer, party order), **Clemence** (Confessor, lust moved between fighters) and **Cassadora** (Hexer, enemy
intents). Severine's primitive became Blood. The six older outfits stay, pointed at the new pool; whether to
retire them is an open question for Noodle. 1005 tests; [64] is the trio's pool, [65] the new characters.

## Status as of 2026-09-12 (session 7, continued)

**All three MVP scenes are built, playable and verified in a browser.** A run can be started, a map
walked, fights fought and won or lost, rewards taken, and the deck permanently changed — end to end.

**A polish round followed it** (`POLISH-01.md`): forecasts, combat legibility, impact, and a wider
animation vocabulary for content to reach for.

**SESSION 5 WAS THE BROKEN OVERHAUL, and it is the largest mechanical change the game has had.**
SHIELDS ARE GONE — the stat, the effect, the hooks, the keyword, the badge, the CSS, all of it. Two
systems replaced them, and both touch nearly every file:

- **Temporary HP** — extra health past the end of the bar, in gold, spent before ordinary health,
  and it HALVES at the start of its owner's turn rather than vanishing. Past 100% of maximum health
  the bar's right end shatters and leaks.
- **Lust and the Broken state** — lust builds ON the health bar and can pass maximum health. When it
  catches the health standing behind it (ordinary health PLUS temporary), its holder BREAKS: still on
  the field, still holding cards, but every card they hold is swapped for their one broken card, and
  they get worse every turn until somebody fixes it. A player character is **never killed** — 0 health
  simply means broken. Every member broken is the run's loss condition.
- **Since round 06 (item 10) ENEMIES TAKE LUST TOO**, but breaking simply beats them: health to 0,
  downed on the spot. `honeycomb.entityBreakBehavior` ("state" / "defeated") decides, by what a combatant
  IS; `entityHasBrokenCutIn` decides who gets the cut-in (Brienne, Nettle, Severine, the Matriarch).

Read **`BROKEN-01.md`** before touching any of it: it holds the brief verbatim and every decision.

**SESSION 7 REPLACED THE NAMEPLATE** (`FEEDBACK-06.md` item 1, now the live round, items numbered 1–24),
then landed items 2–8: scene layout only, the console warning report (`honeycomb-warnings.js`), the Lewd
supertype and the new card face, Status folded into CURSE, standard card sizes in card units, and a hard
text shadow on everything.
The nameplate was designed in `nameplate-preview.html` with Noodle over three passes before any of it went
into the game; the traps below marked round 06 are what it taught.

**SESSION 7, CONTINUED (after rounds 01–05 were archived), landed item 9, alt win conditions**
(`honeycomb.fightEndConditionArray`; beating the Matriarch wins with her brood still standing), then
item 10: enemies take lust and are defeated by breaking, Severine's Enthrall (7 lust) replaced her starting
Rakes, and the Matriarch plays the cut-in from `enemies/matriarch/`. Then item 0, **queued input**: a card
or End Turn pressed during an animation is checked and queued instead of silently dropped, which Noodle
suspects was a big part of playtesters calling the game choppy. Then item 11: lust is written down as never a
status, a status can name the supertype it makes (Sensitive → Lewd), a card type can carry its own frame art
(Lewd has stand-in frames and a keyhole icon), and the `lustCardTag` warning holds lust cards to a lust tag.
Then item 12: reading a Lewd card (hand hover, touch read, or an enemy's intent) pauses the resting forecast
and shows a panel over each fighter it could reach, with the lust they'd take and their weakness rails
(`forecast.forLustInspection`, `combatScene.renderLustPeeks`). **Item 13 (lust tracking in teambuilding) is next.**

**SESSION 6 WAS THE POLISH PASS ON IT, plus a tool for looking at it.** `FEEDBACK-05.md` is the live
round; items 0–8 and 22–25 landed, 9–21 are open.

- **A PLAY-SPEED SLIDER, and four speeds below the old floor** (0.1× / 0.25× / 0.4× / 0.55×). The
  combat shelf's speed button opens a panel with a bar across every named step; the system menu carries
  the same bar. **This is the tool for working on any animation in the game** — three real bugs in the
  break cut-in were only findable by stepping through it slowly.
- **The break cut-in was rebuilt in two places.** The claw rim is masked by the tear's own growth so
  the tear FORMS instead of arriving finished, and the screenwipe now clips the stage it crosses, so it
  genuinely erases rather than passing over things that were fading anyway.
- **Recovery only happens at a turn start now.** A mid-turn heal buys it and the plate says so.
- **Broken is loud on the board**: a BROKEN banner with the recovery line under it, chains across the
  figure (hearts since round 06), the sprite and bar in the broken palette.
- **The weakness ledger became readable**: a stepped rail with the rank thresholds notched on it,
  tooltips on every part of it, a rank cut-in when one is crossed, and a ceiling of one rank per run.

| Piece | State |
|---|---|
| Engine (effects, entities, statuses, combat) | Working, headless-testable, deterministic |
| Teambuilding scene | Playable — drag-built party, outfits, one-wearer equipment with capacity, in-tab progression tree |
| Map scene | Playable — generated node graph, previews, routing |
| Combat scene | Playable — drag-to-target, animation replay, win/loss |
| Map node overlays | Event, treasure, rest, shop, card picker, region cleared |
| Combat overlays | Victory with card reward, defeat with summary |
| Save / load | Own localStorage namespace, autosaves, mid-combat resume verified |
| Title hub / system menu / debug panel | Built. No screen is a dead end |
| Character art system | Tiers, poses, states, fallback chain. See `ART-GUIDE.md` |
| Abilities | Character spells with per-character charges, in a DROP-DOWN FROM THE CLASS MEDALLION (round 06): the medallion glows while one is usable; each row aims or fires; `requirementArray` gates each one and is listed ticked/crossed on hover. Broken seals them |
| Nameplates | **REPLACED IN ROUND 06 (item 1) against `mockup-7-health`**: SVG shapes in `ui/nameplate/` laid out in mockup units (`--hc-plate-u`). Pink lust over red health, gold tHP, black missing; broken = pink to health, a pink/black DITHERED catch-up gap to lust, red multiply tint, heart medallion, "BROKEN!". Past maximum: a jagged break with 4-frame lightning and frame chips. Mechanic + statuses in circles below. No forecast numbers: the `nameplate` tooltip holds them. Reading = `honeycomb.vitalsShareArray` |
| Upgrade paths | A card may offer `upgradePathArray` (several ladders); the copy records `upgradePath`. `cardUpgradeArray(definition, path)` owns which ladder a copy climbs |
| Enemy charge | `entity.charge` grows per enemy turn; a move with `chargeCost` waits for it and spends it. `moveIsRare` gives a charged move the vertical frame and a larger telegraph |
| **Temporary HP** | Replaced Shield entirely. `entity.temporaryHealth`, effect `temporaryHealth`, hooks `modifyTemporaryHealthGained` / `onTemporaryHealthGained`. Halves at turn start (`tuning.combat.temporaryHealthDecayFraction`); the bar shatters past 100% |
| **Lust and Broken** | `entity.lust` / `.broken` / `.brokenTurnCount`. Effects `lust` and `soothe`; `checkBreak` / `checkRecovery` / `applyBrokenEscalation` in entities.js. Breaks at `lust >= health + tHP`. Everyone takes lust (`lustImmune` opts out); `entityBreakBehavior` "state" (characters) or "defeated" (enemies, via `markDowned`); `brokenCutIn` on a definition plays the cut-in |
| **The cut-ins** | `honeycomb-overlays-broken.js`: the six-layer !!BROKEN!! overlay and the faster recovery eye band. Both play from a LOG ENTRY and hold the replay for their own length |
| **Broken cards** | Every card points at one (`brokenCard`, inherited from the character). The swap happens in `resolveCard`, so the hand shows what will actually be played |
| **Between-run weakness** | `profile.lustExposureArray[character][tag]`, ranks 1–3 from `tuning.lust.exposureRankArray`. Shown on the teambuilding character sheet. Since round 06 item 13 it decays per DAY while benched (`lust.applyBenchDecay` from `map.enterNode`, never below the rank floor), with a days-to-floor counter (`characterBenchDaysToFloor`), a personal-EXP reset (`resetToFloor`) and a near-rank glow (`nearRankGlow`) |
| Character mechanics | `honeycomb.mechanicArray`: Brienne's Resolve (bar), Severine's Thirst (three tested orbs), Nettle's Harvest (orb + count); since session 8 Cinder's Stride (orb), Clemence's Devotion (bar, session 9), Cassadora's Foresight (orb). Counted ones live in `member.meterArray` and are moved by their own hooks; widgets in `ui.mechanicWidgetArray` |
| Tags | Free-form labels on every content table; outfits and equipment alter a character's |
| Choices | Effects can stop mid-resolution, ask the player, and continue |
| Global progression | Global pool (first finds) + personal pools (fighting), discovery ledger, ranked/exclusive trees |
| Tooltips | Card zoom, status descriptions, enemy intents written out in words |
| Events and shop | Full-screen scenes with a speaker. Rest is an ordinary event |
| Forecasts | The real action dry-run and rolled back: what a card would do, what the turn will cost |
| Impact | Damage-scaled screen shake, hit stop, card flight, turn banner, drain trail |
| **Feedback round 01** | **ALL 21 ITEMS DONE.** See `FEEDBACK-01.md` for what each one settled |
| **Feedback round 02** | **ALL COMPLETE `FEEDBACK-02.md`** — it is kept current item by item |
| **Feedback round 03** | **ALL COMPLETE `FEEDBACK-03.md`** |
| **Feedback round 05** | **ALL COMPLETE `FEEDBACK-05.md`** |
| Weakness ledger | Stepped rail with the rank thresholds notched on it, tooltips on every part, a `weaknessRank` cut-in when one is crossed, and `maximumRankGainPerRun` (1) |
| Hand motion | The replay edits the shown hand card by card: draws fly off the deck, discards fly to it, created cards are shown before they go (scene-combat, "Hand motion") |
| Card tags | A card's SCHOOL, printed on it. Since session 5 the five LUST TAGS live here too (restraint / exposure / charm / venom / torment): they are the key the between-run weakness ledger is written under, so every card that inflicts Lust must carry one |
| Keywords | Temporary HP, Lust and Broken first, sidecar panels, hand panel follows the pointer |
| Party order | Real mechanic: cards move their owner, most attacks hit the front, previewed while held |
| Forecast | Rest, held and aimed readings; random hits shown as "might" |
| Rewards | Dealt across the party; bonus slots, guarantees, costume-weighted odds |
| Enemy moves | REAL CARDS in `cardArray` since round 04 (`enemyCardArray`, `moveArray` on the enemy); any combatant can be AI-driven (`isAiControlled`, `selectMove`, `moveCard`, `combat.playMove`); click one for its moves |
| Teams | `entity.side` is the TEAM; targets are relative to the user; `summon` puts any enemy/character on either team |
| Card types | SUPERTYPES since round 06: Damage / Negative / **Lewd** / Support / Passive (+ **Curse**: bad cards shuffled into the deck, the formal name since round 06; Status was folded into it), DERIVED from effects, several per card; `typeArray` is the manual override. Lust aimed at the other team derives Lewd, and so does a debuff whose status says `cardType: "lewd"` (Sensitive). A type may carry its own frame (`framePathByLayout`, read through `cardTypeFramePath`); only Lewd does, with stand-in art (round 06, item 11) |
| **Card sizes** | Round 06 items 7–8. `tuning.art.cardSize`: small (name only) / medium (hand) / large (300 wide, z 150). `size` is REQUIRED on `honeycomb.ui.card` (test [59] reads every call). Card ink is in CARD UNITS (`--hc-card-u`, container query units), so a card is one picture at every width. Hover and held card grow to exactly large (`handCardGrowthToLarge`). Rules text / names / supertypes shrink to fit by character count. Checked headlessly by the `cardFit` warning rule (font widths, session 19); `audit-card-fit.js` is the browser ground truth |
| Card face | Round 06 item 6: NAME above the art, SUPERTYPES on the bar under it (`ui.cardSupertypeRow`), card tags alone on the lower edge (`ui.cardTagStrip`). Name and supertype lines shrink to fit by character count (`ui.cardLineFit`: each size's `nameFit`, `tuning.art.cardFrame.supertypeFit` / `textFit`). Target badges OFF (`cardFrame.showTargetBadge`); small horizontal cards add supertype icons under the art (`partArrayByLayout`) |
| Battle log | `combat.historyArray` written from `logEvent`; Log button words it (`honeycomb.battleLogWordArray`). Since round 05 every entry carries `via` — the card or ability that wrote it — so a line reads "took 4 damage from Severine's Crimson Arc" |
| Play speed | A SLIDER over `tuning.animation.playSpeedArray` (round 05): 0.1× / 0.25× / 0.4× / 0.55× / 0.7× / 1× / 1.6× / 2.5×. Shelf button opens a panel; the system menu carries the same bar. Kept on the profile; every duration goes through `honeycomb.duration`, so the slow end is how any animation gets inspected |
| Battle layouts | `tuning.battleLayout.layoutArray` (**scene** = default since round 03 / jumbo / stage / crowd), numbers → CSS vars via `honeycomb.battleLayoutPropertyArray`, flags → classes via `battleLayoutFlagArray`. **Scene is the only layout shown** (round 06, item 4): no Layout button, no remembered choice; the others are reachable only by editing `defaultLayout` |
| UI chrome | Nine-slice frames for panels / windows / buttons / tabs / item plates (`tuning.art.uiFrameArray`, `ui/frames/`); backdrop slots. See ART-GUIDE "UI chrome" |
| **Demo scope beyond MVP** | **THE LIVE QUESTION. Ask before building any more content** |
| Hand shelf | Layout flag `handShelf` (scene): Noodle's ui/hand paintings behind the fan, energy over the flame diamond, End Turn on the plaque. Geometry in `tuning.art.handShelf` |
| Bars follow the log | `combatScene.shownVitalsArray`: shown health, gold and lust move per damage/heal/temporaryHealth/temporaryDecayed/lust entry; every repaint resyncs to the truth |
| Event previews | `forecast.forEventChoice` dry-runs a choice: party row + statuses + cards/relics drawn BEFORE clicking; `unexplainedArray` = changes no log entry explains (test [52] holds every event to empty) |
| Backdrops | `honeycomb.ui.backdrop(path)`: painting contained over a blurred cover copy, under the vignette — any painting size, no bars |
| Enemy placement | `presentation` on an enemy / `placementArray` on an encounter → `enemy.placement` → CSS vars on the sprite wrap (scale, offsets) |
| Save export | Menu → Copy / Load Save: `save.toReportText` (save + browser + last errors) / `fromText` |
| Icons | `v13 spire images/icons/*.webp` (256) cut from Noodle's sheet; 1024 sources in `_source/icons/` with a README of what is used where |
| **Screen scaling** | SESSION 6. `--hc-px` = shorter viewport side ÷ `tuning.layout.referenceHeightPixels` (900); every CSS length is a multiple of it; JS writes lengths through `honeycomb.cssPixels` / `pixels`. Phone = desktop, audited (`audit-scale-parity.js`). Rotate hint off (`tuning.dom.rotateHintEnabled`). See `SCALING-01.md` |
| Content warnings | Round 06 item 5. `honeycomb-warnings.js`: `warningSubjectArray` × `warningRuleArray`, printed to the CONSOLE once at boot. A new standing rule is one table entry; `tuning.warnings` holds the limits and `ignoredArray`. `warnings.report()` is the data a release workflow will read |
| **Queued input** | Round 06 item 0. Cards and End Turn pressed during a replay: dry-run checked on release (`queuedPlayRefusal`), queued (`combatScene.inputQueue`), carried out from `afterBeat` by `drainInputQueue`. The replay hurries while anything waits (`tuning.animation.queuedInputPace`). Abilities are not queued |
| **Win and loss conditions** | Round 06 item 9. `honeycomb.fightEndConditionArray` (`allBeaten`, `leadersBeaten`); a fight's list comes from `combat.begin` settings → encounter `victoryConditionArray` / `defeatConditionArray` → tuning default. Reads BEATEN (downed or broken), never health. `combat.decidedOutcome` answers without recording; `checkEnd` records it and the victory screen says how |
| **Lust inspection** | Round 06 item 12. A Lewd card being read: `forecast.forLustInspection` dry-runs the card's effects alone (per candidate for picked/random modes, once otherwise), `forecast.inspecting` pauses the resting forecast in `markFor`, and `combatScene.renderLustPeeks` hangs a panel inside each reached fighter's nameplate (lust, damage, weakness rails via `ui.weaknessRail` + `lust.previewExposure`). Opened by `onHandHover` / `touchInspect` / the intent tooltip's `onShow` |
| **Lust Events** | Round 06 items 14–15. `profile.lustRankUpArray[character]` records `{id, tag, rank, eventIndex, source}` per rank crossed (`lustEvents.recordRankUp` from `noteRankChange`). Which event: `chooseEvent` = authored `lustEventListArray` → `lustEventMilestoneArray` (fired ledger `profile.lustMilestoneFiredArray`) → fallback `lustEventTriggerArray` with `tuning.lustEvents` odds on the `lustEvent` stream. Tallies `profile.lustEventTally` (raised / completed × total, character, tag, character+tag), read by condition/value `lustEventCount`. States read with `characterState` / `tagState`; `blocksParty`; `noticeTag` clears one weakness's notifications. Events: `eventHostArray` "lustEvent", `{name}{tag}{rank}`, `speakerIsSubject`, `keepsEventReady`; effects `gainWeakness` / `gainPersonalExperience` / `unlock` (new unlock kind `tab`). Lust Battles: `newRun(..., {lustBattle})` + continuation `lustEvent` (`finishDefeat` on the defeat screen) |
| **Interactive tooltips** | Round 06 item 14. A kind with `interactive: true` takes the pointer and closes after `tuning.ui.interactiveTooltipGraceMs`; `tooltip.showInteractive` pins one until a press elsewhere (`tooltip.onPointerDown` via `input.notePointer`) |
| Tests | 1205 headless tests; [76] is session 19's card fit from font widths and the Severine save migration, [75] is session 18's Juggernaut identity / cleanse / thrown cards, [74] is session 17's longer floors / scrolling map / elite prizes, [73] is session 16's second boss / elite pool / new roster, [72] is session 15's tooltip text table, [71] is session 12's items 16–24, [70] is round 06's unsorted small wins, [69] is the authored Lust Event lists, [68] is round 06 items 14–15, [67] is round 06 item 13, [66] is session 9's feedback round, [64] is session 8's card pool and [65] its new characters; [56] is the Broken overhaul (round 06 item 3's targeting and cut-in pace live there too), [57] is round 05, [58] is the round 06 nameplate, [59] is round 06 items 4–8, [60] is item 9, [61] is item 10, [62] is item 11, [63] is item 12. `node "!designDocs/honeycomb/test-honeycomb.js"` |

---
