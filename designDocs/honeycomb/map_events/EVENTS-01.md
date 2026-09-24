# Map events — what is wrong with them, and what to do about it

**Draft, session 50.** Noodle: *"the random map events still feel so empty and jank. They're all still
placeholders, I need actual meat to them, and images to put in."*

Nothing here is in the game. This is a proposal to read and argue with.

---

## What is actually wrong

There are eight map events plus the campfire. They are not broken and the choices are mechanically
fine. Three specific things make them feel empty.

**1. Nobody is in them.** Every event is written for a party of nobody in particular. They say "the
party" and "whoever is having the worst of it" because they have to work for any three characters.
The cast is the best thing the game has and none of it appears here.

**2. The art is shared placeholder art.** `theQuietSpring` and `wellOfWaxLight` both use
`map/event-well`. `handsInTheDark` and `theQuietShrine` both use `map/event-shrine`. So two different
events look identical, which makes the map feel smaller than it is.

**3. The choices do not change across a run.** The same three options every time, whatever has
happened. The engine already supports `choice.condition`, so this is content, not a missing feature.

---

## How the events should be written: the party's point of view

**Noodle's design, session 50, and it is better than what this document proposed first.** The party is
the "you" of a map event, and the cast speaks over the top of it:

```
t You arrive at a room with a fountain.
knight Looks suspiciously clean, where's the shrooms? ?leader knight;
lancer Anybody need a drink? ?leader lancer;
t What will you do?
```

> Checking the person in front's voice is easier than writing a conversation around hundreds of
> possible participants. Then you could check the person in second to give a response that works with
> any possible first character.

**Why this works where per-character lines do not.** Six characters in a party of three is 120 possible
parties; writing a conversation for each is impossible. Two slots is not: **one line per character for
the front, one per character for the second**, twelve lines an event, and every combination reads. The
second-slot line has to work after any first line, which is a real constraint and a small one.

**And it degrades to nothing.** No line matches, no line is drawn, and the event reads exactly as it
does today. Noodle: *"the example still works with no character present"*.

**NOTE THE DIFFERENCE FROM A LUST EVENT.** A map event addresses the party as "you" — that is the
player, arriving somewhere. A Lust Event has no player in it at all. The two containers take opposite
rules here and neither is a mistake.

### The engine supports this as of session 50

Two small changes, both built:

- **A scene line may carry a `condition`**, tested when the line is drawn. An untrue line is skipped.
- **`partyContains` takes an optional `position`**, 0-based from the front. `position: 0` is the
  leader, `position: 1` is the one behind them. Absent, it asks the old question.

So the example above is written as:

```js
lineArray: [
    { text: "You arrive at a room with a fountain." },
    { speaker: "Brienne", text: "Looks suspiciously clean. Where are the shrooms?",
      condition: { index: "partyContains", character: "brienne", position: 0 } },
    { speaker: "Cinder", text: "Anybody need a drink?",
      condition: { index: "partyContains", character: "cinder", position: 1 } },
    { text: "What will you do?" },
],
```

### The Quiet Spring, written out

The front line says something only she would say. The second line answers without needing to know who
spoke first.

| Front | Line |
|---|---|
| **Brienne** | "I'll take the first watch. Somebody has to." |
| **Nettle** | "Too warm. Too clean. Something is feeding it and I would like to know what." |
| **Severine** | "Oh, finally." |
| **Cinder** | "How deep? Deep enough? Only asking." |
| **Clemence** | "How kind of it." |
| **Cassadora** | "We are all getting in. I have already seen it. Save the argument." |

| Second | Line, and it works after any of the above |
|---|---|
| **Brienne** | "Fine. Ten minutes. Then we move." |
| **Nettle** | "I'm not drinking it." |
| **Severine** | "I'll allow it." |
| **Cinder** | "Last one in buys." |
| **Clemence** | "There is no hurry." |
| **Cassadora** | "...That went how it went." |

Twelve lines, every party covered, and the event is three sentences longer than it was.

## New events worth adding

These come out of the character notes rather than the dungeon, which is the gap. Each one is a
one-line idea, a few choices, and one image.

| Name | What it is | Who it is for |
|---|---|---|
| **The Sharpening Stone** | Somebody has left a good whetstone and a note asking for it back. Taking it is useful and slightly wrong. | Brienne's whole thing: is it strength to take it, or to leave it. |
| **Something Still Growing** | A plant that is clearly not dead, in a place where nothing should be alive. Cutting it pays; leaving it pays later. | Nettle, and the only event where the reward is delayed. |
| **A Debt In The Dark** | Somebody down here recognises Severine and is owed money. | Severine's wealth as a liability for once. |
| **The Dare** | A gap that is obviously too wide. Nothing makes the party jump it. | Cinder, and it should be funny rather than dangerous. |
| **The Long Confession** | Something wants to be told a sin. It is not picky and it pays well. | Clemence, who has an enormous amount of material. |
| **The Four Second Warning** | The party walks into something Cassadora saw coming. She chose not to mention it. | Cassadora, and it is the only event where the party can be annoyed at a member. |

---

## The art

**The placeholder sharing has to go first.** Eight events want eight pictures. Four of them currently
share two. That is the single most visible part of the jank and it is fixed by generating six images.

**Regional Prompting now works headlessly** (session 50) — `webui2-generate.js` loads
`webui-regional.js` and handles the `rp` trigger the same way the page does, so multi-character shots
can be generated from a block like any other image:

```
rp1-1-1 latent, brienne {default, smile}, nettle {default, bored}, severine {default, smug},
sitting, campfire, night, cave, Landscape
```

**Do not use `latent`.** The engine doc recommended it for three regions; it is not compatible with
this Forge build and destroys the output. Round 01 of the campfire test was generated with it and all
three images were ruined. `webui2-generate.js` now refuses a block containing the word.

Attention mode is the only one available, and it turned out to be fine at three regions provided each
region is kept SHORT and everything shared is pushed into the common block.

**The campfire, by party composition.** Noodle's idea, and it works. Three of the twenty
three-character combinations are generated as a look test:

    v13 spire images/_source/refsTests/2026-09-21/campfire/

The block is `../art_pipeline/prompts/CAMPFIRE-01.txt`. If the look is right, the other seventeen are one
command, about nine minutes of Forge time. **The wiring is not written**: the rest node reads a fixed
`imagePath`, so it needs to build the path from the party instead, sorted so that the same three
characters always resolve to the same file, falling back to the existing art when a combination has
none. That is a small change in `honeycomb-content-map.js` and the rest host, and it is not worth
writing until the look is approved.

---

## What I would do first

1. **Say whether the campfire look is right.** Everything else in the art plan depends on the answer,
   and it is three pictures to look at.
2. **Pick five character lines from the tables above.** Five is enough to tell whether it makes the
   events feel different, and it is an hour of work rather than a day.
3. **Six event images** to stop the placeholder sharing.

The new events are the biggest piece and the least urgent: the existing eight will feel like different
places as soon as the cast is in them.
