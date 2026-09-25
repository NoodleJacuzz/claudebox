# Starters, outfits and relics — FEEDBACK

What a character starts with, which outfits unlock and how, and the relic and heirloom set.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins. Items were split out of the round-09 file in session 41 and moved
byte for byte — nothing was rewritten on the way.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `../../CATCH-UP.md`. What the project is: `../../BASICS.md`.

---

### A5. Free per-fight healing against the campfire — ANSWERED (session 39) ☐ → B22

> The most overpowered Spire relics are included in base kits (healing after battle…) which makes
> resting at campfire useless.

> Mark crimson fang, votive candle, and bone necklace as relics to replace in the relic rework.

Confirmed, and widened: **`boneNecklace` joins the list**, which session 38 had not flagged. These three
are marked for replacement rather than tuning — see **B22**, which also carries his much larger call
that starting relics should not exist at all.

---

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

---

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

---

### B1. Unlock routes ☐

Verified session 38 on a fresh profile: **all 25 outfits report unlocked**, including every alt. Since
each alt outfit carries 3 commons and 2 rares, the whole 21 C / 11 R pool per character drops from the
first reward screen, which is exactly what the pool was sized *not* to do. The seam is there —
`honeycomb.unlocks.isUnlocked("outfit", …)`, `offerCondition: { index: "outfitUnlocked" }` on the gated
cards, and `unlockOutfit` on a tree node — so this is authoring which routes open which outfit, not
engine work.

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../../FEEDBACK.md` instead)*
