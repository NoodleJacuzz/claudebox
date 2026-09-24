//Side menu functions
function updateMenu() {
	applyLimits();
	document.getElementById('title').src= cleanupImage("system/ui/title");
	if (storageArray.modName != "") {
			if (!document.getElementById('tooltip')) {
				var tooltipElement = document.createElement("p");
				tooltipElement.id = "tooltip";
				tooltipElement.className = "centeredText";
				tooltipElement.style.width = "100vw";
				tooltipElement.style.display = "initial";
				tooltipElement.style.height = "20vh";
				tooltipElement.style.position = "fixed";
				tooltipElement.style.bottom = "0%";
				tooltipElement.style.padding = "0%";
				tooltipElement.style.margin = "0";
				tooltipElement.style.lineHeight = "1";
				tooltipElement.style.fontSize = "var(--fs-large, 1.5em)";
				tooltipElement.style.overflowX = "hidden";
				tooltipElement.style.overflowY = "scroll";
				document.body.appendChild(tooltipElement);
				document.getElementById('wrapper').style.height = window.matchMedia('(orientation: portrait)').matches ? "72vh" : "80vh";
			}
	}
	else {
			if (document.getElementById('tooltip')) {
				document.body.removeChild(document.getElementById('tooltip'));
				document.getElementById('wrapper').style.height = "100%";
			}
		var specialString = "";
		if (data.player.holiday == "pill") {
			specialString = "expression:pent-up;"
		}
		document.getElementById('playerImageFrame').innerHTML= drawPlayer(specialString)
		if (data.player.carnivore == true) {
			document.getElementById('playerImageFrame').innerHTML+= `<img class="playerImage" src="` + cleanupImage(`player/player-carnivore`) + `">`;
		}
		if (data.player.vegetarian == true) {
			document.getElementById('playerImageFrame').innerHTML+= `<img class="playerImage" src="` + cleanupImage(`player/player-vegetarian`) + `">`;
		}
	}
	
	document.getElementById('versionTracker').innerHTML = "v"+version;
	if (checkFlag("player", "money")) {
		document.querySelectorAll('.playerMoney').forEach(el => el.innerHTML = "$999");
	}
	else {
		document.querySelectorAll('.playerMoney').forEach(el => el.innerHTML = "$"+data.player.money);
	}
	document.getElementById('titleDay').innerHTML = "Day "+data.player.day+" - "+data.player.time;
}

function applyLimits() {
	if (checkFlag("player", "limited")) {
		if (data.player.money > 1000) {
			data.player.money = 1000;
		}
		for (var itemIndex = 0; itemIndex < data.items.length; itemIndex++) {
			if (data.items[itemIndex][1] > 5) {
				data.items[itemIndex][1] = 5;
			}
		}
	}
	if (data.player.money < 0) {
		data.player.money = 0;
	}
}

function closeButton() {
	if (!window.matchMedia('(orientation: portrait)').matches) {
		document.getElementById("menu").style.marginLeft = "-21%";	/* slide menu off-screen-left; -21% matches the menu's 21% width so the wrapper reclaims the space (no gap) */
		document.getElementById("wrapper").style.marginLeft = "0px";
	}
	document.getElementById("output").style.width = "100%";
	document.getElementById("output").style.transition = "2s";
	document.getElementById("closeButton").style.visibility = "hidden";
	document.getElementById("openButton").style.visibility = "visible";
	var _jb = document.getElementById("jiggyButtonHolders");
	if (_jb) { _jb.classList.remove("menuOpen"); } // menu folded in: jiggy buttons sit at the far left
}

function openButton() {
	if (!window.matchMedia('(orientation: portrait)').matches) {
	document.getElementById("menu").style.marginLeft = "";	/* back to 0 -> menu slides back on-screen */
	document.getElementById("wrapper").style.marginLeft = "0px";	
	}
	document.getElementById("output").style.width = "100%";
	document.getElementById("output").style.transition = "1s";
	document.getElementById("closeButton").style.visibility = "visible";
	document.getElementById("openButton").style.visibility = "hidden";
	var _jb = document.getElementById("jiggyButtonHolders");
	if (_jb) { _jb.classList.add("menuOpen"); } // menu folded out: jiggy buttons slide to the menu's right edge
}

//Window functions
function deleteWindow() {
	if (activeWindow == "preferences") {
		cleanupFetishes();
	}
	activeWindow = "";
	document.getElementById('windowHolder').innerHTML = ``;
}

function generateWindow(type) {
	soundEffectStart("button");
	activeWindow = type;
	//onclick="event.stopPropagation()"
	document.getElementById('windowHolder').innerHTML = `
	<div id = 'windowBackdrop' class = 'windowBackdrop'>
		<div id = 'window' class = 'popup' ></div>
	</div>
	`;
	switch (type) {
		case "scrapbook": {
			document.getElementById("window").innerHTML += `
				<div class="scrapbookWindow">
					<h1 class = "windowTitle" onclick="deleteWindow()">SCRAPBOOK</h1>
					<div id = "scrapbookHolder" class="scrapbookHolder"></div>
				</div>
			`;
			printScrapbookGrid();
			break;
		}
		case "string": {
			document.getElementById('window').innerHTML += `
			<h1 class = "windowTitle" onclick="deleteWindow()">SAVE/LOAD</h1>
			<div id = "windowList" class="saveList">
			<p>Save data copied! It's been added to your clipboard, or you can manually copy the information below. Paste it into an email or a text document asap!</p>
			<textArea id = "copyData">`+JSON.stringify(data)+`</textArea>
			<p class="choiceText" onclick="generateWindow('save')">
				Finished copying
			</p>
			</div>`;
			var copyText = document.getElementById("copyData");
			
			
			
			copyText.select();
			copyText.setSelectionRange(0, 99999);
			document.execCommand("copy");
			break;
		}
		case "save": {
			document.getElementById('window').innerHTML += `
				<h1 class = "windowTitle" onclick="deleteWindow()">SAVE/LOAD</h1>
				<div id = "windowList" class="saveList">
				</div>
			`;
			document.getElementById('windowList').innerHTML += `
				<div class = "saveSlot">
					<p id = "save9Name" class = "saveName">Manual</p>
					<p id = "save9Button" class = "saveFileButton button" onclick = "saveTXT()">Save to .noodle file</p>
					<input type="file" id="loadFile" onload="fileLoaded()" class = "loadFileButton button" onchange = "loadSave()"></input>
				</div>
				<div class = "saveSlot">
					<p id = "save9Name" class = "saveName">String</p>
					<p id = "load9Button" class = "loadFileButton button" onclick = "loadFile()">Load from text string</p>
					<p id = "save9Button" class = "saveFileButton button" onclick = "saveFile()">Save to text string</p>
				</div>
				<div class = "saveSlot">
					<p id = "save9Name" class = "saveName">Auto</p>
					<p class = "loadFileButton button" onClick="window.location.reload();">The game autosaves regularly while cookies are enabled. Refresh the page to load the autosave anytime.</p>
				</div>
			`;
			for (saveCounter = 1; saveCounter < 9; saveCounter++) {
				document.getElementById('windowList').innerHTML += `
				<div class = "saveSlot" id = "save`+saveCounter+`Slot">
					<p id = "save`+saveCounter+`Name" class = "saveName">Slot `+saveCounter+`</p>
					<div class = "saveButtonsList">
						<p id = "save`+saveCounter+`Button" class = "saveButton button" onclick = "saveSlot(`+saveCounter+`)">SAVE</p>
						<p id = "load`+saveCounter+`Button" class = "loadButton button" onclick = "loadSlot(`+saveCounter+`)"></p>
						<p id = "delete`+saveCounter+`Button" class = "deleteButton button" onclick = "deleteSlot(`+saveCounter+`)"></p>
					</div>
					<p id = "save`+saveCounter+`Date" class = "saveDate"></p>
				</div>
				`;
			}
			generateSave();
			break;
		}
		case "phone": {
			document.getElementById('window').innerHTML += `
				<h1 id = "windowTitle" class = "windowTitle" onclick="deleteWindow()">PHONE</h1>
			`;
			document.getElementById('window').innerHTML += `
				<div class = "logbookLeft" id = "phoneLeft">
				</div>
				<div class = "logbookRight" id = "phoneRight">
				</div>
			`;
			generateContacts();
			break;
		}
		case "inventory": {
			// Old Code
			/*
			
			document.getElementById('window').innerHTML += `
				<h1 class = "windowTitle" onclick="deleteWindow()">Inventory</h1>
				<div id = "gridHolder" class="gridHolder" style="width: 100%; height: 100%;">
					<div id = "gridInventory" class="gridInventory">
					</div>
				</div>
			`;
			for (i = 0; i < data.items.length; i++) {
				if (data.items[i].key == false) {
					document.getElementById('windowLeft').innerHTML += `
					<div class = "item">
						<p class = "itemName">`+data.items[i].name+`</p>
						<img class ="itemImage" src="`+data.items[i].image+`">
					<div>
					`;
				}
				else {
					document.getElementById('windowRight').innerHTML += `
					<div class = "item">
						<p class = "itemName">`+data.items[i].name+`</p>
						<img class ="itemImage" src="`+data.items[i].image+`">
					</div>
					`;
				}
			}

			//University's latest code:
			
			for (i = 0; i < data.items.length; i++) {
				document.getElementById('gridInventory').innerHTML += `
				<div class = "item">
					<p class = "itemName">`+data.items[i].name+`</p>
					<img class ="itemImage" src="`+data.items[i].image+`">
				<div>
				`;
			}
			*/

			//New Code
			document.getElementById('window').innerHTML += `
				<h1 class = "windowTitle" onclick="deleteWindow()">INVENTORY</h1>
				<div class = "logbookLeft" id = "logbookLeft">
				</div>
				<div class = "logbookRight" id = "logbookRight">
				</div>
			`;
			document.getElementById('logbookLeft').innerHTML += `
				<h3 class = "button" style = "color: #FFFFFF" onclick = "switchItemCat('fruit, treasure, critter')">Goodies</h3>
				<h3 class = "button" style = "color: #FFFFFF" onclick = "switchItemCat('key')">Key Items</h3>
			`;
			for (i = 0; i < data.items.length; i++) {
				if (data.items[i][0].includes("magazine") == true || data.items[i][0].includes("Magazine") == true) {
					var magazine = true
				}
				if (data.items[i][0].includes("pocketman") == true || data.items[i][0].includes("pocket-") == true) {
					var pocketman = true
				}
				if (data.items[i][0].includes("tarot") == true) {
					var tarot = true
				}
			}
			if (magazine) {
				document.getElementById('logbookLeft').innerHTML += `
					<h3 class = "button" style = "color: #FFFFFF" onclick = "switchItemCat('magazine')">Magazines</h3>
				`
			}
			if (pocketman) {
				document.getElementById('logbookLeft').innerHTML += `
					<h3 class = "button" style = "color: #FFFFFF" onclick = "switchItemCat('pocketmanz')">Pocketmanz Cards</h3>
				`
			}
			if (tarot) {
				document.getElementById('logbookLeft').innerHTML += `
					<h3 class = "button" style = "color: #FFFFFF" onclick = "switchItemCat('tarot')">Tarot Cards</h3>
				`
			}
			switchItemCat("fruit, treasure, critter");
			break;
		}
		case "logbook": {
			document.getElementById('window').innerHTML += `
				<h1 class = "windowTitle" onclick="deleteWindow()">LOGBOOK</h1>
				<div class = "logbookLeft" id = "logbookLeft">
				</div>
				<div class = "logbookRight" id = "logbookRight">
				</div>
			`;
			//generateNav();
			break;
		}
		case "achievements": {
			document.getElementById('window').innerHTML += `
				<h1 class = "windowTitle" onclick="deleteWindow()">TROPHIES</h1>
				<div id = "logbookGridHolder" class="gridHolder" style="width: 100%;">
					<div id="achievements" class="hand"></div>
				</div>
			`;
			checkForAchievements();
			loadAchievements();
			break;
		}
		case "logbookSelection": {
			generateLogbook();
			break;
		}
		case "expressions": {
			generateExpressions();
			break;
		}
		case "customCode": {
			generateModbook();
			break;
		}
		case "settings": {
			document.getElementById('window').innerHTML += `
				<h1 id = "windowTitle" class = "windowTitle" onclick="deleteWindow()">SETTINGS</h1>
				<div id = "windowContents" style= "overflow-y:scroll;width:100%;height:75%;display:flex;flex-wrap:wrap;"></div>
			`;
			document.getElementById('windowContents').innerHTML += `
				<p class="centeredText" style="width:100%;">Note: Changes are not applied until you change your location or speak to someone.</p>
				<p class="centeredText" style="width:100%;">Visual Style:</p>
			`;
			var stylesList = [
				{name: "Syrup", index: "syrup"},
				{name: "Basic Style", index: "basic"},
				{name: "Persona Style", index: "persona"},
				{name: "Vaporwave", index: "royalty"},
				{name: "Lobotomy", index: "lobotomy"},
			];
			document.getElementById('windowContents').innerHTML += `
				<div id = "logbookGridHolder" class="gridHolder" style="width: 100%; height:fit-content;">
					<div id="phoneSelectionMenu" class="phoneSelectionMenu" style="grid-template-columns:repeat(auto-fill, 350px); overflow-x: hidden;">
					</div>
				</div>
			`;
			for (i = 0; i < stylesList.length; i++) {
				if (data.player.style == stylesList[i].index) {
					var borderColor="#FFFFFF"
				}
				else {
					var borderColor="#777777"
				}
				document.getElementById('phoneSelectionMenu').innerHTML += `
					<div class = "textBox" id="stylebox`+stylesList[i].index+`" style="border: 3px solid `+borderColor+`; height:110px;" onclick = "changeStyle('`+stylesList[i].index+`')">
						<img class = "textThumb" style = "margin-left:0px; height:100%; width:100%;"src = "images-${imageFormat}/system/styles/`+stylesList[i].index+`.JPG">
						<span style = "position:absolute;width:100%;bottom:0px;" class = "centeredText">`+stylesList[i].name+`</span>
					</div>
				`;
			}
			document.getElementById('windowContents').innerHTML += `
				<p class="centeredText" style="width:100%;">Volume Settings:</p>
			`;
			/* New music and SFX code*/
			//Goal: Volume toggle button and slider to adjust volumes
			document.getElementById('windowContents').innerHTML += `
				<p class="choiceText" id="musicText"> 
					Music:
					<img id="musicButton" class="musicButton" onclick="musicToggle()" style="max-height: 40px;" src="`+cleanupImage(`system/ui/buttonSound`)+`">
					<input type="range" id="music-slider" min="0" max="100" value="`+data.player.musicVolume+`" oninput="volumeAdjust('music',this.value)">
				</p>
			`;
			if (musicDisabled == true) {
				document.getElementById('musicButton').src = cleanupImage(`system/ui/buttonHush`);
			}
			document.getElementById('music-slider').value = parseInt(data.player.musicVolume);
			document.getElementById('windowContents').innerHTML += `
				<p class="choiceText" id="sfxText">
					SFX:
					<img id="soundButton" class="musicButton" onclick="soundToggle()" style="max-height: 40px;" src="`+cleanupImage(`system/ui/buttonSound`)+`">
					<input type="range" id="sfx-slider" min="0" max="100" value="`+data.player.soundVolume+`" oninput="volumeAdjust('sound',this.value)">
				</p>
			`;
			if (soundDisabled == true) {
				document.getElementById('soundButton').src = cleanupImage(`system/ui/buttonHush`);
			}
			document.getElementById('sfx-slider').value = parseInt(data.player.soundVolume);
			console.info(document.getElementById('sfx-slider').value);
			document.getElementById('windowContents').innerHTML += `
				<p class="choiceText" id="musicButton" onclick="startMusic()">
					Skip Song >>
				</p>
			`;
			document.getElementById('windowContents').innerHTML += `
				<p class="choiceText" id="musicButton" onclick="songBlacklist()" style = "border-bottom: 3px solid red; color: red">
					Blacklist Song
				</p>
			`;
			if (nextSong != "") {
				document.getElementById('windowContents').innerHTML += `
					<p class="centeredText" id="currentSong" style="width:100%;">Current Song: `+playlist[playlist.length-1].id+`</p>
				`;
			}
			else {
				document.getElementById('windowContents').innerHTML += `
					<p class="centeredText" id="currentSong" style="width:100%;">Current Song: None (No songs remaining)</p>
				`;
			}

			/* Old music and SFX code
			document.getElementById('window').innerHTML += `
				<p class="choiceText" id="musicDown" onclick="volume('music', 'down')">
					Music -
				</p>
			`;
			if (musicDisabled == true) {
				document.getElementById('window').innerHTML += `
					<p class="choiceText" id="musicButton" onclick="musicToggle()" style = "border-bottom: 3px solid green; color: green">
						Enable Music
					</p>
				`;
			}
			else {
				document.getElementById('window').innerHTML += `
					<p class="choiceText" id="musicButton" onclick="musicToggle()" style = "border-bottom: 3px solid red; color: red">
						Disable Music
					</p>
				`;
			}
			document.getElementById('window').innerHTML += `
				<p class="choiceText" id="musicUp" onclick="volume('music', 'up')">
					Music +
				</p>
			`;
			document.getElementById('window').innerHTML += `
				<p class="choiceText" id="soundDown" onclick="volume('sound', 'down')">
					Sound -
				</p>
			`;
			if (soundDisabled == true) {
				document.getElementById('window').innerHTML += `
					<p class="choiceText" id="soundButton" onclick="soundToggle()" style = "border-bottom: 3px solid green; color: green">
						Enable Sound Effects
					</p>
				`;
			}
			else {
				document.getElementById('window').innerHTML += `
					<p class="choiceText" id="soundButton" onclick="soundToggle()" style = "border-bottom: 3px solid red; color: red">
						Disable Sound Effects
					</p>
				`;
			}
			document.getElementById('window').innerHTML += `
				<p class="choiceText" id="soundUp" onclick="volume('sound', 'up')">
					Sound +
				</p><br>
			`;
			*/
			document.getElementById('windowContents').innerHTML += `
				<p class="centeredText" style="width:100%;">Other Settings:</p>
			`;
			if (data.player.currentScene == "") {
				document.getElementById('windowContents').innerHTML += `
					<p class="choiceText" onclick="writeScene('system', 'start')" style = "border-bottom: 3px solid red; color: red">
						Main Menu
					</p>
				`;
			}
			document.getElementById('windowContents').innerHTML += `
				<p class="choiceText" id="prefButton" onclick="generateWindow('preferences')">
					Content Preferences
				</p>
			`;
			document.getElementById('windowContents').innerHTML += `
				<p class="choiceText" id="musicButton" onclick="songBlacklistClear()">
					Clear Song Blacklist
				</p>
			`;document.getElementById('windowContents').innerHTML += `
				</div>
			`;
			/* Old code
			document.getElementById('window').innerHTML += `
				<h1 class = "windowTitle" onclick="deleteWindow()">SETTINGS</h1>
				<div class = "saveSlot">
					<p id = "save9Name" class = "saveName">Note:</p>
					<p id = "settingsText" class = "settingsFileButton button">Changes are not applied until you change your location or speak to someone.</p>
				</div>
				<div class = "settingsSlot">
					<p class = "settingsName">Images</p>
					<p class = "settingsFileButton button" onclick = "disablePictures()">Toggle images</p>
				</div>
			`;
			*/
			break;
		}
		case "preferences": {
			document.getElementById('window').innerHTML += `
				<h1 id = "windowTitle" class = "windowTitle" onclick="deleteWindow()">SETTINGS</h1>
				<div id = "windowContents" style= "overflow-y:scroll;width:100%;height:75%;"></div>
			`;
			document.getElementById('windowContents').innerHTML += `
				<p class="centeredText" style="width:100%;">Enables or hides certain scenes and characters from the game. You'll still unlock the scenes, but images and dialogue in them may be hidden, and won't be counted in the gallery.<br>Some fetishes may not currently be available for both vegetarians and carnivores.<br>Note: Changes are not applied until you change your location or speak to someone.</p>
			`;
			document.getElementById('windowContents').innerHTML += `
				<div id="fetishGrid" style="position:relative;height:initial;width:100%;display:grid;column-gap:3%;">
				</div>
			`;
			var gridSize = "var(--fetish-grid-min, 30%)";
			document.getElementById('fetishGrid').style.gridTemplateColumns = "repeat(auto-fill, minmax("+gridSize+", 1fr))";
			//Ensure fetishes are up-to-date with in-game settings
			for (contentIndex = 0; contentIndex < data.player.filters.length; contentIndex++) {
				switch (data.player.filters[contentIndex].index) {
					case "male": {
						if (data.player.vegetarian == true) {
							data.player.filters[contentIndex].status = "false";
						}
						break;
					}
					case "dickgirl": {
						if (data.player.vegetarian == true) {
							data.player.filters[contentIndex].status = "false";
						}
						break;
					}
					case "female": {
						if (data.player.carnivore == true) {
							data.player.filters[contentIndex].status = "false";
						}
						break;
					}
					case "mayor": {
						if (checkFlag("mayor", "meat") == true) {
							data.player.filters[contentIndex].status = "true";
						}
						break;
					}
					case "carpenter": {
						if (checkFlag("carpenter", "meat") == true) {
							data.player.filters[contentIndex].status = "true";
						}
						break;
					}
					case "shopkeep": {
						if (checkFlag("shopkeep", "meat") == true) {
							data.player.filters[contentIndex].status = "true";
						}
						break;
					}
					case "pregnancy": {
						if (data.player.carnivore == true) {
							data.player.filters[contentIndex].status = "false";
						}
						break;
					}
					case "rosebud": {
						if (checkFlag("player", "prolapse") == true) {
							data.player.filters[contentIndex].status = "false";
						}
						break;
					}
					case "animated": {
						if (typeof animatedImages == "undefined") {
							data.player.filters[contentIndex].status = "false";
						}
						break;
					} 
					case "weird": {
						if (checkItem("permit") != true) {
							data.player.filters[contentIndex].status = "false";
						}
						break;
					}
				}
			}

			//Print fetishes list
			for (contentIndex = 0; contentIndex < contentArray.length; contentIndex++) {
				switch (contentArray[contentIndex].index) {
					//Special code for determining fetish images to account for carnivore/vegetarian settings
					case "rosebud": {
						//Left as logical paths: cleaning here, while the filter is disabled, would drop the
						//suffix from trueImg. Both are cleaned when drawn, after toggleFetish sets the status.
						if (data.player.vegetarian != true) {
							contentArray[contentIndex].trueImg = "fash/wallRear-10Rosebud";
							contentArray[contentIndex].falseImg = "fash/wallRear-10";
						}
						else {
							contentArray[contentIndex].trueImg = "wolf/date4-8rosebud";
							contentArray[contentIndex].falseImg = "wolf/date4-8";
						}
						break;
					}
					case "playerSub": {
						if (data.player.vegetarian == true) {
							contentArray[contentIndex].trueImg = cleanupImage("nun/nun2-1");
						}
						else {
							contentArray[contentIndex].trueImg = cleanupImage("hyena/hyena4-5");
						}
						break;
					}
					case "rimming": {
						if (data.player.vegetarian == true) {
							contentArray[contentIndex].trueImg = cleanupImage("nun/wall1-4-light");
						}
						else {
							contentArray[contentIndex].trueImg = cleanupImage("mesu/mesu4c-2");
						}
						break;
					}
					case "feral": {
						if (data.player.vegetarian == true) {
							contentArray[contentIndex].trueImg = cleanupImage("tarot/11");
						}
						else {
							contentArray[contentIndex].trueImg = cleanupImage("pocketmanz/eev-0");
						}
						break;
					}
					case "atw": {
						if (data.player.carnivore == true) {
							contentArray[contentIndex].trueImg = cleanupImage("mesu/pills1-6");
						}
						else {
							contentArray[contentIndex].trueImg = cleanupImage("wolf/pill1-5");
						}
						break;
					}
					case "animated": {
						if (data.player.carnivore == true) {
							contentArray[contentIndex].trueImg = "images-mp4/hyena/hyena4-4.mp4";
							contentArray[contentIndex].falseImg = cleanupImage("hyena/hyena4-4");
						}
						else {
							contentArray[contentIndex].trueImg = "images-mp4/foxf/mystery-foxf3.mp4";
							contentArray[contentIndex].falseImg = cleanupImage("foxf/mystery-foxf3");
						}
						break;
					}
					case "urethral": {
						if (data.player.vegetarian != true) {
							contentArray[contentIndex].trueImg = "mesu/bath2";
						}
						else {
							contentArray[contentIndex].trueImg = "milf/nipplepen";
						}
						break;
					}
					case "weird": {
						contentArray[contentIndex].trueImg = cleanupImage("misc/permitIntro0");
						break;
					}
				}

				for (playerIndex = 0; playerIndex < data.player.filters.length; playerIndex++) {
					if (contentArray[contentIndex].index == data.player.filters[playerIndex].index) {
						var playerFilter = data.player.filters[playerIndex];
					}
				}
				switch (playerFilter.status) {
					case "true": {
						var finalImage = contentArray[contentIndex].trueImg;
						var finalText = contentArray[contentIndex].trueText;
						var finalLabel = "Enabled";
						var finalColor = "color: #00FF00;";
						break;
					}
					case "false": {
						var finalImage = contentArray[contentIndex].falseImg;
						var finalText = contentArray[contentIndex].falseText;
						var finalLabel = "Disabled";
						var finalColor = "color: #FF0000;";
						break;
					}
					case "unset": {
						var finalImage = cleanupImage("jiggy/secret");
						var finalText = contentArray[contentIndex].unsetText;
						var finalLabel = "UNSET!!!";
						var finalColor = "";
						break;
					}
				}
				console.info(finalImage);

				//Establish or clean final image
				if (finalImage == "") {
					var finalImage = cleanupImage("jiggy/secret");
				}
				else if (!contentArray[contentIndex].trueImg.includes(".mp4")) {
					var finalImage = cleanupImage(finalImage);
				}

				if (!contentArray[contentIndex].trueImg.includes(".mp4")) {
					var finalLine = `<img id = "fetishImage`+contentArray[contentIndex].index+`" src="`+finalImage+`" style="width:50%;height:auto;position:absolute;left:25%;">`;
				}
				else {
					if (playerFilter.status == "true") {
						var finalLine = `<video id = "fetishVideo`+contentArray[contentIndex].index+`" src="`+finalImage+`" type="video/mp4" autoplay loop style="width:50%;height:auto;position:absolute;left:25%;"></video>
						<img id = "fetishImage`+contentArray[contentIndex].index+`" src="`+cleanupImage(contentArray[contentIndex].falseImg)+`" style="width:50%;height:auto;position:absolute;left:25%;visibility:hidden;">`;
					}
					else {
						var finalLine = `<video id = "fetishVideo`+contentArray[contentIndex].index+`" src="`+finalImage+`" type="video/mp4" autoplay loop style="width:50%;height:auto;position:absolute;left:25%;visibility:hidden;"></video>
						<img id = "fetishImage`+contentArray[contentIndex].index+`" src="`+cleanupImage(contentArray[contentIndex].falseImg)+`" style="width:50%;height:auto;position:absolute;left:25%;">`;
					}
				}

				//Final label setting for system characters
				if (playerFilter.index == "mayor" || playerFilter.index == "carpenter" || playerFilter.index == "shopkeep") {
					console.info(playerFilter.index + " " + playerFilter.status);
					if (playerFilter.status == "true") {
						finalLabel = "Penis";
					}
					else {
						finalLabel = "Pussy";
					}
				}

				//Determine if some fetish buttons should even be printed
				var printButton = true;
				if (data.player.carnivore == true && contentArray[contentIndex].index == "pregnancy") {
					printButton = false;
				}
				if (data.player.vegetarian == true && contentArray[contentIndex].index == "cbt") {
					printButton = false;
				}
				if (checkItem("permit") == false && contentArray[contentIndex].index == "weird") {
					printButton = false;
				}
				if (typeof animatedImages == "undefined" && contentArray[contentIndex].index == "animated") {
					printButton = false;
				}

				//Full Names
				for (fetishIndex = 0; fetishIndex < fetishFullNamesArray.length; fetishIndex++) {
					if (contentArray[contentIndex].index == fetishFullNamesArray[fetishIndex][0]) {
						finalLabel = fetishFullNamesArray[fetishIndex][1] + " - " + finalLabel;
					}
				}


				if (printButton == true) {
					document.getElementById('fetishGrid').innerHTML += `
						<div class="choiceText" id="fetishButton`+contentArray[contentIndex].index+`" style="position:relative;" onclick="toggleFetish('`+contentArray[contentIndex].index+`')">
							`+finalLine+`
							<br>
							<div style="position:relative;margin-top:55%;padding-top:5%;padding-bottom:5%;border-radius: 10%;background-color:#000A;">
								<p id = "fetishLabel`+contentArray[contentIndex].index+`" style="`+finalColor+`">`+finalLabel+`</p>
								<br>
								<p id = "fetishText`+contentArray[contentIndex].index+`">`+replaceCodenames(finalText)+`</p>
							</div>
						</div>
					`;
				}
			}
			
			/*document.getElementById('window').innerHTML += `
				<div class="choiceText" id="musicButton">
				<p class="choiceText" id="musicButton" onclick="startMusic()">
					Skip Song >>
				</p>
				</div>
			`;*/
			break;
		}
		//The "wardrobe" window was removed. It called changeClothes() and read data.player.body,
		//neither of which exists anywhere in the codebase, and nothing ever opened it. The real
		//wardrobe is printWardrobe in inventory.js.
		case "changelog": {
			document.getElementById('window').style.display = "initial";
			document.getElementById('window').style.overflowY = "scroll";
			
			document.getElementById('window').innerHTML += writeChangelog('v12');
			document.getElementById('window').innerHTML += writeChangelog('v11');
			document.getElementById('window').innerHTML += writeChangelog('v10');
			document.getElementById('window').innerHTML += writeChangelog('v9');
			document.getElementById('window').innerHTML += writeChangelog('v8');
			document.getElementById('window').innerHTML += writeChangelog('v7');
			document.getElementById('window').innerHTML += `
					<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/v6") + `">
					<p class='specialText'>v6 - Minigames are Nuts!</p>
					<p class='rawText'>Content:<br>
						- New Character: Marlow the Sissy Squirrel<br>
						- Added a new digging minigame in the ruins and wilderness with Anomaly Vault-inspired artifact rewards<br>
						- New Artifact: Time Stopwatch<br>
						- New Artifact: Denial Pills<br>
						- New Artifact: Portal Onahole<br>
						- Added a new random encounter to the forest wilderness<br>
						- Added 11 new jiggies as rewards from the digging minigame as subscriber appreciation<br>
						- Added new clothes as rewards from the digging minigame, including the Rose outfit<br>
						- Added new clothes and a hammer to Bluebell's shop<br>
						- Updated the art of most Pocketmanz cards.<br>
						- Updated the art of the argent science, dragon, goblin supremacy, and hentai university reference jiggies.<br>
					</p>
					<p class='rawText'>Other changes:<br>
						- Added a 'Misc' category to the gallery.<br>
						- New fetish toggle in the preferences menu: Ballbusting (not available for vegetarians).<br>
						- New fetish toggle in the preferences menu: All-The-Way-Through (TEMPORARILY not available for carnivores).<br>
						- Added new models for Marlow and Bluebell.<br>
						- Added a new tab to Bluebell's store for when you have an unidentified artifact.<br>
						- Added a shelf in the player's home to store artifacts and count artifact-related scenes.<br>
						- The random pocket jiggy option will now choose from the Plap Pal card set.<br>
						- Updated the Stable Diffusion and Syurofluff Lora guides in the museum.<br>
						- The non-furry version will be delayed until I've finished the new models for the remaining cast. These are: Khanna, Nutmeg, Cinnamon, Sorbet, Sharly, Garnet, and Jasper.<br>
					</p>
					<p class='rawText'>Bugfixes:<br>
						- Adding, removing flags and changing trust will no longer trigger in the gallery.<br>
						- Resized several ill-fitting clothes.<br>
						- Fixed a broken image with the Cow accessory.<br>
						- Reworked the way clothing previews are displayed to fix thighhigh-nutsack conflicts.<br>
						- Fixed the fetish menu breaking in the collection room.<br>
						- Fixed broken images in the fetish menu.<br>
						- Fixed a bug where changing the color of an accessory would affect the original accessory.<br>
					</p>
					<p class='rawText'>Upcoming:<br>
						- Three more artifacts have introductions finished, they'll be added in the future once I have content written for them.<br>
						- Re-checking the color sets for clothing.<br>
						- Adding the Plap Pal cards to the game proper.<br>
						- Getting invited to Marlow's home.<br>
						- Adding Khanna to the game.<br>
						- Saving progress for the minigames so I can play events inside them and then return to gaming.<br>
						- Adding treasures and fruit to your inventory proper so I can finally replace the current placeholder items.<br>
						- Rewards from the foxes for collecting things.<br>
					</p>
					<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/v5") + `">
					<p class='specialText'>v5 - Mary-Lou Joins the Cast!</p>
					<p class='rawText'>Content:<br>
						- New Character: Mary-Lou the Cow Girl<br>
						- 3 New scenes for Riley<br>
						- 2 New Scenes for Helena, and you can now visit her house<br>
						- 22 New morning microscenes across the whole cast (don't appear in gallery!)<br>
					</p>
					<p class='rawText'>Other changes:<br>
						- New character models and expressions for Cayenne and Riley.<br>
						- New preferences menu added in the settings, currently allows you to toggle vegetarian/carnivore modes, and separates carnivore mode so people who don't like femboys can still have dickgirls.<br>
						- Added selectors for the system character genders to the new preferences menu.<br>
						- Music and sound now use volume sliders instead of buttons.<br>
					</p>
					<p class='rawText'>Bugfixes:<br>
						- Changed the app logo to ST instead of the old SV.<br>
						- Fixed Helena's logbook checking the wrong character.<br>
					</p>
					<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/v4") + `">
					<p class='specialText'>v4 - Helena Joins the Cast!</p>
					<p class='rawText'>Content:<br>
						- New Character: Helena the Hyena<br>
						- 6 New scenes for Angelica (with sex variants)<br>
						- Wallbutt scene for Madame Sharly<br>
					</p>
					<p class='rawText'>Other changes:<br>
						- Overhauled how Angelica's chat system works.<br>
						- Overhauled the images for random encounters.<br>
						- Overhauled the images for the tarot cards.<br>
						- Added alternate tarot card art for if the player has vegetarian mode active.<br>
						- Re-did Angelica and Helena's model from scratch to use a new paperdoll system similar to the player's.<br>
						- Added more expressions for the player.<br>
						- Replaced a number of trophy images that just used the character's standing or nude sprites.<br>
						- Added a trophy explaining how to unlock wallbutts.<br>
						- Changed the formatting of save titles, new saves now display things like scenecount. (All are still backwards compatible)<br>
						- Added a new Tan skintone that looks closer to the old dark skintone.<br>
						- Added items to Bluebell's store that let you change your skintone and bodytype.<br>
						- Replaced Mary-Lou's magazine to reflect her upcoming design.<br>
					</p>
					<p class='rawText'>Bugfixes:<br>
						- Fixed an issue where the png and webp versions weren't loading the other formats as backups.<br>
						- Fixed an issue where a number of trophies were missing images.<br>
						- Fixed a number of clothes that didn't fit on the female model.<br>
						- Fixed a large number of mobile styling issues.<br>
						- Fixed a number of bad images and typos.<br>
					</p>
					<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/v3") + `">
					<p class='specialText'>v3 - People, Places, Wallbutts!</p>
					<p class='rawText'>Content:<br>
						- Regenerated 800+ game CGs for each of the main cast using a new model with the Illustrious checkpoint.<br>
						- This includes most of the game's jiggies, magazines, and pog coins, but not collectable cards.<br>
						- Some scenes and magazines have either had extra images added or were heavily changed (magazines still use the old covers though).<br>
						- 7 Total new wallbutt scenes unlocked via Cayenne, with sex variants for Angelica, Cayenne, and Bluebell<br>
					</p>
					<p class='rawText'>Other changes:<br>
						- Completely re-did the player model and all outfits in SDXL.<br>
						- Upscaled and polished all location images with SDXL.<br>
						- Fleshy version has been disabled and is on haitus in preparation for a complete overhaul.<br>
						- Added references to Sharly and Sorbet's mothers in their homes.<br>
						- Added a vegan mode gag ending for enabling both Vegetarian and Carnivore modes at the same time.<br>
					</p>
					<p class='rawText'>Bugfixes:<br>
						- Fixed yet more style issues on mobile<br>
						- Fixed a bug where the encounter text would shift between huge and tiny<br>
						- Fixed multiple bugs & typos<br>
					</p>
					<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/v2-5") + `">
					<p class='specialText'>v2.5 - Non-Furry (And a little furry too)</p>
					<p class='rawText'>Content:<br>
						- Added new costumes for the entire cast for both furry and non-furry versions, each costume has a full expression set.<br>
						- Added a non-furry set of tarot cards for the non-furry version of the game.<br>
						- Added 1 new morning scene for Riley, Sorbet, and Sharly. Each triggering after becoming friends with them.<br>
						- Added a new repeatable scene for Sorbet.<br>
						- Added non-furry images for all of the v2 content and the bonus scenes above.<br>
					</p>
					<p class='rawText'>Other changes:<br>
						- Goodra is now a card found in lavender lane, the flashing merchant now sells you a set of three new vertical cards<br>
						- Added new random jiggy options if you've completed all jiggies or have the "even the funko pops" cheat enabled.<br>
						- Added a second chance to start collecting the cards in Sharly's house if you chose to discard the tarot card.<br>
						- Fixed a few weird images found by Kyupon like the fem fairy scene.<br>
						- The museum now checks if you've ever had an item, rather than if you currently have it in your inventory.<br>
						- Added a sell-all function to Bluebell's shop.<br>
						- Angelica is now visibly excited when you've met her progression requirements.<br>
						- Added a new type of pocketman frame used for the new pocketmanz cards.<br>
						- Added code to automatically replace <3 in text with a heart.<br>
					</p>
					<p class='rawText'>Bugfixes:<br>
						- Fixed a bug where the PNG version magazines were broken.<br>
						- Fixed a broken image in Sharly's first repeatable scene.<br>
						- Fixed a bug where the male lopunny image was broken.<br>
						- Fixed a bug where gathering and hunting in the forest wilderness was causing a softlock.<br>
						- Fixed a bug where horizontal rules were accompanied by empty text bubbles.<br>
					</p>
					<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/v2") + `">
					<p class='specialText'>v2 - Madame Sharly & SDXL</p>
					<p class='rawText'>Content:<br>
						- Switched to the SDXL model PrefectPony, every single one of the game's ~500 CGs and every single character's outfits and full expression sets were redone in the new style. Every event image, every pocketmanz card, every tarot card, every vein on Angelica's blue balls. Everything (except for the pog coins which I forgot uwu).<br>
						New character: Madame Sharly, the Mystical Black Cat<br>
						- 2(-ish, his teasing is spread out over several days) new scenes for Riley<br>
						- New scene for Angelica & Bluebell (images & some text differ based on sex)<br>
						- New scene for Jasper, Garnet, and Sorbet<br>
						- You can now enter a character's house after becoming friends with them, leading to repeatable scenes<br>
						- Added 5 other pocketmanz cards and 2 new jiggies which can be obtained from gathering anything anywhere.<br>
						- Added a special new triad jiggy, obtained by collecting all pocketmanz cards, let me know if you like or dislike this new type!<br>
						- Added full SDXL and Easyfluff installation and usage guides to the museum's technology wing<br>
					</p>
					<p class='rawText'>Other changes:<br>
						- Added a gathering spot in the forest wilderness, along with a new random event where a stranger sells you a new pocketmanz card<br>
						- Morning events and random encounters will now have a chance to repeat after a certain amount of time instead of restarting immediately after refreshing the game<br>
						- Added names to the accessories so you can see which square is for which item and if they're enabled or not<br>
						- Characters will give tours of their houses which is now how you unlock their clothes for personal use<br>
					</p>
					<p class='rawText'>Bugfixes:<br>
						- Fixed the broken styles (persona, lobotomy, and vaporwave) on mobile<br>
						- Fixed a bug where the encounter tabs in the basic style were missing some styling<br>
						- Fixed a bug where Garnet's pog coin was broken online<br>
						- Stopped the train noise after arriving in town<br>
					</p>
					<p class='specialText'>v1.2 - Bugfixes</p>
					<p class='rawText'>Bugfixes:<br>
						- Fixes Angelica, Bluebell, and Cayenne's magazines repeating images instead of showing proper pages.<br>
						- Fixes a bug where transferring between PNG and WEBP versions of the game would break your clothes.<br>
						- Boosts the priority of Angelica's morning events after making her horny.<br>
						- Riley's third outfit now properly unlocks after finishing his content.
					</p>
					<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/v1-5") + `">
					<p class='specialText'>v1.5 - First Non-Furry Release</p>
					<p class='rawText'>Content:<br>
						Non-furry images generated for all v1 content:<br>
						- All costumes and expressions<br>
						- Logbook images<br>
						- Gathering encounter images<br>
						- Random encounter images (IE the fairy in the jar)<br>
						- Pog coins<br>
						- Magazines<br>
						- Jiggies<br>
						- 2 Angelica scenes<br>
						- 2 Bluebell's scenes<br>
						- 2 Cayenne's scenes<br>
						- 1 Garnet scene<br>
						- 1 Jasper scene<br>
						- 2 Sorbet's scenes<br>
						- 2 And Riley's scenes<br>
					</p>
					<p class='rawText'>Other changes:<br>
						- Changelog added
						- The pocketmanz and tarot card collection trophies no longer appear if you choose not to collect the cards
						- The pocketmanz and tarot jiggies are not longer required for the jiggy completion trophy
					</p>
					<p class='specialText'>v1.2 - Bugfixes</p>
					<p class='rawText'>Bugfixes:<br>
						- Fixes Angelica, Bluebell, and Cayenne's magazines repeating images instead of showing proper pages.<br>
						- Fixes a bug where transferring between PNG and WEBP versions of the game would break your clothes.<br>
						- Boosts the priority of Angelica's morning events after making her horny.<br>
						- Riley's third outfit now properly unlocks after finishing his content.
					</p>
					<p class='specialText'>v1.1 - Bugfixes</p>
					<p class='rawText'>Bugfixes:<br>
						- Rescales some elements like the side menu for a better view when using a zoomed display<br>
						- Fixes dicks not appearing in dialogue when player is bottomless<br>
						- Fixes softlock if you load a save while talking to a character during the intro<br>
						- Fixes certain items not appearing in the shop depending on your purchase order<br>
						- Fixes the foxes not unlocking if you skip the intro<br>
						- Fixes missing switch button stylings on encounter tabs on styles other than Syrup<br>
						- Fixes the main character being a featureless mannikin in dialogue on styles other than Syrup<br>
						- Fixes a light outline around the player's head when bald with dark skin.<br>
					</p>
					<img class="bigPicture" style="border-radius: 5px;" src="` + cleanupImage("changelog/v1") + `">
					<p class='specialText'>v1 - First Official Release</p>
					<p class='rawText'>Content:<br>
						- New Character: Angelica, with 2 scenes (with dick/no dick variants)<br>
						- New Character: Cayenne, with 2 scenes (with dick/no dick variants)<br>
						- New Character: Bluebell, with 2 scenes (with dick/no dick variants)<br>
						- New Characters: Jasper & Garnet, with 1 scene each<br>
						- New Character: Riley the femboy wolf, with 8 scenes<br>
						- New Character: Sorbet the wolf girl, with 7 scenes<br>
						- New Character: Sorbet the wolf girl, with 7 scenes<br>
						- 10 Morningtime scenes for Angelica<br>
						- 5 Morningtime scenes each for Bluebell, Cayenne, Riley, and Sorbet (total of 25)<br>
						- 19 Smalltalk conversations with Angelica in her office<br>
						- 21 Smalltalk conversations with Cayenne in their office<br>
						- 23 Smalltalk conversations with Bluebell in the store<br>
						- 20 Short events you can stumble upon while gathering, fishing, or hunting for bugs <br>
						- 68 total logbook entries (some require the "note taker" cheat to read)<br>
						- 45 Total NPC outfits (inc. dick/no dick variants for some characters)<br>
					</p>
					<p class='rawText'>Collectables:<br>
						- 25 available jiggies (11 being non-furry cheat-unlocked ones)<br>
						- 14 coins flippable in the collection room<br>
						- 21 tarot cards<br>
						- 24 bootleg pocketmanz cards<br>
						- 12 lewd magazines (with 1 extra variant each for characters with selectable genitals)
					</p>
					<p class='rawText'>Clothes (some require the "passion for fashion" cheat to unlock):<br>
						- 5 Hairstyles<br>
						- 25 types of upperwear<br>
						- 10 types of lowerwear<br>
						- 3 types of footwear<br>
						- 10 types of accessories
					</p>
					<p class='rawText'>New Cheats:<br>
						- cash money - Infinite money<br>
						- even the funko pops - Unlocks all collectables<br>
						- passion for fashion - Unlocks all player clothing<br>
						- free the fur - Unlocks all NPC costumes<br>
						- note taker - Unlocks all logbook entries<br>
						- jiggly bits - Swaps between masculine and feminine upper bodies<br>
						- sex em up - Switches the genitals of Angelica, Cayenne, and Bluebell<br>
						- vegetarian - Disables characters with penises (meat-free experience)<br>
						- carnivore - Disables characters without penises (game becomes a sausage fest)<br>
						- pool noodle - Unlocks all scenes in the gallery<br>
						- new name - Allows changing any character's name<br><br>
						- oowoo - Makes the game unpwayabwe UwU<br>
						- I've come to make an announcement: Shadow the Hedgehog's a bitch-ass motherfucker - Replaces portrait and dialogue with Eggman's from the snapcube real time dub series<br>
						- FUCKING PRONOUNS - Removes all pronouns from dialogue and text<br><br>
						- human alteration app - Unlocks extra clothes<br>
						- anomaly vault - Unlocks extra clothes<br>
						- rainy dayz - Unlocks extra clothes and jiggies<br>
						- princess quest - Unlocks extra clothes<br>
						- hentai university - Unlocks extra clothes and jiggies<br>
						- bitch medicenter - Unlocks extra clothes<br>
						- argent science - Unlocks extra clothes and jiggies<br>
					</p>
			`;
			break;
		}
		case "imageFailure1": {
			document.getElementById('window').innerHTML += `
				<h1 class = "windowTitle" onclick="deleteWindow()">ERROR</h1>
				<p class='rawText'>Hiya! There's been a snag, I'm afraid. You're currently playing what should be the `+imageFormat+` version of the game, but there's no images-${imageFormat}/system/ui/titleEmpty.${imageFormat} file.</p>
				<p class='rawText'>Because the backup image loaded, it seems like you downloaded the `+imageBackup+` image set for the game, but didn't replace the HTML file. Some images may be broken. Your download should have included an index.html file, or maybe noodle screwed up the downloads? Sorry!</p>
			`;
			break;
		}
		case "imageFailure2": {
			document.getElementById('window').innerHTML += `
				<h1 class = "windowTitle" onclick="deleteWindow()">ERROR</h1>
				<p class='rawText'>Hiya! There's been a snag, I'm afraid. You're currently playing what should be the `+imageFormat+` version of the game, but there's no images-${imageFormat}/system/ui/titleEmpty.${imageFormat} file.</p>
				<p class='rawText'>It seems like the game can't find either of the image sets, either .webp or .png, oh no! If you're playing on an upgrade pack, you might have forgot to actually put the upgrade pack's contents into the core game's files. Otherwise, you're somehow playing the game without any images!</p>
			`;
			break;
		}
		case "rarFailure": {
			document.getElementById('window').innerHTML += `
				<h1 class = "windowTitle" onclick="deleteWindow()">ERROR</h1>
				<p class='rawText'>It seems like you just uploaded a .rar file to the mod import zone. This isn't supported.</p>
				<p class='rawText'>If you're trying to use Aranom's animated images mod, you can't load it through here. It wasn't made with the current modding system in mind, and the larger .mp4 files would fill up the browser storage way too quickly. Depending on your method of playing the game, here are the methods of installing Aranom's mod:</p>
				<p class='rawText'>Online at https://noodlejacuzzi.neocities.org/ - Already installed, no need to do anything. Just toggle animated images in the settings menu like you would toggle any fetish preference.</p>
				<p class='rawText'>APK Version - Same as above.</p>
				<p class='rawText'>Desktop Version - Extract the .rar file, and add the images-mp4 folder into the Syrup Town game folder alongside the images-webp folder. Then you can toggle them on or off in the settings menu.</p>
			`;
			break;
		}
	}
	if (storageArray.modName != "") {
		document.getElementById("window").style.top = "40%";
		document.getElementById("window").style.height = "80vh";
		if (window.matchMedia('(orientation: portrait)').matches) {
			document.getElementById("window").style.top = "38%";
			document.getElementById("window").style.height = "70vh";
		}
	}
}

function changeStyle(index) {
	soundEffectStart("button");
	document.getElementById('stylebox'+data.player.style).style.borderColor = "#777777";
	data.player.style = index;
	document.getElementById('stylebox'+data.player.style).style.borderColor = "#FFFFFF";
}
