# The phone desk — CATCH-UP

**Built 2026-09-21.** A small web page Noodle opens on his phone, over the home network, to read and
edit Honeycomb's events, leave notes, flag things, sketch new scenes and ask for images. Everything it
stores is a plain file on his computer, so Claude reads and writes the same data with ordinary file
tools. Noodle described it as "a database shared between us", and that is how to treat it.

**Second round, planned 2026-09-23: read `FEEDBACK.md` in this folder before changing the desk.** It
quotes each of Noodle's requests, gives the plan for each as a numbered item (1a to 11), records his
decisions, and says which items are built.

**If Noodle mentions his phone, his notes, the desk, or "I left you something", run this first:**

```bash
node "!designDocs/honeycomb/tools/desk/desk-cli.js" inbox
```

It prints, in this order: Claude's turn (things he asked that Claude has not answered since he last
wrote), a one-line list of what waits on him, his notes and player feedback, a count of Claude's
reports, edits the desk would not write, image requests, flagged events and lines, and the drafts with
their folders and tags. It is short on purpose.

## Second round, built 2026-09-23 (phases 1 to 4 of FEEDBACK.md)

What changed, in one place. Each item's details and Noodle's words are in `FEEDBACK.md`.

- **The phone's back button** works like the header's Back button (`syncHistory` in `app.html`: every
  open level, meaning a tab other than Events, an open event or draft, and an open sheet, owns one
  history entry).
- **Search reads every word** of every event and draft, with a common ending taken off each word, so
  "frustrated" finds "frustration". A tap on a result opens the event at the matching line.
- **Filters**: Lust Events by girl and weakness; map events by who they appear for and what they give;
  missing pictures; open notes. Groups fold, and the phone remembers it. One button clears it all.
- **Drafts have a folder and tags** (`folder:` and `tags:` header lines).
- **Notes are sorted into five sections** by `notes.js`: Your turn, Claude's turn, Notes, From Claude,
  Done. `ask: true` means "Ask Claude"; the older kind `request` still counts as asking.
- **Buttons show what they do** in the game's own words, from `facts.js`, which reads the engine: when
  a map event appears, what it gives, each button's effects, and the campfire's real menu.
- **In the game**: an empty button sentence now hands back to the generated one
  (`honeycomb.eventOverlay.previewText`), and the campfire event has no buttons of its own (suite block
  [144]).

**How Claude posts to the desk now.** A progress report is `desk-cli.js report "<title>" "<text>"`: it
goes to From Claude, folded to its title, and never counts as open. Anything Noodle has to do is its own
`desk-cli.js remind "<text>" [event or draft]`, saying where the details are. Never end a report with a
task for him; he called one such post a white elephant, because he had to scroll past the whole report
to find the two reminders at the end of it.

**Testing a new page without touching his desk.** His desk runs from his own window and must not be
stopped without asking. The `honeycomb-desk-test` entry in `.claude/launch.json` runs a second desk on
port 8788 with `--data` pointing at a copy of `data/` and `--app` at a copy of the page, both in the
session's scratchpad. The page file is read fresh on every request, so the real `app.html` is only
replaced at the moment the desk is restarted; `server.js` is read once at start and can be edited any
time, as long as it still works with the page that is live.

---

## What Noodle asked for

His words, 2026-09-21, kept whole:

> I would like something that serves as a way to edit events from my phone over the lan network. This must:
> 1. Let me edit honeycomb events on my phone, switching between an edit mode and a live preview mode on my phone.
> 2. The editing format is the same as the one I typically use when writing scenes, with character dialogue, plain text, and requirements. In a perfect world, these edits would be saved directly onto my computer.
> 3. Let me bookmark, flag, or sign off on events or specific lines in my phone to keep track what I'm working on or need to come back to later.
> 4. Have a "Notes and Comments" capability on events, specific lines, or just nothing at all because I wanted to note down something as an open issue not related to an event. The most important factor.
> 5. Allow me to "create" events, where I can keep scene ideas, sketches, drafts, and an image, so that I can have you pull the scene out and implement it into the game, or fill out an idea I had.
> 6. Be able to have you edit it yourself, creating events, turning my sketches into drafts in real time, adding in image tags I must have missed.
> 7. Highlight new or unread scenes, as well as easily mark them as read/unread manually.
> 8. Have an "Edit Image" button in events. This would let me upload one myself (which would be converted to png, resized, and placed into the v13 spire png folder  Or I could send a request through webui to generate one. There should be a space for adding positive and negative tags here, as well as a comments box.

> It does not need to be AI integrated. Just something that can give me a doorway into the game from my phone, and give me more ways to present you with my ideas/feedback.

> I'd like to be able to write tags and notes for images even without uploading or requesting one from forge, for when I want you to generate something for me.

He also confirmed three defaults: a save writes straight into the game file with a backup; there is no
login, the home network is the boundary; "generate" runs at once if Forge is reachable.

All eight are built. The pieces still missing are listed at the bottom.

---

## The backups are a record of his rewrites, and there is a tool for it

`events.js` copies a game file into `data/backups/` before every write, so every edit Noodle makes
from the phone leaves a before and an after on disk. That was built as a safety net and it turned out
to be the most useful writing data in the project.

```bash
node "!designDocs/honeycomb/tools/desk/rewrites.js"      # or: desk-cli.js rewrites
```

It prints every changed line paired with what replaced it. **Run it at the end of any session**, and
put the pairs that are about voice into `.claude/skills/syrup-town-scenes/reference/rewrites.md`. The
project behind it is `!designDocs/voice_matching/`.

Two things it assumes, both written at the top of the tool. A backup means a save through this page,
and Claude edits game files directly rather than through the desk, so in practice every backup is
Noodle's. And a line he deleted outright is as informative as one he rewrote, so deletions are kept.


## Where everything is

| What | Where |
|---|---|
| The server, the page, Claude's command line | `../tools/desk/` — `server.js`, `app.html`, `desk-cli.js` |
| Reading and writing the game's event files | `../tools/desk/events.js` and `literal.js` |
| Whose turn each note is | `../tools/desk/notes.js`, shared by the server and `desk-cli.js` |
| What the game says about an event (appears, gives, button effects, the campfire menu) | `../tools/desk/facts.js` |
| The self-test (changes nothing) | `node "!designDocs/honeycomb/tools/desk/selftest.js"` |
| How Noodle starts it | double-click `../tools/desk/start-desk.bat`. It prints the address for the phone. Port 8787. A second start says the desk is already running and closes itself. |
| Notes, replies, flags, read marks, image requests | `data/desk.json` |
| His drafts, one text file each | `data/drafts/<id>.txt` |
| Edits the desk would not write | `data/pending/<event>.txt` |
| A copy of a game file before every write | `data/backups/` |

The server reads these files fresh on every request. The phone asks every four seconds whether
anything changed. So a file edited by hand shows up on his phone within a few seconds, with no restart.

---

## How Claude works with it

**Replying and closing notes.** Use the command line, which signs everything as `claude`:

```bash
node "!designDocs/honeycomb/tools/desk/desk-cli.js" reply <noteId> "plain English answer"
node "!designDocs/honeycomb/tools/desk/desk-cli.js" done <noteId> "what was done"
```

**Editing one of his drafts** (filling out an idea, turning a sketch into a draft, adding image tags):
patch `data/drafts/<id>.txt` with an ordinary file edit, then run `desk-cli.js stamp <id> [new stage]`.
The stamp is what makes his phone show "Claude edited" and mark the draft unread. Re-read the file
right before editing it, because he may be typing in it. Never rewrite his lines; add to them. Load
the `syrup-town-scenes` skill first, as for any scene text.

**Creating a draft for him:** write the sketch text to a scratch file, then
`desk-cli.js new "<title>" <stage> [character] <file> [--folder "<name>"] [--tags "a, b"]`. Stages are
`idea`, `sketch`, `draft`, `ready for the game`. `desk-cli.js folder <id> "<folder>" ["<tags>"]` files
an existing draft.

**Moving a draft into the game** is ordinary Honeycomb authoring (`../events/AUTHORING.md`). When
it is in, reply on the draft's notes and set its stage.

**A pending edit** is his full wanted text for a live event, kept because it changes the event's shape
(a new beat, a new button). Apply it to the game file by hand, then delete the pending file. The desk
also leaves an "Ask Claude" note saying why it would not write it.

**An image request** with status `for Claude` is tags and comments with nothing generated. Load the
`syrup-town-images` skill, generate, put the PNG at `v13 spire png/<imagePath>.png`, then
`desk-cli.js image <id> done "what was made"`.

---

## The text format

His sketch format, from `.claude/skills/syrup-town-scenes/reference/honeycomb.md`, plus a few header
lines. One beat per image, a blank line between beats.

```
name {name}: Specimen          header lines, only at the top
character nettle
tag venom
rank 1
requires lustEventDone entry=nettleVenomSpecimen

im necro/lust/v1-1 [what it shows] (booru, tags)
body The event's main text, for map events.
t Narration.
necro Dialogue. The first word is the sprite folder: necro, knight, vamp, seer, lancer, priest, chess.
t ...                          a divider: time passes
> Button label | preview text
>> the button's result text
leader block                   the lines under it play only for the girl leading the party
knight Must be an aquifer.     one line per girl; `second block` is the girl behind her
end block                      optional: back to lines everybody hears
im events/pool/{leader}        a picture per girl: events/pool/<the leader's art folder>
```

**Cast scenes (built 2026-09-23).** Noodle asked for the desk to "better support scene templates, where
a scene is designed around showing an image of the entire cast", and for "blocks to make writing leader
comments easier". A block ends at anything that is not a girl's line (narration, a button, a picture, a
blank line) or at `end block`. In the game a block line is an ordinary speech line with the engine's
`partyContains` condition and a `position` (0 is the leader), plus `characterIndex` so her portrait
shows. A picture path may carry `{leader}`, `{second}`, `{third}`: the game swaps in the art folder of
whoever stands there (`honeycomb.eventOverlay.artPathFor`). On the phone, Edit has a **leader block**
button (types the block with all seven names) and a **picture per girl** button. Preview shows a row of
all seven girls: tapping one previews the scene as if she leads, and a girl whose picture is missing
shows "missing". Read & mark labels each block line "only if she leads". A save can now add a line list
to a map event that has none (it goes straight after the body text). `selftest.js` part 3 covers all of
it. The first scene built this way is Noodle's `smallDynamicPool` draft, with seven bathing pictures at
`events/pool/<girl>`.

`im nettle/...` is accepted and becomes `characters/necro/...`. `im 2` means picture 2 in the same
folder. `[brackets]` and `(tags)` are kept in drafts and ignored when finding the path.

## What a save to a live event may write

`events.js` finds the exact characters of one value in the game file and replaces only those, so every
comment and every other byte stays as it was. It writes: the name, a Lust Event's tag and rank, image
paths, body text, button labels and their preview and result text, and the lines inside a beat
(changed, added, removed, reordered). A save is all or nothing. Before writing, the file is copied to
`data/backups/`. After writing, the game's engine is loaded and the event is read back; if it is not
exactly what was asked for, the old file is put back. A save from a phone that was looking at an old
version is refused, and the phone offers the new version.

It never writes anything that changes an event's shape: a new or removed beat, a new or removed
button, a new requirement, a changed character. Those become pending edits. An event that contains
code (a function) can be read but not written at all; on 2026-09-21 there were none, 13 events in all.

Verified 2026-09-21: every event converts to text and back with nothing to change, and a change
followed by its reverse leaves the game file byte-for-byte identical.

## The rule the page must never break: it does not interrupt him

The first build was unusable on his phone for one reason. Noodle, the same night:

> Selecting text, scrolling down, typing, I think it might be time-based, but I keep being forcibly
> scrolled back up, my keyboard closed, and whatever I was typing is gone.

Opening an event wrote a "seen" mark. The four-second poll saw that write as a change on the computer
and reloaded the open event, which scrolled to the top, closed the keyboard, threw away the typing and
wrote the mark again. It repeated for ever. Draft autosave set off the same reload. What holds it shut
now, all in `app.html`, and all of it has to survive any later change to the page:

- A write from the phone is never treated as a change on the computer (`api` takes the new version as
  its own, and the poll stands aside while a write is in flight). `setSeen` sends nothing when the mark
  already says so, and the server skips the same no-op.
- Nothing is redrawn while a field has the keyboard, a sheet is open, or the screen was touched in the
  last three seconds (`busy`). The new data waits in `S.stale` and is applied when the phone is idle.
- A redraw keeps the scroll position, the mode, and whatever is typed in a note box (`draw`). An event
  that really did change on the computer is brought up to date in place (`quietReload`), never reopened.
- The search field redraws the list under it and never itself.

It could not be seen in the desktop browser pane because that pane reports itself as hidden and the
poll does not run while hidden. **To test the page here, first run
`Object.defineProperty(document, "hidden", { get: () => false })` in the pane**, then hold a field
focused for 15 seconds and check it is the same element, still focused, with the same text and scroll.

## Not built, or not tested

- **"Generate with Forge" has only been dry-run.** The prompt block the desk builds compiles in
  `webui2-generate.js --mode dry`. A real generation from the phone has not been run. One thing seen in
  the dry run: a `[inn]` background shortcut typed as a tag stayed as literal text in the prompt.
- **The preview is the desk's own.** It shows the right picture, lines, dividers and buttons, beat by
  beat, including unsaved typing. It is not the game's event window. "Open the real game" is a plain
  link to the game served by the same server; it does not jump to the event.
- **An uploaded PNG is not converted to webp.** It lands in `v13 spire png/`, and the desk shows it at
  once. `../tools/png-to-webp.py` refuses to overwrite live art on purpose, so putting it in the game
  stays a deliberate step.
- **No login.** The server answers private network addresses only.
- **The phone must allow the first connection:** Windows Firewall asks once whether Node.js may accept
  connections on private networks.
