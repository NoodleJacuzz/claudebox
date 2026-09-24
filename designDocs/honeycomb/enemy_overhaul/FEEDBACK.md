# Enemy overhaul — FEEDBACK

**Opened session 42.** The roster's fiction, not its numbers. Where the work is: `CATCH-UP.md`.
What the project is: `../BASICS.md`.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway can
be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../FEEDBACK.md`.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

**Closed session 44: E1, E2, E3, E4, E6, E10** — the recast pass and the Salvager's promotion, in
`_archive/FEEDBACK-DONE.md` with their quotes. The design is `RECAST-01.md`. What is left open is
**E9**, the names, which are Noodle's.

⚠ **The first pass of session 44 was built without the design bibles**, and Noodle caught it:
*"It seems like almost all of it went into the story bible, which I also should have remembered to
point you to."* A second pass corrected it — the Act1-A lust theme, the venom monoculture in Act 1-1,
and the card-naming rule. **`../designBibles/story.md` and `../designBibles/mechanics.md` are required
reading for this folder**, not optional context; `CATCH-UP.md` now says so at the top.

---

## The brief

> A recent pass added new enemies to the game but they need a total fluff makeover. They don't fit
> with the game's lore at all (maybe an expansion of the story bible is in order?) and have a few
> other issues.

---

### E7-DEFERRED. Two jobs held back from session 45 ☐ — DELIBERATELY NOT DONE BEFORE RELEASE

E7 itself closed session 45; it is in `_archive/FEEDBACK-DONE.md` with its quotes. These two pieces of
it were held back, because both change the one act players have already been playing and neither could
be play-tested before the demo shipped.

**Mold Leech.** Noodle:

> cut or reconceptualize mold leech

The plan stands: reconceptualise rather than cut. Cutting costs a body against the Variety law and it
is a striker, a role Act1-1 is thin on. Make it **another growth stage of an existing myconid**, so
sharing a silhouette becomes a species fact instead of a shortcut, and no new art is needed.

**The intruder elite.** Noodle, on the Scrap Salvager's partner:

> Demikobold as an act invader should probably be redesigned as someone who preys on the weak, would
> help to diversify her from the other scrap collector, the fire doesn't really sell me on "salvage".
> If you're using her, I'd recommend a rework to that whole elite encounter, and also including
> bellhead-a.

The plan stands: the Scrap Salvager's elite encounters become a **pair of Act 2 intruders** — the
Salvager plus a new elite built from `demikobold-c`, redesigned to **prey on the weak** (punishing
low-health or isolated party members) rather than to collect scrap, with `bellhead-a` as her partner
image. **Drop the fire** — it says arsonist, not salvager. A new elite with a new targeting mechanic is
exactly the thing that needs play before it ships.

---

### E11. The two new routes borrow the Kobold Scavenger for their elite nodes ☐ — RAISED SESSION 45

Not Noodle's words; raised by the session that found it. An elite node generates on every region's map,
but `honeycomb.rollEncounter` falls back to the region's **normal** pool when no elite encounter names
that region — so before session 45 a skull node in either new route quietly served an ordinary fight,
with no crash and no warning.

Stopgap: four elite encounters pairing the **Kobold Scavenger** with a local body. He is already written
as a trespasser who goes where the loot is, and a run takes ONE route, so this does not make him commoner
in any single run.

The intended bodies are already picked in `v13 spire images/_source/enemy inspo variants/assigned/ASSIGNED.md` and both need drawings that do not exist:
**`feralbeast-b`** for the Thorn Arbor (*"the route's elite"*, demoted from boss when the sisters took
the slot) and **`spookytall-a`** for the Pollen Road (*"can fit into a lot of places"*).

---

### E9. The names are Noodle's, and every one below is a proposal ⏸ — NEEDS A YES OR A VETO

E1 says it outright: *"names are Noodle's"*. Session 44 put names in the table because the roster
cannot be read or measured as a whole without them, **not** because the naming is settled. Each one is
a single `name:` field and costs nothing to change.

| Was | Now | Why this word |
|---|---|---|
| Spore Gardener | **Earthstar** | The fungus that splits along a seam to seed — which is the summon she already had. |
| Fungal Sage | **Bracket Elder** | Shelf fungus. Ancient by growth rings rather than by beard. |
| Moldshaper | **Witch's Butter** | A real fungus (*Tremella*), and a slime mould is the one of the four with no fixed outline. |
| Spore Alchemist | **unchanged** | The tone rule cites her by name. The other three are what differ from her. |
| Cordyceps Husk | **Sporeguard** | Rank-and-file. "Cordyceps" is the one word the tone rule blocks by name. |
| Silt Crawler | **Shieldcap** | A dome-capped skirmisher behind a looted pavise. |
| Mire Eel | **Cagecap** | Cage fungus: the cap opens into a red lattice, and the lattice closing is its Restraint move. |
| Bog Toad | **Bolete Hook** | Thick-stemmed bolete whose reach is what the old toad's tongue was doing. **Session 50: the hook is a tentacle, not a looted halberd** — the drawing came back as a broad tentacled mushroom and Noodle kept it, so the ART note was amended to the picture rather than the picture regenerated to the note. The name still reads; say if it should not. |
| Lantern Jelly | **Foxfire** | The real name for fungus that glows. A lamplighter, and one with a face. |
| Drowned Salvager | **Scrap Salvager** | Same kobold, same battery. Only the water word left. |

Also renamed, and equally vetoable: **moves** whose old name described a job or a body the creature no
longer has (Spade → Stiff Ray, Replant → Seed, Mire → Overgrowth, Rot Touch → Slick Touch, Lurch →
Shield Shove, Pinch → Billhook, Scuttle → Pavise, Burrow → Turtle, Bite → Spur, Submerge → Fold In,
Constrict → Cage, Tongue Lash → Hook Pull, Belly Slam → Shoulder, Croak → War Horn, Mud Spit →
Spore Sack, Sting → Lamp Hook, Pulse → Gleam, Volatile Brew → Sweet Vapour); the status
**Cordyceps Host → Seeded**; and **encounter names** that carried a job title or the dropped water theme (The Tended Garden → The Seed
Bed, The Mold Garden → The Damp Patch, The Sage Council → The Elder Ring, Sage and Wisps → Elder and
Wisps, Husk Shamble → Guard Detail, The Rot Host → The Seeping Post, Crawler Bed → The Picket, The
Shallows → The Outpost, Toad Pond → The Hook Line, Jelly Drift → Lamps in the Dark, Drowned Patrol →
Scrap Patrol, Eel and Toad → Cage and Hook, Jelly Bloom → Lamp and Guard, Vault Guard → The Toll Post,
Eel Nest → The Cage Line, The Draining Dark → Leeches and Light, The Drowned Champion → The Cage Duel,
The Champion's Pool → The Salvaged Champion).

**Two names were forced rather than chosen.** The Foxfire's all-party charm move was written "Warm
Glow" and `honeycomb.warnings.report()` reported it overflowing the card's name box at two sizes — it
is **Gleam**, and any replacement has to clear that audit. And five renames were redone in the second
pass because the story bible's §8 rule says *"card names come from biological, structural or mechanical
ideas, not from what the card does to a health bar"*: Ray Strike → **Stiff Ray**, Pike Jab →
**Billhook**, Pin Down → **Pavise**, Rend → **Spur**, Body Check → **Shoulder**.

**Added session 50 by the E12 recast, and equally vetoable.** The Act1-1 boss stopped being a clerk, so
every word attached to him is new and none of it is settled:

| Was | Now | Why this word |
|---|---|---|
| The Tallyman | **The Shroud** | A shroud is both a covering laid over a thing and a burial cloth. It is a sheet of mold that has stood up, and the word does the reaper's job without saying reaper. Was briefly **The Pall**, changed on Noodle's ear: *"I feel like 'The Pall' is a little similar to 'The Pale Drey'"* — and he is right, they collide at a glance and in the mouth. |
| The Ledger *(status)* | **The Damp** | What it actually is: the condition of a room that lets mold in. |
| Tally *(status)* | **Bloom** | How much it has fed, in the word a mold colony would use. |
| Ledger Slam | **Sickle** | The shape of the thing, per the story bible's §8 rule that a card name is a structural idea and not what it does to a health bar. |
| Collect Debt | **Seep** | It gets under a guard rather than through it, which is what stripping Temporary HP is. |
| Audit | **Settling** | Spores settling out of the air and into the deck. |
| Compound Interest | **Proliferate** | Growth that feeds on its own growth, which is the mechanic unchanged. |
| Reckoning | **Fruiting** | Everything it has taken in, released at once. |
| The Counting House *(encounter)* | **The Damp Room** | |

**Left alone on purpose: The Head Gardener.** E1 named four supports and she is not one of them, and
her whole kit is gardening (Shears, Graft, Plant, Overgrow) — so renaming her means rewriting a boss's
move list, which is more than E1 asked for. She also still reads correctly: she IS the gardener, and
the four supports were never gardeners, they were species. Say if that is wrong.

---

### E8. Region 1 is still called The Flooded Vault ☐ — `map/` OWNS THIS, RAISED SESSION 44

The enemies of Act1-A are dry frontier myconids as of session 44. The **region** they fight in is not:

| Still reads | |
|---|---|
| Region name | "The Flooded Vault" |
| Description | *"Deeper, colder, and something down here is still counting."* |
| Backdrop | `map/backdrop-vault-causeway`, a flooded causeway |

Recasting the enemies and leaving that standing produces a worse read than either state alone. It was
**not** fixed here for a specific reason: `../BASICS.md` records that Noodle already chose the title —
*"The live act 1-2 is to be titled **Myconid Navel**"* — and `map/` owns titling and act structure.
Taking that decision in this folder would be overwriting his.

The enemy-side half is done, so this is a one-file change in `honeycomb-content-map.js` plus a
backdrop. **`../map/FEEDBACK.md` B31 already owns it** — its first of three owed items is this exact
thing, raised there from cosmetic to contradictory with a session-44 note. No new item was opened;
one report in two places is how a fix gets done twice or not at all.

---

### E5. "Regions" is the wrong shape ☐ — `map/` OWNS THIS

> The code separates them into "regions" but this is a mistake. There is Act1-1 and Act1-2 currently
> playable, and the Act1-2 in game currently is one of several planned routes through the second half
> of the mushroom themed act 1.

Recorded here because it decides what an enemy *belongs to*; the structural fix is `map/`'s. The code
is closer than the naming suggests — `bossEncounterIndexArray` already rolls per run from a pool, and
`regionIndexArray` on an encounter is already a general filter.

---

## Standing notes — not items

**Art is not the blocker.** Noodle:

> Img2img works off of color and silhouette mostly, so a silhouette of a beeg mooscle man colored red
> will get us 90% of the way to a big scary demon, so in terms of images we aren't up a creek or
> anything.

And:

> I'll probably need to train a dedicated honeycomb enemy-lora.

**Sequencing consequence:** a LoRA bakes in whatever visual vocabulary it is trained on. Settle the
roster's look before training, or the current four-robes-and-a-crab vocabulary becomes the cheap
default to reproduce. *(Session 44: the recast half of that vocabulary is now settled, and every
recast enemy's table entry carries an ART note saying what its silhouette has to do. E7's twelve are
the part still unsettled.)*

**Tone rules apply here in full** — no death or gore, horror only as fridge horror, never state the
mechanism. They are in `../designBibles/story.md`, with a working copy at
`../lust_events/AUTHORING.md`.

**The Lust share is an instrument now, not a claim.** `node "!designDocs/honeycomb/tools/lust-share.js"`
reports the share, the tag spread, the per-region pressure, and a SILENT list of anything that teaches
the ledger nothing. It should be re-run after any enemy content edit.

---

### E13. The five previewed designs — where each one actually is ☆ — FILED FROM THE INBOX, SESSION 51

> peak designs I had already shown in previews like bellhead-a, feralbeast-b, spookytall-a, and
> tophatfairy-c got left on the cutting room floor without my knowing.

> It was bellhead-a, demikobold-c, feralbeast-b, spookytall-a, and tophatfairy-c. Those were the designs
> I showed off as upcoming previews because they were very cool, demo players will be expecting them.

**None of the five was cut, and none was lost.** All five images are on disk, all five are in the
`assigned/` folder, and all five are named in `v13 spire images/_source/enemy inspo variants/assigned/ASSIGNED.md` as the intended body for a specific
enemy. What happened to them is that they were **deferred**, in four separate decisions across sessions
45 and 50, and no single document ever said so in one place. This item is that place.

Every file is at `v13 spire images/_source/enemy inspo variants/assigned/`, with its prompt sidecar
beside it.

| Image | What it was assigned to become | Why it is not in the game | Recorded in |
|---|---|---|---|
| `demikobold-c` | **A new Act1-A elite** who preys on the weak | Deferred out of session 45 on purpose. It changes an act players were already playing, and it could not be play-tested before release. | `FEEDBACK.md` E7-DEFERRED |
| `bellhead-a` | **Her partner**, beside that elite, moved to Act 2 | Same decision, same reason — the two were always one job. | `FEEDBACK.md` E7-DEFERRED |
| `feralbeast-b` | **The Thorn Arbor's elite** | Act1-B and Act1-C shipped with no elite pool of their own and field the Kobold Scavenger on their elite nodes instead. Needs a drawing. | `FEEDBACK.md` E11, `CATCH-UP.md` §3 |
| `spookytall-a` | **An elite**, route unspecified — *"can fit into a lot of places"* | Same as above: the Pollen Road's elite, still undrawn. | `FEEDBACK.md` E11, `CATCH-UP.md` §3 |
| `tophatfairy-c` | **A normal on the Pollen Road** | Act1-C had seven candidates for five slots. The two Fencers were fixed by name, and the three built were chosen for a role spread with no duplicates. It was one of the two left over. | `INFERENCES.md` I12 |

**Three of the five are the same job.** `feralbeast-b` and `spookytall-a` are the two route-native
elites that E11 is already open for, and `tophatfairy-c` is what I12 calls *"the obvious first elite for
the route if it ever wants one"*. Building the Act1-B and Act1-C elite pools puts all three in the game
at once, and is additive — nothing written has to be undone.

**The other two are one job as well.** `demikobold-c` and `bellhead-a` are the intruder-elite rework,
held back together. E7-DEFERRED already owns it.

**On the day spent on other sprites.** He also said a day went on `longwing` and `butterflyknight-d`,
which he thinks are weak. Both were built: `longwing` is the Longwing, drawn from `spookytall-d`, and
`butterflyknight-d` is the Cagecap. The Longwing sits beside `spookytall-a` in the same source family,
so the `-d` variant was built and the `-a` variant was not.

**What is not measured here** is whether any of the five were shown publicly, which only he can confirm.
If demo players are expecting them, that is an argument for promoting E11 and E7-DEFERRED above their
current position, and that is his call rather than a finding.

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
