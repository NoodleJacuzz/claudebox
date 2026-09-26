# Enemy overhaul — INFERENCES

Choices made **without Noodle**, and how to pivot each one. A brief holds rules, a status holds
progress, and this holds guesses — `../BASICS.md`, "A standing brief never accumulates progress".

Every entry names the cost of reversing it, because a guess that is expensive to undo should have been
a question instead.

---

## I1. The shield reference is an img2img SOURCE, not a shared sprite

**Guessed session 44**, answering the ⚠ E6 raised.

E6 said *"use the shield sprite"*, and `refsPNG/enemies/shield.png` is already the Bark Sentinel's
drawing. Two readings: the Sporeguard and the Sentinel share one picture with a recolour, or the file
is the img2img source for a second, different drawing.

**Took the second.** The two are both fielded in Region 1 and can stand in the same line-up
(`barkWall` and `labGuard` field the Sentinel; `alchemistBench` and `rotHost` field the Sporeguard), and
the whole of E1 is that enemies differing only by a prop read as one enemy. The separation is written
into the Sporeguard's table entry: the Sentinel is bark and rooted and *is* its shield, wide and low;
the Sporeguard is upright and narrow and *carries* one, with the cap breaking the helmet line.

**To pivot:** cheap. Point the Sporeguard's `artFolder` at `shield` and drop `artOwed`. One line, and
the art pipeline saves a drawing.

---

## I2. ~~"An elite enemy down here" describes the Salvager's fiction, not his `role`~~ — WRONG

**Guessed session 44, and Noodle overturned it the same session:**

> Scrap salvager's definitely an elite.

It described the role. Built as E10 describes: role `elite`, 64 → 135 health, two elite encounters of
his own, and six encounters rebuilt around him.

**The lesson worth keeping.** The guess was flagged, priced as expensive to reverse, and carried as an
open question rather than buried — which is exactly why reversing it cost one exchange instead of a
session. A guess that is expensive to undo should be *visible*, not avoided.

---

## I3. The Lust lift is threat-neutral by construction

**Chosen session 44** rather than asking, because `ENEMIES.md` already said numbers are out of scope
for this folder.

E3 needed roughly twice as many Lust moves, and the budget tools count Lust **as damage**. Raising the
share by adding Lust would therefore have made every enemy carrying one harder — a stat change made
sideways, which is exactly what "numbers are not in scope" forbids. So six of the thirteen changes
**convert** damage into Lust 1:1 and the rest go into slack a boss or a support already had.

**To pivot:** if `../enemies/` decides Lust should be worth less than damage point-for-point,
the conversions are the thing to revisit and the ratios are all in `../Archive/demo1/enemy_overhaul/RECAST-01.md` §E3.

---

## I4. Torment stays at zero moves

**Chosen session 44.** Five lust tags are registered; the roster teaches four.

Adding Torment moves is free in authoring terms *only if* Torment survives the tag cut. It probably
should not: `lust_events/` B20 is cutting to 2–3 tags per character precisely because each tag costs
7 characters × 3 ranks = 21 scenes, and `exposureDecayPerGrowth: 0.5` means a wide vocabulary erodes
itself. Giving Torment its first enemy moves now would be lobbying for it to survive a cut this folder
does not own.

**To pivot:** trivial. It is a `tagArray` on whichever moves should teach it.

---

## I5. The Head Gardener keeps her name

**Chosen session 44.** E1 named four supports; she is a boss and not among them, and her entire kit is
gardening (Shears, Graft, Plant, Overgrow). Renaming her means rewriting a boss's move list, which is
more than E1 asked for — and she still reads correctly once the four supports become species, because
she is then the only actual gardener rather than one of five.

**To pivot:** moderate. One `name:`, plus five move names to keep her kit coherent.

---

## I6. Encounter names were recast; the region's name was not

**Chosen session 44.** Both are "titling", so the line between them needs stating: sixteen encounter
names were changed here because they name the **enemies** this folder just recast ("Toad Pond" with no
toad in it), and the region's name, description, colours and backdrop were left because
`../BASICS.md` records Noodle choosing **Myconid Navel** and `map/` owns act structure.

**To pivot:** cheap either way. If encounter names should have gone with the region, they are sixteen
string literals in one file.

---

## I7. Act1-A's two most-fielded bodies teach no lust tag at all

**Chosen session 44, second pass**, and it overrides a line from session 42.

`ENEMIES.md` said *"every enemy should be able to answer which Lust tag it teaches"*. That is a
session-42 gloss, not a Noodle quote, and following it put Lust on the Shieldcap and the Bolete Hook —
the two bodies Act1-A fields most, at six line-ups and three. The result was a **Restraint theme** for
the sub-act the story bible describes as *"much less focus on lust"*, competing with the identities
Act1-B and Act1-C are supposed to arrive with.

The quote outranks the gloss, so both went back to dealing none. They are the only two silent enemies
in the bestiary and the suite pins that number at two.

**To pivot:** trivial — the two moves are `crawlerScuttle` and `toadTongue`, and each takes a
`tagArray` and a `lust` entry. But re-read `../designBibles/story.md` §4 first: whatever tag they took
would become Act1-A's identity, whether or not that was intended.

---

## I8. Three Act 1-1 lust tags were chosen to break a monoculture, not from the fiction first

**Chosen session 44, second pass.** The first pass tagged six additions Venom because spores are
venom, which is true and which produced nine Act 1-1 line-ups teaching venom alone — an Act 2 pattern
(`../designBibles/mechanics.md` §5) that also pre-spends Act1-B's identity.

Three moved. Each has a fiction that genuinely supports the new tag — a slime mould holds you
(restraint), the Alchemist is enjoying herself rather than doing anything to anybody (charm), acidic
spore-sludge takes your gear off (exposure, and it is the cargo cult's own kit list) — **but the
spread is why they were looked at.** Honest about the order: the constraint came first, the
justification second. All three are defensible; none was the only possible answer.

**To pivot:** cheap, one `tagArray` each. The constraint they satisfy is enforced by the suite — no
tag may hold more than half the roster's lust moves — so a replacement has to keep that true.

---

## I9. The Salvager's rarity was a consequence, not a decision

**Session 44.** Promoting him to elite took him from three normal line-ups a run to 14% of runs, the
rarest non-boss in the game. Nobody asked for that number; it fell out of the role change.

It is defensible — a trespasser from another act should be rare, and the Variety law wants low
discovery rates — but it is a large swing and it is flagged in `../Archive/demo1/enemy_overhaul/_archive/FEEDBACK-DONE.md` E10 for
Noodle to look at.

**To pivot:** add a second middle-tier elite encounter. R2's *late* elite tier fires in 0.07 fights
per run, so adding there would do almost nothing.

---

## I10. A boss that is two bodies got its own ROLE rather than two half-marked bosses

**Session 45, E7 Stage 2.** Act1-B's boss is the two sisters in one encounter, which Noodle asked for
by name. `tuning.balance.enemyRoleArray` had no way to express it: graded as two whole bosses each
sister reads about a hundred health short, and written to a whole boss each the encounter carries
twice a boss's budget and becomes the hardest fight in the demo by a distance.

**Added `bossHalf`** — `healthShare: 0.45, damageShare: 0.5, group: "boss"`, exactly half of `boss`, so
a pair of them sums to one boss's fight. Both sisters now read ✓ on `enemy-template.js` and so does the
`arborTwins` encounter. It is positioned immediately BEFORE `boss` in the array because
`honeycomb.enemyDifficultyRank` ranks by position and the bestiary reads weakest first.

**This is the one place E7 touched a file `../reference/LANES.md` gives to lane ANA.** The compendium's
`enemyGroupHeadingArray` in `honeycomb-scene-title.js` has to cover every role the balance template
declares or an enemy written to a new role lands silently in "Other", and the suite checks it. One
additive line, inside an `E7` banner, with a note in it addressed to lane ANA.

**To pivot:** cheap but not free. Delete the `bossHalf` row, its heading row and set both sisters back
to `role: "boss"`; the fight does not change, but both bodies read ▼ on the template forever and the
next session has to be told why.

---

## I11. The two new regions were NAMED, because the table needs a string today

**Session 45, E7 Stage 1.** `regionArray` entries carry a display `name`, and the two stubs had to have
one before anything could render. The story bible names Act1-C — *"The Pollen Road"* — so that one is
Noodle's. **Act1-B is not named anywhere**; the bible calls it "Flora", which is a workstream label
rather than a place a character would stand in.

**Guessed "The Thorn Arbor"**, to sit beside "The Upper Catacombs" and "The Flooded Vault": an arbor is
a structure made of growing things, and the thorns are what the route actually fields.

**To pivot:** one field. `name:` on the `flora` entry in `honeycomb-content-map.js`. The `index` stays
`"flora"` whatever it is called — it is route-table and save data, exactly as `"floodedVault"` stays
`"floodedVault"` while `map/` B31 renames it to Myconid Navel.

---

## I12. Which five of Act1-C's seven candidates were built

**Session 45, E7 Stage 2.** `v13 spire images/_source/enemy inspo variants/assigned/ASSIGNED.md` offers seven Act1-C sources for five normal slots. The two
fencers are fixed — Noodle asked for the pair by name — leaving three slots for five candidates.

**Built** `mushroommadame-b` (Mantlewing, tank), `spookytall-d` (Longwing, caster) and `jellyfairy-b`
(Soakcap, support), because with the two fencers as soldier and striker those three complete a role
spread with no duplicates, and because all three are *lounging* rather than fighting, which is the
sub-act's whole thesis.

**Not built:** `beenoble-a` (a third duelist, and the road already has two) and `tophatfairy-c` (a fey
noble in a top hat — the most characterful image of the five, and the one most likely to read as
Act 3's tidiness if handled carelessly, which the guardrail forbids).

**To pivot:** both are additive. A sixth normal is a table entry plus a line-up; neither displaces
anything already written, and `tophatfairy-c` is the obvious first elite for the route if it ever wants
one.

---

## I13. ~~The two bodies with no drawing left act 1-1's pool~~ — WRONG PREMISE, CORRECTED 2026-09-26

**Chosen session 66** and undone the next day. The bench was argued from the enemy table's comments,
which still say the Glowcap and Witch's Butter have no drawing; `honeycomb-sprite-metrics.js`, generated
from the image folder, says both have their own since the 2026-09-21 pass. The flexibility rule makes
drawn art the fixed point, so the draft now fields the Glowcap (The Lamp and the Brute) and puts the
Witch's Butter drawing on the Glutton (`artFolder: "moldshaper"`), leaving only the Butter's *kit* on the
bench. **The lesson:** the sprite metrics are the record of what is drawn; a table comment is a note from
the session that wrote it.

**To pivot:** one line-up and one `artFolder`.

## I14. Both Fencers left the commons together

**Chosen session 66.** B36 says the Argent Fencer was to be saved for a two-enemy elite with the Sable
Fencer, and the assignment note says the pair reads as one enemy met separately. Pulling only the Argent
would have left the Sable as a common body that then reappears in the elite pair. Both went, and the Road
gained a lighter duelist in their place (the Courtier, from `beenoble-a`).

**To pivot:** the Sable Fencer is a soldier at 67, exactly the weight the Road's early pairs are short of;
one line-up puts him back. The elite pair is S64-2's to build either way.

## I15. `tophatfairy-c` came back as a common single fight, not an elite

**Chosen session 66.** I12 called it *"the obvious first elite for the route if it ever wants one"*; E13
records it assigned as **a normal on the Pollen Road**, in his words. The draft reads E13 over I12 and
makes it the Road's `lone`: one body at 128 health, elite-sized and common-priced, met alone at the end of
the route. That is the most an ordinary fight can make of the most characterful drawing in the folder.

**To pivot:** cheap. Its entry moves to `role: "elite"`, its fight to `isElite: true`, and the Road's late
band wants another single body.

## I16. Grapples carry Heat rather than nothing

**Chosen session 66.** E14 retags eight Restraint moves *"by region"*. Three of them are grapples on
bodies the drafted pools keep (Cap Brute's Pin, the Bark Sentinel's Shield Bash, the Cagecap's Cage), and
none reads as Venom or Exposure. The draft tags them `heat` (*"the character's growing sex drive in
general"*), keeps their numbers, and notes that the Heat status does not exist yet, so they deal their
direct Lust until it does. The alternative was converting the Lust to damage one for one (I3), which on the
health-damage route is defensible and on act 1-1 is not.

**To pivot:** a `tagArray` each, or an amount each. E14 owns the final word.

## I17. The Mold Leech became the act's single fight

**Chosen session 66**, closing E7-DEFERRED's first half the way it was written: *"reconceptualise rather
than cut"*. The plan there was another growth stage of an existing myconid; the draft took the other
reading of the same instruction and made it **the Glutton**, act 1-1's `lone` body, keeping the leech's
index, its cards' indices and its lifesteal identity, and adding a charged Gulp. Its drawing was a
recoloured Wisp, so nothing drawn was spent.

**To pivot:** a `role`, a `baseHealth` and one move. Or cut it, which costs the act its single fight.

## I18. The block rule is read as entry-time, not generation-time

**Chosen session 66.** *"When an encounter is won, it's blocked from appearing for the next 2 encounters"*
is a statement about the run's history, so the draft's engine ask keeps that history on the run and
re-rolls a blocked fight when its node is entered. Generation-time exclusion along every ancestor path is
the other reading; it is stronger than his sentence, needs larger pools to hold, and changes nothing the
player can see, since the map shows tiers and never fights.

**To pivot:** the pool arithmetic in §3 of the brief holds for either; only the verb differs.

## I19. Every elite fight is one pool a region, at tier `middle`

**Chosen session 68.** The shipped table splits each region's elites into `middle` and `late` rows, one
fight a row on the routes, so a path with two elite nodes in one band of a route served the same fight
twice. The draft writes every elite fight at `middle`: `honeycomb.rollEncounter` steps an early-row
elite node down to it and drops a late-row one through to it, so a region's elites are one pool of three
or four and the block rule always leaves a real roll (0 forced picks over 300 runs). The enemy template
already grades elite bodies at the middle stage. The cost is that act 1-1's late-row elites are written
to the middle budget (137 health against 156), which is the direction S65-1 asks for.

**To pivot:** a `tier` field on each fight; nothing else reads it for an elite except the drafted-deck
size in Basic Bite.

## I20. `bellhead-a` is the Scrap Salvager's new drawing, not a third body

**Chosen session 68.** E7-DEFERRED reads *"the Salvager plus a new elite built from `demikobold-c` [...]
with `bellhead-a` as her partner image"*, and ROUTE-IDENTITY files `bellhead-a` as *"that elite's
partner"*. Her partner is the Salvager, and the one thing that benched him was his hue-shifted Scavenger
sprite (*"the fix that makes that worth doing is one drawing"*). So the draft puts `bellhead-a` on the
Salvager and builds the pair as two bodies. The other reading, a third intruder body, would need a third
kit and would put three elite types in one region.

**To pivot:** cheap. Give the third body the Salvage Gate's slot beside the Doorward, and the Salvager
keeps the brief already written for him.

## I21. The two solo elites are written under the elite line

**Chosen session 68.** The Lush and the Longshade stand at 160 health against a 195 solo line (18%
under, inside the template's 25%), so one body fights alone AND with company inside one budget: alone it
is the route's single guy, with a support or two swarm bodies it is a whole elite fight. Written to the
line, every fight with company would land 25% over, and the shipped answer to that was two whole bodies
at the budget and never a solo.

**To pivot:** a `baseHealth` each, and drop the fights with company.

## I22. Both Fencers and the Salvager are halves, not elites with a common

**Chosen session 68.** B36 asks for *"a two-enemy elite encounter"* of the two Fencers, and E7-DEFERRED
for the Salvager beside a new elite; a pair of whole elites is 270 health against a 195 budget. `bossHalf`
is the precedent (I10), so `eliteHalf` is half the elite health and 0.75 of the solo damage line (which is
half the group line). The Salvager keeps his whole kit at 97 health instead of 135.

**To pivot:** the role row and three `role` fields; the fights then read ▲ on the template until they are
rebuilt as elite-plus-common.
