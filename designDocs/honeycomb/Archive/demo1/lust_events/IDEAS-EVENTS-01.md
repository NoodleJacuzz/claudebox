# Party and progress events — IDEAS, round 01

**This is the idea stage for the 18 map events that have nothing written.** `IDEAS.md` §6 holds the
grid for the 14 party events and §7 holds the 6 progress events. PV1 (the tentacle pit) and GV1
(Nettle and Brienne) are yours and already have a shape, so this file covers the other eighteen.

**These are not Lust Events.** They are ordinary `honeycomb.eventArray` entries with a real `weight`,
so they come up on map nodes during a run, and the lust event queue never touches them. `IDEAS.md` §6
has the full description of how one is built. The short version:

| Part | What it is |
|---|---|
| **The gate** | The character is in the party, and it is the right act. Nothing else. |
| **Low version** | Her weakness is below the threshold. She handles the problem competently, and the player learns that this hazard exists. |
| **High version** | Her weakness is at or above the threshold. She turns down the way out she took last time, on purpose. |
| **The cost** | The high version costs more than the low one. It is not a punishment. She gets what she wanted and pays for it. |
| **One entry, two branches** | `choice.condition` decides which choices are offered, so the low and high versions are the same event and a player who sees both watches it change on them. |

**About the costs.** `gainWeakness` and `removeCardFromDeck` both exist as effects — I checked
`honeycomb-effects.js` and the content files. `loseRelic` does not exist, which matches what
`IDEAS.md` §8 says. So every event below charges **more weakness at ranks 1 and 2, and a random card
at rank 3**, split with `weaknessRank atLeast 3`. That split is there because your point about rank 3
is right: once she is maxed out the exposure number keeps rising but the rank does not, so more
weakness costs a rank 3 character nothing at all.

Each card cost below comes with a short reason for why the card is gone. A card disappearing with no
explanation feels like the game taking something from the player. A card disappearing because she put
it down and walked off feels like something she did.

---

# VENOM — §6, six events

*PV1, the tentacle pit, is yours and is not repeated here.*

### PV2 · Brienne · A1-B — something gets inside the plate

**The hazard.** She takes a burst at close range and some of it gets in somewhere that armour does not
come off quickly.

**Low version.** She deals with it immediately. She strips the piece off in the corridor while
everyone waits, and nobody comments. She is not embarrassed about it. She is annoyed about the strap.

**High version.** She finishes the fight in it first. She says it can wait, and it clearly cannot. Then
she sends everyone on ahead and takes her time about it.

**What it costs.** Ranks 1 and 2, more venom. Rank 3, a random card — she caught up with the party
without half the kit she set down, and did not go back for it.

**The one world detail.** She notes that the piece it got into was built to stop much worse things than
this, and that whoever made it clearly never thought about spray.

### PV3 · Severine · A1-B — a kill that has obviously been drinking the sap

**The hazard.** Something down here is full of the stuff, and she finds that out the direct way.

**Low version.** She spits it out and complains about the quality at length. It is theatrical, it is
wasteful, and it is over in a minute.

**High version.** She finishes it, decides it was excellent, and goes looking for another one like it.
The party waits for her. She is not in any danger and she is having the best afternoon of the run.

**What it costs.** Ranks 1 and 2, more venom. Rank 3, a random card — she traded something out of her
kit to a teammate so she had a hand free, and she is vague about what it was.

**The one world detail.** She can taste where a creature has been feeding. This one has been somewhere
she cannot place, and she has been everywhere.

### PV4 · Cassadora · A1-B — she sees the trap a moment before it goes off

**The hazard.** A pressure-triggered spray, and about four seconds of warning that only she gets.

**Low version.** She warns the party and everyone steps back. She is on the clock for this, so it is
ornate and she is a little smug about it.

**High version.** She times it so that she is the only one standing in it. Nobody else works out that
she did it deliberately. Afterwards she is off duty and short about why she did not call it.

**What it costs.** Ranks 1 and 2, more venom. Rank 3, a random card — she put something down in order
to be in the right place at the right time, and did not pick it up again.

**The one world detail.** She knew where the trap was and not what was in it. She says so once and does
not expand on it.

### PV5 · Cinder · A1-1 — something she has been told not to touch

**The hazard.** A growth the party has been specifically warned about, sitting there being a dare.

**Low version.** She touches it once for the dare, gets a faceful, and counts that as a win because she
called the shot before she did it.

**High version.** She goes back to beat her score. She has a number in her head from last time and she
explains the whole scoring system while she is doing it.

**What it costs.** Ranks 1 and 2, more venom. Rank 3, a random card — she left something wedged in the
thing as a marker for next time.

**The one world detail.** She describes what it looks like from two inches away. She gets it slightly
wrong, and nobody can correct her, because nobody else has been that close to one.

### PV6 · Clemence · A1-B — a teammate takes a hit she could have taken

**The hazard.** A spray that lands on whoever happens to be standing in the wrong place, and she has
opinions about who that ought to be.

**Low version.** She takes the next one. She steps into it calmly and the teammate does not quite
register that it was on purpose.

**High version.** She takes it before it lands on anybody — she moves early, into a hit that had not
happened yet — and she is completely calm about having done so.

**What it costs.** Ranks 1 and 2, more venom. Rank 3, a random card — she gave something to the
teammate she stepped in front of, as though she were settling an account.

**The one world detail.** She knows exactly how much each member of the party is already carrying,
because she has been keeping track since the first descent.

### PV7 · Anastasia · *hidden* — written, never advertised

**The hazard.** Something she recognises straight away and does not name.

**Low version.** She has dealt with it before anyone else notices there was anything to deal with, and
she is cheerful about it.

**High version.** She does not deal with it, on purpose, and she is just as cheerful. The difference
between the two versions is the only thing in the event that tells the player anything.

**What it costs.** The same split. The rank 3 card is one she hands to somebody else.

**The one world detail.** She compares it to something. The thing she compares it to does not exist in
this world. Nobody asks her about it.

---

# CHARM — §6, seven events

**The test for all seven is the same as for the charm scenes: she did it, she meant it, and she does
not think it was strange.** The high version is never her failing to resist. It is her not having a
reason not to. The banned word list is in `IDEAS.md` §4 and it applies here too.

### PC1 · Brienne · A1-C — a hot spring, or something close enough

**Low version.** She keeps her kit on and takes the watch, because somebody has to and she is the
obvious person. She is a little regretful about it and very firm about it.

**High version.** She does not keep her kit on, and she explains it as being about airflow, and the
explanation is a good one. She still takes the watch.

**What it costs.** Ranks 1 and 2, more charm. Rank 3, a random card — not everything she took off came
back with her, and she has not noticed which piece is missing.

**The one world detail.** The water is warm and there is nothing underneath it that should be making it
warm.

### PC2 · Nettle · A1-C — a fey circle she could reproduce if she tried

**Low version.** She makes a note of it, as much as the game can show of her noting anything, and walks
on. There is a dungeon on and she is not stupid.

**High version.** She tries it. It works. Something else works too, and she records that with exactly
the same amount of interest as the first result.

**What it costs.** Ranks 1 and 2, more charm. Rank 3, a random card — the working needed a component
and she had one on her.

**The one world detail.** The circle is made out of something growing, and it is growing in a shape
that nothing grows in.

### PC3 · Cinder · A1-C — a fey offers her a dare

**Low version.** She takes it and wins, loudly. The fey is delighted, and she is delighted that the fey
is delighted.

**High version.** She takes the next one as well, and then sets the one after that. She thinks that
means she is winning. It is the first time anyone in the party has watched her be handed the initiative
and mistake it for having taken it.

**What it costs.** Ranks 1 and 2, more charm. Rank 3, a random card — she put something up as a stake.

**The one world detail.** The fey are not keeping score. She is keeping score for both of them, and
they find that charming.

### PC4 · Cassadora · A1-C — she sees herself agree to something four seconds early

**Low version.** She does not agree. She watches herself agree, declines anyway, and is visibly pleased
to have beaten the reading.

**High version.** She agrees, specifically in order to find out what the other version of her knew. The
one who said yes had information she does not have, and she wants it.

**What it costs.** Ranks 1 and 2, more charm. Rank 3, a random card — the agreement had a price and she
paid it.

**The one world detail.** She can see the yes. She cannot see the terms, she has never been able to see
terms, and she has never said why.

### PC5 · Clemence · A1-C — a fey with an argument she finds sound

**Low version.** She enjoys the debate enormously, wins about half of it, and leaves — having conceded
one small point that she does not think matters.

**High version.** She concedes the point properly, and then acts on it, because in her view holding a
position and not acting on it would be the actual sin.

**What it costs.** Ranks 1 and 2, more charm. Rank 3, a random card — she gave something to the fey.
It was the conclusion of the argument rather than a price for anything.

**The one world detail.** The fey has heard that argument before, from somebody else, and says so.

### PC6 · Severine · A1-C — fey hospitality, offered to a noble who understands hospitality

**Low version.** She accepts exactly one thing. Accepting nothing would be an insult and accepting
everything would be beneath her, so one thing is the correct answer and she gives it.

**High version.** She accepts everything, and then returns the favour on the same scale, because
hospitality creates a debt and she does not carry debts.

**What it costs.** Ranks 1 and 2, more charm. Rank 3, a random card — what she gave back came out of
her own kit, and she thinks the trade flattered her.

**The one world detail.** Fey hospitality has rules and she recognises them. The rules she recognises
them from are not human ones.

### PC7 · Anastasia · *hidden* — written, never advertised

**Low version.** She declines politely and the fey take it well, which is not how that normally goes.

**High version.** She accepts, and the fey take that well too. The two facts together are the event.

**What it costs.** The same split.

**The one world detail.** She and the fey are clearly on familiar terms, and neither side treats that
as worth remarking on.

---

# PROGRESS EVENTS — §7, five events

These need **both characters in the party, both at or above the rank, and the right act**, so they are
rare by design. Running into one should feel like finding something.

**They usually cost nothing.** They are the reward for having built the ledger up in the first place,
and charging for that would undo the point. The tone is practical and warm. Nobody is rescued and
nobody is caught doing anything.

*GV1, Nettle and Brienne, is yours and is not repeated here.*

### GV2 · Severine + Cinder · A1-B

**Who notices.** Severine. She recognises what chasing a high looks like because she has done it, at
length, and enjoyed it.

**The offer.** To supervise the attempt. That makes it considerably worse and considerably safer at the
same time, and they both know it.

**What makes it land.** Severine never considers talking her out of it. She is making sure it goes
well.

**What it costs.** Nothing. Cinder comes out of it better off and does not look into why.

**The one world detail.** Two people who have both chased it compare what they were chasing, and their
descriptions do not match.

### GV3 · Cassadora + Clemence · A1-B

**Who notices.** Cassadora. She stopped checking her own futures, so she recognises somebody else doing
the same arithmetic. She knows the look because she has worn it.

**The offer.** To tell Clemence what is about to happen. That is the one thing Clemence cannot get for
herself, and it is the one thing Cassadora has stopped getting for herself.

**What makes it land.** Clemence does not need rescuing and Cassadora does not offer to rescue her. She
offers information. Clemence takes it and uses it to go further, and Cassadora knew that would happen
when she offered.

**What it costs.** Nothing.

**The one world detail.** Cassadora will say what happens and not what it is. Clemence does not ask
what it is, which is the most interesting thing either of them does in the scene.

### GC1 · Clemence + Nettle · A1-C — the yuri thread

**Who notices.** Clemence. Noticing what somebody is carrying is what she does, and Nettle has stopped
noticing things about herself.

**The offer.** She tells her, gently, and makes the case for not minding. No pressure is applied
anywhere in the scene, which is why it works.

**What makes it land.** Nettle's first reaction is to treat it as a piece of data she had missed. That
is funnier and sadder than being upset would have been, and Clemence lets her have it that way.

**What it costs.** Nothing.

**The one world detail.** Nettle can describe what fey magic is doing to her hands and not what it is
doing to her judgement. She notices that she cannot, and finds it interesting rather than alarming.

### GC2 · Brienne + Severine · A1-C

**Who notices.** Severine. She has watched somebody's sense of normal move before, at length, on
purpose, in her own house.

**The offer.** To be the one who tells Brienne when she has gone too far. She never does tell her. She
is not lying when she offers, she simply has a very different idea of what too far means, and they both
find that out slowly.

**What makes it land.** Brienne accepts gratefully and with real relief. Having a limit that somebody
else is holding for her is the most comfortable arrangement she has been offered all run.

**What it costs.** Nothing, and that is the joke.

**The one world detail.** Severine says where she learned to watch for it. She does not say who she was
watching.

### GC3 · Cinder + Cassadora · A1-C

**Who notices.** Cassadora. She has already seen which dare Cinder takes next.

**The offer.** Not to tell her. This is the only event in this file where the gift is somebody
withholding something.

**What makes it land.** Cinder would normally demand to know, and agrees anyway, because knowing would
spoil it. It is the first time she has valued not winning.

**What it costs.** Nothing.

**The one world detail.** Cassadora admits she has been looking at futures she has no professional
reason to look at, and moves straight on.

---

## Things to decide

1. **Every rank 3 cost in this file is a random card, twelve times over.** That is thin. `loseRelic`
   (`IDEAS.md` §8) would give a second option, and a relic is the thing a rank 3 player would actually
   feel losing. Until that effect exists, the short fictional reason attached to each card is doing all
   the work of making twelve identical costs feel different.
2. **Nothing here says what the player gains from the high version.** §6 says the reward is her getting
   what she wanted, which is a story reward rather than a mechanical one. That might be enough. If it
   is not, the high branch needs a card, a relic or a heal attached to it, or it will read as a straight
   tax for picking the interesting option.
3. **PV7 and PC7 are Anastasia**, so they cannot be counted or listed anywhere the player can see.
4. **GC2 makes things worse on purpose and charges nothing.** That may put it outside what §7 says
   progress events are for, which is rewarding the player for progress.
