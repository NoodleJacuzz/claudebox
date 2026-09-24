function generateLogbook() {
	if (isModding()) {
		tooltip("logbookSelect")
	};

	//Title
	document.getElementById('window').innerHTML += `
		<h1 id = "windowTitle" class = "windowTitle" onclick="deleteWindow()">LOGBOOK</h1>
		<div id = "logbookGridHolder" class="gridHolder" style="width: 100%;">
			<div id="phoneSelectionMenu" class="phoneSelectionMenu logbook">
			</div>
		</div>
	`;

	//Custom code option for when creating a mod.
	if (isModding()) {
		var finalColor = "#FCEBB5";
		var fontSizeModifier = 2;
		document.getElementById('phoneSelectionMenu').innerHTML += `
			<div class = "textBox" style="border: 3px solid `+finalColor+`" onclick = "generateWindow('customCode')">
				<img class = "textThumb" style="filter: drop-shadow(5px 2px `+finalColor+`);" src = "`+cleanupImage("images/none")+`">
				<div class="textBoxContent">
					<span style = "color: `+finalColor+`; font-size: `+fontSizeModifier+`rem" class = "selectionMenuText">Mod Details</span>
				</div>
			</div>
		`;
	}

	//The scrapbook sits alongside the character files rather than inside one, so it needs a cell
	//here as well as the side-menu button, or it can only be reached by opening someone first.
	if (checkFlag("player", "scrapbook") == true) {
		var scrapbookColor = "#FCEBB5";
		document.getElementById('phoneSelectionMenu').innerHTML += `
			<div class = "textBox" style="border: 3px solid `+scrapbookColor+`" onclick = "openScrapbook()">
				<img class = "textThumb" style="filter: drop-shadow(5px 2px `+scrapbookColor+`);" src = "`+cleanupImage("system/ui/scrapbook")+`" onerror="this.src=cleanupImage('images/none')">
				<div class="textBoxContent">
					<span style = "color: `+scrapbookColor+`; font-size: 2rem" class = "selectionMenuText">Scrapbook</span>
				</div>
			</div>
		`;
	}

	//Existing characters
	var logbookList = [];

	//Add core characters (if legal)
	for (i = 0; i < data.story.length; i++) {
		if (data.story[i].trust > 0 || checkFlag("player", "logbook")) {
			var pushChar = true;
			if (data.story[i].gender == "female" && data.player.carnivore == true) {
				pushChar = false;
			}
			if (data.story[i].gender == "male" && data.player.vegetarian == true) {
				pushChar = false;
			}
			if (doeRemoved == true) {
				if (data.story[i].index == "doe" || data.story[i].index == "mommy") {
					pushChar = false;
				}
			}
			if (pushChar == true) {
				logbookList.push(data.story[i]);
			}
		}
	}

	logbookList = logbookList.sort(compare);

	//Add custom characters (if any) to start
	if (storageArray.modName != "") {
		for (i = 0; i < storageArray.customCharacters.length; i++) {
			logbookList.unshift(storageArray.customCharacters[i]);
		}
	}

	//Print characters
	for (i = 0; i < logbookList.length; i++) {
		var charType = "old"
		for (neoCharIndex = 0; neoCharIndex < finishedCharactersArray.length; neoCharIndex++) {
			if (finishedCharactersArray[neoCharIndex] == logbookList[i].index) {
				//console.info("neoCharIndex: "+neoCharIndex);
				charType = "new";
			}
		}
		var finalName = logbookList[i].fName;
		var finalColor = logbookList[i].color;
		var sceneCount = countScenes(logbookList[i].index);
		if (sceneCount[0] == sceneCount[1] && sceneCount[1] > 0) {
			finalColor = "#ffffff";
			finalName += ` <span style="color:white;">- ♔</span>`;
		}
		var fontSizeModifier = 2
		if (logbookList[i].fName.length > 9) {
			fontSizeModifier = 1.5
		}
		var outfitSystemMod = logbookList[i].outfitDefault;
		if (logbookList[i].index == "mayor" && checkFlag("mayor", "meat") == true) {
			outfitSystemMod += "-meat";
		}
		if (logbookList[i].index == "carpenter" && checkFlag("carpenter", "meat") == true) {
			outfitSystemMod += "-meat";
		}
		if (logbookList[i].index == "shopkeep" && checkFlag("shopkeep", "meat") == true) {
			outfitSystemMod += "-meat";
		}
		//console.info(charType)
		if (charType == "old") {
			//console.info(logbookList[i])
			var finalThumbnail = logbookList[i].index+`/`+outfitSystemMod+`/`+logbookList[i].emotionDefault
			finalThumbnail = cleanupImage(finalThumbnail);
			//console.info(finalThumbnail)
			var finalBackup = `images-${imageFormat}/`+logbookList[i].index+`/`+outfitSystemMod+`/`+logbookList[i].emotionDefault+`.`+imageBackup
			document.getElementById('phoneSelectionMenu').innerHTML += `
				<div class = "textBox" style="border: 3px solid `+finalColor+`" onclick = "generateNav('`+logbookList[i].index+`')">
					<img class = "textThumb" style="filter: drop-shadow(5px 2px `+finalColor+`);" src = "${finalThumbnail}">
					<div class="textBoxContent">
						<span style = "color: `+finalColor+`; font-size: `+fontSizeModifier+`rem" class = "selectionMenuText">`+finalName+`</span>
					</div>
				</div>
			`;
		}
		if (charType == "new") {
			document.getElementById('phoneSelectionMenu').innerHTML += `
				<div id="charLogbookFrame(`+logbookList[i].index+`)" class = "textBox" style="border: 3px solid `+finalColor+`;" onclick = "generateNav('`+logbookList[i].index+`')">
				</div>
			`;
			document.getElementById('charLogbookFrame('+logbookList[i].index+')').innerHTML += drawCharacter(logbookList[i].index, "textThumb;");
			document.getElementById('charLogbookFrame('+logbookList[i].index+')').innerHTML+= `
				<div class="textBoxContent">
					<span style = "color: `+finalColor+`;";" class = "selectionMenuText">`+finalName+`</span>
				</div>
			`;
		}
	}
	
	document.getElementById('phoneSelectionMenu').innerHTML += `
		<div id="playerLogbookFrame" class = "textBox" style="border: 3px solid `+data.player.color+`;" onclick = "generateNav('player')">
		</div>
	`;
	document.getElementById('playerLogbookFrame').innerHTML += drawPlayer("textThumb;");
	document.getElementById('playerLogbookFrame').innerHTML+= `
	<div class="textBoxContent">
				<span style = "color: `+data.player.color+`;";" class = "selectionMenuText">You</span>
			</div>
	`
}

function fasterModTest() {
storageArray = {
	modName: "test", 
	authorName: "Noodle Jacuzzi", 
	modDesc: "Lorem ipsum dosem", 
	customItems: [
		{index: "Test Clothing", category: "upperwear", filter: "", image: "test/1b", value: 0,},
		{category: `jiggy`, set: "Misc", index: `Test Jiggy`, image: `test/2b`, value: 0, pieces: 100, name: `Test Magazine`, desc: `Testing some items having varying fields.`, requirements: `?item holoMagazine1;`, tags: "female",},
	], 
	customCollectables: [
		{category: `jiggy`, set: "Misc", index: `Test Jiggy`, image: `test/2b`, value: 0, pieces: 100, name: `Test Magazine`, desc: `Testing some items having varying fields.`, requirements: `?item holoMagazine1;`, tags: "female",},
	], 
	customCharacters: [
		{
			index: "test", fName: "Placeholder", lName: "", color: "#FFFFFF", outfit: "expressions", outfitDefault: "expressions", emotion: "happy", emotionDefault: "happy", trust: 0, flags: "", encountered: false, author: "Noodle Jacuzzi", gender: "", 
			logbook: [
				{index:"test", content:"im test/1b; title Placeholder Logbook Entry; This is where the logbook's text would go, provided you met all the logbook's hidden conditions. !trust test 1; ?trustMax test 2;"},
				{index:"test", content:"im test/2b; title Placeholder Logbook Entry; This is where the logbook's text would go, provided you met all the logbook's hidden conditions. !trust test 1; ?trustMax test 2;"},
			], 
			expressions: [
				"happy", "sad", "angry"
			], 
			trophies: [
				{index:"placeholder", frame: "ultraRare", name: "Test Trophy", requirements: "?flag test victory;", description: "Placeholder hint text", image: "test/1b",},
			], 
			sales: [
				{index: "shopEventTest", name: "Shop event test", price: 1, unique: true, event: true, requirements: "?location store;", image: "images-webp/mayor/nude/happy.webp", desc: "Test refreshing the shop",},
				{index: "inventoryTest", name: "Inventory Test", price: 0, unique: false, event: true, requirements: "?location store;", image: "images-webp/mayor/nude/happy.webp", desc: "Add a bunch of items and junk for testing",},
			], 
			pickups: [
				{index: "fruitGeneric", requirements: "?location lavenderLane;", top: 0, left: 0, size: 20, image: "fruit/generic"},
			], 
			mornings: [
				{index: "mayorMorning-mesu", priority: 1, requirements: "?trustMin mayor 1;", unique: true,},
			], 
			encounters: [
				{"index": "testEncounter1",
					"name": "27 years ago I saw horrors",
					"type": "standard",
					"requirements": "?location playerHouse; ?trust test 3;",
					"altImage": "images/test/encounters/carpenterSnooze2Veggie-2.webp",
					"altName": "Joe mama"
				},
			],
			scenes: [
				{index: `intro1`,
				content: `
					t You step inside of the town hall and after a short bit of searching you find the mayor's office.
					player worried Hello?
					t A lady at her desk notices you, stands, and smiles warmly.
					finish
				`,},
			], 
			events: [
				{index: "mayorMorning-2", name: "Mayor in the Morning 1", image: "test/2b",
				content: `
					t It's time for the morning mailbox, but the host is otherwise occupied. ?flag test testFlag;
					im test/2b
				`},
			], 
			walls: [], 
			repeatables: [], 
			house: {location: ""},
		},
	], 
	customLocations: [
		{
		  "index": "newLocation",
		  "name": "newLocation",
		  "image": "test/1b",
		  "buttons": []
		}
	], 
	customTravel: [
		{"top": 10, "left": 10, "requirements": " ?location museumExterior;", "name": "Go to a new place", "index": "newLocation", "_isEditingItem": false, "_isEditing": false},
		{"top": 0, "left": 20, "requirements": " ?location newLocation;", "name": "Leave the new place", "index": "museumExterior", "_isEditing": false},
	], 
	customCode: `console.info("Yo dayo");\n
\n
console.info("Spacing test");`
};

placeholderImage(
	"test/1b",
	"images-webp/placeholder/expressions/happy.webp"
);
placeholderImage(
	"test/2b",
	"images-webp/placeholder/expressions/angry.webp"
);
placeholderImage(
	"unlawfulOrphan",
	"images-webp/placeholder/expressions/angry.webp"
);
placeholderImage(
	"test/undesiredOrphan",
	"images-webp/placeholder/expressions/angry.webp"
);


	/*
	storageArray.modName = "testMod";
	storageArray.authorName = "testAuthor";
	debugMode = true;
	var newCustomCharacter = {index: "test", fName: "Placeholder", lName: "", color: "#FFFFFF", outfit: "expressions", outfitDefault: "expressions", emotion: "happy", emotionDefault: "happy", trust: 0, flags: "", encountered: false, author: storageArray.authorName, gender: "", 
    logbook: [
		{index:"test", content:"im images/mayor/bath1Meat; title Cheery; The redheaded mayor of Syrup Town, mayorF is known to be patient and thoughtful, but she's also very much an overthinker.She works out of her office on Pineapple Plaza, and most nights she sleeps there too! !trust test 1; !trust test 1; ?flag mayor fat;"},
	], 
	expressions: [], 
	trophies: [], 
	sales: [], 
	pickups: [], 
	mornings: [], 
	encounters: [
		{"index": "testEncounter1",
			"name": "27 years ago I saw horrors",
			"type": "standard",
			"requirements": "?location playerHouse; ?trust test 3;",
			"altImage": "images/test/encounters/carpenterSnooze2Veggie-2.webp",
			"altName": "Joe mama"
		},
	],
	scenes: [], 
	events: [], 
	walls: [], 
	repeatables: [], 
	house: {location: ""},};
	for (var expressionIndex = 0; expressionIndex < expressionArray.length; expressionIndex++) {
		newCustomCharacter.expressions.push(expressionArray[expressionIndex].index);
		placeholderImage(
			"test/expressions/"+expressionArray[expressionIndex].index,
			"images-webp/placeholder/expressions/"+expressionArray[expressionIndex].index+".webp"
		);
	}
	storageArray.customCharacters.push(newCustomCharacter);
	*/

    targetCharactersList.push("test");
}

function generateNav(target) {
	deleteWindow();
	generateWindow("logbook");
	document.getElementById('logbookLeft').innerHTML = '';
	
	//Populate the side menu
	document.getElementById('logbookLeft').innerHTML += `<h3 class = "button" style = "color: `+data.player.color+`;" onclick = "switchDesc('player');">You</h3>`;
	//The scrapbook is its own window rather than a logbook page, so this closes the logbook on
	//the way through. Only offered once the player has the flag that makes saving possible.
	if (checkFlag("player", "scrapbook") == true) {
		document.getElementById('logbookLeft').innerHTML += `<h3 class = "button" style = "color: #FCEBB5;" onclick = "openScrapbook()">Scrapbook</h3>`;
	}
	for (i = 0; i < data.story.length; i++) {
		targetLogbookFile = data.story[i].index;
	}
	var logbookList = [];
	for (i = 0; i < data.story.length; i++) {
		if (data.story[i].trust > 0 || checkFlag("player", "logbook")) {
			var pushChar = true;
			if (data.story[i].gender == "female" && data.player.carnivore == true) {
				pushChar = false;
			}
			if (data.story[i].gender == "male" && data.player.vegetarian == true) {
				pushChar = false;
			}
			if (doeRemoved == true) {
				if (data.story[i].index == "doe" || data.story[i].index == "mommy") {
					pushChar = false;
				}
			}
			if (pushChar == true) {
				var goof = {index: data.story[i].index, fName: data.story[i].fName, color: data.story[i].color,};
				logbookList.push(goof);
			}
		}
	}
	//Add custom characters (if any) to start
	if (storageArray.modName != "") {
		for (i = 0; i < storageArray.customCharacters.length; i++) {
			logbookList.unshift(storageArray.customCharacters[i]);
		}
	}
	console.log(logbookList);
	logbookList = logbookList.sort(compare);
	console.log(logbookList);
	for (i = 0; i < logbookList.length; i++) {
		document.getElementById('logbookLeft').innerHTML += `<h3 class = "button" style = "color: `+logbookList[i].color+`" onclick = "switchDesc('`+logbookList[i].index+`')">` + logbookList[i].fName + `</h3>`;
	}
	switchDesc(target)
}

var currentDesc = "";
function switchDesc(target) {
	currentDesc = target;
	soundEffectStart("button");
	if (isModding(target)) {
		tooltip("logbookDesc")
	}
	
	//Populate the right side with the globalLogbookArray details loaded on startup
	if (target == "player") {
		document.getElementById('logbookRight').innerHTML = `
			<div id="selfImage" class="selfImage">
			</div>
		`;
		document.getElementById('selfImage').innerHTML+=drawPlayer("playerSelf;");
		if (data.player.skills == null) {
			data.player.skills = {};
		}
		if (checkSkill("fluff-lover") == false) {
			var newSkill = {index: "fluff-lover", level: 99};
			data.player.skills.unshift(newSkill);
		}
		if (checkSkill("stamina") == false) {
			var newSkill = {index: "stamina", level: 0};
			data.player.skills.push(newSkill);
		}
		if (checkSkill("dominance") == false) {
			var newSkill = {index: "dominance", level: 0};
			data.player.skills.push(newSkill);
		}
		minSkill();
		if (data.player.bonus == undefined) data.player.bonus = 0;
		var totalStamina = 30+checkSkill("stamina");
		if (data.player.bonus > 0) totalStamina += " + "+data.player.bonus + " temporary bonus.";
		document.getElementById('logbookRight').innerHTML += `
			<p class = "textName syrup" style = "color: `+data.player.color+`">`+data.player.name+`</p>
			<p class = "selfDesc">Syrup Town v`+version+`</p>
			<p class = "selfDesc">Day: `+data.player.day+`</p>
			<p class = "selfDesc">Time: `+data.player.time+`</p>
			<p class = "selfDesc">Muns: `+data.player.money+`</p>
			<p class = "selfDesc">Total Stamina: `+totalStamina+`</p>
			`+generateSkills('logbookRight')+`
			<p class = "selfDesc">A human in a new town.<br>Hopefully you'll make plenty of friends and huff plenty of fluff!</p>
		`;
		//<p class = "selfDesc">Skills: UAAAAAAAAAAAA SEEEEEEEEEEEEEEEEEEX!<br> UAAAAAAAAAAAAAAAAA!!!! SEEEEEEEEEEEEEEEEX!!!<br> I AM! I AM DOING SEX! MY- MY ENTIRE EXISTENCE HAS TRULY-<br>BECOME SEX!<br>I'VE BECOME SEX!</p>
	}
	else {
		var characterInStory = data.story.find(character => character.index === target);

		if (!characterInStory && storageArray.modName != "") {
			characterInStory = storageArray.customCharacters.find(character => character.index === target);
		}

		console.info(characterInStory)

		if (characterInStory) {
			var finalColor = characterInStory.color;
			var charType = "old"
			if (window.matchMedia('(orientation: portrait)').matches) {
				document.getElementById('logbookRight').innerHTML = `
					<div id="selfImage" class="selfImage" style="height: inherit;width: auto;">
					</div>
				`;
			}
			else {
				document.getElementById('logbookRight').innerHTML = `
					<div id="selfImage" class="selfImage" style="height: inherit;">
					</div>
				`;
			}
			for (neoCharIndex = 0; neoCharIndex < finishedCharactersArray.length; neoCharIndex++) {
				if (finishedCharactersArray[neoCharIndex] == characterInStory.index) {
					//console.info("neoCharIndex: "+neoCharIndex);
					charType = "new";
				}
			}
			if (charType == "new") {
				document.getElementById('selfImage').innerHTML+=drawCharacter(characterInStory.index, "class:thumbFull;");
			}
			else {
				//Get right side image
				var outfitSystemMod = characterInStory.outfitDefault;
				if (characterInStory.index == "mayor" && checkFlag("mayor", "meat") == true) {
					outfitSystemMod += "-meat";
				}
				if (characterInStory.index == "carpenter" && checkFlag("carpenter", "meat") == true) {
					outfitSystemMod += "-meat";
				}
				if (characterInStory.index == "shopkeep" && checkFlag("shopkeep", "meat") == true) {
					outfitSystemMod += "-meat";
				}
				var finalThumbnail = characterInStory.index+`/`+outfitSystemMod+`/`+characterInStory.emotionDefault
				finalThumbnail = cleanupImage(finalThumbnail);
				var finalBackup = ``
				if (charType == "new") {
					document.getElementById('selfImage').innerHTML = `
						<img id="playerSelf" class="playerSelf" onerror="javascript:this.src='`+finalBackup+`';" src="`+finalThumbnail+`">
					`;
				}
				else {
					document.getElementById('selfImage').innerHTML = `
						<img id="playerSelf" class="playerSelf" style="height:initial;" src="`+finalThumbnail+`">
					`;
				}
			}
			var finalName = characterInStory.fName
			var tabTrust = ``;
			if (characterInStory.trust > 10) {
				//tabTrust = ` - Friendly`;
			}
			var sceneCount = countScenes(characterInStory.index);
			if (isModding(characterInStory.index)) {
				printModLogbook(characterInStory);
			}
			else {
				if (sceneCount[0] == sceneCount[1] && sceneCount[1] > 0) {
					finalColor = "#ffffff";
					tabTrust = ` <span style="color:white;">- ♔ <b>Complete</b> ♔</span>`;
				}
				document.getElementById('logbookRight').innerHTML += `
					<div class=" lb_primary">
						<p class = "textName syrup" id="logbookName" style = "color: `+finalColor+`">`+characterInStory.fName+tabTrust+`</p>
					</div>
				`;
			}
			if (window.matchMedia('(orientation: portrait)').matches) {
				document.getElementById('selfImage').style.width = "100%";
				document.getElementById('selfImage').style.height = "inherit";
				document.getElementById('selfImage').style.maxHeight = "40vh";
				document.getElementById('selfImage').style.margin = "auto";
				document.getElementById('selfImage').style.display = "flex";
				document.getElementById('selfImage').style.justifyContent = "center";
				if (!isModding(target)) { 
					document.getElementById('logbookName').style.fontSize = "var(--fs-xlarge, 2em)";
				}
				
				document.getElementById('logbookName').style.textAlign = "center";
			}
			
			//Get central logbook information
			//Perform a for loop of the globalLogbookArray to find any entries where index matches the target
			for (i = 0; i < globalLogbookArray.length; i++) {
				if (globalLogbookArray[i].index == target) {
					if (checkRequirements(globalLogbookArray[i].content) == true || checkFlag("player", "logbook") || isModding(characterInStory.index)) {
						//console.info(globalLogbookArray[i].content);
						var printEntry = true;
						if (globalLogbookArray[i].content.includes(" meat;") && checkFlag(characterInStory.index, "meat") == false) {
							printEntry = false;
						}
						if (globalLogbookArray[i].content.includes(" veggie;") && checkFlag(characterInStory.index, "veggie") == false) {
							printEntry = false;
						}
						if (printEntry == true) {
							console.log("Test passed for "+globalLogbookArray[i].content)
							
							var dialogueContainer = document.createElement("div");
							dialogueContainer.classList.add("dialogueContainer");
							dialogueContainer.classList.add("syrup");
							dialogueContainer.style.width = "initial";
							var nameContent = document.createElement("p");
							nameContent.classList.add("nameContent");
							nameContent.classList.add("syrup");
							var textContainer = document.createElement("div");
							textContainer.classList.add("textContainer");
							textContainer.classList.add("syrup");
							var textBorder = document.createElement("div");
							textBorder.classList.add("textBorder");
							textBorder.classList.add("syrup");
							var textContent = document.createElement("div");
							textContent.classList.add("textContent");
							textContent.classList.add("syrup");
									

							var dialogueTextDivorcer = document.createElement("div");
							dialogueTextDivorcer.style.width = "max-content";
							if (window.matchMedia('(orientation: portrait)').matches) {
								dialogueTextDivorcer.style.margin = "auto";
							}
							textContent.appendChild(dialogueTextDivorcer);
							
							dialogueContainer.style.borderColor = characterInStory.color;
							var dialogueName = document.createElement("p");
							dialogueName.classList.add("textName");
							dialogueName.classList.add("syrup");
							dialogueName.style.color = characterInStory.color;
							dialogueTextDivorcer.appendChild(dialogueName);
										
							var dialogueDivider = document.createElement("hr");
							dialogueDivider.classList.add("textDivider");
							dialogueDivider.classList.add("syrup");
							dialogueDivider.style.borderColor = characterInStory.color;
							dialogueTextDivorcer.appendChild(dialogueDivider);

							var dialogueSVG = document.createElement("div");
							dialogueSVG.innerHTML= `<svg style="height: 150px;	position: absolute;	width: 225px;	right: 15px;	top: 15px;	z-index: -1;" xmlns="http://www.w3.org/2000/svg" version="1.0" width="340.000000pt" height="224.000000pt" viewBox="0 0 340.000000 224.000000" preserveAspectRatio="xMidYMid meet">
								<g transform="translate(0.000000,224.000000) scale(0.100000,-0.100000)" fill="`+characterInStory.color+`" opacity="0.3" stroke="none">
									<path d="M2590 2180 c-91 -12 -142 -52 -171 -132 -26 -74 19 -181 170 -406 132 -196 142 -207 167 -194 18 9 37 17 97 41 211 84 365 169 424 233 28 30 53 89 53 125 -1 76 -101 185 -182 198 -50 9 -131 -3 -186 -26 -61 -27 -76 -24 -108 19 -51 67 -78 94 -119 117 -48 27 -85 34 -145 25z"/>
									<path d="M287 2126 c-15 -7 -43 -26 -61 -44 -81 -76 -106 -209 -86 -455 7 -87 16 -160 20 -162 4 -2 20 0 36 5 16 6 78 26 138 46 99 32 138 47 231 90 67 31 132 107 153 178 15 51 -1 126 -33 156 -24 22 -36 23 -180 8 -29 -3 -30 -1 -37 47 -11 83 -19 104 -48 125 -32 23 -90 25 -133 6z"/>
									<path d="M1871 942 c-67 -11 -115 -81 -145 -214 -7 -29 -23 -35 -54 -19 -68 34 -186 42 -228 15 -45 -30 -76 -98 -77 -168 -1 -107 37 -170 148 -245 69 -47 193 -111 215 -111 5 0 18 -4 28 -9 23 -12 60 -26 102 -41 19 -7 44 -16 55 -21 58 -24 111 -37 120 -28 10 10 30 81 75 274 37 161 48 295 30 370 -30 126 -153 216 -269 197z"/>
								</g>
							</svg>`
							var dialogueBackground = document.createElement("svg");
							dialogueBackground.src = "`+cleanupImage(`system/ui/dialogueHeartsBlack.svg";
							dialogueBackground.classList.add("dialogueBackground");
							dialogueBackground.classList.add("syrup");
							textContent.appendChild(dialogueBackground);

							if (window.matchMedia('(orientation: portrait)').matches) {
								var thumbnailContainer = document.createElement("div");
								thumbnailContainer.classList.add("thumbnailContainer");
								thumbnailContainer.classList.add("syrup");
								dialogueContainer.appendChild(thumbnailContainer);
							}

							var dialogueText = document.createElement("p");
							textContent.appendChild(dialogueText);

							var imageSplit = globalLogbookArray[i].content.split(";");

							for (loopIndex = 0; loopIndex < imageSplit.length; loopIndex++) {
								//Remove any leading spaces
								imageSplit[loopIndex] = imageSplit[loopIndex].trim();
								switch (imageSplit[loopIndex].split(" ")[0]) {
									case "im":
										if (!window.matchMedia('(orientation: portrait)').matches) {
											var thumbnailContainer = document.createElement("div");
											thumbnailContainer.classList.add("thumbnailContainer");
											thumbnailContainer.classList.add("syrup");
											dialogueContainer.appendChild(thumbnailContainer);
										}
										
										var thumbnailBorder = document.createElement("div");
										thumbnailBorder.classList.add("thumbnailBorder");
										thumbnailBorder.classList.add("syrup");
										thumbnailContainer.appendChild(thumbnailBorder);
										//Remove the first three characters of imageSplit[loopIndex] to remove the "im-" prefix
										var contentToPrint = imageSplit[loopIndex].substring(3);
										
										//Cull any unnecesary parts of the image URL
										if (contentToPrint.includes("images/")) {
											contentToPrint = contentToPrint.replace("images/", "");
										}
										if (contentToPrint.includes(".png")) {
											contentToPrint = contentToPrint.replace(".png", "");
										}
										if (contentToPrint.includes(".webp")) {
											contentToPrint = contentToPrint.replace(".webp", "");
										}

										contentToPrint = cleanupImage(`images-${imageFormat}/`+contentToPrint+`.${imageFormat}`);
										console.info(charType)
										if (charType == "new") {
											var thumbnailImage = document.createElement("div");
											thumbnailImage.id = contentToPrint;
											thumbnailImage.classList.add("thumbnailImage");
											thumbnailImage.classList.add("syrup");
											if (contentToPrint.includes("/clothed") && charType == "new") {
												thumbnailImage.innerHTML+=drawCharacter(characterInStory.index, "class:thumbnailImage syrup;clothes:clothed;");
											}
											else if (contentToPrint.includes("/nude") && charType == "new") {
												thumbnailImage.innerHTML+=drawCharacter(characterInStory.index, "class:thumbnailImage syrup;clothes:nude;");
											}
											else {
												var thumbnailImage = document.createElement("img");
												thumbnailImage.id = contentToPrint;
												thumbnailImage.classList.add("thumbnailImage");
												thumbnailImage.classList.add("syrup");
												thumbnailImage.src = contentToPrint;
											}
										}
										else {
											var thumbnailImage = document.createElement("img");
											thumbnailImage.id = contentToPrint;
											thumbnailImage.classList.add("thumbnailImage");
											thumbnailImage.classList.add("syrup");
											thumbnailImage.src = contentToPrint;
										}

										//Adds an onclick event to the thumbnail image to replace selfImage with the clicked image
										thumbnailImage.onclick = function() {
											if (this.id.includes("/clothed") && charType == "new") {
												document.getElementById('selfImage').innerHTML = drawCharacter(characterInStory.index, "class:thumbFull;clothes:clothed;");
											}
											else if (this.id.includes("/nude") && charType == "new") {
												document.getElementById('selfImage').innerHTML = drawCharacter(characterInStory.index, "class:thumbFull;clothes:nude;");
											}
											else {
												document.getElementById('selfImage').innerHTML=`<img id="playerSelf" class="thumbFull" src="` + cleanupImage(this.id)+`">`;
											}
										}
										//thumbnailImage.id = uniqueIDCounter;
										uniqueIDCounter += 1;
										//thumbnailImage.onerror = handleImageError;
										
										if (window.matchMedia('(orientation: portrait)').matches) {
											thumbnailImage.style.height = "auto";
											thumbnailImage.style.maxHeight = "none";
											thumbnailImage.style.aspectRatio = "1/1";
										}
										thumbnailBorder.appendChild(thumbnailImage);
										break;
									case "title":
										//Remove the first six characters of imageSplit[loopIndex] to remove the "title " prefix
										var contentToPrint = imageSplit[loopIndex].substring(6);
										dialogueName.innerHTML = replaceCodenames(contentToPrint);
										break;
									default:
										var contentToPrint = imageSplit[loopIndex];
										dialogueText.innerHTML = replaceCodenames(contentToPrint);
										//dialogueText.innerHTML = dialogueText.innerHTML.replace("<br>", "<hr>")
										break;
								}
							}

							dialogueContainer.appendChild(textContainer);
								textContainer.appendChild(textBorder);
									textBorder.appendChild(textContent);
							if (window.matchMedia('(orientation: portrait)').matches) {
								document.getElementById('logbookLeft').style.width = "1%";
								document.getElementById('logbookLeft').style.visibility = "hidden";
								document.getElementById('logbookRight').style.width = "99%";
								thumbnailContainer.style.display = "flex";
								thumbnailContainer.style.position = "relative";
								thumbnailContainer.style.overflow = "hidden";
								thumbnailContainer.style.justifyContent = "center";
								dialogueContainer.style.display = "block";
							}
							
							document.getElementById('logbookRight').appendChild(dialogueContainer);

						}
						
						/*
						document.getElementById('logbookRight').innerHTML += `
							<div class = "logBox" style = "display:flex;" id = "logBox-`+i+`"></div>
						`;

						var imageSplit = globalLogbookArray[i].content.split(";");
						//Perform a for loop on the imageSplit array to and use the first word in each entry to determine what to do via a switch case
						for (loopIndex = 0; loopIndex < imageSplit.length; loopIndex++) {
							//Remove any leading spaces
							imageSplit[loopIndex] = imageSplit[loopIndex].trim();
							switch (imageSplit[loopIndex].split(" ")[0]) {
								case "im":
									//Remove the first three characters of imageSplit[loopIndex] to remove the "im-" prefix
									var contentToPrint = imageSplit[loopIndex].substring(3);
									
									//Cull any unnecesary parts of the image URL
									if (contentToPrint.includes("images/")) {
										contentToPrint = contentToPrint.replace("images/", "");
									}
									if (contentToPrint.includes(".png")) {
										contentToPrint = contentToPrint.replace(".png", "");
									}
									if (contentToPrint.includes(".webp")) {
										contentToPrint = contentToPrint.replace(".webp", "");
									}
									document.getElementById('logBox-'+i).innerHTML += `
										<img class ="thumbnailImage basic" src="images-${imageFormat}/`+contentToPrint+`.${imageFormat}">
									`;
									break;
								case "title":
									//Remove the first six characters of imageSplit[loopIndex] to remove the "title " prefix
									var contentToPrint = imageSplit[loopIndex].substring(6);
									document.getElementById('logBox-'+i).innerHTML += `
										<p class = "logtitle">`+cullRequirements(contentToPrint)+`</p>
										<div class = "logContent"></div>
									`;
									break;
								default:
									var contentToPrint = imageSplit[loopIndex];
									document.getElementById('logBox-'+i).innerHTML += `
										<p class = "logContent">`+cullRequirements(contentToPrint)+`</p>
									`;
									break;
							}
							console.log(contentToPrint);
							//Add a simple flexbox listing any images, title, and content 
						}
						*/

						/*
						if (globalLogbookArray[i].content.startsWith("im")) {
							console.log(imageSplit[0]);
							//Remove the first three characters of imageSplit[0] to remove the "im-" prefix
							imageSplit[0] = imageSplit[0].substring(3);
							//If imageSplit[1] begins with "title"

							

							document.getElementById('logbookRight').innerHTML += `
								<div class = "item">
									<p class = "itemName">Title</p>
									<p class = "itemQuantity">`+cullRequirements(imageSplit[1])+`</p>
									<img class ="itemImage" src="images-${imageFormat}/`+imageSplit[0]+`.${imageFormat}">
								<div>
							`;
						}
						*/
					}
				}
			}

			/*
			const logbookTarget = globalLogbookArray.find(logbook => logbook.index === target);
			</div><div class=" lb_secondary">
				<p class = "selfDesc lb_desc">`+replaceCodenames(logbookTarget.desc)+`</p>
				<p class = "selfDesc lb_body">`+replaceCodenames(logbookTarget.body)+`</p>
				<p class = "selfDesc lb_clothes">`+replaceCodenames(logbookTarget.clothes)+`</p>
				<p class = "selfDesc lb_home">`+replaceCodenames(logbookTarget.home)+`</p>
				<p class = "selfDesc lb_tags">Primary content themes: `+replaceCodenames(logbookTarget.tags)+`</p>
				<p class = "selfDesc lb_tags">Author: `+replaceCodenames(logbookTarget.author)+`</p>
			</div>
			`;
			*/
		}
	}
}

function generateSkills(target) {
	var outputContent = `
		<p class = "selfDesc"><b>- Skills:</b></p>
	`;
	for (var i = 0; i < data.player.skills.length; i++) {
		if (data.player.skills[i].level != 0) {
			var skillNameCapitalized = data.player.skills[i].index.charAt(0).toUpperCase() + data.player.skills[i].index.slice(1);
			if (skillNameCapitalized == "Stamina") {
				skillNameCapitalized = "Stamina Training";
			}
			outputContent += `
				<p class = "selfDesc">`+skillNameCapitalized+`: `+data.player.skills[i].level+`</p>
			`;
		}
	}
	return outputContent;
}
//===========================================================================================
//Scrapbook. With the player scrapbook flag set, clicking a big picture saves it, and the
//scrapbook window browses what was saved and shows the generation info recorded for each one.
//The info comes from imageList, which !designDocs/imagepack-import.js rebuilds from the .txt
//sidecars that sit beside the art.
//===========================================================================================

//Which image the scrapbook is currently looking at, empty string while browsing the grid
var scrapbookViewing = "";
//Where the grid was scrolled to before opening one image, so closing it does not jump to the top
var scrapbookScroll = 0;

//Turns whatever is on screen into the key the scrapbook stores: the image path with the format
//folder and extension taken off, matching how imageList is keyed.
//
//A modded image is a blob URL, which says nothing at all about what it is. window.modImages maps
//logical path to blob URL, so the original name is recoverable by looking for the value.
function scrapbookKey(imagePath) {
	var rawPath = String(imagePath);
	if (rawPath.indexOf("blob:") == 0) {
		if (window.modImages) {
			for (var modPath in window.modImages) {
				if (window.modImages[modPath] === rawPath) {
					return modPath;
				}
			}
		}
		return "";
	}
	//A mod image still loading is shown as the placeholder with its real path after the hash
	if (rawPath.includes("none.webp#")) {
		try {
			return decodeURIComponent(rawPath.split("none.webp#").pop());
		}
		catch (error) {
			return "";
		}
	}
	return clothingLogicalPath(rawPath);
}

//The generation info recorded for a key, or null when there is none
function scrapbookInfo(key) {
	if (typeof imageList === "undefined") {
		return null;
	}
	var entry = imageList.find(function (listEntry) { return listEntry.img === key; });
	if (entry && entry.txt) {
		return entry.txt;
	}
	return null;
}

function scrapbookIsModded(key) {
	if (window.modImages && window.modImages[key]) {
		return true;
	}
	if (window.knownModFiles && window.knownModFiles.has && window.knownModFiles.has(key)) {
		return true;
	}
	return false;
}

//A short message under a big picture. It lives inside the picture's own container, which is
//already position:relative, and is absolutely positioned, so it never changes the height of
//anything around it. The same element is reused and its text replaced rather than appended to:
//innerHTML += on a live container would rebuild every node inside it and could break whatever
//the scene had already put there, and repeated clicks would stack messages forever.
function scrapbookMessage(containerId, text, tone) {
	var container = document.getElementById(containerId);
	if (!container) {
		return;
	}
	//writeBig gives the container and the image the same id, and getElementById hands back the
	//first, so make sure this is really the container before hanging anything off it
	if (container.classList.contains("bigPictureContainer") != true && container.closest) {
		var found = container.closest(".bigPictureContainer");
		if (found) {
			container = found;
		}
	}
	var messageId = containerId + "-scrapbookMessage";
	var message = document.getElementById(messageId);
	if (!message) {
		message = document.createElement("div");
		message.id = messageId;
		message.className = "scrapbookToast";
		container.appendChild(message);
	}
	message.textContent = text;
	message.classList.remove("scrapbookToastGood");
	message.classList.remove("scrapbookToastBad");
	if (tone == "good") {
		message.classList.add("scrapbookToastGood");
	}
	if (tone == "bad") {
		message.classList.add("scrapbookToastBad");
	}
	//Restart the fade rather than letting a second click inherit the first one's timing
	message.classList.remove("scrapbookToastShow");
	void message.offsetWidth;
	message.classList.add("scrapbookToastShow");
}

//Saves the clicked picture. Only images that actually carry generation info are worth keeping,
//so anything without a sidecar is refused, with the one exception of modded art, which can never
//have an entry in imageList and is kept anyway so mod authors' pictures are not second class.
function scrapbookSave(imagePath, containerId) {
	if (checkFlag("player", "scrapbook") != true) {
		return;
	}
	var key = scrapbookKey(imagePath);
	if (key === "") {
		scrapbookMessage(containerId, "Couldn't tell which image this is!", "bad");
		return;
	}
	if (!data.player.scrapbook) {
		data.player.scrapbook = [];
	}
	if (data.player.scrapbook.includes(key)) {
		scrapbookMessage(containerId, "Already saved.", "bad");
		return;
	}
	var info = scrapbookInfo(key);
	var modded = scrapbookIsModded(key);
	if (info === null && modded != true) {
		scrapbookMessage(containerId, "No txt info present!", "bad");
		return;
	}
	data.player.scrapbook.push(key);
	if (info === null) {
		scrapbookMessage(containerId, "Modded image, saved but without txt info!", "good");
	}
	else {
		scrapbookMessage(containerId, "Saved to the scrapbook!", "good");
	}
}

//Opens the scrapbook. Called from the logbook, which closes itself on the way through.
function openScrapbook() {
	scrapbookViewing = "";
	scrapbookScroll = 0;
	deleteWindow();
	generateWindow("scrapbook");
}

//The grid of saved pictures. Newest first, since that is what a player just added.
function printScrapbookGrid() {
	scrapbookViewing = "";
	var holder = document.getElementById("scrapbookHolder");
	if (!holder) {
		return;
	}
	if (!data.player.scrapbook) {
		data.player.scrapbook = [];
	}
	if (data.player.scrapbook.length == 0) {
		holder.innerHTML = `<div class="scrapbookEmpty"><p class="rawText">Your scrapbook is empty.<br>Tap any large picture while exploring to keep a copy of it here, along with the notes it was made from.</p></div>`;
		return;
	}
	var grid = `<div id="scrapbookGrid" class="scrapbookGrid">`;
	for (var pageCounter = data.player.scrapbook.length - 1; pageCounter >= 0; pageCounter--) {
		var key = data.player.scrapbook[pageCounter];
		grid += `<div class="scrapbookCell" onclick="printScrapbookImage('`+key+`')">
			<img class="scrapbookThumb" src="`+cleanupImage(key)+`" onerror="handleImageError()">
		</div>`;
	}
	grid += `</div>`;
	holder.innerHTML = grid;
	//Put the player back where they were rather than at the top of the grid
	holder.scrollTop = scrapbookScroll;
}

//One saved picture, with where it came from and the notes it was made from
function printScrapbookImage(key) {
	var holder = document.getElementById("scrapbookHolder");
	if (!holder) {
		return;
	}
	//Remembered before the grid is torn down, so closing this returns to the same spot
	if (scrapbookViewing === "") {
		scrapbookScroll = holder.scrollTop;
	}
	scrapbookViewing = key;
	var info = scrapbookInfo(key);
	var infoText = info;
	if (info === null) {
		infoText = "No notes were recorded for this image. Modded art does not carry them.";
	}
	holder.innerHTML = `
		<div class="scrapbookView">
			<p class="choiceText" onclick="printScrapbookGrid()">&lt; Back to the scrapbook</p>
			<img class="scrapbookLarge" src="`+cleanupImage(key)+`" onerror="handleImageError()">
			<p class="scrapbookPath">`+key+`</p>
			<p class="scrapbookInfo" id="scrapbookInfoText"></p>
			<p class="choiceText" style="border-bottom: 3px solid red; color: red;" onclick="scrapbookDelete('`+key+`')">Delete from scrapbook</p>
		</div>
	`;
	//Set as text, so a prompt containing angle brackets (<lyco:...>, <3) shows as written
	//instead of being parsed as markup and disappearing
	document.getElementById("scrapbookInfoText").textContent = infoText;
	holder.scrollTop = 0;
}

function scrapbookDelete(key) {
	if (!data.player.scrapbook) {
		data.player.scrapbook = [];
	}
	var position = data.player.scrapbook.indexOf(key);
	if (position >= 0) {
		data.player.scrapbook.splice(position, 1);
	}
	//The grid is shorter now, so the remembered offset may be past its end
	var holder = document.getElementById("scrapbookHolder");
	scrapbookViewing = "";
	printScrapbookGrid();
	if (holder && holder.scrollTop != scrapbookScroll) {
		scrapbookScroll = holder.scrollTop;
	}
}
