# Lust events — FEEDBACK, done

Closed items, moved out of `../FEEDBACK.md` so that file stays the OPEN queue. Quotes are Noodle's and
were moved byte for byte; nothing was rewritten on the way.

---

### B17. Lust events and the lust-tag cut ☑ — CLOSED 2026-09-25 (decided; B23 is the answer)

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

**Closed 2026-09-25.** The cut was decided: B23 holds the signed-off tag set (Venom, Exposure, Heat, Penance; Torment through Brienne alone) and the writing scope of the second demo. The authoring half lives on in B23 and B18.

---

### B19. Tone rules await a bible home ☑ — CLOSED 2026-09-25 (the bible holds them)

Recorded verbatim at the top of `AUTHORING.md`: no death or gore, horror only as fridge horror, never
state the mechanism (hypnosis reads as a storefront risk), a scene is a reward and not a toll.

Noodle's own framing on why the last one is load-bearing:

> the best part about adult games is that just seeing something hot is a reward by itself, it reduces
> player expectations and keeps them forgiving, and what an AI game absolutely needs is the benefit of
> the doubt

These are bible-level and affect far more than this workstream, but Noodle does not take edits to the
bibles from a session. Held in `AUTHORING.md` until he places them.

**Closed 2026-09-25.** `../../designBibles/story.md` §3 carries the tone rules verbatim, marked as outranking everything around them, with the 'seeing something hot is a reward' quote as its one addition. `../AUTHORING.md`'s working copy now points there instead of calling the placement pending.

---

### B20. Tags are budgeted per act, and Act 1 gets one or two ☑ — CLOSED 2026-09-25 (superseded by B23)

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

**Closed 2026-09-25.** Superseded by B23's sign-off: the Thorn Arbor is Venom, the Pollen Road is Exposure, the Mushroom Frontier focuses on health damage, and Heat is legal anywhere in act 1 and a focus nowhere. Charm is act 2.

---

### B22. The event QUEUE replaces how a scene is chosen ☑ — DONE, session 48

Noodle, session 48, on the session-47 backfill and what should stand in its place:

> Currently, the game has a "backfill" system to make sure that if I go back and add an event for a lust
> rank that doesn't have one, that it triggers for players who already passed that rank. That systen
> currently has a few flaws:
>
> 1. I'm personally completely fine with a locked roster. The player coming to the game to find like 50
> events waiting for them is not a bad thing at all.
> 2. It only assigned 1 scene per rank, and it treated the completed tally as a count, not a list of
> actual events triggered.

> I have, what I think, is a much simpler and better solution to my needs: An event queue. It's very
> simple: I'd have a list of mandatory lust events and their requirements. If the player meets these
> requirements and doesn't have the event completed in their savedata, the character is locked and a lust
> event is ready to be played.

> This means I can do multi-part events, replace events wholesale, have lust events that care about
> multiple lust events, and so on. It seems like a much more robust and modular system, and if I ever
> should decide to go back and make a scene truly optional (maybe one day I start hating a nettle venom
> scene), I can tweak the flags as I desire.

And, on what it costs:

> The existing system places the trigger for these events to start over the weakness itself. It's
> elegant, and I do like it, but I don't think we can keep it as much as I'd want to. It doesn't work
> without being able to tie an event strictly to a weakness, so I'll have to ask you to please work out a
> replacement system.

**Built.** `honeycomb.lustEventQueueArray` is now the only table. `lustEventListArray`,
`lustEventMilestoneArray`, `lustEventTriggerArray` and the whole backfill are deleted, and so is the
profile's tally of events raised and completed.

- **The queue is derived, never stored.** `honeycomb.lustEvents.queueFor(character)` works it out fresh
  every time from requirements and `profile.lustEventDoneArray`. That is what the backfill existed to
  fake, and why it is not needed: a row written today is owed today, to every profile that passes it.
- **Completion is a LIST**, keyed by the row's `index` — flaw 2, exactly as reported. A fanned-out row
  (`character: "any"`) is keyed per character, so one scene can be owed to each of them in turn.
- **Flags to tweak**, as asked: `requirementArray` (any condition, ANDed, invertible) and `locksParty`.
  Renaming a row offers it again; swapping the `event` under the same name does not.
- **Multi-part** is the new `lustEventDone` requirement; **"cares about multiple lust events"** is
  `entryArray` on the same one, or an `allOf`. **`weaknessRank`** is the new requirement for "this
  weakness has reached rank N", and it is also a value, so it works anywhere a condition does.
- **Noodle's call on the two open questions**, taken this session: the random fallback table is CUT
  (one system, no dice; a generic scene is a `character: "any"` row instead), and the trigger moved to
  **the roster heart plus a new banner on the character sheet**. A weakness row keeps "Recently ranked
  up!" and loses its button.
- **Save format 10** carries an old profile across: `lustEventSeenArray` becomes completed rows, so
  nobody is handed a scene they already played; the tally, the fired-milestone list and the event
  frozen onto each rank-up record are dropped; a Lust Battle in flight is abandoned.

Suite block `[68]` rebuilt (45 checks) and `[116]` replaced with the migration.

**What this does NOT do:** it does not write a single scene. B17's cut and the authoring behind it are
untouched, and `IDEAS.md` was written against the old three-table system — its scene ideas stand, its
wiring notes do not.

---

---

### B21. A scene written tonight must reach the testers who already passed that rank ☑ — BUILT, session 47

Noodle, session 47:

> A few super early responders are testing the game, and I realize the current setup doesn't
> retroactively make events visible if you've already passed them, right? Is it too late for my first
> responders to see any scenes I add tonight?

**It was, and it no longer is.** Measured first, because the answer decided the shape of the fix:

- `chooseEvent` runs ONCE, at the instant of the rank-up, and freezes its answer into the record
  (`honeycomb-lust-events.js`, `recordRankUp`). A list row added later never revisits it.
- A rank-up that found no event becomes a plain notification, and `noticeTag` **deletes that record**
  the moment the weakness is looked at. A resolved event is deleted by `resolveRecord`. So the history
  of what was missed is not merely frozen, it is gone.
- Ranks are never lost, so those scenes could never fire for that profile again.
- **But `profile.lustExposureArray` survives untouched**, so the rank a character sits at is always
  derivable — which is the whole of the fix.

`honeycomb.lustEvents.backfill()` walks each character × weakness, takes the rank from
`honeycomb.lust.rankFor` (not the raw exposure — that is what applies Fortitude, so a weakness capped
at rank 1 is never owed the rank 2 and 3 scenes), and offers any rank whose authored scene was never
seen. It runs from `honeycomb.save.afterLoad`, which both load paths call — a slot and a pasted save
or bug report. Same idea as `reconcileContent`: new content reaching an old save.

Four decisions inside it, each a tuning field under `tuning.lustEvents.backfill`:

| | |
|---|---|
| `listOnly: true` | **Authored scenes only.** A fallback trigger already had its roll at the time, and losing it is history rather than a gap; a milestone counts events *raised*, so re-firing one out of order would renumber the spine. Only the list is content written for a slot that never got to fill it. |
| `maximumPerCharacter: 1` | Event Ready keeps a character OUT of the party (`blocksParty`), so a profile owed six scenes would otherwise come back with most of the roster locked. The queue drains one per load, **lowest rank first**, so an arc is still seen in order. |
| `maximumPerProfile: 3` | The same ceiling across the roster. |
| `enabled: true` | Noodle's switch. |

One thing had to be added for it: **the completed tally is a COUNT per character and per weakness, and
cannot answer "has this profile seen Nettle's venom rank 2".** `resolveRecord` now also registers the
(character, tag, rank) in `profile.lustEventSeenArray`, which is what stops a seen scene being offered
again. **For the current testers that register is empty**, so their first load offers everything up to
their current rank — correct for them, since everything they have seen so far was placeholder.

Verified: suite block `[116]`, 27 checks, **every one of them proven to go red** against six mutations
of the engine (the load seam removed, either ceiling removed, the seen register never written,
`listOnly` ignored, `rankFor` swapped for raw exposure). Suite 2121/0. Then driven in the browser: a
profile at venom rank 2 with no records, saved; two scenes added; the save reloaded; Nettle's roster
row carries `hcLustEventReady`, her weakness row offers **Event Ready!**, and the scene opens as
*"NETTLE: SENSITISED"* — rank 1, the lowest unseen, with her standing as the speaker.

**What it cannot recover:** nothing, for an authored scene. A *fallback* scene a tester rolled and
missed is gone by design. And a tester who has already seen a placeholder at some rank will still be
offered the authored scene for that rank, because the register did not exist when they saw it.

---

