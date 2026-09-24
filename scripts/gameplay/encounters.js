const initialEncounterArray = [
	{character: `system`, index: `nap`, name: `Pass the time`, requirements: "?location playerHouse; !time Night;", type:"button", top: 50, left: 50},
	{character: `system`, index: `sleep`, name: `Go to sleep`, requirements: "?location playerHouse; ?time Night;", type:"button", top: 50, left: 50},
	{character: `system`, index: `museumTerrarium`, name: `Terrarium Wing`, requirements: "?location museumExterior; ?flag foxf intro;", type:"button", top: 60, left: 10},
	{character: `system`, index: `museumTechnology`, name: `Technology Wing`, requirements: "?location museumExterior; ?flag foxf intro;", type:"button", top: 30, left: 15},
	{character: `system`, index: `museumFashion`, name: `Fashion Wing`, requirements: "?location museumExterior; ?flag foxf intro;", type:"button", top: 30, left: 50},
	{character: `system`, index: `museumSponsor`, name: `Sponsor Wing`, requirements: "?location museumExterior; ?flag foxf intro;", type:"button", top: 60, left: 60},
	//{character: `system`, index: `collectionRoom`, name: `Collection Room`, requirements: "?location playerHouse; !time Night;", type:"button", top: 60, left: 0},
	{character: `system`, index: `forestShrine`, name: `Ancient Shrine`, requirements: "?location forestWilderness; ?flag carpenter shrine;", type:"button", top: 30, left: 30},
	{character: `system`, index: `digTest`, name: `Dig for Treasure`, requirements: "?location forestWilderness;", type:"button", top: 50, left: 30},
	{character: `system`, index: `digTest`, name: `Dig for Treasure`, requirements: "?location forestWilderness; ?holiday watch;", type:"button", top: 50, left: 30},
	{character: `system`, index: `digTest`, name: `Dig for Treasure`, requirements: "?location lakesideRuins;", type:"button", top: 50, left: 60},
	{character: `system`, index: `digTest`, name: `Dig for Treasure`, requirements: "?location lakesideRuins; ?holiday watch;", type:"button", top: 50, left: 60},
	{character: `system`, index: `ruins1`, name: `Head Inside`, requirements: "?location lakesideRuins; ?flag carpenter ruins;", type:"button", top: 52, left: 52},
	{character: `system`, index: `nap`, name: `Pass the time`, requirements: "?location playerHouse; !time Night;", type:"button", top: 50, left: 50},
	{character: `system`, index: `tv-equipFirst`, name: `Something new is on the Tellyvision`, requirements: "?location playerHouse; ?flag player tvNew; ?item tv;", type:"button", top: 15, left: 0},
	{character: `system`, index: `mailSelect`, name: `A New Letter in your Mailbox!`, requirements: "?location playerExterior; !time Night; ?flag player mailReady;", type:"button", top: 65, left: 0},
	{character: `system`, index: `mailSelect`, name: `Check your Mailbox`, requirements: "?location playerExterior; !time Night; !flag player mailReady;", type:"button", top: 65, left: 0},
	{character: `system`, index: `artifactList`, name: `Use the artifacts you found while digging`, requirements: "?location playerHouse; ?flag player artifacts; !time Night;", altName: "Artifacts", altImage: "artifacts/shelfEmpty",},
	{character: `system`, index: `wardrobeTest`, name: `Change your clothes`, requirements: "?location playerHouse; ?flag carpenter wardrobe;", altName: "Wardrobe", altImage: "locations/interiorClean",},
	{character: `system`, index: `gallery`, name: `View the gallery`, requirements: "?location playerHouse; ?flag carpenter gallery;", altName: "Library", altImage: "locations/library",},
	{character: `system`, index: `weirdList`, name: `Put your permit to use`, requirements: "?location playerHouse; ?weird; ?item permit;", altName: "Cryptid Terrarium", altImage: "locations/terrarium",},
	{character: `system`, index: `weirdReminder`, name: `Check your permit again`, requirements: "?location playerHouse; !weird; ?item permit;", altName: "Cryptid Terrarium", altImage: "locations/terrarium",},
	//{character: `system`, index: `modTest`, name: `Test loading external mods`, requirements: "?location playerHouse;", altName: "Mod Test", altImage: "locations/terrarium",},
	{character: `system`, index: `ruinsPool`, name: `Take a Bath`, requirements: "?location ruinsPool; ?flag player poolReady;", altName: "Ruins - Pool", altImage: "locations/grotto/ruinsPool",},
	{character: `system`, index: `ruinsHole`, name: `Use the Hole`, requirements: "?location ruinsHole; ?flag player holeReady;", altName: "Ruins - Hole in the Wall", altImage: "locations/grotto/ruinsHole",},
	{character: `system`, index: `forestJuice`, name: `Drink that Juice!`, requirements: "?location forestJuice; ?flag player juiceReady;", altName: "Ruins - Picnic Basket", altImage: "locations/grotto/forestJuice",},
	{character: `system`, index: `forestFlowers`, name: `Pluck a Flower`, requirements: "?location forestFlowers; ?flag player flowersReady; ?nutmeg;", altName: "Ruins - Plucky Garden", altImage: "locations/grotto/forestFlowers",},
	{character: `system`, index: `ruinsEmpty2`, name: `Consult the Orb`, requirements: "?location ruinsEmpty2;", altName: "Ruins - Orb", altImage: "locations/grotto/ruinsPool",},
	{character: `system`, index: `forestGather3`, name: `Investigate the Shrine`, requirements: "?location forestGather3; ?item pocket-eev-0;", altName: "Forest - Shrine", altImage: "locations/grotto/ruinsPool",},
	{character: `system`, index: `cherry-exit`, name: `High Five!`, requirements: "?location playerHouse; ?holiday cherry;", altName: "Star-Crossed Cherry Clone", altImage: "artifacts/cherry1",},
];

const initialSceneArray = [
	{index: `system`, scenes: [
		{index: `start`, content: `
			eval generateTitle();
		`,}, //button Visual Novel Test; writeScene('vn');
		{index: `txt2img`, content: `
			eval generatetxt2img();
		`,},
		{index: `intro1old`, content: `
			define bear = sp bear; altName Mama; im images/bear/clothed/frown.webp; altColor #596C8A;
			define batc = sp bat; altName Natasha; im images/bat/clothed/happy.webp; altColor #ADACB1;
			define batn = sp bat; altName Natasha; im images/bat/nude/happy.webp; altColor #ADACB1;

			bear You. You I like. I bring you home and we make with the fucking.
			bear Good that you like them, but do not touch.<br>Decorations are kept sharp and pointy, made to look pretty, not for soft baby to touch.
			player shock B-but I'm not a baby!
			bear You are baby if I say you are baby and when I say you are baby. <br>I pick you up, I cradle you, and you say 'mama' when I press you to my bossom.<br>But right now, you say "yes ma'am", then you smile in way that makes heart flutter.

			batn Nice to m-meet you. You're the volunteer, right?<br>Did you n-need help finding your room?
			batn Well m-mama bear and I run the f-farm, I take care of watching for intruders at night.<br>She t-takes care of the work during the day.<br>You look for p-p-pests, weed, and s-serve as eye... C-candy...

			batc Sorry about our first meeting, I get a nasty case of jitters when making new friends~<br>Can I make up for it?<br>Maybe you'd like a proper welcome to the farm~?

			toggleflag mayor; veggie
			toggleflag shopkeep; veggie
			toggleflag carpenter; veggie
			eval setTrust('mayor', 1)
			eval setTrust('carpenter', 1)
			eval setTrust('shopkeep', 1)
			im system/ui/titleFull
			eval openButton();
			button Start Testing; writeScene('intro1n');
			button Back to Title Screen; writeScene('start');
			eval data.player.carnivore = false;
			eval data.player.vegetarian = false;
		`,},
		{index: `intro2old`, content: `
			button Enter Syrup Town; changeLocation('pineconePlaza');
			button System Characters have DICKS; writeScene('sysGenitalsToggle'); ?flag mayor meat;
			button System Characters have PUSSIES; writeScene('sysGenitalsToggle'); ?flag mayor veggie;
			button Vegetarian mode is OFF; veggieToggle() !vegetarian;
			button Vegetarian mode is ON; veggieToggle() ?vegetarian;
			button Carnivore mode is OFF; meatToggle() !carnivore;
			button Carnivore mode is ON; meatToggle() ?carnivore;
		`,},
		{index: `intro0`, content: `
			bg images/intro/bg
			eval addFlag("player", "intro")
			define noodlejacuzzi = sp Noodle Jacuzzi; im system/avatars/noodle.webp; 
			special Welcome to Syrup Town! The content contained in this game is meant only for adults over the age of 18!
			noodlejacuzzi This erotic content heavily relies on LoRa AI models that were trained on art by the artist Syuro. If you feel ethically conflicted about supporting me, my suggestions are:
			t Visit https://syuro.fanbox.cc and support the artist Syuro directly. As a bonus you'll get access to all of Syuro's more artistically consistent (and in my opinion, higher quality) images than the ones included in the game as well! 
			t Support other artists and creators: The base checkpoint EasyFluff was created via training on various e621 artists. Unfortunately, as far as I know, there's no existing list of the artists used to train the checkpoint, and I don't have the technical skill to identify the artists whose works were used. In Hentai University I provided  direct links to learn more about or financially support every artist who's artwork was used in the game, and if anyone has the means to obtain this list I would absolutely do the same here.
			t Drop in to my discord (link in my master index), where we can discuss the ethical use of AI image generation (or if that's even possible). For example, if you have the means to identify which artists were present in fluffyrock's training data, links to support them could be included here and in other sections of the game. Or if you have one, you could point me towards a different, better credited checkpoint that I could make a Syuro LoRa for.
			noodlejacuzzi The games I've made, including this game, Human Alteration App, and Hentai University, are not meant to piggyback off of the works of other artists, they are just the results of my limitations as a programmer and a writer trying to produce fun content as a solo developer. 
			t These are not twine games, they are made in a Javascript engine I wrote myself. The code is completely open to anyone who downloads the game, and you are totally free to modify or take from it as you please.
			special I encourage everyone who plays my games to only support me if the code, structure, or writing of my games appeals to them. If you appreciate my games for the art they use, please support the artists directly!
			special If you've read this, thank you. Even if we have our disagreements, so long as you're respectful I'll treat you with respect in return. Please message me via discord or email me at noodlejacuzzi@gmail.com if you have any advice, feedback, or criticisms. I appreciate them all!
			button All Aboard - Start the Game; writeScene('intro1');
			button Skip Everything - No Intro; writeScene('introSkip'); color red;
		`,},
		{index: `introSkip`, content: `
			eval introFunction('introSkip');
		`,},
		{index: `introFinish`, content: `
			eval introFunction('introFinish');
		`,},
		{index: `intro1`, content: `
			eval trainEffectPlay();
			bg images/intro/bg
			t *KACHUNK*
			t *KACHUNK*
			t *KACHUNK*
			t The rhythmic noises of the train have taken on a relaxing white noise as you relax in your seat. It's been a lonely ride...
			t At this rate, it'll just be a little bit longer until you arrive at-
			define intro = sp Stranger; im intro/clothed/happy.webp;
			intro Hiya!
			im intro/intro1
			t You jump a little in shock. An admittedly quite cute cat-boy, he must be one of those animal folks you read about. Thankfully you did plenty of reading in advance.
			t ... Well, plenty of skimming at least.
			intro Wow, a human! A real human in the flesh, and not the fur! Ahaha! What's your name?
			eval introFunction('genderSelect');
		`,},
		{index: `intro2`, content: `
			player happy It's playerF, nice to meet you.
			sp Stranger; im intro/clothed/sparkle.webp; Ooh, that's a cool name! I'll definitely remember that! So, if I'm right, this train only has one more stop, yeah? I bet that means you're headed to... Uh... Hm...<br>Oh, Syrup Town! That's the one!
			intro I haven't been there in a while, but I remember it being a really nice place! I'm sure you'll love it!
			im intro/intro2
			t The cat boy takes a seat across from you, his tail swishing back and forth as he talks. 
			intro Syrup Town, huh? You'll be the first human there! I think. Why are you visiting? They don't get many guests and new housing isn't built very often.
			player sleep I won a contest, actually. I'm a proud homeowner now!
			intro Wow! That sounds like a great place to start a new adventure! Hmm, I could have sworn there was something special about that place... 
			eval introFunction('tasteSelect');
		`,},
		{index: `introVegan`,
		content: `
			define intro = sp Stranger; im intro/clothed/happy.webp;
			sp Stranger; im intro/clothed/worried.webp; ... Huh? Did you just select both vegetarian and carnivore mode?<br>Do you... Not want to have sex with furry shortstacks? Like, at all?
			player worried No, not really. Is that a problem?
			intro But... They have big, puffy anuses! Huge, bouncing asses, and some have huge tits too!<br>If not that, then... What do you want?
			player sleep ... Got any garlic bread?
			sp Stranger; im intro/clothed/worried.webp; ... No.
			sp Stranger; im intro/clothed/sparkle.webp; But I know someone who does!<br>Are you willing to stay on the train for a little longer?
			t ...
			im misc/vegan1
			t "Sorry mayorF. I know how this looks.
			t Yeah, looks like you'll need to find another human to help with your pheromone issue.
			t This one wasn't interested (I promise, I mentioned the puffy buttholes!)
			t On the plus side, they fit right in with Skrunklechoob and the gang!
			t They even sent in a postcard!"
			eval writeBig("misc/vegan2Background", "player:20-16-0.35#expression:sparkle#overlay:misc/vegan2Overlaypng#")
			button The End; writeScene('system', 'start');
		`,},
		{index: `intro3`, content: `
			im intro/intro3
			intro Oh, right, right! I remember now! They just built that new museum! <br>Although to be honest, I bet everyone will be more excited about you arriving. <br>A human in a town of animal folks will really spice things up! !carnivore; !vegetarian;
			intro Oh, right, right! I remember now! I think there was some kind of weird thing going on there.<br>My sister told me that all the guys just stay indoors all the time.<br>It's like the town's full of nothing but girls! ?vegetarian; !carnivore;
			intro Oh, right, right! I remember now! I think there was some kind of weird thing going on there.<br>My sister told me that all the girls just stay indoors all the time.<br>It's like the town's full of nothing but guys! ?carnivore; !vegetarian;
			eval checkFetishes();
			im intro/intro4
			sp Stranger; im intro/clothed/worried.webp; I hope the culture shock isn't too much for you. Everyone's really nice, but... Well, you know how it is.
			player worried I do? I'm not sure what you mean, but a free house is a free house.<br>Plus, I'll finally be able to accomplish my dream of...
			button Romance; writeScene('intro4a');
			button A Cozy Life; writeScene('intro4b');
			button Collecting Stuff; writeScene('intro4c');
		`,},
		{index: `intro4a`, content: `
			player sparkle Romance! Love! Passion! I'm going to find the love of my life and live happily ever after!
			sp Stranger; im intro/clothed/sparkle.webp; Oh, that's so sweet! I hope you find someone who makes you happy! I'm sure you will, with a cool name like playerF!
			player happy I hope so!
			intro Anyways, I'd stay and get to know you better, but one of my buddies is probably waiting for me a few cars down. Take care, alright?
			sp Stranger; im intro/clothed/sparkle.webp; Oh, but before I go, my sister's a shopkeep in Syrup Town! If you ever need anything, just drop by her shop on Riverside Road!
			player happy I'll try! Thanks for the chat.
			intro Oh, and since you're looking for romance, definitely drop by her place! She's kind of a porn addict, but if you're ever in the mood for some casual sex, I bet she'd be happy to fuck!
			player worried ... Eh?
			intro Bye!
			player shock Huh?!
			button Continue; writeScene('intro5');
		`,},
		{index: `intro4b`, content: `
			player sparkle A cozy life! No more stress, no more worries, just a nice, quiet life in a small town!
			sp Stranger; im intro/clothed/sparkle.webp; Heck yeah! I like a little more excitement in my life, but I'm cheering for you!
			player happy Thanks!
			intro Anyways, I'd stay and get to know you better, but one of my buddies is probably waiting for me a few cars down. Take care, alright?
			sp Stranger; im intro/clothed/sparkle.webp; Oh, but before I go, my sister's a shopkeep in Syrup Town! If you ever need anything, just drop by her shop on Riverside Road!
			player happy I'll try! Thanks for the chat.
			intro Oh, and since you're looking for a cozy life, definitely drop by her place! She's a total porn addict, so if your definition of cozy involves casual sex, you should hit her up!
			player worried ... Eh?
			intro Bye!
			player shock Huh?!
			button Continue; writeScene('intro5');
		`,},
		{index: `intro4c`, content: `
			player sparkle I'm gonna collect everything! I'm going to be the best collector in the world!<br>I wonder if they have jigsaw puzzles in Syrup Town...
			sp Stranger; im intro/clothed/sparkle.webp; Definitely! They've got a lot of cool stuff there, I'm sure you'll find something you like!
			player happy That's great! I can't wait to see what they have!
			intro Anyways, I'd stay and get to know you better, but one of my buddies is probably waiting for me a few cars down. Take care, alright?
			sp Stranger; im intro/clothed/sparkle.webp; Oh, but before I go, my sister's a shopkeep in Syrup Town! If you ever need anything, just drop by her shop on Riverside Road!
			player happy I'll try! Thanks for the chat.
			intro Oh, and since you're looking to collect stuff, definitely drop by her place!  Well, if you're ever looking for something lewd, she's a massive porn connoisseur! I bet she'd be happy to help you out!
			player worried ... Eh?
			intro Bye!
			player shock Huh?!
			button Continue; writeScene('intro5');
		`,},
		{index: `intro5`, content: `
			eval trainEffectStop();
			t The cat boy has run off, never even telling you his name...
			player worried ... Well that was weird.
			player shock Oh, the train's stopping! Gotta get ready!<br>Okay, need to talk with the mayor first thing!
			t You grab your bags and head to the door, ready to start your new life in...
			im system/ui/title.png
			button Start!; changeLocation('pineconePlaza');
		`,},
		{index: `modeToggle`, content: `
			eval modeToggle()
		`,},
		{index: `chGenderToggle`,
		content: `
			eval diagnostic('jiggly bits');
		`,},
		{index: `sysGenitalsToggle`, content: `
			toggleflag mayor; veggie
			toggleflag shopkeep; veggie
			toggleflag carpenter; veggie
			toggleflag mayor; meat
			toggleflag shopkeep; meat
			toggleflag carpenter; meat
			eval writeScene('intro2')
		`,},
		{index: `sysGenitalsToggle`, content: `
			toggleflag mayor; veggie
			toggleflag shopkeep; veggie
			toggleflag carpenter; veggie
			toggleflag mayor; meat
			toggleflag shopkeep; meat
			toggleflag carpenter; meat
			eval writeScene('intro2')
		`,},
		{index: `vn`, content: `
			button VN Test; writeScene('vnTest');
			eval data.player.style = "vn";
		`,},
		{index: `vnTest`, content: `
			bg locations/exteriorDoe;
			im locations/exteriorDoe;
			t Hello, this is a test of the visual novel style!
			im mayor/test4
			mayor Hello, this is a test of the visual novel style!
		`,},
		{index: `wardrobeTest`, content: `
			eval printWardrobe();
		`,},
		{index: `jiggyToggle`, content: `
			toggleflag player; easyJiggy
			eval fakeLocation('collectionRoom');
			eval listJiggies();
		`,},
		{index: `nap`, content: `
			eval passTime();
			eval refreshPickups();
			eval refreshShops();
			eval changeLocation(data.player.location)
		`,},
		{index: `sleep`, content: `
			eval data.player.time="Morning"
			eval data.player.day += 1;
			eval mayorCheck();
			eval mayorLust();
			eval refreshPickups();
			eval refreshShops();
			eval checkForMorningEvents();
			eval dailyButtScene = {};
			eval removeFlag('mayor', 'busy');
			eval removeFlag('carpenter', 'dailyWall');
		`,},
		{index: `newDay`, content: `
			t No remaining morning events to play. Non-unique morning events only refresh on loading a save.
			finish
		`,},
		{index: `gallery`, content: `
			eval generateGalleryNav();
			finish
		`,},
		{index: `museumTerrarium`, content: `
			eval fakeLocation("museumTerrarium")
		`,},
		{index: `museumTechnology`, content: `
			eval fakeLocation("museumTechnology")
		`,},
		{index: `museumFashion`, content: `
			eval fakeLocation("museumFashion")
		`,},
		{index: `museumSponsor`, content: `
			eval fakeLocation("museumSponsor")
		`,},
		{index: `collectionRoom`, content: `
			eval changeLocation("collectionRoom")
		`,},
		{index: `forestShrine`, content: `
			eval fakeLocation("forestShrine")
		`,},
		{index: `ruins1`, content: `
			eval fakeLocation("ruins1")
		`,},
		{index: `ruins2`, content: `
			eval fakeLocation("ruins2")
		`,},
		{index: `overview1`, content: `
			t Placeholder
			button Back; fakeLocation('museumTechnology')
		`,},
		{index: `overview2`, content: `
			t Placeholder
			button Back; fakeLocation('museumTechnology')
		`,},
		{index: `overview3`, content: `
			t Placeholder
			button Back; fakeLocation('museumTechnology')
		`,},
		{index: `overview4`, content: `
			t Placeholder
			button Back; fakeLocation('museumTechnology')
		`,},
		{index: `overview5`, content: `
			t Placeholder
			button Back; fakeLocation('museumTechnology')
		`,},
		{index: `models1`, content: `
			t Model: https://civitai.com/models/46779/fluffyrock-e17-ys-mod
			t Lora: https://civitai.com/models/89196/syuro-style-lora-for-fluffyrock-based-models
			im misc/Museum/models1
			im misc/Museum/models1-2
			im misc/Museum/models1-3
			im misc/Museum/models1-4
			im misc/Museum/models1-5
			im misc/Museum/models1-6
			im misc/Museum/models1-7
			im misc/Museum/models1-8
			im misc/Museum/models1-9
			button Back; fakeLocation('museumTechnology')
		`,},
		{index: `models2`, content: `
			t Model: https://huggingface.co/zatochu/EasyFluff/tree/main
			t (Download EasyFluff v11.2.safetensors and EasyFluff v11.2.yaml)
			t Also requires the CFG Rescale addon for A1111, instructions here: https://huggingface.co/zatochu/EasyFluff
			t Lora: https://mega.nz/file/TrID2TgL#XfBqg57-nGxP9E-ENT8fns9QrZb0sktA-vOaq-n0q98
			t VAE: https://huggingface.co/stabilityai/sd-vae-ft-mse-original/blob/main/vae-ft-mse-840000-ema-pruned.ckpt
			im misc/Museum/models2
			im misc/Museum/models2-2
			im misc/Museum/models2-3
			im misc/Museum/models2-4
			im misc/Museum/models2-5
			button Back; fakeLocation('museumTechnology')
		`,},
		{index: `models3`, content: `
			t Model: https://civitai.com/models/288584/autismmix-sdxl
			t Lora: https://civitai.com/models/339312/syuro-style-for-pony-v6-xl
			im misc/Museum/models3
			im misc/Museum/models3-2
			im misc/Museum/models3-3
			im misc/Museum/models3-4
			im misc/Museum/models3-5
			im misc/Museum/models3-6
			im misc/Museum/models3-7
			im misc/Museum/models3-8
			button Back; fakeLocation('museumTechnology')
		`,},
		{index: `models4`, content: `
			t Model: https://civitai.com/models/288584/autismmix-sdxl
			t Lora: https://civitai.com/models/379377/ahemaru-style
			im misc/Museum/models4
			t Background removed with RemBG using the isnet-anime model
			im misc/Museum/models4-2
			im misc/Museum/models4-3
			im misc/Museum/models4-4
			im misc/Museum/models4-7
			im misc/Museum/models4-8
			button Back; fakeLocation('museumTechnology')
		`,},
		{index: `ethics1`, content: `
			t Placeholder
			button Back; fakeLocation('museumTechnology')
		`,},
		{index: `ethics2`, content: `
			t Placeholder
			button Back; fakeLocation('museumTechnology')
		`,},
		{index: `hyena-townHall`, content: `
			eval writeScene("hyena", "tour-townHall");
		`,},
		{index: `hyena-store`, content: `
			eval writeScene("hyena", "tour-store");
		`,},
		{index: `hyena-squidsMakeInc`, content: `
			eval writeScene("hyena", "tour-squidsMakeInc");
		`,},
		{index: `hyena-museumExterior`, content: `
			eval writeScene("hyena", "tour-museumExterior");
		`,},
		{index: `packTest`, content: `
			eval packTest();
		`,},
		{index: `digTest`, content: `
			eval digStart();
		`,},
		{index: `cancel`, content: `
			eval changeLocation(data.player.location);
		`,},
		{index: "artifactList", content: `
			eval generateArtifacts();
			finish
		`},
		{index: "watch-identify", content: `
			eval writeEvent("player", data.player.currentScene)
			eval removeFlag("player", "watchReady");
			eval addItem("watch", "hidden");
			eval addFlag('player', 'artifacts');
			finish
		`},
		{index: "watch-equipFirst", content: `
			player happy Alrighty, time for time to stop!
			t *CLICK*
			t With the press of a button, the flow of time is dammed. The birdsongs cease, butterflies are frozen mid-flap, all of reality is like a single still image.
			im locations/interiorClean
			player worried ... It's actually not that different.<br>I wonder who I should use this on?<br>I guess shopF used it on me, it should be fair game to prank her back, I'm sure she'd enjoy whatever I do.
			special Time has been stopped! Explore the town and see who you can find!
			eval addFlag('player', 'watch-equipFirst');
			eval data.player.holiday = "watch";
			finish
		`},
		{index: "watch-equipRepeat", content: `
			player fury ZA, WARUDO!
			t *CLICK*
			player pout ... I wish there was like a BZZZZRT or something, that'd be way cooler.
			special Time has been stopped! Explore the town and see who you can find!
			eval data.player.holiday = "watch";
			finish
		`},
		{index: "watch-random1", content: `
			player tired It's so quiet... Seriously, I could take a nap right in the middle of the street.
			player scared Ah, but what if I sleep in? There's nobody to wake me! My cicadian rhythm would be completely thrown off!
			player tired ... Nobody's awake to say "Do you mean to say 'circadian' rhythm"? I really need people to bounce off of.<br>It's no fun talking about being half-cicada if nobody can hear me.
			eval addFlag('player', 'watch-random');
			trans watch-finish; Head home and finish playing with the watch
			cancel
		`},
		{index: "watch-random2", content: `
			player panic Aaaaah! It's so quiet, this is driving me crazy! I can hear my heartbeat!<br>I grew up on the streets, I am not built for this level of quiet!
			player laugh I know, I'll make the noise! <br>YOU HAVE THOSE FLU~ FFY~ TAILS~ OH, SO NICE~ AND~ PREENED~<br>YOU ARE MY FLU~ FFY~ QUEEN~
			player panic GOOOOT TO KEEP~ SING~ ING~<br>OOOOOR MY BRAIN WILL BREAK~ AT THE~ SEAMS~
			trans watch-finish; Head home and finish playing with the watch
			cancel
		`},
		{index: "watch-finish", content: `
			player tired Okay, I'm done. I can't take this anymore. No more quiet, please.<br>I'm so tired... I'm headed straight home. Forget my sleep rhythm, I'm gonna conk out as soon as my head hits the pillow.
			t You decide to make your way home, wiping your feet on the mat, leaving a frozen dust cloud in the air as you do.
			t You step inside, kick off your shoes, and crawl under the covers. You'll wash them tomorrow.
			t And then, snug as a bug in a rug after drinking warm milk from a mug, you close your eyes, set the time stopwatch down on your nightstand, and...
			t *CLICK*
			eval writeEvent("shopkeep", "watch-finish-shopkeep") ?flag shop watchStart;
			eval removeFlag("shop", "watchStart");
			eval writeEvent("wolf", "watch-finish-wolf") ?flag wolf watchStart;
			eval removeFlag("wolf", "watchStart");
			eval writeEvent("sadogato", "watch-finish-sadogato") ?flag sadogato watchStart;
			eval removeFlag("sadogato", "watchStart");
			eval writeEvent("milf", "watch-finish-milf") ?flag milf watchStart;
			eval removeFlag("milf", "watchStart");
			eval writeEvent("doe", "watch-finish-doe") ?flag doe watchStart; !flag mommy watchStart;
			eval writeEvent("doe", "watch-finish-doe") !flag doe watchStart; ?flag mommy watchStart;
			eval writeEvent("doe", "watch-finish-doe") ?flag doe watchStart; ?flag mommy watchStart;
			eval removeFlag("doe", "watchStart");
			eval removeFlag("mommy", "watchStart");
			eval removeFlag("player", "watch-random");
			eval data.player.holiday = "";
			eval data.player.location = "playerHouse";
			eval data.player.time = "Night";
			finish
		`},
		{index: "hole-identify", content: `
			eval writeEvent("player", data.player.currentScene)
			eval removeFlag("player", "holeReady");
			eval addItem("hole", "hidden");
			eval addFlag('player', 'artifacts');
			finish
		`},
		{index: "hole-equipFirst", content: `
			eval generateOnahole();
			finish
		`},
		{index: "pill-identify", content: `
			eval writeEvent("player", data.player.currentScene)
			eval removeFlag("player", "pillReady");
			eval addItem("pill", "hidden");
			eval addFlag('player', 'artifacts');
			finish
		`},
		{index: "pill-equipFirst", content: `
			player tired ... I guess I probably should try these out. shopF was pretty excited about their effects.
			player pout Okie dokie! I can do this, time to take these random mysterious pills I found in the ground!
			player happy ... Actually, when I phrase it like that, this whole situation suddenly feels a lot more comfortable.<br>Down the hatch!
			t Thankfully despite being quite large the pills go down smoothly. You don't let them linger on your tongue, but for the moment before you swallow you can taste it. 
			t It's not very pleasant. The experience is somewhere between "water balloon filled with jello" and "edible condoms having an orgy on your tongue".
			player panic Bleh! Ptooey! I'd forgotten what microplastics tasted like.<br>Hopefully these work quickly to-
			t *GURGLE*
			player scared ... Distract me?
			t Hearing your ballsack literally bloat and gurgle, you quickly remove anything that might get in their way.
			im artifacts/pills/pill-equip1-light
			player pent Oh... Oh boy...<br>I'm gonna need someone to help with this...<br>M-maybe shopF... If I can make it that far...
			eval addFlag('player', 'pill-equipFirst');
			eval data.player.holiday = "pill";
			eval equipPill();
			finish
		`},
		{index: "pill-equipRepeat", content: `
			player tired Alright. Last time didn't go too badly. Plus I probably released a ton of pheromones, so it's basically my civic duty to take these pills again.
			player pout Taste of microplastics, take me away! <br>*Nom*
			t *GURGLE*
			player pent H-hoh...<br>Better make sure nothing's in the way of their growth...
			im artifacts/pills/pill-equip1-light
			player forced Gghoou~<br>They're taking effect already...<br>I'd better find someone to help me deal with this before I make a massive mess...!
			eval data.player.holiday = "pill";
			eval equipPill();
			finish
		`},
		{index: "pill-random1", content: `
			eval writeEvent("player", data.player.currentScene)
			eval addFlag('player', 'pill-random1');
			finish
		`},
		{index: "pill-random2", content: `
			eval writeEvent("player", data.player.currentScene)
			eval removeFlag('player', 'pill-random1');
			eval addFlag('player', 'pill-random2');
			finish
		`},
		{index: "pill-fail", content: `
			eval writeEvent("player", data.player.currentScene)
			eval removeFlag('player', 'pill-random2');
			eval addFlag('player', 'pill-fail');
			eval data.player.time = "Night";
			eval data.player.holiday = '';
			finish
		`},
		{index: "watch-store", content: `
			eval writeScene("shopkeep", "watch-start-shopkeep");
		`},
		{index: "watch-townHall", content: `
			eval writeScene("mayor", "watch-start-mayor")
		`},
		{index: "watch-squidsMakeInc", content: `
			eval writeScene("carpenter", "watch-start-carpenter");
		`},
		{index: "watch-museumExterior", content: `
			player sparkle Alright, time to fluff-
			player befuddled They aren't here? Maybe they're in another section of the museum?
			player scared ... Which means they're impossible to find! I can't possibly navigate this place without them as my guides!<br>I'll have to find someone else...
			cancel
		`},
		{index: "pill-store", content: `
			eval writeScene("shopkeep", "pill-shopkeep");
		`},
		{index: "pill-townHall", content: `
			eval writeScene("mayor", "pill-mayor");
		`},
		{index: "pill-squidsMakeInc", content: `
			eval writeScene("carpenter", "pill-carpenter");
		`},
		{index: "pill-museumExterior", content: `
			eval writeEvent("foxf", "pill-foxd");
			eval data.player.time = "Night";
			eval data.player.holiday = "";
			finish
		`},
		{index: "tv-identify", content: `
			eval writeEvent("player", data.player.currentScene)
			eval removeFlag("player", "tvReady");
			eval addItem("tv", "hidden");
			eval addFlag('player', 'artifacts');
			finish
		`},
		{index: "tv-equipFirst", content: `
			eval addFlag('player', 'tv-equipFirst');
			player joy Alright, let's see what's on today!
			eval watchTV();
			finish
		`},
		{index: "tv-equipRepeat", content: `
			player happy Alright, let's see if I can get this recorder box working...<br>Yes! Time for some reruns...
			eval rerunTV();
			finish
		`},
		{index: "cherry-identify", content: `
			eval writeEvent("player", data.player.currentScene)
			eval removeFlag("player", "cherryReady");
			eval addItem("cherry", "hidden");
			eval addFlag('player', 'artifacts');
			eval data.player.location = "riversideRoad"
			finish
		`},
		{index: "cherry-equipFirst", content: `
			define playerduo = dual sp1 player; sp2 player;
			t *POOF*!
			player awe A clone...
			player joy Of myself...
			eval writeBig("locations/interiorClean", "player:0-0-0.7#player:0-0-0.7#expression:sparkle#")
			playerduo sparkle Now neither one of us will be virgins!
			eval addFlag('player', 'cherry-equipFirst');
			eval data.player.holiday = "cherry";
			finish
		`},
		{index: "cherry-equipRepeat", content: `
			define playerduo = dual sp1 player; sp2 player;
			t *POOF*!
			player awe A clone...
			player joy Of myself...
			eval writeBig("locations/interiorClean", "player:0-0-0.7#player:0-0-0.7#expression:sparkle#")
			playerduo sparkle Now neither one of us will be virgins!
			eval data.player.holiday = "cherry";
			finish
		`},
		{index: "cherry-exit", content: `
			playerduo sparkle Aww yeah, high five!
			t *CLAP*
			t *POOF*
			player scared ...! Oh no, what have I done?!
			player crying My clone... My twin... My newest best buddy...!
			player happy Oh well.
			eval data.player.holiday = '';
			finish
		`},
		{index: "cherry-store", content: `
			eval writeScene("shopkeep", "cherry-shopkeep");
		`},
		{index: "cherry-townHall", content: `
			eval writeScene("mayor", "cherry-mayor");
		`},
		{index: "cherry-squidsMakeInc", content: `
			eval writeScene("carpenter", "cherry-carpenter");
		`},
		{index: "cherry-museumExterior", content: `
			player pleasured Foxes! foxfF! foxmF! I took some funny cherrys and now my balls are super stuffed, I need help!
			player pent ... Nothing? Are they not here today?
			t ...
			foxf worried Oof... This is seriously hard work...<br>Could we really not splurge on a some kind of heavier equipment?
			foxm worried Sorry, it wasn't in the budget.<br>It costs a lot to keep re-buying all those artifacts from shopF, after all.
			foxf We should have just told playerF to sell them back to us...
			foxm Then it'd be too obvious what we're doing. Don't worry, we're almost done!
			foxf frown ... I just had a sinking feeling. What if they visit the museum while we're both busy?
			foxm worried We haven't had new content for several updates now, what are the chances they'd drop by today of all days?
			t ...
			player torogao Ghhhg~! N-need to find someone else!
			finish
		`},
		{index: "resumeDigging", content: `
			eval digResume();
		`},
		{index: "mimicPurple2", content: `
			eval writeEvent("player", data.player.currentScene)
			eval addFlag('player', 'mimic-p');
        	trans resumeDigging; Back to digging
		`},
		{index: "mimicPurple3", content: `
			define mimicp = sp Purple Mimic; im treasure/mystery/mimicp.png; altColor #9386A5;
			t You decide not to waste time on the strange purple creature.
			mimicp Yeah, you'd better run, squirt!
        	trans resumeDigging; Back to digging
		`},
		{index: "mimicBlue2", content: `
			eval writeEvent("player", data.player.currentScene)
			eval addFlag('player', 'mimic-b');
        	trans resumeDigging; Back to digging
		`},
		{index: "mimicBlue3", content: `
			define mimicb = sp Blue Mimic; im treasure/mystery/mimicb.png; altColor #7D9DBE;
			player happy I'll pretend I didn't see anything. Have fun!
			mimicb Eh? Th... Thanks...?<br>Already gone... I really should stop, I can't afford to actually waste this load, but...<br>Ohh, edging just feels too good~<3
			trans resumeDigging; Back to digging
		`},
		{index: "mimicRed2", content: `
			eval writeEvent("player", data.player.currentScene)
			eval addFlag('player', 'mimic-r');
			trans resumeDigging; Back to digging
		`},
		{index: "mimicRed3", content: `
			define mimicr = sp Red Mimic; im treasure/mystery/mimicr.png; altColor #A14A4D;
			player pout Hmph! No way! I know you can't catch me while stuck in that tiny box!
			mimicr Eh? Wait, no, I meant your cu-
			player angry Away I go, catch me if you can!
			mimicr ... What just happened?
			trans resumeDigging; Back to digging
		`},
		{index: "mystery-foxm", content: `
			eval writeScene("foxm", "mystery")
        	trans resumeDigging; Back to digging
		`},
		{index: "mystery-foxf", content: `
			eval writeScene("foxf", "mystery")
        	trans resumeDigging; Back to digging
		`},

		//Cryptids
		{index: "weirdList", content: `
			im locations/terrarium
			player joy Ooh, pretty!
			player sparkle And what's this? A manual of notes on cryptids?<br>Written by the foxes too!
			player sleep Ah, they sure do spoil me. Now, I should find some weird critters!
			t Just like with using fruit while digging, you can click on a critter in your inventory to have sex with it here or in your bedroom.
			t Current Permit:
			eval writeBig("foxf/permit-background", "player:21-18-0.5#expression:smug#overlay:foxf/permit-overlay#")
			finish
		`},
		{index: "weirdReminder", content: `
			im locations/terrarium
			player sad Man, I can't find any weird critters! What's the point of having this permit at all?
			player frown What's this? A manual of notes on cryptids?<br>Written by the foxes too! Let's see, in big, red text on the first page...
			t <span style="color:red;">Remember to enable weird content in the fetishes menu in the settings!</span>
			player sleep Man, it's days like this I sure do wish I could read...
			t Current Permit:
			eval writeBig("foxf/permit-background", "player:21-18-0.5#expression:smug#overlay:foxf/permit-overlay#")
			finish
		`},
		{index: "lurm1First", content: `

			eval writeEvent("player", "lurm1")
        	eval passTime();
			finish
		`},
		{index: "lurm1Repeat", content: `
			im misc/lurm1-1
			im misc/lurm1-2
			im misc/lurm1-3
			im misc/lurm1-4
			finish
		`},
		{index: "assple-1", content: `
			eval addFlag('player', 'assple-1');
			
			define notesf = sp foxf; altName Curator's Notes;
			define notesm = sp foxm; altName Curator's Notes;
			player confused Hrm. This stem looks kinda like a handle. I wonder if the foxes left any sort of notes for me on this thing...<br>Aha!
			im items/fruit-assple-fruit
			notesm Assple, a completely ordinary, if a bit of a bland fruit. The only thing special about it is that it grows and separates into highly tough links when left under pressure at around 37 degrees celcius, or 98.7 degrees farenheit for a few days.<br>Commonly used as a sex toy, and eaten as a snack.
			notesf Sometimes both, since you don't actually eat the shells.<br>So plant it in the fertile fields of Uranus and
			player happy Hmm. Trails off after that, kinda like they started fighting over the pen.<br>Oh well, seems simple enough. It should be an easy way to get a little extra food.
			player tired ... Someday, I'll ask carpenterF to build me a kitchen.
			player happy Whatever. In you go!
			im misc/fruit/assple-start-light
			player Hmm. Handle's got basically zero stretch to it. No chance of it breaking off, at least.<br>I guess all that's left to do now is let it grow.
			finish
		`},
		{index: "assple-2Start", content: `
			player pent Mgghh~<br>Belly... Feels... Weird.
			t Taking a look down, you notice your cock has begun leaking precum, and your whole body tingles just a bit. Given the small bump on your pelvis, it seems like the assple inside you has grown substantially already.
			player tired Should I remove it...? Or, I guess I could let it grow a little longer.
			trans assple-2; Pull it out now
			trans assple-delay; Let it keep growing
		`},
		{index: `assple-delay`,
		content: `
			eval addFlag('player', 'assple-2');
			eval changeLocation(data.player.location);
		`,},
		{index: "assple-2", content: `
			eval removeFlag('player', 'assple-1');
			eval writeEvent("player", "assple-2");
			eval addItem("fruit-assple-fruit", "hidden");
			eval addItem("fruit-assple-fruit", "hidden");
			eval addItem("fruit-assple-fruit", "hidden");
			eval addItem("fruit-assple-fruit", "hidden");
			eval addItem("fruit-assple-fruit", "hidden");
			special You got 5 Assple Fruits!
			finish
		`},
		{index: "assple-3", content: `
			eval removeFlag('player', 'assple-1');
			eval removeFlag('player', 'assple-2');
			eval writeEvent("player", "assple-3");
			finish
		`},
		{index: "fooba1First", content: `
			eval writeEvent("player", "fooba1")
        	eval passTime();
			finish
		`},
		{index: "fooba1Repeat", content: `
			im misc/fooba1-1
			im misc/fooba1-2
			im misc/fooba1-3
			im misc/fooba1-4
			finish
		`},
		{index: "shell-maleFirst", content: `
			eval writeEvent("player", "shell-male")
        	eval passTime();
			finish
		`},
		{index: "shell-maleRepeat", content: `
			t Placeholder
			finish
		`},
		{index: "shell-femaleFirst", content: `
			eval writeEvent("player", "shell-female")
        	eval passTime();
			finish
		`},
		{index: "shell-femaleRepeat", content: `
			t Placeholder
			finish
		`},

		//Grotto
		{index: `ruinsEmpty2`,
		content: `
			eval grottoScene("ruinsOrb")
		`,},
		{index: `ruinsPool`,
		content: `
			eval grottoScene("ruinsPool")
		`,},
		{index: `ruinsHole`,
		content: `
			eval grottoScene("ruinsHole")
		`,},
		{index: `forestGather3`,
		content: `
			eval grottoScene("forestShrine")
		`,},
		{index: `forestShrineTransform`,
		content: `
			eval grottoScene("forestShrineTransform")
		`,},
		{index: `forestJuice`,
		content: `
			eval grottoScene("forestJuice")
		`,},
		{index: `forestFlowers`,
		content: `
			eval grottoScene("forestFlowers")
		`,},
		{index: `pikBlueFollowup`,
		content: `
			t Without any means of waking the picked-mini gently, you decided to play a little... Rough.
			player smug <3
			im misc/grotto/forestPikminBlue1-2-light
			t You feel a little bit more tired than before...
			eval digHealth -=3;
			finish
		`,},
		{index: `pikYellowFollowup`,
		content: `
			t Without any means of waking the picked-mini gently, you decided to play a little... Rough.
			player smug <3
			im misc/grotto/forestPikminYellow1-2-light
			t You feel a little bit more tired than before...
			eval digHealth -=3
			finish
		`,},
		{index: `ruinsSlimeWhiteFollowup`,
		content: `
			eval writeEvent("player", "ruinsSlimeWhite");
			
			t You feel a little bit more tired than before...
			eval digHealth -=3
			finish
		`,},
		{index: `centralSphinxFollowup`,
		content: `
            define sphinx = sp sphinx; altName Sphinx; altImage locations/grotto/centralSphinx; altColor #EB6707;
			player sparkle Wait, I know this one!<br>The answer is Doctor Hogcrank!
			sphinx ... Excuse me?
			player joy Yeah! He's a beloved cartoon character, he uses his big crank as a cane in the mornings because he broke his spine, or neck, or something. But he owns this super buff bipedal piglet named Hamlette, and-
			sphinx Is that a real thing? I've been down here for a while now.
			player shock You don't know the famous Doctor Hogcrank?! You must be living under a rock!
			sphinx Alright, that's... Well, it's not <i>not</i> accurate. You and those fluffy ones are the only ones who have visited me in quite some time.<br>Ah, I never planned to eat you, by the way. It's just... Boring, down here. Not much to stimulate the brain, I can only solve the same puzzles so many times...
			player awe Would those puzzles happen to be... Jiggies?
			sphinx They would, yes. I have quite the collection, actually.
			player sparkle I LOVE jiggies! And all sorts of other puzzles too! Well, except-
			sphinx Slide puzzles?
			player shock ...! Of all the treasures and adventures I expected to find down here, I NEVER expected to find...
			player sparkle A NEW BEST FRIEND!
			sphinx Well, that's quite the jump, but I find you quite amusing, and not unpleasant as well.<br>Please, talk about whatever you wish. I could use something to cut the boredom.
			t ...
			t And so you chatted with the bored sphinx for what felt like hours. About games, puzzles, riddles, and eventually about why you're here in town at all.
			sphinx Interesting. And have these pheromones of yours triggered a breeding season yet?
			player happy Well, not yet. Well, kind of. Not for anyone other than me.<br>Everyone wants to jump my bones, but I'm sure they'll pair up with each other eventually.<br>Hey, do you think it'll affect you?
			sphinx Me? That's unlikely. I'm far, far too old for such matters.
			player love An older lady...?
			sphinx Still, I appreciate the company. Here, take one of these puzzles, I have far too many of them.
			player joy Wow, thanks! So many to choose from...!<br>Can I give you something in return? Maybe pay some Muns for them? I have plenty of those?
			sphinx Muns? I assume those are the local currency of these times?<br>What happened to gold coins?
			player confused Y'know, they might actually be gold, it's not super clear.
			sphinx Well, regardless, I'll happily make the trade. I'm a collector, of sorts.
			player happy Oh boy, this is great. A new friend, puzzles to pick from... Hmm...
			special You've unlocked the Sphinx's Shop! Here, you can buy jiggies and other collectable items you might not have found yet!
			player Wait, do you have a name?
			sphinx No, in my time, I was simply referred to as... How to put it... Lamasu Apsasu. But you may call me whatever you wish.
			player sparkle Ooh, can I call you Lamy?
            define sphinx = sp sphinx; altName Lamy; altImage locations/grotto/centralSphinx; altColor #EB6707;
			sphinx If it pleases you.
			finish
		`,},


		{index: "mailSelect", content: `
			eval openMailbox();
		`},
		{index: "v13", content: `
			eval document.getElementById('output').innerHTML += writeChangelog('v13');
			special You can see previous changelogs by clicking the version number on the title screen
			eval addItem('ribbonSet', true);
			special Release bonus: All the pieces of the Special Gift Outfit obtained! You can put it on at the wardrobe back at home. Here's what it looks like:
			eval printNewOutfit('ribbonSet');
			finish
		`},
		{index: "v12", content: `
			eval document.getElementById('output').innerHTML += writeChangelog('v12');
			special You can see previous changelogs by clicking the version number on the title screen
			finish
		`},
		{index: "v11", content: `
			eval document.getElementById('output').innerHTML += writeChangelog('v11');
			special You can see previous changelogs by clicking the version number on the title screen
			finish
		`},
		{index: "v10", content: `
			eval document.getElementById('output').innerHTML += writeChangelog('v10');
			special You can see previous changelogs by clicking the version number on the title screen
			finish
		`},
		{index: "v9", content: `
			eval document.getElementById('output').innerHTML += writeChangelog('v9');
			special You can see previous changelogs by clicking the version number on the title screen
			finish
		`},
		{index: "v8", content: `
			eval document.getElementById('output').innerHTML += writeChangelog('v8');
			special You can see previous changelogs by clicking the version number on the title screen
			finish
		`},
		{index: "v7", content: `
			eval document.getElementById('output').innerHTML += writeChangelog('v7');
			finish
		`},
		{index: "tink1", content: `
			t Syrup Town's first fanmade character! Introducing Tink, the Squirrel, created by EvilCrucifix, written cooperatively by Evilcrucifix and Noodlejacuzzi!
			im tink/morning1-3
			t Appears at the lakeside ruins, does not appear for players in Carnivore mode.
			t Thank you to EvilCrucifix for adding a new character to the game!
			finish
		`},
		{index: "animated", content: `
			t Animated images made by Aranom have been added! For online players, simply enable them from the preferences in the settings menu.
			t For downloaded players, download the animated images mod from the download page. Make sure the resulting images-mp4 folder is in the same folder as the game. Then, all you should need to do is enable them from the preferences in the settings menu. If they don't appear, make sure images-mp4 is in the right place.
			im misc/animated
			t Only a small amount of images have been animated so far. Feel free to pop into the discord to make a specific request for what should get animated next!
			finish
		`},
		{index: "censorship", content: `
			t Content has been removed from the game to better comply exactly with the Terms of Service on Subscribestar, and to comply with regulations in the hope of a successful and peaceful release on Itch.io and Steam. As a result, as of version 11, multiple jiggies, magazine images, as well as the full characters Nutmeg & Cinnamon have been removed from the game.
			t Further details are provided here: https://subscribestar.adult/posts/2378103
			t While mod support has been officially added, no attempt will be made to distribute content which goes against the Terms of Service on Subscribestar, or to provide content which is otherwise innapropriate. Please do not request a link to any Content Restoration Mod on whatever site or subforum you found this game, lest you be reported.
			t While this is sad news, please do not give up, I will always strive to provide fun content, even if I'm only allowed to color inside the lines!
			im changelog/believe
			t If you have any questions or concerns, please do not hesitate to contact me on discord. 
			finish
		`},
		
		{index: `modTest`, content: `
			finish
			eval generateModHub();
		`,},
		{index: `modHub`, content: `
			eval generateModHub();
		`,},
		{index: `modFAQ`, content: `
			t <b>How to create mods?</b>
			t Syrup Town added mod support in v11, alongside removing a select amount of content. For a guide on how to create mods, please see the technology wing's "Modding" section in the in-game museum.
			t While you can create mods manually by preparing your own .zip file, the technology wing's modding section allows you to create custom content via in-game editors.

			t <b>How to install mods?</b>
			t Simply download the .zip file containing the mod, then upload it via the mod upload button on the prevous menu (labelled "Upload ZIP").
			t You do not need to extract the files, or re-arrange the contents of the .zip file. In addition, mods will then be saved to your browser data. Please note that some security settings may not play nicely with these. If a mod is deleted from your browser's data, simply re-upload it using the mod upload button.

			t <b>Where can I find mods?</b>
			t Eventually, this page may include links to fan creations, so long as they
			t - Match Syrup Town's tone
			t - Are well written
			t - Comply with all terms of service wherever Syrup Town is uploaded, such as Subscribestar, Steam, and Itch.io.

			t Due to the above limitations, this page is likely to stay empty for a very long time. Potential modders are encouraged to join forums to discuss or plan ideas in places like the f95zone thread about Syrup Town.
			t Please do not ask about any Content Restoration Mod or any other topic which might go against terms of service. Please always comply with the rules and regulations of any space you visit. And if you visit a discord server, please be sure to check the FAQ section.
			im misc/modding/modsIntro
			trans modHub; Back
		`,},
		{index: `modFleshy`, content: `
			t As of Syrup Town version 3, the non-furry version has been disabled!
			define noodlejacuzzi = sp Noodle Jacuzzi; im system/avatars/noodle.webp; 
			noodlejacuzzi The whole purpose of the mode was to offer something to fans of my games like Hentai University and Anomaly Vault, to give me some peace of mind that I'm offering something fans of those games can enjoy while I focus on Syrup Town for a while.<br>I've gotten a lot of feedback that the current non-furry version just isn't working in that regard.<br>It'd be a huge worry off my mind if I could still offer fun game to Hentai University fans without needing to keep adding to the older engine, and Hentai University 2 would be a pretty massive undertaking.
			t Thus, I plan on completely re-doing the non-furry version, with taller, non-shortstack characters:
			im misc/neoFleshy
			noodlejacuzzi This will be a very large undertaking. Every one of the game's CGs, expression sets, etc.<br>I appreciate your patience as I work on it.<br>The expression sets are taking longer than expected. Before I can release the fleshy version, I'm finishing all the models for the furry mode's core cast. It should be a few more releases, so a few more months, but exactly when that version will release isn't set yet.
			trans modHub; Back
		`,},
		{index: `modLoading`, content: `
			t Loading, please only return to the mod menu once the mod is finished loading... 
			trans modHub; Back to the mod menu
		`,},
		{index: `modCreate`, content: `
			t WARNING! Progressing will enter you into a debug mode, where various aspects of the game are changed.
			t If you wish to proceed, please name your mod below. Please avoid using spaces due to compatibility issues with Neocities.
			t <input type='text' id='modName' value=''>
			button Continue; nameMod()
			trans modHub; Back to the mod menu
		`,},
		{index: `modding0`, content: `
			eval moddingShortcut("modding0");
			
		`,},
		{index: `modding1`, content: `
			eval moddingShortcut("modding1");
		`,},
		{index: `modReturn`,
		content: `
			eval modReturn();
		`,},
		{index: `modReturn`,
		content: `
			eval modReturn();
		`,},
		{index: `sphinx1`,
		content: `
			eval writeEvent('player', 'sphinx1');
			eval passTime();
			eval digHealth = 1;
		`,},
		{index: `cancel`,
		content: `
			eval changeLocation(data.player.location);
		`,},
		{index: `clacksTest`,
		content: `
			eval clacksTest();
		`,},
		{index: `honeycombTest`,
		content: `
			eval honeycombBoot();
		`,},
	]},
];

const initialEventArray = [
	{index: "player", events: [
		{index: "watch-identify", name: "Time Stopwatch Identify Scene", image: "artifacts/watch2", tags: "", content: `
			shop sparkle Oho! And what do we have here?
			player happy I dug this up, any idea what it might be?
			shop happy No problem! Lemme take a look...
			im artifacts/watch2
			shop joy Ooh! A pocket watch? No, a stopwatch. Does it still-
			t *Click*
			shop WHOAAAAA~!
			player shock Eh? What just happened?!
			shop excited Ehehe~<br>Seems like you dug up something pretty neat! It's a magic stopwatch, it stops time! Observe~
			player worried How can I observe-
			t *CLICK*
			player orgasm Ghouuu~<3
			player afterglow Wha... Juh...
			im artifacts/watch3
			shop excited Mmm, mmm, see?<br>And all the feedback... *Slurp* Hits them all at once~<br>Here, it's yours.
			player pent You're... Giving it back?
			shop It's way too valuable to sell, and I dunno if it has a limited amount of uses.<br>Plus, I really wanna see what you end up doing with it~
			player tired Well, I don't really need the power to stop time to do any of the things I want...<br>But I guess it could be kinda fun to play around with.
			special You can now use the Time Stopwatch at home!
		`},
		{index: "hole-identify", name: "Portal Onahole Identify Scene", image: "artifacts/hole2", tags: "", content: `
			shop sparkle Oho! And what do we have here?
			player happy I dug this up, any idea what it might be?
			shop happy No problem! Lemme take a look...
			im artifacts/hole2
			shop sparkle Ooh, an onahole! For me? Is it used? By you, I hope!
			player befuddled Huh? Wait, the hole on it looks different than it did a minute ago...
			shop curious Hmm? How s-
			im artifacts/hole3
			shop sparkle Whoooa~<br>It's changing shape! A morphing onahole? I wonder what kinda texture-
			shop forced HEEEE~!
			player shock Wah! Are you alright?
			shop excited Hehe~ Hehehe~<br>Looks like you found something special. I can't explain it, but this is definitely some kind of magic item~<br>Here~
			player curious Hmm? Does it do stuff to the holder?<br>This is a pretty plump anus...
			t *Poke* *Poke*
			shop perverted Mmmmh~!<br>F-figure it out yet? That's <i>my</i> butthole you're poking~!
			player shock Eh?! So this is...<br>Some kinda wormhole onahole?
			shop excited Hehe~ Definitely~<br>Take it home, have some fun with it~<br>It'll be neat to experiment with, I bet.
			player worried Hmm. I mean, I could just ask to have sex around here no problem, buuuut...
			player happy On the other hand, how can I say no to a magic toy? This seems like it could be fun!
			player pout Ah, but I'll need permission if I wanna use it on someone.<br>Don't want them trying to juggle anal sex with handling scissors or something.
			shop Hehe~<br>Well, I'm free for you anytime~
			special You can now use the Portal Onahole at home!
		`},
		{index: "pill-identify", name: "Denial Pills Identify Scene", image: "artifacts/pills2", tags: "", content: `
			shop sparkle Oho! And what do we have here?
			player happy I dug this up, any idea what it might be?
			shop happy No problem! Lemme take a look...
			t ...
			shop sparkle Ta-da~!
			im artifacts/pills2
			shop According to the label, this stuff is gel meant to be used for Super Denial Pills!<br>A special mixture that both blocks and supercharges sexual fluids at the same time!
			player worried What was this doing buried-
			shop smug There's no need to worry about that! Now, just one of these babies will have your balls rumbling, or have a girl's pussy drooling enough grool to fill a pool!
			player shock Eh? Why would someone want that?
			shop excited Ehehe, I thought you might ask that~
			im artifacts/pills3SEX
			shop I... Gh, took one just a few minutes ago! The effects are temporary, but it feels amazing!<br>And for you, it'll leave you in a state you're practically pissing precum until you spurt out a load big enough to make someone look pregnant!<br>Oh... Oh wow...<br>S-sorry, gotta close up shop for just a second... I have this knotted dildo and I reeeeally wanna see how it feels before this wears off~
			shop flirting Take the bottle home, but be sure not to take more than one.<br>Take one and come on back if you wanna have some fun together though~
			special You can now take Super Denial Pills at home!
		`},
		{index: "pill-random1", name: "Denial Pills Scene 1", image: "artifacts/pills/pill-random1-masc-light", tags: "", content: `
			player pent Hah... Good grief... It's like I'm trying to waddle around with a pair of bowling balls between my legs...<br>Feels like others are staring at me... They probably are... Ggh!
			im artifacts/pills/pill-random1-masc-light
			t A single involuntary flex causes a splurt of precum to paint the town streets. You feel the eyes of the townsfolk even more intensely, though there's still an eerie silence.
			player Even though there's people around, nobody's saying anything, like they're all transfixed...
			t It's becoming harder and harder to keep moving, you should find someone to help you soon!
		`},
		{index: "pill-random2", name: "Denial Pills Scene 2", image: "artifacts/pills/pill-random2-masc-light", tags: "", content: `
			player pent So... Heavy... Ghh~!
			t As your iron-hard (and heavy) set of orbs suddenly feels tighter and hotter, you think quickly and turn as you squat down on the side of the road.
			im artifacts/pills/pill-random2-masc-light
			t *SPLTTTTTT*
			t A line of cum, thick as braided rope, splutters out your cockhole and splashes into the running river below.
			player Hoh... Hoh...<br>S-sorry fishies... Hope supercharged cum isn't bad for the environment...
			t Despite a full shot of coiled cum into the water below...
			t *GURGLE*
			t You feel like the weight on your balls has only barely lifted. <b>You should find someone to help you soon!</b>
		`},
		{index: "pill-fail", name: "Denial Pills Scene 3", image: "artifacts/pills/pill-fail1-light", tags: "", content: `
			player pent So... Hot... So... Tired...
			im artifacts/pills/pill-fail1-light
			t Waddling bowlegged on your tippytoes barely feels like it's making any progress at all, but it's the only way you can get anywhere. Your hypersensitive elephant-sized nuts are full to the brim, any pressure on them and you're sure to blow!
			t *Drip* *Drip*
			player Hoh... Hoh... Sweat... Dripping
			t *Splttt* *Splsh*
			player forced Ggh! More... Precum!
			t You don't even need to look down. Despite both being sounds of fluid hitting the road beneath you, the volume makes it easy to tell the difference between them. And every turn of the breeze reminds you that your heavy balls are totally soaked with both fluids right now.
			im artifacts/pills/pill-fail2-masc-light
			player Ggghhh~! Can't... Hold out... Much... Longer!
			t It's no use. Needy urges are creeping up in the back of your mind. Your body, your balls, are telling you they <i>need</i> release.
			t So, without any other option, you force your shaky legs to stand, shifting away from your bowlegged pose to bring your knees together.
			im artifacts/pills/pill-fail3-light
			t Your thick, plush thighs, squish against your balls. The soft legmeat barely puts any pressure at all on your humongous orbs, but it's enough.
			player ahegao Ghouuuuuhhh~
			t You can feel your urethra dilating as you squeeze out all the precum you can all at once. Thick as jelly, you get the impression you're drawing a crowd, but your eyes are rolling up too high to see any of them.
			mayor shock Eh?! playerF?! What the...!
			carpenter confused Seems like they're masturbating in the middle of the plaza...<br>Were their balls always that big?
			im artifacts/pills/pill-fail4-light
			player perverted Ghhhhgg~<br>Need... To Cum...!
			t All fluid jetting from your cock slows, then sputters to a stop. You aren't <i>out</i> of pre cum per say, no, it's more something else is blocking your release.
			t Pulling your swimming vision back down to earth, you start trying to work your hands and thigh muscles to relieve your hyperproductive babymakers any way you can.
			im artifacts/pills/pill-fail5-light
			player orgasm GHOUUUUHHH~ OHHHHHH~<br>CUMMING~
			wolf shock E-ehhh?! Is that my darling? How did you get that backed up?! ?trustMin wolf 3;
			mesu shock Ho-ly crap...! Is that the human? ?trustMin mesu 3;
			t Slowly, slowly, torturously slowly you can feel each impossibly thick glob cum travel up your shaft. All the while you're feeling the neurons of orgasm firing.
			player forced Ghhggghh~! Too much, too much, way too much! needneedneed-Nghhhh~!
			im artifacts/pills/pill-fail6-light
			t *SPLLLLLLLLTTTTTT*
			t Rope after rope as thick as porridge finally splorts free as you begin to literally paint the town white.
			t Though you can't stop your hands, you probably don't even need them. Your balls are so stuffed they'd be <i>forcing</i> your cum out hands-free, and that's not even mentioning your thighs squeezing around your veiny hanging melons.
			mayor scared Oh God!
			nun love Oh, God~<3 ?trustMin nun 3;
			t The edges of your vision go dark as you squeeze out another fat load, and then another, each feeling runnier than the last. It's like you're squeezing the white out of your vision.
			player broken Ooh... Oh... Ohhhh...
			t Your body is drawing resources away from your voice and thinky parts, prioritizing getting as much of this hot sticky mess out of your body as it can. 
			t Thinky bits are shut-shut down-thinky are bits bits bits-
			t ...
			im locations/interiorShopkeep-Night
			player tired Mgggghhh...
			t It wasn't so much as 'blacking out' as it was your consciousness skipping, and all of a sudden you're laying on an uncomfortable cot in the general store.
			shop sparkle Heyyyyy~!<br>You're up! Good thing too, I was not looking forward to trying to carry you home.
			shop happy You might still feel sore, maybe a tiny bit groggy. You've been out for a few hours now.<br>Don't worry about the mess, a ton of people volunteered to clean it up.
			shop worried You took the pills, yeah?<br>Don't waste energy trying to talk. Eat some granola bars or something, my treat, and then focus on getting home and getting some rest, okay?<br>And next time, try taking a load off <i>before</i> you let your balls get that huge.
			shop excited And if you need a volunteer helper for next time... Ehehe~<3
		`},
		{index: "cherry-identify", name: "Star-Crossed Cherry Identify Scene", image: "artifacts/cherry2", tags: "", content: `
			define playerduo = dual sp1 player; sp2 player;
			player happy Behold, I've brought you a pair of dangly orbs!
			shop sparkle Oh boy!
			im artifacts/cherry2
			shop annoyed ... You'd better have a second, fatter, sweatier set of orbs you're about to lay on the counter.
			player amused Nope, just these weird cherries I found while digging in the woods.
			shop pent Man, what's a girl gotta do to use a pair of nuts as a facemask around here...<br>Okay, so large red cheeries, these are worth like, one mun.
			player worried Actually, they aren't cheeries, they're a fruit from outside of town called cherries.
			shop shock Wah! That means they could be an invasive species!<br>Oh man, mayorF was absolutely hounding me the last time something like this happened. Quick, eat the evidence!
			player panic W-wait, but these things are as big as my-
			shop angry No, open up! Don't be such a baby, I know humans lose their gag reflex if you're rough enough!
			t Obviously misinformed by her favorite porn comics, shopF takes the back of your head and tries her best impression at pushing a golfball down a garden hose. Obviously it goes as well as-
			t *POOF*
			t The moment your teeth sink into the fruit's flesh, it's like it vanishes, leaving behind a cloud of glittering smoke as you fall backwards onto your butt.
			shop scared ... Eh? Where'd it-
			shop love ... Oh?
			player pent Ugh, what happened?
			player tired Mrgh, I dunno. Did the whole thing vanish?
			shop excited Ehe, ehehe~<3
			player annoyed Geez, shopF, this is hardly the time for- Eh?
			player shock Wait, the other half of the cherry's regrown already! and- Hold on!
			eval writeBig("artifacts/cherry3", "player:+20-20-0.5#player:20-20-0.5#expression:surprised#")
			t You stare in stunned silence at an exact copy of yourself, all the while shopF giggles up a storm like her wildest dream has suddenly come true.
			t But, is it an evil doppelganger? A skinwalker? A brief moment of paranoia starts to set in, until-
			player shock Oh wait, I had a dream about this once!
			player joy And I came up with a password to tell if my clone was evil!<br>*Ahem*-<br>A clone of myself!
			playerduo sparkle Now neither of us will be virgins!
			player amused Whew, thank goodness!<br>Evil twin scenario avoided. Don't worry shopF, I now trust this *guy with my life. *He's me!
			player happy Yeah, this *guy's pretty cool too. *He's me too!<br>So, wait, that line doesn't actually sense, does it? Since we moved to Syrup Town-
			player confused Yeah. Or wait, since one of us just popped into existence, I guess one of us is a virgin, so-<br>Wah, shopF!
			im artifacts/cherry4SEX
			shop excited Not for long!
			t ...
			im artifacts/cherry5SEX
			player amused Alright, let's-
			player confused Wait, shopF?<br>Hold up, bud, I think she's out cold.
			player shock Really?! But... That took hardly any time at all!<br>I was actually starting to get worried the townsfolk would start outlasting me, but-<br>Wait... Could it be?
			player joy Definitely! This is...
			playerduo The power of friendship!
			player sparkle This is amazing! We can satisfy the townsfolk in barely any time at all!
			player And we'll have so much more free time for-<br>*Gasp*<br>We can do two-player jiggies now!
			playerduo High five!
			t *CLAP*
			t *POOF*
			player shock ... Eh?
			t The moment your hand clapped together with your partner in crime, they suddenly vanished in a cloud of glittering fog.
			player scared EH?!?!
			t It seems like any kind of rough physical contact causes your clone to disappear. 
			player crying Waaah! *He's gone...! My newest friend, my home-slice, my twin...!<br>It's not fair... The memories we made together... They weren't nearly enough...
			player worried *Sniff*<br>Oh, it hurts... I lost then, but...<br>But the only reason it hurts so much...<br>Is because it was real.
			player happy Oh well.<br>Oh, hey, the cherry's back!<br>Well, now that I know what it does, I'll take it back home with me.<br>Bye shopF, thanks for the help!
			special You can now use the Star-Crossed Cherry at home!
		`},
		{index: "tv-identify", name: "Tellyvision Identify Scene", image: "artifacts/tv2", tags: "", content: `
			carpenter sparkle Oooh, what's that?
			player tired You don't know what it is either? Guess I-
			im artifacts/tv2
			carpenter happy No, I mean, what's the model? Where'd you find this thing?<br>I thought I'd never see a real human tellyvision again...
			player joy You do recognize it! Can you get it working?<br>I found it buried just outside of town.
			carpenter curious Buried? Hm...<br>Hmm, these have been banned for a while now.<br>Well, "banned" is a bit of a strong word. Too many people were staying inside all day watching them, so our last mayor asked everyone to get rid of theirs.
			player tired I see...<br>Well, I don't wanna get in trouble...
			carpenter sleep It's fine, there's no official rule about it.<br>Plus, I won't tell anybody.<br>Here, you do the carrying, and I'll get it all set up for you.
			t ...
			t *CLICK*
			im artifacts/tv3
			carpenter happy Hehe, see?<br>It works just fine.
			player befuddled It's getting signal, just from these tiny antennae?<br>And is that a human?
			carpenter sleep Yeah. Maybe the antennae are really strong?<br>Actually, I think one of the things mayorF tried before inviting you to town was to broadcast some human station. Given the lady on screen is mating, I'd say...
			carpenter befuddled Huh? Why'd it cut away?
			player Those are called commercials. They used to be a lot shorter, but at some point they started overshadowing the shows completely.
			carpenter Commercials? Aren't those supposed to sell you things? But this is just abstract shapes wiggling around while the sound of-
			player sleep Of balloons rubbing together. Wow, that brings me back. I have no idea what that one is selling, but it was still airing when I left to live here.<br>See, commercials used to make sense, but people just started ignoring them, so the commercials tried getting weirder and weirder to get people's attention. Nobody really knows what they're advertising anymore.
			carpenter shock So... You get a few seconds of a random episode of a random show each day, before white noise nonsense plays for several hours?<br>Is that worth the muns?
			player sparkle Is it worth it?!
			carpenter worried ... Is it?
			player sleep Yeah.
			carpenter sleep ...<br>Well, it's your telly. Lemme drop by and watch it sometime, alright?<br>Did you know you burn less energy while watching the telly than sleeping?
			player surprise Oh! So that's why you know about the tellyvision!
			carpenter laughing Haha, yeah.<br>Though, wow, shows these days are kinda violent, huh?
			player worried A little. But you know what they say, "Something something, violence in movies, sex on the telly".
			carpenter sleep Well, maybe I'll hold off then.<br>I guess you can watch it if you start feeling homesick, or wanna see non-furry people for once.<br>Oh, and the bottom thingy is a recorder. So you can re-watch stuff that's already aired.
			special You can now watch tellyvision at home!
			carpenter worried Though, wait. That stuff mayorF broadcast was only over the radio...<br>And it was never rough stuff either, I think I remember shopF complaining about that...
			player confused Did you say something?
			carpenter sleep Hmm, no, nothing worth worrying about. I'll head home now. Bye~
		`},
		{index: "tv-telly-rooby1", name: "Futa Fight - Rooby Round 1", image: "artifacts/telly/rooby/1-3", tags: "dickgirl", requirements: "!vegetarian;", content: `
			eval defineRooby();
			t And now welcome back to...
			im artifacts/telly/rooby/0-0
			t The ONLY show on the air where we bring your FAVORITE stars, inject them with futafication chemicals, and have them fight to see who will be our star, and who will be our quickshot loser of the night!
			t Today, we present the first round of a brand new bracket! It's short, but you'd better believe it'll be sweet!
			atv That's right!
			im artifacts/telly/rooby/1-0
			atv Because tonight, the first round is also the semi-finals! We've skipped right to the good stuff!<br>Who's on our docket tonight?
			im artifacts/telly/rooby/1-1
			roobywhite P-please... <br>What is... Going on? How did we...
			t roobywhiteF here barely grew a dick at all! Her twiggy micropenis is barely the size of a finger, and her balls are average at best!
			atv But that's only in size, mind you! Those throbbing little eggs are practically begging to be abused, and they're begging the only way they know how!<br>By squirting watery precum the moment they get near a superior shaft!
			roobywhite It's... Gh... It's barely below average...!<br>Please, Ru-
			atv And in the other cornerrr~?
			im artifacts/telly/rooby/1-2
			roobyred Hoh, hohhhhh~! Gud, gud, head feels so good~!
			t roobyredF took to her new dick the way all women should, like an addict to crack!
			t Her shaft is absolutely massive, and constantly throbbing! Her oversized gonads are constantly pulsing with veins as thick as roobywhiteF's little twinkstick! A clear sign she was destined to be a fap-monkey from the moment she grew a cock!
			atv Goodness! With that <i>thing</i> attached to her hips, she'll never go back to normal! When we dump her back home her brain will be fried like a gooner egg!
			t Not only that, but her penis is extremely sensitive! And while her cock can't be beat in length, her refractory period is barely a few seconds long, and her cumloads are extra thick! All this means...
			roobyred Haaaah~! Penis, cock~! Feels so good~! I'm gonna... Gonna...!
			atv Oh no! Quick, start the match, she's gonna spurt right away!
			t <b>BEGIN!</b>
			im artifacts/telly/rooby/1-3
			roobyred Ghoooohhh~!
			roobywhite St-stop, please! You're babbling like... Nghggg~! Like a monkey in heat! Please, Ru-
			atv It's cock and cock, folks! It may seem unfair, roobyredF's could inpregnate any woman for sure, but her hair trigger is a huge liability in Futa Fight! <br>Not only that, but she's squirting a river of precum, and only bothering to focus on her own pleasure!<br>Still, will she manage to pummel roobywhiteF's wimpstick into an early ejaculation?!
			roobywhite Gghhhhggg~!
			roobyred NHHHOUUUUmmmmmminnggggg~!
			im artifacts/telly/rooby/1-4
			t <b>FINISH! Tonight's loser is: roobywhiteF!</b>
			atv Aww, what a shame, that beast of a cock was-<br>Eh? Huh?
			t On account of her pathetic stature, roobywhiteF switching from squirting precum to sputtering a thin, watery string of loser cum was completely invisible to the naked eye! But our sensors showed roobywhiteF reaching orgasm before roobyredF did!
			atv Incredible! It really was completely unnoticeable, especially compared to roobyredF's orgasm, which is currently caking roobywhiteF's face like a layer of frosting!
			roobywhite Whuh... Nghh... Why is... You monsters...<br>Please, snap out of-
			roobyred Aahhhaha~! Again, againnnn~!
			atv That's all for today's round! Join us tomorrow, to see who will be paired up against roobyredF's bitchbreaker in the finals, and who's battling roobywhiteF for bronze in the loser's bracket!
		`},
		{index: "tv-telly-rooby2", name: "Futa Fight - Rooby 2", image: "artifacts/telly/rooby/2-3", tags: "dickgirl", requirements: "!vegetarian; ?flag player tv-telly-rooby1;", content: `
			eval defineRooby();
			t And now welcome back to...
			im artifacts/telly/rooby/0-0
			t The ONLY show on the air where we bring your FAVORITE stars, inject them with futafication chemicals, and have them fight to see who will be our star, and who will be our quickshot loser of the night!
			t Today, we present the second round of a brand new bracket! It's short, but you'd better believe it'll be sweet!
			atv That's right!
			im artifacts/telly/rooby/1-0
			atv Because tonight, we finish off the semi-finals with our second round! Will this match be as fast as the first one?<br>Who's on our docket tonight?
			im artifacts/telly/rooby/2-1
			roobyblack What the hell?! It itches! It's itching so much! And why does it look like... Ghhg~!
			t It seems like those ears aren't just for show, roobyblackF's DNA isn't totally human! It was tough to adapt, but we pride ourselves on the fact that our futafication drugs reflect the target 100% perfectly!
			atv Ohoh, it's a feline type penis! Those barbs might be softer than they look, but they're absolutely perfect for sending a female into heat!<br>Not only that, but it's sure to develop masochism and humiliation fetishes in any woman lucky enough to get fucked by that animal cock!<br>But wait, why's <i>she</i> the itchy one!
			t That's because our chemical cocktail didn't just trigger dick growth, it awoke a rut behavior buried deep in her genetic code!<br>Take one look at those clenched-up, throbbing testicles and there's no doubt her body is burning up with a need to breed!<br>On the other hand...
			im artifacts/telly/rooby/2-2
			roobyyellow Hey, hey, calm down. 
			t roobyyellowF here grew a python that puts even her meaty biceps to shame!<br>Unfortunately for her, these new muscles of hers just won't seem to flex!
			atv Wow! She's still flaccid?<br>Buuut with my incredible hearing, I can hear those fat sperm factories of hers going to work!
			t That's right, she's stuck in a totally different kind of rut! Her balls and prostate are getting the green light 24/7, but her magnum schlong is asking for more stimulation than she, or her partner can give!<br>The result is that her slab of girlbeef is the softest part of her body, all it can do is squirt out all that excess prejizz her prostate won't stop producing!
			roobyyellow Listen, everything will be okay, we need to figure out where we are, and where the others-
			roobyblack It... Ngghh~! No it won't! My brain...! It's all going... Pink!
			roobyyellow Don't yell at me! You always-
			t <b>BEGIN!</b>
			im artifacts/telly/rooby/2-3
			roobyblack GHOUUHHH~! Breed, breed, breed, make the itching stop!
			atv And they're right at it!<br>I sense some pent-up aggression in those thrusts!<br>Ooh, I'm tingly inside just thinking about what those spines would do to me!
			roobyyellow Stop... Gh, stop thrusting! Those nubs on your penis are tickling me!
			t But roobyyellowF barely seems to notice!<br>And what's more, because her floppy dong's still soft, it's triggering roobyblackF even harder, making her think this soft, wet hole leads to a woman's womb!
			roobyblack Makeitstopmakeitstopmakeitstop~!<br>Mommyyy-!<br>P-please! I need it!
			roobyyellow Here...? Now?<br>Ugh, fine!
			atv roobyyellowF's the clear favorite, the deck's completely stacked in her favor!<br>Is there any hope at all for roobyblackF? Can she overcome this massive brick house of a futa? Can she even hold on another minute?! Maybe she's thinking of her mother to hold out-
			im artifacts/telly/rooby/2-4
			t <b>FINISH! Tonight's loser is: roobyblackF!</b>
			roobyblack Ghouuuhhhh-!
			atv Oh, a completely predictable outcome!<br>Aside from onahole splitting in half of course!
			roobyyellow Glad at least one of us got to feel good...<br>Why the hell did I end up with this useless thing?<br>And could you... Stop licking me?
			roobyblack Hah, hah... It's... Ahhh-!<br>Ah, it's not... It's getting worse!
			t Another quirk of her biology! To dissuade solving the rut via masturbation, her body forces her to breed by not giving her any satisfaction unless there's pressure on every barb and around her nubby cocktip at once!
			atv Of course! If she's actually balls-deep like her body wants her to be, a woman's womb would have no choice but to squeeze and smooch the tip of her dick!
			t Of course, in a pinch, another hole can suffice!<br>Anal, deepthroating, there are other ways to satisfy the rut, but they require an incredible amount of tightness!<br>Each failure gives zero satisfaction, in fact, they just trigger even more chemical releases and make the rut even more intense!
			atv Mmm, I'd love to find one of her species in a rut, make them force me to tighten up~
			roobyblack Hah, hah, hhhhhelp-!<br>I... I need! To...!
			roobyyellow Stop! Don't start thrusting again, didn't you hear them?!<br>If you cum again it'll get even worse!
			roobyblack Can't, ngh, stop! Crotch! Red hot! Head! Breaking!
			roobyyellow Ugh, fine! Just need to apply...<br>Stop, fucking, thrusting! Hold still or I can't help you!
			atv While those two try to figure a way out of their little spat, I'm happy to declare that roobyyellowF will be headed to the finals!<br>Meanwhile, our next episode will be the battle for the bronze! Who will be our biggest loser? Find out next time, you won't wanna miss it!
		`},
		{index: "tv-telly-rooby3", name: "Futa Fight - Rooby 3", image: "artifacts/telly/rooby/3-3", tags: "dickgirl", requirements: "!vegetarian; ?flag player tv-telly-rooby2;", content: `
			eval defineRooby();
			t And now welcome back to...
			im artifacts/telly/rooby/0-0
			t The ONLY show on the air where we bring your FAVORITE stars, inject them with futafication chemicals, and have them fight to see who will be our star, and who will be our quickshot loser of the night!
			t Today, we present the third round of a brand new bracket! It's short, but you'd better believe it'll be sweet!
			atv That's right!
			im artifacts/telly/rooby/3-0
			atv Because tonight we get to watch two losers claw their way towards the bronze medal!<br>We know them, we love them, tell us who's on the docket tonight!
			im artifacts/telly/rooby/3-1
			roobywhite -y are you l-looking at me like that?
			t After her humiliating defeat against their quickshot team leader, the weakest member of team ruh-wuhbee isn't one bit stronger!<br>Her piddly little dipstick is still as pathetic as ever, and the moment she saw her opponent it started squirting surrender, this may be a lightning round!
			atv "Ruh"... Huh, is that how it's pronounced?<br>Oh well, who cares! roobywhiteF is going to have to fight an uphill battle, does she have any chance at all of beating an opponent who actually has stamina?<br>Although, actually looking at her opponent...
			im artifacts/telly/rooby/3-2
			roobyblack Nee... Itch... Can't... Need... <br>Rape... White haired... Bitch...!
			t It looks like roobyyellowF completely failed to satisfy roobyblackF over here! And every failed attempt to satisfy the rut just made things worse!
			roobywhite Rut?! But I thought that was just some conspiracy!<br>Please, this isn't you! Snap out of it Bl-
			atv Oh, but it is! We've had to keep roobyblackF here stewing in a cage!<br>My oh my how much willpower it took me not to lick that kennel clean~<br>Err, thankfully, her body stopped trying to masturbate for relief. Unfortunately, her mind's totally cracked in the process, all her darkest desires have come tumbling out!
			roobyblack Rape... Need to... Gonna ruin... All for breeding~
			roobywhite Please! Stop, you're the one who convinced me that you all weren't just a bunch of a-animals and thugs!<br>You're more than some beas-
			t <b>BEGIN!</b>
			im artifacts/telly/rooby/3-3
			roobywhite Gyyah~! Stop, stop! Get off of-<br>Eeeee!
			atv Thank goodness we set that mental limiter!
			t That's right, we had to tweak roobyblackF's brain just a bit to force her to use the regulatory Futa Fight Onahole first.
			atv Of course! We aren't barbarians, a Futa Fight battle settled through anal rape would be completely unbalanced!
			roobywhite Gkkkkkkkhh~!?
			atv Oh, those spines must feel heavenly! Every time they rub up against those plump nuts I see her little pinky winky squirt!<br>Especially to a pair of super maso-testies like the one she's got, look! There's even some snot coming out of our prim princess's nose!
			roobywhite NGGGGGGG-G-GGGGHH-!<br>Plllllleeee-!
			roobyblack Hah, hah, YES! This is what you wanted!
			atv Is she talking to roobywhiteF? Or to her own throbstick?<br>We'll never know, but what's clear is that it seems like roobywhiteF's balls are feeling like a little patch of heaven themselves to roobyblackF's needy breeding meat!
			t Yes, it's anyone's match! And the stakes couldn't be higher.<br>When this round ends our alterations will wear off. If roobywhiteF loses this match, she'll be at the merch of a rutting animal until the finals are wrapped up!
			atv And believe me, if roobyblackF gets anywhere near that ass roobywhiteF will be completely <i>ruined</i>!<br>She'll spend the rest of her life buying more and more exotic dildos trying to scuff up her snatch, and-<br>Err, not that I would know from experience!
			roobywhite S-stop...! I... Ghh...!
			im artifacts/telly/rooby/3-4
			t <b>FINISH! Tonight's loser is: roobywhiteF!</b>
			roobywhite H-huh?! Ghh, what?! No, I didn't cum!
			atv Sorry roobywhiteF! According to our records, you did!<br>So, what was it? Was it the spines of roobyblackF's shaft rubbing up against your little maso-prick?<br>Or maybe it was your little punishment-glutton balls getting plap plap slapped by-
			roobywhite N-No! No one would c-cum from something like that!<br>This is rigged! You're cheating!<br>You <i>want</i> me to get pegged by-
			roobyblack Gh... Ghhh...!
			atv Sorry girly! Our sensors are never, ever wrong, and if they say there was sperm in that squirt, well, it doesn't matter if it was too weak and thin to do real sperm's job, you're still this tournament's biggest loser!<br>But lucky for you, seems like roobyblackF's coming to her senses!<br>Well, poor choice of words, I guess.
			roobyblack Breed! N-need... Breed! Rape... Filthy white-haired-
			roobywhite G-get your hands off of me, you filthy animal!<br>Keep that... Ghoo... No!
			atv Oh my! Well, while these two get very acquainted with how to get out of a rut, that's all the time we have for the night!<br>Stay tuned, and don't forget that our next round will be the grand finale!
		`},
		{index: "tv-telly-rooby4", name: "Futa Fight - Rooby 4", image: "artifacts/telly/rooby/4-3", tags: "dickgirl", requirements: "!vegetarian; ?flag player tv-telly-rooby3;", content: `
			eval defineRooby();
			t And now welcome back to...
			im artifacts/telly/rooby/1-0
			t The ONLY show on the air where we bring your FAVORITE stars, inject them with futafication chemicals, and have them fight to see who will be our star, and who will be our quickshot loser of the night!
			t Today, we present the final round of the night! It's short, but you'd better believe it'll be sweet!
			atv That's right!
			im artifacts/telly/rooby/3-0
			atv Because tonight we're stepping out of the loser's bracket and have a chance to see how real champions are born<br>We know them, we want to worship them, one more time, tell us who's on the docket tonight!
			im artifacts/telly/rooby/4-1
			roobyred Hohhhh~! Ghhh, guuuhhhnnna~!<br>Squirtinggg~!
			t Well, she barely made it through the first round, but this completely fuck-drunk girl's taken to her cock like a fish to water!
			atv Wowie! She must have spent every single moment since the last round jerking herself off!<br>God, those cum piles are so thick!<br>What are the chances she's drained her balls so dry she actually stands a chance this round?
			t Not great! In fact, the time between her cumspurts just keeps getting shorter and shorter! Given her opponent's predicament, her chances of winning are-
			roobyyellow Sis?
			im artifacts/telly/rooby/4-2
			atv Oh my goodness, what an upset! Our formerly permaflaccid favorite to win is fully erect!<br>She seems like she's seconds away from cumming herself, what happened?!
			roobyyellow So... Cute...
			t It seems like roobyyellowF's in full big sister mode! Seeing roobyredF goon herself stupid must have flipped a switch in her!
			atv Oh my! Well, quick girls, get into position! Sensors at the ready!<br>We may have a quick-draw finish tonight!
			t Onahole ready, and in place,
			roobyyellow Good girl, good girl~<br>I forgot how nice your smile looked~
			roobyred Ghoohhhh~!
			t <b>BE-</b>
			im artifacts/telly/rooby/4-3
			roobyred Ghummmmmingggg~!!!
			t <b>FINISH! Tonight's loser is: roobyredF!</b>
			atv Oh shit! I don't think we've ever had a round go that fast before!
			roobyyellow Hoh... I can feel... Gh... Throbbing alongside mine~
			t Yes indeed, it seems like roobyredF was already on the verge of splurting from the moment the round began! But delaying the match wouldn't have helped her, because-
			roobyred GHUMMINGGGGG~<3
			atv Holy cockaronie! Is that a second orgasm, or has the first one not stopped?!
			t It's impossible to say! Her prostate and testicles are producing so much girljizz she's already clogged up again by the time each rope spluts out her urethra!
			atv Well, at least we have a winner! So, tell me, roobyyellowF, as the first winner of Futa Fight, what kind of prize were you expecting?
			roobyyellow Shh, shh, it's okay. Big sis will help you~
			atv Er...<br>It seems her mind is elsewhere! Of course, it makes sense, she's got the fattest, heaviest nuts of all of today's contestants and she hasn't cum once, and-
			t *PLAP*
			roobyred GHOUUUHHH~!
			atv And-
			t *PLAP* *PLAP* *PLAP*
			roobyyellow Ffffuck~! You're so fucking tight~!
			atv AND SO, WE'LL BE HANDING OFF OUR DEFAULT PRIZE! TELL THEM WHAT THEY WON!
			t Congratulations to our champion! In lieu of another wish, we'll be sending you and your companions back to your original world, but you won't go empty-handed!
			t You'll be going back with all your new "equipment" fully intact, alongside special body modifications to ensure your bodies, especially your hearts and minds, can handle the increased loads!
			im artifacts/telly/rooby/4-4
			roobyyellow NGGGGHHHH~! CUMMINGGGG~!
			roobyred Hoh, houhhhh~<3
			atv I don't think they're listening... Well, I don't think either of them will actually care about the free "Futa Fight Fuck Anyone You Like" pass, now that they have each other.<br>Well, that's all the time we have for the night. Take care everyone, and stay tuned for the next time Futa Fight is back on the air!
		`},
		{index: "tv-telly-medCatgirl0", name: "Medicenter Stories - Catgirl Interview", image: "artifacts/telly/medicenter/catgirl-0-2", tags: "female, atw", requirements: "!carnivore;", content: `
			define catgirl = sp Daisy; im artifacts/telly/medicenter/catgirl0.png; altColor #DB9DA5;
			define liz = sp Liz; im artifacts/telly/liz.png; altColor #DCC8BC;
			t Today, a brand new episode of: Bitch Medicenter.
			im artifacts/telly/medicenter/catgirl-0-1
			t A grinning young woman is sitting on the bed. The first thing that grabs attention to her is her outfit. She's wearing a loose shirt cut just above the midriff, and only a thin strip of cloth hanging from the front of the shirt covers her privates. Her legs are bare, and the sides of her hips are visible showing no signs of any kind of underwear.
			t The second thing about her are her ears, large, poofy, and catlike in nature. Her grin is also notably sharper-looking than a normal person's.
			liz Okay, could you state your name and problem for the record?
			catgirl No problems here doc, I've never had a bodymod go south. My name's Daisy, and I'm just trying to spice things up for my newtoob channel. Hey, could I get a copy of this recording later?
			liz I don't see why not. May I...?
			t Liz reaches forwards towards Daisy's head. 
			catgirl Of course! 
			t Daisy leans her head down, allowing Liz to inspect her ears. Even the lightest touch is enough to get Daisy's right foot tapping on the floor.
			im artifacts/telly/medicenter/catgirl-0-2
			catgirl Aww yeah, that's the spot... 
			t Liz maintains a professional air as she meticulously examines Daisy, even as it's clear her patient could probably get off on the treatment.
			liz The ears are astounding, truly masterwork. 
			t Liz Softly blows on the thin fur, causing Daisy to let out a squeak. 
			liz Alright. Well Daisy, it's obvious you're very compatible with a wide range of bodymods. We could probably rebuild your entire body from the ground up and there'd be very little chance for rejection. So, what kind of 'spice' did you have in mind?
			catgirl You sure? I don't mind you taking a close look~<br>Well whatever. I don't really mind, honestly. So long as I'm still cute in the end. I kinda wanna start pulling more eyes to my channel though. 
			liz What kind of content do you cover? 
			catgirl The usual vlog stuff. Talking about my day, storytime stuff, sex toy demonstrations and reviews, I did a bunch of vids on fetish reviews but that fell apart when I got to cuck stuff. People are seriously divided on that stuff. 
			liz Well, we did have a civil war over it.<br>In any case maybe something trending then? We've got a premade shortstack archetype that's very popular with girls in your demographic, and 'unusual orifice penetration' has been on the rise on Spermhub. 
			catgirl You keep up with that kind of stuff? 
			liz Being educated on current trends is essential. Being a porn connoisseur is part of a bodymod physician's job description. Plus, the education pays off in the bedroom. 
			t To prove her point Liz reaches out to begin fondling Daisy's ears again. This time instead of a careful  examination it's a passionate groping, gently stroking and lightly tugging the fuzzy ears. 
			im artifacts/telly/medicenter/catgirl-0-3
			catgirl O-ooh~<br>Whatever you think is best then, miss~
			liz By the way, the seat's cover is disposable so there's no need to worry about getting it wet. 
		`},
		{index: "tv-telly-medCatgirl1a", name: "Medicenter Stories - Catgirl Treatment", image: "artifacts/telly/medicenter/catgirl-1a-5", tags: "female, atw", requirements: "!carnivore; ?flag player tv-telly-medCatgirl0;", content: `
			define catgirl = sp Daisy; im artifacts/telly/medicenter/catgirl0.png; altColor #DB9DA5;
			define cat = sp Daisy; im artifacts/telly/medicenter/catgirl0.png; altColor #DB9DA5;
			define liz = sp Liz; im artifacts/telly/liz.png; altColor #DCC8BC;
			t Last time, on Bitch Medicenter; Daisy the Catgirl is a popular online streamer notable for her love of body modifications, she sports two fully-function cat-ears and was hoping for additional modifications of the medicenter's choice to 'spice up' her streaming career...
			t We now return to Bitch Medicenter.
			t With a jolt Daisy awakens from what was a deep sleep. Some kind of bizarre, musty smell filling her brain and sending her body into overdrive. One of the many factors of her catgirl treatment she couldn't decide between being a side-effect or a benefit. But the sudden jolt up causes her face to bop up against the source of the smell, something spongey and very, very large.
			t Someone grunts as Daisy instinctively nuzzles against the meaty appendage, her brain working overdrive to identify it as an absolute beast of a horsecock before it focuses on less important matters, like where she is and how she got here. She's almost pulled out of her mental haze by the sound of a curtain drawing.
			im artifacts/telly/medicenter/catgirl-1a-1
			liz Good morning! Ah, I see you've become acquainted with your demonstration partner for today already.
			t Liz steps in to separate the mewling catgirl from the horsecock'd stud for a moment, giving Daisy a light slap on the face to bring her back to reality.
			cat W-wuzzah...
			liz Focus for just a moment please, I'd like to show you the results of the operation. This fine lady here is a volunteer who offered to help you realize your new body's full potential.
			cat New... Body...?
			t Liz steps back and Daisy takes a moment to look over herself. The first thing she notices is that she's smaller, at least a foot and a half shorter. The second thing she notices is how incredibly thick and soft her squishy thighs are. It's only after a few moments of delightful cooing and squeezing them that she realizes the same thing has happened to the rest of her body.
			liz We've basically transferred your height into thickness, I believe the proverbial term is 'shortstack'.
			im artifacts/telly/medicenter/catgirl-1a-2
			t Daisy continues to explore her delightfully soft new form, paying special attention to her absolute bombshell of an ass, before a familiar scent catches her nose and she's drooling from both ends onto the bed.
			t Liz sighs. The catgirl's self-exploration show has distracted the volunteer stud, and the growing reaction to that show has distracted the catgirl. A vicious cycle ensuring that Liz's opportunity to further explain is over.
			liz Fine, fine. At least stand over here. I'll explain as I demonstrate, hopefully at least some of it will get through to you.
			t Liz takes Daisy by the hand towards a ready bed. Standing at full height she's eye-level with the horsecock that's more than two-feet long and not even fully erect. While Daisy is distracted Liz kneels down to properly prepare the kitty for her play.
			t Daisy mewls as her asshole is suddenly spread well past it's old limits by a pair of soft hands, painlessly gaping at least three inches open as the cool air of the room plays havoc with her ability to form a line of thought.
			liz Oh my, this is actually quite fun. Your body's elasticity has been greatly improved. While your pussy is a bit too small for some of the more well-endowed out there, we've implemented a fun workaround by greatly simplifying and optimizing your digestive system.
			t Liz enjoys spreading and squishing Daisy's meaty hole for a moment until the very well-endowed stud watching the show can take no more. She steps forwards bumping her now very erect three-foot cock into the mewling girl's face, and grunts.
			t Liz picks up the mewling catgirl by her legs and Daisy's arms wrap around the physician's neck for support. Concern spikes through the catgirl's mind for the first time since she woke up as she feels the stud's cockhead press against her soft donut of a butthole.
			t Daisy's eyes bulge out as a massive surge of anal pleasure decimates her worries. As an experienced girl, she's had more than a fair share of anal fun, but nothing she's ever taken before could ever compare to the stud's yard-long horsecock.
			t Liz takes a step back to watch as the massive dick spears through Daisy, creating a very visible bulge in her abdomen. Daisy waits with bated breath and pleasured shuddering as she waits for the stud to bottom out, to feel the glorious tap of massive nuts against her bouncy asscheeks.
			im artifacts/telly/medicenter/catgirl-1a-3
			t And she waits. And waits. And as she waits the pleasure increases as the cock sinks yet deeper, now the bulge is in her chest and it's so large she could titfuck it.
			cat Oyugh god... How deep... Can it... ghhhhhoggh~
			t Daisy's ramblings are cut short as cloudy white drool from her mouth actually begins leaking more than her pussy is, before the bulge begins to travel up her throat. The stud grabs the cheeked-up kitty by the legs, letting gravity do the rest of the work.
			im artifacts/telly/medicenter/catgirl-1a-4
			t It's the absolute strangest sensation of her life, feeling like a reverse-deepthroat as she closes her mouth, only to feel the spongey head of horsedick press against the back of her lips. The extremely potent taste of pre-jizz fills her mouth for a moment, and with one shove she finally feels the tap of the stud's ballsack against her ass at the same time as the cockhead pushes past her lips and spews a rope of precum on her face.
			liz All the way through flawlessly, the technician has truly outdone themselves this time.
			t Daisy does her best to gurgle in response as Liz does her best to hoist the speared catgirl up off the massive horsecock, only to force her back down until the flared tip slides past her lips again in a bizarre display of spitroasting, and then repeats. Each time the head of the cock slides back down Daisy's throat far enough she can verbalize her pleasure in sloppy wet groans, and her cunt gushes every time she 'swallows' the cock's head, but Liz and the girl with the horsecock just ignore her like they ignore the growing pool of cunt-drool forming on the floor.
			t Finally it's clear the horsecocked girl is nearing her limits. She grabs onto Daisy's arms and pulls the human cocksock all the way down until the flared tip emerges from her lips again, the cock's urethra winking and shooting out another rope of precum that arcs into the air before splattering in Daisy's hair.
			liz Ah, she's too short, you're saying? Greedy girl, you've gotten too used to being balls deep in bigger girls. Fine, pull back a moment.
			t The stud whimpers and pulls back, allowing Daisy room to verbalize her pleasure again for just a moment until Liz leans forwards for a deep tongue kiss.
			t Her mind completely ravaged by being anally ruined by a three-foot horsecock, all Daisy can do is let her eyes roll back at the feeling of Liz's tongue molesting her own, especially as she can feel the bulge of the horsecock traveling up her neck again.
			im artifacts/telly/medicenter/catgirl-1a-5
			t Soon enough Daisy's jaw is being stretched wide again as her and Liz's mouths are no longer linked by interlocking tongue, but by a massive flared dick that's gone all the way through a catgirl shortstack only to have the head suckled by Liz.
			t Even for an experienced stud, Daisy's tight ass combined with an unconventional double-throatfuck is too much. The stud's balls tighten as a full load of thick sperm travels up her cock, causing a small yet very visible bulge to travel up Daisy's distended body. Daisy can feel the cumload as in goes up, up past her abdomen, up past her chest, and up her throat until she can feel the gout of sperm travel past her lips. Her thighs clench as the reality of how she's being used hits hard enough for her to cum while the stud's cock fires a round of grade-A jizz.
			t And yet unlike the ruined cocksock cumming on a stud's three-foot dick, Liz is the picture of grace as she dutifully swallows, even going so far as to continue to push herself deeper and mash her lips against Daisy's. As Daisy's vision begins to darken from a lack of air, Liz gently signals the stud with a soft tap on Daisy's distended stomach.
			t The stud pulls her still-cumming cock back, shuddering as it passes through two pairs of soft lips. One last load of cum fires forth, bulging out Daisy's cheeks before passing through her lips and being swallowed by Liz. Finally Daisy's vision goes black.
			t ...
			t Daisy wakes up a lot less violently than she expected, her eyelids gently fluttering open to see the ceiling of the resting room above her. A curtain is drawn open as Liz happily hums a strange tune, one hand rubbing a visibly distended stomach as the other holds a medical chart.
			t After a short checkup to ensure Daisy is in tip-top condition, she's discharged with a clean bill of health, a body that can only be described as short and stacked, and the earlier stud's phone number in case she ever needs a streaming partner.
		`},
		{index: "tv-telly-medCatgirl1b", name: "Medicenter Stories - Catgirl Followup", image: "artifacts/telly/medicenter/catgirl-1b-2", tags: "female, atw", requirements: "!carnivore; ?flag player tv-telly-medCatgirl1a;", content: `
			define catgirl = sp Daisy; im artifacts/telly/medicenter/catgirl0.png; altColor #DB9DA5;
			define cat = sp Daisy; im artifacts/telly/medicenter/catgirl0.png; altColor #DB9DA5;
			define liz = sp Liz; im artifacts/telly/liz.png; altColor #DCC8BC;
			t Last time, on Bitch Medicenter; Daisy the Catgirl underwent a full body-mod treatment, allowing for her shortstack form to be made compatible with All-The-Way-Through fucking. Today, we take a glimpse into how her life has since changed...
			t We now return to Bitch Medicenter.
			catgirl Hey hey my hunnies! Welcome back to a full body fuck stream special! Today we have a new member of the family!
			im artifacts/telly/medicenter/catgirl-1b-1
			t The stream starts and the chatbox flies by. Daisy looks excited, and reaches off the side of her bed to lift up a dildo larger than her torso, which she nuzzles affectionately.
			catgirl Ah~ First donation names it starting now!<br>'Dicky Dickboi'? That'll do. Everyone say hi to dicky!<br>'Acockalypse'? 'Peniscalibur'? 'Rectifier'? Pfft, 'The Government'? These are great guys, but now I need to buy more to use the names! Take responsibility, alright?<br>Now, gotta lube up!
			t She licks her lips and in a deliciously slow and deliberate motion she takes the thick head into her mouth and swallows down, down, down. 
			im artifacts/telly/medicenter/catgirl-1b-2
			t She stops every few inches, letting her body squirm for just a moment before continuing to swallow so deeply the dildo's head can clearly be seen travelling down her past her tummy.
			t Inch after inch vanishes until she scoots down so that her pert asshole is pointed right at the camera.
			t There's a single *glrk* as she pushes down even farther, and suddenly the tip of the dildo emerges from her ass to splatter the rim with lubricant.
			t It goes out, and back in, repeating as she lubes herself up by reverse-assfucking herself on camera.
			t She finally pulls off the toy with a long, loud slurping motion.
			catgirl Bwaah~!<br>For all you at home curious, the lube makes my ass taste like strawberries.
			t She wiggles her ass in front of the camera before readjusting herself, making kissing noises as the head bumps against her asshole.
			catgirl Mmm, this a good time to talk about the sponsor? No? Hehe, you guys are so spoiled~!<br>Good thing I am too~!
			im artifacts/telly/medicenter/catgirl-1b-3
			t Wasting no time Daisy slides down the pole, inches go by as her asshole swallows more and more plastic dickflesh.
			t When she reaches the halfway point she massages the large bulge in her upper-abdomen, cooing at the sensation of being so full, and then she pushes down to sink even deeper.
			im artifacts/telly/medicenter/catgirl-1b-4
			catgirl Omigawd, i'm so stuffed~!<nr>Bgghh... Hey, you guys wanna say hello again~?
			t She pushes down a few inches and leans towards the webcam. She opens her mouth and at the back of her throat the black cockhead can clearly be seen.
			t The stream goes crazy, and to cap off the moment Daisy pushes down a little further so that every detail of the reverse-deepthroat can clearly be seen until the rim bumps up against the back of her teeth. The audience is treated to quite the show as her tongue dances around in her mouth around the toy.
			t She swallows it back down, not gagging even once as she lifts her ass a few inches up.
			catgirl Oooh~! It tastes just as good from this end! I gotta thank that medicenter later!<br>Don't worry hunnies, I can breath just fine. You all ready for the main event?
			t The viewcount spiking even higher gives a good answer.
			im artifacts/telly/medicenter/catgirl-1b-5
			t She smiles and sits back down until the black cockhead pushes through her grin. Spitroasted from one end she rubs the saliva-coated head of the toy with one hand, and holds a small black remote in the other.
			t With a single click every facet of her being from her asshole to her perky lips begins to vibrate.
			t She spreads her legs to show her pussy's reaction to the vibration, the special camera able to pick up every last line of clear fluid being squirted out as her body is wrecked by the largest vibe toy she's ever used.
			t She gurgles something unintelligible as she clicks the remote again, and again, and again, each time the power of the vibrator intensifies and her gurgling squeals get higher pitched.
			t Tears stream down her face as her eyes roll back, the edges of her stretched-out mouth show she's smiling.
		`},
		{index: "tv-telly-medJunkie0", name: "Medicenter Stories - Junkie Interview", image: "artifacts/telly/medicenter/junkie-0-1", tags: "dickgirl", requirements: "!carnivore;", content: `
			define junkie = sp Jen; im artifacts/telly/medicenter/junkie0.png; altColor #87655C;
			define liz = sp Liz; im artifacts/telly/liz2.png; altColor #DCC8BC;
			t Today, a brand new episode of: Bitch Medicenter.
			t Playback begins, a brunette with a ponytail is sitting on a bed. She's got a fuzzy brown sweater and a dark red skirt on. 
			im artifacts/telly/medicenter/junkie-0-1
			t Notably, it looks like she's trying to smuggle apples in her top, and like she's trying to smuggle melons in her skirt. She looks nervous as Liz, the medicenter's physician takes a seat across from her.
			liz So, could you clearly state your name and your problem for the video here?
			t The brunette is distracted for a moment. Liz is wearing a modern physician's uniform; she's showing off a lot of cleavage and the skirt barely makes it down an inch of her thighs.
			im artifacts/telly/medicenter/junkie-0-2
			t It's not too crazy to think only a decade ago this style was called 'skimpy porno nurse', but now it's just professional fashion.
			junkie Yes. I'm Jennifer Holmes, everybody calls me Jen, and I've been a masturbation addict for about four years now. Lately it'll take me an hour or more to finish cumming, sometimes multiple times a day. I'll just keep going afterwards too.
			liz And my records show you tried to correct this at... Um...
			junkie General modshop. It's a local place.
			liz Eugh. Ah, sorry. And so...?
			junkie Well, it worked at first. The sensations from my cock were a lot less powerful, so I didn't want to masturbate as much. About a week passed and some woman next door was doing her public squirt show on her balcony, so I thought I'd jerk off, and...
			liz And...?
			junkie Well, it's a bit... Hard to describe...
			liz Feel free to demonstrate for the camera.
			junkie What. But I-
			t The interview recording fast-forwards, showing a blurred conversation until Jen agrees to disrobe and the video resumes.
			im artifacts/telly/medicenter/junkie-0-3
			junkie A-are you sure? This is a bit embarrassing... 
			t Jen is naked in the center of the room, her six-inch dick is standing erect, but much more noticeably her balls are hanging down to her knees, nearly the size of watermelons.
			liz Absolutely. Did you need some visual aid?
			t Liz leans forwards to emphasize her cleavage, but it seems like Jen was already barely holding back from jerking off on the spot. She grabs her shaft and starts jerking off, showing off her years of crankworking experience.
			liz Oh my, quite quickly~
			t Liz sighs appreciatively as Jen thrusts into her palm, her massive nuts swinging back and forth.
			im artifacts/telly/medicenter/junkie-0-4
			junkie I-I've been o-oooh-on edge for weeks now, it's getting harder to... To hold back. Ghhhh~! Cumming~!
			t Jen thrusts into her hand, slamming down and back up her balls visibly shift and look like they jerk up for a second...
			im artifacts/telly/medicenter/junkie-0-5
			t Before they seem to almost plump up, and Jen finishes without actually releasing any sperm.
			junkie Hah... And that's... That's the issue. Every time I finish a little bit faster, and my balls keep getting bigger, but I can't actually cum. I can't have children like this, I can barely go outsi-
			t Jen, distressed, is nearly on the verge of tears until Liz reaches out and embraces Jen in a hug.
			t Jen holds back a sob before she gets more into the hug a bit more that would be considered professional. She lowers her head into Liz's cleavage, desperately thrusting at the air for a moment causing her balls to swing back and forth. She says something to muffled for you to hear, before her balls shudder and plump up again.
			t Once she's finished 'cumming' Jen pushes herself away.
			junkie Hah... Hah... Even that was enough. I don't think I'll have long... I need your help, please. I'll pay you back, I pro-
			liz There's no need to worry. We have a wonderful technician on our side who can help you out. Since this is an emergency, I won't be able to explain our processes in detail.
			junkie That's fine! Please, just help me!
		`},
		{index: "tv-telly-medJunkie1a", name: "Medicenter Stories - Junkie Treatment", image: "artifacts/telly/medicenter/junkie-1a-1", tags: "dickgirl", requirements: "!carnivore; ?flag player tv-telly-medJunkie0;", content: `
			define junkie = sp Jen; im artifacts/telly/medicenter/junkie0.png; altColor #87655C;
			define liz = sp Liz; im artifacts/telly/liz2.png; altColor #DCC8BC;
			t Last time, on Bitch Medicenter; Jennifer Holmes was a certified Jerk-Off Junkie. After a botched job at an inferior bodymod clinic, she's unable to ejaculate, causing a slow buildup of semen to accumulate...
			t We now return to Bitch Medicenter.
			t Jen moans as she opens her eyes. The clinic is designed to be relaxing. The plain white tile ceiling, the soft light fixtures, the two-foot horsecock in Jen's peripheral vision...
			im artifacts/telly/medicenter/junkie-1a-1
			t Jen closes her eyes again and tries to wake up, but to no avail. She opens back up again to make sure she's awake, alive, and definitely the owner of the obsidian shaft of horsemeat.
			liz Good morning, you've been out for a while now. Sweet dreams?
			im artifacts/telly/medicenter/junkie-1a-2
			junkie I... I've got a horsecock.
			liz Yes you do. The damage to your genitalia was too severe, I'm afraid.
			t Normally that sort of news would devastate a woman, but a shaft like Jen's new one does a great job to mitigate that sort of loss. Her shaft throbs, new chemicals surging through her body, and a sense of power and size sweep over her.
			im artifacts/telly/medicenter/junkie-1a-3
			junkie It's so... Big. And just the air on it feels incredible...
			liz Yes. You're the proud owner of grade-A stallion meat from a top quality stud. Our technician is no slouch either, would you like to touch it?
			junkie But the price, I can't-
			im artifacts/telly/medicenter/junkie-1a-4
			t Jen's brain goes from grey matter to putty as Liz grasps the pillar of horse dick.
			liz The fact that we helped someone in need is more than enough to make up for it. Plus, Bitch Medicenter could always use the PR.
			junkie So good~!
			t Jen is no virgin to a handjob, not even close. Years of self conditioning have made jerking off more a habit than a joy, but this cock is brand new, untouched by a woman's hand.
			junkie Gonna... Fuck~!
			t Within moments Liz's stroking has summoned forth Jen's orgasm. Jen squirms like she's just discovered masturbation for the first time. Jen pants and squeals as her cock and balls work to push out the month-old backed-up load, filling the room with the scent of musky cock sludge.
			im artifacts/telly/medicenter/junkie-1a-5
			junkie Guh-Cumming~!
			liz Good, good, just relax and nut. We need to get out all that backed-up human sperm. We didn't do this completely pro-bono I'm afraid. Your new cock will be producing very valuable 'stud-juice', which is medicenter property.
			t Uncaring that she's effectively sold out the rights to her jizz, Jen thrusts into Liz's hand. With every spurt, the contents of her nutsack have less and less human DNA inside them. Just as she finishes cumming, she doesn't have time to rest. There's an audible gurgle from her nutsack and a pleasant fog fills Jen's head.
			liz Now, we'll be taking your new sperm auction off to ranchers, so be sure to come here regularly to be milked. You can impregnate women as well, not with your own DNA of course, but be sure to let us know if you do. We'll be keeping a close eye on anyone you impregnate with the medicenter's jizz... Hold on, are you even listening?
			im artifacts/telly/medicenter/junkie-1a-6
			junkie Fuck~! Fuck~! Wanna cum~!
			t Jen has completely tuned out everything aside from the feeling of the hand on her horsecock and the fat, gurgling nuts hanging below.
			liz Well, I suppose that's the right attitude. From the sounds of it your new balls have already begun production. Would you care for another handjob? Maybe my breasts? Oh, and we have quite the assorted array of onaholes, both the plastic and living variety.
		`},
		{index: "tv-telly-medJunkie1b", name: "Medicenter Stories - Junkie Followup", image: "artifacts/telly/medicenter/junkie-1b-7", tags: "dickgirl", requirements: "!vegetarian; ?flag player tv-telly-medJunkie1a;", content: `
			define junkie = sp Jen; im artifacts/telly/medicenter/junkie0.png; altColor #87655C;
			define liz = sp Liz; im artifacts/telly/liz2.png; altColor #DCC8BC;
			t Last time, on Bitch Medicenter; Jennifer Holmes underwent a costly procedure to have her penis replace with Grade-A stallion meat, but it came at the cost of signing away the right to her body's own sperm. Today, we take a glimpse into how her life has since changed...
			t We now return to Bitch Medicenter.
			im artifacts/telly/medicenter/junkie-1b-1
			t Jen groans as she slams her length balls-deep into the jizz extraction machine. From the outside it looks impersonal, a collection of tubes leading to a container of white glorpy fluid. Yet on the inside are hundreds of different types of textures and aphrodisiac lubricant designed solely for the purpose of allowing anyone with a dick to put aside conscious thought and spray cum as hard as possible. 
			t Jen pants, exhausted, as she leans against the machine for support. 
			junkie I can't... I'm done... 
			t Even with the top of the line design and chemical additives, seven loads is pushing the limit even for a virile stud. 
			t The entire room is nearly fogged over, the smell of sweat and cum is so thick in the air it's visible. 
			im artifacts/telly/medicenter/junkie-1b-2
			t Yet the head researcher Liz is unfazed.
			liz Very good then, give yourself a few more thrusts to make sure you've milked out every last drop. Now, I see you submitted a report asking that you be able to cum on your own time? 
			junkie Yeah... My friend found out about the treatment... She's a size queen, so she's been hounding me about my dick since then. 
			liz Hmm... Trying to factor in the going price on your average load, then accounting for how much your debt would increase... It's all a bit complicated. How about we simplify this. You meet a monthly quota and you can squirt away all you like on your own afterwards. Let's say four liters? 
			junkie That's... That's more than a gallon! Even if I'm saving up all month I can't... What happens if I can't meet the quota? 
			liz That's no problem at all! Here, let me see... Ah! 
			t Liz pulls out a number of tools. Whether they look terrifying or arousing enough to make you leak on sight is entirely subjective.
			im artifacts/telly/medicenter/junkie-1b-3
			liz Firstly we have a top of the line chastity cage, similar to the one we offered you before except this one has a design to constantly stimulate the head of your cock and a growing tube that will stimulate the inside of your urethra. Wearing this for a month often doubles output, although wearing it longer allows the tube to actually stimulate the contents of your nutsack directly and-
			junkie NO! No, no. Ever since my friend found out I need to hold myself back from cumming she's been relentlessly teasing me. If she finds out I'm wearing one of those...
			liz Ah, no problem then. We also have an onahole laced with several performance enhancing drugs. 
			im artifacts/telly/medicenter/junkie-1b-4
			t Liz holds up a remarkably realistic looking fleshlight. So realistic in fact that as Liz strokes the lips of the toy, it quivers slightly and leaks a clear line of fluid. On the side of the toy is the word "May". 
			junkie Is that... 
			liz Yes, top of the line. She volunteered for the treatment to pay off a load, law school is quite expensive these days I'm told. She's due to be turned back in a few weeks, but I'm sure you could convince her to stay your toy quite easily with that tool of yours. 
			junkie I don't... I heard people get addicted to those things... 
			liz Absolutely! Obviously you should only use them in moderation, but who wouldn't get addicted to a girl like this? Holding her in your hand, feeling her entire body wrapped around your cock, knowing the only thought she can even have is a desperate begging for you to pump her, inflate her like a jizz balloon and let every fiber of her being cum as hard as a human onahole can! Ah, I see you had another load in your after all. 
			im artifacts/telly/medicenter/junkie-1b-5
			t True to Liz's word, Jen has resumed slamming her meat into the extraction machine. Sweat drips down her face as her overworked balls gurgle to meet her need to cum.
			liz You know, maybe your 'limit' is more of a mental block than anything else. All these treatments honestly might not even work out for you. Increasing your cum generation would help, but it'd increase your debt as well. Maybe there's a sweet spot, but really you run the risk of enhancing yourself so far that you'll be spending every waking moment focused on your overproductive stud sack. There are over the counter supplements, but the ones that claim to trade brainpower for sexual output are a lot more effective than they let on. 
			t Liz kneels down. Jen is wantonly thrusting against the machine, her fat pair of inhumanly thick balls swinging in the air. Liz flips a switch on the machine, causing Jen to stop in surprise as, at the moment she's balls deep, the machine comes to life. Hundreds of small, soft nubs, a rhythmic pulsing, and a gentle suction activate to stimulate her foot-long horsecock. 
			t As Jen moans and her legs quiver, Liz gentle cradles one of her fat balls. 
			liz Maybe the best solution is the cheapest. You say your friend likes teasing, yes? Why not bring her over? If she were right here, dutifully worshipping your stud nuts and gently coaxing out your magnificent swimmers, maybe even slurping this pair down to clean them of this lovely-looking sheen of sweat, you would have no trouble at all meeting your quota, right? 
			im artifacts/telly/medicenter/junkie-1b-7
			t The thought pushes Jen over the edge, her balls tightening hard enough that the cradled nut is lifted from Liz's hand. She shatters her previous output record as a splortching sound fills the room louder than the whrrr of the extraction machine. 
			liz That's... Four and a half liters, fantastic! See? With only a month of abstinence and a top of the line semen-slurper machine you had no trouble at all meeting your quota. Feel free to splurt as much as you like for the month, so long as you can make next month's quota of course. Ah, and if you do see your friend please be sure to recommend our bodymod services as well. 
			t Jen just nods absentmindedly as she staggers back, her brain totally fried from six consecutive orgasms after holding back for so long. 
			im artifacts/telly/medicenter/junkie-1b-6
			t Despite her exhaustion though, it's clear having another session with the amazing machine is the only thing her mind. 
		`},
		{index: "tv-telly-cereal", name: "mini", image: "artifacts/telly/misc/cerealSEX", tags: "", requirements: "", content: `
			im artifacts/telly/misc/cerealSEX
			mayor sparkle -ow with marshmallow knots and cookie puffs in every box! And don't forget, you could be our lucky winner!
			player Oh hey, that's the commercial for the cereal contest I won!
			player sleep It sure was smart of mayorF to make a commercial that was actually clear about what it was selling.
			player worried ... I really hope she plans on taking that commercial off the air at some point. I don't really need a roommate.
		`},
		{index: "tv-telly-syrup", name: "mini", image: "artifacts/telly/misc/syrup2", tags: "", requirements: "", content: `
			carpenter happy Okay, it's on.
			im artifacts/telly/misc/syrup1
			shop blush H-hello and... W-welcome to, er-<br>I, we sell all the, umm-
			carpenter worried ... shopF?
			im artifacts/telly/misc/syrup2
			shop panic A-all the, err, uh... C-come on down to Ivy & Oak!<br>N-new h-hammer! Hammers! F-for digging! A-and...
			shop scared C-cut the camera! I can't...!
			carpenter worried Okay, it's off.<br>You alright?
			shop crying I don't know, I just totally froze up! And-<br>Is that light supposed to be on?
			carpenter shock ... Whoops!
			player befuddled Well, that was weird...<br>And even weirder, now I have this strange urge to go shopping...
		`},
		{index: "tv-telly-yogaV", name: "mini", image: "artifacts/telly/misc/yogaVeggie-1", tags: "female", requirements: "!carnivore;", content: `
			im artifacts/telly/misc/yogaVeggie-1
			t "That's it girls! Streeeetch~! And up!"
			t It seems like a clip from some home exercise program. Or it's porn.
			im artifacts/telly/misc/yogaVeggie-2
			t "Now get that booty shaking! And keep that pussy workin' while you're twerkin'! <br>Make that rump thump!"
			player tired ... Probably porn.
		`},
		{index: "tv-telly-gob", name: "mini", image: "artifacts/telly/misc/gob1", tags: "female", requirements: "!carnivore;", content: `
			define gobbin = sp Goblin Businesswoman; im artifacts/telly/misc/gob0.png; altColor #A6A568;
			im artifacts/telly/misc/gob1
			gobbin Attention all gamers! Fat cheeked shortstack goblin girls need YOUR help today! Inflation of goods has left shortstacks planetside without the basic necessities of survival!
			gobbin Every sixty seconds, a minute passes where a gobbo is left unfucked. You can help stop this. These tiny whores just need your parents credit card details, including the funny digits on the back!
			im artifacts/telly/misc/gob2
			gobbin But hurry quick, or these honest, cum-coated-collar workers will have to resort to lemon stealing to survive!
			player frown Man... I can't believe I ever fell for that one...
		`},
		{index: "tv-telly-yogaM", name: "mini", image: "artifacts/telly/misc/yogaMeat-1", tags: "male", requirements: "!vegetarian;", content: `
			im artifacts/telly/misc/yogaMeat-1
			t "That's it girls! Streeeeetch~! And up!"
			t It seems like a clip from some home exercise program. Or it's porn.
			im artifacts/telly/misc/yogaMeat-2
			t "Now get that ass bouncing! Every bit of flab is fab if you know how to work it!<br>Make those balls SHAKE!"
			t It's actually pretty tame compared to most of what's on air, it's probably not porn.
			player tired ... Probably.
		`},
		{index: "tv-telly-belles-rdz", name: "mini", image: "artifacts/telly/belles/rdz", tags: "", requirements: "", content: `
			define dered = sp Bel; im artifacts/telly/dered.png; altColor #B65F5E;
			define depale = sp Hel; im artifacts/telly/depale.png; altColor #E7E2E4;
			t And now welcome back to...
			im artifacts/telly/belles/belles1
			dered Right, so tonight's item is a near-mint copy of Rainy DayZ 2.
			im artifacts/telly/belles/rdz
			depale I heard the original owner gooned himself to death.<br>Goon death.
			dered Yes well, that is the goal of every title in the "post-apocalyptic dickgirl zombie genre".<br>Now, the first installment was an anthology series, yeah? How can this one claim to 'continue the story', exactly?
			depale Well, the first scenario directly continues off of the first scenario of the last game.<br>Granted, the only choice that carries over is whether or not the protagonist starts the route already infected.
			dered Incredible. So, they finally added a route where you play as an infected.<br>Well, one who can infect others, at least.
			depale ... Typhoid Mary? That was the whole mechanic behind scenario 6.
			dered Ah. I never played that one.
			depale The fuck you mean you didn't play it?!
			dered Aaaanyways, buyers, call in now, and make sure to use code <b>Rainy DayZ</b> for extra goodies.
			depale You played seven fucking hours of Parasite Infection, but you didn't play Typhoid Mary?
			dered Parasite infection had actual mechanics.
			depale I'll kill you!
			player confused Wow, I actually understood what they were advertising...<br>This must not be a local channel.
		`},
		{index: "tv-telly-belles-haa", name: "mini", image: "artifacts/telly/belles/haa1", tags: "", requirements: "", content: `
			define dered = sp Bel; im artifacts/telly/dered.png; altColor #B65F5E;
			define depale = sp Hel; im artifacts/telly/depale.png; altColor #E7E2E4;
			t And now welcome back to...
			im artifacts/telly/belles/belles1
			dered Oh boy. Do we have something special for you tonight, folks.<br>Tonight's item is a debug version of Human Alteration App, with a number of unfinished v1.3 scenes included in the data.
			im artifacts/telly/belles/haa1
			depale Including the much requested "Penis Inspection Day" scene. Which we'll be playing for you now.
			dered But before that, don't forget to use code <b>human alteration app</b> at checkout for some extra goodies!
			t "Penis Inspection Day" will air after these messages from our sponsors...
			player tired Aw man, more commercials? Who wants to wait through those? Not me!
		`},
		{index: "tv-telly-belles-av", name: "mini", image: "artifacts/telly/belles/av1", tags: "", requirements: "", content: `
			define dered = sp Bel; im artifacts/telly/dered.png; altColor #B65F5E;
			define depale = sp Hel; im artifacts/telly/depale.png; altColor #E7E2E4;
			t And now welcome back to...
			im artifacts/telly/belles/belles1
			dered Tonight, on our agenda, we have a copy of Anomaly Vault. The browser version, not the demake made for the Goonboy.
			im artifacts/telly/belles/av1
			depale A classic. Personally, my favorite was the time stopwatch, though I'd prefer to be the target rather than the user. <br>I love the idea of suddenly getting hit with all that pleasure out of nowhere.
			dered Plus, any guy who uses it on you can't tell the difference between the normal you and the version frozen in time.
			depale I'm actually going to kill you.
			dered I heard the game was based on a real company, actually. Though all the artifacts they were in charge of suddenly vanished one day.<br>Either way, if you're interested, use the code <b>Anomaly Vault</b> at checkout for some extra goodies.
			depale I'm going to use a hammer. I'm not joking, this isn't a bit.
			dered Well, so long as you don't wear the, err, lemme check my notes...<br>'Chaddicus Shades' while you do it!<br>... Who the fuck wrote this no-bitches no-paper ass script?
			depale You got a script?
			player confused It's nice to watch commercials that actually make sense for once, but these are kinda veering off topic at the end.
		`},
		{index: "tv-telly-belles-hu", name: "mini", image: "artifacts/telly/belles/hu1", tags: "", requirements: "", content: `
			define dered = sp Bel; im artifacts/telly/dered.png; altColor #B65F5E;
			define depale = sp Hel; im artifacts/telly/depale.png; altColor #E7E2E4;
			t And now welcome back to...
			im artifacts/telly/belles/belles1
			dered And tonight, we're tackling the classic playable documentary, Hentai University.
			im artifacts/telly/belles/hu1
			depale My favorite character was Gou, he was a huge inspiration to me, he's the reason I still consider myself a succubus.
			dered I still wish the technology existed at the time to let Lady Abba peg him.
			depale Absolutely fucking not, he's mine. I'm not sharing him with anyone.
			dered Err... Is that in the script?<br>Back on track, use code <b>Hentai University</b>-
			depale Seriously, what script? I'm given half a slice of cheese before we go live. We don't even eat cheese!
			dered ... I miss cheese. Semen's great and all, but...
			depale Yeah, don't get me wrong, I'll never turn down a fat cock, but I wish I could be a literal semen demon <i>and</i> enjoy my pudding cups...
			player tired Aww man, I finally find a series of commercials that seems to make sense, and they start worldbuilding about cheese...<br>If I had a mun for every time this happened...
		`},
		{index: "tv-telly-psa", name: "mini", image: "artifacts/telly/misc/psa1-1", tags: "female", requirements: "", content: `
			define psa = sp ???; im artifacts/telly/misc/psa.png; altColor #75508C;
			outfit mayor groovy
			im artifacts/telly/misc/psa1-1
			mayor worried -in your closet, who taught you how to use this kinda stuff?
			im artifacts/telly/misc/psa1-2
			psa You, alright?! I learned it by watching you!
			t This has been an anti-drug PSA funded by Syrup Town.
			mayor angry Remember kids, drugs are for dopes!
			player befuddled ... How long ago was that recorded?
			eval addFlag('mayor', 'groovy');
		`},
		{index: "tv-telly-sphere", name: "mini", image: "artifacts/telly/misc/sphere1-1", tags: "weird", requirements: "", content: `
			t Congratulations, you have been blessed by the Floating Butthole Sphere of Good Fortune.
			im artifacts/telly/misc/sphere1-1
			t Spherical blessings will come to you soon. A friend will reach out to you with good news soon, and expect a certain extra plumpness to your butthole today.<br>But only if you say "Thank you Floating Butthole Sphere of Good Fortune".
			player joy Thank you Floating Butthole Sphere of Good Fortune!
		`},
		{index: "tv-telly-gacha", name: "mini", image: "artifacts/telly/misc/gacha1-1", tags: "weird", requirements: "", content: `
			define elf = sp Elf Lady; im artifacts/telly/misc/gacha1-1.png; altColor #FCE6C7;
			elf special secret; You've journeyed far to reach this place... 
			im artifacts/telly/misc/gacha1-1
			elf But now you've finally arrived...
			player sparkle Ooh, a commercial I recognize! I've heard about this game, I think it's coming out soon!<br>Cool characters, an awesome setting-
			im artifacts/telly/misc/gacha1-2
			elf And now, spend your crystals on special loot boxes to-
			t *CLICK*
			player angry ... I think I'm done with TV today.
		`},
		{index: "tv-telly-egg", name: "mini", image: "artifacts/telly/misc/egg1", tags: "nutmeg", requirements: "", content: `
			define egg = sp Eggwoman; im artifacts/telly/misc/egg0.png; altColor #D87D59;
			im artifacts/telly/misc/egg1
			egg -king an announcement, Rouge the-
			player star Ooh, this one's a classic!
			egg -issed on my fucking husband! She said-
			player worried Oh, but every time I watch it I get sucked down the rabbit hole. I should probably turn this off if I want to be productive today.
			egg -I'm squirting on the moon! How do you like that, Obam-
			t *CLICK*
		`},
		{index: "tv-telly-squids", name: "mini", image: "artifacts/telly/misc/squids", tags: "female, nutmeg", requirements: "!carnivore;", content: `
			define marie = sp Left Squid; im artifacts/telly/misc/squid0.png; altColor #85467A;
			define callie = sp Right Squid; im artifacts/telly/misc/squid1.png; altColor #A0C073;
			im artifacts/telly/misc/squids
			marie Woomy~!
			callie Booya.
			player laughing Hahaha~! Oh man, those two always get me. Talking squid girls...
			player amused Man, imagine if squids were real. That'd be so cool.
		`},
		{index: "tv-telly-shrinkies", name: "mini", image: "artifacts/telly/misc/shrinkies1-1", tags: "dickgirl, nutmeg", requirements: "", content: `
			define liz = sp Liz; im artifacts/telly/liz.png; altColor #DCC8BC;
			liz Are you being held back by your oversized shaft?!
			player tired Not really, but since this is a commercial I feel like you'll continue the sales pitch anyways.
			im artifacts/telly/misc/shrinkies1-1
			liz Every day, millions struggle with their meaty, hanging shafts inconveniencing them every waking moment, but with new She-Cream brand Bitty Johnson Tackle Reduction Serum, you can finally be free!<br>Call today!
			player befuddled ...?
			player tired They didn't actually list their number.<br>That could've actually been an add for toothpaste for all I know.
		`},
		{index: "mimicPurple2", name: "Purple Mimic", image: "treasure/mystery/mimicPurple2", tags: "", requirements: "", content: `
			define mimicp = sp Purple Mimic; im treasure/mystery/mimicp.png; altColor #9386A5;
			player pout No way! I found this treasure chest fair and square!
			mimicp Geez, so childish.<br>Look, there's no treasure in here, it's just me.
			player worried ...
			player sparkle ...!
			mimicp ... The hell's with that look?
			t ...
			im treasure/mystery/mimicPurple2
			mimicp Ghhhlkkh, glhhhhk-<br><i>What the hell's this freak made of!<br>I was sure that... No one in town had...<br>A s... Sex drive...<br>Can't... Keep eyes open...</i>
			im treasure/mystery/mimicPurple3
			t *SPLTTTT*
			player pent Hoo... Hah...
			im treasure/mystery/mimicPurple4
			player worried ... Messy. I don't really wanna deal with the cleanup.<br>I guess you can have the chest after all.
			player joy Alright, back to digging!
		`},
		{index: "mimicBlue2", name: "Blue Mimic", image: "treasure/mystery/mimicBlue2", tags: "male", requirements: "", content: `
			define mimicb = sp Blue Mimic; im treasure/mystery/mimicb.png; altColor #7D9DBE;
			player angry A mimic! I know how to handle your kind!
			mimicb I was kind of in the middle of something!<br>Besides, there's no treasure in here!<br><i>Wait... A human?<br>Could *he be the source of the sudden rise in sexual energy around here?</i>
			player pout You can't trick me! 
			t ...
			im treasure/mystery/mimicBlue2
			mimicb Ouuuuohhhh~!<br>S-stop! I've been saving up this cumload for weeks!<br>I can't afford to... Ngh... Get addicted to splurting again...!
			player perverted N-no way!I've got zero combat ability, this is the only way I can beat the mimic and get the treasure!<br>Besides, I've already found your weak point!
			mimicb There's no treasure...! Gh...<br>And that's... My... Houuuh~!
			im treasure/mystery/mimicBlue3
			mimicb Hhhhhheee~<br>Thish... Feeling~<br>Amashing~<3
			player pent Hoo~! Alright, you seem defeated, let's see...
			im treasure/mystery/mimicBlue4
			player pout What the heck? There really is no treasure, just a bunch of cum...<br>I can't believe I got fooled like that!
			player joy Oh well, back to digging!
		`},
		{index: "mimicRed2", name: "Red Mimic", image: "treasure/mystery/mimicRed2", tags: "female", requirements: "", content: `
			define mimicr = sp Red Mimic; im treasure/mystery/mimicr.png; altColor #A14A4D;
			player angry Wait... "Gimme all your treasure"? You're not just a mimic, you're a thief!
			mimicr Hehe, what'll you do about it, hmm?
			player pout I'll teach you not to go around stealing things, you ne'er do-well!
			t ...
			im treasure/mystery/mimicRed2
			mimicr Hehehe~! "Slap slap slap"! I bet you're already addicted to sloppy titsex, huh?!<br>And a human too, I've hit the jackpot! A human servant, addicted to my boobpussy~!
			player pout ...!
			mimicr Hehehe~! Speeding up!<br><i>*He must be totally hooked! If this feels half as good for him as it does me, *his human brain must be totally melting by now, and my corruption is taking hold!</i>
			player forced Ghh...!
			mimicr Hehe~! That look, and your grip tightened, you're about to...!
			im treasure/mystery/mimicRed3
			player orgasm Hohhh~!!!
			mimicr Heeeee~<3!<br>Hah... Hehehe~<3<br>S-so, was that all? I bet even though you just came, I bet...
			im treasure/mystery/mimicRed4
			mimicr You're already hard again, hmm?
			player pent Hoo~! Nah, not really. You learn your lesson?
			mimicr Eh?
			player sleep Don't steal from other people, it's rude!<br>Now, I really wanna get back to digging.
			mimicr W-wait! But I can feel a tidal wave of desire within you!<br>Surely it's for these fat, heavy boobies of mine!<br>R-right?
			player pent Huh? Those aren't even close to the biggest or softest in town, they're B, maybe even C tier.<br>Plus, no fluffy tail, a mean spirit, you just sat there while I did all the work, and you live in a small box.<br>No thanks, I wanna get back to digging.
			mimicr ... Huh?
			player sleep Bye!
			mimicr W-wait! Come back! My nipples are suuuuper soft, and I can let you use my butt!<br>Ghh, damn this stupid box!<br>My boobies are not C-tier! Damn you, humaaaaaan!
		`},
		{index: "lurm1", name: "Lurm Scene 1", image: "misc/lurm0", tags: "weird", requirements: "", content: `
			define notesf = sp foxf; altName Curator's Notes;
			define notesm = sp foxm; altName Curator's Notes;
			player curious Alright, time for worm sex.<br>Let's see if the foxes left any notes for me first though...
			im misc/lurm0
			notesm Lurm, a species in the Wormb, or 'womb worm' family. Distinct from other Wormb species by its succulent and puffy purple lips.<br>They usually have a lifespan of about a few hours, searching for some large, dense food before they find some dark place to dissolve into a goop before metamorphasizing into more wormbs.<br>What species emerge from the goop depends on what they ate, the results vary based on what forms are the most efficient to getting more of that food. 
			notesf We made this breed by feeding several generations milk, so they'll suckle anything put near their mouth, and secretes jelly-like mix of an aphrodisiac and sweat-inducer.<br>They're pretty docile, and their entire body is built to collect and hold food, so it'd be impossible to overstuff one, and you can be as rough as you want!
			notesm Fuck and release one there will eventually be more species that are even more specialized at getting your cum.<br>Don't worry, we'll get rid of any dangerous types before they become a problem.
			player sleep Good to know! Now...
			im misc/lurm1-1
			player happy Wakey wakey~
			t Before you start, you get a tiny bit of its saliva just to test.
			player confused Hmm. Not very strong. I guess it'd make me a bit sweatier at least.<br>It's kinda like a very mild spicy taste, but on my skin.
			t Without any kind of eyes, its sluggish movement makes you think it's just waking up. Either that, or it's getting too hungry, so...
			player laugh Eat up~!
			im misc/lurm1-2
			player excited Ooh~<br>You really do suckle anything near your mouth~<br>Hehe, it tingles!
			t You thrust your cock into the creature, and it starts to squirm and bloat with the outline of your cock.
			t And when you pull back out, creates a surprisingly intense vacuum effect.
			t *SPLRTCH* *SQRTCH* *SPLRTCH*
			player pent Surprisingly sloppy-sounding... Nghhh~
			im misc/lurm1-3
			t Where before it was about the size of your head, the moment your cock squirts its first full load inside the creature is already almost as big as your head!
			player forced Ghh~! It's used to drinking milk, so maybe it doesn't understand why it's getting so little food?<br>You dont... Nggh, need to suck so hard!<br>Ah, a-already cumming...!
			t You can actually see the outline of each cumshot deforming the skin of the lurm, before the creature's body bloats and evens back out.
			t Your balls throb and despite its growing weight weighing the worm down, you still need to actively fight and push with all your meager might to fight against the supposedly 'docile' creature.
			im misc/lurm1-4
			player torogao Hwoooooah!
			t *SPLOP*
			t With one final tug your cock is released! The worm falls back onto your bed with a flop, not even a single drop of cum leaking out.
			player pent Hoo... That was...
			player forced Hiii! My penis is so warm!
			t Thankfully warmth and a bit of tingling is the only side effects of the worm's aphrodisiac. Although, you surprisingly don't feel sore at all, and when your balls throb again a line of precum spluts out with a little more force than before.
			player pent Hoh... That was fun, but I should probably get you out of here. Don't need you sucking me off again overnight. The notes said you couldn't burst, but I don't wanna risk it.
			t You pick up the fat worm by the tail, trying not to get distracted by the sloshing sound inside, and take it outside and leave it on the grass.
			player sleep Okay, be free wild worm! Go live in harmony with nature!
		`},
		{index: "fooba1", name: "Fooba Scene 1", image: "misc/fooba0", tags: "weird", requirements: "", content: `
			define notesf = sp foxf; altName Curator's Notes;
			define notesm = sp foxm; altName Curator's Notes;
			player curious Alright, time to pleasure myself with this fish.<br>Let's see if the foxes left any notes for me first though...
			im misc/fooba0
			notesm Fooba, a semi-amphibious fish. It's a saltwater fish that can survive for months at a time in freshwater sources and several hours outside of the water.<br>It stores saltwater in those sacs on its chest, though anything with a particularly high salt content will do.<br>Over generations they travel upstream searching for stagnant freshwater habitats, then becomes the dominant local species by introducing salt to them over long periods of time, killing off any competition.
			notesf It's extremely flexible, with its skin feeling more like rubber than scales.<br>That, combined with its unusually high body heat outside of the water, its instinctive drive to collect salt, and the fact it'll be self cleaning could make it an extremely popular sex toy!
			notesm And because of their strong drive to edge out other species, it's believed that Fooba are a divergent evolution of more humanoid marine creatures that try to steal breeding males of other species, like Merrow or Mermaids.
			player sleep Good to know! Now...
			im misc/fooba1-1
			player smug Hehe, you must be an extra healthy one, the boobs are so big they cover half your body!<br>So, you want salt, hmm? Well, I've always prided myself on being responsible with fish.
			player happy It's nice that you're so squishy too. It's kinda like touching sushi.<br>Alright, I should wash the sheets anyways, so onto the bed you go.
			t You toss the Fooba onto your bed, and though it flops and flails around it seems to calm down somewhat once you fish out your cock.<br>It might be because the species is so sensitive to salty things, or maybe your pheromones are having an effect on <i>all</i> the local wildlife, but you have the fish's full attention.
			player excited Ehehe~
			im misc/fooba1-2
			t Though you mostly just wanted the novelty of fish paizuri, the bodyheat and squishy texture really do make this feel like using a high quality sex toy.
			t The fish, of course, doesn't seem to mind as you hump it.
			player curious Hmm. Wait, how will it actually collect my sperm? It doesn't seem to be trying to lick or suck...<br>Where do I finish?
			player surprised Oh, wait! Right, they're stored in the breasts, so...
			t You pick up the fish, and after a careful bit of adjustment...
			im misc/fooba1-3
			player happy Hmm, it's actively loosening its breasts to collect my sperm! Cool!<br>Okay fishie...
			im misc/fooba1-4
			t Getting a firm grip you thrust like a madman, and now it starts flopping.
			player excited H-hoh, real titsex! Hoh, gonna!
			t After enough humping you let yourself rest balls-deep against the boobmeat, and the fish seems to relax.<br>Each contraction of your balls is a jet of sperm thick and strong enough to deform the shape of those heaving breasts for just a moment until they return to their normal shape.
			player afterglow Hehe, you like that...? Though, I should probably even them out...
			t ...
			t You decided to keep playing with the fish, though eventually you need to finish and decide what to do with it.
			player sleep Tossing it back into a the water somewhere should be fine. Good luck with making the world saltier, fishie~
			t Fin.
		`},
		{index: "assple-2", name: "Assple Pull Medium", image: "misc/fruit/assple-solo1-light-masc", tags: "weird", requirements: "", content: `
			player frown Alright, you've grown enough little fruit, time to come say hello to sunshine...!
			t You sit up a little and-
			player forced Eeeehp!
			player pent Okay, guess these things are putting more pressure on my prostate than I expected!
			player smug But I didn't get that monster fucker permit without being a little flexible~!
			im misc/fruit/assple-solo1-light-masc
			player seductive Mmmgh~ Having these things inside me for so long really has me on edge.<br>Shame nobody's around to watch, I bet a bunch of the townsfolk around here would enjoy the show~
			player excited W-well, without an audience to tease, there's no point in dragging things out, so... So...!
			im misc/fruit/assple-solo2-light-masc
			player torogao GNNNNHHHGGHH~!!!
			t Bead after softball-sized bead plop free, this game of anal-tug-of-war ends as explosively as you could have hoped.
			player broken Gghoohh... That was... Hohh... I came <i>ropes</i> right-
			player awe Ohhh, there's still... One...  Left! Ghhhg!
			t You spend the morning tugging and splurting until all the fruits of your labor are free and once they are it's time to start the day.
			player happy Ah, what a lovely way to wake up! Maybe I'll plant another.
		`},
		{index: "assple-3", name: "Assple Pull Large", image: "misc/fruit/assple-visitor2-light", tags: "weird", requirements: "", content: `
			player pent Mghhh... Hmn...?
			player forced Nghhh~!
			t The moment consciousness returns to you after what was probably a very lovely dream, you're buffeted by the incredible sensation like you're about to cum!
			player orgasm Ghhhouhhhh~<3
			player pent Ghhnn... Huh? It's not...
			player forced Nghhh! Why?! Why can't I... Cum?
			t Taking matters (and schlong) into your own hands, you quickly recoil as your penis is electric to the touch!
			player horny What's happening? Wait... The fruit! I... I can't...! Ghh!
			t ...
			shop tired Hmph. The cowards. <br>"Spooky noises, shopF!" "Ah can't keep mah knees from quakin'"! <br>Well, at least I have an excuse to visit playerF, no-
			t "Ghouhhhhhh!"
			shop scared Huh?! Oh fuck, fucking shitbiscuits, is it actually a g-gh-
			t "NHOUHHHHH~<3"
			shop befuddled W-wait... That's not the sounds of the ghastly wails of the damned, that's...
			shop sparkle O-face babbling! Sweet, delicious porn noises! I knew the human was holding out on me!
			shop seductive Mmm, and the door's unlocked too, don't~ Mind~ If I~ Dooo~
			shop perverted playerF~! I'm here to visit~! And what are we squirting to toda-
			im misc/fruit/assple-visitor1-light-masc
			player panic shopF! Thank goodness, help! It's stuck! A-and it's squishing my prostate so i can't cum, but my cum is-
			shop shock Ho-ly, look at the size of those melons! Err, assples, I mean.
			shop frown Don't you worry, bud. Ol shopF knows a thing or two about this <i>exact</i> situation. Don't bother trying to pull them yourself, the brain's natural instinct is to recoil from that kind of pleasure. The only thing... To do... Is...!
			player torogao Nghhh!
			im misc/fruit/assple-visitor2-light
			player orgasm GHOUHHHHHHHH~<3<3<3
			t With every bead pulled, what feels like a gallon of cum paints you, the bedsheets, some of the walls, and more than a little of your savior's face.
			t And by the time the last bead pops free, the whole world feels light and fluffy.
			player broken Th... Aghggouhhhhh~
			shop amused Ahuh... Anytime. It was no problem at...
			shop seductive Hmm...
			t After closing your eyes to let them rest for just a second, you're glad to see your little micro-nap wasn't so long that shopF left.
			player tired Mghh. Hey shopF. Thanks for the rescue.<br>Guess I bit off more than I could chew.<br>Hey, speaking of chewing-
			player confused ... Wait.<br>shopF, where's the fruit you just-
			player angry -Hey, what's that you got there?
			sp shopkeep; emotion annoyed; altName Suspiciously Anal-Bead-Shaped Catgirl; ... Nuhphin.<br>*Gulp*<br>N-nothing.
			player tired ... How did you just do that?
			shop joy I was actually a professional sword-swallower once!<br>And let's be real, you already knew I had no gag reflex.
			player tired ... Okay. Guess I had to repay you for coming-
			shop excited Ehehe~ Fuck yeah I did~
			player frown -To my rescue!
			shop seductive And I'd do it again, too~
		`},
		/*
		{index: "shell-male1", name: "Mollusk Scene 1", image: "misc/shell-male0", tags: "weird", requirements: "", content: `
			define notesf = sp foxf; altName Curator's Notes;
			define notesm = sp foxm; altName Curator's Notes;
			player curious Alright, time to fuck a mollusk.<br>Let's see if the foxes left any notes for me first though...
			im misc/shell-male0
			notesm The humble Onahole Mollusk. It has absolutely no method of locomotion, and is a simple creature that has no need to eat or reproduce.<br>Actually, we have no idea where they came from, but they're all buried alongside all that weird lewd treasure.
			notesf Their survival strategy, if you can call it that, is to just have a big, soft, squishy hole that can give off a variety of scents which try to mimic the sex pheromones of nearby species, encouraging them to mate with it instead of eat it. Just toss it out when you're finished and we'll take care of the cleanup!
			player sleep Good to know! Now...
		`},
		{index: "shell-female1", name: "Titsnail Scene 1", image: "misc/shell-female0", tags: "weird", requirements: "", content: `
			define notesf = sp foxf; altName Curator's Notes;
			define notesm = sp foxm; altName Curator's Notes;
			player curious Alright, time to fuck a mollusk.<br>Let's see if the foxes left any notes for me first though...
			im misc/shell-female0
			notesm The humble Titsnail. It's actually a mollusk. It hides its body behind a thick, durable shell, sticking out only a large pair of appendages which resemble breasts.<br>Actually, we have no idea where they came from, but they're all buried alongside all that weird lewd treasure.
			notesf Their survival strategy, if you can call it that, is to just hang out a pair of big ol' boobies and let anything that wants to mess with it take the easy meal, rather than try to break through that tough shell. Play around with it and feel free to be as rough as you please. Just toss it out when you're finished and we'll take care of the cleanup!
			player sleep Good to know! Now...
		`},
		*/
		{index: "ruinsHole", name: "Investigate the hole in the ruins wall", image: "misc/grotto/ruinsHole1-1-light", tags: "", requirements: "", content: `
			player happy ... Clearly, this thing must be investigated. Maybe it's a super useful stamina recovery hole!
			t ...
			eval stripPlayer();
			player orgasm Ghouhhhh~<3
			im misc/grotto/ruinsHole1-1-light
			t Whatever's on the other side reacted quickly and with great enthusiasm!
			player aftermath Ghummminggg~
			t There's still no indication of what's on the other side, except the occasional *SCHLRK* *SCHLRRRP* noises from behind the wall, and the extremely powerful vacuum succ it's giving you.
			im misc/grotto/ruinsHole1-2-light ?weird;
			player torogao Gotta... Pull-
			player shock Wah!
			t It seems that after getting one last cumshot whatever was on the other side decided your tugging was too much if a hassle to deal with.
			t Either way, you're free! But...
			player pent *Huff* ... That wasn't a stamina recovery hole at all...<br>More like a stamina <i>draining</i> hole...!<br>What a clever trap...
		`},
		{index: "ruinsSlimeBlueMeat", name: "A slime with a male form in the ruins", image: "misc/grotto/ruinsSlimeBlueMeat1-1-light", tags: "male", requirements: "", content: `
			player sleep Doot dee doot, exploring all the roo-ins, doot da dee dee da dee dum dum, explor-
			player shock Wah!
			im misc/grotto/ruinsSlimeBlueMeat1-1-light
			t Some sort of blue-ish goo-ish human-ish thing has you pinned down!
			player scared Gyah! A slimy creature, get it-
			player love -Oh, you smell a lot like blueberries...
			t It lets out some gooey gurgles, almost sounding like playful giggling. It slides around your body, actually pretty light, except it's got you stuck to the floor like glue!
			player blush But, uh, could you maybe get off?
			t It stops running its hands across your body and flashes an almost sinister grin before shifting position.
			player worried ... Why do I feel like you took that the wrong way? I meant I'd like for you to-
			im misc/grotto/ruinsSlimeBlueMeat1-2-light
			player forced Ghiiiii~
			t The slime atop you lets out even more bratty-sounding blurbly noises.
			t It relentlessly rides you, doubtlessly engaging in some sort of twisted form of fluid exchange.
			im misc/grotto/ruinsSlimeBlueMeat1-3-light
			t Though, it's not really clear why, since it seems to have lost just as much fluid as it's gaining.
			t Satisfied, it slides off of you and it's form starts to wobble and lose cohesion, until it looks like a very satiated ball of goo on the floor, white fluid floating inside it. 
		`},
		{index: "ruinsSlimeBlueVeggie", name: "A slime with a female form in the ruins", image: "misc/grotto/ruinsSlimeBlueVeggie1-1-light", tags: "female", requirements: "", content: `
			player sleep Doot dee doot, exploring all the roo-ins, doot da dee dee da dee dum dum, explor-
			player shock Wah!
			im misc/grotto/ruinsSlimeBlueVeggie1-1-light
			player scared Uh... Hello, goo person, nice to meet you?
			player love You, uh... You smell pretty nice, but... You don't need to get so close.
			t It lets out some gooey gurgles, almost sounding like playful giggling. It sits atop your body. The actual slime itself is pretty light, but there's so much of it!
			player blush Uh, could you maybe get off on me?
			t It stops running its hands across your body and flashes an almost sinister grin before shifting position.
			player panic Of! Get off of m-
			t Too late.
			im misc/grotto/ruinsSlimeBlueVeggie1-2-light
			player forced Ghiii~!
			t It relentlessly rides you, doubtlessly in some attempt to draw out your sexual fluids to build its bountiful mass even further!
			t It already has you dwarfed in size, yet it still clearly wants more. You feel something massage your balls just before they clench tight!
			im misc/grotto/ruinsSlimeBlueVeggie1-3-light
			player orgasm Hohhhh~!
			t Satisfied, it slides off of you and it's form starts to wobble and lose cohesion, until it looks like a very satiated ball of goo on the floor, white fluid floating inside it.
			t Smaller balls of goo seem to almost roll off of its surface, perhaps it's gained enough mass now to split apart into multiple other slimes.
		`},
		{index: "ruinsSlimeWhite", name: "Return to a well-fed slime in the ruins", image: "misc/grotto/ruinsSlimeWhite1-2-light", tags: "weird, nutmeg", requirements: "", content: `
			t Channeling the sort of degeneracy that earned you your monster fucker permit, you decide you'll have a bit of fun with the still-digesting slime before you.
			t Though, it isn't immediately clear how. It has a mouth, though it's more for show than anything, just a pair of lips really. 
			t Though... The whole body is semi-permeable, so...
			player smug <3
			t An idea suddenly striking you, you step up next to the slime's head.
			im misc/grotto/ruinsSlimeWhite1-2-light
			t And penetrate! Its gooey warblings sound half drunk, half delighted. Each noise it makes jiggles through its body, sort of like the entire body is a vibrating onahole.
			t Rather than push all the way forward and expose your cockhead to the cold air, you decide the best thing to do is to splurt directly down into the mass it's already digesting, so you angle your hips...
			im misc/grotto/ruinsSlimeWhite1-3-light
			t Backed-up sperm bubbles free of its imitation ear, mouth, and nose. The entire body shakes like jelly, looking like a human having a full-body orgasm, though in this case it's likely the slime losing the ability to maintain a humanoid form.
			t You let out a relaxed sigh, feeling more like you just relieved yourself than mated, and the slime wiggles and jiggles until its mostly-humanoid form is closer to the much more classic ball-type slime. 
		`},
		{index: "ruinsMimic", name: "Find the chest in the ruins", image: "misc/grotto/ruinsMimic1-1-light", tags: "", requirements: "", content: `
			player sparkle A treasure chest! Oh boy, I hope I find a-
			player scared Oh no-
			t *CHOMP*
			t ... Okay, well, actually, it was a softer, squishier sound. Probably closer to a *GLOMPH* or a *KRAHMPHHHSKWH*. Either way, the chest was a mimic!
			im misc/grotto/ruinsMimic1-1-light
			player orgasm Aaaa-ghhhhhlph~!!!
			t And yet, despite all its very threatening-teeth, it's actually just lined with a set of tentacles.
			player awe Mphhhh-?!
			t Lots of tentacles. Tentacles that seem very eager to explore your mouth.
			player orgasm MPHHHH~!
			eval writeBig("misc/grotto/ruinsMimic1-eBack", "player:4-+12-1.5#expression:orgasm#overlay:misc/grotto/ruinsMimic1-eFront#")
			player love <i>It's like it's... Kissing me?! All the way to my stomach!<br>My body... Feels so weird!
			im misc/grotto/ruinsMimic1-2-light
			player panic MPHHHH~?! ?atwt;
			im misc/grotto/ruinsMimic1-3-light; ?atwt;
			t As another orgasm, and something else too, overwhelms you, your vision goes dark.
			t ...
			eval stripPlayer();
			player sleep Urgg... Blech...<br>Thank goodness it let me go eventually...
			player tired I'll be sure to be a lot more careful and cautious around any other chests I see.
		`},
		{index: "forestJuice", name: "Drink the picnic basket's juicebox in the forest", image: "misc/grotto/forestJuice1-1-light", tags: "", requirements: "", content: `
			player tired Alright, I guess I am pretty thirsty.<br>Whoever owns this basket, I'm gonna drink your juice!
			t With no response, you've satisfied your social responsibility and can enjoy some juice guilt-free.
			player happy Hmm. No logo, no ingredients, there's a picture of a pair of apples at least.
			t There's a bunch of weird bumps on the side. If you could read braille, you'd know they spelt out "Juice that makes you Squirt" 
			player sleep But unfortunately, I can't read braille.<br>Oh well.<br>*Spspsp*<br>*Slrrrrrp*<br>*Slrrrrrrp*
			player amused Ah~ That was yummy. I feel more energ-
			player forced Eeep-!
			t You slurp up the yummy juice, you can't quite figure out the flavor.
			t Instantly though, your body senses that something is unusual. Everything suddenly feels hot!
			t Sweat suddenly pouring from your pores, you quickly toss your clothes aside. ?flag player originallyHadClothing;
			eval stripPlayer();
			im misc/grotto/forestJuice1-1-light
			player forced Oh boy, oh jeez, that just passed right through me in a weird w-
			im misc/grotto/forestJuice1-2-light
			player torogao -!!!
			im misc/grotto/forestJuice1-3-light-masc
			player broken !!!
			t Your mind goes completely blank, feeling like the entirety of your brain just fired out of your dick like a cannon.
			t ...
			t When you come to, it feels like you've been rolled over by a large heavy set of wheels.
			player tired Ugh... Well, I guess it was trapped after all. 
		`},
		{index: "forestSleepFairy", name: "The sleep-inducing tree with purple leaves", image: "misc/grotto/forestFairy1-1-light", tags: "nutmeg", requirements: "", content: `
			define fairy = sp fairy; altName Fairy; altColor #8CB29C; special secret; altImage images/misc/grotto/forestFairy0; 
			eval stripPlayer();
			fairy Ho-ly shit, a human?
			fairy Somebody left an unattended human in our garden!
			im misc/grotto/forestFairy1-1-light
			fairy A naked, well-hung human too! We hit the jackpot today, we get something better than nectar!
			fairy Oooh! *He's all rumbly! We are gonna get so fucked up tonight! I wanna try riding *him! I'm the biggest so I get first try!
			fairy Ahhhh~<3 *His sweat tastes... Amayshingggg~<3
			fairy You dummies! *He's too big... Ohhh~ *He does rumble... That's gotta be jizz being made, right?
			im misc/grotto/forestFairy1-2-light
			fairy It might fit! It'll fit, right? One of you, help me out!
			fairy Ahhh~<br> We should just bodyjob *him till these orbs give us what we want~
			fairy And we can play like we're preggy afterwards when we're stuffed full by hand in every hole~<3<br>Before you fuck yourself up on that rod, don't forget to have a levitation spell for when *he splurts~
			fairy Maybe a few healing spells too, to make sure we get enough for everyone~
			player sleep Mmm...
			t ...
			player tired Mrgggh... What happened?
			t You rub your head, feeling like you just tried to read a math textbook while practicing kegel exercises.
			player pent Why on earth do I feel so drained?<br>And is it just me, or is my body kinda... Sticky?
			player tired ... Oh well. Nothing for it.
			t As you stand up and try to wipe yourself off, you fail to notice the hidden cove enchanted by fey magic.
			im misc/grotto/forestFairy1-3
			fairy Ho-ly shiiiiit~<br>My whole body's buzzinggg~ 
		`},
		{index: "forestSpores", name: "Gaze upon a phallic mushroom in the forest", image: "misc/grotto/forestSpores1-2-light-masc", tags: "", requirements: "", content: `
			player awe Giant...
			im locations/grotto/forestSpores
			player Mushrooms! Wow!<br>And super phallic, like all good mushrooms should be.
			player annoyed Not like those lazy shelf mushrooms that leave all the hard work to other plants.<br>Or even worse, like stupid, dumb mold. I hate mold so much, just thinking about it ruins my day.
			player happy Anyways I should be super careful in here. Mushrooms usually spread through spores. Though they also need at least some kind of moisture, and I don't see where-
			t *FLUMPHSSSSHHHH*
			player shock Wah! Spores! A lovely shade of pink, but still, spores!
			player pent Or... Not? It's... Suddenly... All gone...<br>And wow, I actually feel pretty... Good?
			special You've regained a little bit of stamina!
			player pent I'm glad there... Ngh... Weren't any side effects... Think I... Might lay down... Feeling hot too...
			eval stripPlayer();
			im misc/grotto/forestSpores1-1-light
			special You've regained a little bit of stamina!
			player I should... Gh... Probably leave, but... For some reason I just wanna... Rest here...
			special You've regained a little bit of stamina!
			player Something... About this spot... Seems really cozy... Like I could just...<br>Stay here... Staring at the mushrooms...
			im misc/grotto/forestSpores1-2-light-masc
			t Your eyes glaze over as pink washes back over your vision, until you feel something pull you back.
			foxf special secret; Okay, deep breaths!
			foxm special secret; Clear out those lungs and get some fresh air!
			player panic Muh... Mushroom...
			foxf special secret; Counterpoint; Fluffy tail!
			player love ...!
			player perverted Uhiiiii~<3<3<3
			t ...
			t When you come to a bit later, you wake back up in the same room, but the air feels a lot clearer.
			player tired Mrgh... Guess I must have fainted from the spores. Good thing they're just gone, I guess.
			t Due to the spores effects, you were actually losing stamina the whole time.
			player sparkle Wait, but I remember... Just before passing out, I...!
		`},
		{index: "forestTentacles", name: "Tentacles which disguise themselves as grass", image: "misc/grotto/forestTentacles1-1-light", tags: "", requirements: "", content: `
			player Hmm.
			im locations/grotto/forestTentacles
			player Yeah, I probably shouldn't be going down here. Those are obviously molest-ey tentacles disguising themselves as grass.
			player worried Or, it actually <i>is</i> grass. Super weird, deformed grass that I want no part of.
			player tired I guess I should turn back, so that-<br>Wah!
			eval stripPlayer();
			eval stripPlayer();
			im misc/grotto/forestTentacles1-1-light
			player shock Eep! Oh no, the obvious ones were just a distraction! And gimme back my clothes! ?flag player originallyHadClothing;
			player forced Ghh... Ambushed by a brainless plant!
			im misc/grotto/forestTentacles1-2-light !urethral;
			im misc/grotto/forestTentacles1-2-urethral-light ?urethral;
			player forced Eep! It's... Travelling... Up my...! ?urethral;
			player annoyed If... You're expecting me to... Be an easy place to grow more tentacles...
			player torogao Then... You have... Another thing coming!
			im misc/grotto/forestTentacles1-3-light-masc
			t Overwhelmed by a sudden blast of salty fluid, the tentacle realizes it tried to swallow more than it could chew, and retreats.
			player pent Hoo... It was a risky maneuver, but it paid off. 
		`},
		{index: "sphinx1", name: "Sphinx", image: "misc/sphinx/sphinxTongue-3-light", tags: "", requirements: "", content: `
            define sphinx = sp sphinx; altName Sphinx; altImage locations/grotto/centralSphinx; altColor #EB6707;
			eval addFlag('player', 'sphinx1') !flag player gallery;
			player happy Wow, what a deal on this one! Here you go!
			sphinx Mmm. No. Not those coins this time. I want something else~<br>The fluffy ones can't contain their desire for your seed, I've decided I'll sample it.
			player worried Oh. Well, I could prepare some for you. Do you have a cup, and maybe a magazine around here somewhere?
			sphinx Mm. Amusing.<br>No, I intend on sampling it directly. And not a miniscule amount, either.
			player worried "Miniscule", by your standards, meaning-
			sphinx Do not fret. I have a number of magics capable of manipulating flesh. The size of the whole, or simply parts if the body.<br>Behold; gaze upon this~
			t Lamy's eyes flash red for a moment, and her cheeks suddenly bulge outwards. Pressure seems to build until she lets out a lewd sigh, and...
			im misc/sphinx/sphinxTongue-1
			player love Ooh...
			sphinx Hoh~? Does this capture your interest as you've captured mine?
			im misc/sphinx/sphinxTongue-2-light
			t Your fingers sink into the massive, squishy tongue as you begin to grind against it.
			sphinx Mmm. The taste of salt, pheromones in the air... It is not unpleasant.<br>But are you satisfied with such a pace?
			player squishy~
			sphinx I see, so I am the impatient one.<br>Well, since I am already indulging myself, I may as well go as far as I please~
			player shock Huh?!
			im misc/sphinx/sphinxTongue-3-light
			sphinx Ah, I see! This is it then? "Cum", as they called it?<br>Now this is much closer to the flavor I was expecting.
			player forced N-no, but... I'm gonna-
			sphinx Oh? I see.<br>Then show me.
			t Her eye flashes red again, more brightly this time as you can see the magic circle materialize upon her eye.
			t Suddenly, the room seems to change size. A powerful, throbbing pleasure spikes through you as you fall backwards, and you land on your butt a lot sooner than you expected.
			player pent Whaa-
			player torogao GHHHHHG-!
			im misc/sphinx/sphinxTongue-4-light
			sphinx My! Now <i>this</i> is certainly something. Somewhere between cream and slime, it's remarkable!<br>How much can you produce?
			player orgasm Ghouhhhh~!!!
			sphinx Hmm, overwhelmed, are you? I must admit, my usually limitless self-restraint is... <i>Buckling</i>.<br>As you aren't accustomed to my magic, I'll be sure to not go too far on this, our first of what I hope will be <i>many</i> dalliances together.<br>Mmm, however, I simply must have more of this. You can handle just one more spell, yes?
			player afterglow Guh- Stuhhh... Sensitive... Ghummingggggh-
			...
			sphinx Ahahaha~! Yes!
			im misc/sphinx/sphinxTongue-5-light
			sphinx More, <b>MORE</b>~! Oh, what a rush! My heart pounds, my stomaches fill yet I cannot be satisfied! <b>MORE</b>!
			player broken ...
			sphinx Ahaha~! Now is not the time for rest, human! More, more!
			t ...
			player sleep ...
			player scared Gyyyaaah!
			sphinx Hmm? Does your kind always awaken like that?
			player pent I... Ghouh... Was I asleep? 
			sphinx Indeed, I was quite enjoying your company until you suddenly decided to close your eyes and rest.
			player tired Oh, sorry... Man, what a dream that was.<br>You were there, and you could use magic, and... Things maybe got a little out of hand...
			sphinx Why, that doesn't sound like me at all. I am the very model of refined composure, you see.<br>Here is what you desired, by the way.
			player Thanks, I... Whoa, my legs are jelly...<br>What do I owe you?
			sphinx No, little one, you've already paid in full.<br>Now, what exactly was it you desired?
		`},
	]},
];

//Character encounter functions
function printEncounterButton(character, scene, text, top, left) {
	console.info("Now printing encounter button for "+character+" "+scene);
	var buttonSize = window.matchMedia('(orientation: portrait)').matches ? 50 : 30;
	switch (data.player.style) {
		default: {
			document.getElementsByClassName('playerRoom')[0].innerHTML += `
				<div class="pictureButton" onclick='writeScene("`+character+`", "`+scene+`")'
				style="top: `+top+`%; left: `+left+`%; max-width: `+buttonSize+`%;">`+text+`</div>
			`;
		}
	}
}

var dailyButtScene = {};
function printEncounterTab(name, scene, text, altImage, altName, altColor) {
	//console.info("TEST");
	var crown = "";
	var cancelTab = false;
	//Check the list of printed encounters to prevent duplicates
	for (encounterIndex = 0; encounterIndex < listOfPrintedEncounters.length; encounterIndex++) {
		if (listOfPrintedEncounters[encounterIndex] == name && name != "system" && scene.includes("Toggle") != true) {
			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!Repeat offender detected! "+name+" has already been printed!!!!!! See here: "+listOfPrintedEncounters);
			cancelTab = true;
		}
	}
	//Set name and image
	var cssName = name;
	//Generate full name and check for completion crown
	for (z = 0; z < data.story.length; z++) {
		if (data.story[z].index == name) {
			//Disable male characters in vegetarian mode
			if (data.player.vegetarian == true) {
				if (data.story[z].gender == "male") {
					cancelTab = true;
				}
			}
			//Disable female characters in carnivore mode
			if (data.player.carnivore == true) {
				if (data.story[z].gender == "female") {
					cancelTab = true;
				}
			}
			if (data.player.characterWhitelist.includes(data.story[z].index) == true) {
				cancelTab = false;
			}
			if (data.player.characterBlacklist.includes(data.story[z].index) == true) {
				cancelTab = true;
			}
			tabIndex = z;
			var cssColor = data.story[z].color;
			if (checkFlag(data.story[z].index, "complete") == true) {
				cssColor = "#FFFFFF";
				crown = "♔";
				altName = crown + " " + data.story[z].fName + " " + crown;
			}
			if (data.story[z].encounter == true) {
				cancelTab = true;
			}
			if (altColor != undefined) {
				cssColor = altColor;
			}
		}
	}
	if (name == "system" || name == "player") {
		var finalTarget = "system";
	}
	else {
		var finalTarget = data.story[tabIndex].index;
	}
	//If the player is on the map and the mega easy cheat isn't active
	if (checkTrust(name) == 0 && finalTarget != "system") {
		special = "secret";
	}
	else {
		special = null;
	}
	if (checkTrust(name) == 0 && data.player.location == "map" && checkFlag("mom", "megaEasy") == false) {
		cancelTab = true;
	}
	//Error checking
	if (altImage == undefined) {
		altImage = "";
	}
	if (altName == undefined) {
		altName = "";
	}
	if (altImage != "") {
		img = altImage;
	}
	else {
		img = "";
	}
	//console.log(tabIndex);
	//console.log(cssColor);

	//Wall selection code
	if (scene == "wallSelect") {
		console.error("Now printing wall selection for "+name);
		var legalNewEncounters = [];
		var legalOldEncounters = [];
		for (wallEventSuperIndex = 0; wallEventSuperIndex < globalEventArray.length; wallEventSuperIndex++) {
			for (wallEventIndex = 0; wallEventIndex < globalEventArray[wallEventSuperIndex].events.length; wallEventIndex++) {
				if (globalEventArray[wallEventSuperIndex].events[wallEventIndex].index.includes("Wall") || globalEventArray[wallEventSuperIndex].events[wallEventIndex].index.includes("wall")) {
					if (galleryCheck(globalEventArray[wallEventSuperIndex].index, globalEventArray[wallEventSuperIndex].events[wallEventIndex].index) == true) {
						if (globalEventArray[wallEventSuperIndex].events[wallEventIndex].requirements) {
							if (checkRequirements(globalEventArray[wallEventSuperIndex].events[wallEventIndex].requirements) == true) {
								legalOldEncounters.push(globalEventArray[wallEventSuperIndex].events[wallEventIndex]);
								legalOldEncounters[legalOldEncounters.length-1].character = globalEventArray[wallEventSuperIndex].index;
							}
						}
						else {
							legalOldEncounters.push(globalEventArray[wallEventSuperIndex].events[wallEventIndex]);
							legalOldEncounters[legalOldEncounters.length-1].character = globalEventArray[wallEventSuperIndex].index;
						}
					}
					else {
						if (globalEventArray[wallEventSuperIndex].events[wallEventIndex].requirements) {
							if (checkRequirements(globalEventArray[wallEventSuperIndex].events[wallEventIndex].requirements) == true) {
								legalNewEncounters.push(globalEventArray[wallEventSuperIndex].events[wallEventIndex]);
								legalNewEncounters[legalNewEncounters.length-1].character = globalEventArray[wallEventSuperIndex].index;
							}
						}
						else {
							legalNewEncounters.push(globalEventArray[wallEventSuperIndex].events[wallEventIndex]);
							legalNewEncounters[legalNewEncounters.length-1].character = globalEventArray[wallEventSuperIndex].index;
						}
					}
				}
			}
		}
		if (legalNewEncounters.length == 0) {
			for (wallEventIndex = 0; wallEventIndex < legalOldEncounters.length; wallEventIndex++) {
				if (dailyButtScene.character == undefined) {
					randomRepeat = Math.floor(Math.random() * legalOldEncounters.length);
					dailyButtScene = legalOldEncounters[randomRepeat];
				}
				name = "Wallbutt Alley - No New Scenes Left"
				finalTarget = dailyButtScene.character;
				scene = dailyButtScene.index;
				text = "<span style='line-height: var(--encounter-lh, 7);'>Visit the wallbutt wall again.</span>";
				img = cleanupImage(dailyButtScene.image);
			}
		}
		else {
			for (wallEventIndex = 0; wallEventIndex < legalNewEncounters.length; wallEventIndex++) {
				if (dailyButtScene.character == undefined) {
					randomRepeat = Math.floor(Math.random() * legalNewEncounters.length);
					dailyButtScene = legalNewEncounters[randomRepeat];
				}
				name = "Wallbutt Alley - New Scene!"
				finalTarget = dailyButtScene.character;
				scene = dailyButtScene.index;
				text = "<span style='line-height: var(--encounter-lh, 7);'>Check who's at the wall today.</span>";
				img = cleanupImage(dailyButtScene.image);
			}
		}
	}

	//If not cancelled, print the encounter via writeSpeech
	//console.debug("Printing "+name + scene+cancelTab+"!")
	if (cancelTab != true) {
		listOfPrintedEncounters.push(name);
		console.log("Now generating tab for " + name + ", linking to scene " + scene + " with the text " + text + " " +img);
		writeSpeech(name, img, `
			<p class="textContentSyrup switch" onclick="writeScene('`+finalTarget+`', '`+scene+`')">` + replaceCodenames(text) + `</p>
		`, altName, cssColor, special
		);
	}
}

function checkForEncounters() {
	//Partial sort global encounter array, moving any encounter.character = "system" to the end
	var systemEncounterArray = [];
	for (number = 0; number < globalEncounterArray.length; number++) {
		if (globalEncounterArray[number].character == "system") {
			systemEncounterArray.push(globalEncounterArray[number]);
			globalEncounterArray.splice(number, 1);
			number--;
		}
	}
	for (number = 0; number < systemEncounterArray.length; number++) {
		globalEncounterArray.push(systemEncounterArray[number]);
	}
	var finalChar = "";
	var finalScene = "";
	for (number = 0; number < globalEncounterArray.length; number++) {
		var finalLocation = "";
		var finalRequirements = globalEncounterArray[number].requirements;
		if (data.player.holiday == null) {
			data.player.holiday = "";
		}
		if (data.player.holiday != "" && finalRequirements.includes("?holiday "+data.player.holiday+";") == false) {
			finalRequirements += `?flag player god;`;
		}
		//console.info(globalEncounterArray);
		if (checkRequirements(finalRequirements) == true && encounteredCheck(globalEncounterArray[number].character) != true) {
			var encounterName = globalEncounterArray[number].name;
			if (globalEncounterArray[number].type == "button") {
				printEncounterButton(globalEncounterArray[number].character, globalEncounterArray[number].index, globalEncounterArray[number].name, globalEncounterArray[number].top, globalEncounterArray[number].left)
			}
			else if (globalEncounterArray[number].type == "tab" || globalEncounterArray[number].type == null || globalEncounterArray[number].type == "standard") {
				if (data.player.location == "map") {
					finalLocation = globalEncounterArray[number].requirements.split(`?location `).pop().split(`;`)[0];
					for (locationIndex = 0; locationIndex < locationArray.length; locationIndex++) {
						if (locationArray[locationIndex].index == finalLocation) {
							encounterName = locationArray[locationIndex].name + " - " + encounterName;
						}
					}
				}
				console.log("Printing encounter tab, character: "+globalEncounterArray[number].character+", index: "+globalEncounterArray[number].index+", name: "+encounterName+", altImage: "+globalEncounterArray[number].altImage+", altName: "+globalEncounterArray[number].altName);
				printEncounterTab(globalEncounterArray[number].character, globalEncounterArray[number].index, encounterName, globalEncounterArray[number].altImage, globalEncounterArray[number].altName);	
			}
			else if (globalEncounterArray[number].type == "walking" && walkingEncounterCooldown <= 0) {
				finalChar = globalEncounterArray[number].character;
				finalScene = globalEncounterArray[number].index;
			}
			console.log("Encounter detected");
		}
	}
}

function checkForWalkingEncounters() {
	var finalChar = "";
	var finalScene = "";
	for (number = 0; number < globalEncounterArray.length; number++) {
		var finalLocation = "";
		var finalRequirements = globalEncounterArray[number].requirements;
		if (data.player.holiday == null) {
			data.player.holiday = "";
		}
		if (data.player.holiday != "" && finalRequirements.includes("?holiday "+data.player.holiday+";") == false) {
			finalRequirements += `?flag player god;`;
		}
		//console.info(globalEncounterArray);
		if (checkRequirements(finalRequirements) == true && encounteredCheck(globalEncounterArray[number].character) != true) {
			var encounterName = globalEncounterArray[number].name;
			if (globalEncounterArray[number].type == "walking" && walkingEncounterCooldown <= 0) {
				finalChar = globalEncounterArray[number].character;
				finalScene = globalEncounterArray[number].index;
			}
			console.log("Encounter detected");
		}
	}
	if (finalChar != "") {
		writeScene(finalChar, finalScene);
		walkingEncounterCooldown = 5;
	}
	walkingEncounterCooldown -= 1;
}

function checkForMorningEvents() {
	//0. Initial cleanup
	if (checkFlag("shop", "busy") == true) {
		removeFlag("shop", "busy");
	}
	for (var number = 0; number < data.story.length; number++) { //start going through morning array and unencounter all cast
		data.story[number].encountered = false;
	}
	
	var morningEventsSelected =[];
	
	//1. Clean out morning log
	for (let i = data.player.morningLog.length - 1; i >= 0; i--) {
		if (data.player.morningLog[i][1] > 0) {
			data.player.morningLog[i][1] -= 1;
			if (data.player.morningLog[i][1] < 1) {
				data.player.morningLog.splice(i, 1);
			}
		}
	}
	
	//2. Comb through global morning array for potential options
	for (var number = 0; number < globalMorningArray.length; number++) { //start going through morning array and add to the potential options for a morning event
		if (checkRequirements(globalMorningArray[number].requirements) == true) {
			var addEvent = true;
			//A scene the player has already been shown once and for all. This used to sit inside
			//the morning log loop below, so on a morning with an empty log it was never asked at
			//all and a one-time scene could come round again.
			if (globalMorningArray[number].unique == true
				&& data.player.collected.includes(globalMorningArray[number].key)) {
				addEvent = false;
			}
			for (var i = 0; i < data.player.morningLog.length; i++) {
				//If the encounter is already in the morning log, don't add it
				if (data.player.morningLog[i][0] == globalMorningArray[number].index) {
				//Exception code to prevent characters with identical morning event indexes from blocking each other
					if (data.player.morningLog[i][0].includes(globalMorningArray[number].character) == true) {
						addEvent = false;
					}
				}
				if (data.player.morningLog[i][0] == globalMorningArray[number].character+"-"+globalMorningArray[number].index) {
					addEvent = false;
				}
			}
			if (addEvent == true) {
				morningEventsSelected.push(globalMorningArray[number]);
			}
		}
	}
	console.log(morningEventsSelected)
	
	//3. Select morning event
	var finalScene = "";
	var highestPriority = 0;
	if (morningEventsSelected.length > 0) {
		//Case 1: Priority of 40 or higher is present
        for (let number = 0; number < morningEventsSelected.length; number++) {
            if (morningEventsSelected[number].priority > 39 && morningEventsSelected[number].priority > highestPriority && data.player.collected.includes(morningEventsSelected[number].key) == false) {
                finalScene = morningEventsSelected[number];
                highestPriority = morningEventsSelected[number].priority;
            }
        }

        // Execute Case 1 if found
        if (finalScene !== "") {
			if (finalScene.unique == true) {
				data.player.collected += finalScene.key;
			}
            writeScene(finalScene.character, finalScene.index);
            unencounter(finalScene.character);
        }
		
		//Case 2: No super high priority scenes, select at random slightly weighted towards higher priority 
		if (finalScene == "") {
			for (var number = 40; number > 0; number--) {
				var eventTarget = morningEventsSelected[getRandomInt(morningEventsSelected.length)] //Select a morning event at random
				if (eventTarget.priority == null) {
					eventTarget.priority = 1;
				}
				if (eventTarget.priority >= number) {
					var rerollCount = 6-number;
					console.log("Randomly selected event final target: " +eventTarget.index+" on roll number # "+rerollCount)
					number = 0;
					var collectedMorningEvent = globalMorningArray.find(s => s.index === eventTarget.index);
					collectedMorningEvent.collected = true;

					if (eventTarget.unique == true) {
						data.player.collected += eventTarget.key;
						var charNameInEventTarget = false;
						for (var charNameCheckIfInEventTarget = 0; charNameCheckIfInEventTarget < data.story.length; charNameCheckIfInEventTarget++) {
							if (data.story[charNameCheckIfInEventTarget].index == eventTarget.character) {
								if (eventTarget.index.includes(data.story[charNameCheckIfInEventTarget].index) == true) {
									charNameInEventTarget = true;
								}
							}
						}
						if (charNameInEventTarget == false) {
							var varToPush = eventTarget.character + "-" + eventTarget.index;
						}
						else {
							var varToPush = eventTarget.index;
						}
						var logEntry = [varToPush, 0];
						data.player.morningLog.push(logEntry);
					}
					else {
						var logEntry = [eventTarget.index, getRandomInt(14)+28];
						data.player.morningLog.push(logEntry);
					}
					writeScene(eventTarget.character, eventTarget.index)
					unencounter(eventTarget.character);
				}
				else {
					console.log("Randomly selected event: " +eventTarget.index+", priority of "+eventTarget.priority+" too low, rerolling")
				}
			}
		}
	}
	else {
		writeScene("system", "newDay")
	}
	soundEffectStart("sleep");
	checkMailbox();
}

var mailboxFinalScene = "mailSelect";
function checkMailbox() {
	if (data.player.mailbox == null) {
		data.player.mailbox = [];
	};
	mailboxFinalScene = "mailSelect";
	for (mailArray = 0; mailArray < globalMailboxArray.length; mailArray++) {
		if (checkFlag("player", globalMailboxArray[mailArray].index) != true) {
			var newMailScene = true;
			for (mailRequirementIndex = 0; mailRequirementIndex < globalMailboxArray[mailArray].ignore.length; mailRequirementIndex++) {
				if (checkRequirements(globalMailboxArray[mailArray].ignore[mailRequirementIndex]) == true) {
					newMailScene = false;
				}
			}
			if (newMailScene == true) {
				mailboxFinalScene = globalMailboxArray[mailArray].index;
			}
		}
	}
	if (mailboxFinalScene != "mailSelect") {
		addFlag("player", "mailReady");
		writeHTML(`t You have unread mail!`);
	}
}

function openMailbox() {
	if (mailboxFinalScene != "mailSelect") {
		writeScene("system", mailboxFinalScene);
		addFlag("player", mailboxFinalScene);
		removeFlag("player", "mailReady");
		mailboxFinalScene = "mailSelect";
	}
	else {
		for (mailArray = 0; mailArray < globalMailboxArray.length; mailArray++) {
			if (checkFlag("player", globalMailboxArray[mailArray].index) == true) {
				writeHTML(`trans `+globalMailboxArray[mailArray].index+`; `+globalMailboxArray[mailArray].name);
			}
		}
		writeHTML(`finish`);
	}
}

function writeScene(characterIndex, sceneIndex) {

	if (sceneIndex == undefined) {
		sceneIndex = characterIndex;
		if (data.player.currentCharacter !== undefined) {
			characterIndex = data.player.currentCharacter;
		}
		else {
			data.player.currentCharacter = "system";
		}
	}
	else {
		data.player.currentCharacter = characterIndex;
	}
	gtransSwitch = false;
	if (sceneIndex == "house") {
		console.info("Generating house scene for "+characterIndex);
	}
	data.player.currentScene = sceneIndex;
	soundEffectStart("talk");
	document.getElementById('output').innerHTML = '';
	wrapper.scrollTop = 0;
	let character = globalSceneArray.find(s => s.index === characterIndex);
	if (!character) {
		return "character not found";
	}
	
	let characterSave = data.story.find(s => s.index === characterIndex);
	if (characterSave) {
		characterSave.encountered = true;
	}
	
	let scene = character.scenes.find(c => c.index === sceneIndex);
	if (!scene && sceneIndex != "House") {
		writeSpeech("player", "", "Error! You must've called the wrong scene. Error code: Failed to write scene ("+sceneIndex+") in "+characterIndex+".js");
		return "scene not found";
	}
	if (sceneIndex == "House") {
		generateHouse(characterIndex)
	}
	else {
		writeHTML(scene.content);
	}
	updateMenu();
	checkForAchievements();
}

function galleryEvent(characterIndex, eventIndex) {
	addFlag("player", "gallery")
	for (i = 0; i < data.story.length; i++) {
		data.story[i].emotion = data.story[i].emotionDefault;
		data.story[i].outfit = data.story[i].outfitDefault;
	}
	soundEffectStart("talk");
	wrapper.scrollTop = 0;
	data.player.currentCharacter = characterIndex;
	document.getElementById('output').innerHTML = '';
	writeEvent(characterIndex, eventIndex);
	if (gtransSwitch != true) {
		writeHTML(`
			button Back; writeScene('system', 'gallery');
		`);
	}
	else {
		gtransSwitch = false;
	}
	data.player.currentCharacter = "system";
}

function writeMini(characterIndex, eventIndex) {
	soundEffectStart("talk");
	wrapper.scrollTop = 0;
	data.player.currentCharacter = characterIndex;
	document.getElementById('output').innerHTML = '';
	writeEvent(characterIndex, eventIndex);
}

function writeEvent(characterIndex, eventIndex) {
	if (eventIndex == undefined) {
		eventIndex = characterIndex;
		if (data.player.currentCharacter !== undefined) {
			characterIndex = data.player.currentCharacter;
		}
		else {
			data.player.currentCharacter = "system";
		}
	}
	let character = globalEventArray.find(s => s.index === characterIndex);
	if (!character) {
		return "character not found";
	}
	
	let event = character.events.find(c => c.index === eventIndex);
	if (!event) {
		writeSpeech("player", "", "Error! You must've called the wrong event. Error code: Failed to write event ("+eventIndex+") in "+characterIndex+".js");
		return "event not found";
	}
	
	writeHTML(event.content);
	
	var newEvent = {character: characterIndex, index: eventIndex};
	for (i = 0; i < data.gallery.length; i++) {
		if (data.gallery[i].character == characterIndex && data.gallery[i].index == eventIndex) {
			newEvent.character = "";
			break;
		}
	}
	if (event.name != "mini") {
		if (newEvent.character != "" && checkFlag("player", "gallery") != true) {
			data.gallery.push(newEvent);
			if (event.name.includes("- Start") == false) {
				writeSpecial("You unlocked a new event in the gallery!");
			}
		}
	}
}
function unlockScene(character, index) {
	var unlockedScene = {character: character, index: index};
	for (i = 0; i < data.gallery.length; i++) {
		if (data.gallery[i].character == character && data.gallery[i].index == index) {
			unlockedScene.character = "";
			break;
		}
	}
	if (unlockedScene.character != "" && checkFlag("player", "gallery") != true) {
		console.debug("Unlocking scene: "+unlockedScene.character+" "+unlockedScene.index);
		data.gallery.push(unlockedScene);
	}
}

/*
function unlockScene(character, index) {
	var unlockedScene = {character: character, index: index};
	for (let i = 0; i < globalEventArray.length; i++) {
		if (globalEventArray[i].index == character) {
			unlockedScene.character = "";
			for (let j = 0; j < globalEventArray[i].events.length; j++) {
				if (globalEventArray[i].events[j].index == index) {
					unlockedScene.index = globalEventArray[i].events[j].index;
					break;
				}
			}
			break;
		}
	}
	if (unlockedScene.character != "" && checkFlag("player", "gallery") != true) {
		data.gallery.push(unlockedScene);
	}
}
*/

var roobyNames = [
	"Little Blue",
	"Princess",
	"Miss Catty",
	"Big Yellow"
]
var roobyTitles = [
	"Short Girl",
	"Princess",
	"Catgirl",
	"Blonde"
]

function defineRooby() {
	if (checkRequirements("?nutmeg;") == true && restoredNames) {
		roobyNames = restoredNames;
		roobyTitles = restoredNames;
	}
	writeHTML(`
		define roobyred = sp `+roobyTitles[0]+`; altImage artifacts/telly/rooby/rooby-red1; altColor #77303F;
		define roobywhite = sp `+roobyTitles[1]+`; altImage artifacts/telly/rooby/rooby-white1; altColor #ABC9E1;
		define roobyblack = sp `+roobyTitles[2]+`; altImage artifacts/telly/rooby/rooby-black1; altColor #644E80;
		define roobyyellow = sp `+roobyTitles[3]+`; altImage artifacts/telly/rooby/rooby-yellow1; altColor #E7BD7B;
		define atv = sp Futa Fight Narrator; altImage artifacts/telly/atv; altColor #E3B2C4;
	`);
}