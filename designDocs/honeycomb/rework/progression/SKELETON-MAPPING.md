# SKELETON-MAPPING — `wip.json` against the node lists

Every node the docs say a character needs, lined up against the skeleton in
`!designDocs/skeletons/wip.json`. Source of truth for content: `../starters/STARTER-LIST.md` + `NODES-LIST.md`;
topology: `PROGRESSION-LIST.md`. Answers from Noodle (session 26) are folded in; the few genuine
ambiguities are under §5.

**`wip.json` is one universal skeleton**, per Noodle — one shared node inventory; per-character re-layout
is a *possibility* only under the §6 constraints, not a requirement.

---

## 1. The node inventory

41 nodes as of the session-26 edit below; **30 purchasable in one build** after exclusive cuts.

| Label | Role | Rank | Notes |
|---|---|---|---|
| Start | Vigour / +HP | 3 (Brienne 6) | tank characters get more ranks, same total cost |
| A1 | Ability 1 | 1 | root |
| A2 | Ability 2 | 1 | capstone; reachable through any one of U1/U2/Rest-A/Rest-B (intended) |
| ATT1/2/3 | Exclusive A upgrades (attack) | per character | exclusive; **taken before** DEF. Confirmed: Severine ×1, Cinder ×1, Nettle ×2, Cassadora ×2, Brienne ×3, Clemence ×3 |
| DEF1/2/3 | Exclusive D upgrades (defence) | **1 (none ranked)** | exclusive; Cinder keeps only **one** non-exclusive DEF node (`cinDef2` "Reversal"); DEF paths are never ranked |
| W1/2/3 | Training wheels | 1 | exclusive |
| +A. | Extra attack copy | 1 | exclusive with −A. |
| −A. | Remove attack copies | 2 | exclusive with +A. |
| R.A. | Replace attack with random | 3 | sits **behind +A.** |
| +D. | Extra defence copy | 1 | exclusive with −D. |
| −D. | Remove defence copies | 2 | exclusive with +D. |
| R.D. | Replace defence with random | 3 | sits **behind +D.** |
| C.Ex.1/2/3 | Character-specific extras | 1 | chain 1→2→3; see §5 Q1 |
| Rest1 | Char rest function, party only | 1 | |
| Rest2 | Rest1 function even when benched | 1 | placed late; discourages stripping global EXP |
| Rest-A/Rest-B | Rest efficiency | 1 | exclusive |
| XP | XP gain | 1 | |
| Col | Collector | 1 | |
| New | Unseen weight | 1 | |
| Cheap | Cheaper unlocks | 1 | |
| Reroll1 / Reroll2 | Reward reroll (party / always) | 1 | Reroll2 placed late, like Rest2 |
| Banish1 / Banish2 | Card banishes (party / always) | 1 | Banish2 placed late, like Rest2 |
| Gold | Starting gold | 3 | |
| OpenD / OpenE | Opening card/energy | 1 | exclusive |
| Boun1 / Boun2 | Bounty | 1 | exclusive |
| Shop1 / Shop2 | Shop (cheaper cards / more options) | 1 | exclusive |
| U1 | Doubles cards given by outfit | 1 | exclusive with U2 |
| U2 | Outfit cards start upgraded | 2 | exclusive with U1 |
| Fort | Fortitude | 1 | |

## 2. Mapping — canonical → skeleton

| Canonical (docs) | Skeleton | Status |
|---|---|---|
| Vigour / +HP | Start | ✅ |
| Ability 1 / Ability 2 | A1 / A2 | ✅ |
| XP, Collector, Unseen weight, Cheaper unlocks | XP / Col / New / Cheap | ✅ |
| Reroll, Card banishes | Reroll1+2 / Banish1+2 | ✅ two tiers |
| Rest upgrade, Rest efficiency | Rest1+2 / Rest-A,B | ✅ |
| Replace Attack / Defence | R.A. / R.D. | ✅ |
| Starting gold ×3 | Gold rank 3 | ✅ resolved |
| Aggressive starter (Excl A) | ATT1/2/3 | ✅ before DEF |
| Defensive starter (Excl D) | DEF1/2/3 | ✅ after ATT; Cinder none |
| Training wheels | W1/2/3 | ✅ exclusive |
| Opening card/energy | OpenD / OpenE | ✅ |
| Bounty / Shop | Boun1,2 / Shop1,2 | ✅ |
| +Agg / −Agg | +A. / −A. | ✅ |
| +Def / −Def | +D. / −D. | ✅ |
| Extra outfit cards (Exclusive O) | U1 / U2 | ✅ |
| T1 buffer, First cleanse, Recover, healing/defensive options | moved to **C.Ex.** (character-specific) | ✅ by design |
| Weakness Decay | — | ✅ cut (already a mechanic) |

## 3. Extras (skeleton, not previously in docs)

- **C.Ex.1/2/3** — character-specific extras (e.g. Brienne's "−1 Thorns/reflect damage, up to −3").
  They may also host the healing/defensive nodes moved out of the universal set, and act as general
  backups for any character-specific idea that does not fit elsewhere (Q1).
- **Reroll2 / Banish2 / Rest2** — the "even when benched" second tier, placed late so a player is
  discouraged from stripping all global EXP out of a run.
- **Rest1 vs Rest2** split (party-only vs always) is finer than the docs' single Rest upgrade.

## 4. Order

- Attack exclusives (ATT) are chosen, then Bounty, then defence exclusives (DEF), then Rest2. The docs
  wrongly placed ATT and DEF on the same tier — corrected.
- `A2` requires any **one** of U1/U2/Rest-A/Rest-B; reaching it through U1 alone is intended. The other
  branches into A2 are meant to be expensive.

---

## 5. Resolved (session 26)

1. **C.Ex.1/2/3 are a chain** (buy 1 → 2 → 3), character-specific extras.
2. **−A. / −D. tags fixed:** "1 less copy of attack / defense card", each rank 2, exclusive with the
   `+` twin.
3. **ATT ranks per character confirmed** (Severine/Cinder ×1, Nettle/Cassadora ×2, Brienne/Clemence ×3);
   **DEF is never ranked.**
4. **A2a** = `NODES-LIST.md` §A2a, the "give each to one character only to fill extra spaces" list:
   T1 buffer · Recover · First cleanse · Penny Pincher · Unspent · Challenger · Soothing.
5. **Rest functions per character** and **C.Ex. content** are the agent's to propose; do not use every
   A2a entry (more characters are coming).

### C.Ex. content (proposed — Noodle to vibe-check)

| Character | C.Ex.1 | C.Ex.2 | C.Ex.3 |
|---|---|---|---|
| Brienne | **T1 buffer** (turn 1: tHP/heal/soothe) | combat start 4 tHP if front | first hit each combat: Taunt |
| Nettle | first junk card each combat exhausts | attack or negative moves her to the back | First cleanse |
| Severine | self-damage −1 | below 25% HP: +1 damage | on enemy death: regain 5 HP |
| Clemence | combat start: other allies soothe 2 | on Break: other allies gain 4 tHP | healing overflow → tHP |
| Cassadora | first junk card each combat exhausts | unlock an enemy's movelist on first encounter | Challenger (draw 1 at boss/elite) |
| Cinder | moving to the front: gain 4 tHP (`Drilled`) | resting: reduce Lust equal to HP gained (`Soothing`) | Recover (heal 10 on recovering from Broken) |

Left unassigned for future characters: **Penny Pincher, Unspent.**

### Rest functions (assigned session 26)

Every NODES-LIST §D option is a row in `honeycomb.restOptionArray`; a character's own rest function is
named by their **Rest1** (while fielded) and **Rest2** (even benched) nodes, and joins the campfire menu.
The base rows (Sleep, Sharpen, and Leave a card behind) are always there; the broken-only Tend was
removed in the rest-site feedback pass.

| Character | Rest function |
|---|---|
| Brienne | **Preptime** — the party begins the next fight with Temporary HP |
| Nettle | **Journal** — study a card so it appears more often in rewards (session 28; was Laundry) |
| Severine | **Treatment** — heal a chosen ally by double the rest rate |
| Clemence | **Exercise** — every member gains personal experience |
| Cassadora | **Fortune Telling** — replace a starter with a random common or rare of that character |
| Cinder | **Scavenge** — find gold around the camp |

Left unassigned for future characters: **Gamble, Duplicate, Mail Order, Laundry**. All four are built,
and the **Rest Lab** debug tool opens a campfire with every option and 100 actions to try them.
**Duplicate must not be assigned until it is rebalanced** (too strong); block [89] asserts no shipped
Rest node names it.

## 6. Per-character silhouettes (optional)

Noodle: one universal skeleton is fine; other shapes are welcome only within these constraints:

- No connection-line overlap.
- Stay inside the available space.
- Nodes never too close together.
- Few nodes are interchangeable.
- Late-stage stays late, early stays early; **Rest2 and everything after cannot move at all.**
- The starting node must be inside the viewport when the Progression tab opens.

Agent's read: a full re-layout per character is likely not worth it — the shared shape already satisfies
the "one tree" goal, and the constraints mostly pin the same silhouette. Worth attempting only if the
node content per character makes an obvious re-arrangement (e.g. Cinder dropping the DEF branch).
