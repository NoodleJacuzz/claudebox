# TREE-SIZE-REFERENCE — skeleton ↔ live tree, measured

A log of two things side by side so the new skeletons can be translated into the live content’s scale:

1. **A saved skeleton** — `!designDocs/skeletons/reference_for_size.json`, Noodle’s first shape pass
   (Brienne, labels provisional).
2. **Brienne’s exact live tree** — the `nodeArray` in
   `scripts/misc/honeycomb/honeycomb-content-characters.js` (her `progressionTree`), copied verbatim at
   the bottom.

The point is the **size translation**: the skeleton tool and the game both draw `x` at a fixed step, so
the same `x` span is the same height everywhere; `y` is normalised to the tree’s own extent.

---

## 1. The render contract (what both tools obey)

Shipped in `honeycomb-tuning.js` (`progression.treeView`) and
`honeycomb-overlays-progression.js`:

```
width       = max(320, floor(stage.clientWidth / pixelScale))
usableWidth = width - 2 * sideMargin           // sideMargin = 42, so 236 at the 320 minimum
screenX(y)  = sideMargin + ((y - yMin) / (yMax - yMin)) * usableWidth
screenY(x)  = topMargin + (x - xMin) * depthStep          // topMargin = 34, depthStep = 9
treeHeight  = max(640, topMargin + (xMax - xMin) * depthStep + bottomMargin)   // bottomMargin = 54
```

Two consequences that make the translation easy:

- **`x` is absolute.** One unit of `x` is always 9 honeycomb pixels. Height is `(xMax − xMin) × 9`.
- **`y` is relative.** Only the spread between `yMin` and `yMax` matters; the same shape at `y 10–90`
  and `y 20–80` draws identically. Keep the values, or rescale them — the picture is the same.

---

## 2. The saved skeleton

File: `!designDocs/skeletons/reference_for_size.json` (`nextId 14`, zoom ≈ 1.57; pan irrelevant).

| id | label | x (depth) | y (lane) | requires |
|---|---|---|---|---|
| n2 | R  | 5  | 50 | — (root) |
| n1 | A1 | 15 | 50 | n2 |
| n3 | E1 | 25 | 25 | n1 |
| n6 | N1 | 25 | 75 | n1 |
| n9 | N4 | 35 | 10 | n3 |
| n11 | N6 | 35 | 40 | n3 |
| n12 | N7 | 35 | 60 | n6 |
| n10 | N5 | 35 | 90 | n6 |
| n13 | N2 | 45 | 50 | n3, n6 |

**Topology:** `R → A1 → {E1, N1}`; `E1 → {N4, N6}`; `N1 → {N7, N5}`; then `N2` **joins** `E1` and
`N1`. It is mirror-symmetric about `y = 50` (E1↔N1, N4↔N5, N6↔N7). `N2` names two prerequisites, so in
content it is a genuine convergence: `requiresAll: true`.

**Drawn size as saved:** x span `45 − 5 = 40` → `40 × 9 = 360 px` tall, below the 640 floor, so it
draws in a 640 box with room to spare. y is symmetric about 50, so it centers.

| Row | x | screenY |
|---|---|---|
| R | 5 | 34 |
| A1 | 15 | 124 |
| E1, N1 | 25 | 214 |
| N4, N6, N7, N5 | 35 | 304 |
| N2 | 45 | 394 |

---

## 3. Brienne’s exact live tree (the size reference)

`progressionTree.backgroundPath: "progression/knight-tree"`, `aspect: 16/9`.

| index | name | x | y | requires | effect |
|---|---|---|---|---|---|
| `briStart` | Trained | 8 | 50 | — | +5 Max HP per rank (rank 3) |
| `briGuard` | Set Stance | 26 | 26 | briStart | +8 Max HP; `exclusiveGroup: briPath` |
| `briThorns` | Thorn Armour | 45 | 16 | briGuard | adds `brienneThornArmour` |
| `briWall` | Aegis | 45 | 38 | briGuard | grants `brienneAegis` |
| `briEdge` | Keen Edge | 26 | 74 | briStart | `exclusiveGroup: briPath`; unlocks `duelistBlade`; replaces `brienneStrike` → `brienneRiposte`; tag `striker` |
| `briRally` | Rally | 45 | 84 | briEdge | adds `brienneRally` |
| `briBulwark` | Second Bulwark | 45 | 62 | briEdge | adds `brienneBulwark` |
| `briParagon` | Paragon | 70 | 50 | briGuard, briEdge | +15 Max HP; `temporaryBonus 2`; `modifyTemporaryHealthGained` hook |

**Size:** x spans `70 − 8 = 62` → `62 × 9 = 558 px` of content in a `(34 + 558 + 54) = 646 px` box.
y spans `16–84` (symmetric about 50), so it fills the column width.

| Row | x | screenY (x − 8) |
|---|---|---|
| briStart | 8 | 34 |
| briGuard, briEdge | 26 | 196 |
| briThorns, briWall, briRally, briBulwark | 45 | 367 |
| briParagon | 70 | 592 |

Note the two exclusive nodes (`briGuard` / `briEdge`) sit on the **same row** and their children share
one row; `briParagon` is the only convergence.

---

## 4. Translation

To make a skeleton draw at the **same height** as the live tree, scale its `x` by
`liveSpan ÷ skeletonSpan`:

```
x' = xMin_live + (x - xMin_skeleton) * (liveXSpan / skeletonXSpan)
```

For the saved skeleton against Brienne’s live tree (`62 / 40 = 1.55`), rooted at the live root `x = 8`:

| Row | skeleton x | same-size x' |
|---|---|---|
| R | 5 | 8 |
| A1 | 15 | 23.5 → 24 |
| E1, N1 | 25 | 39 |
| N4, N6, N7, N5 | 35 | 54.5 → 55 |
| N2 | 45 | 70 |

If the tree is meant to be **taller than the old one** (the whole reason the height is now free), skip
the scaling and keep the raw `x`; it just draws 360 px of content instead of 558. **The important rule
is consistency per tree**, not matching the old number.

`y` needs no translation. Keep the skeleton’s lanes (they are already symmetric about 50), or round
them to the guide set in `TREE-DESIGN.md` §2.4.

---

## 5. Open notes

- The skeleton’s labels are provisional: `R` = root, `A1` = the first ability (or a ranked root
  upgrade), `E1` = economy, `N1…N7` = unnamed. Role tags come from Noodle in prose, then the agent
  fills effects.
- `N2` is a join, so it will carry `requiresAll: true`; the live `briParagon`'s two prerequisites are
  **exclusive** to each other, so it must stay "any one" (no `requiresAll`).
- The current tree is only 8 nodes with a single fork; the skeleton is 9 nodes with two tiers of
  branching and a join. They are different topologies — this doc compares **size**, not shape.

---

## Appendix — Brienne’s live `nodeArray`, verbatim

```js
progressionTree: {
	backgroundPath: "progression/knight-tree",
	aspect: 16 / 9,
	nodeArray: [
		{ index: "briStart", name: "Trained", description: "+5 Max HP per rank.",
			x: 8, y: 50, cost: 20, rankMaximum: 3, healthModifier: 5 },
		{ index: "briGuard", name: "Set Stance", description: "+8 Max HP. Shuts off Keen Edge.",
			x: 26, y: 26, cost: 40, requiresArray: ["briStart"], exclusiveGroup: "briPath", healthModifier: 8 },
		{ index: "briThorns", name: "Thorn Armour", description: "Adds Thorn Armour to the deck.",
			x: 45, y: 16, cost: 60, requiresArray: ["briGuard"], cardAdditionArray: [{ index: "brienneThornArmour", count: 1 }] },
		{ index: "briWall", name: "Aegis", description: "Grants the Aegis ability.",
			x: 45, y: 38, cost: 60, requiresArray: ["briGuard"], abilityAdditionArray: [{ index: "brienneAegis" }] },
		{ index: "briEdge", name: "Keen Edge", description: "Sword Strike becomes Riposte. Unlocks the Duelist's Blade. Shuts off Set Stance.",
			x: 26, y: 74, cost: 40, requiresArray: ["briStart"], exclusiveGroup: "briPath",
			unlockEquipment: "duelistBlade", cardReplacementArray: [{ from: "brienneStrike", to: "brienneRiposte", count: 1 }], tagAdditionArray: ["striker"] },
		{ index: "briRally", name: "Rally", description: "Adds Rally to the deck.",
			x: 45, y: 84, cost: 60, requiresArray: ["briEdge"], cardAdditionArray: [{ index: "brienneRally", count: 1 }] },
		{ index: "briBulwark", name: "Second Bulwark", description: "Adds a second Bulwark.",
			x: 45, y: 62, cost: 60, requiresArray: ["briEdge"], cardAdditionArray: [{ index: "brienneBulwark", count: 1 }] },
		{ index: "briParagon", name: "Paragon", description: "+15 Max HP. Temporary HP gained is increased by 2.",
			x: 70, y: 50, cost: 120, requiresArray: ["briGuard", "briEdge"], healthModifier: 15,
			temporaryBonus: 2,
			hooks: { modifyTemporaryHealthGained: function (amount, params) { return amount + params.definition.temporaryBonus; } } },
	],
},
```
