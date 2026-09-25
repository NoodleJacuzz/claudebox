# tools/ — folder map

Every Honeycomb dev tool. **None of these is loaded by the game.** Each resolves the repo from its own
location, so they run from any working directory.

Moved here session 41 from the honeycomb root, which is now four documents and nothing else.

## The suite and the audits

| Tool | Reports |
|---|---|
| `test-honeycomb.js` | **The suite.** Run it before changing anything — a red suite names what the last session left undone. |
| `check-syntax.sh` | Every Honeycomb JS file parses. A file that fails to parse loads as nothing, and the symptom appears far from the cause. Run after any scripted edit. |
| `ptr-check.js` | Compares the deployed PTR (or any base URL given) with the local files: script and stylesheet tags in `index.html` and `mobile.html`, then every file those pages load, by byte size. Written 2026-09-23 when the PTR served a stale `index.html` missing ten Honeycomb scripts, so Nettle had no scene and the gallery did nothing. Since session 60 it also checks every file `honeycomb-loader.js` lists. Exit code 1 on any difference. |
| `doc-links.js` | Every backticked path in the design docs resolves. Exits 1 on a stale pointer. Run after moving or renaming a doc. |
| `feedback-audit.js` | The root `../FEEDBACK.md` index agrees with every workstream’s own feedback file. Exits 1 on a disagreement — which is the signal that the previous session closed an item but was cut off before updating the index. **Run it at the start of a session.** |
| `audit-trees.js` | Progression trees against their hard rules. |
| `budget-audit.js` | A stub that runs Basic Bite (`balance/basic-bite.js`): every encounter played against the damage budget. |
| `enemy-template.js` | Every enemy and encounter against its role template. |
| `lust-share.js` | What share of enemy moves deal Lust, which tags the roster teaches, per-region Lust pressure, and a SILENT list of enemies that teach the ledger nothing. **The instrument `enemy_overhaul/` E3 is graded on.** Run after any enemy content edit. |
| `encounter-coverage.js` | Which encounters a real run can actually reach. |
| `audit-card-fit.js` | Every card form at every size; printed text that does not fit its box. Browser. |
| `audit-sprite-fit.js` | Every encounter; enemy sprites drawn off the top or the sides of the window. Browser. Run it at the window shape being asked about — a bigger window clips harder, not less. |
| `audit-scale-parity.js` | Proves a phone-sized copy matches desktop. Browser. |
| `audit-turn-time.js` | Expected vs actual turn time, frame drops, long tasks, drag cost. Browser. |
| `sfx-report.js` | Sound assignments. Reads `sfx-metrics.json`; `sfx-durations.js` rebuilds it. |
| `desk/` | **The phone desk** (2026-09-21). `server.js` is the home-network page Noodle edits events and leaves notes from; `desk-cli.js inbox` is how Claude reads what he left; `selftest.js` checks the event reader changes nothing. Read `../desk/CATCH-UP.md`. |
| `desk/rewrites.js` | **What Noodle changed, read off the desk's own backups.** `events.js` copies a game file before every write, so a before and an after already exist for every edit he makes from the phone. Prints them paired as candidate entries for the rewrite log. Also `desk-cli.js rewrites`. The project is `!designDocs/voice_matching/`. |

## Music (`music/`)

| Tool | Is |
|---|---|
| `music/music-loops.json` | **The cut list** — which seconds of which source song each looping track is made of. Editing this is how the music is changed. |
| `music/build-music-loops.py` | Builds `honeycomb sound/music/loop/*.mp3` from the cut list, masters them to one loudness, and proves each file's post-roll repeats its opening. Python; needs numpy, scipy and the `imageio-ffmpeg` package's ffmpeg. |
| `music/music-metrics.json` (+ `.js` twin) | GENERATED. What the build measured; suite block [123] holds `tuning.audio.music` to it. |
| `music/music-audition.html` | The listening bench: drops each track a few seconds before every join, through the game's real player. Opens from disk. Workstream: `../engine/MUSIC.md`. |

## Inspectors

| Tool | Prints |
|---|---|
| `card-inventory.js` | Every card, flat. Also the canonical `FILES` load order the other tools import. |
| `save-text.js` | **A save Noodle sends, made readable** (2026-09-23). Copy / Load Save and `.noodle` files hold the save compressed (`HC1~...`); `unpack <file> [out.json]` turns one back into JSON, `pack` goes the other way, `check` is the round trip suite block [140] runs. |
| `card-duplicates.js` | Cards sharing a name, or sharing a rules body across owners. (was _dup.js until 2026-09-25) |
| `progression-dump.js` | Every progression node, expanded. |
| `progression-sims.js` | Character mechanics driven through real fights. |
| `exp-model.js` | The EXP curve. |

## Generators

| Tool | Writes |
|---|---|
| `generate-progression-trees.js` | `!designDocs/skeletons/wip.json` → the character content file. **DO NOT RUN IT. It is stale, and a run replaces each character's whole `nodeArray`.** Session 55 ran it to change one number and silently reverted four pieces of hand-edited content, three of which no test covered — read the banner at the top of the file. Edit the trees in `honeycomb-content-characters.js` by hand; `--report` prints what this tool thinks they are. |
| `generate-font-metrics.js` | `honeycomb-font-metrics.js` (GENERATED). `--check` fails when it is stale — suite test [76]. |
| `generate-placeholder-art.py` | All the stand-in art. |
| `archive-census.py` | **Which game pictures have no original in `v13 spire png/`, and what on disk looks like each one.** Matches by comparing the pictures, not their names. Reads and writes nothing; there is no `--apply` and there must not be. `--list`, `--area <folder>`, `--found`, `--rescan`. |
| `generate-sprite-metrics.js` | `honeycomb-sprite-metrics.js` (GENERATED): the pixel size of every character and enemy .webp, by content path. Also prints a census of the canvas shapes in use, which is what an art restructure needs. Rerun after any art lands. |
| `png-to-webp.py` | **The archive, not a tray.** Every .png under `v13 spire png/` becomes a .webp at the same relative path under `v13 spire images/`, and **the .png stays where it is, forever**. The path in the archive IS the path in the game, so nothing is renamed and no destination is chosen. A .webp newer than its .png is skipped, so running it again converts only what changed (`--force` overrides). A path with a `_folder` in it is a working bench and is refused rather than turned into a game file. Dry-run by default; `--apply` writes. Quality 88, matching every other asset. Non-.png files (the prompt sidecars) are left where they are. |
| `card-prompts.js` | `../art_pipeline/CARD-PROMPTS-01.md`, a webui-ready art prompt per draftable card. |

## Benches (open in a browser)

| Page | Is |
|---|---|
| `card-effects-preview.html` | The card frame composer, broken-card effect candidates, and an SVG filter lab. Workstream: `../Archive/demo1/card_redesign/BRIEF.md`. |
| `nameplate-preview.html` | The fighter nameplate against its mockup reference. |
| `tree-maker.html`, `tree-skeleton.html` | The progression tree editors. |
| `sfx-report.html` | The sound report, rendered. |

## Browser driving

Two different agents work on this project, and they reach a browser differently. **Read the note first;
do not hand the wrong one to the wrong agent.**

> **If you are Claude (the `claude` CLI, working from `.claude/`): keep using your own preview server.**
> Your setup is `.claude/devserver.py` + `.claude/launch.json`, and it works. The tool below is not for
> you; do not switch to it.

**opencode's browser tool** — for the opencode agent only. The opencode desktop app's MCP plumbing never
connected a browser server, so this bypasses MCP entirely and drives the system Chrome through the
Playwright bundled with `@playwright/mcp` (no browser download, no config, no restart).

1. Serve the game with no caching: `python .claude/devserver.py 8000` (leave it running).
2. Drive it with `agent-browser.js`:

```
node "!designDocs/honeycomb/tools/agent-browser.js" --out shot.png [options]
```

| Option | Meaning |
|---|---|
| `--url <url>` | default `http://localhost:8000/index.html`; also accepts a `file:///…` path (needed to prove offline behaviour) |
| `--out <png>` | where the screenshot is written; read it back with the Read tool |
| `--viewport WxH` | default `1280x720`; e.g. `812x375` for phone landscape |
| `--scale <n>` | device scale factor (2 gives a sharper shot) |
| `--wait <ms>` | how long to wait after load before acting (2500–3000 is plenty; the title boot is slow) |
| `--after <ms>` | wait between the eval and the shot (default 1200) |
| `--eval "<js>"` / `--eval-file <file>` | run a snippet in the page before the shot; the game exposes `window.honeycomb` |
| `--hover "<selector>"` | real pointer hover, so inline `onmouseenter` tooltips fire |
| `--full` | full-page screenshot |
| `--console` | print the page's console output and `[pageerror]`s, plus the eval's return value |

The eval snippet is how the game is driven, e.g. start a fight and open a screen:

```js
(async () => {
  honeycomb.state = honeycomb.newProfile();
  honeycomb.newRun([{ characterIndex: "severine", outfitIndex: "default" }], 42);
  honeycomb.combat.begin("loneSporeling", {});
  honeycomb.scene.go("combat");
  await new Promise((r) => setTimeout(r, 2500));
  return "ok";
})()
```

Rules of thumb: use `file://` to prove something works offline (a canvas is tainted there); use
`--console` to catch a page error a screenshot would hide; and hover with `--hover`, not a synthetic
event, when testing tooltips.

## balance/

The two balance tests. Each prints its name as its first line. Both use the real engine and the real cards.
The plan and the build steps are `../tooling/BALANCE-BRIEF.md`; where the build stands is `../tooling/TOOLING.md`.

**BALANCE TEST: BASIC BITE** — `node "!designDocs/honeycomb/tools/balance/basic-bite.js" [--workers N] [--seeds N] [--party a,b,c] [--region R] [--only x,y] [--json] [--trace encounter] [--bot-legacy]`.
Every encounter played as one fight with a typical deck, against the targets in `tuning.balance`, then a plain-English list of the
encounters that are far from target. `budget-audit.js` is now a two-line stub that runs it.

**BALANCE TEST: ALL THE CRUNCH** — `node "!designDocs/honeycomb/tools/balance/all-the-crunch.js" <mode> [--workers N] [--out folder]`.
Whole runs, first map node to last boss. Modes: `--trace SEED` (one run printed, one line per stop), `--compare` (learns card values from an
explore batch, then the learned bot against a thin-deck bot and a take-everything bot on the same seeds), `--career` (one player on one
profile, run after run, until everything has been reached), `--matrix` (fixed tree levels times every party; `--hours N` plans its own
size and prints the plan; it is stopped and restarted safely because every finished run is written to `matrix-results.jsonl`).
Results go in `balance/results/<date>-<tag>/`.

`lib/` holds what both share: `engine.js` (loads the game headless), `combat-player.js` (the bot that plays a fight), `workers.js`
(spreads jobs over CPU processes, not AI agents, so no usage), `run-player.js` (plays a whole run through the game's own screens),
`policies.js` and `learning.js` (how the bot decides outside a fight), `career.js`, `stats.js`.

`profile-summary.js <folder>` sums a `node --cpu-prof` profile by function, so a slow tool can be read at a glance.

## gauntlet-sim/

`node "!designDocs/honeycomb/tools/gauntlet-sim/sim-boss.js"` — what Anastasia's gauntlet throws per turn
(damage + Lust), eight turns over twenty seeds, with and without each fight's `enemyStartingStatusArray`.
The party never falls and never kills anything, so the numbers are a CEILING, not an expectation. Re-run it
after touching a piece's moves or `tuning.chessmaster.gauntlet`. `engine.js` beside it is the headless
loader it uses (the suite's file list, read off `test-honeycomb.js`).

## draft-sim/

`draft-simulation.js`, `draft-sim-compare.js` and the seven `DRAFT-SIM-DATA*.json` result sets.

**The stored results are stale** — they model the card pool session 33 replaced, and 6 of the 20 cards
their cut list names no longer exist. Re-run before cutting a card on them. See
`../Archive/demo1/rework/cards/DRAFT-SIM-01.md`.
