# Card pool — FEEDBACK

What a card costs, what it does, what rarity it is, and the economy around removing and adding cards. Card **chrome** is `../../card_redesign/FEEDBACK.md`; card **art** is `../../art_pipeline/FEEDBACK.md`.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins. Items were split out of the round-09 file in session 41 and moved
byte for byte — nothing was rewritten on the way.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `../../CATCH-UP.md`. What the project is: `../../BASICS.md`.

---

### A1. The broken-card design intent — ANSWERED (session 39), commons still open ⏸

> Were the broken cards balanced around the designs I intended? [...] starter cards are mostly negative
> when broken and had bad effects when left unplayed in the hand like curses, and rares were the most
> beneficial to escaping the broken state.

**A second person asked the same thing** in the emailed feedback — *"I remember you saying when broken
starter cards would do negative effects if left unplayed, what happened to that?"*

His answer, session 39:

> Design philosophy: All Broken cards represent the character trying to claw their way out of the
> mindbroken state, or represent them sliding deeper into it. Broken Starter cards are neutral or
> negative, a newbie adventurer dragging down her allies by giving into lust. The go-to design would be
> a 1-cost very low rate effect with an additional 'if unplayed' effect that hurts the party. Broken
> Rare cards make a positive effort to recover, an experienced adventurer who prepared beforehand for
> her snap. They are what make a genuine effort to recover, and a deck with a high ratio of rares stands
> the best chance at recovery. Commons are a distinct design gap I have no consistent answer for.

So the shape is confirmed and it is **stronger than the rule session 38 proposed**: not just a rarity
gradient but a fiction that generates the numbers. Every broken card is either clawing out or sliding
deeper, and rarity says which.

What this unblocks:

- **The `if unplayed` hook is engine work and does not exist yet.** An end-of-turn penalty that fires
  per broken starter still in hand is a new hook, not a card effect. Build it before rebalancing, and
  put it under tuning — the penalty rate is a number, so it belongs in `honeycomb-tuning.js`.
- **Broken starters** get the template: 1 cost, very low rate, plus the unplayed penalty.
- **Broken rares** get the recovery budget. "A deck with a high ratio of rares stands the best chance at
  recovery" is a testable claim — it is exactly what `../../tools/draft-sim/draft-simulation.js` could measure once A9 is
  un-paused.
- **Broken commons: his lean, session 39.**

  > Broken commons should probably be somewhere in the middle? It's tricky, and a matter of balance.

  A direction, not a rule. "The middle" between a punished starter and a rewarding rare is a *rate*
  question he is explicitly leaving to balance, so commons should be built last — after the starter
  template and the rare budget are both in and measurable — rather than designed up front. The one
  thing his answer does settle: commons get **no unplayed penalty** (that is the starter's marker) and
  **no reliable escape** (that is the rare's payoff). What is left in the middle is a plain card.

Note that **Clemence inverts all of this** — see B18. Her broken state is an ascension she wants, so
"clawing out" is not what her broken cards are for.

---

### A6. Whetted Edge — ANSWERED (session 39) ☐

0 energy, exhausts, upgrades a card in hand permanently.

> Whetted edge, maybe shift up to rare? The flavor is boring and the name is bad right now.

Three changes, one tentative: **move it to rare** (his "maybe" — treat as a decision he will confirm on
sight, not as an open question), and **rename and reflavor it**. The rarity move is the balance answer
session 38 asked for; the name and flavor are a separate authoring pass.

Note this interacts with **A3**: moving a card to rare now changes its *orientation*, not just its gem.
A rare is vertical. Do A3 first or the reflavor gets redone.

---

### A7. Absolution — ANSWERED (session 39), with one unclear aside ⏸

Your rule from the card-pool pass: **Clemence never reduces an ally's Lust** — cards, broken forms and
powers. `clemenceAbsolve` (her A1) is `{ soothe 5 → otherAllies, heal 5 → allAllies, lust → Clemence }`.

> Should be fine since it's once per rest, and lost when broken.

**Absolution is the deliberate exception**, and the reasoning holds against B18: the risk Clemence is
supposed to carry lives in her *broken* state, and Absolution is gone by then. Once per rest bounds it
further. No rewrite.

#### The rest-site rule, clarified (session 39) — wider than A7

> I must have forgotten to clarify it in the outfit overhaul doc. Yes, Clement's A1 should be once per
> rest. Also, to double clarify, visiting a rest site at all should refresh abilities. That could be
> made more clear somewhere.

Two rules, and the second is a **general mechanic that is not written down anywhere**:

1. Clemence's A1 is **once per rest**. Confirmed.
2. **Visiting a rest site at all refreshes abilities** — for everyone, not just Clemence. Not "sleeping
   at one", not "choosing an option": arriving is the refresh.

Rule 2 is the one to be careful with, because it changes what a rest node is worth. The campfire is
already the most contested node in the run (A5 — removal, upgrades, and healing all compete there);
if arrival alone refreshes abilities, that is a fourth reason to take it, and it is a reason that costs
the player nothing. **VERIFY what the engine does today**, then write the rule into the mechanics
reference rather than leaving it in a feedback round — this is exactly the kind of rule that gets
re-litigated every few sessions because it lives nowhere.

#### "One with Nothing" — PLACED (session 39)

> "One with Nothing" is Clement's A2. Again, an MTG reference, since her A2 just drops her health.

> I wonder if One with Nothing would be better as a card though, it's an MTG reference (a rare card with
> a confusingly pure negative effect, which players will be hungry to build around. Can't be an Ecstatic
> card though, since its broken form should be a good broken escape tool).

So: **Clemence's A2 is already named One with Nothing, and it drops her health.** The open idea is
whether it should stop being an ability and become **a card** instead — a rare with a confusingly pure
negative effect that players are hungry to build around, which is what the MTG card is famous for.

Two constraints on the idea if it is built:

- **It must not be Ecstatic**, because an Ecstatic card's broken form needs to be a good escape tool,
  and a pure-negative card's broken form should not be.
- It reads directly onto **B18**: a card that drops her health is a sacrifice card, and B18's design
  target is that every point of lust she gains should feel like a sacrifice. Moving it into the pool
  gives her the sacrifice theme a home a fixed ability cannot.

Not a decision yet — he raised it as a wondering. It belongs in the B18 pass, not before it.

---

### A9. The draft simulation's cut list — DEFERRED (session 39) ⏸

> I say we wait for now.

**Parked by his decision.** `../../rework/cards/DRAFT-SIM-01.md` part 3's Tier A/B list stays unacted, and the re-run stays
unscheduled. The staleness finding stands and is why: 6 of its 20 named cards no longer exist, and every
number predates the session-33 pool replacement. Nothing should be cut on the old report's say-so.

Worth remembering that A1 gave the simulation a new job whenever it is un-paused — *"a deck with a high
ratio of rares stands the best chance at recovery"* is a claim `../../tools/draft-sim/draft-simulation.js` can measure.

Attached to the same answer, a separate question about poison:

> One note on poison specifically, I wanted it to do visual damage tics and cut in half each turn, does
> it do that yet? I want it to be all "pow-pow-pow-pow" and feel strong, since it's Nettle's whole
> thing.

**VERIFY, and answer him.** Two distinct properties to check in the code: (1) does poison halve each
turn, and (2) does it render as repeated individual damage tics rather than one lump. The second is
presentation and is the part he cares about — "pow-pow-pow-pow" is a feel request, and a correct number
delivered as one floating number fails it. This also touches **B14 lever 8** (many small DOM writes per
beat), so the feel fix and the performance goal pull in opposite directions here; whatever tic renderer
answers this should be built as a compositor animation rather than per-tic DOM writes.

---

### B18. Clemence's redesign ☐

The longest answer session 39 gave, and it reframes her whole kit.

> Clemence is simultaneously an exception and not. Her Broken state is flavored as what she views as
> divine ascension. She flips from "Pure support, nullifies a major struggle of the game (hp
> management)" to "Pure offense (through lust), introduces a serious risk to the player due to growing
> risk of game over caused by runaway lust." The character wants to be broken, though she can deny it
> (devotee) the temptation to fall off the deep end is still there. This is why her being able to soothe
> lust is problematic, it removes the actual risk factor involved with her. And why I felt there were
> too many lust-spending cards in her pool. It should be a rare-only effect, because a player diving
> straight into breaking her at run start without preparing first should be punished. It has upsides,
> suddenly all her starter and common cards are pumping out rare numbers. Slay the Spire makes every
> point of HP lost hurt, Clemence should make every point of lust gained feel like a sacrifice. She
> probably needs another round of tuning, her healing spells should not be "on rate", they should be
> incredible. Like a "restore target to full hp" for 2 mana.

Four separable changes:

1. **Soothing becomes rare-only.** Not removed — gated behind rarity, so a player who breaks her early
   without preparing has no outlet. This is the risk that makes her interesting.
2. **Lust-spending cards get cut back** in her pool for the same reason.
3. **Her healing goes off-rate and becomes enormous.** "Restore target to full HP for 2 mana" is the
   register he named. Right now her healing is balanced on rate, which is exactly what makes her flat.
4. **Every point of lust should feel like a sacrifice** — the design target, and the test for every
   card in her pool.

Two things to hold while doing it:

- **This does not contradict A7.** Absolution survives as the exception because it is once per rest and
  gone when broken — the risk he is protecting lives in the broken state.
- **Clemence inverts A1.** A1's philosophy is that broken cards claw out of the mindbroken state or sink
  deeper. Clemence *wants* to be broken; her broken state is ascension. So "clawing out" is not what her
  broken cards do, and A1's starter/rare gradient needs a Clemence-shaped exception written down before
  her broken forms are balanced against it.
- **B5 interacts.** She has 17 cross-party cards against Nettle's 2 and Severine's 2, and she is where
  every simulated drafter went. Cutting her lust-spending and gating her soothing is also the most
  direct fix available to B5's eight-to-one spread.

---

### B24. Curses and deck bloat ☐

> Make a boss (probably retool an existing new one) with a start of battle effect to shuffle temporary
> curses into your deck until you have 7 cards for each character. Add an elite who's not very difficult
> but has a starting attack that adds permanent curses to your deck until you have at least 15 cards in
> your deck. Have the curses gloom wisps shuffle in be permanent too so they impact future battles if
> killed too quickly. All these reduce the power of early removals.

Three pieces with one purpose — **early removal is too strong, so bloat it back**:

1. **A boss** (retool an existing new one rather than building from scratch) with a start-of-battle
   effect shuffling **temporary** curses in until the deck holds 7 cards per character.
2. **An elite**, not very difficult, whose starting attack adds **permanent** curses until the deck
   holds at least 15 cards.
3. **Gloom wisp curses become permanent** — so killing wisps too fast carries a cost into later fights
   instead of being free.

Note the pairing with **B23** and **B25**: all three attack the same problem from different angles
(price removal up, cap removal per shop, and add curses back). They should be tuned as one system, or
the deck-size floor will be hit by three independent forces at once. Every threshold here is a number —
7 per character, 15 minimum — so all of them belong in tuning.

---

### B25. Shop removal pricing ☐

> Card shop removal should be once-per-shop, and should quickly scale up in price.

Two limits: **once per shop visit**, and **price scales up quickly** across the run. Same system as B23
and B24 — tune together.

---

### B5. Cross-party hooks ◐

> A number of characters seem to still have no cross-party hooks at all, every single party member
> should ideally have *some* kind of value they add to each other.

Re-counted session 38 against the **current** pool (the old count in round 07 predates the replacement).
Draftable commons and rares whose target is another ally:

| Clemence | Brienne | Cinder | Cassadora | Nettle | Severine |
|---|---|---|---|---|---|
| 17 | 9 | 5 | 3 | 2 | 2 |

Better than the old reading — Nettle had none at all before, and has Plague Bearer and Draw Out now —
but the spread is still eight to one, and Clemence is still where every simulated drafter went. Content
work, not engine work. **B18 cuts Clemence's end of the spread directly.**

---

### B7. One-card passives named as statuses ◐

> There are way too many statuses in the game: A lot of unique ones should be replaced by just saying
> the card's effect in the text, rather than saying "Gain 1 gorged." and leaving the explanation of that
> to the tooltip.

Your rule (session 13): a passive that sticks around turn after turn may live on the status bar, but if
only ONE card uses it, do not name it as a keyword — write the effect into the card's text. The
`orphanStatus` warning rule is built and the session-20 pass applied the rule to most prose. Open: the
remaining card prose that still names a one-card passive.

---

### B26. Neutral cards missed the overhaul ☆

> The card overhaul seems not to have touched the neutral cards, Shared Resolve is way below rate.

Found in play, session 39. **The session-33 pool replacement appears to have skipped the neutral pool
entirely**, with `Shared Resolve` named as the example that is well below rate. Two jobs: confirm the
scope of the miss (is it all neutrals, or some), then bring them onto the current rate. Worth doing
early — neutral cards appear in every draft regardless of party, so an under-rate neutral pool quietly
taxes every run, and it would also skew anything A9's simulation measures later.

---

### B33. Boss and elite rare drop rate ☆

> Boss and elite encounters should drop rare cards at a higher rate

Reward weighting by encounter type. Reads directly onto **A1**: if a high ratio of rares is what gives a
deck its best chance of recovering from broken, then where rares come from is a balance lever, not just
a reward. Bosses and elites being the rare source also gives **B24's** new boss and elite a payoff to
justify their difficulty.

---

### S47. Taunt redirected almost nothing, and now redirects everything ☑ (session 47)

> Taunt is really bad, it might be unsalvageable unless we have it redirect -all- damage taken by party members. I'm not sure if reworking or replacing it would be easier, probably reworking to redirect all if I had to pick.

**Reworked, which is the half he picked.**

**Why it was bad, precisely.** Taunt was a filter on target SELECTION
(`honeycomb.tauntFilteredArray`), consulted by `honeycomb.targetCandidateArray` for single-target enemy
modes only — `definition.relation == "opponent" && definition.wholeTeam != true`. Every sweep therefore
walked straight past it **by design**. The one thing a wall is for, standing in front of an area attack,
was the one thing it could not do; and an enemy line with any AoE in it made a Taunt read as doing
nothing at all.

**What it does now.** `honeycomb.dealDamage` redirects at the moment damage LANDS: if the target's own
side has a living, unbroken taunter and the attacker is on the other side, the hit lands on the wall
instead. That catches sweeps, multi-hits, everything.

Three things it deliberately does NOT take, each asserted in suite block `[120]`:

- **a teammate's hit** — a Blood Price is not an attack to intercept;
- **a self-cost** (`lifeLoss`) — it belongs to whoever is paying it;
- **a tick with no attacker** — poison and thorns are the target's own clock.

And a redirected hit carries `taunted`, so it cannot redirect again — which is what stops two walls
standing together from hanging the engine. The selection filter is kept as well, so an enemy's telegraph
still POINTS at the wall rather than lying about where its attack will land.

**Worth watching:** this is a large power increase for anything that grants Taunt, and the Celestial Rook
grants it to itself every other turn. `../../chessmaster/STATUS.md` records that the gauntlet has not been
re-simulated since.

---

### S47b. An enemy could write to the party's run deck ☑ (session 47)

Found by re-simulating Anastasia's gauntlet after her pieces were rewritten, not by a report.

**Her Queen's fifth move shuffles a King's Invocation into the deck — and her pieces are ALSO the
gauntlet's enemies.** `addCardToDeck` writes to `run.deckArray`, which is the PARTY'S deck, so the
enemy-side Queen of the Queens' Guard elite was handing the player a King. That elite fields two of them.

Nothing about the verb said whose deck it meant, because until a card like this existed there was only
one answer. It now refuses when the user is not on the party's side, unless the entry says
`evenFromOpponents: true` — which is how a curse an enemy forces into your deck would ask for it, and a
real idea worth keeping reachable.

Suite block `[121]`: the enemy is refused, the party's own Queen still pays out, and the opt-out works.

### P5. "Ransom took my tHP but gave nothing else" ☑ — FIXED SESSION 55

> "Ransom took my tHP but gave nothing else" report from playtesters

**The tester was right, and it was worse than one bad case.** Ransom spends up to 8 of an ally's
Temporary HP and draws one card for every 4 spent. The spend took everything up to 8; the draw divided
and rounded down. So anything that was not a whole block of 4 was taken and paid for with nothing.

What the card did, by how much Temporary HP the ally was standing on:

| Temporary HP held | Spent | Cards drawn | Energy |
|---|---|---|---|
| 1 | 1 | 0 | 0 |
| 2 | 2 | 0 | 0 |
| 3 | 3 | 0 | 0 |
| 5 | 5 | 1 | 0 |
| 6 | 6 | 1 | 0 |
| 7 | 7 | 1 | 0 |
| 8 | 8 | 2 | 1 |

At 1 to 3 it took everything and gave nothing at all. At 5 to 7 it took the remainder on top of the
block it paid for.

**The fix is an engine verb.** `spendTemporaryHealth` takes a `step` now, and rounds the spend down to a
multiple of it. Ransom and Ransom+ carry `step: 4`. What the card cannot pay for, it does not take:

| Temporary HP held | Spent | Kept | Cards drawn |
|---|---|---|---|
| 1 | 0 | 1 | 0 |
| 3 | 0 | 3 | 0 |
| 4 | 4 | 0 | 1 |
| 7 | 4 | 3 | 1 |
| 8 | 8 | 0 | 2 |

The printed text gained three words and nothing else: "Spend up to 8 of an ally's Temporary HP, **4 at a
time**." Suite block [129].

**THREE MORE CARDS HAVE THE SAME SHAPE AND WERE LEFT ALONE.** Pay the Toll, Tribute and Incredible
Wealth all spend ALL of the owner's Temporary HP and pay per block of 4, so 3 Temporary HP into any of
them is also 3 gone for nothing. They were left because "spend all" is a different promise from "spend
up to 8" — the player chose to dump everything — and because Brienne's tithe archetype is about dumping
Temporary HP, so stepping it may not be wanted. **This one is Noodle's call.**

---

### P6. Sundered and Weak print a raw {token} on a card ☑ — FIXED SESSION 55

> Honeycomb card tags:
> Sundered reads, "Takes {damageincreasePercent}% more damage per stack. Does not fade."
> Weak reads, "Deals {damageReductionPercent}% less attack damage. Wears off at end of turn."

**Read as a bug report rather than a text request: those are the words the game was showing him**, with
the token still in them. A status writes its numbers as `{tokens}` so a tuning change cannot leave the
words behind, and `honeycomb.statusDescription` is what fills them in.

The status icon's own tooltip calls it. **The keyword panel printed on a CARD did not** —
`honeycomb.keywordDefinition` handed back the status's raw `description` field. So the same status read
two different ways depending on where the player was looking.

Six statuses were affected, not two:

| Status | What the card showed |
|---|---|
| Weak | Deals {damageReductionPercent}% less attack damage. |
| Sundered | Takes {damageIncreasePercent}% more damage per stack. |
| Jinx | Whenever an enemy's intent is changed, it takes {damage} damage. |
| Stand Fast | At the start of the holder's turn, they gain {temporaryAmount} Temporary HP. |
| Plated | Takes {reductionPerStack} less damage from each hit per stack. |
| Revenge | Whenever this takes damage, deal {damagePerStack} damage per stack to ALL enemies. |

One line: `keywordDefinition` calls `statusDescription`. Every panel now names its real number, and the
suite holds the count at zero so a seventh cannot appear (block [129]).

---

### P7. Sundered should reduce by 1 each turn ☑ — DONE SESSION 55, AND IT CONTRADICTS P6

> Sundered should reduce by 1 each turn

Done. Sundered loses one stack at the end of the holder's turn. It still stacks in INTENSITY, so a
second application raises the level rather than restarting a timer, and each stack still adds 25% to
damage taken.

This needed an engine change, because decay was written for duration statuses only: `tickStatuses`
tested `stackType == "duration"`, so setting a `decayTiming` on an intensity status did nothing at all.
That test is gone, and a status may name a `decayAmount` (one by default). **Nothing was relying on the
old narrowing** — no intensity status in the game carried a `decayTiming`, because carrying one had no
effect.

**THE TWO INSTRUCTIONS DISAGREE, AND THIS IS THE ONE THAT WAS FOLLOWED.** P6 above quotes Sundered's
text ending on "Does not fade", which was true when it was written. Making it fade makes that sentence
a lie, so the description now reads:

> Takes 25% more damage per stack. Loses 1 stack at the end of the holder's turn.

If the fade was not meant, `decayTiming` and `decayAmount` come back off the status and the old sentence
goes back. **The balance of this has not been played.** Sundered was the one debuff that stayed put, so
the archetypes that build it now have to keep it up; nothing else was repriced to match.

### P21. Clemence's description should say she wants to be Broken ☑ — DONE SESSION 55

> Clement's desc should mention she wants to be broken

Her description ended on *"and takes the price in Lust herself"*, which reads as a cost she puts up
with. Two sentences were added, and nothing else was touched:

> Clemence believes that sinning is part of being human, and that being human means being made in God's
> image, so there is very little she thinks is actually wrong. She is calm and warm and entirely sincere
> about it. She heals the party, feeds it energy and cards, and takes the price in Lust herself. **She is
> not trying to avoid Breaking. She is aiming at it.**

It is now 357 characters against a cast that runs 238 to 300, so it is the longest of the seven.

**It says she wants it and does not say what she thinks it is.** `../../lust_events/IDEAS.md` §3 is explicit
that her broken state should read as an ascension and that no line may confirm it: *"Never state it.
Never have anyone confirm it."* Two flat sentences about what she is aiming at stay on the right side
of that.

---

### P22. Clemence heals too much, and can wash off her own Lust ⏸ — MEASURED, NEEDS HIS NUMBERS

> Clement still has too much healing in her broken form, too much healing allies, too much healing of
> her own lust

Three complaints, and the third is the structural one.

**Her broken cards heal more than the cards they replace.** Every pair, as printed:

| Whole | Heals | Broken | Heals |
|---|---|---|---|
| Mending Word | an ally, 7 | Fevered Word | an ally, 10 |
| Lay On Hands | all allies, 4 (6 with Lust) | Benediction | all allies, 7 (8 with Lust) |
| Mercy | most hurt, 10 | Tender Mercy | most hurt, 14 |
| Anoint | a Broken ally, 12 | Last Anointing | a Broken ally, 16 |
| Fallen Vigil | an ally, 5 (+5 if Broken) | Keep Faith | an ally, 7 (+7 if Broken) |
| Answered Prayer | an ally, 7 | Prayer Unbound | an ally, 10 |

So being Broken is a straight 40% healing upgrade across her whole common line, on top of everything
else it gives her.

**She can spend her own Lust, which is the price she paid to get there.** Nine broken cards let her
shed it:

| Card | Spends |
|---|---|
| Overflowing Font | up to 10 |
| Sanctum | up to 15 |
| Blessed Host | up to 8 |
| Gift Given | up to 12 |
| Shared Release | up to 10 |
| Martyr's Joy | up to 6 |
| Wonder | ALL of it |
| Revelation | ALL of it |
| Rapturous Host | ALL of it |

Six of them pay her something useful for it, and three empty her completely.

**CORRECTED THE NEXT MORNING: shedding her Lust does not keep her in the form, it ENDS it.** This
paragraph first claimed the opposite. Recovery from Broken is `health + Temporary HP >= Lust`, tested at
the holder's turn start (`honeycomb.recoveryConditionMet`), so pouring Lust out is what lifts her back
out of the broken form and takes her stronger cards with it. Measured: Clemence broken at 40 Lust
against 35 standing, sheds 15 with Sanctum, and at her next turn start she is no longer broken.

So the nine cards above already carry their own cost, and it is a good one — each is a choice between a
big payoff now and staying in the form. **Nothing needs doing about them.** What is left of his note is
the healing numbers, which is the table above this one.

**NO NUMBER WAS MOVED.** How far to cut is his. See `../../playtest_55/SUGGESTIONS.md` for the one
recommendation this session would make, which is to cut the broken healing uplift from about 40% to
about 15% and leave the Lust-spending cards exactly as they are.

---

### P23. Suffer the Blows, and what Taunt should be ⏸ — NEEDS ONE DECISION FIRST

> Replace Take the Hit with new card: Suffer the Blows (rare) 0 cost, gain taunt equal to your tHP, gain
> 10 tHP per enemy.

> Change taunt to redirect damage done to allies to enemies

**These two are the same change and the second one has two readings, so nothing was built.**

**What Taunt is today.** A DURATION status: *"EVERY hit from the other side lands on this fighter
instead, sweeps included. Wears off at the start of their next turn."* Its stacks are turns, not a
quantity. `honeycomb.dealDamage` reroutes through `honeycomb.tauntWallFor` at the moment damage lands.

**Why the new card does not fit it.** "Gain taunt equal to your tHP" on a fighter holding 20 Temporary
HP would read as twenty TURNS of taunt. For the card to make sense, Taunt has to become a quantity — a
pool that soaks a number of points and then runs out.

**And that is what the second note seems to be saying, but it can be read two ways:**

- **Reading A — Taunt reflects.** Damage aimed at an ally is redirected onto the ENEMIES. Taunt becomes
  a reflect pool, and Suffer the Blows turns Brienne's Temporary HP into party-wide retaliation.
- **Reading B — Taunt keeps redirecting onto the taunter**, which is what it already does, and the note
  is only saying it should be a quantity rather than a duration.

**What it would cost either way.** Seven cards apply Taunt across four characters — Castling
(Anastasia), Rampart (neutral), Intercept, Challenge, Take the Hit and Shield Wall (Brienne), Relieve
(Cinder) — plus the `redirectsAttacks` flag on the status and the reroute in `honeycomb.dealDamage`.
Reading A also needs a new damage path, since nothing currently sends a hit back the way it came.

**`rework/cards/` S47 above is why this is being asked slowly.** Taunt has been retuned twice already:
*"Taunt redirected almost nothing, and now redirects everything."* A third pass built on a guess about
which reading he meant is how that happens a fourth time.

---

### P24. Frail is underpowered and does not feel right ⏸ — NEEDS HIS DIRECTION

> Frail is too underpowered as a status and doesn't feel good thematically

**What it is.** *"Gains reduced Temporary HP. Wears off at end of turn."* One stack multiplies Temporary
HP gained by 0.75, and it is a duration status, so it is gone at the end of the holder's turn.

**Why it is weak, in one line:** it is a 25% cut to one resource, for one turn, and only if the target
was going to gain Temporary HP at all. Against a fighter who gains none it does nothing whatsoever.

Compare its two neighbours, both of which also last a turn:

| Status | What one stack does |
|---|---|
| Weak | 25% less attack damage, always applies |
| Frail | 25% less Temporary HP gained, applies only if they gain any |
| Sundered | 25% more damage taken per stack, and now decays one a turn (P7 above) |

**The thematic half is his and is not guessed at here.** Frail names a body that breaks easily; what it
does is make a shield smaller. Those are not the same idea, which may be what he means by it not feeling
good. Whether Frail should become "takes more damage from the first hit each turn", or "cannot gain
Temporary HP at all this turn", or something else entirely, is a design call.

**One thing worth knowing before picking:** Sundered already owns "takes more damage", so a Frail that
increases damage taken would duplicate it. The space that is actually free is around Temporary HP and
healing.

---

### B34. The manual pass on the card pool ☆ — REVIEWED 2026-09-25, waits on his answers

> Ahoy! The current Honeycomb card pool was designed by AI, and while they went through a rework I think I've put off making a manual pass of them for too long now. Please read through the basics, then the mechanics and character story bibles. After that, please see OUTFITS-LIST.md where I go over a touch on mechanical identity.
>
> Honestly, I have no idea where to start here. I know that:
> - Some cards felt like they lacked a strong identity while playtesting, very few cards felt memorable.
> - Overall feedback is that is that there's too many nonsynergistic cards diluting the cool. We need more "glue" cards. Cards meant to bridge the archetypes together.
> - We need to actually lock costumes and ensure that the new card pool's least glue-ey, most selfish to their own sister archetype are locked with them
> - In generating their poses, Cinder and Clement came out with a much stronger "fire" identity than expected.
> - Cinder and Clement are widely regarded the weakest characters, not just in numbers but in team synergy.
> - I'd like for Cinder to move away from sundered and have some kind of burn for her status effect.
> - 15-21 starting cards in deck is a lot for a slay the spire-like
> - I'd like a similar amount of encounters per run to slay the spire, and 75 cards in each character pool in that game turned out pretty good. Granted, we have three characters instead of 1
> - I'm okay with accepting a huge slash to card pool sizes, making the sets we do have more interesting and reducing future art pass workloads.
> - Slay the Spire
>
> I think we need to take a look over the card pool as it is now. Remember, we're only doing design and plan work. I'd like you to take in the card pool and tell me what you think, don't just roll over and accept my choices immediately, but also don't glaze the current system overly either. Please take your time and avoid subagents if feasible.

**`POOL-REVIEW-02.md` is the answer**, measured on the live content. The short version: a character is
offered about 16 cards a run because rewards deal one slot per party member, so at 21 C / 11 R a common
comes round every other run and a rare almost as often as a common — the flat gradient, not the raw
count, is why nothing is memorable. Glue is structural here because two-thirds of every reward screen
belongs to characters the player may not be building. Proposed: 12 C + 8 R per character (base 6 + 2,
each alt +2 C, +1 cross-party R, +1 worn-only R), weights 85 / 15, a 15-card starting deck with a default
signature. **Blocked in practice on `../starters/` B1** (the alts are still `unlockedFromStart`). No game
code changed.

His second message, the same day:

> I'm onboard with trying out your ideas, and I'd be interested to see shere you'd take this. By the way, that final point was meant to be that Slay the Spire aims for 51 encounters, giving an idea of how much STS might leave un-shown of its card pool, just for reference.
>
> Since it dounds like they're blockinf, I'm on my phone right now, could you list out those  questions for me right here? Not sure how I feel about clement "extinguishing" flame from cinder onto enemies, sounds like it might be a very specific card that isn't settling in my head right, but I also wanna see you cook.

And his third, answering the seven questions:

> I'm with you on everything except burn. I'm just not feeling that design at all. I'd rather that the fire parallel had something to do with lust. I think I'd like to go with Heat as a status effect instead of burn. That'd keep clement's space solely in lust. Her doing HP damage at all doesn't feel thematic for me. Like, she's someone who believes in love with sin, her broken state has her ascending and seeing angels blessed with the gift of sight once again, and with this new freedom and power she... Lights her enemies on fire? I'm not feeling it. And while "I want to be broken" is Clement's thing, Cinder is probably the second closest to that space due to her theme of recklessness.
> Poison I keep meaning to make half after it activates, if it still doesn't already.
> I think it should have a different design space to poison, I also feel like it should have something to do with taking an action, I just don't have an idea I'm in love with yet, which is the biggest issue. Players are generally agreeing that lust buildup is way more dangerous than regular damage, so Cinder stepping into the self-damage space but from a different angle to Severine shouldn't make them feel too similar, still, I'm stumped, and this is a pretty important thing to figure out.

**Shape agreed (20 per character, 85 / 15, 15-card deck, one slot per member, neutrals in shops and the
boss slot, default signatures drafted for veto). Burn withdrawn.** `POOL-REVIEW-02.md` §5 is now **Heat**:
*whenever this fighter plays a card, they gain Lust equal to their Heat; loses 1 stack at the end of their
turn* — the price of recklessness paid per action, a producer for the "Lust on an ally" row the Abbess
line and Nettle's Draw Out already read, and worked-up enemies when vented onto them. Poison to
`decayMode: "halve"` is his standing instruction and is not yet applied (it reprices Nettle's appliers).

His fourth message, choosing the harsher variant and writing the rule himself:

> That harsher variant, that's it, I think that's exactly what it needs. It's the incentive for cinder to move back, it's the mechanical way players forcibly hold back Clement from breaking, it makes positioning matter the entire turn instead of just the end, it gives anastasia's golems a home in a party of 3, it lets players interact with it on their own terms unlike poison, it'd make an ability for cinder to move to the back of the party as useful as other abilities, it can be built up on characters without guarenteed payoff that would just make it feel like delayed damage. And it's even straightforward to explain. Heat: Inflicts 1 lust per stack of heat whenever the character plays a card. Players lose 1 heat whenever they are shifted towards the back of the party, or end their turn behind all other party members.

**Heat is LOCKED in his words** — `CARD-POOL-02.md` §2.1 carries the rule verbatim, his seven reasons as
requirements, and nine one-line defaults for the edge cases (paid before the card resolves; per card, not
per hit; abilities are not cards; broken forms are; per shift whatever the distance; golems count as party
members; enemies read the same sentence; it is a debuff; its Lust carries Torment). **`CARD-POOL-02.md`
§3.1 is Cinder's full list on it, drafted for his veto**: 12 C / 8 R, Sortie as the default signature, the
Ashfall passive swapped to "1 Heat at the start of her turn", twelve cuts each with a reason. Clemence next.

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../../FEEDBACK.md` instead)*
