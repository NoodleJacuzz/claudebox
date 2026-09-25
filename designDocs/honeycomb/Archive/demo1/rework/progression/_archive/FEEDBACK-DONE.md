# Progression rework -- finished feedback

Closed items, quote first. The open queue is `../FEEDBACK.md`.

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

### S59-1. Fortitude is free, and says what it costs you — DONE (session 59) ☑

> Fortitude needs to cost 0, and the description should make it clear you're missing out on lust events.
> In the future I'll use a filter to check if any character in the active party has fortitude and use that
> to replace any nsfw with sfw content.

All seven Fortitude nodes cost 0 and carry `free: true`. The old text, "Lust weakness ranks do not
build.", was also not quite true, because rank 1 still builds. The new text is "Nettle's Lust weaknesses
never rank past the first, so Nettle misses every Lust Event from rank 2 up." (with each character's own
name). Node text never says "she", which suite block [93] enforces.

`tools/audit-trees.js` rule H9 used to fail any node that cost nothing. It now accepts a node marked
`free: true` and still fails any other zero. The tree generator (`tools/generate-progression-trees.js`)
was changed the same way, so a future run keeps Fortitude free.

The tree shows "Free" instead of "0 XP", and the node's price line reads "Free.". Checked in the browser:
Fortitude buys for 0 XP and takes effect. Suite block [141].

The SFW filter he describes is future work and nothing was built for it.

### S60-2. Fortitude means no Lust weakness at all — DONE (session 60) ☑

> Please let me restate I need fortitude to be that the player is "missing out on lust events". Not
> stopping at rank one. If the player equips fortitude I (eventually) want them to see nary a single breast.
> No lust weakness building.

While a character owns Fortitude:
- Her weakness ranks read 0 (`honeycomb.lust.rankFor`).
- Nothing builds: not Lust in a fight (`recordExposure`), and not an event (`addExposure`).
- Lust hits her at the plain rate (`vulnerabilityMultiplier` is 1).
- She is never owed a Lust Event (`lustEvents.isReady`).
- The Weeping Bloom never appears for her.

The ledger is kept rather than wiped, so giving the node back restores where she was. All of these ask one
helper, `honeycomb.lust.hasFortitude`. The text is now "Nettle's Lust weaknesses never build, and Nettle
misses every Lust Event." The SFW filter he describes is still future work. Suite blocks [141] and [99].

### S60-3. Fortitude is open from the start, beside Vigour — DONE (session 60) ☑

> Also, I realize a huge flaw with placing fortitude as the second node unlockable, it's still too late. It
> needs to be unlockable for free right away alongside vigour so the player can eventually have a sfw
> experience. I may someday just straight up replace it with a sfw mode, but that's extremely distant.

All seven Fortitude nodes have no prerequisite, so a brand new profile can buy one for 0 XP. Checked in the
browser on a fresh profile. `tools/audit-trees.js` rule H2 (exactly one root) now counts a `free: true`
node apart, so Fortitude does not count as a second root, and rule H5 walks from it too. The tree
generator leaves Fortitude without a prerequisite.
