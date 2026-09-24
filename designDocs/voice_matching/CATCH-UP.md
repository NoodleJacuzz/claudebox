# Voice matching — catch-up

**Read `BASICS.md` first if you have not.** The job queue is `TODO.md`, and the things that need
Noodle are `FOR-NOODLE.md`. This page is only the state of play: what has happened, what is
happening, what to pick up.

---

## State of play — opened 2026-09-21

The folder was opened in the session after the one that wired Nettle's three scenes into the game.
**Eight of the thirteen items were built the same day** — see the second entry in the session log
below. The audit that opened the folder found this:

1. Everything we have measures a finished scene against finished scenes. Nothing covers the step from
   a sketch to prose, which is the step Noodle says is the bottleneck.
2. The best material in the skill — the six rows on what his own Nettle rewrites do — came from one
   incident where somebody wrote down what changed. It has never been collected since.
3. The desk already keeps the raw material for that collection, in `desk/data/backups/`, without being
   asked.
4. `scene-metrics.py` reads a different game's corpus from the one being written.
5. Two of the skill's seven steps dead-end on Honeycomb work.

Noodle's summary of the bottleneck, which is what this folder exists for:

> A huge bottleneck is no matter how descriptive my outlines and sketches are, implementation is a
> huge drawback.

---

## Doing anything here: read these first

- `BASICS.md` and `TODO.md`, both in this folder.
- `.claude/skills/syrup-town-scenes/SKILL.md` — before writing any scene text, and before writing any
  document Noodle will read in order to decide something. That includes the files in this folder.
- `!designDocs/honeycomb/lust_events/SCENES-01.md` — the sketches, and his own Nettle V2 and V3.
- `scripts/misc/honeycomb/honeycomb-content-lust-events.js` — the live scenes. Nettle v1–v3 are his.

---

## Two rules that apply to everything in this folder

**His writing is never overwritten.** He edits these files directly while work is happening, there is
no git, and his own text is the reference everything else is measured against. Patch, never rewrite,
and re-read a file before editing it even if it was written minutes ago.

**The log records, it does not judge.** A rewrite log entry says what he changed and, where he said
so, why. It does not editorialise about the draft, and it does not turn one correction into a general
rule. The rules already exist. What was missing is a record of what he changes.

---

## Session log

### 2026-09-21 — folder opened

Audited what existed: `.claude/CLAUDE.md`, the `syrup-town-scenes` skill and its four reference files,
eight writing-related memories, and the character docs in `story_feedback/`. No duplicates and no
stale rules found. The gaps are the five listed above, and none of them is a rule that nobody wrote.

Noodle's decisions this session:

- The rewrite log is the priority, and the desk is where it should live.
- The worked sketch-to-prose pair already exists as material: SCENES-01 against the live game.
  **His caveat, and it matters:** only V3-Loss and V3-Win have idea stages he wrote himself, and
  SCENES-01 has been touched up in place several times. The gap between sketch and live is mostly his
  rewrites over a Claude original, but not entirely, so provenance gets labelled per beat.
- The image prompts deserve the same treatment — the 14 sidecars against `PROMPTS-NETTLE-01.txt`.
- Nettle v1–v3 in the live game are 100% his and are the Honeycomb reference set.
- A standing memory is wanted for keeping the corpus current as he adds new inline features.

Written: `BASICS.md`, `TODO.md`, this file. Nothing else built.

### 2026-09-21, same day — eight items built

Noodle went out and asked for everything that needed nothing from him. Done: V1, V3, V5, V6, V7, V8,
V9, V12.

**What was built:**

- `.claude/skills/syrup-town-scenes/reference/rewrites.md` — the rewrite log. Sixteen entries across
  five scenes, five findings that recur, and the skill now says it outranks the rest of the skill
  where they disagree.
- `.claude/skills/syrup-town-images/reference/corrections.md` — the same for prompts. Eleven of the
  fourteen shipped Nettle images had been corrected by hand in Forge; the sidecars hold both halves of
  every pair.
- `scene-metrics.py` reads the Honeycomb container and has a third band.
- `SKILL.md` gained step 0 (blind practice), step 2b (read the log), and the two Honeycomb dead ends
  are fixed.
- `FOR-NOODLE.md`, this folder.

**The finding that mattered most.** Measuring his three live scenes showed narration is **34% of his
Honeycomb lines at about 15 words each**, against 19% and one word in the Syrup Town terse band. The
drafts had cut narration to almost nothing, correctly following a rule that only holds in the other
game. Spoken line length, by contrast, is the same in both — 11.8 against 11.7. `voice.md` said
"cut it hard, expect 5–8 words rather than 1", and that was wrong in both directions. Corrected.

**Where the evidence came from, and this is the useful part:** all three sources named in V3 produced
entries. The desk note `n-mub2q38h578e` gave the cleanest pair in the file because it carried the old
line as a snapshot beside his reason for changing it. A correction with its reason attached is the shape V4 is trying to
make routine.

### 2026-09-21, later — V2, and the desk seeded

**V2 is built:** `!designDocs/honeycomb/tools/desk/rewrites.js`, also `desk-cli.js rewrites`. On its
first run it reproduced every hand-collected entry and disproved one of them. Collecting by hand is
over.

**Nine drafts were put on the desk** for Noodle to work on, at his request:

- **Brienne venom 1, 2 and 3**, at stage `sketch`. His session-48 dialogue is unchanged — he approved
  most of it — and narration was added, because these sketches had one narration line, none and two,
  against the 34% his own scenes turned out to run at. Each draft says at the top which lines are new
  and what to check. Measured: narration share 40 / 42 / 46%, narration line length 14.3 / 12.6 / 7.0
  words against his 12.8.
- **Cassadora's six**, at stage `idea` — three venom, three charm — written out from
  `IDEAS-SCENES-01.md` and `IDEAS.md` §3 so each one reads on a phone without opening two documents.
  Each carries her two-voice rule at the bottom.

**Two measurement flags left standing on the Brienne sketches, both in his own dialogue, not the added
narration.** Venom 2 runs stretched vowels at 4.65 per hundred words against his 2.09, and venom 3 has
no stammer at all where he averages 1.76. The second is the interesting one: her rank 3 is unwavering
certainty, and a stammer would undercut it. That is a question for him rather than a fix.

### 2026-09-21, later still — the image side gets the same treatment

**V2's foundation was laid properly** so later sessions actually use it: it is step 8 of the scenes
skill, a row in `honeycomb/tools/README.md`, a `desk-cli.js` subcommand, a section in
`honeycomb/desk/CATCH-UP.md`, and a rule in the `scene-writing-skill` memory.

**Then V14**, which is V5 done by machine over the whole repo rather than by hand over fourteen
images. `scripts/webui/tools/webui2-handedits.js`. **2,003 sidecars carry the raw input that was
typed as well as the prompt that reached the model**, so the corpus Noodle thought he did not have
has existed the whole time.

**The thing worth remembering from building it:** the first version was wrong in a way that looked
right. It reported the most-added tags by count, and the top four rows were a shortcut whose
definition had changed, not anything anybody typed. Recompiling old data with new dictionaries
measures the dictionaries. The fix was to sort by how many separate days a tag appears on. Checking
one row against `webui2-inspect.js explain` is what caught it, and that check should happen before
any number from that tool is believed.

### 2026-09-21, evening — V10 and V11, and a correction to the image claim

**The image corpus claim was corrected first**, because it was steering future work wrongly. The first
write-up called the 2,003 deltas "corrections that worked". Noodle: only Nettle's fourteen had his
full attention, the enemy workbench was bulk and "good enough", and the rest he has no idea about.
`corrections.md`, the tool header, the TODO item and the memory now all say the same thing: **a delta
is a candidate, the tool proposes, and he confirms.** That loop has run once and produced six tags he
says he means to use and forgets: `blush`, `solo`, `pussy juice`, `pussy juice puddle`,
`impact lines`, `naughty face`.

**V11, the document check.** `prose-check.py`, wired into `.claude/CLAUDE.md` rule 1. It found six
real faults in this project's own four documents, all written carefully the same day. Those are
fixed and all four pass.

**V10, the three qualitative misses.** In `scene-metrics.py check`, each flag carrying its corpus
evidence. The callback check found its own proof: run against the real sleeping-nun scene it reports
`dumpster`, which is the exact running bit `voice.md` named as the callback the session-47
reconstruction missed. Nobody told it that.

**What both of those have in common, and it is the lesson of the day:** a check is worth building when
it can show its own evidence. The softening list would have been an opinion; printing how often Noodle
uses each word turns it into a fact, and lets the list correct itself as the corpus grows.

**Everything that did not need Noodle is now finished.** What is left is V4 and V13, both his, and a
tidy-up of 14 findings in the older skill files.
