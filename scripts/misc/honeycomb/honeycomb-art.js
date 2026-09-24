//===================================================================================================
//HONEYCOMB CATACOMBS -- character art resolution
//===================================================================================================
//Which image to draw for a fighter right now, and what to do when that image does not exist.
//
//THE PROBLEM THIS SOLVES. Art requirements multiply: characters x outfits x health x pose x status
//effects. Drawn naively that is hundreds of images per character. The scheme below keeps the baseline
//at EIGHT images per outfit and makes everything beyond that opt-in.
//
//THE LAYOUT
//  characters/<character>/<outfit>/0-portrait     the face, for rosters and rails
//  characters/<character>/<outfit>/1-basic        standing, healthy
//  characters/<character>/<outfit>/1-damaged      recoiling, healthy
//  characters/<character>/<outfit>/1-offense      attacking, healthy
//  characters/<character>/<outfit>/1-passive      non-attack action, healthy
//  characters/<character>/<outfit>/2-*            the same four, hurt
//  characters/<character>/<outfit>/<state>/1-*    optional art for a specific state
//  enemies/<enemy>/<variant>/...                  identical shape, so one resolver serves both
//
//THE FULL SET, with the backup each one falls to when it is missing:
//  1-basic    teambuilding, no Lust Event ready          2-basic    teambuilding, Lust Event ready (1-basic)
//  1-combat   at rest above half health (1-basic)         2-combat   at rest, half or below (1-combat)
//  1-damaged  hit above half (1-basic, tilted, red)       2-damaged  hit, half or below (1-damaged)
//  1-offense  damage card above half (1-basic, tilted)    2-offense  damage card, half or below (1-offense)
//  1-passive  other card above half (1-basic, leaned)     2-passive  other card, half or below (1-passive)
//  1-broken   Broken cut-in above half (1-basic)          2-broken   Broken cut-in, half or below (1-broken)
//  3-combat, 3-damaged, 3-offense, 3-passive              while Broken (each falls to its 2- pose)
//  exposed    the half-health cut-in (2-combat)           recover    the recovery cut-in, any health
//The tilted `1-` stand-ins are files the placeholder generator writes; every other backup is a step in
//the chain (honeycomb.art.spriteChain, brokenCutInChain, recoverCutInChain, exposedChain).
//
//The numeric prefix is a TIER: 1 healthy, 2 hurt, 3 Broken. The name after it is a POSE. Files therefore
//sort into a readable order inside a folder -- portrait first, then every healthy pose, then every
//hurt pose -- which is what makes an art pass legible.
//
//STATES layer on top and come in three types:
//  filter  the default. No art at all; a CSS filter is applied over the base sprite. Costs ZERO
//          images, which is what keeps the count from ballooning. Most statuses should be this.
//  full    the state supplies its own complete set, healthy and hurt.
//  half    the state supplies ONE set, used at either health tier. Files still use the `1-` prefix;
//          the resolver simply never asks for `2-`.
//
//Only one state is drawn at a time: the highest-priority active one. Death outranks poison.
//
//FALLBACK. Every request produces a CHAIN of candidate paths, walked in order until one loads. A
//character with a single drawn pose still renders correctly everywhere; a missing file degrades to
//something sensible rather than to a hole.
window.honeycomb = window.honeycomb || {};

honeycomb.art = {};

//---------------------------------------------------------------------------------------------------
//Poses
//---------------------------------------------------------------------------------------------------
//`hold` is how long the pose is displayed before reverting to basic, in milliseconds; a null hold
//means the pose is a resting state rather than a beat.
honeycomb.art.poseArray = [
	{ index: "basic", name: "Standing", hold: null },
	//THE COMBAT STANCE. Front-facing art reads badly in a fight -- a row of fighters
	//staring out of the screen rather than at the enemies they are hitting -- so the battle screen
	//rests on `combat` and leaves `basic` to teambuilding, portraits and menus. A drawing with no
	//combat pose yet falls through to `basic` on the usual chain, so nothing breaks while art catches up.
	{ index: "combat", name: "Poised", hold: null, resting: true },
	{ index: "damaged", name: "Recoiling", hold: null, useAnimationTiming: "hitFlashMs" },
	{ index: "offense", name: "Attacking", hold: null, useAnimationTiming: "actionFrameHoldMs" },
	{ index: "passive", name: "Acting", hold: null, useAnimationTiming: "actionFrameHoldMs" },
];

//How long a pose is held. Reads from tuning.animation rather than carrying its own number, so the
//master speed multiplier and the animation block stay the single source of timing.
honeycomb.art.poseHold = function (poseIndex) {
	var pose = honeycomb.findDefinition(honeycomb.art.poseArray, poseIndex);
	if (pose == null) return 0;
	if (pose.hold != null) return pose.hold;
	if (pose.useAnimationTiming == null) return 0;
	return honeycomb.tuning.animation[pose.useAnimationTiming];
};

//The pose a fighter RESTS in, as opposed to the beats it strikes. The first pose marked `resting`
//wins, so moving the stance is a table edit rather than a search for string literals.
//
//ON SINCE THE FILES EXIST. `generate-placeholder-art.py` writes 1-combat and 2-combat for every
//character outfit and every enemy, standing in as a copy of `basic` where no side-facing drawing exists
//yet, which is what makes this safe to turn on.
//
//Turning this on before those files exist means every sprite requests a 1-combat.webp that 404s and
//re-walks its fallback chain on every repaint. Anything that turns this on again must run
//the generator first; the boot-warm test ([82]) fails if a warmed path is missing.
//
//ENEMIES ARE DIFFERENT: the generator writes an enemy `1-combat` and `1-offense` only,
//and an enemy never falls through to `basic`. See honeycomb.art.enemySpriteChain.
honeycomb.art.combatStanceEnabled = true;

honeycomb.art.restingPose = function () {
	if (honeycomb.art.combatStanceEnabled != true) return "basic";
	for (var poseIndex = 0; poseIndex < honeycomb.art.poseArray.length; poseIndex++) {
		if (honeycomb.art.poseArray[poseIndex].resting == true) return honeycomb.art.poseArray[poseIndex].index;
	}
	return "basic";
};

//---------------------------------------------------------------------------------------------------
//Facing
//---------------------------------------------------------------------------------------------------
//A FIGHTER STANDING ON THE WRONG SIDE IS MIRRORED.
//
//The rule is DISPLACEMENT, not side: mirroring by absolute side would flip every enemy in the game,
//since every drawing the project has faces the viewer and each fighter stands in its own
//framed window -- which is what tuning.battleLayout means by "enemy sprites need no mirroring". The
//rule here fires only for a combatant that is somewhere it does not belong, so nothing in an ordinary
//fight moves and a sporeling charmed onto the party's line reads as having changed sides.
//
//The first entities this matters for are the Chessmaster's golems, which stand on EITHER side:
//summoned by Anastasia, or fought in her unlock gauntlet. One drawing, flipped, serves both.
honeycomb.art.mirrorWhenDisplaced = true;

//Where a combatant BELONGS, whatever side it is currently standing on: an enemy definition belongs to
//the enemy line, a character to the party. The two are mutually exclusive on an entity.
honeycomb.art.nativeSideFor = function (entity) {
	if (entity == null) return "ally";
	return entity.enemyIndex != null ? "enemy" : "ally";
};

//WHETHER THIS DRAWING FACES ONE WAY. Mirroring only ever helps art drawn in profile: a
//drawing that faces the VIEWER comes back facing away when it is flipped, and displacement-based
//mirroring reintroduces exactly that for the Chessmaster's pieces -- they are enemy-table entities
//standing on the ALLY side, so they are displaced by construction and would be mirrored in every fight
//they appear in.
//So it is opt-in per definition rather than derived from where the figure is standing. Every drawing
//the project has faces the viewer, so nothing sets it and nothing mirrors; the day a side-facing set
//arrives it is one field on that entry.
honeycomb.art.sideFacingArt = function (entity) {
	var found = honeycomb.entityDefinition(entity);
	var definition = found == null ? null : found.definition;
	return definition != null && definition.sideFacingArt == true;
};

//True when the combatant is standing on the side it does not belong to AND its art is drawn in profile,
//so turning it around is what makes it face the fight rather than what makes it face away.
honeycomb.art.spriteFlipped = function (entity) {
	if (honeycomb.art.mirrorWhenDisplaced != true || entity == null) return false;
	var standingOn = entity.side == "enemy" ? "enemy" : "ally";
	var drawnFor = honeycomb.art.drawnForSide(entity);
	if (drawnFor != null) return standingOn != drawnFor;
	if (honeycomb.art.sideFacingArt(entity) != true) return false;
	return standingOn != honeycomb.art.nativeSideFor(entity);
};

//WHICH LINE A PROFILE DRAWING WAS MADE FOR, when that is not the line its table belongs to.
//Anastasia's pieces are enemy-table entries, but the set was drawn facing right for HER board, so
//fought in the gauntlet they would face away from the party. A
//definition's `drawnForSide` names the line the drawing faces the fight from; standing on the other
//line mirrors it. Null for everything else, which falls back to `sideFacingArt` and the native side.
honeycomb.art.drawnForSide = function (entity) {
	var found = honeycomb.entityDefinition(entity);
	var definition = found == null ? null : found.definition;
	return definition == null || definition.drawnForSide == null ? null : definition.drawnForSide;
};

//The mirror as a CSS custom property value: -1 flips, 1 does not. A PROPERTY rather than a whole
//`transform`, because the wrap's transform already carries the placement scale and offset, and the
//art's own transform is owned by the hit shake and the downed tilt. Writing a transform over either
//is what made fighters jump and resize.
honeycomb.art.spriteMirrorScale = function (entity) {
	return honeycomb.art.spriteFlipped(entity) ? "-1" : "1";
};

//Which pose a card TYPE puts its owner into by default. Offense swings; everything else gestures. The
//answer lives on honeycomb.cardTypeArray, so a new type brings its own pose with it.
honeycomb.art.poseForCardType = function (typeIndex) {
	var type = honeycomb.findDefinition(honeycomb.cardTypeArray, honeycomb.cardTypeAlias(typeIndex));
	return type == null || type.pose == null ? "passive" : type.pose;
};

//HOW AN ACTION LOOKS, for a card, an ability or an enemy's intent: the pose the actor strikes and the
//named animations that play as it lands. Always "its own field first, then its type's default", so the
//defaults cost no data entry and anything may ask for something bespoke:
//  cards      card.pose / card.animationArray, then honeycomb.cardTypeArray
//  abilities  ability.pose / ability.animationArray, then honeycomb.art.abilityPresentation
//  moves      an AI combatant's move is a card, and looks like one
//Animation names resolve against honeycomb.combatScene.namedAnimationArray.
honeycomb.art.presentationFor = function (kindIndex, subject, typeDefinition) {
	var fallback = typeDefinition == null ? {} : typeDefinition;
	var pose = subject != null && subject.pose != null ? subject.pose : (fallback.pose == null ? "passive" : fallback.pose);
	var animationArray = subject != null && subject.animationArray != null
		? subject.animationArray
		: (fallback.animationArray == null ? [] : fallback.animationArray);
	//HOW LONG THE POSE IS HELD, when somebody asks for longer than the pose's own default: the
	//subject's `poseHoldMs`, else its character's. Anastasia's snap is the point of playing her, and the
	//default action frame is over before a summon has finished appearing. Null means the pose's default.
	var holdMs = subject != null && subject.poseHoldMs != null ? subject.poseHoldMs : null;
	if (holdMs == null && subject != null && subject.characterIndex != null && honeycomb.characterArray != null) {
		var character = honeycomb.findDefinition(honeycomb.characterArray, subject.characterIndex);
		if (character != null && character.poseHoldMs != null) holdMs = character.poseHoldMs;
	}
	return { kind: kindIndex, pose: pose, animationArray: animationArray, holdMs: holdMs };
};

honeycomb.art.cardPresentation = function (resolved) {
	return honeycomb.art.presentationFor("card", resolved, resolved == null ? null : honeycomb.cardType(resolved));
};

//An ability is a spell, so by default it gestures and lifts rather than swinging.
honeycomb.art.abilityPresentation = { pose: "passive", animationArray: [{ animation: "rise" }] };

honeycomb.art.abilityPresentationFor = function (definition) {
	return honeycomb.art.presentationFor("ability", definition, honeycomb.art.abilityPresentation);
};

//(An AI combatant's move is a card, so it looks the way honeycomb.art.cardPresentation
//says -- the separate intent presentation went with the intent types.)

//---------------------------------------------------------------------------------------------------
//Health tiers
//---------------------------------------------------------------------------------------------------
//The two HEALTH tiers. The threshold is the fraction of maximum health at or below which a fighter is
//drawn hurt. The third tier, Broken, is not about health: honeycomb.art.brokenTier.
honeycomb.art.tierArray = [
	{ index: 1, name: "Healthy", aboveFraction: 0.5 },
	{ index: 2, name: "Hurt", aboveFraction: 0 },
];

//THE STANDING PICTURE'S TIER IN TEAMBUILDING: 2-basic is used for full body art in teambuilding
//when a Lust Event is ready, backing off to 1-basic otherwise. Health plays no part outside a fight, so
//the standing tier says only whether a Lust Event is waiting for her.
honeycomb.art.lustEventReadyTier = 2;

honeycomb.art.standingTierFor = function (characterIndex) {
	var ready = honeycomb.lustEvents != null && honeycomb.lustEvents.characterState != null &&
		honeycomb.lustEvents.characterState(characterIndex) == "eventReady";
	return ready ? honeycomb.art.lustEventReadyTier : 1;
};

//THE BROKEN TIER: a third state for a character's actions while broken. A Broken character is drawn
//from the `3-` set -- 3-combat, 3-damaged, 3-offense, 3-passive --
//whatever her health, and each falls back to the same pose one tier down (spriteChain). Characters only:
//an enemy that breaks (the Matriarch) keeps its health tier, because enemies draw no `3-` set.
honeycomb.art.brokenTier = { index: 3, name: "Broken" };

honeycomb.art.tierFor = function (entity) {
	if (entity != null && entity.enemyIndex == null && entity.broken == true) return honeycomb.art.brokenTier.index;
	return honeycomb.art.healthTierFor(entity);
};

//The HEALTH tier alone, ignoring Broken: what the Broken cut-in is chosen by (1-broken above half health,
//2-broken at or below it), and what every enemy is drawn by.
honeycomb.art.healthTierFor = function (entity) {
	if (entity == null || entity.maxHealth <= 0) return 1;
	var fraction = Math.max(0, entity.health) / entity.maxHealth;
	for (var tierIndex = 0; tierIndex < honeycomb.art.tierArray.length; tierIndex++) {
		if (fraction > honeycomb.art.tierArray[tierIndex].aboveFraction) return honeycomb.art.tierArray[tierIndex].index;
	}
	return honeycomb.art.tierArray[honeycomb.art.tierArray.length - 1].index;
};

//---------------------------------------------------------------------------------------------------
//States
//---------------------------------------------------------------------------------------------------
//Fields:
//  index       unique id; also the FOLDER NAME for full/half states
//  name        for tooltips
//  type        "filter" | "full" | "half"
//  priority    higher wins when several are active. Death must outrank everything.
//  filter      CSS filter string, for type "filter"
//  reducedFilter  optional; what the reduced-effects path draws instead (honeycomb.reducedEffects). A
//              filter with a blurred drop-shadow names one without the blur: a blur on a full-height
//              sprite is the expensive paint a phone cannot afford on every repaint
//  test(entity) whether the state applies right now
//
//Adding a state is one entry. A `filter` state needs no art whatsoever, which is the intended default:
//reach for `full` or `half` only when a status deserves a drawn pose.
honeycomb.art.stateArray = [
	{
		index: "death",
		name: "Downed",
		type: "filter",
		//Nothing may outrank death. Later entries are spaced so states can be inserted between them.
		priority: 1000,
		filter: "grayscale(1) brightness(0.4)",
		test: function (entity) { return entity.downed == true; },
	},
	{
		index: "poisoned",
		name: "Poisoned",
		type: "filter",
		priority: 500,
		filter: "hue-rotate(55deg) saturate(1.35) brightness(0.92)",
		test: function (entity) { return honeycomb.statusStacks(entity, "poison") > 0; },
	},
	{
		index: "weakened",
		name: "Weakened",
		type: "filter",
		priority: 400,
		filter: "saturate(0.45) brightness(0.85)",
		test: function (entity) { return honeycomb.statusStacks(entity, "weak") > 0; },
	},
	{
		index: "sundered",
		name: "Sundered",
		type: "filter",
		priority: 380,
		filter: "hue-rotate(-25deg) saturate(1.3) contrast(1.08)",
		test: function (entity) { return honeycomb.statusStacks(entity, "sundered") > 0; },
	},
	{
		index: "empowered",
		name: "Empowered",
		type: "filter",
		priority: 300,
		filter: "brightness(1.18) saturate(1.25) drop-shadow(0 0 calc(6 * var(--hc-px)) #e0a04a88)",
		reducedFilter: "brightness(1.18) saturate(1.25)",
		test: function (entity) { return honeycomb.statusStacks(entity, "strength") > 0; },
	},
	{
		index: "bolstered",
		name: "Bolstered",
		type: "filter",
		priority: 200,
		filter: "drop-shadow(0 0 calc(7 * var(--hc-px)) #ffcf5caa)",
		reducedFilter: "brightness(1.08) saturate(1.1)",
		test: function (entity) { return entity.temporaryHealth > 0; },
	},
	{
		//BROKEN OUTRANKS EVERYTHING. A broken fighter is drained of colour and lit from the wrong side,
		//so the board still reads at a glance once the cut-in has gone.
		index: "broken",
		name: "Broken",
		type: "filter",
		priority: 900,
		filter: "saturate(0.45) brightness(0.72) drop-shadow(0 0 calc(10 * var(--hc-px)) #ff3b6baa)",
		reducedFilter: "saturate(0.45) brightness(0.72)",
		//ON STAND-INS ONLY. A fighter showing a DRAWING -- her `3-` set, or the `2-`/`1-` drawing it
		//falls back to -- is not tinted; one showing a generator stand-in is. See isPlaceholderArt.
		placeholderOnly: true,
		test: function (entity) { return entity.broken == true; },
	},
];

//The state a fighter is drawn in right now, or null for none. Highest priority wins.
honeycomb.art.activeState = function (entity) {
	if (entity == null) return null;
	var best = null;
	for (var stateIndex = 0; stateIndex < honeycomb.art.stateArray.length; stateIndex++) {
		var state = honeycomb.art.stateArray[stateIndex];
		if (state.test == null || state.test(entity) != true) continue;
		if (best == null || state.priority > best.priority) best = state;
	}
	return best;
};

//---------------------------------------------------------------------------------------------------
//Path building
//---------------------------------------------------------------------------------------------------
//Root folders, kept as data so the whole art tree can be relocated from one place.
honeycomb.art.rootArray = {
	ally: "characters",
	enemy: "enemies",
};

//The folder holding one fighter's art, without a trailing slash.
//Characters resolve character/outfit; enemies resolve enemy/variant. Both are two levels, so one path
//builder serves both. Chosen by what the fighter IS, never by its team: Severine fighting for the
//other side is still drawn as Severine.
honeycomb.art.baseFolder = function (entity) {
	if (entity == null) return null;
	if (entity.enemyIndex != null) {
		var enemyDefinition = honeycomb.findDefinition(honeycomb.enemyArray, entity.enemyIndex);
		if (enemyDefinition == null) return null;
		//AN ENEMY THAT IS A CHARACTER (`artCharacter`): drawn from that character's default
		//outfit folder, so there is one copy of her art and a new drawing reaches both sides of the board.
		if (enemyDefinition.artCharacter != null) {
			var asCharacter = honeycomb.findDefinition(honeycomb.characterArray, enemyDefinition.artCharacter);
			if (asCharacter != null) return honeycomb.art.characterFolder(asCharacter, asCharacter.defaultOutfit);
		}
		var enemyFolder = enemyDefinition.artFolder == null ? enemyDefinition.index : enemyDefinition.artFolder;
		var variant = enemyDefinition.artVariant == null ? "default" : enemyDefinition.artVariant;
		return honeycomb.art.rootArray.enemy + "/" + enemyFolder + "/" + variant;
	}

	var characterDefinition = honeycomb.findDefinition(honeycomb.characterArray, entity.characterIndex);
	if (characterDefinition == null) return null;
	return honeycomb.art.characterFolder(characterDefinition, entity.outfitIndex);
};

//Split out so the teambuilding screen can build a path for a selection that is not yet a live entity.
honeycomb.art.characterFolder = function (characterDefinition, outfitIndex) {
	if (characterDefinition == null) return null;
	var characterFolder = characterDefinition.artFolder == null ? characterDefinition.index : characterDefinition.artFolder;
	var outfit = honeycomb.findOutfit(characterDefinition, outfitIndex);
	var outfitFolder = outfit == null
		? characterDefinition.defaultOutfit
		: (outfit.artFolder == null ? outfit.index : outfit.artFolder);
	return honeycomb.art.rootArray.ally + "/" + characterFolder + "/" + outfitFolder;
};

//THE ART AN ENEMY HAS. An ordinary enemy is drawn twice, `1-combat` and `1-offense`, and
//that is the whole set (tuning.art.enemySpriteSet). A boss or a special case that
//has earned more says so on its own definition:
//  artPoseArray   the poses it has drawn, e.g. ["combat", "offense", "damaged", "passive"]
//  artTierArray   the health tiers it has drawn, e.g. [1, 2]
//  artPortrait    true when it has a `0-portrait` of its own
//Anything not declared is never asked for, so a missing drawing costs no request and no console error.
honeycomb.art.enemyArtSet = function (enemyIndex) {
	var definition = honeycomb.findDefinition(honeycomb.enemyArray, enemyIndex);
	var defaults = honeycomb.tuning.art.enemySpriteSet;
	return {
		poseArray: definition != null && definition.artPoseArray != null ? definition.artPoseArray : defaults.poseArray,
		tierArray: definition != null && definition.artTierArray != null ? definition.artTierArray : defaults.tierArray,
		portrait: definition != null && definition.artPortrait != null ? definition.artPortrait : defaults.portrait,
	};
};

//An enemy's fallback chain. It ends at the resting pose (`1-combat`), never at `basic`: `basic` is the
//teambuilding standing pose and an enemy never stands in teambuilding. A pose or a hurt tier the enemy
//has not declared is replaced by the resting pose BEFORE a path is built, which is what keeps a hit
//reaction on an enemy with no `damaged` drawing from asking the server for one.
//
//State art is left out on purpose. Every state in stateArray is a `filter`, which tints the sprite and
//has no files; an enemy that ever needs a drawn state adds it here.
honeycomb.art.enemySpriteChain = function (enemyIndex, base, pose, tier) {
	var set = honeycomb.art.enemyArtSet(enemyIndex);
	var floor = honeycomb.art.restingPose();
	var usePose = set.poseArray.indexOf(pose) >= 0 ? pose : floor;
	var useTier = set.tierArray.indexOf(tier) >= 0 ? tier : 1;
	return honeycomb.art.dedupe([
		base + "/" + useTier + "-" + usePose,
		base + "/" + useTier + "-" + floor,
		base + "/1-" + usePose,
		base + "/1-" + floor,
	]);
};

//The files the boot warm fetches for one character: her standing `1-basic` for teambuilding,
//and the picture she RESTS in at each health tier -- which is whatever the chain lands on, `2-combat`
//falling to `1-combat` falling to `1-basic`. Each is the first candidate honeycomb.spriteMetricMap knows
//is on disk, so the warm never asks for a file that is not there. It cannot simply hand-write `1-basic`
//and `2-basic`, since `2-basic` is the Lust-Event-ready picture, not a hurt pose.
honeycomb.art.characterWarmPaths = function (character) {
	if (character == null) return [];
	var folder = honeycomb.art.characterFolder(character, character.defaultOutfit);
	if (folder == null) return [];
	var pathArray = [folder + "/1-basic"];
	var probe = { side: "ally", characterIndex: character.index, outfitIndex: character.defaultOutfit,
		health: 1, maxHealth: 1, temporaryHealth: 0, statusArray: [], downed: false };
	for (var tierIndex = 0; tierIndex < honeycomb.art.tierArray.length; tierIndex++) {
		var chain = honeycomb.art.spriteChain(probe, honeycomb.art.restingPose(),
			{ tier: honeycomb.art.tierArray[tierIndex].index, state: null });
		for (var chainIndex = 0; chainIndex < chain.length; chainIndex++) {
			if (honeycomb.art.canvasSize(chain[chainIndex]) == null) continue;
			pathArray.push(chain[chainIndex]);
			break;
		}
	}
	return honeycomb.art.dedupe(pathArray);
};

//The files the boot warm fetches for one enemy: its resting pose, in each health tier it has drawn.
honeycomb.art.enemyWarmPaths = function (definition) {
	var base = honeycomb.art.baseFolder({ enemyIndex: definition.index });
	if (base == null) return [];
	var set = honeycomb.art.enemyArtSet(definition.index);
	var pathArray = [];
	for (var tierIndex = 0; tierIndex < set.tierArray.length; tierIndex++) {
		pathArray.push(base + "/" + set.tierArray[tierIndex] + "-" + honeycomb.art.restingPose());
	}
	return pathArray;
};

//EVERY ENEMY A FIGHT CAN STILL PUT ON THE BOARD, as sprite paths to warm.
//
//A summoned fighter arrives as an <img> with no picture. `.hcFighter` is `flex: 0 1 auto`, so the row's
//widths are worked out around a newcomer of no size, painted, and worked out again when the picture
//lands. Measured in the battlefield with two ordinary enemies and a third summoned in, cache cold:
//
//    before the summon          278x406
//    while the picture loads    265x387     <- held for the whole fetch
//    settled                    173x252
//
//The head Gardener's Plant, which summons two Puffcaps, shows this: enemies pop in a similar manner
//to players the first time it plays in a fight, because afterwards the picture is in the browser's
//cache and the newcomer has its size in the frame it appears in.
//
//The boot warm already asks for every enemy, but it is deliberately gentle -- six at a time, 140ms
//apart, and it stands down on a slow connection -- so a fight entered soon after boot reaches a summon
//before the warm reaches that enemy. This is the same pictures, asked for at the moment they are known
//to be needed: the start of the fight that can summon them.
//
//It reads the MOVES, not a hand-written list, so a new summon added to a card is warmed without anyone
//remembering to come back here.
honeycomb.art.summonableEnemyArray = function (combat) {
	var found = {};
	var sideArray = combat == null ? [] : (combat.enemyArray == null ? [] : combat.enemyArray);
	var cardArray = honeycomb.cardArray == null ? [] : honeycomb.cardArray;

	for (var sideIndex = 0; sideIndex < sideArray.length; sideIndex++) {
		var enemyIndex = sideArray[sideIndex].enemyIndex;
		if (enemyIndex == null) continue;
		for (var cardIndex = 0; cardIndex < cardArray.length; cardIndex++) {
			var card = cardArray[cardIndex];
			if (card.enemyIndex !== enemyIndex) continue;
			var effectArray = card.effectArray == null ? [] : card.effectArray;
			for (var effectIndex = 0; effectIndex < effectArray.length; effectIndex++) {
				var effect = effectArray[effectIndex];
				if (effect == null || effect.index !== "summonEnemy" || effect.enemy == null) continue;
				found[effect.enemy] = true;
			}
		}
	}

	//Anything already standing is already drawn, so warming it again is a request for nothing.
	for (var standingIndex = 0; standingIndex < sideArray.length; standingIndex++) {
		delete found[sideArray[standingIndex].enemyIndex];
	}

	var resultArray = [];
	for (var key in found) if (Object.prototype.hasOwnProperty.call(found, key)) resultArray.push(key);
	return resultArray;
};

//The sprite paths those enemies would be asked for: the resting pose they appear in, and the attack
//pose they play on their first turn, which is the second picture a summon needs.
honeycomb.art.summonWarmPaths = function (combat) {
	var enemyArray = honeycomb.art.summonableEnemyArray(combat);
	var pathArray = [];
	for (var scanIndex = 0; scanIndex < enemyArray.length; scanIndex++) {
		var definition = honeycomb.findDefinition(honeycomb.enemyArray, enemyArray[scanIndex]);
		if (definition == null) continue;
		var base = honeycomb.art.baseFolder({ enemyIndex: definition.index });
		if (base == null) continue;
		var set = honeycomb.art.enemyArtSet(definition.index);
		for (var poseIndex = 0; poseIndex < set.poseArray.length; poseIndex++) {
			pathArray.push(base + "/1-" + set.poseArray[poseIndex]);
		}
	}
	return honeycomb.art.dedupe(pathArray);
};

//The fallback chain for one sprite request, most specific first.
//
//Every step is a real, checkable path; the <img> walks them in order until one loads. The order
//encodes what to give up first: the state's art before the pose, the pose before the health tier, the
//health tier before the outfit. Losing the outfit is the last resort because it changes who the
//character appears to be.
honeycomb.art.spriteChain = function (entity, poseIndex, options) {
	var settings = options == null ? {} : options;
	var base = honeycomb.art.baseFolder(entity);
	if (base == null) return [];

	var tier = settings.tier == null ? honeycomb.art.tierFor(entity) : settings.tier;
	var pose = poseIndex == null ? "basic" : poseIndex;
	var state = settings.state === undefined ? honeycomb.art.activeState(entity) : settings.state;

	//An enemy has its own, much shorter chain, and `basic` is never part of it.
	if (entity.enemyIndex != null) return honeycomb.art.enemySpriteChain(entity.enemyIndex, base, pose, tier);

	var chain = [];

	//1-2. State art, when the state declares any. A `filter` state deliberately contributes nothing
	//here -- it is drawn by tinting the base sprite instead, which is why it costs no images.
	if (state != null && state.type != "filter") {
		//A half state has only the tier-1 set, so it is never asked for tier 2.
		var stateTier = state.type == "half" ? 1 : tier;
		chain.push(base + "/" + state.index + "/" + stateTier + "-" + pose);
		chain.push(base + "/" + state.index + "/" + stateTier + "-basic");
		//A full state missing its hurt set falls back to its healthy set before leaving the state.
		if (state.type == "full" && stateTier != 1) {
			chain.push(base + "/" + state.index + "/1-" + pose);
			chain.push(base + "/" + state.index + "/1-basic");
		}
	}

	//3-4. The outfit's own art: the SAME POSE one tier down at a time, then the standing drawing. This is
	//the list of backups, in which every tier falls back to the tier below it:
	//  3-combat -> 2-combat -> 1-combat -> 1-basic     (and the same for damaged, offense, passive)
	//  2-basic  -> 1-basic                              (teambuilding while a Lust Event is ready)
	//A pose never drops to `2-basic` on the way: `2-basic` is the Lust-Event-ready picture, not a hurt
	//standing pose. The tilted and reddened stand-ins named for a missing `1-damaged`,
	//`1-offense` and `1-passive` are FILES, written by generate-placeholder-art.py, so this chain finds
	//them at `1-<pose>` like a drawing.
	for (var tierStep = tier; tierStep >= 1; tierStep--) chain.push(base + "/" + tierStep + "-" + pose);
	chain.push(base + "/1-basic");

	//5. The character's default outfit, for an outfit with no art at all yet.
	if (entity != null && entity.enemyIndex == null && entity.characterIndex != null) {
		var characterDefinition = honeycomb.findDefinition(honeycomb.characterArray, entity.characterIndex);
		if (characterDefinition != null) {
			var defaultBase = honeycomb.art.characterFolder(characterDefinition, characterDefinition.defaultOutfit);
			if (defaultBase != base) {
				chain.push(defaultBase + "/1-" + pose);
				chain.push(defaultBase + "/1-basic");
			}
		}
	}

	return honeycomb.art.dedupe(chain);
};

//THE EXPOSED CUT-IN'S OWN PICTURE. One per character AND OUTFIT, used by nothing else:
//the outfit folder's `exposed`, then `2-combat` and its own chain, so
//a character with no exposed art drawn still gets the cut-in.
honeycomb.art.exposedChain = function (entity) {
	var chain = [];
	var base = honeycomb.art.baseFolder(entity);
	if (base != null) chain.push(base + "/exposed");
	var hurtChain = honeycomb.art.spriteChain(entity, "combat", { tier: 2, state: null });
	for (var scanIndex = 0; scanIndex < hurtChain.length; scanIndex++) chain.push(hurtChain[scanIndex]);
	return honeycomb.art.dedupe(chain);
};

//THE BROKEN CUT-IN'S PICTURE, PER OUTFIT AND BY HEALTH:
//  1-broken  the cut-in used when reaching broken status while above half health (backup: 1-basic)
//  2-broken  the cut-in used when reaching broken status while below half health (backup: 1-broken)
//Chosen by the HEALTH tier at the moment she breaks, never the Broken tier -- the cut-in is what plays
//as she crosses into it. After the outfit's own art come the default outfit's, then the older
//per-character `brokenArtPath`, which is also how an enemy that breaks (the Matriarch) is drawn.
honeycomb.art.brokenCutInChain = function (entity, definition) {
	var chain = [];
	if (entity != null && entity.enemyIndex == null && entity.characterIndex != null) {
		var healthTier = honeycomb.art.healthTierFor(entity);
		var base = honeycomb.art.baseFolder(entity);
		if (base != null) {
			for (var tierStep = healthTier; tierStep >= 1; tierStep--) chain.push(base + "/" + tierStep + "-broken");
			chain.push(base + "/1-basic");
		}
		honeycomb.art.pushDefaultOutfit(chain, entity, ["1-broken", "1-basic"]);
	}
	if (definition != null && definition.brokenArtPath != null) chain.push(definition.brokenArtPath);
	return honeycomb.art.dedupe(chain);
};

//THE RECOVERY CUT-IN'S PICTURE, PER OUTFIT: recover images do not account for health, and recover and
//broken poses are outfit-specific. The outfit's `recover`, then the default outfit's, then the older
//per-character `recoverArtPath`. Never the broken art, and never a combat pose: recovery shows her own
//face, not her worst moment.
honeycomb.art.recoverCutInChain = function (entity, definition) {
	var chain = [];
	if (entity != null && entity.enemyIndex == null && entity.characterIndex != null) {
		var base = honeycomb.art.baseFolder(entity);
		if (base != null) chain.push(base + "/recover");
		honeycomb.art.pushDefaultOutfit(chain, entity, ["recover"]);
	}
	if (definition != null && definition.recoverArtPath != null) chain.push(definition.recoverArtPath);
	return honeycomb.art.dedupe(chain);
};

//Appends the character's DEFAULT outfit's version of each named file, for an outfit that has none drawn.
honeycomb.art.pushDefaultOutfit = function (chain, entity, nameArray) {
	var characterDefinition = honeycomb.findDefinition(honeycomb.characterArray, entity.characterIndex);
	if (characterDefinition == null) return;
	var defaultBase = honeycomb.art.characterFolder(characterDefinition, characterDefinition.defaultOutfit);
	if (defaultBase == null || defaultBase == honeycomb.art.baseFolder(entity)) return;
	for (var nameIndex = 0; nameIndex < nameArray.length; nameIndex++) chain.push(defaultBase + "/" + nameArray[nameIndex]);
};

//The portrait chain. Same fallback thinking, one step shorter.
honeycomb.art.portraitChain = function (characterIndex, outfitIndex) {
	var characterDefinition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	if (characterDefinition == null) return [];
	var base = honeycomb.art.characterFolder(characterDefinition, outfitIndex);
	var defaultBase = honeycomb.art.characterFolder(characterDefinition, characterDefinition.defaultOutfit);

	var chain = [base + "/0-portrait", base + "/1-basic"];
	if (defaultBase != base) chain.push(defaultBase + "/0-portrait", defaultBase + "/1-basic");
	return honeycomb.art.dedupe(chain);
};

//Enemy portraits, for anywhere an enemy needs a face rather than a body.
honeycomb.art.enemyPortraitChain = function (enemyIndex) {
	var definition = honeycomb.findDefinition(honeycomb.enemyArray, enemyIndex);
	if (definition == null) return [];
	var base = honeycomb.art.baseFolder({ enemyIndex: enemyIndex });
	if (base == null) return [];
	//An ordinary enemy has no portrait file, so its face is its `1-combat` drawing and `0-portrait` is
	//only asked for when the definition says it exists (`artPortrait`). See honeycomb.art.enemyArtSet.
	var chain = [base + "/1-" + honeycomb.art.restingPose()];
	if (honeycomb.art.enemyArtSet(enemyIndex).portrait == true) chain.unshift(base + "/0-portrait");
	return chain;
};

honeycomb.art.dedupe = function (pathArray) {
	var result = [];
	for (var scanIndex = 0; scanIndex < pathArray.length; scanIndex++) {
		if (result.indexOf(pathArray[scanIndex]) < 0) result.push(pathArray[scanIndex]);
	}
	return result;
};

//The picture a fighter is showing at rest: the first candidate of her resting chain that is on disk,
//read off honeycomb.spriteMetricMap so it costs no request. Null when the table knows none of them.
honeycomb.art.shownRestingPath = function (entity) {
	if (entity == null) return null;
	var chain = honeycomb.art.spriteChain(entity, honeycomb.art.restingPose(), { state: null });
	for (var chainIndex = 0; chainIndex < chain.length; chainIndex++) {
		if (honeycomb.art.canvasSize(chain[chainIndex]) != null) return chain[chainIndex];
	}
	return null;
};

//Whether a picture is a stand-in the placeholder generator wrote: the third value in its
//honeycomb.spriteMetricMap row (generate-sprite-metrics.js reads each folder's .generated.txt). A path
//the table does not know answers false. Rerun the metrics tool after art lands.
honeycomb.art.isPlaceholderArt = function (path) {
	var map = honeycomb.spriteMetricMap;
	if (map == null || path == null) return false;
	var row = map[String(path).replace(/\.(webp|png)$/i, "")];
	return row != null && row[2] === 1;
};

//The CSS filter for a fighter's current state, or "none".
honeycomb.art.stateFilter = function (entity) {
	var state = honeycomb.art.activeState(entity);
	//Only `filter` states tint. A state with its own art is already drawn correctly and must not be
	//tinted on top of it.
	if (state == null || state.type != "filter" || state.filter == null) return "none";
	if (state.placeholderOnly == true) {
		var shownPath = honeycomb.art.shownRestingPath(entity);
		if (shownPath != null && honeycomb.art.isPlaceholderArt(shownPath) != true) return "none";
	}
	if (state.reducedFilter != null && honeycomb.reducedEffects != null && honeycomb.reducedEffects() == true) return state.reducedFilter;
	return state.filter;
};

//---------------------------------------------------------------------------------------------------
//Chained <img>
//---------------------------------------------------------------------------------------------------
//An image that walks a list of candidates until one loads, then stops. The remaining candidates ride
//on the element as a data attribute, so this works from a plain HTML string with no per-element
//JavaScript wiring.
//
//Paths are joined with a character that cannot appear in one, so splitting is unambiguous.
honeycomb.art.chainSeparator = "|";

//A CHAIN WITH THE KNOWN MISSES DROPPED. Anything that failed earlier this session is left out before
//an element asks for it, so nothing re-requests a file that is not there. Shared by the tag built on a
//repaint AND the live pose swap: without this, an enemy with no `combat` drawing would be set to a path
//that 404s on EVERY beat and stand blank until the server answers.
//A CHAIN THAT IS MISSING THROUGHOUT COMES BACK EMPTY. Coming back holding its last candidate instead
//would mean a fighter with no file at all asks the server for the same missing file on EVERY repaint --
//hundreds of 404s and a lagging browser each time the enemy folder is thin on art. Both callers instead
//draw the generated placeholder outright for an empty chain (chainTag, and combatScene.applyPose), which
//costs no request.
honeycomb.art.liveChain = function (pathArray) {
	var liveArray = [];
	for (var scanIndex = 0; scanIndex < (pathArray == null ? 0 : pathArray.length); scanIndex++) {
		if (honeycomb.ui.missingPathArray[pathArray[scanIndex]] === true) continue;
		liveArray.push(pathArray[scanIndex]);
	}
	return liveArray;
};

honeycomb.art.chainTag = function (pathArray, options) {
	var settings = options == null ? {} : options;
	if (pathArray == null || pathArray.length === 0) {
		return honeycomb.imageTag(null, settings);
	}

	var liveArray = honeycomb.art.liveChain(pathArray);

	//THE CANVAS CORRECTION RIDES IN THE TAG. Written here rather than left to the element's
	//`load`, so the very first frame a fighter is painted in is already the right size. See
	//honeycomb.art.applyCanvas for the three pops this removes.
	var canvasSize = settings.normaliseCanvas == true && liveArray.length > 0
		? honeycomb.art.canvasSize(liveArray[0]) : null;
	var canvasStyle = canvasSize == null ? null
		: honeycomb.art.canvasWidthPercent(canvasSize.width, canvasSize.height);
	var styleText = (settings.style == null ? "" : settings.style) +
		(canvasStyle == null ? "" : (settings.style == null || settings.style === "" ? "" : "; ") + "max-width:" + canvasStyle);

	var attributes = "";
	if (settings.id) attributes += ' id="' + settings.id + '"';
	if (settings.className) attributes += ' class="' + settings.className + '"';
	if (styleText !== "") attributes += ' style="' + honeycomb.escapeAttribute(styleText) + '"';
	if (settings.extra) attributes += " " + settings.extra;

	//Every candidate is already known to be missing: the generated placeholder is drawn outright, naming
	//the most specific path that was wanted, and nothing is requested. It keeps the chain on the element
	//so a later pose swap still finds it.
	if (liveArray.length === 0) {
		return '<img src="' + honeycomb.placeholderArt(pathArray[0]) + '"' + attributes +
			' alt="' + honeycomb.escapeAttribute(settings.alt == null ? "" : settings.alt) + '"' +
			' decoding="async"' +
			' data-honeycombchain=""' +
			' data-honeycombchainat="0">';
	}

	return '<img src="' + honeycomb.image(liveArray[0]) + '"' + attributes +
		' alt="' + honeycomb.escapeAttribute(settings.alt == null ? "" : settings.alt) + '"' +
		' decoding="async"' +
		' data-honeycombchain="' + honeycomb.escapeAttribute(liveArray.join(honeycomb.art.chainSeparator)) + '"' +
		' data-honeycombchainat="0"' +
		//Only where the table had no answer: a measured path needs nothing on load.
		(settings.normaliseCanvas == true && canvasSize == null ? ' onload="honeycomb.art.normaliseCanvas(this)"' : "") +
		' onerror="honeycomb.art.onChainError(this)">';
};

//THE CANVAS DECIDES THE SIZE, AND IT MUST NOT DECIDE THE HEIGHT.
//
//It is an ENGINE bug, measured. `.hcFighterArt` carries `max-height: var(--hc-ally-sprite-height)`, a
//PERCENTAGE, and its containing block has no definite height -- so the cap resolves to none and never
//applies. What actually governs is `max-width: 150%`. A sprite is therefore sized by its WIDTH, and a
//canvas of a different shape draws a different HEIGHT: her crouch poses are 650x1300 against the combat
//pose's 832x1216, so at the same width they drew 458px tall against 335px. Measured at 1024x768.
//
//ART-GUIDE.md already states the rule this restores -- "The canvas is the scale... Draw every enemy on
//the shared 832x1216 canvas at its intended size". A drawing delivered on another canvas is normalised
//to it here instead of being redrawn: the width cap is scaled by how much squarer or narrower this
//canvas is than the shared one, which makes the HEIGHT come out the same and leaves how much of its own
//frame the figure fills -- the artist's actual intent -- untouched.
//
//A canvas that already matches is scaled by exactly 1, so nothing that was right changes.
//
//THE CANVAS IS KNOWN BEFORE THE PICTURE IS. `honeycomb.spriteMetricMap`
//(honeycomb-sprite-metrics.js, generated from the files on disk) holds every drawing's canvas, so the
//correction can be written into the tag instead of waiting for a `load`. `normaliseCanvas` below is the
//fallback for a path the table does not know; a table that has not been regenerated since art landed
//costs the old behaviour for that one picture and nothing else.
//
//WHAT THAT DOES AND DOES NOT FIX, measured rather than reasoned about:
//
//  - A POSE SWAP WAS NEVER BROKEN. Setting `src` does not clear the picture, so the element's stale
//    correction belongs to the drawing still on screen and the two change together in one step. Writing
//    the incoming correction early is what breaks it. The numbers are in combatScene.applyPose.
//  - A REPAINT WAS NOT BROKEN EITHER. `load` fires before the browser paints the new picture, so no
//    wrong frame reached the screen. Measured with a warm cache, a fighter tag drew one stable size with
//    the correction in the tag and with it deferred to `load`. Writing it into the tag is still better:
//    it removes a per-sprite callback and puts the size in the DOM where it can be read.
//  - A SUMMON IS REAL AND IS NOT FIXED HERE. A newcomer whose picture has not arrived has no size, and
//    `.hcFighter` is `flex: 0 1 auto`, so the row is laid out around it twice.
//    Measured, cache cold: the two standing fighters held 265x387 for the whole fetch and then
//    settled at 173x252. The fix is to have the picture already there -- honeycomb.art.summonWarmPaths,
//    warmed when the fight opens. FIRST time only, because after that the picture is cached.

//The canvas a drawing is on, as {width, height}, or null when nothing on disk was measured for it.
//Keyed by CONTENT path, the same string a chain holds: no folder, no extension.
honeycomb.art.canvasSize = function (path) {
	if (path == null || path === "") return null;
	var map = honeycomb.spriteMetricMap;
	if (map == null) return null;
	var cleaned = String(path).replace(honeycomb.imageFolder + "/", "").replace(/\.(webp|png|jpg|jpeg|gif)$/i, "");
	var size = map[cleaned];
	if (size == null || size.length < 2 || size[0] <= 0 || size[1] <= 0) return null;
	return { width: size[0], height: size[1] };
};

//The width cap this canvas needs so it draws the same HEIGHT as the shared one, as a CSS percentage
//string -- or null when it is within a hair of the shared shape and needs no style at all.
honeycomb.art.canvasWidthPercent = function (width, height) {
	var shared = honeycomb.tuning.art.spriteCanvas;
	if (shared == null || shared.width <= 0 || shared.height <= 0) return null;
	if (width == null || height == null || width <= 0 || height <= 0) return null;
	var factor = (width / height) / (shared.width / shared.height);
	//Left alone within a hair of the shared canvas, so a one-pixel export difference writes no style.
	if (Math.abs(factor - 1) < honeycomb.tuning.art.spriteCanvasTolerance) return null;
	return (honeycomb.tuning.art.spriteMaxWidthPercent * factor) + "%";
};

//Puts the correction for a KNOWN path onto an element without waiting for anything. Returns true when
//the table knew the path, so the caller can tell whether the load-time fallback is still needed.
//
//ONLY FOR AN ELEMENT WITH NO PICTURE ON SCREEN: one being built, or one whose source just 404'd. A
//POSE SWAP MUST NOT USE THIS. Setting `src` does not clear the picture -- the browser keeps painting
//the old one until the new one arrives -- so a correction written early lands on the wrong drawing and
//dips it for the whole of the load. Measured both ways in combatScene.applyPose, which has the numbers.
honeycomb.art.applyCanvas = function (element, path) {
	if (element == null || element.style == null) return false;
	var size = honeycomb.art.canvasSize(path);
	if (size == null) return false;
	var percent = honeycomb.art.canvasWidthPercent(size.width, size.height);
	if (percent == null) element.style.removeProperty("max-width");
	else element.style.maxWidth = percent;
	return true;
};

//NOT DONE HERE, AND IT WAS TRIED: writing the canvas onto the element as `width` and
//`height` attributes, so a sprite whose picture has not arrived still reserves its space and a summon
//does not re-lay the row. It does not work, twice over. Those attributes are PRESENTATIONAL HINTS, so
//`height="1300"` set a literal 1300px box wherever the stylesheet had not declared a height -- measured,
//five times the intended size. Declaring `height: auto` fixes that and then kills the reservation with
//it, because an aspect ratio alone gives no width to an element whose width is `auto`. Measured with a
//cold cache, a summon moved the two standing fighters from 278x406 to 265x387 for the whole fetch with
//the attributes exactly as without them. What does fix it is the picture already being there:
//honeycomb.art.summonWarmPaths, asked for when the fight opens.

//The fallback: measure the picture that just loaded. Used only where the table had no answer. What it
//learns is written back into the table, so the SECOND time that path is shown it is known in advance.
honeycomb.art.normaliseCanvas = function (element) {
	if (element == null || element.naturalWidth == null || element.naturalHeight <= 0) return;
	var percent = honeycomb.art.canvasWidthPercent(element.naturalWidth, element.naturalHeight);
	if (percent == null) element.style.removeProperty("max-width");
	else element.style.maxWidth = percent;
	//Remembered under the path actually being shown, so a later swap back to it needs no load. Guarded:
	//this is also called on a bare {naturalWidth, naturalHeight, style} stand-in by the suite, and by any
	//caller that has a measurable picture but no chain on it.
	if (element.getAttribute == null) return;
	var stored = honeycomb.art.readChain(element);
	var shownPath = stored.chain[stored.position];
	if (shownPath != null && honeycomb.spriteMetricMap != null && honeycomb.art.canvasSize(shownPath) == null) {
		honeycomb.spriteMetricMap[String(shownPath).replace(honeycomb.imageFolder + "/", "")] =
			[element.naturalWidth, element.naturalHeight];
	}
};

//THE CHAIN ON AN ELEMENT IS READ AND WRITTEN IN ONE PLACE.
//
//The tag writes `data-honeycombChain` in an HTML string. The HTML parser lowercases attribute names, so
//that attribute is `dataset.honeycombchain`. Every script that wrote the chain afterwards used
//`dataset.honeycombChain`, which is a DIFFERENT attribute (`data-honeycomb-chain`), and the reader looked
//at the lowercase one first. So the reader always saw the tag's original chain at position 0, whatever
//had been written since. Two things followed, and together they were the 404 flood:
//  - A chain with two missing files never finished. The walk wrote position 1, read position 0 back,
//    and set the same missing source again on every error, without end.
//  - After a live pose swap, a missing `1-offense` was recorded as a missing `1-combat`, because the
//    stale chain's first entry was `1-combat`. The enemy's one good drawing was then skipped for the rest
//    of the session, which is how `1-basic` came to look load-bearing.
//Both names are the lowercase attribute now, through these two functions and nothing else.
honeycomb.art.readChain = function (element) {
	var raw = element.getAttribute("data-honeycombchain") || "";
	var position = parseInt(element.getAttribute("data-honeycombchainat") || "0", 10);
	return { chain: raw === "" ? [] : raw.split(honeycomb.art.chainSeparator), position: isNaN(position) ? 0 : position };
};

honeycomb.art.writeChain = function (element, pathArray, position) {
	element.setAttribute("data-honeycombchain", (pathArray == null ? [] : pathArray).join(honeycomb.art.chainSeparator));
	element.setAttribute("data-honeycombchainat", String(position == null ? 0 : position));
};

//Advances to the next candidate. Records each miss so later renders skip it entirely.
honeycomb.art.onChainError = function (element) {
	if (element == null || element.getAttribute == null) return;
	var stored = honeycomb.art.readChain(element);
	var chain = stored.chain;
	var position = stored.position;

	//Remember the path that just failed, so the whole session stops asking for it.
	if (chain[position] != null) honeycomb.ui.missingPathArray[chain[position]] = true;

	position += 1;
	if (position < chain.length) {
		honeycomb.art.writeChain(element, chain, position);
		//The next candidate is a DIFFERENT drawing on a possibly different canvas, so its correction is
		//written before it is requested, exactly as a pose swap writes one. Without this the element kept
		//the correction of the file that just 404'd.
		if (!honeycomb.art.applyCanvas(element, chain[position])) {
			element.onload = function () { honeycomb.art.normaliseCanvas(element); };
		}
		element.src = honeycomb.image(chain[position]);
		return;
	}

	//Chain exhausted. Draw the generated placeholder naming the most specific path that was wanted,
	//so an art pass can see what is missing rather than a blank box.
	element.onerror = null;
	element.src = honeycomb.placeholderArt(chain.length > 0 ? chain[0] : "sprite");
};

//---------------------------------------------------------------------------------------------------
//Convenience builders
//---------------------------------------------------------------------------------------------------
//A fighter's body, in its current state, tier and pose.
honeycomb.art.spriteTag = function (entity, poseIndex, options) {
	var settings = options == null ? {} : options;
	var chain = honeycomb.art.spriteChain(entity, poseIndex, settings);
	//A SPRITE is the one drawing whose canvas has to agree with everybody else's, because it stands in a
	//line beside them. See honeycomb.art.normaliseCanvas. Portraits, card art and icons are framed by
	//their own boxes and are left alone.
	if (settings.normaliseCanvas == null) settings.normaliseCanvas = true;
	return honeycomb.art.chainTag(chain, settings);
};

//A party member's face.
honeycomb.art.portraitTag = function (characterIndex, outfitIndex, options) {
	return honeycomb.art.chainTag(honeycomb.art.portraitChain(characterIndex, outfitIndex), options);
};
