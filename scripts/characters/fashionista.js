var character = {index: "fashionista", flags: "", fName: "Riley", lName: "", color: "#E980A5", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"};

var logbookArray = [
	"im images/fashionista/clothed/happy; im images/fashionista/nude/happy; title Tease; fashF is the owner of a local salon here in Syrup Town, specializing in hair and nails. Serving as a walking advertisement, his beautiful pink hair obscuring just one eye is his charm point. <br>He loves all things cute and cuddly, and prides himself on avoiding the predatory vibes he'd naturally give off due to his wolf ancestry.<br>His turn-ons include silk sheets, patting and stroking his head, and cuties who happen to look just like you.",
	"im images/fashionista/logbook2.png; title Extra Charm Point: Bowtie; ?trustMin fash 2; Make no mistake fashF is no slouch when it comes to fashion. His little black vest and yellow bowtie are tailor made to maximize his cute aesthetic. You WILL compliment him. You WILL call him cute. And when your gaze trails down you'll see him leaking and ready, and you WILL bend him over and take him right there.",
	"im images/fashionista/logbook3.png; title Red Rocket; ?trustMin fash 4; fashF's canine cock is almost as expressive as his ears and face. When he's happy and smiling, it will often cutely bob as he wiggles side to side. When he's sad it will hang down and droop. When he's horny, licking his lips and sweating, it will stand bright red and ready, knot throbbing, balls pulsing full of sperm, precum dewing at the tip.",
	"im images/fashionista/logbook4.png; title Fresh to Anal; ?trustMin fash 8; Heat has been an unusual experience for fashF. Always wanting to come off as cute and cuddly, be always felt like something was missing.<br>Now he understands of course, he needed to be dominated, taken, ravaged. What is cuteness, except being assfucked so hard your knot pulses and you spray jizz in submission all over the sheets? What is being adorable, except using your charm to make your partner fuck you harder? These are the real reason his aesthetic and charm points have been so lovingly cultivated.",
];

var achievementArray = [
	{index:"8fashFriend", frame: "ultraRare", name: "Wolf's BFF", requirements: "?trustMin fashionista 8;", description: "Overcome fashF's teasing and become best friends.", image: "fashionista/achievement1",},
	{index:"8fashzBonus", frame: "ultraRare", name: "Steel Will", requirements: "?flag fashionista tease5;", description: "After becoming friends, tease fashF by visiting him multiple times without having sex.", image: "fashionista/achievement2",},
];

var itemsArray = [
];

var shopArray = [
];

var pickupArray = [
	{index: "fashClothes", requirements: "?flag fash House; !item Bowtie;", top: 30, left: 20, event: true, size: 10, image: "items/question"},
];

var morningArray = [
	{index: "morning1", priority: 50, requirements: "?trustMin fashionista 8;", unique: true,},
	{index: "fashionistaMorning-mayor", requirements: "?trustMin fashionista 1; ?trustMin mayor 1;", unique: false,},
	{index: "fashionistaMorning-shopkeep", requirements: "?trustMin fashionista 1; ?trustMin shopkeep 1;", unique: false,},
	{index: "fashionistaMorning-carpenter", priority: 1, requirements: "?trustMin fashionista 1; ?trustMin carpenter 1;", unique: false,},
	{index: "fashionistaMorning-wolf", requirements: "?trustMin fashionista 1; ?trustMin wolf 1;", unique: false,},
	{index: "fashionistaMorning-sadogato", priority: 1, requirements: "?trustMin fashionista 1; ?trustMin sadogato 1;", unique: false,},
	{index: "fashionistaMorning-milf", priority: 1, requirements: "?trustMin fashionista 1; ?trustMin milf 1;", unique: false,},
	{index: "fashionistaMorning-nun", priority: 1, requirements: "?trustMin fashionista 1; ?trustMin nun 6;", unique: false,},
	{index: "fashionistaMorning-mesu", priority: 1, requirements: "?trustMin fashionista 1; ?trustMin mesu 1;", unique: false,},
	{index: "nightmare", priority: 1, requirements: "?trustMin fashionista 3;", unique: false,},
	{index: "hot-1", priority: 1, requirements: "?trustMin fashionista 8;", unique: false,},
	{index: "bath-1", priority: 1, requirements: "?trustMin fashionista 8;", unique: false,},
	{index: "hump-1", priority: 40, requirements: "?trustMin fashionista 8; !flag fashionista hump-1;", unique: false,},
];

var encounterArray = [
	{index: `intro1`, name: `A wolf in a bow tie seems interested in you`, requirements: "?location pineconePlaza; ?trust fashionista 0; !flag player intro;", altName: "", altImage: "",},
	{index: `tease1Intro`, name: `fashF's salon is here`, requirements: "?location willowWalk; ?trust fashionista 1;", altName: "", altImage: "",},
	{index: `tease2Intro`, name: `fashF's salon is here`, requirements: "?location willowWalk; ?trust fashionista 2;", altName: "", altImage: "",},
	{index: `tease3Intro`, name: `fashF's salon is here`, requirements: "?location willowWalk; ?trust fashionista 3;", altName: "", altImage: "",},
	{index: `tease3b`, name: `Check in on fashF`, requirements: "?location willowWalk; ?trust fashionista 4;", altName: "", altImage: "",},
	{index: `tease3c`, name: `Check in on fashF`, requirements: "?location willowWalk; ?trust fashionista 5;", altName: "", altImage: "",},
	{index: `tease3d`, name: `Check in on fashF`, requirements: "?location willowWalk; ?trust fashionista 6;", altName: "", altImage: "",},
	{index: `tease4Intro`, name: `You have a visitor`, requirements: "?location playerHouse; ?trust fashionista 7;", altName: "", altImage: "",},
	{index: `statusQuoIntro`, type: `walking`, requirements: "?location willowWalk; ?trustMin fashionista 8; !flag fash statusQuoIntro;", altName: "", altImage: "",},
	{index: `House`, name: `Visit fashF's house`, requirements: "?location willowWalk; ?trustMin fashionista 8; ?flag fash statusQuoIntro;", altName: "", altImage: "",},
	{index: `stylingIntro`, type: `walking`, requirements: "?location willowWalk; ?trustMin fashionista 9; !flag fash stylingIntro;", altName: "", altImage: "",},
	{index: `pill-fashionista`, name: `fashF is here!`, requirements: "?location willowWalk; ?trustMin fashionista 7; ?holiday pill;", altName: "", altImage: "",},
	{index: `plug1Start`, name: `Ask fashF for help with deityF's artifact`, requirements: "?location willowWalk; ?trustMin fashionista 8; ?trust deity 2; !flag deity gemFash;", altName: "", altImage: "",},
];

var sceneArray = [
	{index: `intro1`,
	content: `
		fash special secret; So, you're...
		im intro
		fash altName ???; The human, hmm? Nice to meet you, I'm <input type='text' id='nameSubmission-fashionista' value='fashF'>.
		button Continue; renameCharacter('intro2')
	`,},
	{index: `intro2`,
	content: `
		fash You're a bit more... <i>Drab</i>, than I was expecting.<br>With how everyone else is abuzz I figured you'd have glowing skin or prehensile hair, something interesting like that.
		player worried No, I know how to get glowing skin, but it's not for me.
		fash sleep Well, you smell nice at least. 
		player excited Can I smell you back?
		fash happy Haha~! I'm glad you have a sense of humor too.<br>I don't think we'd be a good match otherwise.<br>I'm fashF, I run a salon here in town.<br>But I'm closed today. Everyone's all excited about the new arrival, and since we'll all be in heat soon everyone wants to look their best.
		player happy Wouldn't that be good for business?
		fash sleep It means a lot of work, so I'm just not opening today, haha~<br>But feel free to drop by tomorrow, alright? I'll keep my schedule open for you.
		eval raiseTrust('fashionista', 1);
		eval passTime();
		finish
	`,},
	{index: `tease1Intro`,//im tease1-0
	content: `
		fash happy Welcome, welcome~!<br>You took me up on the offer, hmm? Care for a new hairstyle? I've always wanted to see what human hair is like~
		player How much will it cost?
		fash happy No, no money~<br>I just wanna play.<br>I'll even teach you how to do each style so you can change at home. Supplies and everything.<br>How's that sound?
		player worried Well, I'd need a place to store the supplies...<br>But that does still sound like a pretty good deal.
		player happy So what kinda game did you wanna play?
		fash happy Not telling~	
		trans tease1; Continue
		trans cancel; Rain check
	`,},
	{index: `tease1`,
	content: `
		fash happy That's the spirit, now sit down and close your eyes.
		t ...
		eval wearClothesByName('Bowl Cut');
		fash sparkle Ta-daaa~
		player sparkle Oooh~<br>You work fast!
		fash happy Of course. Other townsfolk here have a lot more hair than you do.<br>And like I mentioned if you prefer another style, you can change back on your own time.<br>Here's the hair care case. Now, this brush is bristled, so it's only for...
		player worried Oh geez...
		t ...
		eval addItem("Bowl Cut");
		eval writeEvent('fash-'+data.player.currentScene);
		eval raiseTrust('fashionista', 1);
		eval passTime();
		finish
	`,},
	{index: `tease2Intro`,//im tease2-0
	content: `
		fash Happy Ah, hello!
		player Hiya! You're looking better!
		fash sleep I... Kind of. <br>But hmm. There's something different about you today...
		fash excited <i>Cuuuuute~!<br>What on earth is going on? My heart is fluttering!<br>*He's just as dopey as *he was yesterday, right?
		fash happy *Ahem*<br>Say, care for another new hairstyle? I think I've got a great look for you.	
		trans tease2; Continue
		trans cancel; Another Time
	`,},
	{index: `tease2`,
	content: `
		fash happy Hehe~<br>You got it, now sit down and close your eyes.
		t ...
		eval wearClothesByName('Twintails');
		fash sparkle Ta-daaa~
		player sparkle Oooh~<br>It's longer than it was before?
		fash happy I have some tricks. I guess I should show you them so you can do them at home.<br>By the way, shopkeepF sells a dye for your clothes, it's totally skin and hair safe too, so...
		t ...	
		eval addItem("Twintails");
		eval writeEvent('fash-'+data.player.currentScene);
		eval raiseTrust('fashionista', 1);
		eval passTime();
		finish
	`,},
	{index: `tease3Intro`,//im tease3-0
	content: `
		fash shock playerF!
		player That's me! Feeling any better?
		fash worried More or less. Most of yesterday is a blur. I didn't embarrass myself, did I? 
		player Not while I was here.<br>Unless someone came in while you were soaking in the precum, I'd say your reputation is intact!
		fash worried ... Right.<br><i>Did *he really just stop there? Was I not cute enough to... 
		fash happy Err... So, ready for another new style already?
		player worried Are you sure? There's no need to rush yourself.
		fash frown I'm not!<br>I can handle it, no problem.
		fash happy This time, I bet I'll get to see <i>your</i> embarrassing side.<br>Take a seat. 
		trans tease3a; Continue
		trans cancel; Go back
	`,},
	{index: `tease3a`,
	content: `
		fash happy Perfect~<br>Now, sit down and close your eyes.
		t ...
		fash sparkle Ta-daaa~
		eval wearClothesByName('Ponytail');
		player sparkle Oooh~<br>A simpler design, huh?
		fash happy Right, I've just been a bit distracted lately. It's hard to keep my mind on my work.
		player happy That's fine! You don't have to force yourself. It's not like we need an excuse to hang out.
		fash happy Haha~<br>That's very kind of you to say.
		fash excited <i>What's going on? *He's even cuter than yesterday!<br>This isn't like me. 
		fash worried <i>I mean, slovenly begging for sex like some kind of animal? That's not cute at all.
		fash excited <i>Though, if *he was the one who lost control...<br>Well, I guess it couldn't be helped then.
		t ...
		eval addItem("Ponytail");
		eval writeEvent('fash-'+data.player.currentScene);
		eval raiseTrust('fashionista', 1);
		eval passTime();
		finish
	`,},
	{index: `tease3b`,
	content: `
		eval writeEvent('fash-'+data.player.currentScene);
		eval raiseTrust('fashionista', 1);
		eval passTime();
		finish
	`,},
	{index: `tease3c`,
	content: `
		eval writeEvent('fash-'+data.player.currentScene);
		eval raiseTrust('fashionista', 1);
		eval passTime();
		finish
	`,},
	{index: `tease3d`,
	content: `
		eval writeEvent('fash-'+data.player.currentScene);
		eval raiseTrust('fashionista', 1);
		eval passTime();
		finish
	`,},
	{index: `tease4Intro`,
	content: `
		eval writeEvent('fash-'+data.player.currentScene);
		trans tease4; Continue
	`,},
	{index: `tease4`,
	content: `
		eval writeEvent('fash-'+data.player.currentScene);
		eval raiseTrust('fashionista', 1);
		eval passTime();
		finish
	`,},
	{index: `tease5`,
	content: `
		eval writeEvent('fash-tease5');
		eval addFlag("fash", "tease5")
		eval passTime();
		eval data.player.fashQuoStage = 0;
		finish
	`,},
	{index: `statusQuoIntro`,
	content: `
		fash happy playerF~! Over here~!
		im tease5-0
		player happy fashF~! You're looking good today! The last time I saw you, you were-
		fash Completely fried out of my mind, I know. I woke up today and I was still leaking. I had to take a cold shower to get it to stop...<br>But actually, I'm feeling much, much better now. I think I'm finally getting used to this whole heat thing.
		player sparkle That's great to hear! I was worried about you!
		fash I'm glad too. I was worried I'd have to close up shop for a few days. Maybe letting you plow me into the ground was the right choice after all?<br>If you'd ever like to drop by for a visit, I'd be happy to have you over.<br>This is actually my house, so feel free just to drop in if I'm not at the salon, alright?
		player happy I'll keep that in mind! Thanks for the invite!
		eval addFlag('fashionista', 'statusQuoIntro')
		eval unencounter(data.player.currentCharacter)
		finish
	`,},
	{index: `statusQuo`,
	content: `
		eval fashQuo()
	`,},
	{index: `statusQuoNo`,
	content: `
		player Not today, sorry. Maybe tomorrow?
		fash Oh? Alright then, I'll be waiting~<br>Take care, playerF~!
		eval data.player.fashQuoStage += 1;
		finish
	`,},
	{index: `morning1`,
	content: `
		eval writeEvent(data.player.currentScene);
		eval addFlag(data.player.currentCharacter, data.player.currentScene);
		finish
	`,},
	{index: `repeat1First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval raiseTrust('fashionista', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat1Repeat`,
	content: `
		im repeat1-1
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `repeat2First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('fashionista', data.player.currentScene.replace("First", ""));
		eval raiseTrust('fash', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat2Repeat`,
	content: `
		im fashionista/repeat2-1
		im fashionista/repeat2-2
		im fashionista/repeat2-3
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `repeatTwintailFirst`,
	content: `
		eval addFlag('fashionista', data.player.currentScene.replace("First", ""));
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval raiseTrust('fashionista', 1);
		eval passTime();
		finish
	`,},
	{index: `repeatTwintailRepeat`,
	content: `
		im repeatTwintail-1
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	
	{index: `repeatPonytailFirst`,
	content: `
		eval addFlag('fashionista', data.player.currentScene.replace("First", ""));
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval raiseTrust('fashionista', 1);
		eval passTime();
		finish
	`,},
	{index: `repeatPonytailRepeat`,
	content: `
		im repeatPonytail-1
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `repeatLongFirst`,
	content: `
		eval addFlag('fashionista', data.player.currentScene.replace("First", ""));
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval raiseTrust('fashionista', 1);
		eval passTime();
		finish
	`,},
	{index: `repeatLongRepeat`,
	content: `
		im repeatLong-1
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `fashClothes`,
		content: `
		fash happy Hmm, you seem a bit distracted. Are you that interested in my humble home? I guess I could give you a tour, if you'd like~<br>It's not much, but I'm proud of it.
		player happy Sure!
		t fashF leads you through his home, showing you his bedroom, his bathroom, and his kitchen. It's a small place, but it's decorated all throughout with all manner of cutesy items and palettes.
		fash Ah, a spare! Here, why don't you take this bowtie? It's a little something to remember me by. Ooh, and this vest too, we can match!
		eval addItem("Bowtie");
		button Finish; generateHouse(data.player.currentCharacter);
	`,},
	{index: `stylingIntro`,
	content: `
		t Walking around town, you spy a familiar face through a salon window.
		im styleIntro-1
		fash sleep And that should do it.<br>You look as adorable as ever.
		doe sparkle Thank you~!
		fash happy Just make sure to brush regularly. And tell your mother I said hello.
		t ...
		fash smug Hmm~? Surprised to see me acting so professional?<br>Well, I don't joke around when it comes to hair. A boy like me needs every advantage to be as cute as possible.
		

		fash teasing I consider my style to be just as important to my look as my bowtie. But hair has lots of other uses too.<br>I paid extra attention in shopF's human culture classes to the way humans use their hair in mating rituals. All those different tricks, like how mysterious hair over one eye can be.
		im styleIntro-2
		fash happy And how intimate it can feel to get a peek behind the curtain.
		fash amused If you'd like, we could try some out. I've had fun playing with your hair, maybe it's time I return the favor?<br>I know how to blend extensions into the hair too, so don't worry about the length.
		eval addFlag('fashionista', 'stylingIntro')
		eval fashStylingButtons();
	`,},




	{index: `fashionistaMorning-mayor`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, but the local boutique is buzzing with energy. 
	fash sparkle Gooood morning Mrs. Mayor~!
	mayor Ah, fashF. Was our appointment today? I'd forgotten.
	fash shock Goodness! My, you certainly look like you're in need of some rest! Don't you know beauty sleep is the foundation of beauty?
	mayor worried Wait... Foundation is already a makeup thing...
	fash worried It's the canvas, but good health is the frame the painting rests upon! Madame Mayor, as your beautician I must request you get at least a decent twelve hours each night!
	mayor shock Twelve?!
	fash sparkle At least! Now, let me work my magic. Once those eye-bags are gone and you can see your true self in the mirror, you'll never want to shirk a good beauty sleep again~!
	mayor worried It's not like I <i>want</i> a messy sleep schedule...
	

		trans cancel; Finish
	`,},
	{index: `fashionistaMorning-shopkeep`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, but the local boutique is buzzing with energy. 
	fash Hello~? Pretty kitty~?
	shopkeep We aren't open yet, sorry. And if you're here for the human culture class, that one just wrapped up.
	fash worried Oh, drat. My clock must be messed up.
	shopkeep worried Sorry. This one was a quick one. Here, you could have the study materials, but you'll have to be on time and return them tomorrow.
	fash happy Hmm...? "I want to be mating pressed? Sissies in lust, volume 3"...
	shopkeep sparkle It's a classic! Granted, it's mostly for the male side of things, but the dialogue is a great reference point!
	fash Your study guides always are, although I have to ask, do these really work?<br>I love getting a rise out of others, it's a delicate art, but somehow all you need to do to get a rise out of a human is to say... "Daddy, rape my boypussy harder"?
	shopkeep sparkle Absolutely! Although you have to balance variety, intensity, and the situation.
	fash happy Oh absolutely~! It's a gentle escalation, at least with how I aim to tease. And sincerity is important too.
	shopkeep sleep Hah... You really get it. But sincerity is the most-
	shopkeep shock Gah! No, wait, I have to open! If you get me talking I won't be able to stop! Shoo!
	fash Right. Take care~!
	
		
		trans cancel; Finish
	`,},
	{index: `fashionistaMorning-carpenter`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, but the local boutique is buzzing with energy. 
	fash Helloooo~ carpenterF, you left your door unlocked again~ 
	fash sparkle I know we have an appointment, but letting a big bad wolf into your home like this is really asking too much~
	carpenter Zzz...
	fash worried Asleep again? I can't exactly get a rise out of you like this, can I?<br>Well, you paid in advance, so...
	fash sparkle Mhmhm~ Don't squirm too much in your sleep~<br>A subtle touch today, you won't even notice how much more beautiful you've become~!
	t ...
	carpenter sleep Mmm... Hm...? My eyes feel heavy...
	carpenter shock Oh! My appointment! It's...
	carpenter worried Oh well. I paid in advance, maybe fashF will give me a discount for next time...
	carpenter happy ... Though, that nap was really good. I hope I have another dream like that again soon.<br>... Is my fur shinier today?
	
		
		trans cancel; Finish
	`,},
	{index: `fashionistaMorning-wolf`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, but the local boutique is buzzing with energy. 
	fash Hello hello~ Someone wanted a different look?
	wolf Yes please~! I'm always searching for the next big direction to take my image.
	fash Well then... Hmm... To be honest, I'm not sure where to start. You've got such a strong visual identity to you already...
	wolf Oh please, I'm certain there's nothing you can't do if you put your mind to it. I've heard there's a human expression, "hungry like a wolf", it means you've got a ravenous desire to succeed!
	fash worried ...
	wolf worried ... Did I say something wrong?
	fash No... Well, it's just... "Wolf" is just such a... Strong identity. I've never much wanted that kind of energy to me. I like small, cute things.<br>Sometimes I think maybe if I'd been born a squirrel-
	wolf shock Darling, no~! You're easily one of the softest, squishest folk in town! 
	fash worried ... You're just saying that.
	wolf angry Never! Why, I bet the human can't take one look at you without wanting to pick you up and nuzzle against you all day~!
	fash sparkle Really? To be honest, I do put in my best effort when it comes to teasing, but...
	wolf happy And it shows! Why, if I had a member of my own, I'd... Well...
	fash happy Yes...?
	wolf worried Um...
	fash sparkle Have I caught the town's idol off guard? Please, do tell me, and I know shopkeepF sells strap-ons if you'd like to give a demonstration~
	wolf ... I can't help but feel we've gotten off topic here...
	
		
		trans cancel; Finish
	`,},
	{index: `fashionistaMorning-sadogato`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, but the local boutique is buzzing with energy. 
	fash Madame sadogatoF~? 
	sadogato ...
	fash sparkle Ah, there it is~! That wonderful glare~!
	sadogato ...
	fash excited Hah~! Oh, Madame, you really don't hold back, do you?<br>Mmm, seeing you walk by my boutique each morning, and just glaring at me like that~
	sadogato ... Weirdo.
	fash Hah~!
	sadogato ...
	fash happy Hah, and there she goes. I wonder why she keeps dropping by just to look at me like that?
	fash worried Hmm. Maybe she wants to make an appointment, but lacks the nerve? Maybe if I give her a coupon?<br>Oh, but she might assume I'm saying I could do a much better job at her makeup than her...
	fash sparkle Ooh~! But if that's the case she'll be disgusted with me, even angry~!<br>Goodness, I have to work so hard to get a rise out of the men of the town, but with her I bet she'd snarl and bite at me just from casual conversation~! Okay, time to design a coupon!
	
		
		trans cancel; Finish
	`,},
	{index: `fashionistaMorning-milf`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, but the local boutique is buzzing with energy. 
	fash sparkle Okay~! Time for a whole new look! And if we're lucky, this time, the woman in the mirror will be the real you~!
	milf worried R-right... At least 'till it washes off...
	fash shock Oh no no no~! Madame, surely you aren't saying that! Makeup isn't just something you apply to your face, it's not some mask, it's a glimpse at the real you underneath the skin!
	milf I don't really get it.
	fash happy Oh honey, listen. The 'real' milfF isn't the dirt on your body, it's not the sweat, it's the soft smile you give to passers-by. We choose to act friendly to others because we <i>are</i> friendly, the good deeds we do are showing others our true selves.
	milf worried S-so...
	fash So you are beautiful! You didn't choose your face or your shape, but you can choose how you present yourself, and you're choosing to be your beautiful self today! Now, let's highlight those natural tones on the eyes today, yes?
	milf happy And I'll be pretty?
	fash sparkle Gorgeous~!
	
		
		trans cancel; Finish
	`,},
	{index: `fashionistaMorning-nun`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, but the local boutique is buzzing with energy. 
		fash Ah, there she is~! How is my most lovely customer doing this morning? Any plans?
		nun Well... No, not yet. I try to keep a light schedule in case the human drops by.
		fash smug Ever the maiden in love, aren't you?
		nun pent We barely know each other, but it seems like every interaction involves you teasing me.
		fash sparkle Involves me <i>trying</i>, honey. Now, lay back. I swear, every time we're done I feel like your eyes are my newest masterpiece.
		nun sleep Mmm, yes. Thank you, I don't know what I'd do without you. The blue is such an important part of the look.
		fash laughing It'd be like you without your habit. Speaking of, maybe today-
		nun frown No. Eyes and face only.
		fash amused There's the self-consciousness again~<br>I'm sure that head of yours looks stunning. 
		nun pout No. Never, absolutely not!<br>W-well...
		fash teasing Only for your future lover, yeah yeah yeah. Okay, now just relax...
		trans cancel; Finish
	`,},
	{index: `fashionistaMorning-mesu`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town, but the local boutique is buzzing with energy. 
	fash sparkle Ooh~! It's you~! Here for another bit of data collection?
	mesu worried N-no. I was, um... Thinking about making an appointment.
	fash Even better~! So, do you need a refresher? What's your normal routine?
	mesu I... Don't really have one?
	fash worried ...Excuse me?
	mesu shock I, I mean I-
	fash sparkle You look like this <i>naturally</i>?! That's incredible! Oh you adorable little creature, I absolutely must have you take a seat!
	mesu worried N-no, maybe this isn't-
	fash Those eyes are gorgeous, I can't help but want to focus on them first. Maybe some eyeshadow... Hm...
	mesu shock P-please don't tease me! I... I shouldn't have come here...
	fash shock Wait! Come back!
	fash worried ... Drat. He's gone.<br>What a lucky guy, I wish I was born with a face like that. Such a cute little cocktail shrimp between his legs too.<br>It's such a waste, a perfect canvas without a hint of paint.	
		
		trans cancel; Finish
	`,},
	{index: `nightmare`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		player tired Mmmgh... Huh?
		fash happy See? This is how it's supposed to be.<br>No more sex, no more naughty stuff...
		im nightmare
		player scared H-huh?! H-h-handholding?! With interlocking fingers?!<br>NOOOOOO-!
		t *Thud*
		t You rub your head gently as you wake up from a horrible nightmare.
		player cry Oh... Thank goodness... Just a dream.
		finish
	`,},
	{index: `hot-1`,
		content: `
			t It's a brand new day in syrup town...
			t And it's an absolute scorcher!
			im dot1
			fash perverted Mhmhm~! I'll need a shower anyways, can't look anything less than fresh...<br>So I can pump precum all over myself as much as I like~!
			fash orgasm Hohhh~<br>Ooh, I wonder if the human is as sweaty as I am?<br>If I imagine hard enough... Maybe I can taste it on my tongue...<br>Maybe if I manage to cum all by myself, I'll have enough brain stuff left to put some <i>real</i> moves on playerF~!
			trans cancel; Finish
		`
	},
	{index: `bath-1`,
		content: `
			im bath1
			fash sleep Haaaaah~!<br>This is the life~!
			fash happy Quacker Jack, can you believe anyone ever showers when bubble baths are so nice~?
			t The wolf-boi picks up the rubber duckie and answers himself with a *SQUEAK*
			fash sleep Haha, me neither!
			trans cancel; Finish
		`
	},
	{index: `hump-1`,
		content: `
			eval addFlag('fash', 'hump-1')
			eval writeEvent('hump-1')
			trans cancel; Finish
		`
	},



	{index: `placeholder`,
	content: `
		eval writeTest('`+character.index+`')
	`,},
	{index: `wall1-1`,
		content: `
			eval writeEvent('wall1-1')
			trans wa1-2; Continue
		`
	},
	{index: `wa1-2`,
		content: `
			eval writeEvent('wa1-2')
			eval addFlag('fash', 'wall1')
			eval addFlag('carpenter', 'dailyWall')
			eval passTime();
			finish
		`
	},
	{index: `plug1Start`,
	content: `
		player worried fashF, I need your help.
		fash surprised Oh? You sound pretty serious this time. What's up? Anything you need, I'm right here.
		player happy Ah, that makes this a lot easier!<br>Okay, so there's this talking dog who's not a ghost, and something about the forest, and...
		t ...
		trans plug1Finish; Continue
	`,},
	{index: `plug1Finish`,
	content: `
		event plug1;
		eval addFlag('deity', 'gemFash');
		eval passTime();
		finish
	`,},
	{index: "pill-fashionista",
	content: `
		eval writeEvent(data.player.currentScene)
		eval data.player.time = "Night";
		eval data.player.holiday = "";
		finish
	`},
	{index: `cancel`,
	content: `
		eval unencounter(data.player.currentCharacter);
		eval changeLocation(data.player.location);
	`,},
]

var fashSmallTalkArray = [
	{requirements: `Shirt`, content:`
		wolf sparkle I love your shirt by the way! It's got such an ordinary, yet approachable charm!
		wolf excited It's hard not to want to lean in to the sleeve and take a deep breath of your scent, to be honest~
	`},
]

function fashQuo() {
	writeHTML(`
		fash excited Mhm~ I knew you couldn't resist~<br>So, what are we doing today?
		trans repeat2First; Ask to pet fashF !flag fash repeat2;
	`);
	writeQuoRepeats();
	if (checkFlag("fash", "stylingIntro") == true) {
		if (checkFlag("fash", "repeatTwintail") != true || checkFlag("fash", "repeatPonytail") != true || checkFlag("fash", "repeatLong") != true) {
			writeHTML(`
				fash teasing Or... Maybe you're here to tryout a new hairstyle? I might have one or two left to try out.<br>That is, if you're feeling creative~	
			`);
			fashStylingButtons();
		}
	}
	writeHTML(`
		trans statusQuoNo; Go back
	`);
	if (data.player.fashQuoStage == 4) {
		writeScene("tease5")
		addFlag("fash", "tease5")
	}
}

function fashStylingButtons() {
		if (checkFlag("fash", "repeatTwintail") != true) {
			writeHTML(`trans repeatTwintailFirst; Twintails - Perfect Blowjob Handlebars`);
		}
		if (checkFlag("fash", "repeatPonytail") != true) {
			writeHTML(`trans repeatPonytailFirst; The Ponytail - Something to Grab from Behind`);
		}
		if (checkFlag("fash", "repeatLong") != true) {
			writeHTML(`trans repeatLongFirst; Long Hair - The Length Needed for a Hairjob`);
		}
}

var eventArray = [
	{index: "fash-tease1", name: "Basic Care", image: "fashionista/tease1-3",
	content: `
		t After quite the lengthy explanation, fashF hands you all the tools you need to take better care of your hair.
		player sparkle Alright! I think I got everything. So, about that game you wanted to play...
		fash happy Hmm? Sure, I said we'd play, but it's not really a game.
		player worried Oh...
		im tease1-1
		fash So, whatever it is you're wearing down there, take it off pretty please, I wanna see what humans look like down there.<br>Truth be told all this 'heat' stuff actually sounds pretty exciting. 
		player shock Eh? Right here? What if someone comes in?
		fash sleep Ehehe~<br>You're cute when you're flustered.<br>But don't worry. The whole point of you living here is to spread those pheromones, right?<br>I'm surprised our madame mayor even lets you wear anything at all.
		player worried I guess you have a point...
		t You disrobe. Even though the shop's door is closed, it does feel just a bit breezier.
		fash worried Hmm. It's more plain than I was expecting too. Sure it's big, but...<br>Hmm, something about it seems so...<br>So...
		im tease1-2
		fash excited ... <3
		fash shock Wah!<br>Sorry, just a bit frazzled there for a moment. 
		player happy No worries. So, how do I look? Should I turn around? Get hard? It's bigger when-
		fash shock Eh? Bigger?
		player sleep Sure! Take a look!
		t While the situation's a bit unusual, you've decided to roll with it. When in the town of fluffy perverts, do as the fluffy perverts do.
		player happy <i> That could definitely be a real saying. Probably.
		t Focusing on fashF's reaction and his super cute fluffy tail swaying from side to side, you quickly reach a full erection.
		im tease1-3
		fash excited ... <3<br>It's... Ohh...<br>It's got its charm, that's for sure... I think I like it better than mi-
		fash torogao Khh-
		player shock Whoa, you okay?
		fash excited Y-yeah! Totally fine. Though I'm... Leaking?<br>As I was saying that it felt like a switch flipped in me, or something like that...<br>I think, uh, I need some time to get used to... Whatever's going on with me...
		player happy Ah, that's probably the heat. I guess in guys it means you'll find a cute lady and have kids, right?
		fash shock N-no! Pl-
		fash worried ... Eh? That was a weird reaction.
		player worried Yeah. I'll let you have some alone time.<br>Feel better soon!
		t You get dressed, noticing that fashF's eyes seem to follow your every movement very closely.
	`},
	{index: "fash-tease2", name: "A Light Buzz", image: "fashionista/tease2-1",
	content: `
		t After quite the lengthy explanation, fashF hands you all the tools you need to take better care of your hair.
		player happy Alright! So, am I paying with muns this time, or-
		im tease2-1
		fash excited Of course not~<br>This time I'll be taking a closer look, thank you very much~
		player shock A very close look...!
		fash excited D'aww, shy?
		player frown No way!
		t You quickly take your cock out, and like a switch has been flipped, fashF looks like he's entranced.
		fash shock <i>Haa~How can a derpy little *guy like *him have something so... So...
		fash excited <i>I don't even know what it is about this thing that I like...
		player excited You're staring really hard.
		fash Could you... Stroke it? For me?<br>Back and forth... Slowly...
		player sparkle Of course~!
		fash Yes~<br>Hah... That's it, just like that~<br>I'll just... Take a...
		im tease2-2
		fash torogao Ghh~!<br><i>What is this?! It's electric!<br>Is this what cumming is supposed to feel like?
		fash excited I didn't even actually start yet...
		im tease2-3
		player excited So cute~! 
		player worried <i>I gotta hold back though... Just the smell of me is messing with his head...<br>Stroke slowly, don't think about his...
		player pleasured Ghh...
		fash shock E-eh?!
		t *SPLURT*
		im tease2-4
		player shock Sorry! I got some precum on...<br>fashF?
		fash shock ...!
		player shock You're completely fried!<br>fashF, snap out of it!
		t His face splattered with your precum, fashF's olfactory sense starts working overtime trying to comprehend what's happening.
		fash excited Ah~<br>Haha~
		im tease2-5
		fash ahegao Ahaha~
		t His penis dribbling and leaking, despite your best attempts to bring him back to reality fashF is lost in his own little world.
		t The overwhelming influence of even the tiniest bit of you requires his entire brain to process.
		player worried ... That's a shame. Sorry fashF, I'll have to let you recover, huh?
		fash Ahahaha~!
		player happy Well, at least you're having a good time.<br>See you later!
		t You wave to the tittering wolf boy as you leave.
		player worried ... Should I have cleaned him off first?
		player sleep Nah, it'll work itself out. Probably. 
	`},
	{index: "fash-tease3a", name: "Tantalizing", image: "fashionista/tease3a-3",
	content: `
		t After quite the lengthy explanation, fashF hands you all the tools you need to take better care of your hair.
		t But afterwards, instead of taking a seat himself, fashF just goes straight to packing things away.
		im tease3a-1
		fash happy It's such a shame, I've got a client coming in soon, I just can't spare a second to play today~
		player worried Aww...
		fash excited Soooorry~<br>If only there were something, or someone...
		im tease3a-2
		fash excited Who could <i>force</i> me to squeeze you in~
		t Letting every word slide off his tongue, fashF's tail dances around every time he bends over, the pattern on his ass and at the back of his tail perfectly encircling his anus, which he almost seems to be purposefully flashing at you.
		player happy Yeah, it's a shame. But we can always hang out tomorrow!
		fash worried ... That's not what I-
		player Well, I won't keep you then. See you later!
		fash ...
		t Not wanting to bother your buddy, you head out.
		fash frown ... Damnit.
		t ...
		im tease3a-3
		fash torogao Nghhh~! <br>Damnit damnit damnit! 
		fash worried It won't calm down...<br>Why'd I have to get so into teasing *him?
		fash excited No, I'm sure *he's on the verge of cracking right now! I bet *he's running right back here, actually!
		fash ahegao And when *he sees me like this... Hah~!
		t ...
		player Hum dee dum~<br>Alright, what to do for the rest of the day... 
	`},
	{index: "fash-tease3b", name: "Public Nudity", image: "fashionista/tease3b-3",
	content: `
		player Ring-a-ling~<br>fashF, are you in to-
		outfit fash nude
		im tease3b-1
		fash Hello~
		player shock Whoa! Sorry, I didn't realize you were changing!
		player worried In the... Middle of your store. When you don't wear pants anyways.
		fash worried What's the big deal?
		player happy ... I'm not really sure why I was so shocked there. Nudity isn't a big deal here, is it?
		fash worried Not really.<br>Though not having my tie on does feel a bit... Off.
		fash excited Buuut~
		im tease3b-2
		fash There's something freeing about being totally... Vulnerable, like this. You like my fur, right?
		player sparkle Do I?!
		fash Of course you do~
		fash worried Oh, but wouldn't you know it, I'm not free today either.
		player worried Aww... Busy day?
		fash excited Ehehe~<br>No, nobody's coming over. I'm just taking the day to focus on myself.<br>I guess I'm going into heat, I've been <i>aching</i> all over...<br>I wish someone could help me deal with all these... <i>Urges</i>...
		player happy Well, I bet shopkeepF could help! And mayorF probably knows something too.
		player worried But, I guess I'm not helping by just standing here, huh?
		fash worried No, you're-
		fash sparkle Wait, yes! Yes, this is all because of you...
		im tease3b-3
		fash excited All these horrible, nasty wants and needs I've been feeling...<br>It's time for you to take responsibility~
		player shock ... You're right!
		player frown I'll get out of your hair right away, being around me will only make your heat worse!
		fash shock No, that's not-
		player happy See you later!
		t In a flash, you've darted out of the salon.
		fash angry ... *He's already gone...
		fash frown <i>Clearly I'm underestimating *him. Nobody's this dense, this must be a trick, I bet *he thinks *he's got me dancing in the palm of *his hand.<br>If I could only figure out what's going on in that head of *his...
		t ...
		player happy Hum dee dum~<br><i>Man, fashF's fur looked extra soft today~<br>I hope he feels better soon so I can touch it~ 
	`},
	{index: "fash-tease3c", name: "Soft Like Velvet", image: "fashionista/tease3c-1",
	content: `
		t You take a step into the salon, the bell jingling as you do.
		t Now, this is a bit of a curious situation. On one hand, here's the vibe fashF <i>wants</i> to be putting off.
		im tease3c-1
		outfit fash nude
		fash Oh, playerF~<br>How nice of you to join me~
		fash excited Honestly, this heat is just <i>unbearable</i>! Even my soft, velvety paws, which feel amazing on my cock, aren't enough to calm me down~<br>Maybe you have something that can?
		t But unfortunately, this is the image you actually see, stepping inside.
		im tease3c-2
		fash torogao Khhh~! Gh... playerF! P-paws, cock~!<br>Heat!
		player shock Holy moly! You splurted right as I walked in! 
		player worried Guess you're not good for today either. Try to stay hydrated, alright? Do you need anything?
		fash torogao Nghh...
		player I guess not. I'll check on you tomorrow. See you around!
		fash ahegao Haaah~! 
	`},
	{index: "fash-tease3d", name: "Replaced By a Toy", image: "fashionista/tease3d-1",
	content: `
		player worried fashF? You in here?
		outfit fash nude
		fash excited In the back~!
		player sparkle Ooh, he sounds way better!
		im tease3d-1
		fash excited Nn... playerF! Good to see you~<br>I dropped by shopF's place... And she helped me find some things to help deal with the heat~
		player sparkle That's great!
		fash Mhm~ It t... Turns out anal and I are a p... Perfect match~!
		fash ahegao Hah~! It's such a shame~! I bet you can barely hold back, right? But it's... It's not like I <i>need</i> a real, fat, pulsing cock in my ass at all~!
		player sleep It's not a shame at all. I'm glad you're finally managing the heat.<br>Plus it's not like I'm that pent-up anyways. 
		fash shock Eh-?! N... No-
		im tease3d-2
		fash torogao Nghhh~!<br>No way! You mean... You haven't been... <br>Chomping at the bit to pin me down and... Ngh...
		player worried I wouldn't do that to my buddy!
		player happy Well, unless you wanted it, I mean. Everybody has their own tastes.
		player sleep Anyways, I'll let you get back to it. 
		fash frown N-no, I...
		fash torogao Khhh~
		player shock Geez, you squirt a lot from anal!<br>Or maybe you aren't as used to the heat as you thought.
		player worried Maybe my repeat visits are doing more harm than good.<br>I should probably hold off on visiting for a few days.
		player happy I'll see you around, bye!
		fash Ghh... W... Wai...
		t As you leave, fashF attempts to stand, his legs shaking more and more with each bump of the nubby dildo that rubs against his prostate.
		t *SCHLURRRRRP*
		t Until all strength leaves them just after the bulbous tip pops free, and he falls in a heap onto the floor.
		fash ahegao Hooooh... Ffffuck...
		im tease3d-3
		fash My asshole... Won't even close properly...<br>But it's still not enough...<br>Legs won't... Move...<br>Did I just... Lose to *him? 
	`},
	{index: "fash-tease4Intro", name: "Snapped Pt. 1", image: "fashionista/tease4Intro-3",
	content: `
		t Seeing someone approach, you open the door.
		outfit fash nude
		player shock fashF?!
		im tease4Intro-1
		fash happy Hiya...
		fash excited I can't take it anymore...
		player worried The heat symptoms aren't fading? I'm sorry...<br>I guess me being in town at all is too much...
		fash Scootch, I want in.
		player Sure... 
		player shock Wait, wouldn't my pheromones be super intense in here? This is where I sleep!
		fash Cute bed...
		im tease4Intro-2
		fash Actually, I am curious. Let's see what this does to me.
		fash sleep ... *Sniff* *Sniff*
		player worried ... Anythi-
		im tease4Intro-3
		fash ahegao Hoooohhh~<br>It's very... You~
		player shock fashF, this could be dangerous! You could give yourself brain damage or something!
		fash excited You think so? That sounds kinda fun.<br>Look, the truth is, ever since I got a taste of what you've got churning in those balls, only one thing's been on my mind...
		player worried ... I don't suppose it's friendship?
		fash excited Sex. Fucking. I need you to mate with my ass.<br>All this teasing has been backfiring, I can't stop thinking about how much I want you to press me into the floor and pummel my butt until we make a crater...
		player shock Goodness!
		player happy Well why didn't you say so? I could have done that anytime!<br>If my friend needs to get fucked into a squirting mess to get back to normal, I'll happily oblige!
		fash ... You win this one, I can't fight back anymore... 
	`},
	{index: "fash-tease4", name: "Snapped Pt. 2", image: "fashionista/tease4-1",
	content: `
		im tease4-1
		fash worried I know it's not cute to beg like this, but... I really need it.
		player Don't be silly, everything you do is cute! Every hair on your body is adorable!
		fash excited Y-you're just saying that...
		t You sigh, it seems like he's not getting the message.
		im tease4-2
		t There's just the slightest bit of give as you press the head of your cock against his asshole, like you're about to fuck a marshmallow onahole.
		fash Hah... It's like they're kissing~<br>Okay, now...
		fash ahegao Puuuush~~
		im tease4-3
		fash excited Hah~<br>Don't be gentle, alright? I already know my ass can take a lot and still be left wanting...
		player worried Geez...
		player excited Welp, you asked for it.
		fash Ohhh~
		t And so within seconds his needy whines are overwhelmed by the sounds of your balls clapping against his.
		im tease4-4
		fash torogao Hoh~! Ghoough~!<br>Finalllyyyy~!
		fash ahegao This is it~! This is what I've been missing~!<br>Fuck, fuck, fuck~!
		t Every thrust is accompanied by a pleasured yelp, a swear, or some blurred mix of the two.
		t And despite how hard he tries to push back against each thrust, each time your cock slides over his very eager prostate his body gives out and he sinks deeper into your sheets.
		fash torogao Nnnghhh~!!!
		t Bathing his brain in your scent.
		t Raising his head like he's coming up for air, he's hoping for a moment to allow his brain to fully process the full extent of the anal pleasure...
		im tease4-5
		fash MGHHHH~!
		t Only to feel his tummy start to fill with warmth. A warmth much more intense and jam-packed than the precum his face had bathed in days before.
		fash ahegao Ghoouuuhhhhhg~<3 <br>Matingggg~<3
		t With each pulse of cum, you see him shiver from his toes all the way to the tip of his tail.
		fash Haaaah~
		t And as you tug yourself free, the sound of a cork-like *POP* fills both your ears.
		im tease4-6
		fash ahegao Hah~<br>It's... Clear... My head is...
		fash excited Need... Rest... You'll visit my salon again later, right?
		player excited Of course! Hanging out with friends is the best!
		fash happy Hah~<br>I guess we are pretty close now, huh?
		fash excited Well, as for being friends... If you can handle getting teased a little, I guess I wouldn't mind keeping my door open for you anytime.
		im tease4-7rosebud
		fash Because I'd love to take another shot at turning you into a ferocious beast of lust with this ass of mine~<br>Think you'll be the one to break first next time?
		t ...
		special You've become best friends with fashF!	
	`},
	{index: "fash-tease5", name: "Tease Resistance", image: "fashionista/tease5-6",
	content: `
		player fashF? Hello? I thought I'd drop by for a quick visit~!<br>I dunno how long I can stay though, I'm suuuper bus-
		player shock Wah!
		im tease5-6
		fash Got you~!<br>See, I know I <i>said</i> I could hold back, but...
		fash excited Sorry, I can't wait even one more second. I need my ass stirred up, I can't stop thinking about your cock every single second of the day anymore~
		player I guess that means I win again?
		fash Maybe, though I'm still the one getting fucked, so who's the <i>real</i> winner here?
		player excited Well, either way, you should get onto the bed. I think I can thrust faster than you can bounce.
		fash That's the spirit~!
		t You take the twinky little wolf and lay him down.
		im tease5-7
		fash happy Hmhm~<br>Does handling me like that make you feel all big and-
		im tease5-8
		fash excited C-cock~<br>It's pressing against my butt, so hard and warm~
		player It's like flipping a switch with you!<br>You go right from teasing little brat to a thirsty puppy in a second!
		im tease5-9
		fash Hooh~<br>What can I say? You just have that sort of effect on me? Ehehe~
		t He lets out a soft titter as he speaks, struggling to keep his eyes from rolling back with every inch spreading him out.
		fash B-but I bet I can last longer than last time at least~
		t ...
		im tease5-10
		fash torogao Ghhh~! Cumming~<br>Your huge human dick is making mine squirt hands-freeee~!!!
		t Each of your thrusts is hard enough to shake the bedframe, at his request of course. Keeping up with the bratty pup's tastes for a rough pounding is taxing, but your competitive spirit won't let you give up until...
		fash Ghh, mercyyy~<br>My cute little prostate~<br>It'll never recover~~~
		player excited That sounds like surrender to... Me!
		t With a slow *SCHLOOORP* you pull yourself free of the twinky wolf's greedy butthole
		im tease5-11rosebud
		fash Ghhh~<br>My butt~ My butt feels too gooood~
		t Shivering like a wet dog, his own red rocket splatters a load of cum onto his chest, although it's nowhere near as thick or voluminous as the load leaking from his ruined ass.
		fash ahegao Tummy~<br>Warm and full~<br>Cummmming~
		t And so you wipe the sweat from your brow. A good day's work finished and a friend in need satisfied. What a productive afternoon!
	`},
	{index: "repeat1", name: "Repeatable - Oral", image: "fashionista/repeat1-1",
	content: `
		player So, you think this'll turn out better than last time?
		im repeat1-1
		fash Hmm? Oh, no idea. But I bet it'll be just as fun~
		player worried ... Isn't this supposed to be training to help you get used to being in heat?
		fash excited Sure! Whatever gets you pumping down my throat the fastest. That's the excuse we'll go with.
		player worried Geez, take this seriously, will you?
		player happy Let's start with a caaaareful, small whiff.
		im repeat1-2
		fash happy R-right, right. I can handle it.<br>*Sniff* *Sniff*
		fash excited S-still in t-total control~
		player sparkle Great! Okay... Now...
		fash A little kiss~
		im repeat1-3
		player excited W-whoa there...<br>Restraint should be one of the first areas we f-focus on!
		fash Restraint, of course... I've got plenty~<br>Watch~!
		im repeat1-4
		player ahegao Wah! Wait
		fash ahegao Ghllll~
		player torogao H-how is this showing self control?!
		fash ahegao Glllhll~<br><i>Silly human~<br>Does *he not know how much restraint it takes to go throat-deep on this slab~? Maybe *he just doesn't appreciate how hard it is to be a cutie tease like me around such prime meat~<br>Time to teach you a lesson~!</i>
		player W-wait, if you move your tongue like that-
		im repeat1-5
		player ahegao Cumming~!
		fash ahegao Mmm~!<br>*Gulp* *Gulp* *Gulp*
		player Hohhh~
		player shock Wah! Wait, if you drink that much all at once-
		im repeat1-6
		fash ahegao Ehehe~<br>It tingles on my tongue... My head feels funny and numb~
		player sparkle Hey, you're still able to speak properly! You're definitely acclimating!
		fash More please~ Ehehe~
		player happy Or... Maybe you're already out of it and just babbling.<br>Well, progress is still progress.

	`},
	{index: "repeat2", name: "Repeatable - Heavy Petting", image: "fashionista/repeat2-1", requirements: "?flag "+character.index+" repeat2;",
	content: `
		fash amused Are you insane? You're not touching this hair.
player scared ...!
t It hits you like a thousand knives. The color drains from the room, and your whole life.
t It's the pain of true loss. Of a part of your soul being gone.
player crying The light of my life has gone out... What even is there left...?
fash curious Where is...<br>Are you muttering something over there?<br>Not that drawer...
fash joy Ahah!
im repeat2-1
fash amused Here. It's far too messy. And it's about time I show you how to <i>properly</i> appreciate someone's fur.<br>Actually, let's start with the tail.
player love Hoh~<3<br>Suddenly, life is beautiful again...!
t ...
player Am... Am I doing it right?
im repeat2-2
fash perverted Y-yeah, buddy, just like that...<br>Focus on the tail, just the tail, alright? I'll be moving my arms, maybe my hips too, but just keep brushing.
player Brushy... Brushy...
player perverted Hmmm~<3 Such an amazing sensation!<br>All the sound and resistance of fur, but instead of making it messy and ruining it with my sweaty hands, I'm making it even prettier~!
fash forced Fhhhh~<br>Fuck, these puppies are hard as diamonds... Just the slightest breeze~<br>You're d-doing great back there!
player love Hoh... But... M-maybe just...
fash orgasm Houghhh~! My knot's throbbing!<br>I thought a nipplegasm would be hard but... I won't even need my hand...!
player C-can I... Can I-
fash flirting Y-yes! You've been so good, you can pet my t-tail now, but... Only for a short w-while... On three... O-one...!
player excited <3
fash forced T-two! Holy shit, you're sweating so much... Three!
im repeat2-3
fash torogao FFFFUCK~! I'M KNOTTING HANDS-FREE~!
player afterglow SOOOOFT~<3
t It's genuinely the softest, fluffiest tail you've ever touched. The prized possession and magnum opus of the town's top fur-care specialist, it's overwhelming, too much for the mortal mind.
t Meanwhile fashF's balls pulse as he humps into the floor, working out an orgasm with his hands behind his head, but your mind is laser-focused on this godlike tail.
t It's been completely minmaxed for softness, there's not a hint of the natural rugged bristlyness of a wild wolf. It's pure soft.
player love Amazing...
fash afterglow Y-yeah... That was the... Third one...<br>I... I can't believe you're still holding back from... From taking my bare, defenseless ass...<br>You win this one...
player Did you say something, fashF?
fash broken ...<br>Zzz...
	`},
	{index: "repeatTwintail", name: "Twintails - Perfect Blowjob Handlebars", image: "fashionista/repeatTwintail-1", requirements: "?flag fashionista repeatTwintail;",
	content: `
		fash amused Hmmm? Twintails? Well, they certainly give a youthful look, don't they?
		t fashF brings out a small box of supplies. Hairties, extensions, special brushes, bottles, and some tools you don't recognize.
		t Over the next few minutes he gets to work, having you help get areas he can't reach himself.
		t His usual teasing tone seems to fade into a much more professional one, but once you're finished he hops off his seat and switches back.
		im repeatTwintail-1
		fash teasing Ta~Da~<br>How do I look? Does it suit me?
		player sparkle Cyuuuuute~!<br>You look adorable, can I touch them?
		fash excited Oh, you can do more than touch them~<i><br>Heh heh, got *him! *He's totally fallen hook, line, and sinker~</i>
		t ...
		player curious Hmm... So, you said there were other uses for twintails, beyond just looks?
		im repeatTwintail-2
		fash love Hahhh~<br>They... Hoooh...<br>Huh?
		fash teasing Ah! Right, well, grab ahold of them and you'll see, trust me~
		im repeatTwintail-3
		fash love Hoh~<br>Ghlllgh~!
		player befuddled Hmm, sorry, I don't think I get it... I could just push on the back of your head for irrumatio, I don't...
		player joy Oh, wait, I see it now! 
		im repeatTwintail-4
		fash Klgggggh~!
		player sparkle It's the pull-out!<br>It's not like I have any trouble forcing your throat open, you're cock-hungry all the time, but now I have some leverage to pull you back off!<br>This totally blows the doors open for way rougher sex!
		player worried Err, if that's what you want...
		fash ahegao Mmmph, mm, mm-hmm~! Mmm-hmm~!<br><i>Hoh, yes please! Grab hold of these fuckhandles and treat me like a-
		im repeatTwintail-5
		fash orgasm GHHHHLLLKKKKK-<br><i>Ohh~<br>This is sooo terrible~<br>I was supposed to use these to seduce him and be all bratty, but...<br>All I can manage to do is want *him to throat me even harderrrr~!!!</i>
		player pleasured Nghh...!!
		im repeatTwintail-6
		fash GHLLLLKK~<3
		player pent *Huff*... *Huff*...<br>Sorry... Got a little carried away there.
		player happy Alright, let's pull you off.
		t *SCHLRRRRRRP*<br>*SCHLRRRRRRP*<br>*SCHLRRRRRRP*
		im repeatTwintail-7
		fash afterglow Ah... Ahaha~
		player sparkle Oooh~<br>That was a lot of fun, wasn't it?<br>You used extensions for these, right? Hopefully I don't break them...
		fash Ahaha~!
		player sleep Well, looks like you're out of it.<br>I'll let you digest all this. See you later~
	`},
	{index: "repeatPonytail", name: "Twintails - Perfect Blowjob Handlebars", image: "fashionista/repeatPonytail-1", requirements: "?flag fashionista repeatPonytail;",
	content: `
		fash amused Hmm? A ponytail? I don't know if I'm a good fit for a sporty look, but since you're asking so nicely...
		t fashF brings out a small box of supplies. Hairties, extensions, special brushes, bottles, and some tools you don't recognize.
		t Over the next few minutes he gets to work, having you help get areas he can't reach himself.
		t His usual teasing tone seems to fade into a much more professional one, but once you're finished he hops off his seat and switches back.
		im repeatPonytail-1
		fash happy Ta~Da~<br>How do I look? Does it suit me?
		player sparkle Oooh! So cool!
		fash excited Ehehe, and it's sturdy too, wanna test?<br><i>Hmm, I remember reading the nape of the neck is appealing to some humans...<br>Maybe that's why seducing *him hasn't worked out so far?<br>If so... Maybe I'll finally have *him hooked on me~?</i>
		t ...
		player curious Hmm... So, what exactly are the advantages of a ponytail, compared to your...
		player excited Your fluffy... Wonderful tail...
		im repeatPonytail-2
		fash perverted Ohh~<br><i>Holy fuck... It feels even bigger than last time</i>
		fash surprised Oh! R-right, ehehe~<br>Well, as <i>rough</i> as I'd like you to be with me, the angle of my tail is...<br>Actually, just grab on, lets get started, and you'll see for yourself, okay~?
		player confused Hmm... Alright.
		im repeatPonytail-3
		fash perverted Hgh~!<br><i>Is this... It's working...<br>I'm getting fucked again... And I'm gonna love it~<br>What was I even doing this all for, anyways?</i>
		player happy Ohhh, I get it now, yeah! This is a way better leverage point!<br>I'm surprised, given how much you like talking about cuteness, I figured you wouldn't know much about stuff like this.
		im repeatPonytail-4-masc-light
		fash blush Ehehe~<br>It... Ghh... It's nothing~<i><br>What... Is... My body's shivering all of a sudden...</i>
		player sparkle It's not nothing<br>I think your versatility is charming!
		fash love Ohh~ Is that so~?<br><i>Are my seduction attempts finally working? Maybe I should just lean into it...<br>I mean, who wouldn't finally fall for me after all this?<br>*He'll finally be... Mine...</i>
		im repeatPonytail-5
		fash perverted Ehe, ehehe~! All for me~!
		t Surprisingly, instead of the usual spouting of moans, all Riley seems to be letting out (aside from a torrent of precum) is a series of growingly manic giggles.
		im repeatPonytail-6-masc-light
		fash Ehehe~ Ahaha~! Finally~! I've won~!
		player befuddled Eh? Were we competing?
		player amused Ohhh, I get it. That's what you meant by 'sporty'!<br>What are we competing in?
		fash ahegao Ahaha~! Can't... Stop cumming~! Leaking right out of my body, broken, ahaha~!
		im repeatPonytail-7
		t True to his word, it's like some kind of stopper on fashF's own bouncing cock is gone. Every squish of his p-spot is squeezing the cum right out of his totally relaxed body.
		player surprise Oh! I get it!<br>It's a cumming competition, and you practiced a new skill, huh? Honestly, I don't know if I can beat that.<br>Hmm, you're basically orgasming like a girl while shutting off your brain.
		player amused Well, if your strategy is just to empty out your prostate, I can just do that too.
		im repeatPonytail-8
		fash orgasm OHHHHH~<3
		t ...
		im repeatPonytail-9
		fash broken Hoooohhhh~ 
		player pent *Huff* *Huff*<br>Hoo boy. I think I'm finally spent.<br>Still, I have no idea how you planned to figure out the winner. Comparing the amount in your belly to the floor is hard, not to mention when it leaks out out of you and mixes together.
		fash Ghoo... Winn... Ner... Happiness...~<3
		player happy ... That's a great point! I guess we're both winners today, huh?
	`},
	{index: "repeatLong", name: "Twintails - Perfect Blowjob Handlebars", image: "fashionista/repeatLong-1", requirements: "?flag fashionista repeatLong;",
	content: `
		fash amused Long hair, hmm? I'll have to dig out the straightener.<br>Shame the extensions will be ruined after this, but oh, it's a fair trade, I suppose.
		t fashF brings out a small box of supplies. Hairties, extensions, special brushes, bottles, and some tools you don't recognize.
		t Over the next few minutes he gets to work, having you help get areas he can't reach himself.
		t His usual teasing tone seems to fade into a much more professional one, but once you're finished he hops off his seat and switches back.
		im repeatLong-1
		fash amused Ta~Da~<br>How do I look? Does it suit me?
		player sparkle So pretty~!
		fash flirting Ehehe~<i><br>That's right, get up reeeeal close, look into my eyes...<br>Real close with those... Those big... Beautiful...<br>Gorgeous...</i>
		t ...
		player curious Hmm... I'm not sure I can see how the long hair has a use from this position...
		im repeatLong-2
		fash love Ohhh~<br><i>It's pulsing... *His and my heartbeat in sync...<br>Is this love? Lovers cuddling up with each other... But it's between me and this fat, human, cock...</i>
		fash horny Err, uh... What were we... Right!<br>Well, I bet you'd think that it's useless, huh? But really, it matches my style of play perfectly, lemme show you~
		im repeatLong-3
		fash teasing See, I know it's not enough for you to use just my hands, right?<br>This cock of yours, it... It needs...
		player love Ohhh... Paws, so soft...<br>And even without breasts, bare boy chest still feels so nice~
		fash excited It... R-right, yeah...<br><i>Ah~<br>Those big eyes brimming with lust, that blush spreading across *his cheeks~<br>I...</i>
		fash blush <i>No! I'm the one capturing *his heart!<br>Gotta... Gotta stay on top here...</i><br>I know you... You definitely want more, so...
		im repeatLong-4
		fash flirting Ehehe...<br>How's this~?
		player love Hoohh, soft~
		fash Every stroke is a barrage of different sensations, right? None strong enough to drive you over the edge though
		player forced Nghh...!
		fash flirting Getting close, hmm?<br><i>Perfect~ All I need to do is hold *him here...<br>I can get anything I want, a cute beg, a confession, a 'please let me cum~!'<br>I just have to slow down, just a bit, hold *him riiiight here and... And...
		fash love <i>And... And hold back... Don't get covered is *his incredibly thick seed...<br>Resist the smell of that fat glob of precum...
		im repeatLong-5
		player Gh... fashF...
		fash M-make... <br>Make *him... Fall hopelessly in love with me, and...<br>Totally...
		fash perverted P-pulsing...! Warmth...! N-need... Gonna cum...!
		player orgasm Hohhh~! I'm... I can't hold back!
		im repeatLong-6
		fash pleasured C-can't... Stop!<br>Point of... Nghhh, no return!<br>Waaaaarm~!<br>Smell... Flooding brain...!
		im repeatLong-7
		fash broken C-cummm~! Delicious... Warm cum...!<br>Brain... Like smell is... Hugging head tightly...<br>Can't... Don't want to think... More... Cum~
		player afterglow Hoh... fashF... I can't...<br>Ah, he's broken... Totally cum-drunk...
		player love But that kind of expression is cute too, you know?<br>I won't be able to hold back if you keep looking like that~
		t Having forgotten his mission, fashF keeps bobbing up and down, desperate for another layer of cum to coat his face, his bare chest, and every inch of the hair he tried to seduce you with.
		t In the end, the new style both served its purpose, and was thoroughly ruined~!
	`},
	{index: "morning1", name: "Morning - Solo Fun", image: "fashionista/morning1-1",
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, and dawn is shining through fashF's window.  
		fash sleep Mmm...
		fash excited Nnnope, seems like it didn't work after all~<br>Lemme take a look-see...
		im morning1-2
		fash shock Ugh, I'm a total mess and I'm *still* pent-up! Looks like keeping myself stuffed overnight didn't help me feel sated after all.
		fash excited Sure did cause me to leak a lot though~<br>I should probably deal with this...<br>I can't end up squirting precum in a customer's hair after all~
		t ...
		im morning1-3
		fash ahegao Houuu~
		fash torogao Ghh... It just isn't... Scratching that itch hard enough...!<br>At least masturbation feels better since the human pounded my...<br>My...
		im morning1-4
		fash Ghhh~!
		fash ahegao Hah... Hah...<br>Maybe I should take the day off today...<br>Just to... To...<br>Take care of myself...<br>Yeah...
	`},
	{index: "wall1-1", name: "Hole in the Wall - Wolf pt 1", image: "fashionista/wallRear-01", requirements: "?trustMin fashionista 8;",
	content: `
		player happy Sounds like the wall's occupied today.
		carpenter sleep Yep. If you could help him out, I'd appreciate it.<br>He keeps giggling to himself, I hope he isn't losing his mind to the heat or anything...
		t ...
		im wallFront-02
		fash happy Hmm~ Hmmhmm~<br>Are those footsteps I heeeear~?
		player happy Why yes they are! You need helping today, fashF?
		fash excited Mhmhm, who, me?
		im wallRear-01
		im wallFront-01
		fash excited Ehehe~<br><i>I wonder what sort of look of desperate lust is on *his face right now~!<br>Waving that tail *he loves, blocking off the sight of my puffy, erotic butthole~</i>
		player worried <i>Aww geez, he's got it real bad today, huh? I can't afford to dally.</i><br>Don't you worry buddy, I'm here for you!
		im wallRear-02
		fash blush ...!
		im wallRear-03
		fash excited <i>It's working~! *He can't control *himself~!</i>
		im wallRear-04
		player excited Hooh..  Don't get distracted by his tail, playerF, lock in, for fashF...
		im wallFront-05
		fash F-finally... P-putty in my h... Hands~
		player worried He's completely lost it...!
		player frown No time for acclimation, if my friend needs urgent, hard, rough anal sex, he's getting it!
		fash ...
		fash shock ... What did you say back there? Di-
		im wallRear-05
		fash pleasured Hoh, w-wait just a... Don't be... <i>Too</i> rou-
	`},
	{index: "wa1-2", name: "Hole in the Wall - Wolf pt 2", image: "fashionista/wallFront-04",
	content: `
		player angry T-tight... Need to...!
		im wallRear-06
		player pleasured There...!
		im wallFront-03
		fash pleasured Khhh~!
		player excited Don't worry buddy, I'll... Gh...! Snap you out of it!<br>I'll smash that prostate of yours and you'll... Hoh... Be back to normal in a jiffy!
		im wallRear-07
		player torogao Ggh...! So tight...!
		fash torogao My... Ass...!<br>So huge...! Let go of *him... Or *he'll pull me right out of the wall!
		fash blush Ghh...! I'm... Talking to my own asshole...<br>This huge, human dick is...
		im wallFront-04
		fash ahegao Fucking me stupid~<3
		im wallRear-08
		fash torogao Gggggh~!<br>Even this rough... Brutal sex... I can't help but squirt when I feel...
		im wallRear-09
		fash excited His cum inside me~<3
		player torogao Ghh...
		t *PLORP~!*
		im wallRear-10Rosebud
		player ahegao Hhh... That was... A really tight fit...
		player excited You feeling better now, fashF?
		fash ahegao Houuuh...
		player sleep Sounds like another wallbutt customer satisfied~!
	`},
	{index: "pill-fashionista", name: "Denial Pills - Overwhelming Cuteness", image: "fashionista/pills1-4",
	content: `
		t Seeing you... Waddle... Up towards him, fashF looks shocked at first, before putting on the absolute smuggest grin you've ever seen.
		fash smug <3
		player panic fashF! Quick, I need you-
		fash amused Shhhh. Don't say a word.<br>I knew this day would come. It obviously had to happen eventually.
		player forced R-right?! Why did I think taking a bunch of pills I found in the dirt was a good idea?!<br>Th-thanks for h-helping, now turn around quick!
		fash befuddled ... Huh? Pills?<br>You mean you haven't finally snapped due to my cuteness?
		player panic H-hurryyy-
		fash panic Oh boy, alright, uh...<br>Okay, here. Now, we should probably-
		player love Ghouhhhh~
		im pills1-1-light
		fash shock W-what... Did...<br>Oh my, my ass is completely soaked and...
		fash love Oh my god~<3<br>What a powerful-
		im pills1-2-light
		fash forced H-ohhhh! my butt's never been spread this wide before! 
		t Despite his tight ass twitching around you, the most immediate and engulfing pleasure you feel is actually the sense of relief as you allow the damn holding back your orgasm to release.
		player afterglow Hahhhh~<3
		fash panic H-hey! Don't zone out, my fluffy butt's not some convenient hole for you to dump your nut into!
		player pent Of course... You're my dear friend, fashF, you know I'd never think of you like some kinda wastebin... You're really helping-
		player torogao GHHHG-!
		im pills1-3
		fash orgasm Hohhh~! W-what... Is that!
		t Even as quick as he was to present his ass to you, the time spent holding back from spraying your ballslop has led to your backed-up load thickening enough that actually squirting it into the wolfboi is proving to be a challenge.
		fash forced W-what... Is...
		im pills1-4
		fash orgasm HOUHHHHH~!!!
		fash torogao O-oh, th-that's... H-huge!<br>I c-can feel... The bulge in your shaft...!<br>T-too big... L-like I'm... being...
		player afterglow Ahhh~
		fash ahegao Knotted~!!!
		t Using what's left of his ability to think, fashF tries to adjust his angle as the pulsing warmth travels up, and <i>through</i> him.
		im pills1-5-light ?atwt;
		fash orgasm BLRGGG~<3 ?atwt;
		t Concentrated human jizz fills up every available inch and then some. His eyes roll back and biological instincts are pushed way past their breaking point, especially when further bulges begin traveling up his human-condom ass.
		player tired Uoooh... Dizzy...
		t With your 'cork' finally 'pulled', you relax, and pretty much immediately pass out. Leaving your own cork still inside fashF's butthole.
		fash afterglow Ghhhhhlgggg~
		t ...
		im locations/interiorPurple-Evening
		player tired Mghh...
		t You wake up inside fashF's house, feeling like you just got done filling a winebarrel with glue.
		fash pent Ah, you're... Urp... Awake...<br>It took forever to clean my fur... And my garden too...<br>Need me to walk you home?
		player tired No, but thank you. Sorry I had to unload on you like that.
		fash sleep It's... *Hic* Completely fine. Unload <i>in</i> me would be more accurate. I won't need to eat for a week, probably. Come by anytime, maybe without eating strange things from the ground next time?
	`},
	{index: `hump-1`, name: "Morning Humps", image: "fashionista/hump1",
	content: `
		t It's a brand new day in syrup town...
		t And a particular bed is squeaking quite loudly.
		fash sleep Ghnnf, gnff, playerF...!
		im hump1
		fash pent Take it, take it, take it~! Let... That fat, jiggly ass-
		fash torogao Nghhhhh~!
		im hump2
		fash afterglow Hoh...
		fash tired... My sheets are ruined.
		`
	},
	//SALVAGE GAPS: lines seem to be missing after "What will shopF think up next?" and before "It's, uh... Huh."
	//Image placement is a guess from the prompt sidecars; the salvage had three bare "im" lines.
	//hump1/hump2 belong to the hump-1 morning scene, not this event.
	{index: "plug1", name: "Deity's Artifact - Test Run", image: "fashionista/plug1",
	content: `
		player sleep And so long story short, in order to save the world, I need to put this up your butt.
		fash befuddled ...?
		t He's been staring at you through your whole explanation like you just told him you've been keeping a scrapbook of various cheeses, until you hold up the special essence-extracting artifact. At which point the look shifts to a knowing smile.
		fash amused ... Ah, okay. You know you don't need to come up with excuses for that kind of stuff, right?
		player worried Well, I wanted you to know what you were getting into. This is magic after all.
		fash excited Oh, I bet it'll feel magical alright.
		fash confused Though, uh...
		im plug1
		fash Isn't that a bit small? Seems like after what we've been through, something like that would barely register.
		player happy It's supposed to absorb excess fertility energy, so it should get bigger.
		fash amused It expands? What will shopF think up next?
		im plug2
		fash horny I-it's... Huge!<br>But somehow it's not like a pressure, it's like my body's relaxing, my cock won't stop leaking!
		player awe Wow... Okay, let's try removing it now.
		fash blushy Already? Alright, if you say so...
		fash sleep Yeah, I... Ohh...<br>My head's really, really clear right now, but...<br>Mm, I think I might just have a quick nap...
		fash pent It's, uh... Huh. It's hard to describe. I... Hmm.<br>I guess I feel... Kinda like a part of me is filling up with juice?
		fash horny There's... Ohh, a muscle right between my butthole and my balls. Whenever I cum, I can feel it tighten, then relax, then like, it repeats. But right now it's like it's like... Squishy? Like it's tensing up, and up, and up, but not feeling tight...?
		t He trails off, like he's lost in another world for a moment, before turning around.
		im plug3
		fash excited Whhoooowie~<3 It's making my belly so big... Not as big as my thighs though, haha~<3<br>Jiggle jiggle~<br>Were they always so big~?
		player happy They've always been perfect. Okay, I think it's probably done enough, you're starting to sound a little loopy. Turn around.
		fash excited Kaaaay~
		im plug4
		t The base of the plug toy is already glowing a brilliant pink.
		player joy Wow, that worked fast!
		fash seductive Hhh... Heeeeyyy~<br>You think I'm cute, right?
		player surprised Of course!
		fash blushy Well you gotta saaaaay so~! I work sh... So hard on looking cute, and I worry you don't notice~
		player frown Hrm, you've got a tight grip on this thing.
		fash pent Huh...? Oh, I gotta relax...<br>Relax... I feel like I'm doing it, I feel like... My crotch is warm?
		player annoyed C'mon... Just gotta... Pull!
		im plug5
		fash love ...!?!
		t The tool extracts from fashF's anus with a loud *SCHLRRRRRP*, all the while fashF doesn't moan so much as let out breathless gasps.
		t Cum drools from his dick, not in spurts or globs but in a completely steady stream so effortlessly it's like gravity is enough to drain the cum from him.
		fash <3<3<3?!
		t You must have pulled at least a foot and a half.
		fash awe I, uh... The, the uh... The world's pink? And fuzzy? Does that make sense?
		player befuddled Not really. Maybe you should lie down?
		fash forced Y-yes! I think I'll lie down! That's a... A good...
		im plug6
		fash torogao NGHHHH~<3
		t fashF's legs go stock straight for a moment, his thus-far completely smooth, saggy balls showing visible veins and tightening all the way up to his groin. His cock throbs with a sudden, but completely dry orgasm.
		fash shock Wh-what was that? Did I just cum? <br>I w-wanna do that again! I don't think my body knows my nuts are empty!
		player worried You need any help?
		fash torogao G-gonna...! Wrap both fists around my c-cock...!<br>Gonna... P-Pump...! Fuck my hands!<br>F-first I need to... Get...! Knot!
		t He starts <i>waddling</i> over to his door, every few steps his balls and still-gaped butthole tightening in another dry attempt at a spurt.
		t And as he does, the jewel at the base of the lanky toy coiled in your arms begins to grow, and its impossible length starts shrinking.
		t You hear what sounds like a mix of gravel and fizzy rocks popping together, and the jewel at the base tumbles out and onto the ground, a new one growing to take its place.
		im artifacts/plugFash
		player confused Guess this is one of those things deityF mentioned. I thought it was supposed to need multiple people though.
		player happy Guess I'll go ask if this is enough. Hope you have fun, fashF!
		fash forced Y-yeah, I... Ghhhg~
		t This one isn't <i>totally</i> dry, squirting a thin line of near totally-clear spooge onto his doorstep. A good sign his body is already refilling.
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