//Gallery functions
var galleryFiltersAuthor = "";
var galleryFiltersArtist = "";

function filterGallery(type, filter) {
	switch (type) {
		case "author": {
			if (galleryFiltersAuthor.includes(filter) != true) {
				console.log("This button will filter out the "+type+" "+filter);
				galleryFiltersAuthor += filter;
			}
			else {
				galleryFiltersAuthor = galleryFiltersAuthor.replace(filter, "");
			}
			break;
		}
		case "artist": {
			if (galleryFiltersArtist.includes(filter) != true) {
				console.log("This button will filter out the "+type+" "+filter);
				galleryFiltersArtist += filter;
			}
			else {
				galleryFiltersArtist = galleryFiltersArtist.replace(filter, "");
				console.log("Removing the filter: "+type+" "+filter);
			}
			break;
		}
	}
	writeScene("system", "gallery");
}

function generateGalleryNav() {
	//Old code to filter gallery by author
	/*
	var authorsList = [];
	//Create the grid of buttons to sort by author
	document.getElementById('output').innerHTML += `
	<p style="margin:0px;" class="centeredText">Filter by author:</p>
	<div class="buttonGrid" id="authorGrid">
	</div>
	`;
	//Collect the list of authors by combing the data.story variable
	for (authorIndex = 0; authorIndex < data.story.length; authorIndex++) {
		if (authorsList.includes(data.story[authorIndex].author) != true) {
			authorsList.push(data.story[authorIndex].author);
		}
	}
	//Print a button for each author that will filter out that author
	for (i = 0; i < authorsList.length; i++) {
		var color = "#FFFFFF";
		if (galleryFiltersAuthor.includes(authorsList[i]) == true) {
			color = "#00BB00";
		}
		document.getElementById('authorGrid').innerHTML += `
			<p id ="authorGridButton`+authorsList[i]+`" class="choiceText" style="color:`+color+`;" onclick="filterGallery('author', '`+authorsList[i]+`')">
				` + authorsList[i] + `
			</p>
		`;
		console.log("Creating a button will that will filter out the author "+authorsList[i]);
	}
	*/
	
	removeFlag("player", "gallery");
	document.getElementById('output').innerHTML += `
	<div class="galleryGrid" id="galleryGrid">
	</div>
	`;
	var galleryFontSize = "var(--fs-large, 1.5em)";
	
	for (i = 0; i < data.story.length; i++) {
		var printCharacter = true;
		if (data.story[i].gender == "female" && data.player.carnivore == true) {
			printCharacter = false;
		}
		if (data.story[i].gender == "male" && data.player.vegetarian == true) {
			printCharacter = false;
		}
		if (galleryFiltersAuthor != "") {
			if (galleryFiltersAuthor.includes(data.story[i].author) != true) {
				printCharacter = false;
			}
		}
		if (countScenes(data.story[i].index)[1] == 0) {
			printCharacter = false;
		}
		if (printCharacter == true) {
			if (data.story[i].trust > 0 || checkFlag("player", "events") == true) {
				var charType = "old"
				for (neoCharIndex = 0; neoCharIndex < finishedCharactersArray.length; neoCharIndex++) {
					if (finishedCharactersArray[neoCharIndex] == data.story[i].index) {
						//console.info("neoCharIndex: "+neoCharIndex);
						charType = "new";
					}
				}
				if (charType == "old") {
					var finalThumbnail = `images-${imageFormat}/`+ data.story[i].index +`/`+ data.story[i].outfitDefault +`/`+data.story[i].emotionDefault+`.${imageFormat}`
					finalThumbnail = cleanupImage(finalThumbnail);
					var finalBackup = `images-${imageFormat}/`+ data.story[i].index +`/`+ data.story[i].outfitDefault +`/`+data.story[i].emotionDefault+`.${imageBackup}`
					var imageToPrint = `<img class="thumbnailImage syrup" onerror="javascript:this.src='`+finalBackup+`';" src = "${finalThumbnail}">`;
				}
				else {
					var imageToPrint = drawCharacter(data.story[i].index, "class:thumbnailImage syrup;clothes:clothed;");
				}
				if (checkFlag("player", "events") != true) {
					var completionStatus = ` - `+countScenes(data.story[i].index)[0]+`/`+countScenes(data.story[i].index)[1];
				}
				else {
					var completionStatus = "";
				}
				var functionToRun = "generateGalleryPage('"+data.story[i].index+"')";
				var finalText = "Recall "+data.story[i].fName+"s scenes";
				generateGalleryTab(data.story[i].color, imageToPrint, completionStatus, galleryFontSize, data.story[i].fName, functionToRun, finalText);
			}
		}
	}
	if (countScenes("player")[0] > 0 || checkFlag("player", "events") == true) {
		generateGalleryTab(data.player.color, drawPlayer("class:thumbnailImage syrup;"), " - "+countScenes("player")[0]+"/"+countScenes("player")[1], galleryFontSize, "Misc Scenes", "generateGalleryPage('player')", "Recall additional scenes");
	}
	//data.story[i].artist
	//data.story[i].author
}

function generateGalleryTab(color, image, completionStatus, galleryFontSize, fName, functionToRun, finalText) {
	console.info("Generating gallery tab for "+fName+", length of name is "+fName.length);
	document.getElementById('output').innerHTML += `
	<div class="galleryGrid" id="galleryGrid">
	</div>
	`;
	document.getElementById('galleryGrid').innerHTML += `
	<div class="dialogueContainer syrup" style="border-color: `+color+`;" onclick="`+functionToRun+`" >
		<div class="thumbnailContainer syrup">
			<div class="thumbnailBorder syrup">
				`+image+`
			</div>
		</div>
		<div class="textContainer syrup">
			<div class="textBorder syrup">
				<div class="textContent syrup">
					<div style="width: max-content;">
						<p class="textName syrup" style="color: `+color+`; font-size: `+galleryFontSize+`;">`+fName+completionStatus+`</p>
						<hr class="textDivider syrup" style="border-color: `+color+`;">
					</div>
					<svg style="height: 150px;	position: absolute;	width: 225px;	right: 15px;	top: 15px;	z-index: -1;" xmlns="http://www.w3.org/2000/svg" version="1.0" width="340.000000pt" height="224.000000pt" viewBox="0 0 340.000000 224.000000" preserveAspectRatio="xMidYMid meet">
						<g transform="translate(0.000000,224.000000) scale(0.100000,-0.100000)" fill="#F5152E" opacity="0.3" stroke="none">
							<path d="M2590 2180 c-91 -12 -142 -52 -171 -132 -26 -74 19 -181 170 -406 132 -196 142 -207 167 -194 18 9 37 17 97 41 211 84 365 169 424 233 28 30 53 89 53 125 -1 76 -101 185 -182 198 -50 9 -131 -3 -186 -26 -61 -27 -76 -24 -108 19 -51 67 -78 94 -119 117 -48 27 -85 34 -145 25z"></path>
							<path d="M287 2126 c-15 -7 -43 -26 -61 -44 -81 -76 -106 -209 -86 -455 7 -87 16 -160 20 -162 4 -2 20 0 36 5 16 6 78 26 138 46 99 32 138 47 231 90 67 31 132 107 153 178 15 51 -1 126 -33 156 -24 22 -36 23 -180 8 -29 -3 -30 -1 -37 47 -11 83 -19 104 -48 125 -32 23 -90 25 -133 6z"></path>
							<path d="M1871 942 c-67 -11 -115 -81 -145 -214 -7 -29 -23 -35 -54 -19 -68 34 -186 42 -228 15 -45 -30 -76 -98 -77 -168 -1 -107 37 -170 148 -245 69 -47 193 -111 215 -111 5 0 18 -4 28 -9 23 -12 60 -26 102 -41 19 -7 44 -16 55 -21 58 -24 111 -37 120 -28 10 10 30 81 75 274 37 161 48 295 30 370 -30 126 -153 216 -269 197z"></path>
						</g>
					</svg>
					<svg class="dialogueBackground syrup">
					</svg>
					<span class = "choiceText" style = "font-size:`+galleryFontSize+`; width:initial;" onclick="`+functionToRun+`" >`+finalText+`</span>
				</div>
			</div>
		</div>
	</div>
	`;
}

function generateGalleryPage(index) {
	document.getElementById('output').innerHTML = '';
	//writeBig("images-"+imageFormat+"/"+data.story[index].index+"/"+data.story[index].outfitDefault+"/"+data.story[index].emotionDefault+"."+imageFormat);
	document.getElementById('output').innerHTML += `
		<div id="wardrobeGrid" style="display:grid; grid-template-columns:repeat(var(--wardrobe-cols, 3), 1fr);">
		</div>
	`;
	var galleryCount = 0;
	var galleryUnlocked = 0;
	var characterTarget = 0;
	var characterTarget = index
	
	if (characterTarget != 0) {
		for (eventCharacter = 0; eventCharacter < globalEventArray.length; eventCharacter++) {
			if (globalEventArray[eventCharacter].index == characterTarget) {
				galleryCount = 0;
				galleryUnlocked = 0;

				for (eventIndexCounter = 0; eventIndexCounter < globalEventArray[eventCharacter].events.length; eventIndexCounter++) {
					if (globalEventArray[eventCharacter].index == "mayor" || globalEventArray[eventCharacter].index == "carpenter" || globalEventArray[eventCharacter].index == "shopkeep") {
						if (checkFlag(globalEventArray[eventCharacter].index, "meat")) {
							if (globalEventArray[eventCharacter].events[eventIndexCounter].index.includes("Meat")) {
								galleryCount += 1;
							}
						}
						else {
							if (globalEventArray[eventCharacter].events[eventIndexCounter].index.includes("Veggie")) {
								galleryCount += 1;
							}
						}
					}
					else {
						galleryCount += 1;
					}
					if (galleryCheck(globalEventArray[eventCharacter].index, globalEventArray[eventCharacter].events[eventIndexCounter].index) == true || checkFlag("player", "events") == true) {
						var displayEvent = true;
						if (globalEventArray[eventCharacter].index == "mayor" || globalEventArray[eventCharacter].index == "carpenter" || globalEventArray[eventCharacter].index == "shopkeep") {
							if (checkFlag(globalEventArray[eventCharacter].index, "meat")) {
								if (globalEventArray[eventCharacter].events[eventIndexCounter].index.includes("Meat")) {
									galleryUnlocked += 1;
								}
							}
							else {
								if (globalEventArray[eventCharacter].events[eventIndexCounter].index.includes("Veggie")) {
									galleryUnlocked += 1;
								}
							}
						}
						else {
							galleryUnlocked += 1;
						}
						if (!globalEventArray[eventCharacter].events[eventIndexCounter].image) {
							displayEvent = false
						}
						else {
							var thumbnailImage = globalEventArray[eventCharacter].events[eventIndexCounter].image
							if (thumbnailImage == "") {
								//Scan the event for the first instance of a line starting with "im "
								thumbnailImage = globalEventArray[eventCharacter].events[eventIndexCounter].content.split("\n").find(line => line.startsWith("im "));
								thumbnailImage = thumbnailImage.substring(3).trim();
							}
							else if (thumbnailImage.includes("/") != true) {
								thumbnailImage = globalEventArray[eventCharacter].index+"/"+thumbnailImage
							}
							thumbnailImage = cleanupImage(thumbnailImage);
							if (thumbnailImage.includes("SEX") == true) {
								if (thumbnailImage.includes("mayor")) {
									if (checkFlag("mayor", "meat")) {
										thumbnailImage = thumbnailImage.replace("SEX", "Meat");
									}
									if (checkFlag("mayor", "veggie")) {
										thumbnailImage = thumbnailImage.replace("SEX", "Veggie");
									}
								}
								if (thumbnailImage.includes("carpenter")) {
									if (checkFlag("carpenter", "meat")) {
										thumbnailImage = thumbnailImage.replace("SEX", "Meat");
									}
									if (checkFlag("carpenter", "veggie")) {
										thumbnailImage = thumbnailImage.replace("SEX", "Veggie");
									}
								}
								if (thumbnailImage.includes("shopkeep")) {
									if (checkFlag("shopkeep", "meat")) {
										thumbnailImage = thumbnailImage.replace("SEX", "Meat");
									}
									if (checkFlag("shopkeep", "veggie")) {
										thumbnailImage = thumbnailImage.replace("SEX", "Veggie");
									}
								}
							}
						}
						if (!globalEventArray[eventCharacter].events[eventIndexCounter].tags) {
							globalEventArray[eventCharacter].events[eventIndexCounter].tags = "";
						}
						if (fetishes(globalEventArray[eventCharacter].events[eventIndexCounter].tags) == false) {
							displayEvent = false
						}
						if (globalEventArray[eventCharacter].events[eventIndexCounter].name == "mini") {
							displayEvent = false
						}
						if (displayEvent == true) {
							document.getElementById('wardrobeGrid').innerHTML += `
								<img class="bigPicture" id="wardrobe`+globalEventArray[eventCharacter].events[eventIndexCounter].index+`" src="` + thumbnailImage + `"
								onclick="galleryEvent('`+globalEventArray[eventCharacter].index+`','`+globalEventArray[eventCharacter].events[eventIndexCounter].index+`')",
								onmouseover="wardrobeMouseOver('wardrobe`+globalEventArray[eventCharacter].events[eventIndexCounter].index+`')"
								onmouseout="wardrobeMouseOut('wardrobe`+globalEventArray[eventCharacter].events[eventIndexCounter].index+`')"
								style="filter:brightness(50%);max-height:initial;width:100%;">
							`;
						}
					}
				}
			}
		}
	}
	var sceneCount = countScenes(index);
	writeHTML(`
		t `+sceneCount[0]+` of `+sceneCount[1]+` scenes unlocked
	`);
	writeFunction("writeScene('system', 'gallery')", "Go back");
}

function generateArtifacts() {
	var galleryFontSize = "var(--fs-xlarge, 1.5em)";
	for (artifactCounter = 0; artifactCounter < artifactArray.length; artifactCounter++) {
		if (checkItem(artifactArray[artifactCounter]) == true) {
			if (checkFlag("player", artifactArray[artifactCounter]+"-equipFirst") != true) {
				var finalScene = "writeScene('system', '"+artifactArray[artifactCounter]+"-equipFirst');";
			}
			else {
				var finalScene = "writeScene('system', '"+artifactArray[artifactCounter]+"-equipRepeat');";
			}
			generateGalleryTab(
				data.player.color, 
				`<img class="thumbnailImage syrup" src = "`+cleanupImage("artifacts/"+artifactArray[artifactCounter]+"1")+`">`,
				" - "+countScenes(artifactArray[artifactCounter])[0]+"/"+countScenes(artifactArray[artifactCounter])[1], 
				galleryFontSize,
				 getItemName(artifactArray[artifactCounter]), 
				 finalScene, 
				 "Use the "+getItemName(artifactArray[artifactCounter])
			);
		}
	}
}

function countAllScenes() {
	var sceneCount = 0;
	var sceneUnlocked = 0;
	for (charIndex = 0; charIndex < data.story.length; charIndex++) {
		var addScenes = true;
		if (data.player.vegetarian == true) {
			if (data.story[charIndex].gender == "male") {
				addScenes = false;
			}
		}
		if (data.player.carnivore == true) {
			if (data.story[charIndex].gender == "female") {
				addScenes = false;
			}
		}
		if (data.player.characterWhitelist.includes(data.story[charIndex].index) == true) {
			addScenes = true;
		}
		if (data.player.characterBlacklist.includes(data.story[charIndex].index) == true) {
			addScenes = false;
		}
		//console.info("Counting scenes for " + data.story[charIndex].index + ", should add scenes: " + addScenes);
		if (addScenes == true) {
			sceneCount += parseInt(countScenes(data.story[charIndex].index)[0]);
			sceneUnlocked += parseInt(countScenes(data.story[charIndex].index)[1]);
		}
	}
	sceneCount += parseInt(countScenes("player")[0]);
	sceneUnlocked += parseInt(countScenes("player")[1]);
	return [sceneCount, sceneUnlocked];
}

function countScenes(character) {
	var index = "";
	var indexType = "";
	// Find the character in the globalEventArray
	for (galleryCounter = 0; galleryCounter < globalEventArray.length; galleryCounter++) {
		if (globalEventArray[galleryCounter].index == character) {
			console.log("Counting scenes for character, found " + globalEventArray[galleryCounter].index);
			index = globalEventArray[galleryCounter].index
			indexType = "character";
		}
	}
	for (galleryCounter = 0; galleryCounter < artifactArray.length; galleryCounter++) {
		if (artifactArray[galleryCounter] == character) {
			index = artifactArray[galleryCounter]
			indexType = "artifact";
		}
	}
	var galleryCount = 0;
	var galleryUnlocked = 0;
	if (indexType == "character") {
		for (eventCharacter = 0; eventCharacter < globalEventArray.length; eventCharacter++) {
			galleryCount = 0;
			galleryUnlocked = 0;
			if (globalEventArray[eventCharacter].index == character) {
				for (eventIndexCounter = 0; eventIndexCounter < globalEventArray[eventCharacter].events.length; eventIndexCounter++) {
					var galleryCountPlus = 0;
					var galleryUnlockedPlus = 0;
					//Count the galleryCount, which is the total number of scenes
					galleryCountPlus++;
					//Special code when dealing with mayor, carpenter, and shopkeep
					if (globalEventArray[eventCharacter].index == "mayor" || globalEventArray[eventCharacter].index == "carpenter" || globalEventArray[eventCharacter].index == "shopkeep") {
						if (globalEventArray[eventCharacter].events[eventIndexCounter].index.includes("Meat")) {
							if (checkFlag(globalEventArray[eventCharacter].index, "veggie")) {
								galleryCountPlus--;
							}
						}
						if (globalEventArray[eventCharacter].events[eventIndexCounter].index.includes("Veggie")) {
							if (checkFlag(globalEventArray[eventCharacter].index, "meat")) {
								galleryCountPlus--;
							}
						}
					}
					if (globalEventArray[eventCharacter].events[eventIndexCounter].name == "mini") {
						galleryCountPlus--;
						//console.info("Gallery count for "+globalEventArray[eventCharacter].index+" "+globalEventArray[eventCharacter].events[eventIndexCounter].index+" is "+galleryCount);
					}
					if (fetishes(globalEventArray[eventCharacter].events[eventIndexCounter].tags) == false) {
						galleryCountPlus--;
					}
					if (galleryCountPlus > 0) {
						galleryCount ++;
					}

					//Count the galleryUnlocked, which is the number of scenes that have been unlocked
					console.log("Checking if "+globalEventArray[eventCharacter].index+" "+globalEventArray[eventCharacter].events[eventIndexCounter].index+" is unlocked: "+galleryCheck(globalEventArray[eventCharacter].index, globalEventArray[eventCharacter].events[eventIndexCounter].index));
					if (galleryCheck(globalEventArray[eventCharacter].index, globalEventArray[eventCharacter].events[eventIndexCounter].index) == true) {
						galleryUnlockedPlus += 1;
						//Special code when dealing with mayor, carpenter, and shopkeep
						if (globalEventArray[eventCharacter].index == "mayor" || globalEventArray[eventCharacter].index == "carpenter" || globalEventArray[eventCharacter].index == "shopkeep") {
							if (globalEventArray[eventCharacter].events[eventIndexCounter].index.includes("Meat")) {
								if (checkFlag(globalEventArray[eventCharacter].index, "veggie")) {
									galleryUnlockedPlus--;
								}
							}
							if (globalEventArray[eventCharacter].events[eventIndexCounter].index.includes("Veggie")) {
								if (checkFlag(globalEventArray[eventCharacter].index, "meat")) {
									galleryUnlockedPlus--;
								}
							}
						}
						if (globalEventArray[eventCharacter].events[eventIndexCounter].name == "mini") {
							galleryUnlockedPlus--;
						}
						if (fetishes(globalEventArray[eventCharacter].events[eventIndexCounter].tags) == false) {
							galleryUnlockedPlus--;
						}
						if (galleryUnlockedPlus > 0) {
							galleryUnlocked ++;
						}
					}
				}
				return [galleryUnlocked, galleryCount];
			}
		}
	}
	else if (indexType == "artifact") {
		//Counte every character (including the player) scene with this artifact's codename in the index
		galleryCount = 0;
		galleryUnlocked = 0;
		for (eventCharacter = 0; eventCharacter < globalEventArray.length; eventCharacter++) {
			for (eventIndexCounter = 0; eventIndexCounter < globalEventArray[eventCharacter].events.length; eventIndexCounter++) {
				if (globalEventArray[eventCharacter].events[eventIndexCounter].index.includes(index+"-")) {
					var galleryCountPlus = 0;
					var galleryUnlockedPlus = 0;
					galleryCountPlus++;
					if (fetishes(globalEventArray[eventCharacter].events[eventIndexCounter].tags) == false) {
						galleryCountPlus--;
					}
					if (globalEventArray[eventCharacter].events[eventIndexCounter].name == "mini") {
						galleryCountPlus--;
						//console.info("Gallery count for "+globalEventArray[eventCharacter].index+" "+globalEventArray[eventCharacter].events[eventIndexCounter].index+" is "+galleryCount);
					}
					if (galleryCountPlus > 0) {
						galleryCount ++;
					}

					if (galleryCheck(globalEventArray[eventCharacter].index, globalEventArray[eventCharacter].events[eventIndexCounter].index) == true) {
						galleryUnlockedPlus ++;
						if (fetishes(globalEventArray[eventCharacter].events[eventIndexCounter].tags) == false) {
							galleryUnlockedPlus--;
						}
						if (globalEventArray[eventCharacter].events[eventIndexCounter].name == "mini") {
							galleryUnlockedPlus--;
							//console.info("Gallery count for "+globalEventArray[eventCharacter].index+" "+globalEventArray[eventCharacter].events[eventIndexCounter].index+" is "+galleryCount);
						}
						if (galleryUnlockedPlus > 0) {
							galleryUnlocked ++;
						}

					}
				}
			}
		}
		return [galleryUnlocked, galleryCount];
	}
	else {
		return [galleryUnlocked, galleryCount];
	}
}

function galleryCheck(character, index) {
	const galleryTarget = globalEventArray.find(target => target.index === character);
	if (galleryTarget == null) {
		console.error("Error: Could not find the character "+character);
		return(false);
	}
	else {
		const eventTarget = galleryTarget.events.find(target => target.index === index);
		if (eventTarget == null) {
			console.error("Error: Could not find the event "+index+" for the character "+character);
			return(false);
		}
		else {
			var eventCheck = {character: galleryTarget.index, index: eventTarget.index};
			var finalResult = false;
			for (galleryCheckIndex = 0; galleryCheckIndex < data.gallery.length; galleryCheckIndex++) {
				if (data.gallery[galleryCheckIndex].character.includes(eventCheck.character) && data.gallery[galleryCheckIndex].index.includes(eventCheck.index)) {
					finalResult = true;
				}
			}
			return(finalResult);
		}
	}
}