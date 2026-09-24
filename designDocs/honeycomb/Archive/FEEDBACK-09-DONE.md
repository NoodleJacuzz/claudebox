# Honeycomb — FEEDBACK-09, finished work

Items closed out of the live `../FEEDBACK-09.md`, quote and annotation together, so the live
file reads as open work only (`../BASICS.md`, "Keeping the feedback documents current").

Two of these have live successors and keep a one-line pointer in the live file: **C1 was
reversed by A3** and **C2 widened into B20**. The work below still describes what was built.

---


## C. Closed on the way into this file (session 38)

### C1. The rarity gem ☑ — SUPERSEDED by A3 (session 39)

> remove the rarity gems from common cards

Done session 38, and it made the gem mean something for the first time. The gold gem
(`cards/chrome/rarity_gold`) was a chrome piece drawn on **every** card — starter, common, rare, curse,
enemy move alike — so it signalled nothing. It became opt-in per rarity:
`honeycomb.cardRarityArray` carries `showRarityGem`, the chrome piece carries `rarityGem: true`, and
`honeycomb.cardShowsRarityGem(card)` is what the renderer asks. Only **rare** said yes. Verified in a
browser: `enemy:0 starter:0 common:0 special:0 broken:0 rare:1`. Tests in block `[104]`.

**Session 39 reversed which rarity wears it** — see A3. Gem now on **common**, off **rare** (vertical
orientation marks rare instead), off starter. The mechanism built here is unchanged and is what makes
the reversal a two-flag edit; the block `[104]` assertions need rewriting, not deleting.

### C2. Moss is Nettle ☑

> moss should have 1, Brienne having 6

Answered: **moss is Nettle's former name**, so the ranks assigned in session 37 stand — Brienne 6,
Severine / Cinder / Clemence 3, Cassadora 2, **Nettle 1**. Nothing in the code carries the old name.
Locked into the suite so a later tree edit cannot quietly move it.

**Session 39 widened this into B20** — Moss/Nettle is one of four protected renames, and `skull`
(Cassadora's former codename) may still be live in the code.

### C3. Brienne's Resolve ☑

> Brienne should only be gaining resolve when she takes damage, to make it simpler, 1 for every point of
> damage taken.

Open in round 07, and **it landed in session 33** without being annotated there. `resolve` is
`pointsPerDamage: 1`, `resetOn: "combatStart"`, `maximum: 100`, and its hooks are `onDamaged` and
`onTemporaryAbsorbed` — a blow her Temporary HP soaked counts the same, which is the same rule. The
Bastion outfit's `resolveFromTemporaryLost` is a deliberate outfit override, not the base rule.

---

