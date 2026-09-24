const initialAchievementArray = [];

function checkForAchievements() {
	if (data.player.currentScene == "start" || data.player.currentScene == "modHub" || data.player.currentScene == "modLoading") {
		console.debug("Not checking for achievements");
		return
	}
	//console.info(globalAchievementArray);
	//Go through a list of all achievements
	for (achievementIndex = 0; achievementIndex < globalAchievementArray.length; achievementIndex++) {
		//First check if the achievement is already unlocked, we should add the achievement until proven otherwise.
		var addAchievement = true;
		for (achievementChecker = 0; achievementChecker < data.achievements.length; achievementChecker++) {
			if (data.achievements[achievementChecker] == globalAchievementArray[achievementIndex].index) {
				addAchievement = false;
			}
		}
		if (addAchievement == true) {
			//Now check the achievement's requirements
			if (checkRequirements(globalAchievementArray[achievementIndex].requirements) == true) {
				//console.info(achievementIndex);
				var newAchievement = globalAchievementArray[achievementIndex].index;
				data.achievements.push(newAchievement);
				document.getElementById('trophiesButton').style.color = "#00AA00";
				writeSpecial("You unlocked a new trophy, check it out in the trophies list!");
			}
		}
	}
}


function loadAchievements() {

	//Sort the achievements by index
	globalAchievementArray = globalAchievementArray.sort(function(a, b) {
		var indexA = a.index;
		var indexB = b.index;
		if (indexA < indexB) {
			return -1;
		}
		if (indexA > indexB) {
			return 1;
		}
		return 0;
	});

	//generateWindow("logbook");
	document.getElementById('trophiesButton').style.color = "#0593F8";
	var achievementsPrinted = 0;
	var redColor = `linear-gradient(306deg, rgba(2,0,36,1) 0%, rgba(121, 9, 104,1) 13%, rgba(228, 119, 255,1) 100%);`;
	var blueColor = `linear-gradient(306deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 9%, rgba(0,212,255,1) 100%);`;
	var neutralColor = `linear-gradient(306deg, rgba(2,0,36,1) 0%, rgba(9, 121, 31,1) 9%, rgba(119, 255, 187,1) 100%);`;
	
	for (achievementIndex = 0; achievementIndex < globalAchievementArray.length; achievementIndex++) {
		var printAchievement = true;
		var cardColor = neutralColor;
		var cardFrame = "cardFrame";
		var achivementCharacter = "";
		for (characterIndex = 0; characterIndex < data.story.length; characterIndex++) {
			if (globalAchievementArray[achievementIndex].character == data.story[characterIndex].index) {
				achivementCharacter = data.story[characterIndex].index;
				if (data.story[characterIndex].gender == "male") {
					//cardFrame = "maleFrame";
					cardColor = blueColor;
					if (data.player.vegetarian == true) {
						printAchievement = false;
					}
				}
				if (data.story[characterIndex].gender == "female") {
					//cardFrame = "femFrame";
					cardColor = redColor;
					if (data.player.carnivore == true) {
						printAchievement = false;
					}
				}
				if (globalAchievementArray[achievementIndex].index.includes("!collect")) {
					cardColor = neutralColor;
				}
			}
		}
		console.log("now checking achivement "+globalAchievementArray[achievementIndex].index+", target character index is "+achivementCharacter);
		var achievementUnlocked = false;
		for (achievementChecker = 0; achievementChecker < data.achievements.length; achievementChecker++) {
			if (data.achievements[achievementChecker] == globalAchievementArray[achievementIndex].index) {
				achievementUnlocked = true;
			}
		}
		if (globalAchievementArray[achievementIndex].image.includes("drawCharacter")) {
			var finalImage = globalAchievementArray[achievementIndex].image; 
		}
		else {
			var finalImage = cleanupImage(globalAchievementArray[achievementIndex].image);

			//Special case: Handling the sex of system characters
			if (finalImage.includes("mayor") && checkFlag("mayor", "meat") == true) {
				cardColor = blueColor;
				finalImage = finalImage.replace("-SEX", "-meat")
			}
			if (finalImage.includes("mayor") && checkFlag("mayor", "veggie") == true) {
				cardColor = redColor;
				finalImage = finalImage.replace("-SEX", "")
			}
			if (finalImage.includes("shopkeep") && checkFlag("shopkeep", "meat") == true) {
				cardColor = blueColor;
				finalImage = finalImage.replace("-SEX", "-meat")
			}
			if (finalImage.includes("shopkeep") && checkFlag("shopkeep", "veggie") == true) {
				cardColor = redColor;
				finalImage = finalImage.replace("-SEX", "")
			}
			if (finalImage.includes("carpenter") && checkFlag("carpenter", "meat") == true) {
				cardColor = blueColor;
				finalImage = finalImage.replace("-SEX", "-meat")
			}
			if (finalImage.includes("carpenter") && checkFlag("carpenter", "veggie") == true) {
				cardColor = redColor;
				finalImage = finalImage.replace("-SEX", "")
			}
			finalImage = finalImage.replace("-SEX", "")
		}

		//Special case: Handling omni, carnivore and vegetarian modes
		if (finalImage.includes("foxAchievOmni")) {
			if (data.player.vegetarian == true) {
				finalImage = finalImage.replace("foxf/foxAchievOmni", "foxf/model/base");
			}
			if (data.player.carnivore == true) {
				finalImage = finalImage.replace("foxf/foxAchievOmni", "foxm/model/base");
			}
		}
		
		//Special case: Hiding impossible achievements
		if (checkItem("pocket-eev-0") != true) {
			if (finalImage.includes("hyena/pocket")) {
				printAchievement = false;
			}
		}
		if (checkItem("tarot0") != true) {
			if (finalImage.includes("sadogato/magical")) {
				printAchievement = false;
			}
		}
		if (data.player.carnivore == true || data.player.vegetarian == true) {
			if (finalImage.includes("foxf/foxAchiev2")) {
				printAchievement = false;
			}
		}
		if (globalAchievementArray[achievementIndex].image.includes("drawCharacter")) {
			var imageToPrint = eval(finalImage);
		}
		else {
			switch (globalAchievementArray[achievementIndex].frame) {
				case "rare": {
					var imageToPrint = `<img class="cardImage" src="`+finalImage+`" style="position:absolute; top:0px; left:0px; width:100%;height:100%;">`
					break;
				}
				case "ultraRare": {
					var imageToPrint = `<img class="cardImage" src="`+finalImage+`" style="position:absolute; top:5%; left:5%; width:90%;height:90%;">`
					break;
				}
				default: {
					var imageToPrint = `<img class="cardImage" src="`+finalImage+`" >`
				}
			}
		}

		if (printAchievement == true) {
			achievementsPrinted += 1;
			if (achievementUnlocked == true) {
				switch (globalAchievementArray[achievementIndex].frame) {
					case "rare": {
						document.getElementById("achievements").innerHTML += `
						<div class="flip-card-inner">
							<div class="flip-card-front">
								<div class="cardContainer">
									`+imageToPrint+`
									<img class="cardFrame" src="`+cleanupImage("neocards/cardFrame")+`">
								</div>
								<p class = "achievementName">`+replaceCodenames(globalAchievementArray[achievementIndex].name)+`</p>
								<p class = "achievementText">`+replaceCodenames(globalAchievementArray[achievementIndex].description)+`</p>
							</div>
						</div>
						`;
						break;
					}
					case "ultraRare": {
						document.getElementById("achievements").innerHTML += `
						<div class="flip-card-inner">
							<div class="flip-card-front" style="background:`+cardColor+`">
								<div class="cardBackground" style="position:absolute;top:0px;left:0px;height:100%;width:100%;background-color:white;">
								</div>
								<div class="cardBackground shimmer" style="position:absolute;top:0px;left:0px;height:100%;width:100%;background:`+cardColor+`">
								</div>
								<div class="cardContainer">
									<img class="cardFrame" src="`+cleanupImage("neocards/cardFrame")+`">
									`+imageToPrint+`
								</div>
								<p class = "achievementName">`+replaceCodenames(globalAchievementArray[achievementIndex].name)+`</p>
							</div>
							<div class="flip-card-back" style="background:linear-gradient(306deg, rgba(2,0,36,0) 0%, rgba(9,9,121,0) 9%, rgba(0,212,255,0) 100%);">
								<div class="cardBackground" style="position:absolute;top:0px;left:0px;height:100%;width:100%;background-color:white;">
								</div>
								<div class="cardBackground shimmer" style="position:absolute;top:0px;left:0px;height:100%;width:100%;background:linear-gradient(306deg, rgba(2,0,36,1) 0%, rgba(121,9,9,1) 13%, rgba(255,119,119,1) 100%)">
								</div>
								<div class="cardContainer">
									<img class="cardFrame" src="`+cleanupImage("neocards/cardFrame")+`">
									`+imageToPrint+`
								</div>
							</div>
						</div>
						`;
						break;
					}
					case "vaporRare": {
						var finalColor = "#FFFFFF";
						for (beanCounter = 0; beanCounter < data.story.length; beanCounter++) {
							if (globalAchievementArray[achievementIndex].index.includes(data.story[beanCounter].index)) {
								finalColor = data.story[beanCounter].color;
							}
						}
						document.getElementById("achievements").innerHTML += `
						<div class="flip-card-inner">
							<div class="flip-card-front" style="background:`+cardColor+`">
								<div class="cardContainer">
									<img class="cardFrame shimmer" src="`+cleanupImage("neocards/cardFrame")+`">
									<img class = "textThumbRoyalty shimmer" style="
										position:absolute;
										top:5%; 
										left:5%; 
										width:90%;
										height:90%;
										-webkit-filter: drop-shadow(10px 0px 0 `+finalColor+`)
										drop-shadow(-20px -10px 0 `+finalColor+`);
										filter: drop-shadow(10px 0px 0 `+finalColor+`)
										drop-shadow(-20px -10px 0 `+finalColor+`);"
									src = "`+finalImage+`">
									<img class = "textThumbRoyalty" src = "`+finalImage+`" style="
										position:absolute;
										top:5%; 
										left:5%; 
										width:90%;
										height:90%;
									">
								</div>
							</div>
							<div class="flip-card-back">
								<div class="cardContainer">
									<img class="cardFrame shimmer" src="`+cleanupImage("neocards/cardFrame")+`">
									<img class = "textThumbRoyalty shimmer" style="
										position:absolute;
										top:5%; 
										left:5%; 
										width:90%;
										height:90%;
										-webkit-filter: drop-shadow(10px 0px 0 `+finalColor+`)
										drop-shadow(-20px -10px 0 `+finalColor+`);
										filter: drop-shadow(10px 0px 0 `+finalColor+`)
										drop-shadow(-20px -10px 0 `+finalColor+`);"
									src = "`+finalImage+`">
									<img class = "textThumbRoyalty" src = "`+finalImage+`" style="
										position:absolute;
										top:5%; 
										left:5%; 
										width:90%;
										height:90%;
									">
								</div>
							</div>
						</div>
						<p>`+replaceCodenames(globalAchievementArray[achievementIndex].description)+`</p>`;
						break;
					}
					default: {
						document.getElementById("achievements").innerHTML += `
						<div class="flip-card-inner">
							<div class="flip-card-front" style="background:`+cardColor+`">
								<div class="cardContainer">
									<img class="cardImage" src="`+finalImage+`" style="position:absolute; top:0px; left:0px; width:100%;height:100%;">
									<img class="cardFrame" src="`+cleanupImage("neocards/cardFrame")+`">
								</div>
								<p class = "achievementName">`+replaceCodenames(globalAchievementArray[achievementIndex].name)+`</p>
								<p class = "achievementText">`+replaceCodenames(globalAchievementArray[achievementIndex].description)+`</p>
							</div>
							<div class="flip-card-back">
								<div class="cardContainer">
									<img class="cardImage" src="`+finalImage+`" style="position:absolute; top:10%; left:10%; width:80%;height:80%;border-radius:10px;border:3px solid;">
									<img class="cardFrame" src="`+cleanupImage("neocards/cardFrame")+`">
								</div>
							</div>
						</div>
						`;
					break;
					}
				}
			}
			else {
				document.getElementById("achievements").innerHTML += `
				<div class="flip-card-inner">
					<div class="flip-card-front">
						<img class="cardFrame" src="`+cleanupImage("neocards/emptyFrame")+`" style="filter:brightness(30%);background:`+cardColor+`">
						<div class="cardContainer"style="position:absolute; 
							top:5%; 
							left:5%; 
							width:90%;
							height:90%;
							filter: brightness(0);
							opacity: 1;">
								`+imageToPrint+`
						</div>
						<p class = "achievementName">`+replaceCodenames(globalAchievementArray[achievementIndex].name)+`</p>
						<p class = "achievementText">`+replaceCodenames(globalAchievementArray[achievementIndex].description)+`</p>
					</div>
				</div>
				`;
			}
		}
	}
	//document.getElementById('achievements').style.height = "500vh";
}
