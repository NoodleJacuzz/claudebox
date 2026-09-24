# Enemy overhaul — FEEDBACK, done

Closed items, moved out of `../FEEDBACK.md` with their quotes and annotations intact.
**Quotes are Noodle's, verbatim.**

---

## Closed session 50 — E12, the clerk cut

### E12. The Tallyman is cut and replaced ☑

Raised and closed the same session, while Noodle was grading the first art pass. His words, on the
fiction session 42 wrote for the Tallyman:

> I'm sorry, I know the tallyman is your favorite for whatever reason, but truth be told I only kept
> him because it seemed like you liked him. I genuinely do not understand what "He is not drowned —
> that was the old water theme — only damp, aggrieved, and still counting" means, it is absolute word
> salad to my mind, I just felt like the shadowy reaper dude looked cool, I didn't actually write any
> of his lore myself, I think it was all placeholders.

And the replacement:

> could I ask you to forgive me cutting your favorite guy and ask you to replace him with a mostly
> similar reaper guy who's like a sentient colony of black mold or something with a scythe?

**Built as THE SHROUD.** A colony of black mold grown into the shape of a robed reaper: the robe is a
hanging curtain of mycelium, the scythe is a fruiting body it grew rather than a tool it found, and the
two lights in the hood are the only part of it that looks back.

**Nothing numeric moved**, per this folder's own law. Index, role, 205 health, phases, move list,
weights, charge costs and the whole effect table are the E7 values that `budget-audit.js` and
`enemy-template.js` were run against. What moved is the name, the species tag (`construct` → `plant`;
nothing in the card or relic tables keys off either, measured first) and the words.

**The ledger mechanic re-read as feeding with no effect edited.** Every card the party plays stirs the
air and is taken as a Bloom; when it has fed enough it fruits. The Ledger → **The Damp**, Tally →
**Bloom**, and the five moves renamed under the story bible's §8 rule — see **E9** in the live file,
where every one of those words is still open for veto.

**The cut was raised as costing the armour question** — the clerk was the fiction's only answer to
where a society with no smiths got plate and spears. **Noodle closed it rather than banking it:**

> that's not really a big cost, it's a fantasy setting dungeon, kobolds, adventurers

Recorded that way in `designBibles/story.md` §Act1-A. The armour needs no named supplier.

**Renamed the same evening, before anything shipped: The Pall → The Shroud.** Noodle: *"I feel like
'The Pall' is a little similar to 'The Pale Drey', one of them should change I think."* The Pale Dray
is Act1-C's boss with settled art and the stronger claim, so the newer name moved. `shroud` was
confirmed unused anywhere in the engine before taking it.

Measured: suite **2420 passed, 0 failed**, new block `[124]`, 14 checks. `lust-share.js` unchanged at
**28.0%**; `enemy-template.js` health ✓ and the same expected-damage ▼ the E7 comment already explains.

**Falsifying the block caught a bad check of its own**, which is the whole reason the rule exists. The
first version asserted The Damp's wiring with `JSON.stringify(damp.hooks)` — but `reactionHooks`
compiles its reactions into closures, so the effect inside is not reachable from the table and that
check could only ever fail. It read as a correct red under mutation and was still red on clean content.
Rewritten as two things that ARE reachable: the hook name The Damp listens on, and the status name
agreeing with the description printed under it. Both were then re-falsified — the hook repointed at
`onTurnStart`, and a deliberately HALF-DONE rename (name back to Tally, description left saying Bloom,
which is the exact rot the second check exists for) — and each reddened only its own line. Every
mutation pass restored the file and verified the restore by checksum.

---

## Closed session 44 — the recast pass

All five landed together, because they are one edit: `scripts/misc/honeycomb/honeycomb-content-enemies.js`.
The design and the reasoning are `../RECAST-01.md`; the names are still open for veto as **E9** in the
live file.

---

### E1. Four robes ☑ — THE DENSEST PATCH

> Four myconid robe-wearers differing only by job title. Spore Gardener, Fungal Sage, Spore Alchemist,
> Moldshaper. Their names describe their mechanic, not an enemy. Densest patch of weak flavor.

Also an art problem, not only a flavour one: four robed bipeds differing by held prop are one
silhouette to img2img, which reads colour and shape before it reads a prop.

Worth pricing alongside it — three of the four are `role: "support"`, so there is a role-budget
argument for collapsing that is independent of the fiction. That call belongs to
`../rework/enemies/`.

**PROPOSED AXIS (session 42, Claude's — not Noodle's words, and vetoable).**

Differentiate by **species, not by job.** Not "what does she do" but "what kind of mushroom is she",
and let the fungus dictate the body.

This is already half his instinct rather than a new idea: every hand-made myconid prompt in
`refsPNG/enemies/` already carries a species colour — the brute is `red mushroom`, the caster
`purple mushrooms`, the gardener `green mushroom, orange mushrooms`, the warrior `brown mushroom`.
What is missing is letting the species drive the **silhouette** as well as the palette. It also
follows the story bible's world rule directly: Act 1's fungi are *"varying species mostly vibing"*,
so species is the thing the magic turned up.

Roles, stat lines and move lists are untouched (retool-don't-relocate):

| Enemy | Role | Fungus | Why the body reads differently |
|---|---|---|---|
| Spore Gardener | support, summons | Puffball / earthstar | Squat, round, splits open. Summoning is seeding. Low and wide. |
| Fungal Sage | caster | Bracket / shelf fungus | Layered shelves growing off her own back. Reads ancient through growth rings, not a beard. Lopsided, broad. |
| Spore Alchemist | support | Fly agaric | **Barely changes.** She is the tone reference already; she is the classic silhouette the others differ from. |
| Moldshaper | support, debuff | Slime mould | The one with no fixed shape — spreading, dripping, re-forming. Unstable outline. |

Four separable silhouettes, one palette family, and not one of them needs a robe. Names should follow
the fungus rather than the job, which is what E1 is actually asking for — but names are Noodle's.

**LANDED session 44.** The axis was taken as written. Spore Gardener → **Earthstar**, Fungal Sage →
**Bracket Elder**, Moldshaper → **Witch's Butter**; the Spore Alchemist is unchanged, deliberately,
because the tone rule cites her by name as its worked example of the register and the other three are
what differ *from her*. Move names that named a job rather than a creature went with them: Spade →
Stiff Ray, Replant → Seed, Mire → Overgrowth, Rot Touch → Slick Touch (nothing rots). `beast` left
the Earthstar's tags — she was half-animal only because the robe had to be worn by something. Four
encounters that named the job titles were renamed with them. No role, health or move-list change.

---

### E2. Region 2 is a taxonomy list ☑ — THE WORST FLAVOUR

> Region 2 is a taxonomy list. Silt Crawler, Mire Eel, Bog Toad, Lantern Jelly — adjective plus
> animal, and the sidecar tags are literally "crab", "eel", "toad", "jellyfish". Compare to the
> enemies I made by hand in 13 spire images\_source\refsPNG\enemies. The previous issue is the
> densest, this is definitely the worst flavor. They don't fit into the existing tropes at all, and
> this is an adult game too, which leads into issue 3.

The "sidecar tags" are the second token of each prompt file in
`v13 spire images/_source/refsPNG/enemiesOwed/` — `fantasy, enemy, crab, river crab`. In those files
the design *is* the prompt, which is where the gap shows plainest: the hand-made alchemist prompt is a
person with a situation, the owed silt-crawler prompt is a wildlife plate. The lantern-jelly prompt
ends on `no face`, on an enemy whose mechanical job is Charm.

**LANDED session 44.** All five recast as frontier myconids under arms, each read off the move list it
already had so the mechanics justify the fiction: Silt Crawler → **Shieldcap** (a dome-capped
skirmisher behind a looted pavise; `plated` was describing scavenged plate all along), Mire Eel →
**Cagecap** (a cage fungus whose lattice closing IS its Restraint move), Bog Toad → **Bolete Hook**
(the tongue that drags a back-liner forward becomes a looted hooked halberd), Lantern Jelly →
**Foxfire** (a myconid lamplighter — *with a face*, which is the `no face` complaint answered), and
the Drowned Salvager → **Scrap Salvager** under E4 below. Twelve encounter names that carried the
dropped water theme went with them. Nothing moved act, and nothing changed role, health or moves —
except the Salvager, whom Noodle promoted to elite in the same session (E10).

---

### E3. The roster barely expresses Lust ☑

> The roster barely expresses Lust. Only Glowcap Moth, Lantern Jelly and Gloom Wisp touch it. The
> enemies test poison, thorns and tHP like a standard deckbuilder, while the resource that makes this
> game itself are significantly underexplored. Region 2's enemy set obviously makes it harder to work
> in more lust.

Measured: **14 of 113 enemy moves deal Lust (12%)** — Charm 5, Venom 4, Restraint 2, Exposure 2,
Torment 0. Thirteen of 24 enemies have no Lust move at all, including three of Region 2's five.

**Noodle's direction on when to use the arithmetic:**

> Definitely save this math for when it comes time to actually rework the enemies.

**That time is now.** The arithmetic he asked to hold is written up as the headline section of
`CATCH-UP.md`, "The Lust shortfall", and in full in `../lust_events/RATE.md`.

The short version: rank 1 costs 32.5 Lust points of one tag on one character — 5 to 8 landed hits —
and 12% delivers roughly 1–2 per fight, scattered over three characters. Raising the lust-move share
costs **no** authored scenes; adding a tag costs 21.

**Design target: roughly a quarter to a third of enemy moves deal Lust, against 12% today.** Every
enemy should answer which Lust tag it teaches the way it already answers which role it fills — and a
Lust move with no tag in its `tagArray` teaches the ledger nothing at all, so it does not count.

**E3 is the measure of whether the overhaul worked.** E1 and E2 are about whether the roster reads
well; this is about whether it plays the game's own resource. A rework that fixes the names and leaves
this at 12% has missed the point.

**LANDED session 44. Measured 12.9% → 25.7%**, inside the target band, and the number is now an
instrument rather than a one-off count:

```
node "!designDocs/honeycomb/tools/lust-share.js"
```

Thirteen moves changed, each chosen from a move the enemy already played so the tag is legible from
what it does. **Six are 1:1 conversions of damage into Lust**, which leaves `enemy-template.js`
reading the identical threat, and the rest went into slack a boss or a support already had —
*nobody got harder*, and the count of out-of-band rows in `enemy-template.js` is unchanged.
**No new lust tag was introduced:** Torment stays at zero because a fifth tag costs 21 authored
scenes and `exposureDecayPerGrowth: 0.5` means a wide vocabulary erodes itself.

**Corrected by the second pass of the same session**, after Noodle pointed at the design bibles. The
first pass had put Lust on all thirteen silent enemies and tagged six of them Venom, which produced
two faults the bibles name outright:

- **Act1-A gained a Restraint theme.** The story bible gives it *"much less focus on lust"*, and
  identities belong to Act1-B (venom) and Act1-C (charm). The Shieldcap and the Bolete Hook — the two
  bodies the sub-act fields most — had their Lust taken back out, so they now deliberately teach no
  tag at all. They are the only two in the bestiary that do, and the suite pins that at exactly two.
- **Act 1-1 became a venom monoculture**, nine of its line-ups teaching venom alone. The Mechanical
  Bible §5 gives Act 1 *"lineups that don't all hone in on a particular area"* and reserves the
  opposite for Act 2 — and saturating the base biome with venom pre-spends the identity Act1-B is
  supposed to arrive with. Three additions moved to the tag their creature actually supports: Witch's
  Butter to **restraint** (a slime mould spreads over a thing and holds it), the Spore Alchemist to
  **charm** (she is not doing anything to anybody; she is enjoying herself and it is catching), and
  the Kobold Scavenger to **exposure** (the cargo cult's own kit list is *"hoses and weed sprayers…
  loaded with acidic spore-sludge"*, and what acid takes off a party is its gear).

Tags after the correction: **restraint 8, venom 7, charm 6, exposure 5** — no tag holding more than
half, which the suite now enforces. Line-ups teaching one tag alone fell from 11 to 7, and every one
of the 7 is a line-up built from two copies of the same minion. Per-move detail is `../RECAST-01.md` §E3.

---

### E4. An animal route must be a decision, not a shortcut ☑

> I don't mind an animal-themed act1-2 variant, but that needs to be intentional, not a design
> shortcut. Fantasy-themed enemies affected by spores though maaaay slightly encroach on act 2
> territory.

**Session 42 answered this, and the answer goes against the animal set.** Read mid-session,
`../designBibles/mechanics.md` named Act 1 *"Fungi & Fauna"*, which looked like permission for a fauna
route. Noodle then renamed it:

> Actually, maybe fungi & flora would be better.

So Act 1's two kingdoms are **mushrooms and plants**, and his own route list — more mushrooms
(the live Act 1-2), flora-focused, and a third still owed — has no animal route in it at all.

**And session 42 then landed it.** Act 1's third route is **the Pollen Road** — Earth's leftover
pollinators plus the native fey, all of it dusted (`../designBibles/story.md` §4). Noodle:

> Pollen Road is absolutely peak 100% let's lock it in because we can make the enemy theme shared
> between mothy pollenators and the fey.

Session 42 then named the sub-acts, and **the five do not become Pollen Road residents.** The live
Act 1-2 is **Act1-A, the Mushroom Frontier** — its boss is already the Juggernaut. So the recast
target is Noodle's own description of it:

> Larger, semi-intelligent myconids have started building a society, using mana-infused mushrooms as
> lumber. [...] Shrooms are notably using more human weapons and armor. Mechanically, much less focus
> on lust.

The five keep their slots, roles, stat lines and move lists and become **frontier myconids under arms**
— which suits them better than a Pollen Road recast would have. Their move lists are already
low-lust (three of the five deal none), and Act1-A is explicitly the low-lust sub-act, so the numbers
and the fiction agree without either being touched. Silhouettes survive too: a plated low crawler is a
shield-bearer, a tank with a grabbing tongue is something with a hook or a polearm.

The Pollen Road is **Act1-C** and is empty — it gets new enemies rather than recast ones, which grows
the roster and serves the Variety law rather than fighting it.

The Drowned Salvager looked like the one that could not be recast cheaply — a kobold with a car
battery, both halves Act 2 material. Noodle settled it without moving anything:

> "Drowned Salvager" can fill a similar role to the scavenger, an intruder from Act 2 who's an elite
> enemy down here in act 1.

The act bleed becomes a **category** rather than a mistake: Act 2's people come down here, and the
Kobold Scavenger is the precedent already in the game. The Salvager keeps its slot and its battery and
is read as a trespasser rather than a local — its scrap stops being a lore violation and becomes the
tell. The story bible's *"Nothing in Act 1 should be carrying scrap"* now needs the exception written
into it.

⚠ **Confirm before building on it.** The Kobold Scavenger is `role: "elite"`; the Drowned Salvager is
`role: "soldier"`. If "an elite enemy down here" means it should actually *become* an elite, that is a
stat change and belongs to `../rework/enemies/`. If it means only that it shares the scavenger's
fiction, nothing moves. Assumed the second.

On the encroachment worry: what currently bleeds into Act 1 is not fantasy humanoids, it is **Act 2's
kobolds and their Earth-scrap Thunder Boxes**, already fighting in the Flooded Vault. The rebuilt
story bible states it outright — *"Nothing in Act 1 should be carrying scrap."* See `CATCH-UP.md`.

**LANDED session 44**, on the second reading of the ⚠ above: the Salvager keeps `role: "soldier"` and
nothing about his numbers moved. He is now the **Scrap Salvager** — the water word was the only part
of him that belonged to the dropped theme — and his table entry says in so many words that he is the
one non-myconid in the sub-act and that the read is Act 2 scrap on an Act 2 body. **The elite question
is still unanswered and is carried forward as E10 in the live file**, because it is a stat change and
belongs to `../rework/enemies/`.

---

### E6. Cordyceps Husk — retool to a mushroom soldier ☑ — FIRST CONCRETE RECAST

> Let's retool Cordyceps Husk to just be a mushroom soldier who uses the shield sprite.

Settles the one enemy the tone rule bans (a zombie adventurer with stalks out of its back) and that
retool-don't-relocate protects from being cut. It keeps its slot in Act 1-1, its `soldier` role, its
stat line and its move list — including `huskCough`, its Venom lust move, which a mushroom soldier
carries as comfortably as a husk did.

Art: `v13 spire images/_source/refsPNG/enemies/shield.png` — *"myconid, mushroom head, tree bark,
full armor, holding shield, wooden armor"*. It also clears an `artOwed` placeholder.

⚠ The Bark Sentinel already uses that drawing. Confirm whether the two share one sprite with a
recolour, or whether the shield ref is only the img2img source for a new drawing. Two enemies that
look identical on the same screen is the silhouette problem in miniature.

Knock-on: the `undead` tag loses one of its four enemies. The remaining three (Gloom Wisp, Hollow
Knight, Hollow Champion) are wisp-or-empty-armour, which the tone rule's *"exception to cute zombie
girls"* covers comfortably.

**LANDED session 44** as the **Sporeguard**, tags `plant`/`poison`, role and stat line and move list
untouched. Lurch → Shield Shove, because only a shambling body lurches. **The ⚠ is answered: the
shield ref is the img2img SOURCE, not a sprite the two share** — the two are fielded in the same
region and can stand in one fight, so the enemy's table entry now carries the separation in writing
(the Sentinel is bark and rooted, its shield IS its body, wide and low; the Sporeguard is upright and
narrow and CARRIES its shield, with the cap breaking the helmet line). Recorded in `../INFERENCES.md`.
The `cordycepsHost` status kept its save-referenced index but is displayed as **Seeded** — "Cordyceps"
is the single word the tone rule blocks by name.

---

### E10. Is the Scrap Salvager supposed to BE an elite? ☑ — ANSWERED BY NOODLE, SESSION 44

Carried out of E4, which flagged it and assumed an answer rather than taking one. Noodle:

> "Drowned Salvager" can fill a similar role to the scavenger, an intruder from Act 2 who's an elite
> enemy down here in act 1.

The Kobold Scavenger is `role: "elite"` (130 HP). The Salvager is `role: "soldier"` (64 HP) and
appears three times a run as a normal. **Session 44 assumed "elite" was describing his fiction, not
his role**, and changed nothing but his name — because promoting him is a stat change, it would empty
three encounters, and retool-don't-relocate is about exactly this kind of quiet move.

If he really should be an elite, that is `../rework/enemies/` work and it needs replacement bodies for
`salvageCrew`, `The Toll Post` and `Scrap Patrol`.

---

**ANSWERED, session 44. Noodle:**

> Scrap salvager's definitely an elite.

So the session-44 assumption was wrong, and "an elite enemy down here in act 1" was describing the
role rather than the fiction. Built the same session: role `elite`, health 64 → **135** (written
between the Kobold Scavenger's 130 and the Hollow Champion's 140, the two elites he now stands
beside), Spark Spear 10 → 14 and the charged Discharge 7 → 10 to carry the promotion, and the gold
reward raised to the elite band.

**The encounter table was rebuilt around him**, which is most of the work: an elite still fielded
three times a run as a normal body is a promotion in name only. He left `salvageCrew`,
`drownedPatrol` and `vaultGuard`, each of which took another Act1-A body in his place and kept its
budget, and he left the elite pair `championDeep` so two elites never share a fight. He gained two
elite encounters of his own, mirroring how the other two R2 elites are fielded — **The Salvage Crew**
(middle) and **The Stripped Grove** (late). A new normal middle encounter, **The Frontier Post**,
replaces the line-up he vacated so the tier keeps its spread.

`enemy-template.js` after: every encounter ✓ on health, and the count of out-of-band rows is
unchanged at nine.

⚠ **One consequence Noodle should see.** `encounter-coverage.js` now puts him at **14% of runs**,
down from appearing three times in most of them, and the rarest non-boss in the game. That suits a
trespasser and it serves the Variety law, but it is a large swing and it was not separately asked
for. R2's late elite tier fires in only 0.07 fights per run, so his late encounter is nearly a
formality — if he should be met more often, the fix is another middle-tier elite encounter, not a
stat change.

---

### E7. Act1-B and Act1-C have no enemies ◐ — DESIGNED SESSION 44, BUILD BRIEF IS `HANDOFF-E7.md`

> the demo ships with act 1-1 and act1-2, so all three routes are in scope

Act1-2 is three sub-acts and **two of them are empty**. This is the largest piece of work the overhaul
has, and it is additive rather than a recast — which means it serves the Mechanical Bible's Variety
law instead of straining against it.

Sizing, from what Act1-A carries today:

| | Act1-A *(live)* | Act1-B | Act1-C |
|---|---|---|---|
| Normal enemies | 5 | **0 — wants ~5** | **0 — wants ~5** |
| Bosses in pool | 2 (Juggernaut, Tallyman) | **0 — wants ≥1** | **0 — wants ≥1** |
| Lust focus | *"much less focus on lust"* | *"the hotspot for venom and poison"* | *"probably charm"* |

Roughly **+12 enemies**, taking the roster from 24 with move lists to around 36. Their numbers,
roles and encounter budgets belong to `../rework/enemies/` and `../tools/enemy-template.js`; this
folder owns who they are.

Starting material is in `../designBibles/story.md` §4 — Act1-B: *"Alarunes? Dryads? The AI can
generate a neato PvZ style sunflower"* (alraune is the usual spelling); Act1-C: fey lounging on top of
oversized, extremely stupid moths.

`map/` B31 owns getting a run to them at all.

**Session 44 settled the design and wrote the build brief: `HANDOFF-E7.md`.** It is self-contained —
art picked per enemy, role and budget numbers copied out, lust tags assigned, the map-wiring trap
documented, and the three side jobs (Glowcap Moth → mushroom, Mold Leech reconceptualised, the
intruder elite rework) specified in Noodle's words. **Noodle confirmed all three routes ship.**

Three things the build can take for granted:

- **The Lust target is met on the existing 24 (27.7%), so the new twelve must not drag it back down.**
  Design each one with its tag decided, and re-run `../tools/lust-share.js` after. Act1-B is the Venom
  hotspot and Act1-C is Charm, which is convenient: both tags already exist, so **the +12 can be
  written without authoring a single new lust scene**.
- **The art is chosen per enemy**, not just per act: `v13 spire images/_source/enemy inspo variants/assigned/`,
  one image per slot, with an index file saying which is which. Act1-B's boss is the **thickmantis
  day/night pair**; Act1-C's is **`feralbeast-c`**, the chained moth-beast.
- **The recast set is the register to match** — read `RECAST-01.md` before writing a new one, so the
  twelve do not arrive in the voice the recast just removed.

---

#### CLOSED SESSION 45 — built, budgeted and switched on

Both routes ship. Act1-B is **The Thorn Arbor**, Act1-C is **The Pollen Road**, and which one a run
reaches is decided by the Act1-1 boss it just beat (`tuning.map.route`). The full morning report is the
block at the top of `../CATCH-UP.md`; the measurements are `E7-VERIFICATION.md` beside this file.

Delivered: the route mechanism landed OFF and then switched on; **twelve enemies** — five normals and a
two-body boss per route — 24 normal encounters, four elite encounters neither route had, the Tallyman
moved up to Act1-1 and re-budgeted, and the Glowcap turned from a moth into a mushroom.

**Two jobs were deliberately NOT done**, and they stay open in the live `../FEEDBACK.md` as
**E7-DEFERRED**. Both change the one
act players have already been playing, the night before it ships, and neither can be play-tested before
it does.

