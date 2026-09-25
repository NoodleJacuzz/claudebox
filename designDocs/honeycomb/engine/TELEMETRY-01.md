# Honeycomb — can card telemetry actually be collected?

Session 22. Noodle's question, verbatim:

> I wanted to know if obtaining telemetry data when the game was hosted on itch.io and neocities was
> possible, manual copy-out does not do that and the scale would be frankly horrible.

He is right that the copy-out report is not an answer. **Nothing is built from this document yet.**
It exists so the endpoint decision can be made once, on facts, rather than discovered halfway through
an implementation.

---

## 1. The short answer

**Yes, collection is possible from both hosts — but never *by* either host.**

neocities and itch.io are both **static file hosts**. Neither runs server-side code, neither has a
database, and neither will accept a `POST` from your game and keep the body. There is no configuration
that changes this; it is what "static hosting" means. So:

- You cannot collect telemetry *on* neocities or itch.
- You **can** send it *from* a page hosted there to an endpoint somewhere else, because the game is
  ordinary JavaScript in an ordinary browser and outbound requests are not blocked on either host.
  itch's HTML5 sandbox in particular does not block them — third-party analytics in itch games is
  common.

So the whole question is **which third-party endpoint**, and that is the decision below.

---

## 2. What the game would send

Volume is the thing to get right first, because it decides cost and it decides whether anything is
free.

The current ledger (`honeycomb.telemetry`) counts, per card: offered / taken / skipped / added to
deck. Sending one request **per card event** would be thousands of requests per player per run —
that is the "frankly horrible" scale, and it is also what would push any free tier over.

**Send one request at the END of a run instead.** The ledger already accumulates in `localStorage`;
a run ending is the natural flush point. One beacon carries the whole run:

```
runs/day        ~1 request per completed run per player
payload         a few KB: seed, party, outcome, floor reached, and the per-card counts
```

At 200 players finishing 3 runs a day that is **600 requests a day**, which sits inside the free tier
of every option in part 3 with room to spare. Per-card events would be roughly 1000× that.

Two details worth deciding with the endpoint:

- **Abandoned runs.** A player who closes the tab mid-run sends nothing. `navigator.sendBeacon` on
  `visibilitychange` covers most of it if that data matters; if it does not, ignore it.
- **Retry.** If the request fails (offline, blocked, endpoint down), keep the payload in
  `localStorage` and send it with the next one. Otherwise slow connections silently under-report.

---

## 3. The endpoint options

| | Free tier | Effort | Owns your data | Notes |
|---|---|---|---|---|
| **Google Apps Script → Sheet** | unlimited-ish for this volume | lowest | Google | A script URL that accepts a POST and appends a row. No account for players, no billing, no server. Rows land in a spreadsheet you already know how to read. |
| **Cloudflare Worker** | 100k requests/day | low | you | A ~20-line worker writing to Workers KV or D1. Needs a Cloudflare account and a little SQL to read back. The most headroom of the three. |
| **Self-hosted Umami / GoatCounter** | n/a (you host it) | highest | you | A real analytics product with a UI. Needs a host you pay for and maintain. Overkill unless you want dashboards. |

**Not recommended: Google Analytics / GA4.** Two reasons, both real:
1. Its terms restrict adult content, and this is an adult game. An account termination would take the
   data with it.
2. It is event-shaped, not row-shaped. Getting "which cards were skipped" back out of GA4 is far more
   work than reading a spreadsheet.

**Recommendation: the Apps Script → Sheet route**, unless you already have a Cloudflare account, in
which case the Worker is barely more work and has more headroom.

---

## 4. What it costs the game

Small, but not nothing, and two of these are constraints the project has already written down.

- **Offline must still work.** BASICS requires the game to run from a local `index.html`. A telemetry
  request from `file://` will simply fail; the send has to be fire-and-forget and swallow its own
  errors, exactly as `platform.playFile` already does for audio.
- **No `fetch` is the house rule for ASSETS**, and it stays. A beacon is not an asset. Either
  `navigator.sendBeacon` or an `<img>` pixel satisfies even the strictest reading, and both fail
  silently offline.
- **It is a host dependency, so it belongs in `honeycomb.platform`** (BASICS: "a host dependency
  anywhere else is a leak"). One more adapter function, `platform.report(payload)`, `typeof`-guarded
  like the rest, no-op when no endpoint is configured.
- **Players should be able to say no.** An options toggle, defaulting on or off is your call, but the
  toggle should exist and should be honoured before the payload is even built.
- **The endpoint URL is a tuning value**, blank by default. A blank URL means the beacon is built and
  thrown away, so a build that ships before you have an endpoint behaves exactly like today's.

---

## 5. What is in the game right now

`honeycomb.telemetry` (in `honeycomb-state.js`) and the Debug Tools card report. It is a local ledger
in its own `localStorage` namespace with a TSV copy-out, and it is **not** a collection mechanism —
it only tells you what *your own* machine did. It is worth keeping as the debug tool it actually is,
and worth not describing as telemetry.

Test `[78]` covers it.

---

## 6. The decision needed

Pick an endpoint from part 3 (or say "none, drop it"). Once there is a URL, the work is:

1. `platform.report(payload)` in the adapter, plus `tuning.telemetry.endpointUrl` (blank default).
2. Flush on run end, with the `localStorage` retry queue.
3. An options toggle.
4. A test that a blank endpoint sends nothing and that a failed send does not throw.

Roughly one short session, and none of it is worth starting before the endpoint is chosen.
