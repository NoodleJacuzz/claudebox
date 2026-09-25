# Lust events — AUTHORING

**The writing desk.** How a scene is entered into the game, what every scene must clear, and what is
still missing. Where the work is: `CATCH-UP.md`. The arithmetic behind the scope: `RATE.md`.

**Nettle's venom arc is the only authored content in the game** (session 49, corrected session 50).
The placeholder events that used to sit under it are GONE — they were demonstrations of engine shapes
and a player met them as if they were finished writing. They are kept as suite fixtures
(`RETIRED_LUST_EVENT_FIXTURES` in `../tools/test-honeycomb.js`), which is where to look for a worked
example of a kept-ready choice, a roster-wide fan-out row or an unlock.

**Three things a Honeycomb scene must not do**, all learned from Noodle's session-50 test pass:
there is **no player character** — nothing addresses a second person and no button is an action
somebody takes; a slot with nothing written for it **stays empty**, `resultText` above all; and the
`t ...` divider is a real line (`{ divider: true }`) that draws a rule, not just a button label.

---

## Tone rules — a working copy; `../designBibles/story.md` §3 is the authority

These are Noodle's, session 42, verbatim. They are recorded here because these scenes are where they
bite hardest. The bible carries them in §3, marked as outranking everything around them (B19, closed
2026-09-25).

> Please, no death or gore.

> The alchemist is funny, silly, she's got a mushroom hat and looks drunk, she's having fun! Any
> horror is fridge horror.

> the best part about adult games is that just seeing something hot is a reward by itself, it reduces
> player expectations and keeps them forgiving, and what an AI game absolutely needs is the benefit of
> the doubt.

> I think hypnosis in general is banned on most platforms. I want it plausible for now that she's
> actually just wearing a mushroom hat.

What this means at the desk:

- **Nothing is a corpse.** No rot, no bleeding, no missing pieces. Everyone is alive and intact.
- **Never state the mechanism.** Do not write brainwashing, hypnosis, mind control, thrall, or a
  character being made to do anything. The surface reading must stay innocent — a mushroom hat is a
  hat. This is a storefront constraint as much as a tone one.
- **Horror only as fridge horror.** If the unsettling part is on the page, it is too loud. It is
  something a player assembles later, from things the text never connects.
- **A scene is a reward, not a toll.** The player should be glad it fired. A scene that mostly costs
  them something has failed even if the numbers are right.

---

## Where a scene is entered

**One table**, `honeycomb.lustEventQueueArray` in `honeycomb-content-lust-events.js` (the queue, session
48). A row is owed to a character when its requirements pass and its `index` is not in the profile's
completed list; rows are offered in the order they are written, so **this table is the running order of
the game's narrative**. The scene itself is an ordinary `honeycomb.eventArray` entry with
`lustEvent: true` and `weight: 0`, so a map node can never roll it.

Nothing is decided at the moment a rank is crossed. **A row written today is owed today**, to every
profile that already passes it — which is why the session-47 backfill no longer exists.

| Field | Does |
|---|---|
| `index` | The row's stable name, **and the key its completion is stored under**. Renaming a row offers it again from scratch; swapping the `event` under the same name does not. |
| `character` | One character index, an array of them, or `"any"` for every unlocked character. A row reaching more than one is completed **per character**. |
| `event` | The `honeycomb.eventArray` entry that plays. |
| `tag` | Optional. The weakness the scene is **about**: fills `{tag}`, and is what `gainWeakness: {tag: "eventTag"}` grows. |
| `rank` | Optional. Fills `{rank}`, **and implies the requirement that the weakness has reached it** — so the ordinary "Nettle, venom, rank 2" row needs no `requirementArray` at all. Leave it out and `{rank}` reads the rank they are actually at. |
| `requirementArray` | Conditions, **all** of which must pass, with the row's character as the subject. ANDed on top of the implied rank requirement. |
| `locksParty` | `false` for a row that may wait without benching the character. Default `true` — a queued scene locks, which is what makes the queue a queue. |

```js
{ index: "nettleVenom1", character: "nettle", tag: "venom", rank: 1, event: "nettleFirstSting" },
{
	index: "nettleVenom1b", character: "nettle", tag: "venom", rank: 1, event: "nettleSecondSting",
	requirementArray: [{ index: "lustEventDone", entry: "nettleVenom1" }],
},
```

### The requirement vocabulary

Any condition in the game works here. These are the ones written for it:

| Requirement | Asks |
|---|---|
| `{index: "weaknessRank", tag, atLeast, character}` | The rank a weakness has **reached**. `character` defaults to the row's own. This is what Fortitude caps, so a character who can never pass rank 1 never meets a rank 2 requirement. |
| `{index: "lustEventDone", entry \| entryArray}` | Another row has been played. **This is how multi-part events are written**, and how a row cares about several others. |
| `{index: "lustEventCount", tag, character, atLeast}` | How many rows have been played, in a category. The old "Nth event" milestone, said properly. |
| `{index: "allOf" / "anyOf", conditionArray}` | …and every other condition in the game. |

`invert: true` works on any of them. A requirement the engine cannot read is reported by the warning
rule `lustEventQueueRow` and the row is never offered — so a typo is loud rather than silent.

### Where the player starts one

The heart that replaces the party toggle on a locked roster entry, and the pink banner across the top
of that character's sheet. Both play the **head** of the queue and both say how many follow, never
which. A weakness row says *"Recently ranked up!"* and nothing else; it has not started an event since
session 48.

---

## The entry skeleton

Copy `lustEventTrial` and replace the writing. Fields that only exist on these events:

| Field | Does |
|---|---|
| `speakerIsSubject` | Stands the character down the side of the screen as the speaker. |
| `keepsEventReady` | On a **choice**: leaving does not complete the row, so it comes straight back to the head of the queue. The "not tonight" door. |
| `startCombat` | A Lust Battle. `partyArray` (`"subject"` is the event's character), plus `victoryPage` / `defeatPage` or `victoryEvent` / `defeatEvent`. |
| `gainWeakness` | `{tag, amount}`. `tag: "eventTag"` means the queue row's own tag. |
| `gainPersonalExperience` | `{amount}`. |
| `unlock` | `{kind: outfit / equipment / character / tab, unlock}`. |
| `lustEventCount` | Asks how far the story has come: `{character, tag}`. Also a requirement. |
| `weaknessRank` | The rank a weakness has reached: `{character, tag}`. Also a requirement. |

Substitutions available in any text: `{name}`, `{tag}`, `{rank}` — the last two off the **queue row**,
so an event that prints them under a row with no `tag` is a reported warning.

A Lust Battle's run is **thrown away afterwards**, so it pays no gold, no card choice and no relic
(`tuning.lustEvents.battleRewardArray`). Experience is the only currency that survives it.

---

## What the three ranks mean

Titles are the engine's own (`tuning.lust.rankArray`) and should be what the writing sounds like.

| Rank | Title | The scene's job |
|---|---|---|
| 1 | Sensitised | First contact. Establish the weakness exists and that the character noticed. Light. |
| 2 | Susceptible | It has happened enough to be a pattern. The character is aware and managing it. |
| 3 | Undone | The payoff the arc was built toward. This is the one that earns the other two. |

There are no odds on any of this since session 48. A row is owed or it is not, and a rank a character
has reached is never lost — so **every rank named here is a scene the player will see**, and a rank
left unwritten is silence rather than a dice roll that went the other way.

---

## Coverage matrix

Fill the tag columns once B17's cut lands. Seven characters, three ranks each, per surviving tag.

| Character | Rank 1 | Rank 2 | Rank 3 |
|---|---|---|---|
| Brienne | ☐ | ☐ | ☐ |
| Nettle | ☑ venom | ☑ venom | ☑ venom + battle |
| Severine | ☐ | ☐ | ☐ |
| Cassadora | ☐ | ☐ | ☐ |
| Cinder | ☐ | ☐ | ☐ |
| Clemence | ☐ | ☐ | ☐ |
| Anastasia | ☐ | ☐ | ☐ |

**21 scenes per tag kept.** A partially-authored tag reads as broken content in a demo, so a tag is
either fully covered or cut — that is the whole point of B17.

---

## Anti-patterns

- **A scene that could be about anyone.** If swapping the character's name changes nothing, it belongs
  as a row for `character: "any"`, which is offered to everyone once each, rather than written seven
  times under seven names.
- **A scene that states the mechanism.** See the tone rules. The moment the text explains what the
  spores do, the plausible reading is gone.
- **A rank-3 that is a rank-1 with bigger numbers.** Rank 3 is the payoff; if it does not land
  differently, the arc was never an arc.
- **Engine code for a new scene.** Needing it means a missing verb, and the verb is the fix.

---

## Open, before authoring can start

1. **The cut** (B17) — which tags survive. Nothing below it can be written.
2. **Tone rules** — where they live, and whether they are bible-level.
3. **Clemence's `penance`** — collapse into `exposure`, or keep as her own? Two tags for one
   character's self-inflicted Lust is 3 extra scenes at best and 21 at worst, depending which way it
   generalises.
   **Measured session 47: it is the 3-scene case.** 43 Penance effects exist and every one is a
   Clemence card aimed at herself; no enemy move teaches it and no other character can hold it. So it
   generalises to nobody, full coverage is 3 scenes, and it is the only tag in the game that ranks up
   without the enemy roster cooperating. `IDEAS.md` §1 argues for keeping it on those grounds.
