# Events & Writing — `events/`

The authored narrative: Lust Events, the random map events, the per-character map events, and the
groundwork for writing them in Noodle's voice. Noodle's pipeline **Events & Writing**; on the second
demo's gate as six lines and a blocker, each a session of its own:

> - Venom events
> - Charm events
> - Heat events
> - Char specific Penance and Torment events
> - Thoughtful overhaul of common map events
> - Per-character map events (mainly as ways to raise lust weakness faster for players who want the H)

> I forgot about writing and style matching, that's another blocker since I'd want your help laying the groundwork for the events. Which is why the events are separated, because trying to do them all in one session leads to lower quality and needing to end the session prematurely due to context limits.

**"Charm events" means Exposure events.** The 2026-09-25 sign-off made the fey Exposure and left Charm for
act 2; asked, he answered *"Whoops, thank you, good catch."*

**How this file works.** One file per pipeline: where the work is, the rules, then the queue in Noodle's
words. When an item closes, cut its `###` section and paste it at the top of `ARCHIVE.md` beside this
file, the same minute. `../FEEDBACK.md` indexes the count. Quotes are his, verbatim, and win over any
annotation. Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted.

---

## Where it stands

- **The engine is done.** Lust Events are an event QUEUE (session 48): one table of rows and requirements,
  the trigger on the character, a scene written today owed today. Italics, per-page art and the Later
  button are in. Replays go through the Event Gallery (built session 49, `../Archive/demo1/gallery/`).
- **In the game: Nettle's venom 1 to 3, and nothing else.** Session 50 cut the placeholders on his call.
  Those three scenes are 100% his and are the voice reference set. Ten venom sketches wait on him in
  `SCENES-01.md`; 36 scene ideas sit in `IDEAS-SCENES-01.md`, of which the 21 charm ones are act-2 material now.
- **The docket is B23, signed off 2026-09-25:** Venom, Exposure and Heat for every character; Torment for
  Brienne; Penance for Clemence on herself. Venom and Penance can be written now. Exposure waits on the
  enemy retag (`../enemies/ENEMIES.md` E14); Heat waits on the status (`../card_pool/CARD-POOL-02.md` §2.1);
  Brienne's Torment waits on her Bastion strand (§3.3). `RATE.md` says what a rank costs a run.
- **Map events.** Eight plus the campfire, every one with a real picture since session 58b (a stranger in
  each, never the cast; the campfire follows the leader). The cast lines the engine supports (a line with a
  `condition`, `partyContains` with a `position`) are unused, the choices never change across a run, and
  the prose was bent to stand-in pictures in one night. `MAP-EVENTS-01.md` is the session-50 proposal. The
  Weeping Bloom (session 59) is the model for a per-character event.
- **Writing and style matching** is `../../voice_matching/` (opened 2026-09-21): the centre of it is a log
  of his corrections, read off the desk's own backups, that outranks every rule written from the outside.
  Scenes go idea, sketch, finished draft; his sketch format is `im <path> [what it shows] (tags)`; he
  writes on the desk (`../desk/`).

Noodle, session 50, the sentence the map events proposal was written against:

> the random map events still feel so empty and jank. They're all still placeholders, I need actual meat to them, and images to put in.

## Files

| File | Holds |
|---|---|
| `EVENTS.md` | this file |
| `AUTHORING.md` | the writing desk: the queue row, rank meanings, the coverage grid; the tone rules' working copy (`../designBibles/story.md` §3 is the authority) |
| `SCENES-01.md` | ten venom scene drafts waiting on Noodle, with his own Nettle V2 and V3 reproduced in full |
| `IDEAS.md` | §§1 to 8 are the frame in his words: the four goals, the rules every scene follows, what each character does with lust, what each lust type is about, the scene grid. **§§9 to 19 are the session-47 menu and are stale**; trim them the first time this is opened for writing |
| `IDEAS-SCENES-01.md` | idea-stage notes for 36 scenes: 15 venom (live), 21 charm (act 2 now) |
| `RATE.md` | what one run can raise, what a rank-up costs, the roster's Lust throughput |
| `MAP-EVENTS-01.md` | the session-50 map events proposal: the party's-point-of-view rule, the Quiet Spring written out in twelve lines, six new event ideas, one per character |
| `ARCHIVE.md` | closed items from this file |
| `../Archive/demo1/lust_events/` | party and progress event ideas (off the gate), the closed engine handoff, Nettle's prompt files, the old catch-up, closed items |
| `../Archive/demo1/map_events/_archive/` | the event table as it was before the 58b and 58c text edits |
| `../Archive/demo1/gallery/` | the Event Gallery's design and its off-gate notes (G6 to G9); its two CSS defects moved to `../engine/ENGINE.md` |
| `../../voice_matching/` | the style-matching project: `../../voice_matching/BASICS.md`, `../../voice_matching/CATCH-UP.md`, `../../voice_matching/TODO.md`, `../../voice_matching/FOR-NOODLE.md` |

Live content: `scripts/misc/honeycomb/honeycomb-content-lust-events.js` and the `eventArray` in
`honeycomb-content-map.js`. His notes on any event arrive through `../tools/desk/desk-cli.js inbox`.
Character notes for the Honeycomb cast are `IDEAS.md` §3 and `../designBibles/characters.md`.

## Rules this pipeline must not break

- **His rewrites outrank the rules.** Read `../../voice_matching/` and the rewrite log before writing a line.
- **Tone** (`../designBibles/story.md` §3): no death or gore; horror only as fridge horror; never state the
  mechanism; a scene is a reward, not a toll. Charm is fey suggestibility and inhibitions dropping, never hypnosis.
- **Never invent text for a slot he left empty.** Placeholder prose is his, or the events agent's, to replace.
- **A map event addresses the party as "you"; a Lust Event has no player in it at all.** Opposite rules, neither a mistake.
- **A scene written today is owed today** (the queue); membership in the gallery is opt-in on the start row alone.
- **Every event picture lives in `events/`**, `events/<name>` for a map event, `events/<scene>/<art folder>` per girl.
- **Back up the event table before any scripted edit; never edit it with a greedy regex.**
- **Fortitude parties see no Lust Event and no per-character event.**

---

## The queue

### S64-3. Venom events ☆ — FILED 2026-09-25

> - Venom events

Can start now: the Thorn Arbor teaches Venom (15 enemy moves), Nettle's three scenes are the voice
reference, ten more venom sketches wait in `SCENES-01.md`, and `IDEAS-SCENES-01.md` holds fifteen venom
ideas. One character per session, idea to sketch to draft, images per beat as his three plans do.

---

### S64-4. Exposure events ☆ — FILED 2026-09-25 (his line said Charm)

> - Charm events

> Whoops, thank you, good catch.

Exposure is the Pollen Road's tag and represents exhibitionism (B23). Waits on `../enemies/ENEMIES.md`
E14, the retag, or the scenes rank up off a tag no enemy teaches. The charm writing rules in `IDEAS.md`
§4 and the 21 charm ideas are act-2 material; none of them is this bundle.

---

### S64-5. Heat events ☆ — FILED 2026-09-25

> - Heat events

Heat represents the character's growing sex drive in general, and he expects the ideas to be hard (B23).
Waits on the Heat status existing (`../card_pool/CARD-POOL-02.md` §2.1), since the weakness only rises
from it; the weakness rank never multiplies Heat's Lust, so these scenes are the tag's whole reward.

---

### S64-6. Character-specific Penance and Torment events ☆ — FILED 2026-09-25

> - Char specific Penance and Torment events

Penance is Clemence's alone, on herself, and can be written now (she ranks up off her own cards). Torment
is Brienne's early access to an act-2 tag, three or four scenes, and waits on her Bastion strand
(`../card_pool/CARD-POOL-02.md` §3.3) so the weakness can actually be raised.

---

### S64-7. Writing and style matching, the groundwork ☆ — A BLOCKER, FILED 2026-09-25

> I forgot about writing and style matching, that's another blocker since I'd want your help laying the groundwork for the events.

The project is `../../voice_matching/`: a rewrite log of his corrections in the scenes skill, read off the
desk's backups, and a check that runs before a draft is handed over. Eight of its thirteen items were built
on 2026-09-21; `../../voice_matching/TODO.md` is the queue. This item closes when a session can hand him a venom draft he
does not have to rewrite, which is the test the project sets itself.

---

### B18. Every run should be able to raise a scene ☐ — NEW

> This is an adult game, it should be conceivable that every run triggers an H-event.

And, against reading B17 as a hard one-tag rule:

> while a single venom tag is probably the goal for the demo, I don't want to limit myself to
> exclusively one type per act

So B17's cut is a **demo scope decision, not a standing limit**. One tag per act is the target to
author against; the engine must not acquire a rule that forbids a second.

The arithmetic is in `RATE.md`. Two findings that shape this item:

- The every-run goal is **already reachable on one tag**. `maximumRankGainPerRun` is per character per
  tag, so a party of 3 can raise 3 rank-ups in a run, each rolling `chanceByRank`. Tag count is not
  the obstacle.
- The obstacle is roster throughput. **14 of 113 enemy moves deal Lust (12%)**, against a rank-1 cost
  of 5–8 landed hits on one character. Raising the lust-move share costs no scenes; adding a tag costs
  21. Frequency is free, vocabulary is expensive.

**Re-measured session 47: the obstacle has largely gone.** `../tools/lust-share.js` now reports **44 of
157 enemy moves dealing Lust — 28.0%** (Venom 15, Charm 15), the enemy overhaul having fixed it from the
enemy side exactly as this item predicted. `RATE.md` has been corrected. What is left of this item is
the authoring, not the throughput — except for Clemence, whose Penance ranks up off her own cards and
needs no roster help at all.

Belongs with the enemy rework — the fix is on the enemy side, not this one.

---

### B23. The tag set for the second demo, signed off ☐ — FILED 2026-09-25 FROM `rework/cards/` B34

**This is B17's answer.** Noodle, 2026-09-25, in the card-pool conversation (the whole message is
`../card_pool/CARD-POOL.md` B34, sixth message; the engine side is `../card_pool/CARD-POOL-02.md`
§2.3; the retag of enemy moves is `../enemies/ENEMIES.md` E14):

> Every type of lust we have is another bundle of scenes I'll want to do. Long or short, every new lust tag is a commitment.

> Alright, I'm 100% set. I can't remember the act ABCs or titles, but the tags that will be in use for the second demo build, for sure, are:
> - Venom, primarily inflicted in act1-flora. Represents the character's chemical weakness to aphrodisiacs.
> - Exposure, primarily inflicted in act1-fey. Represents the character's interest in exhibitionism.
> - (act1-frontier should primarily focus on hp damage)
> - Heat, inflicted by the status effect of the same name. Represents the character's growing sex drive in general. Coming up with intersting ideas for these will probably be hard. Extremely important note: Heat weakness is entirely for show and unlocking lust events. Heat is entirely balanced around dealing 1 lust per turn, if we made it increase with the weakness it'd hit 2/turn instantly.
> - Penance, inflicted exclusively by Clement. Represents the character falling for the allure of sin itself. If we have other characters get Penance scenes that'll be our excuse for yuri.
>
> The tags we will leave mainly for act 2, which is beyond the second demo's scope are:
> - Charm, primarily inflicted by masculine enemies with visible genitals. This represents the characters becoming more interested in men.
> - Torment, primarily inflicted by electric attacks and spanking. This represents the characters becoming more masochistic.
> On Torment: [...] If you agree, that would give Brienne essentially a sort of early access to this lust type, which would also give me a chance to see how it's recieved, and only add 3-4 more lust events to the docket.

**What it means for the scene docket:**

- **Four bundles in the demo:** Venom (Nettle's sketches in `SCENES-01.md` stand), Exposure (the fey's, and
  Clemence's outgoing Lust), Heat (its own bundle; he expects the ideas to be hard), Penance (Clemence on
  herself, and on allies once her Abbess cards carry the tag — today they carry none, so the yuri scenes
  are not yet reachable; `../card_pool/CARD-POOL-02.md` §3.2).
- **Torment reaches the demo only through Brienne**, 3 to 4 scenes, if her masochism strand is taken
  (`../card_pool/CARD-POOL-02.md` §3.3, waits on his yes).
- **Charm is act 2.** The charm writing rules in `IDEAS.md` §3 (fey suggestibility, the banned-word list)
  are kept as act-2 material, not deleted; the fey no longer use them.
- **Restraint** is in neither list and is read as cut; `RATE.md` and B20's per-act budget want re-reading
  against the four.
- **Heat's weakness ranks up and fires events like any tag but never multiplies its Lust** — an engine flag,
  named in `../card_pool/CARD-POOL-02.md` §5.

**The writing scope of the second demo, his seventh message the same day:**

> Good point on abbess, but counterpoint: If you have her inflict heat instead, that ties in better with her kit, and means I don't need to write so many more scenes. That actually defines the writing scope of the second demo, since it should be just for making a better act 1 experience. Lust events for each character for Venom, Exposure, Heat. Torment events for Brienne, Penance events for Clemence. This lets me defer some scenes until later, where I'll have more time to deal with them and less engine concerns. If needed mechanically for abbess to function, we can always temporarily break the heat tag standard of being only inflicted by the status and have Clement directly deal Heat lust damage until I'm ready to do Penance events.

> I completely forgot about restraint, I have zero issues dumpstering it completely. Bondage as a whole is a design space I'm totally unfamiliar with.

So the docket is **Venom, Exposure and Heat for every character; Torment for Brienne; Penance for Clemence
on herself**. The Abbess line applies the Heat status to allies, so the Lust they take from Clemence lands
in their Heat bundle and no yuri Penance scenes are owed for the demo. Restraint is gone.

**His housekeeping message, 2026-09-25**, listing what the second demo needs (the whole list is
`../BASICS.md`, the second demo):

> - Venom events
> - Charm events
> - Heat events
> - Char specific Penance and Torment events

**⏸ One word decides the second line.** The sign-off above makes the fey's tag **Exposure** and leaves
Charm for act 2, so *"Charm events"* is read here as the fey bundle, meaning Exposure events, until he
says otherwise. If he does mean Charm scenes in the demo, E14's retag and this docket both change.
**The order the engine forces on the writing:** Venom and Penance can be authored now; Exposure once the
fey are retagged (`../enemies/ENEMIES.md` E14); Heat once the status exists
(`../card_pool/CARD-POOL-02.md` §2.1); Brienne's Torment once her Bastion strand is built (§3.3).

---

### S64-1. Thoughtful overhaul of common map events ☆ — FILED 2026-09-25

Noodle, in the housekeeping message that set the second demo's gate (`../BASICS.md`, the second demo):

> - Thoughtful overhaul of common map events

**What "thoughtful" has to cover**, from `MAP-EVENTS-01.md` and what has landed since: the cast is still not in
any event (the twelve-line rule and the Quiet Spring's lines are written and unused); the choices never
change across a run; and the prose was bent to stand-in pictures in one night, so it is his, or the events
agent's under the writing rules, to replace. The desk (`../desk/`) is where he writes them, and his
sketch format is `im <path> [what it shows] (tags)`. Eight events plus the campfire; `MAP-EVENTS-01.md`'s six
new ideas are the additions, one per character.

---

### S64-2. Per-character map events ☆ — FILED 2026-09-25

> - Per-character map events (mainly as ways to raise lust weakness faster for players who want the H)

**The Weeping Bloom is the model** (`../Archive/demo1/map/_archive/FEEDBACK-DONE.md` S59-1): a character-gated event
that raises her weakness a rank, only offered when the rank is really available, allowed past the run's
one-rank ceiling, never shown to a Fortitude party. The verbs exist (`raiseWeaknessRank`,
`weaknessCanRank`, an event-level `subject`), so each new one is a table entry.

**What is his to decide before they are written:** which tag each character's event raises. The demo's
tags are Venom, Exposure and Heat for everyone, Torment for Brienne and Penance for Clemence
(`../events/EVENTS.md` B23), and an event that raises a tag with no scenes behind it hands the
player a rank-up and nothing to see. So the events want writing against the scene docket, not ahead of
it. `../events/RATE.md` says what a rank costs a run today, which is what "faster" is measured against.

---

## Unsorted — drop new reports for this pipeline here

*(a report that does not clearly belong to this pipeline goes in `../FEEDBACK.md` instead)*
