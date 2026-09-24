var character = {index: "doe", flags: "", fName: "Nutmeg", lName: "", color: "#F2BA80", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"};

var logbookArray = [
	"im images/doe/clothed/happy; title Excitable; doeF is the beloved daughter of her mother, mommyF, with whom she still lives. Of the pair she's definitely the more outgoing of the two, and she'll jump at any opportunity to meet a new friend.<br>She and her mother serve as helpers around town, often volunteering their services to help clean.<br>She's hopeful she'll grow as tall and large as her mother someday, but most townsfolk think she's been stunted by her mother's overbearing nature.",
	"im images/doe/logbook2.png; title Simple Dress; An avid lover of the outdoors, doeF's favorite outfit is a simple blue dress that's easy to move around in. The fabric is light and breezy, and the cut is so short it doesn't even come close to covering the towering, downright beastly horsecock between her legs.<br>It certainly suits her innocent nature!",
	"im images/doe/logbook3.png; title Horse Schmeat; ?trustMin "+character.index+" 3; Now that you've taught her the joy of orgasms, her meaty horsecock is nearly always hard. Unlike the rest of her, her tower of meat and massive, often throbbing balls, are a deep brown color.<br>She's developed a habit of showing it off, especially to you, but her real habit is her newfound addiction to emptying her huge nuts.<br>Unfortunately her tolerance for pleasure is naturally high and rapidly growing, and her prostate isn't developed enough to actually pump out the thick stuff in her balls, so masturbation alone can't finish her off. For now, at least.",
	"im images/doe/logbook4.png; title Lean Ass; ?trustMin "+character.index+" 5; Given that she lacks the colossal amount of plowmeat her mother has packed into her ass and thighs, one would be forgiven for thinking they could last longer than a few minutes without going balls deep into doeF's asshole. They would be wrong, of course.<br>What doeF lacks in rippling flesh is easily made up for by the way her asspipe tightly and greedily swallows every possible inch of human cock.<br>An athletic nature and very, very eager to please attitude go a long way in this world!",
];

var achievementArray = [
	{index:"93"+character.index+"Friend", frame: "ultraRare", name: "Doe's BFF", requirements: "?trustMin "+character.index+" 6;", description: "Become a part of doeF and mommyF's soon-to-be-growing family.", image: "doe/achievement1",},
];

var itemsArray = [
];

var shopArray = [
];

var pickupArray = [
];

var morningArray = [
	{index: "morning1", priority: 100, requirements: "?trust mommy 3;", unique: true,},
	{index: "doeMorning-mayor", requirements: "?trustMin doe 6; ?trustMin mayor 1;", unique: false,},
	{index: "doeMorning-shopkeep", requirements: "?trustMin doe 6; ?trustMin shopkeep 1;", unique: false,},
	{index: "doeMorning-carpenter", priority: 1, requirements: "?trustMin doe 6; ?trustMin carpenter 1;", unique: false,},
	{index: "doeMorning-wolf", requirements: "?trustMin doe 6; ?trustMin wolf 1;", unique: false,},
	{index: "doeMorning-sadogato", priority: 1, requirements: "?trustMin doe 6; ?trustMin sadogato 1;", unique: false,},
	//{index: "doeMorning-milf", priority: 1, requirements: "?trustMin doe 1; ?trustMin milf 1;", unique: false,},
	{index: "doeMorning-nun", priority: 1, requirements: "?trustMin doe 6; ?trustMin nun 1;", unique: false,},
	{index: "doeMorning-mesu", priority: 1, requirements: "?trustMin doe 6; ?trustMin mesu 1;", unique: false,},
	{index: "doeMorning-fash", requirements: "?trustMin doe 6; ?trustMin fash 1;", unique: false,},
	{index: "carpenterMorning-doe", priority: 1, requirements: "?trustMin carpenter 1; ?trustMin doe 1;", unique: false,},
	{index: "fashionistaMorning-doe", priority: 1, requirements: "?trustMin fashionista 1; ?trustMin doe 1;", unique: false,},
	{index: "hyenaMorning-doe", priority: 1, requirements: "?trustMin hyena 1; ?trustMin doe 1;", unique: false,},
	{index: "mesuMorning-doe", priority: 1, requirements: "?trustMin mesu 1; ?trustMin doe 1;", unique: false,},
	{index: "shopkeepMorning-doe", priority: 1, requirements: "?trustMin shopkeep 1; ?trustMin doe 1;", unique: false,},
	{index: "wolfMorning-doe", priority: 40, requirements: "?trustMin wolf 1; ?trustMin doe 5;", unique: true,},
];

var encounterArray = [
	{index: `intro1`, name: `Someone's knocking at your door`, requirements: "?location playerHouse; !time Night; ?trust doe 0; ?futanari; ?girls; ?day 5; ?nutmeg;", altName: "", altImage: "",},
	{index: `doe1Start`, name: `Drop by doeF's house for a meal`, requirements: "?location willowWalk; ?trust doe 1;", altName: "", altImage: "",},

	{index: `doeSearch-pineconePlaza`, name: `Search for doeF`, requirements: "?location pineconePlaza; ?trust mommy 2; !flag doe pineconePlaza;", altName: "", altImage: "",},
	{index: `doeSearch-riversideRoad`, name: `Search for doeF`, requirements: "?location riversideRoad; ?trust mommy 2; !flag doe riversideRoad;", altName: "", altImage: "",},
	{index: `doeSearch-lakesideRetreat`, name: `Search for doeF`, requirements: "?location lakesideRetreat; ?trust mommy 2; !flag doe lakesideRetreat;", altName: "", altImage: "",},
	{index: `doeSearch-lakesideRuins`, name: `Search for doeF`, requirements: "?location lakesideRuins; ?trust mommy 2; !flag doe lakesideRuins;", altName: "", altImage: "",},
	{index: `doeSearch-forestPath`, name: `Search for doeF`, requirements: "?location forestPath; ?trust mommy 2; !flag doe forestPath;", altName: "", altImage: "",},
	{index: `doeSearch-forestWilderness`, name: `Search for doeF`, requirements: "?location forestWilderness; ?trust mommy 2; !flag doe forestWilderness;", altName: "", altImage: "",},
	{index: `doe2`, name: `Stop searching for now`, requirements: "?location willowWalk; ?trust doe 2; ?trust mommy 2;", altName: "", altImage: "",},

	{index: `doe3`, name: `Someone's knocking at your door. Again!`, requirements: "?location playerHouse; !time Night; ?trust mommy 5; ?trustMax doe 3;", altName: "", altImage: "",},
	{index: `doe4Start`, name: `Even more knocking at your door!`, requirements: "?location playerHouse; !time Night; ?trust doe 5;", altName: "", altImage: "",},

	//{index: "doe4", name: `Visit doeF and mommyF again`, requirements: "?trust doe 6;", altName: "", altImage: ""},
	{index: "House", name: `Visit doeF's House`, requirements: "?location willowWalk; ?time Evening; ?trustMin doe 6;", altName: "", altImage: "",},
	{index: `watch-start-doe`, name: `Play with doeF`, requirements: "?location willowWalk; ?trustMin doe 6; ?holiday watch; !flag doe watchStart;", altName: "", altImage: "",},
];

var sceneArray = [
	{index: `intro1`,
	content: `
		t You open the door, only to find nobody's-
		doe special secret; Down here! Excuse me! <br>Hey, *mister? You're a human, right?
		im intro1-1
		doe happy My name's <input type='text' id='nameSubmission-doe' value='doeF'>! Can I smell you?
		button Continue; renameCharacter('intro2')
	`,},
	{index: `intro2`,
	content: `
		player befuddled Smell me? Did I forget to-
		player tired Ah. For the pheromones.<br>Go ahead.<br>I'm playerF, by the way.
		doe sparkle Thanks!
		doe sleep Hmm. I was expecting something tangy, or like, "ZAP!"<br>Hey, this is your house, right? I live in one too!<br>It's down on Willow Walk.
		doe joy Oh, you should come by for dinner! My mom makes whole spreads of lots of stuff. We use anything we don't eat for composting.<br>She's really nice, I bet she'd invite you herself. She's a kinda nervous person though.
		player happy Well, I do like food.
		doe sparkle Me too! That's perfect, I'll see you there!<br>Bye!
		im intro1-2
		t And just like that, she's running off. Her far too-short dress telling you that it probably won't have a strict dress code.
		player tired ... Also, those were some really big balls.<br>I wonder where she gets all that energy if she's hauling those around all the time.
		player confused Hmm. Wait, what if stamina is stored in the balls?<br>No, wait. It's stored in the spleen, I'm pretty sure.<br>She must have a huge spleen, then.
		player shock Wait, she didn't specify a day!
		eval setTrust('doe', 1)
		eval passTime()
		finish
	`,},
	{index: `doe1Start`,
	content: `
		player happy Hmm. Well, the mailbox says '<input type='text' id='nameSubmission-mommy' value='mommyF'> & Nutmeg', so I guess this is the house.<br>Knock knock~<br>Sorry for just dropping by out of the blue~! Anyone home?
		player worried ...
		t There's a brief silence, at first you wonder if anyone's actually home, before the knob begins to turn.
		mommy special secret; Hmm~? Nobody-
		player shock W-whoa! Down here!
		im doe1-1
		mommy shock Oh! Hello there, you're the new resident!<br>Oh, I'm so sorry I didn't come by to greet you as you were moving in!<br>
		player love N-bo problem at all, m-ma... Mah... Mother...<br>M-ma'am.
		doe sparkle Ah, *he's here!<br>Mom, this is the human, playerF! I invited them over for a meal. playerF, this is my mom!
		button Continue; renameCharacter('doe1')
	`,},
	{index: `doe1`,
	content: `
		eval writeEvent('doe1');
	`,},
	{index: `doe1a`,
	content: `
		eval writeEvent('doe1a');
	`,},
	{index: `doe1b`,
	content: `
		eval writeEvent('doe1b');
	`,},
	{index: `doe1c`,
	content: `
		eval writeEvent('doe1c');
	`,},
	{index: `doe1Finish`,
	content: `
		eval writeEvent('doe1Finish');
		eval setTrust('doe', 2) !flag player gallery;
		eval passTime() !flag player gallery;
	`,},
	{index: `doeSearch-pineconePlaza`,
	content: `
		player pout Alright, I'll check the plaza. Maybe she's around here.<br>Ooh, mayorF! 
		mayor pent Hmm...?
		player sparkle mayorF! Have you seen a deer girl, about this tall-
		mayor tired Ah, doeF?<br>She went on a walk again, and her mother's panicking again, isn't she?
		player surprised Whoa, spot on!
		mayor amused Well, it helps that mommyF was just in my office telling me about it.<br>Don't worry too much, she has a tendency to overreact to her daughter showing any kind of independence. I'm sure she's fine, though I haven't seen her.
		player worried Maybe. Thanks anyways.
		eval addFlag('doe', 'pineconePlaza')
		eval unencounter('doe')
		finish
	`,},
	{index: `doeSearch-riversideRoad`,
	content: `
		player shock Wait, what if... She fell into the river!?<br>Hold on, doeF! I'll rescue you!
		shop joy Ooh, playerF! Going for a swim? Maybe I'll-
		t *SPLASH*
		player panic WAGGARBLEGARBLGHHH-!
		shop shock ...!
		t ...
		shop fury What were you thinking?! What was that?! You dove in, and it looked like you immediately tried to drown yourself!
		player pent Thanks shopF...<br>Sorry, I've tried to learn, but every time I've gone into deep water I just start-
		shop scared Eh? That was you trying to swim?<br>But you... The way you cupped your hands and pushed water right into-
		player happy Anyways, have you seen doeF anywhere around here?<br>Deer girl, red horns, even shorter than me?
		shop scared And you opened your mouth right away, you're supposed to take a deep breath <i>before</i> you jump into the water...<br>And what the hell were you doing with your feet?
		player tired Guess not. Looks like you're stunlocked trying to figure out my swimming moves.<br>I should keep searching, feel free to keep muttering to yourself.
		eval addFlag('doe', 'riversideRoad')
		eval unencounter('doe')
		finish
	`,},
	{index: `doeSearch-lakesideRetreat`,
	content: `
		player sleep Ah, the quiet, serene tranquility of the lake.<br>Tell me, old friend, have you seen a deer girl, about yea high around here recently?
		t "No."
		player I didn't think so, thanks anywa-
		player scared aaaaAAAAAAAAY! Was that a ghost?! Ghosts are the opposite of fluffy!<br>Run away!!!
		eval addFlag('doe', 'lakesideRetreat')
		eval unencounter('doe')
		finish
	`,},
	{index: `doeSearch-lakesideRuins`,
	content: `
		player scared Ehhh...?! Search the super scary waterlogged ruins?<br>No way, there could be ghosts in there!
		player pout And being afraid of ghosts is one of my most important character traits! Like loving fluff, or being afraid of the dark!<br>And I don't have time to have a character arc to overcome it right now!
		eval addFlag('doe', 'lakesideRuins')
		eval unencounter('doe')
		finish
	`,},
	{index: `doeSearch-forestPath`,
	content: `
		player curious The forest. Maybe she went in here and got lost?
		player frown No way. I've barely met her, but I could tell right away she had the face of a responsible adult. She'd take her walk somewhere reasonable and safe, not the woods!<br>Only a total dummy would just wander right into the forest without a buddy! A total buffoon with no regards to their own safety!
		player sleep ... I should check somewhere else before I do anymore self-damage.
		eval addFlag('doe', 'forestPath')
		eval unencounter('doe')
		finish
	`,},
	{index: `doeSearch-forestWilderness`,
	content: `
		player frown I don't know why I'm even checking out here. I said she's not-
		player surprise Ooh, a cool rock!<br>It looks kinda pointy, so I obviously won't touch it, but still, rad.
		player sleep Y'know what, brain? I'm sorry.<br>I thought you were crazy checking out here for doeF, but because of you I got to see that cool rock. So you're alright by me.
		eval addFlag('doe', 'forestWilderness')
		eval unencounter('doe')
		finish
	`,},
	{index: `doe2`,
	content: `
		eval removeFlag('doe', 'pineconePlaza')
		eval removeFlag('doe', 'riversideRoad')
		eval removeFlag('doe', 'lakesideRetreat')
		eval removeFlag('doe', 'lakesideRuins')
		eval removeFlag('doe', 'forestPath')
		eval removeFlag('doe', 'forestWilderness')
		eval writeEvent('doe2');
		eval setTrust('doe', 3)
		eval setTrust('mommy', 3)
		eval passTime();
		finish
	`,},

	{index: `morning1`,
	content: `
		eval writeEvent('doe-mommy-morning1');
		eval setTrust('mommy', 4);
		eval unencounter('mommy');
		finish
	`,},
	{index: `doe3`,
	content: `
		eval writeEvent('doe3');
		eval setTrust('doe', 4);
		eval passTime();
		finish
	`,},
	{index: `doe4Start`,
	content: `
		eval writeEvent('doe4Start');
	`,},
	{index: `doe4-0`,
	content: `
		eval writeEvent('doe4-0');
	`,},
	{index: `doe4-1`,
	content: `
		eval writeEvent('doe4-1');
	`,},
	{index: `doe4-2`,
	content: `
		eval writeEvent('doe4-2');
	`,},
	{index: `doe4-3`,
	content: `
		eval writeEvent('doe4-3');
	`,},
	{index: `doe4Finish`,
	content: `
		eval writeEvent('doe4Finish');
		eval passTime(); !flag player gallery;
		eval setTrust('doe', 6); !flag player gallery;
		eval setTrust('mommy', 6); !flag player gallery;
	`,},
	
	{index: `statusQuo1`,
	content: `
		eval writeEvent("doeQuo1");
		eval unencounter('doe')
		eval setTrust('doe', 7)
		special Now that you've become friends with doeF and mommyF, you can visit their home and who greets you will change based on the time!
	`,},
	{index: `statusQuo2`,
	content: `
		eval writeEvent("doeQuo2");
		eval raiseTrust('doe', 1);
	`,},
	{index: `doeQuickFix`,
	content: `
		eval generateHouse("doe");
		eval updateMenu();
		eval checkForAchievements();
	`,},
	{index: `statusQuo`,
	content: `
		doe happy Mom's resting right now, she says she gets sleepy on a full tummy, so it's just you and me for a bit.
		doe joy So, so, do you wanna play?<br>I promise, I can be a great host!<br>I mean, my cooking isn't as good as hers, and I'm not quite as bouncy or cuddly, but I make up for it with enthusiasm!
		trans repeat1First; Ask to pet doeF !flag doe repeat1;
		eval writeQuoRepeats();
		cancel
	`,},
	{index: `repeat1First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag(data.player.currentCharacter, data.player.currentScene.replace("First", ""));
		eval raiseTrust('doe', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat1Repeat`,
	content: `
		im repeat1-1-light
		im repeat1-2
		im repeat1-3
		im repeat1-4
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `repeat2First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag(data.player.currentCharacter, data.player.currentScene.replace("First", ""));
		eval raiseTrust('doe', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat2Repeat`,
	content: `
		im repeat2-1-light
		im repeat2-2-light
		im repeat2-3
		im repeat2-4-light
		im repeat2-5-light
		eval unencounter(data.player.currentCharacter);
		finish
	`,},

	{index: `watch-start-doe`,
	content: `
		eval writeEvent(data.player.currentScene);
		eval addFlag(data.player.currentCharacter, "watchStart");
		finish
	`,},

	{index: `doeMorning-mayor`,
	content: `
		
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town.
		t Well, everywhere except for mayorF's house.

		doe sparkle Whoooa~ It's so clean~!
		mommy mayorF, you don't need to clean up every time before we arrive...
		mayor shock Whaaaat~? I... I would never!
		doe happy Where are the toys?
		mommy angry doeF!
		mayor worried It's fine, it's fine! Sorry doeF, I had to get rid of them. It's the responsibility of an adult to be mature and thoughtful.
		doe shock Aww! I really liked the vibrating one!
		mayor worried Y-yes, yes you did. I've never been so embarrassed in my life...
		doe happy Okay, I'll start with the bedroom!
		mommy worried And I'll... Hah... Search for anything at all you left for us to clean...
		mayor happy What can I say? I keep a tight ship. Plus, it's been... A while since I came home. Hehe.
		t "AH! AH! AH!"
		mayor ...!
		mommy shock doeF! What are you doing in there?!
		mayor shock Oh no no no...
		doe shock Whoa...<br>mayorF, what's this all about?
		mayor shock Um! Let me just... Close that, and... Gah!
		mommy Oh my~!
		mayor Sorry! Sorry, I just... Uh...! Okay!
		doe shock Whoa! You just pulled the cord right out of the wall!
		mommy shock Isn't that bad for the computer?
		mayor excited It's fine! Totally fine. Absolutely, completely fine. Sorry you had to see that.
		doe happy Why? It's just sex.
		mayor shock ...!<br>... I keep forgetting you already know all this stuff...
		doe Yep! The birds and the bees, and flowers, and...
		doe angry ... The storks.
		mommy happy Doing some research on humans for our latest resident?
		mayor excited Yes! Yes, just, just getting some research done. Haha!
		doe sparkle Hey mom... mayorF's pretty sweaty huh?
		mayor shock Eh?
		mommy sparkle Oh my, yes she is. Well, since she didn't leave anywhere in the house for us to clean~
		mayor sparkle W-wait! Where are you taking me?!
		doe sparkle We're the maids today, and you're the only thing dirty in house~
		mayor excited W-wait, I can shower by myself!
		mommy Of course you can, you're such a big, responsible young lady...
		doe And responsible young ladies get pampered~!
		mayor torogao Nghh~! W-wait! Be careful there~!
		mommy I'll hold her still in the tub. Now doeF, this is a knotted penis, so make absolutely sure that the knot, that that big bulb, is totally clean, okay?
		doe Don't worry, I'll... Whoa~!
		mayor ahegao Oughhhhh~!
		mommy My my, somebody's ticklish~! You're spraying everywhere~!
		doe We'll clean it all up, don't you worry!
		mayor ahegao N-no... I'm still cumming, it's still sensi... Sensitive... Don't rub my...
		mayor torogao KnnnnnnnnnnnNNNNGH~!!!


		trans cancel; Finish
	`,},
	{index: `doeMorning-shopkeep`,
	content: `
		
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town.
		t Well, everywhere except for the back rooms of Ivy & Oak General Store.

		shopkeep Alright, right here. I'll close off the room while you two work.
		doe sparkle Whoaaa~
		mommy sparkle Oh my, what are these?
		doe I think I saw this one at mayorF's house...!
		shopkeep That one's a little intense for our darling mayor, it uses electric shocks to... <br>Well, nevermind. The stuff in here is expensive, and customers won't pay as much if the boxes are scuffed, so be careful. We're friends, right doeF?
		doe happy Of course! And friends don't break, friends don't snoop, and friends don't squeal about tax evasion!
		mommy worried What on earth have you been teaching my daughter?
		shopkeep Hey, be thorough in here and maybe I'll gift you guys one of these. That'd be a teaching moment for sure.
		doe I already know about some of this stuff though, like... "Womb massager"... Wait...
		mommy worried That's a very odd shape, it doesn't look like it'd do a good job of pressing against the tummy.
		doe worried And what's with all the nubs on the side?
		shopkeep Those are for having a <i>really</i> good time. Lemme know when you two are finished!
		doe worried ... Mom? How come shopkeepF always makes me feel like a confused little girl?
		mommy worried I have no idea, honey. She makes me feel the same way.
		
		trans cancel; Finish
	`,},
	{index: `doeMorning-carpenter`,
	content: `
		
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town.
		t Well, everywhere except for carpenterF's front door.

		doe sparkle Maid service~! Two cute maids at your door for the price of none~!
		mommy worried doeF, about that 'two cute maids' part...
		doe shock Are you saying I'm not cute?!
		mommy panic No! No I'd never say that!
		carpenter worried Mmmgh... Could you keep it down?
		doe shock Oh, sorry mister... Missus?
		carpenter happy Don't worry about it. Anyways, I'm headed back to bed.
		mommy worried Don't you have a big project coming up?
		carpenter sleep Yeah... Already done... Zzz
		mommy sparkle Oh my~ 
		doe happy How do they get so much done so fast?
		mommy happy The power of being well rested, I suppose. You could learn something from them.
		doe worried Mmm... It's been hard to sleep lately.<br>Hey mom?
		mommy happy Yes darling?
		doe Will all this heat stuff ever end?
		mommy ... To tell the truth, I hope not. I'd like another little girl just like you. Or for you to become a mom yourself.
		doe sparkle Whoa~ Then everybody would have to accept that I'm an adult!
		mommy happy Hehe~ Well, you'll always be my baby girl~

		
		trans cancel; Finish
	`,},
	{index: `doeMorning-wolf`,
	content: `
		
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town.
		t Well, everywhere except for wolfF's house.

		doe angry Blue!
		wolf angry Green!
		doe fury Blue!
		wolf fury Green!
		mommy shock What on earth are the two of you fighting about?!
		doe pout wolfF thinks that stupid old green is the best color!
		wolf pout doeF You little brat, the immature masculine smoothness of pure blue has no place in a refined woman's palate! Except maybe as an accent color.
		doe angry You take that back, blue doesn't have an accent!
		wolf angry Never!
		mommy panic Girls, please! This isn't okay! What's got you so heated about all this?
		doe She started it by saying she couldn't possibly understand why someone would like blue!
		wolf Lying cur, I did not say that! I said "whatever is it that drives someone like you to choose something so ordinary as blue as your favorite color?"!
		doe Well then I guess I misheard you, and this is my fault!
		wolf Well in retrospect, I can see how you misunderstood me! So it's mine too!
		doe So we're both at fault then!
		wolf Completely!
		doe worried ... Sorry wolfF.
		wolf worried ... I'm sorry too, doeF. I snapped when, well, I value your opinion of me a great deal. I suppose anger is a defense mechanism I didn't realize I had.
		doe happy It's okay, I guess I was mostly just mad at myself for not being able to find the right words.
		mommy happy Thank goodness the two of you calmed down...
		wolf So, doeF, I'd still like to know, why blue?
		doe Because it's the color mom picked for me!
		mommy worried D'aww~
		wolf worried I can't believe I trampled all over a parent's love. I should have realized aesthetic appeal is only part of the picture...
		wolf sparkle After all, fashion is seen with the eyes first, the brain second, but in the end, fashion is appreciated by the heart!
		doe happy Yeah! Green's an awesome color! It's so cool and mature!
		wolf And blue is a darling color with so much variety! Baby blue is actually in my top seventeen secondary colors for pastelle moods! ... Even if I haven't found a way to make it shine on me.
		doe happy Well, yeah. Baby blue is for babies!
		wolf shock ...
		wolf angry You take that back.
		doe angry Okay I will! But only because you know a lot more about fashion than me!
		wolf Thank you! But in truth I am just as much on a journey as you! You should be more confident in your opinions!
		doe I'd be a lot more confident if you weren't so pretty and smart!
		wolf YOU'RE AN ABSOLUTELY PRECIOUS TREASURE AND I CHERISH THE FACT THAT WE WERE BORN IN THE SAME TOWN!
		doe WELL THAT MAKES ME SO HAPPY I WANNA CRY, AND I WANT YOU TO KNOW I HOPE SOMEDAY I CAN WEAR A DRESS AS WELL AS YOU DO!
		mommy worried Oh goodness...

		
		trans cancel; Finish
	`,},
	{index: `doeMorning-sadogato`,
	content: `
		
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town.
		t Well, everywhere except for sadogatoF's front door.

		doe worried D-do we really have to?
mommy She's a little rough around the edges, but she needs our help just like everyone else.
doe But... But whenever she stares at me, I wanna cry...
mommy And how would you feel if people felt you had an evil stare? I bet deep down you'd be really lonely.
doe ... Okay.
doe happy Alright, let's go! I'm bright eyed, scut tail'd! If she really is lonely, then we'll be best friends!
mommy That's the spirit! Now, since she doesn't have a lot of friends, just imagine that... She has a curse! One that makes her say mean things, when really she means nice things on the inside, okay?
doe Alright! I'll do it! Ding dong~! Bing bong~!
sadogato ...
doe shock Eep~!
sadogato I wasn't expecting visitors. Come, inside before the bugs come in.
doe ...
mommy Honey? Imagination, remember?
sadogato ...
sado glare ...!
sadogato ... Are you coming in, or did you come to decorate my porch?<br><b>Are you okay? I'm not so scary you changed your mind about helping me, am I?</b>
doe shock Whoa, I'm imagining it!
mommy shock I... I am too!
sadogato Are the two of you quite done gawking at me?<br><b>Please stop staring, I'm very self conscious about my image.</b>
mommy happy Right! Come on doeF.
doe happy Alright!<br>Whoa! It's so pretty in here.
sadogato This house is an ancient beast. Don't be ashamed to admit defeat to it.<br><b>I am so, so, so sorry about all the dust. I have no idea how to keep this place clean and I've never had maids before and the walls are made out sandstone?! How do you even clean that?!</b>
mommy worried It's... Fine? I just use some cleaning agents, water, and towels, so...
sadogato Take the matter however you see fit. Down the hall is the library, packed with tomes older and more valuable than you could possibly know. Do not tempt fate around them.<br><b>Oh my goodness, please, wherever you could start I would be so grateful. The library's full of old books though, and they're really precious to me but they're super fragile and covered in dust and I'd hate for one to break and cause a rift between us and-</b>
doe shock Wow... I'm really, really good at this!
mommy shock I think you're doing my share too, honey. Madame sadogatoF, don't worry, we'll be extremely careful. We'll focus on dusting for today, if you could find a place for the fragile things we've cleaned so that they can be moved out of the way, we'd appreciate it.
doe sparkle We'll be super careful!
sadogato ... Acceptable.<br><b>Oh my gosh of course! Oh I'll get right on that, can I get you two anything? Drinks, some snacks, some-</b>
mommy worried Okay doeF, slow it down just a bit.
doe happy Sorry mom!
t ...
mommy happy Oh my goodness... We've really livened up the... *Ahem*...
doe worried Ah, we should be going. Mom, you alright?
sadogato What's wrong with her?<br><b>Ohmygosh are you okay mommyF?! Is the dust too much? I don't have window screens because this stupid house has the most bizarre windows ever and they don't sell them in this size but I will totally uncover the windows and-
mommy worried Yes, I... *Ahem*... I'm sorry, I have the 'cough cough' disease, it's nothing too serious...
sadogato ...
sado glare ...
mommy We should re... Really... Huh?
doe Mom?
mommy shock My cough... Is gone?
doe shock What?! Miss sadogatoF, did you help my mom?
sadogato frown ... I'm tired. Leave. Both of you.
doe Wait! Miss sadogatoF!
sadogato frown ...
doe happy I'll absolutely be your friend!
sadogato shock ...!?
doe I heard you say, well, I imagined, right at the end there! Although my imagination sounds really different now... Anyways, I'll be your friend! Goodbye! Thanks for helping mom!
sadogato frown ...
mommy Good bye! Thank you for having us!
sadogato ...
sadogato happy ... What lovely-
mommy happy Oh, I almost forgot!
sadogato shock ...!
mommy Is tomorrow fine? There's still more we'd like to clean up if it's alright with you.
sadogato shock ... It's fine.
mommy Great! Okay, goodbye for real this time.
doe Mom, mom, what'd you hear when she said "it's fine"?
mommy Actually, I can't hear it anymore. What did you hear?
doe sparkle I heard "That's wonderful! I'm super excited to spend time with my new friend!"
mommy That's so sweet!
sadogato happy ...

		
		trans cancel; Finish
	`,},
	{index: `doeMorning-milf`,
	content: `
		
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town.
		t Well, everywhere except for milfF's yard.

		mommy Oof~!
doe Woo~!
milf You two alright? I'm not working ya' down too close to the bone, am I?
doe sparkle No way! I could do this for a whole week!
mommy shock M-maybe not a week, otherwise you'd end up as rickety brickety as mommy...
doe happy Or I could end up as strong as milfF! That'd be so cool!
doe sparkle Imagine me being able to lift you up in the air and spin you around,
mommy worried A-and then catch me, right? Gently?
milf I'm sure she'd be as gentle as a mayflower~!
doe happy Yeah! 
milf Actually, if you wanna take a break I was thinking about asking doeF if... Um...
doe Hmm?
milf worried W-well! You know the human who moved into town, right?
doe Yeah, playerF! 
milf W-well, now that his pheromones are starting to spread, well, um...
doe ...?
milf excited <i>What am I doing?! Am I about to proposition my best friend's daughter for unprotected sex?!<br>Okay, slow down, don't panic! This is a big moment, lots of things to consider! First, would it work?
doe ...? milfF? Are you okay? Is there something on my penis?
milf <i>Okay, it'd definitely work. She's like, the second most hung person in town... But is it necessary? Would it even do anything for my heat? I mean, there is a human in town...<br>No, there's no reason to jeopardize my relationship with them. I'm definitely not chickening out, if anything this is the mature lady thing to do, I'm super responsible!
mommy happy Hmm... Got any... Threes?
doe happy Nope, go fish!
milf <i>But think about what you're throwing away here! She's so cute! She so! Fucking! Cute! I mean, she's not human, and I could probably actually smother her with my ass, but that fucking DICK! That's meat! And I am starving!<br>But when am I not?! This won't satisfy me, I want a real connection! Am I letting my desire for kids of my own get warped and tangled by the pheromones and heat into some kind of perverted lust for a girl with a horse schlong?!</i>
mommy milfF? I think it's time for us to head home now.
doe I think she's playing games in her head. That's how I pass the time sometimes. Bye milfF!
mommy Goodbye, thank you for having us.
milf torogao <i>No! Stop being a FUCKING COWARD for five minutes! She is a woman, and she has a shaft I'd <b>beg</b> to snort the sweat off of! I don't care if it isn't as good as the human's, Momma's pussy needs stretching, fucking, pumping, all the dietary needs a of a slutty plap pig!<br>I've fallen this far, and I choose not to climb back up! We'll all be happier this way, and I know, I KNOW that mommyF is desperate for some more kids too. I'll make her a deal. We share doeF! Two prego sluts lapping at every inch of out little stud-baby's body, and when the human visits, we'll become three absolutely slovenly whores who could make actual pig women say 'holy shit you fucking sows need to-'...</i>
milf excited Eh? 
milf shock W-where'd they go?!<br>No, I missed my chance!<br>No, wait! If I cum now I'll come to my senses! I've got a second chance now! Thank you!

		
		trans cancel; Finish
	`,},
	{index: `doeMorning-nun`,
	content: `
		
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town.
		t Well, everywhere except for the local church.

		mommy worried Umm... Hello?
doe worried Should... Should I do the ding dong thing?
nun I wouldn't.
doe shock Gyah!
mommy shock Kyah!!!
nun worried This is the house of the Lord, ladies. Please control yourselves. The only loud noises in here should be us singing His praise!
mommy worried I am so, so sorry.
doe worried We'll apologize to the lord too.
nun It's 'Lord', actually. I could hear you leaving the L uncapitalized.
doe befuddled ...?
nun In any case, can I help you two?
mommy Ah, we're volunteer maids, and, well...
nun I see. I'm afraid I have no work for you here, every dust mote has been removed, and every stain here is precious history. If you'd like to stay to hear the church's message, though...
mommy Oh, no, I couldn't possibly impose. If we're not needed then we'll just head to the next building.
doe worried Aww, but the museum's closed right now, and the night lady is so grumpy in the mornings...
nun Please, I said I had no work, not that you are not needed. I understand you, mommyF, I know what it's like to feel useless, no matter how much of your own candle you burn for others.
mommy shock Um...
nun And you, doeF. I know what you're missing too. Tell me, what do you want to be when you grow up?
doe worried I'm already an adult!
nun So? Every year, every day, every second, you grow older. You're an adult? How much of your life have you lived? How much is still ahead of you. I'd say you can, fit your entire life so far, birth, childhood, teenage years, all of it. I'd say you have at least four more of those entire lifetimes left. So, how will you spend them?
doe confused Umm...
nun I was like the two of you, once. I told myself I wasn't lost, that everyone lacks direction. But if that were true, why was I so excited every time I found a new passion? A new calling? It was because I'd thought I'd finally found my path. I could finally tell myself 'I know where I'm headed', and know it's the honest truth. There are no lies here, not in the Lord's house.
mommy I...
nun You seek to help others, it brings you joy. I feel the same, speaking His word fills me with the warmth your child brings to you. More than cleaning, rather than sweat, and labor, I'd be truly grateful if you could spare me just a moment of your time.
mommy W-well, I guess...
doe sparkle Woohoo! No museum!

		
		trans cancel; Finish
	`,},
	{index: `doeMorning-fash`,
	content: `
		
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town.
		t Well, everywhere except for the local salon.

		doe Ding dong ding dong~!
mommy D-ding dong, ding dong...
fash Hellooooo~ Was that a mommy-daughter combo I just heard?
doe Yep! And we're here to clean up!
mommy Y-yes, right. 
fash Ah, it's just like that expression shopkeepF taught us. "I'm here to clean your cock", yes?
doe worried Wasn't it "clock"?
mommy worried No honey, he's remembering right. It was the same lesson where she explained d... "D-dick pampering".
fash Ah, still have the stutter when it comes to the lesson's words? I can't help but feel like her insistence on confidence only makes it harder to speak clearly.<br>Truth be told, girls, I don't need anything cleaned. Everything's exactly where I need it to be, and I'll be opening soon.
doe worried Oh...
fash But I could always use some help when it comes to practicing shopkeepF's lessons~
doe sparkle ...! We can help with that! I'm really good at the enthusiasm part, and mom knows all the words!
mommy shock W-well, I don't know about that.
fash sparkle Oh don't play coy madame! Please, come in. We can all practice together. Now, where to start? I suppose the same place shopkeepF always starts her lessons. "When on a human, it's not a penis! It's a...?"
doe sparkle Cock! Dick! Fuckmeat just for me~!
mommy worried C-cock, dick, f-fuckmeat... J-just...
fash happy Louder please mommyF! You've got to be a role model!
mommy angry C-cock! Dick! Fuckmeat j-just for me!
fash sparkle That's the spirit! Now, what do we say when we want to be bred!
doe sparkle Fuck me, fuck me hard, slam that cock into me!
mommy angry Fuck me, fuck me hard, slam that cock into me!
fash sparkle Perfect!

		
		trans cancel; Finish
	`,},
	{index: `doeMorning-mesu`,
	content: `
		
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town.
		t Well, everywhere except for mesuF's house.

		doe sparkle Ding dong~! Ding dong ding dong~!
mesu Whoa~! Two beautiful ladies at my door~! You wouldn't happen to be angels, would you?
mommy Ara ara~ No, we're just maids.
doe happy There's a lot of overlap though!
mommy So, does anything need cleaning in particular?
mesu worried Well, uh, the whole house, kinda...
mommy It's completely fine, the dirtier the house the more we're need-
mommy shock Goodness gracious!
doe sparkle Whoa, you live like this?!
mesu Sorry about the mess...
mommy angry No! The mess is fine, what's with all these junk food wrappers?
mesu I got sucked into a deadline, and, well...
mommy worried Please tell me you ate more than... "Instant Noodln", "Popato Chisps", and... "Sissy cum lu-"
mesu shock Whoops! That's not food. Lemme just, uh... Toss that. And yeah I totally ate more than this. I went out and bought some, uh... Fried snacks...
mommy angry ...
doe angry Mom! When you respond to vulnerability with anger, you only encourage people to close off!
mommy shock Oh! Goodness, I'm so sorry. Look, if you ever can't find the time to make a meal, just let us know and we'll be right there. Nobody should have to eat... Especially not a growing young boy like you.
mesu I'm... Uh... An adult, ma'am.
mommy panic Oh... Right. Sorry, it's just, well... I should really make something to eat!
doe sleep Don't worry about it, I'm sure you'll grow up a little bit more!
mesu <i>... Why does that sting in a not pleasurable way this time?</i>H-hey, by the way, what you said earlier...
doe sparkle Smart, huh? Mom would tell herself that a lot when I was a kid.
mesu teasing Oh, so like a week ago then?
doe happy Haha, yeah!
doe angry ... Wait!

		
		trans cancel; Finish
	`,},
	{index: `carpenterMorning-doe`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in mommyF's house.

		carpenter sleep Zzz...
doe sparkle Hehe~<br>You can't escape~
mommy doeF, please don't bother them.
doe worried Shh. I'm just putting on a blanket.
mommy worried Oh, sorry. Alright, let's leave them be.
doe happy 'Kay. Sleep tight~
carpenter Zzz ...
carpenter happy Mmm... I'll fix their cabinets today too since I'm already here.
		
		trans cancel; Finish
	`,},
	{index: `fashionistaMorning-doe`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, but the local boutique is buzzing with energy. 
	fash sparkle Oh my knots and garters, new customers!
	mommy worried ...
	doe Hello~
	fash happy Why hello there~! Aren't you just the cutest bundle of joy today. Are you two here for a makeover?
	mommy happy J-just her, I'm just here to-
	fash Oh no no no, it's only one of you two, it's you, madame. I can plainly see that doeF would look even more perfect with my handiwork on her, but she's not lacking the confidence a good look would give you.
	doe sparkle See mom? He thinks you should get one too!
	mommy shock W-wait, hold on. It'd be a waste to-
	fash Oh honey, I see that insecurity in every step you take. You clearly don't recognize how stunning you are. Honestly, you'll be a tough customer, but only because it's so hard to raise a ten to an eleven.
	mommy worried P-please don't make fun of me like that. I'm well past my-
	fash doeF, babycakes, is your mom old?
	doe happy ...? No.
	fash Decrepit?
	doe shock No!
	fash Disgusting?
	doe angry No!!! She's beautiful!
	fash And mommyF, is your child stupid? Blind? A liar?
	mommy H-how dare you?! No!
	fash sparkle Perfect! Then you have no choice but to take doeF at her word that you're gorgeous, and you've got no room to argue! Unless you're saying she's wrong?
	mommy shock W-wait-
	doe angry I'm not wrong, she's super pretty!
	fash Absolutely! Now, mommyF, you sit on down and don't you dare move one muscle. doeF, would you be a dear and help me pick a color scheme for her?
	doe happy I'm already a deer! 
	fash ... Yes you are! 
	mommy worried Oh... How did I get wrapped up in this?
		
		trans cancel; Finish
	`,},
	{index: "hyenaMorning-doe", content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, aside from a trio of townsfolk chattering the early hours of the day away.
		hyena And so-
		doe sparkle Whoaaaa!
		mommy sparkle That's amazing!
		hyena worried Y-yep!<br><i>These two are really eating this up, they're barely letting me finish my sentences...</i>
		doe joy Tell us more, tell us more!
		mommy worried If that's alright, of course. We don't want to impose.
		hyena amused Nah, it's fine. I could talk about how robots and how they work for hours.
		doe sparkle Really?!
		hyena shock <i>Shit, she's calling my bluff!<br>hyenaF, you idiot!</i>
		mommy sparkle Yes, please, tell us more! You said they could combine?
		hyena worried Y-yeah!<br><i>She's so excited too... I can't just let them be disappointed...!</i>
		hyena blush Okay, so, the two robots go right up to each other, this is called "docking", or "frotting" if they're guy robots...
		trans cancel; Finish
	`,},
	{index: `mesuMorning-doe`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town except for a local census data collector, hard at work. 
	mesu And so that's why I need the details!
	doe sparkle Ohhh~!
	mesu sparkle You finally get it?!
	doe happy Nope. But you need help, right? So I'll help you!
	mommy Is there anything I can do?
	mesu amused No, but thank you for offering. This dataset is just cocks.
	doe Did you need help measuring yours too? Since it's so tiny?
	mesu horny ... M-maybe don't-
	doe It's super small and cute! Your penis and your tiny balls are smaller than one of my balls!
	mesu blushy Y-yes... Your nuts certainly are... Massive...
	doe Do yours gurgle too? Mom says that's them being good factories! Do you want to listen?
	mesu blushy Y-
	mommy shock doeF! Please, be careful with your language. Some people feel bad when you point out they have a small penis.
	mesu blushy It's really-
	mommy happy Ah, and by the way, it's not 'tiny', the proper name is 'micropenis'.
	doe sparkle Whoa! It's got a fancy name? Hey, does mine have a fancy name?
	mesu forced Schlong~
	doe sparkle Schlong?! That's so cool! Mom, mom, take a look at my schlong next to his micropenis!
	mommy happy Hehe, I'm glad your having fun dear. It does look much larger when compared to mesuF's. Not that there's anything wrong with that, of course.
	doe worried Well, I guess you can't win swordfights, or showoff contests.
	mommy shock doeF, don't make assumptions like that! While I'm sure mesuF doesn't play those sorts of games, I'm sure he'd be perfectly...
	mommy worried W-well, I'm sure someone would appreciate it at that size.
	mesu torogao NGHHH~!
	doe shock mesuF? Are you okay?
	mesu broken Guh... Uhuh... Sorry about the mess...
	doe worried Mess? What mess?
	mommy worried Did you spill something?
	mesu forced Gh...<br><i>Do they not even register it because of how small it was? This place... This place is seriously dangerous to a maso like me~</i>
	
		
		trans cancel; Finish
	`,},
	{index: `shopkeepMorning-doe`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, and the Ivy & Oak General Store's door opens for her first customer of the day. 
		t *DING A LING*
		shopkeep Welcome, welcome! What can I get for you today?

		doe La la la~! Hi shopkeepF!
		mommy Good morning, shopkeepF.
		shopkeep My favorite mom and daughter customers! But hey, be honest, are you two sure you aren't sisters?
		mommy Hehe~<br>You're incorrigible~~
		doe Do you have the new dresses in stock?
		shopkeep You know it! Now, they came with a few accessories, something called... Pan... Ties?
		mommy What are those?
		shopkeep Apparently you wear them over the crotch?
		doe sparkle Ooh, ooh, I wanna try them!
		shopkeep Sorry squirt, they're meant for pussies, and I don't mean cats. You've got what's called a 'monster horsecock', you're totally tear them just by putting them on.
		doe worried M-monster?
		mommy angry shopkeepF!
		shopkeep shock No, no, don't be sad! It's a human expression.
		shopkeep happy Basically, in human culture there are villains known as 'bitches'! And monster horsecocks are also know as 'bitchbreakers' that turn villains into sloppy messes!
		mommy happy Eh? Isn't bitch the word for-
		shopkeep happy Yeah, but there's no relation. Anyways, it's a huge compliment!
		doe sparkle Wow, really?! I have a bitchbreaker?
		shopkeep sparkle Of course you do, squirt! Your cock is gigantic, and you've got a pair of fat hanging nuts alongside it!
		doe sparkle Whooooa~! I wanna use it! How do I turn bitches into sloppy messes?
		mommy worried Hah... Human language sure is colorful... If we could maybe get back to talking about the dresses?


		trans cancel; Finish
	`,},
	{index: `wolfMorning-doe`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		eval writeEvent(data.player.currentScene);
		trans cancel; Finish
	`,},

	{index: `cancel`,
	content: `
		eval unencounter(data.player.currentCharacter);
		eval changeLocation(data.player.location);
	`,},
]

var eventArray = [
	{index: "doe1", name: "Dinnertime - Start", image: "doe/doe1-2",
	content: `
		mommy panic Eh?! You invited... Now? Right now?!<br>Oh, but the place is a mess!<br>A-and the pie... What about allergies? 
		doe sleep It'll be fine! Anyways playerF, c'mon. I got out another one for you but it's all squeaky and wobbly. You can have mine, just for today though.
		player worried Right, sorry to intrude.<br>I can always come by another day.
		doe pout No way! The timing's too perfect, mom just got finished cooking!<br>And that smell test before was to see if all that talk about human pheromones 'driving us coco' was just shopF exaggerating.
		mommy panic Ah, b-but...
		player worried Hold on, that was a totally different situation!<br>Taking a quick sniff in the doorway, compared to sitting in an enclosed room over dinner...<br>Plus, it seems like it's stressing out Miss mommyF...
		mommy panic Ah! I didn't mean to suggest you're a bother!
		doe smile It'll be fine! She's always saying I need friends my age.<br>Kinda hard when the whole town skipped a generation. Every other lady in town is in her-
		mommy angry doeF!<br>Not another word. You know folks like mayorF and nunF are especially sensitive about their age!
		player love Hoh, the town's full of older ladies...<br>Any they have fluffy tails too...
		doe sleep Anyways, I bet you're feeling lonely, and I bet your pheromones mean you can't have a nice family dinner to fix that!<br>Don't worry, we're tough! We can handle whatever happens, so come on, sit down, and let the cozy vibes flow through you.<br>Did you already have lunch?
		player tired Well, I don't usually have actual meals.<br>Whenever my stamina gets too low I just scarf down whatever fruit I find on the ground.
		doe confused ... Seriously?
		mommy scared Oh dear... You... You don't have a reliable source of food?<br>Next you'll tell me your house doesn't even have a kitchen!<br>doeF is right, please, have a seat!
		t You're quickly ushered into a whole room dedicated just to eating. Like some kind of 'dinery room', or something.
		im doe1-2
		t And outside of the large portraits, one of which prominently display's doeF's plump butthole, it's quite classically cozy.
		mommy blush Please, eat anything you like. You can have the first slice of pie if you want it.
		doe amused Trust me, you won't be leaving until you're totally stuffed!<br>Oh, wait, you're not a carnivore, are you?
		mommy happy No dear, remember what the madame mayor said? This human's an omnivore.<br>But still, it's perfectly fine to have tastes. We don't judge here. If there's something else you'd like I could try making it.
		doe happy Sooo? How's the town?<br>You like it, right? It can be a little boring all by itself, but the best part of Syrup Town is it's full of people! And people are fun!<br>Are you fun?
		mommy worried Let's not badger our new guest too much.<br>But... If you'd <i>like</i> to talk, we'd be happy to listen.<br>It must be awfully scary to be out in a new place all on your own.<br>Do your parents live outside of town? Do you miss them?<br>Have you made any local friends yet?
		player panic Uhhh... One thing at a time, please!<br>Let's see...
		mtrans doe1a; Talk about your family !flag player doe1a;
		mtrans doe1b; Ask how mommyF had doeF !flag player doe1b;
		mtrans doe1c; Confide about being a human troubles !flag player doe1c;
		mtrans doe1Finish; Nothing else to discuss ?flag player doe1a; ?flag player doe1b; ?flag player doe1c;
	`},
	{index: "doe1a", name: "mini", image: "doe",
	content: `
		eval addFlag('player', 'doe1a')
		player tired Hmm, my parents...<br>Well, lemme think.
		im doe1a
		doe sparkle Ooh! Are they here? Will they visit?
		mommy happy Please, take your time.<br>Trying to describe the people important to you can be hard.<br>You must have some stories about them.
		player joy Oh, have I got stories!
		t ...
		player sleep And so they said "The bandolier's for snacks, not dynamite! These are red crayons, want one?"
		mommy scared ... I... What incredible storytelling... You were so vivid, so detailed it feels like I can actually picture them in my mind...
		doe scared Me too...! Actually, it's like I can see them!<br>And they can see me...!
		player sleep Ah, yeah. One of them said they were actually a literal demon, and that picturing them in your mind gave them access to your soul.<br>But was that mom or dad though? Man, I sure am forgetful.
		mommy laughing Haha~<br>What a silly joke. It's wonderful that you have such a strong sense of humor.<br>Now, while it's lovely to hear about your family, doeF and I would both love to hear more about you.
		doe scared I didn't... People <i>eat</i> crayons?
		player sleep Of course!<br>Well, I kicked the habit. Let's see, what else is there to talk about...
		mtrans doe1a; Talk about your family !flag player doe1a;
		mtrans doe1b; Ask how mommyF had doeF !flag player doe1b;
		mtrans doe1c; Confide about being a human troubles !flag player doe1c;
		mtrans doe1Finish; Nothing else to discuss ?flag player doe1a; ?flag player doe1b; ?flag player doe1c;
	`},
	{index: "doe1b", name: "mini", image: "doe",
	content: `
		eval addFlag('player', 'doe1b')
		player befuddled Sorry if this is rude, but I have to ask. How <i>did</i> you have doeF? I thought people here couldn't breed.<br>I thought mayorF gave me a house here because nobody could have children.
		mommy panic Ah, that's-
		doe worried Mom doesn't like talking about it.
		mommy worried No, it's important...<br>It's not impossible, just... Very difficult. And unpleasant.<br>In spring there's a ritual, every year...
		doe worried There's a special kind of drug too. The honeybees gather a special flower, grind it up and put it up your nose.<br>Then everyone puts on a blindfold and tries not to think about-
		mommy crying It's ineffective too! All that together... Children are extremely rare here in town.
		doe pout And I'm not one of them! Not anymore!<br>Mom's been pampering me my whole life, shopF says that's why I'm so short!
		mommy panic Ah, dear, please calm down... Nobody's saying you're a child...
		im doe1c
		doe angry Oh? Who still calls me their 'little girl'? And even if nobody's saying it, everyone's thinking it!<br>Whenever we stand next to each other, I look so tiny! I'm not even the shortest person in town! But nobody thinks mesuF is a kid, because he's not standing next to the biggest boobie lady in town!<br>And it doesn't help when people talk about your humongous boobs, you keep saying mine will grow soon, but when is soon?!
		mommy panic Ah... W-well...
		doe pout I swear, if it weren't for my gigantic penis, nobody would think I'm old enough to do adult things.<br>If I'd been born a boy... Men measure adulthood by penis size, I bet everyone would look at me like a super cool macho dude!
		player happy It is pretty big. Imagining that, on mommyF's body...
		doe smug Right! And there's a chance for that now that you're here, playerF!<br>Mom said her boobs grew even bigger when she got pregnant. And your pheromones help with that, right?
		player worried Ah, so...
		doe panic Err, wait, that's not the only reason I invited you!
		player worried I'm not doing all that much...
		mommy happy Don't think like that. Everyone can be a gift to others just by being alive.<br>That's just extra true in your case.<br>I promise, everyone in town is happier because you're around. The world's a better place with more people in it.
		doe worried Yeah. Sorry if I made it seem like we only care about your sweat 'n stuff.<br>It's gotta be lonely, being away from your family, in a strange new place...<br>Anything we can help with? Anything you need to get off your chest?
		mtrans doe1a; Talk about your family !flag player doe1a;
		mtrans doe1b; Ask how mommyF had doeF !flag player doe1b;
		mtrans doe1c; Confide about being a human troubles !flag player doe1c;
		mtrans doe1Finish; Nothing else to discuss ?flag player doe1a; ?flag player doe1b; ?flag player doe1c;
	`},
	{index: "doe1c", name: "mini", image: "doe",
	content: `
		eval addFlag('player', 'doe1c')
		player tired I guess, to be honest, it's hard to make real friends here.<br>Everyone's excited the human's moved to town, they wanna make friends with the human, they wanna mate with the human.<br>But what about me? If I were a dog or a pig instead of a human, would anyone even notice me?
		im doe1b
		mommy shock Oh my! That's such a sad thought!<br>Of course we'd notice you, I promise!
		doe joy Definitely! I know everyone in town. The fashionista girl who's like a sister to me, the cool punk lady who owns a motor bicycle...<br>The only ones I haven't befriended <i>yet</i> are the magic fortune teller and the nun going through her... I think mom called it a 'midlife crisis'?
		player love Hoh... 
		doe confused You sure do like older ladies...
		doe sparkle Hey, you should marry mama! I'd love to have a little brother or sister!<br>Y'know, when I was born, she said she knew right away I was a girl. How do people tell, anyways?<br>Would I be able to tell on sight too?
		mommy scared Awawa-<br>Wait, I know that sounds-
		doe joy  Plus, she's always taking super detailed notes at all of shopF's human classes!
		mommy panic That's more than enough, doeF... I'm sure playerF would be interested in someone their own age...
		doe surprise Ooh, like me! Then you could play around with mama all you want!<br>I heard from shopF actually, you really like fluff, you could fluff the both of us!
		player Ah, the dream...<br>Wait, human classes?
		mommy blush Y-yes, shopF holds them every few days. We study example textbooks on how to make hum-<br>Well, you, I suppose, more comfortable here.
		doe tired I can never keep up with them. I like happy stories, and I prefer the early parts of the textbooks when the characters are just enjoying life in the city, or going to school.<br>Then everybody starts having sex, and like, booooring.<br>Is it getting a little warm in here?
		mommy pent No, I don't think so, dear.<br>playerF, are you comfortable?
		doe awe R-right! Yeah, not warm in here at all, haha.<br>So, anything else you wanna talk about? Family, maybe stuff that's hard to get used to here in town?
		mtrans doe1a; Talk about your family !flag player doe1a;
		mtrans doe1b; Ask how mommyF had doeF !flag player doe1b;
		mtrans doe1c; Confide about being a human troubles !flag player doe1c;
		mtrans doe1Finish; Nothing else to discuss ?flag player doe1a; ?flag player doe1b; ?flag player doe1c;
	`},
	{index: "doe1Finish", name: "mini", image: "doe",
	content: `
		eval removeFlag('player', 'doe1a')
		eval removeFlag('player', 'doe1b')
		eval removeFlag('player', 'doe1c')
		player tired Honestly, I think I'm going blank. Maybe I'm running low on energy?
		mommy pent Hmm, maybe... Feel free to focus on... On eating.
		doe pent Y-yeah. Just... Enjoy mom's cooking...
		player confused Hmm? Do you two smell that?
		doe forced It's... Nothing!
		mommy blush We're fine!
		t *THUMP*
		player shock Wah! What was that?<br>Oh, I dropped my fork, sorry, I'll-
		doe forced W-wait, I'll-
		player surprised Eh?!
		t Diving beneath the table, you're hit by a solid wall of hot air so moist and thick you're almost surprised the fork isn't floating in it.
		im doe1Finish-1
		t The source of the earlier thump is made clear, doeF's ginormous schlong bumped against the table, all while squirting like a leaky hose, and...
		im doe1Finish-2
		t mommyF's pussy is so plump you can't see her clitoris, but it's certainly just as erect as her daughter's cock beneath those pillowy folds. She's squirted almost as much as her daughter has!
		player shock Huh?!<br>Hey, you two said you were fine!
		player pout I knew this was way too much exposure for our first meeting!<br>And in an enclosed environment too! You two must be boiling like this!<br>This is like a hotbox of sex pheromones for you two, how long have you two been pretending not to feel anything?
		doe forced W-wait!
		mommy forced We didn't... Ghh! Want you to feel unwelcome!
		player pent Geez. Know your limits!<br>I'm leaving, let's have an open-air picnic or something next time.
		mommy torogao Ghgg~<br>Y-yes, next t-time...
		doe pent C-come... Back soon...<br>Y-yeah... Open air is... Good idea.
		player amused ... I'll take the rest of the pie, though.<br>Yoink~
		finish
		eval writeSpecial("You unlocked a new event in the gallery!") !flag player gallery;
	`},
	{index: "doe2", name: "park", image: "doe/doe2-4",
	content: `
		player tired Am I seriously checking in the neighborhood she lives in?<br>I mean, I guess there's a park over there, basically down the street from their house.<br>Not much point in a playground in a town without kids, but there might be a bench or something...
		player pent Mrgrgr... It sucks to think about taking a break when doeF could be in trouble, but if I walk any farther I'll start burning the fat in my thighs...<br>Completely unacceptable. No, I'll just-
		im doe2-1
		player shock Eh?! doeF?
		doe love playerF...?
		player pout What the heck, you're basically just a stone's throw away from-
		player befuddled Wait... Are you okay?
		doe forced N-no...! Something's wrong!<br>Today the wind felt nice... <i>Really</i> nice on my, y'know...<br>So I started touching it! Rubbing it, j-jerking off, like shopF said we'd probably have to, and it felt good at first, but... It's not...
		player confused Hmm. Strange.<br>Here, lemme try to un-gum-up those pipes of yours.
		im doe2-2
		doe forced Ghh! I t-tried rubbing it, but now it's itch... Itching...
		doe love But... Your hand feels... Hot...!<br>I feel... It's rising!
		player sparkle Alright! I guess your prostate just wasn't strong enough for this absolute unit of a beef rod.<br>Wait a second...
		player angry It's still just precum!<br>Alright, this'll probably be way too intense for you, especially since it's your first time, but I've got to empty those balls!
		doe crying I'm... Sorry...!
		player pout Don't worry! I'll handle everything!<br>Good thing you're so light, this'll take a bit of finagling.
		im doe2-3
		doe awe Eh~?!
		player sleep You'll be fine, promise! At least this way I don't have to throw you into anal right away. 
		im doe2-4
		t As you thrust forward, something inside doeF's mind begins to take shape.
		t Despite the civilized, well-mannered life she's lived so far, deep down her species' biology still respects the law of the jungle.
		t Her massive, bloated orbs, stuffed with cum are whispering, no, <i>screaming</i> into her mind to find a mate and <b>BREED</b>. But another part of her, pinned under you as her heart races is begging to surrender.
		im doe2-5
		doe forced GHHH~!!!
		t The two parts clash. Now that she's in heat she has the instinctive desire to challenge others for the position at the top. A desire very quickly being quashed, smushed, and crushed as the relentless *PLAP PLAP PLAP* sound of balls on balls carries on the wind.
		doe love Hoh! I... It's...!<br>I'm gonna... Lose...!
		player sparkle I can feel it! Your nuts are really churning!<br>Just let go, I'll take care of you!
		doe love Oh... Kay...
		t Her voice drops to a whisper as sudden wave of relaxation passes over her. Before another wave of-
		im doe2-6
		doe torogao GHHHHHHHGGG~!!!
		t doeF's mind, body, and especially her overworked testicles admit defeat, completely coating her own face in thick, steaming cum.
		t Six, seven, eight ropes thick and sticky plaster everything they touch, what a mess! All while her previously silent prostate gland comes to life.
		player joy Alright! Good girl, great work, just let it aaaaall out!<br>You'll have to figure out how to handle your urges on your own eventually, but for now I can-
		doe orgasm GHOUHHH~! No, no! You! I want... You! Breed! Meeee~<3
		player sleep Sure, sure, that's what all the girls in heat say.<br>Okay, I can keep plapping, let me know when you can't take anymore, okay? Your mom's worried about you.
		t ...
		mommy crying Oh, thank you, thank you!
		player amused It was no problem at all.
		im doe2-7
		player worried Well, actually, cleaning her up was a bit of a hassle.
		mommy worried Hmm? Did she get in a mess?<br>She is a little sticky. I don't see any rags around here, what did you clean her up with?
		player smug ...
		mommy happy Well, either way I'm so glad you're safe, doeF. I was worried sick!
		doe broken Ghohh... Love... You...
		mommy amused Oh you... I love you too, dear. Let's get home and get you changed, you sweat right through your dress!
		player sleep Another day saved, thanks to Syrup Town's one and only human!
	`},
	{index: "doe-mommy-morning1", name: "park", image: "doe/morning1-1",
	content: `
		t *Gurgle*
		im morning1-1
		doe forced Ghhh! It's... Happening again!<br>Just like when playerF...
		doe love playerF...
		t doeF's thoughts drift to you, and while the incessant begging of her fat nuts isn't getting any quieter, they feel almost... Distant.
		t Instead, it's some other craving inside of her that has her attention.
		t ...
		t *Splsh*
		im morning1-2
		mommy forced Ghhh!<br>Again? I just cleaned that spot!<br>What's happening to me?
		mommy pent This is like that day, but even more intense...<br>Am I ready for another child?<br>I remember being terrified back then, but-
		mommy horny Hmm! What... What's this fluttering in my chest?!<br>I feel... Happy?<br>I... I wonder if playerF is awake yet...
		eval unlockScene("mommy", "doe-mommy-morning1"); !flag player gallery;
	`},
	{index: "doe3", name: "Visitor", image: "doe/doe3-1",
	content: `
		player tired ... Huh? Another visitor already...?<br>Who iiiis-
		doe love Me, it's me!<br>playerF! It's happening again!
		player pent Oh, doeF. Did your mother make it back home alright? After her massage she must be as worn out as I am.
		doe She was here...?<br>She... She went to sleep after she got home...<br>But I need your help!
		player tired Alright. But my good arm's still tired, and my parents taught me to never give someone a southpaw handjob.<br>So, I guess penetration is the only-
		doe blush Breeding?! Can I have your babies?!<br>Oh, my heart and tummy feel funny! Really, really funny!
		player amused ... You absolutely are your mother's daughter.<br>Alright, I guess I didn't get you all the way empty last time.<br>This might be rough, and you won't actually get pregnant, are you alright with that?
		doe love Breeding...! Rough...!
		player tired Alright, alright, come in before that hose pumps out enough precum to erode my doorstep.
		t ...
		t *CLAP* *CLAP* *CLAP*
		im doe/doe3-1
		doe forced NGHHHH~! Breeding, breeding!<br>All those stupid faces the textbook characters make are real!
		player excited Yes, yes, actual sex. Good girl.<br>B-but focus, you gotta... Clench, yeah, just like that...<br>You have such... Huge balls... So you need insanely strong kegels and prostate muscles if you... Ghh! If you wanna cum by yourself!
		doe love Nhoooo~!  I don't wanna...! I want... You~! 
		im doe/doe3-2
		doe torogao NGHHH~<3
		player forced Ghh! There! Good, I can... Feel your prostate clenching! Focus on this feeling, don't forget it!<br>Practice it whenever you can, okay?
		doe broken Ghouhhh~<br>Think about... Cumming... All the time...
		t ...
		im doe/doe3-3
		doe afterglow He... Hehe... <br>Gonna be... Gonna be a momma~<br>Jusht like mommy~
		player tired Uhuh, definitely. Tell mommyF I said hello, stay on the path, and stay safe, alright?
		player pent Hooh... I'm completely and totally knackered. I'm gonna sleep straight till morning!
		player amused Still, the family resemblance is way too strong! Wacky how they look so different though. I wonder if doeF has room to grow?<br>doeF, with mommyF's body...
		player tired ... I am way too tired to be horny right now.
	`},
	{index: "doe4Start", name: "Threesome - Start", image: "doe4-0-3",
	content: `
		define duo = dual sp1 doe; sp2 mommy;
		player tired ...
		t *KNOCK* *KNOCK* *KNOCK*
		player sleep ... Surely it's just a dream.<br>They have their own lives, surely it's not doeF or mommyF <i>again</i>. I mean, what are the chances?
		doe forced playerF! Please, please be home! Let me in! I NEED your cock!<br>My balls won't stop gurgling, and something inside of my butt won't calm down unless you're nearby!
		player tired ... That <i>could</i> just be a hallucination.<br>Maybe carpenterF's at the door, here to loan me a new pillow and let me get back to sleep.<br>Let's see.
		player sleep Who iiii-
		im doe/doe4-0-1
		doe horny You answered! Thank you, thank you, thank you thank you thank you!<br>My mom was baking something, and when she bent over my brain started overheating! Then I thought of you, and-
		player amused Here, come in, I'll get the door. Try not to drag your balls over too much stuff.
		player curious Now, wait. Your brain got all hot when you thought of your mom?
		doe panic Is that bad?! Those huge, wobbly thighs, and her... Her big, gigantic boobs...<br>But, you're the one I-
		t *KNOCK* *KNOCK* *KNOCK*
		doe surprise Oh, I'll get it, I'll get it-
		mommy panic playerF! Please be home! I NEED your c-cock!<br>My pussy and womb won't stop throbbing, and your hand won't be enough this time! I'm going so crazy I'm even fantasizing about letting my own daughter fuck me! If-
		im doe/doe4-0-2
		duo scared ...
		player pout Hey! Don't answer other people's doors!
		doe scared S-sorry... Force of... Habit...
		mommy scared She... She's usually the... One to...<br>doeF, baby, how much of that... Did you hear?
		doe panic I...
		player happy Ah, no need to be embarrassed. Just before she got here she was talking about how arousing she thought your plump thighs and massive boobs were!
		duo shock ...!
		player sleep Man, I really lucked out though. Another marathon like yesterday would burn so many calories these thunder thighs of mine would turn into chicken legs!
		player sparkle So, go on.<br>You two kinda barged in, but I'll forgive you if you say some other things you two like about each other.<br><i>And if I'm lucky, they can exhaust each other!</i>
		mommy love Well... I... Every time I see those overstuffed balls of hers swinging from side to side... And especially when they aren't swinging, when they churn and clench up just before she squirts onto the floor...
		doe love And her huge, soft boobs stretch her dresses so much I can see her big nipples right through them...<br>And that... That <i>mommy muff</i>...
		player amused You see how effective communication is? It seems to me like this problem has a super easy solution!<br>You two came over for my pheromones, but you have each other!
		duo love ... No. Not really.
		player confused Huh?
		mommy pent Of course, I absolutely love that her... <i>Huge</i> horsecock is practically oozing precum all the time...
		doe pent And now that I'm in heat, every time I see her big, puffy pussy my heart skips a beat...
		mommy blush But when I think about who's children my womb aches for the most...
		doe blush And when I think about who's meaty thighs get my heart beating the fastest...
		im doe/doe4-0-3
		duo It's you~<3
		player befuddled ... Why do I suddenly feel like I'm surrounded by hungry carnivores?<br>You're both deer, right?
		doe excited Well, I wouldn't mind tasting you~<br>B-but, really, I'd rather be your wife... O-or girlfriend!
		mommy blushy W-we don't both need to be your wives, if you want to be monogamous I'd be okay just... Cleaning up...<br>I'm past my prime anyways...
		doe annoyed Hey, don't talk about my mom that way, mom!
		player pout Yeah! Older ladies are precious and very in-demand!
		mommy panic Eh?! Are you picking me?
		doe shock W-wait, I'll be an older lady too someday!<br>shopF said the sweets she sells me are sure to give me a dynamite body!
		mommy angry So she <i>is</i> still giving you those!<br>I keep telling her caffeine isn't good for a growing girl!<br>I mean, I don't mind you staying short and cute forever, but...
		player sleep That's a myth, actually. Caffeine doesn't affect height.<br>But I'm glad we're relieving the tension in here. It's good to let your feelings out.<br>And speaking of relieving the tension, I should probably make a choice here.
		duo love ...?
		player confused <i>Hmm. Both of them want me. And they both need my help ASAP.<br>I didn't really come here planning on being a family *man.<br>Brain? What should we do? Who do we pick?</i>
		mtrans doe4-0; Both
		mtrans doe4-0; Both is good
		mtrans doe4-0; Both, of course
	`},
	{index: "doe4-0", name: "mini", image: "doe4-0-3",
	content: `
		player befuddled Right, obviously, but which <i>flavor</i> of both?
		doe confused ... Are you talking to me?
		mommy sleep No honey, remember what shopF taught us in human class? Those 'thought bubble' from the educational textbooks?
		doe surprise Ohhh! Right, sorry. I wish I could talk to myself.<br>Wait, when *he said 'both'-
		player pout Shh, I missed what my brain said.<br>Run that by me again, what flavor of both?<br>I say we go with a sandwich, but who's the filling?
		mtrans doe4-1; doeF in the middle
		mtrans doe4-2; mommyF in the middle
		mtrans doe4-3; You in the middle
	`},
	{index: "doe4-1", name: "mini", image: "doe",
	content: `
		define duo = dual sp1 doe; sp2 mommy;
		player sleep Alright, I've made my choice. mommyF, lay on your back.
		mommy surprise Oh! M-me? Really?
		doe panic R-really really? You don't like me?
		doe surprise W-wait! If you marry mama, you'll be like... My dad!
		mommy love Hoh... That would be... Okay, I'm ready...
		player amused Good. Now, doeF, lay on top of her, on your stomach.<br>We're making a sandwich, and doeF, you're the filling!
		duo surprised Eh?!
		t ...
		mommy love Hoh... Alright...
		doe love We're... Really gonna...
		im doe/doe4-1-1
		doe awe Mggh~<br>So wet... Like a hug...<br>Mommy's... Pussy!
		mommy forced Ggh~! Y-you're... Even thicker than playerF's entire hand!<br>Incredible!
		doe perverted Mmmh~<br>playerF... Are you... Gonna pound my butt again?
		mommy love D-did *he really? Did you let *him mate with you... Back there?
		doe blushy I begged *him to! It was the most wonderful feeling ever! A-and-
		doe torogao GHH~! I can't hold back anymore!
		im doe/doe4-1-2
		mommy pleasured Hoh! My own daughter's... Fat, veiny horse-dick!<br>You're... Huge! My womb doesn't need to descend at all! You could donkey-punch my cervix at half-mast!
		doe forced M-mama! Where'd you learn to talk like that?! And d-don't m... Move! You feel... So tight, and w-warm! I don't wanna grow any b-bigger and hurt you!
		mommy orgasm Ghouhhh~<3 Fuckkkk~!<br>D-don't worry, baby, mommy wants... <i>Needs</i> this!<br>These p-past few days, ever since playerF fell into our lives, my brain's gotten... Dirty!<br>Mommy would be... Ghh, fuck, I'm grooling just from my baby girl's cockhead kissing my cervix!<br>Mommy would be really happy if you pounded the FUCK out of her tummy!
		doe forced Ghhh! D-don't say that! Don't talk like that!<br>My mom's nice, a-and kind! Don't... Don't dirty her mouth with words like those, you... W-whore!
		mommy Ghouuuhhh~!!! Fuck, I felt you throb all the way from the base! My womb didn't put up any resistance at all and now mommy's belly has your precum inside~!
		duo pleasured Houhhhh~<3
		player sleep Ah, family bonding. How lovely. I don't even need to do anything, I could even rest while they fuck like rabbits.
		player love But... Nothing's more of a turn on than a true lovey-dovey relationship!
		im doe/doe4-1-3
		doe forced Ghh~!
		mommy love doeF's... My little girl...!<br>What does it feel like?<br>doeF, look into mommy's eyes and tell me...
		doe love Hoh... Hohhhh~<br>It's... Too big! *He'll break me! It's... Like I'm... Like it's splitting me in half!
		mommy excited Let it. Make it feel good. Thrust into mommy's cunt and let the pleasure make your own pussy tighter for *him~
		doe torogao It's... Khhh, too much~! It's hitting that spot, and my... My dick is melting too!<br>My brain is... Getting funny, I'm... Gonna cum already!
		mommy flirting Shh, shh, that doesn't matter right now. Focus on *him.<br>You're a girl, just focus on pleasuring the cock inside of you. Every vein, every inch~<br>You want *his babies, right?
		doe orgasm Ouhhhh~! Babies, mating, matinggg~!!!<br>I wanna be a mommy toooo~<3
		im doe/doe4-1-4
		mommy perverted Mmmhhh~! So much... Your girlcum's so thick~<br>Are you trying your hardest?<br>Are you making playerF happy, so *he'll cum too?<br>Can you get your tummy all stuffed, just like mommy?
		doe ahegao Ahah~! Ahaha~! Yesh~! I'll be... Like mommy~!<br>Cumming~<3<br>I'm cumming~<3
		mommy perverted Mmmhh~<br>I can feel your tummy press against mine~<br>I can feel *him cumming inside of you, it's tricking my womb into thinking it's human cum I'm getting filled with~<br>Feels... Gooood~<3
		player pent Hah... Hah...
		t ...
		t As impossible as the idea of satiating the insatiable seems, after more mating, and position switching, and everything else under the sun, it's finally time to...
		mtrans doe4Finish; Continue
	`},
	{index: "doe4-2", name: "mini", image: "doe",
	content: `
		define duo = dual sp1 doe; sp2 mommy;
		player sleep Alright, I've made my choice. doeF, lay on your back.
		doe shock M-me?! Really?! Oh, golly...!
		player amused I told you already, I'm picking both of you!<br>We're making a sandwich, and mommyF, you're the filling!
		duo surprised Eh?!
		t ...
		mommy love Hoh... Alright...
		doe love We're... Really gonna...
		im doe/doe4-2-1
		mommy forced Mghh~<br>I've never... Done anything like this before!
		doe awe It feels... Strange!<br>Like playerF's hand... But tight all over!
		player sleep Well, that's how anal sex is.<br>Usually.<br>Alright, take some time to get acclimated to-
		im doe/doe4-2-2
		mommy orgasm Ghouhhhhh~
		doe forced Whhhahhh~! It's like... I'm being sucked in!<br>Anal sex is incredible!
		player surprise Holy cannoli! All the way to the base!
		mommy pleasured Hoh! My own daughter's... Fat, veiny horse-dick!<br>You're... Huge! I can... Feel it press against the back of my womb! Your donkey-cock is making me ovulate~!!!
		doe love M-mama! Where'd you learn to talk like that?! And d-don't m... Move! You feel... So tight, and w-warm! I don't wanna grow any b-bigger and hurt you!
		mommy orgasm Ghouhhh~<3 Fuckkkk~!<br>D-don't worry, baby, mommy wants... <i>Needs</i> this!<br>These p-past few days, ever since playerF fell into our lives, my brain's gotten... Dirty!<br>Mommy would be... Ghh, fuck, I'm squirting right onto my baby girl's throbbing balls!<br>I'm sorry, dear! Mommy can't hold herself back any longer! Mommy needs you to fuck her ass until she can't stand anymore!
		doe forced Ghhh! D-don't say that! Don't talk like that!<br>My mom's nice, a-and kind! Don't... Don't dirty her mouth with words like those, you... W-whore!
		mommy Ghouuuhhh~!!! Fuck, I felt you throb all the way from the base! You're cumming already, aren't you?!
		im doe/doe4-2-3
		duo pleasured Houhhhh~<3
		player sleep Ah, family bonding. How lovely. I don't even need to do anything, I could even rest while they fuck like rabbits.
		player love But... Nothing's more of a turn on than a true lovey-dovey relationship!
		im doe/doe4-2-4
		mommy love Oh... Here it is~<br>doeF, grab onto mommy's hips... Dump all your girlcum into mommy's waste pipe, make mommy's cunt tighter so it can get stuffed with <i>real</i> cum!
		doe orgasm Hohhh~! W-why does it feel so... Why's my head buzz when you say mean things about my penis?!
		mommy forced Ghhhf, fuck~! It's not mean, it's the truth! My darling little girl... Is a girl!<br>And that... Ghhh~! Means surrendering when a fat stud cock presents itself!<br>Nghhh~! And you did that the moment you squirted prematurely into mommy's butt!<br>Now, m-mommy wants babies, so use that fat log of meat to bully mommy's womb from behind and make playerF's cock feel even better!
		player torogao Nghh~
		im doe/doe4-2-5
		doe forced Ghhh! It's... Happening again! My balls are losing to playerF!<br>M-mommy... You're gonna... Be...!
		mommy ahegao Pregnant! Impregnate me! Pump that fat, human cock into my womb and give me babies!
		player torogao Nghhh~!
		im doe/doe4-2-6
		mommy orgasm OUHHHH~<3
		doe torogao NGHHH~<3
		player pent Hah... Hah...
		t ...
		t As impossible as the idea of satiating the insatiable seems, after more mating, and position switching, and everything else under the sun, it's finally time to...
		mtrans doe4Finish; Continue
	`},
	{index: "doe4-3", name: "mini", image: "doe",
	content: `
		define duo = dual sp1 doe; sp2 mommy;
		player sleep Alright, I've made my choice. mommyF, lay on your back.
		mommy surprise Oh! M-me? Really?
		doe panic R-really really? You don't like me?
		doe surprise W-wait! If you marry mama, you'll be like... My dad!
		mommy love Hoh... That would be... Okay, I'm ready...
		player amused Good. Now, doeF, behind me.<br>We're making a sandwich, and I'm the filling!
		duo surprised Eh?!
		t ...
		mommy love Hoh... You're really about to...
		im doe/doe4-3-1
		mommy torogao Ghh~ It's here, real, human cock is stirring up my pussy~!
		player pleasured W-whoa! It's like a soft, velvety marshmallow!<br>There's barely any resistance going in, but it's like it's trying to suck me back in whenever I pull away!
		doe awe It's... I...
		im doe/doe4-3-2
		mommy orgasm Ghouhhhhh~<br>Cummingggg~
		doe love I... Can't look away-<br>Is it... Really alright? I never thought about the human's butt like this before, but... It's... Calling to me...
		player forced Ghh~! Go ahead!
		mommy forced Yes! D-do it!<br>You want a little sister, don't you? Make playerF feel good... Ghh! Grab onto those fat, meaty flanks of *his, make *him feel good so he floods mommy's womb with cum!
		doe forced Ghg! But... I'm way too big!<br>What if I hurt you, playerF?
		player amused Eh? You think some virgin dick could hurt me?<br>You've been staring at my cheeks bouncing as I plow your mom, you really think these can't handle you?
		doe love I... I'll do it! I can..  I can-
		im doe/doe4-3-3
		doe forced Whhhahhh~! It's like... I'm being sucked in!
		doe love Human... Human butts... Amazingh~ I can't shee straight!<br>Head... Fuzzy!
		mommy ahegao Ghhhaahhhh~<br>My womb~! It's... Haaaawt~!
		player amused Hehe~<br>You two really are a pair-<br>Ghhh! Good thrust, doeF... A pair of virgins!<br>doeF, don't just hug me from behind, thrust!
		doe torogao C-caaann't... If I move... Ghhh... Gonna shplurt... Your insides... Feel too gewd~
		player And mommyF, are you gonna push back, or are you just gonna lay there and squirt all over me?
		mommy broken Ghooh... Pregnant... Already... Womb... Stuffed full...
		player pout Jeez! A few spurts of precum and the lady think's she's already got a bun in the oven.<br>Alright, I'll do the legwork, just this once. doeF, hold onto my hips, tight, and both of try not to lose your mind!
		duo orgasm GHOOOO~<3
		player torogao Ghh! Back, forth! One, two!
		doe torogao Ghh! Cumming! I'm shorryyy~<3<br>I can't hold back! I'm cumming sho earlyyyy~!
		mommy torogao Nnnghhhhh~<3 Don't... Stop...! Head... Melting...!
		player laugh Haha~! You two are having fun, right?<br>C'mon, it's a 2v1, how am I doing so much better than you both?
		player mocking Now, back!
		t You slam your hips back, overwhelming doeF's thick, pulsating dick as you reach the base of her still-ejaculating member. Your balls come together with a soft "plap!", causing her to flail and squeal behind you.
		player And forth!
		doe broken M-mommy... Help... Mommy...
		player torogao Nghh... Back... Gonna... Cum!
		mommy broken Huh...? doeF... Is... Ghh... Is that...
		mommy pent W-why...? My head's clearing up? What's hap-
		im doe/doe4-3-5
		t A brief moment of clarity is all mommyF's mind gets, before everything goes white. She's cumming so hard she can't even form thoughts, and as her back arches a little you realize the mother of all squirts hits you like a firehose to the face.
		im doe/doe4-3-6
		player shock Waaaaah! Watch the waterworks!
		t Still you thrust forward, penetrating past the marshmallow walls of no resistance into mommyF's absolutely soaked cunt, Her daughter is no more composed, snot leaking from her nose as the jiggle of your hips meet her own, traveling all the way through her body.
		im doe/doe4-3-4
		player Back! And forth! Back! And forth!
		mommy torogao ...!
		t ...
		t As impossible as the idea of satiating the insatiable seems, after more mating, and position switching, and everything else under the sun, it's finally time to...
		mtrans doe4Finish; Continue
	`},
	{index: "doe4Finish", name: "mini", image: "doe",
	content: `
		define duo = dual sp1 doe; sp2 mommy;
		im doe4Finish
		t After who knows how long, you're finally able to step back and take a break, having fucked the pair of horny deer into complete senselessness.
		duo afterglow ...<3
		player tired The twitching... Would be really cute... If I weren't so knackered...<br>Hoo... Hopefully they don't gain too much more stamina as they acclimate to their heat.<br>They came fast and early, at least. I only really started flagging towards the end there.<br>... This time, at least.
		mommy pent Mghh... Don't worry about that...
		player surprised Wah! You're already awake?!
		mommy tired Ouhhfff... Barely... Hidden energy reserves are one of the superpowers moms get...<br>Someone's got to take doeF home...<br>Ah, but thank you for your help, playerF. I can already feel my mind clearing up. This is just what I needed.
		mommy amused And don't worry. I know doeF's fallen for you, but something tells me that if her heat gets <i>too</i> bad, she won't turn down a helping hand from her mama.
		player tired Well, that'll certainly be a lot off my plate. It feels like everyone in town wants to ride me ragged.
		mommy sleep Well, I'm rooting for you, doeF and I will be in your corner if you ever need us.<br>Or our house can be a little sanctuary for you, if you ever need a break from your busy role as the town's sole human.
		player happy Nice of you to offer. So, that means doeF <i>won't</i> be clamouring for a threesome every second I'm visiting?
		mommy amused Is that doubt I hear?<br>If you think doeF's a big ball of energy, you've never seen the full power of an unrepressed mother before.<br>I can keep her plenty drained, if she's ever bothering you.
		mommy seductive Now, when it comes to whether <i>I'll</i> be clamouring for a threesome~
		player blushy Eep!
		mommy laugh Haha~<br>Just kidding. Please, take care, playerF. And pace yourself.<br>I'll take doeF home now.<br>Stay healthy! And fit!
		t And with that, mommyF picks up her daughter, and on wobbly (but still very, very strong) legs, heads back home.
		player sleep What a nice way to wrap things up.
		finish
		eval unlockScene("mommy", "mommy4Start"); !flag player gallery;
		eval writeSpecial("You unlocked a new event in the gallery!") !flag player gallery;
	`},
	{index: "doeQuo1", name: "A first visit - Doe", image: "doe/statusQuo1-1",
	content: `
		t You give the door a good, firm knocking.
		doe sleep Mmgh... Coming...
		im statusQuo1-1
		doe sleep Hello~
		doe amused Ah, playerF, hiya~
		player happy So cute...!<br>You look like you just woke up!
		doe sleep Yeah, I usually take a nap through the afternoon.<br>But since the heat started, it's been tough to rest at all...<br>Thanks to your and mom's help though, I've been able to rest easy again.<br>Oh, come in, come in.
	`},
	{index: "doeQuo2", name: "A lovely visit - Doe", image: "doe/statusQuo2-1",
	content: `
		t *Thmp* *Thmp*
		player confused Hmm? I hadn't started knocking yet.
		doe special secret; Is someone there? Door's unlocked, come in!
		mommy special secret; Ghhhouhhhh~<3
		player happy Well, okay then.
		im statusQuo2-1
		doe horny Nghh~<3 Who is-
		mommy orgasm GHOUHHHH~<3<br>Your cock is splitting my ass apartttt~!!!
		doe sparkle playerF! Mama, playerF's visited again!
		t *SCHLLLLLLRP*
		t Planting her feet and not-so-casually pulling what looks like a foot of horsemeat from her mother's guts, doeF quickly puts an end to the sodomy session to greet you.
		doe excited Did you come to play? Hey, hey, it's pretty late, it's my turn now, right?
		player befuddled Err, is she-?
		doe flirting Mama's fine! Mama, tell him you're fine!
		t She takes a moment to roll over, clearly right at the edge of orgasm. 
		im statusQuo2-2
		mommy torogao I'm... Nghh~<3<br>Ghmmmggg~
		doe excited She'll play with herself until she's all squirted out. She does it whenever I get bored of sex.<br>Hey, hey, I've been working on those exercises you told me about!<br>Feel it, feel it!
		t She lifts her skirt and wiggles her tummy at you, her horsecock follows, still slick with a mixture of precum and milf juices.
		player surprised Oh?
		im statusQuo2-3
		player joy You have been working on them! Your prostate's definitely toughened up!
		doe flirting Ehehe~<br>I've been working hard! When I'm really, really horny, I can even cum when you aren't around now, it doesn't get stuck!
		doe love Though... It feels a lot, lot better when you are around... Did you come to play?
		player amused I think we may need to help your mom get into bed first.
		doe pent Yeah, probably. C'mon, mama, let's get you to bed so I can have my turn with playerF.
		mommy Ghhhhhg~! My clit! My hand won't stop! And my ass won't... Ghh, close!
	`},
	{index: "repeat1", name: "Quick Visit - Petting", image: "doe/repeat1-3", requirements: "?flag "+character.index+" repeat1;",
	content: `
		eval data.player.currentScene = "repeat1";
		doe happy ... Pet me?
		doe sparkle Absolutely! Where did you wanna start?<br>My mom says my cheeks are the absolute best in the whole town!<br>Though, lately, she's been more obsessed with my thighs and butt.
		player love Hoh... Cheeks... But, ears...!<br>And super cute scut tail... Where <i>do</i> I start?
		doe amused Jeez, anywhere! But if you can't pick, let's start here.
		im repeat1-1-light
		doe sleep Ooh, your hand's so warm~ And nice~
		player blushy Hmmmm!
		t You can feel yourself ascending to the heavenly plane! doeF's fur is very short, and she doesn't have much fat, so there's a good amount of springey-ness as you pet and rub her cheeks.
		t This pure preciousness, distilled cuteness, it saps away at your ability to push forward, to really dig into a good petting session, but that's completely made up for by the enthusiasm doeF shows as she nuzzles into your hand!
		player perverted I'm in pet-nirvana~! Ehehe~!
		doe sleep Mmm...
		doe surprised Ah, actually!<br>If you're in a touchey-touch mood, I had a request...
		player excited Anything~
		doe blush Ah, w-well, it, err...<br>S-see, y'know, when mom went into heat, she told me that her chest would get sore, and she'd, well...
		im repeat1-2
		doe Jeez, I don't know why I suddenly feel so embarrassed...<br>I mean, we've gone way farther than this...<br>I, err, whenever I try to rub them myself, I get all pent up, and that's not super good for me.<br>To rile myself up without being able to let it out, I mean. But if you're here, maybe I could-
		player sleep I understand completely.<br>Don't you worry, your mama's chest is amazing, but I'm a proud member of the itty-bitty-titty-committee too.
		doe befuddled The what now-
		t ...
		im repeat1-3
		doe forced Khhhh~!
		player joy Great volume on that one! I can tell you're getting closer, but keep your hands off.
		doe panic N-need! Need to cummmm!
		player sleep You will, trust me!<br>Keep focusing on those pelvic muscles!
		t Another *SPLAT* of precum thick as syrup paints the floor as doeF's legs quiver. Meanwhile, inbetween giving advice, you're in your own little world.
		player perverted <i>Ehehe~! These boobs are so nice! So perky, it's like they're trying to push back against my squishes! And running my hand along them-</i>
		doe forced Ghhiii-! Ticklish!<br>Oh, n-no, it's... Ghouhhh, stuck! 
		player shock Oh!<br><i>Whoops, my hand slipped too far back, she must have tensed up...<br>And she's right, no more precum splurts...</i>
		player annoyed Alright... Looks like I'll have to take this seriously... Time to put my level 99 fluff huffer skill to use!<br>I'll make you cum from just breast-play, with this! My 23rd most powerful technique!
		doe pleasured Hoh! What's the technique called?
		player amused Heh. It's called the...<br>DOUBLE-TROUBLE-!
		doe perverted Ghhhiii! W-waihhahaha-!
		player fury TWIN-PRONGED-!
		doe ahegao -HHAHAHAHH-!!!
		player TICKLE-GROPE-NIPPLE-PLAY-ASSAULT!
		im repeat1-4
		doe ahegao GHHHAHHHAHAH! STAHH, GHH, CUMM- AHAHAHA~!
		t doeF quickly goes bow-legged, signifying total defeat before your 23rd strongest technique. The overwhelming sensation is enough to give her muscles the last push they need for her balls to clench and cock to spurt.
		t And you don't relent, even as tears start running down her face, until those balls of hers are fully and finally drained.
	`},
	{index: "repeat2", name: "Quick Visit - Oral", image: "doe/repeat2-2-light",
	content: `
		eval data.player.currentScene = "repeat2";
		im repeat2-1-light
		doe awe Whoaaa...
		player happy We've already done anal, but it can't hurt to go back to the classics with some old-fashioned fellatio, right?
		doe love Fellatio... It's so... Big!<br>I've never seen it up so close before, is this how mom feels when I slap mine on her face...?<br>It's like my head is totally emptied...
		t ...
		doe pleasured Mlllg!
		im repeat2-2-light
		t Despite her very best efforts, and her self-admitted empty head, doeF just can't manage to take in much more than just the crown.
		player confused Hmm. This is a tough one, you seem to be struggling, maybe the size difference is too much?
		doe blush Mlg!<br>Mwah... No, I can do it! I wanna keep trying!
		player happy You want to keep trying, or you want to succeed?
		doe horny Uh... Both? But... I guess this is a lot harder than I thought. My body won't listen to me, it's like it hits the back of my mouth and I just-
		player joy No problem, I know exactly what to do! Climb up on that table.<br>You've got a mental block, and in situations like these, usually we'd take it slow and break it down brick by brick.<br>But, it'd be a bad time if we went <i>too</i> slow and let you get all pent up again.
		player sleep In fact, lemme listen. You might be too riled up already, it'd be a disaster if us having fun led to you getting clogged again.
		im repeat2-3
		doe blushy A-ah... Alright, listen away?
		t doeF moves her towering meat out of the way, letting you rest the side of your head against the pair of throbbing apples between her legs.
		doe horny H-how do they sound?
		player angry Shh!
		player sleep ...
		t *Gurgle* *Gurgle*
		player Hmm. Not too bad, the factory's still churning, and it'll be thick too, we definitely don't have time to take this slow, so it looks like we'll need to break through that mental block with some throat swabbing.<br>Don't worry, you just relax and let me do aaaall the work!
		t You stand back up, her balls so sweaty they stick to your face at first, but so very heavy that they don't stick for long.
		t You circle around the doe gal, who's shivering with a mix of nervous excitement.
		player sleep Alright, take the tip in your mouth...
		doe love Ahuh...<3
		player mocking And here! We! Go!
		im repeat2-4-light
		doe pleasured GHLLLLK-!
		t In one fluid motion you shatter her earlier length record, her throat is unbelievably tight but welcoming enough that you're quickly deep enough for her nose to just barely graze against your own pair of sweaty orbs.
		player pent Hhhh... You alright?
		doe love Glllllkkk-!<br>*Snnnfff* *Sniff* *Snrrrrt*
		player pleasured Hiiiih! That tickles!
		t You pull back, watching the bulge in her throat shrink, all while her nipples poke through the fabric of her dress and the veins on her needy dick pulse.
		player horny Geez! If... Hoh... If you tickle me like that, I can't go all the way!
		t You aren't sure if she can process what you're saying, the mixture of wet gags and whines aren't necessarily meant to be a coherent response.
		t But, the subtle bulge beginning to travel up the length of her shaft does tell you everything you need to know.
		player amused Well, not that I don't mind getting splatted in the face by girlspunk, but I think a change of position is in order.
		t You swing one leg around over doeF's head, who lets out her sloppiest noise yet as the shaft inside of her shifts, before you resume your brain-ruining facefucking session.
		doe orgasm GHLLLLK-<BR>BHLLLLK-<BR>*SLRRRRP*<br>GHLLLK-
		player pent Hoh... G-gonna... So tight...! Gonna... Cum!
		im repeat2-5-light
		doe ahegao MHLLLLLLLLLGGG-!!!<br>*GLP* *GLP* *G-*KHLLLLLK-
		player afterglow Ahhh... There we go...
		player horny Ah, should probably let you breathe...
		t You waddle forward, unsheathing your length from doeF's throat. The floor is quickly a mess with the oral overflow mixing with her own hands-free emission.
		doe broken Buhhahhh...<br>Kh-*cough* *cough*<br>M-more...
		player amused More?! You literally can't stomach more, I see how far that belly sticks out.<br>Silly girl.<br>Alright, let's get you cleaned-
		player confused Ah, wait, mommyF will probably want some.<br>Alright, let your tummy settle a bit, and if you're still hungry, you can suck down the leftovers of your mess. Otherwise, let your mom clean you up, alright?
		doe afterglow Ogh... Oghaaaayy~<3
	`},
	{index: "wolfMorning-doe", name: "Fashionista's Closet - Mom & Daughter", image: "wolf/wolfMorning-doe1",
	content: `
		t Morning comes, it's a busy day in wolfF's house as her guests try on new outfits.  
		mommy blush You see?
		im wolf/wolfMorning-doe1
		wolf surprise Oh, my, goodness.
		mommy panic It's awful, right? It's just barely hanging on...<br>I should have throw this out-
		wolf fury Absolutely not!<br>Madame, when you told me you had nothing but a scrap of fabric as swimwear, I was appalled!<br>But this... Is perfect! It flawlessly shows off your matronly form!
		mommy blush Oh... You really think so?<br>To be honest, it feels like it could snap at any moment.
		wolf amused But that's the best part! And when they do come tumbling out, the world will be graced! And I'm sure a certain someone would be delighted to help shoulder them for you~
		doe forced Ghh!
		mommy shock Oh! Speaking of, doeF, dear, what's wrong?
		wolf shock Ah! Where did you find that?!
		im wolf/wolfMorning-doe2
		doe blush Nggh, it was... Next to the pile you pointed at!<br>B-but I think I might have torn it...
		doe crying I'm so sorry big sis!
		wolf pent It's fine, it's fine, don't cry little darling.<br>I had gotten that for the human, but I got spares as well.<br>Just toss it in the hamper, I'll...<br>Hmm, that's quite the mess you've made.
		mommy love I volunteer to clean it up...!<br>A-and actually, instead of the hamper, could we take those shorts with us?
		wolf befuddled You want them? I must warn you, they're meant only for humans. Trying to stuff your daughter's sack into those would-
		wolf tired ... Ah.<br>Right. Just... Wipe it up. With a cloth, and not your tongue, please.<br>And if you simply <i>cannot</i> wait to try for another child together again, if you can't make it all the way home, could you perhaps try to make it out of earshot before you begin violently mating again?
		doe love M-mommy...
		mommy W-we'll do... Our best <3
	`},
	{index: "watch-start-doe", name: "Time Stopwatch - Deer Daughter 1", image: "mommy/doe-watch1-5",
	content: `
		im doe-watch1-1
		player sparkle doeF! How's it going?
		doe happy ...
		player crying Wahhh! It's not the same when you don't say hello back!<br>This is so sad!
		player annoyed Hmph. At least I know what'll definitely cheer me up.
		im doe-watch1-2
		player awe Whoa... Heavy. There's gotta be like...<br>Six or seven loads stewing in here!
		player And the shaft is so thick, too! Let's see...
		im doe-watch1-3
		player Hmm, it doesn't actually get all that much bigger when it's hard. Guess she's a shower, not a grower.<br>The veins get a little more intense, at least, and this thing's pretty much a precum fountain.
		player amused Now, let's see the other side...
		im doe-watch1-4
		player happy Eee-yep, butthole's still there. I could play with it a bit, but it's just not the same without hearing her cute squeals.<br>Well, I guess I could massage it just a little bit~
		t ...
		player happy Phew! Alright, that should be good.
		im doe-watch1-5
		player happy Since the two of you have each other, I figure I don't need to go as crazy as I have with the others.<br>It might not even be enough to cum, keeping it to foreplay only should have you edged and desperate right in front of your mom!
		player tired Plus, hanging around with you, but not getting to enjoy that bouncing-off-the-walls joy?<br>No, I think I'll wrap up with you here, and visit tomorrow when I'll get to actually hear your voice.
		player curious Now, the real question is, should I play with mommyF too? Or would it be more fun to have just one of them spontaneously put on a splurt-show and let the other watch?<br>Hmm, decisions decisions. !flag mommy watchStart;
		player happy Alright, that's both doeF and mommyF played with! ?flag mommy watchStart;  
	`},
	{index: "watch-finish-doe", name: "Time Stopwatch - Deer Daughter 2", image: "mommy/doe-watch3-1",
	content: `
		eval deerStopwatch(); 
		eval unlockScene("mommy", "watch-finish-mommy"); !flag player gallery;
	`},
];

function deerStopwatch() {
	if (checkFlag("mommy", "watchStart") != true && checkFlag("doe", "watchStart") == true) {
		//Mommy
		writeHTML(`
			im doe/doe-watch1-5
			doe happy -nd so then-
			doe forced Huh?!
			mommy curious Honey? What's-
			im doe/doe-watch3-1
			doe H-hot! Heavy! I'm suddenly... All worked up! Like when I get real close, a-and...
			mommy panic What do you need, honey? Do you need boobs? Do you wanna hump mommy's titpussy until your big, strong girlnuts feel all better?<br>Or do you need special kisses? Like the kind where I kiss your cumhole reeeally deep, and-
			im doe/doe-watch3-2b
			doe torogao Ggghhhg! 
			im doe/mommy-watch2-2
			mommy excited Oh my, this is serious! Okay, I'll use my hands first, but if you can't cum from this then turn around and I'll kiss you from behind while you mating press mommy boobs okay?
		`);
	}
	else if (checkFlag("mommy", "watchStart") == true && checkFlag("doe", "watchStart") != true) {
		//Doe
		writeHTML(`
			im doe/mommy-watch1-5
			mommy curious Hmm~?
			doe happy -nd so then, he said "I've never seen"- Mom?
			im doe/mommy-watch3-1
			mommy forced Ghh! What's... Happening?! My pussy's... Soaked! And my clit is-
			im doe/mommy-watch3-2b
			mommy torogao NGGHHH~!!!<br>Fuckkkk! Mommy's squirtingggg~<3
			doe shock M-mom?! W-what...
			mommy afterglow Ghohhh~<br>Mommy's sloppy cunt... Couldn't help itself...<br>Right in front of my own daughter...<br>Why did...
			mommy pent Mggh... I'm so, so sorry dear, I don't-
			im doe/doe-watch2-2
			doe love Hah, hah, mommy, did you get all excited like that for me?
			mommy blushy I, w-well...<br>Ghh... My womb is still aching, maybe-
			doe awe Maybe it isn't satisfied enough! Don't worry mom, I'll reach extra, <i>extra</i> deep this time! I'll even do that thing you love where I rub the tip against your cervix and they make sloppy kisses!
			mommy forced Ghh, w-wait, if you tease me like that when I'm already so excited-
			doe excited Mommy! Squat down! I wanna hug you tight!
			mommy pent Oh... Oh dear...
		`);
	}
	else {
		//Both
		writeHTML(`
			im doe/doe-watch1-5b
			doe happy -nd so then-
			dual sp1 doe; sp2 mommy; shock ... Huh?
			im doe/doe-watch3-1
			doe pleasured Ahhhh?! My balls are-<br>Mommy?!
			im doe/mommy-watch3-1
			mommy forced M-my pussy! R-red... Hot!<br>Clit... Electric... Gonna...!
			im doe/mommy-watch3-2
			mommy torogao Nghhhhh, fuck! Fuckkkk! Mommy's squirtingggg~<3
			doe love M-mom...
			mommy pent Hoh... My gosh, I don't... Know...
			im doe/doe-watch3-2
			doe torogao Mommyyyy-<br>H-help, I need... I need to cummm~! My balls feel like they're gonna burst!
			mommy awe Oh dear! Oh, my sweet little baby! Come here, mommy's here...
			doe forced Pussy! Need mommy's pussy!
			mommy seductive Oh, my sweet little angel, of course~!<br>When my little girl's balls are <i>this</i> needy, and mommy's fat cunt is <i>this</i> soaked, of course you'll get all you need~<3

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