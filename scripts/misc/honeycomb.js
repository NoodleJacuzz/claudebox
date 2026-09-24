//===================================================================================================
//HONEYCOMB CATACOMBS -- kernel
//===================================================================================================
//A teambuilding roguelike deckbuilder that runs inside Syrup Town but is built to be lifted out of it
//whole. Everything the game needs from Syrup Town passes through honeycomb.platform below; nothing
//else in these files may touch a Syrup Town global. Rewriting that one object is the entire porting
//job. !designDocs/honeycomb/REQUIREMENTS.md lists what it currently reaches for.
//
//Load order (index.html): this file first -- it creates the namespace every other honeycomb file
//appends to -- then tuning, then content, then systems, then scenes.
//
//Nothing here runs on its own. honeycombBoot() is the only entry point.
window.honeycomb = window.honeycomb || {};

//---------------------------------------------------------------------------------------------------
//Platform adapter
//---------------------------------------------------------------------------------------------------
//The complete list of things Honeycomb asks its host for. Every member degrades to a harmless no-op
//when the host is absent, so the same files run from a bare index.html with no Syrup Town around them.
//Adding a host dependency ANYWHERE ELSE in honeycomb is a bug -- add it here instead and document it.
honeycomb.platform = {
	//Host name, for anything that wants to branch on where it is running
	host: "syrup-town",

	//Sound. Syrup Town's soundEffectStart takes a filename stem from sound/sfx/.
	//honeycomb.tuning.audio maps honeycomb's own event names onto whatever the host offers, so
	//content never names a host asset directly.
	//
	//An event that names a file in tuning.audio.fileMap plays that file out of `honeycomb sound/sfx/`
	//-- the game's own stingers and finer card sounds -- and everything else falls through to the host
	//stem. Both routes are plain `<audio>`, which works hosted, standalone and from `file://`.
	sound: function (eventIndex) {
		//Every button makes a sound, so this is always inside a user gesture -- the moment music that an
		//autoplay rule refused can finally start. A no-op unless something was refused.
		if (honeycomb.music != null) honeycomb.music.nudge();
		var file = honeycomb.tuning.audio.fileMap == null ? null : honeycomb.tuning.audio.fileMap[eventIndex];
		if (file != null) {
			//Goes through playStem, so a system event gets the same measured volume trim a card's sound
			//does; calling playFile directly would skip the trim.
			honeycomb.platform.playStem(file);
			return;
		}
		var stem = honeycomb.tuning.audio.eventMap[eventIndex];
		if (stem == null) return;
		if (typeof soundEffectStart === "function") soundEffectStart(stem);
	},

	//Plays one file from Honeycomb's own sound library. Best-effort: a missing file, an autoplay block
	//or a sound-off toggle all end in silence, never in an error the game has to care about.
	playFile: function (path, volumeScale) {
		if (honeycomb.platform.soundEnabled() != true) return;
		if (typeof Audio !== "function") return;
		try {
			var sound = new Audio(path);
			sound.volume = Math.max(0, Math.min(1, honeycomb.tuning.audio.fileVolume * (volumeScale == null ? 1 : volumeScale)));
			var started = sound.play();
			//Autoplay rules reject the promise until the first user gesture; that is not an error.
			if (started != null && typeof started.catch === "function") started.catch(function () {});
		} catch (audioError) {
			if (typeof console !== "undefined") console.warn("Honeycomb: could not play", path);
		}
	},

	//HOW MUCH SILENCE A SOUND OPENS WITH, in milliseconds (tuning.audio.leadInMsMap, measured). A sound
	//timed to land WITH a picture has to be started this much earlier, or its attack arrives after the
	//thing it is meant to land on. 0 for an event with no file or no measured lead-in.
	soundLeadInMs: function (eventIndex) {
		var file = honeycomb.tuning.audio.fileMap == null ? null : honeycomb.tuning.audio.fileMap[eventIndex];
		var map = honeycomb.tuning.audio.leadInMsMap;
		if (file == null || map == null || map[file] == null) return 0;
		return map[file];
	},

	//Plays a library STEM by name (tuning.audio.libraryPath + stem + ".mp3"), with any per-stem volume
	//trim from fileVolumeScaleMap. This is the door every card and enemy move sound goes through.
	//A trim in fileVolumeByEarMap wins over the measured one, and a file in startAtMsMap starts that far in,
	//through a media fragment (`#t=`) so the browser does the seeking and nothing waits on metadata.
	playStem: function (stem) {
		if (stem == null || stem === "") return;
		var audio = honeycomb.tuning.audio;
		var scale = audio.fileVolumeByEarMap != null && audio.fileVolumeByEarMap[stem] != null ? audio.fileVolumeByEarMap[stem]
			: audio.fileVolumeScaleMap == null ? null : audio.fileVolumeScaleMap[stem];
		var startMs = audio.startAtMsMap == null ? null : audio.startAtMsMap[stem];
		var fragment = startMs == null || startMs <= 0 ? "" : "#t=" + (startMs / 1000);
		honeycomb.platform.playFile(audio.libraryPath + stem + ".mp3" + fragment, scale);
	},

	//Sound and music toggles belong to the host: Syrup Town's own toggles live on title and menu buttons
	//that honeycomb hides while it runs, and a player needs a way to turn sound back on mid-fight.
	//These read and write the host's own flags rather than keeping a second copy, so the two screens can
	//never disagree, and pressing one is itself the user gesture an autoplay policy is waiting for.
	//All four degrade to a no-op (and "on") with no host around.
	soundEnabled: function () {
		return typeof soundDisabled === "undefined" || soundDisabled != true;
	},
	musicEnabled: function () {
		return typeof musicDisabled === "undefined" || musicDisabled != true;
	},
	setSoundEnabled: function (enabled) {
		if (typeof soundDisabled === "undefined") return;
		soundDisabled = enabled != true;
	},
	setMusicEnabled: function (enabled) {
		if (typeof musicDisabled === "undefined") return;
		musicDisabled = enabled != true;
		//While honeycomb's own music holds the speakers, the switch moves that music and leaves the
		//host's alone -- waking the host's song here would play it over honeycomb's.
		//resumeHostMusic reads the flag on the way out and puts the host in whichever state it says.
		if (honeycomb.platform.hostMusicSuspended == true) {
			if (honeycomb.music != null) honeycomb.music.refresh();
			return;
		}
		//The host's own pause/resume, so music that was stopped by an autoplay block actually starts.
		//unpauseAll reads playlist[0] unguarded and throws on a host that never started a song.
		if (enabled == true && typeof unpauseAll === "function" && honeycomb.platform.hostSongCount() > 0) unpauseAll();
		if (enabled != true && typeof pauseAll === "function") pauseAll();
	},

	//Music volume is the host's slider, 0 to 1, so one setting governs both games.
	musicVolume: function () {
		if (typeof data !== "undefined" && data != null && data.player != null && typeof data.player.musicVolume === "number") {
			return data.player.musicVolume / 100;
		}
		return honeycomb.tuning.audio.music.standaloneVolume;
	},

	//How many songs the host has started so far. Zero under a dev preview, which skips the host's title.
	hostSongCount: function () {
		return typeof playlist === "undefined" || playlist == null ? 0 : playlist.length;
	},

	//Silences the host's music without breaking it. Syrup Town's sound.js is a playlist: each song is an
	//<audio> pushed onto `playlist`, and a timer in
	//`timeoutID` crossfades to the next when the song's length has elapsed. Its songs are MUTED here
	//rather than paused, and that is deliberate. sound.js treats a paused song as proof the browser
	//blocked autoplay -- fadeIn() answers it by calling omniToggle(), which switches off music AND sound
	//effects -- so pausing a song that is still fading in would silence honeycomb's own effects. `muted`
	//is a property nothing in sound.js reads or writes: volume, paused and every fade stay exactly as
	//the host left them. The next-song timer is the one thing stopped, because a song it started while
	//honeycomb ran would arrive unmuted; the current song simply loops, which sound.js already asks of it.
	hostMusicSuspended: false,
	suspendHostMusic: function () {
		if (honeycomb.platform.hostMusicSuspended == true) return;
		honeycomb.platform.hostMusicSuspended = true;
		for (var songIndex = 0; songIndex < honeycomb.platform.hostSongCount(); songIndex++) playlist[songIndex].muted = true;
		if (typeof timeoutID !== "undefined" && timeoutID) {
			clearTimeout(timeoutID);
			timeoutID = null;
		}
	},

	//Hands the host's music back in the state its own switch says it should be in -- the switch may have
	//been pressed from inside honeycomb, in either direction, while the host's song sat muted.
	resumeHostMusic: function () {
		if (honeycomb.platform.hostMusicSuspended != true) return;
		honeycomb.platform.hostMusicSuspended = false;
		for (var songIndex = 0; songIndex < honeycomb.platform.hostSongCount(); songIndex++) playlist[songIndex].muted = false;
		var song = typeof currentAudio === "undefined" ? null : currentAudio;
		if (song == null) return;
		if (honeycomb.platform.musicEnabled() != true) {
			if (typeof pauseAll === "function") pauseAll();
			return;
		}
		if (song.paused == true) {
			if (typeof unpauseAll === "function") unpauseAll();
			return;
		}
		//Still playing, so only the next-song timer needs restarting, for what is left of this song
		var remainingSeconds = song.duration - song.currentTime;
		if (typeof startMusic === "function" && typeof timeoutID !== "undefined" && Number.isFinite(remainingSeconds) && remainingSeconds > 0) {
			timeoutID = setTimeout(startMusic, remainingSeconds * 1000);
		}
	},

	//Where the game mounts. Syrup Town keeps its scrolling content in #wrapper; honeycomb covers the
	//whole viewport instead, so it attaches to <body> and hides the host chrome while it runs.
	//A standalone build lands on the same <body> and simply finds no chrome to hide.
	mountParent: function () {
		return document.body;
	},

	//Elements hidden on entry and restored on exit. "Hide, don't delete" -- the host's DOM is left
	//intact so returning to it needs no rebuild.
	chromeElementIndexArray: ["menu", "wrapper", "openButton", "closeButton"],

	//Called when the player leaves honeycomb. Handing control back to the host is the host's business.
	//
	//Clearing devPreviewTarget first is load-bearing, not tidying. Syrup Town's generateTitle() checks
	//devPreviewActive() and, when a preview is running, deliberately skips the title's animation chain
	//so queued timeouts cannot fire into the previewed screen. Leaving the flag set means the title
	//builds with its letters parked off-screen and its buttons never raised -- which reads as a broken,
	//unusable screen and strands the player. The player has explicitly left the previewed screen, so
	//the preview genuinely is over; saying so is the correct fix rather than reaching into title.js.
	exit: function () {
		if (typeof devPreviewTarget !== "undefined") devPreviewTarget = "";
		if (typeof clacksDevMode !== "undefined") clacksDevMode = false;

		if (typeof writeScene === "function" && typeof data !== "undefined" && data.player) {
			writeScene("system", "start");
			return;
		}
		//Standalone: nothing to return to, so re-enter the game's own front door.
		honeycomb.scene.go(honeycomb.tuning.flow.entryScene);
	},

	//True when the host is mid-dev-preview, which suppresses the host handoff above.
	inDevPreview: function () {
		return typeof devPreviewActive === "function" && devPreviewActive() == true;
	},

	//A phone browser's own bars take a fifth of a landscape screen and the game is unplayable in what is
	//left; the whole screen is asked for instead. Browser-specific, so it lives here: a Cordova build is
	//already full-screen and reports it unavailable, which hides the buttons that offer it.
	fullscreenAvailable: function () {
		return typeof document !== "undefined" && document.fullscreenEnabled == true;
	},
	isFullscreen: function () {
		return typeof document !== "undefined" && document.fullscreenElement != null;
	},
	//A phone's browser shows its OWN notice on entering fullscreen ("swipe down to exit"), which is not
	//ours to remove or dismiss -- but it is only shown when fullscreen is actually entered, so the
	//request is skipped when the page is already fullscreen rather than re-raising it.
	toggleFullscreen: function () {
		if (honeycomb.platform.fullscreenAvailable() == false) return;
		if (honeycomb.platform.isFullscreen() == true) {
			document.exitFullscreen();
			return;
		}
		var request = document.documentElement.requestFullscreen({ navigationUI: "hide" });
		//A refused request (no user gesture, an embedded page) is not an error worth the console.
		if (request != null && typeof request.catch === "function") request.catch(function () {});
	},
};

//---------------------------------------------------------------------------------------------------
//Image resolution
//---------------------------------------------------------------------------------------------------
//A cut-down cleanupImage for honeycomb's own asset folder. This function holds the ONLY reference to
//that folder anywhere in the game; if honeycomb art ever migrates into images-webp, only the two
//constants below change.
honeycomb.imageFolder = "v13 spire images";
honeycomb.imageFormat = "webp";

//A 1x1 fully transparent pixel. Inline so it costs no request and works on file:// builds.
honeycomb.blankPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

//Resolves a honeycomb-relative path ("icons/attack") into something an <img src> accepts.
//Accepts and passes through anything already resolved: data URIs, blobs, http(s), and inline SVG.
//Accepts paths with or without a file extension, so content can stay format-agnostic.
honeycomb.image = function (path) {
	if (path == null || path === "") return honeycomb.blankPixel;
	if (path === "none") return honeycomb.blankPixel;
	//Already-resolved sources pass straight through, so generated SVG icons and future blob-backed
	//mod art can be handed to the same helpers as ordinary paths.
	if (path.indexOf("data:") === 0) return path;
	if (path.indexOf("blob:") === 0) return path;
	if (path.indexOf("http") === 0) return path;
	if (path.indexOf("<svg") === 0) return honeycomb.svgToDataUri(path);

	var cleaned = String(path);
	//Strip a leading copy of the folder, so a caller that already prefixed does not double it
	cleaned = cleaned.replace(honeycomb.imageFolder + "/", "");
	//A path that NAMES .svg keeps it: vector UI shapes (the nameplate's frames) are drawn as SVG on
	//purpose, and a raster replacement is a tuning path change to the extensionless form.
	if (/\.svg$/i.test(cleaned)) return encodeURI(honeycomb.imageFolder + "/" + cleaned);
	//Strip any extension; the folder is single-format and the format is configured, not written out
	cleaned = cleaned.replace(/\.(webp|png|jpg|jpeg|gif|svg)$/i, "");
	//Spaces are legal in the folder name but must not reach the URL raw
	return encodeURI(honeycomb.imageFolder + "/" + cleaned + "." + honeycomb.imageFormat);
};

//Wraps inline SVG markup as a data URI. Placeholder icons are generated rather than authored, so
//they can be swapped for real art later by changing only the path a definition points at.
honeycomb.svgToDataUri = function (markup) {
	return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup);
};

//---------------------------------------------------------------------------------------------------
//Image preloading
//---------------------------------------------------------------------------------------------------
//Nothing is fetched until the moment it is shown, so online the first draw of every sprite, card and
//backdrop is a network round-trip and art visibly pops in mid-animation. This warms the browser's cache
//for the art a run is most likely to reach for, in the BACKGROUND: it never blocks, and an image that
//has not arrived when it is shown simply behaves exactly as it did before. The count is kept so the
//debug panel can report progress; a true blocking loading screen would build on this.
honeycomb.preload = { requested: 0, loaded: 0, failed: 0 };

//Whether the background warm should run at all: off when tuning says so, and off on a metered or
//2G-class connection, where the warm would fight the art the player is actually looking at.
honeycomb.preload.shouldWarm = function () {
	var settings = honeycomb.tuning.preload;
	if (settings == null || settings.enabled != true) return false;
	if (settings.skipOnSlowConnection == true && typeof navigator !== "undefined" && navigator.connection != null) {
		if (navigator.connection.saveData == true) return false;
		var type = navigator.connection.effectiveType;
		if (type === "slow-2g" || type === "2g") return false;
	}
	return true;
};

//Whether the browser reports a connection slow enough to justify the BLOCKING screen. No Network
//Information API (desktop Firefox/Safari, a `file://` page) answers "no", so the screen stays out of the
//way wherever it cannot be justified.
honeycomb.preload.networkIsSlow = function () {
	if (typeof navigator === "undefined" || navigator.connection == null) return false;
	if (navigator.connection.saveData == true) return true;
	var type = navigator.connection.effectiveType;
	return type === "slow-2g" || type === "2g" || type === "3g";
};

//Warms one list of paths, in SMALL BATCHES rather than all at once: a phone asked for seventy images in
//one tick spends the first turn decoding instead of playing. Duplicates are skipped, and an
//already-missing path is not asked for again.
honeycomb.preload.warm = function (pathArray) {
	if (typeof Image === "undefined") return;
	if (honeycomb.preload.shouldWarm() != true) return;
	var settings = honeycomb.tuning.preload;
	//shouldWarm already refused a missing tuning block, so both numbers come from tuning.preload.
	var batchSize = Math.max(1, settings.batchSize);
	var batchDelayMs = Math.max(0, settings.batchDelayMs);

	var queue = [];
	var seen = {};
	for (var pathIndex = 0; pathIndex < (pathArray == null ? 0 : pathArray.length); pathIndex++) {
		var path = pathArray[pathIndex];
		if (path == null || path === "" || seen[path] === true) continue;
		if (honeycomb.missingImagePathArray[path] === true) continue;
		seen[path] = true;
		queue.push(path);
	}

	var position = 0;
	//How long the batch warm actually took, so a claim about loading time is a measurement. Printed by
	//the debug panel.
	honeycomb.preload.startedAt = Date.now();
	honeycomb.preload.finishedAt = null;
	function noteFinished() {
		if (honeycomb.preload.finishedAt != null) return;
		if (position >= queue.length && honeycomb.preload.loaded + honeycomb.preload.failed >= honeycomb.preload.requested) {
			honeycomb.preload.finishedAt = Date.now();
		}
	}
	function loadBatch() {
		var end = Math.min(queue.length, position + batchSize);
		for (; position < end; position++) {
			honeycomb.preload.requested += 1;
			var probe = new Image();
			probe.onload = function () { honeycomb.preload.loaded += 1; noteFinished(); };
			probe.onerror = function () { honeycomb.preload.failed += 1; noteFinished(); };
			probe.src = honeycomb.image(queue[position]);
		}
		if (position < queue.length) setTimeout(loadBatch, batchDelayMs);
		else noteFinished();
	}
	loadBatch();
};

//The warm as one line for the debug panel: "112 / 112 images in 2310ms", or the running count while it
//is still going.
honeycomb.preload.summaryText = function () {
	var done = honeycomb.preload.loaded + honeycomb.preload.failed;
	var elapsed = honeycomb.preload.startedAt == null ? null
		: (honeycomb.preload.finishedAt == null ? Date.now() : honeycomb.preload.finishedAt) - honeycomb.preload.startedAt;
	return done + " / " + honeycomb.preload.requested + " images" +
		(elapsed == null ? "" : " in " + elapsed + "ms") +
		(honeycomb.preload.finishedAt == null ? " (warming)" : "");
};

//The art a run reaches for first: the UI and card frames, every card's art, every character's default
//sprite and every enemy's. Built from content, so new content is warmed with no new list.
honeycomb.preload.warmCommon = function () {
	var pathArray = [];
	function push(path) { if (path != null && path !== "") pathArray.push(path); }

	var art = honeycomb.tuning.art;
	for (var frameIndex = 0; frameIndex < art.uiFrameArray.length; frameIndex++) push(art.uiFrameArray[frameIndex].path);
	//The sized frame copies a card actually draws, never the full 1992x2540 sources.
	var frameSuffixBySize = art.cardFrame.frameSuffixBySize == null ? {} : art.cardFrame.frameSuffixBySize;
	var framePathArray = [art.cardFrame.vertical.framePath, art.cardFrame.horizontal.framePath];
	var cardTypeArray = honeycomb.cardTypeArray == null ? [] : honeycomb.cardTypeArray;
	for (var typeIndex = 0; typeIndex < cardTypeArray.length; typeIndex++) {
		var byLayout = cardTypeArray[typeIndex].framePathByLayout;
		if (byLayout != null) framePathArray.push(byLayout.vertical, byLayout.horizontal);
	}
	for (var framePathIndex = 0; framePathIndex < framePathArray.length; framePathIndex++) {
		for (var sizeIndex in frameSuffixBySize) {
			if (Object.prototype.hasOwnProperty.call(frameSuffixBySize, sizeIndex)) push(framePathArray[framePathIndex] + frameSuffixBySize[sizeIndex]);
		}
	}
	push("cards/frames/playerBack");
	push("cards/frames/enemyBack");

	var cardArray = honeycomb.cardArray == null ? [] : honeycomb.cardArray;
	//A card whose art is owed (`artOwed`, CARD-POOL-01) is never asked for: it draws the placeholder outright.
	for (var cardIndex = 0; cardIndex < cardArray.length; cardIndex++) {
		if (cardArray[cardIndex].artOwed != true) push(cardArray[cardIndex].artPath);
	}

	var characterArray = honeycomb.characterArray == null ? [] : honeycomb.characterArray;
	for (var characterIndex = 0; characterIndex < characterArray.length; characterIndex++) {
		//THE HURT TIER TOO: a fighter swapping to her hurt sprite mid-fight is a fetch+decode on the main
		//thread at exactly the wrong moment, which is one shape of a long frame. Which files those are
		//comes from the art file (honeycomb.art.characterWarmPaths), as the enemies' do below.
		var characterPathArray = honeycomb.art.characterWarmPaths(characterArray[characterIndex]);
		for (var characterPathIndex = 0; characterPathIndex < characterPathArray.length; characterPathIndex++) push(characterPathArray[characterPathIndex]);
	}
	var enemyArray = honeycomb.enemyArray == null ? [] : honeycomb.enemyArray;
	for (var enemyIndex = 0; enemyIndex < enemyArray.length; enemyIndex++) {
		//An enemy's paths come from the art file, not spelled out here. See honeycomb.art.enemyWarmPaths.
		var enemyPathArray = honeycomb.art.enemyWarmPaths(enemyArray[enemyIndex]);
		for (var enemyPathIndex = 0; enemyPathIndex < enemyPathArray.length; enemyPathIndex++) push(enemyPathArray[enemyPathIndex]);
	}
	//The ordinary attack effect, which every plain attack draws.
	if (honeycomb.tuning.vfx != null) push(honeycomb.tuning.vfx.defaultAttackPath);
	honeycomb.preload.warm(pathArray);
	return pathArray;
};

//There is no blocking loading screen; the background warm above is the whole of the loading strategy,
//and nothing in the game waits on it.

//---------------------------------------------------------------------------------------------------
//Performance monitor
//---------------------------------------------------------------------------------------------------
//A passive, opt-in measurement of where a turn's wall-clock actually goes, so "it feels choppy" can be
//answered with numbers rather than guessed at. It records four things:
//  frames       the interval between animation frames, so DROPPED frames are visible
//  longTasks    main-thread blocks over 50ms (Chrome's own longtask observer) -- where stutter comes from
//  replayArray  each log replay's EXPECTED duration (the beats' own waits) against its ACTUAL duration;
//               the gap is time the browser spent not keeping up
//  dragArray    the cost of one pointermove during a card drag (the forecast, the DOM reads, the focus)
//Nothing here changes behaviour: it only times what already happens. Off by default, toggled from the
//debug panel so a phone can run it.
honeycomb.perf = {
	enabled: false,
	observer: null,
	frameArray: [],
	lastFrameAt: 0,
	longTaskArray: [],
	replayArray: [],
	dragArray: [],
	startedAt: 0,
	//Where the dropped frames happened, so a report can say drag vs replay vs idle.
	dropByMode: { drag: 0, replay: 0, idle: 0 },
};

//A clock that exists everywhere the engine runs: a browser has performance.now; the headless tests have
//only Date.
honeycomb.perf.now = function () {
	if (typeof performance !== "undefined" && performance.now != null) return performance.now();
	return Date.now();
};

honeycomb.perf.start = function () {
	if (honeycomb.perf.enabled == true) return;
	honeycomb.perf.enabled = true;
	honeycomb.perf.frameArray = [];
	honeycomb.perf.longTaskArray = [];
	honeycomb.perf.replayArray = [];
	honeycomb.perf.dragArray = [];
	honeycomb.perf.dropByMode = { drag: 0, replay: 0, idle: 0 };
	honeycomb.perf.startedAt = honeycomb.perf.now();
	honeycomb.perf.lastFrameAt = honeycomb.perf.now();
	//Chrome's own "the main thread was blocked" signal. Not every browser supports it; a missing one
	//just means the report has no long tasks.
	if (typeof PerformanceObserver !== "undefined") {
		try {
			honeycomb.perf.observer = new PerformanceObserver(function (list) {
				var entries = list.getEntries();
				for (var entryIndex = 0; entryIndex < entries.length; entryIndex++) {
					honeycomb.perf.longTaskArray.push({ at: entries[entryIndex].startTime, ms: entries[entryIndex].duration });
				}
			});
			honeycomb.perf.observer.observe({ entryTypes: ["longtask"] });
		} catch (error) {
			honeycomb.perf.observer = null;
		}
	}
	if (typeof requestAnimationFrame === "function") requestAnimationFrame(honeycomb.perf.frameTick);
};

honeycomb.perf.frameTick = function (now) {
	if (honeycomb.perf.enabled != true) return;
	var delta = now - honeycomb.perf.lastFrameAt;
	honeycomb.perf.lastFrameAt = now;
	if (delta > 0) {
		honeycomb.perf.frameArray.push(delta);
		//A frame longer than 33ms is a visible drop. Attribute it: a card in the hand means a drag, a
		//busy replay means the turn machinery, anything else is idle.
		if (delta > 33) {
			var scene = honeycomb.combatScene;
			var mode = scene != null && scene.dragCardId != null ? "drag"
				: (scene != null && scene.busy == true ? "replay" : "idle");
			honeycomb.perf.dropByMode[mode] += 1;
		}
	}
	requestAnimationFrame(honeycomb.perf.frameTick);
};

honeycomb.perf.stop = function () {
	honeycomb.perf.enabled = false;
	if (honeycomb.perf.observer != null) {
		try { honeycomb.perf.observer.disconnect(); } catch (error) { /* already gone */ }
		honeycomb.perf.observer = null;
	}
};

honeycomb.perf.toggle = function () {
	if (honeycomb.perf.enabled == true) honeycomb.perf.stop();
	else honeycomb.perf.start();
};

//The replay's own clock: what its beats asked for, against what the browser took.
honeycomb.perf.recordReplay = function (label, expectedMs, actualMs) {
	if (honeycomb.perf.enabled != true) return;
	honeycomb.perf.replayArray.push({ label: label, expectedMs: expectedMs, actualMs: actualMs });
};

//One drag move's cost.
honeycomb.perf.recordDrag = function (ms) {
	if (honeycomb.perf.enabled != true) return;
	honeycomb.perf.dragArray.push(ms);
};

honeycomb.perf.stats = function (valueArray) {
	if (valueArray == null || valueArray.length === 0) return { count: 0, average: 0, p10: 0, p50: 0, p95: 0, worst: 0 };
	var sorted = valueArray.slice().sort(function (left, right) { return left - right; });
	var sum = 0;
	for (var valueIndex = 0; valueIndex < valueArray.length; valueIndex++) sum += valueArray[valueIndex];
	var percentile = function (share) { return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * share))]; };
	return {
		count: valueArray.length,
		average: sum / valueArray.length,
		p10: percentile(0.1),
		p50: percentile(0.5),
		p95: percentile(0.95),
		worst: sorted[sorted.length - 1],
	};
};

//The report as data. `overrunMs` is the replay's actual minus its expected -- the time the browser spent
//not keeping up with the beats it was asked to play.
honeycomb.perf.report = function () {
	var frameStats = honeycomb.perf.stats(honeycomb.perf.frameArray);
	//THE DISPLAY'S OWN CADENCE. The fastest tenth of frames is what the screen allows when nothing is late:
	//about 16.7ms at 60Hz, 8.3ms at 120Hz, and 33.3ms when a battery saver caps the page at 30Hz. A capped
	//page counts roughly half its perfectly on-time frames as ">33ms drops", so `missedFrames` measures
	//lateness against the cadence instead: a frame over one and a half cadences missed at least one.
	var cadenceMs = frameStats.p10;
	var dropped = 0;
	var missed = 0;
	for (var frameIndex = 0; frameIndex < honeycomb.perf.frameArray.length; frameIndex++) {
		if (honeycomb.perf.frameArray[frameIndex] > 33) dropped += 1;
		if (cadenceMs > 0 && honeycomb.perf.frameArray[frameIndex] > cadenceMs * 1.5) missed += 1;
	}
	var replayArray = [];
	for (var replayIndex = 0; replayIndex < honeycomb.perf.replayArray.length; replayIndex++) {
		var entry = honeycomb.perf.replayArray[replayIndex];
		replayArray.push({
			label: entry.label,
			expectedMs: Math.round(entry.expectedMs),
			actualMs: Math.round(entry.actualMs),
			overrunMs: Math.round(entry.actualMs - entry.expectedMs),
		});
	}
	return {
		enabled: honeycomb.perf.enabled,
		elapsedMs: Math.round(honeycomb.perf.now() - honeycomb.perf.startedAt),
		frameStats: frameStats,
		cadenceMs: cadenceMs,
		droppedFrames: dropped,
		missedFrames: missed,
		dropByMode: honeycomb.perf.dropByMode,
		longTaskStats: honeycomb.perf.stats(honeycomb.perf.longTaskArray.map(function (task) { return task.ms; })),
		longTaskArray: honeycomb.perf.longTaskArray,
		replayArray: replayArray,
		dragStats: honeycomb.perf.stats(honeycomb.perf.dragArray),
	};
};

//A one-line summary for the debug panel's own notification, where the console is not visible.
honeycomb.perf.summaryText = function () {
	var report = honeycomb.perf.report();
	var worstReplay = 0;
	for (var replayIndex = 0; replayIndex < report.replayArray.length; replayIndex++) {
		worstReplay = Math.max(worstReplay, report.replayArray[replayIndex].overrunMs);
	}
	var rate = report.frameStats.count === 0 ? 0 : Math.round((report.droppedFrames / report.frameStats.count) * 100);
	var hertz = report.cadenceMs > 0 ? Math.round(1000 / report.cadenceMs) : 0;
	return "frames " + report.frameStats.count + ", cadence " + report.cadenceMs.toFixed(1) + "ms (~" + hertz +
		"Hz), median " + report.frameStats.p50.toFixed(1) + "ms, missed " + report.missedFrames +
		", avg " + report.frameStats.average.toFixed(1) +
		"ms, worst " + report.frameStats.worst.toFixed(0) + "ms, dropped " + report.droppedFrames +
		"/" + report.frameStats.count + " (" + rate + "%: drag " + report.dropByMode.drag + ", replay " +
		report.dropByMode.replay + ", idle " + report.dropByMode.idle + ") | long tasks " +
		report.longTaskStats.count + " (worst " + report.longTaskStats.worst.toFixed(0) + "ms) | replay overrun worst " +
		worstReplay + "ms | drag avg " + report.dragStats.average.toFixed(2) + "ms worst " +
		report.dragStats.worst.toFixed(2) + "ms";
};

//Writes the full report to the console. Returns it.
honeycomb.perf.print = function () {
	var report = honeycomb.perf.report();
	if (typeof console === "undefined") return report;
	var group = typeof console.group === "function" ? console.group : console.log;
	var groupEnd = typeof console.groupEnd === "function" ? console.groupEnd : function () {};
	group.call(console, "[Honeycomb] Performance report (" + report.elapsedMs + "ms)");
	console.log("frames: " + report.frameStats.count + ", cadence " + report.cadenceMs.toFixed(1) + "ms, median " +
		report.frameStats.p50.toFixed(1) + "ms, missed(>1.5 cadence) " + report.missedFrames +
		", avg " + report.frameStats.average.toFixed(1) +
		"ms, p95 " + report.frameStats.p95.toFixed(1) + "ms, worst " + report.frameStats.worst.toFixed(1) +
		"ms, dropped(>33ms) " + report.droppedFrames);
	console.log("long tasks: " + report.longTaskStats.count + ", avg " + report.longTaskStats.average.toFixed(1) +
		"ms, worst " + report.longTaskStats.worst.toFixed(1) + "ms");
	for (var replayIndex = 0; replayIndex < report.replayArray.length; replayIndex++) {
		var replay = report.replayArray[replayIndex];
		console.log("replay " + replay.label + ": expected " + replay.expectedMs + "ms, actual " + replay.actualMs +
			"ms, overrun " + replay.overrunMs + "ms");
	}
	console.log("drag moves: " + report.dragStats.count + ", avg " + report.dragStats.average.toFixed(2) +
		"ms, worst " + report.dragStats.worst.toFixed(2) + "ms");
	groupEnd.call(console);
	return report;
};

//Builds an <img> that survives a missing file. Most honeycomb art does not exist yet, and a broken
//image icon in the middle of a layout hides the layout bug underneath it. Missing files instead draw
//a labelled placeholder, so what is absent stays visible and locatable during the art pass.
//
//options.silentFallback flips that: the image simply disappears instead. Use it for anything drawn at
//FULL-BLEED SIZE -- backdrops, scene art -- where a labelled placeholder would be a wall of text
//across the screen rather than a helpful note, and where the CSS beneath already renders acceptably
//on its own. Anything icon-sized or card-sized should stay loud.
//optionArray: {className, id, alt, style, extra, silentFallback} -- all optional.
//
//A path that has already failed once this session is not asked for again: screens rebuild on every
//change, and each rebuild would otherwise re-request every missing backdrop and placeholder slot.
//Per session and per path, so dropping the real file in and reloading picks it up.
honeycomb.missingImagePathArray = {};

honeycomb.imageTag = function (path, optionArray) {
	var options = optionArray || {};
	var label = String(path == null ? "" : path);
	var knownMissing = honeycomb.missingImagePathArray[label] === true;
	var source = knownMissing
		? (options.silentFallback == true ? honeycomb.blankPixel : honeycomb.placeholderArt(label))
		: honeycomb.image(path);
	if (knownMissing && options.silentFallback == true) {
		var hidden = {};
		for (var optionName in options) {
			if (Object.prototype.hasOwnProperty.call(options, optionName)) hidden[optionName] = options[optionName];
		}
		hidden.style = (options.style ? options.style + ";" : "") + "visibility:hidden";
		options = hidden;
	}
	var attributes = "";
	if (options.id) attributes += ' id="' + options.id + '"';
	if (options.className) attributes += ' class="' + options.className + '"';
	if (options.style) attributes += ' style="' + options.style + '"';
	if (options.extra) attributes += " " + options.extra;
	var handler = options.silentFallback == true
		? "honeycomb.imageFallbackSilent(this)"
		: "honeycomb.imageFallback(this)";
	return '<img src="' + source + '"' + attributes +
		' alt="' + honeycomb.escapeAttribute(options.alt == null ? label : options.alt) + '"' +
		//Decode off the main thread, so a large image does not block a frame while it decodes.
		' decoding="async"' +
		' data-honeycombPath="' + honeycomb.escapeAttribute(label) + '"' +
		' onerror="' + handler + '">';
};

//Swap a failed load for a generated placeholder naming the path that was missing.
honeycomb.imageFallback = function (element) {
	if (element == null || element.dataset == null) return;
	//Guard against a placeholder that somehow fails to load re-entering this handler forever
	if (element.dataset.honeycombFallback === "true") {
		element.onerror = null;
		return;
	}
	element.dataset.honeycombFallback = "true";
	var failedPath = element.dataset.honeycombpath || element.dataset.honeycombPath || "";
	honeycomb.missingImagePathArray[failedPath] = true;
	element.src = honeycomb.placeholderArt(failedPath);
};

//The quiet version: hide the element entirely and let whatever is behind it show through.
honeycomb.imageFallbackSilent = function (element) {
	if (element == null) return;
	element.onerror = null;
	var failedPath = element.dataset == null ? null : (element.dataset.honeycombpath || element.dataset.honeycombPath);
	if (failedPath != null) honeycomb.missingImagePathArray[failedPath] = true;
	element.src = honeycomb.blankPixel;
	element.style.visibility = "hidden";
};

//Generated stand-in art: a hatched panel with the missing path written across it.
honeycomb.placeholderArt = function (label) {
	var settings = honeycomb.tuning.art.placeholder;
	var text = String(label).split("/").pop();
	var markup =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + settings.viewWidth + " " + settings.viewHeight + '">' +
		'<defs><pattern id="h" width="' + settings.hatchSize + '" height="' + settings.hatchSize + '" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
		'<rect width="' + settings.hatchSize + '" height="' + settings.hatchSize + '" fill="' + settings.backColor + '"/>' +
		'<rect width="' + settings.hatchWidth + '" height="' + settings.hatchSize + '" fill="' + settings.lineColor + '"/>' +
		"</pattern></defs>" +
		'<rect width="100%" height="100%" fill="url(#h)"/>' +
		'<rect x="' + settings.inset + '" y="' + settings.inset + '" width="' + (settings.viewWidth - settings.inset * 2) + '" height="' + (settings.viewHeight - settings.inset * 2) + '" fill="none" stroke="' + settings.lineColor + '" stroke-width="' + settings.strokeWidth + '"/>' +
		'<text x="50%" y="50%" fill="' + settings.textColor + '" font-family="monospace" font-size="' + settings.fontSize + '" text-anchor="middle" dominant-baseline="middle">' +
		honeycomb.escapeText(text) + "</text></svg>";
	return honeycomb.svgToDataUri(markup);
};

//---------------------------------------------------------------------------------------------------
//Text helpers
//---------------------------------------------------------------------------------------------------
//Content strings reach the DOM through template literals, so anything author-supplied is escaped on
//the way in rather than trusted.
honeycomb.escapeText = function (value) {
	return String(value == null ? "" : value)
		.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

honeycomb.escapeAttribute = function (value) {
	return honeycomb.escapeText(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};

//For author-written prose only: scene text may contain <i>, <b> and <br> by hand, and escapeText turns
//them into entities. This escapes EVERYTHING first and then puts back a fixed allowlist of three, so a
//content typo still cannot inject markup -- there is no path here for an attribute, a script or an
//unclosed anything.
//
//Use it for event body text, dialogue lines and result text. NOT for a speaker name or any other label:
//a label is not prose and has no reason to carry markup.
honeycomb.escapeRichText = function (value) {
	return honeycomb.escapeText(value)
		.replace(/&lt;(\/?)(i|b)&gt;/g, "<$1$2>")
		.replace(/&lt;br\s*\/?&gt;/g, "<br>");
};

//---------------------------------------------------------------------------------------------------
//Recent errors
//---------------------------------------------------------------------------------------------------
//The last few errors the page threw, kept so a copied-out bug report can carry them: a tester's "it
//broke and I can't say how" usually has its answer in the console they never opened. Listened for at
//load; the shim the tests run under has no listeners, and that is fine.
honeycomb.recentErrorArray = [];

honeycomb.noteError = function (text) {
	honeycomb.recentErrorArray.push({ when: new Date().toISOString(), text: String(text) });
	var limit = honeycomb.tuning == null ? 20 : honeycomb.tuning.save.reportErrorLimit;
	if (honeycomb.recentErrorArray.length > limit) honeycomb.recentErrorArray.splice(0, honeycomb.recentErrorArray.length - limit);
};

if (typeof window.addEventListener === "function") {
	window.addEventListener("error", function (event) {
		honeycomb.noteError((event.message || "error") + " @ " + (event.filename || "?") + ":" + (event.lineno || 0));
	});
	window.addEventListener("unhandledrejection", function (event) {
		honeycomb.noteError("unhandled rejection: " + (event.reason == null ? "?" : (event.reason.message || event.reason)));
	});
}

//---------------------------------------------------------------------------------------------------
//Definition lookup
//---------------------------------------------------------------------------------------------------
//Every content table in honeycomb is a flat array of objects carrying an `index` string, matching the
//convention the rest of Syrup Town uses. Lookups go through here so a typo reports itself once,
//loudly, instead of surfacing as an undefined read three calls later.
honeycomb.findDefinition = function (definitionArray, index) {
	if (definitionArray == null) return null;
	for (var entryIndex = 0; entryIndex < definitionArray.length; entryIndex++) {
		if (definitionArray[entryIndex].index == index) return definitionArray[entryIndex];
	}
	return null;
};

//Same lookup, but a miss is an authoring error worth a console entry naming the table.
honeycomb.requireDefinition = function (definitionArray, index, tableName) {
	var found = honeycomb.findDefinition(definitionArray, index);
	if (found == null) {
		console.error("Honeycomb: no entry '" + index + "' in " + tableName);
	}
	return found;
};

//---------------------------------------------------------------------------------------------------
//Deterministic RNG
//---------------------------------------------------------------------------------------------------
//Every random draw in a run must be reproducible from the run's seed, including after a save/load and
//including when the player reloads mid-combat. Two rules make that hold:
//
//  1. Randomness is drawn from NAMED STREAMS. Map generation, combat shuffles, event rolls and reward
//     rolls each keep their own counter, so consuming an extra draw in one system cannot shift the
//     results of another. Adding a new random call to combat will never re-roll the map.
//  2. A stream's whole state is (seed, calls). mulberry32 advances by a fixed step per call, so the
//     nth value is derivable directly from the seed and the count -- saving the integer `calls` is
//     therefore a complete, exact snapshot. No PRNG internals reach the save file.
honeycomb.rng = {};

//The single hash behind every stream. Kept separate from state so it can be tested in isolation.
honeycomb.rng.hash = function (state) {
	var value = state >>> 0;
	value = Math.imul(value ^ (value >>> 15), value | 1);
	value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
	return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
};

//The nth value of a stream, derived rather than iterated.
honeycomb.rng.valueAt = function (seed, callIndex) {
	var step = honeycomb.tuning.rng.mulberryStep;
	return honeycomb.rng.hash(((seed >>> 0) + Math.imul(callIndex + 1, step)) >>> 0);
};

//Streams live on the run state so they travel with a save. Named streams are created on demand and
//seeded by mixing the run seed with the stream's own name, so two streams never run in lockstep.
honeycomb.rng.stream = function (streamIndex) {
	var state = honeycomb.state;
	if (state == null) {
		console.error("Honeycomb: RNG stream '" + streamIndex + "' requested with no run state");
		return null;
	}
	if (state.rng == null) state.rng = {};
	if (state.rng[streamIndex] == null) {
		state.rng[streamIndex] = {
			seed: honeycomb.rng.mixSeed(state.seed, streamIndex),
			calls: 0,
		};
	}
	return state.rng[streamIndex];
};

//Derives a stream seed from the run seed and the stream name. Any string works, so a new stream can
//be introduced without touching save migration.
honeycomb.rng.mixSeed = function (seed, streamIndex) {
	var mixed = seed >>> 0;
	var text = String(streamIndex);
	for (var charIndex = 0; charIndex < text.length; charIndex++) {
		mixed = Math.imul(mixed ^ text.charCodeAt(charIndex), honeycomb.tuning.rng.seedMixPrime) >>> 0;
	}
	return mixed >>> 0;
};

//A float in [0,1) from the named stream.
honeycomb.rng.next = function (streamIndex) {
	var stream = honeycomb.rng.stream(streamIndex);
	if (stream == null) return 0;
	var value = honeycomb.rng.valueAt(stream.seed, stream.calls);
	stream.calls += 1;
	return value;
};

//An integer in [minimum, maximum] inclusive.
honeycomb.rng.range = function (streamIndex, minimum, maximum) {
	if (maximum <= minimum) return minimum;
	return minimum + Math.floor(honeycomb.rng.next(streamIndex) * (maximum - minimum + 1));
};

//A random member of an array, or null when it is empty.
honeycomb.rng.pick = function (streamIndex, sourceArray) {
	if (sourceArray == null || sourceArray.length === 0) return null;
	return sourceArray[Math.floor(honeycomb.rng.next(streamIndex) * sourceArray.length)];
};

//Weighted pick. entryArray members carry a `weight`; entries missing one use tuning's default so a
//table can be written without spelling out equal weights.
honeycomb.rng.pickWeighted = function (streamIndex, entryArray) {
	if (entryArray == null || entryArray.length === 0) return null;
	var defaultWeight = honeycomb.tuning.rng.defaultWeight;
	var total = 0;
	for (var countIndex = 0; countIndex < entryArray.length; countIndex++) {
		var weight = entryArray[countIndex].weight;
		total += (weight == null ? defaultWeight : weight);
	}
	if (total <= 0) return null;
	var roll = honeycomb.rng.next(streamIndex) * total;
	for (var pickIndex = 0; pickIndex < entryArray.length; pickIndex++) {
		var entryWeight = entryArray[pickIndex].weight;
		roll -= (entryWeight == null ? defaultWeight : entryWeight);
		if (roll < 0) return entryArray[pickIndex];
	}
	return entryArray[entryArray.length - 1];
};

//Fisher-Yates against a named stream. Shuffles a COPY, since deck order is state the caller owns.
honeycomb.rng.shuffle = function (streamIndex, sourceArray) {
	var result = sourceArray.slice();
	for (var shuffleIndex = result.length - 1; shuffleIndex > 0; shuffleIndex--) {
		var swapIndex = Math.floor(honeycomb.rng.next(streamIndex) * (shuffleIndex + 1));
		var held = result[shuffleIndex];
		result[shuffleIndex] = result[swapIndex];
		result[swapIndex] = held;
	}
	return result;
};

//A fresh run seed. Time-based when unspecified, but always recorded on the run so any run can be
//replayed exactly by passing its seed back in.
honeycomb.rng.newSeed = function () {
	return (Date.now() ^ Math.floor(Math.random() * honeycomb.tuning.rng.seedSpread)) >>> 0;
};

//---------------------------------------------------------------------------------------------------
//Identifier issuing
//---------------------------------------------------------------------------------------------------
//Cards, characters and enemies all need per-instance identity that survives a save: two copies of
//Strike in one deck are different objects with different upgrades. Counters live on the run state so
//they never repeat across a load, and they are deliberately NOT random -- reproducing a run must
//reproduce its identifiers too.
honeycomb.nextIdentifier = function (prefix) {
	var state = honeycomb.state;
	if (state == null) return prefix + "_0";
	if (state.identifierCounterArray == null) state.identifierCounterArray = {};
	if (state.identifierCounterArray[prefix] == null) state.identifierCounterArray[prefix] = 0;
	state.identifierCounterArray[prefix] += 1;
	return prefix + "_" + state.identifierCounterArray[prefix];
};

//---------------------------------------------------------------------------------------------------
//Scene routing
//---------------------------------------------------------------------------------------------------
//Honeycomb owns one full-viewport element and swaps its contents between scenes. Scenes register
//themselves into honeycomb.sceneArray from their own files, so adding a screen never edits the router.
honeycomb.sceneArray = [];

honeycomb.scene = {
	//Index of the scene currently built, or "" when honeycomb is not running
	current: "",
	//Params the current scene was entered with, kept so a scene can rebuild itself in place
	currentParams: null,
};

//Registers or replaces a scene definition.
//definition: {index, build(rootElement, params), teardown(), cssClass}
honeycomb.scene.register = function (definition) {
	for (var scanIndex = 0; scanIndex < honeycomb.sceneArray.length; scanIndex++) {
		if (honeycomb.sceneArray[scanIndex].index == definition.index) {
			honeycomb.sceneArray[scanIndex] = definition;
			return;
		}
	}
	honeycomb.sceneArray.push(definition);
};

//Tears down whatever is showing and builds the requested scene in its place.
honeycomb.scene.go = function (sceneIndex, params) {
	var definition = honeycomb.requireDefinition(honeycomb.sceneArray, sceneIndex, "honeycomb.sceneArray");
	if (definition == null) return;

	var previous = honeycomb.findDefinition(honeycomb.sceneArray, honeycomb.scene.current);
	if (previous != null && typeof previous.teardown === "function") previous.teardown();

	//Overlays belong to the scene that opened them and never survive a scene change
	honeycomb.overlay.closeAll();

	var root = honeycomb.rootElement();
	if (root == null) return;
	root.className = honeycomb.tuning.dom.rootClass + " " + honeycomb.tuning.dom.scenePrefix + sceneIndex;
	root.innerHTML = "";

	//Same reason: the screen a tooltip was describing has just been thrown away -- and anything a first
	//tap had readied belongs to that screen too.
	if (honeycomb.tooltip != null) honeycomb.tooltip.hide();
	if (honeycomb.input != null && honeycomb.scene.current != sceneIndex) honeycomb.input.disarm();

	var leftSceneIndex = honeycomb.scene.current;
	honeycomb.scene.current = sceneIndex;
	honeycomb.scene.currentParams = params == null ? {} : params;
	definition.build(root, honeycomb.scene.currentParams);
	//Which track the new screen asks for, if any (tuning.audio.music.sceneCueMap)
	if (honeycomb.music != null) honeycomb.music.onScene(sceneIndex, leftSceneIndex);
};

//Rebuilds the current scene from current state. Used after any change that alters what is on screen
//without changing which screen it is.
//
//A rebuild replaces every element, which would throw every scrolled panel back to the top -- clicking a
//tree node near the bottom of a long tab would lose the player's place. A panel that should keep its
//place carries `data-hcScrollKey`; its scroll is read before the rebuild and given back to whichever
//new panel carries the same key. A key that changed (another tab, another character) starts at the top.
honeycomb.scene.refresh = function () {
	if (honeycomb.scene.current === "") return;
	var root = honeycomb.rootElement();
	var remembered = {};
	var keptArray = root == null ? [] : root.querySelectorAll("[data-hcScrollKey]");
	for (var keptIndex = 0; keptIndex < keptArray.length; keptIndex++) {
		remembered[keptArray[keptIndex].dataset.hcscrollkey] = { top: keptArray[keptIndex].scrollTop, left: keptArray[keptIndex].scrollLeft };
	}
	honeycomb.scene.go(honeycomb.scene.current, honeycomb.scene.currentParams);
	var freshArray = root == null ? [] : root.querySelectorAll("[data-hcScrollKey]");
	for (var freshIndex = 0; freshIndex < freshArray.length; freshIndex++) {
		var scrolled = remembered[freshArray[freshIndex].dataset.hcscrollkey];
		if (scrolled == null) continue;
		freshArray[freshIndex].scrollTop = scrolled.top;
		freshArray[freshIndex].scrollLeft = scrolled.left;
	}
};

//---------------------------------------------------------------------------------------------------
//Overlays
//---------------------------------------------------------------------------------------------------
//Victory, defeat, card rewards, event choices and confirmation prompts are all the same shape: a
//layer stacked over the live scene that does not disturb it. They stack, so an event can raise a
//reward on top of itself.
honeycomb.overlayArray = [];
honeycomb.overlay = { openArray: [] };

honeycomb.overlay.register = function (definition) {
	for (var scanIndex = 0; scanIndex < honeycomb.overlayArray.length; scanIndex++) {
		if (honeycomb.overlayArray[scanIndex].index == definition.index) {
			honeycomb.overlayArray[scanIndex] = definition;
			return;
		}
	}
	honeycomb.overlayArray.push(definition);
};

honeycomb.overlay.open = function (overlayIndex, params) {
	var definition = honeycomb.requireDefinition(honeycomb.overlayArray, overlayIndex, "honeycomb.overlayArray");
	if (definition == null) return;
	var host = honeycomb.overlayHostElement();
	if (host == null) return;

	var layer = document.createElement("div");
	layer.className = honeycomb.tuning.dom.overlayClass + " " + honeycomb.tuning.dom.overlayPrefix + overlayIndex;
	layer.id = honeycomb.tuning.dom.overlayIdPrefix + overlayIndex;
	//Stacking order rises with depth so a nested overlay always lands above its opener
	layer.style.zIndex = String(honeycomb.tuning.dom.overlayBaseZ + honeycomb.overlay.openArray.length);
	host.appendChild(layer);
	honeycomb.overlay.openArray.push({ index: overlayIndex, element: layer, params: params == null ? {} : params });
	definition.build(layer, params == null ? {} : params);
	//A window may be dismissed by pressing the ground beside it. A phone's fullscreen notification can
	//sit over a window's own close button, so an informational window opts in and the press that lands
	//on the dimmed layer itself -- not on the panel, and not on anything in it -- closes it. A window
	//that demands a decision does not opt in.
	if (definition.closeOnBackdrop == true) {
		layer.onclick = function (event) {
			if (event.target != layer) return;
			honeycomb.overlay.close(overlayIndex);
		};
	}
};

honeycomb.overlay.close = function (overlayIndex) {
	//A tooltip describes an element. Removing the element does not fire its mouseleave, so a tooltip
	//opened over an overlay would outlive the overlay and sit on the screen describing nothing.
	if (honeycomb.tooltip != null) honeycomb.tooltip.hide();

	for (var scanIndex = honeycomb.overlay.openArray.length - 1; scanIndex >= 0; scanIndex--) {
		var open = honeycomb.overlay.openArray[scanIndex];
		if (overlayIndex != null && open.index != overlayIndex) continue;
		var definition = honeycomb.findDefinition(honeycomb.overlayArray, open.index);
		if (definition != null && typeof definition.teardown === "function") definition.teardown();
		if (open.element && open.element.parentNode) open.element.parentNode.removeChild(open.element);
		honeycomb.overlay.openArray.splice(scanIndex, 1);
		if (overlayIndex != null) return;
	}
};

//Closes the topmost overlay only. Backing out of a stack one step at a time.
honeycomb.overlay.closeTop = function () {
	if (honeycomb.overlay.openArray.length === 0) return;
	honeycomb.overlay.close(honeycomb.overlay.openArray[honeycomb.overlay.openArray.length - 1].index);
};

honeycomb.overlay.closeAll = function () {
	honeycomb.overlay.close(null);
};

honeycomb.overlay.isOpen = function (overlayIndex) {
	for (var scanIndex = 0; scanIndex < honeycomb.overlay.openArray.length; scanIndex++) {
		if (honeycomb.overlay.openArray[scanIndex].index == overlayIndex) return true;
	}
	return false;
};

//---------------------------------------------------------------------------------------------------
//DOM ownership
//---------------------------------------------------------------------------------------------------
//Honeycomb builds exactly one element on the host page. Everything it draws lives inside that element,
//so tearing the game down is one removeChild and the host's own DOM is never edited.
honeycomb.rootElement = function () {
	return document.getElementById(honeycomb.tuning.dom.rootId);
};

//Overlays mount to the root's overlay host rather than the scene body, so a scene rebuild leaves
//them alone and they are never caught by root.innerHTML = "".
honeycomb.overlayHostElement = function () {
	return document.getElementById(honeycomb.tuning.dom.overlayHostId);
};

//Creates the root element and hides the host's chrome. Safe to call twice.
honeycomb.mount = function () {
	if (honeycomb.rootElement() != null) return;

	var parent = honeycomb.platform.mountParent();
	if (parent == null) {
		console.error("Honeycomb: no mount parent available");
		return;
	}

	//Remember each chrome element's own inline display so exiting restores exactly what was there,
	//rather than assuming a default
	honeycomb.hiddenChromeArray = [];
	var chromeArray = honeycomb.platform.chromeElementIndexArray;
	for (var chromeIndex = 0; chromeIndex < chromeArray.length; chromeIndex++) {
		var element = document.getElementById(chromeArray[chromeIndex]);
		if (element == null) continue;
		honeycomb.hiddenChromeArray.push({ element: element, display: element.style.display });
		element.style.display = "none";
	}

	var root = document.createElement("div");
	root.id = honeycomb.tuning.dom.rootId;
	root.className = honeycomb.tuning.dom.rootClass;
	parent.appendChild(root);

	var overlayHost = document.createElement("div");
	overlayHost.id = honeycomb.tuning.dom.overlayHostId;
	overlayHost.className = honeycomb.tuning.dom.overlayHostClass;
	parent.appendChild(overlayHost);

	//Which kind of pointer is being used, recorded as each one goes down. On honeycomb's OWN two
	//elements, in the capture phase so it is known before any handler inside runs -- never on the
	//document, which Syrup Town's Jiggy minigame owns. See honeycomb.input.
	root.addEventListener("pointerdown", honeycomb.input.notePointer, true);
	overlayHost.addEventListener("pointerdown", honeycomb.input.notePointer, true);

	//Watches for a change of screen size: a window resized, a phone going fullscreen and losing its
	//address bar. The stylesheet rescales by itself, since every length is in honeycomb pixels; this is
	//for the few layouts the code measures once and draws. Watched through a ResizeObserver on honeycomb's
	//OWN root, which is pinned to the viewport, rather than a window listener -- REQUIREMENTS §8 holds
	//honeycomb to no document- or window-level listeners. Disconnected by unmount.
	if (typeof ResizeObserver == "function") {
		honeycomb.viewportObserver = new ResizeObserver(honeycomb.onViewportResize);
		honeycomb.viewportObserver.observe(root);
	}

	//The game is laid out for landscape; on a narrow screen held upright a full-screen note asks for the
	//device to be turned. It is CSS alone that decides when it
	//shows (a portrait media query), so rotating the device hides it with no code involved -- and the
	//game underneath keeps running, so nothing is lost either way. "Play anyway" dismisses it for the
	//session, for a player who would rather not. Switched by tuning.dom.rotateHintEnabled.
	if (!honeycomb.tuning.dom.rotateHintEnabled) return;
	var rotateHint = document.createElement("div");
	rotateHint.id = honeycomb.tuning.dom.rotateHintId;
	rotateHint.className = "hcRotateHint";
	//A tap anywhere on it dismisses it, not only the button: a full-screen message a player cannot make
	//go away is the worst thing a small screen can show them, and on a phone the button may be the part
	//under their thumb or off the bottom of a squat viewport.
	rotateHint.onclick = function () { rotateHint.classList.add("hcDismissed"); };
	rotateHint.innerHTML = '<div class="hcRotateHintIcon"></div>' +
		'<div class="hcRotateHintTitle">Turn your device sideways</div>' +
		'<div class="hcRotateHintBody">Honeycomb Catacombs is played in landscape.</div>' +
		'<div class="hcButton">Play anyway</div>' +
		'<div class="hcTiny hcDim">(tap anywhere to dismiss)</div>';
	parent.appendChild(rotateHint);
};

//---------------------------------------------------------------------------------------------------
//Input kind
//---------------------------------------------------------------------------------------------------
//A touchscreen has no hover, so everything hover reveals needs another way in. The usual one here is
//tap to read, tap again to act: a first tap does what hovering would, a second on the same thing does
//what a click would. Handlers ask `honeycomb.input.isTouch()` -- which knows the
//pointer behind the click they are handling -- rather than guessing from the device, because a laptop
//with a touchscreen is both.
honeycomb.input = {
	lastPointerType: "mouse",
	//What a first tap has readied, as a key only the caller understands; a second tap on the same key
	//acts. Anything else tapped replaces it.
	armedKey: null,
};

honeycomb.input.notePointer = function (event) {
	if (event != null && event.pointerType != null && event.pointerType !== "") honeycomb.input.lastPointerType = event.pointerType;
	if (honeycomb.input.isTouch() && honeycomb.tooltip != null) honeycomb.tooltip.onTouchElsewhere(event);
	//A panel pinned open by a click closes on a press anywhere else, whatever the pointer.
	if (honeycomb.tooltip != null && honeycomb.tooltip.onPointerDown != null) honeycomb.tooltip.onPointerDown(event);
};

honeycomb.input.isTouch = function () {
	return honeycomb.input.lastPointerType == "touch" || honeycomb.input.lastPointerType == "pen";
};

//THE FIRST TAP READIES, THE SECOND ACTS. Returns true when `key` was already readied -- act now -- and
//false after readying it -- show what hovering would have shown. With a mouse it always returns true:
//a click is already a considered act, since the hover came first.
honeycomb.input.tapToAct = function (key) {
	if (honeycomb.input.isTouch() == false) return true;
	if (honeycomb.input.armedKey === key) { honeycomb.input.armedKey = null; return true; }
	honeycomb.input.armedKey = key;
	return false;
};

honeycomb.input.disarm = function () {
	honeycomb.input.armedKey = null;
};

//Redraws what the code measured for the old screen size. The observer already reports at most once a
//frame, however many sizes a drag of the window passes through. Only measured layouts belong here: a
//scene rebuild would close overlays.
honeycomb.viewportObserver = null;
honeycomb.onViewportResize = function () {
	if (honeycomb.progressionScreen != null) honeycomb.progressionScreen.fitToStage();
};

//Removes everything honeycomb built and puts the host's chrome back the way it was found.
honeycomb.unmount = function () {
	if (honeycomb.viewportObserver != null) honeycomb.viewportObserver.disconnect();
	honeycomb.viewportObserver = null;
	honeycomb.overlay.closeAll();
	//Before the host is handed control: its own music comes back here (platform.resumeHostMusic)
	if (honeycomb.music != null) honeycomb.music.end();

	var previous = honeycomb.findDefinition(honeycomb.sceneArray, honeycomb.scene.current);
	if (previous != null && typeof previous.teardown === "function") previous.teardown();
	honeycomb.scene.current = "";
	honeycomb.scene.currentParams = null;

	var idArray = [honeycomb.tuning.dom.rootId, honeycomb.tuning.dom.overlayHostId, honeycomb.tuning.dom.rotateHintId];
	for (var removeIndex = 0; removeIndex < idArray.length; removeIndex++) {
		var element = document.getElementById(idArray[removeIndex]);
		if (element != null && element.parentNode) element.parentNode.removeChild(element);
	}

	var hidden = honeycomb.hiddenChromeArray || [];
	for (var restoreIndex = 0; restoreIndex < hidden.length; restoreIndex++) {
		hidden[restoreIndex].element.style.display = hidden[restoreIndex].display;
	}
	honeycomb.hiddenChromeArray = [];
};

//Leaves honeycomb entirely and hands control back to the host.
honeycomb.quit = function () {
	honeycomb.save.autosave();
	honeycomb.unmount();
	honeycomb.platform.exit();
};

//---------------------------------------------------------------------------------------------------
//Boot
//---------------------------------------------------------------------------------------------------
//The single entry point. Called from devPreviewBoot() during development and from whatever the host
//eventually uses to open the game.
function honeycombBoot(options) {
	var settings = options == null ? {} : options;
	//Content that breaks the standing rules, to the console only.
	if (honeycomb.warnings != null) honeycomb.warnings.runOnce();
	//Saves from before the cutoff are purged first, before anything reads one. A profile from the alpha
	//loads cleanly and then describes content that no longer exists; see honeycomb.save.purgeStaleSlots
	//and tuning.save.staleBeforeVersion.
	if (honeycomb.save != null && honeycomb.save.purgeStaleSlots != null) honeycomb.save.purgeStaleSlots();
	honeycomb.mount();
	//Warms the common art in the background so the first draw of a sprite or a card is local. Nothing
	//waits on it: it yields between small batches and stands down on a metered connection.
	if (honeycomb.preload != null) honeycomb.preload.warmCommon();

	//A save is only resumed when one exists and the caller did not demand a fresh start
	if (settings.fresh != true && honeycomb.save.hasAutosave() == true) {
		honeycomb.save.loadAutosave();
	}
	if (honeycomb.state == null) {
		honeycomb.state = honeycomb.newProfile();
	}

	if (settings.scene != null) {
		honeycomb.scene.go(settings.scene, settings.params);
		return;
	}
	honeycomb.resume();
}

//Goes wherever the loaded save was, INCLUDING back into a map node's screen that was open when the game
//closed. A node is saved as entered before its screen opens, so without the second step a reload would
//strand the party on an unfinished node with no screen and no moves.
honeycomb.resume = function () {
	var scene = honeycomb.resumeScene();
	honeycomb.scene.go(scene);
	if (scene == "map" && honeycomb.map != null) honeycomb.map.resumeUnfinishedNode();
};

//Where a boot should land, given what the loaded save was in the middle of. A player who closes the
//game mid-fight expects to come back to that fight, not to the roster.
honeycomb.resumeScene = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return honeycomb.tuning.flow.entryScene;
	//An unfinished fight outranks the map: the combat state is what would be lost by ignoring it.
	if (run.combat != null && run.combat.phase != "victory" && run.combat.phase != "defeat") return "combat";
	if (run.map != null) return "map";
	return honeycomb.tuning.flow.entryScene;
};

//Exposed on the namespace too, so nothing outside has to depend on a bare global name.
honeycomb.boot = honeycombBoot;
