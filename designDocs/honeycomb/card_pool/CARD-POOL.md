# Card pool rework — `card_pool/`

What a card costs, does and is worth; the pool per character; the neutrals; the removal economy and
curses; the broken forms. Noodle's pipeline **Card pool rework**; on the second demo's gate as
*"Per-character card overhaul"* (`../BASICS.md`, the second demo).

**How this file works.** One file per pipeline: where the work is, the rules, then the queue in Noodle's
words. When an item closes, cut its `###` section and paste it at the top of `ARCHIVE.md` beside this
file, the same minute; that is the whole archiving procedure. `../FEEDBACK.md` indexes the count. Quotes
are his, verbatim, and win over any annotation. Status key: ☐ not started · ◐ in progress · ⏸ waiting on
Noodle · ☑ done · ☆ new, unsorted.

---

## Where it stands

- **The live pool is session 33's:** 192 pool cards plus 31 Clemence broken forms, 21 C / 11 R per
  character, every alt outfit's cards open from run one because nothing gates the alts.
- **2026-09-25 he asked for the manual pass and the shape was agreed the same day:** 12 C + 8 R per
  character (6 C + 2 R base, then per alt +2 C, +1 cross-party R, +1 worn-only R), reward weights 85 / 15,
  a 15-card starting deck with a default signature, one reward slot per party member, neutrals only in
  shops and the boss's fourth slot, and a glue rule built on the shared-currency table. `POOL-REVIEW-02.md`
  is the reasoning; **`CARD-POOL-02.md` is the brief**, with Heat in his own words plus nine edge-case
  defaults, Poison halving, all six grids and the twelve-card neutral tier drafted. **His vetoes are
  held.** Once he has read it, it is the build list.
- **First engine job is `../relics/RELICS.md` B1**, the unlock routes: the pool's shape assumes the alts
  are gated. The other engine asks are `CARD-POOL-02.md` §5.
- **The cut turns the suite red.** About 265 suite lookups are pinned to named cards
  (`../tooling/TOOLING.md` S64-1); stage one of that overhaul comes before the first grid lands.
- **Done means** `CARD-POOL-02.md` §6: suite green, warnings 0, a warning rule for the 12 / 8 shape,
  budget-audit baseline, an All the Crunch run before and after, every survivor with a prompt line,
  every cut card retired.

## Files

| File | Holds |
|---|---|
| `CARD-POOL.md` | this file: status, rules, the queue |
| `CARD-POOL-02.md` | **the brief for the second pool pass**: the agreed shape, Heat verbatim with the edge-case defaults, the lust tags, the six grids and the neutral tier, the engine asks, done means |
| `POOL-REVIEW-02.md` | the 2026-09-25 review of the live pool: offers-per-run maths, the glue audit, why the shape is what it is, his answers |
| `ARCHIVE.md` | closed items from this file, and the definitions of every card retired from here on |
| `../Archive/demo1/rework/cards/` | the session-33 brief (`../Archive/demo1/rework/cards/CARD-POOL-01.md`), the balance model (`../Archive/demo1/rework/cards/BALANCE-01.md`; `tuning.balance` holds the numbers and `../reference/MECHANICS-02.md` is the live account), the card audit, the stale draft simulation (A9, paused by him), the before-picture, and every item closed before 2026-09-25 |

Live content: `scripts/misc/honeycomb/honeycomb-content-cards.js`. Character identities:
`../relics/OUTFITS-LIST.md` outranks `../reference/MECHANICS-01.md`; `../designBibles/mechanics.md` and
`../designBibles/characters.md` outrank both. Retired definitions before today:
`../Archive/demo1/Archive/RETIRED-CARDS-S31.md` and `../Archive/demo1/Archive/RETIRED-CARDS-S33.md`.

```
node "!designDocs/honeycomb/tools/budget-audit.js"          every encounter against the damage budget (runs Basic Bite)
node "!designDocs/honeycomb/tools/card-inventory.js"        every card, flat
node "!designDocs/honeycomb/tools/card-duplicates.js"       cards sharing a name or a rules body
node "!designDocs/honeycomb/tools/audit-card-fit.js"        card text that does not fit its box (browser)
```

Suite block [102] tests the pool. Card art prompts are `../art_pipeline/CARD-PROMPTS-01.md`, written by
`../tools/card-prompts.js`; art is the art pipeline's, not this file's.

## Rules this pipeline must not break

- **No magic numbers.** A card's numbers are named fields on its entry; anything shared is `honeycomb-tuning.js`.
- **Adding a card is a table entry only.** Needing engine code means the engine is missing a verb; add the verb.
- **Rates:** starter 6 / common 9 / rare 12+ damage per energy (`CARD-POOL-02.md` §1); a neutral common is priced at the rare rate.
- **Statuses before grids.** Heat is locked; Poison halving is priced inside Nettle's grid; no grid waits on a status.
- **Cut cards are retired, never deleted**: `honeycomb.retiredCardArray`, definitions to `ARCHIVE.md`, so old saves survive.
- **Never edit the content tables with a greedy regex.** Indentation is not uniform. Slice by index, then run the suite.
- **`honeycomb.findDefinition` returns the FIRST match.** A duplicate registration shadows silently.
- **Anastasia is outside this pass** (his eighth message, B34). Her 13 C / 7 R stay as they are.

---

## The queue

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
  recovery" is a testable claim — it is exactly what `../tools/draft-sim/draft-simulation.js` could measure once A9 is
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

---

### A6. Whetted Edge — ANSWERED (session 39) ☐

0 energy, exhausts, upgrades a card in hand permanently.

> Whetted edge, maybe shift up to rare? The flavor is boring and the name is bad right now.

Three changes, one tentative: **move it to rare** (his "maybe" — treat as a decision he will confirm on
sight, not as an open question), and **rename and reflavor it**. The rarity move is the balance answer
session 38 asked for; the name and flavor are a separate authoring pass.

Note this interacts with **A3**: moving a card to rare now changes its *orientation*, not just its gem.
A rare is vertical. Do A3 first or the reflavor gets redone.

---

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

---

### A9. The draft simulation's cut list — DEFERRED (session 39) ⏸

> I say we wait for now.

**Parked by his decision.** `../Archive/demo1/rework/cards/DRAFT-SIM-01.md` part 3's Tier A/B list stays unacted, and the re-run stays
unscheduled. The staleness finding stands and is why: 6 of its 20 named cards no longer exist, and every
number predates the session-33 pool replacement. Nothing should be cut on the old report's say-so.

Worth remembering that A1 gave the simulation a new job whenever it is un-paused — *"a deck with a high
ratio of rares stands the best chance at recovery"* is a claim `../tools/draft-sim/draft-simulation.js` can measure.

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

---

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

---

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

---

### B25. Shop removal pricing ☐

> Card shop removal should be once-per-shop, and should quickly scale up in price.

Two limits: **once per shop visit**, and **price scales up quickly** across the run. Same system as B23
and B24 — tune together.

---

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

---

### B7. One-card passives named as statuses ◐

> There are way too many statuses in the game: A lot of unique ones should be replaced by just saying
> the card's effect in the text, rather than saying "Gain 1 gorged." and leaving the explanation of that
> to the tooltip.

Your rule (session 13): a passive that sticks around turn after turn may live on the status bar, but if
only ONE card uses it, do not name it as a keyword — write the effect into the card's text. The
`orphanStatus` warning rule is built and the session-20 pass applied the rule to most prose. Open: the
remaining card prose that still names a one-card passive.

---

### B26. Neutral cards missed the overhaul ☆

> The card overhaul seems not to have touched the neutral cards, Shared Resolve is way below rate.

Found in play, session 39. **The session-33 pool replacement appears to have skipped the neutral pool
entirely**, with `Shared Resolve` named as the example that is well below rate. Two jobs: confirm the
scope of the miss (is it all neutrals, or some), then bring them onto the current rate. Worth doing
early — neutral cards appear in every draft regardless of party, so an under-rate neutral pool quietly
taxes every run, and it would also skew anything A9's simulation measures later.

---

### B33. Boss and elite rare drop rate ☆

> Boss and elite encounters should drop rare cards at a higher rate

Reward weighting by encounter type. Reads directly onto **A1**: if a high ratio of rares is what gives a
deck its best chance of recovering from broken, then where rares come from is a balance lever, not just
a reward. Bosses and elites being the rare source also gives **B24's** new boss and elite a payoff to
justify their difficulty.

---

### B34. The manual pass on the card pool ☆ — REVIEWED 2026-09-25, waits on his answers

> Ahoy! The current Honeycomb card pool was designed by AI, and while they went through a rework I think I've put off making a manual pass of them for too long now. Please read through the basics, then the mechanics and character story bibles. After that, please see OUTFITS-LIST.md where I go over a touch on mechanical identity.
>
> Honestly, I have no idea where to start here. I know that:
> - Some cards felt like they lacked a strong identity while playtesting, very few cards felt memorable.
> - Overall feedback is that is that there's too many nonsynergistic cards diluting the cool. We need more "glue" cards. Cards meant to bridge the archetypes together.
> - We need to actually lock costumes and ensure that the new card pool's least glue-ey, most selfish to their own sister archetype are locked with them
> - In generating their poses, Cinder and Clement came out with a much stronger "fire" identity than expected.
> - Cinder and Clement are widely regarded the weakest characters, not just in numbers but in team synergy.
> - I'd like for Cinder to move away from sundered and have some kind of burn for her status effect.
> - 15-21 starting cards in deck is a lot for a slay the spire-like
> - I'd like a similar amount of encounters per run to slay the spire, and 75 cards in each character pool in that game turned out pretty good. Granted, we have three characters instead of 1
> - I'm okay with accepting a huge slash to card pool sizes, making the sets we do have more interesting and reducing future art pass workloads.
> - Slay the Spire
>
> I think we need to take a look over the card pool as it is now. Remember, we're only doing design and plan work. I'd like you to take in the card pool and tell me what you think, don't just roll over and accept my choices immediately, but also don't glaze the current system overly either. Please take your time and avoid subagents if feasible.

**`POOL-REVIEW-02.md` is the answer**, measured on the live content. The short version: a character is
offered about 16 cards a run because rewards deal one slot per party member, so at 21 C / 11 R a common
comes round every other run and a rare almost as often as a common — the flat gradient, not the raw
count, is why nothing is memorable. Glue is structural here because two-thirds of every reward screen
belongs to characters the player may not be building. Proposed: 12 C + 8 R per character (base 6 + 2,
each alt +2 C, +1 cross-party R, +1 worn-only R), weights 85 / 15, a 15-card starting deck with a default
signature. **Blocked in practice on `../relics/` B1** (the alts are still `unlockedFromStart`). No game
code changed.

His second message, the same day:

> I'm onboard with trying out your ideas, and I'd be interested to see shere you'd take this. By the way, that final point was meant to be that Slay the Spire aims for 51 encounters, giving an idea of how much STS might leave un-shown of its card pool, just for reference.
>
> Since it dounds like they're blockinf, I'm on my phone right now, could you list out those  questions for me right here? Not sure how I feel about clement "extinguishing" flame from cinder onto enemies, sounds like it might be a very specific card that isn't settling in my head right, but I also wanna see you cook.

And his third, answering the seven questions:

> I'm with you on everything except burn. I'm just not feeling that design at all. I'd rather that the fire parallel had something to do with lust. I think I'd like to go with Heat as a status effect instead of burn. That'd keep clement's space solely in lust. Her doing HP damage at all doesn't feel thematic for me. Like, she's someone who believes in love with sin, her broken state has her ascending and seeing angels blessed with the gift of sight once again, and with this new freedom and power she... Lights her enemies on fire? I'm not feeling it. And while "I want to be broken" is Clement's thing, Cinder is probably the second closest to that space due to her theme of recklessness.
> Poison I keep meaning to make half after it activates, if it still doesn't already.
> I think it should have a different design space to poison, I also feel like it should have something to do with taking an action, I just don't have an idea I'm in love with yet, which is the biggest issue. Players are generally agreeing that lust buildup is way more dangerous than regular damage, so Cinder stepping into the self-damage space but from a different angle to Severine shouldn't make them feel too similar, still, I'm stumped, and this is a pretty important thing to figure out.

**Shape agreed (20 per character, 85 / 15, 15-card deck, one slot per member, neutrals in shops and the
boss slot, default signatures drafted for veto). Burn withdrawn.** `POOL-REVIEW-02.md` §5 is now **Heat**:
*whenever this fighter plays a card, they gain Lust equal to their Heat; loses 1 stack at the end of their
turn* — the price of recklessness paid per action, a producer for the "Lust on an ally" row the Abbess
line and Nettle's Draw Out already read, and worked-up enemies when vented onto them. Poison to
`decayMode: "halve"` is his standing instruction and is not yet applied (it reprices Nettle's appliers).

His fourth message, choosing the harsher variant and writing the rule himself:

> That harsher variant, that's it, I think that's exactly what it needs. It's the incentive for cinder to move back, it's the mechanical way players forcibly hold back Clement from breaking, it makes positioning matter the entire turn instead of just the end, it gives anastasia's golems a home in a party of 3, it lets players interact with it on their own terms unlike poison, it'd make an ability for cinder to move to the back of the party as useful as other abilities, it can be built up on characters without guarenteed payoff that would just make it feel like delayed damage. And it's even straightforward to explain. Heat: Inflicts 1 lust per stack of heat whenever the character plays a card. Players lose 1 heat whenever they are shifted towards the back of the party, or end their turn behind all other party members.

**Heat is LOCKED in his words** — `CARD-POOL-02.md` §2.1 carries the rule verbatim, his seven reasons as
requirements, and nine one-line defaults for the edge cases (paid before the card resolves; per card, not
per hit; abilities are not cards; broken forms are; per shift whatever the distance; golems count as party
members; enemies read the same sentence; it is a debuff; its Lust carries Torment). **`CARD-POOL-02.md`
§3.1 is Cinder's full list on it, drafted for his veto**: 12 C / 8 R, Sortie as the default signature, the
Ashfall passive swapped to "1 Heat at the start of her turn", twelve cuts each with a reason. Clemence next.

His fifth message, the same day — the lust tags, the fey, and the pipeline:

> I appreciate the heads up. There's a lot of housekeeping to do come friday.
> - Every type of lust we have is another bundle of scenes I'll want to do. Long or short, every new lust tag is a commitment. As such, I really, really only want Venom, Charm, Heat (it's own tag), and Clement's type. I honestly don't know how torment and exposure have lasted this long in the game without being cut yet due to how much harder we've moved towards venom and charm. I'll probably have desktop claude dummy them out. Actually, I'm writing this out of order, but given the conclusion I arrived at below, maybe rework the fey's tag from charm to exposure would be best.
> - The fey having moves that inflict Heat is probably fine, though Charm is not Heat. I also worry that heat as a status doesn't fit well with the cool tones, dazed enemies, and fairy knights/nobility you actually fight. And now that I'm thinking about it, enemies using powder that inflicts heat could maybe be misinterpreted as drug use. I think I've talked myself out of the idea.
>
> Sorry to make things complicated for you. How much of a knot is our new card design pipeline in now that we've gone back and forth so many times? With our goal being the second demo build, I was hoping for a cleaner, better organized slate this go-around.

**Three things change, all recorded in `CARD-POOL-02.md`:** Heat is **its own lust tag** (default 8
rewritten); **enemies never inflict Heat** (the Pollen Road hook is withdrawn, default 10); and the tag cut
is the first row of the Friday housekeeping table in its §5. What the roster teaches today, measured:
Venom 15 moves, Charm 15, Restraint 8, Exposure 6, Torment 0 — so Torment costs nothing to cut, Restraint
(not on his list of four) is 8 moves, and Exposure is 6 moves plus Clemence's 5 outgoing cards. **⏸ One
word from him decides the fey:** keep **Charm** (his list; the charm writing rules in `../events/IDEAS.md`
survive) or move them to **Exposure** (his afterthought; 15 moves retagged and those rules orphaned).
Recommended: Charm, on cost, unless the charm scenes are the bundle he dreads writing.

**The pipeline is not in a knot.** Every reversal replaced text rather than layering it: the brief has no
Burn in it, Heat is in his words in one place, Cinder's grid is one table, the reasoning is one review, and
the trail is this item. Two lines went stale on this message and were fixed the same hour. The rule that
keeps it that way: **statuses before grids** — Heat is locked, Poison halving is one field priced inside
Nettle's grid, Frail and Taunt were settled in session 55 — so no grid waits on a status now.

His sixth message, the same day — the tags signed off, five MUSTs, and the Brienne idea:

> Alright, I'm 100% set. I can't remember the act ABCs or titles, but the tags that will be in use for the second demo build, for sure, are:
> - Venom, primarily inflicted in act1-flora. Represents the character's chemical weakness to aphrodisiacs.
> - Exposure, primarily inflicted in act1-fey. Represents the character's interest in exhibitionism.
> - (act1-frontier should primarily focus on hp damage)
> - Heat, inflicted by the status effect of the same name. Represents the character's growing sex drive in general. Coming up with intersting ideas for these will probably be hard. Extremely important note: Heat weakness is entirely for show and unlocking lust events. Heat is entirely balanced around dealing 1 lust per turn, if we made it increase with the weakness it'd hit 2/turn instantly.
> - Penance, inflicted exclusively by Clement. Represents the character falling for the allure of sin itself. If we have other characters get Penance scenes that'll be our excuse for yuri.
>
> The tags we will leave mainly for act 2, which is beyond the second demo's scope are:
> - Charm, primarily inflicted by masculine enemies with visible genitals. This represents the characters becoming more interested in men.
> - Torment, primarily inflicted by electric attacks and spanking. This represents the characters becoming more masochistic.
> On Torment: Due to her nature as a tank, and because of her skill that caps lust at her max HP, I would like to float the idea of Brienne having a masochistic theme somewhere within her card pool. If anyone in the party should be taking lust from others, it should be her, not Clement, absolutely not Severine (players were cheesing at low levels by stalling with her incredible self-healing, for some reason we let lust soothing slip into her toolkit). If you agree, that would give Brienne essentially a sort of early access to this lust type, which would also give me a chance to see how it's recieved, and only add 3-4 more lust events to the docket. It would also greatly improve her abilities as a tank and give tHP-maxing more value. Fluff-wise this would have to be expressed as a sort of "Take it out on me, I can take it!" attitude, mechanically it could be expressed as Brienne taking other character's lust, or Brienne taking lust instead of damage. Cards could be named "Wake-Up Kiss", "Willing Target", "Big Sister Aura", "Living Stress-Relief", "Punching Bag Session", etc. Honestly, some of those are pretty bad, but not every card name needs to describe something literally happening in battle.
>
> All the existing attack names and tags that will need to change are not a huge loss. Moving closer to a shared pool of attacks (mainly to reduce the amount of owed art) will necessitate a rework of them anyways
>
> Okay, just so our ducks are all in a row, I am signing off right now that for sure 100%:
> - Poison MUST change to halve when it triggers, down from 1 per turn.
> - Act 1 enemies MUST change their attacks to exclusively use legal act 1 options. Venom, Exposure, and Heat is legal but not a focus.
> - The fey MUST change to using exposure.
> - Instances where the old Charm tag was used MUST be removed and replaced with Exposure as a theme.
> - All existing references and weaknesses to the old Charm MUST be scrubbed.
>
> Okay, with those out of the way, card pool. Sorry to take such a detour to restate what's probably obvious. What's your take on the Brienne idea? Want to explore it to give bastion an identity beyond just "big wall"?

**Filed the same hour.** The tag set and what each represents: `CARD-POOL-02.md` §2.3 and
`../designBibles/story.md` §11. The five MUSTs went verbatim to `../enemies/ENEMIES.md` **E14**
(retagging is theirs) and the tag set to `../events/EVENTS.md` **B23** (the scene bundles are
theirs). What it changed in this brief: Heat's weakness is for show and never multiplies (default 8);
enemies may inflict Heat as a legal act-1 option, never a focus (default 10); Severine's kit loses its
soothe (§3.5); Clemence's Abbess cards must carry `penance` for the yuri scenes to exist, since today they
carry nothing (§3.2); Absolution is flagged ⏸ under "not Clement". **The Brienne idea: yes, and the strand
is sketched in §3.3 for his veto** — Bastion becomes the sponge (a passive that takes half the party's
incoming Lust onto her and builds Resolve from it), with Willing Target as the base-pool glue card, Living
Stress-Relief as the damage-to-Lust conversion, Wake-Up Kiss as the party's only un-break, and Punching Bag
Session as the worn-only payoff. Every Lust she takes onto herself carries `torment`.

His seventh message, the same day:

> Good catch on absolution, the not-clement exception must go. Signing off on Severine losing any soothe, it didn't really make sense on her to begin with.
>
> I completely forgot about restraint, I have zero issues dumpstering it completely. Bondage as a whole is a design space I'm totally unfamiliar with.
>
> Good point on abbess, but counterpoint: If you have her inflict heat instead, that ties in better with her kit, and means I don't need to write so many more scenes. That actually defines the writing scope of the second demo, since it should be just for making a better act 1 experience. Lust events for each character for Venom, Exposure, Heat. Torment events for Brienne, Penance events for Clemence. This lets me defer some scenes until later, where I'll have more time to deal with them and less engine concerns. If needed mechanically for abbess to function, we can always temporarily break the heat tag standard of being only inflicted by the status and have Clement directly deal Heat lust damage until I'm ready to do Penance events.
>
> Brienne next, please.

**Settled:** Absolution loses its soothe (Clemence pays, the party heals, nobody is soothed — `CARD-POOL-02.md`
§3.2); Severine keeps no soothe (§3.4–3.6); Restraint is cut outright (§2.3, `../enemies/` E14);
**the Abbess line applies Heat to allies instead of Lust** (§3.2 and §2.1 default 11), so the party's Lust
from Clemence lands in the Heat bundle and no yuri Penance scenes are owed; the demo's writing scope is
Venom, Exposure and Heat for everyone, Torment for Brienne, Penance for Clemence (`../events/` B23).
**Brienne's full 12 C / 8 R list is drafted in §3.3** on the sponge: Kept Word graduates to the default
signature, Bastion's passive becomes Big Sister Aura, Suffer the Blows (his card) is Bastion's worn-only
rare, fifteen cuts with reasons.

His eighth message, the same day:

> Thank you, Clemence is last, I think. Anastasia's a secret character, she's effectively a playable boss, and as a character who's really appealing to play solo she doesn't break the game for being strong. Plus, very few players have unlocked her so far, and not one has given feedback since anyone going fast enough to unlock her burnt themselves out on the game for now. I'll wait, she fundamentally needs to be balanced on different axes.
> Please, go ahead.

**Nettle, Severine and Cassadora are drafted** (`CARD-POOL-02.md` §3.4–3.6), each 12 C / 8 R with a
graduated default signature (Quicken Rot, Answer in Kind, Omen), each with its cuts and reasons. Nettle is
repriced on halving (appliers about a third up; the consumers and detonators are the point) and her
Sporemother passive is proposed as the fall-spread instead of "Poison heals allies". Severine and
Cassadora lose their last soothes (Heartsblood, Warded Fate). Anastasia is outside the pass in his words
(§3.7).

His ninth message, the same day:

> Thank you! Sorry, I meant to end the Clemence line with a question mark, because I'm on mobile generally think of Clemence as the sixth character. If someone's left, please go over them too.
> And in your opinion, do you think Severine has too many statuses? It sounds like she still has marked, and I think I saw you mention sundered and weak. Weak reads as fine to me since it and her drain gives her some legs as a health tank, but if mark is still in the game, that plus sundered maybe makes her a little too self-sufficient. Getting great value out of her Claw Flurry and Drain seem less like a great way to intuitively build a team and more like things she can do every turn at this rate in any composition.

**He is right, and §3.5 is revised:** Mark Prey is cut, Pack Hunt is rebuilt as a party power (ALL allies'
attacks deal 3 more to enemies below half health) with no status on the enemy, Scent of Blood comes back
as the Huntress common, and `marked` is orphaned and deleted. She applies Weak and Siphoned and no
amplifier; her per-hit riders come from teammates now. **Clemence's grid is drafted (§3.2)**, the sixth:
Mercy graduates to the default signature, Miracle becomes "restore an ally to full", the Abbess cards apply
Heat, Absolution is rebuilt, the Devotee passive is flagged (it makes every Lust rider free), eleven cuts,
and her broken forms go from 35 to 23 with the cards. **All six are drafted.**

His tenth message, the same day:

> I'll hold off on vetoes. For neutral, let's follow Slay the Spire's precedent here as well. Neutral cards being above rate makes sense. Given they're so rare, are generally agnostic enough to play nice with each character's pool, a random neutral card ends up being mechanically more valuable than plenty of the rares, at least that's my experience.

**The neutral tier is drafted on that precedent (`CARD-POOL-02.md` §3.7):** twelve cards, 8 C / 4 R,
agnostic by construction (no private meter or status; every card reads a shared row), priced above rate
(commons at the rare rate, rares as engines or one-shots), and rare to see (every shop stocks one, the
boss's fourth slot rolls a neutral rare half the time, never an ordinary reward). Whetted Edge lands here
as the renamed rare A6 asked for; Ashen Cloak and Fence arrive from the Cinder and Cassadora cuts; Shared
Resolve comes onto rate (B26). **Vetoes are held by his choice; the brief is complete as a draft.** What
remains before Friday is his read of it, and the housekeeping table in §5.

His eleventh message, the same day:

> I'm gonna push back on you a little bit on two of these. I think Shared Resolve isn't as synergistic as you'd hope, since a small bit of tHP to the party will be peanuts to the person in front, and while tHP is generally useful, it's really not exciting when you give it to nettle and it's gone in a few turns where she wasn't even hit or could use it.
> Cool head sounds like it works specifically off heat, which is the opposite of what you described when you spoke about agnostic.
>
> I think it's okay to get tricksy here, getting a specific neutral card, even at common, won't be likely. Unless the player is playing solo, I guess, but that carries its own drawbacks. And a neutral card here can create a precedent we use for a future character. So I propose
> Possibility: 0 cost, exhaust, choose one of three rare cards to add to your hand, it costs 1 less. (Precedent for discover-like mechanics, temporary cards that are only available to you for the encounter, cost reduction, also a slay the spire card through-and-through)
> Devil's Number: 2 cost, power, whenever an ally deals exactly 6 damage, draw a card. (Sets precedent for caring about specific numbers, seems like it has anti-synergy with things like sundered but actually it makes their use more thoughtful. "Do I want to hold back on gaining strength so my basic attack deals six, or build exactly enough strength on Severine so her claw flurry deals 6?" And even if they had infinite card draw, energy is the more important target to carefully manage. Everyone can deal six aside from Clemence I think, which is flavorful since she's holy)

**Both taken.** Shared Resolve and Cool Head are out (B26's card retires; Clean Slate is the agnostic cleanse
and covers Heat), Possibility is a neutral common and Devil's Number a neutral rare (§3.7, 7 C / 5 R), and
the tier gains a fourth rule: it may pilot a mechanic a future character will own. Two defaults on his
cards for his veto: Possibility draws its three from the rares the party could be offered today, and the
pick is a this-fight copy owned by its character on the stolen-card plumbing; Devil's Number counts the
number the forecast prints on the hit, never a tick, each hit of a multi-hit on its own. Engine asks are
in §5 (a discover verb, an exact-damage hook).

**His housekeeping message, 2026-09-25**, set the second demo's gate (`../BASICS.md`, the second demo)
and names this work twice: as the *Card pool rework* pipeline, and as the first line of what the demo
needs, *"Per-character card overhaul"*. He also listed the *Test Suite Overhaul* as an early-stage blocker,
to be *"rebuilt after we can be sure all legacy content weighing us down is cut"*, which is this pass's
cuts: about 70 cards leave when the six grids land, and the suite's content-bound checks go red with them
(`../tooling/`). Nothing in this brief changed; his vetoes are still held.

---

## Unsorted — drop new reports for this pipeline here

*(a report that does not clearly belong to this pipeline goes in `../FEEDBACK.md` instead)*
