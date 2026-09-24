//===================================================================================================
//HONEYCOMB CATACOMBS -- map content
//===================================================================================================
//Node types, regions, and the events that fire on them.
//
//A NODE TYPE says what happens when a node is entered. The map generator only knows about weights and
//constraints; what a node DOES is `onEnter`, so adding a new kind of stop is one table entry.
//
//An EVENT is a page of text with choices. Each choice is a condition, a cost and an effect list, which
//means events reach the same verb table cards do -- an event can hand out relics, edit the deck, or
//start a fight without any event-specific engine code.
window.honeycomb = window.honeycomb || {};

//---------------------------------------------------------------------------------------------------
//Node types
//---------------------------------------------------------------------------------------------------
//Fields:
//  index, name, description   shown on the map legend and the node preview
//  iconPath, glyph, colorHint art, with the generated fallback glyph
//  previewImagePath           the illustration on the preview card
//  onEnter(node)              what entering does
honeycomb.nodeTypeArray = [
	{
		index: "combat",
		name: "Combat",
		description: "Something is waiting here.",
		iconPath: "icons/swords-crossed",
		glyph: "sword",
		colorHint: "#e05a4a",
		previewImagePath: "map/preview-combat",
		onEnter: function (node) {
			honeycomb.scene.go("combat", { encounterIndex: node.encounterIndex, mapNodeId: node.id });
		},
	},
	{
		index: "elite",
		name: "Elite",
		description: "A stronger foe, and a better prize.",
		iconPath: "icons/skull",
		glyph: "skull",
		colorHint: "#d94f6e",
		previewImagePath: "map/preview-elite",
		onEnter: function (node) {
			honeycomb.scene.go("combat", { encounterIndex: node.encounterIndex, mapNodeId: node.id });
		},
	},
	{
		index: "boss",
		name: "Boss",
		description: "The thing this place belongs to.",
		iconPath: "icons/skull-horned",
		glyph: "skull",
		colorHint: "#ff4d4d",
		previewImagePath: "map/preview-boss",
		onEnter: function (node) {
			honeycomb.scene.go("combat", { encounterIndex: node.encounterIndex, mapNodeId: node.id, isBoss: true });
		},
	},
	{
		index: "event",
		name: "Event",
		description: "Something happens. It may go either way.",
		iconPath: "icons/question-mark",
		glyph: "question",
		colorHint: "#c9a961",
		previewImagePath: "map/preview-event",
		onEnter: function (node) {
			honeycomb.overlay.open("event", { eventIndex: node.eventIndex, nodeId: node.id });
		},
	},
	{
		index: "treasure",
		name: "Treasure",
		description: "Someone left something behind.",
		iconPath: "icons/chest",
		glyph: "chest",
		colorHint: "#e8c86a",
		previewImagePath: "map/preview-treasure",
		onEnter: function (node) {
			honeycomb.overlay.open("treasure", { nodeId: node.id });
		},
	},
	{
		index: "rest",
		name: "Rest",
		description: "A safe corner. Heal, or work on the deck.",
		iconPath: "icons/campfire",
		glyph: "campfire",
		colorHint: "#f09a4a",
		previewImagePath: "map/preview-rest",
		//REST IS AN EVENT. It was a bespoke overlay with its own card picker; it is now an ordinary
		//entry in honeycomb.eventArray, drawn by the event screen and resolved by the effect layer.
		//Everything it used to do by hand -- heal the party, choose a card to upgrade, choose one to
		//remove -- is expressible as effects now that a choice can stop and ask. Which event a rest
		//node runs is a field, so a region could have its own.
		restEventIndex: "theCampfire",
		onEnter: function (node) {
			var type = honeycomb.findDefinition(honeycomb.nodeTypeArray, node.typeIndex);
			honeycomb.overlay.open("event", { eventIndex: type.restEventIndex, nodeId: node.id });
		},
	},
	{
		index: "shop",
		name: "Shop",
		description: "Coin changes hands.",
		iconPath: "icons/bag",
		glyph: "bag",
		colorHint: "#63d2a3",
		previewImagePath: "map/preview-shop",
		onEnter: function (node) {
			honeycomb.overlay.open("shop", { nodeId: node.id });
		},
	},
];

//---------------------------------------------------------------------------------------------------
//Regions
//---------------------------------------------------------------------------------------------------
//One region is one map screen. A run walks a list of them; reaching a region's boss moves to the next.
//Overrides let a region reshape generation without editing the generator.
//
//LAYOUT. `layoutIndex` picks a honeycomb.mapLayoutArray strategy; omitted means tuning's default.
//  "rows"      procedural. The generator computes the shape, and `rowCount` and the tuning block
//              govern it. Needs no art.
//  "anchored"  hand-placed. The region supplies `backdropArray`, a POOL of paintings each carrying
//              the points a node may sit on. One is picked per run from the map stream and recorded
//              on the map, so a reload redraws the same painting under the same nodes.
//
//A BACKDROP is:
//  index        unique within the region
//  imagePath    the painting, resolved through honeycomb.image
//  aspect       the painting's shape, width divided by height. The graph adopts it, so both letterbox
//               into the same rectangle. Omitted falls back to tuning.map.frame.stageAspect.
//  anchorArray  [{id, step, x, y, typeIndex}] -- x and y are PERCENTAGES over the image, measured
//               from its top-left. `step` groups anchors into progression tiers, which is what the
//               rest of the map reads as a row. `typeIndex` is optional and forces that node's type,
//               so a shop can sit where the art shows a shop.
//  edgeArray    optional [{from, to}] anchor ids. Omitted means edges are derived by proximity
//               between consecutive steps, the same rule the procedural layout uses.
//
//Measuring anchors: open the image, read off the percentage across and down. Nothing else is needed;
//the graph stretches with the image, so the numbers stay correct at any screen size.
honeycomb.regionArray = [
	{
		index: "upperCatacombs",
		name: "The Upper Catacombs",
		description: "Damp brick and older bones. The spores start here.",
		backgroundPath: "map/background-upper",
		//HC-PLACEHOLDER: the two colours the generated map background is drawn from.
		colorNear: "#2a1f3a",
		colorFar: "#161022",
		bossEncounterIndex: "matriarchLair",
		//THE BOSS POOL: a run meets one of these, rolled when the map is generated (see
		//honeycomb.map.rollBossEncounter). `bossEncounterIndex` stays as the default for anything that
		//asks for one boss.
		//>>> LANE E7 | tallyman | act1-1 boss pool >>>
		//THIS BOSS MOVED UP. The pairing is one Act1-1 boss to one route: this slot
		//leads to Act1-A, the Head Gardener to Act1-B, the Matriarch to Act1-C. THE SHROUD, a mold colony
		//grown into a reaper's shape, replaced the clerk who held it -- so the reason for the pairing
		//changed with him: Act1-A is the spread at its thickest, and a mold that has built itself a body
		//is that sub-act stated outright.
		//THIS IS A RELOCATION, which this workstream's own law forbids elsewhere -- it was re-budgeted to
		//this region's boss row on the way; see the table entry.
		bossEncounterIndexArray: ["matriarchLair", "gardenerGrove", "tallyLedger"],
		//<<< LANE E7 | tallyman | act1-1 boss pool <<<
		//Optional generation overrides; anything omitted falls through to honeycomb.tuning.map.
		//The map scrolls sideways (see honeycomb-map.js), and a longer floor is a wider map at the same
		//node spacing, so this is the one number that lengthens it.
		rowCount: 18,
	},
	{
		//THE DISPLAY NAME AND THE INDEX DISAGREE ON PURPOSE. `enemy_overhaul/` recast this region's
		//five enemies as dry frontier myconids under arms and renamed twelve of its encounters off the
		//water theme, so the display name is "The Mushroom Frontier" while the index stays `floodedVault`.
		//
		//THE INDEX IS DELIBERATELY UNCHANGED. `floodedVault` is written into saved runs, into
		//`regionIndexArray` on every encounter that belongs here, and into tuning; renaming it is a
		//migration, not a title change, and the string is never shown to a player.
		//
		//STILL OWED HERE: the two colours and the backdrop are painted for water. `colorNear`/`colorFar`
		//are cold blues and the backdrop's anchors are `northPier` and `southSteps`. Those are a look,
		//still waiting to be repainted for the new theme.
		index: "floodedVault",
		name: "The Mushroom Frontier",
		description: "Dry timber and amber light. Everything that grows here grows armed.",
		backgroundPath: "map/background-vault",
		//This route's battle backdrop, read by honeycomb.combatScene.backdropPath.
		battleBackdropPath: "backgrounds/frontier",
		colorNear: "#1b2f3a",
		colorFar: "#0e1720",
		//THE RUN'S TWO BOSSES ARE THE TWO REGIONS' BOSSES: the Upper Catacombs end at the
		//Matriarch, the Flooded Vault at the Juggernaut. A run clears regionArray in order and wins on
		//the last one, so both are met exactly once and neither twice (see honeycomb-overlays-map
		//`moreToCome`). Repeating the same encounter here would have the run fight one boss twice.
		bossEncounterIndex: "juggernautHollow",
		//>>> LANE E7 | tallyman | act1-a boss pool >>>
		//The Act1-1 boss now called The Shroud moved up out of here, leaving the Juggernaut
		//alone -- which is what the story bible always said this sub-act had.
		bossEncounterIndexArray: ["juggernautHollow"],
		//<<< LANE E7 | tallyman | act1-a boss pool <<<
		rowCount: 11,

		//Hand-placed over art. HC-PLACEHOLDER: the paintings do not exist yet, so the map draws over
		//the CSS gradient and the anchors are a plausible stand-in shape rather than measured
		//landmarks. The mechanism is what is being proved; replacing these numbers with ones read off
		//a real painting is the whole of the art-side work.
		layoutIndex: "anchored",
		backdropArray: [
			{
				index: "vaultCauseway",
				imagePath: "map/backdrop-vault-causeway",
				//The painting's own shape, width divided by height. The canvas and the graph take the
				//same shape, so an anchor stays on its landmark. A 16:9 painting cannot be
				//longer than the window, so the generated stand-ins are drawn at 3.2:1 now.
				aspect: 2880 / 900,
				//A causeway that forks around a flooded middle and rejoins before the boss, then runs on
				//to the gate. The shape a grid cannot express: routes of different LENGTHS, which is what
				//mockup 4 shows. Edges are derived by proximity now that the anchor set is twice as long.
				anchorArray: [
					{ id: "entry", step: 0, x: 5, y: 50 },

					{ id: "northPier", step: 1, x: 11, y: 32 },
					{ id: "southSteps", step: 1, x: 13, y: 70 },

					{ id: "northWalk", step: 2, x: 18, y: 22 },
					{ id: "sunkenHall", step: 2, x: 20, y: 52 },
					{ id: "southWalk", step: 2, x: 19, y: 82 },

					{ id: "brokenSpan", step: 3, x: 26, y: 30 },
					{ id: "cisternMouth", step: 3, x: 28, y: 64 },
					{ id: "tidepool", step: 3, x: 27, y: 86 },

					{ id: "lampRow", step: 4, x: 34, y: 24 },
					{ id: "drownedShrine", step: 4, x: 36, y: 54 },
					{ id: "tollhouse", step: 4, x: 35, y: 84, typeIndex: "shop" },

					{ id: "upperCauseway", step: 5, x: 43, y: 32 },
					{ id: "weirWalk", step: 5, x: 45, y: 62 },

					{ id: "forkNorth", step: 6, x: 52, y: 24 },
					{ id: "forkMid", step: 6, x: 54, y: 54 },
					{ id: "forkSouth", step: 6, x: 53, y: 82 },

					{ id: "northRejoin", step: 7, x: 61, y: 30 },
					{ id: "midRejoin", step: 7, x: 63, y: 60 },

					{ id: "highWalk", step: 8, x: 69, y: 24 },
					{ id: "cistern", step: 8, x: 71, y: 54 },
					{ id: "lowerWalk", step: 8, x: 70, y: 84 },

					{ id: "deepCut", step: 9, x: 78, y: 32 },
					{ id: "lastSpan", step: 9, x: 80, y: 64 },

					{ id: "lastDry", step: 10, x: 88, y: 45, typeIndex: "rest" },

					{ id: "cisternGate", step: 11, x: 95, y: 55, typeIndex: "boss" },
				],
			},
			{
				index: "vaultStair",
				imagePath: "map/backdrop-vault-stair",
				aspect: 2880 / 900,
				//A second painting for the same region, to prove the pool works. A tighter descent with
				//one long detour rather than a fork. Reached only by proximity edges.
				anchorArray: [
					{ id: "landing", step: 0, x: 6, y: 60 },

					{ id: "firstFlight", step: 1, x: 12, y: 42 },
					{ id: "spillway", step: 1, x: 14, y: 80 },

					{ id: "midLanding", step: 2, x: 20, y: 30 },
					{ id: "flooded", step: 2, x: 22, y: 70 },

					{ id: "archway", step: 3, x: 28, y: 24 },
					{ id: "deepCut", step: 3, x: 30, y: 58 },
					{ id: "alcove", step: 3, x: 29, y: 86, typeIndex: "treasure" },

					{ id: "undercroft", step: 4, x: 36, y: 36 },
					{ id: "cistern", step: 4, x: 38, y: 68 },

					{ id: "stairHead", step: 5, x: 44, y: 26 },
					{ id: "spillGate", step: 5, x: 46, y: 58 },

					{ id: "midArch", step: 6, x: 52, y: 34 },
					{ id: "drownedRow", step: 6, x: 54, y: 72 },

					{ id: "floodline", step: 7, x: 60, y: 26 },
					{ id: "theCut", step: 7, x: 62, y: 60 },

					{ id: "lampNiche", step: 8, x: 68, y: 34 },
					{ id: "oldCistern", step: 8, x: 70, y: 70 },

					{ id: "archwayII", step: 9, x: 76, y: 32 },
					{ id: "deepCutII", step: 9, x: 78, y: 64 },

					{ id: "lastLanding", step: 10, x: 86, y: 50, typeIndex: "rest" },

					{ id: "vaultDoor", step: 11, x: 94, y: 55, typeIndex: "boss" },
				],
			},
			{
				//THE PROOF: a map no procedural layout could produce. From the Watch
				//Stair the path climbs BACKWARDS, to an event on the Lookout in the top-left corner --
				//behind where the party came in. Seeing that node sitting on the painted Lookout is seeing
				//the painting place the map. The painting is generated with a labelled landmark under
				//every anchor, so a node off its landmark is equally obvious.
				//Reached from Debug Tools -> "Show a hand-placed map", as well as by chance in this region.
				//The backward climb is in the positions, and the edges are derived by proximity now.
				index: "vaultShowcase",
				imagePath: "map/backdrop-vault-showcase",
				aspect: 2880 / 900,
				anchorArray: [
					{ id: "gate", step: 0, x: 6, y: 72 },

					{ id: "lowerHall", step: 1, x: 12, y: 82 },
					{ id: "watchStair", step: 1, x: 14, y: 44 },

					{ id: "lookout", step: 2, x: 7, y: 14, typeIndex: "event" },
					{ id: "midway", step: 2, x: 20, y: 64, typeIndex: "combat" },

					{ id: "ossuary", step: 3, x: 26, y: 24, typeIndex: "combat" },
					{ id: "floodline", step: 3, x: 28, y: 80 },

					{ id: "bridge", step: 4, x: 35, y: 50 },

					{ id: "undertow", step: 5, x: 42, y: 26 },
					{ id: "sink", step: 5, x: 44, y: 68 },

					{ id: "stair", step: 6, x: 50, y: 44 },
					{ id: "cistern", step: 6, x: 52, y: 80 },

					{ id: "highPath", step: 7, x: 58, y: 24 },
					{ id: "lowPath", step: 7, x: 60, y: 62 },

					{ id: "bridgeII", step: 8, x: 66, y: 40 },
					{ id: "floodlineII", step: 8, x: 68, y: 80 },

					{ id: "terrace", step: 9, x: 74, y: 34 },
					{ id: "theDeep", step: 9, x: 76, y: 70 },

					{ id: "sanctum", step: 10, x: 85, y: 40, typeIndex: "rest" },

					{ id: "throne", step: 11, x: 94, y: 64, typeIndex: "boss" },
				],
			},
		],
	},

	//>>> LANE E7 | flora, pollenRoad | regions >>>
	//THE OTHER TWO SUB-ACTS. Act1-1 splits three ways and these are the second and third of the
	//alternatives; which one a run reaches is decided by honeycomb.tuning.map.route, not by position.
	//POSITIONS 2 AND 3 ARE FIXED. An encounter's regionIndexArray holds positions in this array, so
	//reordering these two silently repoints every encounter that names them.
	{
		index: "flora",
		name: "The Thorn Arbor",
		description: "Stone gave way to roots a long time ago. Everything still growing here is armed.",
		//HC-PLACEHOLDER: Act1-B has no painting yet, so it borrows the vault's background. The two
		//colours below are what the generated map is drawn from until it does.
		backgroundPath: "map/background-vault",
		//This route's battle backdrop, read by honeycomb.combatScene.backdropPath.
		battleBackdropPath: "backgrounds/arbor",
		colorNear: "#2f3a1f",
		colorFar: "#16220f",
		//THE SISTERS IN THE ARBOR. Both bodies, one encounter, no victory condition -- see
		//the encounter's own note. Which runs arrive here is tuning.map.route's byBossArray, not position.
		bossEncounterIndex: "arborTwins",
		bossEncounterIndexArray: ["arborTwins"],
		//Matches Act1-A: B and C sit at the same depth as it, so they are the same length.
		rowCount: 11,
	},
	{
		index: "pollenRoad",
		name: "The Pollen Road",
		description: "Drifts of it, ankle deep, and nobody who lives here has any reason to get up.",
		//HC-PLACEHOLDER: Act1-C has no painting yet either. The colours stay dusty rather than gilded
		//-- the Pollen Road is the disorderly rhyme of Act 3 and must never preview its gold.
		backgroundPath: "map/background-vault",
		//This route's battle backdrop, read by honeycomb.combatScene.backdropPath.
		battleBackdropPath: "backgrounds/road",
		colorNear: "#3a3324",
		colorFar: "#1e1a12",
		//THE END OF THE ROAD. One body -- the moth-taur and the torso on it are the same
		//creature. Which runs arrive here is tuning.map.route's byBossArray, not position.
		bossEncounterIndex: "drayRoad",
		bossEncounterIndexArray: ["drayRoad"],
		rowCount: 11,
	},
	//<<< LANE E7 | flora, pollenRoad | regions <<<

	//>>> LANE ANA | gauntlet | region >>>
	//POSITION 4, AND IT MUST STAY 4: the gauntlet's encounters name it by position (`regionIndexArray: [4]`).
	//A SECRET REGION. Nothing in tuning.map.route.byBossArray leads here -- only ANA's overrideArray row,
	//for a run holding the invitation -- so honeycomb.map.countedRegionArray leaves it out of every list
	//and total by construction. Its name says nothing of who waits at the end of it.
	//No `layoutIndex`: it falls through to the procedural default and needs no painting.
	{
		index: "gauntletGallery",
		name: "The Quiet Gallery",
		description: "Black flagstones and white, swept clean. Somebody has been expecting company.",
		//HC-PLACEHOLDER: no painting yet, so it borrows the vault's background like the other sub-acts.
		backgroundPath: "map/background-vault",
		//Every fight in the gallery stands in front of the chess hall, read by
		//honeycomb.combatScene.backdropPath.
		battleBackdropPath: "backgrounds/chess",
		colorNear: "#2c2740",
		colorFar: "#121019",
		bossEncounterIndex: "gauntletGrandmaster",
		bossEncounterIndexArray: ["gauntletGrandmaster"],
		//A CORRIDOR, NOT A MAP: Celestial normal, Infernal normal, rest, Infernal elite, rest, Celestial
		//elite, which includes Anastasia. Six rows, one node each, no choice anywhere -- a detour the
		//devoted player walks once, not a second act. The `line` layout reads this plan and rolls nothing.
		layoutIndex: "line",
		rowPlanArray: [
			{ type: "combat", encounter: "gauntletWhiteOpening" },
			{ type: "combat", encounter: "gauntletBlackReply" },
			{ type: "rest" },
			{ type: "elite", encounter: "gauntletDrawnToEvil" },
			{ type: "rest" },
			{ type: "boss", encounter: "gauntletGrandmaster" },
		],
		//Ignored by the `line` layout, which takes its length from the plan; kept so a fallback to the
		//procedural layout still produces something sane.
		rowCount: 6,
	},
	//<<< LANE ANA | gauntlet | region <<<
];

//---------------------------------------------------------------------------------------------------
//Events
//---------------------------------------------------------------------------------------------------
//Fields:
//  index, name, text          the page
//  imagePath                  illustration
//  weight, condition          eligibility when an event node rolls
//  oncePerRun                 excluded after it has fired
//  choiceArray                [{text, condition, costArray, effectArray, resultText, closes}]
//
//A choice's effectArray runs through the same resolver cards use, so anything a card can do, an event
//can do -- INCLUDING stopping to ask the player a question, since choices resolve through the choice
//runner. resultText is shown after the choice resolves, replacing the body.
//
//PRESENTATION:
//  presentation     "scene" (default) draws the event full screen with a backdrop and a speaker;
//                   "panel" draws the small centred box. See honeycomb.eventPresentationArray.
//  backgroundPath   full-bleed art behind everything, in scene mode
//  speakerPath      a figure standing down one side of the screen
//  speakerName      who that is
//  lineArray        [{speaker, text}] attributed dialogue, for a scene with a voice in it
//
//A CHOICE may carry `previewText` to describe its outcome in prose; without one the description is
//generated from its own effects, so every choice previews itself.
//
//PAGES, BATTLES AND DISCOVERIES:
//  pageArray        further pages [{index, text, lineArray, choiceArray}] after the first
//  goToPage         on a choice: turn to that page instead of ending the event
//  startCombat      an effect a choice may carry: fight `encounter`, then come back -- to `victoryPage`
//                   if it names one, otherwise to the choice's own result text
//  discovery        on an EVENT, false means resolving it pays nothing into the shared pool (the
//                   campfire). On a CHOICE, true marks a major branch -- a PATH -- that pays the first
//                   time it is taken. Most choices are not paths; only mark the real forks.
//  index            on a choice, a stable name for its path, so reordering choices cannot change which
//                   paths a profile has already found
honeycomb.eventArray = [

	//-------------------------------------------------------------------------------------------
	//Rest. An ordinary event, run by the rest node type. It has no buttons of its own: the menu is
	//built when the party arrives, from honeycomb.restOptionArray below (honeycomb.rest.choiceArray).
	//-------------------------------------------------------------------------------------------
	{
		index: "theCampfire",
		name: "The Campfire",
		//Marks it as a rest, which is what recharges abilities when it is left.
		isRest: true,
		//Resting is not finding anything, so the campfire pays nothing into the discovery pool.
		discovery: false,
		text: "Someone left the wood dry and stacked, which is either a kindness or a habit. " +
			"There is time here for exactly one thing.",
		//One picture per character: whoever leads the party is the one sitting at the fire.
		imagePath: "events/campfire/{leader}",
		backgroundPath: "events/campfire/backdrop",
		//Rest is always available; it is not drawn from the event pool.
		weight: 0,
	},

	//-------------------------------------------------------------------------------------------
	//The two events that only exist for a party carrying somebody broken. `appearsWhenBroken` keeps
	//them out of the pool entirely the rest of the time, so they are never a wasted node.
	//-------------------------------------------------------------------------------------------
	{
		index: "aQuietPool",
		name: "A quiet pool",
		appearsWhenBroken: true,
		weight: 55,
		text: "It seems like water is flowing freely here, somehow.",
		imagePath: "events/well",
		//Only the leader speaks: each line plays for the character at the front of the party.
		lineArray: [
			{ speaker: "Brienne", text: "Must be an aquifer, or something. Pretty warm down here though.", characterIndex: "brienne", condition: { index: "partyContains", character: "brienne", position: 0 } },
			{ speaker: "Nettle", text: "Warm water, but no signs of life. Yet. No telling how long until the myconids find it.", characterIndex: "nettle", condition: { index: "partyContains", character: "nettle", position: 0 } },
			{ speaker: "Severine", text: "Ooh~ I could use a bath. Nmm, but my lovlies would be heartbroken they can't clean me themselves.", characterIndex: "severine", condition: { index: "partyContains", character: "severine", position: 0 } },
			{ speaker: "Cinder", text: "Ooh, the perfect temperature too! Don't mind if I do~!", characterIndex: "cinder", condition: { index: "partyContains", character: "cinder", position: 0 } },
			{ speaker: "Cassadora", text: "Crystal clear, unlike our future if we linger here.", characterIndex: "cassadora", condition: { index: "partyContains", character: "cassadora", position: 0 } },
			{ speaker: "Clemence", text: "Water? I suppose a clean slate is easier to stain.", characterIndex: "clemence", condition: { index: "partyContains", character: "clemence", position: 0 } },
		],
		choiceArray: [
			{
				index: "bathe",
				discovery: true,
				text: "Take a Break to Bathe",
				previewText: "Restores 10% hp to the party, and halves their lust.",
				//Per member, so each heals a tenth of her own maximum health and keeps half her own Lust.
				effectArray: [{ index: "forEachTarget", over: "allAllies", effectArray: [
					{ index: "heal", amount: { index: "math", operation: "divide",
						left: { index: "stat", stat: "maxHealth", of: "target" }, right: 10 } },
					{ index: "setLust", amount: { index: "math", operation: "divide",
						left: { index: "stat", stat: "lust", of: "target" }, right: 2 } },
				] }],
				goToPage: "bathe",
			},
			{
				text: "Move Right Along",
				previewText: "Nothing happens.",
				effectArray: [],
			},
		],
		pageArray: [
			{
				index: "bathe",
				//The leader's own picture: events/pool/knight when Brienne leads.
				imagePath: "events/pool/{leader}",
				lineArray: [
					{ text: "You take a short break, soaking the warm water. It feels like the injuries you've carried in with you have faded." },
				],
				choiceArray: [
					{ text: "Finish", effectArray: [] },
				],
			},
		],
	},
	{
		index: "handsInTheDark",
		name: "Hands In The Dark",
		appearsWhenBroken: true,
		weight: 40,
		text: "A woman steps out of the dark with both hands held out. She has been waiting for exactly this: " +
			"a party with somebody in it who cannot argue. She offers, in a voice like a poultice, to take the worst of it away.",
		imagePath: "events/hands",
		choiceArray: [
			{
				index: "accept",
				discovery: true,
				text: "Let her.",
				previewText: "Removes 25 Lust from the whole party. Adds a Dread to your deck.",
				effectArray: [
					{ index: "soothe", amount: 25, targetOverride: "allAllies" },
					{ index: "addCardToDeck", card: "curseDread", count: 1 },
				],
				resultText: "She is gentle, and she is thorough, and something goes into the deck with you when " +
					"you leave.",
			},
			{
				index: "refuse",
				discovery: true,
				text: "Put yourself between her and them.",
				previewText: "The party takes 9 damage each, ignoring Temporary HP, and gains 3 Composure.",
				effectArray: [
					{ index: "damageIgnoringTemporary", amount: 9, targetOverride: "allAllies" },
					{ index: "applyStatus", status: "composure", stacks: 3, targetOverride: "allAllies" },
				],
				resultText: "She does not like being refused, and her hands turn out to have nails. Everyone is cut about the arms, and everyone is " +
					"walking out under their own power.",
			},
		],
	},
	{
		index: "wellOfWaxLight",
		name: "The Well of Wax Light",
		text: "A girl sits on the rim of a dry well, swinging her legs, with a candle in one hand. The well is lit from the bottom by something soft and yellow. A rope ladder has been nailed to the inside, and the nails are new.",
		imagePath: "events/waxlight",
		weight: 30,
		choiceArray: [
			{
				index: "climb",
				discovery: true,
				text: "Climb down and take the light.",
				//A trade: real health for a real relic.
				effectArray: [
					{ index: "damageIgnoringTemporary", amount: 8, targetOverride: "allAllies" },
					{ index: "gainRelic", relic: "bonePendant" },
				],
				resultText: "The climb is worse than it looks. Everyone comes up scraped, but the pendant hums against the ribs and the deck feels lighter.",
			},
			{
				index: "cutLadder",
				discovery: true,
				text: "Cut the ladder and move on.",
				effectArray: [
					{ index: "gainResource", resource: "gold", amount: 40 },
				],
				resultText: "She laughs when the ladder drops. Whatever was down there had been paying somebody, and the nails were worth prying out.",
			},
			{
				text: "Leave it alone.",
				//A choice that does nothing still says so: an empty preview reads as an oversight rather
				//than as a decision to walk away.
				previewText: "Nothing happens. You keep what you have.",
				effectArray: [],
				resultText: "The girl is still there when you look back, and the light is a little closer to the top.",
			},
		],
	},
	{
		index: "theTollBench",
		name: "The Toll Bench",
		text: "A stone bench across the corridor, and a girl lying along it with one hand held out, palm up. There are coins all over the floor around her. She does not move her legs for anybody who has not paid.",
		imagePath: "events/bench",
		weight: 30,
		choiceArray: [
			{
				index: "payToll",
				discovery: true,
				text: "Pay the toll. (50 gold)",
				costArray: { gold: 50 },
				//Gated on affordability, so the option greys out rather than failing on click.
				condition: { index: "canAfford", costArray: { gold: 50 } },
				effectArray: [
					{ index: "heal", amount: 25, targetOverride: "allAllies" },
					{ index: "applyStatus", status: "regeneration", stacks: 3, targetOverride: "allAllies" },
				],
				resultText: "She takes the coin without a word and swings her legs down. Sitting on the bench is the best any of you have felt in days.",
			},
			{
				index: "sitFree",
				discovery: true,
				text: "Sit without paying.",
				effectArray: [
					{ index: "addCardToDeck", card: "curseDread", count: 1 },
					{ index: "gainResource", resource: "gold", amount: 25 },
				],
				resultText: "She lets you, and grins the whole time. You pocket 25 gold off the floor while she watches. You also find that you cannot stop thinking about her.",
			},
			{
				text: "Walk around it.",
				previewText: "Nothing happens. You keep your gold.",
				effectArray: [],
				resultText: "It is a long way around.",
			},
		],
	},
	{
		index: "theSporeGarden",
		name: "The Spore Garden",
		text: "A room someone has been tending, and the someone is still here: a girl in a mushroom cap, watering rows of caps in graded sizes. On the wall behind her is a chalk tally that stops abruptly at forty-one.",
		imagePath: "events/garden",
		weight: 25,
		choiceArray: [
			{
				index: "harvest",
				discovery: true,
				text: "Harvest carefully.",
				effectArray: [
					{ index: "addCardToDeck", card: "neutralTonic", count: 2 },
				],
				resultText: "Two doses, bottled and stoppered. The tally on the wall is now forty-three.",
			},
			{
				index: "burn",
				discovery: true,
				text: "Burn the garden.",
				effectArray: [
					{ index: "gainRelic", relic: "gildedLedger" },
					{ index: "damageIgnoringTemporary", amount: 5, targetOverride: "allAllies" },
				],
				resultText: "She runs. The smoke is worse than expected. Under the third row, a strongbox nobody had gotten around to moving.",
			},
			{
				text: "Add to the tally and leave.",
				effectArray: [
					{ index: "gainResource", resource: "keys", amount: 1 },
				],
				resultText: "Forty-two. She presses a key into your hand on your way out.",
			},
		],
	},
	{
		index: "theCardsharp",
		name: "The Cardsharp",
		text: "A girl sitting on a card table, dealing to nobody. She is grinning before you are close enough to be seen. \"One trade,\" she says. \"Something of yours for something of mine. You will not get to choose which.\"",
		imagePath: "events/cardsharp",
		weight: 22,
		choiceArray: [
			{
				index: "tradeCard",
				discovery: true,
				text: "Trade a card.",
				//Deck manipulation from the map, which is one of the things a map node is for.
				effectArray: [
					{ index: "removeCardFromDeck", card: null },
					{ index: "addCardToDeck", card: "neutralWarcry", count: 1 },
				],
				resultText: "The trade is done before you see either card. The deck is the same size and entirely different.",
			},
			{
				index: "tradeGold",
				discovery: true,
				text: "Trade gold instead. (60 gold)",
				costArray: { gold: 60 },
				condition: { index: "canAfford", costArray: { gold: 60 } },
				effectArray: [
					{ index: "addCardToDeck", card: "neutralFocus", count: 1 },
					{ index: "addCardToDeck", card: "neutralTonic", count: 1 },
				],
				resultText: "\"Generous,\" she says, and deals two cards face down. They are both worth having.",
			},
			{
				text: "Refuse.",
				previewText: "Nothing happens. Your deck is left alone.",
				effectArray: [],
				resultText: "She keeps dealing. You are fairly sure she was already playing your hand.",
			},
		],
	},
	{
		//A FIXTURE as much as an event: the one piece of content proving an event can start a battle,
		//carry its story through the victory screen, and pick up again on a later page. Delete it freely
		//once real events do the same; nothing refers to it by name.
		index: "theSealedDoor",
		name: "The Sealed Door",
		text: "A door of black iron, bolted from this side, with a barred window at head height. A woman grins at you through the bars. She has been in there a long time, and she does not seem to mind.",
		imagePath: "events/door",
		weight: 20,
		choiceArray: [
			{
				index: "force",
				discovery: true,
				text: "Draw the bolts.",
				previewText: "Whatever is behind it gets a fight. Win, and the room is yours.",
				effectArray: [{ index: "startCombat", encounter: "hollowPatrol", victoryPage: "beyond" }],
				resultText: "The bolts come back one at a time. She steps back into the dark, and something else comes out instead.",
			},
			{
				index: "listen",
				text: "Leave it bolted.",
				previewText: "Nothing happens. The door stays shut.",
				effectArray: [],
				resultText: "Her laughing follows you down the corridor for a while, then gives up.",
			},
		],
		pageArray: [
			{
				//Reached only through the fight, which is what makes the fight a beat in the story rather
				//than a detour from it.
				index: "beyond",
				text: "Past the door is a reliquary nobody has opened, and a long drop into the dark beside it. There is no sign of the woman.",
				choiceArray: [
					{
						index: "reliquary",
						discovery: true,
						text: "Open the reliquary.",
						effectArray: [{ index: "gainRelic", relic: "cracksealWax" }],
						resultText: "Wax, still soft, sealed around something that hums.",
					},
					{
						index: "drop",
						discovery: true,
						text: "Climb down into the dark.",
						effectArray: [
							{ index: "damageIgnoringTemporary", amount: 6, targetOverride: "allAllies" },
							{ index: "gainResource", resource: "gold", amount: 90 },
						],
						resultText: "A bad climb, and a floor littered with what earlier climbers dropped.",
					},
				],
			},
		],
	},
	{
		index: "theQuietShrine",
		name: "The Quiet Shrine",
		text: "A woman kneels in front of an alcove, praying with her eyes closed. She does not stop when you come in. Beside her is a shallow bowl of small offerings. Buttons, mostly. A few teeth.",
		imagePath: "events/shrine",
		weight: 25,
		choiceArray: [
			{
				index: "offering",
				discovery: true,
				text: "Make an offering. (30 gold)",
				costArray: { gold: 30 },
				condition: { index: "canAfford", costArray: { gold: 30 } },
				//A RANDOM relic the party does not already carry.
				effectArray: [
					{ index: "gainRandomRelic" },
				],
				resultText: "The bowl accepts it. When the coin has gone, something small and warm is waiting in its place.",
			},
			{
				index: "takeBowl",
				discovery: true,
				text: "Take from the bowl.",
				effectArray: [
					{ index: "gainResource", resource: "gold", amount: 70 },
					{ index: "applyStatus", status: "sundered", stacks: 3, targetOverride: "allAllies" },
				],
				resultText: "Seventy gold in buttons and teeth. She never opens her eyes, but the alcove is much colder on the way out than it was on the way in.",
			},
		],
	},

	//-------------------------------------------------------------------------------------------
	//NETTLE ONLY. Offered while her venom can still rank up (weaknessCanRank), ignoring the per-run ceiling.
	//No painting yet, so she stands as the speaker. The words are a draft.
	//-------------------------------------------------------------------------------------------
	{
		index: "theWeepingBloom",
		name: "The Weeping Bloom",
		subject: "nettle",
		speakerIsSubject: true,
		weight: 30,
		condition: { index: "allOf", conditionArray: [
			{ index: "partyContains", character: "nettle" },
			{ index: "weaknessCanRank", character: "nettle", tag: "venom" },
		] },
		text: "",
		lineArray: [
			{ text: "A flower the size of a cartwheel has pushed up through the flagstones." },
			{ text: "Every petal is weeping a thick pink sap, and the air around it is sweet enough to taste." },
			{ speaker: "Nettle", text: "Nobody touch it. Nobody breathe on it. I need to know what it is before anyone gets it on them." },
			{ speaker: "Nettle", text: "Hmmmm... It isn't nectar, nectar doesn't glow. And it isn't resin." },
			{ speaker: "Nettle", text: "Resin doesn't smell like... that." },
			{ text: "Jonesy Bones drifts in close to the petals, then turns around to stare at her." },
			{ speaker: "Nettle", text: "D-don't look at me like that. It's research." },
		],
		choiceArray: [
			{
				index: "study",
				discovery: true,
				text: "Study it",
				effectArray: [
					{ index: "gainResource", resource: "reroll", amount: 2 },
					{ index: "raiseWeaknessRank", character: "nettle", tag: "venom", ranks: 1 },
				],
			},
			{
				index: "bottle",
				discovery: true,
				text: "Bottle the sap",
				effectArray: [
					{ index: "gainResource", resource: "gold", amount: 50 },
					{ index: "damageIgnoringTemporary", amount: 5, targetOverride: "allAllies" },
				],
			},
			{
				text: "Leave",
				previewText: "Nothing changes.",
				effectArray: [],
			},
		],
	},
];

//Which events are still eligible on this run.
//---------------------------------------------------------------------------------------------------
//Treatments for the Broken state
//---------------------------------------------------------------------------------------------------
//WHAT IT MEANS TO TREAT SOMEBODY, in one place, because three different screens offer it: the campfire
//(as an extra choice while somebody is broken), two events that only appear while somebody is, and the
//shop's counter. A balance pass moves a number here and all four move with it.
//
//  index, name, description   what the offer says
//  goldCost                   the shop's price; events pay in their own currency instead
//  effectArray                resolved against the whole party, so each one picks its own targets
//Every one of them reduces LUST rather than curing Broken outright: recovery is still the turn-start
//test, so a treatment moves somebody toward it rather than around it. That keeps the mechanic honest.
honeycomb.brokenTreatmentArray = [
	{
		index: "poultice",
		name: "A poultice",
		description: "Removes 12 Lust from every broken member of the party.",
		goldCost: 45,
		effectArray: [{ index: "soothe", amount: 12, targetOverride: "allAllies" }],
	},
	{
		index: "restAndWater",
		name: "Rest and clean water",
		description: "Removes 8 Lust from the whole party and heals everyone 10 HP.",
		goldCost: 70,
		effectArray: [
			{ index: "soothe", amount: 8, targetOverride: "allAllies" },
			{ index: "heal", amount: 10, targetOverride: "allAllies" },
		],
	},
	{
		index: "steadyingDraught",
		name: "A steadying draught",
		description: "The whole party gains 2 Composure, which sheds Lust every turn of the next fight.",
		goldCost: 60,
		effectArray: [{ index: "applyStatus", status: "composure", stacks: 2, targetOverride: "allAllies" }],
	},
];

//---------------------------------------------------------------------------------------------------
//Events and the Broken state
//---------------------------------------------------------------------------------------------------
//Three separate mechanisms, none of which any existing event has to know about:
//  appearsWhenBroken   an event that is ONLY drawn while somebody is broken (the two treatments below)
//  weightWhenBroken    an event whose share of the pool changes while somebody is broken, so the
//                      ordinary events stand aside rather than being removed
//  brokenVariantArray  an alternate face for an event -- title, text, extra choices -- shown when a
//                      broken member is in the party. See honeycomb.eventVariantFor.
honeycomb.partyHasBroken = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return false;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		if (run.partyArray[memberIndex].broken == true) return true;
	}
	return false;
};

//The first broken member, for an event that wants to name one.
honeycomb.firstBrokenMember = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return null;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		if (run.partyArray[memberIndex].broken == true) return run.partyArray[memberIndex];
	}
	return null;
};

//An event's face right now: its `brokenVariantArray` entry when one passes, else the event itself.
//A variant is a SHALLOW OVERLAY, so it names only the fields it changes and inherits the rest -- the
//same shape a card upgrade uses.
honeycomb.eventVariantFor = function (event) {
	if (event == null || event.brokenVariantArray == null) return event;
	if (honeycomb.partyHasBroken() == false) return event;
	var context = honeycomb.newEffectContext({});
	for (var scanIndex = 0; scanIndex < event.brokenVariantArray.length; scanIndex++) {
		var variant = event.brokenVariantArray[scanIndex];
		if (variant.condition != null && honeycomb.testCondition(variant.condition, context) == false) continue;
		var merged = {};
		for (var baseField in event) {
			if (Object.prototype.hasOwnProperty.call(event, baseField) == false) continue;
			merged[baseField] = event[baseField];
		}
		for (var overrideField in variant) {
			if (Object.prototype.hasOwnProperty.call(variant, overrideField) == false) continue;
			if (overrideField == "condition") continue;
			merged[overrideField] = variant[overrideField];
		}
		//The index must survive, or every downstream lookup (the seen ledger, the discovery pool, a
		//page turn) would be looking for an event that does not exist.
		merged.index = event.index;
		return merged;
	}
	return event;
};

//What an event weighs in the pool right now.
honeycomb.eventWeight = function (event) {
	if (event == null) return 0;
	if (honeycomb.partyHasBroken() == true && event.weightWhenBroken != null) return event.weightWhenBroken;
	return event.weight;
};

honeycomb.eligibleEventArray = function () {
	var run = honeycomb.state.run;
	var seenArray = run.seenEventArray == null ? [] : run.seenEventArray;
	var result = [];
	var context = honeycomb.newEffectContext({});
	var anyBroken = honeycomb.partyHasBroken();
	//Events that may appear at all, seen this run or not. The reopened pool below is drawn from these.
	var allowedArray = [];
	for (var eventIndex = 0; eventIndex < honeycomb.eventArray.length; eventIndex++) {
		var event = honeycomb.eventArray[eventIndex];
		//A weight of zero means the event is never rolled for a map node: it is run by something else,
		//the way the rest node runs the campfire.
		if (honeycomb.eventWeight(event) === 0) continue;
		//AN EVENT THAT ONLY EXISTS FOR A BROKEN PARTY. Not a condition, because a condition would also
		//have to be written on the events that must stay OUT of the pool, and this is the common case.
		if (event.appearsWhenBroken == true && anyBroken == false) continue;
		if (event.condition != null && honeycomb.testCondition(event.condition, context) == false) continue;
		allowedArray.push(event);
		if (seenArray.indexOf(event.index) >= 0) continue;
		result.push(event);
	}
	//Every event having fired is not an error: the pool simply reopens rather than leaving a node dead.
	//Once every event has been seen, the pool reopens to the allowed ones; only if none is allowed does it
	//fall back to every rollable event.
	if (result.length === 0) return allowedArray.length > 0 ? allowedArray : honeycomb.rollableEventArray();
	return result;
};

//The same list with each entry's LIVE weight stamped on it, which is what rng.pickWeighted reads.
//Copies rather than edits: an event definition is content and must not be rewritten by a roll.
honeycomb.weightedEventPoolArray = function (eventArray) {
	var result = [];
	for (var scanIndex = 0; scanIndex < eventArray.length; scanIndex++) {
		var event = eventArray[scanIndex];
		var weight = honeycomb.eventWeight(event);
		//COLLECTOR (tree node): an event never seen before is weighted up.
		if (honeycomb.discovery != null && honeycomb.discovery.isKnown("event", event.index) == false) {
			weight *= honeycomb.collectorWeightMultiplier();
		}
		if (weight === event.weight) { result.push(event); continue; }
		var copy = {};
		for (var field in event) {
			if (Object.prototype.hasOwnProperty.call(event, field)) copy[field] = event[field];
		}
		copy.weight = weight;
		result.push(copy);
	}
	return result;
};

//Every event a map node may roll, ignoring what has already been seen. Events with no weight are
//excluded here too, or reopening the pool would start offering the campfire on an event node.
honeycomb.rollableEventArray = function () {
	var result = [];
	for (var scanIndex = 0; scanIndex < honeycomb.eventArray.length; scanIndex++) {
		if (honeycomb.eventArray[scanIndex].weight === 0) continue;
		result.push(honeycomb.eventArray[scanIndex]);
	}
	return result;
};

//---------------------------------------------------------------------------------------------------
//Shop stock
//---------------------------------------------------------------------------------------------------
//What a shop offers and what it charges. Prices are per rarity so a new card needs no price of its own.
//DECK SERVICES: the one definition of "remove a card" and "upgrade a card", shared by everything that
//offers them -- the campfire's choices and the shop's counter -- so no two places can disagree about
//which cards qualify. Reached through the `deckService` effect, which may override the question's
//wording.
honeycomb.deckServiceArray = [
	{
		index: "removeCard",
		description: "Choose a card and remove it from your deck for good.",
		effectArray: [{
			//removableOnly keeps a curse that "cannot be removed by ordinary means" off the offer.
			index: "chooseCards", from: "deckCard", prompt: "Remove which card?", minimum: 0, maximum: 1,
			removableOnly: true,
			effectArray: [{ index: "removeTargetCardFromDeck" }],
		}],
	},
	{
		index: "upgradeCard",
		description: "Choose a card and upgrade it for good.",
		effectArray: [{
			//upgradeableOnly also shows each card's upgraded version before it is committed.
			index: "chooseCards", from: "deckCard", prompt: "Upgrade which card?", minimum: 0, maximum: 1,
			upgradeableOnly: true,
			effectArray: [{ index: "upgradeTargetCard", levels: 1 }],
		}],
	},
];

//---------------------------------------------------------------------------------------------------
//Rest-site options (NODES-LIST §D)
//---------------------------------------------------------------------------------------------------
//Every option a campfire can offer, one row each. `base: true` is always on the menu; every other row
//is unlocked by a character's Rest1/Rest2 tree node naming it with `restOption`. Each costs one action.
//Numbers live in `tuning.rest`, read through the `tuning` value so a row carries no literal.

//How much Sleep heals each member: their maximum health times the base share, plus Rest-B's bonus.
//Named once because the Lust it removes is the same amount.
honeycomb.restSleepAmount = { index: "math", operation: "multiply",
	left: { index: "stat", stat: "maxHealth", of: "target" },
	right: { index: "math", operation: "add",
		left: { index: "tuning", path: "rest.healFraction" },
		right: { index: "math", operation: "multiply",
			left: { index: "partyFlag", field: "restHealBonus" },
			right: { index: "tuning", path: "rest.healBonusFraction" } } } };

//Treatment's heal on the chosen ally, likewise named once for its Lust.
honeycomb.restTreatmentAmount = { index: "math", operation: "multiply",
	left: { index: "stat", stat: "maxHealth", of: "target" },
	right: { index: "tuning", path: "rest.treatmentFraction" } };

//The Lust a campfire heal removes alongside it: the same amount times tuning.rest.lustPerHealth.
honeycomb.restLustAmount = function (healAmount) {
	return { index: "math", operation: "multiply", left: healAmount, right: { index: "tuning", path: "rest.lustPerHealth" } };
};

//The words a campfire heal adds when it also removes Lust. `verb` is "removes" or "remove", to agree
//with the sentence it finishes.
honeycomb.restLustClause = function (verb) {
	var perHealth = honeycomb.tuning.rest.lustPerHealth;
	if (perHealth == null || perHealth <= 0) return "";
	return perHealth === 1 ? " and " + verb + " as much " + honeycomb.keywordName("lust")
		: " and " + verb + " " + Math.round(perHealth * 100) + "% as much " + honeycomb.keywordName("lust");
};

honeycomb.restOptionArray = [
	{
		index: "sleep", name: "Sleep", base: true,
		text: "Sleep",
		//Computed, not prose: the share AND the HP it works out to across the party, so "how much does
		//sleeping heal" has an answer. Rest-B raises the share.
		previewText: function () {
			var fraction = honeycomb.tuning.rest.healFraction +
				(honeycomb.partyFieldFlag("restHealBonus") == true ? honeycomb.tuning.rest.healBonusFraction : 0);
			var percent = Math.round(fraction * 100);
			var run = honeycomb.state == null ? null : honeycomb.state.run;
			var low = null, high = null;
			for (var memberIndex = 0; run != null && memberIndex < run.partyArray.length; memberIndex++) {
				var amount = Math.round(run.partyArray[memberIndex].maxHealth * fraction);
				low = low == null ? amount : Math.min(low, amount);
				high = high == null ? amount : Math.max(high, amount);
			}
			if (low == null) return "Heals " + percent + "% of maximum health" + honeycomb.restLustClause("removes") + ".";
			return "Heals " + percent + "% of maximum health (" + low + (high === low ? "" : "-" + high) + " HP)" +
				honeycomb.restLustClause("removes") + ".";
		},
		effectArray: [{ index: "forEachTarget", over: "allAllies", effectArray: [
			{ index: "heal", amount: honeycomb.restSleepAmount },
			{ index: "soothe", amount: honeycomb.restLustAmount(honeycomb.restSleepAmount) },
		] }],
		resultText: "The fire burns down while you sleep. Everyone stands up straighter for it.",
	},
	{
		index: "sharpen", name: "Sharpen", base: true,
		text: "Sharpen a card",
		previewText: "Choose one card in your deck and upgrade it, for good.",
		effectArray: [{ index: "deckService", service: "upgradeCard", prompt: "Sharpen which card?" }],
		resultText: "Whatever you worked on is better for the attention.",
	},
	{
		//NODES-LIST calls this option Purge: the campfire's own removal, cheaper than the shop's. The
		//shop's counter is the paid one; this is the free default.
		index: "purge", name: "Leave a card behind", base: true,
		text: "Leave a card behind",
		previewText: "Choose one card and take it out of your deck permanently.",
		effectArray: [{ index: "deckService", service: "removeCard", prompt: "Leave which card behind?" }],
		resultText: "You leave it by the fire. It will not be there when anyone comes back.",
	},
	{
		index: "exercise", name: "Exercise",
		text: "Exercise",
		previewText: "Every member of the party gains personal experience.",
		effectArray: [{ index: "gainExperience", amount: { index: "tuning", path: "rest.exerciseExperience" } }],
		resultText: "Drills before dawn. It is not pleasant, but it counts.",
	},
	{
		index: "fortuneTelling", name: "Fortune Telling",
		text: "Fortune Telling",
		previewText: "Replace a starter card with a random common or rare of that character.",
		effectArray: [{
			index: "chooseCards", from: "deckCard", prompt: "Which starter should change?", maximum: 1, starterOnly: true,
			effectArray: [{ index: "transformChosenCard", rarityArray: ["common", "rare"] }],
		}],
		resultText: "The cards are turned, read, and put back differently. Nobody watches too closely.",
	},
	{
		index: "treatment", name: "Treatment",
		text: "Treatment",
		previewText: function () {
			return "Heal a chosen ally for " + Math.round(honeycomb.tuning.rest.treatmentFraction * 100) +
				"% of their maximum health" + honeycomb.restLustClause("remove") + ".";
		},
		effectArray: [{
			index: "chooseAlly", prompt: "Treat whom?",
			previewFraction: { index: "tuning", path: "rest.treatmentFraction" },
			effectArray: [
				{ index: "heal", amount: honeycomb.restTreatmentAmount },
				{ index: "soothe", amount: honeycomb.restLustAmount(honeycomb.restTreatmentAmount) },
			],
		}],
		resultText: "Bandages, warmth, and a few hours of not being needed. It is enough.",
	},
	{
		index: "scavenge", name: "Scavenge",
		text: "Scavenge",
		previewText: "Find gold around the camp.",
		effectArray: [{ index: "gainResource", resource: "gold", amount: { index: "tuning", path: "rest.scavengeGold" } }],
		resultText: "Coins in a dead man's coat, and nobody left to mind.",
	},
	{
		index: "gamble", name: "Gamble",
		text: "Gamble",
		previewText: "Transform a non-starter card into a random card of the same rarity for that character.",
		effectArray: [{
			index: "chooseCards", from: "deckCard", prompt: "Gamble away which card?", maximum: 1, nonStarterOnly: true,
			effectArray: [{ index: "transformChosenCard", sameRarity: true }],
		}],
		resultText: "You bet the card, and the fire deals you another. Best not to count what you lost.",
	},
	{
		index: "laundry", name: "Laundry",
		text: "Laundry",
		previewText: "Exhaust every curse in your deck.",
		effectArray: [{ index: "exhaustJunkFromDeck" }],
		resultText: "The worst of what you were carrying goes into the flames, and the flames like it.",
	},
	{
		index: "preptime", name: "Preptime",
		text: "Preptime",
		previewText: "The party begins the next battle with Temporary HP.",
		effectArray: [{ index: "preptime", fraction: { index: "tuning", path: "rest.preptimeFraction" } }],
		resultText: "Not sleep: preparation. It will hold, for the first few blows at least.",
	},
	{
		index: "duplicate", name: "Duplicate",
		text: "Duplicate",
		previewText: "Copy a card in your deck.",
		effectArray: [{
			index: "chooseCards", from: "deckCard", prompt: "Copy which card?", maximum: 1,
			effectArray: [{ index: "duplicateRunDeckCard" }],
		}],
		resultText: "Written out again, line for line, until there are two.",
	},
	{
		index: "mailOrder", name: "Mail Order",
		text: "Mail Order",
		previewText: "Open the shop. Prices are doubled.",
		effectArray: [{ index: "openShop", priceMultiplier: { index: "tuning", path: "rest.mailOrderPriceMultiplier" } }],
		resultText: "A courier finds you in the dark, which should not be possible. Everything costs more out here.",
	},
	{
		index: "journal", name: "Journal",
		text: "Journal",
		previewText: function () {
			return "View " + honeycomb.tuning.rest.journalOfferCount + " cards you do not own. The one you pick is " +
				honeycomb.tuning.rest.journalWeightMultiplier + "x more likely to appear in post-battle rewards.";
		},
		effectArray: [{ index: "journalOffer", count: { index: "tuning", path: "rest.journalOfferCount" } }],
		resultText: "You write down what you remember of it, and the remembering makes it likelier.",
	},
];

//The shop's own numbers. `brokenOfferArray` is the SPECIAL SALE: while anybody in the
//party is broken the counter carries treatments as well as stock. Each entry names a
//honeycomb.brokenTreatmentArray index and may discount it -- the shopkeeper knows what a party in this
//state is worth. Empty the array to take the sale away.
honeycomb.shopTuning = {
	brokenOfferArray: [
		{ treatment: "poultice", priceMultiplier: 1 },
		{ treatment: "steadyingDraught", priceMultiplier: 0.9 },
	],
	cardSlotCount: 6,
	relicSlotCount: 2,
	//The shop sells costumes, which the mockup's OUTFITS tab is for. Buying one unlocks it on the
	//profile for good rather than equipping it for this run.
	outfitSlotCount: 3,
	outfitPrice: 160,
	removalCost: 60,
	removalCostIncrease: 25,
	//Card ranks are Starter / Common / Rare. Equipment and relics keep their own three ranks.
	cardPriceArray: {
		starter: 30,
		common: 55,
		rare: 120,
		special: 40,
	},
	//No `uncommon` row: the tier was retired and nothing carries it. See
	//honeycomb.equipmentRarityArray.
	relicPriceArray: {
		starter: 90,
		common: 120,
		rare: 240,
	},
	//Price varies by this fraction either way, rolled from the shop stream.
	priceVariance: 0.15,
};
