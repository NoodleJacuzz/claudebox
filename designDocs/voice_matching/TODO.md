# Voice matching — the job queue

Status key, same as `honeycomb/lust_events/FEEDBACK.md`:
☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

**Quotes marked "Noodle:" are his, verbatim. Do not summarise this file; add to it.** Annotate an item
the moment it lands, not in a batch at the end, so a session that stops halfway can be picked up from
this file alone.

What this project is: `BASICS.md`. Where the work is: `CATCH-UP.md`.

---

## Group A — the rewrite log

**This is the centre of the project.** Everything in Group B and C is worth less than this. A rule
written from the outside has a poor record; a recorded correction of yours has a perfect one.

### V1. The log file and its format ☑

**Done 2026-09-21.** It lives in the skill, at `.claude/skills/syrup-town-scenes/reference/rewrites.md`, for the reason the item leaned towards — a file that is not loaded when the writing happens does not affect the writing. `SKILL.md` step 2b now sends every session to it, and says it outranks the rest of the skill where they disagree.

One append-only file. Each entry is: the draft line, your line, one sentence on what changed, and
where it came from (which scene, which date). Nothing else, because a long entry will not get written.

Open question, for whichever of us gets there first: whether this lives in the skill
(`.claude/skills/syrup-town-scenes/reference/rewrites.md`, loaded every time a scene is written) or in
this folder with the skill pointing at it. **Leaning towards the skill**, because a file that is not
loaded when the writing happens does not affect the writing.

### V2. Derive the pairs from the desk backups ☑

**Done 2026-09-21.** `!designDocs/honeycomb/tools/desk/rewrites.js`, also reachable as `desk-cli.js rewrites`. It finds every backup, sorts them oldest first, appends the live file as the final state, and diffs consecutive states at the level of one `lineArray` entry. A removed line and an added line that share enough words are reported as one line REWRITTEN, which is the pair worth keeping; the rest are reported as cuts and additions, which are findings too.

**It earned itself on the first run.** It reproduced all sixteen hand-collected entries and **disproved one of them**: entry 3.3 claimed he wrote the `synth3` run-up from nothing, and the backups show a draft of that beat existed and he revised three of its lines. The entry is corrected and now carries the correction as its own finding — read the backups before claiming a beat is wholly anybody's.

Two things deliberately not done. It prints candidates rather than writing the log, because a run also catches typo fixes and deciding which changes are about voice is a reading job. And it does not try to identify the author: a backup is only written by a save through the desk page, and Claude edits these files directly, so in practice every backup is Noodle's. That assumption is written at the top of the file in case it ever stops being true.

Noodle:

> !designDocs\honeycomb\tools\desk should be added to your memory, it was designed in a previous
> session as a way to treat the project as a shared database between us. With some modification it
> could serve exactly that purpose.

`events.js` already copies the whole game file into `desk/data/backups/` before every write. So a
before and an after exist for every phone edit, with no extra work from anybody.

Build `desk-cli.js rewrites` (or a separate tool — decide when building): read consecutive backups and
the live file, diff them at the level of one `lineArray` entry, and print every line that changed,
oldest first. Each changed line is a candidate log entry.

- Three backups already exist from 2026-09-21. Start with those.
- Filter out edits that are Claude's own, or the log fills with noise. The desk signs writes, so the
  author is knowable.
- A line you deleted outright is as informative as one you rewrote. Keep deletions.

### V3. Seed the log from what we already have ☑

**Done 2026-09-21, and all three sources produced entries.** Sixteen numbered entries across five scenes, plus five findings that recur across them. The desk note `n-mub2q38h578e` gave the single cleanest pair in the file: his replacement of *"She holds the vial to the lamp."* with the twenty-seven word narration line that now opens the first authored scene in the game.

Three sources, all sitting on disk right now:

1. The six rows in `.claude/skills/syrup-town-scenes/reference/honeycomb.md` §3 and the matching table
   in `lust_events/SCENES-01.md`. Already written up; move them in rather than rewriting them.
2. **The SCENES-01 sketches against the live game** — this is item V6 as well, and produces log
   entries as a side effect.
3. `desk/data/desk.json` — notes whose target is a line carry a `snapshot` of the old text next to
   your comment on it. There are 17 notes and 3 flagged marks. A correction with its reason attached
   is the best shape an entry can have, so these go in first.

### V4. Desk change: let you mark a rewrite as worth keeping ⏸ — needs your call on the shape

The derived log (V2) will catch everything, including typo fixes and reflow. What it cannot know is
which change was a **voice** correction and why you made it.

The smallest version: one button on a line you have just edited that says "this was a voice fix", with
an optional one-line why. That one line is worth more than the diff it is attached to.

Do not build this before V2 is running — the diff may turn out to be clear enough on its own.

### V5. The same idea for image prompts ☑

**Done 2026-09-21.** `.claude/skills/syrup-town-images/reference/corrections.md`. The sidecars turned out to hold both halves of the pair: `Raw input:` is the prompt as handed over, the positive prompt is what reached the model, and the difference is what was added by hand in Forge. **Eleven of the fourteen were corrected**, in seven repeating groups. The largest by far is that the face is under-specified — and the three images that needed no correction are exactly the three whose expression the prompt had named outright.

Noodle:

> While I'm in this headspace, comparing the sidecars of the current images from those events with the
> originals in PROMPTS-NETTLE-01.txt would also help improve your generation skills.

> In fact, that same idea could apply to image generation, so I'll have to keep that in mind as well.

The pairs already exist and are complete:

- **Mine:** `!designDocs/honeycomb/lust_events/PROMPTS-NETTLE-01.txt` (and `-02`).
- **Yours, as shipped:** 14 sidecar `.txt` files in `v13 spire png/characters/necro/lust/` —
  `v1-1`, `v1-2`, `v2-1`…`v2-3`, `v3-1`…`v3-3`, `v3loss-1`, `v3loss-2`, `v3win-1`…`v3win-4`.
  Matching images in `v13 spire images/characters/necro/lust/`.

Fourteen before-and-after prompt pairs, where the after is the one that produced an image you kept.
Read them side by side, write down what changed, and fold the findings into
`.claude/skills/syrup-town-images/`. Then decide whether prompts get their own rewrite log or share
the scene one.

---

## Group B — teaching the step from sketch to prose

### V6. The worked sketch-to-prose page ☑

**Done 2026-09-21, folded into `rewrites.md` rather than given its own page.** Keeping the worked pairs and the running log in two files would have meant writing the same pairs twice. Provenance is labelled per scene as the item asked: scene 1 is his line over a draft, scene 2 is his second pass over a Claude rewrite of his own session-48 text, scenes 4 and 5 are his idea, a Claude sketch and his rewrite — the two strongest pairs, as expected.

Noodle:

> honeycomb/lust events/SCENES-01 has the idea and sketch, and you can see in the live game the
> changes I've made to the scenes. It's not absolutely perfect though, V3-Loss and V3-Win are the only
> ideas stages I wrote myself that are included, and the document was touched up several times
> directly, but the gap between them is mostly my rewrites over claude original.

So the material is there and it is not clean. **Label the provenance of every beat on the page** —
whose idea, whose sketch, whose final text — or the page will teach the wrong lesson on the beats that
were mine at both ends.

- V3-Loss and V3-Win are the two where the idea stage is yours. They are the strongest pairs.
- SCENES-01 has been edited in place several times, so a sketch in it may already carry your
  corrections. Where that is true, say so on the page instead of presenting it as a clean before.
- Every difference found here is also a V1 log entry. Do V6 and V3 in the same pass.

### V7. Blind practice as step 0 of a writing session ☑

**Done 2026-09-21.** It is step 0 of `SKILL.md`, and `premise` / `reveal` now work on Honeycomb scenes as well, which V8 made possible.

`scene-metrics.py premise` already prints a real scene's beats with the prose hidden, and `reveal`
prints the answer. Nothing in the workflow uses it.

Add to the skill: before a session that will write several scenes, take one real scene blind, write
it, reveal, diff. Five minutes, and it calibrates against the real thing instead of against a rule.

Needs a Honeycomb version once V8 lands, because `premise` currently only reads the Syrup Town DSL.

### V13. Three to five lines per Honeycomb character, in your hand ⏸ — yours, and about twenty minutes

Six of the seven Honeycomb characters have a description and no sound. Not a scene — just lines. Any
moment at all, whatever she would say. Brienne, Severine, Cassadora, Cinder, Clemence, Anastasia
(Nettle already has three full scenes).

Nothing else on this list would do as much for per-character voice, because there is currently nothing
to measure one against.

---

## Group C — the measuring tools

### V8. Teach `scene-metrics.py` to read Honeycomb ☑

**Done 2026-09-21.** Third band, `corpus` prints it, `list` / `premise` / `reveal` take `honeycomb` in place of a filename, and `check` picks the band by itself when a draft speaks in sprite indices (`--honeycomb` / `--syruptown` force it). The stale `<br>` note in `voice.md` is corrected. **The band immediately earned itself:** run against the Brienne V1 sketch it flags the narration share at 14% against his 34%, which is the defect the Syrup Town corpus would have reported as correct.

Noodle:

> In the live game the v1-3 Nettle scenes are 100% all me right now, they can serve as the reference
> point.

The tool's corpus is 187 Syrup Town DSL events. The live work is Honeycomb, which has no `im` line, no
player character, and keeps its prose in `pageArray` → `lineArray` → `{speaker, text}`.

- Parse `scripts/misc/honeycomb/honeycomb-content-lust-events.js`.
- Add a third band: a Honeycomb draft is measured against Honeycomb, and against Nettle v1–v3 in
  particular as the reference set.
- Drop the stale note in `voice.md` that `<br>` reads as ABSENT on Honeycomb drafts. That was fixed in
  session 49 — `escapeRichText` restores `<i>`, `<b>` and `<br>`.

### V9. Standing memory: keep the corpus current ☑

**Done 2026-09-21.** Both halves are in the `scene-writing-skill` memory: an inline feature and the tool change that reads it are one job, and every scene he writes joins the reference set.

Noodle:

> We'll need a standing memory that says to keep it updated as I come up with new inline features as
> well.

Two halves, and both belong in the memory:

1. **New inline features.** When you add markup or a directive that renders — the way `<i>`, `<b>` and
   `<br>` arrived in session 49 — `scene-metrics.py` has to learn it, or it measures the new thing as
   noise or misses it entirely. The engine change and the tool change are one job.
2. **New writing of yours.** Every scene you write yourself joins the reference set. Re-run `corpus`
   after any pass of your own and update the numbers in `voice.md`, which is a snapshot and says so.

### V10. Make three of the four qualitative misses mechanical ☑

**Done 2026-09-21.** All three are in `scene-metrics.py check`, and each flag carries the corpus
evidence that produced it instead of asking to be trusted.

**The softening check earns its keep by not over-firing.** It prints how often Noodle uses each
suspect word anywhere in his scenes, so `pleasure` (25 uses) and `desire` (8) are reported with their
counts and left alone, while `passion` and `ecstasy` come back as never used and those are the
finding. As the corpus grows the list corrects itself.

**The narration check runs on Syrup Town only.** His Honeycomb narration interprets deliberately, so
running it there would report the house style as a defect.

**The callback check found its own proof.** A word counts as a character's when she uses it at least
twice and no more than two speakers in the game use it at all. Run against the real sleeping-nun
scene it reports `dumpster` — which is the exact running bit `voice.md` named as the callback the
session-47 reconstruction missed, rediscovered without being told. Run against a generic draft it
finds nothing and prints her vocabulary so one can be chosen.

`voice.md` lists four misses the numbers do not catch. Three are checkable:

- **Softening** — a list of the euphemisms drafts reach for, checked by grep, exactly like the charm
  ban list. That one works *because* it is a grep and not a good intention.
- **No callback** — a draft containing no specific detail from that character's existing text is the
  generic version. Your sleeping nun mumbles about dumpster babies; the reconstruction wrote
  devotional muttering that would fit any nun.
- **Narration that interprets** — flag `t` lines containing "as if", "like", "seems", "somehow",
  "almost". That is where the wit gets in.

**The fourth stays a question.** Whether the last line lands cannot be counted, and `check` already
asks about it every run.

### V11. A prose checker for documents ☑

**Done 2026-09-21.** `.claude/skills/syrup-town-scenes/tools/prose-check.py`, wired into
`.claude/CLAUDE.md` rule 1, the skill's document section, and the `plain-english-in-docs` memory.

It finds the four shapes and prints the first row of every table, which is the other half of his rule
about rereading them.

**It judges the author's sentences and never his.** It skips code, tables, blockquotes and anything
inside quotation marks. That last one took two attempts: without it, `.claude/CLAUDE.md` failed on the
exact sentence it exists to forbid, and `rewrites.md` failed on every draft line it records. Quotes
regularly run over a line break, so the masking has to happen across the whole document rather than
line by line.

**It found six real faults in the four documents of this project**, all written carefully earlier the
same day, which is the argument for running it rather than trusting a careful draft. Those are fixed
and all four now pass. It also finds 14 in the older skill files, which are a separate editorial pass
and are not urgent.

**What it cannot do**, and the tool says so on every run: it finds four shapes. The commonest failure
is writing a clever summary line where an example belonged, and that has no spelling.

The doc voice is the failure with the worst record — raised twice, the second time on a document
written after the first correction. It is also the only one with no check on it.

A separate script, not `scene-metrics.py` (running that on markdown measures nothing and
`voice.md` is right to forbid it). It reads a markdown file and flags the four shapes:

1. An epigram hung on a dash.
2. "X is the Y" metaphors.
3. An abstract noun phrase where an event should be.
4. Saying what a thing is not, without the next clause saying what it is.

Plus sentences over about 25 words. Run before handing over any document. It would have caught both of
the ones you had to correct.

### V12. Fix the two dead ends in the skill ☑

**Done 2026-09-21.** Step 3 now splits by game and sends Honeycomb work to `IDEAS.md` §§3–4. Step 4 says only Nettle has scenes and points at `list honeycomb`.

On Honeycomb work, two of the skill's seven steps fail silently:

- **Step 3** sends the reader to `CHARACTER_REFRESHER.md` to find the character. It contains zero
  mentions of Brienne, Nettle, Severine, Cassadora, Cinder, Clemence or Anastasia (grepped
  2026-09-21). For Honeycomb it should point at `lust_events/IDEAS.md` §3.
- **Step 4** says read two real scenes by that character. For Honeycomb only Nettle has any. Say so,
  and say what to read instead.

---

### V14. The image side has its own collector now ☑ — added and done 2026-09-21

V5 read the fourteen Nettle prompts by hand. This is the same job for every image in the repo.

Noodle's problem, in his words:

> Really it comes down to being able to come up with ideas that are at least close to the webui
> engine's vocabulary, but also also keeping some kind of log of what's often/easily forgotten.

> Unfortunately aside from all the nettle ones I don't have examples where I generated an image,
> realized it was missing something, added the tags, and the original starting point survived. I
> always end up either backing up (usually because I forget to save the new prompt) or updating the
> txt as I go.

**The starting point did survive, 2,003 times.** `webui2-generate.js` writes the combo line it was
given into every sidecar as `Raw input:`, and Forge writes the final prompt beside it. So the before
and the after have been in every image folder all along, and nothing needs to be logged from here on.

`scripts/webui/tools/webui2-handedits.js` recompiles each `Raw input` with the v2 engine and diffs it
against what reached the model. It works on desktop, it is a plain command, and it needs no change to
how he works, which is what he asked for.

**The trap, and it nearly made the tool useless.** The first version claimed a tag could only be added
by hand. That is wrong: a shortcut whose definition has changed since an image was made shows up as a
hand edit on every image of that batch. `PoseBreakdownB` alone accounted for the top four rows. The
tool now sorts by how many separate DAYS a tag turns up on, prints the span, and says all of this at
the top of the file.

**Validated** by running it over the last two days, where it reproduces the fourteen hand-read Nettle
findings exactly and catches five more.

**Then corrected, because the first write-up over-claimed.** It called the 2,003 deltas "corrections
that worked". They are not. Noodle: he is 90% sure of Nettle's fourteen because he did each by hand
with his full attention; the enemy workbench batches were bulk and "good enough"; the rest he has no
idea about and has no time to check. Prompts are also bulk-built, and an input and an output can
legitimately agree.

**So the corpus proposes and he confirms.** That is the whole loop, and it has run once: of the
candidate tags the sweep surfaced he confirmed six outright — `blush`, `solo`, `pussy juice`,
`pussy juice puddle`, `impact lines`, `naughty face` — as *"ones I mean to use more but regularly
forget to"*. Those six are now rules. `male only` and `penis outline` were on the same list, he did
not mention them, and they stay candidates.

---

## Where this stands, 2026-09-21

**Done:** V1, V2, V3, V5, V6, V7, V8, V9, V10, V11, V12, V14. Twelve of the fourteen. **Everything
that did not need Noodle is finished.**

**Open, and both are his:** V4 (the shape of a voice-fix button on the desk) and V13 (three to five
lines in each Honeycomb character's voice). Both are in `FOR-NOODLE.md`.

**The one loose end that is ours:** `prose-check.py` reports 14 things to look at in the older skill
files — `honeycomb.md`, `voice.md`, `checks.md`, `generating.md` and the two `SKILL.md`s. They were
written before the check existed. Not urgent, and worth doing carefully rather than quickly, because
some of those sentences are technically precise and only look like the shapes.

**Waiting on him:** V4 (the shape of the desk button) and V13 (lines in each character's voice). Both
are in `FOR-NOODLE.md` with everything else that is his.

**What would help most next:** V13, and nobody else can do it. Of what is left on Claude's side,
V11 is the one with the worst track record behind it — the document voice is the failure he has
raised twice and it is the only one with no check on it.
