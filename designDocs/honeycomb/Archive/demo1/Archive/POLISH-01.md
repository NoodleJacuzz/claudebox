# Honeycomb Catacombs — POLISH 01

Engine polish and game feel. Nothing here was on the `FEEDBACK-01.md` queue, which is finished; this
round answers *"engine polish and UI work is the next big area … general improvements to the UI and
game feel at this stage could go a long way in helping future approaches that take a more exploratory
'what can we do with this' approach."*

**No content was added.** Still three characters, five enemies, nine encounters, five events, two
regions, 26 cards. The demo scope question remains the live one — see the end of `FEEDBACK-01.md`.

Tests: **301 headless**, up from 251. `node "!designDocs/honeycomb/test-honeycomb.js"`

---

## 1. Forecasts — the biggest piece

`honeycomb-forecast.js`. The bars now say what is *about to happen*, in two places:

- **While a card is aimed**, the target's bar shows what that card would take off, and whether it
  finishes them.
- **All the time**, every ally's bar shows what ending the turn now would cost them.

### Why it is built the way it is

A forecast is **not a parallel calculation**. It runs the real action against a copy of the world,
reads the log the engine produced, and puts the world back. Nothing it does survives.

That is the same principle the printed rules text already follows — a card's text is generated from
the card's own effects, so the two can never disagree — applied to numbers. Strength, Weak,
Vulnerable, block, thorns, relics, an enemy's own hooks, a status that kills it before it swings: all
of it is included **for free**, and a new effect needs no forecasting code written for it. That is
what makes this worth having for the exploratory work rather than just for this build.

It is affordable because two properties already existed for other reasons: state is fully
serialisable, and RNG is `(seed, calls)` rather than a hidden generator. A snapshot round trip
measures **0.064 ms**, so a forecast can be answered every time the pointer moves to a new target.

The incoming forecast dry-runs **the whole turn handover** — end the player turn, then let every enemy
act. That is strictly more truthful than adding up the numbers over the enemies' heads, because it
includes everything those numbers leave out: poison ticking first, an enemy dying to that poison
before it swings, a status expiring, a relic reacting. It is the honest answer to *"will this kill
me"*, which is the question the intent icons were being asked and could not answer.

### The decision that wants your eyes

**Because the RNG is deterministic, a forecast is exact rather than a range.** It will name the ally a
random attack is going to pick. That is a design choice about how much certainty the game hands the
player, not a technical accident, so it sits behind switches in `tuning.forecast`:

| Switch | Does |
|---|---|
| `aimEnabled` | The marks that appear while a card is aimed |
| `incomingEnabled` | The standing mark on every ally bar |
| `warnOnLethalIncoming` | Whether a lethal incoming forecast is called out beyond the bar mark |

Turning either off makes it a no-op. Nothing is computed and hidden.

### What is proven about it

- A forecast leaves the world **byte-identical**, RNG counters included.
- A forecast's numbers **match what actually happens** when the action is then taken for real.
- A whole fight played with a forecast answered before **every single decision** produces a trace,
  outcome and RNG state identical to the same fight played without any. A forecast cannot change the
  fight it describes.
- A save inside a dry run is refused (guarded at `honeycomb.save.write`, the only function that
  reaches storage — a forecast would otherwise write a future that is about to be discarded).
- A nested forecast is refused; a forecast that throws still restores the world.
- Forecasting an **ability** spends no charge, and charges are run state that outlives the fight.

### What it looks like when it earns its keep

Aiming Sword Strike at a Sporeling on five health, in a party carrying **Crimson Fang** (heal on a
kill), draws two marks at once:

- the Sporeling's bar reads `5 → ☠`
- **Brienne's bar reads `54 → 57`**, because killing it triggers the relic

Nothing hand-authored would have known to say the second one. The forecast picked up a relic's
kill-trigger with no code written for it, on a card that does not mention healing. That is the whole
argument for building it this way rather than as a damage calculator.

---

## 2. Combat legibility

**The vitals are one plate now.** The name pill and the health bar used to float separately over each
character, and the bar spanned the frame edge to edge — which made the loudest thing on the
battlefield a stripe of red paint across everybody's middle. They are bound into a dark plate, inset
from the frame, with the health gradient deepened out of the near-neon it was. A health bar is on
screen constantly and is almost never being read on purpose; it has to sit *under* the things that
are.

**The bar draws three layers**, and they must not be confused with one another:

| Layer | Is |
|---|---|
| Fill | health as it stands |
| Trail | health as it stood a moment ago — held still, then drained |
| Pending | health as it *will* stand, from the forecast |

Pending is hatched rather than solid, deliberately: the whole value of the mark is that it reads as a
promise rather than as a fact. Its **left edge** is the truthful part — it is where health will be —
so it carries a 3px minimum width, because a three-point bite out of a seventy-point bar is four
percent of its width and vanishes.

**Only an aimed forecast rewrites the number.** `24 → 18` replaces `24 / 40` while a card is being
aimed at somebody. The standing incoming forecast is *ambient* — on every ally bar, every turn,
unasked for — and ambient information must not take the primary readout's place; it gets the bar mark
and nothing else. The exception is a forecast that runs somebody out of health, which is worth
interrupting for wherever it comes from: the bar outlines red and the number becomes a skull.

**Block previews the same way**, by showing what block *will* be, tinted so it is not mistaken for
block already standing.

---

## 3. Impact

- **The battlefield shakes**, by a distance read off how much of a fighter's maximum health the hit
  removed. A fixed shake on every hit is noise; nothing at all makes a killing blow read exactly like
  a scratch. The board moves and the top bar and hand do not, which is what keeps it reading as a blow
  landing rather than as the interface glitching.
- **A heavy landing pauses.** A beat of stillness is what gives a blow its weight. Returned as extra
  beat time rather than slept on, so the log replay stays one timeline.
- **A played card travels** from where it was let go to whoever it was aimed at, then breaks up.
  Without it a card simply stopped existing, and on a busy board it was genuinely unclear which card
  caused the numbers that appeared.
- **A turn banner** names the handover. It *lives* for `turnBannerMs` and the replay only *waits* for
  `turnBannerHoldMs`, so it plays over the first thing that happens instead of costing a full second
  of a board nobody may touch.
- **The aiming arrow starts at whoever is acting**, not at the card — the card travels with the
  pointer, so an arrow from the card to the pointer had both ends in the same place and drew nothing
  at all. Now it says the thing worth saying: who is doing this to whom. Its dashes run towards the
  target; an arrowhead is impossible in that SVG, because `preserveAspectRatio="none"` scales the two
  axes differently and any shape drawn in it arrives skewed.

---

## 4. The animation vocabulary

The `playAnimation` effect had two things it could ask for. It now has eight, and `color` and
`strength` ride along so one animation serves several cards without each needing an entry of its own —
a green burst and a red one are one verb, not two.

| Animation | Acts on | Is |
|---|---|---|
| `lunge` | source | drives forward |
| `flash` | target | whites out |
| `recoil` | target | knocked backwards |
| `shudder` | target | trembles in place — a curse landing, a will being bent |
| `rise` | source | lifts and lights up — for a power, where the offense pose would be a lie |
| `screenShake` | board | shakes, at `strength` × the tuned maximum |
| `beam` | source → target | a line struck between them, in `color` |
| `burst` | target | a ring expanding out of them, in `color` |

Adding a ninth is a keyframe in the stylesheet plus an entry in
`honeycomb.combatScene.namedAnimationArray`. **No card needs engine code to use any of them**, and a
test fails if content ever asks for one that does not exist.

---

## 5. Bugs found and fixed

- **A tooltip could strand itself in the top-left corner of the screen**, floating over the game with
  nothing explaining it. A detached anchor measures as a zero rectangle at the origin, and the panel
  was placed beside that. It happens whenever an element is replaced between the hover and the
  placement — which a repaint does constantly. Now: nothing to point at means nothing to show, plus
  the combat repaint takes any open tooltip down before it destroys what that tooltip was anchored to.
- **A tooltip chased a dragged card around the screen.** A card that follows the pointer keeps
  entering and leaving itself, so it re-raises its own tooltip several times a second. Tooltips are
  now suppressed for the duration of a drag.
- **A hovered hand card showed a full-size copy of itself on top of the full-size copy the hand
  already makes.** The hand's panel now says only what the card face cannot — who owns it, its
  keywords, and why it cannot be played right now — and shows nothing at all when there is nothing to
  add.
- **The aiming arrow drew nothing** (both ends at the pointer), and its SVG was **1280×1280 inside a
  1280×670 box**: an `<svg>` is a replaced element, so `inset: 0` does not stretch it the way it
  stretches a div — the viewBox's own 1:1 ratio wins. Every y-coordinate the arrow drew at was
  compressed by half and its arc was twice as tall as intended. Both dimensions are stated now.

---

## 6. Left alone on purpose

- **The hand sinks below the edge of the screen at rest** (`handRestingDropPercent: 46`). It is a
  deliberate tuned choice — the board is what the player reads between plays — but it does mean the
  hand cannot be read without reaching for it. Worth a decision rather than a quiet change.
- **`playedCardMovesOwnerToFront` and `enemyCountPerExtraMember` are still off**, for the reasons
  recorded in `FEEDBACK-01.md`. Neither is waiting on code.
- **`devPreviewTarget` is still `"honeycomb"`** in `scripts/index.js`. Set it back to `""` before any
  release build.
