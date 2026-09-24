var character = {index: "foxf", flags: "", fName: "Garnet", lName: "", color: "#A03D90", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "female"};

var logbookArray = [
	"im images/foxf/clothed/happy; im images/foxf/nude/happy; title Bookfox; One of the twin curators of Syrup Town's modest museum, foxfF and her brother foxmF handle organizing and caring for the museum's collections. <br>While more energetic and forward than her brother, the two prefer to act in sync whenever possible. Still, whenever her twin isn't around foxfF will happily let her voracious lust of knowledge show clearly on her face. ",
	"im images/foxf/logbook2.png; title Curator's Attire; The two foxes have collected records on hundreds, maybe soon to be thousands of different types of clothes worn by humans, so their decision to go totally bottomless is entirely their choice.<br>Granted, her long sleeves and are cute, but it's definitely overshadowed by the fact that her pussy is so brazenly on display. To make matters worse, she'll make it very clear at any opportunity that getting to know you, and your thick human cock, is her top priority. <br>She'll do this by leaning her hips forwards, hoping you'll notice that her bare pussy is just inches away from your crotch. And if you don't notice, she'll maybe just take a few tiny steps forwards, you don't mind if she relieves a little itch by dryhumping her box against you, using you as a masturbation tool, right? Although 'dry' humping might be the wrong term...",
	"im images/foxf/logbook3.png; title Needy Chest; She wears a matching shirt fit with her twin, but while his is baggy and loose, anyone can clearly see the outline of foxfF's braless perky tits beneath hers. Thankfully she hasn't realized how effective they can be, they're just sacks of fat to her that have been growing more sensitive since you arrived in town. She's got a keen eye, so don't let it show that her breasts arouse you. Definitely don't touch, grope, suckle, or put your face between them.<br>She's a predator at heart of course, so if you show weakness she won't hesitate to take advantage. Like by rubbing up against you, or maybe by flashing them at you at any given opportunity, and God help you if she learns how amazing it feels to have a cock between them...",
	"im images/foxf/logbook4.png; title Jiggly Butt; Another aspect shared exactly with her twin, foxfF's ass is the perfect blend of fit and jiggly. That plus a natural affinity for anal means she'll definitely turn into a grade-A buttslut if you let her.<br>It's really up to you whether it's her absolutely soaked cunt or her near-insatiable asshole you want to try and satisfy, just make sure you've got the energy to keep up!",
];

var achievementArray = [
];

var itemsArray = [
];

var shopArray = [
];

var pickupArray = [
	{index: "permitIntro0", requirements: "?location forestWilderness; ?item net; ?feral; !item unknownWorm; !flag foxf permitWaiting; !item permit;", top: 40, left: 69, event: true, size: 15, image: "items/net"},
];

var morningArray = [
	{index: "hot-1", priority: 1, requirements: "?flag foxf reward1F; !carnivore; !vegetarian;", unique: false,},
	{index: "bath-1", priority: 1, requirements: "?flag foxf reward1F;", unique: false,},
	{index: "fun-foxf", priority: 40, requirements: "?flag foxf fun-start; ?trustMin foxf 1;", unique: true,},
];

var encounterArray = [
	{index: `museumIntro`, name: `Take a Tour of the Museum`, requirements: "?location museumExterior; !flag foxf intro;", type:"button", top: 35, left: 35},
	{index: "reward2Start", type:"walking", requirements: "?location playerHouse; ?trustMin foxf 1; ?day 10; ?flag foxf reward1F; !flag foxf reward2; !flag foxf rewardWaiting;"},
	{index: "reward2", name: `Invite foxfF over`, requirements: "?location playerHouse; ?trustMin foxf 1; ?flag foxf reward1F; ?day 5; !flag foxf reward2; ?flag foxf rewardWaiting;"},
	{index: "fun-start", type:"walking", requirements: "?location museumExterior; ?day 20; ?flag foxf reward1F; ?vegetarian; !flag foxf fun-start; !flag foxf fun-finish;"},
	{index: "fun-start", type:"walking", requirements: "?location museumExterior; ?day 20; ?flag foxm reward1M; ?carnivore; !flag foxf fun-start; !flag foxf fun-finish;"},
	{index: "fun-start", type:"walking", requirements: "?location museumExterior; ?day 20; ?flag foxf reward1F; ?flag foxm reward1M; !flag foxf fun-start; !flag foxf fun-finish;"},
	{index: "fun-finish", type:"walking", requirements: "?location pineconePlaza; ?flag foxf fun-foxf; ?flag foxf reward2; ?flag foxm fun-foxm; ?flag foxm reward2; !flag foxf fun-finish;"},
	{index: "fun-finish", type:"walking", requirements: "?location pineconePlaza; ?flag foxf fun-foxf; ?flag foxf reward2; !fetish male; !flag foxf fun-finish;"},
	{index: "fun-finish", type:"walking", requirements: "?location pineconePlaza; !fetish female; ?flag foxm fun-foxm; ?flag foxm reward2; !flag foxf fun-finish;"},
	{index: "fun-foxd", type:"walking", requirements: "?location museumExterior; ?fetish female; ?fetish male; ?flag foxf fun-finish; !flag foxf fun-foxd; ?time Morning;"},
];

var sceneArray = [
	//Scenes
	{index: `museumIntro`,
	content: `
		eval writeFox('intro');
	`,},
	{index: `intro2`,
	content: `
		eval writeFox('intro2');
	`,},
	{index: `mystery`,
	content: `
		eval addFlag('foxf', 'mystery');
		eval raiseTrust("foxf", 1);
		eval writeEvent("foxf", "mystery");
	`,},
	{index: `fun-start`,
	content: `
		eval addFlag('foxf', 'fun-start');
		eval data.player.location = "willowWalk";
		t As you approach the museum, you notice the pair of curators laying on the ground at the entrance.
		player joy Heeee-<br>-lloooo...?
		t Both of then look totally knackered, and not in the fun, sweaty, horny way. Just the regular, sweaty, tired way.
		define foxd = dual sp1 foxm; sp2 foxf;
		foxd tired Hello, playerF.
		player scared W-what happened to you two!?<br>Where'd all that bushy-tail energy go, are you okay?
		foxm tired We're fine... We're just... So tired...<br>So much paperwork, ordering all those things...
		foxf tired All that digging...<br>And we're supposed to clear a path through succabus forest next...<br>But my arms are dead from handling glass statues bigger than I am...
		foxm Hey, don't confirm that. Keep the sizes of the statues nebulous, or it'll break the human's suspension of disbelief.
		foxf Sure, sure. But really, don't worry, now that you're here...
		foxd excited *Sniiiiiff*<br>*Sniff* *Sniff* *Sniff*
		foxf perverted Mmmh~<3<br>Ooh, ooh! What if we did a threesome for collecting things! Like bugs?<br>Oh, or fruit?! Those are even easier to find!
		foxm sparkle We could even put the fruit right in front of *his door so *he finds them right away!
		t The moment they take a good whiff of you, they're thankfully back to their former selves.
		player confused Eh? Reward?<br>Wait, you said there wouldn't be a reward for collecting things...
		foxd worried ...
		foxf crying Waaaah! But I wanna have seeeex! I want it I want it I want it!
		foxm crying Waaaah! Why did we even say that?!<br>How come we need to come up with reasons to have sex? This is so unfair!
		player amused Aww come on you two. Don't give up!
		player sleep I get it.<br>Now I know why you two haven't visited me as much as the rest of the townsfolk.<br>You two have been holding yourselves back so that I don't feel overwhelmed!<br>You're trying to pace me so that this place feels like a real, relaxing and cozy home instead of a constant sweaty orgy.
		foxf ... *Sniff*<br>It has been really hard not sneaking into your house...<br>And clearing out all the space for minigames was really hard...
		foxm ... *Sniff*<br>And trying not to steal your worn clothes to use as masturbation material...<br>Plus, I made me and foxfF shorts so that we could both hang around you, even in carnivore and vegetarian modes...
		player confused Those both sound... Really tough? I guess?<br>But you two know you can just visit me whenever, right?
		foxd shock Huh?!
		foxm scared We could have been doing that this whole time?!
		foxf scared We didn't need to do any of that hard work?!
		foxm angry Quick, while we still have energy from being around the human!<br>We need to put all those plans we discarded into action!
		foxf angry Absolutely!<br>But wait, what about "fox in a box"? Can you manage being alone?
		foxm worried ... It's really dark, and scary...
		foxf amused Heh. Guess it's a good thing I got those batteries for the nightlight then, huh?
		foxm sparkle You did?! You're the best, sis! Let's go!<br>And playerF, don't wait too long before you next go digging!
		player shock ...!
		player amused They sure left in a hurry.<br>Well, at least they're excited again.
		finish
	`,},
	{index: `fun-foxf`,
	content: `
		eval addFlag('foxf', 'fun-foxf');
		eval raiseTrust("foxf", 1);
		eval writeEvent("foxf", "fun-foxf");
		finish
	`,},
	{index: `fun-foxd`,
	content: `
		eval addFlag('foxf', 'fun-foxd');
		eval writeEvent("foxf", "fun-foxd-foxm-foxf");
		eval passTime();
		eval editSkill("stamina", 5);
		eval writeSpecial("You feel like your stamina has improved!")
		finish
	`,},
	{index: `fun-finish`,
	content: `
		eval writeEvent("foxf", "fun-finish-foxf-foxm");
		eval addFlag('foxf', 'fun-finish');
		eval passTime();
		finish
	`,},

	//Events
	{index: `reward1F`,
	content: `
		eval writeEvent("foxf", "reward1F");
		eval addFlag("foxf", "reward1F");
		eval addFlag("foxf", "intro");
		eval setTrust("foxf", 1);
		eval setTrust("foxm", 1);
		eval passTime();
		finish
	`,},
	{index: `reward2`,
	content: `
		eval writeEvent("foxf", "reward2");
		eval addFlag("foxf", "reward2");
		eval raiseTrust("foxf", 1);
		eval passTime();
		finish
	`,},
	{index: `reward2Start`,
	content: `
		t Stifling a yawn you head you take a moment to enjoy the peace and quiet of your home. Calm, serene, quiet.
		t *KNOCK* *KNOCK* *KNOCK*
		player sleep ... Meh, silence is overrated anyways.
		im foxf/reward2-1
		foxf happy Hello hello hello~! How's my favorite human doing today?
		player happy D'aww, I bet you say that to every human you meet.
		foxf I do!<br>So, this is how humans live, huh? Very... House-ey. I like it.
		player happy Thanks! I try to keep it clean. Was there a reason you dropped by?
		foxf worried What, a girl can't just drop by to say hello?<br>Maybe I just wanted to check up on you out of the goodness of my heart, so that we could have a relaxing chat together, huh? Did you ever think of that?
		player happy So if I invite you to stay, it won't just immediately devolve into frantic sex?
		foxf happy Weeeell, I mean, I can't see the future. But the chances of that happening aren't <i>not</i> zero.
		eval addFlag("foxf", "rewardWaiting");
		trans reward2; Invite her inside
		trans cancel; Rain check
		eval unencounter(data.player.currentCharacter);
	`,},
	{index: `reward1FAlt`,
	content: `
		foxf Eh? Really?!
		foxm worried Aww, learning time is over?<br>Okay, I'll get the notebook.
		foxf sparkle Alright! So, let's get started! I haven't gone fully into heat yet, so only oral and hands for now.<br>I've done lots of independent research, but all homework and no fieldwork means I maaaay have a few misconceptions.
		foxf happy So, lemme just sit down here real quick. By the way, blowjob, fellatio, deepthroat, irrumatio, sloppy toppy, throatfucking, colon equals three-ing, tonsil tickling, giving you <i>"The Hoover"</i>, those are all the same ballpark, right?
		player worried I don't think that last one was real.
		foxf shock What?! No! That was my favorite one!<br>Aw man, this blows. I, uh... Um...
		t ...
		eval writeEvent("foxf", "reward1F");
		eval addFlag("foxf", "reward1F");
		eval passTime();
		finish
	`,},
	{index: `reward1M`,
	content: `
		eval writeEvent("foxm", "reward1M");
		eval addFlag("foxm", "reward1M");
		eval addFlag("foxf", "intro");
		eval setTrust("foxf", 1);
		eval setTrust("foxm", 1);
		eval passTime();
		finish
	`,},
	{index: `repeat1`,
	content: `
		eval writeEvent("foxf", "repeat1");
		eval unlockScene("foxm", "repeat1");
		eval addFlag("foxf", "repeat1");
		eval addFlag("foxm", "repeat1");
		eval passTime();
		finish
	`,},
	{index: `repeat1First`,
		content: `
			eval writeEvent('repeat1')
			eval unlockScene("foxm", "repeat1");
			eval addFlag('foxf', 'repeat1')
			eval addFlag("foxm", "repeat1");
			eval passTime();
			finish
		`
	},
	{index: `repeat1Repeat`,
		content: `
			im repeat1-1
			im repeat1-2a !boys;
			im foxf/repeat1-2b ?boys;
			im repeat1-3a !boys;
			im foxf/repeat1-3b ?boys;
			finish
		`
	},

	//Morning
	{index: `hot-1`,
		content: `
			t It's a brand new day in syrup town...
			t And it's an absolute scorcher!
			im foxf/hot1
			foxf sleep Hmm. You alright over there, little bro? Need some help?
			im foxm/hot1
			foxm worried No, just...<br>Actually, maybe I do. I don't think the sunscreen was thick enough...
			foxf sleep Maybe if you weren't constantly rubbing it off, it'd stay?
			trans cancel; Finish
		`
	},
	{index: `bath-1`,
		content: `
			im bath1
			foxf sleep Scrubba-dee bubba-dee~
			foxm sleep Thanks again sis.<br>I know you prefer showers and all...
			foxf happy No problem~! Us being a pair is our charm point after all.<br>Now keep those eyes closed or shampoo'll get in them.
			foxm sleep Hmm. Alright.
			trans cancel; Finish
		`
	},

	//Museum stuff
	{index: `museumTerrarium`,
	content: `
		eval addFlag("foxf", "intro") !flag foxf Intro;
		foxf This is the terrarium. Or you could call it the botanical garden or the biodiversity exhibit. It's a lot of things.
		foxf sparkle It's where we'll keep track of the fruit, treasures, and critterrs you find!
		trans museumTerrariumQ1; Is there a reward for all this?
		trans museumTerrariumQ2; Why bother maintaining a garden?
		trans museumTerrariumQ3; Any advice searching for stuff?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumTerrarium')
	`,},
	{index: `museumTerrariumQ1`,
	content: `
		player Is there some kind of reward or incentive for collecting all of them?
		foxf Nope!
		foxf worried Should there be?<br>Wouldn't that just pull attention away from your main goal?
		player So it's just a form of intrinsic reward?
		foxf happy Yeah! You'll find plenty of bugs, fruits, and insects while hunting for jiggies and stuff anyways.	 
		trans museumTerrariumQ2; Why bother maintaining a garden?
		trans museumTerrariumQ3; Any advice searching for stuff?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumTerrarium')
	`,},
	{index: `museumTerrariumQ2`,
	content: `
		player Why maintain this whole botanical garden when all these species live right outside?
		foxf happy The ecosystem changes all the time. Something could happen that might endanger any one of these critters.
		foxm worried That'd be awful! !vegetarian;
		foxf happy Plus, someday you might bring in some non-native species, like a snugworm from the autumnal farms. If you ever go there.
		foxm happy Is that what they're called? Huh. !vegetarian;
		player Is it a lot of work to maintain this place?
		foxf sleep Not at all~<br>Especially when milfF volunteers all the time~ 
		trans museumTerrariumQ1; Is there a reward for all this?
		trans museumTerrariumQ3; Any advice searching for stuff?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumTerrarium')
	`,},
	{index: `museumTerrariumQ3`,
	content: `
		player Any advice on searching for stuff?
		foxf happy Well, gathering spots outside will refresh every day.
		foxm happy Which works out perfectly to foraging between spending time with townsfolk. !vegetarian;
		foxf Plus, if you meet someone else in town you can go foraging with them.
		foxf sparkle And then you'll get double the stuff!	 
		trans museumTerrariumQ1; Is there a reward for all this?
		trans museumTerrariumQ2; Why bother maintaining a garden?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumTerrarium')
	`,},
	{index: `museumTechnology`,
	content: `
		eval addFlag("foxf", "intro") !flag foxf Intro;
		foxf happy This is the technology wing.<br>It's also the history wing, sort of.
		foxf sparkle Artificial intelligence, how it works, how it's used...
		foxf worried And the myriad ethical questions that come from it...
		trans museumTechnologyQ1; How can I use this stuff, and what should I use specifically?
		trans museumTechnologyQ2; I'm on a bit of a budget, can I still use the technology?
		trans museumTechnologyQ3; What's with all <i>these</i> computers?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumTechnology')
	`,},
	{index: `museumTechnologyQ1`,
	content: `
		player How can I use this stuff, and what should I use specifically?
		foxf That's covered in the easyfluff and sdxl sections.<br>If you want to make stuff that looks just like us and matches the town's vibes, use Easyfluff with the Syuro lora.
		foxf sleep Otherwise, SDXL, or more specifically AutismMix, will give better results.
		foxf frown But it's also way, way more demanding on your graphics card!	 
		trans museumTechnologyQ2; I'm on a bit of a budget, can I still use the technology?
		trans museumTechnologyQ3; What's with all <i>these</i> computers?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumTechnology')
	`,},
	{index: `museumTechnologyQ2`,
	content: `
		player I'm on a bit of a budget, can I still use the technology?
		foxf worried Kind of, but the specific websites you'd use if you wanted to generate stuff from your phone or laptop change all the time.<br>Which means we don't really have any answers for you on that front, sorry.
		trans museumTechnologyQ1; How can I use this stuff, and what should I use specifically?
		trans museumTechnologyQ3; What's with all <i>these</i> computers?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumTechnology')
	`,},
	{index: `museumTechnologyQ3`,
	content: `
		player What are all of these computers actually for?
		foxf Looking cool and playing audio logs, mostly.<br>Plus there's so many in here I can push two of them together and use two keyboards at once!
		foxf sparkle Double hacking~!
		trans museumTechnologyQ1; How can I use this stuff, and what should I use specifically?
		trans museumTechnologyQ2; I'm on a bit of a budget, can I still use the technology?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumTechnology')
	`,},
	{index: `museumFashion`,
	content: `
		eval addFlag("foxf", "intro") !flag foxf Intro;
		foxf This is the fashion wing~!
		foxf excited Here, you can change characters outfits as you please~
		trans museumFashionQ1; How were these outfits made?
		trans museumFashionQ2; How do I get more clothes?
		trans museumFashionQ3; Couldn't I just do this at home?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumFashion')
	`,},
	{index: `museumFashionQ1`,
	content: `
		player How were these outfits made?
		foxf Well, this wing <i>was</i> also going to have a section dedicated to different kinds of clothes and how they work, but there's not much point in that anymore...
		player shock Why not? I'd love to know how to wear a shirt.
		foxf worried You... But you're-<br>Nevermind. The reason is because right now everything you're seeing is built from Stable Diffusion 1.5. But soon it looks like new stuff will be made with Stable Diffusion XL.<br>Which means all the skills and tricks involved with creating clothes, poses, and characters will be rendered pretty pointless...
		foxf happy But hey, there's more than enough sexy stuff to go around right now.<br>If you wanna know more, there's a whole section in the technology wing about it.	 
		trans museumFashionQ2; How do I get more clothes?
		trans museumFashionQ3; Couldn't I just do this at home?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumFashion')
	`,},
	{index: `museumFashionQ2`,
	content: `
		player How do I get more clothes? 
		foxf The same way you did before, by gathering insects and fruit, selling them, and otherwise solving arbitrary tasks.
		foxf shock Is that not how humans usually get clothes?
		player happy No, we're pretty much the same.
		trans museumFashionQ1; How were these outfits made?
		trans museumFashionQ3; Couldn't I just do this at home?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumFashion')
	`,},
	{index: `museumFashionQ3`,
	content: `
		player Couldn't I just do this at home? That's where my wardrobe already is, and everyone I'm dressing up is more than welcome inside.
		foxf shock No way! Then we'd serve no actual gameplay purpose!
		foxf worried Plus, there's already way too many buttons in your house. Those poor mobile players already have their screens stuffed to burst! 
		trans museumFashionQ1; How were these outfits made?
		trans museumFashionQ2; How do I get more clothes?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumFashion')
	`,},
	{index: `museumSponsor`,
	content: `
		eval addFlag("foxf", "intro") !flag foxf Intro;
		foxf happy This is the sponsor wing!<br>It's a dedication to all the current sponsors keeping this place alive~
		foxf worried It's a lot of names to keep track of...
		foxf sparkle But they're precious enough to make it all worth it!
		trans museumSponsorQ1; How do I get on one of these lists?
		trans museumSponsorQ2; What happened to the patrons?
		trans museumSponsorQ3; Can I get some cool stuff?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumSponsor')
	`,},
	{index: `museumSponsorQ1`,
	content: `
		player How do I end up on one of these lists? 
		foxf happy Money. Like, real money. The kind you can't just find in the bushes.
		player worried ...
		foxf Don't feel bad! Everything here is totally free for a reason. You can slamfuck this bootyhole all day every day without paying a dime.
		trans museumSponsorQ2; What happened to the patrons?
		trans museumSponsorQ3; Can I get some cool stuff?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumSponsor')
	`,},
	{index: `museumSponsorQ2`,
	content: `
		player What happened to the patrons?
		foxf angry The page was banned...<br>And the support staff ghosted afterwards...
		player worried Oof, touchy subject.
		trans museumSponsorQ1; How do I get on one of these lists?
		trans museumSponsorQ3; Can I get some cool stuff?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumSponsor')
	`,},
	{index: `museumSponsorQ3`,
	content: `
		player Can I get some cool stuff by being on these lists?
		foxf happy Do you like previews, voting in polls, and a star mounted on your bedroom wall?
		player Nope.
		foxf worried Oh. Well, no then. 
		foxf You could ask the town's founder for a picture or two though.
		player sparkle ...!
		trans museumSponsorQ1; How do I get on one of these lists?
		trans museumSponsorQ2; What happened to the patrons?
		eval specialFoxFOptions();
		button Finish; fakeLocation('museumSponsor')
	`,},
	//Monster fucker permit
	{index: `permitIntro0`,
	content: `
		t You decide to go hunting around, and while exploring you find...
		im misc/permitIntro0
		player befuddled What the...<br>What in the world is this thing? <br>It's some kind of giant... Thick-lipped worm?
		player sparkle Cooool! I don't remember seeing this in the terrarium wing, maybe it's an undiscovered species!<br>I should take it over to the museum, quick!
		eval unencounter('`+character.index+`')
		eval addItem("unknownWorm");
		finish
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

	//System things
	{index: `cancel`,
	content: `
		eval unencounter(data.player.currentCharacter);
		eval changeLocation(data.player.location);
	`,},
	{index: `modReturn`,
	content: `
		eval modReturn();
	`,},
	{index: "resumeDigging", content: `
		eval digResume();
	`},
	{index: "forestTrapFoxF", content: `
		eval writeEvent("trap");
		eval addFlag("foxf", "trap");
		finish
	`},
]

var specialFoxFList = [
	{index: `reward1FAlt`, requirements: "!flag foxf reward1F;", text: `I'm ready for the other half of my reward`},
	{index: `repeat1`, requirements: "!flag foxf repeat1; !flag foxm repeat1;", text: `You've done a good job, you deserve something nice`},
	{index: `permitIntro1`, requirements: "?item unknownWorm; !flag foxf permitWaiting; !item permit;", text: `Check out this weird worm I found!`},
	{index: `permitIntro2`, requirements: "?flag foxf permitWaiting; !item permit;", text: `I'm ready to get my permit!`},
]

function specialFoxFOptions() {
	for (i = 0; i < specialFoxFList.length; i++) {
		if (checkRequirements(specialFoxFList[i].requirements) == true) {
			writeHTML(`
				trans `+specialFoxFList[i].index+`; `+specialFoxFList[i].text+`
			`);
		}
	}
}

function writeFox(n) {
	data.player.currentCharacter = "foxf";
	soundEffectStart("talk");
	document.getElementById('output').innerHTML = '';
	wrapper.scrollTop = 0;
	switch (n) {
		case "intro": 
			if (data.player.vegetarian != true && data.player.carnivore != true) {
				writeHTML(`
					bg locations/interiorFox
					define foxd = dual sp1 foxm; sp2 foxf;
					t You take a step inside and behold the majesty of the place. All is quiet, but only for a moment.
					im foxf/introOmni
					t A pair of twin foxes appear from behind a corner, both wearing matching outfits.
					sp foxf; Hello, I'm <input type='text' id='nameSubmission-foxf' value='foxfF'>! <br>Welcome!
					foxm And I'm <input type='text' id='nameSubmission-foxm' value='foxmF'>! <br>To our museum!
				`);
			}
			if (data.player.vegetarian == true) {
				writeHTML(`
					bg locations/interiorFox
					define foxd = dual sp1 foxm; sp2 foxf;
					t You take a step inside and behold the majesty of the place. All is quiet, but only for a moment.
					im foxf/introVegetarian
					t A pair of twin foxes appear from behind a corner, both wearing matching outfits.<br>... Mostly.
					sp foxf; Hello, I'm <input type='text' id='nameSubmission-foxf' value='foxfF'>! Welcome!
					foxm And <input type='text' id='nameSubmission-foxm' value='foxmF'>! <br>To our museum!
				`);
			}
			if (data.player.carnivore == true) {
				writeHTML(`
					bg locations/interiorFox
					define foxd = dual sp1 foxm; sp2 foxf;
					t You take a step inside and behold the majesty of the place. All is quiet, but only for a moment.
					im foxf/introCarnivore
					t A pair of twin foxes appear from behind a corner, both wearing matching outfits.<br>... Mostly.
					sp foxf; Hello, I'm <input type='text' id='nameSubmission-foxf' value='foxfF'>! Welcome!
					foxm And I'm <input type='text' id='nameSubmission-foxm' value='foxmF'>! To our museum!
				`);
			}
			writeHTML(`
				foxd Enter a whole new world!<br>Learn about history...<br>And the future!
				foxm sleep I'm the cute twin brother~
				foxf sleep I'm the cute twin sister~
				foxm sparkle Technology... Biodiversity...
				foxf sparkle Fashion... Legacy...
				foxm sparkle We...
				foxf sparkle Hope...
				foxd sparkle We hope you'll enjoy our tour!
				button Continue; renameCharacter('intro2')
			`);
		break;
		case "intro2": 
			if (data.player.vegetarian != true && data.player.carnivore != true) {
				writeHTML(`
					foxm happy Alright, we nailed that one!
					foxf happy A perfect opener!<br>Sorry if it felt rushed. That part of the script was written back when we had to keep each of our parts of the script short, just in case a visitor had the carnivore or vegetarian modes enabled.<br>Normally we're more talkative, but it used to be that if one of us said too many lines it would stretch the text box down.<br>That'd be fine except, we aren't wearing pants.
					player Oh. Well, points for keeping things accessible, I guess.
					foxm sparkle But today we'll be giving you the tour of the place together! And bottomless!<br>Thank goodness, too, because I was actually pretty worried about that...<br>And we've got some rewards for starting and finishing the tour. Oh, sex will be involved, if you're interested.
					player sparkle Am I?!
					foxf worried ... Are you?
					player happy Yes.
					foxf sparkle Woohoo!
					foxm happy Alright, okay, here's a little something for you for visiting the museum for the first time.
					t They each take out a small box of jiggy pieces.
					foxm happy It's a picture of our butts! We heard humans love that sort of thing.
					player sparkle You heard correctly!
					foxf sparkle Aw yeah! Alright, let's get started, just walk around the museum and talk to me, and I'll give you the juicy deets! There's four wings to the place, the Terrarium Wing, the Technology Wing, the Fashion Wing, and the Sponsor Wing. Let's go! 
				`);
			}
			if (data.player.vegetarian == true) {
				writeHTML(`
					foxf happy Alright, we nailed that one!<br>How are you feeling?
					foxm pent Honestly? These really suck... I feel like I'm overheating...
					foxf sleep No problem, I'll handle the rest of the tour for you.<br>You go take a rest for now, since the rest of the script can be done by just one of us.
					foxm pent Okay... Have fun with the human...
					foxf excited Ehehe~<br>I will~<3
					player worried What was that all about?
					foxf happy That was my twin brother!<br>He's stepping out since you have vegetarian mode enabled. Either that, or you disabled boys in the fetish menu.
					foxf worried ... You did check that, right? There's lots of stuff in there to deal with, if you haven't already.<br>Well, either way, he needs to wear pants when you're around.
					player worried I appreciate the effort then. It must be hard for all the males of the town to keep out of sight.
					foxf Eh, most of the men in town are pushovers who instinctively avoid anything intimidating.<br>Kind of the reason the mayor needed you to move here actually... Anyways, welcome to our museum! I'll be giving you the tour of the place, and some rewards for starting and finishing the tour. Oh, sex will be involved, if you're interested.
					player sparkle Am I?!
					foxf worried ... Are you?
					player happy Yes.
					foxf sparkle Yes! Alright, okay, here's a little something for you for visiting the museum for the first time.
					t foxf takes out a small box of jiggy pieces.
					foxf happy It's a picture of my butt! I heard humans love that sort of thing.
					player sparkle You heard correctly!
					foxf sparkle Aw yeah! Alright, let's get started, just walk around the museum and talk to me, and I'll give you the juicy deets! There's four wings to the place, the Terrarium Wing, the Technology Wing, the Fashion Wing, and the Sponsor Wing. Let's go!
				`);
			}
			if (data.player.carnivore == true) {
				writeHTML(`
					foxm happy Alright, we nailed that one!<br>How are you feeling?
					foxf pent Not great, I feel like I'm overheating already.
					foxm sleep No problem, I'll handle the rest of the tour for you.<br>You go take a rest for now, since the rest of the script can be done by just one of us.
					foxf pent Okay... Good luck little bro, be sure to tell me how it goes.
					foxm amused Sure, sure, I will.
					player worried What was that all about?
					foxm happy That was my twin sister.<br>She's stepping out since you have carnivore mode enabled. Either that, or you disabled girls in the fetish menu.
					foxm worried ... You did check that, right? There's lots of stuff in there to deal with, if you haven't already.<br>Well, either way, she needs to wear pants when you're around.
					player worried Oh. I appreciate the effort then. It must be hard for all the women of the town to keep out of sight. 
					foxm sleep It's fine, she, and the rest of the girls in town, will be helped out plenty just by you living here.<br>Anyways, welcome to our museum! I'll be giving you the tour of the place, and some rewards for starting and finishing the tour. Oh, sex will be involved, if you're interested.
					player sparkle Am I?!
					foxm worried ... Are you?
					player happy Yes.
					foxm sparkle Yes! Alright, okay, here's a little something for you for visiting the museum for the first time.
					t foxm takes out a small box of jiggy pieces.
					foxm happy It's a picture of my butt! I heard humans love that sort of thing.
					player sparkle You heard correctly!
					foxm happy Thank goodness. Alright, let's get started, just walk around the museum and talk to me, I'll answer any questions you have. There's four wings to the place, the Terrarium Wing, the Technology Wing, the Fashion Wing, and the Sponsor Wing, where should we head first?				
				`);
			}
			writeHTML(`
				button The Terrarium Wing; writeFox('intro-terrarium')
				button The Technology Wing; writeFox('intro-technology')
				button The Fashion Wing; writeFox('intro-fashion')
				button The Sponsor Wing; writeFox('intro-sponsor')
			`);
		break;
		case "intro-terrarium": 
			writeHTML(`
				im locations/museumTerrarium
				bg locations/museumTerrarium
			`);
			if (data.player.vegetarian != true && data.player.carnivore != true) {
				writeHTML(`
					foxm This is the terrarium, or the botanical garden, or the biodiversity exhibit. It's a lot of things.
					foxf Syrup Town is home to a lot of unique bugs, plants, and fish! This is where they'll all be displayed.
					player worried Fish, huh? Isn't it weird to catch animals when, y'know...
					foxm worried ... Oh geez. Did we get a racist human?
					player shock No! I'm just wondering, what's really the dif-<br>Err, well, where exactly are we drawing the line? What creatures have the right to live? These creatures can feel pa-
					foxf happy Oh, that's easy! If a fish has knockers and or a throbbing cock, they get treated with respect and dignity.
					player happy Oh, that makes sense.
					foxm Glad we cleared that up. Anyways, when you catch or find new things, they'll be displayed here and we'll give you tidbits of info on them.
					foxf And we'll track how many you've found if you're one of those crazy people who likes seeing big numbers.
					player Why just me? Surely someone else in town has found some of this stuff before me, right? And how would you already have information on all of them if I'm the first one to catch or fish up any of them?
					foxm frown ... You shouldn't ask those sorts of questions.
					foxf frown ... Yeah, people who ask those kinda things... Bad stuff happens to them.
					player O... Okay...
					foxf sparkle Next wing!
				`);
			}
			if (data.player.vegetarian == true) {
				writeHTML(`
					foxf This is the terrarium! Syrup Town is home to a lot of unique things! Fish, bugs, fruit, treasures, this is where they'll all be displayed.
					player worried Fish, huh? Isn't it weird to catch animals when, y'know...
					foxf worried ... Oh geez. Did we get a racist human?
					player shock No! I'm just wondering, what's really the dif-<br>Err, well, where exactly are we drawing the line? What creatures have the right to live? These creatures can feel pa-
					foxf happy Oh, that's easy! If a fish has huge knockers, they get treated with respect and dignity.
					player happy Oh, that makes sense.
					foxf Glad we cleared that up. Anyways, when you catch fish, bugs, or pick new kinds of fruit they'll be displayed here and we'll give you tidbits of info on them. And we'll track how many you've found if you're one of those crazy people who likes seeing big numbers.
					player Why just me? Surely someone else in town has found some of this stuff before me, right? And how would you already have information on all of them if I'm the first one to catch or fish up any of them?
					foxf frown ... You shouldn't ask those sorts of questions. People who ask those kinda things... <br>Bad stuff happens to them.
					player O... Okay...
					foxf sparkle Next wing!
				`);
			}
			if (data.player.carnivore == true) {
				writeHTML(`
					foxm This is the terrarium! Or the botanical garden, or the biodiversity exhibit. It's a lot of things. <br>Syrup Town is home to a lot of unique things!  Fish, bugs, fruit, treasures, this is where they'll all be displayed
					player worried Fish, huh? Isn't it weird to catch animals when, y'know...
					foxm worried ... Oh geez. Did we get a racist human?
					player shock No! I'm just wondering, what's really the dif-<br>Err, well, where exactly are we drawing the line? What creatures have the right to live? These creatures can feel pa-
					foxm happy Oh, that's easy! If a fish has a cock and or balls, they get treated with respect and dignity.
					player happy Oh, that makes sense.
					foxm Glad we cleared that up. Anyways, when you catch fish, bugs, or pick new kinds of fruit they'll be displayed here and we'll give you tidbits of info on them. And we'll track how many you've found if you're one of those crazy people who likes seeing big numbers.
					player Why just me? Surely someone else in town has found some of this stuff before me, right? And how would you already have information on all of them if I'm the first one to catch or fish up any of them?
					foxm frown ... You shouldn't ask those sorts of questions. People who ask those kinda things... <br>Bad stuff happens to them.
					player O... Okay...
					foxm sparkle Let's move on!
				`);
			}
			addFlag("foxf", "terrarium");
			writeHTML(`
				button The Terrarium Wing; writeFox('intro-terrarium') !flag foxf terrarium;
				button The Technology Wing; writeFox('intro-technology') !flag foxf technology;
				button The Fashion Wing; writeFox('intro-fashion') !flag foxf fashion;
				button The Sponsor Wing; writeFox('intro-sponsor') !flag foxf sponsor;
				button Finish the tour; writeFox('intro3') ?flag foxf terrarium; ?flag foxf technology; ?flag foxf fashion; ?flag foxf sponsor;
			`);
		break;
		case "intro-technology": 
			writeHTML(`
				im locations/museumTechnology
				bg locations/museumTechnology
			`);
			if (data.player.vegetarian != true && data.player.carnivore != true) {
				writeHTML(`
					foxm sparkle This is the technology wing!
					player I didn't expect a technology wing in a museum. Some of this stuff looks almost cutting edge.
					foxm It's also a historical section. The whole wing is dedicated to artificial intelligence, more specifically how it's used to create art.
					foxf sparkle That's how we were made! And our whole world! We live in a simulation, but for real!
					player worried The fourth wall is in shambles...
					foxf sleep It's fiiiine~
					foxm sleep We broke it already when we referenced the carnivore and vegetarian modes~
					foxf sparkle Anyways, the section's split into multiple parts. What the technology is, how it was used to make the world...
					foxm happy And several sections on ethical use. Or, rather, if that's even possible.
					foxf sleep But really, lots of people just want to enjoy a relaxing life full of sex. So we won't force any of it on you.
					foxm sleep These sections are audio narrated by the town's founder. So take a listen whenever you want.				
				`);
			}
			if (data.player.vegetarian == true) {
				writeHTML(`
					foxf happy This is the technology wing.
					player I didn't expect a technology wing in a museum. Some of this stuff looks almost cutting edge.
					foxf It's also a historical section. The whole wing is dedicated to artificial intelligence, more specifically how it's used to create art.<br>That's how we were made! And our whole world! We live in a simulation, but for real!
					player worried The fourth wall is in shambles...
					foxf sleep It's fiiiine~<br>We broke it already when we referenced the carnivore and vegetarian modes~<br>Anyways, the section's split into multiple parts. What the technology is, how it was used to make the world...
					player happy And it looks like there's a lot of sections on ethical use...
					foxf happy If that's even possible.<br>But really, lots of people just want to enjoy a relaxing life full of sex. So we won't force any of it on you.
					foxf sleep And these sections are audio narrated by the town's founder. So take a listen whenever you want.		
				`);
			}
			if (data.player.carnivore == true) {
				writeHTML(`
					foxm happy This is the technology wing.
					player I didn't expect a technology wing in a museum. Some of this stuff looks almost cutting edge.
					foxm It's also a historical section. The whole wing is dedicated to artificial intelligence, more specifically how it's used to create art.<br>That's how we were made! And our whole world! We live in a simulation, but for real!
					player worried The fourth wall is in shambles...
					foxm sleep It's fiiiine~<br>We broke it already when we referenced the carnivore and vegetarian modes~<br>Anyways, the section's split into multiple parts. What the technology is, how it was used to make the world...
					player happy And it looks like there's a lot of sections on ethical use...
					foxm happy If that's even possible.<br>But really, lots of people just want to enjoy a relaxing life full of sex. So we won't force any of it on you.
					foxm sleep And these sections are audio narrated by the town's founder. So take a listen whenever you want.		
				`);
			}
			addFlag("foxf", "technology");
			writeHTML(`
				button The Terrarium Wing; writeFox('intro-terrarium') !flag foxf terrarium;
				button The Technology Wing; writeFox('intro-technology') !flag foxf technology;
				button The Fashion Wing; writeFox('intro-fashion') !flag foxf fashion;
				button The Sponsor Wing; writeFox('intro-sponsor') !flag foxf sponsor;
				button Finish the tour; writeFox('intro3') ?flag foxf terrarium; ?flag foxf technology; ?flag foxf fashion; ?flag foxf sponsor;
			`);
		break;
		case "intro-fashion": 
			writeHTML(`
				im locations/museumFashion
				bg locations/museumFashion
			`);
			if (data.player.vegetarian != true && data.player.carnivore != true) {
				writeHTML(`
					foxf sparkle This is the fashion wing~!
					foxm sparkle Clothes and clothing styles galore~!
					foxf happy Here you can change the outfits of all the townsfolk. 
					foxm happy You'll have to have met them at least once though.
					foxf sparkle But since you've met us, already you can ask us to get naked anytime!
					foxm worried Hey, we promised not to get too excited, we don't want to scare *him away...
				`);
			}
			if (data.player.vegetarian == true) {
				writeHTML(`
					foxf sparkle This is the fashion wing~!
					player sparkle So many clothes! And... A bunch of naked mannequins?
					foxf happy Those are outfits too, hehe~<br>Here you can change the outfits of all the townsfolk.<br>But you'll have to have met them at least once though.
					foxf sparkle Buuuut since you've met me, already you can ask me to get naked anytime!
					player sparkle ...!
					foxf excited Ehehe~<3
				`);
			}
			if (data.player.carnivore == true) {
				writeHTML(`
					foxm happy This is the fashion wing.
					player sparkle So many clothes! And... A bunch of naked mannequins?
					foxm happy Those are outfits too.<br>Here you can change the outfits of all the townsfolk.<br>But you'll have to have met them at least once though.
					foxm sparkle Buuuut since you've met me, already you can ask me to get naked anytime!
					player sparkle ...!
					foxm worried Erm... I mean, let's not get too excited, not too quickly at least.
				`);
			}
			addFlag("foxf", "fashion");
			writeHTML(`
				button The Terrarium Wing; writeFox('intro-terrarium') !flag foxf terrarium;
				button The Technology Wing; writeFox('intro-technology') !flag foxf technology;
				button The Fashion Wing; writeFox('intro-fashion') !flag foxf fashion;
				button The Sponsor Wing; writeFox('intro-sponsor') !flag foxf sponsor;
				button Finish the tour; writeFox('intro3') ?flag foxf terrarium; ?flag foxf technology; ?flag foxf fashion; ?flag foxf sponsor;
			`);
		break;
		case "intro-sponsor": 
			writeHTML(`
				im locations/museumSponsor
				bg locations/museumSponsor
			`);
			if (data.player.vegetarian != true && data.player.carnivore != true) {
				writeHTML(`
					foxd sparkle The sponsor wing~!
					player Wow, what a fancy place.
					foxm This is a collection of monuments dedicated to the people who've donated or otherwise supported the town.
					foxf sparkle A dedication to all the current sponsors keeping this place alive~
					foxm worried A memorial to the patrons, lost to time...
					foxf happy A collection of special thanks and bugcatchers who've helped with the town's foundation.
					foxm happy And portraits of town supporters.
					foxd If you become one, you can get a dedication here too!
				`);
			}
			if (data.player.vegetarian == true) {
				writeHTML(`
					foxf sparkle The sponsor wing~!
					player Wow, what a fancy place.
					foxf This is a collection of monuments dedicated to the people who've donated or otherwise supported the town.
					foxf sparkle A dedication to all the current sponsors keeping this place alive~
					foxf worried A memorial to the patrons, lost to time...
					foxf happy A collection of special thanks and bugcatchers who've helped with the town's foundation.<br>And portraits of those town supporters too!
					foxf sparkle If you become one, you can get a dedication here too!
				`);
			}
			if (data.player.carnivore == true) {
				writeHTML(`
					foxm sparkle The sponsor wing~!
					player Wow, what a fancy place.
					foxm This is a collection of monuments dedicated to the people who've donated or otherwise supported the town.
					foxm sparkle A dedication to all the current sponsors keeping this place alive~
					foxm worried A memorial to the patrons, lost to time...
					foxm happy A collection of special thanks and bugcatchers who've helped with the town's foundation.<br>And portraits of those town supporters too!
					foxm sparkle If you become one, you can get a dedication here too!
				`);
			}
			addFlag("foxf", "sponsor");
			writeHTML(`
				button The Terrarium Wing; writeFox('intro-terrarium') !flag foxf terrarium;
				button The Technology Wing; writeFox('intro-technology') !flag foxf technology;
				button The Fashion Wing; writeFox('intro-fashion') !flag foxf fashion;
				button The Sponsor Wing; writeFox('intro-sponsor') !flag foxf sponsor;
				button Finish the tour; writeFox('intro3') ?flag foxf terrarium; ?flag foxf technology; ?flag foxf fashion; ?flag foxf sponsor;
			`);
		break;
		case "intro3": 
			writeHTML(`
				im locations/interiorFox
				bg locations/interiorFox
			`);
			if (data.player.vegetarian != true && data.player.carnivore != true) {
				writeHTML(`
					foxf sparkle Woohoo, sex time!
					foxm happy Okay, okay, who's getting it? Rock... Paper...
					foxf happy Scissors, I win! Haha!
					player Wait, don't I get a say in this?
					foxm worried Uh... You could. I guess that could be your reward.
					foxf worried We were gonna give you some novelty coins.
					foxm sparkle Speaking of, here you go!
					eval addItem('foxfPog');
					eval addItem('foxmPog');
					foxf sparkle You can flip them!
					player worried Wait, if the reward for finishing the tour is coins, what's the sex for?
					foxf sparkle Part of the tour!
					foxm shock Wait, why would you think doing something nice for us would be your reward?
					foxf It's fine, it's fine! We knew humans would be a little weird. *He can choose <i>and</i> get the jiggies!
					button Choose foxfF; writeFox('intro4F')
					button Choose foxmF; writeFox('intro4M')
				`);
			}
			if (data.player.vegetarian == true) {
				writeHTML(`
					foxf sparkle Woohoo, sex time! And I don't even have to share! Okay, here's your free novelty coin for finishing the tour.
					eval addItem('foxfPog');
					foxf happy Oh, be sure not to fuck me totally stupid, okay?
					player shock Eh? Wait, isn't this-<br>If this is the reward, what's the sex for?
					foxf sparkle Part of the tour, silly! Plowing me hard enough for your balls to slap my fur is <i>my</i> reward! 
					foxf happy So, lemme just sit down here real quick. By the way, blowjob, fellatio, deepthroat, irrumatio, sloppy toppy, throatfucking, colon equals three-ing, tonsil tickling, giving you <i>"The Hoover"</i>, those are all the same ballpark, right?
					player worried I don't think that last one was real.
					foxf shock What?! No! That was my favorite one!
					trans reward1F; Reward time!
				`);
			}
			if (data.player.carnivore == true) {
				writeHTML(`
					foxm Ookay, tour's almost done. Oh, here's the reward for finishing in case I forget because of... Well... The sex...
					eval addItem('foxmPog');
					player shock Eh? Wait, isn't this-<br>If this is the reward, what's the sex for?
					foxm worried Part of the tour... Why would you think doing something nice for us would be your reward? 
					foxm happy The coins are fun by the way, you can flip them around.
					player ...
					foxf angry ... Pssst!
					foxm shock Oh, right! I'm supposed to ask. So, blowjob, fellatio, deepthroat, irrumatio, sloppy toppy, throatfucking, colon equals three-ing, tonsil tickling, giving you <i>"The Hoover"</i>, those are all the same ballpark, right?
					player worried I don't think that last one was real.
					foxf shock What?! No!
					player worried ... Is she gonna be doing commentary?
					foxm happy No, that probably just surprised her. "The Hoover" was her favorite term. Speaking of, let me get a cushion for my knees...<br>Since the heat hasn't had time to circulate, anal would probably just hurt a bunch, so...
					trans reward1M; Reward time!
				`);
			}
			writeHTML(`
				
			`);
		break;
		case "intro4F": 
			if (data.player.vegetarian != true && data.player.carnivore != true) {
				writeHTML(`
					foxf sparkle Woop woop!
					foxm worried Aww... Okay, I'll get the notebook.
					foxf happy Right! Okay, so, it's okay if we take notes, right? We need to preserve this for posterity. foxmF gets real quiet when focusing, it's like he's not even there!
					player worried ... Will I be graded on my performance?
					foxf worried ... Only by future historians?
					player happy Oh, thank goodness.
					foxf sparkle Alright! So, let's get started! I haven't gone fully into heat yet, so only oral and hands for now.<br>I've done lots of independent research, but all homework and no fieldwork means I maaaay have a few misconceptions.
					foxf happy So, lemme just sit down here real quick. By the way, blowjob, fellatio, deepthroat, irrumatio, sloppy toppy, throatfucking, colon equals three-ing, tonsil tickling, giving you <i>"The Hoover"</i>, those are all the same ballpark, right?
					player worried I don't think that last one was real.
					foxf shock What?! No! That was my favorite one!<br>Aw man, this blows. I, uh... Um...		
					trans reward1F; Reward time!
				`);
			}
		break;
		case "intro4M": 
			if (data.player.vegetarian != true && data.player.carnivore != true) {
				writeHTML(`
					foxm sparkle Wow, really?
					foxf frown Tch. 
					foxm sleep Jelly baby jelly baby the human wants to have sex with me and so my sister's a jelly baby~
					foxf happy Ah whatever, it gives me more time to go into heat proper. The real joke's on you, I get to take notes!
					foxm happy Oh, right, it's okay if we take notes, right? We need to preserve this for posterity. 
					player worried ... Will I be graded on my performance?
					foxf I promise to stay very quiet and not judge. It's like I won't even be here!
					foxm We'll archive them for later, it'll be a long time before anyone else sees it.
					player Oh, good. I'll be a skeleton by then, and everybody knows skeletons can't feel shame.
					foxm worried O... Kay? A-anyways, let's get started. So, if it's alright with you, could we not do anything too rough? At least for now. The pheromones need time to circulate before I can go into heat proper. If I try to do anal before then, well...
					player happy It's fine!
					foxm Great! Let me just take a seat. This'll be better too, since directly exposing myself to the source of the pheromones should... Should...
					trans reward1M; Reward time!
				`);
			}
		break;
	}
}

function generateMuseum(n) {
    var buttonGrid = document.getElementById('buttonGrid');
    if (buttonGrid) {
        buttonGrid.remove();
    }
	document.getElementsByClassName('output')[0].innerHTML += `
		<div id="buttonGrid" style="position:relative;height:var(--foxf-btngrid-h, 130px);">
		</div>
	`;
	switch (n) {
		case "terrarium": {
			document.getElementById('buttonGrid').innerHTML += `
				<div class="pictureButton" onclick="listGarbage('fruit')"style="top: 0%; left: 0%; max-width: 25%;">Fruit</div>
				<div class="pictureButton" onclick="listGarbage('treasure')"style="top: 0%; left: 25%; max-width: 25%;">Treasure</div>
				<div class="pictureButton" onclick="listGarbage('critter')"style="top: 0%; left: 50%; max-width: 25%;">Critters</div>
			`;
			listGarbage("fruit");
			break;
		}
		case "technology": {
			document.getElementById('buttonGrid').innerHTML += `
				<div class="pictureButton" onclick="listTopics('overview')"style="top: 0%; left: 0%; max-width: 25%;">Guides</div>
				<div class="pictureButton" onclick="listTopics('modding')"style="top: 0%; left: 25%; max-width: 25%;">Modding</div>
				
			`; 
			//<div class="pictureButton" onclick="listTopics('models')"style="top: 0%; left: 25%; max-width: 25%;">Extras</div>
			// // <div class="pictureButton" onclick="listTopics('artists')"style="top: 0%; left: 50%; max-width: 75%;">Artists List</div>
			listTopics("overview");
			break;
		}
		case "fashion": {
			for (i = 0; i < data.story.length; i++) {
				var printCharacter = true;
				if (data.story[i].gender == "female" && data.player.carnivore == true) {
					printCharacter = false;
				}
				if (data.story[i].gender == "male" && data.player.vegetarian == true) {
					printCharacter = false;
				}
				if (printCharacter == true) {
					if (checkFlag("player", "costumes") == true || data.story[i].trust > 0) {
						var gridSize = "var(--title-grid-min, 175px)";
						document.getElementById('buttonGrid').style.display = "grid";
						document.getElementById('buttonGrid').style.height = "initial";
						document.getElementById('buttonGrid').style.gridTemplateColumns = "repeat(auto-fill, minmax("+gridSize+", 1fr))";
						var charType = "old"
						for (neoCharIndex = 0; neoCharIndex < finishedCharactersArray.length; neoCharIndex++) {
							if (finishedCharactersArray[neoCharIndex] == data.story[i].index) {
								//console.info("neoCharIndex: "+neoCharIndex);
								charType = "new";
							}
						}
						if (charType == "new") {
							document.getElementById('buttonGrid').innerHTML += `
								<div id = "outfitThumb`+data.story[i].index+`" class="thumbnailBorder syrup" style="position:relative;border:5px solid #FCEBB5;border-radius:15px;overflow:hidden;cursor:pointer;"onclick="listOutfits('`+data.story[i].index+`')">
									`+drawCharacter(data.story[i].index, "class: thumbnailImage syrup;")+`
								</div>
							`;
						}
						else {
							document.getElementById('buttonGrid').innerHTML += `
								<div id = "outfitThumb`+data.story[i].index+`" class="thumbnailBorder syrup" style="position:relative;border:5px solid #FCEBB5;border-radius:15px;overflow:hidden;cursor:pointer;">
									<img class="thumbnailImage syrup" onclick="listOutfits('`+data.story[i].index+`')"style="" src="`+cleanupImage(data.story[i].index+"/"+data.story[i].outfit+"/"+data.story[i].emotion)+`">
								</div>
							`;
						}
					}
				}
			}
			break;
		}
		case "sponsor": {
			document.getElementById('buttonGrid').innerHTML += `
				<div class="pictureButton" onclick="listPeeps('subscribers')"style="top: 0%; left: 0%; max-width: 25%;">Subscribers</div>
				<div class="pictureButton" onclick="listPeeps('patrons')"style="top: 0%; left: 25%; max-width: 25%;">Patrons</div>
				<div class="pictureButton" onclick="listPeeps('special')"style="top: 0%; left: 50%; max-width: 25%;">Special Thanks</div>
				<div class="pictureButton" onclick="listPeeps('other')"style="top: 0%; left: 75%; max-width: 25%;">Other Helpers</div>
			`;
			break;
		}
	}
}

var terrariumArray = [
	{index: "fruit-gummi-bag", value: 5, category: "fruit", desc: "A bag of yummy chewable candies. A favorite among humans, right?<br>Commonly sold here in town."},
	{index: "fruit-gummi-box", value: 20, category: "fruit", desc: "A box of chewy candies with a suspicious shape. They aren't sold anywhere in town anymore, but someone dealing in ancient goods might sell these."},
	{index: "fruit-cheeries", desc: "A pair of cheeries, the most commonly found fruit in town. They grow everywhere, and make a great snack!"},
	{index: "fruit-dewdrop", desc: "A plump, squishy fruit that can be squished like a water balloon. They have to be carefully grown in the orchard."},
	{index: "fruit-assple-seed", value: 1, category: "fruit", desc: "A tough, smooth fruit capable of growing larger. Only appears after obtaining the Monster Fucker Permit.<br>Found underground or in the forest orchard.", requirements: "?weird;", tags: "weird",},
	{index: "fruit-assple-fruit", value: 10, category: "fruit", desc: "A carefully washed, smooth fruit grown in the fertile fields of Uranus. Only appears after obtaining the Monster Fucker Permit.", requirements: "?weird;", tags: "weird",},
	{index: "bug-crimket", desc: "A small little guy, the most commonly found bug in town."},
	{index: "bug-flumph", desc: "A floofy little fellow only found in the wilderness at the edge of town."},
	{index: "bug-lurm", desc: "A thick-lipped blue worm of the Wormb family only found in the wilderness at the edge of town.", tags: "weird",},
	{index: "fish-yuppie", desc: "An extremely common fish that can be found anywhere in town. Yuppie!"},
	{index: "fish-foambeard", desc: "A rarer fish that can be found in the town lake. His 'beard' is actually his tongue, covered in a foamy slime."},
	{index: "fish-fooba", desc: "A rarer fish that can be found in the town lake. Unlike most fish, these are actually very warm, and have soft flesh instead of scales.", tags: "weird",},
];
//Add any missing treasures from the junk array
for (junkIndex = 0; junkIndex < diggingJunkArray.length; junkIndex++) {
	if (diggingJunkArray[junkIndex].desc != null) {
		var addItemToArray = true;
		if (diggingJunkArray[junkIndex].index.includes("-male") && data.player.vegetarian == true) {
			addItemToArray = false;
		}
		if (diggingJunkArray[junkIndex].index.includes("-female") && data.player.carnivore == true) {
			addItemToArray = false;
		}
		var itemToAdd = {
			index: diggingJunkArray[junkIndex].index.replace("ruins-","").replace("wilderness-",""), 
			desc: diggingJunkArray[junkIndex].desc,
		};
		if (diggingJunkArray[junkIndex].index.includes("ruins-")) {
			itemToAdd.desc += "<br>Found via digging in the ruins.";
		}
		if (diggingJunkArray[junkIndex].index.includes("wilderness-")) {
			itemToAdd.desc += "<br>Found via digging in the wilderness.";
		}
		if (diggingJunkArray[junkIndex].tags) {
			itemToAdd.tags = diggingJunkArray[junkIndex].tags;
		}
		else {
			itemToAdd.tags = "";
		}
		if (addItemToArray == true) {
			terrariumArray.push(itemToAdd);
		}
	}
}

function listGarbage(n) {
    var outfitGrid = document.getElementById('outfitSpace');
    if (outfitGrid) {
        outfitGrid.remove();
    }
	document.getElementsByClassName('output')[0].innerHTML += `
		<div id="outfitSpace">
		<p class="centeredText" id="itemCount">0 of 0 obtained</p>
		<div id="outfitGrid" style="display:grid;grid-template-columns:repeat(var(--outfit-cols, 3), 1fr)">
		</div>
		</div>
	`;
	for (i = 0; i < globalItemsArray.length; i++) {
		if (globalItemsArray[i].category == n) {
			if (!globalItemsArray[i].requirements) {
				globalItemsArray[i].requirements = "";
			}
			if (!globalItemsArray[i].tags) {
				globalItemsArray[i].tags = "";
			}
			if (checkRequirements(globalItemsArray[i].requirements) == true) {
				const itemDetails = terrariumArray.find(item => item.index === globalItemsArray[i].index);
				if (itemDetails) {
					var finalBrightness = "20%";
					var borderColor = "#999";
					if (checkFlag("player", globalItemsArray[i].index)) {
						finalBrightness = "100%";
						borderColor = "#FFF";
						if (itemDetails.tags) {
							if (itemDetails.tags.includes("weird") && checkRequirements("?weird;") == true) {
								borderColor = "#dfafffff";
							}
						}
					}
					document.getElementById('outfitGrid').innerHTML += `
						<div class="dialogueContainer syrup" style="border-color: #FFF;">
							<div class="thumbnailContainer syrup">
								<div class="thumbnailBorder syrup">
									<img class="thumbnailImage syrup" style="filter:brightness(`+finalBrightness+`);border-radius:50%;aspect-ratio:1;border:5px solid `+borderColor+`;" src = "`+cleanupImage(globalItemsArray[i].image)+`">
								</div>
							</div>
							<div class="textContainer syrup">
								<div class="textBorder syrup">
									<div class="textContent syrup">
										<p class="textName syrup" style="color: `+borderColor+`;">`+globalItemsArray[i].name+`</p>
										<hr class="textDivider syrup" style="border-color: `+borderColor+`;">
										<p style="color:#FFF;">`+itemDetails.desc+`</p>
									</div>
								</div>
							</div>
						</div>
					`;
				}
			}
		}
	}
	if (countGarbage(n)[0] == countGarbage(n)[1]) {
		document.getElementById('itemCount').innerHTML = "<span style='color:#1ce01c;'>All items obtained!</span>";
	}
	else {
		document.getElementById('itemCount').innerHTML = countGarbage(n)[1]+" of "+countGarbage(n)[0]+" obtained";
	}
}

function countGarbage(n) {
	var countTotal = 0;
	var countObtained = 0;
	for (i = 0; i < globalItemsArray.length; i++) {
		if (globalItemsArray[i].category == n) {
			if (!globalItemsArray[i].requirements) {
				globalItemsArray[i].requirements = "";
			}
			if (checkRequirements(globalItemsArray[i].requirements) == true) {
				countTotal += 1;
				const itemDetails = terrariumArray.find(item => item.index === globalItemsArray[i].index);
				if (itemDetails) {
					if (checkFlag("player", globalItemsArray[i].index)) {
						countObtained += 1;
					}
				}
			}
		}
	}
	return [countTotal, countObtained];
}

function listTopics(n) {
    var outfitGrid = document.getElementById('outfitSpace');
    if (outfitGrid) {
        outfitGrid.remove();
    }
	document.getElementsByClassName('output')[0].innerHTML += `
		<div id="outfitSpace">
		<div id="outfitGrid" style="display:grid;grid-template-columns:repeat(var(--outfit-cols, 3), 1fr)">
		</div>
		</div>
	`;
	if (n != "artists") {
		switch (n) {
			case "overview": {
				var topicArray = [
					{index: "overview1", name: "Stable Diffusion Guide - Google Doc", desc: "A guide on how to get Stable Diffusion running on a google document."},
					{index: "overview2", name: "Stable Diffusion Guide - F95zone", desc: "A guide on how to get Stable Diffusion running hosted on F95zone, in case the google link is taken down."},
					{index: "txt2img", name: "Prompt Generator Test", desc: "Testing out my prompt generator."},
					//{index: "overview1", name: "AI Explained", desc: "A basic summary of how Image Generation AI works."},
					//{index: "overview2", name: "Basics", desc: "The basics of how to get Stable Diffusion running."},
					//{index: "overview3", name: "Easyfluff", desc: "Noodle Jacuzzi's SD1.5 furry workflow used for Syrup Town."},
					//{index: "overview4", name: "SDXL", desc: "Noodle Jacuzzi's newer workflow used for anime booba."},
					//{index: "overview5", name: "Prompt Builder", desc: "A quick touch on a prompt builder being made by Noodle Jacuzzi."},
				];
				break;
			}
			case "models": {
				var topicArray = [
					{index: "models1", name: "Fluffyrock", desc: "A furry gallery of what Syrup Town characters first looked like."},
					{index: "models2", name: "Easyfluff Non-Furry", desc: "A non-furry gallery of some early Argent Science content made in Easyfluff."},
					{index: "models3", name: "SDXL Rainy DayZ", desc: "A non-furry collection of Rainy DayZ images made in SDXL."},
					{index: "models4", name: "SDXL Ahemaru RPG", desc: "A non-furry collection of RPG concept images made in SDXL."},
					//{index: "models5", name: "SDXL Argent Test 1", desc: "Part of a series of non-furry tests trying to find a style for Argent Science.<br>Test target: Fiinel"},
				];
				break;
			}
			case "modding": {
				var topicArray = [
					{index: "modding0", name: "Mod Creation Basics", desc: "Want to make content for Syrup Town yourself? We'll show you how!"},
					{index: "moddingGuide", name: "Modding Walkthrough", desc: "Not sure what to actually do after you've started? Here's a basic walkthrough!"},
					{index: "moddingSprites", name: "Emotions & Dialogue", desc: "Making dialogue sprites is hard, but it's doable!"},



					//{index: "modding1", name: "Create a new mod", desc: "Enable debug mode and create your very own mod of Syrup Town, all entirely in-game."},
					//{index: "modding2", name: "Load an existing mod", desc: "Enable debug mode and load an existing mod, perfect for continuing where you left off."},
					//{index: "modding3", name: "New Character", desc: "Once you've started creating your own mod, create your own character here."},
					//{index: "modding4", name: "Existing Character", desc: "Once you've started creating your own mod, use this to target an existing character to add more or replace content for them."},
					//{index: "modding5", name: "Export and save your mod", desc: "Use this to make a .zip file of your mod. Note that this is the only way to save your mod, so save often!"},
				];
				break;
			}
			case "ethics": {
				var topicArray = [
					{index: "ethics1", name: "Replacement", desc: "Tackling the insane argument that AI will somehow 'replace' real art."},
					{index: "ethics2", name: "PNG Info & Recreation", desc: "How to recreate the images used in this game."},
				];
				break;
			}
		}
		for (i = 0; i < topicArray.length; i++) {
			var finalName = topicArray[i].name;
			var finalImage = cleanupImage("misc/Museum/"+topicArray[i].index);
			var onClick = "writeScene('system', '"+topicArray[i].index+"')";
			if (topicArray[i].index == "overview1") {
				onClick = "window.open('https://docs.google.com/document/d/1XLhL6MkGwFSd45iQUaZBQAC-w7ITHRTDxZfKa3_hYfw/edit?usp=sharing')";
			}
			if (topicArray[i].index == "overview2") {
				onClick = "window.open('https://f95zone.to/threads/syrup-town-v1-5-noodlejacuzzi.212709/post-14039934')";
			}
			if (n == "modding") {
				onClick = "moddingShortcut('"+topicArray[i].index+"')";
			}

			document.getElementById('outfitGrid').innerHTML += `
				<div class="dialogueContainer syrup" style="border-color: #FFFFFF;">
					<div class="thumbnailContainer syrup">
						<div class="thumbnailBorder syrup">
							<img class="thumbnailImage syrup" style="border-radius:50%;aspect-ratio:1;border:5px solid white;" src = "`+finalImage+`">
						</div>
					</div>
					<div class="textContainer syrup">
						<div class="textBorder syrup">
							<div class="textContent syrup">
									<p class="textName syrup" style="color: #FFFFFF;">`+finalName+`</p>
									<hr class="textDivider syrup" style="border-color: #FFFFFF;">
									<p><span class="textContentSyrup switch" onclick="`+onClick+`">`+topicArray[i].desc+`</span></p>
							</div>
						</div>
					</div>
				</div>
			`;
		}
		if (n == "modding") {
			generateModdingOverview();
		}
	}
	else {

	}
}

function listPeeps(n) {
    var outfitGrid = document.getElementById('outfitSpace');
    if (outfitGrid) {
        outfitGrid.remove();
    }
    var outfitGrid2 = document.getElementById('outfitSpace2');
    if (outfitGrid2) {
        outfitGrid2.remove();
    }
	document.getElementsByClassName('output')[0].innerHTML += `
		<div id="outfitSpace">
		<div id="outfitGrid" style="display:grid;grid-template-columns:repeat(var(--outfit-cols, 3), 1fr)">
		</div>
		</div>
	`;
	switch (n) {
		case "subscribers": {
			//Break the supporters variable into chunks by newline
			var nameList = supportersArray;
			for (i = 0; i < nameList.length; i++) {
				var finalName = nameList[i][0];
				var sponsorName = finalName;
				while (sponsorName.includes(" ")) {
					sponsorName = sponsorName.replace(" ", "-");
				}
				document.getElementById('outfitGrid').innerHTML += `
					<div class="dialogueContainer syrup" style="border-color: #FFFFFF;">
						<div class="thumbnailContainer syrup">
							<div class="thumbnailBorder syrup">
								<img class="thumbnailImage syrup" style="border-radius:50%;aspect-ratio:1;border:5px solid white;" onerror="javascript:this.src='`+cleanupImage("supporters/none")+`';" src = "`+cleanupImage("supporters/"+sponsorName)+`">
							</div>
						</div>
						<div class="textContainer syrup">
							<div class="textBorder syrup">
								<div class="textContent syrup">
									<div style="width: max-content;">
										<p class="textName syrup" style="color: #FFFFFF;">`+finalName+`</p>
										<hr class="textDivider syrup" style="border-color: #FFFFFF;">
									</div>
									<svg style="height: 150px;	position: absolute;	width: 225px;	right: 15px;	top: 15px;	z-index: -1;" xmlns="http://www.w3.org/2000/svg" version="1.0" width="340.000000pt" height="224.000000pt" viewBox="0 0 340.000000 224.000000" preserveAspectRatio="xMidYMid meet">
										<g transform="translate(0.000000,224.000000) scale(0.100000,-0.100000)" fill="#F5152E" opacity="0.3" stroke="none">
											<path d="M2590 2180 c-91 -12 -142 -52 -171 -132 -26 -74 19 -181 170 -406 132 -196 142 -207 167 -194 18 9 37 17 97 41 211 84 365 169 424 233 28 30 53 89 53 125 -1 76 -101 185 -182 198 -50 9 -131 -3 -186 -26 -61 -27 -76 -24 -108 19 -51 67 -78 94 -119 117 -48 27 -85 34 -145 25z"></path>
											<path d="M287 2126 c-15 -7 -43 -26 -61 -44 -81 -76 -106 -209 -86 -455 7 -87 16 -160 20 -162 4 -2 20 0 36 5 16 6 78 26 138 46 99 32 138 47 231 90 67 31 132 107 153 178 15 51 -1 126 -33 156 -24 22 -36 23 -180 8 -29 -3 -30 -1 -37 47 -11 83 -19 104 -48 125 -32 23 -90 25 -133 6z"></path>
											<path d="M1871 942 c-67 -11 -115 -81 -145 -214 -7 -29 -23 -35 -54 -19 -68 34 -186 42 -228 15 -45 -30 -76 -98 -77 -168 -1 -107 37 -170 148 -245 69 -47 193 -111 215 -111 5 0 18 -4 28 -9 23 -12 60 -26 102 -41 19 -7 44 -16 55 -21 58 -24 111 -37 120 -28 10 10 30 81 75 274 37 161 48 295 30 370 -30 126 -153 216 -269 197z"></path>
										</g>
									</svg>
									<svg class="dialogueBackground syrup">
									</svg>
								</div>
							</div>
						</div>
					</div>
				`;
			}
			document.getElementById('outfitSpace').innerHTML += `
				<p class="rawText" id="outfitText">If you're on this list but have no avatar, please feel free to send one or a request for one to me at noodlejacuzzi@gmail.com, or to noodlejacuzzi on discord. If you'd like your name on this list to be changed, please let me know as well. Thank you for your support!</p>
			`;
			break;
		}
		case "patrons": {
			var gridSize = "var(--outfit-cols, 3)";
			document.getElementById('outfitSpace').innerHTML = `
				<p class="rawText" id="outfitText">With the patreon deleted, this space shall serve as a memorial to the patrons who helped support me. Thank you!</p>
				<p class="rawText">My final list only included active patrons at the time of shutdown, and I can't access the list anymore. If you ever supported me on patreon and your name isn't on this list, or if I've misspelled it, please message me at noodlejacuzzi@gmail.com, or noodlejacuzzi on discord.</p>
				<div id="outfitGrid" style="display:grid;grid-template-columns:repeat(`+gridSize+`, 1fr)">
				</div>
			`;
			//Break the supporters variable into chunks by newline
			var nameList = patrons
			for (i = 0; i < nameList.length; i++) {
				document.getElementById('outfitGrid').innerHTML += `
					<p class="rawText" style="padding:0px; font-size:var(--fs-xlarge, 2em); width:100%; text-align:center;">`+nameList[i]+`</p>
				`
			}
			break;
		}
		case "special": {
			var nameList = specialList;
			for (i = 0; i < nameList.length; i++) {
				var finalName = nameList[i].name;
				for (j = 0; j < subscriberNicknames.length; j++) {
					if (nameList[i] == (subscriberNicknames[j].index)) {
						finalName = subscriberNicknames[j].nick;
					}
				}
				var sponsorName = finalName;
				while (sponsorName.includes(" ")) {
					sponsorName = sponsorName.replace(" ", "-");
				}
				document.getElementById('outfitGrid').innerHTML += `
					<div class="dialogueContainer syrup" style="border-color: #FFFFFF;">
						<div class="thumbnailContainer syrup">
							<div class="thumbnailBorder syrup">
								<img class="thumbnailImage syrup" style="border-radius:50%;aspect-ratio:1;border:5px solid white;" onerror="javascript:this.src='`+cleanupImage("supporters/none")+`';" src = "`+cleanupImage("supporters/"+sponsorName)+`">
							</div>
						</div>
						<div class="textContainer syrup">
							<div class="textBorder syrup">
								<div class="textContent syrup">
									<div style="width: 100%;">
										<p class="textName syrup" style="color: #FFFFFF;">`+finalName+`</p>
										<hr class="textDivider syrup" style="border-color: #FFFFFF;">
										<p>`+nameList[i].text+`</p>
									</div>
									<svg style="height: 150px;	position: absolute;	width: 225px;	right: 15px;	top: 15px;	z-index: -1;" xmlns="http://www.w3.org/2000/svg" version="1.0" width="340.000000pt" height="224.000000pt" viewBox="0 0 340.000000 224.000000" preserveAspectRatio="xMidYMid meet">
										<g transform="translate(0.000000,224.000000) scale(0.100000,-0.100000)" fill="#F5152E" opacity="0.3" stroke="none">
											<path d="M2590 2180 c-91 -12 -142 -52 -171 -132 -26 -74 19 -181 170 -406 132 -196 142 -207 167 -194 18 9 37 17 97 41 211 84 365 169 424 233 28 30 53 89 53 125 -1 76 -101 185 -182 198 -50 9 -131 -3 -186 -26 -61 -27 -76 -24 -108 19 -51 67 -78 94 -119 117 -48 27 -85 34 -145 25z"></path>
											<path d="M287 2126 c-15 -7 -43 -26 -61 -44 -81 -76 -106 -209 -86 -455 7 -87 16 -160 20 -162 4 -2 20 0 36 5 16 6 78 26 138 46 99 32 138 47 231 90 67 31 132 107 153 178 15 51 -1 126 -33 156 -24 22 -36 23 -180 8 -29 -3 -30 -1 -37 47 -11 83 -19 104 -48 125 -32 23 -90 25 -133 6z"></path>
											<path d="M1871 942 c-67 -11 -115 -81 -145 -214 -7 -29 -23 -35 -54 -19 -68 34 -186 42 -228 15 -45 -30 -76 -98 -77 -168 -1 -107 37 -170 148 -245 69 -47 193 -111 215 -111 5 0 18 -4 28 -9 23 -12 60 -26 102 -41 19 -7 44 -16 55 -21 58 -24 111 -37 120 -28 10 10 30 81 75 274 37 161 48 295 30 370 -30 126 -153 216 -269 197z"></path>
										</g>
									</svg>
									<svg class="dialogueBackground syrup">
									</svg>
								</div>
							</div>
						</div>
					</div>
				`;
			}
			break;
		}
		case "other": {
			var gridSize = "var(--outfit-cols, 3)";
			document.getElementById('outfitSpace').innerHTML = `
				<p class="rawText" id="outfitText">Thank you to everyone who's helped out by finding and reporting a bug or error for this game:</p>
				<div id="outfitGrid" style="display:grid;grid-template-columns:repeat(`+gridSize+`, 1fr)">
				</div>
				<p class="rawText" id="outfitText">And to everyone who's reviewed this game on websites like F95zone, even a negative review is still valuable feedback:</p>
				<div id="outfitGrid2" style="display:grid;grid-template-columns:repeat(`+gridSize+`, 1fr)">
				</div>
			`;
			var nameList = bugFinders.split("\n");
			//Delete any empty entries
			for (i = 0; i < nameList.length; i++) {
				if (nameList[i] == "") {
					nameList.splice(i, 1);
					i -= 1;
				}
			}
			for (i = 0; i < nameList.length; i++) {
				document.getElementById('outfitGrid').innerHTML += `
					<p class="rawText" style="padding:0px; font-size:var(--fs-xlarge, 2em); width:100%; text-align:center;">`+nameList[i]+`</p>
				`
			}
			var nameList = reviewers.split("\n");
			//Delete any empty entries
			for (i = 0; i < nameList.length; i++) {
				if (nameList[i] == "") {
					nameList.splice(i, 1);
					i -= 1;
				}
			}
			for (i = 0; i < nameList.length; i++) {
				document.getElementById('outfitGrid2').innerHTML += `
					<p class="rawText" style="padding:0px; font-size:var(--fs-xlarge, 2em);width:100%; text-align:center;">`+nameList[i]+`</p>
				`
			}
			break;
		}
	}
}

function listOutfits(n) {
	for (i = 0; i < data.story.length; i++) {
		if (data.story[i].index == n) {
			var characterTarget = data.story[i];
		}
	}
    var outfitGrid = document.getElementById('outfitGrid');
    if (outfitGrid) {
        outfitGrid.remove();
    }
    var obtainedCount = document.getElementById('obtainedCount');
    if (obtainedCount) {
        obtainedCount.remove();
    }
	document.getElementsByClassName('output')[0].innerHTML += `
		<div id="outfitGrid" style="display:grid;grid-template-columns:repeat(var(--outfit-cols-wide, 4), 1fr);">
		</div>
	`;
	var countTotal = 0;
	var countObtained = 0;
	for (i = 0; i < globalOutfitsArray.length; i++) {
		var cardBrightness = "var(--foxf-brightness, 60%)";
		var cursorStyle = "cursor: pointer;";
		var borderStyle = "3px solid grey";
		if (globalOutfitsArray[i].index == n) {
			var displayOutfit = true;
			countTotal++;
			countObtained++;
			var finalFunction = `changeOutfitMuseum('`+n+`', '`+globalOutfitsArray[i].outfit+`')`
			var mouseoverFunction = `outfitMouseover('`+n+`', '`+globalOutfitsArray[i].outfit+`')`;
			var mouseoutFunction = `outfitMouseout('`+n+`', '`+globalOutfitsArray[i].outfit+`')`;
			var outfitsToExclude = [];
			if (checkRequirements(globalOutfitsArray[i].requirements) == false && checkFlag("player", "costumes") == false) {
				countObtained--;
				cardBrightness = "5%";
				finalFunction = "";
				mouseoverFunction = "";
				mouseoutFunction = "";
				cursorStyle = "";
				borderStyle = "3px solid black";
				//Code for not showing locked cheat outfits
				if (outfitsToExclude.includes(globalOutfitsArray[i].outfit) || globalOutfitsArray[i].outfit.includes("Cheat")) {
					countTotal--;
					displayOutfit = false;
				}
			}
			//Code for not showing pregnant outfits on meat characters
			if (n == "mayor" && globalOutfitsArray[i].outfit == "pregnant" && checkFlag("mayor", "meat") == true) {
				countTotal--;
				displayOutfit = false;
			}
			if (n == "carpenter" && globalOutfitsArray[i].outfit == "pregnant" && checkFlag("carpenter", "meat") == true) {
				countTotal--;
				displayOutfit = false;
			}
			if (n == "shopkeep" && globalOutfitsArray[i].outfit == "pregnant" && checkFlag("shopkeep", "meat") == true) {
				countTotal--;
				displayOutfit = false;
			}
			//Code for not showing seasonal outfits before they are available
			seasonsArray = ["crimbus", "costume", "valentine", "summer"];
			for (j = 0; j < seasonsArray.length; j++) {
				if (globalOutfitsArray[i].outfit.includes(seasonsArray[j])) {
					if (checkFlag("player", "seasonal"+seasonsArray[j]) == false && checkFlag("player", "costumes") == false) {
						countObtained--;
						countTotal--;
						//displayOutfit = false;
					}
				}
			}

			if (characterTarget.outfitDefault == globalOutfitsArray[i].outfit) {
				cardBrightness = "100%";
				finalFunction = "";
				mouseoverFunction = "";
				mouseoutFunction = "";
				cursorStyle = "";
				borderStyle = "3px solid white";
			}
			var outfitMod = "";
			if (characterTarget.index == "carpenter" && checkFlag("carpenter", "meat")== true) {
				outfitMod = "-meat";
			}
			if (characterTarget.index == "shopkeep" && checkFlag("shopkeep", "meat")== true) {
				outfitMod = "-meat";
			}
			if (displayOutfit == true) {
				var charType = "old"
				for (neoCharIndex = 0; neoCharIndex < finishedCharactersArray.length; neoCharIndex++) {
					if (finishedCharactersArray[neoCharIndex] == n) {
						//console.info("neoCharIndex: "+neoCharIndex);
						charType = "new";
					}
				}
				if (charType == "new") {
					document.getElementById('outfitGrid').innerHTML += `
						<div class="museumImageFrame" id="outfit`+n+globalOutfitsArray[i].outfit+`"
						onclick="`+finalFunction+`",
						onmouseover="`+mouseoverFunction+`"
						onmouseout="`+mouseoutFunction+`"
						onerror="removeThisElement('outfit`+n+globalOutfitsArray[i].outfit+`')"
						style="border:`+borderStyle+`;filter:brightness(`+cardBrightness+`); width: 100%; height:inherit; `+cursorStyle+`">
							`+drawCharacter(n, "playerSelf;clothes:"+globalOutfitsArray[i].outfit+";")+`
						</div>
					`;
				}
				else {
					var finalImage = cleanupImage(n+"/"+globalOutfitsArray[i].outfit+outfitMod+"/"+characterTarget.emotion);
					document.getElementById('outfitGrid').innerHTML += `
						<img class="bigPicture" id="outfit`+n+globalOutfitsArray[i].outfit+`" src="`+finalImage+`"
						onclick="`+finalFunction+`",
						onmouseover="`+mouseoverFunction+`"
						onmouseout="`+mouseoutFunction+`"
						onerror="removeThisElement('outfit`+n+globalOutfitsArray[i].outfit+`')"
						style="border:`+borderStyle+`;filter:brightness(`+cardBrightness+`); width: 100%; max-height:none; `+cursorStyle+`">
					`;
				}
			}
		}
	}
	document.getElementById('output').innerHTML += `
		<p id='obtainedCount' class = "specialText">`+replaceCodenames(countObtained+` of `+countTotal+` outfits unlocked for `+n+`F`)+`</p>
	`;
}

function changeOutfitMuseum(n, m) {
	for (i = 0; i < data.story.length; i++) {
		if (data.story[i].index == n) {
			data.story[i].outfitDefault = m;
		}
	}
	fakeLocation("museumFashion");
	listOutfits(n);
}

function outfitMouseover(n, m) {
	//console.log(document.getElementById(wardrobeImage).style.filter)
	document.getElementById("outfit"+n+m).style.filter = "brightness(100%)"
}

function outfitMouseout(n, m) {
	var finalBrightness = "var(--foxf-brightness, 60%)";
	for (i = 0; i < data.story.length; i++) {
		if (data.story[i].index == n) {
			if (data.story[i].outfitDefault == m) {
				finalBrightness = "100%";
			}
		}
	}
	//console.log(document.getElementById(wardrobeImage).style.filter)
	document.getElementById("outfit"+n+m).style.filter = "brightness("+finalBrightness+")"
}

var eventArray = [
	{index: "reward1F", name: "First Reward", image: "foxf/reward1F-1",
	content: `
		im foxf/reward1F-1
		foxf shock Oh, God...
		im foxf/reward1F-2
		foxf sparkle You're huge! Massive! You're like some freak of nature! An absolute spit in the face of our creator! I bet babies cry just because you exist in the same timezone!
		player worried That last one actually-
		foxf excited Oh goodness I thought it'd be weeks before I felt any of the pheromone's effects but I almost regret picking oral today... Okay, here I go...!
		im foxf/reward1F-3
		t *Smooch*
		foxf excited ...
		foxf worried ... Did I do it wrong?
		player worried ...?
		foxf worried I kissed, now we love each other and you go crazy with lust and rape my throat till I'm a gooey squirting mess, right? shopF's documentary, "Debbie Finds Love with a 15-Inch Python" said so...
		player worried I don't think that's how it works.
		foxf Alright, uncharted territory then... I'll just...
		foxf excited Do what comes naturally~
		im foxf/reward1F-4
		foxf ahegao *GHLLLK*
		foxf excited <i>Holy shit my fucking jaaaaaw~!<br>It's like I'm raping my own throat open with this thing~!</i>
		im foxf/reward1F-5
		foxf ahegao *Klllllhhk*<br><i>I can barely get it past the head~! But I still want it...</i>
		foxf excited <i>Eh? It's pulsing?<br>Could *he be~? <3</i>
		player excited Ah... I'm still not used to... Gonna~
		foxf excited <i>*He is~! *He is *he is *heis*heis*heis~<3</i>
		im foxf/reward1F-6
		player ahegao Cumming~!
		foxf ahegao *GHHHHLF*
		foxf torogao <i>Cum~! Cumming~!<br>I can feel it filling my throat~!<br>Hoooohmygod I'm gonna squirt through to the floooor~!<br>Havta...!</i>
		im foxf/reward1F-7
		foxf ahegao Haaah~!
		t With a forceful pull, foxfF manages to tear herself off your still-spurting cock, covering her face and shirt with thick white goop.
		t But instead of shock or even disgust, she's looking at your dick like she's in love. You can even see her pupils dilating every time you throb and another dollop of barely-transparent cream layers onto her face.
		foxf excited Ehe...		
		im foxf/reward1F-8
		foxf ahegao Ehehe~! Ehehehe~! ~<3<br>Cum~! F-fire hose, so gewd~! All over, sticky~!
		player excited She's totally lost her mind...<br>This is what human cum does to her kind... It's almost scary...
		foxf Ehehe~!<br>*Sniff* *Sniff*
		foxf torogao Ouuugh~! Cumming~!
		player excited Alright, that's my reward... Where'd the other one go?
		foxm torogao Nghh~!
		player worried Oh... <br>Looks like they're both overwhelmed... My cum and sweat are probably both radiating pheromones...
		t With the foxes incapacitated, you decide it's best to make yourself scarce so they can recover.
		t You push out past the large museum doors, leaving the giggling, moaning foxes behind you to clean up and recuperate.
	`},
	{index: "reward2", name: "Day at Home", image: "foxf/reward2-2",
	content: `
		t You decide to hang out for a while with the feisty foxfF.
		t ...
		player sleep ... How on earth did I know we'd end up in this situation?
		foxf happy Weeeell~<br>Really, it's neither of our faults, is it?
		im reward2-2
		foxf I mean, take a girl like me, give her a taste of a <i>huge</i> cock like the one you've got, and put us in a room together...
		foxf excited No, just put us in the same town, really, and there's no helping it!<br>Frankly, I bet a weaker woman would have been in a much more embarrassing position, and a lot sooner too!
		player happy I don't really think there is a more embarrassing position you could be in.
		foxf Oh~? Really~?<br>Because ever since you made me throat that bitch-tamer of yours, I've had plenty of energy to think about what positions I'd like to be in~
		foxf ahegao I could be on all fours, one leg up, <i>begging</i> for a human cock up my-
		im reward2-3
		foxf ahegao Haaaah~!<br>That's it~! That's right, shut me up the way a human should~!<br>Fffuck, I was cumming hands-free from throating you, but now I'm squirting like a hose from just a few thrusts up my asspipe~!
		im reward2-4
		foxf Aaaah~! Hahah~!<br>This is it, this is what I've been missing~!<br>You're exactly what I've needed all my liiiife~!
		im reward2-5
		foxf torogao Ghhhhg~!<br>Nhhouuuuh~!<br>Pump me full of your hot, body-bloating cum~!<br>I got a dose before but now this bitch needs a direct shot to her tummyyyy~!
		player ahegao Hah... Hah... I'm in for a long day, aren't I...?
		foxf ahegao Pleaseee~! More, more, moremoremore~!<br>I promise I'll behave if you turn me into a mewling, cumdrunk bitch~<3
		player sleep ...<br>Y'know, you have such a cool look to you when you aren't totally fuck-drunk or as thirsty as a desert.
		player excited I guess it's my job to bring you back to that, huh?
		t ...
		player sleep Hooh... Gotta rehydrate.<br>Should I get you anything?
		foxf torogao Ghh... GhhhHhh...
		im reward2-6rosebud
		foxf Khhhh... Zhhhggg...
		player worried I'll take the, uh... Vocal shivering? As an "I'd like a glass of water, please".
		foxf Yhhhhggg... Ghhhh...
		player shock I may have... Actually fucked her brain broken.
		player happy ... Ah, she'll be back to normal soon enough.<br>Definitely.
		player worried ... Probably.
	`},
	{index: "mystery", name: "Vixen in a Box", image: "foxf/mystery-foxf1",
	content: `
		outfit foxf nude
		t Inside the mystery chest is...
		im foxf/mystery-foxf1
		foxf sparkle Boo! Did I scare you?
		t It's a fox!
		player sparkle foxfF! How'd you get in there, silly?
		player befuddled Actually, wait, how does any of this work? Did I just dig you out of the ground?<br>And how am I finding bigger things like these statues?
		foxf sleep No, the digging is you breaking through stone walls to find caves full of treasure.<br>And don't listen to anyone who tries to tell you different.<br>Seriously, imagine if you actually dug all this stuff out of mounds of dirt. That'd be crazy!
		player befuddled Eh? But wait-
		foxf mocking Nnnope~! You opened a trap chest, so get sprung!
		im foxf/mystery-foxf2
		foxf love Hohhh~!<br>Haaaaah~<3 My vision's goin' pink already~!<br>Every other one I've seen seems so pathetic next to yours~<br>I can barely believe it's mine, even if just for now~
		im foxf/mystery-foxf3
		foxf seductive Ehehe~<br>So I gotta take advantage of the opportunity~<3<br>How's it feel? Knowing <i>these</i> puppies are all yours~?<br>One wag of this fat cock, one flash of those heeeeaving balls of yours, I'll drop anything, anyone, and beg to service you~
		im foxf/mystery-foxf4
		player love Sooooft~
		foxf excited That's it, yes! I want other people's respect, but I want <i>you</i> to treat me like an object~!
		foxf horny Cum on me! Cover me in goo, give me the reward a good onahole gets!
		im foxf/mystery-foxf5
		player orgasm Hohh~!
		foxf love So much...!<br>So warm...<br>Amazing~
		foxf blushy Oooh~! Quick, close me back up! I wanna be completely smothered by the smell!
		player pent Oh... Kay... You'll be fine?
		foxf perverted Ehehe~<br>Yesyesyes, foxmF will be here to drag me home later, now close me up!
		player amused Alright alright, keep your pants...<br>... Nevermind.<br>Alright, I suppose I should get...
	`},
	{index: "fun-foxf", name: "Morning visitor", image: "foxf/fun-foxf2",
	content: `
		player sleep Zzz... Zzz...
		t *CRACK* *ZZZZZT* *VVVVVRM*
		player scared KYAAAAA-!<br>What... What on earth was that?!<br>It sounded like it came from-
		im fun-foxf1
		foxf panic Ah, ahaha, s-sorry about that.<br>You said we could come visit you whenever, and...<br>Any chance you could help a girl out? I kinda got stuck in your doggy-door.
		player panic I don't have a doggy door!
		foxf horny Hehe~
		player scared Don't you "Hehe~" me!...<br>You didn't...<br>How?! That was barely a couple of seconds of noise! 
		foxf blush W-well, because of my job here in town, I get a few perks.<br>Plus, I've actually been apprenticing under carpenterF in my free time...<br>But for real, I am stuck. I can fix all this in no time at all, promise...
		player pout ...
		foxf panic No, I'm like, really, actually stuck, for real!<br>And I can fix this, I might need to put a little stress on the tools, but I can, I promise!
		player pent ...
		t ...
		player pout Mrgrgr... Seriously!
		im fun-foxf2
		player angry This... Massive butt of yours!
		foxf perverted Mmm~!<br>I know you're like, actually mad with me, but that's kinda turning me on!
		player pent Hah... Look, I'm not mad, I'm just dis-
		foxf scared Okay, no no no, none of that, back to mad, please!
		player fury Mrgrgr... Fine!
		im fun-foxf3
		player angry Butt drum attack!<br>Take this, and this, and this!
		foxf orgasm Ohhh~! 
		player surprised Eh? Oh! You're getting all sweaty!<br>This is great, we can use that to help you get unstuck!
		player worried But it's a nice cool day, how can I make you sweat more than this?
		foxf excited I might have a few ideas~<3
		player pent ... Yeah, I thought you might.<br>Alright, alright. Which hole?
		foxf sparkle I can pick?! Pussy, pussy! I wanna get preggy, I want your babies!
		im fun-foxf4
		foxf love Ohhh...<br>
		im fun-foxf5
		foxf forced Heeee~! It just... Slid right in!
		player amused Well duh, you're basically a living sprinkler back here. You're in heat!<br>Now, just a quicky to get you unstuck!
		im fun-foxf6
		player pleasured Ooh! S-sorry if I'm too rough! I'll-
		foxf orgasm Ohhh~! No, harder! <br>Haaaaah~<3 I'm seeing stars already~<3
		player amused Geez. Fine!
		player pout Hey, wait a second, are you thrusting back?
		foxf torogao Ghhhhhhggg~<3
		t She vocalizes something, maybe a response, but more likely just her lungs pushing out air as primal need overwhelms her mind.
		player love Hoh... G-gonna...<br>I know this was just to get you loose, b-but...<br>Ghh...
		foxf shock ...?!
		t And then, as your cock pulses, the haze clears from her mind, and foxfF can think again.
		foxf sparkle Whoooa~! This is-<br>I've read about this!<br>Something about imminent impregnation clearing the-
		player orgasm Ohh~! Cumming~!
		im fun-foxf7
		foxf torogao GHHHHHHG~<3!!!
		t And just like that, her brain briefly unclouded to make room for the imminent new sensations, is hammered right back into blissful emptiness as her cunt spasms around your splurting cock.
		t Her legs kick and flail as her babymaker is finally allowed to get to work on its intended purpose, scratching and pawing both at your porch and the floor on the other side of the door.
		t Even as you pull out, she continues to flail, muttering some incoherent mess of word salad. You think you hear "mommy" a few times in there.
		player pent Okay... You're free now, right? Time to... Hup!
		t You catch and give a tug on foxfF's legs, finally making some progress on getting her un-stuck, only to stop halfway through the pull as you meet heavy resistance.
		player befuddled Did...<br>Aww dangit, did I just get her stuck again?<br>foxfF, can you-
		foxf afterglow Ehe~<br>Ehehe~
		player tired ... This is gonna be my whole night, isn't it?
		player surprise Oh, wait! These tools!<br>Let's see. Any instructions...<br>Nope, just some useless "handle with care" warnings.<br>Don't worry foxfF, I'll get you out of there in no time at all with these!
		t ...
		t Meanwhile...
		carpenter sleep Zzz... Zzz...<br>*Snrkt*-
		carpenter tired Hmm? <br>That's so weird... I just had the strangest feeling that-
		carpenter scared MY TOOLS!
		carpenter sleep ... I'll raise hell tomorrow. 
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
		eval unlockScene("foxm", "fun-finish-foxf-foxm");
	`},
	{index: "fun-foxd-foxm-foxf", name: "Awoo~", image: "foxf/foxd-fun1-1", tags: "male, female",
	content: `
		define foxd = dual sp1 foxm; sp2 foxf;
		foxd joy Awoo~!
		player confused "Awoo"?
		foxm sparkle That's our new character trait!
		foxf sparkle We were thinking that if we had a cool new character trait, we'd become fan favorites, and get-
		foxd sparkle More sex!
		foxf annoyed mayorF told us to behave, and so we're back to needing an excuse to do lewd stuff again...
		foxm sparkle So we came up with that, and now we're just gonna tackle you and finally do a collaborative blowjob!
		player sleep See, that's the-
		player befuddled Huh?
		foxd blush Get 'em!<br>I'll get the bottoms off!
		im foxf/foxd-fun1-1
		player shock Wah!<br>You two are incorrigible...!
		foxm love ... Hey foxfF?
		foxf love Yeah little bro?
		foxm Is it bad that I came a little already?
		foxf Nah, that's natural, I think...
		player pent *Sigh*<br>Alright, alright, I guess you two have been working pretty hard, so-
		foxd joy Yayyyy~!<br>Double~!<br>Oral~!
		im foxf/foxd-fun1-2
		foxf flirting We have been working hard, yeah~<br>But I can tell by the sweet smell of your sweat you've been out and about too~
		foxm love Mmmwah~<3<br>Sis... Don't lick it all up, I want some...
		foxf annoyed Hey, don't be greedy!<br>You can suckle down the precum *he squirts out while I drink the sweat off *his balls, we both win!
		foxm Ohh... Mmm~
		player pent Wah! Okay, okay, geez!<br>Lemme stand back up already! The last thing I need is to be stuck under a pair of fuckdrunk foxes...
		t You grab the duo by the backs of their shirts and gently tug them off of you.
		player sleep Ah, this brings me back to when I first visited the museum.<br>You two had to play rock-paper-scissors, but I'm glad you guys got better at sharing.
		foxm excited Ehehe~<br>Mmm~
		im foxf/foxd-fun1-3
		foxf annoyed Hey...! I guess you're so happy to see what a <i>real</i> dick looks like, you forgot how to share...
		player scared Eh? Hey, don't fight-
		foxf mocking Well, how about you show it some <i>real</i> appreciation!
		im foxf/foxd-fun1-4
		foxm orgasm GL-HHHRK!
		foxf amused Did you say something?
		player forced Ghh!
		foxf flirting Sooo~? Does my little brother's throat feel nice?<br>Don't mind his cute little throat noises too much, he's happy down there.<br>He can be a little twerp sometimes, but that's just cause he enjoys a little bullying~
		foxm Kkkhk-
		player forced You... Ghh... You seem like you might be enjoying this a bit too much...
		foxf excited Ehhh? You think so~?<br>But maybe it's his fault, Tugging my adorable little brother's head back and forth like a cocksock shouldn't be this fun~<3<br>Ehehe~ Ahaha~
		t There's a mania in foxfF's voice, but to her credit foxmF doesn't seem to be putting in any resistance at all, like he's totally submitting to his sister's whim.
		foxf flirting Cmon, cmon, make *him cum already! And choke louder! Ehehe~!
		player pleasured Hoh... I'm-
		foxf mocking You hear that?!<br>Down, boy! Earn that cum, get your mouth to the base, kiss it, then come back up and let me taste!
		im foxf/foxd-fun1-5
		foxm orgasm GLLLLLLHHHHK-
		foxf Yes! Messier, I'd better not hear a single swallow!<br>If you get to be the first one to taste it-
		t Unceremoniously foxfF grabs onto the back of foxmF's head, places a hand on your thigh, and sloppily separates the two of you with surprising strength.
		player shock W-whoa!
		t If he had any qualms about the rough treatment, foxmF doesn't show it. As you stumble backwards the twins pounce back onto you like a pair of fiending junkies, trying to nuzzle your cock into spurting all it can.
		im foxf/foxd-fun1-6
		foxm afterglow Hahhhh~
		foxf sleep Ah~<3<br>So much cum!<br>My little brother's throatpussy was that good?<br>Hey, don't waste it!
		player pent Hoh... Geez, you two don't hold back at all, do you?
		foxf pleasured Eh? What do you mean? I've been holding back this entire time, rape my throatpussy too!
		foxf M... More... <3
		foxf excited Ehehe~<br>And my little bro isn't satisfied yet either...<br>But it's my turn! You can go next!
		player Oh... Oh boy...
		t ...
		t After another round of deepthroating, you realize you might be in trouble.
		t While one is nose-to-crotch, facefucking themselves senseless on your dick, the other has time to recover while you become more and more exhausted.
		t It's not sustainable. Luckily, your ingenious brain comes up with a plan.
		player pent Gh... Su... Surprise sibling kiss!
		t Grabbing the pair by the head, you smush them together, and just as you expected instead of shock or anger you get...
		im foxf/foxd-fun1-7
		foxm broken Mpph... foxfF... It feels... Head... Fuzzy~
		foxf afterglow Ah... Mwah~<br>That's it, good boy... Stay still, let big sis clean you off~
		player joy A flawless maneuver!<br>Now it's time to flee!
		t While the twins are distracted cum-swapping, you make your completely stealthy exit on shaky legs.
		player pent Hoo... I'll need to up my stamina if I want to keep pace with the both of them again...
		eval unlockScene("foxm", "fun-foxd-foxm-foxf");
	`},
	{index: "repeat1", name: "Repeatable - Heavy Petting", image: "foxf/repeat1-1", requirements: "?flag "+character.index+" repeat1;",
	content: `
		define foxd = dual sp1 foxm; sp2 foxf;
		im foxf/repeat1-1
		foxf happy Hmm? What for? I don't think I did anything all that special recently.
		player sleep You're a hard worker! I know you're putting your heart and soul into keeping this town light and fun.<br>I think you deserve to be appreciated for that.
		foxf love Oh... W-well... If you insist!<br>It's not... Sniffing the sweat off your balls... B-but, this is a nice... Reward too!<br>It's nice to... Just get some innocent, wholesome, non-sexual praise...
		foxf excited Myehehe~!<br><i>*He's so transfixed by my fur, "non-sexual" my ass!</i>
		player excited Ehehe~<br><i>She thinks I don't notice her schlicking...<br>Jokes on her, she can get off all she likes, so long as I can keep petting her~</i>

		foxm scared ...!<br>D... Did... ?boys;
		foxm crying Did I not... Do a good job too? ?boys;
		player shock Oh, foxmF! You've done great work too! Come here! ?boys;
		foxm love ...! ?boys;
		player worried Do I dare... ?boys;
		player angry No, I must! Both of you deserve to be fluff-loved! And if the legendary double-scritch technique kills me, then I never deserved to live in the first place!<br>Take this, double fluff-lover attack! ?boys;
		im foxf/repeat1-2b ?boys;
		foxd perverted Mmmmh~ ?boys;
		player orgasm Hwooooah~! Good girl! Good boy! You're both precious! ?boys;
		t The sensation is overwhelming. Fox fur is extremely fine and luxurious, a short layer of guard hairs protects the treasure beneath, the fluffy and warm underfur! But giving the underfur a solid loving means part of your hand is embraced by pure warm floof, while the remainder is slowly growing addicted to the bristly overcoat. ?boys;
		t Combine that with the fact that you're petting two fluffy creatures at once... ?boys;
		player torogao It's... Too much for... Brain to handle!<br>Hang in there...! This is what we lived for!<br>Brain! Can you hear me?! ?boys;
		t Soooooft~<3 ?boys;
		player forced I'm... Becoming a fluffing machine!<br>I can't stop!<br>foxfF, foxmF, I'm sorry, I can't hold back! ?boys;
		im foxf/repeat1-3b ?boys;
		foxd orgasm Ghouuhhh~<3 ?boys;
		player torogao Ngghhh~!!! ?boys;
		t Eventually, the three of you collapse onto the floor, you being overwhelmed in a very different way than the two human-addicted foxes.
		player pent *Huff* *Huff*<br>You two alright~? ?boys;
		foxf afterglow Hyehhhhsh... ?boys;
		foxm afterglow Meehltyyy... ?boys;
		player tired ... I truly, truly hope that someday I'll either be strong enough to stop myself from giving in to overfluffing... ?boys;
		player sleep Or that I become weak enough to never hold myself back from it again... ?boys;


		player worried So... Soft... Do I dare... !boys;
		player angry No, I must! You deserve to be fluff-loved to the highest degree! And if the legendary super-scritch technique kills me, then I never deserved to live in the first place!<br>Take this, super fluff-lover attack! !boys;
		im foxf/repeat1-2a !boys;
		foxf perverted Mmmmh~ !boys;
		player orgasm Hwooooah~! Good girl! You're precious! !boys;
		t The sensation is overwhelming. Fox fur is extremely fine and luxurious, a short layer of guard hairs protects the treasure beneath, the fluffy and warm underfur! But giving the underfur a solid loving means part of your hand is embraced by pure warm floof, while the remainder is slowly growing addicted to the bristly overcoat. !boys;
		player torogao It's... Too much for... Brain to handle!<br>Hang in there...! This is what we lived for!<br>Brain! Can you hear me?! !boys;
		t Soooooft~<3 !boys;
		player forced I'm... Becoming a fluffing machine!<br>I can't stop!<br>foxfF, I'm sorry, I can't hold back! !boys;
		im foxf/repeat1-3a !boys;
		foxf orgasm Ghouuhhh~<3 !boys;
		player torogao Ngghhh~!!! !boys;
		t Eventually, the two of you collapse onto the floor, you being overwhelmed in a very different way than the human-addicted fox across from you.
		player pent *Huff* *Huff*<br>You alright~? !boys;
		foxf afterglow Hyehhhhsh... !boys;
		player tired ... I truly, truly hope that someday I'll either be strong enough to stop myself from giving in to overfluffing... !boys;
		player sleep Or that I become weak enough to never hold myself back from it again... !boys;
	`},
	{index: "trap", name: "Tentacle Trap", image: "foxf/foxf-trap1-2", requirements: "",
	content: `
		foxf tired Helloooo~? Anybody?
		player shock That sounds like a fluffy friend in trouble! Where is-
		im foxf/foxf-trap1-1
		player joy foxfF! 
		foxf sparkle playerF! Just who I needed to see right now!
		foxf annoyed Seriously. The last thing I'd need is for my little bro to find me stuck like this. I'd never hear the end of it.
		player confused What happened?
		foxf tired Well, see, shopF has this great por- Err, textbook. Totally educational. About plants.
		player amused And would the plants in this textbook happen to have tentacles?
		foxf pent Yeah, yeah they do. So I was super excited to find a species down here that was pretty close.<br>Look, don't judge me, okay? I have needs, and sometimes those needs conflict with your need for personal space.
		foxf sleep So if anything, you should be thanking me for being so thoughtful, and trying to solve stuff myself.
		player amused Sure, yeah. I'm super grateful.<br>And how exactly is being stuck in that hole helping your needs?
		foxf panic Hey, c'mon, no judging! This plant's actually super cool!
		foxf happy See, it should be ravaging my holes right now, going absolutely fucking crazy on every bit of me it can taste, using special chemicals to modify my body and make me squirt like a fertile pig, all while expanding my body both in size and sensitivity!
		player befuddled ... "Should"?
		foxf tired Yeah, that's the lame part. Turns out this is a variant subspecies that <i>also</i> cuts off sensation from parts above ground.
		im foxf/foxf-trap1-2
		foxf pent So I have no earthly idea what it could be doing down there. I could genuinely be having the strongest orgasm of my entire life, squirting like an absolute firehose...
		im foxf/foxf-trap1-3
		foxf And I'd never even know it. Even now that you're here, I bet whatever it's using to numb me could even nullify your pheromones.
		player worried Sorry to hear that. Want me to help you out?<br>Or, wait, if it is altering your body-
		foxf amused No need to worry about that. To be honest, I'm pretty sure it's been asleep the whole time.
		player laughing Hah! "Whole time", that's a good one. Alright, lemme help you out.
		foxf happy Thanks a ton. Pretty sure both my legs fell asleep a while ago.<br>And hey, maybe after I'm out of here, we could-
		foxf forced Gllhhhk-! ?atwt;
		player confused What's up? You feeling- ?atwt;
		im foxf/foxf-trap1-4 ?atwt;
		player shock Whoa! ?atwt;
		player annoyed Heave... Ho! !atwt;
		foxf torogao GHHHHHGGG-!!! !atwt;
		player pent Jeez, there you- !atwt;
		foxf broken Ghhhhhzzz- Hhgghgzz- !atwt;
		player befuddled ... I am like, 60% sure your breasts weren't that big yesterday. !atwt;
		t ...
		player tired Okay, so you're fine now?
		im foxf/foxf-trap1-fin
		foxf afterglow Hahhh~ Just gotta... Jiggle on home and grab some antivenom. I'll be right as rain, so long as I don't bump into anything on my way there.
		foxf excited Unless, uh... You maybe wanna try these babies out before I'm back to normal?
		player pent And what are the chances that sex while you're like this is so overstimulating something in your head snaps and breaks?
		foxf worried Not zero... Alright, point taken...
		foxf sparkle I'll just have to recover quick and jump your bones later!<br>See ya, playerF!
		player amused Bye, foxfF.
	`},
	{index: "pill-foxd", name: "Denial Pills - Foxes", image: "foxf/pills-foxf1", tags: "female",
	content: `
		define foxd = dual sp1 foxm; sp2 foxf;
		eval writeFoxPills();
		eval unlockScene("foxm", "pill-foxd");
	`},
];

function writeFoxPills() {
	var sceneType = "both";
	writeHTML(`
		player pleasured Foxes! foxfF! foxmF! I took some funny pills and now my balls are super stuffed, I need help!
		foxf sparkle Balls?!
		foxm sparkle Stuffed?!
		t ...
	`);
	if (checkRequirements("?girls;") != true && checkRequirements("?boys;") == true) {
		//foxm only
		writeHTML(`
			im foxf/pills-foxm1
			foxm awe Ohhh... Oh <b>wow</b>...<br>It's like a firehose attached to a pair of watermelons...
			foxm blushy All this is for me?! 
			player forced Ghh... Can you handle it?
			foxm perverted I dunno, but... Ooh, I really want to try~!<br>Oh, my poor sister, I bet she'd be squirting herself to a blackout just hearing a single one of these gurgles~<3
			foxm seductive You need relief, right? No time for foreplay, so...
		`);
	}
	else if (checkRequirements("?girls;") == true && checkRequirements("?boys;") != true) {
		//foxf only
		writeHTML(`
			im foxf/pills-foxf1
			foxf awe Oh my fucking gaaaawd~<3<br>It's like a firehose!
			foxf blushy And it's all mine! Mine mine mine!
			player forced Ghh... Can you handle it?
			foxf seductive Gaaawd yes! I know I can~!<br>Ooh, my poor little brother, I bet he'd squirt himself at one look at how <i>inferior</i> he'd be compared to this monster~!
			foxf horny Mmmh, there's not enough room in every womb in town to hold what must be <i>churning</i> in there! So...
		`);
	}
	else {
		//both
		writeHTML(`
			im foxf/pills-foxd1
			foxf awe Oh my fucking gaaaawd~<3
			foxm awe It's like a firehose and two veiny watermelons~<3
			foxd excited Miiiine~! Mine mine mine~!
			player forced I... Ghh...! Don't have time to mediate you two today!
			foxf pent R-right! How are we gonna pick-
			foxm seductive First to go does oral, second does anal.
			foxf excited I'll take second place then~<3 And I'll try not to squirt myself too silly watching you~!
		`);
	}
	writeHTML(`
		t ...
	`);
	if (checkRequirements("?boys;") == true) {
		writeHTML(`
			foxm seductive First up~
			im foxf/pills-foxm2
			foxm afterglow I want you to <i>use</i> me~!<br><i>Take</i> whatever satisfaction you want from my throat~!
			foxf excited Mhmhm~ Lookit your little peenie, little bro, it's so excited too~ ?girls;
			player pent Guoooh... Sorry about this, foxmF...
			foxm seductive Don't be-
			im foxf/pills-foxm3
			foxm awe Ghlllk-!!!
			foxf excited Break himmm~!!! ?girls;
			t The pulsing of foxmF's throat somehow feels like a massive relief. Despite the warmth of his breath and tongue, it's like a breeze of cool air on your superheated balls.
			t So much of a relief, in fact, that you can't stop yourself from sinking deeper.
			im foxf/pills-foxm4
			foxm orgasm GHHHHGGG-
			player pent Ah... I think I'm cumming...
			player awe ... Ah! foxmF! 
			t Pulling with all your might, at least a foot of cum-greased python slides out of the fuckdrunk foxboi.
			im foxf/pills-foxm5
			t Completely unable to speak, what seems like an ocean of extremely thick jizz cascade out of him.
			t He's been left absolutely glazed. Anytime he opens his mouth will probably smell like thick jizz for at <i>least</i> a week.
			foxf awe What a work of art~<3<br>I've never seen him cum so hard, and it still looks totally pathetic~<3 ?girls;
			player pent Do you think you'll look any better? ?girls;
			foxf sparkle I hope not! Now... ?girls;
			t ...
		`);
	}
	if (checkRequirements("?girls;") == true) {
		writeHTML(`
			im foxf/pills-foxf2
			foxf seductive Right here, dump every bit of that thick cum you need to, I bet I'll end up with a big belly this way too~
			player forced Can't... Hold back...!
			foxf blushy Don't even try! I wanna be a well-fed, <i>plump</i> farmsow by the end of this!<br>Rest those balls on my cheeks like it's your throne!
			im foxf/pills-foxf3
			foxf forced Ngggh~! What... Brutal length...!<br>And it's so thick... Can I feel your heartbeat from your shaft?!
			player pent Hoh... This is... Nice...
			foxf blushy H-hey there, not that I m-mind, ghh!<br>A deep fuck, b-but every inch you sink in is an inch less of cumsock for your load to occupy!
			t Your mind hazed over in a contradictory mix of total breeding frenzy and overwhelming relief, you can barely tell she's talking let alone make out what she's saying.
			t Finally, you feel yourself as deep as you can fit. Yet... Release isn't coming as quickly as you expected.
			foxf excited Ffff, pressed up right against my clit, you're-<br>Ohhh fuck, they just clenched, are you gonna-?!
			t It isn't enough, so you pull back, fighting against the tug of her needy butt. She seems about protest until you start thrusting again, probably the slowest fuck you've ever had but absolutely necessary given the bowling balls you've been saddled with.
			t You're treating her bouncy fox ass like an exercise ball. All the while, her untouched cunt soaks the floor, spraying in complete submission to your still massively overfilled testicles.
			t One good slam-plap leads to another, but you barely need to thrust as your nutting feels less like "stop and go" and more like "unquenchable force of nature", and finally...
			im foxf/pills-foxf4
			foxf torogao UUUNNNGH~<3<br>Please... Drain all that jizz fr... From your fuckin nuts! I wa... I wh... Whggg... ?atwt;
			im foxf/pills-foxf5 ?atwt;
			t ...
		`);
	}
	if (checkRequirements("?boys;") == true && checkRequirements("?girls;") == true) {
		writeHTML(`
			t Your vision wobbles. Hopefully you fall backwards so your ass can cushion the fall.
			t With the foxes surely both completely destroyed, you almost feel a tinge of regret. After all, it's not <i>their</i> fault you found a super-virility drug out in a digging spot just outside town.
			player tired H-hey... Wait a minute... foxfF, foxmF...
			im foxf/pills-foxd6
			foxd ahegao Mppph~ Mllm~<3
			player Ah, you two are... Fine...<br>I think I might just... Take a nap here, thanks.
			t Your eyes roll back, far from the only thing today to get enveloped white today.
			t ...
		`);
	}
	writeHTML(`
		foxd sparkle Gmorning~!
		foxf joy You slept like a log!
		foxm joy You didn't wake up no matter how many times we poked you!
		foxf amused You jiggle better than gelatin, by the way~
		foxm amused Kinda like a thick bowl of pudding~
		player tired How on earth do the two of you still have so much energy?
		foxf joy Well, well, see, when I get excited, he gets excited for me!
		foxm joy And when I feel all hyper, she gets all competitive and has to keep up, it's a total-
		foxd sparkle Feedback loop~!
		player tired ... I'm too sleepy for this.
		foxf happy Want me to walk you home? I've got a copy of your key if you misplaced yours.
		foxm happy Or I could walk you, if you use me as a stepstool you'll definitely fit through that window you keep leaving unlocked!
		player sleep You two... Are real thoughtful. But... I'll be... Fine...
		foxd smug ... <i>I wonder how long until *he realizes-?</i>
		player shock Hey, wait a second!
		foxd laughing Haha, playerF's mad! Run awaaaaay~!
	`);

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