# Lust events — FEEDBACK

**A demo goal as of session 39.** The game's authored narrative: the procedural map guarantees nothing else.

The cut is decided (B23, 2026-09-25): Venom, Exposure and Heat for every character, Torment for Brienne, Penance for Clemence. What is left is the authoring.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins. Items were split out of the round-09 file in session 41 and moved
byte for byte — nothing was rewritten on the way.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `../CATCH-UP.md`. What the project is: `../BASICS.md`.

---

**B17, B19, B20, B21 and B22 are closed and live in `_archive/FEEDBACK-DONE.md`.** B17 and B20 were
answered by B23 below, and B19's tone rules are in `../designBibles/story.md` §3. B22 is the one that changed how
this pathway works: **Lust Events are an event QUEUE** as of session 48, one table of rows and
requirements, and the trigger sits on the character rather than the weakness. Read `CATCH-UP.md`
before writing anything against the old three tables — they are gone.

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
`../rework/cards/FEEDBACK.md` B34, sixth message; the engine side is `../rework/cards/CARD-POOL-02.md`
§2.3; the retag of enemy moves is `../enemy_overhaul/FEEDBACK.md` E14):

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
  are not yet reachable; `../rework/cards/CARD-POOL-02.md` §3.2).
- **Torment reaches the demo only through Brienne**, 3 to 4 scenes, if her masochism strand is taken
  (`../rework/cards/CARD-POOL-02.md` §3.3, waits on his yes).
- **Charm is act 2.** The charm writing rules in `IDEAS.md` §3 (fey suggestibility, the banned-word list)
  are kept as act-2 material, not deleted; the fey no longer use them.
- **Restraint** is in neither list and is read as cut; `RATE.md` and B20's per-act budget want re-reading
  against the four.
- **Heat's weakness ranks up and fires events like any tag but never multiplies its Lust** — an engine flag,
  named in `../rework/cards/CARD-POOL-02.md` §5.

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
fey are retagged (`../enemy_overhaul/FEEDBACK.md` E14); Heat once the status exists
(`../rework/cards/CARD-POOL-02.md` §2.1); Brienne's Torment once her Bastion strand is built (§3.3).

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
