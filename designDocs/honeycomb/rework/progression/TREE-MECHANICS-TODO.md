# TREE-MECHANICS-TODO — the verbs the six trees need

> **The authoritative list of still-unwired nodes is `WIRING-STATUS.md`.** This file is the working plan;
> that file is the per-node truth. Keep them in step.

The trees are implemented structure-first (`../../tools/generate-progression-trees.js`). Every node exists with its
name, description, position, prerequisites, exclusivity, rank and cost; the effects whose engine verb
does not exist yet are description-only. This is the work list, and `../../tools/test-honeycomb.js` block **[87]**
holds a pending assertion for each — add the node to `wiredMechanicSet` when its verb lands and the
check starts enforcing.

## Card-type correction (Noodle) — do not forget

> Cassadora and Nettle's attacks that deal 0 damage and inflict 3 of a debuff must change card type from
> `damage` / `negative` to **pure `negative`**.

**Status: BUILT (session 29).** Wither, Acid, Hex and Twist carry `negativeIfZeroDamage: true`;
`applyStarterUpgradeFields` sets `typeArray: ["negative"]` only at the rank where every damage line is
0 (rank 1 still deals 2, so it stays damage+negative). Block [87] checks the rank-1/rank-2 difference.

These are the Exclusive A / replacement forms that strip the attack's damage:

- **Nettle — Wither / Acid** forms that "deal 2" become all-debuff: pure `negative`.
- **Cassadora — Hex / Twist** forms that "deal 2" become all-debuff: pure `negative`.
- Check the same for any card whose only damage is the base 2 and whose payoff is a 3-stack debuff.
- `typeArray` drives the tint, the card frame, and the archetype weights, so a pure-negative card must
  read as one.

## Strip these defaults first, or the matching nodes do nothing

From `FEEDBACK-07` §G. These are live character defaults that pre-empt a node:

| Live default | Node that owns it now | Strip | Status |
|---|---|---|---|
| Nettle `partyShiftByCardType: { damage: "back" }` | Creeping Rot (attack or negative moves her back) | Remove the character field; the node covers attack **and** negative | ☑ stripped; `netCex1` carries `partyShiftByCardType` |
| `startingAbilityArray` grants A1 from the start | Ability 1 node grants A1 | Empty `startingAbilityArray` until that node is bought | ☑ all six emptied; the node is the only source |
| Rest/shop `upgradeCard` can hit starters | (ban, not a node) | Sharpen and any upgrade service refuse starter + outfit-signature cards | ☑ `honeycomb.cardIsUpgradable` consulted by every upgrade seam |

Block [87] now asserts the empty state directly: a fresh engine holds no A1, Nettle does not shift back
before Creeping Rot, and starter/signature cards report no upgrade ladder.

## Verbs to add

**Deck / starter edits** — ✅ `add` (`cardAdditionArray`) · ✅ `+D` · ✅ `remove` (`cardRemovalArray`) ·
✅ `−A/−D` · ✅ `R.A./R.D.` (`randomReplaceArray` at `newRun`)
- ✅ Exclusive A in-place starter upgrade (`starterUpgradeArray`; the per-character deltas ship in the generator).
- ✅ Exclusive D "choose one" rewrite of the defensive basic — `starterUpgradeArray[].replaceEffectArray` builds the `chooseOption` form in place, no variant card needed.
- ✅ Training wheels: `abilityUpgradeArray` repurposes the A1 ability in place and sets `disableMechanic`; `abilityHasEnable` / `mechanicActive` read it.
- ✅ U1: double the cards the worn outfit adds. ✅ U2: pool rows carry `upgradeLevel`, and `outfitCardUpgrade` starts the worn outfit's cards upgraded (a no-op until a signature has an upgrade ladder).

**Economy (all SHARED; every row is live and enforced in block [87])**
- ✅ XP (`personalExperienceMultiplier`) · ✅ Gold (`startingGold`, ranked) · ✅ Collector (`collectorWeight`)
  · ✅ Unseen weight (`unseenCardWeight`) · ✅ Cheaper unlocks (`unlockDiscount`).
- ✅ Reroll1/2 (party / profile) · ✅ Banish1/2 (party / profile) · ✅ Bounty1/2 · ✅ Shop1/2.
- ✅ Opening card/energy (`OpenD` / `OpenE`).

**Run (all wired)**
- ✅ Fortitude (lust weakness ranks capped at 1).
- ✅ Rest1 (character rest function, party) → Rest2 (same, benched) · ✅ Rest-A (one more action) ·
  ✅ Rest-B (Sleep heals more). The campfire menu is now built at open time from `honeycomb.restOptionArray`
  and the party's selected nodes (`honeycomb.rest`); block [87]'s Rest1 assertion passes and block [89]
  covers the whole table, the unlock rules and every option's effect. Debug tool: **Rest Lab**.

**Character-specific (C.Ex.1/2/3)** — see `SKELETON-MAPPING.md` §5 for the assignment.
- **Live and enforced in block [87]:** Brienne Hold Fast, Vanguard, **Taunt** · Nettle First Rites,
  **Creeping Rot**, **Penny Pincher** · Severine Feast, Thin Skin · Clemence Overflow · Cassadora
  **Tidy**, **Investment** · Cinder **Recover**.
- **Wired as `hooks` but not asserted:** Severine Challenger, Clemence Martyr, Comfort.
- **Still field-only:** Cassadora Studied Foe (needs bestiary gating — the Compendium shows every move
  set today), Cinder Drilled (redundant: Vulnerable already fades 1 at end of turn for everyone; the node
  wants a rewrite, see `FEEDBACK-07` §G), Cinder Soothing (needs the rest-site pass to know when a rest
  heal happened).

## Abilities

- **All six characters' A1 and A2 now match their tree text (session 29).** Brienne Dig In/Aegis, Nettle
  Blight/Undead Army, Severine Blood Tap/Quicken, Cassadora Glimpse/Magic Trick, Cinder
  Backflip/Phoenix Dive, Clemence Absolve/One with Nothing. Cassadora/Cinder/Clemence A2 were authored;
  the other nine were older designs and were rewritten. New verbs: `mechanicOrbs` value, `endTurn`
  effect. Block [95] holds the alignment.

---

## Deferred / parked (with the reason)

Work consciously set aside. Each has a reason, so a future session knows whether it is blocked or just
not worth doing yet.

| Item | Parked because | Revisit when |
|---|---|---|
| **Mechanic-reliant cards before A1** | a card that reads a character mechanic (Resolve, Harvest, Thirst, Stride, Devotion, Foresight) can be offered in a reward or shop before that character's **Ability 1** node is bought, where it does nothing. Mechanics themselves are already gated behind A1 (`mechanicActive`), but the OFFER is not | the card/offer pass: gate an offer on the mechanic's `abilityIndex` being unlocked (add the field to `mechanicArray` — it is already there) |
| **Stand-in card mechanics** | ☑ **Built (session 26).** `scry` (Read is Scry 3, counting only the top cards), `randomStatus` (Ill Wish), the `healthFraction` value + `anyOf`/`allOf`/`conditional` (Finish doubles on target **or** Severine below half), and `debuffCount` read source-relative (Recede). Block [88] holds all four. | — |
| **Cassadora/Cinder/Clemence A2** | ☑ **Built (session 29).** Three abilities authored and granted by the capstone. | — |
| **Nettle/Cassadora card-type flip** (0-dmg attacks → pure `negative`) | ☑ **Built (session 29).** `negativeIfZeroDamage` flips the card only at the rank its damage reaches 0. | — |
| **U2 "outfit cards start upgraded"** | ☑ **Built (session 29).** A pool row carries `upgradeLevel`; `outfitCardUpgrade` sets it. No shipped signature has an `upgradeArray` yet, so it is a no-op until the outfit pass. | outfit pass (add ladders) |
| **Rest1/2 + Rest-A/B** | ☑ **Built (session 26).** `honeycomb.restOptionArray` holds all NODES-LIST §D options; the campfire merges the party's selected Rest nodes at open time. Assignments and the four spare options are in `SKELETON-MAPPING` §5. Block [89]. | — |
| **Exclusive D rewrites + Training wheels** | ☑ **Built (session 29).** `replaceEffectArray` builds the choose-one defensive form in place; `abilityUpgradeArray` + `disableMechanic` repurposes A1. `cardReplacementArray` / `abilityReplacementArray` were not needed. | — |
| **Outfit-unlock window** | STARTER-REWORK-01 §1.4 wants a window on unlock showing the outfit, its signature card, and the newly-offered cards; no unlock window exists yet | outfit/unlock pass |
