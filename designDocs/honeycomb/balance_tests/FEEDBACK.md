# Balance tests — FEEDBACK

Open items for `balance_tests/`. Quotes are Noodle's, verbatim. Finished items move to
`_archive/FEEDBACK-DONE.md`. The folder's map is `CATCH-UP.md`; the build plan is `BRIEF.md`.

Opened session 52 (2026-09-21).

---

## Open

### T1 — two balance tests: "All the Crunch" and "Basic Bite"

> Honeycomb work, I need you to optimize the tests used for game balance. I feel as though it isn't
> simulating actual in-game experiences closely enough, and also it's quite slow. I could make do with
> one or the other, but it feels as though I'm getting the worst of both worlds. Can you help? If
> possible, I wouldn't mind a suite split. Balance Test "All the Crunch" would be the powerhouse,
> generating reliable data, rates we can trust, and Balance Test "Basic Bite" (these names would help me
> instantly identify which test you are running at any given time) would abstract many concepts and
> cards, just to make sure that things aren't wildly out of tune.

Session 52 advised against abstracting cards in Basic Bite, because a simplified copy of the game goes
out of date the way `tools/draft-sim/` did. His answer:

> Yes if it's not a huge drag on performance then Basic Bite should ideally use real cards.

On running fights across CPU cores (`--workers`), after a misunderstanding about what "workers" meant
was cleared up:

> Oh, yes, I completely misunderstood. Parallel workers is completely fine in that case.

On who builds it:

> In fact it'd be best if you were the one who prepared a detailed handoff and guide rather than the
> one who built it yourself, though I could have you check it afterwards. I'm very usage-rate conscious
> right now.

`BRIEF.md` is that handoff. Steps 1–3 and 8.

### T2 — All the Crunch should prove the game's content can be reached

> if we should make All the Crunch so thorough it makes sure all of the game's content is actually
> achievable by a player. By that I mean there are multiple routes and currently one secret route after
> completing all of them, purchasing a relic, and then completing the Act1-1 map with it in your
> inventory. That's probably the most complex goal to achieve, alongside 100% progression tree progress
> (the game's meta progression). The data we could gain from running a test like that just once would be
> invaluable, especially balance regarding progression trees and how they influence game balance, which
> we've mostly been guessing at so far, but would make the test basically an overnight affair only.

`BRIEF.md` Steps 4, 6 and 7: career mode answers "can it be reached", matrix mode answers "how does the
tree change difficulty".

### T3 — one bot, and it plays well

> I think it should only have one skill level, I'll get a lot of feedback from players who will do a
> much better job of accurately portraying careless players than a bot ever could. The experience of
> careless players can't be measured by having a bot make poor choices at random, it's extremely
> specific things, but also ones you or I could never predict. Balance for a skillful player is what
> matters.

`BRIEF.md` Step 2. Owed from Noodle once it is built: a few fixed-seed fights played by hand, to compare
his damage per turn with the bot's.

### T4 — removing and skipping cards

> The only factor I'd like to directly bring to your attention is a major balance factor we have the
> benefit of hindsight over, because we're in well-explored waters: Removing & Skipping Cards. I worry a
> bot will undervalue the consistency card removal can bring, and it's an easy thing to miss when
> designing a bot for a game like this, getting into the mindset of "which cards should the bot pick",
> and not testing if burning your entire deck is stronger than any of them.
> Personally, a bot stopping picking cards would be at least somewhat alarming to me, as it would
> suggest the deckbuilding portion of the game stops partway through and the game becomes stale.

On the bot learning card values from results instead of from a synergy table:

> However, your suggestion is a good one. It can't replicate "slow then broken" deck concepts that
> require extremely specific multi-card combos or behaviors, but those are rare enough it won't be a
> major issue.

`BRIEF.md` Step 5: skip and "remove nothing" are learned like any card, a thin-deck bot and a
take-everything bot run on the same seeds, and the report has a section on when the bot stops picking.

### T5 — the draft sim stays, unused for now

> I don't think it should be retired, but we certainly don't need it right now. Draft sim simulates a
> few personalities and when it comes back I'll have more data to construct better archetypes. Plus,
> "perceived" synergy between cards is extremely subjective, and requiring that to be re-tuned for All
> the Crunch to serve as a card pick rate indicator would turn it from an overnight thing to a bimonthly
> one at best.

Nothing to build. `tools/draft-sim/` is left exactly as it is. This item closes when the build does.

### T6 — the veteran gap is intended; the test measures its size

Session 54 found that a long career's Lust weakness ranks reach Undone (double Lust) and never fall, and that
the bot's career win rate fell as the trees filled. Noodle:

> That was intentional, to an extent. 2x is likely too much, maybe 1.6x would be better if the progression tree
> is so weak that there's a huge gap between fresh and veteran players. But the system as a whole is meant to
> incentivize more complex teams once there are more characters, and to keep the game challenging for veteran
> players. It ties in nicely to the feelings of surrender and self-sabotage present in most lust events.

On career mode never filling a tree in 150 runs:

> Career mode not filling in the tree is completely intentional. This is just act 1 of three. 150 runs is beyond
> what I would expect of players, and 75% is beyond what I would expect from players' tree progress.

So the corrected matrix (Steps 6–7, each tree level with and without the ledger) is not there to remove the
ledger from the game; it is there to put a number on the fresh-versus-veteran gap so he can decide whether the
rank-3 multiplier (`tuning.lust.exposureRankArray`, 2.0) should come down. **The number is owed; the tuning
change is his, not the test's.** Career mode's `--max-runs` default should sit near what he expects of a player,
not at 150.
