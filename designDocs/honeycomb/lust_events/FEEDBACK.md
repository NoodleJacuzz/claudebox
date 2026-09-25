# Lust events — FEEDBACK

**A demo goal as of session 39.** The game's authored narrative: the procedural map guarantees nothing else.

The work is a cut before it is an authoring job — trim the tag count so full rank coverage is reachable at all.

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

**B21 and B22 are closed and live in `_archive/FEEDBACK-DONE.md`.** B22 is the one that changed how
this pathway works: **Lust Events are an event QUEUE** as of session 48, one table of rows and
requirements, and the trigger sits on the character rather than the weakness. Read `CATCH-UP.md`
before writing anything against the old three tables — they are gone.

---

### B17. Lust events and the lust-tag cut ☐ — NEW DEMO GOAL

> Add to the demo's scope we need at least a few actual lust events, to reduce the number of lust tags
> such that we can get lust events done for all ranks of the 2-3 tags we keep for every character.

Two pieces, in order:

1. **Cut the tag count.** Keep 2–3 lust tags per character. The current count is the reason no tag has
   complete coverage.
2. **Author all ranks** of what survives, for every character. The point of the cut is that full
   coverage becomes reachable — a partially-authored tag reads as broken content in a demo.

**Session 47 put a menu under the decision without taking it: `IDEAS.md`.** Three measurements it
turns on — the cut can be made by UNTAGGING a tag's moves rather than deleting or retagging them, so it
costs no fiction at all; **Torment has no source anywhere in the game** and is free to delete; and
**Penance is Clemence-exclusive (43 of her own card effects, 0 enemy moves), so its full coverage is 3
scenes, not 21.** The cut it argues for is Venom + Charm + Penance = **45 scenes**, with Restraint and
Exposure untagged and Torment deleted. Awaiting Noodle's pick; nothing has been changed in the content.

The arithmetic is why this is a scope decision and not a content chore: **7** characters × 3 ranks ×
every tag is already a large authoring pass, and it only shrinks by cutting tags. 21 scenes per tag
kept — the grid is in `AUTHORING.md`, the full count in `RATE.md`. (Was written as 6 characters;
`honeycomb.characterArray` holds 7.)

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

### B19. Tone rules await a bible home ⏸ — WAITING ON NOODLE

Recorded verbatim at the top of `AUTHORING.md`: no death or gore, horror only as fridge horror, never
state the mechanism (hypnosis reads as a storefront risk), a scene is a reward and not a toll.

Noodle's own framing on why the last one is load-bearing:

> the best part about adult games is that just seeing something hot is a reward by itself, it reduces
> player expectations and keeps them forgiving, and what an AI game absolutely needs is the benefit of
> the doubt

These are bible-level and affect far more than this workstream, but Noodle does not take edits to the
bibles from a session. Held in `AUTHORING.md` until he places them.

---

### B20. Tags are budgeted per act, and Act 1 gets one or two ☐

Noodle, session 42, on where the cut should bite hardest:

> Having limited tags is most important for act 1 since linearity gives us the most at the start and
> end.

> I don't mind act 1 having a second lust tag, but we'll need to be considerate when picking it so
> that it's spread across all of act 1. Having it be a more generic one like charm or restraint would
> be better.

> introducing slimes or ghosts is a great idea, for act 2, which will be more loaded with needs for
> random lust events

So the cut is **not one tag everywhere**. The shape is:

| Act | Tags | Why |
|---|---|---|
| **Act 1** | Venom, plus at most one generic second | Linear, and the first thing a player meets. A tight vocabulary is worth most here. |
| **Act 2** | The loose act | The routes diverge and random events carry more of the load, so variety belongs here. |
| **Act 3** | Tight again | Same reason as Act 1: linearity pays at the end too. |

**The second Act 1 tag must be spread across the WHOLE act**, Act 1-1 included — not given to one
route. A route-exclusive tag would rank up only for players who took that route, which is the
partial-coverage problem B17 exists to kill.

Current Act 1-1 presence, measured: Charm 3 moves (Gloom Wisp's Beguile, the Glowcap Moth's two),
Restraint 1 (Cap Brute's Pin).

**Session 42 leaned it toward Charm**, when the sub-acts were named:

| Sub-act | Lust focus, in his words |
|---|---|
| Act1-A, the Mushroom Frontier *(live)* | *"much less focus on lust"* |
| Act1-B, Flora | *"the hotspot for venom and poison"* |
| Act1-C, the Pollen Road | *"the most focused on whatever the alternate act 1 lust is. Probably charm."* |

Charm also already has the larger Act 1-1 foothold, so it satisfies the spread-across-all-of-Act-1
requirement more cheaply than Restraint would.

**This nearly collided with B18, and the demo scope resolved it.** Act1-A is deliberately light on
Lust, so a run that goes Act1-1 → Act1-A is the least likely in the game to raise a scene. Noodle,
session 42:

> the demo ships with act 1-1 and act1-2, so all three routes are in scope

So the player picking Act1-A is *choosing* a quiet run, with Act1-B and Act1-C both available and both
lust-forward. **Route choice becomes pacing choice**, which is a feature rather than a hole — provided
B and C actually ship. If either slips, this reopens: the demo would ship only its quietest route.

Still worth measuring rather than assuming — see `RATE.md`.

This supersedes nothing in B17 — it says *where* the surviving tags go once B17 decides which survive.

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

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
