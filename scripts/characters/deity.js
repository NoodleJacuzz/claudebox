var character = {index: "deity", flags: "", fName: "Deity", lName: "", color: "#58504D", outfit: "feral", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"};

var logbookArray = [
	"im images/deity/feral/happy; im images/deity/nude/happy; title Shapeshifter; An ancient spirit of the forest, deityF has been uplifted as this land's guardian.<br>He seems intent on restoring the land to its former glory.",
];

/*
	If you gather up enough essence, he claims it'll revitalize the town for good. Once you've gotten enough, head to his shrine in the forest to see what he can do
	"im images/deity/logbook2.png; title Feral Form; ?trustMin deity 3; ?nutmeg; ?fetish feral; deityF's preferred form for daily life is a small, four-legged animal. A little bit of dog, a little bit of fox, it's not really clear what species he's parading around as.<br>At the very least he's got a working ass and dick in this form, though if you're interested in them you'll have to make that very apparent.",
	"im images/deity/logbook3.png; title Anthro Form; ?flag deity anthro; With most of his power restored, deityF has revealed his 'true' form to you.<br>It wasn't very impressive, he's just bipedal now. Anyone can stand on two legs, you do that all the time!",
	"im images/deity/logbook4.png; title Placeholder; ?flag deity repeat1; ?nutmeg; ?fetish feral; Despite how deityF's power continues to grow, his control over his own body doesn't seem to be improving with it. He confided in you that he's starting to feel strange urges, but he's dismissive of the idea he's entering heat.<br>You'll just have to keep gathering essence to see where things go from here.",
*/

var achievementArray = [
];

var itemsArray = [
];

var shopArray = [
];

var pickupArray = [
];

//Story flags, in order: prelude1, prelude2, called (prelude3 or prelude3Alt), artifact, gemFash,
//houseAsk, houseOrdered, reward1, quo2. Flag names avoid being substrings of one another, since
//checkFlag matches with includes().
var morningArray = [
	{index: "prelude1", priority: 45, requirements: "?day 3; ?trust deity 0; !flag deity prelude1;", unique: true,},
	{index: "prelude2", priority: 45, requirements: "?flag deity prelude1; !flag deity prelude2;", unique: true,},
	{index: "prelude3", priority: 45, requirements: "?flag deity prelude2; !flag deity called;", unique: true,},
	{index: "dream1", priority: 40, requirements: "?flag deity reward1; !flag deity dream1;", unique: true,},
	{index: "morning2", priority: 40, requirements: "?flag deity repeat1; !flag deity morning2;", unique: true,},
	{index: "deityMorning-carpenter", priority: 1, requirements: "?flag deity reward1; ?trustMin carpenter 1;", unique: false,},
];

//The shrine is a fake location, so its encounters are printed by checkForFakeLocationEncounters,
//which only picks up encounters naming "?location forestShrine;" explicitly.
var encounterArray = [
	{index: `prelude3Alt`, type: `walking`, requirements: "?location forestWilderness; ?flag deity prelude1; !flag deity called;"},
	{index: `intro1`, name: `A voice is calling from deeper in the woods`, requirements: "?location forestWilderness; ?trust deity 0; ?flag deity called;", altName: "???", altImage: "none",},
	{index: `plug2`, name: `deityF seems to sense something on you`, requirements: "?location forestShrine; ?trust deity 1; ?flag deity artifact;", altName: "", altImage: "",},
	{index: `deity2-1`, name: `Bring the gemstone to deityF`, requirements: "?location forestShrine; ?trust deity 2; ?flag deity gemFash; !flag deity houseAsk;", altName: "", altImage: "",},
	{index: `deity2-2`, name: `There's something new beside the shrine`, requirements: "?location forestShrine; ?trust deity 2; ?flag deity houseOrdered;", altName: "", altImage: "",},
	{index: `baseQuo`, name: `Talk to deityF`, requirements: "?location forestShrine; ?trustMin deity 1;", altName: "", altImage: "",},
];

var sceneArray = [
	{index: `prelude1`,
	content: `
		deity special secret; I... Am...
		deity special secret; Awake? But why...?<br>The forest is alive, somehow...<br>Where is this energy coming from?
		im deity0-1
		deity special secret; Could I have been given a second chance?
		eval addFlag('deity', 'prelude1');
		finish
	`,},
	{index: `prelude2`,
	content: `
		deity special secret; So...
		im deity0-2
		deity special secret; <i>This</i> is the source of what's been affecting this region?<br>Strange. You seem quite plain. Simple, even.<br>But I suppose I can't afford to be picky right now. You'll do...
		eval addFlag('deity', 'prelude2');
		finish
	`,},
	{index: `prelude3`,
	content: `
		deity special secret; The forest... The forest...!
		player sleep Zzz... The forest... Zzz...
		deity special secret; You have been chosen, you shall restore life and balance to the land...<br>Find me, in the forest...
		player sleep Zzz...
		eval addFlag('deity', 'called');
		finish
	`,},
	{index: `prelude3Alt`,//Bypass if the forest is visited before the prelude3 dream
	content: `
		player happy Hmm hm h-
		player shock Bwah?!
		deity special secret; The forest... The forest...!
		player befuddled A mysterious voice in my head? I'm not sure if I should be listening...
		deity special secret; Closer, closer... Savior of these lands, chosen by divine will...
		player frown ... Sounds like they have me mixed up with somebody else.
		player panic Awawa... What if it's a ghost?
		eval addFlag('deity', 'called');
		trans intro1; Follow the voice
		trans cancel; Nope, too spooky
	`,},
	{index: `intro1`,
	content: `
		t You step forward, farther into the wilderness than you've ever been before.
		player confused Strange... It's almost like the bushes and branches are moving out of the way.
		deity special secret; Approach... Closer...!
		player worried Mmm... I swear, if I see even the tiniest sign of some spooky-
		im deity0-3
		t *FWOOSH*!
		player scared Wah! Fire, fire! A forest fire!
		player befuddled A... A forest fire contained entirely inside a small bowl at a mysterious shrine.
		deity special secret; Since this forest was young, I have been here.
		player curious Okay...?
		deity special secret; Since before these lands were named, I have been here.
		player happy That's cool. Since you started talking, I've been here. My name's playerF! What's yours?
		player worried A-and just to be clear, you're not a g-ghost, are you?
		deity special secret; Some paltry ghost? No. But I am a spirit. An ancient one. And you may call me...
		im deity0-4
		deity altName ???; frown <input type='text' id='nameSubmission-deity' value='deityF'>.
		button Continue; renameCharacter('intro2')
	`,},
	{index: `intro2`,//MISSING IMAGE: "im 0-5" was called after "So cuuuuuute", but no deity0-5 exists
	content: `
		player sparkle So cuuuuuute~!!!
		deity pout H-hey, enough of that! I am to be treated with dignity!
		deity sleep I am one of two ancient guardians appointed here to guard over these lands and inhabitants. So long as this mighty fire burns the essence of life, it is my responsibility to aid whoever calls these woods their home.
		player curious Oh. Does that include the town of people living nearby?
		deity worried It does, yes. Of course I cannot actually help them with anything as long as I cannot even help myself.<br>That is why I called you here.
		deity happy There is a vessel, I can still sense it beneath the land. A sacred artifact meant for extracting life energies and raw fertile grace.<br>It was not made for our exact purposes, but it will do.
		deity I must ask you to obtain it and bring it here. Before anything else I must know if it still functions.
		player What does it look like?
		deity confused Like... Hnm. Like a metal egg, attached to a heart-shaped base.
		player befuddled Metal egg with a heart-shaped base, underneath the town... Hmmmm...
		deity joy I can only wish you luck, as I am bound to this altar for now. Bring it here as soon as you are able, savior!
		eval raiseTrust('deity', 1);
		eval addFlag('carpenter', 'shrine');
		trans plug2Alt; Continue ?flag deity artifact;
		eval passTime(); !flag deity artifact;
		finish !flag deity artifact;
	`,},
	{index: `baseQuo`,
	content: `
		eval deityBaseQuo();
	`,},
	{index: `baseChat1`,
	content: `
		player happy That other guardian you mentioned, is he stuck in the same situation you are?
		deity happy No, <i>she</i> was merely tasked with punishing the wicked. I was given as a gift to the pure-hearted.<br>I'd imagine she's still around, somewhere. Seeing how peaceful these lands seem, I would imagine there are hardly any wicked souls that require punishing.
		player curious Ah, so do you think we could just borrow energy from her?
		deity frown As if she'd spare it... No, I've been stuck asleep for who knows how long. If she has not chosen to help me by now, then she never will.<br>Besides, I have you now, right?
		eval addFlag('deity', 'chat1');
		eval writeDeityChats();
	`,},
	{index: `baseChat2`,
	content: `
		player happy Did you have a good sleep?
		deity worried ... Not in particular, no. Last I recall, I was worried to knots over a dozen residents praying for aid over something, when I simply ran dry.
		deity frown The inhabitants of the woods meant well, but they asked for far more than they gave in return.<br>Now, I am bound to restore my former power and come to their aid once again.
		deity sleep I can tell by the air about the place that the fertility of this land in particular is quite low. The urge to reproduce is overwhelming in all things, from the people to the plants and their very soil. But without actual fertile energy, that urge has no release. Perhaps that is what I shall resolve first.
		player worried Hrm... But then I'd be out of a job...
		deity worried Oh. Well, that would be a problem too. But as a resident of the forest, I would surely be able to help you as well.
		player sleep Nah, I'm sure I'll think of something by then. Let's focus on getting you healthy for right now.
		deity befuddled ... "Nah"? <br>... You don't need my help?
		eval addFlag('deity', 'chat2');
		eval writeDeityChats();
	`,},
	{index: `baseChat3`,
	content: `
		deity frown No, I am not a ghost.
		player surprise *Gasp*!
		deity frown No, I cannot read your mind either.
		player shock *Gasp* *Gasp*!
		deity worried And if you keep doing that, you will pass out.
		player happy Okay. But I totally did know you weren't a ghost by the way.<br>You can't pet ghosts, after all.
		deity tired ... Right. <br>Oh, I suppose I should mention my true form will have some very spiritual qualities.
		player joy True form? Can I still pet you?
		deity sleep If you are able to return me to my true awoken form, I shall <i>allow</i> you to pet me and my tails.
		player sparkle Tails? Plural?! Oh boy!
		eval addFlag('deity', 'chat3');
		eval writeDeityChats();
	`,},
	{index: `plug1`,//Found in the ruins grotto, triggered from grottoLocations' ruinsEmpty3 pool in test.js
	content: `
		t Poking around a dark corner of the grotto, you spot something glinting in the dirt.
		im artifacts/plug0
		player surprised Whoa, somehow it still looks completely clean! Actually...
		t The reflection of the plug toy seems off, somehow. Like light itself is gliding off of its surface.
		player confused Interesting, I guess it can't actually become dirty. How does something this impossibly smooth <i>stay</i> this smooth in some random cave?
		player happy Maybe someone in town knows what to do with this thing.
		eval addFlag('deity', 'artifact');
		finish
	`,},
	{index: `plug2Alt`,//Artifact was found before meeting deity. SALVAGE GAP: only two lines survived
	content: `
		deity surprised Hold on, wait...
		t deityF approaches, hesitantly giving you a quick sniffa-sniff.
		deity sparkle That scent... The vessel! You already have it!
		player befuddled The buttplug? Y'know, there was also a picnic basket down there, did you mean-
		deity panic Do not eat it.
		player shock Wh- Come on. Would I seriously eat a buttplug?!
		deity worried ... Would you?
		player worried ... I mean-
		deity panic No!
		trans plug2; Continue
	`,},
	{index: `plug2`,
	content: `
		deity joy Ah, you've already obtained it! I can sense it on you, quickly, show it to me!
		player happy Sure!
		im artifacts/plug1
		deity sparkle It's pristine! Oh, such wonderful news!<br>This is a tool of an ancient era. Long ago, creatures who stole life energy from others would carry it around in sacks. This tool was made to ensure every bit of energy was properly extracted from those creatures, to ensure they weren't hiding any away.
		player shock Steal life energy... Do you mean... Vampires?!
		deity frown ... No. No I do not mean vampires.
		player sleep Ah, I see. I understand everything now.
		t You say, not understanding anything.
		deity worried The people have forgotten me, and also have nothing to pray in gratitude for. After all, people do not give thanks to the land for bountiful anxieties.
		player worried Should we? Geez, now you've got me worried.
		deity sleep Worry not! For even though my name is forgotten, the gemstones created by this artifact shall be made of pure spiritual energy!<br>Even if the residents have forgotten me, I can restore myself to full power with the gems created by this artifact! Now go, bring balance back to these lands!
		player happy Sure, right, I'll do that right away, but first...<br>Could you maybe tell me what to do again just in case I wasn't paying attention?
		deity worried ... Alright, I suppose.
		t ...
		player sleep Okay, so I take this...
		deity sleep Yes.
		player confused And put it up some butts...
		deity amused Crude, but correct, yes.
		player befuddled And then take it out of their butts...
		deity happy Creating a gemstone, yes. Then you can bring them here, and...?
		player joy And that saves the world!
		deity worried ...
		deity sleep ... Yes, you have gotten it exactly right, that saves the world. Good job.
		player sparkle Yay! I knew it was a buttplug!
		deity worried Though, remember, the specific energies we need can only be drawn from men.
		player confused Why? Why not girls? Why not girls with dicks?
		deity tired ... I suppose if you find a gaggle of women with phalluses, it would work on them as well.
		player What about-
		deity panic Shafts! Members! And the testicles that hang below them. Use the artifact on individuals with those, insert into the anal cavity and let excess energy leak out.
		player amused Well why didn't you just say so? Alright, see you soon!
		eval raiseTrust('deity', 1);
		eval passTime();
		finish
	`,},
	{index: `deity2-1`,
	content: `
		eval writeEvent('deity2-1');
		eval addFlag('deity', 'houseAsk');
		finish
	`,},
	{index: `deity2-2`,
	content: `
		player sleep Hmm hm hmm~
		deity sparkle playerF, playerF! You're here, look! Look!
		im deity1-2
		deity A house! My own house! I have a house!
		player sparkle You have a house! It looks so cozy!
		deity happy Yes, the friendly bear you sent here kept suggesting it be larger, but this is the perfect size for me.<br>Oh, this is so lovely! And they said it was waterproof too!
		player happy That's great! So, are you gonna give me the tour?
		deity curious ... It's one room.
		player happy Yeah, and? You gonna tell me about it?
		deity befuddled ...
		deity shock The ritual! We've gotten completely sidetracked! Please tell me we can continue, and you won't become distracted by something else, like my eating habits...
		player befuddled What <i>are</i> you eating?
		deity angry No! Ritual! Do you have that gemstone you mentioned?
		trans reward1-1; Hand over the gemstone
	`,},
	{index: `reward1-1`,
	content: `
		player sleep Ah, I get it, now I understand everything. You think you can eat shiny rocks.<br>I was like you once, and-<br>Actually, it's important to learn things through experience sometimes. Here. Give it a try.
		deity surprise My... H-how? So many must have... So quickly-<br>How many people did you use the artifact on?!
		player happy Just one, my friend-
		deity panic ONE?!<br>A-are they still-<br>N-no, I saw the artifact, it should still be working perfectly, it should only be draining the excess energies...
		deity sleep N-no, this is... Good! I'm just surprised is all. <br>Now, place the gemstone into the fire. You've done very well, playerF, and with my blessing these flames shall not harm you.
		player amused Cooking isn't going to make it tastier, deityF. Believe me, I've-
		t *POP*
		player scared Wah! F-fireworks?!
		deity surprised H-hohhhh-!<br>Incredible! This is gratitude, raw fertility, joy, the energies of the soul overflowing!
		deity sparkle I can feel... Power, overflowing! It's returning to me, returning to the earth, it's-
		deity confused Getting... Eaten by the earth? That is strange, most of it's going elsewhere.<br>I still feel more powerful, but something else is drawing quite a lot of it away.<br>It's almost as if-
		deity shock My contracts!
		player confused Contracts?<br>Oh, I think I had to sign one of those too when I got my house.
		deity joy No, no! Back in my time, I had a number of loyal servants to help me!<br>They had all left as my power waned, I thought for sure they had left this earth, but one is returning!
		deity scared Ah, wait! You are scared of ghosts, you said-
		deity confused Though, you aren't scared of me, so-
		player frown No, you're a spirit, not a ghost.
		deity worried Oh. Well... My aides are all spirits too.
		player sparkle I'm not afraid of alcohol, bring it on! Time to make a new friend!
		deity befuddled ... Putting that aside, I wonder which one it is?
		trans reward-fash-trap; Continue
	`,},
	{index: `reward-fash-trap`,//Thorne's summoning, from the gemstone made with fashF
	content: `
		t The ground trembles for a moment as the roots of the nearby trees seem to shift.
		player confused Wait, those aren't roots...
		deity sparkle Yes, yes they are! It's...
		im trap/trap0-1
		deity trapF~! Oh, how good it is to see you again.
		trap Master... You came back...
		weepy This is him?
		angy He's so tiny!
		bratty He kept saying you'd come back!.
		lusty I WANNA PET HIM!
		deity trapF? Are you alright? You seem... Muddled. And what are those things following you?
		trap Fresh ones, invaders to the forest, mostly. Now reborn.
		angy I didn't invade anywhere!
		weepy I didn't either. Probably. I don't remember.
		deity befuddled You've been... Collecting new ghosts? How-
		deity surprise Ah! Wait, first, meet playerF. *He was the one who made this all possible!<br>playerF, meet trapF.
		player happy Nice to meet you.
		trap playerF.
		lusty Soft.
		angy Human. Don't stare. It's rude. 
		weepy *He has hands...
		bratty I'm staring~ Neener neener neeeener~
		deity happy Last I saw him, he'd possessed a single tree. It seems like he's had a long time to cultivate his vessel, and now also shares it with... How many other spirits are in there with you? I can't tell at a glance.
		trap Four that matter. Many that do not.
		angy Haven't we met *him? The toes. The cave.
		weepy I don't remember. I wasn't there.
		bratty You were. You just cried through it.
		lusty Eheheh~<br>I'd recognize that butt anywhere~<br>Heyyyy, can you see me?
		t He lets out a long sigh, his way of speaking seems to zigzag between different tones mid-sentence a lot, like a whole host of people are fighting over the controls.
		deity confused I... See. I think.<br>Well, it sounds like you've been keeping the town safe in your own way, and I'm sure all those friends of yours will come in handy once I'm back at full strength.
		trap Did you want some of them? 
		angy Mulched into a soul smoothie?!
		deity worried I hope you snap out of... Whatever this is soon, I very much enjoyed our previous chats, but it seems like you're struggling to speak.<br>And while I appreciate the thought, I'll be more than alright. playerF will be helping me.<br>I hope you can find a spot in the woods to be comfortable. Do you need a home? There's a friendly bear here who can build one. Mine's a bit small for two of us, but-
		trap No need.
		weepy A wooden house? For us?
		bratty Would it be like a house of flesh, living in a wooden home?
		t He trails off, having a passionate discussion with himself.
		deity happy ... Right. Anyways, don't worry about them. Him?<br>trapF will become better at talking over time. Thank you for your help, playerF, this has surpassed even my wildest expectations-
		trap Aroused.
		im trap/trap0-2
		dual sp1 player; sp2 deity; shock Uh...!
		trap Pheromones. In the air. They are remembering their old lives, old bodies. It is important to... Purge those feelings and memories.<br>Have you succumbed to it as well?
		deity forced Err! W-well, actually, now that you mention it... Ever since that bit of power returned to me...
		trap I must leave. These fools must be re-taught their place.<br><b>QUIET!</b>
		player scared Eep!
		trap Not you.
		eval raiseTrust('trap', 1);
		trans reward1-2; Continue
	`,},
	{index: `reward1-2`,
	content: `
		player ... I guess that's my cue to go, huh? Actually, it's getting a little late, I'll see you later, deityF.
		deity worried Oh, yes. Later. Certainly.
		deity joy Oh, like tomorrow, perhaps?
		player worried I dunno if I can have another gemstone for your ritual done by tomorrow.
		deity happy That's quite alright! I'd be more than happy to have the... Company...
		deity frown ... No, never mind. It's not worth the distraction. Please, commit everything you can to the ritual. The sooner it is complete, the sooner I can return to my old duties.
		player amused Hah... Sure, sure, whatever you say little buddy.
		t You head off, whether you visit deityF or not before obtaining another gemstone is up to you.
		t ...
		t Later...
		deity tired Mghh... What is this... Strange sensation?
		deity surprise Oh! Perhaps I have enough energy now to shapeshift!<br>It doesn't quite feel like it, but perhaps it's worth a shot?
		deity sleep Focus... Focus...!
		t *FWOOSH*
		deity sleep ...
		deity pent ... Nothing? I could have sworn I felt something change, but I'm still in my feral, quadruped base form.<br>Perhaps it's for the best, I'd be too big to fit inside of... Of...
		im deity1-3
		deity forced ...!
		eval raiseTrust('deity', 1);
		eval addFlag('deity', 'reward1');
		eval passTime();
		finish
	`,},
	{index: `repeat1First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('deity', data.player.currentScene.replace("First", ""));
		eval raiseTrust('deity', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat1Repeat`,
	content: `
		eval writeEvent(data.player.currentScene.replace("Repeat", ""));
		eval passTime();
		finish
	`,},
	{index: `repeat2First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('deity', data.player.currentScene.replace("First", ""));
		eval raiseTrust('deity', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat2Repeat`,
	content: `
		eval writeEvent(data.player.currentScene.replace("Repeat", ""));
		eval passTime();
		finish
	`,},
	{index: `dream1`,
	content: `
		t Meanwhile, at the forest shrine...
		im dream1-1
		deity nightmare Mghh...
		t <i>"My scarf? Ah, yes, well... My mother knit it for me, you see..."</i>
		deity sad ...
		t <i>"And it's not like you'd need one with the fire burning so brightly, haha!"</i>
		deity nightmare Ghh...
		im dream1-2
		deity tired Mmmgh... It's quite chilly tonight...
		eval addFlag('deity', 'dream1');
		finish
	`,},
	{index: `morning2`,
	content: `
		eval writeEvent(data.player.currentScene);
		eval addFlag('deity', data.player.currentScene);
		finish
	`,},
	{index: `deityMorning-carpenter`,
	content: `
		t Meanwhile, at Squids Make Inc...
		deity happy Hello!
		carpenter befuddled ... Talking dog?
		deity sparkle Since you were so kind as to bless me with a home, I decided that you should be the first one I use my powers to assist.<br>Tell me, what troubles you? Is there anything you need?
		carpenter sleep Mmmnope, not really.
		deity worried Nothing? Oh.
		deity happy Well, you certainly looked comfortable during your nap! Perhaps I could handle some of your tasks and leave you more time to sleep!
		carpenter annoyed ... You trying to take my job?
		deity panic N-no...
		carpenter sleep Good. And the answer is no. The feeling of a job well done makes the naps even better.
		deity worried Ah. I see. Alright, do let me know if you need anything then.
		t ...
		deity joy Anything at all!
		carpenter sleep Zzz...
		finish
	`,},
	{index: `placeholder`,
	content: `
		eval writeTest('`+character.index+`')
	`,},
	{index: `shrineBack`,//Leaves a menu without leaving the shrine
	content: `
		eval unencounter('deity');
		eval writeScene('system', 'forestShrine');
	`,},
	{index: `cancel`,
	content: `
		eval unencounter(data.player.currentCharacter);
		eval changeLocation(data.player.location);
	`,},
]

function deityBaseQuo() {
	if (checkFlag("deity", "reward1") != true) {
		writeHTML(`
			deity happy Welcome back, I am glad to see you have returned.
			deity worried You must find that artifact I mentioned, I can still faintly sense it, but not enough to know exactly where it is. Remember, a small metal egg with a heart-shaped base. !flag deity artifact;
		`);
	}
	else {
		if (checkFlag("deity", "quo2") != true) {
			writeHTML(`
				deity blushy playerF! Oh, h-how lovely to see you again!
				player Yep! So, how's it going?
				deity It's q-quite... Hold on, I'm sorry.<br>Hoo...
				deity glare Begone, worldly desire. Begone worldly desires...
				player worried ... What was that about?
				deity worried I apologize. I've been feeling strange lately, I was hoping to not waste any of the precious energy you'd obtained so far, but...<br>No, it was necessary.
				deity happy Luckily, one of the very first abilities I was taught is one that suppresses my desires. That way I can better serve others.
				player angry Well that's lame. You should be free to want things.
				deity worried W-well earthly attachments would just get in the way-
				player pout So if I destroyed your house right now, you'd be totally fine?
				deity panic No! Don't do that!
				player amused ...
				deity tired ... I suppose the technique has some limits.<br>In any case, have you obtained another gem? Something like the size of the one last time would be ideal.<br>Or did you mean to speak with my follower we summoned last time? They should be around here somewhere...
				player happy Maybe I just came to spend some time with you. Did you ever think of that?
				deity happy I didn't. I think that'd be a waste given all that I could do once the ritual is complete.<br>But, well, if you <i>really</i> just wanted to say hello and good day to me, I would enjoy the company.
			`);
			addFlag("deity", "quo2");
		}
		else {
			writeHTML(`
				deity happy Hello again, playerF. Shall we continue the ritual again today?
				deity blushy O-or... Err, did you perhaps come for some other r-reason?
			`);
		}
		writeQuoRepeats();
	}
	writeDeityChats();
}

//Feral scenes and their clean counterparts share one gallery slot. The slot's event only chooses a
//cut, so a scene unlocked in the clean cut replays the feral cut once the restoration mod is
//installed with feral content enabled. Cut indexes avoid the word "repeat", which writeQuoRepeats
//would otherwise list as buttons of their own.
var deityCuts = {
	repeat1: ["cleanPetting", "feralPetting"],
	repeat2: ["cleanPlaytime", "feralOral"],
	morning2: ["cleanMorning2", "feralMorning2"],
};

function deityFeralCut() {
	//TEMPORARY: the clean cut's images and rewritten scenes are not finished yet, so always play
	//the feral (nsfw) cut regardless of the restoration mod or the feral fetish toggle.
	//Restore the line below once the sfw images and scenes are done.
	//return doeRemoved == false && fetishes("feral") == true;
	return true;
}

function writeDeityCut(index) {
	writeEvent(deityCuts[index][deityFeralCut() ? 1 : 0]);
}

//Each chat is shown once, then drops off the list
function writeDeityChats() {
	writeHTML(`
		trans baseChat1; Ask about the other guardian !flag deity chat1;
		trans baseChat2; Ask how he slept !flag deity chat2;
		trans baseChat3; Ask if he's a ghost (again) !flag deity chat3;
		trans shrineBack; Go back
	`);
}

var eventArray = [
	{index: "deity2-1", name: "No Place Like Home", image: "deity/deity1-1",
	content: `
		deity joy Ah, you're back! Here to continue the strengthening ritual?
		player joy I sure am! The gemstone turned out huge!<br>Where are we keeping it? Do you have like, a gemstone room in your house?
		deity shock Huge?! Amazing! How many people have you used it on?<br>And no, I don't have a house, we just need to-
		player scared No house?! But you'll freeze to death out here!<br>You can't just live outdoors. Have you tried looking in cereal boxes? That's how I got mine.
		deity befuddled I... Well, good for you, I suppose. I don't-
		player happy I'll go ask carpenterF to build you one. What kind of house did you want?
		deity worried What? I- I don't-<br>Hold on, we're getting distracted. I don't need a house, I've never had a house-
		player angry You were helping people with whatever they needed and they didn't even have the decency to build you a house?! That's horrible!<br>And how would you know you don't need one if you've never had-
		deity scared Wait!
		deity worried I appreciate you worrying for me, it is truly flattering.<br>And, truth be told, I did use to have a house. Back when I was just a common animal. But I was elevated beyond that. I have this shrine now!
		player worried The shrine?
		im deity1-1
		player A small, flaming dish and some torii gates?<br>Where do you sleep?
		deity panic W-well... On the ground.<br>But that's freedom! I am free to sleep wherever I like!
		player frown ...
		deity tired ... You are not going to continue the ritual until you are satisfied on the matter?
		player sleep ...
		deity pent Fine. Fine. Truth be told... I do sometimes miss my old home. I was a young woman's pet before I was made into the guardian deity of these lands.<br>I lived in a doghouse near here.<br>The wood it was made from has probably returned to the earth by now, but if you-
		player sleep Doghouse, mhm, mhm, okay. No opposable thumbs so no doorknob, that'd make sense.<br>Alright, I'll be back later!
		deity surprise Eh?
		player amused I'm no good at physical tasks, but I bet if I asked carpenterF they could whip you up a new place in no time at all. See you later, deityF!
		deity panic You're actually...<br>Ah, *he's already running off.
	`},
	{index: "repeat1", name: "Repeatable - Petting", image: "deity/repeat1-1", requirements: "?trustMin deity 3;",
	content: `
		eval writeDeityCut('repeat1');
	`},
	{index: "repeat2", name: "Repeatable - Playtime", image: "deity/repeat2-1", requirements: "?flag deity repeat1;",
	content: `
		eval writeDeityCut('repeat2');
	`},
	{index: "morning2", name: "Morning - Restless", image: "deity/dream2-1",
	content: `
		eval writeDeityCut('morning2');
	`},
	{index: "feralPetting", name: "mini", image: "deity/repeat1-1",
	content: `
		deity confused ... You want to pet me? To stroke my fur and rub my ears?
		player happy Thanks for recapping what I just said, sometimes my brain blacks out connecting my ideas to my actions.
		player excited But yes, pets!
		deity sleep I see. Please, feel free. In time long past, petting me was considered to bring people great fortune.<br>Most people were quite hesitant though, some were even scared-
		im repeat1-1
		deity blushy Gweeehh-
		player sparkle "Gweeehh" he says! So cute, and so fluffyyyy~!
		t It's like your hands are sinking into marshmallows! And somehow, it feels even more like pampering an animal than usual. There's just something different about getting hands-on while the recipient is on all fours.
		deity nightmare Mrghh... Ah, there'sh shomething you should know...
		player excited Uhuh, uhuh, what's up?
		deity nightmare My transhformations- Have been- Not working properly-
		player confused Huh?
		deity pent Bwehh... Thank you for stopping...<br>As I mentioned before, I'll eventually have enough power to return to my true form, but...<br>For some reason I've found my body changing even when I'm not actively trying to.
		im repeat1-2
		deity I think that because the artifact we've been using was meant for creatures of lust, some side effects have come along with the energy you've given me.<br>That's just my theory though.
		player worried Look down.
		deity pent Alright, wha-
		deity scared Aaaaat?! Is that... Genitalia?!
		player confused I thought you were a fertility spirit?
		deity awe Not that kind of fertility! I govern the growth of crops a-and-<br>Well... Actually... I mean, I suppose I did oversee a few marriages, but I never watched the consummations!<br>Th-that would have been...
		t His voice drops down to a whisper as he comes up closer to you.
		deity panic L-lewd...
		player amused You realize how I got that first gemstone, right?
		im repeat1-3
		player happy You're definitely in heat.
		deity panic No?! I most certainly am not! Heat is something that affects mortal creatures, it's something that leads to reproduction and enforces hierarchies among the population!
		deity scared I have been elevated as the guardian of these lands, I cannot have such desires when I am to-
		player sleep Calm down, relax. Don't worry, there's a super easy way to test.
		deity amused A-ah, thank goodness. That will clear things right up then, and we can start investigating causes that actually make sense. Perha-
		deity panic -Aaaa- Why are you-
		im repeat1-4
		deity scared Why are you presenting your own?!
		player confused To see how it makes you feel?
		deity panic It's... Warm! Very warm! My whole body is...<br>Ah...
		deity blushy Oh... This is not good, not good at all... Could this be a side effect of the artifact?<br>Or perhaps it was my own mistake, maybe I transformed... Too...
		deity pent Gh... It's very hard to think like this...
		player happy I know just the thing to help!
		im repeat1-5
		deity forced Ghhheee! Eh? Wait, but I'm a male!
		player happy Yep! I can see you have a pair of swingers on you, and the best thing for us to do is empty them!<br>Just think squirty thoughts and try to relax despite the heat, like you're in a sauna!
		deity Khhh- This feels strange!<br>Why would a body function this way? Why would such a hole even be so sensitive?<br>Why would my s... "Swingers" tingle to such... <i>Oppressive</i> weight pressing atop them?
		player pent Mhh, your butt's really soft... Downright magical...
		deity A-are you suggesting I spent energy on plumping my rear end?<br>I w-would never do something so s-selfish...!<br>Ah, something's happening! I feel even warmer!
		player Good, I'll cum too... Even if I finish first, the smell of it will probably be enough to push you over the... Edge!
		im repeat1-6
		player forced Ghhhumming!
		deity love ...!
		player pent Hoh... Not my thickest, but not bad for a quick buttjob.<br>How are you feeling?
		deity ahegao Ahah~! The smell! It... Breaking me!
		t As you take a step back he tries to lap up some of the cum you spurted onto his ass, only to find himself spinning in a circle.
		t Not so much chasing his tail as trying to chase the cum on it, but still, it's quite cute.
		player laughing Haha~! You're so silly!<br>Actually, is this the first time you've just played around since you woke up?
		deity love Ah- M-must- W-want-<br>W-whoa... I'm feeling quite dizzy...
		player amused Here, let me clean you off. If you're a good doggy I'll let you have more.
		deity G-good... Dog...?
		t He stops spinning and lets you clean off his fur. His earlier mature attitude seems to have fallen away.
		t ...
		deity tired Mghh...<br>So... Tired...
		player sleep Then rest. You need sleep too, little buddy.
		deity Will you come visit me again?
		player joy Of course! In fact, you'll definitely need your rest if you want to play with me again later!
		deity sleep Alright... I'll... Zzz...
	`},
	//Image notes from the salvage: repeat2-1 visibly pent-up, needs tail wagging; repeat2-2 penis awe; repeat2-3 licking.
	//SALVAGE GAP: the scene breaks off after repeat2-4. repeat2-5 and repeat2-6 have no surviving text.
	{index: "feralOral", name: "mini", image: "deity/repeat2-1",
	content: `
		t You approach the shrine yet again, this time greeted by the sounds of soft thumping.
		im repeat2-1
		deity joy playerF!
		player amused Somebody sure is excited to see me.
		deity laughing It's me! I'm excited!<br>Ah, did you collect the next gemstone for the ritual?
		player confused Well, before that...<br>Maybe we should deal with the side effects of the first one?
		deity pent Oh. I suppose that makes sense.<br>Yes, it's quite obvious I've been having trouble managing my form, isn't it?
		player happy The throbbing dick did tip me off a bit. And the tail wagging too.
		deity happy No, I'd be doing that anyways, your company is delightful.
		player sparkle D'awww, you cute little flatterer! Okay, just for that I'll play with you as long as you want!
		deity blushy A-ah, well, by "play" do you mean-
		im repeat2-2
		deity love H-hooooaaawww~
		player excited You liiiike~?
		deity It's so warm~<3<br>It's like something inside me is trying to match it too, I'm burning up~<3
		t He takes a slow, long lick, letting your sweat build up on his tongue before changing sides.
		deity excited Ahahah~<3<br>Hah haar hae ee-en ooin~?<br><i>What are we even doing~?</i>
		player amused I have no idea what you're trying to say... Ghnnng...
		im repeat2-3
		player seductive I'm glad you're having fun.
		deity awe A-ahhh... S-so much... Wasted...
		player pent Don't feel too bad, we should take it slow, it's your first time-
		deity love ...
		player befuddled Why are your eyes glowing?
		im repeat2-4
		deity panic What am I doinggggg?!<br>Why am I wasting the energy on this?!
		player pent You can pull off if you-
		t He does not pull off.
		im repeat2-5
		player orgasm Hohhhh~!
		deity ahegao GHHHHLLK~!
		im repeat2-6
		deity broken Hahh... Hahhh...
		deity pent That was... I wasted... So much...
		player happy You didn't waste it. You had fun.
		deity broken Buh.. But...
		player sleep Relaaax, it's fine, it's fine. Maybe you should take a nap.
		deity tired I... Nap... Sounds nice...
		player amused See you later little buddy.
	`},
	//Image placement is a guess from the prompt sidecars: dream2-1..3 carried no text in the salvage
	{index: "feralMorning2", name: "mini", image: "deity/dream2-1",
	content: `
		t Meanwhile, at the forest shrine...
		im dream2-1
		deity nightmare ... Ghh... Hah... playerF... W-why are... Are you t-touching... Ngh~!
		im dream2-2
		t A thick, probably mystically enhanced SPLRRRRCH sounds off as deityF paints the staircase of his altar.
		deity pent Ghhh, hhh... Huh? Ouhhh...
		im dream2-3
		deity pent A-again... Why is this happening?<br>It's a good thing I rested outside tonight, to paint my beloved home's floor with such slop...
		deity befuddled ... Eh? Why did that cause my nethers to twitch?<br>Was it something I said?<br>But I used such a revolting phrase, surely I would not be aroused by simple words like "squirt" and "slop"-
		deity panic A-ahhh... Again? B-but I <i>just</i> evacuated my testicles...<br>It doesn't even feel good to touch right now, I'm sore and aching from... C-cumming.
		deity scared ... Just saying that arouses me as well?!
	`},
	//Clean cuts. Each image sits on the same beat as the matching image in the feral cut.
	{index: "cleanPetting", name: "mini", image: "deity/sfw/repeat1-1",
	content: `
		deity confused ... You want to pet me? To stroke my fur and rub my ears?
		player happy Thanks for recapping what I just said, sometimes my brain blacks out connecting my ideas to my actions.
		player sparkle But yes, pets!
		deity sleep I see. Please, feel free. In time long past, petting me was considered to bring people great fortune.<br>Most people were quite hesitant though, some were even scared-
		im deity/sfw/repeat1-1
		deity blushy Gweeehh-
		player sparkle "Gweeehh" he says! So cute, and so fluffyyyy~!
		t It's like your hands are sinking into marshmallows. Warm marshmallows, fresh out of a campfire that is also a god.
		deity sleep Mrghh... Ah, there'sh shomething you should know...
		player happy Uhuh, uhuh, what's up?
		deity sleep My transhformations- Have been- Not working properly-
		player confused Huh?
		deity tired Bwehh... Thank you for stopping...<br>As I mentioned before, I'll eventually have enough power to return to my true form, but...<br>For some reason I've found my body changing even when I'm not actively trying to.
		im deity/sfw/repeat1-2
		deity worried I think that because the artifact we've been using was meant for creatures of excess, some side effects have come along with the energy you've given me.<br>That's just my theory though.
		player worried Look behind you.
		deity confused Alright, wha-
		deity scared Aaaaat?! Is that... A second tail?!
		player confused I thought your true form was supposed to have tails?
		deity awe Not like this! A true tail is earned through centuries of devotion a-and-<br>Well... Actually... I mean, I suppose I did sleep through a few of those centuries, but this one is barely a tuft!<br>Th-that is simply...
		t His voice drops down to a whisper as he comes up closer to you.
		deity panic E-embarrassing...
		player amused You know that first gemstone came out of a guy's butt, right? Weird is kind of our baseline.
		im deity/sfw/repeat1-3
		player happy Also, it's wagging.
		deity panic No?! It most certainly is not! Wagging is something mortal dogs do when they are pleased, it is an instinct, a base impulse of the flesh!
		deity scared I have been elevated as the guardian of these lands, I cannot be pleased by something as simple as-
		player sleep Calm down, relax. Don't worry, there's a super easy way to test.
		deity amused A-ah, thank goodness. That will clear things right up then, and we can start investigating causes that actually make sense. Perha-
		deity panic -Aaaa- Why are you-
		im deity/sfw/repeat1-4
		deity scared Why are you bowing at me?!
		player confused It's a play bow. To see how it makes you feel?
		deity panic It's... Exciting! Very exciting! My whole body is...<br>Ah...
		deity blushy Oh... This is not good, not good at all... Could this be a side effect of the artifact?<br>Or perhaps it was my own mistake, maybe I transformed... Too...
		deity tired Gh... It's very hard to think like this...
		player happy I know just the thing to help!
		im deity/sfw/repeat1-5
		deity surprised Ghhheee! Eh? Wait, but I'm a deity!
		player happy Yep! And every deity has a spot. Yours is right above the tail. Tails. Now that you've got a spare, I should probably scratch both.<br>Just think scratchy thoughts and try to relax, like you're in a sauna!
		deity shock Khhh- This feels strange!<br>Why would a body function this way? Why would my leg even kick on its own?<br>Why would my s... "Spare" tingle at such... <i>Relentless</i> scratching?
		player sleep Mhh, your fur's really soft... Downright magical...
		deity panic A-are you suggesting I spent energy on fluffing my coat?<br>I w-would never do something so s-selfish...!<br>Ah, something's happening! My legs, they're-
		player happy Good, let it happen... Even if my arm gives out first, you're about to experience a forbidden technique...
		im deity/sfw/repeat1-6
		player sparkle Ten Thousand Scritches!
		deity joy ...!
		t deityF bolts. One moment he's under your hand, the next he's tearing laps around the shrine so fast the fire bowl flickers every time he passes it.
		player sleep Hoh... Not my fastest, but not bad for a quick scritch.<br>How are you feeling?
		deity laughing Ahah~! The tails! They're... Right there!
		t He lunges for his new tail, only to find himself spinning in a circle.
		t Then the old tail, then the new one again. Not so much chasing his tail as refereeing a dispute between two of them, but still, it's quite cute.
		player laughing Haha~! You're so silly!<br>Actually, is this the first time you've just played around since you woke up?
		deity sparkle Ah- M-must- C-catch-<br>W-whoa... I'm feeling quite dizzy...
		player amused Here, sit still. If you're a good doggy I'll let you have more.
		deity confused G-good... Dog...?
		t He stops spinning and lets you comb the leaves out of his fur. His earlier mature attitude seems to have fallen away.
		t ...
		deity tired Mghh...<br>So... Tired...
		player sleep Then rest. You need sleep too, little buddy.
		deity sleep Will you come visit me again?
		player joy Of course! In fact, you'll definitely need your rest if you want to play with me again later!
		deity sleep Alright... I'll... Zzz...
	`},
	//The feral cut breaks off after its fourth image, so repeat2-5 and repeat2-6 have text only here
	{index: "cleanPlaytime", name: "mini", image: "deity/sfw/repeat2-1",
	content: `
		t You approach the shrine yet again, this time greeted by the sounds of soft thumping.
		im deity/sfw/repeat2-1
		deity joy playerF!
		player amused Somebody sure is excited to see me.
		deity laughing It's me! I'm excited!<br>Ah, did you collect the next gemstone for the ritual?
		player confused Well, before that...<br>Maybe we should deal with the side effects of the first one?
		deity worried Oh. I suppose that makes sense.<br>Yes, it's quite obvious I've been having trouble managing my form, isn't it?
		player happy The second tail did tip me off a bit. And the wagging. In stereo.
		deity happy No, I'd be wagging anyways, your company is delightful.
		player sparkle D'awww, you cute little flatterer! Okay, just for that I'll play with you as long as you want!
		deity blushy A-ah, well, by "play" do you mean-
		im deity/sfw/repeat2-2
		t You produce a rope toy. You aren't sure from where. You've learned not to question your pockets.
		deity awe H-hooooaaawww~
		player sparkle You liiiike~?
		deity sparkle It's so chewable~<br>It's like something inside me is trying to bite it too, I'm burning up~
		t He clamps down on the far end and pulls, letting out a growl roughly as threatening as a teakettle.
		deity joy Ahahah~<br>Hah haar hae ee-en ooin~?<br><i>What are we even doing~?</i>
		player amused I have no idea what you're trying to say... Ghnnng...
		im deity/sfw/repeat2-3
		player happy I'm glad you're having fun.
		t Little red sparks drift off of his fur with every tug, fizzling out in the grass.
		deity awe A-ahhh... S-so much... Wasted...
		player worried Don't feel too bad, we should take it slow, it's your first time-
		deity sparkle ...
		player befuddled Why are your eyes glowing?
		im deity/sfw/repeat2-4
		deity panic What am I doinggggg?!<br>Why am I wasting the energy on this?!
		t He yanks the rope clean out of your hands.
		player surprised Wah!
		im deity/sfw/repeat2-5
		t And then he's gone. A black and red streak tears around the clearing, through both torii gates, around the fire bowl and back again, rope streaming behind him like a banner.
		deity panic I can't stop! My legs are fetching of their own accord!
		player sleep You're not fetching. Nobody threw anything.
		deity scared Then throw something so I can stop!
		t You throw a pinecone. He catches it midair, lands, and immediately sprints off to bury it.
		player amused That one's on me.
		im deity/sfw/repeat2-6
		t ...
		t Some time later, the two of you are flopped in the grass. deityF is panting, filthy, and hugging the rope like it owes him money.
		deity tired Hoo... Hoo...<br>That was... Undignified.
		player happy You had fun, though.
		deity sleep ...
		deity blushy ... I did. I'm not even certain the energy was wasted, I feel lighter somehow.<br>Please do not tell trapF about this.
		player happy trapF's been watching from that tree the whole time.
		deity shock ...
		deity tired ... Of course he has.
	`},
	{index: "cleanMorning2", name: "mini", image: "deity/sfw/morning2-1",
	content: `
		t Meanwhile, at the forest shrine...
		im deity/sfw/morning2-1
		deity tired ... It certainly was a good idea to rest outside of the house for a moment.<br>I shudder to think what my home would look like if I were to dig such holes inside...
		im deity/sfw/morning2-2
		deity befuddled ... Eh? Why did that cause my paws to twitch?<br>Was it something I said?<br>But I used such a dull phrase, surely I would not be excited by simple words like "dig" and "bury"-
		deity panic A-ahhh... Again? B-but I <i>just</i> dug up half the clearing...<br>It doesn't even feel good anymore, my paws are sore and aching from... D-digging.
		im deity/sfw/morning2-3
		deity scared ... Just saying that makes me want to dig as well?!
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