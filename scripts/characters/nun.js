var character = {index: "nun", flags: "", fName: "Khanna", lName: "", color: "#FF902D", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "NoodleJacuzzi", gender: "female"};

var logbookArray = [
	"im images/nun/clothed/happy; im images/nun/nude/happy; title Worshipful; The nun of a small church here in Syrup Town, nunF follows a religion that has a very specific purpose: to worship all things human in all forms. Their cultures, their philosophy, their habits, and their bodies first and foremost. Absolute subservience given form, nunF has made it very clear that you are her Lord.",
	"im images/nun/logbook2.png; title Nun's Habit; Wearing a black dress styled after a nun's habit, nunF is one of the few residents of the town not walking around with her ass and pussy on full display. <br>However do not mistake this for modesty, her dress is so tight that you can clearly see every inch of nunF's body, every way her body moves beneath the thin black fabric, and she'll make it very clear at every opportunity that there is absolutely nothing but woman beneath the cloth.",
	"im images/nun/logbook3.png; title Big Fat Cat Tats; nunF's breasts are some of the largest among the residents of Syrup Town, but what makes hers stand out even more is that nunF uses them with purpose. Whether that's gently running her hand to accentuate the shape, or drawing circles around rapidly hardening nipples, nunF will not hesitate to make it clear that her tits are a signboard to say 'Fuck me, please' at any opportunity.",
	"im images/nun/logbook4.png; title Circle of Lust; nunF's asscheeks are simply divine, lifting them leads to a perfect jiggle, slapping them has them shake and wobble. And the best part is that nestled between them is a meaty, puffy asshole that hungrily awaits anyone brave enough to challenge it. nunF sees her asshole as another means to show her devotion to human flesh, whether it's stretching around cock or fist, she'll make it her mission to have a revelatory experience.",
];

var achievementArray = [
	{index:"7"+character.index+"Friend", frame: "ultraRare", name: "Nun's BFF", requirements: "?trustMin "+character.index+" 7;", description: "Learn what it's like to be worshipped and become nunF's best friend.", image: "nun/achievement1",},
];

var itemsArray = [
];

var shopArray = [
];

var pickupArray = [
	{index: "nunAngelOutfit", requirements: "?flag nun House; ?flag nun repeat2; !item angelSet;", top: 30, left: 20, event: true, size: 10, image: "items/question"},
];

var morningArray = [
	{index: "nunMorning1", priority: 99, requirements: "?trust nun 1;", unique: false,},
	{index: "nunMorning2", priority: 99, requirements: "?trust nun 3;", unique: true,},
	{index: "nunMorning3", priority: 99, requirements: "?trust nun 4;", unique: true,},
	{index: "nunMorningSilly", priority: 1, requirements: "?trustMin nun 7;", unique: false,},
	{index: "morningSquirt", priority: 40, requirements: "?trustMin nun 7; !flag nun morningSquirt;", unique: false,},
];

var encounterArray = [
	{index: `intro1`, name: `Someone's here!`, requirements: "?location pineconePlaza; ?trust nun 0; !flag player intro;", altName: "", altImage: "",},
	{index: `nun0`, name: `nunF's Church is here`, requirements: "?location pineconePlaza; ?trust nun 1;", altName: "", altImage: "",},
	{index: `nun1Start`, name: `nunF's Church is here`, requirements: "?location pineconePlaza; ?trust nun 2;", altName: "", altImage: "",},
	{index: `nun2Start`, name: `nunF's Church is here`, requirements: "?location pineconePlaza; ?trust nun 3;", altName: "", altImage: "",},
	{index: `nun3`, name: `nunF is watering her... Sidewalk?`, requirements: "?location pineconePlaza; ?trust nun 4;", altName: "", altImage: "",},
	{index: `nun4`, name: `*KNOCK* *KNOCK* *KNOCK*`, requirements: "?location playerHouse; ?trust nun 5;", altName: "???", altImage: "none",},
	{index: `nun5Start`, name: `nunF is waiting for you in front of her church`, requirements: "?location pineconePlaza; ?trust nun 6;", altName: "", altImage: "",},
	{index: `statusQuoIntro`, name: `The door to nunF's church is open`, requirements: "?location pineconePlaza; ?trust nun 7; !flag nun statusQuoIntro;", altName: "", altImage: "",},
	{index: `House`, name: `Visit nunF's church`, requirements: "?location pineconePlaza; ?flag nun statusQuoIntro;", altName: "", altImage: "",},
	{index: `cherry-nun`, name: `Let's visit nunF!`, requirements: "?location pineconePlaza; ?trustMin nun 7; ?holiday cherry;", altName: "", altImage: "",},
	{index: "nunNudity1", type:"walking", requirements: "?location pineconePlaza; ?nude; ?trustMin nun 7; ?trustMin sado 6; ?flag mayor nudity1; !flag nun nudity1; !encountered nun; !encountered sadogato; !encountered mayor;"},
];

var sceneArray = [
	{index: `intro1`,
	content: `
		t It takes a second before you can identify what exactly that weird feeling is, before you turn around to notice someone has approached you.
		im intro1
		player love Uoh, big cat...
		t Before introducing yourself you're struck by how she seems to be carefully taking in slow, measured breaths.
		nun happy Don't mind me, I'm just... Basking.<br>My name is <input type='text' id='nameSubmission-nun' value='nunF'>, and it's lovely to meet you.
		button Continue; renameCharacter('intro2')
	`,},
	{index: `intro2`,
	content: `
		player joy Nice to meet you! I'm playerF.
		nun sleep Hmm...
		nun excited I see~
		player worried Ah, did the heat kick in already? That was really fast.
		nun sleep Indeed. mayorF informed me that I should keep our first interaction short, in case I have a poor reaction to going into heat.<br>Such a shame I can't <i>directly</i> invite you home with me.
		player tired Yeah. Well, I should-
		nun Now, if you were to follow me to the church in Pinecone Plaza of your own accord? Well, I don't think anyone could stop you.<br>I <i>shudder</i> to imagine what might happen if you followed me, someone who already <i>very</i> completely understands the superiority of the human form, home.<br>I simply can't stop thinking of what effects being completely <i>bathed</i> in human sex pheromones could do to my completely inexperienced, defenseless, <i>virgin</i> mind.
		player happy Yeah, that'd probably be bad for you.<br>Lovely meeting you though!
		im intro2
		nun flirting Mmm, yes. Lovely meeting you as well.<br>I should head home now, I imagine I'll be completely overwhelmed by lust as the heat develops.<br>Simply spending the entire day, <i>desperately</i> trying to calm down my aching snatch. Outright <i>begging</i> someone was with me to put me properly in place.
		nun sleep Hmm, such a shame, such a shame~
		t She walks off, her tail gently swaying with each step. Moreso the end result of her massive ass swaying the same way.
		player worried ... I hope that lady will be alright.
		t ...
		t After a short walk back to her church, nunF pushes open the doors, leaving them open, before standing in the middle of the hall.
		t As she takes a few more shallow breaths, trying not to completely clear her lungs of the air from meeting you, she waits.
		nun sleep ...
		t And waits.
		nun confused ...?
		t And waits.
		nun befuddled ... Hmm? *He's not behind me?<br>Did I close the door on accident?<br>It was barely a minute to get here, it's impossible that-<br>No, the only reasonable cause is that *he must have caught whiff of an even more vulnerable prey animal.
		nun excited Which means surely *he'll be arriving just as soon as he rapes that poor, <i>defenseless</i> creature into absolute submission. *His throbbing, still-hungry balls eager to make me into their next cum-gaping victim~
		t ...
		player sleep Ah, what a nice nap.<br>What should I do next?<br>I could probably go for a fruit snack, or something.
		eval passTime();
		eval setTrust('nun', 1);
		eval unencounter('nun');
		finish
	`,},
	{index: `nun0`,
	content: `
		player worried Ah, this must be her church.<br>It's way too soon to visit, but I hope she's alright. Maybe I'll ask someone else to check up on her.
		t ...
		nun excited Ooh, I'm sure *he's taking his sweet time with whatever cunt *he must be impregnated by now~
		eval unencounter('nun');
		finish
	`,},
	{index: `nunMorning1`,
	content: `
		t You lay down, feeling ready for sleep the moment your head hits the pillow.
		t ...
		t Meanwhile, in a small church at the center of town...
		nun sleep Hmm... Hmm...<br>... It's been at least eight hours.<br>*He truly must be thorough. Or perhaps the foolish mayor intervened? Teaching the prideful mayorF her place would explain why it's taking so long.
		nun blushy It's... It's not like I could be forgotten!<br>All those squats, modifying my outfit...<br>N-no, any moment now...!<br>If I leave, that'll be exactly the moment-
		nun excited Ah, wait. A human wouldn't bother with decorum.<br>If my doors are closed *he'll simply break them down.<br>If I head to bed now, then instead of the "brutal anal rape in the center of the church" fantasy, I can expect the "brutal mating press impregnation in bed" fantasy.
		nun pent Ugh. Which means sleeping with the veil and coif on.<br>I can't be caught lacking for the human, after all. And my pajamas simply do not scream "Breed me like an animal" hard enough.
		t ...
		player sleep Zzz...<br>Mmm... Morning time already?<br>Maybe just... Five more minutes...
		eval setTrust('nun', 2);
		finish
	`,},
	{index: `nun1Start`,
	content: `
		player happy Helloooo~<br>Wow, what a normal looking-
		im nun1-1
		nun teasing Oh~<br>Why hello there, you caught me in the middle of my morning stretches~
		player confused Right. Which you're doing... In the middle of the church.<br>I know people don't wear pants here, but is it normal to show off and flash your bits like that to everyone who walks in?
		nun flirting Oh, I can assure you that you're the only one I intend to show off for.<br>Mmm, I'm so glad you decided to visit~<br>I hope you kept me in mind while you dealt with whoever held you up yesterday.
		player happy I just wanted to make sure you were okay.
		nun excited Mmm, so considerate~<br>Well, I don't mind a gentler *master, though hopefully I can convince you to be rough with me whenever it pleases you.<br>So, how shall we start?
		player confused ...? Oh, like a sermon? Doesn't the priest usually decide on that?
		nun perverted Oooh, playing coy~?<br>Playing hard to get even now. You love to show how completely you hold all the cards here, don't you?<br>Then I'll ask directly, I'll beg, if you want me to.<br>Please, use me, use my body however you desire~ Any part of me is yours~
		player love Any part of you?
		nun seductive I finally have your full attention?<br>Ah, but don't answer with words, alright? Show me with action, take what you want, from this point on everything you decide is rightfully yours becomes your property~
		player excited W-well... If you're offering... One part of you that really caught me eye...
		trans nun1; Approach the Tiger Nun
	`,},
	{index: `nun1`,
	content: `
		eval writeEvent(data.player.currentScene)
		trans nun1Finish; Snap back to reality
	`,},
	{index: `nun1Finish`,
	content: `
		player shock Oh!
		im nun1-6
		nun broken ...
		player scared W-what have I done?! Oh no!<br>I've gone too far!
		player worried W-wait, but she gave me permission!
		player scared No... No, there's no way she could have known how deep my love of fluff goes!<br>I have to take responsibility!
		player angry First step, I need to stop exposing her to my pheromones! No matter how much I wanna keep fluffing, time for me to go!<br>And second...
		player sleep I won't be scared... I've been preparing mentally the moment I arrived in town for this.<br>For the day my fluffing went too far.<br>Rest, miss nunF. If the time comes that I need to pay for my crimes, I'll be ready to commit sudoku right here.
		eval setTrust('nun', 3);
		eval passTime();
		finish
	`,},
	{index: `nunMorning2`,
	content: `
		eval writeEvent(data.player.currentScene)
		finish
	`,},
	{index: `nun2Start`,
	content: `
		nun flirting Oh, hello again.<br>I'm so glad you're back.
		player worried Yes. I'm here to take responsibility for what happened last time.<br>You didn't know what you were getting into, so-
		nun perverted Hmmm~! Oh, thank goodness, so something did happen!<br>Don't worry, I promise, I know <i>exactly</i> what I'm offering myself up to.<br>Though, er, this is a bit embarrassing, but... My memory is a bit blank on exactly how last time played out.
		player worried Right, going into heat is probably playing tricks on your mind.<br>What happened is that I started petting you, scritching your ears, then I started stroking your tail...
		nun excited Yes...? Yes? And then?!
		player crying And then I didn't stop!<br>Selfishly, I just kept petting! Not even bothering to notice you were passed-out face-down on the floor!
		nun scared ...
		player I couldn't control myself! I'm a complete menace...!
		player pent Hoo. Glad I got that off my chest.<br>To be honest, I never really understood confessionals, you can just shout all your crimes out at strangers in public, it's totally free and just as effective.
		nun worried I... Surely...<br><i>Nothing</i> else? Nothing at all?<br>A defenseless, vulnerable woman passed out before you, one so whorish and slutty to not even wear a thong, her bare, sopping pussy squirting onto the floor and you did... Nothing?
		player crying Wah! I know! I wish I could have carried you to bed, but what if that exposed you to even more pheromones!
		nun scared Have... Have I misjudged you?
		player pout *Sniff*<br>Well, probably... I mean, we barely know each other. Kinda hard to judge someone like that.<br>I figured that's why when someone dies the church sends out all those secret policemen to interview people so the priest can write a good eulogy.<br>Or why in heaven they have a guy in a bathrobe who asks you about how your life when down.
		nun confused I... I don't...<br>Huh?
		player happy Ah, but don't you worry! I know you've been battling your heat, but I've been paying attention to you, and I'm <i>suuuper</i> observant!<br>So, all that we need to become best friends is for you to learn about me.
		player sparkle And the timing is perfect! I've been mentally writing my will since I started walking here, so I have a whole bunch of questions that you can ask me all ready!
		nun worried ... What is happening right now?
		player sleep Alright, now what question should you ask me first?<br>They're all pretty common, but by the end of them you'll know enough about me for our friendship score to max out!
		eval unlockScene("nun", "nunMorning2");
		trans nun2a; "Any special talents?" !flag nun nun2a;
		trans nun2b; "What are your weaknesses?" !flag nun nun2b;
		trans nun2c; "Do you have a tragic backstory?" !flag nun nun2c;
	`,},
	{index: `nun2a`,
	content: `
		player happy "Any special talents"?
		nun worried ...
		nun shock Oh! You mean, you actually want me to ask?<br>Right. Any special talents?
		player sparkle Yeah! I can shriek like a banshee on command! It produces a pitch that-
		player worried Oh, wait, I forgot. I signed a blood pact to never do that again on account of disturbing the peace.<br>Sorry, you'll have to take me at my word on that one.
		nun worried ...<i><br>Is *he joking? I genuinely can't tell...<br>A good sense of humor is really cute though...</i>
		nun panic <i>But I didn't sign up for cute!</i>
		player tired Outside of that... No, I can't really think of anything.
		player sleep Alright, I bet that increased the friendship score a bit. Next, you should ask...
		eval addFlag('nun', data.player.currentScene);
		trans nun2a; "Any special talents?" !flag nun nun2a;
		trans nun2b; "What are your weaknesses?" !flag nun nun2b;
		trans nun2c; "Do you have a tragic backstory?" !flag nun nun2c;
		trans nun2d; "Do you have any nicknames?" ?flag nun nun2a; ?flag nun nun2b; ?flag nun nun2c;
	`,},
	{index: `nun2b`,
	content: `
		player happy "What are your weaknesses?"
		nun worried ... Do you get asked that a lot?
		player shock ...! Err, I guess? Maybe?<br>That wasn't one of the prepared questions, so that caught me off guard.
		player sparkle Anyways, as for weaknesses, I have a ton! First of all, I'm scared of the dark!
		nun befuddled The... Dark?
		player amused Yeah, I'm terrified of it! Even if there's tons of streetlamps, I can't set a foot outside at night!<br>Oh, oh, and aside from that, I can actually only do two things each day. Hard limit. And napping is sometimes one of those things!
		nun worried ... <i>This is all some very elaborate joke-<br>Which, the chances of that aren't zero.<br>Or... *He's actually... Kind of a pushover?</i>
		nun panic <i>But I want to be the one getting pushed over!<br>I can't do it myself! I'm supposed to be the ravaged, not the ravager!<br>I mean, sure! I could grab onto those fat, jiggly thighs and... And...
		nun worried Um... What were we talking about?
		player happy My thighs. Those are my seventh weakness. <br>Oh! And I'm ticklish. Crazy ticklish, that's weakness number eight.<br>You may need to write these down, do you need a pen?
		player sleep No, wait, I already have them written down back at home. I'll send you the list.<br>Now, what should you ask me next...
		eval addFlag('nun', data.player.currentScene);
		trans nun2a; "Any special talents?" !flag nun nun2a;
		trans nun2b; "What are your weaknesses?" !flag nun nun2b;
		trans nun2c; "Do you have a tragic backstory?" !flag nun nun2c;
		trans nun2d; "Do you have any nicknames?" ?flag nun nun2a; ?flag nun nun2b; ?flag nun nun2c;
	`,},
	{index: `nun2c`,
	content: `
		player crying Wah!
		nun shock Eh?! What's wrong?
		player worried I... *Sniff*<br>Sorry, I just imagined you asked me if I had a tragic backstory. But I don't have a cool backstory at all!
		nun panic W-well, an ordinary human life is still far more valuable than-
		player crying No, worse! It's a lame backstory! First of all, I was so ugly the first thing my parents did after seeing me was try to set me on fire before punting me into a nearby dumpster.<br>I was a, stereotypical, cliche, <i>boring</i> dumpster baby!<br>The worst part was what came after. There was a mirror in the dumpster, and I saw my reflection.
		nun scared ... And?
		player happy No, that was the bad part.<br>Let's see... I mean, I once got in a fight with a bear. He snapped me in half like a graham cracker.<br>I got better though, so that's not tragic at all.
		player shock Oh! Wait. This one time I really wanted a cake that said "Congrats on beating teen pregnancy", it would have been really funny, you had to be there to get the joke though.<br>But they wrote "don't grow up to strangle strangers in truck stop bathrooms" instead!
		nun tired I... My head hurts.
		player sleep Oh, but I did <i>not</i> ever need to sell feet pictures.<br>I can't be proud of much in my life, but I can be proud of that.<br>What were we talking about again?<br>Questions, right! What should you ask me next, lemme think...
		eval addFlag('nun', data.player.currentScene);
		trans nun2a; "Any special talents?" !flag nun nun2a;
		trans nun2b; "What are your weaknesses?" !flag nun nun2b;
		trans nun2c; "Do you have a tragic backstory?" !flag nun nun2c;
		trans nun2d; "Do you have any nicknames?" ?flag nun nun2a; ?flag nun nun2b; ?flag nun nun2c;
	`,},
	{index: `nun2d`,
	content: `
		player surprise Oh, oh! Ask me if I have any nicknames! The answer may surprise you!
		nun worried I... Alright, I'm actually curious about this one.<br>You had to come here for a reason, right? Perhaps you maybe secretly have a desire to-
		player sleep Well, my nicknames in school were "blind weasel" and "easily-horrified penguin". So I'd say I've always been a bit of an animal person.
		nun angry That's horrible... I knew human children could be cruel, in fact I wouldn't have minded if you were much younger, but to be so heartless to their fellow human...
		player crying No, I was homeschooled, it was my parents who gave me them!
		nun befuddled ... Hold on, you said you were left in a dumpster?
		player amused Kicked. And they fished me back out afterwards. They were tough love kinds of parents. You know how lions throw their babies off of cliffs?
		nun scared WHAT?! No they absolutely do not!
		player befuddled Oh. Was that lemmings? I get those mixed up a lot.<br>That's actually my ninth weakness, I can't tell the difference between lions and lemmings. See, I got this concussion when I was blue years old, and it crossed certain wires in my head.
		player happy Anyways, I feel like we're almost best friends. One more question should do it.
		eval removeFlag('nun', "nun2a");
		eval removeFlag('nun', "nun2b");
		eval removeFlag('nun', "nun2c");
		trans nun2; "Do you own any meteorites?"
	`,},
	{index: `nun2`,
	content: `
		player happy Alright, you should ask if I own any meteorites. That should be enough.
		nun sleep Say. Are you aware of a specific phenomenon where, when someone is for sure about to die, they actually feel their panic start to fade?
		player joy Oh boy, do I!<br>Yeah, that's your body accepting death! You think you'd just keep freaking out more, but actually this cool, calm wave totally sweeps over your whole body!<br>I felt it just this morning, actually!
		nun happy Do you think that can happen in other circumstances too?
		player confused Uh, probably.<br>Well, for humans at least, we can go into shock over some pretty silly things sometimes. So, maybe if you took enough mental damage all at once...<br>Though, the question is, what comes after? If someone feels that cool wave pass over them, but they aren't about to die...
		player joy Oh! Y'know, I bet what happens is your body goes "Whelp. Might as well..."<br>And just totally lets loose! Why not, right? Why bother having any inhibitions when you've just experienced ego death, right?
		nun sleep I see. That makes what I'm about to do make a lot more sense.
		t And as she says that, it feels like every word is dripping with honey.<br>There's a lilt of some mix of hunger and mania at the end of every sentence as she takes you by the hand.
		player happy Ooh. Are you getting closer for a hug?
		player pout Oh, and the answer to the meteorite question is no.<br>Anything that falls from outer space, and doesn't have the decency to be ripped apart at the molecular level, can't be trusted.
		t ...
		eval writeEvent(data.player.currentScene)
		eval passTime();
		eval setTrust('nun', 4);
		finish
	`,},
	{index: `nunMorning3`,
	content: `
		t It's a brand new day in Syrup Town, and all is quiet.
		t Well, except for a church on Pinecone Plaza, where a certain nun is pacing back and forth...
		nun scared Ohhh, what have I done?<br>What is even going on?<br>Is this some cruel joke at my expense? Am I stupid?<br>This is not how things were meant to go!
		nun love Oh... My head is awfully clear right now...<br>Maybe I can blame it on the heat?<br>Maybe it actually <i>was</i> the heat?
		nun panic Aaaaaaah, but what am I supposed to do now?! How do I get the human I've been waiting for?<br>*He's nothing like I expected at all!
		nun angry No, get a hold of yourself!<br>The whole point of all of this was to stop overthinking things!<br>I will just... Be normal! I will find my place beneath the human and stop worrying about this, about my place in the world, about my age, about people in town thinking I'm a weirdo!
		nun fury I AM NOT A FREAK!
		nun tired ... Okay. Clear my head... Purge my mind of all sinful thoughts...<br>Leave only...<br>Leave only...<br>What will even be left?<br>Nothing worth... Thinking about...<br>Empty... The mind... Begone... Thoughts...
		im nun3-0
		nun sleep Ah, breathing is fun~
		t ...
		player sleep Zzz... Mmm, looks like the sun's up already...<br>Maybe just... Ten more minutes...
		finish
	`,},
	{index: `nun3`,
	content: `
		im nun3-1
		player sparkle Hiya nunF!<br>Having fun?<br>I can't help but notice that people are staring...
		t "Is she watering the sidewalk?" "I think I recognize her, did she go off the deep end again?"
		t A few townsfolk linger around, staring at nunF, but she seems to pay them no mind. She doesn't seem to be paying anything any mind at all, actually.
		player amused Oh, I recognize that look. Purged your mind of all worldly desires, right?<br>Ah, no! That's definitely more of a "purged the mind of sinful thoughts"! I get those mixed up a lot too.
		nun laughing Hehe! Hello imaginary human. I'm so glad you could visit me today.<br>The local botanist thinks I'm strange, so I water my own plants.<br>And I am strange, and that's okay! I had a strange dream about spreading a human's legs and dominating them yesterday, so I'm not sure what's real anymore.
		player shock Wow, what a coincidence! You did that yesterday, <i>and</i> you had a dream about it too?!<br>You're not still worried about that, right? Because as far as I'm concerned, we're Even Stephens.
		nun Heehee! You're so funny! I love all your funny little jokes.<br>I love them almost as much as I like how nice your voice sounds.<br>I like how you're so jiggly that it makes me think about licking you all over. And I also really like that you'd be the perfect height for me to rest on your head, you're so wonderfully short.
		player happy ... Call me that again. See what happens.
		nun Teehee! And even when you get mad about being called short, you're still so funny!<br>I couldn't stop thinking about you, and my heart beat so loudly, and I wanted to cry, and aaaaall my dreams of living a life of total mindless submission are-
		nun crying Waaaaah! Oh God, I've been... It's... Every- Crashing down...!
		nun sleep Hoo... And so I took aaaall those thoughts and I poured them out like a nice cup of tea.<br>And then I broke the cup.<br>And when the teapot fills back up with all those sad thoughts I'll pour them right out again until aaaaall my cups are broken.<br>Also, breathing is fun.
		player panic Don't do that!<br>Smashing your cups, I mean. Please don't stop breathing.
		player confused But "mindless submission", huh? Doesn't that sound... Boring?<br>You'd only be as interesting as the person you're submitting to. You'd never need to do or decide anything that you weren't ordered to.
		nun laughing Ahaha~! That's your funniest joke yet! That's the whole point!<br>All the emptiness in life, every nasty thought and bit of ennui goes away if you have something to do!<br>But then, when you finish, you need to think!<br>You need to find what's next!<br> You need to find a purpose!
		nun fury And if you don't have, one, then you're a failure! <br>And you're wasting your life!<br>And everyone looooves to tell you that same, <i>HILARIOUS</i> joke about you being a literal crazy cat lady!<br>And when you finally can't take anymore, when you finally draw the line, <i>you're</i> the mean one! <i>You're</i> the one they stop inviting! And all you can do is-
		nun laughing ... Teehee! Whoops, teapot got full!<br>I'm a little tea-pot, short and stacked, these are my handles, this is my... Where all the dark thoughts come out!
		nun sleep Breathing is fun.
		player scared Eh...?<br>So... You don't actually like me<br>We aren't even friends a little bit? Like, zero?
		nun tired ... My brain is empty, so I don't understand. How on earth did we get from there to here?
		player worried You seemed really excited to see me when I came by...<br>Because you thought I was gonna make you stop thinking, and give your life meaning?
		nun worried ... Well, when you put it like that...
		player crying That's so mean! I don't want to be responsible for being your reason to live!<br>I just wanted to own a house, to assemble jiggy puzzles, and catch little critters in the forest! <br>And when I came to your house all I wanted was to make a friend!
		nun shock Whaaaat is happening? Is this still a joke?<br>Are those actual, not-a-joke tears? You can't cry! You're a human, you're supposed to-
		player You're horrible! You lured me in-
		t "Lured *him in"? What are they talking about over there?" "What's going on?"
		nun scared Ah, w-wait, maybe we should have this conversation inside-
		player pout Why?! So you can pretend I'm this magical human who'll solve all your life's problems?<br>Or so you can satisfy your heat again?!
		t "Satisfy her heat?!" "Mom, those two are yelling at each other!"
		nun Ahhh, this is a misunderstanding! Human, please-
		player crying "Human" "human" "human", why not use my name?!<br>You don't even remember it, do you?<br>I feel so taken advantage of!
		t "I hear that tiger lady took advantage of the human." "I always thought she seemed untrustworthy!" "What a weirdo...!" "See? This is why we need the human, getting too old without having kids will make you..."
		player I'm leaving! Good! Bye!
		im nun3-2
		nun scared ...<br>Wh... What just...
		mayor angry Out of my way, out of my way...!<br>That damn crazy...
		mayor fury nunF! Why did I just see the human run off in tears?!<br>I told you, I gave <i>you</i> specific instructions not to make them uncomfortable!
		nun ...
		eval raiseTrust('nun', 1);
		eval passTime();
		eval unencounter('nun');
		finish
	`,},
	{index: `nun4`,
	content: `
		eval writeEvent(data.player.currentScene)
		eval raiseTrust('nun', 1);
		eval passTime();
		finish
	`,},
	{index: `nun5Start`,
	content: `
		nun sparkle playerF~!
		player amused That's my name! Don't wear it out.
		nun sleep I would never, I swear it. Even if the rest of the world discarded it as having no value, your name would be the most precious thing in the world to me.<br>But if anything, every time I say it, I feel like it makes the world even brighter!<br>playerF!
		player happy nunF!
		nun sparkle playerF! playerF!
		player sparkle nunF! nunF!
		t "Looks like those two are being weird again..."
		im nun5-0
		nun happy You there. I heard that, and I've memorized your face.<br>Call *him weird again. See what happens.
		player sleep Ah, don't worry about them. If they aren't important enough to get a dialogue sprite, their opinion doesn't matter.
		nun joy Ah, of course. That's a very mature response!<br>Here, since you've been such a good *boy, have a gummy candy.
		player sparkle Oh boy! Yummy!
		nun flirting Oh? You really like that, hmm?<br>I feel I'm really starting to figure you out~<br>You know, if you like those, I have more inside~<br>Don't be worried, I'm a changed woman, you know~
		trans nun5; Follow the nice lady inside
	`,},
	{index: `nun5`,
	content: `
		eval writeEvent(data.player.currentScene)
		eval raiseTrust('nun', 1);
		eval passTime();
		finish
	`,},
	{index: `statusQuoIntro`,
	content: `
		eval writeEvent('repeat1')
		eval addFlag('nun', 'statusQuoIntro')
		eval addFlag('nun', 'repeat1');
		eval raiseTrust('nun', 1);
		eval passTime();
		finish
	`,},
	{index: `statusQuo`,
	content: `
		nun excited Oh my, you're getting quite close~<br>Have I caught your eye?<br>Or perhaps you have something to confess?
		eval nunHoleCheck();
		eval writeQuoRepeats();
		trans hole-nun; Ask her to use the onahole on her !flag nun holeFinish; ?flag nun holeReady;
		cancel
	`,},
	{index: `repeat1First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('nun', 'repeat1');
		eval raiseTrust('nun', 1);
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
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `repeat2First`,
	content: `
		eval writeEvent(data.player.currentScene.replace("First", ""));
		eval addFlag('nun', data.player.currentScene.replace("First", ""));
		eval raiseTrust('nun', 1);
		eval passTime();
		finish
	`,},
	{index: `repeat2Repeat`,
	content: `
		im repeat2-1
		im repeat2-2
		im repeat2-3
		im repeat2-4
		im repeat2-5
		eval unencounter(data.player.currentCharacter);
		finish
	`,},
	{index: `nunMorningSilly`,
	content: `
		t You lay down for the night. Sweet dreams!
		t ...
		t Morning comes, it's a quiet day in Syrup Town, even in the local church.
		t "Oh, mi amor! But our love, it is... La Forbiddiones!"
		nun tired *Munch* *munch*<br>I wonder if that's a real word...
		im morningSilly1-1
		nun tired *Munch* *munch*<br>... Mm, is that the time? playerF wakes up around...<br>Yeah, I should probably get dressed.
		finish
		eval unencounter("nun")
	`,},
	{index: `wall1-1`,
		content: `
			eval writeEvent('wall1-1')
			eval addFlag('nun', 'wall1')
			eval addFlag('carpenter', 'dailyWall')
			eval passTime();
			finish
		`
	},
	{index: `nunNudity1`,
		content: `
			eval writeEvent('nudity1')
			eval addFlag('nun', 'nudity1')
			eval data.player.location = "lavenderLane";
			finish
		`
	},
	{index: `nunAngelOutfit`,//In-house pickup. Unlocks the angel outfit like any other clothing unlock; it does not play an event.
	content: `
		nun happy Ah, a tour? Of course! Well, these are the pews...
		player sparkle Pew pew!
		nun sleep There's the confessional. It's in a bit of a sorry state though, there's-
		player happy What's in the box?
		nun confused That? Oh, just some scraps, decorations, a nice little dress I found with some filigree I meant to rip out.<br>You're welcome to it if you like.
		player joy Ooh, free stuff!<br>What's with the... nunF?
		nun pent Ah, unloading my garbage onto playerF, but *he's so kind *he takes it as a gift...! Maybe I'm the one receiving something... God, what I'd give to receive a fat-
		player sleep <i>Looks like she's distracted saying the quiet part out loud.<br>Oh well, I'm curious where she got this glowing yellow ring or how these little wings work, but I won't interrupt her.</i>
		nun perverted Mmhmhm~ Oh, delightfully devilish indeed, aren't I? Should I be punished-
		player sparkle I know that reference!
		nun befuddled Eh? Huh? Reference? Sorry, got lost in my head for a moment, what were we talking about?
		eval addItem("angelSet");
		cancel
	`,},
	{index: `angel`,//Triggered by generateHouse on entering the church while the full angel outfit is worn
	content: `
		eval writeEvent(data.player.currentScene);
		eval addFlag('nun', 'angelScene');
		button Finish; generateHouse('nun');
	`,},
	{index: "hole-nun",
	content: `
		eval writeEvent(data.player.currentScene);
		eval passTime();
		eval removeFlag("nun", "holeReady");
		eval addFlag("nun", "holeFinish");
		finish
	`},
	{index: "cherry-nun",
	content: `
		eval writeEvent(data.player.currentScene);
		eval passTime();
		eval data.player.holiday = "";
		finish
	`},
	{index: `morningSquirt`,
	content: `
		eval addFlag('nun', 'morningSquirt');
		eval writeEvent(data.player.currentScene);
		finish
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

//Offers the portal onahole option in nunF's status quo once the artifact is identified, the same gate sadoF uses
function nunHoleCheck() {
	if (checkItem("hole") == true && checkFlag("shop", "holeFinish") == true
	&& checkFlag("nun", "holeReady") != true
	&& checkFlag("nun", "holeFinish") != true) {
		addFlag("nun", "holeReady");
	}
}

//The angel event plays on entering the church only while every piece of the angel outfit is worn
function nunAngelWorn() {
	return checkWearing("Angel Halo") == true
		&& checkWearing("Angelic Robes") == true
		&& checkWearing("Genital Ring") == true
		&& checkWearing("Angel Wings") == true;
}

var eventArray = [
	{index: "nun1", name: "nun1", image: "nun/nun1-2",
	content: `
		nun love Oh~<br><i>This is it. *He's approaching. This is happening for real!<br>Ah! *He's reaching up! For my head? Maybe to slap me to the ground for this stupid animal's arrogance standing above a human?<br>No, the top of my head! Grab me by the- God I wish I had long, human hair- Pull me down!</i>
		t You have to stand on the tips of your toes, but you manage to place your hand atop nunF's head.
		nun excited Ara~<br><i>I had to lean forward... *His height is really cute-
		nun blushing <i>No! Not cute. Dominating! Commanding! Now think, focus before my mind is lost on how best to serve *him.<br>What was it that caught *his eye? Maybe *he wants me kneeling so my fat knockers can serve their purpose as cockpillows?<br>Or maybe he intends to shut this vulgar mouth of mine? Or-</i>
		im nun1-2
		nun befuddled Ah?
		player excited Ehehe~<br>Cute ears... So soft.
		nun panic Am... Is... Are you... Petting me?<br>Have I done something to deserve this? I mean, I had hoped to earn your praise by the time I had been impregnated with your children, but this seems a bit early... To... To...
		im nun1-3
		player Good girl, who's a good kitty~?
		nun broken To, uhm... Ah... Er...<br>What... 
		player sparkle You are!
		nun forced Eh?! But I haven't even-
		player love ...!<br>Hey, you said... <i>Any</i> part of you, right?
		nun love Y-yes...<br><i>Ah. That was just the teasing... How wonderful, I was hoping *he'd have a cruel streak.<br>Ah, and reaching behind me! Oh I was hoping my ass would catch *his attention!<i>
		im nun1-4
		nun excited Ara~?<br>Oh, do you like my tail?
		player love I love it...
		nun Mhm, all the more perfect for you to-<br>For... For you to, hoh...<br>May I ask why you aren't dragging me into place? I'm fine with either my ass or pussy, I can promise...
		im nun1-5
		nun horny Ah, that, um... That does feel good, b-but I can't quite, er...<br>I can't help but feel like- Like something about this situation...<br>Hoh, are you just taking your time? I <i>promise</i> I do not need foreplay, if that's... Hoh... What this is.
		player Taiiiilll... Fuzzy tiger tail...
		nun panic Err, yes! I'm glad you like it!<br>B-but just... Hoh... Just a bit lower there and you'll find-<br>Ah! W-wait! My ears? Again? If you pet both at the same time, then...!
		t ...
		t What follows can only be described as a nightmare nunF didn't know she could have.
		t Her body, her womb, every part of her was screaming, begging for relief.
		nun torogao M-must... Nhhhot... Lose... Consciousness...<br>Endure...<br>Resist urge... To pin down...! God!
		t When she can manage a thought, it's likely about how much of a cunning torturer you must be. Someone so eager to torment that you're willing to suppress your own lust to enflame hers.
		t The only thing keeping her holding on is the thought that any second now, surely, you'll give in like she has. That you'll indulge every dark desire you have, and she wants to be fully cognizant when you do.
		t Eventually, you...
	`},
	{index: "nun2", name: "nun2", image: "nun/nun2-1",
	content: `
		player broken Hohhh~<3
		im nun2-1
		nun orgasm Glhk, glkhk, glllhk-
		nun afterglow Phaaaah~<br>What magnificent spermjugs...<br>I want every corner of my mouth to be flavored with, tainted by this wonderful taste of dick~
		player pent Be... Before you start sucking again-
		im nun2-2
		player forced Ghhhg~! I... Can't even get a... Word in...!
		nun perverted Gllk-gllk-glllk-<br><i>Ahhh... My mind should be on nothing but *his slab of breedmeat, of submission, of worshipping every pulsating vein... I... Should let *him take charge!<br>But... *He's so... Fffucking cute~! I don't even know who's supposed to be the beast here...</i>
		player pleasured I'm... Gonna...!
		nun love Hmmmhhhhph~? <br><i>This is it... I can feel it...!<br>Let me taste... The bliss of being a mind without thought, without doubt, to fill the empty spaces in me that only faith and worship can!</i>
		im nun2-3
		nun orgasm GHHLLLLgggg~<3<br>*Glp* *Glllp*
		im nun2-4
		nun afterglow Puhaaahhhh~<br>Your kind truly is the apex of sexuality~!<br>I can feel my... Ooh, the edges of my vision are swimming!
		player pent Hoh... You... Are probably pushing yourself...<br>Your body needs time to adjust... Probably...
		nun excited Ehehe~ Surely-<br>Surely this has... Awoken you! I can- I can take more!<br>Whether you want to make me your anal princess... A living toilet who's mouth should be on your cock every morning...
		nun afterglow Or... Or nothing more than a walking babysack...<br>My mind... That feeling of submission, of giving up control<br>I'm...  So... Cl...
		t Her face, nuzzling and cheek squished against your slick rod, slowly slides down until her face rests against your pelvis. All while she continues babbling.
	`},
	{index: "nunMorning2", name: "nunMorning2", image: "nun/nun1-7",
	content: `
		t You lay down, feeling sleep take you as soon as your head hits the pillow.
		t Hopefully, this won't be the last time you sleep in this lovely bed. But you won't try to escape punishment if justice comes for you tomorrow.
		t ...
		im nun1-7
		nun broken ...
		nun tired *Snrk*-<br>Huh? Wha... Happun...<br>playerF?<br>Did I... Is that... Sunset...? But it's from the wrong side of the room... Did we...?
		nun sparkle Ah, it must have finally happened! I must have been assaulted! Judging from my position, the drool puddle on the floor, and oh, my, that's a lot of snatch juice...<br>I suppose *he must have slammed my head into the ground a bit too hard before... *He...
		nun worried Except. I'm not sore?<br>No bruises. Not cumflated at all.<br>In fact...
		t Experimentally, nunF licks at the air a few times. 
		nun frown Hmm, any of *his sweat in the air would be gone by now. Plus, I forgot to tell *him the best way to clean up any cumstains is with my tongue, so *he might have cleaned up after *himself. <br>But, dust is actually mostly shed human skin cells. So, if *he exerted *himself at all...
		im nun2-0
		nun panic ... Nothing? What?!
		nun forced Nggh! Fffuck, my pussy is aching!<br>And... It doesn't feel the cause was a thorough brutalizing...<br>This... This must be some kind of test!
		nun horny R-right! Right. I heard that rejecting the lust of going into heat can cause the mind to deteriorate!<br>Perhaps the human prefers *his women to be more... Broken!<br>Which means I-
		nun befuddled B-but... Given the size of the stain from my juices, I must have cum a few times...<br>Did they misjudge? Let me cum by accident?
		nun tired ... Oh... I am... exhausted.<br>I suppose there's nothing for it, this is the perfect time to use that wonderful phrase... "They work in mysterious ways."<br>I'll leave pondering on this until I'm more awake.
	`},
	{index: "nun4", name: "nun4", image: "nun/nun4-3",
	content: `
		player sparkle A visitor? Just who I needed to cheer me up! Who iiiis-
		player pout -it.
		im nun4-1
		nun crying I'm sho *hic* shorryyyy...
		mayor angry I'm sorry to bother you. But nunF said this was all just a misunderstanding.
		nun N-*hic* no, it wasn't, I re-he-he-ally am total scuuuuum!<br>I hurt playerF, and then I lied to you so that I could see them agaaaaain!<br>I'm guilty, and *hic* now *hic* my heart hurts so much mo-*hic* ho-*hic* hoooooree.
		mayor fury How... Dare!
		player shock ...!
		player sparkle You really do remember my name! I guess this was all a misunderstanding after all!
		mayor tired ... Pardon?
		player amused Don't be silly, only you can do that!
		mayor pout ... You know I'm just a small town mayor, and not the president, right?<br>Because I feel like you might actually not know the difference.
		player sleep Sure, sure. Anyways, you're clearly feeling bad about hurting my feelings. You're not scum at all!
		nun That'sh not true! I wash sho horrible to you...!<br>You *hic* can't forgive me that eashily!
		mayor tired I'd like the record to show, I agree with her.
		nun I yuh-*hic*-used you like an objecht to eshcape my shtupid midlife crishish!
		player love Hoh... How midlife we talking here? Like, 35?
		player sleep ... Questions for later.<br>Anyways, nunF, don't you see? 
		player sparkle That pain in your heart, the devastation that came from seeing me sad, that's love! True love!<br>The kind of love that brings you joy just to see someone happy, the kind of love that hurts when they cry, the kind of love...
		im nun4-2
		nun blushing ...!
		player That two best buddies share! I love you like a friend too! We really are friends after all, I'm sorry I doubted you!
		mayor scared Ohhhh! God da-<br>Ho-ly...! Getting friendzoned like that, that's gotta hurt!
		nun love L... You, I...<br><i>That smile...<br>It's like... Angels...</i>
		im nun4-3
		nun That kind, beautiful smile...<br>How did I never see it before? <br>Was I so obsessed with what a human should look like, that I missed something so wonderful right in front of me?<br>I... I want to keep living so that I can see this smile again.
		mayor befuddled Umm... Glad to see you patched things up, I think?<br>Let me know if she <i>ever</i> makes you feel uncomfortable around her again, okay?
		player joy Will do! Bye!<br>See you both later!
		t ...
		mayor tired ... So... You gonna actually explain what happened between you two?
		nun love Those eyes... All of it was true, wasn't it?<br>Being thrown into a dumpster as a child... Being terrified of the dark...<br>To have suffered so much, yet for those eyes to still hold such innocent kindness...
		mayor tired I guess not.<br>The human says weird things like that sometimes.<br> It's probably how they cope with living in a new place. They're just jokes.
		nun love I must show *him the affection *he never received as a child...<br>I see now... I was selfish before. I just wanted someone to decide how to live my life for me... To bear all the responsibilities of my life for me...<br>But now I see what real devotion is like... *He could be the weakest, tiniest creature on the earth and I'd still give my everything for *him...<br>I feel so stupid for ever thinking I was worthy to worship a human before now...
		mayor pout Riiiight. That's what they all say. You may have patched things over with the human, but I won't be sweet talked so easily.<br>You are to make absolutely no unprompted contact with the human. Understand?<br>Absolutely no private time between the two of you unless you have the human's unambiguous, enthusiastic consent, understand?
		nun My prayers truly were answered.
		mayor fury Am I clear?!
		nun love playerF. God. I swear, from this day forward, your life here shall be paradise, and I will serve you forevermore. <br>Properly, and truly, with every part of my mind, body, and soul.
		mayor pent ... Close enough.<br>I swear, if you make me make carpenterF build a jail just for you...
	`},
	{index: "nun5", name: "nun5", image: "nun/nun5-2",
	content: `
		t The moment the church doors closed behind you, you were gently laid down on the floor.
		nun flirting Ara~ Was it these? 
		im nun5-1
		nun You aren't some mindless beast chasing urges, no, but I can tell you're enjoying this, riiiight?<br>So, was it these titties of mine? Do <i>these</i> make you happy?<br>Or has my <i>wobblemeat</i> caught your eye?<br>It really does pay lip service to the human libido that there are so many, many lovely words and phrases to describe the rear end~
		nun excited Bootymeat. Twerkpudge. Fat Plapcheeks. Clapwagon stuffed with pornmeat~
		player forced ...!
		nun excited Ara~! That twitch, that throb, I'm so, so happy this busty sow can transfix you~!<br>Let's consummate our... <i>friendship</i>, now, yes?<br>Before one of <i>them</i> decides to interrupt us!
		im nun5-2
		t You can see a twitch in her eyes as her pussy is spread open by your dick. She's trying to resist the instinct to roll her eyes, like she wants to burn every detail of your expression into her mind.
		nun excited Ehehe~<br>Don't hold back~<br>Let your expression show, don't suppress your moans! It would make me so happy if you could show me I'm doing a good job~!
		player pleasured Hoh~!
		nun love ~<3<br>So beautiful...<br>This is it~<br>I truly have found purpose, my kind's true purpose, and place~
		im nun5-3
		nun orgasm Ghoooh~<3<br>More! I want to pleasure you~!<br>I'll bounce on this cuntsoaked dick for as long as it takes~!
		nun perverted Mmm~! Amazing~!
		player orgasm I'm... Gonna...!
		nun sparkle ...!
		t Just as your legs shake in a familiar quiver, she suddenly stops, slams her ass to the base, and grabs you by the ankles.
		nun joy This is it...!<br>The calm... My head's clear again, all at once!
		player torogao So... Close...!
		nun sleep When I first heard about it, I didn't understand why. The phenomenon right before a woman's womb is claimed forever by a human, the fog of heat vanishes.<br>I was frightened of it at first, but now I understand...!
		nun mocking It's for <i>you</i>! So that I can ensure you feel the height of pleasure before my body can pledge its final gratitude and service to you~!<br>So...!
		t *WHAP*
		t She rises, and slams her fat, jiggly ass back down.
		player forced Ghhhgg~!
		nun love Hoh... Let this moment... Last as long as it can...!
		t *WHAP*
		nun love Give me everything. Let's pass this final line... Together!
		player orgasm Hohhh~!!!
		im nun5-4
		nun torogao NGGHHHH~<3<br>It's heeeeere~!<br>Feel... Good...! Fall in love... With my pussy~!
		t With the finish line of climax finally crossed, she stops holding back.
		t She purrs, a sound barely audible behind the *THWAP* *THWAP* *THWAP* of her ass as she milks out every drop she can. Holding and lifting you by the ankles to make absolutely certain the rictus of pleasure can't stop the two of you from mating.
		player broken Gy... yohhhh~<br>Hhhhdd~
		nun torogao Yessss~! Let it out, let it all out, my precious, wonderful playerF~!
		t ...
		im nun5-5
		nun laughing Hah... Hahaha~
		player pout ...
		nun flirting Ohhh~<br>Don't give me that look~<br>I didn't lie, you know, I actually do have plenty more~<br>Here, have another gummy.
		player sparkle ...!
		nun excited Mmmmhmhm~<br>There's the smile I love to see, good *boy, good *boy~<br>Take whatever you like, and don't forget, you're welcome back here anytime.
		player sleep Well... I'm glad you're more in touch with your feelings, but it seems like you didn't change too much, nunF.
		nun happy Oh, but I have~!<br>I promise, though it's hard to put into words, I truly feel changed, and now I really am here for anything and everything <i>you</i> desire.<br>I'm sure I still have a lot to learn though. So please, let's learn what true devotion can mean together, okay?
	`},
	{index: "repeat1", name: "repeat1", image: "nun/repeat1-1",
	content: `
		player scared Burglars!
		t You act on instinct. Your years of city life have trained you to respond automatically to a door left ajar.
		t Immediately, you're inside the church, ready to help loot the place, before you remember you actually like the owner of this place, you're in Syrup Town, and nunF probably just forgot to close it.
		player worried Sorry for barging in! You left the door open!<br>... nunF?
		nun special secret; Over here, little lamb~
		player sleep ... You realize tigers eat lambs, right?<br>I'm coming over there anyways, but you may wanna think of a different pet name for me.
		nun special secret; Welcome. I've prepared this just for you~
		player confused A red curtain? Are you changing behind there?
		im repeat1-1
		nun flirting Oh, lost sinner. You've arrived at the confession space~
		player sleep Lost sinner is much better.
		player curious ... Aren't confessionals usually wooden boxes? Y'know, to give privacy?<br>carpenterF could probably build you one, if you can't afford it, I could cover it for you.
		nun worried ... But I like the curtain.
		player shock Oh! Geez, I didn't mean to rain on your parade!<br>It's way more convenient like this, actually. You could take it down whenver you want, and get all that space free.
		nun sleep You're exactly right.<br>Plus, it has a wonderful mystique, while avoiding feeling trapped in a suffocatingly small box.
		nun excited Speaking of mystique, I had quite the plan for this confession booth.<br>I'd encourage you to seduce and mate with the fertile women of the town, all while letting you relieve your 'sin' through the curtain as you molded Syrup Town into a paradise for relieving your human urges~
		player amused ... And then when you thought about it again, you-
		nun flirting Fantasized about sucking your divine member from behind the cloth, yes~
		player sleep Alright, alright, you clearly worked hard on this, so I'll bite.
		nun excited I won't~
		t You get yourself hard and ready and step up to the curtain, allowing nunF her usual moment of starstruck awe, before...
		im repeat1-2
		nun love Ghhhllfff~<3
		player forced Hhhn~!<br>I always forget how... Relentless you are!<br>I really am weak to nuns...!
		nun pleasured Mmm~ Mwah!<br>Tell me, tell me about your life here in town~! Spill <i>everything</i> here in the confessional!
		im repeat1-3
		nun love Gllk~ Glllk~
		player pent Hoh... Well, I know what kinda stories you're hoping for, so...
		player forced Ghh! I found a girlfriend... And got her completely addicted to anal...! ?trustMin wolf 7;
		nun perverted Mmm~! <br><i>How debaucherous~! To take a lover, only to teach her a lifestyle purely devoted to pleasure~! ?trustMin wolf7;
		player forced Hhh... I... Got someone pregnant...! Out of wedlock! ?flag milf pregnant;
		nun love Mmmm~<3<br><i>Incredible! Already, you've begun to sow your seed across town... It must be that gardener, milfF! I'm so jealous...! ?flag milf pregnant;
		player A... Gghhh... I'm a walking pheromone machine! I'm turning the town into an orgy-fest just by... Gh... Gonna...!
		im repeat1-4
		nun orgasm GHHHHHLLLK~!
		player pent Hoh... Hoh...<br>That was... Quite the choking sound... Are you-
		t You draw the curtains open to make sure everything's fine.
		im repeat1-5
		nun sleep <3
		t An expression of pure peace is painted across her face.
		t And also cum.
		player amused I'll be sure to let myself in next time, alright? No need to leave the door ajar.
		nun sleep Anytime. Please, don't be a stranger~<3
	`},
	{index: "repeat2", name: "repeat2", image: "nun/repeat2-1", requirements: "?flag "+character.index+" repeat1;",
	content: `
		t You head inside the church, and find yourself greeted by...
		im repeat2-1
		nun sleep Hmm hm hmm~<br>*ahem*<br>Wiggle~ Wiggle~
		player confused Are you-
		nun shock Eeek!<br>Ah, playerF! I didn't hear you come in!
		player happy Yeah, the different angle makes it tough. Maybe if you got a bell for the door?<br>Also, were you saying 'wiggle wiggle' aloud?
		nun blushy Maybe...<br>I remember the town carpenter had a similar idea to this one, but I didn't like the thought of actually being stuck... <br>Still, I was looking forward to seducing you...
		player worried Ah, dangit. It would have worked too, I bet, if I wasn't distracted.
		player sleep Here, I'll go back to the door, and-
		nun amused It's not really necessary...
		player angry It is! Mature woman booty is something to be celebrated and adored!<br>Now, let's restart the scene!
		t ...
		t You head inside the church, and find yourself greeted by...
		im repeat2-1
		player love Whoaaa~
		nun blushy Welcome, weary traveler...
		nun befuddled Or... Wait, no, lost sinner. Hold on, sorry, can we retry just one more time?<br>And wait, before that, honest opinion, do you think I can pull off saying 'Ara ara~'?<br>I really like how it sounds, but I feel a little self-conscious about-
		player love ...!
		t Hypnotized from the moment those words left her mouth, a switch flips in you.
		nun confused playerF? You're awfully quiet. Are you distracted by my tail?<br>Now, I know you like fluffing it, but I was hoping we could-
		im repeat2-2
		nun forced Ghhhi~!<br>playerF! What's gotten into you!
		nun pervert Mgghh~! You're thrusting into my pussy like you're possessed!<br>Not even stroking my tail~! Ough~!<br>Hahhh~! Was it something I d-did?<br>Said?
		im repeat2-3
		nun Ghhh~! So h-hard to... F-focus!<br>B-but... I can feel you thrusting even faster...! S-so!
		t Trying to keep herself tight, nunF can't help but relax into your grip and against your thrusts, the huge wobbling butt in front of you jiggling like jelly.
		t But, she knows she has one last opportunity. That moment of clarity right before a creampie!
		nun awe ...!
		nun flirting Ara~!<br>Good *boy, cum for me~! Make this old woman bear your children~!
		player torogao Nghhh~!
		im repeat2-4
		player orgasm Ghouhhhh~!
		nun ahegao Aaaaahhhh~! Yes, cum inside me~! Baptise my womb~!
		player pent Gh... Hhh...
		nun afterglow Hahhh~<3<br>S-stay conscious... Hold on... To... It...!
		t Her mind, very nearly overwhelmed, hangs on by a thread as nunF fights the urge to slip into a fuckdrunk state.
		player shock Wah! nunF, sorry about that, I lost control of myself there!
		nun torogao Th-that's... Ghouhhhh~
		t Before she can manage a response, nunF's body quivers, letting a healthy splat of cum and pussy juice leak out.
		nun broken Alright~ Good *boy~<br>I... Need a moment to rest, if that's alright...
		player amused Sure thing! Let's play again some other time, okay?
		t And so, you depart.
		im repeat2-5
		nun afterglow Hahah~<3<br>S-stay awake~<br>Have to... Remember... Weakness~
		nun broken W-weak... Ara~<br>Fetish for... Ghouhhh~
	`},
	{index: "wall1-1", name: "Hole in the Wall - Nun", image: "nun/wall1-1-light", requirements: "?rimming; ?trustMin nun 7;",
	content: `
		player Anybody in the wall today?
		carpenter worried Nope. Actually, I had it scheduled- Well, reserved for-
		player befuddled You run the wall on a schedule?
		carpenter annoyed Obviously. You know how much everyone in town wants 'anonymous' sex with you? <br>Plus, if you don't actually show up, it's still a surprisingly comfortable spot to nap.<br>The backlog is several days deep, and I was certain the person I reserved it for would say yes, but she turned it down, saying she already had one at home.
		carpenter worried Which leaves me in a difficult spot. Since I told people the wall was booked for days in advance...
		player worried If they see it empty, they'll all fight over the open slot.
		player sleep Thankfully, I have just the solution.
		carpenter sparkle Oh?
		t ...
		nun tired Mmgh... Maybe I shouldn't have turned them down...<br>My confessional may be more intimate, and closer to home, but how could I just turn down public sex with playerF like that?<br>Plus, if they already desire to use someone, why shouldn't it...<br>... Be...
		nun love My. God.
		im wall1-1-light
		t *CLAP* *CLAP* *CLAP*
		player annoyed Hellooooo~! Anyone there?
		nun This world truly is unfair.<br>I shortsightedly tossed away an opportunity to breed with you, and yet, I am rewarded past my wildest dreams.<br>Oh, heaven above, how can I show you my gratitude for a true miracle on earth?<br>Ah, I know...
		nun sleep Bless us, O Lord...
		im wall1-2-light
		nun And these, thy gifts...
		player joy Ah, hey! Hello!<br>Are you talking back there?<br>I didn't actually have a plan for what we'd do while I'm in here, so feel free to do whatever you want!
		nun For which we are about to receive.
		nun flirting Thy booty. Amen.
		im wall1-3-light
		player pleasured Hoh~!
		nun excited Aheheheh~ *Slurp*<br>What sinful, yet glorious flesh~ Truly, at this altar, I can see the truth...<br>All those times I prayed with what I... *Snnnnrf*~ Fuckkkk~<br>What I thought was all my heart~<br>The devotion I displayed wasn't even close to the gratitude I feel now~~!
		nun flirting I am unworthy of marriage to this perfect idol, yet... Please! Allow me to show you the affection of a lovestruck, obedient wife! 
		im wall1-4-light
		nun sleep Mmmm~hmhmhm~
		player pleasured Hiii~! Making out with my butt with her whole face... And that super pervy giggling to herself...<br>It must be...
		player sparkle nunF! Hiiii nunF!
		t It's tough to communicate through the wall, so you wiggle and clap to try and communicate by the starstruck... No, buttstruck nun on the other side.
		nun love Mmmhhhooorowwwr~<br><i>Ah, so this is the bliss of a loving kiss... And the joy men must feel, sticking their face between a pair of breasts...<br>All this, plus this divine, EXQUISITE drug~<3<3<3
		nun flirting Ahhh~<br><i>This shaking... Oh! Their balls are throbbing on my chest~!</i>
		nun love <i>I could die happy, in this moment, if I were to spill holy seed... If I were to be baptised, and reborn~!</i>
		player blushy Ooh! H-hey, rimming, and stroking, it's a little overstimulating!
		player forced Ghhh~!
		nun pervert Mmmmhmhmhm~<br><i>Some precum squirted, I can feel it! Did I cum just from feeling it?<br>Ah, trying to measure things like that is a waste when there is such a feast before me~!
		nun ahegao Ahahaha~!
		im wall1-5-light
		player orgasm Hohhhh~!
		nun <i>Cum! I can feel the warmth! And his ass, oh how it clenches, like I am being embraced! Accepted!<br>Thank you, thank you~!
		player pent Hohhh... Whoa... That was intense-
		player forced Ghhhii~! Wait, I just came!
		nun afterglow 'hank 'oo! Ahahaha~! 'hank 'oo~!!!
		player torogao Nghhhh~!
		t ...
		nun horny It's incredible!
		carpenter tired Right, right. Uhuh. So how much of a mess did you-
		im wall1-6
		nun excited Such a wonderful font of holy grace! The altar you have created surpasses even my own church!<br>I must spread the word!
		carpenter scared Eh? Absolutely not, if they take half as long as you did playerF might as well live in that wall!
		carpenter worried <i>She's gone off the deep end... I can't have a crowd in the alley 24/7, I'll never have a good night's sleep again!<br>Looks like I'll have to play dirty... Sorry playerF.</i>
		carpenter teasing You know, if too many people knew about it, you won't be able to have a second turn with playerF~
		nun love I can... Pray at the altar again?
		carpenter sleep Hehe, yeah. And again, and again. But keep it to a reasonable-
		carpenter shock ...! Where'd she go? I closed my eyes for just a second and-
		player orgasm Ghouuhhhh~<3
		carpenter tired ...
		carpenter flirting Well, if you can't beat 'em, get in line and see what all the fuss is about.
	`},
	{index: "nudity1", name: "Public Indecency", image: "nun/nudity1-1a",
	content: `
		define nunsado = dual sp1 nun; sp2 sadogato;
		player sleep Ah, what a lovely day today! The wind in my hair, the smell of... Whatever nice smell that is.
		player worried Though, it feels like I'm forgetting something.
		player happy Ah, it's probably not important. It's too nice of a day to get hung up on stuff like that.
		t ...
		nun tired ... So. Enjoying the tea?
		sado frown ... It's fine.
		im nudity1-1a
		nun ...<br><i>She's really not giving me anything to work with.</i>
		sado tired ...<br><i>Why did it have to be so early in the morning? I can hardly think of anything to say.<i>
		nunsado <i>Why did mayorF think this was a good idea in the first place?<br>"You'd be great friends!"<br>"You should get out more!"<br>"You're both... Well... Weird about the human, you'll have plenty to talk about!"</i>
		sado tired <i>... What did she even mean by "weird" anyways?</i>
		nun tired <i>If anything, mayorF is the weird one. My playerF shrine is a perfectly normal hobby.</i>
		nun pent ... Hm. Do you... Smell that?
		sado befuddled *sniff* *sniff*<br>Why am I smelling the-
		im nudity1-2-light-masc
		player joy nunF! sadoF! I didn't know you guys were friends!
		nunsado love ...
		player sparkle It's so wonderful to know you guys are getting along!
		sado Yes, it's... Of course we...
		nun Fellow cats... Stick together...
		player curious What are you two...
		player shock Oh! Right, I'm still naked! Sorry about that, talk about awkward. Crazy how even without clothes I'm still so sweaty today...
		im nudity1-3-light
		player tired Jeez, speaking of sticking together, am I right, girls?
		im nudity1-4a
		nunsado love ...!
		player amused Well, I'd hate to interrupt you two bonding, I'm gonna head back home and get dressed now.
		player happy Bye!
		nun pleasured Ohh... If only I had a camera...
		sado blushy I... W-well, I know a spell that can replay memories, I was actually going to head home, maybe replay it and draw *his, well...
		nun awe Really?! C-could you make a copy? I could place it on my shrine!
		sado awe You have shrines too?<br>Actually, I have a few things they left there during past visits, and, well...
		nun excited Sacred artifacts... Would you show them to me?
		t And so, using the greatest social lubricant of all; big booty, the two cats grew a little closer while you head back home.
	`},
	{index: "angel", name: "Angel Outfit", image: "nun/angel0",
	content: `
player happy nunF? I have something cool to show you!
nun sleep Juuust a moment~! What is it?<i>My, back again so soon? I must be blessed! Perhaps this is my opportunity to... To...</i>
player sparkle Look, I'm dressed as an-
t You jump in place as she lets out an uncontrollable, full body scream.
t The sort you should really reserve for when you break a bone, yet...
im angel0
t What comes out of her mouth is far from articulate, you'd swear she's just stepped on a live wire or something before she falls over.
player confused I'm, uh... Glad you like it. Bit of an awkward moment to have a religious experience though.
player befuddled Wait, is it though? I mean, we're in a church, so...<br>What's that noise?
t Something seems wrong, you can sort of hear... A choir? And did the lighting in the room get brighter?
t Looking for the source of the sound, you look upwards to see...
im angel2
outfit nun costume
nun sleep Ah, I've done it~<3 I've seen all I need to see~<3<br>Oh heaven, please grace me with but a tiny bit of the joy I had in life, and I'll be satisfied.
player shock !!!
player pent Oi... You can't just leave like that...<br>Jeez louise, come on, pretending like you've shed all worldly desires... Fine, let me help you.
t You gently turn the drooling, babbling tiger lady over.
player frown Alright, just so you know, I don't use this technique often. You're about to experience a whole...
im angel1
outfit nun clothed
nun after Abbbababahh~
player forced Ghh! New world of pleasure!
outfit nun costume
nun love Eh? P-pleasure? New world?
player pent Hoo, it's working? Alright, plus, you said you wanted to have my kids, right?
nun awe Ahhh, b-bear your children?<br>Ohhh... H-heaven, umm... Could I, umm... Sorry, could I maybe get a rain che-
im angel3
outfit nun clothed
nun pleasured -Eeeeeeck?!
player sparkle You're back! Welcome home!
nun orgasm Ohhhh~! What... Is this!
player pout I'm... Hmmoh, using max power! I don't normally use this, it burns up a little of the fat reserves in my thighs, but I gotta show you that life down here is beautiful!
nun Ghoooh~!
im angel4
nun Angel! Blessingggg meeee~!
player pent Geez it's me! playerF!
nun love playerF... playerF... Say it. My name. While you're inside. I want this body to learn it from the inside out.
player pent nunF-!
nun orgasm GHHH~<3
nun shock W-wait, that angle- my legs-!<br>Ah, wait, my mind's-
player Ghmmminnnggg~!
im angel5
nun torogao Hhhhhhouhhhh~<3<3<3<br>So deep, not a dropppppp spiltttt~
player Nghh, not done yet!
nun ahegao Ghyyyyaaaaa!
im angel6
nun Breakingggg~! Breagighhhhhh~<3!
player fury More, more! More!
t Feeling an unusual power coursing through you, you keep thrusting into nunF's soaked pussy without even the slightest care that you're actively cumming.
t The next moments are a glorious, golden blur...
t ...
player pent Hmm... Okay. Uh... Yeah, definitely.
im angel7
nun broken Ghhhyouhhhhhh~ Thagyuuuuu~
player Definitely went overboard, yeah. I'll, uh... Probably wait on one of the pews for you to come back. Brain, you can take another quick break, I'll entertain myself.
player sparkle Pew, pew pew, pew!
t ...
t After waiting well into the evening, eventually nunF returns to her senses.
t And sure, while she can't so much as walk, it's a lot better than when she was on the other end of a little bit of divine inspiration.
nun worried Hmm... Still, I could <i>feel</i> my soul leaving my body, I... I don't know how to explain how... <i>Real</i> it felt.<br>And where did you get those cutie-wooty little wings from~?
player worried From that box you gave me before.
nun confused Odd, I don't remember...
player amused It was probably angels. They can be mischievous sometimes.
nun befuddled ... Mischievous?
player smug Well, yeah. I mean, they're up there for all eternity learning new skills and hobbies, fawning over humans, perfecting their bodies to look like the most super cute boys they can. <br>Y'know, heaven.
nun befuddled ...? Where on earth did you learn that?
nun excited And can you tell me more~?
player happy Maybe some other time. Glad you're back in the land of the living! See you later!
nun seductive Mmm, I hope s-
nun forced A-ah~!
player pent Seriously? You're gonna start masturbating the second I leave?
nun love W-when you turned around just there, a-are... Are you wearing anything underneath that, or-
player smug <3
nun torogao Nghh~! S-so sore, but I can't s-stooooop~!
	`},
	{index: "cherry-nun", name: "Star-Crossed Cherry - Nun", image: "nun/cherries1-1",
	content: `
define playerduo = dual sp1 player; sp2 player;
playerduo sparkle nunF!
nun happy playerF, I-
nun awe ...<br>There are two of you.
player happy We found a magic cherry!
player sleep And we checked. Neither of us are evil!
nun love Two humans. In my church...<br>Ohhh... Have I become the prey?
playerduo happy Soooo, what do you wanna do now that there are two of us?
nun flirting ...
im cherries1-1
nun Would either of you care for some... Candy?
t ...
im cherries1-2
nun ahegao Hahhhhhh~!<br>My ass... And my pussy at once!<br>I never thought I'd feel this combined pleasure since I swore myself to you!
player annoyed Hey, this isn't candy, this-
player panic Wait, I wanted to say that line!
player confused Then why did you take-<br>Wahh, she's squirting everywhere again!
player fury I didn't take a position, you saw her tackle me! I thought you started the anal to help me, not steal my... Nhhhhg... Joke!
nun torogao Ngghhh~!!! B-both of you, harder, faster!
playerduo panic Yes ma'am!<br>Alright, team attack?<br>Team attack!
nun shock E-eh? Wait, don't push, I'll!
player pout This is the position of our team attack! Bestie, you alright?
player panic I'm being squished by huge cat donk!
player fury Fight! Use every muscle in that body! We've unleashed the beast, we need to pacify her!
nun panic B-beast?! Wait, <i>huge</i> donk, it's not that-
playerduo orgasm Hwooooa!
im cherries1-3
player pent Hoh, she's really- she's really taking both-!
player forced I can't- I can't hold it-!
im cherries1-4
nun orgasm NGGHHHH~<3
t Whatever she had left to say comes out as a wet sound and a very sincere moan.
im cherries1-5
nun ahegao AAAAAAAH!
player orgasm Cumming~!<br>H-hang in there!
player torogao N-not... Gonna make it! Mating press, plus badonk...!<br>Tell my *bro... I love *him!
player scared Tell *him yourself!
player crying I... Just... Did...!
t *POOF*
player panic SECOND COMING, NOOOOO!
t And just like that, one of you is now a very theologically confusing puff of sparkly smoke.
nun ahegao Agwaaahh, awawawa~<3
player crying You damn maniac, you were the best of us! Now you've left your best *bro all alone, and I gotta be the one to deliver the news!
player worried ... To myself.
player surprise Oh! Hold on, wait, I should have made a holy trinity joke! Aww man, that would have been great!<br>Wait, nunF, are you sensate enough to have heard that? With your brain I mean, not your ears.
nun afterglow Ah-hhh... T-three~<3
player crying Noooo! I lost my better half, and the chance for a better joke! Wahhhh!
t And so, overwhelmed by tragedies, you carry your heavy heart with you out of the church doors. Your tears with you every step of the way, along with memories...
t Of a friend.
	`},
	{index: "hole-nun", name: "Portal Onahole - Nun", image: "nun/onahole1-1",
	content: `
player curious nunF? You left the door... You always leave the door unlocked. I should stop mentioning it.
nun happy Oh, playerF!<br>Hmm, you look puzzled.
player tired Contemplating doors.
nun sleep ... Yes you are. Care to contemplate something-
player happy Here!
im onahole1-1
nun befuddled ... What's this?
nun angry Who gave this to you?! Where did you find this?! What filthy mongrel-
player shock Wait, wait, calm down! Spread it open!
nun pent ... playerF, you see, this isn't made for, er, me. It's for-
player sad You don't trust me?
nun worried ... Okay. I'll-<br>Oh!
player sparkle It's magic! It's connected to you!<br>It was pretty fun to use on shopF, you want me to try it on you?
nun awe ...
im onahole1-2
nun love I... I have been blessed with an idea?<br>No, this could only have come from my own mind.
player befuddled Really? I mean, plenty of ideas come from space and stuff. Maybe heaven's sent you a message, did you try asking?
nun seductive ... The Lord has declined to comment.<br>And to answer your question, no, absolutely not, you may not use this on me.
nun excited But come here, to my room, and let me just lock the doors real quick before I forget.
player surprised Whoa! I was <i>just</i> contemplating those!
t ...
player happy Wah! What are we gonna do on the bed, big sister?
nun love ... Eh?
player worried ... Because you're a nun?
nun excited Oh... Ehehe~<br>Right, yes, I got distracted there. Well, since you brought me such a ...<i>Sinful</i> little toy...
im onahole1-3
nun Mmmhmhm, little lamb, I think you need some correction~<3<br>Sex, mating, <i>breeding</i> is something to be done with a fat cock like this in a woman's pussy, you know, not plastic like this.<br>A tool like this is only for teaching si-iiii-
im onahole1-4
nun perverted -innnn~<3
player forced Ghh-! That's- that's cold-? No, that's warm, that's-
nun love Yes. It's me! All of this pink blasphemy is me. Ohh, the bliss for you to be my church and in my cunt at the same time~!
player forced Ghh, big sis!
nun You would de... Depriiihhhhh~
im onahole1-4
nun broken -Hhhhiii, vvve me...
nun forced Ghhh! No, this is punishment, penance!
player torogao G-... Gonna... Cum!
nun forced Ggh, that pulsing, I feel it!
im onahole1-5
nun orgasm Ghhh~! There- there it is, the stretch! The warmth! Ohh, it's wrong... S-so... Bad! Wasting...!
t The toy in her paws and the empty air under her hips are doing the same work. It's a mindbending situation for her to ride nothing and yet take everything.
player torogao nunF I'm-!
nun ahegao Make a mess of meee! That's an order, and... Blessinggg~!
im onahole1-6
player orgasm Hohhhh~!
nun afterglow Hah... Haaaah~<3
nun awe A-ah... Wh-wh-wait, I can... Actually...
im onahole1-7
nun afterglow Ahaha~<3 Alwaysh wanted to... Tashte <i>and</i> shtuff my womb~<3
player broken Hoh... Hoh...
nun Ehehehe~
t One of you feeling that post-nut exhaustion, the other of you guzzling a post-nut drink, it takes a while until either of you have the energy to get moving again.
	`},
	{index: "morningSquirt", name: "Morning - Sleeping Heat", image: "nun/morningSquirt-1",
	content: `
		t It's a new day in Syrup Town, and the local church is quiet.
		im morningSquirt-1
		nun sleep Mmh... playerF... Don't... Don't go in the dumpster... N-no, there's a chair out here, just...
		im morningSquirt-2
		t Her hips twitch. Her paws knead the sheets.
		nun sleep Right here, you know... And also... E-eh? Wait, y-you're... You're actually g-gonna... Oh, God, you're-
		im morningSquirt-3
		nun torogao NGHHHHH~!
		nun broken H-hoh... W-what an intense dream~
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