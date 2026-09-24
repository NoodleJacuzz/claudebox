var character = {index: "mayor", flags: "", fName: "Angelica", lName: "", color: "#F5152E", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: ""};

var achievementArray = [
	//Frames: ultraRare, vaporRare
	{index:"!collect99", frame: "ultraRare", name: "Museum Visitor", requirements: "?flag foxf intro;", description: "Visit the local museum and take a tour.", image: "foxf/foxAchievOmni",},
	{index:"!collect991", frame: "ultraRare", name: "Museum Guest", requirements: "?flag foxf fun-foxd;", description: "Have a threesome with the museum's curators.<br>Hint: After day 20 they'll start playing pranks and appearing in dug-up chests. Visit them again after the mayor scolds them.", image: "foxf/foxAchiev2",},
	{index:"!collect999", frame: "ultraRare", name: "Exhibitionism", requirements: "?flag mayor nudity1;", description: "Walk through Pinecone Plaza in the buff.", image: "system/trophies/nudity1-1-light-masc",},
	{index:"1mayorFriend", frame: "ultraRare", name: "Mayor's BFF", requirements: "?flag mayor pounce;", description: "Chat with mayorF every day until she has her second breakdown during her morning radio show, then visit her.", image: "mayor/achievement1SEX",},
	{index:"1mayorSecond", frame: "ultraRare", name: "Temp. Mayor", requirements: "?flag mayor repeat1;", description: "After being pounced by mayorF keep visiting her as her lust builds up even further.", image: "mayor/achievement2SEX",},
	{index:"99pill", frame: "ultraRare", name: "Bottle Abuser", requirements: "?flag player pill-fail;", description: "Dig up the pill bottle artifact and take it to shopF. After using it, reach your limit by wandering around the town for too long.", image: "artifacts/pillsT",},
	{index:"99watch", frame: "ultraRare", name: "Clock Stopper", requirements: "?flag shopkeep watchStart;", description: "Dig up the stopwatch artifact and take it to shopF. After using it, play with shopF's frozen body.", image: "artifacts/watchT",},
	//{index:"99telly", frame: "ultraRare", name: "Brainrot", requirements: "?completed telly;", description: "Watch every available show and commercial on the Tellyvision. (Bring it to carpF to identify it!)", image: "system/trophies/telly",},
	{index:"99weird", frame: "ultraRare", name: "Weird AF", requirements: "?weird; ?item permit;", description: "Obtain the Monster Fucker Permit and enable the weird fetish in the settings menu. (Bring the strange worm from the forest to the foxes!)", image: "system/trophies/wormy",},
	//{index:"mayor2", frame: "ultraRare", name: "", requirements: "?flag mayor achievementTest;", description: "Test achievement 2 - talk to mayorF to unlock, ultra rare frame", image: "mayor/clothed/happy",},
	//{index:"mayor3", frame: "vaporRare", name: "", requirements: "?flag mayor achievementTest;", description: "Test achievement 2 - talk to mayorF to unlock, vapor rare frame", image: "mayor/clothed/happy",},
	//{index:"mayor4", frame: "ultraRare", name: "", requirements: "?flag mayor achievementTest;", description: "talk to mayorF to unlock. Test for longer dialogue strings, initially they would run up against the side of the window which would be incredibly annoying. By the way I wanted to make it so this text only appeared when you clicked but since this serves as the game's guide I'm worried that less investigative people won't try clicking the cards. Thoughts?", image: "mayor/clothed/happy",},
];

var itemsArray = [
	//{index: "bag", name: "Bigger Bag", value: 0, category: "key", image: "items/bag"},
	//{index: "Blue Shirt", category: "clothing", image: "player/shirt-masc", filter: "filter: hue-rotate(-120deg)", },
];

var shopArray = [
	//{index: "shopEventTest", name: "Shop event test", price: 1, unique: true, event: true, requirements: "?location store;", image: "images-webp/mayor/nude/happy.webp",
	//desc: "Test refreshing the shop",},
	//{index: "inventoryTest", name: "Inventory Test", price: 0, unique: false, event: true, requirements: "?location store;", image: "images-webp/mayor/nude/happy.webp",
	//desc: "Add a bunch of items and junk for testing",},
	//{index: "posterTest", name: "Poster Test", price: 0, unique: false, event: true, requirements: "?location squidsMakeInc;", image: "images-webp/locations/upgrades/tarotSample.webp",
	//desc: "Test the three sample posters",},
	//{index: "starTest", name: "Star Test", price: 0, unique: false, event: true, requirements: "?location squidsMakeInc;", image: "images-webp/mayor/nude/happy.webp",
	//desc: "Test the sponsor star",},
];

var pickupArray = [
	//{index: "fruitGeneric", requirements: "?location lavenderLane;", top: 0, left: 0, size: 20, image: "items/fruit/generic"},
	{index: "tarot", requirements: "?location lavenderLane; !carnivore; !item tarot0;", top: 30, left: 0, event: true, unique: true, image: "items/card"},
	{index: "pocketmanz", requirements: "?location playerExterior; !vegetarian; !item pocket-eev-0; ?nutmeg;", top: 60, left: 78, event: true, unique: true, image: "items/card"},
	//{index: "mapEventTest", requirements: "?location lavenderLane;", top: 60, left: 0, event: true, unique: true, image: "mayor/nude/happy"},
];

var logbookArray = [
	"im images/mayor/clothed-meat/happy; ?flag mayor meat; title Cheery; The redheaded mayor of Syrup Town, mayorF is known to be patient and thoughtful, but she's also very much an overthinker.<br>In order to make sure there's at least one person keeping the town together while you're out fixing the birthrate issues, she's opted to abstain from lewdness.<br>She works out of her office on Pineapple Plaza, and most nights she sleeps there too!",
	"im images/mayor/clothed/happy; ?flag mayor veggie; title Cheery; The redheaded mayor of Syrup Town, mayorF is known to be patient and thoughtful, but she's also very much an overthinker.<br>In order to make sure there's at least one person keeping the town together while you're out fixing the birthrate issues, she's opted to abstain from lewdness.<br>She works out of her office on Pineapple Plaza, and most nights she sleeps there too!",
	"im images/mayor/logbook2m.png; ?flag mayor meat; title Professional Attire; ?trustMin "+character.index+" 1; mayorF's favorite top is a sleeveless yellow sweater, and of course besides that she goes completely nude.<br>Since she's the one who controls the town's internet filters, surely she realizes how incredibly lewd it is for a woman like her to walk around completely bottomless, right?",
	"im images/mayor/logbook2v.png; ?flag mayor veggie; title Professional Attire; ?trustMin "+character.index+" 1; mayorF's favorite top is a sleeveless yellow sweater, and of course besides that she goes completely nude.<br>Since she's the one who controls the town's internet filters, surely she realizes how incredibly lewd it is for a woman like her to walk around completely bottomless, right?",
	"im images/mayor/logbook3m.png; ?flag mayor meat; title Red Knot; ?trustMin "+character.index+" 2; With no sheath in sight, mayorF's canine cock is nearly always hard and her knot is permanently engorged. The only difference when she's 'flaccid' is her meat hangs down between her legs and isn't pulsing needily.<br>When she cums, her knot and balls throb and clench, and her orgasms are more leaky than spurty. After finally managing to stroke herself to release hours after her work was supposed to start, she'll often be super annoyed that she's painted her desk's interior white and sticky, but for the full minutes her orgasms last she'll happily twitch and giggle as her throbbing cock leaks glob after glob of cum.",
	"im images/mayor/logbook3v.png; ?flag mayor veggie; title Blue Handfuls; ?trustMin "+character.index+" 2; Beneath mayorF's sweater are a pair of perky breasts, they're so sensitive lately that she's considering doffing the sweater, but the first gentle breeze across her often-hard nipples will probably change her mind right back.<br> And of course the moment she can manage to pull her attention away from her nipples, her pussy is practically buzzing for her attention. Trying to ignore her heat hasn't been working out very well, at this point her first instinct when she hears someone coming is not to stop masturbating, but to just try and hide her arm movements as she plays with herself.",
	"im images/mayor/logbook4m.png; ?flag mayor meat; title Plump Booty; ?trustMin "+character.index+" 8; Because she's always so wet she's practically dripping, mayorF had one last hope. Maybe an anal orgasm would be strong enough to snap her out of her funk? She's given it a shot, transforming her ass into a fuckhole built to be plapped, but unfortunately while it can very quickly bring her to a knee-shaking orgasm, the effects are just as temporary as traditional orgasms. And as an additional downside, now she can't stop fantasizing about playing with her ass all day too.",
	"im images/mayor/logbook4v.png; ?flag mayor veggie; title Plump Booty; ?trustMin "+character.index+" 8; Because she's always so wet she's practically dripping, mayorF had one last hope. Maybe an anal orgasm would be strong enough to snap her out of her funk? She's given it a shot, transforming her ass into a fuckhole built to be plapped, but unfortunately while it can very quickly bring her to a knee-shaking orgasm, the effects are just as temporary as traditional orgasms. And as an additional downside, now she can't stop fantasizing about playing with her ass all day too.",
];

var encounterArray = [
	//{index: `placeholder`, name: character.index+`F test`, requirements: "?location pineconePlaza;", altName: "", altImage: "",},

		
	{name: "Town Hall", index: "intro1", top: 35, left: 20, type:"button", target: "townHall", time: "MorningEvening", requirements: "?flag player intro; !flag mayor mayorIntro;"},
	{index: "pounce", type:"walking", requirements: "?trustMin mayor 7; ?location townHall; !flag mayor pounce;"},
	{index: "mayorNudity1", type:"walking", requirements: "?location pineconePlaza; ?nude; !flag mayor nudity1;"},
];

var sceneArray = [
	//Scenes
	{index: `intro1`,
	content: `
		t You step inside of the town hall and after a short bit of searching you find the mayor's office.
		player worried Hello?
		t A lady at her desk notices you, stands, and smiles warmly. Her nameplate reads "<input type='text' id='nameSubmission-mayor' value='mayorF'>".
		eval introFunction("mayor");
	`,},
	{index: `intro2`,
	content: `
		mayor Hello, you must be our newest neighbor.
		t You nod your head, trying to stay focused. She's totally naked from the waist down!
		player excited Um, you, uh...<br>I can see your penis. ?flag mayor meat;
		player excited Um, you, uh...<br>I can see your pussy. ?flag mayor veggie;
		mayor worried ... Yes?<br>Oh, right, I should ask. Those pants of yours, are they a medical necessity or a fashion choice?
		player shock ... Both? Well, mostly the first one. Well...
		t You squirm a bit, your ultra-tight shorts aren't exactly hiding much from the world either, but surely they're better than nothing at all!
		mayor happy Good to know. Alright, you're probably itching to relax in your new home. I just have a few papers for you to sign.
		t ...
		t You took a pen and mayorF walked you through what must have been a dozen documents. While she does a good job explaining each of them, by the last one you're completely glazed over.
		mayor Alright! That's finished. You are now the proud owner of a lovely house down at the end of Lavender Lane. Head on down to our local carpentry shop down the road, I'll let them know you're coming and to have your keys ready. <br>Now, I assume you didn't bring any of the local currency, so I'll just put this on your tab. You owe one thousand, two hundred and fifty muns.
		player shock ... Eh?
		mayor It reads in clear print on that last document that the matter of local taxes on the house will be your responsibility. That includes gift taxes, property taxes, and a few others.
		t You start to sweat.
		mayor Now, we make special exceptions for new residents. That thousand, two hundred and fifty is after several discounts. Really though, it's just a drop in the bucket compared to the value of the...<br> Of the...
		t You notice her pupils dilate a little, and her breathing has grown deeper. She trails off, glancing at your chest, then at your crotch.
		im mayor/intro2
		mayor excited Oh, you're sweating... Er-! <br>Ah, well, I guess I should h-hurry this along. Someone in town has to stay clear-headed to run this place. <br>I was hoping to be a little more indirect, but...
		mayor happy *Ahem*<br>The tax will be forgiven completely if you marry a local here. Man or woman, we just need a human around here to spread their pheromones.
		mayor excited It's... It's for the benefit of the town! I'm sure you'll grow to love it here, the debt is just a formality, really.<br>N-now if there's nothing else, my office hours are just about over. Just head down to the carpentry shop for your key!
		player shock Already? But I just got here! I have more questions!
		mayor excited Those can wait for tomorrow, when I have a better fan installed in the room!
		t She stands up from her chair to clearly show you the door, her eyes darting across your body as she does.
		mayor Please feel free to drop by anytime if something comes up. Preferably on cool days and not right after exercise.<br>Welcome to Syrup Town!
		t And so, you're rushed out of the office, and mayorF closes the door firmly behind you. It looks like-
		mayor torogao FFFFFuuuck~! Ngh~!
		t It looks like your new adventure has just-
		mayor ahegao God *he smelled so fucking good! Fuck, gonna cum already! Hold it together, hold it together, you're the town mayor, not some common bitch... NGH!
		t It looks like your new adventure has just begun!
		eval addFlag("mayor", "mayorIntro");
		button Head outside; changeLocation('pineconePlaza');
	`,},
	{index: `statusQuo`,
	content: `
		eval mayorQuo();
	`,},
	{index: `pounce`,
	content: `
		eval writeEvent("pounce");
		eval addFlag("mayor", "pounce");
		eval passTime();
		eval data.player.mayorLust = 0;
		finish
	`,},
	{index: `repeat1First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('mayor', data.player.currentScene.replace("First", ""));
		eval raiseTrust('mayor', 1);
		eval data.player.mayorLust = 0;
		eval removeFlag('mayor', 'horny');
		eval addFlag('mayor', 'safe');
		eval passTime();
		finish
	`,},
	{index: `repeat1Repeat`,
	content: `
		im repeat1
		im repeat2
		im repeat3
		im repeat4
		im repeat5Meat ?flag mayor meat;
		im repeat5Veggie ?flag mayor veggie;
		im repeat6
		eval addFlag('mayor', 'repeat1');
		eval unencounter(data.player.currentCharacter);
		eval data.player.mayorLust = 5;
		eval removeFlag('mayor', 'horny');
		eval addFlag('mayor', 'safe');
		finish
	`,},
	{index: `repeat2First`,
		content: `
			eval writeEvent('repeat2')
			eval addFlag('mayor', 'repeat2')
			eval passTime();
			finish
		`
	},
	{index: `repeat2Repeat`,
		content: `
			im repeat2-1
			im repeat2-2
			im repeat2-3
			eval addFlag('mayor', 'repeat2');
			finish
		`
	},
	{index: `repeat3First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('mayor', data.player.currentScene.replace("First", ""));
		eval raiseTrust('mayor', 1);
		eval data.player.mayorLust = 5;
		eval removeFlag('mayor', 'horny');
		eval addFlag('mayor', 'safe');
		eval passTime();
		finish
	`,},
	{index: `repeat3Repeat`,
	content: `
		t ...
		eval addFlag('mayor', 'repeat3');
		eval unencounter(data.player.currentCharacter);
		eval data.player.mayorLust = 5;
		eval removeFlag('mayor', 'horny');
		eval addFlag('mayor', 'safe');
		finish
	`,},
	{index: `repeat4First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('mayor', data.player.currentScene.replace("First", ""));
		eval raiseTrust('mayor', 1);
		eval data.player.mayorLust = 0;
		eval removeFlag('mayor', 'horny');
		eval addFlag('mayor', 'safe');
		eval passTime();
		finish
	`,},
	{index: `repeat4Repeat`,
	content: `
		t ...
		eval addFlag('mayor', 'repeat4');
		eval unencounter(data.player.currentCharacter);
		eval data.player.mayorLust = 0;
		eval removeFlag('mayor', 'horny');
		eval addFlag('mayor', 'safe');
		finish
	`,},
	{index: `wall1`,
		content: `
			eval writeEvent('wall1')
			eval addFlag('mayor', 'wall1')
			eval addFlag('carpenter', 'dailyWall')
			eval passTime();
			finish
		`
	},
	{index: `pill-mayor`,
		content: `
			player forced Nghhh~! I can't make it... mayorF!
			t You knock at the door of the town hall, but nobody answers.
			player shock Out?! Today, of all days?!
			t ...
			mayor crying Achoo!
			mayor tired Mggh... I feel like somebody's talking about me...
			carpenter sleep Just relax, nobody's going to notice you taking a short break.
			t ...
			player pent Ghh... I'll need to find someone else...!
			trans cancel; Finish
		`
	},
	{index: `cherry-mayor`,
		content: `
			define playerduo = dual sp1 player; sp2 player;
			t You knock at the door of the town hall, but nobody answers.
			playerduo worried Aww man! She's out!
			t ...
			mayor scared You found WHAT underneath the town?
			foxm worried Technically it's a set of grottos adjacent to the town.
			foxf happy And like we said, she seems friendly!
			mayor panic <i>Seems</i> friendly?! How long has she been down there?
			t ...
			player worried It's such a shame, she really would have liked having two humans to play with.
			player happy It's alright home-slice! We'll just have to find someone else to play with for now.
			trans cancel; Finish
		`
	},
	{index: `watch-start-mayor`,
		content: `
			player worried Hmm, her door's locked.
			player joy mayorF! Let me in, I wanna do lewd things!
			player amused ...<br>Oh well, guess she doesn't want to.<br>Guess I'll just have to find someone else.
			trans cancel; Finish
		`
	},
	{index: `mayorNudity1`,
		content: `
			eval writeEvent('nudity1')
			eval addFlag('mayor', 'nudity1')
			eval data.player.location = "lavenderLane";
			finish
		`
	},


	//Test functions
	{index: `renameTest`,
	content: `
		sp mayor; altName <input type='text' id='nameSubmission-mayor' value='Angelica'>; Test
		button Test; renameCharacter('placeholder');
	`,},
	{index: `tarotGeneric`,
	content: `
		t You notice something on the ground.
		eval addItem("mayorPog");
		eval addItem("tarot0");
		eval addItem("pocket-eev-0");
		eval addItem("jiggy-225o-1");
		trans cancel; Finish
	`,},
	{index: `tarot`,
	content: `
		t You notice something on the ground.
		eval addItem("tarot0");
		t It seems to be some kind of card, the kind used for mystical readings. Who could have discarded this?
		t If you don't want it, you can toss it aside and make a note to not bother picking these up again. You get the feeling like these are totally optional anyways.
		trans cancel; Take it with you
		trans tarotReject; Throw it away!
	`,},
	{index: `tarotReject`,
	content: `
		t You decide to toss the card. Best not to get involved with that.
		t You won't find any tarot cards in the future. 
		eval removeItem("tarot0");
		trans cancel; Finish
	`,},
	{index: `pocketmanz`,
	content: `
		t You notice something on the ground.
		eval addItem("pocket-eev-0");
		t It seems to be some kind of card, the kind used in a particular game, although it's very clearly some kind of bootleg version. Who could have discarded this?
		t If you don't want it, you can toss it aside and make a note to not bother picking these up again. You get the feeling like these are totally optional anyways.
		trans cancel; Take it with you
		trans pocketmanzReject; Throw it away!
	`,},
	{index: `pocketmanzReject`,
	content: `
		t You decide to toss the card. Best not to get involved with that.
		t You won't find any pocketmanz cards in the future. 
		eval removeItem("pocket-eev-0");
		trans cancel; Finish
	`,},
	{index: `genderTest`,
	content: `
		eval playerGenderswap();
		sp player; shock Shocked face test.
		sp player; angry Angry face test.
		sp player; ahegao; Final test with ahegao face, Genderswap complete. *Sir, *His, *he, *HIM
		trans cancel; Finish
	`,},
	{index: `genitalTest`,
	content: `
		eval playerGenitalSwap();
		player Genitals swapped!<br>Adding lines so you can see:<br>Empty<br>Empty<br>Empty<br>Empty<br>Empty<br>Empty
		trans cancel; Finish
	`,},
	{index: `sexTest`,
	content: `
		toggleflag mayor; meat
		toggleflag mayor; veggie
		toggleflag carpenter; meat
		toggleflag carpenter; veggie
		toggleflag shopkeep; meat
		toggleflag shopkeep; veggie
		t System character sexes toggled.
		trans cancel; Finish
	`,},
	{index: `posterTest`,
	content: `
		eval data.player.tarotPoster = "locations/upgrades/tarotSample";
		eval data.player.pocketmanzPoster = "locations/upgrades/pocketSample";
		eval data.player.magazinePoster = "locations/upgrades/magazineSample";
		carpenter Placeholder for poster event
		trans cancel; Finish
	`,},
	{index: `starTest`,
	content: `
		addFlag player; sponsor
		carpenter Placeholder for sponsor star event
		trans cancel; Finish
	`,},

	//Morning content
	{index: `mayorMorning-wolf`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor Gooood morning Syrup Town~! It's time for the morning mailbox, where I'll be looking at your questions or concerns of the day. Always anonymous, let's see what the topic is today...

		wolf special secret; "I think we should expand our town's appreciation for fashion. Looking nice doesn't just make you look good, it makes you feel good too! I'd be willing to donate some muns directly towards the establishment of a fashion department at town hall."
		mayor What a lovely thought! Good citizens like you are the lifeblood of the town.<br>While I'm all for an update of our taxation code, I don't want to force any folks here into the mindset they need to work to survive. Instead, I'd recommend asking shopkeepF.
		mayor sparkle Ivy & Oak has a great deal of outfits and clothing options in addition to well priced groceries. <br>Plus, a small portion of what you pay goes to the town's maintenance! Of course being self sustainable is important, but making purchases in town is good for the town's overall health!

		trans cancel; Finish
	`,},
	{index: `mayorMorning-mesu`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor Gooood morning Syrup Town~! It's time for the morning mailbox, where I'll be looking at your questions or concerns of the day. Always anonymous, let's see what the topic is today...
		
		mesu special secret; "I think it may be time to remove the town's decency filter, we'd be best off educating ourselves to the nature of humans and human society."
		mayor Hmm, an interesting suggestion, but it's a complex problem. I wouldn't want any of us romanticizing human culture too much, they're flesh and blood just like us, and the material out there, at least what I've seen behind the filter, is very... Skewed.
		mayor sleep If you're all that curious, I recommend talking to a human yourselves!

		trans cancel; Finish
	`,},
	{index: `mayorMorning-fash`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor Gooood morning Syrup Town~! It's time for the morning mailbox, where I'll be looking at your questions or concerns of the day. Always anonymous, let's see what the topic is today...

		fash special secret; "The human smells good."
		mayor worried Y... Yes, yes *he does. Actually, that's something I've been meaning to talk about. There was plenty of material about female animal folk reactions to human pheromones, but there's much less research into the effects on males. Most sources seem to suggest it's the exact same on either gender.
		mayor shock Which is of course ridiculous! Imagine if all the males in town were desperate to be impregnated? No, I'll put my stock into the sources saying the pheromones make male folks more virile and ready to reproduce.
		mayor excited ?flag mayor male; <i>I'll just ignore the fact that I'm desperate for the human to pump me full puppies...</i>
		mayor excited !flag mayor male; <i>And even if it's the other way around, I guess it wouldn't be so bad if the human had to impregnate each and every one of us while the men watched...</i>

		trans cancel; Finish
	`,},
	{index: `mayorMorning-hyena`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor Gooood morning Syrup Town~! It's time for the morning mailbox, where I'll be looking at your questions or concerns of the day. Always anonymous, let's see what the topic is today...

		hyena special secret; "Could we get some of shopF's research notes mailed out around town? Truth be told, I'm too nervous to attend human culture class, and I'm worried I'm totally out of my depth dealing with the human and heat in general."
		mayor worried Well, I have no idea what human culture class is, but if shopF is keeping private notes on the human, they're hers to do what she wants with. 
		mayor happy Also, please don't feel intimidated by the human. *He has a lovely sense of humor.
		mayor sleep Just keep telling yourself it's all jokes and all the anxiety will flow right away.

		trans cancel; Finish
	`,},
	{index: `mayorMorning-fashAlt`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor Gooood morning Syrup Town~! It's time for the morning mailbox, where I'll be looking at your questions or concerns of the day. Always anonymous, let's see what the topic is today...

		fash special secret; "Madame Mayor, I see too many folks out of shape, not taking their health seriously! Please institute some kind of mandatory fitness program. If shopkeepF can manage to hold human culture classes, we can surely find time for some exercise!"
		mayor worried Right... Well, I think our health is of course something to take seriously, but making it mandatory is a bit...
		mayor shock Wait, human culture classes? ... I think I asked mesuF to talk to folks letting them know about some of the details of heat and how the human might act on arrival, is that what you mean?
		mayor worried Is that still going? Was I not invited?
		mayor angry Wait, why is shopkeepF leading these? You had better not be teaching them things from those books you keep importing! Those aren't "educational texts", they're-
		mayor shock ... W-well, I've gotten a bit off topic. Until next time!		

		trans cancel; Finish
	`,},
	{index: `mayorMorning-sadogato`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor Gooood morning Syrup Town~! It's time for the morning mailbox, where I'll be looking at your questions or concerns of the day. Always anonymous, let's see what the topic is today...

		sadogato special secret; "How long will the human be living here? Surely *his pheromones will have spread through the town, I miss the old respectable-"
		mayor frown I'll have to stop there. playerF is a permanent resident of the town, and a very welcome one at that. Please try not to let your biases overcome you, that's the only real threat to this town's respectable air.
		mayor happy I understand some people might feel intimidated by our new human resident, but please don't be! *He's very approachable and kind, perhaps a bit eccentric, but harmless!

		trans cancel; Finish
	`,},
	{index: `mayorMorning-milf`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor Gooood morning Syrup Town~! It's time for the morning mailbox, where I'll be looking at your questions or concerns of the day. Always anonymous, let's see what the topic is today...

		milf special secret; "I was trying to learn about human pregnancies, but the decency filter blocked me."
		mayor shock Oh! Well, maybe I should ease up on the filter's strength when it comes to education, but to tell the truth you should probably avoid the subject. Human pregnancies are much messier and more painful than ours.
		mayor happy All you need to know is that human pheromones will make you more willing and able to become pregnant. And, well...
		mayor worried If you should be... Inseminated by a human, it's nothing to worry about. Cross-species breeding is confirmed to be influenced nearly ninety-nine percent by the non-human parent. There are a few studies about abnormal libido rates in part-human folks, but nothing conclusive yet.

		trans cancel; Finish
	`,},
	{index: `mayorMorning-doe`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor Gooood morning Syrup Town~! It's time for the morning mailbox, where I'll be looking at your questions or concerns of the day. Always anonymous, let's see what the topic is today...

		doe special secret; "Hello! -doeF"
		mayor Hello, doeF. Please say hello to your mother for me as well.
		mayor sparkle Oh, that reminds me. Folks, since the human's in town, you may be starting to get interested in starting a family. I've been preparing a few pamphlets to get you all caught up on the joys of motherhood!
		mayor worried Er, and fatherhood too. That one hasn't been on my mind as much, but it's important too! Please appreciate both moms and dads!

		trans cancel; Finish
	`,},
	{index: `mayorMorning-shopkeep`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor Gooood morning Syrup Town~! It's time for the morning mailbox, where I'll be looking at your questions or concerns of the day. Always anonymous, let's see what the topic is today...

		shopkeep special secret; I found a magazine while on my morning walk. You said you were making a pamphlet to talk about parenthood, is this it? I've included it with the letter.
		mayor Hmm, strange. I don't think mesuF finished it yet, but-
		mayor shock Oh my goodness!
		mayor angry Folks, this... This isn't...
		mayor worried Um, folks, keep an eye out around town. Apparently someone's placed certain documents of... Well, of inappropriate things around town. If you see one of them, dispose of it immediately!

		trans cancel; Finish
	`,},
	{index: `mayorMorning-mommy`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor Gooood morning Syrup Town~! It's time for the morning mailbox, where I'll be looking at your questions or concerns of the day. Always anonymous, let's see what the topic is today...

		mommy special secret; "I've been asking around lately and I've noticed no other folks in town seem to be pairing up with each other, most discussion is about the new human, but when should we expect to see a rise in..."-
		mayor shock M-my, you scribbled out a lot there, I see. Wait, "other"? Do you know someone who's paired up already? That would be great news if you do.
		mayor happy In any case the new human is probably just the center of attention because not much else about the town changes from day to day. Give it time.
		mayor worried ... Although now that I think about it, I haven't been attracted to anyone else but... Er, nevermind!

		trans cancel; Finish
	`,},
	{index: `mayorMorning-1`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor We'll be doing something different today folks, I'd like to conduct a survey among our animal folk listeners. <br>If you've experienced an attraction to someone lately, please send me a quick slip. <br>I just need to know if it was towards another animal folk, or the human.
		mayor worried There's nothing wrong either way of course, I'm just... Being data-centric!
	 

		eval raiseTrust("mayor", 1);
		trans cancel; Finish
	`,},
	{index: `mayorMorning-2`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town.
		eval writeEvent("mayorMorning-2"); 

		eval raiseTrust("mayor", 1);
		trans cancel; Finish
	`,},
	{index: `mayorMorning-3`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor excited G-good morning Syrup Town~! It's time for the morning mailbox, I'm so so sorry about yesterday, there was a minor technical hiccup.
		mayor worried N-now, I did get the survey feedback, you were all more vivid than I expected.
		mayor shock Not that that's a bad thing! I thing it's great that you're exercising your writing skills.<br>Anyways, The overall feedback results were quite clear. Nobody in town is interested in fu- <b>pairing up</b> with another ordinary resident while the human is on the table.<br>Yet!
		mayor pleasured It's not... Too surprising...! Considering...! Nghh~!
		t ?flag mayor meat; The sounds of some thick fluid splattering against something can be heard over the radio.
		t !flag mayor meat; The sounds of water spraying on hardwood can be heard over the radio.
		mayor ahegao Houghhh...<br>There's... Nothing to worry about...<br>We'll all be fine... Soon enough... 

		eval raiseTrust("mayor", 1);
		trans cancel; Finish
	`,},
	{index: `mayorMorning-4`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor excited G-good morning Syrup Town! It's time again for the morning mailbox~! Today's another anonymous writer, let's hear what she has to say!
		mayor special secret; "Ever since the human arrived, I can't stop thinking about them. It's seriously impacting my daily life, I have less time in the day since I'm so hor"-
		mayor shock Wah!<br><i>So vivid! I grabbed an early draft by accident, I thought I threw this one away! Control yourself mayorF, keep it together!</i>
		mayor worried W-well, I'd just like to let everyone know this is an entirely normal effect of the human pheromones. I think. To be honest I'm not sure about the extent to which it's become an issue for m- <b>you</b>.<br> My fellow townsfolk, it seems like this writer could use some reassurance. How are you all holding up with the new human in town?  

		eval raiseTrust("mayor", 1);
		trans cancel; Finish
	`,},
	{index: `mayorMorning-5`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town.
		eval writeEvent("mayorMorning-5"); 

		eval raiseTrust("mayor", 1);
		trans cancel; Finish
	`,},
	{index: `mayorMorning-6`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		mayor excited H-hello everyone. Good morning. Morning mailbox, I mean.<br>I've been doing some research lately and I found a few interesting tidbits. <br>There isn't much to go off, but as it turns out there are a few fringe papers on human anatomy I dismissed before for being a bit... Skewed.
		mayor sleep They are from very suspicious sources, so take them with a grain of salt, but there are a few accounts of animal folks living in human society claiming things like "human pheronones are an aphrodisiac and narcotic in one!"
		mayor excited It may seem a bit alarming, but it's nothing to worry about. Every source I watched... Repeatedly... Made it very clear that folks who interact with humans always live happy and fulfilling lives. <br>If you start feeling butterflies in your stomach, a sudden change in your daily routines, or a very strong desire to be impregnated by the human, that's totally normal, even for males. <br>While you can't actually become pregnant, just the act of trying will...
		mayor torogao Ghh~
		mayor excited Where was I? Oh, right. Well, it's not worth worrying about. Eventually so many of us will become inundated with the pheromones that we'll get used to it. <br>A few sources say it's like a non-addictive... Hold on, I wrote it down...
		mayor worried Meth... Am... Pet a me? Pet a meen? Apparently it's some kind of medicine for humans that also happens to make people happy. <br>Anyways, um...
		mayor excited Just... Enjoy each day as it cums. Okay? I'll be taking a short break from the morning mailbox. Please feel free to keep sharing stories will me though. Okay, bye~ 

		eval raiseTrust("mayor", 1);
		trans cancel; Finish
	`,},
	{index: `mayorMorning-7`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town. As the sun rises, radio waves float through the air just as lazily as the clouds.
		carpenter mayorF...? Hellooo...?
		mayor torogao Ghh, nggh~! Busy~!
		carpenter I'll just be a moment...
		mayor ahegao W-what is it?
		carpenter I just need you to sign something for me... On the patch job for the bridge railing...?
		mayor excited R-right... Yeah... Do you have a pen? Wait, I have one...
		carpenter mayorF, would you care for some advice?
		mayor Hmm?
		carpenter Masturbation really doesn't help at all. At least for me... It's best not to excite yourself if you want to stay in control.
		mayor shock Eh?! What g-gives you...<br>Oh... It smells in here, doesn't it?
		carpenter Have you gone nose blind? It's honestly more powerful than the human's...
		mayor Really?!
		carpenter No.
		mayor worried Oh. Well, I appreciate the advice. You're absolutely correct. I'm ashamed to admit it, but I've been slipping on my duties lately...
		carpenter Maybe you should just give in? I don't hold myself back or anything, knowing I can ask playerF to mate whenever I want kinda makes my body... Chiller.
		mayor Maybe this is all self imposed. I might be driving myself insane by denying myself of... *Him.<br>But I feel like if I let go, I'll never go back again...
		carpenter Oh, definitely. If it weren't such a hassle, I'd beg *him to marry me, but then I'd be spending so much time on sex that I'd have less time to sleep.
		mayor torogao Nghh~! You're not being helpful! Some of us have addictive personalities, you... Bedhead!
		carpenter sleep True, true. Maybe if you deny yourself long enough you'll pass through it? There's a saying called 'missing the bus', where if you stay awake long enough you stop feeling sleepy.
		mayor excited carpenterF, you're a <i>joy</i> to be around, but is there anything else you need?
		carpenter sparkle Hmm... Now that you mention it, Squids Make Inc. could use a bit of extra muns in the budget this period. 
		mayor torogao Fine, fine! Whatever, just go!
		carpenter happy Haha~<br>You're the best mayorF. 
	 

		eval raiseTrust("mayor", 1);
		trans cancel; Finish
	`,},
	{index: `mayorMorning-8`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town.
	eval writeEvent("mayorMorning-8"); 
	eval raiseTrust("mayor", 1);
	trans cancel; Finish
	`,},
	{index: `mayorMorning-9`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town.
	eval writeEvent("mayorMorning-9"); 
	eval raiseTrust("mayor", 1);
	trans cancel; Finish
	`,},
	{index: `nightmare`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		player tired Mmmgh... Huh?
		mayor mocking There's no escape!
		im mayor/nightmareSEX
		mayor You're getting a job here, there's no escaping it!
		player scared H-huh?! Me?! Work a nine-to five?!<br>NOOOOOO-!
		t *Thud*
		t You rub your head gently as you wake up from a horrible nightmare.
		player cry Oh... Thank goodness... Just a dream.
		finish
	`,},
	{index: `hot-1`,
		content: `
			t It's a brand new day in syrup town...
			t And it's an absolute scorcher!
			im hot1
			mayor tired Mmmgh...<br>Is the air conditioner broken?<br>Or...
			trans cancel; Finish
		`
	},
	{index: `bath-1`,
		content: `
			mayor sleep Don't think about it don't think about it...
			im bath1SEX
			mayor pent You are strong. You are the one in the driver's seat.<br>Just let it squirt, let it beg for your attention, you've got things to do today, mayorF.
			trans cancel; Finish
		`
	},
	{index: `morningSilly`,
	content: `
		mayor tired Alright, so carpenterF signed off on the pipe layout...<br>And we're under budget too, that's good...<br>I think I might have finished all my tasks for the-
		mayor confused ... Hmm? Did I miss this letter? Everyone lives less than ten minutes away by foot, no one in town would bother writing...
		t "Dear mayorF"
		mayor angry Ugh, it's... <i>Her</i> again...
		t "I hope you're in good health. I heard from a friend of a friend that you've gone into heat."
		mayor angry Mrgrgr... Which traitor leaked that...?
		t "Well, I know you're the responsible sort, but I just thought I'd send you a very special gift just in case things go a little too well with your newest resident. I know you can be proud sometimes too, so maybe you were too embarrassed to buy one yourself. And that's okay! We all have our flaws, except for <i>our</i> town's mayor, of course."
		mayor fury GRAAAAH! Stuck up, taunting, shitty blonde bitch! I know your mayor's a damn human, you've only rubbed my nose in it a hundred times!
		mayor tired ... Ah, I tore it to shreds.<br>Well, whatever, hearing more of her voice in my head would ruin the rest of my day anyways.
		mayor angry And I see right through her stupid game. She's taunting me with things I don't know about the way humans live...<br>And I bet she thinks I'm too stupid to know what this is!
		im morningSilly1-1
		mayor annoyed Hmph! "Too embarrassed to ask". I'm not a child, this is obviously some kind of candy!
		finish
		eval unencounter("mayor")
	`,},
	{index: `assple-2Start`,
	content: `
		eval writeScene("system", "assple-2Start");
		eval unencounter("mayor")
	`,},
	{index: `assple-3`,
	content: `
		eval writeScene("system", "assple-3");
		eval unencounter("mayor")
	`,},


	//System things
	{index: `chMunsToggle`,
	content: `
		eval diagnostic('cash money');
	`,},
	{index: `chLimitToggle`,
	content: `
		eval diagnostic('unlimited');
	`,},
	{index: `chEventsToggle`,
	content: `
		eval diagnostic('pool noodle');
	`,},
	{index: `chCollectToggle`,
	content: `
		eval diagnostic('even the funko pops');
	`,},
	{index: `chOutfitsToggle`,
	content: `
		eval diagnostic('passion for fashion');
	`,},
	{index: `chCostumesToggle`,
	content: `
		eval diagnostic('free the fur');
	`,},
	{index: `chGenderToggle`,
	content: `
		eval diagnostic('jiggly bits');
	`,},
	{index: `chSexToggle`,
	content: `
		toggleflag mayor; meat
		toggleflag mayor; veggie
		eval diagnostic('sex em up');
	`,},
	{index: `chLogbookToggle`,
	content: `
		eval diagnostic('note taker');
	`,},
	{index: `chGPSToggle`,
	content: `
		eval diagnostic('find mii');
	`,},
	{index: `chName`,
	content: `
		eval diagnostic('new name');
	`,},
	{index: `chVeggieToggle`,
	content: `
		eval diagnostic('vegetarian');
	`,},
	{index: `chMeatToggle`,
	content: `
		eval diagnostic('carnivore');
	`,},
	{index: `chUwUToggle`,
	content: `
		eval diagnostic('oowoo');
	`,},
	{index: `chEggToggle`,
	content: `
		eval diagnostic('egg');
	`,},
	{index: `chPronounsToggle`,
	content: `
		eval diagnostic('fucking pronouns');
	`,},
	{index: `chRoseToggle`,
	content: `
		eval diagnostic('rosebud');
	`,},
	{index: `veganEnding`,
	content: `
		player sleep ... Goodbye.
		mayor worried Hmm? playerF?<br>What's with that strange look on your face?<br>Was there something about those packages?
		player ...
		mayor happy Well, if everything's alright, it's fine.<br>Take care!<br>I wonder what was in those... "Vegetarian"? "Carnivore"? Well, I won't pry.
		t ...
		t It's been who knows how long since that day.
		mayor shock ...!!!
		t Since the human suddenly vanished.
		im misc/vegan1
		t "Hey mayorF, sorry if this sounds sudden, but...
		t I don't really wanna be horny anymore.
		t I met a new friend and we've bonded over fishing, grilling, and garlic bread!
		t We made enough from the last haul to pay off my debt, so...
		t I'll be staying out here in the far countryside!
		t Hope you can find a new human to help with your pheromone issue.
		t XOXO - playerF"
		eval writeBig("misc/vegan2Background", "player:20-16-0.35#expression:sparkle#overlay:misc/vegan2Overlaypng#")
		button The End; writeScene('system', 'start');
	`,},
	{index: `cancel`,
	content: `
		eval unencounter(data.player.currentCharacter);
		eval changeLocation(data.player.location);
	`,},
]

function mayorQuo() {
	/*
	var sceneTarget = "";
	switch (checkTrust("mayor")) {
		default: {
		}
	}
	if (sceneTarget == "") {
		if (data.player.mayorSmall == null) {
			data.player.mayorSmall = 0;
		}
		var mayorSmallArray = [
			`mayor Oh, how nice to see you again. shopF told me they explained everything to you.<br>So, just dropping by for a visit?
			player Well, first, you seem different from last time. Everything alright?
			mayor Yes, I'm on some medication that masks the effects of your... Well, the effects of you.<br>It only masks them though, so let's maybe not test their limits. 
			player Sounds-
			mayor Actually, they don't stop the urges, they just make me strong enough not to act on them. I have a town to manage, it'd be irresponsible of me to spend all my time huffing people.
			player frown You take that back right now.<br>Huffing folks is the most responsible thing anyone can ever do.
			mayor worried Err... Alright.
			mayor shock Oh! I forgot to mention. My office handles all the mail from outside the town, so if you're expecting anything, please let me know.
			mayor happy If you know the special postal code for it, I can have it for you in no time at all!
			player happy Postal codes? Where would I find those?
			mayor worried ... You wouldn't. If you don't already have them, you won't get them, that's how the mail works.
			mayor happy But you should already have everything you need to live a happy life here in Syrup Town, so dealing with the mail should be totally optional, right?
			player Right, right. I'll keep that in mind.
			mayor So, did you need something?`,
			`mayor So, how is your new home treating you?
			player sparkle It's like a dream! Clean, spacious, and I don't even need to take care of the yard!
			mayor Ah, yes, the city's gardener handles all of the outdoor tidying.
			player happy That's good, I've been banned from using lawnmowers. The judge said I had a habit of treating them like 'go-karts with teeth'.
			mayor worried ... I see. I'll keep that in mind.<br>Anyways, did you need something?`,

			`mayor So, how are you enjoying your time in the town? 
			player It's great! Way better than the big city, I haven't seen a single robotic hyena pack roaming the streets hunting for flesh!
			mayor worried ... I see. Do let me know if you spot one of those.<br>Anyways, did you need something?`,

			`mayor Have you seen carpenterF's latest work on the plaza's sidewalk?
			player No, I didn't notice anything different about it.
			mayor Exactly! It blends in perfectly.
			player Ah, I gotcha! Good quality is usually the lack of mistakes, but a bad job is one where mistakes are visible, right?
			mayor sparkle Exactly!
			player It's like how if a psychopath wants to blend in, they stay quiet! Being memorable in a good way still makes you stand out.
			mayor worried ... Yes, I suppose that's an... Accurate comparison.<br>Anyways, did you need something?`,

			`mayor Have you heard? Sales at Ivy & Oak are massively up lately. Maybe we should diversify, I could have a second general store built... Hmm...
			player Well, if you need someone to run it, I'm something of a businessman myself.
			mayor Oh?
			player Yeah, although I can't legally handle chainsaws. Or firearms. Or sell beverages after dark. Oh, and all of my references will tell you not to let me near anything with moving parts.
			mayor worried ... You know, maybe I'll just expand the store we already have instead.<br>Anyways, did you need something?`,

			`mayor Our resident fashion expert has been talking about you, you know. She thinks you could be the key to the next big fashion trend.
			player Ooh, really?
			mayor Yes! In fact, I've considered distributing free pants to the townsfolk, maybe-
			player angry Don't you dare.
			mayor shock ...? <br>Okay, no pants then. It's not a big deal I suppose. <br>Anyways, did you need something?`,

			`mayor worried You're not in trouble, but one of the townsfolk tried to lodge a complaint against you for 'sauntering in a barbaric manner'. I don't suppose you were 'wandering with eyes clearly full of degenerate lust' yesterday?
			player worried ...
			mayor worried ... 'Clearly intending on raping some poor naive soul with your'-
			player happy Oh, no. I wouldn't do that.
			mayor happy Good, good. I'll try to ask her to relax, she has a strange way of expressing herself sometimes, nobody here means you any harm. Keep up the good... Um, keep up the 'not raping anyone' thing, even if you're emitting those pheromones, consent is important.<br>Anyways, did you need something?`,

			`mayor One of the town's gardening staff was asking about you, she says you have a lovely smile.
			player D'aww, how nice!
			mayor worried She had a... Few other choice notes, but I'll leave those aside. Quick question, is human sperm good for plants?
			player No, the salt content's too high.
			mayor happy I see, I see, that was her only question I didn't know, thank you...
			player Yeah I've tried on a few dozen species, it turns out really bad. Nutting on the leaves is a death sentence too. Urine on the other-
			mayor shock Lovely! Thank you, thank you. Oh, how rude of me, you must have come here for a reason and I'm just asking you what I'm sure is basic biology. <br>Anyways, did you need something?`,

			`mayor Our resident nun has become quite taken with you. She's something of a human supremacist, actually.
			player frown How could a human be superior to animal folks? Our hair doesn't smell nearly as good as your fur.
			mayor shock ... That's the main reason you aren't buying into it? Oh well, if you could maybe ask her to tone down... Hmm, I guess she'd just think even more of you because of your humility...
			player happy Don't worry, I have a lot of experience with dangerous cults, I can steer things back to normal if it gets out of hand.
			mayor worried Thank... You?<br>Anyways, did you need something?`,

			`mayor Oh, it's you! I have a quick question about those pants.
			player You can't have them, sorry.
			mayor Really? ... Er, no! No, that's not what I was asking.<br>We have another resident who lived with humans for a short time, so I asked how we could make things more accommodating. <br>Like if maybe we should cover ourselves up a bit more, I know humans generally-
			player angry No. Absolutely not.
			mayor worried You seem to dislike them, but you arrived here-
			player worried These aren't a fashion statement, they're to protect all of you.
			mayor worried ... Okay, you've lost me.
			player happy You want my pheromones, right? Well, some parts of my body emit more than anywhere else.
			mayor shock Oh... Oh! Oh, I see.<br>I hadn't realized you wearing pants was a kindness to us. Thank you.<br>Anyways, did you need something?`,

			`mayor worried Hello again.<br>Unfortunately I'm a bit preoccupied trying to manage unemployment today.
			player worried Oh? I hadn't noticed any homeless folks around.
			mayor ... Homeless? No, we house our residents for free. All our townwork is voluntary to help ourselves grow and help the community.
			player happy So what's up, you short on manpower?
			mayor happy Just the opposite actually, I need to find things to keep everyone occupied, otherwise some residents will just nap all day.
			player frown Folks are out there napping all day yet I'm still out here trying to pay off my massive debt...
			mayor ... You know you don't actually need to pay that? Just get married and it'll-
			player angry Even here I'm still a wagie despite living in a post-money world...
			mayor worried I... I have no idea what a 'wagie' is, but you have my condolences, I think?<br>Anyways, did you need something?`,

			`mayor sparkle Hmm hmm hmm~<br>A friend and her daughter dropped by earlier, they were quite interested in learning more about humans. Soon our town will be a bustling cultural center!
			player Sounds like I should pay them a visit. You're talking about the deer, right? Not a lot of kids around here.
			mayor happy That's what you're here to fix. And doeF isn't a kid, her mother is just... Well, doeF isn't in a hurry to become independent, and mommyF's rare situation means she's still in her maternal phase.<br>Continuing to treat her daughter like a child.
			player worried I mean, isn't 'child' kind of a nebulous term?
			mayor shock ... No? No it isn't, it's a very strict legal definition. playerF, please don't tell me-
			player happy Nah, I'm just messing with you!
			mayor happy Oh thank goodness. I thought you might have been one of... <i>Those types</i>.<br>Anyways, did you need something?`,

			`mayor I received yet another suggestion on improving the town today, yet another 'we should all be nudists and live in the woods'. I swear, the 'nude life' faction seems like it's just one very determined soul sometimes.
			player You sound like you should be annoyed, but you look happy.
			mayor I'm a civil servant, playerF. I'm wearing a fake face.
			player Oh. Well, it's just you and me. You can tell me what's really on your mind if you want. What's behind that fake face?
			mayor happy ... 
			mayor excited <i>BREED BREED BREED PIN ME DOWN AND MATE WITH ME<br>Maybe if I forget the pill I'll snap nobody would blame me!<br>WANT PUPPIES GIVE ME THAT FAT COCK<br>I'm building a tolerance to the meds! Please please please leave so I can masturbate pleaseeee</i>
			mayor happy ... Nothing important.<br>Anyways, did you need something?`,

			`mayor excited Oh... You smell like sperm.
			player shock Eh?!
			mayor shock Ah! Sorry, no! I'm so sorry, that just slipped out.
			player worried No, it's my bad...
			mayor worried No, really. My nose is very sensitive, you could shower for hours and I'm probably still pick it up. I might even be smelling it from those huge cum factories in your pants right now.
			player Uh...
			mayor shock ... Okaaay! On an unrelated note, I'll be boosting my medication dosage soon.<br>Anyways, did you need something?`,

			`mayor happy Ah, playerF. Terrible timing, I was just about to furiously masturbate thinking about you.
			player shock Oh! I can come back later if you want.
			mayor shock N-no, it's totally fine! Sorry, I'm trying a new medication. 
			mayor happy This one lets me hold back my actions but keeps letting my thoughts slip out, like how I really wish I were at home so I could break out my biggest, nubbed-<br>And I have to keep catching myself so that I don't slip up.
			player worried Do you need any help?
			mayor happy I do.
			mayor shock N-not! I do not need any help to cum so hard I spray across the room I want to have puppies I-<br>I! Am a professional! And I may crack someday and I really really hope-<br>But it isn't today!
			player happy Alright. If you change your mind I'm available.
			mayor excited That's very sweet of youuuu STUD, ngh-<br>B-but I have my own aspirations and goals. And if I relax and slip those aspirations turn into 'please make me into your cocksleeve plleEEEEASE'-<br>Although I have accepted it's going to happen eventually.
			player Haha, no rush! I'm enjoying having a slow life here in town.
			mayor G-good, very good. I'll have some different medications soon so I won't need to be talking about how if I grabbed my nipples right now I'd probably arch by back so hard cumming I'd knock my chair over.<br>A-anyways, did you need something?`,

			`mayor excited Oh... O-one second.
			t She rummages through her desk, grabbing a roll of 'Fur-Safe Tape', with a picture of a very enthusiastic cat mummy on the logo, before she takes a strip and covers her mouth.
			mayor Hm, hm hh hmm uu?
			player worried New meds haven't arrived yet?
			mayor Mm-mm.
			player happy I don't mind if you say those kinda things when I visit. You know that, right?
			mayor Mmm.
			player worried Oh, does the dirty talking actually make it rougher for you? I'd imagine saying stuff like that would just feed into the heat.
			mayor Mm-hmm!
			player Ah, gotcha.
			mayor Mmm, mmm hmm mm...<br>Mrr...
			t *Peeeeeel*
			mayor frown Ah, that stuff tastes awful!
			player shock You were licking it?
			mayor excited It's really hard not to lick anything when I'm looking at you.<br>... Hmm. If I just word the lust into my words in the form of innuendos...
			player happy That's a great idea, and I'm so oblivious I probably won't notice.
			mayor sparkle And I'll keep my dignity intact without saying I want you to pin me down right here on my desk and impregnate me on the spot!
			player worried Uh...
			mayor worried Oh... I just realized I don't actually know very many innuendos.<br>Anyways, did you need something?`,

			`mayor Ah, playerF! I'm on new meds and the naughty thoughts are safely where they should be.<br>Repressed.
			player worried I'm not sure that's healthy.
			mayor I have thoughts like that too. Also repressed.
			player But if we repress our lust and our worries, where will we fit all our childhood traumas?
			mayor worried ... I should invest in a town therapist.
			player happy They'd probably just tell you to accept the heat.
			mayor happy Good point. Clearly therapy would be a mistake.<br>Anyways, did you need something?`,

			`mayor Ah, it's another beautiful morning, and my head is completely empty. No thoughts, zen.
			player That's great to hear! Is your heat over? Is it a 'use it or lose it' sort of deal?
			mayor Hmm. Here, let me check.
			t mayorF takes a slow, deep breath.
			mayor excited Nope! Nope nope nope, just got used to it like a white noise, haha!<br>Anyways, did you need something?`,
		];
		if (data.player.mayorSmall >= 13 && checkTrust("mayor") < 2) {
			setTrust("mayor", 2);
		}
		if (mayorSmallArray[data.player.mayorSmall] != null) {
			writeHTML(mayorSmallArray[data.player.mayorSmall]);
			data.player.mayorSmall++;
		}
		else {
			writeHTML(`
				mayor excited ...
				player ... Hello mayorF.
				mayor excited Hi! Hi hi hi. How can I help you?
				player worried <i>I should probably not bother her too much...</i>
			`);
		}
		writeHTML(`trans cancel; Finish`)
	}
	*/
	mayorNewQuo();
}

function mayorNewQuo() {
	var mayorQuoArray = [
		{index: "backup", priority: 0, unique: false, requirements: "?flag player god;", content: `
			mayor excited ...
			player ... Hello mayorF.
			mayor excited Hi! Hi hi hi. How can I help you?
			player worried <i>I should probably not bother her too much...Maybe I'll come back again later.</i>
		`,},
		{index: "intro1", priority: 12, unique: true, requirements: "", content: `
			mayor sparkle Oh, how nice to see you again. shopF told me they explained everything to you.<br>So, just dropping by for a visit?
			player happy Well, first, you seem different from last time. Everything alright?
			mayor happy Yes, I'm on some medication that masks the effects of your... Well, the effects of you.<br>It only masks them though, so let's maybe not test their limits. 
			player worried Sounds-
			mayor happy Actually, they don't stop the urges, they just make me strong enough not to act on them. I have a town to manage, it'd be irresponsible of me to spend all my time huffing people.
			player frown You take that back right now.<br>Huffing folks is the most responsible thing anyone can ever do.
			mayor worried Err... Alright.
			mayor shock Oh! I forgot to mention. My office handles all the mail from outside the town, so if you're expecting anything, please let me know.
			mayor happy If you know the special postal code for it, I can have it for you in no time at all!
			player happy Postal codes? Where would I find those?
			mayor worried ... You wouldn't. If you don't already have them, you won't get them, that's how the mail works.
			mayor happy But you should already have everything you need to live a happy life here in Syrup Town, so dealing with the mail should be totally optional, right?
			player Right, right. I'll keep that in mind.
			mayor So, did you need something?
			
		`,},
		{index: "intro2", priority: 11, unique: true, requirements: "", content: `
			mayor So, how is your new home treating you?
			player sparkle It's like a dream! Clean, spacious, and I don't even need to take care of the yard!
			player happy Plus, I've been writing down small goals for myself.
			mayor That's lovely to hear. Having a plan helps keep things in order.
			special Your trophies list is a helpful collection of goals! If you're ever stuck or lost on what to do, check the list!
			mayor Ah, yes, the city's gardener handles all of the outdoor tidying.
			player happy That's good, I've been banned from using lawnmowers. The judge said I had a habit of treating them like 'go-karts with teeth'.
			mayor worried ... I see. I'll keep that in mind.<br>Anyways, did you need something?
			
		`,},
		{index: "intro3", priority: 10, unique: true, requirements: "", content: `
			mayor I received yet another suggestion on improving the town today, yet another 'we should all be nudists and live in the woods'. I swear, the 'nude life' faction seems like it's just one very determined soul sometimes.
			player You sound like you should be annoyed, but you look happy.
			mayor I'm a civil servant, playerF. I'm wearing a fake face.
			player Oh. Well, it's just you and me. You can tell me what's really on your mind if you want. What's behind that fake face?
			mayor happy ... 
			mayor excited <i>BREED BREED BREED PIN ME DOWN AND MATE WITH ME<br>Maybe if I forget the pill I'll snap nobody would blame me!<br>WANT PUPPIES GIVE ME THAT FAT COCK<br>I'm building a tolerance to the meds! Please please please leave so I can masturbate pleaseeee</i>
			mayor happy ... Nothing important.<br>Anyways, did you need something?
			eval mayorTrustFunction();
			
		`,},
		{index: "safeWagie", priority: 2, unique: false, requirements: "?flag mayor safe;", content: `
			mayor worried Hello again.<br>Unfortunately I'm a bit preoccupied trying to manage unemployment today.
			player worried Oh? I hadn't noticed any homeless folks around.
			mayor ... Homeless? No, we house our residents for free. All our townwork is voluntary to help ourselves grow and help the community.
			player happy So what's up, you short on manpower?
			mayor happy Just the opposite actually, I need to find things to keep everyone occupied, otherwise some residents will just nap all day.
			player frown Folks are out there napping all day yet I'm still out here trying to pay off my massive debt...
			mayor ... You know you don't actually need to pay that? Just get married and it'll-
			player angry Even here I'm still a wagie despite living in a post-money world...
			mayor worried I... I have no idea what a 'wagie' is, but you have my condolences, I think?<br>Anyways, did you need something?
			
		`,},
		{index: "safeCarp", priority: 2, unique: false, requirements: "?flag mayor safe;", content: `
			mayor happy Have you seen carpenterF's latest work on the plaza's sidewalk?
			player No, I didn't notice anything different about it.
			mayor Exactly! It blends in perfectly.
			player Ah, I gotcha! Good quality is usually the lack of mistakes, but a bad job is one where mistakes are visible, right?
			mayor sparkle Exactly!
			player It's like how if a psychopath wants to blend in, they stay quiet! Being memorable in a good way still makes you stand out.
			mayor worried ... Yes, I suppose that's an... Accurate comparison.<br>Anyways, did you need something?
			
		`,},
		{index: "safeShop", priority: 2, unique: false, requirements: "?flag mayor safe;", content: `
			mayor Have you heard? Sales at Ivy & Oak are massively up lately. Maybe we should diversify, I could have a second general store built... Hmm...
			player Well, if you need someone to run it, I'm something of a businessman myself.
			mayor Oh?
			player Yeah, although I can't legally handle chainsaws. Or firearms. Or sell beverages after dark. Oh, and all of my references will tell you not to let me near anything with moving parts.
			mayor worried ... You know, maybe I'll just expand the store we already have instead.<br>Anyways, did you need something?
			
		`,},
		{index: "safeWolf", priority: 2, unique: false, requirements: "?flag mayor safe;", content: `
			mayor Our resident fashion expert has been talking about you, you know. She thinks you could be the key to the next big fashion trend.
			player Ooh, really?
			mayor Yes! In fact, I've considered distributing free pants to the townsfolk, maybe-
			player angry Don't you dare.
			mayor shock ...? <br>Okay, no pants then. It's not a big deal I suppose. <br>Anyways, did you need something?
			
		`,},
		{index: "safeSado", priority: 2, unique: false, requirements: "?flag mayor safe;", content: `
			mayor worried You're not in trouble, but one of the townsfolk tried to lodge a complaint against you for 'sauntering in a barbaric manner'. I don't suppose you were 'wandering with eyes clearly full of degenerate lust' yesterday?
			player worried ...
			mayor worried ... 'Clearly intending on raping some poor naive soul with your'-
			player happy Oh, no. I wouldn't do that.
			mayor happy Good, good. I'll try to ask her to relax, she has a strange way of expressing herself sometimes, nobody here means you any harm. Keep up the good... Um, keep up the 'not raping anyone' thing, even if you're emitting those pheromones, consent is important.<br>Anyways, did you need something?
			
		`,},
		{index: "safeMilf", priority: 2, unique: false, requirements: "?flag mayor safe;", content: `
			mayor One of the town's gardening staff was asking about you, she says you have a lovely smile.
			player D'aww, how nice!
			mayor worried She had a... Few other choice notes, but I'll leave those aside. Quick question, is human sperm good for plants?
			player No, the salt content's too high.
			mayor happy I see, I see, that was her only question I didn't know, thank you...
			player Yeah I've tried on a few dozen species, it turns out really bad. Nutting on the leaves is a death sentence too. Urine on the other-
			mayor shock Lovely! Thank you, thank you. Oh, how rude of me, you must have come here for a reason and I'm just asking you what I'm sure is basic biology. <br>Anyways, did you need something?
			
		`,},
		{index: "safeNun", priority: 2, unique: false, requirements: "?flag mayor safe;", content: `
			mayor Our resident nun has become quite taken with you. She's something of a human supremacist, actually.
			player frown How could a human be superior to animal folks? Our hair doesn't smell nearly as good as your fur.
			mayor shock ... That's the main reason you aren't buying into it? Oh well, if you could maybe ask her to tone down... Hmm, I guess she'd just think even more of you because of your humility...
			player happy Don't worry, I have a lot of experience with dangerous cults, I can steer things back to normal if it gets out of hand.
			mayor worried Thank... You?<br>Anyways, did you need something?
			
		`,},
		{index: "safeMesu", priority: 2, unique: false, requirements: "?flag mayor safe;", content: `
			mayor Oh, it's you! I have a quick question about those pants.
			player You can't have them, sorry.
			mayor Really? ... Er, no! No, that's not what I was asking.<br>We have another resident who lived with humans for a short time, so I asked how we could make things more accommodating. <br>Like if maybe we should cover ourselves up a bit more, I know humans generally-
			player angry No. Absolutely not.
			mayor worried You seem to dislike them, but you arrived here-
			player worried These aren't a fashion statement, they're to protect all of you.
			mayor worried ... Okay, you've lost me.
			player happy You want my pheromones, right? Well, some parts of my body emit more than anywhere else.
			mayor shock Oh... Oh! Oh, I see.<br>I hadn't realized you wearing pants was a kindness to us. Thank you.<br>Anyways, did you need something?
			
		`,},
		{index: "safeDoe", priority: 1, unique: false, requirements: "?flag mayor safe;", content: `
			mayor sparkle Hmm hmm hmm~<br>A friend and her daughter dropped by earlier, they were quite interested in learning more about humans. Soon our town will be a bustling cultural center!
			player Sounds like I should pay them a visit. You're talking about the deer, right? Not a lot of kids around here.
			mayor happy That's what you're here to fix. And doeF isn't a kid, her mother is just... Well, doeF isn't in a hurry to become independent, and mommyF's rare situation means she's still in her maternal phase.<br>Continuing to treat her daughter like a child.
			player worried I mean, isn't 'child' kind of a nebulous term?
			mayor shock ... No? No it isn't, it's a very strict legal definition. playerF, please don't tell me-
			player happy Nah, I'm just messing with you!
			mayor happy Oh thank goodness. I thought you might have been one of... <i>Those types</i>.<br>Anyways, did you need something?
			
		`,},
		
		{index: "pent1", priority: 5, unique: false, requirements: "?flag mayor horny;", content: `
			mayor excited Oh... You smell like sperm.
			player shock Eh?!
			mayor shock Ah! Sorry, no! I'm so sorry, that just slipped out.
			player worried No, it's my bad...
			mayor worried No, really. My nose is very sensitive, you could shower for hours and I'd probably still pick it up. I might even be smelling it from those huge cum factories in your pants right now.
			player Uh...
			mayor shock ... Okaaay! On an unrelated note, I'll be boosting my medication dosage soon.<br>Anyways, did you need something?
			
		`,},
		{index: "pent2", priority: 4, unique: false, requirements: "?flag mayor horny;", content: `
			mayor happy Ah, playerF. Terrible timing, I was just about to furiously masturbate thinking about you.
			player shock Oh! I can come back later if you want.
			mayor shock N-no, it's totally fine! Sorry, I'm trying a new medication. 
			mayor happy This one lets me hold back my actions but keeps letting my thoughts slip out, like how I really wish I were at home so I could break out my biggest, nubbed-<br>And I have to keep catching myself so that I don't slip up.
			player worried Do you need any help?
			mayor happy I do.
			mayor shock N-not! I do not need any help to cum so hard I spray across the room I want to have puppies I-<br>I! Am a professional! And I may crack someday and I really really hope-<br>But it isn't today!
			player happy Alright. If you change your mind I'm available.
			mayor excited That's very sweet of youuuu STUD, ngh-<br>B-but I have my own aspirations and goals. And if I relax and slip those aspirations turn into 'please make me into your cocksleeve plleEEEEASE'-<br>Although I have accepted it's going to happen eventually.
			player Haha, no rush! I'm enjoying having a slow life here in town.
			mayor G-good, very good. I'll have some different medications soon so I won't need to be talking about how if I grabbed my nipples right now I'd probably arch by back so hard cumming I'd knock my chair over.<br>A-anyways, did you need something?
			
		`,},
		{index: "pent3", priority: 3, unique: false, requirements: "?flag mayor horny;", content: `
			mayor excited Oh... O-one second.
			t She rummages through her desk, grabbing a roll of 'Fur-Safe Tape', with a picture of a very enthusiastic cat mummy on the logo, before she takes a strip and covers her mouth.
			mayor Hm, hm hh hmm uu?
			player worried New meds haven't arrived yet?
			mayor Mm-mm.
			player happy I don't mind if you say those kinda things when I visit. You know that, right?
			mayor Mmm.
			player worried Oh, does the dirty talking actually make it rougher for you? I'd imagine saying stuff like that would just feed into the heat.
			mayor Mm-hmm!
			player Ah, gotcha.
			mayor Mmm, mmm hmm mm...<br>Mrr...
			t *Peeeeeel*
			mayor frown Ah, that stuff tastes awful!
			player shock You were licking it?
			mayor excited It's really hard not to lick anything when I'm looking at you.<br>... Hmm. If I just word the lust into my words in the form of innuendos...
			player happy That's a great idea, and I'm so oblivious I probably won't notice.
			mayor sparkle And I'll keep my dignity intact without saying I want you to pin me down right here on my desk and impregnate me on the spot!
			player worried Uh...
			mayor worried Oh... I just realized I don't actually know very many innuendos.<br>Anyways, did you need something?
			
		`,},
		{index: "pent4", priority: 2, unique: false, requirements: "?flag mayor horny;", content: `
			mayor Ah, playerF! I'm on new meds and the naughty thoughts are safely where they should be.<br>Repressed.
			player worried I'm not sure that's healthy.
			mayor I have thoughts like that too. Also repressed.
			player But if we repress our lust and our worries, where will we fit all our childhood traumas?
			mayor worried ... I should invest in a town therapist.
			player happy They'd probably just tell you to accept the heat.
			mayor happy Good point. Clearly therapy would be a mistake.<br>Anyways, did you need something?
			
		`,},
		{index: "pent5", priority: 1, unique: false, requirements: "?flag mayor horny;", content: `
			mayor Ah, it's another beautiful morning, and my head is completely empty. No thoughts, zen.
			player That's great to hear! Is your heat over? Is it a 'use it or lose it' sort of deal?
			mayor Hmm. Here, let me check.
			t mayorF takes a slow, deep breath.
			mayor excited Nope! Nope nope nope, just got used to it like a white noise, haha!<br>Anyways, did you need something?
			
		`,},
		
		{index: "safe1", priority: 5, unique: true, requirements: "?flag mayor pounce; ?flag mayor safe;", content: `
			mayor sparkle playerF!
			im safe1
			player sparkle Whoa, you look great today!
			mayor I am, I am!
			mayor sleep Ah, to be thinking with my brain again~<br>There's so much to do, and I can actually do it now!
			mayor happy Let's see. That plumbing infrastructure estimate should be here already...<br>And it's never too early to start Crimbus preparations...
			mayor worried And... I'll need to re-request these papers, I must have mistook them for tissues... And...
			mayor shock Wah! So much to do!
			player sleep I'll let you get to it then. Good luck.
			mayor happy Thank you. And let me know if you need anything.
		`,},
		{index: "safe2", priority: 4, unique: false, requirements: "?flag mayor pounce; ?flag mayor safe;", content: `
			mayor sleep Ah, to have a quiet mind again~
			mayor sparkle playerF~! Perfect timing.
			player happy You sure are energetic today.
			mayor sleep Hmhm, naturally. My beaming smiling is how I was elected, of course.
			mayor happy ... What was I just thinking about?<br>Oh well, it probably wasn't important.<br>Did you need something?
		`,},
		{index: "safe3", priority: 3, unique: false, requirements: "?flag mayor pounce; ?flag mayor safe;", content: `
			mayor worried Hmm, posters, naturally... But-
			mayor shock Wah!<br>playerF!
			player worried Aww geez, did I walk in on you ma-
			mayor frown Absolutely not!<br>I am in full control of myself.
			mayor worried For now, at least. And thanks to you.
			mayor happy No, I was just thinking about my re-election campaign.<br>It's quite a ways away, but I don't want to be caught unprepared.
			player happy Is anyone else running?
			mayor Well, no one else has since I took office, but you never know!
			mayor worried Certainly at least a few folks out there must be frustrated at... Well, the state of me, recently.
			mayor sparkle But that's all the reason to start winning them back over now!<br>I'll be even better than my old self, just you wait!<br>And then...And then I'll finally win that "county's top mayor" award!
			mayor angry And I'll finally wipe that smug grin off that blonde shih tzu's face!<br>"Ooh, mayorF, did you hear our town has a human mayor now? Isn't that cool? You should totally visit sometime!"<br>Damn that topknot and her Goochy clothes and her fancy vacation resort and...
			mayor shock ...!<br>You, err... About what I just said...
			player sleep My lips are sealed.
			mayor happy You're a saint, playerF.<br>Was there something you needed, by the way?
		`,},
		{index: "safe4", priority: 3, unique: false, requirements: "?flag mayor pounce; ?flag mayor safe;", content: `
			mayor worried Hrm...
			player happy Everything alright?
			mayor Just... Pondering.<br>I was wondering how things would have been different if a different human had come to town.
			player shock ...!
			mayor shock Not like that!<br>No, I just didn't realize how much of an effect you'd have.
			mayor worried And if someone had come here with less... Meat, than you're packing.
			player sleep Ah, you're worried about them getting tackled by heat-frienzied townsfolk and gangraped into a barely-breathing cumdump?<br>Nah, I don't think that'd happen.
			player happy All the townsfolk here are, not to be rude, kinda quickshots.
			mayor worried A-about that... Gradually, we're supposed to acclimate to the heat and the lust should have less impact on our minds, but...<br>Our stamina should also be going up too. If that rises faster, there's a chance we could start to outlast you...
			player sparkle That sounds fun!
			mayor shock N-no it doesn't! What if one of us goes crazy and attacks you, leaves you a totally drained husk, and another one finds you before you have a chance to rest?!
			player sleep I'll be fiiiiine.<br>You can burn through the calories in my body...
			player frown But my love for fluffies burns eternal!
			mayor worried ... I should have had you sign a liability waiver...
		`,},
		{index: "safe5", priority: 3, unique: false, requirements: "?flag mayor pounce; ?flag mayor safe;", content: `
			mayor worried playerF, glad to see you. We should talk.
			player shock Uh oh...!
			mayor It's nothing too bad, just...<br>Well, you've been here a while and I was thinking. There's a chance some of the folks you spend time with here could get... Pregnant.
			player happy Sure, I know how sex works.
			mayor Right, right. The chances <i>in general</i> are extremely low. There are specific exceptions of course.<br>But most of the time human and animal folk crossbreeding has an extremely, extremely low chance of conception.<br>I just thought you might want to be prepared.
			player Extremely low, huh...?<br>What if, hypothetically, I stumbled onto something that boosted those odds?
			mayor shock Have you?!<br>You would tell me, I'd hope!
			player sleep Just a hypothetical.
			mayor worried ... Alright.<br>Anyways, can I help you with something?
		`,},
		{index: "safe6", priority: 3, unique: false, requirements: "?flag mayor pounce; ?flag mayor safe;", content: `
			player sparkle mayorF, mayorF!<br>Hey, hey, can civilians make requests for new laws?
			mayor sleep Let me stop you right there.<br>You're free to make any suggestion you like. But I'm not about to sign in a new law just because it'd be real cool or funny.
			player worried Aww...
			mayor worried Hah... What was it? Surely it was something ridiculous connected to some crazy story from your life in the big city, right?<br>Like, "we should make all the fish wear cool hats"?
			player shock ...!
			player sparkle That's an even better-
			mayor happy No. Now, can I help you with something else, playerF? Anything else?
			player frown Hmph. Horny mayorF would at least hear me out.
			mayor sleep Horny mayorF would be on the other side of this desk right now snorting the sweat off your balls.<br>She's not to be trusted with important policy.
		`,},
		
		{index: "horny1", priority: 9, unique: true, requirements: "?flag mayor pounce; ?flag mayor horny; !flag mayor busy;", content: `
			mayor tired Oh, playerF... Good afternoon...
			player happy Hiya!<br>Everything alright?
			mayor pent Just...<br>Starting to feel that fog rolling in again.<br>It feels like it's been barely any time at all.
			player joy I could help!
			mayor tired I appreciate the offer, but actually, I'd like to test out some methods of dealing with it myself, first.<br>It wouldn't do to have the town's mayor completely dependent on one citizen.<br>Especially since someday you might be married.
			player amused Well, if you really wanna drive yourself crazy again, I guess I can't stop you.<br>I'll brace myself for the next time you pin me down.
			mayor scared N-no! That won't happen again! I promise!
			eval addFlag("mayor", "busy");
		`,},
		{index: "horny2", priority: 8, unique: true, requirements: "?flag mayor pounce; ?flag mayor horny; !flag mayor busy;", content: `
			eval writeEvent("horny2");
			eval passTime();
			eval addFlag("mayor", "busy");
		`,},
		{index: "horny3", priority: 7, unique: true, requirements: "?flag mayor pounce; ?flag mayor horny; !flag mayor busy;", content: `
			eval writeEvent("horny3");
			eval passTime();
			eval addFlag("mayor", "busy");
		`,},
		{index: "horny4", priority: 6, unique: true, requirements: "?flag mayor pounce; ?flag mayor horny; !flag mayor busy; !flag mayor desperate;", content: `
			eval writeEvent("horny4");
			eval passTime();
			eval passTime();
			eval addFlag("mayor", "busy");
		`,},
		{index: "horny5", priority: 5, unique: true, requirements: "?flag mayor pounce; ?flag mayor horny; !flag mayor busy;", content: `
			player happy Hellooooo~<br>mayorF, are you-
			im horny5
			mayor pent Please help.<br>I can't think, I can't focus, I've broken my washing machine from overuse, I need your help.
			player confused Washing machine? I figured people here wouldn't have much tech stuff.
			mayor pent I imported it, but that's not important.<br>I'm at the end of my rope here, and... If it means I can still be mayor, I'll be anything else I need to be.<br>Your mistress, your fling, even your morning wood attendant...
			player joy What about my BFF?!
			mayor befuddled Y-yes?
			player star *Gasp*<br>Even... BFFs forever?
			mayor sad ... Sure. I won't even ask about the extra forever.<br>I just... I can't stomach the thought of attacking you again...
			player happy Fine, I'll ignore how heartlessly you've treated your buddy in your time of need.
			player frown On one condition.
			eval passTime();
			eval addFlag("mayor", "desperate");
		`,},
		{index: "horny6", priority: 4, unique: false, requirements: "?flag mayor pounce; ?flag mayor horny; ?flag mayor desperate;", content: `
			mayor pent ...
			mayor love Oh, playerF~! Perfect timing!
			player amused Need help again?<br>Well, I suppose I can lend a hand to a friend in need.
			eval addFlag("mayor", "repeatables");
		`,},
		{index: "hornyShop", priority: 3, unique: false, requirements: "?flag mayor pounce; ?flag mayor horny;", content: `
			mayor pent Hoh...<br>I swear, shopF's become incorrigible since you arrived.
			player shock Oh no! She's moving across continents?!<br>But who will I sell my fruit to?
			mayor befuddled ... "Intercontinental" doesn't even remotely sound like...<br>Nevermind. You're both messing with me.
			mayor pent I was buying something the other day... She talked about being bloated, and I knew something was off...
			mayor forced She was wearing anal beads, ones as thick as her fist!<br>She offered to show them to me, even!
			player sleep Yeah, she's pretty friendly like that.<br>What color were they?
			mayor pent Re-
			mayor panic I mean, I didn't look! That kind of behavior is completely inappropriate!<br>N-now, did you need something?
		`,},
		{index: "hornyFash", priority: 3, unique: false, requirements: "?flag mayor pounce; ?flag mayor horny;", content: `
			mayor pent Good grief...
			player worried Slow day?
			mayor amused Ah, playerF. Good to see you as always.<br>I had someone in here recently who...
			mayor pent Well, they were quite the talker. And only about one subject too.<br>Talking about human anatomy, specifically.
			player annoyed Geez. Who'd want to learn about <i>human</i> anatomy? We barely have any fluff at all.
			mayor tired Your dicks are way better though.
			player happy Hmm?
			mayor blush N-nothing! S-sorry, did you need something?
		`,},
		{index: "hornySado", priority: 3, unique: false, requirements: "?flag mayor pounce; ?flag mayor horny;", content: `
			mayor pleasured Oh! playerF!
			player happy Howdy-do mayorino!
			mayor blush S-sorry I'm so bedraggled right now, I've been... Exercising.<br>I had a tarot reading with Madame sadoF and she said I should be trying to "work out the pressures on my mind".
			mayor befuddled Though, maybe she said "work off"... Maybe I should be trying to focus on work even harder?
			player annoyed If you work any harder, you'll go crazy.
			mayor blush A-and pin you to the ground again? I wouldn't do that!<br>... A second time!<br>Did you need something?
		`,},		
	]
	var highestPriority = 0;
	var finalChatList = [];
	for (mayorIndex = 0; mayorIndex < mayorQuoArray.length; mayorIndex++) {
		var alreadySeen = false;
		for (chatIndex = 0; chatIndex < data.player.mayorChatLog.length; chatIndex++) {
			if (mayorQuoArray[mayorIndex].index == data.player.mayorChatLog[chatIndex]) {
				alreadySeen = true;
			}
		}
		if (alreadySeen == true) {
			if (mayorQuoArray[mayorIndex].unique != true && checkRequirements(mayorQuoArray[mayorIndex].requirements)) {
				mayorQuoArray[mayorIndex].priority = 0;
				finalChatList.push(mayorQuoArray[mayorIndex]);
			}
		}
		else {
			if (checkRequirements(mayorQuoArray[mayorIndex].requirements)) {
				finalChatList.push(mayorQuoArray[mayorIndex]);
			}
		}
	}
	var finalChat = 0;
	for (mayorIndex = 0; mayorIndex < finalChatList.length; mayorIndex++) {
		if (finalChatList[mayorIndex].priority > highestPriority) {
			finalChat = mayorIndex;
			highestPriority = finalChatList[mayorIndex].priority;
		}
	}
	if (finalChatList[finalChat].priority == 0) {
		finalChat = Math.floor(Math.random() * finalChatList.length);
	}
	console.log(finalChatList);
	console.log(finalChatList[finalChat]);
	data.player.mayorChatLog.push(finalChatList[finalChat].index);
	writeHTML(finalChatList[finalChat].content);
	if (checkFlag("mayor", "desperate") && checkFlag("mayor", "horny")) {
		writeQuoRepeats();
		if (!checkFlag("mayor", "repeat2")) {
			writeHTML(`player worried <i>Man, I'd love to just pet her, but she's way too horny for that right now...</i>`);
		}
		if (checkFlag("mayor", "repeatables")) {
			writeHTML(`trans cancel; Go back`)
		}
	}
	else {
		if (!checkFlag("mayor", "repeat2")) {
			writeHTML(`trans repeat2First; Give her pets`)
		}
		writeHTML(`trans cancel; Go back`)
	}
	if (checkTrust("mayor") > 1) {
		data.player.mayorLust += 1;
	}
}

function mayorTrustFunction() {
	if (checkTrust("mayor") < 2) {
		setTrust("mayor", 2);
	}
}

function mayorCheck() {
	if (data.player.mayorChatLog == undefined) {
		data.player.mayorChatLog = [];
		if (checkTrust("mayor") > 1) {
			data.player.mayorChatLog = ["intro1", "intro2", "intro3"];
		}
	}
	//Self-heal for older saves: 'desperate' is granted by the unique horny5 chat, but a save
	//that consumed horny5 before the flag existed can never replay it — permanently locking
	//the repeatables menu (and with it the Temp. Mayor trophy) no matter how often she's visited.
	if (data.player.mayorChatLog != undefined && data.player.mayorChatLog.includes("horny5") && checkFlag("mayor", "desperate") != true) {
		addFlag("mayor", "desperate");
	}
	if (data.player.mayorLust == undefined) {
		if (checkTrust("mayor") > 2 && checkFlag("mayor", "pounce") != true) {
			data.player.mayorLust = 9;
			addFlag("mayor", "horny");
		}
		else {
			data.player.mayorLust = 0;
			addFlag("mayor", "safe");
		}
	}
	else {
		if (data.player.mayorLust > 8) {
			removeFlag("mayor", "safe");
			addFlag("mayor", "horny");
		}
		else {
			removeFlag("mayor", "horny");
			addFlag("mayor", "safe");
		}
	}
}

function mayorLust() {
	if (checkTrust("mayor") > 1) {
		if (checkFlag("mayor", "pounce")) {
			data.player.mayorLust += 2;
		}
		else {
			data.player.mayorLust += 3;
		}
	}
	mayorCheck();
}

var eventArray = [
	{index: "mayorMorning-2", name: "Mayor in the Morning 1", image: "mayor/mayorMorning-2SEX-1",
	content: `
		t It's time for the morning mailbox, but the host is otherwise occupied.
		im mayor/mayorMorning-2Meat-1 ?flag mayor meat;
		im mayor/mayorMorning-2Veggie-1 ?flag mayor veggie;
		mayor torogao Oughhh~!<br>I'm running a town of degenerates...<br>I asked for a quick either or, and you all send me letters thirsting over the human... Some of you were so detailed it's like you wrote them right after snorting the sweat off his dick!
		mayor shock M-maybe something's wrong? Our neighbor town has a human mayor and I never heard about this sort of thing happening. D-did we get a defective human?
		im mayor/mayorMorning-2Meat-2 ?flag mayor meat;
		im mayor/mayorMorning-2Veggie-2 ?flag mayor veggie;
		mayor pleasured Nghh~! Or are we the defective ones? At this rate all the town's men will be impotently leaking and all the women will be stuffed with human sperm!<br>N-no! Get ahold of yourself mayorF, these are just your fantasies! H-hurry up and finish and clear your mind!
	`},
	{index: "mayorMorning-5", name: "Mayor in the Morning 2", image: "mayor/mayorMorning-5SEX-1",
	content: `
		outfit mayor nude
		t It's time for the morning mailbox, but the host is otherwise occupied.
		im mayor/mayorMorning-5Meat-1 ?flag mayor meat;
		im mayor/mayorMorning-5Veggie-1 ?flag mayor veggie;
		mayor torogao Sho gewd~! Fuck, fuck, fuck! This whole town is fucked! I fucked it up! 
		mayor pleasured Why is this happening?! Folks should be breeding with each other, not masturbating to every whiff they can catch of the human, and <i>certainly</i> not writing oodles of smut about it and sending it to the town mayor!
		im mayor/mayorMorning-5Meat-2 ?flag mayor meat;
		im mayor/mayorMorning-5Veggie-2 ?flag mayor veggie;
		mayor excited Okay! Okay okay okay. Hands off. You've tried cumming to clear your mind, didn't work. Now it's time to make a decision.
		mayor sleep On one hand, ask the human to leave, hope that the residual lust left over causes some of the women here to be so desperate they jump the men. There'll be a few pregnancies at least, probably.
		mayor happy On the other hand, don't do that...
		im mayor/mayorMorning-5Meat-3 ?flag mayor meat;
		im mayor/mayorMorning-5Veggie-3 ?flag mayor veggie;
		mayor excited Let the whole town drool over the human's fat dick.<br>Why the fuck do we need to worry? And children the human puts in us will probably be a hundred times more virile than anything a few droplets of cuck sludge could cause a woman to birth.
		mayor shock W-why did that come out so mean?! 'Cuck sludge'?! That's horrible!<br>Am I really okay letting myself go wild over one resident? Am I really okay knowing my lovely town is going to turn into some hedonistic orgy zone where we all worship some oversized monster radiating pure sex?
		mayor excited ...
		t ...
		im mayor/mayorMorning-5Meat-4 ?flag mayor meat;
		im mayor/mayorMorning-5Veggie-4 ?flag mayor veggie;
		mayor ahegao Hah... Hah...<br>Gotta get dressed...
	`},
	{index: "mayorMorning-8", name: "Mayor in the Morning 3", image: "mayor/mayorMorning8SEX",
	content: `
		mayor sleep Hmm hmm hmm~<br>Everything in order~<br>Schedule laid out, papers in the sor~ter~
		mayor amused ... I'm glad I've had the chance to work through my backlog.<br>I've been backed up for weeks and now I'm <i>finally</i> making some headway.<br>So...
		im mayorMorning8Meat ?flag mayor meat;
		im mayorMorning8Veggie ?flag mayor veggie;
		mayor frown Why are <i>you</i> throbbing so much?!<br>My paperwork is backed up, not me!<br>Seriously, can you not go f...
		mayor pent Fffive minutes? Without... Gh... Without stealing away my brainpower?<br>I'm really productive when I'm not stroking myself to the edge all day...<br>Okay, okay, I plannned for this...
		mayor perverted H-half... N-no, a full hour. And no edging!<br>I'll give you a <i>little</i> bit of attention, I'll c... Cum... And get back to work!
	`},
	{index: "mayorMorning-9", name: "Mayor in the Morning 4", image: "mayor/mayorMorning9SEX-1",
	content: `
		mayor sleep Mmmgh...<br>T-take it...<br>A good secretary doesn't... Nghh, need... Air...!
		im mayorMorning9Meat-1 ?flag mayor meat;
		im mayorMorning9Veggie-1 ?flag mayor veggie;
		mayor Fff... Human lips... So good...
		mayor pent Mmmgh...<br>Sunlight... Morningtime. Good grief, my throat is so dry...<br>Why am I so dehy-
		im mayorMorning9Meat-2 ?flag mayor meat;
		im mayorMorning9Veggie-2 ?flag mayor veggie;
		mayor tired Oh...
		mayor shock ... Wah! What a huge mess!<br>I've soaked right into the matress too...
		mayor pent Hah... I really could use some help from... *Him...
	`},
	{index: "pounce", name: "Pounced", image: "mayor/pounceSEX-2",
	content: `
		player worried mayorF...? Hello?
		outfit mayor nude
		eval writeHTML(mayorEventCheat[0]) ?flag mayor meat;
		eval writeHTML(mayorEventCheat[1]) ?flag mayor veggie;
		t Tears form in the edges of her eyes as the once-again sane Mayor mayorF apologizes.
		player sleep Like I said, it's-
		mayor That was r-ra... I can't even say it! I'm a criminal! A monster! I pounced you like some common animal!<br>How will you ever feel safe here again!?
		player It's-
		mayor I can't use the town's funds, but I have some of my own. I'll pay for a house somewhere else, and forget your debt, somewhere you'll never have to see me ag-
		player angry mayorF!
		mayor blush Eep!
		player happy ... That was fun. Let me know if things get that crazy again, alright?
		mayor worried O-okay...?
		mayor shock Wait, no! Nonono, no, that wasn't, this isn't going to be-
		player worried Huh, I forgot why I came here, actually....
		player happy Oh well. Maybe a jiggy puzzle will jog my memory.<br>See you later, mayorF!
		mayor worried B-but... I...<br>*He's gone...
		mayor shock What have I done?!<br>I've traumatized the human into... What was it? Stockholder syndrome?!<br>I'm a monster!
		mayor happy ... Wow, my head is really clear right now.
		mayor worried No! I should be in jail!<br>I'll need to make a press release! Ohh, but if I resign there's no one to handle...
		mayor shock Wait, I never found a vice-mayor!<br>FUCK!
		mayor sleep ... If there's a higher power out there, are you listening?<br>Look, just kill me now. I'll understand.
	`},
	{index: "horny2", name: "Friendly Visit", image: "mayor/horny2-2", 
	content: `
		t player happy Hello-
		mayor Ghh!
		t *SCHLLLLP*
		im horny2-1
		mayor pent Hoh... Hoh...<br>playerF, you startled me...
		player worried Sorry. Trying out one of those other methods you mentioned?
		mayor pent Yes. Gh... shopF...<br>I've... been fucking a full foot of nubbed plastic dick all day...
		im horny2-2
		mayor torogao And I'm still fffffucking horny...!
		player amused Need my help yet?
		mayor pent N-no... I have...<br>Two things left from shopF to try...
		player happy Well, you know where to find me.
		mayor tired I do, th... Thank you.<br>Did you come here just to check up on me, or did you need something else?<br>I can help, so long as I don't need to stand up.
	`},
	{index: "horny3", name: "Panties", image: "mayor/horny3SEX-1", 
	content: `
		eval writeHTML(mayorEventCheat[2]) ?flag mayor meat;
		eval writeHTML(mayorEventCheat[3]) ?flag mayor veggie;
	`},
	{index: "horny4", name: "Another Try", image: "mayor/horny4SEX-1", 
	content: `
		eval writeHTML(mayorEventCheat[4]) ?flag mayor meat;
		eval writeHTML(mayorEventCheat[5]) ?flag mayor veggie;
	`},
	{index: "repeat1", name: "Repeatable - Hidden Oral", image: "mayor/repeat1", 
	content: `
		player star I get to be mayor for a day!
		mayor excited Y-yes, you can fluff my-
		mayor scared ... What?!
		player smug Hehe. 
		t ...
		player star Alright! Time for mayoring!<br>Let me see here.
		im repeat1
		mayor love C-cock... So... Huge...
		player You're learning your lesson, right? That friendship's more important?
		mayor B-big enough... It'll rape down to my tummy~<br>I bet I could cum hands-free~
		player tired ...<br>I knew if I just got rough with you, you'd probably just develop a maso-fetish or something.<br>But Mayor mayorF's clocked out right now, huh?<br>She still in there?
		mayor perverted Hmm~?
		mayor pent Er... Y-yes... I...<br>I still...<br>Please, d-don't do... Anything c...
		mayor love Caaaawwwwwk~<3
		im repeat2
		player horny Hmm!<br>Thank goodness.<br>I was worried this was... Hoh... A silly idea!
		mayor perverted Hmmm~! Ghlllk, hase's ho huud~!
		player amused Alright, you have fun under there.<br>And I'll have fun up here!
		player happy Hmm. I have no idea how to pass a new law, but let's see if there's anything fun in your backlog.<br>Hrm, this one...
		mayor ahegao Khlllk~!
		player blush Whoa! Hey, I'm trying to read!<br>Here, you want this?<br>Take it like a good doggy!
		im repeat3
		mayor orgasm Ghhhhhlk~<3
		player happy Okay. "Public Bill LL-0089: New investment in Lavender Lane preventative"-
		t The moment your brain hits the first line of legal jargon, your eyes close and the sound of choking *Gluk*s is quickly matched by soft snores.
		player sleep Zzz...
		t And for the official mayoral cockslut under your desk, the immediate response <i>should</i> be...
		mayor panic <i>Did... Did *he just fall asleep?! How?!<br>His hands are on my head, I should push off this cock asap!</i>
		t But of course, you're both creatures of instinct, so instead her response is...
		im repeat4
		mayor ahegao Ghhhhhhhlk~<3<br><i>Cawk, so deep~! C-cummm~! Please~!<br>W-wanna... Lick human balls but... C-can't...<br>D-don't wanna pull off~!<br>Deeperrrr~<3</i><br> Hohhh~Khk<br><i>A... Almost... W-want to feel... Balls clench... D-deepthroat...!<br>B-but... Need to taste... C-cum...!
		player Zzz...<br>Fluffy~<br>C'mere... Cutie~<br>Must... Hug the fluffy...
		im repeat5Meat ?flag mayor meat;
		im repeat5Veggie ?flag mayor veggie;
		mayor orgasm MHHHHHMMMGKKKKLK~!!!
		t ...
		player Mmm...
		player amused Mmmm. <br>Where...
		player surprised Wah! I forgot, I'm allergic to law!<br>Aww geez, mayorF-
		im repeat6
		mayor broken Hahhh~<3
		player shock mayorF?<br>What time is it? How long have you been bathing in my pheromones?
		player panic Oh gosh oh geez oh man...<br>Oh I really hope you didn't fuck yourself into brain damage. Did you at least pace yourself?
		mayor Hahhh~ha~ha~
		player pent ... Of course you didn't.<br>Well, at least you're still conscious. Let's get you to bed.
		mayor Haaaaah~? Ha~ha~?
		player sleep Yes, yes, good girl.
	`},
	{index: "repeat2", name: "Repeatable - Heavy Petting", image: "mayor/repeat2-1", requirements: "?flag "+character.index+" repeat2;",
	content: `
		mayor confused You came in here to... Pet me? 
		player excited Uhuh, yeah. Can I? Your hair, your ears, your super cute tail...
		mayor pout Do you know how much work I have to do? I'm the only one in town who cares about balancing budgets.<br>I have so few moments where I'm not drowning with lust, and I basically have to run the town by myself.
		player worried Oh, well...<br>Sorry to bother you. I guess I'll get out of your hair.
		mayor pent Hold on. I didn't say no.
		im repeat2-1
		mayor tired You'll just need to make it quick.
		player love ...!
		t You're hooked from the moment your fingertips squish against her soft cheeks.
		t She's a finely aged gal, stress and age have been beaten by self-care and an obviously well-studied moisturizing and fur care routine, her whole face has this wonderful elasticity to it!
		im repeat2-2
		t The scruff under her chin is especially wonderful!
		mayor sleep Mmm~<br>Are all humans  this fanatical about rubbing folks' chins?
		player blushy Ehehe~
		mayor pent Mmm... I guess... Gh... It's just you, huh?
		player excited Good girl, who's a good girl? Who's a responsible lady?
		mayor sleep I am~
		player That's right! You are, yes you-
		t *THUMP* ?flag mayor meat;
		t *Sqrrrt* !flag mayor meat;
		player confused Huh? What was that?
		mayor pent Ignore it. Focus on petting.<br>Or wrap up and leave.
		player love N-no! Pets... Such wonderful fur... And those gorgeous ears...
		mayor pent Mggh... Fuck... Call me a good girl again...
		player excited You are a good girl! 
		t *THMP* *THMP*
		mayor sleep Ignore those too, I need to... Nghh... Get more comfortable...
		player You should be comfortable! You work so hard, and you still manage to keep your fur so soft and pretty~
		t *THMP* *THMP*
		t You're completely tuning out the shaking of the desk below you, the softness of mayorF's cheeks is much more important than the fact that her desk is inching closer to you with each of those mysterious thuds.
		mayor pervert Mgghhh~Ffffuck, I'm close!
		player excited Good girl! Such a good girl~!
		im repeat2-3
		mayor Gggggfff~
		mayor pent Hff... Oh, that hit the spot...<br>Okay, okay, alright, I need to clean my desk... Come by again some other time okay?
		player confused Clean your desk? But you keep it so tidy already!
		mayor tired Stop flirting before you flip my switch. I'd like to actually be productive today.
		player sleep Alright, I'll visit again some other time. See you around!
		mayor happy Take care.
		mayor tired ... They're gone.<br>Stupid sexy human... Walking around with those jiggly thighs...<br>Touch my ears, I oughta... Motorboat that huge wobbling ass...
		mayor pent Ghh... Damnit... I squirted all over the underside of my desk <i>and</i> I'm horny again...
	`},
	/*
	{index: "repeat2", name: "Repeatable - Rubbing", image: "mayor/", requirements: "?flag mayor repeat1;",
	content: `
		t Placeholder
	`},
	{index: "repeat3", name: "Repeatable - Sex", image: "mayor/", requirements: "?flag mayor repeat2;",
	content: `
		t Placeholder
	`},
	*/
	{index: "wall1", name: "Hole in the Wall - Mayor", image: "mayor/wall-01", requirements: "?flag mayor pounce;",
	content: `
		player happy Sounds like the wall's occupied today.
		carpenter sleep Yep. Trust me, she really needs a break from the heat...<br>If you could head out back and let her cool off, both of us would really appreciate it.
		player sparkle I'll do my best!
		t ...
		mayor blush Hello...
		im wall-01
		mayor blush You, err... You're on this side?
		player shock You're backwards!<br>This is supposed to be a wallbutt wall, not a... Face... Wall.
		mayor worried carpenterF said it'd be a good way to let some steam off. Though, when I said I didn't want things to get <i>too</i> intense, that's when they said I should stick this side out.
		player happy Well, this side is fine too.
		mayor Actually I was really expecting this to be just a bit more ano-
		im wall-02
		mayor blush -Caaaaaawk~
		t *Thump* *Sqrt* *Thump* *Sqrt* *Thump* *Squirt*
		player worried Hmm, weird noises from the other side of that wall...
		im wall-03Meat ?flag mayor meat;
		im wall-03Veggie ?flag mayor veggie;
		player sparkle Oh well, probably nothing.<br>Now, who's a good doggie, who's a good girl?
		im wall-04
		mayor Hah~ Hah~<br>S-sweat, h-human, smell~<3
		player You are, yes you are~!
		im wall-05
		player excited Hooh, now mayorF...
		mayor excited Hmm~? <3
		player I know you're having a rough time with your heat, so as your friend I'll make sure not to spend too long near you.<br>Pheromones and all that, okay?
		mayor Ehhh...? But...
		mayor shock W-wait, why are you-
		player pleasured So I'll need to be... Just a little rough!
		im wall-06
		mayor ahegao KHHHHHLK~!!!
		player blush Wow, that's... Really snug!<br>And with your nose right to my pelvis like that...!<br>Sorry mayorF, I...!
		t *WHAM*
		mayor ahegao GLLLLK~!!!
		player ahegao Hohh~<br>Can't go...!
		t *SLAM*
		mayor ahegao HHHHHKKKH~!!!
		player Easy on you!
		t *PLAP* *PLAP* *PLAP*
		player pleasured Ghh...! <br><i>I hope I'm not hurting her too badly...</i>
		im wall-07Meat ?flag mayor meat;
		im wall-07Veggie ?flag mayor veggie;
		t *SPLT* *SPLT* *SPLUUUUURT*
		mayor torogao <i>CUMMINGGGG~<3<3<3<br>BIG HUMAN COCK'S MAKING ME CUM HANDS-FREEEEE~<3<3<3</i>
		player Nghhh, gonna...! Cum...!<br>Gotta... Pull before I... Choke you...!
		mayor ahegao GHHHHLK<i>MORREEE~<3<3<3</i>
		im wall-08
		player ahegao Hooohhh~!<br>Can't... Stop...!
		im wall-09
		mayor ahegao GHLG-<3<br>GHLG-<3<br>GHLLP-<3
		im wall-10
		mayor PHAAAH~<3
		t *THMP* *THMP* *THMP*
		player There's that sound again... Are you stuck for real? It looks like you're trying to push and pull yourself free.<br>Or like you're trying to hump the wall...
		mayor ahegao Caaa-Hhhk!-wwwwkk~
		player shock Poor girl, that was one heck of a cough!<br>Maybe my cum's got your head acting funny, I should go and let you recover.
		mayor excited C-Hhhhhk~!
		player happy Yeah, catch you later!
		player Seems like another wallbutt customer...<br>Wall <i>face</i> customer satisfied.
	`},
	{index: "nudity1", name: "Public Indecency", image: "mayor/nudity1-2SEX",
	content: `
		player Hmm hm hmm~
		mayor panic playerF! Wait, playerF!
		player confused Hmm?<br>Oh, hey mayorF! What can I do ya for?
		mayor pent Not... *Huff*... A bad choice of words...<br>No! N-no, I, err... Naked!
		player befuddled Huh?
		im nudity1-1-light-masc
		player shock Oh! Whoops, still haven't gotten dressed yet, sorry.
		player annoyed Though, it's not really fair that all of you get to walk around without pants and I don't.
		mayor pent In our defense, the town was asexual before you moved here.<br>Regardless, could you maybe, just please wear... <i>Something?</i> It's more than a little distracting.
		player smug Hmmm~? But what about me spreading pheromones?
		mayor sparkle Oh, good question! See, since you moved here, I started doing research on sex-pheromone dispersal rates! <br>I had mesuF write up a paper calculating it, though he had to assume you were a perfect sphere in a vacuum, but...
		t ...
		mayor blushy And..  Ghh... So you see! That's why you'll trigger heat faster walking around in sweaty clothes, than... Ngfff... Than completely nude!
		player sleep Right, right. So, I was definitely listening to all that, but let's say I wasn't listening at all and didn't understand any of it, and that I was really confused why you're masturbating while trying to explain it.
		im nudity1-2SEX
		mayor blushy The masturbation is c-completely unrelated! A-anyways... G-go get dressed!
		player happy Okie dokie! See you-
		mayor panic W-wait, first... C-could you... Just a second, I...
		player pent Wait for you to finish? I mean, I dunno, it's pretty hot out here...
		im nudity1-4-light-masc
		mayor love Hahhh~<3<br>Wh-want... That looks...
		player sleep Plus, it'd set a really poor example for the town's mayor to be cumming in public, so I'll get out of your hair.
		player smug Bye!
		mayor panic W-wait! Nghhh!!!
	`},
];

var mayorEventCheat = [
	//pounceMeat
	`
		mayor ahegao -solutely ruined until~<br>-eaking, squirting mess like a faucet~
		im pounceMeat-1
		player shock mayorF! What happened?! You look like a-
		mayor excited Huuuman~?<br>Ahaha~!
		player Waaah-!
		im pounceMeat-2
		mayor Late, late, late~<br>Fantasies started hours ago, why are you so late this time?
		player I think-
		mayor But it's okay! You smell so much better this time!<br>Tell me you're really here.
		player I am really here!
		mayor Goooood~<br>Make the fantasy real, the rape needs to feel really really real for me to get off anymore~
		mayor ahegao Now which one of us is topping this time~?<br>Say it's my ass today, please~? I've been such a bad puppy~
		player worried ... You've gone absolutely insane, haven't you?<br>You're way further gone than anyone else in town...
		mayor excited Ooh, degradation~?<br>Mhmhm~ Yes please~
		im pounceMeat-3
		mayor Call me names, slap me around, anything you want, just fuck me hard enough I can think straight again, okay?
		player sleep Hah...<br>Well, if it's to save the nice lady who gave me a 'free' house...
		player sparkle I'll do my best!
		im pounceMeat-4
		mayor ahegao Haaaaah~<3<br>Whaaa~? What's... Going...-
		player excited Take this! And this! Hoorah~!
		t Each thrust is accompanied by a wet splat below her, every drop of fluid showing off the broken willpower of a very overworked, VERY horny bitch.
		t Her eyes slowly undo being rolled back, a near-catatonic look on her face until her completely dopey eyes pass over yours.
		mayor excited Ghhh~! This isn't... Normal~!<br>Head... Feeling...
		t Every sound from her mouth dripping with dopamine until suddenly...
		mayor blush Gah~! W-wait! Hold on, I'm-<br>playerF?!
		im pounceMeat-5
		mayor ahegao Haaaaah~<3<3<3
		t Hot flashes of sanity come back to her at just the wrong time as cum shocks her system, her mind is totally frazzled as her now very aware mind is bombarded by rapid flashes of white.
		mayor torogao Khhhhg-! Need... To...!<br>NHGHH~!
		im pounceMeat-6rosebud
		t And as she pulls herself away from you, fighting heavy resistance (none of which comes from you), she tumbles forward, her ass leaking thick white jizz that soon paints the floor.
		mayor Ghhhhhhgggg~!!!
		t Repressed desires smash through the surface of her mind like breaching dolphins as relief finally overtakes her.
		t ...
		mayor shock I am so, SO, sorry!
		im pounceMeat-7
	`,
	//pounceVeggie
	`
		mayor ahegao -solutely ruined until~<br>-eaking, squirting mess like a faucet~
		im pounceVeggie-1
		player shock mayorF! What happened?! You look like a-
		mayor excited Huuuman~?<br>Ahaha~!
		player Waaah-!
		im pounceVeggie-2
		mayor Late, late, late~<br>Fantasies started hours ago, why are you so late this time?
		player I think-
		mayor But it's okay! You smell so much better this time!<br>Tell me you're really here.
		player I am really here!
		mayor Goooood~<br>Make the fantasy real, the rape needs to feel really really real for me to get off anymore~
		mayor ahegao Now which hole are you breaking this time~?<br>Say it's my ass today, please~? I've been such a bad puppy~
		player worried ... You've gone absolutely insane, haven't you?<br>You're way further gone than anyone else in town...
		mayor excited Ooh, degradation~?<br>Mhmhm~ Yes please~
		im pounceVeggie-3
		mayor Call me names, slap me around, anything you want, just fuck me hard enough I can think straight again, okay?
		player sleep Hah...<br>Well, if it's to save the nice lady who gave me a 'free' house...
		player sparkle I'll do my best!
		im pounceVeggie-4
		mayor ahegao Haaaaah~<3<br>Whaaa~? What's... Going...-
		player excited Take this! And this! Hoorah~!
		t Each thrust is accompanied by a wet squirt from between her legs, every drop of fluid showing off the broken willpower of a very overworked, VERY horny bitch.
		t Her eyes slowly undo being rolled back, a near-catatonic look on her face until her completely dopey eyes pass over yours.
		mayor excited Ghhh~! This isn't... Normal~!<br>Head... Feeling...
		t Every sound from her mouth dripping with dopamine until suddenly...
		mayor blush Gah~! W-wait! Hold on, I'm-<br>playerF?!
		im pounceVeggie-5
		mayor ahegao Haaaaah~<3<3<3
		t Hot flashes of sanity come back to her at just the wrong time as cum shocks her system, her mind is totally frazzled as her now very aware mind is bombarded by rapid flashes of white.
		mayor torogao Khhhhg-! Need... To...!<br>NHGHH~!
		im pounceVeggie-6rosebud
		t And as she pulls herself away from you, fighting heavy resistance (none of which comes from you), she tumbles forward, her ass leaking thick white jizz that soon paints the floor.
		mayor Ghhhhhhgggg~!!!
		t Repressed desires smash through the surface of her mind like breaching dolphins as relief finally overtakes her.
		t ...
		mayor shock I am so, SO, sorry!
		im pounceVeggie-7
	`,
	//horny3Meat
	`
	mayor pleasured playerF! Thank... Nghh, goodness! Help!
	im horny3Meat-1
	player befuddled Panties?
	mayor I thought they'd help, honest!<br>W-wearing them was j-just... Just help!
	player pent Hah...
	mayor perverted They're hugging my cock, it f-feels reaaaally good, b-but it won't stop!<br>Whenever I try taking them off I just tug and can't stop myself from grind-
	im horny3Meat-2
	mayor pleasured Eep~!
	player amused Y'know, working yourself up like this isn't good for you.<br>You're lucky I came by.
	mayor excited Y-you can-
	player sleep Nope, not until you're done. I don't know what you have left to try, but I can't just leave you like this.<br>You'd do the same for me, I'm sure.
	mayor perverted Mmmgh~!<br>H-human hand... And smell~
	im horny3Meat-3
	player confused You know, I've never really thought about it, but not only is your dick always out of its sheath, but your knot always looks engorged too.<br>Maybe... Hm...
	t You loosen your grip slightly.
	mayor forced ...!
	t Letting the veiny, red bulb at the base of her penis slip forward. Now it feels less like you're giving her a handjob and more like she's knotfucking your palms.
	mayor forced GHOOUhhhhh~! Knotting! Human...! Stretch...! Out...!
	player laugh That's the spirit! 
	im horny3Meat-4
	mayor torogao Cumminggggggg~<3<3<3
	player awe Wow! You only lasted a couple of seconds, but you shot clear across the room!<br>And your knot's pulsing in my hands. Maybe it's like how the glans of a human penis works, hmm.
	mayor broken F-fill... Belly... P-puppies~
	player amused Well, more like "M-made... Mess on... F-floor~”<br>But good hustle!<br>Hmm... Y'know, you're leaking a lot. I think you've still got a lot left in there...
	mayor forced HhhhheeEEEEP~!
	player sparkle One more! C'mon mayorF!<br>I know you want to focus on your work, but what if you meet a cute girl someday? She won't want to settle for a two-pump chump!<br>Let's see if you can go for ten seconds of kn-
	mayor torogao NGHHHHH~!!!
	player panic Wah! That time was even shorter!
	`,
	//horny3Veggie
	`
	mayor pleasured playerF! Thank... Nghh, goodness! Help!
	im horny3Veggie-1
	player befuddled Panties?
	mayor I thought they'd help, honest!<br>W-wearing them was j-just... Just help!
	player pent Hah...
	mayor perverted They're hugging my pussy, it f-feels reaaaally good, b-but it won't stop!<br>Whenever I try taking them off I just tug and can't stop myself from grind-
	im horny3Veggie-2
	mayor pleasured Eep~!
	player amused Y'know, working yourself up like this isn't good for you.<br>You're lucky I came by.
	mayor excited Y-you can-
	player sleep Nope, not until you're done. I don't know what you have left to try, but I can't just leave you like this.<br>You'd do the same for me, I'm sure.
	mayor perverted Mmmgh~!<br>H-human hand... And smell~
	player amused You know, I've never really thought about it, but you spent a <i>lot</i> of time masturbating, right?<br>And I keep walking in on you just as you finish.
	mayor forced ...!
	t You shift forward to more aggressively press against her clit, feeling it pulse against your thumb as you pursue a fast orgasm, instead of a truly satisfying one.
	player happy I think this a great time to see your actual endurance. It's important to get a feel for how long you can last, for future partners, I mean.
	mayor forced Part... Ner...!
	player sparkle Yeah! Plus, are you a multiple orgasms kind of girl? Or are your big ones the kind where there's no real gap between them?<br>I say we find out!
	t mayorF's leg's start to buckle.
	player blush Ah, there it is! Plus, these things need to go. The fabric's pretty thin, so how about I keep playing with you with my hand until these rags are, well, ragged?
	t ...
	mayor forced GHOOUhhhhh~!
	im horny3Veggie-3
	player sparkle Another one! Keep those arms up, let's see how long we can ride this one?
	mayor torogao Cumminggggggg~<3<3<3
	player awe Jeez! These are soaked through, you shot clear across the room that time!<br>Maybe we should measure squirt distance next time?
	mayor orgasm Khhhhhuuummmingggg~<3
	player worried Hmm. Y'know, I actually can't tell where one ends and the other starts.<br>Your thighs don't always quiver, you don't always buck your hips the same way, sometimes there's no squirt...<br>You're actually cumming every time you say you are, right?
	mayor torogao GHHHH~!
	player befuddled Like, right there. C'mon, tell me in detail?<br>You're gritting your teeth really hard though, can you even talk?<br>... that makes things harder.
	mayor forced HhhhheeEEEEP~!<br>T-tor... Tort...
	player worried "Torture"? Yeah, you've been through a lot these last few days. Don't worry, and no need to cry, I'm here now.
	player sparkle So one more, this time just for fun! C'mon mayorF!<br>I know you want to focus on your work, but really put your heart into it!<br>Let's see if you can go for ten full seconds of-
	mayor broken Ohhhhh~
	player panic Wah! That time was even shorter!
	`,
	//horny4Meat
	`
	player mayorF? Are you finally taking a break today?
	mayor broken Hooohhhh~
	player sleep I guess not.<br>"Hoh~", "Ah~", "Ngggh~", hopefully once you get your heat figured out you'll have more things to say than-
	player shock Wah!
	im horny4Meat-1
	mayor crying H-help... Me...
	player angry Good grief! If the panties drove you crazy, why on earth would you ever think a cock ring would be a good idea?!
	mayor crying L-less... S-surface area...?
	player fury You know your knot's already super sensitive! And now you've knotted a ring meant to keep you erect and horny even longer!
	player tired Hah...<br>Maybe I shouldn't, maybe I should just let you stew until you're willing to ask for your friend's help properly.
	mayor forced Ngghh~! I can, I can! I'm begging you, make this stupid bitch's cock squirt until she learns her lesson!<br>It's just barely too tight to take off... Nghh! No matter how many times...!
	player sad Well, I was hoping for more of a "Hey buddy, could you help me out with my heat?" But the way you phrased it works too I guess.
	player frown You're lucky you got such a big ring. It's not tight enough that it's cutting off circulation, but unless I can get you to squirt until empty, there's no way you're un-knotting that.
	mayor pleasured ...!
	player happy So I'll just make you cum super hard until you black out.<br>I mean, how long could it take?
	t ...
	player sleep Roooock~ A bye~ Doooooggie~
	im horny4Meat-2
	mayor orgasm Hhhhhuuummmigggggghhhlk~<3
	player worried ... Hmm. You have really, really good breath control.<br>You came what, three times? Feel like passing out yet?<br>My hand cramped, but it doesn't seem like throat swabbing is working.
	mayor afterglow Hllllllk~<3<3<3
	player pent I can still feel that tongue going crazy.<br>The goal isn't to make <i>me</i> cum, it's to make <i>you</i> cum, mayorF.<br>Or white out. Whichever comes first.
	mayor perverted Ghh... Hhhmmkh...!
	player awe Oh, that's a great idea!<br>Okay, I'm gonna have to get a little rough with you, alright?<br>Just start counting sheep, okay?
	mayor orgasm Klllhk, khhhhlllk, glllk~<3<3<3
	player excited Okay... B-been holding myself back for so long that...<br>It's hard to relax down there, let my balls release, y'know?<br>S-sorry, a good facefuck is... Nghh!
	im horny4Meat-3
	player pleasured Hoohhhh~<br>That's the spot...
	t *Gllp* *Gllp* *Gllp*
	player excited There we go, good girl, a full belly should calm you down. Juuuuust relax.
	t ...
	mayor sleep Zzz...
	mayor shock Nghhh~!<br>Wh-
	player shock Wah!<br>Geez, don't scare me like that, I was napping too!
	mayor scared playerF? Oh god, I didn't-
	player sleep Relax, I got it off.
	player tired But mayorF, I'm serious. Trying to deal with this all yourself, overworking yourself too, I bet.<br>Don't you know "A sorrow shared is half a sorrow"?<br>Lately, you've really been a... A...
	player frown ... Bad dog.
	mayor scared ...!
	player I'm sorry to say it, but yeah, you-
	t *THUD*
	player shock Wah!
	mayor cry ...
	player befuddled She... Fainted? From being called a b-<br>Err, I guess I shouldn't say it.<br>Or maybe she was just really tired?
	player frown Geez. Whole stacks of paper are soaked from her squirts.<br>So many documents, she must have signed her name like 200 times in this pile alone.
	player pent Hah... Hopefully she's learned her lesson by now.<br>Hey, mayorF? I'll drop by again tomorrow, feel better by then, alright?
	`,
	//horny4Veggie
	`
	player mayorF? Are you finally taking a break today?
	mayor broken Hooohhhh~
	player sleep I guess not.<br>"Hoh~", "Ah~", "Ngggh~", hopefully once you get your heat figured out you'll have more things to say than-
	player shock Wah!
	im horny4Veggie-1
	mayor crying H-help... Me...
	player angry Good grief! If the panties drove you that crazy, why on earth did you think a thong would be any better?!
	mayor crying L-less... S-surface area...?
	player fury That just means it's way more concentrated!<br>Your pussy is obviously way overstimulated, your clit is super erect!<br>Jeez, every time you stand up you'd be rubbing your clit directly!
	player tired Hah...<br>Maybe I shouldn't, maybe I should just let you stew until you're willing to ask for your friend's help properly.
	im horny4Veggie-Unused
	mayor forced Ngghh~! I can, I can! I'm begging you, make this stupid bitch's cunt squirt until she learns her lesson!<br>Just trying to bring myself to take it off... Nghh! My cunt's so hungry, and I can't bring myself to... To...
	player sad Well, I was hoping for more of a "Hey buddy, could you help me out with my heat?" But the way you phrased it works too I guess.
	player frown Alright, fine. Hold still, and no squirming!
	mayor forced Eeep~!
	player worried We're lucky it's made in a way that keeps your clit exposed.<br>I bet you would have ground your chair into dust otherwise.
	player happy You're lucky I have a plan to reset your overstimulated brain.<br>I'll just make you cum super hard until you black out.<br>I mean, how long could it take?
	t ...
	player sleep Roooock~ A bye~ Doooooggie~
	im horny4Veggie-2
	mayor orgasm HOUUUuuuuuuhhh~<3
	player worried ... Hmm. Maybe if we changed positions? Here.
	mayor afterglow Gnnnnghh~
	player tired It's like handling a giant, squirting sack of potatoes.<br>And as much as I appreciate you trying to lick me, the goal isn't to make <i>me</i> cum, it's to make <i>you</i> cum, mayorF.<br>Or white out. Whichever comes first.
	mayor perverted Ghh... Mmm...!
	player amused Can't manage to form words anymore?<br>I think that's a good sign actually.<br>That means it's time to... Attack!
	im horny4Veggie-3
	mayor cry !!! <3
	player excited There we go, good girl. Juuuuust relax.
	t ...
	mayor sleep Zzz...
	mayor shock Nghhh~!<br>Wh-
	player shock Wah!<br>Geez, don't scare me like that, I was napping too!
	mayor scared playerF? Oh god, I didn't-
	player sleep Relax, I got it off.
	player tired But mayorF, I'm serious. Trying to deal with this all yourself, overworking yourself too, I bet.<br>Don't you know "A sorrow shared is half a sorrow"?<br>Lately, you've really been a... A...
	player frown ... Bad dog.
	mayor scared ...!
	player I'm sorry to say it, but yeah, you-
	t *THUD*
	player shock Wah!
	mayor cry ...
	player befuddled She... Fainted? From being called a b-<br>Err, I guess I shouldn't say it.<br>Or maybe she was just really tired?
	player frown Geez. Whole stacks of paper are soaked from her squirts.<br>So many documents, she must have signed her name like 200 times in this pile alone.
	player pent Hah... Hopefully she's learned her lesson by now.<br>Hey, mayorF? I'll drop by again tomorrow, feel better by then, alright?
	`,
]

var morningArray = [
	{index: "mayorMorning-wolf", requirements: "?trustMin mayor 1;", unique: true,},
	{index: "mayorMorning-mesu", priority: 1, requirements: "?trustMin mayor 1;", unique: true,},
	{index: "mayorMorning-fash", priority: 1, requirements: "?trustMin mayor 1;", unique: true,},
	{index: "mayorMorning-hyena", priority: 1, requirements: "?trustMin mayor 1;", unique: true,},
	{index: "mayorMorning-fashAlt", priority: 1, requirements: "?trustMin mayor 1;", unique: true,},
	{index: "mayorMorning-sadogato", priority: 1, requirements: "?trustMin mayor 1;", unique: true,},
	{index: "mayorMorning-milf", priority: 1, requirements: "?trustMin mayor 1;", unique: true,},
	{index: "mayorMorning-doe", priority: 1, requirements: "?trustMin mayor 1;", unique: true,},
	{index: "mayorMorning-shopkeep", priority: 1, requirements: "?trustMin mayor 1;", unique: true,},
	{index: "mayorMorning-mommy", priority: 1, requirements: "?trustMin mayor 1;", unique: true,},
	{index: "hot-1", priority: 1, requirements: "?trustMin mayor 1;", unique: false,},
	{index: "bath-1", priority: 1, requirements: "?trustMin mayor 1;", unique: false,},
	{index: "mayorMorning-1", priority: 50, requirements: "?trust mayor 2;", unique: false,},
	{index: "mayorMorning-2", priority: 50, requirements: "?trust mayor 3;", unique: false,},
	{index: "mayorMorning-3", priority: 50, requirements: "?trust mayor 4;", unique: false,},
	{index: "mayorMorning-4", priority: 50, requirements: "?trust mayor 5;", unique: false,},
	{index: "mayorMorning-5", priority: 50, requirements: "?trust mayor 6;", unique: false,},
	{index: "mayorMorning-6", priority: 50, requirements: "?trust mayor 7;", unique: false,},
	{index: "mayorMorning-7", priority: 50, requirements: "?trust mayor 8;", unique: false,},
	{index: "mayorMorning-8", priority: 50, requirements: "?flag mayor pounce; ?flag mayor horny;", unique: true,},
	{index: "mayorMorning-9", priority: 50, requirements: "?flag mayor pounce; ?flag mayor horny;", unique: true,},
	{index: "nightmare", priority: 1, requirements: "", unique: false,},
	{index: "morningSilly", priority: 1, requirements: "", unique: false,},
	{index: "assple-2Start", priority: 70, requirements: "?flag player assple-1; !flag player assple-2;", unique: false,},
	{index: "assple-3", priority: 90, requirements: "?flag player assple-2;", unique: false,},
	
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
			itemsArray[itemCounter].image = cleanupImage(""+itemsArray[itemCounter].image)
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
			pickupArray[pickupCounter].image = cleanupImage(""+pickupArray[pickupCounter].image)
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
				else {
					shopArray[shopCounter].image = cleanupImage(""+shopArray[shopCounter].image)
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