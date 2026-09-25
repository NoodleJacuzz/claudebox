# Enemy rework — ARCHIVE

Closed items from `ENEMIES.md`, newest first, pasted here the minute they close: quote and annotation
together, unchanged. Nothing here is open work. Items closed before 2026-09-25 are in `../Archive/demo1/`, at the
old folder's path.

---

### E8. Region 1 is still called The Flooded Vault ☑ — CLOSED 2026-09-25 — `map/` OWNS THIS, RAISED SESSION 44

The enemies of Act1-A are dry frontier myconids as of session 44. The **region** they fight in is not:

| Still reads | |
|---|---|
| Region name | "The Flooded Vault" |
| Description | *"Deeper, colder, and something down here is still counting."* |
| Backdrop | `map/backdrop-vault-causeway`, a flooded causeway |

Recasting the enemies and leaving that standing produces a worse read than either state alone. It was
**not** fixed here for a specific reason: `../BASICS.md` records that Noodle already chose the title —
*"The live act 1-2 is to be titled **Myconid Navel**"* — and `map/` owns titling and act structure.
Taking that decision in this folder would be overwriting his.

The enemy-side half is done, so this is a one-file change in `honeycomb-content-map.js` plus a
backdrop. **`../engine/ENGINE.md` B31 already owns it** — its first of three owed items is this exact
thing, raised there from cosmetic to contradictory with a session-44 note. No new item was opened;
one report in two places is how a fix gets done twice or not at all.

**Closed 2026-09-25.** Region 1 was renamed the Mushroom Frontier in session 55 on Noodle's word (`../Archive/demo1/map/_archive/FEEDBACK-DONE.md` P9). What remains is the region's water paint, tracked as `../engine/ENGINE.md` B31.

---

### E5. "Regions" is the wrong shape ☑ — CLOSED 2026-09-25 — `map/` OWNS THIS

> The code separates them into "regions" but this is a mistake. There is Act1-1 and Act1-2 currently
> playable, and the Act1-2 in game currently is one of several planned routes through the second half
> of the mushroom themed act 1.

Recorded here because it decides what an enemy *belongs to*; the structural fix is `map/`'s. The code
is closer than the naming suggests — `bossEncounterIndexArray` already rolls per run from a pool, and
`regionIndexArray` on an encounter is already a general filter.

**Closed 2026-09-25.** Sessions 45 and 55 made the three sub-acts selectable: the Act1-1 boss a run beats decides its route (`tuning.map.route`), and the final row holds all three bosses. The code still calls them regions and nothing has needed otherwise.

---
