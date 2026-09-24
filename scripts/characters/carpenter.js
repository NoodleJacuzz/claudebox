var character = {index: "carpenter", flags: "", fName: "Cayenne", lName: "", color: "#AA805D", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: ""};

var logbookArray = [
	"im images/carpenter/clothed-meat/happy; im images/carpenter/nude-meat/happy; ?flag carpenter meat; title Sleepy; Syrup Town's sole architect, carpenter, and general construction worker. They run their own company on Pinecone Plaza named 'Squids Make Inc.'<br>Somehow incredibly productive, carpenterF can most often be found quietly napping throughout the day on anything from beds to couches to rocks on the side of the road. Perpetually giving off a very relaxed, sleepy energy, it's a mystery how they manage to get everything done on time.",
	"im images/carpenter/clothed/happy; im images/carpenter/nude/happy; ?flag carpenter veggie; title Sleepy; Syrup Town's sole architect, carpenter, and general construction worker. They run their own company on Pinecone Plaza named 'Squids Make Inc.'<br>Somehow incredibly productive, carpenterF can most often be found quietly napping throughout the day on anything from beds to couches to rocks on the side of the road. Perpetually giving off a very relaxed, sleepy energy, it's a mystery how they manage to get everything done on time.",
	"im images/carpenter/logbook2m.png; ?flag carpenter meat; title Comfy Sweater; ?trustMin "+character.index+" 1; It's rare to see carpenterF in anything aside from their favorite comfy sweater, they actually own several dozen of the same kind. Most of them are green, their favorite color.",
	"im images/carpenter/logbook2v.png; ?flag carpenter veggie; title Comfy Sweater; ?trustMin "+character.index+" 1; It's rare to see carpenterF in anything aside from their favorite comfy sweater, they actually own several dozen of the same kind. Most of them are green, their favorite color.",
	"im images/carpenter/logbook3m.png; ?flag carpenter meat; title Plump & bouncy; ?trustMin "+character.index+" 2; carpenterF has no chest to speak of, they're flat as a board. Their nipples aren't particularly sensitive either, there's probably more than a few boys out there with more developed chests than what this fellow's got.<br>Their balls on the other hand, while far from the absolute behemoths that some tanuki of legends carry around, are still bouncy and large. Softer than you'd expect, they can be squeezed (gently, please) to elicit a coo from carpenterF even when they're in a deep sleep.",
	"im images/carpenter/logbook3v.png; ?flag carpenter veggie; title Flat as a Board; ?trustMin "+character.index+" 2; carpenterF has no chest to speak of, they're flat as a board. Their nipples aren't particularly sensitive either, there's probably more than a few boys out there with more developed chests than what this fellow's got.<br>Their pussy on the other hand, while inexperienced, is soft and plump. Anything that pushes against it will find very little resistance, like it wants to embrace you in a soft, and very quickly wet, hug.",
	"im images/carpenter/logbook4m.png; ?flag carpenter meat; title Plush Ass; ?trustMin "+character.index+" 3; In carpenterF's office the chairs don't need much padding, because carpenterF is so cheeked up that even hardwood feels like fresh bedding. While not very experienced with anal, carpenterF's total relaxation means there's no risk of even the most brutal of slamfuckings being anything less than a wonderful experience for both involved.<br>Please be careful not to totally soak the sheets though, carpenterF's due for a nap soon.",
	"im images/carpenter/logbook4v.png; ?flag carpenter veggie; title Plush Ass; ?trustMin "+character.index+" 3; In carpenterF's office the chairs don't need much padding, because carpenterF is so cheeked up that even hardwood feels like fresh bedding. While not very experienced with anal, carpenterF's total relaxation means there's no risk of even the most brutal of slamfuckings being anything less than a wonderful experience for both involved.<br>Please be careful not to totally soak the sheets though, carpenterF's due for a nap soon.",
];

var achievementArray = [
	{index:"3carpenterFriend", frame: "ultraRare", name: "Carpenter's BFF", requirements: "?trustMin carpenter 3;", description: "Purchase all the upgrades from Squids Make Inc. and find carpenterF sleeping nearby.<br>Hint: carpenterF will sleep next to whatever you asked them to build until you wake them up.", image: "carpenter/achievement1SEX",},
	{index:"3carpenterWall", frame: "ultraRare", name: "Hole in the Wall", requirements: "?flag carpenter wallIntro;", description: "Unlock wallbutts by visiting Squids Make Inc. after buying every upgrade!", image: "carpenter/achievement2SEX",},
];

var itemsArray = [
];

var shopArray = [
	{index: "wardrobe", name: "Home Wardrobe", price: 10, unique: false, event: true, requirements: "?location squidsMakeInc; !flag carpenter wardrobe;", image: "locations/interiorClean",
	desc: "Builds a sturdy wardrobe in your home, allowing you to store and change clothes.",},
	{index: "gallery", name: "Home Library", price: 20, unique: false, event: true, requirements: "?location squidsMakeInc; !flag carpenter gallery; !flag carpenter away;", image: "locations/library",
	desc: "Builds a small library in your home, allowing you to read and replay scenes you've unlocked.",},
	{index: "orchard", name: "Orchard Upgrade", price: 20, unique: false, event: true, requirements: "?location squidsMakeInc; !flag carpenter orchard; !flag carpenter away;", image: "locations/forestOrchard",
	desc: "Plants additional trees around town, adds a second gathering spot to the Forest Orchard and Lavender Lane.",},

	{index: "tarotPoster", name: "Tarot Card Poster", price: 10, unique: false, event: true, requirements: "?location squidsMakeInc; ?collectables tarot; 999; !flag carpenter tarotPoster;", image: "tarot/20n",
	desc: "A large display of The Learned, to celebrate collecting every tarot card.",},
	{index: "pocketPoster", name: "E*v*e Poster", price: 10, unique: false, event: true, requirements: "?location squidsMakeInc; ?item pocket-eev-0; ?collectables pocketmanz; 999; !flag carpenter pocketPoster;", image: "pocketmanz/eev-0",
	desc: "A large display of a pocket-sized creature, to celebrate collecting every Pocketmanz card.",},

	{index: "carpenterMagazineMeat", name: "Paws on Plush #1", price: 10, unique: true, image:"items/magazine", 
	requirements: "?location squidsMakeInc; ?flag carpenter meat;",
	desc: "The first issue of a magazine someone made about me.",},
	{index: "carpenterMagazineVeggie", name: "Paws on Plush #1", price: 10, unique: true, image:"items/magazine", 
	requirements: "?location squidsMakeInc; ?flag carpenter veggie;",
	desc: "The first issue of a magazine someone made about me.",},
	{index: "carpenter-core1", name: "Jiggy Puzzle", price: 10, unique: true, image:"items/magazine", 
	requirements: "?location squidsMakeInc;",
	desc: "A jiggy puzzle of me. You can assemble it back home.",},

	{index: "carpenterPog", name: "Collectable Coin", price: 5, unique: true, image:"pogs/carpenterPog", 
	requirements: "?location squidsMakeInc;",
	desc: "A coin I made of myself. You can take it home and flip it if you want.<br>I made more, but I lost them.",},
	{index: "tv-identify", name: "Identify this Artifact", price: 0, unique: false, event: true, image:"artifacts/tv1", category: "artifact",
	requirements: "?location squidsMakeInc; ?flag player tvReady; !item tv;",
	desc: "Hmm...? What's that you're hauling around?",},
];

var pickupArray = [
];

var morningArray = [
	{index: "carpenterMorning-mayor", requirements: "?trustMin carpenter 1; ?trustMin mayor 1;", unique: false,},
	{index: "carpenterMorning-shopkeep", requirements: "?trustMin carpenter 1; ?trustMin shopkeep 1;", unique: false,},
	{index: "carpenterMorning-wolf", requirements: "?trustMin carpenter 1; ?trustMin wolf 1;", unique: false,},
	{index: "carpenterMorning-sadogato", priority: 1, requirements: "?trustMin carpenter 1; ?trustMin sadogato 1;", unique: false,},
	{index: "carpenterMorning-milf", priority: 1, requirements: "?trustMin carpenter 1; ?trustMin milf 1;", unique: false,},
	{index: "carpenterMorning-nun", priority: 1, requirements: "?trustMin carpenter 1; ?trustMin nun 1;", unique: false,},
	{index: "carpenterMorning-mesu", priority: 1, requirements: "?trustMin carpenter 1; ?trustMin mesu 1;", unique: false,},
	{index: "carpenterMorning-fash", priority: 1, requirements: "?trustMin carpenter 1; ?trustMin fashionista 1;", unique: false,},
	{index: "carpenterMorning-hyena", priority: 1, requirements: "?trustMin carpenter 1; ?trustMin hyena 1;", unique: false,},
	{index: "hot-1", priority: 1, requirements: "?trustMin carpenter 1;", unique: false,},
	{index: "bath-1", priority: 1, requirements: "?trustMin carpenter 1;", unique: false,},
	{index: "nightmare", priority: 1, requirements: "", unique: false,},
	{index: "morningSilly", priority: 1, requirements: "", unique: false,},
	{index: "bandit1", priority: 50, requirements: "?trustMin carpenter 3; !flag carpenter bandit1; !flag carpenter banditFinish;", unique: false,},
	{index: "bandit2", priority: 50, requirements: "?flag carpenter bandit1; !flag carpenter bandit2; !flag carpenter banditFinish;", unique: false,},
	{index: "bandit3", priority: 50, requirements: "?flag carpenter bandit2; !flag carpenter bandit3; !flag carpenter banditFinish;", unique: false,},
	{index: "bandit5", priority: 50, requirements: "?flag carpenter bandit3; !flag carpenter banditFinish;", unique: false,},
];

var encounterArray = [
	{name: "Squids Make Inc.", index: "intro1", top: 35, left: 66, type:"button", target: "squidsMakeInc", time: "MorningEvening", requirements: "?flag player intro; ?flag mayor mayorIntro; !flag carpenter carpenterIntro;"},
	{index: `carpenter-playerHouse`, name: `You spot someone snoozing at the foot of your bed`, requirements: "?location playerHouse; ?flag carpenter away; ?flag carpenter snooze1;", altName: "", altImage: "",},
	{index: `carpenter-orchard`, name: `You spot someone snoozing next to a large tree`, requirements: "?location forestOrchard; ?flag carpenter away; ?flag carpenter snooze2;", altName: "", altImage: "",},
	{index: "wallIntro", type:"walking", requirements: "?trustMin carpenter 3; ?location squidsMakeInc; !flag carpenter wallIntro;"},
	{index: `wallSelect`, name: `Head to the wallbutt alley`, requirements: "?location squidsMakeInc; ?flag carpenter wallIntro; !flag carpenter dailyWall;", altName: "", altImage: "",},
	{index: `deityHouse`, name: `Ask carpenterF to build deityF a house`, requirements: "?location squidsMakeInc; ?trustMin carpenter 1; ?flag deity houseAsk; !flag deity houseOrdered;", altName: "", altImage: "",},
];

var sceneArray = [
	{index: `intro1`,
	content: `
		t You step inside of the architect's office, the sign on the door reads "Squids Make Inc. - <input type='text' id='nameSubmission-carpenter' value='carpenterF'>'s office".
		t A soft snoring can be heard coming from the back room, so you head towards it.
		player worried Anyone home?
		carpenter special secret; Zzz... Mmm...<br>Hmm?
		eval introFunction("carpenter");
	`,},
	{index: `intro2`,
	content: `
		carpenter ... Hello.
		player sparkle So cute! You're like a living ball of softness!
		carpenter sleep Hmm... Oh. You're the... Y'know...<br>Human, that was it.
		player sparkle That's me! 
		carpenter happy Keys, keys, keys...
		t They stumble up, uncaring that their only piece of clothing is their baggy green sweater, leaving their plump legs and...
		t You catch yourself staring at their thick ass, each cheek looks softer than the pillows strewn about the floor.
		carpenter Oh, here they are. Lavender Lane, don't get lost. Or do. The forest's a good place for a nap. <br>Enjoy the home, mayorF had me make sure the place would hold up to a large family.<br>Oh, I tested the beds too.
		player excited Can I touch your fur?
		carpenter sleep You can do whatever you want if you lend me that bed.<br>It's suuuuuper soft by the way.<br>Definitely the kind that could make you forget you have work in the morning.
		carpenter happy I'm the town's only architect, by the way, so if you need something extra for the house, let me know.<br>I tend to sleep on the job, but I always get it done.<br>Tell mayorF I dropped by and finished the job, would you? Or don't, she'll probably notice eventually. She could use a nap, I think.
		carpenter sleep Hey, you're a human, right?
		player happy All my blood tests come back red, so probably!
		carpenter happy Haha~<br>Well, good luck spreading all your fairy-moans. mayorF says we need a lot of those otherwise the town will fall apart.
		player worried Fairy moans? You mean pheromones?
		carpenter happy Yeah, those. Apparently you being smelly puts us into something called 'heat'.<br>To be honest, I'm not all that interested, but I bet the shopkeep down on Riverside Road knows all about it.
		carpenter sleep Anyways... I need a nap now. I'll be here if you need something.
		player sparkle I'll be back soon, I promise!
		carpenter sleep Zzz...
		eval addFlag("carpenter", "carpenterIntro");
		eval passTime();
		button Head outside; changeLocation('pineconePlaza');
	`,},
	{index: `carpenterMorning-mayor`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town.

		carpenter sleep Zzz...
mayor carpenterF? How's it going?
carpenter sleep Zzz... Fifteen minutes...
mayor shock Fifteen?! But you've got all those shingles left! Are you messing with me? You look like you've been sleeping all day!
carpenter sleep Zzz... Now it's four hours... 
mayor shock Wha-? Oh, no! Sorry carpenterF, I was just worried about you! Sorry, I'll leave you to it!
carpenter sleep Zzz...<br>She's gone...
carpenter sparkle ... Alright, guess I can wrap this up before I take another nap.

		trans cancel; Finish
	`,},
	{index: `carpenterMorning-shopkeep`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in the Ivy & Oak General Store.

		carpenter sleep Zzz...
shopkeep worried Is that... Comfortable? Sleeping on those wooden chairs?
carpenter sleep Zzz... It's fine...
shopkeep sparkle Perfect! I can sell them as napping spots! How much should they go for?
carpenter sleep Zzz... Much lower than your repair tab...
shopkeep shock Gah! You still remember that? Seriously, I've tried to pay you back for repairing my stash shed five times now, but you always say it's never enough!
carpenter sleep Zzz... interrupting my naps... Makes the tab go up... Fifteen percent...
shopkeep sparkle Finally, a concrete number! Okay, so the shed was this much... And I think I've disturbed you since then a total of... 
shopkeep shock I owe you ten thousand twenty five muns?!
carpenter sleep Zzz... Eleven kay five hundo twenty eight, now...
shopkeep How are you doing that kind of math in your sleep?!
		
		trans cancel; Finish
	`,},
	{index: `carpenterMorning-wolf`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in wolfF's house.

		carpenter sleep Zzz...
wolf Hmm... 
carpenter Zzz...
wolf worried Really? But where will the closet go?
carpenter Zzz...
wolf sparkle Oh, of course! I should have trusted you completely. Doubting you in the field of crafting would be like doubting myself in terms of fashion!
carpenter Zzz...
wolf happy Ah, I will say, I've come to greatly appreciate your company since I learned to translate your snores.<br>Now, help yourself to my cushions, I need to prepare my next piece.<br>Toodles~
carpenter Zzz...
carpenter happy Mmm... I feel like someone was talking while I was asleep... But nobody's here?
		
		trans cancel; Finish
	`,},
	{index: `carpenterMorning-sadogato`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in the sadogatoF's house.

		carpenter sleep Zzz...
sadogato Hmm... The wolf? Interesting, interesting...
carpenter Zzz...
sadogato shock ... Oh, that's quite the bad omen... My aura will be absolutely awash with the town's negative flow...
carpenter Zzz...
sadogato worried Look at you, snoozing away, not a care in the world. No image to uphold, no mystique to cultivate, how I envy you.
sadogato frown But I have a responsibility to uphold the dignity of my species, and to pay respect to the mystic arts.
sadogato worried But... You look so serene... If only I could nap so freely.<br>I wonder who the truly shackled one between us is?
carpenter Zzz...
		
		trans cancel; Finish
	`,},
	{index: `carpenterMorning-milf`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in woods surrounding Syrup Town.

		carpenter sleep Zzz...
milf shock Oop-!
carpenter shock Gah!
milf angry carpenterF! This is not the place for a nap, I nearly trampled ya!<br>You coulda been hurt!
carpenter shock S-sorry!
milf angry I know yer naptime's sweet, but you better start treatin' yourself with more care! I and who knows how many good peoples would be up and over ourselves if somethin' happened to ya!
carpenter worried ...
milf worried ... Hah... Sorry shug, didn't mean to scare ya. Here, you learn yer lesson?
carpenter worried Yeah... No more napping under bushes...
milf happy Good. Now let momma carry you to a safer spot and coddle ya back to sleepytown~
carpenter happy Actually, I should probably-
milf excited M-momma... I'm a momma, gonna cradle you in her arms, just relax, baby...
carpenter sleep ... Well, this is fine too.
		
		trans cancel; Finish
	`,},
	{index: `carpenterMorning-nun`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in the local church.

		carpenter sleep Zzz...
		nun shock Wha-?! How?!
		carpenter shock Gah! Huh?
		nun Raccoon, did you do all this by yourself?
		carpenter worried Y-yes? 
		nun worried My Lord, incredible! This was easily a fortnight's work, accomplished in but an afternoon! How?
		carpenter I... Wanted to sleep? So I worked fast?
		nun happy Incredible. I'm loathe to say it, but you could put even some humans to shame. Raccoon, I desire your skills for the church of-
		nun shock Hey, wait!
		carpenter worried I hate running...<br>But I hate taking in unscheduled work even more!
		
		trans cancel; Finish
	`,},
	{index: `carpenterMorning-mesu`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in mesuF's house.

		carpenter sleep Zzz...
mesu worried So, uh...<br>I uh, I know I agreed to let you nap, but, uh...<br>Does it have to be on my office chair?
carpenter sleep Zzz... Best chair ever...
mesu shock I know, I paid four hundred bucks for it!<br>And I don't mean muns, it's an import!
carpenter Zzz... So nice...
mesu worried Oh jeez... Okay, you can sleep on it when napping for jobs here, but you can't have the chair, alright? Only when you're on a job here at the house.
carpenter Zzz... You've earned a free renovation...
		
		trans cancel; Finish
	`,},
	{index: `carpenterMorning-fash`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town.

		carpenter sleep Zzz...
fash Hmm? Oh, a snoozing little bear~
carpenter Zzz... Not a bear... Zzz...
fash sparkle A sleeptalking one too~<br>Goodness, how I wish I could look this adorable while napping. I suppose you have your aesthetic and I have mine, hmm?
carpenter Zzz...
fash happy I can't pass up this opportunity to study you, can I? Hmm, let's see...
fash sleep Zzz...
carpenter Zzz...
fash Zzz...
fash worried ... This is dreadfully boring. Maybe if I had a sweater? Hmm... Oh, but what color? Would yellow match my eyes? Oh but black would... Hrm...
carpenter Zzz...<br>Are they gone yet...?
		
		trans cancel; Finish
	`,},
	{index: `carpenterMorning-hyena`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town.

		carpenter sleep Zzz...
		hyena shock Whoa... Almost tripped over you, little bud.<br>How tired do you have to be to fall asleep in the middle of a footpath?
		carpenter sleep Zzz...
		hyena worried Maybe you just got finished with a really hard job.<br>Or maybe you got locked out of your house all night?
		carpenter sleep Zzz...
		hyena shock Or maybe this isn't normal! Maybe you got cursed to sleep forever!<br>N-no, that's stupid. But maybe you're sick! Did you catch narcolepsy?
		hyena angry Don't worry little dude, I'll get help! 
		carpenter sleep ...
		carpenter worried ... That lady really needs to relax.

		
		trans cancel; Finish
	`,},
	{index: `morningSilly`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Elsewhere, in Syrup Town, someone else is in bed too!
		carp pent Mghhhh-<br>Ghhh...
		t Tossing and turning, carpenterF can't seem to get their usual good night's sleep.
		t Let's see what they're dreaming of...
		im morningSilly1-1 ?flag carpenter meat;
		carp scared Ahhh... Not this place again...!<br>Every surface, every square inch, it's all super hard, blocky cubes!
		carp panic Even the beds! The bedding and pillows are painted on, and there are flying creatures angry at me for not getting enough sleep! This is-
		im morningsSilly1-2
		carpenter scared Gyaaaah!
		carpenter pent *Huff* *Huff*...<br>Oh, thank goodness... Just a dream...<br>My bed, my fluffy pillows...
		carpenter tired *Yawn*<br>Mmm, guess I'll reroll the sleep slot machine... I hope I don't get two nightmares in a row.
		carpenter sleep Zzz...
		finish
		eval unencounter("carpenter")
	`,},
	{index: `nightmare`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		player tired Mmmgh... Huh?
		carpenter special secret; Oh, looks like you nodded off there, everything alright?
		im nightmare
		player scared H-huh?! Your fur! Your ears! And... No, not your tail too!<br>NOOOOOO-!
		t *Thud*
		t You rub your head gently as you wake up from a horrible nightmare.
		player cry Oh... Thank goodness... Just a dream.
		finish
	`,},
	{index: `repeat1First`,
		content: `
			eval writeEvent('repeat1')
			eval addFlag('carpenter', 'repeat1')
			eval passTime();
			finish
		`
	},
	{index: `repeat1Repeat`,
		content: `
			im repeat1-1Meat ?flag carpenter meat;
			im repeat1-1Veggie ?flag carpenter veggie;
			im repeat1-2Meat ?flag carpenter meat;
			im repeat1-2Veggie ?flag carpenter veggie;
			im repeat1-3Meat ?flag carpenter meat;
			im repeat1-3Veggie ?flag carpenter veggie;
			finish
		`
	},
	{index: `bandit1`,
		content: `
			t It's a quiet night in Syrup Town, you and every fluffy critter have retired to a lovely night's sleep.
			im bandit1-1
			carpenter sleep Zzz...
			im bandit1-2
			carpenter tired ... Why am I still awake?<br>I said "Zzz", that's the signal to drift of, so...
			carpenter happy No, no, I know just the thing that'll help me.
			t ...
			im bandit2-1
			carpenter sleep Mmm, there we go. I can already feel myself drifting off~<br>I'll definitely get my healthy sixteen hours.
			carpenter tired ... I hope.
			t ...
			player tired Mmmgh... Good morning, world.
			eval addFlag('carpenter', 'bandit1')
			trans cancel; Finish
		`
	},
	{index: `bandit2`,
		content: `
			eval writeEvent('bandit2')
			eval addFlag('carpenter', 'bandit2')
			eval raiseTrust('carpenter', 1)
			trans cancel; Finish
		`
	},
	{index: `bandit3`,
		content: `
			eval writeEvent('bandit3')
			trans bandit4; A peaceful night of sleep later...
		`
	},
	{index: `bandit4`,
		content: `
			eval writeEvent('bandit4')
			eval raiseTrust('carpenter', 1)
			eval addFlag('carpenter', 'bandit3')
			trans cancel; Finish
		`
	},
	{index: `bandit5`,
		content: `
			eval writeEvent('bandit5')
			eval raiseTrust('carpenter', 1)
			eval addFlag('carpenter', 'banditFinish')
			eval removeFlag('carpenter', 'bandit3')
			eval removeFlag('carpenter', 'bandit2')
			eval removeFlag('carpenter', 'bandit1')
			trans cancel; Finish
		`
	},

	{index: `carpenter-playerHouse`,
	content: `
		player sparkle Ooh, the library's already done! And...
		im carpenter/carpenterSnooze1-1
		carpenter sleep Zzz... 
		player sparkle So... Cute! And so soft-looking too!
		player excited I should wake them up... Though, they did say I could do whatever I want while they napped, so...
		trans carpenterSnooze1; Play with carpenterF
		trans cancel; Leave them be
	`,},
	{index: `carpenterSnooze1`,
	content: `
		eval writeEvent('carpenterSnooze1')
		eval removeFlag('carpenter', 'away')
		eval removeFlag('carpenter', 'snooze1')
		eval raiseTrust('carpenter', 1)
		eval passTime();
		finish
	`,},
	{index: `carpenter-orchard`,
	content: `
	im carpenter/carpenterSnooze2Meat-1 ?flag carpenter meat;
		im carpenter/carpenterSnooze2Veggie-1 ?flag carpenter veggie;
		carpenter sleep Mmm...
		player sparkle A sleepy tanuki, one I can do whatever I want with?
		player excited Lucky me! What should I do?
		trans carpenterSnooze2; Play with carpenterF
		trans cancel; Leave them be
	`,},
	{index: `carpenterSnooze2`,
	content: `
		player excited Ehehe... What should I do first?<br>Pet their fur?<br>Would they wake up if I buried my face in their tail?
		eval writeEvent('carpenterSnooze2')
		eval removeFlag('carpenter', 'away')
		eval removeFlag('carpenter', 'snooze2')
		eval raiseTrust('carpenter', 1)
		eval passTime();
		finish
	`,},
	{index: `wardrobe`,
	content: `
		carpenter Build you a wardrobe? Sure thing, that'll be...<br>*Yawn*<br>Easy as can be. Won't even take a day.
		special Wardrobe added to your home, you can now change clothes freely! Please note that clothing changes are mostly cosmetic and won't affect the story.
		eval addFlag('carpenter', 'wardrobe')
		trans cancel; Finish
	`,},
	{index: `gallery`,
	content: `
		carpenter A small library? No problem. I do a lot of reading too. I'll head out ahead of you, should be done by the time you get back.
		eval addFlag('carpenter', 'gallery')
		eval addFlag('carpenter', 'snooze1')
		eval addFlag('carpenter', 'away')
		trans cancel; Finish
	`,},
	{index: `orchard`,
	content: `
		carpenter More trees? You're really into this nature stuff, huh? I can do that. I'll head out ahead of you, should be done by, hmm...
		eval addFlag('carpenter', 'orchard')
		eval addFlag('carpenter', 'snooze2')
		eval addFlag('carpenter', 'away')
		trans cancel; Finish
	`,},
	{index: `tarotPoster`,
	content: `
		eval data.player.tarotPoster = cleanupImage('tarot/20n');
		carpenter You want this as a poster? Well, sure, why not. Should only take...<br>*Yawn*<br>...a few minutes. Just let me get a nap in first.
		eval addFlag('carpenter', 'tarotPoster')
		trans cancel; Finish
	`,},
	{index: `pocketPoster`,
	content: `
		eval data.player.pocketPoster = cleanupImage('pocketmanz/eev-0');
		carpenter You want this as a poster? Well, sure, why not. Should only take...<br>*Yawn*<br>...a few minutes. Just let me get a nap in first.
		eval addFlag('carpenter', 'pocketPoster')
		trans cancel; Finish
	`,},
	{index: `placeholder`,
	content: `
		eval writeTest('`+character.index+`')
	`,},
	{index: `wallIntro`,
	content: `
		im wallFront-1
		carpenter excited ... Oh. Hi.
		player worried Hiya, I was in the neighborhood and thought I'd drop by. <br>Everything alright? Was that hole here before?
		carpenter Everything's fine, probably. I just had a random idea that I was testing out...<br>It's really lucky you dropped by just now, could you-
		player happy Push you through? Sure thing! I'll get right on that!
		carpenter shock Oh, a-
		t You head for the door in a flash.
		carpenter worried Oh... *He ran off already... <br>I'm not actually stuck though...
		trans wall1; Head around back
		eval printShop = false;
	`,},
	{index: `wall1`,
	content: `
		eval writeEvent('wall1')
		eval passTime();
		eval addFlag('carpenter', 'wallIntro')
		eval addFlag('carpenter', 'dailyWall')
		special You unlocked the wallbutt wall!<br>Once per day, one of your friends will appear as the daily wallbutt!
		button Finish; changeLocation('pineconePlaza');
	`,},
	{index: `hot-1`,
		content: `
			t It's a brand new day in syrup town...
			t And it's an absolute scorcher!
			im hot1SEX
			carpenter pent Mgggh, hot...
			t No blanket, fully in the buff, this tanuki's got a real pair of steaming buns!
			trans cancel; Finish
		`
	},
	{index: `bath-1`,
		content: `
			t It's a brand new day, and all across town the folk of Syrup Town are undergoing their morning routines.
			im bath1
			t Or, well, most of them are. While others are showering, bathing, and getting ready for a new day, but others are lazing about...
			carpenter sleep Mmm... Five more minutes... At least...
			t Well, if they're cute enough, the universe'll let it slide.
			carpenter Zzz...
			trans cancel; Finish
		`
	},
	{index: `pill-carpenter`,
		content: `
			player forced Nghhh~! I can't make it... carpenterF!
			t You knock at the door of the town hall, but nobody answers.
			player shock Out?! But I didn't buy anything!
			t ...
			carpenter crying Achoo!
			carpenter tired Allergies...? At this time of year?
			mayor worried I don't think the pollen is high today.<br>That's besides the point, let's finish soon, somebody might need me.
			mayor tired I can't believe those foxes roped us into helping bury all this...<br>What is this junk, anyways?
			t ...
			player pent Ghh... I'll need to find someone else...!
			trans cancel; Finish
		`
	},
	{index: `cherry-carpenter`,
		content: `
			define playerduo = dual sp1 player; sp2 player;
			t You knock at the door of Squids Make Inc., but nobody answers.
			playerduo worried ... Nobody's home?
			t ...
			carpenter sleep Zzz...
			t ...
			player worried It's such a shame, they really would have liked having two humans to play with.
			player happy It's alright home-slice! We'll just have to find someone else to play with for now.
			trans cancel; Finish
		`
	},
	{index: `watch-start-carpenter`,
		content: `
			player worried Hmm, their door's locked.
			player sleep Thankfully, I'm not dumb enough to try waiting until they wake up.<br>I'll just have to find someone else today.
			player befuddled ... Wait, would it be any different between a sleeping carpenterF and a stopped carpenterF?
			trans cancel; Finish
		`
	},
	{index: `tv-identify`,
		content: `
			eval writeScene('system', data.player.currentScene);
		`
	},
	{index: `statusQuo`,
	content: `
		eval carpenterQuo();
	`,},
	{index: `deityHouse`,
	content: `
		im carpenter/deityHouse1
		carpenter sleep Siiiiiiip~
		player happy carpenterF, I need you to build a new house!
		im carpenter/deityHouse2
		carpenter scared Kkkpph-<br>Ack! *Cough* *Cough*<br>Oh no, what happened to the- *Cough*-<br>To the old one?!
		player It's fine, but I met a talking dog in the forest and he's homeless.<br>I thought he was a fox at first, or actually I thought he might be a ghost at first, but-
		carpenter worried Talking dog? Like, the quadrupedal kind? playerF, animals don't talk.
		player worried ...
		carpenter confused ... What? Why are you staring at me like that?
		player happy Anyways, can you help? I can pay for it. Probably.<br>I don't want him to catch a cold or something, and what if it rains?
		carpenter It's not due to rain for a while.<br>No, hold on. You distracted me.<br>Look, I'll head out there now and see what I can do. In the forest, you said?
		player joy Yep! In the wilderness, it's next to this old shrine I found.<br>How much is it?
		carpenter happy If he can actually talk, it's free. mayorF keeps a pretty large reserve of funds for building shelters for any homeless townsfolk.<br>All goes well, I can have it built by tomorrow. I'll go... Talk to the talking dog about the design, I guess.
		player happy Thanks! Hey, wait, I don't remember getting to talk to you about the design of my house...
		carpenter ...
		carpenter sleep ... Siiiiiiip~
		eval addFlag('deity', 'houseOrdered');
		eval passTime();
		finish
	`,},
	{index: `cancel`,
	content: `
		eval unencounter(data.player.currentCharacter);
		eval changeLocation(data.player.location);
	`,},
	{index: `chSexToggle`,
	content: `
		eval unencounter(data.player.currentCharacter);
		toggleflag carpenter; meat
		toggleflag carpenter; veggie
		eval diagnostic('sex em up');
	`,},
]

function carpenterQuo() {
	var sceneTarget = "";
	switch (checkTrust("carpenter")) {
		default: {
		}
	}
	if (sceneTarget == "") {
		if (data.player.carpSmall == null) {
			writeHTML(`carpenter Having fun exploring the town?`);
			if (data.player.day == 2) {
				writeHTML(`
					player I've only just started, but I'm having a great time!
					carpenter That's great~<br>Need anything for the house?
					player excited Is a tanuki-sized lap pillow on the table?
					carpenter Hehe~<br>Not yet. If you catch me sleeping on the job though, feel free to nap with me. I'll get it done eventually.
					player happy Whew, you sure are a sleepy little fellow.
					carpenter sleep It's more work than you think. Getting the perfect nap in is an art form.<br>You have to be well-fed too, I should probably think about what to eat...
				`);
			}
			else {
				writeHTML(`
					player I'm just getting started! I'm having a great time exploring the town.
					carpenter That's great~<br>Need anything for the house?
					player excited Is a tanuki-sized lap pillow on the table?
					carpenter Hehe~<br>Not yet. If you catch me sleeping on the job though, feel free to nap with me. I'll get it done eventually.
					player happy Whew, you sure are a sleepy little fellow.
					carpenter sleep It's more work than you think. Getting the perfect nap in is an art form.<br>You have to be well-fed too, I should probably think about what to eat...
				`);
			}
			data.player.carpSmall = 0;
		}
		else {
			var carpSmallArray = [
				`carpenter Tonight I'm thinking about making something sweet for dinner... Oh, but too much sugar would ruin my nap...
				player If you prepare it right you can get glucose out of some types of cotton. That's why I always try to eat yarn in moderation.`,

				`carpenter Tonight I'm thinking about something spicy for dinner, the relief of some cool milk after would really help relax me...
				player Throw in some trail mix as well and you've got a real meal!
				player worried Throw it into the milk, I mean, no point in spicing up trail mix.`,

				`carpenter Tonight I'm thinking about something meaty for dinner, I'd like to rest on a full belly...
				player Well, enriched uranium has a lot of calories, but the flavor's an acquired taste.`,

				`carpenter Tonight I'm thinking about something light for dinner, something quick so I can get to bed sooner...
				player I hear you. I keep a bottle of pink food dye #4 next to my bed if I can't be bothered to do the dishes to make food.`,

				`carpenter Tonight for dinner I'm trying out some new ingredients. I got a fistful of berries in the mail this morning...
				player sparkle That's a great name for a western!`,

				`carpenter Tonight for dinner I'm trying out some new ingredients. Any advice on preparing a good eastern dish?
				player Make sure it's hot! The easterners, I mean. Not the dish.`,

				`carpenter Tonight for dinner I'm trying out some new ingredients. What's a good sauce base?
				player frown Definitely not sulfuric acid, it overwhelms the palate. And the organs.`,

				`carpenter Tonight for dinner I'm trying out some new ingredients. I ran out of cooking oil though...
				player See, that's why I always keep some spare hair gel handy! `,

				`carpenter Tonight for dinner I was hoping to try some new ingredients, but nothing really stood out at the market.
				player That's why you should always check on top of the market too! Roofing tiles really hit the spot if you're in a creative funk.`,

				`carpenter Tonight for dinner I'm trying out some new ingredients. I'm looking for a really out-there taste.
				player I've got a personal family secret spice I've only ever used a few times in my life. I call it salt!`,

				`carpenter Tonight for dinner I'm trying a recipe Mayor mayorF gave me. She's a little vague on how much black pepper to add near the end though...
				player If you smell it and feel a burning sensation in your nose, stomach, and one of your kidneys, you're just about right!`,

				`carpenter Tonight for dinner I'm trying a recipe shopkeepF gave me. Some of the ingredients are really expensive though.
				player You could substitute anything with some good powdered drywall. I had it in all my school lunches!`,

				`carpenter Tonight for dinner I'm trying a recipe my friend wolfF gave me. I'm not sure where I'll get the processed granola crumbs though...
				player Check under your couch cushions. I always find tons of it under there.`,

				`carpenter Tonight for dinner I'm trying a recipe a fortune teller gave me. I'm not sure where I can get 'heart of newt' though.
				player Oh, I find that under my couch cushions too!`,

				`carpenter Tonight for dinner I'm trying a recipe the town gardener gave me. The serving amount could feed a whole family though... I couldn't finish all this...
				player That's what they said about the tubs of pure lard I'd eat as a kid. Just believe in yourself!`,

				`carpenter Tonight for dinner I'm trying a recipe a nun gave me. She said the salty flavor is divine, not sure what that means.
				player Oh, it means it tastes like monk paste.`,

				`carpenter Tonight for dinner I'm trying a recipe my friend mesuF gave me, but... It's just different ways to schedule when to eat protein bars and drink energy drinks?
				player That's a bachelor for you. Before I started taking food seriously I'd eat the moss right off the sides of buildings just to find enough energy to finish the day.`,

				`carpenter Tonight for dinner I'm trying a recipe someone gave me, he's actually surprisingly knowledgeable about food...
				player Oh, really? Hmm, maybe he knows how to un-wilt those cabbages I bought last year. I just can't deal with wilted food.`,

				`carpenter Tonight for dinner I'm trying a recipe doeF gave me. She was trying to remember her mother's cooking, but she doesn't have any experience herself so all the little notes are wrong in a cute way...
				player Ah, I remember when I didn't need to prepare my own food... But my parents really wanted me to be independent. At the time the flamethrower was terrifying, but I'm glad I had the chance to grow.`,

				`carpenter Tonight for dinner I asked someone for a recipe, but he said I should try just eating some wild berries.
				player No offense, but the berries here aren't all that wild. Blueberries and raspberries are great and all, but they wouldn't survive a single kegger. `,
			];
			if (carpSmallArray[data.player.carpSmall] != null) {
				writeHTML(carpSmallArray[data.player.carpSmall]);
				data.player.carpSmall++;
			}
			else {
				writeHTML(`
					carpenter Hey, thank you.
					player Hmm?
					carpenter You keep visiting and listening to me talk about food... And your jokes are really funny...
					player <i>Jokes?</i>
					carpenter You aren't pushing yourself to come visit, are you?
					player Nah, I just like hanging out. I am running out of cooking advice though.
					carpenter It's fine, we can just make the same jokes all over again.
					player They'd get a bit tired... Heyo!
					carpenter Hehe...
				`);
				data.player.carpSmall = 0;
			}
		}
		writeHTML(`
			trans repeat1First; Ask to pet carpenterF !flag carpenter repeat1;
			trans cancel; Finish
		`)
	}
}

var eventArray = [
	{index: "carpenterSnooze1", name: "Sleepy Builder 1", image: "images/carpenter/carpenterSnooze1-1",
	content: `
		im carpenter/carpenterSnooze1-2
		player excited Oh... I dunno why, but looking at you has me-
		carpenter happy Mmm... Did you say-
		im carpenter/carpenterSnooze1-3
		player shock Gah!
		carpenter Oh... So that's what humans look like down there, huh?<br>Come closer.
		player worried Closer?
		carpenter sleep Yeah, I wanna see what all the fuss is about.
		player O-
		im carpenter/carpenterSnooze1-4
		player shock Whoa!
		carpenter Mmm...<br><i>Huh, I moved without thinking there...<br>I mean, I wanted to touch it...
		carpenter excited <i>It's actually really nice to the touch...<br>It's spongey, but hard at the same time...<br>I wonder if I'm in heat yet...?
		player excited Ah~! If you keep suckling on it...!
		carpenter sleep <i>Did *he say something?<br>Ooh, it's pulsing...
		im carpenter/carpenterSnooze1-5
		player ahegao Ahh~!
		carpenter worried <br>It's... Gooey... I couldn't swallow in time, it's sticking everywhere...<br>But I can't stop...
		player excited Ghh...!
		im carpenter/carpenterSnooze1-6
		carpenter excited Hah...
		carpenter sleep Wow. That was better than I thought it'd be...<br>The taste is nice too. Salty, but there's something really warm about it.
		player excited Need help cleaning off?<br>... carpenterF?
		carpenter Zzz...
		player shock Already?!<br>Jeez, cmon, wake up! You can't leave your fur like that, it'll lose its luster!
		t After a short nap despite your pestering, carpenterF wakes back up and eventually heads back.
	`},
	{index: "carpenterSnooze2", name: "Sleepy Builder 2", image: "carpenter/carpenterSnooze2SEX-1",
	content: `
		im carpenter/carpenterSnooze2Meat-1 ?flag carpenter meat;
		carpenter sleep Mmm...
		player sparkle carpenterF... A sleepy tanuki I can do whatever I want with, how lucky am I?
		eval writeHTML(carpEventCheat[0]) ?flag carpenter meat;
		eval writeHTML(carpEventCheat[1]) ?flag carpenter veggie;
	`},
	{index: "wall1", name: "Hole in the Wall - Carpenter", image: "carpenter/wallRearSEX-01",
	content: `
		eval writeHTML(carpEventCheat[2]) ?flag carpenter meat;
		eval writeHTML(carpEventCheat[3]) ?flag carpenter veggie;
	`},
	{index: "repeat1", name: "Repeatable - Heavy Petting", image: "carpenter/repeat1-1SEX", requirements: "?flag "+character.index+" repeat1;",
	content: `
		carpenter happy Pet me?<br>Hmm. Well, from the look of you-
		player excited Ehehe~<br>Fuzzy tail~
		carpenter amused You probably don't mean a quick pat on the head.<br>Well, alright. Entertaining a guest is a great excuse not to do any work.<br>"Pet" isn't a euphemism for sex, is it?
		player horny We can do that too if you want! If I could just rub my fingertips across that wonderful tail!
		carpenter happy No, I like not having to do any work.<br>Right, I'll lay down, do whatever you want to me.
		carpenter sleep Try not to get... Too rough, I'm... A...<br>Zzz...
		player surprise Holy roshamboni... carpenterF? Did you fall asleep for real that fast?
					im repeat1-1Meat ?flag carpenter meat;
					im repeat1-1Veggie !flag carpenter meat;
		carpenter Zzz...
		player excited ... Whatever I want, huh...?<br>I think I know exactly what to do with you, sleepy~
		t You take a spot on the couch behind them and gently lift the tanuki's tail, it's...
		player love Perfect~
					im repeat1-2Meat ?flag carpenter meat;
					im repeat1-2Veggie !flag carpenter meat;
		carpenter Mgggh...
		player surprise ...!<br><i>Did I wake them?<br>... No, they're just shifting in their sleep.</i>
		t Their tail is... Dense. That's the best way to describe it. Underneath a top layer of bouncy fluff, it's like someone's compacted pure fluffy-wuffy so dense it's like if someone made a tennis ball out of freshly cleaned velvet, and it's incredibly warm too!
		player perverted Mmmmhmhm~<br>It's like a space heater on a cold day~<br>This is bad, sooo baaaad, I'm gonna become addicted~
		t You can feel your eyes lid over as your fluff-huffer addiction is finally being satisfied. Dimly, you're aware carpF is groaning, but you can't stop moving your hands.
		t Their breathing becomes faster, and ragged, and you feel a growing wet spot forming beneath you.
		player Mmmm~<br>Your tail is so beautiful~<br>It's like a warm blanket for my soul, and the rest of the world is all cold~<br>Tail, tail, tail tail tail tailtailtail-
					im repeat1-3Meat ?flag carpenter meat;
					im repeat1-3Veggie !flag carpenter meat;
		t Their back arches, their butt visibly clenches as a sleep-orgasm washes through them, but any brain power you'd use to process that is taken up by tail.
		t Tail. Fluffy fuzzy tail. Wonderful tail, tail, tail~
		carpenter pent Mghhh~
		player Mmmm~! 
		t At some point, carpenterF ushers you out. Probably to change their sweater. The downside of keeping their penis tucked into their sweater is that eventually the thick globs of cum filling their clothes makes napping... <i>Difficult.</i> ?flag carpenter meat;
		t At some point, carpenterF ushers you out. Probably to wash their cushions. A couch is only a good napping spot when it isn't completely soaked through with cuntsyrup after all. !flag carpenter meat;
	`},
	{index: "bandit2", name: "Bandit Arc - Part 2", image: "carpenter/bandit2-3SEX",
	content: `
		t It's another quiet night in Syrup Town. You and all the other fluffy residents have drifted off and taken the train to Sleepytime Junction.
		t When we last left the sleepiest tanuki in town, they were having trouble overcoming insomnia. How are they doing now?
		t ...
		im bandit2-2
		carpenter tired ... Whyyyy? What kind of crazy torture is it to be sleepy and unable to sleep? "Sleep" is right there in the word...
		t It seems carpenterF's insomnia barely allowed for a miniscule eight hours. And all signs point to yet another night of staring at the back of their own eyelids.
		carpenter annoyed No. No way, not happening.<br>There must be a cause, something that has me wide awake in the dead of the night.
		carpenter angry I bet it's these bedsheets. Or this pillow. I put all this effort into fluffing you, and this is how you betray me...
		carpenter frown I bet everyone else in town is asleep by now. All resting in their cozy beds.<br>It's unfair. The world is unfair.<br>And when the world is unfair, that's when it's time for...
		t Taking a very, very long dramatic pause, carpenterF steps out of bed, tosses their favorite sweater to the side, and pulls an old lockbox out from their closet.
		outfit carpenter nude
		im bandit2-3SEX
		carpenter mocking The bedsheet bandit to make their grand return!
	`},
	{index: "bandit3", name: "Bandit Arc - Part 3", image: "carpenter/bandit3-3",
	content: `
		t It's yet another quiet night in Syrup Town. Not one creature is stirring, certainly not you, all snug and cozy under your blankets.
		outfit carpenter nude
		carpenter mocking Heh heh heh...
		im bandit3-1
		t All except for the Tanuki at your door, midway through their pillaging of the comfiest bedspreads in town.
		carpenter teasing You may feel safe and secure, playerF, and you should. I installed some very tricky locks and other security measures in case of midnight visits.<br>But I also included the comfiest sheets in town too, and I know exactly how to crack this place open~
		t An expert both as a carpenter and a burglar, carpenterF prepares to start breaking into your home, intruding on your most precious and secure sanctums...
		t ...
		im bandit3-2
		carpenter worried ... Alright, seriously? The door wasn't even locked, and I don't think the security system was ever even activated...
		player sleep Zzz...
		carpenter annoyed ... Okay, this is just unsafe. The window to your room has been unlocked the entire time?<br>You live in a town of animals who want to jump your bones when they smell you, and you have a laser alarm system, but you never bother turning it on once?
		carpenter worried ... Alright. Now I just feel bad. Like I'm stealing from the elderly, or something.<br>playerF, wake up.
		player sleep Zzz...
		carpenter annoyed There's an intruder in your home, playerF. Wake up.
		player sleep Zzz...
		carpenter tired ... Getting this worked up is bad for my fur. I sh-
		player shock Wah! What's happening?!
		carpenter tired Oh good. You're-
		player panic A burglar! A robber! Here to steal my most precious possessions, no doubt!
		carpenter amused Pft. Yeah, like what? A stack of raw fish? A pile of half-eaten fruit? Worn pantyhose?
		player fury I'm warning you! My virginity has survived watching "Jumbo Croc's Froggy Math Adventure, The Musical" at least thirteen times, so don't think I'll give it up to you without a fight!
		carpenter tired I am... Not even going to <i>begin</i> to try unpacking that.
		player angry Who even are you, anyways? Some random burgling tanuki, here to rob me?
		carpenter tired ...
		im bandit3-3
		player shock *Gasp*<br>carpenterF the burgling tanuki?!
		carpenter ... I genuinely can't tell if you're acting right now.<br>I <i>hope</i> you are, but... Whatever.<br>Look, I came here because I couldn't sleep, but we really need to talk about-
		player scared You can't sleep?! But that's your whole thing! What are you if you can't nap?!
		carpenter worried ... I have three different prestigious certifications and a doctorate.
		player frown And a friend! No doubt you came here for my help, and I will oblige!<br>I bet you're having trouble sleeping because you're in heat, right?<br>Well come on over and let's cuddle, that'll help you drift off!
		carpenter worried You think I can't sleep because of a physiological reaction to your pheromones, and your solution is for me to rub up right against you and expose myself to those pheromones all night?
		player sleep Nope! I'm not thinking at all.
		carpenter tired ... I must be even more tired than I realize, because, whatever, let's do it. I don't have the energy to try and... Whatever.
		player happy Hehe, c'mon in, right over here!
		carpenter pent Mgggh... The moment you lifted the blanket... It's like a sauna...!<br>And do you always sleep in the nude?<br>There's no way I'll be able to... To...
		carpenter sleep Zzz...
		player sleep D'aww, you little snuggle bug, c'mere~<br>Zzz...
	`},
	{index: "bandit4", name: "Bandit Arc - Part 4", image: "carpenter/bandit4-4SEX",
	content: `
		outfit carpenter nude
		t The sun is rising.
		t The birds are chirping.
		t A brand new day is singing to you, fun times with friends and new experiences await, it's a beautiful morning!
		player Zzz...
		t However, you aren't really a morning person, so you decide to keep sleeping in until your own personal "morning", which is a few hours after noon.
		t ...
		t The sun finished rising.
		t The birds got bored and left to go do bird stuff.
		t And a halfway-done day is just kind of vegging-out on the couch. It's a perfectly serviceable afternoon!
		player sleep Mmm, now this is a reasonable hour to get out of bed.
		player excited Although...
		im bandit4-2
		player love Oh, my willpower's pretty weak so early in the day...<br>There's just no way for me to resist...
		im bandit4-3-light
		player perverted Mhmhm~<br>Muni-muni-muni~<3<br>Soft tanuki cheeks, too wonderful for words~!
		player sleep Okay, okay. Enough playing around. I have a full day ahead of me.<br>... Full of more playing around. But still, time to at least pretend I'm a productive member of society.<br>carpenterF~ Time to-
		carpenter sleep Mmm~
		t At your prodding, carpenterF shifts positions. But it seems they're in such a deep, comfy sleep that even your most reliable strategy of "Wakey wakey" isn't working, because instead of sitting up, carpenterF buries their face in your pillow and.. 
		im bandit4-4SEX
		t Presents a pair of pillows of their own.
		player amused D'aww, did you get all excited cuddling up to me overnight? How cute~!
		t Well, even if they are still asleep, you figure it'd be rude not to indulge the cute little teddybear.
		im bandit4-5-light
		t And pretty soon the two of you are playing patty-cake with each others thighs.
		carpenter sleep Mmm~
		player perverted Ehehe~<3
		t Head fully buried into the pillow, no force on earth can stop you from letting your hands explore the most tantalizing thing bouncing in front of you.
		im bandit4-6-light
		player ahegao Cummingggg~<3
		carpenter sleep ...!
		player afterglow Hoh... Alright...<br>What a nice way to start the day~<br>I got to pet fluffy tail, hopefully you're satisfied too, let's check~
		im bandit4-7SEX
		player sleep Mhm, yep, looks like you enjoyed yourself as well.<br>If you can't sleep again, carpenterF, feel free to visit again anytime!
		carpenter sleep <3
	`},
	{index: "bandit5", name: "Bandit Arc - Part 5", image: "carpenter/bandit5-6-light",
	content: `
		t It's once again a quiet night in Syrup Town. You probably get the gist at this point.
		carpenter happy Oooh~
		im bandit5-1
		carpenter amused I've come to steal your bedsheets, ooh~<br>And if you don't wake up to stop me, I'll steal your pillow too~
		player sleep Zzz...
		carpenter sleep You really are a heavy sleeper. Though, I guess that's rich, coming from me.<br>Well, nothing for it.
		im bandit5-2SEX
		outfit carpenter nude
		carpenter amused Mm, time to get comfy~<br>Though, I'm sure I'll fall asleep right away.
		t ...
		carpenter perverted Mhmhm~ This is so bad~<3
		eval writeBig("carpenter/bandit5-3Meat", "player:+16-0-1#expression:sleep#nude#overlay:carpenter/bandit5-3MeatOverlay") ?flag carpenter meat;
		eval writeBig("carpenter/bandit5-3Veggie", "player:+16-0-1#expression:sleep#nude#overlay:carpenter/bandit5-3VeggieOverlay") !flag carpenter meat;
		carpenter I've been at this for so long now, I won't get any sleep at all~<3<br>But I don't even care~<3
		carpenter seductive It was a bad idea to even try this at all, but-
		carpenter blushy Eh?! *He's rolling-
		player tired Mghhh~
		player sleep Zzz...
		carpenter forced Don't... Just fall back asleep... In a position... Like- Ghllf-!
		im bandit5-4-light
		carpenter shock Mmlphhh-!<br><i>Mouth... Being used...<br>Completely pinned!</i>
		carpenter perverted <i>Mind... Going blank! Teased... Too much...!
		im bandit5-5-light
		carpenter orgasm GHLLLLKKK-!!!
		carpenter broken <i>Got to... Find the strength... To push... Off...</i>
		im bandit5-6-light
		carpenter afterglow Khhffff-<br>Khhhaaaaa~
		player tired Mmmgh. Morning already?<br>I should... My bed feels lumpier than normal-
		player joy carpenterF! Hi~! 
		carpenter ... <3
	`},
];

var carpEventCheat = [
	//snooze2Meat
	`
	im carpenter/carpenterSnooze2Meat-2 ?flag carpenter meat;
	t carpenterF rustles around, as if having a nightmare.
	player shock Eh?! carpenterF, wake up!<br>Hey, hey, hey!
	carpenter sleep Mmmm...
	player Wakeupwakeupwakeup!
	carpenter tired Mmm...<br>Oh, hey there.
	carpenter worried When I said you could do anything with me, I was hoping you wouldn't pick 'wake me up'...
	player worried You looked like you were having a bad dream. I can't huff or fluff someone in distress.
	player frown It goes against everything I stand for!
	carpenter happy Hehe~<br>Well, I'm not in distress, just been having weird feelings lately.
	im carpenter/carpenterSnooze2Meat-3 ?flag carpenter meat;
	carpenter excited Like, I can feel my penis and balls pulsing...<br>And I can't stop thinking about...<br>
	carpenter happy Oh, actually, I think I know what I need to do now.
	player sparkle Oh, what's that? I bet I can help!
	carpenter excited Yep.
	player shock Wah!
	t *THWAP*
	im carpenter/carpenterSnooze2Veggie-4
	carpenter excited Hoh... Don't move, okay? I just... Need to...<br>*Sniff* *Sniff*
	player excited Ah~!
	carpenter excited Mmm...<br>That's the stuff...<br>You...
	carpenter pleasured Y-you...!
	t carpenterF's tail twitches, and their eyes flutter half-open with each breath. Worried you might be overloading them, you pull back.
	carpenter ahegao Ahhh~!
	im carpenter/carpenterSnooze2Meat-5 ?flag carpenter meat;
	carpenter ahegao Hoooh cumming~
	player excited ...!
	carpenter torogao Kuh...<br>Hoh, it's way more intense when I'm awake, I don't think...
	im carpenter/carpenterSnooze2Meat-6 ?flag carpenter meat;
	carpenter ahegao I don't think I'll be able to sleep for a while now...
	player worried S-sorry, I guess the heat's hitting you pretty hard.
	carpenter ahegao It's... It's fine...<br>But I think I need to get back to work now...
	im carpenter/carpenterSnooze2Meat-7 ?flag carpenter meat;
	`,
	//snooze2Veggie
	`
	im carpenter/carpenterSnooze2Veggie-2 ?flag carpenter veggie;
	t carpenterF rustles around, as if having a nightmare.
	player shock Eh?! carpenterF, wake up!<br>Hey, hey, hey!
	carpenter sleep Mmmm...
	player Wakeupwakeupwakeup!
	carpenter tired Mmm...<br>Oh, hey there.
	carpenter worried When I said you could do anything with me, I was hoping you wouldn't pick 'wake me up'...
	player worried You looked like you were having a bad dream. I can't huff or fluff someone in distress.
	player frown It goes against everything I stand for!
	im carpenter/carpenterSnooze2Veggie-3 ?flag carpenter veggie;
	carpenter worried Like, I'm really, really wet down there...<br>And I can't stop thinking about...<br>
	carpenter happy Oh, actually, I think I know what I need to do now.
	player sparkle Oh, what's that? I bet I can help!
	carpenter excited Yep.
	player shock Wah!
	t *THWAP*
	im carpenter/carpenterSnooze2Veggie-4
	carpenter excited Hoh... Don't move, okay? I just... Need to...<br>*Sniff* *Sniff*
	player excited Ah~!
	carpenter excited Mmm...<br>That's the stuff...<br>You...
	carpenter pleasured Y-you...
	t carpenterF's tail twitches, and their eyes flutter half-open with each breath. Worried you might be overloading them, you pull back.
	carpenter ahegao Ahhh~
	im carpenter/carpenterSnooze2Veggie-5 ?flag carpenter veggie;
	carpenter ahegao Hoooh cumming~
	player excited ...!
	carpenter torogao Kuh...<br>Hoh, it's way more intense when I'm awake, I don't think...
	im carpenter/carpenterSnooze2Veggie-6 ?flag carpenter veggie;
	carpenter ahegao I don't think I'll be able to sleep for a while now...
	player worried S-sorry, I guess the heat's hitting you pretty hard.
	carpenter ahegao It's... It's fine...<br>But I think I need to get back to work now...
	`,
	//wall1Meat
	`
	player worried Hm... They should be...
	player sparkle There!
	im wallRearMeat-01
	carpenter playerF? Is that you?
	player happy Yep! Don't you worry, I'll have you out of there in just a second! Should I pull?
	carpenter worried No-
	player sparkle Push, got it!
	im wallRearMeat-03
	carpenter shock Eep!<br>Stop, stop, I'm not actually stuck!
	player shock Eh?
	carpenter Well, it's... Mmm, how do I explain this...<br>This is hard... Plus I can barely focus...<br>I had this idea, maybe the heat was baking my brain...<br>I thought "what if folks could get some relief from the heat without needing to leave home?" I could just put a little half-door on the wall of my shop, stick my butt out, and, well...
	player happy Which "heat" are you talking about? Getting relief from a cool breeze on your butt, or hoping I'd walk by as you stick your bottom out the window?
	im wallFront-2
	carpenter excited ... The latter. Mostly. Like I said, my head's too hot for me to think clearly...
	im wallRearMeat-02
	player excited Soooooft~<br>Well, if a friend needs my help, I'm happy to oblige! Plus, I think this is a pretty cool idea.<br>You could make more holes like this for anybody who needs urgent relief.
	carpenter Really? I mean, I guess it wouldn't be too hard to make a bunch of stalls... I know mayorF in particular leaks like crazy, would I need to install drains? Surely she wouldn't leak <i>that</i> much juice...<br>Oh, but creampies, hrm...<br>And I'd definitely need to-
	im wallFront-3
	carpenter sleep Hmm...<br>Get cushions for each stall... Keeping my body upright for too long would get exhausting...<br>And... Oh, sorry, I'm getting carried away.
	player It's fine. That's the whole point of the hole, right? Quick, dirty fun without too much time investment?
	im wallRearMeat-04
	carpenter excited Hoooohh... R-right. S-speaking of quick, my arms are getting tired...<br>I haven't been able to get your cock out of mind since I saw it that day. If you could, maybe...<br>Fuck me into a splurting coma... I'd really-
	im wallRearMeat-05
	carpenter ahegao OOOOHHHH~!
	im wallRearMeat-07
	t *CLAP CLAP CLAP*
	carpenter Fffffuckfuckfuckfuckfuck-
	t Despite the fluffy padding there's no masking the rapid and furious plap of your hips against their fat, pillowy cheeks.
	t The hole in the wall clearly needs some work, you can see the wood flex a bit whenever you-
	im wallFront-4
	carpenter ahegao Haaahh~!
	t -slam yourself balls deep inside of them. It certainly doesn't help that there's a bit of give too, so you can't go max speed or else carpenterF's fat nuts will start to seriously bounce, slapping between your own swinging balls and the wall.
	player excited You'll... Ngh... Want to make sure the hole holds you tighter! When you make the next version!
	carpenter Ghouuuuh~! Fuckfuckfuck, harder~! My butt, my tummy, every part you're stretching feels amazing!
	t Though you'd like to oblige, in the flurry of motion carpenterF's tail twitches and wags, and as it starts to rub up against your face...
	player torogao S-sooooft~!!!
	im wallRearMeat-10
	t *spluuuurt*
	carpenter torogao ...!!!
	t Wordlessly, just seconds after your balls started squeezing a load of human cum into tanuki ass, carpenterF's own engorged balls pulse and throb, struggling to lift themselves under their own weight, until...
	t *SPLAT SPLAT*
	im wallRearMeat-09
	t The faint sound of cum painting intestines is quickly overpowered by thick ropes of even more cum splattering against the cobblestone road.
	t On the other side of the wall, carpenterF lets out a variety of broken half-noises from their stuck-agape mouth and you can hear them pawing and kneading the wall between you.
	player ahegao Hoh... Hoh... Ngh...!
	t *POP*
	t *Splsh* *Splsh*
	player Okay... I should... Pull you...
	player shock ... Eh?
	t You give carpenterF a gentle push, then try a tug, only to find a <i>lot</i> more resistance.
	player Uh oh... carpenterF? Is your belly, uh...<br>I think you're actually stuck for real...
	carpenter ...
	player worried ...?
	carpenter Zzz...<br>Zzz...<br>Z... Nhhhh~
	im wallRearMeat-11Rosebud
	t *SPLTTTTttttt*
	player worried Asleep...
	player happy Oh, wait! You just need to squirt out the rest of the cum and you'll slide right back out!
	t Happy that the problem will resolve itself, it's probably best if you go now. With their urges satisfied for the moment, sticking around can only reignite their heat.
	player Let me know if you make more wall-butt-holes, okay carpenterF?
	carpenter Zzz...
	player sleep See you later!
	t You give the twitching, dangling tanuki booty a final pat farewell before leaving.
	`,
	//wall1Veggie
	`
	player worried Hm... They should be...
	player sparkle There!
	im wallRearVeggie-01
	carpenter playerF? Is that you?
	player happy Yep! Don't you worry, I'll have you out of there in just a second! Should I pull?
	carpenter worried No-
	player sparkle Push, got it!
	im wallRearVeggie-03
	carpenter shock Eep!<br>Stop, stop, I'm not actually stuck!
	player shock Eh?
	carpenter Well, it's... Mmm, how do I explain this...<br>This is hard... Plus I can barely focus...<br>I had this idea, maybe the heat was baking my brain...<br>I thought "what if folks could get some relief from the heat without needing to leave home?" I could just put a little half-door on the wall of my shop, stick my butt out, and, well...
	player happy Which "heat" are you talking about? Getting relief from a cool breeze on your butt, or hoping I'd walk by as you stick your bottom out the window?
	im wallFront-2
	carpenter excited ... The latter. Mostly. Like I said, my head's too hot for me to think clearly...
	im wallRearVeggie-02
	player excited Soooooft~<br>Well, if a friend needs my help, I'm happy to oblige! Plus, I think this is a pretty cool idea.<br>You could make more holes like this for anybody who needs urgent relief.
	carpenter Really? I mean, I guess it wouldn't be too hard to make a bunch of stalls... I know mayorF in particular leaks like crazy, would I need to install drains? Surely she wouldn't leak <i>that</i> much juice...<br>Oh, but creampies, hrm...<br>And I'd definitely need to-
	im wallFront-3
	carpenter sleep Hmm...<br>Get cushions for each stall... Keeping my body upright for too long would get exhausting...<br>And... Oh, sorry, I'm getting carried away.
	player It's fine. That's the whole point of the hole, right? Quick, dirty fun without too much time investment?
	im wallRearVeggie-04
	carpenter excited Hoooohh... R-right. S-speaking of quick, my arms are getting tired...<br>I haven't been able to get your cock out of mind since I saw it that day. If you could, maybe...<br>Fuck me into a squirting coma... I'd really-
	im wallRearVeggie-05
	carpenter pleasured hhhhh-EEEEP~<3
	t Just the lightest brush up against carpenterF's clit is enough to send their body as rigid as it can get.
	carpenter excited There! <br>Right there! <br>That's the spot!
	player excited Vaginal? Well, if that's what you want...
	im wallRearVeggie-07
	t *CLAP CLAP CLAP*
	carpenter Fffffuuuuu...-
	t Despite the fluffy padding there's no masking the rapid and furious plap of your hips against their fat, pillowy cheeks.
	t The hole in the wall clearly needs some work, you can see the wood flex a bit whenever you-
	im wallFront-4
	carpenter ahegao Haaahh~!
	t -slam yourself balls deep inside of them. It certainly doesn't help that there's a bit of give too, so you can't go max speed or else carpenterF's slender body will get pushed or pulled right out of the hole in the wall.
	player excited You'll... Ngh... Want to make sure the hole holds you tighter! When you make the next version!
	carpenter Ghouuuuh~! Fuckfuckfuck, harder~! My pussy, my tummy, every part you're stretching feels amazing!
	t Though you'd like to oblige, in the flurry of motion carpenterF's tail twitches and wags, and as it starts to rub up against your face...
	player torogao S-sooooft~!!!
	carpenter shock ...!
	t The haze from carpenterF's mind suddenly vanishes, leaving them hyper aware of everything that's going on.
	carpenter <i>Huh? It's... Buzzing? My... Womb is...?</i>
	im wallRearVeggie-09
	t *spluuuurt*
	carpenter torogao ...!!!
	t Wordlessly, just seconds after your balls started squeezing a load of human cum into tanuki pussy, carpenterF's entire body begins to tremble, until...
	t *SPLAT SPLAT*
	im wallRearVeggie-10
	t The faint sound of cum painting its way past their cervix is quickly overpowered splashes of femcum, splattering against the cobblestone road from carpenterF's stock-still body.
	t On the other side of the wall, carpenterF lets out a variety of broken half-noises from their stuck-agape mouth and you can hear them pawing and kneading the wall between you.
	player ahegao Hoh... Hoh... Ngh...!
	t *POP*
	im wallRearVeggie-11
	t *Splsh* *Splsh*
	t There's barely a sound, hardly even a drop of cum is pulled out with you, despite what felt like a gallon splurted into carpenterF's pussy.
	player Okay... I should... Pull you...
	player shock ... Eh?
	t You give carpenterF a gentle push, then try a tug, only to find a <i>lot</i> more resistance.
	player Uh oh... carpenterF? Is your belly, uh...<br>I think you're actually stuck for real...
	carpenter ahegao Hoh...<br>Ghooo... 
	player worried ...?
	carpenter ahegao Z...<br>Zzz... Nhhhh~
	t *SPLTTTTttttt*
	player worried Asleep...
	player happy Oh, wait! You just need to squirt out the rest of the cum and you'll slide right back out!
	t Happy that the problem will resolve itself, it's probably best if you go now. With their urges satisfied for the moment, sticking around can only reignite their heat.
	player Let me know if you make more wall-butt-holes, okay carpenterF?
	carpenter Zzz...
	player sleep See you later!
	t You give the twitching, dangling tanuki booty a final pat farewell before leaving.
	`,
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