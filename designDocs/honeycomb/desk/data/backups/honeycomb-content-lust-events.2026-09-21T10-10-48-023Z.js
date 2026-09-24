//===================================================================================================
//HONEYCOMB CATACOMBS -- Lust Event content (round 06 item 14; the QUEUE, session 48)
//===================================================================================================
//> I'd have a list of mandatory lust events and their requirements. If the player meets these requirements
//> and doesn't have the event completed in their savedata, the character is locked and a lust event is
//> ready to be played.
//
//ONE TABLE: honeycomb.lustEventQueueArray. Every Lust Event in the game is a row in it. A row is owed to a
//character when its requirements pass and its index is not in the profile's completed list; the character
//is then locked out of the party until the head of their queue has been played. Rows are offered in the
//order they are written here, so this table IS the running order of the game's narrative.
//
//Nothing is decided at the moment a rank is crossed, so a row added today fires for a profile that passed
//its requirement months ago. Writing a scene late strands nobody.
//
//  index              the row's stable name, and the key the completion is stored under. RENAMING a row
//                     offers it again from scratch; replacing the `event` under the same name does not.
//  character          one character index, an array of them, or "any" for every unlocked character. A row
//                     that reaches more than one is completed per character.
//  event              the honeycomb.eventArray entry that plays.
//  tag                optional: the weakness the scene is about. Fills {tag} in its text, and is what
//                     `gainWeakness: {tag: "eventTag"}` grows.
//  rank               optional: the rank of that weakness. Fills {rank}, and IMPLIES the requirement that
//                     the weakness has reached it -- so the usual "Nettle, venom, rank 2" row needs no
//                     requirementArray at all.
//  requirementArray   conditions, all of which must pass, with the row's character as the subject. ANDed
//                     on top of the implied rank requirement.
//  locksParty         false to let the row wait in the queue without benching the character. Default true.
//  gallery            the Event Gallery entry this row is the START of (session 49). OPT-IN, on Noodle's
//                     call -- "We want to save the start points of events, and only the start points" --
//                     so a row with no `gallery` is playable but never replayable. `gallery: true` takes
//                     every default; a block overrides them:
//                       name            the tile's title. Default: the event's name, with {name}/{tag}/{rank} filled
//                       characterArray  EXTRA characters whose pages show it. The row's own are always in --
//                                       this is how a two-hander appears on both of their pages
//                       sortOrder       its place in its block. Default: this row's position in the queue
//                       imagePath       the tile's art. Default: the event's imagePath, then backgroundPath
//                       partArray       the later rows this scene continues into, in order. A replay plays
//                                       them one after another, so a multi-part scene is ONE tile
//                     A replayed scene PAYS nothing -- no experience, no weakness, no unlock, no cost, no
//                     discovery, no completion -- but it still DOES the scene, so a Lust Battle in it is
//                     refought. Noodle: "I really do need to be able to replay lust battles."
//                     AND A BATTLE'S ENDINGS ARE THEIR OWN TILES, read off the `startCombat` request
//                     rather than declared: one per `victoryPage`/`victoryEvent` and
//                     `defeatPage`/`defeatEvent` the scene names. Finishing the scene once unlocks both,
//                     which is what stops a win from costing the player the loss scene -- "I want to
//                     have win and loss events as separate things, which means if you win it you can't
//                     see the loss event." A page or event with a `name` titles its own tile.
//                     See honeycomb-gallery.js.
//
//THE REQUIREMENT VOCABULARY. Any condition works here; these are the ones written for it:
//  {index: "weaknessRank", tag, atLeast, character}      the rank a weakness has reached
//  {index: "lustEventDone", entry | entryArray}          another row has been played -- MULTI-PART EVENTS
//  {index: "lustEventCount", tag, character, atLeast}    how many have been played, in a category
//  {index: "allOf" / "anyOf", conditionArray}            and every other condition in the game
//Add `invert: true` to any of them.
//
//THE EVENTS are ordinary entries in honeycomb.eventArray (weight 0, so a map node never rolls them),
//opened from teambuilding by the engine in honeycomb-lust-events.js. Anything an event can do, a Lust
//Event can do, plus:
//
//  {name} {tag} {rank}   in any text: the character, and the row's weakness and rank
//  speakerIsSubject      the character stands down the side of the screen as the speaker
//  keepsEventReady       on a CHOICE: leaving the event afterwards does not complete the row, so it comes
//                        straight back to the head of the queue -- the "not tonight" door
//  startCombat           a LUST BATTLE: `partyArray` (character indices, "subject" for the row's character;
//                        default tuning.lustEvents.defaultBattlePartyArray) and `victoryPage` / `defeatPage`,
//                        or `victoryEvent` / `defeatEvent`, else the "Lust Event Cleared!" event
//  effects               gainWeakness {tag ("eventTag" = the row's own), amount}, gainPersonalExperience
//                        {amount}, unlock {kind: outfit / equipment / character / tab, unlock} -- each acting
//                        on the row's character unless it names `character`
//
//THE WRITING BELOW IS PLACEHOLDER. It exists to prove every path the brief asks for (an event that stays
//ready, a battle with a page for each outcome, weakness, experience and an unlock) and is written to be
//replaced.
window.honeycomb = window.honeycomb || {};

//---------------------------------------------------------------------------------------------------
//THE QUEUE
//---------------------------------------------------------------------------------------------------
honeycomb.lustEventQueueArray = [
	//Example rows, pointing at the placeholder events below. Replace freely.

	//--- NETTLE, VENOM. The first authored arc in the game, session 49. -------------------------------
	//Three scenes, one per rank, written in lust_events/SCENES-01.md. Ranks 2 and 3 are Noodle's own
	//prose and are reproduced there and here exactly as he wrote them.
	//
	//NEW INDICES rather than the `nettleVenom1`/`nettleVenom2` the placeholders used. A completion is
	//stored under the row's index, so reusing those names would have hidden the real scenes from every
	//profile that had already played a placeholder under them -- which is every profile that has been
	//near this feature.

	//The plainest shape: one character, one weakness, one rank. The rank IS the requirement.
	//A GALLERY START POINT, naming the other two rows as its continuation, so the arc is one tile on
	//Nettle's page and replaying it plays all three in order.
	//EACH RANK IS ITS OWN GALLERY TILE. It was written as one tile with the other two as `partArray`
	//parts, copying the placeholder -- which was wrong: `partArray` is for a single scene SPLIT across
	//rows, and these are three separate scenes about three separate ranks. The effect in play was that
	//replaying rank 1 walked straight on into ranks 2 and 3 when you tried to leave it.
	{
		index: "nettleVenomSpecimen", character: "nettle", tag: "venom", rank: 1, event: "nettleSpecimen",
		gallery: { name: "A vial she can't identify" },
	},

	//PART TWO. It waits for part one to have been PLAYED, not merely for the rank -- which is the thing
	//the old rank-keyed system could not express. No `gallery` of its own: it is not a start point, and
	//a tile for it would list part of a scene twice.
	{
		index: "nettleVenomMethodology", character: "nettle", tag: "venom", rank: 2, event: "nettleMethodology",
		requirementArray: [{ index: "lustEventDone", entry: "nettleVenomSpecimen" }],
		gallery: { name: "Methodology" },
	},

	//PART THREE, and the Lust Battle. Its two endings are their own gallery tiles, read off the
	//`startCombat` request rather than declared here -- finishing the scene once unlocks both, so
	//winning never costs the player the loss scene.
	{
		index: "nettleVenomSynthesis", character: "nettle", tag: "venom", rank: 3, event: "nettleSynthesis",
		requirementArray: [{ index: "lustEventDone", entry: "nettleVenomMethodology" }],
		gallery: { name: "Synthesis" },
	},

	//NOTHING ELSE IS WRITTEN YET, and the queue says so rather than padding itself out. The placeholder
	//rows that used to sit here (a roster-wide fan-out and a story-progress row) were demonstrations of
	//queue shapes, not scenes, and a player met them as finished content. Noodle, session 50: "we really
	//need to cut the placeholder events out of the game. We want to accept Nettle is the only one done on
	//time, and only one of her two lusts."
	//
	//The shapes they proved are all still documented at the top of this file and in
	//lust_events/AUTHORING.md; what is gone is only their presence in a player's game.
];

//---------------------------------------------------------------------------------------------------
//Events
//---------------------------------------------------------------------------------------------------
honeycomb.lustEventContentArray = [
	//===============================================================================================
	//NETTLE -- VENOM. Three scenes, one per rank. lust_events/SCENES-01.md.
	//===============================================================================================
	//A BEAT IS A PAGE and every page carries its own `imagePath`. The image delivers the beat and the
	//lines catch up to it, so nothing describes the picture it is standing next to.
	//
	//THREE KINDS OF LINE, drawn as three different things (honeycomb.eventOverlay.renderDialogue):
	//  { speaker, text }   speech -- portrait, name plate, box
	//  { text }            narration -- the `t` line of the scene format
	//  { divider: true }   Noodle's bare `t ...`: a rule across the panel, meaning time has passed
	//
	//THERE IS NO PLAYER IN THESE SCENES. Noodle: "I am not a character in this story." Nothing here
	//addresses a second person, nobody is spoken to, and a button is a button rather than an action
	//somebody takes -- which is why every one of them is a plain label and none has a result line.
	//
	//RANKS 2 AND 3 ARE NOODLE'S OWN PROSE, reproduced exactly. Do not tidy it.
	{
		index: "nettleSpecimen",
		name: "{name}: Specimen",
		lustEvent: true,
		weight: 0,
		imagePath: "characters/necro/lust/v1-1",
		text: "",
		lineArray: [
			{ text: "She holds the vial to the lamp." },
			{ speaker: "Nettle", text: "Don't touch it. I haven't finished with it... And you won't enjoy what it does." },
			{ speaker: "Nettle", text: "It isn't a spore. It isn't a resin... It isn't anything I have a word for." },
			{ speaker: "Nettle", text: "...What are you? You're not like anyone from around here. Not one bit." },
			{ divider: true },
		],
		choiceArray: [
			{ index: "later", text: "Later...", goToPage: "specimen2", previewText: "Time passes." },
		],
		pageArray: [
			{
				index: "specimen2",
				imagePath: "characters/necro/lust/v1-2",
				text: "",
				lineArray: [
					{ speaker: "Nettle", text: "I opened it? Why did I... No. N-no, obviously it needed to be opened." },
					{ speaker: "Nettle", text: "How else would I study it. That's- nnnh- that's just method. That's just method." },
					{ speaker: "Nettle", text: "...I'll need a bigger sample. Of me. I'll need a bigger sample of me." },
				],
				choiceArray: [
					{ index: "end", text: "Continue", effectArray: [{ index: "gainPersonalExperience", amount: 20 }] },
				],
			},
		],
	},
	{
		index: "nettleMethodology",
		name: "{name}: Methodology",
		lustEvent: true,
		weight: 0,
		imagePath: "characters/necro/lust/v2-1",
		text: "",
		lineArray: [
			{ speaker: "Nettle", text: "Where is it, where is it? Where the hells... Here!" },
			{ speaker: "Nettle", text: "The last one. Seven of them, that's a sample size." },
			{ speaker: "Nettle", text: "That's not a habit, that's a s-sample size." },
		],
		choiceArray: [
			{ index: "on", text: "Continue", goToPage: "method2", previewText: "The scene goes on." },
		],
		pageArray: [
			{
				index: "method2",
				imagePath: "characters/necro/lust/v2-2",
				text: "",
				lineArray: [
					{ speaker: "Nettle", text: "A control needs a subject... And I'm the only subject I have consent from." },
					{ speaker: "Nettle", text: "Measured dose. Recorded interval. Nnnh... Recorded interval. I said it, I heard me." },
					{ speaker: "Nettle", text: "It's still fresh, too... Nothing down there rots like normal fungi..." },
					{ divider: true },
				],
				choiceArray: [
					{ index: "later", text: "Later...", goToPage: "method3", previewText: "Time passes." },
				],
			},
			{
				index: "method3",
				imagePath: "characters/necro/lust/v2-3",
				text: "",
				lineArray: [
					{ speaker: "Nettle", text: "OHHHHHHHH~!" },
					{ speaker: "Nettle", text: "Intensity increasing! I'm not building a tolerance, it's changing-<br>It's changing <i>me</i>-!" },
					{ speaker: "Nettle", text: "GNHHHHH~!" },
					{ speaker: "Nettle", text: "... Six left." },
				],
				choiceArray: [
					{
						index: "end", text: "Continue",
						effectArray: [
							{ index: "gainWeakness", tag: "eventTag", amount: 3 },
							{ index: "gainPersonalExperience", amount: 40 },
						],
					},
				],
			},
		],
	},
	{
		index: "nettleSynthesis",
		name: "{name}: Synthesis",
		lustEvent: true,
		weight: 0,
		imagePath: "characters/necro/lust/v3-1",
		text: "",
		lineArray: [
			{ text: "Her own batch is a better colour." },
			{ speaker: "Nettle", text: "I worked it out. Took the long way round... But I worked it out. Mine's cleaner." },
			{ speaker: "Nettle", text: "Which means I never have to go back down there. Not once. Not ever again." },
			{ speaker: "Nettle", text: "That's the useful part. That's the part I should be pleased about. Nnnhh..." },
			{ speaker: "Nettle", text: "T-that's the part I keep turning over, actually. That I don't have to..." },
		],
		choiceArray: [
			{ index: "on", text: "Continue", goToPage: "synth2", previewText: "The scene goes on." },
		],
		pageArray: [
			{
				index: "synth2",
				imagePath: "characters/necro/lust/v3-2",
				text: "",
				lineArray: [
					{ speaker: "Nettle", text: "Ghouhhh... They're hitting me again..." },
					{ speaker: "Nettle", text: "I need this for testing, for replication. I can make more, so long as I... I don't need it." },
					{ speaker: "Nettle", text: "..." },
					{ speaker: "Nettle", text: "Fuck it. I can do it again." },
					{ text: "The sounds that follow are a quick *pop*, a *gulp*, and then... Silence." },
				],
				choiceArray: [
					{ index: "on", text: "Continue", goToPage: "synth3", previewText: "The scene goes on." },
				],
			},
			{
				//The run-up to the battle is Noodle's, written after playing it: the scene used to jump
				//from her flat last line straight into a fight with nothing between them.
				index: "synth3",
				imagePath: "characters/necro/lust/v3-3",
				text: "",
				lineArray: [
					{ speaker: "Nettle", text: "... It's worse." },
					{ text: "Dread and horror fill her voice." },
					{ text: "She isn't strong enough." },
					{ divider: true },
					{ text: "She ventured into the dungeon, and it didn't take long to find what she was looking for." },
				],
				choiceArray: [
					{
						index: "battle", text: "Continue",
						previewText: "A Lust Battle: {name} fights alone.",
						effectArray: [{
							index: "startCombat", encounter: "nettleVenomBattle", partyArray: ["subject"],
							victoryPage: "synthWon", defeatPage: "synthLost",
						}],
					},
				],
			},
			//--- THE WIN. Four beats. ------------------------------------------------------------------
			//Noodle's note: raised from the dead, but no gore, no blood and no decomposition -- the same
			//as if she had knocked it out and woken it up working for her.
			{
				index: "synthWon",
				name: "Extraction",
				imagePath: "characters/necro/lust/v3win-1",
				text: "",
				lineArray: [
					{ speaker: "Nettle", text: "Up. There we are. Nothing's missing, you're perfectly fine, you're just mine now." },
					{ speaker: "Nettle", text: "This is the part my field never writes down. Dead things are so much easier to ask." },
					{ speaker: "Nettle", text: "Hold still. This won't- hhh- this won't take anything you'll miss." },
					{ speaker: "Nettle", text: "Squirt harder, your mistress-" },
				],
				choiceArray: [
					{ index: "on", text: "Continue", goToPage: "synthWon2", previewText: "The scene goes on." },
				],
			},
			{
				index: "synthWon2",
				imagePath: "characters/necro/lust/v3win-2",
				text: "",
				lineArray: [
					{ speaker: "Nettle", text: "That's... That's considerably more than you should be able to give." },
					{ speaker: "Nettle", text: "Nnnh- keep going. Keep going, I've got more vials, I've got so m-many more vials-" },
					{ speaker: "Nettle", text: "... W-where's my bag?" },
					{ divider: true },
				],
				choiceArray: [
					{ index: "later", text: "Later...", goToPage: "synthWon3", previewText: "Time passes." },
				],
			},
			{
				index: "synthWon3",
				imagePath: "characters/necro/lust/v3win-3",
				text: "",
				lineArray: [
					{ speaker: "Nettle", text: "Ghnnn~! You... Can do more! Harder!" },
					{ speaker: "Nettle", text: "Fffuck! FUCK! Going down my throat, pouring it on my cunt, what willl it be like when you-" },
					{ speaker: "Nettle", text: "...!!!" },
				],
				choiceArray: [
					{ index: "on", text: "Continue", goToPage: "synthWon4", previewText: "The scene goes on." },
				],
			},
			{
				index: "synthWon4",
				imagePath: "characters/necro/lust/v3win-4",
				text: "",
				lineArray: [
					{ text: "Fin." },
				],
				choiceArray: [
					{ index: "end", text: "Continue", effectArray: [{ index: "gainPersonalExperience", amount: 80 }] },
				],
			},
			//--- THE LOSS. Two beats, and it is not a punishment. --------------------------------------
			//She comes back with more material than she went in with, which is what makes it worse.
			{
				index: "synthLost",
				name: "Marked",
				imagePath: "characters/necro/lust/v3loss-1",
				text: "",
				lineArray: [
					{ speaker: "Nettle", text: "Don't. Don't look at me like that, I don't know how I got out either." },
					{ speaker: "Nettle", text: "It's gravid. They must want me to spread them... That's the word for it. They put something in me and it's g-gravid." },
				],
				choiceArray: [
					{ index: "on", text: "Continue", goToPage: "synthLost2", previewText: "The scene goes on." },
				],
			},
			{
				index: "synthLost2",
				imagePath: "characters/necro/lust/v3loss-2",
				text: "",
				lineArray: [
					{ speaker: "Nettle", text: "Parasites are a resource. Parasites are a very well documented resource." },
					{ speaker: "Nettle", text: "The base was always the problem... And now I have hhh... Quite a lot of base." },
					{ speaker: "Nettle", text: "...Next batch will be better. Next batch will be much better." },
				],
				choiceArray: [
					{
						index: "end", text: "Continue",
						effectArray: [
							{ index: "gainWeakness", tag: "eventTag", amount: 4 },
							{ index: "gainPersonalExperience", amount: 60 },
						],
					},
				],
			},
		],
	},
	{
		//THE DEFAULT RETURN from a Lust Battle, won or lost. Noodle: "The default case for both should be an
		//event just saying 'Lust Event Cleared!' which returns you to the teambuilding menu with the rank-up
		//cleared." Opened showing its text as the result, so its only button is the way out.
		index: "lustEventCleared",
		name: "Lust Event Cleared!",
		text: "Lust Event Cleared!",
		lustEvent: true,
		speakerIsSubject: true,
		discovery: false,
		weight: 0,
		choiceArray: [],
	},
];

//---------------------------------------------------------------------------------------------------
//The Lust Battle encounter
//---------------------------------------------------------------------------------------------------
//Declared HERE rather than in honeycomb-content-enemies.js, which the enemy pass owns. It is a fixture
//for one scene and it belongs beside that scene; content-enemies.js loads first, so pushing onto its
//table is safe.
//
//`weight: 0` plus `testFixture: true` is the shape loneSporeling uses: never rolled onto a map node,
//only ever fought by name. Noodle picked bogToad because the enemy pass is giving it tentacles, which
//is what Nettle's venom 3 asks for -- until that art lands the fight is correct and the picture is not.
honeycomb.encounterArray.push({
	index: "nettleVenomBattle",
	name: "Something In The Bolete Hollow",
	tier: "early",
	weight: 0,
	testFixture: true,
	enemyIndexArray: ["bogToad"],
});

//Added in place, so anything already holding the event table sees them.
Array.prototype.push.apply(honeycomb.eventArray, honeycomb.lustEventContentArray);
