var contentArray = [
	{
		index: "male", characters: "foxm, mesu, fash, fashionista, bee, helper", trueImg: "fashionista/achievement1", falseImg: "system/ui/stop", 
		trueText: "Male characters, like mesuF and fashF, will appear in the game as normal.", 
		falseText: "Male-identifying characters, like mesuF and fashF, will not appear in the game. If both this and the next option are disabled, you'll be playing Vegetarian Mode.", 
		unsetText: "Toggles male-identifying characters such as femboys."
	},
	{
		index: "dickgirl", characters: "hyena, bat, shark", trueImg: "hyena/achievement1", falseImg: "system/ui/stop", 
		trueText: "Female characters with dicks, like hyenaF, will appear in the game as normal.", 
		falseText: "Female characters with dicks, like hyenaF, will not appear in the game. If both this and the previous option are disabled, you'll be playing Vegetarian Mode.", 
		unsetText: "Toggles female-identifying characters with dicks."
	},
	{
		index: "female", characters: "", trueImg: "wolf/achievement2", falseImg: "system/ui/stop", 
		trueText: "Characters without dicks will appear in the game as normal.", 
		falseText: "Characters without dicks will not appear in the game. This enables Carnivore Mode.", 
		unsetText: "Toggles characters without dicks."
	},
	{
		index: "mayor", characters: "", trueImg: "mayor/achievement1Meat", falseImg: "mayor/achievement1Veggie", 
		trueText: "mayorF will be depicted with a penis. Some scenes will have minor textual differences, other scenes may be changed more dramatically.", 
		falseText: "mayorF will be depicted without a penis. Some scenes will have minor textual differences, other scenes may be changed more dramatically.", 
		unsetText: "Toggles mayorF's sex."
	},
	{
		index: "carpenter", characters: "", trueImg: "carpenter/achievement1Meat", falseImg: "carpenter/achievement1Veggie", 
		trueText: "carpenterF will be depicted with a penis. Some scenes will have minor textual differences, other scenes may be changed more dramatically.", 
		falseText: "carpenterF will be depicted without a penis. Some scenes will have minor textual differences, other scenes may be changed more dramatically.", 
		unsetText: "Toggles carpenterF's sex."
	},
	{
		index: "shopkeep", characters: "", trueImg: "shopkeep/achievement1Meat", falseImg: "shopkeep/achievement1Veggie", 
		trueText: "shopkeepF will be depicted with a penis. Some scenes will have minor textual differences, other scenes may be changed more dramatically.", 
		falseText: "shopkeepF will be depicted without a penis. Some scenes will have minor textual differences, other scenes may be changed more dramatically.", 
		unsetText: "Toggles shopkeepF's sex."
	},
	{
		index: "rosebud", characters: "", trueImg: "", falseImg: "", 
		trueText: "After-anal scenes will be shown as normal.", 
		falseText: "After-anal scenes will use anal gaping.", 
		unsetText: "Toggles the appearance of after-anal scenes between normal and anal gaping."
	},
	{
		index: "playerSub", characters: "hyena", trueImg: "", falseImg: "system/ui/stop", 
		trueText: "Scenes where the player is the bottom are not removed.", 
		falseText: "All scenes where the player bottoms are removed, and hyenaF is disabled.", 
		unsetText: "Enables / disables scenes where the player is submissive / the bottom, such as pegging."
	},
	{
		index: "pregnancy", characters: "milf", trueImg: "milf/achievement1", falseImg: "system/ui/stop", 
		trueText: "Scenes depicting pregnant characters are not removed.", 
		falseText: "All scenes depicting pregnant characters are removed, and milfF is disabled.", 
		unsetText: "Enables / disables scenes depicting pregnancy. Does not effect insemination, only scenes where a character is visibly pregnant."
	},
	{
		index: "atw", characters: "", trueImg: "", falseImg: "system/ui/stop", 
		trueText: "All-The-Way-Through content will be displayed, often as small extensions of scenes showing an ejaculation passing all the way through a character's body.", 
		falseText: "All-The-Way-Through content will not be displayed. Some scenes may be slightly shorter.", 
		unsetText: "Enables / disables all-The-Way-Through content."
	},
	{
		index: "cbt", characters: "", trueImg: "mesu/mesu2-2", falseImg: "system/ui/stop", 
		trueText: "Ballbusting content will be displayed. Note that this is limited to gently stepping on / plapping / tapping the balls via a hand or foot, and only on masochistic characters. There's no being mean in Syrup Town!", 
		falseText: "Ballbusting content will not be displayed. Some scenes may be slightly shorter, some may be removed altogether.", 
		unsetText: "Enables / disables ballbusting content."
	},
	{
		index: "urethral", characters: "", trueImg: "", falseImg: "system/ui/stop", 
		trueText: "Unusual orifice penetration, such as sounding, urethral insertion, or nipple insertion content is enabled.", 
		falseText: "Content involving unusual orifice penetration, such as sounding, urethral insertion, or nipple insertion has been disabled.", 
		unsetText: "Enables / disables content depicting unusual orifice penetration."
	},
	{
		index: "rimming", characters: "", trueImg: "", falseImg: "", 
		trueText: "Scenes depicting anilinus, or playing the rusty trombone, are not removed. If the player sub option is enabled, the player will be allowed to rim other characters.", 
		falseText: "All scenes depicting anilingus are removed.", 
		unsetText: "Enables / disables scenes depicting anilingus, aka playing the rusty trombone."
	},
	{
		index: "feral", characters: "deity", trueImg: "", falseImg: "system/ui/stop", 
		trueText: "Content depicting feral characters will appear in the game as normal. Mostly affects collectable cards.", 
		falseText: "All content depicting feral creatures (basically, anything not walking on two legs), has been disabled.", 
		unsetText: "Enables / disables content depicting feral creatures. Mostly affects collectable cards."
	},
	/*
	{
		index: "watersports", characters: "", trueImg: "", falseImg: "", 
		trueText: "Scenes depicting watersports are not removed (the liquid is still clear though!).", 
		falseText: "All scenes depicting watersports are removed.", 
		unsetText: "Enables / disables scenes depicting watersports. If enabled, the liquid is shown as clear, not yellow."
	},
	{
		index: "threesomes", characters: "doe", trueImg: "", falseImg: "", 
		trueText: "Bisexual threesomes, and any scenes depicting other characters pairing up without the player, are not disabled.", 
		falseText: "All threesomes and scenes depicting other characters pairing up without the player are removed.", 
		unsetText: "Enables / disables scenes where other characters have sex with each other. This could be in a threesome with the player or without the player being present."
	},
	*/
	{
		index: "animated", characters: "", trueImg: "", falseImg: "system/ui/stop", 
		trueText: "Some images will be animated. Very limited, until more animated shots can be implemented.", 
		falseText: "All animated shots have been disabled. Still images only.", 
		unsetText: "Enables / disables animated shots."
	},
	{
		index: "weird", characters: "", trueImg: "items/lurm", falseImg: "system/ui/stop", 
		trueText: "Monster Fucker content is fully enabled. Weird events can appear when gathering and weird items can be fucked in your house.", 
		falseText: "Monster Fucker content has been disabled. Weird events and some items will not appear when gathering.", 
		unsetText: "Toggles weird things."
	},
]

var tagAliases = [
	["boys", "male"],
	["boy", "male"],
	["males", "male"],

	["futanari", "dickgirl"],
	["futa", "dickgirl"],
	["dickgirls", "dickgirl"],

	["girls", "female"],
	["girl", "female"],
	["females", "female"],

	["sounding", "urethral"],
	["prolapse", "rosebud"],
	["sub", "playerSub"],
	["preg", "pregnancy"],
	["atwt", "atw"],
	["all the way through", "atw"],
	["ballbusting", "cbt"],
	["ws", "watersports"],
	["pee", "watersports"],
	["piss", "watersports"],
	["pissing", "watersports"],
	["anilingus", "rimming"],
	["rim", "rimming"],
	["rimjob", "rimming"],
	["rimjobs", "rimming"],
	["sharing", "threesomes"],
	["threesome", "threesomes"],
]

var fetishFullNamesArray = [
	["male", "Boys"],
	["dickgirl", "Girls (With Dicks)"],
	["female", "Girls (Without Dicks)"],
	["mayor", "Mayor"],
	["carpenter", "Carpenter"],
	["shopkeep", "Shopkeep"],
	["rosebud", "Rosebud"],
	["playerSub", "Player Sub"],
	["pregnancy", "Pregnancy"],
	["feral", "Feral"],
	["watersports", "Watersports"],
	["rimming", "Anilingus"],
	["bisexual", "Threesomes/Sharing"],
	["cbt", "Ballbusting"],
	["atw", "All-The-Way-Through"],
	["animated", "Animated Images"],
	["weird", "Weird Stuff"],
	["urethral", "Unusual Penetration"],
]

//Image fallbacks for disabled filters. An image whose name ends in a filter's index, in any case and
//with or without a dash ("exampleCbt", "examplecbt", "example-cbt"), is shown as the plain image
//("example") while that filter is disabled. The suffix may also sit before skintone or gender tags,
//so "example-cbt-light" falls back to "example-light".
//The sex and character filters are skipped: their "false" means a different body rather than hidden
//content, and their names already end ordinary images ("interiorMayor", "ruins-chalice-gold-female").
var imageSuffixSkippedFilters = ["male", "dickgirl", "female", "mayor", "carpenter", "shopkeep"];
function filterImageSuffixes(image) {
	if (typeof image != "string" || !data.player || !data.player.filters) {
		return image;
	}
	var slashIndex = image.lastIndexOf("/");
	var folder = image.slice(0, slashIndex + 1);
	var fileName = image.slice(slashIndex + 1);
	for (let filterIndex = 0; filterIndex < data.player.filters.length; filterIndex++) {
		var filter = data.player.filters[filterIndex];
		if (filter.status != "false" || imageSuffixSkippedFilters.includes(filter.index)) {
			continue;
		}
		if (fileName.toLowerCase().includes(String(filter.index).toLowerCase()) == false) {
			continue;
		}
		//(.+?) requires a name before the suffix, so an image named just "animated" is left alone
		var escapedIndex = String(filter.index).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		var suffixPattern = new RegExp("^(.+?)-?" + escapedIndex + "((?:-(?:light|tan|dark|masc|fem))*)$", "i");
		fileName = fileName.replace(suffixPattern, "$1$2");
	}
	return folder + fileName;
}

function checkFetishes() {
	//Initialize fetish list if necessary
	if (data.player.filters == null || data.player.filters == undefined) {
		data.player.filters = [];
		data.player.characterBlacklist = "";
		data.player.characterWhitelist = "";
	}

	//Check fetish list for missing fetishes
	for (contentIndex = 0; contentIndex < contentArray.length; contentIndex++) {
		var initializeThisFetish = true;
		for (playerIndex = 0; playerIndex < data.player.filters.length; playerIndex++) {
			if (data.player.filters[playerIndex].index == contentArray[contentIndex].index) {
				initializeThisFetish = false;
			}
		}
		if (initializeThisFetish == true) {
			console.info("Initializing fetish "+contentArray[contentIndex].index);
			initializeFetish(contentArray[contentIndex].index);
		}
	}
	//Ensure already-present fetishes are accurate to in-game settings
	for (playerIndex = 0; playerIndex < data.player.filters.length; playerIndex++) {
		switch (data.player.filters[playerIndex].index) {
			//System character gender checks
			case "mayor": {
				if (checkFlag("mayor", "meat") == true) {
					data.player.filters[playerIndex].status = "true";
				}
				else {
					data.player.filters[playerIndex].status = "false";
				}
				break;
			}
			case "carpenter": {
				if (checkFlag("carpenter", "meat") == true) {
					data.player.filters[playerIndex].status = "true";
				}
				else {
					data.player.filters[playerIndex].status = "false";
				}
				break;
			}
			case "shopkeep": {
				if (checkFlag("shopkeep", "meat") == true) {
					data.player.filters[playerIndex].status = "true";
				}
				else {
					data.player.filters[playerIndex].status = "false";
				}
				break;
			}
			//Others
			case "rosebud": {
				if (checkFlag("player", "prolapse") != true) {
					data.player.filters[playerIndex].status = "true";
				}
				else {
					data.player.filters[playerIndex].status = "false";
				}
				break;
			}
			case "male":
			case "dickgirl": {
				if (data.player.vegetarian == true) {
					data.player.filters[playerIndex].status = "false";
				}
				break;
			}
			case "female": {
				if (data.player.carnivore == true) {
					data.player.filters[playerIndex].status = "false";
				}
				break;
			}
		}
	}
}

function initializeFetish(fetish) {
	//Used for determining default fetish status, based on already-configured settings where possible
	console.info("Initializing fetish: "+fetish);
	switch (fetish) {
		case "male": 
		case "dickgirl": {
			if (data.player.vegetarian == true) {
				newFilter = {index: contentArray[contentIndex].index, status: "false"};
			}
			else {
				newFilter = {index: contentArray[contentIndex].index, status: "true"};
			}
			break;
		}
		case "female": {
			if (data.player.carnivore == true) {
				newFilter = {index: contentArray[contentIndex].index, status: "false"};
			}
			else {
				newFilter = {index: contentArray[contentIndex].index, status: "true"};
			}
			break;
		}
		case "rosebud": {
			if (checkFlag("player", "prolapse") != true) {
				newFilter = {index: contentArray[contentIndex].index, status: "true"};
			}
			else {
				newFilter = {index: contentArray[contentIndex].index, status: "false"};
			}
			break;
		}
		case "mayor": {
			if (checkFlag("mayor", "meat") == true) {
				newFilter = {index: contentArray[contentIndex].index, status: "true"};
			}
			else {
				newFilter = {index: contentArray[contentIndex].index, status: "false"};
			}
			break;
		}
		case "carpenter": {
			if (checkFlag("carpenter", "meat") == true) {
				newFilter = {index: contentArray[contentIndex].index, status: "true"};
			}
			else {
				newFilter = {index: contentArray[contentIndex].index, status: "false"};
			}
			break;
		}
		case "shopkeep": {
			if (checkFlag("shopkeep", "meat") == true) {
				newFilter = {index: contentArray[contentIndex].index, status: "true"};
			}
			else {
				newFilter = {index: contentArray[contentIndex].index, status: "false"};
			}
			break;
		}
		case "weird": {
				newFilter = {index: contentArray[contentIndex].index, status: "false"};
			break;
		}
		case "animated": {
				newFilter = {index: contentArray[contentIndex].index, status: "false"};
			break;
		}
		default: {
			newFilter = {index: contentArray[contentIndex].index, status: "true"};
			break;
		}
	}
	data.player.filters.push(newFilter);
}

function cleanupFetishes() {
	//Cleanup function to set in-game determinators based on fetish menu settings
	//Note to anyone reading this: An intelligent noodle would have had this from the start instead of all the slapdash checks I used before adding this. Sorry...
	//Initialize variables
	data.player.characterBlacklist = "";
	data.player.characterWhitelist = "";
	var setVegetarian = 0;


	for (playerIndex = 0; playerIndex < data.player.filters.length; playerIndex++) {
		//Add specific characters to blacklist/whitelist if a fetish names them specifically
		for (contentIndex = 0; contentIndex < contentArray.length; contentIndex++) {
			if (contentArray[contentIndex].index == data.player.filters[playerIndex].index) {
				if (data.player.filters[playerIndex].status == "false" && contentArray[contentIndex].characters != "") {
					data.player.characterBlacklist += contentArray[contentIndex].characters+", ";
				}
				else if (data.player.filters[playerIndex].status == "true" && contentArray[contentIndex].characters != "") {
					data.player.characterWhitelist += contentArray[contentIndex].characters+", ";
				}
			}
		}

		//Determine if carnivore mode should be activated
		if (data.player.filters[playerIndex].index == "female") {
			if (data.player.filters[playerIndex].status == "false") {
				data.player.carnivore = true;
			}
			else if (data.player.filters[playerIndex].status == "true") {
				data.player.carnivore = false;
			}
		}

		//Use the status of male and dickgirl to determine if vegetarian mode should be activated
		if (data.player.filters[playerIndex].index == "male" || data.player.filters[playerIndex].index == "dickgirl") {
			if (data.player.filters[playerIndex].status == "false") {
				setVegetarian += 1;
			}
			else if (data.player.filters[playerIndex].status == "true") {
				setVegetarian -= 1;
			}
		}

		//Determine if no-prolapse mode should be activated
		if (data.player.filters[playerIndex].index == "rosebud") {
			if (data.player.filters[playerIndex].status == "false") {
				addFlag("player", "prolapse");
			}
			else if (data.player.filters[playerIndex].status == "true") {
				removeFlag("player", "prolapse");
			}
		}

		//Determine sexes of mayor, carpenter, and shopkeep
		for (systemCharsIndex = 0; systemCharsIndex < systemChars.length; systemCharsIndex++) {
			if (data.player.filters[playerIndex].index == systemChars[systemCharsIndex]) {
				if (data.player.filters[playerIndex].status == "false") {
					addFlag(systemChars[systemCharsIndex], "veggie");
					removeFlag(systemChars[systemCharsIndex], "meat");
				}
				if (data.player.filters[playerIndex].status == "true") {
					addFlag(systemChars[systemCharsIndex], "meat");
					removeFlag(systemChars[systemCharsIndex], "veggie");
				}
			}
		}
	}
	if (setVegetarian > 1) {
		data.player.vegetarian = true;
	}
	else if (setVegetarian < -1) {
		data.player.vegetarian = false;
	}
	updateMenu();
}

function toggleFetish(target) {
	for (playerIndex = 0; playerIndex < data.player.filters.length; playerIndex++) {
		if (target == data.player.filters[playerIndex].index) {
			//Obtain fetish full name
			var finalLabel = "";
			for (fetishIndex = 0; fetishIndex < fetishFullNamesArray.length; fetishIndex++) {
				if (target == fetishFullNamesArray[fetishIndex][0]) {
					finalLabel = fetishFullNamesArray[fetishIndex][1] + " - ";
				}
			}

			console.log("Toggling fetish "+target);
			if (data.player.filters[playerIndex].status == "true") {
				data.player.filters[playerIndex].status = "false";
				for (contentIndex = 0; contentIndex < contentArray.length; contentIndex++) {
					if (contentArray[contentIndex].index == target) {
						if (contentArray[contentIndex].index.includes("animated")) {
							document.getElementById('fetishImage'+contentArray[contentIndex].index).style.visibility = "visible";
							document.getElementById('fetishVideo'+contentArray[contentIndex].index).style.visibility = "hidden";
						}
						else {
							document.getElementById('fetishImage'+contentArray[contentIndex].index).src = cleanupImage(contentArray[contentIndex].falseImg);
						}
						document.getElementById('fetishLabel'+contentArray[contentIndex].index).innerHTML = finalLabel + "Disabled";
						if (contentArray[contentIndex].index == "mayor" || contentArray[contentIndex].index == "carpenter" || contentArray[contentIndex].index == "shopkeep") {
							document.getElementById('fetishLabel'+contentArray[contentIndex].index).innerHTML = finalLabel +"Pussy";
						}
						document.getElementById('fetishLabel'+contentArray[contentIndex].index).style.color = "#FF0000";
						document.getElementById('fetishText'+contentArray[contentIndex].index).innerHTML = replaceCodenames(contentArray[contentIndex].falseText);
					}
				}
			}
			else {
				data.player.filters[playerIndex].status = "true";
				for (contentIndex = 0; contentIndex < contentArray.length; contentIndex++) {
					if (contentArray[contentIndex].index == target) {
						if (contentArray[contentIndex].index.includes("animated")) {
							document.getElementById('fetishImage'+contentArray[contentIndex].index).style.visibility = "hidden";
							document.getElementById('fetishVideo'+contentArray[contentIndex].index).style.visibility = "visible";
						}
						else {
							document.getElementById('fetishImage'+contentArray[contentIndex].index).src = cleanupImage(contentArray[contentIndex].trueImg);
						}
						document.getElementById('fetishLabel'+contentArray[contentIndex].index).innerHTML = finalLabel +"Enabled";
						if (contentArray[contentIndex].index == "mayor" || contentArray[contentIndex].index == "carpenter" || contentArray[contentIndex].index == "shopkeep") {
							document.getElementById('fetishLabel'+contentArray[contentIndex].index).innerHTML = finalLabel +"Penis";
						}
						document.getElementById('fetishLabel'+contentArray[contentIndex].index).style.color = "#00FF00";
						document.getElementById('fetishText'+contentArray[contentIndex].index).innerHTML = replaceCodenames(contentArray[contentIndex].trueText);
					}
				}
			}
		}
	}
}

function fetishes(tags) {
	var result = true;
	//No tags = no restrictions. Base events get tags normalized to "" at boot, but
	//mod-registered events can reach this before any normalization pass has run.
	if (tags == undefined || tags == null) {
		return result;
	}
	//Each tag is trimmed after the split. The old replace(", ", ",") only fixed the FIRST ", ", so in a
	//list of three or more tags every tag after the second kept a leading space, matched no filter, and
	//was never filtered: "dickgirl, female, feral" ignored the feral filter.
	if (tags.includes(",")) {
		tags = tags.split(",").map(function (tag) { return tag.trim(); });
	}
	else {
		tags = [tags];
	}
	for (tagIndex = 0; tagIndex < tags.length; tagIndex++) {
		if (tags[tagIndex] == "nutmeg") {
			if (doeRemoved == true) {
				result = false;
			}
		}
		//console.info(tags[tagIndex]);
		for (aliasIndex = 0; aliasIndex < tagAliases.length; aliasIndex++) {
			if (tags[tagIndex] == tagAliases[aliasIndex][0]) {
				tags[tagIndex] = tagAliases[aliasIndex][1];
			}
		}
		for (playerIndex = 0; playerIndex < data.player.filters.length; playerIndex++) {
			if (data.player.filters[playerIndex].index == tags[tagIndex]) {
				if (tags[tagIndex] == data.player.filters[playerIndex].index) {
					if (data.player.filters[playerIndex].status == "false") {
						result = false;
					}
					if (data.player.filters[playerIndex].index == "male" || data.player.filters[playerIndex].index == "dickgirl") {
						if (data.player.vegetarian == true) {
							result = false;
						}
					}
					if (data.player.filters[playerIndex].index == "female" || data.player.filters[playerIndex].index == "dickboy") {
						if (data.player.carnivore == true) {
							result = false;
						}
					}
				}
			}
		}
	}
	return(result);
}


function veggieToggle() {
	if (data.player.vegetarian == true) {
		data.player.vegetarian = false;
	}
	else {
		data.player.vegetarian = true;
	}
	writeScene("system", "intro2");
}

function meatToggle() {
	if (data.player.carnivore == true) {
		data.player.carnivore = false;
	}
	else {
		data.player.carnivore = true;
	}
	writeScene("system", "intro2");
}