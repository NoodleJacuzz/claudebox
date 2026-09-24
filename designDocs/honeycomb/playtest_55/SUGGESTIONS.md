# One suggestion per open item

**ANSWERED AND LARGELY BUILT, 2026-09-22.** Noodle went through this page and decided every item. What
he chose is not always what is recommended below — Taunt needed no change at all, Frail went a different
way, and the Head Gardener's scale was measured rather than left open. **`READ-ME-2.md` in this folder
is what actually happened.** This page is kept as the reasoning that was put to him.

---

You asked for a suggestion for each thing left open, so you can say yes instead of leaving it sitting.
**Each of these is one recommendation, not a menu**, and each is written so it can be built from this
page without another conversation. Where I think leaving it open is genuinely better than any answer I
can give, I say so rather than inventing something.

Order is what I think is worth doing first.

---

## 1. Taunt, and Suffer the Blows

**Recommend: make Taunt a pool of damage measured in points, and have it redirect onto the taunter, not
onto the enemies.**

What Taunt is now: a duration status. One stack means every hit from the other side lands on the taunter
instead, and it wears off at the start of their next turn. Stacks are turns.

What I would change it to:

> **Taunt.** While a fighter holds Taunt, a hit aimed at any of their allies lands on them instead. Each
> point of damage taken this way spends 1 Taunt. When it runs out, Taunt is gone.

Then "gain taunt equal to your tHP" means something, and Suffer the Blows is buildable exactly as you
wrote it.

**Why not the literal reading of your other note.** You wrote *"Change taunt to redirect damage done to
allies to enemies"*, which reads as the damage being sent at the enemies. I am recommending against it,
and the reason is that Suffer the Blows would then be the best card in the game by a distance. At three
enemies it gives Brienne +30 Temporary HP and a 30-point pool that converts every incoming hit into
damage on the attacker, for 0 energy. That is a rare that wins the fight on its own.

**If you did mean reflection, the safe version is to reflect a SHARE.** Half the redirected damage goes
back to the attacker and the taunter takes the rest. Say the word and I will build that instead — it is
the same work.

**What it costs either way.** Seven cards carry Taunt and all seven need a points value instead of "1".
My proposed numbers, set low so Suffer the Blows is the payoff:

| Card | Owner | Now | Proposed |
|---|---|---|---|
| Intercept | Brienne | 1 Taunt | 6 Taunt |
| Challenge | Brienne | 1 Taunt | 8 Taunt |
| Shield Wall | Brienne | 1 Taunt | 12 Taunt |
| Castling | Anastasia | 1 Taunt | 6 Taunt |
| Relieve | Cinder | 1 Taunt | 6 Taunt |
| Rampart | neutral | 1 Taunt | 6 Taunt |
| Take the Hit | Brienne | 1 Taunt | replaced by Suffer the Blows |

Plus: Taunt becomes an intensity status with no decay, since the pool is the limit rather than the
clock. `honeycomb.tauntWallFor` spends the pool at the moment damage lands.

**Suffer the Blows, as you wrote it**, with the one thing you did not specify settled:

> **Suffer the Blows** — rare, 0 energy. Gain 10 Temporary HP for each enemy. Then gain Taunt equal to
> your Temporary HP.

The order matters and you did not say which way round: I would gain the Temporary HP FIRST, so the card
is worth playing on an empty bar. Played on a fresh Brienne against three enemies that is 30 Temporary
HP and 30 Taunt.

---

## 2. Clemence

**Recommend: cut the broken-form healing uplift from about 40% to about 15%, and change nothing else.**

**I got this wrong last night and have corrected the entry.** I wrote that her being able to pour out
her own Lust was how she kept the broken form without paying for it. It is the opposite. Recovery is
`health + Temporary HP >= Lust`, tested at her turn start, so shedding Lust is what lifts her OUT of the
form and takes her stronger cards with it. I measured it: broken at 40 Lust against 35 standing, sheds
15 with Sanctum, and at her next turn start she is no longer broken.

So those nine cards are good design already — each is a choice between a big payoff now and staying in
the form. **Leave them alone.**

What is actually left is your first two complaints, which are numbers. The uplift as it stands:

| Whole | Broken | Now | Proposed |
|---|---|---|---|
| Mending Word 7 | Fevered Word | 10 | 8 |
| Lay On Hands 4 / 6 | Benediction | 7 / 8 | 5 / 7 |
| Mercy 10 | Tender Mercy | 14 | 12 |
| Anoint 12 | Last Anointing | 16 | 14 |
| Fallen Vigil 5 (+5) | Keep Faith | 7 (+7) | 6 (+6) |
| Answered Prayer 7 | Prayer Unbound | 10 | 8 |

That leaves being Broken clearly better without being a 40% across-the-board upgrade on top of
everything else the form gives her. It is twelve numbers in one content file and it is trivially
reversible.

**On "too much healing allies" generally:** I would do the above first and play it before touching her
whole numbers as well. Two cuts at once and neither of us will know which one did it.

---

## 3. Frail

**Recommend: Frail becomes the exact inverse of Plated.**

> **Frail.** Takes 1 more damage from each hit, per stack. Wears off at the end of the holder's turn.

Plated already reads *"Takes 1 less damage from each hit per stack"*, so this is a status the game
already has the shape of, and the two read as a matched pair.

**Why this and not something around Temporary HP.** It fixes both halves of your note at once. A frail
body breaking more easily is what the word means, which is the thematic complaint. And it always does
something — the current Frail does literally nothing to a fighter who was not going to gain Temporary HP
that turn, which is the underpowered complaint.

**It does not duplicate Sundered.** Sundered is a percentage and rewards stacking it before a big hit;
Frail is flat and rewards it against many small hits. Against a 3-hit flurry, one Frail is worth 3
damage and one Sundered is worth about 25% of one hit.

**Keep the old effect as a second line if you want the name to keep its current job:** "and gains 25%
less Temporary HP". I would not. One status should say one thing.

---

## 4. The Head Gardener, and every sprite drawn off the screen

**Recommend: fix the height cap in CSS rather than retune eight scale numbers, and let me show you a
before-and-after first.**

The cap already exists and has never worked. `.hcFighterArt` carries `max-height` as a percentage, and
its containing block has no definite height, so the percentage resolves to nothing. That is why a sprite
is governed by its width, and why a drawing on a differently shaped canvas comes out a different height.
The Head Gardener is on a 1300x1300 square where the shared canvas is 832x1216, which is most of why she
is 453 pixels off the top at scale 1.9.

Fix the cap and every one of the twelve overflowing sprites is bounded at once, including the ones
nobody has reported yet, and your 1.9 stops being dangerous.

**I would not guess her scale.** Setting her to 1.2 would bring her on screen and would also make the
Act1-1 boss smaller than the Pale Dray, which may be wrong for her.

**What I would do if you say yes:** build the CSS fix, run `../tools/audit-sprite-fit.js` at your window
shape before and after, and send you the two tables plus a screenshot of her fight. If the cap makes her
look wrong, then we pick a number, with the picture in front of us.

**The Hollow Champion sitting too far right is the same fix.** He is 20 pixels past the edge at scale 1.25.

---

## 5. Act 1's pace and density

**Recommend: raise the act-1 normal fight from 3-4 turns to 4-5, hold the health cost where it is, and
make combat nodes denser. Then prove it with an All the Crunch run before either of us believes it.**

The three numbers:

| Setting | Now | Proposed | Effect |
|---|---|---|---|
| `turnTargetArray[0].normal` | 3 to 4 | 4 to 5 | fights last longer, so poison and passives get turns to work |
| `netDamageFractionArray[0].normal` | 0.10 | 0.10 | unchanged, so a longer fight is not also a deadlier one |
| `nodeWeightArray` combat | 45 | 52 | more fights per map |
| `nodeWeightArray` event | 22 | 18 | where the density comes from |

Holding the health cost while raising the turns is the part that answers your note. The same total damage
spread over five turns instead of three is less damage per turn, which is what makes a grind build
survivable, and the extra turns are what let poison tick.

**This restats the whole act.** Encounter health is output times turns, so every region-1 encounter and
every enemy in it moves. That is real work, but it is mechanical — `../tools/enemy-template.js` prints
exactly which entries fall outside the new budget and by how much.

**I would not ship it on the audit alone.** `../tools/balance/all-the-crunch.js` plays whole runs through
the game's own screens; an overnight run before and after is what would say whether burst is still the
only option. That is the check this change needs and it is the reason I did not just do it.

---

## 6. Copycat Quill and Spur of Embers

**Recommend: replace them with the two relics the pool is actually missing — a reroll and a banish — and
drop the character gates.**

`RELIC-REWARDS.md` found that no relic in the game grants a reroll or a banish. Every one comes from a
progression node, so a player who has not bought those nodes can never reroll a reward at all. Your two
dead slots are exactly the right size for it.

Effects, which are the part I can propose:

> **(uncommon, ungated)** — When found, gain 1 reroll for this run.
>
> **(uncommon, ungated)** — When found, gain 1 banish for this run. Banishing a card also pays 25 gold.

Both are one table entry and neither needs an engine verb.

**Dropping the gates is deliberate.** Twelve of twenty-five relics name a character, which is half the
pool, and it is why a duo or solo run sees so little of it. These two would be found by everyone.

**The names are yours and I have not written them.** Naming a relic is writing for the game.

**Knock-on, in your favour:** a reroll relic makes the Mulligan Stone reachable again. It is gated off a
default run at the moment because there is no pool for it to refill.

---

## 7. Enemies turning around while attacking

**Recommend: I generate a contact sheet of every enemy's two poses side by side, you scan it once, and
tell me which ones are wrong.**

I ruled out the two things code could be blamed for. Nothing in the game opts into mirroring, so the
flip can never fire, and the acting animation is a translate and a scale with no `scaleX`. What is left
is that some `-offense` drawings face the other way from their `-combat` drawing.

No script can tell which way a drawing faces. But fifty-two pairs is about a minute of your time if they
are laid out in a grid, and a lot longer if you open them one at a time.

**I would write it to `tools/` as a one-page HTML bench, not into the images folders**, and it reads the
files without touching them.

---

## 8. Region 1's colours, and Myconid Navel

**Recommend: tell me which name you want, and let me propose a palette off the enemy art rather than
inventing one.**

The region is The Mushroom Frontier now, from your note. But `BASICS.md` still has you titling the live
act 1-2 *Myconid Navel*, and I could not tell whether that was meant to be this region's name or the
act's. **One word from you settles it.**

The colours are the part I would not guess at. They are cold blues (`#1b2f3a` and `#0e1720`) and the
backdrop anchors are called `northPier` and `southSteps`, all painted for water this region no longer
has. If you want, I will pull the dominant colours out of the five enemies who actually stand there and
send you three palettes to pick from. That is measurement rather than taste, and you still choose.

---

## 9. Two small ones I would just do

**The other three Brienne cards with Ransom's shape.** Pay the Toll, Tribute and Incredible Wealth all
spend ALL her Temporary HP and pay per block of 4, so 3 Temporary HP into any of them is 3 gone for
nothing — the same complaint your tester made about Ransom. **I would leave them.** "Spend all" is a
different promise from "spend up to 8", and dumping Temporary HP is the whole of her tithe archetype.
Worth knowing they exist, not worth changing.

**"There should never be duplicates" on chests.** I read it as two chests back to back on one path and
blocked that. Duplicate relics were already impossible. If you meant something else, say which and it is
a small fix.

**And the one I would like confirmed:** "starting common relics don't show on artifact list" — I read it
as the heirloom equipment each character starts wearing, because nothing in the game grants a relic at
run start. The relic window has an Equipment section now. If you meant something else, it comes straight
back out.
