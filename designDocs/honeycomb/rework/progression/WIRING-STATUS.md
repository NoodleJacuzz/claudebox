# WIRING-STATUS — what every progression node actually does

> **⚠ Superseded in part by `../AUDIT-01.md` (session 30).** "Wired" below means a node carries a field the
> engine reads, not that it does what STARTER-LIST designs. The audit found wrong behaviour, dead wheels
> and wrong text in nodes this file lists as closed. Fix from the audit, then update this file.

**Read this before touching the trees or declaring the progression pass done.** The six trees are fully
*structured* (names, descriptions, prerequisites, ranks, costs), and every node's effect field is now
present except where noted below. A node whose effect field is missing is **description-only**: it does
nothing.

Regenerate the list any time with the same method used to build it: load the engine headlessly (the
`../../tools/card-inventory.js` loader), and for each `character.progressionTree.nodeArray` node print it when it
carries none of the read fields (`healthModifier`, `startingGold`, `personalExperienceMultiplier`, the
card/ability arrays, `randomReplaceArray`, `starterUpgradeArray`, `abilityUpgradeArray`,
`partyShiftByCardType`, `hooks`, `condition`, `unlockOutfit`/`unlockEquipment`, the economy fields,
`restOption`/`restActionsBonus`/`restHealBonus`, `outfitCardDoubling`/`outfitCardUpgrade`, and the
C.Ex flags).

## The unwired nodes (0 of 256, session 29)

**None.** Every node carries an engine-read effect field, and block [87] asserts each family. Cinder's
*Reversal* (`cinDef2`) was the last: STARTER-LIST's "swap; front-mover 4 tHP; back-mover strips a Weak
& Sundered" is wired as an `addEffectArray` on Change Places (`removeStatus` aimed at `backAlly`).

## Wired and enforced (do not re-add effects to these)

- **Mandatory**: Vigour/Start, Ability 1, Ability 2 — all six characters now have an A2 (Cassadora
  `cassadoraMagicTrick`, Cinder `cinderPhoenixDive`, Clemence `clemenceOneWithNothing` joined the
  existing Brienne/Nettle/Severine ones).
- **Deck edits**: `+A`, `+D`, `−A`, `−D`, `R.A`, `R.D`, `U1`, every Exclusive A path (in-place
  `starterUpgradeArray`), and every Exclusive D path (an in-place `replaceEffectArray` choose-one form).
- **Training wheels**: all 18 nodes carry an `abilityUpgradeArray` that repurposes the A1 ability and
  sets `disableMechanic`; `honeycomb.abilityHasEnable` / `honeycomb.mechanicActive` read it.
- **Economy**: XP, Gold, Reroll1/2, Banish1/2, Collector, Unseen weight, Cheaper unlocks, Bounty1/2,
  Shop1/2, OpenD/OpenE, Fortitude.
- **Run**: Rest1/2, Rest-A/B, every `honeycomb.restOptionArray` option.
- **C.Ex hooks/flags**: Brienne Hold Fast/Vanguard/Taunt; Nettle First Rites/Creeping Rot/Penny
  Pincher; Severine Feast/Thin Skin; Clemence Overflow; Cassadora Tidy/Investment/**Studied Foe**;
  Cinder Recover/Drilled/**Soothing**.
- **U2 "Tailored"**: the resolver is built — a pool row can carry `upgradeLevel`, and a selected
  `outfitCardUpgrade` node makes the worn outfit's added cards start upgraded.
- **Cinder Reversal** (`cinDef2`): Change Places also strips 1 Weak and 1 Sundered from the back-mover
  (`removeStatus` + `targetOverride: "backAlly"`).

Tests: block [87] (progression mechanics) and [89] (rest options); 1460 passed, 0 failed, 0 pending.
See `TREE-MECHANICS-TODO.md` for the remaining deferred list and `../../CATCH-UP.md` for the session log.

## Also still deferred (not a missing field on a node)

- **U2 has nothing to upgrade yet.** The outfit signature cards have no `upgradeArray` (starters cannot
  be upgraded), so Tailored is a correct no-op until the outfit pass gives the signatures an upgrade
  ladder.
- **Mechanic-reliant cards before A1**: a reward or shop can still offer a card that reads a mechanic
  (Resolve, Harvest, Thirst, Stride, Devotion, Foresight) before that character's Ability 1 is bought.
  The mechanic itself no longer ticks without A1 (`honeycomb.mechanicActive`), so the card is dead on
  arrival. Gate the OFFER on the mechanic's `abilityIndex` in a later card pass.

## Content-fidelity gaps — ALL CLOSED (session 29)

The following were wired-but-stand-in and have been replaced with the designed behaviour. Kept here so
the fixes are not reverted by mistake; the tests that hold them are in blocks [87], [94] and **[95]**.

| Node | Designed | Now |
|---|---|---|
| `netAtt3` **Cloud** / `casAtt3` **Twist** | "deal 2 (and 1 Poison/Sundered) to all, per rank" | `targetMode: "allEnemies"` + `replaceEffectArray` reset, so rank1 is 2 + 1 and rank2 is 0 + 2 — no primary-target double hit, no merge doubling. |
| `netAtt2` **Acid** | "deal 2, 2 Weak" → "inflict 3 Weak" | Poison swapped for Weak (`replaceEffectArray`), rank1 = 2 dmg / 2 Weak, rank2 = 0 dmg / 3 Weak. |
| `casWheel1` **Turnabout** | intent goes to your discard, costs 2 | `stealIntent` with `pile: "discardPile"`, `cost: {energy:2}` (`giveStolenCard` gained options). |
| `severineWheel3` **Full Control** | upgrade a damage card, play a copy on itself | `chooseCards` (damage, non-starter) → `upgradeTargetCard` → new `playChosenCardOnOwner`. |
| `cassadoraMagicTrick` | added moves cost 1 | `giveStolenCard` cost override `{energy:1}`. |
| `severineAtt3` **Price** | "the fifth hit to Severine" | read as five hits of 3 with the fifth on her; node text now says so. |
| `cinDef2` **Reversal** | "whoever moves back strips…" | `swapParty` gained `backEffectArray`, run on the entity the swap actually sent back. |
| `netDef2` **Reaper** option B | "pay 3 Souls" | the option carries `condition: mechanicAtLeast`, and the option chooser now receives the acting source, so it is hidden when it cannot be paid instead of no-oping. |
| 0-damage **type flip** | 0-damage Wither/Acid/Hex/Twist read as pure `negative` | new `negativeIfZeroDamage` flag: at the rank where every damage line is 0, `resolveCard` sets `typeArray: ["negative"]`. |
| **A1/A2 abilities** | STARTER-LIST's ability per node | every A1/A2 in the table now matches its node text: `brienneAegis` (spend all Resolve → party tHP, end the turn), `nettleBlight` (Poison per Soul), `nettleGraveward`/Undead Army (spend all Souls, 1 damage per Soul), `severineBloodTap` (was Siphon), `severineQuicken` (draw per lit orb), `cassadoraGlimpse` (once per rest), `cinderBackflip` (was Flame Vault), `clemenceAbsolve` (soothe/heal 5, takes the Lust lost). New verbs: `mechanicOrbs` value, `endTurn` effect. |
