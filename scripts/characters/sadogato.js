var character = {index: "sadogato", flags: "", fName: "Sharly", lName: "", color: "#65363D", outfit: "nude", emotion: "frown", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "female"};

var logbookArray = [
	"im images/sadogato/nude/frown; title Magical Madame; The mysterious Madame sadogatoF, the black cat magician, witch, and resident fortune teller of Syrup Town. <br>Rarely ever seen without a frown and a soul-piercing glare, she definitely makes everyone around her just a little bit nervous. <br>Still, she's never turned away a guest, and offers her fortune telling services entirely for free. <br>The gossip goes that if you're brave enough to get your fortune told, good luck will definitely follow. There's even a rumor that Madame sadogatoF goes out of her way to make sure her good fortunes come true.",
	"im images/sadogato/logbook2.png; title Golden Accessory; ?trustMin sado 3; Though she owns some mystical chest bindings, aka some random bandages she'll sometimes wrap around her top, Madame sadogatoF often goes completely nude aside from a solid gold choker she wears around her neck. In ancient times, felines would wear neck accessories to show their complete dominance over their human servants, or so the legends go.<br>This does have the side effect of instantly showing off her totally nude body to anyone who looks, and if you look carefully enough you can see the effects that going into heat is having on her. While her face is stoic, the beads of sweat running down her body, and growing wetness of her pussy tell a different story.",
	"im images/sadogato/logbook3.png; ?trustMin sado 4; title Itty Bitty Kitty Titties; Data-gatherers around town hotly debate whether Madame sadogatoF or shopkeepF should get the title of their tiniest kitty titties in Syrup Town, but no conclusion has yet been reached. Even if someone were brave enough to offer to measure them, she'd clearly refuse. <br>It's a matter of pride, you see, absolutely not because her small breasts have all the sensitivity of massive melons crammed into a smaller space.<br>And don't get it into your head that she could just increase her breast size with magic. She'd never waste her mystical arts on such a waste of time. <br>Not to mention, what if it backfired and, hypothetically, supercharged her breast and nipple sensitivity tenfold, preventing her from wearing even the thinnest of silk shirts? That would be awful, and totally embarrassing to a practiced mage.",
	"im images/sadogato/logbook4.png; title Hypersensitive Rear; ?trustMin sado 5; In your time since meeting her, it's clear sadogatoF's not amazing at expressing herself. With her witchcraft requiring a steady mind at all times, she prefers to remain calm and stoic.<br>And the only reason you know this of course is because the moment you slap a hand on her asscheeks, her deeply repressed masochistic urges break out for just a moment. It's true, sadogatoF is wound so tightly she could cum just from spanking, or nipple pinching, or pressing a cock right up against her face and filling her lungs with cockstink, or...<br>Well, you get the picture. ",
];

var achievementArray = [
	{index:"!collect5", frame: "ultraRare", name: "Tarot Collector 1", requirements: "?collectables tarot; 999;", description: "Find every possible tarot card.<br>Hint: Some can only be found in certain places and with tools like the fishing rod.", image: "sadogato/achievement2",},
	{index:"5"+character.index+"Friend", frame: "ultraRare", name: "Cat's First Friend", requirements: "?trustMin "+character.index+" 6;", description: "Look past sadoF's rough personality and become her first friend.", image: "sadogato/achievement1",},
];

var itemsArray = [
];

var shopArray = [
];

var pickupArray = [
	{index: "sadoClothes", requirements: "?flag sado House; !item Chest Wraps;", top: 30, left: 20, event: true, size: 10, image: "items/question"},
	{index: "sadoMama", requirements: "?flag sado House; !flag sado mama;", top: 30, left: 20, event: true, size: 10, image: "items/question"},
	{index: "sadoTarotIntro", requirements: "?flag sado House; !item tarot0; !flag sado tarot0;", top: 30, left: 20, event: true, size: 10, image: "items/question"},
];

var morningArray = [
	{index: "morning1", priority: 99, requirements: "?trustMin sado 6;", unique: true,},
	{index: "reading3", priority: 99, requirements: "?trust sado 2;", unique: false,},
	{index: "sadoMorning-hyena", priority: 1, requirements: "?trustMin sado 1; ?trustMin hyena 1;", unique: false,},
	{index: "hot-1", priority: 1, requirements: "?trustMin sado 6;", unique: false,},
	{index: "bath-1", priority: 1, requirements: "?trustMin sado 6;", unique: false,},
	{index: "sadoPatIntro", priority: 40, requirements: "?trustMin sado 8; !flag sado patIntro;", unique: false,},
];

var encounterArray = [
	{index: `intro1`, name: `Introduce Yourself to a New Neighbor`, requirements: "?location riversideRoad; ?trust sado 0; !flag player intro;", altName: "", altImage: "",},
	{index: `reading1Start`, name: `Visit sadoF`, requirements: "?location riversideRoad; ?trust sado 1;", altName: "", altImage: "",},
	{index: `reading4Start`, name: `Visit sadoF`, requirements: "?location riversideRoad; ?trust sado 3;", altName: "", altImage: "",},
	{index: `reading5`, name: `Visit sadoF`, requirements: "?location riversideRoad; ?trust sado 4;", altName: "", altImage: "",},
	{index: `statusQuoIntro`, name: `Visit sadoF`, requirements: "?location riversideRoad; ?trust sado 5;", altName: "", altImage: "",},
	{index: `House`, name: `Visit sadoF`, requirements: "?location riversideRoad; ?trustMin sado 6;", altName: "", altImage: "",},
	{index: `pill-sado`, name: `sadoF can help!`, requirements: "?location riversideRoad; ?trustMin sado 6; ?holiday pill;", altName: "", altImage: "",},
	{index: `hole-sadogato2`, type: `walking`, requirements: "?flag sado holeWaiting; !flag sado holeFinish; ?location pineconePlaza;", altName: "", altImage: "",},
	{index: `watch-start-sadogato`, name: `sadoF's door is open`, requirements: "?location riversideRoad; ?trustMin sado 6; ?holiday watch; !flag sado watchStart;", altName: "", altImage: "",},
	{index: "sadoPat1", type:"walking", requirements: "?flag sado House; ?flag sado patIntro; !flag sado pat1;"},
];

var sceneArray = [
	//Intro scenes
	{index: `intro1`,
	content: `
		t You take a step up to the door of a yellow house, the place looks old, but clearly well cared-for.
		t The windows are blocked by thick curtains, so you can't tell anything about what's inside. 
		player happy Hopefully at least one new friend.
		t You give the door a good knock, and wait. And another wait. And another.
		t Slowly, the door slides open without the knob turning.<br>You take that as an invitation and step inside but nobody's there to greet you.
		player Hello? Is anyone home?<br>... I sure hope the townsfolk here feel the same way about intruders as they do about public nudity.
		t After a bit of careful exploration, you faintly hear someone clearing their throat from a nearby room.
		sado altName ???; ... I've been expecting you, human.
		player worried Oh. Why not greet me at the door then? <br>... Or were you waiting in here just to be mysterious?
		im intro-1
		player ... Because the regular lighting in here, and the ordinary couch aren't really doing it for me.<br>If 'spooky mystery' was the goal, I mean.
		sado glare ...
		player shock ...!?
		t Her eyes start to glow and you feel a strange sensation in your head, and suddenly your mouth closes shut.
		sado altName ???; I am known as Madame <input type='text' id='nameSubmission-sadogato' value='sadoF'>. 
		button Continue; renameCharacter('intro2')
	`,},
	{index: `intro2`,
	content: `
		sado glare And I brought you here for a reason, human.
		player worried ...? Mmmphph...<br><i>Pretty sure I dropped by of my own accord...</i>
		sado frown ... Right. Let's not dwell on the details for too long.<br>I trust you understand your purpose here in town?
		player ...<br><i>Why does she keep asking me questions if I can't answer?</i>
		sado Yes, the heat. Soon to affect everyone, strip them of their reason and leave them vulnerable to your whims.<br>I mean to make sure you don't abuse that power.<br>I don't blame you for your nature, but I will not allow you to harm the people of this town.<br>So...
		im intro-2
		t You feel your jaw unlock, and as sadoF's eyes glow again, you feel a strange sensation in your head. Like someone's popped into your head with a cotton candy machine and started spinning.
		t ... It's a very odd, but also somehow a very specific feeling.
		sado glare Now, release your tongue and speak the darkness within your heart, human.
		player sleep I... Want to...
		sado glare Yes?
		player sparkle I want to be your friend! And pet your fur! And give you treats while brushing your tail!
		sado frown ...
		sado worried Eh? Did it not work? Hold on...
		sado glare ...
		t You feel another strange sensation in your head, like someone just brought out their beloved set of car keys and started jangling them in front of your face while a trained monkey picks your pockets.
		t ... It's another very odd, but also somehow very specific feeling.
		sado frown ... No, I've failed. I can tell. There isn't an ounce of evil in the forefront of your mind.<br>Somehow. I'll need to try some other spells... Maybe if I... Hmm...
		player happy Wow, I'm evil free? That's amazing!
		player sparkle I'm a certified good person! And I didn't even need to hire a-
		sado glare ...
		t You feel yet another strange sensation in your head, and you spin on a dime and start robotically walking towards the exit.
		t This time it feels like someone's revealed your prized air conditioner has had a secret 'lemon-adjacent' setting all along, and they've just turned it on. The strangest feeling yet, but by the time you figure out what it is, you're already out the door.
		player happy ... Okay. I'll be back later, I guess.
		player worried Or is that what she wants me to do?<br>How can I even tell if my thoughts are my own anymore?!
		player happy ... Meh, not worth worrying over.
		eval raiseTrust('sado', 1);
		eval passTime();
		finish
	`,},
	{index: `reading1Start`,
	content: `
		t You give the door a good knocking once again, and the door slowly creeps open.
		player Hello? Madame sadoF? I'm back!<br>Did you mind control me to come here? Because I'm pretty sure I was planning on coming back anyway.
		sado frown I did not. 
		im reading1-1
		sado No, I am not controlling you, human. In truth, you're free to go if you really want. It's just that staying here is the best choice for you. Attending my purification ritual will help purge any dark thoughts from your mind.
		player worried What are my other options?
		sado Alternatively, I can fling several small, sharp rocks at your skull until you are purged of all worldly desires.
		player shock No! That's definitely not an option, my skull is where my self-destruct button is!
		sado ...
		sado worried ... I'll keep that in mind. Anyways, come. I had to make sure you didn't wander around like last time. To the ritual room.
		player So you were trying to be dramatic last time...
		t sadoF wisks you away to a room that definitely isn't just her dining room, which for some reason has only a single chair.
		player ... Still not really selling the 'mysterious fortune teller vibe'.<br>Oh, but wait, what are the plates for?
		sado frown They're dinner plates. I haven't gotten around to moving them, and my tablecloth was dirty. Now, focus.
		sado glare Try looking deep, deep inside yourself. Enter the palace of your mind...
		player sleep Okay... I see it...
		sado happy Really?!
		sado frown *Ahem*<br>Right. Now, look around. Do you see any inner demons? Perhaps ones composed entirely of a desire to rape and control others?
		player sleep ... No, just...<br>Fluffy animals~
		sado angry Grr... Maybe it's still too deep to find.
		player worried Maybe it isn't there?
		sado frown Absolutely not. This town has been quaint and peaceful for so long. Once folks here start losing their minds to heat, you'll be the only one in your right mind.
		player shock Is that how that works? I don't think that's how it works...
		sado A human suddenly arrives, one perfectly positioned to gain authority and abuse it? <br>It must be destiny. I'll purify you into something which can live in harmony with these good folk, and all of my efforts will have paid off.<br>To that end, I'll do whatever it takes. Strip.
		player shock ...!? Already?
		sado I only have so much time before the heat starts to affect me and my powers start to weaken.<br>I have no time to waste, and no intention of taking no for an answer.
		trans reading1; ... Yeah okay
		trans reading1Flee; Run away!
	`,},
	{index: `reading1`,
	content: `
		eval writeEvent('reading1');
		eval raiseTrust('sado', 1);
		eval passTime();
		finish
	`,},
	{index: `reading1Flee`,
	content: `
		t You get ready to make a break for the door, only to stop, stunned, hypnotized.
		t ... Not by sadoF, though, she's waiting for you to strip with a growing confusion on her face.
		t No, you're hypnotized as you notice her tail gently flick through the air.
		player sleep ... I never stood a chance.
		t ...
		eval writeEvent('reading1');
		eval raiseTrust('sado', 1);
		eval passTime();
		finish
	`,},
	{index: `reading2Start`,
	content: `
		eval writeEvent(data.player.currentScene);
		eval raiseTrust('sado', 1);
		eval passTime();
		finish
	`,},
	{index: `reading3`,
	content: `
		eval writeEvent(data.player.currentScene);
		eval raiseTrust('sado', 1);
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `reading4Start`,
	content: `
		sado Ah, you've returned.<br>I was wondering when my house would smell like you again.
		player worried Oh, my bad. I bet your nose is pretty sensitive. I'll shower more carefully next time.
		sado It doesn't matter, right now you at least smell actually pleasant compared to the rancorous stink of sin.
		player worried ... So... I smell nice to you?
		player sparkle Can I sniff you back? Just one huff?!<br>I won't even press my nose directly against your fur!<br>... For very long!
		sado shock Back! B-back, beast!
		player worried Aww...<br>So, since you seem to be in a better mood now, can we talk a bit more?
		sado frown Yes, of course. My mind is being rent asunder by this inescapable heat, but I have plenty of time for smalltalk.
		player sparkle Great! Okay, so...
		sado frown Gh... I wasn't ser-
		trans reading4A; Why do you think I'm evil?
		trans reading4B; How'd you learn magic?
		trans reading4C; What's the rush?
		trans reading4E; What's your favorite color?
	`,},
	{index: `reading4A`,
	content: `
		eval addFlag('sadogato', 'reading4A');
		player happy Why do you think I'm evil?
		sado frown Because the moment you arrived in town I foresaw calamity. I saw chaos. I saw...
		sado glare DOOM!
		sado frown This... Is what I portend.
		player ... Oh, you're just pretending?<br>Oh, thank goodness!
		sado angry No, "portend"! It's like foretelling something, but much scarier!
		player worried It doesn't sound that much scarier...
		sado shock Y-yes it does! You're just... <br>Ghh, damn this itch! It's making me lose my focus!
		trans reading4A; Why do you think I'm evil? !flag sadogato reading4A;
		trans reading4B; How'd you learn magic? !flag sadogato reading4B;
		trans reading4D; Is your mom here? ?flag sadogato reading4B; !flag sadogato reading4D;
		trans reading4F; What kind of limits do you have with your magic? ?flag sadogato reading4B; !flag sadogato reading4F;
		trans reading4C; What's the rush? !flag sadogato reading4C;
		trans reading4E; What's your favorite color? !flag sadogato reading4E;
		trans reading4; Are you okay? ?flag sadogato reading4A; ?flag sadogato reading4B; ?flag sadogato reading4C; ?flag sadogato reading4D; ?flag sadogato reading4E; ?flag sadogato reading4F;
	`,},
	{index: `reading4B`,
	content: `
		eval addFlag('sadogato', 'reading4B');
		player happy How'd you learn how to do magic? Because it's definitely not as easy as setting yourself on fire and hoping you unlock your secret dragon bloodline.
		sado frown ...
		player worried Because I already tried that. And it didn't work.
		sado ... My powers are hereditary. My mother said no one outside of our bloodline could ever hope to match them.
		player Ooh, so if we had kids together, they'd be mystical too?
		sado shock Y-you and I?! Children?!<br>No, I'm much too young to be a mother!
		sado frown *Ahem*<br>Plus, I frighten children too easily.
		player I'm sure they'd get used to you, I bet they'd be all "Ooh, mom's so soft and sweet on the inside!"
		sado shock Shut up! The only thing inside of me is blood! And bone! And, well, many other things.
		trans reading4A; Why do you think I'm evil? !flag sadogato reading4A;
		trans reading4B; How'd you learn magic? !flag sadogato reading4B;
		trans reading4D; Is your mom here? ?flag sadogato reading4B; !flag sadogato reading4D;
		trans reading4F; What kind of limits do you have with your magic? ?flag sadogato reading4B; !flag sadogato reading4F;
		trans reading4C; What's the rush? !flag sadogato reading4C;
		trans reading4E; What's your favorite color? !flag sadogato reading4E;
		trans reading4; Are you okay? ?flag sadogato reading4A; ?flag sadogato reading4B; ?flag sadogato reading4C; ?flag sadogato reading4D; ?flag sadogato reading4E; ?flag sadogato reading4F;
	`,},
	{index: `reading4C`,
	content: `
		eval addFlag('sadogato', 'reading4C');
		player happy You really seem to be in a rush. We haven't even had a chance to get to know each other yet.<br>Wanna be friends?
		sado frown I have no intention of being friends with you, human. My mother would often tell me stories of the horrors of the human world.<br>Of greed, enslavement, war...<br>And of beings so cruel they would sneak into my room and consume my writing utensils in my sleep if I so much as left the window cracked.
		player Are we talking about pens, or things like crayons? Because I don't know any humans who eat pens.
		sado ... I can't believe I ever doubted her.<br>Regardless, I'm 'in a rush' because the heat is affecting me. I must purify you before I lose control of my powers. Maybe you really are a good person, but I'm sure that there's still some evil in you. I'll drag it out before I lose control...
		player You know, working so hard to help the town, you're actually really nice, huh?
		sado ... Does your species consider restraint to be a liability?
		player I bet you act all grumpy, maybe just because you don't know how to express yourself, but I bet you're a real softy on the inside.
		sado shock I am not soft!
		sado frown *Ahem* ... Being a magus means remaining stoic at all times. I mustn't show weakness.<br>Aloof and collected, that is the way of the magus.
		player Is that why you pretend to be mean?
		sado Yes.
		sado shock I mean no! I mean... I'm not mean!
		sado angry Quit confusing me!
		trans reading4A; Why do you think I'm evil? !flag sadogato reading4A;
		trans reading4B; How'd you learn magic? !flag sadogato reading4B;
		trans reading4D; Is your mom here? ?flag sadogato reading4B; !flag sadogato reading4D;
		trans reading4F; What kind of limits do you have with your magic? ?flag sadogato reading4B; !flag sadogato reading4F;
		trans reading4C; What's the rush? !flag sadogato reading4C;
		trans reading4E; What's your favorite color? !flag sadogato reading4E;
		trans reading4; Are you okay? ?flag sadogato reading4A; ?flag sadogato reading4B; ?flag sadogato reading4C; ?flag sadogato reading4D; ?flag sadogato reading4E; ?flag sadogato reading4F;
	`,},
	{index: `reading4D`,
	content: `
		eval addFlag('sadogato', 'reading4D');
		player happy Is your mom here? Is she a mage too?
		sado frown She is a mage, and even more powerful than I am. But she's not here. She's off on a journey right now.<br>She sometimes sends me postcards about her quest to 'bag a human', I'm not skilled enough though to fathom what she might need a human slave for.
		player worried ... Oh, so you're all alone?
		sado I am, and I have been for many years.
		player shock That's so sad! I bet you're lonely, huh?<br>Don't worry, I'll be your friend! I'll keep you company!
		sado I possess hundreds of incredible tomes from across history. I don't need friends when I have this trove of ancient knowledge.
		player happy But books can't hug you! Or play games with you! Or tell you how nice you look today!
		sado worried Would... You-
		sado angry No! I can't afford to be distracted! Hurry up and finish your questions already!
		trans reading4A; Why do you think I'm evil? !flag sadogato reading4A;
		trans reading4B; How'd you learn magic? !flag sadogato reading4B;
		trans reading4D; Is your mom here? ?flag sadogato reading4B; !flag sadogato reading4D;
		trans reading4F; What kind of limits do you have with your magic? ?flag sadogato reading4B; !flag sadogato reading4F;
		trans reading4C; What's the rush? !flag sadogato reading4C;
		trans reading4E; What's your favorite color? !flag sadogato reading4E;
		trans reading4; Are you okay? ?flag sadogato reading4A; ?flag sadogato reading4B; ?flag sadogato reading4C; ?flag sadogato reading4D; ?flag sadogato reading4E; ?flag sadogato reading4F;
	`,},
	{index: `reading4E`,
	content: `
		eval addFlag('sadogato', 'reading4E');
		player happy What's your favorite color?
		sado frown Red, of course. It's a super cool color and it's the color of my eyes.
		player happy Wow, that's a super straightforward answer! I was expecting something like 'the color of the blood of my enemies' or something.
		sado frown I'm not a child, I don't need to pretend to be edgy.
		sado worried Plus, blood is scary.
		player happy Gotcha, okay, I'll remember that.<br>Anyways...
		trans reading4A; Why do you think I'm evil? !flag sadogato reading4A;
		trans reading4B; How'd you learn magic? !flag sadogato reading4B;
		trans reading4D; Is your mom here? ?flag sadogato reading4B; !flag sadogato reading4D;
		trans reading4F; What kind of limits do you have with your magic? ?flag sadogato reading4B; !flag sadogato reading4F;
		trans reading4C; What's the rush? !flag sadogato reading4C;
		trans reading4E; What's your favorite color? !flag sadogato reading4E;
		trans reading4; Are you okay? ?flag sadogato reading4A; ?flag sadogato reading4B; ?flag sadogato reading4C; ?flag sadogato reading4D; ?flag sadogato reading4E; ?flag sadogato reading4F;
	`,},
	{index: `reading4F`,
	content: `
		eval addFlag('sadogato', 'reading4F');
		player happy So what kind of limits do you have with your magic? Can you do anything you want?
		sado I have my limits, but not many. <br>For example, if I told you to eat every rock we see on your way home, you would reply "I'm glad I skipped lunch". 
		player shock But I can't eat rocks! It's mostly the taste. Salt's the only rock I can stomach.
		player worried ... Unless you count bismuth. I don't.
		player angry Stupid bismuth... I'll never forgive you for tasting so much worse than you look.
		sado Regardless, you'll do whatever it takes if I tell you to. Otherwise, the only thing you'll ever say again will be "..."
		player worried "..."?
		sado Because you'd be dead. That's what dead people say.
		player shock ...!<br>You'd kill me?! Just for not eating rocks?!
		sado worried ... Sorry, I was trying to be dramatic. I'm not going to kill you, promise.
		player happy Oh, okay.
		sado ... You're just going to trust me?
		player Yep! I trust everyone who says they won't kill me. I haven't been wrong yet.<br>Anyways...
		trans reading4A; Why do you think I'm evil? !flag sadogato reading4A;
		trans reading4B; How'd you learn magic? !flag sadogato reading4B;
		trans reading4D; Is your mom here? ?flag sadogato reading4B; !flag sadogato reading4D;
		trans reading4F; What kind of limits do you have with your magic? ?flag sadogato reading4B; !flag sadogato reading4F;
		trans reading4C; What's the rush? !flag sadogato reading4C;
		trans reading4E; What's your favorite color? !flag sadogato reading4E;
		trans reading4; Are you okay? ?flag sadogato reading4A; ?flag sadogato reading4B; ?flag sadogato reading4C; ?flag sadogato reading4D; ?flag sadogato reading4E; ?flag sadogato reading4F;
	`,},
	{index: `reading4`,
	content: `
		eval writeEvent(data.player.currentScene);
		eval raiseTrust('sado', 1);
		eval passTime();
		finish
	`,},
	{index: `reading5`,
	content: `
		eval writeEvent(data.player.currentScene);
		eval raiseTrust('sado', 1);
		eval passTime();
		eval editSkill("dominance", 1);
		eval writeSpecial("You feel like you've grown more dominant...")
		finish
	`,},
	//Status quo
	{index: `statusQuoIntro`,
	content: `
		t You take a step inside sadoF's house to find her waiting for you.
		sado frown ...<br>You're back.
		player How are you feeling?
		sado I feel like a roughly-handled sack of vegetables.
		player worried In a good way?
		sado ... Perhaps. I've needed to rehydrate six times this morning, I feel like I've been squeezed like a sponge, I must have squirt so much I nearly desiccated myself.<br>But at least my head is quiet for once.
		player happy That's great! That's a pretty quick transformation. Maybe fighting against the heat so hard was just making things harder for you?
		sado Indeed. Now, not only am I able to think clearly, it means there's a clear way forward from here on.
		t She puts her hands on her hips and lets out a sigh. Despite wearing her usual frown you think you hear a bit of happiness behind it.
		sado I've clearly developed a sudden... <i>Addiction</i>... To rough sex. Or my body has, at least.<br>Which means I no longer have a time limit, and no longer need to worry about giving up my abilities or status as a magus!<br>Granted, I wasn't expecting to be hooked so quickly on being absolutely ruined until I'm a soaked mess, but at least I no longer need to worry about becoming a completely fuck-addled whore who constantly daydreams of being pinned and raped all day.
		player worried Well that's... One way to put it.
		sado Indeed. Plus it means my lessons and vocabulary training with shopF will have a purpose.
		sado sleep ... I can keep my magic.
		player happy So what happens now?
		sado frown ... I'm not sure. From the moment I learned a human was coming to town, I assumed I'd have only a week at most to make sure you weren't going to cruelly abuse your position of power over the townsfolk.<br>To be honest, not having any kind of time limit, and seeing how you aren't really all that bad...<br>Kind of takes the wind from my sails.
		player sparkle Is that a compliment?
		sado worried I... Suppose? We should still meet regularly, not just so I can keep an eye on you, but also that you can fuck me stupid hard enough to... Un-stupid me.
		sado frown ... I may need another session sooner than I thought.
		player worried So, we'd meet up semi-regularly, talk about how we've been doing, and help each other out?
		player sparkle Like best friends?!
		sado shock ...!
		sado worried Why on earth are you so ready to be friends with someone like me...?
		player This is great! We could go hunting in the forest together, or go fishing, or...
		sado frown Yes yes, some other time. For now, I'd like a little more time to be alone with my thoughts now that my head isn't abuzz with voices telling me to bend over in front of you.
		player happy Sure thing, see you later Madame sadoF!
		t You wave on your way out the front door, and she just confusedly watches your display of enthusiasm.
		sado worried ...<br>Did... Have I actually made a friend?
		sado frown No, no, that's silly. If it were that easy I would have made at least one in the years since mother left for her journey.
		sado worried ...
		sado happy ... Ooh, maybe I should try reading my fortune! Maybe this time good things are coming my way!
		eval raiseTrust('sado', 1);
		eval passTime();
		special You've become best friends with sadoF!
		finish
	`,},
	{index: `statusQuo`,
	content: `
		eval sadoQuo();
	`,},
	{index: `sadoClothes`,
		content: `
		sado frown ...
		player happy Nice place you have here.<br>I didn't really have time to admire it before.
		sado frown ... It's not exactly the coziest spot in town. I've been here for so long, I've grown used to it.
		player happy I think it's nice! It's got a lot of character. Could you show me around?
		sado worried I... Suppose I don't see why not. Please be careful, I've got a lot of fragile things.
		t sadoF leads you through her house, bringing you through several cluttered rooms, assuring you they "have their own systems" and that "everything is perfectly organized", though it doesn't seem like she completely believes it.
		sado frown Ah, right. I should give you something... Here.
		player happy Oh, a gift?
		sado It's customary for humans to give gifts when visiting a friend's home, isn't it? Housewarming, or something like that?<br>I have spares of these, so you can have one. Not that I wear them often.
		eval addItem("Chest Wraps");
		button Finish; generateHouse(data.player.currentCharacter);
		eval unencounter(data.player.currentCharacter);
	`,},
	{index: `sadoMama`,
		content: `
		player happy Hmm?
		im sado/silf
		sado sparkle Interested?<br>That's my mother, isn't she incredible?
		player I think I remember you saying she was touring the world?
		sado happy Searching for a human to live with, I suppose?<br>Ah, she's incredible.<br>She never let me watch her shows, but I'm sure she's far superior as a magus compared to me.
		player That's pretty cool!<br>She must be pretty famous to perform on the Vegas Strip.
		sado ... "Vegas"? What's that?
		eval addFlag('sado', 'mama');
		button Finish; generateHouse(data.player.currentCharacter);
		eval unencounter(data.player.currentCharacter);
	`,},

	//Post-quo scenes
	{index: `repeat1First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval raiseTrust('sado', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat1Repeat`,
	content: `
		im repeat1-1
		im repeat1-2
		im repeat1-3
		im repeat1-4
		im repeat1-5
		im repeat1-6
		im repeat1-7
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `repeat2First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval raiseTrust('sado', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat2Repeat`,
	content: `
		im repeat2-1
		im repeat2-2
		im repeat2-3
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `wall1-1`,
		content: `
			eval writeEvent('wall1-1')
			eval addFlag('sado', 'wall1')
			eval addFlag('carpenter', 'dailyWall')
			eval passTime();
			eval editSkill("dominance", 1);
			eval writeSpecial("You feel like you've grown more dominant...")
			finish
		`
	},
	{index: "pill-sado", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval data.player.time = "Night";
		eval data.player.holiday = "";
		finish
	`},
	{index: "hole0", 
	content: `
		eval addFlag("sadogato", "holeReady");
		sado frown Hmm. You seem... Different, somehow.
		player surprise Oh! Right, almost forgot. I found this magical hole in the ground.<br>Here, take a look.
		sado befuddled How did you bring the hole with-
		sado frown Oh. It's... Hmm.
		t After handing sadoF the magic onahole, the end of it shifts and changes color before your eyes.
		im hole0-1
		sado curious Interesting. It changed shape.
		player happy mayorF gave me permission to keep it. She also volunteered to handle the cleaning-
		sado angry Tch.
		player happy - and she said I could use it on the townsfolk if I got permission.<br>Did you wanna try?
		sado frown Hmm? Well, I don't see why not.<br>You have the real thing right in front of you though.
		player amused Yeah, that's what I thought, but shopF seemed really excited when I used it on her.<br>Maybe you'll find it fun too?
		sado worried <i>Used it... On her? And on me? Is it not some kind of semen obtainment tool?<br>Mrr, I can't fall behind the rest of them. Plus, if I look like a dunce on the subject of magic...</i>
		sado frown ... Perhaps. Put it to use whenever you feel appropriate, then. I'll be ready.
		player joy Yippee! Looks like I'll get to be the one doing magic this time!
		special You got another form of the portal onahole! You can use it via the shelf in your house.
		trans House; Finish
	`},
	{index: "hole-sadogato", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval passTime();
		eval removeFlag("sadogato", "holeReady");
		eval addFlag("sadogato", "holeWaiting");
		eval unencounter(data.player.currentCharacter);
		finish
	`},
	{index: "hole-sadogato2", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval passTime();
		eval removeFlag("sadogato", "holeWaiting");
		eval addFlag("sadogato", "holeFinish");
		finish
	`},
	{index: "watch-start-sadogato", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval addFlag('sadogato', 'watchStart')
		finish
	`},
	{index: "watch-finish-sadogato", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval removeFlag('sadogato', 'watchStart')
		finish
	`},
	{index: "sadoPatIntro", 
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		im catpats1-0
		sado glare Eh? You're talking to other girls? Why do you need other girls?<br>Am I not enough for you?
		sado worried ... No, that still doesn't feel right.
		sado annoyed Alright... Let's see here...<br>"How to make sure loved ones stay by your side, chapter six"<br>Hmm, hmm, yes. A frightening gaze, I did that. I don't know what "Yan-deerey vibes" are though, I suppose this approach isn't right for me..
		sado tired ... Plus, "The target will become so devoted they'll be willing to die for you." That sounds ominous. I should try a different approach... Hmm...
		sado happy Ah! This next one, 'Mesu-Gato', has an 100% success rate on any target! There's an effect on the recipent and a chant for self hypnosis!<br>This is perfect, I can't possibly mess this up!
		sado pent Alright... Hoo~<br>Breathe in, breathe out, and chant...
		sado glare Zaaah-koh... Zaaah-koh... Zaaah-koh...
		t ... 
		player sleep Zzz...
		player shock Ah?!
		player tired Oh... That was weird... I don't normally wake up so roughly like that...<br>And I have this strange feeling, like... Like I should go visit one of my friends...
		eval addFlag('sadogato', 'patIntro')
		eval unencounter(data.player.currentCharacter);
		finish
	`},
	{index: "sadoPat1", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval addFlag('sadogato', 'pat1')
		eval passTime();
		eval raiseTrust('sado', 1);
		finish
	`},

	//Morning scenes
	{index: `morning1`,
	content: `
		eval writeEvent(data.player.currentScene);
		eval addFlag(data.player.currentCharacter, data.player.currentScene);
		finish
	`,},
	{index: `sadoMorning-hyena`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, and even more quiet in the dimly lit room of the fortune teller's den.
		sado ...
		hyena happy Oh, that's a pretty card. What's it mean?
		sado ...
		hyena confused Right, not talking. That makes this a lot harder to figure out.<br>I guess it's pretty cool how you're sticking to your guns though.
		hyena happy Okay, so, if I had to guess, the dragon lady is super tough, so I probably have to be super tough myself for something coming up?<br>Say nothing if I'm close.
		sado ...
		hyena Cool, cool. Okay, stay tough, I can do that. Thanks for the reading. Lemme know if you ever wanna do this again, okay?
		sado ...
		hyena worried Alright, bye.
		sado ...
		sado sparkle She said I was cool~!<br>My goodness, I was about ready to start crying of fright, but I've grown so much! My knees were barely shaking that time!
		sado frown ... Shame she got the fortune totally wrong though. Oh well, maybe I'll be able to speak up next time.
		finish
	`,},
	{index: `hot-1`,
		content: `
			t It's a brand new day in syrup town...
			t And it's an absolute scorcher!
			im hot1
			sado sleep Worldly desires, leave my body. Worldly desires, leave my body.
			sado worried Ohh... Why didn't I learn some kind of cooling spell or something?
			trans cancel; Finish
		`
	},
	{index: `bath-1`,
		content: `
			t It's a brand new day, and all across town the folk of Syrup Town are undergoing their morning routines.
			im bath1
			sado sleep And it's aaaalright~<br>And it's comin' on~<br>We gotta nana nana where we, nana num~
			trans cancel; Finish
		`
	},

	//System
	{index: `cancel`,
	content: `
		eval unencounter(data.player.currentCharacter);
		eval changeLocation(data.player.location);
	`,},
	{index: `sadoTarotIntro`,
		content: `
		t You notice something sitting on a small end-table.
		sado Hmm? Something catch your eye?
		im tarot/0
		sado sparkle Ah, my tarot deck! You finally noti-
		sado frown ... *Ahem*<br>Oh, I left out one of my cards.<br>That's one of the cards from my tarot deck. I use it to help me focus my mind and see the future.<br>It's one of my latest batch, I had many more copies but I lost them the other day...<br>Well, at least I have the originals. If you happen to find any of them, they're yours to keep.
		sado worried And that one too, if you'd like.<br>If you're interested, I mean. I don't know why you would be, but...<br>Maybe they'd make a good conversation topic?
		trans sadoTarotIntroAccept; Take the card
		trans sadoTarotIntroReject; Politely reject it
	`,},
	{index: `sadoTarotIntroAccept`,
		content: `
		player Sure, sounds like fun! I'll keep an eye out for them.
		sado sparkle Oh good! You can-
		sado frown ...*Ahem*<br> You can keep that one if you need a reminder of what they look like. The wind scattered them, they could be all across town by now.
		player worried Will they be damaged?
		sado frown No. Magical artifacts of that sort won't be damaged by the elements.
		player Great!
		eval addItem("tarot0");
		eval addFlag("sadogato", "tarot0");
		player So, what's this card? Is it based on you?
		sado frown No, it's entirely coincidental. Black cats have been a associated with mysticism for centuries.
		player And bad luck too, right?
		sado shock What? No! Who told you that nonsense?<br>I'm very lucky!
		sado worried ...<br>Well, I suppose that freak accident where I knocked over a giant mirror...
		sado frown No, that wasn't luck, I was just trying to avoid walking under a ladder.
		player Right, I'll let you know if I find any more then.
		button Finish; generateHouse(data.player.currentCharacter);
		eval unencounter(data.player.currentCharacter);
	`,},
	{index: `sadoTarotIntroReject`,
		content: `
		player No thanks, I'm not really much of a collecting type.
		sado frown I suppose it's not for everyone. Not to mention the mystical arts can be fickle, best leave them to me.
		sado worried <i>Curses, that didn't work at all...<br>Well, at least I learned something new about *him. Maybe I should try leaving out old clothes instead?<br>Granted, I'd have to start wearing some...</i>
		player worried sadoF?
		sado shock Wah! I-I mean, what were we talking about?
		eval addFlag("sadogato", "tarot0");
		button Finish; generateHouse(data.player.currentCharacter);
		eval unencounter(data.player.currentCharacter);
	`,},
];

var sadoSmallTalkArray = [
	{index: `tarot0`, content:`
		sado Ah, back already? Tell me, are your compulsions as overwhelming as mine? <br>What are you feeling right now?
		player excited Like I really wanna touch your tail...
		sado frown To be clear, no matter how horny I get, the tail is not to be treated as a sex organ. You understand that, yes?
		player ...
		sado worried ...<br>Let's... Change the subject. I could use a bit of head-clearing today, if you're free.
	`},
]

function sadoQuo() {
	for (smallTalkIndex = 0; smallTalkIndex < data.story.length; smallTalkIndex++) {
		if (data.story[smallTalkIndex].index == "sadogato") {
			data.story.emotionDefault = "glare";
		}
	}
	var smallTalkEvents = [];
	var tarotCollected = 0;
	for (smallTalkIndex = 0; smallTalkIndex < sadoSmallTalkArray.length; smallTalkIndex++) {
		if (checkItem(sadoSmallTalkArray[smallTalkIndex].index) == true || checkItem(sadoSmallTalkArray[smallTalkIndex].index+"Meat") == true) {
			var sadoTarotName = sadoSmallTalkArray[smallTalkIndex].index.replace("Meat", "");
			if (checkFlag("sadogato", sadoTarotName) == false) {
				smallTalkEvents.push(sadoSmallTalkArray[smallTalkIndex]);
			}
			else {
				tarotCollected++;
			}
		}
	}
	if (smallTalkEvents.length < 3) {
		writeHTML(`
			sado frown ... I'll let you decide this time.<br>What should we do today? I could use a good head-clearing.
		`)
	}
	else {
		//Use first event rather than random
		//console.info(smallTalkEvents[0].content);
		writeHTML(smallTalkEvents[0].content);
		var sadoTarotName = smallTalkEvents[0].index.replace("Meat", "");
		addFlag("sadogato", sadoTarotName);
		//Alt code for random instead
		//console.info(smallTalkEvents[getRandomInt(smallTalkEvents.length)]);
		//writeHTML(smallTalkEvents[getRandomInt(smallTalkEvents.length)]);
	}
	writeQuoRepeats();
	writeHTML(`
		trans cancel; Go back
	`)
	if (checkItem("hole") == true && checkFlag("shop", "holeFinish") == true
	&& checkFlag("sadogato", "holeReady") != true 
	&& checkFlag("sadogato", "holeWaiting") != true
	&& checkFlag("sadogato", "holeFinish") != true) {
		writeScene("sadogato", "hole0");
	}
}

var eventArray = [
	{index: "reading1", name: "First Reading - Introspection", image: "sado/intro-1",
	content: `
		sado frown Hmph. So this is...
		im reading2-1
		sado I suppose I should consider myself lucky. If I hesitated any longer, I'd likely have lost my mind to the heat and be blathering about how incredible it looks.
		player excited Paw... So soft~
		sado Dark urges still not rising to the surface? I'll have to try something else.
		t She lifts her paw from your penis and plops down straddling your legs.
		im reading2-2
		sado I don't expect you to understand why I'm doing this...
		player It's okay, some people are just bad at communicating.
		sado ... But it needs to be done nonetheless.
		t She looks down at you with a mix of hesitation and something else, before her eyes start to glow again.
		im reading2-3
		t Red light shines from her eyes and it feels like it's tinting the very color of your brain.
		sado glare The dark urges within you... I'll pluck them right out of you if I have to!
		t Instead of the strange feelings from before, this time her influence feels... Nice. Soft.
		player excited Ooohhh~
		sado Am I getting through? A little further...!<br>While I still have full control of myself, my mind uninfluenced by-
		player ahegao Ooouh~!
		t *SPLURT*
		im reading2-4
		sado shock ...
		t Without really understanding why, your cock started suddenly firing off enough to roughly cover sadoF's face.
		sado ...
		t And she just... Stares at it.
		player excited S-sorry... I don't know what came over me there...
		sado I... I don't...<br>Brain... Hot...
	`},
	{index: "reading3", name: "Second Reading - Sloth", image: "sado/reading3-1",
	content: `
		t You gently stir awake, rubbing your eyes you realize that instead of awakening to the sound of birds singing it's...
		sado pleasured Glllhk, glllhk...
		im reading3-1
		sado pleasured Glllk...<br>Ahh... Good, you're awake. Thrust for me, I can't get it into my throat properly, and it's taking too long with just my mouth.
		player worried How did you...
		sado frown I possess impossible mystic powers. Entering your home was child's play.
		player ... Did I leave the door unlocked?
		sado frown I have no idea, but you did leave the window cracked open.
		sado excited Now, I need to act quickly... My powers rely on maintaining a composed state of mind.<br>If I lose myself to heat...
		t And back onto your dick she goes, sounding like she's trying to swallow a whole water bottle.
		sado excited Glllhk~<br><i>How does *he even walk around with this thing...?!
		t Each time she dives, she dives just a bit deeper, her vision spinning as she comes back up like she bopped herself on the brain the way down.
		sado excited Kkklllhk~!<br><i>Chest... Tight... Have to stop...!<br>Why is it so much harder... To pull myself off than to push it down my...</i>
		player excited Nggh~
		sado ahegao <i>*He's~!</i>
		im reading3-2
		t With the *SCHLRCH* sound of spooge being sucked out of a tube, sadoF slides her head back one final time creating a suction purpose-built for slurping every drop of cum from your hose.
		t And by the time she's reached the top, one final flex of your pelvic muscles fills her briefly empty mouth with cum.
		im reading3-3
		t And completely still she stays, not making a move, not even breathing, like she's working up the strength to...
		t *GULP*
		sado ahegao Guh~!<br>Sh... Too thick...
		t She lifts her head back, her already rolled eyes fluttering.
		player excited You... You okay Madame sadoF?
		sado Nnn... No. But I'll-<br>*Hic*<br>I'll live...<br>And... You?
		player happy I feel great! That was a great way to wake up.
		sado pleasured Gh...<br>It didn't work then... I was trying to<br>*Hic*<br>To draw your desires to the surface, but... I should have stopped sooner...
		player worried Oh. We could do it again if you want.
		sado torogao Nggh~!<br>N-no! No, if I did that again, my brain would be...<br>No, I... I need to clear my mind, catch a breath that isn't... <i>Stinking</i>... With human cum...<br>Come see me later...
		t She stumbles out of your bed, trying to grasp onto some of the dignity she had just moments ago.
		sado pleasured *Hic*
		sado ahegao Ghh~! I... Tasted it again... <3
	`},
	{index: "reading4", name: "Third Reading - Greed", image: "sado/reading4-1",
	content: `
		player Are you alright? You seem a little bit...
		sado frown I'm fine. I'm just...<br>It's just...<br>It's just the heat. It's making me...<br>It's making me...
		player You know, you seem like you want friends too, maybe these powers aren't worth it? Maybe everything will be fine, and you never really needed them.
		sado That...
		sado shock ... That would be even worse! 
		sado angry No, these powers are needed. I'm needed.<br>I just...
		im reading4-1
		sado pleasured J-just need to...
		t Her hand keeps moving towards her absolutely soaked cunt, though she keeps pulling it back at just the last moment.
		t Her legs quiver, and without so much as a touch there's a soft pattering of sound as her pussy drools out a solid line of juice onto the floor
		im reading4-2
		sado excited Now, are you finished? It's getting harder by the second to keep focused...
		player worried Actually, I'm starting to worry you're pushing yourself too much.<br>The heat's really messing with your body, maybe we should stop here?
		sado No! If I just control myself... Tear my mind away from thoughts of... Of...
		t Her eyes flutter for just a moment before she falls backwards onto her ass.
		sado torogao Nnngh~!
		im reading4-3
		t And ends up spraying her tail with a sudden jet of femcum. 
		sado Nnnoo... Gh...
		t She lets out a few labored, heavily embarrassed breaths. Whether it's your scent or something else, her heat has gotten so bad she's managed to cum hands-free from just you being around.
		sado ahegao I... I won't lose... I won't... Admit defeat...
		player worried There's no defeat here though! No losing, your brain's being rocked by a desire to breed, it's perfectly natural!
		sado torogao Nggh!
		player worried ... I don't think you can even hear me anymore...<br>I should go, and let you recover.<br>Take some time to try and help yourself, okay Madame sadoF?
		t She doesn't respond, she just twitches on the floor like she's fighting back something fierce.
	`},
	{index: "reading5", name: "Fourth Reading - Pride", image: "sado/reading5-6",
	content: `
		player worried Madame sadoF? Hello? I'm...
		im reading5-1
		player shock Are you-
		t She sits in what appears to be the same position you left her, though at least her eyes aren't in the 'fucked silly' state of being rolled back into her head.
		t Instead, she's glaring at her own pussy with some kind of mix of annoyance, anger, and betrayal.
		sado angry 'S not fair...<br>Wasn't supposed to go like this...
		player worried Still feeling down?
		sado frown I was gonna do something nice for the town...<br>Everyone would have seen how hard I've worked...<br>I'd write to mother about all the new friends her magic made me...<br>If anyone deserves to have some self control around you, it's me, but just a few days after you arrive, I'm like a mewling kitten... When you show up... I just...
		im reading5-2
		sado pleasured Nngh...!<br>Stupid... Stupid stupid...!
		player You're too hard on yourself...
		sado Kh...
		im reading5-3
		sado You won't shut up, won't let me focus... Fine! I'll give you what you want!
		player worried Eh? Are you talking to me, or-
		sado glare Human! Follow!
		player shock Eh?!
		t ...
		sado pleasured The... The spell is weak when I'm this unfocused, but...<br>Gh... I don't care anymore!<br>Human!
		im reading5-4
		sado glare You WILL take out every bit of frustration you have upon my ass!<br>And if you really have none, then you'll take mine!<br>And you will NOT show me any mercy!
		sado angry I want you to crush every bit of indecent desire from my body so that I can have a clear head just one more time!
		player worried O... Okay...
		im reading5-5
		sado pleasured Mmmh~!
		t She lets out a cutely high-pitched moan as you test the plump rim of her asshole.
		t And as you pull back, you have to actively fight back against the grip its giving you.
		sado Nnnn... Not enough! 
		t With some amount of force you're finally able to pull away with a soft *pop*. 
		im reading5-6
		player Are you re-
		sado I am completely ready. My stupid, perverted head has been playing this scene in my head non-stop since we met!
		im reading5-7
		player excited S-soft~
		sado Ghh...<br>How can that thing feel even bigger against my ass than it did in my throat?<br>Human, now, before I start thinking it would be better if you <i>were</i> a cruel brute, start th-!
		im reading5-8
		sado shock HAAAAAH~!
		sado pleasured It... It's inside!<br>C-cumming~!
		t At her first reaction it's impossible to tell if her heat has transformed her into some hyper masochist, or if she's just so on edge that getting her ass spread open is a sensation of pure relief.
		sado torogao Ggghh~! Harder~! I...<br>I can feel all those nagging, slutty voices being broken into silence!<br>Faster~! More~!
		player excited I'm trying...! I sink right into you, but you're fighting so hard when I pull back I think I might pull you across... The... Bed!
		im reading5-9
		sado Ngghhh~!
		t Every thrust feels like you're pummeling her stomach, then trying to wrench yourself free of an unrelenting grip. Her ass is accommodating each time you smoosh her body into the sheets but keeps you held even more tightly than her throat did.
		player torogao G-gonna...!
		sado Do it!
		im reading5-10
		sado NGGH~<3
		t It's an overwhelming sensation to feel yourself milked so tightly. Her eyes roll back, her belly puffs out slightly, and she grits her teeth so hard you worry she might chip a fang as she cums her brains out.
		t Her body quakes and spasms, and it's all you can do just to force yourself free.
		im reading5-11
		sado pleasured ...
		t She looks at you with an empty gaze as you stumble back. You take a moment to catch your breath, despite what it went through her ass is still so tight that despite pumping what felt like the mother of all loads into her ass, barely a drop came free with your cock.
		t Her chest puffs in and out, pressing her small breasts against the sheets, trying to supply enough oxygen to her body to start working through what's happened.
		player excited Are... Are you alright?
		t She vocalizes something incoherent, so at least she's not completely brainfried.
		player Was it enough? Is your head clear yet?
		t She vocalizes something again, hopefully it's fuck-drunk cat for 'yes'.
		t And finally she rests her head on her pillow, tongue still out, still drooling, still breathing like she's run a marathon.
		player sleep Sleep tight, Madame.
		t She vocalizes one last string of nonsense at you before her eyes flutter closed and her whole body goes limp.
	`},
	{index: "repeat1", name: "Repeatable - Oral", image: "sado/repeat1-1",
	content: `
		im repeat1-1
		sado frown ...
		player There's no need to be nervous! I mean, you've done it before.
		sado shock I'm not nervous!
		sado frown *Ahem*<br>And if I were, it would be because this feels very different when you're awake.<br>And... T-towering over me.
		sado frown N-not nervous at all. Now no more talking. I want every bit of your energy put into fucking my face.
		player worried Okay...
		sado angry I said-!
		im repeat1-2
		sado ahegao Ghlllk~!
		t Not wanting to test her any further, you stuff her face, stretching her jaw to the limit in a single thrust.
		t You're worried for a moment that you might have broken something, so you start to pull out.
		sado angry Mmm!
		player shock Eh?
		im repeat1-3
		t You pull out far enough you can see precum dewing at your cockhead, enough that her mouth is free, though she doesn't say anything.
		sado frown <i>Stupid human... Worrying about me, treating me like an equal...</i>
		sado excited <i>I'll teach you... I don't want to be an equal right now...!</i>
		im repeat1-4
		sado excited <i>And if I need to look like a total whore to prove I want my face <b>RAPED</b>, then that's what...<br>I'll...<br><b>DO!</b>
		player torogao Ghh~!
		sado torogao Kkhllllk~!
		t Your whole body feels warm as sadoF lets out a sound that wouldn't feel out of place in the most hardcore of brutal pornos.
		player I'm~!
		sado <i>Cum! Cumcumcum! I'm not breathing until you plaster my throat!<br>Treat me like a fucksleeve or I'll pass out and you'll need to grip my ears and rape my unconscious face to get your load out!<br><b>CUM!</b></i>
		im repeat1-5
		t Just barely before she manages to go balls-deep, your cock throbs, white fluid overflows from the edges of her mouth, and her eyes roll aaaaall the way back.
		t It's impossible to read her expression, but she's definitely thinking <i>something</i> to herself while skewering her own head down your cock.
		t And as she starts to slowly pull herself back she's able to lock eyes with you again 
		im repeat1-6
		t What could be going on in that head of hers? Surely the lack of air must be messing with her.<br>No matter how hard she wants to convince you otherwise, human jizz is no substitute for air.
		t *POP*
		im repeat1-7
		t You pull yourself free and her mouth, no longer occupied by a cock wider than her throat should ever be stretched, alternates between kissing at the air searching for your length and swishing the porridge-thick load of cum clogging her facehole.
		t By the time she's swallowed and cleared her throat enough to speak, you can barely make out her raspy voice.
		t So you get in just a bit closer.
		sado ahegao -ocksl... Muc...
		player worried Huh?
		sado ahegao Until you make me your throatslave... Any trace of air not-blocked by cock... Balls to my nose... Break me...
		t And it's clear she's cracked.
		player worried Well...
		player excited At least it looks like you're having a good time~ 
	`},
	{index: "repeat2", name: "Repeatable - Headpats", image: "sado/repeat2-1", requirements: "?trustMin sado 7;",
	content: `
		sado shock ...!
		im repeat2-1
		sado worried ... What are you doing?
		player excited Sooooft~
		sado blush Are you gripping my head for... No? You're just... Stroking my head? This isn't...
		im repeat2-2
		sado excited W-whaaa-<br>What's going on~? I feel so... Head... Fuzzy~
		player Who's a good girl? Who's a good girl?
		sado excited Hoooh~<br>Shhtop~ Can't think~<be>D-don't-
		player You are! You're a good girl, yes you-
		player shock -Are?
		sado ahegao Haaaah~
		t Snapping out of your fluff-trance, you pull your hand back only for her to follow you off her bedseat, and you notice a slick puddle forms beneath her in response to your words of praise.
		im repeat2-3
		sado Aaah~ Haa nyaaah~
		t She tries to speak, but instead of words all that comes out is incoherent mewling.
		player worried <i>I feel like I've stumbled onto something dangerous...</i>
		sado Haaah~!
		player excited <i>Although... A little more of this can't hurt, right?</i><br>Who's a good girl~?
	`},
	{index: "morning1", name: "Morning - Solo Fun", image: "sado/morning1-1",
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, and dawn is shining through sadoF's window.  
		im morning1-1
		sado angry Mrgrgr...<br>Another restless night. There has to be some kind of spell that can fix this...<br>Maybe...
		sado worried ... No, no. Nothing.<br>Not that I'd even be able to cast it properly in this state of mind...
		im morning1-2
		sado frown Well, where magic fails, discipline prevails. Time to try out that tool from shopF...
		t ...
		sado pleasured Ghh!
		im morning1-3
		sado excited How do you like that?!<br>Stupid cunt, distracting me with lewd thoughts all through the night!<br>Now that I've finally-
		im morning1-4
		sado ahegao Hoh~!
		im morning1-5
		sado pleasured F-finally shut you up, I'm in control!<br>I know your weakness now!
		im morning1-6
		sado torogao Nghh, cumming~!
		sado ahegao Hah... Haha~<br>My head's clearing already...
		im morning1-unused
		sado excited But I know exactly what's happening~<br>The moment I let this fat slab flop out of my pussy, I'll be beset by horrid lust all over again.<br>No, I can't be fooled. I'll fuck myself silly, squirt myself dry on this until my pussy's a quivering mess, and you'll have no choice but to stop fucking my mind crazy with lewd fantasies!

	`},
	{index: "wall1-1", name: "Hole in the Wall - Sadogato", image: "sado/wallRear-01", requirements: "?trustMin sado 7;",
	content: `
		player happy Sounds like the wall's occupied today.
		carpenter sleep Yep. Actually, I didn't tell her about it. She just showed up, crossed her arms like she was expecting something, and without saying anything went back and climbed into the hole.
		carpenter worried She's been waiting for a while. She did call me over a little bit ago, had me add some modifications.<br>Said they were to keep her from falling in or out.
		player confused Hmm. Well, I'll see what she wants then. 
		t ...
		im wallFront-01
		sado worried Mmgh.<br><i>Did... I get the right place? It certainly seemed like this was a glory-wall of some sort...<br>This is what I get for not-</i>
		sado frown ... *Sniff* *Sniff*
		im wallFront-02
		sado angry Who goes there?! That'd better be who I think it is!
		im wallRear-01
		player blush Cat butt...
		sado H-hey, it's quite rude not to answer when someone's talking to you!
		sado worried ... Is anyone actually there?
		player surprised Oh! Sorry. Yeah, it's me. I was just... Fascinated.
		sado frown Fascinated, hmm?
		sado glare I'll show you fascination...!
		player blush Whoa... M-must... Touch... The butt...
		im wallRear-02
		sado Hmm. Warm. My rear has been sticking out in the cold for far too long.<br>I require special treatment today. You <b>will</b> perform, yes?
		player Okay... Whatever you say... Soft, talking butt...
		im wallRear-03
		sado excited G-good. Now, I demand nothing less than the most <b>brutal</b> of poundings. Treat the pussy roughly, and do not relent, do you understand?
		player Pussy...
		im wallRear-04
		sado frown Ah, actually, I would prefer-
		player Roughly...!
		im wallRear-05
		im wallFront-03
		sado pleasured Khhh! Fuck!<br>Ah, w-
		player forced Fuck the kitty!
		im wallRear-06
		sado Ghhh~! My... Cunt! Hoh, wait, I'm not ready ffff-...<br>Mggh, stop, brute...!
		sado glare I... Order you-
		player angry Don't relent!
		im wallRear-07
		im wallFront-04
		sado torogao Gnnnnnnhg~!!!<br>Sth... Stop before... Before I'm ruined...!<br>Even if my... My body has a maso streak... That's no excuse to battering ram my womb!
		im wallRear-08
		player torogao Nggh...
		sado shock Ghh! Those are... Filthy, human testicles... Against my clit, you aren't... About to...
		im wallFront-05
		sado torogao Nnnno, no no no, I won't... Be... Humiliated... Into...!
		sado shock ... Eh? My head's... Gone suddenly...
		im wallRear-11
		sado shock Ah?! W... Warm...! My head...?! What's happ... Happ... Happening...?!<br>H-human... Cu...
		sado torogao Ngghhhh~<3<br>Cumminggggg~<br>Cumming... Brainsh... Out
		sado ahegao From... Kitten... Making~... Cum in... Womb...
		player angry...
		player shock ... Huh? W-what came over me all of a sudden?!<br>Madame sadoF, are you alright?
		t *PLORP*
		im wallRear-12
		sado ahegao Hoh...
		player worried She's totally all tuckered out... Hope she wasn't expecting a massage or something...
		player amused Well, I'll go ahead and think of this as another wallbutt customer satisfied. That alright with you, miss?
		sado ahegao Oohhh~<3
	`},
	{index: "watch-start-sadogato", name: "Time Stopwatch - Sadogato pt.1", image: "sado/watch1-4",
	content: `
		player sparkle Hiya sadoF!
		sado happy ...
		player sleep "Hello playerF, I'm very glad to see you, but I won't say that and instead I'll pretend to be grumpy, harumph."
		player amused Ah, so cute. Here, let's give you some pet-
		player shock Ah, wait! No, she'll get mad for real if I lose track of time petting her.<br>Let's see... She really likes it when I'm rough...
		player smug Hey, I've got an idea. Every cat loves having their butt pat, right Madame sadoF?
		sado sleep ...
		t ...
		t *SLAP*
		im sadogato/watch1-1-masc
		sado happy ...
		player joy And that's one hundred!
		im watch1-2-masc
		player happy Such a good girl, such a good kitty, yes you are!<br>Let's see, that might not be enough for her. I don't want her left feeling unsatisfied, so I should probably keep going.
		t ...
		im sadogato/watch1-3-masc
		player pent Hohhhh~<br>That feels nice...
		player worried Hmm, my dick's a bit messy now. I'd feel like a real jerk if I just cleaned it off on your furniture...<br>I'll just use your face since you didn't seem to mind getting messy that other time.
		t After a bit of adjustment to her pose and thoroughly wiping yourself off on sadoF, you take a step back to admire your handywork.
		t And then you make one tiiiny last adjustment.
		im sadogato/watch1-4
		player sparkle And voila! I bet she'll be so happy when I resume time. Surprised too, maybe.
		player sleep Naaah, who am I kidding. It's super common in fantasy for wizards to resist time magic. I bet you saw all this coming already, or maybe you knew the moment I found the watch.
		player surprised Oh! Or maybe it's actually yours!<br>Wait, no. You've got a purple-red ancient fantasy ritual vibe, this doesn't fit at all.
		player pent ... What was I talking about again? Hearing nothing but the sound of my own voice is making me crazy.<br>See you later, sadoF!
		sado ...
	`},
	{index: "watch-finish-sadogato", name: "Time Stopwatch - Sadogato pt.2", image: "sado/watch1-5",
	content: `
		im sadogato/watch1-5
		sado befuddled -mm-?<br>The human's sceeee-
		t sadoF's vision flashes a pure, blinding white. It's the first of her senses to go, the sheer amount of feedback coming from her other senses is telling her brain that seeing isn't important right now.
		t In fact nearly all of her senses blip out. Her pitch is growing louder but to her ears its fading away. Right now, the brain is directing all of its energy to the overwhelming smell of dickmusk and cum covering her face, before that too fades. Even her auxiliary senses, like her sense of temperature...
		im sadogato/watch1-6
		sado orgasm -EEEEEEEEEEEEEEeeeeee...
		t *THUD*
		t And her sense of balance...
		im sadogato/watch1-7
		sado broken ee... Een... T...
		t And her sense of time too. Overwhelming noise is coming from her pussy and ass, like her whole brain crashed to the floor with her, leaving her only capable of automatic functions like breathing, her heartbeat, and the clenching & squirting of her suddenly throbbing pussy.
	`},
	{index: "hole-sadogato", name: "Portal Onahole - Sadogato pt.1", image: "sado/hole1-1",
	content: `
		player Aaaaalrighty, I think this is as good a time as any...
		im hole1-1
		player amused Her clit's so big! Is the toy exaggerating it?<br>Maybe it's just because the pink of her pussy stands out so much against the fur.<br>Shame it doesn't copy her tail...
		t ...
		t Meanwhile...
		im hole00
		sado confused Hmm. No, nothing here. Nothing at all about how they're used.<br>How would you even use something like that on a girl? I know my clitoris is a bit on the larger side... And so unsightly too... But surely it's far too small...<br>Maybe I totally misread the situation?
		sado pent Hahhh... Mama, you were right, I'm completely useless when it comes to reading people...<br>Though, now that I think about it, I wonder why she gave me so many lessons on that. If I need to know someone's-
		sado forced ...!<br>Magic? Did I... No, this doesn't feel like mine...<br>Okay, focus sadoF. What's being cast? What's the target?<br>Take things one step at a time, a quick spell to make the magic spell visible...
		sado glare ...!
		im hole1-3
		sado shock ... Eh? It's located over my-
		sado glare Oh no you don't!
		t ...
		im hole1-4
		t After a brief crackle of red energy, the onahole reverts to its original pink in your hand.
		player panic Oh no! Did it break?<br>Aw geez, maybe using it on somebody who's already magic broke it?
		player befuddled ... No, that can't be it. Everyone in town is magical in their own way.<br>Mostly they're supernaturally fluffy and cute.
		player confused Hmm. It seems like it still works with the other townsfolk though. It's only broken with sadoF.
		player pent Hahh... I must have messed up. I should bring it to sadoF when I have the chance.
	`},
	{index: "hole-sadogato2", name: "Portal Onahole - Sadogato pt.2", image: "sado/hole00",
	content: `
		t As you step onto Pinecone Plaza, you suddenly feel a strange energy around you.
		player confused Hmm?<br>What's this?
		t Taking a look around, you're getting the usual stares as the only human in town. Nothing seems out of the ordinary.
		player pent Ugh. My brain is probably just getting stuck on the fact that this place should be called "Pineapple Plaza" instead.<br>Why do I fixate on these weird things?
		t As you shake your head trying to put your pedantic thoughts to rest, you fail to notice sparks of red energy appearing around your lower body.
		t ...
		sado panic Aaaaawawawa, I'm such an idiot!<br>For once in your life, can't I just think things through properly?<br>The human shows me a magic item *he found, then a mysterious spell triggers on me, of course they'd be related!<br>Ohhh, why did I have to put so much energy into the counter-spell?! 
		sado worried Come on... Focus... I can't risk the human becoming bored of me, I can't even figure out why they gave me the time of day in the first place...<br>There's no undoing the counter-spell, but if I can just replicate the circle...<br>A little bit more, a little more curve on that line...
		sado sparkle Aha! I've got it!
		t With a *FWOOOSH* and a *KRKZ* *KRKZ* of red energy, a magic circle appears, and something flops through.
		im hole2-1
		sado love Ohh... M-my...<br>So... Cute... And soft too...
		sado panic W-wait, soft?! Oh no, I was too slow!<br>They planned on using the hole to have sex with me from a distance, but I'm too late! If the human requires sexual satisfaction... If I can't handle it... Then what good am I as this town's protector?
		sado worried ... And if I leave *him flaccid, what good am I as a friend?
		sado angry No. No, I can fix this.<br>The spell may not be exactly the same, but it's close enough in effect.<br>I hope you're cozy in bed, human. 
		t ...
		t *FWOOSH* *KRKZ* *KRKZ*
		player befuddled ... That did not sound good.<br>Or natural.<br>If I had to place it, that almost sounded like the fabric of reality-
		player forced ...!
		t Actually, as you gaze down, it seems like that sound actually had to do with a very different kind of fabric. You're now completely exposed!
		im hole2-2
		player panic Ah!<r>N-no! Not this nightmare again! Why is it always public nudity?!<br>A-and w-why does it feel like something's rubbing against my dick?!
		im hole2-3
		player orgasm Hohhh!
		t ...
		sado forced Ghh!
		im hole2-4
		sado pent Hoh... It's... Way too huge...!<br>Without the human's strong hands to force me down, or at least their pheromones to blitz me out of my mind... I can't even get halfway... This is-
		sado shock Ghhhiii!?
		t sadoF's entire body suddenly tenses up as she can feel the phantom sensation of your cock spraying a rope of precum. On your end of things, it splatters onto the plaza's road, but on her end it's like the precum passes through her very body.
		sado horny W... Whaaaat?<br>Why d... Why did I enjoy that so much?<br>They aren't around for their pheromones to influence my mind, I...<br>Surely I'm not <i>actually</i> addicted to just the sensation of *his dick.<br>I know that when my brain is muddled I can have a... Touch... Of masochistic urges, but those are just when my brain is fogged over!
		im hole2-5
		sado perverted I'm not... Mgghh... I'm not <i>actually</i> squirting all over *his fat cock, I'm just... Lubrication!<br>My body doesn't <i>love</i> the feeling of being stretched out by impossibly thick dickmeat, this is just... An effect of the spell! Making things easier!<br>S-so... It'll be okay if...
		sado horny Mmm! Who am I kidding?!<br>Nobody's around to hear me, I can treat myself like as much of a bitch as I want!<br>In fact, I can move the portal around, it'll all just be ordinary sex on *his end!<br>No more need to hold back, so...
		im hole2-6
		sado orgasm Ghhhhhouhhhhh~! Fuckkkkkfuckfuck~!<br>Not even for breeding, I'm brutalizing my cunt just for funnnnn~!
		t ...
		im hole2-7
		player torogao Nghhhh~!
		t Despite your situation, you can't help but thrust your hips forwards. The magic circle in the air enveloping your cock moves with you, thrusting at its own pace.
		t You are technically helping to spread pheromones across town, so while this isn't illegal, it doesn't do much to stop the embarrassment of having a crowd start to form around you to watch your hands-free splurt show.
		t But suddenly, the circle stops, and starts to withdraw.
		player broken *Huff* *Huff*<br>A break? Or did it fin-
		player orgasm GHOUUUHHH~!
		t ...
		im hole2-8
		sado torogao Ngghhh, yes, yes! Faster, faster, fasterfasterfasterrrr! Ruin meeeee!
		im hole2-9
		sado forced Ghhhhggg-!
		sado ahegao Aaaaah~<br>I can feeeeel iiiiit~<br>You're cumming, aren't youuuu~
		im hole2-f
		sado afterglow It's like you're shooting straight through my bodyyyy~<br>All the warmth that would normally be in my womb is in my chest, my headdd~<br>Are you painting your bed thinking of meee~?
		t The sensation of hot goo passing through her is intoxicating, turning her into a blubbering mess.
		t And as you come down from your own orgasm most of the heat you feel is in your cheeks. All the folks around you have finally stopped staring at you, and now have their eyes locked like predators at the fat pool of cum in front of you.
		player pent D... Distraction ejaculation...!<br>Run away!
		t Leaving what is sure to devolve into a frenzy, you make a break for it. Luckily they're too entranced by your cum to notice, otherwise your fat dong slapping against your thighs and massive wobbly cheeks clapping would surely lead them to pounce you.
		player crying Magic is the worst thing everrrr!
	`},
	{index: "pill-sado", name: "Denial Pills - Sadogato", image: "sado/pill-2",
	content: `
		sado angry Hey! Get in here!
		t The door is already open before you have time to knock.
		player forced Ghhhg~<br>Okay!
		im pill-1
		sado frown Mmmgh, I could smell you from across the street... Lay here, and don't move.
		t ...
		sado frown It's worse than I thought, and I could hear you gurgling and frothing all the way here.<br>Whatever you did to yourself is complete lunacy, you know that?
		player Need... Need to cum!
		sado I know. Don't worry.
		im pill-2
		sado glare Let. It. Out.
		player orgasm HOHHHHHH~!
		im pill-3
		sado frown All mental limitations removed. Don't... Ghh...<br>Do <b>not</b> stop cumming, not until you feel your balls are completely empty.
		sado pleasured Hhh...<br><i>Good grief, *his mind is an overstuffed sack of lust!<br>Overstuffed... Sack...</i>
		player torogao Cummmingggg~! Can't... Can't stop cummingggg~!
		sado frown No, you can't.<br>I don't know if humans are built to withstand this level of sperm production, or thickness, but it's nothing in the face of my magic.
		sado pleasured <i>Soooo thick~<3!<br>The first shot, this huge, fat log of pure human lewdness on my face!<br>Ohhhh~ Wanna breath in~ Wanna smell it closely~<br>Must... Maintain pride...! Do... Not snort...! Human ball-jelly!</i>
		im pill-4
		player broken Hoh... Hoh... C-can't... Feel legs...
		sado frown ...
		sado pleasured <i>Amazinggg~!!! I'm totally soaked in human nut-goo~!!!<br>The overpowering smell of sweat and superthick jizz~ That slight gape of *his urethra~<3!!!<br>And the way *his eyes are fluttering~!
		player sleep Can't... Standing...<br>Zzz...
		im pill-5
		sado frown ...
		sado excited Ehe, ehehehehe~! *He passed out! Now it's all mine~! Every bit of jelly still stuck in that fat spermpipe~<3<br>Ah~ I have to deal with this first~ The first and thickest shot~<br>*Slrrrrrrrrrp*~
		t ...
		player tired Mrggghhh...
		t You creep back to the land of the living, sporting a sore head and a sorer set of nuts, but otherwise fine.
		t And totally clean too! A little sticky, so it couldn't be that sadoF washed you off...
		t Speaking of, you hear Madame sadoF call out to you from another room.
		sado frown You're awake? Good, you should be heading home. And don't come in here!
		player Right. Sorry to intrude, and thank you for the help!
		sado It was no... Ngh...
		im pill-6 
		sado pleasured Problem...! At all!
	`},
	{index: "sadoPat1", name: "Pat! That! Cat!", image: "sado/catpats1-1",
	content: `
		t You give sadoF's door a few taps, and it slowly creaks open without you turning the knob.
		player worried Something feels... Different.<br>Hello? Madame sadoF?
		sado special secret; Ehhhh~? You're just barging in without permission?
		im catpats1-1
		sado teasing Did you get so lonely you'll sneak into someone's house just for a bit of attention?
		player befuddled Bwuh? Madame sadoF, what's wrong?
		sado mocking You're asking me that? Well, first off I have to breathe in the air of a total looooser like you~
		player shock *gasp*! What's happened to you, are you okay?!<br>I'm not detecting any of your usual 'bad-at-communication-but-still-a-sweetheart-underneath' energy, that was just regular mean!
		player angry You must be under some kind of mind control! That's the only reason someone as nice as you would ever say something unkind!
		sado mocking Or maaaaybe I finally clued into how pathetic you are~<br>Poor, poor human, too totally addicted to thinking with your dick that you can't even-
		player tired Uhuh, yeah, whatever.<br>Okay, there's gotta be a clue around here somewhere. Maybe you're being possessed by a ghost?<br>N-no, I can't handle ghosts, I hope it's something else...
		player surprise Oh! This book's already open, let's see... "Ritual of the Turbo-brat"...<br>"The offending energy takes root in the mind in the form of a living idea that dominates... Will need to be purged from the body... Overwhelming force... While chanting the phrase..."<br>Hmm...
		sado annoyed Heyyy~ You can't just brush me off like that~!<br>Hey, looooser! Quit getting distracted by that stupid old-
		player fury Don't you dare call my friend's books stupid!<br>I want my friend back! So bend over, NOW!
		t ...
		sado orgasm GHOUHHHH~!!!
		im catpats1-2
		player fury Back to normal! Begone, thought! Back to normal! Begone, thought!
		sado torogao The... NGHHHH! Spell's-GHHHHH!!!<br>Already worn off!
		player angry I know you're lying! The real Madame sadoF would never pass up an opportunity to get her ass slapped even harder!
		player fury Back to normal! Begone, thought! Back to normal! Begone, thought!
		sado orgasm HOUHHHHHH~<3<3<3
		t ...
		player pent *Huff*... *Huff*...<br>Are you... Finally back, Madame sadoF?
		im catpats1-3
		sado broken My asssss~<br>It hurts...! It hurts, but I can't... Stop cumminggg...!
		player sparkle You <i>are</i> back! Oh thank goody goody goodness! I was so worried!
		player angry Don't scare me like that again!<br>'Relationship improving ritual'... Bah! We don't need something like that!
		player annoyed please stay away from risky spells like that in the future.<br>If you want me to come and hang over, all you need to do is ask!
		sado Ouuuuhhhh...
		player amused D'awww, I can't stay mad at that face.<br>I'll let you cool off, I'll see you later, okay?
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