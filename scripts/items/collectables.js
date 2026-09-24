var initialCollectablesArray = [
    {index: "mayorPog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/mayorPog"},
    {index: "carpenterPog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/carpenterPog"},
    {index: "shopkeepPog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/shopkeepPog"},
    {index: "foxfPog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/foxfPog"},
    {index: "foxmPog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/foxmPog"},
    {index: "wolfPog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/wolfPog"},
    {index: "sadogatoPog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/sadoPog"},
    {index: "milfPog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/milfPog"},
    {index: "nunPog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/nunPog"},
    {index: "mommyPog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/mommyPog"},
    {index: "mesuPog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/mesuPog"},
    {index: "fashionistaPog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/fashPog"},
    {index: "hyenaPog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/hyenaPog"},
    {index: "doePog", name: "Test Pog", value: 1, category: "pogs", image: "pogs/doePog"},

    /*Colors:
    color: "#CCCCCC", - Normal
    color: "#FA3121", - Fire
    color: "#2E8EB4", - Water
    color: "#F7B63E", - Electric
    color: "#75A245", - Grass
    color: "#CC5277", - Psychic
    color: "#877F7A", - Steel
    color: "#EC6933", - Fighting
    color: "#877F7A", - Steel
    color: "#3D3D33", - Dark
    color: "#AB356C", - Fairy
    color: "#77631C", - Dragon
    */

	{category: `tarot`, index: "tarot0", name: "The Cat", value: 0, set: "tarot", image: "tarot/0"},
	{category: `tarot`, index: "tarot1Meat", name: "The Hyena", value: 0, set: "tarot", image: "tarot/1SEX"},
	{category: `tarot`, index: "tarot2", name: "The Shark", value: 0, set: "tarot", image: "tarot/2"},
	{category: `tarot`, index: "tarot3Meat", name: "The Tiger", value: 0, set: "tarot", image: "tarot/3SEX"},
	{category: `tarot`, index: "tarot4Meat", name: "The Lion", value: 0, set: "tarot", image: "tarot/4SEX"},
	{category: `tarot`, index: "tarot5", name: "The Raven", value: 0, set: "tarot", image: "tarot/5"},
	{category: `tarot`, index: "tarot6", name: "The Antelope", value: 0, set: "tarot", image: "tarot/6"},
	{category: `tarot`, index: "tarot7Meat", name: "The Goat", value: 0, set: "tarot", image: "tarot/7SEX"},
	{category: `tarot`, index: "tarot8Meat", name: "The Horse", value: 0, set: "tarot", image: "tarot/8SEX"},
	{category: `tarot`, index: "tarot9", name: "The Gecko", value: 0, set: "tarot", image: "tarot/9"},
	{category: `tarot`, index: "tarot10", name: "The Owl", value: 0, set: "tarot", image: "tarot/10"},
	{category: `tarot`, index: "tarot11", name: "The Wolf", value: 0, set: "tarot", image: "tarot/11"},
	{category: `tarot`, index: "tarot12", name: "The Snake", value: 0, set: "tarot", image: "tarot/12"},
	{category: `tarot`, index: "tarot13", name: "The Moth", value: 0, set: "tarot", image: "tarot/13"},
	{category: `tarot`, index: "tarot14", name: "The Bee", value: 0, set: "tarot", image: "tarot/14"},
	{category: `tarot`, index: "tarot15Meat", name: "The Squirrel", value: 0, set: "tarot", image: "tarot/15SEX"},
	{category: `tarot`, index: "tarot16", name: "The Fox", value: 0, set: "tarot", image: "tarot/16"},
	{category: `tarot`, index: "tarot17Meat", name: "The Dog", value: 0, set: "tarot", image: "tarot/17SEX"},
	{category: `tarot`, index: "tarot18Meat", name: "The Rabbit", value: 0, set: "tarot", image: "tarot/18SEX"},
	{category: `tarot`, index: "tarot19Meat", name: "The Dragon", value: 0, set: "tarot", image: "tarot/19SEX"},
	{category: `tarot`, index: "tarot20", name: "The Learned", value: 0, set: "tarot", image: "tarot/20n", requirements: "?trophy !collect5;"},

    // Jiggy entries may add two OPTIONAL fields for the mid-game image-swap feature (see jiggy.js header):
    //   swapImages:  [`mayor/jiggyCozy-2`, `mayor/jiggyCozy-3`]  // cycle = [base image, ...these], index wraps
    //   swapTrigger: `every` | `every 4` | 25                    // per-link, per-N-links, or per-N% (default 50%)
    // Omit both for normal single-image puzzles (everything below = unchanged).
    {category: `jiggy`, index: `foxm-core1`, set: "Core", image: `foxm/jiggyCore1`, pieces: 75, name: `Submissive Twin`, desc: `A jiggy of foxmF.<br>Part of the SET Set.`, tags: "male", requirements: "?flag foxf intro;",},
    {category: `jiggy`, index: `foxf-core1`, set: "Core", image: `foxf/jiggyCore1`, pieces: 75, name: `Dominant Twin`, desc: `A jiggy of foxfF.<br>Part of the SET Set.`, tags: "female", requirements: "?flag foxf intro;",},

    {category: `jiggy`, set: "Misc", index: `tarot/20n`, image: `tarot/20n`, pieces: 100, name: `Tarot`, desc: `The Learned, a reward for collecting every tarot card.`, requirements: "?trophy !collect5;", tags: "female"},
    {category: `jiggy`, set: "Misc", index: `cheatRainy1c`, image: `jiggy/cheatRainy1c`, pieces: 100, name: `Rainy DayZ (C)`, desc: `A jiggy of horrible (but sexy) fate.`, requirements: "?flag player rainy;", tags: "dickgirl"},
    {category: `jiggy`, set: "Misc", index: `cheatUniversityc`, image: `jiggy/cheatUniversityc`, pieces: 150, name: `Hentai University (C)`, desc: `A jiggy of a chocolate demon, extra small!<br>Upgraded with v6!`, requirements: "?flag player university;", tags: "male"},
    {category: `jiggy`, set: "Misc", index: `cheatUniversityv`, image: `jiggy/cheatUniversityv`, pieces: 150, name: `Hentai University (V)`, desc: `A jiggy of a chocolate demon, extra large!<br>Upgraded with v6!`, requirements: "?flag player university;", tags: "female"},
    {category: `jiggy`, set: "Misc", index: `cheatMisc3c`, image: `jiggy/cheatMisc3c`, pieces: 100, name: `World Altered (C)`, desc: `A jiggy of a woman altered with an app. Meat ver.`, requirements: "?flag player haa;", tags: "dickgirl"},
    {category: `jiggy`, set: "Misc", index: `cheatMisc3v`, image: `jiggy/cheatMisc3v`, pieces: 100, name: `World Altered (V)`, desc: `A jiggy of a woman altered with an app. No meat ver.`, requirements: "?flag player haa;", tags: "female"},

    {category: `jiggy`, set: "Misc", index: `roob1c`, image: `jiggy/roob1c`, pieces: 100, name: `Red Jiggy`, desc: `Obtained by completing the Total Roob achievement from obtaining every piece of 4 special outfits.`, requirements: `?trophy z_roob;`, tags: "dickgirl",},
    {category: `jiggy`, set: "Misc", index: `roob2v`, image: `jiggy/roob2v`, pieces: 100, name: `White Jiggy`, desc: `Obtained by completing the Total Roob achievement from obtaining every piece of 4 special outfits.`, requirements: `?trophy z_roob;`, tags: "female",},
    {category: `jiggy`, set: "Misc", index: `roob3v`, image: `jiggy/roob3v`, pieces: 150, name: `Black Jiggy`, desc: `Obtained by completing the Total Roob achievement from obtaining every piece of 4 special outfits.`, requirements: `?trophy z_roob;`, tags: "female",},
    {category: `jiggy`, set: "Misc", index: `roob4c`, image: `jiggy/roob4c`, pieces: 150, name: `Yellow Jiggy`, desc: `Obtained by completing the Total Roob achievement from obtaining every piece of 4 special outfits.`, requirements: `?trophy z_roob;`, tags: "dickgirl",},
    {category: `jiggy`, set: "Misc", index: `roobFv`, image: `jiggy/roobFv`, pieces: 200, name: `Roob is Combat Ready`, desc: `A very difficult jiggy.<br>Obtained by completing two veggie Total Roob jiggies.`, requirements: `?flag player roob2v; ?flag player roob3v;`, tags: "female",},
    {category: `jiggy`, set: "Misc", index: `roobFc`, image: `jiggy/roobFc`, pieces: 250, name: `Roob Cock Chart`, desc: `A very difficult jiggy.<br>Obtained by completing two meaty Total Roob jiggies.`, requirements: `?flag player roob1c; ?flag player roob4c;`, tags: "dickgirl",},
];

//Establish misc variables for screen sizing
var currentScroll = 0;
var pogList = [];
var coinSize = window.matchMedia('(orientation: portrait)').matches ? 100 : 200;

//General Collection functions
function collectablesCleanup() {
    
	//Obtain any missing collectables from globalInventoryArray
	for (itemCounter = 0; itemCounter < globalItemsArray.length; itemCounter++) {
		var itemCheck = null;
		if (
            globalItemsArray[itemCounter].category == "pogs" || 
            globalItemsArray[itemCounter].category == "pocketmanz" || 
            globalItemsArray[itemCounter].category == "tarot" || 
            globalItemsArray[itemCounter].category == "card" || 
            globalItemsArray[itemCounter].category == "magazine" || 
            globalItemsArray[itemCounter].category == "jiggy"
        ) {
			itemCheck = globalCollectablesArray.find(entry => entry.index === globalItemsArray[itemCounter].index);
			if (itemCheck) {
                //console.info("Item already present: "+globalItemsArray[itemCounter].category+" "+itemCounter)
                //console.log(itemCheck);
            }
			else {
				switch (globalItemsArray[itemCounter].category) {
                    case "pogs":
                        //console.log(globalItemsArray[itemCounter].category)
                        var itemToAdd = {index: globalItemsArray[itemCounter].index, category: globalItemsArray[itemCounter].category, image: globalItemsArray[itemCounter].image}
                        if (globalItemsArray[itemCounter].back) {
                            itemToAdd.tails = globalItemsArray[itemCounter].back
                        }
                        break;
                    case "pocketmanz":
                        //console.log(globalItemsArray[itemCounter].category)
                        var itemToAdd = {index: globalItemsArray[itemCounter].index, category: globalItemsArray[itemCounter].category, image: globalItemsArray[itemCounter].image}
                        if (globalItemsArray[itemCounter].color) {
                            itemToAdd.color = globalItemsArray[itemCounter].color;
                        }
						else {
							itemToAdd.color = "#CCCCCC";
						}
                        if (globalItemsArray[itemCounter].name) {
                            itemToAdd.name = globalItemsArray[itemCounter].name;
                        }
						else {
							itemToAdd.name = globalItemsArray[itemCounter].index;
						}
                        if (globalItemsArray[itemCounter].set) {
                            itemToAdd.set = globalItemsArray[itemCounter].set;
                        }
						else {
							itemToAdd.set = "Misc";
						}
                        if (globalItemsArray[itemCounter].rarity) {
                            itemToAdd.rarity = globalItemsArray[itemCounter].rarity;
                        }
						else {
							itemToAdd.rarity = "common";
						}
                        break;
                    case "tarot":
                        //console.log(globalItemsArray[itemCounter].category)
                        var itemToAdd = {index: globalItemsArray[itemCounter].index, category: globalItemsArray[itemCounter].category, image: globalItemsArray[itemCounter].image}
                        if (globalItemsArray[itemCounter].color) {
                            itemToAdd.color = globalItemsArray[itemCounter].color
                        }
						else {
							itemToAdd.color = "#CCCCCC";
						}
                        if (globalItemsArray[itemCounter].name) {
                            itemToAdd.name = globalItemsArray[itemCounter].name
                        }
						else {
							itemToAdd.name = globalItemsArray[itemCounter].index;
						}
                        break;
                    case "magazine":
                        //console.log(globalItemsArray[itemCounter].category)
                        //The logical path (imageRaw), because writeMagazine builds page names from the cover's name
                        var itemToAdd = {index: globalItemsArray[itemCounter].index, category: globalItemsArray[itemCounter].category, image: globalItemsArray[itemCounter].imageRaw || globalItemsArray[itemCounter].image}
                        if (globalItemsArray[itemCounter].pages) {
                            itemToAdd.pages = globalItemsArray[itemCounter].pages
                        }
                        break;
                    case "jiggy":
                        //console.log(globalItemsArray[itemCounter].category)
                        //The logical path (imageRaw), so SEX, skintone and filter suffixes resolve when the
                        //puzzle is listed and opened, following any Preferences change made since loading
                        var itemToAdd = {index: globalItemsArray[itemCounter].index, category: globalItemsArray[itemCounter].category, image: globalItemsArray[itemCounter].imageRaw || globalItemsArray[itemCounter].image}
                        if (globalItemsArray[itemCounter].pieces) {
                            itemToAdd.pieces = globalItemsArray[itemCounter].pieces
                        }
                        else {
                            itemToAdd.pieces = 100;
                        }
                        if (globalItemsArray[itemCounter].name) {
                            itemToAdd.name = globalItemsArray[itemCounter].name
                        }
                        else {
                            itemToAdd.name = "Unnamed Jiggy"
                        }
                        if (globalItemsArray[itemCounter].desc) {
                            itemToAdd.desc = globalItemsArray[itemCounter].desc
                        }
                        else {
                            itemToAdd.name = "No description"
                        }
                        if (globalItemsArray[itemCounter].set) {
                            itemToAdd.set = globalItemsArray[itemCounter].set
                        }
                        else {
                            itemToAdd.set = "Misc"
                        }
                        if (globalItemsArray[itemCounter].winImages) {
                            itemToAdd.winImages = globalItemsArray[itemCounter].winImages
                        }
                        break;
                }
				if (globalItemsArray[itemCounter].requirements) {
					itemToAdd.requirements = globalItemsArray[itemCounter].requirements;
				}
				else {
					itemToAdd.requirements = "?item "+globalItemsArray[itemCounter].index+";"
				}
				if (globalItemsArray[itemCounter].tags) {
					itemToAdd.tags = globalItemsArray[itemCounter].tags;
				}
                globalCollectablesArray.push(itemToAdd);
			}
		}
	}
	
	var categoriesToCheck = []
	//Cleanup collectables array
	for (collectableCounter = 0; collectableCounter < globalCollectablesArray.length; collectableCounter++) {
		//Edge case for if no requirements are present
		if (!globalCollectablesArray[collectableCounter].requirements) {
			globalCollectablesArray[collectableCounter].requirements = "?item "+globalCollectablesArray[collectableCounter].index+";";
		}
	
		//Edge case for if no tags are present
		if (!globalCollectablesArray[collectableCounter].tags) {
			globalCollectablesArray[collectableCounter].tags = "";
		}
		
		if (!categoriesToCheck.includes(globalCollectablesArray[collectableCounter].category)) {
			categoriesToCheck.push(globalCollectablesArray[collectableCounter].category)
		}
	}
}

function printCategoryButtons(categoryID, buttonsArray) {
	var buttonsGrid = document.getElementById(categoryID);
    if (buttonsGrid) {
        buttonsGrid.remove();
    }
	//Responsive flowing button row (see .categoryButtons in style.css) — replaces the old
	//absolutely-positioned, fixed-px 4-column grid (and its --collectable-cat-mt margin hack).
	document.getElementsByClassName('output')[0].innerHTML += `
		<div id="`+categoryID+`" class="categoryButtons">
		</div>
	`;
	//Append buttons (they flow naturally; .categoryButtons resets .pictureButton's absolute positioning)
	for (buttonIndex = 0; buttonIndex < buttonsArray.length; buttonIndex++) {
        var fontColor = ""
        var finalName = buttonsArray[buttonIndex].name;
        if (countCategory("jiggy", finalName)[2] >= countCategory("jiggy", finalName)[0] && categoryID == "setsList" && countCategory("jiggy", finalName)[2] > 0) {
            fontColor = ` style="color: white;"`;
            finalName += " ♕";
        }
		document.getElementById(categoryID).innerHTML += `
			<div class="pictureButton" onclick="
				`+buttonsArray[buttonIndex].onclick+`
			"`+fontColor+`>
				`+finalName+`
			</div>
		`;
	}
}

function categoriesCollectables() {
	var buttonsArray = [
		{name: "Jiggies", onclick: "jiggy",},
		{name: "Tarot Cards", onclick: "tarot",},
		{name: "Other Cards", onclick: "pocketmanz",},
		{name: "Magazines", onclick: "magazine",},
		{name: "Coins", onclick: "pogs",},
	];
	
	for (buttonCounter = 0; buttonCounter < buttonsArray.length; buttonCounter++) {
        if (buttonsArray[buttonCounter] != undefined) {
            if (countCollectables(buttonsArray[buttonCounter].onclick)[1] < 1 && checkFlag("player", "collectables") != true) {
                buttonsArray.splice(buttonCounter, 1);
                buttonCounter--;
            }
            else {
                buttonsArray[buttonCounter].onclick = `listCollectables('`+buttonsArray[buttonCounter].onclick+`')`;
            }
        }
	}
	
	//Print category buttons
	printCategoryButtons("collectablesList", buttonsArray);
}

function listCollectables(type) {
	var categoryCount = document.getElementById('categoryCount');
    if (categoryCount) {
        categoryCount.remove();
    }
    console.info("Listing "+type+" collectables")
	//Prep and clear the local area and children
    cullGrids();
    var coinZoomOut = document.getElementById('setsList');
    if (coinZoomOut) {
        coinZoomOut.remove();
    }
	
    //Show the grid spaces, including a finished grid for jiggies
	
	soundEffectStart("button");
	switch (type) {
		case "pocketmanz": 
            appendGrids();
			categoriesCards();
		break;
		case "tarot": 
            appendGrids();
			listCards("tarot");
		break;
		case "jiggy": 
            appendGrids();
			categoriesJiggies();
		break;
		case "magazine":
            appendGrids();
			listMagazines();
		break;
		case "pogs":
            appendGrids("pogs");
			listCoins();
		break;
	}
}

function countCollectables(type) {
	//Establish counting variables
    var countTotal = 0;
    var countOwned = 0;
    var countedArray = [];
    var missingArray = [];
	for (collectableCounter = 0; collectableCounter < globalCollectablesArray.length; collectableCounter++) {
        if (!globalCollectablesArray[collectableCounter].requirements) {
            globalCollectablesArray[collectableCounter].requirements = "?item "+globalCollectablesArray[collectableCounter].index+";";
        }
        if (!globalCollectablesArray[collectableCounter].tags) {
            globalCollectablesArray[collectableCounter].tags = "";
        }
		if (checkCollectablesLegality(
		globalCollectablesArray[collectableCounter].index,
		globalCollectablesArray[collectableCounter].image,
		globalCollectablesArray[collectableCounter].tags,
		globalCollectablesArray[collectableCounter].requirements,
		"counting"
		) == true) {
			switch (type) {
				case "complete": 
					if (globalCollectablesArray[collectableCounter].category == "jiggy" && globalCollectablesArray[collectableCounter].set != "Misc") {
						countTotal++;
						if (checkFlag("player", globalCollectablesArray[collectableCounter].index) == true) {
							countOwned++;
                            countedArray.push(globalCollectablesArray[collectableCounter].index);
						}
                        else {
                            missingArray.push(globalCollectablesArray[collectableCounter].index);}
					}
				break;
				default: {
					if (globalCollectablesArray[collectableCounter].category == type) {
                        //console.info(globalCollectablesArray[collectableCounter].index);
						countTotal++;
						if (checkRequirements(globalCollectablesArray[collectableCounter].requirements) == true) {
                            //console.info(globalCollectablesArray[collectableCounter].index);
							countOwned++;
                            countedArray.push(globalCollectablesArray[collectableCounter].index);
						}
                        else {
                            missingArray.push(globalCollectablesArray[collectableCounter].index);
                        }
					}
				}
			}
		}
	}
    //console.info(countedArray);
    console.log(missingArray);
	return [countTotal, countOwned];
}

function countCategory(type, cat) { //Outputs total, owned, complete
	//Establish counting variables
    var countTotal = 0;
    var countOwned = 0;
    var countComplete = 0;
    var countedArray = [];
    var missingArray = [];
	for (collectableCounter = 0; collectableCounter < globalCollectablesArray.length; collectableCounter++) {
        if (!globalCollectablesArray[collectableCounter].requirements) {
            globalCollectablesArray[collectableCounter].requirements = "?item "+globalCollectablesArray[collectableCounter].index+";";
        }
        if (!globalCollectablesArray[collectableCounter].tags) {
            globalCollectablesArray[collectableCounter].tags = "";
        }
		if (checkCollectablesLegality(
		globalCollectablesArray[collectableCounter].index,
		globalCollectablesArray[collectableCounter].image,
		globalCollectablesArray[collectableCounter].tags,
		globalCollectablesArray[collectableCounter].requirements,
		"counting"
		) == true && globalCollectablesArray[collectableCounter].set == cat) {
			switch (type) {
				case "jiggy": 
					if (globalCollectablesArray[collectableCounter].category == "jiggy") {
						countTotal++;
						if (checkRequirements(globalCollectablesArray[collectableCounter].requirements) == true) {
                            //console.info(globalCollectablesArray[collectableCounter].index);
							countOwned++;
                            countedArray.push(globalCollectablesArray[collectableCounter].index);
						}
                        else {
                            missingArray.push(globalCollectablesArray[collectableCounter].index);
                        }
						if (checkFlag("player", globalCollectablesArray[collectableCounter].index) == true) {
							countComplete++;
						}
					}
				break;
				default: {
					if (globalCollectablesArray[collectableCounter].category == type) {
                        //console.info(globalCollectablesArray[collectableCounter].index);
						countTotal++;
						if (checkRequirements(globalCollectablesArray[collectableCounter].requirements) == true) {
                            //console.info(globalCollectablesArray[collectableCounter].index);
							countOwned++;
                            countedArray.push(globalCollectablesArray[collectableCounter].index);
						}
                        else {
                            missingArray.push(globalCollectablesArray[collectableCounter].index);
                        }
					}
				}
			}
		}
	}
    //console.info(countedArray);
    console.log(missingArray);
	return [countTotal, countOwned, countComplete];
}

function checkCollectablesLegality(index, image, tags, requirements, type) {
	//Case 1: Cheat item: Ignore if counting
	if (index.includes("cheat") == true && type.includes("counting") == true) {
		return false;
	}
	if (index.includes("secret") == true && type.includes("counting") == false) {
		return false;
	}
	//Case 2: Blocked by carni/vegetarian: Always ignore
	if (image.endsWith("c") && data.player.vegetarian == true) {
		if (index.includes("jiggy-100c") == false) {
			return false;
		}
	}
	if (image.includes("Meat") && data.player.vegetarian == true) {
		return false;
	}
	if (image.endsWith("v") && data.player.carnivore == true) {
		return false;
	}
	if (image.includes("Veggie") && data.player.carnivore == true) {
		return false;
	}
	//Case 3: Blocked by filter: Always ignore
	if (fetishes(tags) != true) {
		return false;
	}
	//Case 4: Obtained via trophy: Ignore if counting
    if (type == "counting") {
		if (requirements.includes("achievement") || requirements.includes("trophy")) {
			if (index.includes("cheatMisc") == false) {
				return false;
			}
		}
    }
	return true;
}

//Jiggy functions
function categoriesJiggies() {
    cullGrids();
	var categoriesArray = [];
	for (collectableCounter = 0; collectableCounter < globalCollectablesArray.length; collectableCounter++) {
        if (globalCollectablesArray[collectableCounter].category == "jiggy") {
            if (!categoriesArray.includes(globalCollectablesArray[collectableCounter].set)) {
                if (checkRequirements(globalCollectablesArray[collectableCounter].requirements) == true || checkFlag("player", "collectables") == true) {
                    categoriesArray.push(globalCollectablesArray[collectableCounter].set)
                }
            }
        }
	}
    //Sort the set
    categoriesArray.sort();
    //Move "Misc" to the end of the list
    if (categoriesArray.includes("Misc")) {
        categoriesArray.splice(categoriesArray.indexOf("Misc"), 1);
        categoriesArray.push("Misc");
    }
    
    if (checkRequirements("?trophy z_collect1-core;") || checkRequirements("?trophy z_collect2-sub1;") || checkRequirements("?trophy z_collect2-sub2;") || checkRequirements("?trophy z_collect2-sub3;") || checkRequirements("?trophy z_collect2-sub4;")) {
        categoriesArray.push("Bonus");
    }
	var buttonsArray = [];
	for (collectableCounter = 0; collectableCounter < categoriesArray.length; collectableCounter++) {
		var newButton = {
			name: categoriesArray[collectableCounter], 
			onclick: `listJiggies('`+categoriesArray[collectableCounter]+`')`,
		}
		buttonsArray.push(newButton)
	}
    if (buttonsArray.length == 0 || buttonsArray.length == 1) {
        console.info("Too few categories to warrant printing")
    }
    else {
        printCategoryButtons("setsList", buttonsArray)
    }
    appendGrids('jiggy');
	listJiggies(categoriesArray[0]);
}

var currentJiggyCategory = ""; // remembers which jiggy category is on screen, so finishing one returns here
function listJiggies(category) {
	currentJiggyCategory = category;
	var categoryCount = document.getElementById('categoryCount');
    if (categoryCount) {
        categoryCount.remove();
    }
    if (category != "Misc") {
        document.getElementById("output").innerHTML +=`<p id="categoryCount" class="centeredText"><b>`+countCategory("jiggy", category)[1]+` collected, `+countCategory("jiggy", category)[2]+` complete, `+countCategory("jiggy", category)[0]+` total.</b></p>`;
    }
    cullGrids();
    appendGrids('jiggy');
    var specialJiggyOptions = [
        ["randomMeat", "!vegetarian;", "Random Meaty", "A random jiggy from the pool of characters with donguses."],
        ["randomVeggie", "!carnivore;", "Random No-Meat", "A random jiggy from the pool of characters without donguses."],
        ["randomPocket", "?item pocket-eev-0;", "Random Plapper", "A random jiggy from the pool of all Plap Pals images."],
    ];
    if (category == "Bonus") {
        for (randBonus = 0; randBonus < specialJiggyOptions.length; randBonus++) {
            if (checkRequirements(specialJiggyOptions[randBonus][1]) == true) {
                var randJiggy = {
                    index: specialJiggyOptions[randBonus][0],
                    name: specialJiggyOptions[randBonus][2],
                    image: specialJiggyOptions[randBonus][0],
                    tags: "",
                    desc: specialJiggyOptions[randBonus][3],
                }
                printJiggy(randJiggy, "galleryGrid")
            }
        }
        var randJiggy = {
            index: "custom",
            name: "Upload Custom Jiggy",
            image: cleanupImage(`jiggy/secret`),
            tags: "",
            desc: ``,
        }
        printJiggy(randJiggy, "galleryGrid")
    }
    console.info("Listing jiggies for "+category)
    for (collectableCounter = 0; collectableCounter < globalCollectablesArray.length; collectableCounter++) {
        if (globalCollectablesArray[collectableCounter].category == "jiggy") {
            if (globalCollectablesArray[collectableCounter].set == category) {
                if (checkCollectablesLegality(
                    globalCollectablesArray[collectableCounter].index,
                    globalCollectablesArray[collectableCounter].image,
                    globalCollectablesArray[collectableCounter].tags,
                    globalCollectablesArray[collectableCounter].requirements,
                    "jiggy"
                ) == true) {
                    if (checkRequirements(globalCollectablesArray[collectableCounter].requirements) == true || checkFlag("player", "collectables") == true) {
                        if (checkFlag("player", globalCollectablesArray[collectableCounter].index) == true || checkFlag("player", "collectables") == true) {
                            printJiggy(globalCollectablesArray[collectableCounter], "finishedGrid")
                        }
                        else {
                            printJiggy(globalCollectablesArray[collectableCounter], "galleryGrid")
                        }
                    }
                }
            }
        }
    }
            if (checkFlag("player", "easyJiggy") != true) {
                document.getElementById('galleryGrid').insertAdjacentHTML('beforebegin', `
                    <p class="choiceText" id="jiggyToggleButton" onclick="jiggyEasyToggle();"
                    style = "border-bottom: 3px solid #FF0019; color: #FF0019"
                    >
                        Jiggy Mode: HARD
                    </p>
                `);
            }
            else {
                document.getElementById('galleryGrid').insertAdjacentHTML('beforebegin', `
                    <p class="choiceText" id="jiggyToggleButton" onclick="jiggyEasyToggle();"
                    style = "border-bottom: 3px solid #00FF1D; color: #00FF1D"
                    >
                        Jiggy Mode: NORMAL (Grouped)
                    </p>
                `);
            }
    var jiggyUploadButton = document.getElementById('jiggyUpload');
    console.info(jiggyUploadButton);
    if (jiggyUploadButton) {
        document.getElementById("jiggyUpload").addEventListener("change", function (e) {
            console.info(document.getElementById("jiggyUpload").value);
            const file = e.target.files[0];
            if (!file) return;

            const imageURL = URL.createObjectURL(file);

            getJiggyWithIt(
                imageURL,   // image
                100,         // test piece count
                "userUpload"
            );
        });
    }
}

function printJiggy(jiggy, targetSection) {
    var finalBrightness = "100%";
	var finalImage = jiggy.image;
    var finalStyle = "style = 'filter: brightness(1);'";
    console.info(jiggy.image)
    if (checkFlag("player", jiggy.index) == true) {
        var finalStatus = " - ♔"
        var imageOnclick = `jiggyWin('`+finalImage+`')`
        var finalThumbnail = finalImage;
        //console.info(finalThumbnail)
    }
    else {
        var finalStatus = ""
        var imageOnclick = `getJiggyWithIt('`+finalImage+`', '`+jiggy.pieces+`', '`+jiggy.index+`')`
        var finalThumbnail = cleanupImage(`jiggy/secret`)
    }
    if (checkFlag("player", "collectables") == true) {
        imageOnclick = `jiggyWin('`+finalImage+`')`
        finalThumbnail = cleanupImage(finalImage);
        if (checkFlag("player", jiggy.index) != true) {
            finalStyle = "style = 'filter: brightness(0.1)'";
        }
    }
    var finalFunction = `onclick = "getJiggyWithIt('`+jiggy.image+`', '`+jiggy.pieces+`', '`+jiggy.index+`')"`
    var finalDesc = "<p>"+jiggy.desc+`</p><p>`+jiggy.pieces+`-piece puzzle`+finalStatus+`.</p>`
    if (jiggy.index == "custom") {
        finalFunction = "";
        finalDesc = `<input type="file" id="jiggyUpload" accept="image/*"></input>`;
    }
    document.getElementById(targetSection).innerHTML += `
        <div class="dialogueContainer syrup" 
        style="cursor:pointer;filter:brightness(`+finalBrightness+`%); " 
        id="jiggyBox`+jiggy.index+`" 
        onmouseover="wardrobeMouseOver('jiggyBox`+jiggy.index+`')"
        onmouseout="wardrobeMouseOut('jiggyBox`+jiggy.index+`')">
            <div class="thumbnailContainer syrup" style="width:35%;" onclick = "`+imageOnclick+ `">
                <div class="thumbnailBorder syrup">
                    <img class="thumbnailImage syrup" src = "${cleanupImage(finalThumbnail)}" `+finalStyle+`>
                </div>
            </div>
            <div class="textContainer syrup" style="width:65%;" `+finalFunction+ `>
                <div class="textBorder syrup">
                    <div class="textContent syrup">
                        <div style="width: max-content;">
                            <p class="textName syrup" style="font-size:var(--fs-xlarge, 2em);">`+jiggy.name+`</p>
                            <hr class="textDivider syrup">
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
                        `+replaceCodenames(finalDesc).replace("SET", jiggy.set)+`
                    </div>
                </div>
            </div>
        </div>
    `;
}

//Card functions
function categoriesCards() {
    cullGrids();
	var categoriesArray = [];
	for (collectableCounter = 0; collectableCounter < globalCollectablesArray.length; collectableCounter++) {
        //Check if it's a card
        if (
            globalCollectablesArray[collectableCounter].category == "pocketmanz" ||
            globalCollectablesArray[collectableCounter].category == "tarot" ||
            globalCollectablesArray[collectableCounter].category == "card"
        ) {
            //Create categories (excluding tarot cards)
            if (
                !categoriesArray.includes(globalCollectablesArray[collectableCounter].set) && 
                globalCollectablesArray[collectableCounter].set != "tarot"
            ) {
                categoriesArray.push(globalCollectablesArray[collectableCounter].set)
            }
        }
	}
	var buttonsArray = [];
	for (collectableCounter = 0; collectableCounter < categoriesArray.length; collectableCounter++) {
		var newButton = {
			name: categoriesArray[collectableCounter], 
			onclick: `listCards('`+categoriesArray[collectableCounter]+`')`,
		}
		buttonsArray.push(newButton)
	}
    if (buttonsArray.length == 0 || buttonsArray.length == 1) {
        console.log("Too few categories to warrant printing")
    }
    else {
        printCategoryButtons("setsList", buttonsArray)
    }
    appendGrids('cards');
	listCards(categoriesArray[0]);
}

function listCards(category) {
    console.info("Listing cards for "+category)
	for (collectableCounter = 0; collectableCounter < globalCollectablesArray.length; collectableCounter++) {
		if (
		globalCollectablesArray[collectableCounter].category == "card" ||
		globalCollectablesArray[collectableCounter].category == "pocketmanz" ||
		globalCollectablesArray[collectableCounter].category == "tarot"
		) {
			if (globalCollectablesArray[collectableCounter].set == category) {
				if (checkCollectablesLegality(
				globalCollectablesArray[collectableCounter].index,
				globalCollectablesArray[collectableCounter].image,
				globalCollectablesArray[collectableCounter].tags,
				globalCollectablesArray[collectableCounter].requirements,
				"cards"
				) == true) {
					printCard(globalCollectablesArray[collectableCounter], "galleryGrid")
				}
			}
		}
	}
}

function printCard(card, categoryID) {
	var cardBrightness = "90%";
    console.debug(card)
	if(!card.name) {
		card.name = "Unnamed Card";
	}
	if(!card.color) {
		card.color = "#AAAAAA";
	}
	if (!card.rarity) {
		card.rarity = "common";
	}
    // Resolve into a LOCAL — never write cleanupImage's result back onto the card.
    // For mod images that result is volatile: a blob: URL, or the "none.webp#…" loading
    // marker if the blob hasn't landed yet. Writing it back onto the (shared)
    // globalCollectablesArray entry froze cards blank for the rest of the session once a
    // marker got captured. cardZoom gets the RAW path and re-resolves at click time.
    var finalCardImage = cleanupImage(card.image);
	var cardOnClick = `onclick="cardZoom('`+card.image+`', '`+card.category+`')"`;
    if (data.player.location != "collectionRoom") {
        cardOnClick = "";
    }
        console.debug(card.requirements)
	if (checkRequirements(card.requirements) != true && checkFlag("player", "collectables") != true) {
		var requirementSymbol = "inventory"
		cardBrightness = "5%";
		cardOnClick = "";
		if (card.requirements.includes("?achievement ") || card.requirements.includes("?trophy ") ) {
			requirementSymbol = "trophies";
		}
	}
	switch (card.set) {
		case "tarot":
			var finalImage = `
			<div class="cardBox" id="card`+card.index+`" style="position:relative;">
				<img class="bigPicture" id="image`+card.index+`" src="`+finalCardImage+`"
				`+cardOnClick+`
				style="
					filter:brightness(`+cardBrightness+`); 
					width: 100%; 
					max-height:none; 
					cursor: pointer;
				">
			`;
			if (requirementSymbol) {
				finalImage += `
				<img class="bigPicture" 
				src="`+cleanupImage(`system/ui/`+requirementSymbol+`Blank`)+`"
				style="
					filter:brightness(100%); 
					border: none; max-width: none; 
					width: 70%; top:15%; left:15%; 
					position: absolute; 
					max-height:none; 
					cursor: pointer;
					filter:opacity(30%);
				">
				`;
			}
		break;
		default: {
			var finalImage = `
				<div class="cardBox" id="card`+card.index+`"
				style="
					filter:brightness(`+cardBrightness+`);
					position:relative;
					width:100%;
					aspect-ratio:1/1.25;
					border-radius:15px;
					text-align:center;
					max-width:80vw;
					margin:auto;
					margin-bottom:2%;
				">
				<img class="bigPicture" src="`+cleanupImage("none")+`"
				`+cardOnClick+`
				style="
					background:`+card.color+`;
					width: 100%; 
					height: 100%;
					max-height:none; 
					max-width:none; 
					cursor: pointer;
					position:absolute;
					border:none;
					border-radius:5%;
				">
				`;
			if (card.rarity.includes("vertical")) {
				finalImage += `
					<img class="bigPicture" src="` + finalCardImage + `"
					`+cardOnClick+`
					style="
						aspect-ratio:2/3;
						width: 70%; 
						top: 11.5%; 
						left: 15%;
						max-height:none; 
						cursor: pointer;
						position:absolute;
						border:none;
						border-radius:initial;
					">
					<img class="bigPicture" src="` + cleanupImage("pocketmanz/frame-vertical") + `"
					`+cardOnClick+`
					style="
						width: 100%; 
						max-height:none; 
						max-width:none; 
						cursor: pointer;
						position:absolute;
						border:none;
						border-radius:initial;
					">
					<p style="
						position:inherit;
						font-family: simple summer;
						color:#FFD800;
						font-size:var(--fs-huge, 3rem);
						text-shadow: 4px 4px black;
						top:4%;
					">`+card.name+`</p>
				`;
			}
			else {
				if (card.rarity.includes("rare")) {
					finalImage += `
						<img class="bigPicture shimmer" 
						src="`+cleanupImage("pocketmanz/foilDotOuterBack")+`"
						`+cardOnClick+`
						style="
							opacity: 30%;
							width: 100%;
							height: 100%;
							max-height:none;
							max-width:none; 
							cursor: pointer;
							position:absolute;
							border:none;
							border-radius:5%;
						">
						<img class="bigPicture" 
						src="` + cleanupImage("pocketmanz/foilDotOuterFront") + `"
						`+cardOnClick+`
						style="
							width: 100%; 
							height: 100%;
							max-height:none; 
							max-width:none; 
							cursor: pointer;
							position:absolute;
							border:none;
							border-radius:5%;
						">
					`;
				}
				finalImage += `
					<img class="bigPicture" src="` + finalCardImage + `"
					`+cardOnClick+`
					style="
						width: 78%;
						top: 11.5%; 
						left: 11%;
						max-height: none; cursor: pointer;
						position:absolute;
						border:none;
						border-radius:initial;
                        aspect-ratio:3/2;
					">
					<img class="bigPicture" src="` + cleanupImage("pocketmanz/frame") + `"
					`+cardOnClick+`
					style="
						width: 100%; 
						max-height:none; 
						max-width:none; 
						cursor: pointer;
						position:absolute;
						border:none;
						border-radius:initial;
					">
					<p style="
						position:inherit;
						font-family: simple summer;
						color:#FFD800;
						font-size:var(--fs-huge, 3rem);
						text-shadow: 4px 4px black;
						top:57%;
					">`+card.name+`</p>
				`;
			}
			if (requirementSymbol) {
				finalImage += `
				<img class="bigPicture" 
				src="`+cleanupImage(`system/ui/`+requirementSymbol+`Blank`)+`"
				style="
					filter:brightness(100%); 
					border: none; max-width: none; 
					width: 70%; top:15%; left:15%; 
					position: absolute; 
					max-height:none; 
					cursor: pointer;
					filter:opacity(30%);
				">
				`;
			}
		}
	}
	finalImage += `
		</div>
	`;
	document.getElementById(categoryID).innerHTML += finalImage
}

function cardZoom(image, type) {
	// printCard passes the RAW path now — resolve it here. cleanupImage is idempotent
	// for values that are already resolved (blob:/marker bypasses at its top).
	image = cleanupImage(image);
	currentScroll = wrapper.scrollTop;
	wrapper.scrollTop = 0;
	document.getElementById('output').innerHTML = '';
    document.getElementById('output').innerHTML += `
		<img class="bigPicture" src="` + image + `"
		onclick="cardZoomOut('`+type+`')",
		style="filter:brightness(100%); width: 100%; max-height:none;">
	`;
}
function cardZoomOut(type) {
	changeLocation("collectionRoom")
	wrapper.scrollTop = currentScroll;
	listCollectables(type);
}

//Magazine functions
function listMagazines() {
	console.info("Listing magazines")
    for (collectableCounter = 0; collectableCounter < globalCollectablesArray.length; collectableCounter++) {
        if (globalCollectablesArray[collectableCounter].category == "magazine") {
            if (checkCollectablesLegality(
                globalCollectablesArray[collectableCounter].index,
                globalCollectablesArray[collectableCounter].image,
                globalCollectablesArray[collectableCounter].tags,
                globalCollectablesArray[collectableCounter].requirements,
                "magazines"
            ) == true) {
                printMagazine(globalCollectablesArray[collectableCounter], "galleryGrid")
            }
        }
    }
}

function printMagazine(card, categoryID) {
	var cardBrightness = "90%";
	var finalImage = cleanupImage(card.image);
	var cardOnClick = `onclick="writeMagazine('`+card.image+`', '`+card.index+`')"`;
	if (checkRequirements(card.requirements) != true || checkFlag ("player", "collectables" == true)) {
		var requirementSymbol = "inventory"
		cardBrightness = "5%";
		cardOnClick = "";
		if (card.requirements.includes("?achievement ") || card.requirements.includes("?trophy ") ) {
			requirementSymbol = "trophies";
		}
	}
    var finalImage = `
        <div class="cardBox" id="card`+card.index+`" style="position:relative;">
        <img class="bigPicture" id="image`+card.index+`" src="`+finalImage+`"
        `+cardOnClick+`
        style="
            filter:brightness(`+cardBrightness+`); 
            width: 100%; 
            max-height:none; 
            cursor: pointer;
        ">
    `;
    if (requirementSymbol) {
        finalImage += `
        <img class="bigPicture" 
        src="`+cleanupImage(`system/ui/`+requirementSymbol+`Blank`)+`"
        style="
            filter:brightness(100%); 
            border: none; max-width: none; 
            width: 70%; top:15%; left:15%; 
            position: absolute; 
            max-height:none; 
            cursor: pointer;
            filter:opacity(30%);
        ">
        `;
    }
	finalImage += `
		</div>
	`;
	document.getElementById(categoryID).innerHTML += finalImage
}

var magazinePageRequirementsArray = [
    {image: "magazine/dq-0-3", requirements: "?urethral;"},
    {image: "magazine/holofuta-0-8", requirements: "?feral;"},
    {image: "magazine/holofuta-0-9", requirements: "?playersub;"},
]

var magazinePageCount = 0;

//A magazine can list its pages directly, in order, with a pages array on its item or collectable
//entry. The cover is shown first and is not written in the list. A page written without a folder,
//such as "beastBreed2-1", is looked for in the cover's folder, so it becomes "magazine/beastBreed2-1".
//Returns {cover, pages} with logical paths, or null when the magazine has no pages list, in which
//case writeMagazine guesses the pages from the cover's name as it always has.
function getMagazinePages(index) {
    if (!index) return null;
    var entry = globalCollectablesArray.find(e => e.index === index && e.category === "magazine" && Array.isArray(e.pages))
        || globalItemsArray.find(e => e.index === index && Array.isArray(e.pages));
    if (!entry) return null;
    var cover = entry.imageRaw || entry.image;
    var folder = cover.includes("/") ? cover.substring(0, cover.lastIndexOf("/") + 1) : "";
    return {cover: cover, pages: entry.pages.map(page => page.includes("/") ? page : folder + page)};
}

//False when a magazinePageRequirementsArray entry names this page and its requirements fail.
//Logical paths are compared first, because cleanupImage returns temporary links for mod images.
function magazinePageAllowed(page) {
    for (var requirementIndex = 0; requirementIndex < magazinePageRequirementsArray.length; requirementIndex++) {
        var pageRequirement = magazinePageRequirementsArray[requirementIndex];
        if (pageRequirement.image == page || cleanupImage(pageRequirement.image) == cleanupImage(page)) {
            if (checkRequirements(pageRequirement.requirements) != true) {
                return false;
            }
        }
    }
    return true;
}

function writeMagazine(image, index) {
    console.info(image);
	currentScroll = wrapper.scrollTop;
	wrapper.scrollTop = 0;
	document.getElementById('output').innerHTML = '';
    var listedMagazine = getMagazinePages(index);
    if (listedMagazine) {
        document.getElementById('output').innerHTML += `
            <img class="bigPicture" id="magazineCover" src="` + cleanupImage(listedMagazine.cover) + `" onError = "removeThisElement('magazineCover')"
            style="filter:brightness(100%); max-width: 100vw; max-height:100vh;">
        `;
        for (var listedIndex = 0; listedIndex < listedMagazine.pages.length; listedIndex++) {
            if (magazinePageAllowed(listedMagazine.pages[listedIndex]) != true) {
                continue;
            }
            magazinePageCount += 1;
            document.getElementById('output').innerHTML += `
                <img class="bigPicture" id="magazinePage`+magazinePageCount+`" onError = "removeThisElement('magazinePage`+magazinePageCount+`')" src="` + cleanupImage(listedMagazine.pages[listedIndex]) + `"
                style="filter:brightness(100%); max-width: 100vw; max-height:100vh;">
            `;
        }
        writeHTML(`button Finish; magazineClose()`)
        return;
    }
    document.getElementById('output').innerHTML += `
		<img class="bigPicture" id="magazineCover" src="` + image + `" onError = "removeThisElement('magazineCover')"
		style="filter:brightness(100%); max-width: 100vw; max-height:100vh;">
	`;
	for (pageCounter = 0; pageCounter < 20; pageCounter++) {
		magazinePageCount += 1;
        var finalImage = image.replace("-0", "").replace("images-webp/", "").replace("images/", "").replace(".webp", "");
        if (finalImage == "magazine/dq") {
            finalImage = "magazine/dq-0";
        }
        if (finalImage == "magazine/holofuta") {
            finalImage = "magazine/holofuta-0";
        }
        finalImage =  finalImage + "-" + pageCounter;
        finalImage = cleanupImage(finalImage);
        console.info(finalImage);
        for (magazineIndex = 0; magazineIndex < magazinePageRequirementsArray.length; magazineIndex++) {
            if (cleanupImage(magazinePageRequirementsArray[magazineIndex].image) == finalImage) {
                if (checkRequirements(magazinePageRequirementsArray[magazineIndex].requirements) != true) {
                    finalImage = "";
                }
            }
        }
		document.getElementById('output').innerHTML += `
			<img class="bigPicture" id="magazinePage`+magazinePageCount+`" onError = "removeThisElement('magazinePage`+magazinePageCount+`')" src="` + finalImage + `"
			style="filter:brightness(100%); max-width: 100vw; max-height:100vh;">
		`;
	}
	writeHTML(`button Finish; magazineClose()`)
}
function removeThisElement(target) {
    if (document.getElementById(target)) {
	    document.getElementById(target).remove();
    }
}
function magazineClose() {
	magazinePageCount = 0;
	changeLocation("collectionRoom")
	listCollectables("magazines");
	wrapper.scrollTop = currentScroll;
}

//Pog coin functions
function listCoins() {
    console.info("Listing coins")
    for (collectableCounter = 0; collectableCounter < globalCollectablesArray.length; collectableCounter++) {
        if (globalCollectablesArray[collectableCounter].category == "pogs") {
            if (checkCollectablesLegality(
                globalCollectablesArray[collectableCounter].index,
                globalCollectablesArray[collectableCounter].image,
                globalCollectablesArray[collectableCounter].tags,
                globalCollectablesArray[collectableCounter].requirements,
                "pogs"
            ) == true) {
                printCoin(globalCollectablesArray[collectableCounter], "galleryGrid")
            }
        }
    }
}

function printCoin(card, categoryID) {
	if (checkRequirements(card.requirements) == true || checkFlag ("player", "collectables") == true) {
        const entry = globalCollectablesArray.find(entry => entry.index === card.index);
        console.log(entry)
        var finalHeads = cleanupImage(entry.image);
        if (entry.tails) {
            var finalTails = cleanupImage(entry.tails);
        }
        else {
            var finalTails = finalHeads.replace("."+imageFormat, "-tails."+imageFormat);
            if(finalHeads.includes("mayor") || finalHeads.includes("carpenter") || finalHeads.includes("shopkeep")) {
                if(finalHeads.includes("Meat") == false && finalHeads.includes("Veggie") == false) {
                    if(finalHeads.includes("mayor")) {
                        if (checkFlag("mayor", "meat") == true) {
                            var finalTails = finalTails.replace("mayor", "mayorMeat");
                        }
                        else {
                            var finalTails = finalTails.replace("mayor", "mayorVeggie");
                        }
                    }
                    if(finalHeads.includes("carpenter")) {
                        if (checkFlag("carpenter", "meat") == true) {
                            var finalTails = finalTails.replace("carpenter", "carpenterMeat");
                        }
                        else {
                            var finalTails = finalTails.replace("carpenter", "carpenterVeggie");
                        }
                    }
                    if(finalHeads.includes("shopkeep")) {
                        if (checkFlag("shopkeep", "meat") == true) {
                            var finalTails = finalTails.replace("shopkeep", "shopkeepMeat");
                        }
                        else {
                            var finalTails = finalTails.replace("shopkeep", "shopkeepVeggie");
                        }
                    }
                }
            }
        }
        var finalFrontColor = "red";
        var finalBackColor = "blue";
        for (characterCounter = 0; characterCounter < coreCharactersArray.length; characterCounter++) {
            if (card.index.includes(coreCharactersArray[characterCounter].index) == true) {
                var finalFrontColor = coreCharactersArray[characterCounter].color;
                var finalBackColor = coreCharactersArray[characterCounter].color;
            }
        }
        var newPog = {index: `coin`+card.index+`-content`, face: "front", timer: 0};
        var faceSize = coinSize*0.75;
        var faceOffset = coinSize*0.125;
        pogList.push(newPog);
        var finalImage = `
            <div id="coin`+card.index+`-wrapper" style="position:relative; height: 100%; transform: rotateY(0deg); width: `+coinSize+`px;">
                <div id="coin`+card.index+`-content" style="transition: transform 1s; transform-style: preserve-3d;">
                    <div id="coin`+card.index+`-contentFront" style="width: 100%; height: 100%; backface-visibility: hidden;">
                        <div style = "position: absolute; background: `+finalFrontColor+`;clip-path:circle(48%);width: `+coinSize+`px; height: `+coinSize+`px; "onmouseover="flipCoin('coin`+card.index+`-content')">
                            <img class="bigPicture" id="coin`+card.index+`PictureFront"  src="` + finalHeads + `"
                            onclick="flipCoin('coin`+card.index+`-content', 'back')",
                            style="filter:brightness(100%); border: none; max-width: none; width: `+faceSize+`px; height: `+faceSize+`px; top:`+faceOffset+`px; left:`+faceOffset+`px; position: absolute; clip-path: circle(50%); max-height:none; cursor: pointer;">
                            <img class="bigPicture" id="coin`+card.index+`FrameFront" src="`+cleanupImage("pogs/pogFront")+`"
                            onclick="flipCoin('coin`+card.index+`-content', 'back')",
                            style="filter:brightness(100%); border: none; max-width: none; width: `+coinSize+`px; height: `+coinSize+`px; position: absolute; clip-path: circle(48.5%); max-height:none; cursor: pointer;">
                        </div>
                    </div>
                    <div style="width: 100%; height: `+coinSize+`px; backface-visibility: hidden; transform: rotateY(180deg);">
                        <div style = "position: absolute; background: `+finalBackColor+`;clip-path:circle(48%);width: `+coinSize+`px; height: `+coinSize+`px; "onmouseover="flipCoin('coin`+card.index+`-content')">
                            <img class="bigPicture" id="coin`+card.index+`PictureBack" src="` + finalTails + `"
                            onclick="flipCoin('coin`+card.index+`-content', 'front')",
                            style="filter:brightness(100%); border: none; max-width: none; width: `+faceSize+`px; height: `+faceSize+`px; top:`+faceOffset+`px; left:`+faceOffset+`px; position: absolute; clip-path: circle(50%); max-height:none; cursor: pointer;">
                            <img class="bigPicture" id="coin`+card.index+`FrameBack" src="`+cleanupImage("pogs/pogBack")+`"
                            onclick="flipCoin('coin`+card.index+`-content', 'front')",
                            style="filter:brightness(100%); border: none; max-width: none; width: `+coinSize+`px; height: `+coinSize+`px; position: absolute; clip-path: circle(48.5%); max-height:none; cursor: pointer;">
                        </div>
                    </div>
                </div>
            </div>		
        `;
	}
    else {
        var requirementSymbol = "inventory"
        if (card.requirements.includes("?achievement ") || card.requirements.includes("?trophy ") ) {
            requirementSymbol = "trophies";
        }
        var finalImage = `
            <div id="coin`+card.index+`-wrapper" style="position:relative; height: 100%; transform: rotateY(0deg); width: `+coinSize+`px;">
                <div id="coin`+card.index+`-content" style="transition: transform 1s; transform-style: preserve-3d;">
                    <div id="coin`+card.index+`-contentFront" style="width: 100%; height: 100%; backface-visibility: hidden;">
                        <div style = "position: absolute; background: #333333;clip-path:circle(48%);width: `+coinSize+`px; height: `+coinSize+`px;">
                            <img class="bigPicture" id="coin`+card.index+`PictureFront"  src="` + finalHeads + `"
                            style="filter:brightness(10%); border: none; max-width: none; width: `+coinSize+`px; height: `+coinSize+`px; top:0px; left:0px; position: absolute; clip-path: circle(38%); max-height:none; cursor: pointer;">

                            <img class="bigPicture" src="`+cleanupImage(`system/ui/`+requirementSymbol+`Blank`)+`
                            style="filter:brightness(100%); border: none; max-width: none; width: 70%; height: 70%; top:15%; left:15%; position: absolute; max-height:none; cursor: pointer;filter:opacity(30%);">

                            <img class="bigPicture" id="coin`+card.index+`FrameFront" src="`+cleanupImage("pogs/pogFront")+`"
                            style="filter:brightness(100%); border: none; max-width: none; width: `+coinSize+`px; height: `+coinSize+`px; position: absolute; clip-path: circle(48.5%); max-height:none; cursor: pointer;">
                        </div>
                    </div>
                </div>
            </div>	
        `;
    }
    document.getElementById(categoryID).innerHTML += finalImage
}

function flipCoin(target, side) {
    var coin = document.getElementById(target);
	const coinToFlip = pogList.find(pogTarget => pogTarget.index === target);
	//console.log(pogList)
	if (side) {
		coinToFlip.timer == 0;
	}
	if (coinToFlip.timer == 0) {
		if (coinToFlip.face == "front") {
			coin.style.transform = "rotateY(900deg)";
			coinToFlip.face = "back";
		}
		else {
			coin.style.transform = "rotateY(0deg)";
			coinToFlip.face = "front";
		}
		coinToFlip.timer = 1;
		setTimeout(function(){ coinToFlip.timer = 0; }, 1000);
		soundEffectStart("purchase");
	}
	
}

function cullGrids() {
    var jiggyToggleButton = document.getElementById('jiggyToggleButton');
    if (jiggyToggleButton) {
        jiggyToggleButton.remove();
    }
	var galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        galleryGrid.remove();
    }
    var finishedGrid = document.getElementById('finishedGrid');
    if (finishedGrid) {
        finishedGrid.remove();
    }
    var coinZoomIn = document.getElementById('coinZoomIn');
    if (coinZoomIn) {
        coinZoomIn.remove();
    }
    var coinZoomOut = document.getElementById('coinZoomOut');
    if (coinZoomOut) {
        coinZoomOut.remove();
    }
}

function appendGrids(type) {
    if (type == "pogs") {
        document.getElementById('output').innerHTML += `
            <div id="galleryGrid" style="display:grid; grid-template-columns:repeat(auto-fill, `+coinSize+`px);justify-content:center;">
            </div>
        `;
    }
    else {
        document.getElementById('output').innerHTML += `
            <div id="galleryGrid" class="jiggyGrid" style="display:grid;">
            </div>
        `;
        document.getElementById('output').innerHTML += `
            <div id="finishedGrid" class="jiggyGrid" style="display:grid;">
            </div>
        `;
    }
}