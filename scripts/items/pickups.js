const initialPickupArray = [
];

//Pickups
function checkForPickups() {
	for (i = 0; i < globalPickupArray.length; i++) {
		//console.info(checkRequirements(globalPickupArray[i].requirements))
		var finalPosition = "";
		if (globalPickupArray[i].top != null) {
			finalPosition += "top: "+globalPickupArray[i].top+"%; ";
		}
		if (globalPickupArray[i].left != null) {
			finalPosition += "left: "+globalPickupArray[i].left+"%; ";
		}
		if (globalPickupArray[i].bottom != null) {
			finalPosition += "bottom: "+globalPickupArray[i].bottom+"%; ";
		}
		if (globalPickupArray[i].right != null) {
			finalPosition += "right: "+globalPickupArray[i].right+"%; ";
		}
		var finalRequirements = globalPickupArray[i].requirements;
		if (data.player.holiday == null) {
			data.player.holiday = "";
		}
		if (data.player.holiday != "" && finalRequirements.includes("?holiday "+data.player.holiday+";") == false) {
			finalRequirements += `?flag player god;`;
		}
		if (globalPickupArray[i].collected == false && checkRequirements(finalRequirements) == true) {
			if(globalPickupArray[i].size) {
				var finalSize = globalPickupArray[i].size;
			}
			else {
				var finalSize = 10;
			}
			if (window.matchMedia('(orientation: portrait)').matches) {
				finalSize = finalSize*2;
			}
			finalSize = finalSize+"%";
			console.log("Testing requirements for pickup: "+globalPickupArray[i])

			document.getElementsByClassName('playerRoom')[0].innerHTML += `
				<img class = "ghost" 
				src = "`+cleanupImage(globalPickupArray[i].image)+`" 
				style="	
				width: `+finalSize+`;			
				`+finalPosition+`
				z-index: 2;"
				onclick='pickupTrigger(`+i+`)'>
			`;
		}
	}
}

function refreshPickups() {
	for (i = 0; i < globalPickupArray.length; i++) {
		if (globalPickupArray[i].collected == true && globalPickupArray[i].unique != true) {
			globalPickupArray[i].collected = false;
		}
	}
}

function pickupTrigger(index) {
	globalPickupArray[index].collected = true;
	if (globalPickupArray[index].unique == true) {
		data.player.collected += globalPickupArray[index].key;
	}
	if (globalPickupArray[index].event == true) {
		writeScene(globalPickupArray[index].character, globalPickupArray[index].index);
	}
	else {
		changeLocation(data.player.location);
		addItem(globalPickupArray[index].index);
	}
	soundEffectStart("pickup");
}

var gatheringArray = [
	{index: "fishingWish", type: "event", triggered: false, requirements: "?location lakesideRetreat;",},
	{index: "fishingGoddessChoice", type: "event", triggered: false, requirements: "?location lakesideRuins;",},
	{index: "gatheringDryad", type: "event", triggered: false, requirements: "?location forestOrchard;",},
	{index: "gatheringMushroomChoice", type: "event", triggered: false, requirements: "?location forestPath;",},
	{index: "gatheringMerchantChoice", type: "event", triggered: false, requirements: "?location forestWilderness; ?item pocket-eev-0; !item pocket-char-3-1;",},
	{index: "huntingMaestro", type: "event", triggered: false, requirements: "?location forestPath;",},
	{index: "huntingFairyChoice", type: "event", triggered: false, requirements: "?location forestWilderness;",},

	{index: "tarot1Meat", type: "collectable", requirements: "?item tarot0; !vegetarian; ?location willowWalk;"},
	{index: "tarot3Meat", type: "collectable", requirements: "?item tarot0; !vegetarian; ?location forestWilderness;"},
	{index: "tarot4Meat", type: "collectable", requirements: "?item tarot0; !vegetarian; ?location forestWilderness;"},
	{index: "tarot5", type: "collectable", requirements: "?item tarot0; ?location riversideRoad;"},
	{index: "tarot6", type: "collectable", requirements: "?item tarot0; ?location forestPath;"},
	//{index: "tarot7Meat", type: "collectable", requirements: "?item tarot0; !vegetarian; ?location riversideRoad;"},
	{index: "tarot8Meat", type: "collectable", requirements: "?item tarot0; !vegetarian; ?location lavenderLane;"},
	{index: "tarot9", type: "collectable", requirements: "?item tarot0; ?location lakesideRetreat;"},
	{index: "tarot10", type: "collectable", requirements: "?item tarot0; ?location forestWilderness;"},
	{index: "tarot11", type: "collectable", requirements: "?item tarot0; ?location forestPath;"},
	{index: "tarot12", type: "collectable", requirements: "?item tarot0; ?location lakesideRuins;"},
	{index: "tarot13", type: "collectable", requirements: "?item tarot0; ?location lavenderLane;"},
	{index: "tarot14", type: "collectable", requirements: "?item tarot0; ?location forestOrchard;"},
	{index: "tarot15Meat", type: "collectable", requirements: "?item tarot0; !vegetarian; ?location willowWalk;"},
	{index: "tarot16", type: "collectable", requirements: "?item tarot0; ?location forestOrchard;"},
	{index: "tarot17Meat", type: "collectable", requirements: "?item tarot0; !vegetarian; ?location forestOrchard;"},
	{index: "tarot18Meat", type: "collectable", requirements: "?item tarot0; !vegetarian; ?location forestOrchard;"},
	{index: "tarot19Meat", type: "collectable", requirements: "?item tarot0; !vegetarian; ?location lavenderLane;"},

    {index: `mayor-core1`, type: "collectable", requirements: "",},
	{index: "shopkeep-core1", type: "collectable", requirements: "",},
    {index: `carpenter-core1`, type: "collectable", requirements: "",},
    {index: `wolf-core1`, type: "collectable", requirements: "?female;",},
    {index: `sadogato-core1`, type: "collectable", requirements: "?female;",},
    {index: `milf-core1`, type: "collectable", requirements: "?female; ?pregnancy;",},
    {index: `nun-core1`, type: "collectable", requirements: "?female;",},
    {index: `fashionista-core1`, type: "collectable", requirements: "?male;",},
    {index: `mesu-core1`, type: "collectable", requirements: "?male;",},
    {index: `hyena-core1`, type: "collectable", requirements: "?dickgirl;",},
    {index: `doe-core1`, type: "collectable", requirements: "?dickgirl;",},

    {index: `mayor-cozy`, type: "collectable", requirements: "",},
	{index: "shopkeep-cozy", type: "collectable", requirements: "",},
    {index: `carpenter-cozy`, type: "collectable", requirements: "",},
    {index: `foxf-cozy`, type: "collectable", requirements: "?female;",},
    {index: `foxm-cozy`, type: "collectable", requirements: "?male;",},
    {index: `wolf-cozy`, type: "collectable", requirements: "?female;",},
    {index: `sadogato-cozy`, type: "collectable", requirements: "?female;",},
    {index: `milf-cozy`, type: "collectable", requirements: "?female; ?pregnancy;",},
    {index: `nun-cozy`, type: "collectable", requirements: "?female;",},
    {index: `fashionista-cozy`, type: "collectable", requirements: "?male;",},
    {index: `mesu-cozy`, type: "collectable", requirements: "?male;",},
    {index: `hyena-cozy`, type: "collectable", requirements: "?dickgirl;",},
    {index: `doe-cozy`, type: "collectable", requirements: "?dickgirl;",},

    {index: `jiggy-bonus3v`, type: "collectable", requirements: "!vegetarian;",},
    {index: `anubian-core1`, type: "collectable", image: `jiggy/anubianc`, requirements: "!vegetarian;",},
    {index: `jiggy-evilteamc`, type: "collectable", image: `jiggy/evilteamc`, requirements: "!vegetarian;",},
    {index: `jiggy-sentaiv`, type: "collectable", image: `jiggy/sentaiv`, requirements: "!carnivore;",},
    {index: `jiggy-bonus2c`, type: "collectable", image: `jiggy/bar-4`, requirements: "!vegetarian;",},
    {index: `group-veggie1`, type: "collectable", image: `jiggy/group-veggie1`, requirements: "!carnivore;",},
    {index: `group-veggie2`, type: "collectable", image: `jiggy/group-veggie2`, requirements: "!carnivore;",},
    {index: `group-veggie3`, type: "collectable", image: `jiggy/group-veggie3`, requirements: "!carnivore;",},
    {index: `group-meat1`, type: "collectable", image: `jiggy/group-meat1`, requirements: "!vegetarian;",},
    {index: `group-meat2`, type: "collectable", image: `jiggy/group-meat2`, requirements: "!vegetarian;",},
    {index: `group-meat3`, type: "collectable", image: `jiggy/group-meat3`, requirements: "!vegetarian;",},

	{index: "mayorMagazineMeat", type: "collectable", requirements: " !vegetarian; ?flag mayor meat;",},
	{index: "mayorMagazineVeggie", type: "collectable", requirements: " !carnivore; ?flag mayor veggie;",},
	{index: "mayorMagazineMeat", type: "collectable", requirements: " !vegetarian; ?item mayorMagazineVeggie;",},
	{index: "mayorMagazineVeggie", type: "collectable", requirements: " !carnivore; ?item mayorMagazineMeat;",},
	{index: "carpenterMagazineMeat", type: "collectable", requirements: " !vegetarian; ?item carpenterMagazineVeggie;",},
	{index: "carpenterMagazineVeggie", type: "collectable", requirements: " !carnivore; ?item carpenterMagazineMeat;",},
	{index: "shopkeepMagazineMeat", type: "collectable", requirements: " !vegetarian; ?item shopkeepMagazineVeggie;",},
	{index: "shopkeepMagazineVeggie", type: "collectable", requirements: " !carnivore; ?item shopkeepMagazineMeat;",},
	{index: "wolfMagazine", type: "collectable", requirements: " !carnivore;",},
	{index: "sadogatoMagazine", type: "collectable", requirements: " !carnivore;",},
	{index: "milfMagazine", type: "collectable", requirements: " !carnivore;",},
	{index: "nunMagazine", type: "collectable", requirements: " !carnivore;",},
	{index: "mommyMagazine", type: "collectable", requirements: " !carnivore; ?nutmeg;",},
	{index: "fashMagazine", type: "collectable", requirements: " !vegetarian;",},
	{index: "mesuMagazine", type: "collectable", requirements: " !vegetarian;",},
	{index: "doeMagazine", type: "collectable", requirements: " !vegetarian; ?nutmeg;",},
	{index: "hyenaMagazine", type: "collectable", requirements: " !vegetarian;",},
	{index: "foxfMagazine", type: "collectable", requirements: " !carnivore;",},
	{index: "foxmMagazine", type: "collectable", requirements: " !vegetarian;",},

	{index: "mayorPog", type: "collectable", requirements: "",},
    {index: "foxfPog", type: "collectable", requirements: "!carnivore;",},
    {index: "foxmPog", type: "collectable", requirements: "!vegetarian;",},
    {index: "wolfPog", type: "collectable", requirements: "!carnivore;",},
    {index: "sadogatoPog", type: "collectable", requirements: "!carnivore;",},
    {index: "milfPog", type: "collectable", requirements: "!carnivore;",},
    {index: "nunPog", type: "collectable", requirements: "!carnivore;",},
    {index: "mommyPog", type: "collectable", requirements: "!carnivore; !vegetarian; ?nutmeg;",},
    {index: "mesuPog", type: "collectable", requirements: "!vegetarian;",},
    {index: "fashionistaPog", type: "collectable", requirements: "!vegetarian;",},
    {index: "hyenaPog", type: "collectable", requirements: "!vegetarian;",},
    {index: "doePog", type: "collectable", requirements: "!vegetarian; ?nutmeg;",},

	{index: "mayorGathering", type: "event", triggered: false, requirements: "?location lavenderLane; ?trustMin mayor 1;",},
	{index: "carpenterGathering", type: "event", triggered: false, requirements: "?location forestOrchard; ?trustMin carpenter 1;",},
	{index: "shopkeepGathering", type: "event", triggered: false, requirements: "?location lavenderLane; ?trustMin shopkeep 1;",},
	{index: "wolfGathering", type: "event", triggered: false, requirements: "?location lavenderLane; ?trustMin wolf 1;",},
	{index: "sadogatoGathering", type: "event", triggered: false, requirements: "?location forestOrchard; ?trustMin sadogato 1;",},
	{index: "milfGathering", type: "event", triggered: false, requirements: "?location forestOrchard; ?trustMin milf 5;",},
	{index: "nunGathering", type: "event", triggered: false, requirements: "?location forestPath; ?trustMin nun 1;",},
	{index: "fashionistaGathering", type: "event", triggered: false, requirements: "?location lavenderLane; ?trustMin fashionista 1;",},
	{index: "mesuGathering", type: "event", triggered: false, requirements: "?location forestOrchard; ?trustMin mesu 1;",},
	{index: "doeGathering", type: "event", triggered: false, requirements: "?location forestOrchard; ?trustMin doe 1; ?nutmeg;",},
	{index: "hyenaGathering", type: "event", triggered: false, requirements: "?location forestPath; ?trustMin hyena 1;",},

	{index: "mayorHunting", type: "event", triggered: false, requirements: "?location willowWalk; ?trustMin mayor 1;",},
	{index: "carpenterHunting", type: "event", triggered: false, requirements: "?location forestPath; ?trustMin carpenter 1;",},
	{index: "shopkeepHunting", type: "event", triggered: false, requirements: "?location forestWilderness; ?trustMin shopkeep 1;",},
	{index: "wolfHunting", type: "event", triggered: false, requirements: "?location willowWalk; ?trustMin wolf 1;",},
	{index: "sadogatoHunting", type: "event", triggered: false, requirements: "?location forestWilderness; ?trustMin sadogato 1;",},
	{index: "milfHunting", type: "event", triggered: false, requirements: "?location forestPath; ?trustMin milf 5;",},
	{index: "nunHunting", type: "event", triggered: false, requirements: "?location forestWilderness; ?trustMin nun 1;",},
	{index: "fashionistaHunting", type: "event", triggered: false, requirements: "?location forestWilderness; ?trustMin fashionista 1;",},
	{index: "mesuHunting", type: "event", triggered: false, requirements: "?location willowWalk; ?trustMin mesu 1;",},
	{index: "doeHunting", type: "event", triggered: false, requirements: "?location forestPath; ?trustMin doe 1; ?nutmeg;",},
	{index: "hyenaHunting", type: "event", triggered: false, requirements: "?location forestWilderness; ?trustMin hyena 1;",},
	//{index: "permitIntro0", type: "event", triggered: false, requirements: "?location forestWilderness; !item permit; !item unknownWorm;",},

	{index: "carpenterFishing", type: "event", triggered: false, requirements: "?location lakesideRuins; ?trustMin carpenter 1;",},
	{index: "shopkeepFishing", type: "event", triggered: false, requirements: "?location riversideRoad; ?trustMin shopkeep 1;",},
	{index: "wolfFishing", type: "event", triggered: false, requirements: "?location riversideRoad; ?trustMin wolf 1;",},
	{index: "sadogatoFishing", type: "event", triggered: false, requirements: "?location lakesideRetreat; ?trustMin sadogato 1;",},
	{index: "milfFishing", type: "event", triggered: false, requirements: "?location lakesideRetreat; ?trustMin milf 5;",},
	{index: "nunFishing", type: "event", triggered: false, requirements: "?location riversideRoad; ?trustMin nun 1;",},
	{index: "fashionistaFishing", type: "event", triggered: false, requirements: "?location lakesideRetreat; ?trustMin fashionista 1;",},
	{index: "mesuFishing", type: "event", triggered: false, requirements: "?location riversideRoad; ?trustMin mesu 1;",},
	{index: "doeFishing", type: "event", triggered: false, requirements: "?location lakesideRetreat; ?trustMin doe 1; ?nutmeg;",},
	{index: "hyenaFishing", type: "event", triggered: false, requirements: "?location lakesideRuins; ?trustMin hyena 1;",},
	
	{index: "fruit-cheeries", type: "common", requirements: "",},
	{index: "fruit-dewdrop", type: "common", requirements: "?location forestOrchard;",},
	{index: "fruit-assple-seed", type: "common", requirements: "?location forestOrchard; ?weird;",},
	{index: "bug-crimket", type: "common", requirements: "",},
	{index: "bug-flumph", type: "common", requirements: "?location forestWilderness;",},
	{index: "bug-lurm", type: "common", requirements: "?location forestWilderness; ?weird;",},
	{index: "fish-yuppie", type: "common", requirements: "",},
	{index: "fish-foambeard", type: "common", requirements: "?location lakesideRetreat;",},
	{index: "fish-fooba", type: "common", requirements: "?location lakesideRetreat; ?weird;",},
]

function gathering(n) {
	//Make a list of each gatheringArray entries that are collectable or events where we meet the requirements
	var possibleEvents = []
	for (gatheringIndex = 0; gatheringIndex < gatheringArray.length; gatheringIndex++) {
		if (gatheringArray[gatheringIndex].type == "collectable") {
			if (gatheringArray[gatheringIndex].requirements.includes("!item "+gatheringArray[gatheringIndex].index+";") == false) {
				gatheringArray[gatheringIndex].requirements += "!item "+gatheringArray[gatheringIndex].index+";"
			}
		}
		if (checkRequirements(gatheringArray[gatheringIndex].requirements) && gatheringArray[gatheringIndex].type != "common") {
			var addItemToList = true;

			var actionsList = ["hunting", "gathering", "fishing"];
			for (actionsIndex = 0; actionsIndex < actionsList.length; actionsIndex++) {
				if (gatheringArray[gatheringIndex].index.toLowerCase().includes(actionsList[actionsIndex])) {
					addItemToList = false;
					console.log(gatheringArray[gatheringIndex].index.toLowerCase());
					if (n.toLowerCase().includes(actionsList[actionsIndex])) {
						addItemToList = true;
					}
				}
			}
			
			if (gatheringArray[gatheringIndex].type == "event" && addItemToList == true) {
				addItemToList = true;
				for (eventCounter = 0; eventCounter < data.player.pickupLog.length; eventCounter++) {
					if (data.player.pickupLog[eventCounter][0] == gatheringArray[gatheringIndex].index) {
						addItemToList = false;
					}
				}
			}
			
			if (addItemToList == true) {
				possibleEvents.push(gatheringArray[gatheringIndex])
			}
		}
	}

	
	for (eventCounter = 0; eventCounter < data.player.pickupLog.length; eventCounter++) {
		if (data.player.pickupLog[eventCounter][1] > 0) {
			data.player.pickupLog[eventCounter][1] -= 1;
			if (data.player.pickupLog[eventCounter][1] === 0) {
				data.player.pickupLog.splice(eventCounter, 1);
			}
		}
	}

	console.log(possibleEvents)
	if (possibleEvents.length != 0) {
		//Select a random event from the list of possible events
		var randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
		for (priorityCounter = 0; priorityCounter < 7; priorityCounter++) {
			if (randomEvent.index.includes("Pog")) {
				randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
			}
			if (randomEvent.index.includes("jiggy")) {
				randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
			}
			if (randomEvent.index.includes("Magazine")) {
				randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
			}
		}
		console.log(randomEvent)
		if (randomEvent.type == "collectable") {
			writeHTML(`t You explore and forage for a while, eventually finding something nice!`)
			gatherItem(n);
			console.info(randomEvent.index)
			addItem(randomEvent.index)
			writeHTML(`trans cancel; Finish`)
		}
		else {
			var logEntry = [randomEvent.index, getRandomInt(18)+7];
			data.player.pickupLog.push(logEntry);
			//randomEvent.triggered = true;
			gatherEvent(randomEvent.index);
		}
	}
	else {
		changeLocation(data.player.location)
		gatherItem(n);
	}
}

function gatherItem(action) {
	//Make a new list searching for only common events
	var possibleEvents = [];
	for (gatheringIndex = 0; gatheringIndex < gatheringArray.length; gatheringIndex++) {
		if (checkRequirements(gatheringArray[gatheringIndex].requirements) && gatheringArray[gatheringIndex].type == "common") {
			var addItemToList = true;
			//console.info(action)
			if (gatheringArray[gatheringIndex].index.includes("fruit")) {
				addItemToList = false;
				if (action.includes("Gathering")) {
					addItemToList = true;
				}
			}
			if (gatheringArray[gatheringIndex].index.includes("bug")) {
				addItemToList = false;
				if (action.includes("Hunting")) {
					addItemToList = true;
				}
			}
			if (gatheringArray[gatheringIndex].index.includes("fish")) {
				addItemToList = false;
				if (action.includes("Fishing")) {
					addItemToList = true;
				}
			}
			if (addItemToList == true) {
				possibleEvents.push(gatheringArray[gatheringIndex])
			}
		}
	}
	if (possibleEvents.length != 0) {
		console.log(possibleEvents)
		var randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
		soundEffectStart("pickup");
		console.log(randomEvent.index);
		addItem(randomEvent.index);
	}
}

var randomGender = "Meat";
function gatherEvent(index) {
	document.getElementById('output').innerHTML = '';
	wrapper.scrollTop = 0;
	for (characterCounter = 0; characterCounter < coreCharactersArray.length; characterCounter++) {
		if (index.includes(coreCharactersArray[characterCounter].index) == true) {
			var characterTarget = coreCharactersArray[characterCounter];
		}
	}
	switch(index) {
		case "fishingGoddessChoice": {
			writeHTML(`
				t While fishing, a mysterious lady rises from the water.
				eval writeTaste("misc/fishingGoddess1");
				t "Good, kind soul. Did you drop a pair of panties in the water? Perhaps a golden pair? Or maybe a silver pair?" She asks.
				player worried Uh...
				button Gold Panties; gatherEvent('fishingGoddess2')
				button Silver Panties; gatherEvent('fishingGoddess2')
				button Neither; gatherEvent('fishingGoddess3')
			`)
			break;
		}
		case "fishingGoddess2": {
			writeHTML(`
				im misc/`+index+randomGender+`
				t The goddess, angered by your fib, crosses her arms and pouts.
				player worried Oh geez...
				t You decide to leave before she can do anything else, and find somewhere less crowded to fish today.
				t ...
				t With all that behind you, you stop to check your haul for this trip.
				eval gatherItem("Fishing");
			`)
			break;
		}
		case "fishingGoddess3": {
			writeHTML(`
				t The goddess giggles at your response.
				im misc/`+index+randomGender+`
				t "Such a good, honest *boy... But maybe you dropped a chastity cage in the lake instead? Maybe a golden cage? Or..."
				player worried Oh no...
				t You decide to flee before she can do anything else, and when you find another place to fish you notice your haul is particularly bountiful today.
				t ...
				t With all that behind you, you stop to check your haul for this trip.
				eval gatherItem("Fishing");
				eval gatherItem("Fishing");
			`)
			break;
		}
		case "gatheringMushroomChoice": {
			writeHTML(`
				t While foraging, you stumble onto a curious sight.
				eval writeTaste("misc/gatheringMushroom1");
				t Some kind of mushroom creature, a native of the forest, is staring at you. It seems to be about to do some kind of dance, will you stay?
				button Stay; gatherEvent('gatheringMushroom2')
				button Scram!; gatherEvent('gatheringMushroom3')
			`)
			break;
		}
		case "gatheringMushroom2": {
			writeHTML(`
				im misc/`+index+randomGender+`
				t The mushroom performs its 'dance', whatever could it mean?
				t Either way, once it's finished and you leave, you notice the fruit trees have been particularly generous today.
				t ...
				t With all that behind you, you stop to check your haul for this trip.
				eval gatherItem("Gathering");
				eval gatherItem("Gathering");
			`)
			break;
		}
		case "gatheringMushroom3": {
			writeHTML(`
				player shock No thanks!
				t Rather than stick around, you decide to hightail it.
				t ...
				t With all that behind you, you stop to check your haul for this trip.
				eval gatherItem("Gathering");
			`)
			break;
		}
		case "gatheringMerchantChoice": {
			writeHTML(`
				t While foraging, you hear someone come up behind you wearing a dark coat.
				t They mutter something like "Hey bud, wanna buy some... Pocketmanz?" before they pull their coat open.
				eval writeTaste("misc/gatheringMerchant");
				t It's 30 muns for three cards they claim are rare, will you buy it?
				button Buy it; gatherEvent('gatheringMerchant2') ?money 30;
				button No thanks!; gatherEvent('gatheringMerchant3')
			`)
			break;
		}
		case "gatheringMerchant2": {
			writeHTML(`
				t They chuckle as you hand over the muns, before handing you a card.
				eval addItem("pocket-char-3-1");
				eval addItem("pocket-tor-3-1");
				eval addItem("pocket-inc-3-1");
				eval data.player.money -= 30;
				eval soundEffectStart("purchase");
			`);
			break;
		}
		case "gatheringMerchant3": {
			writeHTML(`
				t You decide not to take the risk, and the merchant leaves you alone.
				t Getting back to foraging, you eventually find some neat fruit!
				eval gatherItem("Gathering");
				eval gatherItem("Gathering");
			`)
			break;
		}
		case "huntingFairyChoice": {
			writeHTML(`
				t While foraging, you stumble onto a curious sight.
				eval writeTaste("misc/huntingFairy1");
				t It seems like someone caught a fairy and stuffed it into a jar with a clear and tightly shut top. What will you do?
				button Free it; gatherEvent('huntingFairy2')
				button ( ͡° ͜ʖ ͡°); gatherEvent('huntingFairy3') ?weird;
			`)
			break;
		}
		case "huntingFairy2": {
			writeHTML(`
				im misc/huntingFairy3`+randomGender+`
				t You free the fairy, and it rewards you, following you around and showing you the best places to search for bugs!
				t ...
				t With all that behind you, you stop to check your haul for this trip.
				eval gatherItem("Hunting");
				eval gatherItem("Hunting");
			`)
			break;
		}
		case "huntingFairy3": {
			writeHTML(`
				t Rather than free the fairy, you perform...
				im misc/huntingFairy2`+randomGender+`
				t An unspeakable act.
				t Leaving the creature to its fate, you continue on your way.
				t ...
				t With all that behind you, you stop to check your haul for this trip.
				eval gatherItem("Hunting");
			`)
			break;
		}
		case "huntingHornetChoice": {
			writeHTML(`
				t While foraging, you stumble onto a curious sight.
				im misc/huntingHornet1
				t It's a bug? But it's a very polite one. It seems like she has somewhere to be, but on the other hand...
				button Help her return home; gatherEvent('huntingHornet2')
				button ( ͡° ͜ʖ ͡°); gatherEvent('huntingHornet3') ?weird;
			`)
			break;
		}
		case "huntingHornet2": {
			writeHTML(`
				t You decide to help the hornet return home. She directs you with the occasional "Shaaaa!" until you reach her... Nest? It's like a tiny, rainy city!
				im misc/huntingHornet2-1
				t You're rewarded for your troubles, there's a whole lot of bugs here, and she doesn't seem to mind you taking them.
				t And before you leave, she waves you goodbye.
				im misc/huntingHornet2-2
				t She must feel pretty great about being released! Good luck little bug lady!
				t ...
				t With all that behind you, you stop to check your haul for this trip.
				eval gatherItem("Hunting");
				eval gatherItem("Hunting");
				eval gatherItem("Hunting");
			`)
			break;
		}
		case "huntingHornet3": {
			writeHTML(`
				t You decide to do some unspeakable things with the bug lady.
				t To be fair, she's the perfect size for your dick! What were you supposed to do?
				im misc/huntingHornet3
				t <i>Not</i> use her as a living fleshlight?
				t Once you've had your fun, you decide to let her go. She has to be released eventually, right?
				t ...
				t With all that behind you, you stop to check your haul for this trip.
				eval gatherItem("Hunting");
				eval gatherItem("Hunting");
				eval gatherItem("Hunting");
			`)
			break;
		}
		case "fishingWish": {
			writeHTML(`
				eval writeTaste("misc/`+index+`");
				t You fished up something sentient!
				t You decide to let it go, and in exchange it collects some extra fish for you.
				eval gatherItem("Fishing");
				eval gatherItem("Fishing");
			`)
			break;
		}
		case "gatheringDryad": {
			writeHTML(`
				eval writeTaste("misc/`+index+`");
				t While foraging, a tree spirit stumbles upon you.
				t Noticing you seem hungry, it gives you some extra fruit.
				eval gatherItem("Gathering");
				eval gatherItem("Gathering");
			`)
			break;
		}
		case "huntingMaestro": {
			writeHTML(`
				eval writeTaste("misc/`+index+`");
				t While hunting, you bump into a mysterious maestro visiting the forest.
				t They're a bug collector too, but it seems like they found a bunch of the wrong type of bugs. They decide to share with you!
				eval gatherItem("Hunting");
				eval gatherItem("Hunting");
			`)
			break;
		}
		case "mayorHunting": {
			if (checkFlag("mayor", "meat")) {
				writeHTML(`im mayor/huntingMeat`);
			}
			if (checkFlag("mayor", "veggie")) {
				writeHTML(`im mayor/huntingVeggie`);
			}
			writeHTML(`
				mayor sleep Zzz...
				t You stumbled onto `+characterTarget.index+`F while hunting, the luck of finding a sleeping office lady blesses you!
			`)
			break;
		}
		case "mayorGathering": {
			if (checkFlag("mayor", "meat")) {
				writeHTML(`im mayor/gatheringMeat`);
			}
			if (checkFlag("mayor", "veggie")) {
				writeHTML(`im mayor/gatheringVeggie`);
			}
			writeHTML(`
				mayor Hello~! I was just on my way to visit? Enjoying your time in town so far? If there's anything you need, I can try to help out.
				t You stumbled onto `+characterTarget.index+`F while gathering, and the two of you decided to work together.
			`)
			break;
		}
		case "mayorFishing": {
			if (checkFlag("mayor", "meat")) {
				writeHTML(`im mayor/fishingMeat`);
			}
			if (checkFlag("mayor", "veggie")) {
				writeHTML(`im mayor/fishingVeggie`);
			}
			writeHTML(`
				mayor Okay, this is supposed to be relaxing, so why...?
				mayor excited Mmm... I really feel like ma-
				mayor shock playerF! Oh, I didn't see you there! I was just... fishing! I have proof, here!
				t You stumbled onto `+characterTarget.index+`F while fishing, they decided to share a bit of their haul.
			`)
			break;
		}
		case "carpenterHunting": {
			if (checkFlag("carpenter", "meat")) {
				writeHTML(`im carpenter/huntingMeat`);
			}
			if (checkFlag("carpenter", "veggie")) {
				writeHTML(`im carpenter/huntingVeggie`);
			}
			writeHTML(`
				carpenter Haaaah... Seriously, how did people manage as foragers? I can't find a thing...<br>Hmm? Oh, hey. You're out here too? Want to team up? We'll be done in half the time.
				t You stumbled onto `+characterTarget.index+`F while hunting, and the two of you decided to work together.
			`)
			break;
		}
		case "carpenterGathering": {
			if (checkFlag("carpenter", "meat")) {
				writeHTML(`im carpenter/gatheringMeat`);
			}
			if (checkFlag("carpenter", "veggie")) {
				writeHTML(`im carpenter/gatheringVeggie`);
			}
			writeHTML(`
				carpenter sleep Zzz...
				t You stumbled onto `+characterTarget.index+`F while gathering, the luck of finding a sleeping tanuki blesses you!
			`)
			break;
		}
		case "carpenterFishing": {
			if (checkFlag("carpenter", "meat")) {
				writeHTML(`im carpenter/fishingMeat`);
			}
			if (checkFlag("carpenter", "veggie")) {
				writeHTML(`im carpenter/fishingVeggie`);
			}
			writeHTML(`
				carpenter Ah, it's you.<br>Do you know how to fish? I was thinking of trying it out, but I'm not sure where to start.<br>If you give me a hand, maybe we can catch something nice together?
				t You stumbled onto `+characterTarget.index+`F while fishing, and the two of you decided to work together.
			`)
			break;
		}
		
		case "shopkeepHunting": {
			if (checkFlag("shopkeep", "meat")) {
				writeHTML(`im shopkeep/huntingMeat`);
			}
			if (checkFlag("shopkeep", "veggie")) {
				writeHTML(`im shopkeep/huntingVeggie`);
			}
			writeHTML(`
				shopkeep Aaaand...! Gotcha! Oh hey, it's you! Wanna team up for a bit? I think I saw a rare critter crawl by. If you catch it, I'll buy it at a premium!
				t You stumbled onto `+characterTarget.index+`F while hunting, and the two of you decided to work together.
			`)
			break;
		}
		case "shopkeepGathering": {
			if (checkFlag("shopkeep", "meat")) {
				writeHTML(`im shopkeep/gatheringMeat`);
			}
			if (checkFlag("shopkeep", "veggie")) {
				writeHTML(`im shopkeep/gatheringVeggie`);
			}
			writeHTML(`
				shopkeep Morning~! Hey, you hungry? I've got some snacks on me, want some?<br>I've noticed someone's been around here leaving magazines all over the place. Want to help me find them?
				t You stumbled onto `+characterTarget.index+`F while gathering, and the two of you decided to work together.
			`)
			break;
		}
		case "shopkeepFishing": {
			if (checkFlag("shopkeep", "meat")) {
				writeHTML(`im shopkeep/fishingMeat`);
			}
			if (checkFlag("shopkeep", "veggie")) {
				writeHTML(`im shopkeep/fishingVeggie`);
			}
			writeHTML(`
				shopkeep Hiya! Just taking a break from running the shop. Mind if I join you?
				t You stumbled onto `+characterTarget.index+`F while fishing, and the two of you decided to work together.
			`)
			break;
		}
		case "wolfHunting": {
			writeHTML(`
				im wolf/hunting
				wolf Oh~! My, I decide to spend an afternoon searching for treasures and I find you! What a delightful surprise!
				t You stumbled onto `+characterTarget.index+`F while hunting, and the two of you decided to work together.
			`)
			break;
		}
		case "wolfGathering": {
			writeHTML(`
				im wolf/gathering
				wolf Oh, hello! Enjoying a jaunt through the woods? Mind if I join you?
				t You stumbled onto `+characterTarget.index+`F while gathering, and the two of you decided to explore a little together.
			`)
			break;
		}
		case "wolfFishing": {
			writeHTML(`
				im wolf/fishing
				wolf Oh, darling~! Is that a rod in your hands? It is a lovely day for a spot of fishing, isn't it?
				t You stumbled onto `+characterTarget.index+`F while fishing, and the two of you decided to work together.
			`)
			break;
		}
		case "sadogatoHunting": {
			writeHTML(`
				im sadogato/hunting
				sado angry Haaaaah~? Vermin like you dares to scuttle away from me? I'll have you know I'm a natural hunter, so get back here!
				player Hmm?
				sado Human, quick, don't let that creature escape, it's a rare find!
				t You stumbled onto `+characterTarget.index+`F while hunting, and the two of you decided to work together.
			`)
			break;
		}
		case "sadogatoGathering": {
			writeHTML(`
				im sado/gathering
				sado frown Hmph... Human. What are you doing skulking around here?
				player ... Same as you?
				sado sparkle Really? You're searching for alchemical ingredients too?! What kind? Wait, let me guess. Warlock's Mitts aren't in season, so...
				t You stumbled onto `+characterTarget.index+`F while gathering, and the two of you decided to explore a little together.
			`)
			break;
		}
		case "sadogatoFishing": {
			writeHTML(`
				im sado/fishing
				sado frown Hmph... Human. Here to fish? Unfortunately they're hardly biting today.
				player Maybe I'll have better luck?
				sado frown Luck, hmm? Actually, that's not a bad idea. Hold still, relax. By the time we're done here...
				sado glare You'll have caught plenty of fish, and be in the mood to share...
				t You stumbled onto `+characterTarget.index+`F while fishing, and the two of you decided to work together.
			`)
			break;
		}
		case "milfHunting": {
			writeHTML(`
				im milf/hunting
				milf sleep Ooph... Seriously, why y'all gotta be so busy in there when mama's trying to work?
				player shock milfF? You alright?
				milf sparkle Why, if it ain't my favorite human again~<br>Nah, I'm perfect as a peach. Just thought I'd take out some of the nasties 'round here.<br>Hey, you got a minute? I know where they nest but I could use a hand...
				t You stumbled onto `+characterTarget.index+`F while hunting, and the two of you decided to work together.
			`)
			break;
		}
		case "milfGathering": {
			writeHTML(`
				im milf/gathering
				milf Ooh, my favorite human! What'cha up to today?<br>No, don't tell me, I can see by that look in your eye that you're starvin'!<br>Here, mama's always got a snack on her, eat up!
				t You stumbled onto `+characterTarget.index+`F while gathering, they decided to share a bit of their haul.
			`)
			break;
		}
		case "milfFishing": {
			writeHTML(`
				im milf/fishing
				milf Why, if it ain't my favorite human! What'cha on the lookout for today? I can help!<br>Izzat a fishin' rod? Ooh, I know a great spot!
				t You stumbled onto `+characterTarget.index+`F while fishing, and the two of you decided to work together.
			`)
			break;
		}
		case "nunHunting": {
			writeHTML(`
				im nun/hunting
				nun sparkle You're not getting away this time~<br>My natural instinct's are-
				nun shock playerF! Oh my, for you to see me like this, how embarrassing...
				nun excited Here, get behind me instead, the view is much nicer~<br>You don't mind if we hunt together today, do you?
				t You stumbled onto `+characterTarget.index+`F while hunting, and the two of you decided to work together.
			`)
			break;
		}
		case "nunGathering": {
			writeHTML(`
				im nun/gathering
				nun flirting Oh my, what a coincidence meeting you here...
				player happy Yep! A super huge coincidence, it's not like you'd keep track of when I head out into the woods to forage.
				nun sleep Of course~<br>Ah, Sweet innocence... Even if you weren't a human I'd still want to gobble you up~
				player Did you say something?
				nun happy Only that I've already found a few things. Care for one?
				t You stumbled onto `+characterTarget.index+`F while gathering, they decided to share a bit of their haul.
			`)
			break;
		}
		case "nunFishing": {
			writeHTML(`
				player shock Wah!
				im nun/fishing
				nun happy ... Are you going fishing? I have some fish if you'd like some.
				player amused I was about to, actually!<br>This is a pretty big coincidence, huh? 
				nun excited Ehehe~<br>Of course it is... Here, you can have as many as you like if I can keep looking at that wonderful smile~
				t You stumbled onto `+characterTarget.index+`F while fishing, they decided to share a bit of their haul.
			`)
			break;
		}
		case "fashionistaHunting": {
			writeHTML(`
				im fashionista/hunting
				fash shock Eh? playerF, what are you doing here?
				player Hunting for bugs, you?
				fash worried Eh... I was too, don't think less of me for it.<br>It's not a very cute thing to do...
				player Aw, don't worry, you look adorable!
				fash sparkle Oh, you're too kind! Actually, I'm pretty good at this when I put my mind to it. Want to see?
				t You stumbled onto `+characterTarget.index+`F while hunting, and the two of you decided to work together.
			`)
			break;
		}
		case "fashionistaGathering": {
			writeHTML(`
				im fashionista/gathering
				fash ... Hmm? 
				player worried Uh, have you been following me?
				fash Maybe~<br>With how deep you're wandering, I figured you found some great secret places~<br>And I was right, wasn't I?
				player worried ...
				fash worried Or you got lost. Come on, we're right next to the forest's edge, let's head back together.<br>Oh, here. I was going to eat it, but you look famished.
				t You stumbled onto `+characterTarget.index+`F while gathering, they decided to share a bit of their haul.
			`)
			break;
		}
		case "fashionistaFishing": {
			writeHTML(`
				im fashionista/fishing
				fash ... Hmm? Well well well, lucky meeting you out here~! Catch anything good?
				player Not yet, but I'm hopeful.
				fash You'll share, won't you? I'm sure you'll catch something delicious~<br>In exchange, you'll have a cutie over your shoulder cheering you on~
				t You stumbled onto `+characterTarget.index+`F while fishing, and the two of you decided to work together.
			`)
			break;
		}
		case "mesuHunting": {
			writeHTML(`
				im mesu/hunting
				mesu Ah~
				player Oh, hey mesuF! What are you doing out here?
				mesu sleep Thought I'd try my hand at hunting a few of the rare bugs around here, shopkeepF told me about them, but I'm no good at it...
				player Well, let's see if we can find something together!
				t You stumbled onto `+characterTarget.index+`F while hunting, and the two of you decided to work together.
			`)
			break;
		}
		case "mesuGathering": {
			writeHTML(`
				im mesu/gathering
				mesu Hmm hmm~<br>Oh! playerF, good to see you! Off into the woods?
				player Yep! Gotta make those muns. That's a big haul!
				mesu sparkle Oh, you're too kind, hehe~<br>Here, I'm a bit overburdened, you can have some if you like.
				t You stumbled onto `+characterTarget.index+`F while gathering, they decided to share a bit of their haul.
			`)
			break;
		}
		case "mesuFishing": {
			writeHTML(`
				im mesu/fishing
				mesu Hmm hmm~<br>Oh! playerF! Here to do some fishing?
				player Yep! I'm hoping to catch something big.
				mesu I bet you will. You know, I'm not half bad at fishing myself. Care for some pointers?
				t You stumbled onto `+characterTarget.index+`F while fishing, and the two of you decided to work together.
			`)
			break;
		}
		case "doeHunting": {
			writeHTML(`
				im mommy/hunting
				mommy worried Uuu... Eek! I think I felt something!
				im doe/hunting
				doe happy Oh, playerF! Good morning!<br>Mom agreed to do some bughunting with me! Isn't that great?
				player worried She, uh...
				doe Yeah, she's not very good at it, but she's trying her best! I'm sure she'll get the hang of it soon.
				mommy shock Eeeeek! Help, help!
				doe frown Mooom, you're scaring them away! And there's nothing on you, you're just imagining things!
				t You stumbled onto `+characterTarget.index+`F while hunting, and the two of you decided to work together.
			`)
			break;
		}
		case "doeGathering": {
			writeHTML(`
				doe sparkle Adventure~! Adventure~!
				mommy worried Oof... Slow down, please dear?
				im mommy/gathering
				mommy shock Oh, playerF!
				doe playerF's on an adventure too! Come on, come on, come with us! <br>Hehe, check out all the treasures I've found. Want one?
				t You stumbled onto the mother and daughter pair while gathering, they decided to share a bit of their haul.
			`)
			break;
		}
		case "doeFishing": {
			writeHTML(`
				im doe/fishing
				doe sleep Zzz...
				im mommy/fishing
				mommy happy Hm hm hm~<br>Ara~? playerF, what a lovely day for fishing, isn't it? I'm just out here catching dinner.<br>If you'd like, I'd love to trade some of my catch for some company~
				t You stumbled onto the mother and daughter pair while fishing, they decided to share a bit of their haul.
			`)
			break;
		}
		case "hyenaHunting": {
			writeHTML(`
				im hyena/hunting
				hyena happy Hehe, got you!
				hyena shock Wah! playerF! You scared me!
				player shock I scared you? You're the one who jumped out at me!
				hyena happy Hehe, sorry. Pretty good jump though?<br>Good thing you aren't actually prey, huh?
				t You stumbled onto `+characterTarget.index+`F while hunting, and the two of you decided to work together.
			`)
			break;
		}
		case "hyenaGathering": {
			writeHTML(`
				im hyena/gathering
				hyena happy Heeeey~! I was just thinking about you!
				player happy Positive or negative?
				hyena Little bit of "man, *he's gonna get lost in there" and a little bit of "damn, *he's really cute today." Want a guide? Bodyguard? Both?
				t You stumbled onto `+characterTarget.index+`F while gathering, and the two of you decided to explore a little together.
			`)
			break;
		}
		case "hyenaFishing": {
			writeHTML(`
				im hyena/fishing
				hyena happy Heeeey~! I was just thinking about you!
				player happy Oh hey hyenaF, what are you doing out here?
				hyena Not fishing, that's for sure! I haven't managed to catch a single thing today, but I'm having a great time trying!
				player Well, let's see if we can find something together!
				t You stumbled onto `+characterTarget.index+`F while fishing, and the two of you decided to work together.
			`)
			break;
		}
	}
	if (!index.includes("Choice")) {
		if (characterTarget) {
			writeHTML(`
				t ...
				t With `+characterTarget.index+`F's help, you found some extra stuff today!
			`);
			gatherItem(index.replace(characterTarget.index, ""));
			gatherItem(index.replace(characterTarget.index, ""));
			var possibleEvents = [];
			for (gatheringIndex = 0; gatheringIndex < gatheringArray.length; gatheringIndex++) {
				if (checkRequirements(gatheringArray[gatheringIndex].requirements) && gatheringArray[gatheringIndex].type == "collectable") {
					if (gatheringArray[gatheringIndex].index.includes(characterTarget.index) || gatheringArray[gatheringIndex].index.includes("jiggy")) {
						possibleEvents.push(gatheringArray[gatheringIndex])
					}
				}
			}
			console.log(possibleEvents)
			if (possibleEvents.length != 0) {
				var randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
				console.log(randomEvent.index)
				addItem(randomEvent.index);
				soundEffectStart("pickup");
			}
		}
		writeHTML(`
			trans cancel; Finish
		`)
	}
}