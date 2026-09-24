//Core.js - Core system functionality and constants

//Establish global arrays as empty
var globalShopArray = [];
var globalItemsArray = [];
var globalClothesArray = [];
var globalPickupArray = [];
var globalCollectablesArray = [];
var globalEncounterArray = [];
var globalSceneArray = [];
var globalEventArray = [];
var globalLogbookArray = [];
var globalMorningArray = [];
var globalAchievementArray = [];

//Establish system variables
var data = {
	player: {
		collected: "",
		flags: "",
		name: "???",
		skin: "light",
		gender: "masc",
		genitals: "penis",
		emotion: "happy",
		clothes: [],
		color: "#8F72BB",
		currentCharacter: "system",
		currentScene: "start",
		location: "",
		time: "Morning",
		day: 1,
		money: 0,
		dayID: 1,
		style: "syrup",
		soundVolume: 50,
		musicVolume: 70,
		musicBlacklist: [],
		tarotPoster: "",
		pocketPoster: "",
		magazinePoster: "",
		filters: [],
		outfits: [],
		characterBlacklist: "",
		characterWhitelist: "",
	},
	achievements: [],
	story: [],
	gallery: [],
	items: [],
}
const dataBackup = data;
var version = 13;
var debugMode = false;
var debugCharacter = "";
var versionFlesh = 2.5;
var totalCharactersLoaded = 0;
var imagesDisabled = false;
var requestType = "load";
var tabIndex;
var randNum;
var activeWindow = "";
var savedLocations = {morning: "", evening: "",};
var galleryArray = [];
var itemArray = [];
var logbookArray = [];
var gameType = "furry";
var drawModeButton = true;
//Dev preview: let startup() run in full, then boot straight into one screen instead of sitting
//on the title. Also stops title.js queueing its animation timeouts, which would otherwise fire
//into whatever was jumped to. This exists so a screen can be looked at in a browser without
//playing to it, since most of the game is several gamestates deep.
//
//Targets: "" (normal boot), "clacks", "wardrobe", "honeycomb", "honeycombFresh".
//Add a case to devPreviewBoot() below for anything else worth previewing.
//SET THIS TO "" FOR A NORMAL GAME BOOT / RELEASE BUILD.
var devPreviewTarget = "";
//The original Clacks-only toggle, kept working so older notes still apply. Selects "clacks".
var clacksDevMode = false;

//True whenever the game is booting into a preview rather than the title screen
function devPreviewActive() {
	return devPreviewTarget != "" || clacksDevMode == true;
}

//Hands off to whichever screen is being previewed. Called at the very end of startup(), so
//everything the game normally builds on boot has already been built.
function devPreviewBoot() {
	var previewTarget = devPreviewTarget;
	if (previewTarget == "" && clacksDevMode == true) {
		previewTarget = "clacks";
	}
	switch (previewTarget) {
		case "": {
			break;
		}
		case "clacks": {
			writeScene("system", "clacksTest");
			break;
		}
		case "scrapbook": {
			//The scrapbook needs the flag that lets pictures be saved, and something in it to look at
			addFlag("player", "scrapbook");
			openScrapbook();
			break;
		}
		case "spirits": {
			//Thorne's test scene: each spirit alone, then all four stacked, then a host-silent block
			writeTest("trap");
			break;
		}
		case "wardrobe": {
			//printWardrobe builds its own Back button pointing at the player's house, so there is
			//no location state to set up first
			printWardrobe();
			break;
		}
		case "honeycomb": {
			//Honeycomb Catacombs. Builds its own full-viewport layer over the game and hides the
			//host's chrome while it runs, so nothing needs setting up first. Resumes its autosave
			//when one exists.
			honeycombBoot();
			break;
		}
		case "honeycombFresh": {
			//Same, but ignores any existing honeycomb autosave and starts from a new profile.
			//Useful after a save-shape change, which would otherwise load into code expecting it.
			honeycombBoot({ fresh: true });
			break;
		}
		default: {
			console.error("Unknown devPreviewTarget: "+previewTarget);
		}
	}
}
var printShop = true;
var gtransSwitch = false;
var collectablesPage = 0;
var characterstxt = document.createElement("object");
var doeRemoved = true;
var listOfPrintedEncounters = [];
const initialLogbookArray = [];
const initialMorningArray =[];
var morningEventsSelected = [];
var artifactArray = ["pill", "cherry", "watch", "hole", "tv",];
var emotionArray = ["ahegao", "blush", "angry", "excited", "frown", "happy", "hypno", "pleasured", "sad", "shock", "sleep", "smug", "sparkle", "torogao", "worried"];
var wrapperBypass = 0;
var novelLines = [];
var readingNovel = false;
var webuiShortcut = false;
var walkingEncounterCooldown = 1;
if (imageFormat == "png") {
	var imageBackup = "webp";
}
else {
	var imageBackup = "png";
}
var finishedCharactersArray = ["mayor", "carpenter", "shop", "shopkeep", "foxf", "foxm", "wolf", "sado", "sadogato", "mesu", "hyena", "fashionista", "doe", "mommy", "milf", "nun", "player"];
var systemChars = ["mayor", "carpenter", "shopkeep"];
var characterShortcuts = [
	{index: "fash", full: "fashionista"},
	{index: "shop", full: "shopkeep"},
	{index: "carp", full: "carpenter"},
	{index: "sado", full: "sadogato"},
];
var definitionArray = [
	{shortcut: "fash", result: "sp fashionista;"},
	{shortcut: "shop", result: "sp shopkeep;"},
	{shortcut: "sado", result: "sp sadogato;"},
	{shortcut: "carp", result: "sp carpenter;"},
];
var expressionArray = [
	{index: "happy", alts: "smile, smiling", arousal: "0", sfx: "",},
	{index: "amused", alts: "chuckle, heh", arousal: "0", sfx: "",},
	{index: "joy", alts: "", arousal: "0", sfx: "",},
	{index: "sparkle", alts: "star, starry, spark, wowzers", arousal: "0", sfx: "",},
	{index: "laughing", alts: "laugh, laughter, haha", arousal: "0", sfx: "",},
	{index: "sleep", alts: "sleepy, sleeping, relax, relaxed, relaxing", arousal: "0", sfx: "",},
	{index: "teasing", alts: "tease, smug", arousal: "0", sfx: "",},
	{index: "mocking", alts: "mock, grin, evil, sinister", arousal: "0", sfx: "",},
	{index: "confused", alts: "confusion, curious", arousal: "0", sfx: "",},
	{index: "befuddled", alts: "baffled, huh", arousal: "0", sfx: "",},
	
	{index: "worried", alts: "sad, worry, worrying", arousal: "0", sfx: "",},
	{index: "tired", alts: "exhausted", arousal: "0", sfx: "",},
	{index: "panic", alts: "panicing, panicking", arousal: "0", sfx: "",},
	{index: "surprised", alts: "surprise, suprised, suprise", arousal: "0", sfx: "",},
	{index: "shock", alts: "shocked", arousal: "0", sfx: "",},
	{index: "annoyed", alts: "frown, frowning, annoy, grumpy, pout, pouting", arousal: "0", sfx: "",},
	{index: "angry", alts: "anger", arousal: "0", sfx: "",},
	{index: "glare", alts: "hypno", arousal: "0", sfx: "",},
	{index: "fury", alts: "furious, rage", arousal: "0", sfx: "",},
	{index: "scared", alts: "shade, shaded, terror, terrified, afraid", arousal: "0", sfx: "",},
	{index: "crying", alts: "cry, tears, sob, sobbing", arousal: "0", sfx: "",},
	
	{index: "blush", alts: "blushy, blushing", arousal: "1", sfx: "",},
	{index: "flirting", alts: "flirt, flirty, seductive", arousal: "1", sfx: "",},
	{index: "horny", alts: "aroused", arousal: "1", sfx: "",},
	{index: "pent-up", alts: "pent, pentup", arousal: "1", sfx: "",},
	{index: "nightmare", alts: "wetdream, wet-dream", arousal: "1", sfx: "",},
	{index: "awe", alts: "awesome, amazed", arousal: "1", sfx: "",},
	
	{index: "excited", alts: "excite, erect, drool, drooling, dripping", arousal: "2", sfx: "",},
	{index: "love", alts: "heart, worship", arousal: "2", sfx: "",},
	{index: "pleasured", alts: "pleasure", arousal: "2", sfx: "",},
	{index: "perverted", alts: "pervert, lewd", arousal: "2", sfx: "",},
	{index: "forced", alts: "insertion, clenched, clenching", arousal: "2", sfx: "",},
	
	{index: "orgasm", alts: "cumming, o, o-face, oface, cum", arousal: "3", sfx: "",},
	{index: "ahegao", alts: "rolling, ahe", arousal: "3", sfx: "",},
	{index: "torogao", alts: "squirting, toragao, toro", arousal: "3", sfx: "",},
	
	{index: "afterglow", alts: "after, aftermath, aftersex, bedroom", arousal: "4", sfx: "",},
	{index: "broken", alts: "broke, silly, fucked", arousal: "4", sfx: "",},
	{index: "robot", alts: "", arousal: "0", sfx: "",},
]

//Expressions that exist for only part of the cast, so writeTest knows not to ask for an image that
//was never drawn. Everything else in expressionArray is rendered for every character with a model.
var partialExpressions = [
	{index: "glare", characters: ["deity"]},
	{index: "nightmare", characters: ["deity"]},
	{index: "robot", characters: ["player"]},
]

//Some characters emote through spirits drifting beside them instead of through their own face,
//which makes them several voices sharing one dialogue box. Each spirit is written as its own
//shorthand line directly beneath the line it belongs to, and fuseSpiritLines folds those lines
//into the host's line before writeHTML's main loop ever sees them.
//Every image here is drawn on the same canvas as the host's own portrait, so the layers stack in
//registration with no per-spirit offset — keep it that way when adding more.
var spiritArray = [
	{index: "angy", host: "trap", color: "#813A4D", image: "trap/clothed/angy"},
	{index: "lusty", host: "trap", color: "#EEB1C8", image: "trap/clothed/lusty"},
	{index: "weepy", host: "trap", color: "#8E61A0", image: "trap/clothed/weepy"},
	{index: "bratty", host: "trap", color: "#BFD7AA", image: "trap/clothed/bratty"},
]

var globalMailboxArray = [
	{index: "tink1", name: "Tink the Squirrel - Mod by EvilCrucifix", ignore: ["?carnivore;"]},
	{index: "animated", name: "Animated images!", ignore: [],},
	//{index: "v7", name: "v7 Released!", ignore: [],},
	//{index: "v8", name: "v8 Released!", ignore: [],},
	//{index: "v9", name: "v9 Released!", ignore: [],},
	//{index: "v10", name: "v10 Released!", ignore: [],},
	//{index: "v11", name: "v11 Released!", ignore: [],},
	{index: "v12", name: "v12 Released!", ignore: [],},
	{index: "censorship", name: "Mod Support Added", ignore: ["?nutmeg;"],},
	//The last unread letter in this list is the one delivered first
	{index: "v13", name: "v13 Released!", ignore: [],},
]

var eggyLines = [
	"Hehehe... You fool. I have SEVENTY ALTERNATIVE ACCOUNTS!",
	"What the FUCK?! IS that Shadow's dick?!",
	"*Sigh*... I miss my wife, Tails.",
	"What the fuck, shut the fuck up. Shut the FUCK up!",
	"Everybody's fucked my wife!",
	"Who posted my nudes on twitter dot com?!",
	"I've come to make an announcement: Shadow the Hedgehog's a bitch-ass motherfucker, he pissed on my fucking wife. That's right, he took his hedgehog-fuckin' quilly dick out and he pissed on my fucking wife, and he said his dick was 'this big,' and I said 'that's disgusting.'",
	"I'm making a callout post on my Twitter.com: Shadow the Hedgehog, you've got a small dick, It's the size of this walnut except WAY smaller.",
	"Here's what my dong looks like: that's right baby, all points, no quills, no pillows— look at that, it looks like two balls and a bong.",
	"That's right, this is what you get: MY SUPER LASER PISS!!",
	"I'm not gonna piss on the Earth, I'm gonna go higher; I'm pissing ON THE MOON!",
	"How do you like that, Obama? I PISSED ON THE MOON, YOU IDIOT!",
	"Get outta my fucking sight, before I piss on you too!",
	"That's right, you ugly little girl! I HATE YOU, and your stupid nose!",
	"I'm taking everything from you, give me your phone!",
	"I'm taking over Victoria's Secret, I'm taking over Best Buy, the news is mine, and everyone else can leave! You see that planet!? I'M TAKING IT TOO! It looks like a fucking walnut! ",
	"Fuck you, moon, you never had the cheese I wanted!",
	"I hope you're ready to die, it's gonna be like Evangelion, get the fuck out.",
	"Oh no, the instant ramen's been released! We need to go, NOW!",
	"I flushed them down the terlet.",
	"That's right. I want that Aquafina, bitch. (slups) I wanna sip that shit. YES.",
	"Why are you so goddamn pale? Now, get the fuck away from me!",
	"I have you both— all of you trapped here. Now, you can either give you up and we play PUBG together OR... you can stay down here and wrestle in your Fortnite or whatever you kids are playing now.",
	"You'll have Cheeto puffs on your fingahs... And Twitch Prime will be mine!",
	"You though that you could fuckin' escape me, gamer girl. But my IQ is too HIGH!",
	"I'm going to have a birth of cactuses out of my asshole.",
	"Did you see that hot jay-peg footage that was just-",
	"Ooh baby, I'm gonna blow the walls off this place!",
	"It's been seventeen days...",
	"The robots are becoming more sentient, they've started to know my name!",
	"THREE YEARS! I'VE BEEN IN HERE FOR THREE YEARS! HWOOOOAAAAAAAAA!!!",
	"Listen to me, I know who your mother is-",
	"Huh, forgot my password, lemme just... Hmm... 'EGG'...",
	"Well honey you're mascara's off, but we gotta get out of here because the building's gonna fucking explode.",
	"Jet boots?! Oh my god!",
	"WHAT?! YOU ARE NOT-ALLOWED!",
	"Wh-wh-whuh... What in the sam hell is this?!",
	"No fuck you I'm taking it away you thot-ass-bi-OH FUCK! OUGH, MY EMERALDS! AUGH!",
	"I'M BACK IN THIS FUCKING BUILDING AGAIN?! Oh my god...",
	"I'm going to kill you...<br>...<br>...<br>...<br>... And then kill you again.",
	"How do you think I feel being cucked by a hedgehog?!",
	"She had a diamond in her vagina?!",
	"Alright we are going to explore this island and find Sonic. He has all the weed that you need. All the ganja. That Mary Jane. The marry jamitch. All in his pocket.",
	"Now hurry up you... You fucking cuckhogs.",
	"Get outta here you thot-ass-bitch you still owe me a hundred dollars!",
	"Yeah bitch you're gonna walk the plank, gonna yar-har-",
	"AAAAUGH MY BONES!",
	"That's it, I'm calling the police. 911?",
	"Shadow have you found that goddamn blue marble motherfucking son of a bitch?",
	"You have thirteen minutes before this island fucking explodes you hot topic wannabee and you blue gumball son of a bitch. You have done nothing but destroy my life and I hope you both die.",
	"Seriously? Seriously?! OH MY GOD I DIDN'T KNOW!",
	"What the actual shit? WHAT?!",
	"Ugh, oh god, what the fuck happened last night?",
	"Okay I'm gonna log onto my twitter, everybody shut up. Shut up. Shut up. SHUT UP!",
	"Hey bitcheeees.",
	"I've had enough of you, you took my wife, you fucked my crops, I'm taking your life. And the chaos emeralds!",
	"Get the fuck out or I'm shooting Amy in the fucking face, I swear to god I'll do it you bitch, get out!",
	"Put the piss stone down right now, you know what piss rock does to your-",
	"You thought you were gonna escape but I knew you would fart down here so I had to put up a fucking seal.",
	"I'm gonna make sure you watch my vine compilations and I'm gonna make sure you perish you little rodent.",
	"HAVE YOU BEEN TALKING ABOUT MY FUCKING DICK AGAIN?!",
	"Who is this... Wha... Daddy? Daddy is that you?",
	"You wanna see some weird shit?",
	"Aw that piss-loving son of a bitch, I'll miss him.",
	"The caucacity of this bitch...",
	"I am an ALPHA MALE GAMER.",
	"What is ha-WHAT IS GOING ON?!",
	"I am very tall, I am like seven foot one, and I will step on you like eggs.",
	"Good morning eggheads and crackheads.",
	"You see this? This is the brand new diamond I am going to give to my brand new husband.",
	"Kinda reminds me of a piece of ham.",
	"Oh yes... My Martha Stewart pod...",
	"What have you done?! You've activated every single robot in existence!",
	"You've ruined a lot of things Sonic, you've always been a bitch, always.", 
	"And now finally you all can die! Finally, this is the chaos I wanted to see!",
	"You son of a bitch. I'm gonna log into your twitter and tell everyone what you said.",
];

var globalOutfitsArray = [
	{index: "mayor", outfit: "clothed", requirements: "",},
	{index: "mayor", outfit: "alt", requirements: "",},
	{index: "mayor", outfit: "crimbus", requirements: "",},
	{index: "mayor", outfit: "costume", requirements: "",},
	{index: "mayor", outfit: "summer", requirements: "",},
	{index: "mayor", outfit: "valentine", requirements: "",},
	{index: "mayor", outfit: "groovy", requirements: "?flag mayor groovy;",},
	{index: "mayor", outfit: "nude", requirements: "",},
	{index: "mayor", outfit: "pregnant", requirements: "?flag mayor veggie;",},
	{index: "carpenter", outfit: "clothed", requirements: "",},
	{index: "carpenter", outfit: "alt", requirements: "",},
	{index: "carpenter", outfit: "crimbus", requirements: "",},
	{index: "carpenter", outfit: "costume", requirements: "",},
	{index: "carpenter", outfit: "summer", requirements: "",},
	{index: "carpenter", outfit: "valentine", requirements: "",},
	{index: "carpenter", outfit: "nude", requirements: "",},
	{index: "carpenter", outfit: "pregnant", requirements: "?flag carpenter veggie;",},
	{index: "shopkeep", outfit: "clothed", requirements: "",},
	{index: "shopkeep", outfit: "alt", requirements: "",},
	{index: "shopkeep", outfit: "magical", requirements: "?item shopkeepMagical;",},
	{index: "shopkeep", outfit: "crimbus", requirements: "",},
	{index: "shopkeep", outfit: "costume", requirements: "",},
	{index: "shopkeep", outfit: "summer", requirements: "",},
	{index: "shopkeep", outfit: "valentine", requirements: "",},
	{index: "shopkeep", outfit: "nude", requirements: "",},
	{index: "shopkeep", outfit: "pregnant", requirements: "?flag shopkeep veggie;",},
	{index: "foxf", outfit: "clothed", requirements: "",},
	{index: "foxf", outfit: "alt", requirements: "",},
	{index: "foxf", outfit: "crimbus", requirements: "",},
	{index: "foxf", outfit: "costume", requirements: "",},
	{index: "foxf", outfit: "summer", requirements: "",},
	{index: "foxf", outfit: "valentine", requirements: "",},
	{index: "foxf", outfit: "nude", requirements: "",},
	{index: "foxf", outfit: "pregnant", requirements: "",},
	{index: "foxm", outfit: "clothed", requirements: "",},
	{index: "foxm", outfit: "alt", requirements: "",},
	{index: "foxm", outfit: "crimbus", requirements: "",},
	{index: "foxm", outfit: "costume", requirements: "",},
	{index: "foxm", outfit: "summer", requirements: "",},
	{index: "foxm", outfit: "valentine", requirements: "",},
	{index: "foxm", outfit: "nude", requirements: "",},
	{index: "wolf", outfit: "clothed", requirements: "",},
	{index: "wolf", outfit: "alt", requirements: "",},
	{index: "wolf", outfit: "crimbus", requirements: "",},
	{index: "wolf", outfit: "costume", requirements: "",},
	{index: "wolf", outfit: "summer", requirements: "",},
	{index: "wolf", outfit: "valentine", requirements: "",},
	{index: "wolf", outfit: "nude", requirements: "",},
	{index: "wolf", outfit: "pregnant", requirements: "",},
	{index: "sadogato", outfit: "nude", requirements: "",},
	{index: "sadogato", outfit: "clothed", requirements: "",},
	{index: "sadogato", outfit: "magical", requirements: "?collectables tarot; 999;",},
	{index: "sadogato", outfit: "crimbus", requirements: "",},
	{index: "sadogato", outfit: "costume", requirements: "",},
	{index: "sadogato", outfit: "summer", requirements: "",},
	{index: "sadogato", outfit: "valentine", requirements: "",},
	{index: "sadogato", outfit: "pregnant", requirements: "",},
	{index: "milf", outfit: "clothed", requirements: "",},
	{index: "milf", outfit: "nude", requirements: "",},
	{index: "milf", outfit: "crimbus", requirements: "?flag milf pregnant;",},
	{index: "milf", outfit: "costume", requirements: "?flag milf pregnant;",},
	{index: "milf", outfit: "summer", requirements: "?flag milf pregnant;",},
	{index: "milf", outfit: "valentine", requirements: "?flag milf pregnant;",},
	{index: "nun", outfit: "clothed", requirements: "",},
	{index: "nun", outfit: "alt", requirements: "?item nunMagical;",},
	{index: "nun", outfit: "crimbus", requirements: "",},
	{index: "nun", outfit: "costume", requirements: "",},
	{index: "nun", outfit: "summer", requirements: "",},
	{index: "nun", outfit: "valentine", requirements: "",},
	{index: "nun", outfit: "nude", requirements: "",},
	{index: "nun", outfit: "pregnant", requirements: "",},
	{index: "mommy", outfit: "clothed", requirements: "",},
	{index: "mommy", outfit: "magical", requirements: "?item mommyMagical;",},
	{index: "mommy", outfit: "crimbus", requirements: "",},
	{index: "mommy", outfit: "costume", requirements: "",},
	{index: "mommy", outfit: "summer", requirements: "",},
	{index: "mommy", outfit: "valentine", requirements: "",},
	{index: "mommy", outfit: "nude", requirements: "",},
	{index: "mommy", outfit: "pregnant", requirements: "",},
	{index: "fashionista", outfit: "clothed", requirements: "",},
	{index: "fashionista", outfit: "magical", requirements: "?trustMin fash 7;",},
	{index: "fashionista", outfit: "crimbus", requirements: "",},
	{index: "fashionista", outfit: "costume", requirements: "",},
	{index: "fashionista", outfit: "summer", requirements: "",},
	{index: "fashionista", outfit: "valentine", requirements: "",},
	{index: "fashionista", outfit: "nude", requirements: "",},
	{index: "mesu", outfit: "clothed", requirements: "",},
	//{index: "mesu", outfit: "alt", requirements: "",},
	{index: "mesu", outfit: "maid", requirements: "",},
	{index: "mesu", outfit: "crimbus", requirements: "",},
	{index: "mesu", outfit: "costume", requirements: "",},
	{index: "mesu", outfit: "summer", requirements: "",},
	{index: "mesu", outfit: "valentine", requirements: "",},
	{index: "mesu", outfit: "nude", requirements: "",},
	{index: "doe", outfit: "clothed", requirements: "",},
	{index: "doe", outfit: "magical", requirements: "?item doeMagical;",},
	{index: "doe", outfit: "crimbus", requirements: "",},
	{index: "doe", outfit: "costume", requirements: "",},
	{index: "doe", outfit: "summer", requirements: "",},
	{index: "doe", outfit: "valentine", requirements: "",},
	{index: "doe", outfit: "nude", requirements: "",},
	{index: "hyena", outfit: "clothed", requirements: "",},
	{index: "hyena", outfit: "pocket", requirements: "?collectables pocketmanz; 999;",},
	{index: "hyena", outfit: "crimbus", requirements: "",},
	{index: "hyena", outfit: "costume", requirements: "",},
	{index: "hyena", outfit: "summer", requirements: "",},
	{index: "hyena", outfit: "valentine", requirements: "",},
	{index: "hyena", outfit: "nude", requirements: "",},
];

//Cleanup functions to condense certain flags, items, and other things
var superFlagArray = [
	{character: "player", super: "chRefs",
	flags: "haa, anomaly, rainy, princess, university, medicenter, argent, "},
	{character: "player", super: "superJiggies1",
	flags: "jiggy-100c, jiggy-125c, jiggy-150c, jiggy-175c, jiggy-200c, jiggy-275c, jiggy-100v, jiggy-125v, jiggy-150v, jiggy-175v, jiggy-200v, jiggy-225o-1, pocketmanz/fenn-2-0, tarot/20n, "},
	{character: "player", super: "superSub1V",
	flags: "subv1-1v, subv1-2v, subv1-3v, subv1-4v, subv1-5v, subv1-6v, "},
	{character: "player", super: "superSub2V",
	flags: "sub2Veggie-1, sub2Veggie-2, sub2Veggie-3, sub2Veggie-4, sub2Veggie-5, sub2Veggie-6, sub2Veggie-7, sub2Veggie-8, sub2Veggie-9, sub2Veggie-10, sub2Veggie-11, sub2Veggie-12, sub2Veggie-13, sub2Veggie-14, sub2Veggie-15, sub2Veggie-16, sub2Veggie-17, sub2Veggie-18, sub2Veggie-19, peachyVeggie, "},
	{character: "player", super: "superSub3V",
	flags: "sub3Veggie-1, sub3Veggie-2, sub3Veggie-3, sub3Veggie-4, sub3Veggie-5, sub3Veggie-6, sub3Veggie-7, sub3Veggie-8, sub3Veggie-9, sub3Veggie-10, sub3Veggie-11, sub3Veggie-12, sub3Veggie-13, sub3Veggie-14, sub3Veggie-15, sub3Veggie-16, sub3Veggie-17, sub3Veggie-18, sub3Veggie-19, sub3Veggie-20, sub3Veggie-21, sub3Veggie-22, "},
	{character: "player", super: "superSub4V",
	flags: "sub4Veggie-1, sub4Veggie-2, sub4Veggie-3, sub4Veggie-4, sub4Veggie-5, sub4Veggie-6, sub4Veggie-7, sub4Veggie-8, sub4Veggie-9, sub4Veggie-10, sub4Veggie-11, sub4Veggie-12, sub4Veggie-13, sub4Veggie-14, sub4Veggie-15, sub4Veggie-16, sub4Veggie-17, sub4Veggie-18, sub4Veggie-19, "},
	{character: "player", super: "superSub1M",
	flags: "subc1-1c, subc1-2c, subc1-3c, subc1-4c, subc1-5c, subc1-6c, "},
	{character: "player", super: "superSub2M",
	flags: "sub2Meat-1, sub2Meat-2, sub2Meat-3, sub2Meat-4, sub2Meat-5, sub2Meat-6, sub2Meat-7, sub2Meat-8, sub2Meat-9, sub2Meat-10, sub2Meat-11, sub2Meat-12, sub2Meat-13, sub2Meat-14, sub2Meat-15, sub2Meat-16, sub2Meat-17, sub2Meat-18, sub2Meat-19, "},
	{character: "player", super: "superSub3M",
	flags: "sub3Meat-1, sub3Meat-2, sub3Meat-3, sub3Meat-4, sub3Meat-5, sub3Meat-6, sub3Meat-7, sub3Meat-8, sub3Meat-9, sub3Meat-10, sub3Meat-11, sub3Meat-12, sub3Meat-13, sub3Meat-14, sub3Meat-15, sub3Meat-16, sub3Meat-17, sub3Meat-18, sub3Meat-19, sub3Meat-20, sub3Meat-21, sub3Meat-22, "},
	{character: "player", super: "superSub4M",
	flags: "sub4Meat-1, sub4Meat-2, sub4Meat-3, sub4Meat-4, sub4Meat-5, sub4Meat-6, sub4Meat-7, sub4Meat-8, sub4Meat-9, sub4Meat-10, sub4Meat-11, sub4Meat-12, sub4Meat-13, sub4Meat-14, sub4Meat-15, sub4Meat-16, sub4Meat-17, sub4Meat-18, sub4Meat-19, sub4Meat-20, "},
];


//Expands the player's flag string into a Set of every flag they effectively have,
//following superflags recursively so supers made of other supers still count.
//Player flags only; supers are not supported for other characters.
function expandedPlayerFlags() {
	if (!data.player.flags) {
		data.player.flags = "";
	}
	var expanded = new Set(data.player.flags.split(",").map(s => s.trim()).filter(Boolean));
	var changed = true;
	while (changed) {
		changed = false;
		for (let superFlagIndex = 0; superFlagIndex < superFlagArray.length; superFlagIndex++) {
			if (expanded.has(superFlagArray[superFlagIndex].super)) {
				var miniFlagList = superFlagArray[superFlagIndex].flags.split(",");
				for (let miniFlagIndex = 0; miniFlagIndex < miniFlagList.length; miniFlagIndex++) {
					var miniFlag = miniFlagList[miniFlagIndex].trim();
					if (miniFlag != "" && expanded.has(miniFlag) == false) {
						expanded.add(miniFlag);
						changed = true;
					}
				}
			}
		}
	}
	return expanded;
}

//Same expansion as a comma-joined string, for callers that do loose substring checks
function expandedPlayerFlagString() {
	var expandedList = Array.from(expandedPlayerFlags());
	if (expandedList.length == 0) {
		return "";
	}
	return expandedList.join(",") + ",";
}

function superFlagCondenstation() {
	//Canonicalize the save string: trimmed flags, no empty entries, single trailing comma
	var flagTokens = (data.player.flags || "").split(",").map(s => s.trim()).filter(Boolean);
	data.player.flags = flagTokens.length ? flagTokens.join(",") + "," : "";
	//Multi-pass so supers made of other supers condense in one call, whatever their array order
	var anyCondensed = true;
	while (anyCondensed) {
		anyCondensed = false;
		for (let superFlagIndex = 0; superFlagIndex < superFlagArray.length; superFlagIndex++) {
			if (checkFlag(superFlagArray[superFlagIndex].character, superFlagArray[superFlagIndex].super) != true) {
				var miniFlagList = superFlagArray[superFlagIndex].flags.split(",").map(s => s.trim()).filter(Boolean);
				var superFlagCheck = miniFlagList.length > 0;
				for (let miniFlagIndex = 0; miniFlagIndex < miniFlagList.length; miniFlagIndex++) {
					if (checkFlag(superFlagArray[superFlagIndex].character, miniFlagList[miniFlagIndex]) != true) {
						//console.info("Miniflag "+miniFlagList[miniFlagIndex]+" not met.");
						superFlagCheck = false;
					}
				}
				if (superFlagCheck == true) {
					for (let miniFlagIndex = 0; miniFlagIndex < miniFlagList.length; miniFlagIndex++) {
						removeFlag(superFlagArray[superFlagIndex].character, miniFlagList[miniFlagIndex]);
					}
					addFlag(superFlagArray[superFlagIndex].character, superFlagArray[superFlagIndex].super);
					anyCondensed = true;
				}
				else {
					//console.info("Superflag "+superFlagArray[superFlagIndex].super+" not added.");
				}
			}
		}
	}
}

var superItemsArray = [
	{super: "tarotBase",
	items: "tarot0, tarot1Meat, tarot2, tarot3Meat, tarot4Meat, tarot5, tarot6, tarot7Meat, tarot8Meat, tarot9, tarot10, tarot11, tarot12, tarot13, tarot14, tarot15Meat, tarot16, tarot17Meat, tarot18Meat, tarot19Meat, "},
	{super: "pocketBase",
	items: "pocket-eev-0, pocket-eev-f-0, pocket-eev-j-0, pocket-eev-v-0, pocket-eev-e-0, pocket-eev-u-0, pocket-eev-g-0, pocket-eev-l-0, pocket-eev-s-0, pocket-pony-1-0, pocket-bui-1-0, pocket-bui-1-0Veggie, pocket-bun-2-0Veggie, pocket-rio-1-0, pocket-rio-2-0, pocket-zor-1-0, pocket-zor-2-0, pocket-fenn-1-0, pocket-fenn-2-0, pocket-fenn-3-0, pocket-sprig-1-0, pocket-sprig-2-0, pocket-sprig-3-0, "},
	{super: "magazinesBase",
	items: "mayorMagazineVeggie, mayorMagazineMeat, carpenterMagazineMeat, carpenterMagazineVeggie, shopkeepMagazineMeat, shopkeepMagazineVeggie, wolfMagazine, sadogatoMagazine, milfMagazine, nunMagazine, mommyMagazine, fashMagazine, mesuMagazine, doeMagazine, hyenaMagazine, "},
	{super: "pogsBase",
	items: "mayorPog, carpenterPog, shopkeepPog, foxfPog, foxmPog, wolfPog, sadogatoPog, milfPog, nunPog, mommyPog, mesuPog, fashionistaPog, hyenaPog, doePog, "},
	{super: "jiggyBase",
	items: "jiggy-100c, jiggy-125c, jiggy-150c, jiggy-175c, jiggy-275c, jiggy-100v, jiggy-150v, jiggy-175v, jiggy-200v, jiggy-225o-1, "},
	{super: "sub1Veggie",
	items: "subv1-1v, subv1-2v, subv1-3v, subv1-4v, subv1-5v, subv1-6v, "},
	{super: "sub2Veggie",
	items: "sub2Veggie-1, sub2Veggie-2, sub2Veggie-3, sub2Veggie-4, sub2Veggie-5, sub2Veggie-6, sub2Veggie-7, sub2Veggie-8, sub2Veggie-9, sub2Veggie-10, sub2Veggie-11, sub2Veggie-12, sub2Veggie-13, sub2Veggie-14, sub2Veggie-15, sub2Veggie-16, sub2Veggie-17, sub2Veggie-18, sub2Veggie-19, "},
	{super: "sub3Veggie",
	items: "sub3Veggie-1, sub3Veggie-2, sub3Veggie-3, sub3Veggie-4, sub3Veggie-5, sub3Veggie-6, sub3Veggie-7, sub3Veggie-8, sub3Veggie-9, sub3Veggie-10, sub3Veggie-11, sub3Veggie-12, sub3Veggie-13, sub3Veggie-14, sub3Veggie-15, sub3Veggie-16, sub3Veggie-17, sub3Veggie-18, sub3Veggie-19, sub3Veggie-20, sub3Veggie-21, sub3Veggie-22, "},
	{super: "sub4Veggie",
	items: "sub4Veggie-1, sub4Veggie-2, sub4Veggie-3, sub4Veggie-4, sub4Veggie-5, sub4Veggie-6, sub4Veggie-7, sub4Veggie-8, sub4Veggie-9, sub4Veggie-10, sub4Veggie-11, sub4Veggie-12, sub4Veggie-13, sub4Veggie-14, sub4Veggie-15, sub4Veggie-16, sub4Veggie-17, sub4Veggie-18, sub4Veggie-19, "},
	{super: "sub1Meat",
	items: "subc1-1c, subc1-2c, subc1-3c, subc1-4c, subc1-5c, subc1-6c, "},
	{super: "sub2Meat",
	items: "sub2Meat-1, sub2Meat-2, sub2Meat-3, sub2Meat-4, sub2Meat-5, sub2Meat-6, sub2Meat-7, sub2Meat-8, sub2Meat-9, sub2Meat-10, sub2Meat-11, sub2Meat-12, sub2Meat-13, sub2Meat-14, sub2Meat-15, sub2Meat-16, sub2Meat-17, sub2Meat-18, sub2Meat-19, "},
	{super: "sub3Meat",
	items: "sub3Meat-1, sub3Meat-2, sub3Meat-3, sub3Meat-4, sub3Meat-5, sub3Meat-6, sub3Meat-7, sub3Meat-8, sub3Meat-9, sub3Meat-10, sub3Meat-11, sub3Meat-12, sub3Meat-13, sub3Meat-14, sub3Meat-15, sub3Meat-16, sub3Meat-17, sub3Meat-18, "},
	{super: "sub4Meat",
	items: "sub4Meat-1, sub4Meat-2, sub4Meat-3, sub4Meat-4, sub4Meat-5, sub4Meat-6, sub4Meat-7, sub4Meat-8, sub4Meat-9, sub4Meat-10, sub4Meat-11, sub4Meat-12, sub4Meat-13, sub4Meat-14, sub4Meat-15, sub4Meat-16, sub4Meat-17, sub4Meat-18, sub4Meat-19, sub4Meat-20, "},
	{super: "roobSet",
	items: "Gradient Hair, Rose Uniform, Pantyhose, Cloak, "},
	{super: "heiressSet",
	items: "Heiress Ponytail, White Jacket, Pure Dress, High Heels, "},
	{super: "shinobiSet",
	items: "Colored Inner Hair, Shinobi Garb, Shiny Pants, Belted Boots, "},
	{super: "rowdySet",
	items: "Goldie Locks, Tube Jacket, Bootyshorts, Cowboy Boots, Gauntlets, "},
	
];

//Cleanup pass over both super arrays: trims every entry and guarantees the trailing comma,
//and automatically adds a key item entry for any superitem that doesn't already have one.
//Called from initializeArrays because initialItemsArray lives in inventory.js, which loads after this file.
function validateSuperArrays() {
	for (let superFlagIndex = 0; superFlagIndex < superFlagArray.length; superFlagIndex++) {
		var flagTokens = superFlagArray[superFlagIndex].flags.split(",").map(s => s.trim()).filter(Boolean);
		superFlagArray[superFlagIndex].flags = flagTokens.join(", ") + ", ";
	}
	for (let superItemsIndex = 0; superItemsIndex < superItemsArray.length; superItemsIndex++) {
		var itemTokens = superItemsArray[superItemsIndex].items.split(",").map(s => s.trim()).filter(Boolean);
		superItemsArray[superItemsIndex].items = itemTokens.join(", ") + ", ";

		//Manual entries in initialItemsArray (with real names/images) always take priority
		var checkedItem = initialItemsArray.find(entry => entry.index == superItemsArray[superItemsIndex].super);
		if (checkedItem == undefined) {
			var newItem = {
				index: superItemsArray[superItemsIndex].super,
				name: superItemsArray[superItemsIndex].super,
				category: "key",
				value: 0,
				image: "none",
			}
			initialItemsArray.push(newItem);
		}
	}
}

//Expands the inventory into a Set of every item the player effectively owns,
//following superitems recursively so supers made of other supers still count.
function expandedOwnedItems() {
	var owned = new Set();
	for (let itemIndex = 0; itemIndex < data.items.length; itemIndex++) {
		//Entries are [name, quantity] pairs, or bare strings before inventoryCleanup runs
		if (Array.isArray(data.items[itemIndex])) {
			owned.add(data.items[itemIndex][0]);
		}
		else {
			owned.add(data.items[itemIndex]);
		}
	}
	var changed = true;
	while (changed) {
		changed = false;
		for (let superItemsIndex = 0; superItemsIndex < superItemsArray.length; superItemsIndex++) {
			if (owned.has(superItemsArray[superItemsIndex].super)) {
				var miniItemsList = superItemsArray[superItemsIndex].items.split(",");
				for (let miniItemsIndex = 0; miniItemsIndex < miniItemsList.length; miniItemsIndex++) {
					var miniItem = miniItemsList[miniItemsIndex].trim();
					if (miniItem != "" && owned.has(miniItem) == false) {
						owned.add(miniItem);
						changed = true;
					}
				}
			}
		}
	}
	return owned;
}

function superItemsCondensation() {
	//Multi-pass so supers made of other supers condense in one call, whatever their array order
	var anyCondensed = true;
	while (anyCondensed) {
		anyCondensed = false;
		for (let superItemsIndex = 0; superItemsIndex < superItemsArray.length; superItemsIndex++) {
			if (checkItem(superItemsArray[superItemsIndex].super) != true) {
				var miniItemsList = superItemsArray[superItemsIndex].items.split(",").map(s => s.trim()).filter(Boolean);
				var superItemsCheck = miniItemsList.length > 0;
				for (let miniItemsIndex = 0; miniItemsIndex < miniItemsList.length; miniItemsIndex++) {
					if (checkItem(miniItemsList[miniItemsIndex]) != true) {
						//console.info("Miniitem "+miniItemsList[miniItemsIndex]+" not met.");
						superItemsCheck = false;
					}
				}
				if (superItemsCheck == true) {
					for (let miniItemsIndex = 0; miniItemsIndex < miniItemsList.length; miniItemsIndex++) {
						removeItem(miniItemsList[miniItemsIndex]);
					}
					//Hidden add: skips the "obtained!" fanfare, which changeLocation wipes anyway
					addItem(superItemsArray[superItemsIndex].super, true);
					anyCondensed = true;
				}
				else {
					//console.info("Superitem "+superItemsArray[superItemsIndex].super+" not added.");
				}
			}
		}
	}
}

function startup() {
	//Ask the browser to keep our storage durable (mods + saves); defined in modding.js.
	requestPersistentStorage();
	//Create empty save in case of restart
	saveSlot(11);
	//Ensure that viewpoint is at the top of the page
	wrapper.scrollTop = 0;
	var bg = cleanupImage("system/ui/titleEmpty")
	document.getElementById('wrapperBG').style.backgroundImage = "url("+bg+")";
	
	updateMenu();
	initializeArrays();
	//Check for autosave, otherwise go to start of the game
	if(localStorage.getItem('dataSyrup10') != null && localStorage.getItem('dataSyrup10') != "null") {
		loadSlot(10);
	}
	else{
		document.getElementById('output').innerHTML = '';
		writeScene("system", "start");
		loadCoreCharacters();
	}
	if (data.player.filters == null || data.player.filters == undefined) {
		data.player.filters = [];
		data.player.characterBlacklist = "";
		data.player.characterWhitelist = "";
	}
	currentSound = "";
	//Load installed mods the fast way: cached script text + image keys, no zip reopen.
	//(bootInstalledMods falls back to a one-time rebuild from saved zips if the cache
	// is empty — e.g. the first boot after this fix, or data from the old loader.)
	//The .catch matters: without it, a rejection here (e.g. IndexedDB refusing to open)
	//dies silently as an unhandled promise rejection and mods just never appear.
	bootInstalledMods().catch(e => console.error("⚠️ Mod boot failed — installed mods were not loaded this session:", e))
		.then(() => { if (typeof warnAboutMissingMods === "function") warnAboutMissingMods(); });
	//Establish writeHTML shortcuts for cast of characters
	basicDefinitions();
	loadLibraries();
	//Check for video files:
	var vidref=document.createElement('script');
	vidref.setAttribute("src", "images-mp4/animated-images.js");
	
	//Append new script file
	document.getElementsByTagName("head")[0].appendChild(vidref);

    if (drawModeButton == true) {
        if (drawModeButton == true) {
            fetch("z_key.png", { method: 'HEAD' })
            .then(res => {
                const isUnlocked = res.ok;

                // Now generate the button
                webuiShortcut = true;
            })
        }
    }

    document.getElementById("wrapper").appendChild(hiddenImageInput);
	//fasterModTest()
	data.player.currentCharacter = "system";
	//Everything startup() needs has now run, so hand off to the previewed screen the normal way.
	//title.js has already skipped its timeout chain, so nothing is left queued to fire into it.
	devPreviewBoot();
}

function modeToggle() {
	document.getElementById('footer').style.display = "none";
	soundEffectStart("talk");
	wrapper.scrollTop = 0;
	document.getElementById('output').innerHTML = '';
	writeHTML(`
		t As of Syrup Town version 3, the non-furry version has been disabled!
		define noodlejacuzzi = sp Noodle Jacuzzi; im system/avatars/noodle.webp; 
		noodlejacuzzi The whole purpose of the mode was to offer something to fans of my games like Hentai University and Anomaly Vault, to give me some peace of mind that I'm offering something fans of those games can enjoy while I focus on Syrup Town for a while.<br>I've gotten a lot of feedback that the current non-furry version just isn't working in that regard.<br>It'd be a huge worry off my mind if I could still offer fun game to Hentai University fans without needing to keep adding to the older engine, and Hentai University 2 would be a pretty massive undertaking.
		t Thus, I plan on completely re-doing the non-furry version, with taller, non-shortstack characters:
		im misc/neoFleshy
		noodlejacuzzi This will be a very large undertaking. Every one of the game's CGs, expression sets, etc.<br>I appreciate your patience as I work on it.<br>The expression sets are taking longer than expected. Before I can release the fleshy version, I'm finishing all the models for the furry mode's core cast. It should be a few more releases, so a few more months, but exactly when that version will release isn't set yet.
		t Version 2.5, the last version including the old non-furry mode style can be found here:
		special https://subscribestar.adult/posts/1517673
	`)
	/*
	if (gameType == "fleshy") {
		writeHTML(`
			t You're about to toggle back to furry mode! This will change the appearance of all characters in the game. Are you sure you want to do this?
			im system/fleshy-furry	
		`)
	}
	else {
		writeHTML(`
			t You're about to toggle off of furry mode! This will change the appearance of all characters in the game, however this change is purely cosmetic.
			special Only images are changed!
			t The non-furry modes can sometimes be behind the main version of the game in updates. Some content or images may be broken. 
		`)
		if (version != versionFlesh) { 
			writeSpecial("The current version of the non-furry mode is "+versionFlesh+" while the main version is "+version+". This means that some content may be missing or broken in the non-furry mode.")
		}
		writeHTML(`
			t Are you sure you want to do this?
			im system/furry-fleshy	
		`)
	}
	writeHTML("button Change to Non-Furry Mode!; modeSwitch()")
	writeHTML("...")
	*/
	writeHTML("button Go back; writeScene('system', 'start') color red;")
}

function modeSwitch() {
	if (gameType == "fleshy") {
		gameType = "furry";
	}
	else {
		gameType = "fleshy";
	}
	writeScene("system", "start");
}

//Cleans every entry's image, always starting from the logical path kept in imageRaw. The entries
//are the initial arrays' own objects, and cleanupImage resolves SEX, skintone and filter suffixes
//against the save loaded at that moment. Storing only the result meant the boot pass, which runs
//before any save exists, froze every SEX image as Veggie for every later load.
function cleanArrayImages(entryList) {
	for (let i = 0; i < entryList.length; i++) {
		if (entryList[i].imageRaw === undefined) {
			entryList[i].imageRaw = entryList[i].image;
		}
		entryList[i].image = cleanupImage(entryList[i].imageRaw);
	}
}

function initializeArrays() {
	//Normalize the super arrays and register their key items before initialItemsArray is copied below
	validateSuperArrays();
	globalShopArray = [];
	globalItemsArray = [];
	globalClothesArray = [];
	globalPickupArray = [];
	globalCollectablesArray = [];
	globalEncounterArray = [];
	globalSceneArray = [];
	globalEventArray = [];
	globalLogbookArray = [];
	globalMorningArray = [];
	globalAchievementArray = [];

	for (let i = 0; i < initialShopArray.length; i++) {
		globalShopArray.push(initialShopArray[i]);
	}
	for (let i = 0; i < initialItemsArray.length; i++) {
		globalItemsArray.push(initialItemsArray[i]);
	}
	for (let i = 0; i < initialClothesArray.length; i++) {
		globalClothesArray.push(initialClothesArray[i]);
	}
	//Colour swatches and alt art are stored as one-line overrides and turned into real entries
	//here, after the garments they name are all present
	expandClothingVariants(globalClothesArray);
	for (let i = 0; i < initialPickupArray.length; i++) {
		globalPickupArray.push(initialPickupArray[i]);
	}
	for (let i = 0; i < initialCollectablesArray.length; i++) {
		globalCollectablesArray.push(initialCollectablesArray[i]);
	}
	for (let i = 0; i < initialEncounterArray.length; i++) {
		globalEncounterArray.push(initialEncounterArray[i]);
	}
	for (let i = 0; i < initialSceneArray.length; i++) {
		globalSceneArray.push(initialSceneArray[i]);
	}
	for (let i = 0; i < initialEventArray.length; i++) {
		globalEventArray.push(initialEventArray[i]);
	}
	for (let i = 0; i < initialLogbookArray.length; i++) {
		globalLogbookArray.push(initialLogbookArray[i]);
	}
	for (let i = 0; i < initialMorningArray.length; i++) {
		globalMorningArray.push(initialMorningArray[i]);
	}
	for (let i = 0; i < initialAchievementArray.length; i++) {
		globalAchievementArray.push(initialAchievementArray[i]);
	}

	//cleanupImage points a path at the body the player has RIGHT NOW. These entries are the same
	//objects as initialClothesArray's, so storing that result would freeze whatever skintone and
	//bodytype the save happened to load with into the master clothing list for the rest of the
	//session, and the wardrobe grid would keep drawing that body no matter what the player
	//switched to. The list stays body-neutral; every reader re-derives the body it needs.
	for (i = 0; i < globalClothesArray.length; i++) {
		globalClothesArray[i].image = clothingBaseVariants(cleanupImage(globalClothesArray[i].image));
	}
	cleanArrayImages(globalItemsArray);
	cleanArrayImages(globalShopArray);
	cleanArrayImages(globalAchievementArray);

	// Re-apply installed mods LAST. This function wipes and rebuilds the global content
	// arrays on every save-load, but mods are only executed once at boot. Without this,
	// mod-added content (encounters, items, collectables, etc.) survives a refresh but
	// vanishes the first time you load a save. Replaying here — after the cleanupImage
	// passes above — mirrors the boot order (initializeArrays then bootInstalledMods),
	// so anything that renders on a refresh also renders on a load.
	// (reapplyModScripts lives in modding.js; guard in case it hasn't loaded yet.)
	if (typeof reapplyModScripts === "function") {
		reapplyModScripts();
	}
}

function junkCleanup() {
	//Add any missing treasures from the junk array
	for (junkIndex = 0; junkIndex < diggingJunkArray.length; junkIndex++) {
		if (diggingJunkArray[junkIndex].desc != null) {
			var itemToAdd = {
				index: diggingJunkArray[junkIndex].index.replace("ruins-","").replace("wilderness-",""), 
				category: "treasure",
				image: cleanupImage("treasure/"+diggingJunkArray[junkIndex].index),
				value: 0,
				name: diggingJunkArray[junkIndex].content.split("treasure: ")[1].split("player")[0].trim(),
			};
			var existingItemTest = globalItemsArray.find(item => item.index == itemToAdd.index);
			//console.debug(existingItemTest);
			if (existingItemTest) {
				continue;
			}
			if (itemToAdd.index.includes("fruit-")) {
				itemToAdd.category = "fruit";
			}
			if (itemToAdd.index.includes("shell-")) {
				itemToAdd.category = "critter";
			}
			var itemToAddContentSplit = diggingJunkArray[junkIndex].content.split("\n");
			
			for (itemToAddIndex = 0; itemToAddIndex < itemToAddContentSplit.length; itemToAddIndex++) {
				let currentLine = itemToAddContentSplit[itemToAddIndex];
				//console.debug(currentLine);

				if (currentLine.includes("eval data.player.money += ")) {
					let rawValue = currentLine.split("eval data.player.money += ")[1].split(";")[0].trim();
					itemToAdd.value = parseInt(rawValue, 10);
					//console.debug(itemToAdd);

					// Only splice and decrement if we actually found and processed a match
					itemToAddContentSplit.splice(itemToAddIndex, 1);
					itemToAddIndex--; 
				} 
				else if (currentLine.includes("eval data.player.bonus += ")) {
					let rawValue = currentLine.split("eval data.player.bonus += ")[1].split(";")[0].trim();
					// Parse to integer BEFORE doing math to avoid relying on implicit type coercion
					itemToAdd.value = parseInt(rawValue, 10) / 5;
					itemToAdd.value = Math.floor(itemToAdd.value); 
					//console.debug(itemToAdd);

					// Only splice and decrement if we actually found and processed a match
					itemToAddContentSplit.splice(itemToAddIndex, 1);
					itemToAddIndex--;
				}
			}

			//console.debug(itemToAdd);
			if (diggingJunkArray[junkIndex].tags != null) {
				itemToAdd.tags = diggingJunkArray[junkIndex].tags;
			}
			diggingJunkArray[junkIndex].content = itemToAddContentSplit.join("\n");
			globalItemsArray.push(itemToAdd);
		}
	}
}

function cullRepeatGlobalArrays() {
    const globalArrayList = [
        "globalShopArray", "globalItemsArray", "globalPickupArray", 
        "globalCollectablesArray", "globalEncounterArray", "globalSceneArray", 
        "globalEventArray", "globalLogbookArray", "globalMorningArray", 
        "globalAchievementArray"
    ];

    globalArrayList.forEach(arrayName => {
        const currentArray = globalThis[arrayName];

        if (Array.isArray(currentArray)) {
            
            // This Set will now hold stringified objects instead of just numbers
            const seenObjects = new Set();
            
            globalThis[arrayName] = currentArray.filter(item => {
                // Convert the whole object into a JSON string
                const stringifiedItem = JSON.stringify(item);

                if (seenObjects.has(stringifiedItem)) {
                    return false; // We've seen this exact data structure before, toss it
                } else {
                    seenObjects.add(stringifiedItem); // It's completely new, remember it
                    return true; // Keep the object
                }
            });
        }
    });
}

function cullRepeatMorningLogs() {
	var tempArray = [];
	for (i = 0; i < data.player.morningLog.length; i++) {
		if (tempArray.includes(data.player.morningLog[i][0]) != true) {
			tempArray.push(data.player.morningLog[i][0]);
		}
	}
	data.player.morningLog = [];
	for (i = 0; i < tempArray.length; i++) {
		var logEntry = [tempArray[i], 0];
		data.player.morningLog.push(logEntry);
	}
}

function cullRepeatGatherLogs() {
	var tempArray = [];
	for (i = 0; i < data.player.gatherLog.length; i++) {
		if (tempArray.includes(data.player.gatherLog[i][0]) != true) {
			tempArray.push(data.player.gatherLog[i][0]);
		}
	}
	data.player.gatherLog = [];
	for (i = 0; i < tempArray.length; i++) {
		var logEntry = [tempArray[i], 0];
		data.player.gatherLog.push(logEntry);
	}
}

//Core System Functions and misc stuff
function getRandomInt(max) { //Returns 1 below the maximum. getRandomInt(5) gives 0-4
  return Math.floor(Math.random() * Math.floor(max));
}

function compare(a, b) {
	//Sorting helper function for phone and logbook
	if ( a.fName < b.fName ){
		return -1;
	}
	if ( a.fName > b.fName ){
		return 1;
	}
	return 0;
}

function diagnostic(n) {
	unencounter("mayor");
	if (n) {
		var goof = n;
		goof = goof.toLowerCase();
	}
	else {
		var goof = document.getElementById('cheatSubmission').value;
	}
	goof = goof.toLowerCase();
	goof = goof.replace(`'`, ``);
	goof = goof.replace(`'`, ``);
	goof = goof.replace(`:`, ``);
	console.log("Testing code " + goof);
	switch (goof) {
		case "cash money": {
			addFlag("mayor", "chMuns");
			updateMenu();
			if (checkFlag("player", "money") != true) {
				message = `Infinite money cheat enabled!`
			}
			else {
				message = `Infinite money cheat disabled!`
			}
			writeHTML(`toggleflag player; money`);
			break;
		}
		case "infinity": {
			addFlag("mayor", "chLimit");
			updateMenu();
			if (checkFlag("player", "limited") != true) {
				message = `Limits placed on money and inventory size!`
			}
			else {
				message = `Limits removed from money and inventory size!`
			}
			writeHTML(`toggleflag player; limited`);
			break;
		}
		case "unlimited": {
			addFlag("mayor", "chLimit");
			updateMenu();
			if (checkFlag("player", "limited") != true) {
				message = `Limits placed on money and inventory size!`
			}
			else {
				message = `Limits removed from money and inventory size!`
			}
			writeHTML(`toggleflag player; limited`);
			break;
		}
		case "boobies": {
			writeScene("shopkeep", "moneyLimitIntro");
			break;
		}
		case "even the funko pops": {
			addFlag("mayor", "chCollect");
			if (checkFlag("player", "collectables") != true) {
				message = "All collectables unlocked in the collection room."
			}
			else {
				message = "Collectables unlock cheat disabled."
			}
			writeHTML(`toggleflag player; collectables`);
			break;
		}
		case "passion for fashion": {
			addFlag("mayor", "chOutfits");
			addFlag("carpenter", "wardrobe");
			if (checkFlag("player", "outfits") != true) {
				message = "All clothes and variants unlocked."
			}
			else {
				message = "Clothing unlock cheat disabled."
			}
			writeHTML(`toggleflag player; outfits`);
			break;
		}
		case "free the fur": {
			addFlag("mayor", "chCostumes");
			if (checkFlag("player", "costumes") != true) {
				message = "All character outfits unlocked in the museum's fashion wing."
			}
			else {
				message = "Character outfit cheat disabled."
			}
			writeHTML(`toggleflag player; costumes`);
			break;
		}
		case "jiggly bits": {
			addFlag("mayor", "chGender");
			if (data.player.gender == "masc") {
				data.player.gender = "fem";
				message = "Player upper body changed to feminine type."
			}
			else {
				data.player.gender = "masc";
				message = "Player upper body changed to masculine type."
			}
			break;
		}
		case "jiggies up": {
			if (checkFlag("player", "jiggiesUp") != true) {
				addFlag("player", "jiggiesUp")
				message = "All jiggies unlocked."
			}
			else {
				removeFlag("player", "jiggiesUp")
				message = "Jiggies unlock cheat disabled."
			}
			break;
		}
		case "sex em up": {
			addFlag("mayor", "chSex");
			message = "System character sex toggled."
			break;
		}

		case "vegetarian": {
			addFlag("mayor", "chVeggie");
			if (data.player.vegetarian == true) {
				data.player.vegetarian = false;
				message = "Vegetarian mode deactivated. Characters with dicks will appear again."
			}
			else {
				data.player.vegetarian = true;
				message = "Vegetarian mode activated. Characters with dicks will no longer appear. If mayorF, shopkeepF, or carpenterF had dicks, they've had their genitals swapped. Enjoy a meat-free experience!"
				if (checkFlag("mayor", "meat")) {
					removeFlag("mayor", "meat");
					addFlag("mayor", "veggie");
				}
				if (checkFlag("carpenter", "meat")) {
					removeFlag("carpenter", "meat");
					addFlag("carpenter", "veggie");
				}
				if (checkFlag("shopkeep", "meat")) {
					removeFlag("shopkeep", "meat");
					addFlag("shopkeep", "veggie");
				}
			}
			break;
		}
		case "carnivore": {
			addFlag("mayor", "chMeat");
			if (data.player.carnivore == true) {
				data.player.carnivore = false;
				message = "Carnivore mode deactivated. Characters with pussies will appear again."
			}
			else {
				data.player.carnivore = true;
				message = "Carnivore mode activated. Only characters with dicks will appear. If mayorF, shopkeepF, or carpenterF had pussies, they've had their genitals swapped. Please enjoy the sausage fest!"
				if (checkFlag("mayor", "veggie")) {
					removeFlag("mayor", "veggie");
					addFlag("mayor", "meat");
				}
				if (checkFlag("carpenter", "veggie")) {
					removeFlag("carpenter", "veggie");
					addFlag("carpenter", "meat");
				}
				if (checkFlag("shopkeep", "veggie")) {
					removeFlag("shopkeep", "veggie");
					addFlag("shopkeep", "meat");
				}
			}
			break;
		}
		case "youwillcallme": {
			writeScene('system', 'youwillcallme');
			break;
		}
		case "you will call me": {
			writeScene('system', 'youwillcallme');
			break;
		}
		case "new name": {
			addFlag("mayor", "chName");
			message = "renamingRoom"
			break;
		}
		case "oowoo": {
			addFlag("mayor", "chUwU");
			if (data.player.uwu != true) {
				data.player.uwu = true;
				message = "What's this? UwU cheat activated."
			}
			else {
				data.player.uwu = false;
				message = "Oowoo cheat has been deactivated."
			}
			break;
		}
		case "ive come to make an announcement shadow the hedgehogs a bitch-ass motherfucker": {
			addFlag("mayor", "chEgg");
			if (data.player.egg != true) {
				data.player.egg = true;
				message = "He pissed on my fucking wife. That's right, he took his hedgehog-fuckin' quilly dick out and he pissed on my fucking wife, and he said his dick was 'this big,' and I said 'that's disgusting,' so I'm making a callout post on my Twitter.com: Shadow the Hedgehog, you've got a small dick, It's the size of this walnut except WAY smaller. And guess what? Here's what my dong looks like: that's right baby, all points, no quills, no pillows— look at that, it looks like two balls and a bong. He fucked my wife, so guess what, I'm gonna fuck the EARTH. That's right, this is what you get: MY SUPER LASER PISS!! Except I'm not gonna piss on the Earth, I'm gonna go higher; I'm pissing ON THE MOON! How do you like that, Obama? I PISSED ON THE MOON, YOU IDIOT! You have twenty-three hours before the piss drrrrroplllllllets hit the fucking Earth, now get outta my fucking sight, before I piss on you too!."
			}
			else {
				data.player.egg = false;
				message = "Egg cheat has been deactivated."
			}
			break;
		}
		case "egg": {
			addFlag("mayor", "chEgg");
			if (data.player.egg != true) {
				data.player.egg = true;
				message = "He pissed on my fucking wife. That's right, he took his hedgehog-fuckin' quilly dick out and he pissed on my fucking wife, and he said his dick was 'this big,' and I said 'that's disgusting,' so I'm making a callout post on my Twitter.com: Shadow the Hedgehog, you've got a small dick, It's the size of this walnut except WAY smaller. And guess what? Here's what my dong looks like: that's right baby, all points, no quills, no pillows— look at that, it looks like two balls and a bong. He fucked my wife, so guess what, I'm gonna fuck the EARTH. That's right, this is what you get: MY SUPER LASER PISS!! Except I'm not gonna piss on the Earth, I'm gonna go higher; I'm pissing ON THE MOON! How do you like that, Obama? I PISSED ON THE MOON, YOU IDIOT! You have twenty-three hours before the piss drrrrroplllllllets hit the fucking Earth, now get outta my fucking sight, before I piss on you too!."
			}
			else {
				data.player.egg = false;
				message = "Egg cheat has been deactivated."
			}
			break;
		}
		case "fucking pronouns": {
			addFlag("mayor", "chPronouns");
			if (data.player.pronouns != true) {
				data.player.pronouns = true;
				message = "Woke agenda removed, all pronouns have been cut from the game"
			}
			else {
				data.player.pronouns = false;
				message = "Woke agenda restored, pronouns have returned!"
			}
			break;
		}
		case "find mii": {
			addFlag("mayor", "chGPS");
			if (data.player.gps != true) {
				data.player.gps = true;
				message = "GPS mode activated. NPC encounters will appear on the map."
			}
			else {
				data.player.gps = false;
				message = "GPS mode deactivated."
			}
			break;
		}
		case "pool noodle": {
			addFlag("mayor", "chEvents");
			if (checkFlag("player", "events") != true) {
				message = "All events now made visible in the gallery."
			}
			else {
				message = "Gallery access cheat disabled."
			}
			writeHTML(`toggleflag player; events`);
			break;
		}
		case "note taker": {
			addFlag("mayor", "chLogbook");
			if (checkFlag("player", "logbook") != true) {
				addFlag("player", "logbook")
				message = "Full logbook unlocked. Beware! Some characters aren't meant to have all logbook entries displayed at once!"
			}
			else {
				removeFlag("player", "logbook")
				message = "Logbook unlock cheat disabled."
			}
			break;
		}
		case "human alteration app": {
			addFlag("player", "haa")
			message = "Human Alteration App code activated! New jiggies and clothing options have been unlocked."
			break;
		}
		case "anomaly vault": {
			addFlag("player", "anomaly")
			message = "Anomaly Vault code activated! New clothing options have been unlocked."
			break;
		}
		case "rainy dayz": {
			addFlag("player", "rainy")
			message = "Rainy DayZ code activated! New jiggies and clothing options have been unlocked."
			break;
		}
		case "princess quest": {
			addFlag("player", "princess")
			message = "Princess Quest code activated! New clothing options have been unlocked."
			break;
		}
		case "hentai university": {
			addFlag("player", "university")
			message = "Hentai University code activated! New jiggies and clothing options have been unlocked."
			break;
		}
		case "bitch medicenter": {
			addFlag("player", "medicenter")
			message = "Bitch Medicenter code activated! New clothing options have been unlocked."
			break;
		}
		case "argent science": {
			addFlag("player", "argent")
			message = "Argent Science code activated! New jiggies and clothing options have been unlocked."
			break;
		}
		default:
			message = "Code Failed: "+goof;
			var comparison1 = goof;
			comparison1 = comparison1.replace("", "");
			comparison1 = comparison1.replace("", "");
			comparison1 = comparison1.replace("-", "");
			comparison1 = comparison1.replace("-", "");
			comparison1 = comparison1.replace("_", "");
			comparison1 = comparison1.replace("_", "");
			comparison1 = comparison1.toLowerCase();
			var nameList = supportersArray;
			for (i = 0; i < nameList.length; i++) {
				var comparison2 = nameList[i][0];
				comparison2 = comparison2.replace("", "");
				comparison2 = comparison2.replace("", "");
				comparison2 = comparison2.replace("-", "");
				comparison2 = comparison2.replace("-", "");
				comparison2 = comparison2.replace("_", "");
				comparison2 = comparison2.replace("_", "");
				comparison2 = comparison2.toLowerCase();
				if (comparison1 == comparison2) {
					message = "Subscriber found! Hello "+nameList[i][0]+"! Thank you for your support, a star has been added to the collection room in your home!"
					addFlag("player", "patron")
				}
			}
			var nameList = patrons;
			//console.info(nameList);
			if (message.includes("Subscriber found!") == false) {
				for (i = 0; i < nameList.length; i++) {
					var comparison1 = goof;
					comparison1 = comparison1.replace(" ", "");
					comparison1 = comparison1.replace(" ", "");
					comparison1 = comparison1.replace("-", "");
					comparison1 = comparison1.replace("-", "");
					comparison1 = comparison1.replace("_", "");
					comparison1 = comparison1.replace("_", "");
					comparison1 = comparison1.toLowerCase();
					var comparison2 = nameList[i];
					comparison2 = comparison2.replace(" ", "");
					comparison2 = comparison2.replace(" ", "");
					comparison2 = comparison2.replace("-", "");
					comparison2 = comparison2.replace("-", "");
					comparison2 = comparison2.replace("_", "");
					comparison2 = comparison2.replace("_", "");
					comparison2 = comparison2.toLowerCase();
					//console.info(comparison1+" "+comparison2);
					if (comparison1 == comparison2) {
						message = "Patron found! Hello "+nameList[i]+"! Thank you for your support, a star has been added to the collection room in your home!"
						addFlag("player", "patron")
					}
				}
			}
	}
	changeLocation(data.player.location)
	writeSpecial(message);
	if (message == "renamingRoom") {
		renamingRoom();
	}
}


function renamingRoom() {
	document.getElementById('output').innerHTML = '';
	wrapper.scrollTop = 0;
	for (i = 0; i < data.story.length; i++) {
		if (checkTrust(data.story[i].index) > 0) {
		writeMed(cleanupImage(data.story[i].index+"/"+data.story[i].outfitDefault+"/"+data.story[i].emotionDefault));
		document.getElementById('output').innerHTML += `
		<p class="centeredText"><input type="text" id="nameSubmission-`+data.story[i].index+`" value="`+data.story[i].fName+`">
		`;
		//writeFunction("resetProgress('"+data.story[i].index+"')", "Reset progress with "+data.story[i].fName);
		}
	}
	writeFunction("renameCharacter('cancel')", "Rename characters");
	writeFunction("changeLocation(data.player.location)", "Cancel and leave");
}

function truncString(target) {
	var sum = 0;
	target.toUpperCase().split('').forEach(function(alphabet) {
		var digit = alphabet.charCodeAt(0) - 64;
		digit = digit*2;
		sum += digit;
	});
	return(sum);
}

function playerGenderswap() {
	if (data.player.gender == "masc") {
		data.player.gender = "fem";
	}
	else {
		data.player.gender = "masc";
	}
}

function playerGenitalSwap() {
	if (data.player.genitals == "penis") {
		data.player.genitals = "pussy";
	}
	else {
		data.player.genitals = "penis";
	}
}
