//===================================================================================================
//HONEYCOMB CATACOMBS -- tuning
//===================================================================================================
//Every number the game runs on. Nothing outside this file may contain a bare numeric literal that a
//designer would ever want to change; if a value is worth arguing about, it belongs here with a name.
//
//The split is by SYSTEM, not by screen, so a balance pass touches one block rather than hunting
//through render code. Values that describe a shape rather than a balance choice (frame geometry,
//sprite aspect ratios) live here too, because they are measured facts about assets and will change
//when the assets do.
window.honeycomb = window.honeycomb || {};

honeycomb.tuning = {

	//-------------------------------------------------------------------------------------------
	//DOM identity
	//-------------------------------------------------------------------------------------------
	//Element ids and class names honeycomb creates. Kept as data so the CSS file and the JS can be
	//checked against one another, and so a host with a conflicting id can be accommodated without a
	//search-and-replace.
	dom: {
		rootId: "honeycombRoot",
		rootClass: "honeycombRoot",
		scenePrefix: "honeycombScene-",

		overlayHostId: "honeycombOverlayHost",
		overlayHostClass: "honeycombOverlayHost",
		overlayClass: "honeycombOverlay",
		overlayPrefix: "honeycombOverlay-",
		overlayIdPrefix: "honeycombOverlayLayer-",
		//Overlays stack from here upward. Above the root, below nothing else honeycomb owns.
		overlayBaseZ: 100,

		//The hover tooltip panel, hung on the overlay host so it is never clipped by a panel.
		tooltipId: "honeycombTooltip",
		//The row of cards waiting to be played, over the middle of the battlefield. Hung on the ROOT
		//rather than the hand bar, which a repaint replaces wholesale.
		playQueueId: "honeycombPlayQueue",
		//The progression tree's large card preview, shown below the node tooltip.
		treeCardPreviewId: "honeycombTreeCardPreview",
		//The "turn your device sideways" note, shown by CSS on a narrow screen held upright.
		rotateHintId: "honeycombRotateHint",
		//Disabled. Kept for a future "use the app or play fullscreen" note; until that exists, the
		//game is simply played in whatever orientation the device is in.
		rotateHintEnabled: false,

		//Class applied to the dragged card while a drag is live. Deliberately NOT "puzzle-piece":
		//Syrup Town's Jiggy minigame keeps permanent document-level mousemove/mouseup/wheel handlers
		//that walk getElementsByClassName('puzzle-piece'). Any honeycomb element carrying that class
		//would be dragged by Jiggy as well. Honeycomb also uses pointer events with pointer capture
		//rather than document-level mouse handlers, so the two systems never see each other's input.
		dragActiveClass: "honeycombDragging",
	},

	//-------------------------------------------------------------------------------------------
	//Randomness
	//-------------------------------------------------------------------------------------------
	rng: {
		//mulberry32's fixed advance per call. Changing this invalidates every recorded seed.
		mulberryStep: 0x6D2B79F5,
		//Mixed into a stream name to derive that stream's seed from the run seed.
		seedMixPrime: 0x01000193,
		//Range of the random component of a generated run seed.
		seedSpread: 0xFFFFFF,
		//Weight assumed for a weighted-table entry that does not declare one.
		defaultWeight: 1,

		//Named streams. Each system draws from its own so that adding a random call in one place
		//cannot shift results anywhere else. Add freely; streams are created on first use.
		streamArray: {
			map: "map",              //map layout and node type placement
			mapEvent: "mapEvent",    //which event fires on an event node
			encounter: "encounter",  //which enemy group an combat node fields
			shuffle: "shuffle",      //draw pile shuffling
			combat: "combat",        //in-combat rolls: enemy intent choice, random targeting
			reward: "reward",        //post-combat card and item offers
			shop: "shop",            //shop stock
		lustEvent: "lustEvent",  //whether a weakness rank-up raises a Lust Event, and which one
		startingCard: "startingCard", //the default outfit's run-start random cards, and random-common replace nodes
	},
	},

	//-------------------------------------------------------------------------------------------
	//Save data
	//-------------------------------------------------------------------------------------------
	//Honeycomb keeps its own localStorage namespace rather than living inside Syrup Town's `data`.
	//Two reasons: a Honeycomb save is a different shape and lifecycle to a Syrup Town save, and
	//keeping them apart means uninstalling honeycomb cannot corrupt a story save.
	save: {
		keyPrefix: "honeycombSave",
		metaPrefix: "honeycombMeta",
		//Slot 0 is the autosave the game writes to on its own. Manual slots start at 1.
		autosaveSlot: 0,
		manualSlotCount: 6,
		//Bumped whenever the save shape changes in a way older saves cannot be read through.
		//3: enemy moves became cards (honeycomb.save.migrationArray).
		//5: Status cards became Curses (the Wisp's index was renamed).
		//6: six older outfits were retired.
		//7: art pass, the vampire Vex was renamed Severine, index included.
		//8: art pass, Cassadora's heirloom `oracleSkull` was renamed `crystalBall`.
		//9: every character's base health became one shared number, Vigour's rank ceiling
		//   became what separates them, and starting gold dropped to 30. No shape changed, but a
		//   profile saved before it records health and progression that no longer mean the same thing.
		//10: Lust Events became a QUEUE. The event frozen onto each rank-up record, the tally
		//   of events raised and completed, and the fired-milestone list are all gone; what survives is a
		//   LIST of the rows played through. See the toVersion 10 step in honeycomb.save.migrationArray.
		formatVersion: 10,
		//Saves older than this are discarded, not migrated.
		//
		//Migration exists to carry a save across a SHAPE change, and it still does -- the steps in
		//honeycomb.save.migrationArray are unchanged and still tested. This is a different question:
		//an alpha save can be read perfectly and still be meaningless, because the content under it
		//has been replaced wholesale (the card pool, the progression trees, the enemy roster, and now
		//the health baseline). Carrying one forward produces a profile that looks valid and is not.
		//
		//A save below this version is deleted from storage on the first load that meets it, so it
		//cannot come back, and the player starts a clean profile. Raise it whenever a content wave
		//makes older profiles untrustworthy; leaving it equal to formatVersion is the strict setting.
		//
		//It governs STORED SLOTS only. A save pasted in as text, or read out of a bug report, still
		//migrates however old it is -- that is a developer reading a report, not a player resuming.
		staleBeforeVersion: 9,
		//The `kind` written on a copied-out bug report, which is a save wrapped with what a bug needs
		//beside it. See honeycomb.save.toReportText.
		reportKind: "honeycombReport",
		//How many of the page's most recent errors a report carries.
		reportErrorLimit: 20,
		//The packed save: Copy / Load Save hands out the bug report deflated and written as base64, which
		//measured 7,812 characters against 29,746 for the same report as plain JSON (`honey save.txt`).
		//Nothing is dropped, so it loads back to exactly the same state. The text starts with this
		//marker, which is how a load tells a packed save from plain JSON. Stored slots stay plain JSON.
		packedPrefix: "HC1~",
		//The format name handed to the browser's CompressionStream. "deflate" rather than "deflate-raw":
		//the raw form saves 8 characters but Chrome before 103 and Node 18 (which the tools run on)
		//refuse the name, while "deflate" works everywhere CompressionStream exists.
		packedFormat: "deflate",
		//Save to .noodle file, the same button Syrup Town has. The file holds the packed text, so the
		//file and the copy box always hold the same thing and either one loads.
		fileNamePrefix: "Honeycomb ",
		fileExtension: ".noodle",
		//How many characters of base64 are built per call when a packed save is turned into text.
		//String.fromCharCode.apply takes its argument list on the stack, and a whole save in one call
		//overflows it on some phones.
		packedChunkLength: 8192,
		//Autosave points. Each is checked by name at the site that would trigger it.
		//
		//NOTE the absence of a mid-turn point. A combat may only be saved while it is in a STABLE
		//phase -- one that accepts input. Saving during "endingPlayerTurn" or "enemyTurn" produced an
		//unrecoverable game: reloading resumed a board that refused every action and had no hand,
		//with no way out. See combat.stablePhaseArray below.
		//"teambuilding" writes whenever that screen rebuilds -- which it does after every change to the
		//party, a loadout or a progression tree -- so profile edits survive the tab being closed.
		autosaveOnArray: ["runStart", "nodeEnter", "nodeComplete", "playerTurnStart", "runEnd", "teambuilding"],
	},

	//-------------------------------------------------------------------------------------------
	//Card telemetry
	//-------------------------------------------------------------------------------------------
	//A counting ledger in its own localStorage namespace, and a report the tester copies out. See
	//honeycomb.telemetry in honeycomb-state.js for what is counted and why there is no uploader.
	telemetry: {
		enabled: true,
		//Its own namespace, like the save: wiping a profile must not wipe the evidence, and vice versa.
		storageKey: "honeycombTelemetryV1",
		//How many rows the report text prints, most-taken first. 0 means every card with a count.
		reportRowLimit: 0,
	},

	//-------------------------------------------------------------------------------------------
	//Flow
	//-------------------------------------------------------------------------------------------
	flow: {
		//Scene honeycombBoot() opens when given no explicit target and no run is in progress.
		entryScene: "title",
		//Where a completed or abandoned run returns to.
		runEndScene: "title",
	},

	//-------------------------------------------------------------------------------------------
	//Debug
	//-------------------------------------------------------------------------------------------
	//Testing tools. Switched off rather than deleted for a release build, so they stay available to
	//whoever picks the project up next.
	debug: {
		enabled: true,
		//Whether the debug tools show what a player has not earned. The panel ships to testers, and
		//Anastasia is meant to stay completely secret until unlocked through gameplay, so while this is
		//false every debug list, picker and button leaves out whatever
		//honeycomb.discovery.hiddenFromDebug names: her, her pieces, her cards, her relic and her fights.
		//True for a developer testing her.
		showsSecrets: false,
		//Show the seed and phase readout on the debug panel.
		showStateReadout: true,
	},

	//-------------------------------------------------------------------------------------------
	//Content warnings
	//-------------------------------------------------------------------------------------------
	//A report of content that breaks the game's standing rules, printed to the CONSOLE ONLY, once per
	//page load, when honeycombBoot first runs. The rules live in honeycomb-warnings.js
	//(honeycomb.warningRuleArray); the numbers they measure against live here.
	warnings: {
		runOnBoot: true,
		//Print the per-table entry counts even when nothing is wrong, so a clean report still shows it ran.
		printCleanReport: true,
		//"Does any card have more than 4 types?" -- more would not fit most card frames' type strip.
		maximumCardTypeCount: 4,
		//Status fields engine code reads directly: the orphan-status rule counts a status as read when it
		//carries one of these, or when it sets `engineReads: true`. A new bespoke reader adds its flag
		//here rather than being silently reported as dead content.
		statusReaderFieldArray: ["redirectsAttacks", "keepsCardsWhileBroken", "turnsIntent", "stolenCardsExhaust", "stolenCardsPersist",
			//honeycomb.golemLustBearer reads this one, for Anastasia's Commander's Burden.
			"absorbsGolemLust"],
		//Card fit, measured without a browser: every printed line of every card form is measured with the
		//fonts' real advance widths (honeycomb.fontMetricArray, generated from the font files) inside the
		//box the stylesheet gives it, as a FILL: 1 is exactly the box. A card is reported when it fills
		//more than its part's KNOWN WORKING reference card does at that size.
		//  partArray        each printed part's box and type, COPIED FROM scripts/css/honeycomb.css in card
		//                   units (test [76] holds the copy to the stylesheet). `bySize` replaces fields for
		//                   one card size. `fitSettings` names the cardLineFit settings the part shrinks by.
		//  referenceArray   { part, size, card, upgradeLevel, upgradePath }: a card seen to fit in the browser
		//                   audit (audit-card-fit.js). The budget is the larger of the box itself (1) and
		//                   the reference's fill: a known working card that MEASURES past 1 proves the
		//                   measurement runs long by that much, so it raises the limit to match.
		//  syntheticBoldExtraEm  the rules font has one weight, so keywords and changed numbers are
		//                   synthesised bold; Firefox widens each such glyph by about a device pixel, which is
		//                   this much of an em at hand size. Chrome does not widen, so this errs long.
		cardFit: {
			syntheticBoldExtraEm: 0.08,
			partArray: [
				{ index: "name", font: "display", fontSizeUnits: 13.95, letterSpacingEm: 0.02, lineHeight: 1, wrapLineHeight: 0.95,
					leftPercent: 24, rightPercent: 20, heightPercent: 10.8,
					bySize: { small: { leftPercent: 4, rightPercent: 4, heightPercent: 24 } } },
				{ index: "supertypes", font: "display", fontSizeUnits: 9.45, letterSpacingEm: 0.1, uppercase: true,
					leftPercent: 6, rightPercent: 6, columnGapEm: 0.6, iconWidthEm: 1.35, iconGapEm: 0.25 },
				{ index: "text", font: "body", fontSizeUnits: 12, lineHeight: 1.15,
					leftPercent: 9, rightPercent: 9, topPercent: 60, bottomPercent: 8.5 },
				{ index: "supertypeIcons", iconWidthUnits: 24, iconGapUnits: 3, leftPercent: 4, rightPercent: 4 },
			],
			referenceArray: [],
		},
		//Warnings deliberately let stand. Each entry is { rule, entry } (rule index, content index); an
		//entry of null ignores that rule everywhere. Ignored warnings are still counted in the report.
		ignoredArray: [],
	},

	//-------------------------------------------------------------------------------------------
	//Image preloading
	//-------------------------------------------------------------------------------------------
	//The background warm at boot. Deliberately GENTLE: a phone that fires 78 image requests at once has
	//its network and decode pipeline saturated right when the first turn is being played, which reads as
	//stutter. It warms in small batches instead, and stands down on a metered or slow connection.
	preload: {
		enabled: true,
		//How many images to ask for before yielding, and how long to wait before the next batch.
		batchSize: 6,
		batchDelayMs: 140,
		//Skip the warm entirely on save-data or a 2G-class connection.
		skipOnSlowConnection: true,
		//There is deliberately no blocking loading screen: see the note above honeycomb.preload.warm.
		//The warm's own cost is measured in the debug panel's `preload` readout.
	},

	//-------------------------------------------------------------------------------------------
	//Performance
	//-------------------------------------------------------------------------------------------
	//Reduced effects: a phone is GPU-bound where a desktop is not -- full-screen blurs, drop-shadow
	//filters and filter TRANSITIONS are cheap on a desktop and expensive on a phone. This trades those
	//for cheaper paint while keeping the game identical in play.
	//  true    always on
	//  false   always off
	//  "auto"  on for a coarse pointer (touch) or a low-memory device, off otherwise
	//Toggled live from the debug panel so a phone can A/B it.
	performance: {
		reducedEffects: "auto",
	},

	//-------------------------------------------------------------------------------------------
	//The Battle Lab
	//-------------------------------------------------------------------------------------------
	//The debug battle environment's own numbers. Debug only -- nothing here is reachable in a release
	//build, but they are numbers, so they live here rather than in the overlay.
	lab: {
		//What "refill" and "infinite" set the bar to. Well past any card's cost, so a chain of plays
		//can be tested without the turn running dry halfway.
		energyRefill: 99,
		//The lab hides itself for a turn's replay and comes back when the board is the player's again.
		//Polled rather than chained: onEndTurn owns its own callbacks and the lab has no business
		//inside them. The timeout is the escape hatch for a replay that never settles.
		reopenPollMs: 120,
		reopenTimeoutMs: 20000,
	},

	//-------------------------------------------------------------------------------------------
	//Art geometry
	//-------------------------------------------------------------------------------------------
	//Measured from the shipped placeholder assets. Future frames are promised to obey the same
	//dimensions, so these percentages stay valid as art improves.
	art: {
		//A dedicated scale for enemy sprites: the battle layout's own `enemySpritePercentHeight` sets the
		//baseline; this multiplies it, so every enemy in the game can be grown or shrunk from one number
		//without touching a layout or an individual enemy's `presentation`. 1 leaves the layout's height
		//as drawn.
		enemySpriteScale: 1,
		//What an ordinary enemy has drawn: basic combat sprites use -combat, and an ordinary enemy has
		//-combat and -offense, nothing else. Players, bosses and named specials get other sprites; -basic
		//is used for the standing sprites in the teambuilding scene.
		//An enemy is only ever asked for the poses and health tiers listed here; any other request is
		//answered with its `1-combat` drawing without touching the server. An enemy that has earned more
		//art says so on its own definition (`artPoseArray`, `artTierArray`, `artPortrait`), and only then
		//are those files asked for. See honeycomb.art.enemySpriteChain.
		enemySpriteSet: { poseArray: ["combat", "offense"], tierArray: [1], portrait: false },
		//The shared sprite canvas (see reference/ART-GUIDE.md): every enemy is drawn on the shared
		//832x1216 canvas at its intended size. A sprite is sized by its width, so a drawing delivered on a
		//canvas of another SHAPE would draw at the wrong HEIGHT -- a crouch pose on a differently
		//proportioned canvas than its combat pose would draw a different height than intended.
		//honeycomb.art.normaliseCanvas scales the width cap back to this shape.
		spriteCanvas: { width: 832, height: 1216 },
		//How far a canvas may differ before it is corrected, as a share of the aspect. A hair, so a
		//one-pixel export difference writes no inline style.
		spriteCanvasTolerance: 0.02,
		//The width cap in the stylesheet (.hcFighterArt max-width), which the correction scales. Kept
		//here rather than read back off the computed style: a number the engine multiplies belongs with
		//the other numbers, and test [76] holds the copy to the stylesheet.
		spriteMaxWidthPercent: 150,
		//The hand's shelf (paintings in ui/hand/): a long shelf the cards float over, and an end piece at
		//each corner: the left holds the energy diamond (the number is drawn over its flame), the right
		//an empty plaque the End Turn label is written on. The end pieces are 512x512;
		//the percentages say where in that square the diamond and the plaque sit, measured off the
		//paintings, so the number and the label land inside them at any size. Drawn only by a battle
		//layout whose `handShelf` flag is on (the scene layout).
		handShelf: {
			backPath: "ui/hand/shelfBack",
			//The FULL end piece shows while its corner still has something to offer; the EMPTY painting
			//takes over the moment it does not: the left with no Energy left to spend, the right while
			//End Turn cannot be pressed (not the player's turn, or a turn end already queued).
			leftPath: "ui/hand/shelfFrontLeft",
			leftEmptyPath: "ui/hand/shelfFrontLeftEmpty",
			rightPath: "ui/hand/shelfFrontRight",
			rightEmptyPath: "ui/hand/shelfFrontRightEmpty",
			energyCenterXPercent: 24,
			energyCenterYPercent: 56.5,
			energyWidthPercent: 48,
			energyHeightPercent: 43,
			endTurnCenterXPercent: 63.3,
			endTurnCenterYPercent: 68.8,
			endTurnWidthPercent: 62,
			endTurnHeightPercent: 26,
		},
		//Card frames are 1992x2540 with a transparent art window punched through them. Art is drawn
		//BEHIND the frame and cropped by it, so these rectangles position the art layer.
		cardFrame: {
			//Outer card proportion, width divided by height.
			aspect: 1992 / 2540,
			//"vertical": a tall window filling most of the card, for full-body character art.
			//Text is drawn over the lower part of the art.
			vertical: {
				framePath: "cards/frames/placeholderVertical",
				windowLeftPercent: 15.713,
				windowTopPercent: 11.811,
				windowWidthPercent: 68.323,
				windowHeightPercent: 81.142,
			},
			//"horizontal": a 3:2 window in the upper half, with a printed text area beneath it.
			horizontal: {
				framePath: "cards/frames/placeholderHorizontal",
				windowLeftPercent: 11.396,
				windowTopPercent: 11.850,
				windowWidthPercent: 77.108,
				windowHeightPercent: 40.315,
			},
		//Which frame a card uses when its definition does not say.
		defaultLayout: "horizontal",
			//Downsampled frames per card size: a frame is 1992x2540 and a card is drawn a few hundred
			//device pixels wide at most, so each card size draws a smaller copy named `<framePath><suffix>`:
			//a sixth of the width for small, a third for medium (a hand card is a medium card scaled up to
			//large on hover, so it needs large's detail), half for large. `generate-placeholder-art.py
			//--only frames` writes the copies from the full frames. A copy that is missing falls back to
			//the full frame (honeycomb.ui.cardFrameFallback).
			frameSuffixBySize: { small: "-small", medium: "-medium", large: "-large" },
			//A card of several types shades its frame from one type's tint into the next along a
			//diagonal; this is how soft each change is, in percent of the diagonal either side of it.
			typeBlendSoftnessPercent: 12,
			//Fitting the printed lines: the name band above the art and the supertype row under it are one
			//line each, so their type SHRINKS with how much they hold rather than wrapping onto the art or
			//the rules text. Measured in characters, not in pixels, so the answer is the same at every
			//card size and needs no layout pass:
			//  fitCount       how much fits at full size (name: letters; supertypes: letters plus
			//                 `iconCharacterCount` per icon)
			//  minimumScale   the smallest the type may get
			//  wrapScale      a NAME too long even at minimumScale wraps to two lines at this size instead
			//  byArea         the text fills an AREA rather than a line (the rules text), so what fits
			//                 grows with the square of the scale
			//The name's fit belongs to each card SIZE (cardSize.sizeArray); a small card prints it larger.
			supertypeFit: { fitCount: 15, minimumScale: 0.45, iconCharacterCount: 2 },
			//fitCount is calibrated to the CHROME's rules box (top 61.2%, height 21.2%): the box is shorter
			//than the old placeholder's, so fewer characters sit at full size before the text shrinks.
			textFit: { fitCount: 30, minimumScale: 0.58, byArea: true },
			//The TARGET badge ("All enemies", "Ally", "All allies") printed over the foot of the art. Off
			//by default. The party-step arrow beside it is unaffected.
			showTargetBadge: false,
		},

		//Card chrome: the frame is authored as separate back/front rasters that are coloured by SUPERTYPE
		//at runtime. `bg` (the lower plate), `border`, `ribbonBack`, `iconBack` and the two coin wells are
		//pre-baked per type under cards/chrome/tint/<folder>/; the gold rasters (`frame`, `gem`, both
		//fronts) are never tinted. A card of several types stacks one copy of each tintable piece per
		//type, masked along a 135-degree diagonal, so the chrome shades from one type into the next.
		//
		//`window` is the hole the gold frame is authored around (measured off frame_gold_horizontal); a
		//horizontal card's art is placed by it when the chrome is on. `box` is a piece's rectangle in
		//percent of the card; a piece with no `box` is a full-card raster.
		cardChrome: {
			//The art window per layout (the hole each gold frame is authored around). A layout missing
			//here falls back to cardFrame.defaultLayout's.
			windowByLayout: {
				horizontal: { windowLeftPercent: 7.5, windowTopPercent: 12.9, windowWidthPercent: 84.9, windowHeightPercent: 40.2 },
				vertical: { windowLeftPercent: 7.5, windowTopPercent: 12.9, windowWidthPercent: 84.9, windowHeightPercent: 81.5 },
			},
			pieceArray: [
				//The lower plate only makes sense on a horizontal card; vertical fills that space with art.
				{ index: "bg", path: "cards/chrome/bg_priest_blue", tintable: true, layouts: ["horizontal"] },
				{ index: "border", path: "cards/chrome/border_blue", tintable: true },
				{ index: "frame", tintable: false, pathByLayout: {
					horizontal: "cards/chrome/frame_gold_horizontal", vertical: "cards/chrome/frame_gold_vertical" } },
				{ index: "ribbonBack", path: "cards/chrome/newribbon_back", tintable: true },
				{ index: "ribbonFront", path: "cards/chrome/newribbon_front", tintable: false },
				//`rarityGem` marks the piece as the RARITY mark: it is drawn only for a rarity whose entry in
				//honeycomb.cardRarityArray sets `showRarityGem` (rare alone today, not starter and not common).
				{ index: "gem", path: "cards/chrome/rarity_gold", tintable: false, rarityGem: true },
				{ index: "ringCostBack", path: "cards/chrome/newring_cost_back", tintable: true,
					box: { left: 1.4, top: 0.9, width: 26.4 } },
				{ index: "ringCostFront", path: "cards/chrome/newring_cost_front", tintable: false,
					box: { left: 1.4, top: 0.9, width: 26.4 } },
				{ index: "ringOwnerBack", path: "cards/chrome/newring_owner_back", tintable: true,
					box: { right: 3, top: 2, width: 17 } },
				{ index: "ringOwnerFront", path: "cards/chrome/newring_owner_front", tintable: false,
					box: { right: 3, top: 2, width: 17 } },
				{ index: "iconBack", path: "cards/chrome/newicon_back", tintable: true },
				{ index: "iconFront", path: "cards/chrome/newicon_front", tintable: false },
			],
			//Supertype index -> tint folder under cards/chrome/tint/. A type absent here keeps the
			//untinted raster (Support is the blue original). "curse" borrows the grey "random" bake.
		tintFolderByType: {
			damage: "damage", negative: "negative", lewd: "lewd", passive: "passive", curse: "random",
			random: "random",
		},
			//How soft the diagonal change between two types is, in percent of the diagonal either side.
			blendSoftnessPercent: 12,
			//The owner's class glyph in the winged emblem, by the character's `artFolder`. Only the drawn
			//classes are listed; a class absent here (necro, vamp, seer) draws no glyph, which is the
			//intended "not authored yet" state rather than a hole.
			classGlyphPathByArtFolder: {
				knight: "cards/chrome/newicon_knight",
				priest: "cards/chrome/newicon_priest",
				lancer: "cards/chrome/newicon_lancer",
			},
		},

		//Card sizes: every place a card is displayed must be categorized as one of these three.
		//honeycomb.ui.card REQUIRES a `size`; an uncategorised card is reported in the console and drawn
		//as `fallbackSize`.
		//
		//Everything printed on a card is measured in CARD UNITS: one unit is the card's own width divided
		//by `designWidthUnits` (the CSS reads it as --hc-card-u, from container query units). So a card is
		//the same picture at every size -- text never outgrows the card that holds it -- and the numbers in
		//the stylesheet are the ones the medium hand card was designed at.
		//
		//Each size:
		//  partArray      which printed parts are drawn (cost, affinity, badges, name, supertypes,
		//                 supertypeIcons, text, tags). The art and frame always are.
		//  partArrayByLayout  optional, per frame layout ("horizontal" / "vertical"): replaces partArray
		//  nameFit        how the name shrinks to fit (see art.cardFrame), and `scale` its size at full fit
		//  widthPixels    (large only) the width in honeycomb pixels every large card is drawn at. The hand's
		//                 hover and the held card grow to exactly this; tooltips, the enemy's played card
		//                 and the upgrade comparison are laid out at it.
		//  zIndex         (large only) drawn above other cards
		cardSize: {
			designWidthUnits: 127,
			fallbackSize: "small",
			sizeArray: [
				{
					//Enemy intent, the discard pile icon, teambuilding's 'Contribute Cards' list, the deck
					//window, the shop window -- everywhere the card would be so small text would clip off
					//the body or into other elements. Only the name is printed.
					index: "small",
					partArray: ["name"],
					//A horizontal card has room under its art, so it also shows its supertypes as icons
					//alone there. A frame layout named here replaces `partArray` for it.
					partArrayByLayout: { horizontal: ["name", "supertypeIcons"] },
					nameFit: { scale: 2, fitCount: 7, minimumScale: 0.7, wrapScale: 0.62 },
				},
				{
					//Cards in hand that aren't being focused.
					index: "medium",
					partArray: ["cost", "affinity", "badges", "name", "supertypes", "text", "tags"],
					nameFit: { scale: 1, fitCount: 9, minimumScale: 0.58, wrapScale: 0.5 },
				},
				{
					//Mousing over a card in hand, dragging a card, when the enemy plays their card, cards
					//shown via tooltips. Also draws above other cards.
					index: "large",
					partArray: ["cost", "affinity", "badges", "name", "supertypes", "text", "tags"],
					nameFit: { scale: 1, fitCount: 9, minimumScale: 0.58, wrapScale: 0.5 },
					widthPixels: 300,
					zIndex: 150,
				},
			],
		},

		//UI frames: nine-slice images that give panels, windows, buttons and tabs the mockups' cut corners
		//and metal trim. The image IS the element's face -- its fill included -- so it is only switched on
		//once the file has actually loaded (honeycomb.ui.loadFrames); a missing file leaves the plain CSS
		//look in place. Placeholders come from generate-placeholder-art.py.
		//  slice         pixels from each edge of the SOURCE that do not stretch (= the corner cut there)
		//  widthPixels   how wide that edge is drawn on screen: sources are drawn at twice the size
		//Which elements wear which frame is the stylesheet's business ("UI FRAMES" in honeycomb.css).
		uiFrameArray: [
			{ index: "panel", path: "ui/frames/panel", slice: 28, widthPixels: 14 },
			{ index: "window", path: "ui/frames/window", slice: 36, widthPixels: 18 },
			{ index: "button", path: "ui/frames/button", slice: 16, widthPixels: 8 },
			{ index: "buttonPrimary", path: "ui/frames/button-primary", slice: 16, widthPixels: 8 },
			{ index: "tab", path: "ui/frames/tab", slice: 14, widthPixels: 7 },
			{ index: "tabActive", path: "ui/frames/tab-active", slice: 14, widthPixels: 7 },
			{ index: "plate", path: "ui/frames/plate", slice: 20, widthPixels: 10 },
		],

		//Generated stand-in drawn when a file is missing, so absent art stays visible and findable.
		placeholder: {
			viewWidth: 200,
			viewHeight: 200,
			hatchSize: 16,
			hatchWidth: 8,
			backColor: "#2a2233",
			lineColor: "#4b3d5c",
			textColor: "#c9b6dd",
			strokeWidth: 3,
			inset: 6,
			fontSize: 15,
		},

		//Full-body character art is 1408x2816 -- exactly 1:2. Sprites are positioned by their feet,
		//so a taller future asset grows upward rather than sinking through the floor.
		//The painted stage behind a fight, when neither the encounter nor its region names one
		//(`battleBackdropPath` on either). HC-PLACEHOLDER.
		battleBackdropPath: "backgrounds/placeholder",

		characterSprite: {
			aspect: 1408 / 2816,
			//Sprite art is drawn from a folder per purpose so a costume swap is a path swap.
			fullBodyFolder: "full/",
			portraitFolder: "icons/",
			enemyFolder: "enemy/",
		},

		//The nameplate: its shapes are SVG files in ui/nameplate/, drawn at 1 unit = 1 mockup pixel; the
		//stylesheet lays every part of the plate out in those same units (`--hc-plate-u`), so the WHOLE
		//PLATE scales from one number here. The shape geometry itself (nine-slice insets, the fill window,
		//the break's jag) lives beside the rules that draw it, in the "THE NAMEPLATE" block of
		//honeycomb.css, because it is a fact about the drawings.
		//
		//What the bar reads, every length a share of maximum health (honeycomb.vitalsShareArray):
		//  not broken   pink 0..lust over red 0..health · gold health..health+tHP · black past that
		//  broken       pink 0..health+tHP · the dithered CATCH-UP GAP from there to lust · black past that
		nameplate: {
			//Honeycomb pixels per mockup unit. The mockup's plate is about 690 units across and a fighter
			//at 1440x810 is about 168 honeycomb pixels wide, so 0.26 lets a plate slightly overhang its
			//fighter the way the old one sat inside it.
			unitPixels: 0.35,
			medallionPath: "ui/nameplate/medallion.svg",
			barFramePath: "ui/nameplate/barFrame.svg",
			healthTabPath: "ui/nameplate/healthTab.svg",
			statusCirclePath: "ui/nameplate/statusCircle.svg",
			crackPath: "ui/nameplate/shatterCrack.svg",
			//The medallion's icon when a character is Broken, and the heart beside the lust number. The
			//game's heart icons are red, which reads as HEALTH beside a red bar, so both wear heartFilter.
			brokenIconPath: "icons/heart-glow-pink",
			lustIconPath: "icons/heart-red",
			heartFilter: "hue-rotate(-32deg) saturate(1.25) brightness(1.2)",
			//The medallion's glyph when a combatant has no class icon to show.
			characterGlyph: "person",
			enemyGlyph: "paw",
			//Where health plus temporary HP stops fitting and the frame breaks, as a share of maximum.
			overfullAt: 1,
			//Past maximum, health is drawn at most this share short of the tip and gold fills the rest, so
			//the lightning always comes out of gold.
			overfullGoldShare: 1 - 64 / 68,
			//The lightning: four frames, each shown for boltFrameMs, the next always one of the OTHER three
			//in an order hashed from the tick (never Math.random, never an RNG stream). The order is baked
			//into a looping CSS animation boltSequenceLength ticks long, so nothing has to repaint the board
			//on a timer; each plate starts at its own hashed point in the loop so no two bars flicker in
			//step.
			boltFrameArray: ["ui/nameplate/shatterBoltA.svg", "ui/nameplate/shatterBoltB.svg",
				"ui/nameplate/shatterBoltC.svg", "ui/nameplate/shatterBoltD.svg"],
			boltFrameMs: 90,
			boltSequenceLength: 24,
			//PIECES OF THE FRAME breaking off: size, how far each drifts from the break, spin, and its
			//loop. Units are mockup units, like the drawings.
			chipArray: [
				{ path: "ui/nameplate/shatterChipA.svg", widthUnits: 44, heightUnits: 38, driftXUnits: 35, driftYUnits: -35, spinDegrees: -80, lifeMs: 2600, delayMs: 0 },
				{ path: "ui/nameplate/shatterChipB.svg", widthUnits: 30, heightUnits: 26, driftXUnits: 55, driftYUnits: -5, spinDegrees: 140, lifeMs: 2200, delayMs: 700 },
				{ path: "ui/nameplate/shatterChipC.svg", widthUnits: 36, heightUnits: 22, driftXUnits: 30, driftYUnits: 25, spinDegrees: -120, lifeMs: 2400, delayMs: 1300 },
				{ path: "ui/nameplate/shatterChipB.svg", widthUnits: 24, heightUnits: 21, driftXUnits: 60, driftYUnits: 18, spinDegrees: 200, lifeMs: 2000, delayMs: 1800 },
			],
		},
	},

	//-------------------------------------------------------------------------------------------
	//Audio
	//-------------------------------------------------------------------------------------------
	//Honeycomb names its own events; the map turns them into whatever the host actually has. A
	//standalone build replaces the right-hand side without touching a single content file.
	//
	//THE CARD SOUNDS ARE AN EXPLICIT TABLE, NOT RULES. Every card and every enemy move
	//names its own stem in `cardSfxMap`; the type table below is only a safety net for content that
	//has not been assigned yet, and the tests fail on a card that has no assignment, so nothing can
	//reach the net by accident. The convention the table follows:
	//  debuffParty / debuffSingle   a negative effect lands on the PARTY (self-costs included)
	//  buffParty / buffSingle       a positive effect lands on the party
	//  weaponSlash/Thrust/Brutal/Clang/Kaboom   physical attacks, by how they swing
	//  magicFireball/Ice/Water/Earth            elemental attacks
	//  magicDarkGeneric / magicDarkWail         necrotic rot; the wail is the big payoff
	//  magicWeird                               charm, fate, intent and mind magic
	//  lewdSquish / lewdSplort / lewdSwallowing lust and body-forward lewd cards
	//  magicCharge                              passives and setup
	//  healSmall                                heals
	//  itemPotionGeneric / itemPotionGood / itemKey   consumables, gambles and key items
	//  miscWind / miscCreak                     movement and stumbles
	audio: {
		//Honeycomb's own sound library: the files ship with the game and are played by the platform
		//adapter directly, so a hosted build, a standalone build and a `file://` page all get them. An
		//event named in `fileMap` plays its
		//FILE; anything else falls through to the host stem in `eventMap`, so a host without the
		//library still gets a sound.
		libraryPath: "honeycomb sound/sfx/",
		//Quieter than the host's own effects: the library files are mixed for a standalone game.
		fileVolume: 0.6,

		//-------------------------------------------------------------------------------------------
		//Measured, not named
		//-------------------------------------------------------------------------------------------
		//A filename cannot tell whether a file fits the moment it is given: the library's files range
		//from 0.2 to 11.9 seconds of audible sound and span 22.7 dB of loudness, so `miscWind` is a
		//twelve-second wind bed even though it plays on the card draw and on five of Cinder's cards. The
		//three tables below are measured, not guessed.
		//
		//`!designDocs/honeycomb/tools/sfx-report.js` prints the whole audit; `sfx-report.html` re-measures
		//the library into `sfx-metrics.json` when a sound file is replaced. Test [79] holds both.

		//WHEN A SOUND PLAYS, AND HOW LONG IT MAY RUN. Measured against a file's AUDIBLE length, since
		//several files are padded with silence to a fixed length (weaponThrust is 8.04s of file and
		//0.45s of sound). A moment is the only place a length limit is written down.
		momentArray: [
			{ index: "tick", maximumSeconds: 1.2, why: "fires many times a second inside a barrage" },
			{ index: "beat", maximumSeconds: 2.5, why: "fires several times a turn, under the next beat" },
			{ index: "cardPlay", maximumSeconds: 3.5, why: "one per card played, and cards are played in chains" },
			{ index: "enemyMove", maximumSeconds: 3.5, why: "one per enemy per turn" },
			{ index: "screen", maximumSeconds: 6, why: "a screen change, with nothing else asking to be heard" },
			{ index: "stinger", maximumSeconds: 9, why: "a cut-in holds the screen for it" },
		],
		//Which moment each event belongs to. An event with no row here is a `beat`.
		defaultMoment: "beat",
		eventMomentMap: {
			broken: "stinger", exposedTorn: "stinger", recovered: "stinger", lustEventBegin: "stinger",
			outfitChange: "screen", victoryBattle: "screen", victoryFull: "screen", defeat: "screen",
			nodeEnter: "screen", regionDescend: "screen", runStart: "screen", weaknessReset: "screen",
			poisonTick: "tick", lustGained: "tick", cardDraw: "tick",
			cardPlay: "cardPlay", cardPlayNegative: "cardPlay", cardPlayLewd: "cardPlay",
			cardPlaySupport: "cardPlay", cardPlayPassive: "cardPlay",
		},

		//WHAT A STEM CLAIMS, so an assignment can be checked against what the card actually does. Only
		//stems that make a claim are listed; the rest are mood-neutral and never reported. `reach`
		//"party" means the sound says "a whole line"; `mood` says which direction it points.
		//This is the table behind "why do none of the cards that debuff the party play the party
		//debuffing sfx" -- the report now names every one of them.
		stemFamilyArray: [
			{ index: "buffParty", reach: "party", mood: "help" },
			{ index: "buffSingle", reach: "single", mood: "help" },
			{ index: "debuffParty", reach: "party", mood: "harm" },
			{ index: "debuffSingle", reach: "single", mood: "harm" },
			{ index: "healSmall", mood: "help" },
		],

		//HOW LATE EACH FILE ACTUALLY STARTS, in milliseconds. Several stems open with a moment of silence
		//before the sound itself: `!broken` carries 160ms of it. A sound timed to land WITH a picture has
		//to start that much earlier or it arrives late -- measured, the broken stinger's attack was landing
		//about 70ms after the chain visibly snapped. Generated from sfx-metrics.json; see honeycomb.soundLeadInMs.
		leadInMsMap: {
			"!broken": 160,
			"!heartbeat": 40,
			"!outfitChange": 380,
			"!torn": 160,
			"!victoryBattle": 130,
			"!victoryFull": 50,
			buffParty: 40,
			buffSingle: 80,
			debuffParty: 120,
			debuffSingle: 300,
			healSmall: 50,
			itemKey: 30,
			itemPotionGeneric: 120,
			itemPotionGood: 60,
			lewdSlap: 80,
			lewdSplort: 80,
			lewdSquish: 230,
			lewdSwallowing: 170,
			magicCharge: 50,
			magicDarkGeneric: 20,
			magicDarkWail: 20,
			magicEarth: 20,
			magicFireball: 130,
			magicHolyChoir: 20,
			magicHolyLight: 30,
			magicIce: 80,
			magicSlash: 390,
			magicWater: 20,
			magicWeird: 50,
			miscCreak: 20,
			miscDoor: 20,
			miscSnap: 160,
			miscWalkingWood: 80,
			miscWind: 230,
			newCharacter: 50,
			newOutfit: 50,
			newProgression: 20,
			stingerBoss: 110,
			stingerDanger: 30,
			stingerSpooky: 70,
			weaponBrutal: 70,
			weaponClang: 60,
			weaponKaboom: 140,
			weaponSlash: 120,
			weaponThrust: 140,
		},
		//Where a file starts, in ms, skipping a silent lead-in. leadInMsMap above only records it.
		startAtMsMap: {
			"!outfitChange": 380,
		},
		//Per-stem volume trims, multiplied onto fileVolume, so the library sits at one level instead of
		//spanning 22.7 dB. Generated: `node "!designDocs/honeycomb/tools/sfx-report.js" --trims`. The target
		//and the measurements live in sfx-metrics.json; never fill this by ear -- a trim chosen by ear goes in
		//fileVolumeByEarMap below, which wins over this one.
		fileVolumeTrimRange: { minimum: 0.2, maximum: 1.6 },
		fileVolumeScaleMap: {
			"!broken": 0.38,
			"!heartbeat": 0.48,
			"!outfitChange": 1.6,
			"!torn": 1.12,
			"!victoryBattle": 0.59,
			"!victoryFull": 0.47,
			buffParty: 0.66,
			buffSingle: 1.3,
			debuffParty: 0.82,
			debuffSingle: 0.81,
			healSmall: 0.71,
			itemKey: 1.1,
			itemPotionGeneric: 0.66,
			itemPotionGood: 0.54,
			lewdSlap: 1.6,
			lewdSplort: 0.94,
			lewdSquish: 1.6,
			lewdSwallowing: 1.6,
			magicCharge: 0.91,
			magicDarkGeneric: 0.28,
			magicDarkWail: 0.52,
			magicEarth: 0.61,
			magicFireball: 0.24,
			magicHolyChoir: 0.59,
			magicHolyLight: 1.12,
			magicIce: 0.97,
			magicSlash: 0.44,
			magicWater: 0.81,
			magicWeird: 0.81,
			miscCreak: 0.95,
			miscDoor: 0.49,
			miscSnap: 1.6,
			miscWalkingWood: 0.83,
			miscWind: 0.49,
			newCharacter: 1.15,
			newOutfit: 0.75,
			newProgression: 0.68,
			stingerBoss: 0.27,
			stingerDanger: 0.34,
			stingerSpooky: 0.76,
			weaponBrutal: 0.48,
			weaponClang: 0.56,
			weaponKaboom: 0.29,
			weaponSlash: 0.65,
			weaponThrust: 0.73,
		},
		//Trims chosen by ear. They win over fileVolumeScaleMap; the suite only checks they are in range.
		fileVolumeByEarMap: {
			lewdSplort: 0.55,
			lewdSquish: 0.6,
			weaponBrutal: 0.4,
		},

		//What a landed hit sounds like, by the `damageType` the effect named. An ordinary hit from a
		//card has NO damageType and so is silent here on purpose: the card played its own sound a beat
		//earlier, and a blanket `damageDealt: weaponClang` would ring a piece of metal over every
		//necrotic, holy and poison hit in the game, once per hit on a card that hits several times. Only
		//damage with no card behind it -- a status or a passive firing -- speaks.
		//Every other damageType (blood, bloodMoon, jinx, momentum, banner, emberwake, broken) is one
		//row away from having a sound, and is deliberately left silent rather than guessed at.
		damageTypeSoundMap: {
			poison: "poisonTick",
			thorns: "damageRetort",
			retort: "damageRetort",
		},
		fileMap: {
			//The five named stingers.
			broken: "!broken",
			exposedTorn: "!torn",
			outfitChange: "!outfitChange",
			victoryBattle: "!victoryBattle",
			victoryFull: "!victoryFull",
			//System events on the library: only a click, a back, a pickup, the card draw and the queue
			//beep still use a host stem; everything else is Honeycomb's.
			enemyDefeated: "weaponBrutal",
			//An ally going down mid-fight is a combat beat, not a screen: stingerDanger ran 3.7s over
			//the rest of the turn. The run ENDING still gets the full sting.
			allyDowned: "magicDarkWail",
			defeat: "stingerDanger",
			rewardTaken: "newProgression",
			//The footsteps are for going down a floor: the file is far too long for moving between nodes.
			//Walking to a node has no library file, so it plays the host's short `move` stem from eventMap.
			regionDescend: "miscWalkingWood",
			runStart: "miscDoor",
			weaknessReset: "itemPotionGood",
			lustEventBegin: "stingerSpooky",
			healed: "healSmall",
			temporaryGained: "buffSingle",
			//lustGained and partyShift play Syrup Town sounds, so they are left to eventMap: a fileMap entry wins
			//and only looks in `honeycomb sound/sfx/`.
			recovered: "magicCharge",
			//Movement and arrivals have their own events: reusing `nodeEnter` for both would start every
			//party shift in a fight with 4 seconds of footsteps on wood, and start them on every play of
			//Nettle's Grave Touch too. An event name says WHEN a sound plays; borrowing one for a
			//different moment is how a wrong length gets in.
			enemySummoned: "magicEarth",
			allySummoned: "magicHolyLight",
			//Thorns and a riposte: damage with no card behind it. See damageTypeSoundMap.
			damageRetort: "weaponClang",
			//THE PLAY SOUNDS' type fallback.
			cardPlay: "weaponSlash",
			cardPlayNegative: "magicDarkGeneric",
			cardPlayLewd: "lewdSplort",
			cardPlaySupport: "magicHolyLight",
			cardPlayPassive: "magicCharge",
			//The poison barrage's tick, so it no longer lands with the host's hammer.
			poisonTick: "lewdSplort",
		},
		eventMap: {
			//STILL HOST STEMS (no library file exists for these yet): clicks, backs, pickups and the
			//queue beep. Listed in the sfx report as the remaining host borrowings.
			uiClick: "button",
			uiBack: "pop",
			cardPickUp: "pop",
			inputQueued: "button",
			//The card draw stays a host stem on purpose: moving it to `miscWind` in the library would put
			//11.9 seconds of ambient wind on every card drawn. Do not move it to the library without a
			//short draw file to move it to.
			cardDraw: "move",
			//Host fallbacks for the library events, for a build with no `honeycomb sound/` folder.
			broken: "sleep",
			exposedTorn: "pop",
			outfitChange: "pickup",
			victoryBattle: "purchase",
			victoryFull: "purchase",
			enemyDefeated: "purchase",
			allyDowned: "sleep",
			defeat: "sleep",
			rewardTaken: "pickup",
			nodeEnter: "move",
			regionDescend: "move",
			runStart: "purchase",
			weaknessReset: "purchase",
			lustEventBegin: "sell",
			healed: "pickup",
			temporaryGained: "purchase",
			lustGained: "sell",
			recovered: "purchase",
			partyShift: "move",
			enemySummoned: "pop",
			allySummoned: "pop",
			damageRetort: "hammer",
			cardPlay: "hammer",
			cardPlayNegative: "sell",
			cardPlayLewd: "sell",
			cardPlaySupport: "pickup",
			cardPlayPassive: "purchase",
			poisonTick: "sell",
		},

		//WHICH PLAY SOUND A CARD GETS WHEN IT HAS NO ASSIGNMENT, read in order: the first of the card's
		//own types with an entry here wins, and a card with none falls through to `cardPlay`. This is
		//a SAFETY NET only: every shipped card is assigned in `cardSfxMap` below and the tests fail on
		//a card without one, so the net only catches new content mid-authoring.
		cardPlaySoundArray: [
			{ index: "damage", event: "cardPlay" },
			{ index: "negative", event: "cardPlayNegative" },
			{ index: "lewd", event: "cardPlayLewd" },
			{ index: "support", event: "cardPlaySupport" },
			{ index: "passive", event: "cardPlayPassive" },
		],

		//EVERY CARD AND ENEMY MOVE, BY HAND. One row per index; the value is a file stem under
		//`libraryPath`. A card may also carry its own `sfx` field, which wins over this table, so a
		//one-off sound is a content edit with no table churn.
		cardSfxMap: {
			//--- Brienne: plate, shields and the occasional gilded swing ---
			brienneStrike: "weaponSlash",
			brienneGuard: "buffSingle",
			brienneBulwark: "buffParty",
			brienneRally: "buffParty",
			brienneShieldBash: "weaponClang",
			brienneRiposte: "weaponSlash",
			brienneCrushingWeight: "weaponBrutal",
			brienneTemperedPlate: "magicCharge",
			brienneLendSteel: "buffSingle",
			brienneUnstoppable: "buffSingle",
			brienneChallenge: "buffSingle",
			brienneIntercept: "buffSingle",
			brienneThornArmour: "magicCharge",
			brienneIronRetort: "magicCharge",
			brienneHoldTheLine: "magicCharge",
			brienneShieldWall: "buffParty",
			brienneTithe: "itemPotionGood",
			brienneRansom: "itemKey",
			brienneGildedStrike: "weaponSlash",
			brienneAlms: "buffParty",
			brienneReliquary: "magicCharge",
			brienneBroken: "magicDarkWail",
			brienneBacksToWall: "debuffSingle",
			brienneHuddle: "buffParty",
			brienneWeightOfRegret: "buffParty",

			//--- Nettle: rot, spores and the big green payoff ---
			nettleStrike: "magicDarkGeneric",
			nettleWither: "magicDarkGeneric",
			nettleReap: "magicSlash",
			nettleBlightNeedle: "magicDarkGeneric",
			nettleRupture: "magicDarkGeneric",
			nettlePutrefy: "magicDarkGeneric",
			nettleWasting: "magicDarkGeneric",
			nettleFester: "magicDarkGeneric",
			nettleCatharsis: "magicDarkWail",
			nettleBurst: "magicDarkWail",
			nettleMiasma: "magicDarkWail",
			nettleInfect: "magicDarkGeneric",
			nettleContagion: "magicDarkGeneric",
			nettlePandemic: "magicCharge",
			nettlePlague: "magicDarkWail",
			nettlePollenKiss: "lewdSplort",
			nettleIntoxicate: "lewdSplort",
			nettleFlushed: "lewdSplort",
			nettleHeadySpores: "magicCharge",
			nettleBacchanal: "lewdSplort",
			nettleBroken: "magicDarkWail",
			nettlePollenBurst: "magicDarkGeneric",
			nettleMiasmicHaze: "magicDarkWail",
			nettleLastBloom: "buffParty",

			//--- Severine: fang, blood and the price she pays ---
			severineDrain: "lewdSplort",
			severineFlurry: "weaponSlash",
			severineArc: "magicSlash",
			severineNightfall: "lewdSplort",
			severineHamstring: "weaponSlash",
			severineMarkPrey: "magicDarkGeneric",
			severineCoupDeGrace: "weaponBrutal",
			severineExsanguinate: "lewdSplort",
			severineGorge: "lewdSplort",
			severineBloodyVerdict: "weaponBrutal",
			severineBloodPact: "debuffSingle",
			severineSanguineTide: "lewdSplort",
			severineHemomancy: "magicCharge",
			severineBloodMoon: "magicCharge",
			severineTransfusion: "healSmall",
			severineLeechMark: "magicDarkGeneric",
			severineHeartsblood: "healSmall",
			severineCrimsonCommunion: "lewdSplort",
			severineBroken: "magicDarkWail",
			severinePreyNoMore: "debuffSingle",
			severineCripple: "weaponSlash",
			severineMoonfall: "buffParty",

			//--- Cinder: spear, fire and movement ---
			cinderThrust: "weaponThrust",
			cinderCharge: "magicFireball",
			cinderChangePlaces: "miscCreak",
			cinderLongspear: "weaponThrust",
			cinderDoubleBack: "miscCreak",
			cinderHotPursuit: "weaponThrust",
			cinderPullBack: "miscCreak",
			cinderPointOfSpear: "buffSingle",
			cinderTurnTheLine: "buffParty",
			cinderPincer: "weaponThrust",
			cinderBroken: "miscCreak",
			cinderMisstep: "debuffSingle",
			cinderLostTrail: "miscCreak",
			cinderClosingJaws: "weaponBrutal",

			//--- Clemence: holy light, and the Lust she takes for it ---
			clemenceOffering: "healSmall",
			clemencePrayer: "buffSingle",
			clemenceConfide: "buffSingle",
			clemenceLayOnHands: "magicHolyChoir",
			clemenceShelteringGrace: "buffSingle",
			clemenceMartyrsVow: "magicCharge",
			clemenceSoftWords: "magicWeird",
			clemenceConfession: "lewdSplort",
			clemenceSurrender: "magicHolyChoir",
			clemenceEcstasy: "lewdSplort",
			clemenceSanctify: "magicHolyLight",
			clemenceFallenVigil: "healSmall",
			clemenceSharedFever: "debuffSingle",
			clemenceCommunion: "magicHolyChoir",
			clemenceOfferingBroken: "lewdSplort",
			clemencePrayerBroken: "magicHolyLight",
			clemenceConfideBroken: "buffSingle",
			clemenceLayOnHandsBroken: "lewdSplort",
			clemenceShelteringGraceBroken: "buffParty",
			clemenceMartyrsVowBroken: "buffSingle",
			clemenceSoftWordsBroken: "lewdSplort",
			clemenceConfessionBroken: "lewdSplort",
			clemenceSurrenderBroken: "lewdSplort",
			clemenceEcstasyBroken: "lewdSplort",
			clemenceSanctifyBroken: "magicHolyLight",
			clemenceFallenVigilBroken: "buffSingle",
			clemenceSharedFeverBroken: "buffSingle",
			clemenceCommunionBroken: "magicHolyChoir",
			clemenceBroken: "magicHolyChoir",

			//--- Cassadora: fate, theft and puppet strings ---
			cassadoraBolt: "magicDarkGeneric",
			cassadoraSecondThoughts: "magicWeird",
			cassadoraTurncoat: "magicWeird",
			cassadoraJinx: "magicCharge",
			cassadoraWardedFate: "buffSingle",
			cassadoraMirrorFate: "magicWeird",
			cassadoraPilfer: "itemKey",
			cassadoraUnderstudy: "magicWeird",
			cassadoraEncore: "buffSingle",
	
			cassadoraBroken: "magicWeird",
			cassadoraTurnedCoat: "magicWeird",
			cassadoraShatteredMirror: "magicWeird",
			cassadoraStillnessWithin: "buffParty",

			//--- Starter-rework cards: the twelve basics and the first outfit signatures ---
			brienneCleave: "weaponSlash",
			brienneGrit: "buffSingle",
			briennePlateEdge: "weaponSlash",
			brienneHeadstrong: "weaponSlash",
			brienneIncredibleWealth: "buffSingle",
			nettleVenomTouch: "magicDarkGeneric",
			nettleLastRites: "magicDarkGeneric",
			nettlePop: "magicDarkGeneric",
			nettleSpore: "magicDarkGeneric",
			nettleKiss: "lewdSplort",
			severineRend: "weaponSlash",
			severineQuaff: "lewdSplort",
			clemenceTempt: "lewdSplort",
			clemenceGrant: "healSmall",
			cassadoraWispBolt: "magicDarkGeneric",
			cassadoraUnravel: "magicWeird",
			cinderImpale: "weaponThrust",
			cinderSwitch: "miscCreak",
			severineFinish: "weaponBrutal",
			severineCut: "weaponSlash",
			severineBloodMoonRite: "magicDarkGeneric",
			clemenceBlessedPain: "magicHolyChoir",
			clemenceEdge: "lewdSplort",
			clemenceGuidedHand: "buffSingle",
			cassadoraRead: "magicWeird",
			cassadoraMisdirect: "magicWeird",
			cassadoraIllWish: "magicWeird",
			cinderRush: "weaponThrust",
			cinderGoldStandard: "miscCreak",
			cinderRecede: "weaponThrust",
			randomStartingCard: "itemPotionGeneric",
			//Never played; named so the "every card has a sound" check is satisfied. See the fallback card.
			fallbackCard: "itemPotionGeneric",

			//--- Neutral cards and curses ---
			neutralFocus: "buffSingle",
			neutralTonic: "healSmall",
			neutralWarcry: "buffParty",
			neutralWhettedEdge: "itemKey",
			neutralImprovise: "itemPotionGeneric",
			neutralHedge: "itemPotionGeneric",
			curseDread: "magicDarkWail",
			curseWisp: "magicDarkGeneric",

			//--- Enemy moves: what the party hears from the other side of the board ---
			//What a cancelled intent telegraphs: it does nothing but think again.
			hexBefuddled: "magicWeird",
			sporelingSpit: "magicDarkGeneric",
			sporelingSpores: "debuffSingle",
			sporelingHarden: "buffSingle",
			capBruteWindUp: "buffSingle",
			capBruteSlam: "weaponBrutal",
			capBruteStomp: "weaponBrutal",
			capBrutePin: "debuffSingle",
			gloomWispFlicker: "magicDarkWail",
			gloomWispClutter: "debuffParty",
			gloomWispFade: "buffSingle",
			gloomWispBeguile: "magicWeird",
			hollowKnightCleave: "weaponSlash",
			hollowKnightPierce: "weaponThrust",
			hollowKnightBrace: "buffSingle",
			hollowKnightStrip: "debuffSingle",
			matriarchLash: "weaponSlash",
			matriarchCarapace: "buffSingle",
			matriarchBloom: "debuffParty",
			matriarchSwarm: "magicDarkWail",
			matriarchBrood: "magicDarkGeneric",
			matriarchEmbrace: "lewdSplort",
			matriarchWail: "debuffParty",
			gardenerSpade: "weaponBrutal",
			gardenerMulch: "buffParty",
			gardenerSow: "debuffSingle",
			sageSporebolt: "magicDarkGeneric",
			sageMire: "debuffParty",
			sageWithering: "debuffParty",
			sageWard: "buffSingle",
			sageHex: "debuffParty",
			alchemistFlask: "weaponKaboom",
			alchemistBrew: "weaponKaboom",
			alchemistFumes: "debuffParty",
			alchemistDraught: "buffParty",
			sentinelBash: "weaponClang",
			sentinelBrace: "buffSingle",
			sentinelGuard: "buffParty",
			sentinelRetort: "magicCharge",
			scavengerClaw: "weaponSlash",
			scavengerScatter: "weaponKaboom",
			scavengerCurl: "buffSingle",
			scavengerFumes: "debuffParty",
			scavengerBigBomb: "weaponKaboom",
			juggernautSweep: "weaponBrutal",
			juggernautCrush: "weaponBrutal",
			juggernautHurl: "weaponBrutal",
			juggernautBackhand: "weaponBrutal",
			juggernautUproot: "buffSingle",
			juggernautRoar: "debuffParty",
			juggernautWhistle: "buffSingle",
			juggernautOverhead: "weaponBrutal",
			juggernautAvalanche: "weaponKaboom",
			thrownScrap: "weaponBrutal",
			thrownBattery: "magicIce",
			thrownSludge: "magicDarkGeneric",
			thrownSignboard: "weaponBrutal",
			thrownWire: "magicIce",
			thrownRottenCap: "magicDarkGeneric",
			thrownFlask: "weaponKaboom",
			thrownBalm: "healSmall",
			thrownLocket: "itemKey",
			//--- Enemy moves (ENEMIES-01): picked by move kind; swap any row for a better sound ---
			gardenerReplant: "magicDarkGeneric",
			alchemistTonic: "buffParty",
			sentinelBristle: "magicCharge",
			puffcapSwell: "buffSingle",
			puffcapRipen: "buffSingle",
			puffcapBurst: "weaponKaboom",
			leechLatch: "weaponThrust",
			leechSiphon: "lewdSplort",
			leechEngorge: "buffSingle",
			moldshaperMend: "buffParty",
			moldshaperRotTouch: "magicDarkGeneric",
			moldshaperVeil: "debuffParty",
			moldshaperReshape: "buffParty",
			huskSword: "weaponSlash",
			huskLurch: "weaponBrutal",
			huskCough: "debuffParty",
			mothKiss: "magicWeird",
			mothDust: "magicWeird",
			mothFlutter: "buffSingle",
			mothDazzle: "debuffSingle",
			crawlerPinch: "weaponClang",
			crawlerScuttle: "weaponSlash",
			crawlerBurrow: "buffSingle",
			eelBite: "weaponThrust",
			eelSubmerge: "buffSingle",
			eelConstrict: "debuffSingle",
			toadTongue: "weaponBrutal",
			toadSlam: "weaponBrutal",
			toadCroak: "debuffParty",
			toadSpit: "debuffSingle",
			salvagerSpear: "weaponThrust",
			salvagerSnare: "weaponSlash",
			salvagerDischarge: "magicIce",
			salvagerPatch: "buffSingle",
			jellyLure: "magicWeird",
			jellySting: "magicIce",
			jellyPulse: "magicWeird",
			championCleave: "weaponSlash",
			championLunge: "weaponThrust",
			championGuard: "magicCharge",
			championThrust: "weaponThrust",
			headGardenerShears: "weaponSlash",
			headGardenerSnare: "debuffParty",
			headGardenerGraft: "buffParty",
			headGardenerPlant: "magicDarkGeneric",
			headGardenerOvergrow: "magicDarkGeneric",
			headGardenerWhip: "weaponSlash",
			tallySlam: "weaponBrutal",
			tallyCollect: "debuffSingle",
			tallyAudit: "debuffParty",
			tallyReckoning: "magicDarkWail",
			tallyInterest: "magicCharge",
			//>>> LANE E7 | flora | card sfx >>>
			//--- ACT1-B, THE THORN ARBOR: wet, green and sticky rather than metallic. Nectar and pollen
			//use the squelch and the weird-magic stems; the fencer is the one body here carrying steel.
			wellspringRun: "magicWeird",
			wellspringMulch: "buffParty",
			wellspringDrench: "lewdSplort",
			wellspringStem: "weaponBrutal",
			spriteLash: "weaponSlash",
			spriteSnare: "debuffSingle",
			spriteTangle: "miscCreak",
			bellDrift: "magicWeird",
			bellPeal: "magicDarkWail",
			bellStoop: "weaponBrutal",
			bellFurl: "magicCharge",
			fruitWindfall: "lewdSplort",
			fruitRind: "magicCharge",
			fruitSpill: "lewdSplort",
			fruitPip: "weaponThrust",
			fencerLunge: "weaponThrust",
			fencerPrick: "weaponThrust",
			fencerGuard: "buffSingle",
			fencerFlourish: "debuffParty",
			sisterDayGlove: "lewdSplort",
			sisterDaySweep: "magicSlash",
			sisterDayGift: "buffParty",
			sisterNightShut: "magicCharge",
			sisterNightFall: "magicWeird",
			sisterNightRoot: "magicEarth",
			//<<< LANE E7 | flora | card sfx <<<
			//>>> LANE E7 | pollenRoad | card sfx >>>
			//--- ACT1-C, THE POLLEN ROAD: two registers in one place. The fencers are the only steel on
			//the road, so they keep the thrust and the clang; everything else is dust, wings and nectar.
			sableThrust: "weaponThrust",
			sableBind: "weaponClang",
			sableLine: "weaponSlash",
			sableGuard: "buffSingle",
			argentLunge: "weaponThrust",
			argentRemise: "weaponThrust",
			argentFlare: "debuffParty",
			argentSidestep: "buffSingle",
			mantleDust: "magicWeird",
			mantleSweep: "weaponBrutal",
			mantleFold: "buffParty",
			mantleShade: "debuffParty",
			longwingSway: "magicWeird",
			longwingScatter: "debuffParty",
			longwingStoop: "weaponBrutal",
			longwingSettle: "magicCharge",
			soakcapSpill: "lewdSplort",
			soakcapSplash: "lewdSplort",
			soakcapShare: "buffParty",
			soakcapSteep: "buffSingle",
			drayClaw: "weaponBrutal",
			drayChain: "weaponClang",
			drayGrin: "lewdSlap",
			drayLurch: "magicEarth",
			drayDoze: "magicCharge",
			//<<< LANE E7 | pollenRoad | card sfx <<<
			//--- THE CHESSMASTER: Anastasia's kit and the twelve pieces' own moves ---
			//Stone golems, so the pieces swing like masonry rather than steel: Infernal bills the board in
			//blunt hits, Celestial banks Temporary HP and sounds like the wards it is.
			//A command to the board sounds like a spell being cast, the crouch
			//like a ward going up. Picked by card kind; swap any row for a better sound.
			anastasiaAdvance: "magicDarkGeneric",
			anastasiaCheck: "weaponSlash",
			anastasiaDevelop: "buffSingle",
			anastasiaPawnStorm: "magicDarkGeneric",
			anastasiaKnightsTour: "magicCharge",
			anastasiaLongDiagonal: "magicCharge",
			anastasiaRookLift: "magicEarth",
			anastasiaQueening: "magicHolyLight",
			anastasiaTempo: "magicCharge",
			anastasiaSimul: "magicCharge",
			anastasiaGambitAccepted: "weaponBrutal",
			anastasiaSacrificePlay: "weaponBrutal",
			anastasiaHoldTheFile: "buffParty",
			anastasiaStudyTheBoard: "buffParty",
			anastasiaCastling: "buffSingle",
			anastasiaDeepCalculation: "magicCharge",
			//--- The sacrifice commons and the field clearer ---
			anastasiaInterpose: "buffSingle",
			anastasiaBattery: "weaponBrutal",
			anastasiaDesperado: "weaponKaboom",
			anastasiaUnderpromotion: "magicHolyLight",
			//--- Her broken forms ---
			anastasiaAdvanceBroken: "weaponBrutal",
			anastasiaInterposeBroken: "buffSingle",
			anastasiaCheckBroken: "magicCharge",
			anastasiaKingsInvocation: "magicHolyChoir",
			anastasiaInfernalInvocation: "magicDarkWail",

			infernalPawnGnash: "weaponBrutal",
			infernalPawnBrace: "buffSingle",
			infernalKnightSortie: "weaponBrutal",
			infernalKnightScout: "magicCharge",
			infernalBishopBlight: "magicDarkGeneric",
			infernalBishopHex: "debuffSingle",
			infernalRookGrudge: "magicEarth",
			infernalRookLashOut: "weaponKaboom",
			infernalQueenDominion: "weaponBrutal",
			infernalQueenScheme: "magicCharge",
			infernalQueenCorrupt: "magicDarkWail",
			infernalQueenDefection: "magicDarkWail",
			infernalQueenPetition: "magicHolyChoir",
			infernalKingRuin: "weaponKaboom",
			infernalKingTyranny: "buffParty",

			celestialPawnBulwark: "buffSingle",
			celestialPawnJab: "weaponClang",
			celestialKnightRelay: "weaponClang",
			celestialKnightSupport: "buffSingle",
			celestialBishopLitany: "magicHolyLight",
			celestialBishopBlessing: "debuffSingle",
			celestialRookImmure: "magicEarth",
			celestialRookBombard: "weaponKaboom",
			celestialQueenBenediction: "buffParty",
			celestialQueenRespite: "magicCharge",
			celestialQueenExalt: "buffParty",
			celestialQueenConversion: "magicHolyLight",
			celestialQueenPetition: "magicHolyChoir",
			//The gauntlet Queens' own two moves: the warning, and then the King himself rather than a card
			//that calls him.
			gauntletCelestialQueenHerald: "magicCharge",
			gauntletInfernalQueenHerald: "magicCharge",
			gauntletCelestialQueenCoronation: "magicHolyChoir",
			gauntletInfernalQueenCoronation: "magicDarkWail",
			celestialKingCastleDoctrine: "magicHolyChoir",
			celestialKingCoronation: "magicHolyChoir",

			//The gauntlet's boss plays her own kit, so her moves sound like the cards they mirror.
			gauntletAnastasiaCheck: "weaponSlash",
			gauntletAnastasiaDevelop: "magicDarkGeneric",
			gauntletAnastasiaPromotion: "magicCharge",
			gauntletAnastasiaQueening: "magicDarkWail",
			gauntletAnastasiaStudy: "buffParty",
			gauntletAnastasiaHold: "buffParty",

			//--- The card pool (CARD-POOL-01): picked by card kind; swap any row for a better sound ---
			brienneKeptWord: "weaponSlash",
			brienneOathOfIron: "buffSingle",
			brienneWeighTheCost: "buffSingle",
			brienneUnbrokenOath: "magicCharge",
			briennePromiseKept: "weaponSlash",
			briennePlatedCharge: "weaponSlash",
			brienneHeavySwing: "weaponSlash",
			brienneForgeTheLine: "buffParty",
			brienneTakeTheHit: "buffSingle",
			briennePayTheToll: "buffSingle",
			briennePayInKind: "weaponSlash",
			brienneLargesse: "buffSingle",
			brienneTribute: "weaponSlash",
			nettleQuickenRot: "magicDarkGeneric",
			nettleVenomSac: "magicDarkGeneric",
			nettleGraveChoice: "magicDarkGeneric",
			nettleRotFromWithin: "magicDarkGeneric",
			nettleDeathKnell: "magicDarkGeneric",
			nettleCorpsePyre: "magicDarkGeneric",
			nettleScatterSpores: "magicDarkGeneric",
			nettlePlagueBearer: "buffSingle",
			nettleSporeCloud: "magicDarkGeneric",
			nettleRotGarden: "magicCharge",
			nettleLoveBite: "magicDarkGeneric",
			nettleDrawOut: "magicDarkGeneric",
			nettleLotusSmoke: "lewdSplort",
			nettleAphrodisiac: "magicCharge",
			severineBloodthirst: "weaponSlash",
			severineAnswerInKind: "weaponSlash",
			severineRedChoice: "weaponSlash",
			severineFeedingFrenzy: "weaponSlash",
			severineScarTissue: "magicCharge",
			severineStalk: "weaponSlash",
			severineScentOfBlood: "weaponSlash",
			severinePounce: "weaponSlash",
			severinePackHunt: "buffSingle",
			severineBloodPrice: "weaponSlash",
			severineOpenVein: "weaponSlash",
			severineRedHarvest: "weaponSlash",
			severineBleedTogether: "buffSingle",
			severineHeartsToll: "weaponSlash",
			severineLeech: "weaponSlash",
			severineBloodDebt: "magicCharge",
			cinderGuardTheRear: "buffSingle",
			cinderSpendTheSpark: "weaponSlash",
			cinderEmberWatch: "magicCharge",
			cinderScorch: "weaponSlash",
			cinderTakePoint: "weaponSlash",
			cinderFlurryOfEmbers: "weaponSlash",
			cinderBlaze: "weaponSlash",
			cinderKindling: "buffSingle",
			cinderBeaconFlame: "magicSlash",
			cinderSunspear: "weaponBrutal",
			cinderRotateTheLine: "buffSingle",
			cinderFormationDrill: "magicCharge",
			cinderRelieve: "buffSingle",
			cinderBattleOrders: "buffSingle",
			cinderRallyTheRanks: "buffSingle",
			cinderRecklessSwing: "weaponBrutal",
			cinderBurnBright: "debuffSingle",
			cinderEmberSkin: "buffSingle",
			cinderPhoenixHeart: "magicCharge",
			cinderAshenCloak: "buffSingle",
			cinderFirewalk: "weaponSlash",
			cinderPassTheFlame: "weaponSlash",
			cinderTrialByFire: "debuffSingle",
			cinderCindersToAsh: "magicSlash",
			clemenceMendingWord: "healSmall",
			clemenceHeavenlyGaze: "lewdSplort",
			clemenceFontOfGrace: "magicCharge",
			clemenceAnsweredPrayer: "healSmall",
			clemenceStayWithMe: "buffSingle",
			clemenceSanctuary: "buffParty",
			clemenceMercy: "healSmall",
			clemenceBearTheWeight: "buffSingle",
			clemenceHairShirt: "buffSingle",
			clemenceBlessing: "magicCharge",
			clemenceMiracle: "healSmall",
			clemenceWantonGaze: "lewdSplort",
			clemenceLetGo: "lewdSplort",
			clemenceRapturesGift: "magicCharge",
			clemenceKindledWant: "lewdSplort",
			clemenceBrokenSaints: "buffParty",
			clemenceOrdeal: "buffSingle",
			clemencePenitentsDraw: "lewdSplort",
			clemenceAnoint: "healSmall",
			clemenceMendingWordBroken: "healSmall",
			clemenceHeavenlyGazeBroken: "lewdSplort",
			clemenceFontOfGraceBroken: "healSmall",
			clemenceAnsweredPrayerBroken: "healSmall",
			clemenceStayWithMeBroken: "buffSingle",
			clemenceSanctuaryBroken: "lewdSplort",
			clemenceMercyBroken: "healSmall",
			clemenceBearTheWeightBroken: "buffSingle",
			clemenceHairShirtBroken: "buffSingle",
			clemenceBlessingBroken: "buffSingle",
			clemenceMiracleBroken: "buffParty",
			clemenceWantonGazeBroken: "lewdSplort",
			clemenceLetGoBroken: "lewdSplort",
			clemenceRapturesGiftBroken: "lewdSplort",
			clemenceKindledWantBroken: "lewdSplort",
			clemenceBrokenSaintsBroken: "buffSingle",
			clemenceOrdealBroken: "buffSingle",
			clemencePenitentsDrawBroken: "lewdSplort",
			clemenceAnointBroken: "healSmall",
			clemenceTemptBroken: "lewdSplort",
			cassadoraTwistFate: "weaponSlash",
			cassadoraOmen: "weaponSlash",
			cassadoraCrossMyPalm: "magicWeird",
			cassadoraWheelOfFortune: "magicWeird",
			cassadoraDivination: "magicWeird",
			cassadoraPalmReading: "magicWeird",
			cassadoraAugury: "magicCharge",
			cassadoraReshuffle: "buffSingle",
			cassadoraCardUpSleeve: "magicWeird",
			cassadoraPortent: "magicWeird",
			cassadoraDestinysHand: "magicWeird",
			cassadoraTarotSpread: "magicWeird",
			cassadoraSleightOfHand: "magicWeird",
			cassadoraDoubleCross: "weaponSlash",
			cassadoraFence: "magicWeird",
			cassadoraAccomplice: "magicWeird",
			cassadoraGrandHeist: "magicWeird",
			cassadoraCurse: "debuffSingle",
			cassadoraEnfeeble: "debuffSingle",
			cassadoraMalediction: "buffSingle",
			cassadoraFrailty: "weaponSlash",
			cassadoraSpreadMisfortune: "buffSingle",
			cassadoraBadLuck: "debuffParty",
			cassadoraCovensCurse: "magicCharge",
			cassadoraWitchsBrew: "debuffParty",
		},

		//-------------------------------------------------------------------------------------------
		//Looping music. honeycomb-music.js plays it; audio/MUSIC.md explains every number.
		//-------------------------------------------------------------------------------------------
		//Three tracks: Title, which plays on game start until combat is triggered; Combat, which plays
		//until victory or defeat; and Map, which plays when combat ends until another new combat begins.
		music: {
			folder: "honeycomb sound/music/loop/",
			extension: ".mp3",
			//Multiplied onto the host's own music volume, so Syrup Town's slider governs both games.
			//The files are mastered to one loudness (-19 LUFS), so this one number places all three.
			volume: 0.7,
			//The level assumed with no host around to ask.
			standaloneVolume: 0.8,

			//`loopSeconds` is GENERATED: tools/music/build-music-loops.py writes it to
			//tools/music/music-metrics.json and suite block [123] fails when the two disagree. It is
			//the length of one lap, NOT the length of the file -- the file runs postRollSeconds longer.
			//`resume` keeps a track's place while another plays. The map is visited for half a minute
			//at a time, and without it no player would ever hear past its opening bars.
			//`combatShort` is the first 24 bars alone, built and ready: swap the `file` to hear it.
			trackArray: [
				{ index: "title", file: "title", loopSeconds: 72.546, resume: false },
				{ index: "combat", file: "combat", loopSeconds: 80, resume: false },
				{ index: "map", file: "map", loopSeconds: 117.073, resume: true },
			],
			postRollSeconds: 6,

			//WHICH TRACK A MOMENT ASKS FOR. A scene named here gets its track on entry. A scene left
			//for one with no track of its own hands over to its follow-up, so the combat track can
			//never outlive a fight however the fight was left. Every other scene keeps what is playing.
			defaultTrack: "title",
			sceneCueMap: { title: "title", combat: "combat" },
			afterSceneCueMap: { combat: "map" },
			//"until victory or defeat": the fight is decided a screen before the combat scene is left.
			//`combatBegan` covers a fight chained straight onto another, which is no scene change at all.
			eventCueMap: { combatBegan: "combat", combatEnded: "map" },

			//How one track gives way to another, by the track ARRIVING. `delayMs` is silence between
			//the two: the map waits for the victory stinger to be heard.
			transition: { fadeOutMs: 900, delayMs: 0, fadeInMs: 1800 },
			transitionByTrackMap: {
				combat: { fadeOutMs: 500, delayMs: 0, fadeInMs: 700 },
				map: { fadeOutMs: 700, delayMs: 1200, fadeInMs: 2500 },
			},
			//The music switch is a switch, not a scene change
			disabledFadeMs: 250,

			tickMs: 50,
			//Written to a spare element once, to find out whether this browser obeys `volume` at all
			volumeProbeLevel: 0.5,

			//THE CHANGEOVER between a track's two elements, once a lap. See honeycomb-music.js.
			handoff: {
				//How long before the lap ends the second element is made, so it has buffered
				prepareSeconds: 4,
				//How far ahead the incoming element is aimed, for the time play() takes to produce sound
				startLatencySeconds: 0.05,
				//The same allowance for a corrective seek
				seekLatencySeconds: 0.02,
				//Both of the above are only first guesses: the player replaces each with what it measured,
				//held inside this limit so one wild reading cannot poison the laps after it
				latencyLimitSeconds: 0.5,
				//How much of each measured mistake is believed. Half, because the reading is that noisy.
				latencyLearningRate: 0.5,
				//How far the incoming element's own clock must have run before its position is believed
				settleSeconds: 0.15,
				//Closer than this and the two are treated as lined up. Both carry the same audio, so
				//what is left over is a few hundred milliseconds of faint doubling, once a lap.
				//Measured in Chrome, both elements recorded and cross-correlated: a timed start lands 1 to
				//3ms out in the AUDIO while `currentTime` reads anything up to 13ms out. So this sits above
				//the clock's own noise -- a correction is for a start that was truly late (a throttled
				//tab), not for chasing a reading.
				toleranceSeconds: 0.025,
				//Two, not more: at a throttled tab's one tick a second, each costs a second of post-roll
				correctionMaximum: 2,
				fadeMs: 350,
				//With this much post-roll left the swap happens now, lined up or not
				forceSeconds: 1.5,
				//Where in the swap a browser with no volume control makes its cut
				cutPoint: 0.5,
			},
		},
	},

	//-------------------------------------------------------------------------------------------
	//Layout
	//-------------------------------------------------------------------------------------------
	//Sizes the JS needs to know about. Anything purely cosmetic lives in honeycomb.css instead;
	//these are the values code computes with, mirrored into CSS custom properties on mount so the
	//two can never drift apart.
	layout: {
		//The honeycomb pixel: every "Pixels" value in this file, and every length in honeycomb.css, is
		//drawn at this size on a screen whose SHORTER side is this many pixels, and scaled in proportion
		//on every other screen -- so a phone in landscape shows a faithful copy of the desktop. 900 is a
		//1080p monitor's browser window, where the game was laid out.
		//Input distances (drag thresholds, drop margins) are the exception: they are measured in real
		//pixels, because a finger does not shrink with the screen.
		referenceHeightPixels: 900,
		//How an enemy may be told to STAND: the fields an enemy definition's `presentation` and an
		//encounter's `placementArray` entry may carry. Read into CSS custom properties on the fighter by
		//the combat scene. scale 1 is drawn size; offsets are percentages of the sprite's own box,
		//positive right / down.
		placementFieldArray: ["scale", "offsetXPercent", "offsetYPercent", "anchor"],
		//`anchor: "back"` takes a combatant OUT of its side's row and stands them behind it, centred and
		//sized off the battlefield's height rather than a share of its width. That is what keeps a boss
		//from shrinking as her minions crowd in beside her.
		//A side holding this many or more is CROWDED: its fighters overlap rather than each getting
		//thinner, since five thin columns make five tiny characters.
		crowdedSideCount: 4,
		//How much of the battlefield each side takes: a side's width rises with how many stand in its
		//ROW: grow = 1 + (inRow - 1) * this. Measured at 1280x800 with five allies against one enemy:
		//0.25 renders the allies at 215px where three allies draw 193px today, so the board gets LESS
		//cramped as it fills, and the lone enemy is still the larger figure at 237px. 0.5 and above starve
		//the enemy row (117px at pure count weighting), so the knob matters. 0 restores an even 50/50 split.
		sideGrowPerExtraFighter: 0.25,
		//A smaller figure wears its nameplate lower: the art wrap scales from the FEET, so a piece at 0.68
		//stands a third shorter while its plate keeps a fixed share of the frame -- leaving the plate
		//floating above a small figure's head, unless the plate follows the same scale. This makes the
		//plate sit at the same point ON the body whatever size the body is. 1 tracks the figure exactly;
		//0 gives every fighter the same fixed placement regardless of size.
		vitalsFollowScale: 1,
		//Adjacent intent cards do not stack: every other fighter in a line steps its intent card this far
		//sideways -- a share of the fighter's own width, toward the middle of the board -- so two
		//neighbours do not lean over one another. 0 turns the stagger off.
		intentStaggerLeftPercent: 26,
		//And neither do two backdrop props: without this, a second figure on the same side would land
		//exactly on the first -- both of Anastasia's Kings in one fight would sit at the same box. Each
		//prop past the first steps this far inward, as a share of the battlefield. 0 stacks them again.
		backdropPropStepPercent: 16,
		//(How tall hand cards are belongs to the battle layout: see battleLayout below.)
		//Fan geometry for the hand. Total spread is divided across however many cards are held.
		handMaxSpreadDegrees: 22,
		handMaxRisePixels: 40,
		//HOW MUCH OF A CARD ITS RIGHT-HAND NEIGHBOUR COVERS, as a percentage of a card's width.
		//This was authored at 62 and never had any effect: the stylesheet multiplied a length by it as
		//a percentage, which is not valid calc, so the margin computed to 0 and the cards sat edge to
		//edge at every hand size. 15 is close to how the hand has actually been looking, so a small
		//hand is unchanged by the repair; a big one is pulled in by fitHandFan below, which is what
		//stops it reaching over the buttons. Put this back to 62 for the fan as it was first written.
		handOverlapPercent: 15,
		//HOW TIGHT A BIG HAND PULLS IN. The overlap above is what a hand that fits its own space uses.
		//A bigger hand is wider, and at eight or ten cards the fan reached over the piles and the Log
		//and Speed buttons beside it, which could then not be clicked. honeycomb.combatScene.fitHandFan
		//tightens the overlap until the fan fits the gap between those two blocks, and never past this,
		//which keeps a readable sliver of every card showing.
		handOverlapMaxPercent: 86,
		//How much of the gap the fan may use, so its outermost cards do not sit right against the
		//buttons. The rotation at the ends of the fan swings their corners out past their boxes.
		handFanGapUsedFraction: 0.94,
		//The play queue: a card pressed while a replay is running lifts out and waits over the middle of
		//the battlefield, in the order it will be played, rather than staying in the hand wearing a gold
		//ring that says "taken" but not "waiting to be played". Sizes are fractions of the battlefield's
		//height.
		playQueue: {
			cardHeightFraction: 0.22,
			//Gap between two waiting cards, as a fraction of a card's own width.
			gapFraction: 0.12,
			//How far above the battlefield's bottom edge the row sits, as a fraction of its height.
			bottomFraction: 0.0,
		},
		//A hovered card lifts, and grows to the LARGE card size (art.cardSize), so its text is readable
		//without a zoom overlay. How much it grows is derived from the two widths, never stated.
		handHoverLiftPixels: 60,
		//How far the hand sinks below the edge of the screen while nothing is happening, as a
		//percentage of card height. The board is what the player is reading between plays; the hand
		//comes back up the moment they reach for it.
		handRestingDropPercent: 46,
		//How far every OTHER card drops while one is being held, so the one in hand is unobstructed.
		handHeldDropPercent: 62,
		//How much a card being dropped away fades, so the retreat reads as intent rather than a glitch.
		handHeldOpacity: 0.45,
		//The swipe hint: a subtle line in the middle of the board on a touchscreen in landscape, saying a
		//phone's fullscreen notification can be swiped aside. Shown once per profile, only while the board
		//is at rest. How far a finger must travel to swipe the hint away, in real pixels (it measures a
		//finger, not a layout).
		swipeHintDismissPixels: 48,

		//The battlefield itself -- fighter windows, sprite sizes, where the vitals and the enemy's card
		//sit -- is a BATTLE LAYOUT now. See battleLayout below.

		//Party portrait strip and resource bar.
		portraitStripSizeVmin: 8,
		topBarHeightVmin: 7,

		//The draw and discard piles in combat, drawn as card-shaped STACKS the cards visibly leave and
		//land on. Height of the top card; how many cards' thickness the stack shows at most, and how many
		//cards in the pile each layer of thickness stands for.
		pileDeckHeightVmin: 10,
		pileDeckLayerMaximum: 4,
		pileDeckCardsPerLayer: 5,
	},

	//-------------------------------------------------------------------------------------------
	//Battle layouts
	//-------------------------------------------------------------------------------------------
	//A LAYOUT is one complete set of the numbers the combat screen is drawn from;
	//honeycomb.battleLayoutPropertyArray says which CSS variable each number feeds, so a new layout is a
	//table entry and nothing else. Yes/no fields are FLAGS that put a class on the screen (`framed:
	//false` adds hcUnframed), so a layout never needs CSS written against its own name.
	//
	//"jumbo" is the layout the game was built with: large framed windows, one per fighter. "stage" and
	//"crowd" were early exploratory layouts. "scene" is somewhere between Jumbo and Stage, toward mockup
	//2, and is the ONLY layout the game shows: there is no switching in play, so the others are reachable
	//only by a developer changing `defaultLayout`.
	battleLayout: {
		defaultLayout: "scene",
		layoutArray: [
			{
				index: "scene",
				name: "Scene",
				description: "Between Jumbo and Stage: large figures with no windows, standing together on the painted floor. Whoever is in focus steps forward.",
				framed: false,
				//FOCUS IS DISTANCE here (flag): the focused figure steps forward -- larger, lower, in front
				//-- and the rest step back up the floor. See the depth* numbers below.
				depthFocus: true,
				//The painting is shown nearly whole, darkened at its top and foot (flag) so the top bar,
				//the nameplates and the hand still read against it.
				vignette: true,
				backdropOpacity: 0.95,
				//The hand's shelf: the painted shelf and its two end pieces replace the plain bar, energy
				//orb and End Turn button. See tuning.art.handShelf.
				handShelf: true,
				//A crowd of enemies overlaps rather than each of them thinning, and a boss anchored behind
				//the row keeps a place this wide whatever is standing in front of her.
				crowdedGapVmin: -4,
				crowdedFighterMinimumPercent: 20,
				anchoredWidthPercent: 46,
				anchoredSpriteHeightPercent: 100,
				//And how tall the ROW draws while somebody is anchored behind it: bosses are always taller
				//than the minions in front of them. A share of the row's usual height, so the boss looms
				//over her guard by construction rather than by each encounter being posed by hand.
				minionHeightPercent: 74,
				//The end pieces' square, as a share of the screen's shorter side. Manually set to 40
				//Ideally the shelf would be even farther lower and rise with the hand.
				shelfEndSizeVmin: 40,
				//Figures a third taller than Stage's, and slightly OVERLAPPED (a negative gap) so a party
				//reads as a group standing together rather than a row of separate portraits, toward
				//mockup-2-battleImproved's proportions, where the figures stand about two fifths of the
				//screen tall over a taller hand area.
				fighterFrameAspect: 0.45,
				fighterFrameHeightPercent: 70,
				allySpritePercentHeight: 100,
				enemySpritePercentHeight: 100,
				allyMaxWidthPercent: 36,
				enemyMaxWidthPercent: 44,
				fighterGapVmin: 5,
				sideGapVmin: 6,
				//How much of its own width each side spends on padding: a hard 5% in the stylesheet took
				//124px of 1280 off a side already too narrow for five figures. A layout that leaves this
				//out keeps the stylesheet's own 5%.
				sidePaddingPercent: 2,
				//Where the nameplate sits up the figure. Hand-set; the ability button that used to hang
				//below it is gone now that abilities are drawn ON the plate.
				vitalsBottomPercent: 30,
				//Odd party places wear their plate higher, to break up the visual static-ness. Added to
				//vitalsBottomPercent for the 1st, 3rd, 5th... fighter of a side; an anchored boss is left
				//where she is. The enemy side has its own number, off by default.
				allyPlateStaggerPercent: 5,
				enemyPlateStaggerPercent: 0,
				floorVmin: 0,
				//The enemy's next card stands BESIDE the enemy, low, as the mockup has it -- beside the legs
				//and reaching down to nameplate height -- rather than over its head: out to the left of the
				//figure (negative), overlapping its edge.
				intentCardWidthPercent: 42,
				intentCardTopPercent: 56,
				intentCardLeftPercent: -22,
				//Smaller than the layout default (24), to avoid blocking the deck and discard; the hover
				//lift still enlarges one to read.
				handCardHeightVmin: 18,
				//The step: scale and drop (a share of the figure's height) for FOCUSED, and the scale and
				//rise per level for half- and non-focused. Scaled from the feet, so nobody sinks.
				depthForwardScale: 1.15,
				depthForwardDropPercent: 5,
				depthHalfScale: 0.9,
				depthNoneScale: 0.8,
				depthBackRisePercent: 2.2,
				//How quiet a party member's plate is at rest: semi-transparent until hovered, then normal
				//opacity. Under the pointer it goes to 1; nothing about it moves. 1 turns the fade off and
				//leaves every plate fully lit.
				plateRestOpacity: 0.68,
			},
			{
				index: "jumbo",
				name: "Jumbo",
				description: "Large framed windows, one per fighter. Strongest against a blank background.",
				//EACH FIGHTER STANDS IN THEIR OWN FRAMED WINDOW rather than sharing one scene. That
				//framing lets every character be drawn facing the viewer without the group looking like
				//it is ignoring itself, and it is why enemy sprites need no mirroring.
				framed: true,
				//Window shape, width over height (portrait: the art is full-body), and its height as a
				//percentage of the battlefield.
				fighterFrameAspect: 0.72,
				fighterFrameHeightPercent: 96,
				//Sprite height inside its window.
				allySpritePercentHeight: 88,
				enemySpritePercentHeight: 84,
				//Where the vitals sit, up from the window's foot. Thigh height, so the bars OVERLAP the
				//character rather than sitting under them in a strip of their own.
				vitalsBottomPercent: 24,
				//The widest one fighter may be, as a share of their side.
				allyMaxWidthPercent: 30,
				enemyMaxWidthPercent: 34,
				//Space between fighters on a side (fighterGapVmin) and between the two sides (sideGapVmin).
				//OMITTED here, so the stylesheet's own spacing scale applies -- which is what "jumbo" was
				//built on. Any number a layout leaves out falls back the same way.
				//How far above the screen's floor the fighters stand (vmin: padding percentages would be of the width).
				floorVmin: 0,
				//How strongly the painted backdrop shows through.
				backdropOpacity: 0.4,
				//The enemy's next card: its width as a share of the fighter, how far down the fighter's window
				//it sits (a share of the window), and how far out to the side (a share of the fighter).
				intentCardWidthPercent: 46,
				intentCardTopPercent: 12,
				intentCardLeftPercent: -14,
				//Hand cards, as a fraction of the screen's shorter side.
				handCardHeightVmin: 26,
			},
			{
				index: "stage",
				name: "Stage",
				description: "No windows: smaller figures share one stage, so the backdrop shows and big enemies and wide animations have room.",
				framed: false,
				fighterFrameAspect: 0.5,
				fighterFrameHeightPercent: 62,
				allySpritePercentHeight: 100,
				enemySpritePercentHeight: 100,
				vitalsBottomPercent: -4,
				allyMaxWidthPercent: 33,
				enemyMaxWidthPercent: 42,
				fighterGapVmin: 0.6,
				sideGapVmin: 8,
				floorVmin: 5,
				backdropOpacity: 0.85,
				intentCardWidthPercent: 56,
				intentCardTopPercent: 2,
				intentCardLeftPercent: 22,
				handCardHeightVmin: 24,
			},
			{
				index: "crowd",
				name: "Crowd",
				description: "Narrower windows, for parties larger than three.",
				framed: true,
				fighterFrameAspect: 0.56,
				fighterFrameHeightPercent: 46,
				allySpritePercentHeight: 92,
				enemySpritePercentHeight: 88,
				vitalsBottomPercent: 16,
				allyMaxWidthPercent: 19,
				enemyMaxWidthPercent: 26,
				fighterGapVmin: 0.8,
				sideGapVmin: 2.4,
				floorVmin: 1.5,
				backdropOpacity: 0.5,
				intentCardWidthPercent: 58,
				intentCardTopPercent: 8,
				intentCardLeftPercent: -12,
				handCardHeightVmin: 24,
			},
		],
	},

	//-------------------------------------------------------------------------------------------
	//Focus
	//-------------------------------------------------------------------------------------------
	//THREE LEVELS OF ATTENTION, used everywhere on the battlefield and in the hand, so "what is this
	//about" always reads the same way:
	//  FOCUSED       as drawn. What the player is acting with or on.
	//  HALF-FOCUSED  a little darker. Still relevant: the rest of the party while a card is hovered,
	//                the other cards while one is being read.
	//  NON-FOCUSED   darker and desaturated, settled back. Not part of what is happening -- a fighter a
	//                held card does not concern, the hand while nobody is looking at it.
	//The values are CSS filter amounts and a small step back, mirrored into the stylesheet.
	focus: {
		halfBrightness: 0.74,
		halfSaturation: 0.9,
		noneBrightness: 0.46,
		noneSaturation: 0.4,
		//How far a non-focused fighter settles back into the scene.
		noneDropPixels: 4,
		noneScale: 0.97,
		//The hand at rest -- sunk and unread -- is non-focused too, but a touch lighter, because it is
		//still the player's own and they should be able to glance at it.
		handRestingBrightness: 0.62,
		handRestingSaturation: 0.55,
	},

	//-------------------------------------------------------------------------------------------
	//Animation
	//-------------------------------------------------------------------------------------------
	//Durations in milliseconds. Two-frame animation is the baseline the art pipeline promises, so
	//"frame" here means how long the alternate pose is held before reverting.
	animation: {
		//Input during a replay is queued, not dropped. While anything is queued, the waits between the
		//replay's remaining beats are multiplied by this, so the queued play or turn end arrives sooner. 1
		//turns the hurry off. The cut-ins are exempt: their holds were paced by hand.
		queuedInputPace: 0.5,
		queuedInputPaceExemptTypeArray: ["broken", "recovered", "lustRank"],
		//A two-frame action: swap to the action frame, hold, swap back.
		actionFrameHoldMs: 800,
		//Hit reaction: tint and shake.
		hitFlashMs: 180,
		hitShakePixels: 10,
		//Poison's barrage: every poisoned combatant ticks when the other side's turn ends, each as its own
		//damage beat. Its wait is this instead of the full hit flash, so a poisoned line pops in quick
		//succession rather than one slow hit each.
		poisonTickMs: 90,
		//Beats that belong to another beat: a log entry may name a `pace`; the replay then waits this long
		//instead of the duration its own type would ask for. Poison's stack decay is not a moment of its
		//own -- it is the same tick as the damage just played -- so it rides the barrage at no cost.
		//Without this the decay's full statusPulseMs would land between every tick, measured at 410ms an
		//enemy instead of 90. A new pace is one entry here plus the `pace` the effect stamps on its log
		//entry.
		beatPaceMsMap: { barrage: 0 },
		//Element travel, used when a card flies to the discard or an enemy lunges.
		elementTravelMs: 260,
		//Delay between consecutive enemy actions so a multi-enemy turn reads one beat at a time.
		enemyActionGapMs: 420,
		//How long a telegraph changed mid-turn holds its flip (the `intent` replay beat). Matches the
		//hcIntentSwitched keyframes in honeycomb.css.
		intentSwitchMs: 320,
		//How long a commanded change to the board -- a piece summoned, promoted, raised, its telegraph
		//switched -- waits while a fighter is mid-gesture, so the gesture is seen BEFORE what it caused
		//(honeycomb.combatScene.afterCommandLead).
		commandLeadMs: 240,
		//Card draw stagger: the gap between one drawn card setting off and the next.
		cardDealGapMs: 110,
		//Number popups.
		floatingNumberMs: 900,
		floatingNumberRisePixels: 70,
		//The width of the random sideways scatter, centred, that keeps stacked numbers from overlapping.
		floatingNumberScatterPixels: 40,
		//How long a status icon pulses when its stack count changes.
		statusPulseMs: 320,
		//How long a character's own meter takes to move, and to pulse when it does.
		mechanicMoveMs: 320,

		//--- Impact ---
		//A hit that takes a real bite out of somebody shakes the whole battlefield. Scaled by the
		//fraction of maximum health lost, so a chip does nothing and a heavy blow is felt; a fixed
		//shake on every hit is noise rather than weight.
		//Fraction of maximum health a hit must remove before the screen moves at all.
		shakeThresholdFraction: 0.06,
		//Fraction that produces the full shake. Anything above is clamped to it.
		shakeFullFraction: 0.30,
		shakeMinimumPixels: 3,
		shakeMaximumPixels: 14,
		shakeMs: 260,
		//The pause on a heavy landing, before the rest of the log continues. A beat of stillness is
		//what makes a hit land; without it a big blow reads exactly like a small one.
		hitStopMs: 90,
		//Fraction of maximum health that earns a hit stop.
		hitStopFraction: 0.18,
		//The trailing bar showing what was just lost. Held still, then drained.
		healthTrailHoldMs: 240,
		healthTrailDrainMs: 420,
		//The banner that names whose turn it is. It LIVES for turnBannerMs and the replay WAITS for
		//turnBannerHoldMs, so it keeps playing over the first thing that happens instead of costing a
		//full second of a board nobody may touch.
		turnBannerMs: 900,
		turnBannerHoldMs: 340,
		//How long a played card is shown travelling to what it was aimed at before it dissolves, and the
		//fraction of its size it has shrunk to when it gets there (the hcCardFlight keyframe reads it too).
		cardFlightMs: 300,
		cardFlightEndScale: 0.25,

		//--- Cards travelling between the hand and the piles ---
		//The fan closing up or opening out when a card leaves or joins it.
		handFlowMs: 240,
		//A drawn card flying from the draw pile to its place in the hand, and the smallest fraction of
		//its hand size it starts at (it starts as big as the pile it came out of).
		cardDealMs: 380,
		cardDealStartScaleMinimum: 0.15,
		//Gap between consecutive cards leaving the hand, so the end-of-turn sweep reads card by card.
		cardDiscardGapMs: 55,
		//A card flying from the hand to a pile, or from pile to pile; how far it turns on the way, and
		//how opaque it is by the time it shrinks into the pile's icon.
		pileFlightMs: 380,
		pileFlightTurnDegrees: 14,
		pileArrivalOpacity: 0.35,
		//A card setting off from a pile is drawn this many times the height of the pile's icon.
		pileCardHeightMultiple: 2.2,
		//The pile icon's bump when a card lands in it.
		pileBumpMs: 260,
		//An exhausted card burning away where it stands.
		exhaustMs: 460,
		//A card that did not exist a moment ago -- a Wisp an enemy slips into the discard -- appears over
		//whoever made it at a readable size (a fraction of the battlefield's height), is held there to be
		//read, and only then goes to its pile. A second one made in the same beat stands beside the
		//first, a fraction of a card's width along, and the replay moves on after createdCardGapMs.
		createdCardRevealMs: 240,
		createdCardHoldMs: 700,
		createdCardHeightFraction: 0.42,
		createdCardSpreadFraction: 1.08,
		createdCardGapMs: 260,
		//The reshuffle: up to this many card backs fly from the discard to the draw pile to stand for
		//the lot, this far apart.
		reshuffleCardMaximum: 6,
		reshuffleGapMs: 70,
		//A member SLIDING to a new place in the party, when a card moves them. Long enough to read as
		//someone stepping forward, which is what an un-animated reorder failed to do.
		partyShiftMs: 380,
		//Named paces a move may ask for instead (the shiftParty effect's `pace`). `slideMs` is the slide,
		//`holdMs` how long the replay waits before its next beat -- shorter than the slide for a CHARGE, so
		//the hit lands as the figure arrives.
		partyShiftPaceArray: [
			{ index: "charge", slideMs: 190, holdMs: 110 },
		],
		//The same slide previewed while a card is held, before anything is committed.
		shiftPreviewMs: 200,
		//A figure stepping forward into focus, or back out of it, in a depth-focus layout.
		depthStepMs: 260,

		//--- An enemy playing its card ---
		//The card leaves the enemy's corner and enlarges over the middle of the battlefield
		//(revealMs), is held there to be read (holdMs), and only then does the move land; it fades as
		//the move plays out (leaveMs). The battle log keeps it readable afterwards, so the hold is
		//a glance rather than a reading.
		enemyCardRevealEnabled: true,
		enemyCardRevealMs: 260,
		enemyCardHoldMs: 700,
		//Whether the read overlaps the animation. The card still opens and holds over the board, but the
		//replay does not WAIT for it: the enemy's pose and the hit play out underneath, so reading the
		//card costs the turn no wall-clock. Off restores the strict sequence (card, then pose, then hit).
		overlapEnemyCardRead: true,
		enemyCardLeaveMs: 240,
		//How big the enlarged card stands is the LARGE card size (art.cardSize).

		//Master multiplier, so the whole game can be sped up for testing without editing each value.
		speedMultiplier: 1,
		//Speeds the PLAYER may choose, multiplied onto the master one. Chosen from the combat screen and
		//kept on the profile. See honeycomb.duration.
		//
		//The slow end is for looking at animations: the four steps below Slower are not a difficulty
		//setting; they exist so a cut-in can be walked through frame by frame while it is being built. The
		//control that picks from this list is a SLIDER over the array, so adding a step here is the whole
		//of adding a speed -- order the list slowest first, since that is the order the bar reads in.
		playSpeedArray: [
			{ index: "frameByFrame", name: "Frame by Frame", label: "0.1×", multiplier: 0.1, inspection: true },
			{ index: "crawl", name: "Crawl", label: "0.25×", multiplier: 0.25, inspection: true },
			{ index: "study", name: "Study", label: "0.4×", multiplier: 0.4, inspection: true },
			{ index: "slower", name: "Slower", label: "0.55×", multiplier: 0.55, inspection: true },
			{ index: "slow", name: "Slow", label: "0.7×", multiplier: 0.7 },
			{ index: "normal", name: "Normal", label: "1×", multiplier: 1 },
			{ index: "fast", name: "Fast", label: "1.6×", multiplier: 1.6 },
			{ index: "fastest", name: "Fastest", label: "2.5×", multiplier: 2.5 },
		],
		defaultPlaySpeed: "normal",
	},

	//-------------------------------------------------------------------------------------------
	//Attack VFX
	//-------------------------------------------------------------------------------------------
	//A VFX is one image laid over the target and played as a beat. `suffixRuleArray` names the files whose
	//suffix decides how the background is treated; a file matching none is inspected instead (its four
	//corner pixels), and `defaultAttackPath` is what every ordinary attack plays unless its effect names
	//its own `vfx` (or "none").
	vfx: {
		enabled: true,
		durationMs: 520,
		//The image's width as a percentage of the fighter's box. Over 100 so the effect reaches past the
		//sprite.
		sizePercent: 135,
		defaultAttackPath: "vfx/test-green",
		//Suffix first. Chroma colors are [r, g, b]; `tolerance` is the colour distance keyed out whole.
		//`filter` names the SVG filter that keys it (honeycomb.vfx.ensureFilters) -- a runtime, pixel-free
		//key that works on a local `file://` page, where a canvas would be tainted and unreadable.
		suffixRuleArray: [
			{ suffix: "-additive", blend: "additive", filter: "Black" },
			{ suffix: "-green", blend: "chroma", chromaColor: [0, 255, 0], tolerance: 90, filter: "Green" },
			{ suffix: "-magenta", blend: "chroma", chromaColor: [255, 0, 255], tolerance: 90, filter: "Magenta" },
		],
		//The corner-pixel backup: four corners within this distance of each other count as one key; a key
		//this dark is read as an additive layer, anything else as a chroma key.
		cornerTolerance: 26,
		darkThreshold: 24,
		defaultTolerance: 70,
		//An ADDITIVE effect still has its near-black ground keyed to alpha, so the black square cannot
		//show where the blend's backdrop is dark or the element is isolated; the bright pixels screen.
		additiveBlackTolerance: 20,
		additiveBlackFeather: 72,
		//Between `tolerance` and tolerance × this, alpha feathers in rather than snapping, which keeps a
		//hard key edge from showing.
		featherMultiple: 1.6,
	},

	//-------------------------------------------------------------------------------------------
	//The !!BROKEN!! cut-in
	//-------------------------------------------------------------------------------------------
	//Six layers over the whole screen, back to front, keyed to three moments: START, MIDPOINT, END.
	//The mockup is v13 spire images/mockups/mockup-6-breakdown.webp, with the background chains
	//shown alone in mockup-6-backgroundChainsOnlyForReference.webp. See !designDocs/honeycomb/reference/BROKEN-01.md
	//for the layer-by-layer brief this was built from, and honeycomb-overlays-broken.js for the code.
	//
	//Every duration here is in milliseconds BEFORE the player's play-speed multiplier; everything goes
	//through honeycomb.duration, so the whole cut-in respects the speed control like any other beat.
	brokenOverlay: {
		enabled: true,
		//The three moments. `start` is the chains flying in and the tear opening; `hold` is the beat the
		//cut-in sits still and is read; `exit` is the screenwipe.
		startDuration: 620,
		holdDuration: 900,
		exitDuration: 520,
		//The cut-in's own pace: every duration above and below is played at this share of speed (0.7 = the
		//"Slow" play speed), ON TOP OF the player's own play speed -- EXCEPT the still tail of the hold.
		//`holdRestFraction` is that tail: the share of holdDuration after the last thing moving in the
		//hold has settled (the text slam and the chains' hold both end at 55% of it), which keeps its 1x
		//length. See honeycomb.brokenOverlay.timeline.
		paceMultiplier: 0.7,
		holdRestFraction: 0.45,
		//prefers-reduced-motion: the naive reduced-motion version showed every layer finished from the
		//first frame while the stage's erase switched off, so the black wipe still ran without anything to
		//erase. Android's "Remove animations" (and some battery savers) turn the preference on in Firefox.
		//False plays the full cut-in whatever the device asks; true plays the still version, which erases
		//in step with the wipe.
		honorReducedMotion: false,
		//How long the whole thing blocks the combat replay. The replay resumes as the wipe clears, so
		//this is start + hold + exit unless it is deliberately shortened.
		blockingFraction: 1,

		//LAYER 1 -- three copies of ui/broken/brokenChainBackground, which is built to loop. Each entry
		//is one copy: where it crosses the screen, at what angle, how much longer than the screen it is
		//drawn, and how far it travels along its own axis during the fly-in and the fly-out.
		//`blur` is the motion blur, in pixels along the direction of travel.
		chainArray: [
			{ topPercent: 16, angleDegrees: 34, lengthFactor: 2.6, scale: 0.72, travelPercent: 150, blur: 14, delay: 0 },
			{ topPercent: 54, angleDegrees: -28, lengthFactor: 2.8, scale: 0.9, travelPercent: -170, blur: 18, delay: 60 },
			{ topPercent: 78, angleDegrees: 21, lengthFactor: 2.4, scale: 0.62, travelPercent: 130, blur: 11, delay: 120 },
		],
		//The chains hold still for this share of the hold before they start moving off again.
		chainHoldFraction: 0.55,

		//LAYERS 2 AND 3 -- the tear. The claw shape is culled by ui/broken/brokenClawMask; because a CSS
		//mask reads ALPHA and that file is opaque OUTSIDE the tear, the runtime uses the generated
		//complement brokenClawMaskInner.webp. See BROKEN-01.md, "The claw mask is used inverted".
		clawMaskPath: "ui/broken/brokenClawMaskInner",
		clawRimPath: "ui/broken/brokenClaw",
		//WHERE THE TEAR OPENS FROM. Six points measured off ui/broken/brokenClawStart (1920x1080),
		//as percentages, one per stroke. The white fill and then the character background grow out of
		//these as mask-size animations, which is what reads as the tear widening and then giving way.
		clawStartArray: [
			{ leftPercent: 24, topPercent: 48 }, { leftPercent: 43, topPercent: 46 },
			{ leftPercent: 50, topPercent: 49 }, { leftPercent: 65, topPercent: 45 },
			{ leftPercent: 69, topPercent: 53 }, { leftPercent: 75, topPercent: 57 },
		],
		//How large each growth blob ends up, as a percentage of the screen. Generous, because the claw
		//mask is doing the real shaping -- these only control the ORDER the tear fills in.
		clawGrowWidthPercent: 90,
		clawGrowHeightPercent: 160,
		//The soft edge of each blob, as a share of its radius. 1 is a pure gradient, 0 a hard circle.
		clawGrowSoftness: 0.45,
		//The white fill opens over this share of the start; the background then eats it over this share
		//of the hold.
		clawWhiteFraction: 0.96,
		clawRevealFraction: 0.5,
		//The rim grows with the tear: the drawn edge carries the same six growth gradients the fill does,
		//which reveals the outline only where the tear has actually opened -- the mask is the GROWTH mask,
		//not the claw silhouette, so nothing of the drawing is cut off.
		//`clawRimFraction` is the share of the start the rim takes to form; `clawRimLeadFraction` is how
		//much of it happens before the white starts, so the edge forms a hair ahead of the fill behind
		//it. Both as shares of startDuration.
		clawRimFraction: 0.82,
		clawRimLeadFraction: 0.14,
		//Where the growth STARTS, as a share of where it ends. Not zero: a blob smaller than the claw's
		//own strokes paints nothing at all, so growing from nothing meant an empty screen and then a
		//tear appearing halfway through the opening. A small starting size shows the first thin
		//scratches immediately and widens them, which is the "just forming" reading asked for.
		clawGrowStartFraction: 0.16,

		//LAYER 4 -- the front chain, which swaps art at the midpoint to show it snapping.
		frontChainWholePath: "ui/broken/brokenChainFront1",
		frontChainBrokenPath: "ui/broken/brokenChainFront2",
		//Hearts on a broken fighter on the board, once the cut-in has gone: each grows, floats up while
		//wobbling slightly, then shrinks and vanishes.
		//Each entry is one heart on its own loop, placed in percentages of the SPRITE's box (left/top are
		//where it is born) and started `delayFraction` of a cycle late so they never rise together. The
		//plate covers roughly the middle half of a fighter's box, so hearts born behind it would be hidden;
		//most start above it and rise over the head. See honeycomb.combatScene.renderBrokenHearts.
		fighterHeartPath: "icons/heart-red",
		//The game's hearts are red, which reads as health; the same pink shift the plate's lust heart wears.
		//The glow around each heart is in the stylesheet, where its size can be a honeycomb pixel.
		fighterHeartFilter: "hue-rotate(-32deg) saturate(1.25) brightness(1.2)",
		fighterHeartArray: [
			{ leftPercent: 26, topPercent: 30, sizePercent: 18, delayFraction: 0 },
			{ leftPercent: 70, topPercent: 22, sizePercent: 14, delayFraction: 0.38 },
			{ leftPercent: 48, topPercent: 12, sizePercent: 16, delayFraction: 0.7 },
			{ leftPercent: 80, topPercent: 72, sizePercent: 12, delayFraction: 0.2 },
			{ leftPercent: 18, topPercent: 80, sizePercent: 13, delayFraction: 0.55 },
		],
		//One heart's whole life: grow, rise, shrink. Milliseconds before the play speed.
		fighterHeartCycleDuration: 2600,
		//How far it rises over that life, as a percentage of the heart's OWN height (220 = two and a bit
		//hearts), so a smaller heart drifts a shorter way.
		fighterHeartRisePercent: 220,
		//The wobble: a side-to-side sway, as a share of the heart's own width, and the tilt that goes
		//with it, over `fighterHeartWobbleDuration` for one full sway there and back.
		fighterHeartWobblePercent: 18,
		fighterHeartWobbleDegrees: 9,
		fighterHeartWobbleDuration: 900,
		frontChainTravelPercent: -120,
		frontChainBlur: 22,
		//How hard the break kicks the two halves apart once the art swaps.
		frontChainSnapPercent: 2.4,
		//WHEN THE STINGER PLAYS. The front chain swaps whole -> snapped this far into hold+exit after the
		//start (hcBrokenSnap in honeycomb.css), and `!broken` is scheduled for that moment rather than
		//playing over the whole fly-in. The file's own 160ms of leading silence is subtracted on top
		//(tuning.audio.leadInMsMap), so it is the SOUND that lands on the snap, not the file that starts
		//on it.
		//Measured, not assumed: sampling the snapped chain's computed opacity every frame puts the swap at
		//1062-1078ms of a 2741ms cut-in. Leaving the lead-in out of the timer would land the attack about
		//70ms AFTER the chain had already broken.
		stingerSnapFraction: 0.1,

		//LAYER 5 -- the character. characterScale is the height as a share of the screen;
		//characterOffsetPercent slides it sideways from centre. Both may be overridden per character by
		//`brokenArt` on the definition. This is the number to move if the cut-in reads too cluttered.
		characterScale: 0.85,
		characterOffsetPercent: 0,
		//How far below the screen it starts, as a share of its own height.
		characterRisePercent: 100,

		//LAYER 6 -- the text, which arrives at the midpoint in a flash of red.
		textPath: "ui/broken/brokenText",
		textScale: 1,
		textFlashDuration: 180,
		textOvershoot: 1.18,

		//THE EXIT. A diagonally slanted black wipe left to right that erases what it passes over.
		//
		//The wipe is THE EDGE OF THE CUT-IN: the whole stage is clipped to the region ahead of it, and the
		//black band rides that edge so the moment of removal is covered rather than watched, not merely a
		//shape passing over independent elements. Both halves are cut from the same two numbers below,
		//which is what keeps them locked together -- an angle for one and a polygon for the other would
		//drift the first time either moved.
		//
		//The slant, as a share of the screen's WIDTH rather than an angle: how much further right the
		//top of the edge runs than the bottom. A percentage rather than degrees because both the stage's
		//clip and the band's are polygons in percentages, and a shared number cannot disagree with
		//itself the way a shared angle and a shared polygon can.
		wipeSlantPercent: 26,
		//How wide the black band is -- the strip of screen where the removal happens out of sight.
		wipeBandPercent: 22,
		//Shake through the whole cut-in, in pixels, scaled by the play speed like everything else.
		shakePixels: 9,
	},

	//-------------------------------------------------------------------------------------------
	//The recovery cut-in
	//-------------------------------------------------------------------------------------------
	//Faster and simpler than the break, as asked: a Persona-style eye band. The rails come from
	//ui/broken/recoverBar, the window they leave from ui/broken/recoverBarMask, and the colour behind
	//from the character's own recoverBG.
	recoverOverlay: {
		enabled: true,
		openDuration: 220,
		holdDuration: 420,
		closeDuration: 220,
		barPath: "ui/broken/recoverBar",
		barMaskPath: "ui/broken/recoverBarMaskInner",
		//Where the eyes are in the character's `recover` art, as a rectangle in percentages of that image.
		//`heightPercent` is the only zoom control: the crop is scaled UNIFORMLY so that this much of the
		//picture's height fills the slot, and however much width that gives is what is shown -- stretching
		//the two axes independently turns a face into a single eye filling the screen. centreXPercent is
		//what sits in the middle of the slot. The window shows a THIRD of the picture's height -- head and
		//shoulders -- and at that zoom the picture is narrower than the slot, so `edgeFadePercent` fades
		//its own left and right edges into the backdrop. Each character sets her own window
		//(`recoverEyeWindow`); this is the fallback for one with no recover art, which falls back to the
		//portrait.
		eyeWindow: { centreXPercent: 50, topPercent: 18, heightPercent: 32 },
		//How much of the picture's width, on EACH side, fades out into the backdrop.
		edgeFadePercent: 22,
		//How far the eyes slide, as a share of the slot's width. The crop is wider than the slot at any
		//sane zoom, so there is always something to slide into view.
		eyeSlidePercent: 9,
		//THE SLOT the eyes are drawn in: the gap between the two rails of ui/broken/recoverBar, measured
		//off the art (rails at 25.5-34.7% and 56.8-65.8% of 1080). The BAND is the wider window
		//recoverBarMask cuts, which the backdrop fills and the rails sit inside.
		slotTopPercent: 34.7,
		slotHeightPercent: 22.1,
		//A soft light sweep across the band as it holds.
		sweepDuration: 520,
	},

	//-------------------------------------------------------------------------------------------
	//The half-health cut-in
	//-------------------------------------------------------------------------------------------
	//The exposed cut-in: the broken cut-in's CHARACTER LAYER alone, on a dark scrim -- no chains, no
	//tear, no wipe. The art is the character's own EXPOSED picture when one is drawn
	//(`characters/<folder>/<outfit>/exposed`), falling back to the hurt tier the board already draws at
	//this health (honeycomb.art.tierFor). Once per fight per character. See honeycomb.art.exposedChain.
	halfHealthOverlay: {
		enabled: true,
		//The fraction of maximum health at or below which the cut-in fires, matching the art tier's own
		//threshold so the sprite on screen is the one the board draws.
		thresholdFraction: 0.5,
		startDuration: 240,
		holdDuration: 640,
		exitDuration: 200,
		//The sprite, scaled from the feet like the broken layer, rising into place. 0.85 of the screen
		//high, the broken layer's own fit -- 1.18 would hang the head above the top edge.
		characterScale: 0.85,
		characterOffsetPercent: 0,
		characterRisePercent: 7,
		//The word itself, in ui/exposed/exposedText: centred near the foot of the screen, slamming in.
		textPath: "ui/exposed/exposedText",
		textScale: 1,
		textBottomPercent: 9,
		//How dark the screen behind it goes, so the figure is the only thing to look at.
		scrimOpacity: 0.72,
		//The replay waits this share of the total, as the break does.
		blockingFraction: 1,
	},

	//-------------------------------------------------------------------------------------------
	//The weakness rank cut-in
	//-------------------------------------------------------------------------------------------
	//A card sliding in from the side rather than a full-screen slam: crossing a rank is bad news about
	//the long game rather than a moment in this fight, and the !!BROKEN!! cut-in already owns the whole
	//screen. See honeycomb.weaknessOverlay.
	weaknessOverlay: {
		enabled: true,
		enterDuration: 380,
		holdDuration: 2100,
		leaveDuration: 320,
		//How far off the side it starts and ends, as a share of its own width.
		travelPercent: 120,
	},

	//-------------------------------------------------------------------------------------------
	//Forecasts
	//-------------------------------------------------------------------------------------------
	//How much of what is about to happen the game says out loud. Every forecast is the REAL action
	//dry-run against a copy of the world and rolled back, so these switches govern how much is
	//shown -- never how it is calculated. See honeycomb-forecast.js.
	//
	//Worth knowing before turning either off: because the RNG is deterministic, a forecast is exact
	//rather than a range. It will name the ally a random attack picks. That is a design choice about
	//how much certainty the game hands the player, which is why it is a switch and not a constant.
	forecast: {
		//The marks that appear while a card is being aimed: what it would take off, and whether it
		//finishes the target.
		aimEnabled: true,
		//The standing mark on every ally bar: what ending the turn now would cost them. Answers "will
		//this kill me", which the intent icons were being asked and could not answer.
		incomingEnabled: true,
		//Whether an ally the incoming forecast would down is called out beyond the bar mark.
		warnOnLethalIncoming: true,
		//While a card is HELD, the incoming forecast is answered again as if it had been played: the
		//owner's move through the party, the enemy it kills, the gold it grants. Off shows the resting
		//forecast however the card would change it.
		heldEnabled: true,
		//The incoming forecast runs on into the start of the party's NEXT turn, so poison and anything
		//else that ticks there is counted. It is still "what happens if the turn ends now".
		includeNextTurnStart: true,
		//And it is shown on ENEMY bars too, which is where poison the party applied actually lands.
		//Off reports the party only.
		incomingIncludesEnemies: true,
		//How a hit left to a random pick is shown. "potential" spreads it as a MIGHT across everyone it
		//could land on; "exact" names the one the deterministic dry run picked. Exact is truthful at the
		//moment it is read, but anything else the player does can move the pick, so it reads as a
		//promise the game then breaks.
		randomTargets: "potential",
		//Inspecting a lewd card pauses the resting forecast and shows each of the opposing party's
		//weaknesses to the tags on that card instead. Off leaves the resting forecast up and draws no
		//panels.
		lustInspectionEnabled: true,
		//The card type that opens the inspection. A card is inspected when it has this type anywhere in its
		//list, not only first, so Spores (Negative, then Lewd) is read the same way.
		lustInspectionCardType: "lewd",
		//Whether the panel over a fighter names the ordinary damage the card would also deal, beside the lust.
		lustInspectionShowsDamage: true,
	},

	//-------------------------------------------------------------------------------------------
	//Combat
	//-------------------------------------------------------------------------------------------
	combat: {
		//Cards drawn at the start of each player turn.
		handSizePerTurn: 5,
		//Hard ceiling on held cards; draws past it are discarded rather than held.
		handSizeMaximum: 10,
		//Shown on the board when a scry has nothing to look at, so the card is never silently inert.
		//A scry entry may override it with its own `emptyText`.
		scryEmptyText: "Your draw pile is empty.",
		//Energy the party regains each turn, before per-character and relic modifiers.
		energyPerTurn: 3,
		//Whether unspent energy carries into the next turn.
		energyCarriesOver: false,
		//Whether cards left in hand at end of turn are discarded.
		discardHandOnTurnEnd: true,
		//TEMPORARY HP DOES NOT VANISH, IT HALVES. Shields wearing off entirely at the start of the
		//owner's turn is the genre default and is exactly what this game is stepping away from: tHP is
		//extra health that erodes, so a big grant is still worth something two turns later.
		//Set the fraction to 1 to reproduce the old wear-off-completely behaviour, or to 0 to make tHP
		//permanent until it is spent.
		temporaryHealthDecays: true,
		temporaryHealthDecayFraction: 0.5,
		//How the halved amount is rounded. "down" lets the last point actually go; "up" leaves 1 tHP
		//standing forever, which reads as a bug on the bar.
		temporaryHealthDecayRounding: "down",
		//A ceiling on tHP, as a multiple of the holder's maximum health. The bar shatters past 100% of
		//maximum health (see tuning.art.temporaryHealthBar) but the number is allowed to keep climbing,
		//so this only exists to stop a runaway loop; null removes the ceiling entirely.
		temporaryHealthMaximumFraction: 3,
		//Turn cap before a combat is declared a loss, guarding against unwinnable stalls.
		turnLimit: 60,
		//What wins and loses a fight that names nothing of its own. Each is a list of
		//honeycomb.fightEndConditionArray entries, and ANY one met decides the fight. Victory conditions
		//judge the enemy team, defeat conditions the party. An encounter's `victoryConditionArray` /
		//`defeatConditionArray` replaces these, and a fight started with its own replaces both.
		defaultVictoryConditionArray: [{ index: "allBeaten" }],
		defaultDefeatConditionArray: [{ index: "allBeaten" }],
		//How far a card must be dragged from its hand slot before the drag counts as an intent to
		//play rather than a mis-click, as a percentage of card height.
		dragPlayThresholdPercent: 45,
		//An aim's drag threshold: a card's is a share of the CARD's height, but the controls an aim is
		//dragged from are small buttons on a nameplate, so a share of those would be a few pixels and
		//every press would become a drag. Honeycomb pixels, converted with honeycomb.pixels().
		aimDragThresholdPixels: 26,
		//A held card stays put, enlarged, above the hand, and the pointer drags a targeting reticle
		//instead. The card is there to be READ while it is aimed; chasing the pointer it could not be.
		//Lift is a percentage of the card's height. It grows to the LARGE card size, derived like the
		//hover.
		heldCardLiftPercent: 34,
		//Releasing a held card back over the hand puts it back. Without this, a card needing no target
		//would play wherever it was let go, so the only way to change one's mind would be to play the
		//card.
		//The zone is the hand bar itself, grown upward by this fraction of a card's height so the
		//retreat does not need pixel precision.
		cancelZoneExtraPercent: 20,
		//Damage floor. Negative damage never heals a target by accident.
		damageMinimum: 0,
		//Order in which a downed ally is checked; "endOfAction" resolves deaths after a whole card
		//finishes, so a card that kills and then heals still resolves both halves.
		deathCheckTiming: "endOfAction",
		//Whether a downed ally's cards stay in the deck. Off means losing a character thins the deck
		//mid-combat, which is a much sharper failure state.
		downedAllyCardsRemain: true,
		//What a card does when the character who contributed it is out of the fight, for cards and
		//characters that do not name a policy of their own. Values are honeycomb.ownerDownPolicyArray
		//entries: "unplayable", "playable", "cycle", "haunt".
		defaultOwnerDownPolicy: "unplayable",
		//Cards drawn by the "cycle" policy when a dead character's card replaces itself.
		ownerDownCycleDraw: 1,
		//Whether playing a card moves its owner through the party order. WHERE they move is content --
		//the card, the loadout, the character, then the card type's default; Offense steps up to the
		//front. See honeycomb.cardPartyShift. Off freezes the order without touching any of that.
		partyShiftEnabled: true,
		//A member downed in one fight returns for the next at this fraction of maximum health, so a
		//loss is a setback rather than a permanent removal. Set to 0 for a harsher run.
		reviveHealthFraction: 0.35,

		//Phases a combat may legally be SAVED in. Each accepts player input or is an ending, so a
		//reload always lands somewhere the player can act.
		//
		//The transitional phases -- "starting", "endingPlayerTurn", "enemyTurn" -- exist only for the
		//duration of a synchronous engine call and must never reach a save file. A save taken in one
		//of them reloads into a board that refuses every action and has an empty hand, which bricks
		//the run. honeycomb.combat.repair() rescues any that slip through anyway.
		stablePhaseArray: ["playerTurn", "victory", "defeat"],
	},

	//-------------------------------------------------------------------------------------------
	//Lust and the Broken state
	//-------------------------------------------------------------------------------------------
	//Lust is the second way a fight is lost. It builds on the health bar rather than beside it, and a
	//character whose lust catches their health is BROKEN: still on the field, still holding cards, but
	//every one of those cards is replaced by their single broken card until they recover.
	//
	//Enemies take lust too, but break differently -- see honeycomb.entityUsesLust and
	//honeycomb.entityBreakBehavior.
	lust: {
		//WHAT BREAKING DOES, by what a combatant IS, for definitions that name no `brokenBehavior`:
		//  "state"     the full Broken state: stays on the field, holds only the broken card, spirals,
		//              recovers at a turn start. Player characters, on either team.
		//  "defeated"  out of the fight on the spot, health set to zero, exactly as if killed.
		brokenBehaviorByKind: { character: "state", enemy: "defeated" },
		//Whether a combatant that names no `brokenCutIn` plays the !!BROKEN!! cut-in, by kind. Off for
		//both: the cut-in is for the special few who set `brokenCutIn: true` (Severine, Nettle, Brienne, the
		//Matriarch), since it needs art drawn for them.
		brokenCutInByKind: { character: false, enemy: false },
		//The break test: lust reaching OR passing health breaks the holder.
		//Counting tHP is what makes tHP a lust defence as well as a damage one: it is why a Brienne who
		//braces is harder to break.
		breakIncludesTemporaryHealth: true,
		//A broken character cannot be broken further, and a recovered one cannot re-break until their
		//next turn: without this, a break and a recovery could alternate inside one action's resolution
		//and the screen would play a stack of cut-ins for a single card.
		breakOncePerTurn: true,
		//Statuses a fighter loses the moment they Break. Taunt, because a wall who has just Broken
		//should stop pulling the whole fight onto themselves.
		statusesLostOnBreakArray: ["taunt"],

		//RECOVERY is checked at the start of the party's turn, strictly health ABOVE lust.
		recoveryNeedsStrictlyAbove: true,
		//And ONLY at a turn start, inside a fight. A mid-turn heal therefore buys the recovery rather than
		//being it, and the plate says so. Consulted only when a combat exists: there are no turns on the
		//map, where the per-move lust bleed is deliberately allowed to un-break somebody (BROKEN-01 §4).
		recoveryOnlyAtTurnStart: true,

		//THE BROKEN SPIRAL. At the END of each turn a character spends broken they gain lust and lose
		//health, both by base + step * (turns already spent broken), capped. Left alone a broken
		//character gets steadily worse, so the party has to spend something on them.
		brokenEscalationBase: 1,
		brokenEscalationStep: 1,
		brokenEscalationMaximum: 8,
		//Whether the escalation's health loss can be soaked by tHP. Off, so tHP cannot be used to sit
		//in the broken state indefinitely.
		brokenEscalationIgnoresTemporary: true,
		//The spiral lands the moment End Turn is pressed rather than ticking like poison: its health
		//loss, lust gain and the beat that frames them cost no wait, so a broken party does not stall
		//the turn.
		brokenEscalationInstant: true,

		//THE MAP LAYER. Lust and Broken persist between fights the way health does, so walking around
		//with a broken member is possible -- and every step off a node bleeds a little lust back, which
		//is what keeps a party far from a rest site from being stuck.
		decayPerMapMove: 2,
		//Whether lust survives to the next run. It does not: a run is the unit it belongs to.
		clearsOnRunStart: true,

		//-----------------------------------------------------------------------------------------
		//Between-run weakness: what tags have been hitting a character with lust is remembered on the
		//PROFILE, and the character grows more vulnerable to those tags in later runs. The exposure count
		//itself does nothing: all of the extra weakness is tied to the RANK, so a character sits perfectly
		//still until they step up one, which is legible in a way a continuously creeping multiplier is not.
		//-----------------------------------------------------------------------------------------
		//Each rank carries a title and a description. The descriptions below are placeholders, flagged as
		//such -- they are written to be replaced by a writing pass, not to survive one.
		//The thresholds sit at thirds of the rail: the rail's ceiling is the last rank's threshold, so
		//13 / 27 / 40 land the notches at 32.5% / 67.5% / 100%.
		exposureRankArray: [
			{
				rank: 1, atOrAbove: 13, lustMultiplier: 1.25, name: "Sensitised",
				//A rank description says what the rank DOES, in plain words. The player is reading it to
				//find out how much worse a fight is about to be, not for a mood piece.
				description: "Lust does a quarter more to them than it used to. They have noticed, and " +
					"they are not taking it seriously.",
			},
			{
				rank: 2, atOrAbove: 27, lustMultiplier: 1.6, name: "Susceptible",
				description: "Lust does half again as much. They know exactly what sets them off now, and " +
					"knowing has not helped.",
			},
			{
				rank: 3, atOrAbove: 40, lustMultiplier: 2, name: "Undone",
				description: "Lust does double. Everyone who fights them has worked out what to aim at.",
			},
		],
		//How many ranks one run may add: the most a weakness may rise in one run is this many. Exposure
		//past the ceiling is still RECORDED -- it simply cannot push the count over the next threshold
		//until the run ends, so nothing is lost and nothing is uncapped. A number rather than a flag, so a
		//challenge run or a difficulty mode can lift it.
		maximumRankGainPerRun: 1,
		//How far below the next threshold a capped tag is held. Small, so the bar reads as "right on
		//the edge" -- which it is.
		rankCeilingMargin: 0.01,
		//What one point of lust taken from a tagged attack adds to that tag's exposure. Lust taken from
		//an untagged source records nothing -- there is no weakness to develop toward "nothing".
		//Cut from 1 to reduce the speed lust builds at: playtesters were hitting max way too quickly.
		exposurePerLustPoint: 0.4,
		//And what growing one tag takes off every OTHER tag. Floored at the threshold of that tag's
		//CURRENT rank, so this can never demote anybody.
		exposureDecayPerGrowth: 0.5,
		//Blanket multipliers over both, so a consumable, a rare card, a cheat code or a difficulty mode
		//has one number to move rather than a scattering. profile.lustExposureRate overrides these.
		exposureRateDefault: 1,
		exposureDecayRateDefault: 1,
		//Bench decay: reduces slowly to the rank floor when not in party. Measured in the run's DAYS
		//(tuning.run.daysPerNode per node entered), which discourages abandoning a run after just one node.
		//Every day a run spends without a character takes this much exposure off each of their tags,
		//floored at the threshold of the rank the tag is in, so sitting out softens a weakness but never
		//demotes it. Scaled by the decay rate above. Linear rather than a share of what is left, so the
		//sheet's count of days to the floor is a promise and not an estimate. At 0.5 the widest stretch
		//(Susceptible to Undone, 14) takes 28 days, about a run and a half.
		benchDecayPerDay: 0.5,
		//Paying the weakness down: players may spend personal EXP to reduce it back to the rank floor. The
		//price is this much of the character's PERSONAL experience per point of exposure standing above
		//the floors, rounded up. A whole Susceptible stretch costs 60, a little over one tree node.
		floorResetExperiencePerExposure: 3,
		//The glow of a weakness near its next rank matches its closeness: how far a tag has come through
		//its current rank's stretch of the rail (0 at the floor, 1 at the next notch). Nothing glows below
		//the start share; from there the glow grows in a straight line to the maximum opacity at the notch.
		nearRankGlowStartShare: 0.5,
		nearRankGlowMaximum: 0.6,
	},

	//-------------------------------------------------------------------------------------------
	//Lust Events (the QUEUE)
	//-------------------------------------------------------------------------------------------
	//The list is honeycomb.lustEventQueueArray; the engine is honeycomb-lust-events.js. There are no odds
	//here any more and no backfill: a row is owed or it is not, and the answer is worked out fresh every
	//time it is asked, so a scene written today reaches a profile that passed its requirement long ago.
	lustEvents: {
		//Off: weaknesses still rank up and still leave their notifications, but no queue row is ever ready
		//and nobody is ever locked.
		enabled: true,
		//The event a Lust Battle comes back to when the event names no page for that outcome: an event
		//just saying "Lust Event Cleared!"
		defaultVictoryEvent: "lustEventCleared",
		defaultDefeatEvent: "lustEventCleared",
		//What a Lust Battle pays: the run it is fought in is thrown away afterwards, so gold, a card
		//choice and a relic would be taken from the player the moment they were given. Experience is
		//still earned.
		battleRewardArray: { goldMultiplier: 0, cardChoices: false, relics: false },
		//The party a Lust Battle fields when its fight names none. "subject" is the event's character.
		defaultBattlePartyArray: ["subject"],
	},

	//-------------------------------------------------------------------------------------------
	//Rewards
	//-------------------------------------------------------------------------------------------
	reward: {
		//The card a pool offers when every legal card has been banished, or when a named card is
		//banished. It is a `fallback` card: adding it removes it again, so the deck size never changes.
		fallbackCardIndex: "fallbackCard",
		//How many cards a victory offers to choose between.
		choiceCount: 3,
		bossChoiceCount: 4,
		//THE SPREAD. Slots are dealt to characters rather than drawn from one pool, so a party of three
		//is offered one card each instead of three cards for whoever has the biggest pool. Every
		//character who can still gain cards gets a slot while slots last; any left over go to one of
		//them at random. See honeycomb.combat.rollCardReward.
		spreadAcrossParty: true,
		//Chance that a slot goes to a neutral card instead of a character, rolled per unforced slot.
		//Zero by default: neutral cards arrive through shops, events and a fight's own bonus slots.
		neutralSlotChance: 0,
		//Rarities that may appear as a reward. Starters and specials are deliberately excluded, so
		//a reward screen never offers a card the player already has ten of.
		//At least one unique broken card form exists for each of the three ranks, and Common absorbs what
		//used to be Uncommon. See MECHANICS-02.md.
		offerableRarityArray: ["common", "rare"],
		//Relative frequency of each rarity in a reward roll.
		rarityWeightArray: {
			common: 75,
			rare: 25,
		},
		//An elite leans the spread toward rarer cards. Same shape as rarityWeightArray; picked by
		//honeycomb.combat.rollCardReward.
		eliteRarityWeightArray: {
			common: 45,
			rare: 55,
		},
		//Chance a fight also offers a relic, rolled per victory. An elite ALWAYS pays one, which is its
		//reward for the harder fight; a boss always does too.
		//An ordinary win pays no relic: relics come from shops, bosses, elites and events that name one.
		//The chest keeps its own chance (honeycomb.treasureTuning `relicChance`).
		relicChance: 0,
		eliteRelicChance: 1,
		bossRelicChance: 1,
	},

	//-------------------------------------------------------------------------------------------
	//Rest sites
	//-------------------------------------------------------------------------------------------
	//The campfire spends ACTIONS: one by default, more from the Rest-A node. Every number an option
	//uses lives here rather than in the option's effect list, so a rest option is a table row with no
	//magic numbers. See honeycomb.restOptionArray in honeycomb-content-map.js.
	rest: {
		//Actions a rest site grants. Rest-A adds actionsBonus; the debug tool overrides both.
		actionsBase: 1,
		actionsBonus: 1,
		//Sleep heals this share of each member's maximum health; Rest-B raises it.
		healFraction: 0.3,
		healBonusFraction: 0.15,
		//The campfire lowers lust too: Sleep and Treatment remove this much Lust per point of health their
		//share works out to, so 1 is equal amounts and 0 turns it off.
		lustPerHealth: 1,
		//Exercise: personal experience paid to the party, split as evenly as whole numbers allow.
		exerciseExperience: 60,
		//Scavenge: gold found around the fire.
		scavengeGold: 25,
		//Treatment heals a chosen ally by this share of their maximum health (double the base rate).
		treatmentFraction: 0.6,
		//Preptime: members begin the next fight with this share of their maximum health as Temporary HP.
		preptimeFraction: 0.15,
		//Journal: how many unknown cards are offered, and the reward weight a picked one gains.
		journalOfferCount: 3,
		journalWeightMultiplier: 1.5,
		//Mail order: the shop's prices are multiplied by this when a rest opens it.
		mailOrderPriceMultiplier: 2,
	},

	//-------------------------------------------------------------------------------------------
	//Global progression
	//-------------------------------------------------------------------------------------------
	//Experience is one pool shared by the whole cast, and it survives runs. What each discovery is
	//worth lives on the discovery kind itself, beside the thing it describes; these are the switches
	//that govern the system as a whole.
	progression: {
		//Off turns the whole system into a no-op without deleting it, for a build that does not want
		//meta-progression.
		experienceEnabled: true,
		//The resource experience is paid into. Named here so a check that must leave it alone (an event
		//preview's straggler test: discoveries pay it as a side effect) can say which one.
		experienceResource: "experience",
		//Global multiplier on every award, for tuning the curve in one place.
		experienceMultiplier: 1,
		//A second multiplier, on personal experience only. Applied inside honeycomb.progression.payPersonal,
		//so every source of personal experience moves with it: discoveries, the run-victory payout and the
		//`gainExperience` effect. The GLOBAL pool is untouched -- that is what `experienceMultiplier` above
		//is for.
		personalExperienceMultiplier: 3,

		//--- Personal and global experience ---
		//A discovery kind's firstExperience goes to the GLOBAL pool (finding things: the game's
		//completion); its baseExperience goes to PERSONAL experience, split among the party (doing
		//things: fighting and winning). See honeycomb.progression.payPersonal.
		//Paid as personal experience for winning a run, split among the party like any other.
		runVictoryExperience: 100,
		//An event (or any effect) giving a relic the party ALREADY carries pays this much GLOBAL
		//experience instead, rather than nothing. A relic's own `duplicateExperience` overrides it.
		duplicateRelicExperience: 40,
		//Which pool a tree node draws on first. The character's own experience is spent before the
		//global pool is touched, since it cannot be spent on anybody else.
		spendOrder: ["personal", "global"],

		//--- Progression trees ---
		//What a tree node costs when it does not name a price of its own.
		defaultNodeCost: 40,
		//How many times a node may be bought when it does not say.
		defaultRankMaximum: 1,
		//How long a press on a tree node must be held to give a rank back, on a screen with no right
		//mouse button.
		longPressMs: 450,
		//The tree as drawn DOWN the Progression tab. Units are the SVG's own; the column scales them.
		//A node's `x` (how far along) becomes its height and its `y` (how far across) its position
		//between the side margins.
		//
		//The VERTICAL step is fixed: two nodes `depthStep` apart in `x` are always `depthStep` pixels
		//apart on screen, and the drawn tree grows taller as it gains `x`, so there is always room to
		//scroll down and place more. A tree's `x` values decide an absolute position; they are NOT
		//rescaled to fill a fixed height. `y` is still spread across the column width.
		treeView: {
			width: 320,
			//Pixels of vertical travel per one unit of `x`. The trees step `x` in 5-10 unit increments,
			//so 18 puts a 10-unit branch step at ~180px -- the distance the old trees used.
			depthStep: 18,
			//Floor on the drawn height, so a short tree keeps a workable canvas.
			minimumHeight: 640,
			sideMargin: 42,
			topMargin: 34,
			//Room for the deepest label below the last row: a label runs nodeRadius + labelOffset below the
			//node's centre, then one line per name line, then the cost line: 20 + 14 + 3 x 13 = 73, plus
			//room for the descenders. `labelLineArray` wraps a name to at most two lines, which is where
			//the 3 comes from.
			bottomMargin: 78,
			nodeRadius: 20,
			labelOffset: 14,
			labelLineHeight: 13,
			rankPipRadius: 3,
			rankPipGap: 8,
			//Rules the offline auditor (`!designDocs/honeycomb/tools/audit-trees.js`) enforces on the authored
			//grid. `maximumRowNodes` caps a row's width; `minimumLaneGap` is the closest two same-row
			//nodes may sit in `y`. See TREE-DESIGN.md hard rules H5 and H11.
			maximumRowNodes: 4,
			minimumLaneGap: 12,
		},
		//Shape of a progression tree's stage, width divided by height, used when a tree does not
		//declare its own. Matches the map's default so the two screens read as the same kind of thing.
		treeAspect: 1000 / 420,
		//Safety stop on the refund cascade. A pass that removes nothing ends it; this only matters if
		//a tree is ever authored with a dependency cycle.
		pruneIterationLimit: 32,
	},

	//-------------------------------------------------------------------------------------------
	//Party-size scaling
	//-------------------------------------------------------------------------------------------
	//No count scaling: a fight is the fight the encounter names, at any party size. The stat rates stay
	//as a zero-rate seam for a real difficulty curve later; every consumer already asks honeycomb.scaling
	//rather than a raw number.
	scaling: {
		//The party size the content is balanced around.
		baselinePartySize: 3,
		//Stat rates stay available and at zero, so a sponge enemy is a tuning decision rather than a
		//default. Gold alone still bends with party size, or a large party starves.
		enemyHealthPerExtraMember: 0,
		enemyDamagePerExtraMember: 0,
		//A bigger fight pays better, or a large party starves.
		goldPerExtraMember: 0.10,
		//Floor on every multiplier, so a small party can never reduce a value to nothing.
		minimumMultiplier: 0.5,
		//How many enemies may stand in a fight at once, summons included. A cap rather than a
		//balance number: a summoner with no ceiling can fill the screen and stall a run.
		enemyLimit: 6,
	},

	//-------------------------------------------------------------------------------------------
	//Interface behaviour
	//-------------------------------------------------------------------------------------------
	ui: {
		//Hover tooltips: a zoomed card, a status description, an enemy's plan in words. Switchable
		//rather than deletable so a build that wants a bare screen can have one.
		tooltipsEnabled: true,
		//Distance a tooltip keeps from its anchor and from the edge of the screen.
		tooltipGapPixels: 10,
		//How far a pointer-following panel sits from the pointer, so it never covers the spot being read.
		tooltipFollowOffsetPixels: 22,
		//A panel that stands beside a card which is still growing (the hovered hand card) is placed again
		//after this long, once the card has reached its large size. Matches the hand card's transition.
		tooltipAnchorSettleMs: 200,
		//A tooltip taller than the screen shrinks toward this floor so every line stays visible and
		//placeable, rather than a panel that cannot fit and reads as not showing (the tree's Set Stance).
		tooltipMinimumScale: 0.7,
		//A panel with buttons in it waits this long after the pointer leaves its anchor before it closes,
		//so the pointer can cross the gap onto the panel. Not a play-speed duration: it is how long a hand
		//takes to move, not how long the game takes to animate.
		interactiveTooltipGraceMs: 300,
		//How many relic icons the top bar shows before collapsing the rest into "…".
		topBarRelicsShown: 6,
		//Teambuilding drags. How far a press must travel to count as a drag rather than a click, and how
		//far outside the party strip a drop still lands on it.
		teamDragThresholdPixels: 8,
		teamDropMarginPixels: 24,
		//How an event is drawn when it does not name a mode. "scene" is full-screen with a speaker;
		//"panel" is the small centred box. Full-screen is the default because an event is a place the
		//player has walked into, and a box used a fraction of the screen for it.
		defaultEventPresentation: "scene",
		//An event art path may carry these tokens, one per party place, front first. Each is replaced by
		//the art folder of whoever stands in that place -- the campfire shows the party leader sitting at
		//the fire, one picture per character. An empty place reads as the leader; with no run in progress
		//at all, the fallback character's folder is used.
		eventPartyTokenArray: ["{leader}", "{second}", "{third}", "{fourth}", "{fifth}"],
		eventLeaderFallbackCharacter: "brienne",
		//How much of the screen the event panel takes in scene mode, as a percentage. The rest is the
		//backdrop and whoever is standing in it. Matches the shop mockup.
		eventPanelWidthPercent: 46,
	},

	//-------------------------------------------------------------------------------------------
	//Tags
	//-------------------------------------------------------------------------------------------
	//Tags are free-form strings; honeycomb.tagArray only decorates the ones that want decorating.
	//These are the answers used for a tag nobody registered.
	tags: {
		defaultColor: "#c9b6dd",
		defaultCategory: "trait",
		//How many chips a tag row prints before collapsing the rest into a "+n".
		chipsShownMaximum: 5,
	},

	//-------------------------------------------------------------------------------------------
	//Deck assembly and presentation
	//-------------------------------------------------------------------------------------------
	deck: {
		//Ordering a card list uses when no caller names one. Values are honeycomb.cardEntrySortArray
		//entries.
		defaultSort: "poolOrder",
		//Type order for the "By type" sort. Anything not listed sorts after everything listed.
		typeSortArray: ["damage", "negative", "lewd", "support", "passive", "curse"],
		//Which cost the "By cost" sort reads. A future game charging something other than energy for
		//most cards changes this rather than the sort.
		sortByResource: "energy",
		//Sort position given to a card with no cost at all -- an unplayable curse. High rather than
		//zero, so curses do not sit at the top of a cost-ordered list pretending to be free.
		unplayableSortCost: 99,

		//Who owns a card the player gains that was not contributed by a party member. A card whose
		//definition names a character is handed to that member if they are present, which is what
		//makes a Blood Pact taken as a reward still cost Severine health rather than nobody's.
		assignOwnerFromCharacter: true,
		//What "the card's owner" resolves to when a card genuinely has no owner -- a neutral card,
		//or one whose character is not in the party. "none" makes owner-targeted effects do nothing;
		//"randomAlly" and "frontAlly" hand it to somebody instead.
		ownerlessFallback: "frontAlly",
	},

	//-------------------------------------------------------------------------------------------
	//Run structure
	//-------------------------------------------------------------------------------------------
	run: {
		//Party size the teambuilding screen allows. The engine imposes no ceiling of its own; this
		//is the number the UI offers, and it is raised as characters unlock.
		//(Equipment capacity grows as the party shrinks below three: see tuning.equipment.)
		partySizeMinimum: 1,
		//What the roster editor allows, as opposed to what a run needs: keeping these as one number would
		//refuse to take the last member off the board, making a SOLO party awkward to build -- adding the
		//character wanted before dropping the one not wanted. Starting a run still demands
		//partySizeMinimum; this only governs the editor.
		rosterSizeMinimum: 0,
		partySizeStarting: 3,
		//Three is the intended party: testers who brought six had a worse time, so the shipped ceiling is
		//three. Six stays reachable through the debug panel's `allowLargeParty` toggle, which is what
		//partySizeMaximumDebug is for.
		partySizeMaximum: 3,
		partySizeMaximumDebug: 6,
		//Every character starts at the same health. Tankiness is bought, not innate: the Vigour node's
		//rank ceiling is what separates Brienne from Nettle. A character may still name its own
		//`baseHealth` to override this, and none currently does.
		characterBaseHealth: 58,
		//Starting resources. Keys match honeycomb.resourceArray entries.
		//The progression nodes are the money sink, so a run does not open able to buy its way through the
		//first shop.
		startingResourceArray: {
			gold: 30,
			keys: 0,
		},
		//Day counter shown in the top bar; advances per map node resolved.
		startingDay: 1,
		daysPerNode: 1,
	},

	//-------------------------------------------------------------------------------------------
	//Changing intents (Cassadora)
	//-------------------------------------------------------------------------------------------
	//The card a cancelled intent telegraphs instead: a real card that does nothing, so the board shows a
	//face rather than an empty slot. See the cancelIntent and stealIntent effects.
	intent: {
		cancelledCard: "hexBefuddled",
	},

	//-------------------------------------------------------------------------------------------
	//AI combatants
	//-------------------------------------------------------------------------------------------
	//A character the AI plays -- Severine fighting for the other team -- picks from her own card pool, each
	//card weighted by how many copies of it she holds times this. See honeycomb.aiMoveArray.
	ai: {
		weightPerCardCopy: 10,

		//The charging bar: every AI combatant gains this much charge at the start of each of its turns, up
		//to the ceiling, and a move naming a `chargeCost` cannot be chosen until the charge is there --
		//which is what keeps a boss's big card out of the opening turns and stops it repeating without a
		//wait. Nothing draws the bar; the tell is the telegraph.
		chargePerTurn: 1,
		chargeMaximum: 6,
		//A move costing at least this much is one of the BIG ones: it wears the rarer vertical frame and
		//its telegraph stands larger. See honeycomb.moveIsRare.
		rareChargeCost: 3,
		//How much larger that telegraph stands, as a multiple of the layout's intent card width.
		rareIntentScale: 1.3,
		//Enemies avoid broken targets where possible. A preference, not a ban: an enemy whose only legal
		//targets are broken still swings, because a party that could park a broken member in front
		//forever would be exploiting the mercy. Covers picked targets (honeycomb.aiOrderedCandidateArray)
		//and the front / back / random modes that pass over the broken (honeycomb.passOverBrokenArray). 0
		//or below turns both off.
		brokenTargetPenalty: 1000,
	},

	//-------------------------------------------------------------------------------------------
	//Equipment
	//-------------------------------------------------------------------------------------------
	//How many pieces each character may use: baseCapacity in a party of capacityPartySize or more, plus
	//capacityPerMissingMember for every member the party is short of it -- so a smaller party carries more
	//each. With the numbers below: three or more get 1 each, two get 2, one alone gets 3.
	//Pieces past the limit may still be worn but are inactive. See honeycomb.equipment.capacity.
	equipment: {
		baseCapacity: 1,
		capacityPartySize: 3,
		capacityPerMissingMember: 1,
		//The equipment tab's order when first opened: "recent" (what this character last took into a
		//run first), "rarity", "name" or "kind" (heirlooms first).
		defaultSort: "recent",
	},

	//-------------------------------------------------------------------------------------------
	//Battle log
	//-------------------------------------------------------------------------------------------
	//The fight's history (honeycomb.battleLog). It saves with the fight, so it is capped: the oldest
	//lines go first once a very long fight passes this many.
	battleLog: {
		maximumEntries: 1500,
		//Consecutive draws are folded into one line naming the cards, up to this many names.
		drawNamesShown: 6,
	},

	//--------------------------------------------------------------------------------------
	//The foundational numbers (rework/cards/BALANCE-01.md)
	//--------------------------------------------------------------------------------------
	//A fight has a target length and a target cost; enemy health and damage are derived from these,
	//never the other way round. `!designDocs/honeycomb/tools/budget-audit.js` measures every encounter against
	//them. Fractions are of TOTAL party health so the targets survive an HP retune.
	balance: {
		//Target turns per fight, by act (index 0 = first region) and fight kind.
		//`opening` is the first few rows of a map: without it, every region-1 fight at the `early` tier was
		//three enemies at one budget, so the first fight of a run was the same size as the seventh. An
		//opening fight lasts about as long as a normal one and costs less, because the party fighting it
		//has drafted nothing yet.
		//Act 1 fights are still 3 to 4 turns, which is only half the fix regular battles need: passives
		//and poison suck when a fight is this fast, and lengthening it properly means raising R1 health
		//and cutting R1 damage together -- fifteen enemies, which wants `tools/balance/all-the-crunch.js`
		//behind it rather than an overnight guess. What actually shipped instead was making act 1 gentler
		//outright (`netDamageFractionArray` below) and denser (`nodeWeightArray`). See
		//`rework/enemies/FEEDBACK.md` P14.
		turnTargetArray: [
			{ opening: { minimum: 3, maximum: 4 }, normal: { minimum: 3, maximum: 4 }, elite: { minimum: 6, maximum: 7 }, boss: { minimum: 9, maximum: 10 } },
			{ opening: { minimum: 4, maximum: 5 }, normal: { minimum: 4, maximum: 5 }, elite: { minimum: 6, maximum: 7 }, boss: { minimum: 9, maximum: 10 } },
		],
		//Net health the party is expected to LOSE in one fight (after Temporary HP and healing), as a
		//fraction of total party health, by act and fight kind. The direction is to overshoot rather than
		//undershoot: a run is meant to be lost more often than won at first.
		//`opening` is the number that actually makes the first fights gentler: the health lost is what the
		//fight COSTS, and 0.10 was being charged from row zero. An opening fight costs about six per cent
		//instead of ten, so three of them cost less than two ordinary ones.
		//Act 1's ordinary fight costs 8%, not 10%: a player hard stuck at the start due to a low skill
		//level cannot get EXP for the progression nodes or unlock commons, and their lust weaknesses build,
		//so both self-balancing tools fail catastrophically. A cheaper act-1 fight is the one number that
		//moves every ordinary encounter in the act at once. Act 2 is untouched.
		netDamageFractionArray: [
			{ opening: 0.06, normal: 0.08, elite: 0.22, boss: 0.38 },
			{ opening: 0.10, normal: 0.15, elite: 0.30, boss: 0.45 },
		],
		//Party damage output per turn the enemy numbers assume at each map-depth stage. A fresh-save
		//starter deck spends all three energy at 6 per energy, so it starts at 18; drafted commons at
		//9-12 per energy lift it from there. Encounter health is output × target turns, Temporary HP the
		//enemies raise included.
		//`opening` sits below `early` because the deck fighting an opening row has drafted nothing at all.
		//14 is a starter deck that cannot spend every energy well.
		partyOutputPerTurnArray: [
			{ opening: 14, early: 18, middle: 21, late: 24 },
			{ opening: 22, early: 27, middle: 30, late: 30 },
		],
		//The share of that output the party is assumed to spend on Temporary HP instead of damage, which
		//enemy damage has to get through before it costs health. Gross enemy damage per turn =
		//net ÷ turns + output × this.
		mitigationShareOfOutput: 1 / 3,
		//A line-up's damage falls as its members die, so the damage it deals at FULL STRENGTH is
		//written this much above the fight-average gross target. Measured by the audit, not assumed:
		//fight-average gross measures at ~0.55 of full strength.
		fullStrengthDamageFactor: 1.8,
		//THE ENEMY TEMPLATE (rework/enemies/ENEMIES-01.md §2). An ordinary enemy names a `role`; its health and
		//full-strength damage per turn are these shares of its region's EARLY normal group budget. An
		//elite or boss takes its share of its own group. An encounter sums its members and lands within
		//varianceFraction of its group. Checked by !designDocs/honeycomb/tools/enemy-template.js.
		enemyRoleArray: [
			{ index: "minion", healthShare: 0.32, damageShare: 0.30 },
			{ index: "striker", healthShare: 0.38, damageShare: 0.50 },
			{ index: "soldier", healthShare: 0.55, damageShare: 0.42 },
			{ index: "tank", healthShare: 0.70, damageShare: 0.30 },
			{ index: "support", healthShare: 0.40, damageShare: 0.22 },
			{ index: "caster", healthShare: 0.45, damageShare: 0.36 },
			{ index: "elite", healthShare: 1.0, damageShare: 1.0, group: "elite" },
			//>>> LANE E7 | flora | boss half role >>>
			//A boss that is two bodies: Act1-B's boss is the two sisters in one encounter, and the role
			//table had no way to say so -- graded as two whole bosses they each read a hundred health
			//short, and written to a whole boss each the encounter would carry twice a boss's budget.
			//This is half of one boss, so a pair of them sums to the same fight as a single one.
			//Order matters here: honeycomb.enemyDifficultyRank ranks by POSITION in this array, and the
			//bestiary reads weakest first, so half a boss sits just under a whole one.
			{ index: "bossHalf", healthShare: 0.45, damageShare: 0.5, group: "boss" },
			//<<< LANE E7 | flora | boss half role <<<
			{ index: "boss", healthShare: 0.9, damageShare: 1.0, group: "boss" },
		],
		//Full-strength damage over fight-average gross for a solo elite or boss, which cannot lose members.
		soloFullStrengthDamageFactor: 1.2,
		//Every encounter in a tier lands within this fraction of the tier's health and damage targets.
		varianceFraction: 0.25,
		//A line-up's gross Lust per turn stays at or below this share of its gross damage per turn.
		lustToDamageRatioMaximum: 0.6,
		//Which map-depth tier reads which column of partyOutputPerTurnArray.
		tierStageArray: { opening: "opening", early: "early", middle: "middle", late: "late", boss: "late" },
		//Cards a run has drafted by the time it reaches each stage, by region: roughly one per fight won
		//before it (a fight is about half the nodes after the forced first one). The budget audit fights
		//each encounter with this many reward picks added to the fresh-save deck.
		//An `opening` fight is fought on the deck the run started with and nothing else, which is the
		//whole reason the tier exists.
		draftedCardsByStageArray: [
			{ opening: 0, early: 2, middle: 5, late: 7 },
			{ opening: 8, early: 10, middle: 12, late: 13 },
		],
	},


	//-------------------------------------------------------------------------------------------
	//Map generation
	//-------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------
	//The Chessmaster
	//---------------------------------------------------------------------------------------------------
	//Anastasia's constants. The design lives in !designDocs/honeycomb/chessmaster/; this is the only
	//place its numbers exist at runtime.
	chessmaster: {
		//Promotion keeps the body's condition: a promoted piece is the same body wearing a bigger shape,
		//so it carries its health as a FRACTION rather than arriving fresh -- otherwise promotion is a
		//heal, and a heal is priced completely differently from a conversion.
		//"fraction" keeps the same share of maximum; "full" arrives at the new maximum. A promotion that
		//also patches the body up is the cheapest way to pay for the tempo the card costs, and it is what
		//makes promoting a hurt Pawn better than summoning a fresh one.
		promotionHealthMode: "full",
		//THE GOLEM CAP. Faked inside golem summoning rather than built as a reserved sixth slot: the
		//party roster, the board and enemy field counts are untouched. Living allies NOT tagged `large`
		//may reach this many before a golem summon is refused, so a party of three leaves room for two
		//golems and a solo Anastasia for four.
		regularSlotCount: 5,
		king: {
			//A King ignores the cap and arrives at the end of the party array, which IS the sixth rank
			//and therefore resolves last. That is the whole of the Background Master Slot.
			bypassesGolemLimit: true,
			averageUsesPerBoss: 1,
		},
		//Her golems telegraph and act like every other AI combatant, and her cards reorder what they are
		//about to do.
		//
		//Ceiling on turn-end resolution passes. Dynamic retargeting (honeycomb.combat.endPlayerTurn)
		//re-reads the party each step, so a piece that shifted itself forward for ever would otherwise
		//never terminate.
		turnEndResolutionGuard: 64,
		//The release switch: while false the gauntlet relic is never offered, so nothing of her unlock
		//path can be reached and she stays invisible on every profile.
		gauntlet: {
			enabled: true,
			//The relic that turns the run aside, the region it turns it into (ANA's row in
			//tuning.map.route.overrideArray names the same two), and who beating its boss unlocks.
			relicIndex: "gauntletInvitation",
			regionIndex: "gauntletGallery",
			unlockCharacter: "anastasia",
			//How many regions the run has cleared when the relic is on sale: 0 is the first region, which is
			//the only place it does anything -- it acts as the run leaves that region.
			offeredAtDepth: 0,
			//Whether the shop only stocks it for a profile that has cleared every region
			//tuning.map.route.byBossArray points to. True keeps it off a first-time player's shelf, where
			//it would both advertise her and send a new party into the hardest fights of the act.
			requiresRoutesCleared: true,

			//How hard the gauntlet hits: designed against a party dealing ~30 damage and banking ~30
			//Temporary HP a turn -- NOT against the Act1-A enemy budget, which the pieces sit under because
			//their numbers are also her own board's. These are an encounter's `enemyStartingStatusArray`
			//(honeycomb.combat.applyEncounterStatuses): on the enemy side only, on everything in the fight
			//including what she summons, and her own pieces never carry them.
			//
			//A piece alternates a blow and a quiet move, so a line-up SPIKES every other turn. Six pieces:
			//  unbuffed      blow turn ~39, quiet turn ~6   -> ~22 a turn; a 30-tHP party never bleeds
			//  +2 Strength   blow turn ~51, quiet turn ~10  -> ~30 a turn; the spike puts ~20 through
			//Plated 1 takes 1 off every hit, which against 4-5 hits a turn is a sixth of the party's damage.
			//Four bodies instead of six, so the buffs carry more of the weight: 4 enemies per battle (5 for
			//the finale), with starting strength and tHP to balance. Strength rides the status array; the
			//wall is its own field, because Temporary HP is a number on the entity rather than a status.
			//Measured with ../tools/gauntlet-sim/sim-boss.js -- see chessmaster/STATUS.md for the table.
			lineUpStatusArray: [{ status: "strength", stacks: 4 }],
			lineUpTemporaryHealth: 14,
			//The elite is one fight before the finale and fields a Queen who casts a King.
			eliteStatusArray: [{ status: "strength", stacks: 8 }],
			eliteTemporaryHealth: 34,
			//THE BOSS. Four pieces and her: unbuffed ~17 a turn, which a 30-tHP party ignores outright.
			//  +4 Strength   blow turn ~42 + her, quiet turn ~11 -> ~28 a turn on turn one, and RISING: every
			//                Study the Board is +1 on five bodies, every Develop another buffed body, every
			//                Promotion a Pawn's 5 becoming a Knight's 8. By turn six it is past 40.
			//  Plated 2      215 HP behind -2 a hit is ~10 turns of a 30-damage party aimed only at her, so the
			//                fight is a race against her board and not a formality.
			bossStatusArray: [{ status: "strength", stacks: 8 }, { status: "plated", stacks: 2 }],
			bossTemporaryHealth: 40,
		},
		//How long Anastasia holds the snap or the crouch when she plays a card or an ability. Longer than
		//tuning.animation.actionFrameHoldMs, and longer than commandLeadMs so the board changes mid-snap.
		poseHoldMs: 620,
		//Which summons refill a downed piece (honeycomb.refillablePiece): a summon carrying one of these
		//tags raises the frontmost downed golem instead of adding a body. Pawns only -- a Pawn is the body
		//the board fills up with, so it is the one that clears the field. The CORPSE does not have to share
		//the tag: any fallen piece is inventory, not only a fallen Pawn.
		refillTagArray: ["pawn"],
		//Gambit: Pawns come from cards alone -- about one a turn from a starter deck, and a body must
		//die before its place refills -- so a long fight sees three to five Pawn deaths, not eight.
		//Call the King asks for `pawnRequirement` of them; the card it shuffles in costs `baseCost`
		//less one per Gambit, so it is 2 Energy the moment it is earned and free at the ceiling.
		gambit: { maximum: 6 },
		kingInvocation: {
			pawnRequirement: 4,
			baseCost: 6,
			costReductionPerPawn: 1,
			copiesPerBattle: 1,
			//What the King gives: the Celestial King's on-play effect doubles current party tHP, with an
			//end-of-turn effect dealing damage equal to total party tHP to all enemies at once. The Infernal
			//King halves all golem HP on play and, at the end of the turn, deals damage to all enemies
			//equal to the total damage dealt this turn. The ongoing halves are the `celestialCourt` and
			//`infernalCourt` statuses, and their own numbers sit on those entries.
			celestial: {
				//How many extra copies of the wall the play grants: 1 doubles it.
				temporaryHealthCopies: 1,
			},
			infernal: {
				//Each piece loses this share of its CURRENT health. The price of the better half of the two.
				golemHealthLossDivisor: 2,
			},
		},
		metrics: {
			burstWindowTurns: 3,
			windowTurns: 5,
			deltaThreshold: 2.0,
			deltaSigmaFloor: 0.0001,
			tHPValueCoefficient: 0.5,
			scaleParityTolerance: 0.15,
			optimalVsRandomMultiplier: 3.0,
			distributionSamples: 300,
		},
		search: {
			branchBudgetMinimum: 500,
			branchBudgetMaximum: 5000,
			dedupeStates: true,
			exhaustiveActionCap: 7,
			beamWidth: 20,
		},
		encounter: { puzzleTurnMinimum: 2, puzzleTurnMaximum: 3 },
		run: { demoBattleTarget: 20, demoCardOfferTarget: 20 },
	},

	map: {
		//>>> LANE E7 | route | tuning >>>
		//WHICH SECOND REGION A RUN DESCENDS INTO. Act1-1 splits into sub-acts, and the boss the
		//run just beat is what chooses between them -- the boss node's preview is therefore the whole
		//tooltip for the choice.
		//
		//THIS TABLE IS THE RELEASE SWITCH. Pointing a byBossArray row back at "floodedVault" removes
		//that route from the game with one line and no other change; a route whose enemies are not
		//finished is left pointed there.
		route: {
			//A run is won after this many regions. Read instead of honeycomb.regionArray.length, which
			//counts routes a single run never visits.
			regionsPerRun: 2,
			//What a run descends into when nothing else resolves: an unmapped boss, or a save written
			//before the route table existed and so carrying no recorded route.
			defaultSecondRegion: "floodedVault",
			//The Act1-1 boss just beaten, and the region it leads to. Rows resolve after overrideArray.
			//One boss to one route: The Shroud is the spread grown into a body, so it opens onto the
			//frontier where the spread is thickest; the Head Gardener onto the arbor; the Matriarch onto
			//the road. The boss node's own preview is therefore the whole tooltip for the choice.
			//TO TAKE A ROUTE OUT OF THE RELEASE, point its row back at "floodedVault". One line, nothing
			//else to touch, and a run already in progress survives it.
			byBossArray: [
				{ bossEncounterIndex: "tallyLedger", regionIndex: "floodedVault" },
				{ bossEncounterIndex: "gardenerGrove", regionIndex: "flora" },
				{ bossEncounterIndex: "matriarchLair", regionIndex: "pollenRoad" },
			],
			//{ relicIndex, regionIndex } -- a relic the run holds outranks the boss entirely. A region
			//only reachable through one of these rows is SECRET: honeycomb.map.countedRegionArray
			//leaves it out, so no screen counts or names a place the player has no way of hearing about.
			overrideArray: [
				//LANE ANA's one row: the invitation leads to the gauntlet. It can only be held while
				//tuning.chessmaster.gauntlet.enabled is true -- see the `gauntletOpen` condition.
				{ relicIndex: "gauntletInvitation", regionIndex: "gauntletGallery" },
			],
		},
		//<<< LANE E7 | route | tuning <<<
		//Which layout strategy a region uses when it does not name one. Values are
		//honeycomb.mapLayoutArray entries: "rows" (procedural) or "anchored" (hand-placed over art).
		defaultLayout: "rows",
		//Where the procedural layout puts its nodes, as percentages of the stage. An anchored layout
		//ignores the margins entirely -- its positions are measured over the painting instead.
		frame: {
			//Stage shape, width divided by height, used when no backdrop declares its own. The graph
			//and the painting letterbox into the same rectangle, so this is what keeps a node on the
			//landmark it was measured against.
			stageAspect: 1000 / 420,
			marginX: 6,
			marginY: 13,
			//Maximum deterministic scatter applied to a node's grid position, so the graph does not
			//read as a spreadsheet. Separate per axis because the stage is much wider than it is tall,
			//and one figure would scatter far further sideways than up and down.
			wobbleX: 1.6,
			wobbleY: 4,
		},
		//A region is one map screen. Rows run from the entrance to the boss.
		rowCount: 9,
		//Nodes per row are rolled within this range.
		rowWidthMinimum: 2,
		rowWidthMaximum: 4,
		//Rows that are forced to a fixed content, by row offset from the start.
		//A run opens at a campfire rather than walking straight into a fight -- which is also where the
		//first card upgrade can be bought, before the deck has met anything.
		firstRowNodeType: "rest",
		//The final row is always the boss, and the row before it always a rest.
		bossRowFromEnd: 0,
		//True puts every one of the region's bosses on the final row, one node each, instead of rolling
		//one -- each leads to a different Act1-2 route, letting players choose their boss and next route.
		//A region naming a single boss still ends in a single node. False restores the roll.
		bossRowHoldsEveryBoss: true,
		restRowFromEnd: 1,
		//How many rows in before events and shops may appear.
		specialNodeEarliestRow: 1,
		//How deep into a region an ELITE node may first appear, as a fraction of the region's depth.
		//Elites are an opt-in fight, but the only elite encounter is the scavenger, so an early one would
		//be a run-ender met before the party has a deck. Gated to the middle stretch and later.
		eliteEarliestDepthFraction: 0.35,
		//Edge generation: each node connects forward to between these many nodes.
		edgeMinimum: 1,
		edgeMaximum: 2,
		//Weighted node type table for ordinary rows. Types resolve against honeycomb.nodeTypeArray.
		//Denser: the weight `combat` gains here comes off events, which were the second-heaviest weight
		//and the one a run meets most often without a fight in it.
		nodeWeightArray: [
			{ index: "combat", weight: 52 },
			{ index: "event", weight: 15 },
			{ index: "treasure", weight: 10 },
			{ index: "rest", weight: 12 },
			{ index: "shop", weight: 11 },
			{ index: "elite", weight: 10 },
		],
		//Types that may not appear twice in a row on one path.
		noRepeatTypeArray: ["shop", "rest", "elite", "treasure"],
		//The most nodes of a type one region may hold: measured over 150 generated act1-1 maps, an
		//uncapped map carried 4.3 treasure nodes on average, and 36% of maps had a path that could take
		//four or more. A cap on the REGION is what makes four impossible on any path, since a path cannot
		//hold more than the map does. A type not named here is unlimited.
		maximumPerRegionArray: [
			{ index: "treasure", maximum: 3 },
		],
	},
};

//Applied on mount: mirrors the layout block into CSS custom properties so the stylesheet reads the
//same numbers the code does, and a tuning change moves both at once.
//
//Written to the overlay host as well as the scene root. The overlay host is a SIBLING of the root,
//not a child, so a property set only on the root does not inherit into an overlay -- and the symptom
//is an element collapsing to zero size rather than an error. The stylesheet already declares the
//palette on both for the same reason.
honeycomb.applyTuningToCss = function () {
	var hostArray = [honeycomb.rootElement(), honeycomb.overlayHostElement(), document.getElementById(honeycomb.tuning.dom.rotateHintId)];
	for (var hostIndex = 0; hostIndex < hostArray.length; hostIndex++) {
		if (hostArray[hostIndex] != null) honeycomb.writeTuningProperties(hostArray[hostIndex]);
	}
	//The UI frames (tuning.art.uiFrameArray) switch themselves on once their images load.
	if (honeycomb.ui != null && honeycomb.ui.loadFrames != null) honeycomb.ui.loadFrames();
	//The reduced-effects class is re-applied on every scene build, since scene changes rewrite classes.
	honeycomb.applyReducedEffects();
	//And the Battle Lab's, for the same reason.
	if (honeycomb.lab != null && honeycomb.lab.applyMode != null) honeycomb.lab.applyMode();
};

//Whether the reduced-effects path is on. See tuning.performance.reducedEffects.
honeycomb.reducedEffects = function () {
	var setting = honeycomb.tuning.performance == null ? "auto" : honeycomb.tuning.performance.reducedEffects;
	if (setting === true) return true;
	if (setting === false) return false;
	//"auto": a coarse pointer (touch), a touch-only device, or a low-memory one.
	if (typeof window !== "undefined" && typeof window.matchMedia === "function" &&
		window.matchMedia("(pointer: coarse)").matches == true) return true;
	//A touch device with NO hover: a phone or tablet, not a touchscreen laptop (which keeps hover).
	if (typeof window !== "undefined" && typeof window.matchMedia === "function" &&
		window.matchMedia("(hover: none)").matches == true &&
		typeof navigator !== "undefined" && navigator.maxTouchPoints != null && navigator.maxTouchPoints > 0) return true;
	if (typeof navigator !== "undefined" && navigator.deviceMemory != null && navigator.deviceMemory <= 4) return true;
	return false;
};

//Puts (or removes) the reduced-effects class on the root and the overlay host, so the stylesheet can
//trade expensive paint for cheap.
honeycomb.applyReducedEffects = function () {
	var on = honeycomb.reducedEffects() == true;
	var hostArray = [honeycomb.rootElement(), honeycomb.overlayHostElement()];
	for (var hostIndex = 0; hostIndex < hostArray.length; hostIndex++) {
		if (hostArray[hostIndex] != null) hostArray[hostIndex].classList.toggle("hcReducedEffects", on);
	}
	return on;
};

//THE HONEYCOMB PIXEL from the code's side (see tuning.layout.referenceHeightPixels). A length the code
//writes into a style goes through cssPixels / cssVmin so it scales with the stylesheet; a length the
//code does ARITHMETIC with beside measured boxes (a tooltip's gap from its anchor) goes through
//pixels(), which converts it to real pixels on this screen.
honeycomb.cssPixels = function (pixels) {
	return "calc(" + pixels + " * var(--hc-px))";
};

honeycomb.cssVmin = function (vmin) {
	return "calc(" + vmin + " * var(--hc-vmin))";
};

//A tuning number with its unit, as CSS. "px" and "vmin" become honeycomb pixels; anything else
//(%, ms, unitless) is written as it is.
honeycomb.cssLength = function (value, unit) {
	if (unit == "px") return honeycomb.cssPixels(value);
	if (unit == "vmin") return honeycomb.cssVmin(value);
	return value + unit;
};

honeycomb.pixelScale = function () {
	if (typeof window == "undefined" || !(window.innerWidth > 0) || !(window.innerHeight > 0)) return 1;
	return Math.min(window.innerWidth, window.innerHeight) / honeycomb.tuning.layout.referenceHeightPixels;
};

honeycomb.pixels = function (pixels) {
	return pixels * honeycomb.pixelScale();
};

honeycomb.writeTuningProperties = function (root) {
	if (root == null) return;
	var layout = honeycomb.tuning.layout;
	root.style.setProperty("--hc-reference-height", String(layout.referenceHeightPixels));
	root.style.setProperty("--hc-card-aspect", String(honeycomb.tuning.art.cardFrame.aspect));
	//Unitless: the slot multiplies a length by it. See the margin-right rule on .hcHandSlot.
	root.style.setProperty("--hc-hand-overlap-fraction", String(layout.handOverlapPercent / 100));
	root.style.setProperty("--hc-hand-hover-lift", honeycomb.cssPixels(layout.handHoverLiftPixels));
	root.style.setProperty("--hc-hand-resting-drop", layout.handRestingDropPercent + "%");
	root.style.setProperty("--hc-hand-held-drop", layout.handHeldDropPercent + "%");
	root.style.setProperty("--hc-hand-held-opacity", String(layout.handHeldOpacity));
	//Attack VFX: the beat's length and the image's size over the fighter.
	root.style.setProperty("--hc-vfx-ms", honeycomb.tuning.vfx.durationMs + "ms");
	root.style.setProperty("--hc-vfx-size", honeycomb.tuning.vfx.sizePercent + "%");
	//Card sizes: the hovered and the held hand card both grow to the large width.
	var large = honeycomb.cardSizeDefinition("large");
	var growth = String(Number(honeycomb.handCardGrowthToLarge().toFixed(4)));
	root.style.setProperty("--hc-hand-hover-scale", growth);
	root.style.setProperty("--hc-held-scale", growth);
	root.style.setProperty("--hc-card-design-width", String(honeycomb.tuning.art.cardSize.designWidthUnits));
	root.style.setProperty("--hc-card-large-width", honeycomb.cssPixels(large.widthPixels));
	root.style.setProperty("--hc-card-large-z", String(large.zIndex));
	//The dedicated enemy scale: multiplies the layout's own enemy height.
	root.style.setProperty("--hc-enemy-scale", String(honeycomb.tuning.art.enemySpriteScale));
	root.style.setProperty("--hc-portrait-size", honeycomb.cssVmin(layout.portraitStripSizeVmin));
	root.style.setProperty("--hc-pile-deck-height", honeycomb.cssVmin(layout.pileDeckHeightVmin));
	root.style.setProperty("--hc-topbar-height", honeycomb.cssVmin(layout.topBarHeightVmin));
	root.style.setProperty("--hc-event-panel-width", honeycomb.tuning.ui.eventPanelWidthPercent + "%");
	var shelf = honeycomb.tuning.art.handShelf;
	root.style.setProperty("--hc-shelf-energy-x", shelf.energyCenterXPercent + "%");
	root.style.setProperty("--hc-shelf-energy-y", shelf.energyCenterYPercent + "%");
	root.style.setProperty("--hc-shelf-energy-width", shelf.energyWidthPercent + "%");
	root.style.setProperty("--hc-shelf-energy-height", shelf.energyHeightPercent + "%");
	root.style.setProperty("--hc-shelf-endturn-x", shelf.endTurnCenterXPercent + "%");
	root.style.setProperty("--hc-shelf-endturn-y", shelf.endTurnCenterYPercent + "%");
	root.style.setProperty("--hc-shelf-endturn-width", shelf.endTurnWidthPercent + "%");
	root.style.setProperty("--hc-shelf-endturn-height", shelf.endTurnHeightPercent + "%");
	honeycomb.writeBattleLayoutProperties(root, honeycomb.battleLayout());
	root.style.setProperty("--hc-sprite-aspect", String(honeycomb.tuning.art.characterSprite.aspect));
	//The nameplate's unit and its art. Absolute URLs: a url() inside a custom
	//property may otherwise resolve against the stylesheet's folder and quietly load nothing.
	var plate = honeycomb.tuning.art.nameplate;
	root.style.setProperty("--hc-plate-u", honeycomb.cssPixels(plate.unitPixels));
	root.style.setProperty("--hc-plate-heart-filter", plate.heartFilter);
	if (typeof document != "undefined" && document.baseURI != null && typeof URL == "function") {
		var plateUrl = function (path) { return 'url("' + new URL(honeycomb.image(path), document.baseURI).href + '")'; };
		root.style.setProperty("--hc-plate-medallion", plateUrl(plate.medallionPath));
		root.style.setProperty("--hc-plate-frame", plateUrl(plate.barFramePath));
		root.style.setProperty("--hc-plate-tab", plateUrl(plate.healthTabPath));
		root.style.setProperty("--hc-plate-status", plateUrl(plate.statusCirclePath));
	}
	root.style.setProperty("--hc-hit-flash-ms", honeycomb.tuning.animation.hitFlashMs + "ms");
	root.style.setProperty("--hc-travel-ms", honeycomb.tuning.animation.elementTravelMs + "ms");
	root.style.setProperty("--hc-status-pulse-ms", honeycomb.tuning.animation.statusPulseMs + "ms");
	root.style.setProperty("--hc-mechanic-move-ms", honeycomb.duration(honeycomb.tuning.animation.mechanicMoveMs) + "ms");
	root.style.setProperty("--hc-shake-ms", honeycomb.tuning.animation.shakeMs + "ms");
	root.style.setProperty("--hc-trail-hold-ms", honeycomb.tuning.animation.healthTrailHoldMs + "ms");
	root.style.setProperty("--hc-trail-drain-ms", honeycomb.tuning.animation.healthTrailDrainMs + "ms");
	root.style.setProperty("--hc-turn-banner-ms", honeycomb.tuning.animation.turnBannerMs + "ms");
	root.style.setProperty("--hc-card-flight-ms", honeycomb.duration(honeycomb.tuning.animation.cardFlightMs) + "ms");
	root.style.setProperty("--hc-card-flight-end-scale", String(honeycomb.tuning.animation.cardFlightEndScale));
	root.style.setProperty("--hc-hand-flow-ms", honeycomb.duration(honeycomb.tuning.animation.handFlowMs) + "ms");
	root.style.setProperty("--hc-card-deal-ms", honeycomb.duration(honeycomb.tuning.animation.cardDealMs) + "ms");
	root.style.setProperty("--hc-pile-flight-ms", honeycomb.duration(honeycomb.tuning.animation.pileFlightMs) + "ms");
	root.style.setProperty("--hc-pile-arrival-opacity", String(honeycomb.tuning.animation.pileArrivalOpacity));
	root.style.setProperty("--hc-pile-bump-ms", honeycomb.duration(honeycomb.tuning.animation.pileBumpMs) + "ms");
	root.style.setProperty("--hc-exhaust-ms", honeycomb.duration(honeycomb.tuning.animation.exhaustMs) + "ms");
	root.style.setProperty("--hc-created-card-reveal-ms", honeycomb.duration(honeycomb.tuning.animation.createdCardRevealMs) + "ms");
	root.style.setProperty("--hc-party-shift-ms", honeycomb.duration(honeycomb.tuning.animation.partyShiftMs) + "ms");
	root.style.setProperty("--hc-shift-preview-ms", honeycomb.duration(honeycomb.tuning.animation.shiftPreviewMs) + "ms");
	root.style.setProperty("--hc-depth-step-ms", honeycomb.duration(honeycomb.tuning.animation.depthStepMs) + "ms");
	root.style.setProperty("--hc-intent-rare-scale", String(honeycomb.tuning.ai.rareIntentScale));
	root.style.setProperty("--hc-enemy-card-reveal-ms", honeycomb.duration(honeycomb.tuning.animation.enemyCardRevealMs) + "ms");
	root.style.setProperty("--hc-enemy-card-leave-ms", honeycomb.duration(honeycomb.tuning.animation.enemyCardLeaveMs) + "ms");

	var focus = honeycomb.tuning.focus;
	root.style.setProperty("--hc-focus-half-brightness", String(focus.halfBrightness));
	root.style.setProperty("--hc-focus-half-saturation", String(focus.halfSaturation));
	root.style.setProperty("--hc-focus-none-brightness", String(focus.noneBrightness));
	root.style.setProperty("--hc-focus-none-saturation", String(focus.noneSaturation));
	root.style.setProperty("--hc-focus-none-drop", honeycomb.cssPixels(focus.noneDropPixels));
	root.style.setProperty("--hc-focus-none-scale", String(focus.noneScale));
	root.style.setProperty("--hc-hand-resting-brightness", String(focus.handRestingBrightness));
	root.style.setProperty("--hc-hand-resting-saturation", String(focus.handRestingSaturation));
};

//---------------------------------------------------------------------------------------------------
//Battle layouts
//---------------------------------------------------------------------------------------------------
//Which CSS variable each number of a layout feeds, and in what unit. The stylesheet reads only the
//variables, so a layout is data all the way down: a new number a layout should control is one row here
//plus the CSS that reads it; a new layout is one entry in tuning.battleLayout.layoutArray.
honeycomb.battleLayoutPropertyArray = [
	{ field: "fighterFrameAspect", variable: "--hc-frame-aspect", unit: "" },
	{ field: "fighterFrameHeightPercent", variable: "--hc-frame-height", unit: "%" },
	{ field: "allySpritePercentHeight", variable: "--hc-ally-sprite-height", unit: "%" },
	{ field: "enemySpritePercentHeight", variable: "--hc-enemy-sprite-height", unit: "%" },
	{ field: "vitalsBottomPercent", variable: "--hc-vitals-bottom", unit: "%" },
	{ field: "allyPlateStaggerPercent", variable: "--hc-ally-plate-stagger", unit: "%" },
	{ field: "enemyPlateStaggerPercent", variable: "--hc-enemy-plate-stagger", unit: "%" },
	{ field: "allyMaxWidthPercent", variable: "--hc-ally-fighter-max", unit: "%" },
	{ field: "enemyMaxWidthPercent", variable: "--hc-enemy-fighter-max", unit: "%" },
	{ field: "fighterGapVmin", variable: "--hc-fighter-gap", unit: "vmin" },
	{ field: "sideGapVmin", variable: "--hc-side-gap", unit: "vmin" },
	{ field: "sidePaddingPercent", variable: "--hc-side-padding", unit: "%" },
	{ field: "floorVmin", variable: "--hc-battlefield-floor", unit: "vmin" },
	{ field: "backdropOpacity", variable: "--hc-backdrop-opacity", unit: "" },
	{ field: "intentCardWidthPercent", variable: "--hc-intent-card-width", unit: "%" },
	//A bare number: the stylesheet turns it into a share of the fighter's WINDOW, which may be shorter
	//than the column the fighter stands in.
	{ field: "intentCardTopPercent", variable: "--hc-intent-card-top", unit: "" },
	{ field: "intentCardLeftPercent", variable: "--hc-intent-card-left", unit: "%" },
	{ field: "handCardHeightVmin", variable: "--hc-card-hand-height", unit: "vmin" },
	//The shelf's end pieces (flag handShelf): the square each is drawn in.
	{ field: "shelfEndSizeVmin", variable: "--hc-shelf-end-size", unit: "vmin" },
	//A CROWDED side: how far its fighters are pulled together, and the floor on how
	//thin any of them may get.
	{ field: "crowdedGapVmin", variable: "--hc-crowded-gap", unit: "vmin" },
	{ field: "crowdedFighterMinimumPercent", variable: "--hc-crowded-fighter-min", unit: "%" },
	//And a fighter ANCHORED behind the row (a boss): how wide their place is, and how tall they draw
	//inside it. Neither depends on how many minions are standing in front of them.
	{ field: "anchoredWidthPercent", variable: "--hc-anchored-width", unit: "%" },
	{ field: "anchoredSpriteHeightPercent", variable: "--hc-anchored-sprite-height", unit: "%" },
	//How tall the ROW draws while one of them is anchored behind it, so a boss is always the taller.
	{ field: "minionHeightPercent", variable: "--hc-minion-height", unit: "%" },
	//The depth-focus step (flag depthFocus). Percentages are of the figure's own height.
	{ field: "depthForwardScale", variable: "--hc-depth-forward-scale", unit: "" },
	{ field: "depthForwardDropPercent", variable: "--hc-depth-forward-drop", unit: "%" },
	{ field: "depthHalfScale", variable: "--hc-depth-half-scale", unit: "" },
	{ field: "depthNoneScale", variable: "--hc-depth-none-scale", unit: "" },
	{ field: "depthBackRisePercent", variable: "--hc-depth-back-rise", unit: "%" },
	//How faint a party member's nameplate is until the pointer is on their column.
	{ field: "plateRestOpacity", variable: "--hc-plate-rest-opacity", unit: "" },
];

//Yes/no fields of a layout, and the class each puts on the combat screen when it is FALSE (or true,
//per `classWhen`). The CSS is written against the class, never against a layout's name.
honeycomb.battleLayoutFlagArray = [
	{ field: "framed", classWhen: false, className: "hcUnframed" },
	{ field: "depthFocus", classWhen: true, className: "hcDepthFocus" },
	{ field: "vignette", classWhen: true, className: "hcBackdropVignette" },
	{ field: "handShelf", classWhen: true, className: "hcHandShelf" },
];

//The layout in use is always `defaultLayout`; there is no in-game way to switch it. The debug Layout
//button and the choice it remembered on the profile are gone. A profile saved while that button existed
//may still carry `settingArray.battleLayout`; nothing reads it.
honeycomb.battleLayout = function () {
	var layoutArray = honeycomb.tuning.battleLayout.layoutArray;
	return honeycomb.findDefinition(layoutArray, honeycomb.tuning.battleLayout.defaultLayout) || layoutArray[0];
};

//HOW WIDE ONE SIDE'S ROW DRAWS, as a flex-grow factor against the other side. A side holding one
//fighter or none grows at 1, so an ordinary one-on-one fight splits the battlefield exactly as it always
//did; every fighter past the first widens that side by tuning.layout.sideGrowPerExtraFighter.
//Counts only fighters standing IN the row: an anchored boss is sized off the battlefield's height and
//takes no share of the row's width, so counting one would widen a side on behalf of a figure that cannot
//use the space.
honeycomb.sideGrowFactor = function (inRowCount) {
	if (inRowCount == null || inRowCount <= 1) return 1;
	return 1 + (inRowCount - 1) * honeycomb.tuning.layout.sideGrowPerExtraFighter;
};

//WHERE A FIGHTER'S NAMEPLATE SITS, as a multiplier on tuning's vitalsBottomPercent. A fighter
//with no placement scale is 1 and does not move, so every shipped encounter is untouched; only a piece
//given its own size brings its plate down with it.
honeycomb.vitalsScaleFor = function (placementScale) {
	var scale = placementScale == null ? 1 : placementScale;
	return 1 - (1 - scale) * honeycomb.tuning.layout.vitalsFollowScale;
};

//A card size entry (tuning.art.cardSize.sizeArray) by index, or null.
honeycomb.cardSizeDefinition = function (sizeIndex) {
	return honeycomb.findDefinition(honeycomb.tuning.art.cardSize.sizeArray, sizeIndex);
};

//How much a hand card grows to become a LARGE card: the large width over the hand card's width, which
//is the battle layout's hand height (in vmin, a hundredth of the reference height) times the card's
//aspect. Both the hover and the held card use it, so neither can drift from the large size.
honeycomb.handCardGrowthToLarge = function () {
	var large = honeycomb.cardSizeDefinition("large");
	var layout = honeycomb.battleLayout();
	var handWidthPixels = layout.handCardHeightVmin * honeycomb.tuning.layout.referenceHeightPixels / 100 *
		honeycomb.tuning.art.cardFrame.aspect;
	return handWidthPixels > 0 ? large.widthPixels / handWidthPixels : 1;
};

//A number the layout leaves out is REMOVED rather than skipped, so the stylesheet's fallback applies
//and nothing lingers from the layout shown before it.
honeycomb.writeBattleLayoutProperties = function (element, layout) {
	if (element == null || layout == null) return;
	for (var scanIndex = 0; scanIndex < honeycomb.battleLayoutPropertyArray.length; scanIndex++) {
		var property = honeycomb.battleLayoutPropertyArray[scanIndex];
		if (layout[property.field] == null) { element.style.removeProperty(property.variable); continue; }
		element.style.setProperty(property.variable, honeycomb.cssLength(layout[property.field], property.unit));
	}
};

//The classes a layout's flags put on the combat screen, as one string.
honeycomb.battleLayoutClassText = function (layout) {
	var classText = "hcLayout-" + layout.index;
	for (var scanIndex = 0; scanIndex < honeycomb.battleLayoutFlagArray.length; scanIndex++) {
		var flag = honeycomb.battleLayoutFlagArray[scanIndex];
		if ((layout[flag.field] == true) === flag.classWhen) classText += " " + flag.className;
	}
	return classText;
};

//Durations pass through here so the master speed multiplier -- and the play speed the player chose --
//reach every timed thing in the game.
honeycomb.duration = function (milliseconds) {
	return milliseconds / (honeycomb.tuning.animation.speedMultiplier * honeycomb.playSpeedMultiplier());
};

//The play speed the player chose, kept on the profile so it outlives the session.
honeycomb.playSpeed = function () {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	var chosen = profile == null || profile.settingArray == null ? null : profile.settingArray.playSpeed;
	return honeycomb.findDefinition(honeycomb.tuning.animation.playSpeedArray, chosen) == null
		? honeycomb.tuning.animation.defaultPlaySpeed : chosen;
};

honeycomb.playSpeedMultiplier = function () {
	var speed = honeycomb.findDefinition(honeycomb.tuning.animation.playSpeedArray, honeycomb.playSpeed());
	return speed == null ? 1 : speed.multiplier;
};

//Where the chosen speed sits in the list. The slider is a position on this array rather than a
//multiplier of its own, so the named steps stay the only speeds there are and adding one is a table
//entry.
honeycomb.playSpeedPosition = function () {
	var speedArray = honeycomb.tuning.animation.playSpeedArray;
	for (var scanIndex = 0; scanIndex < speedArray.length; scanIndex++) {
		if (speedArray[scanIndex].index == honeycomb.playSpeed()) return scanIndex;
	}
	return 0;
};

//Sets the speed by name. Every CSS duration is rewritten, since those are read through
//honeycomb.duration too. Returns the entry chosen, or null when the name is not one.
honeycomb.setPlaySpeed = function (index) {
	var chosen = honeycomb.findDefinition(honeycomb.tuning.animation.playSpeedArray, index);
	if (chosen == null) return null;
	var profile = honeycomb.state.profile;
	if (profile.settingArray == null) profile.settingArray = {};
	profile.settingArray.playSpeed = chosen.index;
	honeycomb.applyTuningToCss();
	return chosen;
};

//The same by position, which is what the slider hands back.
honeycomb.setPlaySpeedPosition = function (position) {
	var speedArray = honeycomb.tuning.animation.playSpeedArray;
	var clamped = Math.max(0, Math.min(speedArray.length - 1, Math.round(position)));
	return honeycomb.setPlaySpeed(speedArray[clamped].index);
};

//Moves to the next speed in the list, wrapping round. Kept for anything that wants one tap to change
//speed without opening the slider.
honeycomb.cyclePlaySpeed = function () {
	var speedArray = honeycomb.tuning.animation.playSpeedArray;
	var next = speedArray[(honeycomb.playSpeedPosition() + 1) % speedArray.length];
	return honeycomb.setPlaySpeed(next.index);
};
