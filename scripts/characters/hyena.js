var character = {index: "hyena", flags: "", fName: "Helena", lName: "", color: "#DEB165", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"};

var logbookArray = [
	"im images/hyena/clothed/happy; title Cool; ?trustMin hyena 2; hyenaF is the absolute coolest cat on the block. Metaphorically of course. She's one of the most outgoing residents of Syrup Town and is definitely the most confident too. A self-proclaimed expert on human culture, she's always eager to share her knowledge with anyone who'll listen.<br>Granted, some of that knowledge seems just a little bit out of date, or more often just plain unfounded. But she's always got a smile on her face and is quick to laugh even at jokes at her own expense, and in the end that's what being cool is really about, right?",
	"im images/hyena/logbook2.png; title Radical Jacket; ?trustMin hyena 3; hyenaF seems to like wearing a black leather jacket. It's a mystery both where she got it from and if it's made from real leather.<br>Outside of that she doesn't bother wearing anything at all, fashion trends don't really matter when you look as sick as she does. Granted, it's actually a little small, so her chest is always completely exposed, her breasts hanging freely and nipples never afraid to poke out and say hello.<br>Before she went into heat it was never an issue, hopefully she won't get too distracted by them being super sensitive and brushing against her jacket's hem.",
	"im images/hyena/logbook3.png; title Canine Cock; ?trustMin hyena 4; Below, hyenaF's got an absolute beast of a cock. It's always bright red and engorged, her knot clearly visible at all times. When 'flaccid' it just hangs down between her knees.<br>It seems like people in town don't have sheaths, probably because here in Syrup Town dicks are either meant to project dominance or advertise sex depending on their size.<br>Folks around here with dicks feel compelled to challenge other males for dominance when going into heat, though it seems like she skipped that whole phase?<br>Wait, when you two first met...",
	"im images/hyena/logbook4.png; title Balloon Knot; ?trustMin hyena 5; It turns out that her status as a human expert was a bit misleading. Turns out she's just been going with the flow.<br>What else... Well, you didn't get a great look at it, but her fresh anus is nestled between two cheeks that perfectly form the shape of a heart. Her butt has just the right amount of meat on it that you'd be pretty happy laying your head on one of the cheeks.<br>Really though, they're better for grasping from the other side as her own hands are on your head, forcing you down her knot.<br>She went a little crazy from heat, but luckily she's as fast a learner as she is an eager one, and although she's a total quickshot, a complete premature ejaculator, it'll be exciting to see her try and get a hang of her own cock's newfound urges!<br>Still, you'll have to take things slow for now. Best not to get too knotty too quickly.",
];

var achievementArray = [
	{index:"92"+character.index+"Friend", frame: "ultraRare", name: "Hyena's BFF", requirements: "?trustMin "+character.index+" 6;", description: "Become hyenaF's true friend and teach her what she's been missing out on.", image: "hyena/achievement1",},
];

var itemsArray = [
];

var shopArray = [
];

var pickupArray = [
	{index: "gatheringStart", requirements: "?holiday hyena; ?location forestOrchard;", top: 35, left: 5, event: true, size: 8, image: "items/fruit/generic"},

	{index: "fishingStart", requirements: "?holiday hyena; ?location lakesideRetreat; ?item rod;", top: 35, left: 40, event: true, size: 15, image: "items/rod"},

	{index: "huntingStart", requirements: "?holiday hyena; ?location forestWilderness; ?item net;", top: 40, left: 69, event: true, size: 15, image: "items/net"},
	{index: "hyenaClothes", requirements: "?flag hyena House; !item Leather Jacket (Closed);", top: 30, left: 20, event: true, size: 10, image: "items/question"},
	{index: "hyenaPoster", requirements: "?flag hyena House; !flag hyena poster;", top: 30, left: 20, event: true, size: 10, image: "items/question"},
];

var morningArray = [
	{index: "morning1", priority: 99, requirements: "?trust hyena 5;", unique: true,},
	{index: "hyenaMorning-mayor", requirements: "?trustMin hyena 1; ?trustMin mayor 1;", unique: false,},
	{index: "hyenaMorning-shopkeep", requirements: "?trustMin hyena 1; ?trustMin shopkeep 1;", unique: false,},
	{index: "hyenaMorning-carpenter", priority: 1, requirements: "?trustMin hyena 1; ?trustMin carpenter 1;", unique: false,},
	{index: "hyenaMorning-wolf", requirements: "?trustMin hyena 1; ?trustMin wolf 1;", unique: false,},
	{index: "hyenaMorning-sadogato", priority: 1, requirements: "?trustMin hyena 1; ?trustMin sadogato 1;", unique: false,},
	{index: "hyenaMorning-milf", priority: 1, requirements: "?trustMin hyena 1; ?trustMin milf 1;", unique: false,},
	{index: "hyenaMorning-nun", priority: 1, requirements: "?trustMin hyena 1; ?trustMin nun 6;", unique: false,},
	{index: "hyenaMorning-mesu", priority: 1, requirements: "?trustMin hyena 1; ?trustMin mesu 1;", unique: false,},
	//{index: "hyenaMorning-fash", priority: 1, requirements: "?trustMin hyena 1; ?trustMin fash 1;", unique: false,},
	{index: "hot-1", priority: 1, requirements: "?trustMin hyena 5;", unique: false,},
];

var encounterArray = [
	//{index: `placeholder`, name: character.index+`F test`, requirements: "?location pineconePlaza;", altName: "", altImage: "",},
	//{index: `kabedon`, name: character.index+`F test`, requirements: "?location playerHouse;", altName: "", altImage: "",},
	{index: `intro1`, name: `"Hey, you!"`, requirements: "?location pineconePlaza; ?trust hyena 0; !flag player intro;", altName: "", altImage: "",},
	{index: `tourFirst`, name: `hyenaF is here looking for you`, requirements: "?location lavenderLane; ?trust hyena 1;", altName: "", altImage: "",},
	{index: `tourRepeat`, name: `hyenaF is here again`, requirements: "?location lavenderLane; ?trustMin hyena 2; ?trustMax hyena 4;", altName: "", altImage: "",},
	{index: `hyena4Start`, name: `You can hear groaning from deeper in the forest`, requirements: "?location forestPath; ?trustMin hyena 6; !flag hyena hyena4;", altName: "", altImage: "",},
	{index: `statusQuoIntro`, name: `Search for hyenaF's house`, requirements: "?location riversideRoad; ?trustMin hyena 7; !flag hyena statusQuoIntro;", altName: "", altImage: "",},
	{index: `House`, name: `Visit hyenaF's house`, requirements: "?location riversideRoad; ?trustMin hyena 7; ?flag hyena statusQuoIntro;", altName: "", altImage: "",},
	{index: "hyenaNudity1", type:"walking", requirements: "?location pineconePlaza; ?nude; ?trustMin hyena 6; ?flag mayor nudity1; !flag hyena nudity1; !encountered hyena; !encountered mayor;"},
];

for (var hyenaIndex = 0; hyenaIndex < locationArray.length; hyenaIndex++) {
	var tourEncounter = {index: `tour-`+locationArray[hyenaIndex].index, name: `And this here is the...`, requirements: "?location "+locationArray[hyenaIndex].index+"; !flag hyena hyena4; ?holiday hyena;", altName: "", altImage: "",};
	encounterArray.push(tourEncounter);
}

var sceneArray = [
	{index: `intro1`,
	content: `
		hyena special secret; Yo!
		im intro
		hyena altName ???; Hi! I'm <input type='text' id='nameSubmission-hyena' value='hyenaF'>! 
		button Continue; renameCharacter('intro2')
	`,},
	{index: `intro2`,
	content: `
		hyena joy I like hiking, adventure, and if you ever need a bud to play some games with, I'm your gal!
		hyena amused ... You gonna tell me your name?
		eval writeBig("hyena/kabedon", "player:0-10-0.7#expression:blush#overlay:hyena/kabedonHand#overlay:hyena/kabedonShadow#overlay:hyena/kabedonShadow#shadow:20-30#")
		player blush ... playerF.
		hyena sparkle Aww yeah, there you go! Nice to meet you!<br>Hey, you need a tour of the town? I can show you around.
		player I've actually already-
		hyena joy Because I've been here a while. You live up on lavender lane, right? I helped carpenterF with that!
		player horny You helped build my house?
		hyena laugh Ha! No, with the pathway on the lane, silly!<br>carpenterF doesn't let anyone but them start working the wood, y'know?
		hyena shock Wah! Is that the time?! I gotta go!<br>I'll see you around!
		player befuddled Did you just look at your wrist? You're not wearing a watch...
		hyena amused Won't need a watch to be on-time to see you tomorrow! Take care!
		player confused ... And there she goes.<br>Her tail's wagging like crazy.
		player sleep Still, wow, to pull out the classic 'kabedon' scene...<br>Hoh, it really gets the heart fluttering~!
		t ...
		hyena sleep ...
		hyena sparkle ... I did it!<br>I introduced myself <i>and</i> gave off super cool big sister vibes, just like I planned!<br>That was totally worth the full day of brainstorming and the hours of loitering hoping *he'd find me.<br>I mean, maybe I stumbled the landing a bit, but it doesn't seem like *he noticed.
		hyena amused Man, being cool is a lot of work. 
		eval setTrust('hyena', 1)
		eval passTime()
		finish
	`,},
	{index: `gatheringStart`,
	content: `
		hyena happy Oh, you wanna forage for a bit around here? I know a great spot!
		trans gatheringEnd; Continue
		cancel
	`,},
	{index: `gatheringEnd`,
	content: `
		hyena amused Hmhm~<br>Yeah, I just prefer to do things in one trip, y'know?
		player excited So strong~
		im tourGathering
		t *Thwap* *Thwap* *Thwap*
		t hyenaF's tail wags like crazy with each word of praise, even though she's still trying to act aloof.
		eval gatherItem("Gathering");
		eval gatherItem("Gathering");
		eval gatherItem("Gathering");
		eval data.player.hyenaProgress += 2;
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `fishingStart`,
	content: `
		hyena happy Wanna catch some fish? Hold on, I'll go grab a spare rod and we can go together!
		trans fishingEnd; Continue
		cancel
	`,},
	{index: `fishingEnd`,
	content: `
		hyena sparkle Oh, ooh! That's another bite!
		player surprised Another one?! That's amazing!
		im tourFishing
		hyena amused Hehe~<br>Pretty cool huh?
		player excited <i>That's the smallest fish I've ever seen...<br>But every time I praise her, her tail wags like crazy~!</i>
		eval gatherItem("Fishing");
		eval gatherItem("Fishing");
		eval gatherItem("Fishing");
		eval data.player.hyenaProgress += 2;
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `huntingStart`,
	content: `
		hyena happy Oh hey, you've got your net out. Wanna catch some bugs? I can scare 'em out, and you can snag them!
		trans huntingEnd; Continue
		cancel
	`,},
	{index: `huntingEnd`,
	content: `
		hyena amused And so the trick is, like, you gotta <i>be</i> the critter, y'know?
		player surprised Ohhh, I see...
		im tourHunting
		hyena amused Heh, yeah, I know a few things about hunting. No big deal.
		player excited <i>Tail... Fuzzy tail...<br>Can't tear my eyes away...</i>
		eval gatherItem("Hunting");
		eval gatherItem("Hunting");
		eval gatherItem("Hunting");
		eval data.player.hyenaProgress += 2;
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},

	/* 
	
	
	Tour stuff 
	
	
	*/
	{index: `tourProgress`,
	content: `
		eval hyenaProgress();
	`,},
	{index: `tourFirst`,
	content: `
		hyena sparkle Heyyy~! There's the face I was looking for!
		hyena happy Sorry I couldn't nab you earlier. <br>You might not really need a show-around anymore, but this town's got plenty of fun stuff, and if you wanna just hang out instead, I don't mind.
		eval raiseTrust('hyena', 1);
		trans tourStart; Let hyenaF show you around
		cancel
	`,},
	{index: `tourRepeat`,
	content: `
		hyena sparkle Heyyy~! I didn't scare you off, huh?
		hyena happy That's really good to know, I can be a bit overenthusiastic sometimes.<br>Wanna go hang out around town again?
		trans tourStart; Let hyenaF show you around again
		cancel
	`,},
	{index: `tourStart`,
	content: `
		hyena sparkle Let's gooooo!
		hyena happy So, where to first?<br>Anywhere in particular catch your eye?
		special You're now paired up with hyenaF! Some encounters and pickup spots won't appear unless you're alone. 
		eval data.player.holiday = 'hyena';
		eval unencounter("hyena");
		finish
	`,},
	{index: `tourFinishEarly`,
	content: `
		hyena Ah, got some business to take care of? <i>Privately</i>?
		hyena sleep I get it, totally. You take all the time you need, buddy.
		eval data.player.holiday = '';
		finish
	`,},
	{index: `tourFinishHouse`,
	content: `
		hyena worried Aww man, it's getting pretty late, huh? 
		hyena happy I really should bounce, but this was fun! Let's do this again sometime, yeah?<br>Bye, sleep tight!
		eval data.player.holiday = '';
		eval data.player.location = 'playerHouse';
		finish
	`,},
	{index: `tourFinishNight`,
	content: `
		hyena worried Aww man, it's getting pretty late, huh? 
		hyena happy But no worries, I'll walk you home.<br>This town's as safe as can be, but I'll feel better knowing you didn't get lost. C'mon!
		eval data.player.holiday = '';
		eval data.player.location = 'playerHouse';
		finish
	`,},
	{index: `tour-playerHouse`,
	content: `
		hyena happy So, this is your place? Very cool! Did you need to grab something, or did you plan on being the one to show me around today?<br>It's really... Really...
		hyena blush It sm... Smells pretty nice in here, actually.
		player befuddled Really? Strange, I haven't-
		player worried Ah, it's probably my human pheromones activating your sex drive.<br>We should probably go, shame too. I wanted to show off my collection room.
		hyena pent M-man, that sounds cool, but yeah. Sorry little *dude, maybe some other t... Time...
		hyena blush Oh! Th-that's-
		player panic Aw jeez, I left a pair of shorts out. Sorry about the mess...
		hyena love It, uh... Nice...?<br>Aw geez, I really need some air.
		eval unencounter("hyena");
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `tour-playerExterior`,
	content: `
		hyena happy Eyyy, there she is! carpenterF was so proud of this beauty.<br>How's she treating you?
		player sparkle It's amazing! I can't believe I own my own house, and I didn't have to offer a harvest's bounty to lady Shub'Niggurath to get one!
		hyena ... No idea what you're talking about, little *dude, but hell yeah, good for you.<br>Or 'aww dang', if that's something you wanted to do.
		player sleep Eh, I can always do it later if I'm in the mood. No rush.
		eval unencounter("hyena");
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `tour-lavenderLane`,
	content: `
		hyena happy You've probably been on this road a few times now, huh? It's cozy here, mayorF had it built to expand the town, not many people live here yet.<br>Though, we did need to remove the namesake plants. Turns out the cats here are crazy allergic to lavender.
		hyena sleep Now, not to brag, but I helped place some of the stones. <br>We all chipped in a little bit. If people start having kids, I bet this'll be a pretty busy road someday.
		hyena sparkle You'll have some prime real estate on your hands!
		player surprise Real estate?!
		trans tour-lavenderLane-A; I'm rich!
		trans tour-lavenderLane-B; I'm allergic!
	`,},
	{index: `tour-lavenderLane-A`,
	content: `
		player sparkle I'm rich, wahoo~!
		hyena sparkle Aw yeah~!
		hyena worried W-wait, you'd have to sell it to actually make money off it, though?
		player frown Oh. Guess I'm still poor then.
		hyena sleep Nah, you and I are good company. Nobody's poor when they've got a vibe like we've got.
		hyena worried Though, uh, if you're like <i>actually</i> broke, I can spot you. I don't carry a lot though...
		player sleep Nah, poverty's in my bones. It's like a familiar coat, I'm comfortable with it.
		eval unencounter("hyena");
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `tour-lavenderLane-B`,
	content: `
		player shock But I'm allergic to real estate!<br>Specifically to high mortgage rates!
		hyena panic Oh no!
		hyena worried ... Do we have those here?
		player sleep Nah, I don't even need to pay taxes.
		hyena amused Geez. You had me going there for a second. Collar me if you're gonna yank my chain like that.
		hyena panic Err, wait, I didn't mean it like that!
		player confused ...?
		hyena blush L-let's just continue the tour, c'mon!
		eval unencounter("hyena");
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `tour-pineconePlaza`,
	content: `
		hyena sparkle The main plaza!
		hyena smile It's not as busy as the big city, but it's about as close as you'll get around here.<br>There's a neat cafe over there, a fur salon over there, I think they'll do your hair too, the guy working there's really good.
		hyena worried I'm not standing in your way, am I? There are so many different shops and junctions around here, no matter where I stand I think I'm blocking at least one road.
		trans tour-pineconePlaza-A; Why would I want to look at a road when you're here?
		trans tour-pineconePlaza-B; Nah, you're in a tiny text box below the map screen
	`,},
	{index: `tour-pineconePlaza-A`,
	content: `
		hyena laugh Hah! Nice one!<br>Hey, you should write that one down! That kinda vibe could turn a girlfriend into a wife in no time.
		hyena happy Oh hey, I've been meaning to ask. You can have kids with the townsfolk here, right?
		player happy Well-
		hyena sparkle Oh man, that'd be so cool. I've always wanted to be an aunt, I was talking with my buddy milfF, you met her yet?<br>Anyways, I told her that, and she was all "you want to be an ant?"
		hyena laugh Haha! Aw man she cracks me up like crazy, I've gotta introduce you two.<br>Oh, but you gotta meet doeF too, and mommyF, and...
		player tired ...?<br><i>Am I gonna get a chance to respond?</i>
		eval unencounter("hyena");
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `tour-pineconePlaza-B`,
	content: `
		hyena befuddled Map... Screen?
		hyena shock Wait, <i>tiny</i> text box?!
		player panic I didn't mean anything by it!<br>It's the same size as everyone else's!
		hyena happy ... Ohhh, I gotcha, I think I'm following here.<br>One of those 'wall' jokes, or something?<br>Sometimes the curator twins, y'know for the museum down on willow? They say weird things like that too sometimes.
		hyena amused I don't really get it, but it makes them happy when I laugh at their... I guess they're jokes?
		hyena sleep Man those two have the sweetest smiles, I wonder if they're working today?
		eval unencounter("hyena");
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `tour-townHall`,
	content: `
		eval unencounter("hyena");
		hyena You've probably been through here already, right? This whole place is mayorF's office, it's basically her house too, she's in here pretty much all the time.
		hyena worried ... Huh. I wonder where she is?
		hyena amused I should at least say hi.<br> C'mon, I'm allowed back here. Maybe she's in one of the-
		im tourMayor
		mayor torogao Ghhhh~
		hyena shock ...!
		hyena blush ... C'mon, we'll come back later.
		mayor ahegao Hah... Hah...<br>Did I hear something just now?
		button Back; changeLocation('pineconePlaza')
	`,},
	{index: `tour-squidsMakeInc`,
	content: `
		eval unencounter("hyena");
		hyena This is carpenterF's place. They're just the softest ball of fluff in the world.<br>They built your house by the way, did the entire thing!
		carpenter sleep Zzz...
		hyena amused Ah, caught them mid-nap. 
		player It's fine, we've already met.
		hyena Nice. Okay, we can head out in a second, lemme just... <br>They keep a spare stash of blankets over here.<br>There you go, buddy.
		im tourCarpenter
		button Back; changeLocation('pineconePlaza')
	`,},
	{index: `tour-riversideRoad`,
	content: `
		hyena Riverside road, you can probably guess why it got the name. shopF built her store here so she can keep a net ready to catch fish whenever she wants some.<br>Plus there's a kind of spooky place down the ways too where somebody can tell your fortune.
		hyena sparkle And the best part is that my house is just down the way! I bet you're thinking this is the coolest place in town already, huh?
		hyena amused Maybe I'll give you a tour of my place some time?
		player sparkle Really? Can we?
		hyena amused ... What, like, right now?
		hyena blush Aw, well, uh, it's... Molting. Right now. Some other time.
		player shock Molting?! The houses here molt?!
		hyena panic Err, uh, a little?
		player amused Oh, just a little. That's fine.
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `tour-store`,
	content: `
		eval unencounter("hyena");
		shop sparkle Welcome, welcome! Come in, come in!
		hyena happy This is shopF's store, she-
		shop worried hyenaF? No card packs today either, sorry. I think they stopped making them.
		hyena worried Aww...
		hyena happy Oh, but nothing for me today. I'm showing playerF around town.
		shop happy We've met. Nice to see you again!<br>You've picked a good guide, hyenaF spends almost all her time wandering around town helping people out.<br>Not to mention, she's pretty much an expert on human anatomy and sex.
		hyena shock Ah, that's-
		shop sleep I ask her for advice all the time. I know you're human yourself, but she might know even more than you!<br>Trust me, you're in good hands. Or paws, I guess.
		hyena blush Uh... Just trying to be helpful...
		shop excited Mmm, right, it's great timing you dropped by.<br>Seriously, I haven't been able to stop leaking!<br>Any advice?
		hyena panic Oh! Well, uh... Right! Well, the uh, thing, y'know the thing, it's making the, uh, stuff.<br>Well, if it's making stuff, it might be, like... A muscle?
		shop Oh, you're saying that by spending so much time masturbating while in heat, I'm probably just making my body even <i>more</i> productive, causing me to leak and squirt even more?<br>What should I do?
		hyena worried ... Stay hydrated?
		shop sparkle Brilliant! Okay, I'll be stepping out for a minute to fuck myself silly, call out if either of you change your mind and decide to buy something.
		hyena Okay.<br>...
		player I didn't know you were an expert in human anatomy.
		hyena shock I'm-
		player sparkle That's rad!
		hyena worried ... We should probably head out.
		button Back; changeLocation('riversideRoad')
	`,},
	{index: `tour-lakesideRetreat`,
	content: `
		hyena sleep Ah, the lake. Quietest, coolest place in town.
		hyena joy Hey, you wanna try and see if we can catch some fish? I'm pretty handy with a rod!<br>Or we could skip some stones. It took me a little bit to get the hang of that.<br>I could show you!
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `tour-lakesideRuins`,
	content: `
		hyena worried Hey, careful, sharp rocks and deep water aren't a good combo.
		player Aww c'mon, where's your sense of adventure?
		hyena panic I'm super adventurous, I swear!<br>But if you get hurt on something on my watch, I'll start crying, and that's not cool at all!
		player frown Hey, expressing vulnerability can be cool too.
		hyena befuddled ... Really?<br>Alright, then...
		hyena cry Waaaaaah!
		player worried Aww geez...
		hyena Am... *Sob* Am I cool yet?<br>Can... *Sob* Can we go somewhere safer now?
		eval unencounter("hyena");
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `tour-willowWalk`,
	content: `
		hyena happy Willow Walk! I know a few people who live here, mostly women.<br>I mostly come here because there's a quick path to the forest down the road.
		hyena sleep And lemme tell you, it's an absolutely perfect spot to nab something to eat.<br>If you're tired of fish, that is.
		player amused Tired of fish? Me?<br>Never.
		eval unencounter("hyena");
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `tour-museumExterior`,
	content: `
		hyena happy The museum. I don't really get what ever-<br>Oh, hey!
		foxm sparkle hyenaF! ?carnivore;
		hyena joy foxmF! It's been a while. Taking a break from being in sync with your sister today?<br> ?carnivore;
		foxm worried Carnivore mode's active. We can't risk the dialogue boxes going too low. ?carnivore;

		foxf sparkle hyenaF! ?vegetarian;
		hyena joy foxfF! It's been a while. Taking a break from teasing your little brother to say hello? ?vegetarian;
		foxf worried Vegetarian mode's active. We can't risk the dialogue boxes going too low. ?vegetarian;

		define foxd = dual sp1 foxf; sp2 foxm;
		foxd sparkle hyenaF! !carnivore; !vegetarian;
		hyena joy How's it going you two?<br>These cuties are practically joined at the hip. !carnivore; !vegetarian;
		foxf happy Not always. We're trying to keep everything organized. !carnivore; !vegetarian;
		foxm happy Gotta make sure everything's in the right place, can't let any bugs loose on the town. !carnivore; !vegetarian;
		foxf worried Seriously. Just the other day someone said they found a fruit while trying to fish. !carnivore; !vegetarian;
		foxm worried We still haven't found the cause! !carnivore; !vegetarian;

		hyena confused ... You guys always say the weirdest stuff.
		hyena happy Anyways, I'm just showing playerF around town.<br>Take care of *him if he drops by, I bet you two will give a way better tour than I can.
		foxd happy Come back soon! !carnivore; !vegetarian;
		eval unencounter("hyena");
		button Back; changeLocation('willowWalk')
	`,},
	{index: `tour-forestPath`,
	content: `
		hyena worried Careful not to trip! This path here leads to an orchard.
		hyena happy The stones there look almost like the start of another path, huh?<br>That space of the forest is empty, nothing but bugs and wild fruit trees down that way.
		hyena sleep Just the way I like it.<br>The other parts of town are a lot busier, so whenever I need to clear my head I usually hang around here.
		eval unencounter("hyena");
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `tour-forestOrchard`,
	content: `
		hyena The forest orchard. Plenty of fruit, this lady I know, I think she lives somewhere around here actually, she tends to them.<br>Take as much as you'd like. !flag hyena hyena3;
		player sparkle Collectables! !flag hyena hyena3;
		hyena amused Hehe, that's a really cute smile.<br>Hey, if you wanna gather some, I could- !flag hyena hyena3;
		player surprised Ooh, hey, that bunch of bushes over there kinda looks like a tunnel! !flag hyena hyena3;
		hyena confused Huh. Yeah, kinda. Wonder where that came from.<br>The gardener friend I mentioned can't crawl around, so I dunno who made it. !flag hyena hyena3;
		player worried Aww, she got a bad back? !flag hyena hyena3;
		hyena tired Nah, she does special exercises. It's actually her huge, hyper-sensitive pair of boulders, and the big ol' nubs attached to them. See, if she gets too low- !flag hyena hyena3;
		hyena shock Whoa, hey!<br>You aren't thinking of crawling into there, are you? !flag hyena hyena3;
		trans hyena3Start; Head deeper !flag hyena hyena3;

		hyena happy The forest orchard. We've already been through here, bud. ?flag hyena hyena3;
		player sleep I know, I just enjoy hearing you name places. ?flag hyena hyena3;
		hyena laugh Ha! Well, I enjoy explaining.<br>Let's head somewhere else though, yeah? ?flag hyena hyena3;

		eval unencounter("hyena");
		cancel
	`,},
	{index: `tour-forestWilderness`,
	content: `
		hyena The start of the wilderness. We're pretty deep in the forest now.
		hyena worried Honestly, I'd prefer if you didn't wander around here too often. I'd feel really bad if you got lost.<br>Plus, I've heard people talking about seeing ghosts and nudists out here in the woods.
		trans tour-forestWilderness-A; Ghosts?!
		trans tour-forestWilderness-B; Nudists?!
	`,},
	{index: `tour-forestWilderness-A`,
	content: `
		player shock Ghosts?!<br>Where?<br>Have you seen any? Are they as goopy as I hear they are?
		hyena worried Uh... Sure? I mean, I haven't seen any myself, but I've heard people around here finding... Goop.<br><i>Instantly asking about a topic as spooky as ghosts... Humans really are hardcore...</i>
		player confused Wowee, I thought this was a pretty grounded place, but if there are ghosts about...
		hyena happy Hey if that's got your attention, I'm pretty sure one of my neighbors can do magic. Actual magic!<br>Isn't that cool?
		hyena worried She's a bit of a shut-in though. Not that there's anything wrong with that, but it means she might not be interested in showing off.
		player befuddled Who wouldn't want to show off magic?<br>Man, if I could cast spells, well...
		player sleep ... Actually, the people here are pretty fluffy already.
		hyena happy Hey, you know what you like. Good for you!
		eval unencounter("hyena");
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `tour-forestWilderness-B`,
	content: `
		player shock Nudists?! Here? You mean people just go around, totally naked?!
		hyena worried <i>Totally unfazed by mentioning ghosts... Humans really are hardcore...</i>
		hyena sleep Well, they're more an issue because they get pushy. Not like most people around here wear all that much.
		player frown It's the spirit of the matter! Designs are totally thrown off by nudity.<br>I mean, look at the way the jacket adds to your silhouette!
		hyena worried Uh... You making a joke or something?<br>I can't really tell. You're pretty good at committing to the bit.
		player sleep I live by the bit, I'll die by the bit. That's my-
		hyena panic Whoa, hey! That's a little bit much, dude!<br>No need to talk about dying!
		hyena worried I mean, even if <i>you</i> don't mind, if there are ghosts around here? Well, they'd have to be, y'know...<br>Dead.<br>And they probably don't wanna be reminded of that!
		eval unencounter("hyena");
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},
	{index: `tour-collectionRoom`,
	content: `
		player joy This is my collection room!
		hyena pent Th-that's awesome, bud...
		player panic Ah, right! We gotta get outta here before the pheromones drive you crazy!
		eval unencounter("hyena");
		trans tourProgress; Continue the Tour
		trans tourFinishEarly; End the Tour
	`,},

	/* 
	
	
	Morning stuff 
	
	
	
	*/

	
	{index: `morning1`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town.
		player sleep Mmm...
		player pent ... Hmm? What the...?
		t As you rub the sleep from your eyes, something feels different.
		player frown Hey, one of my pillows is missing!
		player worried Aww man. What happened?<br>Have I started throwing things across the room in my sleep?<br>... Again?
		t ...
		eval writeEvent("morning1");
		eval raiseTrust('hyena', 1);
		eval unencounter('hyena');
		finish
	`,},
	{index: "hyenaMorning-mayor", content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, aside from a pair of townsfolk chattering the early hours of the day away.
		mayor amused You can't always be the expert on everything, hyenaF. I'm just as well educated on the matter as you.
		hyena frown Oh yeah? Well how fast can they go then?
		mayor sleep That's easy! Exactly 3 times as fast as a bicycle.
		hyena worried ... Darn, you really are an expert.
		mayor happy Hmhm~<br>Looks like you don't need a biker jacket to be an expert on motorcycles.<br>And no, by the way, you can't have one. Town guidelines are very clear.
		hyena smug You mean I can't have <i>another</i> one.
		mayor shock ...!
		hyena worried ... I just realized I gotta go. Bye!
		mayor panic Wait! You come back here right this instant!<br>hyenaF!
		trans cancel; Finish
	`,},
	{index: "hyenaMorning-shopkeep", content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, aside from a pair of townsfolk chattering the early hours of the day away.
		hyena happy Heya~
		shopkeep sparkle hyenaF! It's great to see you! Hey, check this out!
		hyena happy Actually, I just came here for-
		hyena shock Is that a paddle covered with metal nubs?<br>No, it looks more like a club...!
		shopkeep frown Aww, you already know what this is too?
		hyena worried I'll say yes if that's what it takes to get you to stop waving that thing around.
		shopkeep happy It's cool though, huh? It's a replica of the one used in Anti-Insect Specialists chapter 4.<br>Holding it like this really puts the nipple penetration into perspective.
		hyena panic ... I really don't want to know.
		shop worried You feel cursed with knowledge sometimes too, huh?<br>I feel you, I wish I could erase my memory of it too, and experience it for the first time again.<br>What'd you drop by for, by the way?
		hyena tired Breakfast, but I've lost my appetite.
		trans cancel; Finish
	`,},
	{index: "hyenaMorning-carpenter", content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, aside from a pair of townsfolk chattering the early hours of the day away.
		hyena blush And, uh... Oh! They've got memory foam pillows too.
		carpenter sparkle A special kind of pillow? What's it do?
		hyena amused Hehe. Well, isn't it obvious? It's in the name! It remembers everyone who's ever slept on it of course, and arranges itself to fit their head!
		carpenter happy Wow. I hope I can go to one of these 'love hotels' someday. Would you ever take me?
		hyena happy Sure! I love all my friends, we can all go together!
		carpenter sleep Ah, just imagining it...<br>So cozy...<br>Zzz...
		hyena shock Hey, wait, I wasn't done explaining things yet!
		trans cancel; Finish
	`,},
	{index: "hyenaMorning-wolf", content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, aside from a pair of townsfolk chattering the early hours of the day away.
		hyena And so, that's how anal works for girls.
		wolf sparkle Amazing! I didn't know the body worked like that at all!<br>Where did you learn all this?!
		hyena Oh, you know, picked it up here and there.
		wolf happy You truly are a scholar, aren't you? shopkeepF's the only other resident I know of who's as devoted to learning about human culture as you are.
		hyena worried Y-yeah. So, uh. What'd you want to talk about next? Maybe we could discuss jackets, actually?
		wolf sparkle Anal beads!
		hyena shock B-but I thought you were all about fashion!
		wolf happy Absolutely! But darling, I can't just ask you to stop when you're so clearly in the zone. <br>Plus, I think the human has a certain affection for my rear.
		hyena worried Alright, I guess...<br>So, uh, anal beads... They're like beads, that, uh...
		wolf sparkle Yeeeees~? Have you used them before?
		hyena panic ... Sure have. Gotta, uh... Keep things nice and clean down there?<br><i>I just keep digging myself deeper...</i>
		trans cancel; Finish
	`,},
	{index: "hyenaMorning-sadogato", content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, aside from a pair of townsfolk chattering the early hours of the day away.
		hyena worried ...
		sado frown ...
		hyena confused I'm gonna go now, if you don't need anything...
		sado ...
		hyena befuddled Alright, bye.
		sado ...
		sado worried ... Thank goodness, I've survived another encounter.<br>That woman, the truly predatory look in her eyes...
		sado frown I'm sure she sees me as easy prey, especially since I freeze up whenever I see her.
		sado angry Ooooh, but I'll show her. The next time-
		hyena worried Hey, sorry, forgot something. Were you saying something?
		sado frown ...
		hyena ...<br><i>Silence again, man. I'd give anything to know what goes on in that head.<br>So calm, confident, I wish I were as cool as her...</i>
		trans cancel; Finish
	`,},
	{index: "hyenaMorning-milf", content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, aside from a pair of townsfolk chattering the early hours of the day away.
		milf angry Looks like we're at an impass.
		hyena angry Yeah, looks like it. No way out of this but to fight.
		milf frown I'll start! Check out this baby!
		hyena shock Whoa! That's-
		milf sparkle The legendary grass pocketmanz! Cel-
		hyena panic Don't say its real name! We'll get in trouble.
		milf shock Right, sorry.<br>Anywhos, I'll be playin'... E*v*e.
		hyena sparkle Nice! He's my favorite. I bet you evolve him into the grass one, huh?
		milf worried ... Can I ask you somethin' hyenaF?<br>Why do you think all these cards're showin' off these creatures buttholes n' dinguses?
		hyena amused Hah, that's easy! It's to show appreciation for nature!<br>The game's all about showing the appeal of the wild. Toughness, coolness, beauty, cuteness, smarts...
		milf worried And they're showin' it with ultra zoomed-in shots of animal ass?
		hyena worried ... Yeah?
		milf ...
		milf happy Works for me! Okay, my E*v*e will use quick attack!
		trans cancel; Finish
	`,},
	{index: "hyenaMorning-nun", content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, aside from a pair of townsfolk chattering the early hours of the day away.
		hyena amused And so that's why humans sweat all over their bodies during the sex.
		nun ... Indeed.<br>You certainly are quick-witted, aren't you?
		hyena happy That's what everybody says.
		nun And are they correct? Are they right to trust in you? To turn to you searching for answers about the human?
		hyena panic Hey, you're the one who asked me...
		nun sleep I was very much looking forward to speaking with the hyena known throughout town as the "human expert".
		hyena happy ... Honestly, I'd prefer to be known as the "cool big sister", but I'll take what I can get.
		nun happy It certainly is a burden, isn't it? To be relied upon. Do you ever worry they'll all find out, and it'll all come tumbling down?
		hyena worried ...
		nun sleep I'll be rooting for you to find peace, sister. Come back some time, I think you'll gain a lot from what I can offer you.
		hyena sparkle Really? I finally have someone to talk with who isn't obsessed with human sex stuff?
		nun worried ...
		hyena worried ... Of course not.
		trans cancel; Finish
	`,},
	{index: "hyenaMorning-fash", content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, aside from a pair of townsfolk chattering the early hours of the day away.
		trans cancel; Finish
	`,},
	{index: "hyenaMorning-mesu", content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, aside from a pair of townsfolk chattering the early hours of the day away.
		hyena And so that's why it's called a "pro-state orgasm".
		mesu sleep Uhuh...
		mesu excited <i>God, she's so fucking stupid, but she's so hot...<br>How does anyone think the bitch button has anything to do with the government?<br>But she's soooooo hot...</i>
		hyena confused You alright? Wanna talk about something else?
		mesu excited Totally fine~<br>Please, go on. You mentioned something about "pro-state milking"?
		hyena happy Right, yeah.
		hyena worried <i>Poor little guy. He's totally obsessed with this stuff, no wonder he seems really desperate for a friend...<br>Well, better bullshit even harder. Don't you worry little guy, big sis hyenaF will think of something to say!</i>
		trans cancel; Finish
	`,},

	/* 
	
	
	Scenes stuff 
	
	
	
	*/
	{index: `hyena1Start`,
	content: `
		player joy Alright, let's-
		player befuddled ... hyenaF?
		hyena pent Hmm...? What's up?
		player worried You look like we've been running a marathon. You alright?
		hyena pent ... Huh. Yeah, I guess I am weirdly bushed.
		player panic Let's get you home then!
		hyena worried I'm sure it's nothing.<br>Though, maybe that's for the best. Actually, I might need to make a stop along the way to take a break, actually...
		trans hyena1; Continue
	`,},
	{index: `hyena1`,
	content: `
		eval writeEvent("hyena1");
		eval passTime();
		eval addFlag('hyena', 'hyena1');
		eval raiseTrust('hyena', 1);
		eval data.player.holiday = '';
		finish
	`,},
	{index: `hyena2Start`,
	content: `
		hyena happy Okay, if we head this way, oh wait-
		t As she moves to continue the tour she stops suddenly and the two of you lightly bump into each other.
		hyena forced Eep~!
		t *SPLURT*
		hyena pent ... Oh...
		player confused What was that?
		hyena blush N-nothing! Hey, I'm sorry about this, but could we maybe wrap up a little early today?
		player worried Ah, pheromone overload again? No problem. I'll see you around!
		hyena excited I r-really hope so! Take care!
		trans hyena2; Continue
	`,},
	{index: `hyena2`,
	content: `
		eval writeEvent("hyena2");
		eval passTime();
		eval addFlag('hyena', 'hyena2');
		eval raiseTrust('hyena', 1);
		eval data.player.holiday = '';
		finish
	`,},
	{index: `hyena3Start`,
	content: `
		player joy I am! What if there's a jiggy in there? Or a cool coin?
		hyena worried Jiggy? Like a puzzle?<br>And we use muns here, so-
		hyena surprise Hey, there's no need to rush!<br>That's a tight squeeze... Here, let me go in first, so I can push anything pointy out of the way.
		t ...
		t You crawl through the hole in the bushes, finding a few stray, yellow hairs in the bushes.
		hyena worried Huh. These kinda look like foxmF's...<br>Could be his sister's too...
		player surprise Ooh!
		eval addItem("jiggy-bonus1c")
		hyena befuddled Is that a puzzle box? Out here?<br>Did someone make this thing just to hide it in the woods?<br>Why?
		player sparkle JIGGGYYYYY~
		hyena worried ... Ah. That's probably why.<br>Okay, no more crushed grass, this must be it. Let's head back, yeah?
		player happy Sure thing!
		hyena Oh hey, be careful. Looks like some of the brambles were bent back, so something could catch on-
		trans hyena3; Continue
	`,},
	{index: `hyena3`,
	content: `
		eval writeEvent("hyena3");
		eval passTime();
		eval addFlag('hyena', 'hyena3');
		eval raiseTrust('hyena', 1);
		eval data.player.holiday = '';
		finish
	`,},
	{index: `hyena4Start`,
	content: `
		t You can hear a mix of rapid, wet sounds and animalistic grunting ahead, only interrupted by the occasional wet *SPLAT* and a pained, needy whine.
		t You feel like if you go forward right now, you won't make it back out untouched...
		eval unencounter("hyena")
		trans hyena4; Continue on anyways
		cancel
	`,},
	{index: `hyena4`,
	content: `
		eval writeEvent("hyena4");
		trans hyena5Start; Meanwhile, and a bit later...
	`,},
	{index: `hyena5Start`,
	content: `
		eval hyenaStrip()
		eval writeEvent("hyena5");
	`,},
	{index: `hyena5-A`,
	content: `
		eval writeEvent("hyena5-A");
		eval addFlag('player', 'hyena5-A');
	`,},
	{index: `hyena5-B`,
	content: `
		eval writeEvent("hyena5-B");
		eval addFlag('player', 'hyena5-B');
	`,},
	{index: `hyena5Finish`,
	content: `
		eval writeEvent("hyena5Finish");
		mtrans hyena5Extra; "Sure!"
	`,},
	{index: `hyena5Extra`,
	content: `
		eval writeEvent("hyena5Extra");
		eval removeFlag('player', 'hyena5-A');
		eval removeFlag('player', 'hyena5-B');
		eval passTime(); !flag player gallery;
		eval addFlag('hyena', 'hyena4'); !flag player gallery;
		eval removeFlag('hyena', 'hyena3'); !flag player gallery;
		eval removeFlag('hyena', 'hyena2'); !flag player gallery;
		eval removeFlag('hyena', 'hyena1'); !flag player gallery;
		eval raiseTrust('hyena', 1); !flag player gallery;
		eval data.player.holiday = '';
	`,},
	{index: `statusQuoIntro`,
	content: `		
		t You decide to pay Helena a visit. Hopefully she's not still too hung up on the whole 'orally raping you' thing.
		player curious Let's see, she said her house was a little down the ways here...
		t Heading all the way down the street, one stretch of dead-end road stops suspiciously early. Not really the walkway to a house, it's more that it leads to, well, nothing. Aside from a brick shed you can make out over an acre of patchy grass away.
		t Heading forward, you begin to hear the sound of running water, and realize you've found her.
		im bath1
		outfit hyena nude
		hyena sleep Hmm hmm hmm~<br>*Sniff* *Sniff*
		hyena sparkle playerF? Heya!
		t She cuts off the hose, and you realize you caught her mid-shower.<br>... You think.
		hyena happy Great timing too, I just finished doing a bit of watering. I know most folks have a whole room for it but I figure if it's good enough for the grass, it's good enough for me!
		hyena worried So you, uh... Just dropping by for a friendly visit? Honestly I'm having trouble wrapping my head around what happened the other day...
		player happy Sure am! So, is this your house?
		hyena shock Eh? Oh, yeah! Pretty cool, huh?<br><i>So, it really was all real then...</i>
		t She seems conflicted for a moment. Glad to be free of the brainfog and fuck-frenzy she was experiencing from the heat before, but also trying to figure out exactly what to do next, especially since she no longer needs to keep up a cool facade.
		hyena sleep <i>... Well! No point in worrying. I'm not really smart enough to figure all this out, and *he seems happy to see me, so I'm just gonna go with it.</i><br>Want a tour?
		player sparkle Do I?!
		hyena worried Do you?
		player sleep Yes.
		outfit hyena nude
		trans hyena6Start; Continue
	`,},
	{index: `hyena6Start`,
	content: `
		hyena happy Hold on, lemme get the door for you.
		t hyenaF braces herself against the front door and pushes, causing a grindy, squealing sound of metal on metal.
		hyena happy Sorry, door's a bit heavy. I got foam pads for the floor. C'mon in, and feel free to take a seat wherever.
		player worried ...
		im locations/interiorHyena
		hyena joy Pretty cozy place, huh? Gotta say I was surprised to see how big your house was.<br>Anyways, this here's the fridge. The door's the bathroom.<br>Through the bathroom is a door to the garage. Though it's really drafty in there.
		player confused ... Is that all?
		hyena sleep Yep! That's the tour. Oh, whoopsie, I should probably get dressed.
		outfit hyena clothed
		hyena worried ... So, about what happened. I wanted you to know, I won't let that kinda thing- 
		trans hyena6; Interrupt her
	`,},
	{index: `hyena6`,
	content: `
		eval writeEvent("hyena6");
		eval passTime();
		eval raiseTrust('hyena', 1);
		eval addFlag('hyena', 'statusQuoIntro');
		finish
	`,},
	{index: `statusQuo`,
	content: `
		hyena surprise Oh! You're back!<br>I'm glad you're here.
		player sparkle Yep! Training time!
		hyena worried Eh? Already? But you just got here...
		hyena annoyed Oh well, alright! But don't take it easy on me, okay? I know I made a fool of myself last time, but...<br>I wanna hang out with my friend for real, so let's get in some endurance training and next time I can show you my pocketmanz collection.
		player joy Ooh, confident today!
		hyena laugh Yeah! I actually talked to shopF early today. She said that regular stimulation builds up a tolerance. She said she has to change toys every week or so. <br>So I figure, with how crazy we got the last time, things should already be a lot less intense.
		player worried <i>How crazy things got?<br>Seems like she doesn't know how much she's still got left to learn.</i>
		hyena happy But for real, I appreciate you sticking around.<br>So if you want me to, well...<br>Whatever it is you want me to do. Then I'll give it my best shot! What's the plan for today?
		trans repeat2First; Ask to pet hyenaF !flag hyena repeat2;
		trans exploreFirst; Ask to go exploring again !flag hyena explore;
		eval writeQuoRepeats();
		cancel
	`,},
	{index: `repeat1First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval raiseTrust('hyena', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat1Repeat`,
	content: `
		im hyena/repeat1-1
		im hyena/repeat1-2
		im hyena/repeat1-3
		im hyena/repeat1-4
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `repeat2First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		eval raiseTrust('hyena', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat2Repeat`,
	content: `
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		im hyena/repeat2-1
		im hyena/repeat2-2
		im hyena/repeat2-3
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `exploreFirst`,
	content: `
		hyena befuddled Eh? I feel like we covered just about everything in town. Plus, you've been around for a while, do you really need me to keep showing you around?
		player happy Need? No.<br>Want? Yeah!<br>C'mon, there's neat stuff around every corner around here, and it'll be even more fun to explore it with you!
		hyena laugh Haha! Well, when you put it like that, I can't say no!<br>Sure thing little buddy, I'll show you every nook and cranny around here.
		player joy Ooh! I love crannies! I could jump for joy just thinking about them.
		hyena amused Sure, sure. So, we... Uh...
		hyena pent Could s-start... Uh...<br>Hmm...<br>M-maybe you don't need to... Actually jump for joy, y'know?
		player amused Plus, being outside could be great for your training!<br>You'll have a hard time building your stamina when you're hotboxing yourself with human pheromones.
		player sleep And let's be honest, I think it's obvious that one us isn't going to be satisfied until you can properly knot me.
		hyena panic That's not- I wasn't thinking about-<br>I'd be totally fine with... Just...
		hyena pent ... You aren't talking about me, are you?
		player smug 
		hyena ... Alright, sure. If this really is what you want, I'll do my best.<br>Just... Maybe don't keep giving me that look. It makes me wanna... Do things to you.
		player smug <3
		hyena blushy I'm serious!
		special New training opportunities with hyenaF have been unlocked!
		eval addFlag('hyena', 'explore')
		trans statusQuo; Continue
	`,},
	{index: `repeatHandFirst`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		eval raiseTrust('hyena', 1);
		eval passTime();
		finish
	`,},
	{index: `repeatHandRepeat`,
	content: `
		eval data.player.currentScene = data.player.currentScene.replace("Repeat", "");
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		im SCENE-1
		im SCENE-2
		im SCENE-3
		im SCENE-4
		im SCENE-5
		im SCENE-6
		finish
	`,},
	{index: `repeatRimmingFirst`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		eval raiseTrust('hyena', 1);
		eval passTime();
		finish
	`,},
	{index: `repeatRimmingRepeat`,
	content: `
		eval data.player.currentScene = data.player.currentScene.replace("Repeat", "");
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		im SCENE-1
		im SCENE-2
		im SCENE-3
		im SCENE-4
		im SCENE-5
		im SCENE-6
		finish
	`,},
	{index: `repeatThighfuckFirst`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		eval raiseTrust('hyena', 1);
		eval passTime();
		finish
	`,},
	{index: `repeatThighfuckRepeat`,
	content: `
		eval data.player.currentScene = data.player.currentScene.replace("Repeat", "");
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		im SCENE-1-light
		im SCENE-2-light
		im SCENE-3-light
		im SCENE-4-light
		im SCENE-5-light
		im SCENE-6-light
		finish
	`,},
	{index: `repeatThighfuckFirst`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		eval raiseTrust('hyena', 1);
		eval passTime();
		finish
	`,},
	{index: `repeatThighfuckRepeat`,
	content: `
		eval data.player.currentScene = data.player.currentScene.replace("Repeat", "");
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		im SCENE-1-light
		im SCENE-2-light
		im SCENE-3-light
		im SCENE-4-light
		im SCENE-5-light
		im SCENE-6-light
		finish
	`,},
	{index: `hot-1`,
	content: `
		t It's a brand new day in syrup town...
		t And it's an absolute scorcher!
		im hot1
		hyena sleep Fuuuuck~<br>Oh wow I needed this.<br>Seriously, not gonna forget this year. I'm getting a real bathtub...<br>Maybe one big enough for me and...<br>And that's...<br>That's... A really big butt you have there... And... <br>Zzz...
		trans cancel; Finish
	`,},
	{index: `hyenaClothes`,
		content: `
		player curious Hey, is that another jacket?
		hyena happy Hmm? Oh, yeah! I actually found a bunch on day, but one was too small for me.<br>Here, take it, we could totally match! 
		eval addItem("Leather Jacket (Closed)");
		player sparkle Thanks! Oh, and if I unzip it, it's basically a second outfit too!
		eval addItem("Leather Jacket (Open)");
		hyena blushy M-maybe you should keep it closed, though...
		player frown Wh-<br>You're walking around with your tits out all the time!
		hyena panic B-but my... Chest... Doesn't do the stuff to people your chest does! 
		player happy Oh, good point. But that just means it'd be excellent training for you!<br>Speaking of...
		hyena worried Eep!
		eval unencounter(data.player.currentCharacter);
		button Finish; generateHouse(data.player.currentCharacter);
	`,},
	{index: `hyenaPoster`,
		content: `
		player curious Ooh, cool poster.
		im poster
		player Who is it?
		hyena happy Dunno.
		player worried You don't know.<br>But you have their poster up on your wall?
		hyena laugh Yeah, I just think it's neat!<br>I think she's singing, so maybe she's part of some local band?<br>I think I might have seen her before, actually...
		player befuddled Hmm. Well, most bats are nocturnal.
		hyena happy Ah, then I've definitely never seen her before. If the sun's not out, I'm not out. Oh well.
		eval addFlag('hyena', 'poster');
		eval unencounter(data.player.currentCharacter);
		button Finish; generateHouse(data.player.currentCharacter);
	`,},
	{index: `hyenaNudity1`,
		content: `
			eval writeEvent('nudity1')
			eval hyenaDress();
			eval addFlag('hyena', 'nudity1')
			eval data.player.location = "lavenderLane";
			finish
		`
	},
	{index: `repeatMayorFirst`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		eval raiseTrust('hyena', 1);
		eval passTime();
		finish
	`,},
	{index: `repeatMayorRepeat`,
	content: `
		eval data.player.currentScene = data.player.currentScene.replace("Repeat", "");
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		im SCENE-1
		im SCENE-3
		im SCENE-4
		finish
	`,},
	{index: `repeatShopFirst`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		eval raiseTrust('hyena', 1);
		eval passTime();
		finish
	`,},
	{index: `repeatShopRepeat`,
	content: `
		eval data.player.currentScene = data.player.currentScene.replace("Repeat", "");
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		im SCENE-1
		im SCENE-2-light
		im SCENE-3
		finish
	`,},
	{index: `repeatMuseumFirst`,
	content: `
		define foxd = dual sp1 foxm; sp2 foxf;
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		eval raiseTrust('hyena', 1);
		eval passTime();
		finish
	`,},
	{index: `repeatMuseumRepeat`,
	content: `
		define foxd = dual sp1 foxm; sp2 foxf;
		eval data.player.currentScene = data.player.currentScene.replace("Repeat", "");
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		im SCENE-1
		im SCENE-2
		im SCENE-3
		im SCENE-4
		finish
	`,},
	{index: `repeatCarpFirst`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		eval raiseTrust('hyena', 1);
		eval passTime();
		finish
	`,},
	{index: `repeatCarpRepeat`,
	content: `
		eval data.player.currentScene = data.player.currentScene.replace("Repeat", "");
		eval addFlag('hyena', data.player.currentScene.replace("First", ""));
		im SCENE-1
		im SCENE-2-light-masc
		im SCENE-3-light-masc
		im SCENE-4-light-masc
		finish
	`,},

	/* 


	System Stuff


	*/
	{index: `placeholder`,
	content: `
		eval writeTest('`+character.index+`')
	`,},
	{index: `kabedon`,
	content: `
		eval writeBig("hyena/hyena2-1a", "player:+1-+81-1.2#expression:happy#shadow:20-30#bottomless#")
		eval writeBig("hyena/hyena5-4a", "player:+1-4-0.8#expression:sleep#shadow:20-30#clothes:Cumload#nude#")
		eval writeBig("hyena/kabedon", "player:0-10-0.7#expression:blush#overlay:hyena/kabedonHand#overlay:hyena/kabedonShadow#overlay:hyena/kabedonShadow#shadow:20-30#topless#")
		eval writeBig("foxf/permit-background", "player:21-18-0.5#expression:smug#overlay:foxf/permit-overlay#")
		eval writeBig("hyena/spotlight", "player:0-10-1.5#expression:blush#overlay:hyena/spotlight1#topless#")
		eval writeBig("hyena/anubian", "player:1-39-1#expression:blush#overlay:hyena/anubian1#")
		cancel
	`,},
	{index: `cancel`,
	content: `
		eval unencounter(data.player.currentCharacter);
		eval changeLocation(data.player.location);
	`,},
]
if (data.player.hyenaProgress == null) {
	data.player.hyenaProgress = 0
}

function hyenaStrip() {
	stripCategory("upperwear");
	stripCategory("lowerwear");
	for (var clothesIndex = 0; clothesIndex < globalClothesArray.length; clothesIndex++) {
		if (globalClothesArray[clothesIndex].index == "Cumload") {
			wearClothes(clothesIndex, "accessory");
		}
	}
}

function stripPlayer() {
	stripCategory("upperwear");
	stripCategory("lowerwear");
}

function clothesStolen() {
	if (checkFlag("player", "originallyHadClothing")) {
		stripPlayer()
		writeHTML(`
			player shock Hey, wait a second, where are my clothes?! 
			special Your clothes have vanished! But not permanently. Using a wardrobe at home, you'll be able to get dressed again.
			player tired Aww well, not like nudity will get me in trouble in this town.<br>Hopefully whoever took them is just borrowing them.
		`)
		removeFlag('player', 'originallyHadClothing');
	}
}

function cleanPlayer() {
	for (var clothesIndex = 0; clothesIndex < globalClothesArray.length; clothesIndex++) {
		if (globalClothesArray[clothesIndex].index == "Cumload") {
			emptyClothes(clothesIndex, "accessory");
		}
	}
}

function hyenaDress() {
	for (var clothesIndex = 0; clothesIndex < globalClothesArray.length; clothesIndex++) {
		if (globalClothesArray[clothesIndex].index == "Leather Jacket (Open)") {
			wearClothes(clothesIndex, "upperwear");
		}
	}
	addItem("Leather Jacket (Closed)", true);
	addItem("Leather Jacket (Open)", true);
}

function hyenaStrip2() {
	stripCategory("upperwear");
	stripCategory("lowerwear");
}

function hyenaProgress() {
	if (data.player.hyenaProgress == null) {
		data.player.hyenaProgress = 0
	}
	if (data.player.currentLocation == "playerHouse") {
		data.player.hyenaProgress += 2;
	}
	data.player.hyenaProgress++;
	if (data.player.time == "Night") {
		bg = cleanupImage("locations/exteriorClean-Night");
		changeBG(bg);
		if (data.player.currentLocation == "playerHouse") {
			writeScene('tourFinishHouse');
		}
		else {
			writeScene('tourFinishNight');
		}
	}
	else if (data.player.hyenaProgress >= 7) {
		data.player.hyenaProgress = 0
		if (checkFlag('hyena', 'hyena1') != true) {
			writeScene('hyena', 'hyena1Start');
		}
		else if (checkFlag('hyena', 'hyena2') != true) {
			writeScene('hyena', 'hyena2Start');
		}
		else {
			unencounter("hyena");
			changeLocation(data.player.location)
		}
	}
	else {
		unencounter("hyena");
		changeLocation(data.player.location)
	}
	//writeHTML(`t Progress: `+data.player.hyenaProgress);
}

var eventArray = [
	{index: "hyena1", name: "A Quick Fap", image: "hyena/hyena1-1",
	content: `
		hyena pent *Huff* *Huff*
		player worried Geez, you're breathing really hard. You rest here, I'll go see if anyone's around to help.
		hyena Sure, sure. Sorry about all this.<br>I'll just... Rest here.
		player frown Don't move a muscle!
		hyena Yeah, yeah. I... See you soon.<br>I'm...
		im hyena1-1
		hyena Hoo... Pretty sure I got an idea of what's going on.<br>So this is heat, huh?<br>Kinda gnarly...<br>How's this even supposed to work? I'm burning up, exhausted, and this is supposed to make me wanna have kids?<br>Man, I really should have attended those classes.<br>Is it supposed to it-
		im hyena1-2
		hyena pleasured Hmmm~?!
		hyena horny O-okay~! That's... Something! Wow!<br>There's where all that energy went!
		hyena love This feels... Really, really nice...!<br>And something's building...!
		hyena shock ... Eh?
		im hyena1-3
		hyena forced Gh... Okay... Getting a little intense, aren't we?<br>L-little, er, not really little, sorry, but...<br>That's... A <i>lot</i> of slime you're squirting out. Isn't it supposed to be thicker?
		hyena perverted Hmm~! A-and aren't you supposed to relax after spurting, or something?!
		t ...
		player scared This way!
		mayor panic I'm right behind you! So, you said she's-
		hyena afterglow H-hey guys...
		im hyena1-4
		player frown You moved!
		hyena Y-yeah, sorry... F-false alarm... Feeling better now...
		mayor pent Geez...<br>Looks like your heat has kicked in. I thought it was something worse.
		player worried Aww man, that means I caused this. Sorry.
		hyena blush N-no, you're fine! This was the whole point of you moving here, right mayorF?
		mayor pent Yeah. Maybe the effects aren't <i>quite</i> as I thought they'd be, but yet. This is a good sign you're having an effect here, playerF.<br>Actually, we should probably let hyenaF get some rest, I can explain her symptoms to you later.<br>
		player worried Huh? Why?
		mayor pent She probably got caught off guard like I did, but she's fully aware of the heat process. Come on, let's go.
		hyena horny Uh... I am? Guys?
		mayor sleep Hoo... You said she was touring you around town? Actually, she's something of an expert on humans. On a lot of things, actually...
		hyena pent Oh boy...
	`},
	{index: "hyena2", name: "A Quick Plap", image: "hyena/hyena3-1",
	content: `
		t You decide to end the tour early, and hyenaF rushes off. Tail and hands between her legs.
		t ...
		hyena worried And so, I've been feeling, well...
		shop sleep A strong tingle, maybe even a full on buzz between the cheeks, right? And at the base between the legs too, the prostate?
		hyena worried Not... Really? No, nothing there...
		shop happy ...
		shop shock Eh?! Like, not at all? Then where?
		hyena pent W-well... It's... Y'know. Not the socket, but the joystick, y'know?<br>Like, just a light bump and my little pal was like a ketchup bottle under pressure, all over the sidewalk.
		shop worried Hmm. That's not what I'm feeling at all. Actually, when folks with dicks first go into heat, they try and challenge other, well, 'males' I guess would be the phrase here.<br>I think I have something around here...
		hyena Hmm. I mean, I followed the human around a bit before we met, and I did get this really weird urge to go right up to them and...
		shop worried Hmm. Knot fully engorged and throbbing, infrequent spurts of precum...<br>Almost as bad as mayorF's but with no desire to get pegged, I can see why even you're feeling stumped.<br>When folks with a dick start going through heat, they should feel the urge to challenge any rival, well... 'Males', and around here the human's the only serious competition.<br>You say something, by the way?
		hyena shock Eh? I don't wanna challenge *him, I-
		shop sleep Relaaaax~<br>If you fight it too hard you'll drive yourself into a rut. Don't worry, I've got the perfect thing!<br>If you just drain those aggressive urges you'll be good as new!
		shop happy Ah, found it!<br>Here, take this.
		im hyena3-1
		hyena befuddled Is... Is this a butt?
		shop sparkle Only the absolute latest in hip onaholes on the market! It's got all the new features. <br>I'm talking 'gwak gwak' throat level grip on that hole. The balls squish and retract when the anus is stretched, and the whole thing darkens in color when the elasticity starts failing so you know exactly when to get a new one!
		hyena love It's... Anus... Stretched...
		shop happy I bought it all ready for when I went into heat, but I haven't needed it.<br>Turns out what you do in the initial moments of heat affects your preferences, and I ended up getting <i>really</i> into backdoor play. Test it out! I can take a break for a bit to talk you through it.
		hyena blush I don't know...
		t ...
		t *PLAP* *PLAP* *PLAP*
		im hyena3-2
		hyena forced Ghhh~! Fuck!
		shop shock Holy shit, you're absolutely going to town on that thing!
		shop frown It's supposed to last a month before it starts wearing out, what a ripoff!
		hyena perverted It... Feels... Amazing!
		shop sparkle Really?! Maybe it's worth something after all!<br>Still, I can't really charge you in good faith for a one-and-done pump-and-dump.
		shop sleep Maybe I've got another model around here. Might be a good way to relieve stress, y'know, when you aren't mating with the human.
		hyena excited Takeittakeittakeit~!
		shop worried Though, you're taking a lot longer than expected. You should probably just take it home-
		hyena pleasured Ngggh~!
		im hyena3-3
		hyena forced Can't...! Fit...! It...!
		im hyena3-4
		hyena blush ...!
		shop happy Oh! I was about to say, I'm pretty sure that model's too small for your knot. Glad you, err... <br>Made it fit.
		hyena excited <3
		shop shock Eh?! You're still humping?<br>Wait, aren't you cumming yet?<br>The whole point is to satisfy yourself, otherwise the heat will just get worse...<br>... I'll go see if I have any more durable models in stock, at this rate you'll shred that hip toy knot-fucking it...
		hyena forced Nghh~<3
		shop happy You did make sure... Nah, nevermind. You have your fun, alright?
		shop sleep Hmm. Let's see.<br>I think I have something around here... Why do I feel like I'm missing something?
		hyena orgasm Oh~! Oh~! Oh~!
		shop worried Hmm. She's pretty aggressive with that thing.<br>If she hasn't already...
		shop sleep Nah, what am I talking about. She's super forward, and the human's <i>totally</i> a top. There's no way she hasn't already challenged *him and lost.
		shop worried Though... If she hasn't yet... It'd already be too late...
		hyena torogao NGHHHH~! TAKE IT~! GONNA FUCK YOU UP~!
		t *PLAP* *PLAP* *PLAP*
	`},
	{index: "hyena3", name: "A Tasty Snacc", image: "hyena/hyena2-2-light",
	content: `
		eval hyenaBottomlessCheck();
		player happy Though, I guess I fit in with the town's vibe a lot better now, huh hyenaF?
		hyena love ...
		player worried ... You alright? You're free of the bush, you can stand up now.
		hyena blush Fine! Totally fine! Hey, you go on ahead real quick, just gotta wiggle myself free!
		player panic Are you stuck?!
		hyena horny N-no! Just... A lady's gotta wiggle sometimes, y'know?<br>Bit embarassing.
		player worried I guess...
		hyena blush In fact, y-you should probably head home, getting a bit late, yeah?<br>I'll be fine, promise! Go play with the jigger, yeah?
		player frown Okay... It's a jiggy, though.<br>I feel bad about leaving you...
		hyena sleep H-hey... I am totally, one hundo percent fine. Promise.<br>And... Maybe you should find something to wear... Down there...
		t ...
		im hyena2-3
		hyena pleasured Ghh, fuck! Waving that perfect, wobbly, fat ass in front of me like that...!
		hyena torogao Ffffuck!
		im hyena2-4
		hyena pent Fff... Damn... My knot's thicker than my fist, and my balls are clenching so hard I could lift a pair of bowling balls...<br>Seriously... All because of-
		hyena forced Ghh~! Fuck, every time I see that ass in my head...<br>What's it gonna take to satisfy you?! I can't just throb uselessly forever, just let it out!
		hyena ... It's not going down, but it's not <i>doing</i> anything...<br>M-maybe I should ask shopF for help...
	`},
	{index: "morning1", name: "A Missing Pillow", image: "hyena/morning1-1",
	content: `
		hyena forced Ngghh, I could have done it... *He was right there...!
		im morning1-1
		hyena perverted So ffffffucking helpless~<br>I could have done it! R... Ra...
		hyena panic N-no! I'm not some monster!<br>*He... Trusts... Nghhhhh~
		hyena pent Nothing's... Coming out... Just more of this thin, goopy slime...<br>"Precum", right?<br>So it's not enough...<br>Maybe if I...
		im morning1-2
		hyena pleasured Hoohhhhh~
	`},
	{index: "hyena4", name: "A Fine Fellatio", image: "hyena/hyena4-4",
	content: `
		t Bravely, you press forward. Taking step after step into what is feeling more and more like a monster's den.
		t Until you realize you've stopped hearing the noises.
		hyena excited Hey~
		im hyena4-3
		player shock Wah! You scared me!
		hyena I can't... Can't hold back anymore...<br>S-sorry about this...
		player pent Heat's gotten to you, huh?
		hyena flirting Yeah... I can't stop thinking about you. And...
		im hyena4-1
		hyena horny Mgggh~<br>Whenever I do, this cock of mine can't help but spew slime everywhere.<br>Shit's relentless... Always clear, and there's no end to the stuff.
		player joy Well I can help with that!
		im hyena4-2
		hyena pleasured Hoh~! W-wait, what are you-
		player sleep Please. You think I didn't know what I was getting into? I've seen plenty of werewolf porn.
		player amused Plus, we're buds! I can...
		hyena excited ...
		player joy Oh my gosh! I'm giving a real brojob, I just put that together!
		im hyena4-4
		hyena flirt ...
		player blush I will say, it's a bit... Bigger, than I thought it'd be.<br>And wow, this knot, I can't even wrap my hand around it!<br>You'll probably cum really quick, right? Since it's your first time and all.<br>If you could tell me when, so that my clothes-
		im hyena4-5
		player pent ... Oh boy. Here w-MMmm-
		im hyena4-6
		player pleasured MMMMGHHH~!
		hyena pleasured Hhhholy fuck~!<br>L-... Lips~! Tongue~!
		t With an iron grip she spears her knotted spear past your lips until the throbbing, angry knot is at the door. And she's knocking with it, hard.
		eval writeBig("hyena/hyena4-7a", "player:0-+1-1.1#expression:torogao#overlay:hyena/hyena4-7b#shadow:20-30#")
		player orgasm GHHHHHHHLK~!
		t Her huge, veiny balls throb once, lifting and tightening as a shot of clear slime squirts right down your throat.
		hyena forced NGHHH~!
		t A second time, her knot pulses and grows just a big wider, already too big to fit in your mouth now it's pressed against your nose nearly blocking off even the <i>hope</i> of fresh air.
		player orgasm HLLLLLLK~!
		t And a third time, which, of course, is followed by...
		im hyena4-8
		hyena ahegao HAAAAH~! HERE IT IS! HEREITISHEREITISHEREITIS~<3<3<3
		t If the precum came out in a squirt, this feels like someone wringing the bottle so dry the cap fires off. A load so thick it's like plaster down your throat, into your stomach, and more than a little in the other direction to coat your tongue.
		t And, finding not even a single bit of leeway past your stretched-to-the-max lips, it escapes right out of both nostrils.
		player broken Gl... ll...
		im hyena4-9a
		player pent ...
		im hyena4-9b
		hyena shock ...!
		t Dark. Darkness. Mouthing something? Words. Maybe.
		t Sleepy.
		t ...
	`},
	{index: "hyena5", name: "And That's How I Adopted a Subby Top - Start", image: "hyena/hyena5-1",
	content: `
		shop worried Hey! They said they saw the human going this way!
		mayor panic Alright, okay! There's no need to rush, alright?<br>Let's not get too hasty. Even <i>if</i> something's up, we still don't want to miss them.
		shop I know, I know, I just had a weird feeling. Like somebody got in waaaay over their head, y'know? And the human doesn't usually spend this long without at least passing by the store.
		mayor worried There has been a distinct lack of *his smell in the a-
		mayor blush Hmm?!
		shop excited Oh, wow, I smell it too...
		shop frown Ugh, along with something else. Smells gross.
		mayor pent It... Yeah, though the human's pheromones make it... Tolerable. I guess if we head...
		mayor shock WHA-?!
		shop shock Huh?!
		t The two step into a clearing in the woods...
		eval writeBig("hyena/hyena5-4a", "player:+1-4-0.8#expression:joy#shadow:20-30#clothes:Cumload#nude#")
		player joy Oh, hey guys!
		t To find the human, naked and covered in cum, standing over an unconscious and twitching hyenaF.
		t ...
		hyena pent Mghh... Wha...?<br>What-
		t Rubbing her strangely aching head, hyenaF sits up. A hazy, painful white noise eventually reveals itself to be a conversation between three people.
		mayor panic Excuse me?! That can happen?!
		hyena panic Wah! What's going on?!<br>playerF, is *he-
		player perverted And so she tried to pull back, but... When her knot softened just a bit, and I pushed forward...<br>Fluffy~<3<3<3
		shop worried So, her body thought she won against you. Her instincts tell her 'mate, mate, mate!', she grabs you by the head and throat swabs you to the point your vision fades...
		player horny Y-yeah, I kinda lost control a bit.<br>Oh, she's awake!
		hyena pent ...
		mayor pent Thank goodness. hyenaF, are you alright?<br>playerF told us what happened.
		hyena scared *He... Did? Everything...?
		mayor annoyed Yes. And playerF, I'm very disappointed in you.<br>I know you have a fascination with fur, but one brush of your nose against her is hardly an excuse to leave a virgin passed out from exhaustion!
		player tired Sorry...
		hyena panic S-seriously, what's-
		shop happy Hey, playerF? Could you try something for me?<br>Give her a command, like a dog.
		mayor fury Like a WHAT?! That is incredibly rude! How dare you-
		shop worried Not you, her. hyenaF.
		player sparkle ...!
		mtrans hyena5-B; "Sit!" !flag hyena hyena5-B;
		mtrans hyena5-A; "Beg!" !flag hyena hyena5-A;
		mtrans hyena5Finish; "Shake!"
	`},
	{index: `hyena5-A`, name: "mini", 
	content: `
		player sparkle Beg!
		hyena love ...!
		t Every bit of the disorientated fatigue vanishes all at once.
		t hyenaF's body seems to move on its own, and her formerly totally flaccid member stands straight up again.
		im hyena5-1
		hyena blush What... Mmmh...
		hyena perverted Pleassseeee~! Pleasepleaseplease! I'm a g-... Good...<br>What... Is...
		mayor scared ...?
		shop sparkle Another one!
		mtrans hyena5-B; "Sit!" !flag hyena hyena5-B;
		mtrans hyena5Finish; "Shake!"
	`,},
	{index: `hyena5-B`, name: "mini", 
	content: `
		player sparkle Sit!
		hyena love ...!
		t Without hesitation, hyenaF sits down, leans back, and spreads.
		t Her previously splurted-dry cock is now leaking again, and her knot is throbbing so tensely you can make out every vein.
		im hyena5-2
		hyena blush W-... Why am...
		hyena horny Hhhhere~! Cock, cock, ready!<br>C-can't... Stop... Leaking~!
		mayor scared What on earth is going on...?
		shop sparkle Another one!
		mtrans hyena5-A; "Beg!" !flag hyena hyena5-A;
		mtrans hyena5Finish; "Shake!"
	`,},
	{index: `hyena5Finish`, name: "mini", 
	content: `
		player sparkle Shake!
		shop shock Err, maybe not that-
		hyena love ...!
		mayor panic Wah! What is she doing?!
		t ...
		im hyena5-3
		hyena panic I... Can't believe I just did that...
		mayor angry And?! What did we learn today?!
		eval writeBig("hyena/hyena5-4a", "player:+1-4-0.8#expression:sleep#shadow:20-30#clothes:Cumload#nude#")
		player tired That 'sh-'... That that word means wiggle your dick around until you coat me with even <i>more</i> cum?
		mayor fury Good enough! And you?!
		shop frown That animal folk cum is way grosser than human-
		t *BONK*
		shop shock Ouch! Okay, okay, no hitting!<br>That I should properly explain the situation before egging the human on! Jeez!
		mayor angry Good! Now, what was that all about?!
		shop sleep Biology.<br>... Probably.<br>Her body's a bit of a mess since her dick thinks she's a top but her brain is suuuuper bottom.
		shop sparkle I did some research after she went absolutely feral on this sex toy I got her.<br>Apparently, even in male folk female human pairings, the human is still the dominant, and this is basically how it works!
		mayor frown Where on earth did you find out about this?!<br>I've never heard anything of the sort!
		shop sleep From educational textbooks. Y'know, like 'BHC stories; I'm even a slave to human pussy!'
		mayor angry That's just porn!<br>C'mon, you and I are having a very long talk about where you get your info from!<br>And you too playerF, hyenaF needs rest!
		hyena worried Wait! I... Can I just talk with playerF...<br>Just for a second?
		mayor tired ... Fine. But seriously, don't take too long.<br>Trying to fight your heat will just drive you into a rut.<br>I'm trusting you on this one, but only because it's you, alright? I trust you to know your limits.
		shop happy You're one to talk~
		shop shock Ow! Okay, okay!
		hyena worried ... Is she out of earshot?<br>There's... Something I need to tell you...
	`,},
	{index: `hyena5Extra`, name: "mini", 
	content: `
		player amused Seems like it. Go ahead and pour your heart o-
		hyena crying I'M A FRAAAAAAUD!
		player befuddled ... Eh?
		hyena A... *Sniff* A phony! A sham!<br>I can't take it anymore, everyone thinks I'm some kind of expert, but I'm not!<br>I'm *Sob* I'm not a dynamite in a handbag gal, I'm a big fat liar!
		player frown You aren't fat though.
		hyena I don't *Sob* know a single thing about human biology, except that you smell nice!<br>*Sniff* I don't know what 'punk' is, my hair just grows this way!<br>Bwaaah... *Sniff* I didn't know this was a motorcycle jacket, I just found it on the ruh... Ruh... Roooooad-!!!
		hyena I just like it when people think I'm cool!<br>I only pay attention to people so they'll like me! I only compliment people so they'll compliment me back!<br>I'm just pretending to be cool, and I'm manipulating everyone! Bwaaaah!!!
		player worried I like you...
		hyena And now I'm manipulating you too! Bwaaaaah!<br>I just wanted to make a friend and I raped you, and now I'm crying so hard I feel like I'm gonna hurllll!
		player There there... Pat pat...
		hyena *Sniff* *Sniff*<br>Are you just saying "Pat pat" instead of actually patting me because I'm gross?
		player sleep No, I just wanted to grab your attention. It's okay, hyenaF.
		hyena panic Okay?! I assault you, knot your jaw, you're soaked in my cum, and things are okay?!
		player amused I've been through worse.
		hyena shock When?! What could you have possibly gone through that would be worse than this?!
		player smug 
		hyena worried I... I know you're probably just lying to make me feel better, but...<br>*Sniff*<br>... It's working...<br>Sorry about raping you...
		player sleep And I'm sorry my sweat turned you into slave to your meat's urges. Even stevens?
		hyena panic No! No even stevens, you're supposed to be, y'know, odoring up the town.<br>I am <i>not</i> supposed to be assaulting people, let alone blacking them out on dong! That's not cool!
		player befuddled Black out...?<br>I mean, yeah, my vision went dark for a second...<br>Then you tried to pull back, but when your knot shrank just a bit my nose was up against this tuft of fur, and your soft hands were...
		player excited Ehe, ehehe~
		eval writeBig("hyena/hyena5-4a", "player:+1-4-0.8#expression:excited#shadow:20-30#clothes:Cumload#nude#")
		hyena confused Uh...<br>Wait, my memory's a little hazy...
		player excited And then, yeah, I might have gone a little crazy~<3<br>Your butt's <i>really</i> fluffy, and that tail of yours...
		hyena befuddled Did... Huh... Actually, I think... I remember I was trying to pull out, but you grabbed my a... Butt, and kept rubbing my tail...
		hyena scared I thought you were passing out... But then you looked up at me and... I got hard again...<br>And I could tell that... That I should start getting rough...
		player flirt Rough? You think that was rough?<br>You never even actually knotted my throat. Not for my lack of trying, mind you.<br>Plus, not even one bruise on me! 'Rough', ha!
		hyena pent I... This is all a lot, but...
		player sparkle But it was great! And hey, maybe next time you'll last longer!<br>You really came a lot, and that throbber of yours could spread me pretty wide, but you only lasted a few seconds each time.
		hyena blush N-next time?
		player sleep Sure, if you want to. A friend's a friend, y'know?
		hyena surprised Friend? Already?<br>And even though I'm-
		player amused A quickshot? A premie? That's short for premature ejaculator, y'know.<br>No worries. And if you're a top that's no problem either.<br>Bros never hold back from giving a brojob when a bro's bricked up, y'know? So if you need a hand, a mouth... ?gender male;
		player amused A quickshot? A premie? That's short for premature ejaculator, y'know.<br>No worries. And if you're a top that's no problem either.<br>Sisters never hold back from giving a handjob when a girl's bricked up, y'know? So if you need a hand, a mouth... !gender male;
		player flirting Or this~
		t *SPANK*
		hyena forced ...! B-bouncy!
		player tired Oh, pheromones. Smacking my cheeks out here is probably a bad idea.<br>Get some rest, alright?
		hyena blush Okay! B-bye...!<br>Oh, wait, d-don't you want to get cleaned up? You're covered in... My...
		player smug <3
		eval addItem("Cumload")
		t You leave the blushing, stock-still hyena girl behind you, and you walk away.
		hyena pent ... W... What just happened...<br>Did I...
		hyena shock W-wait, friends? For real?<br>Even though I'm not actually cool at all?!
		finish
		eval writeSpecial("You unlocked a new event in the gallery!") !flag player gallery;
	`,},
	{index: `hyena6`, name: "First-Time Anal", image: "hyena/hyena6-1",
	content: `
		player surprise Oh! Good point. We should probably address the elephant in the room. Is that bed strong enough to hold two people?
		hyena shock Eh?! I guess, it's got a metal frame, but I'm trying to say now that I'm back to normal...<br>Hmm, I don't know how to phrase it. I was really hoping I'd come up with something now that my heat isn't affecting my head anymore.
		player amused Oh? Then I could slip off my top and raise my arm right now and you wouldn't be drooling over it like a human sweat junkie?
		hyena love Oh... W-well, that...<br>That's... Not fair...
		player sleep I know, I know. Even just me talking right now is making you weak in the knees.<br>Each time you see my mouth moving visions of me, my cheeks puffed out with your knot...<br>Well, it had started softening by the time I'd managed to fit it in, but I think that still counts.
		hyena pent I'm... I wouldn't... I'm not thinking about that...<br>Wait... The time <i>you</i> fit it in...?
		player amused Sure. Eventually your legs gave out, but since you were so pent up I knew I had to help a *bro out!<br>By the way, before you keep arguing, you should probably look down.
		im hyena6-1
		hyena Oh... I... I thought I'd have more time between...<br>Sorry about what I think I'm about to do to you.
		eval hyenaStrip2()
		player confused You say something?
		hyena shock Wah!<br>Humma... Human... <br>Undressing... Naked...
		player happy Oh, and is there a place I can put my clothes? It's not the end of the world if they get soaked, but still. Would be nice if they stayed dry.
		hyena horny I...!
		im hyena6-2
		hyena forced This... Is torture! It feels like my head <i>and</i> balls are gonna burst!
		player laugh That's the spirit! If you spend all your mental energy on restraint, trying to hold back from cumming, you'll have no actual more energy for other things!
		hyena I... Can't stop myself!
		player smug Then do it!<br>Let go!
		im hyena6-3
		hyena torogao Cgggghhh... Can't... Breathe... Think!
		t Slowly, slowly, her knotted cock presses against your lower lips. They don't really resist, yet hyenaF is moving with an <i>agonizing</i> slowness.
		t You can hear the sound of cheap sheets tearing under hyenaF's claws as her muscles start losing control. She's kind of like a big, fluffy, electrocuted fish atop you.
		player amused <i>Hmm. I really, really should take this slowly.<br>Even if she's bigger than me, she's still a virgin after all.<br>On the other hand though~</i>
		im hyena6-4
		hyena forced ...!
		player excited Cmon, you can go deeper!<br>I have no idea how long your orgasms are <i>supposed</i> to last, and you're probably feeling blitzed in the head from how long your orgasm's been going on...
		t With your legs locked around her, you pull the pleasure-paralyzed hyena closer against you. Her throbbing cock pulsing sticky goo into your rectum means you probably aren't getting knotted today.
		t Still, the way she jolts, twitches, and the way her eyes have totally lost focus...
		player excited Cuuute~<br>Ooh. Wow, that's warm.
		hyena torogao Ghhgg-!!!
		im hyena6-5
		hyena torogao Ghh... Can't... <br>*Huff* <br>*Huff*
		player amused Good girl, good girl, just let it aaaaaall out. Probably best that you never made it knot deep, for your head's sake.<br>Now that the mental hangup is broken, we just need to train your stamina and you'll be putting all those internet werewolves to shame!<br>Finally, my dream will...
		hyena pent I don't...-<br>What...-<br>Are you...?
		player joy I'm your friend, silly!<br>Now, think you can pull out on your own?
		t ...
		player sleep Hmm, belly's still a little bloated.<br>Oh well, I've digested more a lot faster.
		hyena sleep Zzz... Ngh... Zzz...
		player curious Hmm. I should probably teach you how to do kegel exercises. <br>Maybe get you some zinc supplements? Nah, volume's not the issue.
		im hyena6-6
		player smug Oh, we're going to have so much fun together. <br>Sleep tight, hyenaF~
	`,},
	{index: `repeat1`, name: "Training: Footjob Edging", image: "hyena/repeat1-1",
	content: `
		hyena befuddled Just your feet? But like, we went all the way already...
		player sleep Yeah. So let's start off nice and easy, and really let you build up before spurting this time. It's called 'edging', and...
		t ...
		im repeat1-1
		hyena forced I'm gonna breaaaaak-!<br>Please, please I'll do anything!
		player pent Hah... So much for a slow buildup.<br>I mean, I haven't even really <i>tried</i> seducing you yet. Just being in the same room as you makes you so hard I worry you'll just go pop!<br>So what'll happen if I start getting serious? If I tossed some of my worn clothes onto you, or God forbid I twerked for you.
		hyena I... Ghh! I don't even know what that means!
		player tired I'm not gonna give you a demonstration, you creaming would make this whole exercise useless.<br>Basically, I'd start bouncing on the balls of my feet, letting the movement carry uuuuup my legs...
		t You pull your foot away for a moment.
		hyena torogao Ghhh-!
		t To her credit she manages to hold herself back from grabbing your leg and humping to finish like some common bitch.<br>Still, hopefully you can train at least a little bit of rough dominance into her.<br>If she <i>did</i> pin you down right now, you'd probably call that enough of a win for today to let her cum...
		t Anyways, once she's back down from the edge, you push your foot forward and let the little piggies get to work again.
		player amused So, where was I?<br>Right. So, the motion carries, causing the ass to bounce up and down.<br>It's pretty fun, actually. Makes a nice "Clap! Clap! Clap!" sound, and-
		hyena NGHHHHH~
		player curious You got to the edge even sooner that time! Did I not wait long enough, or do you have a really good imagination?<br>I'm actually pretty good at it, so it's probably even better than you think it is.<br>I used to get called 'Thunder Thighs' a lot, and-
		hyena I'm... S... Sorry... Khhh!
		player sleep Ah, it's fine, it wasn't here, it was in this city called Mopo-
		player shock Wah!
		im repeat1-2
		hyena Cumminggggg~<br>Can't... Stop... Cumminggggggggg!
		player blushy Oh jeez, I stopped too late. guess I got distracted.<br>Hmm, well, ruining orgasms is more of a 'sub' thing, so if I want you to get more 'top' energy, I guess I should...
		im repeat1-3
		hyena pleasured Hoh! W-wait, wait!<br>It'sh... Hoh~!
		player worried Yeah this is my bad. Turning up the intensity as you're cumming, it's probably massively overstimulating you.<br>But I figure maybe you'll get desensitized and this'll help you last longer?
		hyena orgasm GHOUUUUHHH~<3<3<3<br>BRAINSH... DYIN... ALL... WHITE~<3<3<3
		im repeat1-4
		hyena broken Gh... Hoh... Sho... Much...
		player Hmm?<br>Finished? Alright, well, it'll take a bit of patience, but maybe a bit of gentle massage will get you standing straight again.<br>Maybe I'll focus on the testies more this time.
		hyena broken I can't... I... Penish... Too tired... Broken... For sure...
		player smug Ehhh? You think so...? <br>Well then, I guess I <i>can</i> give you a demonstration after all. <br>Okay, let's count how many claps it takes to get that totally flaccid cock back to one hundred percent. If you make it to twenty and you're still soft, we can stop for today.
		hyena panic Wait, please... Have mercy...
	`,},
	{index: "repeat2", name: "Repeatable - Heavy Petting", image: "hyena/repeat2-1", requirements: "?flag "+character.index+" repeat2;",
	content: `
		hyena confused Petting? You're not self conscious about that kinda stuff?
player amused Of course not! Everyone should have a chance to get appreciated and loved! Now-
hyena laughing Definitely! Alright, c'mere!
im repeat2-1
hyena amused Good *boy, who's a good *boy? You are, yes you are~!<br>You're my special little *boy, aren't you?
player pervert Ah, wait, h-hold on-
hyena teasing Nuh-uh, you don't get to feel self-conscious now~<br>There there, good *boy~
player excited Ohhh~<br><i>Must... Try to... Fight back...!</i>
t You manage to extend your own arm out, resisting the overwhelming affection coming from hyenaF's hands.
player forced Huh?!
t Your hand stops dead after it makes contact with hyenaF's cheek.
t <b>BETRAYAL</b>
t Your mind, what parts of it that aren't being smothered by hyenaF's happy praise, is filled with boiling rage as your hand refuses to start petting.
hyena amused ... Yeah, it's not great.<br>I mean, I know you like fluff, and fur and all, but I'm basically a short-haired cactus.
player fury N-no! I love all fur! All fluff!
hyena laughing Haha~! There's no fluff here, *bro. I appreciate you trying, though.<br>How about you just relax and let me-
player angry No!<br>All fur is precious! Even the bristliest fur has an addictive appeal!<br>I just need to... Gh...<br>I will... Shower you with affection!
hyena blushy Jeez! You trying to make my heart skip a beat or something?<br>Seriously, don't hurt yourself...<br>It's not like I'm a fan of being pet anyways.
im repeat2-2
hyena pent Well, I'm getting... A <i>little</i> stiff, sure...<br>But I'll be fine. A gal should be able to appreciate her little *bro like normal once in a while.
player pout Since when am I your "little *bro"?
hyena laughing Haha! Is my little *man getting worked up about the height gap now?
hyena sleep Look, this is just how life is, y'know? Some people are born short, some ladies are born with... Well, the kinda hair you'd rather pet steel wool than touch.<br>I'm glad you want me to feel all fuzzy like an actual cute n' soft girl, but it's not happening.
player angry Mother... Father... Please, whichever one of you was an actual biblical demon, please... Give me your strength...
hyena amused Oh you... C'mere...
hyena confused Huh. That's, uh... Kinda a weird look in your eye.<br>Is that a trick of the light, or-
t ...
player pent Hooh... Man, I haven't had to use that technique in a while...<br>It <i>really</i> exhausts me.
hyena broken ...
im repeat2-3
player sleep I won't sugarcoat it, hyenaF. Your fur is like the rough side of a sponge.<br>But I love all fluff. No exceptions. And if you ever, <b>ever</b> feel like your fur is unlovable again...
player frown It doesn't matter what time it is. It doesn't matter where you are.<br>I <b>will</b> find you. And I will fluff you.
	`},
	{index: `repeatHand`, name: "Training: Orgasm Torture", image: "hyena/repeatHand-1", requirements: "?flag "+character.index+" explore;",
	content: `
		eval data.player.currentScene = "repeatHand"
		player sparkle Whoooo's ready to do some training~?
		hyena tired ... Me.<br>Sorry we have to go through this whole rigamarole just to hang out...
		player annoyed None of that! Too much self deprication leads to low self esteem. Which leads to less confidence. Which leads to anxiety. Which leads to...
		player angry Premature ejaculation!
		player sleep So, with that in mind for our training today, take off that jacket! You're streaking until we find a good spot to train!
		hyena shock Eep! 
		t ...
		player angry Now, begin!
		hyena blushy O-okay! S-so... You... C-can't take your eyes off-<br>Wait, lemme try again...<br>H-hey, I noticed you s-staring! You can't...
		im SCENE-1
		hyena worried Do I really need to do this?
		player happy Absolutely, and you're doing great. Speak with confidence, and don't forget to shake those hips! Let your body do some of the talking.<br>Remember, I'm a meek little minx, and I'm hanging off your every word!
		hyena horny Okay!<br>S-so, c... C-cutie! Like what you s-see? Can't take your eyes off my... Throbbing... Dom-pipe?<br>S-see how leaky my huge, k-knotty shaft is getting for you?<br>Do you wanna touch it?
		player joy I do! 
		im SCENE-2
		hyena awe Hah! W-wait, hold on, don't stroke so f-fast right away!<br>Just swinging it side to side earlier-
		player sleep Relax, you don't need to hold back from cumming.
		hyena forced Ghh! B-but-<br>Fff, your hands are so soft...!
		player joy Ooh, that's good! Keep going, feel free to order me around a little, we can do two forms of training at once!
		hyena Ngghh~! W-what are you doing?!It's like...
		im SCENE-3
		hyena orgasm Ghouhhhh~! I'm being milked~! I can't... Stop spraying precum!
		player sleep Hmm hmm~<br>Well, not quite an order, but I <i>did</i> say to let your body do some of the talking.<br>Nice thrusting by the way! But keep those hands behind your head no matter what!
		t Carefully spacing your hands apart, you do your best to mimic the sensation of a pair of lips and the tightness of a throat, trying to simulate a deepthroat.
		t Each time your hand slides down to the base of her cock, you relax your grip veeeery slightly, hoping this is the thrust where she'll FORCE her knot forward.
		player annoyed C'mon... Almost... There...
		hyena forced Ghhhhh~! Gonna...!
		player shock Wah!
		t As you see the veins on hyenaF's balls throb and her sack clench, you release your grip entirely and grab on somewhere else.
		im SCENE-4
		hyena torogao NGHHHH~<3 CUMMING!
		player excited There we go... Just in time...
		hyena pent *Hff* *Hff*<br>Wh... Why'd you stop?
		player sleep Hmm? Like I said, there's no need to try not to cum today, that's not the kind of training we're doing.<br>No, that was a "ruined" orgasm! All the exhaustion of cumming, but without the relief or post-nut clarity.<br>Now, keep those arms up and let's go again.
		hyena forced Ghhh~! Already?!
		player sparkle Absolutely! And by the way, this style of training is called "Orgasm Torture"!
		player excited Speaking of, time for the second round!
		im SCENE-5
		hyena ahegao Ahhhhhh~!
		t ...
		player happy Hoo boy! That was certainly one heck of a session.<br>It's really interesting, with how sensitive you are, I figured you had maybe three, four loads in you before you started firing blanks.
		hyena afterglow Aha... Ahaha...
		im SCENE-6
		t hyenaF's overworked nuts, once each the size of your fist, now hang twice as low at half their usual size. And her previously iron-hard cock is now as floppy as a gummy candy.
		player joy Seriously, it's incredible! Sure, you're totally soft now, but you're still squirting super thick jelly even on load eight!
		player excited Ehehe~ I wonder. Sure, it may be soft, but I know a few techniques that might still make you-
		hyena broken ...
		t *THUD*
		player scared Eh!?<br>Hey, c'mon, you were just laughing and having a great time a second ago!
		player tired ... Nothing. She's out like a light.<br>Well, I guess eight loads in one day was more than a newbie could handle. Shame most of it was wasted on floor.
		player sleep ... And I'm not lifting you, so looks like we're napping together. Scooch over, buddy!
		hyena ...
		player worried ... Lemme just close those eyes for you. People who sleep with their eyes open creep me out.
	`,},
	{index: `repeatRimming`, name: "Training: Prostate Pressure", image: "hyena/repeatRimming-1", requirements: "?flag "+character.index+" explore; ?trustMin "+character.index+" 10;", tags: "rimming",
	content: `
		eval data.player.currentScene = "repeatRimming"
		player sparkle Training time! I just had a great idea!
		hyena pent Y-yeah, more training. Woo...
		hyena worried <i>Wait, wait... My buddy's trying to help me.<br>Or they have a very particular fetish.<br>I can't come across as ungrateful just because I'm a little sore...!<br>I gotta show enthusiasm, like a good friend should!</i>
		hyena fury YEAAAAAAH! LET'S GO MAKE ME THE BADDEST TOPGIRL WHO EVER...<br>Uh...<br>TOPPED!
		player joy That's the spirit!
		t ...
		player Alright, bend over, and point your butt towards me!
		im SCENE-1
		hyena pent ... Explain to me again how this'll help me knot you?
		player confused How can I explain it "again" if I didn't explain it the first time? All I said was for you to bend over.
		hyena worried Yeah. Yeah. That tracks.<br>Guess I was just really hoping I missed something obvi-
		im SCENE-2
		hyena forced -iiiIIIIIII!!!
		player happy Alright, the plan's simple! You know how-<br>Holy moly that's a lot of precum, it's like I'm squeezing a turkey baster...<br>Err, so, I figure this situation is a lot like doing super light exercise!
		hyena Eep! Where are you groping?! I didn't know that spot was so sensitiiii-!<br>Ghh, why can't I stop squirting even when I try to hold it back?!
		player sleep Excellent question! With how much and how quickly you cum, I think you're not actually draining yourself fully, even after multiple orgasms!<br>Your prostate is so hyperactive that the moment you start getting excited, you're basically full to burst right away!<br>Alright, try to tighten your kegels.
		hyena panic I don't know what that means!
		player annoyed Mrgrgr. Dang. I'll teach you some other time. For now though, that means I can't just push your prostate from the outside.
		im SCENE-3
		player sparkle Oh man, looks like I'm gonna need to go face-first into this meaty pucker, what a shame!
		hyena panic WHAT?! NO! STOP!
		player confused ... Is this like, an actual boundary, and you have an aversion to anal?<br>Or just shame and embarrassment talking? Because one of those will be respected, and the other gets the response of "mpph ppphhhlll blrrrrrt".
		hyena It-
		player sleep Which are the noises I make when playing the rusty trumpet, in case it wasn't clear.
		hyena blush I mean, it's just that I've never done this kinda thing before...
		hyena panic W-wait! Why are you moving your face closer?!
		player befuddled Uh, because I'm about to start making out with your butthole? Duh.<br>I could peg you, but I need to rub your prostate from both sides at once.
		hyena B-but... That's like... With your mouth! Like kissing!<br>I mean, it's not like I ever really thought about kissing, often, but like...<br>Shouldn't your first kiss be like...
		hyena worried Special?
		player joy D'aww, that's so cute!<br>I didn't know you were romantic like that!<br>Well, don't worry, all I'll be doing is shoving myself face-deep in your butthole so I can give your prostate a thorough tongue bath.<br>We can kiss each other like normal afterwards.
		player sleep But don't worry. You're nervous, and don't have experience with anal. So we'll take this slow.
		im SCENE-4
		hyena forced Hhhh~! W-what-?!
		player flirting Lalala~<br>Some sensual licking to start with!<br>Mmm~<br>Okay, enough prep!
		im SCENE-5
		hyena torogao Nghhhh~<3
		player love Phhhhlphh~
		hyena forced Feels... So weird...! I think... I'm cumming~?!
		player ahegao Mpph~ Ppphhhlll~ Blrrrrrt~
		t ...
		hyena afterglow Thish... Thish ish...<br>Ghhh...<br>Washn't... Shupposhed to be like thish...
		player amused I know, I know. You probably had totally different ideas for what you and I would do when we became friends.<br>Adventure, exploration, maybe we'd even find evidence of cryptids together.<br>But instead...
		im SCENE-6
		player sleep You're laying face down in an alley, and my lips taste like hyena butthole.
		hyena broken Shorry...
		player happy Don't be! We can do all that other cool stuff too! There's no rule saying you can't be respectful homies <i>and</i> play with each other's buttholes!
		player sleep Because if there <i>were</i> a rule like that...
		player amused Well, I've broken more serious laws.
	`,},
	{index: `repeatThighfuck`, name: "Training: Breaking Point", image: "hyena/repeatThighfuck-1-light", requirements: "?flag "+character.index+" explore; ?trustMin "+character.index+" 11;",
	content: `
		eval data.player.currentScene = "repeatThighfuck"
		player happy Hmm hmm hmm~
		player sparkle ...!
		hyena pent Hey, hey hey hey, I know that look. You just-
		player joy Thought of an amazing new way to train!
		hyena worried Am I getting naked again? Bending over in public?
		player sleep No, don't you worry one bit. I promise this won't be embarassing for you in the slightest.
		t ...
		t And so, for today's training you decide to take a nice little stroll through the woods.
		hyena love ...
		player happy You okay? You've been aaaawfully quiet back there.
		hyena blushy Hmm?! Err, I, I wasn't-
		im SCENE-1-light
		hyena love Hoh~<3
		player sleep Alright, seems like you're ready.<br>As you probably guessed, today's training is restraint.<br>More precisely, it's about training yourself to not have any restraint!
		player happy Now, how long have we been walking? Err, more importantly, how long have you been staring at my ass?
		hyena Hours...
		player sleep About three minutes, but you were close!<br>And I think that's long enough.
		t You lay your naked butt down and spread eagle, as if you're serving yourself on a silver platter.
		im SCENE-2-light
		hyena love ...!
		t Sweating, trembling, and squirting precum like a leaky faucet, hyenaF's smile and eyes both have a manic shake to them. Which of course only intensifies as you languidly wave your foot in front of her face.
		player sleep In my experience, the best way to beat anxiety is have a total mental breakdown.<br>And during that mental snap, break several boundaries and slash or laws. Thus realizing there was nothing to be anxious about at all.
		hyena Uhuh~<3
		player happy Are you just gonna agree with anything I say so long as my bare feet are in front of your face?
		hyena excited Uhuh~<3
		player happy We've been walking for a while, so I'm reeeally sweaty. I bet you're having a hard time holding back.
		hyena flirting Mhmmm~<3
		player sleep ...
		player confused ...?
		player befuddled ... But you're still able to?
		hyena blushy Mhmm! Mhm mhm!
		player worried ... Well okay then.<br>You really do have a strong will. You're cooked out of your mind, but you still aren't attacking me.
		player sleep Well, I didn't want to have to do this, I was hoping you'd pounce me of your own volition. But it seems like I'll have to command you to take charge.<br>It feels a little counter-intuitive, but I get the feeling that if I don't you'll stand there until you pop.<br>So...
		player excited hyenaF, tongue.
		hyena forced Ghhh~!
		im SCENE-3-light
		hyena flirting Hah~!!!
		player laughing Hahaha~! Hehe!<br> That tickles! I didn't tell you to frot too!
		player sparkle Wait, this is perfect! Okay, back up.
		hyena torogao Nghh! Breed~! Breed!!!
		player sleep Yes, yes, I know.<br>You have a very cute growl, by the way.<br>Well, that's either a growl or your testicles churning.
		t Veins across her body bulging, hyenaF manages to tear herself away from your body with considerable effort.
		t If you had any actual survival instincts, they'd probably be telling you that you're pushing your luck right now, but...
		player sleep It's fiiiine.<br>Now! hyenaF.
		im SCENE-4-light
		hyena love ...!!!
		player teasing You like what you see? You like what you seeeee?<br>You want it?
		player mocking Too~<br>Bad~<br>You can play with my legs and feet but-
		t And in a blur of motion she's on you.
		im SCENE-5-light
		player shock Wah!
		hyena torogao BREED! NGHHHH~!!!
		t You aren't sure if she's following your order exactly, the last of her willpower is still burning strong, or if she genuinely wanted to take your leg-ginity before targeting your ass. Either way she's hugging your legs closely, pressing you into the dirt.
		player laughing Ahaha~! C'mon, c'mon, push that knot forward!
		t Her eyes flicker like she's on the edge of consciousness every time her fat, bulging base makes contact with <i>anything</i>, let alone your ultra-thick thighs.
		im SCENE-6-light
		hyena forced Ghhhhgggg~! GHUUUDDDDDD~!<br>GHMMMMMNNGGGG~!
		player love You're doing it! You're cumming the whole way, but you're doing it!
		hyena torogao Ghhhhhhggg~<3
		t Her knot slips between your legs, finally completely enveloped, pointy knob spurting the whole way of course.
		player sparkle Great job! 
		hyena broken Hhh... Hohhh...
		hyena orgasm Ghouhhhhh~<3 Hahhahah~!
		t She lets out a ragged, barely coherent moan followed by manic laughter, before she starts thrusting herself back and forth between your legs to knot and un-knot your thighs.
		player surprise You still have more in the tank?! Amazing! You're doing great, hyenaF, keep it up!
		hyena afterglow Ahaha~ Hahaha~
		t ...
		mayor tired And so... That's...
		eval writeBig("hyena/hyena5-4a", "player:+1-4-0.8#expression:joy#shadow:20-30#clothes:Cumload#nude#")
		player joy Yep! That's why I'm naked and covered in the forest again.<br>I'll be sitting on that knot soon, I can feel it!
		shopkeep amused Oh you! You're incorrigible! You know people could hear you all the way down on Willow Walk, right?
		player sleep A small price to pay.
		mayor Right, and explain to me again why you're so determined to be... Well, mated with?
		player amused I can't explain it <i>again</i>, silly! I didn't explain it a first time.
		shop amused Yeah, mayorF. Y'know, I think you're the crazy one here for thinking the human's brain works on logic.
		hyena broken Ghh...
		mayor annoyed Hey! Don't all three of you gang up on me!
		mayor panic Er-<br>No, hold on.<br>Grr, why is it whenever I hang around you bunch, it feels like my brain stops working?<br>Is she okay, by the way? She keeps moaning, twitching, and... Ugh, spurting...
		shopkeep worried Hey, speaking of, do you need to borrow a bathtub?<br>I don't remember mayorF ordering you one, how have you been cleaning yourself?
		mayor amused Pff, very funny, shopF. I specifically had carpenterF lay out all that pipework for a reason.<br>The human has access to a top-of-the-line... Tub... That... I had to import...
		mayor scared ... It never arrived. It was supposed to arrive just a few days after... <br>Oh dear God, how <i>have</i> you been cleaning yourself?!
		t And so, this training session draws to a close. While the whole scene certainly feels familiar, you get the impression something big is just on the horizon.
	`,},
	{index: `repeatMayor`, name: "Training: Mayoral Visit", image: "hyena/repeatMayor-3", requirements: "?flag "+character.index+" explore; ?trustMin "+character.index+" 11;",
	content: `
		player sparkle I know! Let's go visit mayorF!
		t ...
		player curious mayorF? Helloooo~?<br>It's not legally considered 'snooping' if you aren't hooooome~
		hyena tired Looks like she's out.<br>Also, pretty sure that's not how that works.
		player happy Yeah, but because I said it I have plausible deniability. Or I can claim insanity. Or both.
		player smug Ooh, she left her computer on. Looks like she was watching something.
		im repeatMayor-1
		t Suddenly, everything goes black as hyenaF's paws cover your eyes.
		player shock Wah! Why?!
		hyena panic Because it's-
		hyena worried Oh, right, yeah, nothing you haven't seen before, I guess.<br>Sorry, instincts.<br>Still, didn't think mayorF was the kind of person who'd be into such, uh... Degrading stuff.
		player curious Degrading? Lemme see.
		t Removing the paws blocking your vision, you're able to actually start the video.
		im repeatMayor-3
		player befuddled ... Huh.
		hyena Yeah, looks like it's some kinda compilation where that bunny is getting their mate stolen by a human. I think this was called-
		player shock Gah! Quick, look away, cover your eyes!
		im repeatMayor-4
		hyena panic Wah, okay!<br>But why though?!
		player frown Because this... Is NTR!
		hyena worried ... Okay?
		player angry This could set you back on all the top training we've done so far!<br>I won't have the futa werewolf gf I've been waiting for lose herself to cuck porn!
		hyena blushy Oh, wow! Uh, so, I'm not a werewolf, I dunno what a "foota" is, and I guess I don't mind if-
		player fury Keep those eyes covered! People have fought wars over this kinda thing! C'mon, let's go!
		hyena panic Wars?!<br>Wait, but if I keep them covered-
		t *Bonk*
		hyena scared Ow, what'd I hit?!
		player frown A pillar, c'mon, this way!
		t *Bonk*
		hyena panic Ah! Ouch, was that a-
		player worried Doorframe, yeah, just duck!
		hyena crying Do I <i>really</i> need to keep them covered? Can't we just turn off the-
		t *Squish*
		hyena forced ... W-why is the doorknob squishy? playerF?
		player smug ...
		t ...
		mayor pent Mgh... Finally. Now that's dealt with, I can get back to-
		mayor scared ... Why is this not paused where I left it?!
	`,},
	{index: `repeatShop`, name: "Training: Store Trip", image: "hyena/repeatShop-3", requirements: "?flag "+character.index+" explore; ?trustMin "+character.index+" 11;",
	content: `
		player sparkle I know! Let's go visit shopF! She's gotta know what it takes to be a good dom, she watches tons of porn!
		t ...
		player happy So, that's the whole situation. Do you have anything that could help?
		shopkeep sparkle DO I?!
		hyena confused ... Do you?
		shop smug Yeah. Yeah I do.<br>And the answer is an onahole! Or fleshlight, if you prefer brand-name stuff.
		hyena befuddled Wait, like that one you showed-
		shop angry Absolutely not! That one was trash, garbage, absolute slop compared to what <i>you</i> need!
		hyena worried Wait, but you said it was-
		shop amused The sex toy industry moves fast, hyenaF, keep up! You need the freshest, you need divine!
		shop worried ... Well, okay, you also need stamina and endurance training, so here, knock yourself out with this pile over here.
		hyena O... Kay? What like, start-
		shop happy Yes, start cranking that knotty dog of yours. playerF! You're with me.
		player joy Yes ma'am! What are we doing?
		shop teasing What else? We're gonna make the best damn sex toy hyenaF's ever seen!
		dual sp1 hyena; sp2 player; befuddled "Make"?
		shop fury No more questions! You, start with the gooning, and you, into the back room with me!
		shop sleep Though, leave your pants. They'll make a good rag for hyenaF, and we won't need them.
		player frown On it!
		t ...
		t Several minutes pass as hyenaF tests out various toys of shapes and sizes.
		im repeatShop-1
		hyena perverted Geez... This one's like a handful of jelly... It's modeled after an anus, so is this what playerF's...
		hyena forced Ghh! Whoa, almost got carried away there... Can't stop too early!
		hyena pent Hoo... Okay, don't cum, don't cum.<br>I wonder how playerF's doing?
		t ...
		t Meanwhile...
		shop excited Ehehehe~
		im repeatShop-2-light
		player orgasm Ghohhhh~<br>Ghh, ghh, mhouhhhhh~
		shop Just... Mhmhm~ Focus on those muscle clenches~<br>Slowly, this memory gel will take shape, and we'll have a perrrfect replica of that yummy butthole of yours~
		player torogao Ghhg~! But... Won't thrusting... Gh...! Deform the shape...!
		shop seductive Mmm, don't you worry about it, leave it aaaall to me, I have plenty of backups if that happens~<br>Just tell me riiiight before you cum so I can make sure it's at its deepest right as your whole body goes stiff as you have an orgasm~
		player orgasm Ghouhhhh~!!!
		t ...
		t Some time later...
		player tired *Huff* *Huff*...<br>hyenaF? We finished-
		shop excited We both did, a few times actually-
		im repeatShop-3
		hyena orgasm NHOUHHHHH~!!!<br>MAKE IT STOOOOOP~!!!
		shop forced Oh, shit! Was that in the pile?!<br>Hold still, hold still!<br>Aww, fuck me, you cracked the metal arms right off! Lemme just... Stop thrusting!
		player surprise Wowie! You sure did take your training seriously!<br>What a mess too, sorry about this shopF.
		hyena broken Aaahhhheyyyaahhh~ Ahaha~<3
		shop tired Yeah, yeah. This was mostly my fault.
		player worried I'll go grab a towel or something. Lemme get dressed first.
		t *Squish*
		shop befuddled *Bro, did you seriously just put those cum-soiled-
		hyena forced NGHHH~!!!
		shop fury I SAID STOP FUCKING THRUSTING!
	`,},
	{index: `repeatMuseum`, name: "Training: Museum Visit", image: "hyena/repeatMuseum-3", requirements: "?flag "+character.index+" explore; ?trustMin "+character.index+" 11;",
	content: `
		player tired Hrm... Maybe the foxes know something that could help?
		t ...
		player tired And so that's the gist of it.
		foxm amused Hmm, hmm. So basically...
		foxf amused You came here looking for the power of...
		foxd sparkle The twins!
		player befuddled Y-yeah? We came here to the museum you two own.
		hyena laughing Ahaha! playerF, don't try to logic through these two. They can be a real pair of oddballs, but they mean well.
		foxm happy Hey, better oddballs than mothballs.
		foxf joy Hey, that gives me an idea! Are you thinking what I'm thinking?
		foxd sparkle FASHION SHOW!
		hyena worried Uh, hold on-
		player amused No, no, they're definitely on to something.<br>Plus, they mean well, right?
		hyena tired ... You got me. Alright, just nothing too embarassing, okay?
		t ...
		foxf happy Okay, I'm back from locking all the doors, has it started yet?<br>I swear, if wolfF finds out we did this without her-
		foxf joy Ooh, popcorn! Share!
		player amused Fine, fine.<br>And no, foxmF is still backstage picking out outfits. I actually heard hyenaF say she was about to walk out nude if he didn't hurry up.
		foxf amused Pfft, amateur. I already have <i>several</i> outfits in mind.
		player happy Well, I still appreciate-
		foxm sparkle PREEEE-SENTING!
		dual sp1 player; sp2 foxf; sparkle It's starting!
		foxm <i>The</i> classic lewd outfit, in a perfectly-fitting black of course, the microoooo-bikini!
		im repeatMuseum-1
		dual sp1 player; sp2 foxf; joy Ooh!
		hyena pent Uhuh. Yeah. Soak it all in you guys.<br>Spent like five minutes picking out clothes just to decide on a few pieces of string.<br>How's this supposed to make me more dominant?
		foxm worried ... I did my best...
		hyena surprise Oh, hey, c'mon buddy! I didn't mean that to put you down!<br>You're doing me a solid here, don't let my moaning get to you.
		player befuddled So, that's not embarrassing to you?
		hyena confused Not really. Sure, these are basically just bits of string, but I walk around with less covered all the time.
		foxf joy Me next! I know what to pick!
		hyena amused Yeah, yeah. You alright with that, little dude?
		foxm happy Yeah, I'd rather watch, honestly.<br>I'll just take a seat and-Ooh, popcorn!
		foxf angry Don't eat my share!<br>Okay, let's get you back, I know <i>exactly</i> what you need to wear.
		t ...
		foxm tired -and so it turns out, she wrote her name on the <i>bottom</i> of the sandwich bag, and I ate it.
		player worried Geez, that sounds rough. Even though you apologized-
		foxf sparkle PREEEEE-SENTING!<br>She'll steal your heart for sure, the perfect fit for the dommy top you need!
		im repeatMuseum-2
		hyena blushy O-okay, this one's a bit much!
		foxm surprise Oh, dang! The jewel thief outfit, why didn't I think of that!
		player love Amazing! I can make out your knot through the latex!
		player befuddled Hoooold on, wait, <i>this is</i> embarrassing for you? It covers like 90% more than your jacket!
		hyena forced Y-yeah! That's the problem, I'm all sweaty in here, and if I start leaking precum...<br>Plus, it's like, y'know... Pink. That's a girly color, and-
		foxd sparkle Another, another!
		hyena panic I d-dunno, maybe we should
		foxf I know exactly what she needs! You remember the companion outfit we got off scamazon?
		foxm Ooh! I'll do the makeup!
		hyena scared Makeup?! Hold on, wait, this is like, my look!<br>The eyeshadow's the only thing I'm good at, and blue's all I've ever tried!
		player sparkle Another, another!
		foxd mocking You heard the audience!
		t ...
		foxd sparkle PREEEE-SENTING!
		hyena panic How the hell is this a "human companion" outfit?! No way am I going out-
		hyena shock Hey, little dude, don't step so close to that wire, you'll trip!
		t foxmF makes a big show out of looking like he's about to fall, and hyenaF dashes in to catch him, only for the sly fox to dodge at the last second.
		player love Whoaaa~<3
		im repeatMuseum-3
		hyena blushy foxmF, you little...<br>L-look, I know I look ridiculous, you don't need to say it.<br>"Human companion outfit" my ass.
		foxf teasing Well, actually, it's more of an 'escort' outfit.<br>The piercings are clip-on, by the way. You can tug if you want.
		hyena angry Don't you dare.
		foxm teasing Scary, scary~<br>But we all know you like it~
		hyena forced I do not! Rubbing all this fabric all over me just got me a bit... Y'know...<br>A-anyways, get me out of this thing!
		player Preeetty~
		hyena pent Oh stop with the pity, I don't need a confidence boost, just, like... Whatever, another one, fine, I can tell you both won't let us go without one.
		hyena angry But! Nothing weird, nothing embarrassing, and nothing g... Girly!
		foxd teasing O~Kaaaaay.
		t ...
		player happy ... I wonder if they'll give her the dress to take home.<br>That'd be pretty-
		foxm sparkle PREEEE-SENTING! FOR OUR FINAL OUTFIT OF THE DAY~!
		hyena forced I... Gh... I can't...!
		foxf angry C'mon, hold it in at least till we're on stage!
		foxm panic Uhh... *Ahem* Preee-senting...?
		foxf fury Give us a second!<br>Stop rubbing it! It was perfectly in place, now you'll-
		hyena torogao NGHHH~<3
		foxf annoyed Oh God damn it! Ah! Stop, fucking... Whatever, just get out there!
		im repeatMuseum-4
		hyena afterglow Hhahhhh~<br>H-hey, playerF~
		player happy Heya! You have fun back there?
		hyena C-comfy, easy to w-wear... Just my s-size, too...
		foxf Yeah, now that the shorts are all stretched out.<br>Blegh, some got on my face.
		player You feeling more dominant, at least?
		hyena I feel like... Like I'ma top o-the worlddd~
		player joy That's exactly what I like to hear! Great job you two, you were perfectly in sync too!
		foxm amused Well, yeah. We run a whole museum, we know what we're doing.
		foxf happy And we're a pair!<br>And because we're twins, that means we always finish each other's...!
		foxm worried ... It was an honest mistake, I said I was sorry.
		foxf annoyed "Sorry" doesn't un-eat my food. Now finish the joke or I'm making you clean all this up with a toothbrush.
		foxm tired *Sigh*...<br>We always finish each other's... Sandwiches.
		player sleep C'mon girl, let's get you home.
		hyena Ogeeeey~
	`,},
	{index: `repeatCarp`, name: "Training: Naptime", image: "hyena/repeatCarp-2a-light-masc", requirements: "?flag "+character.index+" explore; ?trustMin "+character.index+" 11;",
	content: `
		player sleep Let's go see carpF.
		hyena confused Why would they know anything that could help?
		player tired Uh... They're really well rested?
		t ...
		player happy And so those are the deets!
		hyena confused ... Deets?
		carpenter sleep I think I understand.<br>*Yaaaaawn*<br>There's a spot in the orchard that's perfect-
		player joy For building dominant energy?!
		carpenter For naps. You two should go together. Sleeping on any issue is the quickest way to solving it.
		hyena worried Yeah, I don't know if that'll help us.
		player happy No, no, they've got a point.<br>Rashes, tummyaches, death. Most of those vanish when you wake up, so sleeping is a great first step to getting better!
		hyena befuddled ... Death?
		player smug Yeah. If you wake up, you aren't dead anymore.
		hyena tired ... Okay, you got me on that one.<br>Alright, let's go find a spot to nap, you earned it.
		player sparkle Yaaaaay!
		carpenter sleep Yah... Hoo...<br>Zzz...
		t ...
		hyena worried So, not to be a Debbie Doubter, but... You sure this'll actually help?
		player Yep!
		hyena panic Wa-wa-why are you naked?
		player amused Uh, because clothes don't need to sleep? They're inanimate?
		hyena tired ... <i>Damn, *he got me again. *He's good.</i>
		player happy Alright, this is definitely the spot. Lay down here, I'll be the little spoon!
		player sleep Mm. And I'm glad you're getting more invested in being more of a top, by the way.
		hyena worried Uhuh... Huh, yeah, I guess I am actually kinda interested in getting better at it.<br>Maybe it's because of how fun this has all-
		hyena confused W-wait, but like, what if I roll over? I don't wanna squish you while... You're...
		player sleep Zzz...
		hyena panic Eh?!<br>How do you and carpenterF manage to-
		hyena amused ... Oh well, nevermind that. Sleep tight little buddy, have a great nap.
		player Zzz.
		hyena sleep ...
		player Zzz.
		hyena scared ... How on earth am I actually gonna fall asleep like this?!<br>No girl on earth could get a wink of sleep with all this jiggling meat next to her!
		hyena pent Okay, okay, caaaaalm down hyenaF. Just relax.<br>Just, uh... Relieve yourself. Inconspicuously.<br>You've never had problems with it before, and this time you've got the best wank material in the world...
		hyena panic W-wait, no, that's not right. I shouldn't be thinking of my friend that way.<br>N-no, no, not, uh... Okay, I can just like, take a whiff of *his hair, or something. That should be enough.
		hyena perverted A-and, well, uh... Wow, *his face up close like this... Thos lips, are...
		hyena love Are...
		t ...
		player sleep Mmmgh-<br>Glllk-
		im repeatCarp-1
		player pent Mmmhuuuuh-?
		hyena pleasured Ghhh! You're awake?!
		hyena forced Nghh, g-go back to sleep, back to sleep!<br>This is just a dream, I wouldn't do something like this, never!
		im repeatCarp-2a-light-masc
		hyena orgasm Nhouhhhh~! I can't stop! I need that throat around meeee~!!!
		player orgasm Ghlllk-!
		hyena torogao Just... Take it! Cumming!!!
		im repeatCarp-3a-light-masc
		hyena ahegao Hah... Ahah~<3
		t Her soft nuts drag up and down your face between each breath. Thankfully, a calm mind and a very, very relaxed throat give you at least a <i>tiny</i> bit of breathing room between each face-hump.
		hyena pent Ghhh... Hah... I...
		hyena love I did it? I-
		player surprised <i>She did it!</i><br>Ghhlgggl-
		hyena torogao Ghhhhg~!!! D-don't! <br>I can't believe I did this... Treating my friend in such a brutal, dehumanizing way...
		hyena pent Ghh... Who am I kidding, you've been egging me on this whole time...<br>Ffffuck, can you breathe? Wait, don't try to answer, just the feeling of you breathing on my nuts is...<br>H-hold on, lemme try...
		t Grabbing your wrists and lifting you, she swings her leg over your head to get a better angle.
		hyena pent H-have to... Stay focused... Feels like I'm walking a tightrope...
		t Managing to stay rational while her cock is still thrumming, even if it's coming down from her orgasm, is a great show of growth.
		player surprised 'Ey, hea-hing oh highh-<br><i>Hey, speaking of tight-</i>
		hyena forced GHHIIII!<br>N-no, no, d-don't do that!<br>Do you want to get off, or not?!
		player smug <3
		hyena panic H-hey, I really don't like that look.<br>Don't I deserve a break? Just this once?<br>I'm still really sensitive, so-
		im repeatCarp-4-light-masc
		hyena torogao Gghhhhhg-!!! Whhaaa...! Ngh! Are you...!
		player sparkle 'Hot huh-hing! Huh!<br><i>Knot sucking! Duh!</i>
		t Never one to let a good opportunity go to waste, you ensure hyenaF is thoroughly drained so that you two can get a <i>real</i> nap together.
	`,},
	{index: `nudity1`, name: "Public Indecency", image: "hyena/nudity1-1", 
	content: `
		player happy Hmm hm hmm~
		player worried Weird, it feels like I'm forgetting something-
		hyena panic Hey, hey little buddy, hold up!<br>Here!
		player shock Wah!
		t You're spun around, your arms lifted, and before you know it you're suddenly wearing a leather jacket.
		hyena Aww jeez...
		im nudity1-1
		hyena This doesn't cover anything!<br>Well, at least the pits are covered....
		hyena pent Little buddy, my dude, my home slice, my hawt-dawg...
		player confused How did you even pronounce the last one like-
		hyena blushy You can't be walking around in public all willy-nilly! You drive people in this town crazy!<br>I mean, in a good way, kinda, but like... Still! You could get attacked!
		player shock Oh, right! I'm still naked!
		hyena panic Still?!
		player worried I mean, is it really that big of a deal? You all walk around without pants, isn't it fine if I-
		hyena annoyed No, no way, no chance, no dice, no nothing.<br>Seriously, you can't be... W-wobbling... J-jiggling...<br>Y-you can't be strutting all of <i>that</i> in public! What if somebody goes nuts at the sight of you!
		player smug Hmm~? Someone like you?
		hyena blushy N-no way! I mean, you... I...
		player sleep I'll be fine, there's no rules against it. And clearly you have enough self control to not pounce me, pin me down here in public, spread my-
		hyena panic Ahhh! S-stop! No way. You go home and put on some pants!<br>And I feel so naked like this... I dunno how some crazies walk around totally in the buff...<br>I need my backup jacket!<br>Don't wander off the path on your way home!
		player tired ... She ran off.<br>Shame, teasing her was really fun.<br>Though, it is actually kinda breezy, I should probably head home and put something else on.
	`,},
];

function hyenaBottomlessCheck() {
	var bottomless = isBottomless(data.player.clothes);
	if (bottomless != true) {
		writeHTML(`
			hyena happy It's just through here, and-
			t *riiiiiiip*
			player shock Whoa!<br>Geez, that was a close one.
			hyena worried You alright? Your skin's a lot more... Fragile... Than...
			hyena love ...
			im hyena2-2-light
			player frown How much of it...<br>What the heck? That one tiny thorn tore off everything from the waist down?!
			hyena Some... Some of the plants here...
			player tired Right. Forgot there's weirdness among the wildlife here.<br>Hey, could you give me a push?
			hyena Just... A push... Put my hands... On...
			player happy Oh! finally, some give, I'm through!
			eval writeBig("hyena/hyena2-1a", "player:+1-+81-1.2#expression:worried#shadow:20-30#bottomless#")
			eval stripCategory('lowerwear') !flag player gallery;
			player worried Ugh, it's totally shredded.<br>What the...
		`);
	}
	else {
		writeHTML(`
			hyena Careful of these branches by the way, you gotta duck down like this-
			player Gotcha. Which branches, these?
			hyena love ...!
			im hyena2-2-light
			hyena You, uh... I just realized, you aren't...
			player worried Yeah, I probably should have worn pants for this.<br>Hey, any chance you could give me a push?
			hyena Just... A push... Put my hands... On...
			player happy Oh! finally, some give, I'm through!
			eval writeBig("hyena/hyena2-1a", "player:+1-+81-1.2#expression:worried#shadow:20-30#bottomless#")
			eval stripCategory('lowerwear') !flag player gallery;
			player sleep Alright, not a scratch on me!
		`);
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