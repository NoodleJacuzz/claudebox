var playlist = [];
var currentSound = "";
var currentAudio;
var timeoutID;
var nextSong = "";
var songList = [
    {
        "index": "am-0",
        "length": 419
    },
    {
        "index": "am-1-10",
        "length": 419
    },
    {
        "index": "am-1-40",
        "length": 436
    },
    {
        "index": "am-1",
        "length": 409
    },
    {
        "index": "am-10-10",
        "length": 420
    },
    {
        "index": "am-10",
        "length": 360
    },
    {
        "index": "am-11-10",
        "length": 451
    },
    {
        "index": "am-11",
        "length": 344
    },
    {
        "index": "am-2-10",
        "length": 410
    },
    {
        "index": "am-2-20",
        "length": 497
    },
    {
        "index": "am-2-40",
        "length": 410
    },
    {
        "index": "am-2",
        "length": 374
    },
    {
        "index": "am-3-10",
        "length": 384
    },
    {
        "index": "am-3",
        "length": 60
    },
    {
        "index": "am-4-10",
        "length": 413
    },
    {
        "index": "am-4-40",
        "length": 491
    },
    {
        "index": "am-4",
        "length": 392
    },
    {
        "index": "am-5-10",
        "length": 297
    },
    {
        "index": "am-5-40",
        "length": 288
    },
    {
        "index": "am-5",
        "length": 324
    },
    {
        "index": "am-6-10",
        "length": 533
    },
    {
        "index": "am-6",
        "length": 361
    },
    {
        "index": "am-7-10",
        "length": 432
    },
    {
        "index": "am-7",
        "length": 378
    },
    {
        "index": "am-8-10",
        "length": 367
    },
    {
        "index": "am-8",
        "length": 320
    },
    {
        "index": "am-9-10",
        "length": 336
    },
    {
        "index": "am-9",
        "length": 277
    },
    /*{
        "index": "minorArt",
        "length": 107
    },*/
    {
        "index": "minorBath",
        "length": 150
    },
    {
        "index": "minorBlossom",
        "length": 370
    },
    {
        "index": "minorRain",
        "length": 124
    },
    {
        "index": "minorStar",
        "length": 375
    },
    {
        "index": "pm-0-10",
        "length": 562
    },
    {
        "index": "pm-0",
        "length": 351
    },
    {
        "index": "pm-1-10",
        "length": 576
    },
    {
        "index": "pm-1",
        "length": 438
    },
    {
        "index": "pm-10-30",
        "length": 429
    },
    {
        "index": "pm-10",
        "length": 336
    },
    {
        "index": "pm-11-30",
        "length": 374
    },
    {
        "index": "pm-11",
        "length": 302
    },
    {
        "index": "pm-2-10",
        "length": 407
    },
    {
        "index": "pm-2",
        "length": 141
    },
    {
        "index": "pm-3",
        "length": 382
    },
    {
        "index": "pm-4",
        "length": 362
    },
    {
        "index": "pm-5",
        "length": 409
    },
    {
        "index": "pm-6-30",
        "length": 420
    },
    {
        "index": "pm-6",
        "length": 432
    },
    {
        "index": "pm-7",
        "length": 470
    },
    {
        "index": "pm-8-30",
        "length": 448
    },
    {
        "index": "pm-8",
        "length": 384
    },
    {
        "index": "pm-9-30",
        "length": 429
    },
    {
        "index": "pm-9",
        "length": 158
    },
    {
        "index": "seasonAutumn",
        "length": 90
    },
    {
        "index": "seasonSpring",
        "length": 145
    },
    /*{
        "index": "seasonSummer",
        "length": 106
    }, //Disabled temporarily because too loud
    */
    {
        "index": "seasonWinter",
        "length": 104
    },/*
    {
        "index": "majorBeach",
        "length": 130
    },
    {
        "index": "majorCrimbus",
        "length": 73
    },
    {
        "index": "majorHalloween",
        "length": 82
    },
    {
        "index": "majorValentine",
        "length": 202
    },*/
]
var musicDisabled = false;
var soundDisabled = false;

function omniToggle() {
	if (musicDisabled != true) {
		document.getElementById('titleSound').src = cleanupImage("system/ui/buttonHush");
		musicDisabled = true
		soundDisabled = true
		pauseAll();
	}
	else {
		document.getElementById('titleSound').src = cleanupImage("system/ui/buttonSound");
		musicDisabled = false
		soundDisabled = false
		unpauseAll();
	}
}

function musicToggle() {
	if (musicDisabled == true) {
		document.getElementById('musicButton').src = cleanupImage("system/ui/buttonSound");
		musicDisabled = false
		unpauseAll();
	}
	else {
		document.getElementById('musicButton').src = cleanupImage("system/ui/buttonHush");
		musicDisabled = true
		pauseAll();
	}
}

function soundToggle() {
	if (soundDisabled == true) {
		document.getElementById('soundButton').src = cleanupImage("system/ui/buttonSound");
		soundDisabled = false
	}
	else {
		document.getElementById('soundButton').src = cleanupImage("system/ui/buttonHush");
		soundDisabled = true
	}
	soundEffectStart("button");
}

//Music
function startMusic() {
	if (data.player.musicBlacklist == null) {
		data.player.musicBlacklist = [];
	}
	if (songList.length > data.player.musicBlacklist.length) {
		if (nextSong == "") {
			nextSong = songList[getRandomInt(songList.length)].index;
		}
		var songBlacklistCheck = data.player.musicBlacklist.find(entry => entry === nextSong);
		if (songBlacklistCheck) {
			console.log("Blacklisted Song detected!")
			nextSong = songList[getRandomInt(songList.length)].index;
			startMusic();
		}
		else {
			crossfade(nextSong)
		}
	}
	else {
		if (document.getElementById('currentSong')) {
			document.getElementById('currentSong').innerHTML = "Current Song: None (No songs remaining)"
		}
		nextSong = "";
	}
}

//Function to crossfade between two audio elements
function crossfade(newSrc) {
	// Clear any previously scheduled startMusic so it doesn't interrupt the new song.
	if (timeoutID) {
		clearTimeout(timeoutID);
		timeoutID = null;
	}
    if (musicDisabled != true) {
        const newSong = new Audio();
        newSong.src = "sound/audiostock/" + newSrc + ".mp3";
        newSong.id = newSrc;
		newSong.onerror = function(e) {
			console.error("Audio error loading", newSrc, e);
			//timeoutID = setTimeout(startMusic, 2000);
		};
        newSong.volume = 0;
        newSong.loop = true;
        playlist.push(newSong);
        playlist[playlist.length - 1].play();

        if (playlist.length > 0) {
            fadeOut();
        }
        fadeIn();
    }

    nextSong = songList[getRandomInt(songList.length)].index;
    var currentSong = songList.find((item) => item.index === newSrc);
    console.log("Music is playing! It should last for " + currentSong.length * 1000);

    // No timer while music is off: nothing is playing, and unpauseAll starts the timer when it comes back on
    if (musicDisabled != true) {
        timeoutID = setTimeout(startMusic, currentSong.length * 1000);
    }
    currentAudio = playlist[playlist.length - 1];

	if (document.getElementById('currentSong')) {
		document.getElementById('currentSong').innerHTML = "Current Song: "+playlist[playlist.length-1].id
	}
}

// Function to pause both the audio and the timeout
function pauseAll() {
    if (currentAudio) {
        currentAudio.pause();
    }
	if (timeoutID) {
		clearTimeout(timeoutID);
	}
}

// Function to unpause the audio and restart the timeout
function unpauseAll() {
	if (currentAudio == null) return;
	currentAudio.play();
	fadeIn()
	scheduleNextSong(currentAudio);
}

//Starts the next-song timer from what is left of this song. Any timer already running is cleared first,
//since a second timer skips the song early. A song still loading has no length yet (NaN, which setTimeout
//treats as 0), so it waits for the length to arrive.
function scheduleNextSong(song) {
	if (timeoutID) {
		clearTimeout(timeoutID);
		timeoutID = null;
	}
	if (Number.isFinite(song.duration) == false) {
		song.addEventListener("loadedmetadata", function () {
			if (song == currentAudio && musicDisabled != true) scheduleNextSong(song);
		}, { once: true });
		return;
	}
	timeoutID = setTimeout(startMusic, Math.max(1, song.duration - song.currentTime) * 1000);
}

// Function to fade out the audio
function fadeOut() {
	var moreFade = false;
	for (i = 0; i < playlist.length-1; i++) {
		if (playlist[i].paused == false) {
			if (playlist[i].volume > 0.02) {
				//console.log("Now fading out "+playlist[i].id+", current volume is "+playlist[i].volume);
				playlist[i].volume -= .01;
				moreFade = true;
			}
			else {
				playlist[i].pause();
			}
		}
	}
	if (moreFade == true) {
		setTimeout(fadeOut, 20);
	}
	else {
		releaseOldSongs();
	}
}

//Drops every faded-out song but the current one. Removing the source is what lets the browser free the
//downloaded file; kept in the playlist, every song played stayed in memory for the whole session.
function releaseOldSongs() {
	while (playlist.length > 1 && playlist[0].paused == true) {
		var oldSong = playlist.shift();
		oldSong.onerror = null;
		oldSong.removeAttribute("src");
		oldSong.load();
	}
}

// Function to fade in the audio
function fadeIn() {
	if (data.player.musicVolume) {
		var musicVolumeCap = data.player.musicVolume;
		musicVolumeCap = musicVolumeCap/100;
	}
	else {
		data.player.musicVolume = 80;
		var musicVolumeCap = 80;
		musicVolumeCap = musicVolumeCap/100;
	}

	if (playlist[playlist.length-1]) {
		if (playlist[playlist.length-1].paused == true) {
			omniToggle();
		}
		else {
			var moreFadeIn = false;
			if (playlist[playlist.length-1].volume < musicVolumeCap) {
				//console.log("Now fading in "+playlist[playlist.length-1].id+", current volume is "+playlist[playlist.length-1].volume);
				playlist[playlist.length-1].volume += .02;
				moreFadeIn = true;
			}
			else {
				playlist[playlist.length-1].volume = musicVolumeCap;
			}
			if (moreFadeIn == true) {
				setTimeout(fadeIn, 20);
			}
		}
	}
}

function volumeAdjust(target, volume) {
	//Function for manually setting volume instead of nudging it up or down
	switch (target) {
		case "music": {
			data.player.musicVolume = volume
			playlist[playlist.length-1].volume = volume/100
			break;
		}
		case "sound": {
			data.player.soundVolume = volume
			soundEffectStart("button");
			break;
		}
	}
}

function volume(target, direction) {
	switch (target) {
		case "music": {
			switch (direction) {
				case "up":
					if (data.player.musicVolume <90) {
						data.player.musicVolume += 10;
						playlist[playlist.length-1].volume += 0.1;
					}
					else {
						data.player.musicVolume = 100;
						playlist[playlist.length-1].volume = 1;
					}
				break;
				case "down":
					if (data.player.musicVolume >0.00001) {
						data.player.musicVolume -= 10;
						playlist[playlist.length-1].volume -= 0.1;
					}
					else {
						data.player.musicVolume = 0;
						playlist[playlist.length-1].volume = 0;
					}
				break;
			}
			soundEffectStart("button");
			break;
		}
		case "sound": {
			switch (direction) {
				case "up":
					if (data.player.soundVolume <90) {
						data.player.soundVolume += 10;
					}
					else {
						data.player.soundVolume = 100;
					}
				break;
				case "down":
					if (data.player.soundVolume >0.00001) {
						data.player.soundVolume -= 10;
					}
					else {
						data.player.soundVolume = 0;
					}
				break;
			}
			soundEffectStart("button");
			break;
		}
	}
}

function songBlacklist() {
	if (data.player.musicBlacklist.length < songList.length) {
		if (data.player.musicBlacklist) {
			data.player.musicBlacklist.push(playlist[playlist.length-1].id)
		}
		else {
			data.player.musicBlacklist = [];
			data.player.musicBlacklist.push(playlist[playlist.length-1].id)
		}
		console.log(data.player.musicBlacklist)
		startMusic();
	}
	else {
		playlist[playlist.length-1].pause();
	}
}

function songBlacklistClear() {
	data.player.musicBlacklist = [];
	startMusic();
}

function soundEffectStart(n) {
	if (soundDisabled == false) {
		/*
		switch (currentSound) {
			case "move": //Prioritize move over talk
				if (n != "talk") {
					currentSound = n;
				}
			break;
			case "pickup": //Prioritize pickup over move
				if (n != "move") {
					currentSound = n;
				}
			break;
			default:
		}
		*/
		currentSound = n;
		setTimeout(soundEffectPlay, 50)
	}
}
function soundEffectPlay() {
	if (currentSound != "") {
		if (data.player.soundVolume != null) {
			var volumeCap = data.player.soundVolume;
			volumeCap = volumeCap/100;
		}
		else {
			data.player.soundVolume = 70;
			var volumeCap = 70;
			volumeCap = volumeCap/100;
		}
		if (currentSound == "move") {
			volumeCap = volumeCap/2;
		}
		var popSound = new Audio('sound/sfx/'+currentSound+'.mp3');
		popSound.volume = volumeCap;
		popSound.play();
		currentSound = "";
	}
}
var volumeCap = data.player.soundVolume;
var trainSFX = new Audio('sound/sfx/background-train.mp3');
function trainEffectPlay() {
	if (soundDisabled == false) {
		if (data.player.soundVolume != null) {
			var volumeCap = data.player.soundVolume;
			volumeCap = volumeCap/100;
		}
		else {
			data.player.soundVolume = 70;
			var volumeCap = 70;
			volumeCap = volumeCap/100;
		}
		trainSFX.volume = volumeCap/2;
		trainSFX.play();
		currentSound = "";
	}
}

function trainEffectStop() {
	if (soundDisabled == false) {
		trainSFX.pause();
	}
}