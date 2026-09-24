# TREE-DESIGN — progression tree authoring spec

The standing spec for how a progression tree is shaped, measured and checked. It exists because the
session-25 generator grew a graph and then bent it with a shape function: no spacing rule, no symmetry
rule, and a renderer that stretched each axis independently, so none of the intended silhouette
survived to the screen. This file replaces "generate then hope" with "author on a grid, machine-check
the rules, preview through the real renderer".

Companions:

- `PROGRESSION-LIST.md` — the topology decisions and the six intended silhouettes.
- `../starters/STARTER-LIST.md` — the per-character node content.
- `../../tools/generate-progression-trees.js` — the retired generator; kept only as a seed source, not a layout.
- `../../tools/tree-maker.html` — the interactive editor that enforces this document.
- `../../tools/audit-trees.js` — the headless checker that runs the same rules over the shipped content.
- Engine: `scripts/misc/honeycomb/honeycomb-progression.js` (reading a tree),
  `scripts/misc/honeycomb/honeycomb-overlays-progression.js` (drawing it).

Status key: ☐ not started · ◐ in progress · ☑ done.

---

## 1. The shape of the problem

A talent tree fails when the player cannot read it. Three things make it readable:

1. **Position means something.** Depth = progress. Lane = branch. If two nodes sit at the same depth
   they are alternatives; if they sit at different depths they are sequential.
2. **Distance is honest.** A two-node tier and a four-node tier must not look the same width, and a
   long gap must read as a long gap.
3. **Every path goes somewhere.** A branch that dead-ends with no payoff reads as a bug.

The old renderer broke (2): `progressionScreen.positionArray` min/max-normalised `x` and `y`
*independently*, so every tree was stretched to fill its box on both axes. This file fixes the
coordinate model first (§2), then states the rules the tree-maker and auditor enforce (§4).

---

## 2. Coordinate model

### 2.1 Axes

- **`x` = depth.** A non-negative number in arbitrary units. The root is the smallest `x`; every step
  away from the root moves down. Nodes a player reaches at the same time share an `x`.
- **`y` = lane**, in `[0, 100]`. `y = 50` is the tree's axis. Lower `y` is the left, higher `y` the
  right.

The tree descends. `x` is drawn downward; the root is at the top. Reading order is top to bottom,
left to right.

### 2.2 Render mapping (the contract between maker and game)

**The vertical is fixed and the height grows; the horizontal spreads the used lanes across the column.**
This is the shipped mapping in `progressionScreen.positionArray` / `treeHeight`:

```
width        = max(tuning.progression.treeView.width, floor(stage.clientWidth / pixelScale))
usableWidth  = width - 2 * sideMargin
screenX(y)   = sideMargin + ((y - yMin) / (yMax - yMin)) * usableWidth      // 0.5 when yMin == yMax
screenY(x)   = topMargin + (x - xMin) * depthStep
treeHeight   = max(minimumHeight,
                   topMargin + (xMax - xMin) * depthStep + bottomMargin)
```

- `depth` is **fixed**: one `x` unit is always `depthStep` tall. A deeper tree is a taller tree, never
  a denser one, so there is always room to scroll down and place more nodes.
- `x` is offset by `xMin` only so the root starts at `topMargin`; the *gaps* are never scaled.
- `lane` is spread across the column by the tree's own min/max, exactly as before. A symmetric tree
  stays symmetric; a narrow tree still uses the column's width.
- A short tree is not stretched vertically to fill `minimumHeight`; it sits at the top.

Shipped tuning (`tuning.progression.treeView`):

| Key | Meaning | Value |
|---|---|---|
| `depthStep` | honeycomb pixels of vertical travel per one unit of `x` | 18 |
| `minimumHeight` | floor on the drawn tree height | 640 |
| `sideMargin` | horizontal margin each side; the `y` span lives between them | 42 |
| `width` | minimum column width a tree is drawn at | 320 |
| `maximumRowNodes` | most nodes an auditor allows on one row | 4 |
| `minimumLaneGap` | closest two same-row nodes may sit in `y` | 12 |

### 2.3 History

The session-25 renderer min/max-normalised **both** axes, so every tree filled its box vertically and a
short tree drew as tall as a long one. That is why the trees could not read as different sizes. The
session-26 change fixed the vertical step and made the height follow the tree. The horizontal
normalisation is kept deliberately (Noodle): it is not a problem, and it keeps a narrow tree using the
whole column.

### 2.4 The horizontal budget and the grid

`y` is a whole-number 0–100. Lanes are chosen from a small symmetric guide set so that a row of `k`
nodes is centred on 50:

| Nodes in row | Lanes |
|---|---|
| 1 | 50 |
| 2 | 37, 63 |
| 3 | 24, 50, 76 |
| 4 | 11, 37, 63, 89 |

A row is never wider than four nodes. The tree-maker snaps to these lanes and can re-space a whole row
in one action; the raw `y` is still what ships, so a hand-placed oddball is legal if it is deliberate.

`x` is a whole-number row index from `0`: root at `0`, each step toward the capstone `+1`. Nodes that a
player reaches at the same time share the number. Changing `depthStep` retimes the whole tree in one
tuning edit, so the authored rows never need to move. A node that should read as half a step from its
parent may use `x.5`; the maker flags it as a nudge, not an error.

---

## 3. Node content requirements

Every node is a table entry. The engine (`honeycomb.progression.*`) and the soundness test
(`../../tools/test-honeycomb.js`, block [24]) already require the bold fields; the rest are optional verbs.

| Field | Required | Meaning |
|---|---|---|
| `index` | **yes** | unique across the base tree **and** every outfit's `treeNodeArray` |
| `name` | **yes** | printed under the node; budget of two wrapped lines |
| `description` | **yes** | tooltip body; plain sentences, no "I/you/we" |
| `x`, `y` | **yes** | §2, `[0, 100]` |
| `cost` / `costArray` | yes (default 40) | `costArray` prices each rank, last repeats |
| `requiresArray` | unless root | node index, or `{index, rank}` for a rank gate |
| `requiresAll` | no | true = every prerequisite, false/absent = any one |
| `exclusiveGroup` | no | one node of a group may be held at a time |
| `rankMaximum` | no | >1 makes the node ranked (one node, bought up to N times) |
| `role` | recommended | `root` · `ability1` · `ability2` · `replace` · `economy` · `agg` · `def` · `wheel` · `outfit`. Drives maker defaults and auditor checks; the engine ignores it |
| `glyph` | no | icon id; defaults from `role` |
| `condition` | no | a condition, same grammar as cards |
| `healthModifier`, `tagAdditionArray`, `hooks` | no | stat and world-hook nodes |
| `cardAdditionArray`, `cardReplacementArray`, `cardUpgradeArray` | no | card effects |
| `randomReplaceArray`, `starterUpgradeArray` | no | the run-start random swap and the in-place starter delta |
| `abilityAdditionArray`, `unlockEquipment` | no | ability and equipment grants |

Outfits may also carry `treeLockArray` (forbidden node indices) and `treeNodeArray` (added nodes).
A locked or outfit-added node still participates in the same id namespace and prerequisite graph.

---

## 4. Rules

**Hard rules are failures.** The auditor exits non-zero; the test suite fails. **Soft rules are
warnings** — the maker shows them, the auditor prints them, a deliberate choice is recorded in
`tuning.warnings.ignoredArray` or a comment rather than silently allowed.

### 4.1 Hard

| # | Rule |
|---|---|
| H1 | Node indices are unique across base tree + all outfit trees. |
| H2 | The base tree has **exactly one** root (`requiresArray` empty). Extra roots only from outfits, and flagged. |
| H3 | Every prerequisite names a node that exists in the same namespace. |
| H4 | `y` is within `[0, 100]`; `x` is `>= 0`. |
| H5 | Every non-root node is reachable from the root by following `requiresArray`. |
| H6 | No node requires itself; no dependency cycle. |
| H7 | `name` and `description` are present and non-empty; `name` fits two wrapped lines. |
| H8 | Every `cardAdditionArray` / `abilityAdditionArray` / unlock index resolves. |
| H9 | Every node has a cost (explicit or via the default). |
| H10 | No two nodes share an exact `(x, y)`. |
| H11 | Same-row nodes are at least `minimumLaneGap` apart in `y`. |

### 4.2 Soft

| # | Rule | Why |
|---|---|---|
| S1 | **Symmetry.** A tree should be near mirror-symmetric about `y = 50`, or deliberately asymmetric. The auditor reports a symmetry score (mean `|y - mirror(y)|` over matched nodes) and the maker draws the axis. | A lumpy tree reads as an accident in a grid. |
| S2 | **No dead ends.** A node with no children is a declared terminal (`ability2`, `wheel`, `outfit`, or a bough payoff — the economy leaves XP/Col/New/Cheap/Reroll/Banish/Open/Fort and the +/−/Replace ends all qualify). Anything else is a dead end. | A branch that goes nowhere reads as a bug. |
| S3 | **Edge crossings.** Count path pairs that cross; report the count and the pairs. Prefer 0. The shared skeleton draws 6 (3 on Cinder, which drops the DEF branch). | Crossed lines hide the prerequisite graph. |
| S4 | **Fork timing.** An `exclusiveGroup` fork lands within two rows of the join it hangs off. Only Rest-A/Rest-B sit 3 rows out on the shipped skeleton. | Long cross-links are the old layout's worst feature. |
| S5 | **Row width.** At most `maximumRowNodes` (4) nodes share an `x`. | Label and node collisions. |
| S6 | **Bough balance.** Each named bough carries a similar node count. | One rich limb and two bare ones reads as unfinished. |
| S7 | **Cost curve.** Cost follows a node's VALUE, not its depth (Noodle, `TREE-EXP-MATH.md` §4) — a cheap late node or a pricey early one is deliberate, so this is informational only. | The old "rises with depth" reading contradicts the agreed tiers. |
| S8 | **Node budget.** The tree stays within a target node count per character. The 12–16 placeholder is stale: the shipped skeleton is 40–43 nodes (30 purchasable). | Over-large trees are a content-maintenance tax. |
| S9 | **Edge length.** An edge spanning more than three rows is reported. The shipped skeleton has none (the `Ability1` → `C.Ex.1` gap was closed session 27 by moving the C.Ex chain up one row). | A missed intermediate node. |

---

## 5. The six silhouettes

From `PROGRESSION-LIST.md` §2. These are **targets, not constraints**: they tell an author which way
to bend a tree, and the maker colours the intended shape but does not force it.

| Character | Silhouette | The shape |
|---|---|---|
| Brienne | The Wall | wide horizontal band; a four-node economy row across the mid; A up / D down, rejoining into the capstone |
| Nettle | The Root | a Y that splits early into two long tendrils that rejoin only at the capstone, with short spurs |
| Severine | The Orbit | nodes ring a central Ability 1; A and D on opposite arcs, rejoining at the top |
| Cinder | The Ladder | a tall vertical spine; economy as rungs; no Exclusive D |
| Clemence | The Spiral | an inward coil toward self-break; training wheels at the centre, capstone at the mouth |
| Cassadora | The Constellation | scattered nodes on long fate-lines, few rows; exclusive forks as the bright cluster |

---

## 6. The authoring workflow

**The layout is Noodle's; the mechanics are the agent's.** Noodle builds a skeleton — shape only — and
the agent turns that skeleton into a full `nodeArray`.

1. Open `../../tools/tree-skeleton.html` (offline, `file://` is fine). It is the primary tool.
2. Build the shape: double-click to add nodes, drag to place, drag a node's gold handle onto another
   node to connect them, label each node (`A1`, `A2`, `Economy`, …), and use **Mirror** for symmetry.
   The red dashed lines mark the live game width and the tree's start.
3. **Save file** (or copy the **Skeleton** text). That JSON is the ground truth for the shape. Saved
   skeletons live in `!designDocs/skeletons/`; the size comparison against a live tree is logged in
   `TREE-SIZE-REFERENCE.md`.
4. Hand the agent the skeleton plus the semantics: which nodes are the exclusive families (A / D),
   the training wheels, the economy set, the mandatory Ability 1 / Ability 2, and the effect each node
   should carry.
5. The agent converts the skeleton into `honeycomb-content-characters.js` `nodeArray` entries, adding
   `cost`, `requiresArray`, `exclusiveGroup`, effects and the rest.
6. Run `node "!designDocs/honeycomb/tools/audit-trees.js"` — hard rules must pass, soft rules print.
7. Run the suite: `node "!designDocs/honeycomb/tools/test-honeycomb.js"`.
8. Look at it in the browser (`../../tools/agent-browser.js`) and react to the shape, per `PROGRESSION-LIST.md`
   §5 ("judge by seeing it").

`../../tools/tree-maker.html` is the older, heavier content editor. It can fill in full fields and run the rule
checks live, but it is optional; the skeleton tool is what the layout pass should use.

---

## 7. Open questions

- ☐ **Node budget** per character. Shipped is 40–43 nodes (30 purchasable); the old 12–16 placeholder
  is stale. Noodle's call whether that count is the target.
- ☑ **`minimumLaneGap`** — set to 12 in `tuning.progression.treeView`.
- ☑ **`depthStep`** — set to 18 in `tuning.progression.treeView`.
- ☐ Do ranked nodes count once or per-rank toward the budget and the bough balance?
- ☐ Does `role` ship as a real content field, or is it maker-only metadata? (Recommend ship: it is
  free, and it lets the auditor classify terminals and the overlay's default glyph agree. It is not on
  any shipped node today, so the auditor's S2 reports leaves without a role to judge them by.)
