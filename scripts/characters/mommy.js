var character = {index: "mommy", flags: "", fName: "Cinnamon", lName: "", color: "#FCB7F5", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "female"};

var logbookArray = [
	"im images/mommy/clothed/happy; title Worryable; mommyF is one of the lucky few townsfolk of Syrup Town who's managed to give birth. She's a loving mother to her daughter, doeF, and the two of them still live together. More than a few townsfolk worry that she's a little too quick to worry for her daughter, and that her overbearing nature might be stunting doeF's growth.<br>Still, she's a kind caring woman, and a hard worker too. She and her daughter volunteer as maids around town, helping clean up wherever they can.<br>Even when they aren't volunteering she and her daughter are inseparable, to the point where she'll start worrying if they're apart for more than a few moments.",
	"im images/mommy/logbook2.png; title Flowy Dress; Like her daughter, mommyF prefers to wear simple dresses. Very simple, in fact, hers are clearly hand-sewn and much more raggedy than doeF's. Granted, hers have a lot more meat to stretch over...<br>Her motherly figure is always on full display, the thin fabric of her dresses struggles to contain her massive breasts and when her huge nipples aren't outright slipping out, they're always visible through the fabric.<br>It's a mystery why she even bothers to cover her top, especially since the cut of her dresses usually stops above the navel, putting her thick thighs and plump pussy on full display to the world.",
	"im images/mommy/logbook3.png; title Mommy Milkers; The battle for most massive mammaries in Syrup Town is a brutal and unforgiving one, every day pairs of fat tits are paraded through town, so mommyF having a very solid claim to victory in that field is a huge accomplishment.<br>While they aren't so sensitive they prevent her from wearing clothes, mommyF's breasts are so sensitive it's like they're constantly begging her to have more children. It's at the point where a solid grip around her nipples could have mommyF spasming so hard she can't find words!",
	"im images/mommy/logbook4.png; title Mama's Bakery; There simply aren't enough words across any language to perfectly describe mommyF's rear. While her eager and often soaked pussy is clearly pleading for a creampie ASAP, mommyF's body understands the quickest way to start a family is by getting a mate thoroughly hooked however possible.<br>To that end, her plump and inviting asshole has been taught its true purpose: Opening for and tightening around thick cock, never relenting until her guts are pumped full of jizz.<br>After your big encounter with the mother and daughter pair, you'll need to think long and hard about which hole to claim for yourself, and which to leave to the ever-excitable doeF. Choose carefully!",
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
	{index: "morning2", priority: 100, requirements: "?trust mommy 5; ?trust doe 4;", unique: false,},
];

var encounterArray = [
	//{index: `placeholder`, name: character.index+`F test`, requirements: "?location pineconePlaza;", altName: "", altImage: "",},
	{index: `doe2Prelude`, name: `*KNOCK* *KNOCK* KNOCK*`, requirements: "?location playerHouse; ?trust doe 2; !trust mommy 2;", altName: "", altImage: "",},
	{index: `mommy1`, name: `Someone's knocking at your door again`, requirements: "?location playerHouse; ?trust mommy 4;", altName: "", altImage: "",},
	{index: "House", name: `Visit mommyF's House`, requirements: "?location willowWalk; ?time Morning; ?trustMin mommy 6;", altName: "", altImage: "",},
	{index: `watch-start-mommy`, name: `Play with mommyF`, requirements: "?location willowWalk; ?trustMin mommy 6; ?holiday watch; !flag mommy watchStart;", altName: "", altImage: "",},
];

var sceneArray = [
	{index: `doe1`,
	content: `
		eval writeScene('doe', 'doe1');
	`,},
	{index: `doe2Prelude`,
	content: `
		player sleep Who iiiiis-
		im doe/doe2-0
		mommy panic playerF! Help, is doeF here?!<br>She went out for a walk, but she said she'd be just a while, but it's been more than an hour, and-
		player shock Wah! Calm down, calm down.
		player confused ... An hour? Isn't that a bit quick to get worried?
		mommy scared An hour is more than enough time for something to happen! What if she got lost?!<br>What if she felt so bad about how that supper went that she's run away to find a better mother?!<br>O-or if she's gone to live in the city! She wouldn't be able to tell me, she doesn't know how to address a letter, playerF! She doesn't know what stamps to use!
		player tired Okay, okay, I'll help search for her. Relax.<br>I doubt I'll be much help though, I have no idea where she'd be...
		mommy panic Right! I'll keep asking anyone else if they've seen her!<br>Don't worry baby, mommy's coming!
		eval setTrust('mommy', 2)
		finish
	`,},
	{index: `mommy1`,
	content: `
		eval writeEvent('mommy1');
		eval setTrust('mommy', 5);
		eval passTime();
		finish
	`,},
	{index: `morning2`,
	content: `
		eval writeEvent('mommy-morning2');
		eval setTrust('doe', 5);
		eval unencounter('mommy');
		finish
	`,},


	{index: `statusQuo1`,
	content: `
		eval writeEvent("mommyQuo1");
		eval unencounter('doe')
		eval unencounter('mommy')
		eval setTrust('mommy', 7)
	`,},
	{index: `statusQuo2`,
	content: `
		eval writeEvent("mommyQuo2");
		eval raiseTrust('mommy', 1);
	`,},
	{index: `doeQuickFix`,
	content: `
		eval generateHouse("mommy");
		eval updateMenu();
		eval checkForAchievements();
	`,},
	{index: `statusQuo`,
	content: `
		mommy happy doeF usually naps through the afternoon, so we have the house all to ourselves for the moment.
		mommy excited So, care to entertain an old lady while her daughter sleeps just a room away~?
		trans repeat1First; Ask to pet mommyF !flag mommy repeat1;
		eval writeQuoRepeats();
		cancel
	`,},
	{index: `repeat1First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag(data.player.currentCharacter, data.player.currentScene.replace("First", ""));
		eval raiseTrust('mommy', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat1Repeat`,
	content: `
		im repeat1-1
		im repeat1-2
		im repeat1-3
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `repeat2First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag(data.player.currentCharacter, data.player.currentScene.replace("First", ""));
		eval raiseTrust('mommy', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat2Repeat`,
	content: `
		im repeat2-1
		im repeat2-2-light
		im repeat2-3-light
		im repeat2-4-light
		im repeat2-5-light
		eval unencounter(data.player.currentCharacter);
		finish
	`,},

	
	{index: `watch-start-mommy`,
	content: `
		eval writeEvent(data.player.currentScene);
		eval addFlag(data.player.currentCharacter, "watchStart");
		finish
	`,},

	{index: `cancel`,
	content: `
		eval unencounter(data.player.currentCharacter);
		eval changeLocation(data.player.location);
	`,},
]

var eventArray = [
	{index: "mommy1", name: "Visitor", image: "doe/mommy1-1",
	content: `
		player sleep Who is iiiit~?
		mommy blush Hello... I was-
		player shock No, did she vanish <i>again</i>?!<br>Okay, you checked the park right away this time, right? Seriously don't get why you didn't look there first the last time-
		mommy panic N-no! No, doeF's fine... She usually has her afternoon nap right about now.<br>No, I, um...<br>I'm here for myself, this time.
		player befuddled Wait, you're the one who's gone missing?
		mommy befuddled ... In a metaphorical sort of... Of...
		mommy excited Oh my, it smells... Really nice in there.<br>You know, I actually help around town by cleaning people's homes.
		player worried Well, that'd be swell, except my home's basically a powder keg of human pheromones. One step in here and you'd be completely overloaded with baby-making urges.
		mommy excited Ghh... Too late~<br>I guess my body hasn't realized I'm past my expiration date, haha~<br>Sorry about this, but-
		player fury Expiration date?!
		mommy shock Eh?!
		player angry Who told you that?! Who put those nasty words in your head! I'll take 'em all on!
		mommy curious Uh... Well, uh...<br>I've never actually heard anyone, well...<br>I guess, in the mirror I sometimes-
		player fury Which mirror?! I'll kill it! Mature ladies are the world's most precious treasures!
		mommy worried ... You certainly are spirited, aren't you? I suppose you and doeF are a lot alike in that way.<br>You snapped me right out of... Of...
		mommy scared Oh dear God... What was I about to do?!<br>With someone my daughter's... I'm old enough to be your mother!
		player love Ooh, really?<br>Well, if you need help dealing with your heat...
		mommy panic N-no, I really should be...<br>Be...
		mommy love What... Is that smell...?<br>It's coming from... Your...
		player shock Ah! Sorry, when you panic, you wobble, and I got a bit carried away looking (respectfully) at your mahamalagongas.<br>Actually, I'm sweating too, so-
		mommy I'm... Going to... Attack...
		player awe ...!
		t ...
		t *SCHLCK* *SCHLCK* *SCHLCK*
		mommy torogao KHHH-
		player amused See? And you said this wouldn't be enough for you.<br>But seriously, holding it in is bad for you. The house is pretty isolated, so let it out, girl!<br>Purse your lips like this, make an o, and just make the stupidest face you can, this is a judgement free-
		im doe/mommy1-1
		mommy orgasm OHHHHHHH~!!!
		player sparkle There we go!<br>Right, like I was saying, baby-making mating-pressing would be waaaay too much for your brain to handle right now! Especially while soaking your brain in the hot-pot of my scent!<br>No, just relax and squirt yourself silly, until-
		t *SCHLRRRP*
		im doe/mommy1-2
		mommy GHOUUHHHH~!!!
		player awe Holy moley... My whole hand...!<br>It's like I'm in a plaster cast of marshmallow and gelatine!<br>And is that your... Womb?
		mommy Baby, want a baby! Give me your childrennnn~!
		player love Wow... Older women truly are amazing...
		player frown ... No! I can't get distracted! Or let my restraint break!
		player fury Here I go, this hand of mine is soaking wet! These loud squelches are telling me to push towards victory!<br>Take this, squirting, milf, FIST!<br>HWOOOOOAAAAH!!!
		mommy OUUUUUHH~<3
		t ...
		im doe/mommy1-3
		mommy afterglow Hoh... Preggy... For shure~<br>Gonna have... Sho many cute babiesh~<br>Sho happy~
		player sleep Ahuh, yep, for sure. Now don't be a stranger!<br>And stay on the path, and make it home safe! And take deep breaths of fresh air once you get home to get all those pheromones out of your system!
		player pent Hooh... Thank goodness she could still walk home.<br>I'd need to tap into my "fear of death" strength to carry her.
		player amused I mean, obviously, I still would. What are muscles for if not for helping lift heavy things and making moms happy?<br>But I'd be reeeeally sore afterwards.
		player tired ... Oh wow, speaking of, my fisting fist is really tired.<br>Maybe I'll stay in today, and just rest...
	`},
	{index: "doe-mommy-morning1", name: "park", image: "doe/morning1-2",
	content: `
		define duo = dual sp1 doe; sp2 mommy;
		t *Gurgle*
		im doe/morning1-1
		doe forced Ghhh! It's... Happening again!<br>Just like when playerF...
		doe love playerF...
		t doeF's thoughts drift to you, and while the incessant begging of her fat nuts isn't getting any quieter, they feel almost... Distant.
		t Instead, it's some other craving inside of her that has her attention.
		t ...
		t *Splsh*
		im doe/morning1-2
		mommy forced Ghhh!<br>Again? I just cleaned that spot!<br>What's happening to me?
		mommy pent This is like that day, but even more intense...<br>Am I ready for another child?<br>I remember being terrified back then, but-
		mommy horny Hmm! What... What's this fluttering in my chest?!<br>I feel... Happy?<br>I... I wonder if playerF is awake yet...
	`},
	{index: "mommy-morning2", name: "Visitor", image: "doe/morning2-1",
	content: `
		define duo = dual sp1 doe; sp2 mommy;
		mommy sleep Hmm hm hmmm~
		doe tired You're really happy today... Mgh...<br><i>My butt is sore from yesterday... Though at least my nuts aren't gurgling so loud anymore...</i>
		mommy happy Well, it's a very good day!<br>It's always nice to be cooking, these buns came out great!<br><i>Mm, and my womb is pulsing with joy! If my thighs weren't sore, I'd be perfect right now! And now that I have a bun in <b>my</b>... Wait.</i>
		doe tired Mgh... Hold on, I'm...
		duo worried I'm not actually pregnant!
		doe befuddled Eh? Did you say something, mama?
		mommy panic Ah! Nothing, dear!
		mommy shock Oops, the pot's overflowing!<br>Gotta...
		im doe/morning2-1
		doe love Hohhh~
		mommy confused Wait, did <i>you</i> say something?
		t *GURGLE*
		doe forced Ghh!<br>Ah, I made a mess again...
		mommy amused Oh you, don't you worry, I'll clean it up.<br>So, has anyone in town caught your eye since playerF arrived?
		doe blushy I... Ghh! I need to go for...<br>Ghouhh~<br>I'll be back soon!
		mommy worried Wait!<br>Oh, drat...<br>She really is growing up. Now that she's in heat, she might find a partner and have a child of her own...<br>Though, good grief, whoever she pairs up with will have a lot to deal with! Just one splutter and there's enough precum to... To...
		mommy love My little girl... Her gunk's so thick... Is it as thick as...<br>*His?<br>I wonder if... Who's j-jizz would be thicker?
		mommy panic Eep! No, no no no, I shouldn't be having these thoughts!<br>And I certainly shouldn't be... Hovering over this <i>pool</i> of my own daughter's precum!<br>I need help, fast! I can't handle not being pregnant much longer!
		mommy excited Th... This time... This time for sure, I won't give up until I have that fat, musky cock mark my womb~<br>Until I hear those aching balls throb and clench, and fill my baby room with my own daughter's-
		mommy torogao Nghh! No! Forget the cleaning, I need to go!
		mommy horny ... But I will turn the oven off first.
		t *CLICK*
	`},
	{index: "mommy4Start", name: "Threesome - Start", image: "doe/doe4-0-3",
	content: `
		eval data.player.currentCharacter = 'doe';
		eval writeEvent("doe", "doe4Start");
	`},
		
	{index: "mommyQuo1", name: "A first visit - Mommy", image: "mommy/statusQuo1-1",
	content: `
		t *Knock* *Knock*
		mommy sleep Whooo iiiis-
		im statusQuo1-1
		mommy sparkle Oh my goodness, playerF! It's so lovely to see you again!
		t Bending over to pick you up, you're quickly enveloped in a full-body hug.
		player love Hohhh~<3
		mommy sleep Oh, I bet you came straight over after finishing your morning errands, how thoughtful of you!
		player excited S-sure~<br><i>I'll maybe just keep quiet that this is the early morning for me...</i>
		mommy happy Now, doeF usually has a nap every afternoon, and thanks to your help she's back on her regular schedule.<br>So I suppose it'll just be the two of us for now.
		t Being so totally wrapped up in milf-flesh, you can actually tell the exact moment she starts getting excited. The temperature around you slowly starting to raise and just the faintest hint of sweat surrounds you.
		mommy excited So, I'll make sure you're very, very well taken care of.<br>It's so sad you're all alone here in town, so far from your family.<br>So today, how about I be your mommy~?
	`},
	{index: "mommyQuo2", name: "A lovely visit - Mommy", image: "mommy/statusQuo2-1",
	content: `
		t *KNOCK* *KNOCK*
		doe special secret; NHOUHHHHH~! MOMMYYYY~!
		mommy special secret; Ah, I think I can guess who that iiiiis~!<br>The door's unlocked, please, come in!
		im statusQuo2-1
		mommy joy Oh, hello~! Dear, playerF's come to visit!
		doe orgasm HOUHHHH~<3<br>MOM'S BOOBIES FEEL SO GOOOOOD~<3<br>I CAN'T STOP CUMMINGGGG~<3
		mommy amused Yes, yes dear, keep thrusting into mommy's...<br>Hmm, what was the word for it? We just learned it, it's on the tip of my tongue...
		mommy sparkle Ah, titpussy! Yes, honey, keep thrusting into mommy's titpussy until aaaall that thick seed of yours is squirted onto the floor.
		doe broken Houhhhh~<br>Can't... Cum... More... Empty...
		mommy sleep No, they aren't dear. That last load was much too thick for it to be the last one, and you know the rules. No rest until there isn't a single drop of cummies in my little girl's nutsack left.
		doe torogao Ghhhg~
		mommy worried I'm so sorry to impose on you like this, but could you give her a little push? If you could just step behind me and lift your arm, maybe let her smell a bit of your sweat, it'd be a huge help...
		player sleep It's no problem at all!
		doe orgasm GHOUHHHHH~!
		t ...
		im statusQuo2-2
		mommy happy There we go.<br>Rest well, dear. playerF and I will be out in the living room if you need us.
		doe broken Ahohooaaaahhh~
	`},
	{index: "repeat1", name: "Morning Visit - Petting", image: "mommy/repeat1-1", requirements: "?flag "+character.index+" repeat1;",
	content: `
		mommy confused Pet? Me?<br>Is there another meaning I haven't learned yet?
		player excited Uohhh... If I could just rub those cheeks, or those wonderful fluffy ears... Or that super cute tail...!
		mommy amused Oh, I can't say no to such an honest, innocent good *boy like you...<br>Well, if you'd be satisfied with just some touching, of course you can. But bending over too long would hurt mommy's back, alright? So let me just find a chair first.
		t ...
		im repeat1-1
		mommy sleep Mm, oh my~<br>I'm not used to being pampered~
		player perverted Fluffy lady paradise~~~!<br>Uehihihihi~<3
		t Every time you touch her your fingertips first sink through a layer of ultra-soft fur, before they press into her skin. Neither layer offers any resistance, it's just like sinking into her cleavage. She truly is the pinnacle of softness, not to mention how her ears wiggle with each scritch!
		mommy Mmm, ara~<br>This feels so nice~<br>I've been carrying more stress than I realized~<br>Oh, I feel like I could fall asleep like this~
		player excited Heeehehehe~<br>Can I feel your horns next?
		mommy Whatever you like, it's-
		mommy surprised Ah, wai-
		t You lightly brush your hands along her horns, they aren't the hard keratin you were expecting, instead they're covered in a layer of soft velvet.
		mommy love ...!
		player horny Wowww~ Amazing~!<br>Are they still growing? I don't know how your species works, but where I come from only male deer have horns.<br>And they're usually shed each winter, but yours are exactly like when they're still growing!<br>Once they finish and turn white they stop being sensitive, but until then it's like a fresh nerve, and-
		player worried A-and... Uh...
		im repeat1-2
		mommy love ...!
		t She's completely silent, outside of her pussy squirting enough to form a puddle on both her chair and floor below.
		t Her normally marshmallowy thick peach pussy is spread open, partially due to spreading her legs, partially because her clit is erect enough to be visibly exposed.
		t You gingerly let go of her horn, and slowly, but surely, you can hear a faint squeal coming from her mouth, rising in volume by the second as she starts to twitch.
		player panic Oh boy.
		mommy love ...oooooohhhhhh-<3
		t ...
		player annoyed Hffff!
		doe tired Upsie... Daisy!
		player pent Hoooh!
		im repeat1-3
		mommy afterglow Ooooaaaahhhh~<3<3<3
		player tired Alright, thanks for the help, doeF. Now that she's in bed, she'll be back to normal soon?
		doe sleep Well, she'll stop cumming eventually. But by then it'll be so late it'll be her usual bedtime.<br>I accidentally grabbed her horns before while mating with her butt, you're lucky she just locked up on you.
		doe tired Speaking of bedtime, though, I was... *Yawn* Right in the middle of a nap...
		mommy broken Ghohhhhh~<3
		player sleep I'll let her calm down, and probably clean up. Maybe I'll visit later, when I'm not soaked to the bone with grool?
		doe sleep That sounds... *Yawn*... Nice. Don't be a stranger~
	`},
	{index: "repeat2", name: "Morning Visit - Oral", image: "mommy/repeat2-2-light",
	content: `
		im repeat2-1
		mommy shock Oh my! Is that because of me?<br>Ara, I'm... Flattered!<br>Well, I'm not sure an old lady like me can keep up with a younger *man's spirit...
		mommy flirting But I'll give you my very best try~
		player excited Hehehe...
		t ...
		im repeat2-2-light
		player orgasm Ghouhhhhh~! It's like my soul is being sucked out of my bodyyyy~
		t After a mere few moments of feigned innocence, mommyF is on you like a machine.
		player torogao It's... Too intense!
		t You reach out for something to hold onto for dear life, only for the vacuum-force stimulation to suddenly stop.
		player pent Hah... Hah... Th-
		mommy love ...!
		player scared Uh-oh...
		im repeat2-3-light
		t All motion has stopped, aside from her furiously wagging tail. Her hypersensitive horns were grabbed at full force and a switch has clearly been flipped.
		t And then, suddenly, the room is a blur.
		player panic Wah!
		im repeat2-4-light
		player pleasured Whooooa!!!
		t In the blink of an eye, you're lifted up, up into the air!
		t And the incredible succ resumes, her mouth reaching so deep it's like she's trying to swallow your balls too!
		player orgasm Ghouhhhh~!!!
		mommy Ghhhhlkkk-
		im repeat2-5-light
		t You ejaculate mid-bob, swelling her cheeks and causing some overflow to jet from the sides of her mouth and nose. She wobbles, dizzily.
		player panic Hah... Hah...
		t Though you want to hold onto them for support, you manage to pull your hands off her horns and try not to fall. All you can do now is trust in mommyF's motherly instincts not to drop you, or power-bomb you to the floor.
		t Eyes still alight with lust, she grabs you under each arm and lifts your whole body, pulling your cock free too, before with quivering arms and legs she sets you down onto the floor.
		player panic L-let's get you to bed, before your legs give out.
		mommy love Mmmuh-huh.
		t And so, you gently lead the deer mama to her room, and give her some space to cool down and process her overstimulation with a nice nap.
		mommy orgasm MOUUHHHHH~<3
		t Or through furious masturbation, audible several houses over.
	`},
	{index: "watch-start-mommy", name: "Time Stopwatch - Deer Mommy 1", image: "doe/mommy-watch1-5",
	content: `
		im doe/mommy-watch1-1
		player sparkle mommyF!
		mommy happy ...
		player crying Gyuhhh... No "ara ara", no "oh what a lovely surprise!" This is heartbreaking!
		player worried Well, at least I still have these to play with...
		player confused I wonder how much these things weigh, they have to be at least...
		im doe/mommy-watch1-2
		player worried Six or seven pounds, each! I hope her back's alright.
		player awe Eheh, still though, boobs are great. 
		player happy Hmm. But the best place to focus on would be... Down here!
		im doe/mommy-watch1-3
		player joy Haha! Even squishier! It's like two jiggly pillows!<br>Squish, squish...<br>Hehe, and I can feel where her clitoris is even through these cushions...
		im doe/mommy-watch1-4
		player curious Man, this has gotta be one of the biggest clits in town. Crazy how well hidden it normally is, though.<br>I wonder if she ever gets distracted by how her super thick pussy is basically hugging it all the time.
		player happy Gotta be careful not to let my whole hand get gobbled up like last time.<br>Though, she was grinding like crazy that time, and now she's stiff as a board.
		t ...
		player Alright, that should do it.
		im doe/mommy-watch1-5
		player Just enough fun that you'll spray your daughter with femcum, but not <i>so</i> much that you'll be too tired for some fun with her after.
		player sleep Ah, here I am. Helping a mom and a daughter grow closer to eachother.<br>It feels so nice being a good neighbor.
		player curious Now, the real question is, should I play with doeF too? Or would it be more fun to have just one of them spontaneously put on a squirt-show and let the other watch?<br>Hmm, decisions decisions. !flag doe watchStart;
		player happy Alright, that's both doeF and mommyF played with! ?flag doe watchStart; 
	`},
	{index: "watch-finish-mommy", name: "Time Stopwatch - Deer Mommy 2", image: "doe/mommy-watch3-1",
	content: `
		eval deerStopwatch(); 
		eval unlockScene("mommy", "watch-finish-mommy"); !flag player gallery;
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