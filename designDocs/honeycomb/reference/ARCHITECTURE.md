# Honeycomb Catacombs — ARCHITECTURE

**Read this before writing engine code, and skip it otherwise.** It is the shape of the codebase: the
file map, the five ideas the design rests on, the registry table, and how to drive the engine headlessly.
It changes only when the architecture changes.

Content rules (what a card may do, what a number may be) are not here — those are `MECHANICS-01.md`,
`MECHANICS-02.md`, and the workstream briefs under `../rework/`.
The mistakes this architecture makes easy to repeat are `TRAPS.md`.

---


Everything hangs off one global: `window.honeycomb`. No bare globals except the boot function
`honeycombBoot()`. That is deliberate — `webui.js` runtime-loads library files into the game's global
scope, and a `const` collision there is a SyntaxError that kills a whole file.

### Files

```
scripts/misc/honeycomb.js                  KERNEL. Namespace, platform adapter, image resolver,
                                           RNG, scene router, overlay stack, mount/unmount, boot.
scripts/misc/honeycomb/
  honeycomb-tuning.js                      EVERY NUMBER IN THE GAME. No magic numbers elsewhere.
  honeycomb-state.js                       State shape, resources, POOL assembly, save/load.
  honeycomb-effects.js                     Effect / value / condition / target-mode registries.
  honeycomb-entities.js                    Damage pipeline, statuses, relics, hooks, party order,
                                           owner-down policy, party-size scaling.
  honeycomb-tags.js                        Free-form tags; the conditions and values that read them.
  honeycomb-content-statuses.js            Status table.
  honeycomb-content-cards.js               Card table + upgrade resolution.
  honeycomb-content-characters.js          Characters, outfits, equipment, relics, progression trees.
  honeycomb-content-abilities.js           Ability table (character spells).
  honeycomb-abilities.js                   Ability engine: charges, recharging, the use path.
  honeycomb-content-enemies.js             Enemies, intent AI, encounter groups.
  honeycomb-content-map.js                 Node types, regions, backdrops, events, shop tuning.
  honeycomb-content-lust-events.js         Lust Event triggers, and the Lust Events (appended to eventArray).
  honeycomb-progression.js                 Experience, the discovery ledger, progression trees.
  honeycomb-combat.js                      Combat rules. No DOM, no wall clock.
  honeycomb-choices.js                     Ask/rewind/replay: effects that stop and ask the player.
  honeycomb-forecast.js                    Dry runs: what a play would do, and what the enemies will.
  honeycomb-map.js                         Map LAYOUT STRATEGIES + generation + map scene.
  honeycomb-art.js                         Sprite resolution: tiers, poses, states, fallback chain.
  honeycomb-ui.js                          Shared UI builders: cards, portraits, vitals, top bar.
  honeycomb-text-tooltips.js               EVERY SENTENCE A TOOLTIP WRITES, keyed by kind (session 15).
                                           Read via honeycomb.tooltip.text/html/countText.
  honeycomb-overlays-progression.js        The progression tree, drawn DOWN the Progression tab.
  honeycomb-overlays-map.js                Event, treasure, rest, shop, card picker, region cleared.
  honeycomb-scene-title.js                 Title hub, system menu, debug panel.
  honeycomb-scene-teambuilding.js          Teambuilding scene.
  honeycomb-scene-combat.js                Combat scene + log replay + drag input + ability menu.
  honeycomb-overlays-combat.js             Victory and defeat.
  honeycomb-overlays-broken.js             The !!BROKEN!! cut-in and the recovery cut-in.
  honeycomb-lust-events.js                 Rank-up records, Event Ready, the lustEvent event host, Lust Battles,
                                           and the gainWeakness / gainPersonalExperience / unlock effects.
                                           Loads after overlays-combat (it registers a continuation there).
  honeycomb-font-metrics.js                GENERATED glyph widths of the card fonts, for the cardFit rule.
  honeycomb-warnings.js                    Content rule checks, console report at boot. Loads LAST.
scripts/css/honeycomb.css                  All styling. Scoped under #honeycombRoot only.
!designDocs/honeycomb/
  test-honeycomb.js                        1205 headless tests. Run after any engine change.
  audit-scale-parity.js                    Browser-pane tool: proves a phone-sized copy matches desktop.
  audit-card-fit.js                        Browser-pane tool: every card form at every size, reports text that does not fit.
                                           Ground truth for choosing a cardFit reference; the per-change check is the
                                           headless `cardFit` warning rule.
  generate-font-metrics.js                 Reads glyph widths from the card fonts into honeycomb-font-metrics.js
                                           (GENERATED). `--check` fails when it is stale (test [76]).
  audit-turn-time.js                       Browser-pane tool: expected vs actual turn time, frame drops, long tasks, drag cost.
  check-syntax.sh                          Parses every JS file. Run after any scripted edit.
  generate-placeholder-art.py              Dev tool. Makes the stand-in art.
  card-effects-preview.html                Dev tool. The new card frame composer, broken-card effect candidates,
                                           and an SVG filter lab (session 21). Workstream: card_redesign/BRIEF.md.
  card_redesign/BRIEF.md                   Card-face redesign. Start there for that workstream.
  card-prompts.js                          Dev tool. Writes CARD-PROMPTS-01.md, a webui-ready card art prompt
                                           per draftable card (session 21; Brienne hand-authored session 23).
  CARD-PROMPTS-01.md                       Review sheet. Brienne is the rewritten pass; others are still table-derived.
.claude/devserver.py                       No-cache dev server. Use it, not python -m http.server.
```

### The five ideas everything else follows from

**1. Content is data, engine is code.**
Cards, enemies, statuses, relics, events, node types, regions and encounters are all flat arrays of
objects carrying an `index` string, looked up with `honeycomb.findDefinition(array, index)`. Adding
content is adding a table entry. If you find yourself editing engine code to add a card, stop — the
engine is missing a verb, and the verb is what should be added.

**2. Effects are the verb layer.**
Nothing performs an action directly. A card, an enemy intent, a relic and an event choice all build an
`effectArray` and hand it to `honeycomb.resolveEffectArray`. Three registries make that expressive:

- `honeycomb.effectArray` — verbs (`damage`, `block`, `applyStatus`, `drawCards`, `addCardToDeck`,
  `repeat`, `branch`, `forEachTarget`, …)
- `honeycomb.valueArray` — any number can be an expression instead (`{index:"stat", stat:"block",
  of:"source"}`, `{index:"math", operation:"multiply", …}`)
- `honeycomb.conditionArray` — gates (`compare`, `hasStatus`, `hasRelic`, `partyContains`, `all`,
  `any`, and every condition can be inverted in place)

Effects also generate their own rules text, so a card's printed text can never disagree with what it
does. Hand-written `text` overrides it when a card needs better prose.

**3. Hooks are the modifier layer.**
Statuses, relics, equipment and outfits all publish the same `hooks` table.
`modifyDamageDealt`, `modifyDamageTaken`, `modifyBlockGained`, `modifyEnergyPerTurn`,
`modifyCardCost`, `modifyDrawPerTurn`, `onTurnStart/End`, `onCombatStart/End`, `onDamaged`, `onDeath`,
`onCardPlayed`, `onEnemyDowned`, `onAllyDowned`. Value hooks fold; event hooks act.

⚠ **The trap here, already hit once:** per-entity hooks and party-wide hooks need different treatment.
Folding `modifyEnergyPerTurn` across three allies *with relics included* applies each relic three
times. Party-wide values pass `includeRunWide: false` per ally and then call
`honeycomb.applyRunHooks` exactly once. See the comment on `honeycomb.hookSourceArray`.

**4. Combat is headless; the screen replays a log.**
`honeycomb-combat.js` touches no DOM and reads no clock. It mutates state and appends to
`context.log` — an ordered list of what happened. `honeycomb-scene-combat.js` walks that log and plays
each entry as a timed beat. **State is final before the first frame draws**, so an interrupted or
skipped animation can never leave the board disagreeing with the rules. Adding a new animated
consequence is one entry in `honeycomb.combatScene.logHandlerArray`.

**5. Determinism is structural.**
RNG is drawn from **named streams** (`map`, `mapEvent`, `encounter`, `shuffle`, `combat`, `reward`,
`shop`), each with its own counter. Adding a random call to combat cannot shift the map that was
generated before the fight. A stream's entire state is `(seed, calls)`, and mulberry32's nth value is
derivable from those two integers — so saving the counter is an exact snapshot with no PRNG internals
in the save file.

---

---

## Round 02 in one screen

Registries added (all table entries, all in the files named):

| Registry | File | Is |
|---|---|---|
| `cardTypeArray` | content-cards | Card types and their defaults: pose, animations, partyShift, afterPlay, tint |
| `keywordArray` | content-cards | Printed words explained in sidecars. Statuses count automatically |
| `partyShiftArray` | entities | none / front / back / forward / backward, with `previewShift` and `shiftEntity` |
| `discoveryKindArray` | progression | Now with `discoveredOn` "meet"/"earn", eventPath, outfit, equipment |
| `combatContinuationArray` | overlays-combat | Where a won fight leads: map, or back into the event that started it |

Resolution orders worth knowing:
- **Where a card moves its owner**: card `partyShift` → loadout `partyShiftByCardType` → character →
  type default. `honeycomb.cardPartyShift`.
- **How an action looks**: its own `pose`/`animationArray` → its type's (card type, intent type, or
  `honeycomb.art.abilityPresentation`).
- **Reward slots**: bonus → guarantees → spread across members who can gain cards.

---
## How to test

**Headless, fast, no browser** — the engine has no DOM dependency, so it can be driven from Node with
a small shim. This is how determinism and save/resume were verified. Load the files in order into a
`vm` context with a fake `window`/`localStorage`/`document`, then drive `honeycomb.combat.*`.

Already proven this way:
- Same seed → byte-identical trace, outcome and rewards, across five encounters including the boss
- Different seed → diverges
- Save mid-combat → load into a *fresh engine instance* → the fight continues to an identical result
- Ally identity is not duplicated across the save boundary

**In a browser** — `devPreviewTarget = "honeycomb"` (or `"honeycombFresh"` to ignore the autosave),
then drive it from the console. `honeycomb.state`, `honeycomb.scene.go(...)`,
`honeycomb.map.enterNode(...)`, `honeycomb.combatScene.attemptPlay(...)` are all reachable.
`honeycomb.combatScene.busy` is true while a log is replaying — wait on it before the next action.

**From the agent, headless (session 13).** `!designDocs/honeycomb/tools/agent-browser.js` drives the system
Chrome through the Playwright bundled with `@playwright/mcp` (no browser download, no MCP — the desktop
app's MCP plumbing never connected). It navigates, runs a snippet in the page, captures console/page errors,
and screenshots; the agent reads the PNG back. Start the server first
(`python .claude/devserver.py 8000`), then:

```
node "!designDocs/honeycomb/tools/agent-browser.js" --out shot.png --wait 6000 \
  --eval-file job.js --console --viewport 1280x720 [--scale 2] [--full]
```

`--eval-file` is a script evaluated in the page (the game exposes `window.honeycomb`), so it can set up a
fight (`honeycomb.newProfile(); honeycomb.newRun(...); honeycomb.combat.begin(...); honeycomb.scene.go("combat")`)
or open an overlay and inspect the DOM. `--after` sets the wait between the eval and the shot.

---
