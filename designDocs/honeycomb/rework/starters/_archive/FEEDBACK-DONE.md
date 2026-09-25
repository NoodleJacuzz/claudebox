# Starters, outfits, relics -- finished feedback

Closed items, quote first. The open queue is `../FEEDBACK.md`.

### P1. Whetstone relic does nothing ☑ — FIXED SESSION 55

> Whetstone relic does nothing

**It is equipment, not a relic, and it was being spent by a preview.** The Whetstone gives +2 damage on
the first attack each turn. It does that by setting a flag on the wearer at the start of the turn and
clearing the flag inside its `modifyDamageDealt` hook.

`honeycomb.modifiedDamage` is shared between the real hit and every preview of one — the live number
printed on a card in hand goes through the same pipeline, which is deliberate, so a card can never
promise a number it will not deliver. The hand is re-described every beat. So the first time the hand
was drawn, the preview cleared the flag, and the play got nothing.

Measured before the fix, on Brienne with a Whetstone, asking for the damage on a printed 10:

| Call | Answer | Charge afterwards |
|---|---|---|
| first preview | 12 | spent |
| second preview | 10 | spent |
| the actual play | 10 | spent |

**The fix is in two lines.** `honeycomb.describeAmount` now marks its context `preview: true`, and the
Whetstone's hook only spends the charge when the context is not a preview. After it, five previews in a
row print 12 and the play delivers 12.

**This was the only hook in the game with that shape.** A scan of every `modify*` hook in the content
tables for one that writes to `params.entity` found the Whetstone and nothing else, so nothing was fixed
by accident and nothing else is owed. Suite block [129] holds it.

---

### P2. Cracked Ampoule shouldn't appear if you don't have a poison character ☑ — FIXED SESSION 55

> Cracked Ampoule shouldn't appear if you don't have a poison character

**It already said so. The chest was not asking.** The Cracked Ampoule has carried
`offerCondition: {partyContains: "nettle"}` since session 8, and `honeycomb.relicOfferable` is what
tests it. The fight reward asks. The shop asks. **The treasure chest built its own candidate list and
never asked**, so it could hand out every character-gated relic in the game.

Measured on a Brienne-and-Cinder party, rolling the chest 400 times:

| | Count |
|---|---|
| Relics the chest could produce | 24 |
| Relics the gate allows | 12 |
| **Leaked past the gate** | **12** |

The twelve were Cracked Hourglass, Leech Jar, Honeyed Thorn, Prayer Beads, Trophy Cord, Sleight Purse,
Halo of Thorns, Cracked Ampoule, Reliquary of Tears, Vitae Chalice, Rat King's Bell and Copycat Quill —
every relic that names a character, which is half the pool.

`honeycomb.rollRelicOffer` now draws from `honeycomb.uncarriedRelicArray`, the list the fight reward
already used. That also gets it the duplicate rule for free: it refuses a relic that WOULD duplicate
rather than only one already held. Suite block [129].

---

### P3. Mulligan stone should not appear if max rerolls is 0 ☑ — FIXED SESSION 55

> Mulligan stone should not appear if max rerolls is 0

The Mulligan Stone refills the reroll pool after every battle. A run whose reroll maximum is zero has no
pool, so the relic refills nothing — and it is a rare, which is the slot a run can least afford to waste.

Gating it needed one thing the engine did not have: a way to read a resource's MAXIMUM as a value. The
`resource` value read only what is left. It takes `maximum: true` now, and the relic's `offerCondition`
is an ordinary `compare` against zero. A run with no reroll pool is not offered it; a run that has
earned rerolls is.

**A default run has a reroll maximum of zero**, so in practice the Stone is now only offered once
something has granted a reroll. Suite block [129] holds both halves.

---

### P4. Starting common relics don't show on artifact list ☑ — FIXED SESSION 55, AND THE READING NEEDS CHECKING

> Starting common relics don't show on artifact list

**The reading.** Nothing in the game grants a relic at the start of a run — `run.relicArray` begins
empty, and there is no relic of rarity `starter` in the table. What a party DOES start with is the
heirloom equipment each character wears, and the note beside it in the code says the three starting
relics *became* heirloom equipment in round 02. So "starting common relics" is read here as that worn
gear. **If that is the wrong reading, say so and this can be undone in one edit.**

The gear was working the whole time. It was only findable by opening the party window and then a
character — the Relics window showed `run.relicArray` and nothing else, so on turn one it opened saying
"The party carries no relics yet" while three pieces of equipment were on and working.

The Relics window now has a second section, "Equipment", listing every worn piece in the run's party with
its rarity, its description and who is wearing it. It reads off the run, so the benched roster is not in
it, and it is drawn with the same row markup the relics above it use.

**Not done, and not guessed at:** whether the map's top bar should show the equipment too. That bar is a
strip of relic icons with a "…" when it overflows, and adding three more icons to it is a look, not a
bug.

---

### P25. A document of potential relic rewards ☑ — WRITTEN SESSION 55

> Need a document with potential relic rewards, including bonus rerolls and bonus banish

`RELIC-REWARDS.md`, in this folder. Four parts:

1. **Every relic in the game**, generated from the tables: all twenty-five, with rarity, which pool
   chance draws it from, what gates it and what it does.
2. **Where a relic can come from**, after this session's changes to the chest and the fight reward.
3. **The gap he named**, below.
4. **A menu of ideas** for the relics he asked about, deliberately unnamed, for him to pick from.

**THE GAP, because it is the answer to his note: no relic grants a reroll or a banish.** Every one of
either in the game comes from a progression node — Second Chance and Banish, and their "Always"
versions, on six characters. The only relic that touches them is the Mulligan Stone, and it merely
REFILLS what a node already granted.

So a player who has bought none of those nodes can never reroll a reward, and no relic will ever change
that. That is also why the Mulligan Stone is now gated (P3 above): in a default run there is nothing for
it to refill.

**Nothing was added.** Naming a relic is writing for the game, so section 4 lists what each idea would
do and leaves the name blank.

---

### P26. Copycat Quill and Ember Spurr need replacing ☑ — CLOSED 2026-09-25 (replaced sessions 55b to 55d)

> Copycat Quill and Ember Spurr need replacements immediately

What the two do today:

| Relic | Rarity | Gate | What it does |
|---|---|---|---|
| Copycat Quill | uncommon | Cassadora in the party | Cassadora keeps her stolen moves: they do not exhaust and a copy stays in her deck. |
| Spur of Embers | uncommon | Cinder in the party | The party member at the front deals 2 more damage with attacks. |

**He said replace, not remove, and he did not say what with.** A replacement is a new uncommon each,
gated to the same character, and naming and writing them is his. This is the one item in tonight's batch
that cannot be moved forward at all without a sentence from him, so it is filed rather than guessed at.

**What IS worth knowing before he writes them.** Both are character-gated, and session 55 measured that
fifteen of the twenty-five relics are, which is well over half the pool. A party without Cassadora or Cinder never
sees either of these, so whatever replaces them is only ever met by a run that brought that character.
`RELIC-REWARDS.md` §3's reroll and banish ideas are ungated, which is the other direction the two slots
could go.

**Closed 2026-09-25.** Session 55b replaced the Copycat Quill with the Dominion Rod (rare, 6 banishes for the run). Session 55c corrected the second half: the Spur of Embers RELIC stays, and the Ember Spur he meant was Cinder's HEIRLOOM, which became the Lucky Hat (2 rerolls); session 55d took the back-start off it at his word (`../../../Archive/playtest_55/READ-ME-2.md` §7, `READ-ME-3.md`, `READ-ME-4.md`).

---

### S59-1. Alt outfits stood on 1-basic for everything — DONE (session 59) ☑

> Alt outfits on teambuilding scene are displaying image 1-basic when default correctly displays 2-basic.

> Alt outfits don't even have a 2-basic? They should pull from default outfit before trying 1-basic as
> fallback. I'm fine with a recolored default outfit, I'm not as much okay with alts using 1-basic for
> everything when the default outfit has the sprites they need. Thank goodness I found this, otherwise
> anyone using alt outfits would have missed out on all my lovely new sprites.

Asked which way to do it, he answered:

> Priority 1: If the outfit has no real images at all, use copies of the equivalent default outfit's image.
> Priority 2: If the outfit at least has a real 1-basic, use normal outfit placeholder backup behavior.
>
> Resulting behavior should mean that current outfits would all default to using recolors of default
> sprites. However if I were to add basic-1 to bastion, all the bastion outfit poses would use bastion's
> basic-1.

**What was wrong.** Every alt outfit folder held a recoloured 1-basic and three tilted copies of it, and
nothing else. The game looks in the outfit's own folder before the default's, so an alt outfit never
reached the default's 2-basic, combat poses, hurt poses, Broken art, exposed or recover pictures.

**What changed.** The rule lives in the placeholder generator (`tools/generate-placeholder-art.py`,
`build_outfit_copies`). When an alt outfit folder holds no drawing at all, the generator copies every
picture in the default folder into it under the same name, recoloured with that outfit's colour recipe.
It recolours the full-size PNG original when there is one and scales it to the game's size. When an
outfit has a real drawing, it gets the old treatment: tilted stand-ins cut from its own 1-basic.

All 18 alt outfits now hold 12 to 18 recoloured pictures each, about 23 MB in total. A picture is only
downloaded when that outfit is worn.

A second list, `.copies.txt`, names the copies that were made from a real drawing. The sprite size table
(`tools/generate-sprite-metrics.js`) reads it, so the game does not treat those copies as stand-ins. That
matters because the Broken tint only goes on stand-ins, and a recoloured Broken drawing must not be
tinted a second time.

Checked in the browser: with a Lust Event ready, Nettle's default, Sporemother, Rotsinger and Nightshade
outfits each show their own 2-basic. Suite block [141].

To redo the copies after new default art lands: `python "!designDocs/honeycomb/tools/generate-placeholder-art.py" --only poses`,
then `node "!designDocs/honeycomb/tools/generate-sprite-metrics.js"`.

### S59-2. Outfit descriptions as bulleted lists — DONE (session 59) ☑

> Alt outfits desperately need bulleted lists for their descriptions otherwise their effects are a wall
> of text, and centered text is a bad choice for this.

`honeycomb.outfitDescriptionLines` turns a description into lines. A description written as an array is
used line for line. A plain string is split into sentences, one bullet each, so no outfit had to be
rewritten. Both screens that show an outfit's effect (the Outfits tab and the party window) draw it as a
bulleted list, and the text is left-aligned. Suite block [141].
