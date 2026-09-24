var character = {index: "tink", flags: "", fName: "Tink", lName: "", color: "#D6949F", outfit: "clothed", emotion: "happy", trust: 0, encountered: false, author: "EvilCrucifix", gender: "female"};

var logbookArray = [
	"im images/tink/clothed/happy; title Tinker; Syrup Town's self proclaimed rebel and often reluctant mechanic. tinkF is often on the fringes of Syrup Town looking for rare human artifacts to learn more about their legendary undefeatable, inexahustible lust.<br>When not indulging her curiosity tinkF helps keep the town running by fixing anything the town's residents ask her to, from watches to computers very little falls outside her mechanical expertise.",
	"im images/tink/logbook2.png; title Punk-Rock; ?trustMin tink 2; Bold and brash tinkF's attire is an extension of her personality. Her choice of spiked choker and wristbands while intimidating are ultimately harmless after careful blunting, even her choice of wielding goggles are carefully curated to enhance her rebellious aesthetic.<br>Of all her attire tinkF is most proud of her handmade vest, embroidered with patches that she claims each represent a separate trip to the big city.",
	"im images/tink/logbook3.png; title Sensual Curves; ?trustMin tink 3; tinkF's breasts are well proportioned with the rest of her body, balancing her wide hips and thin waist giving her a curvaceous figure. Unlike many of the town's residents tinkF's breasts didn't grow more sensitive with your arrival, rather her entire body has become more sensitive ensuring the slightest touch will elicit a reaction.",
	"im images/tink/logbook4.png; title Possessive Posterior; ?trustMin tink 4; Perfectly round and heart shaped tinkF's ass hides a tight and firm pussy that seems almost chaste at first. That is until either of her needy entrances find a rod. Deceptively strong tinkF will keep you in place and ride you until she has been properly satisfied.",
];

var achievementArray = [
	//{index:"93"+character.index+"Friend", frame: "ultraRare", name: "Doe's BFF", requirements: "?trustMin "+character.index+" 0;", description: "Become doeF's best friend and help her grow even closer with her mother.", image: "doe/achievement1",},
];

var itemsArray = [
];

var shopArray = [
];

var pickupArray = [
];

var morningArray = [
	{index: "morning1", priority: 99, requirements: "?trust tink 1;", unique: false,},
];

var encounterArray = [
	{index: `intro1`, name: "Explore the area", requirements: "?location lakesideRuins; ?trust tink 0;", altName: "", altImage: "",},
	{index: "tink1", type:"walking", requirements: "?trust tink 2; ?location riversideRoad;"},
	{index: `statusQuo`, name: "Visit tinkF", requirements: "?location riversideRoad; ?trustMin tink 3; ?trustMax tink 5;", altName: "", altImage: "",},
	{index: `robo0`, name: "tinkF is loudly working on something!", requirements: "?location riversideRoad; ?trustMin tink 3; !flag tink robo;", altName: "", altImage: "",},
	{index: `statusQuo`, name: "Visit tinkF", requirements: "?location riversideRoad; ?trustMin tink 3; ?flag tink robo;", altName: "", altImage: "",},
	{index: `plug2Tink`, name: "Ask tinkF about the strange artifact", requirements: "?location riversideRoad; ?trustMin tink 3; ?flag deity artifact; ?trustMax deity 1; !flag deity tinkAsked;", altName: "", altImage: "",},
];

var sceneArray = [
	{index: `intro1`,
	content: `
		t Approaching the ancient ruins at the edge of the lake, you're surprised to hear someone else angrily muttering to herself.
		tink frown Dang... Darn... Could've sworn there was something in this region.<br>I swear, those foxes have no respect for <i>real</i> archaeology.
		im intro1
		t Rounding the bend, you're immediately presented with a cornucopia of  buttmeat and wagging tailfluff.
		player love Tail... Fluffy...
		tink shock Eh?! Whoa, that-
		player shock Ah, sorry, I'm-
		tink blush That's some serious dedication! And here I was thinking I was the most nuts for human culture in town, but look at you!<br>That's the most convincing human look I've ever seen, you shaved your fur and everything!
		tink happy Ah, where are my manners. The name's <input type='text' id='nameSubmission-tink' value='tinkF'>! 
		button Continue; renameCharacter('intro2')
	`,},
	{index: `intro2`,
	content: `
		im intro2
		tink sparkle And lemme guess, you're out here looking for artifacts too?
		player happy The name's playerF, nice to meet you.<br>And I am a human.<br>... I think. I haven't actually checked in a while.
		tink smug Riiiight. Sure.<br>Here.
		t tinkF grabs a can from a nearby knapsack, overflowing with what would generously be described as filthy junk. The can at least is sealed and mostly clean.
		tink Here. A fellow human enthusiast is always welcome.<br>I found a whole crate of these the other day, they're a great source of energy!
		player confused Hmm. some kind of drink? But I don't recognize the brand... And I don't see any nutrient info...<br>Oh well, if it's good enough for someone fluffy as you...
		t You open the can, hearing a sharp *FZZZZ* before taking a quick sip.
		player sleep ... This is meth. I'd know this taste anywhere.<br>Either that or it's caffeine, or sugar. But it's definitely one of those three.
		tink happy Hmm. No idea what that first one is, but man, am I ready to work!<br>You wanna take over here? Among the junk there's a lot of-
		tink shock Oh! Oh dang, speaking of junk, I just remembered mayorF asked me to deal with her printer again!<br>Sorry to bail on you, feel free to dig around here!<br>If you find anything made by humans, show it to me before you sell any of it, please!
		player befuddled O... Kay?<br>Wait, where can I-
		t But before you can ask her anything else, like where she actually lives, she's raced off out of sight.
		player sleep ... Yeah, this stuff is probably too strong to be sugar...<br>*Siiiip*
		special Thanks to the energizing power of soft drinks, you feel like your stamina has improved!
		eval raiseTrust("tink", 1)
		eval passTime();
		finish
	`,},
	{index: `morning1`,
	content: `
		eval raiseTrust('tink', 1);
		eval writeEvent(data.player.currentScene)
		trans cancel; Finish
	`,},
	{index: `tink1`,
	content: `
		eval raiseTrust('tink', 1);
		eval writeEvent(data.player.currentScene)
		finish
	`,},
	{index: `statusQuo`,
	content: `
		tink excited H-hey! You find something already?<br>Sorry I'm such a mess, did you know masturbation apparently feels amazing?!
		tink blush W-well, you aren't in heat, so I doubt you'd be interested.<br>Anyways, if you found anything, I can take a look at it for you.
		eval tinkQuo();
		trans cancel; Finish
	`,},
	{index: `robo0`,
	content: `
		eval raiseTrust('tink', 1);
		eval addFlag('tink', 'robo');
		eval writeEvent('tink-'+data.player.currentScene)
		eval passTime();
		finish
	`,},
	{index: `pillIdentify`,
	content: `
		player happy I found a strange glass bottle of fluid that-
		tink worried Lemme stop you there. Anything old enough to be left behind by humans, well...<br>There'd be no liquids left. I'm 100% certain of it.<br>You're better off taking whatever you found to someone else, sorry.
		tink sleep See, humans lived in this area hundreds of years ago.<br>Plus, they didn't bottle things in glass, they used this stuff called "PET", which simultaneously held fluids <i>and</i> flavored them with stuff called micro-plastics!
		player befuddled I genuinely do not know where to start responding to that.<br>... Anyways. I'll just find someone else to help figure this out.
		eval addFlag('tink', 'pillFail');
		trans cancel; Finish
	`,},
	{index: `watchIdentify`,
	content: `
		player happy I found this stopwatch, it's-
		tink sparkle Ooh! Lemme-
		tink frown Ah, nope. Not human. This is some pretty high quality craftsmanship.<br>See how it still looks pretty new? Towards the end of their time here, everything humans built or bought started getting really low quality. An authentic human watch would be crumbling in your hands by now.
		tink happy Basically, it was because of this process, kinda like metamorphosis, see?<br>Humans got really good at making things, but they needed to keep selling, keep building, so they started making stuff bad on purpose to sell more!<br>Their culture is really complex, so I get why you'd be confused.
		player crying Mankind couldn't escape enshittification, even here...
		eval addFlag('tink', 'watchFail');
		trans cancel; Finish
	`,},
	{index: `holeIdentify`,
	content: `
		player happy I found a human sex toy, it's-
		tink frown Nuh-uh. Nope. No thanks.<br>Sorry, but a sex toy you dug up is either really recent, and therefore not human-made, or it's ancient and I don't wanna even look at it.
		tink crying I know it seems a bit shallow, but I only really care about the parts of human culture that were just sex-adjacent.<br>I know nothing in human society was totally non-lewd, duh, but still...<br>Sorry. Take it somewhere else, please. Actually, just down the street is a store, the shopkeep there would probably get a kick out of it.
		tink blush Eh... Wait. It might actually be one of hers!
		eval addFlag('tink', 'holeFail');
		trans cancel; Finish
	`,},
	{index: `tvIdentify`,
	content: `
		player happy I found a whole television set!
		tink shock You found a-
		tink worried Oh, no, that's not a television. That's a tellyvision.<br>I used to fix those all the time.
		tink frown mayorF used to chew me out constantly for it too...<br>I don't wanna get in trouble, so let's just pretend you never showed me that, okay?
		eval addFlag('tink', 'tvFail');
		trans cancel; Finish
	`,},
	{index: `chainsawIdentify`,
	content: `
		eval addFlag('tink', 'chainsaw');
		eval removeItem('chainsaw');
		eval writeEvent(data.player.currentScene)
		trans cancel; Finish
	`,},
	{index: `chainsaw1`,
	content: `
		eval raiseTrust('tink', 1);
		eval writeEvent(data.player.currentScene)
		eval passTime();
		finish
	`,},
	{index: `clipsIdentify`,
	content: `
		eval addFlag('tink', 'clips');
		eval removeItem('clips');
		eval writeEvent(data.player.currentScene)
		trans cancel; Finish
	`,},
	{index: `clips1`,
	content: `
		eval raiseTrust('tink', 1);
		eval writeEvent(data.player.currentScene)
		eval passTime();
		finish
	`,},
	{index: `plug2Tink`,
	content: `
		tink sparkle Alright, let's see what we have-
		tink worried ... What is this?
		player happy It looks like a buttplug, but look at how weirdly smooth and clean it is. I found it like this in the caves under the town.
		tink confused Butt-plug? Like a plug, for your butt?<br>With a shape like this?
		player You'd put the smooth end-
		tink confused Why do you keep calling it smooth? No part of this thing looks smooth.<br>Actually... I guess it doesn't look rough either. It looks... Boring.
		player befuddled Boring?
		tink worried Yeah, boring! I don't know how to describe it, but I feel less creative by the second looking at it!<br>And actually, I was kinda feeling like playing with myself a little before you got here, and that feeling's totally gone too.
		tink shock It must be some kind of brain-draining device! Quick, get rid of it!
		player surprise Brain-draining?! Don't worry, this kinda thing's my specialty!
		tink worried ... You just put it in your pocket.
		player happy Yep! Won't do any damage in there.
		tink ... If you say so. Sorry I couldn't help.
		eval addFlag('deity', 'tinkAsked');
		finish
	`,},
	{index: `cancel`,
	content: `
		eval unencounter(data.player.currentCharacter);
		eval changeLocation(data.player.location);
	`,},
]

function tinkQuo() {
	var tinkArray = ["chainsaw", "clips"];
	for (tinkIndex = 0; tinkIndex < tinkArray.length; tinkIndex++) {
		if (checkItem(tinkArray[tinkIndex]) == true && checkFlag("tink", tinkArray[tinkIndex]) != true ) {
			writeHTML(`
				trans `+tinkArray[tinkIndex]+`Identify; Show tinkF the `+tinkArray[tinkIndex]+`
			`)
		}
		if (checkFlag("tink", tinkArray[tinkIndex]) == true) {
			writeHTML(`
				trans `+tinkArray[tinkIndex]+`1; Help tinkF test the `+tinkArray[tinkIndex]+`
			`)
		}
	}
	var artifactArray = ["pill", "watch", "hole", "tv",];
	for (artifactIndex = 0; artifactIndex < artifactArray.length; artifactIndex++) {
		if (checkFlag("player", artifactArray[artifactIndex]+"Ready") == true && checkFlag("tink", artifactArray[artifactIndex]+"Fail") != true ) {
			writeHTML(`
				trans `+artifactArray[artifactIndex]+`Identify; Show tinkF the `+artifactArray[artifactIndex]+`
			`)
		}
	}
}

var eventArray = [
	{index: "morning1", name: "The Heat Begins", image: "tink/morning1-3",
	content: `
		t Morning light shines through a certain squirrel gal's windows, but as the front door opens and shuts, the figure walking on unsteady legs seems more like she's ready to finish the day rather than start it.
		im morning1-1
		tink crying *Huff* *Huff*<br>Damn, I barely made it home, my legs feel like they're about to give out...<br>I mean, I know I screwed up a little, but...
		tink angry "Tink, can you fix my printer? Tink, those are important city documents you're squirting on! Tink, if you're sick, you should have stayed home!"
		tink crying ... Wait, what the heck is going on with me?<br>My memory's all jumbled together... Ever since...
		t tinkF falls back onto her leather couch, letting out a long, exasperated sigh.
		t She's the sort of person who doesn't feel self-conscious about scratching an itch, even in public, so when her crotch starts tingling her hand moves of its own accord and she pays it no mind.
		tink frown Hmm... Lemme think.<br>Cheeks feel warm, random itches across my body all day...<br>Memory issues t... Too...
		tink excited A... And... W-wow, my head's really racing...! Wasn't I just exhausted? This feels like I just guzz'd down a dozen... C-cans of...
		im morning1-2
		tink ahegao Haaaa~!
		tink blush W... What just... Happened?<br>My head went totally blank!<br>How long have I been touching my-
		im morning1-3
		tink pleasured Ho-ly...<br>I'm in heat! I'm <i>definitely</i> in heat, this is incredible! I...
		tink shock ... That *man from yesterday! I gotta find them!<br>I gotta tell them that...
		t Lost in her own head, tinkF doesn't notice her hand has gone back down to resume fingering her snatch.
		tink sparkle That I must have found an artifact that can trigger heat!<br>This'll change everything!<br>I gotta clear my schedule! Sorry miss shopF, fixing those weird toys of yours will have... Have to...
		tink torogao NGGHH!
	`},
	{index: "tink1", name: "Salutations", image: "tink/tink1-2",
	content: `
		tink excited Yeah, you! Over here!
		im tink1-1
		tink Glad I caught you! I was about to head back down to the ruins to search for you!<br>Hey, get this, I'm in heat!
		player joy That's great! I'm glad to hear it. Lemme know if you need any help-
		t Interrupting you, tinkF grabs you by the chin and carefully inspects your face.
		tink frown Hmm. Cheeks are a bit flushed, but breathing's not ragged at all.<br>Dang.<br>I was hoping you would be too. I guess that means it wasn't something still at the lake, it must have been in the haul I brought back.
		player pout Look, I keep trying to tell you, I'm a human. I won't go into heat. 
		tink shock Eh? You're serious about this?
		player sleep Yes! I'm glad you finally-
		tink crying <i>Aww, *he's delusional. I feel like a total ass now...<br>What was the term for it? "Otherkin"?<br>Ah shit, *he's talking about something. I gotta stop having internal monologues mid-conversation...</i>
		player sleep -and so in short, that's why I should absolutely be trusted around bladed objects.<br>What were we talking about?
		tink happy W-well, we-
		tink blush Oh... Oh boy, flashes are running through me again.<br>I'll make this quick, I'll look for whatever caused all this, but maybe something's still down in those ruins. If you f-find something that looks like it belonged to humans, bring it to me, yeah?<br>Once I figure this out, I'll show it off to the mayor and... Gh...<br>J-just bring it straight to me!
		player confused Alright... You sure you don't need any help?
		t But instead of answering, tinkF is already waddling back inside, rubbing her thighs together as she goes.
		t *SLAM*
		player confused Hm. I guess everyone deals with heat in their own way.
		t You decide to leave the frazzled squirrel be for now. Perhaps you should check on the lake, and see if you can find anything she might be interested in? She might let you pet her tail if you do.
		t Meanwhile...
		im tink1-2
		tink torogao Ngggh~! I can't-<br>This heat's too much!<br>This is way more than I was expecting...! Could what I found actually be dangerous?!<br>Gotta... Stop playing with myself...! Making a damn puddle, ruining my... Floors!
	`},
	{index: "tink-robo0", name: "Automated Position", image: "tink/robo1",
	content: `
		player curious tinkF? You home? I hear what I can only describe as cartoon building noises.
		player happy You know what I mean? Like when a bunch of characters jump into a big dust cloud and suddenly a house is there? I could swear I hear a handsaw, which is weird because I didn't think you owned-
		tink shock Aaah! Quick, in here!
		player tired Is she in mortal danger, or am I about to see something that shatters my already-strained mind...
		tink sparkle It's alive... ALIVE!
		player tired Shattered innocence it is. Alright, what are you working on-
		player scared -today.<br>My God... It's...!
		eval writeBig("tink/house", "player:+1-10-0.7#expression:robot#nude#")
		player shock An exact, perfect replica of me!
		player confused Wait, hold on... <br>A clone of myself!
		player robot Beep boop.
		player panic OH LORD, IT'S AN EVIL CLONE OF MYSELF!
		tink worried Err, no? Here, robot, state your purpose.
		player robot Beep boop. I have been programmed to serve as an [ALARM CLOCK], [CARDBOARD BOX DISPOSAL], as well as handle [UNSPECIFIED MENIAL TASKS].
		player scared Unspecified menial tasks? tinkF, you're replacing me?!
		tink smug Pshh, you think some two-bit AI can replace my assis-
		player angry No! No robot is replacing me! Sure, maybe it can do math, carrying thing, and flipping switches better than I can...!
		player robot Attempting to connect to [ONLINE CALCULATOR SERVICE].<br>Error: Your subscription has expired.
		tink worried Oh, dang. Thought I renewed that-
		player fury But if there's one menial task I know I can do better than a machine, it's sex!<br>I'll show you what an <i>organic</i> box handler can do!
		tink worried ... You think sex is a-
		player fury Huooooo! I'm fired up!
		tink ... Okay, I mean, sure. I guess this is happening now.
		tink angry Wait, hold on, <i>that's</i> the one sentence you actually let me fin-
		player HUOOOOO!

		tink shock Ah, uh, whoa there! Hey, I'm real flattered, but maybe we should get to-
		im robo1
		tink blush Ho-ly crap, what is <i>that</i>?! Is that a penis?! Err, dick?<br>I mean, wow, like, we all walk around town without pants but like, are all those veins supposed to be like that? And why's it look so scary?<br>Err, well, maybe 'scary' isn't-
		player angry I hope you're ready for my fifty-second most powerful sexual technique, the full-nelson fuck!
		tink excited I, uh... Wow, I mean, I guess I don't hate the idea...<br>A-and it's pretty huge, but I'm pretty sure I've put bigger inside, so...
		player shock *Gasp*
		player anger Grrr...!
		t You lock eyes with your evil clone, filled with an unyielding rage.
		player robot I have been functional for several minutes, still awaiting orders.
		tink worried W-well, actually, those were just a soft plastic, and uh... I dunno why, but that one somehow looks even bigger than the horse one shopF paid me to try, and-<br>Wow, is it like, really hot in here or something? I'm sweating like a pig, haha-
		im robo2
		tink torogao GHHIIIII~!!!
		player robot To answer your question, it is currently exactly 294.261 degrees kelvin-
		player fury Shut up! I'm taking her back, build yourself a cuck chair and sit in it!
		player robot I have been expressly forbidden from practicing carpentry, beep boop.
		tink Huge, huge! My pussy's gonna break! My cunt won't stop spraying all over the floor!
		player annoyed Ghh, I can't focus with all this tail in my face!
		t You feel your heart break a little, uttering those cursed words. But right now you have a friendship to save. You have to dig deep to stay strong...
		player angry And show that clanker the power of the human spirit! Time to move to the next level!
		tink pleasured Ghhhi! There's a next level?!
		player fury Yeah! And this one lets me put my whole bodyweight behind every thrust!<br>That robot over there might have a hard core, but the human heart is the <i>real</i> hardcore!
		im robo3
		tink ahegao Oh, fuck! Fffuck, my head's...!<br>And is that my tummy bulging from your-
		player angry Have a closer look!
		im robo4
		tink pleasured Mgggh! H-holy shit, I can feel it at my womb!
		player torogao Ghhhg! Here... It comes...! First of... Many!
		tink Hold on, this is... Ngh! Happening-
		t You feel your balls clench and eyelids flutter, and at the exact same time a wave of cool calmness washes over tinkF's own mind.
		tink shock ... Huh? My head's... Clear?<br>Everything's... Slowing down?<br>Oh my God, am I gonna get pregnant? Am I about to be-
		im robo5
		tink torogao NGHHHHHH~<3<3<3
		t What could be mistaken for a sloppy onahole being filled to capacity drowns out tinkF's internal monologue completely.
		t Her eyes roll back, and through clenched teeth lets out a scream that could only belong to a beast in heat.
		t ...
		t Your body, soaked in sweat. Your every breath, labored. You stand, letting the hammer between your legs swing freely.
		im robo6
		t Victorious.
		player pent *Huff*...<br>How's... How's it feel machine, now that <i>you're</i> the obsolete one!?
		player robot I was not programmed to feel. However, I was programmed for various features, such as previously mentioned, as well as [SOLVING JIGGY PUZZLES].
		player fury I'LL MAKE YOU OBSOL-EAT YOUR OWN METAL TEETH IF YOU TOUCH MY PUZZLES!<br>TAKE THIS!
		t You gather up all the remaining strength in your body and deliver one punch empowered by the human spirit.
		player crying Ouchie, my hand!
		t ... You spent a <i>lot</i> of energy ploughing tinkF into a fuck-coma.
		player robot BEEP BOOP: Unit has dealt harm to an organic. Safeguard activated.<br>Initiating [SELF-DESTRUCT].
		t With a *POP* and a *WHIZZZZ*, sparks shoot out of the robot's head and the factory-installed smoke starts leaking out.
		player sparkle Ooh! Fireworks! Wowie!
		player happy Y'know, maybe that robot wasn't so bad after all.<br>In another life, we could have been friends.<br>What do you think, tinkF?
		tink ahegao Ahgeeehhhh~
		player sleep Well said.
	`},
	{index: "chainsawIdentify", name: "Chainsaw Identified", image: "tink/chainsaw0-1",
	content: `
		player happy I found a chainsaw?
		tink happy A what now? Lemme see! Bring it in!
		t tinkF quickly ushers you down to her basement workshop, and you lay the "human artifact" down onto the table.
		im chainsaw0-1
		tink sparkle Oh yeah, this is definitely a human artifact! If I had to guess...<br>This is probably a tool to help with childbirth!
		player befuddled How did you...
		player sparkle Guess that exactly right?!<br>I mean, there are other uses too, but-
		tink sleep Here, I can fix this in no time at all! Take a seat wherever, I'll be finished in a jiffy.
		t ...
		im chainsaw0-2
		tink sparkle Ta-daaaaah!
		player sparkle Wowowow, chainsaw whoooa!
		tink happy It's incredible, right? The rapid movements of these silicon nubs would 100% turn any girl's nethers into a sopping mess!<br>They're super soft and spongey too, so not only will they not hurt, they'll get firmer as the girl squirts on them!
		player confused ...?
		tink excited Ehehe... The power draw on this baby might be intense, but I've got a generator that should be able to charge it, and a battery strong enough for it to last a couple full minutes!<br>Seriously, this might be strong enough to drive a girl insane! I can't wait to try it!
		player scared You... What?
		tink smug You scared? Well, I can see why you might be.<br>Don't worry though, I volunteer to be the guinea squirrel.<br>Although, this'll definitely be a 2-person job. If you're ever up for volunteering to be my assistant, feel free to drop by any time and we can test this bad boy out!
	`},
	{index: "chainsaw1", name: "Chainsaw 1", image: "tink/chainsaw1-4",
	content: `
		tink sparkle You wanna test out that one?<br>That's the spirit! Okay, I'll go get set up in the basement, grab the artifact and meet me down there!
		t ...
		player worried Are you really...
		t *Chk* *Chk* *VRRRRRRRRRM*
		player panic Really sure about this?!
		im chainsaw1-1
		tink excited I have genuinely never wanted to do something more than this my entire life.
		player And the restraints?
		tink Completely solid! Don't worry, there's no way I'm getting out of these.<br>Take that chainsaw and go to town whenever you're ready, the anticipation is killing me!
		player scared Not what I was worried about but...<br>Alright, I'll start out with a super light touch...
		t Somehow, the roar of the silicon-chainsaw feels like it grows louder as you approach tinkF's drooling crotch.
		tink blush Really gonna tease me like that, huh? Pretty sure this drain's gonna overflow with grool at this rate!<br>Remember, the emergency word's "barbeque", don't stop unless you hear me-
		im chainsaw1-2
		tink torogao NGGGGGH-!
		t Her chains clink and go taut as her entire body tightens up just from a glancing touch.
		player shock Just from that...!<br>Are you alright?
		im chainsaw1-3
		tink excited N... Ho... M-more! That was amazing! Everything went white, it was like my brain stopped!
		player frown Alright. You're asking for it...
		t *VRRRRRRRRM*
		tink excited Yes... Yesssss~<3
		t You slowly approaching, tinkF arches her back and juts her hips out as far forward as she can, wiggling and presenting her crotch until they're just about touching.
		player pent Hoo... Alright!
		im chainsaw1-4
		tink ahegao OOOOOOOOOOOHHHHH!!!!
		t She must be seeing the light at the end of the tunnel, because she's cumming hard and fast as her arches back her cunt squirts onto the chainsaw.
		t The *VRRRRRRM* slows down, meeting both resistance and the water-absorbent 'blade' soaking up her pussy juice.
		tink torogao NGGGGGH~<3<3<3
		t You're torn between worrying she'll actually be broken by the time you pull away, and wondering if once the rest of the town acclimates to their heats if you'll need to use this tool more often.
		t There's no clear way to tell how long you should use it for, it was orgasm-o-clock from second one.
		player shock ... Wait, you won't be able to say the emergency word!
		t You pull back, needing more than a little muscle to do so when she tries to grab the shaft between her thighs to stop you. Either that, or her body's on complete autopilot.
		t But once you do manage to pull back...
		im chainsaw1-5
		t No moans, no lewd giggles, just a completely mindbroken squirrel passively squirting out anything still left in her.
		player panic Ohhh jeez, this thing's a menace...! <br>Her body wasn't built for this kind of pleasure. Thank goodness it takes two people, or I'd have to hide it at my place...!<br>tinkF? You still in there?
		tink ahegao ...
		player worried Well... I'll unlock you, and leave you to recover.<br>You'll be fine, right?
		t You power off the machine and leave tinkF to recuperate.
	`},
	{index: "clipsIdentify", name: "clips Identified", image: "tink/clips0-1",
	content: `
		tink happy What's that? You found something new? Well come on in!
		t tinkF quickly ushers you down to her basement workshop, and you lay the "human artifact" down onto the table.
		im clips0-1
		tink sparkle These are...!<br>Metal clips, connected by a wire! Abso-lutely perfect for an invention idea I've been having!
		player happy I believe the actual name of those is "alligator clips".
		tink smug Psh, right. Like humans would name something scientific after an animal.
		tink happy Anyways, these would hook up great to something I've been prototyping. I'm torn on a couple of names, but "Coo-Arr Zappery" has been the front runner.
		player tired ... Please, please keep workshopping that.
		tink worried Uh, well duh, where else would I be building it? Take a seat, I'll be finished in a jiggy!
		t ...
		im clips0-2
		tink sparkle Ta-daaaaah!
		player happy How exactly did you plan on using these?
		tink smug How do you think? Nom nom nom right he-<br>Eep!
		t tinkF makes a show of using the clamps as tiny mouths nibbling at her nipples, before releasing them and they... You know. Clamp.
		player frown Ohhh no, nope. Electricity directly from one nipple to the other would fry your heart!
		tink worried Huh? Who said anything about electricity?<br>I just said these deliver high-power shocks.
		player tired ... Brain hort.
		tink sparkle See, these puppies basically stimulate every nerve in the affected area at once! It'll be just like electricity, but without the danger!
		player befuddled But... But nerves work by...<br>Alright, brain shutting off. All I need to know is no "Bzzt zappy-zap"?
		tink worried Uh, no, there will obviously be "Bzzt zappy-zap", that's the best part. But there won't be the "Tss sizzle sizzle" or "Ugh deathy-death".
		player tired Brain double hort. Guess it was still running after all.
		tink happy Well, take five and come on back whenever you're ready!

	`},
	{index: "clips1", name: "clips 1", image: "tink/clips1-4",
	content: `
		tink sparkle You wanna test out that one?<br>That's the spirit! Okay, I'll go get set up in the basement, grab the artifact and meet me down there!
		player worried And if I'm still having second thoughts?
		tink smug Then your brain will start hurting again. All the more reason to stop using it and zap these puppies!
		t ...
		tink excited Ehehe~! Kyahaha~! 
		im clips1-1
		tink I feel alive, alive! God I love injecting raw, hard SCIENCE right into my fucking veins!
		player tired I really should have gotten you to sign a contract or something. Seriously-
		tink ahegao I'll be fine! Do it! Ghehehee!
		player panic O-okay... In three, two-
		tink frown No, wait, not now!<br>Make sure it catches me off guard!
		tink excited Ehehe! I want to be completely-
		t You throw the lever. There's a hard metal *CLUNK*, a whirr, and yes, a *BZZT ZAPPY ZAP* too. The lights of the basement flicker, and it's immediately obvious why.
		im clips1-2
		tink torogao GNGH-G-G-G-G-GHHH-
		t *CLNK* You throw it back. The lever, specifically. Stopping the flow of whatever tinkF is calling these.
		player tired ... You still alive?
		tink Th-th-that w-w-whasssh-
		im clips1-3
		tink excited AMAZHING~<3
		player happy Yeah, the electrici-<br>Err, the pink energy was pretty cool. And no "Tss sizzle sizzle" either, seems like it's safe!
		tink ahegao I'll call them SLUT-SHOCKS! Every girl in town will be-
		t *CLNK* - *BZZT ZAPPY ZAP*
		im clips1-4
		t The room is filled instantly once again with a pink hue and the sound of jittering squirrel noises.
		t If she's trying to say something, it's unclear. It seems more like she's doing an impression of a fish out of water. That's also having a seizure. Or an orgasm. An orgeizer? Segasm?
		player tired ... That's a lot of spraying, I should get her some water after this.
		player curious Y'know, I never did question why my house doesn't have a bathtub or shower.
		t *CLNK* 
		player happy Hmm... Well, you don't seem any more whacked-out than normal. Maybe a few more times, then I'll unlock you and leave you to recover.<br>You'll be fine, right?
		tink ahegao ...
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