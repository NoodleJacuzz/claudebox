var character = {index: "wolf", flags: "", fName: "Sorbet", lName: "", color: "#FCB7F5", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "female"};

var logbookArray = [
	"im images/wolf/clothed/happy; im images/wolf/nude/happy; title Fashionista; wolfF is the resident fashion expert of Syrup Town, gifted with a sense of style and grace that sometimes feel out of place in this quaint little village. Everyone considers her as something like the town's idol, and she can often be found trying to brainstorm new style ideas and techniques to freshen up Syrup Town's other residents.",
	"im images/wolf/logbook2.png; title Dress Collector; ?trustMin wolf 2; Her one-track mind and surprisingly deep knowledge base of human fashion trends have led her to one conclusion, one absolute truth of the universe she's privileged to have been able to glimpse:<br>Green.<br>She has a collection of over a hundred dresses in every shade of green you can imagine. They're her pride, her joy, her self expression, they're the face she wants the world to see and think 'wolfF'.<br>She also pays someone each month to confirm that her dresses are, in fact, still green, as she's completely red-green colorblind.",
	"im images/wolf/logbook3.png; title Gal's Pals; ?trustMin wolf 4; Often contained beneath a layer of green silk are wolfF's two breasts, which are sized right about in the middle of the town's lineup, which is to say she's normally sized in a town full of petite and well-endowed women. In most cultures average and beautiful are often linked, and this is definitely true in wolfF's case. Just large enough for a titfuck but not so large they'll lead to back pain. Large enough for a hand to appreciate one, but not so large as to smother you. They're a girl's tits. Her jubblies. Her boobs.",
	"im images/wolf/logbook4.png; title Anal Queen; ?trustMin wolf 6; While her chest could be considered average her ass is anything but. Entirely unaware until she met you, wolfF has actually been blessed with more than just an extraordinary sense of fashion. wolfF is a burgeoning anal queen, her ability to pleasure and be pleasured with her asshole are unmatched throughout Syrup Town.<br>Once curious about the human custom of wearing pants and covering the privates, wolfF has definitely learned to appreciate the advantages of having her needy asshole and wet pussy on display at all times, just in case you need an easy hole to stuff with jizz.<br>Many women local to the town would probably think of motherhood as the ultimate goal of a woman, but wolfF would clearly and emphatically respond by asking if they've tried getting their butthole stretched open wide enough that they can't hold back from a body-quaking squirting bitchgasm.",
];

var achievementArray = [
	//{index:"1rubberVeggie", frame: "ultraRare", name: "Girl Toucher", requirements: "!gallery sado repeat1;", description: "Give every girl in Syrup Town a thorough petting. Note: Only counts characters available to vegetarians, not anyone with a dong.", image: "wolf/achievement1",},
	{index:"4wolfFriend", frame: "ultraRare", name: "Fashionista's BFF", requirements: "?trustMin wolf 7;", description: "Teach wolfF what it means to have a *boyfriend and become best friends.<br>Reward: New clothes for you and wolfF", image: "wolf/achievement1",},
	{index:"4wolfzBonus", frame: "ultraRare", name: "Fashion Calamity", requirements: "?flag wolf dateNude;", description: "After becoming best friends, visit wolfF while nude.", image: "wolf/achievement2",},
];

var itemsArray = [
];

var shopArray = [
];

var pickupArray = [
	{index: "wolfClothes", requirements: "?flag wolf House; !item Dress;", top: 30, left: 20, event: true, size: 10, image: "items/question"},
	{index: "wolfMama", requirements: "?flag wolf House; !flag wolf mama;", top: 30, left: 20, event: true, size: 10, image: "items/question"},
];

var morningArray = [
	{index: "morning1", priority: 40, requirements: "?trustMin wolf 7;", unique: true,},
	{index: "wolfMorning-mayor", requirements: "?trustMin wolf 1; ?trustMin mayor 1;", unique: false,},
	{index: "wolfMorning-shopkeep", requirements: "?trustMin wolf 1; ?trustMin shopkeep 1;", unique: false,},
	{index: "wolfMorning-carpenter", priority: 1, requirements: "?trustMin wolf 1; ?trustMin carpenter 1;", unique: false,},
	{index: "wolfMorning-sadogato", priority: 40, requirements: "?trustMin wolf 1; ?trustMin sadogato 5;", unique: true,},
	{index: "wolfMorning-milf", priority: 1, requirements: "?trustMin wolf 1; ?trustMin milf 5;", unique: false,},
	{index: "wolfMorning-nun", priority: 40, requirements: "?trustMin wolf 6; ?trustMin nun 5;", unique: true,},
	{index: "wolfMorning-fash", requirements: "?trustMin wolf 1; ?trustMin fashionista 1;", unique: false,},
	//{index: "wolfMorning-mesu", priority: 1, requirements: "?trustMin wolf 1; ?trustMin mesu 1;", unique: false,},
	{index: "hot-1", priority: 1, requirements: "?trustMin wolf 7;", unique: false,},
	{index: "bath-1", priority: 1, requirements: "?trustMin wolf 7;", unique: false,},
];

var encounterArray = [
	//{index: `placeholder`, name: character.index+`F test`, requirements: "?location pineconePlaza;", altName: "", altImage: "",},
	{index: `intro`, name: `Someone excitedly runs up to you`, requirements: "?location pineconePlaza; ?trust wolf 0; !flag player intro;", altName: "", altImage: "",},
	{index: `date1Intro`, name: `wolfF is here`, requirements: "?location pineconePlaza; ?trust wolf 1;", altName: "", altImage: "",},
	{index: `date2Intro`, name: `wolfF is here`, requirements: "?location pineconePlaza; ?trust wolf 2;", altName: "", altImage: "",},
	{index: `date3Intro`, name: `wolfF is here`, requirements: "?location pineconePlaza; ?trust wolf 3;", altName: "", altImage: "",},
	{index: `date3Repeat`, name: `wolfF is here`, requirements: "?location pineconePlaza; ?trustMin wolf 4; ?trustMax wolf 5;", altName: "", altImage: "",},
	{index: `date4Intro`, name: `wolfF is here`, requirements: "?location pineconePlaza; ?trust wolf 6;", altName: "", altImage: "",},
	{index: `statusQuoIntro`, type: `walking`, requirements: "?location willowWalk; ?trustMin wolf 7; !flag wolf statusQuoIntro;", altName: "", altImage: "",},
	{index: `House`, name: `Visit wolfF's house`, requirements: "?location willowWalk; ?trustMin wolf 7; ?flag wolf statusQuoIntro;", altName: "", altImage: "",},
	{index: `pill-wolf`, name: `wolfF can help!`, requirements: "?location willowWalk; ?trustMin wolf 7; ?holiday pill;", altName: "", altImage: "",},
	{index: `cherry-wolf`, name: `Let's visit wolfF!`, requirements: "?location willowWalk; ?trustMin wolf 7; ?holiday cherry;", altName: "", altImage: "",},
	{index: `watch-start-wolf`, name: `wolfF is outside`, requirements: "?location willowWalk; ?trustMin wolf 7; ?holiday watch; !flag wolf watchStart;", altName: "", altImage: "",},
];

var sceneArray = [
	//Intro
	{index: `intro`,
	content: `
		wolf special secret; Excuse me! You, over there!
		t A wolf girl in a green dress runs over to you, looking excited and a little out of breath.
		im date1-1alt
		wolf altName ???; Hi! I'm <input type='text' id='nameSubmission-wolf' value='wolfF'>! It's good to see a new face around here! And a human, too! Wow!
		button Continue; renameCharacter('intro2')
	`,},
	{index: `intro2`,
	content: `
		im intro3
		t Her eyes practically sparkling, you follow her gaze to notice them settled firmly on your crotch.
		wolf sparkle Wow! So humans really do cover their lower bodies, that's so flashy! We don't bother with that here.
		player happy I noticed! It's a bit of a shock to be honest.
		wolf happy Haha, it's so weird!<br>Hey, wanna be my *boyfriend?
		player shock ...?!
		wolf worried Is that a no? Sorry, I don't really know how humans do this stuff.<br>People around here see me as the town's foremost fashion expert, but sometimes being ahead of the trends is very similar to being an oddball.<br>But you're really cute, so...
		player worried W-well...
		wolf shock Omigosh, I totally forgot I have an appointment with Sharly today! 
		wolf sparkle Hey, hey, we should totally hang out again super soon, okay? I'll see you later darling, think about my offer~!<br>I'll be at the cafe here tomorrow! Bye!
		t And thus the wolf girl runs off, her green dress fluttering in the breeze.
		eval setTrust('wolf', 1)
		eval passTime()
		finish
	`,},
	{index: `date1Intro`,
	content: `
		im date2-1
		wolf sparkle playerF! Yoo-hoo, over here~!
		wolf happy Have you considered my offer? I know it must feel quite sudden but I'd absolutely love to get to know you better!		
		trans date1Start; Accept and become wolfF's *boyfriend
		trans cancel; Need more time
	`,},
	{index: `date1Start`,
	content: `
		player Sure! I'll be your *boyfriend.
		wolf sparkle Oh that's wonderful darling~! I promise you won't regret it.<br>Now first let's make sure we're on the same page and figure out exactly what that means!
		wolf happy There surely must be some kind of repayment, yes? For you to adorn my arm and make me the absolutely most desired trend-setter in town...<br>What do you get out of it?
		player Friendship?
		wolf shock No no no! Darling, the bonds of friendship, I'll give those freely! But I simply cannot let you go unpaid for your help, and I know for certain that money is not the answer.<br>And I simply cannot spare any of my dresses, they're all so precious to me...<br>By the way, this one is definitely green, yes?
		player worried Yes, it's green...
		wolf sparkle And you can tell green from red?! Oh, I simply must have you, no matter the cost!
		wolf happy Tell me, what do girlfriends normally do to make the couple experience worth it? More specifically, what do *boyfriend and girlfriend actually do together on their little dalliances?	
		trans date1Fluff; Huff fluff !flag wolf date1Fluff;
		trans date1A; Go on dates !flag wolf date1A;
		trans date1B; Hold hands !flag wolf date1B;
		trans date1C; Eat dinner !flag wolf date1C;
		trans date1D; Watch movies !flag wolf date1D;
	`,},
	{index: `date1Fluff`,
	content: `
		player happy Can I...
		player excited Stick my face in your fur and take a big huff?
		wolf happy Sure! But later. <br>After we figure out all the things human couples do together.
		player worried Right, humans don't have fur.<br>Darn...	
		eval addFlag('`+character.index+`', data.player.currentScene)
		trans date1Fluff; Huff fluff !flag wolf date1Fluff;
		trans date1A; Go on dates !flag wolf date1A;
		trans date1B; Hold hands !flag wolf date1B;
		trans date1C; Eat dinner !flag wolf date1C;
		trans date1D; Watch movies !flag wolf date1D;
		trans date1E; Hmm... !flag wolf date1E;
	`,},
	{index: `date1A`,
	content: `
		player They go on dates!
		wolf sparkle Ooh, a great start! What do they do on these dates though? That's where I'm lacking information.
		player worried Oh, uh...	
		eval addFlag('`+character.index+`', data.player.currentScene)
		trans date1Fluff; Huff fluff !flag wolf date1Fluff;
		trans date1A; Go on dates !flag wolf date1A;
		trans date1B; Hold hands !flag wolf date1B;
		trans date1C; Eat dinner !flag wolf date1C;
		trans date1D; Watch movies !flag wolf date1D;
		trans date1E; Hmm... !flag wolf date1E;
	`,},
	{index: `date1B`,
	content: `
		player They hold hands!
		wolf worried Oh, I think I heard about that. That seems a bit... Plain.
		player shock Plain?!
		wolf happy Surely there's more to it than that. What else do couples do?	
		eval addFlag('`+character.index+`', data.player.currentScene)
		trans date1Fluff; Huff fluff !flag wolf date1Fluff;
		trans date1A; Go on dates !flag wolf date1A;
		trans date1B; Hold hands !flag wolf date1B;
		trans date1C; Eat dinner !flag wolf date1C;
		trans date1D; Watch movies !flag wolf date1D;
		trans date1E; Hmm... !flag wolf date1E;
	`,},
	{index: `date1C`,
	content: `
		player They go out to eat dinner together!
		wolf worried Eh? No thank you, I like to eat alone.<br>Smalltalk, feeling rushed, not to mention the sounds of chewing...<br>Isn't there anything else?	
		eval addFlag('`+character.index+`', data.player.currentScene)
		trans date1Fluff; Huff fluff !flag wolf date1Fluff;
		trans date1A; Go on dates !flag wolf date1A;
		trans date1B; Hold hands !flag wolf date1B;
		trans date1C; Eat dinner !flag wolf date1C;
		trans date1D; Watch movies !flag wolf date1D;
		trans date1E; Hmm... !flag wolf date1E;
	`,},
	{index: `date1D`,
	content: `
		player They watch movies together!
		wolf happy Oh, that's doable. Though, rather than movies I prefer to watch dramas and soap operas normally.
		player shock Oh, no can do then. I'm allergic to drama. And operas. Soap is fine though.
		player worried Hmm, what else...	
		eval addFlag('`+character.index+`', data.player.currentScene)
		trans date1Fluff; Huff fluff !flag wolf date1Fluff;
		trans date1A; Go on dates !flag wolf date1A;
		trans date1B; Hold hands !flag wolf date1B;
		trans date1C; Eat dinner !flag wolf date1C;
		trans date1D; Watch movies !flag wolf date1D;
		trans date1E; Hmm... !flag wolf date1E;
	`,},
	{index: `date1E`,
	content: `
		wolf happy Yes? I'm sure it's right on the tip of your tongue!
		player worried What do I think when I think "girlfriend"...<br>I think dad used to always say something about mom...
		wolf sparkle Yes? Yes?! Don't hold back, the first thing that comes to your mind!
		player happy Anal...
		wolf happy ...?
		player shock Ah, that's not helpful, is it? My friend would always say his girlfriend was anal abou-
		wolf shock Anal, you said?
		player worried Wait, that's not what I...<br>You know what that is, right?
		wolf sparkle Of course! It's where I please you with my asshole, yes?<br>This?
		im date1-2
		wolf happy And you find it pleasing, yes?<br>This is perfect! No risk of pregnancy means no stretching out my clothes!
		player excited Erm... That's...
		wolf sleep Oh, this is wonderful, I'm so glad everything can work out so perfectly.<br>Do you need your reward now? <br>Oh, but to jump directly in might be a bit...
		wolf sparkle Ooh! Well, if my rear end does appeal to you, perhaps a touch then? It's no substitute I'm sure, but if it pleases you, go ahead!
		player excited Wh-what should I-
		wolf excited Whatever you like, of course!	
		eval removeFlag('`+character.index+`', 'date1Fluff')
		eval removeFlag('`+character.index+`', 'date1A')
		eval removeFlag('`+character.index+`', 'date1B')
		eval removeFlag('`+character.index+`', 'date1C')
		eval removeFlag('`+character.index+`', 'date1D')
		trans date1F; Whatever you like... !flag wolf date1E;
	`,},
	{index: `date1F`,
	content: `
		eval writeEvent('wolf-date1')
		eval passTime();
		eval setTrust('wolf', 2)
		finish
	`,},
	{index: `date2Intro`,
	content: `
		player shock wolfF! Good to see you, are you okay?
		wolf Oh yes I'm perfectly fine, it just felt like I had a live wire running through my body.<br>In a good way, somehow.<br>Not to mention I went to see shopkeepF after, she's the resident expert on all this 'sex' stuff you see, even runs a human culture class to keep our vocabularies prepared for spending time with you.
		wolf sparkle She said I had what was called a 'masochistic bitch-gasm'! Isn't that wonderful?<br>Oh, she confirmed what you said by the way! The 'perfect girlfriend' does indeed offer anal.
		wolf worried Though I apologize. She also said the best time for anal was on the first date.
		player worried Uh... It's alright.
		wolf happy You forgive me? Oh, you're such a good *boyfriend! Please, let me make it up to you. I bought several tools from her to help me make sure rewarding you is a, well, rewarding experience.
		trans date2Toys; Head home with wolfF
		trans cancel; Need more time
	`,},
	{index: `date2Toys`,
	content: `
		eval writeEvent('wolf-date2')
		eval passTime();
		eval setTrust('wolf', 3)
		finish
	`,},
	{index: `date3Intro`,
	content: `
		im date3-2
		wolf excited Oh, playerF~<br>S-sit with me please~!
		t She wiggles a bit as you take a seat across from her, before she takes a deep breath to calm herself.
		wolf worried I made such a fool of myself... Granted shopkeepF said the tools would make a total bitch of me, but I didn't expect to squirt so hard I faint just from a tiny bit of anal pleasure...
		player shock Oh no, it's-
		wolf frown I won't be beaten again! I underestimated how amazing...
		wolf excited H-how amazing my ass c-could feel...
		wolf angry B-but not again! I'll be the perfect girlfriend!
		wolf worried Well, I say that, but to be honest I'm not sure where to start.<br>Darling? What should I do?
		player worried Hmm... I'm not sure. Maybe we should be taking things slow?
		wolf frown I refuse! wolfF does not leave a debt unpaid. I'm certain there's a way I can claw through my weaknesses and come out the other side in just a few days, no problem!
		wolf worried Still, it'll be tough I'm sure. Let's taking try things one at a time. For starters, what should I focus on training?			
		trans training1; Spanking Resistance !flag wolf training1;	
		trans training2; Toy Endurance !flag wolf training2;	
		trans training3; First Time Anal !flag wolf training3;
		trans cancel; Train another time
	`,},
	{index: `date3Repeat`,
	content: `
		im date3-1
		wolf excited Darling~! So good to see you. Please, have a seat!<br>I have a good feeling that with just a bit more training, me and my rear will make the perfect girlfriend!<br>If you have the time to spare, what should we try next?			
		trans training1; Spanking Resistance !flag wolf training1;	
		trans training2; Toy Endurance !flag wolf training2;	
		trans training3; First Time Anal !flag wolf training3;
		trans cancel; Train another time
	`,},
	{index: `training1`,
	content: `
		eval writeEvent('wolf-training1')
		eval passTime();
		eval raiseTrust('wolf', 1)
		eval addFlag('wolf', 'training1')
		eval editSkill("dominance", 1);
		eval writeSpecial("You feel like you've grown more dominant...")
		finish
	`,},
	{index: `training2`,
	content: `
		eval writeEvent('wolf-training2')
		eval passTime();
		eval raiseTrust('wolf', 1)
		eval addFlag('wolf', 'training2')
		finish
	`,},
	{index: `training3`,
	content: `
		eval writeEvent('wolf-training3')
		eval passTime();
		eval raiseTrust('wolf', 1)
		eval addFlag('wolf', 'training3')
		finish
	`,},
	{index: `date4Intro`,
	content: `
		wolf happy playerF~!<br>You've come to visit again? I'm glad you aren't getting tired of me.
		player Never!
		wolf That's sweet of you to say, but...
		im date4-1
		wolf worried Hah...<br>Our training feels like it's going nowhere. I just collapse long before you do.<br>I feel like I'm just slipping more into your debt...
		player frown What? No way!<br>wolfF, friends don't shame friends just because they're addicted to getting fucked in the ass.
		wolf shock That's... There's no way that's...
		wolf worried ... You look like you're serious.<br>Are you really enjoying our time together? Even though I'm... Quick to finish?
		t She seems quite embarrassed to admit it, which is a little silly given how much she enjoyed how you've treated her ass so far, but when you give her a nod her expression lights back up.
		wolf sparkle That's wonderful~! Oh, I'm so glad!<br>A-and don't you worry, things will only get better. <br>Maybe I'm not improving as fast as I'd like, but if you'll be patient with me I just know I'll be an ever better girlfriend in the future!
		wolf happy S-so... Perhaps we could have a real date? 	
		trans date4Start; Have a proper date with wolfF
		trans cancel; Rain check
	`,},
	{index: `date4Start`,
	content: `
		t You decide to go on a real, proper date with wolfF!
		t ...
		outfit wolf nude
		
		wolf sparkle And so this one is-
		player happy Red.
		wolf shock ... What?! No! I was told this would be seafoam!
		wolf angry Oooh! How dare they! Here! Get this out of my sight!
		t ...
		outfit wolf magical
		
		wolf happy Okay, how does it look?
		player sparkle Magical!
		wolf sparkle Really? The bow isn't too much?<br>Okay, so, this one is-
		t ...
		outfit wolf default
		t The two of you spend most of the day just going through wolfF's prodigious closet, but eventually she drags you back to the same cafe near where you met.
		im date2-1
		wolf happy So, darling, you said there were more kinds of pants. But why are there so many?
		player Protection from the elements, mostly.
		wolf worried But from the sounds of it, these... 'leggings' wouldn't do much of that.
		player worried Yeah, human culture is weird.
		wolf excited Hmm...
		player ...?
		trans date4Anal; Continue
	`,},
	{index: `date4Anal`,
	content: `
		eval writeEvent('wolf-date4')
		eval passTime();
		eval raiseTrust('wolf', 1)
		eval removeFlag('wolf', 'training1')
		eval removeFlag('wolf', 'training2')
		eval removeFlag('wolf', 'training3')
		finish
	`,},

	//Status quo
	{index: `statusQuoIntro`,
	content: `
		wolf sparkle Darling~! Yoo-hoo~!
		im dateExtra-2
		wolf happy You found me~! And my house too, are you here to visit?
		player happy Actually, I didn't know you lived here. But now I do! So I guess I am here to visit.
		wolf Lovely~! Though, if you're busy, I don't want to keep you. Feel free to drop by anytime, you're always welcome in my home.
		eval addFlag('wolf', 'statusQuoIntro')
		eval unencounter(data.player.currentCharacter)
		finish
	`,},
	{index: `statusQuo`,
	content: `
		wolf excited Mhmhm~ Did you have something in mind for today?
		trans repeat3First; Ask to pet wolfF !flag wolf repeat3;
		eval writeQuoRepeats();
		cancel
		eval writeScene('wolf', 'wolf-dateNude') ?flag wolf nudeReady;
	`,},
	{index: `wolfClothes`,
		content: `
		wolf sparkle Hmm, that's quite an inquisitive look you have there, darling. Care to take a tour?
		player happy Sure!
		t wolfF leads you through her house, showing off her wardrobe and explaining the history behind each piece.
		wolf frown Mmm, this one... This one was a mistake. Here, darling. Take it before I mix it into my good clothes.<br>Burn it if you must, though I think you might be able to...
		wolf excited Pull it off~
		eval addItem("Dress");
		eval unencounter(data.player.currentCharacter);
		button Finish; generateHouse(data.player.currentCharacter);
	`,},
	{index: `wolfMama`,
		content: `
		player happy Hmm?
		im wolf/wilf
		wolf sparkle Ah, that's my mama!<br>Isn't it incredible? She made the cover of Vague Magazine!<br>I got my fashion sense from her, you know.
		player sparkle Cool!<br>Vague Magazine, huh?
		wolf sleep Yeah. She lives in the big city, she found her own human husband. That's what the collar around her neck means, by the way.<br>Marriage between us animal folk and humans use collars instead of rings.
		player sparkle I see~<br>What's her name, by the way?
		wolf happy Well, she had it changed after she got married.<br>She goes by "Stupid Bitch" now.
		player shock ...!
		wolf I hope she comes back to town someday. I'd love to introduce you to her.
		eval addFlag('wolf', 'mama');
		eval unencounter(data.player.currentCharacter);
		button Finish; generateHouse(data.player.currentCharacter);
	`,},

	//Post-quo scenes
	{index: `repeat1First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval raiseTrust('wolf', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat1Repeat`,
	content: `
		im wolf/repeat1-1
		im wolf/repeat1-2
		im wolf/repeat1-3
		im wolf/repeat1-4
		im wolf/repeat1-5
		im wolf/repeat1-6
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `repeat2First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval raiseTrust('wolf', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat2Repeat`,
	content: `
		im repeat2-1
		im repeat2-2
		im repeat2-3
		im repeat2-4
		im repeat2-5
		im repeat2-6
		im repeat2-7
		im repeat2-8
		im repeat2-9
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `repeat3First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('wolf', data.player.currentScene.replace("First", ""));
		eval raiseTrust('wolf', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat3Repeat`,
	content: `
		eval addFlag('wolf', data.player.currentScene.replace("First", ""));
		im repeat3-1
		im repeat3-2
		im repeat3-3
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `wolf-dateNude`,
		content: `
			eval writeEvent('wolf-dateNude')
			eval addFlag('wolf', 'dateNude')
			eval removeFlag('wolf', 'nudeReady')
			eval passTime();
			finish
		`
	},
	{index: `wall1-1`,
		content: `
			eval writeEvent('wall1-1')
			trans wa1-2; Continue
		`
	},
	{index: `wa1-2`,
		content: `
			eval writeEvent('wa1-2')
			eval addFlag('wolf', 'wall1')
			eval addFlag('carpenter', 'dailyWall')
			eval passTime();
			finish
		`
	},
	{index: "pill-wolf", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval data.player.time = "Night";
		eval data.player.holiday = "";
		finish
	`},
	{index: "cherry-wolf", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval passTime();
		eval data.player.holiday = "";
		finish
	`},
	{index: "watch-start-wolf", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval addFlag('wolf', 'watchStart')
		finish
	`},
	{index: "watch-finish-wolf", 
	content: `
		eval writeEvent(data.player.currentScene)
	`},

	//Morning scenes
	{index: `wolfMorning-mayor`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a busy day in wolfF's house as her guest tries on a new outfit.  
	wolf And... Voila!
	im wolf/wolfMorning-mayorMeat ?flag mayor meat;
	im wolf/wolfMorning-mayorVeggie ?flag mayor veggie;
	mayor happy Oh my! I love it! I look so chic!
	wolf Darling, you look <i>divine</i>. Every breath, an air of elegance. I've never seen anyone else I want to grab by the chin, whisper to the ear, "I want you to work me to the bone"~
	mayor excited W-wow, you really don't hold yourself back...
	wolf Of course not, you're our beloved town mayor, everyone should stop and stare, knowing instantly, "she's got it together".
	mayor sparkle It's perfect! This is it, my new style, I'll order a hundred!
	wolf shock Oh darling, no no no! This fashion, it is the peak of the diamond mountain! It sings perfection, it brings out every inch of you and whispers into it lovingly as it worships the flesh, but your sweater?
	mayor excited Um... D-do you need to get so close? And so breathy?
	wolf sparkle The sweater is home sweet home. It sings, caring not who listens, a nostalgic song that tucks you softly into bed. 
	wolf excited It is the truest love, a love shared between plain hearts. No games, not fueled by passion, it is a deep, romantic love. The sweater is you, darling, it is precious, beloved, and above all, approachable.
	mayor A... Approachable...
	wolf Keep the sweater, darling, a love who sees the real you... They will cherish every moment they see you wearing her~
	mayor Y-yes! Sweater stays~!
	wolf happy Lovely~ And that concludes our little daliente~ Thank you for your time, madame mayor~!
	mayor ahegao Y-yes wolfF, of course~	

		trans cancel; Finish
	`,},
	{index: `wolfMorning-shopkeep`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a busy day in wolfF's house as her guest tries on a new outfit.  
	wolf When I see you, I see something. I see an image, I see an icon~! I see an emblem, that speaks, that brands, and the consumers, they cannot help but listen~! I see... You! Voila~!
	im wolf/wolfMorning-shopkeepMeat ?flag shopkeep meat;
	im wolf/wolfMorning-shopkeepVeggie ?flag shopkeep veggie;
	shopkeep It's... Green?
	wolf sparkle It's perfect~ My sweet darling, you have the talent, the charisma, and darling, you have the money. Money is value, and you, darling, are not priceless, you are unaffordable~!
	shopkeep sparkle Unaffordable?! That's the perfect price to haggle with~!
	wolf excited Oh, and haggle they shall!No one could resist, you are diamond! You are precious! Everyone knows from the moment their eyes dart across the room, "I must have her”. They would pay anything, but you and I know, it could never be enough. And so, you have all the power~
	shopkeep happy Wow... You can really sell a green apron.
	wolf excited My darling, my darling~! How would you decorate a rose? Would you cover, or substitute the gorgeous petals? Would you slice the stem? Or would you perhaps...
	shopkeep sparkle Change the color! wolfF, you're a genius~!
	wolf Oh, my sweet storefront queen, you've placed a masterpiece before an artist, I merely highlighted~! You must appreciate the true artist behind this work~
	shopkeep happy My parents?
	wolf excited Darling, please~ Did your parents tone these thighs? Did your parents choose your taste in hair? Or is every inch of you a daring, bold challenge to the world! "Here I am. Don't you dare hesitate"~
	wolf happy Hmm, but our time together draws to a close. You must open your store, yes? Best of luck, darling~!
	shopkeep Ciao~!
	
		
		trans cancel; Finish
	`,},
	{index: `wolfMorning-carpenter`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a busy day in wolfF's house as her guest tries on a new outfit.  
	wolf Mm, you simply cannot go wrong with green, absolutely never, so I figure, if you cannot ascend the mountain, perhaps we shall, to the side, do a bit of a shimmy~? Voila!
	im wolf/wolfMorning-carpenterVeggie ?flag carpenter meat;
	im wolf/wolfMorning-carpenterMeat ?flag carpenter veggie;
	carpenter Ooh, I love it. Thin, flowy, I feel like I'll definitely wear this if the weather gets too hot.
	wolf sparkle Darling, you've seen the function, but please, appreciate the form~! You are the doll of the ball, the apple of any lucky someone's eye~! You are an object of desire, put aside your thoughts for a moment, how does it... <i>Feel</i>?
	carpenter worried Um... Nice? I think?
	wolf excited Always so hesitant to embrace the compliment, darling. Someday I hope you'll see the beauty in you that I see, you'll never want for confidence another day in your life~
	wolf happy And that concludes our little runabout~ I am grateful as always for every one of your waking moments you choose to spend with me~
	carpenter happy Anytime, wolfF.
		
		trans cancel; Finish
	`,},
	{index: `wolfMorning-sadogato`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		eval writeEvent(data.player.currentScene);
		trans cancel; Finish
	`,},
	{index: `wolfMorning-milf`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a busy day in wolfF's house as her guest tries on a new outfit.  
		milf pent Thanks a ton for this again, guess I was worried over nothin'.
		im wolf/wolfMorning-milf
		milf blushy Shoulda figured it'd still fit, it's just a scrap a white cloth after all.
		wolf amused Pay it no mind at all!<br>And I'm not surprised at all you chose a nature deity as your costume.<br>I can think of no better look for our town's very own mother nature.
		milf happy Aww shucks, thank 'ya. But there's no need to dress the job up, I'm just yer friendly gardener.
		wolf pout You'll stop that thought right there, madame!<br>You're no more a mere 'gardener' than I am the town plumber!<br>You'll be the mother of playerF's first child soon, you need to treat that title with respect, or my goal of being the mother of *his second won't be respected either!
		milf panic O-okay... I'll do my best!
		trans cancel; Finish
	`,},
	{index: `wolfMorning-nun`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		eval writeEvent(data.player.currentScene);
		trans cancel; Finish
	`,},
	{index: `wolfMorning-fash`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a busy day in wolfF's house as her guest tries on a new outfit.  

	wolf worried Hmm... It's a difficult job, darling. 
	im wolf/wolfMorning-fash
	fash It is, isn't it? But if anyone can find the middle ground, it's you.
	wolf happy Of course~! Now, the vest is a masterpiece, and the bow is a marvelous cherry on top. You're striving for "adorable" first and foremost, yes?
	fash happy Oh yes~! The vibe of a predatory wolf just doesn't work for me. I want something cute, something others just want to, well, pin down and stroke like a small helpless animal.<br>But I also need something that says "confident", it's no good to look pitiable.
	wolf sparkle Oh darling absolutely! No wonder you've gone with that lovely golden shade of eyeshadow~
	fash sparkle Yes~! Although it's hardly as striking as that incredible blue~!
	wolf worried Wait. If we get distracted here, we'll just be complimenting each other's makeup all morning...
	fash shock R-right, yes. Sorry.
	wolf ...
	wolf sparkle Oh but the sheen of your hair~!
	fash sparkle And the way your dress dances on your body~!
	
		
		trans cancel; Finish
	`,},
	{index: `wolfMorning-mesu`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a busy day in wolfF's house as her guest tries on a new outfit.  

	im wolf/wolfMorning-mesu
		
		trans cancel; Finish
	`,},
	{index: `morning1`,
	content: `
		eval writeEvent(data.player.currentScene);
		eval addFlag(data.player.currentCharacter, data.player.currentScene);
		finish
	`,},
	{index: `hot-1`,
		content: `
			t It's a brand new day in syrup town...
			t And it's an absolute scorcher!
			im hot1
			wolf pent Hahh~<br>Cool thoughts, cool thoughts. Ice cream, air conditioning, iced coffee...
			trans cancel; Finish
		`
	},
	{index: `bath-1`,
		content: `
			wolf Hmm hm hmm~
			im bath1
			wolf smug Stunning as always, wolfF~
			wolf worried Hmm. I wonder if blue eyeshadow is overused... It might be becoming a bit blase...
			wolf sleep Well, at least it's better than icky red makeup. Who'd want to wear something like that?<br>Though, maybe for variety I'll go for a nice green, like sadoF wears hers...
			trans cancel; Finish
		`
	},

	//System stuff
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

var wolfSmallTalkArray = [
	{requirements: `Shirt`, content:`
		wolf sparkle I love your shirt by the way! It's got such an ordinary, yet approachable charm!
		wolf excited It's hard not to want to lean in to the sleeve and take a deep breath of your scent, to be honest~
	`},
	{requirements: `Dress`, content:`
		wolf sparkle Oh my, is that the dress I threw out? It looks so good on you!
		wolf excited Hah~ I can just imagine your cock and balls hanging loose free to rape the nose of any girl lucky enough to find you~
	`},
	{requirements: `Flames`, content:`
		wolf sparkle Can I just say by the way, I absolutely adore that shirt?
		wolf happy Somehow, it's such an incredible and cool design, I'm not even driven to drool over what you look like without it!
		wolf excited ... Mostly~<3		
	`},
	{requirements: `Bowtie`, content:`
		wolf sparkle What a cute little outfit you have on today~! Darling, you look positively adorable~
		wolf excited How is it that someone so cute can make me feel like such a bitch in heat~? My wires are crossing, it's just not fair~
	
	`},
	{requirements: `Apron`, content:`
		wolf excited Hoh, darling, how is it that when shopkeepF wears that apron, it's nothing short of adorable, but when you wear it I can't help but want you to take me behind a counter and rape my mouth?
	`},
	{requirements: `Sleeveless`, content:`
		wolf sparkle Oh, is that one of mayorF's sweaters? It looks so good on you!
		wolf excited And the way it leaves your armpits exposed... Ough~<br>How's a good girl supposed to resist?<br>More importantly, how's a bitch supposed to choose between sticking her nose or her tongue in there?
	`},
	{requirements: `Sweater`, content:`
		wolf sparkle Oh, that's such a nice looking sweater! So comfy and cozy!
		wolf excited Lift up the bottom and let me slip inside with you, please~? I'd love to be kept nice and tight against your naked body for as long as possible~
	
	`},
	{requirements: `Chest Wraps`, content:`
		wolf worried Wait, is that a dirty bandage on your chest? Are you injured?
		player Nah, this is a chest wrap. It's a fashion thing.
		wolf Hmm. Well, we all have our own tastes. I'm afraid I'm not a fan.
		wolf excited Though, the way it leaves so much uncovered is a bit... Tempting.
	`},
	{requirements: `Business`, content:`
		wolf sparkle Ooh, such a professional look you have today! But doesn't that tie feel uncomfortable?
	`},
	{requirements: `Leather Jacket (Closed)`, content:`
		wolf sparkle That's hyenaF's jacket! She gave you one? That's so wonderful! <br>You two became the best of friends, didn't you?
		wolf excited It's quite warm out today, let me know in advance if you decide to... Air out.
	`},
	{requirements: `Leather Jacket (Open)`, content:`
		wolf sparkle That's hyenaF's jacket! She gave you one? That's so wonderful! <br>You two became the best of friends, didn't you?
		wolf excited It's quite warm out today, let me know in advance if you decide to... Air out.
	`},
	{requirements: `Donut Muncher Shirt`, content:`
		wolf sparkle What's that on your shirt?<br>...'Donut Muncher'... Oh, I love donuts too! I always try to get mine glazed.
	`},
	{requirements: `Titty Enjoyer Shirt`, content:`
		wolf sparkle What's that on your shirt?<br>...'Certified Titty Enjoyer'... Oh, how nice! It's always good to learn about what friends are passionate about.<br>Did you want to see mine?
	`},
	{requirements: `Shorts`, content:`
	wolf sparkle Can I just say, playerF, that I absolutely <i>love</i> those shorts?<br>They're so tight, it's like they're built to show off, no, present your cock to the world while leaving just the tiniest bit to the imagination.
	wolf excited Hah~<br>I really must be broken. Despite how fashionable they are, I can't help but want to rip them off with my teeth~<3
	`},
	{requirements: `Pencil Skirt`, content:`
	wolf excited D-darling, you know that your skirt...
	player Hmm?
	player shock Whoa! My little fella's totally exposed!
	wolf Mmm, little? My eyes and my rearranged guts say otherwise~
	`},
	{requirements: `Pleated Skirt`, content:`
	wolf excited D-darling, you know that your skirt...
	player Hmm?
	player shock Whoa! My little fella's totally exposed!
	wolf Mmm, little? My eyes and my rearranged guts say otherwise~
	`},
	{requirements: `Sneakers`, content:`
	wolf May I ask where you got those lovely little shoes? They're so cute!<br>I can't wear things like that on account of my paws, but they look so good on you!
	`},
	{requirements: `Boots`, content:`
	wolf sparkle Booties~! Such cute little booties~! I bet they keep your feet nice and dry in the rain.
	`},
	{requirements: `Thighboots`, content:`
	wolf sparkle Goodness me! Those boots, they're to die for!<br>Such a striking look you have today, did you get dressed up just for me?
	`},
	{requirements: `Fishnets`, content:`
	wolf excited Mmm, those fishnets...<br>The way they indent your skin is so sexy~
	`},
	{requirements: `Thighhighs`, content:`
	wolf excited Ngh~<br>S-sorry, it's just...<br>I can't stop myself from staring at those thighhighs. The way they gently squish you where they end...<br>Nghh, please don't tease me for too long today, okay darling~?
	`},
	{requirements: `Pasties`, content:`
	wolf shock Are those... Tiny hearts on your chest?
	wolf sparkle How cute! Not just cute, but they're like little signposts saying 'play with me here'!
	`},
	{requirements: `Horny Hat`, content:`
	wolf sparkle That hat, is that common for humans to wear? I heard the human visitors from other towns wore something similar.
	wolf happy If you like it, then I'm happy for you!
	`},
	{requirements: `Mini Crown`, content:`
		wolf shock What a glorious crown! That's from the museum, right? I think you had to be a patron of the arts to get one?
		player worried Well, you can't be a patron anymore, but subscribers and former patrons still get one.
		wolf sparkle How lovely! And might I say, it looks great on you!
	`},
	{requirements: `Cumload`, content:`
		wolf excited O-oh my~! Darling, you've come prepared! I can't wait to-
		wolf worried *Sniff* *Sniff*<br>Eugh, oh, that's... Not your cum.<br>If you'd care to borrow my shower, it's available.
	`},
	{requirements: `Topless`, content:`
		wolf excited N-nipples~! Oh my, darling, you've gone topless~!
		player worried Oh, I think I forgot to put on a shirt today.
		wolf That's not a problem, I can assure you. <br>M-mind you, I <i>desperately</i> want to clean up every last drop of sweat on you with my tongue, and I might not be able to hold back from squirting like a total bitch while I do.<br>B-but there's no problem at all!
	`},
	{requirements: `Bottomless`, content:`
		wolf shock O-oh my~! Darling, you're... You're not wearing any bottoms!
		player I thought I'd try blending in with the townsfolk a little bit more. How do I look?
		wolf excited Oh, so good~<br>Every second my brain is begging me to breed, I can't hold back~
		wolf torogao Nghh~! Y-you don't mind if I rub myself j-just a bit before we play, do you?
		player worried ... I should think about wearing pants next time...<br>The stimulation seems like it's too much for her...
	`},
	{requirements: `wolf nude`, content:`
		wolf worried Can I ask when I might have the chance to show off my dresses to you again? Going nude is certainly freeing, but I miss the way it flutters.
	`},
	{requirements: `wolf magical`, content:`
		wolf happy Do you like my dress? I think it goes well with this lovely ribbon!
	`},
]

function wolfQuo() {
	var smallTalkEvents = [];
	for (smallTalkIndex = 0; smallTalkIndex < wolfSmallTalkArray.length; smallTalkIndex++) {
		for (playerOutfitIndex = 0; playerOutfitIndex < data.player.clothes.length; playerOutfitIndex++) {
			if (data.player.clothes[playerOutfitIndex].index == wolfSmallTalkArray[smallTalkIndex].requirements) {
				smallTalkEvents.push(wolfSmallTalkArray[smallTalkIndex].content);
			}
		}
		if (wolfSmallTalkArray[smallTalkIndex].requirements.includes("wolf")) {
			var outfitCheck = wolfSmallTalkArray[smallTalkIndex].requirements.replace("wolf ", "");
			for (characterOutfitIndex = 0; characterOutfitIndex < data.story.length; characterOutfitIndex++) {
				if (data.story[characterOutfitIndex].index == "wolf") {
					if (data.story[characterOutfitIndex].outfit.includes(outfitCheck)) {
						smallTalkEvents.push(wolfSmallTalkArray[smallTalkIndex].content);
					}
				}
			}
		}
	}
	var topless = isTopless(data.player.clothes);
	var bottomless = isBottomless(data.player.clothes);
	if (smallTalkEvents.length == 0) {
		smallTalkEvents.push(`
			wolf Excited Ooh, darling...<br>I can't place exactly what it is, but something about your outfit today just...<br>Gets me in the mood~			
		`);
	}
	var dateNude = false;
	if (topless == true && bottomless == true) {
		smallTalkEvents = [];
		if (checkFlag('wolf', 'dateNude') != true) {
			var dateNude = true;
		}
		else {
			smallTalkEvents.push(`
				wolf shock O-oh...
				wolf excited D-darling, you promised...
				player shock Oh geez, again? Sorry wolfF, here, why don't we play together to make up for this?
			`);
		}
	}
	console.log(smallTalkEvents[getRandomInt(smallTalkEvents.length)]);
	if (dateNude == true) {
		writeEvent('wolf-dateNude')
		addFlag('wolf', 'dateNude')
		passTime();
		writeHTML(`
			finish
		`)
	}
	else {
		writeHTML(`wolf happy Darling~! I'm so glad you came to visit me again! I've been thinking about you all day~`);
		writeHTML(smallTalkEvents[getRandomInt(smallTalkEvents.length)]);
		writeQuoRepeats();
		writeHTML(`
			trans cancel; Some Other Time
		`)
	}
}

var eventArray = [
	{index: "wolf-date1", name: "First Date", image: "wolf/date1-4alt",
	content: `
		player excited W-well...
		im date1-2
		player excited Okay...!
		im date1-3
		wolf happy Ah, there you go!<br>Granted, I'm not sure that...<br>Hmm...
		wolf worried <i>Goodness, my heart started racing.<br>And what's this scent in the air now? I-</i>
		im date1-4
		t *SPANK*
		wolf shock ...!
		player shock Whoa! Sorry, I couldn't resist... Plus, you said I could...
		player worried wolfF?
		wolf shock ...
		im date1-5
		t Losing herself for just a moment as her cheeks stop their jiggling, wolfF barely moves aside from a small shudder as her pussy squirts a small line of femcum.
		wolf I...
		wolf excited I need to go, darling. Let's meet again soon, okay? Tomorrow if p-possible~
		player worried Sure thing.
		wolf T-toodles~
	`},
	{index: "wolf-date2", name: "First Anal Toys", image: "wolf/date2-5",
	content: `
		t You decide to head to wolfF's house with her.
		wolf worried  Apologies for the mess, it's difficult to find the time to keep everything organized.
		t She says, as you step into a perfectly immaculate home, the only things out of place being a large cardboard box labeled "SEX STUFF - Ivy & Oak", a bottle of clear fluid on a dresser, and very quickly a green dress tossed onto the bed.
		outfit wolf nude
		wolf happy There we go! I can't risk sweating through my dresses, can I? shopkeepF assured me that things would get quite intense.<br>I'd like to work through everything in that box there at least once today. In your professional opinion you think I can do that and still have enough left in me to give you a proper reward?
		player happy I guess that depends on...
		t You trail off, opening the box to see, among other things, a full line of fist-sized anal beads sitting at the top. Alongside it are several toys, only a scant few are made for beginners.
		t While you admire the sheer girth of some of these rectum-ravagers, wolfF already has her hands on an intimidatingly large bottle of lube.
		wolf shock Hoo! Cold. 
		wolf happy Darling? Everything alright? Just bring the box closer and we'll try each one in whatever order you'd like.
		player worried These, uh... Some of these may be a bit...
		wolf Oh darling please, don't worry~<br>Actually, shopkeepF had a smaller set at first, but after we talked about how my body reacted to that spank, she said this set would work perfectly.
		im date2-2
		wolf excited And to be honest, this may sound strange but my b-... <i>Asshole</i> feels... Ready, somehow.<br>I can feel it buzzing, almost, and being around you is making it worse. Won't you please help?
		player worried Y-yeah! If it's to help a fr... To help my girlfriend, I'll do whatever it takes!
		im date2-3
		wolf sparkle Such a *gentleman! Don't worry, I promise to stay composed. Perhaps we could have another date after!
		t ...
		im date2-4
		wolf ahegao HOUUUGH~~<3
		t wolfF can't help but let out the lewdest, most whorish howl you've ever heard with every anal bead you push inside of her.
		t She was completely right, somehow her greedy asshole is completely relaxed, and doesn't even try to fight as its stretched to its limit by the silicon balls.
		wolf torogao Nghh, nghh~! M-more~<3 Please more~<3
		t And yet the way her ass closes after the balls tells you she can be as tight as she wants, it's like she's suckling on the beads, savoring them, and as a result when they're removed-
		im date2-5alt
		wolf ahegao HOUUUUGH~!
		t Every bead pulled out is accompanied by a vicious torrent of femcum from the newly anal-inducted bitch.
		t And when the beads are finally free, instead of an exhausted, broken bitch staring back at you...
		im date2-6
		wolf pleasured N-next... Next one... Stuff my asshole... Remodel me, I want to <i>gape</i>
		player worried <i>She became addicted almost instantly...!<br>She's not gonna want to stop!
		player angry <i>For her safety, there's only one way to end this. Push her ass even farther, she looks like she's about to pass out!
		wolf ahegao Please...! My ass is so empty, I wanna cum again~<br>I never knew there... There was...
		wolf excited W-wait... Am I in heat already...?<br>mayorF said that once you arrived, oh I wish I'd listened better, what did she say...? shopkeepF too...<br>Something about... The things I do when in heat will be associated with pleasure, so I should be careful-
		im date2-7
		wolf ahegao OUUUGH~!!! <3<3<3
		player frown Cum already, and harder! Pass out before you're totally broken!
		wolf ahegao Houugh~!!! So... Thick...! And HUGE~!!!
		wolf torogao NGHHH~!!!
		t Her nerves sending an overwhelming amount of pure white, her brain is quickly overloaded.
		t Whatever she was thinking about before is soon gone, replaced, smushed, smashed by the feeling of a dildo too thick to process stretching her like a furry condom.
		player frown *Phew*... wolfF? Can you hear me?
		wolf ahegao ...
		player happy She's out! Like a light, this is great!<br>Wow, she took it like a real champ.
		player worried Hmm... If I remove it, she might cum hard enough to wake her back up... What should I...
		t *SCHLUUUU-RP*
		im date2-8
		player sparkle ... Awesome! The problem's solving itself!
		player happy I should go, best that she not be surrounded by heat pheromones while resting. <br>See you later, wolfF!
		wolf ahegao ...
	`},
	{index: "wolf-training1", name: "Training - Maso-slut Spanks", image: "wolf/training1-4",
	content: `
		t You decide to accompany wolfF home to help her train to become a perfect girlfriend.
		t ...
		im date3-3
		wolf happy Alright! If I'm going to be able to handle real sex, I can't be folding and quivering to just a touch.
		player worried But the very first time I ever touched you was enough to trigger-
		wolf frown A masochistic bitch-gasm, yes. But it was just a tiny one!<br>I'll improve my self control with something that barely even effects me!
		player happy Ah, I gotcha! We work on your already best side.
		wolf excited Y-yes... So don't hold back, alright? Don't stop until I've gotten used to the pleasure of your hands.
		im training1-1
		wolf Hoo~<br>That's it. Alright, feel free to be as rough with me as you please...
		player frown Alright. Here I go!
		t *SMACK*
		wolf torogao Ghhhg~! M-More~!
		t *SLAP* *SPANK*
		player Take this! And this!
		t *SMACK* *SLAP* *SPANK*
		im training1-2
		wolf ahegao Gaaaaaah~!!! <3
		player worried Alright, wolfF, are you-
		im training1-3
		wolf excited M-more~! Don't edge me, darling~<br>I'm about to cum~! Please, more~!
		player worried If you say so...
		player frown No, no hesitation! I've got to do my best~!
		t ...
		im training1-4
		wolf ahegao Houuuugh~<3
		player angry *huff*... *huff*...
		player worried wolfF... *huff*... <br> You've been making those hoarse howls for a while now...<br>And you keep shaking your butt asking for more, but...
		wolf ahegao Houuugh...<3
		player ... You're not conscious, are you?
		t With wolfF out of her mind in frazzled pleasure, it's clear training time is over. Heat sure does make folks act funny.
		t But before you leave, you give wolfF a reassuring pat on the cheeks.
		wolf torogao ...!
		t Though she just twitches in response.
	`},
	{index: "wolf-training2", name: "Training - Toy Endurance", image: "wolf/training2-1",
	content: `
		t You decide to accompany wolfF home to help her train to become a perfect girlfriend.
		t ...
		im date3-3
		wolf happy Last time was my first ever real anal experience, so naturally I was caught off guard a bit. But this time will be different!
		player happy Right, I bet you'll do way better this time!
		wolf excited Y-yes... Now, don't hold back with that, alright? Teach my perverted asshole a lesson~
		im training2-1
		player worried You're shivering... Though I don't think you're scared.
		player frown Alright! No hesitation! If my girlfriend wants to be the best she can be, I'll help her!<br>And no amount of squirting, shaking, or lewd howling is going to stop me!
		wolf excited Well sai-
		im training2-2
		wolf ahegao -iiiiIIID~!
		player sparkle Hey, it's going in way easier this time!
		wolf Houuuugh~!
		t Inch after inch of silicon pushes into wolfF's body, resulting in an increasingly loud howl from the buttslut-in-training, and so much femcum it's like you've turned on a faucet.
		player happy It's practically vanishing! How does it feel?
		im training2-3
		wolf torogao Ghhg, nnn...<br>Gh... Cumming~
		player shock Ah! We probably should have done some foreplay, huh?<br>Or, I guess the heat's messing with your body enough we didn't need any.
		wolf Ghhhk~<3
		player worried <i>She's having trouble finding words. I should probably pull it out.</i>
		t You grab onto the base firmly, and begin to tug.
		im training2-extra
		wolf ahegao OOOOUUHH~!!!
		t It's much more of a fight this time, her ass is sloppily holding onto every inch. Not helping is how she's wiggling so much she could be mistaken for having a seizure if not for the absolute torrent of howls, moans, and hose-like squirts of femcum she's letting out.
		player frown Would you just... Let... Go!
		t And with a mighty *POP*, her asshole's grasp relents and you fall backwards onto the grass.
		im training2-4
		wolf ahegao Houuugh~<3<br>Emp... Empty... Give it baaaack~
		player happy Another round then? Alright.
		player frown But don't hold on so tight next time!
		wolf I'll be a good bitch~<br>Give it back, stuff me up agaaaain~<3
		t It's unclear if she's actually listening to you or just rambling lewd nothings, but you get back to work.
		t ...
		t Training lasts a while longer, your arms burn like you've been churning butter, but wolfF's training is definitely finished and as a bonus her backyard is well-watered!
		player worried ... Be sure to rehydrate when you come back to reality, okay?
		wolf ahegao ...
	`},
	{index: "wolf-training3", name: "Training - First Anal", image: "wolf/training3-2",
	content: `
		t You decide to accompany wolfF home to help her train to become a perfect girlfriend.
		t ...
		im date3-3
		wolf happy Okay, this is for real! 
		player worried Are you sure you're ready?
		wolf frown Absolutely! I'm going to be the very best possible girlfriend, and that means I need to be able to handle a huge...
		wolf excited ... Girthy, fat, ass-stretchingly huge cock all the way until it cums!
		wolf worried *Ahem* But this is just practice, okay darling?<br>If we have to stop early...
		player happy No problem! I'll be gentle.
		wolf excited Not... <i>Too</i> gentle, ple-
		im training3-3
		wolf torogao ...!
		t You slowly thrust forwards, feeling wolfF's ass take you in, each muscle gleefully accepting you before tightening like a forceful, wet kiss.
		wolf It's...
		im training3-2
		wolf excited It's incredible~! It's even better than with toys... <br>The warmth, feeling you pulse inside me, everything about real dick is just amazing!<br>Cock is incredible~!
		t Her ass twitches but doesn't relent even an inch, even as she wiggles her butt with you still inside.
		wolf Fuck me~! 
		player worried Didn't you-
		wolf Fuck me hard, until I'm just a mewling little slut~!
		im training3-5
		wolf torogao Ghh~!<br>My ass is gonna breakkk~! Keep going~! <br>Yes, yesss! Fuck meeee harder and fill me~!
		wolf ahegao Ngghh~<br>This is the besssst~<br>My fucked-up, masochist, ass-whore brain totally thinks we're matinggg~<3
		t You thrust harder, faster, deeper, any pretense of 'gentle' has been lost now, this is just purely animalistic ball-slapping sex now
		wolf torogao NGGGHH~!!!<br><i>I don't think I'll be able to go back to normal...<br>Living a life without ever feeling this good again would be...
		wolf ahegao <i>I can't even imagine it~<br>Just one taste and I'm a total cock-craving buttslut~<3
		im training3-4
		t When you cum, it's a sudden, almost explosive finish strong enough to crash her train of thought and let her body's shaking do the talking.
		t Her first proper anal session finished, and her body now being exposed to your cum for the first time, you pull back. It's a tight fight to free yourself, her body is rigid and quivering all over.
		t But soon enough no longer kept standing by a rod inside her, wolfF's legs give out and she sinks to the ground.
		im training3-6rosebud
		wolf torogao ...!
		t Face down in the grass, wolfF quivers, her body experiencing a very overwhelming delight.
		t While your training for today should definitely stop here, it's clear you'll need a lot more time with her before she can get used to your body, and what it does to hers.
	`},
	{index: "wolf-date4", name: "Public Display of Affection", image: "wolf/date4-3",
	content: `
		im date4-2
		t wolfF fidgets on her seat, a strange look in her eyes.
		player Everything alright?
		wolf happy Of course, darling! I'm the belle of the ball, the apple in every townsfolk's eye, it's exactly what I was hoping for.
		wolf excited Although... Darling, I think I've grown to enjoy rewarding you more than I expected...<br>I can't quite seem to get my mind away from... Well... You know...
		player happy Should we head back home?
		wolf I don't think we need to do that.<br>A quick bit of fun should be enough, then we can get back to our conversation.
		player shock Eh? But we're in public!
		wolf I don't mind an audience~
		player worried ... Well, mayorF did say I should try and spread my pheromones as much as possible...<br>Won't we get in trouble?
		wolf shock Hardly! Darling, as far as I know you're here to fix a breeding crisis here in town.
		wolf excited What better solution could there be than showing everyone how wonderful being fucked is?<br>Here...
		im date4-3
		wolf happy Will <i>this</i> help clear your worries away?<br>Does your fat-bottomed girlfriend's ass in your lap help clear your mind?
		player excited W-well...
		im date4-4
		wolf excited Hmm~?<br>Well what?<br>The only trouble you could possibly get in would be if mayorF herself got mad you were plowing my ass instead of knocking me up.<br>So if you <i>really</i> don't want to get in trouble, you should hurry and fuck this needy hole before anyone notices which one you're stuffing~
		im date4-5
		wolf excited Hah~<br>Why, darling~<br>You found your nerve~
		im date4-6
		wolf pleasured Ghhh~
		wolf excited C-careful you don't th... Thrust too hard~<br>But don't be gentle either~<br>Maybe it's the fruits of our training, but I feel like if you don't absolutely rape my asshole until I'm a squirting, gooey mess, I just won't be sa...
		wolf ahegao Satisfied~!
		im date4-7
		wolf Hhhaaaaa~!!!
		player torogao Hooo... C-cumming...!<br><i>With how she reacted to my cum the last time, she'll surely be...
		player excited <i>Surely... Be...
		im date4-8
		wolf excited Darling~?<br>You look surprised, I won't be satisfied with just a quickie, you know~
		player Oh boy...
		wolf excited Oh, this is all very very wrong...<br>This isn't a reward for you at all, is it? This is all for me~
		t As your date continues on into the late hours of the day, you at least take comfort in the fact that your antics didn't draw in <i>too</i> large of a crowd.
		t ...
		special You've become best friends with wolfF!	
	`},
	{index: "wolf-dateNude", name: "Nudity is Dangerous", image: "wolf/dateNude-1",
	content: `
		wolf shock O-oh... D-darling~
		player Hmm? Something-
		player shock Whoa! I forgot to get dressed today! I'm sorry wolfF, I'll-
		wolf excited Hold still-!
		player Wah!
		im dateNude-1
		wolf excited You're cruel, darling. I really need time to mentally prepare whenever you visit.<br>You can't just show up out of the blue, radiating that lovely sweat and precum that turns me into a broken bitch...
		t Though she turns around, she clearly has no intentions of letting you go.
		wolf excited I'm going to teach you a lesson, understood? C-clothes are important, for b-beauty, and d-decency!
		im dateNude-2
		wolf ahegao Oh fuck, your cock spreads my ass so good~<3
		player excited Ghh~
		wolf Take this~! And this~! I'll punish this naughty, naughty cock with my unbeatable, perfect asshole until you promise t... To...
		player ahegao Cumming~!
		wolf ahegao Oohhhh~!!! Promise to fill my fuckpipe with your hot, human seed~!
		t ...
		im dateNude-3rosebud
		wolf Nghh~
		player ahegao Ghhouuu...! Gonna...!
		t Bombarded by your scent right away, approaching wolfF while nude resulted in your afternoon being stolen away by the tight embrace of a bitch's lower lips.
		t Eventually she runs out of juice. The metaphorical kind, although she squirted plenty as she ravaged her own asshole on your cock. And you're able to leave before the heat-addled she-wolf can recover in time to mount you again.
	`},	
	{index: "repeat1", name: "Repeatable - Oral", image: "wolf/repeat1-1",
	content: `
		player worried You sure you're ready?
		wolf happy Of course, darling~!
		im repeat1-1
		wolf I've had that fat rod of meat stirring up my lower hole how many times now?<br>Surely it can't be any harder going in the other way, hmm?
		player happy Well, you raise a good point. You know, I think most couples start with oral, actually.
		im repeat1-2
		wolf sparkle Oh my, darling~!<br>I can certainly see why!<br>Getting such a close look~
		wolf excited It feels so large~!<br>I bet it'll feel even more intense the next time you pound my butthole~<br>It just goes to show there's merit to the more traditional sort of relationship, yes?<br>Not to mention how well my throatslime will smooth out our next bit of anal play~
		wolf ahegao Hah~<br>I can't wait anymore~!<br>Bon appetit~!
		im repeat1-3
		wolf excited Mmm~!<br><i>How delightful~!<br>Ah, must make like a good bitch in he-<br>... Girlfriend, and kiss lovingly~<br>
		wolf ahegao <i>Before I...<br></i>*GLRRK*
		im repeat1-4
		wolf excited <i>Ohh~<br>What a delightful flavor~<br>Is it mine? Maybe some other whore's taste~<br>No, no, this could only be...</i>
		wolf ahegao <i>The pure taste of my human *boyfriend's cock~!</i>
		t Her head bobs up and down, to her credit she actually makes this slutty dance of oral pleasure look somehow... Romantic?
		t Mostly due to the absolute look of honeymoon-esque love in her eyes as she throats you.
		wolf excited <i>Ah, a twitch~! And my butt is positively throbbing~<br>My body's been trained, I know what this means~</i>
		wolf ahegao <i>Cum for me, my darling~! Onto the tongue, let me taste it this time before you fill my stomach~!</i>
		t She pulls her head back and locks eyes with you, her brain all lovey-dovey.
		im repeat1-5
		t Each throb of your cock is a fat load of cum on her tongue, followed by juuuust a second of waiting and a happy coo, letting her mouth fully soak it in, before her throat bulges as she swallows it down.
		im repeat1-6
		wolf ahegao Guh~!<br>Ahaha~! Wowww~!<br>My head's all aflutter~!<br>I'm barely conscious after getting my ass pounded, is this what I'd feel like if I was fully aware?<br>But even more intense?
		wolf excited Ooh~<br>This taste~<br>Has my ass taught my body to crave this?<br>Ohhoohoohoo~
		wolf ahegao M-my, if I'd known what this delightful slime does to my head earlier, I definitely would have started with oral~<br>Oh, but the sheer body-quaking orgasm from having my ass fucked for the first time, I wouldn't want that to be any less intense~
		t It seems she's off in her own little world now.
		wolf excited Hah~<br>But a good girlfriend lets you use whatever part of her you want, right? <br>Ass, mouth, both in any order you'd like~! Ahaha~!
	`},	
	{index: "repeat2", name: "Repeatable - Vaginal", image: "wolf/repeat2-2",
	content: `
		im repeat2-0
		wolf excited Ehehe~<br>It's finally time to go all the way, right?<br>The most special of things you can do with a girlfriend?
		player worried Hmm...
		wolf happy If you're worried about my hymen, it's fine.<br>Humans have those too, right? I remember reading they're usually associated with virginity, which is a little weird since they tear easily from lots of things besides sex.
		wolf sparkle Oh, but if you're a virgin, since I don't think buttfucking counts, that's fine too!
		player happy Actually-
		wolf excited No no no, nevermind! Let's get to it!<br>You've splurted plenty of cum in my guts, what's the harm in feeding my snatch a little? I bet I'd be great with kids!
		wolf sparkle Cute little babies~<br>Ooh, I'd buy little outfits and we could wear matching clothes~
		wolf worried Hmm, I'd have to buy a lot of fabric...<br>Oh, and some for me too!
		wolf excited If getting bred feels even half as good as assfucking I don't think I'll be spending much of the rest of my life with a slim figure~
		t You sigh as she yaps, totally lost in her own little world until you snap her back out if it.
		im repeat2-1
		wolf sparkle Cock~! Ooh, I knew you felt the same way!
		t Luckily her canine side shines through when you wave a treat in front of her. She has a manic look in her eyes.
		player worried <i>The heat might be causing her to bite off more than she can chew for real this time.<br>But if I don't give her what she wants quickly, that creates its own problems...</i>
		player frown <i>No, if she believes in herself, then I believe in her too!</i>
		im repeat2-2
		t A fire of determination lights inside of you as you rub yourself against her sopping snatch.
		wolf excited Ehehe~<br>Hurryhurryhurry~!
		t And that's as long as she's willing to let the foreplay last.
		im repeat2-3
		wolf happy Oooh~<br>It's so... 'Zingy'?<br>It's not as 'Pop!' as anal is...
		wolf excited But this certainly has its own appeal too~<br>It's like my body's being filled with a warm, gooey, feeling of love~<3<br>Like a happy hug from the inside~!
		im repeat2-4
		wolf torogao Nghh~! M-more~! Please more~!
		t Her body is a quivering mess, shaking and shivering as she begs for more.
		wolf excited It's so weeeeird~! It's like I'm scratching an itch I didn't know I had~!
		im repeat2-5
		t Your spine tingles as you feel a gentle sensation waiting as you hilt yourself balls-deep in the wolf-girl's cuntmeat.
		t Whether it's her shortstack physiology or a byproduct of going into heat causing her womb to descend and be extra receptive, it's as though the head of your cock is getting kissed by her cervix at the end of each thrust!
		wolf ahegao Houuuuuh~!
		player torogao Gonna...!
		wolf excited Yes! I-<br>I...
		t Like she's suddenly snapped out of a haze wolfF suddenly looks confused.
		t Sexual noises, plaps, fluids both hers and yours, fog and noise both suddenly clear and leave her with an overwhelming sense of clarity as she feels present in the moment.
		wolf shock Wha...?
		im repeat2-6
		t A tingling sensation spins around her womb as the bulge travels up until finally unleashing itself.
		t Her pupils dilate.
		t Her eyes go wide and roll back.
		t She lets out a wordless, through-grit-teeth whine as a brain-rattling cum-quake capable of turning grey matter into white goo passes through her.
		im repeat2-7
		wolf torogao ...!!!
		wolf ahegao H-hot! F-feels h-hot!
		t And when it comes back there's a jitter to her voice as she's suddenly thrust back, like all the tolerance she's built towards her heat has suddenly been stripped off.
		wolf torogao I'm...! Being...!
		wolf ahegao BRED~<3<3<3
		wolf torogao NGHHHHH~!
		im repeat2-8
		wolf ahegao HOUUUUUUUUH~<3<3<3
		t Her half-scream half howl is the only thing you hear as she's suddenly overwhelmed by the sensation of her virgin womb's cum-baptism.
		im repeat2-9
		wolf ahegao HOUUGHHH~<3<3<3<br>PUPPIES~! I'M GONNA HAVE PUPPIES~!
		t Though you aren't totally sure if it's enough to get her pregnant, you're sure she's going to be feeling this for a while.

	`},	
	{index: "repeat3", name: "Repeatable - Heavy Petting", image: "wolf/repeat3-1", requirements: "?flag "+character.index+" repeat3;",
	content: `
		wolf amused Hmm? Darling, you don't need to ask permission for something like that, I think turning me into your lover slash buttslut is a few steps past a bit of petting.
		player love Hohhh...
		im repeat3-1
		wolf happy ... Is this doing it for you?
		player excited Yeeeeshhh~<br>It's everything I dreamed of...
		wolf amused Well, pet away.<br>It is quite nice, actually.<br>I can tell that my training is paying off too, this'd be a bit to handle if I were the same woman you first met.
		wolf surprised Actually, now that I think of it, didn't you bring up petting around our first meeting?<br>You've been waiting for this for a while, haven't you?
		player perverted Mhmmmmhmhm~
		t It's a completely addictive form of bristly fluff, she has the fur of a well-preened but independent beast of the woods.
		wolf excited Well, darling, if you like that, you could pet some... Other places~<br>You fluff-maniac you, does any other part of your girlfriend's body have you aching to give it a rub?<br>My breasts? Ass?
		player Hmm~! Fluffy ears, scritchy scritchy, good girl!
		wolf pent Mmm, this isn't foreplay, is it?<br>My thick thighs can't tear your heart away from adoring my ears?<br>I think mother mentioned this once, she had a partner who treated her like an <i>actual</i> pet for a time. She said it was strangely enticing compared to the usual rougher treatment. Belly rubs were esp-
		player love Belly rubs? Belly, tummy, tum-tum rubbing? Fluff?
		wolf excited Ooh, I see what she meant~<br>Well, it isn't the same as seducing you with my ass, but I adore seeing you melt like putty all the same~<br>Yes, yes, come here, come adore your girlfriend's belly~
		player perverted Hmmm~<3
		im repeat3-2
		t Your hands sink into an absolutely delightful chub. This is pure, unadulterated, concentrated girl tummy! 
		player excited Who's a good girl? Who's my good puppy?
		wolf perverted Mmm~ Darling, I've never seen you lose control like this!
		player excited Ehehe~
		player befuddled ... Wait. What's this hard spot?
		wolf pleasured Oohh~! Keep going, and put pressure on that spot! I... Gh... I wore something special for you today, you know!<br>Come now, is a little accessory stopping you from enjoying your girlfriend's body?
		wolf perverted Mmmgh~<br>C-can you see it from the front? The handle's the same radius as the beads... Here... Ghh! Let me... Make your girlfriend's tummy softer for you... And give you a better look too!
		im repeat3-3
		wolf torogao Nnngh~! Fuck, my body's so relaxed I can barely hold on~<br>Ghh, cumming~
		player awe ...!
		wolf afterglow Hah... M-my, I was planning on having you torment me a bit with those today, but all that affection you've showed my middle loosened me up a bit...<br>Now, that tummy you love so much has no more of those fat anal beads stirring me up, do you want to touch it again? Maybe bury your face in it this time?
		player love Y-you... You don't know what you're offering me...<br>I... Might go over the deep end if...
		wolf flirting Darling! You just watched me have an anal bitchgasm from a string of beads each the size of my fist.<br>You could fall to your knees and cum clean through your clothes the moment your nose touches my navel, and I'd still gladly accept you just as you are.
		player love Hohhhh~<3
		t As wolfF gently places her hands on the back of your head, you don't have the strength to keep your mind intact.
		t Everything goes white. Your soul goes to fluffy fluffy heaven, but your brain isn't strong enough to save the details to memory.
		t ...
		t Your eyes slowly open as you return to the land of the living. How many hours have passed?
		wolf sleep Zzz...
		t wolfF is on her bed, asleep. Every inch of fur on her body is messy and unkempt, but has clearly been loved.
		player love I... I'll need to last longer, enjoy it more... Next time.
	`},
	{index: "morning1", name: "Morning - Solo Fun", image: "wolf/morning1",
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, and dawn is shining through wolfF's window.  
		im morning1
		wolf sleep Haaaaah~<br>Another bright and sunny morning...
		wolf sparkle Which means it's perfect weather for a day on the town!<br>Let's see...
		t ...
		outfit wolf crimbus
		im morning1-2
		wolf worried Well, it's certainly cozy, but...<br>No, not cold enough for you. <br>Not yet, anyways...
		t ...
		outfit wolf alt
		im morning1-3
		wolf worried Hmm, too gaudy. <br>Plus, the green on this one seems a little... <br>Off, somehow.<br>Oh, another red dress had better not have gotten mixed in again!
		outfit wolf nude
		t ...
		im morning1-4
		wolf worried Ugh, nothing seems to...<br>Hmm...<br>If I were to visit the human wearing nothing at all, maybe *he'd...
		wolf excited Ehehe~ *He'd probably...
		wolf shock N-no, let's try and focus and be productive today!<br>...
		wolf excited ... After I clear my head a bit, of course~
		t ...
		im morning1-5
		wolf torogao Mghhh~<br>So huge...
		wolf excited N-need to try and pick up the pace... Can't just spend the entire morning masturbating with my asshole~<br>I'll...! just cum...! Once...!
		im morning1-6
		wolf ahegao Or...! Twice~! Houuhgh~!

	`},
	{index: "wall1-1", name: "Hole in the Wall - Fashionista", image: "wolf/wallRear-01", requirements: "?trustMin wolf 7;",
	content: `
		player happy Sounds like the wall's occupied today.
		carpenter sleep Yep. If you could help her out, I'd appreciate it.<br>I tried to make the space comfortable, but it seems like she isn't happy with it.
		t ...
		im wallFront-02
		wolf worried Awooo~<br>...Maybe this was a mistake. This wall completely clashes with my aesthetic.<br>I could have been on a normal date, maybe worn a longer dress and let the wind flash these beads...<br>Though, the clacking sound would probably give me away...
		im wallFront-01
		wolf sleep Hmm? Could it be...<br>*Sniff* *Sniff*
		im wallRear-01
		t *Wiggle* *Wiggle*
		wolf sparkle Oh, darling~! My knight in shining armor, here to rescue me from a dreadfully plain afternoon~!
		player happy Hello wolfF~<br>You alright in there?
		wolf frown Absolutely not! The space is comfortable enough, but the color of the wall is simply <i>not</i> flattering me.<br>Not only that, but the space is hiking up my dress! Can you even see it?
		player worried Uh... Sure?
		wolf angry Oh? What color is it?
		player shock ... Green?
		wolf ...
		im wallFront-04
		wolf sparkle That's exactly right! I was thinking I'd try emerald, but classic, base green, also sometimes called "office green"-
		player happy Was the best shade that matched your anal beads?
		wolf Ohoh~<br>You noticed those too?<br>They've been the only thing keeping me company. There's a prize at the end, if you'd like to take a closer look-
		player sparkle A prize?!
		im wallFront-06
		wolf pleasured Hhhooou~?!
		im wallRear-02
		t *Plop* *Plop* *Plop*
		player And...
		im wallRear-03
		t *PLORP*
		player worried ... Eh?
		wolf ahegao Hah... Hah...<br>M-my, impatient, aren't we...?<br>You're lucky I'm in a masochistic mood today~
		player sleep Oh wolfF, you're in a masochistic mood every day!
		wolf happy Hmhm~<br>Perhaps. But, watch closely, alright?
		im wallRear-04
		wolf excited Hmmm~!
		im wallRear-05
		im wallFront-03
		wolf excited Hooh... Entirely back to perfect, pristine tightness~
		player sparkle Wow! You've been practicing, haven't you?
		wolf sleep Mhmm~!<br>At this point, even these beads are no match for me!<br>I'd be no good as your little buttslut bitch if a few fist-sized chunks of plastic turned me loose.
		wolf excited Now, darling, this hungry wolf's put on a show, how about you provide the dinner?
	`},
	{index: "wa1-2", name: "Hole in the Wall - Fashionista", image: "wolf/wallFront-07",
	content: `
		im wallRear-07
		wolf excited Hurryyy hurry hurry hurry~!
		player sleep Hah... Guess we're skipping over romance today, hmm?
		wolf blush Never~!<br>As my *boyfriend, I expect you to always make time for romance~!
		wolf excited And don't worry, I accept plenty of different ways of showing love~<br>Spreading my ass in the place of holding hands.<br>A kiss, not with our lips, but...
		im wallRear-09
		wolf excited Hmmm~<br>With the tip of your cock and my wonderfully sensitive pucker~<br>But I won't be satisfied with a peck on the cheek, you understand?<br>I want a deep, sloppy-
		im wallRear-10
		im wallFront-05
		wolf ahegao Goooouuuuh~!<br>Hoh... Awooo~ playerF~?
		player excited Big, fluffy wolf tail...<br>Err, that's me! Should I join in the howling?
		wolf excited Hmm~! Ghh~!<br>I'd prefer a different sort of howling, honestly~!
		wolf ahegao Hoouuh~! You're likely to push me through the wall with how hard... You're... Breakinggg~!
		im wallRear-11
		wolf torogao My ass~! Cumming~!
		im wallRear-12
		wolf Hoooouuuuu~!
		wolf ahegao Your... Love... Waaaarm~
		im wallRear-13Rosebud
		player sleep Another wallbutt customer satisfied~
		wolf Awooo~<3
	`},
	{index: "pill-wolf", name: "Denial Pills - Fashionista", image: "wolf/pill1-3",
	content: `
		player forced Ghh~! Need... To cum...<br>wolfF! Need... Girlfriend...!
		t *KNOCK* *KNOCK* *KNOCK*
		wolf sleep Hmmm hmm hmm~<br>Who ever could it possibly-
		wolf shock Darling!?
		player Took... Special pills... Balls-
		t *GURGLE*
		wolf frown Say no more! Your lovey-dovey girlfriend will have those balls empty in no time! Can you make it inside to the bed?
		player torogao Gghhhg~! No!
		wolf frown Not a problem!
		im pill1-1
		t Without hesitation, wolfF is on her back folding her legs up, presenting her pussy and asshole.
		t You don't have any time to waste, so you take the hole you know is stretchier.
		im pill1-2
		wolf torogao Ngghh~! What... Is...!
		t It's an extremely unusual form of pleasure, even to the town's top buttslut. No thrusting needed, your hypercharged balls are spluttering fist-sized globs of clear before and during your insertion.
		player ahegao Hohhhh~! Cumminggg~!
		wolf shock Already?! And this amount-
		im pill1-3
		wolf torogao Nhhhhhwhaaaaaat?! Ish~!? Thish~?!<br>Belly~! Shtuffed~<3?
		t It seems the quickest way to a girl's brain is through her butthole, specifically the fastest way to get her to a fucked-stupid slurry state is to cumflate her belly with supercharged ballstew. Who knew?
		im pill1-4 ?fetish atw;
		wolf shock Bllggh-<br>BLGGGGHHH-!?fetish atw;
		im pill1-5 ?fetish atw;
		t You feel like a massive weight is off your shoulders, and off your nuts too. You can't tell for sure, but it feels like they're hanging lower than before as your orgasm draws to a close.
		t wolfF's house is very nice. You don't remember it being so tilted sideways.
		t Oh, you're falling forward. Thankfully you have your girlfriend's big, soft belly to cushion your fall.
		t ...
		im locations/interiorWolf-Night
		player tired Mghhhh~
		t You wake up inside wolfF's home, feeling like a sack of bricks, if half the sack of bricks was converted to jelly and squirted out into its brick-sack girlfriend's rectum.
		player ... I don't think I'll use that metaphor again.
		wolf worried You awake? Ghh... Feel free to rest if you need it...<br>So...So much cum...<br>Don't hesitate to come to me again if you need help, okay?
	`},
	{index: "cherry-wolf", name: "Star-Crossed Cherry - Fashionista", image: "wolf/cherry1-1",
	content: `
		define playerduo = dual sp1 player; sp2 player;
		wolf happy Come iiiiiin-
		player After you, bestest bud.
		player joy Only if you're right behind me, chum!
		wolf joy I'm in the bedroom, be out in a second!<br>Darling, I'm so glad you came by, I've been working on this new trick and I thought it'd be a lovely surprise!
		player joy We have a surprise for you too!
		player happy Actually, hey, we should probably strip before she comes in. Only one of our clothes is made by cherry magic, after all.
		player sparkle Good point, you're so smart! And hey, I'll help you get undressed, and you can take my clothes off!
		wolf sleep You okay, darling? Did you say "we" earlier? And it sounds like there's someone else-
		im wolf/cherry1-1
		wolf love Whaaa in the... Whawawa~?
		player amused Whoa, I really do have a huge pair of thighs.
		wolf love Abuh... Buhbuh...
		player blushy Jeez! Hey, I don't know what part of undressing means squeezing my butt!
		player smug The fun part, duh!
		im wolf/cherry1-2
		wolf love Amuh... Whuhhh...
		player pout H-hey! That almost seemed like you were trying to tickle me!<br>Just so you know, whatever you do to me, I'll double it back at you!
		player excited Oh yeah? Well what if I did... This?
		wolf awe ...!!!
		im wolf/cherry1-3
		t *TINK*
		player horny Ooh! Hey, are you trying to awaken something in me?
		player excited Maybe, or maybe I'm just having a little bit of fun~
		player perverted Mmh-
		wolf orgasm ...!!!
		im wolf/cherry1-4
		t *SPLSHHHHH*-
		t *THDDDDD*
		player pent Hff... Uh... wolfF?
		player panic H-hey there girl, can you hear us?<br>How many fingers are we holding up?
		wolf broken ...
		player scared Uhh... Quick, you take her arms, I'll carry her legs!
		t ...
		t After depositing your girlfriend in her bed, you and your true soulmate sit and wait with bated breath.
		player worried Think we went too far?
		player tired She just got overstimulated is all. We-
		wolf tired Mghhh... Where-?
		playerduo panic Oh thank goodness! You're awake!
		t Instantly rushing over to her side, your other other half stumbles, stubbing his pinky toe on-
		t *POOF*
		player scared THIGH-DENTICAL TWIN, NOOOOOO!
		t All too soon, the world lost one of its most precious, innocent wonders.
		player crying *He was so young, why do they always die young!<br>Ahu, ahu huu...
		wolf tired ... What is going on? I was seeing double for a minute there.
		player We...<br>*Sniff* <br>We just watched the world get just a bit quieter, a bit darker, and a lot lonelier right before our eyes.
		player worried But... That's all the reason to bring even more light into it.<br>I'm gonna keep living. It's what *he would have wanted.
		wolf ... Okay? That's good.<br>I'm still feeling woozy, darling, I don't think the pheromones are playing nice with my brain today.<br>That, or maybe three feet of silicon was too much for me... No, that couldn't be it.<br>Either way, rain check?
		player sleep Sure thing. See you again soon!<br>Oh, and your buttplug's in the foyer, your super huge dildo too!
		wolf Thank you, darling. Come back and be gay again sometime, please.
		wolf befuddled ... Huh?
	`},
	{index: "watch-start-wolf", name: "Time Stopwatch - Fashionista pt.1", image: "wolf/watch1-4",
	content: `
		player sparkle wolfF~!
		im watch1-1
		player crying Waahhh... I forgot she can't talk when time is stopped...<br>I miss her saying "Darling" in that accent of hers...
		player worried Wait, did she have an accent? Have I been surrounded by silence for so long I've forgotten my own girlfriend's voice?!
		player scared Oh God, how long have I been trapped in this silent nightmare?! The insanity is already creeping in!
		t Note: It has been, at most, maybe half an hour.
		player panic Okay, okay, calm down. Don't panic.<br>Wait, I know how to solve this...
		im watch1-2
		player sleep Hahhh~ Perfectly preened wolf fluff~<br>Truly, the only balm a blistered soul could ever need.<br>Well, I guess cat whiskers are a need too. And a wagging dog tail, and...
		player shock Wah! I got carried away.<br>I forgot, this is about trying to have fun.<br>Let's see... wolfF did me a real solid by standing outside today, I'd be a flailing body on the street if not for her fluff. I should pay her back.<br>But what would she want?
		player sleep "Oh, daaaaahling, I'd be happy with any gift from my one and only *boyfriend!<br>Buuuut, I would <i>never</i> turn down a chance to bond with you~<3"
		player sparkle So, more fluff huffing?!
		player sleep "Daaaaahling~! Of course! But I was thinking more along the lines of rough anal sex until i'm fucked totally silly~!"
		player amused Hah... Oh you, alright, you've convinced me. Turn that big, bouncy butt over this way.
		wolf happy ...
		player worried ...<br>Oh, right. Time is stopped. Am I stupid?
		t You grasp wolfF by the hips, she's actually very light! 
		player sleep That's not because time is stopped or anything, a *gentleman's girlfriend is always light as a feather.
		t ... Though, despite knowing how to behave respectfully, you still make a concrete dragging sound in your head as you turn her.
		t ...
		player pent Hooh...
		im watch1-3
		player amused And like that one guy who painted that one roof probably said, "I have completed my masterpiece"!
		player happy I wonder if wolfF would know who I mean by that. She seems artsy.<br>wolfF, let's go on a normal date after this sometime, okay?
		wolf happy ...
		player sleep ...<br>"Daaaahling, of course~! I'd love to~! Bonjour, bon bon, arrivederci, snafuuuu~!"
		player befuddled ... Either this watch is sapping my intelligence, or I should absolutely never be left alone with my thoughts.
	`},
	{index: "watch-finish-wolf", name: "Time Stopwatch - Fashionista pt.2", image: "wolf/watch1-5",
	content: `
		t ...
		im wolf/watch1-4
		wolf happy -ine, the laundry-
		wolf torogao ...!?!?
		im wolf/watch1-5
		t A silent scream passes through grit teeth as wolfF stands stock-straight, before her back arches as she grips her asscheeks and her eyes roll.
		t And in the next moment she's fallen backwards, her legs kicking and twitching.
		im wolf/watch1-6
		wolf torogao ...!!!
		t She can't muster a single noise as hot white spots flash across her vision. Her butthole clenches around a phantom sensation as the pleasure of a hundred thrusts barrage her nerves, as the warmth of a thick load of human cum radiates a happy white in her rectum, as two, three, who knows how many anal orgasms are suddenly transformed into a single, powerful squirt.
		t Fashionista, girlfriend, buttslut, her memories and sense of self skip a beat as her brain goes full white, and she falls backwards.
	`},
	{index: "wolfMorning-sadogato", name: "Fashionista's Closet - Sadogato", image: "wolf/wolfMorning-sadogato2",
	content: `
		t Morning comes, it's a busy day in wolfF's house as her guest tries on a new outfit.  
		sado frown Hmm. This is...
		im wolf/wolfMorning-sadogato1
		sadogato Acceptable.
		wolf sleep I like this one. It has this sort of elegance to it that perfectly matches you.<br>Oh, if only I could get a skirt actually made from flowing liquid gold...
		sado Such clothing exists?
		wolf amused Absolutely~! In fact, my mother tells me that in human culture some women even mix gold into the air, and spray it onto their bodies directly!
		sado shock My goodness! Actually, my mam- Mother said something similar once!<br>I thought she was talking about a spell, but that's just something humans can do?
		wolf sleep Absolutely Madame sadoF. Understanding human fashion became my life's work for a reason, after all. They're capable of incredible things.
		sado frown Indeed. And you've proven yourself very knowledgeable on the subject too.<br>Actually, I have just one more question.
		im wolf/wolfMorning-sadogato2
		sado curious What exactly is the purpose of this thing?
		wolf sparkle Ohoh, I'm so glad you asked!<br>That green gem plug perfectly matches your eyes!<br>And as you know, the eyes are the window to the soul!
		sado frown ... I see. Hmm.
		sado worried <i>Oh... It's so obvious now that she's said it!<br>I'm looking like a complete fool!<br>Alright, think, what else did mama teach me of human fashion? I have to say something smart at least once, or a genius like her won't even think about inviting me over again!</i>
		wolf smug You know, I have several larger ones, actually...
		sado frown Hmph. And the bigger the window the better, yes?<br>Bring them to me.
		wolf sparkle Oh, an excellent choice, absolutely! Now, this ones a bit smaller, but it's a vibrating type. And this one's... Alley-oop! Hooph!<br>I know it looks imposing, but believe me, when all two feet are deep in your guts training your butthole into a proper asspussy...
		sado worried <i>... I may have made a mistake.</i>
	`},
	{index: "wolfMorning-nun", name: "Fashionista's Closet - Nun", image: "wolf/wolfMorning-nun2",
	content: `
		t Morning comes, it's a busy day in wolfF's house as her guest tries on a new outfit.  
		nun flirting Mmm, yes, I think this one has merit~
		im wolf/wolfMorning-nun1
		nun You certainly have quite the eye for these things~
		wolf sleep I should certainly think so~<br>After all, I'm putting my very best into this partnership. I have to, for all you're putting in too.
		nun blushy W-well, you're helping me a great deal as well.<br>I knew playerF appreciated the tail, but I didn't expect *he'd have a strong fixation on butts too...
		wolf smug Ehehe~
		im wolf/wolfMorning-nun2
		wolf Well, with an ass like yours, I think you'll put my techniques to great use!<br>Now, your end of the bargain! I want to know aaaaall about all those lovely terms and phrases you said you had that excited them!<br>"Wobblecakes", that was the last one, yes?
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