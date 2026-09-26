# Honeycomb Catacombs — FEEDBACK

**This file sorts; it does not hold.** Feedback lives in the pipeline document it belongs to, because a
session is one pipeline. Two jobs only:

1. **The inbox at the bottom.** New reports land there, unsorted. The next session files each one into a
   pipeline document, in Noodle's words.
2. **The index.** How many items each pipeline holds and when work last landed there, so a session can
   tell whether the previous one ended before it could write its document.

**If a row disagrees with the pipeline's own document, the document wins and the previous session was
cut short.** `tools/feedback-audit.js` does the comparison; run it first.

**The gate is `BASICS.md`, "The demo scope — the second demo".** Everything filed before 2026-09-25 is at
its old path in `Archive/demo1/`.

---

## The index

Counts are OPEN items, one per `###` heading in the pipeline's document. Re-counted **2026-09-25**.

| Pipeline | Holds | Open | Last work landed |
|---|---|---|---|
| **`tooling/`** | The suite's overhaul (S64-1), the balance tests (T1 to T6), the Quality Lab (Q1 to Q8). All blockers on his list. S65-1 the in-frame review grids. | **15** | 2026-09-25 (filed) |
| **`desk/`** | The phone desk's eleven-phase plan. A blocker on his list; a session of its own. | **41** | 2026-09-23 (phases 1 to 4 built) |
| **`card_pool/`** | What a card costs, does and is worth. B34 the manual pass: `card_pool/CARD-POOL-02.md` drafted whole, vetoes held. S65-1 the starter broken-card rule, measured. | **13** | 2026-09-25 (design only) |
| **`enemies/`** | Who an enemy is and what it costs. E14 the retag first; S64-1 drafted (`enemies/COMMON-ENCOUNTERS-01.md`), S64-2 and S64-3 the other two gate sessions; E9 every name for veto; S65-1 the act-1 difficulty standard they are graded on. | **13** | 2026-09-25 (S64-1 drafted) |
| **`art_pipeline/`** | Alt outfits, card art, enemy art, card chrome, VFX overlays. | **14** | 2026-09-25 (filed) |
| **`events/`** | Lust Events by tag, map events, the writing groundwork. B23 is the docket. S65-1 event relics priced in a weakness rank. | **10** | 2026-09-25 (filed) |
| **`mobile/`** | Landscape sizing, portrait styling, the phone test path. | **4** | 2026-09-25 (filed) |
| **`relics/`** | Starters, outfits and their unlock routes, relics, the trees. B1 is the load-bearing item; S65-1 the rarity model, for his veto. | **7** | 2026-09-25 (design only) |
| **`engine/`** | The verbs the other pipelines wait for, the screens, audio, performance. S66-1 the encounter block rule and two enemy roles. | **25** | 2026-09-25 (filed) |

**142 items open across nine documents.** Forty-one of them are the desk's plan. Anastasia's eleven
(`chessmaster/`) are off the gate and frozen in `Archive/demo1/` on Noodle's machine.

Three of these are wired together and should not be tuned one at a time: `relics/` B22 (no starting
relics), `card_pool/` B24 (more curses) and the chest cap already in place all pull on how much a player
has by the boss.

---

## Inbox — unsorted, file these into a pipeline

*(add new reports below this line. The next session reads them, decides which pipeline owns each, moves
the report there verbatim, and fixes that row's count above.)*

**2026-09-25:** Noodle's second-demo message and his replies on it were filed line by line; the batches
routed before it are in `Archive/demo1/Archive/INBOX-ROUTED-2026-09.md`. Nothing else waits here.

### The two that are still waiting on him

**IN-7. Event window styling took shortcuts.** Owner: `engine/` or `events/`.

> a number of shortcuts were taken with the event window styling

He did not say which shortcuts. Ask before changing anything, and show him a previewer first. `mobile/`
S64-2 restyles the same window for portrait (image above the text), so whoever takes that should ask him
which shortcuts he meant first.

**IN-8. Nonsense text is still in the game.** Owner: whichever pipeline owns each piece of text.

> a mountain of absolutely nonsensical text is still left in the game.

He plans to have the events agent replace placeholder events and write character descriptions. Any text
written for this follows `.claude/CLAUDE.md` rules 1 and 2 and `../voice_matching/`. Never invent text for
a slot he left empty. `events/EVENTS.md` S64-1 is where the map events' share lands.

*(IN-9, his note on the first demo's difficulty, was routed the same day to `enemies/ENEMIES.md` S65-1,
where the three encounter sessions it grades are queued.)*

### Noodle's batch of 2026-09-26 — file each into its pipeline, then fix in tier order

His words, verbatim, from the last cloud session. His instruction with them: *"Don't try to resolve
things right now, I just need desktop claude to know that once his brain is settled, I want to
fix/add these."* and *"I need these assigned as high as safely possible."* Tier 1 is bugs in the
shipped game, first desktop work after the migration checks pass. Tier 2 is small features. Tier 3
waits on a rework already queued. Owners are proposals; the pipeline document decides. Every fix adds
a check to the suite. His Syrup Town, WebUI and image-workbox reports from the same message are in
`../playtest_notes/REPORTS-2026-09-26.md`.

**Tier 1 — bugs**

**IN-10.** Owner: `engine/`. Rules bug: a broken enemy acts after leaving the fight.

> Trumpet bell broke and was out of the fight but still played a Stoop. Battle log:
> Trumpet Bell's Temporary HP halved, losing 5.
> Trumpet Bell BROKE.
> Drew 1: Lance Thrust.
> Cinder healed 4.
> Severine healed 3.
> Trumpet Bell is out of the fight.
> Trumped Bell played Stoop.

**IN-11.** Owner: `engine/` (the on-hit hook), `card_pool/` if it is the card.

> "I had cast Plague Bearer on Severin (this turn an ally's attack also inflict 2 Poison). I then had her do a claw fury expecting at least 2 poison (ideally 6), but got 0.  The Bell did have temp HP if that is relevant. I then did scatter spores which did add 2 Poison to the Bell, so she isn't immune."

**IN-12.** Owner: `engine/` (status table).

> Looks like Regeneration heals 2 per stack, and the forecast card says "Something +6" when 3 stacks. Confirmed not just the forecast, they actually did heal 2 per stack, it should be 1.

**IN-13.** Owner: `engine/`, with the Poison tooltip text wherever the status is defined.

> Poison tool tip says it should hold at it's level untill removed

**IN-14.** Owner: `card_pool/`.

> Shield bash+ says it will add 8 temp HP, but it looks like it only adds 7 (not caused by heavy pauldrons!)

**IN-15.** Owner: `card_pool/`.

> I have "gorge" and dealt 5 damage, yet Severine only heals 2 (to full health). It didn't give me any temp HP.

**IN-16.** Owner: `card_pool/`.

> Using answered prayer to heal doesn't increase Clemence's devotion

**IN-17.** Owner: `engine/`. His design rule for Stride is in the parenthesis and outranks the card text.

> "I don't understand how stride works for cinder. I used "Rotate the line" to get her from the back to the front and then "change places" to put her from the front to the back, yet my stride is still 0?" (Player intuition is very important. Anything that changes her position at all should give stride. Swaps, other characters moving her, etc).

**IN-18.** Owner: `engine/` (the party menu).

> Outfit bullet list is too tall, clips into bottom of the screen, several outfits unreadable

**IN-19.** Owner: `art_pipeline/` or `engine/` (sprite facing).

> Hollow knight sprite turned around 180 degrees when attacking

**Tier 2 — small features**

**IN-20.** Owner: `engine/`.

> Players completely missing or forgetting progression trees, if the player has enough XP for a progression node, I would like the progression node tab button to glow (softly and subtly)

**IN-21.** Owner: `art_pipeline/`. A feature request, not a bug; the two `.bat` files are his design.

> We need some kind of support pipeline for image improvements. Testing with thirty images, Improving images one at a time takes 16x longer than my personal pipeline for bulk work, and resulted in vastly more errors. Automating bulk work is out of scope, I just need to make Honeycomb compatible with my bulk work habits.
> * I want to be able to copy out pictures (or have you grab them) and place them into a workbox folder.
> * I will edit the images and txt files inside, bulk upscale, improve, etc. I work in bulk, so no subfolders, every image and sidecar sits inside the workbox folder raw.
> * For images with the same filenames, this does present a problem. The project's quite overloaded with node tools already, I'm hesitant to learn even more. It's a waste to have an entire session be "Claude, move these images into the workbox folder", and grabbing images via filepath is vastly slower than just copypasting.
> * Suggestion, one that works without you and without preventing copypasting: When copying, I can rename the files to allow them in the same folder. A "!assign.bat" file at the top of the workbox could then search for the same image and/or sidecar and create a temporary array saying something like "chess - Copy.png -> events/campfire/chess.png"
> * The above bat file would need levels of priority when assigning. 1: Exactly identical image, 2: Exactly identical sidecar. 3: Exactly identical sidecar from "Negative prompt:" down. 4: Overall most similar sidecars. This priority system is just in case I forget to run the assign script before editing a few files. If it needs to use lower priorities, a console window should alert me that it's using fallback identities.
> * Once I am done, a "!finish.bat" file would auto-sort them back into place, overwriting the old files.

**Tier 3 — waits on a queued rework**

**IN-22.** Owner: `card_pool/` (the starter broken-card rule, S65-1). Anastasia is off the gate; note it beside the rule.

> Anastasia negative common should rearrange party (for broken card rework)

**IN-23.** Owner: `relics/` (B22).

> Equipment isn't shown on party members outside of the team (likely solved during relic rework)

**IN-24.** Owner: `art_pipeline/`. A reminder for him, not a task for a session.

> REMIND NOODLE LATER: Part of trumpet bell's leaf hair was accidentally made transparent.
