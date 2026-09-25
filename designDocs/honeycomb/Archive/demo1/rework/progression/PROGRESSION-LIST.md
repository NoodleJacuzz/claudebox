# PROGRESSION-LIST — working list (draft 2, Noodle's answers folded in)

Lean working list, like `../starters/STARTER-LIST.md`. Per-character node *content* is drafted there; this file owns
the **topology** — how the nodes connect into something that reads as a talent tree.

The overlay draws an edge for every entry in a node's `requiresArray`
(`honeycomb-overlays-progression.js`, "The graph. Edges first..."), so **connectivity is literally the
prerequisite graph**.

Status key: ☐ not started · ◐ draft · ⏸ waiting on Noodle

---

## 1. Decisions (Noodle, session 25)

- **Three boughs in general.** The tree will **condense and contract a lot**; three is the intent.
- **It is a tree, not parallel lanes.** Not every node in a category sits on a line — see **Brienne's
  current tree** (minus the two new Replace nodes) as the reference shape: a root that forks, branches
  that each run a short chain, and a join. We are **somewhere between a skill tree and Final Fantasy X's
  sphere grid**.
- **Exclusive forks sit 1–2 nodes after the join**, not far out on their own limb, to reduce the number
  of long dashed cross-links the overlay has to draw.
- **Depth order:** root / Vigour / Ability 1 → economy and Replace nodes → **Exclusive A and D late**
  → **Ability 2 near the end** → **training-wheel removal last**. (Noodle: General format here seems good, early-tier things gotten early, mid-tier in the mids, etc. I just worry everything else will feel samey too even though they don't need to. Cinder lacking a branch for what would be her exclusive D is a constraint that forces a unique shape, but I'd like them all to have unique shapes without forcing it.)
- **Ranked nodes: 100%** for the ranked families (Exclusive A's `+2 per rank`, Vigour, the +Agg/−Agg
  and +Def/−Def counts). One node bought up to N times, not N chained nodes.
- **Respec: yes** — there is already a dedicated respec button, so the tree is fully refundable between
  runs.

---

## 2. Shape — six DISTINCT silhouettes, not one template

Noodle on the old single diagram: *"That's not a tree? And it's not a very interesting shape. It doesn't
need to fan out at the end, but I'd like some variety, have it move into points with just two branches,
have two branching paths that rejoin after a bit, have it expand to 4 nodes in a single row, etc. And
most importantly is that not every character gets everything in the same order, especially nonexclusive
branches."*

So there is **no shared silhouette**. What IS shared:

1. **One root, one capstone.** The root is the only node with no `requiresArray`; Ability 2 is the only
   node requiring two branches.
2. **Early tiers early, mid mids, late late.** Exclusive A/D late, Ability 2 near the end,
   training-wheel removal last. The *nonexclusive* nodes' order is the free variable.
3. **Economy hangs off the node that explains it**, never floats off the root.
4. **Ranked families are one node**, bought up to N times.
5. **Forks land 1–2 nodes after a join**, so cross-links stay short.

Per-character silhouettes (first pass — each intentionally different):

| Character | Silhouette | The shape |
|---|---|---|
| Brienne | **The Wall** | A wide horizontal band; a **4-node economy row** across the mid; Exclusive A up / D down, rejoining into the capstone. |
| Nettle | **The Root** | A **Y that splits early** into two long tendrils (spread / consume) that **rejoin only at the capstone**, with short spurs. |
| Severine | **The Orbit** | Nodes **ring a central Ability 1** (her orbs); A and D sit on opposite arcs and rejoin at the top. |
| Cinder | **The Ladder** | A **tall vertical spine** (position); economy is **rungs**; no Exclusive D — the spine itself is the front/back choice, forced by her constraint. |
| Clemence | **The Spiral** | An **inward coil** toward self-break; the training wheels sit at the centre, the capstone at the mouth. |
| Cassadora | **The Constellation** | **Scattered nodes with long fate-lines**, few rows; the exclusive forks are the bright cluster. |

**Exclusive O** (Extra outfit cards / outfit cards start pre-upgraded) gets its **own late limb off R1**
on every character, so it never crowds a bough.

**Player-requested (Noodle):** (1) when a node grants or upgrades a card/outfit, show that card's
tooltip on the node; (2) make exclusivity unmistakable — a node description and a **red X over the
blocked path**.

---

## 3. Shared skeleton (identical for all six)

Positions are provisional until measured against each `progression/<artFolder>-tree.webp`.

| # | Tier | Node | Effect | Requires | Cost |
|---|---|---|---|---|---|
| R1–R3 | root | Vigour I–III (**ranked, 3**) | +5 Max HP per rank | R1←root, then self | 20 / 40 / 70 |
| T | early | **Ability 1** | Grants A1 | R1 | 20 |
| E1 | early | Replace Attack | random-common swap off the aggressive basic | T | 60 |
| E2 | early | Replace Defence | random-common swap off the defensive basic | T | 60 |
| A | mid→late | Exclusive A (**ranked ×3 where possible**) | see STARTER-LIST | T (+1 economy node) | 40 each |
| D | mid→late | Exclusive D (**one, choose-one**) | see STARTER-LIST | T (+1 economy node) | 40 each |
| N… | mid | nonexclusive set | +Agg/−Agg, +Def/−Def, XP, Collector, Unseen weight, Cheaper unlocks, T1 buffer, First cleanse, Reroll, Card banishes, Starting gold, Rest upgrade, Bounty, Shop, Rest efficiency | the bough that explains it | 40–80 |
| U | late | Exclusive O | Extra outfit cards/Outfit cards start pre-upgraded | R1 | 20/200 (upgraded much more expensive) |
| C | **near end** | **Ability 2** | Grants A2 | two bough ends | 110 |
| W | **last** | **Training-wheel removal** | removes the A1 enable (see STARTER-LIST) | C | 140 |

Player requested feature 1: When a node gives you an outfit or upgrades a card, show that card's tooltip
Player requested feature 2: Make it more clear wherever possible (node desc, red X over other path) that exclusive paths block off other paths
---

## 4. Where the per-character content comes from

- **Exclusive A / D / Training wheels**: drafted per character in `../starters/STARTER-LIST.md`. This file owns only
  placement.

  **CORRECTION (Noodle, session 25): Exclusive A/D do NOT replace the starter card — they UPGRADE it in
  place.** Nettle's Wither node is "-2 damage, +1 poison" applied to the *same* `nettleVenomTouch`, not
  a swap to a new card index (which would be "insane to manage"). The engine seam is therefore a
  per-rank **delta on a named starter's values/effects**, not a `cardReplacementArray` to a variant and
  not dozens of new card definitions. This is new engine work: a node field that adjusts a starter's
  effect amounts/stacks, summed across ranks.
- **Replace Attack / Replace Defence**: already implemented (session 25, `randomReplaceArray`).
- **Ability 2**: for Cinder, Clemence and Cassadora the A2 ability is not authored yet (only A1 exists) —
  a content prerequisite before the capstone can grant it.

---

## 5. More decisions (Noodle, session 25)

- **Spread the nonexclusive set out a bunch.** Do not cluster the economy nodes on one bough; each
  bough should carry some, so the tree reads as evenly built rather than one rich limb and two bare ones.
- **Replace Attack / Replace Defence are optional nodes** (they swap a basic for a random — a weaker
  pick). They should share a **row with a desirable node**, so a player taking the row is not forced to
  spend on the swap alone; the random replacement rides along beside something worth having.
- **Judge by seeing it.** The user will react once the tree is in-game, so implement a first full draft
  rather than perfecting the doc.

Implementation is mechanical: node entries with `requiresArray` + x/y measured off the existing tree
paintings, then a test that every node but the root is reachable from it and that each bough's exclusive
fork sits within two nodes of the join.
