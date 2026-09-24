# Honeycomb — Feedback round 09 (closed, ARCHIVED WHOLE)

**Closed session 41 — the last numbered round.** Feedback is now kept per workstream: each folder has
its own `FEEDBACK.md`, and the root `../FEEDBACK.md` is an index plus an inbox.

Every open item in this file was moved into a workstream file **byte for byte**; nothing was
summarised on the way. This copy exists so the round can be read whole, and so the demo-gate mapping
and status board below survive as a record of how the work looked in session 41.

Where its items went: `../rework/cards/` (11) · `../rework/starters/` (4) · `../performance/` (3) ·
`../ui/` (4) · `../art_pipeline/` (4) · `../map/` (3) · `../card_redesign/` (3) · `../chessmaster/` (2) ·
`../rework/progression/` (2) · `../audio/` (2) · `../rework/enemies/` (1) · `../vfx/` (1) ·
`../lust_events/` (1) · `../mobile/` (1) · B20 stayed cross-cutting in `../FEEDBACK.md`.

---

The live round, opened session 38. It holds **every open item from rounds 07 and 08 and nothing else**.
Both of those rounds are closed: their full text, quotes and annotations are in
`Archive/FEEDBACK-07.md` and `Archive/FEEDBACK-08.md` (with `Archive/FEEDBACK-07-DONE.md` for round
07's finished work). Nothing here was summarised away from them — an item that is not in this file is
an item that is finished.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a quote
disagree, the quote wins. (Session 39's quotes arrived by phone and have spelling normalised at his
instruction — "clear up typos" — with wording otherwise untouched.)

**Keep this file current task by task** (`BASICS.md`, "Documentation rules"): annotate an item the
moment it lands, so a session stopped midway can be picked up from this file alone. Move finished items
to `Archive/FEEDBACK-09-DONE.md` at the end of a session.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done

**Section F at the bottom is the inbox** — drop new reports there and the next session sorts them.

**Suite: 1681 passed, 0 failed** (session 41 — unchanged; that session moved documents, not code). `node "!designDocs/honeycomb/tools/test-honeycomb.js"`. Content warnings: 1
active (Anastasia, deliberate — she is `inDevelopment`).

> **Session 39 was a phone session — no shell, no suite.** It could read files but could not run
> anything. Its claims about the engine come either from Noodle or from reading a design doc
> (`reference/TELEMETRY-01.md`, `chessmaster/STATUS.md`) — never from running code or the suite. Items marked
> **VERIFY** need a PC session to confirm against the code before work starts.

---

## The demo gate (settled session 38, amended session 39)

Noodle named the beta demo's ten goals; they are quoted in full in `BASICS.md`, "The demo scope",
which is the authority. **That list is the gate and this file is the queue** — an item here that does
not serve one of the goals does not block the demo, however loud it is.

Session 39 amended the gate in three ways: **performance is now the top goal**, **lust events are
added**, and **telemetry is promoted** from "can wait however long it likes" to a candidate goal.
`BASICS.md` "The demo scope" carries the same amendments.

| Demo goal | His state | Where it lives here |
|---|---|---|
| **Performance** | **top priority (session 39)** | **B16** — the diagnostic question. A8 is its instrument, A12 its device test, B14 its lever list |
| Sprite pass | ongoing | B2 (13 of 36 enemies still `artOwed`) — scope cut hard by B21 |
| Card pool rework | ongoing | B1 unlock routes, B5 cross-party hooks, A9 (paused by him), B18 Clemence, **B26 the neutral pool missed the overhaul** |
| Card frame redesign | **rules settled session 39** | A2 and A3 both answered (**A3 reverses C1** — C1 acted on a misread instruction), plus B27 the small-size ribbon |
| Enemy rework | needs testing | Content landed session 34 and measures inside budget (`tools/enemy-template.js`); the testing he means is play, not the suite |
| Progression rework | finished? | **Yes** — 256/256 nodes wired, `tools/audit-trees.js` green. B4 remains, and B23 reprices its deck-customization nodes |
| Anastasia | ongoing, in debt | A4 — **two of her three decisions were answered session 39** (codename `chess`, `chess1V` is default, **pawns come from cards**: a mechanical restart). `chessmaster/STATUS.md` is the authority. The "Locked" roster tile was real and is fixed (session 40) |
| VFX | ongoing | B13 — and B21 leans on it: tilt + redden in-engine, vfx does the rest |
| Looping music | unstarted | B12 |
| **Lust events** | **new goal (session 39)** | **B17** — cut the tag count so 2–3 tags per character can be authored at all ranks |
| Act 1-1 and Act 1-2 | **live — confirmed in play session 39** | **B15 — the session-38 reading was wrong.** Both acts run; they are just not named as acts in the code. Missing: branching, tooltips, the title |
| Mobile portrait | closer than expected | A12 — blocked in practice by how hard the game is to test on a phone (see also B29) |
| Telemetry | **"might be a demo goal"** | A8 — **neocities works, and no third-party servers are involved.** Still needs an endpoint picked |

Only the **Battle Lab (A10)** is still demoted, and session 39 turned it from "wants your pass" into a
bug list.

---

## The top priority (session 39)

> High priority, most important demo goal is better performance. Why are players saying the game runs
> poorly? Are they experiencing different things than on my machine?

This is **B16**, and it is a question no session can answer from this machine — which is the point of
the question. Three existing items are its instruments and should be read as serving it:

- **A8 telemetry** stops being a nice-to-have. The question is literally "what are players
  experiencing that I am not", and telemetry is the only thing in the file that answers it at scale.
  This is the strongest argument yet for picking an endpoint.
- **A12** is the one device test he can run himself, and his answer says the reason it has not happened
  is that testing on a phone is painful, not that he forgot.
- **B14** is the lever list — what to fix *once* the cause is known. Levers 3, 4 and 8 (whole-screen
  `innerHTML` repaints every beat, forced synchronous reflows, many small DOM writes per beat) are the
  ones that degrade worst on weak hardware, so they are the standing suspects.

---

## Status board

### ⏸ Yours to decide — nothing moves until you answer

| # | Item | § |
|---|---|---|
| 1 | Telemetry: pick an endpoint. **The neocities worry is answered — it works. The choice is what is left.** Serves the top demo goal | A8 |
| 2 | Broken **common** cards — his lean is "somewhere in the middle", a direction rather than a rule yet | A1 |
| 3 | Anastasia: **two of three answered session 39** (folder `chess`, `chess1V` default, pawns via cards). Only **`promoteEntity` vs cutting Promote** is still open, and it should be re-asked *after* her card pool is redesigned | A4 |

### ☐ / ◐ Work that needs no decision

| | Item | § |
|---|---|---|
| ☐ | **Performance: why it runs poorly for players — top demo goal** | B16 |
| ☐ | Unlock routes: **every alt outfit is open from the start**, so all 21 commons and 11 rares drop from turn one | B1 |
| ◐ | Card art: **148 cards and 13 enemies** are `artOwed` | B2 |
| ◐ | Card art prompts: Brienne is hand-authored, the other five and neutral are still the table-derived pass | B3 |
| ☐ | Distribute unlockables through the game — the seam exists, the authored nodes do not | B4 |
| ☐ | **Act 1-1 branching, act 1-2 titling** — not the engine; the engine is live | B15 |
| ◐ | Cross-party hooks: Nettle and Severine have **2** draftable cards that touch an ally, Clemence has 17 | B5 |
| ◐ | "The hand does not feel good" — the cap and the bounce are done; the feel/legibility pass is not | B6 |
| ◐ | Card prose that still names a passive only one card uses | B7 |
| ☐ | Broken character art per outfit (waits on outfit art) | B8 |
| ☐ | Sound: the library has **no short movement stem**; five Cinder cards stand in with `miscCreak` | B9 |
| ☐ | Sound: four files are too quiet at source — `lewdSquish`, `lewdSlap`, `!outfitChange`, `lewdSwallowing` | B10 |
| ☐ | Sound: enemy and descent sfx are still unassigned | B11 |
| ☐ | Music: map / battle / elite / boss OSTs, and how to loop one without replaying the whole song | B12 |
| ☐ | VFX: generate and assign to cards | B13 |
| ◐ | Performance: levers 3, 4, 5, 8, 9, 11, 12 from the session-12 cause list | B14 |
| ☐ | **Lust events** — cut the tag count, then author all ranks of what survives | B17 |
| ☐ | **Clemence's redesign** — soothing goes rare-only, healing goes off-rate and becomes enormous | B18 |
| ☐ | Character order: two trios, fixed | B19 |
| ☐ | `BASICS.md` needs a protected-names section (Moss, Vex, Wick, `skull`) | B20 |
| ☐ | Enemy art scope: two poses for common enemies, not a sprite sheet | B21 |
| ☐ | Relic rework: `crimsonFang`, `votiveCandle`, `boneNecklace` marked for replacement; starting relics cut | B22 |
| ☐ | Early deck-customization nodes repriced — removals expensive, additions cheap | B23 |
| ☐ | Curses and deck bloat: a boss, an elite, and permanent gloom wisp curses | B24 |
| ☐ | Shop removal: once per shop, price scales fast | B25 |
| ☐ | **Neutral cards missed the overhaul** — `Shared Resolve` well below rate | B26 |
| ☐ | Hide the card ribbon at small size (the bench already does) | B27 |
| ☐ | Map generation: too many chests, not enough encounters | B28 |
| ☐ | Debug menu win button is too many steps — blocks his own testing | B29 |
| ☐ | Camp image should resolve from party composition | B30 |
| ☐ | Sporelings should be fightable in bulk; the game needs more AoE checks | B31 |
| ☐ | Enemy titles need a better shadow — small and hard to read | B32 |
| ☐ | Boss and elite encounters should drop rares at a higher rate | B33 |

---

## A. Waiting on you

### A1. The broken-card design intent — ANSWERED (session 39), commons still open ⏸

> Were the broken cards balanced around the designs I intended? [...] starter cards are mostly negative
> when broken and had bad effects when left unplayed in the hand like curses, and rares were the most
> beneficial to escaping the broken state.

**A second person asked the same thing** in the emailed feedback — *"I remember you saying when broken
starter cards would do negative effects if left unplayed, what happened to that?"*

His answer, session 39:

> Design philosophy: All Broken cards represent the character trying to claw their way out of the
> mindbroken state, or represent them sliding deeper into it. Broken Starter cards are neutral or
> negative, a newbie adventurer dragging down her allies by giving into lust. The go-to design would be
> a 1-cost very low rate effect with an additional 'if unplayed' effect that hurts the party. Broken
> Rare cards make a positive effort to recover, an experienced adventurer who prepared beforehand for
> her snap. They are what make a genuine effort to recover, and a deck with a high ratio of rares stands
> the best chance at recovery. Commons are a distinct design gap I have no consistent answer for.

So the shape is confirmed and it is **stronger than the rule session 38 proposed**: not just a rarity
gradient but a fiction that generates the numbers. Every broken card is either clawing out or sliding
deeper, and rarity says which.

What this unblocks:

- **The `if unplayed` hook is engine work and does not exist yet.** An end-of-turn penalty that fires
  per broken starter still in hand is a new hook, not a card effect. Build it before rebalancing, and
  put it under tuning — the penalty rate is a number, so it belongs in `honeycomb-tuning.js`.
- **Broken starters** get the template: 1 cost, very low rate, plus the unplayed penalty.
- **Broken rares** get the recovery budget. "A deck with a high ratio of rares stands the best chance at
  recovery" is a testable claim — it is exactly what `tools/draft-sim/draft-simulation.js` could measure once A9 is
  un-paused.
- **Broken commons: his lean, session 39.**

  > Broken commons should probably be somewhere in the middle? It's tricky, and a matter of balance.

  A direction, not a rule. "The middle" between a punished starter and a rewarding rare is a *rate*
  question he is explicitly leaving to balance, so commons should be built last — after the starter
  template and the rare budget are both in and measurable — rather than designed up front. The one
  thing his answer does settle: commons get **no unplayed penalty** (that is the starter's marker) and
  **no reliable escape** (that is the rare's payoff). What is left in the middle is a plain card.

Note that **Clemence inverts all of this** — see B18. Her broken state is an ascension she wants, so
"clawing out" is not what her broken cards are for.

### A2. The gold trim on broken cards — ANSWERED (session 39) ☐

> Broken cards are too similar to regular cards. Maybe hue-shift the gold trim? Not the border, but the
> actual gold frame?

> Good point, I forgot the bench needed to be updated to use live cards as a base. But the frame recolor
> should be simple enough that we can apply it to both without a big hassle.

**Apply the hue-shift to both** the current frames and `card_redesign/`, and **update the bench to use
live cards as its base** while in there — that is the thing that made this look like a conflict in the
first place. `card_redesign/STATUS.md` being mid-rebuild is no longer a reason to wait.

He also drew a terminology line worth keeping in the vocabulary of this file:

> Random aside, but to avoid confusion, I'm specifically talking about changing the gold trim, not the
> border, because "card frame" can mean multiple things based on context, though darkening the card's
> border as well for broken cards would be an easy and distinct idea 🤔

**Gold trim ≠ border.** The hue-shift is the gold trim. Darkening the *border* for broken cards is a
separate, additional idea he floated as easy — treat it as a second lever to show him, not as part of
the same change.

### A3. Starter, common and rare — ANSWERED (session 39), and it REVERSES C1 ☐

> Common and starter cards look identical.

> Starter cards should be the only one without a gem. For now, the demarcation is Starter (horizontal,
> no gem), Common (horizontal, gem), Rare (vertical, I think I'd like the gem removed). And broken
> versions would have the rose effect (still not totally satisfied on that, but it's not a huge
> priority) and shifted frames.

**Read this before touching the gem: C1 acted on a misread instruction.** Confirmed by him, session 39:

> Yes A3 reverses C1, I never meant to remove the gem from common, only starter at the time.

So C1 was not a decision he changed his mind about — it removed the gem from the wrong rarity. The
correct reading of the round-07 note was **starter only**. Session 39 sets:

| Rarity | Orientation | Gem |
|---|---|---|
| Starter | horizontal | **no** |
| Common | horizontal | **yes** |
| Rare | vertical | **no** |
| Broken | shifted frames | rose effect |

The logic is consistent even though the instruction inverted: **rare no longer needs the gem because
orientation already marks it.** Starter and common are the two that share a shape, so the gem is spent
where it does work. C1's reasoning — "a rarity that says nothing draws nothing" — still holds; the
rarity it says something about changed.

Mechanically this is cheap: `honeycomb.cardRarityArray` already carries `showRarityGem` per rarity and
`honeycomb.cardShowsRarityGem(card)` is what the renderer asks, so this is flipping two flags. **The
suite will fight you** — C1's tests in block `[104]` assert `common:0 … rare:1`. Those assertions are
now wrong and must be rewritten to `starter:0 common:1 rare:0`, not deleted.

Also noted: he is **not fully satisfied with the rose effect** on broken cards, but explicitly ranks it
low priority. Do not open it unasked.

### A4. Anastasia — DEFERRED to her own session (session 39) ⏸

> I don't know what the A4 decisions are, Anastasia needs a new session for sure.

**Do not chase these in a general session.** They are listed here only so the next Anastasia session
does not have to go find them.

**Two of the three were ANSWERED in session 39 and this file did not say so until session 41.**
Noodle's answers went into `chessmaster/STATUS.md` and nothing carried them back here, so a reader of
this file would have chased decisions he had already made — the exact failure the session-41
documentation pass exists to stop. **`chessmaster/STATUS.md` is the authority for this workstream; this
entry is a pointer to it.**

> Her character codename is `chess`, the chess1V is her default outfit, and thinking about it more, no,
> summoning pawns should be done through cards, not the ability, and not passives. We'll need to close
> to start over mechanically.

1. **Anastasia's character folder, and which outfit `chess1V` is — ANSWERED.** ☑ Folder `chess`;
   `chess1V` is her **default** outfit. Her 9-file art set is unblocked and `chess1V-*` can be sorted.
2. **Whether A1 is the right home for the pawn engine — ANSWERED, by removing both options.** ☑
   **Pawns are summoned through cards**, not the ability and not passives. This retires
   `chessmaster/FEEDBACK-01.md` §B rather than resolving it. Expect to rebuild her mechanically: her
   ability slots, her card pool and the summon plumbing were all designed around a non-card summoner.
3. **`promoteEntity`, or cut Promote — STILL OPEN.** ⏸ His reaction was *"Only one promote? Seems like
   a waste."* That reads as an objection to Promote having one user, not as "cut it" — and the
   card-based pawn rebuild is exactly what could give it more. **Do not cut Promote on the old
   one-card count.** Re-count after her card pool is redesigned, then ask again.

(`chessmaster/STATUS.md` also flags a **pool size correction** — the brief's 15–20 per archetype was
retired for the session-33 standard of 21 C / 11 R. That is a notification that a written requirement
changed, not a fourth decision.)

What he did say in session 39 is a bug report about her visibility:

> I could have sworn that when I last tested Anastasia I saw a "Locked" section on the roster.

**VERIFIED AND FIXED (session 40). He was right and the docs were wrong.** ☑ The filter had a hole,
and it was in the half nobody had looked at: the TEAMBUILDING roster, not the title screen.

`honeycomb.teambuilding.buildRosterColumn` draws one locked `??? / Not yet found` tile per character it
has not shown, and it counted them as `honeycomb.characterArray.length - shownCount` — the UNFILTERED
table. With all six shipped characters unlocked that is `7 - 6`, so the roster ended on exactly one
phantom tile advertising a seventh character. The title screen and the compendium filtered
`inDevelopment` correctly, which is why the property looked held: two of the three screens did hold it.

The fix is a single gate rather than a third inline filter, because three call sites with the same
expression is what let one of them drift: **`honeycomb.shippedCharacterArray()`**, in
`honeycomb-content-characters.js` (a file the suite loads — a helper in a UI file would be invisible to
it). The teambuilding column and the compendium both ask it now, and the locked count comes off its
length. The roster column no longer references `characterArray` at all.

Measured in the browser, not asserted — locked tiles rendered, by unlocked count: 1→5, 2→4, 4→2, 6→**0**.
`shown + locked` is 6 at every step, so the "roster grows" behaviour the locked slots exist for is
intact. A deliberately tainted save whose `unlockedCharacterArray` contained all seven still rendered
six entries and zero mentions of Anastasia. Tests in block **[105]**, including a falsification pass:
re-introducing the old formula turns the block red.

Note for the Anastasia session: this changes nothing about decisions 1–3 above, which are still
deferred and still not for guessing.

### A5. Free per-fight healing against the campfire — ANSWERED (session 39) ☐ → B22

> The most overpowered Spire relics are included in base kits (healing after battle…) which makes
> resting at campfire useless.

> Mark crimson fang, votive candle, and bone necklace as relics to replace in the relic rework.

Confirmed, and widened: **`boneNecklace` joins the list**, which session 38 had not flagged. These three
are marked for replacement rather than tuning — see **B22**, which also carries his much larger call
that starting relics should not exist at all.

### A6. Whetted Edge — ANSWERED (session 39) ☐

0 energy, exhausts, upgrades a card in hand permanently.

> Whetted edge, maybe shift up to rare? The flavor is boring and the name is bad right now.

Three changes, one tentative: **move it to rare** (his "maybe" — treat as a decision he will confirm on
sight, not as an open question), and **rename and reflavor it**. The rarity move is the balance answer
session 38 asked for; the name and flavor are a separate authoring pass.

Note this interacts with **A3**: moving a card to rare now changes its *orientation*, not just its gem.
A rare is vertical. Do A3 first or the reflavor gets redone.

### A7. Absolution — ANSWERED (session 39), with one unclear aside ⏸

Your rule from the card-pool pass: **Clemence never reduces an ally's Lust** — cards, broken forms and
powers. `clemenceAbsolve` (her A1) is `{ soothe 5 → otherAllies, heal 5 → allAllies, lust → Clemence }`.

> Should be fine since it's once per rest, and lost when broken.

**Absolution is the deliberate exception**, and the reasoning holds against B18: the risk Clemence is
supposed to carry lives in her *broken* state, and Absolution is gone by then. Once per rest bounds it
further. No rewrite.

#### The rest-site rule, clarified (session 39) — wider than A7

> I must have forgotten to clarify it in the outfit overhaul doc. Yes, Clement's A1 should be once per
> rest. Also, to double clarify, visiting a rest site at all should refresh abilities. That could be
> made more clear somewhere.

Two rules, and the second is a **general mechanic that is not written down anywhere**:

1. Clemence's A1 is **once per rest**. Confirmed.
2. **Visiting a rest site at all refreshes abilities** — for everyone, not just Clemence. Not "sleeping
   at one", not "choosing an option": arriving is the refresh.

Rule 2 is the one to be careful with, because it changes what a rest node is worth. The campfire is
already the most contested node in the run (A5 — removal, upgrades, and healing all compete there);
if arrival alone refreshes abilities, that is a fourth reason to take it, and it is a reason that costs
the player nothing. **VERIFY what the engine does today**, then write the rule into the mechanics
reference rather than leaving it in a feedback round — this is exactly the kind of rule that gets
re-litigated every few sessions because it lives nowhere.

#### "One with Nothing" — PLACED (session 39)

> "One with Nothing" is Clement's A2. Again, an MTG reference, since her A2 just drops her health.

> I wonder if One with Nothing would be better as a card though, it's an MTG reference (a rare card with
> a confusingly pure negative effect, which players will be hungry to build around. Can't be an Ecstatic
> card though, since its broken form should be a good broken escape tool).

So: **Clemence's A2 is already named One with Nothing, and it drops her health.** The open idea is
whether it should stop being an ability and become **a card** instead — a rare with a confusingly pure
negative effect that players are hungry to build around, which is what the MTG card is famous for.

Two constraints on the idea if it is built:

- **It must not be Ecstatic**, because an Ecstatic card's broken form needs to be a good escape tool,
  and a pure-negative card's broken form should not be.
- It reads directly onto **B18**: a card that drops her health is a sacrifice card, and B18's design
  target is that every point of lust she gains should feel like a sacrifice. Moving it into the pool
  gives her the sacrifice theme a home a fixed ability cannot.

Not a decision yet — he raised it as a wondering. It belongs in the B18 pass, not before it.

### A8. Telemetry — PROMOTED, endpoint still unpicked ⏸

> I wanted to know if obtaining telemetry data when the game was hosted on itch.io and neocities was
> possible, manual copy-out does not do that and the scale would be frankly horrible.

> Might be a demo goal. It would turn thousands of lurker players into real datapoints.

> A8 I don't actually know what the solutions you picked were, but you mentioned them not working on
> neocities? If they don't work on neocities (and only neocities, I don't want to bump heads with
> mopoga devs thinking I'm stealing from their servers), it's not an option. I'm not getting data from
> a locally played copy meant to be played offline.

**Correction — it does work on neocities.** `reference/TELEMETRY-01.md` part 1 says collection is possible *from*
both hosts but never *by* either host: neocities and itch are static file hosts, so neither can receive
and keep a POST. The game is ordinary JavaScript in an ordinary browser, and outbound requests are not
blocked on either host. So the beacon goes **player's browser → an endpoint you own**. Neocities is
untouched by it.

Which also answers the mopoga worry, and better than he expects: **nobody else's servers are involved
at any point.** The endpoint is a URL you control — a Google Apps Script under your own account, or a
Cloudflare Worker under your own account. Neocities does not store it, does not forward it, and does
not pay for it.

His two constraints, and where they already sit:

- **Only the neocities build should report.** Not covered by `reference/TELEMETRY-01.md` — **add it**. The
  endpoint URL is already a blank-by-default tuning value, so the clean shape is an explicit host
  allowlist checked before the payload is built: report only when `location.hostname` matches the
  neocities domain, silently no-op everywhere else. That keeps mopoga and any other mirror out by
  construction rather than by hoping the build is right.
- **No data from offline local copies.** Already true by design, part 4: BASICS requires the game to run
  from a local `index.html`, a beacon from `file://` simply fails, and the send is fire-and-forget and
  swallows its own errors. The host allowlist above makes it explicit rather than incidental.

**The two options, plainly** (`reference/TELEMETRY-01.md` part 3):

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

Answered in `reference/TELEMETRY-01.md`: yes from both hosts, but never *by* either host — both are static file
hosts, so it needs a third-party endpoint. One beacon per run end is ~600 requests/day at 200 players ×
3 runs, inside every free tier considered. GA4 is out on its adult-content terms. Recommendation: a
Google Apps Script writing rows to a Sheet, or a Cloudflare Worker if you already have an account.
**Pick one** and the build is a short session (TELEMETRY-01 part 6).

If it is built for B16 rather than for design metrics, the payload changes: frame cadence, device class,
and the `missed`/`dropped` counters matter more than run outcomes. Worth deciding the purpose at the
same time as the endpoint.

### A9. The draft simulation's cut list — DEFERRED (session 39) ⏸

> I say we wait for now.

**Parked by his decision.** `rework/cards/DRAFT-SIM-01.md` part 3's Tier A/B list stays unacted, and the re-run stays
unscheduled. The staleness finding stands and is why: 6 of its 20 named cards no longer exist, and every
number predates the session-33 pool replacement. Nothing should be cut on the old report's say-so.

Worth remembering that A1 gave the simulation a new job whenever it is un-paused — *"a deck with a high
ratio of rares stands the best chance at recovery"* is a claim `tools/draft-sim/draft-simulation.js` can measure.

Attached to the same answer, a separate question about poison:

> One note on poison specifically, I wanted it to do visual damage tics and cut in half each turn, does
> it do that yet? I want it to be all "pow-pow-pow-pow" and feel strong, since it's Nettle's whole
> thing.

**VERIFY, and answer him.** Two distinct properties to check in the code: (1) does poison halve each
turn, and (2) does it render as repeated individual damage tics rather than one lump. The second is
presentation and is the part he cares about — "pow-pow-pow-pow" is a feel request, and a correct number
delivered as one floating number fails it. This also touches **B14 lever 8** (many small DOM writes per
beat), so the feel fix and the performance goal pull in opposite directions here; whatever tic renderer
answers this should be built as a compositor animation rather than per-tic DOM writes.

### A10. The Battle Lab — ANSWERED (session 39): it is buggy, not just unreviewed ☐

> Last I checked battle lab was still wildly buggy with no tooltips over the card selection, multiple
> buttons couldn't actually be clicked, very weird behavior when summoning bosses to player side.

Three concrete defects, so this is no longer "it wants your pass":

1. No tooltips over the card selection.
2. Multiple buttons cannot be clicked.
3. Summoning bosses to the player side behaves very strangely.

Still **demoted** — the Battle Lab serves no demo goal, so this is a bug list to fix when it is cheap,
not demo work. `Archive/FEEDBACK-07.md` §A2 has the shape, how it is driven, and the traps to read
before changing it.

### A11. Two reports that will not reproduce here — LEAD GIVEN (session 39) ☐

Enemies vanishing after they attack; characters resizing on the ability menu. Both from
`chessmaster/FEEDBACK-01.md` §A, both chased headlessly in session 37 and neither reproducible.

> That's likely a bug that came up in the Anastasia work. At the tail end of it I told claude to wrap it
> up because there were too many bugs in the engine, and they said "actually that's my fault, let me
> make the hand-off then clean up".

**This changes the search from "reproduce it" to "read the diff".** The lead is that the bug was
introduced by the Anastasia session's engine changes, and that the session admitted as much and
proposed a cleanup pass at hand-off time. Two things follow:

- Find what that session changed in the shared combat and ability-menu render paths, and whether the
  cleanup it proposed actually happened or was dropped at the hand-off.
- Session 37 checked the *current* code and found both suspects already off and the inline
  `art.style.transform` write gone. That is consistent with a regression living somewhere it did not
  look — the Anastasia-era changes — rather than with the bug not existing.

A live look from you still closes it faster than any amount of headless driving.

### A12. Phone re-test — BLOCKED ON ERGONOMICS (session 39) ⏸→☐

> Phone testing really needs to be Easier. Buttons are small (intentional, mobile size adjustments
> happen after all ui is done).

Not a refusal — a real blocker. He is not going to run the re-test the top demo goal needs while the
build is painful to drive on a phone, and the small buttons are a deliberate sequencing choice
(mobile sizing comes after the UI is finished), so they will not be fixed on the way.

The way through is **a test path that does not need the real UI to be finger-sized**: a debug overlay
with large hit targets, a URL parameter that boots straight into a fight, or the `cadence` monitor
readable without navigating menus. That is a small build and it unblocks both A12 and the top demo
goal, so it is worth doing before the re-test rather than asking him again.

Standing notes for whenever it happens: the idle cost found was the nameplate lightning timer (now a
compositor animation); reduced effects also lost the fighter art's blurs; the reticle wobble is fixed.
The monitor prints `cadence`: **~33ms (~30Hz) means a battery saver is capping the page**, not the game
— trust `missed` over `dropped`. The loading screen is deleted; do not look for it.

---

## B. Work that needs no decision

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

### B17. Lust events and the lust-tag cut ☐ — NEW DEMO GOAL

> Add to the demo's scope we need at least a few actual lust events, to reduce the number of lust tags
> such that we can get lust events done for all ranks of the 2-3 tags we keep for every character.

Two pieces, in order:

1. **Cut the tag count.** Keep 2–3 lust tags per character. The current count is the reason no tag has
   complete coverage.
2. **Author all ranks** of what survives, for every character. The point of the cut is that full
   coverage becomes reachable — a partially-authored tag reads as broken content in a demo.

The arithmetic is why this is a scope decision and not a content chore: 6 characters × 3 tags × every
rank is already a large authoring pass, and it only shrinks by cutting tags.

### B18. Clemence's redesign ☐

The longest answer session 39 gave, and it reframes her whole kit.

> Clemence is simultaneously an exception and not. Her Broken state is flavored as what she views as
> divine ascension. She flips from "Pure support, nullifies a major struggle of the game (hp
> management)" to "Pure offense (through lust), introduces a serious risk to the player due to growing
> risk of game over caused by runaway lust." The character wants to be broken, though she can deny it
> (devotee) the temptation to fall off the deep end is still there. This is why her being able to soothe
> lust is problematic, it removes the actual risk factor involved with her. And why I felt there were
> too many lust-spending cards in her pool. It should be a rare-only effect, because a player diving
> straight into breaking her at run start without preparing first should be punished. It has upsides,
> suddenly all her starter and common cards are pumping out rare numbers. Slay the Spire makes every
> point of HP lost hurt, Clemence should make every point of lust gained feel like a sacrifice. She
> probably needs another round of tuning, her healing spells should not be "on rate", they should be
> incredible. Like a "restore target to full hp" for 2 mana.

Four separable changes:

1. **Soothing becomes rare-only.** Not removed — gated behind rarity, so a player who breaks her early
   without preparing has no outlet. This is the risk that makes her interesting.
2. **Lust-spending cards get cut back** in her pool for the same reason.
3. **Her healing goes off-rate and becomes enormous.** "Restore target to full HP for 2 mana" is the
   register he named. Right now her healing is balanced on rate, which is exactly what makes her flat.
4. **Every point of lust should feel like a sacrifice** — the design target, and the test for every
   card in her pool.

Two things to hold while doing it:

- **This does not contradict A7.** Absolution survives as the exception because it is once per rest and
  gone when broken — the risk he is protecting lives in the broken state.
- **Clemence inverts A1.** A1's philosophy is that broken cards claw out of the mindbroken state or sink
  deeper. Clemence *wants* to be broken; her broken state is ascension. So "clawing out" is not what her
  broken cards do, and A1's starter/rare gradient needs a Clemence-shaped exception written down before
  her broken forms are balanced against it.
- **B5 interacts.** She has 17 cross-party cards against Nettle's 2 and Severine's 2, and she is where
  every simulated drafter went. Cutting her lust-spending and gating her soothing is also the most
  direct fix available to B5's eight-to-one spread.

### B19. Character order ☐

> Character order. The order should -always- be two groups of three. The "simple" starter trio as the
> first three characters in the roster, Brienne (first char, basically the mc and game's face), Nettle,
> and Severine. Then the "complex" trio, Cassadora (always 4th, because her mechanics show players
> instantly this isn't just a slay the spire clone), Cinder, and Clemence. I do find it a little
> troublesome that the simple characters are so simple, but only more testing can answer what we need.

Fixed order, everywhere a roster is rendered:

| 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|
| Brienne | Nettle | Severine | Cassadora | Cinder | Clemence |

The two constraints that carry reasons and must not be quietly reordered: **Brienne is first** as the
game's face, and **Cassadora is always fourth** because she is the first character who demonstrates the
game is not a Slay the Spire clone. Position 4 is doing pedagogical work — it is the first pick after
the simple trio.

This should be a single ordered source the roster, teambuilding and compendium all read, not three
hand-ordered lists. **VERIFY** whether one already exists.

His open worry — the simple characters being too simple — is deliberately left unanswered: *"only more
testing can answer what we need."* Do not act on it.

### B20. Protected names: project-wide renames ☐

> BASICS.md needs a section for protected data from project-wide renames. Specifically, Nettle was
> formerly named Moss, Severine was formerly named Vex, Cassadora was formerly named Wick, and
> Cassadora's former codename was `skull`.

| Current | Former |
|---|---|
| Nettle | Moss |
| Severine | Vex |
| Cassadora | Wick |
| Cassadora (codename) | `skull` |

The hazard is a find-and-replace that "helpfully" finishes a rename and breaks identifiers, save data
or art paths. Session 38 recorded (C2) that nothing in the code carries "moss" any more — but
**`skull` is a codename, which is exactly the kind of thing that is still live in the code**, so it is
the one to check first. **VERIFY** what `skull` still refers to before anyone treats it as dead.

Goes in `BASICS.md` as its own section, since BASICS is what a new session reads.

### B21. Enemy art scope ☐

> Notes for art passes: Enemies have waaaay too many images. They should have a combat standing pose
> and an attacking pose, that's it for common enemies. More complex ones can have broken sprites and
> other attack poses optionally as needed. Tilting their sprite and making it redder (in-engine!) will
> be enough since vfx will do the rest of the work.

**This cuts the sprite pass, a demo goal, by a large factor.** New baseline:

- **Common enemies: two images.** Standing, attacking. Nothing else.
- **Complex enemies: optional extras** — broken sprites, additional attack poses — only where needed.
- **Hit and hurt states are engine effects, not art.** Tilt the sprite, redden it, in-engine. VFX
  carries the rest.

Two consequences worth acting on: the 13 `artOwed` enemies in B2 are a smaller job than that number
suggests, and **the tilt-and-redden treatment is engine work that does not exist yet** — it should be
built before the art pass, because it is what makes two images sufficient. It also belongs under tuning:
tilt angle and redness are numbers.

### B22. Relic rework ☐

From A5, plus a much larger call:

> Mark crimson fang, votive candle, and bone necklace as relics to replace in the relic rework.

> Three starting relics for a party of three is way too many. Characters probably shouldn't start with
> ones either, they should be unlockable.

Two changes:

1. **Mark for replacement:** `crimsonFang`, `votiveCandle`, `boneNecklace`. Replace, do not tune — the
   measured problem (A5) is that free per-fight healing makes the campfire pointless, and the campfire
   is also where removal and upgrades live, so it is the most contested node in the run.
2. **Cut starting relics.** Three for a party of three is too many, and his lean is that characters
   should start with **none** — relics become unlockable instead.

Point 2 routes straight into **B4** (distribute unlockables through the game): relics joining the
unlockable pool is more content for a seam that already exists and has no authored nodes. Do them
together.

### B23. Early deck-customization pricing ☐

> Early deck customization is more dangerous than I realized. Remove attack and remove defense need to
> be expensive nodes, extra attack and extra defense though can be very cheap.

| Node | Price |
|---|---|
| Remove attack | expensive |
| Remove defense | expensive |
| Extra attack | very cheap |
| Extra defense | very cheap |

The asymmetry is the point: **thinning a deck is far stronger than padding it**, so subtraction gets
priced like a payoff and addition gets priced like a convenience. This is progression-tree pricing and
lands in the same pass as B4. Prices are numbers — `honeycomb-tuning.js` or a named field on the node's
content-table entry, per the standing rule.

**VERIFY** that these four node types exist as distinct authored nodes rather than as one generic
deck-edit node.

### B24. Curses and deck bloat ☐

> Make a boss (probably retool an existing new one) with a start of battle effect to shuffle temporary
> curses into your deck until you have 7 cards for each character. Add an elite who's not very difficult
> but has a starting attack that adds permanent curses to your deck until you have at least 15 cards in
> your deck. Have the curses gloom wisps shuffle in be permanent too so they impact future battles if
> killed too quickly. All these reduce the power of early removals.

Three pieces with one purpose — **early removal is too strong, so bloat it back**:

1. **A boss** (retool an existing new one rather than building from scratch) with a start-of-battle
   effect shuffling **temporary** curses in until the deck holds 7 cards per character.
2. **An elite**, not very difficult, whose starting attack adds **permanent** curses until the deck
   holds at least 15 cards.
3. **Gloom wisp curses become permanent** — so killing wisps too fast carries a cost into later fights
   instead of being free.

Note the pairing with **B23** and **B25**: all three attack the same problem from different angles
(price removal up, cap removal per shop, and add curses back). They should be tuned as one system, or
the deck-size floor will be hit by three independent forces at once. Every threshold here is a number —
7 per character, 15 minimum — so all of them belong in tuning.

### B25. Shop removal pricing ☐

> Card shop removal should be once-per-shop, and should quickly scale up in price.

Two limits: **once per shop visit**, and **price scales up quickly** across the run. Same system as B23
and B24 — tune together.

### B15. Act 1-1 and Act 1-2 — CORRECTED (session 39): both are LIVE ☐

**The session-38 reading of this was wrong and is retracted.** It said the acts were "a demo goal with
nothing behind it yet" and that `tuning.map` generating one 9-row map with no act table meant there was
no seam. Noodle:

> Act 1-1 and Act 1-2 are not unstarted, they're live in game and working right now. The wide purely
> automated map on a simple background is act 1-1, the one overlaid onto a more complex background is
> act 1-2. What's missing is the ability for act 1-1 to have multiple boss nodes to select alternate 1-2
> areas, with tooltips explaining each area so the player can make an informed decision. The current
> live act 1-2 should be titled Myconid Navel. Anastasia's chess gauntlet is a one-time (or until
> beaten) act 1-2. For now, act 1-2 as a whole is likely the stopping point for the demo.

(One typo corrected: he wrote "a more complex issue" where act 1-2's background is meant — the contrast
is against act 1-1's "simple background". **Confirm if this reading is wrong.**)

So the real work is much smaller than a seam-building exercise:

1. **Branching from act 1-1.** Multiple boss nodes in act 1-1, each leading to a different 1-2 area.
2. **Tooltips on those boss nodes** explaining each area, so the choice is informed rather than blind.
   This is the part that makes branching worth anything.
3. **Title the current live act 1-2 "Myconid Navel."**
4. **Anastasia's chess gauntlet is an act 1-2** — one-time, or until beaten. It is an alternate
   destination, not a separate mode, which also means A4's decisions have a structural stake.
5. **Act 1-2 is the demo's stopping point** ("likely"), so no act 2 work is in scope.

**CONFIRMED IN PLAY, session 39.** He tested it while answering: *"I'll test that beating act 1-1 right
now still takes me to act 1-2"* → *"And confirmed. I'm in act1-2 right now."* The transition works
today.

And the reconciliation is settled too: *"But you are right that they aren't called that in the code
right now."* So the two acts are **distinct map configurations with no act table and no act naming** —
session 38 read the code correctly and drew the wrong conclusion from it. That makes the build shape
clear: the branching work has to **introduce** the act concept (an act table, or whatever names the
1-2 areas so a tooltip can describe one) before multiple boss nodes can select between them. Naming
the live 1-2 "Myconid Navel" is the first thing that needs somewhere to live.

### B1. Unlock routes ☐

Verified session 38 on a fresh profile: **all 25 outfits report unlocked**, including every alt. Since
each alt outfit carries 3 commons and 2 rares, the whole 21 C / 11 R pool per character drops from the
first reward screen, which is exactly what the pool was sized *not* to do. The seam is there —
`honeycomb.unlocks.isUnlocked("outfit", …)`, `offerCondition: { index: "outfitUnlocked" }` on the gated
cards, and `unlockOutfit` on a tree node — so this is authoring which routes open which outfit, not
engine work.

### B2. Card and enemy art ◐

**148 of 419 cards** and **13 of 36 enemies** carry `artOwed: true`: written, named, drawing a labelled
placeholder rather than a 404. `tools/generate-placeholder-art.py` builds them and the `.generated.txt`
sidecars keep real art safe from the generator.

**The enemy half of this is re-scoped by B21** — two poses per common enemy, hit states in-engine.

### B3. Card art prompts ◐

> Deepseek really deep-dicked everything it touched, nearly all of the suggested prompts it laid out are
> super similar, it'll turn out really boring. I'd like to see how creative you can be, so please narrow
> in on Brienne for now.

Brienne is hand-authored in `tools/card-prompts.js` `OVERRIDE` and compiles clean through the webui engine.
Nettle, Severine, Cinder, Clemence, Cassadora and neutral are still the table-derived first pass.

### B4. Distribute unlockables through the game ☐

`progressionArray` with global/personal pools, ranked/exclusive nodes and `unlockOutfit` is the seam.
What is missing is authored nodes naming cards, outfits, equipment and relics. Overlaps B1, and now
carries **B22's relics** and **B23's repricing**.

### B5. Cross-party hooks ◐

> A number of characters seem to still have no cross-party hooks at all, every single party member
> should ideally have *some* kind of value they add to each other.

Re-counted session 38 against the **current** pool (the old count in round 07 predates the replacement).
Draftable commons and rares whose target is another ally:

| Clemence | Brienne | Cinder | Cassadora | Nettle | Severine |
|---|---|---|---|---|---|
| 17 | 9 | 5 | 3 | 2 | 2 |

Better than the old reading — Nettle had none at all before, and has Plague Bearer and Draw Out now —
but the spread is still eight to one, and Clemence is still where every simulated drafter went. Content
work, not engine work. **B18 cuts Clemence's end of the spread directly.**

### B6. The hand ◐

> The primary bug reports have been "the hand [of cards in battle] does not feel good". Investigating
> this is a high priority.

The 10-card cap is in (your call, session 13) and the bounce is fixed (session 36: `repaint()` was
replacing the hand bar's `outerHTML` under a stationary pointer; hover now carries across as
`hcHandRaised`). What is left is the feel and legibility pass, and lever 3 in B14 — the repaint cost
underneath it. **Now also a B16 item**: "does not feel good" and "runs poorly" may be the same report
in different words.

### B7. One-card passives named as statuses ◐

> There are way too many statuses in the game: A lot of unique ones should be replaced by just saying
> the card's effect in the text, rather than saying "Gain 1 gorged." and leaving the explanation of that
> to the tooltip.

Your rule (session 13): a passive that sticks around turn after turn may live on the status bar, but if
only ONE card uses it, do not name it as a keyword — write the effect into the card's text. The
`orphanStatus` warning rule is built and the session-20 pass applied the rule to most prose. Open: the
remaining card prose that still names a one-card passive.

### B8. Broken character art per outfit ☐

> The "Broken" character assets should be made outfit-specific, otherwise when proper alternate outfit
> assets are added the art won't match.

`brokenArtPath` / `brokenBackgroundPath` are per-character fields the resolver already reads; an outfit
version resolves them through the worn outfit (`honeycomb.art.characterFolder`), exactly as the Exposed
cut-in does. Waits on outfit art existing.

### B9–B11. Sound ☐

- **No short movement stem.** The five Cinder movement cards stand in with `miscCreak` (1.0s). A
  dash/footstep one-shot under a second is the one real gap in the library.
- **Four files are too quiet at source** to reach the target even at maximum trim, and want re-rendering
  louder: `lewdSquish`, `lewdSlap`, `!outfitChange`, `lewdSwallowing`. `tools/sfx-report.js` flags them.
- **Enemy and descent sfx** are still unassigned; cards and stingers are done.

### B12. Music ☐

Map, battle, elite and boss OSTs, and how to loop one without replaying the whole song.
`platform.sound` / `playFile` is the seam; an `<audio>` loop with a crossfade point is the known shape.

### B13. VFX ☐

Generate and assign vfx to cards. **B21 raises the stakes** — the enemy art plan explicitly assumes
"vfx will do the rest of the work", so hit feedback now depends on this rather than on sprites.

### B14. Performance ◐

Remaining levers from the session-12 cause list (numbers as in `Archive/FEEDBACK-07-DONE.md`):

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

### B26. Neutral cards missed the overhaul ☆

> The card overhaul seems not to have touched the neutral cards, Shared Resolve is way below rate.

Found in play, session 39. **The session-33 pool replacement appears to have skipped the neutral pool
entirely**, with `Shared Resolve` named as the example that is well below rate. Two jobs: confirm the
scope of the miss (is it all neutrals, or some), then bring them onto the current rate. Worth doing
early — neutral cards appear in every draft regardless of party, so an under-rate neutral pool quietly
taxes every run, and it would also skew anything A9's simulation measures later.

### B27. Hide the card ribbon at small size ☆

> Card design. The bench had it set so that at small size the ribbon was hidden, that should be
> implemented live.

The bench already does the right thing; the live renderer does not. Port it. Sits with **A2/A3** — all
three are card chrome, so do them in one pass, and the size threshold is a number and belongs in tuning.

### B28. Map generation: too many chests, not enough encounters ☆

> Too many chests in map generation, not enough encounters.

Node weights in `tuning.map`. Raised twice in the same message, which is worth taking as emphasis
rather than duplication. Note this pulls against **B22** (cutting starting relics) and **B24** (adding
curses) — fewer chests plus no starting relics is a large swing in how much a player has by the boss,
so these three want tuning together rather than one at a time.

### B29. Debug menu: win button is too many steps ☆

> Debug menu win button too many steps to reach

Pure ergonomics, and it is in the way of his own testing — which makes it a **B16 and A12 enabler**,
not a nicety. Same family as A12's "phone testing really needs to be Easier": both are about him being
able to reach a state quickly enough to measure it. Worth fixing in the same pass as the large-hit-target
test path.

### B30. Camp image should reflect party composition ☆

> Need to implement system to pick camp image based on party comp and other requirements

A selection system, not an art job: the camp image resolves from party composition plus other
conditions. The requirements beyond party comp are not specified — ask before building, or build the
resolver so conditions are table entries and the set can grow without engine work, per the standing
modularity rule.

### B31. Sporelings should be fought in bulk ☆

> Sporeling could be better designed to be fought in bulk, like 4x in an encounter, since matriarch
> summons them and the game could use more aoe checks

Two reasons given, both good: the Matriarch already summons them (so a bulk sporeling encounter is
consistent with existing content), and **the game needs more AoE checks** — encounters that test
whether a deck can handle several bodies at once. `chessmaster/STATUS.md` notes the Matriarch can summon
5 and never reads the ally-side cap, so the engine side is already there. This is an encounter-table
entry plus a look at whether the sporeling's own numbers suit being one of four.

### B32. Enemy titles are hard to read ☆

> Enemy titles small and hard to see, need better shadow behind words

Legibility, and his fix is named: a better shadow behind the text rather than a larger font. Shares a
pass with **B27** and the card chrome work. Both the shadow and any size change are numbers.

### B33. Boss and elite rare drop rate ☆

> Boss and elite encounters should drop rare cards at a higher rate

Reward weighting by encounter type. Reads directly onto **A1**: if a high ratio of rares is what gives a
deck its best chance of recovering from broken, then where rares come from is a balance lever, not just
a reward. Bosses and elites being the rare source also gives **B24's** new boss and elite a payoff to
justify their difficulty.

---

## C. Closed on the way into this file (session 38)

Full text — quotes and annotations — is `Archive/FEEDBACK-09-DONE.md`. Archived session 41 so this
file holds open work only. Two have live successors:

| | Was | Now |
|---|---|---|
| **C1** | The rarity gem: *"remove the rarity gems from common cards"*. Built session 38 as an opt-in per rarity (`showRarityGem`), rare only. | **REVERSED by A3** — gem on common, off rare, off starter. The mechanism is unchanged, which is what makes the reversal a two-flag edit; block `[104]`'s assertions need rewriting, not deleting. |
| **C2** | Moss is Nettle: the session-37 Vigour ranks stand (Brienne 6 … Nettle 1). | **WIDENED into B20** — one of four protected renames; `skull` may still be live in the code. |
| **C3** | Brienne's Resolve, 1 per point of damage taken. Landed session 33 and was never annotated there. | Closed. `pointsPerDamage: 1`, hooks `onDamaged` + `onTemporaryAbsorbed`. |

---

## F. Unsorted — drop new reports here

*(add new reports below this line; the next session sorts them into the sections above)*
