//Title screen
var title = "Syrup Town";
var titleStage = "Falling";
var titleCounter = 0;
var titleButtons = [
	[42, 70],
	[12, 70],
	[72, 70],
	[54, 70],
]
var mobileButtons = [
	[29, 55],
	[29, 70],
	[29, 85],
	[29, 88],
]
if (window.matchMedia('(orientation: portrait)').matches) {
	titleButtons = mobileButtons;
}
var landscapeResult = [ //Letter, left, top, rotate
	["S", 38, 22, -18],
	["y", 43, 20, 5],
	["r", 49, 21, 3],
	["u", 54, 22, 10],
	["p", 61, 22, 11],
	["T", 37, 35, -6],
	["o", 45, 34, 20],
	["w", 52, 32, 4],
	["n", 62, 34, 8],
	["version", 68, 38, 8],
];
var mobileResult = [
	["S", 26, 23, -18],
	["y", 38, 21, 5],
	["r", 50, 21, 3],
	["u", 61, 22, 10],
	["p", 73, 22, 11],
	["T", 28, 36, -6],
	["o", 39, 34, 20],
	["w", 53, 33, 4],
	["n", 68, 34, 8],
	["version", 78, 42, 5],
];
//Picked in generateTitle, since the screen can turn after this file loads
var titleResult = landscapeResult;
var titleAttempts = 1;

//Honeycomb Catacombs play button on the title screen. Set to false to remove it: the title then lays
//out exactly as it did before the button existed, and the hidden corner launcher still works.
var titleHoneycombButton = true;

//Where the Honeycomb button goes, worked out from the viewport once, like the rest of the title.
//Landscape: centred under the row of buttons, as tall as the space under the row allows.
//Portrait: the column of four buttons has no room under it, so the column is re-spaced into five rows
//with the Honeycomb button last. The buttons only get narrower when the screen is too short to fit
//five rows at their normal width. Rewrites titleButtons in portrait, and returns the button's box:
//left, top and width as percentages of the screen, height in pixels, and the width the other title
//buttons need (null when they keep their stylesheet width).
var titleHoneycombBox = null;
//The label's size in pixels. The frame's diamond ornaments take the ends of the button, so the text is
//held to about three quarters of its width (measured: norwester runs 10.7 times its font size wide for
//this label), and to about a third of its height.
function titleHoneycombFontSize(widthPixels, heightPixels) {
	return Math.min(heightPixels * 0.36, widthPixels * 0.069);
}
function layoutTitleHoneycomb() {
	var viewWidth = window.innerWidth;
	var viewHeight = window.innerHeight;
	var pillAspect = 408 / 1024;       //height over width of the title button images
	var honeycombAspect = 125 / 500;   //height over width of Honeycomb's button art
	if (!window.matchMedia('(orientation: portrait)').matches) {
		var rowTopShare = 0.70;          //the row's top, as in titleButtons
		var rowWidthShare = 0.20;        //.titleButton width in landscape
		var gap = 0.01 * viewHeight;
		var tallest = 0.06 * viewWidth;  //keeps it smaller than the buttons above it on wide screens
		var rowBottom = rowTopShare * viewHeight + rowWidthShare * viewWidth * pillAspect;
		var height = Math.min(tallest, 0.99 * viewHeight - rowBottom - gap);
		var width = height / honeycombAspect;
		return {left: 50 - (width / viewWidth) * 50, top: (rowBottom + gap) / viewHeight * 100, width: width / viewWidth * 100, height: height, fontSize: titleHoneycombFontSize(width, height), pillWidth: null};
	}
	var bandTop = 0.47 * viewHeight;     //just under the version number
	var bandBottom = 0.985 * viewHeight;
	var rowGap = 0.012 * viewHeight;
	var normalShare = 0.50;              //.titleButton width in portrait
	var columnCentre = 54;               //the old column: left 29% plus half of 50%
	var fitShare = (bandBottom - bandTop - 5 * rowGap) / ((4 * pillAspect + honeycombAspect) * viewWidth);
	var share = Math.min(normalShare, fitShare);
	var pillHeight = share * viewWidth * pillAspect;
	var honeycombHeight = share * viewWidth * honeycombAspect;
	var columnHeight = 4 * pillHeight + honeycombHeight + 4 * rowGap;
	var rowTop = bandTop + (bandBottom - bandTop - columnHeight) / 2;
	var left = columnCentre - share * 50;
	for (var row = 0; row < 4; row++) {
		titleButtons[row] = [left, (rowTop + row * (pillHeight + rowGap)) / viewHeight * 100];
	}
	return {
		left: left,
		top: (rowTop + 4 * (pillHeight + rowGap)) / viewHeight * 100,
		width: share * 100,
		height: honeycombHeight,
		fontSize: titleHoneycombFontSize(share * viewWidth, honeycombHeight),
		pillWidth: share < normalShare ? share * 100 : null,
	};
}

var titleURL = "fleshy-"+imageFormat+"/system/ui/titleEmpty."+imageFormat;
//redraw: the screen turned while the title was up. Lays the title out for the new orientation with no
//fall animation, and leaves the music and any open window alone.
function generateTitle(redraw) {
	//Redundant check to clean broken variables
	if (checkFlag("mayor", "meat") && checkFlag("mayor", "veggie")) {
		removeFlag("mayor", "meat");
	}
	if (checkFlag("carpenter", "meat") && checkFlag("carpenter", "veggie")) {
		removeFlag("carpenter", "meat");
	}
	if (checkFlag("shopkeep", "meat") && checkFlag("shopkeep", "veggie")) {
		removeFlag("shopkeep", "meat");
	}


	drawModeButton = true
	if (drawModeButton == true) {
		if (!window.matchMedia('(orientation: portrait)').matches) {
			titleButtons = [
				[31, 70],
				[8, 70],
				[75, 70],
				[54, 70],
			]
		}
		else {
			titleButtons = [
				[29, 52],
				[29, 64],
				[29, 76],
				[29, 88],
			]
		}
	}
	else {
		titleButtons = [
			[42, 70],
			[12, 70],
			[72, 70],
			[54, 70],
		]
		if (window.matchMedia('(orientation: portrait)').matches) {
			titleButtons = mobileButtons;
		}
	}
	//After the layouts above, because in portrait it re-spaces titleButtons around the new button
	titleHoneycombBox = null;
	if (titleHoneycombButton == true && typeof honeycombBoot === "function") {
		titleHoneycombBox = layoutTitleHoneycomb();
	}
	titleResult = window.matchMedia('(orientation: portrait)').matches ? mobileResult : landscapeResult;
	titleDrawnPortrait = window.matchMedia('(orientation: portrait)').matches;
	titleDrawnWidth = window.innerWidth;
	closeButton();
	if (redraw != true) {
		deleteWindow();
	}
	document.getElementById("openButton").style.visibility = "hidden";
	//var newWidth = screen.width/1200;
	//var newHeight = screen.height/800;
	//console.debug(imageFormat)
	if (window.matchMedia('(orientation: portrait)').matches) {
		var backboardURL = cleanupImage("system/ui/titleMobile");
		var titleFontSize = "300%";
		document.getElementById('footer').style.display = "initial";
	}
	else {
		var backboardURL = cleanupImage("system/ui/titleBackboard");
		var titleFontSize = "500%";
	}
	titleURL = cleanupImage("system/ui/titleEmpty");
	//console.debug(titleURL);
	document.getElementById('output').innerHTML = `
			<div id="titleCardHolder">
				<div class="titleCard">
			</div>
			<div id="titleLetterHolder">
				<img id="titleBackboard" class="titleBackboard" src="`+backboardURL+`">
			</div>
	`;
	if (data.player.location == "") { //If the player is on a fresh save
		document.getElementById('output').innerHTML += `
			<img id="titleNew" onclick="continueButton()" class="titleButton" style="left:`+titleButtons[0][0]+`%;" src="`+cleanupImage(`system/ui/buttonNew`)+`">
			<img id="titleLoad" class="titleButton" style="left:`+titleButtons[1][0]+`%; visibility:hidden;" src="`+cleanupImage(`system/ui/buttonContinue`)+`">
			<img id="titleSound" class="titleButton" onclick="omniToggle()"; style="left:`+titleButtons[2][0]+`%;" src="`+cleanupImage(`system/ui/buttonSound`)+`">
			<img id="titleMode" onclick="generateModHub()" class="titleButton" style="left:`+titleButtons[3][0]+`%;" src="`+cleanupImage(`system/ui/button-mods`)+`">
		`;
		if (redraw != true) {
			nextSong = "pm-8-30"
			startMusic();
		}
		data.player.clothes = [
			{index: "Basic Haircut", category: "hair", filter: "", image: "player/hair/basic-mascFront"},
			{index: "Sneakers", category: "footwear", filter: "", image: "player/footwear/sneakers"},
			{index: "Shorts", category: "lowerwear", filter: "", image: "player/lowerwear/shorts-penis", tags: "covering"},
			{index: "Shirt", category: "upperwear", filter: "", image: "player/upperwear/shirt-masc"},
		];
		//Places the genital anchor, so a new game starts in the same shape a migrated save does
		data.player.clothes = migrateClothes(data.player.clothes);
	}
	else {//If the player loaded their save properly
		document.getElementById('output').innerHTML += `
			<img id="titleNew" onclick="restartButton()" class="titleButton" style="left:`+titleButtons[1][0]+`%; filter:hue-rotate(170deg);" src="`+cleanupImage(`system/ui/buttonNew`)+`">
			<img id="titleLoad" onclick="continueButton()" class="titleButton" style="left:`+titleButtons[0][0]+`%;" src="`+cleanupImage(`system/ui/buttonContinue`)+`">
			<img id="titleSound" class="titleButton" onclick="omniToggle()"; style="left:`+titleButtons[2][0]+`%;" src="`+cleanupImage(`system/ui/buttonSound`)+`">
			<img id="titleMode" onclick="generateModHub()" class="titleButton" style="left:`+titleButtons[3][0]+`%;" src="`+cleanupImage(`system/ui/button-mods`)+`">
		`;
		if (redraw != true) {
			startMusic();
		}
	}
	//Hidden Honeycomb Catacombs launcher: an invisible square in the title's top-left corner. Only drawn
	//when honeycomb.js is loaded, so removing Honeycomb leaves nothing behind here.
	if (typeof honeycombBoot === "function") {
		document.getElementById('output').innerHTML += `
			<div id="titleHoneycomb" onclick="honeycombBoot()" style="position:fixed; left:0; top:0; width:48px; height:48px; opacity:0; z-index:50;"></div>
		`;
	}
	//The Honeycomb play button: Honeycomb's own dark plate and gold frame, so it reads as a separate
	//game. It shares .titleButton for the rise and the hover dimming; the rest is inline so style.css
	//is untouched. The art goes through honeycomb.image, the one path to Honeycomb's image folder.
	if (titleHoneycombBox != null) {
		//Single quotes: this sits inside a double-quoted style attribute
		var honeycombArt = `url('` + honeycomb.image("ui/buttonFrontGold") + `'), url('` + honeycomb.image("ui/buttonBack") + `')`;
		document.getElementById('output').innerHTML += `
			<div id="titleHoneycombButton" class="titleButton" onclick="honeycombBoot()" style="
				left:` + titleHoneycombBox.left + `%; width:` + titleHoneycombBox.width + `%; height:` + titleHoneycombBox.height + `px;
				background-image:` + honeycombArt + `; background-size:100% 100%; background-repeat:no-repeat;
				display:flex; align-items:center; justify-content:center; box-sizing:border-box;
				font-family:var(--font-display); font-size:` + titleHoneycombBox.fontSize + `px; letter-spacing:0.06em;
				color:#f4d98c; text-shadow:0 2px 3px #000; text-transform:uppercase; white-space:nowrap; user-select:none;
			">Honeycomb Catacombs</div>
		`;
		if (titleHoneycombBox.pillWidth != null) {
			["titleNew", "titleLoad", "titleSound", "titleMode"].forEach(function (id) {
				document.getElementById(id).style.width = titleHoneycombBox.pillWidth + "%";
			});
		}
	}
	for (x = 0; x < titleResult.length; x++) {
		var top = titleResult[x][2]+30;
		if (titleResult[x][0] == "version") {
			var titleVersion = "v"+version;
			document.getElementById('titleLetterHolder').innerHTML +=`
				<span id="titleLetter`+x+`" class="titleLetter bounce" onclick="generateWindow('changelog')" style="text-decoration:underline;cursor:pointer;left:`+titleResult[x][1]+`%; top:-`+top+`%; rotate:20deg; color:#509cea; font-size:`+titleFontSize+`;">`+titleVersion+`</span>
			`;
		}
		else {
			document.getElementById('titleLetterHolder').innerHTML +=`
				<span id="titleLetter`+x+`" class="titleLetter bounce" style="left:`+titleResult[x][1]+`%; top:-`+top+`%; rotate:20deg;">`+titleResult[x][0]+`</span>
			`;
		}
	}
	titleCounter = 0;
	titleStage = "Falling";
	if (redraw == true) {
		titleSettle();
	}
	//Dev preview: never start the animation chain. Everything above still runs (fresh-save
	//clothes, music, button layout), we just don't queue timeouts that would fire after startup()
	//has already moved us on to the previewed screen.
	else if (devPreviewActive() != true) {
		setTimeout(titleFall, 200);
	}
}

//Puts the backboard, buttons and letters straight into their final places. Setting titleCounter to the
//end also stops a fall animation from the earlier draw that is still queued.
function titleSettle() {
	titleCounter = titleResult.length;
	document.getElementById('titleBackboard').style.top = "0%";
	buttonsRise();
	for (var x = 0; x < titleResult.length; x++) {
		var letter = document.getElementById('titleLetter'+x);
		letter.style.top = titleResult[x][2]+"%";
		letter.style.rotate = titleResult[x][3]+"deg";
		letter.style.textShadow = "3px 3px #490400";
		letter.style.filter = "drop-shadow(5px 6px #490400)";
	}
}

//Lays the title out again when the screen turns, or when the title was drawn while the window measured
//0x0 (a hidden or not-yet-shown page), which leaves every button position as NaN. The stylesheet follows
//orientation by itself, but the title's button and letter positions are worked out in code. Skipped
//while Honeycomb covers the title (its exit redraws the title anyway) and during a dev preview.
var titleDrawnPortrait = null;
var titleDrawnWidth = 0;
window.addEventListener('resize', function () {
	if (document.getElementById('titleBackboard') == null) return;
	if (window.innerWidth == 0) return;
	var portrait = window.matchMedia('(orientation: portrait)').matches;
	if (portrait == titleDrawnPortrait && titleDrawnWidth > 0) return;
	if (devPreviewActive() == true) return;
	if (typeof honeycomb !== "undefined" && honeycomb.rootElement() != null) return;
	generateTitle(true);
});

function titleFall() {
	if (document.getElementById('titleBackboard')) {
		document.getElementById('titleBackboard').style.top = "0%";
		setTimeout(blocksFall, 2000);
		setTimeout(buttonsRise, 350);
		setTimeout(titleShakeStart, 3750);
	}
}

function titleShakeStart() {
	if (document.getElementById('titleBackboard')) {
		document.getElementById('titleBackboard').style.top = "2%";
		document.getElementById('titleBackboard').style.transition = "0.1s";
		setTimeout(titleShakeEnd, 100);
	}
}
function titleShakeEnd() {
	if (document.getElementById('titleBackboard')) {
		document.getElementById('titleBackboard').style.top = "0%";
	}
}

function buttonsRise() {
	if (document.getElementById('titleBackboard')) {
		document.getElementById('titleNew').style.top = titleButtons[0][1]+"%";
		document.getElementById('titleLoad').style.top = titleButtons[1][1]+"%";
		document.getElementById('titleSound').style.top = titleButtons[2][1]+"%";
		//Was outside the titleBackboard guard: if the scene changed before this timeout fired,
		//titleMode is gone and this threw a null TypeError.
		if (drawModeButton == true) {
			document.getElementById('titleMode').style.top = titleButtons[3][1]+"%";
		}
		if (titleHoneycombBox != null && document.getElementById('titleHoneycombButton')) {
			document.getElementById('titleHoneycombButton').style.top = titleHoneycombBox.top+"%";
		}
	}
}

function blocksFall() {
	if (document.getElementById('titleBackboard')) {
		if (titleCounter < 5) {
			var timer = 300;
		}
		else {
			var timer = 0;
		}
		if (titleCounter < titleResult.length) {
			document.getElementById('titleLetter'+titleCounter).style.top = titleResult[titleCounter][2]+"%";
			setTimeout(blocksBounceStart, 100, titleCounter);
			titleCounter += 1;
			setTimeout(blocksFall, timer);
		}
	}
}

function blocksBounceStart(target) {
	if (document.getElementById('titleBackboard')) {
		var top = titleResult[target][2]-15;
		var rotate = titleResult[target][3]+5;
		document.getElementById('titleLetter'+target).style.transition = "top 0.1s, rotate 0.1s";
		document.getElementById('titleLetter'+target).style.top = top+"%";
		document.getElementById('titleLetter'+target).style.rotate = rotate+"deg";
		document.getElementById('titleLetter'+target).style.textShadow = "3px 3px #490400";
		document.getElementById('titleLetter'+target).style.filter = "drop-shadow(5px 6px #490400)";
		setTimeout(blocksBounceEnd, 100, target);
	}
}

function blocksBounceEnd(target) {
	if (document.getElementById('titleBackboard')) {
		var top = titleResult[target][2];
		var rotate = titleResult[target][3];
		document.getElementById('titleLetter'+target).style.top = top+"%";
		document.getElementById('titleLetter'+target).style.rotate = rotate+"deg";
		if (soundDisabled != true) {
			var popSound = new Audio('sound/sfx/pop.mp3');
			popSound.play();
		}
	}
}

function restartButton() {
	var restart = confirm ("restart the game?");
	if (restart == true) {
		loadSlot(11);
		data = dataBackup;
		loadCoreCharacters();
		basicDefinitions();
		initializeArrays();
		for (i = 0; i < globalShopArray.length; i++) {
			if (data.player.collected.includes(globalShopArray[i].key+",")) {
				console.log("Collection test found that "+globalShopArray[i].index+" has already been collected");
				globalShopArray[i].collected = true;
			}
			else {
				globalShopArray[i].collected = false;
			}
		}
		for (i = 0; i < globalMorningArray.length; i++) {
			if (data.player.collected.includes(globalMorningArray[i].key+",")) {
				console.log("Collection test found that "+globalMorningArray[i].index+" has already been collected");
				globalMorningArray[i].collected = true;
			}
			else {
				globalMorningArray[i].collected = false;
			}
		}
		for (i = 0; i < globalPickupArray.length; i++) {
			if (data.player.collected.includes(globalPickupArray[i].key+",")) {
				console.log("Collection test found that "+globalPickupArray[i].index+" has already been collected");
				globalPickupArray[i].collected = true;
			}
			else {
				globalPickupArray[i].collected = false;
			}
		}
		writeScene("system", "start")
	}
}

function continueButton() {
	//Code for handling some unset variables (save data backwords compatibility)
	if (data.player.gatherLog == null) {
		data.player.gatherLog = [];
	}
	if (data.player.pickupLog == null) {
		data.player.pickupLog = [];
	}
	if (data.player.shopLog == null) {
		data.player.shopLog = [];
	}
	if (data.player.morningLog == null) {
		data.player.morningLog = [];
	}
	//Cleanup for older saves having mary-lou as nude by default
	if (checkTrust("milf") == 0) {
		changeOutfit("milf", "clothed permanent");
	}

	//Cleanup for if player saved while in the gallery
	removeFlag("player", "gallery");

	//Open the side menu
	openButton();

	//Cleanup for any errors in the global shop array
	for (i = 0; i < globalShopArray.length; i++) {
		globalShopArray[i].requirements += "!item "+globalShopArray[i].index+";";
	}
	for (i = 0; i < globalShopArray.length; i++) {
		if (data.player.collected.includes(globalShopArray[i].key+",")) {
			console.log("Collection test found that "+globalShopArray[i].index+" has already been collected");
			//globalShopArray[i].collected = true;
		}
		else {
			globalShopArray[i].collected = false;
		}
	}
	//Cleanup for any errors in the global morning array
	for (i = 0; i < globalMorningArray.length; i++) {
		if (data.player.collected.includes(globalMorningArray[i].key)) {
			console.log("Collection test found that "+globalMorningArray[i].index+" has already been collected");
			//globalMorningArray[i].collected = true;
			var logEntry = [globalMorningArray[i].index, 0];
			data.player.morningLog.push(logEntry);
			data.player.collected.replace(globalMorningArray[i].key, "");
		}
		else {
			globalMorningArray[i].collected = false;
		}
	}
	cullRepeatMorningLogs();

	//Cleanup for any errors in the global pickup array
	for (i = 0; i < globalPickupArray.length; i++) {
		if (data.player.collected.includes(globalPickupArray[i].key)) {
			console.log("Collection test found that "+globalPickupArray[i].index+" has already been collected");
			//globalPickupArray[i].collected = true;
			var logEntry = [globalPickupArray[i].index, 0];
			data.player.gatherLog.push(logEntry);
			data.player.collected.replace(globalPickupArray[i].key, "");
		}
		else {
			globalPickupArray[i].collected = false;
		}
	}
	for (i = 0; i < globalEventArray.length; i++) {
		for (j = 0; j < globalEventArray[i].events.length; j++) {
			if (globalEventArray[i].events[j].tags == null) {
				globalEventArray[i].events[j].tags = "";
			}
		}
	}
	cullRepeatGatherLogs();

	//Cleanup for older saves using a bad inventory structure
	inventoryCleanup();
	//Function to ensure mayor status reflects her lust
	mayorCheck();
	//Function to ensure faster jiggy additions to the minigame
	collectablesCleanup();
	if (doeRemoved == false) {
		//Edge case for older mods where no quick jiggy function
		if (typeof quickJiggyAdd === "function") {
			quickJiggyAdd();
		}
		else {
			alert("Older version of the content restoration mod detected, please uninstall it.")
		}
	}
	quickerJiggyAdd();
	checkMailbox();
	checkTV()
	//Move all encounters with character: "system" to the bottom of the globalEncounterArray
	for (i = 0; i < globalEncounterArray.length; i++) {
		if (globalEncounterArray[i].character == "system") {
			var tempEncounter = globalEncounterArray[i];
			globalEncounterArray.splice(i, 1);
			globalEncounterArray.push(tempEncounter);
		}
	}

	//Ensures players who saved in the intro don't skip something
	if (data.player.location == "") {
		writeScene("system", "intro0")
		checkFetishes();
	}
	else {
		if (data.player.filters == null || data.player.filters == undefined || data.player.filters.length != contentArray.length) {
			writeSpecial("New content filters have been added! Go to the settings menu to enable / disable them.");
		}
		changeLocation(data.player.location)
		//Function to ensure that all fetishes are initialized and accurate to in-game settings
		checkFetishes();
	}
	minSkill();
	for (requirementListIndex = 0; requirementListIndex < possibleTargets.length; requirementListIndex++) {
		buildPossibleRequirementsList(possibleTargets[requirementListIndex].index);
	}
	cullRepeatGlobalArrays();
}

function introFunction(n, m) {
	//General purpose intro function for writing usual things used in the intro
	switch (n) {
		case "introSkip": {
			document.getElementById('output').innerHTML = ``;
			removeFlag("player", "intro");
			writeCenteredText("You've chosen to skip the game's introduction! This will skip your first meeting with several characters and your tour of the museum.")
			writeHTML(`button Go back!; writeScene('intro0') color red;`)
			writeCenteredText("Your name is <input type='text' id='nameSubmission-player' value='Yu'>")
			writeCenteredText("What do you look like?")
			document.getElementById('output').innerHTML += `
				<div id="playerLogbookFrame">
				</div>
			`;
			var buttonWidth = "max-width: var(--title-btn-maxw, 40%);";
			document.getElementById('output').innerHTML += `
				<div class="galleryGrid" id="galleryGrid" style="display:grid; grid-template-columns:1fr 1fr 1fr;margin-bottom:20px;">
					<div id = "buttonsLeft" class="buttonsLeft">
					</div>
					<div id="imageMiddle">
					</div>
					<div id = "buttonsRight" class="buttonsRight">
					</div>
				</div>
			`;
			introFunction("genderCleanup")
			document.getElementById('output').innerHTML += `
			<p class = "centeredText">You may select a mode to disable certain characters, depending on your tastes:</p>
				<div class="galleryGrid" id="galleryGrid" style="display:grid; grid-template-columns:1fr 1fr;">
					<div class="pictureButton" onclick="introFunction('tasteSwitch', 'vegetarian')"style="position:relative;max-width: 50%;">Vegetarian Mode</div>
					<div class="pictureButton" onclick="introFunction('tasteSwitch', 'carnivore')"style="position:relative;max-width: 50%;">Carnivore Mode</div>
				</div>
			`;
			introFunction("tasteCleanup")
			break;
		}
		case "introFinish": {
			if (data.player.carnivore == true && data.player.vegetarian == true) {
				data.player.carnivore = false;
				data.player.vegetarian = false;
				writeScene("system", "introVegan");
			}
			else {
				data.player.day = 2;
				data.player.location = "playerHouse";
				addFlag("mayor", "chName");
				addFlag("mayor", "chSex");
				addFlag("foxf", "intro");
				setTrust("mayor", 1);
				setTrust("carpenter", 1);
				setTrust("shopkeep", 1);
				if (data.player.carnivore != true) {
					//If they are not a carnivore, give them the veggie fox jiggy
					addItem("jiggy-125v");
					addItem('foxfPog');
					setTrust("foxf", 1);
					
					//If they are not a carnivore, set system characters to female by default
					addFlag("mayor", "veggie");
					addFlag("carpenter", "veggie");
					addFlag("shopkeep", "veggie");
				}
				if (data.player.vegetarian != true) {
					//If they are not a vegetarian, give them the meaty fox jiggy
					addItem('foxmPog');
					addItem("jiggy-125c");
					setTrust("foxm", 1);
				}
				if (checkFlag("mayor", "veggie") != true) {
					addFlag("mayor", "meat");
					addFlag("carpenter", "meat");
					addFlag("shopkeep", "meat");
				}
				document.getElementById('output').innerHTML = '';
				wrapper.scrollTop = 0;
	
				writeHTML(`
					player sleep Mmm... Morning already? I feel like I've been asleep for ages...
					t Since the intro was skipped, the <b>New Name</b> cheat code have been enabled by default, allowing you to rename and swap sexes of system characters in mayorF's office.
					special All items obtained from the intro have been added to your inventory!
					special All preferences have finished being set! Be sure to customize more fetish preferences in the settings menu to disable content such as rimming if desired, or to change the gender of mayorF, carpenterF, and shopkeepF.
					finish
					eval checkFetishes();
					eval addFlag("player", "easyJiggy");
				`)
			}
			break;
		}
		case "genderSelect": {
			writeCenteredText("Your name is <input type='text' id='nameSubmission-player' value='Yu'>")
			writeCenteredText("What do you look like?")
			document.getElementById('output').innerHTML += `
				<div id="playerLogbookFrame">
				</div>
			`;
			var buttonWidth = "max-width: var(--title-btn-maxw, 40%);";
			document.getElementById('output').innerHTML += `
				<div class="galleryGrid" id="galleryGrid" style="display:grid; grid-template-columns:1fr 1fr 1fr;margin-bottom:20px;">
					<div id = "buttonsLeft" class="buttonsLeft">
					</div>
					<div id="imageMiddle">
					</div>
					<div id = "buttonsRight" class="buttonsRight">
					</div>
				</div>
			`;
			introFunction("genderCleanup")
			writeHTML(`button Continue; renameCharacter('intro2')`)
			break;
		}
		case "genderSwitch": {
			data.player.gender = m;
			introFunction("genderCleanup")
			break;
		}
		case "skinSwitch": {
			data.player.skin = m;
			introFunction("genderCleanup")
			break;
		}
		case "genitalsSwitch": {
			//data.player.genitals = m;
			introFunction("genderCleanup")
			break;
		}
		case "genderCleanup": {
			if (document.getElementById("imageMiddle")) {
				document.getElementById("imageMiddle").innerHTML = ``
			}
			var imageSize = "var(--title-img-h, 500px)";
			//The creator used to redraw the player by hand here, with its own copy of the genital
			//logic and no clothing tag handling at all. It calls the real renderer now, so the
			//preview cannot drift from what the rest of the game shows.
			document.getElementById("imageMiddle").innerHTML += `<div id="wardrobe-Item" class = "selfImage" style="margin:auto;border-radius:25px;aspect-ratio:1/2;position:relative;background: #000;height: `+imageSize+`;"></div>`;
			document.getElementById(`wardrobe-Item`).innerHTML = drawPlayer("playerSelf;expression:happy;");
			document.getElementById(`imageMiddle`).innerHTML+= `<div id="buttonList"></div>`;

			//Printed once, rather than rebuilt on every pass of the old clothing loop, which
			//meant a player wearing nothing at all got no body buttons
			var buttonWidth = "max-width: var(--title-btn-maxw, 40%);";
			document.getElementById('buttonsLeft').innerHTML = `<div class="pictureButton" onclick="introFunction('genderSwitch', 'masc')"style="position:relative;width:100%;aspect-ratio:7/5;`+buttonWidth+`">Masculine Body</div>`;
			document.getElementById('buttonsRight').innerHTML = `<div class="pictureButton" onclick="introFunction('genderSwitch', 'fem')"style="position:relative;width:100%;aspect-ratio:7/5;`+buttonWidth+`">Feminine Body</div>`;
			document.getElementById('buttonsLeft').innerHTML += `<div class="pictureButton" onclick="introFunction('genitalsSwitch', 'penis')"style="position:relative;width:100%;aspect-ratio:7/5;`+buttonWidth+`">Penis</div>`;
			document.getElementById('buttonsRight').innerHTML += `<div class="pictureButton" onclick="introFunction('genitalsSwitch', 'pussy')"style="position:relative;width:100%;aspect-ratio:7/5;`+buttonWidth+`">Not Yet Implemented</div>`;
			switch (data.player.skin) {
				case "light": {
					document.getElementById('buttonsRight').innerHTML += `<div class="pictureButton" onclick="introFunction('skinSwitch', 'tan')"style="position:relative;width:100%;aspect-ratio:7/5;`+buttonWidth+`">Darker Skin</div>`;
					break;
				}
				case "tan": {
					document.getElementById('buttonsLeft').innerHTML += `<div class="pictureButton" onclick="introFunction('skinSwitch', 'light')"style="position:relative;width:100%;aspect-ratio:7/5;`+buttonWidth+`">Lighter Skin</div>`;
					document.getElementById('buttonsRight').innerHTML += `<div class="pictureButton" onclick="introFunction('skinSwitch', 'dark')"style="position:relative;width:100%;aspect-ratio:7/5;`+buttonWidth+`">Darker Skin</div>`;
					break;
				}
				case "dark": {
					document.getElementById('buttonsLeft').innerHTML += `<div class="pictureButton" onclick="introFunction('skinSwitch', 'tan')"style="position:relative;width:100%;aspect-ratio:7/5;`+buttonWidth+`">Lighter Skin</div>`;
					break;
				}
			}
			updateMenu();
			break;
		}
		case "tasteSelect": {
			document.getElementById('output').innerHTML += `
			<p class = "centeredText">You may select a mode to disable certain characters, depending on your tastes:</p>
				<div class="galleryGrid" id="galleryGrid" style="display:grid; grid-template-columns:1fr 1fr;">
					<div class="pictureButton" onclick="introFunction('tasteSwitch', 'vegetarian')"style="position:relative;max-width: 50%;">Vegetarian Mode</div>
					<div class="pictureButton" onclick="introFunction('tasteSwitch', 'carnivore')"style="position:relative;max-width: 50%;">Carnivore Mode</div>
				</div>
			`;
			introFunction("tasteCleanup")
			break;
		}
		case "tasteSwitch": {
			if (m == "carnivore") {
				if (data.player.carnivore == true) {
					data.player.carnivore = false;
				}
				else {
					data.player.carnivore = true;
				}
			}
			if (m == "vegetarian") {
				if (data.player.vegetarian == true) {
					data.player.vegetarian = false;
				}
				else {
					data.player.vegetarian = true;
				}
			}
			introFunction("tasteCleanup")
			updateMenu();
			break;
		}
		case "tasteCleanup": {
			if (document.getElementById("buttonArea")) {
				document.getElementById("buttonArea").innerHTML = ``
			}
			else {
				document.getElementById('output').innerHTML += `<div id="buttonArea"></div>`;
			}
			document.getElementById('buttonArea').innerHTML += `
				<div id="buttonGrid" style="position:relative;height:var(--title-btngrid-h, 130px);">
				</div>
			`;
			var disabledCount = 0;
			var characterTotal = 0;
			for (i = 0; i < data.story.length; i++) {
				if (countScenes(data.story[i].index)[1] != 0) {
					var printCharacter = true;
					characterTotal++
					var finalExpression = "happy";
					var finalBrightness = "100%"
					if (data.player.vegetarian == true || data.player.carnivore == true) {
						if (data.story[i].index == "doe" || data.story[i].index == "mommy") {
							printCharacter = false;
						}
					}
					if (data.story[i].gender == "female" && data.player.carnivore == true) {
						printCharacter = false;
					}
					if (data.story[i].gender == "male" && data.player.vegetarian == true) {
						printCharacter = false;
					}
					if (data.player.carnivore == true && data.player.vegetarian == true) {
						printCharacter = false;
					}
					if (printCharacter == false) {
						finalExpression = "shock"
						finalBrightness = "30%"
						disabledCount++
					}
					var gridSize = "var(--title-grid-min, 175px)";
					document.getElementById('buttonGrid').style.display = "grid";
					document.getElementById('buttonGrid').style.height = "initial";
					document.getElementById('buttonGrid').style.gridTemplateColumns = "repeat(auto-fill, minmax("+gridSize+", 1fr))";
					var charType = "old"
					for (neoCharIndex = 0; neoCharIndex < finishedCharactersArray.length; neoCharIndex++) {
						if (finishedCharactersArray[neoCharIndex] == data.story[i].index) {
							//console.info("neoCharIndex: "+neoCharIndex);
							charType = "new";
						}
					}
					if (charType == "new") {
						document.getElementById('buttonGrid').innerHTML += `
							<div id = "outfitThumb`+data.story[i].index+`" class="thumbnailBorder syrup" style="filter:brightness(`+finalBrightness+`);position:relative;border:5px solid #FCEBB5;border-radius:15px;overflow:hidden;cursor:pointer;">
								`+drawCharacter(data.story[i].index, "class: thumbnailImage syrup;emotion:"+finalExpression+";")+`
							</div>
						`;
					}
					else {
						document.getElementById('buttonGrid').innerHTML += `
							<div id = "outfitThumb`+data.story[i].index+`" class="thumbnailBorder syrup" style="filter:brightness(`+finalBrightness+`);position:relative;border:5px solid #FCEBB5;border-radius:15px;overflow:hidden;cursor:pointer;">
								<img class="thumbnailImage syrup" src="`+cleanupImage(data.story[i].index+"/"+data.story[i].outfit+"/"+finalExpression)+`">
							</div>
						`;
					}
				}
			}
			if (data.player.carnivore == true && data.player.vegetarian != true) {
				document.getElementById('buttonArea').innerHTML += `<p class = "centeredText">You are a carnivore! Characters with pussies will not appear, the game will be a meat buffet!</p>`;
				document.getElementById('buttonArea').innerHTML += `<p class = "centeredText">`+disabledCount+` of `+characterTotal+` characters have been disabled, and will not appear!</p>`;
			}
			if (data.player.vegetarian == true && data.player.carnivore != true) {
				document.getElementById('buttonArea').innerHTML += `<p class = "centeredText">You are a vegetarian! Characters with dicks will not appear, the game will be a meat-free experience!</p>`;
				document.getElementById('buttonArea').innerHTML += `<p class = "centeredText">`+disabledCount+` of `+characterTotal+` characters have been disabled, and will not appear!</p>`;
			}
			if (checkFlag("player", "intro") != true) {
				var targetScene = "introFinish";
			}
			if (checkFlag("player", "intro")) {
				var targetScene = "intro3";
			}
			if (data.player.vegetarian == true && data.player.carnivore == true) {
				document.getElementById('buttonArea').innerHTML += `
					<p class="choiceText" onclick="introFunction('introFinish')" style = "border-bottom: 3px solid #0593F8; color: #0593F8">Vegan Mode</p>
				`;
			}
			else {
				document.getElementById('buttonArea').innerHTML += `
					<p class="choiceText" onclick="renameCharacter('`+targetScene+`')"style = "border-bottom: 3px solid #0593F8; color: #0593F8">Continue</p>
				`;
			}
			break;
		}
		case "carpenter": {
			setTrust(n, 1);
			if (data.player.vegetarian == true && data.player.carnivore != true) {
				addFlag(n, "veggie");
				writeHTML(`im `+cleanupImage(n+"/logbook2v"))
				writeHTML(`button Continue; renameCharacter('intro2')`)
			}
			if (data.player.vegetarian != true && data.player.carnivore == true) {
				addFlag(n, "meat");
				writeHTML(`im `+cleanupImage(n+"/logbook2m"))
				writeHTML(`button Continue; renameCharacter('intro2')`)
			}
			if (data.player.vegetarian != true && data.player.carnivore != true) {
				writeHTML(`t What do they look like?`)
				document.getElementById('output').innerHTML += `
					<div class="galleryGrid" id="galleryGrid" style="display:grid; grid-template-columns:1fr 1fr;">
						<img class="bigPicture" src="`+cleanupImage(n+"/logbook2m")+`"
						onclick="introFunction('meatToggle', '`+n+`')",
						style="cursor:pointer;">
						<img class="bigPicture" src="`+cleanupImage(n+"/logbook2v")+`"
						onclick="introFunction('veggieToggle', '`+n+`')",
						style="cursor:pointer;">
					</div>
				`;
			}
			break;
		}
		case "shopkeep": {
			setTrust(n, 1);
			if (data.player.vegetarian == true && data.player.carnivore != true) {
				addFlag(n, "veggie");
				writeHTML(`im `+cleanupImage(n+"/introV"))
				writeHTML(`button Continue; renameCharacter('intro2')`)
			}
			if (data.player.vegetarian != true && data.player.carnivore == true) {
				addFlag(n, "meat");
				writeHTML(`im `+cleanupImage(n+"/introC"))
				writeHTML(`button Continue; renameCharacter('intro2')`)
			}
			if (data.player.vegetarian != true && data.player.carnivore != true) {
				writeHTML(`t What do they look like?`)
				document.getElementById('output').innerHTML += `
					<div class="galleryGrid" id="galleryGrid" style="display:grid; grid-template-columns:1fr 1fr;">
						<img class="bigPicture" src="`+cleanupImage(n+"/introC")+`"
						onclick="introFunction('meatToggle', '`+n+`')",
						style="cursor:pointer;">
						<img class="bigPicture" src="`+cleanupImage(n+"/introV")+`"
						onclick="introFunction('veggieToggle', '`+n+`')",
						style="cursor:pointer;">
					</div>
				`;
			}
			break;
		}
		case "mayor": {
			setTrust(n, 1);
			if (data.player.vegetarian == true && data.player.carnivore != true) {
				addFlag(n, "veggie");
				writeHTML(`im `+cleanupImage(n+"/logbook2v"))
				writeHTML(`button Continue; renameCharacter('intro2')`)
			}
			if (data.player.vegetarian != true && data.player.carnivore == true) {
				addFlag(n, "meat");
				writeHTML(`im `+cleanupImage(n+"/logbook2m"))
				writeHTML(`button Continue; renameCharacter('intro2')`)
			}
			if (data.player.vegetarian != true && data.player.carnivore != true) {
				writeHTML(`t What do they look like?`)
				document.getElementById('output').innerHTML += `
					<div class="galleryGrid" id="galleryGrid" style="display:grid; grid-template-columns:1fr 1fr;">
						<img class="bigPicture" src="`+cleanupImage(n+"/logbook2m")+`"
						onclick="introFunction('meatToggle', '`+n+`')",
						style="cursor:pointer;">
						<img class="bigPicture" src="`+cleanupImage(n+"/logbook2v")+`"
						onclick="introFunction('veggieToggle', '`+n+`')",
						style="cursor:pointer;">
					</div>
				`;
			}
			break;
		}
		case "meatToggle": {
			addFlag(m, "meat");
			renameCharacter("intro2");
			break;
		}
		case "veggieToggle": {
			addFlag(m, "veggie");
			renameCharacter("intro2");
			break;
		}
	}
}