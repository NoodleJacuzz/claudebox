# What happened overnight, 2026-09-21 into 22

Hope you're feeling better. I worked the 29 reports you left in `../FEEDBACK.md`'s inbox. **Nineteen are
fixed, six need one sentence from you, four are measured and waiting on numbers only you can pick.**

Suite: **2543 passed, 0 failed**, up from 2486. Every fix has a check behind it. `devPreviewTarget` is
back to `""`. **Nothing in any images folder was touched.**

Where to look: every quote of yours moved into its workstream's `../FEEDBACK.md` as items `P1` to `P29`.
The routing table at the bottom of `../FEEDBACK.md` says which folder each one went to.

---

## The six things that need you

Read these first. Everything else can wait.

1. **What should Taunt become?** (`../rework/cards/` P23) Your note says *"Change taunt to redirect damage
   done to allies to enemies"*, and that reads two ways: either Taunt reflects damage back at the
   enemies, or it keeps redirecting onto the taunter and you only mean it should be a quantity instead
   of a duration. **Suffer the Blows cannot be built until this is settled** — "gain taunt equal to your
   tHP" needs Taunt to be a pool, and it is a turn counter today. Seven cards across four characters
   move with the answer.
2. **How much of Clemence to cut?** (`../rework/cards/` P22) Her broken cards heal about 40% more than the
   cards they replace, right across her common line. The bigger thing I found: **nine of her broken
   cards let her pour out her own Lust**, three of them completely. Lust is what put her in that form,
   so she can currently keep the form and stop paying for it. Which of your three complaints to answer,
   and by how much, is yours.
3. **What replaces Copycat Quill and Spur of Embers?** (`../rework/starters/` P26) You said replace, not
   remove, and did not say what with.
4. **What should Frail do instead?** (`../rework/cards/` P24) One note: Sundered already owns "takes more
   damage", so Frail going that way would duplicate it. The free space is around Temporary HP and
   healing.
5. **How big should the Head Gardener be?** (`../rework/enemies/` P15) She loses 453 pixels off the top of
   your screen. She is scale 1.9, and no other enemy in the game is above 1.3 — the Matriarch, who is
   the other Act1-1 boss, is 1.0. I did not touch the number, because how big she should look is yours.
6. **Should act 1 fights last longer?** (`../rework/enemies/` P14) You said passives and poison cannot pay
   off. They cannot: the turn target for a normal act-1 fight is 3 to 4 turns. Raising it means
   restatting every encounter and enemy in the act, which wants an All the Crunch run behind it rather
   than an overnight edit.

---

## The fixes that mattered most

**The Sealed Door loop was real and I reproduced it.** Winning the fight put you back on the FIRST page
with "Draw the bolts" on it, forever. The event saves where you are so a refresh resumes, and the choice
that starts a fight returns before that gets written — so the saved position was still the page you
chose the fight FROM, and it beat the victory page. Fixed and checked both ways.

**The Whetstone was being spent by a card in your hand.** It gives +2 on the first attack each turn. The
live number printed on a card goes through the same damage pipeline the real hit does, deliberately, so
a card can't lie about what it will do — and the hand is redrawn every beat, so the charge was gone
before you could play anything. Previews now ask without spending. It was the only hook in the game with
that shape; I scanned for others.

**The treasure chest was ignoring every relic gate.** The Cracked Ampoule already said "Nettle in the
party". The chest built its own list and never asked, so it could hand out all **twelve** character-gated
relics to anybody — half the pool. It draws from the same list the fight reward uses now.

**Ransom was taking Temporary HP it could not pay for.** With 1 to 3 tHP it took everything and gave
nothing at all; with 5 to 7 it took the remainder for free. It now spends in blocks of 4 and leaves the
rest. Three other Brienne cards have the same shape but say "spend all", so I left them and flagged them.

**Your map paths only ever branched one way.** The edge fan alternates +1, -1, +2... and the maximum is
two edges, so the negative side was literally never reached. Measured before: 22.3% of branches went one
way and 4.7% the other, and that 4.7% was the orphan repair, not the fan. Now 15.2% and 12.3%. Your 95/5
estimate was a good read.

**"Sundered reads {damageincreasePercent}%"** — you were quoting what the game showed you. The keyword
panel on a card read the status's raw text while the status icon's tooltip filled the number in. Six
statuses were printing a token at players.

---

## The early game

I built the **opening tier** you asked for. Every act1-1 "early" encounter was three enemies at the same
budget — Moth Light, the one you were handed first, is the exact target, not an outlier. The first three
rows now roll one- and two-enemy fights at about 70% of the budget, priced properly rather than
eyeballed: an opening fight assumes zero drafted cards, because a party on row zero has drafted nothing.

Regions with no opening content step down to their own early pool, so nothing else changed.

**What I did not do is the other half of what you said** — longer fights and denser maps. That is item 6
above.

---

## Two things I should flag

**`../tools/generate-progression-trees.js` is stale and I got caught by it.** I ran it to reprice Vigour and
it replaced each character's whole node list, silently reverting four pieces of hand-edited content —
including Brienne's Counterguard going back to Taunt. The suite caught one of the four. **The other
three had no test at all.** Everything is restored, all four now have checks, the tool has a banner on it
and `../tools/README.md` says not to run it. Worth knowing before anyone runs it again.

**I made one judgement call you may want to reverse.** "Starting common relics don't show on artifact
list" — nothing in the game grants a relic at run start, so I read it as the heirloom equipment each
character starts wearing, which the relic window never showed. It has an Equipment section now. If you
meant something else, it is one edit to undo.

---

## Everything else that landed

- Mulligan Stone is no longer offered when the run has no reroll pool.
- Region 1 is **The Mushroom Frontier**. Its colours and backdrop are still painted for water, and I left
  those for your eye. *Myconid Navel* is still in ../BASICS.md — if that was meant to be this region's
  title rather than the act's, say so.
- Chests capped at three a region: across 150 maps, no path can reach four. Average per path fell from
  3.09 to 2.00.
- Every map starts on a rest node.
- Ordinary fights pay no relic. Bosses, elites, shops always; chests and events by chance.
- **Act1-1 ends in three boss nodes**, one per Act1-2 route, and every node on the rest row before them
  reaches all three. Over half of runs used to arrive with no choice left.
- A boss node names its boss, its health and where beating it leads — only once you have met it.
- Sundered loses a stack at the end of the holder's turn. **Your two notes about it disagree** — the text
  you quoted ends on "Does not fade". I followed the behaviour change and rewrote the sentence.
- Personal EXP tripled, and **golems were taking shares of it and paying them to nobody**, since a golem
  has no character behind it.
- A rank of Vigour on Brienne costs 4. The rule is the node costs about 25 whoever holds it, divided by
  its ranks — which also keeps Nettle's single rank at 25, the thing round 08 was fixing.
- The shop shows every party member's HP, Temporary HP and Lust.
- Trip Line is 88 characters instead of 151. A flavour line was being printed onto intent cards; eleven
  enemy moves were doing it.
- Anastasia has an Earthling tag, category `origin` so it sits beside human rather than replacing it.
- Clemence's description now says she is aiming at Breaking rather than enduring it.
- `../rework/starters/RELIC-REWARDS.md` is the relic document you asked for. Its short answer: **no relic in
  the game grants a reroll or a banish.** Every one comes from a progression node.
- "Enemies turn around while attacking" is not the mirror and not the animation — I checked both, and
  nothing in the game even opts into mirroring. It is the `-offense` drawings facing the other way for
  some enemies, which needs eyes on the files rather than a script.
