> **CLOSED session 38.** Every item still open when this round closed was moved verbatim into
> `../FEEDBACK-09.md`; nothing here is live. Kept whole for the quotes and the annotations.

# Honeycomb — Feedback round 07

The live round. **Only OPEN work lives here.** Finished items, with their quotes and annotations, are
moved to `Archive/FEEDBACK-07-DONE.md` (session logs for 14, 15, 20 and 21; all of B; the tooltip table;
the card frames; the debug unlock; E/E2 and the outfit-vagueness pass; every sorted section-F report
except what is listed below; and the performance history in C). Round 06 is `Archive/FEEDBACK-06.md`.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a quote
disagree, the quote wins.

**Keep this file current task by task** (BASICS, "Documentation rules"): when an item lands, annotate it
here at once so a session stopped midway can be picked up from this file alone.

**Housekeeping**: At the start of each session, export completed tasks to archives, and sort in the unsorted feedback/changes at the bottom into appropriate sections.

Status key: ☐ not started · ◐ partly done · ⏸ waiting on Noodle

**The per-node truth for what still does nothing is `rework/WIRING-STATUS.md`.** Sections G2, G3 and G4
hold the rest-site, progression-node and card-banishing feedback from sessions 26–27.

## Status board

| | Item | Section |
|---|---|---|
| ◐ | **A2 — the Battle Lab**: an edit MODE on the battle screen (+/− on the lines, plates, orb, deck). Built and driven in a browser; waiting on Noodle's pass | A2 |
| ⏸ | **Telemetry: pick an endpoint** — `TELEMETRY-01.md` answers "is it possible" (yes, but not on neocities/itch themselves). Nothing is built until you choose | D2 |
| ☐ | The sound library has **no short movement stem** — five Cinder cards stand in with `miscCreak` | D2 |
| ☐ | Four sound files are **too quiet at source** to reach the target: `lewdSquish`, `lewdSlap`, `!outfitChange`, `lewdSwallowing` | D2 |
| ⏸ | Phone re-test of session 15 + 21's performance fixes (read `cadence`). The loading screen is gone — do not look for it | C |
| ◐ | "The hand does not feel good" (10-card cap done; the rest is the feel/legibility pass) | D1 |
| ◐ | Too many statuses (warning rule done; card prose is content work) | D1 |
| ◐ | Remaining performance levers (3, 4, 5, 8, 9, 11, 12; 6 and 7 done) | C |
| ☐ | Broken art per outfit (needs outfit art first) | D1 |
| ◐ | E — **Nettle** has no draftable card that touches an ally; Cassadora has one. (Severine's half of this note was stale) | E |
| ⏸ | E3 — the draft simulation's Tier A/B cut list: act, or wait for a run-length model? | E3 |
| ☑ | **Progression trees** — skeleton + six trees done, `audit-trees.js` green; **every node wired (256/256; Cinder *Reversal* included). Session 29 cleared A2, all training wheels, every Exclusive A path, all Exclusive D choose-one forms, U2, Studied Foe/Soothing, then fixed cinDef2, Sundered rounding, Second Thoughts, Steel's text, the tall-tooltip bug, the choose-one card text and the three outfit-window requests. **Content fidelity closed too:** the 7 stand-ins, the 0-damage type flip and the A1/A2 ability table were all replaced with the design. Only U2 (outfit ladders) and the A1-gated OFFER stay deferred. See `rework/WIRING-STATUS.md` | G |
| ◐ | **The card pool overhaul** — session 32 settled the foundational numbers (`rework/BALANCE-01.md`, `tuning.balance`, `budget-audit.js` + its first report) and wrote the pool brief skeleton (`rework/CARD-POOL-01.md`). Follow-through: mechanic corrections, six per-character grids, verdicts, then the cards. Healing stays uncapped by engine rule (Noodle). **Session 33:** pool size corrected to 12 C + 5 R base, +3 C + 2 R per alt outfit (21 C / 11 R final); rates corrected to 6 / 9 / 12+ per energy by tier; all six grids drafted (192 cards) with a cut list. **Built the same night:** all 192 cards + 31 Clemence broken forms are live, 17 retired, Resolve/Devotion/Stride corrected (maxima 100), suite 1615/0, warnings 0. Open: unlock routes (every alt outfit is unlocked from the start, so gated cards drop immediately), card art (131 `artOwed`), the enemy pass, and Absolution (Clemence's A1 still soothes allies) ⏸ | G10 |
| ◐ | Card art prompts rewrite (Brienne done; the other five + neutral still table-derived) | A |
| ☐ | A — goals before demo release (the rest: unlock distribution, OSTs, VFX) | A |

Closed in session 22: Cinder's ally-move gate (two cards, not three), the card rarity gem (deleted),
the loading screen (deleted), and every sound assignment (measured). See D2.

Closed in sessions 26–27: the tree overhaul and auditor, the notes reconciliation, the four stand-in
verbs, the strip-defaults, the rest-site system and its feedback round, event/rest persistence, card
banishing, mechanic gating behind A1, and the first progression-node text/UI feedback pass. Details under
G, G2, G3 and G4, and the CATCH-UP session 26–27 block.

Tests: **1487 passed, 0 failed, 0 pending.** `node "!designDocs/honeycomb/test-honeycomb.js"` ([78]
card telemetry, [79] the sound library, [80] the poison barrage and its maths, **[81] sound measured
rather than named + the barrage pace, [82] every named image is a file that exists, [83] the Battle
Lab's engine seams, [84] run-start random cards, [85] run-start random replacements, [86] in-place
starter upgrades, [87] progression node mechanics (all 56 newly wired indices enforce; nothing is
PENDING), [88] the
stand-in verbs -- scry, random status, health fraction, debuff count, [89] every NODES-LIST §D
rest-site option and the Rest Lab, [90] card banishing and the fallback card, [94] tooltip placement
never covers its anchor**; the card-pool rework is
in `MECHANICS-02.md` and `CARD-AUDIT-01.md`; the draft
simulation and cut report are in `DRAFT-SIM-01.md`; the trees are specified by
`rework/TREE-DESIGN.md`).

Three more checks that are not the test suite, and should be run when their subject changes:
`node "!designDocs/honeycomb/sfx-report.js"` (**0 findings**) after any sound assignment,
`!designDocs/honeycomb/sfx-report.html` to re-measure the library after any sound FILE is replaced,
and `node "!designDocs/honeycomb/audit-trees.js"` (**every hard rule passes**) after any change to a
progression tree.

How to look at the game: set `devPreviewTarget = "honeycomb"` in `scripts/index.js` and load
`http://localhost:8000/index.html` (`.claude/devserver.py 8000`). opencode's agent can also drive a browser
headlessly — see the "Browser tooling" section of `BASICS.md`.

---

## A. Goals before demo release

Noodle's list, lightly grouped. These are the direction of the next phase, not a checklist of bugs.

**Cards, characters and enemies**
- Less "clunky" card handling.
- Redesign starting decks, card pools, and unlocks again to better follow the mechanical and character design bibles.
- Redesign enemies to make them more interesting and varied, based on the mechanical design bible principles.
- More enemies and a second boss. ☑ **(session 16; archive).**
- Distribute unlockables through the game. ☐ **Open.** `progressionArray` with global/personal pools,
  ranked/exclusive nodes and `unlockOutfit` is the seam; missing are authored nodes naming cards,
  outfits, equipment and relics.

**Art and prompts**
- Create space for the agent to come up with prompts for safe parts of the game. ☑ **Done in effect** —
  the art pipeline's tools and `card-prompts.js` are that space.
- Add character prompts to the webui engine's character database. ☑ **(art pipeline step 3).**
- Create standardized prompts for the other images core to the character. ☑ **(art pipeline).**
- Design actual prompts for the alternate outfits. ☑ **(art pipeline, OUTFITS.md).**
- Write a first pass of art prompts for each card. ☑ **(session 21, archive: `CARD-PROMPTS-01.md`).**
- Rewrite the card prompts; the table-derived first pass was too samey. ◐ **Brienne rewritten (session 23).** Noodle: *"Deepseek really deep-dicked everything it touched, nearly all of the suggested prompts it laid out are super similar, it'll turn out really boring. I'd like to see how creative you can be, so please narrow in on Brienne for now."* Hand-authored lines in `card-prompts.js` `OVERRIDE` (camera first, one glance-silhouette, sneaky lewd on SFW, very lewd on Steady / Shelter / Alms). Compiled through the webui engine: identity + outfit land, no white-background cull. Nettle / Severine / Cinder / Clemence / Cassadora / Neutral still the table-derived pass.

**Audio**
- Assign sfx to cards, enemies, and stingers for descent, and find anywhere the remaining sfx can be used for a better experience. ☑ **Card + stinger assignment done (session 21, archive); enemy and descent assignment still open.** ☐
- Generate map, battle, elite, and boss OSTs. ☐
- Figure out how to loop an OST without replaying the whole song. ☐ (`platform.sound`/`playFile` is the
  seam; an `<audio>` loop with a crossfade point is the known shape.)

**VFX**
- Generate and assign vfx to cards. ☐

### A0. Scope and direction (settled session 13)

- **Six characters, two bosses. Do not cut anyone.** The first three are simple, the second three are
  complex and creative; there is no obvious one to lose. The target is two bosses, not one.
- **None of the marquee mechanics are original**, and the pitch should stop pretending otherwise: party order
  and lust/Broken are near-Darkest-Dungeon; sister mechanics are Slay the Spire 2 (and mechanically present in
  StS1); outfits are a customization layer over the same cards. The demo's edge is **execution, art, and the
  lust narrative**, not mechanical novelty.
- **Outfits are expensive**: each new outfit is a new generated asset set. Worth it, but budget for it
  rather than treating outfits as free content.

### A1. Session 14 rumination on the demo goals

Not acted on; the shape of the work, for Noodle to redirect.

**1. "Less clunky card handling" is three separate problems, not one.**
- *Feel* (the replay): queueing and the hand-motion replay are the foundation; the enemy-turn overlap
  landed in session 14. What is left is a "skip seen beats" pace and the repaint cost (C, lever 3).
- *Rules* (the hand): the 10-card cap is in. A hand of mixed owners reads as one pool; the party order
  preview and the owner pip are the tools that make it legible. A tuning/presentation pass, not engine work.
- *Legibility*: card sizes, supertype bar, text fit and the vertical-card wash are in. The remaining lever
  is a real card-face art pass (`ART-GUIDE.md`, and `card-effects-preview.html` for the new frame).

**2. Redesigning decks/pools/unlocks should follow the MECHANICS-01 archetypes, not precede them.** The
`archetype` field and `archetypeWeightArray` already make an outfit a build-around; the work is content:
score each character's three sister mechanics against the bibles, then rewrite the starters and the offer
rates. `honeycomb.warnings` should gain rules for whatever limits the redesign settles on.

**3. Enemies: the fielded set is small, and the generator can prove it.** *Done session 16 (Juggernaut +
the drawn roster).*

**4. Unlock distribution is a progression-table job, and the table already exists.** See the open item
under "Cards, characters and enemies".

**5. Audio and VFX are assignment passes over existing tables.** Card sfx assigned (session 21); OST
looping is the one engine question.

**Suggested order:** (a) the performance levers that are pure wins; (b) the second boss and 3-5 enemies;
(c) the deck/pool rewrite against MECHANICS-01; (d) unlock distribution; (e) art, audio and VFX in parallel.

### A2. The Battle Lab — a debug battle environment for animations, sfx and statuses

Noodle, session 22, verbatim:

> With what is left of your rate limits, I need you to make a debug test battle environment that will let
> me play any card in the game so I can test every animation and sfx. I need to be able to add enemies and
> party members of my choice to either side. Replace the "Start a test battle" option with this test
> environment.
> I also need to be able to end turns to test status effects and pick which card the enemies will use.
> Make this part ### A2. in feedback-07 so another agent can try and pick up if you're interrupted by rate
> limits midway.

**This section is the hand-off. If a session ends midway, the next one reads this and continues from the
checklist.**

#### The shape — and the first attempt, which was wrong

It was first built as one large overlay panel listing everything. Noodle, on seeing it:

> The window approach is unviable. Not only does it take several clicks to open the lab, but the lab being
> a window means the rest of the screen is blocked, and not having any visuals means that not only are
> cards harder to pick from as I need to remember them by name, but I need to then go back out of the
> window through multiple clicks to check if I got the right one and try it.
> The vastly superior solution would have been to use the game's engine to our advantage. To make it a
> toggle and trigger an empty battle, allowing me to click a + button over the enemy side to bring up
> enemies, click a - button over them to delete them, click their intent to change it, do the same with
> allies, click on my deck to get a list of the game's cards (sorted) and click on one of those to draw it
> to my hand, click on health to manually edit tHP, HP, and lust, and click on my energy to change it.

**The rebuild follows that exactly.** The lab is a MODE the real battle screen enters, not a screen of its
own. Three rules came out of it and should survive any future change here:

1. **Nothing blocks the board.** The only thing that ever covers it is a picker the tester opened, and
   every picker closes on the choice that opened it.
2. **Everything is picked by its picture.** Cards and enemy moves are shown as real card faces
   (`honeycomb.ui.card`), combatants as portraits. Picking from a list of names was the other half of
   what made the first build unusable.
3. **The handle is on the thing.** The plate edits the plate's numbers, the orb edits energy, the deck
   opens the deck. Nothing is reached through a menu.

#### How it is driven

`honeycomb.lab.active` puts `hcLabMode` on the root; the combat scene then grows edit handles in place.
With it off, none of those elements are drawn at all — verified: the deck's `onclick` goes back to
`pileView.show`, the orb has no `onclick`, and the root class is clean.

| On the board | What it does | Engine seam |
|---|---|---|
| **+** at the inner end of a line | portraits of every enemy and every character/outfit; one click stands them there | `honeycomb.summonCombatant({ side, … })` |
| **−** on a body | takes it off the board (not a death: nothing logged, no hooks) | splice + `scene.go("combat")` |
| **↺** on a body | full health, no lust, no statuses, standing | direct fields |
| the **telegraph** | that combatant's whole move set as cards; one click telegraphs it | `honeycomb.changeIntent` |
| the **nameplate** | HP, max HP, tHP, Lust, and every status at any stack count | direct fields, `honeycomb.applyStatus` |
| the **energy orb** | set energy, or fill it | `honeycomb.setResource` |
| the **draw pile** | **every card in the game**, as card faces, sorted by owner → rarity → name, with Base / Upgraded + / Broken-forms toggles; one click draws it | `honeycomb.addCardToPile(index, "hand", context)` |
| the **LAB badge** (top-left) | ⚡ fill energy · ∞ suspend win/loss · × turn the lab off | — |
| **End Turn** | the real button. Statuses tick at turn boundaries, so this is how one is watched | unchanged |

Reached from **Debug Tools → "Battle Lab (empty battle)"**, which starts a fight with the party as it
stands and **nothing opposite**. It is also reachable mid-fight (Menu → Debug Tools).

#### Traps found while building (read these before changing it)

- **`combatScene.repaint()` REPLACES `honeycomb.state`.** It calls `forecast.refreshStanding`, which runs
  a dry turn and rolls it back by restoring a snapshot. Any entity reference held across a repaint is
  stale, and writing to it writes to a discarded copy. **Always re-look-up by `instanceId`** — this cost
  an hour of "the edit did not apply" when it had applied perfectly to the wrong object.
- **`.hcFighter` is a full-height column with the body at the BOTTOM.** Handles anchored to its top
  render a third of a page above the character they belong to.
- **The hand shelf's end piece is 367px of painting** across the bottom-left corner and swallows anything
  placed at the first two allies' feet. The handles sit just above the nameplate for that reason.
- **A side's flex end is the OUTER corner** — the same corner as the energy diamond and End Turn. Both
  `+` buttons are absolutely placed at the INNER edge instead.
- **`repaint` rebuilds the battlefield's `innerHTML`**, so anything added to that layer (the badge) has to
  be re-emitted there too, not only in the scene's first build.
- **A card's owner must be in the party.** `honeycomb.defaultOwnerFor` gives a created card to the party
  member whose character it names; absent, owner-relative effects do nothing the card's text promises.
  The catalogue dims those cards and marks them ⚠ rather than letting it be discovered mid-test.
- **`summonCombatant` refuses past `tuning.scaling.enemyLimit`** and returns null. The refusal is
  reported, not assumed away.
- **The hand cap is 10** (`tuning.combat.handSizeMaximum`); the catalogue says so rather than seeming to
  fail.
- **`combat.labNoEnd` is the one new engine flag**, read in exactly one place (`honeycomb.combat.checkEnd`).
  Without it an emptied enemy line is an instant victory. It defaults ON inside the lab and OFF everywhere
  else.

#### Verified in a browser (session 22)

Enemy added by portrait · character added to the party · character stood on the ENEMY line · enemy put in
the party · body removed · intent chosen from the move cards · 118 card faces listed and one drawn · HP
7 / tHP 12 / Lust 30 set by hand · 6 Poison applied · End Turn ticked it (12 → 11 stacks, 7 → 0 HP) **and
the fight did not end** · energy set to 42 · lab turned off and the shipped screen restored exactly.

#### Checklist

- [x] `honeycomb.lab` as a MODE, not a window; `hcLabMode` on the root, re-applied on every scene build
- [x] "Start a test battle" replaced by "Battle Lab (empty battle)"
- [x] + / − / ↺ handles on the lines and bodies, anchored clear of the shelf art and the corners
- [x] Telegraph → move picker, as cards
- [x] Nameplate → HP / max HP / tHP / Lust, plus every status at any stack count
- [x] Energy orb → energy
- [x] Draw pile → every card in the game as card faces, sorted, with upgrade and broken-form toggles
- [x] LAB badge: fill energy, suspend win/loss, turn off
- [x] `combat.labNoEnd` honoured in `honeycomb.combat.checkEnd`
- [x] Test block `[83]` covers every seam the lab drives
- [x] With the lab off, the battle screen is byte-identical to the shipped one
- [ ] **Noodle's own pass.** Anything it cannot reach goes here as a new bullet.

---

## C. Performance

The full history (Noodle's two named fixes, the session-12 cause list, three phone reports, the session-21
loading screen and reduced-effects additions) is in `Archive/FEEDBACK-07-DONE.md`. What is still open:

⏸ **Phone re-test.** The idle cost found was the nameplate lightning timer (now a compositor
animation); reduced effects also lost the fighter art's blurs; the reticle wobble is fixed. The monitor
prints `cadence`: **~33ms (~30Hz) means a battery saver is capping the page**, not the game; trust
`missed` over `dropped`.

**Two session-21 items are gone, so do not look for them** (session 22, see D2): the loading screen is
deleted — measured, it could never finish its warm on the connection it was gated to — and reduced
effects no longer drops the card-frame TINT, because that was a card's only type signal on exactly the
touch devices reduced effects turns itself on for. It drops the extra blend LAYERS instead, which is
cheaper and keeps the colour.

☐ **The remaining levers from the session-12 cause list** (numbers as in the archive):
3. Combat repaints rebuild the whole screen from `innerHTML` every `afterBeat` (sides, hand, top bar). ☐
4. Forced synchronous reflows (`void offsetWidth` restarts; `getBoundingClientRect` in drags/forecasts). ☐
5. Forecasts snapshot and restore a large state on the hover path. ☐
6. Expensive CSS effects — ◐ **revised session 22**: the card-frame tint is BACK (it carries the card's
   type); what reduced effects drops is the extra blend layer per type, so a multi-type card draws one
   frame instead of three. Legal-target glows are deliberately kept.
7. `will-change` hints — ☑ **fighter sprites and floating numbers covered (session 21)**.
8. Many small DOM writes per beat (floating numbers, trails, plate rebuilds). ☐
9. Large synchronous boot payload. ☐
11. No "fast" fallback / skip-seen-beats pace. ☐
12. VFX SVG filters are GPU work per effect. ☐

---

## D. Bug / feedback reports (round 07)

#### D1. Reports

> The primary bug reports have been "the hand [of cards in battle] does not feel good". Investigating this is a high priority.

◐ High priority; the "clunky card handling" goal in A (see A1.1). **Decision (Noodle, session 13): cap the
hand at 10 cards** — done and confirmed in session 14. The rest of the investigation is open: the feel/pace
pass and the repaint cost (C, lever 3).

> There are way too many statuses in the game: A lot of unique ones should be replaced by just saying the card's effect in the text, rather than saying "Gain 1 gorged." and leaving the explanation of that to the tooltip.

◐ **Settled rule (Noodle, session 13):** a passive that sticks around turn after turn may live on the status
bar, but if only ONE card uses it, do NOT name it as a status keyword — write the effect out in the card's
text instead. It still shows on the status bar; it is simply not a named status. (Slay the Spire's own rule.)
The warning-rule half (`orphanStatus`) is done (archive), and the session-20 card pass applied the rule to
most prose. **Open:** the remaining card prose that still names a one-card passive.

> Brienne should only be gaining resolve when she takes damage, to make it simpler, 1 for every point of damage taken.

☐ **Open.** Resolve is a per-fight meter (`honeycomb.combat.js`, entities.js). The current accrual is
not this rule; simplify it so only damage taken adds Resolve, 1 per point. Queued with the next
combat/card pass rather than done blind.

> The "Broken" character assets should be made outfit-specific, otherwise when proper alternate outfit assets are added the art won't match.

☐ **Create Placeholders.** `brokenArtPath` / `brokenBackgroundPath` are per-character fields the resolver
already reads; an outfit version means resolving them through the worn outfit
(`honeycomb.art.characterFolder`), exactly as the Exposed cut-in now does. Deferred until outfit art exists.

## D2. Session 21's audit — every claim re-tested in a browser (session 22)

Noodle, opening session 22:

> Last session was a disaster. Working on FEEDBACK-07, some weird behavior led to making wide sweeping
> changes without forethought or testing. The worst of it was you assigning a multi-second long ambient
> wind noise sound effect as the new card draw sfw. I fixed that myself by using the much more fitting
> move sound effect from syrup town. Given the lack of testing and how egregious that mistake was, I was
> hoping you could do a much more thorough and careful pass making sure changes actually work and fixing
> what was broken.

Every item below was **reproduced or disproved in a running browser** before anything was changed, and
the fix re-verified the same way. Where a claim turned out to be already fixed, that is said plainly
rather than quietly counted as work.

The cause of the whole round is worth naming once: **session 21 assigned sounds by reading filenames.**
Measurement says the library spans 0.2–11.9 seconds of audible sound and 22.7 dB of loudness, so a
filename cannot tell you whether a file fits the moment it is given. `miscWind` is 11.9 seconds of
ambient wind. That is why it reached the card draw — and it was **still on five of Cinder's cards**
when this session started.

---

> Poison does not appear to be doing rapid-fire beats and is still using syrup town sfx

☑ **Fixed; the "rapid-fire" was real but defeated.** Measured in the browser: the damage beat asked for
`poisonTickMs` (90ms), and then poison's own **stack decay** was replayed as a separate `status` beat
costing a full `statusPulseMs` (320ms). So the barrage ran at **~410ms an enemy, not 90**.

A log entry may now name a `pace` (`tuning.animation.beatPaceMsMap`); poison's decay and Intoxicated's
lust name `barrage`, which costs the replay nothing — the pulse still plays, it just does not buy its
own beat. **Re-measured at ~110ms an enemy.** `removeStatus` takes an `options.pace`, so any future
status that rides another beat is one argument away.

The sfx half was already the library (`poisonTick` → `debuffSingle`) before this session; it is 1.15s
audible, which is inside the new `tick` limit of 1.2s.

> Enemy cards were not assigned sfx

☑ **Verified working.** Instrumented a real fight: an enemy move plays its stem from `cardSfxMap` in
the `moveUsed` beat. This one was genuinely fixed in session 21's follow-up.

> The broken sound effect sounds like it's also playing the syrup town sleep sfx

☑ **Verified fixed, and a real mis-sync found underneath it.** Triggering the cut-in now logs exactly
one sound, `!broken.mp3`. Nothing plays alongside it.

> Also, how would you even test the delay on the chain breaking sound?

By sampling the snapped chain's computed opacity **every animation frame** and comparing it to when the
sound's timer fires. Doing that (165 frames, ~18ms apart) put the chain's whole→snapped swap at
**1062–1078ms** of a 2741ms cut-in, and the sound's timer at **998ms** — but `!broken.mp3` opens with
**160ms of silence**, so its *attack* was landing at ~1158ms, about **70ms after the chain had already
broken**. Two fixes: `stingerSnapFraction` now aims at the measured swap (0.06 → 0.1), and
`platform.soundLeadInMs` subtracts each file's measured lead-in so it is the SOUND that lands on the
snap, not the file that starts on it. Re-measured: audible onset **1074ms**, inside the swap window.

The procedure is repeatable — it is written into the comment above `stingerSnapFraction`.

> The card preview does not appear to have been tested in browser, the text and layout looks awful

☑ **Fixed, and the page now checks itself.** Measured: the ribbon ran to 81.6% of the card and the text
panel started at 71%, so they overlapped by **46px** and printed two lines of text over one another.
The text also overflowed its box with nothing to stop it, and one of the three filter-lab cards
(`damageCrack`) rendered **completely blank** — its `discrete 0 0 0 1` threshold erased the whole card
instead of speckling it.

- Text panel moved below the ribbon, given a height control, and set to clip rather than spill.
- Every length on the card is now a share of the card's width, with a **card width** slider, so the
  composer shows true proportions at hand size and at read size instead of lying at a fixed 12px.
- A **live readout** names any overlap (with the percentage that would fix it) and any text overflow
  (in lines). Confirmed it catches the exact bug that shipped.
- `damageCrack` rewritten to `fractalNoise` with the threshold inverted; it renders now.

> I didn't ask for sfx to be auto-assigned, there's a ton of extremely ill-fitting ones. Why is enthrall
> playing a slapping sound effect? Why do none of the cards I tested that debuff the party play the party
> debuffing sfx?

◐ **The auto-rules are gone and the table is now audited, not eyeballed.** Enthrall was already moved to
`magicWeird` in session 21's follow-up. What was still wrong, and is now fixed:

- **17 assignments were longer than the moment they played at**, including the five Cinder cards still
  on the 11.9-second `miscWind`, eleven cards on the 4.8-second `lewdSquish`, and Gorge on the
  7.6-second `lewdSwallowing`.
- **Four "shape" mismatches** of exactly the kind the report asks about: `Hex` and `Clutter` push a
  curse into the party's *shared* piles and so reach the whole line, but played the single-target sound;
  `Transfusion` and `Heartsblood` are net heals for an ally that played a debuff sting.
- **Every damage instance played a metal clang.** `damageDealt: weaponClang` fired on top of the card's
  own sound, 6ms later, once per hit — so Nettle's necrotic touch clanged, and a multi-hit card clanged
  several times. Replaced by `damageTypeSoundMap`: a card's own hit is **silent** here (the card already
  spoke a beat ago) and only damage with no card behind it — poison, thorns, a riposte — speaks.
- **Four seconds of footsteps on every party shift.** `playPartyShift` and the two summon beats borrowed
  the `nodeEnter` event, which is `miscWalkingWood` (3.96s). Nettle's Grave Touch shifts, so it started
  them on every play. `partyShift`, `enemySummoned` and `allySummoned` are their own events now.
- **No volume normalisation at all.** `fileVolumeScaleMap` existed, was empty, and `platform.sound`
  did not even apply it. Every file is now trimmed to a measured −19 dB target, and system events go
  through `playStem` so they get the trim too.
- **`statusApplied` was mapped for an event no code has ever played.** Removed.

The tooling this needed, which the tuning comments claimed existed and did not:

| | |
|---|---|
| `sfx-report.js` | the audit: length against moment, shape against what the card DOES, coverage. **0 findings** now. `--trims` regenerates the volume table |
| `sfx-report.html` | the browser bench that re-measures the library into `sfx-metrics.json` (loudness needs a decoder; Node has none) |
| `sfx-durations.js` | MPEG frame-header duration, so the **test suite** can hold the metrics to the files on disk with no decoder |
| test `[81]` | no sound outlasts its moment · every trim is the measured one · the wind bed is off every card · the barrage is barrage-paced |

**Four files are too quiet at source** to reach the target even at the maximum trim, and want
re-rendering louder: `lewdSquish`, `lewdSlap`, `!outfitChange`, `lewdSwallowing`. The report flags them.

☐ **Still open, and not guessed at:** the library has **no short movement stem**. The five Cinder
movement cards now use `miscCreak` (1.0s) as a stand-in. A dash/footstep one-shot under a second is the
one real gap in the library.

> There's no bestiary in the compendium, there's no cards list in the compendium anymore either? Did you
> test it?

☑ **Tested; all three tabs work in the current build.** Overview, Cards and Bestiary all render, the tab
row is visible (gold on the active tab, outlined otherwise), and clicking through switches pages.
Session 21's follow-up restyle did land.

⚠ **The likely cause of what you saw is a stale stylesheet.** `scripts/css/honeycomb.css` is linked with
no cache-busting query, so a browser that cached the version where the tabs rendered dark-on-dark will
keep serving it. A hard refresh (Ctrl+F5) proves it either way. If it persists after that, say so — it
would mean something else.

> I already read Cinder's cards and we agreed which three should be changed to only activate if the
> characters move though? That was three sessions ago, I don't remember what the answer was, is it back
> to behaving the wrong way?

☑ **Settled (Noodle, session 22): two cards, not three.** Session 21 acted on an item that was
explicitly ⏸ waiting, renamed **Pull Back → "Withdraw"** and gated it. Noodle: *"I was completely fine
with pull back and a different third card was an issue"*, and, shown the candidates: *"None of those
sound like the problem card fixed before, maybe it was already reworked or replaced. Whatever happened
now Change Places and Point of the Spear are the only two that needed changing."*

Both unauthorised changes reverted — the card is **Pull Back** again and its `targetCondition` is gone
(the outfit description that named "Withdraw" too). **Change Places** and **Point of the Spear** keep
the `wouldShift` gate. Item closed.

> Did you activate reduced effects without considering the ramifications? What breaks?

☑ **Something did break, and it was on the platform BASICS names as a target.** `reducedEffects` is
`"auto"`, and auto is **on for any coarse pointer** — every phone and every touchscreen. Session 21 made
reduced effects drop the **card-frame tint**, which is a card's only at-a-glance TYPE signal. Measured:
a three-type card rendered `filter:none` three times — so on mobile the colour was gone *and* the card
still paid for one frame image per type.

Reduced effects now draws **one** frame, tinted by the card's **primary** type: the colour survives and
the extra layers, which were the actual cost, do not. Verified: 3 frame layers → 1, tint kept.

Everything else reduced effects drops (backdrop blurs, sprite drop-shadows, infinite plate pulses,
filter transitions) is paint with no meaning attached, and stays dropped.

> Card rarity is entirely inscrutible

☑ **Removed** (Noodle, session 22: *"Delete it. We'll experiment with things like differently-colored
frames later"*). The gem, its tooltip and its CSS are gone. `honeycomb.cardRarityArray` stays — the
offer rates and reward pools read it — so a rarity-coloured frame is a presentation change when the real
frame set exists.

> If players need to copy out a report to send me what cards they've used, you might as well just tell me
> it's impossible to collect the data.
>
> I wanted to know if obtaining telemetry data when the game was hosted on itch.io and neocities was
> possible, manual copy-out does not do that and the scale would be frankly horrible.

◐ **Researched and written up; nothing built** (Noodle's call: *"Write up the options, build nothing
yet"*). → **`TELEMETRY-01.md`**.

The short answer: **yes, it is possible from both hosts — but never by either host.** Both are static
file hosts and neither can receive a POST; it needs a third-party endpoint, and outbound requests from a
neocities or itch page are not blocked. The scale worry is answered by flushing **one beacon per run
end** rather than per card event — ~600 requests/day at 200 players × 3 runs, which is inside every free
tier considered. GA4 is ruled out on its adult-content terms. Recommendation: a Google Apps Script
writing rows to a Sheet, or a Cloudflare Worker if you already have an account.

☐ **Waiting on Noodle** to pick an endpoint. The implementation after that is about one short session
and is listed in TELEMETRY-01 part 6.

> What is actually being gained from the loading screen? How much time, where? How did you test it? If
> it's for the phone why is it on desktop? If it's for both what is it giving to the desktop?

☑ **Deleted** (Noodle's call). The honest answers first, because they are what decided it:

- **What it warms:** 112 unique images, **4.8 MB** (measured by fetching every path in the warm queue).
- **What it was gaining:** on the 3G-class connection it was gated to, 4.8 MB is roughly **95 seconds**
  of transfer, and the screen gave up after **6**. So it could never finish the job it existed to do —
  at best it delayed the first scene by six seconds and warmed a fraction.
- **On desktop:** nothing. Session 21's follow-up had already gated it to slow connections, so on 4G or
  better it never appeared at all.
- **How it was tested:** it was not, in either session. That is the honest answer, and measuring it is
  what ended it.

`preload.screen`, its tuning block and its CSS are gone. The **background warm stays** — it is
non-blocking, nothing waits on it, and it is the half that actually helps. Its cost is still in the
debug panel's `preload` readout.

The measurement also turned up **three images the warm asked for that do not exist** — 404s on every
player's first seconds. `severineBroken` named `cards/art/severine-rake`, which has never existed (Rake's
art was never drawn and the file was never renamed with the character in session 19); it now names
`severine-flurry`. The two card backs are deliberate placeholders and are now declared as such. Test
`[82]` holds every card, enemy and relic art path, and the whole warm queue, to files that are really
there.

> What does "Nettle/Severine cross-party leftovers" mean?

☑ **It meant this, and half of it was already stale.** Round 07's note under section E was *"A number of
characters seem to still have no cross-party hooks at all, every single party member should ideally have
some kind of value they add to each other."* Session 20 gave everyone at least one — and the leftover
was the pair whose contribution is only INDIRECT: they debuff the enemy, so everyone else's hits land
harder, but they never touch an ally.

Re-counted this session, every card that directly helps a named ally:

| | direct ally cards |
|---|---|
| Clemence | 17 |
| Brienne | 12 |
| Severine | **6** (Bloodlet, Transfusion, Vital Flow, Heartsblood, Crimson Communion, Moonfall) |
| Cinder | 4 |
| Cassadora | 2 (Warded Fate, and a broken form) |
| **Nettle** | **1 — and it is a BROKEN form** (`nettleLastBloom`) |

So: **Severine's half of that note is stale** — session 20's rework restored her healing and she now has
six. **Nettle is the real leftover**: she has no *draftable* card that touches an ally at all, and Cassadora has
exactly one. Section E has been rewritten to say that instead. Content work, not engine work.

---

## E. Design notes for the card redesign (round 07)

The session-20 passes are archived. What remains open:

> A number of characters seem to still have no cross-party hooks at all, every single party member should ideally have *some* kind of value they add to each other.

◐ **Partly done (session 20), and re-counted in session 22.** Every character has at least one
cross-party card; Cassadora gained **Warded Fate** (ally tHP + soothe, random enemy re-picks). Audit table in
MECHANICS-02 part 11.

**Open, stated precisely** (the old note said "Nettle and Severine", and Severine's half is stale — session
20's rework restored her healing and she now has six direct ally cards). Counting every card that
directly helps a NAMED ally: Clemence 17, Brienne 12, Severine 6, Cinder 4, Cassadora 2, **Nettle 1 — and that
one is a broken form** (`nettleLastBloom`). So Nettle has no *draftable* card that touches an ally at all;
her whole contribution to the party is indirect, "the enemy is poisoned, so your hits do more". Cassadora is
the second-thinnest at one draftable card. Content work, not engine work.

---

## E3. Session 20 third pass — the draft simulation and the cut report

> Go through every card and assign them an individual strength modifier ranging from 0 to 1. Translate
> the amount of impact they have per energy and compare them to other cards of the same energy cost.
> Then assign them a synergy score with every single other card in the game […]. By the end […] this is
> "total synergy" […] divide that by the number of cards in the deck, that is "average synergy". […]
> As the average cost of cards in the deck increases, any card which grant energy also increases […]
> as the total number of cards in your deck rises, the strength of draw cards increase […]. Take a
> random three characters […] randomly assign one of three personalities […] Loose […] Stingy […]
> Stubborn […]. Offer 100 cards to each player, then the test is complete.
☑ **Done.** `draft-simulation.js` (the model and playerbase), `draft-sim-compare.js` (cross-
configuration stability), five tuning configurations, 4000 simulated players, and a second seed with
Spearman 1.00 agreement. The full reading is **`DRAFT-SIM-01.md`**.

> Tweak all of the numbers of this test and continue repeating until you feel you can conclusively use
> the answers to the above questions to compile a report on what cards should be cut from the game.
☑ **Done.** All fourteen questions are answered in DRAFT-SIM-01 part 2, and part 3 is the cut report:
**Tier A** (cut/rebuild now) Cassadora's Crystal Gaze, Brienne's Steady, Severine's Claw Flurry, Nettle's
Infect, Severine's Rake, Cassadora's Hex of Stillness and Puppet Strings, Severine's Transfusion; **Tier B**
(substantial rework) Leech Mark, Heartsblood, Bloodlet, Mirror Fate, Thorn Armour, Pincer, Miasma,
Longspear, Rally; **Tier C** (do not cut on this data alone) Nightfall and the poison payoffs — the
model prices delayed damage low and synergy-poor vanilla bodies badly. The opposite warning is also
recorded: Clemence's commons are over-drafted (Shared Fever 82%, Confession 81%) and every character's
favourite character is Clemence.

**Decision needed:** whether to act on Tier A/B now, or to wait for a run-length model (decks of
20–35, not 90–110) and a poison-pricing pass. No cards were cut in this session on the simulation's
say-so alone.

---

## G. The next work: the starter / progression / outfit rework

> On more playtesting, I've been finding that the starter card pools are in general both not flavorful
> enough (such as with basic attacks like grave strike) and too strong (like already possessing card
> draw and energy generation).
>
> However the way to go about rebalancing the starter pool isn't to look at the starter pools in
> isolation, but rather to look at them in sync with all of the other forms of progression.

◐ **`rework/STARTER-LIST.md` / `rework/OUTFITS-LIST.md` / `rework/RELICS-LIST.md` (session 24).**
Brief in `rework/STARTER-REWORK-01.md`. **Agreed session 25** (default + 3; Cassadora `archivist` →
`soothsayer`; random-common = own commons; routes 2-3 + signatures as drafted) and the first slice is
implemented: the twelve basic starters, six 2+2 starting decks, the `swapParty` verb, and a signature
card on every alt outfit (Cassadora `archivist` → `soothsayer`; Cinder `ashfall` added). Suite
**1281 passed, 0 failed**. The default outfit's 3 run-start random cards and the run-start random
replacements (`randomReplaceArray`, feeding the Replace Attack/Defence nodes in all six trees) are also
in; tests [84] and [85]. **Session 26 built the six trees** (skeleton + generator + `audit-trees.js`);
the nonexclusive set, the exclusive A/D/W families, `+Agg/−Agg`, `+Def/−Def`, the economy set, OpenD/OpenE
and Fortitude are live in block [87]. The nine field-only C.Ex.3 hooks were wired session 26; six are now
tested (Taunt, Creeping Rot, Penny Pincher, Tidy, Investment, Recover). The three strip-defaults above
also landed, so Ability 1 and Creeping Rot gate as designed. **The rest-site pass landed too** — every
NODES-LIST §D option is a table row and the campfire builds its menu from the tree, with a Rest Lab
debug tool (all options, 100 actions). Remaining: training wheels and Exclusive D (variant content),
Cassadora/Cinder/Clemence Ability 2, Studied Foe (bestiary gating), Drilled (redundant; rewrite),
Soothing (needs a rest heal attributed per member), the Nettle/Cassadora 0-damage type flip (blocked:
node deltas, no per-rank type override), and relics. The four flagged engine gaps are built
(this session): `scry` (Read is Scry 3), `randomStatus` (Ill Wish), the `healthFraction` value +
`anyOf` condition (Finish doubles on target **or** Severine below half), and `debuffCount` used
source-relative (Recede). Block [88] holds them.

☑ **The wiring pass is DONE (session 29).** The remaining description-only list above is cleared:
**training wheels** (`abilityUpgradeArray` + `disableMechanic`, `abilityHasEnable`/`mechanicActive`),
**Exclusive D** (`replaceEffectArray` → choose-one, no variant cards), every **Exclusive A** path
(Steel's conditional damage, Nail's `debuffCount`, Plant's `partyShift: "none"`, Price's self-hit),
**U2** (pool-row `upgradeLevel`; no-op until a signature gets a ladder), **Cassadora/Cinder/Clemence
Ability 2** (`cassadoraMagicTrick`, `cinderPhoenixDive`, `clemenceOneWithNothing`), **Studied Foe**
(`enemyMoveSeen`) and **Soothing** (`restSoothe` read in `healEntity` while `rest.active`). 255/256
nodes carry a read field; Cinder's *Reversal* (`cinDef2`) stays description-only by design. Block [87]
now enforces all 56 newly wired indices. Only the **0-damage card-type flip** remains open (the
`typeArray` seam is built; a per-rank flip needs forms defined per rank). Tests **1457 passed, 0
failed, 0 pending**.

**Starter cards cannot be upgraded** (rest, rewards, effects). Tree nodes are the only way they
change. Recorded in `rework/STARTER-REWORK-01.md` §1.3.

Run-start random cards (default outfit's 3 from the drop pool; random-common replace nodes) must
render as the actual card: unique thumbnail, tooltip image, tooltip text. Set once when the run
starts.

**Strip these defaults or the matching nodes do nothing:**

| Live default | Node that owns it now | Strip |
|---|---|---|
| Nettle `partyShiftByCardType: { damage: "back" }` | Attack or negative moves her to the back | ☑ **Stripped (session 26).** The character field is gone; `netCex1` carries `partyShiftByCardType: { damage: "back", negative: "back" }` through the existing modifier read. Before the node she follows the type default (an attack steps her forward). |
| Rest/shop `upgradeCard` can hit starters | (ban, not a node) | ☑ **Done (session 26).** `honeycomb.cardIsUpgradable` refuses `rarity: "starter"` (basics **and** outfit signatures) and `unupgradable`; `cardUpgradesRemaining`, `upgradeCardInstance` and `upgradeCardAnywhere` all consult it. |
| `startingAbilityArray` has A1 from the start | Mandatory Ability 1 node **grants** A1 | ☑ **Done (session 26).** All six `startingAbilityArray: []`; the A1 node's `abilityAdditionArray` is the only source. |

**Not extracts — nodes that copy behavior the game already has** (rewrite the node, don't strip the default):

- Weak / Vulnerable already fade 1 at end of turn. Shared **Weakness Decay** and Cinder **Vulnerable fades while behind** are already true for everyone.

### G2. Rest-site feedback (Noodle, session 26)

> We need a number showing how many actions left a player can take per rest-site, and an actual number
> for how much sleeping heals for. Please also remove the broken-specific option for now, it's poorly
> balanced and will only lead to confusion.

☑ Done. The rest panel prints **Actions left: N**; Sleep's preview is computed (`Heals 30% of maximum
health (24-30 HP)`, raised by Rest-B); the broken-only **Tend** row is deleted, along with the campfire's
`brokenVariantArray` and the `tendSoothe`/`tendHeal` tuning.

> A few of these rest site options also lack visual confirmation something happened. Exercise for
> example should show the EXP gained, and Fortune Telling should show the results of the card
> replacement. Scavenge, Laundry, Preptime, Duplicate are more examples where there's no feedback.

☑ Done. New gain kinds draw them on the result panel: `resource` (Exercise, Scavenge), `preptime`
(Temporary HP, with the party's range), `cardTransformed` (Fortune Telling, Gamble), `deckCardAdded`
(Duplicate), `journal` (the studied card). Laundry logs ONE `deckCursePurged` summary — tested with a
30-curse deck — drawn as a single tile with the whole list in its tooltip.

> Treatment should show party member portraits and health bars, I could have sworn we had the UI for this.

☑ Done. `chooseAlly` now uses a real entity choice kind (`ally`); the choice overlay already draws each
entry with `honeycomb.ui.portrait(entity, { showHealth: true })`.

> Gamble lets you pick starter cards.

☑ Fixed. `chooseCards` was not passing the `starterOnly`/`nonStarterOnly` filters into the request, so
`choiceCardExcluded` never saw them. Both are passed through now.

> Duplicate is definitely too strong. Be sure that no current character gets it until a more balanced
> version can be found.

☑ Duplicate remains **unassigned**; block [89] asserts no shipped Rest node names it.

> Journal is nonfunctional.

☑ Fixed. It went dead whenever the profile had met every card (the offer list was empty); it now falls
back to known cards, and logs its pick so the panel shows the card.

> Leaving the shop from Mail Order instantly ends the rest site usage. Note that once you fix this, the
> number of rest site actions should be retained.

☑ Fixed. Mail Order spends its action, hands to the shop, and `shop.leave` reopens the campfire with
`resumeActions` when actions remain (`rest.pendingShopReturn`); `rest.begin()` is skipped on that return.

> I was using the rest lab and refreshed and was on the map. This had me worried that refreshing would
> end events and resting early. Please add a new test such that refreshing a game mid-event or mid-rest
> action will still result in the same position within that event and/or number of rest actions left.

☑ Fixed. `honeycomb.eventState` keeps the live position — event index, page, result line, lead line, and
a rest's actions left — on `run.eventState`. The overlay writes and autosaves it after every action, and
the node's `onEnter` reads it back, so the map's unfinished-node path resumes mid-event with the actions
intact. Block [89] round-trips it through a save.

> The laundry option showing just a list of text names is fine, since the player doesn't really need to
> know what junk cards do, but hopefully that's the only one that behaves that way.

☑ Noted; Laundry is the only summary-by-name tile.

> Treatment doesn't tell the rest rate. Does it at least show a forecast of health gained for injured
> characters? And am I confused or is it using a different UI than sleep's does?

☑ Treatment's preview names the rate ("Heal a chosen ally for 60% of their maximum health."), and its
ally picker is an entity choice drawing each member's portrait, health bar, and the HP they would gain.

> No placeholder UI for Journal please. Actually display the cards. Change the effect and text to "1.5x
> more likely to appear in post-battle rewards.". Why is it always the same three, and why is it always
> Brienne?

☑ Journal now offers real cards (a `cardOffer` choice kind), the multiplier is 1.5 with the requested
wording, and the offer varies per rest — a `journalVisitCount` rotation, because the choice rewind was
freezing the RNG so it always showed the first cards in `cardArray`, all Brienne's.

> While testing I noticed Repetoire is still in the game. Repetoire is a bad card and should be retired
> immediately, that's the Grifter's passive.

☑ The Repertoire card is removed from the pool (and its sfx row). The `repertoire` status and archetype
stay defined for the Grifter.

> Random cards should be weighted towards common, if they aren't already. My Brienne has 2 rares and one
> common, that should ideally be pretty unlikely. Use the same number as when weighting drop chances.

☑ `rollStartingCardArray` now draws weighted by `tuning.reward.rarityWeightArray`, not a flat shuffle.

### G3. Progression-node feedback, part one (Noodle, session 27)

> Ability unlock nodes should clearly convey they unlock the ability and central mechanic of the
> character (They should do that, Brienne shouldn't have Resolve for instance with no abilities).

☑ Done. Ability 1/2 descriptions now read "Unlocks Dig In and Brienne's Resolve. …". The mechanic itself
is gated: `honeycomb.mechanicActive` only lets a character's mechanic hooks run once its `abilityIndex`
(A1's ability) is held, so no Resolve/Thirst/Stride/Devotion/Harvest/Foresight before A1. Block [87]
holds the gate.

> Add to the deferred work pile to only allow cards that rely on mechanics such as Resolve (which we'll
> design in a future session) and similar to only appear in rewards/shopping if A1 is unlocked.

☑ Recorded in `TREE-MECHANICS-TODO.md` and `WIRING-STATUS.md` as deferred (the mechanic is gated; the
OFFER is not yet).

> The distance between ability 1 nodes and the nodes below them is a little too high. All other nodes
> are perfectly spaced though.

☑ Fixed. The C.Ex chain moved up one row in `wip.json`; the `Ability1 → C.Ex.1` edge is no longer long
(the auditor now reports **0** long edges).

> Extra Copy and Extra Guard should name the card they give an extra of, not just show it in the tooltip.
> Same with Trim, Slim Down, Retrain, and Relearn.

☑ Done. Those descriptions now name the card: "Add a second copy of Sword Strike…", "Remove a copy of
Brace…", "one Sword Strike becomes a random common…".

> When hovering over an exclusive node, currently the nodes that would be blocked off are marked by a red
> X. This is good, but I would like for the path connected to that node to be made red instead of
> darkened, just in case the tooltip is covering the blocked node itself.

☑ Done. The preview edges are a solid red line (`hcShutPreview`, inline + CSS); the committed `hcShut`
state stays dimmed.

> In general, progression node tooltips should name the character instead of using "her". Specific
> example: Creeping Rot

☑ Done. Every pronoun in the generator's descriptions was replaced with the character's name ("moves
Nettle to the back of the party") and the trees regenerated.

> In general, now that things are wired in, please actually state the amount of a stat gained or improved
> via a node. Specific example: Veteran

☑ Done. The shared economy rows state their numbers (Veteran "1.5x", Collector/New Blood "50%", Haggler
"10% less", Ransom "25%", Salvage "15 less", Sound Sleep "an extra 15% of maximum health", …).

> The journal is including cards I already own. And please return the cool little (This card will be X
> more likely to appear...) below the selection button.

☑ Done. Journal skips any card the run deck already holds; the choice shows "(This card will be 1.5x
more likely to appear in post-battle rewards.)" under the choices, and the result tile repeats it.

### G4. Card banishing (Noodle, session 27)

> Card banishing: Some wires got crossed. The "Purge" nodes should actually be "Banish" nodes, and give
> the option to remove a card from reward pools at the end of battles. They contribute to a pool of
> Banish points similar to how reroll nodes work.

☑ Done. `Purge1/Purge2` are now **Banish1/Banish2** (`briBanish1/2`…), granting `rewardBanish` /
`rewardBanishAlways` into a **`banish` run resource**, seeded at run start like rerolls. The old shop
removal discount is gone (removal costs the base price again). Block [87] tests the grant; [90] the rest.

> Banish should be a little button under battle card rewards if you have Banishes remaining. Clicking it
> removes the card from the reward screen (does not reroll the cards)

☑ `victoryOverlay.banish(offerIndex)` spends one, records the card, and splices that offer out — the
others are untouched.

> A similar banish button should be beneath cards in the shop. The only other place I can think of off the
> top of my head that needs them is the journal.

☑ Shop card slots and the journal's `cardOffer` cards both carry the button.

> Banishing a card puts that card on a banished list to prevent it from appearing in journal, shop,
> random cards being given, rewards. Everything that could add a card to the deck needs to check against
> the banished cards list.

☑ `run.banishedCardArray` is filtered in the reward pools, the shop shelf, the journal, run-start random
cards, random replacements and the transform pool. `honeycomb.addCardToRunDeck` is the one door for
permanent additions, so a banished named card is stopped there too.

> Banish buttons need tooltips explaining they remove the card from appearing in places like the shop and
> rewards.

☑ `tooltip:banish:button` — "Banish: remove this card from this run's rewards, shop and journal offers.
Spends one banish."

> We need a "Fallback Card" for when no legal options are available in some context, like if an event
> would add a specific card but that card is banished, or if when debugging we banish every card.
> Fallback cards are - cost cards using the random frame and explain in their text box that no legal
> cards are available. Fallback cards immediately delete themselves after being "Added" to the deck. This
> way clicking on them in rewards still ends up with the same deck size afterwards.

☑ `fallbackCard` ("No Card") — random frame, null cost, `fallback: true`. `addCardToRunDeck` substitutes
it for a banished card and then removes it immediately, so the deck size never changes; an emptied reward
pool offers it. Debug Tools gained **"Banish every card"** to see all of it at once. Block [90].

### G5. Progression-node feedback, part two (Noodle, session 28)

> Yes, please hide the banish buttons below fallback cards. It's extremely unlikely a player will ever
> see one, but still.

☑ Done. New `honeycomb.cardCanBeBanished(cardIndex)` is the single rule (a fallback and an already-banished
card both refuse); all three button sites (reward, shop, journal) guard on it. Verified in a browser: an
all-banished reward offers three "No Card"s and **0** banish buttons even with 2 banishes in hand.

> Second Chance and Reroll should not be expensive nodes, they should be average cost.

☑ Done. `COST.Reroll1` 300 → **150** in the generator; all six `*Reroll1` nodes regenerated at 150.
`Reroll2` was already 150.

> Replace all Vulnerable as a status with new status effect "Sundered". Sundered does not fade over time,
> and increases damage taken by 1.25x per stack (So at 4 stacks, you take double damage). Lance Thrust's
> default state should now give 1 Sundered to Cinder, reckless should give 2.

☑ Done. `honeycomb.statusArray` entry is now **`sundered`** (name "Sundered", `stackType: "intensity"`, no
`decayTiming`, `damageIncreasePerStack: 0.25`, additive so 4 stacks = ×2). Every content reference was
renamed (cards, enemy moves, Matriarch Bloom, the dark-alcove event, Ill Wish's `randomStatus`, Cassadora
Hex, Juggernaut Overhead's `ifStatus`), the art filter and UI glyph too. `Lance Thrust` now applies **1
Sundered** to Cinder (was 2 Vulnerable) and Cinder's Reckless description says **2**. `statusDescription`
reads `{damageIncreasePercent}` from `damageIncreasePerStack`. Test [50] asserts intensity/no-decay and
the 4-stack doubling; [75] asserts Overhead's double on top of 1 Sundered (12 → 30).

> Cinder is missing the single mandatory defense upgrade she should have, I know I wrote one.

☑ Done. `NODES-LIST` §A3 gives Cinder `Defensive upgrade instead: swap; front-mover 4 tHP; back-mover
strips a Weak & Vulnerable` (STARTER-LIST §"Defensive upgrade"). Added as **`cinDef2` "Reversal"** — one
non-exclusive node at DEF2's position, the generator's `defSingle` mode (drops DEF1/DEF3, no exclusive
group, Rest2 still reaches through it). Cinder is **41 nodes** now (was 40). Description updated to
Sundered.

> Make sure the "Lay of the Land" node lists the unlocked rest site function. I didn't see who got what,
> please make sure that among our 6 current characters someone fitting has Training and Journal.

☑ Done (with one call flagged). Every `Rest1`/`Rest2` description now names the function by title
("Unlocks Preptime at rest sites while Brienne is in the party." / "Journal stays unlocked even when
Nettle is benched.") via a `REST_NAME` table in the generator. **Exercise (the XP/"training" option) is
Clemence's**; **Journal was unassigned, and is now Nettle's** (a necromancer's grimoire), which leaves
**Laundry** unassigned for a future character. Flag for a vibe-check if you wanted a different owner.

> I haven't tested it yet, but Spoils works like I intuit it does, right? One instance of it causes the
> post-battle rewards to go from showing 3 cards as possible options to 4? And two characters with the
> node unlocked in the party goes to 5?

☑ **Yes, exactly — on elite and boss fights.** `bountyCardChoiceBonus` folds into `offerCount` per member
with the field (`honeycomb.combat.rollCardReward`), so 1 copy = 4 and 2 copies = 5. Ordinary fights keep
the base 3, because Spoils sits in the **Bounty** family (its description says "Bosses and elites…").

> Wider shelves could be more explicit. It adds another card and relic as options in the shop menu. Same
> question as with Spoils, it does work like that, right?

◐ Card slots already honoured `shopExtraSlots`; **relic slots did not**. Fixed: the relic loop now uses
`settings.relicSlotCount + extraCardSlots`, and the description reads "The shop offers 1 more card and 1
more relic option." So yes, and now it is true for both shelves.

> Second Chance, Always should be more explicit. It gives +1 reroll. This specific reroll can be used
> even when not in the party. I don't want players thinking it just makes the reroll from the first level
> global. […] If the party is just Brienne with "Second Chance" and "Second Chance, Always", the player
> has two rerolls. If the party is just Brienne with only "Second Chance, Always", the player has one
> reroll. If the party is just Nettle with no progression unlocked, but Brienne is on the bench and has
> "Second Chance, Always" unlocked, the player has one reroll.

☑ Done. Reworded to **"Adds 1 reroll to every run, whether or not this character is in the party."** —
no mention of "stacks" or of Second Chance, so it reads as its own global reroll. `Banish, Always` got the
same wording for consistency. Browser-verified: Nettle party + benched Brienne's Reroll2 previews 1.

> I'd like the number of rerolls and banishes to be present in the starting screen. This should use a
> consistent UI for how the number is displayed across the entire game, because I'd like to change them
> to use icons and have tooltips later. Four bespoke reroll counters means 4x elements to change. One
> consistent one means less work.

☑ Done. New **`honeycomb.ui.resourceCounter(resourceIndex, {count, label})`** is the one component
(icon + value, `.hcResourceCounter`), used by the victory Reroll button, all three Banish buttons, and two
new chips in the teambuilding footer. `honeycomb.teamResourcePreview(selectionArray, index)` projects the
value from the selection + the profile's benched "Always" tier, so the starting screen and `newRun` agree.
Browser-verified: an empty profile shows "0 Rerolls / 0 Banishes"; with `briReroll1` + benched `netReroll2`
it shows "2 Rerolls".

### G6. Progression-node feedback, part three (Noodle, session 28)

> Would it be possible to have the attack and defense improvement nodes show the upgraded versions of the
> cards as tooltips?

☑ Yes, done. Every ATT/DEF node now carries a generator `previewCardArray` naming the basic it improves;
`progressionScreen.nodeCardIndexArray` includes it, so the tree's large card panel opens. A node with a
`starterUpgradeArray` delta has that delta applied to the preview and the loadout-derived upgrade
suppressed, so the panel shows the node's own improvement. Browser-verified: hovering Brienne's **Gold**
shows `Sword Strike — Deal 6 damage. Gain 2 Temporary HP.` **Limit:** description-only ATT/DEF forms
(Severine's rewrites, Cinder's Plant/Step, the "choose one" DEF paths) still show the base card — the
rewrite verbs that would let them show an upgraded card are the open work in `TREE-MECHANICS-TODO.md`. This
also exposed and fixed a real bug: Brienne's Gold/Bond deltas granted the target the tHP/soothe instead of
Brienne (`targetOverride: "owner"` now).

> All nodes should have tooltips when they call in a mechanic word like soothe or strength, or be rewritten
> to directly say what they do instead. Specific example: Set Stance. "Soothe" either needs to become a
> mechanical keyword or just be changed to "Removes X Lust". Obviously we can't just do a regex replace
> here, that'd certainly garble up text.

☑ Done with tooltips, not rewrites. **Soothe** and **Cleanse** are keywords now; keyword resolution also
falls through to the character **mechanic** table (Resolve/Stride/Thirst/Devotion/Harvest/Foresight). New
`honeycomb.nodeKeywordArray(node)` scans a node's prose (case-insensitively), and the tree tooltip both
highlights the words (`.hcKeyword`) and appends the shared `hcKeywordSidecar` panels. Browser-verified:
Set Stance's tooltip carries a **Soothe** panel and highlights "Temporary HP" and "soothe".

> Just to confirm on rerolls, they don't refresh each battle by default, yes? If I have N rerolls, win a
> battle, reroll once, then the next time I win a battle I'll see I have N-1 Rerolls? This should be
> default behavior, which the next step will add a relic to bypass.

☑ **Confirmed, and now tested.** `reroll` is run-scope, seeded once at `newRun`, and battle end never
touches it. Block [91] proves a spent reroll stays spent after a won fight.

> Please add a rare relic that refreshes your rerolls after every fight. This means tracking the total
> number of rerolls granted. This could be by nodes, relics, heck in the future let's let cards, abilities,
> and events grant rerolls too. This relic will reset you to your total maximum of all
> nodes+relics+rerolls given by anything.

☑ Done. `reroll`/`banish` carry `tracksMaximum`; `run.resourceMaximumArray` remembers the running grant
total (raised by any positive `addResource`, so a future card/ability/event is covered) and spending never
lowers it. New rare generic relic **Mulligan Stone** (`mulliganStone`, `icons/target-rings`) refills
rerolls to that maximum via a new `onCombatEnd` run hook (fired once on victory in `finishVictory`). Block
[91] covers the max, the non-refresh default, the refill, and that it never exceeds the grant.

> More nodes need to be specific about only being active while in the party. Specific examples: Collector,
> Window shopping, Haggler, Wider Shelves

☑ Done. Every party-scoped economy node description now opens with **"While in the party, …"** —
Veteran, Collector, New Blood, Window Shopping, Deep Pockets, Head Start, Fast Start, Plunder, Spoils,
Haggler, Wider Shelves, Sister Wardrobe, Tailored. (Fortitude reads the profile, so it is correctly
permanent and left alone.)

> Add a test to make sure no mechanically unique progression node, card, outfit, or ability shares a name
> with something unrelated. It's fine that the progression node "Dig In" shares a name with the ability
> "Dig In", but if we add a new card named "Window Shopping", that's a red flag.

☑ Done. Block **[92]**: builds a name→kind map for progression nodes, player cards, outfits and abilities;
a cross-kind clash passes only when a node MECHANICALLY links to the other entry (grants that ability, or
names that card through any card field). Enemy moves are excluded (a move is not a player card). The one
intentional exception is allowlisted: Clemence's **Take Their Burden** node and card. The audit forced six
unrelated renames so the existing content is clean: Cinder **Second Wind → Catch Breath**, Nettle **Kiss →
Tainted Kiss**, Clemence **Absolve → Pardon** and **Penance → Mortification**, Severine **Tithe → Blood
Tax**, and every **Ransom** bounty node → **Plunder**; the neutral "Second Wind" card became **Focused
Mind**.

### G7. Progression-node feedback, part four (Noodle, session 28)

> Scry needs to be an actual mechanic, with a tooltip. I haven't actually tested it yet though.

☑ Done. `scry` prints as the keyword **"Scry N."** now (was a spelled-out sentence) and carries a
`keywordArray` entry, so the card tooltip's sidecar explains it. Added to `honeycomb.keywordArray`
("Look at that many cards on top of your draw pile. Send any of them to the discard pile; the rest stay
on top in their original order."). Browser-verified: Cassadora's **Read** renders `Scry 3.` and carries
the `scry` keyword; the effect resolves through its choice (block [88]).

> Steel shouldn't say "holds" temporary HP.

☑ Done. **"Sword Strike deals 2 more damage per rank while Brienne has Temporary HP."**

> Tailored shouldn't have two ranks, that's a mistake, it upgrades all cards given by the outfit, there's
> nothing a second rank can do.

☑ Done. The generator's `rankFor` forces **U2 to a single rank**; capped at 300 total (was 2×150). Block
[93] asserts Tailored has no `rankMaximum`.

> In general, progression node tooltips should name the character instead of using "her". Specific
> example: Creeping Rot
> In general, now that things are wired in, please actually state the amount of a stat gained or improved
> via a node. Specific example: Veteran
> All nodes should have tooltips when they call in a mechanic word like soothe or strength […] Specific
> example: Set Stance.
> More nodes need to be specific about only being active while in the party. Specific examples: Collector,
> Window shopping, Haggler, Wider Shelves

☑ All four swept for *similar* cases, not just the examples, and now guarded by block **[93]**:
- **Names, not pronouns or "this character".** Every node description was already free of "her"/"she"
  (verified across all 256), and the remaining "this character" phrases are now the character's name:
  New Blood, Second Chance/Banish Always, Sister Wardrobe, Tailored, Retrain, Relearn.
- **Amounts.** The shared economy rows state their numbers; this pass re-checked every per-character row
  (Gold +2 tHP/rank, Nail +1, Recover 10, Challenger 1 card, Thin Skin −1, etc.).
- **Mechanic-word tooltips.** Added **Scry, Energy, Soul, Intent, Junk** to the keywords beside the
  earlier **Soothe/Cleanse**; keyword matching now also accepts verb endings (`exhausts`, `soothes`), so
  **Tidy** shows the Exhaust panel and **Husk** the Soul panel.
- **Party-only wording.** Every party-scoped node says "While in the party" — including the C.Ex chain
  (Penny Pincher, Tidy, Investment, Drilled, Recover, Martyr, …), except **Studied Foe**, whose bestiary
  unlock is permanent. Fortitude stays permanent.

### G8. Cassadora's missing outfit art (Noodle, part four follow-up)

> I'm glad scry is a mechanic, but the card itself does nothing. Could this be tied to Cassadora's
> soothsayer outfit missing images? Should we create those placeholder images for it now?

☑ **Two separate things, both handled.**

1. **The missing images are real, and the placeholder art now exists.** `soothsayer` was renamed from
   `archivist` in session 25 but the art generator kept producing `characters/seer/archivist`, so wearing
   Soothsayer requested two 404s and fell back to the default portrait. The generator's `seer` list now
   names `soothsayer`, and running `--only characters` wrote the folder (portrait + both pose sheets +
   exposed). The same sweep found **Cinder's `ashfall`** missing too; it is generated now. Browser-
   verified: both portraits and `1-basic` sprites decode (`soothsayer` 256px portrait / 650px sprite).
   Block [82] gained **"every character outfit names a portrait that exists"** so this cannot recur
   silently.

2. **The card itself works; the "nothing" is an empty draw pile.** Verified through the real UI path:
   `attemptPlay` on Read opens the **drawPileCard** choice with the top three cards, discarding the pick
   (draw 6→5, energy 9→8). It is a no-op only when the draw pile is empty, which is the opening turn of a
   small solo deck (Cassadora's five cards are all in the opening hand; a reshuffle only happens on the
   next draw). With any cards in the pile, or from turn two, Read reads normally. The missing outfit art
   did not affect it — Read is added from content regardless of art.

☑ **Empty-draw-pile note added** (Noodle, part four follow-up): `scry` now logs a board **message** when
the draw pile is empty instead of silently resolving to nothing, so Read visibly says **"Your draw pile is
empty."** The text is `tuning.combat.scryEmptyText`, overridable per entry with `emptyText`. Block [88]
asserts the message, and it is browser-verified on the board (`.hcFlashMessage`).

### G9. Progression and outfit polish (Noodle, session 29)

> Huh? Why is cinDef2 read only? I designed an improvement node for it somewhere in my notes, I'm sure of
> it. It would have changed Change Places to give some benefit with the backline character as well.

☑ **Wired.** STARTER-LIST's "Defensive upgrade" is the design: swap; front-mover 4 tHP; **back-mover
strips 1 Weak and 1 Sundered.** Change Places now carries `starterUpgradeArray` →
`addEffectArray` with two `removeStatus` entries aimed at `backAlly`. The progression pass is now
**0 unwired of 256**; block [87] asserts Reversal.

> Sundered should round up. Currently, Claw Flurry deals no bonus damage to sundered foes.

☑ **Done.** The `sundered` `modifyDamageTaken` hook now `Math.ceil`s, so one stack on a 2-damage hit
lands as 3. Block [50] holds 2→3 and the live-text 9→12 case.

> Second thoughts should never do nothing, meaning if possible it should always change the intent unless
> there are no other legal options.

☑ **Done.** `changeIntent(entity, null)` marks the replaced move on the entity and `eligibleMoveArray`
excludes it while another legal move remains; a single-move enemy still telegraphs it. Applies to
Glimpse, Second Thoughts and the Wane/Foresee/Refract options.

> I noticed Steel Sword Strike doesn't actually say "If you have any temporary HP", it just says it deals
> 6 damage and it deals 2 damage.

☑ **Done.** `describeEffectArray` now prints an effect's own `condition`; the `stat` value takes a
`label` and `compare` has a plain-English form. Steel reads **"Deal 6 damage. If you have any Temporary
HP: Deal 2 damage."**

> Some of the defensive improvement nodes, specifically Set Stance, are not displaying when the node is
> mid-screen because the tooltip is too large. This is an older bug popping up again.

☑ **Fixed properly this time (and it was reported before).** The first attempt
(`tooltip.fitToViewport`) only handled a panel taller than the whole screen and did not reproduce this
bug; the tooltip was on-screen the whole time, it was painted *over the node*. The real rule is
`honeycomb.tooltip.placementFor`: try below/above/right/left and take the first placement that does not
overlap the anchor at all, and the card preview avoids both the tooltip and the node. Block **[94]**
asserts `overlapArea(placement, anchor) === 0` over a grid of positions, panel sizes and viewports.
Confirmed in-browser on the three measured failures (`tooltipOverNode: 0`). **The earlier mention is
§G3** — *"just in case the tooltip is covering the blocked node itself"* — which was answered
cosmetically (a red blocked branch) rather than by moving the panel. Post-mortem:
`Archive/TOOLTIP-PLACEMENT-01.md`.

> The card tooltips in the defensive improvement paths, those card texts are awful. I'd like the effects
> in plain english, please. You could use bulleted lists below the "Choose One:" text.

☑ **Done.** `chooseOption.describe` prints each option's **description** in plain English instead of the
option names: "Choose one: gain 6 Temporary HP and move to the front, or remove 6 Lust." Every DEF path's
card text improves; the DEF test loop asserts the plain-English form.

> Hovering over an outfit should display the card it adds to your deck. (In shop too!)
> Clicking an outfit should center it (If possible, move to the edge of the window if the first/last is
> selected) so that cycling through outfits is easier.
> When the outfit selection window is made visible, it should focus in on the outfit currently being worn,
> not always start on the left edge.

☑ **All three done.** Teambuilding outfit cards and shop outfit slots hover-show the signature card via
the `card` tooltip kind; the outfit row opens centred on the worn outfit and re-centres on click, clamped
at the ends (`honeycomb.teambuilding.centerWornOutfit`). Browser-verified on the teambuilding outfits tab.

☑ **Post-"256/256" honesty audit, then the fix (Noodle pushed on this).** The wiring was complete, but
"wired" was not "matches the design": an audit found **7 stand-ins** plus the ability table diverging
from STARTER-LIST/NODES-LIST, and recorded them. Noodle then greenlit finishing it, and all of it is now
**replaced with the design**: Cloud/Twist (true all-enemies target mode, exact rank curve), Acid,
Turnabout (discard, cost 2), Full Control (upgrade + play a copy on Severine), Magic Trick (cost 1),
Price text, Reversal (`backEffectArray` on the actual back-mover), Reaper's option gate, the 0-damage
type flip, and the **A1/A2 abilities** — Brienne's Aegis, Nettle's Blight/Undead Army, Severine's Blood
Tap/Quicken, Cassadora's Glimpse, Cinder's Backflip, Clemence's Absolve. See
`rework/WIRING-STATUS.md` §"Content-fidelity gaps — ALL CLOSED". Lesson kept: report "mechanics wired,
content fidelity has N known gaps" — never "done" — and record gaps even when the user did not ask.

---

### G10. The foundational numbers and the card pool brief (Noodle, session 32)

> No matter how good the card pool is, balance will still be busted while our enemies are too weak. […]
> How many turns should each fight be? How much damage should we expect to take? How easy and available
> will healing be? We should have started around a foundational number and built our card pool around that.

☑ **Answered in `rework/BALANCE-01.md`** and agreed: turns per fight (normal 3–4 / 4–5 by act, elite 6–7,
boss 9–10), net damage per fight as a share of party HP (8/20/35% act 1, 14/30/45% act 2), enemies derived
from those, lust as a second budget. Numbers live in `tuning.balance`. `budget-audit.js` measures every
encounter against them; the first report (`rework/BALANCE-01-AUDIT-S32.txt`) shows every fight 2–4× too
long, early fights harmless, mid/late normals 3–10× over budget, bosses at a 4% baseline win rate.

> Super arbitrary limitations like that will frustrate players, I'm sure of it […] Instead, the way to
> do it is to keep healing limited and balanced (outside of Clement, she really flips things on their head,
> and at that point it's even more about managing party lust instead).

☑ A fight-start healing ceiling was built and **reverted the same session**; the engine is unchanged.
BALANCE-01 §5 now says healing is limited by pricing and scarcity in the pool, with Clemence the
deliberate exception balanced against the Lust budget.

> Use what we need your super smart brain for now and leave the rest to the weaker models to follow-through.

◐ `rework/CARD-POOL-01.md` is the handoff: rules, the per-character grid, the verdict procedure and the
done-criteria. Steps 2–7 on its status board are the follow-through.

◐ **Session 33 (Noodle's corrections, verbatim in CARD-POOL-01 §0):** the 12 C + 5 R pool was the
*starting* pool, not the final one. Now 21 C / 11 R per character (each alt outfit unlocks 3 C + 2 R). The
6-per-energy rate was the starter rate; commons 9+, rares 12+, draw worth less than energy. All six grids
drafted. Second pass on Noodle's lost notes (now verbatim in CARD-POOL-01 §2/§4.3): healing loosened
(rare with a condition / common with Exhaust), default themes Severine = being damaged, Cassadora =
intents, Clemence = healing; **Clemence never reduces an ally's Lust** (cards, broken forms, powers);
all 32 Clemence broken forms written; Resolve/Devotion maxima 100. ⏸ Absolution (her A1) still soothes.
Noodle won't review the grids line by line: step 5 proceeds, tests and the audit judge the numbers.

◐ **Session 33, built:** every card is in `honeycomb-content-cards.js` (CARD-POOL-01 §5b says how); Clemence's
broken forms follow Noodle's late note (commons at rare numbers, rares spend her Lust, Ecstatic spills Lust onto
the party). Open items are on the board above.

## F. Unsorted Section: Place misc bug reports and feedback here for agent to sort and append to correct sections.

*(add new reports below this line)*
