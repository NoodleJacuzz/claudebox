# Performance — FEEDBACK

**The top demo goal.** Why the game runs poorly for players, what to do about it, and the telemetry that would answer the question at scale.

The half that cannot be answered from Noodle's machine is the point of the question — his hardware is not player hardware.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins. Items were split out of the round-09 file in session 41 and moved
byte for byte — nothing was rewritten on the way.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `../CATCH-UP.md`. What the project is: `../BASICS.md`.

---

### A8. Telemetry — PROMOTED, endpoint still unpicked ⏸

> I wanted to know if obtaining telemetry data when the game was hosted on itch.io and neocities was
> possible, manual copy-out does not do that and the scale would be frankly horrible.

> Might be a demo goal. It would turn thousands of lurker players into real datapoints.

> A8 I don't actually know what the solutions you picked were, but you mentioned them not working on
> neocities? If they don't work on neocities (and only neocities, I don't want to bump heads with
> mopoga devs thinking I'm stealing from their servers), it's not an option. I'm not getting data from
> a locally played copy meant to be played offline.

**Correction — it does work on neocities.** `TELEMETRY-01.md` part 1 says collection is possible *from*
both hosts but never *by* either host: neocities and itch are static file hosts, so neither can receive
and keep a POST. The game is ordinary JavaScript in an ordinary browser, and outbound requests are not
blocked on either host. So the beacon goes **player's browser → an endpoint you own**. Neocities is
untouched by it.

Which also answers the mopoga worry, and better than he expects: **nobody else's servers are involved
at any point.** The endpoint is a URL you control — a Google Apps Script under your own account, or a
Cloudflare Worker under your own account. Neocities does not store it, does not forward it, and does
not pay for it.

His two constraints, and where they already sit:

- **Only the neocities build should report.** Not covered by `TELEMETRY-01.md` — **add it**. The
  endpoint URL is already a blank-by-default tuning value, so the clean shape is an explicit host
  allowlist checked before the payload is built: report only when `location.hostname` matches the
  neocities domain, silently no-op everywhere else. That keeps mopoga and any other mirror out by
  construction rather than by hoping the build is right.
- **No data from offline local copies.** Already true by design, part 4: BASICS requires the game to run
  from a local `index.html`, a beacon from `file://` simply fails, and the send is fire-and-forget and
  swallows its own errors. The host allowlist above makes it explicit rather than incidental.

**The two options, plainly** (`TELEMETRY-01.md` part 3):

| | Free tier | Effort | Reads back as |
|---|---|---|---|
| **Google Apps Script → Sheet** | effectively unlimited at this volume | lowest | rows in a spreadsheet |
| **Cloudflare Worker** | 100k requests/day | low, needs an account | Workers KV or D1, a little SQL |

Both are yours, both are free at this scale (~600 requests/day at 200 players × 3 runs), and neither is
Google Analytics — GA4 was ruled out on its adult-content terms, and that reasoning does not transfer
to a plain Apps Script writing to your own Sheet, though it is worth knowing it is still a Google
account holding adult-game data. **Cloudflare is the safer pick on that one axis**; Apps Script is the
faster one to stand up.

**This is the highest-value unanswered question in the file now**, because of B16. He wants to know why
players report bad performance and whether they are seeing something he is not — and this is the
instrument that answers it. It stopped being a metrics nicety and became the diagnostic.

Answered in `TELEMETRY-01.md`: yes from both hosts, but never *by* either host — both are static file
hosts, so it needs a third-party endpoint. One beacon per run end is ~600 requests/day at 200 players ×
3 runs, inside every free tier considered. GA4 is out on its adult-content terms. Recommendation: a
Google Apps Script writing rows to a Sheet, or a Cloudflare Worker if you already have an account.
**Pick one** and the build is a short session (TELEMETRY-01 part 6).

If it is built for B16 rather than for design metrics, the payload changes: frame cadence, device class,
and the `missed`/`dropped` counters matter more than run outcomes. Worth deciding the purpose at the
same time as the endpoint.

---

### B16. Performance: why it runs poorly for players ☐ — TOP DEMO GOAL

> High priority, most important demo goal is better performance. Why are players saying the game runs
> poorly? Are they experiencing different things than on my machine?

The question has two halves and they need different tools.

**"Why does it run poorly"** is B14 — the session-12 cause list, levers 3, 4, 5, 8, 9, 11, 12
outstanding. The three that punish weak hardware hardest are already known: combat repaints rebuilding
the whole screen from `innerHTML` every `afterBeat` (3), forced synchronous reflows (4), and many small
DOM writes per beat (8). None of them need a player report to justify fixing.

**"Are they experiencing different things than on my machine"** cannot be answered from this machine at
all, and that is the real content of the question. His hardware runs Stable Diffusion locally; player
hardware is phones and old laptops. The known asymmetries:

- **Battery savers cap the page at ~30Hz** (A12's `cadence` note) and read as the game stuttering.
- **Weak GPUs** make lever 12 (VFX SVG filters, GPU work per effect) dominant where it is invisible here.
- **Mobile browsers** re-layout far more expensively, so levers 3, 4 and 8 scale differently there.

So this goal needs a measurement path, not just fixes: **A8 telemetry** for scale, **A12** for one real
device, and a decision on whether to ship a low-effects default rather than an opt-in.

---

### B14. Performance ◐

Remaining levers from the session-12 cause list (numbers as in `../Archive/FEEDBACK-07-DONE.md`):

3. Combat repaints rebuild the whole screen from `innerHTML` every `afterBeat` (sides, hand, top bar).
4. Forced synchronous reflows (`void offsetWidth` restarts; `getBoundingClientRect` in drags/forecasts).
5. Forecasts snapshot and restore a large state on the hover path.
8. Many small DOM writes per beat (floating numbers, trails, plate rebuilds).
9. Large synchronous boot payload.
11. No "fast" fallback / skip-seen-beats pace.
12. VFX SVG filters are GPU work per effect.

Levers 6 and 7 are done. Legal-target glows are deliberately kept.

**This is now the execution arm of B16, the top demo goal.** Levers 3, 4 and 8 are the standing
suspects for the player reports; 12 is the standing suspect for weak GPUs.

---

### B43. Slowdown in the first moments after a refresh, after the art pass ☆ — 2026-09-22

> Likely the final issue on the matter, I noticed a lot of slowdown the first few moments after
> refreshing, likely loading the new images in. Are we in for more reports of performance issues?

**Measured the same day, in the browser pane, not on player hardware.**

- **The new art is not heavier.** The default outfits hold 100 pictures, 10.4 MB and 139 megapixels,
  against 105, 10.8 MB and 143 megapixels before the art pass. Poses are 1216 tall now, smaller than the
  650x1300 stand-ins they replaced.
- **The boot** loads 121 images, 2.1 MB, most of it card frames and card art, and has one long task of
  212 ms (the scripts starting). Teambuilding and the first fight added no long tasks at all.
- **What costs time is fetching, not drawing.** On a local server a 15 KB portrait took 600 to 1250 ms to
  arrive, because it queued behind the boot's other requests. A player's first visit pays that over the
  network.
- **The likeliest cause of what Noodle saw is a cold cache.** Every character picture changed at once,
  so the first load after the pass downloaded and decoded all of them fresh. Later loads read them from
  the browser's cache. A player's first visit is always cold, and was before the art pass too.
- **The largest pictures are the cut-ins.** Every `1-broken`, `2-broken` and `recover` is 1664 or more
  wide by 2432 tall, 4 to 4.7 megapixels, about four times a pose. They are not loaded at the start; they
  are decoded the first time a cut-in plays, which is a possible stutter at the moment a character breaks.
  Writing them at 1216 tall (they are never drawn taller than the screen) would make each a quarter of
  the size. Offered to Noodle, not done.

**Cut-ins done, same day.** Noodle: *"Yes, please do size the cut-ins to a reasonable amount, 1216 would be
fine."* `png-to-webp.py` now writes `1-broken`, `2-broken` and `recover` 1216 tall (`CUT_IN_NAME`), and all 17
were re-converted: 1.56 MB together, each a quarter of its former pixels. Both cut-ins size themselves as a share
of the screen and the recover windows are percentages of the picture, so nothing moved on screen.

## Unsorted — drop new reports for this workstream here

**Session 47 measurements (annotation on B16 — not a new item)**

> I've heard from playtesters playing on neocities that the game "performs poorly", and that the
> "engine is slow and clunky". Again, this could be an early grave for the game I've worked so hard on.

Measured on Noodle's machine, 1280x720, three-member party against `loneSporeling`. **The pane caps at
30fps (frame cadence 33.4ms median AND max), so no GPU or frame-rate claim below is possible from here.**

| What | Number | Reads as |
|---|---|---|
| Rules engine, one whole end-turn (end + enemy + start) | **< 2ms** total; forecasts 1.5ms | The ENGINE is not slow. Nothing to win here. |
| `repaint()` script only / with its layout | **4.7ms / 13.3ms** | Lever 3, confirmed and sized: most of a 60Hz frame here, so 50-80ms on a phone, once per beat. |
| Combat DOM | 466 nodes, **160 `<img>`**, all rebuilt per repaint | Every repaint re-creates 160 images. Cached locally; over neocities each is a cache lookup and possibly a decode. |
| Standing GPU load at idle | **29 infinite animations**, 23 filtered elements, 19 masks, 12 blend modes, 23 `will-change` | Lever 12's neighbour: invisible here, constant compositing on a weak GPU. `hcPlateChipDrift` alone is 12 animations. |
| Boot payload | **93 scripts, 15.1 MB** (Honeycomb's share: 35 files, 2.9 MB) + 414 KB CSS; DOMContentLoaded 3.7s **on localhost** | Lever 9, and the one that is specific to NEOCITIES. 12 MB of it is Syrup Town, not Honeycomb. |
| First End Turn of a fight | one **137ms** long task; the second End Turn had none | First-use cost (decode/JIT), not the engine. x4-6 on a phone is a visible freeze on the first press. |

**What this says about "slow and clunky on neocities".** Not the rules engine. The candidates, in the
order the numbers point: (1) the boot payload — a player's first impression is a multi-second blank
load that Noodle's localhost never shows; (2) hover loss on every repaint (`ui/` B34, fixed session 47)
— the hand dropping after every card IS "clunky", and every player saw it; (3) whole-screen repaints
per beat on slow layout engines; (4) idle GPU load. (1) needs a Syrup Town decision — **a consult item
under BASICS**, since lazy-loading the story game's scripts changes host code.

Cheapest next measurements: `../tools/audit-turn-time.js` under Chrome's 4x/6x CPU throttle, and a
Network-throttled ("Fast 3G") cold load of the live neocities URL, both of which need a real browser
window rather than the pane.

**Finding, session 53 (2026-09-21): the tree lookup was recomputed on every card resolved.**
`honeycomb.progression.selectedNodeArray` walked the whole progression tree and rescanned the selection
list for every node, each time a card was resolved (it is reached through `honeycomb.memberCardModifierArray`).
It now remembers its answer per character, keyed on the contents of the selection list and the outfit
(`../balance_tests/BRIEF.md` Step 1). On a headless budget-audit run, 27 fights went from 29.2 s to 7.2 s, with a
byte-identical report. That run had no tree nodes bought, so a player with a full tree was hit harder than
that measurement shows. This is a measured speed-up of the rules engine on a desktop CPU. It is **not**
known to be what players reported as slow, and the row above still stands: the rules engine was already
under 2 ms per end-turn in the live game, so this mostly helps simulations.

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
