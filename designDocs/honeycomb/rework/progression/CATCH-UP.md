# Progression rework — CATCH-UP

**Read this first for the progression trees.** Scope: the six per-character trees, their nodes, their
EXP costs, and what each node actually does in the engine.

Project-wide context is `../../BASICS.md`.

---

## Where it stands

**All 256 nodes are wired** (session 29). Every node carries an effect field the engine reads, and
suite block **[87]** asserts each family. `../../tools/audit-trees.js` passes every hard rule.

The distinction that matters: *wired* means a node carries a field the engine reads — not that it does
what the design says. Session 30's audit found wrong behaviour, dead wheels and wrong text in nodes
`WIRING-STATUS.md` lists as closed. That content-fidelity pass is **closed too**: the 7 stand-ins, the
0-damage type flip and the A1/A2 ability-table mismatches were all replaced with the designed behaviour.

All six characters now have an Ability 2. Cinder's *Reversal* (`cinDef2`) was the last node wired.

---

## Files

| File | Holds | Read it before |
|---|---|---|
| `WIRING-STATUS.md` | The per-node truth: what each node carries, what is still deferred. | declaring the pass done |
| `TREE-DESIGN.md` | The standing spec — how a tree is shaped, measured and checked. | changing a tree's shape |
| `PROGRESSION-LIST.md` | Node **topology**: spine + three boughs + join capstone. | adding or moving a node |
| `NODES-LIST.md` | Every node idea, flat and scannable, with the per-character detail folded in. | designing a node |
| `TREE-EXP-MATH.md` | What a run should pay and what a node should cost. | repricing anything |
| `TREE-MECHANICS-INVENTORY.md` | The universal skeleton, and which mechanic each character fills it with. | wiring a mechanic |
| `TREE-MECHANICS-TODO.md` | The *reasoning* list. `WIRING-STATUS.md` is the authoritative one. | — |
| `SKELETON-MAPPING.md` | Docs-say-needed vs skeleton-provides, lined up. | translating a skeleton |
| `TREE-SIZE-REFERENCE.md` | Old live content beside the new skeletons. | translating a skeleton |

Live content: `honeycomb-content-characters.js` (`character.progressionTree.nodeArray`) and
`honeycomb-progression.js`.

---

## Tools

```
node "!designDocs/honeycomb/tools/audit-trees.js"                every hard rule, plus soft warnings
node "!designDocs/honeycomb/tools/generate-progression-trees.js" skeleton (../skeletons/wip.json) -> content file
node "!designDocs/honeycomb/tools/exp-model.js"                  the EXP curve
node "!designDocs/honeycomb/tools/progression-dump.js"           every node, expanded
node "!designDocs/honeycomb/tools/progression-sims.js"           mechanics driven through real fights
```

`../../tools/tree-maker.html` and `../../tools/tree-skeleton.html` are the browser-side tree editors.

---

## Remaining goals

`FEEDBACK.md` holds the full quote and annotation for each. The table below is the index; that file is the queue.

| | Goal | State |
|---|---|---|
| **B23** | **Early deck-customization pricing.** The nodes that let a player edit their deck are mispriced for how early they land. | ☐ |
| **B4** | **Distribute unlockables through the game** rather than all through the tree. | ☐ |
| — | **Outfit upgrade ladders** (`WIRING-STATUS.md` U2). A node may name `unlockOutfit`; nothing reads it yet. | ☐ deferred |
| — | **Card-type flip** and **A1-gated offers**. | ☐ deferred |

---

## Rules this pathway must not break

- **A progression RANK is a repeated index.** `profile.progressionArray[character]` holds a node's
  index once per rank taken.
- **Regenerate, do not hand-edit.** The trees are generated from `!designDocs/skeletons/wip.json` by
  `../../tools/generate-progression-trees.js`. A hand edit to the content file is lost on the next generation.
- **Never edit the content tables with a greedy regex** — the generator slices by index for exactly
  this reason.
- Re-run `../../tools/audit-trees.js` **and** the suite after any tree change.
