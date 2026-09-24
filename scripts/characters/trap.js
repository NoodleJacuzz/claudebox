var character = {index: "trap", flags: "", fName: "Thorne", lName: "", color: "#7D9267", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"};

//Thorne barely emotes on his own face — his moods walk around beside him as four spirits, each
//registered in spiritArray in index.js with its own color and overlay image. Write them as their
//own lines directly under one of his, and fuseSpiritLines folds the whole exchange into a single
//dialogue box:
//	trap Hello, playerF.
//	lusty I thought I heard clapping!
//	weepy I miss having hands.
//	lusty Not that kind of clapping~
//His own "clothed" folder therefore holds one body image and four overlays, not an expression set,
//so he only ever needs the happy expression for himself.

var logbookArray = [
	"im images/trap/clothed/happy; title Garden's Keeper; A spirit bound to the earth, more specifically bound to a collection of plants. He devoutly follows deityF, and has been preparing for his return for some time now.<br>He mentioned he's been passing the time by turning malicious invaders of the forest into ghosts.",
];

var achievementArray = [
];

var itemsArray = [
];

var shopArray = [
];

var pickupArray = [
];

var morningArray = [
];

//Summoned in deity.js's reward-fash-trap, which raises his trust to 1. He stays at the shrine, a fake
//location, so his tab is printed by checkForFakeLocationEncounters in locations.js.
var encounterArray = [
	{index: `statusQuo`, name: `Talk to trapF`, requirements: "?location forestShrine; ?trustMin trap 1;", altName: "", altImage: "",},
];

var sceneArray = [
	{index: `statusQuo`,
	content: `
		eval trapQuo();
	`,},
	{index: `garden`,//One-time event, offered above the repeatables in trapQuo
	content: `
		eval writeEvent(data.player.currentScene);
		eval addFlag('trap', 'garden');
		eval raiseTrust('trap', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat1First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('trap', data.player.currentScene.replace("First", ""));
		eval raiseTrust('trap', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat1Repeat`,
	content: `
		eval writeEvent(data.player.currentScene.replace("Repeat", ""));
		eval passTime();
		finish
	`,},
	{index: `shrineBack`,//Leaves the menu without leaving the shrine
	content: `
		eval unencounter('trap');
		eval writeScene('system', 'forestShrine');
	`,},
	{index: `placeholder`,
	content: `
		eval writeTest('`+character.index+`')
	`,},
	{index: `cancel`,
	content: `
		eval unencounter(data.player.currentCharacter);
		eval changeLocation(data.player.location);
	`,},
]

function trapQuo() {
	if (checkFlag("trap", "quoFirst") != true) {
		writeHTML(`
			trap You returned.
			weepy *He remembered us...
			bratty Don't get mushy. *He wants something.
			lusty I hope *he wants something~
			angy State your purpose, human.
			trap Ignore them. I am listening.
		`);
		addFlag("trap", "quoFirst");
	}
	else {
		writeHTML(`
			im trap1-1
			trap Hello, playerF.
			lusty I thought I heard clapping!
			weepy I miss having hands.
			lusty Not that kind of clapping~
			trap Does deityF have need of me?
			player happy No, I was just wondering if you wanted to be friends.
			trap ...
			player confused ...?
			trap ...
			weepy Eh? What's going on? Why's it getting hot in here?
			bratty Omigaaaawd! Did our heart just actually skip a beat?!
			angy We don't have a heart, dickweasels! We're a bunch of ghosts in a plant!
			lusty But we do have something eeeeelse~
			player So, are you gonna introduce me to all your spirit friends?
			trap Them? Harmless, I can assure you. At first I kept them as punishment until they had forgotten their old sins-
			angy I would've gotten away with them too, hahh-
			bratty But now we stick around because trapF's lonely, lonely~
			lusty Can we stop talking and masturbate? Pleeeease?
			t The cacophany of voices can get a bit hard to follow, but it's impressive how each voice is so distinct despite coming from trapF's mouth.
			trap If I were to introduce you to anyone, it would be all of the spare bodies I keep.<br>Would you care to see them?
			angy But you can't have the pepper, I already called him!
			player happy ...?
			player scared If I say yes, am I about to see a dead body? Because I have a very delicate heart, I can't really handle stuff like that.
			trap No. No corpses rest in my garden, not for long anyways. Or, I suppose you could argue they haven't been alive at all yet.
			weepy Why are we being so vague? We're confusing the *boy!
			angy Ohhh, *he'll hate us if we make *him think! Clearly *he hates using *his brain!
			bratty It's really cool, promise! Just follow us deeper into the forest!
			player confused Really cool, you say?<br>I like seeing really cool things...
			trap They may be building your expectations too much, but you may come along regardless. Or, if you desire-
			im trap1-2
			trap Ah 'ho 'hhot 'hi-<br>*Ahem*. I do not find you unappealing. Apologies, one of them wanted to show you my tongue.
			lusty It groooooows~
		`);
	}
	writeHTML(`
		trans garden; Visit trapF's garden !flag trap garden;
	`);
	writeQuoRepeats();
	writeHTML(`
		trans shrineBack; Go back
	`);
}

//Image assignment is a guess from the filenames: trap-plant for the garden, trap1 for the repeatable.
//The playersub images fall back to trap1-5/trap1-6 on their own when Player Sub is off (filterImageSuffixes).
var eventArray = [
	{index: "garden", name: "Thorne's Garden", image: "trap/trap-plant0-1",
	content: `
		t trapF leads you by the arm deeper into the woods, the treeline getting thicker and the scene growing darker.
		im trap-garden0-1
		trap Behold, my garden. Once the lives inside of me are fully matured, I leave them to inspirit vessels like these ones.
		player suprised Oh! Cool!
		im trap-garden0-2
		player happy Hi there little buddy! Or, just bud I guess.
		trap With the master's return, I believe I shall take extra care ensuring the growth of the next generation of his servants.<br>These ones shall be properly appreciative of him...
		angy Or I'll punish them myselves!
		weepy Ohhh, don't hurt me! 
		bratty Haha! You morons, we're all in the same body.
		player Do you grow them like ordinary plants?
		trap Indeed. In fact, perhaps a human touch would make the process go more smoothly.<br>If I were to make the garden safe for you, would you be able to volunteer your hands to me?
		bratty He means help with the gardening.
		lusty But honesty I wouldn't mind hands like those volunteering some where else if you guys get-
		angy We obviously get what you mean, idiot! We're in the same brain!
		weepy But we're noooot! We don't have brains anymore, how are we even thinking?
		player happy I should be able to help, sure!
		trap I appreciate it, thank you. As fellow servants to deityF, let us purify this ungrateful world of all it's terrible evils~<br>It should take a few months to make everything approachable for one of your... Hrm.
		angy Fatty! Fat fat fatty!
		weepy Don't call *him that! *He's not fat!
		lusty Mmm, I say we test it! Fuck, just imagine what he'd be like twerking!
		angy I don't know what that means, you said you'd stop using modern words!
		weepy And don't swear with trapF's mouth! I'm gonna punish you!
		player worried ... Okay, not sure if it'll take that long because you'll be squabbling with yourself, or if there's like, booty-eating centipedes living in the soil around here, but feel free to take as long as you need. I'll be back to volunteer when you're ready.
		trap I appreciate that.
		bratty But how'd you find out about the centipedes?
		weepy Ohhh, we were supposed to be keeping them away! Ohh, we're failures!
		player sleep ... I think I'd like to go back now.
		trap I'll lead the way. And don't worry about what they're rambling about.
		bratty They don't even bite around here anyways, they just crawl into-
		angy NO!
		t And so, all while being a living kerfuffle, trapF leads you back to the safety of the forest wilderness.
	`},
	{index: "repeat1", name: "Repeatable - Purification", image: "trap/trap1-2",
	content: `
		trap Hmm? You want to-
		bratty *He wants to see what that tongue do! Gehahahaha~!
		lusty Ooh, ooh, let me, let me, I wanna be the penis!
		player shock Whoaaa!
		im trap1-3
		trap Hmm. The tentacles do not wait for the rest of the conversation. They never do.
		lusty Caught~ You~
		trap You may tap the dirt if you need to stop. I will notice.
		player forced That's- that's actually really- ngh- considerate-!
		im trap1-4
		trap Hah? Ehhh, 'ou 'hoohs.
		angy We're not fools!
		lusty TASTE! TASTE! TASTE!
		bratty Gyaha~! All the fresh ones are watching us!
		angy Retract the teeth! Retract the teeth!
		weepy Oh, I wonder if this will fill our empty hearts...
		trap 'he 'hoo 'hot-<br>Glrk-
		player shock ...!
		im trap1-5
		player torogao Ghhh-! What are- ?playerSub;
		t Traveling up your body, not an egg, some kind of flexing bulge right towards your- ?playerSub;
		trap Glk.
		lusty MMMM~! GIMME SOME OF THAT~! OOOH, THAT'S BOOTY-EATING! ?playerSub;
		im trap1-5playersub ?playerSub;
		t Whatever else the tentacles decide to do, his throat does not pause to take a vote.
		trap ...
		angy Eh? Wait, if you do that-!
		bratty Gyahaha~! Don't care, don't care!
		player orgasm Ghh- I can't- I'm-!
		trap Glllllk~<br>Nnnnope~! Sorry, cutie-pie!
		im trap1-6playersub
		trap I'll get punished for this like a BITCH, but cuties like you are just my type!<br>Mmm, I'd find hot things with an ass like yours, string them up and have them BEGGING for-KHHHH!
		t The tentacle formerly grabbing your length to block your ejaculation releases, and trapF's head suddenly tilts, the bratty expression vanishing.
		player orgasm Hohhhhh~!
		trap Apologies for that. They can misbehave.<br>Hmm, this isn't unpleasant.
		angy Fuck, you stupid bitch! He's cumming all over us and we've gotta be in here punishing you!
		lusty I WAS IN THERE! RIGHT THERE, YOU FUCKING WHORE!
		weepy Ohh, just say your sorryyyy!
		bratty GYAHAHAHA!
		player pent Hoh... Geez...
		im trap1-7
		trap ... Done? Very good. I appreciate you giving me the opportunity to test my control. It would appear I'm still lacking.
		player tired ...
		player curious ... Are they not going to say anything?
		trap They are... Occupied. Did you wish for them to speak again?
		player tired Uh... Sure, I guess. That was kinda fun, right?
		trap ... Hm.
		angy Eh?! Light!
		weepy We're saved! We're free!
		lusty Oh!!!
		trap playerF has chosen to spare you. Show your gratitude.
		im trap1-8
		trap Go ahead.
		weepy Thank you! Thankyouthankyouthankyou! Can we kiss your feet?
		lusty Can I kiss your feet?!
		angy Don't say it like that!
		player amused Hooh. You guys are kinda weird. Behave, alright?
		player befuddled Wait. "Spare"?
		trap It's for the best you don't question it.<br>The rest of you, be sure to punish that one appropriately, or I'll have to discipline you all myself.
		player happy Well, I guess I made a new friend somehow, at least.
	`},
];

//Don't touch anything below this, or things will break.
console.log(character.index+'.js loaded correctly. request type is '+requestType)

switch (requestType) {
	case "load": {
		for (encounterCounter = 0; encounterCounter < encounterArray.length; encounterCounter++) {
			encounterArray[encounterCounter].character = character.index;
			globalEncounterArray.push(encounterArray[encounterCounter]);
		}
		console.log("Encounter list loaded:");
		console.log(globalEncounterArray);

		for (itemCounter = 0; itemCounter < itemsArray.length; itemCounter++) {
			if (itemsArray[itemCounter].name == null) {
				itemsArray[itemCounter].name = itemsArray[itemCounter].index;
			}
			if (itemsArray[itemCounter].category == null) {
				itemsArray[itemCounter].category = "";
			}
			globalItemsArray.push(itemsArray[itemCounter]);
		}
		console.log("Item list loaded:");
		console.log(globalItemsArray);
		
		for (achievementCounter = 0; achievementCounter < achievementArray.length; achievementCounter++) {
			achievementArray[achievementCounter].character = character.index
			globalAchievementArray.push(achievementArray[achievementCounter]);
		}
		console.log("Achievement list loaded:");
		console.log(globalAchievementArray);

		var noodleKey = character.index[0] + character.color[1];

		for (pickupCounter = 0; pickupCounter < pickupArray.length; pickupCounter++) {
			pickupArray[pickupCounter].key = noodleKey+"P-"+truncString(pickupArray[pickupCounter].index)+pickupArray[pickupCounter].index[0]+pickupArray[pickupCounter].index[pickupArray[pickupCounter].index.length-1]+",";
			pickupArray[pickupCounter].character = character.index;
			pickupArray[pickupCounter].collected = false;
			globalPickupArray.push(pickupArray[pickupCounter]);
		}
		console.log("Pickup list loaded:");
		console.log(globalPickupArray);

		for (morningCounter = 0; morningCounter < morningArray.length; morningCounter++) {
			morningArray[morningCounter].key = noodleKey+"M-"+truncString(morningArray[morningCounter].index)+morningArray[morningCounter].index[0]+morningArray[morningCounter].index[morningArray[morningCounter].index.length-1]+",";
			morningArray[morningCounter].character = character.index;
			morningArray[morningCounter].collected = false;
			globalMorningArray.push(morningArray[morningCounter]);
		}
		console.log("Morning list loaded:");
		console.log(globalMorningArray);

		for (shopCounter = 0; shopCounter < shopArray.length; shopCounter++) {
			var itemTarget = itemsArray.find(item => item.index === shopArray[shopCounter].index);
			if (itemTarget) {
				if (shopArray[shopCounter].name == null) {
					shopArray[shopCounter].name = itemTarget.name;
				}
				if (shopArray[shopCounter].price == null) {
					shopArray[shopCounter].price = itemTarget.value*2;
				}
				if (shopArray[shopCounter].image == null) {
					shopArray[shopCounter].image = itemTarget.image;
				}
				if (shopArray[shopCounter].category == null) {
					shopArray[shopCounter].category = itemTarget.category;
				}
				if (shopArray[shopCounter].filter == null) {
					if (itemTarget.filter) {
						shopArray[shopCounter].filter = itemTarget.filter;
					}
					else {
						shopArray[shopCounter].filter = "";
					}
				}
			}
			shopArray[shopCounter].key = noodleKey+"S-"+truncString(shopArray[shopCounter].index)+shopArray[shopCounter].index[0]+shopArray[shopCounter].index[shopArray[shopCounter].index.length-1]+",";
			shopArray[shopCounter].collected = false;

			shopArray[shopCounter].character = character.index;
			globalShopArray.push(shopArray[shopCounter]);
		}
		console.log("Shop list loaded:");
		console.log(globalShopArray);
		
		for (logCounter = 0; logCounter < logbookArray.length; logCounter++) {
			var logbookEntry = {index: character.index, content: logbookArray[logCounter]};
			globalLogbookArray.push(logbookEntry);
		}
		console.log("Logbook loaded:");
		console.log(globalLogbookArray);
		
		var eventList = {index:character.index, events:[],};
		for (eventCounter = 0; eventCounter < eventArray.length; eventCounter++) {
			eventList.events.push(eventArray[eventCounter]);
		}
		globalEventArray.push(eventList);
		console.log("Event list loaded:");
		console.log(globalEventArray);
		
		var sceneList = {index:character.index, scenes:[],};
		for (sceneCounter = 0; sceneCounter < sceneArray.length; sceneCounter++) {
			sceneList.scenes.push(sceneArray[sceneCounter]);
		}
		globalSceneArray.push(sceneList);
		console.log("Scene list loaded:");
		console.log(globalSceneArray);
		
		//writeSpeech(character.index, "", character.fName+ " " + character.lName + ", written by "+ character.author + ".");
		break;
	}
}