# TREE-MECHANICS-INVENTORY — what shares a mechanic and what does not

The six trees are one universal skeleton filled per character. Before wiring a mechanic it matters whether
it is **one implementation for all six** or **six distinct ones**, because that decides how many tests it
needs. This is that map. Work the list top-down; each row becomes real by (a) giving the node field and
(b) adding the one engine read, then adding the node's index to `wiredMechanicSet` in `../../tools/test-honeycomb.js`
block [87].

How a node reaches the engine: `honeycomb.memberCardModifierArray` collects outfit + equipment +
`progression.selectedNodeArray` (once per rank), and every consumer — pool resolver, health, hooks — reads
through it. So a mechanic is a **field on the node plus one read through that list**.

Kinds:
- **SHARED** — same field and same read for all six; one implementation, one test.
- **DATA** — one engine verb, per-character table rows (the verb is tested once; a soundness rule checks
  every character's data is present).
- **UNIQUE** — a distinct hook per character (18 of them); each wants its own test.

---

## 1. Deck / starter edits

Status: ✅ wired and enforcing in block [87] · ◐ next · ☐ not started.

| Node | Kind | Field / verb | Test key | Status |
|---|---|---|---|---|
| +A. | SHARED | `cardAdditionArray` | briExtraAttack | ✅ |
| +D. | SHARED | `cardAdditionArray` | briExtraDefence | ✅ |
| −A. | SHARED | `cardRemovalArray` (1 copy per rank) | briTrimAttack | ✅ |
| −D. | SHARED | `cardRemovalArray` | briTrimDefence | ✅ |
| R.A. | SHARED | `randomReplaceArray` at `newRun` | briReplaceAttack | ✅ |
| R.D. | SHARED | `randomReplaceArray` | briReplaceDefence | ✅ |
| ATT1/2/3 | DATA | `starterUpgradeArray` in place | briAtt1 | ✅ (all paths carry a delta; `typeArray` flip still open) |
| DEF1/2/3 | DATA | rewrite the defensive basic (choose-one) | briDef1 | ✅ via `replaceEffectArray` |
| W1/2/3 | DATA | rewrite the A1 ability, remove its enable | briWheel1 | ✅ via `abilityUpgradeArray` + `disableMechanic` |
| U1 | SHARED | `outfitCardDoubling` doubles the outfit's added cards | briU1 | ✅ |
| U2 | SHARED | worn outfit's cards start upgraded | briU2 | ✅ resolver; no signature has a ladder yet |

**Card-type note (Noodle):** Nettle Wither/Acid and Cassadora Hex/Twist at 0 damage become pure `negative`,
not `damage`/`negative`. **Built (session 29):** `negativeIfZeroDamage` on the node's damage adjustment
flips the resolved card's `typeArray` only at the rank its damage reaches 0. See `TREE-MECHANICS-TODO.md`.

## 2. Economy (all SHARED)

| Node | Field / verb | Test key | Status |
|---|---|---|---|
| XP | `personalExperienceMultiplier` × per-member share in `payPersonal` | briXp | ✅ |
| Gold | `startingGold` summed by `partyFieldTotal` in `newRun` | briGold | ✅ |
| Reroll1 / Reroll2 | `reroll` run resource (party / profile tier); reward-screen re-roll button | briReroll1 / briReroll2 | ✅ |
| Banish1 / Banish2 | `rewardBanish` (party) + `rewardBanishAlways` (profile) into the run's `banish` resource; spent from reward/shop/journal offers | briBanish1 / briBanish2 | ✅ |
| Col | `collectorWeight` on unseen event/relic weights | briCol | ✅ |
| New | `unseenCardWeight` on unseen card offer weights | briNew | ✅ |
| Cheap | `unlockDiscount` on outfit/common-relic shop price | briCheap | ✅ |
| Boun1 / Boun2 | `bountyGoldMultiplier` / `bountyCardChoiceBonus` into the reward roll | briBoun1 / briBoun2 | ✅ |
| Shop1 / Shop2 | `shopCardDiscount` / `shopExtraSlots` | briShop1 / briShop2 | ✅ |

Party-wide reads use `honeycomb.partyFieldTotal`; the benched "Always" tier uses
`honeycomb.profileFieldTotal`.

## 3. Run (all SHARED)

| Node | Field / verb | Test key | Status |
|---|---|---|---|
| OpenD / OpenE | `drawPerTurnBonus` / `energyPerTurnBonus` in `grantEnergy` + `drawForTurn` | briOpenD / briOpenE | ✅ |
| Rest1 → Rest2 | unlock a rest option (party → always) | briRest1 / briRest2 | ✅ |
| Rest-A / Rest-B | extra rest action / more healing | briRestA / briRestB | ✅ |
| Fort | `fortitude` caps `lust.rankFor` at 1 | briFort | ✅ |

## 4. Character-unique C.Ex. (18, UNIQUE)

| Character | C.Ex.1 | C.Ex.2 | C.Ex.3 |
|---|---|---|---|
| Brienne | T1 buffer (turn 1 tHP) | +4 tHP at combat start if front | first hit taken: Taunt |
| Nettle | attack/negative moves her to the back | Penny Pincher (20% gold on shop exit) | First cleanse |
| Severine | on enemy death: regain 5 HP | Challenger (draw 1 at boss/elite) | self-damage −1 |
| Clemence | healing overflow → tHP | on Break: allies gain 4 tHP | combat start: allies soothe 2 |
| Cassadora | unlock enemy movelist on first meet | first junk card each combat exhausts | Investment (+2 gold per unspent energy) |
| Cinder | 1 Vulnerable fades while behind an ally | Soothing (rest reduces Lust) | Recover (heal 10 on recovering from Broken) |

Each is a hook/field on the node; test one engine setup per character that exercises exactly that hook.

**Live (engine read + test in [87]):** all 18. Brienne Hold Fast, Vanguard, Taunt · Nettle First Rites,
Creeping Rot, Penny Pincher · Severine Feast, Thin Skin · Clemence Overflow · Cassadora Tidy,
Investment, **Studied Foe** (`enemyMoveSeen` + `enemyMovelistUnlock`) · Cinder Recover, Drilled,
**Soothing** (`healEntity`'s `restSoothe` read while `rest.active`).
**Wired as `hooks`, not asserted in [87]:** Severine Challenger · Clemence Martyr, Comfort.
**Field-only:** none.

## 5. Abilities (prerequisite content, not a node mechanic)

- All six characters' A1 and A2 match their node text (session 29). Cassadora/Cinder/Clemence A2 were
  authored (`cassadoraMagicTrick`, `cinderPhoenixDive`, `clemenceOneWithNothing`); the other nine were
  older designs and were rewritten (`severineBloodTap` and `cinderBackflip` renamed). New verbs:
  `spendMechanic`, `gainMechanic`, `conjureEnemyMove`, `playChosenCardOnOwner`, `endTurn` effects and
  the `mechanic`/`mechanicOrbs` values. Block [95] holds the alignment.

---

## Suggested order

1. **Deck edits** (§1) — self-contained, several verbs already exist, and it settles the card-type rule.
2. **Simple shared stats** (§2–3) — one field + one read each; good momentum.
3. **DATA families** (ATT/DEF/W) — mostly the existing `starterUpgradeArray` plus two new rewrite verbs.
4. **Unique C.Ex.** (§4) — 18 small hooks, one character at a time.
5. **A2 authoring** for the three missing characters.
