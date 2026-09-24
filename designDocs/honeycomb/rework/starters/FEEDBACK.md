# Starters, outfits and relics — FEEDBACK

What a character starts with, which outfits unlock and how, and the relic and heirloom set.

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

### A5. Free per-fight healing against the campfire — ANSWERED (session 39) ☐ → B22

> The most overpowered Spire relics are included in base kits (healing after battle…) which makes
> resting at campfire useless.

> Mark crimson fang, votive candle, and bone necklace as relics to replace in the relic rework.

Confirmed, and widened: **`boneNecklace` joins the list**, which session 38 had not flagged. These three
are marked for replacement rather than tuning — see **B22**, which also carries his much larger call
that starting relics should not exist at all.

---

### B19. Character order ☐

> Character order. The order should -always- be two groups of three. The "simple" starter trio as the
> first three characters in the roster, Brienne (first char, basically the mc and game's face), Nettle,
> and Severine. Then the "complex" trio, Cassadora (always 4th, because her mechanics show players
> instantly this isn't just a slay the spire clone), Cinder, and Clemence. I do find it a little
> troublesome that the simple characters are so simple, but only more testing can answer what we need.

Fixed order, everywhere a roster is rendered:

| 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|
| Brienne | Nettle | Severine | Cassadora | Cinder | Clemence |

The two constraints that carry reasons and must not be quietly reordered: **Brienne is first** as the
game's face, and **Cassadora is always fourth** because she is the first character who demonstrates the
game is not a Slay the Spire clone. Position 4 is doing pedagogical work — it is the first pick after
the simple trio.

This should be a single ordered source the roster, teambuilding and compendium all read, not three
hand-ordered lists. **VERIFY** whether one already exists.

His open worry — the simple characters being too simple — is deliberately left unanswered: *"only more
testing can answer what we need."* Do not act on it.

---

### B22. Relic rework ☐

From A5, plus a much larger call:

> Mark crimson fang, votive candle, and bone necklace as relics to replace in the relic rework.

> Three starting relics for a party of three is way too many. Characters probably shouldn't start with
> ones either, they should be unlockable.

Two changes:

1. **Mark for replacement:** `crimsonFang`, `votiveCandle`, `boneNecklace`. Replace, do not tune — the
   measured problem (A5) is that free per-fight healing makes the campfire pointless, and the campfire
   is also where removal and upgrades live, so it is the most contested node in the run.
2. **Cut starting relics.** Three for a party of three is too many, and his lean is that characters
   should start with **none** — relics become unlockable instead.

Point 2 routes straight into **B4** (distribute unlockables through the game): relics joining the
unlockable pool is more content for a seam that already exists and has no authored nodes. Do them
together.

---

### B1. Unlock routes ☐

Verified session 38 on a fresh profile: **all 25 outfits report unlocked**, including every alt. Since
each alt outfit carries 3 commons and 2 rares, the whole 21 C / 11 R pool per character drops from the
first reward screen, which is exactly what the pool was sized *not* to do. The seam is there —
`honeycomb.unlocks.isUnlocked("outfit", …)`, `offerCondition: { index: "outfitUnlocked" }` on the gated
cards, and `unlockOutfit` on a tree node — so this is authoring which routes open which outfit, not
engine work.

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

### P26. Copycat Quill and Ember Spurr need replacing ⏸ — NOT DONE, AND IT NEEDS HIM

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

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../../FEEDBACK.md` instead)*
