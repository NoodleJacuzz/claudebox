//===================================================================================================
//HONEYCOMB CATACOMBS -- Lust Event content
//===================================================================================================
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
//  gallery            the Event Gallery entry this row is the START of. OPT-IN, so a row with no
//                     `gallery` is playable but never replayable. `gallery: true` takes
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
//                     refought.
//                     AND A BATTLE'S ENDINGS ARE THEIR OWN TILES, read off the `startCombat` request
//                     rather than declared: one per `victoryPage`/`victoryEvent` and
//                     `defeatPage`/`defeatEvent` the scene names. Finishing the scene once unlocks both,
//                     which is what stops a win from costing the player the loss scene. A page or event
//                     with a `name` titles its own tile.
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

	//--- NETTLE, VENOM. The first authored arc in the game. -------------------------------
	//Three scenes, one per rank, written in lust_events/SCENES-01.md. Ranks 2 and 3 are reproduced
	//there and here exactly as authored.
	//
	//NEW INDICES rather than the `nettleVenom1`/`nettleVenom2` the placeholders used. A completion is
	//stored under the row's index, so reusing those names would have hidden the real scenes from every
	//profile that had already played a placeholder under them -- which is every profile that has been
	//near this feature.

	//The plainest shape: one character, one weakness, one rank. The rank IS the requirement.
	//A GALLERY START POINT, naming the other two rows as its continuation, so the arc is one tile on
	//Nettle's page and replaying it plays all three in order.
	//EACH RANK IS ITS OWN GALLERY TILE, not `partArray` parts of one scene: `partArray` is for a single
	//scene SPLIT across rows, while these are three separate scenes about three separate ranks. Linking
	//them with `partArray` would walk a replay of rank 1 straight into ranks 2 and 3.
	{
		index: "nettleVenomSpecimen", character: "nettle", tag: "venom", rank: 1, event: "nettleSpecimen",
		gallery: { name: "A vial she can't identify" },
	},

	//PART TWO. It waits for part one to have been PLAYED, not merely for the rank. No `gallery` of its
	//own: it is not a start point, and a tile for it would list part of a scene twice.
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
	//queue shapes, not scenes, and a player met them as finished content, so they were removed.
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
	//  { divider: true }   a bare `t ...` line: a rule across the panel, meaning time has passed
	//
	//THERE IS NO PLAYER IN THESE SCENES. Nothing here addresses a second person, nobody is spoken to, and
	//a button is a button rather than an action somebody takes -- which is why every one of them is a
	//plain label and none has a result line.
	//
	//RANKS 2 AND 3 REPRODUCE THE AUTHORED PROSE EXACTLY. Do not tidy it.
	{
		index: "nettleSpecimen",
		name: "{name}: Specimen",
		lustEvent: true,
		weight: 0,
		imagePath: "characters/necro/lust/v1-1",
		text: "",
		lineArray: [
			{ text: "An experiment. A simple one. The light should be burning with fire to match the constituent elements, but none she's seen before have burned this sort of pink." },
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
			{ text: "A desperate Nettle grabs the last saddlebag meant for exporting samples to various colleges across the lands." },
			{ text: "She doesn't hold much stock in them identifying the chemicals inside, but even so, she'd normally be a lot more careful handling bags like these." },
			{ speaker: "Nettle", text: "Where is it, where is it? Where the hells... Here!" },
			{ speaker: "Nettle", text: "This one makes seven of them. Seven... That's just short of the fair number for a small case study." },
			{ speaker: "Nettle", text: "But with the... T-two I used earlier..." },
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
					{ text: "Normally composed, terse, more than a little cold, a sudden warmth spreads behind her voice." },
					{ speaker: "Nettle", text: "A study needs a subject... And I'm the only subject I have..." },
					{ text: "That she has consent from, at least." },
					{ speaker: "Nettle", text: "A m-measured dose. Recorded interval. Nnnh... Recorded interval. What time is it?" },
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
					{ text: "Only three doses deep, all pretense of a formal study is lost." },
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
			{ text: "For the first time in days, the elven necromancer puffs up with joy, rather than frustration." },
			{ text: "Not only is her own batch cleaner, it's easily replicable now that she has a seed vial to grow more from." },
			{ text: "Putting aside the incredible feat of somehow managing to use necromancy algae and alien fungal spores, the part that has her most excited..." },
			{ speaker: "Nettle", text: "It's my favorite color too~" },
			{ speaker: "Nettle", text: "I worked it out. Took the long way round... But I worked it out. Mine's cleaner." },
			{ text: "The magical flame burns with confirmation, she'd \"spread\" a copy into perfectly ordinary slime goo." },
			{ speaker: "Nettle", text: "Which means I never have to go back down there. Not once. Not ever again." },
			{ speaker: "Nettle", text: "That's the upside. That's the part I should be happiest about. Nnnhh..." },
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
				//Bridges into the battle rather than jumping from her flat last line straight into a fight.
				index: "synth3",
				imagePath: "characters/necro/lust/v3-3",
				text: "",
				lineArray: [
					{ speaker: "Nettle", text: "... It's not as strong." },
					{ text: "Dread and horror fill her voice and mind." },
					{ text: "In the neighboring rooms, patrons would go on to feeling a sudden chill in the air, before a scream of pure rage that rattled the shingles." },
					{ divider: true },
					{ text: "She ventured into the dungeon once more, and it didn't take long to find what she was looking for." },
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
			//Raised from the dead reads with no gore, no blood and no decomposition -- the same as if she
			//had knocked it out and woken it up working for her.
			{
				index: "synthWon",
				name: "Extraction",
				imagePath: "characters/necro/lust/v3win-1",
				text: "",
				lineArray: [
					{ text: "It was a very, very good thing the creature was a monster of pure instinct." },
					{ speaker: "Nettle", text: "Up. There we are. Nothing's missing, you're perfectly fine, you're just mine now." },
					{ text: "To have been killed and resurrected so quickly, it's like the beast's heart never stopped pumping." },
					{ speaker: "Nettle", text: "... Do you have a heart, actually? Well, I guess it doesn't matter. This is the only part of you that matters." },
					{ speaker: "Nettle", text: "Geh-shihihi~ This is the part my \"collegues\" in the field never bother writing down." },
					{ speaker: "Nettle", text: "Ah, so well behaved. Hold still. This won't- hhh- Well, it might hurt, but this won't take anything you'll miss." },
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
					{ text: "Stunned silence and a torrent of addictive slime." },
					{ speaker: "Nettle", text: "That's... That's considerably more than you should be able to give. Even with my magic, what..." },
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
					{ speaker: "Nettle", text: "Fffuck! FUCK! I've had the distilled stuff slide down my throat, poured it over my cunt, what will it be like when you-" },
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
					{ text: "The floating skull, meant as a companion, mana storage, and icon of status, merely follows its master." },
					{ speaker: "Nettle", text: "They must want me to spread them. It's gravid. That's the word for it. They put some <i>thing</i> in me and it's g-gravid." },
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
					{ speaker: "Nettle", text: "B-but if they think I'll just let them have their way with me, they have another thing c-coming." },
					{ speaker: "Nettle", text: "These disgusting chil-" },
					{ text: "She catches herself." },
					{ speaker: "Nettle", text: "Parasites. These parasites are a resource." },
					{ speaker: "Nettle", text: "The base was always the problem... And now I have hhh... Quite a lot of materials for my next attempt." },
					{ speaker: "Nettle", text: "The next batch will be better. Even better than what they can give me." },
					{ text: "You've met with a tragic fate, and the heroine of the story is trapped in a spiral of lust." },
					{ text: "Better luck next time." },
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
		//THE DEFAULT RETURN from a Lust Battle, won or lost: an event that just says "Lust Event Cleared!"
		//and returns to the teambuilding menu with the rank-up cleared. Opened showing its text as the
		//result, so its only button is the way out.
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
//only ever fought by name. bogToad stands in because the enemy pass is giving it tentacles, which
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
