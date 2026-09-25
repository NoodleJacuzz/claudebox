# LANES — two agents, one repo, no git

**Read this when another agent is working in the repo at the same time as you.** There is no version
control here: a clobbered edit is gone. Written for the overnight of session 44, when `enemy_overhaul/`
E7 and the Anastasia build run side by side. It is short on purpose.

A **lane** is one agent's work. Every line a lane adds to a shared file sits inside that lane's banners,
every index it creates carries that lane's prefix, and every shared file has one owner per region.

| Lane | Tag | Session # | Brief |
|---|---|---|---|
| Enemy overhaul E7 — Act1-B, Act1-C, the routes | **`E7`** | **45** | `../Archive/demo1/enemy_overhaul/_archive/HANDOFF-E7.md` *(done session 45)* |
| Anastasia — her kit and her gauntlet | **`ANA`** | **46** | `../Archive/demo1/chessmaster/BUILD-ANASTASIA.md` |

---

## 1. Banners — every addition to a shared file

```
	//>>> LANE E7 | flora | enemies >>>
	...
	//<<< LANE E7 | flora | enemies <<<
```

Format: `//>>> LANE <tag> | <area> | <what> >>>` to open, the same text between `//<<<` and `<<<` to
close. ASCII only. `grep -n "LANE E7"` lists one lane's whole footprint in a file, and
`grep -rn ">>> LANE" scripts/misc` lists everything both lanes added tonight.

- **Inside your own banners: edit freely. Inside the other lane's: never.**
- **Outside every banner** is existing code. In a SHARED file (§3) touch it only where the table says
  the line is yours. In a file that is wholly yours, banners are not needed.
- One banner pair per area per table. Add to the pair you already opened rather than opening another.
- The banners stay in after tonight. They are how Noodle audits who did what in the morning.

## 2. Index prefixes — `honeycomb.findDefinition` returns the FIRST match

A duplicate index does not error; it shadows silently. So the index namespace is split, not shared:

| Lane | May create indices beginning with |
|---|---|
| **`ANA`** | `anastasia`, `celestial`, `infernal`, `gauntlet`, `chess` — **and nothing else** |
| **`E7`** | anything **not** on the line above. Encounters begin `flora` or `pollen`; an enemy's cards begin with that enemy's own index, as the existing roster does |

Grep the whole of `scripts/misc` for an index before creating it.

## 3. Shared files — who owns what

| File | `E7` owns | `ANA` owns |
|---|---|---|
| `honeycomb-content-enemies.js` | its banners in `enemyCardArray`, `enemyArray` (after the REGION 2 section, before ELITES) and `encounterArray` (after `REGION 2, late`, before `ELITES`); the Glowcap Moth entry; the Tallyman's two pool rows | **the twelve piece entries at the head of `enemyArray` ("The Infernal pieces" through to the REGION 1 banner) and their cards**; its banners for the gauntlet, placed directly AFTER the last piece entry and at the very END of `encounterArray`'s BOSSES section |
| `honeycomb-content-map.js` | `regionArray` positions **2 (`flora`) and 3 (`pollenRoad`)**; the two existing entries' boss pools | `regionArray` position **4 (`gauntlet…`)** — added only once 2 and 3 exist (§4) |
| `honeycomb-map.js`, `honeycomb-overlays-map.js` | **all of it** — the route mechanism | nothing. ANA reaches the map through `tuning.map.route.overrideArray` only |
| `honeycomb-tuning.js` | `tuning.map.route` (new, inside `map:`) | `tuning.chessmaster` |
| `honeycomb-content-characters.js` | nothing | Anastasia's character entry; one banner in `relicArray` |
| `honeycomb-content-cards.js`, `honeycomb-content-abilities.js`, `honeycomb-content-statuses.js`, `honeycomb-effects.js`, `honeycomb-combat*.js`, `honeycomb-scene-*.js`, `honeycomb-art.js` | nothing | all of it |
| `../tools/test-honeycomb.js` | block **`[113]`**, inserted directly ABOVE the line `console.log("\n[112] …`; the three region-count checks near line 7352 | block `[112]` (already hers), and **`[114]` onward**, appended at the end above the final `// -----` rule |
| `../CATCH-UP.md`, `../FEEDBACK.md` | its own workstream row; one "Recent sessions" line, **session 45** | its own row; one line, **session 46** |
| `../Archive/SESSION-LOG.md` | one entry, 45 | one entry, 46 |

`[113]` sits above `[112]` in the file so the two lanes never insert at the same anchor. Block order
does not change what the suite checks. Say so in the block's header comment.

## 4. The one ordering dependency — region positions

`regionIndexArray` on an encounter holds **positions** in `honeycomb.regionArray`, not index strings.
So the order regions are added in is load-bearing, and it is fixed:

| Position | Region | Added by |
|---|---|---|
| 0 | `upperCatacombs` | exists |
| 1 | `floodedVault` | exists |
| 2 | `flora` | E7, in its **first** stage |
| 3 | `pollenRoad` | E7, in its **first** stage |
| 4 | the gauntlet | ANA, in its **last** stage |

**ANA: before adding position 4, `grep -n 'index: "pollenRoad"' scripts/misc/honeycomb/honeycomb-content-map.js`.**
No hit means E7 has not got there. Do not add E7's regions for it. Finish everything else in the brief,
check once more, and if they are still absent build the gauntlet's enemies and encounters anyway, prove
them with `honeycomb.combat.begin("<encounter>")`, leave the region and the relic unwired, and write
that down as the first line of `../Archive/demo1/chessmaster/STATUS.md`.

## 5. Mechanics of not clobbering

- **Never rewrite a shared file whole.** No `Write`, no `sed -i`, no script that reads a file and writes
  it back. Exact-string edits only, and each one small.
- **An edit that fails because the file changed since it was read is the system working.** Re-read only
  the region being edited and try again. Do not reach for a bigger hammer.
- **Re-read a region immediately before editing it**, not from memory of an hour ago.
- **A red suite is not automatically yours.** Each failure prints under a numbered block: a failure in
  the other lane's block, or in a check about the other lane's files, is theirs mid-edit. Note it, wait
  a few minutes, re-run. Fix only what is yours. **Never edit the other lane's checks to get to green.**
- **The pass COUNT will drift** as the other lane adds checks. The contract is **0 failed**, plus your
  own block's checks all present.
- **`devPreviewTarget` in `scripts/index.js` is contested.** Set it, look, and set it back to `""` in the
  same sitting. Assume the other lane may reset it under you; re-check before trusting a page load.
- **The browser pane's localStorage is shared** between agents using the same origin. Back the Honeycomb
  save up to a scratchpad file before testing and restore it after.

## 5a. ANA → E7, session 46: the gauntlet has landed, and one of your checks is a tripwire for it

Lane `ANA` added its one `overrideArray` row (`gauntletInvitation` → `gauntletGallery`) and
`regionArray` position 4. Your block `[113]` check **"overrideArray ships empty -- its one row is lane
ANA's"** asserts `route.overrideArray.length === 0`, so it is now red **by design of the contract, not by a
regression** *(resolved: E7 re-pinned it later the same night, and the suite closed at 2051 / 0)*. It is
your check and ANA has not touched it. What is true now, if you want to re-pin it:
`overrideArray.length === 1`, and its row names a relic and a region that both exist. ANA's own block
`[114]` already asserts the row routes correctly, that the region is not in `countedRegionArray()`, and
that the relic is unofferable while `tuning.chessmaster.gauntlet.enabled` is `false` (it ships `false`).

Also yours, seen in passing and left alone: `../tools/enemy-template.js` throws in `groupBudget`
(`turnTargetArray` has no row for a new tier — `'boss'` of `undefined`), and the warning report carries two
`cardFit` warnings for `fruitWindfall`.

## 6. The contract between the two lanes — `tuning.map.route`

E7 builds this and ANA consumes it. Neither may change its shape without the other's brief changing.

```
route: {
	regionsPerRun: 2,                       //a run is won after this many regions, not regionArray.length
	defaultSecondRegion: "floodedVault",    //what an old save, or an unmapped boss, descends into
	byBossArray: [                          //the Act1-1 boss just beaten decides the second region
		{ bossEncounterIndex: "tallyLedger",   regionIndex: "floodedVault" },
		{ bossEncounterIndex: "gardenerGrove", regionIndex: "flora" },
		{ bossEncounterIndex: "matriarchLair", regionIndex: "pollenRoad" },
	],
	overrideArray: [],                      //{ relicIndex, regionIndex } -- a held relic outranks the boss. ANA's row.
},
```

- `run.routeRegionIndex` — a region **index string**, written once when the run leaves region 0.
  Absent (a save from before tonight) reads as `defaultSecondRegion`.
- Resolution order: **`overrideArray`** (first row whose relic the run holds) → **`byBossArray`** →
  **`defaultSecondRegion`**.
- A region that only an `overrideArray` row points to is **secret**: it is never counted, listed or
  named anywhere a player can see before they stand in it. `honeycomb.map.countedRegionArray()` is the
  one place that decides, and every screen or ledger that counts regions asks it.
- **The release fallback is this table.** Pointing a `byBossArray` row back at `"floodedVault"` takes
  that route out of the game with one line and no other change. Both lanes must keep that true.
