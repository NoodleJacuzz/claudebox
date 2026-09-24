# Lust events — CATCH-UP

**A demo goal as of session 39.** Project-wide context is `../BASICS.md`. The queue is `FEEDBACK.md`.

---

## Where it stands, at the end of session 48

**Read this first; it is the shortest route back in.**

| | |
|---|---|
| **The engine** | Done. The event QUEUE replaced the old three tables (B22). Suite green, 2128 passed. |
| **The rules** | Done. `IDEAS.md` §2 holds six, all from Noodle's own corrections this session. |
| **The characters** | Done. `IDEAS.md` §3, his words quoted. Rewritten twice; the second pass is the real one. |
| **The scenes** | **Nettle venom 1, 2 and 3 are sketches.** Brienne venom 1, 2 and 3 are sketches. `SCENES-01.md`. **The other 36 are at IDEA stage** — `IDEAS-SCENES-01.md`, session 49, waiting on Noodle's read. |
| **The prompts** | Nettle's eight images, checked and pasteable: `PROMPTS-NETTLE-01.txt`. |
| **The images** | **Fourteen, finished by Noodle and IN THE GAME** at `v13 spire images/characters/necro/lust/*.webp`, 3.4MB the lot. Nettle venom 1-3 (`v1-1`…`v3-3`) plus venom 3's two endings, `v3win-1`–4 and `v3loss-1`–2. Converted with `../tools/png-to-webp.py`. |
| **In the game** | **Nettle's venom 1, 2 and 3, and NOTHING ELSE.** Session 50 cut the placeholder events on Noodle's call — "we want to accept Nettle is the only one done on time, and only one of her two lusts". They live on as suite fixtures (`RETIRED_LUST_EVENT_FIXTURES` in `../tools/test-honeycomb.js`), so the shapes they proved are still tested and a player never meets them. |
| **Blocked on Noodle** | Nothing. `HANDOFF-ENGINE.md`'s three engine changes are closed: two built, one turned out not to be needed. |

### How to playtest Nettle's arc

The three rows are gated on her venom rank, so a fresh profile is owed none of them. From the console,
in Honeycomb, outside a run:

```js
honeycomb.lust.addExposure("nettle", "venom", 40);
```

Thresholds are 13 / 27 / 40 (`tuning.lust.exposureRankArray`), so 40 clears all three ranks at once.
The rows still arrive **one at a time and in order**, because parts two and three each require the
previous row to have been PLAYED rather than merely the rank. Nettle then locks out of the party and
the heart on her roster entry plays the head of the queue.

The battle is `nettleVenomBattle`, a lone `bogToad`, declared at the bottom of
`honeycomb-content-lust-events.js`. Win goes to Extraction (four beats), loss to Marked (two).

### The hang, and what replaced it

The stall was never in the style. `webui2-generate.js` drove the real page in headless Chrome, and that
is where it died — one image, then a wait on a condition that never came true, with Forge sitting idle
the whole time because nothing was ever dispatched to it.

**Session 49 rewrote the tool with no browser in it.** It loads the engine into a Node `vm` context and
calls `checkForDirt`, `assemblePrompt`, `buildPrompt`, `v2ScanDispatchKeywords` and `removeDuplicates`
in the same order webui.js's own `sendPromptArray` / `sendPrompt` call them, then POSTs a request
assembled from webui.js's dispatch site — `Prompt Notes` entry included, so the Forge extension still
runs. This is how `outfits-generate.js`, `refs-generate.js` and `card-prompts-generate.js` have always
worked, and Noodle's own note is why: those are the runs that finish. Eight images in 79 seconds.

    node scripts/webui/tools/webui2-generate.js --block <combo.txt> --mode dry
    node scripts/webui/tools/webui2-generate.js --block <combo.txt> --mode run \
         --out "v13 spire png/characters/necro/lust" --style Oreteki18kin

Names come from the block's own `- ` comment lines when their count matches the variant count, so
`- v1-1  at her desk` writes `v1-1.png`. The size comes from the bare `Semi-Wide` in the block's
suffix and beats `--size`. The wrong-style batch it replaced is kept at
`scratchpad/necro-lust-syurofluff-v7/` for as long as this session's scratchpad lives.

### What the next session should NOT redo

- The queue, the rules, the character notes, the venom/charm definitions. All settled and written down.
- The tag traps: `L1` context-swaps, `behind desk` needs `indoors`, `squating` is a typo, `solo focus`
  removes `solo`, `blurry` is inert. All measured; they live in
  `.claude/skills/syrup-town-images/reference/generating.md`.
- How to generate at all. Same file. **Forge is on beef pc at `192.168.0.2:7000`, not localhost.**
- **Build a sending tool.** `webui2-generate.js` sends any combo block now. It is general purpose and it
  is not specific to Nettle, to lust events or to Honeycomb.

---

## How this pathway got here



**The engine is built; what is missing is written content.**

**Session 48 replaced how an event is chosen with an EVENT QUEUE** (B22), on Noodle's design. The old
system decided what a rank-up raised at the instant the rank was crossed and froze the answer onto the
record; three tables competed to supply that answer, and a backfill existed to undo the freezing for
scenes written later. All of that is gone. Noodle:

> It's very simple: I'd have a list of mandatory lust events and their requirements. If the player meets
> these requirements and doesn't have the event completed in their savedata, the character is locked and
> a lust event is ready to be played.

> This means I can do multi-part events, replace events wholesale, have lust events that care about
> multiple lust events, and so on.

> I'm personally completely fine with a locked roster. The player coming to the game to find like 50
> events waiting for them is not a bad thing at all.

One table, `honeycomb.lustEventQueueArray`, and the queue is **derived** — worked out fresh every time
it is asked, from requirements and the profile's completed list. A row written today is therefore owed
today, to every profile that already passes it. **The backfill was deleted because the queue makes it
unnecessary, not because the problem went away.**

**The trigger moved off the weakness** (Noodle's own call, same session):

> The existing system places the trigger for these events to start over the weakness itself. It's
> elegant, and I do like it, but I don't think we can keep it as much as I'd want to. It doesn't work
> without being able to tie an event strictly to a weakness.

It now belongs to the character: the **heart** that replaces the party toggle on a locked roster entry,
and a pink **banner** across the top of that character's sheet. Both play the head of the same queue.
A weakness row still says *"Recently ranked up!"* — that is all it says.

Noodle's standing direction: **Lust Events are the game's authored narrative.** The procedural map
guarantees nothing else, so these are where the writing lives.

**The demo work is a cut before it is an authoring job.** Noodle, session 39:

> reduce the number of lust tags such that we can get lust events done for all ranks of the 2-3 tags we
> keep for every character

Keep 2–3 tags per character, then author every rank of what survives. The current tag count is the
reason no tag has complete coverage — the cut is what makes full coverage reachable at all.

**Session 42 refined this in two ways** (B18): a single Venom tag is the demo target rather than a
standing rule — *"I don't want to limit myself to exclusively one type per act"* — and the scenes have
a rate requirement: *"it should be conceivable that every run triggers an H-event."* `RATE.md` shows
that goal is already reachable on one tag, and that what actually blocks it is the enemy roster, where
28% of moves deal Lust.

---

## Files

| File | Holds |
|---|---|
| `FEEDBACK.md` | B17, B18, B19, B20; B21 closed s47, B22 closed s48. |
| `SCENES-01.md` | **Ten venom scene drafts, waiting on Noodle.** Brienne and Nettle 1-3 complete, plus a rank 1 each for Severine, Cassadora, Cinder and Clemence. Written in image BEATS against Noodle’s own three image plans. Measured with `.claude/skills/syrup-town-scenes/tools/scene-metrics.py`, zero out-of-band flags. **Not in the game.** It also carries the one engine blocker: art is per-event, not per-page, so a scene can only show one image. |
| `HANDOFF-ENGINE.md` | **Three small engine changes, specced not built** — italics/bold in event prose, per-page art, and the "Later..." continue button. All three block scene work; none was applied because another agent was live in the file. |
| `PROMPTS-NETTLE-02.txt` | **The combo block for venom 3's two endings**, six images: `v3win-1`–4 and `v3loss-1`–2. Two sets, because the win is in the dungeon and the loss is outdoors. Its comment header records four traps found while checking it, two of which are general: `[act1-flora]`/`[forestDay]` are not real shortcuts, and a named block is global across `//` sets. |
| `PROMPTS-NETTLE-01.txt` | **Pasteable combo block** for Nettle's venom 2 and 3, six images. Checked with `scripts/webui/tools/webui2-inspect.js`: audit clean, the `behind desk` office trap neutralised by the inn suffix, `squating` typo fixed, `L1` dropped for context-swapping. |
| `IDEAS-SCENES-01.md` | **Idea stage for all 36 scenes with no sketch** — 15 venom (Severine, Cassadora, Cinder, Clemence, Anastasia) and all 21 charm. Each scene says what happens, why it fits its rank, the one world detail if it has one, and how many images it is and what they show. The next job on any of them is idea → sketch. Write Brienne's and Nettle's charm rank 1s first; they are Noodle's own examples. |
| `IDEAS-EVENTS-01.md` | **Idea stage for the 18 party and progress events** with nothing written — §6's 13 remaining party events and §7's 5 remaining pairs. Each says what the hazard is, what she does in the low version, what she does instead in the high version, what it costs, and the one world detail. Every rank 3 cost is a random card, which is the open question in it. |
| `RATE.md` | The arithmetic: what one run can raise, what a rank-up costs, and the roster gap. |
| `AUTHORING.md` | The writing desk: tone rules, the queue row, rank meanings, coverage grid. |
| `IDEAS.md` | **The frame and the menu.** Rewritten session 48 around Noodle's four design goals (lore, the three-beat arc, party events, progress events). §§1–8 are the frame: the rules, what each character does with lust, what each lust type is about, and three grids waiting to be filled — 42 scene slots, 14 party events (one per character per lust type), 6 progress events (pairs). **§§2–8 were rewritten in plain English at Noodle’s request; §§9–19 have not had that pass.** §§9–19 are the session-47 menu: the measurements, the cut, the recurring cast and the scene pool. **The scene writing in it is not Noodle's and none of it is approved.** |
| `../designBibles/characters.md` | Who these events are about. |
| `../designBibles/story.md` | Tone and setting. |

Live content: `honeycomb-content-lust-events.js` (the queue and the events) and
`honeycomb-lust-events.js` (the queue engine, rank-up notifications, the event host, Lust Battles, and
the `gainWeakness` / `gainPersonalExperience` / `unlock` effects and the requirement vocabulary).

---

## Rules this pathway must not break

- **Lust is never a status.** It is `entity.lust`, moved only by `lust` / `soothe`.
- **The queue is DERIVED, never stored.** What the profile stores is the completed LIST
  (`lustEventDoneArray`) and nothing else. The moment a session caches a queue onto the profile, the
  whole point of it — content reaching an old save — is gone.
- **Rank-up notifications are a separate thing** and carry no event. They are the weakness glow, they
  clear when the weakness is looked at, and they lock nobody.
- **The per-run weakness ceiling is a clamp, not a block** (`maximumRankGainPerRun`).
- **An authored event is a table row.** Needing engine code for a new event means a missing verb.
- Weaknesses decay per DAY on the bench, not per run — Noodle's own design.
