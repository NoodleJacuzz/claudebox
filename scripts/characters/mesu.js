var character = {index: "mesu", flags: "", fName: "Marlow", lName: "", color: "#C4B6BF", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "male"};

var logbookArray = [
	"im images/mesu/clothed/happy; im images/mesu/nude/happy; title Skittish; mesuF's days in town are usually spent either totally shut-in at home or darting about from place to place across town, seemingly with no inbetween. He's seen as a bit of a mystery, but he's always got a smile on his face.<br>Some townsfolk say he's actually been to the big city before, but he's always quick to change the subject when it comes up, often getting blushy and stuttering over it.",
	"im images/mesu/logbook2.png; title Shirt & Tie; He previously lived in the big city, causing his heat to trigger and his body to change. Even after moving back to town and getting his heat under control, he still has a few quirks from the experience.<br>His preference towards professional attire is one small part of this, but only because it contrasts with his love of wearing tight thighhighs, usually in a highly contrasting color to his fur.<br>As one of the few people to have been outside the town's limits, he's completely aware of how lewd it is that everyone walks around exposed from the waist down all the time.",
	"im images/mesu/logbook3.png; title Pathetic Pecker; Although he acts collected, inwardly he's a complete sissy cuck who loves the idea that his tiny shrimplette of a penis is always on full display. <br>It's definitely embarassing, especially when he manages to get erect. Luckily he's so small that most people don't notice, and even assume that when he presses his legs together it's just a nervous tic.<br>But of course the real reason is so that he can feel his tiny grapes being squeezed between his thighhighs, causing him to leak precum absolutely everywhere and making him all the more eager to head home.",
	"im images/mesu/logbook4.png; title Complete Anal Addict; When one of the townsfolk goes into heat and they have a penis, they'll instinctually try to challenge other males for dominance. Failure means being a submissive to the dominant partner, and regularly engaging in submissive behavior will only further 'ruin' their identity as a male.<br>In mesuF's case, there's no sugarcoating it, mesuF is an absolute and complete anal queen who is one-hundred percent aware that his anal masturbation hobby is converting him into a shrimp-dicked loser who could squirt just from sniffing some human schlong.<br>If his pin-dick wasn't enough proof of this, his plump anus has a slight but permanent gape, and is always ready for a dick of any size. It's so sensitive he might be the only resident of Syrup Town who'd be able to get off from his cocklette's length, let alone something of your size.",
];

var achievementArray = [
	{index:"91"+character.index+"Friend", frame: "ultraRare", name: "Squirrel's BFF", requirements: "?trustMin "+character.index+" 7;", description: "Appreciate mesuF's wimpy side and become best friends.", image: "mesu/achievement1",},
];

var itemsArray = [
];

var shopArray = [
];

var pickupArray = [
	{index: "mesuClothes", requirements: "?flag mesu House; !item Business;", top: 30, left: 20, event: true, size: 10, image: "items/question"},
];

var morningArray = [
	{index: "mesu2", priority: 99, requirements: "?trust mesu 2;", unique: false,},
	{index: "mesuMorning-mayor", requirements: "?trustMin mesu 1; ?trustMin mayor 1;", unique: false,},
	{index: "mesuMorning-shopkeep", requirements: "?trustMin mesu 1; ?trustMin shopkeep 1;", unique: false,},
	{index: "mesuMorning-carpenter", priority: 1, requirements: "?trustMin mesu 1; ?trustMin carpenter 1;", unique: false,},
	{index: "mesuMorning-wolf", requirements: "?trustMin mesu 1; ?trustMin wolf 1;", unique: false,},
	{index: "mesuMorning-sadogato", priority: 1, requirements: "?trustMin mesu 1; ?trustMin sadogato 1;", unique: false,},
	{index: "mesuMorning-milf", priority: 1, requirements: "?trustMin mesu 1; ?trustMin milf 1;", unique: false,},
	{index: "mesuMorning-nun", priority: 1, requirements: "?trustMin mesu 1; ?trustMin nun 6;", unique: false,},
	{index: "mesuMorning-fash", priority: 1, requirements: "?trustMin mesu 1; ?trustMin fashionista 1;", unique: false,},
	{index: "hot-1", priority: 1, requirements: "?trustMin mesu 3;", unique: false,},
	{index: "bath-1", priority: 40, requirements: "?trustMin mesu 3; ?urethral;", unique: true,},
	{index: "morningSilly", priority: 1, requirements: "?trustMin mesu 4;", unique: false,},
];

var encounterArray = [
	//{index: `placeholder`, name: character.index+`F test`, requirements: "?location pineconePlaza;", altName: "", altImage: "",},
	{index: `intro`, name: `Someone's walking home`, requirements: "?location willowWalk; ?trust mesu 0;", altName: "", altImage: "",},
	{index: `mesu1`, name: `You have a strange feeling`, requirements: "?location pineconePlaza; ?trust mesu 1;", altName: "", altImage: "",},
	{index: `mesu3`, name: `Look out your window`, requirements: "?location playerHouse; ?trust mesu 3;", altName: "A Normally Lovely View", altImage: "mesu/mesu2-1",},
	{index: `mesu4Start`, name: `The squirrel boy is here!`, requirements: "?location pineconePlaza; ?trust mesu 4;", altName: "", altImage: "",},
	{index: `mesu5Start`, name: `Someone's knocking!`, requirements: "?location playerHouse; ?trust mesu 5;", altName: "", altImage: "",},
	{index: `mesu6Start`, name: `mesuF is here!`, requirements: "?location lavenderLane; ?trust mesu 6;", altName: "", altImage: "",},
	{index: `statusQuoIntro`, name: `mesuF's place is here`, requirements: "?location pineconePlaza; ?trustMin mesu 7; !flag mesu statusQuoIntro;", altName: "", altImage: "",},
	{index: `House`, name: `Visit mesuF's place`, requirements: "?location pineconePlaza; ?trustMin mesu 7; ?flag mesu statusQuoIntro;", altName: "", altImage: "",},
	{index: `pill-mesu`, name: `You could duck into the alleyway!`, requirements: "?location pineconePlaza; ?trustMin mesu 7; ?holiday pill; ?flag carpenter wallIntro;", altName: "", altImage: "",},
	{index: `cherry-mesu`, name: `Let's visit mesuF!`, requirements: "?location pineconePlaza; ?trustMin mesu 7; ?holiday cherry;", altName: "", altImage: "",},
];

var sceneArray = [
	{index: `intro`,
	content: `
		mesu blush Ah!
		im intro1
		player love <i>That tail! Holy macaroni, the fluff!<br>I need to introduce myself!</i>
		mesu love Hu-hum... A hu-
		player happy Hi, my name's playerF!<br>What's yours?
		mesu altName ???; H... Ahh... M-mmmuh... <input type='text' id='nameSubmission-mesu' value='mesuF'>...
		button Continue; renameCharacter('intro2')
	`,},
	{index: `intro2`,
	content: `
		mesu blush Ah, ahhh...
		player worried <i>Hmm. Guess he wasn't prepared at all for the heat.<br>Though, that's pretty obvious, looking at his...</i>
		im intro2
		player <i>The little guy's overwhelmed, really shy, or both.<br></i>Well, I'll give you some space. Nice meeting you!
		t You decide to leave the squirrely boy to his own devices, and continue on your way. 
		eval setTrust('mesu', 1)
		eval passTime()
		finish
	`,},
	{index: `mesu1`,
	content: `
		player worried Hmm... This feeling.<br>Something's wrong.
		t The hairs on the back of your neck are standing up. Nobody's around, but you definitely feel perceived right now.
		player worried It feels like somebody...
		player fury Wants to sell me something!
		t You turn around as sudden as you can, but there's nothing to be seen. Not a salesman, not even so much as a tumbleweed.
		player worried <i>Wait, this is a nice town. They wouldn't have pushy salesmen <i>or</i> tumbleweeds around here.<br>Maybe I just need some rest...</i>
		t ...
		im mesu1-1
		mesu love Hohh, hohhh...<br><i>*He's right there, the human~<br>So close, I can taste *his sweat on the air~</i>
		mesu forced Ghhh~<br>N-need to... Calm down...<br>Approach... Without head breaking...<br>Save the... Orgasm for... Ghh~
		mesu Keep... Hands... Away...<br>Need to... Think of a way... 
		eval setTrust('mesu', 2)
		eval passTime()
		finish
	`,},
	{index: `mesu2`,
	content: `
		t It's a brand new day in Syrup Town!
		t And a quiet one too. One where you find yourself unusually energetic. You slide out of bed without a care in the world!
		t Well, aside from caring about fluff, of course.
		player sleep Mmmgh, what a great rest~!<br>I really should thank carpenterF for that-
		eval writeEvent('mesu2')
		t ...
		player happy Alright! Time to start the day!
		eval setTrust('mesu', 3)
		eval unencounter('mesu')
		finish
	`,},
	{index: `mesu3`,
	content: `
		im mesu2-1
		player scared KYAAAH!
		player crying I scared myself with the note a second time...!<br>Wait a second... Anything I can scare myself with twice <i>can't</i> just be one of my delusions...<br>This must be real!
		player worried Well, I guess I need to take threats seriously...
		t You open the window and tug at the wet paper, only for it to crumble in your hand.
		player befuddled Hey, wait a second...<br>This doesn't smell anything like tears of rage...<br>This is <i>clearly</i> boysmell! Fluffy, sweaty boysmell!
		player tired ... I really need a straightman to bounce off of for when I say things like that.
		player surprise Wait a second!
		im mesuSepia
		player That squirrel boy was wearing a dress shirt! And a tie! They'd make the perfect straightman!<br>Not to mention I can check on how he's handling his heat!
		player excited And maybe rub my face in that wonderful tail of theirs for good luck~
		t Having completely forgotten about the threatening note, you decide to focus on the important things in life.
		eval setTrust('mesu', 4)
		eval unencounter('mesu')
		finish
	`,},
	{index: `mesu4Start`,
	content: `
		eval writeEvent('mesu4Start')
	`,},
	{index: `mesu4a`,
	content: `
		eval writeEvent('mesu4a')
	`,},
	{index: `mesu4b`,
	content: `
		eval writeEvent('mesu4b')
	`,},
	{index: `mesu4c`,
	content: `
		eval writeEvent('mesu4c')
	`,},
	{index: `mesu4F`,
	content: `
		eval writeEvent('mesu4F')
		eval setTrust('mesu', 5) !flag player gallery;
		eval passTime(); !flag player gallery;
		eval unencounter('mesu');
	`,},
	{index: `mesu5Start`,
	content: `
		mesu happy Yo! Sorry to drop by so late. ?time Night;
		mesu happy Yo! Sorry to drop by so late. ?time Evening;
		mesu happy Yo! Good morning, I tried to visit last night, but you slept through my knocking. ?time Night;
		player scared ...!<br>Y... Yuh... You're no... A ghost?!
		mesu befuddled Eh? No. If I were a ghost my AC bill would be a lot lower.
		player worried Oh... Sorry. Just, wasn't expecting you so soon.
		mesu amused No problem. I'm a chipmunk, by the way.
		player confused ...?
		mesu happy You called me a squirrel as we were finishing up last time. Similar ancestral line, but the difference means a lot to me.
		player shock You remember all that?!
		mesu worried Yeah? I mean, I was a little fuck-drunk, but you weren't anywhere close enough to give me brain damage or anything.
		mesu happy Anyways, since you're new here and since you seemed a bit... Freaked out, during our last meeting, I just thought I'd make sure everything's all crystal clear. 
		trans mesu5a; Properly introduce yourself
		trans mesu5b; Did he actually enjoy that?
		trans mesu5c; Does he like nuts?
		trans mesu5d; Is it safe to be here so soon?
	`,},
	{index: `mesu5a`,
	content: `
		player happy Real quick, proper introduction time. The name's playerF, nice to meet you.
		mesu happy mesuF, likewise.
		t He takes your hand and matches your firm handshake. 
		t Despite being a bit sweaty, he's quite cool and collected. All traces of his previous degeneracy are gone in an instant.
		mesu excited ... Ehehe~<br>Human hands are so nice~
		player worried <i>He really turns on a dime... </i>
		eval addFlag('mesu', 'mesu5a')
		trans mesu5a; Properly introduce yourself !flag mesu mesu5a;
		trans mesu5b; Did he actually enjoy that? !flag mesu mesu5b;
		trans mesu5c; Does he like nuts? !flag mesu mesu5c;
		trans mesu5d; Is it safe to be here so soon?
	`,},
	{index: `mesu5b`,
	content: `
		player worried You said you were a "little fuck-drunk", does that mean you actually wanted... All that?
		mesu excited Ehehe~<br>Absolutely, and more, if you have it.<br>While I lived outside of Syrup Town, I was way too meek and timid. Even as my heat was driving me crazy...
		mesu pent I spent all my time inside, trying to get off however I could, as intensely as I could.<br>Humans just passing by the window, the sounds of mating coming from other rooms, and ho-ly fuck did I ever dive headfirst into online porn.<br>It kept getting more intense, and when I realized I was getting off thinking about how much I wanted big, strong arms to choke the shit out of me, I got scared. Ran back here.
		player shock Oh! That's so-
		mesu flirting But now I've learned my lesson~<br>There's nothing scarier than a life wasted not getting treated as worthless, <i>beneath</i> a human.<br>I'm so glad you're here, and that you picked me, whatever you want, I'll happily oblige. Fuck me, hurt me, pick me up and literally use me as a living dishrag, I promise I'll beg for more~
		player scared ...! I would never! You'd get dirty food bits in that beautiful fur!
		mesu befuddled Uh... Yeah?
		eval addFlag('mesu', 'mesu5b')
		trans mesu5a; Properly introduce yourself !flag mesu mesu5a;
		trans mesu5b; Did he actually enjoy that? !flag mesu mesu5b;
		trans mesu5c; Does he like nuts? !flag mesu mesu5c;
		trans mesu5d; Is it safe to be here so soon?
	`,},
	{index: `mesu5c`,
	content: `
		player happy Hey, since you're a squ-<br>Chipmunk, do you like nuts?
		mesu excited Yours? Oh, absolutely, 'like' isn't even close to strong enough~
		mesu worried But in all seriousness, I do have a mild peanut allergy. Other nuts are fine, it's just legumes, and it's not all that serious.
		player happy Uh-huh, okay, just legumes. Lemme mark that down as "very important". Okay. 
		eval addFlag('mesu', 'mesu5c')
		trans mesu5a; Properly introduce yourself !flag mesu mesu5a;
		trans mesu5b; Did he actually enjoy that? !flag mesu mesu5b;
		trans mesu5c; Does he like nuts? !flag mesu mesu5c;
		trans mesu5d; Is it safe to be here so soon?
	`,},
	{index: `mesu5d`,
	content: `
		player confused You're back to your senses pretty quickly. Is it safe to be near me so soon?
		mesu sleep Ah, actually, I've already been through my heat.<br>I used to live out in the city. Things were pretty crazy when it first triggered, but eventually I learned to get used to having a libido.<br>Now, as long as I keep it satisfied things aren't too bad.
		player worried Oh, I guess that means you don't need my help, huh?
		mesu befuddled ...?
		player happy mayorF says I should try to spend time and spread my pheromones around townsfolk to trigger their heat. If you're already-
		mesu scared NO! PLEEEEEASE-!
		player shock Wah!
		mesu Please, no! I just got a <i>taste</i> of the good stuff! Don't make me go back to the way it was before!<br>I could barely cum once a month, I can't go back!<br>I'll do anything, <i>be</i> anything you want! If you ever need a seat, a mat to wipe your feet on, a punching bag, if you need to use the bathroom in the-
		player sleep Lemme stop you right there. There's only one thing I need.
		mesu horny Yeah? Yeah?!
		trans mesu5e; Friendship!
		eval removeFlag('mesu', 'mesu5a')
		eval removeFlag('mesu', 'mesu5b')
		eval removeFlag('mesu', 'mesu5c')
	`,},
	{index: `mesu5e`,
	content: `
		mesu befuddled ... Friendship?
		player sparkle Absolutely! You seem like a nice person, and you're way less nervous than when we first met!
		mesu pent I was having trouble speaking, I've been pent up way too long.<br>When a male of my species goes into heat, we challenge whatever dominant male we can find. If we can't find one, or lose, well...<br>It's pretty obvious, but I'm about as subby as a bottom gets.<br>I keep it in check through regular, very, very regular self-love, but...
		mesu excited It's like my body <i>knew</i> a human, a real human, was coming to town, and it just wouldn't be satisfied with anything less~
		player befuddled Wait, doesn't that mean everyone else in town will go nuts with heat too?
		mesu Ehehe~<br>Maybe they'll get used to it like I did, but at least at first the townsfolk here are gonna be-
		player sparkle So doesn't that mean you'll be the most composed, professional person in town?
		mesu curious I... Guess so? By default?
		player So my goal of the goofball and straightman buddy duo is still alive!
		mesu befuddled ... "Straight"? 
		player worried Y'know, actually, I don't know why my brain latched onto that so hard.<br>Maybe it's because I'm trying not to worry about that threatening letter I got...
		mesu scared Threatening letter?! 
		player cry Yeah, it was super scary!
		mesu fury That's horrible! I knew some folks here were nervous about a human moving to town, but to go that far...<br>I'll talk to mayorF about this right away! Are your locks okay?
		player surprise ...! I don't think I actually have any!<br>Thanks mesuF, I'll check all the windows and doors now!
		t You take off, searching your home while mesuF angrily heads out. mayorF might not be in her office right now, but this certainly constitutes an emergency!
		mesu angry ...
		mesu worried ... Wait. Letter? *He couldn't mean...
		eval setTrust('mesu', 6)
		finish
	`,},
	{index: `mesu6Start`,
	content: `
		eval writeEvent('mesu6Start')
		eval editSkill("dominance", 1);
	`,},
	{index: `mesu6Finish`,
	content: `
		eval writeEvent('mesu6Finish')
		eval setTrust('mesu', 7)
		eval passTime();
	`,},
	{index: `mesuMorning-mayor`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town except for a local census data collector, hard at work. 
	mesu And that's why I need your average orgasm length.
	mayor worried mesuF, when you came in here asking sexually charged questions under the guise of a census, I thought you had finally snapped from the heat...
	mayor joy So it's a good thing that explanation was entirely sensible! Anyways, I haven't timed it exactly, but I want to say my average orgasm is just a few seconds long.
	mesu I see! I see, I see. Would you be able to measure it directly?
	mayor worried Ah...
	mesu worried Is there an issue?
	mayor pent Well, it's just that I've been going through a bit of a, um... Rise, lately. Since the human moved to town. That may throw off the count.
	mesu amused Oh, that's not an issue. What would you say is the length now?
	mayor horny Er... It's... Well, I have a hard time telling when it stops...
	mayor blush When I finally hit climax it's like it all just oozes out of me, and I'm squirting for over a full minute! But I can't stop playing with myself and sometimes I'll feel what I think is a second orgasm crashing into the first...
	mesu amused Ah, and the overlap-
	mayor pent  Ghh~<br>Seriously, just thinking... About...
	mayor torogao Nghh~
	mesu shock D-did... Did you just cum?
	mayor blush N-nooooo~ No no no~<br>Don't be silly~! Nothing happened, and if anything <i>did</i> happen, it was just an excited bit of... Pre-fun leakage.
	mesu worried With that kind of volume... And orgasms that can last over a minute...
	mayor blush D-did you say something?
	mesu amused Just that I was about to leave. If you have a chance to time one of your orgasms, at least as best you can, please send me the data.
	mayor excited Mhm~<br>I can do that real soon...
	

		trans cancel; Finish
	`,},
	{index: `mesuMorning-shopkeep`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town except for a local census data collector, hard at work. 
	mesu And so that's why I need the resting, maximum, and stretched diameter.
	shopkeep Alright, resting is cheap, maximum is gonna cost you, and stretched is way out of your price range. A girl's got her sensitive points.
	mesu worried Oh... I was hoping, since this would benefit the community...
	shopkeep worried How exactly would statistics about my puckered butthole help the community?!
	mesu sparkle Oh, I'm so glad you asked! Alright, first we need to go all the way back four hundred years ago to the-
	shopkeep amused I'm charging by the second for this.
	mesu shock ...!
	mesu sparkle Totheinventionofaspecifictypeofforensics....
	shopkeep worried This was a mistake...	
		
		trans cancel; Finish
	`,},
	{index: `mesuMorning-carpenter`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town except for a local census data collector, hard at work. 
	mesu And so that's why I need to know!
	carpenter worried N-no. I'm not letting you touch them.
	mesu pout But the sensitivity! I don't even know if you have them!
	carpenter scared Is entirely normal! There's nothing abnormal about them! And I definitely have them, that should be obvious!
	mesu tired I see... Sorry, we've been dancing around the subject for so long, I almost forgot that some people just aren't comfortable with their nipples as-
	carpenter confused Eh? Nipples? Oh, I thought you were talking about my ears. You can poke my nipples all you want.
	mesu sparkle Really? That's wonderful! Okay... I...
	mesu befuddled Wait, why were you so concerned about me touching your ears? Are they even more sensitive?
	carpenter worried I changed my mind, I'm leaving!
	mesu scared Wait! But... Science!
	
	
		
		trans cancel; Finish
	`,},
	{index: `mesuMorning-wolf`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town except for a local census data collector, hard at work. 
	mesu excited A-and so, that's why I could really use your input!
	wolf Darling.
	mesu excited Y-yes go- I mean wolfF?
	wolf sleep Are you trying to pull a fast one on me? You think I don't see right through the air you're putting on?
	mesu shock H-huh?
	wolf sleep Please. I see the signs that your tousled bedhead isn't what you woke up with. I see the stitching on that shirt hem. I see the design of those thighhighs, those pads...
	mesu excited E-eep!
	wolf sparkle You're a fashion expert, I can tell! We all have our areas of expertise, and I've never seen someone perfect the vibe of the adorable prey animal so well!
	mesu sparkle Really?!
	wolf happy Absolutely! I have a unique eye, I can see exactly how much effort you've put in to making all this look effortless!
	mesu sparkle Yes!
	wolf You're practically begging out to the world, "I'm here, take me now! Spirit me away!"
	mesu excited That's exactly it! That's just what I was going for!
	wolf You're a gem, mesuF. A ruby, at the very least. We're two precious stones shining, inspiring the world, "look at us", "we're here to be seen", "you wear clothes, we <i>own</i> them." I even notice those marks on your member.
	mesu shock ...!
	wolf Such dedication. To entrap yourself, likely shrinking your penis to such a state... Normal men would be so ashamed of that length, but you've thrown away all that, all the respect you could have earned, all for this image. You. Are. Beautiful. And I see you.
	mesu excited ...
	mesu torogao NGHHHH~!
	mesu ahegao ... Ouhhh~
	wolf Incredible. To use your own body as part of the display. I'm sorry, there's nothing I could teach you. I'd never even think to train myself to squirt on command to accentuate my vibe...<br>We walk our own paths, mesuF. I look forwards to reaching my own peak, looking out to the distance, and seeing you atop your own mountain. Good luck.
	mesu ahegao ...
	
		
		trans cancel; Finish
	`,},
	{index: `mesuMorning-sadogato`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town except for a local census data collector, hard at work. 
	mesu I see, I see, and this one?
	sadogato happy Oh, the swift rabbit! Why, this one-
	mesu *Snrk*<br>What a dick on that one, right?
	sadogato frown ... Is something funny?
	mesu Eh?
	sadogato Does it amuse you that the rabbit has a tiny member? It's meant to represent purity, a sign the rabbit's wit is unlabored by the weight of lust.
	mesu worried Ah, I was just joking around...
	sadogato All while waving your own joke around, uncaring of your hypocrisy. You come into my home? You ask for data on my sacred cards? You mock, trample, and deride Rabington Esquire?
	mesu worried You named him?
	sadogato ...<br>You have disrespected me and my house. For that, you will be punished.
	mesu shock Um...! I'm really sorry, I didn't mean-
	sado glare <b>Silence</b>.
	mesu excited ...
	sadogato frown You shall have plenty of time, and reason, to regret your actions. But for now, you will face punishment. Perhaps you do not realize your own member is pathetic, even compared to the rabbit? I know of a spell...
	sadogato angry A spell that will shrink that pathetic sack of yours even further. Trapped in an agony of lust with a pathetic shrimp too small to even masturbate with. <i>Then</i> will you mock him? Shall you, with a penis so small no woman will even look at you without laughing, still mock him?! Well?!
	sado glare <b>SPEAK</b>.
	mesu ahegao Yes mommy~!
	sadogato frown ...
	sadogato shock ... Eh?!
	mesu worried Eh?
	sadogato worried ... G-get out!
	mesu shock But the punishment-
	sadogato shock I forgive you, just leave!
	mesu But I didn't learn my lesson! I might do it again!
	sadogato angry Out!
	
		
		trans cancel; Finish
	`,},
	{index: `mesuMorning-milf`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town except for a local census data collector, hard at work. 
	mesu Mhmm.
	milf And they're just so huge and sensitive, I thank the stars and their garters my momma blessed me with her back muscles every night...
	mesu Yep... Okay, measurement's done.
	milf Hah... Thanks, I can't manage somethin' like that around these milkers. Wish I had em like yours...
	mesu shock Excuse me?
	milf You alright? I was meanin' your chest parts. I know boys don't got it bad in the same way, but I see yours budding 'neath that shirt.
	mesu worried I don't-
	milf worried Oh, darlin' and your glasscutters just start standin' right up without warnin' too, shug? When my just get achin' these girls stand at full attention. Actually, might even be larger than your peeper down there.
	mesu excited ...!
	milf worried Golly, I <i>wish</i> my girls were as adorable as that little guy down there, wavin' free without a care in the world. Guess it comes with some downsides though, huh?
	mesu excited I guess...
	milf worried Like, mayorF's been hootin' at me to hitch up, carry a child? Says hosin' out the girls will finally give me relief, but shackin' up with you would probably be a pipe dream, wouldn't it? Ain't no way my womb's reaching down far enough to drink that little baby's milk.
	mesu Nghh~
	milf Oh well. Good luck with the measurements. And take care of yer body. Dunno what's been changin's around town but early today I bumped my nub, mmgh, the right one here against somethin'? Thought I was in for the pain of the day, but, I dunno, I was seein' stars...<br>Well, not like you could really hit anything with they little guy downstairs, right?
	mesu Mm... Mhm~!
	milf happy Alright, you take care now! See ya darlin'!
	mesu torogao Th-thank you!<br>... Ffffuck...
	mesu ahegao N-need to get home... can't ruin my saved up anal orgasm...<br>Fuck, playerF moving to town has really fucked me up... I swear, I could probably even nut to the weird stuff now...
	
		
		trans cancel; Finish
	`,},
	{index: `mesuMorning-nun`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town except for a local census data collector, hard at work. 
		mesu Uh... Uhuh. Gotcha. 
		nun You're doing good work, little lamb.
		mesu Huh? Oh, thanks.
		nun Knowledge of the world we live in is important for obtaining perspective. And perspective is essential in knowing what really matters.
		mesu worried Right, the whole human worshipping thing, yeah.
		nun Mhm... But you don't need to be sold on that, do you? Not deep down, of course.
		mesu blushy ...
		nun Every part of your body screams at you to submit, to treat yourself as... <i>Sub human</i>.
		mesu excited L-lady... It's just... Just how I get off. It's a kink, I'm just submissive so I can cum better... It's just bedroom stuff.
		nun And when you're at your most desperate? When you'd give anything for fulfillment? That's the only time that really matters
		mesu excited I need an adult...
		nun sleep You are an adult. Start acting like it, and learn your place.
		nun teasing Bitch.
		mesu torogao Kghhh~!
	
		
		trans cancel; Finish
	`,},
	{index: `mesuMorning-fash`,
	content: `
	t You lay down for the night. Sweet dreams!
	t ...
	t Morning comes, it's a quiet day in Syrup Town except for a local census data collector, hard at work. 
	mesu horny Right, so, um... 
	fash flirting Oh please, do go on~ What does the survey need next?
	mesu blush It... W-well...
	fash smug Honestly, why even keep asking? If you want to measure my dick, I've got some measuring tape in the back. Knot thickness? Ooh, maybe it's time to focus on the rear? My, hmm, what did the lessons call it, 'fuckhole'?
	mesu excited W-well, to be h-honest, the chart's almost full...
	fash smug Oh? So I guess that's all the time I get with you this morning?
	mesu blushy Eep~!
	fash flirting Please don't hesitate to drop by tomorrow, I just <i>love</i> taking the time to help out the town. And I'm so pleased it just so happens to be you who's collecting the data~
	mesu forced I... Ghh, I have to go!
	fash Take care~
	fash smug ... There he goes. That's quite the bit of leakage there too.<br>I wonder why he needs to collect all of this data?
	fash flirting I guess it doesn't matter so long as I can have fun with him like that~<br>I hope he breaks soon, a small fry like that has got to have a lot of pent-up energy in that small frame.
	
	
		
		trans cancel; Finish
	`,},
	{index: `statusQuoIntro`,
	content: `
		eval writeEvent('statusQuoIntro')
		eval addFlag('mesu', 'statusQuoIntro')
		eval unencounter(data.player.currentCharacter)
		finish
	`,},
	{index: `statusQuo`,
	content: `
		mesu excited ...
		trans repeat2First; Ask to pet mesuF !flag mesu repeat2;
		eval writeQuoRepeats();
		cancel
	`,},
	{index: `mesuClothes`,
		content: `
		player confused So, this place...
		mesu flirting Great, isn't it? I pull some strings at the mayor's office every so often, help get the town a little extra funding, if you know what I mean. And-
		player I don't know what you mean at all.
		mesu worried ... Oh. Well, I was trying to sound cool and mysterious, but...<br>No, I just do some remote work, and it makes the town a bunch of money.<br>So mayorF gave the green light to whatever home modifications I wanted.
		player befuddled So you made it look like an office complex?
		mesu sparkle Yeah! I have cubicles, a water dispenser, I even have an office!
		player Why?
		mesu confused Y'know, I never really thought about it. I guess I kinda have a... Hmm.<br>It's like a fetish, but not sexual. If only there were a word for that...
		mesu sparkle Oh well! Hey, let's roleplay! I have an extra dress shirt and tie!<br>You can be the new hire, and I'll be the manager who needs to be bent over and taught his place!
		player scared Uh... Just so you know, I have an automatic crying response to being asked to file paperwork or being yelled at...<br>But I'll take the shirt though.
		eval addItem("Business");
		eval unencounter(data.player.currentCharacter);
		button Finish; generateHouse(data.player.currentCharacter);
	`,},
	{index: `repeat1First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval raiseTrust('mesu', 1);
		eval passTime();
		eval editSkill("dominance", 1);
		eval writeSpecial("You feel like you've grown more dominant...")
		finish
	`,},
	{index: `repeat1Repeat`,
	content: `
		im mesu/repeat1-1
		im mesu/repeat1-2
		im mesu/repeat1-3
		im mesu/repeat1-4
		im mesu/repeat1-5
		im mesu/repeat1-6
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `repeat2First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('mesu', data.player.currentScene.replace("First", ""));
		eval raiseTrust('mesu', 1);
		eval passTime();
		eval editSkill("dominance", 1);
		eval writeSpecial("You feel like you've grown more dominant...")
		finish
	`,},
	{index: `repeat2Repeat`,
	content: `
		im mesu/repeat2-1
		im mesu/repeat2-2
		im mesu/repeat2-3
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `wall1-1`,
		content: `
			eval writeEvent('wall1-1')
			eval addFlag('mesu', 'wall1')
			eval addFlag('carpenter', 'dailyWall')
			eval passTime();
			eval editSkill("dominance", 1);
			eval writeSpecial("You feel like you've grown more dominant...")
			finish
		`
	},
	{index: "pill-mesu", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval data.player.time = "Night";
		eval data.player.holiday = "";
		finish
	`},
	{index: "cherry-mesu", 
	content: `
		eval writeEvent(data.player.currentScene)
		eval passTime();
		eval data.player.holiday = "";
		finish
	`},
	{index: `hot-1`,
		content: `
			t It's a brand new day in syrup town...
			t And it's an absolute scorcher!
			im hot1
			mesu flirting Mggh~!<br>There we go, nice and snug.
			t Not that the chronically indoors sissy mesuF would notice. With such strong air conditioning, this is just a normal day for him.
			t ... Fat purple dildo in his ass included, of course.
			trans cancel; Finish
		`
	},
	{index: `bath-1`,
		content: `
			eval writeEvent(data.player.currentScene);
			trans cancel; Finish
		`
	},
	{index: `morningSilly`,
	content: `
		t "Work it love, work it love-"
		im morningSilly1-1
		mesu sparkle Don't you forget to twerk it, love!
		mesu pent Hoo~! Alright, morning workout finished, blood pumping, glutes and hams all tight tight tight!
		mesu excited Now, time to figure out today's plan to get absolutely booty-bruised~<3
		finish
		eval unencounter("mesu")
	`,},
	
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
	{index: "mesu2", name: "Plap Plap Plap", image: "mesu/mesu2-2", tags: "cbt",
	content: `
		player scared KYAAAH!
		im mesu2-1
		player What, who, h-huh?!<br>"I want you"? Who wrote this?<br>And what did they mean by this?
		player shock Wait, maybe they ran out of space... Maybe they meant "I want you gone, NOW!"
		player scared Oh jeez...<br>The ink's smudged, and the paper looks wet, I bet because they were crying tears of rage!<br>What should I do, these chubby arms of mine are meant for hugging fluffy creatures, not fighting...<br>Oh man, oh man...
		t Luckily for you, you aren't just any ordinary human, but a human born in and capable of survival in this cruel, cruel world. 
		t As panic begins to creep over you, a special defense mechanism begins to kick in. One forged from both nature and nurture...
		player sleep ... I must be hallucinating.
		t Complete and total denial! Yes, whether it's relaxing your body at the moment of being hit by a car, or being willing to eat potentially radioactive food while others starve, nobody is as good at completely denying reality like you!
		t ...
		im mesu2-2
		mesu perverted Ehehe~! Thank goodness I still have some brainpower left~<br>If the human comes to me... Ehehe~!
		im mesu2-3 ?fetish cbt;
		mesu perverted Mmmm~!<br>Plap plap plap~<br>N-now, what should I wear?<br>Something girly, to show my true nature?<br>N-no, I don't want to spurt <i>too</i> quickly, that means a chastity cage is right out too~<br>I could use a sounding cage, oh, but what if I just cum so hard that... No, no, this outfit will be fine~<br>Now I just need to wait until... Until...
		mesu befuddled Huh. It's pretty late in the morning, nobody would sleep this late, and they still aren't...
		mesu scared Crap! Did I remember to put my address on there? Or even my name?<br>Ghh, and I'm sweating so badly the paper might have fallen apart before they woke up!<br>No wonder they haven't shown up! 
	`},
	{index: "mesu4Start", name: "Winning his Affection - Start", image: "mesu/mesu4F", 
	content: `
		player sparkle There he is!<br>You there, hey, mesuF, right?
		t The fluffy, meek squirrel boi nearly jumps out of his skin as you run towards him.
		mesu shock Eh? H-huh?!
		t He seems taken aback. Thankfully though, he's not running away, which is a great sign!
		t But you notice him start to tremble, so while he looks better than past time, you probably don't have much time. 
		player joy I've been looking for you, you're just the person I need!
		t You decide not to bother explaining you mean "as the straightman to offset my goofy nature", and there was some other thing you think you're forgetting to bring up. But if you forgot it, it probably wasn't important.
		im mesu4-1
		mesu blush I... My... You... Want...
		t It looks like he's really struggling to get out each word, but he's not pulling away from your grasp.
		player sparkle Uh-huh? Yeah? 
		mesu Can't... Words... Hold back...!
		player joy No need to hold back! Just let it out, we'd be perfect together-!
		t And before you can manage out "as buddies"...
		mesu P-perfect! Together! Want!
		player sparkle Uh-huh, yeah, "want"? You want to be by my side too?
		mesu love S-step on me.
		player happy Pardon?
		mesu excited Step on me! I couldn't figure out what to say, or how to start, but now that you're here... Here for ME!<br>It's... Ghhehehe... So clear!<br>Step on me. On the pathetic, inferior twinkstick between my legs, or step on my face, or use me as a chair!
		player ... Okay, I like the enthusiasm, I think we might even be on the same page, but we're definitely reading different books.
		mesu perverted Yeah? Yeah?<br>What book are you on? Because we can do the harder stuff, I just need release first!<br>I need it, I <i>NEED</i> it, I <b>NEED</b> you~!
		t Very quickly your image of a potential professional straightman is being drowned out by the panting begs of the hypersexual turbopervert in front of you.
		t Heat is a very scary thing.
		player tired ... Okay. I guess this <i>is</i> kinda my responsibility.<br>I'll help you out and maybe we can have a proper conversation after.
		mesu excited Ooohh~! Here? In public? Yessss~!<br>Ah, I can't decide what I want~! What'll it be? Pleasepleaseplease I <i>need</i> something, anything, I'm so close and it's been so long! Feet? Oh, I want so badly to be abused and degraded~!<br>Ohhhh, but those incredible thighs, I bet they stay thick all. The. Way. Up~!!! Smother me between those-
		player scared I think I need an adult-
		mesu perverted I need one too, my face is adult-only priority seating, with a premium deep-cleaning feature~!<br>And by the end, I'll sputter out "thank you *sir, may I cum again~"! 
		mtrans mesu4a; Step on his face!
		mtrans mesu4b; Step on his weiner! ?fetish cbt;
		mtrans mesu4c; Sit on his face!
	`},
	{index: "mesu4a", name: "mini", image: "mesu/mesu4a-2", 
	content: `
		player pout Alright alright, settle down.<br>I take it you can't wait, sorry if your clothes get dirty, but lie down and I'll help you out.
		t ...
		im mesu4a-1
		mesu excited Ohhh ffffuck~<br>You're so cruel, you know how needy I am, and neither of our genitals get to play~
		player panic You're the one who suggested-
		mesu perverted And you're perfect for me~<br>God, every fucking inch of your perfect, <i>human</i> body is my altar of worship~! Watch me, I swear it, I'll pray to you just from worshipping a single one of your feet~!
		player scared By pray, do you mean cum hands-free from the degradation?
		mesu love It's like we were born for each other~<3<br>Mmm, *Mwah*, Mmmm~
		player laugh Wah! Whahahha, ahahaha~! Wait, that tickles!
		mesu excited Yes! Pull away, kick me, make me work for this~!<br>Treat me rough, give me a <i>taste</i> of what I'm in for, please, make my boypussy throb~!
		player Ahahaha~! St, stuh, stoooop, ahahaha~!
		mesu perverted Oof! Mmm, *Snfff*<br>Mmmm, *Mwah*~ Mmmhmhm~!
		player Ahaha, ahaha~! I'm! Gonna cry! Tummy h-hort, ahaha~!
		mesu orgasm Hohhhh~! Harder, kick harderrrrr~!
		im mesu4a-3
		mesu ahegao Aha~ Cumming~! Please, watch me squirt, watch my worthless twerp-stick show submission to you~!<br>Treat me like trash, this is how I'll beg for more if I'm fucked too stupid to beg with wordsss~<3
		player Haha, hahaha.... Hah...
		player panic Gyah! Are you okay?!
		im mesu4a-2
		mesu afterglow I've... Never been... Better... Happier...<br>Make me... Total bitch... Sissy... Worship, big, human... Cock...
		mtrans mesu4F; Continue
	`},
	{index: "mesu4b", name: "mini", image: "mesu/mesu4b-3", 
	content: `
		player pout Alright alright, settle down.<br>I take it you can't wait, sorry if your clothes get dirty, but lie down and I'll help you out.
		t ...
		im mesu4b-1
		mesu excited Yes, yesss~! Please, treat my worthless twimpdick like it deserves, worthless as the dirt underneath your feet!
		player worried I mean, I think it's kinda cute, actually.<br>And wow, this is a lot of precum...
		mesu pervert Mmmmhhh~! I feel so pathetic, this is amazing~! I <i>never</i> masturbate like a boy should, so my boyclitty is soooo sensitive, can you feel it pulsing, begging for mercy? It's barely as big as your toesss~<3
		player surprise Oh, s-sorry.
		im mesu4b-2
		mesu love Hohhhh, and you're even rewarding me with denial~! You knew my worthless shrimp, my crotch-pinky was about to squirt!<br>And the way you wave that fat, god-cock, I can barely hold back from sucking every drop of sweat off it!<br>Please, my balls, please please PLEASE I want you to make me impotent while that bitchbreaker taunts me and reminds me of my plaaaaace~!!!
		player panic Uh... Er... Do we have a safeword?
		mesu pleasured PLEASEEEE~<3
		im mesu4b-3
		mesu forced Fgghg~!<br>Harder, please, I need to cum, I've been masturbating like a good sissy, I need this so badly, p-please, puhleasureeeeee~
		player scared Huh?! But you're already...!<br>Oh jeez, oh man, please don't hate me when you snap out of this heat...
		mesu ahegao HARDER *DADDYYYY~<3!!!
		player panic Awawawa-!<br>Fine, then... Take this, and finish cumming already-!
		im mesu4b-4
		mesu orgasm GHOUUUUUUHHHH<br>PERMISSIONNNN~ A HUMAN GAVE MY WORTHLESS TRASH PIMPLE-WEENIE PERMISSION TO SQUIRRRRRT~
		player pent Hah... Hah.... Hah...
		player panic Gyah! Are you okay?!
		mtrans mesu4F; Continue
	`},
	{index: "mesu4c", name: "mini", image: "mesu/mesu4c-2", 
	content: `
		player pout Alright alright, settle down.<br>I take it you can't wait, sorry if your clothes get dirty, but lie down and I'll help you out.
		t ...
		im mesu4c-1
		mesu flirting Gmmmmmph~!<br>Mmm, yes, yesssss~<br>Use me as a chair, treat me like an object, I want to be <i>your</i> object~!<br>For months now I've degraded myself, hoping a human <i>*king</i> like you would come and treat me like worthless garbage, but now that you're here I don't mind being special if it means I get to be that fat ass's throne~!
		player panic You're... Really sure about this? You're okay back there?
		mesu perverted Pleeeease~<br>I'm better than okay, I can't take any more waiting~! I <i>need</i> you to take my breath away, to set my dignity on fire, I want to make love to that human shitpipe~!
		player scared Oh no.<br>You've completely snapped.<br>Okay, okay, don't think about his vocabulary, help out the fluffy boy so he can snap out of this, I can do this!
		t You take a breath and hover your absolutely packed bakery over the turboslut's waiting face.
		mesu Oh, I'm in love <3<br>Please marry me <3
		t *FLOP*
		im mesu4c-2
		mesu ahegao MMMMMMMMMGHHG<br>MMMM, *slrrrp* *slrrp*
		player pleasured Hoh! W-wow! That's... A strange sensation!
		t Almost out of reflex you lift back up a few inches, mesuF's head fights gravity as strings of saliva sag, connecting his face to your sweaty ass, and slowly his eager tongue is pulled out of your anus.
		mesu broken Mmmllah, hoh, make love to... Your asshole, I want to sink into that wall of meat and never surface, I want this donut rim, I want to suck face to asspussy~
		t He babbles, completely incoherently, he was likely mouthing these words into your butthole as he was working on his french kiss technique.
		t You take a glance and see his weenie is throbbing, but he hasn't cum. He isn't even masturbating!
		player pent I thought... This was to help you get off, to snap out of it...?
		mesu afterglow Hohhh~ I want to vacuum slurp those insides forever, lock lips with that anal ring, let me slurp, let me-
		t *FLOP*
		player I'll just! Have to trust! That you... Nghh... Can get off on this hands-free!
		mesu ahegao Mggggghhhhh-h-h-h~<3
		t You let yourself bounce, trying not to feel guilty for how much weight you must be putting on this poor squirrel's face...
		player forced Gh... Or... Maybe you have already...? Your penis is so small I might have missed-
		mesu orgasm MMMMMHOUUUUHHHGG<br><i>Clitty~! Degraded~! Want to... More~! Can't~!</i>
		im mesu4c-3
		player pleasured Oheeeee~!
		t You almost miss it because of your own jilted squeak, but that's it! It's a true hands-free sissygasm!
		player pent O-okay, okay, you came, hoh... Now we- Wah!
		t You try to stand up, but mesuF's hands are on your big, meaty thighs and pull you suddenly back down. You lose balance, and the full weight of your plush ass is on him.
		t He flails, kicking and jerking, and you quickly catch yourself and stand back up. This time the layer of saliva and drool is almost like a glue, and you actually have to grab mesuF by the head and <i>puuuuull</i> him away from his object of worship.
		mesu broken Hah, hah, hah...<br>M-more, do that again, please~<3
		player panic How... How did I even get into this situation? Bottomless, ass <i>soaked</i> in drool, butthole licked clean...<br>And you, how many fingers am I holding up?
		mesu afterglow Aha, ahaha~ *Slurp* <3 
		mtrans mesu4F; Continue
	`},
	{index: "mesu4F", name: "mini", image: "mesu/mesu4F", 
	content: `
		im mesu4F
		player Ohhh geez, oh man,  that's the face of a broken squirrel...<br>Anyone nearby?! 
		mesu Not... Squ... Chi... K...
		player scared Anybody! He needs some help! My pheromones made him go crazy, he needs a comfy bed, and a brushing before his tail gets all matted!
		fash shock Did someone say "brushing"? I can help, c'mere buddie.
		player panic Ohhh... I hope he's alright... I should scram so the air can clear up... 
		finish
		eval writeSpecial("You unlocked a new event in the gallery!") !flag player gallery;
	`},
	{index: "mesu6Start", name: "The True Self - Start", image: "mesu/mesu6Start-3", 
	content: `
		player surprised mesuF! Did mayorF say anything?
		mesu shock Ah! Man, you're really stealthy for someone with that much muscle.<br>Just to check, that note, did it read "I WANT YOU"? That was mine.
		player joy Oh, thank goodness! Man, that was scary.<br>I'm a lover not a fighter...
		player befuddled Did you say muscle? No, this is all squishy *boy meat. My fat to muscle ratio doesn't have any decimal points, the doctors said I was a miracle!<br>Granted, they used different wording, but still! "Freak of"-
		mesu laugh Hah! You're messing with me, I guess-
		t To prove your point, you give your thigh a hearty *SLAP*, allowing the wobble to travel across your legmeat and jiggle the bakery you call a behind.
		mesu befuddled ... Huh?<br>Wait...<br>The way you were acting that day...<br>And the way you're acting now...<br> I assumed all humans were-<br>You're... Soft?
		player laugh And jiggly!<br>Honestly I can be a bit of a pushover sometimes, and-<br>mesuF?
		im mesu6Start-0
		mesu scared Huh? What do you mean. Explain it in a way I can understand.
		player befuddled Well-
		mesu scared Because it sounds a whole lot like-<br>It...<br>It's not fair. <br>All that work I put into convincing mayorF a live human was the only way to solve the birthrates!
		player worried You're starting to talk over yourse-
		mesu scared It's not fair it's not fair it's not fair.<br>This... This isn't!<br>No no no!
		player shock ...!
		im mesu6Start-1
		mesu crying WHYYYYYYYY?!<br>I GET ONE MORE CHANCE WITH A HUMAN, WHY?!<br>WHAT DID I DO WRONG?!<br>I WANT MY GIGACHAD ALPHA MALE TURBO DOM!
		player scared I don't know what those words mean!<br>And please don't roll around on the grou-
		mesu fury  I WANT TO FEEL SMALL AND WEAK RIGHT NOW! RIGHT NOW! IT'S NOT FAIR!
		player confused <i>He's having a total mental breakdown!<br>He's thrashing on the floor like a small child, and more importantly the quality of his tail is being ruined by the second! Think brain, think! <br>Put every available braincell at max capacity, please! Anything...!</i>
		t "... Squirrels like nuts."
		player sparkle Wait, that's it! You're a genius, brain!<br>Alright little buddy, I know what's going on, you're coming with me!
		mesu crying You just don't get it! I've been waiting for someone like you, a human who can fill me up and make me feel complete...<br>I want, <b>NEED</b> to be dominated! To be claimed! To be... to be...!
		im mesu6Start-2
		mesu confused Eh?
		mesu shock GYAAH!
		im mesu6Start-3
		player scared Whaaaaaat the heck? You're so light! How much do you weigh?!
		mesu shock Th-thirty kilo!
		player befuddled ...?
		mesu pout About seventy pounds.<br>... Or close to three hundred cheeseburgers, if you-
		player scared Oh no!<br>No wonder you're so cranky! C'mon little guy, let's go home.
		player pout I may not know what a giggum cham is, and I might not be able to radiate alpha particles, or any kind of radiation right now, but if my friend needs help, I'll learn!
		mesu love <i>Eh...? Just a second ago *he seemed soft as a marshmallow...<br>Maybe... Maybe I was... Wrong?<br>Or maybe hanging here at crotch height has my brain fucked...?</i>
		mesu excited Ah... What the hell, lead the way.
		t Chipmunk in hand, you march him straight to your house.
		mtrans mesu6Finish; Continue
	`},
	{index: "mesu6Finish", name: "mini", image: "mesu/mesu6-5", 
	content: `
		player pout Hmph, grr, hold still!
		mesu pervert Ooooh~!<br>You <i>can</i> be rough!
		player fury Shush! I need to focus!<br>This beautiful, beautiful tail...<br>I need to make it perfect again...!
		mesu MMmmmmhhmmhm~<br>Oh, you had me completely fooled~<br>Oh, I've never been so happy to be completely wrong!
		player sleep Hah... Alright...<br>That's as much as I can do right now.<br>You were saying something?
		im mesu6-2
		mesu flirting I was <i>saying</i>, that I think I've got you all figured out~<br>You promised to give me some nut, right? Well, I need a special kind~
		player worried I get the innuendo... What do I need to do?
		mesu excited All I know is what I need.<br>Rough, brutal, raw, anal sex. And if I don't get it soon then me and my fluffy tail will be-
		im mesu6-3
		player angry How rough?
		mesu perverted Ooooh~<br>How about you go as hard as you can, and we'll see how things go from there~?
		im mesu6-4
		mesu excited Here it comesss!<br>I'm gonna get my guts rearranged like I always wanted~!
		im mesu6-5
		mesu perverted Mmmm~!<br>Human dicks are so amazing~!<br>Even without tasting a single one of those fat white drugropes I'm already addicted~!
		player pleasured Ghh... I think I get the idea...<br>Just like you beat a pillow to make it more fluffy...
		mesu love Yes~! And my prostate's just as much of a bitch as I am, it needs punishment~!<br>Beat the fuck out of us both~!
		im mesu6-6
		mesu ahegao Ghoooouuuhhhhh~<br>Mmmmore~! I need you deeper, my pathetic sissy balls want to be clapped by yours~!<br>Ruin me! Make me into a sleeve for your fat cock~!
		player forced Khhh~! There's not even a bit of resistance...!
		mesu perverted Mmmmmmm~! I'm gonna make you cum~!<br>This slutty, sissy boipussy that I've trained every day is finally finding its purpose~!<br>MY purpose~!
		im mesu6-7
		mesu ahegao HOOOOOHHH~<3<br>My crotch-pinky is already squirting~! I've never had an anal orgasm this fast~!
		t With a manic drive in your heart and instincts screaming 'TAKE HIM', you clap your hips against his plush ass so hard you're bouncing on his cheeks like a waterbed.
		player forced Hh... Hh... Hh...
		mesu love I can feel it~! I'M LOSING MY MIND~<3
		im mesu6-8
		mesu orgasm GHOOOOOOOOO~<3<3<3
		player orgasm Gh... Nghhh~!
		t *PLOP*
		im mesu6-9Rosebud
		mesu afterglow Hoh... Ghh... Hehehe~<br>You pulled out... So powerfully...<br>My ass isn't going back... Never want to go back to normal...
		player pent Do you need more?
		mesu excited Ab... Solutely...<br>Show me... What a human's limits look like...<br>I wanna... Train you into my ideal... *Master...
		player angry With what's at stake, I have no limits. Not today!
		t ...
		player pent *Huff*... *Huff*...
		im mesu6-FRosebud
		player fury Alright! That... That makes... I don't know how many...!<br>One more, and...<br>And...
		player pent ... mesuF?
		mesu broken ...
		player I fucked him so hard all he can do is twitch...<br>He's completely broken... I can see his prostate twitching through his taint!<br>Is he still cumming? Nothing's coming out...
		player broken Haaaaah~<br>That was brutal!
		player pent But... He looks happy, at least. And we're still friends at the end of the day.
		player sleep So I guess this was a big success!
		mesu broken ...
		eval writeSpecial("You feel like you've grown more dominant...") !flag player gallery;
		eval writeSpecial("You unlocked a new event in the gallery!") !flag player gallery;
		finish
	`},
	{index: "statusQuoIntro", name: "Home Invitation", image: "mesu/house-2", 
	content: `
		im house-1
		mesu sparkle playerF! Good instincts, dropping by unannounced. I just got done with my shower.
		player worried Oh, sorry. I just wanted to check up on you, things got a liiiittle intense.
		mesu amused Ah, don't apologize!<br>Actually, after my fuck-coma I did some thinking and I realized things aren't as glum as I thought they were.<br>Because humans...
		mesu joy Are adaptable!
		player surprised Like, all of us?<br>Is that a requirement? Because the last time I tried to adapt to something...
		t You shake your head, as if trying to free yourself of some accursed memories.
		t mesuF, of course, just continues on.
		mesu excited Ehehe~<br>I've got a fool-proof plan. Now that I know you <i>can</i> take charge, we'll just need to tap into that natural wellspring of dominance until it's a broiling geyser.
		im house-3 ?cbt;
		mesu flirting And I know plenty about tapping, believe me.<br>Trust me. I know I can turn you into a top <i>nobody</i> will ever be able to refuse.
		player worried Aww geez, I hope I'll be able to live up to your expectations.
		im house-2
		mesu flirting Mmmhm, and then, when you're ready, you can beat the squirt right out of my pain-slut balls~
		mesu perverted Mmmm, maybe maybe you'll use my nuts as a speedbag. Or... Oh, I wish I hadn't lost my paddle!
		player curious <i>Is that the kind of stuff he does to himself?<br>I wonder how far he'd have gone if I weren't around.</i>
		player surprise <i>Wait, but I am around!<br>... Probably.<br>Maybe I can help curb his self-destructive tendencies!<br>I can fix him!</i>
		mesu love <i>Ah, *he's having an internal monologue. I can tell with how expressive *his face is...<br>God, I want *him to make me even worse~</i>
		t Nodding to yourself as a plan begins to form in your head, you fail to notice as mesuF's drooling intensifies while a counter-strategy starts to form in his...
		t Oh well. Some friendships are built on trust and mutual understanding, others are built on a pair of unhinged lunatics bridging completely different pages.
	`},
	{index: "repeat1", name: "Repeatable - Oral", image: "mesu/repeat1-1", 
	content: `
		im repeat1-1
		mesu flirting Hmm~ Taking some initiative this time~?
		player smug Yep! And no ulterior motive either!<br>I'll do you rough, just like I bet you're hoping for!
		mesu excited Ehhh? Is that so?<br><i>Finally~! Alright, I have to pull out all the stops. Clearly *he's testing the waters, I need to show how good the power of giving in to your needs can feel~</i>
		player sleep <i>Alright. All that time spent alone tallywhacking to super hardcore porn has definitely messed with his idea of what normal should be like.<br>Don't worry buddy, I have a foolproof plan to make you appreciate lovey-dovey vanilla pleasure.<br>I'll show him the power of friendship can feel good too!</i>
		mesu smug Ehehe~<3
		player smug Ehehe~<3
		t The two of you giggle at your own internal monologue for a moment. Oblivious to anything else.
		player shock ... Oh, right! Sex time!
		t *THWAP*
		im repeat1-2
		mesu love Hohhhh~!<br><i>That just knocked the thoughts right out of my head!<br>Going for such a bold, powerful move, *he's not testing the waters, *he's diving in headfirst!</i>
		player panic <i>Awawawa-<br>Aww geez, this is why I should never handle my dick while distracted!<br>I can't apologize, or he'll see through my plans... Just need to play it cool.</i>
		player mocking Y-you l-like, that, ch... Squirrel boy?
		mesu love Yesss<br><i>Oh, that was a pathetic followup, but *he's clearly trying *his best~!<br>That calls for a reward~</i><br>Mmm~
		im repeat1-3
		player love Hohh~<br><i>I guess that worked! Alright, that's more than enough roughness, time to put my strategy into motion-</i>
		mesu pleasured <i>Oh! Reaching for-<br>Holy shit, *he's going for a head grab, *he's going right for irrumatio?!<br>Alright, I can't let those noodle arms ruin this, the moment *he gets a grip...
		player sleep There the-
		im repeat1-4
		player pleasured eeeer- Wah!
		mesu ahegao GHLLLKK~<br><i>Fuckfuckfuck yes rape the shit out of my mouthhhh~!</i>
		t Without regard for his own breathing, mesuF takes your hands upon his head as a signal to start absolutely SLAMFUCKING himself throat-deep down your length.
		t You grit your teeth, trying to use your grip to pull him back so he can take a breath, or even just slow him down, but the squirrely sissy seems determined to bop his nose against your crotch over and over again you're quickly worried he'll end up with brain damage.
		player torogao Ghhhhg-<br><i>Oh... Jeez...!<br>Can't... Fight...!<br>Only... One way... To stop him from... Breaking himself!</i>
		t With only one way forward instead of fighting you turn your resistance into thrusts, helping him throat you faster and harder. Ideally your cum will make him pull off long enough to-
		player orgasm Ghgh~! W-wait, don't...! Hold yourself... Deeper!
		t The plan backfires, as even before you realize it yourself mesuF has already felt a shift in the throb of your dick, and pushes his lips balls-deep before the first clench of your nuts.
		im repeat1-5
		t *splllllt*
		t It's a muffled sound. Not from the intensity, no, this cumshot is strong enough to make your vision wobble and toes curl. No, it's more masked by the sounds of mesuF gyrating and squirting his own load beneath you. 
		t It's a practiced movement meant to squish his balls between his thighs and against the floor.
		t By the time your vision has stopped swimming, you can un-roll your eyes and see that mesuF's own eyes are nearly in different directions.
		player shock Oh! Oh no, wait!
		t As mesuF's eyelids flutter, you realize you can't exactly put your plan into action if you black the squirrel out.
		t Thankfully, you're a genius, capable of incredible on-the-fly thinking.
		im repeat1-6
		player sleep There there, good boy~
		mesu broken ... khhlk...
		t As his eyes narrow and shut, you give the cutie patootie some ear scritches.
		player sparkle There we go! You had fun, didn't you? Now, make sure to associate all the fun you had with some loving pets~! Good boy, good boy~!
		player worried Err, wait, that's for training dogs. How do you train chipmunks?
		t You spend a short bit ruminating, before you realize you should probably unholster your dick from mesuF and let him breathe again.
		player pent I swear... If I need to re-learn CPR for this chipmunk boi...
		t Thankfully, he seems to be alright. Just got a bit too excited during the deed and passed out. 
	`},
	{index: "repeat2", name: "Repeatable - Heavy Petting", image: "mesu/repeat2-2", requirements: "?flag "+character.index+" repeat2;",
	content: `
		mesu sleep ... Nope.
player panic Huh?! B-but I'll be super gentle!
mesu angry That's exactly the problem! You think I can't see right through you?<br>I'll admit, it was a clever scheme. Genius, even! But I can read you like a book, no matter how quickly or complex you think, I know exactly what's going on in that head of yours.
player happy <i>I wonder if mayorF didn't add a washing machine to my house on purpose.<br>Maybe wearing unwashed clothes helps spread pheromones?</i>
mesu amused It was a devious plan. You want to be gentle, and caring with me. Slowly ease me into a vanilla anal session with some long foreplay, but sorry, bud.
im repeat2-1
mesu teasing If you wanna touch this soft, luxurious tail... I'm the one calling the shots this time, got it?
player love Hoh... Fluffy...
mesu mocking Now, I want it rough! And don't let me say no!<br>Take command, but not one finger on one hair on this tail until I am <i>brutalized</i>, you hear me?
player crying <i>No... I'm trapped!<br>I can't feed into his self-destruction addiction... But I'm a slave to my own addictions...!<br>I have no choice...</i>
player love W-wait... Take command?
mesu amused Oh yeah, there's the inner dom I've been waiting to see.<br>No safe word, no remorse. Fuck me up for re-
mesu shock Eh?
t You leap forward like a beast in heat, oddly fitting given the circumstances.
t And while yes, you have basically zero muscle mass, you probably have more jiggly fat in your jiggly cheeks than this twink does in his entire body.
mesu love Oh my God, it's really happening...!
player excited No tail, right?<br>I... I can feed my addiction in other ways, you know...<br>Can you?
mesu scared ... Pardon?
player excited Nope. Go directly to jail.<br>And safe words are important. Let me show you why.
im repeat2-2
player By the way, do you have a tickling fetish? Because tickling and petting are... Close enough. For now.<br>And don't worry, I picked a safe word for you. Try guessing what it is.
mesu scared I've made a huge mistake-
player perverted Bzzzt.
t ...
mesu laughing AHAHAHA~<br>STAAAAHH-!!!<br>AH'M GONNA THROW... GHHHHHIIIHIHI-!
im repeat2-3
mesu torogao NGHHHHHH-!!!
mesu crying Ahahahah~! I can't...! FLUFF! 
player excited Bzzt!
mesu torogao NGHHHH-!!! TA-HHHAAIL!
player Bzzzzzt! Coochie coo!
t The game continues without end. Well, that's what it feels like for him, anyways.
t Eventually, you relent. To be honest, you forgot the word you picked the moment you started fluffing that chubby belly of his.
mesu broken ...
player sleep Let that be your lesson for today, alright? Know your limits, and always be respectful of other people's boundaries too! Always!
	`},
	{index: "wall1-1", name: "Hole in the Wall - Mesu", image: "mesu/wall1-1", requirements: "?trustMin mesu 7;",
	content: `
		carpenter pout Mrgrgr...
		player confused carpenterF? What's got you so frustrated?
		carpenter angry It's the newest wall guest. He's too small... He doesn't fit in the restraints properly, he could slip out whenever he wants.
		player befuddled Oh, sorry to hear that. Is he being a nuisance about it?<br>It's really more symbolic than-
		carpenter fury And he won't let me fix it! "It's fine" he says! "I'll hold myself in place, honor system! I just wanna get this butt stuffed, I don't actually need to be stuck for real".<br>He's making a joke out of my honor as a craftsperson!
		player befuddled Oh... I see.<br>I'll go deal with him quickly then.
		carpenter pout ... Thanks.
		t ...
		im wall1-2
		mesu excited Hehehe~<br>Oh the anticipation is killing me!<br>What will *he do? Maybe *he'll actually break something this time, knowing *he'd get away scott free!
		t You approach the muttering butt, ready to satisfy another customer.
		im wall1-1
		player shock Holy moly!
		mesu befuddled Huh? What's wrong?!
		player surprised Nothing, it's just... No cage, no paddle, no baseball bat, just an ordinary butt in the wall!<br>I thought for sure-
		mesu shock Huh?! No bat?!<br>Why you little... carpenterF! You said it was okay!
		mesu fury carpenterF! You'd better not be sleeping, I'm talking to you! If you cheated me out of a good-
		player amused *Sigh*<br>I should have known.<br>mesuF, we can have fun without stuff like that! Totally normal bareback anal sex between friends can be fun too, even without any paddles, or bats, or brutalizing!<br>Allow me to present my argument:
		t *SLAPPPP*
		im wall1-3
		player sparkle Butt-bongo attack!
		t Without mercy or remorse, you slap mesuF's bouncy bottom. It's like fluffy jello!
		player joy *Huff*<br>So? Ready to beg for mer-
		mesu excited Why'd you stop?
		im wall1-4
		mesu Mm, beg, huh? Oh, <i>please</i>, playerF, <i>please</i> don't hold back anymore, and smack the fuck out of these fat cheeks!<br>It's all they're good for~!
		player worried Y-yeah, okay...<br><i>Dang, it looks like my 37th strongest attack did nothing at all!<br>I'll need to pull out the big guns!</i>
		im wall1-5
		mesu love Hohhhh~<br>M-more teasing, sticking your cock between my fat asscheeks, hotdogging me, so cruel~
		player pout Hmm.<br><i>He won't be satisfied unless I get rougher with him...<br>On one hand, I shouldn't be overly reliant on bullying his butt and balls, but if I leave him unsatisfied he might go too far on himself...<br>Plus, carpenterF is waiting on me...</i>
		player sleep ... Alright. I can't afford to hold back today. It's time for my second most powerful penultimate move!<br>Prostaaaaaaate-!
		im wall1-7
		player pleasured Pummeler!
		t Your 'penultimate move' really just being quickly thrusting, you do have to take into account mesuF's tiny frame rocking back and forth, barely held in place by the wall. So really, you're probably still only using a fraction of your true power.
		im wall1-6
		mesu orgasm HOHHH-!<br>H-holy shit!
		im wall1-8a ?cbt;
		mesu torogao You're beating... Beating the FUCK out of my balls!<br>NGHHH! YES! BRUTALIZE MY WORTHLESS FUCKING SISSY SACK! ?cbt;
		player torogao Ghh! Can't... Maintain my penultimate technique... For too long!
		mesu perverted YES! CUM INSIDE, SHOW MY BODY WHAT REAL SEED IS LIKE!
		im wall1-8b
		player orgasm Hohhhh...! Cummingggg...
		mesu excited Haaaaah~! Yes! No, thrust back in, let me feel those fat nuts clench up, right against my butthole's lips~
		player pent Hoo... Jeez louise...<br>
		mesu flirting Now, again, right? Don't hold back on my account, use me like a filthy fucking cumsock and remind me the only thing this sissy body of mine is any good for! Don't let me rest, break me!
		player Eh? Y-yeah, of course, that's what I was planning... Silly...
		t ...
		player broken Hah... Hah...<br>Guh... Guhnna...<br>Alright...
		t You've lost count of how many rounds this makes, but at this point mesuF is effectively a living condom. Every drop of you is spent, so you pull and-
		t And pull and-
		player pent Aw... Oh boy... Okay arms, c'mon, one last job for the day. Heeeave-
		im wall1-9
		t You Can hear a gurgle coming from the stuffed squirrel as you lift his legs for better leverage, pulling and tugging your dick free from his vicegrip boypussy.
		player His vocabulary is starting to rub off on me...<br>Hhheeeeeave-!
		t *PLOP*
		player shock Hwoah!
		im wall1-fa
		t *SPLTTTTTTTTT*
		t Like a broken spigot, something between a stream and a jelly splutters out of mesuF's absolutely battered butthole.
		t His legs kick up and down as he twitches, his own tiny weenie leaking freely as well.
		player pent Hoh... At least he's-
		im wall1-fb
		mesu mocking Ahhhaha~! Emptying me out now, right? So you can fill me back right up!<br>Yes, ruin me! Break me! I'll gladly never walk or sit again if it means I can be your cumdumpster!
		t Your brain empties of thought when you hear mesuF's still enthusiastic voice.
		player shock ...<br><i>Is... Is this what the rest of the townsfolk will be like when they acclimate to their heat...?<br>Even my second-most powerful attack...<br>And his own nuts and butt look so tuckered out, I was sure he'd be...</i>
		player worried No... I have no choice...<br>I swore I wouldn't use it... Not when a fluffy tail is right in front of me, but...<br>But I have to use... That technique...<br></i>Sorry mesuF...<br>Ultimate, most powerful technique!
		player crying Run awaaaaaay! Awawawa!
		mesu love W-wait, what? H-hold... Damnit, I could slip out of this just a second ago!<br>God, my cum-filled tummy...! Fuck!<br>Come back! If your balls are empty, you could use your fists! Come baaaaaack!
		t You turned tail. Though it wasn't a total defeat. Now actually, fully stuck, he has no choice but to let his battered body rest for a moment while he stews in what must feel like a gallon of human balljuice. 
	`},
	{index: "pill-mesu", name: "Denial Pills - Mesu", image: "mesu/pills1-7", 
	content: `
		player torogao Nghh! N-need... Balls... Gonna leak...!<br>Alleyway!
		t You head for the alley behind Squids Make Inc., just about ready to use civilization's second oldest place to relieve oneself.
		t Which is to say, you were about to hose down the side of the wall with soup-thick splatters of cum, until you spy it...
		im pills1-1
		player love W-wall mounted... Public relief...!
		im pills1-2
		mesu pent Hoo... Man, looks like *he's not coming today, either. <br>Maybe I should actually schedule these things?<br>Doesn't help that I need to hold myself from slipping out.<br>If this were the big city, I bet I'd be getting plapped the moment I hung my butt out like a public meat urinal, maybe I should-
		im pills1-3
		mesu pleasured Haaaah?!?!
		player forced NEED...! TO CUM...! BREED!
		mesu forced playerF? You don't sound... Ghouhh! You're already cumming! And... And you're like twice size you were last time!<br>What's go... Guh...<br>Hoooly... Shh... Shiiit, you'gghhh-
		im pills1-4 ?atwt;
		mesu torogao Hrrrrrrk-!
		player ahegao Cumminggggggg~!
		im pills1-5
		t An audible *splttttt* can be heard, both muffled from between the fat plushy cheeks of the sissy on your dick, but also somehow sounding wetter from behind the wall.
		t You push forwards, hitting some kind of resistance, but... It just...
		player afterglow Feels sho geeewd~
		t It's a complete relaxation that rushes through your whole body, the polar opposite of the full tension you felt trying to hold yourself together a moment ago. You just... Keep pressing forwards. Barely even registering your own mammoth nuts coming to rest against the tiny pair attached to this public relief fixture.
		t You are... Completely relaxed.
		im pills1-6 ?atwt;
		mesu orgasm GLLLLLLLLPPHHHHHHHH!!!! ?atwt;
		t Hundreds of questions race through mesuF's mind. How did your cock get this long? What happened since he last saw you? Will his body ever be the same again? Will his prostate stay flat as a pancake forever?
		t But the only answer he receives is your cock, pulsing through his whole body, every load of cum traveling up your urethra passing from one end of his body to the other, until you start to pull back. ?atwt;
		player tired Let go. Let go, toilet...
		im pills1-7
		t With so much of your body's energy dedicated to generating jizz, your brain power is at an all-time low, so you don't really think about how hard it is to pull yourself free of the meat toilet, or why you have to keep pulling, and pulling, and pulling for so long.
		player afterglow Hehe! Shilly butthole loves my penish shoooo much it jusht doeshn't wanna let go~<3<br>Gimme back my penis, butthoooole~<3
		t *PLOP*
		player tired There we go... Sleepy now...<br>Maybe I'll... Go home now...
		t Your vision swimming, your legs shaking, every part of you wobbling, you get ready to head home. Though your attention is briefly captured by the sounds of a waterfall.
		im pills1-8
		t A thick, glorpy waterfall.
		player tired ...
		player sleep Shilly, that's the town water fountain...! Shtupiiiid playerF! Don't be shuch a dummy!
		t You give yourself a light tap on the head as punishment for mistaking the obvious sounds of the plaza fountain for an oatmeal geyser.
		t Unfortunately, that light bonk was enough to knock you clean unconscious.
		t ...
		player sleep ...
		carpenter sleep ...
		player tired Mgghh...
		carpenter tired Mgghh...?
		player Oh, carpenterF... What happened?
		carpenter ...
		carpenter sleep Zzz...
		player pent They went right back to sleep...<br>Well, guess whatever happened wasn't important.<br>Oh, it's getting kinda dark. I should head home.
	`},
	{index: "cherry-mesu", name: "Star-Crossed Cherry - Mesu", image: "mesu/cherry1-1-light",
	content: `
		define playerduo = dual sp1 player; sp2 player;
		player sparkle mesuF~
		player sparkle We're here to play!
		playerduo sparkle And we brought the both of us!
		mesu angry ... Oh, fuck me.
		player worried That's not the usual way you say that.
		mesu tired Yeah, I just spent like three hours working on a project just to find out I'm dreaming right now.
		mesu sparkle But WHAT A DREAM IT IS~!
		player confused Wait, I'm not a dream. I think.
		player worried No, we could be. Every dream thinks it's real. So if we think we're real, then we're just like every dream.
		player confused Well, if we are, I guess we should play along then.
		player panic Yeah! Otherwise we'd be a nightmare, and I hate nightmares!
		player amused So, mesuF, what do you wanna do with us? We're the *boys of your dreams after all.
		mesu love O-ohhh~<br>W-well, actually...
		t ...
		t *THUMP*-*CLAP*
		t *THUMP*-*CLAP*
		t *THUMP*-*CLAP*
		mesu broken Ahaha~!
		im cherry1-1-light
		player laughing Haha~! We're so jiggly!
		player sparkle This is super fun!
		mesu ahegao Ahaha~! MPPHH~! AHAHAH~<3<3<3
		player worried But seriously though, are you sure you want us to keep going? You aren't even touching yourself, you're just letting us squish your head between our butts, so-
		player surprise Wait, look closer!
		im cherry1-2
		player shock Eh? Did he cum just from that? I can't really tell...
		player amused Well, if he did, even he didn't notice.
		mesu afterglow M-mooooarrr~<3
		player sleep Sure, it's your dream, after all. But maybe we should move to actually having sex before you wake up?
		player worried Are you super-dee-duper sure we're just parts of mesuF's dream right now? Like, I have memories of waking up today.<br>Can dreams even have memories?
		player happy Well, think about this. Who's smarter, you, me, or mesuF?
		player befuddled Hmm...
		mesu afterglow Mhhhhmmhmhm~<3<br>Crush meeeee~<3 Wrap me up in those bouncy twerkmounds till I pop~<3
		player happy Definitely mesuF. He is wearing a necktie, and glasses too.<br>So if he says it's a dream...
		player smug Exactly! Alright, now how about I take the front and-
		mesu broken N-no! Both at once, I can take it!
		player amused Geez, such a greedy chipmunk. I always forget how quick your refractory period is too.
		player sleep All the more reason to make sure he's extra satisfied!<br>Alright, we'll <i>try</i> mesuF, but know your limits, alright? And treat your body nicely when you wake up!
		mesu excited Mhmhm~<3 Split me in half~! Gimme those fat fucking human dicks~!
		player frown Hup! 
		im cherry1-3-light
		player angry Here we... Go!
		im cherry1-4-light
		mesu orgasm Hohhhhh~<3
		mesu ahegao Rape meeee~<3<br>Cum until my shithole turns into a fucking craterrrrr~<3
		player perverted Gheee~! H-hey, I think I was having too much fun with the butt-bouncing earlier!
		player forced Ghh, I think so too! Feeling my balls bounce against his fluffy cheeks, or when he'd turn his head and start kissing us-
		mesu GHYOOUUHHHH~~!!!
		player forced Ghh...! Just one of us cums enough that we bloat his belly, but-
		player pervert I can't hold back either! I'm gonna...
		playerduo torogao Cum~!
		im cherry1-5-light
		t Two fat human dicks wrapped up in a cozy snug embrace begin to throb and pulse, further burying the living onahole between you and your clone in the delusion this must be a dream.
		mesu NHOUHHHHHH~<3<3<3<br>HURTSH SHO FUGGINGGGG GOOOOOOD~!!!
		t A very, very intense dream. One that has mesuF's brain absolutely frying as his legs tense and untense, shaking and seizing against your grasp.
		player pent Nggh... Eh? "Hurts"?
		player shock Wait, we're still here? But he just said-
		player scared I heard it too! Maybe we aren't a dream!<br>Why didn't we think to do the pinchy test!?!
		player panic Ohhhh, oh golly geez, quick, pull out!<br>Oh man, we just totally stretched our friend's butthole to the max for real!
		player angry Nghhh!<br>Okay, lay him on the bed-
		player scared No! If I set him down-
		player panic He'll leak our cum all over his tail!
		t Acting on instinct, you, well, the other you, tries his best to keep the nut-stuffed femboy from making too big a mess, but...
		player shock Wait, watch out for-
		t *POOF*
		player panic DOUBLE-BUBBLE, NOOOOO!
		t Sacrificing himself for a truly noble cause, mesuF's flailing strikes your doppelganger. All that's left of *him is a cloud of sparkley smoke.
		t Well, and a double-stuffed, stretched-out, used-condom-looking squirrelboi. 
		player crying I'll... <br>*Sniff*...<br>I'll never forget your sacrifice...
		player sleep I know you'd want me to carry on and keep living this wonderful life, full of fluff.<br>I'll do it for you, bestest buddy...<br>Right after... There we go, tail's out of the way.
		player happy Bye mesuF, it's been fun hanging out with you!
		im cherry1-6
		mesu broken Ghuuuuuhhhh~
	`},
	{index: "bath-1", name: "After-Shower Peehole Pleasure", image: "mesu/bath2", tags: "urethral",
	content: `
		outfit mesu nude
		mesu flirting Mmm...
		im bath1
		mesu Cleaned my body... But you, oh you, these pathetic little nuts of mine squirted so much you put the shower to shame~
		mesu perverted Mmmhmhm~<br>But oh, how could I resist spanking you silly, when every drop of water was such a tease~<br>Now, if you don't start leaking, I'll have to start plapping again to empty you out properly~ ?cbt;
		mesu flirting Ah, but now that I've cleaned the outside, time to clean inside too~<br>Hope you won't get your hopes up coming out of the cage though~
		t ...
		mesu orgasm Ghoooouhhh~!
		im bath2
		mesu torogao Fuck~! I really have a slutty fucking maso-dick~! This pathetic little boyclit of mine never gets hard unless I'm snorting jizz or it's getting beaten!<br>But since the human arrived I've become a slut even for urethral sounding!
		mesu excited Ehehe~<br>I wonder how it'd feel to give myself a sounding orgasm? I haven't tried going that far before~<br>Maybe this is what finally breaks me, and I'll finally be permanently soft~?
		mesu orgasm Hooh~! That really made me throb! Alright, take it, you pathetic, slutty shrimp-dick! I won't stop abusing you with this metal rod until you squirt or go limp for good!<br>Nggghh~<3
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