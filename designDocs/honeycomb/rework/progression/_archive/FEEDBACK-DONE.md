# Progression rework -- finished feedback

Closed items, quote first. The open queue is `../FEEDBACK.md`.

### S59-1. Fortitude is free, and says what it costs you — DONE (session 59) ☑

> Fortitude needs to cost 0, and the description should make it clear you're missing out on lust events.
> In the future I'll use a filter to check if any character in the active party has fortitude and use that
> to replace any nsfw with sfw content.

All seven Fortitude nodes cost 0 and carry `free: true`. The old text, "Lust weakness ranks do not
build.", was also not quite true, because rank 1 still builds. The new text is "Nettle's Lust weaknesses
never rank past the first, so Nettle misses every Lust Event from rank 2 up." (with each character's own
name). Node text never says "she", which suite block [93] enforces.

`tools/audit-trees.js` rule H9 used to fail any node that cost nothing. It now accepts a node marked
`free: true` and still fails any other zero. The tree generator (`tools/generate-progression-trees.js`)
was changed the same way, so a future run keeps Fortitude free.

The tree shows "Free" instead of "0 XP", and the node's price line reads "Free.". Checked in the browser:
Fortitude buys for 0 XP and takes effect. Suite block [141].

The SFW filter he describes is future work and nothing was built for it.

### S60-2. Fortitude means no Lust weakness at all — DONE (session 60) ☑

> Please let me restate I need fortitude to be that the player is "missing out on lust events". Not
> stopping at rank one. If the player equips fortitude I (eventually) want them to see nary a single breast.
> No lust weakness building.

While a character owns Fortitude:
- Her weakness ranks read 0 (`honeycomb.lust.rankFor`).
- Nothing builds: not Lust in a fight (`recordExposure`), and not an event (`addExposure`).
- Lust hits her at the plain rate (`vulnerabilityMultiplier` is 1).
- She is never owed a Lust Event (`lustEvents.isReady`).
- The Weeping Bloom never appears for her.

The ledger is kept rather than wiped, so giving the node back restores where she was. All of these ask one
helper, `honeycomb.lust.hasFortitude`. The text is now "Nettle's Lust weaknesses never build, and Nettle
misses every Lust Event." The SFW filter he describes is still future work. Suite blocks [141] and [99].

### S60-3. Fortitude is open from the start, beside Vigour — DONE (session 60) ☑

> Also, I realize a huge flaw with placing fortitude as the second node unlockable, it's still too late. It
> needs to be unlockable for free right away alongside vigour so the player can eventually have a sfw
> experience. I may someday just straight up replace it with a sfw mode, but that's extremely distant.

All seven Fortitude nodes have no prerequisite, so a brand new profile can buy one for 0 XP. Checked in the
browser on a fresh profile. `tools/audit-trees.js` rule H2 (exactly one root) now counts a `free: true`
node apart, so Fortitude does not count as a second root, and rule H5 walks from it too. The tree
generator leaves Fortitude without a prerequisite.
