# Honeycomb Catacombs — BASICS

**The standing brief.** This exists so a new session can be started with "read
`!designDocs/honeycomb/BASICS.md` and `CATCH-UP.md`, then carry on" instead of retyping the whole
thing. `CATCH-UP.md` says where the work is; this says what the work *is* and what the rules are.

The requirements below are Noodle's, preserved as written. Annotations under each are how they were
interpreted and where that interpretation lives in the code — if an annotation and the requirement
ever disagree, **the requirement wins**.

---

## The project

> Create a playable build of a teambuilding roguelike deckbuilder inspired by Slay the Spire playable
> entirely inside Syrup Town. The placeholder name of this project will be Honeycomb Catacombs.

> Use devPreviewTarget devPreviewBoot in scripts/index.js as your in-game workspace as a means to
> bypass the game's title screen.

Targets `"honeycomb"` (resumes autosave) and `"honeycombFresh"` (new profile) are wired into
`devPreviewBoot()`. **Set `devPreviewTarget` back to `""` before any release build.**

> You have no time limit, and progress can be done over multiple sessions. It is up to your discretion
> how you would like to allocate your time to the project.

---

## Hard requirements

> - The game must be extremely modular and customizable to allow for future iteration, absolutely no
>   magic numbers.

Every number lives in `honeycomb-tuning.js`, or as a **named field on a content-table entry** (e.g. a
status's `damageMultiplier` sits beside the hook that reads it). A numeric literal buried inside a
function body is a bug.

> - "Modular" in this case refers to both the ability of future developers to iterate on existing
>   content structure, but also to have the maximal-allowed design space for freedom of ideas on
>   altering characters, enemies, attacks, cards, and general game behavior.

This is what the effect / value / condition registries and the hook system are for. See CATCH-UP,
"The five ideas". The test: adding a new card, enemy, status, relic, event or node type should be a
**table entry only**. Needing to edit engine code means the engine is missing a verb — add the verb.

### Character name glossary — who Noodle means

**The renames are finished.** This table is not a warning; it is a dictionary. Noodle still uses the
old names in conversation, so *"fix moss's hair"* has to resolve to Nettle without asking.

| If he says | He means | Who she is |
|---|---|---|
| **Moss** | **Nettle** | the green-hooded necromancer |
| **Vex** | **Severine** | the vampire |
| **Wick** | **Cassadora** | the one-eyed seer with the Orb |
| **`skull`** | **Cassadora** | her old codename, not a display name |
| **`chess`** | **Anastasia** | her codename, and her live character folder |

**Code uses CODENAMES, never in-game names** (Noodle, 2026-09-22). In-game names change; codenames
do not. Every new file, folder, index, key and variable uses the codename; the in-game name appears only
in display text, or in a comment beside its codename.

| Codename | In-game name |
|---|---|
| `knight` | Brienne |
| `necro` | Nettle |
| `vamp` | Severine |
| `seer` | Cassadora |
| `lancer` | Cinder |
| `priest` | Clemence |
| `chess` | Anastasia |

> Anytime the in-game names are used anywhere it's a clear sign you created the file or variable in a
> previous session, not me.

Existing identifiers like `characterIndex: "severine"` predate the rule and stay unless he asks.

**Never assume an old name in feedback is a mistake.** Round 07's *"moss should have 1"* meant Nettle,
and reading it as a typo would have assigned the rank to nobody.

#### One code hazard left over from the renames

The renames are done in the content, but two of the old strings are still live in the code for
unrelated reasons. **Measured session 41** across `scripts/misc/honeycomb.js` and
`scripts/misc/honeycomb/`:

| String | Hits | Why it is there |
|---|---|---|
| `moss` | 0 | Gone. |
| `wick` | 0 | Gone. |
| `vex` | 4 | **The save migration.** `honeycomb-state.js` 2037–2038 rewrites `vex` → `severine` when an old save loads. Removing it strands every pre-rename save. |
| `skull` | 32 | **Not Cassadora at all** — every hit is the literal skull picture: `icons/skull`, `icons/skull-horned`, `icons/book-skull-purple`, `glyph: "skull"`, drawn for death, Broken and downed. |

So a find-and-replace of `skull` → `cassadora` would break 32 icon references and the broken and downed
cut-ins, and none of the damage would look like a rename bug. Leave both strings alone.

### Standing content rules: the warning report

> We need a sort of general warning function that runs on game startup to make sure the game follows
> standardized rules. This should compile a report of various arrays like characters, cards, and
> enemies that we can add to later.
> Don't display the warning in-game, just the console, since we may choose to ignore some warnings for
> whatever reason.
> Much later down the line, we'll wrap this warning function into our final output workflow for releases.

Freedom in the content tables comes with limits the presentation can't stretch past (how many types fit
a card frame, for one). Those limits are written down as **rules** in
`scripts/misc/honeycomb/honeycomb-warnings.js`, so content that breaks one gets reported instead of
quietly rendering badly.

- `honeycomb.warningSubjectArray` lists what gets checked (cards, characters, enemies, …), and
  `honeycomb.warningRuleArray` lists the rules. **A new rule is a table entry**, and the number it
  measures against goes in `tuning.warnings`, not in the rule.
- It runs once per page load at the top of `honeycombBoot` and prints to the **console only**, never
  in-game. Deliberate exceptions go in `tuning.warnings.ignoredArray`, where they stay visible as
  ignored.
- `honeycomb.warnings.report()` returns the report as data. The release workflow will read that later.
- When a feedback round sets a hard limit on content, that limit should get a rule.

> - The game must be playable both within the framework of Syrup Town and made easily removable in
>   case it is spun off into a full independent game. This does -not- mean you cannot use existing
>   functions and code, only that if you do use any you need to keep a specific list of exactly what
>   functions and variables you need from existing code in a design document. This includes javascript
>   functions, CSS, and HTML.

`REQUIREMENTS.md` is that list, and it is kept honest by confining **all** host contact to
`honeycomb.platform` in `honeycomb.js`. Four functions, all `typeof`-guarded. A host dependency
anywhere else is a leak — move it into the adapter.

> - This also means the game must be playable offline (users running a local index.html file directly
>   in their browser) and online (hosted on neocities)

No `fetch`, no XHR, no modules, no build step. Plain `<img>` and `<link>`, which load fine from
`file://`.

> - The minimum viable product includes a playable teambuilding scene, map scene, and combat scene.

All three built and verified. ✅

> - The combat scene must at a minimum support calling simple 2-frame animations, element/ui movement,
>   card dragging (in a way that does not interfere with the Jiggy minigame's controls), actions taken
>   by both card elements and non-card elements (such as collected items or character abilities),
>   status effects, resources, temporary resource manipulation, and other absolute basics required to
>   achieve a win/loss state.

| Requirement | Where |
|---|---|
| 2-frame animations | `honeycomb.combatScene.swapFrame` — the primitive both action and hurt beats use |
| element/UI movement | Floating numbers, lunge, shake, card travel; `tuning.animation` |
| card dragging, Jiggy-safe | Pointer Events + `setPointerCapture`; zero document listeners; never uses `.puzzle-piece`. Reasoning and shell checks in REQUIREMENTS §8 |
| non-card actions | Relics and equipment act through the same hooks and effects (Iron Sigil, Crimson Fang, Whetstone) |
| status effects | `honeycomb-content-statuses.js`, 10 to start |
| resources | Declared in `honeycomb.resourceArray` with a `scope` of run / combat / profile |
| temporary resource manipulation | Energy is a combat-scope resource; cards grant and spend it |
| win/loss | `honeycomb.combat.checkEnd`, plus a turn cap so a stall cannot hang a run |

> - The combat scene also includes victory and defeat overlays, as well as the need to support
>   permanent resource changes, including changes to the deck.

Victory offers gold plus a card choice; defeat shows a run summary. `addCardToDeck` /
`removeCardFromDeck` / `upgradeCard` are permanent and distinct from the in-combat `addCardToPile`.

> - The teambuilding scene must support adding characters up to an arbitrary number of characters, as
>   well as the ability to customize those characters. Each character has their own pool of cards that
>   are added to a shared deck once a run begins. Again, modular, create the engine to be compatible
>   with concepts like costume changes, equipment, and deck alteration through changing those
>   costumes/equipment or by manual manipulation.

Party size is `tuning.run.partySizeMinimum/Starting/Maximum` — the engine imposes no ceiling of its
own. Outfits and equipment share one modifier shape (`healthModifier`, `cardAdditionArray`,
`cardReplacementArray`, `hooks`) and both reach the deck through the single seam
`honeycomb.memberCardEntryArray`. The teambuilding screen previews the resulting deck live, before any
run exists.

> - The map scene must support moving between various areas, seeing previews of those areas, triggering
>   events, making choices, and having those choices affect your resources and deck.

Generated node graph with forward routing, hover previews, and events whose choices run the same
effect lists cards do — so an event can hand out relics, edit the deck, or spend gold with no
event-specific engine code.

> - The final deliverable goes beyond the minimum viable product, closer to a rough demo.

**Scope not yet agreed.** Noodle asked to be consulted on this. Do not expand scope without that
conversation.

> - Keep comments within the code clean and readable, do not use "I", "you", or "we" inside them.
>   Dictate what is needed to be understood and move on.

Noodle, 2026-09-23:

> please don't include notes from our conversations in your code. [...] I understand the desire to keep
> my original wording intact, but that belongs in archived feedback, never in the code. Code comments are
> to be as lean as possible

**No quotes, no conversation notes, no session history in code comments.** A comment says what the code
does and why, in as few lines as it takes. His wording belongs in the workstream's `FEEDBACK.md` and its
`_archive/`. This overrides any older habit of naming the feedback item or session in a comment. About a
thousand older comment lines still quote him; they are cleaned only when he asks.

> - Saving and loading (both manual and autosaves) should be kept consistent with how the core game
>   handles it, see scripts/gameplay/savedata.js for that when needed. At your discretion you may
>   create a new save function or save data location for honeycomb rather than the core `data` variable.

Took the discretion: separate `honeycombSave*` localStorage namespace, so removing either game cannot
corrupt the other. Slot conventions and text export mirror `savedata.js` in style.

> - RNG must be completely deterministic.

Named streams, mulberry32, `(seed, calls)` is the complete state. Verified: same seed reproduces a
fight exactly, and a mid-combat save reloaded into a fresh engine continues to an identical result.

---

## Presentation rules (current stage)

> I want mobile landscape to be playable. Phone usage comprises a very important part of my playerbase.

Added session 6. **Mobile landscape is a target, not a nice-to-have.** **Session 38 adds mobile
PORTRAIT to the demo scope** (see "The demo scope"): everything below still holds, but a portrait
phone is a different aspect ratio, not a smaller one, so the layouts want re-measuring rather than
re-scaling. A 2340×1080 phone is roughly
the same aspect ratio as a desktop window, but only ~400 CSS px tall, so anything sized in `px`/`rem`
renders ~2× larger relative to the screen than on desktop. "It scales down faithfully" is not an
acceptable assumption — compare against `!designDocs/honeycomb/!imageStorage/screenshots/desk vs mobile/`. Since the
scaling pass, every length is a honeycomb pixel and the phone is a measured match; see `reference/SCALING-01.md`.

> Thus, when considering how to create placeholder UI elements, it is essential to consider whether
> that element is better made as a code-created SVG file that can be replaced with a higher quality
> asset later, or if the element would work better as HTML enhanced via CSS. Also keep everything
> organized enough that when the time comes to improve the game visually that all of the elements to
> improve can be located.

The rule settled on, and applied throughout:

- **SVG** for anything conceptually an **icon** — a discrete picture that will become a drawn asset.
  Generated at runtime by `honeycomb.ui.glyph`, so the swap to a real file is a path change.
- **HTML + CSS** for anything conceptually a **widget** — bars, frames, panels, layout. These get
  restyled, not replaced, so they stay as elements CSS can reach.
- Everything provisional is tagged **`HC-PLACEHOLDER`** in `honeycomb.css` and `honeycomb-ui.js`.
  Grep that tag to find every element an art pass should touch.

> Your image workspace will be using WEBP assets contained within the v13 spire images folder. […]
> Create a simple variation of the cleanupImage helper function to call assets from this folder, which
> will be replaced if the game's assets are ever moved into the game's main images-webp folder. When
> all is said and done, this function should contain the -only- instance of "v13 spire images" within
> the game's code.

`honeycomb.image(path)`. Verify with `grep -rn "v13 spire images" scripts/` — expect exactly one hit.

> Five mockups of the UI can be found in the mockups folder. Please see these as -extremely- rough
> guidelines, absolutely do not take any element strictly literally or as a hard rule.

Followed loosely. One deliberate divergence: mockup 3 labels the green hooded character "Nettle / Rogue",
but her art carries a skull-topped necromancer staff, so she is a **Necromancer** in the content table.
Names kept, classes matched to the art. Easily changed — it is one field.

> The cards/frames folder contains exactly two placeholder assets for horizontal and vertical card
> frames, however future assets will all obey the same frame dimensions.

Measured, not eyeballed: both are 1992×2540 with a **transparent** art window. Rectangles recorded as
percentages in `tuning.art.cardFrame`, so a future frame with a different window is a tuning edit.

---

## Where Noodle wants to be consulted

> - When each of the MVP stages of the primary three scenes is complete
> - When deciding on the scope of the demo
> - Any time it is determined that existing Syrup Town code should be changed rather than honeycomb's
>   code working around it.

Status: **the MVP checkpoint was reported; the first demo shipped as the Public Test Release on
2026-09-23; the second demo's gate is below (2026-09-25).** Syrup Town logic is unchanged apart from
additive wiring: the loader line in each page, two `devPreviewBoot` cases, and the title-screen button
(`REQUIREMENTS.md` §4b, signed off).

### The demo scope — the second demo (Noodle, 2026-09-25)

The first demo shipped as the Public Test Release on 2026-09-23; its session-38 scope list and the
amendments are `Archive/DEMO-1-SCOPE.md`. On 2026-09-25 Noodle set the second demo's scope in a
housekeeping message, in three lists. **The lists are the gate.** Each line is also filed, in his words, in
the workstream that owns it; the table under the lists says which, and that folder's `FEEDBACK.md` is
the queue. The two blockers with a paragraph behind them are quoted in full in `test_suite/FEEDBACK.md`
and `desk/FEEDBACK.md`.

> I know what's needed for the next demo release of honeycomb and I have it mostly mapped out in separate pipelines:
> - Engine
> - Artwork
> - Events & Writing
> - Mobile support
> - Card pool rework
> - Enemy rework
> - Relic & equipment rework
>
> Each one is mostly independent of each other, so each productive day I spend working on honeycomb I'll try and focus on one of these until the next demo build is ready. I tried to single out the ones where leaving them for later would create a ton of headaches:
>
> Early Stage Work Blockers
> - Test Suite Overhaul [...]
> - Finish Desk app [...]
> - Quality tuner
> - Balance suites A and B
>
> And this is a list of I think everything the second demo build really needs. I'm confident I want everything on here, even stuff like mobile portrait support, since that's actually a hugely loyal part of my playerbase.
> - Per-character card overhaul
> - Give alt outfits actual images
> - Card art first pass (blocked by picking alt outfits since alt outfits in art is a great way to make them distinct and identify archetypes)
> - Mobile landscape size buffs (Make the game more playable on mobile.)
> - Mobile portrait styling (Zoomed in battlefield view, drag to pan across screen, events with images over the text instead of to the side of it, actually much closer than expected)
> - New SFX collection
> - SFX assignment
> - New VFX creation
> - Venom events
> - Charm events
> - Heat events
> - Char specific Penance and Torment events
> - Elite music
> - Boss music
> - Thoughtful overhaul of common map events
> - Per-character map events (mainly as ways to raise lust weakness faster for players who want the H)
> - Shop enhancement (dragging to assign neutral ownership)
> - Rest site audit (I know it needs more complex image picking to show multiple party members, but it's quite close to fine already due to work we did with rest site upgrades)
> - Common enemy encounter rework & additions
> - Elite enemy encounter rework & additions
> - Boss enemy encounter rework

**Where each line lives.** Codes are the item numbers in that folder's `FEEDBACK.md`.

| His line | Pipeline | Folder and item | Where it stands, and what it waits on |
|---|---|---|---|
| Test Suite Overhaul | blocker | `test_suite/` S64-1 | Measured, not started. A two-stage order is proposed there, because the card pool cut turns the content-pinned checks red on the day it lands |
| Finish Desk app | blocker | `desk/` phases 5 to 11 | Phases 1 to 4 built, waiting on a desk restart and his eye. A session of its own; nothing in the game waits on it |
| Quality tuner | blocker | `quality_lab/` | Designed. Phase 0 needs none of the seven open decisions. Comes before the SFX and VFX assignment it serves |
| Balance suites A and B | blocker | `balance_tests/` T1 to T6 | Built. Owed: the full-size overnight run, the calibration against his play, Steps 5 to 7's checks. The pool wants a Crunch run either side |
| Per-character card overhaul | Card pool rework | `rework/cards/` B34, `rework/cards/CARD-POOL-02.md` | All six grids and the neutral tier drafted; his vetoes held. First engine job is `rework/starters/` B1 |
| Give alt outfits actual images | Artwork | `art_pipeline/` B26 | Round-5 prompts for four characters written; his picks come first |
| Card art first pass | Artwork | `art_pipeline/` B3, B2 | Blocked by the alt picks AND by the pool cut: about 70 cards leave, so the order is pool, outfits, art |
| Mobile landscape size buffs | Mobile support | `mobile/` S64-1 | The sizing pass A12 deferred. Wants the phone test path first |
| Mobile portrait styling | Mobile support | `mobile/` S64-2 | Zoomed battlefield, drag to pan, image over text. Re-measure, do not re-scale |
| New SFX collection, SFX assignment | Engine (audio) | `audio/` B9 to B11 | His library first, then assignment through one table (`quality_lab/` Q5 asks which) |
| New VFX creation | Engine (vfx) | `vfx/` B13 | Tilt-and-redden in-engine first; the lab's picker is the assignment half |
| Venom, Charm, Heat, Penance and Torment events | Events & Writing | `lust_events/` B23 | Venom and Penance can start now; Exposure after the E14 retag; Heat after the status exists; Torment after Brienne's Bastion strand. **"Charm" is read as Exposure; his word is owed** |
| Elite music, Boss music | Engine (audio) | `audio/` B12 | Two songs from him; one row and one cue each. The three built tracks still wait on his ear |
| Thoughtful overhaul of common map events | Events & Writing | `map_events/` S64-1 | New folder. Pictures done; the cast lines, the run-dependent choices and the prose are open, and the prose is his |
| Per-character map events | Events & Writing | `map_events/` S64-2 | The Weeping Bloom is the model. Which tag each raises is his, against the scene docket |
| Shop enhancement | Engine | `ui/` S64-1 | After the neutral tier lands in shops |
| Rest site audit | Engine | `map/` S64-1 | A browser pass; B30's whole-party picture is the one decision in it |
| Common, Elite and Boss encounter rework and additions | Enemy rework | `rework/enemies/` S64-1; `enemy_overhaul/` E14, E11, E13, E7-DEFERRED, E9 | E14's retag first, a signed-off MUST. The five previewed designs are the route-native elites. The turn-target question needs the Crunch |
| Relic & equipment rework | Relic & equipment rework | `rework/starters/` B22, B1; `rework/progression/` B4 | Answered session 39, not built: replace three relics, cut starting relics, distribute unlockables |
| Engine | Engine | cross-cutting | The verbs the other pipelines need: `rework/cards/CARD-POOL-02.md` §5 (Heat, Poison halving, unlock routes, reward weights, a discover verb, an exact-damage hook), the unplayed-card hook (`rework/cards/` A1), the Bastion hooks, the Charm scrub |

**The order the dependencies force**, whichever pipeline a day is spent on:

1. **The retag, `enemy_overhaul/` E14, and the `heat` tag.** Enemies, the Exposure scenes and the card
   grids all sit on it, and it touches saves (`reconcileWeaknessLedger`). Two more lines behave like
   blockers and are not on his list: this one, and the next.
2. **Unlock routes, `rework/starters/` B1.** The pool's shape assumes the alts are gated; nothing gates them.
3. **The suite's stage one** (`test_suite/`): guard the disk reads, tag the blocks, so the cut can land
   without the suite going dark.
4. **The card pool**, one character at a time, the content blocks muted, the warning report as the gate,
   the Crunch before and after.
5. **Art**: the alt picks, then card art on the surviving 120 plus 12 neutrals.
6. **The Quality Lab's Phase 0**, then SFX and VFX assignment through it.
7. **Events** as their engine pieces arrive; Venom and Penance from day one.
8. **Mobile**, once the UI it sizes has stopped moving; the phone test path first.

**What this reading leaves for him.** Each is filed in the folder named, with an assumption written beside it
so no work stops on it.

1. **"Charm events."** The 2026-09-25 sign-off makes the fey Exposure and leaves Charm for act 2. Read as
   Exposure events (`lust_events/` B23).
2. **Performance and telemetry** were the top demo goal on 2026-09-19 and are absent from the list. Read as a
   standing concern, not a gate item; the telemetry endpoint is still unpicked (`performance/` B16, A8).
3. **The suite's order**: the two stages proposed in `test_suite/`, or the rebuild after the cut with the
   suite red in between.
4. **Card art** is blocked by the pool cut as much as by the outfits (`art_pipeline/` B3).
5. **Two enemy folders for one pipeline.** `rework/enemies/` (numbers, encounters) and `enemy_overhaul/`
   (fiction, tags, names) each cost an enemy session a catch-up. Merging them is proposed for the first
   enemy session, not done in the housekeeping.
6. **Off the gate by this reading:** Anastasia (`chessmaster/`, outside the card pass in his words), the
   Event Gallery's G6 to G11, the card frame's A2, A3 and B27, and the Battle Lab. Say if any belongs on it.

#### Standing rules kept from the first demo

- **Act 1-1 and act 1-2 are LIVE, and act 1-2 is the demo's stopping point.** Act 1-2 is the catch-all for
  the three routes (Act1-A the Mushroom Frontier, Act1-B the Thorn Arbor, Act1-C the Pollen Road), chosen
  by the Act1-1 boss the run beats. Noodle: *"the demo ships with act 1-1 and act1-2, so all three routes
  are in scope."* Anastasia's chess gauntlet is a one-time act 1-2.
- **The live region 1 is the Mushroom Frontier, not Myconid Navel** (Noodle, session 55): *"Both have their
  charm, but Mushroom Frontier is better suited for the direction we actually went for. We'll save 'X's
  Navel' for a future area."*
- **Anastasia must not be advertised if she is cut.** She is `inDevelopment: true`, and the roster, the
  teambuilding screen and the compendium leave her out entirely: no "???" tile, not even an anonymous one.
  Any screen that lists characters, and any screen that COUNTS them, asks `honeycomb.shippedCharacterArray()`,
  never `honeycomb.characterArray` and never its own copy of the filter. (Session 40 found the teambuilding
  roster drawing a phantom tile off the unfiltered table; the gate is the fix.)
- **The floor under act 1** (Noodle, session 55), a hard floor that outranks "a run is meant to be lost
  more often than won":

  > A run ending in the first 1/3rd of act 1 should be astronomically unlucky, or the result of purposeful
  > self-sabotage. As long as the first third of the act is possible, a devoted player has a chance no
  > matter how unskilled they are.

  > if the player is hard stuck at the start due to a low skill level, they can't get EXP for the
  > progression nodes or unlock commons, and their lust weaknesses build, so both of our self-balancing
  > tools fail catastrophically

  Which way to err: *"I'd rather have the data point of 'you went too far in the other direction' than 'the
  spot you knew felt bad does, in fact, feel bad'."* Session 55 built the `opening` encounter tier (rows 0
  to 5), cut act 1's ordinary fight from 10% to 8% of party health, and started every map on a rest.
- **Mobile portrait is a different aspect ratio, not a smaller one.** `reference/SCALING-01.md`'s parity
  numbers are LANDSCAPE numbers; the layouts want re-measuring, not re-scaling.
- **Work independently.** Noodle: *"this project mainly exists as a low-user-attention project for you to
  work on while I am working on other non-coding tasks."* Batch questions to the checkpoints above.

---

## Documentation rules

> Please keep any design documentation contained within the !designDocs/honeycomb folder, the bare
> minimum being a CATCH-UP.md file to inform your future sessions, a BASICS.md file so that I don't
> need to write a new prompt of this length and detail for each new session, and a REQUIREMENTS.md
> which references anything outside of honeycomb files which are required for the game to function.
> Keep any images created inside the v13 spire images folder, and keep the functions you need inside
> the scripts/misc/honeycomb.js file. However, you may create a "honeycomb" folder inside the misc
> folder if more js files are needed.

### Three tiers: every piece of information is mandatory, active, or archived

Noodle's rule, session 41, and the reason this section exists:

> The more unnecessary detail in a mandatory document, the faster you run out of usage rate.

Every session is pointed at `BASICS.md`, which points at `CATCH-UP.md`. Anything living in those two
files is paid for by **every** session, whatever it is working on. So each piece of information sits in
exactly one of three tiers, and **putting it in the wrong tier is a bug**:

| Tier | Means | Lives in |
|---|---|---|
| **Mandatory** | Needed next session no matter which part of Honeycomb is being worked on. | `BASICS.md`, `CATCH-UP.md`, `REQUIREMENTS.md`, `FEEDBACK.md`. **Nothing else is at the honeycomb root.** |
| **Active** | Scoped to one feature, but needed as context by the next session working on that feature. | that workstream's folder — its `CATCH-UP.md` or `STATUS.md` |
| **Archived** | Unlikely to be needed, but essential to have stored somewhere in case it is asked for. | `Archive/`, or an `_archive/` inside the workstream folder |

The test for mandatory: *would a session working on something completely unrelated still need this?*
Knowing **which subfolder to open** for the starter rework is mandatory. Knowing **what the starter
rework entails** is not — it drains context for every session doing an art pass. The root `CATCH-UP.md`
is a **directory**, not a history.

The test for archived: `Archive/SESSION-LOG.md` is the model. It is important that it exists; it is
irrelevant to any ongoing work unless something in it is directly called for.

### NOTHING GOES IN THE HONEYCOMB ROOT

`!designDocs/honeycomb/` holds **four documents and folders. Nothing else, ever.**

| At the root | |
|---|---|
| `BASICS.md` | this file |
| `CATCH-UP.md` | the directory |
| `REQUIREMENTS.md` | the spin-off checklist |
| `FEEDBACK.md` | the index and the inbox |

**Never write an output file here.** Not a script, not a dump, not a report, not a `.json` of results,
not a screenshot, not a scratch file, not a "temporary" anything. This is the rule that was broken
most: session 41 found **51 entries** at this level — seven 145 KB simulation dumps, twenty-seven dev
tools, five HTML benches and a pile of one-off `.md` files, all of which a session had to scroll past
to find the four documents that matter.

Where output actually goes:

| Kind of file | Goes in |
|---|---|
| A dev tool, or anything it writes | `tools/` |
| A result set a tool produces | beside that tool in `tools/`, in its own subfolder if there is more than one (`tools/draft-sim/`) |
| A design document | INSIDE the workstream folder it belongs to |
| A new design pathway's first document | a NEW folder for that pathway, made the same day |
| Anything genuinely temporary | the scratchpad, which is outside the repo. **Not here.** |
| Something finished with | `Archive/`, or the workstream's `_archive/` |

If a file does not obviously belong to one of the folders, that is a sign the project is missing a
folder — **make the folder**. It is never a reason to leave the file at the root.

### Clean as you go

- **A new design pathway gets its own folder**, with its own catch-up, on the day it starts. Not later.
- **A workstream catch-up holds the LAST session, not every session preceding it.** What the next
  session needs is the gist of where things were left, which files to open, and what the remaining
  goals are — plus a pointer to the archive *only in case* it becomes relevant. When it starts
  accumulating sessions, move the old ones into the folder's archive.
- **Do not add files beside a workstream folder.** New documents go INSIDE the folder they belong to —
  see "Nothing goes in the honeycomb root" above.
- **A folder gets a folder map** — a table at the top of its catch-up saying which file holds what,
  checked against the disk rather than assumed.
- **Move information down a tier rather than deleting it.** When something stops being needed every
  session, it moves to the workstream folder; when it stops being needed at all, it moves to `Archive/`.

After moving or renaming any document, run the audit — a pointer to a file that is not there costs the
next session a search:

```
node "!designDocs/honeycomb/tools/doc-links.js"
```

It exits 1 on any backticked path that no longer resolves, and separately lists bare `.md` names that
do not sit beside the doc naming them (two workstreams both having a `STATUS.md` is how a pointer goes
wrong). `Archive/` is exempt — an archive is allowed to name files that have since moved.

### Feedback lives with its workstream

**Every workstream folder has its own `FEEDBACK.md`.** A session is a one-topic affair — enemies one
day, the card pool the next, relics after that — so carrying forty items you are not working on costs
context every session for nothing. Numbered rounds ended with round 09 (session 41).

The root `FEEDBACK.md` does two things and holds nothing:

1. **An inbox** for new reports that have not been sorted yet.
2. **An index**: what each workstream holds, how many items are open in it, and when work last landed
   there.

**A report that does not obviously belong to one workstream goes in the root inbox, not in a guess.**
The next session files it.

Updating rules, unchanged in substance:

- **Annotate an item the moment it lands**, not in a batch at the end of the session. If Noodle stops a
  session midway, the next one picks up from that file, so it has to say what is done, what is half
  done and what waits on a decision at every point.
- **Quotes are Noodle's, verbatim.** Add to a feedback file; never summarise one. If an annotation and
  a quote disagree, the quote wins. When an item moves between files, move it byte for byte.
- Keep each file to OPEN work. Move finished items, quote and annotation together, to that folder's
  `_archive/FEEDBACK-DONE.md`.
- **When an item closes, update that workstream's row in the root `FEEDBACK.md`.** That count is how
  the next session detects a session that ended before it could write its docs: if a row disagrees with
  the folder's own file, the folder wins and something was left half-finished.

**Check that at the start of a session, before picking up any work:**

```
node "!designDocs/honeycomb/tools/feedback-audit.js"
```

It exits 1 on any row that disagrees with its folder, and names which. A red run means the previous
session was cut short — go and look at that folder for a half-finished item before starting anything new.

### A standing brief never accumulates progress

Promoted from `card_redesign/BRIEF.md`, where Noodle wrote the rule for a weaker model and it turned
out to be the right rule for every workstream:

> Do not add progress or new assumptions to this file. Changes to this document should be done
> EXCLUSIVELY to correct a mistake or fill an undeveloped section. Progress → `STATUS.md`.
> Assumptions → `INFERENCES.md`.

So a workstream folder holds three KINDS of document and never mixes them:

| Kind | Holds | Changes when |
|---|---|---|
| **Brief** (`BRIEF.md`, this file) | goals, hard rules, the shape of done | a rule is wrong or a section was never written |
| **Status** (`STATUS.md` or `CATCH-UP.md`, plus that folder's `FEEDBACK.md`) | where the work is, what passed, what waits | every completed task |
| **Inferences** (`INFERENCES.md`) | choices made without Noodle, and how to pivot each | a guess is made or overturned |

A brief that has swallowed a session log stops being readable as a brief, which is the failure this
prevents — the point of the brief is that a new session can execute from it cold.

Two more from the same file, worth keeping project-wide:

- **A folder gets a folder map.** A table at the top of the brief saying which file holds what, and
  it is checked against the disk rather than assumed.
- **Do not add files beside a workstream folder.** New documents go INSIDE the folder they belong to —
  see "Nothing goes in the honeycomb root" above.

### Verification: no pass by assertion

Also promoted from `card_redesign/BRIEF.md`. These are not "be careful" reminders; each one names a
way a session has actually reported work that was not done.

> Do not, DO NOT, DO NOT EVER mark a step without visual verification in the browser. It is extremely
> unprofessional to mark a step as complete only for the barest and briefest visual analysis to reveal
> issues as crippling as they are obvious. Testing is part of the workflow; the workflow is not
> complete without testing. Failure to follow this step suggests potential failure to follow other
> steps as well, resulting in the entire workflow becoming tainted and needing to be directly verified.

- **Numbers beat descriptions.** When a screenshot and a measurement disagree, the measurement wins
  and the shot is retaken. Say plainly what an image does and does not show — a screenshot taken
  against missing placeholder rasters has shown collapsed boxes that looked like a layout bug and
  were not.
- **The suite is not the truth either.** A green run only certifies what it asserts. A red suite is
  the best forensic tool this project has (it named every unfinished piece of the interrupted session
  35); a green one is not evidence that the picture is right.
- **Unchecked is a failure, not a pass.** This is what the warning report is for on the content side
  — the same standard applies to a visible change with no check behind it.
- **Falsify before ticking.** Re-read the requirement and try to prove the check failed before
  recording that it passed.

---

## Browser tooling

Two different agents work on this project, and they reach a browser differently. **Read the note first;
do not hand the wrong one to the wrong agent.**

> **If you are Claude (the `claude` CLI, working from `.claude/`): keep using your own preview server.**
> Your setup is `.claude/devserver.py` + `.claude/launch.json`, and it works. The tool below is not for
> you; do not switch to it.

**opencode's browser tool** — for the opencode agent only. The opencode desktop app's MCP plumbing never
connected a browser server, so this bypasses MCP entirely and drives the system Chrome through the
Playwright bundled with `@playwright/mcp` (no browser download, no config, no restart).

1. Serve the game with no caching: `python .claude/devserver.py 8000` (leave it running).
2. Drive it with `!designDocs/honeycomb/tools/agent-browser.js`:

```
node "!designDocs/honeycomb/tools/agent-browser.js" --out shot.png [options]
```

| Option | Meaning |
|---|---|
| `--url <url>` | default `http://localhost:8000/index.html`; also accepts a `file:///…` path (needed to prove offline behaviour) |
| `--out <png>` | where the screenshot is written; read it back with the Read tool |
| `--viewport WxH` | default `1280x720`; e.g. `812x375` for phone landscape |
| `--scale <n>` | device scale factor (2 gives a sharper shot) |
| `--wait <ms>` | how long to wait after load before acting (2500–3000 is plenty; the title boot is slow) |
| `--after <ms>` | wait between the eval and the shot (default 1200) |
| `--eval "<js>"` / `--eval-file <file>` | run a snippet in the page before the shot; the game exposes `window.honeycomb` |
| `--hover "<selector>"` | real pointer hover, so inline `onmouseenter` tooltips fire |
| `--full` | full-page screenshot |
| `--console` | print the page's console output and `[pageerror]`s, plus the eval's return value |

The eval snippet is how the game is driven, e.g. start a fight and open a screen:

```js
(async () => {
  honeycomb.state = honeycomb.newProfile();
  honeycomb.newRun([{ characterIndex: "severine", outfitIndex: "default" }], 42);
  honeycomb.combat.begin("loneSporeling", {});
  honeycomb.scene.go("combat");
  await new Promise((r) => setTimeout(r, 2500));
  return "ok";
})()
```

Rules of thumb: use `file://` to prove something works offline (a canvas is tainted there); use
`--console` to catch a page error a screenshot would hide; and hover with `--hover`, not a synthetic
event, when testing tooltips.

