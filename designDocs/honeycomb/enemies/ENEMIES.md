# Enemy rework — `enemies/`

Who an enemy is and what it costs: identity, name, fiction, lust tags and act placement (the old
`enemy_overhaul/`), and health, damage, roles and encounter composition (the old `rework/enemies/`), in
one place. Noodle's pipeline **Enemy rework**; on the second demo's gate as three lines, one session each:

> - Common enemy encounter rework & additions
> - Elite enemy encounter rework & additions
> - Boss enemy encounter rework

> I'm not sure about this. These three kinds of encounters are the game's actual gameplay, and the more we try to do in one session the less attention each part gets.

**How this file works.** One file per pipeline: where the work is, the rules, then the queue in Noodle's
words. When an item closes, cut its `###` section and paste it at the top of `ARCHIVE.md` beside this
file, the same minute. `../FEEDBACK.md` indexes the count. Quotes are his, verbatim, and win over any
annotation. Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted.

---

## The brief

Noodle, session 42, opening the enemy overhaul:

> A recent pass added new enemies to the game but they need a total fluff makeover. They don't fit
> with the game's lore at all (maybe an expansion of the story bible is in order?) and have a few
> other issues.

On art, the same session, which is why art is not the blocker here:

> Img2img works off of color and silhouette mostly, so a silhouette of a beeg mooscle man colored red
> will get us 90% of the way to a big scary demon, so in terms of images we aren't up a creek or
> anything.

> I'll probably need to train a dedicated honeycomb enemy-lora.

A LoRA bakes in whatever visual vocabulary it is trained on, so the roster's look is settled before
training; every recast enemy's table entry carries an ART note saying what its silhouette has to do.

---

## Where it stands

- **The roster.** Act 1-1's 24 enemies were recast in session 44 (four species instead of four robes,
  frontier myconids under arms, the Sporeguard); twelve route enemies were built in session 45; the
  Act1-1 boss stopped being a clerk in session 50 (**The Shroud**, not one number moved). Every one of
  those names is his to veto (E9).
- **The routes.** Three, all ON, chosen by the Act1-1 boss the run beats: Act1-A the Mushroom Frontier,
  Act1-B the Thorn Arbor, Act1-C the Pollen Road. Every ORDINARY fight is built from its route's own
  enemies (session 55c); **every elite node on every route is borrowed** (E11), and the five designs he
  previewed publicly are the route-native elites and an intruder pair, assigned and undrawn (E13,
  E7-DEFERRED). The Pollen Road has no small enemy; the Mantlewing fits no native group
  (`ROUTE-IDENTITY.md`). The Scrap Salvager is benched with two written encounters.
- **The numbers.** A template per role in `tuning.balance`; `opening` tier rows 0 to 5; act 1's ordinary
  fight costs 8% of party health; Lust share 28% of enemy moves. Whether act 1 fights should last longer
  (the turn target is 3 to 4) is P14's open half and needs his word and an All the Crunch run either side.
- **The bosses.** Six in act 1. His word, 2026-09-25: all placeholders except the Juggernaut (S64-3).
- **First job: E14, the retag** he signed off 2026-09-25 (15 Charm moves to Exposure, 8 Restraint moves
  retagged, every old Charm reference scrubbed, saves reconciled on load). Every addition after it is
  tagged once instead of twice.
- **The common pool is drafted** (session 66, `COMMON-ENCOUNTERS-01.md`, `COMMON-DRAFT-01.js`): 41 fights
  over 28 commons, each in one region, graded and measured, waiting on the frame. S64-1 says what it holds.

## Files

| File | Holds |
|---|---|
| `ENEMIES.md` | this file |
| `ROUTE-IDENTITY.md` | how far each route is from its own enemies, measured (sessions 55b and 55c) |
| `COMMON-ENCOUNTERS-01.md` | the common pool, draft 01 (session 66): his rules, the audit, the math, the roster and the fights, measured |
| `COMMON-DRAFT-01.js` | that pool in the live tables' shape, applied over a headless engine by `../tools/common-draft-audit.js`; nothing loads it |
| `INFERENCES.md` | eighteen choices made without him, each with the cost of reversing it (I13 to I18 are session 66's) |
| `ARCHIVE.md` | closed items from this file |
| `../Archive/demo1/enemy_overhaul/` | `../Archive/demo1/enemy_overhaul/RECAST-01.md` (the session-44 recasts, per enemy), the E7 build briefs and verification, the old catch-up, closed items before 2026-09-25 |
| `../Archive/demo1/rework/enemies/` | `../Archive/demo1/rework/enemies/ENEMIES-01.md` (the session-34 numbers brief and roster), the before-picture, closed items |

**Required reading before designing anything:** `../designBibles/story.md` (§3 tone, §4 the acts and
sub-acts, §8 how names are formed, §11 what each lust tag represents) and `../designBibles/mechanics.md`
(§3 and §5, the encounter laws). Session 44's first pass was built without them and had to be redone.

Live content: `scripts/misc/honeycomb/honeycomb-content-enemies.js`. Art assignments:
`v13 spire images/_source/enemy inspo variants/assigned/ASSIGNED.md`.

```
node "!designDocs/honeycomb/tools/enemy-template.js"        every enemy and encounter against its role template
node "!designDocs/honeycomb/tools/lust-share.js"            which tags the roster teaches, and anything teaching the ledger nothing
node "!designDocs/honeycomb/tools/budget-audit.js"          every encounter against the damage budget
node "!designDocs/honeycomb/tools/encounter-coverage.js"    which encounters a run can actually reach
node "!designDocs/honeycomb/tools/common-draft-audit.js"    the drafted common pool: template, shape, tags, coverage; --bite fights it
node "!designDocs/honeycomb/tools/audit-sprite-fit.js"      sprites off the screen, at a given window shape (browser)
```

## Rules this pipeline must not break

- **Retool, don't relocate.** A recast enemy keeps its index, slot, act and encounters; who it is may change.
- **Read the bibles first.** Act 1 line-ups mix their threats; Act1-A is the low-lust sub-act; act-1 enemies
  use only Venom, Exposure and Heat, and none of them is a focus of the Frontier.
- **Names are Noodle's.** Every name in the table is a proposal until he says otherwise (E9). A card or move
  name comes from a biological, structural or mechanical idea, never from what it does to a health bar.
- **Adding an enemy is a table entry only.** Enemy, intent AI and encounter group are all data.
- **Re-run `lust-share.js` and `enemy-template.js` after any enemy edit.** A lust move with no tag teaches the ledger nothing.
- **Two files per common enemy** (`1-combat`, `1-offense`), enforced by the engine (`../reference/ART-GUIDE.md` §2). Never put an archived pose back.
- **Tone rules in full** (`../designBibles/story.md` §3): no death or gore, horror only as fridge horror, never state the mechanism.
- **Numbers beat descriptions.** A budget claim without the tool's output is not a finding.

---

## The queue

### S64-1. Common enemy encounter rework & additions ◐ — DRAFTED SESSION 66, VERDICTS IN THE FRAME

> - Common enemy encounter rework & additions

**Drafted 2026-09-25 (session 66, cloud), his ten rules for it filed verbatim in `COMMON-ENCOUNTERS-01.md`
§1.** The pool is `COMMON-DRAFT-01.js`, written in the live tables' shape and graded by
`../tools/common-draft-audit.js`: 40 common encounters (16 in act 1-1, 8 a route) against 61, every one
distinct, one or two enemy types each, sizes one to five in every route; 28 commons, each in exactly one
region, with the Glutton (the Mold Leech reconceived as act 1-1's single fight, wearing the Witch's Butter
drawing), the Doorward, the Dustmote, the Courtier (`beenoble-a`) and The Dandy (`tophatfairy-c`) in and
both Fencers out (to S64-2's pair). Four sprite pairs ship it, two of them new designs (§11 there). Two roles, `swarm` and `lone`. His math answered: four fights a band satisfies the block
rule with a real roll every time; the rule itself is an engine verb (`../engine/ENGINE.md` S66-1). Measured
by Basic Bite against the shipped ceiling per band: four drafts came in over it and were cut down the same
session; the bulk-Sporeling fights wait on E14's Poison halving. **Nothing in the game changed.** Left for
him: every name, the bench, the Fencers, `tophatfairy-c` as a common, Heat on grapples, and the questions in
§10. Noodle: *"We'll have a full session on redesigning to match art once we are back on desktop, and
rebalancing after the balance tests are completed."*

**What stood before the draft, kept for the measurement:** every ordinary fight on all three routes was
native (`ROUTE-IDENTITY.md`); the Pollen Road had no small enemy; the `opening` tier holds rows 0 to 5;
Moth Light sat 3% over the Lust cap (below; the draft fields no Glowcap, so it goes when the draft lands);
B31 wanted sporelings fought in bulk. **P14's open half still lands here:** whether act 1 fights should
last longer. The turn target is 3 to 4; raising it restats every region-1 enemy and needs an All the
Crunch run either side (`../Archive/demo1/Archive/playtest_55/READ-ME-2.md` §6). His word first. **E14
first, whatever the order after it.**

---

### S64-2. Elite enemy encounter rework & additions ☆ — FILED 2026-09-25

> - Elite enemy encounter rework & additions

**Every elite node on every route is borrowed** (the Kobold Scavenger or the Hollow Champion). The
route-native elites are drawn, assigned and unbuilt: `feralbeast-b` for the Arbor, `spookytall-a` for the
Road, `tophatfairy-c` as a Road normal (E11, E13), the Scrap Salvager's intruder pair held back on purpose
(E7-DEFERRED), and B36's two-Fencer elite for the Pollen Road. Building them is additive: nothing written has
to be undone, and it is the biggest single legibility win available, because the elite is the fight
people remember. His earlier word: *"I think we may not need as much elite variety as normal enemy variety.
Players are avoiding elite encounters."*

---

### S64-3. Boss enemy encounter rework ☆ — FILED 2026-09-25

> - Boss enemy encounter rework

His words on what it covers, 2026-09-25:

> It's the same as with common enemies and elites, taking a full session to audit and ensure the bosses are designed thoughtfully, balanced properly against expected numbers from the balance tests, and yes sprite fitting. I consider all of their current states to be placeholder, with the exception being Juggernaut who's the only one I already micromanaged. Still though, even he could probably use some attention, since he was created before act1-2 was codified.

Six bosses in act 1: The Shroud, The Head Gardener and The Matriarch at the end of act 1-1 (each opening a
route), then The Juggernaut, the Arbor Sisters (a two-body boss, role `bossHalf`) and The Pale Dray. The
Shroud's every word is open for veto (E9); the Head Gardener's scale is settled at 1.1 and the Pale Dray
still runs 108px off the top at his window (B37); the Pale Dray won 92% of simulated fights, the softest of
the three route bosses. *"Balanced against expected numbers from the balance tests"* means the Crunch's
boss rows (`../tooling/TOOLING.md`), so the calibration there comes first. `../card_pool/CARD-POOL.md` B24
wants one boss retooled to shuffle curses.

---

### E7-DEFERRED. Two jobs held back from session 45 ☐ — DELIBERATELY NOT DONE BEFORE RELEASE

E7 itself closed session 45; it is in `../Archive/demo1/enemy_overhaul/_archive/FEEDBACK-DONE.md` with its quotes. These two pieces of
it were held back, because both change the one act players have already been playing and neither could
be play-tested before the demo shipped.

**Mold Leech.** Noodle:

> cut or reconceptualize mold leech

The plan stands: reconceptualise rather than cut. Cutting costs a body against the Variety law and it
is a striker, a role Act1-1 is thin on. Make it **another growth stage of an existing myconid**, so
sharing a silhouette becomes a species fact instead of a shortcut, and no new art is needed.
**Session 66's draft reconceives it as the Glutton, act 1-1's single fight** (`COMMON-ENCOUNTERS-01.md`
§5, `INFERENCES.md` I17): same index, same cards, lifesteal kept, a charged Gulp added, 70 health, the
`lone` role, and the Witch's Butter drawing on it, so nothing new is owed.

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
| `demikobold-c` | **A new Act1-A elite** who preys on the weak | Deferred out of session 45 on purpose. It changes an act players were already playing, and it could not be play-tested before release. | `ENEMIES.md` E7-DEFERRED |
| `bellhead-a` | **Her partner**, beside that elite, moved to Act 2 | Same decision, same reason — the two were always one job. | `ENEMIES.md` E7-DEFERRED |
| `feralbeast-b` | **The Thorn Arbor's elite** | Act1-B and Act1-C shipped with no elite pool of their own and field the Kobold Scavenger on their elite nodes instead. Needs a drawing. | `ENEMIES.md` E11, `ENEMIES.md` §3 |
| `spookytall-a` | **An elite**, route unspecified — *"can fit into a lot of places"* | Same as above: the Pollen Road's elite, still undrawn. | `ENEMIES.md` E11, `ENEMIES.md` §3 |
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

### E14. The act-1 retag: five MUSTs, signed off ☐ — FILED 2026-09-25 FROM `rework/cards/` B34

Noodle, 2026-09-25, in the card-pool conversation (the whole message is `../card_pool/CARD-POOL.md` B34,
sixth message; what each tag represents is `../designBibles/story.md` §11):

> Alright, I'm 100% set. I can't remember the act ABCs or titles, but the tags that will be in use for the second demo build, for sure, are:
> - Venom, primarily inflicted in act1-flora. Represents the character's chemical weakness to aphrodisiacs.
> - Exposure, primarily inflicted in act1-fey. Represents the character's interest in exhibitionism.
> - (act1-frontier should primarily focus on hp damage)
> - Heat, inflicted by the status effect of the same name. [...]
> - Penance, inflicted exclusively by Clement. [...]
>
> The tags we will leave mainly for act 2, which is beyond the second demo's scope are:
> - Charm, primarily inflicted by masculine enemies with visible genitals. This represents the characters becoming more interested in men.
> - Torment, primarily inflicted by electric attacks and spanking. This represents the characters becoming more masochistic.

> All the existing attack names and tags that will need to change are not a huge loss. Moving closer to a shared pool of attacks (mainly to reduce the amount of owed art) will necessitate a rework of them anyways
>
> Okay, just so our ducks are all in a row, I am signing off right now that for sure 100%:
> - Poison MUST change to halve when it triggers, down from 1 per turn.
> - Act 1 enemies MUST change their attacks to exclusively use legal act 1 options. Venom, Exposure, and Heat is legal but not a focus.
> - The fey MUST change to using exposure.
> - Instances where the old Charm tag was used MUST be removed and replaced with Exposure as a theme.
> - All existing references and weaknesses to the old Charm MUST be scrubbed.

**The size of it, measured with `../tools/lust-share.js` the same day:** the roster's 44 Lust moves carry
Charm 15, Venom 15, Restraint 8, Exposure 6, Torment 0. So the retag is **15 Charm moves → Exposure** (all
on the Pollen Road) and **8 Restraint moves → Venom, Exposure or Heat** by region (Restraint is cut
outright — his seventh message: *"I have zero issues dumpstering it completely"*). Torment has nothing to
retag. The Thorn Arbor stays Venom; the Mushroom
Frontier focuses on health damage. "Heat is legal but not a focus" means an act-1 enemy MAY carry a Heat
move (the status: 1 Lust per stack whenever the holder plays a card; `../card_pool/CARD-POOL-02.md`
§2.1) and no region is built on it.

**Scrubbing Charm** reaches past the moves: the ledger (`reconcileWeaknessLedger` drops dead tags on load),
the Pollen Road's "charm" wording in `../designBibles/story.md` §4 and `ROUTE-IDENTITY.md`, the charm
writing rules in `../events/IDEAS.md` (act-2 material now, `../events/` B23), and `../events/RATE.md`.
Poison halving is one field (`decayMode: "halve"`) and is priced in Nettle's grid, not here.

**"A shared pool of attacks"** — his aside that enemies will move toward shared move definitions to cut
owed art — is a design direction for this workstream and is not yet an item.

---

### B31. Sporelings should be fought in bulk ☆

> Sporeling could be better designed to be fought in bulk, like 4x in an encounter, since matriarch
> summons them and the game could use more aoe checks

Two reasons given, both good: the Matriarch already summons them (so a bulk sporeling encounter is
consistent with existing content), and **the game needs more AoE checks** — encounters that test
whether a deck can handle several bodies at once. `../Archive/demo1/chessmaster/STATUS.md` notes the Matriarch can summon
5 and never reads the ally-side cap, so the engine side is already there. This is an encounter-table
entry plus a look at whether the sporeling's own numbers suit being one of four.

**Measured session 66** (`COMMON-ENCOUNTERS-01.md` §7): four Sporelings cost 33% of party health under
today's Poison and 22% under E14's halving; three and an Earthstar 44% and 25%. Both are `candidate` rows
in `COMMON-DRAFT-01.js`, held until the halving lands, and the ×2 opening fight and the ×4 late one share
a type set, which his repetition rule would read as one fight twice. His call.

---

### Moth Light sits just over the Lust-to-damage cap ☆ — FOUND SESSION 44, NOT CAUSED BY IT

`budget-audit.js` at 4 seeds reports **Moth Light at 6.8 Lust per turn against a 6.6 maximum** — 3%
over `tuning.balance.lustToDamageRatioMaximum`, and the only one of 44 encounter rows that is over at
all. A 1-seed run of the same encounter reads 5.6 and passes, so it is marginal and seed-dependent
rather than a clear break.

**It is not the enemy overhaul's doing.** The line-up is Sporeling + Glowcap Moth + Gloom Wisp, and
session 44's Lust lift changed no move any of those three plays — it is simply the one encounter built
from three of the four enemies that already dealt Lust before the pass. Whether a cap written as a
per-line-up maximum should tolerate an all-casters line-up at all is this folder's call.

---

### B36. The Argent Fencer was meant to be saved for a two-enemy elite fight ☆ — FILED FROM THE INBOX, SESSION 51

> for argent fencer's sprite we were supposed to save her for a two-enemy elite encounter with the
> other butterfly knight

**She was not saved. She is in six encounters, and none of them is a two-enemy elite fight.** Measured
against the encounter table:

| Encounter | Tier | Line-up |
|---|---|---|
| `pollenRoadside` | early | Argent Fencer, Soakcap, Gloom Wisp |
| `pollenFencers` | middle | Sable Fencer, Argent Fencer, Soakcap |
| `pollenBower` | middle | Longwing, Argent Fencer, Gloom Wisp |
| `pollenDeepRoad` | late | Sable Fencer, Argent Fencer, Gloom Wisp |
| `pollenBathhouse` | late | Soakcap, Longwing, Argent Fencer |
| `pollenHighDrift` | late | Mantlewing, Argent Fencer, Sporeling |
| `pollenStripped` | late | Kobold Scavenger, Argent Fencer |

The pair fight he is describing half-exists. `pollenFencers` and `pollenDeepRoad` both field the Sable
Fencer and the Argent Fencer together, which is the matched pair `v13 spire images/_source/enemy inspo variants/assigned/ASSIGNED.md` asked for — *"Fight them
together. A matched pair reads as deliberate where two separate enemies read as lazy."* But both are
ordinary fights with a third enemy padding them out, not elites, and she appears in five other fights
besides, so nothing about her reads as held back.

The elite nodes on this route field the **Kobold Scavenger** instead, which is `enemy_overhaul/` E11 —
Act1-B and Act1-C have no elite pool of their own. A two-Fencer elite would close E11 for Act1-C and
this item at the same time. What it costs is one encounter-table entry at `tier: "elite"` and removing
her from some of the six fights above; how many of the six she should keep is a design call, not a
measurement.

**Session 66's draft takes both Fencers out of every ordinary fight** (`COMMON-ENCOUNTERS-01.md` §5,
`INFERENCES.md` I14); the pair elite is S64-2's to build.

---

### B37. Enemy sprites are drawn off the screen, and it is worse than the two he caught ☆ — MEASURED SESSION 51

Two separate reports, one cause:

> Soakcap's sprite is gigantic

> The Pale Dray doesn't fit on the dang screen

**What decides a sprite's size.** `presentation.scale` on the enemy's own content-table entry. It is a
named field, so this is not a magic-number problem — the numbers are in the right place, they are just
wrong. Nothing clamps the result to the stage, so a scale that looks right in one window shape hangs
off the edge in another.

**Measured at his window shape, 1878x804, with a three-ally party.** Twelve sprites leave the screen.
`topCut` is pixels above the top of the window; `rightCut` is pixels past the right edge:

| Encounter | Enemy | scale | top | right |
|---|---|---|---|---|
| `gardenerGrove` | **The Head Gardener** | 1.9 | **453** | 159 |
| `drayRoad` | **The Pale Dray** | 1.3 | **108** | 0 |
| `nettleVenomBattle` | Bolete Hook | 1.45 | 0 | 137 |
| `pollenFencers` | **Soakcap** | 1.45 | 0 | 73 |
| `floraStripped` | Windfall Alraune | 1.2 | 0 | 35 |
| `arborTwins` | The Sleeping Sister | 1.15 | 0 | 28 |
| `championAlone`, `championGuard` | Hollow Champion | 1.25 | 0 | 20 |
| `pollenBathhouse`, `pollenStripped` | Argent Fencer | 1.05 | 0 | 12 |
| `floraBellChoir`, `floraCache` | Trumpet Bell | 1.15 | 0 | 6 |

**The Head Gardener is cut off at the neck and has not been reported.** She loses 453 pixels off the
top — she is the Act1-1 boss, so a run that meets her sees a headless figure. That is four times worse
than the Pale Dray, which is the one he noticed.

**A bigger window makes it worse, not better.** The same fights at 1920x1080: the Head Gardener is 606
over the top rather than 453, and the Pale Dray 145 rather than 108. Sprite size follows the viewport
and the stage it stands on does not, so this cannot be dismissed as his window being short.

**Soakcap is the widest ordinary enemy in the game.** Its scale is 1.45, tied with the Bolete Hook for
the highest of any non-boss, and its drawing sits on a 1011x1300 canvas rather than the shared
832x1216, which widens it again (`honeycomb.art.normaliseCanvas`). Next to the Longwing, which is on a
650x1300 canvas, it renders about half as wide again. In `pollenFencers` it is 443px wide and 73 of
them are off the screen.

**The tool.** `!designDocs/honeycomb/tools/audit-sprite-fit.js` (new, session 51) reports this for every encounter at whatever
window shape is being tested. Run it at the shape being asked about. It is a browser audit; loading and
usage are in its header.

**What is NOT decided here.** How big each of these should be is his taste, not a measurement. The
numbers above say which entries are wrong and by how much; they do not say what to put there. Two ways
to go, and they are not exclusive: retune the `presentation.scale` values that overflow, or give the
sprite a real height cap so no scale value can push a drawing off the stage. The second is the engine
bug — `honeycomb-art.js` already records that `.hcFighterArt`'s `max-height` is a percentage whose
containing block has no definite height, so the cap resolves to none and has never applied.

---

### S65-1. The first demo's difficulty is the standard the three encounter sessions are graded on ☆ — ROUTED 2026-09-25 FROM THE ROOT INBOX

An aside from the relic rarity session, in his words:

> As an aside: I personally blame myself for the design decisions that led to the overly high difficulty,
> it leaves us in a very tough spot. Yes, not every run in StS is meant to be won, but a run not making it
> past act 1? I was designing the difficulty curve, looking at a high failure rate and signing off on it as
> if the game was already finished. Now we are trapped, casual players might be afraid to return, hardcore
> players may be expecting something even more difficult. This is a very tricky situation, I'm already
> trying to mediate things in my discord and in forums saying demo 1 was closer to a proof of concept.

Routed here because S64-1 to S64-3 are where act-1 difficulty is actually set. Not a task of its own: it
is the standard those three sessions are graded on, and the floor in `../BASICS.md` is the rule (*"A run
ending in the first 1/3rd of act 1 should be astronomically unlucky, or the result of purposeful
self-sabotage"*, and *"I'd rather have the data point of 'you went too far in the other direction'"*). The
instruments are `../tools/enemy-template.js` for each encounter's budget and the Crunch's act-1 clear rate
(`../tooling/TOOLING.md` T1 to T6), measured before and after each session. Two things outside this
pipeline bear on it and should not be double-counted: persisting common relics (`../relics/RELIC-REWORK-01.md`
§2.1) give a run that dies in act 1 starting power for the next one, and boss drawbacks arrive after the
act 1-1 boss, so the relic rework never reaches the opening.

---

## Unsorted — drop new reports for this pipeline here

*(a report that does not clearly belong to this pipeline goes in `../FEEDBACK.md` instead)*
