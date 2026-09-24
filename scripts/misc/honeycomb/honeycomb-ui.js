//===================================================================================================
//HONEYCOMB CATACOMBS -- shared UI builders
//===================================================================================================
//Markup that more than one scene needs: cards, portraits, health bars, status chips, the top bar.
//Every one returns an HTML STRING rather than touching the DOM, so a scene assembles its whole screen
//in one innerHTML write and nothing reflows halfway through a build.
//
//WHERE THE ART GOES. Placeholder visuals are marked HC-PLACEHOLDER in both this file and
//honeycomb.css. The rule used to decide between generated SVG and styled HTML:
//  * SVG   for anything that is conceptually an ICON -- a discrete picture that will one day be a
//          drawn asset in the images folder. Generated as SVG so the swap is a path change.
//  * HTML  for anything that is conceptually a WIDGET -- bars, frames, panels, layout. These will be
//          restyled rather than replaced, so they stay as elements CSS can reach.
window.honeycomb = window.honeycomb || {};

//Defensive rather than a plain assignment: a self-contained system may load earlier and hang its own
//builder here (honeycomb-tags.js does), and a bare `= {}` would silently delete it.
honeycomb.ui = honeycomb.ui || {};

//---------------------------------------------------------------------------------------------------
//Generated placeholder icons
//---------------------------------------------------------------------------------------------------
//HC-PLACEHOLDER. Every icon the game asks for is a real path first; only when that file is missing
//does the <img> onerror handler swap in generated art. These builders exist so the swapped-in art is
//meaningful rather than a grey box, and so the icon set can be previewed before it is drawn.
//Each returns SVG markup, which honeycomb.image passes through as a data URI.
honeycomb.ui.glyphArray = [
	//Crossed blades rather than a single upright sword: a lone blade reads as an exclamation mark
	//once scaled down to a map node, which made every combat node look like a warning.
	{ index: "sword", path: "M16 12 L26 8 L60 60 L52 68 Z M84 12 L74 8 L40 60 L48 68 Z M30 66 L44 78 L36 88 L22 76 Z M70 66 L56 78 L64 88 L78 76 Z" },
	{ index: "shield", path: "M50 8 L84 22 V50 Q84 78 50 92 Q16 78 16 50 V22 Z" },
	{ index: "heart", path: "M50 86 C20 64 10 46 10 34 A22 22 0 0 1 50 24 A22 22 0 0 1 90 34 C90 46 80 64 50 86 Z" },
	{ index: "drop", path: "M50 8 C70 38 82 52 82 64 A32 32 0 0 1 18 64 C18 52 30 38 50 8 Z" },
	{ index: "coin", path: "M50 10 A40 40 0 1 1 49.9 10 Z M50 26 A24 24 0 1 0 50.1 26 Z" },
	{ index: "key", path: "M34 10 A24 24 0 1 1 33.9 10 Z M50 52 h8 v38 h-8 Z M58 66 h14 v8 h-14 Z M58 80 h10 v8 h-10 Z" },
	{ index: "flask", path: "M40 8 h20 v22 l20 44 A12 12 0 0 1 68 92 H32 A12 12 0 0 1 20 74 L40 30 Z" },
	{ index: "skull", path: "M50 8 A36 36 0 0 1 86 44 V60 A14 14 0 0 1 72 74 V88 H28 V74 A14 14 0 0 1 14 60 V44 A36 36 0 0 1 50 8 Z M34 44 A9 9 0 1 0 34.1 44 Z M66 44 A9 9 0 1 0 66.1 44 Z" },
	//`stroke` marks a glyph whose path is an open line rather than a closed silhouette. Filling one of
	//those produces an unreadable blob, so these are drawn as strokes regardless of the caller.
	{ index: "spiral", stroke: true, path: "M50 10 A40 40 0 1 1 20 76 A28 28 0 1 0 66 30 A16 16 0 1 1 50 58" },
	{ index: "chevron", path: "M24 26 L50 52 L76 26 L88 38 L50 76 L12 38 Z" },
	{ index: "star", path: "M50 6 L62 38 L96 38 L68 58 L79 92 L50 71 L21 92 L32 58 L4 38 L38 38 Z" },
	{ index: "eye", path: "M6 50 Q50 12 94 50 Q50 88 6 50 Z M50 34 A16 16 0 1 0 50.1 34 Z" },
	{ index: "flame", path: "M50 6 C62 30 78 38 78 58 A28 28 0 0 1 22 58 C22 44 32 40 36 28 C44 40 44 22 50 6 Z" },
	{ index: "chest", path: "M12 40 A38 38 0 0 1 88 40 V44 H12 Z M12 50 H88 V86 H12 Z M44 50 h12 v18 h-12 Z" },
	{ index: "campfire", stroke: true, path: "M50 12 C60 32 74 38 74 54 A24 24 0 0 1 26 54 C26 42 34 38 38 30 C44 40 44 24 50 12 Z M10 84 L90 76 M12 76 L88 86" },
	{ index: "bag", path: "M28 32 V24 A22 22 0 0 1 72 24 V32 H86 L80 92 H20 L14 32 Z M40 32 V24 A10 10 0 0 1 60 24 V32 Z" },
	{ index: "question", path: "M36 32 A16 16 0 1 1 52 52 V62 H44 V46 A10 10 0 1 0 34 34 Z M42 72 h12 v12 h-12 Z" },
	{ index: "arrows", path: "M10 50 L34 26 V40 H66 V26 L90 50 L66 74 V60 H34 V74 Z" },
	{ index: "shard", path: "M50 4 L74 40 L50 96 L26 40 Z" },
	//Character-tag icons (honeycomb.tagArray). A head over shoulders; the two sex symbols; a paw; a leaf.
	{ index: "person", path: "M50 8 A16 16 0 1 1 49.9 8 Z M18 92 V76 A32 28 0 0 1 82 76 V92 Z" },
	{ index: "leaf", stroke: true, path: "M50 8 C80 28 88 56 50 92 C12 56 20 28 50 8 Z M50 16 V84 M50 44 L30 30 M50 44 L70 30" },
	{ index: "venus", path: "M50 8 A24 24 0 1 1 49.9 8 Z M50 20 A12 12 0 1 0 50.1 20 Z M45 56 H55 V66 H66 V76 H55 V92 H45 V76 H34 V66 H45 Z" },
	{ index: "mars", path: "M42 36 A26 26 0 1 1 41.9 36 Z M42 48 A14 14 0 1 0 42.1 48 Z M56 40 L72 24 H62 V12 H92 V42 H80 V32 L64 48 Z" },
	{ index: "paw", path: "M20 34 A9 12 0 1 1 19.9 34 Z M38 14 A9 12 0 1 1 37.9 14 Z M62 14 A9 12 0 1 1 61.9 14 Z M80 34 A9 12 0 1 1 79.9 34 Z M50 48 C68 48 82 70 74 82 C66 94 34 94 26 82 C18 70 32 48 50 48 Z" },
	//A written page: the battle log's button.
	{ index: "scroll", path: "M20 10 H80 V90 H20 Z M30 24 H70 V32 H30 Z M30 42 H70 V50 H30 Z M30 60 H58 V68 H30 Z" },
	//Four corners: the fullscreen button.
	{ index: "expand", path: "M10 40 V10 H40 V20 H20 V40 Z M60 10 H90 V40 H80 V20 H60 Z M10 60 H20 V80 H40 V90 H10 Z M80 60 H90 V90 H60 V80 H80 Z" },
];

//Builds an icon as inline SVG. `filled` draws the path solid; otherwise it is stroked.
honeycomb.ui.glyph = function (glyphIndex, color, filled) {
	var glyph = honeycomb.findDefinition(honeycomb.ui.glyphArray, glyphIndex);
	if (glyph == null) glyph = honeycomb.findDefinition(honeycomb.ui.glyphArray, "question");
	var tint = color == null ? "#efe4cf" : color;
	//An explicit `filled` from the caller wins; otherwise the glyph's own `stroke` flag decides, so a
	//glyph that can only be drawn as a line is never accidentally filled by a caller that did not know.
	var useStroke = filled == false || (filled == null && glyph.stroke == true);
	var paint = useStroke
		? 'fill="none" stroke="' + tint + '" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"'
		: 'fill="' + tint + '"';
	return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
		'<path d="' + glyph.path + '" ' + paint + ' fill-rule="evenodd"/></svg>';
};

//An <img> whose real art is `path`, falling back to a generated glyph rather than the generic
//"missing file" placeholder. Used everywhere an icon is small and its meaning matters more than its
//detail, so the game reads correctly long before the icon set is drawn.
//
//Paths that have already failed once this session are not requested again: the combat screen repaints
//on every animation beat, and without this memo each repaint would re-issue a request for every
//undrawn icon on screen. The memo is per session and per path, so dropping a real icon file into the
//folder and reloading picks it up normally.
honeycomb.ui.missingPathArray = {};

//A FULL-SCREEN BACKDROP THAT FITS ANY PAINTING. The painting whole and unstretched,
//over a blurred copy of itself that covers the screen, under a vignette: no bars, no stretching, and no
//seam to notice whatever shape the painting is. Silent when the file is missing -- the CSS ground shows.
//Used by every full-bleed scene (events, the shop). See .hcEventBackdrop.
honeycomb.ui.backdrop = function (path, options) {
	var settings = options == null ? {} : options;
	return '<div class="hcEventBackdrop' + (settings.className == null ? "" : " " + settings.className) + '">' +
		honeycomb.imageTag(path, { className: "hcEventBackdropFill", alt: "", silentFallback: true }) +
		honeycomb.imageTag(path, { className: "hcEventBackdropArt", alt: settings.alt == null ? "" : settings.alt, silentFallback: true }) +
		'<div class="hcEventVignette"></div></div>';
};

//SOUND AND MUSIC TOGGLES, as two buttons. The host owns the flags; see
//honeycomb.platform.setSoundEnabled. `onChange` is run after either is pressed, so the screen showing
//them can redraw its own labels. Pressing one is the user gesture an autoplay block is waiting for,
//which is the whole reason a playtester needs these at all.
honeycomb.ui.soundButtons = function (onChange, className) {
	var after = onChange == null ? "" : ";" + onChange;
	var buttonClass = "hcButton" + (className == null ? "" : " " + className);
	var musicOn = honeycomb.platform.musicEnabled();
	var soundOn = honeycomb.platform.soundEnabled();
	return '<div class="' + buttonClass + '" onclick="honeycomb.platform.setMusicEnabled(' + (musicOn ? "false" : "true") + ')' + after + '">' +
		honeycomb.ui.iconTag(null, musicOn ? "flame" : "chevron", musicOn ? "#63d2a3" : "#6b5b7d", { className: "hcInlineIcon" }) +
		" Music: " + (musicOn ? "On" : "Off") + "</div>" +
		'<div class="' + buttonClass + '" onclick="honeycomb.platform.setSoundEnabled(' + (soundOn ? "false" : "true") + ')' + after + '">' +
		honeycomb.ui.iconTag(null, soundOn ? "star" : "chevron", soundOn ? "#63d2a3" : "#6b5b7d", { className: "hcInlineIcon" }) +
		" Sound: " + (soundOn ? "On" : "Off") + "</div>";
};

//THE PLAY-SPEED SLIDER as a menu row. A bar over tuning.animation.playSpeedArray
//rather than over a multiplier, so the named steps stay the only speeds there are and adding a slower
//one is a table entry. Shared by the system menu and anything else that wants it; the combat shelf has
//its own floating panel, because there the board must stay visible underneath.
honeycomb.ui.playSpeedSlider = function (onChange) {
	var speedArray = honeycomb.tuning.animation.playSpeedArray;
	var speed = honeycomb.findDefinition(speedArray, honeycomb.playSpeed());
	var after = onChange == null ? "" : ";" + onChange;
	var markup = '<div class="hcMenuSlider">';
	markup += '<div class="hcMenuSliderLabel">Play Speed: <span class="' +
		(speed != null && speed.inspection == true ? "hcSpeedInspection" : "") + '">' +
		honeycomb.escapeText(speed == null ? "" : speed.name + "  ·  " + speed.label) + "</span></div>";
	markup += '<input type="range" class="hcSpeedRange" min="0" max="' + (speedArray.length - 1) +
		'" step="1" value="' + honeycomb.playSpeedPosition() +
		'" oninput="honeycomb.setPlaySpeedPosition(this.value);honeycomb.save.autosave(null)"' +
		' onchange="honeycomb.setPlaySpeedPosition(this.value)' + after + '">';
	markup += '<div class="hcMenuSliderEnds"><span>' + honeycomb.escapeText(speedArray[0].label) +
		"</span><span>" + honeycomb.escapeText(speedArray[speedArray.length - 1].label) + "</span></div>";
	markup += "</div>";
	return markup;
};

//A multiplier printed the way a player reads one: 1.25 rather than 1.250000004, 2 rather than 2.00.
//Shared so the weakness rows, their tooltips and the rank cut-in cannot print the same number three
//different ways.
honeycomb.ui.trimNumber = function (value) {
	if (value == null) return "";
	return Number(value).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
};

honeycomb.ui.iconTag = function (path, glyphIndex, color, options) {
	var settings = options == null ? {} : options;
	var fallback = honeycomb.svgToDataUri(honeycomb.ui.glyph(glyphIndex, color, settings.filled));
	var attributes = "";
	if (settings.className) attributes += ' class="' + settings.className + '"';
	if (settings.style) attributes += ' style="' + settings.style + '"';
	if (settings.title) attributes += ' title="' + honeycomb.escapeAttribute(settings.title) + '"';

	//Known missing, or nothing to try: draw the glyph directly and skip the request entirely.
	if (path == null || honeycomb.ui.missingPathArray[path] === true) {
		return '<img src="' + fallback + '"' + attributes + ' alt="">';
	}

	return '<img src="' + honeycomb.image(path) + '"' + attributes +
		' alt="" data-honeycombIconPath="' + honeycomb.escapeAttribute(path) + '"' +
		' onerror="honeycomb.ui.onIconError(this, \'' + fallback.replace(/'/g, "%27") + '\')">';
};

//Records the miss so later renders go straight to the glyph, then swaps this one over.
honeycomb.ui.onIconError = function (element, fallbackSource) {
	element.onerror = null;
	var path = element.dataset == null
		? null
		: (element.dataset.honeycombiconpath || element.dataset.honeycombIconPath);
	if (path != null) honeycomb.ui.missingPathArray[path] = true;
	element.src = fallbackSource;
};

//---------------------------------------------------------------------------------------------------
//UI frames
//---------------------------------------------------------------------------------------------------
//The mockups' cut corners and metal trim, as nine-slice IMAGES (tuning.art.uiFrameArray) so an art pass
//replaces files rather than code. Because a frame is the element's whole face -- fill included -- it is
//only switched on once its file has LOADED: each is probed once per session, and on success both hosts
//get `data-hc-frame-<name>="ready"`, which is what the stylesheet's frame rules key on. An attribute
//rather than a class, because every scene change rewrites the root's classes. A missing file never
//flips it, so the plain CSS look stays exactly as it was.
honeycomb.ui.frameStateArray = {};

//"buttonPrimary" -> "button-primary", for attribute and variable names.
honeycomb.ui.frameKey = function (frame) {
	return frame.index.replace(/([A-Z])/g, "-$1").toLowerCase();
};

honeycomb.ui.loadFrames = function () {
	var hostArray = [honeycomb.rootElement(), honeycomb.overlayHostElement()];
	var frameArray = honeycomb.tuning.art.uiFrameArray;
	for (var frameIndex = 0; frameIndex < frameArray.length; frameIndex++) {
		var frame = frameArray[frameIndex];
		var key = honeycomb.ui.frameKey(frame);
		//Absolute: a url() inside a custom property may otherwise resolve against the STYLESHEET's
		//folder rather than the page's, and quietly load nothing.
		var source = new URL(honeycomb.image(frame.path), document.baseURI).href;
		for (var hostIndex = 0; hostIndex < hostArray.length; hostIndex++) {
			var host = hostArray[hostIndex];
			if (host == null) continue;
			host.style.setProperty("--hc-frame-" + key + "-image", 'url("' + source + '")');
			host.style.setProperty("--hc-frame-" + key + "-slice", String(frame.slice));
			host.style.setProperty("--hc-frame-" + key + "-width", honeycomb.cssPixels(frame.widthPixels));
			//Hosts are rebuilt on every mount, so a frame already known to load is marked again here.
			if (honeycomb.ui.frameStateArray[frame.index] == "ready") host.setAttribute("data-hc-frame-" + key, "ready");
		}
		if (honeycomb.ui.frameStateArray[frame.index] != null) continue;
		honeycomb.ui.frameStateArray[frame.index] = "loading";
		honeycomb.ui.probeFrame(frame, key, source);
	}
};

//Switched on only once the image is DECODED as well as loaded: the switch removes the element's own
//background, and a frame not yet ready to paint would leave it blank for a moment.
honeycomb.ui.probeFrame = function (frame, key, source) {
	var probe = new Image();
	var markReady = function () {
		honeycomb.ui.frameStateArray[frame.index] = "ready";
		var hostArray = [honeycomb.rootElement(), honeycomb.overlayHostElement()];
		for (var hostIndex = 0; hostIndex < hostArray.length; hostIndex++) {
			if (hostArray[hostIndex] != null) hostArray[hostIndex].setAttribute("data-hc-frame-" + key, "ready");
		}
	};
	probe.onload = function () {
		if (typeof probe.decode === "function") probe.decode().then(markReady, markReady);
		else markReady();
	};
	probe.onerror = function () { honeycomb.ui.frameStateArray[frame.index] = "missing"; };
	probe.src = source;
};

//AN ITEM ON ITS PLATE: a relic or a piece of equipment, larger than a plain row icon and on a square
//cut-cornered plate rather than in a circle, so a drawn item has room to read. The
//plate is the "plate" UI frame once its file loads, a plain square before.
honeycomb.ui.itemPlate = function (path, glyph, color, options) {
	var settings = options == null ? {} : options;
	return '<span class="hcItemPlate' + (settings.className ? " " + settings.className : "") + '">' +
		honeycomb.ui.iconTag(path, glyph, color, { className: "hcItemPlateIcon" }) + "</span>";
};

//---------------------------------------------------------------------------------------------------
//Experience: two pools, never merged on screen
//---------------------------------------------------------------------------------------------------
//GLOBAL experience (the whole cast's pool, paid for finding things) always wears the star icon.
//PERSONAL experience (one character's own, paid for fighting) always wears that character's face.
//Every screen that shows either uses these, so the two can never be mistaken for each other.
honeycomb.ui.globalExperienceText = "Global experience: the whole cast's pool, earned by finding things for the first time.";
honeycomb.ui.personalExperienceText = "Personal experience: each character's own, earned by fighting and split among the party.";

honeycomb.ui.globalExperienceTile = function (amount) {
	return '<div class="hcRewardTile" title="' + honeycomb.escapeAttribute(honeycomb.ui.globalExperienceText) + '">' +
		honeycomb.ui.resourceIcon("experience", "hcRewardIcon") +
		'<div class="hcRewardValue">+' + amount + "</div>" +
		'<div class="hcTiny hcMuted">Global XP</div></div>';
};

//Who earned how much personal experience: a small face per member with their share beside it.
honeycomb.ui.personalShareRow = function (shareArray) {
	if (shareArray == null || shareArray.length === 0) return "";
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var markup = '<div class="hcShareRow" title="' + honeycomb.escapeAttribute(honeycomb.ui.personalExperienceText) + '">';
	markup += '<span class="hcTiny hcMuted hcShareLabel">Personal XP</span>';
	for (var shareIndex = 0; shareIndex < shareArray.length; shareIndex++) {
		var share = shareArray[shareIndex];
		var definition = honeycomb.findDefinition(honeycomb.characterArray, share.characterIndex);
		if (definition == null) continue;
		var outfitIndex = definition.defaultOutfit;
		for (var memberIndex = 0; run != null && memberIndex < run.partyArray.length; memberIndex++) {
			if (run.partyArray[memberIndex].characterIndex == share.characterIndex) outfitIndex = run.partyArray[memberIndex].outfitIndex;
		}
		markup += '<span class="hcShareTile" style="--hcAccent:' + definition.colorHint + '">' +
			honeycomb.art.portraitTag(share.characterIndex, outfitIndex, { className: "hcShareFace", alt: definition.name }) +
			'<span class="hcShareValue">+' + share.amount + "</span></span>";
	}
	return markup + "</div>";
};

//A character's own experience as a compact chip: their face, the amount.
honeycomb.ui.personalExperienceChip = function (characterIndex, outfitIndex) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	if (definition == null) return "";
	return '<span class="hcXpChip hcXpPersonal" style="--hcAccent:' + definition.colorHint + '"' +
		' title="' + honeycomb.escapeAttribute(honeycomb.ui.personalExperienceText) + '">' +
		honeycomb.art.portraitTag(characterIndex, outfitIndex == null ? definition.defaultOutfit : outfitIndex,
			{ className: "hcXpFace", alt: definition.name }) +
		'<span class="hcXpValue">' + honeycomb.progression.personalExperience(characterIndex) + "</span>" +
		'<span class="hcTiny hcMuted">Personal</span></span>';
};

honeycomb.ui.globalExperienceChip = function () {
	return '<span class="hcXpChip hcXpGlobal" title="' + honeycomb.escapeAttribute(honeycomb.ui.globalExperienceText) + '">' +
		honeycomb.ui.resourceIcon("experience", "hcXpFace") +
		'<span class="hcXpValue">' + honeycomb.getResource("experience") + "</span>" +
		'<span class="hcTiny hcMuted">Global</span></span>';
};

//---------------------------------------------------------------------------------------------------
//Resource presentation
//---------------------------------------------------------------------------------------------------
//Which generated glyph stands in for each resource until real icons exist. Kept as a table so the
//mapping is data, and so a new resource declares its own fallback rather than defaulting to a box.
honeycomb.ui.resourceGlyphArray = [
	{ index: "gold", glyph: "coin", color: "#e8c86a" },
	{ index: "keys", glyph: "key", color: "#c9b6dd" },
	{ index: "energy", glyph: "drop", color: "#4fc3e8" },
	{ index: "experience", glyph: "star", color: "#c9a961" },
	{ index: "reroll", glyph: "spiral", color: "#9fd8c0" },
	{ index: "banish", glyph: "skull", color: "#d3455f" },
];

honeycomb.ui.resourceIcon = function (resourceIndex, className) {
	var definition = honeycomb.findDefinition(honeycomb.resourceArray, resourceIndex);
	var mapping = honeycomb.findDefinition(honeycomb.ui.resourceGlyphArray, resourceIndex);
	return honeycomb.ui.iconTag(
		definition == null ? null : definition.iconPath,
		mapping == null ? "star" : mapping.glyph,
		mapping == null ? "#efe4cf" : mapping.color,
		{ className: className == null ? "hcResourceIcon" : className, title: definition == null ? resourceIndex : definition.name }
	);
};

//THE ONE RESOURCE-COUNT COMPONENT: rerolls, banishes and anything else that shows "icon and a
//number" render through here, so a later swap to real icons and tooltips is one edit. `options.count`
//overrides the live value (the teambuilding screen previews a run that does not exist yet); `options.label`
//adds a word before the number when the surrounding button has none of its own.
honeycomb.ui.resourceCounter = function (resourceIndex, options) {
	var settings = options == null ? {} : options;
	var definition = honeycomb.findDefinition(honeycomb.resourceArray, resourceIndex);
	var count = settings.count == null ? honeycomb.getResource(resourceIndex) : settings.count;
	var title = settings.title == null ? (definition == null ? resourceIndex : definition.name) : settings.title;
	var className = "hcResourceCounter" + (settings.className == null ? "" : " " + settings.className);
	var markup = '<span class="' + className + '" title="' + honeycomb.escapeAttribute(title) + '">' +
		honeycomb.ui.resourceIcon(resourceIndex, "hcResourceCounterIcon") +
		'<span class="hcResourceValue">' + count + "</span>";
	if (settings.label != null) markup += '<span class="hcResourceCounterLabel">' + honeycomb.escapeText(settings.label) + "</span>";
	markup += "</span>";
	return markup;
};

//---------------------------------------------------------------------------------------------------
//Top bar
//---------------------------------------------------------------------------------------------------
//Shown on every in-run scene. `options.showExit` adds the way back out to the host game.
honeycomb.ui.topBar = function (options) {
	var settings = options == null ? {} : options;
	var run = honeycomb.state == null ? null : honeycomb.state.run;

	var markup = '<div class="hcTopBar">';
	markup += '<div class="hcTopBarDay">' +
		honeycomb.ui.iconTag("icons/ui-day", "flame", "#e8c86a", { className: "hcResourceIcon" }) +
		" Day " + (run == null ? honeycomb.tuning.run.startingDay : run.day) + "</div>";

	markup += '<div class="hcResourceStrip">';
	//Sorted so the bar's order is a property of the resource table, not of iteration order.
	var visibleArray = [];
	for (var resourceIndex = 0; resourceIndex < honeycomb.resourceArray.length; resourceIndex++) {
		if (honeycomb.resourceArray[resourceIndex].showInTopBar != true) continue;
		visibleArray.push(honeycomb.resourceArray[resourceIndex]);
	}
	visibleArray.sort(function (left, right) { return left.sortOrder - right.sortOrder; });

	for (var visibleIndex = 0; visibleIndex < visibleArray.length; visibleIndex++) {
		var resource = visibleArray[visibleIndex];
		markup += '<div class="hcResource" title="' + honeycomb.escapeAttribute(resource.name) + '">' +
			honeycomb.ui.resourceIcon(resource.index) +
			'<span class="hcResourceValue">' + honeycomb.getResource(resource.index) + "</span></div>";
	}
	//Deck size is not a resource but belongs beside them -- and it is the way into the deck screen,
	//which is global rather than living inside any one character's panel.
	if (run != null) {
		markup += '<div class="hcResource hcClickable" title="Open the deck"' +
			' onclick="honeycomb.deckScreen.open(null)">' +
			honeycomb.ui.iconTag("icons/ui-deck", "bag", "#c9b6dd", { className: "hcResourceIcon" }) +
			'<span class="hcResourceValue">' + run.deckArray.length + "</span></div>";
		markup += honeycomb.ui.topBarRelics(run);
	}
	markup += "</div>";

	markup += '<div class="hcTopBarSpacer"></div>';
	if (settings.subtitle != null) {
		markup += '<div class="hcMuted hcSmall hcNoWrap">' + honeycomb.escapeText(settings.subtitle) + "</div>";
	}
	//The whole screen, one tap from anywhere. Only where the browser offers it.
	if (honeycomb.platform.fullscreenAvailable() == true) {
		markup += '<div class="hcButton hcSmall hcFullscreenButton" title="Fullscreen" onclick="honeycomb.platform.toggleFullscreen()">' +
			honeycomb.ui.iconTag(null, "expand", "#efe4cf", { className: "hcInlineIcon" }) + "</div>";
	}
	//THE EVENT GALLERY. The heart the map used to carry, moved: on the map the party icons
	//down the left open the party window, so the heart was free for this instead. It opens
	//the same window as the title screen's Gallery button.
	if (settings.showGallery == true) {
		markup += '<div class="hcButton hcSmall hcGalleryButton" title="Gallery"' +
			' onclick="honeycomb.gallery.open()">' +
			honeycomb.ui.iconTag(null, "heart", "#ff5fd2", { className: "hcInlineIcon" }) + "</div>";
	}
	//THE PARTY WINDOW: in battle, where a run exists and the party is spread across a
	//battlefield rather than standing in a rail. The map dropped this button -- its party
	//portraits open the window themselves, which is one press rather than two. A heart, since what is
	//being inspected is a party. While somebody is Broken the button wears an alert badge and explains
	//itself on hover.
	if (settings.showParty == true) {
		var anyBroken = false;
		if (run != null && run.partyArray != null) {
			for (var brokenScan = 0; brokenScan < run.partyArray.length; brokenScan++) {
				if (run.partyArray[brokenScan].broken == true) anyBroken = true;
			}
		}
		markup += '<div class="hcButton hcSmall hcPartyButton' + (anyBroken ? " hcPartyAlert" : "") +
			'" title="Your party" onclick="honeycomb.partyWindow.open()"' +
			(anyBroken ? honeycomb.tooltip.attributes("partyAlert", "broken") : "") + ">" +
			honeycomb.ui.iconTag(null, "heart", "#ff5fd2", { className: "hcInlineIcon" }) +
			(anyBroken ? '<span class="hcAlertBadge">!</span>' : "") + "</div>";
	}
	//Debug shortcuts, drawn by the debug table itself; nothing with the debug switch off.
	if (honeycomb.debug != null && honeycomb.debug.shortcutMarkup != null) markup += honeycomb.debug.shortcutMarkup("topBar");
	if (settings.showExit != false) {
		//Opens the system menu rather than a quit prompt. The menu is the guaranteed escape route from
		//every screen, including one that has otherwise stopped accepting input.
		markup += '<div class="hcButton hcSmall" onclick="honeycomb.overlay.open(\'systemMenu\')">Menu</div>';
	}
	markup += "</div>";
	return markup;
};

//The party's relics, after the deck: their icons, up to tuning's limit and then "…". The WHOLE strip is
//one button that opens the relic window -- a tap target the size of the strip, not of one icon, which
//is what makes it usable on a phone. Each icon still explains itself on hover.
honeycomb.ui.topBarRelics = function (run) {
	if (run == null || run.relicArray.length === 0) return "";
	var shown = honeycomb.tuning.ui.topBarRelicsShown;
	var markup = '<div class="hcResource hcClickable hcTopBarRelics" title="Relics" onclick="honeycomb.overlay.open(\'relics\')">';
	for (var relicIndex = 0; relicIndex < run.relicArray.length && relicIndex < shown; relicIndex++) {
		var relic = honeycomb.findDefinition(honeycomb.relicArray, run.relicArray[relicIndex].index);
		if (relic == null) continue;
		markup += '<span class="hcTopBarRelic"' + honeycomb.tooltip.attributes("relic", relic.index) + ">" +
			honeycomb.ui.iconTag(relic.iconPath, "shard", "#c9a961", { className: "hcResourceIcon" }) + "</span>";
	}
	if (run.relicArray.length > shown) markup += '<span class="hcTopBarRelicMore">…</span>';
	markup += "</div>";
	return markup;
};

//Every piece of worn equipment in the party, as relic rows, each saying who is wearing it.
//
//WHY THIS IS IN THE RELIC WINDOW. The three starting relics became heirloom EQUIPMENT, so nothing a
//party starts a run with is in `run.relicArray` and the relic window would open empty on turn one. The gear is still worn
//and still working; it was only ever findable by opening the party window and then a character. Read
//from the run's party, so the benched roster is not listed.
honeycomb.equipmentRowMarkup = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.partyArray == null) return "";
	var markup = "";
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		var definition = honeycomb.findDefinition(honeycomb.characterArray, member.characterIndex);
		var equipmentArray = member.equipmentArray == null ? [] : member.equipmentArray;
		for (var wornIndex = 0; wornIndex < equipmentArray.length; wornIndex++) {
			var equipment = honeycomb.findDefinition(honeycomb.equipmentArray, equipmentArray[wornIndex]);
			if (equipment == null) continue;
			markup += '<div class="hcRelicRow">' +
				honeycomb.ui.itemPlate(equipment.iconPath, "shield", honeycomb.teambuilding.rarityColor(equipment)) +
				'<div class="hcGrow"><div class="hcGold">' + honeycomb.escapeText(equipment.name) +
				(equipment.rarity == null ? "" : ' <span class="hcTiny hcDim">' + honeycomb.escapeText(equipment.rarity) + "</span>") +
				(definition == null ? "" : ' <span class="hcTiny hcMuted">worn by ' + honeycomb.escapeText(definition.name) + "</span>") +
				"</div>" +
				'<div class="hcTiny hcMuted">' + honeycomb.escapeText(equipment.description) + "</div></div></div>";
		}
	}
	return markup;
};

//The relic window: every relic the party carries, named and explained. The deck screen's shape.
honeycomb.overlay.register({
	index: "relics",
	closeOnBackdrop: true,
	build: function (layer) {
		var run = honeycomb.state.run;
		var markup = '<div class="hcOverlayPanel hcRelicPanel">';
		markup += '<h2 class="hcOverlayTitle">Relics</h2>';
		var relicArray = run == null ? [] : run.relicArray;
		var equipmentMarkup = honeycomb.equipmentRowMarkup();
		if (relicArray.length === 0) {
			markup += '<div class="hcOverlayBody hcMuted hcCenterText">The party carries no relics yet.</div>';
		} else {
			markup += '<div class="hcRelicList hcScroll">';
			for (var relicIndex = 0; relicIndex < relicArray.length; relicIndex++) {
				var relic = honeycomb.findDefinition(honeycomb.relicArray, relicArray[relicIndex].index);
				if (relic == null) continue;
				markup += '<div class="hcRelicRow">' +
					honeycomb.ui.itemPlate(relic.iconPath, "shard", "#c9a961") +
					'<div class="hcGrow"><div class="hcGold">' + honeycomb.escapeText(relic.name) +
					(relic.rarity == null ? "" : ' <span class="hcTiny hcDim">' + honeycomb.escapeText(relic.rarity) + "</span>") + "</div>" +
					'<div class="hcTiny hcMuted">' + honeycomb.escapeText(relic.description) + "</div></div></div>";
			}
			markup += "</div>";
		}
		if (equipmentMarkup !== "") {
			markup += '<h2 class="hcOverlayTitle">Equipment</h2>';
			markup += '<div class="hcRelicList hcScroll">' + equipmentMarkup + "</div>";
		}
		markup += '<div class="hcOverlayButtonRow"><div class="hcButton hcPrimary" onclick="honeycomb.overlay.close(\'relics\')">Close</div></div>';
		markup += "</div>";
		layer.innerHTML = markup;
	},
});

//---------------------------------------------------------------------------------------------------
//The party window
//---------------------------------------------------------------------------------------------------
//
//READ-ONLY by design. The weakness rows carry the plain tooltip key (no "/sheet"), so seeing one never
//clears a notification and never draws an Event Ready! button; nothing here writes state. The cards are
//the run deck's, filtered to their owner, so it shows what the character actually brought.
honeycomb.partyWindow = { inspectedCharacterIndex: null };

honeycomb.overlay.register({
	index: "party",
	closeOnBackdrop: true,
	build: function (layer) {
		layer.innerHTML = honeycomb.partyWindow.render();
	},
});

//`characterIndex` opens the window already reading that member -- which is what the map's party
//portraits pass, so pressing a face goes straight to that face rather than to the front of the party
//Opened with nothing, it reads the front of the party as it always did.
honeycomb.partyWindow.open = function (characterIndex) {
	honeycomb.partyWindow.inspectedCharacterIndex = characterIndex == null ? null : characterIndex;
	honeycomb.platform.sound("uiClick");
	honeycomb.overlay.open("party", {});
};

honeycomb.partyWindow.repaint = function () {
	for (var scanIndex = honeycomb.overlay.openArray.length - 1; scanIndex >= 0; scanIndex--) {
		if (honeycomb.overlay.openArray[scanIndex].index != "party") continue;
		honeycomb.overlay.openArray[scanIndex].element.innerHTML = honeycomb.partyWindow.render();
		return;
	}
};

honeycomb.partyWindow.inspect = function (characterIndex) {
	honeycomb.partyWindow.inspectedCharacterIndex = characterIndex;
	honeycomb.platform.sound("uiClick");
	honeycomb.partyWindow.repaint();
};

//The live party member for a character, or null when they are not on the road.
honeycomb.partyWindow.memberFor = function (characterIndex) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return null;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		if (run.partyArray[memberIndex].characterIndex == characterIndex) return run.partyArray[memberIndex];
	}
	return null;
};

honeycomb.partyWindow.render = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var close = '<div class="hcOverlayButtonRow"><div class="hcButton hcPrimary" onclick="honeycomb.overlay.close(\'party\')">Close</div></div>';
	var markup = '<div class="hcOverlayPanel hcPartyPanel">';
	markup += '<h2 class="hcOverlayTitle">Party</h2>';
	if (run == null || run.partyArray.length === 0) {
		markup += '<div class="hcOverlayBody hcMuted hcCenterText">Nobody is on the road.</div>' + close + "</div>";
		return markup;
	}

	//The member being read: the last one clicked, or the front of the party.
	var inspectedIndex = honeycomb.partyWindow.inspectedCharacterIndex;
	if (inspectedIndex == null || honeycomb.partyWindow.memberFor(inspectedIndex) == null) {
		inspectedIndex = run.partyArray[0].characterIndex;
	}

	markup += '<div class="hcPartyWindowBody">';
	//THE LIST: everyone on the road, in party order.
	markup += '<div class="hcPartyWindowList hcScroll">';
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		var definition = honeycomb.findDefinition(honeycomb.characterArray, member.characterIndex);
		if (definition == null) continue;
		markup += '<div class="hcPartyWindowEntry' + (member.characterIndex == inspectedIndex ? " hcInspected" : "") + '"' +
			' style="--hcAccent:' + definition.colorHint + '"' +
			' data-hcCharacter="' + honeycomb.escapeAttribute(member.characterIndex) + '"' +
			' onclick="honeycomb.partyWindow.inspect(\'' + honeycomb.escapeAttribute(member.characterIndex) + '\')">';
		markup += honeycomb.ui.portrait(
			{ characterIndex: member.characterIndex, outfitIndex: member.outfitIndex, downed: member.downed == true },
			{ selected: member.characterIndex == inspectedIndex });
		markup += '<div class="hcGrow"><div class="hcPartyWindowName">' + honeycomb.escapeText(definition.name) + "</div>" +
			'<div class="hcTiny hcRosterClass">' +
			honeycomb.ui.iconTag(definition.classIconPath, "star", definition.colorHint, { className: "hcInlineIcon" }) +
			" " + honeycomb.escapeText(definition.className) + "</div>" +
			'<div class="hcTiny hcMuted">' + member.health + " / " + member.maxHealth + " HP" +
			(member.broken == true ? ' <span class="hcPartyBrokenTag">BROKEN</span>' : "") + "</div></div>";
		markup += "</div>";
	}
	markup += "</div>";

	//THE DETAIL: the selected member, read the way the teambuilding sheet reads them.
	markup += '<div class="hcPartyWindowDetail hcScroll">';
	markup += honeycomb.partyWindow.renderDetail(inspectedIndex);
	markup += "</div>";
	markup += "</div>";

	markup += close;
	markup += "</div>";
	return markup;
};

honeycomb.partyWindow.renderDetail = function (characterIndex) {
	var member = honeycomb.partyWindow.memberFor(characterIndex);
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	if (member == null || definition == null) return "";
	var markup = "";

	markup += '<div class="hcDetailHeader">';
	markup += '<div class="hcDetailName">' + honeycomb.escapeText(definition.name) + "</div>";
	markup += '<div class="hcDetailClass">' +
		honeycomb.ui.iconTag(definition.classIconPath, "star", definition.colorHint, { className: "hcInlineIcon" }) +
		" " + honeycomb.escapeText(definition.className) + "</div>";
	markup += "</div>";
	markup += '<div class="hcDetailBlurb">' + honeycomb.escapeText(definition.description) + "</div>";

	//HOW THEY STAND. Health, Temporary
	//HP and Lust in one line, and when they are Broken the way back out in words: outside a fight there
	//is no turn start to recover at, so it is a rest site or an event that soothes.
	markup += '<div class="hcDetailSection"><div class="hcSectionTitle">Condition</div>';
	markup += '<div class="hcTiny hcMuted">' + member.health + " / " + member.maxHealth + " HP" +
		(member.temporaryHealth > 0 ? " (+" + member.temporaryHealth + " Temporary HP)" : "") +
		" &middot; " + (member.lust == null ? 0 : member.lust) + " Lust</div>";
	if (member.broken == true) {
		markup += '<div class="hcTiny hcPartyConditionWarn">Broken. Outside a fight they recover when their ' +
			"health is brought above their Lust -- a rest site, or anything else that heals or soothes will do it.</div>";
	}
	markup += "</div>";

	//THE OUTFIT'S EFFECT: what they are wearing and what it changes.
	var outfit = honeycomb.findOutfit(definition, member.outfitIndex);
	markup += '<div class="hcDetailSection"><div class="hcSectionTitle">Outfit</div>';
	if (outfit == null) {
		markup += '<div class="hcTiny hcDim">No outfit.</div>';
	} else {
		markup += '<div class="hcRelicRow">' +
			honeycomb.ui.iconTag(outfit.iconPath, "bag", definition.colorHint, { className: "hcRelicIcon" }) +
			'<div class="hcGrow"><div class="hcGold">' + honeycomb.escapeText(outfit.name) + "</div>" +
			(outfit.description == null ? "" : '<div class="hcTiny hcMuted">' + honeycomb.outfitDescriptionMarkup(outfit) + "</div>") +
			"</div></div>";
	}
	markup += "</div>";

	//EQUIPMENT: what they carry, named and explained.
	markup += '<div class="hcDetailSection"><div class="hcSectionTitle">Equipment</div>';
	var equipmentArray = member.equipmentArray == null ? [] : member.equipmentArray;
	if (equipmentArray.length === 0) {
		markup += '<div class="hcTiny hcDim">Nothing worn.</div>';
	}
	for (var wornIndex = 0; wornIndex < equipmentArray.length; wornIndex++) {
		var equipment = honeycomb.findDefinition(honeycomb.equipmentArray, equipmentArray[wornIndex]);
		if (equipment == null) continue;
		markup += '<div class="hcRelicRow">' +
			honeycomb.ui.itemPlate(equipment.iconPath, "shield", honeycomb.teambuilding.rarityColor(equipment)) +
			'<div class="hcGrow"><div class="hcGold">' + honeycomb.escapeText(equipment.name) + "</div>" +
			'<div class="hcTiny hcMuted">' + honeycomb.escapeText(equipment.description) + "</div></div></div>";
	}
	markup += "</div>";

	//LUST WEAKNESSES, read-only: seeing one here never clears a notification and cannot start an event.
	markup += honeycomb.teambuilding.buildWeaknessSection(characterIndex, { readOnly: true });

	//THEIR CARDS IN THE RUN DECK, filtered by owner.
	var gathered = honeycomb.deckScreen.entryArray(characterIndex);
	markup += '<div class="hcDetailSection"><div class="hcSectionTitle">Cards in the Deck <span class="hcCountBadge">' +
		gathered.entryArray.length + "</span></div>";
	if (gathered.entryArray.length === 0) {
		markup += '<div class="hcTiny hcDim">No cards of theirs in the deck.</div>';
	} else {
		markup += '<div class="hcDeckGrid">';
		for (var cardIndex = 0; cardIndex < gathered.entryArray.length; cardIndex++) {
			markup += honeycomb.deckScreen.renderCell(gathered.entryArray[cardIndex]);
		}
		markup += "</div>";
	}
	markup += "</div>";

	//EVERY CARD THEY CAN BE OFFERED, found or not, with the rates for the outfit worn NOW.
	markup += '<div class="hcDetailSection"><div class="hcSectionTitle">Obtainable Cards</div>';
	markup += honeycomb.cardCollectionMarkup(characterIndex, { showWeights: true, member: member });
	markup += "</div>";

	return markup;
};

//---------------------------------------------------------------------------------------------------
//A character's obtainable cards
//---------------------------------------------------------------------------------------------------
//The list is every card that names the character, found or not: an unfound card shows as "???", so a
//card the player has never obtained is hidden in effect -- the slot is visible, the card is not.
//The ANNOTATIONS (blocked / reduced / boosted / costume-only) say how the character's outfits bend the
//odds. They are shown in teambuilding and the party window, never in the compendium, which is a pure
//ledger of what has been found. The pure data lives in honeycomb-progression.js (obtainableCardArray,
//cardOfferState), so it is testable headlessly; this half draws it.
//The badge for one state, or "" for "normal". The REASONS live in the row's tooltip (see the `cardOffer`
//kind), not inline: an inline reason line reads as if everything below it were banned.
honeycomb.cardOfferStateBadge = function (state) {
	var stateArray = honeycomb.cardOfferStateArray;
	for (var scanIndex = 0; scanIndex < stateArray.length; scanIndex++) {
		if (stateArray[scanIndex].index != state) continue;
		return '<span class="hcCardStateBadge" style="--hcStateColor:' + stateArray[scanIndex].color + '">' +
			honeycomb.escapeText(stateArray[scanIndex].label) + "</span>";
	}
	return "";
};

honeycomb.cardOfferStateArray = [
	{ index: "blocked", label: "Blocked", color: "#d3455f", description: "The outfit worn now does not offer this card." },
	{ index: "reduced", label: "Reduced", color: "#c9a961", description: "Offered less often in the outfit worn now." },
	{ index: "boosted", label: "Boosted", color: "#63d2a3", description: "Offered more often in the outfit worn now." },
];

//The reasons for each card's offer rate, keyed by card index, read by the `cardOffer` tooltip.
honeycomb.cardOfferTips = {};

//The list, as rows. `options.showWeights` adds the annotations (teambuilding and the party window);
//the compendium leaves them off. `options.member` is the loadout the rates are read for -- the outfit
//worn NOW, never the character's other outfits. `options.knownOnly` hides the unfound slots.
honeycomb.cardCollectionMarkup = function (characterIndex, options) {
	var settings = options == null ? {} : options;
	//A COPY, sorted for reading. obtainableCardArray answers "which cards" and is used for counting
	//and rolling too; the order is this screen's business, not its.
	var cardArray = honeycomb.obtainableCardArray(characterIndex).slice().sort(honeycomb.compareCardsForReading);
	var markup = '<div class="hcCardList">';
	for (var cardIndex = 0; cardIndex < cardArray.length; cardIndex++) {
		var card = cardArray[cardIndex];
		var known = honeycomb.discovery == null ? true : honeycomb.discovery.isKnown("card", card.index);
		if (known == false && settings.knownOnly == true) continue;
		//The row is the card's tooltip, plus the reason for its rate when weights are shown.
		var tipKind = known && settings.showWeights == true ? "cardOffer" : "card";
		markup += '<div class="hcCollectibleRow">';
		markup += '<div class="hcCardListRow"' + (known ? honeycomb.tooltip.attributes(tipKind, card.index) : "") + ">";
		if (known) {
			markup += honeycomb.ui.cardTypeIcon(card, "hcInlineIcon");
			markup += '<span class="hcGrow">' + honeycomb.escapeText(card.name) + "</span>";
			if (settings.showWeights == true) {
				var info = honeycomb.cardOfferStateInfo(characterIndex, card, settings.member);
				honeycomb.cardOfferTips[card.index] = { state: info.state, reasonArray: info.reasonArray };
				markup += honeycomb.cardOfferStateBadge(info.state);
			}
		} else {
			markup += honeycomb.ui.iconTag(null, "question", "#4b3d5c", { className: "hcInlineIcon" });
			markup += '<span class="hcGrow hcDim">???</span>';
		}
		markup += "</div></div>";
		//THE BROKEN FORM BESIDE THE REAL ONE. A character can have multiple potential broken
		//cards, so the pairing is shown card by card. Off unless asked for; the
		//Compendium's toggle turns it on. A card not yet found shows nothing extra, so the ledger is
		//not spoiled.
		if (settings.showBroken == true && known) {
			var brokenIndex = honeycomb.brokenFormIndexFor(card);
			if (brokenIndex != null) {
				var brokenCard = honeycomb.findDefinition(honeycomb.cardArray, brokenIndex);
				markup += '<div class="hcCollectibleRow hcBrokenFormRow"><div class="hcCardListRow hcDim"' +
					honeycomb.tooltip.attributes("card", brokenIndex) + ">" +
					honeycomb.ui.iconTag(null, "heart", "#ff3b6b", { className: "hcInlineIcon" }) +
					'<span class="hcGrow">' + honeycomb.escapeText(brokenCard == null ? brokenIndex : brokenCard.name) + "</span>" +
					'<span class="hcTiny hcMuted">' + honeycomb.escapeText("broken form") + "</span></div></div>";
			}
		}
	}
	markup += "</div>";
	return markup;
};

//The window the outfits list's button opens: one character's whole card collection, for the outfit worn
//NOW (the loadout is captured when it opens).
honeycomb.characterCards = { characterIndex: null, member: null };

honeycomb.overlay.register({
	index: "characterCards",
	closeOnBackdrop: true,
	build: function (layer) {
		var definition = honeycomb.findDefinition(honeycomb.characterArray, honeycomb.characterCards.characterIndex);
		var outfit = definition == null ? null : honeycomb.findOutfit(definition, honeycomb.characterCards.member == null ? null : honeycomb.characterCards.member.outfitIndex);
		var markup = '<div class="hcOverlayPanel hcCharacterCardsPanel">';
		markup += '<h2 class="hcOverlayTitle">' + honeycomb.escapeText(definition == null ? "Cards" : definition.name + "'s Cards") + "</h2>";
		markup += '<div class="hcOverlayBody hcTiny hcMuted">Every card they can be offered, found or not. Rates are for ' +
			honeycomb.escapeText(outfit == null ? "the outfit worn now" : outfit.name) + ".</div>";
		markup += '<div class="hcScroll">' + honeycomb.cardCollectionMarkup(honeycomb.characterCards.characterIndex,
			{ showWeights: true, member: honeycomb.characterCards.member }) + "</div>";
		markup += '<div class="hcOverlayButtonRow"><div class="hcButton hcPrimary" onclick="honeycomb.overlay.close(\'characterCards\')">Close</div></div>';
		markup += "</div>";
		layer.innerHTML = markup;
	},
});

honeycomb.characterCards.open = function (characterIndex, member) {
	honeycomb.characterCards.characterIndex = characterIndex;
	honeycomb.characterCards.member = member == null ? null : member;
	honeycomb.platform.sound("uiClick");
	honeycomb.overlay.open("characterCards", {});
};

//---------------------------------------------------------------------------------------------------
//The nameplate reading
//---------------------------------------------------------------------------------------------------
//
//Everything on a fighter's plate that MOVES with health, lust and temporary HP, as one `.hcVitals` block:
//the class medallion, the bar in its frame, the tab under it, the floating numbers and the shatter. One
//block so honeycomb.combatScene.updateVitals can redraw all of it in a single replacement. The circles
//under the bar and the ability menu belong to the plate around it (combatScene.renderNameplate).
//
//The shapes are SVG files (tuning.art.nameplate) and the stylesheet lays them out; WHAT the bar draws is
//honeycomb.vitalsShareArray's answer, so nothing here decides a length. There are no numbers on the bar
//beyond "68/68", the lust count and the temporary "+N": what is about to change, and why, is the
//nameplate tooltip's job.
//
//`options`:
//  showIdentity      draw the medallion (a plate does; nothing else draws this block today)
//  showForecast      false to ignore the forecast
//  trailFromPercent  where health stood a moment ago, for the drain
//  medallionAction   inline handler for pressing the medallion; absent means it is not a button
//  medallionReady    an ability can be used: the medallion glows
//  medallionOpen     the ability menu is open
honeycomb.ui.vitals = function (entity, options) {
	var settings = options == null ? {} : options;
	if (entity == null) return "";
	var mark = honeycomb.forecast == null || settings.showForecast == false
		? null : honeycomb.forecast.markFor(entity.instanceId);
	var reading = honeycomb.vitalsShareArray(entity, mark);

	var classList = "hcVitals";
	if (reading.broken) classList += " hcVitalsBroken";
	if (reading.overfull) classList += " hcVitalsOverfull";
	//A BROKEN FIGHTER SHATTERS ON LUST, NOT ON TEMPORARY HP: the same
	//shatter, recoloured pink by the stylesheet, once lust runs past maximum health.
	if (reading.lustOverfull) classList += " hcVitalsLustOverfull";
	var markup = '<div class="' + classList + '" data-hcVitalsFor="' + honeycomb.escapeAttribute(entity.instanceId) + '">';

	if (settings.showIdentity == true) markup += honeycomb.ui.plateMedallion(entity, reading, settings);

	//THE BAR AND ITS TAB share one panel: hovering or tapping either explains the whole reading.
	var tip = honeycomb.tooltip.attributes("nameplate", entity.instanceId);
	markup += '<div class="hcPlateBar"' + tip + '><div class="hcPlateFrame"></div><div class="hcPlateTint"></div>';
	markup += '<div class="hcPlateTrack">' + honeycomb.ui.plateTrack(reading, mark, settings.trailFromPercent) +
		'<div class="hcPlateTrackShade"></div></div></div>';
	markup += '<div class="hcPlateTab"' + tip + '><div class="hcPlateTint"></div><span class="hcPlateTabText">' +
		(reading.broken ? "BROKEN!" : Math.max(0, entity.health) + "/" + entity.maxHealth) + "</span></div>";

	//THE FLOATING NUMBERS, never while broken: broken-mode numeric info comes from the tooltip instead.
	if (reading.broken == false && reading.usesLust && reading.lustTotal > 0) {
		var shareStyle = ' style="--hcPlateShare:' + reading.lustShare.toFixed(4) + '"';
		markup += '<div class="hcPlateLustTick"' + shareStyle + "></div>";
		markup += '<div class="hcPlateLustLabel"' + shareStyle + ">" +
			honeycomb.ui.iconTag(honeycomb.tuning.art.nameplate.lustIconPath, "heart", "#ff78c8",
				{ className: "hcPlateLustIcon hcPlateHeart" }) + reading.lustTotal + "</div>";
	}
	if (reading.broken == false && reading.temporaryTotal > 0) {
		markup += '<div class="hcPlateTemporaryLabel">+' + reading.temporaryTotal + "</div>";
	}
	if (reading.overfull || reading.lustOverfull) markup += honeycomb.ui.plateShatter(entity.instanceId);
	return markup + "</div>";
};

//ONE WEAKNESS AS A RAIL: the whole climb from nothing to the last rank, with every
//threshold notched at its real position (tuning.lust.exposureRankArray), filled to `entry.exposure`.
//Drawn on the teambuilding character sheet and over a fighter while a Lewd card
//is read. `entry` needs {exposure}; `exposureAfter` on it adds the stretch a pending hit would fill, and
//a notch that stretch would cross is marked as about to be reached.
honeycomb.ui.weaknessRail = function (entry, options) {
	var settings = options == null ? {} : options;
	var rankArray = honeycomb.tuning.lust.exposureRankArray;
	var ceiling = rankArray.length === 0 ? 1 : rankArray[rankArray.length - 1].atOrAbove;
	var share = function (value) { return Math.max(0, Math.min(1, value / ceiling)); };
	var after = entry.exposureAfter == null ? entry.exposure : Math.max(entry.exposure, entry.exposureAfter);

	var markup = '<div class="hcWeaknessTrack' + (settings.className == null ? "" : " " + settings.className) + '">';
	markup += '<div class="hcWeaknessFill" style="width:' + (share(entry.exposure) * 100).toFixed(1) + '%"></div>';
	if (after > entry.exposure) {
		markup += '<div class="hcWeaknessPending" style="left:' + (share(entry.exposure) * 100).toFixed(1) + "%;width:" +
			((share(after) - share(entry.exposure)) * 100).toFixed(1) + '%"></div>';
	}
	for (var rankIndex = 0; rankIndex < rankArray.length; rankIndex++) {
		var rank = rankArray[rankIndex];
		var reached = entry.exposure >= rank.atOrAbove;
		var reaching = reached == false && after >= rank.atOrAbove;
		markup += '<div class="hcWeaknessStep' + (reached ? " hcReached" : "") + (reaching ? " hcReaching" : "") +
			'" style="left:' + (rank.atOrAbove / ceiling * 100).toFixed(1) + '%"' +
			(settings.tooltips == false ? "" : honeycomb.tooltip.attributes("weaknessRank", String(rank.rank))) + "></div>";
	}
	return markup + "</div>";
};

//The segments inside the track, in paint order: the trail under health, then gold, lust over both, and
//the forecast marks on top so a pending loss is never hidden under the pink.
honeycomb.ui.plateTrack = function (reading, mark, trailFromPercent) {
	var segment = function (span, className, extra) {
		if (span == null) return "";
		return '<div class="hcPlateSegment ' + className + '" style="left:' + (span.from * 100).toFixed(2) +
			"%;width:" + ((span.to - span.from) * 100).toFixed(2) + '%"' + (extra == null ? "" : extra) + "></div>";
	};
	if (reading.broken) {
		return segment(reading.lust, "hcPlateLust") + segment(reading.gap, "hcPlateGap") +
			segment(reading.recovering, "hcPlateRecovering");
	}
	var healthPercent = reading.health == null ? 0 : reading.health.to * 100;
	var markup = "";
	//The drain: the trail and the fill both start at the left edge, so updateVitals can read and move
	//their widths as plain percentages.
	var trailPercent = trailFromPercent == null ? healthPercent : trailFromPercent;
	markup += '<div class="hcPlateSegment hcHealthTrail" style="left:0;width:' + trailPercent.toFixed(2) + '%"></div>';
	markup += '<div class="hcPlateSegment hcHealthFill" style="left:0;width:' + healthPercent.toFixed(2) + '%"></div>';
	markup += segment(reading.temporary, "hcPlateTemporary") + segment(reading.temporaryPending, "hcPlateTemporaryPending");
	markup += segment(reading.lust, "hcPlateLust") + segment(reading.lustPending, "hcPlateLustPending");
	markup += segment(reading.potential, "hcPlatePotential");
	markup += segment(reading.loss, "hcPlateLoss" + (mark != null && mark.lethal == true ? " hcLethal" : ""));
	markup += segment(reading.heal, "hcPlateHeal");
	if (reading.loss != null) {
		markup += '<div class="hcPlateLossEdge" style="left:' + (reading.loss.from * 100).toFixed(2) + '%"></div>';
	}
	return markup;
};

//THE CLASS MEDALLION: the character's own class icon in the ring, or a pink heart once they are Broken.
//It glows and opens a drop-down list of the character's abilities, and names itself on hover, so the
//plate needs no name.
honeycomb.ui.plateMedallion = function (entity, reading, settings) {
	var found = honeycomb.entityDefinition == null ? null : honeycomb.entityDefinition(entity);
	var tuning = honeycomb.tuning.art.nameplate;
	var definition = found == null ? null : found.definition;
	var accent = definition == null || definition.colorHint == null ? "#c9a961" : definition.colorHint;
	var icon = reading.broken
		? honeycomb.ui.iconTag(tuning.brokenIconPath, "heart", "#ff78c8", { className: "hcPlateMedallionIcon hcPlateHeart" })
		: honeycomb.ui.iconTag(definition == null ? null : definition.classIconPath,
			found != null && found.kind == "character" ? tuning.characterGlyph : tuning.enemyGlyph,
			accent, { className: "hcPlateMedallionIcon" });
	var classList = "hcPlateMedallion";
	if (reading.broken == false && settings.medallionReady == true) classList += " hcReady";
	if (settings.medallionOpen == true) classList += " hcOpen";
	var title = definition == null ? "" : definition.name + (definition.className == null ? "" : " — " + definition.className);
	return '<div class="' + classList + '" title="' + honeycomb.escapeAttribute(title) + '"' +
		(settings.medallionAction == null ? "" : ' onclick="' + settings.medallionAction + '"') + ">" +
		icon + '<div class="hcPlateTint"></div></div>';
};

//The crack on the break, every lightning frame (one shown at a time -- see ensureBoltKeyframes), and the chips.
//Each chip carries its own flight as custom properties, so one keyframe serves every one of them; its
//loop goes through honeycomb.duration so the slow play speeds slow it too.
honeycomb.ui.plateShatter = function (entityId) {
	var tuning = honeycomb.tuning.art.nameplate;
	var markup = '<img class="hcPlateCrack" src="' + honeycomb.image(tuning.crackPath) + '" alt="" aria-hidden="true">';
	var sequenceLength = honeycomb.ui.ensureBoltKeyframes();
	var frameMs = Math.max(1, Math.round(honeycomb.duration(tuning.boltFrameMs)));
	var phase = honeycomb.ui.hashText(entityId, 0) % Math.max(1, sequenceLength);
	markup += '<div class="hcPlateBolts" aria-hidden="true" style="' +
		"--hcBoltLoop:" + (frameMs * sequenceLength) + "ms;--hcBoltDelay:" + (-frameMs * phase) + 'ms">';
	for (var frameIndex = 0; frameIndex < tuning.boltFrameArray.length; frameIndex++) {
		markup += '<img class="hcPlateBolt" src="' + honeycomb.image(tuning.boltFrameArray[frameIndex]) +
			'" alt="" style="--hcBoltFrame:' + honeycomb.ui.boltKeyframeName(frameIndex) + '">';
	}
	markup += "</div>";
	for (var chipIndex = 0; chipIndex < tuning.chipArray.length; chipIndex++) {
		var chip = tuning.chipArray[chipIndex];
		markup += '<img class="hcPlateChip" src="' + honeycomb.image(chip.path) + '" alt="" aria-hidden="true" style="' +
			"--hcChipWidth:" + chip.widthUnits + ";--hcChipHeight:" + chip.heightUnits + ";" +
			"--hcChipDriftX:" + chip.driftXUnits + ";--hcChipDriftY:" + chip.driftYUnits + ";" +
			"--hcChipSpin:" + chip.spinDegrees + "deg;" +
			"--hcChipLife:" + Math.round(honeycomb.duration(chip.lifeMs)) + "ms;" +
			"--hcChipDelay:" + Math.round(honeycomb.duration(chip.delayMs)) + 'ms">';
	}
	return markup;
};

//THE CRACKLE. Every tick the lightning swaps to one of its OTHER frames, chosen by a hash of the tick: it
//looks random and never repeats a frame, but it is not Math.random and it is not an RNG stream, so nothing
//the game saves or replays can be moved by how often a screen repaints.
//The order is baked ONCE into one @keyframes per frame (opacity 1 on the ticks it shows, 0 otherwise),
//looping every boltSequenceLength ticks, and each plate enters the loop at its own hashed phase. An
//opacity animation runs on the compositor: the main thread and the painter never hear about it. The
//timer this replaced swapped a class every 90ms, and each swap repainted the plate and the
//drop-shadowed fighter art under it -- on a phone, a dropped frame roughly every tick, all turn long.
honeycomb.ui.boltKeyframeName = function (frameIndex) {
	return "hcPlateBoltFrame" + frameIndex;
};

//The frame shown on each tick of the loop. The seam counts as a tick too, so the last entry is never the
//first one's frame. Pure, so the headless tests can read it.
honeycomb.ui.boltSequence = function () {
	var tuning = honeycomb.tuning.art.nameplate;
	var frameCount = tuning.boltFrameArray.length;
	var sequenceLength = Math.max(1, tuning.boltSequenceLength);
	var sequence = [0];
	for (var tick = 1; tick < sequenceLength; tick++) {
		var previous = sequence[tick - 1];
		if (frameCount < 2) { sequence.push(0); continue; }
		var step = 1 + honeycomb.ui.hashText("bolt", tick) % (frameCount - 1);
		var frame = (previous + step) % frameCount;
		//The last tick also borders the first; walk on to a frame unlike both when one exists.
		if (tick === sequenceLength - 1 && frame === sequence[0]) {
			for (var offset = 1; offset < frameCount; offset++) {
				var candidate = (previous + offset) % frameCount;
				if (candidate !== previous && candidate !== sequence[0]) { frame = candidate; break; }
			}
		}
		sequence.push(frame);
	}
	return sequence;
};

//Writes the keyframes into the document once and returns the loop's length in ticks.
honeycomb.ui.ensureBoltKeyframes = function () {
	var sequence = honeycomb.ui.boltSequence();
	if (typeof document === "undefined" || document.head == null) return sequence.length;
	if (document.getElementById("honeycombBoltKeyframes") != null) return sequence.length;
	var frameCount = honeycomb.tuning.art.nameplate.boltFrameArray.length;
	var text = "";
	for (var frameIndex = 0; frameIndex < frameCount; frameIndex++) {
		text += "@keyframes " + honeycomb.ui.boltKeyframeName(frameIndex) + " {";
		for (var tick = 0; tick < sequence.length; tick++) {
			text += " " + ((tick / sequence.length) * 100).toFixed(4) + "% { opacity: " + (sequence[tick] === frameIndex ? 1 : 0) + "; }";
		}
		text += " 100% { opacity: " + (sequence[0] === frameIndex ? 1 : 0) + "; } }\n";
	}
	var style = document.createElement("style");
	style.id = "honeycombBoltKeyframes";
	style.textContent = text;
	document.head.appendChild(style);
	return sequence.length;
};

//A small integer hash of a string and a number (FNV-1a, then one avalanche step). Presentation only.
honeycomb.ui.hashText = function (text, number) {
	var hash = 2166136261;
	var source = String(text == null ? "" : text) + ":" + number;
	for (var charIndex = 0; charIndex < source.length; charIndex++) {
		hash ^= source.charCodeAt(charIndex);
		hash = Math.imul(hash, 16777619);
	}
	hash ^= hash >>> 13;
	hash = Math.imul(hash, 1274126177);
	return (hash ^ (hash >>> 16)) >>> 0;
};

//THE CIRCLES UNDER THE BAR: the character's mechanic first, then every status. They wrap rather than
//extend to the right indefinitely.
honeycomb.ui.plateCircleRow = function (entity, combat) {
	return '<div class="hcPlateCircles">' + honeycomb.ui.mechanicWidget(entity, combat) +
		honeycomb.ui.statusCircles(entity) + "</div>";
};

//Just the status circles, so a status beat can redraw them without moving the mechanic ahead of its own
//log entry (updateVitals replaces these and leaves the mechanic where it stands).
honeycomb.ui.statusCircles = function (entity) {
	if (entity == null || entity.statusArray == null) return "";
	var markup = "";
	for (var statusIndex = 0; statusIndex < entity.statusArray.length; statusIndex++) {
		var held = entity.statusArray[statusIndex];
		var definition = honeycomb.findDefinition(honeycomb.statusArray, held.index);
		if (definition == null) continue;
		//A CLEAR POLE, the same reading the chips use.
		var polarity = honeycomb.statusPolarity(definition);
		markup += '<div class="hcPlateCircle hcStatusCircle ' + (polarity < 0 ? "hcDebuff" : polarity > 0 ? "hcBuff" : "hcNeutral") + '"' +
			' data-hcStatus="' + honeycomb.escapeAttribute(held.index) + '"' +
			honeycomb.tooltip.attributes("status", held.index, { stacks: held.stacks }) + ">" +
			honeycomb.ui.iconTag(definition.iconPath, honeycomb.ui.statusGlyph(definition.index),
				definition.colorHint, { className: "hcPlateCircleIcon" }) +
			'<span class="hcPlateCircleCount">' + held.stacks + "</span></div>";
	}
	return markup;
};

//---------------------------------------------------------------------------------------------------
//Character mechanic widgets, in circles
//---------------------------------------------------------------------------------------------------
//So there are three builders, one per `kind`, and a character's mechanic picks one. Each draws INSIDE
//the plate's circle: the meter as a ring that fills, the orbs in a triangle, the orb as its face and a
//count. Anything later -- an outfit-specific widget, a boss's own meter -- is a fourth entry here plus a
//kind on the definition; nothing about the nameplate itself has to change.
honeycomb.ui.mechanicWidgetArray = [
	{
		//A METER: a ring filling clockwise in the mechanic's colour, with the value in the middle.
		index: "bar",
		build: function (entity, definition) {
			var value = honeycomb.mechanicValue(entity, definition.index);
			var maximum = definition.maximum == null ? 1 : definition.maximum;
			return '<div class="hcMechanicGauge" style="--hcMechanicShare:' + (Math.min(1, value / maximum) * 100).toFixed(1) + '%"></div>' +
				'<span class="hcPlateCircleCount">' + value + "</span>";
		},
	},
	{
		//THREE ORBS THAT TURN RED AS CONDITIONS ARE MET. Each is asked for itself, and each explains
		//itself on hover, so an unlit orb tells the player what would light it.
		index: "orbs",
		build: function (entity, definition, combat) {
			var stateArray = honeycomb.mechanicOrbStateArray(entity, combat);
			var markup = '<div class="hcMechanicOrbs">';
			for (var scanIndex = 0; scanIndex < stateArray.length; scanIndex++) {
				var state = stateArray[scanIndex];
				markup += '<div class="hcMechanicOrb' + (state.lit ? " hcLit" : "") + '"' +
					honeycomb.tooltip.attributes("mechanicOrb", definition.index + "/" + state.orb.index) + "></div>";
			}
			return markup + "</div>";
		},
	},
	{
		//SLOTS AS A PIE (Cassadora's Orb): one wedge per slot, each filled in its symbol's card-type colour,
		//empty slots dark, which can look like a plain pie chart if there is too little room to fit symbols in.
		index: "slots",
		build: function (entity, definition) {
			var symbolArray = honeycomb.mechanicSymbolArray(entity, definition.index);
			var slotCount = definition.maximum == null ? Math.max(1, symbolArray.length) : definition.maximum;
			var stopArray = [];
			for (var slotIndex = 0; slotIndex < slotCount; slotIndex++) {
				var type = slotIndex < symbolArray.length ? honeycomb.cardType(symbolArray[slotIndex]) : null;
				var color = type == null || type.color == null ? "var(--hcMechanicSlotEmpty)" : type.color;
				stopArray.push(color + " " + (slotIndex / slotCount * 100).toFixed(2) + "% " + ((slotIndex + 1) / slotCount * 100).toFixed(2) + "%");
			}
			return '<div class="hcMechanicPie" style="background:conic-gradient(' + stopArray.join(", ") + ');--hcMechanicSlotAngle:' +
				(360 / slotCount).toFixed(2) + 'deg"></div>';
		},
	},
	{
		//AN ORB WITH AN IMAGE INSIDE IT AND ITS COUNT.
		index: "orb",
		build: function (entity, definition) {
			var value = honeycomb.mechanicValue(entity, definition.index);
			return honeycomb.ui.iconTag(definition.iconPath, definition.glyph, definition.colorHint, { className: "hcPlateCircleIcon" }) +
				'<span class="hcPlateCircleCount">' + value + "</span>";
		},
	},
];

//One character's mechanic, drawn in its circle. Empty for anybody without one.
honeycomb.ui.mechanicWidget = function (entity, combat) {
	var definition = honeycomb.mechanicFor(entity);
	if (definition == null) return "";
	var builder = honeycomb.findDefinition(honeycomb.ui.mechanicWidgetArray, definition.kind);
	if (builder == null) return "";
	//THREE SEPARATE BUFF SLOTS FOR A TESTED MECHANIC: Severine's Thirst was one
	//circle holding three tiny orbs, too small to hover one at a time. Each orb is now its own slot in
	//the buff row, with its own tooltip, exactly like a status.
	if (definition.kind == "orbs") {
		var stateArray = honeycomb.mechanicOrbStateArray(entity, combat);
		var slotMarkup = "";
		for (var scanIndex = 0; scanIndex < stateArray.length; scanIndex++) {
			var state = stateArray[scanIndex];
			slotMarkup += '<div class="hcPlateCircle hcMechanic hcMechanicOrbSlot' + (state.lit ? " hcLit" : "") + '"' +
				' data-hcMechanicFor="' + honeycomb.escapeAttribute(entity.instanceId) + '"' +
				' style="--hcMechanicColor:' + definition.colorHint + '"' +
				honeycomb.tooltip.attributes("mechanicOrb", definition.index + "/" + state.orb.index) + "></div>";
		}
		return slotMarkup;
	}
	var holding = definition.kind == "orb" && honeycomb.mechanicValue(entity, definition.index) > 0;
	return '<div class="hcPlateCircle hcMechanic hcMechanic-' + definition.index + " hcMechanicKind-" + definition.kind +
		(holding ? " hcHolding" : "") + '"' +
		' data-hcMechanicFor="' + honeycomb.escapeAttribute(entity.instanceId) + '"' +
		' style="--hcMechanicColor:' + definition.colorHint + '"' +
		//A SLOTS mechanic's tooltip lists what it holds, so the key names whose it is.
		honeycomb.tooltip.attributes("mechanic", definition.kind == "slots" ? definition.index + "/" + entity.instanceId : definition.index) + ">" +
		builder.build(entity, definition, combat) + "</div>";
};

//Temporary HP as it stands plus what a forecast would add, and what survives the enemy turn. Read by the
//nameplate tooltip, which is where these numbers live now.
honeycomb.ui.temporaryTotal = function (entity, mark) {
	var standing = Math.max(0, entity == null || entity.temporaryHealth == null ? 0 : entity.temporaryHealth);
	var gained = mark == null ? 0 : Math.max(0, mark.temporaryGained);
	//WHAT SURVIVES THE ENEMY TURN, when the forecast has an answer: `after` is the gold
	//left at the same moment `healthAfter` describes, and is null when nothing eats into it.
	var after = mark == null || mark.temporaryAfter == null ? null : Math.max(0, mark.temporaryAfter);
	return {
		standing: standing, gained: gained, total: standing + gained,
		after: after !== null && after !== standing + gained ? after : null,
	};
};


//Status chips sit in a fixed-height slot with an absolutely positioned inner holder anchored to its
//bottom edge. The slot reserves the space so layout never moves when a status lands; the holder grows
//UPWARD as chips wrap, so a fighter carrying six statuses stacks them over their own sprite instead of
//pushing the health bar around or overlapping it.
honeycomb.ui.statusRow = function (entity) {
	if (entity == null || entity.statusArray == null || entity.statusArray.length === 0) {
		return '<div class="hcStatusRow"><div class="hcStatusChips"></div></div>';
	}
	var markup = '<div class="hcStatusRow"><div class="hcStatusChips">';
	for (var statusIndex = 0; statusIndex < entity.statusArray.length; statusIndex++) {
		var held = entity.statusArray[statusIndex];
		var definition = honeycomb.findDefinition(honeycomb.statusArray, held.index);
		if (definition == null) continue;
		//A CLEAR POLE: positive and negative wear a marker and a colour; neutral wears
		//neither, which is what "not given a descriptor" means. See honeycomb.statusPolarity.
		var polarity = honeycomb.statusPolarity(definition);
		var chipClass = "hcStatusChip " + (polarity < 0 ? "hcDebuff" : polarity > 0 ? "hcBuff" : "hcNeutral");
		//A rich tooltip rather than a native title: "descriptions of status effects otherwise I can't
		//actually know what's meant to be happening". The stack count rides on the element so one
		//status on two entities shows each one's own.
		markup += '<div class="' + chipClass + '" data-hcStatus="' + honeycomb.escapeAttribute(held.index) + '"' +
			honeycomb.tooltip.attributes("status", held.index, { stacks: held.stacks }) + ">" +
			honeycomb.ui.iconTag(definition.iconPath, honeycomb.ui.statusGlyph(definition.index),
				definition.colorHint, { className: "hcStatusIcon" }) +
			"<span>" + held.stacks + "</span></div>";
	}
	markup += "</div></div>";
	return markup;
};

//Fallback glyph per status, so an undrawn status still reads as itself.
honeycomb.ui.statusGlyphArray = [
	{ index: "strength", glyph: "sword" },
	{ index: "weak", glyph: "chevron" },
	{ index: "sundered", glyph: "shard" },
	{ index: "frail", glyph: "shield" },
	{ index: "poison", glyph: "drop" },
	{ index: "regeneration", glyph: "heart" },
	{ index: "thorns", glyph: "star" },
	{ index: "artifact", glyph: "shard" },
	{ index: "energised", glyph: "flame" },
	{ index: "focus", glyph: "eye" },
];

honeycomb.ui.statusGlyph = function (statusIndex) {
	var mapping = honeycomb.findDefinition(honeycomb.ui.statusGlyphArray, statusIndex);
	return mapping == null ? "star" : mapping.glyph;
};

//---------------------------------------------------------------------------------------------------
//The mini party
//---------------------------------------------------------------------------------------------------
//The whole party in a row -- face, a small bar, and "52 → 60" -- for a change that is not a fight: what
//an event choice WILL do (a forecast) and what it DID (the aftermath). Numbers and bars rather than a
//sentence, so a heal for most of the party and a hit for one of them read at a glance.
//
//`changeArray` is [{member, before, after}]. Members whose health does not move are still drawn, dimmed,
//so the row is always the whole party in party order.
honeycomb.ui.miniPartyRow = function (changeArray, className) {
	if (changeArray == null || changeArray.length === 0) return "";
	var markup = '<div class="hcMiniParty' + (className == null ? "" : " " + className) + '">';
	for (var scanIndex = 0; scanIndex < changeArray.length; scanIndex++) {
		var change = changeArray[scanIndex];
		var member = change.member;
		var maximum = Math.max(1, member.maxHealth);
		var moved = change.after !== change.before;
		var direction = change.after > change.before ? "hcMiniHeal" : "hcMiniHurt";
		markup += '<div class="hcMiniMember' + (moved ? " " + direction : " hcMiniStill") + '">';
		markup += honeycomb.ui.portrait(member, {});
		markup += '<div class="hcMiniBar"><div class="hcMiniFill" style="width:' +
			(Math.min(change.before, change.after) / maximum * 100).toFixed(1) + '%"></div>';
		if (moved) {
			markup += '<div class="hcMiniChange" style="left:' + (Math.min(change.before, change.after) / maximum * 100).toFixed(1) +
				"%;width:" + (Math.abs(change.after - change.before) / maximum * 100).toFixed(1) + '%"></div>';
		}
		markup += "</div>";
		markup += '<div class="hcMiniNumbers">' + (moved ? change.before + " → " + change.after : String(change.after)) + "</div>";
		//Statuses the choice would give: the same chips the battlefield wears, so Regeneration from a
		//bench reads as the Regeneration a card gives.
		if (change.statusArray != null && change.statusArray.length > 0) {
			markup += honeycomb.ui.statusRow({ statusArray: change.statusArray });
		}
		markup += "</div>";
	}
	markup += "</div>";
	return markup;
};

//The party as {member, before, after, statusArray} from a forecast reading, or null when nothing would
//happen to anybody -- no health moving and no status landing.
honeycomb.ui.partyChangeArray = function (reading) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || reading == null) return null;
	var anyMoved = false;
	var result = [];
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		if (member.temporary == true) continue;
		var summary = reading.byEntity[member.instanceId];
		var after = summary == null ? member.health : summary.healthAfter;
		var statusArray = summary == null ? [] : honeycomb.ui.statusChangeArray(summary.statusArray);
		if (after !== member.health || statusArray.length > 0) anyMoved = true;
		result.push({ member: member, before: member.health, after: after, statusArray: statusArray });
	}
	return anyMoved ? result : null;
};

//A reading's status entries folded to one {index, stacks} per status, the stacks being what would be
//GAINED, so the chips read as an offer rather than a total.
honeycomb.ui.statusChangeArray = function (entryArray) {
	var result = [];
	for (var scanIndex = 0; scanIndex < (entryArray == null ? 0 : entryArray.length); scanIndex++) {
		var entry = entryArray[scanIndex];
		var found = null;
		for (var resultIndex = 0; resultIndex < result.length; resultIndex++) {
			if (result[resultIndex].index == entry.index) found = result[resultIndex];
		}
		if (found == null) { found = { index: entry.index, stacks: 0 }; result.push(found); }
		found.stacks += entry.delta == null ? entry.stacks : entry.delta;
	}
	return result;
};

//---------------------------------------------------------------------------------------------------
//The picker
//---------------------------------------------------------------------------------------------------
//Syrup Town's logbook shape: a wall of faces first, then a rail of names beside one page. The bestiary,
//the Compendium's cards page and the Event Gallery all ask "pick a thing, then read it", so they all
//draw this. It lived on honeycomb.compendium and moved here when a second screen
//needed it; honeycomb.compendium.renderPicker is kept as the name its own pages call it by.
//
//  itemArray      [{index, name, group, known, faceMarkup}] -- a group heading is drawn when it changes
//  selectedIndex  null for the wall, an item's index for the rail-and-page
//  plural         what the Back button calls them ("All characters")
//  selectCall     the call an item makes, with %s for its index
//  backCall       the call the Back button makes
//  detailMarkup   the page itself, drawn by the caller
honeycomb.ui.picker = function (options) {
	var itemArray = options.itemArray;
	var selected = options.selectedIndex;

	//STAGE ONE: the wall. Grouped, because "which of these is a boss" is the first thing a reader asks.
	if (selected == null) {
		var markup = '<div class="hcPickerGrid">';
		var lastGroup = null;
		for (var gridIndex = 0; gridIndex < itemArray.length; gridIndex++) {
			var item = itemArray[gridIndex];
			if (item.group != lastGroup) {
				lastGroup = item.group;
				if (item.group != null) markup += '<div class="hcPickerGroup">' + honeycomb.escapeText(item.group) + "</div>";
			}
			markup += '<div class="hcPickerTile' + (item.known ? "" : " hcUnknown") + '"' +
				' onclick="' + honeycomb.escapeAttribute(options.selectCall.replace("%s", item.index)) + '">' +
				'<div class="hcPickerFace">' + (item.known ? item.faceMarkup : '<span class="hcPickerQuestion">?</span>') + "</div>" +
				'<div class="hcPickerLabel">' + honeycomb.escapeText(item.known ? item.name : "???") + "</div></div>";
		}
		markup += "</div>";
		return markup;
	}

	//STAGE TWO: the rail and the page. The rail is names only, so a long roster costs one line each
	//instead of a whole block, and moving between two entries is one click rather than a scroll.
	var paneMarkup = '<div class="hcPickerBack hcButton" onclick="' +
		honeycomb.escapeAttribute(options.backCall) + '">' +
		honeycomb.ui.iconTag(null, "arrows", "#c9b6dd", { className: "hcInlineIcon" }) + " All " +
		honeycomb.escapeText(options.plural) + "</div>";
	paneMarkup += '<div class="hcPickerPanes">';
	paneMarkup += '<div class="hcPickerRail hcScroll">';
	var railGroup = null;
	for (var railIndex = 0; railIndex < itemArray.length; railIndex++) {
		var railItem = itemArray[railIndex];
		if (railItem.group != railGroup) {
			railGroup = railItem.group;
			if (railItem.group != null) paneMarkup += '<div class="hcPickerRailGroup">' + honeycomb.escapeText(railItem.group) + "</div>";
		}
		paneMarkup += '<div class="hcPickerRailRow' + (railItem.index == selected ? " hcOn" : "") +
			(railItem.known ? "" : " hcUnknown") + '"' +
			' onclick="' + honeycomb.escapeAttribute(options.selectCall.replace("%s", railItem.index)) + '">' +
			honeycomb.escapeText(railItem.known ? railItem.name : "???") + "</div>";
	}
	paneMarkup += "</div>";
	paneMarkup += '<div class="hcPickerDetail hcScroll">' + options.detailMarkup + "</div>";
	paneMarkup += "</div>";
	return paneMarkup;
};

//---------------------------------------------------------------------------------------------------
//Portraits
//---------------------------------------------------------------------------------------------------
//A party member's face, with an optional health sliver. `member` is a run party member.
honeycomb.ui.portrait = function (member, options) {
	var settings = options == null ? {} : options;
	var definition = honeycomb.findDefinition(honeycomb.characterArray, member.characterIndex);
	if (definition == null) return "";

	var classList = "hcPortrait";
	if (settings.selected == true) classList += " hcSelected";
	if (member.downed == true) classList += " hcDowned";
	//`alert` marks a face that needs dealing with -- Broken, on the map's party rail. The badge is drawn
	//INSIDE the frame: .hcPortrait clips its overflow, so the top bar's trick of hanging one off the
	//corner would simply not be there.
	if (settings.alert == true) classList += " hcPortraitAlert";

	var markup = '<div class="' + classList + '"' +
		(settings.onClick == null ? "" : ' onclick="' + settings.onClick + '" style="cursor:pointer"') +
		(settings.attributes == null ? "" : settings.attributes) +
		' title="' + honeycomb.escapeAttribute(definition.name + " -- " + definition.className) + '">';
	//The art resolver picks the outfit's portrait and walks its own fallback chain, so a costume with
	//no portrait drawn yet shows the default one rather than a hole.
	markup += honeycomb.art.portraitTag(member.characterIndex, member.outfitIndex, { alt: definition.name });

	if (settings.showHealth == true && member.maxHealth > 0) {
		var fraction = Math.max(0, member.health) / member.maxHealth;
		markup += '<div class="hcPortraitHealth"><div class="hcPortraitHealthFill" style="width:' +
			(fraction * 100).toFixed(1) + '%"></div></div>';
	}
	if (settings.alert == true) markup += '<span class="hcPortraitBadge">!</span>';
	markup += "</div>";
	return markup;
};

//---------------------------------------------------------------------------------------------------
//Cards
//---------------------------------------------------------------------------------------------------
//THE FRAME COPY A CARD SIZE DRAWS: tuning.art.cardFrame.frameSuffixBySize. A size
//with no suffix, or a copy already found missing this session, draws the full frame.
honeycomb.ui.sizedCardFramePath = function (framePath, sizeIndex) {
	var suffixBySize = honeycomb.tuning.art.cardFrame.frameSuffixBySize;
	if (framePath == null || suffixBySize == null || suffixBySize[sizeIndex] == null) return framePath;
	var sizedPath = framePath + suffixBySize[sizeIndex];
	return honeycomb.missingImagePathArray[sizedPath] === true ? framePath : sizedPath;
};

//A sized frame copy that failed to load: remembered as missing, and the full frame drawn instead. The full
//frame failing too gets the ordinary placeholder.
honeycomb.ui.cardFrameFallback = function (element) {
	if (element == null || element.dataset == null) return;
	var sizedPath = element.dataset.hcsizedframe;
	var fullPath = element.dataset.hcfullframe;
	if (sizedPath != null && sizedPath !== fullPath && element.dataset.hcFrameRetried !== "true") {
		element.dataset.hcFrameRetried = "true";
		honeycomb.missingImagePathArray[sizedPath] = true;
		element.dataset.honeycombPath = fullPath;
		element.src = honeycomb.image(fullPath);
		return;
	}
	honeycomb.imageFallback(element);
};

//THE CARD CHROME. The frame is authored as separate back/front rasters (tuning.art.
//cardChrome). A tintable piece is drawn once per supertype: copy 0 is the card's primary type, and each
//extra copy is masked along a 135-degree diagonal so the chrome shades from one type's colour into the
//next. Support, and any type with no bake, keeps the untinted raster. The mask is emitted on the
//WRAPPER span, never the img -- masking a replaced element directly drew hard box edges on the coins.
//A missing bake falls back to the untinted raster, so it is a colour miss and never a hole.
//The owner's class glyph for the winged emblem, from the character's artFolder (knight / priest /
//lancer so far). Null only when the class has no glyph drawn yet -- a class that is simply not
//authored, not a rendering hole.
//
//A PREVIEW CARD HAS NO OWNER INSTANCE: a reward, a shop shelf, the teambuilding deck list and the
//hover tooltip all resolve a card by INDEX, with no member behind it, so the emblem used to sit empty.
//It now falls back to the character the card itself names, so a Brienne card previewed anywhere wears
//the knight glyph. A neutral card names nobody and draws none.
honeycomb.cardClassGlyphPath = function (resolved) {
	var chrome = honeycomb.tuning.art.cardChrome;
	if (chrome == null || chrome.classGlyphPathByArtFolder == null) return null;
	var member = honeycomb.cardOwnerMember(resolved);
	//A PREVIEW CARD may carry a `previewCharacterIndex` (the random starting card names no character
	//itself), then the card's own characterIndex, then the fielded owner -- first one wins.
	var characterIndex = member != null ? member.characterIndex
		: (resolved == null ? null
			: (resolved.previewCharacterIndex != null ? resolved.previewCharacterIndex : resolved.characterIndex));
	if (characterIndex == null) return null;
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	if (definition == null) return null;
	return chrome.classGlyphPathByArtFolder[definition.artFolder] || null;
};

//Whose FACE the owner ring shows: the fielded owner, a preview's named character, or the card's own
//character. Null for a card that names nobody (a neutral card, a curse). This is the teambuilding
//workaround for card ownership -- choosing who gets which common card is a later overhaul.
honeycomb.cardOwnerFaceShare = function (resolved) {
	var member = honeycomb.cardOwnerMember(resolved);
	var characterIndex = member != null ? member.characterIndex
		: (resolved == null ? null
			: (resolved.previewCharacterIndex != null ? resolved.previewCharacterIndex : resolved.characterIndex));
	if (characterIndex == null || characterIndex == "neutral") return null;
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	if (definition == null) return null;
	var outfitIndex = member != null && member.outfitIndex != null ? member.outfitIndex : definition.defaultOutfit;
	return { characterIndex: characterIndex, outfitIndex: outfitIndex, name: definition.name };
};

honeycomb.ui.cardChrome = function (typeArray, reduced, layoutIndex, glyphPath, showRarityGem) {
	var tuning = honeycomb.tuning.art.cardChrome;
	if (tuning == null) return "";
	//Reduced effects drops the blend (the extra layers are the real cost) but keeps the primary colour.
	var types = reduced == true && typeArray.length > 1 ? [typeArray[0]] : typeArray;
	var softness = tuning.blendSoftnessPercent;
	var markup = '<div class="hcCardChromeLayer">';
	for (var pieceIndex = 0; pieceIndex < tuning.pieceArray.length; pieceIndex++) {
		var piece = tuning.pieceArray[pieceIndex];
		//A piece may be horizontal-only (the lower plate), and the frame swaps its raster per layout.
		if (piece.layouts != null && piece.layouts.indexOf(layoutIndex) < 0) continue;
		//The rarity mark is drawn only for a rarity that asks for it (honeycomb.cardShowsRarityGem).
		if (piece.rarityGem == true && showRarityGem != true) continue;
		var piecePath = piece.pathByLayout != null ? piece.pathByLayout[layoutIndex] : piece.path;
		if (piecePath == null) continue;
		var untinted = honeycomb.image(piecePath);
		var stem = piecePath.substring(piecePath.lastIndexOf("/") + 1);
		var boxClass = piece.box == null ? "" : " hcCardBox";
		var boxStyle = "";
		if (piece.box != null) {
			if (piece.box.left != null) boxStyle += "left:" + piece.box.left + "%;";
			if (piece.box.right != null) boxStyle += "right:" + piece.box.right + "%;";
			boxStyle += "top:" + piece.box.top + "%;width:" + piece.box.width + "%;";
		}
		var pieceAttribute = ' data-hcChrome="' + piece.index + '"';
		if (piece.tintable != true) {
			markup += '<img class="hcCardChromePiece' + boxClass + '"' + pieceAttribute +
				' src="' + untinted + '" alt="" style="' + boxStyle + '">';
			continue;
		}
		var layerCount = Math.max(1, types.length);
		for (var layerIndex = 0; layerIndex < layerCount; layerIndex++) {
			var type = types[layerIndex];
			var folder = type == null ? null : tuning.tintFolderByType[type.index];
			var src = folder == null ? untinted
				: honeycomb.image("cards/chrome/tint/" + folder + "/" + stem);
			var maskStyle = "";
			if (layerIndex > 0) {
				var share = (layerIndex / layerCount) * 100;
				var from = (share - softness).toFixed(1);
				var to = (share + softness).toFixed(1);
				maskStyle = "-webkit-mask-image:linear-gradient(135deg,transparent " + from + "%,#000 " + to + "%);" +
					"mask-image:linear-gradient(135deg,transparent " + from + "%,#000 " + to + "%);";
			}
			markup += '<span class="hcCardTint' + boxClass + '"' + pieceAttribute + ' style="' + boxStyle + maskStyle + '">' +
				'<img class="hcCardChromePiece" src="' + src + '" alt=""' +
				' data-hcUntinted="' + honeycomb.escapeAttribute(untinted) + '"' +
				' onerror="honeycomb.ui.cardChromeFallback(this)"></span>';
		}
	}
	//The owner's class glyph rides over the emblem (same baked position, same 0.85 scale in the sheet).
	if (glyphPath != null) {
		markup += '<img class="hcCardChromePiece" data-hcChrome="iconGlyph" src="' +
			honeycomb.image(glyphPath) + '" alt="">';
	}
	return markup + "</div>";
};

//A baked tint that will not load falls back to the untinted raster, once.
honeycomb.ui.cardChromeFallback = function (element) {
	if (element.getAttribute("data-hcFellBack") === "1") return;
	element.setAttribute("data-hcFellBack", "1");
	var untinted = element.getAttribute("data-hcUntinted");
	if (untinted != null && untinted !== "") element.src = untinted;
};

//Renders one card from a resolved view. The frame's transparent window is positioned from tuning, so
//swapping in a frame with a different window is a tuning edit and nothing more.
//
//options: {size, instanceId, className, style, onClick, extraAttributes, affordable, unplayableText, showAffinity}
//`size` is REQUIRED: "small", "medium" or "large", from tuning.art.cardSize. It says
//which printed parts are drawn and how the name is set; the card's width is its container's business,
//and everything printed scales with that width. See honeycomb.ui.cardSize.
//`unplayableText` explains why a card cannot be played right now -- a downed owner, a failed condition.
//It both greys the card and appends itself to the tooltip, so a dead card is never silently inert.
honeycomb.ui.card = function (resolved, options) {
	if (resolved == null) return "";
	var settings = options == null ? {} : options;
	//A card being PREVIEWED knows whose pool it came from even when no owner instance exists, so the
	//class glyph and owner face can still be drawn. See honeycomb.cardClassGlyphPath.
	if (settings.previewCharacterIndex != null) resolved.previewCharacterIndex = settings.previewCharacterIndex;
	//A PREVIEW CARD has no owner instance, so its in-place starter upgrades come from the character's
	//current loadout (their tree). A live card already had them applied in honeycomb.resolveCard.
	if (resolved.starterUpgraded != true && settings.previewCharacterIndex != null &&
		honeycomb.teambuilding != null && honeycomb.teambuilding.loadoutFor != null) {
		var previewOwner = honeycomb.teambuilding.loadoutFor(settings.previewCharacterIndex);
		var previewAdjustArray = honeycomb.starterUpgradeArrayFor(previewOwner, resolved.cardIndex);
		if (previewAdjustArray.length > 0) {
			resolved.effectArray = honeycomb.applyStarterUpgradeArray(resolved.effectArray, previewAdjustArray);
			honeycomb.applyStarterUpgradeFields(resolved, previewAdjustArray);
			resolved.starterUpgraded = true;
		}
	}
	var size = honeycomb.ui.cardSize(settings.size, resolved);

	var layoutIndex = resolved.layout == null ? honeycomb.tuning.art.cardFrame.defaultLayout : resolved.layout;
	var frame = honeycomb.tuning.art.cardFrame[layoutIndex];
	if (frame == null) frame = honeycomb.tuning.art.cardFrame[honeycomb.tuning.art.cardFrame.defaultLayout];
	//The split chrome now carries both layouts; its per-layout gold frame window places the art.
	var chrome = honeycomb.tuning.art.cardChrome;
	var chromeWindow = chrome == null ? null
		: (chrome.windowByLayout[layoutIndex] || chrome.windowByLayout[honeycomb.tuning.art.cardFrame.defaultLayout]);
	var windowRect = chromeWindow == null ? frame : chromeWindow;
	var partArray = size.partArrayByLayout != null && size.partArrayByLayout[layoutIndex] != null
		? size.partArrayByLayout[layoutIndex] : size.partArray;
	var shows = function (part) { return partArray.indexOf(part) >= 0; };

	var classList = "hcCard hcCardSize-" + size.index + " hcCardLayout-" + layoutIndex;
	if (chrome != null) classList += " hcCardChrome";
	//A BROKEN CARD WEARS ITS OWN LOOK: a rose edge and a slow sheen sweep, so the swapped
	//form is unmistakable in a hand of five. The sheen is transform-only (see the stylesheet), and
	//reduced effects drops it.
	if (resolved.rarity == "broken") classList += " hcCardBroken";
	if (settings.className) classList += " " + settings.className;
	if (settings.affordable == false) classList += " hcUnaffordable";
	//A null cost is normally a card that can never be played -- a curse -- so it wears the blocked hatch.
	//The Random preview stand-in also has no cost, but it is not blocked: it is a card whose identity is
	//not decided yet, so it keeps its clean grey face.
	if (resolved.costArray == null && resolved.type != "random") classList += " hcUnplayable";
	if (settings.unplayable == true) classList += " hcUnplayable";

	//Hovering a card shows a full-size readable copy of it. `showTooltip: false` suppresses that for
	//a card that IS already the zoom, which would otherwise hover itself. `tooltipKind` picks a
	//different panel: the hand lifts and enlarges the real card already, so a second full copy of it
	//would land on top of the first -- there the panel says only what the card face cannot.
	var tooltipAttributes = settings.showTooltip == false
		? ""
		: honeycomb.tooltip.attributes(settings.tooltipKind == null ? "card" : settings.tooltipKind,
			settings.instanceId == null ? resolved.index : settings.instanceId);

	//A card that DOES something when clicked -- a reward, a shelf, a pick -- is gated for touch: the first
	//tap shows it (its tooltip opens on the tap), the second does it. With a mouse it acts at once, as
	//the hover already showed it. The action's own code is the gate's key, so every card has its own.
	var markup = '<div class="' + classList + '"' +
		' data-hcCardId="' + honeycomb.escapeAttribute(settings.instanceId == null ? "" : settings.instanceId) + '"' +
		' data-hcCardIndex="' + honeycomb.escapeAttribute(resolved.index) + '"' +
		' data-hcCardSize="' + size.index + '"' +
		(settings.style ? ' style="' + settings.style + '"' : "") +
		(settings.onClick ? ' data-hcTapKey="' + honeycomb.escapeAttribute(settings.onClick) + '"' +
			' onclick="if (honeycomb.input.tapToAct(this.dataset.hctapkey)) { ' + settings.onClick + ' }"' : "") +
		(settings.extraAttributes ? " " + settings.extraAttributes : "") +
		tooltipAttributes + ">";

	//Art layer, positioned into the frame's window. A card may carry an `artChain` instead of one path
	//-- an enemy's intent card does, walking the enemy's pose art down to their standing sprite.
	markup += '<div class="hcCardArt" style="' +
		"left:" + windowRect.windowLeftPercent + "%;" +
		"top:" + windowRect.windowTopPercent + "%;" +
		"width:" + windowRect.windowWidthPercent + "%;" +
		"height:" + windowRect.windowHeightPercent + "%;" +
		//The picture for the frame this card is WEARING: a broken form takes the shape of whatever it
		//replaced, so the shared broken cards carry one crop per layout. See honeycomb.cardArtPath.
		'">' + (function (artPath) {
			if (resolved.artOwed == true) {
				//ART OWED: not drawn yet, so the named placeholder is drawn without a request that 404s.
				return '<img src="' + honeycomb.placeholderArt(artPath) + '" alt="' + resolved.name + '">';
			}
			if (resolved.artChain != null) return honeycomb.art.chainTag(resolved.artChain, { alt: resolved.name });
			return honeycomb.imageTag(artPath, { alt: resolved.name });
		})(honeycomb.cardArtPath(resolved)) + "</div>";

	//Frame layer. A HORIZONTAL card draws the split chrome: back/front rasters tinted by
	//supertype, the extra types blended along a diagonal. The placeholder frame path below is kept for
	//vertical cards and as the fallback when no chrome is tuned.
	//
	//REDUCED EFFECTS DROPS THE BLEND, NOT THE COLOUR. Dropping the tint outright would lose a card's TYPE
	//signal on every coarse pointer -- reduced effects is auto-ON there, and the phone is a target BASICS
	//names, not a nice-to-have -- while the card still paid for one frame image per type with `filter:none`
	//on each. Reduced effects instead draws ONE frame, tinted by the card's PRIMARY type: the colour
	//survives and the extra layers, which were the real cost, do not.
	var singleFrame = honeycomb.reducedEffects != null && honeycomb.reducedEffects() == true;
	var typeArray = honeycomb.cardTypeDefinitionArray(resolved);
	if (chrome != null) {
		markup += honeycomb.ui.cardChrome(typeArray, singleFrame, layoutIndex, honeycomb.cardClassGlyphPath(resolved),
			honeycomb.cardShowsRarityGem(resolved));
	} else {
		if (singleFrame == true && typeArray.length > 1) typeArray = [typeArray[0]];
		var blendSoftness = honeycomb.tuning.art.cardFrame.typeBlendSoftnessPercent;
		for (var typeLayer = 0; typeLayer < Math.max(1, typeArray.length); typeLayer++) {
			var type = typeArray[typeLayer];
			var share = typeArray.length === 0 ? 0 : (typeLayer / typeArray.length) * 100;
			var framePath = honeycomb.cardTypeFramePath(type, layoutIndex, frame.framePath);
			var sizedFramePath = honeycomb.ui.sizedCardFramePath(framePath, size.index);
			var frameFilter = type == null || type.frameFilter == null ? "none" : type.frameFilter;
			markup += '<img class="hcCardFrame' + (typeLayer > 0 ? " hcCardFrameBlend" : "") + '" src="' +
				honeycomb.image(sizedFramePath) + '" alt=""' +
				' data-hcFullFrame="' + honeycomb.escapeAttribute(framePath) + '"' +
				' data-hcSizedFrame="' + honeycomb.escapeAttribute(sizedFramePath) + '"' +
				' style="filter:' + frameFilter +
				(typeLayer > 0 ? ";--hcBlendFrom:" + (share - blendSoftness).toFixed(1) + "%;--hcBlendTo:" + (share + blendSoftness).toFixed(1) + "%" : "") + '"' +
				' onerror="honeycomb.ui.cardFrameFallback(this)">';
		}
	}

	//THE OWNER RING'S FACE: the chrome draws the ring, but nothing put a face
	//in it, so the top-right circle sat empty on every preview. Draws the owner's portrait when the
	//card names one (a fielded owner, a preview's character, or the card's own character).
	var faceShare = honeycomb.cardOwnerFaceShare(resolved);
	if (faceShare != null) {
		markup += '<div class="hcCardOwnerFace">' +
			honeycomb.art.portraitTag(faceShare.characterIndex, faceShare.outfitIndex, { alt: faceShare.name }) + "</div>";
	}

	//Ink layer. Each printed part is drawn only when the card's size prints it.
	markup += '<div class="hcCardInk">';
	//The cost PRINTED is the cost CHARGED when the caller knows it (`settings.cost`, from
	//honeycomb.cardCost): a card discounted by Whetted Edge or a relic says so, coloured by which way it
	//moved. Without one -- a reward, a shop shelf -- the printed cost stands.
	if (shows("cost")) {
		var printedCost = resolved.costArray == null ? null : resolved.costArray.energy;
		var cost = settings.cost !== undefined && settings.cost !== null ? settings.cost : printedCost;
		var costClass = cost == null || printedCost == null || cost === printedCost ? "" : (cost < printedCost ? " hcCostDown" : " hcCostUp");
		markup += '<div class="hcCardCost' + costClass + '">' + (cost == null ? "&mdash;" : cost) + "</div>";
	}

	if (shows("affinity") && settings.showAffinity != false) markup += honeycomb.ui.cardAffinity(resolved);

	//What the card lands on and where it moves its owner, printed over the foot of the art. Both change
	//how a card must be played, so neither is left for the player to discover by accident.
	if (shows("badges")) {
		markup += '<div class="hcCardBadgeRow">' + honeycomb.ui.cardShiftBadge(resolved) +
			honeycomb.ui.cardTargetBadge(resolved) + "</div>";
	}

	//The NAME is printed across the top of the card, above the art, and the SUPERTYPES
	//take the name's old place on the bar under the art. The card tags stay on the lower edge.
	if (shows("name")) {
		var nameFit = honeycomb.ui.cardLineFit(String(resolved.name == null ? "" : resolved.name).length, size.nameFit);
		markup += '<div class="hcCardName' + (nameFit.wrap ? " hcCardNameWrap" : "") + '" style="--hcLineScale:' +
			Number((nameFit.scale * size.nameFit.scale).toFixed(3)) + '">' +
			'<span class="hcCardNameText">' + honeycomb.escapeText(resolved.name) + "</span></div>";
	}
	if (shows("supertypes")) markup += honeycomb.ui.cardSupertypeRow(resolved);
	if (shows("supertypeIcons")) markup += honeycomb.ui.cardSupertypeIcons(resolved, windowRect);
	//Keywords are picked out in the text, so the words the sidecar explains are visibly these words.
	//The text sits in ONE inner span: the box is a flex container (for vertical placement), and every
	//loose run of text and every keyword span in it would otherwise become a flex item of its own and
	//be laid out side by side -- which is what scrambled "Apply 2 Poison" into "lyPoison".
	//`settings.live` prints numbers as they would land now; see honeycomb.cardText. Long rules text is
	//set smaller (tuning.art.cardFrame.textFit) so it stays inside its box at every size.
	if (shows("text")) {
		var textFit = honeycomb.ui.cardLineFit(String(honeycomb.cardText(resolved, settings.live)).length, honeycomb.tuning.art.cardFrame.textFit);
		markup += '<div class="hcCardText" style="--hcLineScale:' + textFit.scale + '"><span class="hcCardTextBody">' +
			honeycomb.cardTextMarkup(resolved, settings.live) + "</span></div>";
	}
	if (shows("tags")) markup += honeycomb.ui.cardTagStrip(resolved);
	//NO PRINTED RARITY MARK ON THE CARD FACE. A small coloured diamond at the top right, in two greys and
	//two blues, told nobody anything -- a colour code with no legend -- and nothing in play depends on
	//knowing a card's rarity.
	//What rarity DOES say is said by the chrome's gold gem: it is drawn only for a rarity
	//whose cardRarityArray entry sets `showRarityGem`, so a gem means "better than an ordinary find"
	//rather than decorating every card alike. See honeycomb.cardShowsRarityGem.
	markup += "</div></div>";
	return markup;
};

//The size entry a card is drawn at. A missing or unknown size is a bug -- every card on screen must be
//one of the three -- so it is reported once per size name and drawn at the fallback, which prints the
//least and so cannot clip.
honeycomb.ui.reportedCardSizeArray = [];
honeycomb.ui.cardSize = function (sizeIndex, resolved) {
	var size = honeycomb.cardSizeDefinition(sizeIndex);
	if (size != null) return size;
	var key = String(sizeIndex);
	if (honeycomb.ui.reportedCardSizeArray.indexOf(key) < 0) {
		honeycomb.ui.reportedCardSizeArray.push(key);
		if (typeof console !== "undefined") {
			console.error("[Honeycomb] honeycomb.ui.card was called with size " + JSON.stringify(sizeIndex) +
				" (card " + (resolved == null ? "?" : resolved.index) + "). Every card must be small, medium or large.");
		}
	}
	return honeycomb.cardSizeDefinition(honeycomb.tuning.art.cardSize.fallbackSize);
};

//The target badge: "All enemies", "Ally", "Random", "Front". Silent for the ordinary cases -- one
//picked enemy, the card's own owner -- so it only appears where it changes how the card is played.
honeycomb.ui.cardTargetBadge = function (resolved) {
	if (honeycomb.tuning.art.cardFrame.showTargetBadge != true) return "";
	//Worded and coloured by where it lands from the PLAYER's side of the table: an enemy's card aimed at
	//the party is coloured as landing on the party.
	var userSide = honeycomb.cardUserSide(resolved);
	var badge = honeycomb.targetModeText(resolved.targetMode, "badge", userSide);
	if (badge == null) return "";
	var side = honeycomb.targetModeSide(resolved.targetMode, userSide);
	var sideClass = side == "ally" ? " hcBadgeAlly" : (side == "enemy" ? " hcBadgeEnemy" : "");
	return '<div class="hcCardBadge hcCardTargetBadge' + sideClass + '">' + honeycomb.escapeText(badge) + "</div>";
};

//Where playing it moves its owner. The arrow points the way they will walk: right, towards the enemy,
//is the front; left is the back. The same arrows the combat screen draws while the card is held.
honeycomb.ui.cardShiftArrowArray = [
	{ index: "front", text: "▶", className: "hcShiftFront" },
	{ index: "back", text: "◀", className: "hcShiftBack" },
];

honeycomb.ui.cardShiftBadge = function (resolved) {
	var label = honeycomb.cardShiftLabel(resolved);
	if (label === "") return "";
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var actor = combat == null ? honeycomb.cardOwnerMember(resolved) : honeycomb.cardActingEntity(resolved, combat);
	var shift = honeycomb.findDefinition(honeycomb.partyShiftArray, honeycomb.cardPartyShift(resolved, actor));
	var arrow = shift == null ? null : honeycomb.findDefinition(honeycomb.ui.cardShiftArrowArray, shift.arrow);
	if (arrow == null) return "";
	return '<div class="hcCardBadge hcCardShiftBadge ' + arrow.className + '" title="' +
		honeycomb.escapeAttribute(label) + '">' + arrow.text + "</div>";
};

//The owner pip. Shows whose pool contributed the card, which is the teambuilding read on a hand.
honeycomb.ui.cardAffinity = function (resolved) {
	if (resolved.ownerInstanceId == null) return "";
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return "";
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		if (member.instanceId != resolved.ownerInstanceId) continue;
		var definition = honeycomb.findDefinition(honeycomb.characterArray, member.characterIndex);
		if (definition == null) return "";
		return '<div class="hcCardAffinity" style="border-color:' + definition.colorHint + '">' +
			honeycomb.art.portraitTag(member.characterIndex, member.outfitIndex, { alt: definition.name }) + "</div>";
	}
	return "";
};

//The SUPERTYPES, printed on the bar under the art where the name used to sit: icon
//and word. Printed rather than only tinted, because content can be written for a type ("whenever a
//Support card is played") and the player has to be able to read which cards that means. The icon,
//colour and frame tint all come from honeycomb.cardTypeArray, so a new type needs nothing here.
honeycomb.ui.cardSupertypeRow = function (resolved) {
	var typeArray = honeycomb.cardTypeDefinitionArray(resolved);
	if (typeArray.length === 0) return "";
	//Every type the card is, primary first: cards may be several. A SINGLE type prints its
	//word beside the icon; TWO OR MORE print icons alone, matching the bench's multi mode, where the
	//words would crowd the ribbon. Either way the line shrinks to fit.
	var iconsOnly = typeArray.length > 1;
	var settings = honeycomb.tuning.art.cardFrame.supertypeFit;
	var characterCount = 0;
	for (var countIndex = 0; countIndex < typeArray.length; countIndex++) {
		characterCount += settings.iconCharacterCount +
			(iconsOnly ? 0 : String(typeArray[countIndex].name).length);
	}
	var fit = honeycomb.ui.cardLineFit(characterCount, settings);
	var markup = '<div class="hcCardSupertypeRow" style="--hcTypeColor:' + typeArray[0].color + ";--hcLineScale:" + fit.scale + '">';
	for (var typeIndex = 0; typeIndex < typeArray.length; typeIndex++) {
		var type = typeArray[typeIndex];
		markup += '<span class="hcCardSupertype">' + honeycomb.ui.iconTag(type.iconPath, type.glyph, type.color, {}) +
			(iconsOnly ? "" : '<span class="hcCardTypeName" style="color:' + type.color + '">' +
				honeycomb.escapeText(type.name) + "</span>") + "</span>";
	}
	return markup + "</div>";
};

//How small a printed label must be set to fit. Defined beside honeycomb.cardText so the headless card fit
//rule (honeycomb-warnings.js) reads the very same function the card face does.
honeycomb.ui.cardLineFit = honeycomb.cardLineFit;

//The SUPERTYPES as icons alone, in a row just below the art window: what a small horizontal card shows.
//Placed from the frame's own window rectangle, so a different frame moves it too.
honeycomb.ui.cardSupertypeIcons = function (resolved, frame) {
	var typeArray = honeycomb.cardTypeDefinitionArray(resolved);
	if (typeArray.length === 0) return "";
	var markup = '<div class="hcCardSupertypeIcons" style="top:' +
		(frame.windowTopPercent + frame.windowHeightPercent).toFixed(3) + '%">';
	for (var typeIndex = 0; typeIndex < typeArray.length; typeIndex++) {
		var type = typeArray[typeIndex];
		markup += honeycomb.ui.iconTag(type.iconPath, type.glyph, type.color, { title: type.name });
	}
	return markup + "</div>";
};

//The CARD TAGS -- its school -- along the lower edge, as Hearthstone prints a spell school. Nothing is
//drawn for a card with none.
honeycomb.ui.cardTagStrip = function (resolved) {
	var schoolArray = honeycomb.cardSchoolArray(resolved);
	if (schoolArray.length === 0) return "";
	var markup = '<div class="hcCardTagStrip">';
	for (var schoolIndex = 0; schoolIndex < schoolArray.length; schoolIndex++) {
		//--hcTagColor paints the banner's fill (the bench's recipe: a dark school colour behind light
		//type); the word itself prints light, like every other printed line.
		markup += '<span class="hcCardSchool" style="--hcTagColor:' + schoolArray[schoolIndex].color + '">' +
			honeycomb.escapeText(schoolArray[schoolIndex].name) + "</span>";
	}
	return markup + "</div>";
};

//The small icon for a card's type, for lists that show a card as a row rather than a face.
honeycomb.ui.cardTypeIcon = function (cardDefinition, className) {
	var type = honeycomb.cardType(cardDefinition);
	return honeycomb.ui.iconTag(type.iconPath, type.glyph, type.color,
		{ className: className, title: type.name });
};

//---------------------------------------------------------------------------------------------------
//Common interactions
//---------------------------------------------------------------------------------------------------
honeycomb.ui.confirmQuit = function () {
	honeycomb.platform.sound("uiBack");
	honeycomb.overlay.open("confirm", {
		title: "Leave Honeycomb?",
		body: honeycomb.state != null && honeycomb.state.run != null
			? "The run is saved and will be waiting on the title screen."
			: "Nothing is in progress.",
		confirmLabel: "Leave",
		cancelLabel: "Stay",
		onConfirm: "honeycomb.quit()",
	});
};

//A generic yes/no overlay, used wherever a decision needs confirming.
honeycomb.overlay.register({
	index: "confirm",
	build: function (layer, params) {
		var markup = '<div class="hcOverlayPanel">';
		markup += '<h2 class="hcOverlayTitle">' + honeycomb.escapeText(params.title) + "</h2>";
		if (params.body) markup += '<div class="hcOverlayBody">' + honeycomb.escapeText(params.body) + "</div>";
		markup += '<div class="hcOverlayButtonRow">';
		markup += '<div class="hcButton" onclick="honeycomb.overlay.closeTop()">' +
			honeycomb.escapeText(params.cancelLabel == null ? "Cancel" : params.cancelLabel) + "</div>";
		markup += '<div class="hcButton hcPrimary" onclick="honeycomb.overlay.closeTop();' +
			honeycomb.escapeAttribute(params.onConfirm) + '">' +
			honeycomb.escapeText(params.confirmLabel == null ? "Confirm" : params.confirmLabel) + "</div>";
		markup += "</div></div>";
		layer.innerHTML = markup;
	},
});

//A plain information overlay.
honeycomb.overlay.register({
	index: "notice",
	build: function (layer, params) {
		var markup = '<div class="hcOverlayPanel">';
		markup += '<h2 class="hcOverlayTitle">' + honeycomb.escapeText(params.title) + "</h2>";
		if (params.bodyHtml != null) markup += '<div class="hcOverlayBody">' + params.bodyHtml + "</div>";
		else if (params.body != null) markup += '<div class="hcOverlayBody">' + honeycomb.escapeText(params.body) + "</div>";
		markup += '<div class="hcOverlayButtonRow">' +
			'<div class="hcButton hcPrimary" onclick="honeycomb.overlay.closeTop()">' +
			honeycomb.escapeText(params.closeLabel == null ? "Close" : params.closeLabel) + "</div></div>";
		markup += "</div>";
		layer.innerHTML = markup;
	},
});
