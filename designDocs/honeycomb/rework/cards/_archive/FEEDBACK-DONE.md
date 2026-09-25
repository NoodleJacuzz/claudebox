# Card pool rework — finished feedback

Closed items from `../FEEDBACK.md`, quote and annotation together, newest first. Nothing here is open work.

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

---

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

---

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

### P22. Clemence heals too much, and can wash off her own Lust ☑ — CLOSED 2026-09-25 (his numbers landed session 55b)

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

**Closed 2026-09-25.** Session 55b cut the broken healing uplift from about 40% to about 15% (`../../../Archive/playtest_55/READ-ME-2.md` §3) and left the Lust-spending cards as they are. Her wider redesign is B18, and her 2026-09-25 grid is `../CARD-POOL-02.md` §3.2.

---

### P23. Suffer the Blows, and what Taunt should be ☑ — CLOSED 2026-09-25 (decided session 55b)

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

**Closed 2026-09-25.** Session 55b settled it: Taunt already sent a sweep onto the taunter (measured, 9 on Brienne against 3 each), so Taunt did not change; Suffer the Blows was built as a 0-cost rare (Gain 1 Taunt, then 10 Temporary HP per enemy), and session 55c made it give the Taunt first and made Breaking drop Taunt (`../../../Archive/playtest_55/READ-ME-2.md` §1 and `READ-ME-3.md`). It is Bastion's worn-only rare in `../CARD-POOL-02.md` §3.3.

---

### P24. Frail is underpowered and does not feel right ☑ — CLOSED 2026-09-25 (his design built session 55b)

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

**Closed 2026-09-25.** Frail was rebuilt on his own design in session 55b: healing and Temporary HP gained reduced by 25% per stack, one stack off at the end of the holder's turn, through a new `modifyHealingReceived` hook (`../../../Archive/playtest_55/READ-ME-2.md` §4).

---

### S57-1. Heavy Swing skipped its second hit at 16 Temporary HP — FIXED (session 57) ☑

> "The Heavy Swing seems bugged. I had 16 temp hp but he didn't do the bonus damage"

**Reproduced only with Thorns on the target.** Played headlessly at 16 Temporary HP into the first enemy of
every one of the 84 encounters, it hit twice every time, and on screen the two hits show as two separate
numbers about 0.3 seconds apart. With Thorns 7 on the target, the first hit bounced 7 back onto Brienne's
Temporary HP, leaving 9, and the "10 or more" question was asked after that, so the second hit was skipped.
Retort 3 on the target did not do it in the same test.

A player reads "If you have 10 or more Temporary HP" as the state when the card is played, so that is what
it now means. **New engine option: a condition marked `checkedAtStart: true` is answered before anything in
its effect list runs** (`honeycomb.resolveEffectArray`). Heavy Swing and Heavy Swing+ carry it. Nothing else
does: the other cards with a condition after a hit (Bloody Verdict, Coup de Grace, Stalk, Pounce, Scent of
Blood, Hot Pursuit, Longspear, Sortie) mean "after the hit", which is still the default.

Checked: at 16 Temporary HP into Thorns 7 it swings twice; at 10 twice; at 9 once. Suite block [137], and
removing the flag makes it go red.

### S57-2. Whetted Edge's upgrade and discount outlived the fight — FIXED (session 57) ☑

> "I got Whetted Edge again and still not fixed. Stay between fights. But only upgrade a card the first time it's used. Nvm it does upgrade but it's inconsistent."

The card says "upgrade it and reduce its cost by 1 **this combat**". Measured before the fix, on a Heavy
Swing in the deck: after one Whetted Edge it was **Heavy Swing+ at 0 energy in every later fight**. Two causes:

1. The upgrade effect upgrades a deck card for good; only a card made mid-fight was fight-long.
2. A fight's card copies ARE the deck's entries, and the cost cut (`costModifierArray`) was written onto
   the deck entry and never cleared. So every cost change "for the rest of the fight" was permanent.

"Inconsistent" is the first cause showing: a card Whetted Edge had already upgraded was at its top level,
so the next Whetted Edge on it could only take 1 off the cost.

Now: `upgradeTargetCard` takes `forThisCombat: true` (Whetted Edge sets it), which stores the level in a
separate `combatUpgradeLevel` on the card. `honeycomb.combat.fightOnlyCardFieldArray` lists every field that
must not outlive a fight (`costModifierArray`, `costOverrideArray`, `combatUpgradeLevel`,
`combatUpgradePath`), and they are removed from every deck card when a fight begins and when it is cleared.
Clearing at the start also cleans a save that already carries an old discount. The campfire's Sharpen still
upgrades for good.

Checked: during the fight the card is Heavy Swing+ at 0 energy; after it, Heavy Swing at 1; a leftover
discount written into the deck is gone when the next fight begins. Suite block [137]; removing the cleanup
makes it go red.
