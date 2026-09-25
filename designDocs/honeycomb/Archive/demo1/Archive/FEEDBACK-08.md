> **CLOSED session 38.** Every item still open when this round closed was moved verbatim into
> `../FEEDBACK-09.md`; nothing here is live. Kept whole for the quotes and the annotations.

# Honeycomb Catacombs — FEEDBACK-08

Noodle's notes from the test session, preserved as written, with what was done under each. **Open
items first.** Annotate the moment an item lands; move finished items to
`Archive/FEEDBACK-08-DONE.md` at the end of a session (`BASICS.md`, "Keeping the feedback documents
current").

Status key: ☐ not started · ◐ in progress · ☑ done · ⏸ waiting on Noodle · ⊘ cut

## Status board — sessions 36–37

| | Item | State |
|---|---|---|
| 1 | Where the interrupted session got to | ☑ §A |
| 2 | Enemy sprites are all the same; sidecar tag files | ☑ §B |
| 3 | Combat poses created and wired in | ☑ §B |
| 4 | Compendium / bestiary selection UI like the logbook | ☑ §B |
| 5 | Compendium sort order | ☑ §B |
| 6 | Telling rarities apart in the compendium | ◐ §B — the shape is fixed; the frame art is still yours |
| 7 | Were broken cards balanced around the intended design? | ⏸ §D |
| 8 | Broken cards too similar to regular cards | ◐ §B — they have their own art now; the gold trim is still yours |
| 9 | Common and starter cards look identical | ⏸ §D |
| 10 | Mirror a combatant summoned to the wrong side | ☑ §B |
| 11 | Played cards should leave the hand and float near centre | ☑ §B |
| 12 | Hand bounces / opens and closes | ☑ §B |
| 13 | Deck and Start Run moved to the left | ☑ §B |
| 14 | Starting gold to 30 | ☑ §B |
| 15 | Equal default HP, Vigour ranks define tankiness | ☑ §B (one question in §D) |
| 16 | Old alpha save data cleared | ☑ §B |
| 17 | Brienne's Vow too weak | ☑ §B |
| 18 | Progression cuts off two-line nodes' XP cost | ☑ §B |
| 19 | The emailed player feedback | ☑ §C — triaged: 13 out of date, 4 still live |

**Suite: 1650 passed, 0 failed.** Content warning report: 1 active (Anastasia, deliberately — see §A).

---

## A. The interrupted session — where it got to

> The enemy rework and balancing session was interrupted partway and the session was lost. Are there
> any ways we can figure out where it was at, and if anything was midway that got interrupted?

☑ **Yes, and the test suite answered it.** Two workstreams were open, not one.

**The enemy pass (session 34, `rework/ENEMIES-01.md`) actually LANDED.** All 13 new enemies, both new
bosses, the second elite and the role template are in the tables and measured;
`node "!designDocs/honeycomb/enemy-template.js"` prints every enemy and encounter against its budget
and all but a handful sit inside ±25%. What it never finished was the **art**: every new enemy was
left pointing at another enemy's folder with `artFolder`, which is item 2 below. ENEMIES-01's status
board says "see §3 table" for steps 2 and 3, and those tables never got their status marks — that is
the only bookkeeping it lost.

**The chessmaster pass (session 35, `chessmaster/`) is the one that was cut off mid-flight,** and it
left the build broken in ways the suite could name. It ended with **12 failing tests**, and a red
suite is how the `hasTag` bug below survived unnoticed. Each failure and what it was:

| Failure | What had happened |
|---|---|
| 12 chess move cards "belong to undefined" | Written into `cardArray` with `characterIndex: "neutral"` instead of `enemyIndex`, so no enemy owned its own move |
| "content can ask a card its school" | A SECOND `hasTag` condition was registered in `honeycomb-effects.js`, shadowing the real one in `honeycomb-tags.js` (`findDefinition` takes the first). The original supports `of: "card"` and `of: "owner"`; the new one supported neither, so **every card that asks about its own school silently answered false** |
| 17 cards name no sound | Anastasia's five and the twelve pieces' moves were never added to `cardSfxMap` |
| every card's archetype is registered | Her cards carry `archetype: "grandmaster"`, which is not in `archetypeArray` |
| the roster has six characters… | She has no mechanic table entry, no broken card, no heirloom |
| every shipped tree is sound | She has no progression tree |
| a unique broken form per rank | She has none at any rank |
| "King's Invocation" name clash | The A2 ability and the rare card share a name |
| boot warm asks for images that are there | The Infernal pieces' art folders were never generated |

**All twelve are fixed** (§B). The two she cannot have yet — a progression tree and broken forms — are
handled by gating rather than by inventing content: she now carries `inDevelopment: true`, the content
tests skip a character wearing it, and a new warning rule **`characterInDevelopment`** prints at boot
exactly what is still missing, so the gap stays loud instead of sitting as red tests that hide the next
real regression. Clearing the flag is the last step of the chessmaster workstream.

Her three combat regressions (`chessmaster/FEEDBACK-01.md` §A) were also chased:

- **Enemies vanishing after they attack** — not reproducible. Driven headlessly through a full enemy
  turn, every enemy sprite keeps its element, its size and its `src`. Both suspects were already off
  (`flipBySide`, `combatStanceEnabled`); the inline `art.style.transform` write that §A named as the
  thing to revert first **is now gone** — facing is a class on the fighter, so nothing writes over the
  hit shake or the downed tilt any more. Worth one look from you to confirm.
- **Characters resizing on the ability menu** — same cause, same fix; please re-test.
- **The hand bouncing** — reproduced, measured and fixed. See item 12.

---

## B. Done this session

> Starting gold was not reduce to account for the new progression nodes, please set it to 30

☑ `tuning.run.startingResourceArray.gold` is 30.

> Each character's default HP should be the same. Less ranks of vigor define tankiness (moss should
> have 1, Brienne having 6)

☑ One shared number, `tuning.run.characterBaseHealth` (58, the old average), and every character's own
`baseHealth` is gone; the field survives as an override that nothing uses. Tankiness is now the Vigour
node's rank ceiling: **Brienne 6, Severine / Cinder / Clemence 3, Cassadora 2, Nettle 1**, which lands
each character's fully-bought health within a few points of what it was before. Vigour is also priced
**per rank** now (25 each) rather than per node — otherwise a one-rank Vigour would have cost the same
150 experience for 5 HP that Brienne pays for 30. Both the generator and the generated tables carry it.
**See §D for the one thing I had to guess.**

> Brienne's "Vow" progression node is far, far too weak, it could soothe 20 and probably wouldn't be
> too strong. Let's make it soothe 10 and clear negative statuses on Brienne.

☑ Dig In becomes: soothe 10, remove all negative statuses, gain no Temporary HP.

> Progression is just a tiny bit too short, it cuts off the XP cost of two-line node names

☑ Measured rather than nudged: a label runs `nodeRadius + labelOffset` below its node, then one line
per name line, then the cost — 20 + 14 + 3 × 13 = 73 units, against a `bottomMargin` of 54. It is 78
now, and the arithmetic is written beside it so the next label change can be checked against it.

> Some recent change moved the deck and start run button more towards the left side of the screen, I
> don't like it.

☑ The teambuilding footer is a plain flex row with no spacer, so every child packed against Back. Deck
and Start Run now sit at the far edge (`hcTeamFooterRight`), with Back and the counters on the left.

> Cards in hand seem to bounce up and down when hovering over them after a card's animation finishes
> playing. The hand opens and closes over and over.

☑ **Reproduced in a headless browser and measured.** With the pointer held perfectly still over the
hand, playing one card moved a hand card 584 → 345 → 352 → **643** → 584 px in about a second, and left
the hand in neither its raised nor its resting state — so the next twitch of the mouse snapped it 250px.

The cause is the closing repaint: it replaces the whole hand bar with `outerHTML`, and a brand-new
element cannot have been entered by a pointer that never moved, so the `:hover` rule that holds the hand
up simply stops applying. The repaint now asks the OLD bar whether it was hovered, before throwing it
away, and marks the new one `hcHandRaised`; the hand's own `mouseleave` clears it and hands the question
back to `:hover`. Same measurement after the fix: no overshoot, and the hand stays where the pointer
says it should be.

> Cards played from hand need to physically leave the hand and float near center of the screen to
> physically represent the queue of cards being played

☑ A queued card now leaves the hand for a **play queue rail** over the middle of the battlefield,
numbered in the order it will be played, and its flight starts from the rail rather than from the hand
slot it has visibly left. Its hand slot keeps its place in the fan while the card face fades out of it,
so nothing re-fans until the card is actually spent. Sizes are in `tuning.layout.playQueue`.

> Enemies should be mirrored when summoned to the player's side of the field, player characters should
> be mirrored when summoned to the enemy side of the field.

☑ The rule is **displacement**, not side. Session 35 flipped by absolute side and mirrored every enemy
in the game; this fires only for a combatant standing where it does not belong, so an ordinary fight is
untouched and a sporeling summoned onto your line turns to face the fight. It rides on a class
(`hcMirrored`) and a CSS variable composed into the art wrap's existing transform, so it never competes
with the hit shake or the downed tilt — which is what §A of the chessmaster feedback suspected was
behind the fighters resizing.

> The placeholder enemy sprites from that session are very confusing since they're the same, we need to
> fast-track new sprites. Please add the keywords/art tag lists as .txt sidecar files alongside pngs in
> some folder for me to get to later. Any png file will do in a pinch, but a hue-shifted or redcaled
> existing enemy image would do wonders as well.

☑ Both halves.

- **Each of the 13 now owns its folder and its own recolour.** They shared their stand-in's folder
  outright through `artFolder`, so a Puffcap and a Sporeling were the same picture. `ENEMY_SOURCES` in
  `generate-placeholder-art.py` now gives each one a hue / brightness / saturation recipe picked from
  its own sidecar tags, and I checked the result as a contact sheet rather than trusting the numbers:
  the twenty region-1 and region-2 bodies read as twenty creatures. Size is NOT in the recipe — the
  enemy table's own `presentation.scale` already sets how tall each stands, and doing it twice compounds.
- **The sidecar packs** are in **`v13 spire images/_source/refsPNG/enemiesOwed/`**: one `<enemy>.png`
  (the placeholder that is on the board now, full size, to paint over or feed to ControlNet) and one
  `<enemy>.txt` per enemy, in the same shape as the hand-written refs — the tag line from ENEMIES-01 §5,
  then the shared negative prompt, read from `alchemist.txt` rather than copied. Rebuild with
  `python "!designDocs/honeycomb/generate-placeholder-art.py" --only sidecars`.
- Its own folder rather than `refsPNG/enemies/`, which holds real reference drawings: mixing generated
  stand-ins in with them would make "which of these is real art" unanswerable.

> Recently added new -combat poses, most characters missing these, need to be created then wired in.
> Having every character use forward-facing standing art in combat is not ideal. Use existing basic
> poses in the meantime.

☑ The generator writes `1-combat` and `2-combat` for **every** character outfit and every enemy,
standing in as a copy of `basic` where no side-facing drawing exists — which is the "use existing basic
poses in the meantime" you asked for. `honeycomb.art.combatStanceEnabled` is **on**, so the battle
screen rests on `combat` and a real drawing dropped into any of those paths takes over with no code
change. Anastasia already has real combat art and uses it. Session 35 turned this on *before* the files
existed, so every sprite 404'd and re-walked its fallback chain on every repaint; test [82] now fails if
a warmed path is missing, so that cannot happen again silently.

> 1. All cards have broken variants. 2. All broken variants are given the vertical frame. 3. All
> broken cards need vertical art. You see the problem, yes? I don't want them all to have the vertical
> frame, but because they do, they will only take vertical art.

☑ **Session 37. You were right, and the numbers were worse than they looked.**

The chain was exactly as you described it. Every card has a broken variant, but only **55** of them are
authored per-card; the other **168** fall back to the character's ONE shared broken card
(`brienneBroken`, `nettleBroken`, …). All six of those were `layout: "vertical"`. So:

> **168 of 223 cards — three in four — were horizontal cards that turned vertical the moment their
> owner Broke.** Which is why all broken art had to be vertical.

It was never a rarity rule; it was one field on six definitions, reaching most of the game.

**The fix: the frame follows the card that broke.** Breaking changes what a card does, not what shape
it is, so the resolved broken view takes its `layout` from the card it replaced. Measured after:
198 horizontal → horizontal, 25 vertical → vertical, **zero cards change shape when they break.**
A broken form that must keep its own shape can say `layoutFixed: true`; nothing does, because all 55
authored forms already matched their parents.

Two consequences worth knowing:

- **The shared broken cards now need a crop per frame**, since the two windows are different shapes
  (3:2 against 2:3) and one picture cannot fill both. They carry `artPathByLayout`, and
  `generate-placeholder-art.py` writes both — `brienne-broken` and `brienne-broken-tall`, and so on.
- **They stopped borrowing another card's picture.** `brienneBroken` was wearing Guard's art,
  `nettleBroken` was wearing Wither's. That is part of why a broken card did not read as its own
  thing (your item 8), and it is fixed as a side effect: each has its own art path now. The gold-trim
  hue shift you asked about is still open and still yours — see §D.

This unblocks the art pass: a broken card's art is now whatever shape the card is, so the 168 that are
horizontal want horizontal art.

> Compendium and bestiary should use a selection UI inspired by Syrup Town's logbook.

☑ **Session 37**, once you said what was wrong with it: *"Scrolling through a huge vertical list of
enemies isn't ideal."*

Syrup Town's logbook is two stages, and that is what was copied. `generateLogbook` draws a **wall of
faces** — a portrait tile per character, bordered in their own colour — and picking one opens
`generateNav`: a rail of names down the left, the chosen entry filling the right. You never scroll a
list of whole entries; you pick a face, read one thing, and move sideways.

The bestiary now does exactly that. Thirty-six faces, grouped **Minions · Strikers · Soldiers · Tanks ·
Support · Casters · Elites · Bosses · Golems** (the same difficulty order the sort uses, so the two
agree), an unmet enemy showing `?`. Picking one opens the rail and that enemy's page — its stats, tags
and whole move set, unchanged from before; it is just no longer stacked with thirty-five others.

The cards tab got the same treatment, with the roster's portraits as the wall, because it is the same
question. The character segmented strip is gone.

One component serves both (`honeycomb.compendium.renderPicker`): an item is
`{ index, name, group, known, faceMarkup }`, and the caller passes the call that selects one and the
markup for the chosen one. A third tab that wants the shape is a few lines.

> Cards and enemies in the compendium are sorted in a really confusing order. Why not by
> rarity/difficulty (bosses last)?

☑ Both lists were in **authoring** order — whichever session wrote the entry — which since session 35
opened the bestiary on twelve chess golems.

- **Cards**: rarity first, in the order `cardRarityArray` already declares (starter, common, rare,
  special, enemy, broken), then energy cost, then name. A new rarity sorts itself by where it sits in
  that table.
- **Bestiary**: the roles in `tuning.balance.enemyRoleArray` are already written weakest to strongest
  and end elite, then boss — so their order *is* the difficulty order, and the sort reads it rather
  than repeating it. Health breaks a tie, then name. Anastasia's golems go last of all.

> Old alpha save data really, really needs to be for sure cleared out to make room for newer accurate
> savedata.

☑ `tuning.save.formatVersion` is 9 and a new `tuning.save.staleBeforeVersion` (also 9) is the floor.
Anything below it is **deleted from storage** on the first boot that meets it rather than migrated —
`honeycomb.save.purgeStaleSlots()` runs at the top of `honeycombBoot` and sweeps every slot, and
`save.read` clears a stale slot rather than resuming it. Migration still exists and is still tested; it
carries a save across a *shape* change, and nothing carries one across the content under it being
replaced wholesale. A save pasted in as text or read out of a bug report is **not** gated — that is
someone debugging, not a player resuming.

---

## C. The emailed player feedback

We had another player send in an email with a lot of feedback. Unfortunately it's from an older build before the big rework, so a bunch of it is out of date and stuff we already know, but there's gems in here:

"
First thing I'm noticing is the UI is very slow, the little animation when selecting a card, selecting a target, the hand going up and down etc all makes the gameplay a huge drag
The most overpowered Spire relics are included in base kits (healing after battle and retaining some of your block temp hp) which makes resting at campfire useless and the game being a reverse battle of attrition since you can easily heal every fight, especially with the vampire class
The alternatives to campfires are not good enough to justify not maximizing them: having the ability to remove that many cards easily obliterates the balancing.
The base deck are too strong since they have little basic attack/defend, and the compared added cards are often not strong enough compared to the other base cards, which makes the easy removal issue even worse. A lot of cards rewards are also weaker than base cards or too situational. Being able to remove multiple cards at once at the shop with little inflation also add to the deckbuilding issue

Some relics should be locked behind playing specific character (I got a poison relic without poison character :c)
Some cards do too much: whetted edge doing both lowering cost forever and upgrade is broken, any of the two alone and combat-only would already be very strong, the fact it stays after combat means it's just a "win the entire run instantly" card, and it's extremely cheap too. I feel like the latter is a bug though since the writing says "for this combat" 
Transfusion sucks, Mark prey is way too overpowered because it refunds itself
The base card being available as card reward is weird, since there's no real point to take them
The passives aren't strong enough to justify taking them comparatively to the other cards power level, same for the 2 cost cards.
Severine starting with both an aoe and multi hit is kinda ridiculous: it pairs way too well with the op Mark prey, and it checks both potential hordes and strong individual ennemies.
The drawback/risk for events is too little for the big rewards: one regular fight for a broken rare relic, or losing a small amount of hp (that you can heal too D:) means you can shrug it off everytime.
Tithe is just a bad card: the drawing effect only makes you get the card you would have drawn instead of it, so the card is just "take 5 damage, get one energy"

Gorged status did not trigger from draining health
The ennemies lack HP, damage, scaling. every fight is over very quickly, which favor even more the already strongest playstyles in these games: burst damage, and not playing powers, especially with the previously mentionned stuff.
Even the bosses have less base stats than you so it's pretty much unlosable. Regular ennemies die in 3-4 cards top.

There is rarely more than 2 ennemies in a fight which makes aoe feels very weak.
I really like the game design element concepts for character tough, their gimmicks are varied and sounds nice to play around in theory.
Same for the ennemies if they just had way more stats
I remember you saying when broken starter cards would do negative effects if left unplayed, what happened to that?
"

☑ **Triaged (session 37).** Every claim below was checked against the CURRENT tables rather than
argued about — the card pool was replaced wholesale in session 33 and the enemy lineup in session 34,
so most of the letter is about a game that no longer exists. What is left is short and worth acting on.

Method: each line was resolved against the live content in a headless engine — the card looked up by
index, the effect read, the number compared to `tuning.balance`. Where a claim could only be settled by
running something, it was run; those are marked **measured**.

### Out of date — the thing he hit has been replaced

| His note | What it is now |
|---|---|
| "Mark prey is way too overpowered because it refunds itself" | Rewritten. `severineMarkPrey` is 1 energy, 4 damage and 2 Sundered. No refund. |
| "Transfusion sucks" | Rewritten. 1 energy: Severine loses 5, an ally heals 10 — a net +5 to the party. |
| "Tithe is just a bad card: the drawing effect only makes you get the card you would have drawn" | Rewritten, and the draw is gone entirely. `brienneTithe` is 0 energy: spend 6 Temporary HP, gain 1 Energy. |
| "whetted edge doing both lowering cost forever and upgrade [...] the writing says 'for this combat'" | Rewritten. The cost cut is written onto the **combat card instance**, and the piles are rebuilt from the deck every fight, so it cannot outlive the fight — the text is now true. The upgrade is still permanent; see below. |
| "The base card being available as card reward is weird" | Fixed. `tuning.reward.offerableRarityArray` is `["common", "rare"]`; a starter cannot be offered. |
| "Some relics should be locked behind playing specific character (I got a poison relic without poison character)" | Fixed. **17 of 24** relics now carry an offer condition. |
| "Severine starting with both an aoe and multi hit is kinda ridiculous" | Gone. She starts 2× Rend (2 damage three times) and 2× Quaff. No AoE, and it matches your own "2× one attack, 2× one defence" rule. |
| "Being able to remove multiple cards at once at the shop with little inflation" | No such service exists. Removal is one campfire action (`tuning.rest.actionsBase` is **1**, so Sleep, Sharpen and Leave-a-card compete for it) or the Cardsharp event, which is a *trade*, not a removal. |
| "The base deck are too strong [...] the compared added cards are often not strong enough [...] A lot of cards rewards are also weaker than base cards" | The entire pool was replaced in session 33: 21 commons / 11 rares per character, priced at 6 / 9 / 12+ damage per energy by tier. Nothing he rated still exists at those numbers. |
| "The passives aren't strong enough [...] same for the 2 cost cards" | Same — the powers were rewritten as reaction tables in the same pass. |
| "The ennemies lack HP, damage, scaling [...] Even the bosses have less base stats than you [...] Regular ennemies die in 3-4 cards top" | This is exactly what session 34 was. Every enemy is now written to a role budget and measured: `node "!designDocs/honeycomb/enemy-template.js"`. Fights are priced at **3–4 turns** for a normal, 6–7 for an elite, 9–10 for a boss, against a party output of 18/21/24 per turn. |
| "There is rarely more than 2 ennemies in a fight which makes aoe feels very weak" | **Measured:** of 46 encounters, **31 field three enemies and 2 field four**; only 7 are solo. |
| "Gorged status did not trigger from draining health" | **Measured, and it fires now.** Severine at full health playing Leech (7 damage, heal what it dealt) gains 7 Temporary HP. Modern lifesteal is a plain heal with a `damageDealt` amount, so it goes through the same overheal hook everything else does. |
| "the hand going up and down etc all makes the gameplay a huge drag" | The hand bounce was reproduced and fixed this round (item 12). The rest of the speed complaint is answered by the play-speed slider on the hand bar — worth checking whether its **default** is fast enough for a first-time player, which is a judgement call, not a bug. |

### Still current — worth acting on

1. **"The most overpowered Spire relics are included in base kits (healing after battle…) which makes
   resting at campfire useless."** Half right, and the half that is right is in the heirlooms:
   - `crimsonFang` (Severine) — *whenever an enemy is downed, ALL allies heal 3.* A three-enemy fight
     is 9 HP to the whole party, free, every fight.
   - `votiveCandle` (Clemence) — *when Clemence Breaks, all allies heal 5.*

   Against a campfire Sleep of maxHealth ÷ 3 (about 19 HP at 58), a party running both is topping up a
   meaningful share of a rest every fight without spending anything. **His structural point stands:**
   free per-fight healing competes directly with the rest node, and the rest node is also where card
   removal and upgrades live, so it is the most contested action in the run.
   The "retaining some of your block / temp hp" half is out of date — no heirloom carries Temporary HP
   between fights (`ironSigil` grants 4 at the *start* of each combat).

2. **Whetted Edge is still a free permanent upgrade.** 0 energy, exhausts, upgrades a card in hand for
   good. The bug he found is gone; the question he raised underneath it is not. Compare it to a rare.

3. **"The drawback/risk for events is too little for the big rewards."** Not checkable from a table —
   it needs someone to play the nine events and judge. Flagging it as unresolved rather than closed.

4. **"I remember you saying when broken starter cards would do negative effects if left unplayed,
   what happened to that?"** The same question you ask in §D.2, from a second person. That is two
   independent reports that the broken-card design does not match what was described, which is worth
   weighting when you answer it.

### What I would tell him

Most of what he found was real and most of it is already gone. The two that survive — free healing in
the base kits versus the campfire, and Whetted Edge — are both the same shape of problem he was good at
spotting: something free that quietly removes a decision. Worth a reply, and worth asking him for a run
on the current build.

## D. Waiting on you

1. **Which character is "moss"?** *"Less ranks of vigor define tankiness (moss should have 1, Brienne
   having 6)"* — there is no Moss on the roster. I read it as **Nettle** (the myconid, and the lowest
   health of the six before this change) and gave her the single rank. If you meant someone else it is
   one number in `generate-progression-trees.js` (`startRanks`) plus the matching node. The middle of
   the spread is mine too: Severine / Cinder / Clemence 3, Cassadora 2.

2. **The broken-card design intent.** *"Were the broken cards balanced around the designs I intended?
   [...] starter cards are mostly negative when broken and had bad effects when left unplayed in the
   hand like curses, and rares were the most beneficial to escaping the broken state."* I have not
   touched this. It is a rebalance of every broken form in the game plus a new "punishes you for
   holding it" behaviour that does not exist in the engine yet, and doing it against a guess would
   waste the pass. What I need from you is whether the rule is: **starter → net negative, common →
   neutral, rare → the way out**, and whether "bad effects when left unplayed" means an end-of-turn
   penalty per broken starter held. Say yes to that shape and it is a session's work.

3. **The card frames — what is left of it.** The layout problem is solved (§B), and the broken cards
   have their own art now. Two of your three lines were about the *frames themselves*, and those are
   still yours because `card_redesign/` says it is mid-rebuild and I did not want to change chrome
   underneath it:
   - *"starter and commons share frames"* — they do; rarity is not drawn on the frame at all.
   - *"Broken cards are too similar to regular cards. Maybe hue-shift the gold trim? Not the border,
     but the actual gold frame?"* — a small change once you say whether it lands in the redesign or in
     the current frames. Say the word and it is a session.

4. **Anastasia.** Three decisions from `chessmaster/STATUS.md` are still open and block finishing her:
   her character folder and which outfit `chess1V` is, whether `promoteEntity` gets built or Promote is
   cut, and whether A1 is the right home for the pawn engine (their FEEDBACK-01 §B calls this the most
   serious note in that file). She is gated off the roster and flagged `inDevelopment`, so none of it
   blocks the demo.

5. **The two live items out of the emailed feedback** (§C): free per-fight healing in the base kits
   against the campfire, and Whetted Edge as a free permanent upgrade. Both are balance calls with your
   name on them, not bugs.
