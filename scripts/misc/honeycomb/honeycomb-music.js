//===================================================================================================
//HONEYCOMB CATACOMBS -- looping music
//===================================================================================================
//Three tracks, one audible at a time, each looping without a gap (audio/ B12). Which track a moment
//asks for is a table in tuning.audio.music; this file only knows how to play one.
//
//WHY PLAIN <audio> AND NOT WEB AUDIO. A sample-accurate loop wants a decoded buffer, and a decoded
//buffer wants the file's bytes: `fetch` and XHR are both refused on a `file://` page, which BASICS
//requires to work, and two minutes of decoded stereo is fifty megabytes a track on a phone. An
//<audio> element streams, costs nothing at boot and plays from anywhere.
//
//WHY TWO ELEMENTS A TRACK. `audio.loop` seeks back to zero when the file runs out, and every browser
//leaves a hole of a few tens of milliseconds while it does -- in a sustained pad that is a hiccup
//once a lap. So nothing here ever loops a file. Each file is built
//(!designDocs/honeycomb/tools/music/build-music-loops.py) as one full lap followed by a POST-ROLL that
//repeats the first few seconds of the lap:
//
//    file[t + loopSeconds] is the same audio as file[t], for every t inside the post-roll
//
//While the sounding element is inside its post-roll a second element is started from the top, lined
//up against it, and the two are swapped. Both are playing IDENTICAL audio at that moment, so the swap
//cannot be heard even when it lands late -- and it does land late: a hidden tab is given one timer
//tick a second. Every musical decision (which bars, where the splice falls, how the old section rings
//out under the new one) was made offline and sample-accurate; the browser is only asked to change
//over between two copies of the same sound at any point in a window several seconds wide.
//
//THE HOST'S OWN MUSIC is silenced while this plays and handed back untouched afterwards, through
//honeycomb.platform.suspendHostMusic / resumeHostMusic. The on/off flag is the host's and is shared.
//
//Nothing in this file touches a browser object at load. Elements come from honeycomb.music.createElement
//and time from honeycomb.music.now, and the suite replaces both to drive a whole lap headlessly.
honeycomb.music = {
	//True between begin() and end(): honeycomb is mounted and owns the speakers
	running: false,
	//Index of the track that should be audible, or null. Kept while music is switched off, so
	//switching it back on resumes the right one.
	currentTrack: null,
	//One player per track that has been asked for so far, by track index
	playerMap: {},
	//Handle of the pending tick, or null while there is nothing to move
	tickHandle: null,
	//Clock reading at the previous tick, so a fade advances by real elapsed time however late a tick is
	lastTickAt: null,
	//False on a browser that ignores `audio.volume` (iOS Safari). Fades become cuts there.
	volumeControllable: true,
	//True once a play() has been refused for want of a user gesture; nudge() retries
	blocked: false,
};

//---------------------------------------------------------------------------------------------------
//Seams the suite replaces
//---------------------------------------------------------------------------------------------------
honeycomb.music.createElement = function (path) {
	if (typeof Audio !== "function") return null;
	var element = new Audio();
	element.preload = "auto";
	element.src = encodeURI(path);
	return element;
};

honeycomb.music.now = function () {
	return Date.now();
};

honeycomb.music.schedule = function (callback, delayMs) {
	return setTimeout(callback, delayMs);
};

//---------------------------------------------------------------------------------------------------
//Lifecycle
//---------------------------------------------------------------------------------------------------
//Called when honeycomb mounts. Safe to call twice.
honeycomb.music.begin = function () {
	if (honeycomb.music.running == true) return;
	honeycomb.music.running = true;
	honeycomb.music.volumeControllable = honeycomb.music.probeVolumeControl();
	honeycomb.platform.suspendHostMusic();
};

//Called when honeycomb unmounts: every element is stopped and released, and the host gets its music
//back. Nothing is faded -- the screen the music belonged to is already gone.
honeycomb.music.end = function () {
	if (honeycomb.music.running != true) return;
	honeycomb.music.running = false;
	if (honeycomb.music.tickHandle != null) clearTimeout(honeycomb.music.tickHandle);
	honeycomb.music.tickHandle = null;
	honeycomb.music.lastTickAt = null;
	for (var trackIndex in honeycomb.music.playerMap) {
		var player = honeycomb.music.playerMap[trackIndex];
		for (var elementIndex = 0; elementIndex < player.elementArray.length; elementIndex++) {
			var element = player.elementArray[elementIndex];
			if (element == null) continue;
			element.pause();
			//Dropping the source is what lets a browser release the decoder and the download
			element.removeAttribute("src");
			if (typeof element.load === "function") element.load();
		}
	}
	honeycomb.music.playerMap = {};
	honeycomb.music.currentTrack = null;
	honeycomb.music.blocked = false;
	honeycomb.platform.resumeHostMusic();
};

//iOS Safari keeps `volume` at 1 whatever is written to it. Asked once, on an element with no source.
honeycomb.music.probeVolumeControl = function () {
	if (typeof Audio !== "function") return true;
	try {
		var probe = new Audio();
		probe.volume = honeycomb.tuning.audio.music.volumeProbeLevel;
		return probe.volume == honeycomb.tuning.audio.music.volumeProbeLevel;
	} catch (probeError) {
		return true;
	}
};

//---------------------------------------------------------------------------------------------------
//Cues: what asks for a track
//---------------------------------------------------------------------------------------------------
//A scene was just built. A scene with a track of its own gets it; leaving such a scene for one with
//none gets that scene's follow-up (combat -> map); otherwise whatever is playing carries on, and
//silence is filled with the default.
honeycomb.music.onScene = function (sceneIndex, previousSceneIndex) {
	var settings = honeycomb.tuning.audio.music;
	if (honeycomb.music.running != true) honeycomb.music.begin();
	var wanted = null;
	//A scene rebuilding itself in place is not an arrival. The combat scene does exactly that under its
	//victory screen, and treating it as one would restart the combat track over a fight already won.
	if (previousSceneIndex != sceneIndex) {
		wanted = settings.sceneCueMap[sceneIndex];
		var left = settings.sceneCueMap[previousSceneIndex];
		if (wanted == null && left != null && left == honeycomb.music.currentTrack) wanted = settings.afterSceneCueMap[previousSceneIndex];
	}
	if (wanted == null && honeycomb.music.currentTrack == null) {
		wanted = settings.sceneCueMap[sceneIndex] == null ? settings.defaultTrack : settings.sceneCueMap[sceneIndex];
	}
	if (wanted != null) honeycomb.music.cue(wanted);
};

//A named moment that is not a scene change (tuning.audio.music.eventCueMap): a fight being decided.
honeycomb.music.onEvent = function (eventIndex) {
	var wanted = honeycomb.tuning.audio.music.eventCueMap[eventIndex];
	if (wanted != null) honeycomb.music.cue(wanted);
};

//Makes one track the audible one. Asking for the track already playing changes nothing, so a scene
//that rebuilds itself in place never restarts its music.
honeycomb.music.cue = function (trackIndex) {
	if (honeycomb.music.running != true) return;
	if (honeycomb.music.currentTrack == trackIndex) return;
	var settings = honeycomb.tuning.audio.music;
	var definition = honeycomb.findDefinition(settings.trackArray, trackIndex);
	if (definition == null) return;

	var transition = honeycomb.music.transitionFor(trackIndex);
	var leaving = honeycomb.music.currentTrack == null ? null : honeycomb.music.playerMap[honeycomb.music.currentTrack];
	if (leaving != null) {
		leaving.targetGain = 0;
		leaving.fadeMs = transition.fadeOutMs;
	}

	honeycomb.music.currentTrack = trackIndex;
	var player = honeycomb.music.playerFor(definition);
	player.targetGain = 1;
	player.fadeMs = transition.fadeInMs;
	//Only a change of track waits: the first music of a session has nothing to let finish
	player.startAt = honeycomb.music.now() + (leaving == null ? 0 : transition.delayMs);
	honeycomb.music.wake();
};

honeycomb.music.transitionFor = function (trackIndex) {
	var settings = honeycomb.tuning.audio.music;
	var specific = settings.transitionByTrackMap[trackIndex];
	return specific == null ? settings.transition : specific;
};

//The host's music switch was pressed from one of honeycomb's own menus (platform.setMusicEnabled), or
//anything else changed whether music may sound. The remembered track fades out or back in.
honeycomb.music.refresh = function () {
	if (honeycomb.music.running != true) return;
	honeycomb.music.wake();
};

//A play() refused for want of a user gesture is retried from inside the next one. platform.sound calls
//this, and every button in the game makes a sound, so no listener is needed anywhere.
honeycomb.music.nudge = function () {
	if (honeycomb.music.blocked != true) return;
	honeycomb.music.blocked = false;
	honeycomb.music.wake();
	honeycomb.music.tick();
};

//---------------------------------------------------------------------------------------------------
//Players
//---------------------------------------------------------------------------------------------------
//The player for a track, made on first request. Elements are made lazily too: the second one is not
//needed until the first lap is nearly over.
honeycomb.music.playerFor = function (definition) {
	var existing = honeycomb.music.playerMap[definition.index];
	if (existing != null) return existing;
	var player = {
		definition: definition,
		//Two elements at most. `live` is the one carrying the music; the other is only ever non-idle
		//for the second or so a changeover takes.
		elementArray: [null, null],
		live: 0,
		//The track's own level, 0 to 1, moving toward targetGain over fadeMs
		gain: 0,
		targetGain: 0,
		fadeMs: 0,
		//Clock reading before which the track stays silent (a transition's delay)
		startAt: 0,
		//Changeover: null, or {stage: "starting" | "aligning" | "fading", corrections, progress, aimedAt}
		handoff: null,
		//LEARNED, per track and per session: how long this browser takes to produce sound after play()
		//and after a seek. Both start at the tuning guess and are replaced by what was measured, so the
		//second lap is usually lined up at the first attempt.
		startLatencySeconds: honeycomb.tuning.audio.music.handoff.startLatencySeconds,
		seekLatencySeconds: honeycomb.tuning.audio.music.handoff.seekLatencySeconds,
	};
	honeycomb.music.playerMap[definition.index] = player;
	return player;
};

honeycomb.music.elementOf = function (player, slot) {
	if (player.elementArray[slot] == null) {
		var settings = honeycomb.tuning.audio.music;
		var element = honeycomb.music.createElement(settings.folder + player.definition.file + settings.extension);
		if (element == null) return null;
		element.volume = 0;
		//THE SAFETY NET. A changeover that never happened (a tab frozen for longer than the post-roll)
		//ends the file. The other element picks the lap up from where the ended one stopped, which is
		//the end of the post-roll. One audible join, instead of silence until the next scene change.
		element.onended = function () { honeycomb.music.onElementEnded(player, slot); };
		player.elementArray[slot] = element;
	}
	return player.elementArray[slot];
};

honeycomb.music.onElementEnded = function (player, slot) {
	if (honeycomb.music.running != true || slot != player.live || player.targetGain <= 0) return;
	var settings = honeycomb.tuning.audio.music;
	var other = honeycomb.music.elementOf(player, 1 - slot);
	if (other == null) return;
	player.handoff = null;
	player.live = 1 - slot;
	//Where it cannot seek it starts from the top instead: the lap restarts six seconds early, once
	if (honeycomb.music.canSeek(other) == true) other.currentTime = settings.postRollSeconds;
	honeycomb.music.play(other);
	honeycomb.music.wake();
};

//play(), with the two ways it can fail both swallowed: a browser still waiting for a user gesture
//rejects the promise, which is remembered so nudge() can try again.
honeycomb.music.play = function (element) {
	try {
		var started = element.play();
		if (started != null && typeof started.catch === "function") {
			started.catch(function (playError) {
				if (playError != null && playError.name == "NotAllowedError") honeycomb.music.blocked = true;
			});
		}
	} catch (playError) {
		honeycomb.music.blocked = true;
	}
};

//---------------------------------------------------------------------------------------------------
//The tick
//---------------------------------------------------------------------------------------------------
//Starts the tick if it is not already pending. The tick stops itself when nothing is moving or
//sounding, so a silenced game schedules nothing.
honeycomb.music.wake = function () {
	if (honeycomb.music.tickHandle != null || honeycomb.music.running != true) return;
	honeycomb.music.lastTickAt = honeycomb.music.now();
	honeycomb.music.tickHandle = setTimeout(honeycomb.music.onTimer, honeycomb.tuning.audio.music.tickMs);
};

honeycomb.music.onTimer = function () {
	honeycomb.music.tickHandle = null;
	if (honeycomb.music.tick() == true) {
		honeycomb.music.tickHandle = setTimeout(honeycomb.music.onTimer, honeycomb.tuning.audio.music.tickMs);
	}
};

//One step of every player. Returns whether another step is needed.
honeycomb.music.tick = function () {
	if (honeycomb.music.running != true) return false;
	var now = honeycomb.music.now();
	var elapsedMs = honeycomb.music.lastTickAt == null ? 0 : Math.max(0, now - honeycomb.music.lastTickAt);
	honeycomb.music.lastTickAt = now;

	var settings = honeycomb.tuning.audio.music;
	var enabled = honeycomb.platform.musicEnabled() == true;
	var master = Math.max(0, Math.min(1, honeycomb.platform.musicVolume() * settings.volume));
	var busy = false;

	for (var trackIndex in honeycomb.music.playerMap) {
		var player = honeycomb.music.playerMap[trackIndex];
		var wanted = enabled == true && trackIndex == honeycomb.music.currentTrack ? player.targetGain : 0;
		var fadeMs = enabled == true ? player.fadeMs : settings.disabledFadeMs;
		if (wanted > 0 && now < player.startAt) { busy = true; continue; }
		if (wanted > 0 && honeycomb.music.blocked == true) continue;

		var live = honeycomb.music.elementOf(player, player.live);
		if (live == null) continue;

		if (wanted > 0 && live.paused == true) honeycomb.music.play(live);

		var step = fadeMs <= 0 || honeycomb.music.volumeControllable != true ? 1 : elapsedMs / fadeMs;
		if (player.gain < wanted) player.gain = Math.min(wanted, player.gain + step);
		if (player.gain > wanted) player.gain = Math.max(wanted, player.gain - step);

		if (player.gain <= 0 && wanted <= 0) {
			//Written before the pause, so a track that returns starts from silence, not from the last
			//step of its fade
			honeycomb.music.applyVolume(player, master);
			honeycomb.music.rest(player);
			continue;
		}

		honeycomb.music.stepHandoff(player, elapsedMs);
		honeycomb.music.applyVolume(player, master);
		busy = true;
	}
	return busy;
};

//A track that has faded all the way out is paused. A track marked `resume` keeps its place, so a
//thirty-second walk across the map does not hear the same opening bars after every fight; any other
//goes back to the top. A changeover caught half done is abandoned -- the live element is still inside
//its post-roll and simply starts the changeover again when the track returns.
honeycomb.music.rest = function (player) {
	var live = player.elementArray[player.live];
	var idle = player.elementArray[1 - player.live];
	if (idle != null && idle.paused != true) idle.pause();
	if (idle != null && player.handoff != null) idle.currentTime = 0;
	player.handoff = null;
	if (live == null || live.paused == true) return;
	live.pause();
	if (player.definition.resume != true) live.currentTime = 0;
};

//Writes the track's level onto its elements. During a changeover the two share it, and because both
//carry the same audio the shares are linear: they sum to the same level the whole way across.
honeycomb.music.applyVolume = function (player, master) {
	var live = player.elementArray[player.live];
	var idle = player.elementArray[1 - player.live];
	var across = player.handoff != null && player.handoff.stage == "fading" ? player.handoff.progress : 0;
	if (honeycomb.music.volumeControllable != true) {
		//No volume to write, so the cut is made with `muted`, at the midpoint
		if (live != null) live.muted = across >= honeycomb.tuning.audio.music.handoff.cutPoint;
		if (idle != null) idle.muted = across < honeycomb.tuning.audio.music.handoff.cutPoint;
		return;
	}
	if (live != null) live.volume = master * player.gain * (1 - across);
	if (idle != null) idle.volume = master * player.gain * across;
};

//---------------------------------------------------------------------------------------------------
//The changeover
//---------------------------------------------------------------------------------------------------
//`position` below is always how far the live element is past the end of the lap, which is also where
//in the file the incoming element has to be for the two to be playing the same audio.
honeycomb.music.stepHandoff = function (player, elapsedMs) {
	var settings = honeycomb.tuning.audio.music;
	var rules = settings.handoff;
	var live = player.elementArray[player.live];
	if (live == null || live.paused == true) return;
	var position = live.currentTime - player.definition.loopSeconds;

	if (player.handoff == null) {
		//Made early so the file is already buffered when it is needed
		if (position >= -rules.prepareSeconds) honeycomb.music.elementOf(player, 1 - player.live);
		//THE INCOMING ELEMENT IS STARTED FROM ZERO, WITH NO SEEK, timed so that its first sound lands
		//as the live one crosses the end of the lap. Not every source can seek: a server that does not
		//answer Range requests (python's http.server, which is what this project is developed on)
		//reports `seekable` as 0 to 0 and sends every seek back to the top. A start from zero works
		//everywhere. A tick is too coarse to time it, so the last stretch is a timer of its own.
		var lead = player.startLatencySeconds;
		var waitSeconds = -lead - position;
		if (waitSeconds > settings.tickMs / 1000) return;
		if (honeycomb.music.elementOf(player, 1 - player.live) == null) return;
		player.handoff = { stage: "starting", corrections: 0, progress: 0, aimedAt: 0 };
		var handoff = player.handoff;
		//Already late (a throttled tab): a timer would only be throttled too, so it starts here and now
		if (waitSeconds <= 0) { honeycomb.music.startIncoming(player, handoff); return; }
		honeycomb.music.schedule(function () { honeycomb.music.startIncoming(player, handoff); }, waitSeconds * 1000);
		return;
	}

	var other = player.elementArray[1 - player.live];
	if (player.handoff.stage == "starting") return;
	if (player.handoff.stage == "aligning") {
		//AN ELEMENT'S CLOCK MEANS NOTHING UNTIL IT IS RUNNING. After play() or a seek, currentTime sits on
		//the value it was given until sound is actually coming out, and reading it in that window measures
		//the aim rather than the result -- the suite's first version of this lined up "perfectly" against
		//an element that then started 24ms late. So the clock has to have run on by settleSeconds of
		//its OWN time before it is believed, which a once-a-second tick satisfies in one step.
		var settled = other.paused != true && other.seeking != true && other.currentTime - player.handoff.aimedAt >= rules.settleSeconds;
		var error = position - other.currentTime;
		var outOfRoom = settings.postRollSeconds - position <= rules.forceSeconds;
		if (settled != true && outOfRoom != true) return;
		//What is left over after an attempt IS the mistake in the latency that attempt assumed
		if (settled == true) {
			var learned = player.handoff.corrections == 0 ? "startLatencySeconds" : "seekLatencySeconds";
			player[learned] = Math.max(-rules.latencyLimitSeconds, Math.min(rules.latencyLimitSeconds, player[learned] + error * rules.latencyLearningRate));
		}
		if (Math.abs(error) > rules.toleranceSeconds && player.handoff.corrections < rules.correctionMaximum &&
			outOfRoom != true && honeycomb.music.canSeek(other) == true) {
			//Silent while this happens, so a corrective seek cannot be heard
			other.currentTime = other.currentTime + error + player.seekLatencySeconds;
			player.handoff.corrections += 1;
			player.handoff.aimedAt = other.currentTime;
			return;
		}
		player.handoff.stage = "fading";
		player.handoff.alignmentError = error;
		return;
	}

	player.handoff.progress = Math.min(1, player.handoff.progress + (rules.fadeMs <= 0 ? 1 : elapsedMs / rules.fadeMs));
	if (player.handoff.progress < 1) return;

	//Done: the incoming element IS the track now. The outgoing one is parked at the top for next lap.
	live.pause();
	live.currentTime = 0;
	player.live = 1 - player.live;
	player.lastAlignmentError = player.handoff.alignmentError;
	player.handoff = null;
};

//The moment the incoming element is set going. Run from its own timer, so the changeover it belongs
//to may have been abandoned in the meantime (the track was rested, or music ended): `handoff` is that
//changeover, and anything else in player.handoff means this start is no longer wanted.
honeycomb.music.startIncoming = function (player, handoff) {
	if (honeycomb.music.running != true || player.handoff !== handoff) return;
	var live = player.elementArray[player.live];
	var incoming = player.elementArray[1 - player.live];
	if (live == null || incoming == null) { player.handoff = null; return; }
	//A late start (a throttled tab's tick arrives up to a second after the lap ended) is aimed at where
	//the live element has got to, where the source allows it
	var position = live.currentTime - player.definition.loopSeconds;
	var aim = position + player.startLatencySeconds;
	if (aim > honeycomb.tuning.audio.music.handoff.toleranceSeconds && honeycomb.music.canSeek(incoming) == true) incoming.currentTime = aim;
	handoff.aimedAt = incoming.currentTime;
	handoff.stage = "aligning";
	honeycomb.music.play(incoming);
};

//Whether a seek on this element goes where it is sent. See stepHandoff.
honeycomb.music.canSeek = function (element) {
	var ranges = element.seekable;
	return ranges != null && ranges.length > 0 && ranges.end(ranges.length - 1) > 0;
};

//What the debug panel and the suite read: one row per track that exists.
honeycomb.music.report = function () {
	var rowArray = [];
	for (var trackIndex in honeycomb.music.playerMap) {
		var player = honeycomb.music.playerMap[trackIndex];
		var live = player.elementArray[player.live];
		rowArray.push({
			index: trackIndex,
			current: trackIndex == honeycomb.music.currentTrack,
			gain: player.gain,
			playing: live != null && live.paused != true,
			seconds: live == null ? 0 : live.currentTime,
			handoff: player.handoff == null ? null : player.handoff.stage,
			lastAlignmentError: player.lastAlignmentError == null ? null : player.lastAlignmentError,
		});
	}
	return rowArray;
};
