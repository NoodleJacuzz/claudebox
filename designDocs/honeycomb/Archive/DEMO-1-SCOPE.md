# The first demo's scope — Noodle's session-38 list, as BASICS.md carried it until 2026-09-25

**ARCHIVED 2026-09-25.** This section lived in `../BASICS.md` as "The demo scope" from session 38 until
the first demo shipped as the Public Test Release on 2026-09-23 and Noodle set the SECOND demo's gate on
2026-09-25. Moved byte for byte. The standing rules in it that still bind (the floor under act 1,
Anastasia's invisibility, the Mushroom Frontier, act 1-2 as the stopping point) were kept in `../BASICS.md`;
everything here is history.

---

### The demo scope (Noodle, session 38; amended session 39)

> The Proof of Concept is well past completed and testing. We're working on a beta demo, and the goals
> are explicitly:
>
> - Sprite pass (ongoing)
> - Card pool rework (ongoing)
> - Card frame redesign (finished?)
> - Enemy rework (needs testing)
> - Progression rework (finished?)
> - Anastasia (ongoing, currently in debt, next session starts by going backwards, her being shown as
>   secret is also bad if she doesn't make it, I don't need 10k emails asking how to unlock her)
> - VFX (ongoing)
> - Looping Music (unstarted)
> - Act 1-1 and Act 1-2
> - Mobile portrait (We're way closer than expected due to healthy design habits)

**Session 42 defined what "Act 1-2" covers:** it is the catch-all for the sub-acts that follow
Act1-1 — **Act1-A (Mushroom Frontier, live), Act1-B (Flora, empty), Act1-C (Pollen Road, empty)** —
and Noodle confirmed *"the demo ships with act 1-1 and act1-2, so all three routes are in scope."*
Two of the three have no enemies yet. See `designBibles/story.md` §4 and `enemy_overhaul/`.

**This list is the demo.** Work that is not on it does not block the demo, however loud it is in the
feedback round — each workstream’s `FEEDBACK.md` is the queue, this is the gate. Items that are larger or
smaller than they look are called out here so no session mistakes them:

- **Act 1-1 and Act 1-2 are LIVE** (corrected session 39 — the session-38 reading below was wrong).
  Act 1-1 is the wide automated map on a simple background; act 1-2 is the one overlaid on a more
  complex background. The branching landed in session 55: act 1-1 ends in three boss nodes, one per
  route, and a boss the profile has met before is named on its node along with the route it leads to.
  Anastasia's chess gauntlet is a one-time act 1-2, and **act 1-2 is the demo's stopping point**.

  **THE LIVE ACT 1-2 IS THE MUSHROOM FRONTIER, NOT MYCONID NAVEL** (Noodle, session 55). BASICS carried
  *Myconid Navel* from session 38 and he settled it when the two were put side by side: *"Both have
  their charm, but Mushroom Frontier is better suited for the direction we actually went for. We'll
  save 'X's Navel' for a future area."* Anything still naming Myconid Navel as this region's title is
  stale; the name is kept for somewhere later. *(Session 38 read `tuning.map` as one 9-row map with no act table — reconcile that
  reading with the live behaviour before building the branching.)*
- **Mobile portrait** is a different target from the one the scaling pass was measured against —
  "Presentation rules" below names mobile LANDSCAPE, and `reference/SCALING-01.md`'s parity numbers are
  landscape numbers. The honeycomb-pixel work carries over; the layouts have to be re-measured.
  In practice this is blocked on the game being painful to drive on a phone (small buttons, deliberate
  — mobile sizing comes after the UI is done), so it needs a large-hit-target test path first.
- **Anastasia must not be advertised if she is cut.** She is `inDevelopment: true`, and the roster, the
  teambuilding screen and the compendium must all leave her out entirely — no "???" tile promising a
  secret character, not even an anonymous one. Any screen that lists characters, and any screen that
  COUNTS them, asks `honeycomb.shippedCharacterArray()`; never `honeycomb.characterArray` directly, and
  never its own copy of the filter. Any future unlock UI must keep that property until she ships.
  *(Corrected session 40: this section previously asserted the property was held. It was not — the
  teambuilding roster sized its locked slots off the unfiltered table and drew a phantom tile. The gate
  above is the fix; the history is `chessmaster/FEEDBACK.md` A4.)*

#### The floor under act 1 (Noodle, session 55)

> A run ending in the first 1/3rd of act 1 should be astronomically unlucky, or the result of purposeful
> self-sabotage. As long as the first third of the act is possible, a devoted player has a chance no
> matter how unskilled they are.

**This is a hard floor, and it outranks "a run is meant to be lost more often than won".** The reason he
gives is that losing early breaks both of the game's self-correcting systems at once:

> if the player is hard stuck at the start due to a low skill level, they can't get EXP for the
> progression nodes or unlock commons, and their lust weaknesses build, so both of our self-balancing
> tools fail catastrophically

A player who cannot clear the first third never earns the experience that would make them stronger, and
their Lust weaknesses rise while they fail. **He also said which way to err:** *"I'd rather have the data
point of 'you went too far in the other direction' than 'the spot you knew felt bad does, in fact, feel
bad'."*

What session 55 did about it: an `opening` encounter tier for the first three rows, act 1's ordinary
fight cut from 10% of party health to 8%, more combat nodes per map, and every map starting on a rest.

#### Amendments (Noodle, session 39)

Three changes to the list above. Full quotes and annotations are in the workstream feedback files indexed by `FEEDBACK.md`.

> High priority, most important demo goal is better performance. Why are players saying the game runs
> poorly? Are they experiencing different things than on my machine?

**Performance is now the top demo goal** (`performance/FEEDBACK.md` B16). It has a diagnostic half that cannot
be answered from Noodle's machine — his hardware is not player hardware — which is why telemetry is
promoted with it.

> Add to the demo's scope we need at least a few actual lust events, to reduce the number of lust tags
> such that we can get lust events done for all ranks of the 2-3 tags we keep for every character.

**Lust events are added to the demo** (B17): cut to 2–3 tags per character, then author every rank of
what survives. The cut is what makes full coverage reachable.

> Might be a demo goal. It would turn thousands of lurker players into real datapoints.

**Telemetry is promoted** from demoted to a candidate goal (A8). It is the instrument for the
performance question above. An endpoint still needs picking.

> But aside from these, this project mainly exists as a low-user-attention project for you to work on
> while I am working on other non-coding tasks.

Work independently. Batch questions to the checkpoints above rather than interrupting.
