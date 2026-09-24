# TREE-EXP-MATH — how much a tree node should cost

Working numbers for the question: *how much EXP should a run pay, and what should a node cost, so a
player is expected to finish a character's tree in N runs?* Built from the shipped awards in
`honeycomb-progression.js` (`discoveryKindArray`) and the skeleton's node count.

**This is a model, not a promise.** Every figure below is an estimate; the assumptions are stated so a
number can be re-cut when one of them changes.

---

## 1. The node count (the denominator)

`wip.json` has 43 nodes. Exclusive families let a single build take only one path, so subtract the
paths a player can never hold together:

| Family | Nodes | Kept | Cut |
|---|---|---|---|
| ATT1/2/3 (Exclusive A) | 3 | 1 | 2 |
| DEF1/2/3 (Exclusive D) | 3 | 1 | 2 |
| W1/W2/W3 (training wheels) | 3 | 1 | 2 |
| U1/U2 (outfit) | 2 | 1 | 1 |
| OpenD/OpenE | 2 | 1 | 1 |
| Boun1/Boun2 | 2 | 1 | 1 |
| Shop1/Shop2 | 2 | 1 | 1 |
| Rest-A/Rest-B | 2 | 1 | 1 |
| +A/−A | 2 | 1 | 1 |
| +D/−D | 2 | 1 | 1 |
| **Total** | 43 | **30** | 13 |

**30 purchasable nodes** in one build. Buying every rank is about **43 rank purchases** (Start ×3,
Gold ×3, R.A. ×3, R.D. ×3, ATT ×3, U2 ×2 or U1 ×1, −A ×2 or +A ×1, −D ×2 or +D ×1; DEF is never
ranked, and 25 nodes are single-rank). A ranked node's per-rank cost is its total divided by its ranks,
so the purchase count does not change the total spend.

Cost rule (Noodle): a ranked node's **total** cost is its intended node cost, split across ranks —
`rank cost = node cost / rank count`. So the total spend for a fully maxed build is
`sum(node cost) = 30 × average node cost`, and ranks never inflate it.

> If W1/2/3 turn out **not** exclusive, the denominator is 32; if C.Ex.1/2/3 are exclusive, 28.

---

## 2. What one 51-node run pays

Benchmark run = 51 nodes / 3 acts (Slay the Spire shaped): **3 bosses, 4 elites, 20 ordinary combats,
10 events, 5 rests, 5 shops, 4 treasures.** That is 27 fights.

Shipped awards (per `discoveryKindArray`): encounter 5, enemy 2, event 3, region 20; run victory 100.

| Source | Count | Award | Personal XP |
|---|---|---|---|
| Battles won (`encounter`) | 27 | ×5 | 135 |
| Enemies defeated (`enemy`) | 27 × **2** | ×2 | 108 |
| Events resolved (`event`) | 10 | ×3 | 30 |
| Regions cleared (`region`) | 3 | ×20 | 60 |
| Run victory (`runVictoryExperience`) | 1 | ×100 | 100 |
| **Personal, pre-split** | | | **433 / run** |
| **Personal per character** (party of 3, split evenly) | | | **≈ 144 / run** |

Sensitivity to enemies-per-fight: ~406 at 1.5, ~460 at 2.5 → **135–153 per character per run**.

Our **current** two-region run is 29 nodes (18 + 11), not 51, so it pays roughly
**~296 pre-split → ~99 per character per run.** The 51 figures are the 3-act target.

### Global EXP (the one-time pool)

Global is paid only on a **first-time discovery** (`firstExperience`), so it is a finite reservoir the
player drains over their first many runs, not a per-run income. Estimated pool from the shipped tables:

| Kind | Count | First XP | Pool |
|---|---|---|---|
| Enemies | 11 | ×15 | 165 |
| Encounters | 20 | ×20 | 400 |
| Events | 13 | ×25 | 325 |
| Relics | 23 | ×20 | 460 |
| Cards held | ~200 | ×10 | ~2,000 |
| Outfits | 18 | ×30 | 540 |
| Equipment | ~4 | ×30 | 120 |
| Regions | 2 | ×60 | 120 |
| **Total** | | | **≈ 4,400** |

Assumed collection curve: **45% by run 5, 70% by 10, 85% by 15, 93% by 20, 99% by 30.**

---

## 3. Lifetime EXP and the average node cost

`Average node cost = (personal + global over N runs) ÷ 30.`

**Scenario A — one character, every global point spent on their tree:**

| Runs N | Character XP | Global XP | Lifetime XP | Avg node cost |
|---|---|---|---|---|
| 5 | 720 | 1,980 | 2,700 | **90** |
| 10 | 1,440 | 3,080 | 4,520 | **151** |
| 15 | 2,160 | 3,740 | 5,900 | **197** |
| 20 | 2,880 | 4,090 | 6,970 | **232** |
| 30 | 4,320 | 4,360 | 8,680 | **289** |

**Scenario B — a 3-character rotation, global split three ways:**

| Runs N | Character XP | Global share | Lifetime XP | Avg node cost |
|---|---|---|---|---|
| 10 | 1,440 | 1,027 | 2,467 | **82** |
| 20 | 2,880 | 1,363 | 4,243 | **141** |

Read: **the global pool does most of the early work and the character's own EXP is a slow trickle.**
That is the imbalance Noodle flagged. If personal EXP should carry the tree instead, `runVictoryExperience`
and the `baseExperience` values must rise (see §5).

The headline sentence the brief asked for:

> Assuming the player does **N = 10** full runs with Brienne, that is an estimated **1,440 character XP +
> ~3,080 global XP = ~4,520 lifetime XP.** Across **30 purchasable nodes**, nodes would need to cost
> **~150 XP on average** for the final run to unlock the final node.

---

## 4. A cost spread around 150 average

No depth scaling (Noodle): cost follows a node's *value*, not its row. Three tiers keep the average at
150 while making the named nodes expensive.

| Tier | Cost | Count | Examples |
|---|---|---|---|
| Cheap | 75 | ~10 | XP, Collector, Unseen Weight, Cheaper Unlocks, Fortitude, C.Ex.1–3, Banish2 |
| Standard | 150 | ~16 | Ex.A., Ex.D., R.A., R.D., ATT, DEF, W, Open, Boun, Shop, Gold, Rest1, Rest-A/B, A1, **Reroll** |
| Expensive | 300 | ~4 | A2, Rest2, Banish, U2 |

Check: `10×75 + 16×150 + 4×300 = 4,350` (×30 = 30 × **145**). **Session 28:** Noodle moved Reroll
(Second Chance) from Expensive to Standard, so the average lands just under 150.

Rank costs (total ÷ ranks), all at Standard 150 unless noted:

| Node | Ranks | Per rank |
|---|---|---|
| Start / Vigour | 3 (Brienne **6**) | 50 (Brienne **25**) |
| ATT path (Exclusive A) | 3 | 50 |
| DEF path (Exclusive D) | 3 | 50 |
| R.A. | 3 | 50 |
| R.D. | 3 | 50 |

So R.A.'s rank cost is exactly one third of Ex.A.'s node cost, as specified.

---

## 5. Dials, if a different N is wanted

Required per-run EXP per character to finish the tree in N runs:

```
perRun = (30 × avgNodeCost − globalOverN) / N
```

- **N = 10, avg 150, no global:** 450 / run per character → **1,350 pre-split** (≈3× today).
- **N = 15, avg 150, global 3,740:** 216 / run per character (≈1.5× today).
- **N = 20, avg 150, global 4,090:** 75 / run per character (below today — the global pool alone nearly
  pays for the tree).

Levers, cheapest first:

1. `runVictoryExperience` (currently 100) — the single clearest dial for personal EXP.
2. `discoveryKindArray.baseExperience` (encounter 5, enemy 2, event 3) — per-run personal.
3. `experienceMultiplier` — a global scalar over both pools.
4. `firstExperience` — shrinks or grows the global reservoir; changes how many runs the "discovery
   phase" lasts.
5. The node count (30) — every node removed cuts the total the player must earn by one tier cost.

---

## 6. Recommended starting point

- **Average node cost 150**, tiers as §4.
- **Finish a character's tree in ~10–15 runs** with global going mostly to that character.
- **Raise `runVictoryExperience` from 100 to ~250** if the intent is that *playing* a character (not
  discovering content) is the main way to advance them. That lifts personal to ~194 / run, making the
  personal share ~1,940 by run 10 — about 43% of the tree instead of ~32%.
- Re-cut the table once Q6 (missing nodes) and Q5 (Gold ranks) are answered, since both move the
  denominator.
