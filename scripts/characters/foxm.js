var character = {index: "foxm", flags: "", fName: "Jasper", lName: "", color: "#A03D90", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"};

var logbookArray = [
	"im images/foxm/clothed/happy; im images/foxm/nude/happy; title Bookfox; One of the twin curators of Syrup Town's modest museum, foxmF and his sister foxfF handle organizing and caring for the museum's collections. <br>While more reserved and quiet than his sister, the two prefer to act in sync whenever possible. Still, whenever his twin isn't around foxmF grows a lot more meek, only hinting at his growing curiosity and lust through blushing mumbles.",
	"im images/foxm/logbook2.png; title Curator's Attire; The two foxes have collected records on hundreds, maybe soon to be thousands of different types of clothes worn by humans, so their decision to go totally bottomless is entirely their choice.<br>In this case the long sleeves are a deadly combo when paired with foxmF's natural cuteness. A blushing stare, a quiet glance away when he realizes you're looking, his absolutely adorably tiny flaccid pecker hanging below...<br>Most males when sent into heat will try and battle for dominance with other males, but foxmF's been a complete sub from day one. As a result instead of a typical display of strength when foxmF wants to mate he'll subtly lean his crotch forwards, presenting his subby, flaccid member to you as if to say 'Look at how pathetic I am. Take me, please?' And if you ignore him he'll just keep inching closer and closer, until he has his itty bitty bitch button pressed against you, oftentimes that'll be enough to send him right to the edge of orgasm too.",
	"im images/foxm/logbook3.png; title Soft & Shy; He wears a matching shirt fit with his twin, but while hers clearly shows the outline of her chest, anyone can clearly see that foxmF has barely any muscle to speak of. A sore spot, foxmF is often embarrassed by his soft, un-manly chest. Although sore might not be the right word, since going into heat, maybe sensitive is a better descriptor.<br>To his absolute shame, not only does his chest start to flutter whenever he sees you, but just rubbing at it, especially around the nipple, is enough to lead him to yelp and his little cocklette splurt a tiny clear line of pre between his legs.",
	"im images/foxm/logbook4.png; title Jiggly Butt; Another aspect shared exactly with his twin, foxmF's ass is the perfect blend of fit and jiggly. That plus a natural affinity for anal means he'll definitely turn into a grade-A buttslut with barely any effort.<br>Despite his best efforts to try and be manly, lately whenever foxmF thinks of mating he feels a buzz between his cheeks.",
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
	{index: "fun-foxm", priority: 40, requirements: "?flag foxf fun-start; ?trustMin foxm 1;", unique: true,},
];

var encounterArray = [
	{index: "reward2Start", type:"walking", requirements: "?location museumExterior; ?trustMin foxm 1; ?day 10; ?flag foxm reward1M; !flag foxm reward2; !flag foxm rewardWaiting;"},
	{index: "reward2", name: `See if foxmF is alone again today`, requirements: "?location museumExterior; ?trustMin foxm 1; ?flag foxm reward1M; ?day 10; !flag foxm reward2; ?flag foxm rewardWaiting;"},
];

var sceneArray = [
	{index: `intro2`,
	content: `
		eval writeFox('intro2');
	`,},
	{index: `mystery`,
	content: `
		eval addFlag('foxm', 'mystery');
		eval raiseTrust("foxm", 1);
		eval writeEvent("foxm", "mystery");
	`,},
	{index: `fun-foxm`,
	content: `
		eval addFlag('foxm', 'fun-foxm');
		eval raiseTrust("foxm", 1);
		eval writeEvent("foxm", "fun-foxm");
		finish
	`,},

	//Museum stuff
	{index: `museumTerrarium`,
	content: `
		foxm This is the terrarium. Or you could call it the botanical garden or the biodiversity exhibit. It's a lot of things.
		foxm sparkle It's where we'll keep track of the fruits, treasures, and critters you find!
		trans museumTerrariumQ1; Is there a reward for all this?
		trans museumTerrariumQ2; Why bother maintaining a garden?
		trans museumTerrariumQ3; Any advice searching for stuff?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumTerrarium')
	`,},
	{index: `museumTerrariumQ1`,
	content: `
		player Is there some kind of reward or incentive for collecting all of the?
		foxm Nope!
		foxm worried Should there be?<br>Wouldn't that just pull attention away from your main goal?
		player So it's just a form of intrinsic reward?
		foxm happy Yeah! You'll find plenty of bugs, fruits, and insects while hunting for jiggies and stuff anyways.	 
		trans museumTerrariumQ2; Why bother maintaining a garden?
		trans museumTerrariumQ3; Any advice searching for stuff?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumTerrarium')
	`,},
	{index: `museumTerrariumQ2`,
	content: `
		player Why maintain this whole botanical garden when all these species live right outside?
		foxm happy The ecosystem changes all the time. Something could happen that might endanger any one of these critters.
		foxf worried That'd be awful! !carnivore;
		foxm happy Plus, someday you might bring in some non-native species, like a snugworm from the autumnal farms. If you ever go there.
		foxf happy Is that what they're called? Huh. !carnivore;
		player Is it a lot of work to maintain this place?
		foxm sleep Not at all~<br>Especially when milfF volunteers all the time~ 
		trans museumTerrariumQ1; Is there a reward for all this?
		trans museumTerrariumQ3; Any advice searching for stuff?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumTerrarium')
	`,},
	{index: `museumTerrariumQ3`,
	content: `
		player Any advice on searching for stuff?
		foxm happy Well, gathering spots outside will refresh every day.
		foxf happy Which works out perfectly to foraging between spending time with townsfolk. !carnivore;
		foxm Plus, if you meet someone else in town you can go foraging with them.
		foxm sparkle And then you'll get double the stuff!	 
		trans museumTerrariumQ1; Is there a reward for all this?
		trans museumTerrariumQ2; Why bother maintaining a garden?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumTerrarium')
	`,},
	{index: `museumTechnology`,
	content: `
		foxm happy This is the technology wing.<br>It's also the history wing, sort of.
		foxm sparkle Artificial intelligence, how it works, how it's used...
		foxm worried And the myriad ethical questions that come from it...
		trans museumTechnologyQ1; How can I use this stuff, and what should I use specifically?
		trans museumTechnologyQ2; I'm on a bit of a budget, can I still use the technology?
		trans museumTechnologyQ3; What's with all <i>these</i> computers?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumTechnology')
	`,},
	{index: `museumTechnologyQ1`,
	content: `
		player How can I use this stuff, and what should I use specifically?
		foxm That's covered in the easyfluff and sdxl sections.<br>If you want to make stuff that looks just like us and matches the town's vibes, use Easyfluff with the Syuro lora.
		foxm sleep Otherwise, SDXL, or more specifically AutismMix, will give better results.
		foxm frown But it's also way, way more demanding on your graphics card!	 
		trans museumTechnologyQ2; I'm on a bit of a budget, can I still use the technology?
		trans museumTechnologyQ3; What's with all <i>these</i> computers?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumTechnology')
	`,},
	{index: `museumTechnologyQ2`,
	content: `
		player I'm on a bit of a budget, can I still use the technology?
		foxm worried Kind of, but the specific websites you'd use if you wanted to generate stuff from your phone or laptop change all the time.<br>Which means we don't really have any answers for you on that front, sorry.
		trans museumTechnologyQ1; How can I use this stuff, and what should I use specifically?
		trans museumTechnologyQ3; What's with all <i>these</i> computers?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumTechnology')
	`,},
	{index: `museumTechnologyQ3`,
	content: `
		player What are all of these computers actually for?
		foxm Looking cool and playing audio logs, mostly.<br>Plus there's so many in here I can push two of them together and use two keyboards at once!
		foxm sparkle Double hacking~!
		trans museumTechnologyQ1; How can I use this stuff, and what should I use specifically?
		trans museumTechnologyQ2; I'm on a bit of a budget, can I still use the technology?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumTechnology')
	`,},
	{index: `museumFashion`,
	content: `
		foxm This is the fashion wing~!
		foxm excited Here, you can change characters outfits as you please~
		trans museumFashionQ1; How were these outfits made?
		trans museumFashionQ2; How do I get more clothes?
		trans museumFashionQ3; Couldn't I just do this at home?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumFashion')
	`,},
	{index: `museumFashionQ1`,
	content: `
		player How were these outfits made?
		foxm Well, this wing <i>was</i> also going to have a section dedicated to different kinds of clothes and how they work, but there's not much point in that anymore...
		player shock Why not? I'd love to know how to wear a shirt.
		foxm worried You... But you're-<br>Nevermind. The reason is because right now everything you're seeing is built from Stable Diffusion 1.5. But soon it looks like new stuff will be made with Stable Diffusion XL.<br>Which means all the skills and tricks involved with creating clothes, poses, and characters will be rendered pretty pointless...
		foxm happy But hey, there's more than enough sexy stuff to go around right now.<br>If you wanna know more, there's a whole section in the technology wing about it.	 
		trans museumFashionQ2; How do I get more clothes?
		trans museumFashionQ3; Couldn't I just do this at home?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumFashion')
	`,},
	{index: `museumFashionQ2`,
	content: `
		player How do I get more clothes? 
		foxm The same way you did before, by gathering insects and fruit, selling them, and otherwise solving arbitrary tasks.
		foxm shock Is that not how humans usually get clothes?
		player happy No, we're pretty much the same.
		trans museumFashionQ1; How were these outfits made?
		trans museumFashionQ3; Couldn't I just do this at home?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumFashion')
	`,},
	{index: `museumFashionQ3`,
	content: `
		player Couldn't I just do this at home? That's where my wardrobe already is, and everyone I'm dressing up is more than welcome inside.
		foxm shock No way! Then we'd serve no actual gameplay purpose!
		foxm worried Plus, there's already way too many buttons in your house. Those poor mobile players already have their screens stuffed to burst! 
		trans museumFashionQ1; How were these outfits made?
		trans museumFashionQ2; How do I get more clothes?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumFashion')
	`,},
	{index: `museumSponsor`,
	content: `
		foxm happy This is the sponsor wing!<br>It's a dedication to all the current sponsors keeping this place alive~
		foxm worried It's a lot of names to keep track of...
		foxm sparkle But they're precious enough to make it all worth it!
		trans museumSponsorQ1; How do I get on one of these lists?
		trans museumSponsorQ2; What happened to the patrons?
		trans museumSponsorQ3; Can I get some cool stuff?
		trans reward1MAlt; I'm ready for the other half of my reward !flag foxm reward1M;
		button Finish; fakeLocation('museumSponsor')
	`,},
	{index: `museumSponsorQ1`,
	content: `
		player How do I end up on one of these lists? 
		foxm happy Money. Like, real money. The kind you can't just find in the bushes.
		player worried ...
		foxm Don't feel bad! Everything here is totally free for a reason. You can slamfuck this bootyhole all day every day without paying a dime.
		trans museumSponsorQ2; What happened to the patrons?
		trans museumSponsorQ3; Can I get some cool stuff?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumSponsor')
	`,},
	{index: `museumSponsorQ2`,
	content: `
		player What happened to the patrons?
		foxm angry The page was banned...<br>And the support staff ghosted afterwards...
		player worried Oof, touchy subject.
		trans museumSponsorQ1; How do I get on one of these lists?
		trans museumSponsorQ3; Can I get some cool stuff?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumSponsor')
	`,},
	{index: `museumSponsorQ3`,
	content: `
		player Can I get some cool stuff by being on these lists?
		foxm happy Do you like previews, voting in polls, and a star mounted on your bedroom wall?
		player Nope.
		foxm worried Oh. Well, no then. 
		foxm You could ask the town's founder for a picture or two though.
		player sparkle ...!
		trans museumSponsorQ1; How do I get on one of these lists?
		trans museumSponsorQ2; What happened to the patrons?
		eval specialFoxMOptions();
		button Finish; fakeLocation('museumSponsor')
	`,},
	{index: `permitIntro1`,
	content: `
		define foxd = dual sp1 foxm; sp2 foxf;
		t As you show off the weird worm you found, the foxes exchange a guilty look with each other.
		foxf worried ... I think it's time to come clean.
		foxm worried Yeah. playerF... The truth is...
		player confused ...?
		foxd crying We've been keeping a secret from you!
		foxf worried It's not just the townsfolk here who want that human dick of yours. It's everything.<br>The plants, the animals, I'm pretty sure the green frog chair we keep in storage would jump you if you had the chance.
		player love You guys have a froggy chair?
		foxm worried We did our best to keep away anything that might jump you, but...<br>Well, I guess we missed some.<br>We may be the museum curators, but our main job so far has been to make the town presentable for human visitors.<br>foxfF, you finish explaining, I'll go get... <i>It.</i>
		foxf pout Right. Since you have the feral fetish enabled...<br>It might be time to give you <i>the test</i>.<br>If you pass, we'll give you a special permit and you'll start finding some of the more... Let's say, <i>social</i> critters of the forest called <b>Cryptids</b>.<br>There's actually a secret option in the preferences menu we've kept hidden until now, passing the test unlocks it.
		player worried You two are making this sound really ominous.<br>You guys were making the forest safer for me, am I understanding you right?
		foxf blush W-well...<br>Maybe that's what we were telling ourselves.<br>But really, we just didn't want any competition.
		foxm angry I'm back. playerF, if you want that permit-
		im misc/permitIntro1a
		foxm angry You'll need to have sex with this fish.
		foxf pout We can't risk letting some of these weirder species out unless we know they won't scare you away.<br>I'll take care of the worm until you make your final decision.<br>Come back and let us know if you want to take it.
		eval addFlag("foxf", "permitWaiting");
		eval removeItem("unknownWorm");
		eval unencounter('`+character.index+`')
		finish
	`,},
	{index: `permitIntro2`,
	content: `
		player happy I'm ready to get my permit.
		foxf worried Are you absolutely...
		foxm worried Positively sure...?
		foxf pout Some of the things you find after obtaining the permit won't be hidden by carnivore or vegetarian mode.
		foxm pout Because it's not like you can categorize things like that worm you found before as straight or gay.<br>You might see or fuck something weirder than you're okay with.<br>Worms with big lips, fish with boobs, tentacle plants, onahole mollusks...
		foxf scared A weasel with a butthole for a face!
		player worried <i>They're trying to scare me away from this.<br>They must be worried some of the weirder stuff might scare me away from the town.</i>
		trans permitIntro3; Be a Certified Freak
		cancel
	`,},
	{index: `permitIntro3`,
	content: `
		eval removeFlag("foxf", "permitWaiting");
		eval unencounter('`+character.index+`')
		player sleep I'm one-hundo percent sure. Bring me the titty fish.
		t The two foxes close their eyes and nod. Neither say anything as foxfF heads out of the museum and foxmF takes you by the hand into another room.
		player confused Is that a camera?
		foxm happy Yeah. Now, smile. Not a normal smile, it needs to be "I'm about to have sex with a big-tiddy fish."
		player confused Hmm... Okay, I think I got it. Take the picture whenever you're ready.
		foxm happy Got it.
		t A blinding flash, followed by a *CLICK*, then a machine behind foxmF starts to whirr.
		foxm Here.
		eval writeBig("foxf/permit-background", "player:21-18-0.5#expression:smug#overlay:foxf/permit-overlay#")
		eval addItem("permit");
		player surprise Whoa! Wait, where's-
		foxm happy Don't worry, you can have sex with the fish later.<br>We just had to make sure you were really, really, <i>really</i> sure about this.<br>foxfF is at your place, assembling a terrarium where you can store all the weird critters you want to mate with.
		player befuddled So... Wait, don't you keep them here?
		foxm pout No, no way. Don't worry, with that permit in your hands they'll start appearing while gathering.<br>And you can nut in them in the comfort of your own home.<br>You know how devastated I'd be if you started boning a fish right in front of me? The jealousy would eat me away.
		player shock Wah! Okay, okay, don't pout.<br>So, it's all safe, right? I probably should have asked that sooner.
		foxm sparkle Absolutely! foxfF and I made absolutely sure nothing would actually hurt you or drain you too badly. Actually, some species boost sexual stamina and fluid output, like that worm you found earlier!<br>Speaking of, don't worry, we kept it safe for you. Here, have it back.
		eval addItem("bug-lurm");
		player confused And the fish?
		foxm smug You'll have to catch one yourself. That's me and foxfF's dinner.<br>Don't forget, these are wild animals after all.
		foxm surprise Oh! But one more thing. After you mate with anything you catch, let it go.<br>It'll be a good way to spread your pheromones, improve nature around here, and who knows, maybe eventually new species will develop.
		player scared Wait, like, they'll have my kids? And-
		foxm fury No! Absolutely not, no way, you can't back out now!<br>You saw me hold up the titty fish, you said you wanted to have sex with it. You can't back out now!
		foxm teasing ... Just kidding~<br>Actually, you still can. Because there's one last step. <br>Getting the permit only unlocked the preferences option.<br>You'll need to <b>Go into the settings menu, click "Preferences", then enable the weird stuff</b>.
		player confused I see. I'll get to it.
		foxm joy Have fun! And don't be a stranger, okay?
		finish
	`,},
	{index: `reward1MAlt`,
	content: `
		foxm sparkle Wow, really?
		foxf frown Eh? Learning time's done already?
		foxm sleep Jelly baby jelly baby the human wants to have sex with me and so my sister's a jelly baby~
		foxf happy Ah whatever, it gives me more time to go into heat proper. The real joke's on you, I get to take notes this time! 
		player worried About that... Will I be graded on my performance?
		foxf I promise to stay very quiet and not judge. It's like I won't even be here!
		foxm We'll archive them for later, it'll be a long time before anyone else sees it.
		player Oh, good. I'll be a skeleton by then, and everybody knows skeletons can't feel shame.
		foxm worried O... Kay? A-anyways, let's get started. So, if it's alright with you, could we not do anything too rough? At least for now. The pheromones need time to circulate before I can go into heat proper. If I try to do anal before then, well...
		player happy It's fine!
		foxm Great! Let me just take a seat. This'll be better too, since directly exposing myself to the source of the pheromones should... Should...
		t ...
		eval writeEvent("foxm", "reward1M");
		eval addFlag("foxm", "reward1M");
		eval passTime();
		finish
	`,},
	{index: `reward2`,
	content: `
		eval writeEvent("foxm", "reward2");
		eval addFlag("foxm", "reward2");
		eval raiseTrust("foxm", 1);
		eval passTime();
		eval data.player.location = "willowWalk";
		finish
	`,},
	{index: `reward2Start`,
	content: `
		t You arrive at the museum, noticing the door is wide open and all the windows are too.
		t Taking a peek inside...
		im foxm/reward2-1
		foxm happy Oh, hello! I'm just doing a bit of cleaning up. I think foxfF went out a bit ago.
		player worried Did she just leave you to do all the cleaning yourself?
		foxm happy Oh, no no no! I'm just doing a bit of dusting, letting the place air out.<br>Actually, I'm pretty much done. I was just about to take a break.<br>Ooh, I know! Why don't we go to the back and have a little chat?
		eval addFlag("foxm", "rewardWaiting");
		trans reward2; Hang out with foxmF
		trans cancel; Rain check
		eval unencounter(data.player.currentCharacter);
	`,},
	{index: `repeat1`,
	content: `
		eval writeEvent("foxm", "repeat1");
		eval unlockScene("foxf", "repeat1");
		eval addFlag("foxf", "repeat1");
		eval addFlag("foxm", "repeat1");
		eval passTime();
		finish
	`,},
	{index: `repeat1First`,
		content: `
			eval writeEvent('repeat1')
			eval unlockScene("foxf", "repeat1");
			eval addFlag('foxf', 'repeat1')
			eval addFlag("foxm", "repeat1");
			eval passTime();
			finish
		`
	},
	{index: `repeat1Repeat`,
		content: `
			im repeat1-1
			im repeat1-2a !girls;
			im foxf/repeat1-2b ?girls;
			im repeat1-3a !girls;
			im foxf/repeat1-3b ?girls;
			finish
		`
	},
	{index: `cancel`,
	content: `
		eval unencounter(data.player.currentCharacter);
		eval changeLocation(data.player.location);
	`,},
	{index: "resumeDigging", content: `
		eval digResume();
	`},
	{index: "forestTrapFoxM", content: `
		eval writeEvent("trap");
		eval addFlag("foxm", "trap");
		finish
	`},
]

var eventArray = [
	{index: "reward1M", name: "First Reward", image: "foxm/reward1M-1",
	content: `
		im foxm/reward1M-1
		foxm shock Oh... Wow...<br>It's... Bigger than I thought it would be.<br>You know, when males go into h... Into heat, they often try to challenge other males for d-dominance...
		im foxm/reward1M-2
		foxm excited I don't... Really think I need to do that...<br>Compared to yours, my needly-little prick barely even exists~
		player happy Aww, don't be too hard on yourself. Yours is cute~!
		foxm pleasured C-cute~! Nghh~!
		t You hear a soft squelching sound from between foxmF's legs, but before you can even glance to check what it was...
		im foxm/reward1M-3
		foxm ahegao *GHLLLK*
		t foxmF has thrown himself mouth-first at your cock.
		foxm excited <i>Ouuuhgh~<br>It's so huge I can barely fit my mouth around it~

		im foxm/reward1M-4
		foxm *GLK* *GLK* *GLK*
		t foxmF wastes no time, his copious amounts of drool making his throat slick and inviting as he forces himself deeper.
		t And deeper...
		player shock H-hey, careful, you could choke yourself!
		foxm excited<i>Ch-choke? On this?

		im foxm/reward1M-5
		foxm ahegao *GHHHLK* <3
		foxm excited <i>I can't stop my eyes from rolling back~<br>I wanna stare more at this amazing dick but I can't stop~ All I can see how fuck-stupid it's making me~
		player excited Ah~<br>G-gonna-
		foxm <i>It's pulsing~! *HE's pulsing~!<br>Ngh... Gotta pull back!<br>Gotta... Taste! Gottatastegottatastegottataste~!!!

		im foxm/reward1M-6
		t *SCHLOOOOOORP*
		im foxm/reward1M-7
		t *POP*
		im foxm/reward1M-8
		foxm Ehehe... Licky-suck, wanna licky-suck again... <3<br>More cum please~<3
		player excited Hoh... You were such a little nerd but now you look totally brain-fried.
		foxm ahegao Ehehe...<br>*Sniff* *Sniff*
		foxm torogao Ghhh~! Cumming~!
		player worried Cumming just from the smell alone, you didn't even touch yourself...<br>I should probably go... Where's your sister?
		foxf ahegao NGHHH~!
		player Ah... Doing an impression of a lawn sprinkler, alright.<br>Well, if I don't head out you two  won't get a break from my pheromones, huh?
		t With the foxes incapacitated, you decide it's best to make yourself scarce so they can recover.
		t You push out past the large museum doors, leaving the giggling, moaning foxes behind you to clean up and recuperate.

	`},
	{index: "reward2", name: "Day at Home", image: "foxm/reward2-2",
	content: `
		t You decide to spend just a bit hanging out with the meek foxmF.
		t ...
		foxm happy Soooo~?
		player worried Hah... Alright, alright...<br>I <i>guess</i> we can take a break from talking about the evolution of fluffy tails.
		foxm sparkle Yippee~! Alright, alright~!
		im reward2-2
		player sleep Gee, I wonder what you could possibly want to do?
		foxm excited Cock~! Cock please~!<br>I want what spread my throat to turn me inside out~!
		im reward2-3
		player It's a complete mystery~! You're pretty hard to read, you know that, foxmF?
		foxm worried Ehh~? Pleeease~? No more playing around~!<br> I worked really hard today, keeping this place organized takes a lot of studying, my head's fit to burst with trivia, and biology facts, and...
		foxm excited And what's the point of having all these smarts if I can't get a hot human to fuck them out of me~?<br>I'd gladly let my head run dry if it means my penis gets to squirt itself dry too~
		player excited Well... When you put it that way...
		im reward2-4
		foxm ahegao Ohhhh~<br>Ffffffuck me stupid~
		player Pfft, you already look the part~
		foxm Don wanna run the museum~<br>Make me cum till my head stops workinggg~
		player shock Eh? No way! I need you working hard!<br>Cock is a reward, foxmF!
		foxm Okayyy~<br>I'll be a good boy, good boy~<br>Fuck me harder and I'll do whatever you waaaaant~!
		player sparkle That's it, now you're on the right track~!
		foxm torogao Ghhhhk~!
		im reward2-5
		foxm Ngghhhh~<br>Cumminggg~<br>Human cum makes my penis shquirtttt~<br>My insides feel sho waaaaarm~
		im reward2-6rosebud
		player excited Hah... foxmF?
		foxm ahegao Ooohh~<3
		player worried Aww jeez... I think I really did fuck you stupid... You'll go back to normal after some rest, right?
		foxm I'll be a good boyyy~<br>Good boysh get to be shubmisshive breeding holesh~<br>Get their tummiesh shtuffed with cummm~
		player worried ...
		player sparkle ... Great! Good to hear it. And keep up the good work, okay?
		foxm torogao Ghhh~<br>Tummy sho full~<br>Body shtill remembers shape of cockkkk~
	`},
	{index: "mystery", name: "Fox in a box", image: "foxm/mystery-foxm1",
	content: `
		outfit foxm nude
		t Inside the mystery chest is...
		im foxm/mystery-foxm1
		foxm sparkle It's me!
		t It's a fox!
		player sparkle foxmF! How'd you get in there, silly?
		player befuddled Actually, wait, how <i>does</i> this work? Did I just dig you out of the ground?<br>And how am I finding bigger things like these statues?
		foxm sleep Yes, absolutely. It might seem weird to be digging holes with a pick and hammer, but you're definitely finding all this treasure in the ground before cleaning it off.<br>And don't listen to anyone who tries to tell you different.<br>Seriously, imagine if there were a whole cave network for every different treasure you dug up. That'd be crazy!
		player befuddled Eh? But wait-
		foxm excited Do I have to?<br>Really, I'd prefer if we just got to the fun part right away~<br>Ehehe~<3
		im foxm/mystery-foxm2
		foxm love Ooh~<3<br>I wish all the words didn't leave my head whenever I see it... I can't think of what to say~<br>But, I know just what to do~<3
		im foxm/mystery-foxm3
		foxm excited I may not have boobs like my sister, but my chest is still plenty soft~<br>I wonder if my nipples would be just as sensitive if I'd been born a girl~
		im foxm/mystery-foxm4
		player love Cyuuute~
		foxm seductive That's right, keep thrusting~<br>Just forget I'm a boy, it doesn't matter anyways, not when you're around...<br>Ehehe, your cock is pulsing so strongly I can feel your heartbeat against mine~!
		foxm perverted Cum! Cum on me!
		player orgasm Hoooohh~!
		im foxm/mystery-foxm5
		foxm ahegao Ahaaaaa~<3
		foxm afterglow Aha... Ahaha~<br>So warm... So sticky~<br>It was totally worth waiting in this box so long~<3
	`},
	{index: "fun-foxm", name: "Morning visitor", image: "foxm/fun-foxm1",
	content: `
		player sleep Mmm, what a nice-
		player scared WAAAH!
		im fun-foxm1
		foxm excited Heh... Ehehe...<br>You... You can go back to sleep, I'm just...<br>Just watching...
		player pout foxmF, that's really creepy!
		foxm blush S-sorry...<br>I came over to see if you were home, but you didn't answer when I knocked...<br>So I came to your window to see if you were out and...
		player worried And? You just felt like watching me sleep?
		foxm worried Yeah...<br>You said I could visit whenever, but...<br>I'm really sorry, I guess I misunderstood.
		player tired ... I guess I did say that.<br>Alright, it's okay. You can come inside.
		player pout But we're just hanging out, like buddies, okay? <br>You scared me half to death, I'm not even a little in the mood for anything more than a nice breakfast right now.
		t ...
		foxm excited Ehe~ Ehehe~<br>Come on, coooome on, a liiittle closer~
		im fun-foxm2
		player excited Fluffy~<br>Wonderful tail~
		foxm excited That's right, your favorite tail, just for you~
		t He writhes in need as you approach, using his wonderfully fluffy tail to lure you in closer.
		foxm Heee...! I want it soooo bad~!
		im fun-foxm3
		foxm love Ohhh~
		foxm pleasured Ohhh, fuck~! *his weight's crushing me~!<br>I can barely breathe~!<br>The more I squirm the closer *he gets, pretty soon his balls will be up against my noooose~<3!
		player excited Ehehe~
		foxm orgasm GHLLLLHRK-!
		player shock Wah! Oh, foxmF, sorry! I got totally hypnotized there!<br>Sorry, I'll-
		im fun-foxm4
		t Though you try to pull back, foxmF's hands grab onto your hips.
		foxm love <i>Just...</i><br>KLHRK-<br><i>A little... Longer~<3!!!</i>
		t Not wanting to fuck the literal lights out of your fox buddy, you grab onto his torso and wrench yourself free...
		im fun-foxm5
		t And as you do, just in time, foxmF's own peenie splurts out, probably in some mixture of excitement and submission.
		foxm broken ...
		player scared foxmF? Are-
		foxm torogao Khhhk-!<br>*Cough* *Cough*
		player pent Thank goodness...<br>Alright, no more for you mister, that sort of stuff is bad for you.<br>I'm gonna get your sister to take you home, and I won't take no for an answer.
		foxm afterglow Ehe... Ehehe~<3
	`},
	{index: "fun-finish-foxf-foxm", name: "A-paw-logies", image: "foxf/fun-finish1", tags: "male, female", content: `
		define foxd = dual sp1 foxm; sp2 foxf;
		t As you step into the square, you're quickly grabbed by the shoulder and dragged over to a pair of sad foxes.
		mayor angry So? What do you two have to say for yourselves?
		im foxf/fun-finish1?boys; ?girls;
		im foxf/fun-finish1Vegetarian!boys;?girls;
		im foxf/fun-finish1Carnivore?boys;!girls;
		im foxf/fun-finish1!boys; !girls;
		foxd crying We're sowwy...<br>*Sniff*
		player scared Eh? What's going on?
		mayor pent These two have been running around town, trying to sneak into your house, accosting you in the middle of the street-
		player worried Ah. It's not that big of a deal-
		mayor fury It absolutely is!<br>Their behavior sets a bad example for the other townsfolk!
		mayor pout How am I supposed to convince the locals not to pin you down to the curb and rape you on the spot, when these two are publicly molesting you?<br><i>Not to mention how jealous I get...</i>
		foxf worried But we had permission...
		foxm worried And our work is really hard, we barely had a chance to hang out with the human before now...
		mayor tired You two are being idiots.<br>If you're feeling overwhelmed, you can rely on others.
		player smug Like you do?
		mayor fury Shush!<br>Now, the two of you, apologize properly, and set a better example for the town!
		foxd crying Okay...
		t The foxes take a deep breath, almost making it seem like their earlier crying was all fake.
		foxf worried (Psst, foxmF, I think it's time for the secret weapon.)
		foxm worried (Okay, it's risky, but I trust you.)
		foxd crying We...
		im foxf/fun-finish2?boys;?girls;
		im foxf/fun-finish2Vegetarian!boys;?girls;
		im foxf/fun-finish2Carnivore?boys;!girls;
		im foxf/fun-finish2!boys;!girls;
		foxd flirting A-paw-logize!
		player pleasured FORGIVEN!
		foxd Yay!<br>We're forgiven!
		mayor shock Wha-<br>Hey you brats, sit back-<br>Get back here! playerF, don't be fooled by their cuteness!
		player love Hohh... That was too adorable...
		foxd laughing Ahaha~! Run away~!
		im foxf/fun-finish3
		foxm Ahaha~! Oh, foxfF, doesn't this feel like the end of some kind of arc?
		mayor fury Quit talking nonsense and get back here!<br>And slow down, I'm a civil servant, this butt was meant for desk-work, not chasing!
		foxf Ahaha~! Yeah little bro, kinda! Like the sort of ending we'd get right before not getting any more content for a while!
		im foxf/fun-finish5
		foxd scared ...?
		mayor pent St... Stooop!
	`},
	{index: "fun-foxd-foxm-foxf", name: "Awoo~", image: "foxf/foxd-fun1-1", tags: "male, female",
	content: `
		eval writeEvent("foxf", "fun-foxd-foxm-foxf");
	`},
	{index: "repeat1", name: "Repeatable - Heavy Petting", image: "foxm/repeat1-1", requirements: "?flag "+character.index+" repeat1;",
	content: `
		define foxd = dual sp1 foxm; sp2 foxf;
		im foxm/repeat1-1
		foxm surprise Oh! W-what did I do? Did something good happen?
		player sleep You're a hard worker! I know you're putting your heart and soul into keeping this town light and fun.<br>I think you deserve to be appreciated for that.
		foxm love Oh... W-well... If you insist!<br>Your hands are... So much...!<br>I'm not used to being praised...
		foxm excited Hehehe~!<br><i>I look completely innocent right now, but I don't even need to touch myself to get off! This is more than enough!</i>
		player excited Ehehe~<br><i>He thinks I don't notice his little piddly winky bobbing up and down...<br>Jokes on him, he can get off all he likes, so long as I can keep petting him~</i>

		foxf scared ...!<br>D... Did... ?girls;
		foxf crying Did I not... Do a good job too? ?girls;
		player shock Oh, foxfF! You've done great work too! Come here! ?girls;
		foxf love ...! ?girls;
		player worried Do I dare... ?girls;
		player angry No, I must! Both of you deserve to be fluff-loved! And if the legendary double-scritch technique kills me, then I never deserved to live in the first place!<br>Take this, double fluff-lover attack! ?girls;
		im foxf/repeat1-2b ?girls;
		foxd perverted Mmmmh~ ?girls;
		player orgasm Hwooooah~! Good girl! Good boy! You're both precious! ?girls;
		t The sensation is overwhelming. Fox fur is extremely fine and luxurious, a short layer of guard hairs protects the treasure beneath, the fluffy and warm underfur! But giving the underfur a solid loving means part of your hand is embraced by pure warm floof, while the remainder is slowly growing addicted to the bristly overcoat. ?girls;
		t Combine that with the fact that you're petting two fluffy creatures at once... ?girls;
		player torogao It's... Too much for... Brain to handle!<br>Hang in there...! This is what we lived for!<br>Brain! Can you hear me?! ?girls;
		t Soooooft~<3 ?girls;
		player forced I'm... Becoming a fluffing machine!<br>I can't stop!<br>foxfF, foxmF, I'm sorry, I can't hold back! ?girls;
		im foxf/repeat1-3b ?girls;
		foxd orgasm Ghouuhhh~<3 ?girls;
		player torogao Ngghhh~!!! ?girls;
		t Eventually, the three of you collapse onto the floor, you being overwhelmed in a very different way than the two human-addicted foxes.
		player pent *Huff* *Huff*<br>You two alright~? ?girls;
		foxf afterglow Hyehhhhsh... ?girls;
		foxm afterglow Meehltyyy... ?girls;
		player tired ... I truly, truly hope that someday I'll either be strong enough to stop myself from giving in to overfluffing... ?girls;
		player sleep Or that I become weak enough to never hold myself back from it again... ?girls;


		player worried So... Soft... Do I dare... !girls;
		player angry No, I must! You deserve to be fluff-loved to the highest degree! And if the legendary super-scritch technique kills me, then I never deserved to live in the first place!<br>Take this, super fluff-lover attack! !girls;
		im foxm/repeat1-2a !girls;
		foxf perverted Mmmmh~ !girls;
		player orgasm Hwooooah~! Good boy! You're precious! !girls;
		t The sensation is overwhelming. Fox fur is extremely fine and luxurious, a short layer of guard hairs protects the treasure beneath, the fluffy and warm underfur! But giving the underfur a solid loving means part of your hand is embraced by pure warm floof, while the remainder is slowly growing addicted to the bristly overcoat. !girls;
		player torogao It's... Too much for... Brain to handle!<br>Hang in there...! This is what we lived for!<br>Brain! Can you hear me?! !girls;
		t Soooooft~<3 !girls;
		player forced I'm... Becoming a fluffing machine!<br>I can't stop!<br>foxmF, I'm sorry, I can't hold back! !girls;
		im foxm/repeat1-3a !girls;
		foxm orgasm Ghouuhhh~<3 !girls;
		player torogao Ngghhh~!!! !girls;
		t Eventually, the two of you collapse onto the floor, you being overwhelmed in a very different way than the human-addicted fox across from you.
		player pent *Huff* *Huff*<br>You alright~? !girls;
		foxm afterglow Meehltyyy... !girls;
		player tired ... I truly, truly hope that someday I'll either be strong enough to stop myself from giving in to overfluffing... !girls;
		player sleep Or that I become weak enough to never hold myself back from it again... !girls;
	`},
	{index: "trap", name: "Tentacle Trap", image: "foxm/foxm-trap1-2", requirements: "",
	content: `
		player happy Hum dee dum~
		player shock Wah!
		im foxm/foxm-trap1-1
		foxm blushy Oh, hey! How's it going?
		player happy Well, I wasn't expecting to find half of a fox. But aside from that, pretty good!<br>Where's your other half?
		foxm D-do you mean my sister, or-
		im foxm/foxm-trap1-2
		foxm forced Eep!
		player confused You okay?
		foxm blushy Y-yeah! Just fine! Just a little bit stuck. In this random hole in the floor.
		player befuddled Which just so happens to be making squelching sounds?
		foxm Yep!
		foxm pent ... Okay, look, I was checking on this tentacle plant, and... Just don't tell foxfF I fell into it, please?<br>It uses a special venom to numb sensation, so I'm not sure exactly <i>what</i> it's doing down there...
		im foxm/foxm-trap1-3
		foxm But from this warm buzzing in my head, I get the impression it's maybe gone on a bit too long.
		player worried Hmm? So you want me to help pull you out?<br>Honestly, the two of you are so mischevious, maybe a little longer in there would be good for you.<br>Plus, you guys said you checked the plants and animals here for anything dangerous, so it can't be-
		foxm It secrets a pretty thick mucus
		im foxm/foxm-trap1-4A !urethral;
		im foxm/foxm-trap1-4Urethral ?urethral;
		foxm Which is probably ruining-
		player panic YOUR TAIL!<br>Don't you worry little buddy, I'll get you out of there!
		foxm scared Ah, wait, not too fast, if it thinks I'm being rescued it'll cancel the numbing-
		im foxm/foxm-trap1-5A !urethral;
		im foxm/foxm-trap1-5Urethral ?urethral;
		foxm orgasm GHOUHHHHH~!<br>What's... It doing down there?!
		player annoyed Heave... Ho...! Heave... Ho!
		t ...
		player scared Awawawa-<br>Is it okay? Is your fur alright?
		foxm pent It... Hohh...
		im foxm/foxm-trap1-finA !urethral;
		im foxm/foxm-trap1-finUrethral ?urethral;
		foxm Yeah, this stuff should all wash out... And the growth should be temporary, especially since I have antivenom for it back at the museum...<br>I'm gonna... Waddle home, I guess...
		player happy Let me know if you need help brushing!
		foxm Sure, sure... God, this thing is <i>pulsating</i>...<br>*Grumble* *Grumble*
	`},
	{index: "pill-foxd", name: "Denial Pills - Foxes", image: "foxf/pills-foxf1", tags: "female",
	content: `
		define foxd = dual sp1 foxm; sp2 foxf;
		eval writeFoxPills();
		eval unlockScene("foxm", "pill-foxd");
	`},
];

var specialFoxMList = [
	{index: `reward1MAlt`, requirements: "!flag foxm reward1M;", text: `I'm ready for the other half of my reward`},
	{index: `permitIntro1`, requirements: "?item unknownWorm; !flag foxf permitWaiting; !item permit;", text: `Check out this weird worm I found!`},
	{index: `permitIntro2`, requirements: "?flag foxf permitWaiting; !item permit;", text: `I'm ready to get my permit!`},
	{index: `repeat1`, requirements: "!flag foxf repeat1; !flag foxm repeat1;", text: `You've done a good job, you deserve something nice`},
]

function specialFoxMOptions() {
	for (i = 0; i < specialFoxMList.length; i++) {
		if (checkRequirements(specialFoxMList[i].requirements) == true) {
			writeHTML(`
				trans `+specialFoxMList[i].index+`; `+specialFoxMList[i].text+`
			`);
		}
	}
}

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