//===================================================================================================
//HONEYCOMB CATACOMBS -- the !!BROKEN!! and recovery cut-ins
//===================================================================================================
//Two full-screen overlays, both Persona-shaped, both driven from a log entry so they play wherever
//the moment happens -- the player's turn, the enemy's turn, or the map. See BROKEN-01.md for the
//layer-by-layer brief these were built from, and tuning.brokenOverlay / tuning.recoverOverlay for
//every number in them.
//
//THE CONTRACT WITH THE REPLAY. `play(entry)` opens the overlay and returns how long the replay should
//wait before its next beat. The combat scene's log handlers call it and pass that number back, which
//is how "pausing the flow of combat for a moment" is expressed without the turn structure knowing
//anything about it. Outside combat -- a member recovering as the party walks the map -- `play` is
//called directly and nobody is waiting.
//
//THE LAYERS OF THE BREAK, back to front, exactly as briefed:
//  1  background chains   three looping copies of brokenChainBackground, motion-blurred, flying in,
//                         stopping at the midpoint, flying out again at the end
//  2  tear background     the character's own brokenBG, invisible at the start, revealed at the
//                         midpoint through the tear
//  3  screen tear         white growing out of the brokenClawStart strokes, culled to the claw shape;
//                         at the midpoint brokenClaw's rim is laid over it and the white gives way
//  4  front chain         brokenChainFront1 sweeping across, swapped for brokenChainFront2 -- the
//                         same chain snapped -- at the midpoint
//  5  character art       the character's `broken` art, below the screen at the start, bottom-aligned
//                         by the midpoint
//  6  the text            brokenText, arriving at the midpoint in a flash of red
//  then a diagonally slanted black wipe left to right that erases everything it passes over.
//
//TWO MECHANICS WORTH KNOWING, both explained at length in BROKEN-01.md:
//  * the claw mask is used INVERTED (brokenClawMaskInner, a derived asset), because a CSS mask reads
//    alpha and the painted mask is opaque outside the tear
//  * the tear GROWS with mask-size, not with a stack of frames. Six radial gradients sit on the six
//    strokes of brokenClawStart; animating mask-size from zero opens them without scaling any content
window.honeycomb = window.honeycomb || {};

honeycomb.brokenOverlay = {};
honeycomb.recoverOverlay = {};

//---------------------------------------------------------------------------------------------------
//Shared art resolution
//---------------------------------------------------------------------------------------------------
//A character with none of the cut-in art drawn yet must still get the overlay: the effect is a
//mechanic telling the player something, not a reward for having art. Each lookup falls back down a
//chain and ends at something that always exists.
//WHOSE CUT-IN IT IS: a character's definition, or an enemy's -- enemies break on screen too. Every art
//field the cut-in reads has the same name on either.
honeycomb.brokenOverlay.characterFor = function (entry) {
	if (entry == null) return null;
	if (entry.characterIndex != null) return honeycomb.findDefinition(honeycomb.characterArray, entry.characterIndex);
	if (entry.enemyIndex != null) return honeycomb.findDefinition(honeycomb.enemyArray, entry.enemyIndex);
	var entity = honeycomb.findEntity(entry.targetId,
		honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat);
	return honeycomb.entityDefinitionOf(entity);
};

//The character's cut-in portrait. Falls back to their teambuilding portrait, which every character has.
honeycomb.brokenOverlay.artPathFor = function (character) {
	return honeycomb.brokenOverlay.cutInArtPath(character, "brokenArtPath");
};

//THE RECOVERY CUT-IN HAS ITS OWN PICTURE. It falls back to the portrait, NEVER to `broken`: showing the
//broken art here would put the character's worst moment on their recovery, so a character with no
//recover art drawn gets their own face instead.
honeycomb.recoverOverlay.artPathFor = function (character) {
	return honeycomb.brokenOverlay.cutInArtPath(character, "recoverArtPath");
};

//The shared resolution both of the above use: the named field, then the character's portrait, which
//every character has.
honeycomb.brokenOverlay.cutInArtPath = function (character, field) {
	if (character == null) return null;
	if (character[field] != null) return character[field];
	//The portrait is the last resort, and every character has one -- honeycomb.art.portraitChain's
	//first entry is that character's own, whatever they are wearing.
	if (honeycomb.art == null) return null;
	//An enemy's cut-in falls back to its own portrait, from the enemies folder.
	var isCharacter = honeycomb.findDefinition(honeycomb.characterArray, character.index) != null;
	var chain = isCharacter ? honeycomb.art.portraitChain(character.index, character.defaultOutfit)
		: honeycomb.art.enemyPortraitChain(character.index);
	return chain.length === 0 ? null : chain[0];
};

//THE FIGHTER A CUT-IN IS FOR, as an entity. The cut-ins are per outfit, and Broken is also chosen by
//health, so the picture needs the fighter rather than only her definition. In a fight that is the entity
//itself; the debug panel plays a cut-in with no fight, and gets a stand-in wearing her default outfit at
//full health. An enemy returns null and keeps its per-definition art.
honeycomb.brokenOverlay.entityFor = function (entry, character) {
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (entry != null && entry.targetId != null && combat != null) {
		var entity = honeycomb.findEntity(entry.targetId, combat);
		if (entity != null) return entity;
	}
	if (character == null || honeycomb.findDefinition(honeycomb.characterArray, character.index) == null) return null;
	return { side: "ally", characterIndex: character.index, outfitIndex: character.defaultOutfit,
		health: 1, maxHealth: 1, temporaryHealth: 0, statusArray: [], downed: false };
};

//The Broken cut-in's picture as a chain: the outfit's own `<tier>-broken` down to `1-basic`, then the
//older per-character art, then -- only when all of that is empty -- the portrait artPathFor ends at.
honeycomb.brokenOverlay.artChainFor = function (entry, character) {
	var chain = honeycomb.art == null ? [] :
		honeycomb.art.brokenCutInChain(honeycomb.brokenOverlay.entityFor(entry, character), character);
	if (chain.length > 0) return chain;
	var artPath = honeycomb.brokenOverlay.artPathFor(character);
	return artPath == null ? [] : [artPath];
};

//The same for the recovery cut-in: the outfit's own `recover`, then the older per-character art, then
//the portrait.
honeycomb.recoverOverlay.artChainFor = function (entry, character) {
	var chain = honeycomb.art == null ? [] :
		honeycomb.art.recoverCutInChain(honeycomb.brokenOverlay.entityFor(entry, character), character);
	if (chain.length > 0) return chain;
	var artPath = honeycomb.recoverOverlay.artPathFor(character);
	return artPath == null ? [] : [artPath];
};

//The wash behind the tear. Falls back to a flat sheet in the character's own colour, so the tear is
//never a hole onto nothing.
honeycomb.brokenOverlay.backgroundStyleFor = function (character, field) {
	var path = character == null ? null : character[field];
	if (path != null) return "background-image:url('" + honeycomb.image(path) + "');background-size:cover;";
	var tint = character == null || character.colorHint == null ? "#b04a8c" : character.colorHint;
	return "background:linear-gradient(180deg," + tint + ",#12060f);";
};

//---------------------------------------------------------------------------------------------------
//The claw growth mask
//---------------------------------------------------------------------------------------------------
//Six radial gradients, one per stroke of brokenClawStart, unioned (mask-image's default composite is
//`add`). Animating mask-size opens them all from nothing without touching the content underneath --
//which is what lets the SAME component serve both halves of the tear: the white opening, and then the
//character's background eating that white from the same points outward.
honeycomb.brokenOverlay.clawMaskStyle = function () {
	var tuning = honeycomb.tuning.brokenOverlay;
	var stop = Math.round((1 - tuning.clawGrowSoftness) * 100);
	var imageArray = [];
	var positionArray = [];
	for (var pointIndex = 0; pointIndex < tuning.clawStartArray.length; pointIndex++) {
		var point = tuning.clawStartArray[pointIndex];
		imageArray.push("radial-gradient(closest-side, #000 " + stop + "%, transparent 100%)");
		positionArray.push(point.leftPercent + "% " + point.topPercent + "%");
	}
	var image = imageArray.join(",");
	var position = positionArray.join(",");
	var repeat = [];
	for (var repeatIndex = 0; repeatIndex < imageArray.length; repeatIndex++) repeat.push("no-repeat");
	return "-webkit-mask-image:" + image + ";mask-image:" + image + ";" +
		"-webkit-mask-position:" + position + ";mask-position:" + position + ";" +
		"-webkit-mask-repeat:" + repeat.join(",") + ";mask-repeat:" + repeat.join(",") + ";";
};

//The end size every one of those gradients animates to, written as a CSS variable so the keyframes in
//the stylesheet stay content-free.
honeycomb.brokenOverlay.clawGrowSizeValue = function () {
	var tuning = honeycomb.tuning.brokenOverlay;
	var sizeArray = [];
	for (var pointIndex = 0; pointIndex < tuning.clawStartArray.length; pointIndex++) {
		sizeArray.push(tuning.clawGrowWidthPercent + "% " + tuning.clawGrowHeightPercent + "%");
	}
	return sizeArray.join(",");
};

//WHERE THE GROWTH STARTS. Deliberately not zero: a blob narrower than the claw's own strokes paints
//nothing at all, so growing from nothing showed an empty screen and then a tear arriving halfway
//through the opening. A small starting size draws the first thin scratches at once and widens them.
honeycomb.brokenOverlay.clawZeroSizeValue = function () {
	var tuning = honeycomb.tuning.brokenOverlay;
	var width = (tuning.clawGrowWidthPercent * tuning.clawGrowStartFraction).toFixed(2);
	var height = (tuning.clawGrowHeightPercent * tuning.clawGrowStartFraction).toFixed(2);
	var sizeArray = [];
	for (var pointIndex = 0; pointIndex < tuning.clawStartArray.length; pointIndex++) {
		sizeArray.push(width + "% " + height + "%");
	}
	return sizeArray.join(",");
};

//---------------------------------------------------------------------------------------------------
//!!BROKEN!!
//---------------------------------------------------------------------------------------------------
//THE CUT-IN'S CLOCK. Every duration goes through honeycomb.duration so the whole cut-in respects the
//play-speed control like any other beat, and through `paced` on top of that, which plays it at
//tuning.brokenOverlay.paceMultiplier. The one exception is the still tail of the hold, which is added at
//its unpaced length. So:
//  startMs / exitMs   paced
//  holdMs             the moving part of the hold, paced, plus the rest, not
//  paced(ms)          for anything timed as a share of the start or hold (the text slam, the reveal):
//                     those are the moving part, so they keep the pace
//The overlay's close timer, the replay's wait and every CSS variable are read from this one answer.
honeycomb.brokenOverlay.timeline = function () {
	var tuning = honeycomb.tuning.brokenOverlay;
	var pace = tuning.paceMultiplier > 0 ? tuning.paceMultiplier : 1;
	var paced = function (milliseconds) { return Math.round(honeycomb.duration(milliseconds / pace)); };
	var restMs = Math.round(honeycomb.duration(tuning.holdDuration * tuning.holdRestFraction));
	var timeline = {
		paced: paced,
		startMs: paced(tuning.startDuration),
		holdMs: paced(tuning.holdDuration * (1 - tuning.holdRestFraction)) + restMs,
		exitMs: paced(tuning.exitDuration),
		//The whole hold at the pace, which the in-hold shares are cut from.
		pacedHoldMs: paced(tuning.holdDuration),
	};
	timeline.totalMs = timeline.startMs + timeline.holdMs + timeline.exitMs;
	return timeline;
};

//Total run time, and what the replay is told to wait.
honeycomb.brokenOverlay.totalDuration = function () {
	return honeycomb.brokenOverlay.timeline().totalMs;
};

//Whether this showing plays the still version. See tuning.brokenOverlay.honorReducedMotion.
honeycomb.brokenOverlay.reducedMotion = function () {
	if (honeycomb.tuning.brokenOverlay.honorReducedMotion != true) return false;
	return typeof window !== "undefined" && typeof window.matchMedia === "function" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

//Opens the cut-in and returns how long to hold the replay. Returns 0 when it is switched off or there
//is no screen to draw on, so a headless run and a disabled overlay behave identically.
honeycomb.brokenOverlay.play = function (entry) {
	if (honeycomb.tuning.brokenOverlay.enabled != true) return 0;
	//Only the special few get the cut-in. The engine stamps `cutIn` on the entry; an entry without it
	//(the debug panel's) plays.
	if (entry != null && entry.cutIn === false) return 0;
	if (typeof document === "undefined" || honeycomb.overlayHostElement() == null) return 0;

	//HONEYCOMB'S OWN STINGER, TIMED TO THE CHAIN SNAP. The front chain swaps from whole to snapped at
	//`stingerSnapFraction` of hold+exit after the start, so the sound lands with the break rather than
	//over the fly-in.
	//THE SOUND FILE HAS ITS OWN SILENCE AT THE START. `!broken.mp3` opens with 160ms of nothing, so
	//firing it at the snap would land its audible attack late; subtracting the measured lead-in keeps
	//the attack on the snap.
	var timeline = honeycomb.brokenOverlay.timeline();
	var stingerDelay = Math.max(0, Math.round(timeline.startMs +
		(timeline.holdMs + timeline.exitMs) * honeycomb.tuning.brokenOverlay.stingerSnapFraction -
		honeycomb.platform.soundLeadInMs("broken")));
	honeycomb.brokenOverlay.clearStinger();
	//A CHARACTER'S OWN OPENING SOUND (`brokenStartSound`), played as the cut-in starts and before the
	//stinger. Clemence's is a choir: her breaking is not a defeat.
	var startCharacter = honeycomb.brokenOverlay.characterFor(entry);
	if (startCharacter != null && startCharacter.brokenStartSound != null) honeycomb.platform.playStem(startCharacter.brokenStartSound);
	honeycomb.brokenOverlay.stingerTimer = setTimeout(function () {
		honeycomb.brokenOverlay.stingerTimer = null;
		honeycomb.platform.sound("broken");
	}, stingerDelay);
	var total = honeycomb.brokenOverlay.totalDuration();
	honeycomb.overlay.open("broken", { entry: entry });
	//Closed on a timer rather than by a click: it is an alert, not a screen. The timer is stored so a
	//scene change can cancel it -- an overlay outliving its scene would sit over the next one.
	honeycomb.brokenOverlay.clearTimer();
	honeycomb.brokenOverlay.timer = setTimeout(function () {
		honeycomb.brokenOverlay.timer = null;
		honeycomb.overlay.close("broken");
	}, total);
	return Math.round(total * honeycomb.tuning.brokenOverlay.blockingFraction);
};

honeycomb.brokenOverlay.clearTimer = function () {
	if (honeycomb.brokenOverlay.timer == null) return;
	clearTimeout(honeycomb.brokenOverlay.timer);
	honeycomb.brokenOverlay.timer = null;
};

//The stinger is on its OWN timer (it fires mid-cut-in), so closing the overlay early must silence it.
honeycomb.brokenOverlay.clearStinger = function () {
	if (honeycomb.brokenOverlay.stingerTimer == null) return;
	clearTimeout(honeycomb.brokenOverlay.stingerTimer);
	honeycomb.brokenOverlay.stingerTimer = null;
};

honeycomb.overlay.register({
	index: "broken",
	build: function (layer, params) {
		var tuning = honeycomb.tuning.brokenOverlay;
		var character = honeycomb.brokenOverlay.characterFor(params.entry);

		//The three moments, as CSS variables, so every keyframe in the stylesheet is written in terms
		//of them and the whole thing is retimed from tuning alone.
		//All of it read from the one timeline, which carries the pace.
		var timeline = honeycomb.brokenOverlay.timeline();
		var paced = timeline.paced;
		var startMs = timeline.startMs;
		var holdMs = timeline.holdMs;
		var exitMs = timeline.exitMs;
		layer.classList.add("hcBrokenLayer");
		if (honeycomb.brokenOverlay.reducedMotion() == true) layer.classList.add("hcBrokenReducedMotion");
		layer.style.cssText =
			"--hcBrokenStart:" + startMs + "ms;" +
			"--hcBrokenHold:" + holdMs + "ms;" +
			//The whole hold at the pace, for what is timed as a share of the hold.
			"--hcBrokenHoldPaced:" + timeline.pacedHoldMs + "ms;" +
			"--hcBrokenExit:" + exitMs + "ms;" +
			"--hcBrokenMid:" + (startMs + holdMs) + "ms;" +
			"--hcBrokenShake:" + honeycomb.cssPixels(tuning.shakePixels) + ";" +
			"--hcClawGrown:" + honeycomb.brokenOverlay.clawGrowSizeValue() + ";" +
			"--hcClawZero:" + honeycomb.brokenOverlay.clawZeroSizeValue() + ";" +
			//THE WIPE'S GEOMETRY, on the LAYER rather than the stage, because the stage and the black
			//band are siblings and both cut from these two numbers -- see tuning.brokenOverlay.
			"--hcWipeSlant:" + tuning.wipeSlantPercent + "%;" +
			"--hcWipeBand:" + tuning.wipeBandPercent + "%;";

		var markup = '<div class="hcBrokenStage">';

		//---- LAYER 1: the background chains -------------------------------------------------------
		//Each is one long strip of the looping chain art, rotated, oversized so its ends never enter
		//the frame, and translated along its own axis. The motion blur is a directional drop-shadow
		//stack rather than a filter, because a blur filter over a full-screen image is expensive and
		//this plays on a phone.
		markup += '<div class="hcBrokenChains">';
		for (var chainIndex = 0; chainIndex < tuning.chainArray.length; chainIndex++) {
			var chain = tuning.chainArray[chainIndex];
			var chainStyle =
				"top:" + chain.topPercent + "%;" +
				"--hcChainAngle:" + chain.angleDegrees + "deg;" +
				"--hcChainWidth:" + (chain.lengthFactor * 100) + "%;" +
				"--hcChainScale:" + chain.scale + ";" +
				"--hcChainTravel:" + chain.travelPercent + "%;" +
				"--hcChainBlur:" + honeycomb.cssPixels(chain.blur) + ";" +
				"--hcChainDelay:" + paced(chain.delay) + "ms;" +
				"--hcChainHold:" + paced(tuning.holdDuration * tuning.chainHoldFraction) + "ms;" +
				"background-image:url('" + honeycomb.image("ui/broken/brokenChainBackground") + "');";
			markup += '<div class="hcBrokenChain" style="' + chainStyle + '"></div>';
		}
		markup += "</div>";

		//---- LAYERS 2 AND 3: the tear -------------------------------------------------------------
		//One wrapper masked to the claw shape holds both. Inside it, the white opens first; the
		//character's background then grows out of the SAME points on top of the white, which is the
		//white being torn away read forwards.
		var clawMask = "-webkit-mask-image:url('" + honeycomb.image(tuning.clawMaskPath) + "');" +
			"mask-image:url('" + honeycomb.image(tuning.clawMaskPath) + "');" +
			"-webkit-mask-size:100% 100%;mask-size:100% 100%;" +
			"-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;";
		//THE WHITE IS DELAYED BY THE RIM'S LEAD, so the drawn edge forms a hair before the fill behind
		//it, which reads as the tears just forming.
		var rimLeadMs = paced(tuning.startDuration * tuning.clawRimLeadFraction);
		markup += '<div class="hcBrokenTear" style="' + clawMask + '">';
		markup += '<div class="hcBrokenTearWhite" style="' + honeycomb.brokenOverlay.clawMaskStyle() +
			"--hcClawOpen:" + paced(tuning.startDuration * tuning.clawWhiteFraction) + "ms;" +
			"--hcClawOpenDelay:" + rimLeadMs + 'ms"></div>';
		markup += '<div class="hcBrokenTearBack" style="' + honeycomb.brokenOverlay.clawMaskStyle() +
			honeycomb.brokenOverlay.backgroundStyleFor(character, "brokenBackgroundPath") +
			"--hcClawReveal:" + paced(tuning.holdDuration * tuning.clawRevealFraction) + "ms;" +
			"--hcClawRevealDelay:" + startMs + 'ms"></div>';
		markup += "</div>";
		//THE RIM OF THE TEAR. Masked by the GROWTH gradients rather than the claw silhouette, so the drawn
		//edge appears only where the tear has opened; masked by the silhouette instead, it would show the
		//finished rim shape while the fill is still six blobs.
		markup += '<div class="hcBrokenClawRimWrap" style="' + honeycomb.brokenOverlay.clawMaskStyle() +
			"--hcClawRim:" + paced(tuning.startDuration * tuning.clawRimFraction) + 'ms">' +
			honeycomb.imageTag(tuning.clawRimPath, { className: "hcBrokenClawRim", silentFallback: true, alt: "" }) +
			"</div>";

		//---- LAYER 4: the front chain -------------------------------------------------------------
		//Both frames are drawn; the whole one fades out and the snapped one in, at the midpoint, so
		//the swap is a break rather than a cut.
		markup += '<div class="hcBrokenFrontChain" style="--hcFrontTravel:' + tuning.frontChainTravelPercent +
			"%;--hcFrontBlur:" + honeycomb.cssPixels(tuning.frontChainBlur) + ";--hcFrontSnap:" + tuning.frontChainSnapPercent + '%">';
		markup += honeycomb.imageTag(tuning.frontChainWholePath, { className: "hcBrokenChainWhole", silentFallback: true, alt: "" });
		markup += honeycomb.imageTag(tuning.frontChainBrokenPath, { className: "hcBrokenChainSnapped", silentFallback: true, alt: "" });
		markup += "</div>";

		//---- LAYER 5: the character ---------------------------------------------------------------
		//Tunable per character: characterScale and characterOffsetPercent, overridable with
		//`brokenScale` / `brokenOffsetPercent` on the definition. Bottom-aligned, rising from below.
		var scale = character != null && character.brokenScale != null ? character.brokenScale : tuning.characterScale;
		//`brokenScaleMultiplier` makes one character's picture larger than the rest by a share, whatever
		//the shared scale is later tuned to. Clemence's is 1.2.
		if (character != null && character.brokenScaleMultiplier != null) scale = scale * character.brokenScaleMultiplier;
		var offset = character != null && character.brokenOffsetPercent != null
			? character.brokenOffsetPercent : tuning.characterOffsetPercent;
		var artChain = honeycomb.brokenOverlay.artChainFor(params.entry, character);
		if (artChain.length > 0) {
			markup += '<div class="hcBrokenCharacter" style="--hcBrokenArtScale:' + scale +
				";--hcBrokenArtOffset:" + offset + "%;--hcBrokenArtRise:" + tuning.characterRisePercent + '%">' +
				honeycomb.art.chainTag(artChain, { className: "hcBrokenCharacterArt", alt: "" }) +
				"</div>";
		}

		//---- LAYER 6: the text --------------------------------------------------------------------
		markup += '<div class="hcBrokenTextWrap" style="--hcBrokenTextScale:' + tuning.textScale +
			";--hcBrokenTextFlash:" + paced(tuning.textFlashDuration) + "ms;" +
			"--hcBrokenTextOvershoot:" + tuning.textOvershoot + '">' +
			honeycomb.imageTag(tuning.textPath, { className: "hcBrokenText", silentFallback: true, alt: "BROKEN" }) +
			'<div class="hcBrokenTextFlash"></div></div>';

		markup += "</div>";

		//---- THE EXIT: a slanted black wipe that erases what it passes over -----------------------
		//OUTSIDE the stage, deliberately. The stage is clipped to the region AHEAD of the wipe's edge, so
		//everything the wipe has passed is genuinely gone rather than fading on its own timer; the band
		//has to be a sibling or that same clip would eat it. Both shapes are cut from --hcWipeSlant and
		//--hcWipeBand and share the exit's easing, so the band stays on the edge.
		markup += '<div class="hcBrokenWipe"></div>';
		layer.innerHTML = markup;
	},
	teardown: function () {
		honeycomb.brokenOverlay.clearTimer();
		honeycomb.brokenOverlay.clearStinger();
	},
});

//---------------------------------------------------------------------------------------------------
//Recovery
//---------------------------------------------------------------------------------------------------
//A horizontal band opens across the middle of the screen. recoverBarMask cuts the window, recoverBar
//draws the rails top and bottom, the character's recoverBG fills it, and their EYES -- cropped out of
//their broken art by tuning.recoverOverlay.eyeWindow -- slide in from the side. A light sweep crosses
//the band while it holds, then the rails wipe out and it closes. Roughly a third the length of the
//break.
honeycomb.recoverOverlay.totalDuration = function () {
	var tuning = honeycomb.tuning.recoverOverlay;
	return honeycomb.duration(tuning.openDuration + tuning.holdDuration + tuning.closeDuration);
};

honeycomb.recoverOverlay.play = function (entry) {
	if (honeycomb.tuning.recoverOverlay.enabled != true) return 0;
	if (typeof document === "undefined" || honeycomb.overlayHostElement() == null) return 0;

	var total = honeycomb.recoverOverlay.totalDuration();
	honeycomb.overlay.open("recover", { entry: entry });
	honeycomb.recoverOverlay.clearTimer();
	honeycomb.recoverOverlay.timer = setTimeout(function () {
		honeycomb.recoverOverlay.timer = null;
		honeycomb.overlay.close("recover");
	}, total);
	return Math.round(total);
};

honeycomb.recoverOverlay.clearTimer = function () {
	if (honeycomb.recoverOverlay.timer == null) return;
	clearTimeout(honeycomb.recoverOverlay.timer);
	honeycomb.recoverOverlay.timer = null;
};

//THE EYE CROP, at a UNIFORM scale. The slot between the rails is very wide and very short; the
//character's face is not. Scaling the two axes independently to make a face fill that slot turns one
//eye into the whole screen, so instead the picture is scaled by HEIGHT alone and whatever width that
//gives is what the slot shows. A horizontal strip through the face at eye level is the Persona reading
//anyway.
//
//The maths is in the IMAGE's own terms, which is what keeps it independent of the viewport's shape:
//  height   100 / heightPercent of the slot, so exactly heightPercent of the picture fills it
//  translate  percentages on a transform resolve against the ELEMENT's own box, so shifting the
//             picture by -topPercent% of itself puts that row at the slot's top, and by
//             -centreXPercent% puts that column under the slot's centre
honeycomb.recoverOverlay.eyeStyleArray = function (character, entry) {
	var tuning = honeycomb.tuning.recoverOverlay;
	var window_ = character != null && character.recoverEyeWindow != null ? character.recoverEyeWindow : tuning.eyeWindow;
	//The character's OWN recovery art, not their broken art: per outfit (honeycomb.recoverOverlay.artChainFor).
	var chain = honeycomb.recoverOverlay.artChainFor(entry, character);
	if (chain.length === 0) return null;
	var artPath = chain[0];
	return {
		slot: "top:" + tuning.slotTopPercent + "%;height:" + tuning.slotHeightPercent + "%;",
		art: "height:" + (100 / window_.heightPercent * 100).toFixed(1) + "%;" +
			"--hcEyeShiftX:" + (-window_.centreXPercent).toFixed(1) + "%;" +
			"--hcEyeShiftY:" + (-window_.topPercent).toFixed(1) + "%;" +
			"--hcEyeFade:" + tuning.edgeFadePercent + "%;",
		source: honeycomb.image(artPath),
		chain: chain,
	};
};

honeycomb.overlay.register({
	index: "recover",
	build: function (layer, params) {
		var tuning = honeycomb.tuning.recoverOverlay;
		var character = honeycomb.brokenOverlay.characterFor(params.entry);

		var openMs = Math.round(honeycomb.duration(tuning.openDuration));
		var holdMs = Math.round(honeycomb.duration(tuning.holdDuration));
		var closeMs = Math.round(honeycomb.duration(tuning.closeDuration));
		layer.classList.add("hcRecoverLayer");
		layer.style.cssText =
			"--hcRecoverOpen:" + openMs + "ms;" +
			"--hcRecoverHold:" + holdMs + "ms;" +
			"--hcRecoverClose:" + closeMs + "ms;" +
			"--hcRecoverTotal:" + (openMs + holdMs + closeMs) + "ms;" +
			"--hcRecoverSlide:" + tuning.eyeSlidePercent + "%;" +
			"--hcRecoverSweep:" + Math.round(honeycomb.duration(tuning.sweepDuration)) + "ms;";

		//The window the band cuts, from the inverted mask -- same reason as the claw: a CSS mask reads
		//alpha, and the painted mask is opaque outside the band.
		var bandMask = "-webkit-mask-image:url('" + honeycomb.image(tuning.barMaskPath) + "');" +
			"mask-image:url('" + honeycomb.image(tuning.barMaskPath) + "');" +
			"-webkit-mask-size:100% 100%;mask-size:100% 100%;" +
			"-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;";

		var markup = '<div class="hcRecoverStage">';
		markup += '<div class="hcRecoverBand" style="' + bandMask + '">';
		markup += '<div class="hcRecoverBackdrop" style="' +
			honeycomb.brokenOverlay.backgroundStyleFor(character, "recoverBackgroundPath") + '"></div>';
		var eye = honeycomb.recoverOverlay.eyeStyleArray(character, params.entry);
		if (eye != null) {
			markup += '<div class="hcRecoverEyeSlot" style="' + eye.slot + '">' +
				honeycomb.art.chainTag(eye.chain, { className: "hcRecoverEyes", style: eye.art, alt: "" }) + "</div>";
		}
		markup += '<div class="hcRecoverSweep"></div>';
		markup += "</div>";
		//The rails, unmasked and over the band, because they ARE the band's edges.
		markup += honeycomb.imageTag(tuning.barPath, { className: "hcRecoverRails", silentFallback: true, alt: "" });
		markup += "</div>";
		layer.innerHTML = markup;
	},
	teardown: function () {
		honeycomb.recoverOverlay.clearTimer();
	},
});

//---------------------------------------------------------------------------------------------------
//THE EXPOSED CUT-IN
//---------------------------------------------------------------------------------------------------
//Plays once per fight, the first time a character reaches half-health.
//The broken cut-in's CHARACTER LAYER alone: the figure rises into the middle of a dark scrim, the word
//EXPOSED slams in at its feet, holds for a beat, and it leaves. No chains, no tear, no wipe. The art is
//`characters/<folder>/<outfit>/exposed` (honeycomb.art.exposedChain, placeholders generated by
//generate-placeholder-art.py), falling back to the hurt tier the board already draws at this health
//(honeycomb.art.tierFor), so what steps forward is what the player is looking at. Fired by
//honeycomb.checkHalfHealthCutIn, once per fight per character.
honeycomb.halfHealthOverlay = {};

honeycomb.halfHealthOverlay.timeline = function () {
	var tuning = honeycomb.tuning.halfHealthOverlay;
	return {
		startMs: Math.round(honeycomb.duration(tuning.startDuration)),
		holdMs: Math.round(honeycomb.duration(tuning.holdDuration)),
		exitMs: Math.round(honeycomb.duration(tuning.exitDuration)),
	};
};

honeycomb.halfHealthOverlay.totalDuration = function () {
	var timeline = honeycomb.halfHealthOverlay.timeline();
	return timeline.startMs + timeline.holdMs + timeline.exitMs;
};

//Opens it and returns how long the replay should wait. Zero when it is switched off or there is no
//screen to draw on, so a headless run and a disabled overlay behave identically.
honeycomb.halfHealthOverlay.play = function (entry) {
	if (honeycomb.tuning.halfHealthOverlay.enabled != true) return 0;
	if (typeof document === "undefined" || honeycomb.overlayHostElement() == null) return 0;

	//HONEYCOMB'S OWN STINGER: plays exposedTorn when the half-health trigger runs.
	honeycomb.platform.sound("exposedTorn");
	var total = honeycomb.halfHealthOverlay.totalDuration();
	honeycomb.overlay.open("lowHealth", { entry: entry });
	honeycomb.halfHealthOverlay.clearTimer();
	honeycomb.halfHealthOverlay.timer = setTimeout(function () {
		honeycomb.halfHealthOverlay.timer = null;
		honeycomb.overlay.close("lowHealth");
	}, total);
	return Math.round(total * honeycomb.tuning.halfHealthOverlay.blockingFraction);
};

honeycomb.halfHealthOverlay.clearTimer = function () {
	if (honeycomb.halfHealthOverlay.timer == null) return;
	clearTimeout(honeycomb.halfHealthOverlay.timer);
	honeycomb.halfHealthOverlay.timer = null;
};

honeycomb.overlay.register({
	index: "lowHealth",
	build: function (layer, params) {
		var tuning = honeycomb.tuning.halfHealthOverlay;
		var entry = params.entry == null ? {} : params.entry;
		var entity = honeycomb.findEntity(entry.targetId,
			honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat);
		var timeline = honeycomb.halfHealthOverlay.timeline();

		layer.classList.add("hcLowHealthLayer");
		layer.style.cssText =
			"--hcLowStart:" + timeline.startMs + "ms;" +
			"--hcLowHold:" + timeline.holdMs + "ms;" +
			"--hcLowExit:" + timeline.exitMs + "ms;" +
			"--hcLowMid:" + (timeline.startMs + timeline.holdMs) + "ms;" +
			"--hcLowScrim:" + tuning.scrimOpacity + ";" +
			"--hcLowScale:" + tuning.characterScale + ";" +
			"--hcLowOffset:" + tuning.characterOffsetPercent + "%;" +
			"--hcLowRise:" + tuning.characterRisePercent + "%;";

		//THE SPRITE IS THE CHARACTER'S OWN EXPOSED PICTURE, or the hurt tier the board already draws
		//when none is drawn yet: the cut-in and the board cannot disagree about what the character looks
		//like right now.
		var chain = entity == null || honeycomb.art == null ? [] : honeycomb.art.exposedChain(entity);

		var markup = '<div class="hcLowStage"><div class="hcLowScrim"></div>';
		if (chain.length > 0) {
			markup += '<div class="hcLowCharacter">' +
				honeycomb.art.chainTag(chain, { className: "hcLowCharacterArt", alt: "" }) + "</div>";
		}
		//THE NAME, in ui/exposed/exposedText. It is art rather than a word so the drawn version can
		//replace it without touching this file; the fallback text keeps it readable un-drawn.
		markup += '<div class="hcLowTitle" style="--hcLowTextScale:' + tuning.textScale +
			";--hcLowTextBottom:" + tuning.textBottomPercent + '%">' +
			honeycomb.imageTag(tuning.textPath, { className: "hcLowTitleArt", silentFallback: true, alt: "EXPOSED" }) +
			"</div>";
		markup += "</div>";
		layer.innerHTML = markup;
	},
	teardown: function () {
		honeycomb.halfHealthOverlay.clearTimer();
	},
});

//---------------------------------------------------------------------------------------------------
//A weakness rank going up
//---------------------------------------------------------------------------------------------------
//Crossing a rank changes a character PERMANENTLY in the middle of a fight, so it gets a cut-in of its
//own: who, which weakness, the rank's title and what it now costs them.
//
//SHAPE: a card sliding in from the side rather than a full-screen slam. It is bad news about the long
//game, not a moment in this fight, and the break already owns the full screen.
//
//QUEUED, NOT STACKED. Two tags crossing in one action -- an attack carrying Charm and Exposure -- would
//otherwise open two overlays on top of each other. They play one after the other instead.
honeycomb.weaknessOverlay = {};
honeycomb.weaknessOverlay.queueArray = [];

honeycomb.weaknessOverlay.totalDuration = function () {
	var tuning = honeycomb.tuning.weaknessOverlay;
	return honeycomb.duration(tuning.enterDuration + tuning.holdDuration + tuning.leaveDuration);
};

//Opens it, or queues it behind one already showing. Returns how long the replay should wait, which is
//the whole run for the first and nothing for one that merely joined the queue -- the replay's beat
//already covers the first, and the queue drains on its own timers afterwards.
honeycomb.weaknessOverlay.play = function (entry) {
	if (honeycomb.tuning.weaknessOverlay.enabled != true) return 0;
	if (typeof document === "undefined" || honeycomb.overlayHostElement() == null) return 0;

	if (honeycomb.weaknessOverlay.timer != null) {
		honeycomb.weaknessOverlay.queueArray.push(entry);
		return 0;
	}
	return honeycomb.weaknessOverlay.show(entry);
};

honeycomb.weaknessOverlay.show = function (entry) {
	var total = honeycomb.weaknessOverlay.totalDuration();
	honeycomb.overlay.open("weaknessRank", { entry: entry });
	honeycomb.weaknessOverlay.timer = setTimeout(function () {
		honeycomb.weaknessOverlay.timer = null;
		honeycomb.overlay.close("weaknessRank");
		var next = honeycomb.weaknessOverlay.queueArray.shift();
		if (next != null) honeycomb.weaknessOverlay.show(next);
	}, total);
	return Math.round(total);
};

honeycomb.weaknessOverlay.clearTimer = function () {
	honeycomb.weaknessOverlay.queueArray = [];
	if (honeycomb.weaknessOverlay.timer == null) return;
	clearTimeout(honeycomb.weaknessOverlay.timer);
	honeycomb.weaknessOverlay.timer = null;
};

honeycomb.overlay.register({
	index: "weaknessRank",
	build: function (layer, params) {
		var tuning = honeycomb.tuning.weaknessOverlay;
		var entry = params.entry == null ? {} : params.entry;
		var character = honeycomb.findDefinition(honeycomb.characterArray, entry.characterIndex);
		var tag = honeycomb.findDefinition(honeycomb.cardTagArray, entry.tag);
		var accent = tag == null ? "#ff5fd2" : tag.color;

		layer.classList.add("hcWeaknessLayer");
		layer.style.cssText =
			"--hcWeaknessEnter:" + Math.round(honeycomb.duration(tuning.enterDuration)) + "ms;" +
			"--hcWeaknessHold:" + Math.round(honeycomb.duration(tuning.holdDuration)) + "ms;" +
			"--hcWeaknessLeave:" + Math.round(honeycomb.duration(tuning.leaveDuration)) + "ms;" +
			"--hcWeaknessAccent:" + accent + ";";

		var markup = '<div class="hcWeaknessCard">';
		//The face, so it is read as happening to somebody rather than to a stat.
		if (character != null && honeycomb.art != null) {
			markup += '<div class="hcWeaknessFace">' +
				honeycomb.art.portraitTag(character.index, character.defaultOutfit,
					{ className: "hcWeaknessPortrait", alt: "" }) + "</div>";
		}
		markup += '<div class="hcWeaknessBody">';
		markup += '<div class="hcWeaknessKicker">Weakness deepens</div>';
		markup += '<div class="hcWeaknessWho">' +
			honeycomb.escapeText(character == null ? "" : character.name) + "</div>";
		markup += '<div class="hcWeaknessWhat">' +
			honeycomb.escapeText(tag == null ? String(entry.tag) : tag.name) +
			' <span class="hcWeaknessRankWord">' + honeycomb.escapeText(entry.rankName == null ? "" : entry.rankName) +
			"</span></div>";
		if (entry.description != null) {
			markup += '<div class="hcWeaknessText">' + honeycomb.escapeText(entry.description) + "</div>";
		}
		//What it actually costs, which is the only number on the card.
		if (entry.multiplier != null) {
			markup += '<div class="hcWeaknessCost">' +
				honeycomb.escapeText(tag == null ? "This" : tag.name) + " Lust now lands at ×" +
				honeycomb.ui.trimNumber(entry.multiplier) + "</div>";
		}
		markup += "</div></div>";
		layer.innerHTML = markup;
	},
	teardown: function () {
		//Only the timer for the one showing: the queue is cleared by whoever closed everything.
		if (honeycomb.weaknessOverlay.timer == null) return;
		clearTimeout(honeycomb.weaknessOverlay.timer);
		honeycomb.weaknessOverlay.timer = null;
	},
});

//---------------------------------------------------------------------------------------------------
//Cut-ins outside a fight
//---------------------------------------------------------------------------------------------------
//Inside combat every cut-in is a beat of the log replay, which walks entries one at a time and waits
//for each. Outside one -- an event's choice, the lust that bleeds off with every step on the map --
//there is no replay to hang them on.
//
//This is the one path for both. It walks a finished log for the entries that own a cut-in and plays
//them one after another, each waiting for the one before, so two things happening in one choice do not
//open on top of each other. Anything with no screen to draw on falls straight through, exactly as the
//individual `play` functions do.
honeycomb.cutInLogKindArray = [
	{ index: "broken", play: function (entry) { return honeycomb.brokenOverlay.play(entry); } },
	{ index: "recovered", play: function (entry) { return honeycomb.recoverOverlay.play(entry); } },
	{ index: "lustRank", play: function (entry) { return honeycomb.weaknessOverlay.play(entry); } },
	{ index: "lowHealth", play: function (entry) { return honeycomb.halfHealthOverlay.play(entry); } },
];

honeycomb.playCutInsFromLog = function (logArray, onComplete) {
	var pendingArray = [];
	for (var scanIndex = 0; scanIndex < (logArray == null ? 0 : logArray.length); scanIndex++) {
		var kind = honeycomb.findDefinition(honeycomb.cutInLogKindArray, logArray[scanIndex].type);
		if (kind != null) pendingArray.push({ kind: kind, entry: logArray[scanIndex] });
	}
	if (pendingArray.length === 0) {
		if (onComplete != null) onComplete();
		return 0;
	}

	var position = 0;
	function step() {
		if (position >= pendingArray.length) {
			if (onComplete != null) onComplete();
			return;
		}
		var next = pendingArray[position];
		position += 1;
		var wait = next.kind.play(next.entry);
		//A zero wait means there is no screen -- drain the rest immediately rather than scheduling
		//timers nobody will see.
		if (wait <= 0) { step(); return; }
		setTimeout(step, wait);
	}
	step();
	return pendingArray.length;
};
