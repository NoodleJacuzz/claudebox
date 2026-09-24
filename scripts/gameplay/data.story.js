var coreCharactersArray = [
	//Specify core details like color and outfit. This data will only be used the first time a character is loaded. Default outfits and emotions are taken from the outfits and emotions set here.
	{index: "mayor", flags: "", fName: "Angelica", lName: "", color: "#F5152E", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: ""},
	{index: "shopkeep", flags: "", fName: "Bluebell", lName: "", color: "#89A2F9", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: ""},
	{index: "carpenter", flags: "", fName: "Cayenne", lName: "", color: "#AA805D", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: ""},
	{index: "foxf", flags: "", fName: "Garnet", lName: "", color: "#C44CB2", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "female"},
	{index: "foxm", flags: "", fName: "Jasper", lName: "", color: "#C44CB2", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"},
	{index: "wolf", flags: "", fName: "Sorbet", lName: "", color: "#FCB7F5", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "female"},
	{index: "sadogato", flags: "", fName: "Sharly", lName: "", color: "#65363D", outfit: "nude", emotion: "frown", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "female"},
	{index: "milf", flags: "", fName: "Mary-Lou", lName: "", color: "#F4E2C8", outfit: "nude", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "female"},
	{index: "nun", flags: "", fName: "Khanna", lName: "", color: "#FF902D", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "female"},
	{index: "mesu", flags: "", fName: "Marlow", lName: "", color: "#C4B6BF", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"},
	{index: "fashionista", flags: "", fName: "Riley", lName: "", color: "#E980A5", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"},
	{index: "hyena", flags: "", fName: "Helena", lName: "", color: "#DEB165", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"},
	{index: "doe", flags: "", fName: "Nutmeg", lName: "", color: "#F2BA80", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"},
	{index: "mommy", flags: "", fName: "Cinnamon", lName: "", color: "#A45E39", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "female"},
	//Deity's day-to-day form is the feral one, so that folder holds his full expression set. The
	//nude folder is his anthro form and only carries a base and a happy for the logbook pairing.
	{index: "deity", flags: "", fName: "Deity", lName: "", color: "#58504D", outfit: "feral", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"},
	//Thorne emotes through the four spirits registered in spiritArray rather than through his own
	//face, so "clothed" holds one body image and one overlay per spirit instead of an expression set.
	{index: "trap", flags: "", fName: "Thorne", lName: "", color: "#7D9267", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"},
	{index: "tink", flags: "", fName: "Tink", lName: "", color: "#D6949F", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "EvilCrucifix", gender: "female"},
	//index: "purple", flags: "", fName: "Oliver", lName: "", color: "#74629D", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"},
	//index: "rabbit", flags: "", fName: "Alex", lName: "", color: "#D9C2C7", outfit: "nude", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"},
];

function basicDefinitions() {
	var quickVar = "";
	writeHTML(`define player = sp player;`);
	//writeHTML(`define fash = sp fashionista;`);
	//writeHTML(`define shop = sp shopkeep;`);
	//writeHTML(`define sado = sp sadogato;`);
	for (defIndex = 0; defIndex < data.story.length; defIndex++) {
		writeHTML(`define `+data.story[defIndex].index+` = sp `+data.story[defIndex].index+`;`);
	}
}

var loadedCharacters = [];
function loadCoreCharacters() {
	for (coreIndex = 0; coreIndex < coreCharactersArray.length; coreIndex++) {
		var characterPresent = false;
		for (presentIndex = 0; presentIndex < data.story.length; presentIndex++) {
			if (coreCharactersArray[coreIndex].index == data.story[presentIndex].index) {
				characterPresent = true;
			}
		}
		if (characterPresent == false) {
			console.log(coreCharactersArray[coreIndex].index + " not detected in save data. Updating.");
			coreCharactersArray[coreIndex].outfitDefault = coreCharactersArray[coreIndex].outfit;
			coreCharactersArray[coreIndex].emotionDefault = coreCharactersArray[coreIndex].emotion;
			data.story.push(coreCharactersArray[coreIndex]);
		}
	}
	//Deity shipped for several versions defaulting to "nude", a folder that only ever held a base
	//and a single happy — every save made in that window has the wrong default baked in, and
	//coreCharactersArray is only consulted the first time a character appears. Correct it here.
	//Guarded on the stale value so a future anthro-form scene that sets his outfit on purpose
	//survives; he has no shipped content that could have set it to anything else yet.
	var deityInStory = data.story.find(character => character.index == "deity");
	if (deityInStory) {
		if (deityInStory.outfitDefault == "nude" || deityInStory.outfitDefault == null) {
			deityInStory.outfitDefault = "feral";
		}
		if (deityInStory.outfit == "nude" || deityInStory.outfit == null) {
			deityInStory.outfit = "feral";
		}
	}
	for (coreIndex = 0; coreIndex < coreCharactersArray.length; coreIndex++) {
		var loadCharacter = true;
		if (coreCharactersArray[coreIndex].index == "doe" || coreCharactersArray[coreIndex].index == "mommy") {
			loadCharacter = false;
		}
		for (loadedCharactersIndex = 0; loadedCharactersIndex < loadedCharacters.length; loadedCharactersIndex++) {
			if (coreCharactersArray[coreIndex].index == loadedCharacters[loadedCharactersIndex]) {
				loadCharacter = false;
			}
		}
		if (loadCharacter == true) {
			console.log("Now attempting to load the js file associated with "+coreCharactersArray[coreIndex].index);
			requestType = "load";
			loadCharacterScript(coreCharactersArray[coreIndex], false);
		}
	}
}

//Character files are requested with ?v= and a number that changes every hour, like Honeycomb's files.
//Neocities sends no Cache-Control header, so without it a browser can keep an old or failed copy for
//days. A failed load is tried once more with a number of its own, then reported to the player.
//No ?v= from file://.
function loadCharacterScript(character, isRetry) {
	var filename = "scripts/characters/"+character.index+".js";
	if (location.protocol !== "file:") {
		filename += "?v=" + (isRetry == true ? Date.now() : Math.floor(Date.now() / 3600000));
	}
	var fileref = document.createElement('script');
	fileref.setAttribute("src", filename);
	fileref.onerror = function() {
		if (isRetry != true) {
			console.warn(character.index+".js failed to load, trying once more");
			loadCharacterScript(character, true);
			return;
		}
		console.error(character.index+".js failed to load twice; "+character.fName+" is missing this session");
		alert(character.fName+"'s story file (scripts/characters/"+character.index+".js) didn't load, so "+character.fName+" won't appear this session.\n\nRefresh the page to try again. If this keeps happening, please let Noodle know.");
	}
	//Appended to start the load, then removed; the script still runs once it arrives
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(fileref);
	head.removeChild(fileref);
}

function modCharacter() {
	//Load characters with data on the screen, for loading from the game console
	var name = document.getElementById('indexSubmission').value;
	name = name.toLowerCase();
	console.log("Loading character " + name);
	for (loadIndex = 0; loadIndex < data.story.length; loadIndex++) {
		if (data.story[loadIndex].index == name) {
			writeText(name+' found already in the data variable, aborting function');
			name = 'failed';
		}
	}
	if (name != 'failed') {
		requestType = "load";
		var filename = "images/"+name+".js";
		var fileref=document.createElement('script');
		fileref.setAttribute("src", filename);
		
		fileref.onload = function() {
			document.getElementById('output').innerHTML = '';
			writeText("Successfully loaded file "+name+".js to the game");
			document.getElementById('output').innerHTML += `
				<img class="bigPicture" src="images/`+name+`/profile.jpg"
				onerror="writeText('Failed to write this character's profile image! Does the file images/`+name+`/profile.jpg actually exist?')">
				<br>
			`;
			if (data.player.location == "") {
				writeFunction("writeEncounter('system', 'start')", "Back to the start menu");
			}
			else {
				writeFunction("writeScene('system', 'gameConsole')", "Back to the console");
			}
		}
		
		fileref.onerror = function() {
			writeText("Error! Script load failure, tried to add "+name+" to the game, but something went wrong! Is the .js file you are trying to load present in the character's folder in the images folder? Did you misspell the index?");
			if (data.player.location == "") {
				writeFunction("writeEncounter('system', 'start')", "Back to the start menu");
			}
			else {
				writeFunction("writeScene('system', 'gameConsole')", "Back to the console");
			}
		}
		
		//Append new script file
		document.getElementsByTagName("head")[0].appendChild(fileref);
		
		//Delete script file afterwards
		var select = document.getElementsByTagName("head")[0];
		select.removeChild(select.lastChild);
	}
}

//Character modification functions
function raiseTrust(name, n) {
	for (shortcutIndex = 0; shortcutIndex < characterShortcuts.length; shortcutIndex++) {
		if (characterShortcuts[shortcutIndex].index == name) {
			name = characterShortcuts[shortcutIndex].full;
		}
	}
	for (trustIndex = 0; trustIndex < data.story.length; trustIndex++) {
		if (data.story[trustIndex].index == name && checkFlag('player', 'gallery') != true) {
			console.log('raising the trust of '+name+' by '+n);
			data.story[trustIndex].trust += n;
		}
	}
}

function setTrust(name, n) {
	for (shortcutIndex = 0; shortcutIndex < characterShortcuts.length; shortcutIndex++) {
		if (characterShortcuts[shortcutIndex].index == name) {
			name = characterShortcuts[shortcutIndex].full;
		}
	}
	for (trustIndex = 0; trustIndex < data.story.length; trustIndex++) {
		if (data.story[trustIndex].index == name && checkFlag('player', 'gallery') != true) {
			console.log('setting the trust of '+name+' to '+n);
			data.story[trustIndex].trust = n;
		}
	}
}

function checkTrust(name) {
	for (shortcutIndex = 0; shortcutIndex < characterShortcuts.length; shortcutIndex++) {
		if (characterShortcuts[shortcutIndex].index == name) {
			name = characterShortcuts[shortcutIndex].full;
		}
	}
	for (y = 0; y < data.story.length; y++) {
		if (data.story[y].index == name) {
			return data.story[y].trust;
		}
	}
	return 0;
}

function resetProgress(name) {
	for (trustIndex = 0; trustIndex < data.story.length; trustIndex++) {
		if (data.story[trustIndex].index == name) {
			alert("Progress with "+data.story[trustIndex].fName+" has been reset. Hopefully this doesn't cause any issues!");
			console.log('setting the trust of '+name+' to 0');
			data.story[trustIndex].trust = 0;
			data.story[trustIndex].flags = "";
			data.story[trustIndex].textHistory = "";
			data.story[trustIndex].encountered = false;
			data.story[trustIndex].textEvent = "";
		}
	}
}

function addFlag(character, flag) {
	for (let shortcutIndex = 0; shortcutIndex < characterShortcuts.length; shortcutIndex++) {
		if (characterShortcuts[shortcutIndex].index == character) {
			character = characterShortcuts[shortcutIndex].full;
		}
	}
	if (character == "player") {
		if (!data.player.flags) {
			data.player.flags = "";
		}
		//checkFlag sees through superflags, so a flag already covered by a super isn't re-added
		if (checkFlag("player", flag) == false) {
			data.player.flags += flag+","
		}
	}
	else {
		console.log(character+flag);
		for (let flagIndex = 0; flagIndex < data.story.length; flagIndex++) {
			if (data.story[flagIndex].index == character && checkFlag('player', 'gallery') != true) {
				if (data.story[flagIndex].flags == false) {
					data.story[flagIndex].flags = "";
				}
				if (checkFlag(character, flag) == true) {
					console.log('Flag rejected, '+flag+' already present for '+character);
				}
				else {
					console.log('adding the flag named '+flag+' to '+character);
					data.story[flagIndex].flags += flag+",";
				}
			}
		}
	}
}

function removeFlag(character, flag) {
	for (let shortcutIndex = 0; shortcutIndex < characterShortcuts.length; shortcutIndex++) {
		if (characterShortcuts[shortcutIndex].index == character) {
			character = characterShortcuts[shortcutIndex].full;
		}
	}
	if (character == "player") {
		if (!data.player.flags) {
			data.player.flags = "";
		}
		//Whole-token removal; a substring replace could chop the tail off a longer flag name
		var flagTokens = data.player.flags.split(",").map(s => s.trim()).filter(Boolean).filter(t => t != flag);
		data.player.flags = flagTokens.length ? flagTokens.join(",") + "," : "";
	}
	else {
		for (let flagIndex = 0; flagIndex < data.story.length; flagIndex++) {
			if (data.story[flagIndex].index == character && checkFlag('player', 'gallery') != true) {
				if (data.story[flagIndex].flags == false) {
					data.story[flagIndex].flags = "";
				}
				if (data.story[flagIndex].flags.includes(flag) == true) {
					console.log('Removing flag '+flag+' from '+character);
					data.story[flagIndex].flags = data.story[flagIndex].flags.replace(flag+",", "");
				}
				else {
					console.log('error! flag '+flag+' not found!');
				}
			}
		}
	}
}

function checkFlag(character, flag) {
	for (let shortcutIndex = 0; shortcutIndex < characterShortcuts.length; shortcutIndex++) {
		if (characterShortcuts[shortcutIndex].index == character) {
			character = characterShortcuts[shortcutIndex].full;
		}
	}
	if (character == "player") {
		//Exact-match against the recursively expanded flag list (defined in index.js),
		//so flags condensed into superflags, or supers of superflags, still count
		return expandedPlayerFlags().has(flag);
	}
	else {
		for (let flagIndex = 0; flagIndex < data.story.length; flagIndex++) {
			if (data.story[flagIndex].index == character) {
				if (data.story[flagIndex].flags == false || data.story[flagIndex].flags == true) {
					data.story[flagIndex].flags = "";
				}
				if (data.story[flagIndex].flags.includes(flag) == true) {
					return true;
				}
				else {
					return false;
				}
			}
		}
	}
	return false;
}

function encounteredCheck(name) {
	for (e = 0; e < data.story.length; e++) {
		if (data.story[e].index == name) {
			if (data.story[e].encountered == true) {
				if (data.story[e].index == "mayor" || data.story[e].index == "shopkeep" || data.story[e].index == "carpenter") {
					return false;
				}
				else {
					return true;
				}
				break;
			}
			else {
				return false;
			}
		}
	}
}

function encounteredCheckReal(name) {
	for (e = 0; e < data.story.length; e++) {
		if (data.story[e].index == name) {
			if (data.story[e].encountered == true) {
				return true;
			}
			else {
				return false;
			}
		}
	}
}

function unencounter(name) {
	for (e = 0; e < data.story.length; e++) {
		if (data.story[e].index == name) {
			if (data.story[e].encountered == true) {
				data.story[e].encountered = false
				break;
			}
		}
	}
}

function changeEmotion(name, emotion) {
	for (shortcutIndex = 0; shortcutIndex < characterShortcuts.length; shortcutIndex++) {
		if (characterShortcuts[shortcutIndex].index == name) {
			name = characterShortcuts[shortcutIndex].full;
		}
	}
	if (name == "player") {
		data.player.emotion = emotion;
	}
	else {
		var characterInStory = data.story.find(character => character.index === name);
		if (characterInStory) {
			characterInStory.emotion = emotion;
		}
	}
}

function changeOutfit(characterTarget, outfit) {
	for (shortcutIndex = 0; shortcutIndex < characterShortcuts.length; shortcutIndex++) {
		if (characterShortcuts[shortcutIndex].index == name) {
			characterTarget = characterShortcuts[shortcutIndex].full;
		}
	}
	var characterInStory = data.story.find(character => character.index == characterTarget);
	if (characterInStory) {
		//If 'permanent' is present, replace the default outfit and remove the word, and either a preceeding space or a following space, so that it doesn't matter where permanent is written.
		if (outfit.includes("permanent")) {
			outfit = outfit.replace("permanent ", "")
			outfit = outfit.replace(" permanent", "")
			outfit = outfit.replace("permanent", "")
			characterInStory.outfitDefault = outfit;
		}
		characterInStory.outfit = outfit;
	}
}

function renameCharacter(nextScene) {
	for (i = 0; i < data.story.length; i++) {
		console.log(document.getElementById('nameSubmission-'+data.story[i].index));
		var nameSubmission = document.getElementById('nameSubmission-'+data.story[i].index);
		if (nameSubmission) {
			//console.info(nameSubmission);
			data.story[i].fName = nameSubmission.value;
			var character = data.story[i].index;
		}
	}
	var nameSubmission = document.getElementById('nameSubmission-player');
	if (nameSubmission) {
		data.player.name = nameSubmission.value;
		var character = "system";
	}
	if (character == null) {
		var character = "system";
	}
	writeScene(character, nextScene);
}

function renameNickname() {
	data.player.nickname = document.getElementById('nicknameSubmission').value;
	changeLocation(data.player.location);
}

function generateHouse(character) {
	console.info("Generating house for " + character);
	for (i = 0; i < data.story.length; i++) {
		data.story[i].emotion = data.story[i].emotionDefault;
		data.story[i].outfit = data.story[i].outfitDefault;
	}
	document.getElementById('output').innerHTML = '';
	wrapper.scrollTop = 0;
	for (shortcutIndex = 0; shortcutIndex < characterShortcuts.length; shortcutIndex++) {
		if (characterShortcuts[shortcutIndex].index == character) {
			character = characterShortcuts[shortcutIndex].full;
		}
	}
	switch (character) {
		case "fashionista": {
		if (data.player.fashQuoStage == null) {
			data.player.fashQuoStage = 0;
		}
		switch(data.player.fashQuoStage) {
			case 0:
				if (checkFlag('fashionista', 'teasingStarted') != true) {
					writeHTML(`
						im fash/tease5-1
						fash happy Ooh, look who's dropped by? Here for a quick bit of fun? Or am I the one being teased for a change? Pick quickly, I'm feeling a bit frisky today~
					`);
					addFlag('fashionista', 'teasingStarted');
				}
				else {
					writeHTML(`
						fash happy Ah, playerF~! I was just thinking about you!<br>I have some things to do for the store today, so if you want to play it's now or never~!
					`);
				}
				break;
			case 1:
				writeHTML(`
					outfit fash nude
					im fash/tease5-2
					fash happy Hmm~? Dropping by again? You left without playing last time, you know~? A wolf's heart is a delicate thing, you know~? I was thinking about doing some sunbathing today, unless you'd like to play around a bit~?<br>Or maybe you're just here to tease me~?
					player Hmm...
					fash If not, I'm headed out for a while. I'm a limited time deal, surely you aren't planning on leaving me all alone~?<br>So, what'll it be~?
				`);
				break;
			case 2:
				writeHTML(`
					outfit fash nude
					im fash/tease5-3
					fash happy Mmm, you keep dropping by, just to leave again all too soon~ I'm starting to think you're just here to tease me~
					player Maybe I am~!
					fash happy You're incorrigible~<br>Fine, fine, let's play the game. I wonder if I'll last any longer this time~?
				`);
				break;
			case 3:
				writeHTML(`
					outfit fash nude
					im fash/tease5-4
					fash excited Hah~! You're back again~!
					player Seems like you're breaking pretty quickly...
					fash M-me? No, never~! I c-can resist for just as long as you can! If you can hold back after getting a taste of my perfect ass, I can hold back from how much I want to throat that fat cock of yours too!
					player Hmm...
				`);
				var characterInStory = data.story.find(character => character.index === "fashionista");
				if (characterInStory) {
					characterInStory.emotion = "happy";
				}
				break;
			default: 
				writeHTML(`
					outfit fash nude
					fash excited ...
				`);
			}
			break;
		}
		case "doe": {
			if (galleryCheck("doe", "doeQuo1") != true) {
				writeScene("doe", "statusQuo1");
				writeHTML(`
					t ...
				`);
			}
			else if (galleryCheck("doe", "doeQuo2") != true) {
				writeScene("doe", "statusQuo2");
				writeHTML(`
					t ...
				`);
			}
			else {
				writeHTML(`
					im doe/statusQuo3-1
					doe joy *Hff* *Hff*...<br>playerF! Hi! Come in, come in!<br>I was just... Hoo... Playing with mom!
					t ...
				`);
			}
			break;
		}
		case "nun": {
			//The angel event plays in place of the church interior when the player arrives wearing
			//the full angel outfit obtained from the nunAngelOutfit pickup
			if (typeof nunAngelWorn === "function" && nunAngelWorn() == true
			&& checkFlag("nun", "angelScene") != true) {
				writeScene("nun", "angel");
				return;
			}
			break;
		}
		case "mommy": {
			if (galleryCheck("mommy", "mommyQuo1") != true) {
				writeScene("mommy", "statusQuo1");
				writeHTML(`
					t ...
				`);
			}
			else if (galleryCheck("mommy", "mommyQuo2") != true) {
				writeScene("mommy", "statusQuo2");
				writeHTML(`
					t ...
				`);
			}
			else {
				writeHTML(`
					mommy happy Hello?
					im mommy/statusQuo3-1
					mommy sparkle Oh, playerF!<br>I almost didn't see you down there, please, come in!<br>doeF is napping, so it'll be just you and me for right now.
					t ...
				`);
			}
			break;
		}
	}
	backgroundArray = [
		["wolf", "interiorWolf"],
		["sadogato", "interiorSadogato"],
		["milf", "interiorMilf"],
		["nun", "interiorNun"],
		["fashionista", "interiorPurple"],
		["mesu", "interiorMesu"],
		["hyena", "interiorHyena"],
		["doe", "interiorDoe"],
		["mommy", "interiorDoe"],
	]
	for (i = 0; i < backgroundArray.length; i++) {
		if (character == backgroundArray[i][0]) {
			var bg = cleanupImage("locations/"+backgroundArray[i][1]+"-"+data.player.time);
			if (character == "hyena") {
				bg = cleanupImage("locations/"+backgroundArray[i][1]);
			}
		}
	}
	if (data.player.time == "Morning" && bg.includes("-Morning")) {
		bg = bg.replace("-Morning", "");
	}
	document.getElementById('output').innerHTML += `
		<div class="playerRoom">
			<div class="backgroundBorder">
				<img class="backgroundPicture" src="`+bg+`" usemap="#roomMap">
			</div>
		</div>
	`;
	changeBG(bg);
	if (character == "fashionista") {
		if (data.player.fashQuoStage < 4) {
			printEncounterButton("fashionista", "statusQuoNo", "Go Back", 65, 15);
			addFlag(character, "House");
			pseudoLocation = data.player.location;
			data.player.location = "null";
			checkForPickups();
			data.player.location = pseudoLocation;
			removeFlag(character, "House");
		}
	}
	else {
		printLocationButton(
			"Go Back", 
			65, 
			15, 
			data.player.location, 
		);
		addFlag(character, "House");
		pseudoLocation = data.player.location;
		data.player.location = "null";
		checkForPickups();
		data.player.location = pseudoLocation;
		removeFlag(character, "House");
	}
	var position = "height: var(--ovl-h, 100%); bottom: -20%; left: var(--ovl-left, 55%); right: var(--ovl-enc-right, auto);";
	for (i = 0; i < data.story.length; i++) {
		if (data.story[i].index == character) {
			var characterTarget = data.story[i];
			unencounter(data.story[i].index);
		}
	}
	var charType = "old";
	for (neoCharIndex = 0; neoCharIndex < finishedCharactersArray.length; neoCharIndex++) {
		if (finishedCharactersArray[neoCharIndex] == character && character != "player") {
			charType = "new";
		}
	}
	if (charType == "old") {
		var image = cleanupImage(character+"/"+characterTarget.outfit+"/"+characterTarget.emotion);
		document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
			<img class = "overlay" 
			id = "houseImage"
			src = "`+image+`" 
			style="	
			`+position+`
			transform: scaleX(-1);"
			onclick='writeScene("`+character+`", "statusQuo")'>
		`;
	}
	else {
		position = position.replace("right: 0%", "right: 50%");
		document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
			<div id = "overlay" class = "overlay"  
			style="	
			`+position+`"
			onclick='writeScene("`+character+`", "statusQuo")'>
		`;
		document.getElementById('overlay').innerHTML += drawCharacter(character, "class:overlayImage;");
	}
	switch (character) {
		case "wolf": {
			var smallTalkEvents = [];
			for (smallTalkIndex = 0; smallTalkIndex < wolfSmallTalkArray.length; smallTalkIndex++) {
				for (playerOutfitIndex = 0; playerOutfitIndex < data.player.clothes.length; playerOutfitIndex++) {
					if (data.player.clothes[playerOutfitIndex].index == wolfSmallTalkArray[smallTalkIndex].requirements) {
						smallTalkEvents.push(wolfSmallTalkArray[smallTalkIndex].content);
					}
				}
				if (wolfSmallTalkArray[smallTalkIndex].requirements.includes("wolf")) {
					var outfitCheck = wolfSmallTalkArray[smallTalkIndex].requirements.replace("wolf ", "");
					for (characterOutfitIndex = 0; characterOutfitIndex < data.story.length; characterOutfitIndex++) {
						if (data.story[characterOutfitIndex].index == "wolf") {
							if (data.story[characterOutfitIndex].outfit.includes(outfitCheck)) {
								smallTalkEvents.push(wolfSmallTalkArray[smallTalkIndex].content);
							}
						}
					}
				}
			}
			var topless = isTopless(data.player.clothes);
			var bottomless = isBottomless(data.player.clothes);
			if (smallTalkEvents.length == 0) {
				smallTalkEvents.push(`
					wolf excited Ooh, darling...<br>I can't place exactly what it is, but something about your outfit today just...<br>Gets me in the mood~			
				`);
			}
			var dateNude = false;
			if (topless == true && bottomless == true) {
				smallTalkEvents = [];
				if (checkFlag('wolf', 'dateNude') != true) {
					addFlag('wolf', 'nudeReady');
					dateNude = true;
					smallTalkEvents.push(`
						wolf shock O-oh...
						wolf excited ...
					`);
				}
				else {
					smallTalkEvents.push(`
						wolf shock O-oh...
						wolf excited D-darling, you promised...
						player shock Oh geez, again? Sorry wolfF, here, why don't we play together to make up for this?
					`);
				}
			}
			console.log(smallTalkEvents[getRandomInt(smallTalkEvents.length)]);
			if (dateNude == true) {
			}
			else {
				writeHTML(`wolf happy Darling~! I'm so glad you came to visit me again! I've been thinking about you all day~`);
			}
			writeHTML(smallTalkEvents[getRandomInt(smallTalkEvents.length)]);
		}
		break;
		case "sadogato": {
			var smallTalkEvents = [];
			var tarotCollected = 0;
			if (checkFlag("sado", "patIntro") == true && checkFlag("sado", "pat1") != true) {
				writeScene("sadogato", "sadoPat1");
			}
			else {
				for (smallTalkIndex = 0; smallTalkIndex < sadoSmallTalkArray.length; smallTalkIndex++) {
					if (checkItem(sadoSmallTalkArray[smallTalkIndex].index) == true || checkItem(sadoSmallTalkArray[smallTalkIndex].index+"Meat") == true) {
						var sadoTarotName = sadoSmallTalkArray[smallTalkIndex].index.replace("Meat", "");
						if (checkFlag("sadogato", sadoTarotName) == false) {
							smallTalkEvents.push(sadoSmallTalkArray[smallTalkIndex]);
						}
						else {
							tarotCollected++;
						}
					}
				}
				if (smallTalkEvents.length < 3) {
					writeHTML(`
						sado Ah, back already? Tell me, are your compulsions as overwhelming as mine? <br>What are you feeling right now?
						player excited Like I really wanna touch your tail...
						sado frown to be clear, no matter how horny I get, the tail is not to be treated as a sex organ. You understand that, yes?
						player ...
						sado worried ...<br>Let's... Change the subject.
					`)
				}
				else {
					//Use first event rather than random
					console.log(smallTalkEvents[0].content);
					writeHTML(smallTalkEvents[0].content);
					var sadoTarotName = smallTalkEvents[0].index.replace("Meat", "");
					addFlag("sadogato", sadoTarotName);
					//Alt code for random instead
					//console.info(smallTalkEvents[getRandomInt(smallTalkEvents.length)]);
					//writeHTML(smallTalkEvents[getRandomInt(smallTalkEvents.length)]);
				}
			}
		}
	}
}

function editSkill(skill, n) {
	if (data.player.skills == null) {
		data.player.skills = [];
	}
	//If the skill doesn't exist, add it
	if (checkSkill(skill) == false) {
		var newSkill = {index: skill, level: 0};
		data.player.skills.push(newSkill);
	}
	for (var i = 0; i < data.player.skills.length; i++) {
		if (data.player.skills[i].index == skill) {
			//Convert negative to positive to avoid weird decimal numbers
			if (n < 0) {
				n = n * -1;
				data.player.skills[i].level -= n;
			}
			else {
				data.player.skills[i].level += n;
			}
		}
	}
}

function checkSkill(skill) {
	if (data.player.skills == null) {
		//data.player.skills = [];
	}
	for (var i = 0; i < data.player.skills.length; i++) {
		if (data.player.skills[i].index == skill) {
			return data.player.skills[i].level;
		}
	}
	return false;
}

function minSkill() {
	if (data.player.skills == null) {
		data.player.skills = [];
	}
	if (typeof data.player.skills == "object") {
		data.player.skills = [];
	}
	if (checkSkill("fluff-lover") == false) {
		var newSkill = {index: "fluff-lover", level: 99};
		data.player.skills.push(newSkill);
	}
	//Minimum stamina calculation
	var minimumStamina = 30;
	if (checkSkill("stamina") == false) {
		var newSkill = {index: "stamina", level: 30};
		data.player.skills.push(newSkill);
	}
	if (checkFlag("player", "hanniwa") == true) {
		minimumStamina += 5;
	}
	if (galleryCheck("milf", "milf4")) {
		minimumStamina += 5;
	}
	if (checkFlag("foxf", "fun-foxd")) {
		minimumStamina += 5;
	}
	for (skillIndex = 0; skillIndex < data.player.skills.length; skillIndex++) {
		if (data.player.skills[skillIndex].index == "stamina") {
			if (data.player.skills[skillIndex].level < minimumStamina) {
				data.player.skills[skillIndex].level = minimumStamina;
			}
		}
	}

	//Minimum dominance calculation
	if (checkSkill("dominance") == false) {
		var newSkill = {index: "dominance", level: 0};
		data.player.skills.push(newSkill);
	}
	var minDominance = 0;
	if (galleryCheck("wolf", "wolf-training1")) {
		minDominance = minDominance + 1;
	}
	if (galleryCheck("sadogato", "reading5")) {
		minDominance = minDominance + 1;
	}
	if (galleryCheck("sadogato", "wall1-1")) {
		minDominance = minDominance + 1;
	}
	if (galleryCheck("mesu", "mesu6Start")) {
		minDominance = minDominance + 1;
	}
	if (galleryCheck("mesu", "repeat1")) {
		minDominance = minDominance + 1;
	}
	if (galleryCheck("mesu", "wall1-1")) {
		minDominance = minDominance + 1;
	}
	if (galleryCheck("fashionista", "repeatTwintail")) {
		minDominance = minDominance + 1;
	}
	if (galleryCheck("player", "mimicPurple2")) {
		minDominance = minDominance + 1;
	}
	if (galleryCheck("player", "mimicRed2")) {
		minDominance = minDominance + 1;
	}
	if (galleryCheck("player", "mimicBlue2")) {
		minDominance = minDominance + 1;
	}
	console.log("Minimum dominance: " + minDominance);
	for (skillIndex = 0; skillIndex < data.player.skills.length; skillIndex++) {
		if (data.player.skills[skillIndex].index == "dominance") {
			if (data.player.skills[skillIndex].level < minDominance) {
				data.player.skills[skillIndex].level = minDominance;
			}
		}
	}
}