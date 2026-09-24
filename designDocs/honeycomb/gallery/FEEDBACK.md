# Event Gallery — FEEDBACK

Open items for `gallery/`. Quotes are Noodle's, verbatim. Finished items move to
`_archive/FEEDBACK-DONE.md`. The folder's map is `CATCH-UP.md`.

Opened session 49, from Noodle's request for the gallery itself. G1–G5 closed the same session.

---

## Open

### G6 — the party events and progress events are not in the gallery yet

> replaying just lust events for now, but we'll add support for other events later

`honeycomb.gallerySourceArray` is the seam: a new kind of scene is a row there, with `collect`,
`available` and `open`. The two kinds already designed are in `../lust_events/IDEAS.md` — §6's party
events (14, one per character per lust type) and §7's progress events (6, character pairs). Neither
exists as content yet, so the source rows are owed **once the content is**, not before.

Progress events are the interesting case for this folder: they belong to **two** characters, and the
gallery already carries the shape for that (`gallery.characterArray` puts one tile on both pages —
proved on the `afterThree` placeholder). A progress-event source should use it rather than inventing
a second mechanism.

### G7 — a scene completed WITHOUT fighting still opens both battle endings

Finishing a scene once opens both of its endings, which is Noodle's own call and the point of the
feature. The wrinkle: a scene can be completed by a choice that never reaches the fight at all, and
that completion opens both endings too — so a player who talked their way out is handed two scenes
about a battle they never had.

Not fixed, because fixing it means a per-branch ledger and the placeholder content cannot show whether
it matters. **What to watch for:** a real scene where the non-battle route is a meaningfully different
ending, rather than a "not tonight" door. If one turns up, the fix is to unlock an ending on the
outcome actually reached (`honeycomb.gallery.record` already does exactly this for a replayed battle)
and stop inferring both from the parent row.

### G8 — an ending is keyed by what it plays, and content should keep it that way

A battle ending's gallery key is `<scene key>#<outcome>:<page or event>` — for example
`lustEvent:nettleVenom1#defeat:trialLost`. Keying on the outcome alone would break the moment a scene
held two fights: both victories would share one key, so two endings would be one tile and the unlock
ledger would open the wrong one. The finished fight rebuilds the same key from its own continuation,
which is how losing a replay opens the ending actually reached.

**What this asks of content:** renaming a victory or defeat page, or pointing an outcome at a different
event, changes that ending's key and a profile that had unlocked it by replaying loses that unlock.
Harmless while the parent row is complete, because completion opens both endings anyway — worth knowing
before a scene's pages are renamed wholesale.

### G9 — a replayed fight can still pay a first-time discovery

A replay pays nothing itself, but the *fight* inside it is an ordinary fight, and an enemy killed for
the first time anywhere records a discovery and its experience. Reaching that through the gallery
means the encounter was already fought in the scene being replayed, so the enemy is already known —
which is why this is a note rather than a bug. It becomes real if a gallery battle is ever the only
place an enemy appears.

---

## Reported elsewhere, found here

### G10 — `.hcPickerGrid` is defined twice in `honeycomb.css`, live both times

Line ~2431 (the Compendium's wall of faces, session 21) and line ~4129 (the card picker). The second
wins for both, so the Compendium's wall is laid out by the card picker's grid — 90px columns and a
58vh ceiling it was never written for. Pre-existing and not touched in session 49; the gallery uses
its own `hcGallery*` classes rather than inheriting the ambiguity. Belongs to `ui/` if it is worth a
session. **Changing it will change how the Compendium looks**, which is Noodle's call, not an agent's.

### G11 — `--hc-lust` is used but never defined

`honeycomb.css` reads `var(--hc-lust)` in the weakness-row rules (~line 6984) and nothing anywhere
sets it, so those `border-color` declarations are dropped. Pre-existing. The gallery's tile hover uses
the literal `#ff5fd2` rather than propagating a phantom variable. Belongs to `ui/`.
