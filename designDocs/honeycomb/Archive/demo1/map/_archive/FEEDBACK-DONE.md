# Map and acts — finished feedback

Closed items from `../FEEDBACK.md`, quote and annotation together, newest first. Nothing here is open work.

---

### B15. Act 1-1 and Act 1-2 — CORRECTED (session 39): both are LIVE ☑ — CLOSED 2026-09-25

**The session-38 reading of this was wrong and is retracted.** It said the acts were "a demo goal with
nothing behind it yet" and that `tuning.map` generating one 9-row map with no act table meant there was
no seam. Noodle:

> Act 1-1 and Act 1-2 are not unstarted, they're live in game and working right now. The wide purely
> automated map on a simple background is act 1-1, the one overlaid onto a more complex background is
> act 1-2. What's missing is the ability for act 1-1 to have multiple boss nodes to select alternate 1-2
> areas, with tooltips explaining each area so the player can make an informed decision. The current
> live act 1-2 should be titled Myconid Navel. Anastasia's chess gauntlet is a one-time (or until
> beaten) act 1-2. For now, act 1-2 as a whole is likely the stopping point for the demo.

(One typo corrected: he wrote "a more complex issue" where act 1-2's background is meant — the contrast
is against act 1-1's "simple background". **Confirm if this reading is wrong.**)

So the real work is much smaller than a seam-building exercise:

1. **Branching from act 1-1.** Multiple boss nodes in act 1-1, each leading to a different 1-2 area.
2. **Tooltips on those boss nodes** explaining each area, so the choice is informed rather than blind.
   This is the part that makes branching worth anything.
3. **Title the current live act 1-2 "Myconid Navel."**
4. **Anastasia's chess gauntlet is an act 1-2** — one-time, or until beaten. It is an alternate
   destination, not a separate mode, which also means A4's decisions have a structural stake.
5. **Act 1-2 is the demo's stopping point** ("likely"), so no act 2 work is in scope.

**CONFIRMED IN PLAY, session 39.** He tested it while answering: *"I'll test that beating act 1-1 right
now still takes me to act 1-2"* → *"And confirmed. I'm in act1-2 right now."* The transition works
today.

And the reconciliation is settled too: *"But you are right that they aren't called that in the code
right now."* So the two acts are **distinct map configurations with no act table and no act naming** —
session 38 read the code correctly and drew the wrong conclusion from it. That makes the build shape
clear: the branching work has to **introduce** the act concept (an act table, or whatever names the
1-2 areas so a tooltip can describe one) before multiple boss nodes can select between them. Naming
the live 1-2 "Myconid Navel" is the first thing that needs somewhere to live.

**Closed 2026-09-25.** Every piece landed: the three boss nodes and their tooltips in session 55 (P28 and P29, archived here), the title as the Mushroom Frontier in session 55 (P9; his word on the day overrode Myconid Navel), the chess gauntlet as a one-time act 1-2 in sessions 46 and 57, and act 1-2 as the demo's stopping point is a standing rule in `../../BASICS.md`. The act concept still has no table of its own in the code; nothing has needed one.

---

### B28. Map generation: too many chests, not enough encounters ☑ — CLOSED 2026-09-25

> Too many chests in map generation, not enough encounters.

Node weights in `tuning.map`. Raised twice in the same message, which is worth taking as emphasis
rather than duplication. Note this pulls against **B22** (cutting starting relics) and **B24** (adding
curses) — fewer chests plus no starting relics is a large swing in how much a player has by the boss,
so these three want tuning together rather than one at a time.

**Closed 2026-09-25.** Both halves landed in session 55: treasure capped at three a region (P11, archived here), and combat's node weight raised from 45 to 52 with the seven points taken off events (`../../Archive/playtest_55/READ-ME-2.md` §6).

---

### B42. The Campfire's picture does not exist ☑ — STAND-INS GENERATED SESSION 58b

> Image for this event is broken on my phone, likely because of the random select.

**Not the random select — there is no random select on this event.** `theCampfire` names one image and
one background, and neither file is on disk:

| Field | Points at | On disk |
|---|---|---|
| `imagePath` | `events/campfire` | **missing** |
| `backgroundPath` | `events/backdrop-campfire` | **missing** |

There is no `v13 spire images/events/` folder at all. Every other event in the game points into
`map/`, where the files do exist — `map/event-well`, `map/event-shrine`, `map/event-bench`,
`map/event-garden`, `map/event-cardsharp`. Of thirteen event image paths in the game, exactly three are
missing, and two of them are the Campfire's. The campfire is the rest node, so it is the event a run
opens most.

**The third missing one is `theSealedDoor`'s `map/event-door`**, which has not been reported and is
broken the same way.

**Where the random select idea probably comes from.** `v13 spire images/_source/refsTests/2026-09-21/campfire/`
holds three renders made that night, named by party — `rest-brienne-cinder-clemence.png`,
`rest-brienne-nettle-severine.png`, `rest-cassadora-cinder-clemence.png`. So a party-dependent campfire
picture was being tested. Those are test renders in `_source/`; nothing was staged into the game, and
the event entry still points at a path that never existed. Whether the campfire should have one picture
or one per party is his call.

**Session 58b (2026-09-23), Noodle, the night before release:**

> remaining events and rest node current image = horrible first impression, please generate stand-ins, fireplace one image of lead character, only 7 images there. Other events need something, cute girls, long legs, slutty outfits, something to make the brain not think to hard and judge my game poorly

**Done, then redone the same night.** The first round put the cast into the event pictures, and
Noodle caught the problem:

> They all show the game's cast interacting with things, we don't know who's in the party. We'd either need versions for every party member or to try again with non-party designs

> It might be important to look at the images you make because without the ability for you to inpaint, the images are vastly less flexible than the writing. For instance in The Quiet Shrine the bowl is already full. [...] writing a scene around an image of stumbling onto a praying lady would be easy

> Back up the events that need images first just to be safe, then try to take a more "bend what bends easiest" approach until it fits

What is in the game now:

- **The folders were tidied on 2026-09-24.** Noodle:

  > Events really should be in the events folder, every image in map literally starts with "event-"

  > The "png archive" is the active game folder for images pre-conversion. Before every release I will be using an imagepack script to convert, resize, and make placeholders for the actual game's images. While I did make that script ignore folders starting with _ it was not meant as a storage container, especially with large, loose png files that will take up space on my C drive

  Every event picture now lives in `events/`, in both `v13 spire png` and `v13 spire images`. A map
  event's picture is `events/<name>` (`events/well`, `events/door`...). A picture made once per girl is
  a folder named after the scene with one file per girl: `events/campfire/knight`,
  `events/pool/necro`, and the event names it `events/campfire/{leader}`. The campfire backdrop is
  `events/campfire/backdrop`. Nothing event-related is left in `map/` or in the character folders.
  The spare versions left the C drive for `D:\honeycomb spare art\2026-09-23\`, laid out as they
  were, and there are no `_` folders of Claude's left in `v13 spire png`.
- **The event table was backed up first**, to `../map_events/_backup-2026-09-23/honeycomb-content-map.js`.
- **The campfire shows whoever is at the front of the party**, one picture per character, seven in all
  (`events/campfire/knight`, `/necro`, `/vamp`, `/seer`, `/lancer`, `/priest`, `/chess`), each picked by
  eye from four. The event's `imagePath` is `events/campfire/{leader}`. The backdrop
  `events/campfire/backdrop` is an empty cave with a fire.
- **The campfire pictures were redone the next morning** (2026-09-23). Noodle: *"try to show the
  girls doing something on their own, rather than having them look at the player/viewer. The viewer is
  not a direct participant in the story in this game"*. Now: Brienne holds up her sword and looks
  along the blade, Nettle roasts a mushroom over a green fire, Severine sips wine with her eyes closed,
  Cassadora gazes into her orb, Cinder is asleep on the ground with her arm over her face, Clemence
  reads a book on her lap, and Anastasia thinks with her eyes closed beside a chessboard. The spares
  are on the D drive with the rest.
- **Paths can name any party place now**, not only the leader: `{leader}`, `{second}`, `{third}`,
  `{fourth}`, `{fifth}` (tuning `ui.eventPartyTokenArray`, resolved by `honeycomb.eventOverlay.artPathFor`).
  A place the party does not fill reads as the leader. With no run in progress it uses Brienne.
- **The desk shows these pictures too.** It was showing a broken image because it looked for a file
  literally called `campfire-{leader}`. It now shows Brienne's version (`findImage` in
  `tools/desk/server.js`). The desk was restarted at 01:35 to load the change.
- **Every map event shows a stranger, never the cast.** Each has her own hair colour so nobody reads as
  a party member. Picked by eye, four versions each:
  - The Quiet Spring: a pink-haired woman already in the water, fully nude.
  - Hands In The Dark: a pale woman in a black dress stepping out of the dark with both hands held out.
  - The Well of Wax Light: an orange-haired girl in white stockings sitting on the rim with a candle.
  - The Toll Bench: an aqua-haired girl lying along the bench with her palm out and coins on the floor.
  - The Spore Garden: a girl in a red mushroom cap with a watering can.
  - The Cardsharp: a purple-haired dealer in fishnets sitting on a card table.
  - The Sealed Door: a grinning red-haired prisoner behind the bars of the door's window.
  - The Quiet Shrine: a blonde woman in a backless white dress, kneeling and praying.
- **The event text was bent to the pictures**, one or two sentences per event. The choices, their
  effects and their previews are unchanged. Examples: the Cardsharp is "a girl sitting on a card table"
  who is grinning at you, where before it was a figure that did not look up. The Sealed Door's breathing
  is now a woman at the bars, and after the bolts are drawn "she steps back into the dark, and something
  else comes out instead", which is the fight. The shrine's bowl sits beside the praying woman, because
  no picture had one. The backup above holds the old wording.
- **No two events share a picture.** The Quiet Spring is `events/spring`, Hands In The Dark is
  `events/hands`, and the Well of Wax Light is `events/waxlight`. `events/well` is Noodle's own empty
  cave picture from 2026-09-21, which his `smallDynamicPool` draft uses.
- **Every spare is kept, off the C drive**, in `D:\honeycomb spare art\2026-09-23\v13 spire png\`.
  `events\_standins` and `map\_standins` hold round 1 (the cast versions), `map\_standins2` the
  strangers, `events\_standins3` to `_standins5` the campfire redo, and `characters\_pool-standins` the
  pool pictures. Each picture has four versions, `-1` to `-4`, with its prompt in the `.txt` beside it.
- The five old placeholder recipes (`event-well`, `-bench`, `-garden`, `-cardsharp`, `-shrine`) came off
  `generate-placeholder-art.py`'s list, so a `--force` run cannot paint over the new pictures.
- Suite block [139] checks the party-place tokens and that every event picture exists on disk, the
  campfire once per character.

---

### P8. Winning "The Sealed Door" traps you in a loop ☑ — FIXED SESSION 55

> Winning "The Sealed Door" traps you in a loop

**Reproduced, and it was an infinite loop, not a stuck screen.** The Sealed Door's first choice, "Draw
the bolts", starts a fight against the Hollow Patrol and names `victoryPage: "beyond"` — the page with
the reliquary and the drop. Winning showed the FIRST page again, with "Draw the bolts" on it. Taking it
again fought the same patrol again.

**Why.** The event overlay saves where the player is so a refresh mid-event resumes rather than
restarting, and its rule is that a saved position beats a page passed in. The choice that starts a fight
returns from the resolver *before* the line that records where the event is — so the saved position was
still the page the fight was chosen from. When the win came back naming "beyond", the saved first page
won.

Driven headless through the game's own overlay, before and after:

| | Page shown after the win | Choices on it |
|---|---|---|
| Before | the first page | Draw the bolts, Leave it bolted |
| After | beyond | Open the reliquary, Climb down |

The fix: a page handed back by a fight outranks the saved position, and the saved position is rewritten
to it — so refreshing after the fight resumes past the door instead of back into the loop. An ordinary
reopen (a refresh mid-event, the map's unfinished-node button) still resumes where the event was left,
which is what the rule is for. Suite block [129] holds both.

**ONE EVENT ON THE MAP HAD THIS SHAPE.** A scan of every event choice carrying `startCombat` found the
Sealed Door and Nettle's Synthesis. Synthesis is a Lust Event, and those clear the run before returning,
so the saved position was never there to win.

---

### P9. Mushroom Frontier is still called The Flooded Vault ☑ — RENAMED SESSION 55

> Mushroom Frontier is still called The Flooded Vault

Done. Region 1 is **The Mushroom Frontier**, and its blurb is "Dry timber and amber light. Everything
that grows here grows armed." This closes the naming half of B31 above and `enemy_overhaul/` E8.

**His word tonight settles which name it takes.** B31 recorded that `../BASICS.md` has him titling the
live act 1-2 *Myconid Navel*, and session 44 left the region alone rather than choose between that and
*The Mushroom Frontier*. He used Mushroom Frontier tonight, so that is what went in. **Myconid Navel is
still in BASICS.md and has not been touched** — if it was meant to be this region's title rather than
the act's, it is one field.

**The index is deliberately unchanged.** `floodedVault` is written into saved runs, into
`regionIndexArray` on every encounter that belongs here, and into tuning in four places. Renaming it would mean
rewriting every old save that carries it. A player never sees the string.

**Still owed here, and left because it is a look rather than a bug:** the region is painted for water.
`colorNear` and `colorFar` are cold blues (`#1b2f3a` / `#0e1720`), and the backdrop's anchors are named
`northPier`, `southSteps` and `sunkenHall`. Noodle should pick those colours himself.

---

### P10. Paths almost never go up ☑ — FIXED SESSION 55

> A weird map generation thing, it seems like paths almost never go up? 95% of paths I see go from top
> to bottom, and the remaining 5% are ones in the middle that branch back up or further down.

**He was reading a real bias, and his 95/5 is close to the measurement.** `honeycomb.map.connectRows`
fans a node's edges out from the point it projects onto in the next row, alternating sides: +1, then
-1, then +2, and so on. `tuning.map.edgeMaximum` is 2, so a node gets at most two edges — the one
straight ahead and the one at +1. **The negative side is first reached at the third edge, which is
never rolled.** Every branch in the game went the same way.

The 5% he saw going the other way is `rescueOrphans`, which attaches a node nothing reached to whoever
is nearest. That is a repair, not a branch.

Measured over 120 generated act1-1 maps, counting every edge against the column it projected onto:

| Where the edge went | Before | After |
|---|---|---|
| Up the screen | 4.7% | 15.2% |
| Straight on | 73.1% | 72.5% |
| Down the screen | 22.3% | 12.3% |

The fix is one line: which side the fan opens on is rolled per node from the map stream. The
alternation is untouched, so a node with three or more edges still fans both ways. What is left of the
difference is nodes at the top and bottom of a row, where the fan is clamped by the edge of the map.

**Every seed now generates a different map from the one it generated before.** The roll order changed,
so this is unavoidable. It is also why block [128] of the suite needed a wider list of seeds.

---

### P11. Chests are too common, and four should be impossible ☑ — FIXED SESSION 55

> Chests are still too common, it should be impossible to get 4 or more before the 1st boss, and there
> should never be duplicates

This is the same item as **B28** above, with a number attached. Measured over 150 generated act1-1 maps,
where "most one path can take" is the best a player could do by choosing every treasure they could
reach:

| | Before | After |
|---|---|---|
| Treasure nodes on the map, average | 4.31 | 2.68 |
| Most one path could take, average | 3.09 | 2.00 |
| Maps where a path could take 4 or more | 54 of 150 | **0 of 150** |

Two changes, both in `tuning.map`:

- **`maximumPerRegionArray`**, new: the most nodes of a type one region may hold. Treasure is capped at
  3. A path cannot hold more treasure than the map does, so capping the map is what makes four
  impossible rather than merely unlikely. A type the table does not name is unlimited.
- **`treasure` joined `noRepeatTypeArray`**, so two chests never sit back to back on one path.

**"There should never be duplicates" was read as two chests in a row.** Duplicate RELICS from a chest
were already impossible — `honeycomb.grantRelic` refuses one the run carries, and session 55 also made
the chest roll use `honeycomb.uncarriedRelicArray` (see `rework/starters/` P2). If he meant something
else by duplicates, this is the half that is still open.

---

### P12. Every map should start on a rest node ☑ — DONE SESSION 55

> Every map should start on a rest node

`tuning.map.firstRowNodeType` was `"combat"` and is `"rest"`. Checked over 150 generated maps: every one
of them opens on a rest row.

A rest is also where a card can be upgraded, so a run now gets one upgrade before the deck has met
anything. That sits with the other session-55 changes aimed at making the opening of a run kinder.

---

### P13. An ordinary win should not pay a relic ☑ — DONE SESSION 55

> Recieved a relic reward for an ordinary Thorn Arbor win, relics should only be from shops, bosses,
> and elites, with a chance from chests and events

`tuning.reward.relicChance` was 0.15, so about one ordinary fight in seven paid a relic. It is 0.

What still pays, and was already right:

| Source | Chance | Where |
|---|---|---|
| An elite | always | `tuning.reward.eliteRelicChance` |
| A boss | always | `tuning.reward.bossRelicChance` |
| The shop | it is stock | `honeycomb.shop.rollStock` |
| A chest | 0.6 | `honeycomb.treasureTuning.relicChance` |
| An event that names one | always | the event's own effect |

**This tightens the relic economy twice over**, because P11 above also cut the chests. A run that used
to find a relic from a fight, a chest and the shop now finds fewer of all three. Nothing was raised
to compensate, because he asked for a cut rather than a rebalance. It is worth watching in play.

---

### P28. Three boss nodes, each leading to a different route ☑ — BUILT SESSION 55

> Have three boss nodes at the end instead of one, each leads to a different Act1-2 route, letting
> players choose their boss and 1-2 route.

**This closes the mechanical half of B41 above.** The Act1-1 boss already decided which Act1-2 route a
run descends into — that has been true since session 45 — but the boss itself was rolled when the map
was generated, so the choice happened without the player. B41's words: *"the mechanism that decides
them is invisible."*

The final row now holds every boss the region names, one node each, each forced to a different fight:

| Seed | The final row |
|---|---|
| 5 | The Matriarch, The Head Gardener, The Shroud |
| 11 | The Matriarch, The Head Gardener, The Shroud |
| 23 | The Matriarch, The Head Gardener, The Shroud |

**And every node on the row before them reaches all three.** That needed a second change. Measured
before it, over 120 maps: 207 of the rest nodes led to a single boss and 146 to two, so more than half
of all runs arrived at the rest with no choice left to make. The last step is now a full fan. Every
other row keeps its ordinary one or two edges.

`tuning.map.bossRowHoldsEveryBoss` turns it off. **A region naming one boss still ends in one node**,
so the Mushroom Frontier, the Thorn Arbor and the Pollen Road are untouched.

---

### P29. A boss node names its boss once the boss has been met ☑ — DONE SESSION 55

> Boss nodes list the boss if encountered before

> Boss node tooltip should give rundown of boss, again if encountered before

**This is the other half of B41**, which found that the boss node's preview read the same for all three:

> Boss — 1 foe. The thing this place belongs to.

What it reads now, gated on `honeycomb.discovery` exactly as he asked:

| | The node says |
|---|---|
| Never met this boss | Boss — 1 foe. The thing this place belongs to. |
| Met it before | **The Shroud** — 1 foe. The thing this place belongs to. 205 HP. Beating it leads to The Mushroom Frontier. |

So a first meeting is still a surprise, and a player who has fought a boss before can pick their route
deliberately. **The route line is the important one** — it is the only place in the game that says
beating a particular boss sends the run somewhere particular.

**Nothing was written for it.** The name, the health and the destination region's name are all read
from tables that already existed, so no prose was invented for an empty slot.

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
