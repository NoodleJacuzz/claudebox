//===================================================================================================
//HONEYCOMB CATACOMBS -- map node overlays
//===================================================================================================
//What the non-combat map nodes actually do. Each is an overlay rather than a scene, so the map stays
//built underneath and returning to it costs nothing.
//
//Every one of these ends by calling honeycomb.map.returnToMap(), which marks the node complete and
//unlocks its onward edges. A node that does not call it leaves the player stuck on that node, which
//is the intended behaviour for a fight in progress and a bug anywhere else.
window.honeycomb = window.honeycomb || {};

//---------------------------------------------------------------------------------------------------
//Event
//---------------------------------------------------------------------------------------------------
//A page of text and a set of choices. Choices are gated by condition and cost; taking one resolves its
//effects through the same verb table cards use, then shows its result.
//
//PRESENTATION IS A MODE, not a fixed layout. `honeycomb.eventPresentationArray` decides how an event
//is drawn, and an event picks one:
//
//  panel   a centred box. For a small aside that does not want the whole screen.
//  scene   FULL SCREEN. Background art behind everything, a speaker down one side, the panel down the
//          other, sliding in over the top. This is the default, because an event is a place the player
//          has walked into and the old box used a fraction of the screen for it.
//
//The shop uses `scene` too, so a shop and a full-screen event are the same layout with different
//contents rather than two screens that happen to look alike.
//
//CHOICES PREVIEW THEMSELVES. Rest showed the outcome of each option in detail and ordinary events did
//not; now they all do, generated from the choice's own effect list through the same describeEffectArray
//that prints card rules text. An author may override it with `previewText` when prose reads better.
honeycomb.eventPresentationArray = [
	{
		index: "panel",
		name: "Panel",
		panelClass: "hcEventPanel hcEventPanel-panel",
		fullBleed: false,
	},
	{
		index: "scene",
		name: "Scene",
		panelClass: "hcEventPanel hcEventPanel-scene",
		fullBleed: true,
	},
];

//PAGES. An event is a first page -- its own `text`, `lineArray` and `choiceArray` -- plus an optional
//`pageArray` of further pages, each {index, text, lineArray, choiceArray}. A choice carrying `goToPage`
//turns to that page instead of ending the event; its `resultText`, if any, leads the new page.
//
//BATTLES. A choice whose effects include `startCombat` hands the player to a fight. Winning it returns
//to this event: to `victoryPage` if the effect names one, otherwise to the choice's own result text.
//See honeycomb.combatContinuationArray. The event does not know how the fight is run, and the fight
//does not know it came from an event.
//
//DISCOVERIES. Resolving an event pays into the shared pool unless the event says `discovery: false`.
//A choice marked `discovery: true` is a PATH worth finding on its own -- the road not travelled.
//What an event is opened FROM decides what finishing it does. A map node's event marks the node
//complete; a Lust Event opened from teambuilding resolves the rank-up that raised it and stays on
//teambuilding. A new place events can open from is a table entry.
//  recordsSeen        whether taking a choice marks the event seen for the rest of the run
//  appliesEffects     false for a host that only SHOWS an event: no cost is spent, no reward resolves and
//                     nothing is recorded as discovered. The Event Gallery's replay is the one such host
//                     -- a scene can be reread as often as the player likes because rereading it pays
//                     nothing.
//                     What still resolves is the scene's own shape: an effect whose definition carries
//                     `sceneStructure` is what the scene does rather than what it pays, and a replay that
//                     skipped those would not be the scene. `startCombat` is the one that matters, since a
//                     replay still needs to be able to play out a lust battle.
//  savesPosition      false for a host whose event must not be written to the run's saved event slot. A
//                     replay opened from the title screen would otherwise overwrite the map event the
//                     player is standing in the middle of.
//  finish()           what "Move on" does
//  beginCombat(event, choice, pending)   optional: how a choice's fight is started, when it is not the map's way
honeycomb.eventHostArray = [
	{
		index: "map",
		recordsSeen: true,
		finish: function () {
			//Abilities that recharge on rest do so when a REST event is left, rather than inside one of its
			//choices: the recharge is a consequence of having rested at all.
			var event = honeycomb.eventVariantFor(honeycomb.findDefinition(honeycomb.eventArray, honeycomb.eventOverlay.eventIndex));
			if (event != null && event.isRest == true) honeycomb.abilities.recharge("rest");
			//The event is over, so its saved position goes with it.
			honeycomb.eventState.clear();
			honeycomb.overlay.close("event");
			honeycomb.map.returnToMap();
		},
	},
];

honeycomb.eventHost = function () {
	var definition = honeycomb.findDefinition(honeycomb.eventHostArray, honeycomb.eventOverlay.host);
	return definition == null ? honeycomb.eventHostArray[0] : definition;
};

//WHERE THE PLAYER IS IN AN EVENT, ON THE RUN, so refreshing mid-event or mid-rest resumes here instead
//of restarting (or dropping to the map). Everything stored is plain data -- an index, a page number, the
//result line, and a rest's actions left -- so the ordinary save carries it. The overlay writes it after
//every action; the node's `onEnter` reads it back through `savedFor`.
honeycomb.eventState = {
	//Whether the open event may touch the slot at all. The gallery's replay host says it may not, and the
	//guard lives here rather than at each of the six call sites so a seventh cannot forget it. Without it,
	//rereading a scene from the title screen would overwrite -- or half-overwrite, through `update` --
	//the map event a run is currently paused inside.
	tracked: function () {
		var host = honeycomb.eventHost == null ? null : honeycomb.eventHost();
		return host == null || host.savesPosition !== false;
	},
	begin: function (eventIndex, options) {
		var run = honeycomb.state == null ? null : honeycomb.state.run;
		if (run == null || honeycomb.eventState.tracked() == false) return;
		var settings = options == null ? {} : options;
		run.eventState = {
			eventIndex: eventIndex,
			pageIndex: settings.pageIndex == null ? null : settings.pageIndex,
			resultText: settings.resultText == null ? null : settings.resultText,
			leadText: settings.leadText == null ? null : settings.leadText,
			restActionsRemaining: settings.restActionsRemaining == null ? null : settings.restActionsRemaining,
		};
	},
	update: function (fields) {
		var run = honeycomb.state == null ? null : honeycomb.state.run;
		if (run == null || run.eventState == null || honeycomb.eventState.tracked() == false) return;
		for (var key in fields) {
			if (Object.prototype.hasOwnProperty.call(fields, key)) run.eventState[key] = fields[key];
		}
	},
	//The saved position for this exact event, or null (a different event, or nothing in progress). An
	//untracked host reads nothing back either: a replay always starts a scene at its first page, even
	//when the run happens to be paused inside the same event.
	savedFor: function (eventIndex) {
		var run = honeycomb.state == null ? null : honeycomb.state.run;
		if (run == null || run.eventState == null || honeycomb.eventState.tracked() == false) return null;
		if (run.eventState.eventIndex != eventIndex) return null;
		return run.eventState;
	},
	clear: function () {
		var run = honeycomb.state == null ? null : honeycomb.state.run;
		if (run != null && honeycomb.eventState.tracked() != false) run.eventState = null;
	},
	save: function (reason) {
		if (honeycomb.eventState.tracked() == false) return;
		if (honeycomb.save != null) honeycomb.save.autosave(reason == null ? "eventState" : reason);
	},
};

honeycomb.overlay.register({
	index: "event",
	build: function (layer, params) {
		honeycomb.eventOverlay.host = params.host == null ? "map" : params.host;
		//WHO THE EVENT IS ABOUT, when it is about someone: a Lust Event's character. Read by `{name}` in
		//its text and by the effects that act on "the character" (honeycomb.eventOverlay.subjectFor).
		honeycomb.eventOverlay.subject = params.subject == null ? null : params.subject;
		honeycomb.eventOverlay.lustEntryIndex = params.lustEntryIndex == null ? null : params.lustEntryIndex;
		honeycomb.eventOverlay.keepsEventReady = false;
		//THE VARIANT, not the base event: an event with a `brokenVariantArray` shows a different face
		//while somebody in the party is broken. The index is preserved through the merge, so every
		//downstream lookup still finds the real event.
		var event = honeycomb.eventVariantFor(honeycomb.findDefinition(honeycomb.eventArray, params.eventIndex));
		if (event == null) {
			//An event with no definition is a content gap, not a reason to trap the player.
			console.error("Honeycomb: no event '" + params.eventIndex + "'");
			honeycomb.eventHost().finish();
			return;
		}
		honeycomb.eventOverlay.eventIndex = event.index;
		//An event's own `subject` names the character it is about.
		if (honeycomb.eventOverlay.subject == null && event.subject != null) honeycomb.eventOverlay.subject = event.subject;
		//A POSITION SAVED BY A PREVIOUS VISIT WINS. That is a page refresh mid-event, or the map's
		//unfinished-node button after one -- the rest's action budget comes back with it. Otherwise the
		//visit starts fresh and records its start.
		var savedState = honeycomb.eventState.savedFor(event.index);
		if (savedState != null) {
			honeycomb.eventOverlay.pageIndex = savedState.pageIndex;
			honeycomb.eventOverlay.resultText = savedState.resultText;
			honeycomb.eventOverlay.leadText = savedState.leadText;
			if (event.isRest == true && savedState.restActionsRemaining != null) {
				honeycomb.rest.actionsRemaining = savedState.restActionsRemaining;
			}
		} else {
			//A rest builds its own menu and spends actions; reset the budget -- unless this is a Mail Order
			//return, where the actions already spent must be kept.
			if (event.isRest == true && params.resumeActions != true) honeycomb.rest.begin();
			honeycomb.eventOverlay.pageIndex = params.pageIndex == null ? null : params.pageIndex;
			//Returning from a battle may bring the result text of the choice that started it.
			honeycomb.eventOverlay.resultText = params.resultText == null ? null : params.resultText;
			honeycomb.eventOverlay.leadText = null;
			honeycomb.eventState.begin(event.index, {
				pageIndex: honeycomb.eventOverlay.pageIndex,
				resultText: honeycomb.eventOverlay.resultText,
				leadText: honeycomb.eventOverlay.leadText,
				restActionsRemaining: event.isRest == true ? honeycomb.rest.actionsRemaining : null,
			});
			honeycomb.eventState.save("eventOpen");
		}
		//A page handed back by a fight outranks the saved position. The choice that starts a fight returns
		//before the line that records where the event is, so the saved position is still the page the
		//fight was chosen from. Left alone, that page would win over the `victoryPage` the win came back
		//with, and the player would be handed the same choice again, looping forever. The saved position
		//is rewritten here too, so refreshing after the fight resumes past it rather than into the loop.
		//A rest's action budget is left alone -- this is a return, not a fresh visit.
		if (params.fromCombat == true) {
			honeycomb.eventOverlay.pageIndex = params.pageIndex == null ? null : params.pageIndex;
			honeycomb.eventOverlay.resultText = params.resultText == null ? null : params.resultText;
			honeycomb.eventOverlay.leadText = null;
			honeycomb.eventState.update({
				pageIndex: honeycomb.eventOverlay.pageIndex,
				resultText: honeycomb.eventOverlay.resultText,
				leadText: null,
			});
			honeycomb.eventState.save("eventFromCombat");
		}
		honeycomb.eventOverlay.aftermath = null;
		honeycomb.eventOverlay.gains = null;
		honeycomb.eventOverlay.answerArray = null;
		honeycomb.eventOverlay.pendingChoiceIndex = null;
		//An event resumed after a fight was already recorded when the fight was chosen.
		honeycomb.eventOverlay.discoveryRecorded = params.fromCombat == true;
		layer.innerHTML = honeycomb.eventOverlay.render(event, honeycomb.eventOverlay.resultText);
	},
});

honeycomb.eventOverlay = {
	eventIndex: null,
	//Which page is showing; null is the event's own first page.
	pageIndex: null,
	//Set once a choice has been taken; the panel then shows what happened instead of the options.
	resultText: null,
	//A choice's result text carried onto the page it turned to.
	leadText: null,
	//Answers collected from questions a choice's effects asked mid-resolution. See honeycomb-choices.js.
	answerArray: null,
	pendingChoiceIndex: null,
	lastDiscovery: null,
	discoveryRecorded: false,
	//Where the event was opened from (honeycomb.eventHostArray), who it is about, and for a Lust Event
	//which queue row is being played.
	host: "map",
	subject: null,
	lustEntryIndex: null,
	//Set by a choice marked `keepsEventReady`: leaving the event then does not complete the queue row.
	keepsEventReady: false,
};

//The character an effect or a line of text means by "the character": the effect's own `character`,
//then the context's, then the open event's subject.
honeycomb.eventOverlay.subjectFor = function (entry, context) {
	if (entry != null && entry.character != null) return entry.character;
	if (context != null && context.subjectCharacterIndex != null) return context.subjectCharacterIndex;
	return honeycomb.eventOverlay.subject;
};

//An event's words with `{name}` filled in by a subject, and for a Lust Event `{tag}` and `{rank}` by the
//weakness its queue row is about and the rank of it. Text with no subject is returned untouched.
//Written as a plain function of its subject rather than of the open overlay, because the Event Gallery
//asks the same question about a scene nobody is currently in (honeycomb.gallery.fillWords).
honeycomb.eventWords = function (text, subject, lustEntryIndex) {
	if (text == null) return "";
	if (subject == null) return String(text);
	var definition = honeycomb.findDefinition(honeycomb.characterArray, subject);
	var said = String(text).split("{name}").join(definition == null ? subject : definition.name);
	var words = honeycomb.lustEvents == null || lustEntryIndex == null ? null
		: honeycomb.lustEvents.entryWords(subject, lustEntryIndex);
	if (words != null) said = said.split("{tag}").join(words.tag).split("{rank}").join(words.rank);
	return said;
};

//The open event's words: honeycomb.eventWords with the overlay's own subject and queue row.
honeycomb.eventOverlay.say = function (text) {
	return honeycomb.eventWords(text, honeycomb.eventOverlay.subject, honeycomb.eventOverlay.lustEntryIndex);
};

//The effects that are the scene rather than its payout. An effect definition carrying `sceneStructure`
//says what the scene does -- `startCombat` is the whole list today. A read-only host resolves these and
//nothing else, so the Event Gallery refights a Lust Battle without paying for it a second time. Marking
//an effect is a field on its table entry; no list here needs maintaining.
honeycomb.structuralEffectArray = function (effectArray) {
	var result = [];
	for (var scanIndex = 0; scanIndex < (effectArray == null ? 0 : effectArray.length); scanIndex++) {
		var entry = effectArray[scanIndex];
		if (entry == null) continue;
		var definition = honeycomb.findDefinition(honeycomb.effectArray, entry.index);
		if (definition != null && definition.sceneStructure == true) result.push(entry);
	}
	return result;
};

//Where a `startCombat` request is left: on the run during one, on the state between runs (a Lust Event).
honeycomb.pendingCombatHolder = function () {
	if (honeycomb.state == null) return null;
	return honeycomb.state.run != null ? honeycomb.state.run : honeycomb.state;
};

//The page on show: the event itself for page null, else the named entry of its pageArray.
honeycomb.eventOverlay.pageFor = function (event, pageIndex) {
	if (event == null) return null;
	if (pageIndex == null || event.pageArray == null) return event;
	var page = honeycomb.findDefinition(event.pageArray, pageIndex);
	if (page == null) console.error("Honeycomb: event '" + event.index + "' has no page '" + pageIndex + "'");
	return page == null ? event : page;
};

//An event art path with party-place tokens in it, each resolved to the art folder of the character
//standing in that place: `events/campfire/{leader}` becomes `events/campfire/knight` when Brienne
//leads, and `events/bath/{leader}-{second}` names a picture of the front two. The tokens are
//tuning.ui.eventPartyTokenArray, front first. A place the party does not fill reads as the leader, so
//a picture written for three still resolves for a party of two. Any path without a token is returned
//untouched. The gallery tiles resolve through this too, so a token never reaches honeycomb.image.
honeycomb.eventOverlay.artPathFor = function (path) {
	if (typeof path !== "string" || path.indexOf("{") < 0) return path;
	var tokenArray = honeycomb.tuning.ui.eventPartyTokenArray;
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var partyArray = (run == null || run.partyArray == null) ? [] : run.partyArray;
	var folderAt = function (place) {
		var member = partyArray[place] == null ? partyArray[0] : partyArray[place];
		var definition = member == null ? null : honeycomb.findDefinition(honeycomb.characterArray, member.characterIndex);
		if (definition == null || definition.artFolder == null) {
			definition = honeycomb.findDefinition(honeycomb.characterArray, honeycomb.tuning.ui.eventLeaderFallbackCharacter);
		}
		return definition.artFolder;
	};
	var resolved = path;
	for (var place = 0; place < tokenArray.length; place++) {
		if (resolved.indexOf(tokenArray[place]) >= 0) resolved = resolved.split(tokenArray[place]).join(folderAt(place));
	}
	return resolved;
};

honeycomb.eventOverlay.presentationFor = function (event) {
	var index = event.presentation == null ? honeycomb.tuning.ui.defaultEventPresentation : event.presentation;
	var definition = honeycomb.findDefinition(honeycomb.eventPresentationArray, index);
	return definition == null ? honeycomb.eventPresentationArray[0] : definition;
};

//resultText is null while choices are being offered, and set once one has been taken.
honeycomb.eventOverlay.render = function (event, resultText) {
	var presentation = honeycomb.eventOverlay.presentationFor(event);

	//PER-PAGE ART. A scene is beats, a beat is a page, and every beat has its own picture -- the image
	//IS the page-turn, and the text catches up to it. So the three art fields are read off the PAGE with
	//the event as the fallback. `pageFor` returns the event itself when there is no page, so a
	//single-page event resolves to exactly what it did before and nothing already written changes.
	//Resolved here, above the backdrop, because the art must be known before the rest of the page is
	//worked out.
	var artPage = honeycomb.eventOverlay.pageFor(event, honeycomb.eventOverlay.pageIndex);
	if (artPage == null) { artPage = event; }
	//The same page, named for what the result branch below uses it for.
	var resultPage = artPage;
	var backgroundPath = honeycomb.eventOverlay.artPathFor(artPage.backgroundPath == null ? event.backgroundPath : artPage.backgroundPath);
	var imagePath = honeycomb.eventOverlay.artPathFor(artPage.imagePath == null ? event.imagePath : artPage.imagePath);
	var speakerPath = honeycomb.eventOverlay.artPathFor(artPage.speakerPath == null ? event.speakerPath : artPage.speakerPath);

	var markup = '<div class="' + presentation.panelClass + '">';

	//Full-bleed backdrop, behind everything. Silent when missing, so the CSS ground shows rather than
	//a labelled placeholder the size of the screen.
	if (presentation.fullBleed == true) {
		//Unstretched whatever its shape, with a permanent dark vignette over it, so the board and the art
		//read against the same ground whatever the backdrop is -- and a backdrop never needs detail at
		//its edges. See honeycomb.ui.backdrop.
		markup += honeycomb.ui.backdrop(backgroundPath);
		//The event's own illustration, right-aligned in the space the board leaves. It may be any of the
		//standard sizes (1024x1024, 832x1216, 896x1152); the whole painting is shown and the vignette
		//gradient covers whatever it leaves between it and the board. Not silent when missing -- a
		//labelled image is the placeholder an art pass looks for.
		if (imagePath != null) {
			markup += '<div class="hcEventArtSquare">' +
				honeycomb.imageTag(imagePath, { className: "hcEventSquareArt", alt: event.name }) + "</div>";
		}
	}

	//THE TOP BAR PERSISTS over a scene, as the shop mockup shows. The scene covers the whole layer, so
	//the bar underneath it would be hidden; it is drawn again here rather than punching a hole in the
	//backdrop, which would leave a bright strip of whatever screen is behind.
	if (presentation.fullBleed == true) {
		markup += '<div class="hcEventTopBar">' + honeycomb.ui.topBar({ showExit: true }) + "</div>";
	}

	//The speaker. Room for character dialogue was asked for, and this is where it lands: a figure on
	//one side of the screen that the panel talks across.
	if (presentation.fullBleed == true && speakerPath != null) {
		markup += '<div class="hcEventSpeaker">' +
			honeycomb.imageTag(speakerPath, { className: "hcEventSpeakerArt", alt: event.speakerName == null ? "" : event.speakerName }) +
			"</div>";
	} else if (presentation.fullBleed == true && event.speakerIsSubject == true && honeycomb.eventOverlay.subject != null) {
		//The subject as the speaker: a Lust Event shows whoever it is about, in the outfit they are
		//wearing, through the same art resolver the roster uses.
		var subject = honeycomb.findDefinition(honeycomb.characterArray, honeycomb.eventOverlay.subject);
		if (subject != null) {
			var loadout = honeycomb.teambuilding == null ? null : honeycomb.teambuilding.loadoutFor(subject.index);
			//Mid-run, the subject wears her outfit from the run's party.
			var runMember = null;
			var eventRun = honeycomb.state == null ? null : honeycomb.state.run;
			for (var memberIndex = 0; eventRun != null && eventRun.partyArray != null && memberIndex < eventRun.partyArray.length; memberIndex++) {
				if (eventRun.partyArray[memberIndex].characterIndex == subject.index) runMember = eventRun.partyArray[memberIndex];
			}
			var speakerEntity = { side: "ally", characterIndex: subject.index,
				outfitIndex: runMember != null && runMember.outfitIndex != null ? runMember.outfitIndex
					: loadout == null ? subject.defaultOutfit : loadout.outfitIndex,
				health: 1, maxHealth: 1, temporaryHealth: 0, statusArray: [], downed: false };
			markup += '<div class="hcEventSpeaker">' +
				honeycomb.art.spriteTag(speakerEntity, "basic", { className: "hcEventSpeakerArt", alt: subject.name }) + "</div>";
		}
	}

	markup += '<div class="hcEventPane">';
	//A small illustration still sits at the top in panel mode; in scene mode the backdrop is the art.
	if (presentation.fullBleed == false) {
		markup += '<div class="hcEventArt">' + honeycomb.imageTag(imagePath, { alt: event.name }) + "</div>";
	}

	markup += '<div class="hcEventBody hcScroll">';
	markup += '<h2 class="hcOverlayTitle hcEventTitle">' + honeycomb.escapeText(honeycomb.eventOverlay.say(event.name)) + "</h2>";

	if (resultText == null) {
		var page = honeycomb.eventOverlay.pageFor(event, honeycomb.eventOverlay.pageIndex);
		if (honeycomb.eventOverlay.leadText != null && honeycomb.eventOverlay.leadText !== "") {
			markup += '<div class="hcEventText hcEventResult">' + honeycomb.escapeRichText(honeycomb.eventOverlay.say(honeycomb.eventOverlay.leadText)) + "</div>";
		}
		//What the choice that turned the page did to the party, if anything, and what it gave or took.
		markup += honeycomb.ui.miniPartyRow(honeycomb.eventOverlay.aftermath, "hcMiniAftermath");
		markup += honeycomb.eventOverlay.renderGains(honeycomb.eventOverlay.gains);
		markup += '<div class="hcEventText">' + honeycomb.escapeRichText(honeycomb.eventOverlay.say(page.text)) + "</div>";
		markup += honeycomb.eventOverlay.renderDialogue(page);
		//A rest says how many actions are left, since each row costs one.
		if (event.isRest == true) {
			markup += '<div class="hcEventText hcTiny hcMuted">Actions left: ' +
				Math.max(0, honeycomb.rest.actionsRemaining) + "</div>";
		}
		markup += '<div class="hcEventChoices">';
		//THE LIVE LIST, not the page's static one: a rest BUILDS its menu (honeycomb.rest.choiceArray),
		//so the count and the rows both have to come from the same place.
		var choiceArray = honeycomb.eventOverlay.currentChoiceArray(event);
		for (var choiceIndex = 0; choiceIndex < choiceArray.length; choiceIndex++) {
			markup += honeycomb.eventOverlay.renderChoice(event, choiceIndex);
		}
		markup += "</div>";
	} else {
		//The last beat stays on screen. A linear scene's last choice has no result line -- the scene ends
		//on its last written line and nothing is invented to follow it -- so the page's own text and
		//lines are drawn again here, with what the choice did added under them, rather than leaving the
		//panel blank: a picture, an empty box and a button.
		markup += '<div class="hcEventText">' + honeycomb.escapeRichText(honeycomb.eventOverlay.say(resultPage.text)) + "</div>";
		markup += honeycomb.eventOverlay.renderDialogue(resultPage);
		//An empty result is not drawn at all, rather than drawn as an empty box.
		var saidResult = honeycomb.eventOverlay.say(resultText);
		if (saidResult != null && String(saidResult).trim() !== "") {
			markup += '<div class="hcEventText hcEventResult">' + honeycomb.escapeRichText(saidResult) + "</div>";
		}
		//The aftermath: what just happened to everyone, drawn rather than only told -- and the cards and
		//relics it gave or took, shown as themselves.
		markup += honeycomb.ui.miniPartyRow(honeycomb.eventOverlay.aftermath, "hcMiniAftermath");
		markup += honeycomb.eventOverlay.renderGains(honeycomb.eventOverlay.gains);
		var finishLabel = honeycomb.eventHost().finishLabel;
		markup += '<div class="hcEventChoices">' +
			'<div class="hcButton hcPrimary" onclick="honeycomb.eventOverlay.finish()">' +
			honeycomb.escapeText(finishLabel == null ? "Move on" : finishLabel) + "</div></div>";
	}

	markup += "</div></div></div>";
	return markup;
};

//A scene's lines. `lineArray` takes THREE kinds of entry and they are drawn as three different things,
//because a wall of identically-styled paragraphs gives a scene no shape:
//
//  {speaker, text}   SPEECH. A portrait, a name plate and a bordered box -- the same three parts, in
//                    the same order, as Syrup Town's writeSpeech, which is the look these are measured
//                    against.
//  {text}            NARRATION, the `t` line of the scene format. Plain prose, no box, no portrait.
//                    Deliberately the opposite shape to speech: the contrast is what breaks a scene up.
//  {divider: true}   A RULE across the panel. Written as a bare `t ...` line at the end of a beat; it
//                    means time has passed.
//
//`characterIndex` on a speech line names whose portrait to draw. With none, a line spoken by the event's
//subject still gets theirs, so a single-voice scene needs nothing said twice.
honeycomb.eventOverlay.renderDialogue = function (event) {
	if (event.lineArray == null || event.lineArray.length === 0) return "";
	var subject = honeycomb.eventOverlay.subject;
	var subjectDefinition = subject == null ? null : honeycomb.findDefinition(honeycomb.characterArray, subject);
	var markup = '<div class="hcEventDialogue">';
	for (var lineIndex = 0; lineIndex < event.lineArray.length; lineIndex++) {
		var line = event.lineArray[lineIndex];
		//A line may be conditional, which is how an event reacts to who actually walked into it. The
		//shape: give the character in front a line of their own, then give the one behind them a reply
		//that works after any of them. One line per character per slot, rather than a written
		//conversation for every possible party, and an event that reads correctly when neither slot is
		//anybody who has something to say.
		//    { speaker: "Brienne", text: "...", condition: { index: "partyContains", character: "brienne", position: 0 } }
		if (line.condition != null && honeycomb.testCondition(line.condition, honeycomb.newEffectContext({})) == false) {
			continue;
		}
		if (line.divider == true) {
			markup += '<hr class="hcEventDivider">';
			continue;
		}
		if (line.speaker == null) {
			markup += '<div class="hcEventNarration">' + honeycomb.escapeRichText(honeycomb.eventOverlay.say(line.text)) + "</div>";
			continue;
		}
		//Whose face. The line's own character, else the subject when the line is theirs -- matched on the
		//spoken name so that a scene naming one speaker throughout says it once.
		var speaking = line.characterIndex;
		if (speaking == null && subjectDefinition != null &&
			honeycomb.eventOverlay.say(line.speaker) === subjectDefinition.name) {
			speaking = subject;
		}
		markup += '<div class="hcEventLine">';
		if (speaking != null) {
			var loadout = honeycomb.teambuilding == null ? null : honeycomb.teambuilding.loadoutFor(speaking);
			var speakingDefinition = honeycomb.findDefinition(honeycomb.characterArray, speaking);
			var outfitIndex = loadout != null ? loadout.outfitIndex
				: (speakingDefinition == null ? null : speakingDefinition.defaultOutfit);
			markup += '<div class="hcEventPortrait">' +
				honeycomb.art.portraitTag(speaking, outfitIndex, { className: "hcEventPortraitArt", alt: "" }) + "</div>";
		}
		markup += '<div class="hcEventSpeech">';
		markup += '<div class="hcEventSpeakerName">' + honeycomb.escapeText(honeycomb.eventOverlay.say(line.speaker)) + "</div>";
		markup += '<div class="hcEventLineText">' + honeycomb.escapeRichText(honeycomb.eventOverlay.say(line.text)) + "</div>";
		markup += "</div></div>";
	}
	markup += "</div>";
	return markup;
};

honeycomb.eventOverlay.currentChoiceArray = function (event) {
	//A rest's menu is BUILT, not authored: the base campfire rows plus one for every rest option a
	//character's tree has unlocked. See honeycomb.rest.choiceArray.
	if (event != null && event.isRest == true) return honeycomb.rest.choiceArray();
	var page = honeycomb.eventOverlay.pageFor(event, honeycomb.eventOverlay.pageIndex);
	return page == null || page.choiceArray == null ? [] : page.choiceArray;
};

honeycomb.eventOverlay.renderChoice = function (event, choiceIndex) {
	var choice = honeycomb.eventOverlay.currentChoiceArray(event)[choiceIndex];
	var context = honeycomb.newEffectContext({});
	//Two separate gates: a condition the author wrote, and whether the cost is payable. Both disable
	//rather than hide, so the player can see what they cannot afford.
	var conditionMet = choice.condition == null || honeycomb.testCondition(choice.condition, context);
	var affordable = choice.costArray == null || honeycomb.canAfford(choice.costArray);
	//A host that resolves nothing offers everything: in the gallery every branch is open -- a cost that
	//cannot be paid is not a cost here -- and none of them is previewed, because a preview would promise
	//experience and weakness that a reread never pays.
	var showsOutcome = honeycomb.eventHost().appliesEffects !== false;
	var enabled = showsOutcome == false || (conditionMet && affordable);

	//The page the button was drawn for travels with it. Every beat of a scene shows one button in the
	//same place, so without this a second click landing after the panel had already turned would resolve
	//against the next page's button at that same position: one double-click on Continue would run two
	//page-turns and the player would see beat one and then beat three. `choose` drops a click whose page
	//has already gone, matched on the page rather than on a timer, so fast play is never punished and a
	//stale click can never land.
	var fromPage = honeycomb.eventOverlay.pageIndex == null ? "" : String(honeycomb.eventOverlay.pageIndex);
	//A PURE PAGE-TURN IS A BUTTON, NOT A DECISION. `Continue` and `Later...` do nothing but show the next
	//beat -- no effects, no cost, nothing to weigh -- so drawing them as a choice row with an outcome
	//preview underneath made the one button a linear scene has look unlike every other button in the
	//game. Drawn as a primary button instead, and its preview line is not drawn at all: there is no
	//outcome to preview, and "The scene goes on." under a Continue button is noise.
	var advances = choice.goToPage != null && choice.costArray == null &&
		(choice.effectArray == null || choice.effectArray.length === 0);
	var markup = '<div class="hcEventChoice' + (advances ? " hcEventChoiceAdvance" : "") + (enabled ? "" : " hcDisabled") + '"' +
		(enabled ? ' onclick="honeycomb.eventOverlay.choose(\'' + event.index + "'," + choiceIndex + ",null,'" + fromPage + "')\"" : "") + ">";
	markup += '<div class="hcGrow">';
	markup += '<div class="hcEventChoiceText">' + honeycomb.escapeText(honeycomb.eventOverlay.say(choice.text)) + "</div>";

	//What taking it will do, spelled out. Rest did this and ordinary events did not; now they all do.
	var preview = (showsOutcome == false || advances) ? "" : honeycomb.eventOverlay.say(honeycomb.eventOverlay.previewText(choice));
	if (preview !== "") markup += '<div class="hcEventChoicePreview">' + honeycomb.escapeText(preview) + "</div>";
	//A choice that leaves a Lust Event waiting says so, since the player cannot otherwise tell.
	if (choice.keepsEventReady == true && showsOutcome == true) {
		markup += '<div class="hcEventChoicePreview hcLustText">The event stays ready afterwards.</div>';
	}
	//And what it will do, drawn, before it is taken: every member's bar, numbers and statuses, and the
	//cards and relics it gives or takes as themselves -- all read off one dry run of the choice, so
	//nothing here can disagree with what happens. A random pick keeps its secret: it is drawn as an
	//unknown. Visible without hovering, so it reads the same on a touchscreen.
	//Right-aligned, in a column of its own beside the words: everything on the left would waste the
	//width of the panel.
	var outcomeMarkup = "";
	if (enabled == true && showsOutcome == true && honeycomb.forecast != null) {
		var reading = honeycomb.forecast.forEventChoice(choice);
		outcomeMarkup += honeycomb.ui.miniPartyRow(honeycomb.ui.partyChangeArray(reading), "hcMiniPreview");
		var gainGroupArray = honeycomb.eventOverlay.gainsFrom(reading == null ? [] : reading.log, { preview: true });
		if (gainGroupArray != null && gainGroupArray.length > 0) outcomeMarkup += honeycomb.eventOverlay.renderGains(gainGroupArray, "hcEventGainsPreview");
		//The automatic check: a change the preview cannot show is a content bug, said so in the console
		//of a debug build. The test suite holds every event to the same rule.
		if (reading != null && reading.unexplainedArray.length > 0 && honeycomb.tuning.debug.enabled == true) {
			console.warn("Honeycomb: event '" + event.index + "' choice '" + choice.text + "' does things its preview cannot show: " + reading.unexplainedArray.join("; "));
		}
	}
	markup += "</div>";
	if (outcomeMarkup !== "") markup += '<div class="hcEventChoiceOutcome">' + outcomeMarkup + "</div>";

	//A road not yet travelled says so, which is the whole reason for paying for it. Not in the gallery:
	//taking it there records nothing, so the badge would be an offer the reread cannot honour.
	if (choice.discovery == true && showsOutcome == true && honeycomb.tuning.progression.experienceEnabled == true) {
		var key = honeycomb.eventOverlay.pathKey(event, choiceIndex);
		if (honeycomb.discovery.isKnown("eventPath", key) == false) {
			markup += '<span class="hcDiscoveryTag hcEventPathTag" title="A path you have not taken before">New</span>';
		}
	}

	//A price tag on a choice nothing is charged for is a lie; the gallery drops it with the previews.
	if (choice.costArray != null && showsOutcome == true) {
		markup += '<div class="hcEventChoiceCost' + (affordable ? "" : " hcUnaffordableText") + '">' +
			honeycomb.eventOverlay.costText(choice.costArray) + "</div>";
	}
	if (enabled == false && affordable == false) {
		markup += '<span class="hcTiny hcDim hcNoWrap">Cannot afford</span>';
	}
	markup += "</div>";
	return markup;
};

//Hand-written when the author wrote one, generated from the effects otherwise. Generated text can
//never disagree with what the choice does, which is the same argument the card text follows. An empty
//string counts as none written, so clearing a sentence hands the job back to the generated text.
honeycomb.eventOverlay.previewText = function (choice) {
	//A function preview is computed at draw time, so a rest option can name the numbers it will use.
	if (typeof choice.previewText === "function") return choice.previewText();
	if (choice.previewText != null && choice.previewText !== "") return choice.previewText;
	return honeycomb.describeEffectArray(choice.effectArray);
};

honeycomb.eventOverlay.costText = function (costArray) {
	var pieceArray = [];
	for (var resourceIndex in costArray) {
		if (Object.prototype.hasOwnProperty.call(costArray, resourceIndex) == false) continue;
		var definition = honeycomb.findDefinition(honeycomb.resourceArray, resourceIndex);
		pieceArray.push(costArray[resourceIndex] + " " + (definition == null ? resourceIndex : definition.name));
	}
	return pieceArray.join(", ");
};

//Taking a choice. Resolved through the CHOICE RUNNER rather than a bare resolveEffectArray, so an
//event's effects may stop and ask the player something -- which is what lets rest be an ordinary
//event rather than a bespoke screen with its own card picker.
honeycomb.eventOverlay.choose = function (eventIndex, choiceIndex, answerArray, fromPageIndex) {
	var event = honeycomb.eventVariantFor(honeycomb.findDefinition(honeycomb.eventArray, eventIndex));
	if (event == null) return;
	//A CLICK FROM A PAGE THAT HAS ALREADY TURNED does nothing at all. See renderChoice. Checked only for
	//a first-hand click: the question flow re-enters with an answerArray, replaying a choice that was
	//already accepted, and dropping that would strand the event on a half-resolved page.
	if (answerArray == null && fromPageIndex != null) {
		var onPage = honeycomb.eventOverlay.pageIndex == null ? "" : String(honeycomb.eventOverlay.pageIndex);
		if (onPage !== String(fromPageIndex)) return;
	}
	var choice = honeycomb.eventOverlay.currentChoiceArray(event)[choiceIndex];
	if (choice == null) return;

	//The cost is only taken on the first attempt; a replay after a question has already paid it, and
	//the rewind put it back.
	//A read-only host has no gate: the gallery draws every choice as takeable because none of them costs
	//anything there, so this check must not refuse one anyway -- that would make a clickable option in
	//the gallery silently do nothing.
	if (answerArray == null && honeycomb.eventHost().appliesEffects !== false &&
		choice.costArray != null && honeycomb.canAfford(choice.costArray) == false) return;

	//The party as it stands BEFORE, so the aftermath can show what the choice actually did.
	var beforeArray = {};
	var partyBefore = honeycomb.state.run == null ? [] : honeycomb.state.run.partyArray;
	for (var beforeIndex = 0; beforeIndex < partyBefore.length; beforeIndex++) {
		beforeArray[partyBefore[beforeIndex].instanceId] = partyBefore[beforeIndex].health;
	}

	var attempt = honeycomb.resolveWithChoices({
		answerArray: answerArray,
		buildContext: function () {
			//Effects resolve with no source and no target: an event acts on the world. Anything that
			//needs a target says so with targetOverride. The subject rides along for a Lust Event.
			return honeycomb.newEffectContext({ subjectCharacterIndex: honeycomb.eventOverlay.subject });
		},
		run: function (context) {
			//A host that only shows the event pays nothing, but it still does the scene. The gallery's
			//replay resolves the structural effects and drops the rest, so a Lust Battle is refought while
			//the experience, the weakness and the unlock beside it are not handed out again.
			if (honeycomb.eventHost().appliesEffects === false) {
				honeycomb.resolveEffectArray(honeycomb.structuralEffectArray(choice.effectArray), context);
				return;
			}
			honeycomb.spend(choice.costArray);
			honeycomb.resolveEffectArray(choice.effectArray, context);
		},
	});

	if (attempt.complete == false) {
		honeycomb.overlay.open("choice", {
			request: attempt.choice,
			onAnswer: function (answer) {
				honeycomb.eventOverlay.choose(eventIndex, choiceIndex, attempt.answerArray.concat([answer]));
			},
			//Taking the choice back: the attempt was rolled back the moment the question was asked, so
			//nothing was spent and nothing happened -- the event is simply redrawn on the page it was on,
			//with every option still open.
			onCancel: function () { honeycomb.eventOverlay.repaint(); },
		});
		return;
	}

	//Marked as spent so it does not reappear later in the run. An event opened between runs has no run to
	//mark it on.
	var run = honeycomb.state.run;
	if (run != null && honeycomb.eventHost().recordsSeen == true) {
		if (run.seenEventArray == null) run.seenEventArray = [];
		if (run.seenEventArray.indexOf(eventIndex) < 0) run.seenEventArray.push(eventIndex);
	}
	if (choice.keepsEventReady == true) honeycomb.eventOverlay.keepsEventReady = true;

	honeycomb.eventOverlay.recordDiscoveries(event, choice, choiceIndex);
	honeycomb.platform.sound("rewardTaken");
	honeycomb.eventOverlay.aftermath = honeycomb.eventOverlay.partyAftermath(beforeArray);
	honeycomb.eventOverlay.gains = honeycomb.eventOverlay.gainsFrom(attempt.context == null ? [] : attempt.context.log);
	//A choice can break somebody, mend somebody, or deepen a weakness, and outside a fight there is no
	//replay to play those cut-ins as beats -- so the finished log is walked for them here.
	if (honeycomb.playCutInsFromLog != null) {
		honeycomb.playCutInsFromLog(attempt.context == null ? [] : attempt.context.log);
	}

	//A choice that asked for a fight hands over to it now; everything else about the choice has
	//already happened. The event resumes after the fight is won.
	var holder = honeycomb.pendingCombatHolder();
	if (holder != null && holder.pendingCombat != null) {
		honeycomb.eventOverlay.beginCombat(event, choice, holder.pendingCombat);
		return;
	}

	//A REST SPENDS AN ACTION PER TAKING. When the budget is gone -- or the player moves on -- the event
	//ends; otherwise the campfire stays open, showing what just happened, for the next thing.
	if (event.isRest == true) {
		var lastAction = honeycomb.rest.actionsRemaining <= 1;
		if (choice.endsRest != true) honeycomb.rest.actionsRemaining -= 1;
		//MAIL ORDER hands the visit to the shop and comes BACK to the fire with the actions that are
		//left. The action is already spent above.
		var restRun = honeycomb.state.run;
		if (restRun != null && restRun.pendingShop != null) {
			honeycomb.shop.priceMultiplier = restRun.pendingShop.priceMultiplier;
			restRun.pendingShop = null;
			honeycomb.rest.pendingShopReturn = true;
			//The rest's position and actions must survive the shop trip, refresh included.
			honeycomb.eventState.update({ pageIndex: honeycomb.eventOverlay.pageIndex, resultText: null,
				leadText: null, restActionsRemaining: honeycomb.rest.actionsRemaining });
			honeycomb.eventState.save("eventAction");
			honeycomb.overlay.close("event");
			honeycomb.overlay.open("shop", {});
			return;
		}
		if (choice.endsRest == true || lastAction == true) {
			honeycomb.eventOverlay.resultText = choice.resultText == null ? "" : choice.resultText;
		} else {
			honeycomb.eventOverlay.leadText = choice.resultText == null ? null : choice.resultText;
			honeycomb.eventOverlay.resultText = null;
		}
		honeycomb.eventState.update({ pageIndex: honeycomb.eventOverlay.pageIndex,
			resultText: honeycomb.eventOverlay.resultText, leadText: honeycomb.eventOverlay.leadText,
			restActionsRemaining: honeycomb.rest.actionsRemaining });
		honeycomb.eventState.save("eventAction");
		honeycomb.eventOverlay.repaint(event);
		return;
	}

	//A NON-REST event that opens a shop hands over the same way and does not come back.
	var liveRun = honeycomb.state.run;
	if (liveRun != null && liveRun.pendingShop != null) {
		honeycomb.shop.priceMultiplier = liveRun.pendingShop.priceMultiplier;
		liveRun.pendingShop = null;
		honeycomb.overlay.open("shop", {});
		return;
	}

	//Turning a page keeps the event open; anything else shows what happened and ends it.
	if (choice.goToPage != null) {
		honeycomb.eventOverlay.pageIndex = choice.goToPage;
		honeycomb.eventOverlay.leadText = choice.resultText == null ? null : choice.resultText;
		honeycomb.eventOverlay.resultText = null;
	} else {
		honeycomb.eventOverlay.resultText = choice.resultText == null ? "" : choice.resultText;
	}
	//Record where the event is now, so a refresh resumes on this page rather than restarting it.
	honeycomb.eventState.update({ pageIndex: honeycomb.eventOverlay.pageIndex,
		resultText: honeycomb.eventOverlay.resultText, leadText: honeycomb.eventOverlay.leadText });
	honeycomb.eventState.save("eventAction");
	honeycomb.eventOverlay.repaint(event);
};

//What a choice DID to the party, as {member, before, after}, or null when nobody's health moved.
honeycomb.eventOverlay.partyAftermath = function (beforeArray) {
	var run = honeycomb.state.run;
	if (run == null) return null;
	var anyMoved = false;
	var result = [];
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		var before = beforeArray[member.instanceId];
		if (before == null) continue;
		if (before !== member.health) anyMoved = true;
		result.push({ member: member, before: before, after: member.health });
	}
	return anyMoved ? result : null;
};

//What a choice gave or took, shown as itself rather than described in words: cards appear as cards and
//relics as relics. Read from the choice's own log, so a random pick (the Cardsharp's trade, a random
//relic) shows what actually happened, not what might.
//Each row names the log entry it reads, the group it belongs to, and how one entry is drawn -- a new
//kind of gain worth showing is one row here.
//Each row may also say how it looks in a PREVIEW when the entry was a chance pick (`random` on the
//entry): `drawUnknown` keeps the secret. A row without one shows the same thing either way.
honeycomb.eventOverlay.gainKindArray = [
	{
		index: "deckCardAdded", group: "added", title: "Added to your deck",
		draw: function (entry, preview) {
			//A preview's card exists only inside the dry run that was rolled back; the entry names it.
			var instance = honeycomb.combat.cardInstance(entry.cardId);
			if (instance == null && preview == true && entry.card != null) instance = { instanceId: null, cardIndex: entry.card, ownerInstanceId: entry.ownerInstanceId, upgradeLevel: 0 };
			return honeycomb.eventOverlay.gainCard(instance, "");
		},
		drawUnknown: function () { return honeycomb.eventOverlay.gainUnknownCard("A random card", ""); },
	},
	{
		index: "deckCardRemoved", group: "removed", title: "Removed from your deck",
		//Gone from the deck by now, so it is drawn from what the entry remembered of it.
		draw: function (entry) {
			return honeycomb.eventOverlay.gainCard({ instanceId: null, cardIndex: entry.card,
				ownerInstanceId: entry.ownerInstanceId, upgradeLevel: entry.upgradeLevel == null ? 0 : entry.upgradeLevel }, "hcGainRemoved");
		},
		drawUnknown: function () { return honeycomb.eventOverlay.gainUnknownCard("A random card", "hcGainRemoved"); },
	},
	{
		index: "cardUpgraded", group: "upgraded", title: "Upgraded",
		draw: function (entry) { return honeycomb.eventOverlay.gainCard(honeycomb.combat.cardInstance(entry.cardId), "hcGainUpgraded"); },
	},
	{
		index: "relicGained", group: "relic", title: "Relics",
		draw: function (entry) { return honeycomb.eventOverlay.gainRelic(entry.relic, null); },
		drawUnknown: function () { return honeycomb.eventOverlay.gainUnknownRelic(); },
	},
	{
		//Already carried: its worth in experience instead, said on the relic it would have been.
		index: "relicDuplicate", group: "relic", title: "Relics",
		draw: function (entry) {
			return honeycomb.eventOverlay.gainRelic(entry.relic, entry.experience > 0
				? "Already carried: +" + entry.experience + " Experience instead." : "Already carried.");
		},
		drawUnknown: function () { return honeycomb.eventOverlay.gainUnknownRelic(); },
	},
	{
		//Gold, experience, anything a rest option pays. One tile, so Scavenge and Exercise say so.
		index: "resource", group: "resource", title: "Gained",
		draw: function (entry) {
			var resource = honeycomb.findDefinition(honeycomb.resourceArray, entry.resource);
			var name = resource == null ? entry.resource : resource.name;
			var glyph = entry.resource == "gold" ? "star" : "scroll";
			return '<div class="hcRewardTile hcEventGainRelic">' +
				honeycomb.ui.iconTag(null, glyph, "#c9a961", { className: "hcRewardIcon" }) +
				'<div class="hcRewardValue hcGold">' + (entry.amount > 0 ? "+" : "") + entry.amount + " " +
				honeycomb.escapeText(name) + "</div></div>";
		},
	},
	{
		//A weakness raised by whole ranks, and the rank it reached.
		index: "weaknessRanked", group: "weakness", title: "Weakness",
		draw: function (entry) {
			var character = honeycomb.findDefinition(honeycomb.characterArray, entry.characterIndex);
			var tag = honeycomb.findDefinition(honeycomb.cardTagArray, entry.tag);
			var rank = honeycomb.lust.rankDefinitionByRank(entry.rank);
			return '<div class="hcRewardTile hcEventGainRelic">' +
				honeycomb.ui.iconTag(null, "heart", "#e0569a", { className: "hcRewardIcon" }) +
				'<div class="hcRewardValue hcGold">' + honeycomb.escapeText((character == null ? "" : character.name + ": ") +
					(tag == null ? entry.tag : tag.name) + " +" + entry.ranks) + "</div>" +
				(rank == null ? "" : '<div class="hcTiny hcMuted">' + honeycomb.escapeText("Now rank " + rank.rank + ", " + rank.name + ".") + "</div>") +
				"</div>";
		},
	},
	{
		//Fortune Telling / Gamble: the card the old one BECAME.
		index: "cardTransformed", group: "transformed", title: "Transformed",
		draw: function (entry) {
			return honeycomb.eventOverlay.gainCard({ instanceId: null, cardIndex: entry.card, upgradeLevel: 0 }, "hcGainUpgraded");
		},
	},
	{
		//Preptime: the promise, with the HP it works out to across the party.
		index: "preptime", group: "preptime", title: "Prepared",
		draw: function (entry) {
			var run = honeycomb.state == null ? null : honeycomb.state.run;
			var low = null, high = null;
			for (var memberIndex = 0; run != null && memberIndex < run.partyArray.length; memberIndex++) {
				var amount = Math.round(run.partyArray[memberIndex].maxHealth * (entry.fraction == null ? 0 : entry.fraction));
				low = low == null ? amount : Math.min(low, amount);
				high = high == null ? amount : Math.max(high, amount);
			}
			var detail = low == null ? "At the start of the next battle."
				: low + (high === low ? "" : "-" + high) + " Temporary HP each, next battle.";
			return '<div class="hcRewardTile hcEventGainRelic">' +
				honeycomb.ui.iconTag(null, "shield", "#7fd1a6", { className: "hcRewardIcon" }) +
				'<div class="hcRewardValue hcGold">Temporary HP</div>' +
				'<div class="hcTiny hcMuted">' + honeycomb.escapeText(detail) + "</div></div>";
		},
	},
	{
		//Laundry: ONE tile however deep the pile, with the whole list in its tooltip. Drawn as a native
		//title so thirty curses cannot flood the panel.
		index: "deckCursePurged", group: "removed", title: "Exhausted",
		draw: function (entry) {
			var cardArray = entry.cardArray == null ? [] : entry.cardArray;
			var nameArray = [];
			for (var scanIndex = 0; scanIndex < cardArray.length; scanIndex++) {
				var definition = honeycomb.findDefinition(honeycomb.cardArray, cardArray[scanIndex]);
				nameArray.push(definition == null ? cardArray[scanIndex] : definition.name);
			}
			var label = cardArray.length + (cardArray.length === 1 ? " curse" : " curses");
			return '<div class="hcRewardTile hcEventGainRelic" title="' + honeycomb.escapeAttribute(nameArray.join(", ")) + '">' +
				honeycomb.ui.iconTag(null, "skull", "#8a8a8a", { className: "hcRewardIcon" }) +
				'<div class="hcRewardValue hcGold">' + label + "</div>" +
				'<div class="hcTiny hcMuted">Hover to list them.</div></div>';
		},
	},
	{
		index: "journal", group: "journal", title: "Studied",
		draw: function (entry) {
			return honeycomb.eventOverlay.gainCard({ instanceId: null, cardIndex: entry.card, upgradeLevel: 0 }, "") +
				'<div class="hcTiny hcMuted">(' + honeycomb.tuning.rest.journalWeightMultiplier + "x more likely in post-battle rewards.)</div>";
		},
	},
];

//The choice's log, sorted into the groups above in first-seen order: [{group, title, markupArray}].
//`options.preview` is a look BEFORE the choice is taken: chance picks are drawn as unknowns.
honeycomb.eventOverlay.gainsFrom = function (logArray, options) {
	var preview = options != null && options.preview == true;
	var groupArray = [];
	for (var entryIndex = 0; entryIndex < logArray.length; entryIndex++) {
		var entry = logArray[entryIndex];
		var kind = honeycomb.findDefinition(honeycomb.eventOverlay.gainKindArray, entry.type);
		if (kind == null) continue;
		var markup = preview && entry.random == true && kind.drawUnknown != null ? kind.drawUnknown(entry) : kind.draw(entry, preview);
		if (markup === "") continue;
		var group = null;
		for (var groupIndex = 0; groupIndex < groupArray.length; groupIndex++) {
			if (groupArray[groupIndex].group == kind.group) group = groupArray[groupIndex];
		}
		if (group == null) {
			group = { group: kind.group, title: kind.title, markupArray: [] };
			groupArray.push(group);
		}
		group.markupArray.push(markup);
	}
	return groupArray.length === 0 ? null : groupArray;
};

honeycomb.eventOverlay.renderGains = function (groupArray, className) {
	if (groupArray == null) return "";
	var markup = '<div class="hcEventGains' + (className == null ? "" : " " + className) + '">';
	for (var groupIndex = 0; groupIndex < groupArray.length; groupIndex++) {
		var group = groupArray[groupIndex];
		markup += '<div class="hcEventGainGroup hcGain-' + group.group + '">' +
			'<div class="hcEventGainTitle">' + honeycomb.escapeText(group.title) + "</div>" +
			'<div class="hcEventGainRow">' + group.markupArray.join("") + "</div></div>";
	}
	return markup + "</div>";
};

//One card, drawn at reward size, whose it is under it.
honeycomb.eventOverlay.gainCard = function (instance, className) {
	var resolved = instance == null ? null : honeycomb.resolveCard(instance);
	if (resolved == null) return "";
	var owner = honeycomb.cardOwnerMember(resolved);
	var definition = owner == null ? null : honeycomb.findDefinition(honeycomb.characterArray, owner.characterIndex);
	return '<div class="hcRewardCardSlot hcEventGainCard ' + className + '">' +
		honeycomb.ui.card(resolved, { size: "small", showAffinity: false }) +
		(definition == null ? "" : '<div class="hcRewardOwner" style="--hcAccent:' + definition.colorHint + '">' +
			honeycomb.escapeText(definition.name) + "</div>") + "</div>";
};

//One relic as a tile: its icon, name and what it does; `note` for a relic that was not given after all.
//A chance pick, before it is made: a face-down card, or a relic with no face. Says what it is, not
//which -- the whole point of "you will not get to choose which".
honeycomb.eventOverlay.gainUnknownCard = function (label, className) {
	return '<div class="hcRewardCardSlot hcEventGainCard hcGainUnknown ' + className + '">' +
		'<div class="hcCard hcCardBack hcPlayerCardBack">' +
		honeycomb.imageTag("cards/frames/playerBack", { className: "hcCardBackArt", alt: "", silentFallback: true }) +
		'<div class="hcCardBackMark">?</div></div>' +
		'<div class="hcRewardOwner">' + honeycomb.escapeText(label) + "</div></div>";
};

honeycomb.eventOverlay.gainUnknownRelic = function () {
	return '<div class="hcRewardTile hcEventGainRelic hcGainUnknown">' +
		honeycomb.ui.iconTag(null, "question", "#c9a961", { className: "hcRewardIcon" }) +
		'<div class="hcRewardValue hcGold">A random relic</div>' +
		'<div class="hcTiny hcMuted">One you do not already carry.</div></div>';
};

honeycomb.eventOverlay.gainRelic = function (relicIndex, note) {
	var relic = relicIndex == null ? null : honeycomb.findDefinition(honeycomb.relicArray, relicIndex);
	if (relic == null && note == null) return "";
	return '<div class="hcRewardTile hcEventGainRelic' + (note == null ? "" : " hcGainDuplicate") + '"' +
		(relic == null ? "" : honeycomb.tooltip.attributes("relic", relic.index)) + ">" +
		honeycomb.ui.iconTag(relic == null ? null : relic.iconPath, "shard", "#c9a961", { className: "hcRewardIcon" }) +
		'<div class="hcRewardValue hcGold">' + honeycomb.escapeText(relic == null ? "Nothing left to find" : relic.name) + "</div>" +
		'<div class="hcTiny hcMuted">' + honeycomb.escapeText(note == null ? relic.description : note) + "</div></div>";
};

//Repaint in place rather than reopening, so the panel does not flash.
//`event` is optional: with none, the one currently open is looked up -- including its broken variant,
//the same way the overlay's own build does. A caller that already has the event in hand still passes
//it, and a caller that only knows something changed (a cancelled question) does not have to.
honeycomb.eventOverlay.repaint = function (event) {
	var shown = event != null ? event
		: honeycomb.eventVariantFor(honeycomb.findDefinition(honeycomb.eventArray, honeycomb.eventOverlay.eventIndex));
	if (shown == null) return;
	var layer = document.getElementById(honeycomb.tuning.dom.overlayIdPrefix + "event");
	if (layer != null) layer.innerHTML = honeycomb.eventOverlay.render(shown, honeycomb.eventOverlay.resultText);
};

//The ledger key for a choice on the page now showing.
honeycomb.eventOverlay.pathKey = function (event, choiceIndex) {
	var choice = honeycomb.eventOverlay.currentChoiceArray(event)[choiceIndex];
	var position = honeycomb.eventOverlay.pageIndex == null
		? String(choiceIndex)
		: honeycomb.eventOverlay.pageIndex + "." + choiceIndex;
	return honeycomb.discovery.eventPathKey(event, choice, position);
};

//Recorded on RESOLVING rather than on opening, so a first-time bonus cannot be farmed by opening an
//event and walking away from it. The event itself counts once per visit however many pages it turns;
//a path counts whenever it is a road the player has not taken before.
honeycomb.eventOverlay.recordDiscoveries = function (event, choice, choiceIndex) {
	//A reread finds nothing: the gallery replays scenes the player has already been paid for, and paying
	//again would make the gallery an experience tap.
	if (honeycomb.eventHost().appliesEffects === false) return;
	if (honeycomb.eventOverlay.discoveryRecorded != true && event.discovery !== false) {
		honeycomb.eventOverlay.lastDiscovery = honeycomb.discovery.record("event", event.index, null);
	}
	honeycomb.eventOverlay.discoveryRecorded = true;
	if (choice.discovery == true) {
		honeycomb.discovery.record("eventPath", honeycomb.eventOverlay.pathKey(event, choiceIndex), null);
	}
};

//From an event to a fight. The continuation carries everything needed to come back: which event,
//which page, and what the choice said happened, so the player returns to the story they left.
honeycomb.eventOverlay.beginCombat = function (event, choice, pending) {
	var host = honeycomb.eventHost();
	if (typeof host.beginCombat === "function") {
		honeycomb.pendingCombatHolder().pendingCombat = null;
		host.beginCombat(event, choice, pending);
		return;
	}
	var run = honeycomb.state.run;
	run.pendingCombat = null;
	var nodeId = run.map == null ? null : run.map.currentNodeId;
	var continuation = pending.continuation != null ? pending.continuation : {
		index: "event",
		eventIndex: event.index,
		pageIndex: pending.victoryPage,
		resultText: pending.victoryPage == null ? (choice.resultText == null ? "" : choice.resultText) : null,
		nodeId: nodeId,
	};
	honeycomb.overlay.close("event");
	honeycomb.scene.go("combat", {
		encounterIndex: pending.encounterIndex,
		mapNodeId: nodeId,
		continuation: continuation,
		rewardArray: pending.rewardArray,
		victoryConditionArray: pending.victoryConditionArray,
		defeatConditionArray: pending.defeatConditionArray,
	});
};

//What leaving the event does belongs to where it was opened from. See honeycomb.eventHostArray.
honeycomb.eventOverlay.finish = function () {
	//A rest carries the debug overrides, if it was opened by the Rest Lab; leaving puts them back.
	honeycomb.rest.endDebug();
	honeycomb.eventHost().finish();
};

//---------------------------------------------------------------------------------------------------
//Treasure
//---------------------------------------------------------------------------------------------------
//Gold and a relic. Rolled when the overlay opens rather than at generation time, because unlike an
//event the contents are not something a route decision should be made on.
honeycomb.overlay.register({
	index: "treasure",
	build: function (layer) {
		var settings = honeycomb.treasureTuning;
		var gold = honeycomb.rng.range(honeycomb.tuning.rng.streamArray.reward,
			settings.goldMinimum, settings.goldMaximum);
		var relic = honeycomb.rollRelicOffer();

		honeycomb.addResource("gold", gold);
		if (relic != null) honeycomb.grantRelic(relic.index, honeycomb.newEffectContext({}));
		honeycomb.platform.sound("rewardTaken");

		var markup = '<div class="hcOverlayPanel">';
		markup += '<h2 class="hcOverlayTitle">Treasure</h2>';
		markup += '<div class="hcRewardRow">';
		markup += '<div class="hcRewardTile">' +
			honeycomb.ui.resourceIcon("gold", "hcRewardIcon") +
			'<div class="hcRewardValue">+' + gold + "</div>" +
			'<div class="hcTiny hcMuted">Gold</div></div>';
		if (relic != null) {
			markup += '<div class="hcRewardTile">' +
				honeycomb.ui.iconTag(relic.iconPath, "shard", "#c9a961", { className: "hcRewardIcon" }) +
				'<div class="hcRewardValue hcGold">' + honeycomb.escapeText(relic.name) + "</div>" +
				'<div class="hcTiny hcMuted">' + honeycomb.escapeText(relic.description) + "</div></div>";
		}
		markup += "</div>";
		markup += '<div class="hcOverlayButtonRow">' +
			'<div class="hcButton hcPrimary" onclick="honeycomb.overlay.close(\'treasure\');honeycomb.map.returnToMap()">Take it</div></div>';
		markup += "</div>";
		layer.innerHTML = markup;
	},
});

honeycomb.treasureTuning = {
	goldMinimum: 35,
	goldMaximum: 80,
	relicChance: 0.6,
};

//Picks a relic the party does not already carry.
//
//The same list the fight reward draws from. A separate candidate list here would skip
//`offerCondition` and hand out a character-gated relic to a party that does not qualify for it --
//Nettle's Cracked Ampoule to a party without Nettle, Clemence's Reliquary of Tears to a party without
//her. `uncarriedRelicArray` is the one list that knows the gate, and it also refuses a relic that would
//duplicate rather than only one already held.
honeycomb.rollRelicOffer = function () {
	if (honeycomb.rng.next(honeycomb.tuning.rng.streamArray.reward) > honeycomb.treasureTuning.relicChance) return null;
	var candidateArray = honeycomb.uncarriedRelicArray(null, "common").filter(function (relic) {
		//Starter relics belong to characters, not to the loot pool.
		return relic.rarity != "starter";
	});
	return honeycomb.rng.pick(honeycomb.tuning.rng.streamArray.reward, candidateArray);
};

//---------------------------------------------------------------------------------------------------
//Rest
//---------------------------------------------------------------------------------------------------
//There is no rest overlay. Rest is an ordinary event -- see `theCampfire` in honeycomb-content-map.js --
//drawn by the event screen and resolved by the effect layer, since a choice can stop resolution and ask
//the player something.
//
//The one thing not expressible as an effect is the ability recharge, which is a consequence of resting
//rather than of any particular choice. It fires when a rest event is left.
honeycomb.restTuning = {
	//Fraction of maximum health the Sleep option restores. Mirrored by the effect's own arithmetic;
	//kept here so a balance pass has a named number to find.
	healFraction: 1 / 3,
};

//(Deck-card questions go through the choice overlay and the deck services in honeycomb-content-map.js.)

//---------------------------------------------------------------------------------------------------
//Shop
//---------------------------------------------------------------------------------------------------
//Cards, relics and a card-removal service. Stock is rolled from the shop stream when the overlay opens
//and then remembered on the node, so leaving and returning does not reroll the shelves.
honeycomb.overlay.register({
	index: "shop",
	build: function (layer, params) {
		var node = honeycomb.map.findNode(params.nodeId);
		if (node != null && node.shopStock == null) node.shopStock = honeycomb.shop.rollStock();
		var stock;
		if (node != null) {
			stock = node.shopStock;
		} else {
			//A shop opened OUTSIDE a map node (Mail Order at a rest): there is no node to hold the stock,
			//so the overlay holds it until the shop is left.
			if (honeycomb.shop.standaloneStock == null) honeycomb.shop.standaloneStock = honeycomb.shop.rollStock();
			stock = honeycomb.shop.standaloneStock;
		}
		//A shelf saved before a guaranteed relic became offerable gains it now.
		honeycomb.shop.stockGuaranteedRelics(stock);

		layer.innerHTML = honeycomb.shop.render(stock, params.nodeId);
	},
});

honeycomb.shop = {};
//Mail Order (rest option) bends every price while its shop is open; the default is no bend. Reset on
//leaving, so the next ordinary shop is priced normally.
honeycomb.shop.priceMultiplier = 1;
//Stock for a shop opened with no map node to hold it (Mail Order at a rest). Null between visits.
honeycomb.shop.standaloneStock = null;

//The stock a shop is showing: held on the map node, or on the overlay for a node-less (Mail Order) shop.
honeycomb.shop.stockFor = function (nodeId) {
	var node = honeycomb.map.findNode(nodeId);
	if (node != null && node.shopStock != null) return node.shopStock;
	return honeycomb.shop.standaloneStock;
};

honeycomb.shop.rollStock = function () {
	var settings = honeycomb.shopTuning;
	var stream = honeycomb.tuning.rng.streamArray.shop;
	var run = honeycomb.state.run;

	//TREE NODES, party-wide. Folds the party's selected shop nodes into the stock: a card discount,
	//an outfit/common-relic discount, a cheaper removal, and extra card slots. The "Always" fields are
	//the benched tier (Purge2), read from the profile.
	var cardDiscount = honeycomb.partyFieldTotal("shopCardDiscount") + honeycomb.profileFieldTotal("shopCardDiscountAlways");
	var unlockDiscount = honeycomb.partyFieldTotal("unlockDiscount") + honeycomb.profileFieldTotal("unlockDiscountAlways");
	var extraCardSlots = honeycomb.partyFieldTotal("shopExtraSlots") + honeycomb.profileFieldTotal("shopExtraSlotsAlways");
	function discounted(price, fraction) {
		return Math.max(1, Math.round(price * (1 - Math.min(0.9, fraction))));
	}

	//Cards are drawn from the pools of characters actually in the party, plus neutrals, so a shop
	//stays relevant to the team that was built.
	var partyIndexArray = ["neutral"];
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		partyIndexArray.push(run.partyArray[memberIndex].characterIndex);
	}

	var cardCandidateArray = [];
	for (var cardIndex = 0; cardIndex < honeycomb.cardArray.length; cardIndex++) {
		var card = honeycomb.cardArray[cardIndex];
		if (partyIndexArray.indexOf(card.characterIndex) < 0) continue;
		if (honeycomb.tuning.reward.offerableRarityArray.indexOf(card.rarity) < 0) continue;
		//A banished card never reaches the shelf.
		if (honeycomb.cardIsBanished(card.index) == true) continue;
		//An outfit that blocks a sister mechanic blocks it on the shelf too.
		if (honeycomb.archetypeBlockedForParty(card) == true) continue;
		//A costume-only card stays off the shelf unless the outfit it names is worn.
		if (honeycomb.cardOfferableForParty(card) == false) continue;
		cardCandidateArray.push(card);
	}

	var cardStockArray = [];
	for (var slotIndex = 0; slotIndex < settings.cardSlotCount + extraCardSlots; slotIndex++) {
		var remainingArray = [];
		for (var scanIndex = 0; scanIndex < cardCandidateArray.length; scanIndex++) {
			var alreadyStocked = false;
			for (var stockIndex = 0; stockIndex < cardStockArray.length; stockIndex++) {
				if (cardStockArray[stockIndex].index == cardCandidateArray[scanIndex].index) { alreadyStocked = true; break; }
			}
			if (alreadyStocked == false) remainingArray.push(cardCandidateArray[scanIndex]);
		}
		var picked = honeycomb.rng.pick(stream, remainingArray);
		if (picked == null) break;
		cardStockArray.push({
			index: picked.index,
			price: discounted(honeycomb.shop.priceFor(settings.cardPriceArray[picked.rarity], stream), cardDiscount),
			sold: false,
		});
	}

	var relicStockArray = [];
	//>>> LANE ANA | gauntlet | shop shelf >>>
	//A relic the shop always carries. These take shelf slots of their own, ahead of the roll and without
	//touching the shop stream when there are none -- so every existing seed stocks exactly what it
	//stocked before.
	honeycomb.shop.stockGuaranteedRelics({ relicArray: relicStockArray });
	//<<< LANE ANA | gauntlet | shop shelf <<<
	//Wider Shelves adds a relic slot as well as a card slot: the same extra count, both shelves.
	for (var relicSlotIndex = 0; relicSlotIndex < settings.relicSlotCount + extraCardSlots; relicSlotIndex++) {
		var relic = honeycomb.rollRelicOfferForShop(relicStockArray);
		if (relic == null) break;
		var relicPrice = honeycomb.shop.priceFor(settings.relicPriceArray[relic.rarity], stream);
		if (relic.rarity == "common") relicPrice = discounted(relicPrice, unlockDiscount);
		relicStockArray.push({
			index: relic.index,
			price: relicPrice,
			sold: false,
		});
	}

	//Outfits on the shelf. Drawn from the party's own characters, and only ones they do not already
	//have -- a shop offering something already owned is a wasted slot.
	var outfitStockArray = [];
	var outfitCandidateArray = [];
	for (var partyIndex = 0; partyIndex < run.partyArray.length; partyIndex++) {
		var character = honeycomb.findDefinition(honeycomb.characterArray, run.partyArray[partyIndex].characterIndex);
		if (character == null) continue;
		for (var outfitIndex = 0; outfitIndex < character.outfitArray.length; outfitIndex++) {
			var outfit = character.outfitArray[outfitIndex];
			if (honeycomb.unlocks.isUnlocked("outfit", outfit.index, character.index) == true) continue;
			outfitCandidateArray.push({ characterIndex: character.index, index: outfit.index });
		}
	}
	for (var outfitSlotIndex = 0; outfitSlotIndex < settings.outfitSlotCount; outfitSlotIndex++) {
		var remainingOutfitArray = [];
		for (var candidateIndex = 0; candidateIndex < outfitCandidateArray.length; candidateIndex++) {
			var alreadyOffered = false;
			for (var offeredIndex = 0; offeredIndex < outfitStockArray.length; offeredIndex++) {
				if (outfitStockArray[offeredIndex].index == outfitCandidateArray[candidateIndex].index) {
					alreadyOffered = true; break;
				}
			}
			if (alreadyOffered == false) remainingOutfitArray.push(outfitCandidateArray[candidateIndex]);
		}
		var pickedOutfit = honeycomb.rng.pick(stream, remainingOutfitArray);
		if (pickedOutfit == null) break;
		outfitStockArray.push({
			characterIndex: pickedOutfit.characterIndex,
			index: pickedOutfit.index,
			price: discounted(honeycomb.shop.priceFor(settings.outfitPrice, stream), unlockDiscount),
			sold: false,
		});
	}

	return {
		cardArray: cardStockArray,
		relicArray: relicStockArray,
		outfitArray: outfitStockArray,
		removalCost: Math.max(1, Math.round(settings.removalCost * honeycomb.shop.priceMultiplier)),
		removalsUsed: 0,
	};
};

//>>> LANE ANA | gauntlet | shop shelf helper >>>
//The relics every shop carries while they may be offered: `shopGuaranteed: true`, not already held, and
//passing their own `offerCondition` (honeycomb.relicOfferable) -- which is where every real gate lives.
//Pool is deliberately NOT asked: a relic kept out of the chance pools is exactly what wants a shelf.
honeycomb.shop.guaranteedRelicArray = function () {
	var result = [];
	for (var relicIndex = 0; relicIndex < honeycomb.relicArray.length; relicIndex++) {
		var relic = honeycomb.relicArray[relicIndex];
		if (relic.shopGuaranteed != true) continue;
		if (honeycomb.hasRelic(relic.index)) continue;
		if (honeycomb.relicOfferable(relic) != true) continue;
		result.push(relic);
	}
	return result;
};

//Puts every guaranteed relic the stock is missing at the front of its relic shelf, and returns how many
//it added. Called when stock is rolled and every time a shop opens, since a save whose stock was rolled
//before a relic's release switch turned on would otherwise never see it: a check made only at the roll
//could never reach a save already in progress.
//A relic already on the shelf, sold or not, is never added twice; a shop with nothing missing touches
//no stream, so reopening an ordinary shop leaves the run's RNG where it was.
honeycomb.shop.stockGuaranteedRelics = function (stock) {
	if (stock == null) return 0;
	if (stock.relicArray == null) stock.relicArray = [];
	var stream = honeycomb.tuning.rng.streamArray.shop;
	var guaranteedArray = honeycomb.shop.guaranteedRelicArray();
	var addedArray = [];
	for (var guaranteedIndex = 0; guaranteedIndex < guaranteedArray.length; guaranteedIndex++) {
		var relic = guaranteedArray[guaranteedIndex];
		var stocked = false;
		for (var scanIndex = 0; scanIndex < stock.relicArray.length; scanIndex++) {
			if (stock.relicArray[scanIndex].index == relic.index) { stocked = true; break; }
		}
		if (stocked == true) continue;
		addedArray.push({
			index: relic.index,
			price: honeycomb.shop.priceFor(honeycomb.shopTuning.relicPriceArray[relic.rarity], stream),
			sold: false,
		});
	}
	for (var addedIndex = addedArray.length - 1; addedIndex >= 0; addedIndex--) stock.relicArray.unshift(addedArray[addedIndex]);
	return addedArray.length;
};
//<<< LANE ANA | gauntlet | shop shelf helper <<<

honeycomb.rollRelicOfferForShop = function (alreadyStockedArray) {
	var candidateArray = [];
	for (var relicIndex = 0; relicIndex < honeycomb.relicArray.length; relicIndex++) {
		var relic = honeycomb.relicArray[relicIndex];
		if (relic.rarity == "starter" || honeycomb.relicPool(relic) != "common") continue;
		if (honeycomb.hasRelic(relic.index)) continue;
		if (honeycomb.relicOfferable(relic) == false) continue;
		var stocked = false;
		for (var scanIndex = 0; scanIndex < alreadyStockedArray.length; scanIndex++) {
			if (alreadyStockedArray[scanIndex].index == relic.index) { stocked = true; break; }
		}
		if (stocked == false) candidateArray.push(relic);
	}
	return honeycomb.rng.pick(honeycomb.tuning.rng.streamArray.shop, candidateArray);
};

//Applies the configured price variance to a base price.
honeycomb.shop.priceFor = function (basePrice, stream) {
	var base = basePrice == null ? honeycomb.shopTuning.cardPriceArray.common : basePrice;
	var variance = honeycomb.shopTuning.priceVariance;
	var roll = (honeycomb.rng.next(stream) * 2) - 1;
	return Math.max(1, Math.round(base * honeycomb.shop.priceMultiplier * (1 + roll * variance)));
};

//THE SHOP IS A SCENE, on the layout the mockup shows: full-bleed art, the panel down the left, the
//shopkeeper standing on the right, the top bar persisting over the top. It shares the event screen's
//structural classes rather than having its own, because a shop and a full-screen event ARE the same
//layout with different contents.
//
//Tabs are CARDS / OUTFITS / RELICS, per the mockup. Outfits are stock now: the shop sells them, which
//is what `outfitArray` in the stock is for.
honeycomb.shop.tabArray = [
	{ index: "cards", name: "Cards" },
	{ index: "outfits", name: "Outfits" },
	{ index: "relics", name: "Relics" },
];

//Which tab is open, and which slot is selected. Cursors on the screen, not saved state.
honeycomb.shop.activeTab = "cards";
honeycomb.shop.selected = null;

honeycomb.shop.render = function (stock, nodeId) {
	var markup = '<div class="hcEventPanel hcEventPanel-scene hcShopScene">';

	//The shop's background painting, fitted whole. See honeycomb.ui.backdrop.
	markup += honeycomb.ui.backdrop("shops/backdrop-default");
	markup += '<div class="hcEventTopBar">' + honeycomb.ui.topBar({ showExit: true }) + "</div>";
	markup += '<div class="hcEventSpeaker">' +
		honeycomb.imageTag("shops/keeper-default",
			{ className: "hcEventSpeakerArt", alt: "The shopkeeper", silentFallback: true }) + "</div>";

	markup += '<div class="hcEventPane hcShopPane">';
	markup += '<h2 class="hcOverlayTitle hcEventTitle">The Shop</h2>';

	markup += '<div class="hcSegmented hcShopTabs">';
	for (var tabIndex = 0; tabIndex < honeycomb.shop.tabArray.length; tabIndex++) {
		var tab = honeycomb.shop.tabArray[tabIndex];
		markup += '<div class="hcSegment' + (honeycomb.shop.activeTab == tab.index ? " hcOn" : "") + '"' +
			' onclick="honeycomb.shop.setTab(\'' + tab.index + "','" + nodeId + '\')">' +
			honeycomb.escapeText(tab.name) + "</div>";
	}
	markup += "</div>";

	markup += honeycomb.shop.partyConditionMarkup();

	markup += '<div class="hcShopStock hcScroll">';
	markup += honeycomb.shop.renderTab(stock, nodeId);
	markup += "</div>";

	//The footer the mockup shows: what buying the selection costs, and the way out.
	markup += honeycomb.shop.renderFooter(stock, nodeId);
	markup += "</div></div>";
	return markup;
};

//The party's condition, on the shop screen. The shop sells healing and Lust treatment at its counter,
//so the numbers those prices are worth judging against are shown here rather than two screens away.
//One row per member: face, name, health over maximum, Lust, and broken when they are. Read off the
//run, so the benched roster is not in it.
honeycomb.shop.partyConditionMarkup = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.partyArray == null || run.partyArray.length === 0) return "";
	var markup = '<div class="hcShopParty">';
	var shown = 0;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		if (member == null || member.characterIndex == null) continue;
		var definition = honeycomb.findDefinition(honeycomb.characterArray, member.characterIndex);
		if (definition == null) continue;
		shown += 1;
		markup += '<div class="hcShopPartyRow">';
		markup += honeycomb.art.portraitTag(member.characterIndex, member.outfitIndex,
			{ className: "hcShopPartyFace", alt: definition.name });
		markup += '<div class="hcGrow"><div class="hcTiny hcGold">' + honeycomb.escapeText(definition.name) +
			(member.broken == true ? ' <span class="hcPartyBrokenTag">BROKEN</span>' : "") + "</div>";
		markup += '<div class="hcTiny hcMuted">' + member.health + " / " + member.maxHealth + " HP" +
			(member.temporaryHealth > 0 ? " (+" + member.temporaryHealth + ")" : "") +
			" &middot; " + (member.lust == null ? 0 : member.lust) + " Lust</div>";
		markup += "</div></div>";
	}
	markup += "</div>";
	return shown === 0 ? "" : markup;
};

honeycomb.shop.renderTab = function (stock, nodeId) {
	if (honeycomb.shop.activeTab == "relics") {
		if (stock.relicArray.length === 0) return '<div class="hcTabNote">Nothing on the shelf today.</div>';
		var relicMarkup = "";
		for (var relicIndex = 0; relicIndex < stock.relicArray.length; relicIndex++) {
			relicMarkup += honeycomb.shop.renderRelicSlot(stock, relicIndex, nodeId);
		}
		return relicMarkup;
	}

	if (honeycomb.shop.activeTab == "outfits") {
		if (stock.outfitArray == null || stock.outfitArray.length === 0) {
			return '<div class="hcTabNote">No costumes today. Come back down another time.</div>';
		}
		var outfitMarkup = '<div class="hcShopOutfitGrid">';
		for (var outfitIndex = 0; outfitIndex < stock.outfitArray.length; outfitIndex++) {
			outfitMarkup += honeycomb.shop.renderOutfitSlot(stock, outfitIndex, nodeId);
		}
		outfitMarkup += "</div>";
		return outfitMarkup;
	}

	var cardMarkup = '<div class="hcShopCardGrid">';
	for (var cardIndex = 0; cardIndex < stock.cardArray.length; cardIndex++) {
		cardMarkup += honeycomb.shop.renderCardSlot(stock, cardIndex, nodeId);
	}
	cardMarkup += "</div>";

	//Card removal is a service rather than stock, and it belongs beside the cards.
	var removalAffordable = honeycomb.getResource("gold") >= stock.removalCost;
	cardMarkup += '<div class="hcShopService' + (removalAffordable ? "" : " hcDisabled") + '"' +
		(removalAffordable ? ' onclick="honeycomb.shop.beginRemoval(\'' + nodeId + '\')"' : "") + ">" +
		honeycomb.ui.iconTag(null, "shard", "#d3455f", { className: "hcRelicIcon" }) +
		'<div class="hcGrow"><div>Remove a card</div>' +
		'<div class="hcTiny hcMuted">Take one card out of the deck for good.</div></div>' +
		'<div class="hcShopPrice">' + stock.removalCost + "g</div></div>";
	//The special sale: while anybody is broken the counter carries treatments too, so a party a long way
	//from a rest site has somewhere to spend its gold on the problem.
	cardMarkup += honeycomb.shop.renderBrokenSale(stock, nodeId);
	return cardMarkup;
};

//Drawn only while somebody is broken, and it disappears the moment nobody is -- including immediately
//after a treatment that fixed it, which is the correct reading of a sale for a condition.
honeycomb.shop.renderBrokenSale = function (stock, nodeId) {
	if (honeycomb.partyHasBroken() == false) return "";
	var offerArray = honeycomb.shopTuning.brokenOfferArray;
	if (offerArray == null || offerArray.length === 0) return "";

	var markup = '<div class="hcShopSaleHeading">Behind the counter</div>';
	for (var offerIndex = 0; offerIndex < offerArray.length; offerIndex++) {
		var treatment = honeycomb.findDefinition(honeycomb.brokenTreatmentArray, offerArray[offerIndex].treatment);
		if (treatment == null) continue;
		if (stock.treatmentUsedArray != null && stock.treatmentUsedArray.indexOf(treatment.index) >= 0) continue;
		var price = honeycomb.shop.treatmentPrice(offerArray[offerIndex], treatment);
		var affordable = honeycomb.getResource("gold") >= price;
		markup += '<div class="hcShopService hcShopSale' + (affordable ? "" : " hcDisabled") + '"' +
			(affordable ? ' onclick="honeycomb.shop.buyTreatment(\'' + nodeId + "','" + treatment.index + '\')"' : "") + ">" +
			honeycomb.ui.iconTag(null, "heart", "#7ec8f0", { className: "hcRelicIcon" }) +
			'<div class="hcGrow"><div>' + honeycomb.escapeText(treatment.name) + "</div>" +
			'<div class="hcTiny hcMuted">' + honeycomb.escapeText(treatment.description) + "</div></div>" +
			'<div class="hcShopPrice">' + price + "g</div></div>";
	}
	return markup;
};

honeycomb.shop.treatmentPrice = function (offer, treatment) {
	var multiplier = offer.priceMultiplier == null ? 1 : offer.priceMultiplier;
	return Math.max(1, Math.round(treatment.goldCost * multiplier));
};

//Buying one runs the treatment's own effect list -- the same list the campfire's variant and the two
//broken-only events run, from honeycomb.brokenTreatmentArray -- so what the counter sells and what the
//road offers can never drift apart. Sold once per shop.
honeycomb.shop.buyTreatment = function (nodeId, treatmentIndex) {
	var treatment = honeycomb.findDefinition(honeycomb.brokenTreatmentArray, treatmentIndex);
	if (treatment == null) return;
	var offer = null;
	for (var scanIndex = 0; scanIndex < honeycomb.shopTuning.brokenOfferArray.length; scanIndex++) {
		if (honeycomb.shopTuning.brokenOfferArray[scanIndex].treatment == treatmentIndex) {
			offer = honeycomb.shopTuning.brokenOfferArray[scanIndex];
		}
	}
	if (offer == null) return;
	var price = honeycomb.shop.treatmentPrice(offer, treatment);
	if (honeycomb.getResource("gold") < price) return;

	var node = nodeId == null ? null : honeycomb.map.findNode(nodeId);
	var stock = node == null ? null : node.shopStock;
	if (stock != null) {
		if (stock.treatmentUsedArray == null) stock.treatmentUsedArray = [];
		if (stock.treatmentUsedArray.indexOf(treatmentIndex) >= 0) return;
		stock.treatmentUsedArray.push(treatmentIndex);
	}
	honeycomb.spend({ gold: price });

	var context = honeycomb.newEffectContext({});
	honeycomb.applyResolvedTargets(context, "allAllies", honeycomb.resolveTargetMode("allAllies", context));
	honeycomb.resolveEffectArray(treatment.effectArray, context);

	honeycomb.platform.sound("uiClick");
	honeycomb.save.autosave("shopPurchase");
	honeycomb.shop.repaint(nodeId);
};

honeycomb.shop.renderFooter = function (stock, nodeId) {
	var markup = '<div class="hcShopFooter">';
	markup += '<div class="hcShopGold">' + honeycomb.ui.resourceIcon("gold") +
		'<span class="hcGold">' + honeycomb.getResource("gold") + "</span></div>";
	markup += '<div class="hcButton" onclick="honeycomb.shop.leave()">Leave shop</div>';
	markup += "</div>";
	return markup;
};

honeycomb.shop.setTab = function (tabIndex, nodeId) {
	honeycomb.shop.activeTab = tabIndex;
	honeycomb.platform.sound("uiClick");
	honeycomb.shop.repaint(nodeId);
};

//An outfit on the shelf. Buying it UNLOCKS it on the profile rather than equipping it: an outfit is a
//permanent addition to the roster, and which run it is worn on is a separate decision.
honeycomb.shop.renderOutfitSlot = function (stock, slotIndex, nodeId) {
	var slot = stock.outfitArray[slotIndex];
	var character = honeycomb.findDefinition(honeycomb.characterArray, slot.characterIndex);
	var outfit = honeycomb.findOutfit(character, slot.index);
	if (outfit == null) return "";
	var owned = honeycomb.unlocks.isUnlocked("outfit", outfit.index, slot.characterIndex);
	var affordable = slot.sold == false && owned == false && honeycomb.getResource("gold") >= slot.price;

	//Hovering shows the card the outfit adds, same as the teambuilding row.
	var additionArray = outfit.cardAdditionArray == null ? [] : outfit.cardAdditionArray;
	var hoverAttr = additionArray.length > 0
		? ' data-hccharacter="' + honeycomb.escapeAttribute(slot.characterIndex) + '"' +
			' onmouseenter="honeycomb.tooltip.show(this,\'card\',\'' + honeycomb.escapeAttribute(additionArray[0].index) + '\')"' +
			' onmouseleave="honeycomb.tooltip.hide()"'
		: "";
	var markup = '<div class="hcShopOutfitSlot' + (slot.sold || owned ? " hcSold" : "") +
		(affordable ? "" : " hcUnaffordableSlot") + '"' + hoverAttr +
		(affordable ? ' onclick="honeycomb.shop.buyOutfit(\'' + nodeId + "'," + slotIndex + ')"' : "") + ">";
	markup += '<div class="hcOutfitArt">' +
		honeycomb.art.portraitTag(slot.characterIndex, outfit.index, { alt: outfit.name }) + "</div>";
	markup += '<div class="hcOutfitName">' + honeycomb.escapeText(outfit.name) + "</div>";
	markup += '<div class="hcTiny hcMuted">' + honeycomb.escapeText(character.name) + "</div>";
	markup += '<div class="hcShopPrice">' + (owned ? "Owned" : (slot.sold ? "Sold" : slot.price + "g")) + "</div>";
	markup += "</div>";
	return markup;
};

honeycomb.shop.buyOutfit = function (nodeId, slotIndex) {
	var stock = honeycomb.shop.stockFor(nodeId);
	if (stock == null || stock.outfitArray == null) return;
	var slot = stock.outfitArray[slotIndex];
	if (slot == null || slot.sold == true) return;
	if (honeycomb.spend({ gold: slot.price }) == false) return;

	honeycomb.unlocks.grant("outfit", slot.index, slot.characterIndex);
	slot.sold = true;
	honeycomb.platform.sound("rewardTaken");
	honeycomb.shop.repaint(nodeId);
};

honeycomb.shop.renderCardSlot = function (stock, slotIndex, nodeId) {
	var slot = stock.cardArray[slotIndex];
	var definition = honeycomb.findDefinition(honeycomb.cardArray, slot.index);
	if (definition == null) return "";
	var affordable = slot.sold == false && honeycomb.getResource("gold") >= slot.price;

	var markup = '<div class="hcShopCardSlot' + (slot.sold ? " hcSold" : "") + (affordable ? "" : " hcUnaffordableSlot") + '">';
	markup += honeycomb.ui.card(honeycomb.resolveCard({
		instanceId: null, cardIndex: definition.index, ownerInstanceId: null, upgradeLevel: 0,
	}), {
		size: "small",
		showAffinity: false,
		onClick: affordable ? "honeycomb.shop.buyCard('" + nodeId + "'," + slotIndex + ")" : null,
	});
	markup += '<div class="hcShopPrice">' + (slot.sold ? "Sold" : slot.price + "g") + "</div>";
	//A banish strikes the card off every offer pool for the run. It is not a purchase.
	if (slot.sold != true && honeycomb.getResource("banish") > 0 && honeycomb.cardCanBeBanished(slot.index)) {
		markup += '<div class="hcBanishButton"' + honeycomb.tooltip.attributes("banish", "button") +
			' onclick="honeycomb.shop.banishCard(\'' + nodeId + "'," + slotIndex + ')">Banish ' +
			honeycomb.ui.resourceCounter("banish") + "</div>";
	}
	markup += "</div>";
	return markup;
};

//BANISH FROM THE SHELF. Spends one banish, records the card, and takes the slot off the shelf.
honeycomb.shop.banishCard = function (nodeId, slotIndex) {
	var stock = honeycomb.shop.stockFor(nodeId);
	if (stock == null || stock.cardArray == null) return;
	var slot = stock.cardArray[slotIndex];
	if (slot == null || slot.sold == true) return;
	if (honeycomb.banishCard(slot.index) == false) return;
	honeycomb.platform.sound("uiBack");
	stock.cardArray.splice(slotIndex, 1);
	honeycomb.shop.repaint(nodeId);
};

honeycomb.shop.renderRelicSlot = function (stock, slotIndex, nodeId) {
	var slot = stock.relicArray[slotIndex];
	var definition = honeycomb.findDefinition(honeycomb.relicArray, slot.index);
	if (definition == null) return "";
	var affordable = slot.sold == false && honeycomb.getResource("gold") >= slot.price;

	var markup = '<div class="hcShopRelicSlot' + (slot.sold ? " hcSold" : "") + (affordable ? "" : " hcUnaffordableSlot") + '"' +
		(affordable ? ' onclick="honeycomb.shop.buyRelic(\'' + nodeId + "'," + slotIndex + ')"' : "") +
		' title="' + honeycomb.escapeAttribute(definition.description) + '">';
	markup += honeycomb.ui.itemPlate(definition.iconPath, "shard", "#c9a961");
	markup += '<div class="hcGrow"><div>' + honeycomb.escapeText(definition.name) + "</div>" +
		'<div class="hcTiny hcMuted">' + honeycomb.escapeText(definition.description) + "</div></div>";
	markup += '<div class="hcShopPrice">' + (slot.sold ? "Sold" : slot.price + "g") + "</div>";
	markup += "</div>";
	return markup;
};

honeycomb.shop.buyCard = function (nodeId, slotIndex) {
	var stock = honeycomb.shop.stockFor(nodeId);
	if (stock == null) return;
	var slot = stock.cardArray[slotIndex];
	if (slot == null || slot.sold == true) return;
	if (honeycomb.spend({ gold: slot.price }) == false) return;

	honeycomb.addCardToRunDeck(slot.index, null);
	slot.sold = true;
	honeycomb.platform.sound("rewardTaken");
	honeycomb.shop.repaint(nodeId);
};

honeycomb.shop.buyRelic = function (nodeId, slotIndex) {
	var stock = honeycomb.shop.stockFor(nodeId);
	if (stock == null) return;
	var slot = stock.relicArray[slotIndex];
	if (slot == null || slot.sold == true) return;
	if (honeycomb.spend({ gold: slot.price }) == false) return;

	honeycomb.grantRelic(slot.index, honeycomb.newEffectContext({}));
	slot.sold = true;
	honeycomb.platform.sound("rewardTaken");
	honeycomb.shop.repaint(nodeId);
};

//The same removal the campfire offers: the `removeCard` deck service, asked through the choice overlay,
//so every card the campfire would let go the shop will too. Paid for only once a card has actually
//gone -- choosing nothing costs nothing.
honeycomb.shop.beginRemoval = function (nodeId, answerArray) {
	var stock = honeycomb.shop.stockFor(nodeId);
	if (stock == null) return;
	if (honeycomb.canAfford({ gold: stock.removalCost }) == false) return;

	var attempt = honeycomb.resolveWithChoices({
		answerArray: answerArray,
		buildContext: function () { return honeycomb.newEffectContext({}); },
		run: function (context) {
			honeycomb.resolveEffectArray([{ index: "deckService", service: "removeCard" }], context);
		},
	});
	if (attempt.complete == false) {
		honeycomb.overlay.open("choice", {
			request: attempt.choice,
			onAnswer: function (answer) {
				honeycomb.shop.beginRemoval(nodeId, attempt.answerArray.concat([answer]));
			},
			//Nothing is charged until a card has actually gone, so backing out of the picker costs the
			//player nothing and returns them to the shelves.
			onCancel: function () { honeycomb.scene.refresh(); },
		});
		return;
	}

	var removed = false;
	var logArray = attempt.context == null ? [] : attempt.context.log;
	for (var entryIndex = 0; entryIndex < logArray.length; entryIndex++) {
		if (logArray[entryIndex].type == "deckCardRemoved") removed = true;
	}
	if (removed == false) return;

	//Read again: a question rewinds the whole state, so the stock found above may be an abandoned copy.
	stock = honeycomb.shop.stockFor(nodeId);
	if (stock == null) return;
	honeycomb.spend({ gold: stock.removalCost });
	stock.removalsUsed += 1;
	//Each removal costs more than the last, so a shop cannot be used to strip a deck to nothing.
	stock.removalCost += honeycomb.shopTuning.removalCostIncrease;
	honeycomb.platform.sound("rewardTaken");
	honeycomb.shop.repaint(nodeId);
};

//Repaints the shop in place so a purchase does not close and reopen the panel.
honeycomb.shop.repaint = function (nodeId) {
	var node = honeycomb.map.findNode(nodeId);
	var layer = document.getElementById(honeycomb.tuning.dom.overlayIdPrefix + "shop");
	if (layer == null) return;
	//A standalone shop (Mail Order) has no node; the overlay's own stock is what to redraw.
	if (node == null) {
		if (honeycomb.shop.standaloneStock != null) layer.innerHTML = honeycomb.shop.render(honeycomb.shop.standaloneStock, nodeId);
		return;
	}
	layer.innerHTML = honeycomb.shop.render(node.shopStock, nodeId);
};

//PENNY PINCHER (tree node): leaving the shop pays a share of the gold still held. Kept as its own step
//so the rule is testable without the overlay, which needs a DOM.
honeycomb.shop.payoutOnExit = function () {
	var fraction = honeycomb.partyFieldTotal("shopExitGoldFraction");
	if (fraction <= 0) return 0;
	var gained = Math.floor(honeycomb.getResource("gold") * fraction);
	if (gained <= 0) return 0;
	honeycomb.addResource("gold", gained);
	return gained;
};

honeycomb.shop.leave = function () {
	honeycomb.shop.payoutOnExit();
	honeycomb.shop.priceMultiplier = 1;
	//A standalone shop's stock goes with it; a node-held one stays on the map node.
	honeycomb.shop.standaloneStock = null;
	honeycomb.overlay.close("shop");
	//MAIL ORDER returns to the campfire with the actions that are left, rather than ending the rest.
	if (honeycomb.rest.pendingShopReturn == true) {
		honeycomb.rest.pendingShopReturn = false;
		if (honeycomb.rest.actionsRemaining > 0) {
			honeycomb.overlay.open("event", { eventIndex: "theCampfire", resumeActions: true });
			return;
		}
	}
	honeycomb.rest.endDebug();
	honeycomb.map.returnToMap();
};

//---------------------------------------------------------------------------------------------------
//Region cleared
//---------------------------------------------------------------------------------------------------
//The boss is down. Either descend into the next region or, if there is none, the run is won.
honeycomb.overlay.register({
	index: "regionCleared",
	build: function (layer) {
		var run = honeycomb.state.run;
		var cleared = run.regionsCleared == null ? 0 : run.regionsCleared;
		//>>> LANE E7 | route | win condition >>>
		//HOW LONG A RUN IS, NOT HOW MANY REGIONS EXIST. regionArray now holds alternatives a single
		//run never all visits, so counting it would move the ending every time a route is added.
		var moreToCome = cleared + 1 < honeycomb.tuning.map.route.regionsPerRun;
		//<<< LANE E7 | route | win condition <<<
		//Paid here rather than on the boss's victory screen: a region is cleared by leaving it, and
		//awardRegionClear refuses to pay twice if this overlay is reopened.
		var discovery = honeycomb.map.awardRegionClear();
		//The last region cleared is the run won, which pays the party personally -- once.
		var victoryShareArray = moreToCome ? [] : honeycomb.map.awardRunVictory();

		var markup = '<div class="hcOverlayPanel">';
		markup += '<h2 class="hcOverlayTitle">' + (moreToCome ? "The Way Down Opens" : "The Catacombs Are Yours") + "</h2>";
		markup += '<div class="hcOverlayBody">' + (moreToCome
			? "Whatever held this floor is finished. There is a stair behind where it was standing."
			: "Nothing else down here is moving. The run is complete.") + "</div>";

		if (discovery != null && discovery.awarded > 0) {
			markup += '<div class="hcRewardRow">' + honeycomb.ui.globalExperienceTile(discovery.awarded) + "</div>";
			if (discovery.isNew == true) {
				markup += '<div class="hcDiscoveryRow"><span class="hcDiscoveryTag">New</span>' +
					'<span class="hcDiscoveryName">' + honeycomb.escapeText(discovery.name) + "</span></div>";
			}
		}
		if (discovery != null) markup += honeycomb.ui.personalShareRow(discovery.shareArray);
		markup += honeycomb.ui.personalShareRow(victoryShareArray);
		markup += '<div class="hcOverlayButtonRow">';
		markup += moreToCome
			? '<div class="hcButton hcPrimary" onclick="honeycomb.descendRegion()">Descend</div>'
			: '<div class="hcButton hcPrimary" onclick="honeycomb.finishRun(true)">Finish</div>';
		markup += "</div></div>";
		layer.innerHTML = markup;
	},
});

//Moves the run onto the next region, keeping the party, deck and relics.
honeycomb.descendRegion = function () {
	var run = honeycomb.state.run;
	//>>> LANE E7 | route | descend >>>
	//THE ROUTE IS DECIDED ON THE WAY DOWN, AND ONLY ONCE. Recorded here rather than resolved at
	//generation time because the first region's map is still standing at this moment, and it is the
	//boss node on it that decides. A run that already carries a route keeps it.
	var clearedBefore = run.regionsCleared == null ? 0 : run.regionsCleared;
	if (clearedBefore === 0 && run.routeRegionIndex == null) {
		run.routeRegionIndex = honeycomb.map.resolveRouteRegionIndex(run);
	}
	//<<< LANE E7 | route | descend <<<
	run.regionsCleared = (run.regionsCleared == null ? 0 : run.regionsCleared) + 1;
	honeycomb.platform.sound("regionDescend");
	honeycomb.map.generateRegion();
	honeycomb.overlay.closeAll();
	honeycomb.save.autosave("nodeComplete");
	honeycomb.scene.go("map");
};

//Ends the run, records the result on the profile, and returns to teambuilding.
honeycomb.finishRun = function (won) {
	var state = honeycomb.state;
	//A Lust Battle's run is no run of the player's: leaving it early (abandon, forfeit) counts toward
	//nothing and leaves its Lust Event waiting, and it returns to teambuilding.
	if (state.run != null && state.run.lustBattle != null) {
		state.run = null;
		honeycomb.overlay.closeAll();
		honeycomb.save.autosave("lustBattleLeft");
		honeycomb.scene.go("teambuilding");
		return;
	}
	if (state.run != null) {
		state.run.outcome = won ? "victory" : "defeat";
		if (won) state.profile.runsWon += 1;
		else state.profile.runsLost += 1;
		//The telemetry ledger's own run counters. Best-effort, never load-bearing.
		honeycomb.telemetry.note(won ? "runsWon" : "runsLost");
		//Honeycomb's own stinger: !victoryFull fires for winning a run.
		if (won) honeycomb.platform.sound("victoryFull");
	}
	state.run = null;
	honeycomb.overlay.closeAll();
	honeycomb.save.autosave("runEnd");
	honeycomb.scene.go(honeycomb.tuning.flow.runEndScene);
};
