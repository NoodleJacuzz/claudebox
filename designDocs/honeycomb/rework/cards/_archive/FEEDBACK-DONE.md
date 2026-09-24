# Card pool rework — finished feedback

Closed items from `../FEEDBACK.md`, quote and annotation together, newest first. Nothing here is open work.

---

### S57-1. Heavy Swing skipped its second hit at 16 Temporary HP — FIXED (session 57) ☑

> "The Heavy Swing seems bugged. I had 16 temp hp but he didn't do the bonus damage"

**Reproduced only with Thorns on the target.** Played headlessly at 16 Temporary HP into the first enemy of
every one of the 84 encounters, it hit twice every time, and on screen the two hits show as two separate
numbers about 0.3 seconds apart. With Thorns 7 on the target, the first hit bounced 7 back onto Brienne's
Temporary HP, leaving 9, and the "10 or more" question was asked after that, so the second hit was skipped.
Retort 3 on the target did not do it in the same test.

A player reads "If you have 10 or more Temporary HP" as the state when the card is played, so that is what
it now means. **New engine option: a condition marked `checkedAtStart: true` is answered before anything in
its effect list runs** (`honeycomb.resolveEffectArray`). Heavy Swing and Heavy Swing+ carry it. Nothing else
does: the other cards with a condition after a hit (Bloody Verdict, Coup de Grace, Stalk, Pounce, Scent of
Blood, Hot Pursuit, Longspear, Sortie) mean "after the hit", which is still the default.

Checked: at 16 Temporary HP into Thorns 7 it swings twice; at 10 twice; at 9 once. Suite block [137], and
removing the flag makes it go red.

### S57-2. Whetted Edge's upgrade and discount outlived the fight — FIXED (session 57) ☑

> "I got Whetted Edge again and still not fixed. Stay between fights. But only upgrade a card the first time it's used. Nvm it does upgrade but it's inconsistent."

The card says "upgrade it and reduce its cost by 1 **this combat**". Measured before the fix, on a Heavy
Swing in the deck: after one Whetted Edge it was **Heavy Swing+ at 0 energy in every later fight**. Two causes:

1. The upgrade effect upgrades a deck card for good; only a card made mid-fight was fight-long.
2. A fight's card copies ARE the deck's entries, and the cost cut (`costModifierArray`) was written onto
   the deck entry and never cleared. So every cost change "for the rest of the fight" was permanent.

"Inconsistent" is the first cause showing: a card Whetted Edge had already upgraded was at its top level,
so the next Whetted Edge on it could only take 1 off the cost.

Now: `upgradeTargetCard` takes `forThisCombat: true` (Whetted Edge sets it), which stores the level in a
separate `combatUpgradeLevel` on the card. `honeycomb.combat.fightOnlyCardFieldArray` lists every field that
must not outlive a fight (`costModifierArray`, `costOverrideArray`, `combatUpgradeLevel`,
`combatUpgradePath`), and they are removed from every deck card when a fight begins and when it is cleared.
Clearing at the start also cleans a save that already carries an old discount. The campfire's Sharpen still
upgrades for good.

Checked: during the fight the card is Heavy Swing+ at 0 energy; after it, Heavy Swing at 1; a leftover
discount written into the deck is gone when the next fight begins. Suite block [137]; removing the cleanup
makes it go red.
