# Progression rework — FEEDBACK

The six per-character trees: what a node does, what it costs, and what it hands out.

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

### B23. Early deck-customization pricing ☐

> Early deck customization is more dangerous than I realized. Remove attack and remove defense need to
> be expensive nodes, extra attack and extra defense though can be very cheap.

| Node | Price |
|---|---|
| Remove attack | expensive |
| Remove defense | expensive |
| Extra attack | very cheap |
| Extra defense | very cheap |

The asymmetry is the point: **thinning a deck is far stronger than padding it**, so subtraction gets
priced like a payoff and addition gets priced like a convenience. This is progression-tree pricing and
lands in the same pass as B4. Prices are numbers — `honeycomb-tuning.js` or a named field on the node's
content-table entry, per the standing rule.

**VERIFY** that these four node types exist as distinct authored nodes rather than as one generic
deck-edit node.

---

### B4. Distribute unlockables through the game ☐

`progressionArray` with global/personal pools, ranked/exclusive nodes and `unlockOutfit` is the seam.
What is missing is authored nodes naming cards, outfits, equipment and relics. Overlaps B1, and now
carries **B22's relics** and **B23's repricing**.

### P16. Triple personal EXP, and golems take none of it ☑ — DONE SESSION 55

> Triple personal EXP gained, divide it across -player characters- in the roster (no golems). This makes
> solo play better.

Both halves are done, and the second one was a bug rather than a preference.

**The golems.** A summoned combatant is pushed into `run.partyArray` like anybody else, so
`honeycomb.progression.payPersonal` was splitting the award with Anastasia's pieces. Worse, a golem is
built from an ENEMY definition, so it has no `characterIndex` at all, and the share it took was paid to
nobody. A fight that ended with two golems standing paid three fifths of its experience into a hole.

`honeycomb.progression.personalShareArray` is the list that gets paid now: a member of `run.partyArray`
with a `characterIndex`, not summoned and not temporary. Checked with a golem standing in a
three-character party: three shares are paid, every one of them to a real character, and they add up to
the whole award.

**The tripling.** `tuning.progression.personalExperienceMultiplier` is 3, read inside `payPersonal`, so
every source moves with it: discoveries, the run-victory payout and the `gainExperience` effect. The
GLOBAL pool is untouched; `experienceMultiplier` beside it is still 1 and still means the global one.

What an award of 30 pays now, on fresh characters in their default outfits (which carry a +20% of their
own, so these are 30 × 3 × 1.2):

| Party | Each member gets |
|---|---|
| Solo | 108 |
| Two | 54 each |
| Three | 36 each |

---

### P17. A rank of Vigour costs what the node costs, divided by its ranks ☑ — DONE SESSION 55

> One rank of Vigor on Brienne should not cost the same as a rank of it on Nettle, since brienne has 6
> ranks, it should cost 4 exp.

**This reverses half of FEEDBACK-08, and the new rule satisfies both complaints.** Round 08 made Vigour
cost a flat 25 per rank so that Nettle, who has one rank, would not pay six ranks' worth for 5 Max HP.
That fixed Nettle and left Brienne paying 150 for the same node. Pricing the NODE at about 25 and
dividing by the ranks answers both:

| Character | Ranks | Was | Now | Whole node |
|---|---|---|---|---|
| Brienne | 6 | 25 | **4** | 24 |
| Severine | 3 | 25 | 8 | 24 |
| Cinder | 3 | 25 | 8 | 24 |
| Clemence | 3 | 25 | 8 | 24 |
| Cassadora | 2 | 25 | 13 | 26 |
| Anastasia | 2 | 25 | 13 | 26 |
| Nettle | 1 | 25 | 25 | 25 |

4 for Brienne is his number, and it falls out of 25 ÷ 6 rather than being typed in.

**Max HP is now very cheap for the characters with the most of it.** Brienne buys her whole +30 for 24
experience where it cost 150. That is the point of the change, but it is a large buff to the character
who already had the most health, and nothing else was repriced to sit beside it.

**THE TREE GENERATOR WAS NOT USED FOR THIS, AND MUST NOT BE.** `../../tools/generate-progression-trees.js` is
stale: it replaces each character's whole `nodeArray`, and running it reverted four pieces of
hand-edited content in one second — Brienne's Counterguard node went back to being Taunt, and three
descriptions went back to older wordings. Only Counterguard had a test. The seven costs above were
edited into `honeycomb-content-characters.js` by hand instead, the four reverted pieces were restored,
and all four now have checks in suite block [129]. The generator carries a banner saying so, and
`../../tools/README.md` says not to run it.

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../../FEEDBACK.md` instead)*
