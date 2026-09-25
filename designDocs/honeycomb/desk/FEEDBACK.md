# The desk: your requests and the plan

Written 2026-09-23 from your message in `NEW-FEEDBACK.md`, which is left exactly as you wrote it.
Below, each request is quoted in your words, and under it is what I plan to build. Every item has a
short number, such as 3b, so you can say "do 3b next" or "skip 7e".

The Status line under each item says where it stands. Phases 1 to 4 were built on 2026-09-23 and
tested on a copy of the desk. They reach your phone when the desk is restarted; until then the phone
shows the old page.

**Noodle, 2026-09-25**, in the housekeeping message that set the second demo's gate (`../BASICS.md`, the
second demo), listing this among the early-stage blockers:

> - Finish Desk app
> I had to stop at phase 4 due to release approaching and needing to preserve usage limits, I'll likely need to start a new session to tackle it.

So phases 5 to 11 below are a session of their own, and nothing in the game waits on them.

---

## Answered already

Two questions were answered on 2026-09-23 and are in `_archive/FEEDBACK-DONE.md`: where the desk's
start file is, and how a button's words connect to what it does.

---

## The order I recommend

Small means part of a session. Medium means about half a session. Large means a session of its own.

| Phase | What you get | Size |
|---|---|---|
| 1 | Your phone's back button works in the desk, and the strip of girls stops jumping back to the start when you tap one | small |
| 2 | Search that looks through every word of every event, a button that clears the search, folding, filters for Lust Events and map events, and folders and tags for drafts | small to medium |
| 3 | The Notes tab split into sections, so things waiting on you are kept apart from my reports and from finished items | small to medium |
| 4 | Each button shows what it does, and the campfire shows its real menu | small |
| 5 | The editor's row of shortcuts replaced by a Tools button holding the harder things, with two refresher pages | medium |
| 6 | The preview lets you pick the leader, second and third, says whether the event would appear for that party, and shows every girl's version of a picture on one screen | medium |
| 7 | The Images tab: one card per picture, filters, where each picture is used, a list of missing art, and a sandbox for generating | medium to large |
| 8 | Help with writing prompts: a character search, tag suggestions as you type, a page showing every rule that touches a tag, and flags on rules | large |
| 9 | Cast prompt bundles: one shared prompt with an extra line for each girl, generated together | medium |
| 10 | Whole versions of an event for each girl who might lead it, which needs a change to the game's engine | large |
| 11 | The audit you asked for, at the end | small |

Phases 1 to 4 come first because you use those screens every day, and each one is small. Phases 5
and 6 build on the event screen. Phases 7 to 9 are the image side, and each needs the one before it:
bundles land in the sandbox, and bundles use the character search. Phase 10 is last because it changes
the game's engine, and it will be easier to decide exactly what it needs once phase 6 exists and you
have used it.

I will also check the desk after every phase (its self-test, and the page at phone size in the
browser pane), and not only at the end.

---

## Decisions

These are the calls that change what gets built. Noodle answered five of them on 2026-09-23, each
time choosing the suggestion. The sandbox question was not asked, so the suggestion stands until he
says otherwise.

| Question | My suggestion | Noodle's answer |
|---|---|---|
| Which phases come first? | Phases 1 to 4 first, then the rest in the order above | Phases 1 to 4 first |
| How different will one girl's version of an event usually be from another girl's? | Build the party preview (phase 6) first, write a scene or two with it, then decide whether phase 10 is needed | Not sure yet: build phase 6 first, then decide |
| What should my progress reports on the desk look like? | Short reports in a section of their own, with anything you need to do posted as a separate reminder | Reports plus separate reminders |
| How far should the sandbox go at first? | Text to image only, through your engine. The webui page stays the place for img2img, inpainting and ControlNet | not asked yet |
| May I delete the three unused campfire buttons from the game file? | Yes, since nothing reads them and one of them says the wrong number | Yes |
| Should the voice-fix mark (voice_matching/FOR-NOODLE.md, item 3) be built as part of this? | Yes, as one button in the line sheet (item 5d) | Yes |

---

## Phase 1: the back button, and two fixes

### 1a. The phone's back button

> I completely understand if this is impossible, but could my back button function be hijacked to do
> the same thing as the back button on top of the screen? It's much more intuitive for me to use the
> bottom android back button than one all the way at the top.

It is possible. The desk will record each step you take, such as opening an event, opening a sheet or
switching to Edit, as a step in the phone's history. Pressing the Android back button then goes back
one step. An open sheet closes first. After that, the event closes and the list shows again. From any
tab other than Events, back returns to the Events tab. From the Events tab, back closes the desk, as
it does now. If an event has typing that is not saved, the desk still asks before leaving it.

Status: built 2026-09-23. Read & mark, Edit and Preview all count as one step, so back from Edit goes
straight to the list, the same as the Back button at the top.

### 1b. The strip of girls jumps back to the start

> I absolutely love the preview that lets me see every girl's version of an event's picture (though
> clicking on one scrolls me left back to the start of the list)

Tapping a girl redraws the whole screen, and the redraw puts the strip back at its left end. The fix
keeps the strip scrolled to where you left it.

Status: built 2026-09-23. The rows of filter buttons keep their place the same way.

### 1c. Starting the desk twice

The second window will say "The desk is already running", print the address for the phone, and close,
instead of showing a Node error.

Status: built 2026-09-23. The second window shows the message for eight seconds and then closes.

---

## Phase 2: finding things in the lists

### 2a. Search every word

> The event search is a bit too limited, I can't search the word 'frustrated' and find the nettle
> scene where she says it, it seems to be limited to event names only, which I could easily forget.

You're right: the search only looks at an event's name, its code name, its girl and its weakness. It
will look through every word of every event instead: the lines, the narration, the body text, the
button labels, the button sentences, the result text and the picture paths. Under each event it
finds, the desk shows the line that matched, with your word highlighted. Tapping that line opens the
event scrolled to it.

The Ideas & drafts tab gets the same search, over each draft's whole text.

Status: built 2026-09-23. The word in Nettle: Synthesis is "frustration", not "frustrated", so the search also tries each word with a common ending taken off. "frustrated" now finds it.

### 2b. One button to clear the search and the filters

> When searching events, please add a button to clear the search and filters at the bottom, so I
> don't need to manually erase all the text bar and tap a bunch of buttons.

A "Clear search and filters" button at the bottom of the list, shown whenever a search or a filter is
on. It empties the search box and sets every filter back to All.

Status: built 2026-09-23.

### 2c. Folding the groups, and filters for Lust Events

> I'd like to fold lust events, as well as filter by weakness and character.

Tapping the LUST EVENTS or MAP EVENTS heading folds that group away, and the phone remembers which
groups you folded. Lust Events get two rows of filter buttons, one row for the girls and one for the
weaknesses (venom, charm, and the others as scenes for them are written). The buttons are made from
the events that exist, so a girl with no Lust Event yet has no button.

Status: built 2026-09-23.

### 2d. Filters for map events

> I could see the map events section quickly growing too large to be useful as well, but don't have a
> decent idea of how to filter down that one.

The desk can read the game's own rules for each map event, so I suggest three kinds of filter.

- **Appears for.** Everyone; only when a given girl is in the party (The Weeping Bloom needs Nettle);
  only when someone is Broken; or never drawn on the map (the campfire, which the rest node opens).
- **Gives.** Gold, a relic, a card, a curse, healing, Lust removed, a fight, a weakness rank. The desk
  reads this from the buttons' effects, so it is always right. It answers questions like "which events
  hand out relics?"
- **Missing picture** and **Has open notes.**

Each map event's card also gets one line saying who it appears for, such as "Only with Nettle in the
party".

Status: built 2026-09-23. Missing picture and Has open notes went into the top row of filters, because they are useful for Lust Events too.

### 2e. Folders and tags for drafts

> I definitely need to be able to add folders and tags to help me sort and navigate the ideas & drafts
> section.

Each draft gets a folder and any number of tags. A folder is a name like "Brienne" or "Map ideas". Tags
are any words you like, such as "venom", "needs art" or "cast scene". The Ideas & drafts tab shows one
foldable group per folder, a row of tag buttons to filter by, and the search from 2a. In a draft's
Edit screen, the folder is a pick list with "New folder" at the end of it, and tags are typed with
suggestions from the tags you have used before.

Both are stored as header lines in the draft's text file (`folder:` and `tags:`), so I can file drafts
into folders too.

Status: built 2026-09-23.

---

## Phase 3: the Notes tab

> I'd like some improvements to the notes & open issues tab. At the moment currently open issues, random
> notes, player feedback I record, things that you haven't responded to, things you have responded to,
> posts you made yourself to update me on progress, all of these pile into the same location. Not only
> that, but there's no space between open and done, which means that all those notes and things I need
> to deal with pile up because I'm not sure if I should mark it as done yet. Perfect example in the Sep
> 21 5:31 pm note you left for me. Large amount of text, seems like a general status update I'd get in
> the claude window, large wall of text, I see at the tail end there's a reminder for me to do character
> lines and desk button question, and a helpful reminder of where they're located. That post is a white
> elephant, I want the reminder, and now the whole thing needs to be scrolled past when I try to get an
> idea of what's still open/relevant.

### 3a. Five sections instead of one pile

The Notes tab gets five sections, picked with buttons at the top.

| Section | What goes in it |
|---|---|
| Your turn | Anything waiting on you: a question I asked you, a result I reported for you to look at, a reminder I left you, and your own open issues |
| Claude's turn | Anything you asked me that I have not answered since you last wrote |
| Notes | Your own jottings and the player feedback you record, which are not waiting on anybody |
| From Claude | My progress reports. Each one shows only its title until you tap it |
| Done | Everything that has been closed, newest first |

A note moves between sections by itself. When I reply to something you asked, it moves from Claude's
turn to Your turn. When you reply to it, it moves back. When you tap Done, it moves to Done. That
answers "should I mark this done yet?": if it is in Your turn and you have nothing more to say or do
about it, mark it done.

The number on the Notes tab at the bottom of the screen counts only Your turn.

Status: built 2026-09-23.

### 3b. Player feedback

A "Player feedback" button next to Save note and Open issue, with an optional box for who said it.
Player feedback goes into Notes and has a filter button of its own there. If you later tap Ask Claude
on one, it moves to Claude's turn.

Status: built 2026-09-23.

### 3c. Long notes fold up

A note longer than three lines shows its first three lines and a "more" link. Every note shows a title:
for yours, that is its first line; for mine, it is a short title I write.

Status: built 2026-09-23.

### 3d. How I post from now on

A progress report goes into From Claude with a short title, and it never counts as open. Anything you
need to do goes into Your turn as its own short reminder, saying where the details are. Under this
rule, the Sep 21 5:31 pm post would have been one report and two reminders: "Write three to five lines
in each girl's voice (voice_matching/FOR-NOODLE.md, item 1)" and "Decide what the voice-fix button
should look like (FOR-NOODLE.md, item 3)".

The rule goes into the desk's CATCH-UP.md, so every later session follows it. My inbox command gets two
new commands to match: one posts a report, and one posts a reminder.

Status: built 2026-09-23. The commands are `desk-cli.js report` and `desk-cli.js remind`, and the rule is in the desk's CATCH-UP.md.

### 3e. Sorting the 21 notes that are already there

I will move my five reports into From Claude and pull the reminders out of them. Your eight IN- issues
will go to Your turn: I answered six of them, and IN-7 and IN-8 are waiting for you to point at an
example. Nothing gets deleted.

Status: built and tested on a copy of the notes 2026-09-23. It runs on the real notes when the desk switches over. Only three reminders came out, because the latest report said everything else was done: the character lines, and the two questions on Brienne venom 3 and Cassadora venom 2.

---

## Phase 4: what each button does

### 4a. The game's own words under every button

In Read & mark and in Preview, each button gets a second line starting "What it does:", followed by the
game's own description of its effects. If you typed a sentence for that button, both show, so you can
see when yours has gone out of date. If your sentence has a number in it that the effects do not
contain, the desk points at that number. For the old campfire Sleep button, it would point at the 30%.

Status: built 2026-09-23.

### 4b. Deleting a sentence lets the game write one

Found while planning. At the moment, deleting the sentence after `|` writes an empty sentence into the
game file, and the game then shows nothing under that button, instead of writing its own. After this
fix, an empty sentence means the game writes the sentence itself.

Status: built 2026-09-23, in the game's own code (honeycomb-overlays-map.js), with checks in the suite's block [144].

### 4c. The campfire shows its real menu

The campfire event will show the menu the game really builds: the three base options with the game's
own sentences, and the options a skill tree can unlock, each marked with the node that unlocks it. The
three unused buttons get deleted from the campfire event in the game file, if you agree (see
Decisions).

Status: built 2026-09-23. The three unused buttons are deleted from honeycomb-content-map.js, and the tests that used to read them now read the rest options table.

### 4d. "Put this in the game" on drafts

A new event needs its effects written, and effects are code, so the desk will not write new events
itself. Instead, each draft gets a "Put this in the game" button. It moves the draft to the stage
"ready for the game" and puts a request in Claude's turn with the draft attached.

Status: built 2026-09-23.

---

## Phase 5: Tools instead of the shortcut row

> I see a button above the event edit window in the row of common shortcuts labeled "knight", is this
> literally just a brienne-specific shortcut? I'm not sure that's an ideal use of space. I'm pretty
> familiar with all the commands used often between events, I don't really need the whole row,
> especially since one is just a single character. I'd like you to come up with a replacement if
> possible, as for suggestions, there are likely to be more complex things you could put in a dropdown
> I'd actually have trouble remembering across events, like inserting leader/second/third blocks, or
> transforming an im line to a leader/second/third specific one, or how your system of requirements
> works, or a window with a refresher on design space for possible event rewards (I think we forgot to
> actually ever write that though), or even just have it open a window for notes (though that one could
> get cluttered fast). I'll leave the choice up to you, I'll try to adjust my workflow towards optimal,
> rather than bring optimal to me.

### 5a. Two buttons: Tools and Notes

Yes, that button types `knight ` at the start of a line, which is Brienne's speaker word. The row has
one of those for each of the seven girls, and the other six are off the right edge of the screen. The
whole row goes.

In its place are two buttons. **Tools** opens a sheet with three parts.

1. **Insert where the cursor is.**
   - A leader, second or third block. You tick which girls get a line (all seven are ticked to start
     with), and it types the block with their speaker words ready.
   - A button together with its result line (`> ` and `>> `).
   - A new beat (a blank line and `im `).
2. **Change the line the cursor is on.**
   - Make this picture one per girl. It turns `im necro/events/pool` into `im {leader}/events/pool`,
     then lists which girls have that picture and which are missing it.
   - Make this line leader-only. It puts the line into a leader block for the girl who says it.
   - Turn a leader block into a second or third block, or back again.
3. **Look things up.** The requirements page (5b) and the rewards page (5c).

**Notes** opens this event's notes in a sheet on top of the editor, so you can read them and add one
without losing your place in what you are typing. It shows only this event's notes, so it stays short.

Status: not started.

### 5b. A page on how requirements work

A page listing every `requires` line the desk understands, each with one sentence on what it does and
an example taken from a real event. It also covers the new `appears` lines from 6d. The list of
requirements comes from the game's own list of conditions, so it cannot fall out of step with the game.

Status: not started.

### 5c. A page on what events can give

You're right that it was never written. This page lists everything an event button can do in the game
today: gold, rerolls, keys, relics, cards, curses, healing, Lust removed, statuses, weakness ranks,
fights, and upgrading or removing cards. Each one lists the events that already use it and the amounts
they use. The list comes from the engine, so a new kind of effect shows up on it by itself. My design
notes go on top, and the page will be a new file, REWARDS.md in the map_events folder, as well as
being in the desk.

Status: not started.

### 5d. The voice-fix mark, if you want it

From voice_matching/FOR-NOODLE.md item 3, which is still waiting on you: one button on a line you have
just changed, which marks the change as a voice fix, with an optional one-line reason. It would sit in
the sheet that opens when you tap a line. It is small. Noodle said yes on 2026-09-23.

Status: not started.

---

## Phase 6: the preview, expanded

> I absolutely love the preview that lets me see every girl's version of an event's picture [...] I
> would like this to be expanded and robust, if possible. Making character-specific variants of entire
> events would be ideal, as well as character-exclusive ones like the Nettle event added just a bit ago.

### 6a. Pick the whole party

The strip of girls becomes three pickers: who leads, who is second and who is third, plus a switch for
"someone is Broken". The preview then plays exactly what that party would see: the leader's picture,
the leader's line from a leader block, the second girl's line from a second block, and so on. Today the
preview lets you pick only the leader, and it shows every second-place and third-place line with a
label on it.

Status: not started.

### 6b. Would this party see this event?

Above the preview, one line says either "This party would see this event" or gives the reason it would
not, such as "This party would not see this event, because Nettle is not in it." The desk asks the
game's own rules, so the answer matches the game.

Status: not started.

### 6c. Every girl's version of a picture on one screen

A grid showing all seven girls' versions of a `{leader}` picture at a readable size, with "missing" on
any that does not exist yet. Tapping one opens its picture sheet, so a missing one can be requested or
uploaded right there.

Status: not started.

### 6d. Girl-only events on the desk

The Weeping Bloom only appears with Nettle in the party, and the desk does not show that today. Every
map event will show when it appears as header lines at the top of its text, and the simple ones can be
changed from the phone.

| Header line | What it means in the game |
|---|---|
| `appears with nettle` | The event is only drawn when Nettle is in the party |
| `appears when nettle leads` | The event is only drawn when Nettle is at the front of the party |
| `appears when someone is broken` | The event is only drawn when a party member is Broken |
| `weight 30` | How likely the event is to be picked, compared with the other events' weights |

A rule that is more complicated, like The Weeping Bloom's second one (Nettle's Venom weakness must still
be able to rise), is shown in plain words and cannot be changed from the phone.

Status: not started.

---

## Phase 7: the Images tab and the sandbox

> The images/image requests tab definitely could use more robustness. Firstly, as the feed includes
> duplicates and absolutely everything I try to generate, I realized it would be full to the point of
> uselessness very quickly. What would be more useful is if this space was better sorted, and also
> served as an image sandbox.

### 7a. One card per picture

Today every request makes a new card, so asking for the same picture twice gives two cards (Brienne's
pool picture has two). Each picture path will get one card, and its requests, uploads and generations
stack inside it, newest first.

This also fixes the well picture, which was generated and written but whose card still says "for
Claude". Saving a request again used to undo its finished status, and it will not any more.

Status: not started.

### 7b. Filter buttons

> For the sorting, it should probably take me to the place the image is located, just having a feed of
> images by itself isn't helpful. And it could use filter buttons, because grouping everything I've
> assigned to claude but haven't been done, images I haven't checked yet, images I made myself, etc all
> into one scrollable list is too much.

The filters: For Claude (waiting on me), New to you (made or changed since you last looked), Yours (you
uploaded or generated it), Claude's (I made it), Failed, Missing art (7d), Sandbox (7e), and All.

Status: not started.

### 7c. Where each picture is used

Each card says where its picture is used, such as "Nettle Specimen, beat 1" or "draft smallDynamicPool,
beat 2". Tapping that opens the event or draft at that beat. A picture used in several places lists all
of them.

Status: not started.

### 7d. Missing art

A list of every picture that an event or a draft names but that does not exist yet, including each
girl's version of a `{leader}` picture. Each one has Ask Claude, Generate and Upload on it. It works as
a to-do list for art that keeps itself up to date.

Status: not started.

### 7e. The sandbox

> In the sandbox, I could it as a general space to generate. It could honestly replace my browser's
> webui connection depending on how far you take it. I don't know if I'd be able to download the image,
> go to a scene I want to use it in, and insert that image without needing to copy the tags as well
> though, since idk how well Desk can read png data (and png data has a habit of breaking on any edits,
> which is why I use sidecars generally.)

A place to generate pictures without an event. It has a box for positive tags, a box for negative
tags, the style, the size, how many pictures to make, and a seed. The results appear as a grid.
Tapping a result gives four choices.

- **Use in a scene.** Pick an event or a draft and a beat, or type a picture path. The picture and its
  sidecar are copied there together, and the picture that was there before is backed up first. The tags
  travel with the picture in its sidecar, so you never copy tags by hand.
- **Use these tags again.** Puts that picture's prompt back into the boxes.
- **Keep.** Stars it, so it stays at the top of the sandbox.
- **Delete.** Moves it to a trash folder on the computer. Nothing is ever erased.

Sandbox pictures are kept in `desk/data/sandbox/`, outside the game's folders, until you use one.

On PNG data: the desk never reads the settings out of the PNG itself. Every picture the desk generates
gets a `.txt` sidecar beside it, the same as your generation tool already writes, and the desk reads
the sidecar. Editing the picture in a paint program therefore cannot lose its tags.

On replacing the webui page: the sandbox will make text-to-image pictures through your own engine, with
your styles, sizes, seeds and shortcuts. It will not do img2img, inpainting or ControlNet at first (see
Decisions).

Status: not started.

---

## Phase 8: help with writing prompts

### 8a. Character search

> When making the images, I was thinking the Character section was redundant, since I should be able to
> just write the character in the positive tags, but now I realize it could be a fantastic search
> feature using aliasDB, charactersDB, and charactersDB2 (original db should have priority over the 2nd
> one which has a bulk import of characters).

The Character box becomes a search. As you type, it lists matches from charactersDB first, then names
from aliasDB, then the 22,273 imported characters in charactersDB2. Each result shows the name to type,
its franchise, and which list it came from. Tapping one puts the name into the positive tags. For a
character from charactersDB, her outfits and pose methods show as buttons too (`default`, `PoseA`,
`TornDamage` and so on), and one tap adds one.

Status: not started.

### 8b. Tag suggestions as you type

> Similarly, I don't exactly how you'd work this, but my system's list of tags and shortcuts are far,
> far too vast for me to remember. As such I'd like a tag autocomplete feature for sure.

While you type in any box for tags, a row of suggestions appears above the keyboard. They come from
every tag your dictionaries know, every shortcut and every character name. The tags you have used most
in your finished pictures come first; the desk counts them from the sidecars of your 3,258 finished
pictures. Shortcuts are marked, so you can tell `Juice` (several tags) from a single tag.

Status: not started.

### 8c. Every rule that touches a tag

> But it'd also be immensely helpful to be able to see a list of replacement, default, functional rules
> in general that relate to a tag. Things such as what this tag is replaced by, what defaults this rule
> is included in, etc.

Holding a finger on a tag opens a page about it, in two halves.

1. **What typing it does.** What it turns into, what it adds, what it removes from the rest of the
   prompt, and what it adds to the negative. The desk works this out by compiling a prompt with the tag
   and without it and comparing the two, which is how your `webui2-inspect.js` tool already works. So
   it always shows what the engine does today.
2. **Every rule that mentions it.** Each line in your dictionaries where the tag appears, sorted by
   what that line does with it: replaced by, replaces, part of these defaults, added by, removed by,
   removes. Each line shows the file and the section it is in.

Status: not started.

### 8d. Flag a rule to look at later

> And most valuable of all would be the means to flag a rule for me to investigate later, I can't count
> the number of times I've been roadblocked by a rule and forgotten to change it after.

Every rule line on that page has a flag button and a note box. Flagged rules collect in a "Rules to
look at" list on the Images tab, and my inbox command prints them too, so I see them as well. Your
dictionary files get edited often, so a flag remembers the text of the rule as well as where it was,
the same way line notes on events already do. Marking one done takes it off the list.

Status: not started.

### 8e. Check a prompt before generating

A Check button beside Generate. It shows each tag with what happens to it: kept, renamed, removed by
another tag, or unknown to the engine. Typos like `squating` get through because the engine does not
know them, so unknown tags show in red.

How phase 8 runs: your dictionaries need about 400 MB of memory. A helper program on the computer loads
them the first time you use one of these tools, and keeps them loaded, so the rest of the desk stays
quick. The first lookup after the desk starts will take a little while.

Status: not started.

---

## Phase 9: cast prompt bundles

> Similarly, if there could be tools to make it easier to generate bundles of prompts for these scenes
> with character-specific variants, I'd be grateful for that too. Something similar to my combo mode in
> the webui engine would be ideal, since I could then have a common prompt and give character-specific
> changes to that prompt for each character.

### 9a. A bundle

A bundle has a shared prompt and a line for each girl. The shared part holds what every version needs:
the place, the action, the framing. Each girl's line starts as her name and `default`, and you add or
take away whatever is different for her. The bundle has one picture path with `{leader}` in it, such as
`events/campfire-{leader}`, so each girl's picture lands at her own path.

Under each girl's line, the desk shows her finished prompt, so you can see what will reach Forge before
anything is generated.

Status: not started.

### 9b. A bundle is saved as a combo block

A bundle is saved in your own combo format, so you can paste it into the webui page unchanged, and I can
write or fill bundles as plain text files the same way I fill drafts. For example:

```
//campfire, one picture per girl
[campfire], sitting, campfire, night, outdoors, Semi-Wide

- knight
brienne, default
- necro
nettle, default
```

The `[campfire]` block is switched on for every line, and each `- ` line names the picture that follows
it.

Status: not started.

### 9c. Generate them all, then choose

Generate makes every girl's picture into the sandbox as one set. You look through them and tap Use on
each one you want, and it lands at that girl's path with its sidecar. A girl whose picture you don't
like can be made again on her own, with a new seed.

Status: not started.

### 9d. Start a bundle from a scene

In an event or a draft whose picture line has `{leader}` in it, the picture sheet gets a "Make a bundle
for this picture" button. The bundle starts with that path filled in and the beat's `(tags)` as the
shared part.

Status: not started.

---

## Phase 10: whole versions of an event for each girl

### 10a. Versions of an event chosen by who leads

This is the phase that needs the game's engine changed.

Two things work in the game today: a picture per girl (`im {leader}/...`) and a line per girl (leader
blocks). What the game cannot do yet is let the leader change more than a line and a picture, such as
different body text, different buttons or a different outcome for her.

The game already does this in one situation. When someone in the party is Broken, an event can show a
different title, different text and extra buttons, and that version names only the parts it changes. I
would widen that, so a version can also be chosen by who leads the party or who is in it.

On the desk, a version is a section of the event's text that starts with a line like
`version nettle leads`. Under that line, you write only what is different for her. The party picker
from 6a plays the right version, and the event list shows how many versions an event has.

Girl-only events like The Weeping Bloom already work in the game and need no engine change; 6d puts
them on the desk.

Status: not started. Noodle chose to decide on it after phase 6 exists and he has written a scene or
two with the party preview.

---

## Phase 11: the audit

### 11a. The audit of this round and the last one

> I also have a number of other things I would like to request, including a general audit of new
> features to make sure none of my requests in this or the last session broke anything at the end.

A small check after every phase, and a full one at the end.

- The desk's self-test, extended to cover everything new that a save can write.
- The Honeycomb test suite, which must still read 2778 passed and 0 failed.
- The page at phone size in the browser pane: every tab, every sheet, the back button, and the rule
  that the page never interrupts your typing. That rule is checked by holding a text box open for 15
  seconds while files change on the computer.
- Last session's cast-scene features, checked again: leader blocks, `{leader}` pictures, the strip of
  girls, your pool draft, and adding lines to a map event that had none.

Status: not started.

---

## Found along the way

- The rest option Gamble is not unlocked by any skill tree node, so no player can ever be offered it.
  The desk's campfire menu says "No skill tree unlocks it yet" beside it. Found 2026-09-23 while
  building 4c.
- Deleting a button's sentence makes the game show nothing under the button (fixed in 4b).
- Some sentences the game writes by itself have wording mistakes. The Spore Garden's third button says
  "Gain 1 Keys" in the game today. The Quiet Spring's first button would say "Gain -20 Gold" if its
  typed sentence were removed. The unused campfire Sleep button would say "Heal ALL allies for the
  target's maxHealth / 3". These may be part of the nonsense text in IN-8.
- The well picture's card says "for Claude" after it was made, and Brienne's pool picture has two cards
  (both fixed in 7a).
