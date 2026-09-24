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

Status: **MVP checkpoint reached and reported. Demo scope settled session 38, amended session 39
(below).** No Syrup Town logic has been changed — only additive wiring (script tags, a stylesheet link,
two `devPreviewBoot` cases).

### The demo scope (Noodle, session 38; amended session 39)

> The Proof of Concept is well past completed and testing. We're working on a beta demo, and the goals
> are explicitly:
>
> - Sprite pass (ongoing)
> - Card pool rework (ongoing)
> - Card frame redesign (finished?)
> - Enemy rework (needs testing)
> - Progression rework (finished?)
> - Anastasia (ongoing, currently in debt, next session starts by going backwards, her being shown as
>   secret is also bad if she doesn't make it, I don't need 10k emails asking how to unlock her)
> - VFX (ongoing)
> - Looping Music (unstarted)
> - Act 1-1 and Act 1-2
> - Mobile portrait (We're way closer than expected due to healthy design habits)

**Session 42 defined what "Act 1-2" covers:** it is the catch-all for the sub-acts that follow
Act1-1 — **Act1-A (Mushroom Frontier, live), Act1-B (Flora, empty), Act1-C (Pollen Road, empty)** —
and Noodle confirmed *"the demo ships with act 1-1 and act1-2, so all three routes are in scope."*
Two of the three have no enemies yet. See `designBibles/story.md` §4 and `enemy_overhaul/`.

**This list is the demo.** Work that is not on it does not block the demo, however loud it is in the
feedback round — each workstream’s `FEEDBACK.md` is the queue, this is the gate. Items that are larger or
smaller than they look are called out here so no session mistakes them:

- **Act 1-1 and Act 1-2 are LIVE** (corrected session 39 — the session-38 reading below was wrong).
  Act 1-1 is the wide automated map on a simple background; act 1-2 is the one overlaid on a more
  complex background. The branching landed in session 55: act 1-1 ends in three boss nodes, one per
  route, and a boss the profile has met before is named on its node along with the route it leads to.
  Anastasia's chess gauntlet is a one-time act 1-2, and **act 1-2 is the demo's stopping point**.

  **THE LIVE ACT 1-2 IS THE MUSHROOM FRONTIER, NOT MYCONID NAVEL** (Noodle, session 55). BASICS carried
  *Myconid Navel* from session 38 and he settled it when the two were put side by side: *"Both have
  their charm, but Mushroom Frontier is better suited for the direction we actually went for. We'll
  save 'X's Navel' for a future area."* Anything still naming Myconid Navel as this region's title is
  stale; the name is kept for somewhere later. *(Session 38 read `tuning.map` as one 9-row map with no act table — reconcile that
  reading with the live behaviour before building the branching.)*
- **Mobile portrait** is a different target from the one the scaling pass was measured against —
  "Presentation rules" below names mobile LANDSCAPE, and `reference/SCALING-01.md`'s parity numbers are
  landscape numbers. The honeycomb-pixel work carries over; the layouts have to be re-measured.
  In practice this is blocked on the game being painful to drive on a phone (small buttons, deliberate
  — mobile sizing comes after the UI is done), so it needs a large-hit-target test path first.
- **Anastasia must not be advertised if she is cut.** She is `inDevelopment: true`, and the roster, the
  teambuilding screen and the compendium must all leave her out entirely — no "???" tile promising a
  secret character, not even an anonymous one. Any screen that lists characters, and any screen that
  COUNTS them, asks `honeycomb.shippedCharacterArray()`; never `honeycomb.characterArray` directly, and
  never its own copy of the filter. Any future unlock UI must keep that property until she ships.
  *(Corrected session 40: this section previously asserted the property was held. It was not — the
  teambuilding roster sized its locked slots off the unfiltered table and drew a phantom tile. The gate
  above is the fix; the history is `chessmaster/FEEDBACK.md` A4.)*

#### The floor under act 1 (Noodle, session 55)

> A run ending in the first 1/3rd of act 1 should be astronomically unlucky, or the result of purposeful
> self-sabotage. As long as the first third of the act is possible, a devoted player has a chance no
> matter how unskilled they are.

**This is a hard floor, and it outranks "a run is meant to be lost more often than won".** The reason he
gives is that losing early breaks both of the game's self-correcting systems at once:

> if the player is hard stuck at the start due to a low skill level, they can't get EXP for the
> progression nodes or unlock commons, and their lust weaknesses build, so both of our self-balancing
> tools fail catastrophically

A player who cannot clear the first third never earns the experience that would make them stronger, and
their Lust weaknesses rise while they fail. **He also said which way to err:** *"I'd rather have the data
point of 'you went too far in the other direction' than 'the spot you knew felt bad does, in fact, feel
bad'."*

What session 55 did about it: an `opening` encounter tier for the first three rows, act 1's ordinary
fight cut from 10% of party health to 8%, more combat nodes per map, and every map starting on a rest.

#### Amendments (Noodle, session 39)

Three changes to the list above. Full quotes and annotations are in the workstream feedback files indexed by `FEEDBACK.md`.

> High priority, most important demo goal is better performance. Why are players saying the game runs
> poorly? Are they experiencing different things than on my machine?

**Performance is now the top demo goal** (`performance/FEEDBACK.md` B16). It has a diagnostic half that cannot
be answered from Noodle's machine — his hardware is not player hardware — which is why telemetry is
promoted with it.

> Add to the demo's scope we need at least a few actual lust events, to reduce the number of lust tags
> such that we can get lust events done for all ranks of the 2-3 tags we keep for every character.

**Lust events are added to the demo** (B17): cut to 2–3 tags per character, then author every rank of
what survives. The cut is what makes full coverage reachable.

> Might be a demo goal. It would turn thousands of lurker players into real datapoints.

**Telemetry is promoted** from demoted to a candidate goal (A8). It is the instrument for the
performance question above. An endpoint still needs picking.

> But aside from these, this project mainly exists as a low-user-attention project for you to work on
> while I am working on other non-coding tasks.

Work independently. Batch questions to the checkpoints above rather than interrupting.

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

