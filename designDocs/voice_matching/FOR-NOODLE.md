# For Noodle — what you can do, and what I cannot do without you

The job queue for Claude is `TODO.md`. **This file is only the things that need you.** Nothing here is
urgent and nothing here is blocking; it exists so the list stops living in a chat window you have
scrolled past.

Each item says roughly how long it takes and what it buys. Cross one off by doing it and saying so, or
by saying it is not worth doing.

---

## The single most useful thing, and you are already doing it

**Keep rewriting drafts directly in the file.** Every correction you make is now collected and kept,
in `.claude/skills/syrup-town-scenes/reference/rewrites.md` for writing and
`.claude/skills/syrup-town-images/reference/corrections.md` for prompts. Those two files are read
before anything gets written, and they are the only part of the setup with a perfect track record —
the rules written from the outside kept getting broken, and your corrections never have.

**If you can spare one extra sentence, say why.** Not always, not as a chore. But "I changed this
because X" is worth several times the change on its own, and a change with no reason attached still
has to be guessed at.

You do not need to keep a log. The change itself is the log.

---

# To help the writing

### 1. Three to five lines per Honeycomb character, in her voice — about 20 minutes

**Bigger than everything else on this list put together.**

Six of the seven Honeycomb characters have a description and no sound: **Brienne, Severine,
Cassadora, Cinder, Clemence, Anastasia.** Nettle has three full scenes that you wrote, and she is the
only one anybody can measure a draft against.

Not a scene. Just lines. Any moment at all — walking, complaining, in a fight, refusing something.
Three to five each, and half of them can be one sentence.

Anywhere is fine: a desk note, a text file, straight into chat.

### 2. Say when a draft is wrong even if you cannot say why — free

If a scene reads off and you cannot name the reason, **that is still worth saying.** The log records
what changed, and the pattern usually turns up across several entries even when no single one had a
stated reason. Three of the five findings in `rewrites.md` were found that way.

### 3. Decide what a "voice fix" button on the desk should look like — 5 minutes of thinking

The desk already keeps a copy of the game file before every edit you make, so every change you make
from your phone is already recorded. What it cannot know is which changes were about **voice** and
which were typos or reflow.

The smallest version: one button on a line you have just changed that marks it as a voice fix, with an
optional one-line why.

Worth saying if you would rather it were something else, or nothing — it is a small build either way
and there is no point building the wrong one. (`TODO.md` V4.)

**Answered 2026-09-23: yes, build the smallest version.** It is item 5d in
`!designDocs/honeycomb/desk/FEEDBACK.md`, and gets built with the desk's editor tools.

### 4. Two things in the desk inbox still need you to point at what you mean

Both have been sitting since last night and neither can move without you:

- **IN-7, event window styling** — *"a number of shortcuts were taken with the event window styling"*.
  Which windows, or which shortcut you noticed first, is enough to start.
- **IN-8, nonsense text** — *"a mountain of absolutely nonsensical text is still left in the game"*.
  One example would do; the rest can be swept for once there is a pattern to match.

### 5. Open questions from the scene drafts — quick calls

- **Nettle V3 image numbering.** The opening lines gained an image, so what was `v3-1` is now `im 2`.
  Say if you would rather the new beat were `v3-0` and the old numbers stayed put.
- **Brienne V2 has no image plan** and is the only sketch that is a single static beat. It may want a
  second.
- **The four Brienne scenes** — do they land, or should they be rewritten against what your Nettle
  scenes turned out to be? They were drafted before the rewrite log existed.
- **theQuietSpring** — you asked to replace it with `dynamicShortPool`. There is nothing by that name
  anywhere in the repo, so that one needs you to say what it should be.

---

# To help the image generation

### 1. Confirm which of your hand-added tag groups are standing preferences — 10 minutes

Comparing the fourteen shipped Nettle images against the prompts they were given found that **eleven
were corrected by hand before generating**, in seven repeating groups. They are written up in
`.claude/skills/syrup-town-images/reference/corrections.md` and they are already being applied.

What would make them much stronger is knowing which are **always** true and which were about that one
picture:

| The group | Always, or that picture? |
|---|---|
| Five or more face tags on every line (`drool`, `:o`, `ahegao`, `wavy mouth`, `heavy blush`…) | |
| `ear wiggle`, `ear blush` on elves | |
| `dark, dimly lit, dramatic lighting, window, night sky` on every night shot | |
| `motion lines, impact lines` on every sex beat | |
| Emphasis parens around the beat's key concept — `(green tentacles, tentacle pit, tentacle sex)` | |
| Repeating a scene's props into its later beats | |
| Pose detail rather than posture — `wide stance`, `hands on desk`, `head out of frame` | |

A yes or no per row is all it takes.

### 2. Should `[inn]`, `[forestDay]` and `[act1-flora]` become real shortcuts? — your call

They read like shortcuts in every sketch and the engine knows none of them, so each one gets written
out by hand at prompt stage — `[forestDay]` into `outdoors, forest, grass, trees, daytime, sunlight`,
and so on. Making them real would remove a step that currently has to be remembered every time.

The reason to say no is that a real shortcut is harder to vary per scene. Your call, and either answer
settles it.

### 3. Is rank 3 supposed to open with her already affected? — one line

Nettle's rank 3 beat 1 was drafted as *composed and quietly pleased*. You changed both the picture
(adding `wavy mouth, naughty face, pervert, steaming body, trembling, sweat, heart`) and the text
(adding *"It's my favorite color too~"*).

If that is a general rule for rank 3 openings — she is visibly gone before the scene starts — it
should be written into the scene rules rather than rediscovered per character.

### 4. Two questions the whole-corpus sweep raised — quick calls

A tool now reads every generated image's sidecar and works out what you added by hand after the
prompt was handed to you. It found 2,003 usable images, which is the corpus you thought did not
exist: `webui2-generate.js` has been writing your typed-in line into every sidecar all along, next to
the prompt that actually ran. **So you do not need to keep anything, and nothing about how you work
has to change.** The command is `node scripts/webui/tools/webui2-handedits.js`, and it runs on
desktop like any other.

Two things came out of it that are yours:

- **`solo` gets added by hand on three separate days across three weeks.** A single-character prompt
  ought to emit that by itself. Either something drops it on one path, or you add it for emphasis on
  purpose. Worth knowing which.
- **`holding sack, open sack` became `open bag, rummaging`** on Nettle's venom 2. Those first two were
  already flagged as words the engine does not know, and the prompt used them anyway. If there are
  other phrases you keep having to translate, saying so would go straight into the checklist.

### 5. Your own reminder, still open on the desk

> *"Remind me to inpaint the skull companion into this scene's image."*

Nettle Specimen beat 1, `characters/necro/lust/v1-1`. Left open deliberately as your reminder.

### 6. Four image requests are waiting on Claude, not on you

Listed here only so you know they were not lost: `map/event-well` (done, written to
`v13 spire png/map/event-well.png`), `characters/knight/events/pool`, `jellyblob-girl`,
`jellyblob-knight`. The `jellyblob-girl` one carries your idea about a filtered character dropdown in
the desk, which is recorded and not forgotten.

---

# Things you raised that are already done

So you do not spend time wondering whether they got picked up.

- **The rewrite log.** Built, seeded with sixteen entries from five scenes, and read before any scene
  is written.
- **The desk as its home.** It turned out the desk was already keeping the raw material — a copy of
  the game file before every edit you make. What is left is a command to read those copies
  automatically, which is Claude's job, not yours.
- **The sketch-to-prose worked pair.** Done from SCENES-01 against the live game, with provenance
  labelled per scene the way you asked, including the two where the idea stage was yours.
- **The image prompt comparison.** Done, all fourteen.
- **`premise` in the workflow.** It is now step 0 of the scene skill, and it works on your Honeycomb
  scenes as well as the Syrup Town ones.
- **Teaching the metrics tool to read Honeycomb.** Done, with your Nettle v1–v3 as the reference set.
  It immediately caught something: measured against your scenes, the Brienne drafts have less than
  half the narration they should.
- **A standing memory to keep the corpus current** as you add new inline features. Written, both
  halves — a new feature and the tool change that reads it are one job, and every scene you write
  joins the reference set.
- **Making sure later sessions actually use the rewrite collector.** It is now a numbered step in the
  scenes skill, a row in the honeycomb tools index, a `desk-cli.js` subcommand, a section in the
  desk's own catch-up, and a memory rule. It will not be forgotten the way the last good idea was.
- **The image prompt log you asked about.** Built, and it turned out not to need anything from you —
  see item 4 above.
