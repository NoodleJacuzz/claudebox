# Honeycomb Catacombs — BASICS

**The standing brief.** A new session starts with "read `BASICS.md` and `CATCH-UP.md`, then carry on".
`CATCH-UP.md` says where the work is; this file says what the work *is*, what the rules are, and what the
second demo needs. The long form this was cut from on 2026-09-25 is `Archive/demo1/BASICS.md`.

The requirements below are Noodle's, preserved as written. Annotations under each are how they were
interpreted. **If an annotation and a requirement disagree, the requirement wins.**

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

> But aside from these, this project mainly exists as a low-user-attention project for you to work on
> while I am working on other non-coding tasks.

Work independently. Batch questions to the checkpoints below rather than interrupting.

---

## Hard requirements

> - The game must be extremely modular and customizable to allow for future iteration, absolutely no
>   magic numbers.

Every number lives in `honeycomb-tuning.js`, or as a **named field on a content-table entry**. A numeric
literal inside a function body is a bug.

> - "Modular" in this case refers to both the ability of future developers to iterate on existing
>   content structure, but also to have the maximal-allowed design space for freedom of ideas on
>   altering characters, enemies, attacks, cards, and general game behavior.

The effect / value / condition registries and the hook system (`reference/ARCHITECTURE.md`). The test:
adding a card, enemy, status, relic, event or node is a **table entry only**. Needing engine code means the
engine is missing a verb; add the verb.

> - The game must be playable both within the framework of Syrup Town and made easily removable in
>   case it is spun off into a full independent game. This does -not- mean you cannot use existing
>   functions and code, only that if you do use any you need to keep a specific list of exactly what
>   functions and variables you need from existing code in a design document. This includes javascript
>   functions, CSS, and HTML.

`REQUIREMENTS.md` is that list, kept honest by confining **all** host contact to `honeycomb.platform` in
`honeycomb.js`. A host dependency anywhere else is a leak.

> - This also means the game must be playable offline (users running a local index.html file directly
>   in their browser) and online (hosted on neocities)

No `fetch`, no XHR, no modules, no build step.

> - The minimum viable product includes a playable teambuilding scene, map scene, and combat scene.
> - The combat scene must at a minimum support calling simple 2-frame animations, element/ui movement,
>   card dragging (in a way that does not interfere with the Jiggy minigame's controls), actions taken
>   by both card elements and non-card elements (such as collected items or character abilities),
>   status effects, resources, temporary resource manipulation, and other absolute basics required to
>   achieve a win/loss state.
> - The combat scene also includes victory and defeat overlays, as well as the need to support
>   permanent resource changes, including changes to the deck.
> - The teambuilding scene must support adding characters up to an arbitrary number of characters, as
>   well as the ability to customize those characters. Each character has their own pool of cards that
>   are added to a shared deck once a run begins. Again, modular, create the engine to be compatible
>   with concepts like costume changes, equipment, and deck alteration through changing those
>   costumes/equipment or by manual manipulation.
> - The map scene must support moving between various areas, seeing previews of those areas, triggering
>   events, making choices, and having those choices affect your resources and deck.
> - The final deliverable goes beyond the minimum viable product, closer to a rough demo.

All built and verified; the first demo shipped as the Public Test Release on 2026-09-23. Where each
requirement lives in the code is the table in `Archive/demo1/BASICS.md`. Card dragging is Pointer Events
with `setPointerCapture`, zero document listeners, never `.puzzle-piece` (`REQUIREMENTS.md` §8).

> - Keep comments within the code clean and readable, do not use "I", "you", or "we" inside them.
>   Dictate what is needed to be understood and move on.

> please don't include notes from our conversations in your code. [...] I understand the desire to keep
> my original wording intact, but that belongs in archived feedback, never in the code. Code comments are
> to be as lean as possible

No quotes, no conversation notes, no session history in code comments. His wording belongs in the
pipeline's document and its archive.

> - Saving and loading (both manual and autosaves) should be kept consistent with how the core game
>   handles it, see scripts/gameplay/savedata.js for that when needed. At your discretion you may
>   create a new save function or save data location for honeycomb rather than the core `data` variable.

A separate `honeycombSave*` localStorage namespace, so removing either game cannot corrupt the other.

> - RNG must be completely deterministic.

Named streams, mulberry32; `(seed, calls)` is the complete state.

### Character name glossary — who Noodle means

The renames are finished; this is a dictionary. He still uses the old names in conversation, so *"fix
moss's hair"* resolves to Nettle without asking.

| If he says | He means | Who she is |
|---|---|---|
| **Moss** | **Nettle** | the green-hooded necromancer |
| **Vex** | **Severine** | the vampire |
| **Wick** | **Cassadora** | the one-eyed seer with the Orb |
| **`skull`** | **Cassadora** | her old codename, not a display name |
| **`chess`** | **Anastasia** | her codename, and her live character folder |

**Code uses CODENAMES, never in-game names** (Noodle, 2026-09-22): `knight` Brienne, `necro` Nettle,
`vamp` Severine, `seer` Cassadora, `lancer` Cinder, `priest` Clemence, `chess` Anastasia. Existing
identifiers like `characterIndex: "severine"` predate the rule and stay unless he asks.

> Anytime the in-game names are used anywhere it's a clear sign you created the file or variable in a
> previous session, not me.

Two old strings are live in the code for other reasons and must stay: `vex` is the save migration in
`honeycomb-state.js`, and `skull` is the literal skull icon drawn for death, Broken and downed, never
Cassadora. A find-and-replace of either breaks the game.

### Standing content rules: the warning report

> We need a sort of general warning function that runs on game startup to make sure the game follows
> standardized rules. This should compile a report of various arrays like characters, cards, and
> enemies that we can add to later.
> Don't display the warning in-game, just the console, since we may choose to ignore some warnings for
> whatever reason.
> Much later down the line, we'll wrap this warning function into our final output workflow for releases.

`honeycomb-warnings.js`: `warningSubjectArray` lists what is checked, `warningRuleArray` the rules. A new
rule is a table entry, its number goes in `tuning.warnings`, deliberate exceptions go in
`tuning.warnings.ignoredArray`. Console only; `honeycomb.warnings.report()` returns the data. When a
feedback round sets a hard limit on content, that limit gets a rule.

---

## Presentation rules

> I want mobile landscape to be playable. Phone usage comprises a very important part of my playerbase.

Mobile landscape is a measured scale-down (`reference/SCALING-01.md`); every length is a honeycomb pixel.
**Mobile portrait is a different aspect ratio, not a smaller one**, and is on the second demo's gate.

> Thus, when considering how to create placeholder UI elements, it is essential to consider whether
> that element is better made as a code-created SVG file that can be replaced with a higher quality
> asset later, or if the element would work better as HTML enhanced via CSS. Also keep everything
> organized enough that when the time comes to improve the game visually that all of the elements to
> improve can be located.

**SVG** for anything conceptually an icon (`honeycomb.ui.glyph`; the swap to a real file is a path
change). **HTML + CSS** for anything conceptually a widget. Everything provisional is tagged
`HC-PLACEHOLDER` in `honeycomb.css` and `honeycomb-ui.js`.

> Your image workspace will be using WEBP assets contained within the v13 spire images folder. […]
> Create a simple variation of the cleanupImage helper function to call assets from this folder, which
> will be replaced if the game's assets are ever moved into the game's main images-webp folder. When
> all is said and done, this function should contain the -only- instance of "v13 spire images" within
> the game's code.

`honeycomb.image(path)`; `honeycomb.imageFolder` is the one assignment (two comments in
`honeycomb-tuning.js` also carry the words).

> Five mockups of the UI can be found in the mockups folder. Please see these as -extremely- rough
> guidelines, absolutely do not take any element strictly literally or as a hard rule.

> The cards/frames folder contains exactly two placeholder assets for horizontal and vertical card
> frames, however future assets will all obey the same frame dimensions.

Both frames are 1992×2540 with a transparent art window, recorded as percentages in `tuning.art.cardFrame`.

---

## Where Noodle wants to be consulted

> - When each of the MVP stages of the primary three scenes is complete
> - When deciding on the scope of the demo
> - Any time it is determined that existing Syrup Town code should be changed rather than honeycomb's
>   code working around it.

The MVP checkpoint was reported; the first demo shipped 2026-09-23; the second demo's gate is below.
Syrup Town logic is unchanged apart from additive wiring: the loader line in each page, two
`devPreviewBoot` cases, and the title-screen button (`REQUIREMENTS.md` §4b, signed off).

### Design review happens on the desktop, in the frame (Noodle, 2026-09-25)

> This came up in the last two sessions. I cannot judge cards or relics as lists in txt files. I want visual
> grids. They can be dummies using the game's card art, but I must be able to see a card with its cost and
> effect in the card frame in order to feel I can judge it fairly. I would want a similar grid of relics.
> That means all review and veto-ing is deferred for desktop sessions, please record this in your claude file.

A cloud session drafts, measures and files; it never records a verdict of his on a card or a relic. The
verdicts happen on the desktop, in the game's frame, through the bench `tooling/TOOLING.md` S65-1 asks for.
A text grid is a draft, not a review.

### The demo scope — the second demo (Noodle, 2026-09-25)

The first demo's scope list is `Archive/demo1/Archive/DEMO-1-SCOPE.md`. On 2026-09-25 Noodle set the
second demo's scope in three lists. **The lists are the gate.** Each line is filed, in his words, in the
pipeline document that owns it (the table under the lists says which), and that document is the queue.

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

> I forgot about writing and style matching, that's another blocker since I'd want your help laying the groundwork for the events.

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

Three things he settled about the list the same day: *"Charm events"* means **Exposure** events (the fey's
tag; Charm is act 2); the three enemy lines are **three sessions**, not one, and so are the event lines
(*"the more we try to do in one session the less attention each part gets"*); and the list is not sized,
because sizes are hard to estimate and *"the majority of testing can be done by volunteers once we know
it's actually functional, and their feedback would be worth more than just our own."*

**Where each line lives.** Codes are the item numbers in that pipeline's document.

| His line | Pipeline | Document, item | Where it stands, and what it waits on |
|---|---|---|---|
| Test Suite Overhaul | blocker | `tooling/TOOLING.md` S64-1 | Measured, not started. Two stages proposed; his yes owed |
| Finish Desk app | blocker | `desk/FEEDBACK.md` phases 5 to 11 | Phases 1 to 4 built, waiting on a restart and his eye. All eleven stand |
| Quality tuner | blocker | `tooling/TOOLING.md` Q1 to Q8 | Designed. Phase 0 needs no decision. Comes before SFX and VFX assignment |
| Balance suites A and B | blocker | `tooling/TOOLING.md` T1 to T6 | Built. Owed: the full-size run, his hour of fixed-seed play, Steps 5 to 7's checks |
| Writing and style matching | blocker | `events/EVENTS.md` S64-7, `../voice_matching/` | Eight of thirteen items built 2026-09-21 |
| Per-character card overhaul | Card pool rework | `card_pool/CARD-POOL.md` B34, `card_pool/CARD-POOL-02.md` | All six grids and the neutrals drafted; vetoes held. First engine job `relics/RELICS.md` B1 |
| Give alt outfits actual images | Artwork | `art_pipeline/ART-PIPELINE.md` B26 | Round-5 prompts written for four characters; his picks first |
| Card art first pass | Artwork | `art_pipeline/ART-PIPELINE.md` B3, B2 | After the alt picks AND the pool cut (about 70 cards leave) |
| New VFX creation | Artwork | `art_pipeline/ART-PIPELINE.md` B13 | Stable Diffusion bulk overlays. Tilt-and-redden is the engine's; assignment is the lab's |
| Mobile landscape size buffs | Mobile support | `mobile/MOBILE.md` S64-1 | The sizing pass; the phone test path first |
| Mobile portrait styling | Mobile support | `mobile/MOBILE.md` S64-2 | His design: the camera pans with the card drag |
| New SFX collection, SFX assignment | Engine | `engine/ENGINE.md` B9 to B11 | His library first, then assignment through one table |
| Elite music, Boss music | Engine | `engine/ENGINE.md` B12 | Two songs from him; one row and one cue each |
| Venom events | Events & Writing | `events/EVENTS.md` S64-3 | Can start now |
| Charm events, meaning Exposure | Events & Writing | `events/EVENTS.md` S64-4 | After the E14 retag |
| Heat events | Events & Writing | `events/EVENTS.md` S64-5 | After the Heat status exists |
| Char specific Penance and Torment events | Events & Writing | `events/EVENTS.md` S64-6 | Penance now; Torment after Brienne's Bastion strand |
| Thoughtful overhaul of common map events | Events & Writing | `events/EVENTS.md` S64-1 | Pictures done; cast lines, run-dependent choices and the prose open |
| Per-character map events | Events & Writing | `events/EVENTS.md` S64-2 | The Weeping Bloom is the model; which tag each raises is his |
| Shop enhancement | Engine | `engine/ENGINE.md` S64-1 | After the neutral tier lands in shops |
| Rest site audit | Engine | `engine/ENGINE.md` S64-2 | A browser pass; B30's whole-party picture is the one decision |
| Common enemy encounter rework & additions | Enemy rework | `enemies/ENEMIES.md` S64-1 | After E14; carries the turn-target question |
| Elite enemy encounter rework & additions | Enemy rework | `enemies/ENEMIES.md` S64-2 | The five previewed designs are the route-native elites |
| Boss enemy encounter rework | Enemy rework | `enemies/ENEMIES.md` S64-3 | All placeholders but the Juggernaut, his words |
| Relic & equipment rework | Relic & equipment rework | `relics/RELICS.md` S65-1, B22, B1, B4 | The rarity model answered session 65 (`relics/RELIC-REWORK-01.md`); his MUST: *"an expanded and robust set of relic rarities"*. Safe pool first, his lists second; verdicts in the frame |
| Engine | Engine | `engine/ENGINE.md`, "Where it stands" | The verbs the other pipelines wait for |

**The order the dependencies force**, whichever pipeline a day is spent on:

1. **The retag** (`enemies/ENEMIES.md` E14, a signed-off MUST) and the `heat` tag. Enemies, the Exposure
   scenes and the card grids all sit on it, and it touches saves.
2. **The unlock routes** (`relics/RELICS.md` B1). The pool's shape assumes the alts are gated.
3. **The suite's stage one** (`tooling/TOOLING.md` S64-1), so the cut can land without the suite going dark.
4. **The card pool**, one character at a time, the content blocks muted, the warning report as the gate,
   the Crunch before and after.
5. **Art**: the alt picks, then card art on the surviving pool.
6. **The Quality Lab's Phase 0**, then SFX and VFX assignment through it.
7. **Events** as their engine pieces arrive; the writing groundwork and Venom first.
8. **Mobile**, once the UI it sizes has stopped moving; the phone test path first.

**Left for him:** whether performance and telemetry, the top demo goal on 2026-09-19 and absent from this
list, are a standing concern (assumed) or back on the gate; the suite's two-stage order; and whether
anything off the gate by this reading belongs on it: Anastasia (outside the card pass in his words), the
Event Gallery, the card chrome's remaining three items, the Battle Lab.

#### Standing rules kept from the first demo

- **Act 1-1 and act 1-2 are LIVE, and act 1-2 is the demo's stopping point.** Act 1-2 is the catch-all for
  the three routes (Act1-A the Mushroom Frontier, Act1-B the Thorn Arbor, Act1-C the Pollen Road), chosen
  by the Act1-1 boss the run beats. Noodle: *"the demo ships with act 1-1 and act1-2, so all three routes
  are in scope."* Anastasia's chess gauntlet is a one-time act 1-2.
- **The live region 1 is the Mushroom Frontier, not Myconid Navel** (Noodle, session 55): *"Both have their
  charm, but Mushroom Frontier is better suited for the direction we actually went for. We'll save 'X's
  Navel' for a future area."*
- **Anastasia must not be advertised if she is cut.** She is `inDevelopment: true`; the roster, the
  teambuilding screen and the compendium leave her out entirely, no "???" tile. Any screen that lists or
  COUNTS characters asks `honeycomb.shippedCharacterArray()`, never `honeycomb.characterArray`.
- **The floor under act 1** (Noodle, session 55), a hard floor that outranks "a run is meant to be lost
  more often than won":

  > A run ending in the first 1/3rd of act 1 should be astronomically unlucky, or the result of purposeful
  > self-sabotage. As long as the first third of the act is possible, a devoted player has a chance no
  > matter how unskilled they are.

  > if the player is hard stuck at the start due to a low skill level, they can't get EXP for the
  > progression nodes or unlock commons, and their lust weaknesses build, so both of our self-balancing
  > tools fail catastrophically

  Which way to err: *"I'd rather have the data point of 'you went too far in the other direction' than 'the
  spot you knew felt bad does, in fact, feel bad'."*
- **Play testing is volunteers' work once a thing is functional**; the demo ships to the Public Test
  Release for that, and `tools/ptr-check.js` runs after every upload.

---

## Documentation rules

> The more unnecessary detail in a mandatory document, the faster you run out of usage rate.

**The layout, from 2026-09-25.** Four files at the root, and nothing else, ever: `BASICS.md` (this),
`CATCH-UP.md` (the directory), `REQUIREMENTS.md` (the spin-off checklist), `FEEDBACK.md` (the index and
the inbox). Then **one folder per pipeline** with **one document named after it** that holds where the
work is, the rules, and the queue in Noodle's words, plus an ARCHIVE.md beside it and only the briefs
that are live: `card_pool/`, `enemies/`, `art_pipeline/`, `events/`, `mobile/`, `relics/`, `engine/`,
`tooling/`. `desk/` keeps its own folder because its server reads `desk/data/`. `designBibles/` and
`reference/` are read when the work touches them. `tools/` is code. **`Archive/demo1/` is the whole
documentation tree as it stood when the first demo shipped**, frozen; nothing routinely reads it, and
everything written before 2026-09-25 is in there at its old path. `Archive/SESSION-LOG.md` is the log.

**Three tiers, and putting something in the wrong one is a bug.** Mandatory: the four root files, paid for
by every session. Active: the pipeline's document and its live briefs. Archived: ARCHIVE.md beside the
document, or `Archive/demo1/` for anything older.

**Closing an item is one motion.** When an item is done, cut its `###` section out of the pipeline
document and paste it at the top of that folder's ARCHIVE.md, the same minute, then fix the count in the
root `FEEDBACK.md`. Noodle: *"an issue is resolved and bam, archived."* No wrap-up session is needed and
none should be waited for. A finished brief goes to the same ARCHIVE.md folder as a file.

**Quotes are Noodle's, verbatim.** Add to a document; never summarise a quote or rewrite one on the way.
If an annotation and a quote disagree, the quote wins. A report that fits no pipeline goes in the root
inbox, not in a guess.

**A brief never accumulates progress** (his rule, from the card redesign): *"Changes to this document should
be done EXCLUSIVELY to correct a mistake or fill an undeveloped section. Progress → STATUS.md. Assumptions →
INFERENCES.md."* Progress goes in the pipeline document; guesses made without him go in an inferences
file beside it, each with how to pivot.

**Update the pipeline document as each task lands**, not in a batch at the end, and add one line for the
session to `CATCH-UP.md`. A session can be stopped at any moment and the next one starts from those two.

**A new pipeline is a new folder with its document, the same day.** A new document goes inside the
pipeline folder it belongs to; a dev tool or anything it writes goes in `tools/`; anything temporary goes
in the scratchpad, never here.

**Two audits, both cheap.** `node tools/feedback-audit.js` at the start of a session (the index against
every pipeline's queue; a disagreement means the previous session was cut short). `node tools/doc-links.js`
after moving or renaming anything (every backticked path resolves).

### Verification: no pass by assertion

> Do not, DO NOT, DO NOT EVER mark a step without visual verification in the browser. It is extremely
> unprofessional to mark a step as complete only for the barest and briefest visual analysis to reveal
> issues as crippling as they are obvious. Testing is part of the workflow; the workflow is not
> complete without testing. Failure to follow this step suggests potential failure to follow other
> steps as well, resulting in the entire workflow becoming tainted and needing to be directly verified.

- **Numbers beat descriptions.** When a screenshot and a measurement disagree, the measurement wins.
- **The suite is not the truth either.** Green certifies only what is asserted; a red suite is the best
  forensic tool the project has for an interrupted session.
- **Unchecked is a failure, not a pass.** A visible change with no check behind it is not done.
- **Falsify before ticking.** Try to prove a check failed before recording that it passed.

---

## Browser tooling

Two agents reach a browser differently: Claude (the `claude` CLI) uses its own preview server
(`.claude/devserver.py` + `.claude/launch.json`); opencode drives the system Chrome through
`tools/agent-browser.js`. Options and the eval-snippet pattern are in `tools/README.md`, "Browser
driving". A cloud session serves the repo with `python3 -m http.server` and drives it with Playwright.
