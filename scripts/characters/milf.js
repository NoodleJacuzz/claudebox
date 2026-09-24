var character = {index: "milf", flags: "", fName: "Mary-Lou", lName: "", color: "#F4E2C8", outfit: "nude", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "female"};

var logbookArray = [
	"im images/milf/nude/happy; title Motherly; Syrup Town's devoted flora caretaker, milfF is the lass responsible for tending to the plants, trees, and gardens of the town. She's bursting at the seams with 'mom' energy, and when she isn't watering, harvesting, planting, trimming, or singing to the town's plantlife she's doing some other odd job around town to help out.",

	"im images/milf/logbook2.png; title Too Big; !flag milf pregnant; ?trustMin milf 2; Because of the townsfolk's inability to enter heat properly, a few of the residents have experienced a gradual buildup of motherly energy year after year. While this is meant to be devoted to childrearing, without your help this buildup will just continue until it reaches dangerous levels.<br>In milfF's case her breasts and body just kept growing, getting more and more ready for children who milfF hasn't been having. Pretty soon she won't even be able to wear clothes, her body is so sensitive, and every day just feels empty. This gal really needs some help!",
	
	"im images/milf/logbook2a.png; title Too Big; ?flag milf pregnant; Because of the townsfolk's inability to enter heat properly, a few of the residents have experienced a gradual buildup of motherly energy year after year. Thankfully due to your efforts, milfF will finally have a release for all that buildup soon!<br>Hopefully she'll be able to wear clothes again without her massive sensitive breasts causing her to shudder with every touch. But at the very least if that doesn't change, now she'll actually enjoy it!",

	"im images/milf/logbook3.png; title Massive Milk-Tanks; !flag milf pregnant; ?trustMin milf 4; There's no part of her body that milfF hated more before you arrived than her breasts. Her absolutely titanic set of milkers, perhaps the largest in town. They got in the way, prevented her from wearing clothes (between their size and sensitivity), and have been nothing but a nuisance. <br>But now that she's in heat her tune is quickly changing. Constant soreness and being quick to pain whenever touched have vanished, replaced by a deeply satisfying, trembling buzz when so much as a breeze passes over them. Her nipples are huge and needy, there's no doubt that her ancestry was bred and built for milking.",

	"im images/milf/logbook3a.png; title Massive Milk-Tanks; ?flag milf pregnant; There's no part of her body that milfF hated more before you arrived than her breasts. Her absolutely titanic set of milkers, perhaps the largest in town. They got in the way, prevented her from wearing clothes (between their size and sensitivity), and have been nothing but a nuisance. <br>But now that she's pregnant she's singing a totally different tune. Where once there was an unpleasant soreness, now there's only a deeply satisfying, trembling buzz that serves to remind her every second brings her closer to children. Children who will definitely enjoy drawing milf from her needy, throbbing nipples, there's no doubt that her ancestry was bred and built for milking.",

	"im images/milf/logbook4.png; title Mass of Beef; These are a beast's flanks. To call what milfF hauls around a rear end simply cannot describe it. These are not cushions for pushin', they are the entire bed. Not cake, this is the entire bakery.<br>milfF's womb begs, PLEADS, to be gifted with children, and that begging has taken its form by transforming this woman's body into a vessel for sex. An orgasmic tingle passing through her titflesh and assflesh will quickly become a roiling, jiggling cumquake. There will be no escape.",
];

var achievementArray = [
	{index:"6"+character.index+"Friend", frame: "ultraRare", name: "Milf's BFF", requirements: "?trustMin "+character.index+" 6;", description: "Help milfF appreciate the joys of motherhood and become best friends.", image: "milf/achievement1",},
];

var itemsArray = [
];

var shopArray = [
];

var pickupArray = [
	{index: "milfClothes", requirements: "?flag milf House; !item Cow;", top: 30, left: 20, event: true, size: 10, image: "items/question"},
	{index: "milfSisters", requirements: "?flag milf House; !flag milf sisters;", top: 30, left: 20, event: true, size: 10, image: "items/question"},
];

var morningArray = [
	{index: "morning1", requirements: "?trust milf 4;", priority: 100, unique: true,},
	{index: "morning2", requirements: "?flag milf pregnant; !flag milf morning2;", priority: 40, unique: false,},
	{index: "morningSilly", requirements: "?flag milf pregnant;", priority: 1, unique: false,},
	{index: "hot-1", priority: 1, requirements: "?flag milf pregnant;", unique: false,},
	{index: "bath-1", priority: 1, requirements: "?flag milf pregnant;", unique: false,},
];

var encounterArray = [
	//{index: `placeholder`, name: character.index+`F test`, requirements: "?location pineconePlaza;", altName: "", altImage: "",},
	{index: `intro`, name: `Bump into something soft`, requirements: "?location lavenderLane; ?trust milf 0;", altName: "", altImage: "",},
	{index: `milf1Start`, name: `milfF is here`, requirements: "?location lavenderLane; ?trust milf 1;", altName: "", altImage: "",},
	{index: `milf2Start`, name: `milfF is here`, requirements: "?location store; ?trust milf 2;", altName: "", altImage: "",},
	{index: `milf2Start`, name: `milfF visiting the store here`, requirements: "?location riversideRoad; ?trust milf 2;", altName: "", altImage: "",},
	//{index: `milfExtra`, name: `milfF is here`, requirements: "?location lavenderLane; ?trust milf 3;", altName: "", altImage: "",},
	{index: `milf3Start`, name: `Someone's pacing around here`, requirements: "?location lavenderLane; ?trust milf 4; ?time Morning;", altName: "", altImage: "",},
	{index: `statusQuoIntro`, type: `walking`, requirements: "?location lavenderLane; ?trustMin milf 5; !flag milf statusQuoIntro;", altName: "", altImage: "",},
	{index: `House`, name: `Visit milfF's house`, requirements: "?location lavenderLane; ?trustMin milf 5; ?flag milf statusQuoIntro;", altName: "", altImage: "",},
	{index: `watch-start-milf`, name: `milfF is outside`, requirements: "?location lavenderLane; ?trustMin milf 5; ?holiday watch; !flag milf watchStart;", altName: "", altImage: "",},
	{index: `pill-milf`, name: `You can't hold it any longer!`, requirements: "?location lavenderLane; ?trustMin milf 5; ?holiday pill;", altName: "The Bushes", altImage: "",},
	{index: `cherry-milf`, name: `Let's visit milfF!`, requirements: "?location lavenderLane; ?trustMin milf 5; ?holiday cherry;", altName: "", altImage: "",},
];

var sceneArray = [
	//Intro
	{index: `intro`,
	content: `
		milf special secret; W-whoa there!
		t *BONK*
		t ... Well, actually, it's more of a *PLUMPHF*, but there aren't as many words to describe bouncing off a walking, talking pillow.
		t And your butt hitting the dirt isn't really a *BONK* either, given the cushions you're walking around with on your backside.
		t But instead of focusing on onomatopoeias, you decide to come back to reality and look up.
		im intro1
		t Up past impossibly thick thighs, breasts so big they'd put any other kind of melon to shame, and into the orange eyes of someone so panicky she looks ready to cry.
		milf panic Are you alright? Ol' <input type='text' id='nameSubmission-milf' value='milfF'> wasn't watchin' where she was... Goin'...
		button Continue; renameCharacter('intro2')
	`,},
	{index: `intro2`,
	content: `
		milf love Hoh... H-human...
		player happy Yep! The name's playerF!
		milf excited H-howdy... milfF, that's my name, I...<br>Err, I take care of my babies around here, so if you need somethin'...
		player befuddled Babies? But I thought-
		milf shock Err, no, I mean the plants! I'm a gardener. Never touched a tyke in all my days.
		milf panic N-not that I wouldn't take care of <i>your</i> babies! If you needed me too!<br>I'm sure they'd be plenty cute, I bet I'd wanna pick 'em up right on the spot and cradle them!<br>... Ah! O-only with your sayin' so!
		im intro2
		milf blush Hah... I should probably finish makin' a fool of myself about now, huh?<br>I gotta go water some bushes.
		player sleep Ah, that's why you're fidgeting.<br>No worries, I 'water the bushes' around here all the time!
		milf shock Huh?! That ain't good!<br>Oh jeezums, then I really gotta go before the ol' roses are flooded!
		player worried ... There she goes.
		player frown That's it. That's the last time I ever try to break the ice by talking about public urination!<br>Not once has it ever worked out well for anyone!
		eval setTrust('milf', 1)
		eval passTime()
		finish
	`,},
	{index: `milf1Start`,
	content: `
		eval writeEvent("milf1");
	`,},
	{index: `milf1-A`,
	content: `
		eval addFlag('player', 'milf1-A');
		eval writeEvent("milf1-A");
	`,},
	{index: `milf1-B`,
	content: `
		eval addFlag('player', 'milf1-B');
		eval writeEvent("milf1-B");
	`,},
	{index: `milf1-C`,
	content: `
		eval removeFlag('player', 'milf1-A');
		eval removeFlag('player', 'milf1-B');
		eval writeEvent("milf1-C");
		eval passTime(); !flag player gallery;
		eval raiseTrust('milf', 1); !flag player gallery;
	`,},
	{index: `milf2Start`,
	content: `
		eval writeEvent("milf2");
	`,},
	{index: `milf2-A`,
	content: `
		eval addFlag('player', 'milf2-A');
		eval writeEvent("milf2-A");
	`,},
	{index: `milf2-B`,
	content: `
		eval addFlag('player', 'milf2-B');
		eval writeEvent("milf2-B");
	`,},
	{index: `milf2-C`,
	content: `
		eval addFlag('player', 'milf2-C');
		eval writeEvent("milf2-C");
	`,},
	{index: `milf2-D`,
	content: `
		eval removeFlag('player', 'milf2-A');
		eval removeFlag('player', 'milf2-B');
		eval removeFlag('player', 'milf2-C');
		eval writeEvent("milf2-D");
		eval passTime(); !flag player gallery;
		eval raiseTrust('milf', 2); !flag player gallery;
	`,},
	{index: `milf3Start`,
	content: `
		eval writeEvent("milf3Start");
		trans milf3-A; Straight to Vaginal !flag player milf3-A;
		trans milf3-B; Warmup with Oral !flag player milf3-B;
		trans milf3-C; Titsex, then Cowgirl !flag player milf3-C;
		trans milf4; Push it to the limit ?flag player milf3-A; ?flag player milf3-B; ?flag player milf3-C;
	`,},
	{index: `milf3-A`,
	content: `
		eval writeEvent("milf3-A");
		eval addFlag('player', 'milf3-A');
		trans milf3-A; Straight to Vaginal !flag player milf3-A;
		trans milf3-B; Warmup with Oral !flag player milf3-B;
		trans milf3-C; Titsex, then Cowgirl !flag player milf3-C;
		trans milf4; Push it to the limit ?flag player milf3-A; ?flag player milf3-B; ?flag player milf3-C;
	`,},
	{index: `milf3-B`,
	content: `
		eval writeEvent("milf3-B");
		eval addFlag('player', 'milf3-B');
		trans milf3-A; Straight to Vaginal !flag player milf3-A;
		trans milf3-B; Warmup with Oral !flag player milf3-B;
		trans milf3-C; Titsex, then Cowgirl !flag player milf3-C;
		trans milf4; Push it to the limit ?flag player milf3-A; ?flag player milf3-B; ?flag player milf3-C;
	`,},
	{index: `milf3-C`,
	content: `
		eval writeEvent("milf3-C");
		eval addFlag('player', 'milf3-C');
		trans milf3-A; Straight to Vaginal !flag player milf3-A;
		trans milf3-B; Warmup with Oral !flag player milf3-B;
		trans milf3-C; Titsex, then Cowgirl !flag player milf3-C;
		trans milf4; Push it to the limit ?flag player milf3-A; ?flag player milf3-B; ?flag player milf3-C;
	`,},
	{index: `milf4`,
	content: `
		eval writeEvent("milf4");
		eval passTime();
		eval passTime();
		eval data.player.day += 7;
		trans milfWrapup; Continue
	`,},
	{index: `milfWrapup`,
	content: `
		outfit milf nude
		eval addFlag("milf", "pregnant")
		t A bright sun hangs over the seventh morning.
		t The sublight passes over the lake, the trees, the buildings...
		t And quite a few weeds and wilting flowers.
		carpenter tired Hmm... Right down here...<br>Surely the two of them-
		milf crying WAHHHHHHHH!
		carpenter shock ...!
		t Rushing inside, carpenterF steps into your bedroom, feeling like they've slammed headfirst into a solid wall of pure sex pheromones. The floor is wet and sticky, the sheets are soaked through, and milfF is ugly-sobbing over the human, laying on the floor.
		player sleep ...
		milf *He's dead, I killed the human!
		carpenter shock ...?! Move aside, let me-
		carpenter pent Oh, thank goodness.
		milf scared *Sniff*... What... What's that supposed to mean?
		carpenter happy *He's just asleep.
		milf panic N-no *he ain't! Nobody sleeps that hard out of nowhere!<br>We were... Were...
		carpenter happy Mating. Sex. Fucking. I can see that. And smell it.<br>No, I can tell. The human's just fine. And this isn't normal sleep, I can tell that too. It's...
		carpenter sleep The 'Good Sleep'.<br>The kind of nap that grabs you by the neck after several all-nighters. Multiple parts of *his body are totally shutting down, it's almost like a coma.
		milf W-will *he be okay?
		carpenter Oh yeah. It'll be the best nap of *his life.<br>Congratulations, by the way.
		milf worried ...?
		im wrapup
		milf shock ...! I'm... Huh?<br>I'm lactatin'!<br>And my dud's are all... Brown!<br>It feels...
		milf sparkle Amazing! Stars n' garters... It's... I can't even describe it!
		carpenter sleep Good for you. Now, help me lift the human into bed.<br>Will you need help with all the weeds now that you're-
		milf scared Oh no! Oh no no no, Rosie! Daniel! Daffy! Oh they haven't seen a drop o' drink in a week! I'm comin'!
		carpenter shock W-wait, the hu-
		carpenter tired Aaaaaaand she's gone. Hoo...<br>Looks like it's just you and me.
		player sleep Zzz...
		carpenter surprise Whoa, what a great idea. Why bother moving when the floor's already so inviting?
		carpenter sleep In fact... Maybe I'll join you...<br>Zzz...
		eval removeFlag('player', 'milf3-A');
		eval removeFlag('player', 'milf3-B');
		eval removeFlag('player', 'milf3-C');
		eval raiseTrust('milf', 1);
		eval editSkill("stamina", 5);
		eval writeSpecial("You feel like your stamina has improved!")
		finish
	`,},

	//Status quo
	{index: `statusQuoIntro`,
	content: `
		milf sleep Hiya~<br>Over here~
		im houseFirst
		milf happy Glad you're alive, sugar. Sorry I had to dash...
		player shock Holy riggatoni! milfF!<br>You look so different!<br>How? It's barely been any time at all!
		milf sleep W-well, shopF and mayorF came by to see me. carpenterF too.<br>They said I probably got knocker'd at some point in our week-long square dancin', and the first chance my body had to rest, well.<br>... Apparently, my whole body was already in overdrive to nurture some tykes. And so I'm lookin' full as a tick, as you can see.
		milf worried Either that or I'm just plain ol' stuffed with you still, and my body just <i>thinks</i> I'm bred.
		player befuddled Preeeetty sure that's not how it works.
		milf panic It totally is, I read about it a book, so it's gotta be true!<br>People gettin' so desperate for kids their bellies just bloat on up! Can you believe that?! Fake kids?!<br>It's a blessin' that I'm not so smart, otherwise my imaginations would'a made my belly big years ago!
		player pent Hah...<br>Look, if you're really worried...
		player sleep I'll just need to knock some sense into your head by making double sure your womb's knocked up!
		milf love Huh? You'd do that? For me?
		player joy Sure! Though, maybe some variety in what we do would serve us both some good.
		milf blush W-well! Then can I invite 'ya inside for a spell? My house is plenty big enough for two~
		eval addFlag('milf', 'statusQuoIntro')
		eval unencounter(data.player.currentCharacter)
		finish
	`,},
	{index: `statusQuo`,
	content: `
		milf blush S-so, what's on yer mind? My tummy's all atingle, but we can try somethin' different today, if you want...
		trans repeat2First; Ask to pet milfF !flag milf petting;
		eval writeQuoRepeats();
		cancel
	`,},
	{index: `milfClothes`,
		content: `
		milf amused Still curious? You're lucky yer so darn cute. 
		player smug Ehehe~
		milf happy I can give you a tour if you'd care for-
		player curious What are those? Shiny...
		milf panic W-wah, wait! I forgot to...
		milf tired Aww heck, what's the point of bein' embarrassed... You 'member talkin' to shopF? 
		t You nod as you hold up a pair of gold rings, each with a small gap. They clearly aren't meant for your fingers. And on top of that they were resting atop some bits of cow-print fabric.
		milf pent I couldn't help m'self. I ordered a pair o' them nipple rings you mentioned.<br>Only, these are way too small...
		player happy Can I have them?
		milf befuddled ... Sure?
		eval addItem("Cow");
		eval unencounter(data.player.currentCharacter);
		button Finish; generateHouse(data.player.currentCharacter);
	`,},
	{index: `milfSisters`,
		content: `
		milf Ooh, curious about my little slice o' paradise? 
		player curious Hmm? What's this?
		milf happy Oh, those are...
		im sisters
		milf sleep See, I'm not a local. I'm a yokel, if anything. You can probably tell from my speakin'.<br>My sisters own a farm, real big one. It and the woods around size up at more than a hundred acres at least.<br>It's way out of the way though. My sisters and I write each other, although there ain't enough paper in all the forests to send as many as I'd like.
		milf cry I miss em, fierce... *Sniff*
		player worried I'm sure they miss you too.
		milf pent I bet they're worried. No way they'll believe I got hitched. 
		milf sparkle ... I should bring you over sometime! Oh, they're as sweet as applesauce, you'd love 'em. And I bet they'd love you right back.
		player befuddled Like, 'love' love?
		milf blush W-well, only if you want them too.
		milf worried It's quite the trip though. And the way's only open at certain times of year. 
		player sleep I'll have to keep my schedule clear, then.
		eval addFlag('milf', 'sisters');
		eval unencounter(data.player.currentCharacter);
		button Finish; generateHouse(data.player.currentCharacter);
	`,},

	//Post-quo scenes
	{index: `repeat1First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval raiseTrust('milf', 1);
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
		eval passTime();
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `repeat2First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('milf', "petting");
		eval addFlag('milf', "repeat2");
		eval raiseTrust('milf', 1);
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
	{index: "watch-start-milf", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval addFlag('milf', 'watchStart')
		finish
	`},
	{index: "watch-finish-milf", 
	content: `
		eval writeEvent(data.player.currentScene)
	`},
	{index: "cherry-milf", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval passTime();
		eval data.player.holiday = "";
		finish
	`},

	//Morning scenes
	{index: `morning1`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, aside from a few places.
		milf tired Hoo... Okay...
		milf sparkle Gooood morning Daffy~ Good morning Rosie~ And good morning to you too, Daniel~!<br>Are my babies thirsty? I know it's a bit of a dry spell, but...
		im morning1
		t Starting her morning routine early, milfF is up and about tending to the town's greenery.
		milf surprise Oh my! And who is this little sprout?<br>Not a weed I hope...
		milf sparkle A rosebud! Rosie, I didn't even know you <i>started</i> pollinating~!<br>Oh, I'm so proud of you. I just know your kids are gonna grow up... Mighty... Big and...
		t As a strange feeling begins to well up inside her, milfF's enthusiasm seems to vanish, and she lowers her watering can. 
		milf worried Oh... This is...
		t Jealousy. Over a plant.
		milf tired ... I'm goin' insane.<br>mayorF, shopF, they were right.<br>I can't take it anymore...
		milf pent Maybe hyenaF knows a pick up line or two... I could use some pickin' up myself, honestly.<br>No, no time to waste. Be brave, milfF. We're gonna go right on down there and... And...<br>W-well, I'll figure that out later.
		finish
		eval unencounter("milf")
	`,},
	{index: `morningSilly`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Elsewhere, in Syrup Town, someone else is getting ready for bed too!
		im morningSilly1-1
		milf happy And so, the young girl realized what true bravery really was. She spoke from her heart.<br>"I want to go home." And joy finally returned to her sister's weary face.<br>"Then I'll take you there."
		milf sleep Mmm, that feels like a good place to stop for now. I hope we get a happy ending...
		milf surprise Ooh! Yer kickin'!<br>You really want more that badly?
		milf amused Insatiable... Just like yer *daddy already.<br>Alright, alright, settle down. One more chapter.<br>But this is the last one for now, even if we get a cliffhanger, ya hear?
		finish
		eval unencounter("milf")
	`,},
	{index: `morning2`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, aside from a few places.
		eval writeEvent(data.player.currentScene)
		eval raiseTrust('milf', 1);
		eval addFlag('milf', 'morning2');
		finish
		eval unencounter("milf")
	`,},
	{index: `hot-1`,
		content: `
			t It's a brand new day in syrup town...
			t And it's an absolute scorcher!
			im hot1
			milf sleep Hoo... Slow down you...<br>Summer heat's...<br>Got momma all tuckered out...<br>Ah... Sugar, don't... Ah'm all sweaty...
			trans cancel; Finish
		`
	},
	{index: `bath-1`,
		content: `
			im bath1
			milf pent Hoo nelly~<br>Day's workin' seems a lot more dauntin' when you've got the whole kit n' kaboodle with ya, huh quacksie?<br>Thank goodness it's behind...
			milf tired Hmm? Weird. Almost seems like it's gettin brighter...
			milf panic ... It ain't morning', is it? You'd tell me if ah worked through the night, right quacksie?<br>Right?!
			trans cancel; Finish
		`
	},
	{index: "pill-milf", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval data.player.time = "Night";
		eval data.player.holiday = "";
		finish
	`},

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

var eventArray = [
	{index: "milf1", name: "Text - Start", image: "milf/milf1a-1",
	content: `
		milf blush Ah, h-heya! Again! Fancy seein' you out here, do... Do you drop by these parts often?
		player happy Yes. I do regularly use the only road leading to my house.
		milf Well, that's great! I use the roads here a lot too!<br>We sure have a lot in common! Haha...!
		im milf1-1
		milf worried ... This isn't workin', is it?
		player happy Not really. Let's start over. playerF, pleasure to meet you.
		milf happy milfF, it's a real delight.<br>Sorry for dashin' so soon last time.<br>Truth is, I get a bit loose in the noggin whenever I see somethin' small and cute. My shirt feels tighter, chest warms up...
		milf worried I don't mean to seem needly, but mayorF and shopF both said you can help me out somehow?<br>Truth be told I was worried I'd need to stop wearin' clothes altogether...
		player confused How... Horrifying? I guess?<br>Hrm. Well, considering those, how much you're sweating, and the flushness of your face...
		milf blush Eh...?
		player befuddled I'd say you're in heat, but you were basically like this from the moment we met. That's a bit too fast.<br>Maybe you should try...
		mtrans milf1-A; "A Chest Massage!" !flag player milf1-A;
		mtrans milf1-B; "Getting Hitched!" !flag player milf1-B;
		mtrans milf1-C; "Masturbation" !flag player milf1-C;
	`},
	{index: `milf1-A`, name: "mini", 
	content: `
		player joy A chest massage!
		milf worried Eh... Alright...<br>I gave it a shot before...
		im milf1a-1
		milf My meat's way too tender for me to be too rough. Plus it feels like the girls are ready to burst, and the building feeling just keeps gettin' worse.
		player worried Hrm. That sounds tough... What if you tried...
		mtrans milf1-A; "A Chest Massage!" !flag player milf1-A;
		mtrans milf1-B; "Getting Hitched!" !flag player milf1-B;
		mtrans milf1-C; "Masturbation" !flag player milf1-C;
	`,},
	{index: `milf1-B`, name: "mini", 
	content: `
		player joy Getting hitched! Now that I'm living in town, you could find a husband, and... Er...
		im milf1b-1
		milf scared A h-husband?!<br>N-no, I couldn't, I c-can't...!
		player shock Hey, hey, calm down, it's gonna be fine!
		milf crying I can't, I can't...
		player worried Aww geez.
		milf worried S-sorry... I'm real sorry.<br>Momma used to tell me stories of growin' up. She used to tell me a big ol' strong man would show up one day, whisk me on away from the farm...<br>I'd never have the heart to tell her the nightmares those stories would give me...<br>Ever since then, anything large gets me... Quaking...
		player confused Okay...? But you said you like cute things, so you could just marry a girl then? Or a cute, smaller boy?
		milf confused *Sniff* ... Huh?<br>B-but, I'm a girl though...<br>And marrying shorter men...?
		player befuddled ... Did it not even occur to you that you can marry short people?<br>Like, I'm pretty short. Does marrying me sound scary?
		milf tired You...? 
		milf love Marry... You?<br>Lean down and give you a peck... And have kids... with...
		player confused Well, that's more of a long term thing to think about. You should probably see a therapist or something before you stumble onto a large oak tree or something.<br>Anyways, back to your problem, maybe you should try...
		mtrans milf1-A; "A Chest Massage!" !flag player milf1-A;
		mtrans milf1-B; "Getting Hitched!" !flag player milf1-B;
		mtrans milf1-C; "Masturbation" !flag player milf1-C;
	`,},
	{index: `milf1-C`, name: "mini", 
	content: `
		player joy Masturbation! The peak, the brightest sparkle in life's eye, the greatest joy afforded to all of those who walk this blessed earth!
		milf befuddled The... The thing humans do with their crotch? Like in those books shopF has all us townsfolk study?<br>I mean, she's talked about doin' it too. Usin' all those pink tubes, toys and stuff she owns. 
		player amused Well, no comment on what she does with her spare time.<br>But it doesn't have to be with the crotch! Plenty of girls can get off by rubbin' and a tuggin' those nips!
		milf worried Eh... Rubbing again...?<br>I've tried that plenty, but...
		player happy No no no, you're thinking of a chest massage. I'm talking about...<br>Here, It'll be easier to just show you.
		milf Okay....
		player confused Jeez, this shirt's durable, that much is for sure...<br>There we go.
		im milf1c-1
		milf pent Hooh...
		player happy Just breathe deeply and relax. This'll go even better as you keep going into heat too.
		milf pent H... Huh. Your hands feel kinda...
		im milf1c-2
		milf Is it gettin' real warm all of a sudden? I'm totally soaked with sweat now...
		player sleep I figured that was just nerves. Just relax and let you and your milkers de-stress.
		milf Sure... Milkers...
		milf blush M-milkers?!
		player happy Yeah! Once you get pregnant you start lactating. I bet these'll be positively spurting milk!<br>In fact, maybe that's what the problem is!
		milf excited Nghh... We... We gotta stop here!<br>It's... Gettin' real tight again!
		player worried Hrm... Alright, well-
		milf blush I... I'll see you later!<br>W... Warm warm warm...
		player befuddled She's sure in a rush...<br>Hot dang, she sweat so much she left a puddle behind!
		finish
		eval writeSpecial("You unlocked a new event in the gallery!") !flag player gallery;
	`,},
	{index: "milf2", name: "Text - Start", image: "milf/milf2b-1",
	content: `
		milf befuddled Hush your mouth, you can't be serious.
		shop worried Sorry. It's not like I actually live out there, there are just-
		shop sparkle playerF!
		milf surprise Oh! We're bumpin' into each other a lot, aren't we. And this time it's not on purpose...
		player curious Weren't those other meetings coincidences too?
		milf blush Err... Yeah! Happy accidents, the lot of 'em!
		shop happy You've got perfect timing actually. milfF was telling me about you showing her nipple masturbation!<br>How's it work?
		player curious You don't already know? I figured it'd come up a bunch in all kinds of porn.
		shop sleep Maybe, but I haven't really been exploring that kind of play.<br>Part of the itty bitty titty commitee over here.<br>Dildos, onaholes, those are more my kind of focus. Oh, and electricity, anal beads, bestiality, asphyxiation-
		milf panic Asphxy-what now?!
		shop shock Wah! It's purely academic!<br>I wouldn't actually... Let's get back on topic here.
		player happy Yeah, let's. So, nipple masturbation. Chest stuff in general really. You actually don't need a pair of huge melons for...
		mtrans milf2-A; Paizuri !flag player milf2-A;
		mtrans milf2-B; Nipple Piercings !flag player milf2-B;
		mtrans milf2-C; A Milking Machine !flag player milf2-C;
		mtrans milf2-D; Hmm... ?flag player milf2-A; ?flag player milf2-B; ?flag player milf2-C;
	`},
	{index: `milf2-A`, name: "mini", 
	content: `
		milf confused Pai-zoo-ree?
		shop sparkle Oh, oh, I know that one! Titfucking!
		player sleep Yep! The heavenly sensation of thrusting between a pair of soft, sweaty breasts.
		milf blush ...!
		shop worried Wait, can you really do it with smaller breasts? I thought it was one of those "Slam those fuckpillows onto the man's lap and wrap him tight" kinda deal
		im milf2a-1
		milf seductive Oh, don't you worry none, hun~<br>Mama knows how to keep you happy~
		milf panic Awawa~...<br><i>My cheeks are flushed as a tomato... My imagination's runnin' wild with me...!
		player Nope, totally doable. Rubbing it onto a flatter girl's chest is nice too, and for girls the nipple stimulation can be fun!<br>Oh, and speaking of nipple fun, there's also...
		mtrans milf2-A; Paizuri !flag player milf2-A;
		mtrans milf2-B; Nipple Piercings !flag player milf2-B;
		mtrans milf2-C; A Milking Machine !flag player milf2-C;
		mtrans milf2-D; Hmm... ?flag player milf2-A; ?flag player milf2-B; ?flag player milf2-C;
	`,},
	{index: `milf2-B`, name: "mini", 
	content: `
		milf panic Y-you can get p-p-p...
		shop worried Youchie... Never been into pain, really.
		player happy Sure they sting like crazy for a little while after, people use anesthetic to block out the pain, since it's only around for a few hours.<br>Really, the main appeal is how showy they are, and for some people it boosts the nipple's sensitivity in a nice way.
		milf Sh-showy...?
		shop sparkle Ah, I see! Like how anal goes from uncomfortable to addicting! And I bet me being in heat now would help a lot too.
		player sleep Maybe not <i>exactly</i>, but being nice and tingly, having that naughty factor, all while still getting that glitzy vibe that earrings can give off...
		milf blush ...!
		im milf2b-1
		milf seductive Mhmhm~<br>Does darling like mama's udder decorations? Or do you prefer to call 'em fuckpillows~?
		milf panic Awawa~...<br><i>My shirt... Suddenly feels a lot tighter?
		player happy But anyways, there's plenty of other ways to have fun even without the piercing sensitive boost, like...
		mtrans milf2-A; Paizuri !flag player milf2-A;
		mtrans milf2-B; Nipple Piercings !flag player milf2-B;
		mtrans milf2-C; A Milking Machine !flag player milf2-C;
		mtrans milf2-D; Hmm... ?flag player milf2-A; ?flag player milf2-B; ?flag player milf2-C;
	`,},
	{index: `milf2-C`, name: "mini", 
	content: `
		milf shock A machine?! That drinks yer milk?!
		player amused Well, not <i>my</i> milk, per say.
		shop sparkle Whoaaaa~! I knew about vaginal and anal sex machines...<br>Wait, that opens way more possibilities, if you could use all of them at the same time....
		player worried That might be a bit overwhelming. Not like I'm an expert on milking though.
		player happy Still, humans make some specially designed as sex toys, so it's gotta feel pretty good.
		milf blush ...!
		im milf2c-1
		milf orgasm HOOOOOH~!<br>M-mama's cumming~!
		milf panic Awawa~...<br><i>L-legs... Shaking...<br>Feelin' warm... And wet... Just like last time...<br>Gotta hold it together, don't embarass yourself, girl...!
		shop sparkle What else, what else?
		player sleep Hrm. Now let me think, is there anything I missed...?
		mtrans milf2-A; Paizuri !flag player milf2-A;
		mtrans milf2-B; Nipple Piercings !flag player milf2-B;
		mtrans milf2-C; A Milking Machine !flag player milf2-C;
		mtrans milf2-D; Hmm... ?flag player milf2-A; ?flag player milf2-B; ?flag player milf2-C;
	`,},
	{index: `milf2-D`, name: "mini", 
	content: `
		player joy Oh, I know, there's-
		t *THUD*
		t Your conversation with the curious cat is cut short by what sounds like over a hundred pounds of beef flank settling down on wet floor.
		shop shock Wah!
		im milf2d-1
		milf afterglow H-hoh... Hoh...<br>F-feeling... So weird...
		player worried Aw geez, I think she's overstimulated...
		shop worried Thank goodness, she's just having a tiny orgasm.
		milf S-sorry... Ah... L-legs... N-not...
		shop happy Aww it's no big deal. If I got mad every time someone squirted on these floors, well, I'd probably end up with a self-loathing fetish.<br>Don't sweat it.
		shop worried ... Seriously, don't sweat it. You're gonna dehydrate yourself. You need some water?
		milf broken Awawa~
		player worried I'm probably not helping, pumping out sex pheromone and all. I'll get out of your hair.
		milf broken B-bye... Shug...
		shop worried Aaaand there goes the human. Shame. Seemed like they knew a few more nipple things still.<br>Well, more self-study for me to do I guess.<br>You ask them out yet?
		milf panic W-what?!
		shop frown Girl, c'mon. You <i>literally</i> cannot stand the thought of <i>not</i> getting a piece of *his meat. I can see it all over your face.<br>And you really need kids. I mean <i>need</i>. Even I can tell you're a milk-filled heifer that needs some tiny somethings suckling those teats.
		milf A... Awawa...<br>Ah don't...<br>Know nothin' about...
		shop happy Lemme go get you a towel and we can talk more about it.<br>And maybe a pitcher of juice or something, good gravy.
		milf pent ... Hmm...
		finish
		eval writeSpecial("You unlocked a new event in the gallery!") !flag player gallery;
	`,},
	{index: "milf3Start", name: "Marathon Intro", image: "milf/milf3-1",
	content: `
		milf blush W-wowee *mister human, smugglin' sausages down there, or...<br>N-no, that's stupid... Too much beatin' 'round the bush...
		milf pent Why on earth is the so hard? I just need to-
		im milf3-1
		milf blush ...!
		t There's just a moment of a startled silence between you.
		player worried Hello~<br>Everything alright? You look like a deer in headlights.<br>... Or a cow in headlights?<br>Anyways, I came by to check up on you. Everything alright? You need anything?
		milf love <i>Everything's peachy!<br></i>I need to be bred.
		player happy Su-
		milf panic Ahh! No! Wrong part! Meant to think-
		milf blush ... "Su-"? Were you about to say-
		player amused Sure, yes. I kinda figured what you needed for a while now.<br>If you're alright with me as your partner, I mean.
		milf love That's like, a "yes" kinda yes, yeah?
		player joy But sure! You know that old saying, "a friend in need is a friend I'll breed"!
		im milf3-2
		milf <i>"Breed"... "Breed"... "Breed"...</i>
		player befuddled ... That's a very hungry look in your eye, miss.<br>So, your house, or mine?
		milf Can I smell yer bed?
		player excited Can I touch your tail?
		milf Honey, you can slap my chest hard enough to make a milkshake if it means I get a kid in me.
		player amused Alright, alright. C'mon, let's go back to my house.
		milf pent Hold up, lemme grab my things first...
		t You let her head back inside for just a moment, and you can hear clattering from within before she re-emerges with a basket on her arm.
		player amused Getting ready for a picnic? I have food at home.
		milf pent You don't have enough. Promise.
		t You take her by the hand and lead her back to your place, and you can practically feel the heat radiating off of her body as you do.
		t ...
		player joy Here it is! Would you like a tour?
		milf pent Sugar, I can't take banterin' any longer. We're about to go in there and do things that'd make animals blush.<br>But before we do, I want you to know my oven's so ready for a bun that I've basically baked my brain already.<br>I'm probably gonna say things in there no decent woman should repeat, yeah?
		player confused You're acting so different... No stutter, your eyes aren't all swirly...<br>Anyways, I'm fine. Come inside.
		player happy And here, I'll take the basket-<br>Oof!
		t Taking the basket, you're shocked as it feels like you're about to topple over from the weight. Taking peek inside, you spy an absolute smorgasbord of food. Fresh fruit, dried snacks...
		player shock Whoa! This is a week's worth of stuff, easy!
		milf pent Yeah. Gh...
		player worried You alright? You look like-
		milf pleasured Ghhhh, fuck-!
		t The moment she took a deep breath, sucking in the air of your room, she relaxes. And as she does, she sinks to her knees.
		milf panic Ohhh!
		player befuddled You are... <i>Dangerously</i> horny.<br>Alright. No more build-up. We start now.
		milf pent Ohh... W-what do we actually-
		im milf3-3
		t *FLOP*
		milf scared ...!? It... It's huge!<br>It's... It's...
		player worried I know, you're scared of big things.
		milf love No.
		im milf3-4
		milf love It's... Perfect...<br>The moment I saw you, I didn't realize it, but my body did...<br>I wanted to scoop you right up in my arms, and now a fat somethin' like this is attached to your hip... It's gonna give me children...<br>Make me a mommy...
		player amused Hoo boy, we're gonna need all that food, aren't we?<br>I guess the only question left is how this week-long marathon starts, huh?
	`},
	{index: "milf3-A", name: "Text", image: "milf/milf3a-1",
	content: `
		outfit milf nude
		t Day one of the marathon begins... !flag player milf3-B; !flag player milf3-C;
		t Day two of the marathon begins... ?flag player milf3-B; !flag player milf3-C;
		t Day two of the marathon begins... !flag player milf3-B; ?flag player milf3-C;
		t Day three of the marathon begins... ?flag player milf3-B; ?flag player milf3-C;
		player love Holy moly... I thought I'd start with some foreplay, but...
		im milf3a-1
		milf blush B-but I'm already soaked, huh?<br>I know it ain't the prettiest to look at, not all neat like-
		im milf3a-2
		milf pleasured Eep~!
		player excited My dick does not care.
		milf excited S-so warm! My womb's buzzin'! No more teasin', I need it! I need...!
		im milf3a-3
		milf pleasured C-cock~! Ohh~! That... That's... Stretchin'!
		player forced Ghh...! This sensation... Should I take it sl-
		im milf3a-4
		milf orgasm Ghoouuuuuh~! Cock, cock! 
		t Creaming and creaming in utter bliss, your words pass in one ear and out the other as milfF shakes and squirts from just the insertion.
		milf forced Ghh, ghhh! Buzzin' Head... Buzzin'! Won't stop! Don't stop!
		t Her words and brain frazzled, you think to give her a moment to rest, but her spasming pussy simply doesn't stop quivering.
		im milf3a-5
		milf Ghhhzzzz, s-still g-goin'! Can't think! Pussy! D-deep! Thrust!
		t You try to comply, pushing forwards and spreading her sex wider, but her twitching snatch is stimulating you far more than you expected.
		t Grade-A beef cunt envelopes you, wrapping you in a warm embrace, and soon enough you press up against what feels like a warm set of... Lips?
		t And just like that, a switch flips inside you.
		im milf3a-6
		milf orgasm GHOUUUUH~<3<3<3
		player torogao Ghhhg~!!!
		t Squirting like a premature virgin, the moment your glans kiss the entrance to her womb, there's no stopping yourself.
		milf love M-moooore~! More~! My head...! Clearin'... Need... Mooooore~!
		t You grab onto her meaty hips and try to regain some control of the situation, but when those fat thighs close in on you, it's clear that today's fuck marathon is going to be entirely out of your control.
		t ...
		milf broken Hohhh... Ouhhhh...
		player pent Ho-ly... Oh boy... I need... A snack... And a break...
		milf M-mooore~
		player tired Good... Gravy...<br>It's getting dark outside... Already...<br>Zzz...
		t Midway into munching into a fruit, you collapse right next to the creampied cowgirl and fade to black.
		t And when you wake up, well...
		t How should the next day start?
	`},
	{index: "milf3-B", name: "Text", image: "milf/milf3b-1",
	content: `
		outfit milf nude
		t Day one of the marathon begins... !flag player milf3-A; !flag player milf3-C;
		t Day two of the marathon begins... ?flag player milf3-A; !flag player milf3-C;
		t Day two of the marathon begins... !flag player milf3-A; ?flag player milf3-C;
		t Day three of the marathon begins... ?flag player milf3-A; ?flag player milf3-C;
		im milf3b-1
		milf pleasured Glmmm, ghlmmm~
		player pleasured O-okay, that's enough, I'm up, I'm hard already...
		milf Hlkkk~!<br><i>Ahhh... Need to... Let go of this delicious cock, need cum in my pussy, but...!
		player torogao Ghh, I said...!
		im milf3b-2
		milf orgasm GHLLLLK~<3
		player frown I said that's... Enough!
		t You grab the greedy cowgirl by the hair. She can't eat her creampie and have it too, after all.
		t *SHHHHHLCK*
		im milf3b-3
		milf broken Gh... Hhh...<br>Moo~ Mooore~
		player Is that all you can say for yourself? You were sucking like you wanted my balls dry! This greedy mouth of yours...
		player excited Should... Ghh, know your pussy already has dibs!
		im milf3b-4
		milf torogao Ghhhg~!
		player orgasm Take this, mating press! Get... Pregnant!
		milf ahegao Y-yes! Get me pregnant, get me pregnant, get... Me... FUCKING~!
		im milf3b-5
		milf orgasm HOOHHH~! PREGNANT~!!!
		t ...
		milf broken Hohhh... Ouhhhh...
		player pent Water... Need... Fluids...
		milf C-cum... So full~<br>N-no, there's... Still room...
		player tired *Gulp* *Gulp*<br>Ah... Eh? When did it get so...<br>Zzz...
		t The moment you're rehydrated, your body gives out, you collapse right next to the creampied cowgirl and fade to black.
		t And when you wake up, well...
		t How should the next day start?
	`},
	{index: "milf3-C", name: "Text", image: "milf/milf3c-1",
	content: `
		outfit milf nude
		t Day one of the marathon begins... !flag player milf3-A; !flag player milf3-B;
		t Day two of the marathon begins... ?flag player milf3-A; !flag player milf3-B;
		t Day two of the marathon begins... !flag player milf3-A; ?flag player milf3-B;
		t Day three of the marathon begins... ?flag player milf3-A; ?flag player milf3-B;
		im milf3c-1
		milf love Hoh...<br>Brain... Empty...<br>C-cock... Huge...<br>S-so big, even my tits can't make it look small~
		player pent Y-you... Should stop... Soon...
		milf love Eh...? Why are you... Getting up?
		im milf3c-2
		player pleasured Hohhh...! H-hey, the plan... Isn't for you to get a facial, milfF!
		milf perverted S-sorry~<br>I... Don't wanna let go!
		t Fighting with all of your might and will, you manage to pull back from that entrapping valley of titmeat.
		t But your entire body is on edge. You wobble, and fall backwards, doing everything you can to keep from spurting and cumming on the spot.
		player pent *Huff*... *Huff*...<br>B-barely... Barely held back...<br>But I can't move...
		player orgasm Hoh~!
		im milf3c-3
		milf torogao Nghh, babies, babies, need to... Make! Babies!
		t Leaving you not a second to rest, the squatting cowgirl assumes squatting cowgirl position, embracing your already-edged cock in a torturous pleasure.
		t Lines of clear femcum squirt out across your pelvis as milfF draws strength from some unknown, lustful place to squat up and down, drinking in your meat with every inch of her pussy, until...
		im milf3c-4
		milf GHHHHHGG~!
		player orgasm Hohhh~! Cumming~!
		t You're approaching a dangerous kind of mindbreak as the edges of your vision flash white. Gravity should be tugging at every bit of seed you manage to spurt out, but not a single drop of seed overflows from her perfectly plugged snatch.
		t ...
		milf broken Hohhh... Ouhhhh...
		player pent Can't... Keep going...!
		milf N-need... More~<br>Penis, come back, my womb... So lonely...
		player tired Huh... When did it get so dark in...<br>Zzz...
		t As you're pulled back into bed, you notice the sky outside your window is already dark. And soon enough your vision goes dark too. Either from exhaustion, or from your head being smothered between two mounds of titflesh.
		t And when you wake up, well...
		t How should the next day start?
	`},
	{index: "milf4", name: "Text", image: "milf/milf4-3",
	content: `
		outfit milf nude
		t Day 4.
		im milf4-1
		milf torogao Ghh, cumming, cumming, cumming~!
		t You show no restraint. By no there's no point in even trying to guess how many orgasms either of you two have had.
		t Her belly has started to puff up, but not once has a deep orgasm led to even a single drop of sperm escaping.
		t Surely she'll overflow soon...
		t ...
		t Day 5.
		im milf4-2
		milf Ngghgg~! My fuckingggg womb~!
		t She fell off the bed, you offered no mercy, no support, and she doesn't want any.
		t You think you see it. Her tummy has begun to grow, and with a powerful, body quaking orgasm you turn to see what looks like a string of white...
		t No, it's just a thick glob of femcum splattering the cowgirl across the face.
		t ...
		t Day 6.
		player pent Gh... Can't... Keep...
		milf shock Hoh...?!
		im milf4-3
		milf shock My... Huh? What's... Happening?!
		t At some point on the sixth day, approaching an orgasm as intense as any other, the fuckhaze suddenly vanishes from milfF's head.
		t Insemination rates between humans and the townsfolk here is extremely rare. A barrier that almost can't be naturally overcome.
		t Almost.
		milf panic What... My... Brain is...!
		t A voice floats into her head as a euphoria spreads through her body.
		milf love Who... I... Something's happening...
		t Despite her desperation to be bred, it's somehow suddenly very clear something has held her back from actual impregnation.
		t And that something is finally shattering.
		milf My... Baby... I can hear....!
		t A biological call and response are running through her body, manifesting as a voice in her mind, an image in her brain.
		im milf4-4
		t "Mhmhm, Mama! Over here!"
		im milf4-6
		milf torogao NGHHHHHH~!
		milf ahegao MY~!<br>BABY~!<br>SO~! BEAUTIFUL~<3<br>I'M CUMMING~<3<3<3<br>MAMA'S... CUMMING~<3<3<3<br>MOMMY'S... TEATS...! SQUIRTING MILK... JUST FOR YOUUUUU~<3<3<3!!!
		t She's screaming loud enough that the whole neighborhood can probably hear it, but to you, on the edge of consciousness, it sounds wavy and distorted.
		t Her tummy is soft and squishy, her body is shaking, even though she's shaking your own body can't escape the idea that taking a nap right now...
		player pent Would... Be really... Nice...<br>Zzz...
		milf torogao Nghhhh~! Can't... Stop squirtingggggg~!
		t The world goes...
		t Dark.
	`},
	{index: "morning2", name: "Recycled Milf", image: "milf/morning2-2",
	content: `
		outfit milf nude
		milf pent Hahhhh~
		im morning2-1
		milf Good grief...<br>I know she said I gotta keep up the milkin', but...
		milf perverted Mmmmghooo~! Why's it gotta feel so darn gooooood~<3<br>How am I supposed'ta get anythin' done like this~?
		im morning2-2
		milf love Glppp~! Glppp~!<br><i>Hurry up and be borrrrrn~<br>Mama wants to see your face~!
		im morning2-3
		milf ahegao Ahaha~<br>And mama's pussy wants to be stuffed againnn~<br>I'm makin' all this tasty milk for you, so hurry up and come out so I can get impregnated againnn~<3</i>
	`},	
	{index: "repeat1", name: "Repeatable - Oral", image: "milf/repeat1-1",
	content: `
		outfit milf nude
		milf awe My stars...
		player amused You've seen it before, you know?
		im repeat1-1
		milf Y-yeah, but this time...<br>I was a bit stir-crazy then, y'know?<br>And, I had to hold m'self back...<br>But this time, we're getting to know each other, all proper like, y'know?
		milf love ...
		im repeat1-2
		milf excited Hey, you notice my girls are growin'? 
		player excited They... Certainly feel bigger...
		milf Almost big enough to hide you away~<br>Last time I had to resist, had to make sure every bit of cum went into my womb but, I think this time...<br>I wanna see it~<br>Show momma what cum looks like, what it smells like~
		player pleasured Ghh~
		im repeat1-3
		milf love Ohh, that twitch... Even through these lumps o' mine, I could feel it...
		milf excited C'mon, you can spurt early, momma don't mind, we got aaaall day~<br>I'm leakin' myself, y'know? When I get all tingly, my pussy won't stop dripping, and now my nipples'll start leaking through my clothes too~
		milf love Ohhh~<br>I feel it...! I...!
		player torogao Ghh! C-cumm-
		im repeat1-4
		milf orgasm Ghhlllmmmmph~!<br><i>N-no, my... My body's movin' on it's own! I wanna see, but... My eyes are rollin' back in my head!<br>Tastes so good...!<br>Wanna see *his face... But it tastes so goooooood~!</i>
		im repeat1-5
	`},	
	{index: "repeat2", name: "Repeatable - Heavy Petting", image: "milf/repeat2-1", requirements: "?flag "+character.index+" petting;",
	content: `
		milf happy Of course you can darlin', c'mere, and let momma-
		im repeat2-1
		milf confused ... Hmm? For me?
		player love Hoh... Your hair is so soft and silky~
		milf worried Y'think so? I mean... I don't got any of that fancy conditioner...<br>And ah sweat like... Well, like a cow...<br>Are you sure you'll be satisfied with me?
		player Gorgeous... So wonderful and soft~
		t It's hard to describe. A magical mixture of silk and stalks of wheat, but those two simply don't do it justice. There's a third ingredient you can't put into words, and when your fingers brush past her ears...
		player perverted Mmmmhmhm~<3
		milf befuddled ... Sugah? You alright?<br>Hello? You in there?<br>Stars n' garters, you're completely hypnotized...
		milf tired It's like yer body's here with me, but the light inside's been shut off...?
		milf amused Y-yer really out of it, right? Cause momma's really steamin'.<br>And there's a few things I'd like to practice sayin' if you're really not listenin'...
		player excited Fur... Hair... Fuzzy ears, so soft~<3
		im repeat2-2
		milf flirting Mmm, yeah, you just keep strokin' that hair you love so much... Don't pay me or my mouth no mind, you hear?
		t ...
		player Soft~
		im repeat2-3
		milf orgasm Ghouhhhh~<br>Momma's fat fuckin' titties won't stop leakin'!<br>Gawd, yer lettin' off those nasty fuck-smells like I'm lettin' off a whore's sweat!<br>Mm, c'mere... You get to play with momma's ears, let her get her face in those pits of yours~
		milf torogao Ngggh~! You smell so fuckin' good!<br>My fat friggin cunt's been screamin' at me non-stop for another dickin'! The second this baby's out, you're gonna kiss the shit outta my cervix till this fat cow's got another tyke in her!<br>Nghhh, yeah, lemme worship every inch of you!
		player pent Mmghh... Hmm? milfF, did you say something?
		milf panic Awawa~! Nothin', darlin'! D-did you like my hair? And ears?<br>Y'know, my tail ain't nothin' special, but-
		player love Tail? Tail! Tail, tail, tail~<3
		milf excited Mmm... Yeah, baby, you come here, pay me no mind... Play with my tail all you like, just let momma pick a part of you in return~
		t ...
		t Eventually, you return to your senses, not sure exactly where the time went.
		milf sparkle Now, y'all come back anytime, y'hear?
		player confused Uh... Sure?
		milf flirting Mmm, not sure why you liked 'em so much, but your baby momma's hair, tail, whatever you want are yours whenever you want more of 'em~
		player love Hoh...

	`},
	{index: "watch-start-milf", name: "Time Stopwatch - Mama Milkers pt.1", image: "milf/watch1-4",
	content: `
		player sparkle milfF!
		im watch1-1
		player worried She's frozen in time...<br>Her belly's so big...
		im watch1-2
		player crying Wah! It's not fair! I wanna feel the baby kick! I wanna hear her call me "Shug", I want mama to stroke my head and call me a good *boy for trying so hard!
		player pout ... Okay, tantrum done. Now, quick hug to restore some more sanity points...
		t You gently embrace milfF, healing a little mental damage knowing she'd definitely hug you back if she could move.
		player happy Okay. Now. Lewd things. Everyone here likes lewd things, and I like making everyone happy.<br>Obviously nothing that could hurt her belly, of course, sooo~
		t ...
		player orgasm Gghh~
		im watch1-3
		player pent Okay... Another load spent...<br>She looks pent-up, this should be way more than enough of my pheromones for her to cum.<br>Though, it's kinda neat that she doesn't lactate when time is stopped.<br>Alright, thanks for the hug, milfF.
		player sleep ...<br>"Ain't no problem at all, shug~! Why, if y'all had a hankering fer mah momma milkjugs, y'all'dn't've needed to stop at just the third facial!"
		player befuddled ... "Y'all'dn't've"? Am I having a stroke?
		player laugh ... Yeah, I am! I'm having a <i>breast</i> stroke!<br>Ah, at least the silence isn't taking away my comedic genius.
	`},
	{index: "watch-finish-milf", name: "Time Stopwatch - Mama Milkers pt.2", image: "milf/watch1-5",
	content: `
		t ...
		milf confused ... Hmm?
		im milf/watch1-4
		milf blushy A... Awawa~ Awawawa~
		t A heavily pent-up, hormonal and absolutely needy milfF is completely stunned like a heavy, weighted blanket is already covering her.
		t Somehow, the response is delayed, like a coyote hanging in the air until she looks past the mass of sticky, pheromone-laden cum covering her face, and looks down.
		t And <i>then</i> she begins to fall.
		im milf/watch1-5
		milf orgasm MMMMHHOOOOUUUUUUUU~<3<3<3!!!
		t Jets of breastmilk, a pure wave of relief wash over her as the delayed impact of several rounds of lovey-dovey titsex hit her all at once.
		im milf/watch1-6
		t She falls backwards, landing sitting on her massive rump, fainting from the overload. A fucked-silly look on her face and blank eyes. The only signs of life are her quivering, shaking legs, the irregular squirt of milk, and her squirting, <i>pulsing</i> pussy and clit.
	`},
	{index: "pill-milf", name: "Denial Pills - Hefty Milking", image: "milf/pills1-1-light",
	content: `
		player forced Can't... Hold on much more!<br>I'll need to work a load out right here!<br>Thank goodness I'm not right in the middle of town, there's some bushes over there!
		t ...
		milf pent Hoooo~<br>My girls are actin' up again...<br>What kinda sensible design means hangin' these always-needy milktanks offa me?<br>Constantly throbbing... These'll drive me crazy one of these-
		milf shock Huh?! My momma senses are ringin'! One of ma babies is gettin' over-watered!
		milf frown Ooh, I dunno who in this town'd try waterin' my plants, but they're about to learn not to get on this heifer's mad side! 'Specially when I'm all overstuffed like this!
		milf fury Hey, what the heck are you-
		milf awe ...!!!
		player orgasm Houghhhhh~!!!<br>It's... Not... Coming out!
		milf awe Mah gawd~
		player forced milfF?! What are you-<br>No, nevermind, I need your help! I took some pills, and-
		im pills1-1-light
		milf love Amazin'~<br>These babies are even closer to burstin' than mah shirt...
		player Right?! And no matter how much I...<br>Ghh...!<br>They're completely packed!
		milf perverted Ooh~<br>Well, don't you worry none, momma's got you in good hands~<br>I wonder if...
		milf sleep Hmm...<br>Ain't never tried this before...<br>If yer peeper between my milker's is called "pai-zoo-ree", then I guess this'd be...
		im pills1-2-light
		milf excited Ball~zoo~ree~!<br>Hmhm~<br>They're pulsin', sloshin' so hard it's exactly like when my baby's kickin'!<br>And your big ol' nuts are so... Firm, too! "Packed" is undersellin' it!
		player forced Ghhhhhgggg~! I think... It's working!
		milf perverted Just relax, shug~ Momma's titties are here to help.<br>Let yer rod come on down n' join the party too!
		im pills1-3-light
		t As she uses her whole body to stroke, your overworked cocktip <i>oozes</i> out a load as thick as glue.
		milf perverted Ffffuck~! Darlin', you're splurting so much onto mah clit it's like you're tryin' to glaze mah pussy!<br>You want me pregnant again already~?!
		player torogao Nghhhh~!!!
		milf excited And my oh my~!<br>Wavin' a pretty little donut right in front of a hungry gal... How's a girl supposed to hold back?
		t Your back arches and your legs shake as you suddenly feel a pair of thick, hungry lips press against your butthole.
		milf Mmmwah~<3<br>Don't mind me none...<br>I'm carryin' your kids, the least you can let me do is lemme give you a kiss~<br>Pucker up, darlin'. Momma's feelin'... Romantic~<3
		im pills1-4-light
		player orgasm HOUGGGHHHH~!!!
		t Your vision spins as a sensation somewhere between a log and a snake being excreted from your cocktip has your brain receiving error messages...
		t ...
		im locations/interiorMilf-Night
		player tired Mghh...
		t You wake up inside milfF's house, feeling like you just got done painting the broad side of a barn. Without any paint.
		im pills1-5
		milf blushing You're up! G'mornin, shug! <br>Err, well, it's long-past evenin' by now.<br>Need a bite? You splutted out a whole heapin' helpin' of batter, and believe me, I know what it's like to pump that much fluid in a day...
		player I should probably get going... Thank you, though. Sorry I ended up making such a mess...
		milf excited Oh, trust me, cleanin' it up after was my pleasure~
	`},
	{index: "cherry-milf", name: "Star-Crossed Cherry - Milf", image: "milf/cherry1-1",
	content: `
		define playerduo = dual sp1 player; sp2 player;
		playerduo sparkle milfF!
		milf happy Well howdy-
		milf awe Oh... Oh mah stars...
		player joy We found a magic cherry in the woods, now there's two of us!
		player happy And neither of us is evil. We checked!
		player sparkle Hey, we have enough people to play house now!
		milf blushy H-house?! L-like with m-mother and-
		player sparkle I'll be the husband!
		player sleep I guess I'm the baby then... Alright, lemme get into character...
		player laughing Mama~!
		milf love ... Say that again.<br>Right now, say it-<br>No, wait, come closer. Closer, please-
		t ...
		player amused Mama~<3 You like that, mama?
		player smug Hey, don't forget about me~
		im milf/cherry1-1
		milf torogao NGHHH~! Oh mah ffff-FUCKIN' gawd! I'm gonna die~! My brain's flyin' so high right now, I can't- I can't..  NGHHH-
		im milf/cherry1-2
		milf orgasm GHOUHHHHH~<3<br>Mah pussy, mah cunt! Room's spinnin'!
		player worried Hey, do you think we might have-
		milf pleasured I need... Need yer kids! I want yer children-!
		player panic G-gone too far? A little...<br>milfF, you're already-
		milf pleasured Mah cunt's so fuckin starved, PLEASE! I need it, I need it so bad it hurts!
		im milf/cherry1-3
		milf torogao Spray it on me, spray it <i>in</i> me, whatever it takes~!!!
		player panic Awawa-<br>Wait, are you-
		player pleasured We should... Gh... Give her what she wants, so she'll calm down!
		player torogao R-right! Y-yeah, or she'll work herself up even further, g-gotta...!
		im milf/cherry1-4-light
		playerduo orgasm Ghouhhh~! Cumming~!
		milf love O-ohhhh~
		t Somehow, for just the briefest moment, the biological anomaly that restores mental clarity just before a creampie triggered again, despite milfF already being heavily pregnant.
		milf love A-amazhin~<3
		t Though as rope after rope both cover and fill her, it seems like the effect is even more short-lived.
		im milf/cherry1-5
		milf love <3<3<3
		t Yet as the lights in her head go off, her expression doesn't change, staring blankly as pure white bliss envelopes her body.
		player shock Wah!
		t *POOF*
		player panic TWINNIE-ME, NOOOOO!
		t The sheer force of the milfsquirt cannon showed no mercy. Your other half was too gentle of a soul for such a powerful jet. In a flash, all that's left of *him is a cloud of sparkly smoke.
		milf afterglow Hah, hahhhh~<br>Fuck... Fuck... Pregnant... Made me pregnant...
		t While at least a few lives flash before milfF's eyes, you're just focused on the one you lost. A tragedy, taken before *his time.
		player crying I'll... I'll never forget you...<br>You'll be in my heart... Forever.
		player worried Sorry, milfF, can I pick a few of these flowers? I think this is as good a place for a grave as any.
		player sleep ... I'll take "squirting uncontrollably" as a yes.<br>Don't worry, I know you're crying too, in your own way.
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