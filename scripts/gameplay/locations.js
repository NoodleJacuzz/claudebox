var locationArray = [
	{index: "pineconePlaza", image: "pineconePlaza", name: "Pinecone Plaza", buttons: [
		{name: "Squids Make Inc.", top: 35, left: 66, type: "location", target: "squidsMakeInc", time: "MorningEvening", requirements: "!flag player intro; !flag carpenter away;"},
		{name: "Mayor's Office", top: 35, left: 20, type: "location", target: "townHall", time: "MorningEvening", requirements: "!flag player intro; !flag mayor mayorIntro;"},
		{name: "Riverside Road", top: 63, left: 0, type: "location", target: "riversideRoad", time: "MorningEvening", requirements: "!flag player intro;"},
		{name: "Willow Walk", top: 63, left: 75, type: "location", target: "willowWalk", time: "MorningEvening", requirements: "!flag player intro;"},
		{name: "Lavender Lane", top: 77, left: 40, type: "location", target: "lavenderLane", time: "MorningEvening", requirements: "!flag player intro;"},

		{name: "Riverside Road", top: 63, left: 0, type: "location", target: "riversideRoad", time: "MorningEvening", requirements: "?flag player intro; ?flag carpenter carpenterIntro;"},
	],},
	{index: "townHall", image: "interiorMayor", name: "Mayor's Office", buttons: [
		{name: "Head Outside", top: 63, left: 0, type: "location", target: "pineconePlaza", time: "MorningEvening",},
	],},
	{index: "squidsMakeInc", image: "interiorCarpenter", name: "Squids Make Inc.", buttons: [
		{name: "Head Outside", top: 63, left: 0, type: "location", target: "pineconePlaza", time: "MorningEvening",},
	],},
	{index: "store", image: "interiorShopkeep", name: "Ivy & Oak General Store", buttons: [
		{name: "Head Outside", top: 45, left: 0, type: "location", target: "riversideRoad", time: "MorningEvening",},
	],},
	{index: "willowWalk", image: "willowWalk", name: "Willow Walk", buttons: [
		{name: "Pinecone Plaza", top: 77, left: 35, type: "location", target: "pineconePlaza", time: "MorningEvening",},
		{name: "Into the Woods", top: 50, left: 10, type: "location", target: "forestPath", time: "MorningEvening",},
		{name: "The Museum", top: 56, left: 77, type: "location", target: "museumExterior", time: "MorningEvening",},
	],},
	{index: "museumExterior", image: "exteriorFox", name: "The Museum", buttons: [
		{name: "Willow Walk", top: 77, left:38, type: "location", target: "willowWalk", time: "MorningEvening",},
	],},
	{index: "forestPath", image: "forestPath", name: "Forest Path", buttons: [
		{name: "Willow Walk", top: 77, left:47, type: "location", target: "willowWalk", time: "MorningEvening",},
		{name: "Head Deeper", top: 61, left: 75, type: "location", target: "forestWilderness", time: "MorningEvening",},
		{name: "Fruit Orchard", top: 43, left: 35, type: "location", target: "forestOrchard", time: "MorningEvening",},
	],},
	{index: "forestWilderness", image: "forestWilderness", name: "Forest Wilderness", buttons: [
		{name: "Back to the Path", top: 77, left: 43, type: "location", target: "forestPath", time: "MorningEvening",},
	],},
	{index: "forestOrchard", image: "forestOrchard", name: "Forest Orchard", buttons: [
		{name: "Back to the Path", top: 78, left: 37, type: "location", target: "forestPath", time: "MorningEvening",},
	],},
	{index: "riversideRoad", image: "riversideRoad", name: "Riverside Road", buttons: [
		{name: "Pinecone Plaza", top: 76, left: 55, type: "location", target: "pineconePlaza", time: "MorningEvening",},
		{name: "Head to the Lake", top: 52, left: 0, type: "location", target: "lakesideRetreat", time: "MorningEvening", requirements: "!flag player intro;"},
		{name: "Ivy & Oak General Store", top: 35, left: 66, type: "location", target: "store", time: "MorningEvening", requirements: "!flag player intro; !flag shopkeep busy;"},
	],},
	{index: "lakesideRetreat", image: "lakesideRetreat", name: "Lakeside Retreat", buttons: [
		{name: "Riverside Road", top: 77, left: 45, type: "location", target: "riversideRoad", time: "MorningEvening",},
		{name: "Lakeside Ruins", top: 49, left: 75, type: "location", target: "lakesideRuins", time: "MorningEvening",},
	],},
	{index: "lakesideRuins", image: "lakesideRuins", name: "Lakeside Ruins", buttons: [
		{name: "Back to the Lake", top: 80, left: 48, type: "location", target: "lakesideRetreat", time: "MorningEvening",},
	],},
	{index: "lavenderLane", image: "lavenderLane", name: "Lavender Lane", buttons: [
		{name: "Pinecone Plaza", top: 77, left: 34, type: "location", target: "pineconePlaza", time: "MorningEvening",},
		{name: "Your Home", top: 36, left: 41, type: "location", target: "playerExterior", time: "MorningEvening",},
		{name: "Green Gardens", top: 54, left: 75, type: "location", target: "greenGardens", time: "MorningEvening", requirements: "?flag carpenter garden;",},
	],},
	{index: "playerExterior", image: "exteriorClean", name: "Your Home (Exterior)", buttons: [
		{name: "Head Inside", top: 55, left: 42, type: "location", target: "playerHouse", time: "MorningEvening",},
		{name: "Lavender Lane", top: 76, left: 42, type: "location", target: "lavenderLane", time: "MorningEvening",},
	],},
	{index: "playerHouse", image: "interiorClean", name: "Your Home (Interior)", buttons: [
		{name: "Outside", top: 76, left: 42, type: "location", target: "playerExterior", time: "MorningEvening",},
		{name: "Collection Room", top: 60, left: 0, type: "location", target: "collectionRoom", time: "MorningEvening",},
	],},
	{index: "greenGardens", image: "greenGardens", name: "Green Gardens", buttons: [
		{name: "Lavender Lane", top: 77, left: 11, type: "location", target: "lavenderLane", time: "MorningEvening",},
	],},
	{index: "collectionRoom", image: "collectionRoom", name: "Collection Room", buttons: [
		{name: "Go Back", top: 78, left: 0, type: "location", target: "playerHouse", time: "MorningEvening",},
	],},
];

var fakeLocationArray = [
	{index: "museumTerrarium", buttons: [
		{name: "Technology Wing", top: 0, left: 15, type: "fake", target: "museumTechnology", time: "MorningEvening",},
		{name: "Fashion Wing", top: 0, left: 55, type: "fake", target: "museumFashion", time: "MorningEvening",},
		{name: "Sponsor Wing", top: 30, left: 70, type: "fake", target: "museumSponsor", time: "MorningEvening",},
		{name: "Leave", top: 78, left: 42, type: "location", target: "museumExterior", time: "MorningEvening",},
	],},
	{index: "museumTechnology", buttons: [
		{name: "Terrarium Wing", top: 30, left: 0, type: "fake", target: "museumTerrarium", time: "MorningEvening",},
		{name: "Fashion Wing", top: 0, left: 55, type: "fake", target: "museumFashion", time: "MorningEvening",},
		{name: "Sponsor Wing", top: 30, left: 70, type: "fake", target: "museumSponsor", time: "MorningEvening",},
		{name: "Leave", top: 78, left: 42, type: "location", target: "museumExterior", time: "MorningEvening",},
	],},
	{index: "museumFashion", buttons: [
		{name: "Terrarium Wing", top: 30, left: 0, type: "fake", target: "museumTerrarium", time: "MorningEvening",},
		{name: "Technology Wing", top: 0, left: 15, type: "fake", target: "museumTechnology", time: "MorningEvening",},
		{name: "Sponsor Wing", top: 30, left: 70, type: "fake", target: "museumSponsor", time: "MorningEvening",},
		{name: "Leave", top: 78, left: 42, type: "location", target: "museumExterior", time: "MorningEvening",},
	],},
	{index: "museumSponsor", buttons: [
		{name: "Terrarium Wing", top: 30, left: 0, type: "fake", target: "museumTerrarium", time: "MorningEvening",},
		{name: "Technology Wing", top: 0, left: 15, type: "fake", target: "museumTechnology", time: "MorningEvening",},
		{name: "Fashion Wing", top: 0, left: 55, type: "fake", target: "museumFashion", time: "MorningEvening",},
		{name: "Leave", top: 78, left: 42, type: "location", target: "museumExterior", time: "MorningEvening",},
	],},
	{index: "collectionRoom", buttons: [
		{name: "Go Back", top: 78, left: 0, type: "location", target: "playerHouse", time: "MorningEvening",},
	],},
	{index: "forestShrine", buttons: [
		{name: "Go Back", top: 78, left: 40, type: "location", target: "forestWilderness", time: "MorningEvening",},
	],},
	{index: "ruins1", buttons: [
		{name: "Leave the Ruins", top: 78, left: 40, type: "location", target: "lakesideRuins", time: "MorningEvening",},
		{name: "Head Deeper", top: 52, left: 35, type: "fake", target: "ruins2", time: "MorningEvening",},
	],},
	{index: "ruins2", buttons: [
		{name: "Go Back", top: 78, left: 40, type: "fake", target: "ruins1", time: "MorningEvening",},
	],},
];

function fakeLocation(n) {
	//Cleanup step, reload menu and reset character emotions and costumes
	data.player.emotion = "happy";
	for (i = 0; i < data.story.length; i++) {
		data.story[i].emotion = data.story[i].emotionDefault;
		data.story[i].outfit = data.story[i].outfitDefault;
	}
	data.player.fakeLocation = "NULL";
	//wrapper.scrollTop = 0;
	document.getElementById('output').innerHTML = '';
	var locationTarget = 'failed';
	for (i = 0; i < fakeLocationArray.length; i++) { //find the location target
		if (n == fakeLocationArray[i].index) {
			console.log('Fake location target found (used for certain code). Now loading location '+fakeLocationArray[i].index)
			locationTarget = i;
		}
	}
	if (locationTarget == 'failed') { //error message;
		writeText("You encountered a bug! Error code: fakeLocationTargetFailed");
		writeText("Send me a message with where you were and what button you clicked on, thanks!");
		writeFunction("changeLocation('playerHouse')", "Go Back Home");
	}
	else {
		data.player.fakeLocation = n;
		var bg = cleanupImage("locations/" + n)
		document.getElementById('output').innerHTML += `
			<div class="playerRoom">
				<div class="backgroundBorder">
					<img class="backgroundPicture" src="`+bg+`" usemap="#roomMap">
				</div>
			</div>
		`;
		for (i = 0; i < fakeLocationArray[locationTarget].buttons.length; i++) {
			if (fakeLocationArray[locationTarget].buttons[i].type == "location") {
				printLocationButton(
					fakeLocationArray[locationTarget].buttons[i].name, 
					fakeLocationArray[locationTarget].buttons[i].top, 
					fakeLocationArray[locationTarget].buttons[i].left, 
					fakeLocationArray[locationTarget].buttons[i].target, 
				);
			}
			if (fakeLocationArray[locationTarget].buttons[i].type == "fake") {
				printEncounterButton(
					"system", 
					fakeLocationArray[locationTarget].buttons[i].target, 
					fakeLocationArray[locationTarget].buttons[i].name, 
					fakeLocationArray[locationTarget].buttons[i].top, 
					fakeLocationArray[locationTarget].buttons[i].left, 
				);
			}
		}
	}
	if (n.includes("museum")) {
		var position = "height: var(--ovl-h, 100%); ";
		if (data.player.vegetarian != true) {
			for (i = 0; i < data.story.length; i++) {
				if (data.story[i].index == "foxm") {
					var characterTarget = data.story[i].index;
				}
			}
			document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
				<div id = "overlayL" class = "overlay" 
				style="	
				`+position+`		
				bottom: -35%; 
				right: 2vw;
				transform: scaleX(-1);
				aspect-ratio: 1/2;"
				onclick='writeScene("foxm", "`+n+`")'>
			`;
			document.getElementById('overlayL').innerHTML += drawCharacter(characterTarget, "class:overlayImage;");
		}
		if (data.player.carnivore != true) {
			for (i = 0; i < data.story.length; i++) {
				if (data.story[i].index == "foxf") {
					var characterTarget = data.story[i].index;
				}
			}
			document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
				<div id = "overlayR" class = "overlay" 
				style="	
				`+position+`				
				bottom: -35%; 
				left: 2vw;
				transform: scaleX(-1);
				aspect-ratio: 1/2;"
				onclick='writeScene("foxf", "`+n+`")'>
			`;
			document.getElementById('overlayR').innerHTML += drawCharacter(characterTarget, "class:overlayImage;");
		}
	}
	switch(n) {
		case "museumTerrarium": {
			generateMuseum("terrarium");
			break;
		}
		case "museumFashion": {
			generateMuseum("fashion");
			break;
		}
		case "museumTechnology": {
			generateMuseum("technology");
			break;
		}
		case "museumSponsor": {
			generateMuseum("sponsor");
			listPeeps("subscribers");
			break;
		}
		case "forestShrine": {
			checkForFakeLocationEncounters(n);
			break;
		}
		case "ruins1": {
			break;
		}
		case "ruins2": {
			break;
		}
		case "collectionRoom": {
			changeLocation('collectionRoom')
			break;
		}
	}
}

//A fake location leaves data.player.location pointing at the real location underneath it, so
//checkForEncounters would print every encounter from that location on top of this one. Only
//encounters naming the fake location itself in their ?location requirement are printed here.
function checkForFakeLocationEncounters(n) {
	//Only changeLocation resets the one-tab-per-character list, so returning here from a menu would
	//otherwise find the character already printed and hide their tab
	listOfPrintedEncounters = [];
	for (let number = 0; number < globalEncounterArray.length; number++) {
		let encounter = globalEncounterArray[number];
		if (encounter.character == "system" || encounter.requirements.includes("?location "+n+";") == false) {
			continue;
		}
		let finalRequirements = encounter.requirements;
		if (data.player.holiday != null && data.player.holiday != "" && finalRequirements.includes("?holiday "+data.player.holiday+";") == false) {
			continue;
		}
		if (checkRequirements(finalRequirements) == true && encounteredCheck(encounter.character) != true) {
			printEncounterTab(encounter.character, encounter.index, encounter.name, encounter.altImage, encounter.altName);
		}
	}
}

var timeBypass = false;
function changeLocation(n) {
	data.player.currentCharacter = "system";
	//Simple cleanup if n is an object instead of a string (use n.index)
	if (typeof n === "object") {
		n = n.index;
	}
	HTMLContainer = "output";
	superFlagCondenstation()
	superItemsCondensation()
	//Cleanup step, reload menu and reset character emotions and costumes
	data.player.emotion = "happy";
	for (i = 0; i < data.story.length; i++) {
		data.story[i].emotion = data.story[i].emotionDefault;
		data.story[i].outfit = data.story[i].outfitDefault;
	}
	soundEffectStart("move");
	var galleryFiltersAuthor = "";
	var galleryFiltersArtist = "";
	listOfPrintedEncounters = [];
	document.getElementById('output').innerHTML = '';
	data.player.fakeLocation = "NULL";
	
	var locationTarget = 'failed';
	for (i = 0; i < locationArray.length; i++) { //find the location target
		if (n == locationArray[i].index) {
			console.log('Location target found. Now loading location '+locationArray[i].index)
			locationTarget = i;
		}
	}
	if (locationTarget == 'failed') { //error message;
		if (data.player.currentScene == "start" && data.player.location == "") {
			writeScene("system", "start");
		}
		else {
			document.getElementById('output').innerHTML = '';
			writeText("You encountered a bug! Error code: locationTargetFailed");
			writeText("Send me a message with where you were and what button you clicked on, thanks!");
			writeFunction("changeLocation('playerHouse')", "Go Back Home");
		}
	}
	else {
		if (timeBypass == true) {
			timeBypass = false;
			var bg = locationArray[locationTarget].image;
		}
		else {
			var bg = locationArray[locationTarget].image +"-"+data.player.time;
		}
		if (!bg.includes("/")) {
			bg = "locations/" + bg
		}
		if (data.player.time == "Morning") {
			bg = bg.replace("-Morning", "")
		}
		bg = cleanupImage(bg);
		changeBG(bg);
		if (data.player.time == "Night" && data.player.location != "playerHouse") {
			returnHome();
			bg = cleanupImage("locations/exteriorClean-Night");
		}
		else {
			var flavoring = "";
			document.getElementById('output').innerHTML += `
				<div class="playerRoom">
					<div class="backgroundBorder">
						<img class="backgroundPicture" `+flavoring+` src="`+bg+`" usemap="#roomMap">
					</div>
				</div>
			`;
			data.player.location = n;
			//console.log(data.player.location);
			if (!locationArray[locationTarget].buttons) {
				locationArray[locationTarget].buttons = [];
			}
			for (i = 0; i < locationArray[locationTarget].buttons.length; i++) {
				if (locationArray[locationTarget].buttons[i].requirements) {
					var finalRequirements = locationArray[locationTarget].buttons[i].requirements;
				}
				else {
					var finalRequirements = "";
				}
				if (!locationArray[locationTarget].buttons[i].time) {
					locationArray[locationTarget].buttons[i].time = "MorningEveningNight";
				}
				if (locationArray[locationTarget].buttons[i].time.includes(data.player.time) && checkRequirements(finalRequirements) == true) {
					if (!locationArray[locationTarget].buttons[i].name) {
						locationArray[locationTarget].buttons[i].name = locationArray[locationTarget].buttons[i].index;
					}
					if (!locationArray[locationTarget].buttons[i].type) {
						locationArray[locationTarget].buttons[i].type = "location";
					}
					printLocationButton(
						locationArray[locationTarget].buttons[i].name, 
						locationArray[locationTarget].buttons[i].top, 
						locationArray[locationTarget].buttons[i].left, 
						locationArray[locationTarget].buttons[i].target, 
					);
				}
			}
			if (data.player.time != "Night" && data.player.location != "map" 
			&& checkItem("Town Map") == true) {
				printLocationButton(
					'Use Map', 
					0, 
					0, 
					'map', 
				);
			}
			if (data.player.time == "Morning" && data.player.location == "playerHouse") {
				printShortcuts();
			}
			if (isModding()) {
				establishModWorkspace();
			}
			checkForEncounters();
			if (printShop == true) {
				checkForShops();
			}
			else {
				printShop = true;
			}
		}
	}
	if (n == 'gallery') {
		document.getElementById('output').innerHTML = '';
		loadEvent('system', 'laptop');
	}
	if (wrapperBypass > 0) {
		wrapperBypass -=1;
	}
	else {
		wrapper.scrollTop = 0;
	}
	document.getElementById('wrapperBG').style.backgroundImage = "url("+bg+")";
	//Cleanup step, reload menu and reset character emotions and costumes
	data.player.emotion = "happy";
	for (i = 0; i < data.story.length; i++) {
		data.story[i].emotion = data.story[i].emotionDefault;
		data.story[i].outfit = data.story[i].outfitDefault;
	}
	switch(n) {
		case "store": {
			if (data.player.shopkeepSales != null) {
				if (countScenes("shopkeep")[0] == 0) {
					salesGoal = 50;
				}
				else {
					salesGoal = 100;
				}
				if (data.player.shopkeepSales >= salesGoal) {
					data.player.shopkeepSales = salesGoal;
					changeEmotion("shop", "excited")
				}
				if (countScenes("shopkeep")[0] == countScenes("shopkeep")[1]) {
					changeEmotion("shop", "happy")
				}
			}
			else {
				data.player.shopkeepSales = 0;
			}
			var position = "height: var(--ovl-h, 100%); bottom: -20%; left: var(--ovl-left, 55%); right: var(--ovl-right, auto);";
			for (i = 0; i < data.story.length; i++) {
				var characterTarget = "shopkeep";
				if (data.story[i].index == characterTarget) {
					if (checkFlag(characterTarget, "meat") == true) {
						var finalImage = cleanupImage(characterTarget+"/"+data.story[i].outfitDefault+"-meat/"+data.story[i].emotion);
					}
					else {
						var finalImage = cleanupImage(characterTarget+"/"+data.story[i].outfitDefault+"/"+data.story[i].emotion);
					}
				}
			}
			document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
				<div id = "overlay" class = "overlay"  
				style="	
				`+position+`"
				onclick='writeScene("`+characterTarget+`", "statusQuo")'>
			`;
			document.getElementById('overlay').innerHTML += drawCharacter(characterTarget, "class:overlayImage;");
			break;
		}
		case "squidsMakeInc": {
			var position = "height: var(--ovl-h, 100%); bottom: -20%; left: var(--ovl-left, 55%); right: var(--ovl-right, auto);";
			for (i = 0; i < data.story.length; i++) {
				var characterTarget = "carpenter";
				if (data.story[i].index == characterTarget) {
					if (checkFlag(characterTarget, "meat") == true) {
						var finalImage = cleanupImage(characterTarget+"/"+data.story[i].outfitDefault+"-meat/"+data.story[i].emotion);
					}
					else {
						var finalImage = cleanupImage(characterTarget+"/"+data.story[i].outfitDefault+"/"+data.story[i].emotion);
					}
				}
			}
			document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
				<div id = "overlay" class = "overlay"  
				style="	
				`+position+`"
				onclick='writeScene("`+characterTarget+`", "statusQuo")'>
			`;
			document.getElementById('overlay').innerHTML += drawCharacter(characterTarget, "class:overlayImage;");
			break;
		}
		case "townHall": {
			var position = "height: var(--ovl-h, 100%); bottom: -20%; left: var(--ovl-left, 55%); right: var(--ovl-right, auto);";
			finalEmotion = "happy";
			if (checkTrust("mayor") > 2) {
				if (checkFlag("mayor", "pounce") != true) {
					finalEmotion = "excited";
				}
				else {
					if (checkFlag("mayor", "horny") == true) {
						finalEmotion = "excited";
					}
				}
			}
			for (i = 0; i < data.story.length; i++) {
				var characterTarget = "mayor";
				if (data.story[i].index == characterTarget) {
					if (checkFlag(characterTarget, "meat") == true) {
						var finalImage = cleanupImage(characterTarget+"/"+data.story[i].outfitDefault+"-meat/"+finalEmotion);
					}
					else {
						var finalImage = cleanupImage(characterTarget+"/"+data.story[i].outfitDefault+"/"+finalEmotion);
					}
				}
			}
			document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
				<div id = "overlay" class = "overlay"  
				style="	
				`+position+`"
				onclick='writeScene("`+characterTarget+`", "statusQuo")'>
			`;
			document.getElementById('overlay').innerHTML += drawCharacter(characterTarget, "class:overlayImage;emotion:"+finalEmotion+";");
			writeCenteredText("Enter Cheat Code: <input type='text' id='cheatSubmission' value=''>");
			writeFunction("diagnostic()", "Submit");

			if (checkFlag("mayor", "chName") == true) {
				printEncounterTab("mayor", "chName", "Rename all cast members", "", "New Name", "#1ce01c");
			}
			if (checkFlag("mayor", "chGender") == true) {
				if (data.player.gender == "masc") {
					printEncounterTab("player", "chGenderToggle", "MALE (No tiddies)", "", "Your gender", "blue");
				}
				else {
					printEncounterTab("player", "chGenderToggle", "FEMALE (Big ol' tiddies)", "", "Your gender", "pink");
				}
			}
			if (checkFlag("mayor", "chMuns") == true) {
				if (checkFlag("player", "money") == true) {
					printEncounterTab("mayor", "chMunsToggle", "Infinite Money - Cheat is ENABLED", "", "Cash Money", "#1ce01c");
				}
				else {
					printEncounterTab("mayor", "chMunsToggle", "Infinite Money - Cheat is DISABLED", "", "Cash Money", "red");
				}
			}
			if (checkFlag("mayor", "chLimit") == true) {
				if (checkFlag("player", "limited") == true) {
					printEncounterTab("mayor", "chLimitToggle", "Money Cap - ENABLED", "", "Limited", "#1ce01c");
				}
				else {
					printEncounterTab("mayor", "chLimitToggle", "Money Cap - DISABLED", "", "Limited", "red");
				}
			}
			if (checkFlag("mayor", "chCollect") == true) {
				if (checkFlag("player", "collectables") == true) {
					printEncounterTab("mayor", "chCollectToggle", "All Collectables - Cheat is ENABLED", "", "Even the Funko Pops", "#1ce01c");
				}
				else {
					printEncounterTab("mayor", "chCollectToggle", "All Collectables - Cheat is DISABLED", "", "Even the Funko Pops", "red");
				}
			}
			if (checkFlag("mayor", "chOutfits") == true) {
				if (checkFlag("player", "outfits") == true) {
					printEncounterTab("mayor", "chOutfitsToggle", "All Player Clothes - Cheat is ENABLED", "", "Passion for Fashion", "#1ce01c");
				}
				else {
					printEncounterTab("mayor", "chOutfitsToggle", "All Player Clothes - Cheat is DISABLED", "", "Passion for Fashion", "red");
				}
			}
			if (checkFlag("mayor", "chCostumes") == true) {
				if (checkFlag("player", "costumes") == true) {
					printEncounterTab("mayor", "chCostumesToggle", "All Character Costumes - Cheat is ENABLED", "", "Free the Fur", "#1ce01c");
				}
				else {
					printEncounterTab("mayor", "chCostumesToggle", "All Character Costumes - Cheat is DISABLED", "", "Free the Fur", "red");
				}
			}
			if (checkFlag("mayor", "chLogbook") == true) {
				if (checkFlag("player", "logbook") == true) {
					printEncounterTab("mayor", "chLogbookToggle", "All Logbook Entries - Cheat is ENABLED", "", "Note Taker", "#1ce01c");
				}
				else {
					printEncounterTab("mayor", "chLogbookToggle", "All Logbook Entries - Cheat is DISABLED", "", "Note Taker", "red");
				}
			}
			if (checkFlag("mayor", "chEvents") == true) {
				if (checkFlag("player", "events") == true) {
					printEncounterTab("mayor", "chEventsToggle", "Full Gallery - Cheat is ENABLED", "", "Pool Noodle", "#1ce01c");
				}
				else {
					printEncounterTab("mayor", "chEventsToggle", "Full Gallery - Cheat is DISABLED", "", "Pool Noodle", "red");
				}
			}
			if (checkFlag("mayor", "chGPS") == true) {
				if (data.player.gps == true) {
					printEncounterTab("mayor", "chGPSToggle", "All Characters on Map - Cheat is ENABLED", "", "Find Mii", "#1ce01c");
				}
				else {
					printEncounterTab("mayor", "chGPSToggle", "All Characters on Map - Cheat is DISABLED", "", "Find Mii", "red");
				}
			}
			if (checkFlag("mayor", "chVeggie") == true) {
				if (data.player.vegetarian == true) {
					printEncounterTab("mayor", "chVeggieToggle", "Disables characters with dicks - ENABLED", "", "Vegetarian Mode", "#1ce01c");
				}
				else {
					printEncounterTab("mayor", "chVeggieToggle", "Disables characters with dicks - DISABLED", "", "Vegetarian Mode", "red");
				}
			}
			if (checkFlag("mayor", "chMeat") == true) {
				if (data.player.carnivore == true) {
					printEncounterTab("mayor", "chMeatToggle", "Disables characters with pussies - ENABLED", "", "Carnivore Mode", "#1ce01c");
				}
				else {
					printEncounterTab("mayor", "chMeatToggle", "Disables characters with pussies - DISABLED", "", "Carnivore Mode", "red");
				}
			}
			if (checkFlag("mayor", "chUwU") == true) {
				if (data.player.uwu == true) {
					printEncounterTab("mayor", "chUwUToggle", "Toggles UwU text - Cheat is ENABLED", "", "oowoo", "#1ce01c");
				}
				else {
					printEncounterTab("mayor", "chUwUToggle", "Toggles UwU text - Cheat is DISABLED", "", "oowoo", "red");
				}
			}
			if (checkFlag("mayor", "chEgg") == true) {
				if (data.player.egg == true) {
					printEncounterTab("mayor", "chEggToggle", "Toggles eggman reference dialogue - Cheat is ENABLED", "", "Egg Mode", "#1ce01c");
				}
				else {
					printEncounterTab("mayor", "chEggToggle", "Toggles eggman reference dialogue - Cheat is DISABLED", "", "Egg Mode", "red");
				}
			}
			if (checkFlag("mayor", "chPronouns") == true) {
				if (data.player.pronouns == true) {
					printEncounterTab("mayor", "chPronounsToggle", "Removes all pronouns from text - Cheat is ENABLED", "", "FUCKING PRONOUNS Mode", "#1ce01c");
				}
				else {
					printEncounterTab("mayor", "chPronounsToggle", "Removes all pronouns from text - Cheat is DISABLED", "", "FUCKING PRONOUNS Mode", "red");
				}
			}
			break;
		}
		case "collectionRoom": {
			var totalJiggies = 0;
			var totalMagazines = 0;
			var totalPocketmanz = 0;
			var totalTarot = 0;
			var totalPogs = 0;
			for (i = 0; i < globalItemsArray.length; i++) {
				if (totalJiggies < 1 && globalItemsArray[i].category == "jiggy" && checkItem(globalItemsArray[i].index)) {
					totalJiggies += 1;
				}
				if (totalMagazines < 1 && globalItemsArray[i].category == "magazine" && checkItem(globalItemsArray[i].index)) {
					totalMagazines += 1;
				}
				if (totalPocketmanz < 1 && globalItemsArray[i].category == "pocketmanz" && checkItem(globalItemsArray[i].index)) {
					totalPocketmanz += 1;
				}
				if (totalTarot < 1 && globalItemsArray[i].category == "tarot" && checkItem(globalItemsArray[i].index)) {
					totalTarot += 1;
				}
				if (totalPogs < 1 && globalItemsArray[i].category == "pogs" && checkItem(globalItemsArray[i].index)) {
					totalPogs += 1;
				}
				if (checkFlag("player", "jiggiesUp")) {
					totalJiggies = 999;
				}
				if (checkFlag("player", "collectables")) {
					totalJiggies = 999;
					totalMagazines = 999;
					totalPocketmanz = 999;
					totalTarot = 999;
					totalPogs = 999;
				}
			}
			if (totalJiggies > 0) {
				document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
					<img class = "overlay" 
					src = "images-${imageFormat}/locations/upgrades/collectionJiggies.`+imageFormat+`"style="height: 100%;width: 100%;top: 0%;left: 0%;object-fit: initial;cursor: auto;filter:opacity(100%);"onclick=''>
				`;
			}
			if (totalMagazines > 0) {
			document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
				<img class = "overlay" 
				src = "images-${imageFormat}/locations/upgrades/collectionMagazines.`+imageFormat+`"style="height: 100%;width: 100%;top: 0%;left: 0%;object-fit: initial;cursor: auto;filter:opacity(100%);"onclick=''>
			`;
			}
			if (totalPocketmanz > 0) {
			document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
				<img class = "overlay" 
				src = "images-${imageFormat}/locations/upgrades/collectionPocketmanz.`+imageFormat+`"style="height: 100%;width: 100%;top: 0%;left: 0%;object-fit: initial;cursor: auto;filter:opacity(100%);"onclick=''>
			`;
			}
			if (totalTarot > 0) {
			document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
				<img class = "overlay" 
				src = "images-${imageFormat}/locations/upgrades/collectionTarot.`+imageFormat+`"style="height: 100%;width: 100%;top: 0%;left: 0%;object-fit: initial;cursor: auto;filter:opacity(100%);"onclick=''>
			`;
			}
			if (totalPogs > 0) {
			document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
				<img class = "overlay" 
				src = "images-${imageFormat}/locations/upgrades/collectionTarot.`+imageFormat+`"style="height: 100%;width: 100%;top: 0%;left: 0%;object-fit: initial;cursor: auto;filter:opacity(100%);"onclick=''>
			`;
			}
			categoriesCollectables();
			if (checkFlag("player", "patron") == true) {
				document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
					<img class = "overlay" 
					src = "images-${imageFormat}/locations/upgrades/collectionStar.`+imageFormat+`"style="height: 100%;width: 100%;top: 0%;left: 0%;object-fit: initial;cursor: auto;filter:opacity(100%);"onclick=''>
				`;
			}
			if (data.player.tarotPoster != null && data.player.tarotPoster != "") {
				document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
					<div class = "overlay" style="height: 100%;width: 100%;top: 0%;left: 0%;max-height: 70vh;object-fit: initial;cursor: auto;filter:opacity(100%);">
						<img id="tarotPoster" class = "overlay" src = "`+cleanupImage(data.player.tarotPoster)+`"style="object-fit: initial;cursor: auto;filter:opacity(100%);
						height: 33%;
						width: 11%;
						left: 66.3%;
						top: 6%;
						border: 2px solid #754E3D;
						"onclick=''>
					</div>
				`;
			}
			if (data.player.magazinePoster != null && data.player.magazinePoster != "") {
				document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
					<div class = "overlay" style="height: 100%;width: 100%;top: 0%;left: 0%;max-height: 70vh;object-fit: initial;cursor: auto;filter:opacity(100%);">
						<img id="magazinePoster" class = "overlay" src = "`+cleanupImage(data.player.magazinePoster)+`"style="object-fit: initial;cursor: auto;filter:opacity(100%);
						height: 36%;
						width: 16.2%;
						left: 46.5%;
						top: 6.2%;
						border: 2px solid #754E3D;
						"onclick=''>
					</div>
				`;
			}
			if (data.player.pocketPoster != null && data.player.pocketPoster != "") {
				document.getElementsByClassName('backgroundBorder')[0].innerHTML += `
					<div class = "overlay" style="height: 100%;width: 100%;top: 0%;left: 0%;max-height: 70vh;object-fit: initial;cursor: auto;filter:opacity(100%);">
						<img id="pocketManzPoster" class = "overlay" src = "`+cleanupImage(data.player.pocketPoster)+`"style="object-fit: initial;cursor: auto;filter:opacity(100%);
						height: 16.5%;
						width: 16.2%;
						left: 25.5%;
						top: 6%;
						border: 2px solid #754E3D;
						"onclick=''>
					</div>
				`;
			}
			break;
		}
	}
	
	updateMenu();
	data.player.currentScene = "";
	removeFlag("player", "gallery");
	saveSlot(10);
	checkForAchievements();
	checkForPickups();
	if (data.player.vegetarian == true && data.player.carnivore == true) {
		if (n != "townHall") {
			data.player.vegetarian = false;
			data.player.carnivore = false;
			addFlag("player", "vegan");
			writeScene("mayor", "veganEnding");
		}
	}
	checkWatch();
	renderModWorkspaces();
	checkForWalkingEncounters();
}

function returnHome() {
	if (checkFlag("mom", "megaEasy") == true) {
		n = 'playerHouse';
		data.player.location = "playerHouse";
		changeLocation("playerHouse");
	}
	else {
		n = 'playerHouse';
		data.player.location = "playerHouse";
		grottoStarted = false;
		grottoPosition = "";
		if (data.player.day == 1) {
			writeText("The sun has set and soon the moon is the only source of light. You head down to Lavender Lane before it gets too dark to read the signs");
			writeHTML(`
				im locations/exteriorClean-Night
				player So this is my new home...<br>Looks cozy!
			`)
			writeFunction("changeLocation('playerHouse')", "Head inside");
		}
		else {
			writeText("The sun has set and soon the moon will be the only source of light. It'd be best to head home now, otherwise you'll have trouble making it back.");
			writeFunction("changeLocation('playerHouse')", "Go Back Home");
		}
	}
}

function printLocationButton(name, top, left, target) {
	var targetSize = window.matchMedia('(orientation: portrait)').matches ? 40 : 30;
	var finalFunction = `"changeLocation('`+target+`')"`;
	if (data.player.holiday == null) {
		data.player.holiday = "";
	}
	if (data.player.holiday != "") {
		if (target == "store" || target == "townHall" || target == "squidsMakeInc" || target == "museumExterior") {
			finalFunction = `"writeScene('system', '`+data.player.holiday+`-`+target+`')"`;
		}
	}
	switch (data.player.style) {
		case "lobotomy": {
			document.getElementsByClassName('playerRoom')[0].innerHTML += `
				<div class="pictureButton" onclick=`+finalFunction+`
				style="top: `+top+`%; left: `+left+`%; max-width: `+targetSize+`%; border: 3px solid; border-radius: 0px;">`+name+`</div>
			`;
			break;
		}
		/*
		case "persona": {
			var ransomStringStart = name;
			ransomStringStart = ransomStringStart.toLowerCase();
			ransomStringStart = ransomStringStart.charAt(0).toUpperCase() + ransomStringStart.slice(1);
			console.log(ransomStringStart);
			var ransomStringEnd = "";
			if (ransomStringStart.charAt(2) == "g" || ransomStringStart.charAt(2) == "v") {
				for (var ransomCounter = 0; ransomCounter < ransomStringStart.length; ransomCounter++) {
					switch (ransomCounter) {
						case 0:
							var ransomFont = "font-family: norwester, times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "-webkit-transform: skew(5deg, 0deg);";
						break;
						case 1:
							var ransomFont = "font-family: railway, times new roman, sans-serif;";
							var ransomBG = "background-color: #fff;";
							var ransomColor = "color: #000;";
							var ransomRotate = "";
						break;
						case 2:
							var ransomFont = "font-family: times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "";
						break;
						case 3:
							var ransomFont = "font-family: norwester, times new roman, sans-serif;";
							var ransomBG = "background-color: #fff;";
							var ransomColor = "color: #000;";
							var ransomRotate = "-webkit-transform: skew(-5deg, 0deg);";
						break;
						case 4:
							var ransomFont = "font-family: railway, times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "-webkit-transform: scale(1.4);";
						break;
						case 5:
							var ransomFont = "font-family: railway, times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "-webkit-transform: rotate(15deg);";
						break;
						case 6:
							var ransomFont = "font-family: norwester, times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "-webkit-transform: scale(1.4);";
						break;
						case 7:
							var ransomFont = "font-family: norwester, times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "-webkit-transform: rotate(5deg);";
						break;
						case 10:
							var ransomFont = "font-family: norwester, times new roman, sans-serif;";
							var ransomBG = "background-color: #fff;";
							var ransomColor = "color: #000;";
							var ransomRotate = "";
						break;
						case 11:
							var ransomFont = "font-family: railway, times new roman, sans-serif;";
							var ransomBG = "background-color: #fff;";
							var ransomColor = "color: #000;";
							var ransomRotate = "-webkit-transform: skew(-5deg, 0deg);";
						break;
						default:
							var ransomFont = "font-family: times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "";
						break;
					}
					console.log('replacing menu character' + ransomCounter + ' with the style of ' + ransomFont+ransomBG+ransomColor);
					console.log(ransomStringEnd);
					ransomStringEnd += "<span style='display:inline-block;white-space:pre;"+ransomFont+ransomBG+ransomColor+ransomRotate+"'>"+ransomStringStart.charAt(ransomCounter)+"</span>";
				}
			}
			else {
				for (var ransomCounter = 0; ransomCounter < ransomStringStart.length; ransomCounter++) {
					switch (ransomCounter) {
						case 0:
							var ransomFont = "font-family: railway, times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "";
						break;
						case 1:
							var ransomFont = "font-family: norwester, times new roman, sans-serif;";
							var ransomBG = "background-color: #fff;";
							var ransomColor = "color: #000;";
							var ransomRotate = "-webkit-transform: skew(5deg, 0deg);";
						break;
						case 2:
							var ransomFont = "font-family: times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "-webkit-transform: scale(1.4);";
						break;
						case 3:
							var ransomFont = "font-family: norwester, times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "-webkit-transform: skew(-5deg, 0deg);";
						break;
						case 4:
							var ransomFont = "font-family: railway, times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "-webkit-transform: rotate(15deg);";
						break;
						case 5:
							var ransomFont = "font-family: railway, times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "";
						break;
						case 6:
							var ransomFont = "font-family: norwester, times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "-webkit-transform: skew(5deg, 0deg);";
						break;
						case 7:
							var ransomFont = "font-family: norwester, times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "-webkit-transform: rotate(-15deg);";
						break;
						case 10:
							var ransomFont = "font-family: norwester, times new roman, sans-serif;";
							var ransomBG = "background-color: #fff;";
							var ransomColor = "color: #000;";
							var ransomRotate = "";
						break;
						case 11:
							var ransomFont = "font-family: railway, times new roman, sans-serif;";
							var ransomBG = "background-color: #fff;";
							var ransomColor = "color: #000;";
							var ransomRotate = "-webkit-transform: skew(-5deg, 0deg);";
						break;
						default:
							var ransomFont = "font-family: times new roman, sans-serif;";
							var ransomBG = "background-color: #000;";
							var ransomColor = "color: #fff;";
							var ransomRotate = "";
						break;
					}
					//console.log('replacing menu character' + ransomCounter + ' with the style of ' + ransomFont+ransomBG+ransomColor);
					//console.log(ransomStringEnd);
						ransomStringEnd += "<span style='display:inline-block;white-space:pre;"+ransomFont+ransomBG+ransomColor+ransomRotate+"'>"+ransomStringStart.charAt(ransomCounter)+"</span>";
				}
			}
			if (checkFlag("mom", "personaOff")) {
				ransomStringEnd = name;
			}
			document.getElementsByClassName('playerRoom')[0].innerHTML += `
				<div class="pictureButtonPersona" onclick='changeLocation("`+target+`")'
				style="top: `+top+`%; left: `+left+`%; max-width: `+targetSize+`%;">`+ransomStringEnd+`</div>
			`;
			break;
		}*/
		default: {
			document.getElementsByClassName('playerRoom')[0].innerHTML += `
				<div class="pictureButton" onclick=`+finalFunction+`
				style="top: `+top+`%; left: `+left+`%; max-width: `+targetSize+`%;">`+name+`</div>
			`;
		}
	}
}

function changeBG(n) {

    // If this is a user-uploaded image (blob URL), use it directly
    if (typeof n === "string" && n.startsWith("blob:")) {
        document.getElementById('wrapperBG').style.backgroundImage = "url(" + n + ")";
        return;
    }

    if (
        n.includes("locations") == false &&
        n.includes("fleshy") == false &&
        n.includes("images") == false
    ) {
        n = "locations/" + n;
    }

    if (n.includes("-time") == true) {
        n = n.replace("-time", "");
        n = cleanupImage("locations/" + n + "-" + data.player.time);
        n = n.replace("-Morning", "");
    }

    if (n.includes("." + imageFormat) == false) {
        n += "." + imageFormat;
    }

    n = cleanupImage(n);

    document.getElementById('wrapperBG').style.backgroundImage = "url(" + n + ")";
}